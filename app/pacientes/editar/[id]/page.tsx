"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { getPatient, updatePatient } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import type { Patient } from "@/lib/types"

export default function EditarPacientePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [painLevel, setPainLevel] = useState(0)
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    profession: "",
    reference: "",
    emergencyContact: "",
    emergencyPhone: "",
    chiefComplaint: "",
    painLocation: "",
    painDuration: "",
    painFrequency: "",
    painIntensity: "0",
    painQuality: "",
    illnessHistory: "",
    onsetDate: "",
    injuryMechanism: "",
    aggravatingFactors: "",
    relievingFactors: "",
    previousTreatments: "",
    medicalHistory: "",
    surgicalHistory: "",
    medications: "",
    allergies: "",
    familyHistory: "",
    occupation: "",
    workActivities: "",
    physicalActivityLevel: "",
    physicalActivities: "",
    frequency: "",
    lifestyle: "",
    smokingStatus: "",
    alcoholConsumption: "",
    adlImpact: "",
    workImpact: "",
    sleepImpact: "",
    mobilityLimitations: "",
    assistiveDevices: "",
    posture: "",
    gait: "",
    rangeOfMotion: "",
    muscleStrength: "",
    muscleLength: "",
    neurological: "",
    specialTests: "",
    palpation: "",
    diagnosis: "",
    treatmentPlan: "",
    shortTermGoals: "",
    longTermGoals: "",
    patientExpectations: "",
    estimatedSessions: "",
    precautions: "",
  })

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setIsLoading(true)
        const patient = await getPatient(params.id)
        if (patient) {
          setFormData(patient)
          if (patient.painIntensity) {
            setPainLevel(Number(patient.painIntensity))
          }
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
        setIsLoading(false)
      }
    }

    loadPatient()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePainLevelChange = (value: number[]) => {
    setPainLevel(value[0])
    setFormData((prev) => ({ ...prev, painIntensity: value[0].toString() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.name || !formData.birthDate || !formData.gender) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const updatedPatient = await updatePatient(params.id, formData)
      if (updatedPatient) {
        toast({
          title: "Sucesso!",
          description: "Paciente atualizado com sucesso.",
        })
        router.push(`/pacientes/${params.id}`)
      } else {
        throw new Error("Falha ao atualizar paciente")
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o paciente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados do paciente...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Editar Ficha de Paciente</h2>
        <Link href={`/pacientes/${params.id}`}>
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="identification" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="identification">Identificação</TabsTrigger>
            <TabsTrigger value="complaint">Queixa e História</TabsTrigger>
            <TabsTrigger value="examination">Avaliação</TabsTrigger>
            <TabsTrigger value="treatment">Diagnóstico e Plano</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="pt-6">
              {/* IDENTIFICAÇÃO */}
              <TabsContent value="identification" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gênero <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                        <SelectItem value="nao_informado">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Contato Telefônico</Label>
                    <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profissão</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" name="address" value={formData.address || ""} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" name="state" value={formData.state || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">CEP</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Referência (como chegou até você)</Label>
                  <Input id="reference" name="reference" value={formData.reference || ""} onChange={handleChange} />
                </div>
              </TabsContent>

              {/* QUEIXA E HISTÓRIA */}
              <TabsContent value="complaint" className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">Queixa Principal</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chiefComplaint">
                        Descrição da Queixa Principal <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="chiefComplaint"
                        name="chiefComplaint"
                        value={formData.chiefComplaint || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descreva a queixa principal do paciente em suas próprias palavras"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="painLocation">Localização da Dor</Label>
                        <Input
                          id="painLocation"
                          name="painLocation"
                          value={formData.painLocation || ""}
                          onChange={handleChange}
                          placeholder="Ex: Lombar direita, joelho esquerdo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="painDuration">Duração da Dor</Label>
                        <Input
                          id="painDuration"
                          name="painDuration"
                          value={formData.painDuration || ""}
                          onChange={handleChange}
                          placeholder="Ex: 2 semanas, 3 meses"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="painFrequency">Frequência da Dor</Label>
                        <Select
                          value={formData.painFrequency || ""}
                          onValueChange={(value) => handleSelectChange("painFrequency", value)}
                        >
                          <SelectTrigger id="painFrequency">
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="constante">Constante</SelectItem>
                            <SelectItem value="intermitente">Intermitente</SelectItem>
                            <SelectItem value="ocasional">Ocasional</SelectItem>
                            <SelectItem value="rara">Rara</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="painQuality">Qualidade da Dor</Label>
                        <Select
                          value={formData.painQuality || ""}
                          onValueChange={(value) => handleSelectChange("painQuality", value)}
                        >
                          <SelectTrigger id="painQuality">
                            <SelectValue placeholder="Selecione o tipo de dor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aguda">Aguda</SelectItem>
                            <SelectItem value="latejante">Latejante</SelectItem>
                            <SelectItem value="queimacao">Queimação</SelectItem>
                            <SelectItem value="pressao">Pressão</SelectItem>
                            <SelectItem value="formigamento">Formigamento</SelectItem>
                            <SelectItem value="irradiada">Irradiada</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="painIntensity">Intensidade da Dor (EVA 0-10): {painLevel}</Label>
                      <Slider
                        id="painIntensity"
                        min={0}
                        max={10}
                        step={1}
                        value={[painLevel]}
                        onValueChange={handlePainLevelChange}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sem dor (0)</span>
                        <span>Moderada (5)</span>
                        <span>Pior dor possível (10)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">História da Doença Atual</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="illnessHistory">História da Doença Atual</Label>
                      <Textarea
                        id="illnessHistory"
                        name="illnessHistory"
                        value={formData.illnessHistory || ""}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Descreva a evolução da condição atual, incluindo início, progressão e sintomas associados"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="onsetDate">Data de Início dos Sintomas</Label>
                        <Input
                          id="onsetDate"
                          name="onsetDate"
                          type="date"
                          value={formData.onsetDate || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="injuryMechanism">Mecanismo de Lesão</Label>
                        <Input
                          id="injuryMechanism"
                          name="injuryMechanism"
                          value={formData.injuryMechanism || ""}
                          onChange={handleChange}
                          placeholder="Ex: Queda, movimento repetitivo"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aggravatingFactors">Fatores Agravantes</Label>
                        <Textarea
                          id="aggravatingFactors"
                          name="aggravatingFactors"
                          value={formData.aggravatingFactors || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="O que piora os sintomas?"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relievingFactors">Fatores Aliviantes</Label>
                        <Textarea
                          id="relievingFactors"
                          name="relievingFactors"
                          value={formData.relievingFactors || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="O que melhora os sintomas?"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousTreatments">Tratamentos Anteriores</Label>
                      <Textarea
                        id="previousTreatments"
                        name="previousTreatments"
                        value={formData.previousTreatments || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descreva tratamentos anteriores e seus resultados"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Histórico Médico</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Histórico de Condições Médicas</Label>
                      <Textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Liste condições médicas relevantes (hipertensão, diabetes, etc.)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="surgicalHistory">Histórico Cirúrgico</Label>
                        <Textarea
                          id="surgicalHistory"
                          name="surgicalHistory"
                          value={formData.surgicalHistory || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Liste cirurgias anteriores e datas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medications">Medicamentos em Uso</Label>
                        <Textarea
                          id="medications"
                          name="medications"
                          value={formData.medications || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Liste medicamentos atuais, dosagens e frequência"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Alergias</Label>
                        <Input
                          id="allergies"
                          name="allergies"
                          value={formData.allergies || ""}
                          onChange={handleChange}
                          placeholder="Medicamentos, látex, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="familyHistory">Histórico Familiar Relevante</Label>
                        <Input
                          id="familyHistory"
                          name="familyHistory"
                          value={formData.familyHistory || ""}
                          onChange={handleChange}
                          placeholder="Condições hereditárias relevantes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* AVALIAÇÃO */}
              <TabsContent value="examination" className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">História Social e Ocupacional</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Ocupação Atual</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workActivities">Atividades Laborais</Label>
                        <Textarea
                          id="workActivities"
                          name="workActivities"
                          value={formData.workActivities || ""}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Descreva as demandas físicas do trabalho"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="physicalActivityLevel">Nível de Atividade Física</Label>
                      <Select
                        value={formData.physicalActivityLevel || ""}
                        onValueChange={(value) => handleSelectChange("physicalActivityLevel", value)}
                      >
                        <SelectTrigger id="physicalActivityLevel">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentario">Sedentário</SelectItem>
                          <SelectItem value="leve">Levemente ativo</SelectItem>
                          <SelectItem value="moderado">Moderadamente ativo</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="muito_ativo">Muito ativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="physicalActivities">Atividades Físicas Praticadas</Label>
                        <Input
                          id="physicalActivities"
                          name="physicalActivities"
                          value={formData.physicalActivities || ""}
                          onChange={handleChange}
                          placeholder="Ex: caminhada, natação, musculação"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequência</Label>
                        <Input
                          id="frequency"
                          name="frequency"
                          value={formData.frequency || ""}
                          onChange={handleChange}
                          placeholder="Ex: 3x por semana, diariamente"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lifestyle">Estilo de Vida</Label>
                        <Input
                          id="lifestyle"
                          name="lifestyle"
                          value={formData.lifestyle || ""}
                          onChange={handleChange}
                          placeholder="Hábitos relevantes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smokingStatus">Tabagismo</Label>
                        <Select
                          value={formData.smokingStatus || ""}
                          onValueChange={(value) => handleSelectChange("smokingStatus", value)}
                        >
                          <SelectTrigger id="smokingStatus">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nao">Não fumante</SelectItem>
                            <SelectItem value="ex">Ex-fumante</SelectItem>
                            <SelectItem value="sim">Fumante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alcoholConsumption">Consumo de Álcool</Label>
                        <Select
                          value={formData.alcoholConsumption || ""}
                          onValueChange={(value) => handleSelectChange("alcoholConsumption", value)}
                        >
                          <SelectTrigger id="alcoholConsumption">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nao">Não consome</SelectItem>
                            <SelectItem value="ocasional">Ocasional</SelectItem>
                            <SelectItem value="moderado">Moderado</SelectItem>
                            <SelectItem value="frequente">Frequente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">Avaliação Funcional</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adlImpact">Impacto nas Atividades de Vida Diária (AVDs)</Label>
                      <Textarea
                        id="adlImpact"
                        name="adlImpact"
                        value={formData.adlImpact || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descreva como a condição afeta as atividades diárias (vestir-se, higiene, alimentação, etc.)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workImpact">Impacto no Trabalho</Label>
                        <Textarea
                          id="workImpact"
                          name="workImpact"
                          value={formData.workImpact || ""}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Como a condição afeta o desempenho no trabalho"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sleepImpact">Impacto no Sono</Label>
                        <Textarea
                          id="sleepImpact"
                          name="sleepImpact"
                          value={formData.sleepImpact || ""}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Como a condição afeta o sono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobilityLimitations">Limitações de Mobilidade</Label>
                        <Input
                          id="mobilityLimitations"
                          name="mobilityLimitations"
                          value={formData.mobilityLimitations || ""}
                          onChange={handleChange}
                          placeholder="Ex: dificuldade para subir escadas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assistiveDevices">Dispositivos Auxiliares</Label>
                        <Input
                          id="assistiveDevices"
                          name="assistiveDevices"
                          value={formData.assistiveDevices || ""}
                          onChange={handleChange}
                          placeholder="Ex: bengala, órtese"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Exame Físico</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="posture">Avaliação Postural</Label>
                        <Textarea
                          id="posture"
                          name="posture"
                          value={formData.posture || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Descreva alterações posturais observadas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gait">Avaliação da Marcha</Label>
                        <Textarea
                          id="gait"
                          name="gait"
                          value={formData.gait || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Descreva padrão de marcha e alterações"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rangeOfMotion">Amplitude de Movimento (ADM)</Label>
                        <Textarea
                          id="rangeOfMotion"
                          name="rangeOfMotion"
                          value={formData.rangeOfMotion || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre medidas de ADM relevantes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="muscleStrength">Força Muscular</Label>
                        <Textarea
                          id="muscleStrength"
                          name="muscleStrength"
                          value={formData.muscleStrength || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre avaliação de força muscular (escala de 0-5)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="muscleLength">Comprimento Muscular</Label>
                        <Textarea
                          id="muscleLength"
                          name="muscleLength"
                          value={formData.muscleLength || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre encurtamentos musculares relevantes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neurological">Avaliação Neurológica</Label>
                        <Textarea
                          id="neurological"
                          name="neurological"
                          value={formData.neurological || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre achados neurológicos (sensibilidade, reflexos, etc.)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialTests">Testes Especiais</Label>
                        <Textarea
                          id="specialTests"
                          name="specialTests"
                          value={formData.specialTests || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre resultados de testes especiais realizados"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="palpation">Palpação</Label>
                        <Textarea
                          id="palpation"
                          name="palpation"
                          value={formData.palpation || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Registre achados relevantes na palpação"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DIAGNÓSTICO E PLANO */}
              <TabsContent value="treatment" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnóstico Cinesiológico-Funcional</Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Descreva o diagnóstico fisioterapêutico, incluindo as disfunções encontradas e suas possíveis causas."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatmentPlan">Plano de Tratamento</Label>
                  <Textarea
                    id="treatmentPlan"
                    name="treatmentPlan"
                    value={formData.treatmentPlan || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Descreva as condutas fisioterapêuticas planejadas e sua justificativa."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shortTermGoals">Objetivos de Curto Prazo</Label>
                    <Textarea
                      id="shortTermGoals"
                      name="shortTermGoals"
                      value={formData.shortTermGoals || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Objetivos a serem alcançados nas próximas sessões"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longTermGoals">Objetivos de Longo Prazo</Label>
                    <Textarea
                      id="longTermGoals"
                      name="longTermGoals"
                      value={formData.longTermGoals || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Objetivos a serem alcançados ao final do tratamento"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientExpectations">Expectativas do Paciente</Label>
                    <Textarea
                      id="patientExpectations"
                      name="patientExpectations"
                      value={formData.patientExpectations || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="O que o paciente espera do tratamento"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedSessions">Estimativa de Sessões</Label>
                    <Input
                      id="estimatedSessions"
                      name="estimatedSessions"
                      value={formData.estimatedSessions || ""}
                      onChange={handleChange}
                      placeholder="Ex: 10-12 sessões"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precautions">Precauções e Contraindicações</Label>
                  <Textarea
                    id="precautions"
                    name="precautions"
                    value={formData.precautions || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Liste precauções e contraindicações específicas para este paciente"
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="flex justify-end mt-6 gap-2">
          <Link href={`/pacientes/${params.id}`}>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
