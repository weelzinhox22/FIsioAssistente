"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, Clock, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { jsPDF } from "jspdf"

export default function TUGPage() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Função para iniciar o cronômetro
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      const startTime = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime)
      }, 10)
    }
  }

  // Função para parar o cronômetro
  const stopTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
      interpretResult()
    }
  }

  // Função para reiniciar o cronômetro
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setTime(0)
    setResult(null)
  }

  // Função para interpretar o resultado
  const interpretResult = () => {
    const seconds = time / 1000
    if (seconds < 10) {
      setResult(`${seconds.toFixed(1)} segundos: Mobilidade normal, baixo risco de quedas`)
    } else if (seconds < 20) {
      setResult(`${seconds.toFixed(1)} segundos: Boa mobilidade, risco moderado de quedas`)
    } else if (seconds < 30) {
      setResult(`${seconds.toFixed(1)} segundos: Mobilidade reduzida, alto risco de quedas`)
    } else {
      setResult(`${seconds.toFixed(1)} segundos: Mobilidade severamente comprometida, risco muito alto de quedas`)
    }
  }

  // Formatar o tempo para exibição
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Teste Timed Up and Go (TUG)", 105, 20, { align: "center" })

    // Descrição
    doc.setFontSize(12)
    doc.text("O teste Timed Up and Go (TUG) avalia a mobilidade, o equilíbrio dinâmico e o risco de quedas.", 20, 35)
    doc.text("É amplamente utilizado na avaliação de idosos e pacientes com distúrbios neurológicos.", 20, 42)

    // Materiais e Procedimento
    doc.setFontSize(14)
    doc.text("Materiais Necessários:", 20, 55)
    doc.setFontSize(12)
    doc.text("- Cadeira com braços (altura do assento aproximadamente 46 cm)", 25, 65)
    doc.text("- Cronômetro", 25, 72)
    doc.text("- Fita métrica", 25, 79)
    doc.text("- Cone ou marcador", 25, 86)

    doc.setFontSize(14)
    doc.text("Procedimento:", 20, 100)
    doc.setFontSize(12)
    doc.text("1. O paciente deve sentar-se na cadeira com as costas apoiadas e os braços sobre os apoios.", 25, 110)
    doc.text("2. Marque uma linha no chão a 3 metros de distância da cadeira.", 25, 117)
    doc.text("3. Instrua o paciente a, ao comando 'Vai', levantar-se da cadeira, caminhar até a linha,", 25, 124)
    doc.text("   girar, retornar à cadeira e sentar-se novamente.", 25, 131)
    doc.text("4. Inicie a cronometragem quando disser 'Vai' e pare quando o paciente estiver sentado", 25, 138)
    doc.text("   novamente com as costas apoiadas.", 25, 145)
    doc.text("5. O paciente deve realizar o teste em sua velocidade habitual, usando calçado normal e", 25, 152)
    doc.text("   dispositivo de auxílio à marcha, se necessário.", 25, 159)
    doc.text("6. Realize uma tentativa de familiarização e, em seguida, duas tentativas cronometradas.", 25, 166)
    doc.text("7. Registre o melhor tempo (menor) das duas tentativas.", 25, 173)

    // Interpretação
    doc.setFontSize(14)
    doc.text("Interpretação dos Resultados:", 20, 190)
    doc.setFontSize(12)
    doc.text("- < 10 segundos: Mobilidade normal, baixo risco de quedas", 25, 200)
    doc.text("- 10-19 segundos: Boa mobilidade, independência em AVDs, risco moderado de quedas", 25, 207)
    doc.text("- 20-29 segundos: Mobilidade reduzida, pode necessitar assistência, alto risco de quedas", 25, 214)
    doc.text("- ≥ 30 segundos: Mobilidade severamente comprometida, dependência em AVDs, risco muito alto", 25, 221)

    // Referências
    doc.setFontSize(10)
    doc.text("Referências:", 20, 240)
    doc.text(
      "Podsiadlo D, Richardson S. The timed 'Up & Go': a test of basic functional mobility for frail elderly persons.",
      20,
      247,
    )
    doc.text("J Am Geriatr Soc. 1991;39(2):142-148.", 20, 254)

    // Rodapé
    doc.text("Documento gerado por FisioBase - Aplicação Offline para Fisioterapeutas", 105, 280, { align: "center" })

    // Salvar o PDF
    doc.save("Teste_TUG.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            ⏱️
          </span>{" "}
          Teste Timed Up and Go (TUG)
        </h2>
        <Link href="/testes">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Teste</CardTitle>
              <CardDescription>
                O teste Timed Up and Go (TUG) é uma medida simples e rápida para avaliar a mobilidade funcional, o
                equilíbrio dinâmico e o risco de quedas em idosos e pacientes com distúrbios neurológicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Objetivo</h3>
                <p>Avaliar a mobilidade funcional, o equilíbrio dinâmico e o risco de quedas.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Materiais Necessários</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cadeira com braços (altura do assento aproximadamente 46 cm)</li>
                  <li>Cronômetro</li>
                  <li>Fita métrica</li>
                  <li>Cone ou marcador</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Procedimento</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                    onClick={() => setShowInstructions(!showInstructions)}
                  >
                    {showInstructions ? "Ocultar Instruções Detalhadas" : "Mostrar Instruções Detalhadas"}
                  </Button>

                  {showInstructions && (
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>O paciente deve sentar-se na cadeira com as costas apoiadas e os braços sobre os apoios.</li>
                      <li>Marque uma linha no chão a 3 metros de distância da cadeira.</li>
                      <li>
                        Instrua o paciente a, ao comando "Vai", levantar-se da cadeira, caminhar até a linha, girar,
                        retornar à cadeira e sentar-se novamente.
                      </li>
                      <li>
                        Inicie a cronometragem quando disser "Vai" e pare quando o paciente estiver sentado novamente
                        com as costas apoiadas.
                      </li>
                      <li>
                        O paciente deve realizar o teste em sua velocidade habitual, usando calçado normal e dispositivo
                        de auxílio à marcha, se necessário.
                      </li>
                      <li>Realize uma tentativa de familiarização e, em seguida, duas tentativas cronometradas.</li>
                      <li>Registre o melhor tempo (menor) das duas tentativas.</li>
                    </ol>
                  )}

                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-blue-800 mx-auto mb-2" />
                      <p className="text-gray-500">Vídeo demonstrativo do teste</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Interpretação dos Resultados</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tempo (segundos)</TableHead>
                      <TableHead>Interpretação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>&lt; 10 segundos</TableCell>
                      <TableCell>Mobilidade normal, baixo risco de quedas</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10-19 segundos</TableCell>
                      <TableCell>Boa mobilidade, independência em AVDs, risco moderado de quedas</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>20-29 segundos</TableCell>
                      <TableCell>Mobilidade reduzida, pode necessitar assistência, alto risco de quedas</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>≥ 30 segundos</TableCell>
                      <TableCell>
                        Mobilidade severamente comprometida, dependência em AVDs, risco muito alto de quedas
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Considerações Importantes</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-yellow-700">
                      <li>O teste deve ser realizado em um ambiente seguro para evitar quedas.</li>
                      <li>
                        Pacientes com comprometimento cognitivo podem ter dificuldade em compreender as instruções.
                      </li>
                      <li>
                        O uso de dispositivos de auxílio à marcha deve ser registrado, pois pode influenciar os
                        resultados.
                      </li>
                      <li>Fatores como dor, fadiga e medicamentos podem afetar o desempenho no teste.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Referências</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                  <li>
                    Podsiadlo D, Richardson S. The timed "Up & Go": a test of basic functional mobility for frail
                    elderly persons. J Am Geriatr Soc. 1991;39(2):142-148.
                  </li>
                  <li>
                    Shumway-Cook A, Brauer S, Woollacott M. Predicting the probability for falls in community-dwelling
                    older adults using the Timed Up & Go Test. Phys Ther. 2000;80(9):896-903.
                  </li>
                </ul>
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
                <Link href={`/testes/aplicar?teste=tug`} className="flex-1 sm:flex-none ml-auto">
                  <Button className="w-full bg-blue-800 hover:bg-blue-900">Aplicar Teste</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aplicação Rápida</CardTitle>
              <CardDescription>
                Utilize esta seção para aplicar o teste rapidamente sem registrar os resultados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <Clock className="h-12 w-12 text-blue-800 mx-auto mb-2" />
                <div className="text-4xl font-bold text-blue-900 mb-2" id="timer">
                  {formatTime(time)}
                </div>
                <div className="flex gap-2 justify-center">
                  {!isRunning ? (
                    <Button className="bg-green-600 hover:bg-green-700" onClick={startTimer}>
                      Iniciar
                    </Button>
                  ) : (
                    <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={stopTimer}>
                      Parar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={resetTimer}
                  >
                    Reiniciar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resultado:</h4>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500" id="result-display">
                    {result || "Inicie o cronômetro para aplicar o teste"}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/testes/aplicar?teste=tug`}>
                  <Button className="w-full">Aplicar e Registrar Teste Completo</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testes Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/testes/berg">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    ⚖️
                  </span>{" "}
                  Escala de Equilíbrio de Berg
                </Button>
              </Link>
              <Link href="/testes/tinetti">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    👣
                  </span>{" "}
                  Escala de Tinetti
                </Button>
              </Link>
              <Link href="/testes/alcance-funcional">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    🫱
                  </span>{" "}
                  Teste de Alcance Funcional
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
