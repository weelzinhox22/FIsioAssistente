"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { bodyChartImages } from "@/lib/body-chart"

interface BodyChartCanvasProps {
  view: string
  drawingMode: string
  drawingColor: string
  drawingSize: number
  historyIndex: number
  setHistoryIndex: (index: number) => void
  canvasHistory: any[]
  setCanvasHistory: (history: any[]) => void
}

export function BodyChartCanvas({
  view,
  drawingMode,
  drawingColor,
  drawingSize,
  historyIndex,
  setHistoryIndex,
  canvasHistory,
  setCanvasHistory,
}: BodyChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [bodyImage, setBodyImage] = useState<HTMLImageElement | null>(null)

  // Carregar a imagem do corpo humano
  useEffect(() => {
    const img = new Image()
    img.src = bodyChartImages[view]
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setBodyImage(img)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Se houver histórico, restaurar o estado atual
          if (canvasHistory.length > 0 && historyIndex >= 0) {
            const imageData = canvasHistory[historyIndex]
            if (imageData) {
              const tempImage = new Image()
              tempImage.src = imageData
              tempImage.crossOrigin = "anonymous"
              tempImage.onload = () => {
                ctx.drawImage(tempImage, 0, 0, canvas.width, canvas.height)
              }
            }
          }
        }
      }
    }
  }, [view, canvasHistory, historyIndex])

  // Configurar o canvas quando o componente montar
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      // Ajustar o tamanho do canvas para corresponder ao tamanho do contêiner
      const resizeCanvas = () => {
        const container = canvas.parentElement
        if (container) {
          canvas.width = container.clientWidth
          canvas.height = container.clientHeight

          // Redesenhar o conteúdo após o redimensionamento
          if (bodyImage) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(bodyImage, 0, 0, canvas.width, canvas.height)

              // Restaurar o estado atual do histórico
              if (canvasHistory.length > 0 && historyIndex >= 0) {
                const imageData = canvasHistory[historyIndex]
                if (imageData) {
                  const tempImage = new Image()
                  tempImage.src = imageData
                  tempImage.crossOrigin = "anonymous"
                  tempImage.onload = () => {
                    ctx.drawImage(tempImage, 0, 0, canvas.width, canvas.height)
                  }
                }
              }
            }
          }
        }
      }

      // Chamar o redimensionamento inicialmente e adicionar listener para redimensionamento da janela
      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      // Limpar o listener quando o componente desmontar
      return () => {
        window.removeEventListener("resize", resizeCanvas)
      }
    }
  }, [bodyImage, canvasHistory, historyIndex])

  // Função para iniciar o desenho
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)

    let clientX: number, clientY: number

    if ("touches" in e) {
      // Evento de toque
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Evento de mouse
      clientX = e.clientX
      clientY = e.clientY
    }

    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      setLastX(x)
      setLastY(y)

      // Se for modo de ponto, desenhar um ponto único
      if (drawingMode === "point" || drawingMode === "trigger") {
        drawPoint(x, y)
      }
    }
  }

  // Função para desenhar
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      // Evento de toque
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Evento de mouse
      clientX = e.clientX
      clientY = e.clientY
    }

    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.lineWidth = drawingSize
        ctx.strokeStyle = drawingColor

        if (drawingMode === "pain" || drawingMode === "restriction") {
          ctx.beginPath()
          ctx.moveTo(lastX, lastY)
          ctx.lineTo(x, y)
          ctx.stroke()
        }

        setLastX(x)
        setLastY(y)
      }
    }
  }

  // Função para desenhar um ponto
  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = drawingColor

        if (drawingMode === "trigger") {
          // Desenhar um X para trigger points
          const size = drawingSize * 1.5
          ctx.lineWidth = drawingSize / 2
          ctx.strokeStyle = drawingColor

          ctx.beginPath()
          ctx.moveTo(x - size / 2, y - size / 2)
          ctx.lineTo(x + size / 2, y + size / 2)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(x + size / 2, y - size / 2)
          ctx.lineTo(x - size / 2, y + size / 2)
          ctx.stroke()
        } else {
          // Desenhar um círculo para pontos normais
          ctx.beginPath()
          ctx.arc(x, y, drawingSize / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }

  // Função para finalizar o desenho
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)

      // Salvar o estado atual no histórico
      const canvas = canvasRef.current
      if (canvas) {
        const dataURL = canvas.toDataURL()

        // Se estamos no meio do histórico, remover os estados futuros
        if (historyIndex < canvasHistory.length - 1) {
          const newHistory = canvasHistory.slice(0, historyIndex + 1)
          setCanvasHistory([...newHistory, dataURL])
        } else {
          setCanvasHistory([...canvasHistory, dataURL])
        }

        setHistoryIndex(historyIndex + 1)
      }
    }
  }

  // Função para limpar o canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx && bodyImage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(bodyImage, 0, 0, canvas.width, canvas.height)

        // Adicionar este estado ao histórico
        const dataURL = canvas.toDataURL()
        setCanvasHistory([...canvasHistory, dataURL])
        setHistoryIndex(canvasHistory.length)
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  )
}
