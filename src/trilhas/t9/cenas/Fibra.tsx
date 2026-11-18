import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { Alvo, Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Seta } from '../../t5/cenas/comum'
import type { CenaProps } from '../../../engine/tipos'

// Fase 9.4 — Fibra ótica (Aula 08 p. 11-14).
// 'camadas', 'luz', 'multimodo', 'monomodo', 'comparar'.

// ---------------------------------------------------------------- camadas

const CAMADAS = [
  { id: 'revestimento', nome: 'Revestimento externo', r: 0.8, fim: -1.5, cor: '#3a3f45', x: -3.5, dy: 0.95 },
  { id: 'capa', nome: 'Capa', r: 0.6, fim: 0.5, cor: '#f2b134', x: -0.5, dy: 0.5 },
  { id: 'casca', nome: 'Casca', r: 0.42, fim: 2.5, cor: '#f4f6f8', x: 1.5, dy: 0.5 },
  { id: 'nucleo', nome: 'Núcleo', r: 0.18, fim: 4.6, cor: '#7ccfff', x: 3.6, dy: 0.5 },
]
const XI = -5.5
const YC = 1.6

function Camadas({ cena, semNomes }: { cena: CenaProps; semNomes: boolean }) {
  return (
    <>
      {CAMADAS.map((c) => {
        const nucleo = c.id === 'nucleo'
        return (
          <group key={c.id}>
            <Cilindro
              raio={c.r}
              altura={c.fim - XI}
              lados={24}
              rot={[0, 0, Math.PI / 2]}
              pos={[(c.fim + XI) / 2, YC, 0]}
              cor={c.cor}
              emissivo={nucleo ? '#7ccfff' : undefined}
              intensidade={0.7}
              opacidade={nucleo ? 0.85 : undefined}
              sombra={!nucleo}
            />
            {!semNomes && <Rotulo pos={[c.x, YC + c.r + c.dy, 0]}>{c.nome}</Rotulo>}
            <Alvo id={c.id} pos={[c.x, YC, c.r + 0.15]} cena={cena} />
          </group>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------- luz

const BITS = [1, 0, 1, 1, 0, 1, 0, 0]
const T_BIT = 0.9
const VIAGEM = 3.6
const XF0 = -3.2
const XF1 = 3.2
const YF = 1.0
const POOL = 6
const COR_LUZ = '#ff6b5a'

function Luz() {
  const pulsos = useRef<(Mesh | null)[]>([])
  const led = useRef<MeshStandardMaterial>(null)
  const rec = useRef<MeshStandardMaterial>(null)
  const [bit, setBit] = useState(BITS[0])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const kMax = Math.floor(t / T_BIT)
    for (let j = 0; j < POOL; j++) {
      const m = pulsos.current[j]
      if (!m) continue
      const k = kMax - j
      const u = (t - k * T_BIT) / VIAGEM
      const aceso = k >= 0 && BITS[k % BITS.length] === 1
      m.visible = aceso && u >= 0 && u < 1
      if (m.visible) m.position.set(XF0 + (XF1 - XF0) * u, YF, 0)
    }
    // fonte: acesa durante o início do slot do bit 1
    const fase = (t % T_BIT) / T_BIT
    const emite = BITS[kMax % BITS.length] === 1 && fase < 0.6
    if (led.current) led.current.emissiveIntensity = emite ? 1.8 : 0.05
    // receptor: o bit que acabou de chegar
    const kr = Math.floor((t - VIAGEM) / T_BIT)
    const recebido = kr >= 0 ? BITS[kr % BITS.length] : 0
    const ur = kr >= 0 ? (t - VIAGEM - kr * T_BIT) / T_BIT : 1
    if (rec.current) rec.current.emissiveIntensity = recebido === 1 && ur < 0.6 ? 1.8 : 0.05
    if (kr >= 0 && recebido !== bit) setBit(recebido)
  })
  return (
    <>
      <Seta de={[-5.7, YF, 0]} para={[-4.7, YF, 0]} cor="#f2b134" raio={0.07} />
      <Rotulo pos={[-5.2, YF + 0.6, 0]} classe="mini">Sinal elétrico</Rotulo>

      <Caixa tam={[1.0, 0.8, 0.8]} pos={[-3.75, YF, 0]} cor="#5b6673" />
      <mesh position={[-3.2, YF, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial ref={led} color={COR_LUZ} emissive={COR_LUZ} emissiveIntensity={0.05} />
      </mesh>
      <Rotulo pos={[-3.75, YF + 0.75, 0]} classe="mini">Fonte de luz</Rotulo>

      <Cilindro raio={0.12} altura={XF1 - XF0} lados={16} rot={[0, 0, Math.PI / 2]} pos={[0, YF, 0]} cor="#7ccfff" emissivo="#7ccfff" intensidade={0.4} opacidade={0.5} sombra={false} />
      {Array.from({ length: POOL }, (_, j) => (
        <mesh key={j} ref={(m) => { pulsos.current[j] = m }} scale={[0.4, 0.15, 0.15]} visible={false}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial color={COR_LUZ} emissive={COR_LUZ} emissiveIntensity={1.6} />
        </mesh>
      ))}
      <Rotulo pos={[0, YF + 0.55, 0]} classe="mini">Fibra óptica</Rotulo>

      <Caixa tam={[1.0, 0.8, 0.8]} pos={[3.75, YF, 0]} cor="#5b6673" />
      <mesh position={[3.2, YF, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial ref={rec} color={COR_LUZ} emissive={COR_LUZ} emissiveIntensity={0.05} />
      </mesh>
      <Rotulo pos={[3.75, YF + 0.75, 0]} classe="mini">Receptor de luz</Rotulo>
      <Rotulo pos={[3.75, YF - 0.75, 0]} classe="grande">{bit}</Rotulo>

      <Seta de={[4.7, YF, 0]} para={[5.7, YF, 0]} cor="#f2b134" raio={0.07} />
      <Rotulo pos={[5.2, YF + 0.6, 0]} classe="mini">Sinal elétrico</Rotulo>

      <Rotulo pos={[-2.2, 3.0, 0]}>Luz transmitida = 1</Rotulo>
      <Rotulo pos={[2.2, 3.0, 0]}>Luz não transmitida = 0</Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- modos

/** Posição ao longo de uma poligonal, com u em [0, 1]. */
function naPoligonal(p: V3[], u: number): V3 {
  const f = Math.min(0.9999, Math.max(0, u)) * (p.length - 1)
  const i = Math.floor(f)
  const s = f - i
  return [p[i][0] + (p[i + 1][0] - p[i][0]) * s, p[i][1] + (p[i + 1][1] - p[i][1]) * s, 0]
}

function Modo({ y, r, multi, nome, x0 = -4.5, x1 = 4.5 }: { y: number; r: number; multi: boolean; nome?: string; x0?: number; x1?: number }) {
  const pontos = useMemo<V3[]>(() => {
    if (!multi) return [[x0, y, 0], [x1, y, 0]]
    const n = 8
    return Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y + (i % 2 ? 1 : -1) * (r - 0.06) * (i === 0 ? 0.2 : 1), 0] as V3)
  }, [y, r, multi, x0, x1])
  const bolas = useRef<(Group | null)[]>([])
  useFrame(({ clock }) => {
    bolas.current.forEach((b, i) => {
      if (!b) return
      const u = (clock.elapsedTime / 3.2 + i / 3) % 1
      const [px, py] = naPoligonal(pontos, u)
      b.position.set(px, py, 0)
    })
  })
  return (
    <>
      <Cilindro raio={r} altura={x1 - x0} lados={24} rot={[0, 0, Math.PI / 2]} pos={[(x0 + x1) / 2, y, 0]} cor="#9fd8ff" opacidade={0.32} emissivo="#7ccfff" intensidade={0.25} sombra={false} />
      <Line points={pontos} color={COR_LUZ} lineWidth={2.5} />
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(g) => { bolas.current[i] = g }}>
          <mesh>
            <sphereGeometry args={[multi ? 0.1 : 0.07, 12, 12]} />
            <meshStandardMaterial color={COR_LUZ} emissive={COR_LUZ} emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}
      {nome && <Rotulo pos={[0, y + r + 0.55, 0]} classe="grande">{nome}</Rotulo>}
    </>
  )
}

const MMF = 'Multímodo (MMF) · núcleo maior'
const SMF = 'Monomodo (SMF) · núcleo menor'

export function CenaFibra(cena: CenaProps) {
  const e = cena.estado
  const modo = typeof e.modo === 'string' ? e.modo : 'camadas'
  const semNomes = !!e.semNomes
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'camadas' && <Camadas cena={cena} semNomes={semNomes} />}
      {modo === 'luz' && <Luz />}
      {modo === 'multimodo' && <Modo y={1.6} r={0.9} multi nome={semNomes ? undefined : MMF} />}
      {modo === 'monomodo' && <Modo y={1.6} r={0.22} multi={false} nome={semNomes ? undefined : SMF} />}
      {modo === 'comparar' && (
        <>
          <Modo y={2.7} r={0.6} multi nome={semNomes ? undefined : MMF} />
          <Modo y={0.7} r={0.12} multi={false} nome={semNomes ? undefined : SMF} />
        </>
      )}
    </>
  )
}
