import { Caixa, Rotulo, type V3 } from '../../../three/base'

// Peças comuns das cenas da Trilha 6: o "tijolo" de protocolo (caixa colorida com o nome na
// frente, como os quadros dos slides). As setas vêm da Trilha 5.

export { LinhaDePares, Seta } from '../../t5/cenas/comum'

const APAGADO = '#d5d9de'

export function Tijolo({
  pos,
  tam = [1.3, 0.5, 0.3],
  cor,
  texto,
  claro = false,
  apagado = false,
  pequeno = false,
}: {
  pos: V3
  tam?: V3
  cor: string
  texto: string
  /** Texto branco (para caixas escuras). */
  claro?: boolean
  apagado?: boolean
  pequeno?: boolean
}) {
  return (
    <group>
      <Caixa tam={tam} pos={pos} cor={apagado ? APAGADO : cor} />
      <Rotulo
        pos={[pos[0], pos[1], pos[2] + tam[2] / 2 + 0.01]}
        classe={`tijolo ${claro && !apagado ? 'claro' : ''} ${pequeno ? 'pequeno' : ''}`}
        apagado={apagado}
      >
        {texto}
      </Rotulo>
    </group>
  )
}
