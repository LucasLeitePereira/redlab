import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import { Caixa, Cilindro, Fixo, type V3 } from '../../../three/base'

// Peças comuns das cenas da Trilha 5: as 7 camadas do RM-OSI com as cores do slide
// (verde nas 3 de cima, azul no transporte, laranja na rede, amarelo em enlace e física),
// a pilha fixa no canto da tela, setas e blocos.

export type IdCamada = 'aplicacao' | 'apresentacao' | 'sessao' | 'transporte' | 'rede' | 'enlace' | 'fisica'

/** As 7 camadas, de cima (7ª) para baixo (1ª). */
export const OSI: { id: IdCamada; n: number; nome: string; cor: string }[] = [
  { id: 'aplicacao', n: 7, nome: 'Aplicação', cor: '#3f6b3a' },
  { id: 'apresentacao', n: 6, nome: 'Apresentação', cor: '#3f6b3a' },
  { id: 'sessao', n: 5, nome: 'Sessão', cor: '#3f6b3a' },
  { id: 'transporte', n: 4, nome: 'Transporte', cor: '#3e6480' },
  { id: 'rede', n: 3, nome: 'Rede', cor: '#9a4418' },
  { id: 'enlace', n: 2, nome: 'Enlace', cor: '#c48a14' },
  { id: 'fisica', n: 1, nome: 'Física', cor: '#c48a14' },
]

export const CINZA_CAMADA = '#cfd4d9'

/** A pilha RM-OSI no canto da tela, com as camadas em foco coloridas (como os slides p. 5–9). */
export function PilhaOsi({ foco }: { foco: IdCamada[] }) {
  return (
    <Fixo x={16} y={84}>
      <div className="pilha-osi">
        <div className="pilha-osi-titulo">RM-OSI</div>
        {OSI.map((c) => {
          const ativa = foco.includes(c.id)
          return (
            <div key={c.id} className={`camada ${ativa ? 'ativa' : ''}`} style={ativa ? { background: c.cor } : undefined}>
              {c.nome}
            </div>
          )
        })}
      </div>
    </Fixo>
  )
}

const CIMA = new Vector3(0, 1, 0)

/** Seta 3D reta de `de` até `para` (com ponta nas duas extremidades, se `duasPontas`). */
export function Seta({ de, para, cor, raio = 0.07, duasPontas = false }: { de: V3; para: V3; cor: string; raio?: number; duasPontas?: boolean }) {
  const { quat, tamanho } = useMemo(() => {
    const dir = new Vector3(para[0] - de[0], para[1] - de[1], para[2] - de[2])
    const tamanho = dir.length()
    return { quat: new Quaternion().setFromUnitVectors(CIMA, dir.normalize()), tamanho }
  }, [de, para])
  const ponta = raio * 4
  const inicio = duasPontas ? ponta : 0
  const corpo = tamanho - ponta - inicio
  return (
    <group position={de} quaternion={quat}>
      <Cilindro raio={raio} altura={corpo} pos={[0, inicio + corpo / 2, 0]} cor={cor} sombra={false} />
      <Cilindro raio={0} raioBase={raio * 2.4} altura={ponta} pos={[0, tamanho - ponta / 2, 0]} cor={cor} sombra={false} />
      {duasPontas && <Cilindro raio={raio * 2.4} raioBase={0} altura={ponta} pos={[0, ponta / 2, 0]} cor={cor} sombra={false} />}
    </group>
  )
}

/** Linha tracejada da conversa "lógica" entre pares de uma mesma camada. */
export function LinhaDePares({ de, para, cor, ativa = true }: { de: V3; para: V3; cor: string; ativa?: boolean }) {
  return <Line points={[de, para]} color={cor} lineWidth={2} dashed dashSize={0.22} gapSize={0.14} transparent opacity={ativa ? 0.9 : 0.35} />
}

/** Bloco de uma camada: a caixa na cor da camada e uma tampa mais clara. */
export function Bloco({ pos, tam, cor }: { pos: V3; tam: V3; cor: string }) {
  return (
    <group>
      <Caixa tam={tam} pos={pos} cor={cor} />
      <Caixa tam={[tam[0] - 0.08, 0.02, tam[2] - 0.08]} pos={[pos[0], pos[1] + tam[1] / 2 + 0.01, pos[2]]} cor="#ffffff" opacidade={0.18} sombra={false} />
    </group>
  )
}
