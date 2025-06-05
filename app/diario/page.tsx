"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, Plus, Star, StarOff, Edit, Trash2, Filter, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getAllStudyNotes, toggleNoteImportance } from "@/lib/study-notes"
import type { StudyNote } from "@/lib/types"

export default function DiarioPage() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<StudyNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const { toast } = useToast()
  const router = useRouter()

  // Categorias disponíveis
  const categories = [
    { value: "all", label: "Todas as categorias" },
    { value: "anatomia", label: "Anatomia" },
    { value: "fisiologia", label: "Fisiologia" },
    { value: "avaliação", label: "Avaliação" },
    { value: "técnicas", label: "Técnicas" },
    { value: "patologias", label: "Patologias" },
    { value: "tratamento", label: "Tratamento" },
    { value: "estudos", label: "Estudos de Caso" },
    { value: "outros", label: "Outros" },
  ]

  // Carregar notas
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await getAllStudyNotes()
        setNotes(data)
        setFilteredNotes(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar notas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as notas. Tente novamente mais tarde.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [toast])

  // Filtrar notas
  useEffect(() => {
    let result = [...notes]

    // Filtrar por importantes se a aba for "important"
    if (activeTab === "important") {
      result = result.filter((note) => note.isImportant)
    }

    // Filtrar por categoria
    if (categoryFilter !== "all") {
      result = result.filter((note) => note.category === categoryFilter)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term) ||
          note.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    // Ordenar por data de modificação (mais recente primeiro)
    result.sort((a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime())

    setFilteredNotes(result)
  }, [notes, searchTerm, categoryFilter, activeTab])

  // Manipuladores de eventos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleToggleImportant = async (note: StudyNote) => {
    try {
      const updatedNote = await toggleNoteImportance(note.id)
      if (updatedNote) {
        setNotes((prev) => prev.map((n) => (n.id === note.id ? updatedNote : n)))

        toast({
          title: updatedNote.isImportant ? "Nota marcada como importante" : "Nota desmarcada como importante",
          description: updatedNote.isImportant
            ? "A nota foi adicionada às suas notas importantes."
            : "A nota foi removida das suas notas importantes.",
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar importância da nota:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da nota. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const getCategoryLabel = (value: string) => {
    const category = categories.find((cat) => cat.value === value)
    return category ? category.label : "Outro"
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      anatomia: "bg-blue-100 text-blue-800",
      fisiologia: "bg-green-100 text-green-800",
      avaliação: "bg-purple-100 text-purple-800",
      técnicas: "bg-yellow-100 text-yellow-800",
      patologias: "bg-red-100 text-red-800",
      tratamento: "bg-indigo-100 text-indigo-800",
      estudos: "bg-pink-100 text-pink-800",
      outros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.outros
  }

  const truncateContent = (content: string, maxLength = 150) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/\*\*|__/g, "") // Remove bold
      .replace(/\*|_/g, "") // Remove italic
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim()

    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Diário Acadêmico</h1>
          <p className="text-gray-500 mb-4">Organize suas anotações e estudos de fisioterapia</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => router.push("/diario/nova")}>
          <Plus className="mr-2 h-4 w-4" /> Nova Anotação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar anotações..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por categoria" />
              </div>
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
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas as Anotações</TabsTrigger>
          <TabsTrigger value="important">Importantes</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredNotes.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma anotação encontrada. Tente ajustar seus filtros ou adicione novas anotações.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl truncate" title={note.title}>
                        {note.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleImportant(note)}
                        title={note.isImportant ? "Remover dos importantes" : "Marcar como importante"}
                      >
                        {note.isImportant ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <Badge className={`mt-2 ${getCategoryColor(note.category)}`}>
                      {getCategoryLabel(note.category)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem]">{truncateContent(note.content)}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Modificado em {formatDateRelative(note.dateModified)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 p-0"
                      onClick={() => router.push(`/diario/${note.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Ler anotação
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/diario/editar/${note.id}`)}
                        title="Editar anotação"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Excluir anotação">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                          </DialogHeader>
                          <p>
                            Tem certeza que deseja excluir a anotação "{note.title}"? Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancelar</Button>
                            <Button variant="destructive">Excluir</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="important">
          {filteredNotes.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma anotação importante encontrada. Marque anotações como importantes clicando no ícone de estrela.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl truncate" title={note.title}>
                        {note.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleImportant(note)}
                        title="Remover dos importantes"
                      >
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </Button>
                    </div>
                    <Badge className={`mt-2 ${getCategoryColor(note.category)}`}>
                      {getCategoryLabel(note.category)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem]">{truncateContent(note.content)}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Modificado em {formatDateRelative(note.dateModified)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 p-0"
                      onClick={() => router.push(`/diario/${note.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Ler anotação
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/diario/editar/${note.id}`)}
                        title="Editar anotação"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Excluir anotação">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                          </DialogHeader>
                          <p>
                            Tem certeza que deseja excluir a anotação "{note.title}"? Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancelar</Button>
                            <Button variant="destructive">Excluir</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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
