# Kế hoạch tracking: ai truy cập, xem gì, hỏi gì

> **Trạng thái: CHƯA LÀM.** Đây là bản thiết kế đã chốt hướng đi, còn 3 quyết định mở (mục 8).
> Cập nhật lần cuối: 2026-10-12. Số liệu giá/giới hạn ở mục 4 được kiểm tra ngày này, hãy kiểm tra lại trước khi dựa vào.
> Viết cho: phiên Claude Code mới tiếp tục việc này, và chủ repo (Mai Tan Phuc).

## 1. Mục tiêu
Biết được, miễn phí, bằng hạ tầng nhỏ tự quản (Neon Postgres + API route sẵn có của Next.js):
1. Có bao nhiêu người vào, từ đâu (nguồn, quốc gia, thiết bị).
2. Họ xem **mục nào** (7 cuộc trò chuyện trong sidebar), bấm **Download CV**, bấm liên hệ, phóng to ảnh dự án.
3. Họ **hỏi AI những gì**, AI trả lời hay từ chối.

Không có backend riêng: app đã có phần server (`src/app/api/chat/route.js`), chỉ thêm route và nối DB.

## 2. Bối cảnh dự án (đọc trước khi code)
- **Là gì**: portfolio của Mai Tan Phuc dạng chatbot kiểu Gemini. Next.js **15.5.27** (App Router), React 19, Tailwind v4, shadcn/ui, framer-motion. JavaScript (không TypeScript).
- **Repo**: `github.com/mtphuc253/cv_mtp`, nhánh `main`. **Hosting**: Vercel, project `cv-mtp`, URL `https://cv-mtp.vercel.app`, tự deploy mỗi lần push lên `main`. Gói **Hobby** (chỉ dùng phi thương mại, portfolio cá nhân là hợp lệ).
- **Next.js bị khóa ở ≥15.5.27**: Vercel chặn deploy các bản dính CVE-2025-66478. Đừng hạ phiên bản.
- **Biến môi trường hiện có**: `GEMINI_API_KEY` (bắt buộc), `GEMINI_MODEL` (tùy chọn). Local nằm trong `.env` ở thư mục gốc (được gitignore); trên Vercel đã cấu hình `GEMINI_API_KEY`. Lưu ý Next.js chỉ đọc `.env` ở thư mục gốc, **không** đọc `src/.env`.
- **Cách chat hoạt động**: `src/hooks/use-chat.js` giữ state các cuộc trò chuyện. 7 mục sidebar là hội thoại dựng sẵn (`src/data/topics.js`, nội dung ở `src/data/profile.js`, card ở `src/components/chat/topic-responses.jsx`). Khi người xem gõ câu hỏi, client gọi `POST /api/chat`, route này gọi Gemini (`src/lib/gemini.js`), stream chữ về. System prompt ở `src/lib/chat-prompt.js` chỉ cho trả lời về CV.
- **Chạy/kiểm tra**: `npm run dev`, `npm run lint`, `npm run build`. Trước khi push nên build sạch từ bản clone mới.
- **Quy ước**: chủ repo nhắn tiếng Việt, hãy trả lời tiếng Việt; code, tên file, commit message và chữ trên giao diện viết tiếng Anh. Commit theo kiểu `feat:`, `fix:`, `refactor:`. Chỉ commit/push khi được yêu cầu.
- **Link CV**: `profile.cvUrl` giờ trỏ tới `/MaiTanPhuc_Fullstack_Software_Engineer.pdf` trong `public/` (đã hết phụ thuộc Firebase). Khi CV đổi, thay file PDF và cập nhật `src/data/profile.js` cho khớp.

## 3. Theo dõi được gì, và không được gì
| Nhóm | Ghi được | Ghi chú |
|---|---|---|
| Lượt truy cập | thời gian, quốc gia/vùng/thành phố, loại thiết bị, trình duyệt, ngôn ngữ, `Referer`, tham số `?ref=` | Vị trí lấy từ header Vercel, không tốn phí |
| Hành vi | mở mục nào, bấm Download CV, bấm Call/Email/GitHub/LinkedIn/Facebook, phóng to ảnh dự án, thời gian ở lại | Gửi bằng `navigator.sendBeacon` |
| Chat | câu hỏi, câu trả lời, ngôn ngữ, kết quả (đã trả lời / từ chối / lỗi), độ trễ, chip gợi ý nào được bấm | Ghi sau khi stream xong, không làm chậm |
| **Không làm được** | danh tính thật (tên, công ty), theo dõi qua nhiều thiết bị, biết họ có đọc nội dung không | Chỉ ẩn danh |

Cách biết "ai": gắn link riêng cho từng nơi gửi CV, ví dụ `https://cv-mtp.vercel.app/?ref=congty-abc`; hoặc người xem tự viết trong câu chat.

## 4. Chi phí (kiểm tra 2026-10-12)
- **Neon Free**: $0, không cần thẻ, không hết hạn. 1 GB lưu trữ/project, 100 CU-giờ/tháng, tự ngủ sau 5 phút. Vượt giới hạn thì compute tạm dừng hoặc chặn ghi, **không xóa dữ liệu**. Ước lượng ~0.5 KB/dòng nên ~2 triệu dòng. Nguồn: https://neon.com/pricing
- **Vercel Hobby**: 1 triệu lần gọi function/tháng, log runtime chỉ giữ **1 giờ** (nên cần DB để có lịch sử), chỉ phi thương mại. Nguồn: https://vercel.com/docs/plans/hobby
- **Vercel Web Analytics (Hobby)**: 50.000 event/tháng, giữ 1 tháng, **không có custom event** (chỉ Pro) nên không đủ cho theo dõi theo mục. Nguồn: https://vercel.com/docs/analytics/limits-and-pricing

## 5. Kiến trúc đề xuất
```
Trình duyệt ──track(event)──▶ POST /api/track ──▶ Neon (events)
Trình duyệt ──chat──────────▶ POST /api/chat  ──▶ Gemini
                                   └─ after(): ghi (câu hỏi, câu trả lời, kết quả) ──▶ Neon (chat_logs)
```
- Dùng `@neondatabase/serverless` (driver HTTP, hợp với serverless) với **chuỗi kết nối pooled**. Biến mới: `DATABASE_URL`.
- Ghi log trong `/api/chat` bằng `after()` từ `next/server` (Next ≥15.1) để không chặn response. Cần gom text đầy đủ trong lúc stream (bọc `sseToTextStream` hoặc đếm ở wrapper).
- `/api/track` nhận JSON nhỏ `{ event, topic?, ref?, meta? }`; server tự thêm geo, thiết bị, mã băm khách.
- Mọi thao tác DB bọc `try/catch`: **DB lỗi thì bỏ qua log, không bao giờ làm hỏng trải nghiệm**.
- Client: một hàm `track(event, props)` dùng `sendBeacon`, đặt ở `src/lib/track.js`.

### Điểm gắn vào code hiện có
| Sự kiện | Gắn ở đâu |
|---|---|
| `page_view` (kèm `ref`, `utm_*`) | mount của `ChatApp` (`src/components/chat/chat-app.jsx`) |
| `topic_opened` | `openThread` trong `src/hooks/use-chat.js` (chỉ khi là mục dựng sẵn) |
| `suggestion_clicked` | `src/components/chat/chat-home.jsx` |
| `cv_download` | 3 chỗ: header (`chat-app.jsx`), nhóm Links (`chat-sidebar.jsx`), `ContactResponse` (`topic-responses.jsx`) |
| `contact_click` (phone/email/github/linkedin/facebook) | `topic-responses.jsx` (`PillLink`, `SocialLinks`) và `profile-menu.jsx` |
| `image_opened` | `setSelected(src)` trong `ProjectCard` (`topic-responses.jsx`) |
| `chat_question` / log hỏi-đáp | phía server trong `src/app/api/chat/route.js` |

## 6. Mô hình dữ liệu (SQL khởi tạo)
```sql
create table events (
  id          bigserial primary key,
  ts          timestamptz not null default now(),
  visitor     text not null,            -- hash xoay theo ngày, KHÔNG phải IP
  event       text not null,            -- allowlist, xem mục 7
  topic       text,
  ref         text,                     -- ?ref= đã làm sạch
  country     text, region text, city text,
  device      text, browser text, lang text,
  meta        jsonb
);
create index on events (ts desc);
create index on events (event, ts desc);

create table chat_logs (
  id          bigserial primary key,
  ts          timestamptz not null default now(),
  visitor     text not null,
  thread_id   text,
  question    text not null,
  answer      text,                     -- tùy quyết định 8.1
  outcome     text not null,            -- answered | refused | error | rate_limited
  lang        text, country text,
  model       text, latency_ms int
);
create index on chat_logs (ts desc);
```

## 7. Quyền riêng tư và chống lạm dụng (bắt buộc làm cùng lúc)
- **Không lưu IP thô.** `visitor = sha256(ngày + muối_bí_mật + IP + User-Agent)`, muối là env `TRACKING_SALT`. Đổi mỗi ngày nên đếm được khách trong ngày mà không cần cookie/`localStorage` (không cần banner đồng ý).
- **Thông báo công khai**: thêm câu vào `ComposerHint` (`src/components/chat/chat-composer.jsx`), ví dụ "Cuộc trò chuyện được ghi lại để cải thiện trang". Câu chat có thể chứa thông tin cá nhân (số điện thoại, email người xem tự gõ). Liên quan Nghị định 13/2023 (VN) và GDPR nếu có khách EU.
- **Hạn lưu**: xóa dữ liệu quá 90 ngày. Cách làm cần kiểm tra khi triển khai: Vercel Cron (xem giới hạn gói Hobby) hoặc xóa định kỳ thủ công bằng SQL trong Neon.
- **Chống spam `/api/track`** (endpoint công khai; nếu bị làm đầy 1 GB thì Neon chặn ghi): chỉ nhận `event` trong allowlist cố định; giới hạn kích thước body (~2 KB) và độ dài từng trường; `ref` chỉ nhận `[a-z0-9_-]{1,40}`; rate limit theo `visitor` (tương tự bộ giới hạn trong `route.js`, lưu ý nó chỉ là best-effort theo instance); bỏ qua bot theo User-Agent.
- **Geo**: header `x-vercel-ip-country`, `x-vercel-ip-country-region`, `x-vercel-ip-city` (thành phố bị URL-encode). Cần xác nhận lại tên header lúc làm (hoặc dùng `geolocation()` của `@vercel/functions`).

## 8. Quyết định còn mở (hỏi chủ repo, mặc định đề xuất)
1. **Có lưu câu trả lời của AI không?** Đề xuất: **có**, cắt tối đa ~2000 ký tự. Lưu cả hai để xem AI trả lời đúng hay lệch.
2. **Có làm trang `/admin` không?** Đề xuất: giai đoạn đầu **chỉ dùng SQL Editor của Neon** với các truy vấn lưu sẵn (mục 9). Nếu cần giao diện thì làm `/admin` bảo vệ bằng token trong env `ADMIN_TOKEN`.
3. **Có thông báo Telegram không?** Đề xuất: **tùy chọn, làm sau**, chỉ cho `chat_question` và `cv_download` (cần `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).

## 9. Truy vấn hữu ích sau khi có dữ liệu
```sql
-- khách mỗi ngày
select date_trunc('day', ts) d, count(distinct visitor) from events where event = 'page_view' group by 1 order by 1 desc;
-- mục nào được xem nhiều nhất
select topic, count(*) from events where event = 'topic_opened' group by 1 order by 2 desc;
-- CV được tải từ link nào
select coalesce(ref, '(không có)') ref, count(*) from events where event = 'cv_download' group by 1 order by 2 desc;
-- câu hỏi gần đây và kết quả
select ts, outcome, country, question from chat_logs order by ts desc limit 50;
-- tỉ lệ AI từ chối
select outcome, count(*) from chat_logs group by 1;
```

## 10. Các bước thực hiện (theo thứ tự)
1. **Chủ repo**: tạo project Neon (Free), lấy chuỗi kết nối **pooled**. Đặt `DATABASE_URL`, `TRACKING_SALT` (chuỗi ngẫu nhiên dài) vào `.env` **và** vào Vercel (Settings → Environment Variables, áp dụng Production + Preview). Có thể dùng tích hợp Neon trên Vercel Marketplace để tự đẩy biến, cần kiểm tra.
2. Chạy SQL ở mục 6 trong SQL Editor của Neon.
3. `npm install @neondatabase/serverless`.
4. Viết `src/lib/db.js` (kết nối + hàm `insertEvent`, `insertChatLog`, bọc lỗi), `src/lib/visitor.js` (băm khách, phân tích geo/thiết bị), `src/app/api/track/route.js` (kiểm tra + allowlist + rate limit).
5. Viết `src/lib/track.js` (client, `sendBeacon`) và gắn vào các điểm ở mục 5.
6. Sửa `src/app/api/chat/route.js`: đo độ trễ, gom câu trả lời, xác định `outcome` (từ chối = trùng `OFF_TOPIC_REPLY` hoặc phát hiện ngôn ngữ từ chối, cần chọn cách), ghi bằng `after()`.
7. Thêm câu thông báo vào `ComposerHint`.
8. (Tùy quyết định) `/admin`, Telegram, job xóa dữ liệu cũ.
9. Cập nhật `.env.example` (thêm `DATABASE_URL`, `TRACKING_SALT`, ...) và README.
10. Kiểm tra (xem dưới), build sạch, **hỏi chủ repo trước khi commit/push**, theo dõi trạng thái deploy.

### Cách kiểm tra
- `POST /api/track` với event lạ → bị từ chối; body quá lớn → bị từ chối; không có `DATABASE_URL` → app vẫn chạy bình thường, không lỗi cho người dùng.
- Mở từng mục, bấm CV, phóng to ảnh, gửi 1 câu hỏi hợp lệ và 1 câu ngoài chủ đề → thấy đủ dòng trong `events` và `chat_logs`, `outcome` đúng.
- Trong DB không có IP thô; hai ngày khác nhau cho `visitor` khác nhau.
- Mở `?ref=thu-nghiem` → `ref` được lưu đúng và đã làm sạch.
- Sau deploy, thử trên `https://cv-mtp.vercel.app` (không chỉ localhost).

## 11. Cách bắt đầu phiên mới
Mở phiên mới trong thư mục repo và nói, ví dụ:
> Đọc `docs/tracking-plan.md` rồi làm phần tracking. Mình chọn: lưu câu trả lời AI (có/không), `/admin` (có/không), Telegram (có/không). `DATABASE_URL` đã nằm trong `.env`.
