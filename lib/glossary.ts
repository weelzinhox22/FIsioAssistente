import localforage from "localforage"
import { generateId } from "@/lib/utils"
import type { GlossaryTerm } from "@/lib/types"

const isClient = typeof window !== "undefined"

const glossaryStore = isClient
  ? localforage.createInstance({
      name: "fisiobase",
      storeName: "glossary",
    })
  : null

const favoritesStore = isClient
  ? localforage.createInstance({
      name: "fisiobase",
      storeName: "favorites",
    })
  : null

// Dados iniciais para o glossário
const initialGlossaryTerms: GlossaryTerm[] = [
  {
    id: "abd-transverso",
    term: "Abdômen Transverso",
    definition:
      "Músculo profundo da parede abdominal que atua na estabilização da coluna lombar e na compressão do conteúdo abdominal. É um componente importante do core e participa da respiração.",
    category: "ortopedia",
    examples: ["Exercícios de estabilização do core", "Técnica de respiração diafragmática"],
    references: ["Neumann, D. A. (2017). Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation."],
  },
  {
    id: "adm",
    term: "ADM (Amplitude de Movimento)",
    definition:
      "Medida do arco de movimento disponível em uma articulação, expressa em graus. Pode ser ativa (realizada pelo próprio paciente) ou passiva (realizada pelo terapeuta).",
    category: "geral",
    examples: ["ADM de flexão do joelho: 0-135°", "Limitação de ADM no ombro pós-cirúrgico"],
    references: ["Marques, A. P. (2014). Manual de Goniometria."],
  },
  {
    id: "biofeedback",
    term: "Biofeedback",
    definition:
      "Técnica terapêutica que utiliza equipamentos para fornecer informações visuais ou auditivas sobre processos fisiológicos, permitindo ao paciente aprender a controlar voluntariamente essas funções.",
    category: "neurologia",
    examples: [
      "Biofeedback eletromiográfico para reeducação muscular",
      "Biofeedback para controle da pressão arterial",
    ],
    references: ["Schwartz, M. S., & Andrasik, F. (2017). Biofeedback: A Practitioner's Guide."],
  },
  {
    id: "cinesioterapia",
    term: "Cinesioterapia",
    definition:
      "Tratamento através do movimento. Utiliza exercícios terapêuticos para restaurar a função, melhorar a mobilidade, aliviar a dor e prevenir ou reduzir deficiências físicas.",
    category: "geral",
    examples: ["Exercícios de fortalecimento", "Exercícios de alongamento", "Exercícios proprioceptivos"],
    references: ["Kisner, C., & Colby, L. A. (2016). Exercícios Terapêuticos: Fundamentos e Técnicas."],
  },
  {
    id: "cpap",
    term: "CPAP (Continuous Positive Airway Pressure)",
    definition:
      "Dispositivo que fornece pressão positiva contínua nas vias aéreas, mantendo-as abertas durante o ciclo respiratório. Utilizado principalmente no tratamento da apneia obstrutiva do sono e em algumas condições respiratórias.",
    category: "respiratoria",
    examples: ["CPAP para tratamento de apneia do sono", "CPAP em pacientes com insuficiência respiratória"],
    references: [
      "Pryor, J. A., & Prasad, S. A. (2008). Physiotherapy for Respiratory and Cardiac Problems: Adults and Paediatrics.",
    ],
  },
  {
    id: "dor-neuropatica",
    term: "Dor Neuropática",
    definition:
      "Dor causada por lesão ou disfunção do sistema nervoso, caracterizada por sensações de queimação, formigamento, choque elétrico ou dormência. Pode ser periférica ou central.",
    category: "neurologia",
    examples: ["Neuralgia pós-herpética", "Neuropatia diabética", "Dor do membro fantasma"],
    references: ["Butler, D. S., & Moseley, G. L. (2013). Explain Pain."],
  },
  {
    id: "eletroestimulacao",
    term: "Eletroestimulação",
    definition:
      "Aplicação de corrente elétrica para estimular nervos e músculos com finalidades terapêuticas. Inclui modalidades como TENS (analgesia), FES (fortalecimento muscular) e correntes interferenciais.",
    category: "geral",
    examples: [
      "TENS para controle da dor",
      "FES para reeducação muscular após AVC",
      "Corrente russa para fortalecimento",
    ],
    references: [
      "Robinson, A. J., & Snyder-Mackler, L. (2007). Clinical Electrophysiology: Electrotherapy and Electrophysiologic Testing.",
    ],
  },
  {
    id: "fascite-plantar",
    term: "Fascite Plantar",
    definition:
      "Inflamação da fáscia plantar, uma banda de tecido que conecta o calcanhar aos dedos do pé. Causa dor na região do calcanhar, especialmente nos primeiros passos da manhã ou após períodos de repouso.",
    category: "ortopedia",
    examples: ["Dor no calcanhar ao levantar-se pela manhã", "Desconforto após longos períodos em pé"],
    references: ["Dutton, M. (2016). Dutton's Orthopaedic Examination, Evaluation, and Intervention."],
  },
  {
    id: "gait-training",
    term: "Gait Training (Treino de Marcha)",
    definition:
      "Intervenção terapêutica focada em melhorar o padrão de marcha do paciente. Inclui exercícios específicos para melhorar equilíbrio, coordenação, força e resistência relacionados à deambulação.",
    category: "neurologia",
    examples: [
      "Treino de marcha em esteira",
      "Treino de marcha com suporte de peso",
      "Treino de marcha com obstáculos",
    ],
    references: ["Perry, J., & Burnfield, J. M. (2010). Gait Analysis: Normal and Pathological Function."],
  },
  {
    id: "hipermobilidade",
    term: "Hipermobilidade",
    definition:
      "Aumento da amplitude de movimento articular além dos limites considerados normais. Pode ser generalizada ou localizada, e estar associada a síndromes como a Síndrome de Ehlers-Danlos.",
    category: "ortopedia",
    examples: ["Teste de Beighton positivo", "Instabilidade articular recorrente"],
    references: [
      "Keer, R., & Grahame, R. (2003). Hypermobility Syndrome: Recognition and Management for Physiotherapists.",
    ],
  },
  {
    id: "isometrico",
    term: "Exercício Isométrico",
    definition:
      "Contração muscular que gera tensão sem alteração significativa no comprimento do músculo ou movimento articular. Útil para fortalecimento em casos onde o movimento é contraindicado ou doloroso.",
    category: "ortopedia",
    examples: ["Prancha abdominal", "Contração isométrica de quadríceps", "Exercício de parede para glúteo médio"],
    references: ["Kisner, C., & Colby, L. A. (2016). Exercícios Terapêuticos: Fundamentos e Técnicas."],
  },
  {
    id: "kabat",
    term: "Kabat (PNF - Facilitação Neuromuscular Proprioceptiva)",
    definition:
      "Método terapêutico que utiliza padrões de movimento em diagonal e espiral, combinados com técnicas específicas para facilitar ou inibir a atividade muscular, melhorar a coordenação e aumentar a amplitude de movimento.",
    category: "neurologia",
    examples: ["Padrão diagonal de membro superior", "Técnica de contração-relaxamento", "Técnica de inversão lenta"],
    references: ["Adler, S. S., Beckers, D., & Buck, M. (2014). PNF in Practice: An Illustrated Guide."],
  },
  {
    id: "lordose",
    term: "Lordose",
    definition:
      "Curvatura fisiológica da coluna vertebral com convexidade anterior, presente nas regiões cervical e lombar. Quando acentuada, pode ser considerada patológica (hiperlordose).",
    category: "ortopedia",
    examples: ["Lordose lombar aumentada na gestação", "Hiperlordose compensatória em casos de cifose torácica"],
    references: ["Magee, D. J. (2014). Orthopedic Physical Assessment."],
  },
  {
    id: "mckenzie",
    term: "Método McKenzie",
    definition:
      "Abordagem de avaliação e tratamento para dores na coluna vertebral, baseada na resposta do paciente a movimentos repetidos e posições sustentadas. Classifica as disfunções em síndromes mecânicas específicas.",
    category: "ortopedia",
    examples: [
      "Exercícios de extensão para síndrome de desarranjo posterior",
      "Exercícios de correção postural para síndrome postural",
    ],
    references: ["McKenzie, R., & May, S. (2003). The Lumbar Spine: Mechanical Diagnosis and Therapy."],
  },
  {
    id: "neuroplasticidade",
    term: "Neuroplasticidade",
    definition:
      "Capacidade do sistema nervoso de se reorganizar, formar novas conexões neurais e se adaptar em resposta a novas experiências, aprendizado ou após lesões. Base fisiológica para a reabilitação neurológica.",
    category: "neurologia",
    examples: ["Recuperação funcional após AVC", "Aprendizado motor em terapia de restrição e indução ao movimento"],
    references: ["Doidge, N. (2007). The Brain That Changes Itself."],
  },
  {
    id: "osteocinematica",
    term: "Osteocinematica",
    definition:
      "Estudo do movimento dos ossos no espaço. Descreve os movimentos articulares em termos de planos e eixos, como flexão/extensão, abdução/adução e rotação.",
    category: "geral",
    examples: ["Flexão do joelho", "Abdução do ombro", "Rotação do tronco"],
    references: ["Neumann, D. A. (2017). Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation."],
  },
  {
    id: "propriocepcao",
    term: "Propriocepção",
    definition:
      "Percepção inconsciente da posição e movimento do corpo no espaço, baseada em informações sensoriais dos músculos, tendões e articulações. Fundamental para o controle motor e equilíbrio.",
    category: "neurologia",
    examples: [
      "Exercícios em superfícies instáveis",
      "Treino de equilíbrio com olhos fechados",
      "Exercícios com bola suíça",
    ],
    references: [
      "Riemann, B. L., & Lephart, S. M. (2002). The Sensorimotor System, Part I: The Physiologic Basis of Functional Joint Stability.",
    ],
  },
  {
    id: "quiropraxia",
    term: "Quiropraxia",
    definition:
      "Sistema de tratamento baseado na manipulação da coluna vertebral e outras articulações para corrigir desalinhamentos que podem afetar nervos, músculos e órgãos. Foca na relação entre estrutura (principalmente a coluna) e função.",
    category: "geral",
    examples: [
      "Ajuste vertebral",
      "Manipulação sacroilíaca",
      "Técnica de impulso de alta velocidade e baixa amplitude",
    ],
    references: ["Haldeman, S. (2005). Principles and Practice of Chiropractic."],
  },
  {
    id: "reabilitacao-vestibular",
    term: "Reabilitação Vestibular",
    definition:
      "Abordagem terapêutica para distúrbios do equilíbrio e tontura de origem vestibular. Utiliza exercícios específicos para promover a compensação central, habituação e substituição sensorial.",
    category: "neurologia",
    examples: ["Exercícios de Cawthorne-Cooksey", "Manobra de Epley para VPPB", "Exercícios de estabilização do olhar"],
    references: ["Herdman, S. J., & Clendaniel, R. A. (2014). Vestibular Rehabilitation."],
  },
  {
    id: "sindrome-piriforme",
    term: "Síndrome do Piriforme",
    definition:
      "Condição dolorosa causada pela compressão ou irritação do nervo ciático pelo músculo piriforme. Caracteriza-se por dor na região glútea que pode irradiar para a perna, agravada ao sentar ou durante atividades específicas.",
    category: "ortopedia",
    examples: ["Dor glútea ao sentar por períodos prolongados", "Dor ciática sem patologia discal"],
    references: ["Dutton, M. (2016). Dutton's Orthopaedic Examination, Evaluation, and Intervention."],
  },
  {
    id: "tens",
    term: "TENS (Estimulação Elétrica Nervosa Transcutânea)",
    definition:
      "Modalidade de eletroterapia que utiliza corrente elétrica de baixa intensidade para estimular nervos periféricos através da pele, com o objetivo principal de aliviar a dor. Baseia-se na teoria da comporta da dor e na liberação de endorfinas.",
    category: "geral",
    examples: [
      "TENS convencional para dor aguda",
      "TENS acupuntura para dor crônica",
      "TENS burst para dor neuropática",
    ],
    references: [
      "Robinson, A. J., & Snyder-Mackler, L. (2007). Clinical Electrophysiology: Electrotherapy and Electrophysiologic Testing.",
    ],
  },
  {
    id: "ultrassom-terapeutico",
    term: "Ultrassom Terapêutico",
    definition:
      "Modalidade de terapia física que utiliza ondas sonoras de alta frequência para produzir efeitos térmicos e não térmicos nos tecidos. Usado para acelerar a cicatrização, reduzir a dor e a inflamação, e aumentar a extensibilidade do colágeno.",
    category: "geral",
    examples: [
      "Ultrassom pulsado para lesões agudas",
      "Ultrassom contínuo para aumentar extensibilidade tecidual",
      "Fonoforese para administração transdérmica de medicamentos",
    ],
    references: ["Watson, T. (2008). Ultrasound in Contemporary Physiotherapy Practice."],
  },
  {
    id: "ventilacao-mecanica",
    term: "Ventilação Mecânica",
    definition:
      "Método de suporte ventilatório que utiliza equipamentos para auxiliar ou substituir a respiração espontânea. Pode ser invasiva (via tubo endotraqueal ou traqueostomia) ou não invasiva (via máscara).",
    category: "respiratoria",
    examples: ["Ventilação mecânica em pacientes com SDRA", "VNI em exacerbação de DPOC", "Desmame ventilatório"],
    references: [
      "Pryor, J. A., & Prasad, S. A. (2008). Physiotherapy for Respiratory and Cardiac Problems: Adults and Paediatrics.",
    ],
  },
  {
    id: "whiplash",
    term: "Whiplash (Chicotada Cervical)",
    definition:
      "Lesão por aceleração-desaceleração que afeta o pescoço, geralmente resultante de acidentes automobilísticos. Caracteriza-se por dor cervical, cefaleia, tontura e outros sintomas que podem persistir como síndrome crônica.",
    category: "ortopedia",
    examples: ["Lesão cervical em acidente de carro", "Dor e rigidez cervical após impacto"],
    references: [
      "Jull, G., Sterling, M., Falla, D., Treleaven, J., & O'Leary, S. (2008). Whiplash, Headache, and Neck Pain: Research-Based Directions for Physical Therapies.",
    ],
  },
  {
    id: "xifose",
    term: "Xifose (Cifose)",
    definition:
      "Curvatura fisiológica da coluna torácica com convexidade posterior. Quando acentuada (hipercifose), pode ser considerada patológica, como na cifose postural ou na doença de Scheuermann.",
    category: "ortopedia",
    examples: ["Cifose postural em adolescentes", "Hipercifose senil", "Cifose estrutural na doença de Scheuermann"],
    references: ["Magee, D. J. (2014). Orthopedic Physical Assessment."],
  },
  {
    id: "yoga-terapeutico",
    term: "Yoga Terapêutico",
    definition:
      "Aplicação adaptada de técnicas de yoga (posturas, respiração, meditação) com objetivos terapêuticos específicos. Utilizado como complemento no tratamento de diversas condições físicas e psicológicas.",
    category: "geral",
    examples: [
      "Yoga para lombalgia crônica",
      "Práticas respiratórias para ansiedade",
      "Posturas adaptadas para artrite",
    ],
    references: ["Garfinkel, M. S., & Schumacher, H. R. (2000). Yoga. Rheumatic Disease Clinics of North America."],
  },
  {
    id: "zumbido",
    term: "Zumbido (Tinnitus)",
    definition:
      "Percepção de som na ausência de estímulo acústico externo. Pode estar associado a distúrbios do sistema auditivo, vestibular ou cervical, e ser abordado na fisioterapia quando relacionado a disfunções temporomandibulares ou cervicais.",
    category: "neurologia",
    examples: ["Zumbido associado à DTM", "Zumbido somatossensorial relacionado a disfunções cervicais"],
    references: [
      "Levine, R. A. (1999). Somatic (craniocervical) tinnitus and the dorsal cochlear nucleus hypothesis. American Journal of Otolaryngology.",
    ],
  },
]

// Inicializa o glossário com termos padrão se estiver vazio
export const initializeGlossary = async () => {
  if (!glossaryStore) return

  try {
    // Verifica se o glossário já foi inicializado
    const isInitialized = await glossaryStore.getItem("isInitialized")

    if (!isInitialized) {
      // Adiciona os termos iniciais
      for (const term of initialGlossaryTerms) {
        await glossaryStore.setItem(term.id, term)
      }

      // Marca como inicializado
      await glossaryStore.setItem("isInitialized", true)
    }
  } catch (error) {
    console.error("Erro ao inicializar glossário:", error)
  }
}

// Obtém todos os termos do glossário
export const getGlossaryTerms = async (): Promise<GlossaryTerm[]> => {
  if (!glossaryStore) return []

  try {
    // Inicializa o glossário se necessário
    await initializeGlossary()

    const terms: GlossaryTerm[] = []

    await glossaryStore.iterate((value: any, key: string) => {
      if (key !== "isInitialized" && value) {
        terms.push(value as GlossaryTerm)
      }
    })

    // Ordena os termos alfabeticamente
    return terms.sort((a, b) => a.term.localeCompare(b.term))
  } catch (error) {
    console.error("Erro ao obter termos do glossário:", error)
    return []
  }
}

// Obtém um termo específico do glossário
export const getGlossaryTerm = async (id: string): Promise<GlossaryTerm | null> => {
  if (!glossaryStore) return null

  try {
    const term = await glossaryStore.getItem<GlossaryTerm>(id)
    return term || null
  } catch (error) {
    console.error("Erro ao obter termo do glossário:", error)
    return null
  }
}

// Adiciona um novo termo ao glossário
export const addGlossaryTerm = async (termData: Omit<GlossaryTerm, "id">): Promise<string> => {
  if (!glossaryStore) throw new Error("Armazenamento não disponível")

  try {
    const id = generateId()
    const term: GlossaryTerm = { id, ...termData }

    await glossaryStore.setItem(id, term)
    return id
  } catch (error) {
    console.error("Erro ao adicionar termo ao glossário:", error)
    throw error
  }
}

// Atualiza um termo existente no glossário
export const updateGlossaryTerm = async (id: string, termData: Partial<GlossaryTerm>): Promise<boolean> => {
  if (!glossaryStore) return false

  try {
    const existingTerm = await glossaryStore.getItem<GlossaryTerm>(id)

    if (!existingTerm) {
      return false
    }

    const updatedTerm = { ...existingTerm, ...termData }
    await glossaryStore.setItem(id, updatedTerm)

    return true
  } catch (error) {
    console.error("Erro ao atualizar termo do glossário:", error)
    return false
  }
}

// Remove um termo do glossário
export const deleteGlossaryTerm = async (id: string): Promise<boolean> => {
  if (!glossaryStore) return false

  try {
    await glossaryStore.removeItem(id)
    return true
  } catch (error) {
    console.error("Erro ao remover termo do glossário:", error)
    return false
  }
}

// Adiciona ou remove um termo dos favoritos
export const toggleFavoriteTerm = async (termId: string, isFavorite: boolean): Promise<boolean> => {
  if (!favoritesStore) return false

  try {
    // Obtém a lista atual de favoritos
    const favorites = await getFavoriteTerms()

    if (isFavorite && !favorites.includes(termId)) {
      // Adiciona aos favoritos
      favorites.push(termId)
    } else if (!isFavorite && favorites.includes(termId)) {
      // Remove dos favoritos
      const index = favorites.indexOf(termId)
      favorites.splice(index, 1)
    }

    // Salva a lista atualizada
    await favoritesStore.setItem("glossaryFavorites", favorites)

    return true
  } catch (error) {
    console.error("Erro ao atualizar favoritos:", error)
    return false
  }
}

// Obtém a lista de termos favoritos
export const getFavoriteTerms = async (): Promise<string[]> => {
  if (!favoritesStore) return []

  try {
    const favorites = await favoritesStore.getItem<string[]>("glossaryFavorites")
    return favorites || []
  } catch (error) {
    console.error("Erro ao obter favoritos:", error)
    return []
  }
}

// Busca termos no glossário
export const searchGlossaryTerms = async (query: string): Promise<GlossaryTerm[]> => {
  if (!query.trim()) return []

  try {
    const allTerms = await getGlossaryTerms()
    const normalizedQuery = query.toLowerCase().trim()

    return allTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(normalizedQuery) || term.definition.toLowerCase().includes(normalizedQuery),
    )
  } catch (error) {
    console.error("Erro ao buscar termos:", error)
    return []
  }
}
