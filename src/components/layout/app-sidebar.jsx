"use client"

import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Facebook, Download, MapPin, Phone, Mail } from 'lucide-react'
import { cn } from "@/lib/utils"

export function AppSidebar({ sections = [], activeId, onNavigate }) {
  const [avatarOpen, setAvatarOpen] = useState(false)

  return (
    <div className="fixed left-0 top-0 h-screen w-64 z-50">
      {/* Glowing border separator */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent shadow-lg shadow-cyan-400/50" />
      
      <Sidebar variant="sidebar" collapsible="none" side="left" className="border-r-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl h-full">
        <SidebarHeader className="flex-shrink-0 py-4">
          <div className="flex flex-col items-center gap-3 px-4">
            <button
              onClick={() => setAvatarOpen(true)}
              className="group relative h-20 w-20 rounded-full"
              aria-label="View larger avatar"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full p-[3px]">
                <div className="absolute -inset-[4px] rounded-full bg-[conic-gradient(#06b6d4,#3b82f6,#8b5cf6,#06b6d4)] opacity-80 blur-md animate-[spin_8s_linear_infinite]" />
              </div>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/Images%2FB612_20250517_114052_439_resized.jpg?alt=media&token=d82ae7ed-0c60-4d85-8e4c-8c42efe2cf4c"
                alt="Mai Tan Phuc"
                className="h-full w-full rounded-full border border-white/20 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
            
            {/* Avatar Lightbox */}
            {avatarOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={() => setAvatarOpen(false)}
              >
                <div className="relative max-h-[90vh] max-w-[90vw]">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/Images%2FB612_20250517_114052_439_resized.jpg?alt=media&token=d82ae7ed-0c60-4d85-8e4c-8c42efe2cf4c"
                    alt="Mai Tan Phuc large"
                    className="max-h-[90vh] w-auto rounded-3xl border-2 border-white/20 shadow-2xl"
                  />
                </div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-base font-bold text-white">Mai Tan Phuc</div>
              <div className="text-sm text-cyan-300 font-semibold">Full-Stack Developer</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                Go Vap, Ho Chi Minh City
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <a
                href="tel:090302034"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-slate-800/60 px-3 py-1.5 text-xs text-gray-200 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <Phone className="h-3 w-3 text-cyan-400" />
                <span>+84 903 020 347</span>
              </a>
              <a
                href="mailto:mtp25032003@gmail.com"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-slate-800/60 px-3 py-1.5 text-xs text-gray-200 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <Mail className="h-3 w-3 text-cyan-400" />
                <span>mtp25032003@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/mtphuc253"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-slate-800/60 text-gray-300 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-slate-800/60 text-gray-300 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.facebook.com/maitanphuc.724777/"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-slate-800/60 text-gray-300 hover:bg-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 flex flex-col justify-center px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {sections.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeId === item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        onNavigate?.(item.id)
                      }}
                      className={cn(
                        "group flex items-center py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-500 rounded-lg",
                        activeId === item.id 
                          ? "text-cyan-200 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20" 
                          : "text-gray-500 hover:text-white hover:bg-slate-800/50 border border-transparent"
                      )}
                    >
                      <a href={`#${item.id}`} className="flex items-center w-full">
                        <span 
                          className={cn(
                            "mr-3 h-px transition-all duration-500 ease-out",
                            activeId === item.id 
                              ? "w-10 bg-gradient-to-r from-cyan-400 to-blue-400 shadow-sm shadow-cyan-400/50" 
                              : "w-6 bg-gray-600 group-hover:w-8 group-hover:bg-cyan-400/70"
                          )}
                        />
                        <span className={cn(
                          "transition-all duration-300",
                          activeId === item.id && "drop-shadow-sm"
                        )}>
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="flex-shrink-0 py-3">
          <Separator className="mx-4 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-sm shadow-cyan-400/50" />
          <Button 
            asChild 
            variant="secondary" 
            className="mx-4 mt-3 justify-start gap-2 border-white/20 bg-slate-800/60 text-gray-200 hover:bg-slate-700/60 hover:text-white hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <a href="https://firebasestorage.googleapis.com/v0/b/vivu-image.appspot.com/o/CV%2FMaiTanPhucResume_Fullstack_ReactJS_NodeJS.pdf?alt=media&token=0624acab-87c9-451c-a9d0-d4bf6cffe16f">
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </div>
  )
}

AppSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  activeId: PropTypes.string,
  onNavigate: PropTypes.func,
}
