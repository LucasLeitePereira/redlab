import type { V3 } from './base'
import { Caminhao } from './modelos'
import { Cabo, useCurva, Viajante } from './movimento'

export type Viagem = {
  /** Cor da cabine (vermelho = pedido, azul = resposta, por convenção nas cenas). */
  cor?: string
  carga?: string
  duracao?: number
  pausa?: number
  atraso?: number
  inverso?: boolean
}

/** Cabo no chão entre dois pontos, com caminhõezinhos (pacotes) andando por cima. */
export function Ligacao({
  pontos,
  cor = '#3b6fb5',
  raio = 0.06,
  viagens = [],
  ativo = true,
  opacidade,
}: {
  pontos: V3[]
  cor?: string
  raio?: number
  viagens?: Viagem[]
  ativo?: boolean
  opacidade?: number
}) {
  const curva = useCurva(pontos)
  return (
    <>
      <Cabo curva={curva} cor={cor} raio={raio} opacidade={opacidade} />
      {viagens.map((v, i) => (
        <Viajante
          key={i}
          curva={curva}
          duracao={v.duracao ?? 3}
          pausa={v.pausa ?? 0.8}
          atraso={v.atraso ?? 0}
          inverso={v.inverso}
          altura={raio}
          ativo={ativo}
        >
          <group scale={0.8}>
            <Caminhao cor={v.cor} carga={v.carga} />
          </group>
        </Viajante>
      ))}
    </>
  )
}
