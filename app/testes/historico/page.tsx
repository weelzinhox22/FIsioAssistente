"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileText, Search, Trash2 } from "lucide-react"
import { getTestResults, getPatients, deleteTestResult } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados dos testes funcionais
const functionalTests = {
  tug: { name: "TUG - Timed Up and Go", icon: "⏱️" },
  berg: { name: "Escala de Equilíbrio de Berg", icon: "⚖️" },
  tc6: { name: "Teste de Caminhada de 6 Minutos", icon: "🚶" },
  "sentar-levantar": { name: "Teste de Sentar e Levantar", icon: "🪑" },
  tinetti: { name: "Escala de Equilíbrio e Marcha de Tinetti", icon: "👣" },
  dinamometria: { name: "Dinamometria Manual", icon: "💪" },
  "alcance-funcional": { name: "Teste de Alcance Funcional", icon: "🫱" },
  "step-test": { name: "Step Test", icon: "🪜" },
  "shuttle-walk": { name: "Shuttle Walk Test", icon: "🏃" },
  goniometria: { name: "Goniometria", icon: "📐" },
  fms: { name: "Functional Movement Screen", icon: "🔄" },
  borg: { name: "Escala de Borg", icon: "😓" },
}

export default function HistoricoTestesPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPatient, setFilterPatient] = useState<string>("all")
  const resultsPerPage = 10

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar resultados de testes
        const results = await getTestResults()
        setTestResults(results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))

        // Carregar pacientes para exibir nomes
        const patientsList = await getPatients()
        setPatients(patientsList)

        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico de testes.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar resultados com base nos critérios
  const filteredResults = useMemo(() => {
    return testResults.filter((test) => {
      const testName = functionalTests[test.testType as keyof typeof functionalTests]?.name || test.testType
      const patientName = patients.find((p) => p.id === test.patientId)?.name || ""

      // Filtrar por termo de busca
      const matchesSearch =
        testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.result.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtrar por tipo de teste
      const matchesType = filterType === "all" || test.testType === filterType

      // Filtrar por paciente
      const matchesPatient = filterPatient === "all" || test.patientId === filterPatient

      return matchesSearch && matchesType && matchesPatient
    })
  }, [testResults, patients, searchTerm, filterType, filterPatient])

  // Resetar para a primeira página quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType, filterPatient])

  // Paginação
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult)
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Função para obter o nome do paciente pelo ID
  const getPatientName = (patientId?: string) => {
    if (!patientId) return "Sem paciente"
    const patient = patients.find((p) => p.id === patientId)
    return patient ? patient.name : "Paciente não encontrado"
  }

  // Função para obter o nome do teste pelo ID
  const getTestName = (testType: string) => {
    return functionalTests[testType as keyof typeof functionalTests]?.name || testType
  }

  // Função para obter o ícone do teste pelo ID
  const getTestIcon = (testType: string) => {
    return functionalTests[testType as keyof typeof functionalTests]?.icon || "📋"
  }

  const handleDeleteTest = async () => {
    if (!testToDelete) return

    try {
      const success = await deleteTestResult(testToDelete)
      if (success) {
        setTestResults(testResults.filter((t) => t.id !== testToDelete))
        toast({
          title: "Teste excluído",
          description: "O registro do teste foi excluído com sucesso.",
        })
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
      setTestToDelete(null)
    }
  }

  const exportToCSV = () => {
    // Criar cabeçalho CSV
    let csv = "Data,Teste,Paciente,Resultado,Observações\n"

    // Adicionar linhas para cada resultado
    filteredResults.forEach((test) => {
      const date = formatDate(test.date)
      const testName = getTestName(test.testType)
      const patientName = getPatientName(test.patientId)
      const result = test.result
      const notes = test.notes || ""

      // Escapar campos com vírgulas
      const escapedPatientName = patientName.includes(",") ? `"${patientName}"` : patientName
      const escapedResult = result.includes(",") ? `"${result}"` : result
      const escapedNotes = notes.includes(",") ? `"${notes}"` : notes

      csv += `${date},${testName},${escapedPatientName},${escapedResult},${escapedNotes}\n`
    })

    // Criar blob e link para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `historico_testes_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Obter tipos de testes únicos para o filtro
  const uniqueTestTypes = useMemo(() => {
    const types = new Set<string>()
    testResults.forEach((test) => types.add(test.testType))
    return Array.from(types)
  }, [testResults])

  // Obter pacientes únicos para o filtro
  const uniquePatients = useMemo(() => {
    const patientIds = new Set<string>()
    testResults.forEach((test) => {
      if (test.patientId) patientIds.add(test.patientId)
    })
    return Array.from(patientIds)
  }, [testResults])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Histórico de Testes Funcionais</h2>
        <Link href="/testes">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar teste ou paciente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por teste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os testes</SelectItem>
              {uniqueTestTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getTestName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPatient} onValueChange={setFilterPatient}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os pacientes</SelectItem>
              {uniquePatients.map((id) => (
                <SelectItem key={id} value={id}>
                  {getPatientName(id)}
                </SelectItem>
              ))}
              <SelectItem value="none">Sem paciente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="w-full sm:w-auto border-blue-800 text-blue-800 hover:bg-blue-50"
            disabled={filteredResults.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando histórico de testes...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum teste encontrado com os filtros selecionados.</p>
              <Link href="/testes">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Aplicar Novo Teste</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Teste</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{formatDate(test.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden="true">
                            {getTestIcon(test.testType)}
                          </span>
                          <span>{getTestName(test.testType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {test.patientId ? (
                          <Link href={`/pacientes/${test.patientId}`} className="text-blue-600 hover:underline">
                            {getPatientName(test.patientId)}
                          </Link>
                        ) : (
                          <Badge variant="outline">Sem paciente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{test.result}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/testes/historico/${test.id}`}>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => setTestToDelete(test.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center my-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!testToDelete} onOpenChange={() => setTestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro de teste</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro deste teste.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
