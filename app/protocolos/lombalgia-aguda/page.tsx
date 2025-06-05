"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { jsPDF } from "jspdf"

export default function LombalgiaAgudaPage() {
  const [showReferences, setShowReferences] = useState(false)

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Protocolo para Lombalgia Aguda", 105, 20, { align: "center" })

    // Descrição
    doc.setFontSize(12)
    doc.text("Abordagem fisioterapêutica para tratamento de lombalgia aguda não específica.", 20, 35)
    doc.text("Nível de Evidência: A", 20, 42)

    // Definição
    doc.setFontSize(14)
    doc.text("Definição", 20, 55)
    doc.setFontSize(12)
    doc.text("Lombalgia aguda não específica é definida como dor na região lombar sem causa específica", 20, 65)
    doc.text("identificável (como hérnia de disco, fratura, infecção, tumor, etc.), com duração", 20, 72)
    doc.text("inferior a 6 semanas.", 20, 79)

    // Objetivos
    doc.setFontSize(14)
    doc.text("Objetivos do Tratamento", 20, 95)
    doc.setFontSize(12)
    doc.text("1. Alívio da dor", 25, 105)
    doc.text("2. Restauração da função", 25, 112)
    doc.text("3. Prevenção de recorrências", 25, 119)
    doc.text("4. Retorno às atividades normais", 25, 126)

    // Intervenções
    doc.setFontSize(14)
    doc.text("Intervenções Recomendadas", 20, 140)
    doc.setFontSize(12)
    doc.text("1. Educação e aconselhamento", 25, 150)
    doc.text("2. Manutenção de atividades dentro dos limites da dor", 25, 157)
    doc.text("3. Exercícios terapêuticos", 25, 164)
    doc.text("4. Terapia manual (quando apropriado)", 25, 171)
    doc.text("5. Controle da dor", 25, 178)

    // Rodapé
    doc.setFontSize(10)
    doc.text("Documento gerado por FisioBase - Aplicação Offline para Fisioterapeutas", 105, 280, { align: "center" })

    // Salvar o PDF
    doc.save("Protocolo_Lombalgia_Aguda.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            🦴
          </span>{" "}
          Protocolo para Lombalgia Aguda
        </h2>
        <div className="flex gap-2">
          <Link href="/protocolos">
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-green-500 text-green-700">
          Evidência A
        </Badge>
        <span className="text-sm text-gray-500">Ortopedia / Coluna</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="intervention">Intervenções</TabsTrigger>
              <TabsTrigger value="progression">Progressão</TabsTrigger>
              <TabsTrigger value="evidence">Evidências</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Definição e Contexto</CardTitle>
                  <CardDescription>
                    Lombalgia aguda não específica é definida como dor na região lombar sem causa específica
                    identificável, com duração inferior a 6 semanas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Epidemiologia</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Afeta cerca de 80% da população em algum momento da vida</li>
                      <li>Prevalência anual de 15-45% em adultos</li>
                      <li>Principal causa de limitação de atividades em pessoas com menos de 45 anos</li>
                      <li>90% dos casos se resolvem em 6 semanas, independentemente do tratamento</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Objetivos do Tratamento</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Alívio da dor</li>
                      <li>Restauração da função</li>
                      <li>Prevenção de recorrências</li>
                      <li>Retorno às atividades normais</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Indicações</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Dor lombar aguda sem irradiação para membros inferiores</li>
                      <li>Ausência de sinais de alerta (bandeiras vermelhas)</li>
                      <li>Dor mecânica que piora com movimento e melhora com repouso</li>
                      <li>Limitação funcional devido à dor</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contraindicações</h3>
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 mb-1">Bandeiras Vermelhas</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm text-red-700">
                            <li>Trauma significativo recente</li>
                            <li>História de câncer</li>
                            <li>Uso prolongado de corticosteroides</li>
                            <li>Idade acima de 50 anos com início recente de dor</li>
                            <li>Febre ou perda de peso inexplicada</li>
                            <li>Dor que não melhora com repouso</li>
                            <li>Déficit neurológico progressivo</li>
                            <li>Disfunção de esfíncteres (bexiga ou intestino)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Avaliação Inicial</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>História detalhada da dor (início, duração, fatores agravantes e de alívio)</li>
                      <li>Avaliação da intensidade da dor (EVA)</li>
                      <li>Avaliação funcional (questionários específicos como Oswestry ou Roland-Morris)</li>
                      <li>Exame físico (inspeção, palpação, amplitude de movimento, testes especiais)</li>
                      <li>Identificação de fatores psicossociais (bandeiras amarelas)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="intervention" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Intervenções Recomendadas</CardTitle>
                  <CardDescription>
                    Baseadas em evidências científicas atuais para o manejo da lombalgia aguda não específica.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" /> Educação e Aconselhamento
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Explicar a natureza benigna e autolimitada da condição</li>
                      <li>Desmistificar crenças errôneas sobre dor lombar</li>
                      <li>Orientar sobre postura e ergonomia</li>
                      <li>Enfatizar a importância de manter-se ativo dentro dos limites da dor</li>
                      <li>Explicar o papel da fisioterapia no tratamento</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" /> Exercícios Terapêuticos
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Exercícios de controle motor e estabilização lombar</li>
                      <li>Alongamentos suaves para musculatura lombar e isquiotibiais</li>
                      <li>Exercícios de mobilidade dentro dos limites da dor</li>
                      <li>Fortalecimento progressivo de core</li>
                      <li>Exercícios aeróbicos de baixo impacto (caminhada, natação)</li>
                    </ul>
                    <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Os exercícios devem ser individualizados e progressivos, respeitando os
                        limites de dor do paciente.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" /> Terapia Manual
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Mobilização articular de baixa velocidade e amplitude</li>
                      <li>Liberação miofascial</li>
                      <li>Massagem terapêutica</li>
                      <li>Técnicas de energia muscular</li>
                    </ul>
                    <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> A terapia manual deve ser utilizada como adjuvante ao exercício, não como
                        tratamento isolado.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" /> Controle da Dor
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Termoterapia (calor superficial)</li>
                      <li>Eletroterapia (TENS)</li>
                      <li>Técnicas de relaxamento</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" /> Intervenções Não Recomendadas
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Repouso prolongado no leito (> 2 dias)</li>
                      <li>Manipulação de alta velocidade em fase aguda</li>
                      <li>Tração lombar</li>
                      <li>Uso de coletes ou cintas lombares por períodos prolongados</li>
                      <li>Ultrassom terapêutico (evidência insuficiente)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progression" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progressão do Tratamento</CardTitle>
                  <CardDescription>
                    Protocolo de progressão baseado em fases para o tratamento da lombalgia aguda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fase 1: Aguda (0-2 semanas)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-blue-800">Objetivos:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Controle da dor</li>
                          <li>Redução da inflamação</li>
                          <li>Manutenção de mobilidade básica</li>
                          <li>Educação do paciente</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Intervenções:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Termoterapia (calor superficial) - 15-20 minutos, 2-3x/dia</li>
                          <li>TENS - 20-30 minutos, parâmetros para analgesia</li>
                          <li>Exercícios respiratórios e de relaxamento</li>
                          <li>Mobilização suave dentro dos limites da dor</li>
                          <li>Orientações posturais e ergonômicas</li>
                          <li>Exercícios isométricos suaves para estabilizadores lombares</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Frequência:</h4>
                        <p>2-3 sessões por semana</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fase 2: Subaguda (2-4 semanas)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-blue-800">Objetivos:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Restauração da amplitude de movimento</li>
                          <li>Início do fortalecimento</li>
                          <li>Melhora do controle motor</li>
                          <li>Retorno gradual às atividades diárias</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Intervenções:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Exercícios de estabilização lombar (transverso, multífidos)</li>
                          <li>Alongamentos mais intensos para cadeia posterior</li>
                          <li>Mobilização articular mais ampla</li>
                          <li>Exercícios de controle motor em diferentes posições</li>
                          <li>Fortalecimento progressivo de core</li>
                          <li>Atividades aeróbicas de baixo impacto (10-15 minutos)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Frequência:</h4>
                        <p>2 sessões por semana</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fase 3: Recuperação (4-6 semanas)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-blue-800">Objetivos:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Fortalecimento muscular</li>
                          <li>Restauração completa da função</li>
                          <li>Prevenção de recorrências</li>
                          <li>Retorno completo às atividades normais</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Intervenções:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Exercícios funcionais específicos para atividades diárias</li>
                          <li>Fortalecimento avançado de core e membros inferiores</li>
                          <li>Treinamento proprioceptivo</li>
                          <li>Exercícios com resistência progressiva</li>
                          <li>Atividades aeróbicas de intensidade moderada (20-30 minutos)</li>
                          <li>Orientações para programa domiciliar de manutenção</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800">Frequência:</h4>
                        <p>1-2 sessões por semana</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Critérios para Progressão</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-yellow-700">
                          <li>Redução da dor (pelo menos 2 pontos na EVA)</li>
                          <li>Melhora da amplitude de movimento</li>
                          <li>Capacidade de realizar exercícios sem aumento da dor</li>
                          <li>Melhora na capacidade funcional</li>
                          <li>Ausência de sinais de alerta durante a progressão</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evidências Científicas</CardTitle>
                  <CardDescription>
                    Resumo das evidências que suportam as recomendações deste protocolo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nível de Evidência</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Evidência A
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Baseado em múltiplos estudos clínicos randomizados ou meta-análises
                      </span>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intervenção</TableHead>
                          <TableHead>Nível de Evidência</TableHead>
                          <TableHead>Recomendação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Educação e aconselhamento</TableCell>
                          <TableCell>A</TableCell>
                          <TableCell>Forte</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Manter-se ativo</TableCell>
                          <TableCell>A</TableCell>
                          <TableCell>Forte</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Exercícios terapêuticos</TableCell>
                          <TableCell>A</TableCell>
                          <TableCell>Forte</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Terapia manual</TableCell>
                          <TableCell>B</TableCell>
                          <TableCell>Moderada</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Termoterapia (calor)</TableCell>
                          <TableCell>B</TableCell>
                          <TableCell>Moderada</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TENS</TableCell>
                          <TableCell>C</TableCell>
                          <TableCell>Fraca</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Repouso no leito</TableCell>
                          <TableCell>A</TableCell>
                          <TableCell>Não recomendado</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tração lombar</TableCell>
                          <TableCell>A</TableCell>
                          <TableCell>Não recomendado</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Referências Bibliográficas</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReferences(!showReferences)}
                        className="text-blue-600"
                      >
                        {showReferences ? "Ocultar" : "Mostrar"}
                      </Button>
                    </div>

                    {showReferences && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm space-y-2">
                        <p>
                          1. Qaseem A, Wilt TJ, McLean RM, Forciea MA. Noninvasive Treatments for Acute, Subacute, and
                          Chronic Low Back Pain: A Clinical Practice Guideline From the American College of Physicians.
                          Ann Intern Med. 2017;166(7):514-530.
                        </p>
                        <p>
                          2. Oliveira CB, Maher CG, Pinto RZ, et al. Clinical practice guidelines for the management of
                          non-specific low back pain in primary care: an updated overview. Eur Spine J.
                          2018;27(11):2791-2803.
                        </p>
                        <p>
                          3. Foster NE, Anema JR, Cherkin D, et al. Prevention and treatment of low back pain: evidence,
                          challenges, and promising directions. Lancet. 2018;391(10137):2368-2383.
                        </p>
                        <p>
                          4. Stochkendahl MJ, Kjaer P, Hartvigsen J, et al. National Clinical Guidelines for
                          non-surgical treatment of patients with recent onset low back pain or lumbar radiculopathy.
                          Eur Spine J. 2018;27(1):60-75.
                        </p>
                        <p>
                          5. Chou R, Deyo R, Friedly J, et al. Nonpharmacologic Therapies for Low Back Pain: A
                          Systematic Review for an American College of Physicians Clinical Practice Guideline. Ann
                          Intern Med. 2017;166(7):493-505.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Atualizações e Revisões</h3>
                    <p className="text-sm text-gray-600">
                      Este protocolo foi atualizado pela última vez em Maio de 2023, com base nas diretrizes e
                      evidências mais recentes. Recomenda-se revisão a cada 2 anos ou quando novas evidências
                      significativas forem publicadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
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

              <div className="pt-2">
                <h4 className="font-medium mb-2">Materiais para Pacientes:</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left gap-2">
                    <Download className="h-4 w-4" /> Folheto Educativo - Lombalgia
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left gap-2">
                    <Download className="h-4 w-4" /> Exercícios Domiciliares
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left gap-2">
                    <Download className="h-4 w-4" /> Diário de Dor e Atividades
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Protocolos Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/protocolos/lombalgia-cronica">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    🦴
                  </span>{" "}
                  Protocolo para Lombalgia Crônica
                </Button>
              </Link>
              <Link href="/protocolos/hernia-disco">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    🦴
                  </span>{" "}
                  Protocolo para Hérnia de Disco
                </Button>
              </Link>
              <Link href="/protocolos/dor-cervical">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    🦴
                  </span>{" "}
                  Protocolo para Dor Cervical
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testes Funcionais Recomendados</CardTitle>
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
              <Link href="/testes/tug">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    ⏱️
                  </span>{" "}
                  Teste Timed Up and Go
                </Button>
              </Link>
              <Link href="/testes/sentar-levantar">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <span className="mr-2" aria-hidden="true">
                    🪑
                  </span>{" "}
                  Teste de Sentar e Levantar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
