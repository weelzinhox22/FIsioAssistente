"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { getAllPatients } from "@/lib/patients"
import { addEvolution, getNextSessionNumber } from "@/lib/evolution"
import type { Patient } from "@/lib/types"

export default function NovaEvolucaoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [patientId, setPatientId] = useState("")
  const [sessionNumber, setSessionNumber] = useState(1)
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [content, setContent] = useState("")
  const [treatment, setTreatment] = useState("")
  const [observations, setObservations] = useState("")
  const [painLevel, setPainLevel] = useState(0)
  const [functionalProgress, setFunctionalProgress] = useState("")
  const [nextSessionGoals, setNextSessionGoals] = useState("")

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAllPatients()
        setPatients(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [toast])

  useEffect(() => {
    const updateSessionNumber = async () => {
      if (patientId) {
        try {
          const nextNumber = await getNextSessionNumber(patientId)
          setSessionNumber(nextNumber)
        } catch (error) {
          console.error("Erro ao obter número da sessão:", error)
        }
      }
    }

    updateSessionNumber()
  }, [patientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId) {
      toast({
        title: "Erro",
        description: "Selecione um paciente.",
        variant: "destructive",
      })
      return
    }

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

      await addEvolution({
        patientId,
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
        description: "Evolução registrada com sucesso!",
      })

      router.push("/evolucao")
    } catch (error) {
      console.error("Erro ao salvar evolução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a evolução. Tente novamente.",
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
        <h1 className="text-2xl font-bold">Nova Evolução</h1>
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
                  <Label htmlFor="patient">Paciente*</Label>
                  <Select value={patientId} onValueChange={setPatientId} disabled={isLoading}>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Save className="mr-2 h-4 w-4" /> Salvar Evolução
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
