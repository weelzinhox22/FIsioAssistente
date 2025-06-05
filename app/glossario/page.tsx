"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookmarkPlus, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import { getGlossaryTerms, toggleFavoriteTerm, getFavoriteTerms } from "@/lib/glossary"
import type { GlossaryTerm } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [favoriteTerms, setFavoriteTerms] = useState<string[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [isLoading, setIsLoading] = useState(true)
  const [currentLetter, setCurrentLetter] = useState<string>("all")

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const categories = [
    { value: "todas", label: "Todas as categorias" },
    { value: "ortopedia", label: "Ortopedia" },
    { value: "neurologia", label: "Neurologia" },
    { value: "respiratoria", label: "Respiratória" },
    { value: "cardiologia", label: "Cardiologia" },
    { value: "geriatria", label: "Geriatria" },
    { value: "pediatria", label: "Pediatria" },
    { value: "esportiva", label: "Esportiva" },
    { value: "geral", label: "Termos Gerais" },
  ]

  useEffect(() => {
    const loadTerms = async () => {
      setIsLoading(true)
      try {
        const allTerms = await getGlossaryTerms()
        const favorites = await getFavoriteTerms()

        setTerms(allTerms)
        setFilteredTerms(allTerms)
        setFavoriteTerms(favorites)
      } catch (error) {
        console.error("Erro ao carregar termos do glossário:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTerms()
  }, [])

  useEffect(() => {
    let result = [...terms]

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (term) =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoria
    if (selectedCategory !== "todas") {
      result = result.filter((term) => term.category === selectedCategory)
    }

    // Filtrar por letra
    if (currentLetter !== "all") {
      result = result.filter((term) => term.term.toUpperCase().startsWith(currentLetter))
    }

    setFilteredTerms(result)
  }, [searchTerm, terms, selectedCategory, currentLetter])

  const handleToggleFavorite = async (termId: string) => {
    try {
      const isFavorite = favoriteTerms.includes(termId)
      await toggleFavoriteTerm(termId, !isFavorite)

      if (isFavorite) {
        setFavoriteTerms(favoriteTerms.filter((id) => id !== termId))
      } else {
        setFavoriteTerms([...favoriteTerms, termId])
      }
    } catch (error) {
      console.error("Erro ao favoritar termo:", error)
    }
  }

  const renderTermCard = (term: GlossaryTerm) => {
    const isFavorite = favoriteTerms.includes(term.id)

    return (
      <Card key={term.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{term.term}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleFavorite(term.id)}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {isFavorite ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
          </div>
          <Badge variant="outline" className="w-fit">
            {categories.find((c) => c.value === term.category)?.label || term.category}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{term.definition}</p>
        </CardContent>
        <CardFooter>
          <Link href={`/glossario/${term.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Ver detalhes
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Glossário Técnico</h1>
        <p className="text-muted-foreground">Consulte termos técnicos utilizados na fisioterapia</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar termos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex overflow-x-auto pb-2">
        <Button
          variant={currentLetter === "all" ? "default" : "outline"}
          className="mr-1 px-3"
          onClick={() => setCurrentLetter("all")}
        >
          Todos
        </Button>
        {alphabet.map((letter) => (
          <Button
            key={letter}
            variant={currentLetter === letter ? "default" : "outline"}
            className="mr-1 px-3"
            onClick={() => setCurrentLetter(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todos">Todos os Termos</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando termos...</p>
            </div>
          ) : filteredTerms.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTerms.map(renderTermCard)}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Nenhum termo encontrado</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("todas")
                  setCurrentLetter("all")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favoritos" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando favoritos...</p>
            </div>
          ) : filteredTerms.filter((term) => favoriteTerms.includes(term.id)).length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTerms.filter((term) => favoriteTerms.includes(term.id)).map(renderTermCard)}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Nenhum termo favorito</p>
              <p className="text-sm text-muted-foreground">
                Adicione termos aos favoritos clicando no ícone de marcador
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
