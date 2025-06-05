import localforage from "localforage"
import type { PatientEvolution } from "./types"
import { v4 as uuidv4 } from "uuid"

// Inicializar o store para evoluções
const evolutionsStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "evolutions",
})

// Obter todas as evoluções de um paciente
export async function getPatientEvolutions(patientId: string): Promise<PatientEvolution[]> {
  try {
    const evolutions = (await evolutionsStore.getItem<PatientEvolution[]>("evolutions")) || []
    return evolutions
      .filter((evolution) => evolution.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Erro ao obter evoluções do paciente:", error)
    return []
  }
}

// Obter uma evolução específica
export async function getEvolution(id: string): Promise<PatientEvolution | null> {
  try {
    const evolutions = (await evolutionsStore.getItem<PatientEvolution[]>("evolutions")) || []
    return evolutions.find((evolution) => evolution.id === id) || null
  } catch (error) {
    console.error("Erro ao obter evolução:", error)
    return null
  }
}

// Adicionar uma nova evolução
export async function addEvolution(
  evolution: Omit<PatientEvolution, "id" | "createdAt" | "updatedAt">,
): Promise<PatientEvolution> {
  try {
    const evolutions = (await evolutionsStore.getItem<PatientEvolution[]>("evolutions")) || []
    const now = new Date().toISOString()

    const newEvolution: PatientEvolution = {
      ...evolution,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }

    await evolutionsStore.setItem("evolutions", [...evolutions, newEvolution])
    return newEvolution
  } catch (error) {
    console.error("Erro ao adicionar evolução:", error)
    throw error
  }
}

// Atualizar uma evolução existente
export async function updateEvolution(id: string, updates: Partial<PatientEvolution>): Promise<PatientEvolution> {
  try {
    const evolutions = (await evolutionsStore.getItem<PatientEvolution[]>("evolutions")) || []
    const index = evolutions.findIndex((evolution) => evolution.id === id)

    if (index === -1) {
      throw new Error(`Evolução com ID ${id} não encontrada`)
    }

    const updatedEvolution: PatientEvolution = {
      ...evolutions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    evolutions[index] = updatedEvolution
    await evolutionsStore.setItem("evolutions", evolutions)

    return updatedEvolution
  } catch (error) {
    console.error("Erro ao atualizar evolução:", error)
    throw error
  }
}

// Excluir uma evolução
export async function deleteEvolution(id: string): Promise<boolean> {
  try {
    const evolutions = (await evolutionsStore.getItem<PatientEvolution[]>("evolutions")) || []
    const filteredEvolutions = evolutions.filter((evolution) => evolution.id !== id)

    if (filteredEvolutions.length === evolutions.length) {
      return false // Nenhuma evolução foi removida
    }

    await evolutionsStore.setItem("evolutions", filteredEvolutions)
    return true
  } catch (error) {
    console.error("Erro ao excluir evolução:", error)
    return false
  }
}

// Obter o próximo número de sessão para um paciente
export async function getNextSessionNumber(patientId: string): Promise<number> {
  try {
    const evolutions = await getPatientEvolutions(patientId)
    if (evolutions.length === 0) return 1

    const maxSessionNumber = Math.max(...evolutions.map((e) => e.sessionNumber))
    return maxSessionNumber + 1
  } catch (error) {
    console.error("Erro ao obter próximo número de sessão:", error)
    return 1
  }
}

// Inicializar o banco de dados de evoluções
export async function initializeEvolutions(): Promise<void> {
  try {
    const evolutions = await evolutionsStore.getItem<PatientEvolution[]>("evolutions")
    if (!evolutions) {
      await evolutionsStore.setItem("evolutions", [])
      console.log("Banco de evoluções inicializado com sucesso!")
    }
  } catch (error) {
    console.error("Erro ao inicializar banco de evoluções:", error)
  }
}
