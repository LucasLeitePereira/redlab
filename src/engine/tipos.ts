import type { ComponentType } from 'react'

/** Página do PDF da aula de onde o conteúdo foi tirado. */
export type Fonte = { aula: string; pagina: number | string }

export type Nota =
  | { tipo: 'pegadinha' | 'dica'; titulo: string; texto: string }
  /** Informação que não está no slide — sempre sinalizada como tal. */
  | { tipo: 'curiosidade'; titulo: string; texto: string }
  /** Quando o slide diz uma coisa e a prática é outra: mostra os dois. */
  | { tipo: 'slide-vs-pratica'; titulo: string; noSlide: string; naPratica: string }

/** Estado livre que cada passo entrega para a cena 3D da fase. */
export type EstadoCena = Record<string, string | number | boolean | undefined>

export type AlvoExplorar = { titulo: string; texto: string }

export type Passo = {
  titulo: string
  /** Mini-markdown: parágrafos, **negrito**, *itálico*, listas com "- " e citações com "> ". */
  texto: string
  fonte?: Fonte
  cena?: EstadoCena
  notas?: Nota[]
  /** Passo interativo: o aluno precisa clicar em todos os alvos da cena para avançar. */
  explorar?: { instrucao: string; alvos: Record<string, AlvoExplorar> }
}

export type QuestaoEscolha = {
  tipo: 'escolha'
  enunciado: string
  /** Linhas mostradas em fonte mono abaixo do enunciado: os dados do slide que a questão usa. */
  dados?: string[]
  opcoes: string[]
  /** Índice da opção correta em `opcoes`. */
  correta: number
  explicacao: string
  fonte: Fonte
  /**
   * Estado da cena 3D enquanto a questão está na tela: mostra a figura do slide que ela usa.
   * Sem ele, a cena fica no último passo da fase.
   */
  cena?: EstadoCena
}

export type QuestaoClassificar = {
  tipo: 'classificar'
  enunciado: string
  /** Linhas mostradas em fonte mono abaixo do enunciado: os dados do slide que a questão usa. */
  dados?: string[]
  grupos: string[]
  /** `grupo` é o índice em `grupos`. */
  itens: { texto: string; grupo: number }[]
  explicacao: string
  fonte: Fonte
  /**
   * Estado da cena 3D enquanto a questão está na tela: mostra a figura do slide que ela usa.
   * Sem ele, a cena fica no último passo da fase.
   */
  cena?: EstadoCena
}

/**
 * Como a resposta digitada é conferida: `ip` aceita "·" ou "," no lugar do ponto e um
 * "/n" opcional; `numero` ignora separador de milhar; `binario` ignora espaços;
 * `mascara` aceita tanto 255.255.255.0 quanto /24.
 */
export type FormatoCampo = 'ip' | 'numero' | 'binario' | 'mascara'

export type CampoResposta = { rotulo: string; resposta: string; formato: FormatoCampo }

export type QuestaoDigitar = {
  tipo: 'digitar'
  enunciado: string
  /** Linhas mostradas em fonte mono abaixo do enunciado (ex.: "Endereço IP : 192.168.100.4"). */
  dados?: string[]
  /** Todos os campos precisam estar certos para a questão contar. */
  campos: CampoResposta[]
  explicacao: string
  fonte: Fonte
  /**
   * Estado da cena 3D enquanto a questão está na tela: mostra a figura do slide que ela usa.
   * Sem ele, a cena fica no último passo da fase.
   */
  cena?: EstadoCena
}

export type Questao = QuestaoEscolha | QuestaoClassificar | QuestaoDigitar

export type CenaProps = {
  estado: EstadoCena
  /** Ids dos alvos já clicados no passo de explorar atual. */
  revelados: string[]
  /** Ids clicáveis no passo atual (vazio fora dos passos de explorar). */
  alvos: string[]
  onRevelar: (id: string) => void
}

export type Fase = {
  id: string
  titulo: string
  resumo: string
  Cena: ComponentType<CenaProps>
  /** Posição inicial da câmera [x, y, z]. */
  camera: [number, number, number]
  /** Para onde a câmera olha (padrão: [0, 0.6, 0]). */
  alvoCamera?: [number, number, number]
  passos: Passo[]
  desafio: Questao[]
}

export type Trilha = {
  id: string
  numero: number
  titulo: string
  aula: string
  cor: string
  disponivel: boolean
  fases: Fase[]
  /** Questões extras do chefão, além das dos desafios das fases. */
  chefaoExtras: Questao[]
  /**
   * Gerador de exercícios infinitos: com ele, o chefão ganha os modos "treino livre"
   * e "contra o relógio", e a revisão mistura questões geradas.
   */
  gerador?: () => Questao
}
