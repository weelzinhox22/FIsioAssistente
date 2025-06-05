"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  Link2,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import { initializeDatabase, getPatients, testsStore, studyNotesStore } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"
import localforage from "localforage"
import AnimatedHero from "@/components/animated-hero"
import AnimatedCard from "@/components/animated-card"
import StudentPopup from "@/components/student-popup"
import FavoritesSystem from "@/components/favorites-system"

// Adicione esta função antes do componente Home
function checkBrowserCompatibility() {
  // Verificar se IndexedDB está disponível
  if (!window.indexedDB) {
    return {
      compatible: false,
      reason: "Seu navegador não suporta IndexedDB, necessário para armazenamento local.",
    }
  }

  // Verificar se localStorage está disponível
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
  } catch (e) {
    return {
      compatible: false,
      reason: "Seu navegador não permite acesso ao armazenamento local ou está no modo privado.",
    }
  }

  // Verificar se o navegador é muito antigo
  const userAgent = navigator.userAgent
  if (userAgent.indexOf("MSIE") >= 0 || userAgent.indexOf("Trident") >= 0) {
    return {
      compatible: false,
      reason: "Internet Explorer não é suportado. Por favor, use um navegador moderno.",
    }
  }

  return { compatible: true, reason: "" }
}

export default function Home() {
  const [dbInitialized, setDbInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [browserCompatibility, setBrowserCompatibility] = useState<{ compatible: boolean, reason?: string }>({ compatible: true })
  const [stats, setStats] = useState({
    patients: 0,
    evolutions: 0,
    tests: 0,
    notes: 0,
  })

  const loadStats = async () => {
    try {
      // Usar as funções e stores existentes do lib/db.ts em vez de acessar o IndexedDB diretamente

      // Contar pacientes
      const patients = await getPatients()
      const patientCount = patients.length

      // Contar testes - usando a store correta
      const tests = (await testsStore.getItem("tests")) || []
      const testCount = Array.isArray(tests) ? tests.length : 0

      // Contar notas de estudo - usando a store correta
      const notes = (await studyNotesStore.getItem("notes")) || []
      const noteCount = Array.isArray(notes) ? notes.length : 0

      // Para evoluções, vamos verificar se existe a chave no localStorage
      // já que não temos uma função direta para isso
      let evolutionCount = 0
      try {
        const evolutionsData = await localforage.getItem("evolutions")
        evolutionCount = Array.isArray(evolutionsData) ? evolutionsData.length : 0
      } catch (e) {
        console.log("Evoluções não encontradas, definindo como 0")
      }

      setStats({
        patients: patientCount,
        evolutions: evolutionCount,
        tests: testCount,
        notes: noteCount,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
      // Não falhar completamente se as estatísticas não puderem ser carregadas
      // Apenas mostrar zeros
      setStats({
        patients: 0,
        evolutions: 0,
        tests: 0,
        notes: 0,
      })
    }
  }

  useEffect(() => {
    // Verificar compatibilidade do navegador
    const compatibility = checkBrowserCompatibility()
    setBrowserCompatibility(compatibility)

    if (!compatibility.compatible) {
      toast({
        title: "Navegador incompatível",
        description: compatibility.reason,
        variant: "destructive",
        duration: 10000,
      })
      return
    }

    // Limpar dados antigos do localStorage que possam conter estruturas incompatíveis
    try {
      // Verificar se já limpamos os dados (usando uma flag)
      const dataCleanupDone = localStorage.getItem('data-cleanup-v1')
      if (!dataCleanupDone) {
        console.log('Limpando dados antigos do localStorage...')
        localStorage.removeItem('favorites')
        localStorage.removeItem('recently-viewed')
        // Marcar que a limpeza foi feita
        localStorage.setItem('data-cleanup-v1', 'true')
      }
    } catch (error) {
      console.error('Erro ao limpar dados antigos:', error)
    }

    // Resto do código de inicialização...
    const init = async () => {
      setIsLoading(true)
      try {
        setDbInitialized(false)
        await initializeDatabase()
        setDbInitialized(true)

        // Carregar estatísticas após inicializar o banco de dados
        try {
          await loadStats()
        } catch (statsError) {
          console.error("Erro ao carregar estatísticas:", statsError)
          // Continuar mesmo se as estatísticas falharem
        }

        toast({
          title: "Inicialização concluída",
          description: "Banco de dados local inicializado com sucesso.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error initializing database:", error)
        toast({
          title: "Erro na inicialização",
          description: "Não foi possível inicializar o banco de dados local. Tente recarregar a página.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const modules = [
    {
      title: "Gerenciamento de Pacientes",
      description: "Cadastre e gerencie fichas de pacientes, histórico clínico e evolução.",
      icon: <Users className="h-8 w-8 text-blue-800" />,
      iconName: "Users",
      href: "/pacientes",
    },
    {
      title: "Escalas de Avaliação",
      description: "Acesse e aplique escalas de avaliação fisioterapêutica padronizadas.",
      icon: <FileText className="h-8 w-8 text-blue-800" />,
      iconName: "FileText",
      href: "/escalas",
    },
    {
      title: "Testes Funcionais",
      description: "Realize testes funcionais e acompanhe a evolução dos pacientes.",
      icon: <Stethoscope className="h-8 w-8 text-blue-800" />,
      iconName: "Stethoscope",
      href: "/testes",
    },
    {
      title: "Calculadora Clínica",
      description: "Calcule índices e parâmetros clínicos importantes para a fisioterapia.",
      icon: <Database className="h-8 w-8 text-blue-800" />,
      iconName: "Database",
      href: "/calculadora",
    },
    {
      title: "Protocolos por Especialidade",
      description: "Consulte protocolos de tratamento baseados em evidências científicas.",
      icon: <BookOpen className="h-8 w-8 text-blue-800" />,
      iconName: "BookOpen",
      href: "/protocolos",
    },
    {
      title: "Body Chart Interativo",
      description: "Mapeie áreas de dor e sintomas em um diagrama corporal interativo.",
      icon: <Activity className="h-8 w-8 text-blue-800" />,
      iconName: "Activity",
      href: "/body-chart",
    },
    {
      title: "Glossário Técnico",
      description: "Consulte termos técnicos e definições da fisioterapia.",
      icon: <BookOpen className="h-8 w-8 text-blue-800" />,
      iconName: "BookOpen",
      href: "/glossario",
    },
    {
      title: "Links Úteis",
      description: "Acesse links para recursos externos relevantes para a fisioterapia.",
      icon: <Link2 className="h-8 w-8 text-blue-800" />,
      iconName: "Link2",
      href: "/links",
    },
    {
      title: "Diário Acadêmico",
      description: "Registre e organize suas anotações de estudo e aprendizado.",
      icon: <BookOpen className="h-8 w-8 text-blue-800" />,
      iconName: "BookOpen",
      href: "/diario",
    },
    {
      title: "Modelos de Documentos",
      description: "Acesse e crie modelos de documentos para sua prática clínica.",
      icon: <FileText className="h-8 w-8 text-blue-800" />,
      iconName: "FileText",
      href: "/modelos",
    },
    {
      title: "Evolução Clínica",
      description: "Registre e acompanhe a evolução clínica dos seus pacientes.",
      icon: <TrendingUp className="h-8 w-8 text-blue-800" />,
      iconName: "TrendingUp",
      href: "/evolucao",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl">
      <StudentPopup />
      
      <AnimatedHero 
        title="FisioBase - Sua Plataforma de Fisioterapia" 
        subtitle="Ferramentas digitais para avaliação, tratamento e acompanhamento de pacientes, com recursos baseados em evidências científicas."
      />

      {!browserCompatibility.compatible && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{browserCompatibility.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">{stats.patients}</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">cadastrados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Evoluções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">{stats.evolutions}</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">registradas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">{stats.tests}</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">realizados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">{stats.notes}</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">de estudo</p>
          </CardContent>
        </Card>
      </div>

      {/* Favoritos e Recentes */}
      <FavoritesSystem />

      {/* Módulos */}
      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Módulos Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {modules.map((module, index) => (
          <AnimatedCard
            key={module.href}
            title={module.title}
            description={module.description}
            icon={module.icon}
            iconName={module.iconName}
            href={module.href}
            delay={index}
          />
        ))}
      </div>
    </div>
  )
}
