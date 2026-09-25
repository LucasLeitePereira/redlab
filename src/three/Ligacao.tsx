import type { V3 } from './base'
import { Dado, type Sequencia, type TipoDado } from './dados'
import { Caminhao } from './modelos'
import { Cabo, useCurva, Viajante } from './movimento'

export type Viagem = {
  /** Cor do ícone (vermelho = pedido, azul = resposta, por convenção nas cenas). */
  cor?: string
  /** Tipo de dado fixo; sem ele, o ícone troca de tipo a cada viagem. */
  tipo?: TipoDado
  /** Sequência compartilhada com outros dados (continuação do caminho, aviso de chegada). */
  sequencia?: Sequencia
  /** Esta viagem é a que avança a `sequencia`. */
  conduz?: boolean
  duracao?: number
  pausa?: number
  atraso?: number
  inverso?: boolean
}

/**
 * Põe as viagens de um mesmo cabo em fila: nunca há dois dados no cabo ao mesmo tempo.
 * Cada uma mantém seu `atraso` se couber; se ainda houver um dado no cabo, espera ele sumir.
 * O ciclo (duração + pausa) fica o mesmo para todas: o maior entre o original e o da fila inteira.
 */
export function emSequencia<T extends Viagem>(viagens: T[], folga = 0.3): (T & { atraso?: number; pausa?: number })[] {
  if (viagens.length < 2) return viagens
  const duracao = (v: Viagem) => v.duracao ?? 3
  const fila = [...viagens].sort((a, b) => (a.atraso ?? 0) - (b.atraso ?? 0))
  const inicios: number[] = []
  fila.forEach((v, i) => {
    const livre = i === 0 ? -Infinity : inicios[i - 1] + duracao(fila[i - 1]) + folga
    inicios.push(Math.max(v.atraso ?? 0, livre))
  })
  const ultima = fila.length - 1
  const ciclo = Math.max(
    ...fila.map((v) => duracao(v) + (v.pausa ?? 0.8)),
    inicios[ultima] + duracao(fila[ultima]) + folga - inicios[0],
  )
  return fila.map((v, i) => ({ ...v, atraso: inicios[i], pausa: ciclo - duracao(v) }))
}

/** Cabo no chão entre dois pontos, com ícones de dados (mensagem, música, vídeo...) andando por cima. */
export function Ligacao({
  pontos,
  cor = '#3b6fb5',
  raio = 0.06,
  viagens = [],
  ativo = true,
  opacidade,
  surgir,
  caminhao = false,
}: {
  pontos: V3[]
  cor?: string
  raio?: number
  viagens?: Viagem[]
  ativo?: boolean
  opacidade?: number
  /** Os dados crescem ao sair e encolhem ao chegar (quando a ponta do cabo fica dentro de um objeto). */
  surgir?: number
  /** Caminhãozinho no lugar do ícone (só no mapa das ilhas, onde as pontes são ruas). */
  caminhao?: boolean
}) {
  const curva = useCurva(pontos)
  // cada cabo começa num tipo diferente, para a cena não mostrar todos iguais ao mesmo tempo
  const semente = Math.round(Math.abs(pontos[0][0] * 7 + pontos[0][2] * 3))
  // cabo no ar (enlaces entre torres, rotas num mapa): o dado não tem sombra no chão
  const noChao = pontos.every((p) => p[1] < 0.5)
  return (
    <>
      <Cabo curva={curva} cor={cor} raio={raio} opacidade={opacidade} />
      {emSequencia(viagens).map((v, i) => (
        <Viajante
          key={i}
          curva={curva}
          duracao={v.duracao ?? 3}
          pausa={v.pausa ?? 0.8}
          atraso={v.atraso ?? 0}
          inverso={v.inverso}
          altura={raio}
          ativo={ativo}
          surgir={surgir}
        >
          <group scale={0.8}>
            {caminhao ? <Caminhao cor={v.cor} /> : <Dado cor={v.cor} tipo={v.tipo} inicio={semente + i * 3} sequencia={v.sequencia} conduz={v.conduz} sombra={noChao} />}
          </group>
        </Viajante>
      ))}
    </>
  )
}
