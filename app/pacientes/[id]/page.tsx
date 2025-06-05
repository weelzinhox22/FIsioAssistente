"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit, FileText, Printer, Trash2 } from "lucide-react"
import { getPatient, deletePatient } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import type { Patient } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getPatient(params.id)
        if (data) {
          setPatient(data)
        } else {
          toast({
            title: "Erro",
            description: "Paciente não encontrado",
            variant: "destructive",
          })
          router.push("/pacientes")
        }
      } catch (error) {
        console.error("Erro ao carregar paciente:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do paciente",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPatient()
  }, [params.id, router])

  const handleDeletePatient = async () => {
    if (!patient) return

    try {
      setIsDeleting(true)
      const success = await deletePatient(patient.id)
      if (success) {
        toast({
          title: "Paciente excluído",
          description: "O paciente foi excluído com sucesso",
        })
        router.push("/pacientes")
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o paciente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir paciente:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o paciente",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handlePrint = () => {
    // Salvar o estado atual da aba
    const currentTab = activeTab

    // Mudar para a aba que queremos imprimir
    setActiveTab(currentTab)

    // Aguardar a renderização da aba
    setTimeout(() => {
      window.print()

      // Restaurar a aba original após a impressão
      setActiveTab(currentTab)
    }, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Button variant="ghost" className="mb-2" disabled>
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info" disabled>
              Informações
            </TabsTrigger>
            <TabsTrigger value="evolution" disabled>
              Evolução
            </TabsTrigger>
            <TabsTrigger value="records" disabled>
              Prontuário
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </Tabs>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Paciente não encontrado</p>
        <Link href="/pacientes">
          <Button>Voltar para lista de pacientes</Button>
        </Link>
      </div>
    )
  }

  const age = patient.birthDate
    ? Math.floor((new Date().getTime() - new Date(patient.birthDate).getTime()) / 31557600000)
    : "N/A"

  const lastEvolution =
    patient.evolution && patient.evolution.length > 0 ? patient.evolution[patient.evolution.length - 1] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <Link href="/pacientes">
            <Button variant="ghost" className="mb-2">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-gray-500">
            {age} anos • {formatDate(patient.birthDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/pacientes/editar/${patient.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          </Link>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="evolution">Evolução</TabsTrigger>
          <TabsTrigger value="records">Prontuário</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p>{patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                <p>{formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gênero</p>
                <p>{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p>{patient.cpf || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p>{patient.phone || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{patient.email || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p>{patient.address || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Profissão</p>
                <p>{patient.occupation || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Clínicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Diagnóstico</p>
                <p>{patient.diagnosis || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Médico Responsável</p>
                <p>{patient.referringDoctor || "Não informado"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Alergias</p>
                <p>{patient.allergies || "Nenhuma alergia registrada"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Medicamentos</p>
                <p>{patient.medications || "Nenhum medicamento registrado"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Histórico Médico</p>
                <p>{patient.medicalHistory || "Nenhum histórico registrado"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.notes || "Nenhuma observação registrada"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          {patient.evolution && patient.evolution.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Histórico de Evolução</h2>
                <Link href={`/evolucao/nova?patientId=${patient.id}`}>
                  <Button>Nova Evolução</Button>
                </Link>
              </div>

              {patient.evolution.map((ev, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{formatDate(ev.date)}</CardTitle>
                        <p className="text-sm text-gray-500">Sessão {index + 1}</p>
                      </div>
                      <Badge>{ev.type || "Consulta"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nível de Dor</p>
                        <p>EVA: {ev.painLevel || "N/A"}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fisioterapeuta</p>
                        <p>{ev.therapist || "Não informado"}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Procedimentos Realizados</p>
                      <p>{ev.procedures || "Não informado"}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Observações</p>
                      <p>{ev.notes || "Nenhuma observação"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Objetivos para Próxima Sessão</p>
                      <p>{ev.nextSessionGoals || "Não definidos"}</p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Link href={`/evolucao/${patient.id}/${index}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma evolução registrada para este paciente.</p>
              <Link href={`/evolucao/nova?patientId=${patient.id}`} passHref>
                <Button type="button">Registrar Primeira Evolução</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prontuário</h2>
            <Link href={`/modelos/aplicar?patientId=${patient.id}`}>
              <Button>Aplicar Modelo</Button>
            </Link>
          </div>

          {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
            patient.medicalRecords.map((record, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{record.title}</CardTitle>
                    <Badge>{record.specialty}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">Criado em {formatDate(record.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">{record.content}</pre>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" /> Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum prontuário registrado para este paciente.</p>
              <Link href={`/modelos/aplicar?patientId=${patient.id}`}>
                <Button>Criar Prontuário</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir paciente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o paciente {patient.name} e todos os seus
              dados.
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
