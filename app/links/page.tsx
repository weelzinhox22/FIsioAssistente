"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, ExternalLink, Star, Edit, Trash2, Filter, StarOff, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getAllLinks, addLink, updateLink, deleteLink, toggleFavorite, checkLinkStatus } from "@/lib/links"
import type { UsefulLink } from "@/lib/types"

export default function LinksPage() {
  const [links, setLinks] = useState<UsefulLink[]>([])
  const [filteredLinks, setFilteredLinks] = useState<UsefulLink[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLink, setCurrentLink] = useState<UsefulLink | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "article",
  })

  const { toast } = useToast()
  const router = useRouter()

  // Categorias disponíveis
  const categories = [
    { value: "article", label: "Artigos Científicos" },
    { value: "video", label: "Vídeos" },
    { value: "tool", label: "Ferramentas" },
    { value: "association", label: "Associações" },
    { value: "journal", label: "Revistas" },
    { value: "course", label: "Cursos" },
    { value: "book", label: "Livros" },
    { value: "other", label: "Outros" },
  ]

  // Carregar links
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const data = await getAllLinks()
        setLinks(data)
        setFilteredLinks(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar links:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os links. Tente novamente mais tarde.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadLinks()
  }, [toast])

  // Filtrar links
  useEffect(() => {
    let result = [...links]

    // Filtrar por favoritos se a aba for "favorites"
    if (activeTab === "favorites") {
      result = result.filter((link) => link.isFavorite)
    }

    // Filtrar por categoria
    if (categoryFilter !== "all") {
      result = result.filter((link) => link.category === categoryFilter)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (link) =>
          link.title.toLowerCase().includes(term) ||
          link.description.toLowerCase().includes(term) ||
          link.url.toLowerCase().includes(term),
      )
    }

    setFilteredLinks(result)
  }, [links, searchTerm, categoryFilter, activeTab])

  // Verificar status dos links
  useEffect(() => {
    const checkLinks = async () => {
      if (links.length > 0) {
        const updatedLinks = [...links]

        for (let i = 0; i < updatedLinks.length; i++) {
          const link = updatedLinks[i]
          if (!link.status || Date.now() - (link.lastChecked || 0) > 24 * 60 * 60 * 1000) {
            const status = await checkLinkStatus(link.url)
            updatedLinks[i] = {
              ...link,
              status,
              lastChecked: Date.now(),
            }

            // Atualizar o link no banco de dados
            await updateLink(updatedLinks[i])
          }
        }

        setLinks(updatedLinks)
      }
    }

    if (!isLoading) {
      checkLinks()
    }
  }, [isLoading, links.length])

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

  const handleAddLink = async () => {
    try {
      if (!formData.title || !formData.url || !formData.category) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }

      // Validar URL
      try {
        new URL(formData.url)
      } catch (e) {
        toast({
          title: "URL inválida",
          description: "Por favor, insira uma URL válida incluindo http:// ou https://",
          variant: "destructive",
        })
        return
      }

      const newLink: Omit<UsefulLink, "id"> = {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        category: formData.category,
        dateAdded: new Date().toISOString(),
        isFavorite: false,
      }

      const addedLink = await addLink(newLink)
      setLinks((prev) => [...prev, addedLink])
      setIsAddDialogOpen(false)
      resetForm()

      toast({
        title: "Link adicionado",
        description: "O link foi adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar link:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o link. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditLink = async () => {
    try {
      if (!currentLink || !formData.title || !formData.url || !formData.category) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }

      // Validar URL
      try {
        new URL(formData.url)
      } catch (e) {
        toast({
          title: "URL inválida",
          description: "Por favor, insira uma URL válida incluindo http:// ou https://",
          variant: "destructive",
        })
        return
      }

      const updatedLink: UsefulLink = {
        ...currentLink,
        title: formData.title,
        url: formData.url,
        description: formData.description,
        category: formData.category,
      }

      await updateLink(updatedLink)
      setLinks((prev) => prev.map((link) => (link.id === updatedLink.id ? updatedLink : link)))
      setIsEditDialogOpen(false)
      resetForm()

      toast({
        title: "Link atualizado",
        description: "O link foi atualizado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar link:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o link. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLink = async () => {
    try {
      if (!currentLink) return

      await deleteLink(currentLink.id)
      setLinks((prev) => prev.filter((link) => link.id !== currentLink.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Link excluído",
        description: "O link foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir link:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o link. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (link: UsefulLink) => {
    try {
      const updatedLink = { ...link, isFavorite: !link.isFavorite }
      await toggleFavorite(updatedLink)
      setLinks((prev) => prev.map((l) => (l.id === link.id ? updatedLink : l)))

      toast({
        title: updatedLink.isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: updatedLink.isFavorite
          ? "O link foi adicionado aos seus favoritos."
          : "O link foi removido dos seus favoritos.",
      })
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de favorito. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (link: UsefulLink) => {
    setCurrentLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || "",
      category: link.category,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (link: UsefulLink) => {
    setCurrentLink(link)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
      category: "article",
    })
    setCurrentLink(null)
  }

  const getCategoryLabel = (value: string) => {
    const category = categories.find((cat) => cat.value === value)
    return category ? category.label : "Outro"
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      article: "bg-blue-100 text-blue-800",
      video: "bg-red-100 text-red-800",
      tool: "bg-green-100 text-green-800",
      association: "bg-purple-100 text-purple-800",
      journal: "bg-yellow-100 text-yellow-800",
      course: "bg-indigo-100 text-indigo-800",
      book: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.other
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
          <h1 className="text-3xl font-bold mb-2">Links Úteis</h1>
          <p className="text-gray-500 mb-4">Acesse recursos externos relevantes para fisioterapia</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Link</DialogTitle>
              <DialogDescription>Preencha os detalhes do link que deseja adicionar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: PEDro - Physiotherapy Evidence Database"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL*</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Ex: https://pedro.org.au/"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva brevemente o conteúdo deste link"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddLink}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Buscar links..." value={searchTerm} onChange={handleSearchChange} className="pl-10" />
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
              <SelectItem value="all">Todas as categorias</SelectItem>
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
          <TabsTrigger value="all">Todos os Links</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredLinks.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhum link encontrado. Tente ajustar seus filtros ou adicione novos links.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <Card key={link.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl truncate" title={link.title}>
                        {link.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(link)}
                        title={link.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        {link.isFavorite ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <Badge className={`mt-2 ${getCategoryColor(link.category)}`}>
                      {getCategoryLabel(link.category)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem]">
                      {link.description || "Sem descrição disponível."}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {link.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      ) : link.status === "inactive" ? (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      <span>
                        {link.status === "active"
                          ? "Link ativo"
                          : link.status === "inactive"
                            ? "Link inativo"
                            : "Status desconhecido"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> Acessar
                    </a>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(link)} title="Editar link">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(link)} title="Excluir link">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites">
          {filteredLinks.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhum link favorito encontrado. Adicione links aos favoritos clicando no ícone de estrela.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <Card key={link.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl truncate" title={link.title}>
                        {link.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(link)}
                        title="Remover dos favoritos"
                      >
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </Button>
                    </div>
                    <Badge className={`mt-2 ${getCategoryColor(link.category)}`}>
                      {getCategoryLabel(link.category)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem]">
                      {link.description || "Sem descrição disponível."}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {link.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      ) : link.status === "inactive" ? (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      <span>
                        {link.status === "active"
                          ? "Link ativo"
                          : link.status === "inactive"
                            ? "Link inativo"
                            : "Status desconhecido"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> Acessar
                    </a>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(link)} title="Editar link">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(link)} title="Excluir link">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Link</DialogTitle>
            <DialogDescription>Atualize os detalhes do link selecionado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título*</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL*</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Categoria*</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Selecione uma categoria" />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditLink}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o link "{currentLink?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteLink}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
