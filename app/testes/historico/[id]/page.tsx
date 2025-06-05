"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, Trash2, FileText, User, Calendar, Clock } from "lucide-react"
import { getTestResult, getPatient, deleteTestResult } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
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
import { jsPDF } from "jspdf"

// Dados dos testes funcionais
const functionalTests = {
  tug: { name: "TUG - Timed Up and Go", icon: "⏱️", href: "/testes/tug" },
  berg: { name: "Escala de Equilíbrio de Berg", icon: "⚖️", href: "/testes/berg" },
  tc6: { name: "Teste de Caminhada de 6 Minutos", icon: "🚶", href: "/testes/tc6" },
  "sentar-levantar": { name: "Teste de Sentar e Levantar", icon: "🪑", href: "/testes/sentar-levantar" },
  tinetti: { name: "Escala de Equilíbrio e Marcha de Tinetti", icon: "👣", href: "/testes/tinetti" },
  dinamometria: { name: "Dinamometria Manual", icon: "💪", href: "/testes/dinamometria" },
  "alcance-funcional": { name: "Teste de Alcance Funcional", icon: "🫱", href: "/testes/alcance-funcional" },
  "step-test": { name: "Step Test", icon: "🪜", href: "/testes/step-test" },
  "shuttle-walk": { name: "Shuttle Walk Test", icon: "🏃", href: "/testes/shuttle-walk" },
  goniometria: { name: "Goniometria", icon: "📐", href: "/testes/goniometria" },
  fms: { name: "Functional Movement Screen", icon: "🔄", href: "/testes/fms" },
  borg: { name: "Escala de Borg", icon: "😓", href: "/testes/borg" },
}

export default function TestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const testData = await getTestResult(testId)
        setTest(testData)

        if (testData?.patientId) {
          const patientData = await getPatient(testData.patientId)
          setPatient(patientData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do teste.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    loadData()
  }, [testId])

  const handleDelete = async () => {
    try {
      const success = await deleteTestResult(testId)
      if (success) {
        toast({
          title: "Teste excluído",
          description: "O registro do teste foi excluído com sucesso.",
        })
        router.push("/testes/historico")
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o registro do teste.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir teste:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o registro do teste.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const exportToPDF = () => {
    if (!test) return

    const doc = new jsPDF()
    const testInfo = functionalTests[test.testType as keyof typeof functionalTests]
    const testName = testInfo?.name || test.testType

    // Título
    doc.setFontSize(18)
    doc.text(`Resultado: ${testName}`, 105, 20, { align: "center" })

    // Data e Paciente
    doc.setFontSize(12)
    doc.text(`Data da avaliação: ${formatDate(test.date)}`, 20, 35)
    doc.text(`Paciente: ${patient ? patient.name : "Sem paciente associado"}`, 20, 42)

    // Resultado
    doc.setFontSize(14)
    doc.text("Resultado:", 20, 55)
    doc.setFontSize(12)
    doc.text(test.result, 20, 62)

    // Valores registrados
    doc.setFontSize(14)
    doc.text("Valores Registrados:", 20, 75)
    doc.setFontSize(12)

    let yPos = 82
    Object.entries(test.values).forEach(([key, value]) => {
      doc.text(`${key}: ${value as string}`, 25, yPos)
      yPos += 7
    })

    // Observações
    if (test.notes) {
      doc.setFontSize(14)
      doc.text("Observações:", 20, yPos + 5)
      doc.setFontSize(12)
      doc.text(test.notes, 20, yPos + 12)
    }

    // Rodapé
    doc.setFontSize(10)
    doc.text("Documento gerado por FisioBase - Aplicação Offline para Fisioterapeutas", 105, 280, { align: "center" })

    // Salvar o PDF
    doc.save(`Resultado_${test.testType}_${formatDate(test.date).replace(/\//g, "-")}.pdf`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Teste não encontrado</h2>
        <p className="text-gray-500 mb-4">O registro do teste solicitado não foi encontrado.</p>
        <Link href="/testes/historico">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar para o Histórico
          </Button>
        </Link>
      </div>
    )
  }

  const testInfo = functionalTests[test.testType as keyof typeof functionalTests]
  const testName = testInfo?.name || test.testType
  const testIcon = testInfo?.icon || "📋"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            {testIcon}
          </span>{" "}
          {testName}
        </h2>
        <div className="flex gap-2">
          <Link href="/testes/historico">
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
              <CardTitle>Detalhes do Teste</CardTitle>
              <CardDescription>Resultados e informações do teste aplicado em {formatDate(test.date)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Aplicação</h3>
                    <p className="text-lg font-semibold">{formatDate(test.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Horário</h3>
                    <p className="text-lg font-semibold">
                      {new Date(test.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resultado</h3>
                  <p className="text-lg font-semibold text-blue-900">{test.result}</p>
                </div>
              </div>

              {test.notes && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Observações</h3>
                  <p className="text-gray-700">{test.notes}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Valores Registrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                  {Object.entries(test.values).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <h4 className="text-xs font-medium text-gray-500">{key}</h4>
                      <p className="font-medium">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={exportToPDF} className="gap-1 bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4" /> Exportar PDF
                </Button>
                <Button
                  variant="outline"
                  className="gap-1 border-blue-800 text-blue-800 hover:bg-blue-50"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
                {testInfo?.href && (
                  <Link href={testInfo.href} className="ml-auto">
                    <Button variant="outline" className="gap-1">
                      Ver Detalhes do Teste
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {patient ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Informações do Paciente
                </CardTitle>
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
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Nenhum paciente associado a este teste.</p>
                <div className="mt-4">
                  <Link href="/pacientes">
                    <Button variant="outline" className="w-full">
                      Selecionar Paciente
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/testes/aplicar?teste=${test.testType}${patient ? `&paciente=${patient.id}` : ""}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">Aplicar Teste Novamente</Button>
              </Link>

              <Link href="/testes/historico">
                <Button variant="outline" className="w-full">
                  Ver Histórico Completo
                </Button>
              </Link>

              {patient && (
                <Link href={`/pacientes/${patient.id}?tab=testes`}>
                  <Button variant="outline" className="w-full">
                    Ver Testes do Paciente
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro de teste</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro deste teste.
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
