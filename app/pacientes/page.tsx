"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, Eye, FilePlus, Search, Trash2, UserPlus, Users } from "lucide-react"
import { type Patient, getPatients, deletePatient } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Skeleton } from "@/components/ui/skeleton"

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: "ascending" | "descending" } | null>(
    null,
  )
  const patientsPerPage = 10

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients()
        // Ordenar pacientes por nome por padrão
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
        setPatients(sortedData)
        setFilteredPatients(sortedData)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      const filtered = patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTermLower) ||
          patient.email?.toLowerCase().includes(searchTermLower) ||
          patient.phone?.toLowerCase().includes(searchTermLower) ||
          patient.cpf?.toLowerCase().includes(searchTermLower) ||
          (patient.birthDate && formatDate(patient.birthDate).toLowerCase().includes(searchTermLower)),
      )
      setFilteredPatients(filtered)
      setCurrentPage(1)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  // Função para ordenar pacientes
  const requestSort = (key: keyof Patient) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedData = [...filteredPatients].sort((a, b) => {
      if (!a[key] && !b[key]) return 0
      if (!a[key]) return 1
      if (!b[key]) return -1

      const aValue = a[key] as string
      const bValue = b[key] as string

      if (direction === "ascending") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    setFilteredPatients(sortedData)
  }

  // Calcular estatísticas
  const activePatients = patients.filter((p) => p.evolution && p.evolution.length > 0).length
  const sessionsThisMonth = patients.reduce((total, patient) => {
    if (!patient.evolution) return total

    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()

    const sessionsThisMonth = patient.evolution.filter((ev) => {
      if (!ev.date) return false
      try {
        const date = new Date(ev.date)
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear
      } catch (error) {
        console.error("Erro ao processar data:", error)
        return false
      }
    }).length

    return total + sessionsThisMonth
  }, 0)

  // Paginação
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleDeletePatient = async () => {
    if (!patientToDelete) return

    try {
      setIsDeleting(true)
      const success = await deletePatient(patientToDelete)
      if (success) {
        setPatients(patients.filter((p) => p.id !== patientToDelete))
        toast({
          title: "Paciente excluído",
          description: "O paciente foi excluído com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o paciente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o paciente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setPatientToDelete(null)
    }
  }

  const getSortIndicator = (key: keyof Patient) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Painel de Controle</TabsTrigger>
          <TabsTrigger value="patients">Lista de Pacientes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pacientes Ativos</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h3 className="text-2xl font-bold text-blue-900">{activePatients}</h3>
                    )}
                  </div>
                  <Users className="h-8 w-8 text-blue-800" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sessões Este Mês</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h3 className="text-2xl font-bold text-blue-900">{sessionsThisMonth}</h3>
                    )}
                  </div>
                  <FilePlus className="h-8 w-8 text-blue-800" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Pacientes</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h3 className="text-2xl font-bold text-blue-900">{patients.length}</h3>
                    )}
                  </div>
                  <Users className="h-8 w-8 text-blue-800" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/pacientes/novo">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <UserPlus className="mr-2 h-4 w-4" /> Nova Ficha de Paciente
              </Button>
            </Link>

            <Link href="/pacientes/exemplos">
              <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                <FilePlus className="mr-2 h-4 w-4" /> Adicionar Exemplos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/body-chart">
              <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                Body Chart
              </Button>
            </Link>

            <Link href="/calculadora">
              <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                Calculadora Clínica
              </Button>
            </Link>

            <Link href="/evolucao">
              <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                Evolução do Paciente
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : patients.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Pacientes Recentes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data de Nascimento</TableHead>
                    <TableHead>Última Consulta</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.slice(0, 5).map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{formatDate(patient.birthDate)}</TableCell>
                      <TableCell>
                        {patient.evolution && patient.evolution.length > 0
                          ? formatDate(patient.evolution[patient.evolution.length - 1].date)
                          : "Sem consultas"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/pacientes/${patient.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {patients.length > 5 && (
                <div className="mt-2 text-right">
                  <Button
                    variant="link"
                    className="text-blue-800"
                    onClick={() => document.querySelector('[data-value="patients"]')?.click()}
                  >
                    Ver todos os pacientes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum paciente cadastrado.</p>
              <Link href="/pacientes/novo">
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Paciente
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="patients">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar paciente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Link href="/pacientes/novo">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Novo Paciente
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum paciente encontrado.</p>
                <Link href="/pacientes/novo">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Cadastrar Paciente
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => requestSort("name")}>
                          Nome {getSortIndicator("name")}
                        </TableHead>
                        <TableHead
                          className="hidden md:table-cell cursor-pointer hover:bg-gray-50"
                          onClick={() => requestSort("birthDate")}
                        >
                          Data de Nascimento {getSortIndicator("birthDate")}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(patient.birthDate)}</TableCell>
                          <TableCell className="hidden md:table-cell">{patient.phone || "Não informado"}</TableCell>
                          <TableCell>
                            {patient.evolution && patient.evolution.length > 0 ? (
                              <Badge className="bg-green-600">Ativo</Badge>
                            ) : (
                              <Badge variant="outline">Novo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Link href={`/pacientes/${patient.id}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Visualizar</span>
                                </Button>
                              </Link>
                              <Link href={`/pacientes/editar/${patient.id}`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPatientToDelete(patient.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
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
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!patientToDelete}
        onOpenChange={(open) => !isDeleting && setPatientToDelete(open ? patientToDelete : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir paciente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o paciente e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
