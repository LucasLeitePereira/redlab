import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import type { CenaProps } from '../../../engine/tipos'
import { Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Computador, Notebook, Roteador } from '../../../three/modelos'
import { Cabo, Ondas, Pulsos, arco, curvaSuave, useCurva } from '../../../three/movimento'
import { esferaUnitaria, material } from '../../../three/recursos'
import { Seta } from '../../t5/cenas/comum'

// Fase 9.1 — Meio físico: cobre (Aula 08, p. 1–4).
// modos: 'intro' | 'corrente' | 'calor' | 'magnetismo' | 'inducao'

const LARANJA = '#ff9a2e'
const AZUL = '#3b82f6'
const Y_CABO = 1.5
const X0 = -4
const X1 = 4

/** Fileira de elétrons andando em x (dir = 1 para a direita, -1 para a esquerda). */
function Eletrons({ y, z = 0, cor, dir = 1, n = 9, vel = 1.2, raio = 0.1 }: { y: number; z?: number; cor: string; dir?: 1 | -1; n?: number; vel?: number; raio?: number }) {
  const refs = useRef<(Group | null)[]>([])
  const mat = useMemo(() => material({ cor, emissivo: cor, intensidade: 0.8 }), [cor])
  const comp = X1 - X0
  useFrame(({ clock }) => {
    refs.current.forEach((g, i) => {
      if (!g) return
      const u = (((clock.elapsedTime * vel) / comp + i / n) % 1)
      g.position.set(dir === 1 ? X0 + u * comp : X1 - u * comp, y, z)
    })
  })
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={(g) => { refs.current[i] = g }}>
          <mesh geometry={esferaUnitaria} material={mat} scale={raio} />
        </group>
      ))}
    </>
  )
}

function CaboCobre({ y = Y_CABO, raio = 0.45, opacidade = 0.4 }: { y?: number; raio?: number; opacidade?: number }) {
  return <Cilindro raio={raio} altura={X1 - X0 + 0.4} lados={24} pos={[0, y, 0]} rot={[0, 0, Math.PI / 2]} cor="#9aa3ad" opacidade={opacidade} sombra={false} />
}

function circulo(r: number, n = 40): V3[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [0, Math.cos(a) * r, Math.sin(a) * r] as V3
  })
}

/** Anéis tracejados azuis em volta do cabo (campo magnético), girando em torno do eixo x. */
function Aneis({ y, raios, xs }: { y: number; raios: number[]; xs: number[] }) {
  const refs = useRef<(Group | null)[]>([])
  const pts = useMemo(() => raios.map((r) => circulo(r)), [raios])
  useFrame(({ clock }) => {
    refs.current.forEach((g, i) => {
      if (g) g.rotation.x = clock.elapsedTime * (i % 2 ? -0.9 : 0.9)
    })
  })
  let k = 0
  return (
    <>
      {xs.map((x) =>
        pts.map((p, j) => {
          const idx = k++
          return (
            <group key={`${x}-${j}`} position={[x, y, 0]} ref={(g) => { refs.current[idx] = g }}>
              <Line points={p} color={AZUL} lineWidth={2.2} dashed dashSize={0.18} gapSize={0.12} />
            </group>
          )
        }),
      )}
    </>
  )
}

/** Seta de calor: cone laranja-avermelhado que sobe (ou desce) e some. */
function SetasDeCalor() {
  const xs = [-3, -1.8, -0.6, 0.6, 1.8, 3]
  const refs = useRef<(Group | null)[]>([])
  useFrame(({ clock }) => {
    refs.current.forEach((g, i) => {
      if (!g) return
      const cima = i % 2 === 0
      const col = Math.floor(i / 2)
      const u = (clock.elapsedTime * 0.7 + col * 0.23 + (cima ? 0 : 0.5)) % 1
      const d = 0.55 + u * 0.95
      g.position.y = Y_CABO + (cima ? d : -d)
      g.position.x = xs[col] + Math.sin(clock.elapsedTime * 4 + i) * 0.05
      g.scale.setScalar(Math.max(0.01, 1 - u * 0.7))
    })
  })
  const itens = xs.flatMap((_, c) => [c * 2, c * 2 + 1])
  return (
    <>
      {itens.map((i) => (
        <group key={i} ref={(g) => { refs.current[i] = g }} rotation={[0, 0, i % 2 === 0 ? 0 : Math.PI]}>
          <Cilindro raio={0.025} altura={0.3} pos={[0, -0.12, 0]} cor="#ff6a3d" emissivo="#ff6a3d" intensidade={0.8} sombra={false} />
          <Cilindro raio={0} raioBase={0.09} altura={0.2} lados={8} pos={[0, 0.1, 0]} cor="#ff4a2a" emissivo="#ff4a2a" intensidade={0.8} sombra={false} />
        </group>
      ))}
    </>
  )
}

function PulsoQuadrado({ x, altura, texto, cor }: { x: number; altura: number; texto: string; cor: string }) {
  return (
    <group>
      <Caixa tam={[0.9, 0.06, 0.3]} pos={[x, 0.45, 0]} cor="#5a6570" sombra={false} />
      <Caixa tam={[0.5, altura, 0.3]} pos={[x, 0.48 + altura / 2, 0]} cor={cor} emissivo={cor} intensidade={0.4} />
      <Rotulo pos={[x, 0.7 + altura, 0]}>{texto}</Rotulo>
    </group>
  )
}

function Calor() {
  return (
    <>
      <CaboCobre />
      <Seta de={[-3.6, Y_CABO, 0]} para={[3.6, Y_CABO, 0]} cor={LARANJA} raio={0.06} />
      <SetasDeCalor />
      <PulsoQuadrado x={-5.1} altura={1.9} texto="5 Watts" cor={LARANJA} />
      <PulsoQuadrado x={5.1} altura={1.0} texto="3 Watts" cor="#f5c26b" />
      <Rotulo pos={[0, 3.7, 0]} classe="grande" escuro>Atenuação elétrica</Rotulo>
    </>
  )
}

function Magnetismo() {
  return (
    <>
      <CaboCobre />
      <Seta de={[-3.6, Y_CABO, 0]} para={[3.6, Y_CABO, 0]} cor={LARANJA} raio={0.06} />
      <Aneis y={Y_CABO} raios={[1.2]} xs={[-3, -1.5, 0, 1.5, 3]} />
      <Rotulo pos={[0, 3.4, 0]} classe="grande" escuro>Campo magnético</Rotulo>
      <Rotulo pos={[-4.3, 0.6, 0.8]} classe="mini">Corrente elétrica</Rotulo>
    </>
  )
}

function Inducao() {
  const yA = 2.6
  const yB = 0.8
  return (
    <>
      <CaboCobre y={yA} raio={0.25} opacidade={0.5} />
      <Seta de={[-3.6, yA, 0]} para={[3.6, yA, 0]} cor={LARANJA} raio={0.045} />
      <Aneis y={yA} raios={[1.0, 1.5]} xs={[-2.6, 0, 2.6]} />
      <CaboCobre y={yB} raio={0.25} opacidade={0.5} />
      <Eletrons y={yB + 0.07} cor={LARANJA} dir={1} n={7} raio={0.07} />
      <Eletrons y={yB - 0.07} cor={AZUL} dir={-1} n={7} raio={0.07} vel={1.0} />
      <Rotulo pos={[-5, yA, 0]} classe="mini">Com corrente</Rotulo>
      <Rotulo pos={[-5, yB, 0]} classe="mini">Fio vizinho</Rotulo>
      <Rotulo pos={[0, 0.0, 1.2]} classe="grande" escuro>Ruído (indução magnética)</Rotulo>
    </>
  )
}

function Intro() {
  const pcs: V3[] = [[-4.6, 0, -2.4], [-4.6, 0, 0], [-4.6, 0, 2.4]]
  const notes: V3[] = [[4.6, 0, -1.4], [4.6, 0, 1.4]]
  const c1 = useCurva(curvaSuave([-0.5, 0.15, 0], [-3.5, 0.15, -2.4], 0.3))
  const c2 = useCurva(curvaSuave([-0.5, 0.15, 0], [-3.5, 0.15, 0], 0.0))
  const c3 = useCurva(curvaSuave([-0.5, 0.15, 0], [-3.5, 0.15, 2.4], 0.3))
  const o1 = useCurva(arco([0.4, 0.5, 0], [3.5, 0.8, -1.4], 0.6))
  const o2 = useCurva(arco([0.4, 0.5, 0], [3.5, 0.8, 1.4], 0.6))
  return (
    <>
      <Roteador pos={[0, 0, 0]} />
      {pcs.map((p, i) => (
        <Computador key={i} pos={p} rot={[0, Math.PI / 2, 0]} escala={0.8} gabinete="esquerda" />
      ))}
      {[c1, c2, c3].map((c, i) => (
        <group key={i}>
          <Cabo curva={c} cor="#3b82c4" raio={0.05} />
          <Pulsos curva={c} cor={LARANJA} quantidade={3} duracao={2.4} />
        </group>
      ))}
      {notes.map((p, i) => (
        <Notebook key={i} pos={p} rot={[0, -Math.PI / 2, 0]} escala={0.9} />
      ))}
      <Ondas pos={[0, 0.9, 0]} cor="#4db7ff" raio={3.4} />
      {[o1, o2].map((c, i) => (
        <Pulsos key={i} curva={c} cor="#4db7ff" quantidade={3} duracao={2.4} alongado />
      ))}
      <Rotulo pos={[-4.4, 2.4, 0]} classe="grande" escuro>Meio guiado</Rotulo>
      <Rotulo pos={[4.4, 2.4, 0]} classe="grande" escuro>Meio não guiado</Rotulo>
    </>
  )
}

export function CenaCobre(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'intro'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'intro' && <Intro />}
      {modo === 'corrente' && (
        <>
          <CaboCobre />
          <Eletrons y={Y_CABO + 0.14} cor={LARANJA} n={9} />
          <Eletrons y={Y_CABO - 0.14} cor={LARANJA} n={9} vel={1.2} />
          <Rotulo pos={[0, 2.6, 0]} classe="grande" escuro>Elétrons</Rotulo>
          <Rotulo pos={[-4.7, 1.5, 0]} classe="mini">Cabo de cobre</Rotulo>
        </>
      )}
      {modo === 'calor' && <Calor />}
      {modo === 'magnetismo' && <Magnetismo />}
      {modo === 'inducao' && <Inducao />}
    </>
  )
}
