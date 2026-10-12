// Single source of truth for the CV. The chat UI renders it as rich cards and
// the Gemini system prompt (src/lib/chat-prompt.js) is built from the same data.

export const profile = {
  name: "Mai Tan Phuc",
  initials: "MP",
  shortName: "Phuc",
  role: "Full-Stack Developer",
  location: "Go Vap, Ho Chi Minh City",
  phone: "+84 903 020 347",
  phoneHref: "tel:+84903020347",
  email: "mtp25032003@gmail.com",
  avatar:
    "https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/Images%2FB612_20250517_114052_439_resized.jpg?alt=media&token=d82ae7ed-0c60-4d85-8e4c-8c42efe2cf4c",
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
      "https://camo.githubusercontent.com/dd9dffdbb4bef4e49b65ab6799babb3f1e89fa14e928908bca582f32654f5a34/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f4655435f46455f53637265656e73686f747325324653637265656e73686f74253230323032352d30352d32332532303039313333392e706e673f616c743d6d6564696126746f6b656e3d31393038613838322d363034362d346631312d393139372d346133653165303363623861",
      "https://camo.githubusercontent.com/53e29225a0c287e0f0de4e71a1feffda5eb006b1d0d0e8de539b51d605263c43/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f4655435f46455f53637265656e73686f74732532464d616e616765725f546f7069635f44657461696c2e706e673f616c743d6d6564696126746f6b656e3d34353239633463322d316532652d343831312d623834332d333130383834353135333534",
      "https://camo.githubusercontent.com/4216cd8e6ef69d527536cbbf6877f941b5ed5ff7ebb2d5ae5178e53cc2fd0d23/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f4655435f46455f53637265656e73686f747325324653757065727669736f725f47726f7570496e666f2e706e673f616c743d6d6564696126746f6b656e3d30336565633836652d373931652d346339352d383365362d343462636537386631323962",
      "https://camo.githubusercontent.com/bef67633f5441e977046092abdf0e1ae7d9abea268820c3fd0b38f9d44b1934a/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f4655435f46455f53637265656e73686f747325324653747564656e745f4d7967726f75702e706e673f616c743d6d6564696126746f6b656e3d64363833373261362d356561662d343932362d386332392d363831346437363763366264",
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
      "https://camo.githubusercontent.com/fcf49b0f95ddf3ab56378ba14b6584337cb53c9b644d96d8a8256f56b95130fa/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f766976752d696d6167652e61707073706f742e636f6d2f6f2f4d5447253230496d6167652532464c6f67696e2e706e673f616c743d6d6564696126746f6b656e3d61613338616265352d393162322d346662652d393939302d306535633661616137613862",
      "https://camo.githubusercontent.com/66708d64d83e4b750cf7cfa0fab32dbe24daf79f6586bb02ec5da0bdbc349b12/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f766976752d696d6167652e61707073706f742e636f6d2f6f2f4d5447253230496d61676525324641646d696e44617368626f6172642831292e706e673f616c743d6d6564696126746f6b656e3d32323432343961642d396631302d343761322d623635362d383332376632396561356432",
      "https://camo.githubusercontent.com/246eb8ea347f434e1ad02077b29a59472679ba969f66995defb1edf8ad97f340/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f766976752d696d6167652e61707073706f742e636f6d2f6f2f4d5447253230496d6167652532464d616e6167655461736b2832292e706e673f616c743d6d6564696126746f6b656e3d35623064643364392d663930312d346133352d383864362d613938336362396432663261",
      "https://camo.githubusercontent.com/12f5b80cc3622936ff60e47838752b743b8d5b07967e6c7eda6c0765bcb170e7/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f766976752d696d6167652e61707073706f742e636f6d2f6f2f4d5447253230496d6167652532464d616e616765557365722e706e673f616c743d6d6564696126746f6b656e3d37363630646435362d393064622d343965632d393638322d383666333930633235636362",
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
      "https://camo.githubusercontent.com/1373df4876a4123b013cc3e222b0dc2245ecec64228e0e4f7e420d729f630078/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f73746172745f73637265656e2e6a70673f616c743d6d6564696126746f6b656e3d38636337633963332d383438642d346235332d383161382d663662323633363434393934",
      "https://camo.githubusercontent.com/c9ec0b23812a24450bab3e502caa1c73b7d672b8af439d7e0f94e1a7f808cab2/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f365f566965775f637265617465645f64696172795f6c6973742e6a70673f616c743d6d6564696126746f6b656e3d62333632393737642d653333312d343231382d626561302d323437623634613438333533",
      "https://camo.githubusercontent.com/1fd4d5ca9666aeb7ff74b34837dddc034740a73c4361a0451e03ec36ca5ae1c0/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f375f566965775f64696172795f64657461696c2e6a70673f616c743d6d6564696126746f6b656e3d63616338356263302d633632342d343764372d613835352d306265396466636265343332",
      "https://camo.githubusercontent.com/c4d2e4303941846b10837c22715e446ff7834dcb50744ea8911868ecab29c2cc/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f31305f486f775f6d7563685f7370656e642e6a70673f616c743d6d6564696126746f6b656e3d35643430666637342d363465632d343136312d386264392d316231636431306632353361",
      "https://camo.githubusercontent.com/6a49a04a106199aa2903f23c7fbf110ec45e8468433432b6141fd7ca01a7d8ef/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f31345f5363686564756c655f67656e6572617465645f66726f6d5f757365725f696e7075742e6a70673f616c743d6d6564696126746f6b656e3d63643732316431352d393763332d343330332d383961382d326366646261313139633965",
      "https://camo.githubusercontent.com/10419a622b4d11e1571af48ce2d4cfd8405e7c1110580dbdc6b4400540a4fbd2/68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f63726561746573796c6c6162757375706c6f6164696e672e61707073706f742e636f6d2f6f2f31355f4368616e67655f7468656d652e6a70673f616c743d6d6564696126746f6b656e3d38333338303431302d663035322d346561362d616238632d313532616530383337333439",
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
