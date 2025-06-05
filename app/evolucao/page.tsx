"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, Plus, Calendar, Clock, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllPatients } from "@/lib/patients"
import { getPatientEvolutions } from "@/lib/evolution"
import type { Patient, PatientEvolution } from "@/lib/types"

export default function EvolucaoPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [evolutions, setEvolutions] = useState<PatientEvolution[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAllPatients()
        setPatients(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [])

  useEffect(() => {
    const loadEvolutions = async () => {
      if (selectedPatientId) {
        try {
          setIsLoading(true)
          const data = await getPatientEvolutions(selectedPatientId)
          setEvolutions(data)
        } catch (error) {
          console.error("Erro ao carregar evoluções:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setEvolutions([])
      }
    }

    loadEvolutions()
  }, [selectedPatientId])

  const filteredEvolutions = evolutions.filter((evolution) => {
    if (!searchTerm.trim()) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      evolution.content.toLowerCase().includes(searchLower) ||
      evolution.treatment.toLowerCase().includes(searchLower) ||
      evolution.observations?.toLowerCase().includes(searchLower) ||
      evolution.sessionNumber.toString().includes(searchLower) ||
      format(new Date(evolution.date), "dd/MM/yyyy").includes(searchLower)
    )
  })

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? patient.name : "Paciente não encontrado"
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Evolução de Pacientes</h1>
          <p className="text-gray-500 mb-4">Acompanhe o progresso dos seus pacientes ao longo do tratamento</p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => router.push("/evolucao/nova")}
          disabled={patients.length === 0}
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Evolução
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar evoluções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={!selectedPatientId}
            />
          </div>
        </div>
        <div>
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : patients.length === 0 ? (
        <Alert>
          <AlertDescription>
            Nenhum paciente cadastrado. Cadastre um paciente antes de registrar evoluções.
          </AlertDescription>
        </Alert>
      ) : !selectedPatientId ? (
        <Alert>
          <AlertDescription>Selecione um paciente para visualizar suas evoluções.</AlertDescription>
        </Alert>
      ) : filteredEvolutions.length === 0 ? (
        <Alert>
          <AlertDescription>
            {searchTerm
              ? "Nenhuma evolução encontrada para os critérios de busca."
              : "Nenhuma evolução registrada para este paciente."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvolutions.map((evolution) => (
            <Card
              key={evolution.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/evolucao/${evolution.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Sessão #{evolution.sessionNumber}</CardTitle>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(evolution.date)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span>{getPatientName(evolution.patientId)}</span>
                </div>
                <p className="text-sm line-clamp-3">{evolution.content}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Criado em {format(new Date(evolution.createdAt), "dd/MM/yyyy")}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0">
                  <FileText className="h-4 w-4 mr-1" /> Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
