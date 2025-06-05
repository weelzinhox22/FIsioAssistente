"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Calendar, User, Edit, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getEvolution, deleteEvolution } from "@/lib/evolution"
import { getPatient } from "@/lib/patients"
import type { PatientEvolution, Patient } from "@/lib/types"

export default function EvolucaoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  const [evolution, setEvolution] = useState<PatientEvolution | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const evolutionData = await getEvolution(params.id)

        if (evolutionData) {
          setEvolution(evolutionData)
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

  const handleDelete = async () => {
    if (!evolution) return

    try {
      setIsDeleting(true)
      const success = await deleteEvolution(evolution.id)

      if (success) {
        toast({
          title: "Sucesso",
          description: "Evolução excluída com sucesso!",
        })
        router.push("/evolucao")
      } else {
        throw new Error("Não foi possível excluir a evolução.")
      }
    } catch (error) {
      console.error("Erro ao excluir evolução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a evolução.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
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
          <AlertDescription>A evolução que você está procurando não foi encontrada.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/evolucao")} className="mt-4">
          Voltar para Evoluções
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Evolução - Sessão #{evolution.sessionNumber}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/evolucao/editar/${evolution.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir esta evolução? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end space-x-2 mt-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Paciente:</span>
                <span>{patient.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Data da Sessão:</span>
                <span>{formatDate(evolution.date)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{evolution.content}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tratamento Realizado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{evolution.treatment}</p>
            </CardContent>
          </Card>

          {evolution.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Observações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{evolution.observations}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nível de Dor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold">{evolution.painLevel || 0}</div>
                <div className="text-sm text-gray-500 ml-2">/10</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className={`h-2.5 rounded-full ${
                    (evolution.painLevel || 0) <= 3
                      ? "bg-green-500"
                      : (evolution.painLevel || 0) <= 7
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${((evolution.painLevel || 0) / 10) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sem dor</span>
                <span>Moderada</span>
                <span>Intensa</span>
              </div>
            </CardContent>
          </Card>

          {evolution.functionalProgress && (
            <Card>
              <CardHeader>
                <CardTitle>Progresso Funcional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{evolution.functionalProgress}</p>
              </CardContent>
            </Card>
          )}

          {evolution.nextSessionGoals && (
            <Card>
              <CardHeader>
                <CardTitle>Objetivos para Próxima Sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{evolution.nextSessionGoals}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-gray-500 mt-4">
            <p>Criado em: {format(new Date(evolution.createdAt), "dd/MM/yyyy HH:mm")}</p>
            <p>Última atualização: {format(new Date(evolution.updatedAt), "dd/MM/yyyy HH:mm")}</p>
          </div>

          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}
