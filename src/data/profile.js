// Single source of truth for the CV. The chat UI renders it as rich cards and
// the Gemini system prompt (src/lib/chat-prompt.js) is built from the same data.

export const profile = {
  name: "Mai Tan Phuc",
  shortName: "Phuc",
  role: "Full-Stack Developer",
  location: "Go Vap, Ho Chi Minh City",
  phone: "+84 903 020 347",
  phoneHref: "tel:+84903020347",
  email: "mtp25032003@gmail.com",
  avatar: "/avatar.webp",
  cvUrl:
    "https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/CV%2FMaiTanPhucResume_FullstackDev_ReactJS_NodeJS.pdf?alt=media&token=c0db800f-f530-4b51-afd0-0ae5ab442e2d",
  socials: {
    github: "https://github.com/mtphuc253",
    linkedin: "https://www.linkedin.com/in/tan-phuc-mai-653111309",
    facebook: "https://www.facebook.com/maitanphuc.724777/",
  },
  summary:
    "Enthusiastic and hardworking full-stack developer with over 2 years of experience studying and working in ReactJS/NodeJS, specializing in building custom web and mobile identity solutions, and improving user experience for systems.",
  frontend:
    "I have experience working with ReactJS (NextJS, Hook, Redux Toolkit), Material UI, TailwindCSS, Shadcn/ui, Bootstrap, Axios, and other technologies.",
  backend:
    "I have experience working with Node.JS, TypeScript, ExpressJS, MongoDB, PostgreSQL, MicrosoftSQL, Firebase and other technologies.",
  maxim: "Fight for your dreams and your dreams will fight for you",
}

export const experiences = [
  {
    period: "SEP 2024 — SEP 2025",
    title: "Fullstack Developer",
    company: "HUNGPHUC CONSTRUCTION",
    location: "Ho Chi Minh City, Vietnam",
    description: [
      "Developed the company's SEO website using Next.js and Node.js, increasing organic traffic by 15% in three months.",
      "Built an internal management system for approximately 20 employees to manage employees and customers, reducing manual processing time by 30%.",
      "Designed and implemented a customer management module (mini CRM), managing more than 100 customer profiles supporting quick lookup, communication, and customer lifecycle management.",
      "Deployed and maintained servers, domains, and SSL certificates, ensuring uptime greater than 99.5%.",
      "Managed and maintained office equipment including computers, networks, and licensed software, handling over 95% of IT support requests during the day.",
    ],
    technologies: ["NextJS", "Redux", "NodeJS", "PostgreSQL", "Cloudinary"],
  },
  {
    period: "DEC 2023 — APR 2024",
    title: "Intern Software Engineer",
    company: "FPT Software",
    location: "Ho Chi Minh City, Vietnam",
    description: [
      "Developed a fresher and intern management system for FPT Software used by over 100 users, leveraging ReactJS, Redux, Firebase, and React Hooks.",
      "Clarified business requirements in project, contributing to refined feature implementation.",
      "Ensured cross-browser compatibility for the system across browsers and platforms, enhancing accessibility.",
      "Increase system efficiency by 10% by optimizing code, rerendering interfaces properly, and avoiding redundant API calls.",
      "Contributed to designing and refining user interface components based on feedback and project needs.",
    ],
    technologies: ["ReactJS", "Redux", "Firebase", "React Hooks Form"],
  },
  {
    period: "APR 2024 — AUG 2024",
    title: "Web Developer",
    company: "Freelance",
    location: "Ho Chi Minh City, Vietnam",
    description: [
      "Participated in building a SEO standard e-commerce sales website using NextJS.",
      "Built APIs and contributed to system design using NodeJS and Express",
      "Optimized existing features and added new functionalities to improve user experience.",
      "Upgraded and addressed several gaps in the business requirements to better align with project goals.",
      "Designed and enhanced a user-friendly UI for the web application.",
      "Optimized the interface to ensure responsiveness on mobile devices.",
    ],
    technologies: ["NextJS", "NodeJS", "Express", "SEO"],
  },
]

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
      "The system allows team members to manage members, assign tasks, update and manage progress, and calculate team performance statistics",
      "Export files based on statistics on the system",
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
  {
    title: "KS — Koi Store Mobile App",
    subtitle: "Mobile app for Koi fish buying, selling, and delivery management",
    role: "Fullstack Developer",
    description: [
      "Mobile app for Koi fish buying, selling, and delivery management with consignment features and revenue statistics for shop owners.",
    ],
    technologies: {
      frontend: ["React Native", "React Hook Form"],
      backend: ["NodeJS", "Express"],
      database: ["MongoDB"],
      others: ["ZaloPay"],
    },
    link: "https://github.com/mtphuc253/KoiStore_Mobile_App",
    images: [
      "/projects/ks/start-screen.webp",
      "/projects/ks/diary-list.webp",
      "/projects/ks/diary-detail.webp",
      "/projects/ks/budget.webp",
      "/projects/ks/schedule.webp",
      "/projects/ks/change-theme.webp",
    ],
    isMobile: true,
  },
]

export const skillGroups = [
  { title: "Languages", items: ["TypeScript", "JavaScript", "HTML5", "CSS3"] },
  {
    title: "Front-end",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Redux",
      "React Hook Form",
      "React Router",
      "TailwindCSS",
      "Shadcn/ui",
      "Material UI",
      "Bootstrap",
      "Axios",
    ],
  },
  { title: "Back-end", items: ["Node.js", "Express"] },
  { title: "Databases", items: ["MongoDB", "PostgreSQL", "MicrosoftSQL", "Firebase"] },
  { title: "Cloud & Tools", items: ["AWS", "Cloudinary", "Git & GitHub", "Figma"] },
]

export const softSkills = ["Testing & Debugging", "Git, Github for Teamwork", "Responsive Web Design"]

export const english = {
  title: "English for Work",
  points: [
    "For Reading: I can comfortably read and interpret documentation, project specifications, and work totally in English.",
    "For Speaking: I am capable of basic communication and am always striving to improve everyday.",
    "I would really like the opportunity to work at your organization, where I would be able to practice my ability to speak English.",
  ],
}

export const education = {
  degree: "Bachelor of Software Engineering",
  school: "FPT University",
  location: "Ho Chi Minh City, Vietnam",
  period: "09/2021 - Present",
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
