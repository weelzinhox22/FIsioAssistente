"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Home,
  Stethoscope,
  Users,
  BookText,
  Activity,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      title: "Início",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Pacientes",
      href: "/pacientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Escalas de Avaliação",
      href: "/escalas",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Testes Funcionais",
      href: "/testes",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      title: "Calculadora Clínica",
      href: "/calculadora",
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      title: "Protocolos",
      href: "/protocolos",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Glossário Técnico",
      href: "/glossario",
      icon: <BookText className="h-5 w-5" />,
    },
    {
      title: "Links Úteis",
      href: "/links",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Metas e Diário",
      href: "/diario",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Evolução",
      href: "/evolucao",
      icon: <Activity className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn("relative flex flex-col border-r bg-blue-900 text-white", isCollapsed ? "w-16" : "w-64", className)}
    >
      <div className="flex h-14 items-center px-4 py-2 border-b border-blue-800">
        {!isCollapsed && <span className="font-bold text-lg">FisioBase</span>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("absolute right-2 top-3 text-white hover:bg-blue-800", isCollapsed && "right-2")}
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800 hover:text-white",
                isCollapsed && "justify-center px-0",
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
