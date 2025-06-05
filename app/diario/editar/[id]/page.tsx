"use client"

import { useState, useEffect } from "react"
import type { StudyNote } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { studyNotesStore } from "@/lib/db"

export default function EditarAnotacaoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<StudyNote | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("anatomia")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadNote = async () => {
      try {
        const notes = await studyNotesStore.getItem("notes") as StudyNote[] || []
        const foundNote = notes.find(note => note.id === params.id)
        
        if (foundNote) {
          setNote(foundNote)
          setTitle(foundNote.title)
          setContent(foundNote.content)
          setCategory(foundNote.category || "anatomia")
          setTags(foundNote.tags || [])
        } else {
          toast({
            title: "Erro",
            description: "Anotação não encontrada",
            variant: "destructive"
          })
          router.push("/diario")
        }
      } catch (error) {
        console.error("Erro ao carregar anotação:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a anotação",
          variant: "destructive"
        })
      }
    }

    loadNote()
  }, [params.id, router])

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      const notes = await studyNotesStore.getItem("notes") as StudyNote[] || []
      const updatedNotes = notes.map(item => 
        item.id === params.id 
          ? { 
              ...item, 
              title, 
              content, 
              category, 
              tags,
              updatedAt: new Date().toISOString() 
            } 
          : item
      )
      
      await studyNotesStore.setItem("notes", updatedNotes)
      
      toast({
        title: "Sucesso",
        description: "Anotação atualizada com sucesso"
      })
      
      router.push("/diario")
    } catch (error) {
      console.error("Erro ao salvar anotação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (!note) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Anotação</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Título da anotação"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anatomia">Anatomia</SelectItem>
              <SelectItem value="fisiologia">Fisiologia</SelectItem>
              <SelectItem value="biomecânica">Biomecânica</SelectItem>
              <SelectItem value="ortopedia">Ortopedia</SelectItem>
              <SelectItem value="neurologia">Neurologia</SelectItem>
              <SelectItem value="cardiorrespiratória">Cardiorrespiratória</SelectItem>
              <SelectItem value="pediatria">Pediatria</SelectItem>
              <SelectItem value="geriatria">Geriatria</SelectItem>
              <SelectItem value="esportiva">Esportiva</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Conteúdo da anotação" 
            className="min-h-32"
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1"
              >
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-800 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              id="tags" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Adicionar tag" 
            />
            <Button 
              type="button" 
              onClick={handleAddTag} 
              variant="outline"
              disabled={!newTag.trim()}
            >
              Adicionar
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push("/diario")}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
