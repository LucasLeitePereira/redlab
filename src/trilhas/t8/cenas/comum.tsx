import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import type { Group } from 'three'
import { Caixa, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Computador } from '../../../three/modelos'

// Peças comuns das cenas da Trilha 8: quadro/tabela em HTML (rótulo largo), anel de estações
// (Token Ring) e elipse tracejada.

/** Rótulo largo (o cartão padrão tem 230 px): um quadro de HTML centrado no ponto, de `largura` px. */
export function Quadro({
  pos,
  largura,
  children,
  fundo = '#ffffff',
  cor = '#1d2733',
  estilo,
}: {
  pos: V3
  largura: number
  children: ReactNode
  fundo?: string
  cor?: string
  estilo?: CSSProperties
}) {
  return (
    <Rotulo pos={pos} classe="cartao">
      <div
        style={{
          width: largura,
          marginLeft: (210 - largura) / 2,
          marginTop: -7,
          marginBottom: -7,
          background: fundo,
          color: cor,
          borderRadius: 10,
          padding: '8px 12px',
          boxShadow: '0 3px 10px rgba(20, 40, 70, 0.22)',
          ...estilo,
        }}
      >
        {children}
      </div>
    </Rotulo>
  )
}

export type Col = { id: string; titulo: string; esconder?: boolean; largura?: number }
export type Cel = { t: string; col: string; colSpan?: number; rowSpan?: number; fixo?: boolean; negrito?: boolean }
export type Lin = { cels: Cel[]; destaque?: boolean }

/** Linha simples: um texto por coluna, na ordem das colunas. */
export const linha = (colunas: Col[], textos: string[], destaque = false): Lin => ({
  cels: textos.map((t, i) => ({ t, col: colunas[i].id, negrito: i === 0 })),
  destaque,
})

const BORDA = '1px solid #d3dae2'

/** Tabela de HTML no espaço 3D. Colunas com `esconder` mostram "?" no lugar do conteúdo. */
export function Tabela3D({
  pos,
  colunas,
  linhas,
  titulo,
  largura,
  fonte = 13,
}: {
  pos: V3
  colunas: Col[]
  linhas: Lin[]
  titulo?: string
  largura: number
  fonte?: number
}) {
  const escondida = (id: string) => !!colunas.find((c) => c.id === id)?.esconder
  return (
    <Quadro pos={pos} largura={largura}>
      {titulo && <div style={{ fontWeight: 900, fontSize: fonte + 2, marginBottom: 6 }}>{titulo}</div>}
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: fonte, fontWeight: 600, lineHeight: 1.25 }}>
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.id} style={{ background: '#1d2733', color: '#fff', padding: '5px 8px', textAlign: 'left', fontWeight: 800, border: BORDA, width: c.largura }}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i}>
              {l.cels.map((c, j) => {
                const oculta = escondida(c.col) && !c.fixo
                const estilo: CSSProperties = {
                  border: l.destaque ? '2px solid #2f6fd0' : BORDA,
                  padding: '4px 8px',
                  textAlign: 'left',
                  whiteSpace: 'normal',
                  verticalAlign: 'middle',
                  fontWeight: c.negrito ? 800 : 600,
                  background: l.destaque ? '#e4f0ff' : i % 2 ? '#f6f8fa' : '#fff',
                  color: oculta ? '#97a0a9' : '#1d2733',
                }
                return (
                  <td key={j} colSpan={c.colSpan} rowSpan={c.rowSpan} style={estilo}>
                    {oculta ? '?' : c.t}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Quadro>
  )
}

/** Elipse tracejada no chão. */
export function Elipse({ pos, rx, rz, cor = '#4a5a6a', y = 0.05 }: { pos: V3; rx: number; rz: number; cor?: string; y?: number }) {
  const pontos = useMemo(
    () => Array.from({ length: 49 }, (_, i) => [pos[0] + Math.cos((i / 48) * Math.PI * 2) * rx, y, pos[2] + Math.sin((i / 48) * Math.PI * 2) * rz] as V3),
    [pos[0], pos[2], rx, rz, y],
  )
  return <Line points={pontos} color={cor} lineWidth={2.5} dashed dashSize={0.25} gapSize={0.16} />
}

// ---------------------------------------------------------------- Anel de estações

const VOLTA = 1.1 // s para o token andar de uma estação à seguinte
const SEGURA = 2.0 // s que a estação com o token transmite

/**
 * Anel de `n` estações. O token (caixinha verde) gira no sentido horário; a estação que o tem
 * transmite um dado pelo anel e depois passa o token. `parado`: o token fica na estação 0 e nada
 * transmite. `querem`: se informado, só essas estações transmitem (e mostram o balão
 * "quero falar" enquanto esperam); as outras só repassam o token.
 */
export function Anel({
  pos = [0, 0, 0],
  raio = 3.2,
  n = 5,
  parado = false,
  querem,
  legendas = true,
}: {
  pos?: V3
  raio?: number
  n?: number
  parado?: boolean
  querem?: number[]
  legendas?: boolean
}) {
  const d = (Math.PI * 2) / n
  const ang = (i: number) => -Math.PI / 2 + i * d
  const xz = (a: number, r: number): [number, number] => [Math.cos(a) * r, Math.sin(a) * r]

  // linha do tempo de uma volta: para cada estação, [segura (se transmite)] + [viagem do token]
  const tempo = useMemo(() => {
    const trechos: { ini: number; fim: number; i: number; segura: boolean }[] = []
    let t = 0
    for (let i = 0; i < n; i++) {
      if (!querem || querem.includes(i)) {
        trechos.push({ ini: t, fim: t + SEGURA, i, segura: true })
        t += SEGURA
      }
      trechos.push({ ini: t, fim: t + VOLTA, i, segura: false })
      t += VOLTA
    }
    return { trechos, total: t }
  }, [n, querem?.join(',')])

  const token = useRef<Group>(null)
  const dado = useRef<Group>(null)
  const etiqueta = useRef<Group>(null)
  const baloes = useRef<(Group | null)[]>([])

  useFrame(({ clock }) => {
    const g = token.current
    if (!g) return
    if (parado) {
      const [x, z] = xz(ang(0), raio)
      g.position.set(x, 0.42, z)
      if (dado.current) dado.current.visible = false
      if (etiqueta.current) etiqueta.current.visible = false
      return
    }
    const t = clock.elapsedTime % tempo.total
    const tr = tempo.trechos.find((s) => t >= s.ini && t < s.fim) ?? tempo.trechos[0]
    const u = (t - tr.ini) / (tr.fim - tr.ini)
    const a = tr.segura ? ang(tr.i) : ang(tr.i) + d * u
    const [x, z] = xz(a, raio)
    g.position.set(x, 0.42, z)
    if (dado.current) {
      dado.current.visible = tr.segura
      if (tr.segura) {
        const [dx, dz] = xz(ang(tr.i) + d * 2 * u, raio)
        dado.current.position.set(dx, 0.22, dz)
      }
    }
    if (etiqueta.current) {
      etiqueta.current.visible = tr.segura
      const [ex, ez] = xz(ang(tr.i), raio + 1.55)
      etiqueta.current.position.set(ex, 1.8, ez)
    }
    baloes.current.forEach((b, i) => {
      if (b) b.visible = !(tr.segura && tr.i === i)
    })
  })

  return (
    <group position={pos}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.22, 0]} castShadow>
        <torusGeometry args={[raio, 0.05, 8, 72]} />
        <meshStandardMaterial color="#3b6fb5" roughness={0.6} />
      </mesh>

      {Array.from({ length: n }, (_, i) => {
        const [x, z] = xz(ang(i), raio)
        return (
          <group key={i} position={[x, 0, z]}>
            <Computador rot={[0, Math.atan2(-x, -z), 0]} escala={0.5} gabinete={x > 0 ? 'direita' : 'esquerda'} />
            {querem?.includes(i) && !parado && (
              <group ref={(g) => { baloes.current[i] = g }}>
                <Rotulo pos={[0, 1.55, 0]} classe="mini">
                  quero falar
                </Rotulo>
              </group>
            )}
          </group>
        )
      })}

      <group ref={token}>
        <Caixa tam={[0.55, 0.3, 0.4]} cor="#39b36a" emissivo="#39b36a" intensidade={0.5} sombra={false} />
        <Rotulo pos={[0, 0.4, 0]} classe="mini">
          Token
        </Rotulo>
      </group>

      {/* o dado que a estação com o token manda pelo anel (um por vez) */}
      <group ref={dado} visible={false}>
        <Dado cor="#ef6f6c" sombra={false} />
      </group>

      <group ref={etiqueta} visible={false}>
        <Rotulo pos={[0, 0, 0]} escuro>
          Estação que está transmitindo
        </Rotulo>
      </group>

      {legendas && (
        <Rotulo pos={[0, 0.3, 0]} classe="grande">
          ↻ Direção do Token
        </Rotulo>
      )}
    </group>
  )
}
