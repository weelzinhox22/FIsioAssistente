"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getEvolution, updateEvolution } from "@/lib/evolution"
import { getPatient } from "@/lib/patients"
import type { PatientEvolution, Patient } from "@/lib/types"

export default function EditarEvolucaoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  const [evolution, setEvolution] = useState<PatientEvolution | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [sessionNumber, setSessionNumber] = useState(1)
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [content, setContent] = useState("")
  const [treatment, setTreatment] = useState("")
  const [observations, setObservations] = useState("")
  const [painLevel, setPainLevel] = useState(0)
  const [functionalProgress, setFunctionalProgress] = useState("")
  const [nextSessionGoals, setNextSessionGoals] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const evolutionData = await getEvolution(params.id)

        if (evolutionData) {
          setEvolution(evolutionData)
          setSessionNumber(evolutionData.sessionNumber)
          setDate(evolutionData.date)
          setContent(evolutionData.content)
          setTreatment(evolutionData.treatment)
          setObservations(evolutionData.observations || "")
          setPainLevel(evolutionData.painLevel || 0)
          setFunctionalProgress(evolutionData.functionalProgress || "")
          setNextSessionGoals(evolutionData.nextSessionGoals || "")

          const patientData = await getPatient(evolutionData.patientId)
          setPatient(patientData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da evolução.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!evolution) return

    if (!content) {
      toast({
        title: "Erro",
        description: "O conteúdo da evolução é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!treatment) {
      toast({
        title: "Erro",
        description: "O tratamento realizado é obrigatório.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      await updateEvolution(evolution.id, {
        sessionNumber,
        date,
        content,
        treatment,
        observations,
        painLevel,
        functionalProgress,
        nextSessionGoals,
      })

      toast({
        title: "Sucesso",
        description: "Evolução atualizada com sucesso!",
      })

      router.push(`/evolucao/${evolution.id}`)
    } catch (error) {
      console.error("Erro ao atualizar evolução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a evolução. Tente novamente.",
        variant: "destructive",
      })
      setIsSaving(false)
    }
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </div>
    )
  }

  if (!evolution || !patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Evolução não encontrada</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>A evolução que você está tentando editar não foi encontrada.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/evolucao")} className="mt-4">
          Voltar para Evoluções
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
        <h1 className="text-2xl font-bold">Editar Evolução</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patient">Paciente</Label>
                  <Input id="patient" value={patient.name} disabled />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionNumber">Número da Sessão</Label>
                    <Input
                      id="sessionNumber"
                      type="number"
                      value={sessionNumber}
                      onChange={(e) => setSessionNumber(Number.parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data da Sessão</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução e Tratamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Evolução do Paciente*</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Descreva a evolução do paciente, sintomas relatados, etc."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="treatment">Tratamento Realizado*</Label>
                  <Textarea
                    id="treatment"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Descreva as técnicas e procedimentos realizados nesta sessão"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observações Adicionais</Label>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações relevantes, intercorrências, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliação da Dor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Nível de Dor (0-10)</Label>
                <div className="space-y-2">
                  <Slider
                    value={[painLevel]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => setPainLevel(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sem dor</span>
                    <span>Dor moderada</span>
                    <span>Dor intensa</span>
                  </div>
                  <div className="text-center font-bold text-lg mt-2">{painLevel}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progresso e Planejamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="functionalProgress">Progresso Funcional</Label>
                  <Textarea
                    id="functionalProgress"
                    value={functionalProgress}
                    onChange={(e) => setFunctionalProgress(e.target.value)}
                    placeholder="Descreva o progresso funcional do paciente"
                  />
                </div>

                <div>
                  <Label htmlFor="nextSessionGoals">Objetivos para Próxima Sessão</Label>
                  <Textarea
                    id="nextSessionGoals"
                    value={nextSessionGoals}
                    onChange={(e) => setNextSessionGoals(e.target.value)}
                    placeholder="Defina os objetivos para a próxima sessão"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
