import localforage from "localforage"
import type { Patient, GlossaryTerm, UsefulLink, StudyNote, MedicalRecordTemplate, TestResult } from "./types"
// Adicionar a importação da função initializeEvolutions se necessário
// import { initializeEvolutions } from "./evolution"

// Configuração dos stores
export const patientsStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "patients",
})

export const testsStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "tests",
})

export const bodyChartStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "bodyCharts",
})

export const glossaryStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "glossary",
})

export const linksStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "links",
})

export const studyNotesStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "studyNotes",
})

export const templatesStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "templates",
})

export const favoritesStore = localforage.createInstance({
  name: "fisioterapia-app",
  storeName: "favorites",
})

// Dados iniciais
const initialPatients: Patient[] = []

const initialGlossaryTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "Cinesiologia",
    definition:
      "Estudo científico do movimento humano, especialmente com referência à aplicação dos princípios da anatomia, física e mecânica ao movimento corporal.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    term: "Propriocepção",
    definition:
      "Percepção ou consciência da posição e do movimento do corpo. É a capacidade em reconhecer a localização espacial do corpo, sua posição e orientação, a força exercida pelos músculos e a posição de cada parte do corpo em relação às demais.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialLinks: UsefulLink[] = [
  {
    id: "1",
    title: "PEDro - Physiotherapy Evidence Database",
    url: "https://pedro.org.au/",
    description:
      "Base de dados de evidências em fisioterapia, com acesso a ensaios clínicos, revisões sistemáticas e diretrizes de prática clínica.",
    category: "Pesquisa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "COFFITO - Conselho Federal de Fisioterapia e Terapia Ocupacional",
    url: "https://www.coffito.gov.br/",
    description: "Site oficial do Conselho Federal de Fisioterapia e Terapia Ocupacional do Brasil.",
    category: "Institucional",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialStudyNotes: StudyNote[] = [
  {
    id: "1",
    title: "Princípios da Terapia Manual",
    content:
      "# Princípios da Terapia Manual\n\n## Técnicas Básicas\n\n- Mobilização articular\n- Manipulação\n- Liberação miofascial\n- Alongamento\n\n## Indicações\n\n- Dor articular\n- Restrição de movimento\n- Disfunções musculoesqueléticas",
    tags: ["terapia manual", "técnicas", "mobilização"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialTemplates: MedicalRecordTemplate[] = [
  {
    id: "1",
    title: "Avaliação Fisioterapêutica - Ortopedia",
    specialty: "Ortopedia",
    content: `# Avaliação Fisioterapêutica - Ortopedia

## Dados do Paciente
- Nome: [Nome do Paciente]
- Idade: [Idade]
- Sexo: [Sexo]
- Profissão: [Profissão]
- Data da Avaliação: [Data]

## Anamnese
- Queixa Principal: 
- História da Doença Atual (HDA): 
- Doenças Pregressas:
- Medicamentos em uso:
- Exames Complementares:

## Avaliação da Dor
- Local:
- Intensidade (EVA 0-10):
- Característica:
- Fatores de Melhora:
- Fatores de Piora:

## Inspeção
- Postura:
- Marcha:
- Edema:
- Cicatrizes:

## Palpação
- Temperatura:
- Dor à palpação:
- Tônus muscular:

## Avaliação da Amplitude de Movimento (ADM)
- Articulação afetada:
  - Flexão:
  - Extensão:
  - Abdução:
  - Adução:
  - Rotação interna:
  - Rotação externa:

## Testes Especiais
- [Listar testes específicos para a região afetada]

## Força Muscular
- [Avaliação de força por grupos musculares]

## Diagnóstico Fisioterapêutico

## Objetivos do Tratamento

## Plano de Tratamento
`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Avaliação Fisioterapêutica - Neurologia",
    specialty: "Neurologia",
    content: `# Avaliação Fisioterapêutica - Neurologia

## Dados do Paciente
- Nome: [Nome do Paciente]
- Idade: [Idade]
- Sexo: [Sexo]
- Diagnóstico Médico:
- Data da Avaliação: [Data]

## Anamnese
- Queixa Principal: 
- História da Doença Atual (HDA): 
- Doenças Associadas:
- Medicamentos em uso:

## Estado de Consciência
- Nível de consciência:
- Orientação tempo-espacial:
- Comunicação:

## Avaliação Respiratória
- Padrão respiratório:
- Frequência respiratória:
- Ausculta pulmonar:

## Tônus Muscular
- Membros superiores:
- Membros inferiores:
- Escala de Ashworth Modificada:

## Sensibilidade
- Tátil:
- Dolorosa:
- Térmica:
- Proprioceptiva:

## Coordenação Motora
- Prova índex-nariz:
- Prova calcanhar-joelho:
- Diadococinesia:

## Equilíbrio
- Estático:
- Dinâmico:
- Escala de Berg:

## Marcha
- Padrão:
- Dispositivos auxiliares:
- Observações:

## Atividades de Vida Diária (AVDs)
- Índice de Barthel:
- Observações:

## Diagnóstico Fisioterapêutico

## Objetivos do Tratamento

## Plano de Tratamento
`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Avaliação Fisioterapêutica - Respiratória",
    specialty: "Respiratória",
    content: `# Avaliação Fisioterapêutica - Respiratória

## Dados do Paciente
- Nome: [Nome do Paciente]
- Idade: [Idade]
- Sexo: [Sexo]
- Diagnóstico Médico:
- Data da Avaliação: [Data]

## Anamnese
- Queixa Principal: 
- História da Doença Atual (HDA): 
- Doenças Pregressas:
- Medicamentos em uso:
- Tabagismo:
- Exames Complementares:

## Sinais Vitais
- PA:
- FC:
- FR:
- SpO2:
- Temperatura:

## Inspeção
- Padrão respiratório:
- Uso de musculatura acessória:
- Tiragem intercostal:
- Batimento de asa de nariz:
- Cianose:

## Palpação
- Expansibilidade torácica:
- Frêmito tóraco-vocal:
- Edema:

## Percussão
- Som claro pulmonar:
- Macicez:
- Timpanismo:

## Ausculta Pulmonar
- Murmúrio vesicular:
- Ruídos adventícios:
  - Roncos:
  - Sibilos:
  - Estertores:
  - Atrito pleural:

## Tosse
- Características:
- Eficácia:

## Expectoração
- Volume:
- Aspecto:
- Consistência:

## Testes de Função Pulmonar
- CVF:
- VEF1:
- VEF1/CVF:
- Pico de Fluxo:

## Diagnóstico Fisioterapêutico

## Objetivos do Tratamento

## Plano de Tratamento
`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Evolução Diária - Fisioterapia",
    specialty: "Geral",
    content: `# Evolução Diária - Fisioterapia

## Dados do Paciente
- Nome: [Nome do Paciente]
- Leito/Quarto: [Leito/Quarto]
- Data: [Data]
- Hora: [Hora]

## Sinais Vitais
- PA:
- FC:
- FR:
- SpO2:
- Temperatura:

## Estado Geral
- Nível de consciência:
- Colaboração:
- Dor (EVA 0-10):

## Conduta Realizada
- [Descrever técnicas e procedimentos realizados]

## Resposta ao Tratamento
- [Descrever resposta imediata do paciente]

## Observações

## Plano para Próximo Atendimento

## Fisioterapeuta Responsável
- Nome:
- CREFITO:
`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Avaliação Fisioterapêutica - Pediatria",
    specialty: "Pediatria",
    content: `# Avaliação Fisioterapêutica - Pediatria

## Dados do Paciente
- Nome: [Nome do Paciente]
- Data de Nascimento: [Data]
- Idade: [Idade]
- Sexo: [Sexo]
- Responsável: [Nome do Responsável]
- Data da Avaliação: [Data]

## Anamnese
- Queixa Principal: 
- História da Doença Atual (HDA): 
- Antecedentes Gestacionais:
  - Tipo de parto:
  - Idade gestacional:
  - Intercorrências na gestação:
  - Peso ao nascer:
  - APGAR:
- Desenvolvimento Neuropsicomotor:
  - Sustentação cefálica:
  - Sentar sem apoio:
  - Engatinhar:
  - Marcha:
  - Primeiras palavras:
- Doenças Pregressas:
- Medicamentos em uso:

## Avaliação Física
- Estado geral:
- Padrão postural:
- Padrão respiratório:
- Tônus muscular:
- Reflexos primitivos:
- Reações posturais:

## Avaliação Neurológica
- Força muscular:
- Sensibilidade:
- Coordenação motora:
- Equilíbrio:

## Avaliação Funcional
- Mobilidade:
- Transferências:
- Marcha (se aplicável):
- Atividades lúdicas:

## Escalas de Avaliação
- [Escalas específicas conforme idade e condição]

## Diagnóstico Fisioterapêutico

## Objetivos do Tratamento

## Plano de Tratamento
`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Função para inicializar o banco de dados
export async function initializeDatabase() {
  try {
    // Verificar se já existem pacientes no banco
    const existingPatients = await patientsStore.getItem("patients")
    if (!existingPatients) {
      await patientsStore.setItem("patients", initialPatients)
      console.log("Banco de pacientes inicializado com sucesso!")
    }

    // Verificar se já existem termos no glossário
    const existingTerms = await glossaryStore.getItem("terms")
    if (!existingTerms) {
      await glossaryStore.setItem("terms", initialGlossaryTerms)
      console.log("Glossário inicializado com sucesso!")
    }

    // Verificar se já existem links úteis
    const existingLinks = await linksStore.getItem("links")
    if (!existingLinks) {
      await linksStore.setItem("links", initialLinks)
      console.log("Links úteis inicializados com sucesso!")
    }

    // Verificar se já existem notas de estudo
    const existingNotes = await studyNotesStore.getItem("notes")
    if (!existingNotes) {
      await studyNotesStore.setItem("notes", initialStudyNotes)
      console.log("Notas de estudo inicializadas com sucesso!")
    }

    // Verificar se já existem modelos de prontuário
    const existingTemplates = await templatesStore.getItem("templates")
    if (!existingTemplates) {
      await templatesStore.setItem("templates", initialTemplates)
      console.log("Modelos de prontuário inicializados com sucesso!")
    }

    // Inicializar evoluções se necessário
    // await initializeEvolutions()

    return true
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error)
    return false
  }
}

// Função para obter todos os pacientes
export async function getPatients(): Promise<Patient[]> {
  try {
    const patients = (await patientsStore.getItem("patients")) as Patient[] | null
    return patients || []
  } catch (error) {
    console.error("Erro ao obter pacientes:", error)
    return []
  }
}

// Função para excluir um paciente
export async function deletePatient(id: string): Promise<boolean> {
  try {
    const patients = (await patientsStore.getItem("patients")) as Patient[] | null
    if (!patients) return false

    const updatedPatients = patients.filter((patient) => patient.id !== id)
    await patientsStore.setItem("patients", updatedPatients)
    return true
  } catch (error) {
    console.error("Erro ao excluir paciente:", error)
    return false
  }
}

// Função para adicionar um novo paciente
export async function addPatient(patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
  try {
    const patients = ((await patientsStore.getItem("patients")) as Patient[] | null) || []

    const newPatient: Patient = {
      id: crypto.randomUUID(),
      ...patientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedPatients = [...patients, newPatient]
    await patientsStore.setItem("patients", updatedPatients)

    return newPatient
  } catch (error) {
    console.error("Erro ao adicionar paciente:", error)
    throw new Error("Falha ao adicionar paciente")
  }
}

// Função para obter um paciente específico
export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const patients = (await patientsStore.getItem("patients")) as Patient[] | null
    if (!patients) return null

    const patient = patients.find((p) => p.id === id)
    return patient || null
  } catch (error) {
    console.error("Erro ao obter paciente:", error)
    return null
  }
}

// Função para atualizar um paciente
export async function updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient | null> {
  try {
    const patients = (await patientsStore.getItem("patients")) as Patient[] | null
    if (!patients) return null

    const patientIndex = patients.findIndex((p) => p.id === id)
    if (patientIndex === -1) return null

    const updatedPatient = {
      ...patients[patientIndex],
      ...patientData,
      updatedAt: new Date().toISOString(),
    }

    const updatedPatients = [...patients]
    updatedPatients[patientIndex] = updatedPatient

    await patientsStore.setItem("patients", updatedPatients)
    return updatedPatient
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)
    return null
  }
}

// Funções para testes
export async function getTestResults(): Promise<TestResult[]> {
  try {
    const tests = (await testsStore.getItem("tests")) as TestResult[] | null
    return tests || []
  } catch (error) {
    console.error("Erro ao obter resultados de testes:", error)
    return []
  }
}

export async function addTestResult(testResult: Omit<TestResult, "id">): Promise<TestResult> {
  try {
    const tests = ((await testsStore.getItem("tests")) as TestResult[] | null) || []
    const newTestResult: TestResult = {
      ...testResult,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }

    const updatedTests = [...tests, newTestResult]
    await testsStore.setItem("tests", updatedTests)

    return newTestResult
  } catch (error) {
    console.error("Erro ao adicionar resultado de teste:", error)
    throw new Error("Falha ao adicionar resultado de teste")
  }
}

export async function deleteTestResult(id: string): Promise<boolean> {
  try {
    const tests = (await testsStore.getItem("tests")) as TestResult[] | null
    if (!tests) return false

    const updatedTests = tests.filter((test) => test.id !== id)
    await testsStore.setItem("tests", updatedTests)
    return true
  } catch (error) {
    console.error("Erro ao excluir resultado de teste:", error)
    return false
  }
}

export async function getTestResult(id: string): Promise<TestResult | null> {
  try {
    const tests = (await testsStore.getItem("tests")) as TestResult[] | null
    if (!tests) return null

    const test = tests.find((t) => t.id === id)
    return test || null
  } catch (error) {
    console.error("Erro ao obter resultado de teste:", error)
    return null
  }
}

// Funções para exportação e importação de dados
export async function exportData(): Promise<string> {
  try {
    const patients = await patientsStore.getItem("patients")
    const tests = await testsStore.getItem("tests")
    const templates = await templatesStore.getItem("templates")
    const favorites = await favoritesStore.getItem("favorites")
    const glossary = await glossaryStore.getItem("terms")
    const links = await linksStore.getItem("links")
    const notes = await studyNotesStore.getItem("notes")

    const data = JSON.stringify({
      patients,
      tests,
      templates,
      favorites,
      glossary,
      links,
      notes,
    })
    return data
  } catch (error) {
    console.error("Erro ao exportar dados:", error)
    throw error
  }
}

export async function importData(data: string): Promise<boolean> {
  try {
    const { patients, tests, templates, favorites, glossary, links, notes } = JSON.parse(data)

    if (patients) await patientsStore.setItem("patients", patients)
    if (tests) await testsStore.setItem("tests", tests)
    if (templates) await templatesStore.setItem("templates", templates)
    if (favorites) await favoritesStore.setItem("favorites", favorites)
    if (glossary) await glossaryStore.setItem("terms", glossary)
    if (links) await linksStore.setItem("links", links)
    if (notes) await studyNotesStore.setItem("notes", notes)

    return true
  } catch (error) {
    console.error("Erro ao importar dados:", error)
    return false
  }
}

// Adicione estas funções para gerenciar favoritos de escalas

// Função para obter escalas favoritas
export async function getFavoriteScales(): Promise<string[]> {
  try {
    const favoriteScales = (await favoritesStore.getItem("favoriteScales")) as string[] | null
    return favoriteScales || []
  } catch (error) {
    console.error("Erro ao obter escalas favoritas:", error)
    return []
  }
}

// Função para salvar escalas favoritas
export async function saveFavoriteScales(favoriteScales: string[]): Promise<void> {
  try {
    await favoritesStore.setItem("favoriteScales", favoriteScales)
  } catch (error) {
    console.error("Erro ao salvar escalas favoritas:", error)
  }
}

// Adicione estas interfaces e funções para gerenciar o histórico de avaliações

// Interface para avaliações
export interface ScaleAssessment {
  id?: number
  scaleId: string
  scaleName: string
  patientId?: number
  patientName?: string
  date: string
  score: number
  details: Record<string, any>
  notes?: string
}

// Função para salvar uma avaliação
export async function saveScaleAssessment(assessment: ScaleAssessment): Promise<number> {
  try {
    // const db = await openDB(); // Assuming openDB is defined elsewhere and returns a database connection
    // const tx = db.transaction('scaleAssessments', 'readwrite');
    // const store = tx.objectStore('scaleAssessments');
    // const id = await store.add({
    //   ...assessment,
    //   date: assessment.date || new Date().toISOString()
    // });
    // await tx.done;
    // return id as number;
    console.warn("saveScaleAssessment function is currently a placeholder and does not interact with a database.")
    return 1 // Placeholder return
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    throw error
  }
}

// Função para obter todas as avaliações
export async function getAllScaleAssessments(): Promise<ScaleAssessment[]> {
  try {
    // const db = await openDB();
    // const tx = db.transaction('scaleAssessments', 'readonly');
    // const store = tx.objectStore('scaleAssessments');
    // const assessments = await store.getAll();
    // return assessments;
    console.warn("getAllScaleAssessments function is currently a placeholder and does not interact with a database.")
    return [] // Placeholder return
  } catch (error) {
    console.error("Erro ao obter avaliações:", error)
    return []
  }
}

// Função para obter avaliações por ID de escala
export async function getScaleAssessmentsByScaleId(scaleId: string): Promise<ScaleAssessment[]> {
  try {
    const allAssessments = await getAllScaleAssessments()
    return allAssessments.filter((assessment) => assessment.scaleId === scaleId)
  } catch (error) {
    console.error("Erro ao obter avaliações por escala:", error)
    return []
  }
}

// Função para obter avaliações por ID de paciente
export async function getScaleAssessmentsByPatientId(patientId: number): Promise<ScaleAssessment[]> {
  try {
    const allAssessments = await getAllScaleAssessments()
    return allAssessments.filter((assessment) => assessment.patientId === patientId)
  } catch (error) {
    console.error("Erro ao obter avaliações por paciente:", error)
    return []
  }
}

// Função para obter uma avaliação por ID
export async function getScaleAssessmentById(id: number): Promise<ScaleAssessment | undefined> {
  try {
    // const db = await openDB();
    // const tx = db.transaction('scaleAssessments', 'readonly');
    // const store = tx.objectStore('scaleAssessments');
    // const assessment = await store.get(id);
    // return assessment;
    console.warn("getScaleAssessmentById function is currently a placeholder and does not interact with a database.")
    return undefined // Placeholder return
  } catch (error) {
    console.error("Erro ao obter avaliação por ID:", error)
    return undefined
  }
}

// Função para atualizar uma avaliação
export async function updateScaleAssessment(assessment: ScaleAssessment): Promise<void> {
  try {
    // const db = await openDB();
    // const tx = db.transaction('scaleAssessments', 'readwrite');
    // const store = tx.objectStore('scaleAssessments');
    // await store.put(assessment);
    // await tx.done;
    console.warn("updateScaleAssessment function is currently a placeholder and does not interact with a database.")
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error)
    throw error
  }
}

// Função para excluir uma avaliação
export async function deleteScaleAssessment(id: number): Promise<void> {
  try {
    // const db = await openDB();
    // const tx = db.transaction('scaleAssessments', 'readwrite');
    // const store = tx.objectStore('scaleAssessments');
    // await store.delete(id);
    // await tx.done;
    console.warn("deleteScaleAssessment function is currently a placeholder and does not interact with a database.")
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error)
    throw error
  }
}

// Atualize a função openDB para incluir o armazenamento de avaliações
export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fisioterapiaDB", 2) // Atualize a versão do banco

    request.onerror = (event) => {
      reject("Erro ao abrir o banco de dados")
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Crie ou atualize os object stores conforme necessário
      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("evolutions")) {
        db.createObjectStore("evolutions", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("templates")) {
        db.createObjectStore("templates", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("studyNotes")) {
        db.createObjectStore("studyNotes", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("bodyCharts")) {
        db.createObjectStore("bodyCharts", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" })
      }

      // Adicione o object store para avaliações de escalas
      if (!db.objectStoreNames.contains("scaleAssessments")) {
        const scaleAssessmentsStore = db.createObjectStore("scaleAssessments", { keyPath: "id", autoIncrement: true })
        scaleAssessmentsStore.createIndex("scaleId", "scaleId", { unique: false })
        scaleAssessmentsStore.createIndex("patientId", "patientId", { unique: false })
        scaleAssessmentsStore.createIndex("date", "date", { unique: false })
      }
    }
  })
}
