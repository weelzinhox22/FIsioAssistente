"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, StarOff, FileText } from "lucide-react"
import { favoritesStore } from "@/lib/db"

// Dados dos protocolos por especialidade
const protocolos = [
  // Ortopedia
  {
    id: "lombalgia-aguda",
    name: "Protocolo para Lombalgia Aguda",
    category: "ortopedia",
    subcategory: "coluna",
    description: "Abordagem fisioterapêutica para tratamento de lombalgia aguda não específica.",
    href: "/protocolos/lombalgia-aguda",
    evidence: "A",
    icon: "🦴",
  },
  {
    id: "tendinopatia-patelar",
    name: "Protocolo para Tendinopatia Patelar",
    category: "ortopedia",
    subcategory: "joelho",
    description: "Programa de reabilitação para tendinopatia patelar com ênfase em exercícios excêntricos.",
    href: "/protocolos/tendinopatia-patelar",
    evidence: "A",
    icon: "🦴",
  },
  {
    id: "sindrome-impacto-ombro",
    name: "Protocolo para Síndrome do Impacto do Ombro",
    category: "ortopedia",
    subcategory: "ombro",
    description: "Abordagem terapêutica para síndrome do impacto do ombro com foco em mobilização e fortalecimento.",
    href: "/protocolos/sindrome-impacto-ombro",
    evidence: "B",
    icon: "🦴",
  },
  {
    id: "epicondilite-lateral",
    name: "Protocolo para Epicondilite Lateral",
    category: "ortopedia",
    subcategory: "cotovelo",
    description: "Programa de tratamento para epicondilite lateral (cotovelo de tenista).",
    href: "/protocolos/epicondilite-lateral",
    evidence: "B",
    icon: "🦴",
  },
  {
    id: "entorse-tornozelo",
    name: "Protocolo para Entorse de Tornozelo",
    category: "ortopedia",
    subcategory: "tornozelo",
    description: "Reabilitação progressiva para entorses de tornozelo de graus I, II e III.",
    href: "/protocolos/entorse-tornozelo",
    evidence: "A",
    icon: "🦴",
  },

  // Neurologia
  {
    id: "avc-fase-aguda",
    name: "Protocolo para AVC - Fase Aguda",
    category: "neurologia",
    subcategory: "avc",
    description:
      "Intervenção fisioterapêutica na fase aguda pós-AVC para prevenção de complicações e início da reabilitação.",
    href: "/protocolos/avc-fase-aguda",
    evidence: "A",
    icon: "🧠",
  },
  {
    id: "avc-fase-subaguda",
    name: "Protocolo para AVC - Fase Subaguda",
    category: "neurologia",
    subcategory: "avc",
    description: "Programa de reabilitação para pacientes na fase subaguda pós-AVC com foco na recuperação funcional.",
    href: "/protocolos/avc-fase-subaguda",
    evidence: "A",
    icon: "🧠",
  },
  {
    id: "parkinson",
    name: "Protocolo para Doença de Parkinson",
    category: "neurologia",
    subcategory: "parkinson",
    description: "Abordagem fisioterapêutica para pacientes com Doença de Parkinson em diferentes estágios.",
    href: "/protocolos/parkinson",
    evidence: "B",
    icon: "🧠",
  },
  {
    id: "esclerose-multipla",
    name: "Protocolo para Esclerose Múltipla",
    category: "neurologia",
    subcategory: "esclerose-multipla",
    description: "Programa de exercícios e manejo de sintomas para pacientes com Esclerose Múltipla.",
    href: "/protocolos/esclerose-multipla",
    evidence: "B",
    icon: "🧠",
  },
  {
    id: "lesao-medular",
    name: "Protocolo para Lesão Medular",
    category: "neurologia",
    subcategory: "lesao-medular",
    description: "Reabilitação funcional para pacientes com lesão medular em diferentes níveis.",
    href: "/protocolos/lesao-medular",
    evidence: "A",
    icon: "🧠",
  },

  // Cardiorrespiratória
  {
    id: "reabilitacao-cardiaca-fase1",
    name: "Reabilitação Cardíaca - Fase I (Hospitalar)",
    category: "cardiorrespiratoria",
    subcategory: "cardiaca",
    description: "Protocolo de reabilitação cardíaca fase I para pacientes hospitalizados pós-evento cardíaco.",
    href: "/protocolos/reabilitacao-cardiaca-fase1",
    evidence: "A",
    icon: "🫀",
  },
  {
    id: "reabilitacao-cardiaca-fase2",
    name: "Reabilitação Cardíaca - Fase II (Ambulatorial)",
    category: "cardiorrespiratoria",
    subcategory: "cardiaca",
    description: "Programa de exercícios supervisionados para pacientes em reabilitação cardíaca ambulatorial.",
    href: "/protocolos/reabilitacao-cardiaca-fase2",
    evidence: "A",
    icon: "🫀",
  },
  {
    id: "dpoc",
    name: "Protocolo para DPOC",
    category: "cardiorrespiratoria",
    subcategory: "respiratoria",
    description: "Programa de reabilitação pulmonar para pacientes com Doença Pulmonar Obstrutiva Crônica.",
    href: "/protocolos/dpoc",
    evidence: "A",
    icon: "🫁",
  },
  {
    id: "covid-pos-agudo",
    name: "Protocolo para COVID-19 - Fase Pós-Aguda",
    category: "cardiorrespiratoria",
    subcategory: "respiratoria",
    description: "Reabilitação respiratória e funcional para pacientes na fase pós-aguda da COVID-19.",
    href: "/protocolos/covid-pos-agudo",
    evidence: "B",
    icon: "🫁",
  },
  {
    id: "asma",
    name: "Protocolo para Asma",
    category: "cardiorrespiratoria",
    subcategory: "respiratoria",
    description: "Programa de exercícios respiratórios e condicionamento físico para pacientes com asma.",
    href: "/protocolos/asma",
    evidence: "B",
    icon: "🫁",
  },

  // Esportiva
  {
    id: "reconstrucao-lca",
    name: "Protocolo pós Reconstrução de LCA",
    category: "esportiva",
    subcategory: "joelho",
    description: "Programa de reabilitação progressiva após cirurgia de reconstrução do ligamento cruzado anterior.",
    href: "/protocolos/reconstrucao-lca",
    evidence: "A",
    icon: "🏃",
  },
  {
    id: "lesao-manguito-rotador",
    name: "Protocolo para Lesão do Manguito Rotador",
    category: "esportiva",
    subcategory: "ombro",
    description: "Reabilitação para atletas com lesão do manguito rotador, com ou sem intervenção cirúrgica.",
    href: "/protocolos/lesao-manguito-rotador",
    evidence: "B",
    icon: "🏃",
  },
  {
    id: "pubalgia",
    name: "Protocolo para Pubalgia em Atletas",
    category: "esportiva",
    subcategory: "quadril",
    description:
      "Abordagem terapêutica para pubalgia em atletas com foco em estabilização central e progressão funcional.",
    href: "/protocolos/pubalgia",
    evidence: "B",
    icon: "🏃",
  },
  {
    id: "tendinopatia-aquiles",
    name: "Protocolo para Tendinopatia do Aquiles",
    category: "esportiva",
    subcategory: "tornozelo",
    description: "Programa de reabilitação para tendinopatia do tendão de Aquiles em atletas.",
    href: "/protocolos/tendinopatia-aquiles",
    evidence: "A",
    icon: "🏃",
  },
  {
    id: "retorno-esporte",
    name: "Protocolo de Retorno ao Esporte",
    category: "esportiva",
    subcategory: "geral",
    description: "Critérios e progressão para retorno seguro à prática esportiva após lesão.",
    href: "/protocolos/retorno-esporte",
    evidence: "B",
    icon: "🏃",
  },

  // Geriatria
  {
    id: "prevencao-quedas",
    name: "Protocolo de Prevenção de Quedas",
    category: "geriatria",
    subcategory: "quedas",
    description:
      "Programa multifatorial para prevenção de quedas em idosos, incluindo exercícios de equilíbrio e força.",
    href: "/protocolos/prevencao-quedas",
    evidence: "A",
    icon: "👵",
  },
  {
    id: "sarcopenia",
    name: "Protocolo para Sarcopenia",
    category: "geriatria",
    subcategory: "forca",
    description: "Abordagem terapêutica para prevenção e tratamento da sarcopenia em idosos.",
    href: "/protocolos/sarcopenia",
    evidence: "A",
    icon: "👵",
  },
  {
    id: "osteoporose",
    name: "Protocolo para Osteoporose",
    category: "geriatria",
    subcategory: "metabolica",
    description: "Programa de exercícios seguros e eficazes para pacientes com osteoporose.",
    href: "/protocolos/osteoporose",
    evidence: "A",
    icon: "👵",
  },
  {
    id: "reabilitacao-vestibular",
    name: "Protocolo de Reabilitação Vestibular",
    category: "geriatria",
    subcategory: "equilibrio",
    description: "Exercícios de adaptação e habituação vestibular para idosos com distúrbios do equilíbrio.",
    href: "/protocolos/reabilitacao-vestibular",
    evidence: "B",
    icon: "👵",
  },
  {
    id: "fragilidade",
    name: "Protocolo para Síndrome da Fragilidade",
    category: "geriatria",
    subcategory: "fragilidade",
    description: "Intervenção multicomponente para idosos com síndrome da fragilidade.",
    href: "/protocolos/fragilidade",
    evidence: "B",
    icon: "👵",
  },

  // Pediatria
  {
    id: "paralisia-cerebral",
    name: "Protocolo para Paralisia Cerebral",
    category: "pediatria",
    subcategory: "neurologica",
    description: "Abordagem fisioterapêutica para crianças com paralisia cerebral em diferentes níveis de GMFCS.",
    href: "/protocolos/paralisia-cerebral",
    evidence: "A",
    icon: "👶",
  },
  {
    id: "atraso-desenvolvimento",
    name: "Protocolo para Atraso no Desenvolvimento Motor",
    category: "pediatria",
    subcategory: "desenvolvimento",
    description: "Estimulação precoce para crianças com atraso no desenvolvimento motor.",
    href: "/protocolos/atraso-desenvolvimento",
    evidence: "B",
    icon: "👶",
  },
  {
    id: "torticolo-congenito",
    name: "Protocolo para Torcicolo Congênito",
    category: "pediatria",
    subcategory: "musculoesqueletica",
    description: "Tratamento conservador para torcicolo muscular congênito em bebês.",
    href: "/protocolos/torticolo-congenito",
    evidence: "B",
    icon: "👶",
  },
  {
    id: "pe-torto-congenito",
    name: "Protocolo para Pé Torto Congênito",
    category: "pediatria",
    subcategory: "musculoesqueletica",
    description: "Abordagem fisioterapêutica complementar ao método Ponseti para pé torto congênito.",
    href: "/protocolos/pe-torto-congenito",
    evidence: "B",
    icon: "👶",
  },
  {
    id: "asma-pediatrica",
    name: "Protocolo para Asma Pediátrica",
    category: "pediatria",
    subcategory: "respiratoria",
    description: "Exercícios respiratórios e orientações para crianças com asma.",
    href: "/protocolos/asma-pediatrica",
    evidence: "B",
    icon: "👶",
  },

  // Saúde da Mulher
  {
    id: "gestantes-lombalgia",
    name: "Protocolo para Lombalgia Gestacional",
    category: "saude-mulher",
    subcategory: "gestacao",
    description: "Exercícios e orientações para gestantes com lombalgia.",
    href: "/protocolos/gestantes-lombalgia",
    evidence: "B",
    icon: "👩",
  },
  {
    id: "preparo-parto",
    name: "Protocolo de Preparo para o Parto",
    category: "saude-mulher",
    subcategory: "gestacao",
    description: "Exercícios de preparação para o parto e orientações para gestantes.",
    href: "/protocolos/preparo-parto",
    evidence: "B",
    icon: "👩",
  },
  {
    id: "pos-parto",
    name: "Protocolo Pós-Parto",
    category: "saude-mulher",
    subcategory: "pos-parto",
    description: "Reabilitação no período pós-parto, incluindo recuperação do assoalho pélvico e diástase abdominal.",
    href: "/protocolos/pos-parto",
    evidence: "B",
    icon: "👩",
  },
  {
    id: "incontinencia-urinaria",
    name: "Protocolo para Incontinência Urinária",
    category: "saude-mulher",
    subcategory: "assoalho-pelvico",
    description: "Programa de fortalecimento do assoalho pélvico para mulheres com incontinência urinária.",
    href: "/protocolos/incontinencia-urinaria",
    evidence: "A",
    icon: "👩",
  },
  {
    id: "linfedema-pos-mastectomia",
    name: "Protocolo para Linfedema Pós-Mastectomia",
    category: "saude-mulher",
    subcategory: "oncologia",
    description: "Tratamento fisioterapêutico para linfedema de membro superior após mastectomia.",
    href: "/protocolos/linfedema-pos-mastectomia",
    evidence: "A",
    icon: "👩",
  },
]

export default function ProtocolosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  // Filtrar protocolos com base na pesquisa
  const filteredProtocols = protocolos.filter(
    (protocol) =>
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Carregar favoritos
        const storedFavorites = (await favoritesStore?.getItem<any[]>("favorites")) || []
        const protocolFavorites = storedFavorites.filter((fav) => fav.type === "protocol").map((fav) => fav.itemId)
        setFavorites(protocolFavorites)
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      }
    }

    loadFavorites()
  }, [])

  // Alternar favorito
  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites: string[]

      if (favorites.includes(id)) {
        newFavorites = favorites.filter((fav) => fav !== id)
      } else {
        newFavorites = [...favorites, id]
      }

      setFavorites(newFavorites)

      // Atualizar no banco de dados
      const storedFavorites = (await favoritesStore?.getItem<any[]>("favorites")) || []

      // Remover favoritos existentes deste tipo e ID
      const filteredFavorites = storedFavorites.filter((fav) => !(fav.type === "protocol" && fav.itemId === id))

      // Se estamos adicionando aos favoritos, incluir o novo item
      if (newFavorites.includes(id)) {
        filteredFavorites.push({
          id: crypto.randomUUID(),
          type: "protocol",
          itemId: id,
        })
      }

      await favoritesStore?.setItem("favorites", filteredFavorites)
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error)
    }
  }

  // Agrupar protocolos por categoria
  const categorizedProtocols = {
    ortopedia: filteredProtocols.filter((protocol) => protocol.category === "ortopedia"),
    neurologia: filteredProtocols.filter((protocol) => protocol.category === "neurologia"),
    cardiorrespiratoria: filteredProtocols.filter((protocol) => protocol.category === "cardiorrespiratoria"),
    esportiva: filteredProtocols.filter((protocol) => protocol.category === "esportiva"),
    geriatria: filteredProtocols.filter((protocol) => protocol.category === "geriatria"),
    pediatria: filteredProtocols.filter((protocol) => protocol.category === "pediatria"),
    "saude-mulher": filteredProtocols.filter((protocol) => protocol.category === "saude-mulher"),
  }

  // Obter protocolos favoritos
  const favoriteProtocols = filteredProtocols.filter((protocol) => favorites.includes(protocol.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar protocolo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="categories">Por Especialidade</TabsTrigger>
          <TabsTrigger value="evidence">Por Evidência</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredProtocols.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum protocolo encontrado para "{searchTerm}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProtocols.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {protocol.icon}
                        </span>
                        <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {favoriteProtocols.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Você ainda não adicionou protocolos aos favoritos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProtocols.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {protocol.icon}
                        </span>
                        <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-8">
          {/* Ortopedia */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">🦴</span> Ortopedia e Traumatologia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.ortopedia.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Neurologia */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">🧠</span> Neurologia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.neurologia.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cardiorrespiratória */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">🫁</span> Cardiorrespiratória
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.cardiorrespiratoria.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Esportiva */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">🏃</span> Fisioterapia Esportiva
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.esportiva.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Geriatria */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">👵</span> Gerontologia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.geriatria.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pediatria */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">👶</span> Pediatria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols.pediatria.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Saúde da Mulher */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">👩</span> Saúde da Mulher
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedProtocols["saude-mulher"].map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${
                            protocol.evidence === "A"
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }`}
                        >
                          Evidência {protocol.evidence}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={protocol.href}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          {/* Evidência A */}
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-700 text-base">
                Evidência A
              </Badge>{" "}
              Forte Evidência Científica
            </h3>
            <p className="text-gray-600 mb-4">
              Protocolos com forte evidência científica, baseados em múltiplos estudos clínicos randomizados ou
              meta-análises.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProtocols
                .filter((protocol) => protocol.evidence === "A")
                .map((protocol) => (
                  <Card key={protocol.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" aria-hidden="true">
                            {protocol.icon}
                          </span>
                          <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <CardDescription>{protocol.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={protocol.href}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Evidência B */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
              <Badge variant="outline" className="border-yellow-500 text-yellow-700 text-base">
                Evidência B
              </Badge>{" "}
              Moderada Evidência Científica
            </h3>
            <p className="text-gray-600 mb-4">
              Protocolos com moderada evidência científica, baseados em estudos clínicos menores, estudos observacionais
              ou consenso de especialistas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProtocols
                .filter((protocol) => protocol.evidence === "B")
                .map((protocol) => (
                  <Card key={protocol.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" aria-hidden="true">
                            {protocol.icon}
                          </span>
                          <CardTitle className="text-lg text-blue-900">{protocol.name}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(protocol.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(protocol.id) ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <CardDescription>{protocol.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={protocol.href}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <FileText className="mr-2 h-4 w-4" /> Ver Protocolo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
