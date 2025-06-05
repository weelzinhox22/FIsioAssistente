"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Plus, Search, FileText } from "lucide-react"
import {
  getAllTemplates,
  getFavoriteTemplates,
  getTemplatesBySpecialty,
  getAllSpecialties,
  searchTemplates,
  toggleFavorite,
} from "@/lib/templates"
import type { MedicalRecordTemplate } from "@/lib/types"

export default function ModelosPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<MedicalRecordTemplate[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const allTemplates = await getAllTemplates()
        setTemplates(allTemplates)
        const allSpecialties = await getAllSpecialties()
        setSpecialties(allSpecialties)
      } catch (error) {
        console.error("Erro ao carregar modelos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const filterTemplates = async () => {
      try {
        setIsLoading(true)
        let filteredTemplates: MedicalRecordTemplate[] = []

        if (searchQuery.trim()) {
          filteredTemplates = await searchTemplates(searchQuery)
        } else if (activeTab === "favoritos") {
          filteredTemplates = await getFavoriteTemplates()
        } else if (activeTab === "todos") {
          filteredTemplates = await getAllTemplates()
        } else {
          filteredTemplates = await getTemplatesBySpecialty(activeTab)
        }

        setTemplates(filteredTemplates)
      } catch (error) {
        console.error("Erro ao filtrar modelos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    filterTemplates()
  }, [activeTab, searchQuery])

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleFavorite(id)
      // Atualizar a lista de modelos
      if (activeTab === "favoritos") {
        const favorites = await getFavoriteTemplates()
        setTemplates(favorites)
      } else {
        const updatedTemplates = templates.map((template) =>
          template.id === id ? { ...template, isFavorite: !template.isFavorite } : template,
        )
        setTemplates(updatedTemplates)
      }
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar modelo:", error)
    }
  }

  const handleCardClick = (id: string) => {
    router.push(`/modelos/${id}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modelos de Prontuário</h1>
        <Button onClick={() => router.push("/modelos/novo")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Modelo
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar modelos..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          {specialties.map((specialty) => (
            <TabsTrigger key={specialty} value={specialty}>
              {specialty}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Nenhum modelo encontrado</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery
                  ? "Tente uma busca diferente ou crie um novo modelo."
                  : activeTab === "favoritos"
                    ? "Você ainda não tem modelos favoritos."
                    : "Não há modelos disponíveis para esta categoria."}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/modelos/novo")}>
                <Plus className="mr-2 h-4 w-4" /> Criar Modelo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(template.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleToggleFavorite(template.id, e)}
                        aria-label={template.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Star
                          className={`h-5 w-5 ${template.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                    <CardDescription>{template.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {template.condition || "Modelo de prontuário para avaliação e acompanhamento"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 flex flex-wrap gap-2">
                    {template.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
