"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Download, Printer, Save } from "lucide-react"
import { jsPDF } from "jspdf"
import { saveScaleAssessment, getAllPatients, type Patient } from "@/lib/db"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function EvaPage() {
  const [painLevel, setPainLevel] = useState<number[]>([0])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientData = await getAllPatients()
        setPatients(patientData)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
      }
    }

    loadPatients()
  }, [])

  const saveAssessment = async () => {
    try {
      const patientId = selectedPatientId ? Number.parseInt(selectedPatientId) : undefined
      const patientName = patientId ? patients.find((p) => p.id === patientId)?.name : undefined

      await saveScaleAssessment({
        scaleId: "eva",
        scaleName: "EVA - Escala Visual Analógica",
        patientId,
        patientName,
        date: new Date().toISOString(),
        score: painLevel[0],
        details: {
          painLevel: painLevel[0],
          description: getPainDescription(painLevel[0]),
        },
        notes,
      })

      toast({
        title: "Avaliação salva",
        description: "A avaliação foi salva com sucesso.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a avaliação.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const getPainDescription = (level: number) => {
    if (level === 0) return "Sem dor"
    if (level <= 2) return "Dor leve"
    if (level <= 5) return "Dor moderada"
    if (level <= 7) return "Dor intensa"
    if (level <= 9) return "Dor muito intensa"
    return "Pior dor possível"
  }

  const getPainColor = (level: number) => {
    if (level === 0) return "bg-green-500"
    if (level <= 2) return "bg-green-300"
    if (level <= 5) return "bg-yellow-400"
    if (level <= 7) return "bg-orange-500"
    if (level <= 9) return "bg-red-500"
    return "bg-red-700"
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Escala Visual Analógica (EVA)", 105, 20, { align: "center" })

    // Descrição
    doc.setFontSize(12)
    doc.text("A Escala Visual Analógica (EVA) é um instrumento unidimensional para a avaliação da", 20, 35)
    doc.text("intensidade da dor. Trata-se de uma linha com as extremidades numeradas de 0-10.", 20, 42)
    doc.text("Em uma extremidade da linha é marcada 'Sem Dor' e na outra 'Pior Dor Possível'.", 20, 49)

    // Resultado atual
    doc.setFontSize(14)
    doc.text(`Nível de dor atual: ${painLevel[0]} - ${getPainDescription(painLevel[0])}`, 20, 65)

    // Escala visual
    doc.setDrawColor(0)
    doc.setFillColor(200, 200, 200)
    doc.rect(20, 75, 170, 20, "F")

    // Marcação do nível de dor
    const position = 20 + painLevel[0] * 17
    doc.setFillColor(255, 0, 0)
    doc.circle(position, 85, 5, "F")

    // Numeração
    doc.setFontSize(10)
    for (let i = 0; i <= 10; i++) {
      doc.text(`${i}`, 20 + i * 17, 105)
    }

    // Descrições
    doc.text("Sem dor", 20, 115)
    doc.text("Pior dor possível", 165, 115)

    // Informações adicionais
    doc.setFontSize(12)
    doc.text("Interpretação:", 20, 130)
    doc.text("0: Sem dor", 30, 140)
    doc.text("1-2: Dor leve", 30, 147)
    doc.text("3-5: Dor moderada", 30, 154)
    doc.text("6-7: Dor intensa", 30, 161)
    doc.text("8-9: Dor muito intensa", 30, 168)
    doc.text("10: Pior dor possível", 30, 175)

    // Rodapé
    doc.setFontSize(10)
    doc.text("Documento gerado por FisioBase - Aplicação Offline para Fisioterapeutas", 105, 280, { align: "center" })

    // Salvar o PDF
    doc.save("EVA_Escala_Visual_Analogica.pdf")
  }

  const renderPatientSelect = () => (
    <div className="space-y-2">
      <Label htmlFor="patient">Paciente (opcional)</Label>
      <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
        <SelectTrigger id="patient">
          <SelectValue placeholder="Selecione um paciente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhum</SelectItem>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id?.toString() || ""}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const renderNotesField = () => (
    <div className="space-y-2">
      <Label htmlFor="notes">Observações</Label>
      <Textarea
        id="notes"
        placeholder="Adicione observações sobre esta avaliação..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Escala Visual Analógica (EVA)</h2>
        <Link href="/escalas">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre a Escala</CardTitle>
          <CardDescription>
            A Escala Visual Analógica (EVA) é um instrumento unidimensional para a avaliação da intensidade da dor.
            Trata-se de uma linha com as extremidades numeradas de 0-10. Em uma extremidade da linha é marcada "Sem Dor"
            e na outra "Pior Dor Possível".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderPatientSelect()}
          {renderNotesField()}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Aplicação</h3>
            <p>
              Peça ao paciente que avalie e indique na escala a intensidade da sua dor. O paciente deve ser orientado a:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Marcar o ponto que representa a intensidade da sua dor</li>
              <li>A extremidade esquerda (0) representa "Sem Dor"</li>
              <li>A extremidade direita (10) representa "Pior Dor Possível"</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Avaliação Interativa</h3>
            <div className="flex items-center justify-between">
              <span className="font-medium">Sem Dor</span>
              <span className="font-medium">Pior Dor Possível</span>
            </div>
            <Slider value={painLevel} max={10} step={1} onValueChange={setPainLevel} className="py-4" />
            <div className="flex justify-between">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <span key={value} className="text-sm">
                  {value}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg border text-center">
              <div className="text-xl font-bold mb-2">Nível de Dor: {painLevel[0]}</div>
              <div className={`inline-block px-4 py-2 rounded-full text-white ${getPainColor(painLevel[0])}`}>
                {getPainDescription(painLevel[0])}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Interpretação</h3>
            <ul className="space-y-1">
              <li>
                <span className="font-medium">0:</span> Sem dor
              </li>
              <li>
                <span className="font-medium">1-2:</span> Dor leve
              </li>
              <li>
                <span className="font-medium">3-5:</span> Dor moderada
              </li>
              <li>
                <span className="font-medium">6-7:</span> Dor intensa
              </li>
              <li>
                <span className="font-medium">8-9:</span> Dor muito intensa
              </li>
              <li>
                <span className="font-medium">10:</span> Pior dor possível
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Referências</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Hawker GA, Mian S, Kendzerska T, French M. Measures of adult pain: Visual Analog Scale for Pain (VAS
                Pain), Numeric Rating Scale for Pain (NRS Pain), McGill Pain Questionnaire (MPQ), Short-Form McGill Pain
                Questionnaire (SF-MPQ), Chronic Pain Grade Scale (CPGS), Short Form-36 Bodily Pain Scale (SF-36 BPS),
                and Measure of Intermittent and Constant Osteoarthritis Pain (ICOAP). Arthritis Care Res (Hoboken).
                2011;63 Suppl 11:S240-52.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={saveAssessment} className="gap-1 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" /> Salvar Avaliação
            </Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
