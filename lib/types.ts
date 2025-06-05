export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  createdAt: string
  updatedAt: string
}

export interface UsefulLink {
  id: string
  title: string
  url: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface StudyNote {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  dateCreated: string
  dateModified: string
  isImportant: boolean
  relatedLinks?: {
    title: string
    url: string
  }[]
}

export interface MedicalRecordTemplate {
  id: string
  title: string
  specialty: string
  condition?: string
  anamnesis?: string
  physicalExam?: string
  diagnosis?: string
  treatmentPlan?: string
  content?: string
  tags?: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  dateCreated?: string
  dateModified?: string
}

export interface Patient {
  id: string
  name: string
  birthDate: string
  gender: string
  phone: string
  email?: string
  address?: string
  occupation?: string
  healthInsurance?: string
  medicalRecord?: {
    anamnesis?: string
    physicalExam?: string
    diagnosis?: string
    treatmentPlan?: string
  }
  createdAt: string
  updatedAt: string
}

export interface PatientEvolution {
  id: string
  patientId: string
  date: string
  sessionNumber: number
  content: string
  treatment: string
  observations?: string
  painLevel?: number
  functionalProgress?: string
  nextSessionGoals?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}
