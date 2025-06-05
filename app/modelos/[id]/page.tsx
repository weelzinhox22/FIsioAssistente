"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Star, ArrowLeft, Edit, Trash, Copy, FileText, UserPlus } from "lucide-react"
import { getTemplateById, deleteTemplate, toggleFavorite } from "@/lib/templates"
import type { MedicalRecordTemplate } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ModeloDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [template, setTemplate] = useState<MedicalRecordTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true)
        const templateData = await getTemplateById(params.id)
        setTemplate(templateData)
      } catch (error) {
        console.error("Erro ao carregar modelo:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o modelo de prontuário.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplate()
  }, [params.id, toast])

  const handleToggleFavorite = async () => {
    if (!template) return

    try {
      const updatedTemplate = await toggleFavorite(template.id)
      setTemplate(updatedTemplate)
      toast({
        title: updatedTemplate.isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `O modelo "${template.title}" foi ${
          updatedTemplate.isFavorite ? "adicionado aos" : "removido dos"
        } favoritos.`,
      })
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar modelo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!template) return

    try {
      await deleteTemplate(template.id)
      toast({
        title: "Modelo excluído",
        description: `O modelo "${template.title}" foi excluído com sucesso.`,
      })
      router.push("/modelos")
    } catch (error) {
      console.error("Erro ao excluir modelo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o modelo.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Conteúdo copiado",
        description: "O conteúdo do modelo foi copiado para a área de transferência.",
      })
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência:", error)
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Modelo não encontrado</h3>
          <p className="text-gray-500 mt-2">O modelo que você está procurando não existe ou foi removido.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/modelos")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Modelos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/modelos")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
            <Star className={`mr-2 h-4 w-4 ${template.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
            {template.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </Button>

          <Button variant="outline" size="sm" onClick={() => router.push(`/modelos/editar/${template.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>

          <Button onClick={() => router.push(`/modelos/aplicar?id=${template.id}`)} className="ml-2">
            <UserPlus className="mr-2 h-4 w-4" /> Aplicar a Paciente
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir modelo</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o modelo "{template.title}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{template.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{template.specialty}</Badge>
                {template.condition && <Badge variant="outline">{template.condition}</Badge>}
                {template.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {template.content ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Conteúdo</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.content || "")}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap">{template.content}</pre>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="anamnesis" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
            <TabsTrigger value="physicalExam">Exame Físico</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
            <TabsTrigger value="treatmentPlan">Plano de Tratamento</TabsTrigger>
          </TabsList>

          <TabsContent value="anamnesis">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Anamnese</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.anamnesis || "")}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{template.anamnesis}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physicalExam">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Exame Físico</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.physicalExam || "")}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{template.physicalExam}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnosis">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Diagnóstico</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.diagnosis || "")}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{template.diagnosis}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatmentPlan">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Plano de Tratamento</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.treatmentPlan || "")}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{template.treatmentPlan}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
