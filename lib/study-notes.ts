import localforage from "localforage"
import type { StudyNote } from "./types"
import { generateId } from "./utils"

// Inicializar o store para notas de estudo
const studyNotesStore = localforage.createInstance({
  name: "fisiobase",
  storeName: "study_notes",
})

// Dados iniciais de notas de estudo
const initialStudyNotes: Omit<StudyNote, "id">[] = [
  {
    title: "Anatomia do Joelho",
    content: `# Anatomia do Joelho

## Estruturas Ósseas
- Fêmur (côndilo medial e lateral)
- Tíbia (platô tibial)
- Patela (maior osso sesamóide do corpo)

## Ligamentos Principais
- Ligamento Cruzado Anterior (LCA): Impede o deslocamento anterior da tíbia
- Ligamento Cruzado Posterior (LCP): Impede o deslocamento posterior da tíbia
- Ligamento Colateral Medial (LCM): Estabiliza o lado medial
- Ligamento Colateral Lateral (LCL): Estabiliza o lado lateral

## Meniscos
- Menisco Medial: Formato de C, menos móvel
- Menisco Lateral: Formato de O, mais móvel

## Músculos Principais
- Quadríceps (reto femoral, vasto lateral, vasto medial, vasto intermédio)
- Isquiotibiais (bíceps femoral, semitendíneo, semimembranáceo)
- Gastrocnêmio
- Poplíteo

## Observações Clínicas
- O LCA é o ligamento mais comumente lesionado
- O menisco medial é mais frequentemente lesionado que o lateral
- A articulação do joelho é a maior articulação sinovial do corpo`,
    category: "anatomia",
    tags: ["joelho", "ligamentos", "meniscos", "articulação"],
    dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
    dateModified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias atrás
    isImportant: true,
    relatedLinks: [
      {
        title: "Vídeo: Anatomia do Joelho em 3D",
        url: "https://www.youtube.com/watch?v=example1",
      },
      {
        title: "Artigo: Biomecânica do Joelho",
        url: "https://www.ncbi.nlm.nih.gov/example1",
      },
    ],
  },
  {
    title: "Técnicas de Mobilização Neural",
    content: `# Técnicas de Mobilização Neural

## Princípios Básicos
- A mobilização neural visa restaurar a homeostasia no e ao redor do tecido neural
- Trabalha com o conceito de interface mecânica (estruturas que cercam o tecido neural)
- Utiliza tensionamento e deslizamento neural

## Técnicas Principais
### Deslizamento Neural
- Combina movimentos que aumentam a tensão em uma extremidade do nervo enquanto reduz na outra
- Produz maior excursão do nervo com menos tensão
- Indicado para casos mais agudos ou irritáveis

### Tensionamento Neural
- Aumenta a tensão em todo o trajeto do nervo
- Mais agressivo que o deslizamento
- Indicado para casos crônicos ou menos irritáveis

## Testes Neurodinâmicos
1. ULNT (Upper Limb Neural Tension Test) - para membros superiores
2. SLR (Straight Leg Raise) - para ciático
3. PKB (Prone Knee Bend) - para femoral
4. Slump Test - para tecido neural da coluna

## Precauções
- Evitar provocar sintomas intensos durante o tratamento
- Respeitar a resposta do paciente
- Contraindicado em casos de inflamação aguda do nervo`,
    category: "técnicas",
    tags: ["mobilização neural", "nervo", "neurodinâmica", "deslizamento"],
    dateCreated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 dias atrás
    dateModified: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias atrás
    isImportant: false,
    relatedLinks: [
      {
        title: "Livro: Clinical Neurodynamics",
        url: "https://www.amazon.com/example2",
      },
    ],
  },
  {
    title: "Avaliação da Marcha",
    content: `# Avaliação da Marcha

## Ciclo da Marcha
### Fase de Apoio (60%)
1. Contato inicial
2. Resposta à carga
3. Apoio médio
4. Apoio terminal
5. Pré-balanço

### Fase de Balanço (40%)
1. Balanço inicial
2. Balanço médio
3. Balanço terminal

## Parâmetros Espaciais
- Comprimento do passo
- Comprimento da passada
- Largura da base
- Ângulo do pé

## Parâmetros Temporais
- Cadência (passos por minuto)
- Velocidade
- Tempo de apoio simples e duplo

## Alterações Comuns
- Marcha antálgica: Diminuição do tempo de apoio no lado afetado devido à dor
- Marcha em tesoura: Característica da paralisia cerebral espástica
- Marcha em steppage: Característica da lesão do nervo fibular
- Marcha parkinsoniana: Passos curtos, arrastados, com diminuição do balanço dos braços

## Instrumentos de Avaliação
- Análise observacional
- Filmagem
- Plataformas de pressão
- Sistemas de análise 3D`,
    category: "avaliação",
    tags: ["marcha", "locomoção", "biomecânica", "reabilitação"],
    dateCreated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias atrás
    dateModified: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias atrás
    isImportant: true,
    relatedLinks: [
      {
        title: "Vídeo: Análise da Marcha Normal e Patológica",
        url: "https://www.youtube.com/watch?v=example3",
      },
    ],
  },
]

// Inicializar o banco de dados com notas de estudo padrão
export const initializeStudyNotes = async () => {
  try {
    const existingNotes = await studyNotesStore.getItem<StudyNote[]>("notes")

    if (!existingNotes || existingNotes.length === 0) {
      const notes = initialStudyNotes.map((note) => ({
        ...note,
        id: generateId(),
      }))

      await studyNotesStore.setItem("notes", notes)
      return notes
    }

    return existingNotes
  } catch (error) {
    console.error("Erro ao inicializar notas de estudo:", error)
    return []
  }
}

// Obter todas as notas de estudo
export const getAllStudyNotes = async (): Promise<StudyNote[]> => {
  try {
    const notes = await studyNotesStore.getItem<StudyNote[]>("notes")
    return notes || (await initializeStudyNotes())
  } catch (error) {
    console.error("Erro ao obter notas de estudo:", error)
    return []
  }
}

// Obter uma nota de estudo específica
export const getStudyNote = async (id: string): Promise<StudyNote | null> => {
  try {
    const notes = await getAllStudyNotes()
    return notes.find((note) => note.id === id) || null
  } catch (error) {
    console.error("Erro ao obter nota de estudo:", error)
    return null
  }
}

// Adicionar uma nova nota de estudo
export const addStudyNote = async (note: Omit<StudyNote, "id">): Promise<StudyNote> => {
  try {
    const notes = await getAllStudyNotes()
    const newNote: StudyNote = {
      ...note,
      id: generateId(),
    }

    await studyNotesStore.setItem("notes", [...notes, newNote])
    return newNote
  } catch (error) {
    console.error("Erro ao adicionar nota de estudo:", error)
    throw error
  }
}

// Atualizar uma nota de estudo existente
export const updateStudyNote = async (updatedNote: StudyNote): Promise<StudyNote> => {
  try {
    const notes = await getAllStudyNotes()
    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))

    await studyNotesStore.setItem("notes", updatedNotes)
    return updatedNote
  } catch (error) {
    console.error("Erro ao atualizar nota de estudo:", error)
    throw error
  }
}

// Excluir uma nota de estudo
export const deleteStudyNote = async (id: string): Promise<void> => {
  try {
    const notes = await getAllStudyNotes()
    const filteredNotes = notes.filter((note) => note.id !== id)

    await studyNotesStore.setItem("notes", filteredNotes)
  } catch (error) {
    console.error("Erro ao excluir nota de estudo:", error)
    throw error
  }
}

// Alternar importância de uma nota
export const toggleNoteImportance = async (id: string): Promise<StudyNote | null> => {
  try {
    const notes = await getAllStudyNotes()
    const noteIndex = notes.findIndex((note) => note.id === id)

    if (noteIndex === -1) return null

    const updatedNote = {
      ...notes[noteIndex],
      isImportant: !notes[noteIndex].isImportant,
    }

    notes[noteIndex] = updatedNote
    await studyNotesStore.setItem("notes", notes)

    return updatedNote
  } catch (error) {
    console.error("Erro ao alternar importância da nota:", error)
    return null
  }
}

// Buscar notas de estudo
export const searchStudyNotes = async (query: string): Promise<StudyNote[]> => {
  try {
    if (!query.trim()) return []

    const notes = await getAllStudyNotes()
    const normalizedQuery = query.toLowerCase().trim()

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    )
  } catch (error) {
    console.error("Erro ao buscar notas:", error)
    return []
  }
}
