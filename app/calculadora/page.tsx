"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Heart, Weight } from "lucide-react"

export default function CalculadoraPage() {
  // IMC
  const [imcData, setImcData] = useState({
    weight: "",
    height: "",
  })
  const [imcResult, setImcResult] = useState<{ value: number; classification: string } | null>(null)

  // VO2 Máximo
  const [vo2Data, setVo2Data] = useState({
    distance: "",
    age: "",
    weight: "",
    gender: "male",
  })
  const [vo2Result, setVo2Result] = useState<{ value: number; classification: string } | null>(null)

  // Pressão Arterial Média
  const [pamData, setPamData] = useState({
    systolic: "",
    diastolic: "",
  })
  const [pamResult, setPamResult] = useState<{ value: number; classification: string } | null>(null)

  // Cálculo do IMC
  const calculateIMC = () => {
    const weight = Number.parseFloat(imcData.weight)
    const height = Number.parseFloat(imcData.height) / 100 // Converter cm para m

    if (isNaN(weight) || isNaN(height) || height === 0) {
      return
    }

    const imc = weight / (height * height)
    let classification = ""

    if (imc < 18.5) {
      classification = "Abaixo do peso"
    } else if (imc < 25) {
      classification = "Peso normal"
    } else if (imc < 30) {
      classification = "Sobrepeso"
    } else if (imc < 35) {
      classification = "Obesidade Grau I"
    } else if (imc < 40) {
      classification = "Obesidade Grau II"
    } else {
      classification = "Obesidade Grau III"
    }

    setImcResult({
      value: Number.parseFloat(imc.toFixed(2)),
      classification,
    })
  }

  // Cálculo do VO2 Máximo (Teste de Caminhada de 6 minutos)
  const calculateVO2 = () => {
    const distance = Number.parseFloat(vo2Data.distance)
    const age = Number.parseFloat(vo2Data.age)
    const weight = Number.parseFloat(vo2Data.weight)
    const isMale = vo2Data.gender === "male"

    if (isNaN(distance) || isNaN(age) || isNaN(weight)) {
      return
    }

    // Fórmula de Enright para o teste de caminhada de 6 minutos
    let vo2

    if (isMale) {
      vo2 = 0.02 * distance - 0.191 * age - 0.07 * weight + 70.161
    } else {
      vo2 = 0.02 * distance - 0.191 * age - 0.07 * weight + 59.998
    }

    let classification = ""

    if (vo2 < 15) {
      classification = "Muito fraco"
    } else if (vo2 < 25) {
      classification = "Fraco"
    } else if (vo2 < 35) {
      classification = "Regular"
    } else if (vo2 < 45) {
      classification = "Bom"
    } else if (vo2 < 55) {
      classification = "Excelente"
    } else {
      classification = "Superior"
    }

    setVo2Result({
      value: Number.parseFloat(vo2.toFixed(2)),
      classification,
    })
  }

  // Cálculo da Pressão Arterial Média
  const calculatePAM = () => {
    const systolic = Number.parseFloat(pamData.systolic)
    const diastolic = Number.parseFloat(pamData.diastolic)

    if (isNaN(systolic) || isNaN(diastolic)) {
      return
    }

    // Fórmula da PAM
    const pam = diastolic + (systolic - diastolic) / 3

    let classification = ""

    if (pam < 70) {
      classification = "Hipotensão"
    } else if (pam <= 105) {
      classification = "Normal"
    } else {
      classification = "Hipertensão"
    }

    setPamResult({
      value: Number.parseFloat(pam.toFixed(2)),
      classification,
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Calculadora Clínica</h2>

      <Tabs defaultValue="imc" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="imc">IMC</TabsTrigger>
          <TabsTrigger value="vo2">VO₂ Máximo</TabsTrigger>
          <TabsTrigger value="pam">Pressão Arterial Média</TabsTrigger>
        </TabsList>

        <TabsContent value="imc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-blue-800" />
                Índice de Massa Corporal (IMC)
              </CardTitle>
              <CardDescription>
                Calcula a relação entre peso e altura, fornecendo uma indicação do estado nutricional.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 70"
                    value={imcData.weight}
                    onChange={(e) => setImcData({ ...imcData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 170"
                    value={imcData.height}
                    onChange={(e) => setImcData({ ...imcData, height: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={calculateIMC}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!imcData.weight || !imcData.height}
              >
                <Calculator className="mr-2 h-4 w-4" /> Calcular IMC
              </Button>

              {imcResult && (
                <div className="mt-4 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Resultado:</h3>
                  <p className="text-2xl font-bold">{imcResult.value} kg/m²</p>
                  <p className="text-lg">
                    Classificação: <span className="font-medium">{imcResult.classification}</span>
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Interpretação:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Abaixo do peso:</span> IMC &lt; 18,5 kg/m²
                      </li>
                      <li>
                        <span className="font-medium">Peso normal:</span> IMC entre 18,5 e 24,9 kg/m²
                      </li>
                      <li>
                        <span className="font-medium">Sobrepeso:</span> IMC entre 25 e 29,9 kg/m²
                      </li>
                      <li>
                        <span className="font-medium">Obesidade Grau I:</span> IMC entre 30 e 34,9 kg/m²
                      </li>
                      <li>
                        <span className="font-medium">Obesidade Grau II:</span> IMC entre 35 e 39,9 kg/m²
                      </li>
                      <li>
                        <span className="font-medium">Obesidade Grau III:</span> IMC ≥ 40 kg/m²
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vo2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-800" />
                VO₂ Máximo (Teste de Caminhada de 6 minutos)
              </CardTitle>
              <CardDescription>
                Estima o consumo máximo de oxigênio com base no teste de caminhada de 6 minutos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distância percorrida (metros)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="Ex: 500"
                    value={vo2Data.distance}
                    onChange={(e) => setVo2Data({ ...vo2Data, distance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade (anos)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 45"
                    value={vo2Data.age}
                    onChange={(e) => setVo2Data({ ...vo2Data, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight-vo2">Peso (kg)</Label>
                  <Input
                    id="weight-vo2"
                    type="number"
                    placeholder="Ex: 70"
                    value={vo2Data.weight}
                    onChange={(e) => setVo2Data({ ...vo2Data, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        className="mr-2"
                        checked={vo2Data.gender === "male"}
                        onChange={() => setVo2Data({ ...vo2Data, gender: "male" })}
                      />
                      <Label htmlFor="male" className="cursor-pointer">
                        Masculino
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        className="mr-2"
                        checked={vo2Data.gender === "female"}
                        onChange={() => setVo2Data({ ...vo2Data, gender: "female" })}
                      />
                      <Label htmlFor="female" className="cursor-pointer">
                        Feminino
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={calculateVO2}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!vo2Data.distance || !vo2Data.age || !vo2Data.weight}
              >
                <Calculator className="mr-2 h-4 w-4" /> Calcular VO₂ Máximo
              </Button>

              {vo2Result && (
                <div className="mt-4 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Resultado:</h3>
                  <p className="text-2xl font-bold">{vo2Result.value} ml/kg/min</p>
                  <p className="text-lg">
                    Classificação: <span className="font-medium">{vo2Result.classification}</span>
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Interpretação:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Muito fraco:</span> &lt; 15 ml/kg/min
                      </li>
                      <li>
                        <span className="font-medium">Fraco:</span> 15-25 ml/kg/min
                      </li>
                      <li>
                        <span className="font-medium">Regular:</span> 25-35 ml/kg/min
                      </li>
                      <li>
                        <span className="font-medium">Bom:</span> 35-45 ml/kg/min
                      </li>
                      <li>
                        <span className="font-medium">Excelente:</span> 45-55 ml/kg/min
                      </li>
                      <li>
                        <span className="font-medium">Superior:</span> &gt; 55 ml/kg/min
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-800" />
                Pressão Arterial Média (PAM)
              </CardTitle>
              <CardDescription>Calcula a pressão arterial média, um importante parâmetro hemodinâmico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Pressão Sistólica (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="Ex: 120"
                    value={pamData.systolic}
                    onChange={(e) => setPamData({ ...pamData, systolic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Pressão Diastólica (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="Ex: 80"
                    value={pamData.diastolic}
                    onChange={(e) => setPamData({ ...pamData, diastolic: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={calculatePAM}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!pamData.systolic || !pamData.diastolic}
              >
                <Calculator className="mr-2 h-4 w-4" /> Calcular PAM
              </Button>

              {pamResult && (
                <div className="mt-4 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Resultado:</h3>
                  <p className="text-2xl font-bold">{pamResult.value} mmHg</p>
                  <p className="text-lg">
                    Classificação: <span className="font-medium">{pamResult.classification}</span>
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Interpretação:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Hipotensão:</span> PAM &lt; 70 mmHg
                      </li>
                      <li>
                        <span className="font-medium">Normal:</span> PAM entre 70 e 105 mmHg
                      </li>
                      <li>
                        <span className="font-medium">Hipertensão:</span> PAM &gt; 105 mmHg
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                      A PAM representa a pressão média durante um ciclo cardíaco completo e é um importante parâmetro
                      para avaliar a perfusão tecidual.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
