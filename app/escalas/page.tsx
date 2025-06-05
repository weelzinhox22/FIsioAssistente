"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, StarOff } from "lucide-react"
import Link from "next/link"
import { getFavoriteScales, saveFavoriteScales } from "@/lib/db"

// Dados das escalas
const scales = [
  {
    id: "eva",
    name: "EVA - Escala Visual Analógica",
    category: "dor",
    description: "Escala para avaliação subjetiva da intensidade da dor.",
    href: "/escalas/eva",
  },
  {
    id: "barthel",
    name: "Índice de Barthel",
    category: "funcional",
    description: "Avalia o nível de independência do sujeito para a realização de dez atividades básicas de vida.",
    href: "/escalas/barthel",
  },
  {
    id: "berg",
    name: "Escala de Equilíbrio de Berg",
    category: "equilibrio",
    description: "Avalia o equilíbrio estático e dinâmico, e risco de quedas.",
    href: "/escalas/berg",
  },
  {
    id: "ashworth",
    name: "Escala Modificada de Ashworth",
    category: "neurologica",
    description: "Avalia o grau de espasticidade muscular.",
    href: "/escalas/ashworth",
  },
  {
    id: "tinetti",
    name: "Escala de Equilíbrio e Marcha de Tinetti",
    category: "equilibrio",
    description: "Avalia o equilíbrio e a marcha, com foco na detecção de risco de quedas em idosos.",
    href: "/escalas/tinetti",
  },
  {
    id: "mrc",
    name: "Escala MRC (Medical Research Council)",
    category: "forca",
    description: "Avalia a força muscular em uma escala de 0 a 5.",
    href: "/escalas/mrc",
  },
  {
    id: "borg",
    name: "Escala de Borg Modificada",
    category: "cardiorrespiratoria",
    description: "Avalia a percepção subjetiva de esforço durante atividades físicas.",
    href: "/escalas/borg",
  },
  {
    id: "katz",
    name: "Índice de Katz",
    category: "funcional",
    description: "Avalia a independência funcional em atividades básicas da vida diária.",
    href: "/escalas/katz",
  },
  {
    id: "lawton",
    name: "Escala de Lawton e Brody",
    category: "funcional",
    description: "Avalia a independência em atividades instrumentais da vida diária.",
    href: "/escalas/lawton",
  },
  {
    id: "fugl-meyer",
    name: "Escala de Fugl-Meyer",
    category: "neurologica",
    description: "Avalia a recuperação sensório-motora após AVC.",
    href: "/escalas/fugl-meyer",
  },
  {
    id: "mif",
    name: "MIF - Medida de Independência Funcional",
    category: "funcional",
    description: "Avalia a capacidade funcional em diversas áreas.",
    href: "/escalas/mif",
  },
  {
    id: "sf36",
    name: "SF-36 (Short Form Health Survey)",
    category: "qualidade",
    description: "Avalia a qualidade de vida relacionada à saúde.",
    href: "/escalas/sf36",
  },
]

export default function EscalasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar favoritos do IndexedDB ao montar o componente
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await getFavoriteScales()
        setFavorites(savedFavorites)
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // Salvar favoritos no IndexedDB quando mudam
  useEffect(() => {
    if (!isLoading) {
      saveFavoriteScales(favorites)
    }
  }, [favorites, isLoading])

  // Filtrar escalas com base na pesquisa
  const filteredScales = scales.filter(
    (scale) =>
      scale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scale.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Alternar favorito
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Agrupar escalas por categoria
  const categorizedScales = {
    dor: filteredScales.filter((scale) => scale.category === "dor"),
    funcional: filteredScales.filter((scale) => scale.category === "funcional"),
    equilibrio: filteredScales.filter((scale) => scale.category === "equilibrio"),
    neurologica: filteredScales.filter((scale) => scale.category === "neurologica"),
    forca: filteredScales.filter((scale) => scale.category === "forca"),
    cardiorrespiratoria: filteredScales.filter((scale) => scale.category === "cardiorrespiratoria"),
    qualidade: filteredScales.filter((scale) => scale.category === "qualidade"),
  }

  // Obter escalas favoritas
  const favoriteScales = filteredScales.filter((scale) => favorites.includes(scale.id))

  return (
    <div className="space-y-6">
      {/* Adicione o botão de histórico na parte superior da página */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar escala..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/escalas/historico">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">Histórico de Avaliações</Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="favorites">Favoritas</TabsTrigger>
          <TabsTrigger value="functional">Funcionais</TabsTrigger>
          <TabsTrigger value="neurological">Neurológicas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredScales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma escala encontrada para "{searchTerm}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScales.map((scale) => (
                <Card key={scale.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{scale.name}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(scale.id)} className="h-8 w-8">
                        {favorites.includes(scale.id) ? (
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <CardDescription>{scale.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={scale.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {favoriteScales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Você ainda não adicionou escalas aos favoritos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteScales.map((scale) => (
                <Card key={scale.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{scale.name}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(scale.id)} className="h-8 w-8">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <CardDescription>{scale.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={scale.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="functional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedScales.funcional.map((scale) => (
              <Card key={scale.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-blue-900">{scale.name}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(scale.id)} className="h-8 w-8">
                      {favorites.includes(scale.id) ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{scale.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={scale.href}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="neurological" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedScales.neurologica.map((scale) => (
              <Card key={scale.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-blue-900">{scale.name}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(scale.id)} className="h-8 w-8">
                      {favorites.includes(scale.id) ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{scale.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={scale.href}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
