"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookmarkPlus, BookmarkCheck, Share2 } from "lucide-react"
import { getGlossaryTerm, toggleFavoriteTerm, getFavoriteTerms } from "@/lib/glossary"
import type { GlossaryTerm } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function TermoDetalhePage({ params }: { params: { id: string } }) {
  const [term, setTerm] = useState<GlossaryTerm | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const categories = {
    ortopedia: "Ortopedia",
    neurologia: "Neurologia",
    respiratoria: "Respiratória",
    cardiologia: "Cardiologia",
    geriatria: "Geriatria",
    pediatria: "Pediatria",
    esportiva: "Esportiva",
    geral: "Termos Gerais",
  }

  useEffect(() => {
    const loadTerm = async () => {
      setIsLoading(true)
      try {
        const termData = await getGlossaryTerm(params.id)
        if (!termData) {
          setError("Termo não encontrado")
          return
        }

        setTerm(termData)

        const favorites = await getFavoriteTerms()
        setIsFavorite(favorites.includes(params.id))
      } catch (error) {
        console.error("Erro ao carregar termo:", error)
        setError("Erro ao carregar termo")
      } finally {
        setIsLoading(false)
      }
    }

    loadTerm()
  }, [params.id])

  const handleToggleFavorite = async () => {
    if (!term) return

    try {
      await toggleFavoriteTerm(term.id, !isFavorite)
      setIsFavorite(!isFavorite)

      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `"${term.term}" foi ${isFavorite ? "removido dos" : "adicionado aos"} favoritos.`,
      })
    } catch (error) {
      console.error("Erro ao favoritar termo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!term) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Termo Fisioterapêutico: ${term.term}`,
          text: `${term.term}: ${term.definition}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      // Fallback para copiar para a área de transferência
      navigator.clipboard.writeText(`${term.term}: ${term.definition} - ${window.location.href}`)
      toast({
        title: "Link copiado",
        description: "O link foi copiado para a área de transferência.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (error || !term) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Erro</h1>
        </div>

        <Alert variant="destructive">
          <AlertDescription>{error || "Termo não encontrado"}</AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/glossario")}>Voltar para o glossário</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Termo</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{term.term}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-2">
                  {categories[term.category as keyof typeof categories] || term.category}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorite ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Compartilhar">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Definição</h3>
            <p className="text-muted-foreground whitespace-pre-line">{term.definition}</p>
          </div>

          {term.examples && term.examples.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Exemplos</h3>
              <ul className="list-disc pl-5 space-y-1">
                {term.examples.map((example, index) => (
                  <li key={index} className="text-muted-foreground">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Termos Relacionados</h3>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((relatedTerm, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => router.push(`/glossario/${relatedTerm.id}`)}
                  >
                    {relatedTerm.term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {term.references && term.references.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Referências</h3>
              <ul className="list-disc pl-5 space-y-1">
                {term.references.map((reference, index) => (
                  <li key={index} className="text-muted-foreground text-sm">
                    {reference}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
