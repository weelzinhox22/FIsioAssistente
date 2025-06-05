import localforage from "localforage"
import type { UsefulLink } from "./types"
import { generateId } from "./utils"

// Inicializar o store para links
const linksStore = localforage.createInstance({
  name: "fisiobase",
  storeName: "links",
})

// Dados iniciais de links úteis
const initialLinks: Omit<UsefulLink, "id">[] = [
  {
    title: "PEDro - Physiotherapy Evidence Database",
    url: "https://pedro.org.au/",
    description:
      "Base de dados de evidências em fisioterapia, com mais de 50.000 ensaios clínicos randomizados, revisões sistemáticas e diretrizes de prática clínica.",
    category: "article",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "COFFITO - Conselho Federal de Fisioterapia e Terapia Ocupacional",
    url: "https://www.coffito.gov.br/",
    description:
      "Site oficial do Conselho Federal de Fisioterapia e Terapia Ocupacional, com informações sobre legislação, resoluções e diretrizes profissionais.",
    category: "association",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Revista Brasileira de Fisioterapia",
    url: "https://www.rbf-bjpt.org.br/",
    description:
      "Revista científica brasileira dedicada à publicação de pesquisas originais na área de fisioterapia e ciências da reabilitação.",
    category: "journal",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "PhysioTutors",
    url: "https://www.youtube.com/c/PhysioTutors",
    description:
      "Canal do YouTube com vídeos educativos sobre avaliação, diagnóstico e tratamento em fisioterapia, com foco em técnicas práticas e baseadas em evidências.",
    category: "video",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Physiopedia",
    url: "https://www.physio-pedia.com/",
    description:
      "Enciclopédia online gratuita para fisioterapeutas, com informações sobre condições, técnicas de avaliação e tratamento, baseadas em evidências científicas.",
    category: "tool",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "APTA - American Physical Therapy Association",
    url: "https://www.apta.org/",
    description:
      "Site da Associação Americana de Fisioterapia, com recursos educacionais, diretrizes clínicas e informações sobre prática baseada em evidências.",
    category: "association",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Journal of Orthopaedic & Sports Physical Therapy (JOSPT)",
    url: "https://www.jospt.org/",
    description:
      "Revista científica internacional focada em fisioterapia ortopédica e esportiva, com artigos de alta qualidade e relevância clínica.",
    category: "journal",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Rehab My Patient",
    url: "https://www.rehabmypatient.com/",
    description:
      "Plataforma online com exercícios ilustrados e programas de reabilitação para diversas condições, útil para criar planos de tratamento personalizados.",
    category: "tool",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Curso de Anatomia Palpatória",
    url: "https://www.cursoanatomiapalpatoria.com.br/",
    description:
      "Curso online de anatomia palpatória para fisioterapeutas, com vídeos demonstrativos e material complementar para estudo.",
    category: "course",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
  {
    title: "Fisioterapia Baseada em Evidências",
    url: "https://www.fisioterapiabasadaemevidencias.com/",
    description:
      "Blog com artigos, revisões e atualizações sobre prática baseada em evidências em fisioterapia, com foco na aplicação clínica.",
    category: "article",
    dateAdded: new Date().toISOString(),
    isFavorite: false,
  },
]

// Inicializar o banco de dados com links padrão
export const initializeLinks = async () => {
  try {
    const existingLinks = await linksStore.getItem<UsefulLink[]>("links")

    if (!existingLinks || existingLinks.length === 0) {
      const links = initialLinks.map((link) => ({
        ...link,
        id: generateId(),
      }))

      await linksStore.setItem("links", links)
      return links
    }

    return existingLinks
  } catch (error) {
    console.error("Erro ao inicializar links:", error)
    return []
  }
}

// Obter todos os links
export const getAllLinks = async (): Promise<UsefulLink[]> => {
  try {
    const links = await linksStore.getItem<UsefulLink[]>("links")
    return links || (await initializeLinks())
  } catch (error) {
    console.error("Erro ao obter links:", error)
    return []
  }
}

// Adicionar um novo link
export const addLink = async (link: Omit<UsefulLink, "id">): Promise<UsefulLink> => {
  try {
    const links = await getAllLinks()
    const newLink: UsefulLink = {
      ...link,
      id: generateId(),
    }

    await linksStore.setItem("links", [...links, newLink])
    return newLink
  } catch (error) {
    console.error("Erro ao adicionar link:", error)
    throw error
  }
}

// Atualizar um link existente
export const updateLink = async (updatedLink: UsefulLink): Promise<UsefulLink> => {
  try {
    const links = await getAllLinks()
    const updatedLinks = links.map((link) => (link.id === updatedLink.id ? updatedLink : link))

    await linksStore.setItem("links", updatedLinks)
    return updatedLink
  } catch (error) {
    console.error("Erro ao atualizar link:", error)
    throw error
  }
}

// Excluir um link
export const deleteLink = async (id: string): Promise<void> => {
  try {
    const links = await getAllLinks()
    const filteredLinks = links.filter((link) => link.id !== id)

    await linksStore.setItem("links", filteredLinks)
  } catch (error) {
    console.error("Erro ao excluir link:", error)
    throw error
  }
}

// Alternar favorito
export const toggleFavorite = async (link: UsefulLink): Promise<UsefulLink> => {
  return updateLink(link)
}

// Verificar status do link
export const checkLinkStatus = async (url: string): Promise<"active" | "inactive"> => {
  try {
    // No ambiente do navegador, não podemos fazer requisições diretas para verificar links
    // devido a restrições de CORS. Em uma aplicação real, isso seria feito através de um
    // servidor ou uma API proxy. Para fins de demonstração, vamos simular o status.

    // Simulação: links que começam com https são considerados ativos
    if (url.startsWith("https://")) {
      return "active"
    } else {
      return "inactive"
    }

    // Em uma implementação real, seria algo como:
    // const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
    // return response.ok ? 'active' : 'inactive'
  } catch (error) {
    console.error("Erro ao verificar status do link:", error)
    return "inactive"
  }
}
