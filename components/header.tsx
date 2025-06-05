"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./sidebar"

export default function Header() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    // Função para determinar o título com base no pathname
    if (pathname === "/") setTitle("Início")
    else if (pathname.startsWith("/pacientes")) setTitle("Gerenciamento de Pacientes")
    else if (pathname.startsWith("/escalas")) setTitle("Escalas de Avaliação")
    else if (pathname.startsWith("/testes")) setTitle("Testes Funcionais")
    else if (pathname.startsWith("/calculadora")) setTitle("Calculadora Clínica")
    else if (pathname.startsWith("/protocolos")) setTitle("Protocolos por Especialidade")
    else if (pathname.startsWith("/prontuarios")) setTitle("Modelos de Prontuário")
    else if (pathname.startsWith("/downloads")) setTitle("Área de Downloads")
    else if (pathname.startsWith("/glossario")) setTitle("Glossário Técnico")
    else if (pathname.startsWith("/links")) setTitle("Links Úteis")
    else if (pathname.startsWith("/diario")) setTitle("Metas Pessoais / Diário Acadêmico")
    else if (pathname.startsWith("/backup")) setTitle("Backup e Restauro de Dados")
    else if (pathname.startsWith("/ajuda")) setTitle("Ajuda")
    else setTitle("FisioBase")
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-blue-900">{title}</h1>
      </div>

      {pathname !== "/" && pathname !== "/ajuda" && (
        <Button variant="outline" size="sm" className="gap-1 border-green-600 text-green-600 hover:bg-green-50">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      )}
    </header>
  )
}
