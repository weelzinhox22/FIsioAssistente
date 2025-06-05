"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { getTemplateById, updateTemplate } from "@/lib/templates"
import type { MedicalRecordTemplate } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function EditarModeloPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formType, setFormType] = useState<"sections" | "content">("sections")
  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    condition: "",
    anamnesis: "",
    physicalExam: "",
    diagnosis: "",
    treatmentPlan: "",
    content: "",
    tags: "",
  })
  const [previewTab, setPreviewTab] = useState("edit")

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true)
        const template = await getTemplateById(params.id)

        if (!template) {
          toast({
            title: "Erro",
            description: "Modelo não encontrado.",
            variant: "destructive",
          })
          router.push("/modelos")
          return
        }

        // Determinar o tipo de formulário com base nos dados do modelo
        const hasContent = !!template.content
        setFormType(hasContent ? "content" : "sections")

        setFormData({
          title: template.title || "",
          specialty: template.specialty || "",
          condition: template.condition || "",
          anamnesis: template.anamnesis || "",
          physicalExam: template.physicalExam || "",
          diagnosis: template.diagnosis || "",
          treatmentPlan: template.treatmentPlan || "",
          content: template.content || "",
          tags: template.tags?.join(", ") || "",
        })
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
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const templateData: Partial<MedicalRecordTemplate> = {
        title: formData.title,
        specialty: formData.specialty,
        condition: formData.condition,
        tags: tagsArray,
      }

      if (formType === "sections") {
        Object.assign(templateData, {
          anamnesis: formData.anamnesis,
          physicalExam: formData.physicalExam,
          diagnosis: formData.diagnosis,
          treatmentPlan: formData.treatmentPlan,
          content: undefined, // Remover o conteúdo único se existir
        })
      } else {
        Object.assign(templateData, {
          content: formData.content,
          anamnesis: undefined, // Remover as seções se existirem
          physicalExam: undefined,
          diagnosis: undefined,
          treatmentPlan: undefined,
        })
      }

      await updateTemplate(params.id, templateData)
      toast({
        title: "Modelo atualizado",
        description: "O modelo de prontuário foi atualizado com sucesso.",
      })
      router.push(`/modelos/${params.id}`)
    } catch (error) {
      console.error("Erro ao atualizar modelo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o modelo de prontuário.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/modelos/${params.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Editar Modelo de Prontuário</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Avaliação de Lombalgia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Ortopedia"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condição (opcional)</Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="Ex: Lombalgia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Ex: lombar, coluna, dor"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formType === "sections" ? "default" : "outline"}
                onClick={() => setFormType("sections")}
              >
                Seções Separadas
              </Button>
              <Button
                type="button"
                variant={formType === "content" ? "default" : "outline"}
                onClick={() => setFormType("content")}
              >
                Conteúdo Único
              </Button>
            </div>
          </div>

          {formType === "sections" ? (
            <Tabs value={previewTab} onValueChange={setPreviewTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Visualizar</TabsTrigger>
              </TabsList>

              <TabsContent value="edit">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Anamnese</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="anamnesis"
                        value={formData.anamnesis}
                        onChange={handleChange}
                        placeholder="Digite o conteúdo da anamnese..."
                        className="min-h-[200px] font-mono"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exame Físico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="physicalExam"
                        value={formData.physicalExam}
                        onChange={handleChange}
                        placeholder="Digite o conteúdo do exame físico..."
                        className="min-h-[200px] font-mono"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnóstico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        placeholder="Digite o conteúdo do diagnóstico..."
                        className="min-h-[200px] font-mono"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plano de Tratamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="treatmentPlan"
                        value={formData.treatmentPlan}
                        onChange={handleChange}
                        placeholder="Digite o conteúdo do plano de tratamento..."
                        className="min-h-[200px] font-mono"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Anamnese</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap">{formData.anamnesis}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exame Físico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap">{formData.physicalExam}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnóstico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap">{formData.diagnosis}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plano de Tratamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap">{formData.treatmentPlan}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs value={previewTab} onValueChange={setPreviewTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Visualizar</TabsTrigger>
              </TabsList>

              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Conteúdo do Modelo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Digite o conteúdo completo do modelo..."
                      className="min-h-[600px] font-mono"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>Visualização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap">{formData.content}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <Card>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => router.push(`/modelos/${params.id}`)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
