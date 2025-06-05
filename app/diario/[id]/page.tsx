"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Star, StarOff, Edit, Trash2, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getStudyNote, toggleNoteImportance, deleteStudyNote } from "@/lib/study-notes"
import type { StudyNote } from "@/lib/types"
import { Markdown } from "@/components/markdown"

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<StudyNote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadNote = async () => {
      try {
        const data = await getStudyNote(params.id)
        setNote(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar anotação:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a anotação. Tente novamente mais tarde.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadNote()
  }, [params.id, toast])

  const handleToggleImportant = async () => {
    if (!note) return

    try {
      const updatedNote = await toggleNoteImportance(note.id)
      if (updatedNote) {
        setNote(updatedNote)

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

  const handleDelete = async () => {
    if (!note) return

    try {
      setIsDeleting(true)
      await deleteStudyNote(note.id)

      toast({
        title: "Anotação excluída",
        description: "A anotação foi excluída com sucesso.",
      })

      router.push("/diario")
    } catch (error) {
      console.error("Erro ao excluir anotação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a anotação. Tente novamente.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Anotação não encontrada</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>A anotação que você está procurando não existe ou foi removida.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/diario")} className="mt-4">
          Voltar para o Diário Acadêmico
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Visualizar Anotação</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{note.title}</CardTitle>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Criado em {formatDate(note.dateCreated)}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Modificado em {formatDate(note.dateModified)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleImportant}
                    title={note.isImportant ? "Remover dos importantes" : "Marcar como importante"}
                  >
                    {note.isImportant ? (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/diario/editar/${note.id}`)}
                    title="Editar anotação"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Excluir anotação">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                      </DialogHeader>
                      <p>Tem certeza que deseja excluir a anotação "{note.title}"? Esta ação não pode ser desfeita.</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" disabled={isDeleting}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                          {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <Markdown content={note.content} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Categoria</h3>
                <Badge>{note.category}</Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {note.relatedLinks && note.relatedLinks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Links Relacionados</h3>
                  <ul className="space-y-2">
                    {note.relatedLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              Voltar
            </Button>
            <Button className="w-full" onClick={() => router.push(`/diario/editar/${note.id}`)}>
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
