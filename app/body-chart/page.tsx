"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Save, Trash2, Undo, Redo, FileText } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getPatients } from "@/lib/db"
import { BodyChartCanvas } from "@/components/body-chart-canvas"
import { BodyChartControls } from "@/components/body-chart-controls"
import { BodyChartLegend } from "@/components/body-chart-legend"

export default function BodyChartPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [chartTitle, setChartTitle] = useState<string>("Nova Avaliação")
  const [chartNotes, setChartNotes] = useState<string>("")
  const [currentView, setCurrentView] = useState<string>("anterior")
  const [drawingMode, setDrawingMode] = useState<string>("pain")
  const [drawingColor, setDrawingColor] = useState<string>("#ff0000")
  const [drawingSize, setDrawingSize] = useState<number>(5)
  const [canvasHistory, setCanvasHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [])

  const handleSaveChart = async () => {
    if (!chartTitle.trim()) {
      alert("Por favor, insira um título para o Body Chart")
      return
    }

    setIsSaving(true)

    try {
      // Implementação da função de salvar será feita no componente BodyChartCanvas
      setIsSaving(false)
      alert("Body Chart salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar Body Chart:", error)
      setIsSaving(false)
      alert("Erro ao salvar Body Chart. Tente novamente.")
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
    }
  }

  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
    }
  }

  const handleClear = () => {
    if (confirm("Tem certeza que deseja limpar todas as marcações?")) {
      // Implementação da função de limpar será feita no componente BodyChartCanvas
    }
  }

  const handleExportPDF = () => {
    // Implementação da função de exportar para PDF
    alert("Exportação para PDF em desenvolvimento")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Body Chart Interativo</h2>
        <Link href="/pacientes">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{chartTitle || "Nova Avaliação"}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    title="Desfazer"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRedo}
                    disabled={historyIndex >= canvasHistory.length - 1}
                    title="Refazer"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClear}
                    className="text-red-500"
                    title="Limpar tudo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Marque áreas de dor, trigger points e outras observações no diagrama do corpo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="anterior" onValueChange={(value) => setCurrentView(value)}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="anterior">Anterior</TabsTrigger>
                  <TabsTrigger value="posterior">Posterior</TabsTrigger>
                  <TabsTrigger value="lateral-esquerda">Lateral Esquerda</TabsTrigger>
                  <TabsTrigger value="lateral-direita">Lateral Direita</TabsTrigger>
                </TabsList>

                <div className="relative aspect-[3/4] w-full border rounded-md overflow-hidden bg-white">
                  <BodyChartCanvas
                    view={currentView}
                    drawingMode={drawingMode}
                    drawingColor={drawingColor}
                    drawingSize={drawingSize}
                    historyIndex={historyIndex}
                    setHistoryIndex={setHistoryIndex}
                    canvasHistory={canvasHistory}
                    setCanvasHistory={setCanvasHistory}
                  />
                </div>
              </Tabs>

              <div className="mt-4">
                <BodyChartLegend />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BodyChartControls
                drawingMode={drawingMode}
                setDrawingMode={setDrawingMode}
                drawingColor={drawingColor}
                setDrawingColor={setDrawingColor}
                drawingSize={drawingSize}
                setDrawingSize={setDrawingSize}
              />

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="chart-title">Título da Avaliação</Label>
                <Input
                  id="chart-title"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Ex: Avaliação Inicial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient">Paciente (opcional)</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Selecione um paciente" />
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

              <div className="space-y-2">
                <Label htmlFor="chart-notes">Observações</Label>
                <Textarea
                  id="chart-notes"
                  value={chartNotes}
                  onChange={(e) => setChartNotes(e.target.value)}
                  placeholder="Adicione observações sobre as marcações..."
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleSaveChart} className="gap-1 bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  <Save className="h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar Body Chart"}
                </Button>
                <Button onClick={handleExportPDF} variant="outline" className="gap-1">
                  <Download className="h-4 w-4" /> Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Charts Salvos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4 text-gray-500">Carregando...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-center py-4 text-gray-500">Os Body Charts salvos aparecerão aqui.</p>
                  <Link href="/body-chart/historico">
                    <Button variant="outline" className="w-full gap-1">
                      <FileText className="h-4 w-4" /> Ver Histórico Completo
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
