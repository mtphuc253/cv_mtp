/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  Github,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  UserRound,
  ChevronRight,
  BriefcaseBusiness,
  CalendarDays,
  Wrench,
  GraduationCap,
  Heart,
  Award,
  Code2,
  Database,
  Globe,
  Smartphone,
  Server,
  Palette,
  GitBranch,
  Cloud,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { AppSidebar } from "@/components/layout/app-sidebar"

const sections = [
  { id: "about", title: "ABOUT" },
  { id: "experience", title: "EXPERIENCE" },
  { id: "projects", title: "PROJECTS" },
  { id: "skills", title: "SKILLS" },
  { id: "education", title: "EDUCATION" },
  { id: "certificates", title: "CERTIFICATES" },
]

export default function Page() {
  const [activeId, setActiveId] = useState("about")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const mainRef = useRef(null)

  // Mouse tracking for subtle interactions
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Observe sections for active navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0.5, 0.75, 1],
      },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleNavigate = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveId(id)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative text-white selection:bg-cyan-300 selection:text-cyan-900 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex"
    >
      {/* Enhanced overlay for better text readability */}
      <div className="fixed inset-0 bg-slate-900/20" />

      {/* Multiple animated gradient overlays for more lighting effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-blue-500/8 animate-pulse" />
      <div
        className="fixed inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-teal-500/5 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="fixed inset-0 bg-gradient-to-tr from-blue-500/6 via-transparent to-cyan-500/6 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Enhanced grid pattern overlay */}
      <div className="fixed inset-0 opacity-15 [background-image:linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px]" />

      {/* Floating light orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      <SidebarProvider>
        <AppSidebar sections={sections} activeId={activeId} onNavigate={handleNavigate} />
        <main
          ref={mainRef}
          className={cn(
            "scroll-smooth relative z-10",
            "ml-64 w-[calc(100%-16rem)]", // Account for 256px (w-64) sidebar width
            "px-4 pb-24 pt-12 md:px-8 lg:px-12",
          )}
        >
          <About activeId={activeId} />
          <Experience activeId={activeId} />
          <Projects activeId={activeId} />
          <Skills activeId={activeId} />
          <Education activeId={activeId} />
          <Certificates activeId={activeId} />
          <TheEnd activeId={activeId} />
        </main>
      </SidebarProvider>
    </div>
  )
}

function Section({ id, title, icon: Icon, children, activeId }) {
  const isActive = activeId === id

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-20 scroll-mt-24 relative"
      aria-labelledby={`${id}-title`}
    >
      <div className="mb-8 flex items-center gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl ring-1 backdrop-blur-sm transition-all duration-500",
            isActive
              ? "bg-gradient-to-br from-cyan-500/30 to-blue-500/30 ring-cyan-400/50 shadow-lg shadow-cyan-500/20"
              : "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-white/10",
          )}
        >
          <Icon
            className={cn("h-6 w-6 transition-colors duration-500", isActive ? "text-cyan-200" : "text-cyan-300")}
          />
        </div>
        <h2
          id={`${id}-title`}
          className={cn(
            "text-3xl font-bold tracking-tight transition-colors duration-500",
            isActive ? "text-cyan-100" : "text-white",
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            "flex-1 h-px transition-all duration-500",
            isActive
              ? "bg-gradient-to-r from-cyan-400/70 to-transparent"
              : "bg-gradient-to-r from-cyan-500/50 to-transparent",
          )}
        />
      </div>

      {/* Content with enhanced glow effects */}
      <div className={cn("relative transition-all duration-700", isActive && "drop-shadow-2xl")}>
        {isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-cyan-500/10 rounded-3xl animate-pulse blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-3xl" />
          </>
        )}
        <div className="relative">{children}</div>
      </div>
    </motion.section>
  )
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  activeId: PropTypes.string.isRequired,
}

function About({ activeId }) {
  return (
    <Section id="about" title="About me" icon={UserRound} activeId={activeId}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center gap-6">
            <AvatarGlow />
            <div className="text-center">
              <h1 className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
                Mai Tan Phuc
              </h1>
              <div className="mt-2 text-lg font-semibold text-cyan-300">Full-Stack Developer</div>
              <div className="mt-2 flex items-center justify-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>Go Vap, Ho Chi Minh City</span>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-3">
              <a
                href="tel:+84903020347"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-800/60 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-slate-700/60 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
                aria-label="Call phone number"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                +84 903 020 347
              </a>
              <a
                href="mailto:mtp25032003@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-800/60 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-slate-700/60 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
                aria-label="Send email"
              >
                <Mail className="h-4 w-4 text-cyan-400" />
                mtp25032003@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <SocialLink icon={Github} label="GitHub" href="https://github.com/mtphuc253" />
              <SocialLink
                icon={IconLinkedIn}
                label="LinkedIn"
                href="https://www.linkedin.com/in/tan-phuc-mai-653111309"
              />
              <SocialLink icon={IconFacebook} label="Facebook" href="https://www.facebook.com/maitanphuc.724777/" />
            </div>
          </div>

          <div className="space-y-6 text-gray-300">
            <p className="text-xl text-white leading-relaxed">Hi there, welcome to look at my profile!</p>
            <p className="text-lg leading-relaxed">
              Enthusiastic and hardworking full-stack developer with over 2 years of experience studying and working in
              ReactJS/NodeJS, specializing in building custom web and mobile identity solutions, and improving user
              experience for systems.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                <div className="mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-400" />
                  <span className="font-semibold text-white">Front-end</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  I have experience working with ReactJS (NextJS, Hook, Redux Toolkit), Material UI, TailwindCSS,
                  Shadcn/ui, Bootstrap, Axios, and other technologies.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                <div className="mb-3 flex items-center gap-2">
                  <Server className="h-5 w-5 text-cyan-400" />
                  <span className="font-semibold text-white">Back-end</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  I have experience working with Node.JS, TypeScript, ExpressJS, MongoDB, MicrosoftSQL, Firebase and
                  other technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Experience({ activeId }) {
  const experiences = [
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
      technologies: ["ReactJS", "Redux", "Firebase", "React Hooks"],
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

  return (
    <Section id="experience" title="Experience" icon={BriefcaseBusiness} activeId={activeId}>
      <div className="grid gap-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                  <div className="text-lg text-cyan-300 font-semibold mb-1">{exp.company}</div>
                  <div className="text-gray-400">{exp.location}</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-slate-800/60 px-4 py-2 rounded-full border border-white/10">
                  <CalendarDays className="h-4 w-4 text-cyan-400" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-sm font-medium text-cyan-200 shadow-sm shadow-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function Projects({ activeId }) {
  const projects = [
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

  return (
    <Section id="projects" title="Highlight Projects" icon={Sparkles} activeId={activeId}>
      <div className="space-y-12">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}

function ProjectCard({ project, index }) {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={cn(
          "overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-cyan-500/20",
          project.featured
            ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 ring-1 ring-cyan-400/20 shadow-cyan-500/10"
            : "bg-slate-900/60 hover:shadow-cyan-500/10",
        )}
      >
        {project.featured && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-2 border-b border-cyan-400/20">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Featured Project
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-6">
              <div>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-2xl font-bold text-white hover:text-cyan-300 transition-colors group"
                >
                  {project.title}
                  <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <div className="mt-1 text-gray-400">{project.subtitle}</div>
                <div className="mt-2 text-sm text-cyan-300 font-semibold">Role: {project.role}</div>
              </div>

              <ul className="space-y-3">
                {project.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Frontend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.frontend.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Backend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.backend.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.database.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs text-green-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Others
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.others.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-800/60 px-6 py-3 text-sm text-gray-200 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            {/* Enhanced Project Images */}
            <div className={cn("grid gap-2", project.isMobile ? "grid-cols-3" : "grid-cols-2")}>
              {project.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(src)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 cursor-pointer",
                    project.isMobile ? "aspect-[9/16]" : "aspect-video",
                  )}
                  style={{
                    background: `linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.1) 100%)`,
                    border: `2px solid transparent`,
                    backgroundClip: "padding-box",
                  }}
                >
                  {/* Fade to background border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged project screenshot"
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain rounded-xl border-2 border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}

function Skills({ activeId }) {
  const techStack = [
    { name: "TypeScript", icon: Code2, color: "from-blue-500 to-blue-600" },
    { name: "React", icon: Globe, color: "from-cyan-400 to-cyan-500" },
    { name: "React Native", icon: Smartphone, color: "from-cyan-400 to-cyan-500" },
    { name: "React Hook Form", icon: Code2, color: "from-pink-500 to-pink-600" },
    { name: "React Router", icon: GitBranch, color: "from-red-500 to-red-600" },
    { name: "HTML5", icon: Globe, color: "from-orange-500 to-orange-600" },
    { name: "JavaScript", icon: Code2, color: "from-yellow-400 to-yellow-500" },
    { name: "CSS3", icon: Palette, color: "from-blue-500 to-blue-600" },
    { name: "Next.js", icon: Zap, color: "from-gray-700 to-gray-800" },
    { name: "Node.js", icon: Server, color: "from-green-500 to-green-600" },
    { name: "Redux", icon: Database, color: "from-purple-500 to-purple-600" },
    { name: "TailwindCSS", icon: Palette, color: "from-teal-500 to-teal-600" },
    { name: "MongoDB", icon: Database, color: "from-green-500 to-green-600" },
    { name: "Firebase", icon: Cloud, color: "from-yellow-400 to-orange-500" },
    { name: "AWS", icon: Cloud, color: "from-orange-400 to-orange-500" },
    { name: "Bootstrap", icon: Palette, color: "from-purple-500 to-purple-600" },
    { name: "Figma", icon: Palette, color: "from-red-400 to-red-500" },
  ]

  return (
    <Section id="skills" title="Skills" icon={Wrench} activeId={activeId}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative">
            <h3 className="mb-6 text-2xl font-bold text-white">Tech Stack</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/40 p-4 backdrop-blur-sm hover:bg-slate-700/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tech.color} shadow-lg`}
                  >
                    <tech.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative">
            <h3 className="mb-6 text-2xl font-bold text-white">Workflow & Soft Skills</h3>
            <ul className="grid gap-4 text-gray-300">
              <li className="flex items-start gap-3">
                <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Testing & Debugging</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Git, Github for Teamwork</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Responsive Web Design</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">English for Work!</span>
                  <ul className="mt-2 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>
                        For Reading: I can comfortably read and interpret documentation, project specifications, and
                        work totally in English.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>
                        For Speaking: I am capable of basic communication and am always striving to improve everyday.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>
                        I would really like the opportunity to work at your organization, where I would be able to
                        practice my ability to speak English.
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div className="mt-6 rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4 shadow-lg shadow-cyan-500/10">
              <p className="text-center text-lg font-semibold text-cyan-200 italic">
                My maxim: "Fight for your dreams and your dreams will fight for you"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Education({ activeId }) {
  return (
    <Section id="education" title="Education" icon={GraduationCap} activeId={activeId}>
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Bachelor of Software Engineering</h3>
              <div className="text-lg text-cyan-300 font-semibold mb-1">FPT University</div>
              <div className="text-gray-400">Ho Chi Minh City, Vietnam</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-slate-800/60 px-4 py-2 rounded-full border border-white/10">
              <CalendarDays className="h-4 w-4 text-cyan-400" />
              <span>09/2021 - Present</span>
            </div>
          </div>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <Award className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span>Honorable student of multiple semesters</span>
            </li>
            <li className="flex items-start gap-3">
              <Award className="mt-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span>Capstone Project Considered by University for Practical Use</span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}

function Certificates({ activeId }) {
  const certificates = [
    {
      title: "Initiating and Planning Projects",
      provider: "Coursera",
      link: "#",
    },
    {
      title: "Project Management Project",
      provider: "Coursera",
      link: "#",
    },
    {
      title: "Managing Project Risks and Changes",
      provider: "Coursera",
      link: "#",
    },
    {
      title: "UX Research at Scale: Surveys, Analytics, Online Testing",
      provider: "Coursera",
      link: "#",
    },
  ]

  return (
    <Section id="certificates" title="Certificates" icon={Award} activeId={activeId}>
      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight">{cert.title}</h3>
                  <div className="text-cyan-300 font-medium mb-4">{cert.provider}</div>
                </div>
                <Award className="h-6 w-6 text-cyan-400 flex-shrink-0" />
              </div>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View certificate
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function TheEnd({ activeId }) {
  return (
    <Section id="the-end" title="Thank You" icon={Heart} activeId={activeId}>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
        <div className="relative p-8">
          <div className="text-center space-y-6">
            <div className="space-y-4 text-gray-300">
              <p className="text-2xl text-white font-semibold">
                Finally, I'd want to say Thank You for taking your time to review my CV.
              </p>
              <p className="text-lg">
                If you think I may be a good fit, I'd love to connect and learn more about your team and projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <a
                href="tel:+84903020347"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                <Phone className="h-4 w-4" />
                Call Me
              </a>
              <a
                href="mailto:mtp25032003@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-500/20 px-6 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <Mail className="h-4 w-4" />
                Email Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function SocialLink({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-slate-800/60 text-gray-300 transition-all hover:bg-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20"
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}

SocialLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

// Simple LinkedIn and Facebook icons
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.79-2.2 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.16c0-1.7-.03-3.88-2.36-3.88-2.36 0-2.72 1.84-2.72 3.75V24h-4V8z"></path>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.406.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.41c0-3.1 1.894-4.787 4.659-4.787 1.325 0 2.462.098 2.793.142v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.765v2.314h3.592l-.468 3.622h-3.124V24h6.127C23.406 24 24 23.406 24 22.674V1.326C24 .593 23.406 0 22.675 0z"></path>
    </svg>
  )
}

function AvatarGlow() {
  return (
    <div className="flex flex-col items-center">
      <div className="group relative h-64 w-64 rounded-full">
        {/* Enhanced rotating glow ring */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full p-[4px]">
          <div className="absolute -inset-[8px] rounded-full bg-[conic-gradient(var(--c1),var(--c2),var(--c3),var(--c1))] [--c1:#06b6d4] [--c2:#3b82f6] [--c3:#8b5cf6] opacity-80 blur-lg animate-[spin_10s_linear_infinite]" />
        </div>
        <div className="relative w-64 h-64">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/Images%2FB612_20250517_114052_439_resized.jpg?alt=media&token=d82ae7ed-0c60-4d85-8e4c-8c42efe2cf4c"
            alt="Mai Tan Phuc"
            fill
            className="rounded-full border-2 border-white/20 object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}
