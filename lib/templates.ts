import localforage from "localforage"
import type { MedicalRecordTemplate } from "./types"
import type { Patient } from "./types"
import { v4 as uuidv4 } from "uuid"
import { templatesStore } from "./db"

const patientsStore = localforage.createInstance({
  name: "fisiobase",
  storeName: "patients",
})

// Função para inicializar os modelos de prontuário
export const initializeTemplates = async (): Promise<void> => {
  try {
    // Verificar se já existem modelos
    const count = await getTemplatesCount()

    if (count === 0) {
      // Se não existirem modelos, adicionar os modelos padrão
      for (const template of defaultTemplates) {
        await addTemplate(template)
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar modelos de prontuário:", error)
  }
}

// Função para obter a contagem de modelos
export const getTemplatesCount = async (): Promise<number> => {
  try {
    let count = 0
    await templatesStore.iterate(() => {
      count++
    })
    return count
  } catch (error) {
    console.error("Erro ao contar modelos:", error)
    return 0
  }
}

// Modelos padrão
const defaultTemplates: Omit<MedicalRecordTemplate, "id">[] = [
  // Ortopedia - Lombalgia
  {
    title: "Avaliação de Lombalgia",
    specialty: "Ortopedia",
    condition: "Lombalgia",
    anamnesis: `# Anamnese para Lombalgia

## Queixa Principal
- Dor lombar (localização, irradiação, intensidade, duração)
- Início dos sintomas (súbito ou gradual)
- Fatores desencadeantes

## História da Doença Atual
- Características da dor (mecânica, inflamatória, neuropática)
- Fatores de alívio e agravamento
- Sintomas associados (parestesia, fraqueza muscular, alterações de sensibilidade)
- Impacto nas atividades diárias e laborais

## Antecedentes Pessoais
- Episódios anteriores de lombalgia
- Traumas prévios na coluna
- Cirurgias na coluna
- Doenças sistêmicas (diabetes, hipertensão, artrite)

## Hábitos de Vida
- Atividade física (tipo, frequência, intensidade)
- Postura no trabalho e atividades diárias
- Tabagismo
- Qualidade do sono

## Medicamentos em Uso
- Analgésicos
- Anti-inflamatórios
- Relaxantes musculares
- Outros medicamentos`,
    physicalExam: `# Exame Físico para Lombalgia

## Inspeção
- Postura (anteriorização da cabeça, hiperlordose, escoliose)
- Marcha
- Atrofias musculares

## Palpação
- Pontos dolorosos
- Contraturas musculares
- Processos espinhosos
- Articulações sacroilíacas

## Mobilidade
- Flexão, extensão, rotação e inclinação lateral da coluna lombar
- Teste de Schober
- Teste dedo-solo

## Testes Especiais
- Lasègue
- Teste de compressão da EIAS
- Teste de Patrick (FABERE)
- Teste de Gaenslen
- Teste de Valsalva

## Avaliação Neurológica
- Reflexos patelar e aquileu
- Força muscular (L2-S1)
- Sensibilidade (L1-S2)
- Sinal de Babinski`,
    diagnosis: `# Diagnóstico Fisioterapêutico para Lombalgia

## Diagnóstico Cinético-Funcional
- Disfunção articular segmentar lombar
- Desequilíbrio muscular (encurtamento/fraqueza)
- Alteração postural
- Comprometimento neurológico (se presente)
- Limitação funcional nas AVDs

## Classificação da Lombalgia
- Aguda (< 6 semanas)
- Subaguda (6-12 semanas)
- Crônica (> 12 semanas)

## Fatores Contribuintes
- Mecânicos
- Posturais
- Degenerativos
- Inflamatórios
- Psicossociais`,
    treatmentPlan: `# Plano de Tratamento para Lombalgia

## Fase Aguda
- Controle da dor e inflamação
  - Eletroterapia (TENS, corrente interferencial)
  - Crioterapia
  - Terapia manual (mobilização grau I e II)
  - Orientações posturais

## Fase Subaguda
- Ganho de mobilidade
  - Mobilização articular
  - Alongamentos
  - Liberação miofascial
  - Exercícios de controle motor

## Fase de Reabilitação
- Fortalecimento muscular
  - Core training
  - Estabilização segmentar
  - Fortalecimento global
- Reeducação postural
- Treino proprioceptivo

## Prevenção de Recidivas
- Programa de exercícios domiciliares
- Ergonomia no trabalho e AVDs
- Modificação de fatores de risco
- Retorno gradual às atividades

## Frequência e Duração
- 2-3 sessões semanais
- Reavaliação a cada 10 sessões
- Duração estimada: 6-12 semanas`,
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isFavorite: false,
    tags: ["lombalgia", "coluna", "dor lombar", "ortopedia"],
  },
  // Ortopedia - Lombalgia
  // {
  //   title: "Avaliação de Lombalgia",
  //   specialty: "Ortopedia",
  //   condition: "Lombalgia",
  //   anamnesis: `# Anamnese para Lombalgia

  // ## Queixa Principal
  // - Dor lombar (localização, irradiação, intensidade, duração)
  // - Início dos sintomas (súbito ou gradual)
  // - Fatores desencadeantes

  // ## História da Doença Atual
  // - Características da dor (mecânica, inflamatória, neuropática)
  // - Fatores de alívio e agravamento
  // - Sintomas associados (parestesia, fraqueza muscular, alterações de sensibilidade)
  // - Impacto nas atividades diárias e laborais

  // ## Antecedentes Pessoais
  // - Episódios anteriores de lombalgia
  // - Traumas prévios na coluna
  // - Cirurgias na coluna
  // - Doenças sistêmicas (diabetes, hipertensão, artrite)

  // ## Hábitos de Vida
  // - Atividade física (tipo, frequência, intensidade)
  // - Postura no trabalho e atividades diárias
  // - Tabagismo
  // - Qualidade do sono

  // ## Medicamentos em Uso
  // - Analgésicos
  // - Anti-inflamatórios
  // - Relaxantes musculares
  // - Outros medicamentos`,
  //   physicalExam: `# Exame Físico para Lombalgia

  // ## Inspeção
  // - Postura (anteriorização da cabeça, hiperlordose, escoliose)
  // - Marcha
  // - Atrofias musculares

  // ## Palpação
  // - Pontos dolorosos
  // - Contraturas musculares
  // - Processos espinhosos
  // - Articulações sacroilíacas

  // ## Mobilidade
  // - Flexão, extensão, rotação e inclinação lateral da coluna lombar
  // - Teste de Schober
  // - Teste dedo-solo

  // ## Testes Especiais
  // - Lasègue
  // - Teste de compressão da EIAS
  // - Teste de Patrick (FABERE)
  // - Teste de Gaenslen
  // - Teste de Valsalva

  // ## Avaliação Neurológica
  // - Reflexos patelar e aquileu
  // - Força muscular (L2-S1)
  // - Sensibilidade (L1-S2)
  // - Sinal de Babinski`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Lombalgia

  // ## Diagnóstico Cinético-Funcional
  // - Disfunção articular segmentar lombar
  // - Desequilíbrio muscular (encurtamento/fraqueza)
  // - Alteração postural
  // - Comprometimento neurológico (se presente)
  // - Limitação funcional nas AVDs

  // ## Classificação da Lombalgia
  // - Aguda (< 6 semanas)
  // - Subaguda (6-12 semanas)
  // - Crônica (> 12 semanas)

  // ## Fatores Contribuintes
  // - Mecânicos
  // - Posturais
  // - Degenerativos
  // - Inflamatórios
  // - Psicossociais`,
  //   treatmentPlan: `# Plano de Tratamento para Lombalgia

  // ## Fase Aguda
  // - Controle da dor e inflamação
  //   - Eletroterapia (TENS, corrente interferencial)
  //   - Crioterapia
  //   - Terapia manual (mobilização grau I e II)
  //   - Orientações posturais

  // ## Fase Subaguda
  // - Ganho de mobilidade
  //   - Mobilização articular
  //   - Alongamentos
  //   - Liberação miofascial
  //   - Exercícios de controle motor

  // ## Fase de Reabilitação
  // - Fortalecimento muscular
  //   - Core training
  //   - Estabilização segmentar
  //   - Fortalecimento global
  // - Reeducação postural
  // - Treino proprioceptivo

  // ## Prevenção de Recidivas
  // - Programa de exercícios domiciliares
  // - Ergonomia no trabalho e AVDs
  // - Modificação de fatores de risco
  // - Retorno gradual às atividades

  // ## Frequência e Duração
  // - 2-3 sessões semanais
  // - Reavaliação a cada 10 sessões
  // - Duração estimada: 6-12 semanas`,
  //   dateCreated: new Date().toISOString(),
  //   dateModified: new Date().toISOString(),
  //   isFavorite: false,
  //   tags: ["lombalgia", "coluna", "dor lombar", "ortopedia"],
  // },

  // Neurologia - AVC
  // {
  //   title: "Avaliação de Paciente pós-AVC",
  //   specialty: "Neurologia",
  //   condition: "AVC",
  //   anamnesis: `# Anamnese para Paciente pós-AVC

  // ## Dados do AVC
  // - Data do evento
  // - Tipo de AVC (isquêmico ou hemorrágico)
  // - Território vascular acometido
  // - Tratamentos realizados na fase aguda
  // - Tempo de internação

  // ## Queixa Principal
  // - Déficits motores
  // - Alterações de sensibilidade
  // - Dificuldades na fala/linguagem
  // - Disfagia
  // - Alterações visuais

  // ## História Funcional
  // - Nível de independência antes do AVC
  // - Nível de independência atual
  // - Necessidade de dispositivos auxiliares
  // - Adaptações domiciliares realizadas

  // ## Antecedentes Pessoais
  // - Fatores de risco (HAS, diabetes, dislipidemia, tabagismo)
  // - Eventos cardiovasculares prévios
  // - Outras comorbidades

  // ## Medicamentos em Uso
  // - Anticoagulantes/antiplaquetários
  // - Anti-hipertensivos
  // - Estatinas
  // - Outros medicamentos

  // ## Suporte Familiar/Social
  // - Cuidador principal
  // - Rede de apoio
  // - Condições de moradia`,
  //   physicalExam: `# Exame Físico para Paciente pós-AVC

  // ## Estado de Consciência e Cognição
  // - Nível de consciência
  // - Orientação temporo-espacial
  // - Atenção e memória
  // - Mini Exame do Estado Mental (se aplicável)

  // ## Avaliação Motora
  // - Tônus muscular (Escala de Ashworth Modificada)
  // - Força muscular (Escala de Oxford)
  // - Coordenação motora
  // - Presença de sinergias patológicas
  // - Controle de tronco

  // ## Avaliação Sensorial
  // - Sensibilidade superficial (tátil, térmica, dolorosa)
  // - Sensibilidade profunda (propriocepção, vibratória)
  // - Estereognosia

  // ## Equilíbrio e Marcha
  // - Equilíbrio estático e dinâmico
  // - Escala de Berg
  // - Análise da marcha
  // - Timed Up and Go Test

  // ## Avaliação Funcional
  // - Medida de Independência Funcional (MIF)
  // - Índice de Barthel
  // - Escala de Rankin modificada

  // ## Avaliação da Comunicação
  // - Compreensão
  // - Expressão
  // - Presença de afasia/disartria

  // ## Avaliação da Deglutição
  // - Sinais de disfagia
  // - Teste de deglutição`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Paciente pós-AVC

  // ## Comprometimentos
  // - Alteração de tônus muscular (espasticidade/flacidez)
  // - Déficit de força muscular
  // - Alteração de sensibilidade
  // - Déficit de equilíbrio
  // - Alteração da marcha
  // - Déficit de coordenação motora

  // ## Limitações Funcionais
  // - Transferências
  // - Mobilidade no leito
  // - Marcha
  // - AVDs básicas
  // - AVDs instrumentais

  // ## Restrições de Participação
  // - Atividades sociais
  // - Atividades laborais
  // - Atividades de lazer

  // ## Potenciais Complicações
  // - Síndrome do ombro doloroso
  // - Subluxação glenoumeral
  // - Edema em extremidade parética
  // - Quedas`,
  //   treatmentPlan: `# Plano de Tratamento para Paciente pós-AVC

  // ## Fase Aguda/Subaguda
  // - Posicionamento adequado no leito
  // - Mobilização precoce
  // - Estimulação sensorial
  // - Treino de controle de tronco
  // - Prevenção de complicações secundárias

  // ## Fase de Reabilitação
  // - Normalização do tônus muscular
  //   - Técnicas de inibição/facilitação
  //   - Alongamentos
  // - Fortalecimento muscular seletivo
  // - Treino de transferências
  // - Treino de equilíbrio estático e dinâmico
  // - Treino de marcha
  //   - Progressão: barras paralelas → andador → bengala → independente
  // - Treino de AVDs
  // - Estimulação sensorial

  // ## Abordagens Específicas
  // - Conceito Neuroevolutivo Bobath
  // - Facilitação Neuromuscular Proprioceptiva (PNF)
  // - Terapia de Restrição e Indução ao Movimento
  // - Treino orientado à tarefa
  // - Biofeedback
  // - Estimulação elétrica funcional

  // ## Orientações
  // - Adaptações domiciliares
  // - Treinamento do cuidador
  // - Programa de exercícios domiciliares
  // - Prevenção de quedas

  // ## Frequência e Duração
  // - 3-5 sessões semanais
  // - Reavaliação mensal
  // - Duração: conforme evolução do paciente`,
  //   dateCreated: new Date().toISOString(),
  //   dateModified: new Date().toISOString(),
  //   isFavorite: false,
  //   tags: ["avc", "neurologia", "hemiparesia", "reabilitação neurológica"],
  // },

  // Respiratória - DPOC
  // {
  //   title: "Avaliação de Paciente com DPOC",
  //   specialty: "Respiratória",
  //   condition: "DPOC",
  //   anamnesis: `# Anamnese para Paciente com DPOC

  // ## Queixa Principal
  // - Dispneia (escala mMRC)
  // - Tosse (características, frequência)
  // - Expectoração (quantidade, aspecto, frequência)
  // - Limitação nas atividades diárias

  // ## História da Doença
  // - Tempo de diagnóstico
  // - Classificação GOLD
  // - Número de exacerbações no último ano
  // - Internações prévias
  // - Necessidade de oxigenoterapia

  // ## Fatores de Risco
  // - Tabagismo (anos/maço)
  // - Exposição ocupacional
  // - Poluição ambiental
  // - Infecções respiratórias recorrentes

  // ## Sintomas Associados
  // - Fadiga
  // - Perda de peso
  // - Alterações do sono
  // - Ansiedade/depressão

  // ## Medicamentos em Uso
  // - Broncodilatadores
  // - Corticosteroides
  // - Antibióticos
  // - Oxigenoterapia domiciliar (fluxo, horas/dia)

  // ## Impacto na Qualidade de Vida
  // - Limitações nas AVDs
  // - Impacto social
  // - Questionário CAT (COPD Assessment Test)`,
  //   physicalExam: `# Exame Físico para Paciente com DPOC

  // ## Sinais Vitais
  // - Frequência respiratória
  // - Frequência cardíaca
  // - Pressão arterial
  // - Saturação de O₂ (repouso e esforço)

  // ## Inspeção
  // - Padrão respiratório
  // - Uso de musculatura acessória
  // - Tiragem intercostal
  // - Tórax em barril
  // - Cianose
  // - Estado nutricional

  // ## Palpação
  // - Expansibilidade torácica
  // - Frêmito tóraco-vocal
  // - Elasticidade torácica

  // ## Percussão
  // - Som timpânico (hiperinsuflação)

  // ## Ausculta Pulmonar
  // - Murmúrio vesicular
  // - Ruídos adventícios (sibilos, roncos, crepitações)
  // - Tempo expiratório prolongado

  // ## Avaliação Funcional
  // - Teste de caminhada de 6 minutos
  // - Teste de sentar e levantar de 1 minuto
  // - Escala de Borg modificada (dispneia e fadiga)
  // - Teste de função pulmonar (se disponível)`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Paciente com DPOC

  // ## Comprometimentos
  // - Obstrução do fluxo aéreo
  // - Hiperinsuflação pulmonar
  // - Disfunção da musculatura respiratória
  // - Diminuição da capacidade de exercício
  // - Alteração do padrão respiratório
  // - Retenção de secreções (se presente)

  // ## Limitações Funcionais
  // - Intolerância aos esforços
  // - Limitação nas AVDs
  // - Dependência de oxigênio (se aplicável)

  // ## Classificação Funcional
  // - Escala mMRC (0-4)
  // - Classificação GOLD (A, B, C, D)`,
  //   treatmentPlan: `# Plano de Tratamento para Paciente com DPOC

  // ## Fase Estável
  // - Reeducação do padrão respiratório
  //   - Respiração diafragmática
  //   - Respiração com lábios semicerrados
  //   - Ventilação em tempos
  // - Fortalecimento da musculatura respiratória
  //   - Treinamento muscular inspiratório
  //   - Exercícios respiratórios específicos
  // - Técnicas de higiene brônquica (se necessário)
  //   - ELTGOL
  //   - Drenagem autógena
  //   - Ciclo ativo da respiração
  // - Condicionamento físico
  //   - Treinamento aeróbico (caminhada, bicicleta)
  //   - Treinamento de força para MMSS e MMII
  //   - Treinamento de flexibilidade

  // ## Fase de Exacerbação
  // - Técnicas de remoção de secreções
  // - Posicionamento para otimizar a relação V/Q
  // - Suporte ventilatório não-invasivo (se indicado)
  // - Exercícios de baixa intensidade

  // ## Educação do Paciente
  // - Autogerenciamento da doença
  // - Reconhecimento precoce de exacerbações
  // - Técnicas de conservação de energia
  // - Uso correto de inaladores
  // - Cessação do tabagismo

  // ## Frequência e Duração
  // - 2-3 sessões semanais na fase estável
  // - Sessões diárias durante exacerbações
  // - Programa de reabilitação pulmonar: 8-12 semanas
  // - Manutenção com exercícios domiciliares`,
  //   dateCreated: new Date().toISOString(),
  //   dateModified: new Date().toISOString(),
  //   isFavorite: false,
  //   tags: ["dpoc", "respiratória", "pneumologia", "reabilitação pulmonar"],
  // },

  // Ortopedia - Tendinopatia do Manguito Rotador
  // {
  //   title: "Avaliação de Tendinopatia do Manguito Rotador",
  //   specialty: "Ortopedia",
  //   condition: "Tendinopatia do Manguito Rotador",
  //   anamnesis: `# Anamnese para Tendinopatia do Manguito Rotador

  // ## Queixa Principal
  // - Dor no ombro (localização, intensidade, duração)
  // - Limitação de movimento
  // - Dor noturna
  // - Dificuldade em atividades acima da cabeça

  // ## História da Doença Atual
  // - Início dos sintomas (súbito ou gradual)
  // - Mecanismo de lesão (trauma, sobrecarga)
  // - Evolução dos sintomas
  // - Tratamentos prévios realizados

  // ## Atividades Relacionadas
  // - Atividades laborais (movimentos repetitivos, sobrecarga)
  // - Atividades esportivas (natação, tênis, arremessos)
  // - Atividades domésticas que agravam os sintomas

  // ## Antecedentes Pessoais
  // - Lesões prévias no ombro
  // - Cirurgias no ombro
  // - Doenças sistêmicas (diabetes, hipotireoidismo)

  // ## Exames Complementares
  // - Resultados de ultrassonografia
  // - Resultados de ressonância magnética
  // - Radiografias

  // ## Medicamentos em Uso
  // - Anti-inflamatórios
  // - Analgésicos
  // - Relaxantes musculares`,
  //   physicalExam: `# Exame Físico para Tendinopatia do Manguito Rotador

  // ## Inspeção
  // - Postura dos ombros e escápulas
  // - Atrofias musculares
  // - Sinais inflamatórios

  // ## Palpação
  // - Pontos dolorosos
  // - Temperatura local
  // - Crepitações
  // - Sulco bicipital

  // ## Amplitude de Movimento (ADM)
  // - Flexão, extensão, abdução, adução
  // - Rotação interna e externa
  // - Movimentos escapulares
  // - Comparação bilateral
  // - ADM ativa vs. passiva

  // ## Testes Especiais
  // - Teste de Neer
  // - Teste de Hawkins-Kennedy
  // - Teste de Jobe (Empty Can)
  // - Teste de Gerber (Lift-off)
  // - Teste de Speed
  // - Teste de Yergason
  // - Arco doloroso

  // ## Avaliação da Força Muscular
  // - Manguito rotador (supraespinhoso, infraespinhoso, redondo menor, subescapular)
  // - Deltoide
  // - Estabilizadores da escápula
  // - Bíceps braquial

  // ## Avaliação Funcional
  // - DASH ou SPADI
  // - Escala funcional do ombro de Constant-Murley`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Tendinopatia do Manguito Rotador

  // ## Comprometimentos
  // - Tendinopatia específica (supraespinhoso, infraespinhoso, subescapular)
  // - Bursite subacromial associada
  // - Discinesia escapular
  // - Déficit de força muscular
  // - Limitação de ADM
  // - Dor em atividades específicas

  // ## Estágio da Tendinopatia
  // - Reativa
  // - Degeneração tendinosa
  // - Tendinopatia crônica

  // ## Fatores Contribuintes
  // - Alterações posturais
  // - Desequilíbrios musculares
  // - Sobrecarga mecânica
  // - Impacto subacromial
  // - Instabilidade glenoumeral

  // ## Limitações Funcionais
  // - Atividades acima da cabeça
  // - Atividades de vida diária específicas
  // - Atividades esportivas/laborais`,
  //   treatmentPlan: `# Plano de Tratamento para Tendinopatia do Manguito Rotador

  // ## Fase Aguda
  // - Controle da dor e inflamação
  //   - Crioterapia
  //   - Eletroterapia (TENS, ultrassom)
  //   - Terapia manual (mobilização grau I e II)
  //   - Orientações para modificação de atividades

  // ## Fase Intermediária
  // - Ganho de amplitude de movimento
  //   - Mobilização articular
  //   - Alongamentos
  //   - Exercícios pendulares de Codman
  //   - Deslizamento na parede
  // - Correção da discinesia escapular
  //   - Exercícios de controle motor
  //   - Estabilização escapular

  // ## Fase de Fortalecimento
  // - Fortalecimento isométrico inicial
  // - Progressão para exercícios isotônicos
  // - Fortalecimento excêntrico do manguito rotador
  // - Fortalecimento dos estabilizadores da escápula
  // - Exercícios em cadeia cinética fechada

  // ## Fase de Retorno Funcional
  // - Exercícios específicos para atividade laboral/esportiva
  // - Treinamento proprioceptivo
  // - Exercícios pliométricos (se aplicável)
  // - Retorno gradual às atividades

  // ## Orientações
  // - Ergonomia no trabalho
  // - Programa de exercícios domiciliares
  // - Modificações nas atividades esportivas
  // - Prevenção de recidivas

  // ## Frequência e Duração
  // - 2-3 sessões semanais
  // - Reavaliação a cada 10 sessões
  // - Duração estimada: 8-12 semanas`,
  //   dateCreated: new Date().toISOString(),
  //   dateModified: new Date().toISOString(),
  //   isFavorite: false,
  //   tags: ["ombro", "manguito rotador", "tendinopatia", "ortopedia"],
  // },

  // Neurologia - Doença de Parkinson
  // {
  //   title: "Avaliação de Paciente com Doença de Parkinson",
  //   specialty: "Neurologia",
  //   condition: "Doença de Parkinson",
  //   anamnesis: `# Anamnese para Doença de Parkinson

  // ## Dados da Doença
  // - Tempo de diagnóstico
  // - Sintomas iniciais
  // - Progressão dos sintomas
  // - Estágio atual (Escala de Hoehn e Yahr)
  // - Flutuações motoras (on/off)

  // ## Queixa Principal
  // - Rigidez
  // - Bradicinesia
  // - Tremor
  // - Instabilidade postural
  // - Dificuldades na marcha
  // - Freezing

  // ## Sintomas Não-Motores
  // - Distúrbios do sono
  // - Alterações cognitivas
  // - Depressão/ansiedade
  // - Disfunção autonômica
  // - Alterações sensoriais

  // ## Medicamentos
  // - Levodopa (dosagem, frequência)
  // - Agonistas dopaminérgicos
  // - Inibidores da MAO-B/COMT
  // - Horário da última dose
  // - Estado motor durante a avaliação (on/off)

  // ## História Funcional
  // - Nível de independência nas AVDs
  // - Histórico de quedas
  // - Uso de dispositivos auxiliares
  // - Adaptações domiciliares

  // ## Suporte Familiar/Social
  // - Cuidador principal
  // - Rede de apoio
  // - Condições de moradia`,
  //   physicalExam: `# Exame Físico para Doença de Parkinson

  // ## Avaliação Motora
  // - UPDRS parte III (Unified Parkinson's Disease Rating Scale)
  // - Rigidez (roda denteada)
  // - Bradicinesia
  // - Tremor de repouso
  // - Reflexos posturais

  // ## Postura e Equilíbrio
  // - Postura em flexão
  // - Teste de Romberg
  // - Pull test
  // - Escala de Berg
  // - Mini-BESTest

  // ## Avaliação da Marcha
  // - Características parkinsonianas (passos curtos, arrastados)
  // - Freezing of gait
  // - Festinação
  // - Timed Up and Go Test
  // - Teste de caminhada de 10 metros

  // ## Amplitude de Movimento
  // - Mobilidade de tronco
  // - Rotação cervical
  // - Flexibilidade de MMSS e MMII

  // ## Função Respiratória
  // - Padrão respiratório
  // - Expansibilidade torácica
  // - Pico de fluxo expiratório (se disponível)

  // ## Avaliação Funcional
  // - PDQ-39 (Parkinson's Disease Questionnaire)
  // - Escala de Schwab & England
  // - Avaliação das AVDs`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Doença de Parkinson

  // ## Comprometimentos
  // - Alteração do tônus muscular (rigidez)
  // - Bradicinesia
  // - Tremor
  // - Instabilidade postural
  // - Alteração da marcha
  // - Déficit de equilíbrio
  // - Alteração da mobilidade funcional

  // ## Classificação
  // - Estágio Hoehn e Yahr (1-5)
  // - Predomínio de sintomas (tremor-dominante, PIGD, misto)

  // ## Limitações Funcionais
  // - Transferências
  // - Mobilidade no leito
  // - Marcha
  // - AVDs básicas e instrumentais
  // - Comunicação

  // ## Potenciais Complicações
  // - Quedas
  // - Imobilidade
  // - Pneumonia aspirativa
  // - Contraturas
  // - Isolamento social`,
  //   treatmentPlan: `# Plano de Tratamento para Doença de Parkinson

  // ## Objetivos Gerais
  // - Manter/melhorar a mobilidade funcional
  // - Prevenir complicações secundárias
  // - Melhorar o equilíbrio e reduzir o risco de quedas
  // - Otimizar a independência nas AVDs
  // - Melhorar a qualidade de vida

  // ## Estratégias de Tratamento
  // - Treinamento de estratégias motoras
  //   - Dicas externas (visuais, auditivas, táteis)
  //   - Estratégias cognitivas
  //   - Treinamento de dupla tarefa
  // - Exercícios de amplitude de movimento
  //   - Alongamentos
  //   - Mobilização ativa e passiva
  // - Treinamento de equilíbrio
  //   - Exercícios estáticos e dinâmicos
  //   - Perturbações controladas
  //   - Treinamento sensorial
  // - Treinamento de marcha
  //   - Estratégias para superar o freezing
  //   - Treino com pistas rítmicas
  //   - Treino em diferentes superfícies e ambientes
  // - Fortalecimento muscular
  //   - Ênfase em extensores de tronco e quadril
  //   - Exercícios funcionais
  // - Treinamento respiratório
  //   - Exercícios de expansão torácica
  //   - Fortalecimento da musculatura respiratória

  // ## Abordagens Específicas
  // - LSVT BIG
  // - PD Warrior
  // - Tai Chi adaptado
  // - Dança terapêutica
  // - Hidroterapia

  // ## Orientações
  // - Programa de exercícios domiciliares
  // - Prevenção de quedas
  // - Adaptações ambientais
  // - Orientações ao cuidador
  // - Sincronização dos exercícios com a medicação (período "on")

  // ## Frequência e Duração
  // - 2-3 sessões semanais
  // - Programa de manutenção a longo prazo
  // - Reavaliação a cada 3 meses`,
  //   dateCreated: new Date().toISOString(),
  //   dateModified: new Date().toISOString(),
  //   isFavorite: false,
  //   tags: ["parkinson", "neurologia", "distúrbio do movimento"],
  // },

  // Pediatria - Paralisia Cerebral
  // {
  //   title: "Avaliação de Criança com Paralisia Cerebral",
  //   specialty: "Pediatria",
  //   condition: "Paralisia Cerebral",
  //   anamnesis: `# Anamnese para Criança com Paralisia Cerebral

  // ## Dados da Criança
  // - Idade
  // - Diagnóstico médico específico
  // - Classificação topográfica (diplegia, hemiplegia, quadriplegia)
  // - Classificação GMFCS (I-V)
  // - Classificação MACS (I-V)

  // ## História Pré, Peri e Pós-natal
  // - Intercorrências na gestação
  // - Idade gestacional
  // - Tipo de parto
  // - Peso ao nascer
  // - Apgar
  // - Complicações neonatais
  // - Internações em UTI neonatal

  // ## Desenvolvimento Neuropsicomotor
  // - Marcos motores alcançados e idade
  // - Desenvolvimento da comunicação
  // - Desenvolvimento cognitivo
  // - Escolaridade atual

  // ## Comorbidades
  // - Epilepsia
  // - Deficiência visual/auditiva
  // - Distúrbios de deglutição
  // - Refluxo gastroesofágico
  // - Alterações ortopédicas

  // ## Tratamentos Realizados
  // - Intervenções cirúrgicas
  // - Aplicação de toxina botulínica
  // - Uso de órteses
  // - Terapias prévias e atuais
  // - Medicamentos em uso

  // ## Rotina da Criança
  // - Escola (tipo, frequência, adaptações)
  // - Atividades de lazer
  // - Sono
  // - Alimentação

  // ## Contexto Familiar
  // - Cuidador principal
  // - Dinâmica familiar
  // - Condições socioeconômicas
  // - Acessibilidade no domicílio`,
  //   physicalExam: `# Exame Físico para Criança com Paralisia Cerebral

  // ## Avaliação Postural
  // - Alinhamento em supino, prono, sentado e em pé
  // - Assimetrias
  // - Deformidades fixas ou flexíveis

  // ## Tônus Muscular
  // - Escala de Ashworth Modificada
  // - Distribuição da espasticidade/hipotonia
  // - Presença de distonias ou ataxia

  // ## Amplitude de Movimento
  // - Goniometria de MMSS e MMII
  // - Identificação de contraturas
  // - Teste de Thomas, ângulo poplíteo, dorsiflexão

  // ## Força Muscular
  // - Avaliação funcional da força
  // - Desequilíbrios musculares

  // ## Reflexos e Reações
  // - Reflexos primitivos persistentes
  // - Reações de proteção e equilíbrio
  // - Reações de endireitamento

  // ## Avaliação Funcional
  // - GMFM (Gross Motor Function Measure)
  // - PEDI (Pediatric Evaluation of Disability Inventory)
  // - Análise das transferências
  // - Análise da marcha (se aplicável)
  // - Habilidades manuais

  // ## Avaliação Respiratória
  // - Padrão respiratório
  // - Eficácia da tosse
  // - Sinais de esforço respiratório

  // ## Avaliação da Comunicação
  // - Comunicação verbal/não-verbal
  // - Uso de comunicação alternativa`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Criança com Paralisia Cerebral

  // ## Classificação Funcional
  // - GMFCS nível ____ (I-V)
  // - MACS nível ____ (I-V)
  // - CFCS nível ____ (I-V) se aplicável

  // ## Comprometimentos
  // - Alteração do tônus muscular (espasticidade, distonia, hipotonia)
  // - Limitação da amplitude de movimento
  // - Alterações posturais
  // - Déficit de controle motor seletivo
  // - Alteração do equilíbrio e coordenação
  // - Fraqueza muscular
  // - Alterações ortopédicas secundárias

  // ## Limitações Funcionais
  // - Mobilidade (rolar, sentar, engatinhar, ficar em pé, andar)
  // - Transferências
  // - Autocuidado
  // - Comunicação
  // - Alimentação

  // ## Potenciais Complicações
  // - Deformidades musculoesqueléticas
  // - Luxação/subluxação do quadril
  // - Escoliose
  // - Complicações respiratórias
  // - Dor

  // ## Fatores Contextuais
  // - Facilitadores e barreiras ambientais
  // - Fatores pessoais (motivação, cognição)`,
  //   treatmentPlan: `# Plano de Tratamento para Criança com Paralisia Cerebral

  // ## Objetivos a Curto Prazo (1-3 meses)
  // - Objetivos específicos e mensuráveis baseados na avaliação
  // - Prioridades funcionais da família/criança

  // ## Objetivos a Longo Prazo (6-12 meses)
  // - Metas funcionais
  // - Prevenção de deformidades
  // - Participação social

  // ## Abordagens Terapêuticas
  // - Conceito Neuroevolutivo Bobath
  // - Educação Condutiva
  // - Integração Sensorial
  // - Terapia de Restrição e Indução ao Movimento (se aplicável)
  // - Treino orientado à tarefa
  // - Fortalecimento muscular
  // - Hidroterapia
  // - Equoterapia (se aplicável)

  // ## Intervenções Específicas
  // - Manejo do tônus muscular
  // - Alongamentos
  // - Mobilizações articulares
  // - Facilitação de padrões de movimento
  // - Treino de controle postural
  // - Treino de transferências
  // - Treino de marcha (se aplicável)
  // - Treino de habilidades manuais
  // - Adaptações posturais

  // ## Tecnologia Assistiva
  // - Órteses (AFOS, KAFOS, órteses de punho/mão)
  // - Dispositivos auxiliares de marcha
  // - Cadeira de rodas/adaptações
  // - Sistemas de posicionamento
  // - Recursos de comunicação alternativa

  // ## Orientações
  // - Programa de exercícios domiciliares
  // - Posicionamentos adequados
  // - Manuseios nas AVDs
  // - Adaptações no ambiente escolar
  // - Orientações para atividades de lazer

  // ## Frequência e Duração
  // - 2-3 sessões semanais
  // - Reavaliação a cada 3-6 meses
  // - Acompanhamento a longo prazo`,
  // },

  // Esportiva - Entorse de Tornozelo
  // {
  //   title: "Avaliação de Entorse de Tornozelo",
  //   specialty: "Esportiva",
  //   condition: "Entorse de Tornozelo",
  //   anamnesis: `# Anamnese para Entorse de Tornozelo

  // ## Queixa Principal
  // - Dor no tornozelo (localização, intensidade, duração)
  // - Edema
  // - Instabilidade
  // - Limitação funcional

  // ## Mecanismo de Lesão
  // - Data e circunstâncias da lesão
  // - Mecanismo específico (inversão, eversão, rotação)
  // - Audição de estalido no momento da lesão
  // - Capacidade de continuar a atividade após a lesão
  // - Evolução dos sintomas nas primeiras 24-48h

  // ## História Pregressa
  // - Entorses anteriores no mesmo tornozelo
  // - Tratamentos realizados
  // - Tempo de recuperação em lesões anteriores
  // - Sensação de instabilidade crônica

  // ## Atividade Física/Esportiva
  // - Tipo de atividade
  // - Frequência e intensidade
  // - Superfície de treino/jogo
  // - Tipo de calçado utilizado
  // - Uso de órteses/bandagens

  // ## Tratamento Inicial
  // - Medidas realizadas imediatamente após a lesão
  // - Uso de PRICE (Proteção, Repouso, Gelo, Compressão, Elevação)
  // - Medicamentos utilizados
  // - Exames de imagem realizados e resultados

  // ## Impacto Funcional
  // - Capacidade de apoio e marcha
  // - Atividades que provocam dor
  // - Limitações nas AVDs e atividades esportivas
  // - Expectativas quanto ao retorno à atividade esportiva`,
  //   physicalExam: `# Exame Físico para Entorse de Tornozelo

  // ## Inspeção
  // - Edema (localização e grau)
  // - Equimose
  // - Alinhamento do retropé
  // - Deformidades visíveis

  // ## Palpação
  // - Pontos dolorosos específicos
  // - Ligamentos laterais (LTFA, LCF, LTFP)
  // - Ligamentos mediais (deltoide)
  // - Sindesmose tibiofibular
  // - Tendões peroneiros
  // - Tendão de Aquiles
  // - Maléolos lateral e medial

  // ## Avaliação da Dor
  // - Escala Visual Analógica (EVA)
  // - Comportamento da dor (mecânica, inflamatória)

  // ## Amplitude de Movimento
  // - Dorsiflexão
  // - Flexão plantar
  // - Inversão
  // - Eversão
  // - Comparação com lado contralateral
  // - ADM ativa vs. passiva

  // ## Testes Especiais
  // - Gaveta anterior
  // - Inclinação talar
  // - Teste de compressão da sindesmose
  // - Teste de rotação externa
  // - Teste de Thompson

  // ## Avaliação Neurovascular
  // - Pulsos (tibial posterior e pedioso)
  // - Sensibilidade
  // - Tempo de enchimento capilar

  // ## Avaliação Funcional
  // - Apoio unipodal
  // - Marcha
  // - Agachamento unipodal
  // - Salto unipodal (se fase adequada)
  // - Escala FAOS (Foot and Ankle Outcome Score)`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Entorse de Tornozelo

  // ## Classificação da Lesão
  // - Grau I: Estiramento ligamentar
  // - Grau II: Ruptura parcial
  // - Grau III: Ruptura completa

  // ## Estruturas Acometidas
  // - Ligamento talofibular anterior
  // - Ligamento calcaneofibular
  // - Ligamento talofibular posterior
  // - Sindesmose tibiofibular
  // - Ligamento deltoide
  // - Lesões associadas (tendíneas, osteocondrais)

  // ## Fase da Lesão
  // - Aguda (0-3 dias)
  // - Subaguda (4-14 dias)
  // - Crônica (> 14 dias)

  // ## Comprometimentos
  // - Dor
  // - Edema
  // - Limitação de ADM
  // - Déficit de força muscular
  // - Instabilidade articular
  // - Alteração proprioceptiva
  // - Alteração da marcha

  // ## Limitações Funcionais
  // - Dificuldade no apoio
  // - Alteração da marcha
  // - Incapacidade para corrida/saltos
  // - Limitação nas atividades esportivas específicas`,
  //   treatmentPlan: `# Plano de Tratamento para Entorse de Tornozelo

  // ## Fase Aguda (0-3 dias)
  // - Proteção, Repouso relativo, Gelo, Compressão, Elevação (PRICE)
  // - Controle da dor e edema
  //   - Crioterapia
  //   - Eletroterapia (TENS)
  //   - Drenagem linfática manual
  // - Mobilização precoce controlada
  // - Orientações sobre uso de muletas (se necessário)

  // ## Fase Subaguda (4-14 dias)
  // - Controle do edema residual
  // - Ganho de amplitude de movimento
  //   - Mobilização articular
  //   - Exercícios ativos assistidos
  //   - Alongamentos suaves
  // - Fortalecimento isométrico inicial
  // - Treino de descarga de peso progressiva
  // - Propriocepção inicial
  //   - Exercícios em cadeia cinética fechada
  //   - Treino de equilíbrio estático

  // ## Fase de Reabilitação (2-6 semanas)
  // - Fortalecimento progressivo
  //   - Exercícios isotônicos
  //   - Fortalecimento dos eversores
  //   - Fortalecimento excêntrico
  // - Treino proprioceptivo avançado
  //   - Superfícies instáveis
  //   - Perturbações
  //   - Exercícios com olhos fechados
  // - Treino de marcha
  // - Exercícios funcionais específicos
  // - Condicionamento cardiovascular alternativo

  // ## Fase de Retorno ao Esporte (6-12 semanas)
  // - Treino pliométrico
  // - Exercícios de agilidade
  // - Treino de mudança de direção
  // - Progressão para corrida
  // - Exercícios específicos do esporte
  // - Prevenção de recidivas
  //   - Bandagem funcional/órteses
  //   - Programa de exercícios preventivos

  // ## Critérios para Progressão
  // - Ausência de dor durante atividades
  // - Edema controlado
  // - ADM completa ou funcional
  // - Força muscular adequada (≥ 90% do lado contralateral)
  // - Desempenho adequado em testes funcionais

  // ## Frequência e Duração
  // - Fase aguda: 2-3 sessões
  // - Fase subaguda: 2-3 sessões semanais
  // - Fase de reabilitação: 2-3 sessões semanais
  // - Fase de retorno ao esporte: 1-2 sessões semanais
  // - Duração total: 6-12 semanas (dependendo da gravidade)`,
  // },

  // Gerontologia - Síndrome da Fragilidade
  // {
  //   title: "Avaliação de Idoso com Síndrome da Fragilidade",
  //   specialty: "Gerontologia",
  //   condition: "Síndrome da Fragilidade",
  //   anamnesis: `# Anamnese para Idoso com Síndrome da Fragilidade

  // ## Dados Pessoais
  // - Idade
  // - Condições de moradia
  // - Suporte familiar/social
  // - Nível educacional
  // - Ocupação prévia

  // ## Critérios de Fragilidade (Fried)
  // - Perda de peso não intencional
  // - Fadiga autorrelatada
  // - Diminuição da força de preensão
  // - Velocidade de marcha reduzida
  // - Baixo nível de atividade física

  // ## História Médica
  // - Comorbidades
  // - Internações recentes
  // - Quedas nos últimos 12 meses (frequência, circunstâncias, consequências)
  // - Cirurgias prévias
  // - Histórico de fraturas

  // ## Medicamentos
  // - Polifarmácia (≥ 5 medicamentos)
  // - Psicotrópicos
  // - Anti-hipertensivos
  // - Diuréticos
  // - Hipoglicemiantes

  // ## Aspectos Nutricionais
  // - Perda de peso recente
  // - Apetite
  // - Dificuldades na alimentação
  // - Ingestão hídrica

  // ## Aspectos Cognitivos e Emocionais
  // - Queixas de memória
  // - Sintomas depressivos
  // - Ansiedade
  // - Alterações de comportamento

  // ## Funcionalidade
  // - Independência nas AVDs básicas
  // - Independência nas AVDs instrumentais
  // - Uso de dispositivos auxiliares
  // - Atividades sociais e de lazer

  // ## Sono e Fadiga
  // - Qualidade do sono
  // - Sonolência diurna
  // - Fadiga ao realizar atividades habituais`,
  //   physicalExam: `# Exame Físico para Idoso com Síndrome da Fragilidade

  // ## Sinais Vitais
  // - Pressão arterial (deitado e em pé)
  // - Frequência cardíaca
  // - Frequência respiratória
  // - Saturação de O₂

  // ## Avaliação Antropométrica
  // - Peso
  // - Altura
  // - IMC
  // - Circunferência da panturrilha

  // ## Avaliação da Marcha e Equilíbrio
  // - Teste de Velocidade de Marcha (4 metros)
  // - Timed Up and Go Test
  // - Teste de Equilíbrio de Berg
  // - Short Physical Performance Battery (SPPB)

  // ## Avaliação da Força Muscular
  // - Força de preensão palmar (dinamômetro)
  // - Teste de sentar e levantar 5 vezes
  // - Força de grandes grupos musculares (MMII e MMSS)

  // ## Avaliação Cardiorrespiratória
  // - Teste de caminhada de 6 minutos (se apropriado)
  // - Escala de Borg modificada

  // ## Avaliação Cognitiva
  // - Mini Exame do Estado Mental
  // - Teste do Relógio
  // - Montreal Cognitive Assessment (MoCA)

  // ## Avaliação Funcional
  // - Índice de Barthel (AVDs)
  // - Escala de Lawton e Brody (AIVDs)
  // - Escala de Fragilidade de Edmonton

  // ## Avaliação de Risco de Quedas
  // - Histórico de quedas
  // - Avaliação ambiental
  // - Escala de Eficácia de Quedas - Internacional (FES-I)`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Idoso com Síndrome da Fragilidade

  // ## Classificação da Fragilidade
  // - Pré-frágil (1-2 critérios de Fried)
  // - Frágil (3-5 critérios de Fried)
  // - Escala Clínica de Fragilidade (1-9)

  // ## Comprometimentos
  // - Sarcopenia
  // - Diminuição da força muscular
  // - Redução da resistência
  // - Lentidão da marcha
  // - Alteração do equilíbrio
  // - Diminuição da capacidade aeróbica
  // - Alteração da mobilidade funcional

  // ## Limitações Funcionais
  // - Dificuldade nas transferências
  // - Limitação na marcha
  // - Dificuldade em subir/descer escadas
  // - Limitação nas AVDs básicas
  // - Limitação nas AVDs instrumentais

  // ## Restrições de Participação
  // - Isolamento social
  // - Redução de atividades de lazer
  // - Limitação na participação comunitária

  // ## Fatores de Risco
  // - Alto risco de quedas
  // - Risco de hospitalização
  // - Risco de institucionalização
  // - Risco de dependência funcional
  // - Risco de mortalidade`,
  //   treatmentPlan: `# Plano de Tratamento para Idoso com Síndrome da Fragilidade

  // ## Objetivos Gerais
  // - Reverter ou retardar a progressão da fragilidade
  // - Melhorar a capacidade funcional
  // - Prevenir quedas
  // - Promover a participação social
  // - Melhorar a qualidade de vida

  // ## Treinamento de Força
  // - Exercícios progressivos de resistência
  // - Foco em grandes grupos musculares
  // - Ênfase em MMII (quadríceps, glúteos, tibial anterior)
  // - Progressão gradual de carga
  // - 2-3 séries de 8-12 repetições
  // - 2-3 vezes por semana

  // ## Treinamento de Equilíbrio
  // - Exercícios estáticos e dinâmicos
  // - Treino em diferentes bases de suporte
  // - Exercícios com olhos abertos e fechados
  // - Perturbações controladas
  // - Treino em superfícies instáveis
  // - Tai Chi adaptado

  // ## Treinamento Aeróbico
  // - Caminhada supervisionada
  // - Cicloergômetro
  // - Intensidade moderada (escala de Borg 12-14)
  // - Duração progressiva (iniciar com 5-10 min)
  // - 3-5 vezes por semana

  // ## Treino Funcional
  // - Transferências
  // - Sentar e levantar
  // - Subir e descer escadas
  // - Treino de AVDs específicas
  // - Treino de dupla tarefa

  // ## Educação e Orientações
  // - Prevenção de quedas
  // - Adaptações ambientais
  // - Uso correto de dispositivos auxiliares
  // - Importância da hidratação e nutrição
  // - Adesão à medicação

  // ## Abordagem Multidisciplinar
  // - Encaminhamento para nutricionista
  // - Avaliação farmacêutica
  // - Suporte psicológico (se necessário)
  // - Terapia ocupacional para adaptações

  // ## Frequência e Duração
  // - 2-3 sessões semanais
  // - Sessões de 30-60 minutos
  // - Programa de 12-24 semanas
  // - Reavaliação a cada 4-6 semanas
  // - Programa domiciliar complementar`,
  // },

  // Cardiovascular - Reabilitação Pós-IAM
  // {
  //   title: "Avaliação para Reabilitação Cardíaca Pós-IAM",
  //   specialty: "Cardiovascular",
  //   condition: "Pós-Infarto Agudo do Miocárdio",
  //   anamnesis: `# Anamnese para Reabilitação Cardíaca Pós-IAM

  // ## Dados do Evento Cardíaco
  // - Data do IAM
  // - Localização do infarto
  // - Tratamento realizado (angioplastia, stent, trombolíticos)
  // - Complicações durante a internação
  // - Tempo de internação
  // - Exames realizados (ECG, ecocardiograma, teste ergométrico)
  // - Fração de ejeção atual

  // ## Fatores de Risco Cardiovascular
  // - Hipertensão arterial
  // - Diabetes mellitus
  // - Dislipidemia
  // - Tabagismo (atual/pregresso, anos/maço)
  // - Obesidade
  // - Sedentarismo
  // - História familiar de doença cardiovascular
  // - Estresse

  // ## Sintomas Atuais
  // - Dor torácica
  // - Dispneia (escala mMRC)
  // - Fadiga
  // - Palpitações
  // - Tontura/síncope
  // - Edema de MMII

  // ## Medicamentos em Uso
  // - Anti-hipertensivos
  // - Antiplaquetários/anticoagulantes
  // - Estatinas
  // - Betabloqueadores
  // - IECA/BRA
  // - Diuréticos
  // - Antiarrítmicos

  // ## Nível de Atividade Física
  // - Atividades físicas prévias ao IAM
  // - Nível atual de atividade
  // - Limitações percebidas
  // - Motivação para exercício

  // ## Aspectos Psicossociais
  // - Ansiedade/depressão pós-IAM
  // - Retorno ao trabalho
  // - Suporte familiar
  // - Alterações na qualidade de vida

  // ## Outras Comorbidades
  // - Doença pulmonar
  // - Doença renal
  // - Doença vascular periférica
  // - Doenças musculoesqueléticas`,
  //   physicalExam: `# Exame Físico para Reabilitação Cardíaca Pós-IAM

  // ## Sinais Vitais
  // - Pressão arterial (repouso e recuperação)
  // - Frequência cardíaca (repouso e recuperação)
  // - Frequência respiratória
  // - Saturação de O₂
  // - Ausculta cardíaca e pulmonar

  // ## Avaliação Antropométrica
  // - Peso
  // - Altura
  // - IMC
  // - Circunferência abdominal
  // - Relação cintura-quadril

  // ## Avaliação Cardiovascular
  // - Classificação funcional NYHA (I-IV)
  // - Presença de edema
  // - Turgência jugular
  // - Pulsos periféricos

  // ## Avaliação da Capacidade Funcional
  // - Teste de caminhada de 6 minutos
  // - Teste de sentar e levantar de 1 minuto
  // - Escala de Borg para dispneia e fadiga
  // - Teste ergométrico (se disponível e liberado)
  // - VO₂ máximo estimado

  // ## Avaliação Musculoesquelética
  // - Força muscular global
  // - Flexibilidade
  // - Postura
  // - Amplitude de movimento

  // ## Avaliação da Qualidade de Vida
  // - SF-36 ou MacNew Heart Disease HRQL
  // - Escala de ansiedade e depressão hospitalar (HADS)

  // ## Estratificação de Risco
  // - Baixo risco
  // - Risco moderado
  // - Alto risco
  // - Critérios da AACVPR (American Association of Cardiovascular and Pulmonary Rehabilitation)`,
  //   diagnosis: `# Diagnóstico Fisioterapêutico para Reabilitação Cardíaca Pós-IAM

  // ## Classificação Funcional
  // - NYHA classe ____ (I-IV)
  // - Capacidade funcional: METs estimados
  // - Fase da reabilitação cardíaca (I, II, III ou IV)

  // ## Comprometimentos
  // - Diminuição da capacidade aeróbica
  // - Descondicionamento físico
  // - Fraqueza muscular
  // - Intolerância ao esforço
  // - Dispneia aos esforços
  // - Alterações hemodinâmicas ao esforço

  // ## Limitações Funcionais
  // - Limitação nas AVDs
  // - Limitação nas atividades laborais
  // - Limitação nas atividades de lazer
  // - Limitação na capacidade de exercício

  // ## Fatores de Risco Modificáveis
  // - Sedentarismo
  // - Obesidade
  // - Tabagismo
  // - Estresse
  // - Controle inadequado de comorbidades

  // ## Estratificação de Risco para Exercício
  // - Baixo risco
  // - Risco moderado
  // - Alto risco
  // - Precauções específicas`,
  //   treatmentPlan: `# Plano de Tratamento para Reabilitação Cardíaca Pós-IAM

  // ## Fase I (Intra-hospitalar)
  // - Mobilização precoce
  // - Exercícios respiratórios
  // - Exercícios ativos de baixa intensidade
  // - Orientações para alta hospitalar

  // ## Fase II (Ambulatorial Supervisionada)
  // - Duração: 3-6 meses
  // - Frequência: 2-3 sessões semanais

  // ### Treinamento Aeróbico
  // - Modalidade: caminhada, cicloergômetro, esteira
  // - Intensidade: 40-80% da FC reserva ou 11-14 na escala de Borg
  // - Duração: progressão de 5-10 min até 20-60 min
  // - Monitorização: FC, PA, ECG (se necessário), sintomas

  // ### Treinamento de Resistência
  // - Início: após 2-4 semanas de treinamento aeróbico
  // - Intensidade: 30-60% de 1RM
  // - Séries: 1-3 séries de 10-15 repetições
  // - Exercícios: grandes grupos musculares
  // - Precauções: evitar manobra de Valsalva

  // ### Treinamento de Flexibilidade
  // - Alongamentos suaves
  // - Foco em grupos musculares principais
  // - 2-3 vezes por semana

  // ## Fase III (Manutenção Supervisionada)
  // - Duração: 6-12 meses
  // - Frequência: 2-3 sessões semanais
  // - Progressão gradual da intensidade
  // - Maior ênfase no treinamento de resistência
  // - Monitorização menos intensiva
  // - Incentivo à independência

  // ## Fase IV (Manutenção Não-Supervisionada)
  // - Programa domiciliar de longo prazo
  // - Consultas periódicas para ajustes
  // - Automonitorização (diário de exercícios)
  // - Participação em grupos de apoio

  // ## Educação do Paciente
  // - Conhecimento sobre a doença cardíaca
  // - Reconhecimento de sinais de alerta
  // - Automonitorização durante exercícios
  // - Importância da adesão medicamentosa
  // - Controle dos fatores de risco
  // - Técnicas de gerenciamento do estresse

  // ## Modificação de Fatores de Risco
  // - Orientação nutricional
  // - Cessação do tabagismo
  // - Controle do peso
  // - Manejo do estresse
  // - Adesão medicamentosa

  // ## Critérios de Interrupção do Exercício
  // - Dor torácica
  // - Dispneia desproporcional
  // - Tontura/pré-síncope
  // - Alterações significativas da PA
  // - FC acima do limite prescrito
  // - Arritmias
  // - Fadiga extrema

  // ## Frequência e Progressão
  // - Início: 2-3 sessões semanais
  // - Duração inicial: 20-30 minutos
  // - Progressão gradual conforme tolerância
  // - Reavaliação a cada 4-8 semanas
  // - Duração total do programa: 3-12 meses`,
  // },
]

// Função para usar um modelo na criação de um novo prontuário
// export const useTemplateForPatient = async (templateId: string, patientId: string): Promise<boolean> => {
//   try {
//     const template = await getTemplate(templateId)
//     const patient = await getPatient(patientId)

//     if (!template || !patient) return false

//     // Atualizar os campos do paciente com os dados do modelo
//     const updatedPatient = {
//       ...patient,
//       anamnesis: template.anamnesis,
//       physicalExam: template.physicalExam,
//       diagnosis: template.diagnosis,
//       treatmentPlan: template.treatmentPlan,
//     }

//     // Salvar o paciente atualizado
//     await updatePatient(patientId, updatedPatient)
//     return true
//   } catch (error) {
//     console.error("Erro ao usar modelo para paciente:", error)
//     return false
//   }
// }

// Usar modelo para criar um prontuário para um paciente
export async function useTemplateForPatient(templateId: string, patientId: string): Promise<boolean> {
  try {
    const template = await getTemplateById(templateId)
    const patient = await getPatient(patientId)

    if (!template || !patient) return false

    // Atualizar os campos do paciente com os dados do modelo
    const updatedPatient = {
      ...patient,
      medicalRecord: {
        anamnesis: template.anamnesis || "",
        physicalExam: template.physicalExam || "",
        diagnosis: template.diagnosis || "",
        treatmentPlan: template.treatmentPlan || "",
      },
      updatedAt: new Date().toISOString(),
    }

    // Salvar o paciente atualizado
    await updatePatient(patientId, updatedPatient)
    return true
  } catch (error) {
    console.error("Erro ao usar modelo para paciente:", error)
    return false
  }
}

// Função auxiliar para atualizar paciente
const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<boolean> => {
  try {
    const patient = await getPatient(id)
    if (!patient) return false

    const updatedPatient = { ...patient, ...patientData }
    await patientsStore.setItem(id, updatedPatient)
    return true
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)
    return false
  }
}

// Função para obter paciente
const getPatient = async (id: string): Promise<Patient | null> => {
  try {
    const patient = await patientsStore.getItem<Patient>(id)
    return patient || null
  } catch (error) {
    console.error("Erro ao obter paciente:", error)
    return null
  }
}

// Função para obter o store de templates
export const getTemplatesStore = () => templatesStore

// Obter todos os modelos
export async function getAllTemplates(): Promise<MedicalRecordTemplate[]> {
  try {
    const templates = await templatesStore.getItem<MedicalRecordTemplate[]>("templates")
    return templates || []
  } catch (error) {
    console.error("Erro ao obter modelos:", error)
    return []
  }
}

// Obter modelo por ID
export async function getTemplateById(id: string): Promise<MedicalRecordTemplate | null> {
  try {
    const templates = await getAllTemplates()
    const template = templates.find((t) => t.id === id)
    return template || null
  } catch (error) {
    console.error(`Erro ao obter modelo com ID ${id}:`, error)
    return null
  }
}

// Obter modelos por especialidade
export async function getTemplatesBySpecialty(specialty: string): Promise<MedicalRecordTemplate[]> {
  try {
    const templates = await getAllTemplates()
    return templates.filter((t) => t.specialty === specialty)
  } catch (error) {
    console.error(`Erro ao obter modelos da especialidade ${specialty}:`, error)
    return []
  }
}

// Obter modelos favoritos
export async function getFavoriteTemplates(): Promise<MedicalRecordTemplate[]> {
  try {
    const templates = await getAllTemplates()
    return templates.filter((t) => t.isFavorite)
  } catch (error) {
    console.error("Erro ao obter modelos favoritos:", error)
    return []
  }
}

// Adicionar novo modelo
export async function addTemplate(
  template: Omit<MedicalRecordTemplate, "id" | "createdAt" | "updatedAt">,
): Promise<MedicalRecordTemplate> {
  try {
    const templates = await getAllTemplates()
    const now = new Date().toISOString()

    const newTemplate: MedicalRecordTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }

    await templatesStore.setItem("templates", [...templates, newTemplate])
    return newTemplate
  } catch (error) {
    console.error("Erro ao adicionar modelo:", error)
    throw new Error("Falha ao adicionar modelo de prontuário")
  }
}

// Atualizar modelo existente
export async function updateTemplate(
  id: string,
  updates: Partial<MedicalRecordTemplate>,
): Promise<MedicalRecordTemplate> {
  try {
    const templates = await getAllTemplates()
    const templateIndex = templates.findIndex((t) => t.id === id)

    if (templateIndex === -1) {
      throw new Error(`Modelo com ID ${id} não encontrado`)
    }

    const updatedTemplate: MedicalRecordTemplate = {
      ...templates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    templates[templateIndex] = updatedTemplate
    await templatesStore.setItem("templates", templates)

    return updatedTemplate
  } catch (error) {
    console.error(`Erro ao atualizar modelo com ID ${id}:`, error)
    throw new Error("Falha ao atualizar modelo de prontuário")
  }
}

// Excluir modelo
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    const templates = await getAllTemplates()
    const filteredTemplates = templates.filter((t) => t.id !== id)

    if (filteredTemplates.length === templates.length) {
      throw new Error(`Modelo com ID ${id} não encontrado`)
    }

    await templatesStore.setItem("templates", filteredTemplates)
    return true
  } catch (error) {
    console.error(`Erro ao excluir modelo com ID ${id}:`, error)
    return false
  }
}

// Alternar favorito
export async function toggleFavorite(id: string): Promise<MedicalRecordTemplate> {
  try {
    const templates = await getAllTemplates()
    const templateIndex = templates.findIndex((t) => t.id === id)

    if (templateIndex === -1) {
      throw new Error(`Modelo com ID ${id} não encontrado`)
    }

    const template = templates[templateIndex]
    const updatedTemplate: MedicalRecordTemplate = {
      ...template,
      isFavorite: !template.isFavorite,
      updatedAt: new Date().toISOString(),
    }

    templates[templateIndex] = updatedTemplate
    await templatesStore.setItem("templates", templates)

    return updatedTemplate
  } catch (error) {
    console.error(`Erro ao alternar favorito do modelo com ID ${id}:`, error)
    throw new Error("Falha ao alternar favorito")
  }
}

// Buscar modelos
export async function searchTemplates(query: string): Promise<MedicalRecordTemplate[]> {
  try {
    const templates = await getAllTemplates()
    const lowerQuery = query.toLowerCase()

    return templates.filter(
      (template) =>
        template.title.toLowerCase().includes(lowerQuery) ||
        template.specialty.toLowerCase().includes(lowerQuery) ||
        template.content?.toLowerCase().includes(lowerQuery) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  } catch (error) {
    console.error(`Erro ao buscar modelos com a consulta "${query}":`, error)
    return []
  }
}

// Obter todas as especialidades disponíveis
export async function getAllSpecialties(): Promise<string[]> {
  try {
    const templates = await getAllTemplates()
    const specialties = new Set(templates.map((t) => t.specialty))
    return Array.from(specialties)
  } catch (error) {
    console.error("Erro ao obter especialidades:", error)
    return []
  }
}
