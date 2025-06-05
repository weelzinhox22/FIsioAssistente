"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Clock, AlertTriangle } from "lucide-react"
import { getPatients, addTestResult } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"

// Dados dos testes funcionais
const functionalTests = [
  {
    id: "tug",
    name: "TUG - Timed Up and Go",
    fields: [
      { id: "time", label: "Tempo (segundos)", type: "number", required: true },
      {
        id: "device",
        label: "Dispositivo de auxílio utilizado",
        type: "select",
        options: ["Nenhum", "Bengala", "Andador", "Outro"],
      },
    ],
    getResult: (values: Record<string, any>) => {
      const time = Number.parseFloat(values.time || "0")
      if (time < 10) return "Mobilidade normal, baixo risco de quedas"
      if (time < 20) return "Boa mobilidade, risco moderado de quedas"
      if (time < 30) return "Mobilidade reduzida, alto risco de quedas"
      return "Mobilidade severamente comprometida, risco muito alto de quedas"
    },
  },
  {
    id: "berg",
    name: "Escala de Equilíbrio de Berg",
    fields: [
      {
        id: "item1",
        label: "1. Posição sentada para posição em pé",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item2",
        label: "2. Permanecer em pé sem apoio",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item3",
        label: "3. Permanecer sentado sem apoio",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item4",
        label: "4. Posição em pé para posição sentada",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      { id: "item5", label: "5. Transferências", type: "select", options: ["0", "1", "2", "3", "4"], required: true },
      {
        id: "item6",
        label: "6. Permanecer em pé com os olhos fechados",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item7",
        label: "7. Permanecer em pé com os pés juntos",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item8",
        label: "8. Alcançar a frente com os braços estendidos",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item9",
        label: "9. Pegar um objeto do chão",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item10",
        label: "10. Virar-se para olhar para trás",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item11",
        label: "11. Girar 360 graus",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item12",
        label: "12. Posicionar os pés alternadamente no degrau",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item13",
        label: "13. Permanecer em pé com um pé à frente",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
      {
        id: "item14",
        label: "14. Permanecer em pé sobre um pé",
        type: "select",
        options: ["0", "1", "2", "3", "4"],
        required: true,
      },
    ],
    getResult: (values: Record<string, any>) => {
      let total = 0
      for (let i = 1; i <= 14; i++) {
        total += Number.parseInt(values[`item${i}`] || "0")
      }

      if (total < 36) return `${total}/56 - Alto risco de quedas`
      if (total < 45) return `${total}/56 - Moderado risco de quedas`
      return `${total}/56 - Baixo risco de quedas`
    },
  },
  {
    id: "tc6",
    name: "Teste de Caminhada de 6 Minutos",
    fields: [
      { id: "distance", label: "Distância percorrida (metros)", type: "number", required: true },
      { id: "initialHR", label: "Frequência cardíaca inicial (bpm)", type: "number" },
      { id: "finalHR", label: "Frequência cardíaca final (bpm)", type: "number" },
      { id: "initialSpO2", label: "SpO2 inicial (%)", type: "number" },
      { id: "finalSpO2", label: "SpO2 final (%)", type: "number" },
      {
        id: "initialBorg",
        label: "Escala de Borg inicial (0-10)",
        type: "select",
        options: ["0", "0.5", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        id: "finalBorg",
        label: "Escala de Borg final (0-10)",
        type: "select",
        options: ["0", "0.5", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    getResult: (values: Record<string, any>) => {
      const distance = Number.parseFloat(values.distance || "0")
      if (distance < 350) return `${distance}m - Capacidade funcional severamente reduzida`
      if (distance < 450) return `${distance}m - Capacidade funcional moderadamente reduzida`
      if (distance < 550) return `${distance}m - Capacidade funcional levemente reduzida`
      return `${distance}m - Capacidade funcional normal`
    },
  },
  {
    id: "sentar-levantar",
    name: "Teste de Sentar e Levantar",
    fields: [
      { id: "repetitions", label: "Número de repetições em 30 segundos", type: "number", required: true },
      {
        id: "pain",
        label: "Presença de dor",
        type: "select",
        options: ["Não", "Sim - Leve", "Sim - Moderada", "Sim - Intensa"],
      },
      { id: "painLocation", label: "Localização da dor (se presente)", type: "text" },
    ],
    getResult: (values: Record<string, any>) => {
      const reps = Number.parseInt(values.repetitions || "0")
      if (reps < 8) return `${reps} repetições - Desempenho abaixo da média`
      if (reps < 12) return `${reps} repetições - Desempenho na média`
      if (reps < 15) return `${reps} repetições - Desempenho acima da média`
      return `${reps} repetições - Desempenho muito acima da média`
    },
  },
  // Outros testes podem ser adicionados aqui
]

export default function AplicarTestePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("teste")
  const patientId = searchParams.get("paciente")

  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedTest, setSelectedTest] = useState<string>(testId || "")
  const [selectedPatient, setSelectedPatient] = useState<string>(patientId || "")
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [notes, setNotes] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Cronômetro para o teste TUG
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Encontrar o teste selecionado
  const testInfo = functionalTests.find((test) => test.id === selectedTest)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [])

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro de validação quando o campo é preenchido
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!selectedTest) {
      errors.test = "Por favor, selecione um teste para aplicar."
      return errors
    }

    // Verificar campos obrigatórios
    const test = functionalTests.find((t) => t.id === selectedTest)
    if (test) {
      const requiredFields = test.fields.filter((f) => f.required).map((f) => f.id)

      for (const field of requiredFields) {
        if (!formValues[field]) {
          errors[field] = "Este campo é obrigatório."
        } else if (test.fields.find((f) => f.id === field)?.type === "number") {
          const value = Number(formValues[field])
          if (isNaN(value) || value < 0) {
            errors[field] = "Por favor, insira um valor numérico válido."
          }
        }
      }
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulário
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)

      // Mostrar toast com erro
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário antes de continuar.",
        variant: "destructive",
      })

      return
    }

    try {
      setIsSubmitting(true)

      // Calcular o resultado com base nos valores
      const result = testInfo?.getResult(formValues) || "Resultado não disponível"

      // Criar objeto de resultado do teste
      const testResult = {
        testType: selectedTest,
        patientId: selectedPatient || undefined,
        date: new Date().toISOString(),
        values: formValues,
        result,
        notes,
      }

      // Salvar no banco de dados
      await addTestResult(testResult)

      toast({
        title: "Sucesso!",
        description: "Teste aplicado e registrado com sucesso.",
      })

      // Redirecionar para a página de histórico
      router.push("/testes/historico")
    } catch (error) {
      console.error("Erro ao registrar teste:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o teste. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Funções do cronômetro
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      const startTime = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime)
      }, 10)
    }
  }

  const stopTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      setIsRunning(false)

      // Atualizar o campo de tempo no formulário para o teste TUG
      if (selectedTest === "tug") {
        const seconds = (time / 1000).toFixed(1)
        handleInputChange("time", seconds)
      }
    }
  }

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setTime(0)
  }

  // Formatar o tempo para exibição
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Aplicar Teste Funcional</h2>
        <Link href="/testes">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Teste</CardTitle>
            <CardDescription>Selecione o teste a ser aplicado e o paciente (opcional).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test">
                  Teste Funcional <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTest} onValueChange={setSelectedTest} required>
                  <SelectTrigger id="test" className={validationErrors.test ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o teste" />
                  </SelectTrigger>
                  <SelectContent>
                    {functionalTests.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.test && <p className="text-sm text-red-500 mt-1">{validationErrors.test}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient">Paciente (opcional)</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Selecione o paciente (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem paciente associado</SelectItem>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedTest && testInfo && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-blue-900">{testInfo.name}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testInfo.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>

                      {field.type === "select" ? (
                        <Select
                          value={formValues[field.id] || ""}
                          onValueChange={(value) => handleInputChange(field.id, value)}
                          required={field.required}
                        >
                          <SelectTrigger id={field.id} className={validationErrors[field.id] ? "border-red-500" : ""}>
                            <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          value={formValues[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                          className={validationErrors[field.id] ? "border-red-500" : ""}
                          min={field.type === "number" ? 0 : undefined}
                        />
                      )}
                      {validationErrors[field.id] && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors[field.id]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Registre observações relevantes sobre a aplicação do teste"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {selectedTest === "tug" && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="w-full">
                        <h4 className="font-medium text-blue-800 mb-1">Cronômetro</h4>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="flex gap-2">
                            {!isRunning ? (
                              <Button
                                type="button"
                                variant="outline"
                                className="bg-white border-blue-300 text-blue-800 hover:bg-blue-50"
                                onClick={startTimer}
                              >
                                Iniciar
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                className="bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-50"
                                onClick={stopTimer}
                              >
                                Parar
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              className="bg-white border-blue-300 text-blue-800 hover:bg-blue-50"
                              onClick={resetTimer}
                            >
                              Reiniciar
                            </Button>
                          </div>
                          <div className="font-mono text-lg font-semibold text-blue-900">{formatTime(time)}</div>
                          {!isRunning && time > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              className="bg-white border-green-300 text-green-800 hover:bg-green-50"
                              onClick={() => handleInputChange("time", (time / 1000).toFixed(1))}
                            >
                              Usar este tempo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {testInfo.getResult && Object.keys(formValues).length > 0 && (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-4">
                    <h4 className="font-medium text-green-800 mb-1">Resultado Preliminar</h4>
                    <p className="text-green-700">{testInfo.getResult(formValues)}</p>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Lembrete</h4>
                      <p className="text-sm text-yellow-700">
                        Certifique-se de explicar claramente as instruções ao paciente e garantir um ambiente seguro
                        para a aplicação do teste.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/testes">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || !selectedTest}
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Registrar Teste
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
