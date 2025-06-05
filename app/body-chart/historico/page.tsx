"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Search, Trash2 } from "lucide-react"
import { getAllBodyCharts, deleteBodyChart } from "@/lib/body-chart"
import { getPatients } from "@/lib/db"
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

export default function HistoricoBodyChartPage() {
  const [bodyCharts, setBodyCharts] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [filteredCharts, setFilteredCharts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [chartToDelete, setChartToDelete] = useState<string | null>(null)
  const chartsPerPage = 10

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar body charts
        const charts = await getAllBodyCharts()
        setBodyCharts(charts)

        // Carregar pacientes para exibir nomes
        const patientsList = await getPatients()
        setPatients(patientsList)

        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = bodyCharts.filter((chart) => {
        const patientName = patients.find((p) => p.id === chart.patientId)?.name || ""

        return (
          chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setFilteredCharts(filtered)
      setCurrentPage(1)
    } else {
      setFilteredCharts(bodyCharts)
    }
  }, [searchTerm, bodyCharts, patients])

  // Paginação
  const indexOfLastChart = currentPage * chartsPerPage
  const indexOfFirstChart = indexOfLastChart - chartsPerPage
  const currentCharts = filteredCharts.slice(indexOfFirstChart, indexOfLastChart)
  const totalPages = Math.ceil(filteredCharts.length / chartsPerPage)

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

  const handleDeleteChart = async () => {
    if (!chartToDelete) return

    try {
      const success = await deleteBodyChart(chartToDelete)
      if (success) {
        setBodyCharts(bodyCharts.filter((c) => c.id !== chartToDelete))
        alert("Body Chart excluído com sucesso!")
      } else {
        alert("Não foi possível excluir o Body Chart.")
      }
    } catch (error) {
      console.error("Erro ao excluir Body Chart:", error)
      alert("Ocorreu um erro ao excluir o Body Chart.")
    } finally {
      setChartToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Histórico de Body Charts</h2>
        <Link href="/body-chart">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por título ou paciente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link href="/body-chart">
          <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">Novo Body Chart</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">Carregando histórico de Body Charts...</div>
          ) : filteredCharts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum Body Chart encontrado.</p>
              <Link href="/body-chart">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Criar Novo Body Chart</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCharts.map((chart) => (
                    <TableRow key={chart.id}>
                      <TableCell>{formatDate(chart.date)}</TableCell>
                      <TableCell>{chart.title}</TableCell>
                      <TableCell>
                        {chart.patientId ? (
                          <Link href={`/pacientes/${chart.patientId}`} className="text-blue-600 hover:underline">
                            {getPatientName(chart.patientId)}
                          </Link>
                        ) : (
                          "Sem paciente"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/body-chart/${chart.id}`}>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => setChartToDelete(chart.id)}>
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

      <AlertDialog open={!!chartToDelete} onOpenChange={() => setChartToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Body Chart</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este Body Chart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChart} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
