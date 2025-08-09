export async function GET() {
  // Placeholder PDF. Replace `pdfUrl` with your actual hosted CV URL or move a PDF into /public and stream it.
  const pdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

  const res = await fetch(pdfUrl)
  if (!res.ok) {
    return new Response("Failed to fetch PDF", { status: 500 })
  }
  const arrayBuffer = await res.arrayBuffer()

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="MaiTanPhuc-CV.pdf"',
      "Cache-Control": "no-store",
    },
  })
}
