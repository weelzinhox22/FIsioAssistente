"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadBodyChart, deleteBodyChart } from "@/lib/body-chart"
import { getPatient } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BodyChartDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chartId = params.id as string

  const [bodyChart, setBodyChart] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const chartData = await loadBodyChart(chartId)
        setBodyChart(chartData)

        if (chartData?.patientId) {
          const patientData = await getPatient(chartData.patientId)
          setPatient(patientData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [chartId])

  const handleDelete = async () => {
    try {
      const success = await deleteBodyChart(chartId)
      if (success) {
        alert("Body Chart excluído com sucesso!")
        router.push("/body-chart/historico")
      } else {
        alert("Não foi possível excluir o Body Chart.")
      }
    } catch (error) {
      console.error("Erro ao excluir Body Chart:", error)
      alert("Ocorreu um erro ao excluir o Body Chart.")
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const handleExportPDF = () => {
    // Implementação da exportação para PDF
    alert("Exportação para PDF em desenvolvimento")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!bodyChart) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Body Chart não encontrado</h2>
        <p className="text-gray-500 mb-4">O Body Chart solicitado não foi encontrado.</p>
        <Link href="/body-chart/historico">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar para o Histórico
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">{bodyChart.title}</h2>
        <div className="flex gap-2">
          <Link href="/body-chart/historico">
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Body Chart</CardTitle>
              <CardDescription>
                Body Chart criado em {formatDate(bodyChart.date)}
                {patient && ` para o paciente ${patient.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="anterior">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="anterior" disabled={!bodyChart.views.anterior}>
                    Anterior
                  </TabsTrigger>
                  <TabsTrigger value="posterior" disabled={!bodyChart.views.posterior}>
                    Posterior
                  </TabsTrigger>
                  <TabsTrigger value="lateral-esquerda" disabled={!bodyChart.views.lateralEsquerda}>
                    Lateral Esquerda
                  </TabsTrigger>
                  <TabsTrigger value="lateral-direita" disabled={!bodyChart.views.lateralDireita}>
                    Lateral Direita
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="anterior">
                  {bodyChart.views.anterior ? (
                    <div className="aspect-[3/4] w-full border rounded-md overflow-hidden bg-white">
                      <img
                        src={bodyChart.views.anterior || "/placeholder.svg"}
                        alt="Visão anterior do body chart"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Visão anterior não disponível</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="posterior">
                  {bodyChart.views.posterior ? (
                    <div className="aspect-[3/4] w-full border rounded-md overflow-hidden bg-white">
                      <img
                        src={bodyChart.views.posterior || "/placeholder.svg"}
                        alt="Visão posterior do body chart"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Visão posterior não disponível</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lateral-esquerda">
                  {bodyChart.views.lateralEsquerda ? (
                    <div className="aspect-[3/4] w-full border rounded-md overflow-hidden bg-white">
                      <img
                        src={bodyChart.views.lateralEsquerda || "/placeholder.svg"}
                        alt="Visão lateral esquerda do body chart"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Visão lateral esquerda não disponível</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lateral-direita">
                  {bodyChart.views.lateralDireita ? (
                    <div className="aspect-[3/4] w-full border rounded-md overflow-hidden bg-white">
                      <img
                        src={bodyChart.views.lateralDireita || "/placeholder.svg"}
                        alt="Visão lateral direita do body chart"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] w-full border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Visão lateral direita não disponível</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {bodyChart.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Observações</h3>
                  <p>{bodyChart.notes}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button onClick={handleExportPDF} className="gap-1 bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4" /> Exportar PDF
                </Button>
                <Button
                  variant="outline"
                  className="gap-1 border-blue-800 text-blue-800 hover:bg-blue-50"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {patient ? (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                  <p className="font-semibold">{patient.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                    <p>{formatDate(patient.birthDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gênero</h3>
                    <p>{patient.gender}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/pacientes/${patient.id}`}>
                    <Button className="w-full">Ver Ficha Completa</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Nenhum paciente associado a este Body Chart.</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/body-chart">
                <Button className="w-full bg-green-600 hover:bg-green-700">Criar Novo Body Chart</Button>
              </Link>

              <Link href="/body-chart/historico">
                <Button variant="outline" className="w-full">
                  Ver Histórico Completo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Body Chart</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este Body Chart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
