import { patientsStore } from "./db"
import type { Patient } from "./types"

// Obter todos os pacientes
export async function getAllPatients(): Promise<Patient[]> {
  try {
    const patients = await patientsStore.getItem<Patient[]>("patients")
    return patients || []
  } catch (error) {
    console.error("Erro ao obter pacientes:", error)
    return []
  }
}

// Obter um paciente específico
export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const patients = await getAllPatients()
    return patients.find((patient) => patient.id === id) || null
  } catch (error) {
    console.error("Erro ao obter paciente:", error)
    return null
  }
}
