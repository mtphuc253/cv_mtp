// Single source of truth for the CV. The chat UI renders it as rich cards and
// the Gemini system prompt (src/lib/chat-prompt.js) is built from the same data.
// Content mirrors the PDF in public/ (MaiTanPhuc_Fullstack_Software_Engineer.pdf).

export const profile = {
  name: "Mai Tan Phuc",
  shortName: "Phuc",
  role: "Full-Stack Software Engineer",
  location: "Go Vap, Ho Chi Minh City",
  phone: "+84 903 020 347",
  phoneHref: "tel:+84903020347",
  email: "mtp20032003@gmail.com",
  avatar: "/avatar.webp",
  cvUrl: "/MaiTanPhuc_Fullstack_Software_Engineer.pdf",
  socials: {
    github: "https://github.com/mtphuc253",
    linkedin: "https://www.linkedin.com/in/tan-phuc-mai-653111309",
    facebook: "https://www.facebook.com/maitanphuc.724777/",
  },
  summary:
    "Full-Stack Software Engineer with 3 years of experience shipping web products end to end with Next.js, React, Node.js and Python. Works AI-first every day and builds AI-powered features with LLMs, agents and MCP.",
  frontend:
    "I build interfaces with React and Next.js in TypeScript, use TanStack Query, Zustand and Redux Toolkit for data and state, and Astro for content sites.",
  backend:
    "I build REST APIs with Node.js, Express.js and Python (Frappe), secure them with JWT, and store data in PostgreSQL, MongoDB and Redis.",
  ai: "I work AI-first every day: LLM APIs (OpenAI, Gemini, Claude), AI agents, MCP servers, prompt engineering and Claude Code.",
  maxim: "Fight for your dreams and your dreams will fight for you",
}

// An experience lists its bullets either flat (`description`) or under bold lead-in
// lines (`groups`). Use experienceGroups() to read either shape the same way.
//
// Optional extras shown on the card:
//   link    company website (also gives the "Visit" button)
//   images  screenshots of it: { src, alt, caption, width, height, url? } — `url` is only the label in
//           the browser frame (the company's domain when left out)
//   stats   headline numbers for a flat list; groups use their own `metric` instead, and become tabs
export const experiences = [
  {
    period: "SEP 2025 — PRESENT",
    title: "Software Engineer (Full-Stack, Data & AI Automation)",
    company: "Freshdi - Global B2B Marketplace",
    location: "Ho Chi Minh City, Vietnam",
    link: "https://freshdi.com/",
    images: [
      {
        src: "/companies/freshdi/marketplace-home.webp",
        alt: "Freshdi marketplace home page",
        caption: "Marketplace home",
        width: 1440,
        height: 700,
      },
      {
        src: "/companies/freshdi/buyer-products.webp",
        alt: "Freshdi buyer view: product search and suggested products",
        caption: "Buyer view: products",
        width: 1440,
        height: 700,
      },
      {
        src: "/companies/freshdi/supplier-buying-leads.webp",
        alt: "Freshdi supplier view: buying leads (RFQs)",
        caption: "Supplier view: buying leads",
        width: 1440,
        height: 700,
      },
      {
        src: "/companies/freshdi/blog-events.webp",
        alt: "Freshdi Blog and Events website",
        caption: "Blog & Events site",
        width: 1440,
        height: 700,
      },
    ],
    groups: [
      {
        metric: { value: "12x", label: "New users" },
        heading: "Built core product features end to end for suppliers and buyers, driving 12x growth in new users:",
        bullets: [
          "Sign-up, account verification and business-document verification flows, plus quick posting of quotation requests and products.",
          "Chat for inquiries and quotations, business trust scores, membership plans and payments.",
          "A supplier overview page with Free and Paid versions, showing store performance, to-do actions and buyers waiting for a reply, tuned for phones.",
          "Integrated legal consent into dozens of screens, a Google Analytics 4 event system with UTM tagging to measure the sign-up and upgrade funnel, and a trilingual UI (English, Vietnamese, Chinese) with auto-translation scripts.",
        ],
      },
      {
        metric: { value: "17", label: "MCP tools" },
        heading: "Worked AI-first every day and built AI-powered product features:",
        bullets: [
          "Used Claude across prototyping, debugging and shipping: wrote 8 internal AI guides so AI generates code that follows team standards, and used Claude Design to mock up demo UIs so BAs could settle ideas quickly.",
          "AI agents that auto-reply to buyers in chat (quotations, supplier questions, follow-ups) and review suppliers, plus 2 MCP servers (public and internal, 17 tools) that let AI assistants work with product, quotation and market data, with role-based access and audit logging.",
          "A Claude-driven agent controls a browser to crawl LinkedIn groups, request to join, connect and message matching suppliers, with a rule-based and LLM guardrail layer.",
          "Used an LLM to grade quotation requests and product listings into 4 quality tiers, passing only the top tier into automated posting.",
        ],
      },
      {
        metric: { value: "5x", label: "Marketing productivity" },
        heading: "Automated content creation, boosting Marketing productivity 5x:",
        bullets: [
          "Built a blog pipeline on SEO templates: an LLM writes and paraphrases articles, adds images and real supplier, quotation and market data, and posts to WordPress on a schedule.",
          "Built a social pipeline that turns quotation requests, products and market figures into posts, de-duplicated by hash with a per-category cooldown, scheduled through a social-posting tool, each post going out only once.",
          "Generated images with the Flux model, with prompts written by AI per category, plus background removal and infographic thumbnails.",
        ],
      },
      {
        metric: { value: "3x", label: "Sales team speed" },
        heading: "Built data pipelines and automated customer data collection (FFrape), making the Sales team 3x faster:",
        bullets: [
          "Scraped many B2B marketplaces (IndiaMart, Made-in-China…) using multiprocessing, rotating proxies and automatic captcha solving; used crawl4ai and Gemini to extract contact details.",
          "Cleaned, de-duplicated (MinHash/LSH) and auto-categorized data by product category and customs code, so Sales receives ready-to-use leads instead of entering data by hand.",
        ],
      },
      {
        metric: { value: "2x", label: "SEO results" },
        heading: "Improved technical SEO and page speed, doubling SEO results (2x):",
        bullets: [
          "Separated public data (what Google reads) from per-user data and generated structured data (JSON-LD), meta tags and sitemaps on the server; built a Redis cache for self-refreshing static pages (ISR) on a self-hosted multi-process server (PM2).",
          "Built the Blog and Events website with Astro 5: structured data, RSS, sitemap, title-based URLs with canonicals and redirects, on-site search, and lead-capture banners with UTM tagging to bring readers into the product.",
          "Built 15 tools to measure speed (TBT, CLS, LCP, INP), A/B compared builds, removed about 98 KB of unnecessary JavaScript from every page, and added an automated check that blocks changes that bloat it.",
        ],
      },
    ],
    technologies: ["Next.js", "React", "Node.js", "Python", "Astro", "Redis", "Claude", "Gemini", "MCP", "Google Analytics"],
  },
  {
    period: "SEP 2024 — SEP 2025",
    title: "Fullstack Developer",
    company: "HUNGPHUC CONSTRUCTION",
    location: "Ho Chi Minh City, Vietnam",
    link: "https://www.hungphuc.io.vn/",
    images: [
      {
        src: "/companies/hungphuc/home.webp",
        alt: "HungPhuc Construction website home page",
        caption: "Company website",
        url: "hungphuc.io.vn",
        width: 1280,
        height: 808,
      },
      {
        src: "/companies/hungphuc/cost-estimator.webp",
        alt: "HungPhuc Construction AI cost estimator page",
        caption: "AI cost estimator",
        url: "hungphuc.io.vn/bang-gia",
        width: 1280,
        height: 808,
      },
    ],
    stats: [
      { value: "30%+", label: "Organic traffic in 3 months" },
      { value: "50%", label: "Workflow efficiency" },
      { value: "20/wk", label: "AI-written articles" },
    ],
    description: [
      "Built the company's website and REST API end-to-end with Next.js and Express + PostgreSQL, covering the project portfolio, pricing, news and contact forms.",
      "Developed an AI-powered cost estimator that combines a configurable pricing engine with an LLM (Gemini/Claude) to turn customers' free-text descriptions into estimates, then into sales leads.",
      "Engineered an AI-driven content automation pipeline using Node.js and ChatGPT to research trends and generate SEO-optimized articles, scaling content output to an average of 20 new articles per week with minimal manual intervention.",
      "Built a custom admin CMS with role-based access (rich-text editor, project galleries, lead pipeline with status, assignment and notes, analytics dashboard), improving cross-departmental workflow efficiency by 50%.",
      "Implemented technical SEO with SSR/ISR, dynamic metadata, sitemap, JSON-LD structured data, llms.txt and automatic WebP image optimization, boosting organic traffic by 30%+ within 3 months.",
      "Secured the system with JWT + refresh tokens in httpOnly cookies, rate limiting, Helmet and Joi validation, and added UTM tracking to show which campaigns bring in customers.",
    ],
    technologies: ["Next.js", "Node.js", "Express", "PostgreSQL", "JWT", "Gemini", "Claude", "ChatGPT", "Cloudinary"],
  },
  {
    period: "DEC 2023 — APR 2024",
    title: "Intern Frontend Developer",
    company: "FPT Software",
    location: "Ho Chi Minh City, Vietnam",
    description: [
      "Developed a fresher and intern management system for FPT Software used by over 100 users, leveraging ReactJS, Redux, Firebase, and React Hooks.",
      "Clarified business requirements in project, contributing to refined feature implementation.",
      "Ensured cross-browser compatibility for the system across browsers and platforms, enhancing accessibility.",
      "Increased system efficiency by 10% by optimizing code, rerendering interfaces properly, and avoiding redundant API calls.",
      "Contributed to designing and refining user interface components based on feedback and project needs.",
    ],
    technologies: ["ReactJS", "Redux", "Firebase"],
  },
]

export const experienceGroups = (experience) => experience.groups ?? [{ bullets: experience.description }]

export const projects = [
  {
    title: "FUC — Capstone Management System",
    subtitle: "Capstone management system for FPT university teachers and students",
    role: "Frontend Developer",
    description: [
      "A real-time system that helps supervisors and students manage capstone projects efficiently:",
      "Supervisors can create/approve topics, manage groups, and review results, while students can form groups, select topics, and manage tasks.",
      "The system also handles defense scheduling and sends automated notifications/emails.",
    ],
    technologies: {
      frontend: ["Next.js", "TypeScript", "React Hook Form", "ShadcnUI"],
      backend: ["ASP.NET"],
      database: ["PostgreSQL"],
      others: ["AWS", "Sentence Transformer AI"],
    },
    link: "https://github.com/SP25SE148/FUCapstone_FE.git",
    images: [
      "/projects/fuc/login.webp",
      "/projects/fuc/manager-topic-detail.webp",
      "/projects/fuc/supervisor-group-info.webp",
      "/projects/fuc/student-my-group.webp",
    ],
    featured: true,
  },
  {
    title: "TMG — Task Management Group",
    subtitle: "Organize group tasks, stay productive and manage your group daily tasks efficiently",
    role: "Fullstack Developer",
    description: [
      "Organize group tasks, stay productive and manage your group daily tasks efficiently with intuitive platform:",
      "The system allows team members to manage members, assign tasks, update and manage progress, and calculate team performance statistics.",
      "Export files based on statistics on the system.",
    ],
    technologies: {
      frontend: ["ReactJS", "React Hook Form", "ShadcnUI"],
      backend: ["NodeJS", "Express"],
      database: ["MongoDB"],
      others: ["Firebase", "XLSX"],
    },
    link: "https://github.com/mtphuc253/Manage_Task_Groups_Fullstack.git",
    images: [
      "/projects/tmg/login.webp",
      "/projects/tmg/admin-dashboard.webp",
      "/projects/tmg/manage-task.webp",
      "/projects/tmg/manage-user.webp",
    ],
  },
]

export const skillGroups = [
  {
    title: "Front-end",
    items: ["ReactJS", "Next.js", "TypeScript", "TanStack Query", "Zustand", "Redux Toolkit", "Astro"],
  },
  {
    title: "Back-end & Data",
    items: ["Node.js", "Express.js", "Python (Frappe)", "RESTful API", "JWT", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    title: "AI & Automation",
    items: [
      "OpenAI API",
      "Gemini API",
      "Claude API",
      "AI agents",
      "MCP servers",
      "Prompt engineering",
      "Claude Code",
      "AI-assisted development",
    ],
  },
  { title: "Other", items: ["Technical SEO", "Core Web Vitals", "Git", "Cloudinary"] },
]

export const softSkills = ["Strong analytical thinking", "AI-first workflow with Claude Code every day", "Git for teamwork"]

export const english = {
  title: "English for Work",
  points: ["Good English communication, including technical writing and documentation."],
}

export const education = {
  degree: "Bachelor of Software Engineering",
  school: "FPT University",
  gpa: "3.25/4",
  location: "Ho Chi Minh City, Vietnam",
  period: "09/2021 - 09/2025",
  highlights: [
    "Honorable student of multiple semesters",
    "Capstone Project Considered by University for Practical Use",
  ],
}

// `link` is the certificate URL; leave it null until you have one to show.
export const certificates = [
  { title: "Initiating and Planning Projects", provider: "Coursera", link: null },
  { title: "Project Management Project", provider: "Coursera", link: null },
  { title: "Managing Project Risks and Changes", provider: "Coursera", link: null },
  { title: "UX Research at Scale: Surveys, Analytics, Online Testing", provider: "Coursera", link: null },
]
