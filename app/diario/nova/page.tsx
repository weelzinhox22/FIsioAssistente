"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { addStudyNote } from "@/lib/study-notes"
import { Markdown } from "@/components/markdown"

export default function NovaAnotacaoPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("anatomia")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [relatedLinks, setRelatedLinks] = useState<{ title: string; url: string }[]>([])
  const [currentLinkTitle, setCurrentLinkTitle] = useState("")
  const [currentLinkUrl, setCurrentLinkUrl] = useState("")
  const [isImportant, setIsImportant] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")

  const { toast } = useToast()
  const router = useRouter()

  // Categorias disponíveis
  const categories = [
    { value: "anatomia", label: "Anatomia" },
    { value: "fisiologia", label: "Fisiologia" },
    { value: "avaliação", label: "Avaliação" },
    { value: "técnicas", label: "Técnicas" },
    { value: "patologias", label: "Patologias" },
    { value: "tratamento", label: "Tratamento" },
    { value: "estudos", label: "Estudos de Caso" },
    { value: "outros", label: "Outros" },
  ]

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddLink = () => {
    if (currentLinkTitle.trim() && currentLinkUrl.trim()) {
      try {
        // Validar URL
        new URL(currentLinkUrl)

        setRelatedLinks([...relatedLinks, { title: currentLinkTitle.trim(), url: currentLinkUrl.trim() }])
        setCurrentLinkTitle("")
        setCurrentLinkUrl("")
      } catch (e) {
        toast({
          title: "URL inválida",
          description: "Por favor, insira uma URL válida incluindo http:// ou https://",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveLink = (index: number) => {
    setRelatedLinks(relatedLinks.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para a anotação.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, insira o conteúdo da anotação.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const now = new Date().toISOString()

      await addStudyNote({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        dateCreated: now,
        dateModified: now,
        isImportant,
        relatedLinks,
      })

      toast({
        title: "Anotação salva",
        description: "Sua anotação foi salva com sucesso.",
      })

      router.push("/diario")
    } catch (error) {
      console.error("Erro ao salvar anotação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação. Tente novamente.",
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Nova Anotação</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Anotação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Título*
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Anatomia do Joelho"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Conteúdo*
                  </label>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-2">
                      <TabsTrigger value="edit">Editar</TabsTrigger>
                      <TabsTrigger value="preview">Visualizar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escreva sua anotação usando Markdown..."
                        className="min-h-[400px] font-mono"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="border rounded-md p-4 min-h-[400px] bg-white">
                        {content ? (
                          <Markdown content={content} />
                        ) : (
                          <p className="text-gray-400">Nada para visualizar. Comece a escrever no modo de edição.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  <p className="text-xs text-gray-500 mt-1">
                    Você pode usar Markdown para formatar seu texto (títulos, listas, links, etc).
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar Anotação"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Adicionar tag..."
                    className="rounded-r-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} className="rounded-l-none" disabled={!currentTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {tags.length === 0 && <p className="text-sm text-gray-500">Nenhuma tag adicionada</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Links Relacionados</label>
                <div className="space-y-2">
                  <Input
                    value={currentLinkTitle}
                    onChange={(e) => setCurrentLinkTitle(e.target.value)}
                    placeholder="Título do link"
                  />
                  <div className="flex">
                    <Input
                      value={currentLinkUrl}
                      onChange={(e) => setCurrentLinkUrl(e.target.value)}
                      placeholder="URL (https://...)"
                      className="rounded-r-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddLink()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddLink}
                      className="rounded-l-none"
                      disabled={!currentLinkTitle.trim() || !currentLinkUrl.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  {relatedLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate max-w-[80%]"
                        title={link.title}
                      >
                        {link.title}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {relatedLinks.length === 0 && <p className="text-sm text-gray-500">Nenhum link adicionado</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="important" className="text-sm font-medium">
                  Marcar como importante
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas de Markdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>
                  <code># Título</code> - Título principal
                </p>
                <p>
                  <code>## Subtítulo</code> - Subtítulo
                </p>
                <p>
                  <code>**texto**</code> - Texto em negrito
                </p>
                <p>
                  <code>*texto*</code> - Texto em itálico
                </p>
                <p>
                  <code>- item</code> - Item de lista
                </p>
                <p>
                  <code>[link](url)</code> - Link
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
