"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getTemplateById } from "@/lib/templates"
import { getAllPatients } from "@/lib/patients"
import { useTemplateForPatient } from "@/lib/templates"
import type { MedicalRecordTemplate, Patient } from "@/lib/types"

export default function AplicarModeloPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("id")
  const { toast } = useToast()

  const [template, setTemplate] = useState<MedicalRecordTemplate | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [applyTemplateResult, setApplyTemplateResult] = useState<boolean | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Carregar o modelo
        if (templateId) {
          const templateData = await getTemplateById(templateId)
          setTemplate(templateData)
        }

        // Carregar pacientes
        const patientsData = await getAllPatients()
        setPatients(patientsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [templateId, toast])

  useEffect(() => {
    const applyTemplate = async () => {
      if (templateId && selectedPatientId) {
        try {
          setIsApplying(true)
          const success = await useTemplateForPatient(templateId, selectedPatientId)
          setApplyTemplateResult(success)
          if (success) {
            toast({
              title: "Sucesso",
              description: "Modelo aplicado ao paciente com sucesso!",
            })
            router.push(`/pacientes/${selectedPatientId}`)
          } else {
            throw new Error("Não foi possível aplicar o modelo ao paciente.")
          }
        } catch (error) {
          console.error("Erro ao aplicar modelo:", error)
          toast({
            title: "Erro",
            description: "Não foi possível aplicar o modelo ao paciente.",
            variant: "destructive",
          })
          setApplyTemplateResult(false)
        } finally {
          setIsApplying(false)
        }
      }
    }

    if (templateId && selectedPatientId) {
      applyTemplate()
    }
  }, [templateId, selectedPatientId, router, toast])

  const handleApplyTemplate = () => {
    if (!templateId || !selectedPatientId) {
      toast({
        title: "Erro",
        description: "Selecione um paciente para aplicar o modelo.",
        variant: "destructive",
      })
      return
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

  if (!template) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Modelo não encontrado</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>O modelo que você está tentando aplicar não foi encontrado.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/modelos")} className="mt-4">
          Voltar para Modelos
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
        <h1 className="text-2xl font-bold">Aplicar Modelo</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Modelo Selecionado</CardTitle>
          <CardDescription>Detalhes do modelo que será aplicado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Título:</span> {template.title}
            </div>
            <div>
              <span className="font-medium">Especialidade:</span> {template.specialty}
            </div>
            {template.condition && (
              <div>
                <span className="font-medium">Condição:</span> {template.condition}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Paciente</CardTitle>
          <CardDescription>Escolha o paciente para aplicar este modelo</CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhum paciente encontrado</AlertTitle>
              <AlertDescription>Você precisa cadastrar um paciente antes de aplicar um modelo.</AlertDescription>
            </Alert>
          ) : (
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
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
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleApplyTemplate} disabled={!selectedPatientId || isApplying}>
            {isApplying ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Aplicando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Aplicar Modelo
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
