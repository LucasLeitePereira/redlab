import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, Shape, type Group } from 'three'
import type { CenaProps } from '../../../engine/tipos'
import { Caixa, Cilindro, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Celular, EstacaoBase, Impressora, Notebook, PontoDeAcesso } from '../../../three/modelos'
import { Ondas, Pulsos, useCurva } from '../../../three/movimento'
import { Seta } from '../../t5/cenas/comum'

// Fase 9.6: sem fio e espectro eletromagnético (Aula 08 p. 18–21).
// Modos: 'semfio', 'espectro' (estado destaque: radio|micro|infra|visivel|uv|x|gama),
// 'baixa', 'alta', 'microondas', 'infravermelho'.

// ---------------------------------------------------------------- Sem fio

function SemFio() {
  const AP: V3 = [0, 0.12, 0]
  const itens: { p: V3; tipo: 'nb' | 'cel' }[] = [
    { p: [-3.6, 0.12, 2.4], tipo: 'nb' },
    { p: [3.6, 0.12, 2.4], tipo: 'nb' },
    { p: [0, 0.12, -3.6], tipo: 'cel' },
  ]
  return (
    <>
      <PontoDeAcesso pos={AP} escala={1.6} />
      <Ondas pos={[0, 1.2, 0]} cor="#3aa0e6" raio={5} periodo={2.8} quantidade={3} />
      {itens.map(({ p, tipo }, i) => {
        const rot: V3 = [0, Math.atan2(AP[0] - p[0], AP[2] - p[2]), 0]
        return tipo === 'nb' ? <Notebook key={i} pos={p} rot={rot} escala={1} /> : <Celular key={i} pos={p} rot={rot} escala={1.2} />
      })}
      <Rotulo pos={[0, 3.2, 0]} classe="grande">
        Redes sem fio
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Espectro

type Faixa = { id: string; nome: string; cor: string }
const FAIXAS: Faixa[] = [
  { id: 'radio', nome: 'Ondas de rádio', cor: '#f2d94e' },
  { id: 'micro', nome: 'Micro-ondas', cor: '#f2994a' },
  { id: 'infra', nome: 'Infravermelho', cor: '#f08aa8' },
  { id: 'visivel', nome: 'Luz visível', cor: '#ffffff' },
  { id: 'uv', nome: 'Ultravioleta', cor: '#b79cf0' },
  { id: 'x', nome: 'Raios-X', cor: '#9aa3ab' },
  { id: 'gama', nome: 'Raios gama', cor: '#1b1b1f' },
]
const ARCO_IRIS = ['#e5484d', '#f2994a', '#f2d94e', '#4caf6a', '#3a8fe0', '#8e5ad6']
const LARG = 1.6
const PASSO = 1.7

function Espectro({ destaque }: { destaque?: string }) {
  const onda = useMemo(
    () =>
      Array.from({ length: 360 }, (_, i) => {
        const u = i / 359
        const fase = Math.PI * 2 * (1.2 * u + 6.5 * u * u)
        return [-5.9 + u * 11.8, 3.1 + Math.sin(fase) * 0.42, 0] as V3
      }),
    [],
  )
  return (
    <>
      {FAIXAS.map((f, i) => {
        const x = -5.1 + i * PASSO
        const aceso = !destaque || destaque === f.id
        const cinza = '#cfd3d8'
        return (
          <group key={f.id}>
            {f.id === 'visivel' ? (
              ARCO_IRIS.map((c, k) => (
                <Caixa
                  key={c}
                  tam={[LARG / 6, 0.6, 0.9]}
                  pos={[x - LARG / 2 + (k + 0.5) * (LARG / 6), 0.5, 0]}
                  cor={aceso ? c : cinza}
                  emissivo={aceso && destaque ? c : undefined}
                  intensidade={0.7}
                  opacidade={aceso ? undefined : 0.5}
                />
              ))
            ) : (
              <Caixa
                tam={[LARG, 0.6, 0.9]}
                pos={[x, 0.5, 0]}
                cor={aceso ? f.cor : cinza}
                emissivo={aceso && destaque ? f.cor : undefined}
                intensidade={0.7}
                opacidade={aceso ? undefined : 0.5}
              />
            )}
            <Rotulo pos={[x, i % 2 ? 1.6 : 1.15, 0]} classe="mini" apagado={!aceso}>
              {f.nome}
            </Rotulo>
          </group>
        )
      })}
      <Line points={onda} color="#3b6fb5" lineWidth={3} />
      <Rotulo pos={[-5.4, 3.9, 0]} classe="mini">
        baixa frequência
      </Rotulo>
      <Rotulo pos={[5.4, 3.9, 0]} classe="mini">
        alta frequência
      </Rotulo>
      <Seta de={[-5.5, 0.05, 1.3]} para={[5.5, 0.05, 1.3]} cor="#3b6fb5" raio={0.05} />
      <Rotulo pos={[0, 0.1, 2.0]} escuro>
        frequência →
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Terra, torres, ionosfera

const R = 11
const TOPO = 2.2
const surf = (x: number) => TOPO - R + Math.sqrt(R * R - x * x)
const XT = 4.2
const ESC_TORRE = 0.45

function Terra() {
  const geo = useMemo(() => {
    const s = new Shape()
    s.moveTo(-6.2, -0.3)
    s.lineTo(6.2, -0.3)
    for (let i = 0; i <= 40; i++) {
      const x = 6.2 - (i / 40) * 12.4
      s.lineTo(x, surf(x))
    }
    s.closePath()
    return new ExtrudeGeometry(s, { depth: 3, bevelEnabled: false })
  }, [])
  return (
    <mesh geometry={geo} position={[0, 0, -1.5]} receiveShadow>
      <meshStandardMaterial color="#3f9d8f" roughness={0.8} flatShading />
    </mesh>
  )
}

function Torre({ x }: { x: number }) {
  const phi = Math.asin(x / R)
  return <EstacaoBase pos={[x, surf(x), 0]} rot={[0, 0, -phi]} escala={ESC_TORRE} />
}

function Torres() {
  return (
    <>
      <Torre x={-XT} />
      <Torre x={XT} />
    </>
  )
}

const ANTENA = 1.3

function Baixa() {
  const pontos = useMemo(
    () => Array.from({ length: 13 }, (_, i) => -XT + (i / 12) * 2 * XT).map((x) => [x, surf(x) + ANTENA, 0] as V3),
    [],
  )
  const curva = useCurva(pontos)
  return (
    <>
      <Terra />
      <Torres />
      <Line points={pontos} color="#ffd23f" lineWidth={2} dashed dashSize={0.2} gapSize={0.15} />
      <Pulsos curva={curva} cor="#ffb300" quantidade={6} duracao={3.2} tamanho={0.12} />
      <Rotulo pos={[0, 1.1, 1.6]} classe="mini" escuro>
        Terra
      </Rotulo>
      <Rotulo pos={[0, 0.3, 2.4]} classe="grande">
        Baixa frequência: segue a curvatura da Terra
      </Rotulo>
    </>
  )
}

const R2 = 12.6
const CY = TOPO - R
const iono = (x: number) => CY + Math.sqrt(R2 * R2 - x * x)

function Ionosfera() {
  const geo = useMemo(() => {
    const s = new Shape()
    const N = 40
    for (let i = 0; i <= N; i++) {
      const x = -6 + (i / N) * 12
      if (i === 0) s.moveTo(x, iono(x) + 0.3)
      else s.lineTo(x, iono(x) + 0.3)
    }
    for (let i = N; i >= 0; i--) {
      const x = -6 + (i / N) * 12
      s.lineTo(x, iono(x))
    }
    s.closePath()
    return new ExtrudeGeometry(s, { depth: 3, bevelEnabled: false })
  }, [])
  return (
    <mesh geometry={geo} position={[0, 0, -1.5]}>
      <meshStandardMaterial color="#9b7ae0" transparent opacity={0.45} depthWrite={false} roughness={0.5} />
    </mesh>
  )
}

function Alta() {
  const pontos = useMemo(() => {
    const A: V3 = [-XT, surf(XT) + ANTENA, 0]
    const P: V3 = [0, iono(0) - 0.05, 0]
    const B: V3 = [XT, surf(XT) + ANTENA, 0]
    const lerp = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0]
    const sobe = Array.from({ length: 8 }, (_, i) => lerp(A, P, i / 8))
    const desce = Array.from({ length: 9 }, (_, i) => lerp(P, B, i / 8))
    return [...sobe, ...desce]
  }, [])
  const curva = useCurva(pontos)
  return (
    <>
      <Terra />
      <Torres />
      <Ionosfera />
      <Line points={pontos} color="#ffd23f" lineWidth={2} dashed dashSize={0.2} gapSize={0.15} />
      <Pulsos curva={curva} cor="#ffb300" quantidade={6} duracao={3.2} tamanho={0.12} />
      <Rotulo pos={[5.2, 3.5, 0]} classe="mini">
        Ionosfera
      </Rotulo>
      <Rotulo pos={[0, 0.3, 2.4]} classe="grande">
        Alta frequência: reflete na ionosfera
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Micro-ondas

function Parabolica({ x, lado }: { x: number; lado: 1 | -1 }) {
  // lado 1: abre para +x (antena da esquerda); lado -1: abre para -x
  return (
    <group position={[x, 0, 0]}>
      <Cilindro raio={0.07} altura={0.9} pos={[0, 1.45, 0]} cor="#8e99a6" />
      <Cilindro raio={0.75} raioBase={0.12} altura={0.3} rot={[0, 0, -lado * (Math.PI / 2)]} pos={[0, 1.9, 0]} cor="#e7ebf0" />
      <Cilindro raio={0.04} altura={0.5} rot={[0, 0, Math.PI / 2]} pos={[lado * 0.3, 1.9, 0]} cor="#2d3540" />
    </group>
  )
}

function Gotas() {
  const g = useRef<Group>(null)
  useFrame(({ clock }) => {
    g.current?.children.forEach((c, i) => {
      const u = (clock.elapsedTime * 0.8 + i * 0.37) % 1
      c.position.y = 2.9 - u * 0.75
      c.visible = u < 0.95
    })
  })
  const xs = [-0.6, -0.3, 0, 0.3, 0.6, -0.45, 0.15, 0.45]
  return (
    <group ref={g}>
      {xs.map((x, i) => (
        <group key={i} position={[x, 2.9, (i % 3) * 0.2 - 0.2]}>
          <Cilindro raio={0.03} altura={0.18} cor="#3a8fe0" sombra={false} />
        </group>
      ))}
    </group>
  )
}

function Microondas() {
  const pontos: V3[] = [[-3.6, 1.9, 0], [-1.2, 1.9, 0], [1.2, 1.9, 0], [3.6, 1.9, 0]]
  const curva = useCurva(pontos)
  return (
    <>
      {[-4.4, 4.4].map((x) => (
        <Cilindro key={x} raio={0.5} raioBase={2} altura={1.0} lados={20} pos={[x, 0.5, 0]} cor="#6aa86a" />
      ))}
      <Parabolica x={-4.4} lado={1} />
      <Parabolica x={4.4} lado={-1} />
      <Line points={pontos} color="#e5484d" lineWidth={2.5} />
      <Pulsos curva={curva} cor="#ffb300" quantidade={5} duracao={2} tamanho={0.1} />
      {/* nuvem com chuva */}
      <Esfera raio={0.5} pos={[-0.45, 3.3, 0]} cor="#ffffff" />
      <Esfera raio={0.65} pos={[0.1, 3.4, 0]} cor="#ffffff" />
      <Esfera raio={0.5} pos={[0.7, 3.3, 0]} cor="#ffffff" />
      <Gotas />
      <Rotulo pos={[0, 4.15, 0]} classe="mini" escuro>
        acima de 10 GHz: absorção pela água
      </Rotulo>
      <Rotulo pos={[0, 0.3, 1.8]} classe="grande">
        Micro-ondas: acima de 1 GHz, linha reta
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Infravermelho

function Infravermelho() {
  const livre = useCurva([[-3.9, 0.85, 2.0], [-2.7, 0.85, 2.0], [-1.5, 0.85, 2.0], [-0.5, 0.85, 2.0]])
  const bloqueado = useCurva([[-1.0, 0.85, -2.0], [0.2, 0.85, -2.0], [1.4, 0.85, -2.0], [2.9, 0.85, -2.0]])
  return (
    <>
      {/* caminho livre */}
      <Notebook pos={[-5, 0.12, 2]} rot={[0, Math.PI / 2, 0]} escala={0.9} />
      <Impressora pos={[0.1, 0.12, 2]} rot={[0, -Math.PI / 2, 0]} escala={1.1} />
      <Line points={[[-3.9, 0.85, 2], [-0.5, 0.85, 2]]} color="#e5484d" lineWidth={3} dashed dashSize={0.25} gapSize={0.18} />
      <Pulsos curva={livre} cor="#e5484d" quantidade={4} duracao={1.8} tamanho={0.09} alongado />
      <Rotulo pos={[-2.2, 1.7, 2]} classe="mini">
        imprime normalmente
      </Rotulo>

      {/* caminho bloqueado */}
      <Notebook pos={[-2.3, 0.12, -2]} rot={[0, Math.PI / 2, 0]} escala={0.9} />
      <Caixa tam={[0.4, 2, 2.2]} pos={[3.2, 1, -2]} cor="#a6a29a" />
      <Impressora pos={[5.2, 0.12, -2]} rot={[0, -Math.PI / 2, 0]} escala={1.1} />
      <Line points={[[-1.0, 0.85, -2], [2.9, 0.85, -2]]} color="#e5484d" lineWidth={3} dashed dashSize={0.25} gapSize={0.18} />
      <Pulsos curva={bloqueado} cor="#e5484d" quantidade={4} duracao={1.8} tamanho={0.09} alongado />
      <Rotulo pos={[3.2, 2.7, -2]} classe="mini" escuro>
        não atravessa objetos sólidos
      </Rotulo>
      <Rotulo pos={[0, 3.6, 0]} classe="grande">
        Infravermelho
      </Rotulo>
    </>
  )
}

export function CenaEspectro(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'semfio'
  const destaque = cena.estado.destaque as string | undefined
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'semfio' && <SemFio />}
      {modo === 'espectro' && <Espectro destaque={destaque} />}
      {modo === 'baixa' && <Baixa />}
      {modo === 'alta' && <Alta />}
      {modo === 'microondas' && <Microondas />}
      {modo === 'infravermelho' && <Infravermelho />}
    </>
  )
}
