import localforage from "localforage"
import { generateId } from "@/lib/utils"

// Definir o armazenamento para os body charts
const bodyChartStore = localforage.createInstance({
  name: "fisiobase",
  storeName: "body_charts",
})

// Tipo para o Body Chart
export type BodyChart = {
  id: string
  title: string
  patientId?: string
  date: string
  views: {
    anterior?: string
    posterior?: string
    lateralEsquerda?: string
    lateralDireita?: string
  }
  notes: string
}

// Imagens do corpo humano para diferentes vistas
export const bodyChartImages = {
  anterior: "/human-silhouette-front.png",
  posterior: "/placeholder.svg?key=hywyg",
  "lateral-esquerda": "/placeholder.svg?key=rv7k6",
  "lateral-direita": "/placeholder.svg?key=5b22x",
}

// Função para salvar um body chart
export const saveBodyChart = async (bodyChartData: Omit<BodyChart, "id" | "date">): Promise<string> => {
  try {
    const id = generateId()
    const bodyChart: BodyChart = {
      id,
      ...bodyChartData,
      date: new Date().toISOString(),
    }

    await bodyChartStore.setItem(id, bodyChart)
    return id
  } catch (error) {
    console.error("Error saving body chart:", error)
    throw error
  }
}

// Função para carregar um body chart pelo ID
export const loadBodyChart = async (id: string): Promise<BodyChart | null> => {
  try {
    const bodyChart = await bodyChartStore.getItem<BodyChart>(id)
    return bodyChart
  } catch (error) {
    console.error("Error loading body chart:", error)
    return null
  }
}

// Função para obter todos os body charts
export const getAllBodyCharts = async (): Promise<BodyChart[]> => {
  try {
    const bodyCharts: BodyChart[] = []
    await bodyChartStore.iterate((value: BodyChart) => {
      if (value && value.id) {
        bodyCharts.push(value)
      }
    })

    // Ordenar por data, do mais recente para o mais antigo
    return bodyCharts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error getting all body charts:", error)
    return []
  }
}

// Função para obter body charts de um paciente específico
export const getPatientBodyCharts = async (patientId: string): Promise<BodyChart[]> => {
  try {
    const allCharts = await getAllBodyCharts()
    return allCharts.filter((chart) => chart.patientId === patientId)
  } catch (error) {
    console.error("Error getting patient body charts:", error)
    return []
  }
}

// Função para excluir um body chart
export const deleteBodyChart = async (id: string): Promise<boolean> => {
  try {
    await bodyChartStore.removeItem(id)
    return true
  } catch (error) {
    console.error("Error deleting body chart:", error)
    return false
  }
}
