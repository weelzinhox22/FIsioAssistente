"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, StarOff, History, FileText } from "lucide-react"
import { getPatients, getTestResults, type TestResult, favoritesStore } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Dados dos testes funcionais
const functionalTests = [
  {
    id: "tug",
    name: "TUG - Timed Up and Go",
    category: "equilibrio",
    description: "Avalia mobilidade funcional, equilíbrio dinâmico e risco de quedas.",
    href: "/testes/tug",
    icon: "⏱️",
  },
  {
    id: "berg",
    name: "Escala de Equilíbrio de Berg",
    category: "equilibrio",
    description: "Avalia o equilíbrio estático e dinâmico, e risco de quedas.",
    href: "/testes/berg",
    icon: "⚖️",
  },
  {
    id: "tc6",
    name: "Teste de Caminhada de 6 Minutos",
    category: "cardiorrespiratoria",
    description: "Avalia a capacidade funcional e resistência cardiorrespiratória.",
    href: "/testes/tc6",
    icon: "🚶",
  },
  {
    id: "sentar-levantar",
    name: "Teste de Sentar e Levantar",
    category: "forca",
    description: "Avalia força de membros inferiores e capacidade funcional.",
    href: "/testes/sentar-levantar",
    icon: "🪑",
  },
  {
    id: "tinetti",
    name: "Escala de Equilíbrio e Marcha de Tinetti",
    category: "equilibrio",
    description: "Avalia o equilíbrio e a marcha, com foco na detecção de risco de quedas em idosos.",
    href: "/testes/tinetti",
    icon: "👣",
  },
  {
    id: "dinamometria",
    name: "Dinamometria Manual",
    category: "forca",
    description: "Avalia a força de preensão manual, importante indicador de força global.",
    href: "/testes/dinamometria",
    icon: "💪",
  },
  {
    id: "alcance-funcional",
    name: "Teste de Alcance Funcional",
    category: "equilibrio",
    description: "Avalia o equilíbrio dinâmico durante uma tarefa de alcance.",
    href: "/testes/alcance-funcional",
    icon: "🫱",
  },
  {
    id: "step-test",
    name: "Step Test",
    category: "cardiorrespiratoria",
    description: "Avalia a capacidade aeróbica e resistência cardiovascular.",
    href: "/testes/step-test",
    icon: "🪜",
  },
  {
    id: "shuttle-walk",
    name: "Shuttle Walk Test",
    category: "cardiorrespiratoria",
    description: "Avalia a capacidade funcional em pacientes com doenças respiratórias.",
    href: "/testes/shuttle-walk",
    icon: "🏃",
  },
  {
    id: "goniometria",
    name: "Goniometria",
    category: "amplitude",
    description: "Avalia a amplitude de movimento articular.",
    href: "/testes/goniometria",
    icon: "📐",
  },
  {
    id: "fms",
    name: "Functional Movement Screen",
    category: "movimento",
    description: "Avalia padrões fundamentais de movimento para identificar limitações e assimetrias.",
    href: "/testes/fms",
    icon: "🔄",
  },
  {
    id: "borg",
    name: "Escala de Borg",
    category: "cardiorrespiratoria",
    description: "Avalia a percepção subjetiva de esforço durante atividades físicas.",
    href: "/testes/borg",
    icon: "😓",
  },
]

export default function TestesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentTests, setRecentTests] = useState<TestResult[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Filtrar testes com base na pesquisa
  const filteredTests = functionalTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar favoritos
        const storedFavorites = (await favoritesStore?.getItem<any[]>("favorites")) || []
        const testFavorites = storedFavorites.filter((fav) => fav.type === "test").map((fav) => fav.itemId)
        setFavorites(testFavorites)

        // Carregar resultados de testes recentes
        const testResults = await getTestResults()
        // Ordenar por data mais recente e limitar a 5
        const sortedResults = testResults
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
        setRecentTests(sortedResults)

        // Carregar pacientes para exibir nomes
        const patientsList = await getPatients()
        setPatients(patientsList)

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos testes. Por favor, tente novamente.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Alternar favorito
  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites: string[]

      if (favorites.includes(id)) {
        newFavorites = favorites.filter((fav) => fav !== id)
      } else {
        newFavorites = [...favorites, id]
      }

      setFavorites(newFavorites)

      // Atualizar no banco de dados
      const storedFavorites = (await favoritesStore?.getItem<any[]>("favorites")) || []

      // Remover favoritos existentes deste tipo e ID
      const filteredFavorites = storedFavorites.filter((fav) => !(fav.type === "test" && fav.itemId === id))

      // Se estamos adicionando aos favoritos, incluir o novo item
      if (newFavorites.includes(id)) {
        filteredFavorites.push({
          id: crypto.randomUUID(),
          type: "test",
          itemId: id,
        })
      }

      await favoritesStore?.setItem("favorites", filteredFavorites)
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error)
      toast({
        title: "Erro ao atualizar favoritos",
        description: "Não foi possível atualizar seus favoritos. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Agrupar testes por categoria
  const categorizedTests = {
    equilibrio: filteredTests.filter((test) => test.category === "equilibrio"),
    cardiorrespiratoria: filteredTests.filter((test) => test.category === "cardiorrespiratoria"),
    forca: filteredTests.filter((test) => test.category === "forca"),
    amplitude: filteredTests.filter((test) => test.category === "amplitude"),
    movimento: filteredTests.filter((test) => test.category === "movimento"),
  }

  // Obter testes favoritos
  const favoriteTests = filteredTests.filter((test) => favorites.includes(test.id))

  // Função para obter o nome do paciente pelo ID
  const getPatientName = (patientId?: string) => {
    if (!patientId) return "Sem paciente"
    const patient = patients.find((p) => p.id === patientId)
    return patient ? patient.name : "Paciente não encontrado"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar teste..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link href="/testes/historico">
          <Button variant="outline" className="w-full sm:w-auto border-blue-800 text-blue-800 hover:bg-blue-50">
            <History className="mr-2 h-4 w-4" /> Histórico de Testes
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos os Testes</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="recent">Aplicações Recentes</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredTests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum teste encontrado para "{searchTerm}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <Card key={test.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {test.icon}
                        </span>
                        <CardTitle className="text-lg text-blue-900">{test.name}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(test.id)} className="h-8 w-8">
                        {favorites.includes(test.id) ? (
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Link href={test.href} className="flex-1">
                      <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                        <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/testes/aplicar?teste=${test.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Aplicar</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {favoriteTests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Você ainda não adicionou testes aos favoritos.</p>
              <Button
                variant="outline"
                className="mt-4 border-blue-800 text-blue-800 hover:bg-blue-50"
                onClick={() => setActiveTab("all")}
              >
                Ver todos os testes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTests.map((test) => (
                <Card key={test.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {test.icon}
                        </span>
                        <CardTitle className="text-lg text-blue-900">{test.name}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(test.id)} className="h-8 w-8">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Link href={test.href} className="flex-1">
                      <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                        <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/testes/aplicar?teste=${test.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Aplicar</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando aplicações recentes...</p>
            </div>
          ) : recentTests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum teste foi aplicado recentemente.</p>
              <Link href="/testes/aplicar">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Aplicar Novo Teste</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900">Testes Aplicados Recentemente</h3>

              {recentTests.map((test) => {
                const testInfo = functionalTests.find((t) => t.id === test.testType)

                return (
                  <Card key={test.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl" aria-hidden="true">
                              {testInfo?.icon || "📋"}
                            </span>
                            <CardTitle className="text-lg text-blue-900">{testInfo?.name || test.testType}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">Paciente: {getPatientName(test.patientId)}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className="mb-1">
                            {formatDate(test.date)}
                          </Badge>
                          <span className="text-sm font-medium">Resultado: {test.result}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Link href={`/testes/historico/${test.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                          <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                        </Button>
                      </Link>
                      <Link
                        href={`/testes/aplicar?teste=${test.testType}&paciente=${test.patientId}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700">Aplicar Novamente</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}

              <div className="text-center mt-4">
                <Link href="/testes/historico">
                  <Button variant="link" className="text-blue-800">
                    Ver histórico completo
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="space-y-8">
            {Object.entries(categorizedTests).map(([category, tests]) => {
              if (tests.length === 0) return null

              let categoryTitle
              let categoryIcon

              switch (category) {
                case "equilibrio":
                  categoryTitle = "Equilíbrio e Marcha"
                  categoryIcon = "⚖️"
                  break
                case "cardiorrespiratoria":
                  categoryTitle = "Cardiorrespiratória"
                  categoryIcon = "🫁"
                  break
                case "forca":
                  categoryTitle = "Força e Resistência"
                  categoryIcon = "💪"
                  break
                case "amplitude":
                  categoryTitle = "Amplitude de Movimento"
                  categoryIcon = "📐"
                  break
                case "movimento":
                  categoryTitle = "Análise de Movimento"
                  categoryIcon = "🔄"
                  break
                default:
                  categoryTitle = category
                  categoryIcon = "📋"
              }

              return (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <span aria-hidden="true">{categoryIcon}</span> {categoryTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tests.map((test) => (
                      <Card key={test.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" aria-hidden="true">
                                {test.icon}
                              </span>
                              <CardTitle className="text-lg text-blue-900">{test.name}</CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(test.id)}
                              className="h-8 w-8"
                            >
                              {favorites.includes(test.id) ? (
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-5 w-5 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          <CardDescription>{test.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                          <Link href={test.href} className="flex-1">
                            <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                              <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                            </Button>
                          </Link>
                          <Link href={`/testes/aplicar?teste=${test.id}`} className="flex-1">
                            <Button className="w-full bg-green-600 hover:bg-green-700">Aplicar</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
