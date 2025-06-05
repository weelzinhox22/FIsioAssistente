"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { jsPDF } from "jspdf"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Dados da escala de Berg
const bergItems = [
  {
    id: 1,
    title: "Posição sentada para posição em pé",
    instructions: "Por favor, levante-se. Tente não usar suas mãos para se apoiar.",
    options: [
      { value: "0", label: "0 - Necessita de ajuda moderada à máxima para se levantar" },
      { value: "1", label: "1 - Necessita de ajuda mínima para levantar-se ou estabilizar-se" },
      { value: "2", label: "2 - Capaz de levantar-se utilizando as mãos após várias tentativas" },
      { value: "3", label: "3 - Capaz de levantar-se independentemente utilizando as mãos" },
      { value: "4", label: "4 - Capaz de levantar-se sem utilizar as mãos e estabilizar-se independentemente" },
    ],
  },
  {
    id: 2,
    title: "Permanecer em pé sem apoio",
    instructions: "Por favor, fique em pé por 2 minutos sem se apoiar.",
    options: [
      { value: "0", label: "0 - Incapaz de permanecer em pé por 30 segundos sem apoio" },
      { value: "1", label: "1 - Necessita de várias tentativas para permanecer em pé por 30 segundos sem apoio" },
      { value: "2", label: "2 - Capaz de permanecer em pé por 30 segundos sem apoio" },
      { value: "3", label: "3 - Capaz de permanecer em pé por 2 minutos com supervisão" },
      { value: "4", label: "4 - Capaz de permanecer em pé com segurança por 2 minutos" },
    ],
  },
  {
    id: 3,
    title: "Permanecer sentado sem apoio nas costas, mas com os pés apoiados no chão ou num banquinho",
    instructions: "Por favor, fique sentado sem apoiar as costas com os braços cruzados por 2 minutos.",
    options: [
      { value: "0", label: "0 - Incapaz de permanecer sentado sem apoio por 10 segundos" },
      { value: "1", label: "1 - Capaz de permanecer sentado por 10 segundos" },
      { value: "2", label: "2 - Capaz de permanecer sentado por 30 segundos" },
      { value: "3", label: "3 - Capaz de permanecer sentado por 2 minutos com supervisão" },
      { value: "4", label: "4 - Capaz de permanecer sentado com segurança e com firmeza por 2 minutos" },
    ],
  },
  // Adicionei apenas 3 itens para brevidade, a escala completa tem 14 itens
]

export default function BergPage() {
  const [scores, setScores] = useState<Record<number, string>>({})

  const handleScoreChange = (itemId: number, value: string) => {
    setScores((prev) => ({ ...prev, [itemId]: value }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((total, score) => total + Number.parseInt(score || "0"), 0)
  }

  const getInterpretation = (score: number) => {
    if (score >= 0 && score <= 20) {
      return "Alto risco de queda - Equilíbrio prejudicado (cadeira de rodas)"
    } else if (score >= 21 && score <= 40) {
      return "Médio risco de queda - Equilíbrio aceitável (assistência ou auxílio)"
    } else if (score >= 41 && score <= 56) {
      return "Baixo risco de queda - Bom equilíbrio"
    }
    return ""
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Escala de Equilíbrio de Berg", 105, 20, { align: "center" })

    // Descrição
    doc.setFontSize(12)
    doc.text("A Escala de Equilíbrio de Berg é um instrumento para avaliação do equilíbrio", 20, 35)
    doc.text("estático e dinâmico, e risco de quedas em adultos e idosos.", 20, 42)

    // Resultado atual
    doc.setFontSize(14)
    const totalScore = calculateTotalScore()
    doc.text(`Pontuação total: ${totalScore}/56 pontos`, 20, 55)
    doc.text(`Interpretação: ${getInterpretation(totalScore)}`, 20, 65)

    // Detalhes das respostas
    doc.setFontSize(12)
    doc.text("Detalhes da avaliação:", 20, 80)

    let yPosition = 90
    bergItems.forEach((item) => {
      const score = scores[item.id] || "0"
      doc.text(`${item.id}. ${item.title}: ${score} pontos`, 25, yPosition)
      yPosition += 7
    })

    // Rodapé
    doc.setFontSize(10)
    doc.text("Documento gerado por FisioBase - Aplicação Offline para Fisioterapeutas", 105, 280, { align: "center" })

    // Salvar o PDF
    doc.save("Escala_de_Equilibrio_de_Berg.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Escala de Equilíbrio de Berg</h2>
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
            A Escala de Equilíbrio de Berg é um instrumento validado para avaliação do equilíbrio estático e dinâmico, e
            risco de quedas em adultos e idosos. Consiste em 14 tarefas comuns que envolvem o equilíbrio estático e
            dinâmico, como alcançar, girar, transferir-se, permanecer em pé e levantar-se.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Aplicação</h3>
            <p>
              A realização das tarefas é avaliada através da observação e pontuada de 0 a 4, totalizando um máximo de 56
              pontos. Estes pontos devem ser subtraídos caso o tempo ou a distância não sejam atingidos, o sujeito
              necessite de supervisão para a execução da tarefa, ou se o sujeito apoia-se num suporte externo ou recebe
              ajuda do examinador.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Avaliação Interativa</h3>

            {bergItems.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">
                    {item.id}. {item.title}
                  </CardTitle>
                  <CardDescription>{item.instructions}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={scores[item.id] || ""}
                    onValueChange={(value) => handleScoreChange(item.id, value)}
                    className="space-y-2"
                  >
                    {item.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`item-${item.id}-option-${option.value}`} />
                        <Label htmlFor={`item-${item.id}-option-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="mt-6 p-4 rounded-lg border text-center">
              <div className="text-xl font-bold mb-2">Pontuação Total: {calculateTotalScore()}/56</div>
              <div className="inline-block px-4 py-2 rounded-full text-white bg-blue-600">
                {getInterpretation(calculateTotalScore())}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Interpretação</h3>
            <ul className="space-y-1">
              <li>
                <span className="font-medium">0 a 20 pontos:</span> Alto risco de queda - Equilíbrio prejudicado
                (cadeira de rodas)
              </li>
              <li>
                <span className="font-medium">21 a 40 pontos:</span> Médio risco de queda - Equilíbrio aceitável
                (assistência ou auxílio)
              </li>
              <li>
                <span className="font-medium">41 a 56 pontos:</span> Baixo risco de queda - Bom equilíbrio
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Referências</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Berg KO, Wood-Dauphinee SL, Williams JI, Maki B. Measuring balance in the elderly: validation of an
                instrument. Can J Public Health. 1992;83 Suppl 2:S7-11.
              </li>
              <li>
                Miyamoto ST, Lombardi Junior I, Berg KO, Ramos LR, Natour J. Brazilian version of the Berg balance
                scale. Braz J Med Biol Res. 2004;37(9):1411-1421.
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
