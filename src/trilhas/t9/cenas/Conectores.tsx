import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh, MeshBasicMaterial } from 'three'
import type { CenaProps } from '../../../engine/tipos'
import { Alvo, Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { PlacaDeRede } from '../../../three/modelos'
import { Pulsos, useCurva } from '../../../three/movimento'

// Fase 9.5: conectores de fibra e emendas (Aula 08 p. 14–17).
// Modos: 'conectores' (ST, SC, LC), 'fusao' (máquina de fusão), 'mecanica' (emenda com resina).
// Estado: semNomes (esconde os rótulos ST/SC/LC), tampa (tampa rosa no ST).

const AMARELO_FIBRA = '#f5d142'
const COBRE = '#b87333'

/** Cabo + bota saindo por baixo do conector (x, y da base do corpo). */
function CaboBaixo({ x, y, bota = '#2d3540', raio = 0.14 }: { x: number; y: number; bota?: string; raio?: number }) {
  return (
    <>
      <Cilindro raio={raio} raioBase={raio * 0.7} altura={0.5} pos={[x, y - 0.25, 0]} cor={bota} />
      <Cilindro raio={raio * 0.5} altura={y - 0.7} pos={[x, (y - 0.5) / 2 + 0.1, 0]} cor="#f2b134" />
    </>
  )
}

function ConectorST({ x, tampa }: { x: number; tampa: boolean }) {
  return (
    <group position={[x, 0, 0]}>
      <Cilindro raio={0.24} altura={0.8} pos={[0, 1.4, 0]} cor="#b9c2cc" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Cilindro key={i} raio={0.265} altura={0.05} pos={[0, 1.1 + i * 0.16, 0]} cor="#8f99a5" lados={14} />
      ))}
      <Caixa tam={[0.14, 0.06, 0.06]} pos={[0.29, 1.7, 0]} cor="#8f99a5" />
      <Caixa tam={[0.14, 0.06, 0.06]} pos={[-0.29, 1.7, 0]} cor="#8f99a5" />
      <Cilindro raio={0.08} altura={0.5} pos={[0, 2.05, 0]} cor="#f4f4f0" />
      {tampa && <Cilindro raio={0.13} raioBase={0.16} altura={0.62} pos={[0, 2.2, 0]} cor="#f08aa8" />}
      <CaboBaixo x={0} y={1.0} />
    </group>
  )
}

function ConectorSC({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Caixa tam={[0.5, 0.8, 0.5]} pos={[0, 1.4, 0]} cor="#3b82c4" />
      <Caixa tam={[0.3, 0.14, 0.52]} pos={[0, 1.85, 0]} cor="#2f6aa6" />
      <Caixa tam={[0.3, 0.2, 0.3]} pos={[0, 1.9, 0]} cor="#ffffff" />
      <Cilindro raio={0.09} altura={0.4} pos={[0, 2.1, 0]} cor="#ffffff" />
      <CaboBaixo x={0} y={1.0} />
    </group>
  )
}

function ConectorLC({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {[-0.17, 0.17].map((dx) => (
        <group key={dx}>
          <Caixa tam={[0.26, 0.6, 0.3]} pos={[dx, 1.3, 0]} cor="#d9c9a0" />
          <Caixa tam={[0.2, 0.1, 0.34]} pos={[dx, 1.65, 0]} cor="#6b7a3a" />
          <Cilindro raio={0.055} altura={0.35} pos={[dx, 1.85, 0]} cor="#f4f4f0" />
          <CaboBaixo x={dx} y={1.0} raio={0.09} />
        </group>
      ))}
      <Caixa tam={[0.62, 0.08, 0.1]} pos={[0, 1.5, 0.18]} cor="#6b7a3a" />
    </group>
  )
}

function Conectores({ cena }: { cena: CenaProps }) {
  const nomes = !cena.estado.semNomes
  const X = [-3.5, 0, 3.5]
  return (
    <>
      <PlacaDeRede pos={[0, 0.1, -3.6]} escala={2.4} />
      <ConectorST x={X[0]} tampa={!!cena.estado.tampa} />
      <ConectorSC x={X[1]} />
      <ConectorLC x={X[2]} />
      {nomes &&
        ['ST', 'SC', 'LC'].map((n, i) => (
          <Rotulo key={n} pos={[X[i], 3.0, 0]} classe="grande">
            {n}
          </Rotulo>
        ))}
      {['st', 'sc', 'lc'].map((id, i) => (
        <Alvo key={id} id={id} pos={[X[i] + 0.9, 2.6, 0.5]} cena={cena} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------- Fusão

const CICLO_FUSAO = 7
const Y_FIBRA = 1.75
const COMP = 3.2

function Fusao() {
  const esq = useRef<Group>(null)
  const dir = useRef<Group>(null)
  const brilho = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % CICLO_FUSAO
    let gap = 0
    let dy = 0
    let calor = 0
    if (t < 1.5) {
      const u = t / 1.5
      gap = 1.2 - 0.85 * u
      dy = 0.3 * (1 - u)
    } else if (t < 3) {
      gap = 0.35
      calor = (t - 1.5) / 1.5
    } else if (t < 3.8) {
      gap = 0.35 * (1 - (t - 3) / 0.8)
      calor = 1
    } else if (t < 5.4) {
      calor = 1 - (t - 3.8) / 1.6
    } else {
      const u = (t - 5.4) / 1.6
      gap = 1.2 * u
      dy = 0.3 * u
    }
    if (esq.current) esq.current.position.set(-gap / 2 - COMP / 2, Y_FIBRA + dy, 0)
    if (dir.current) dir.current.position.set(gap / 2 + COMP / 2, Y_FIBRA - dy, 0)
    const b = brilho.current
    if (b) {
      b.visible = calor > 0.02
      const s = 0.12 + calor * 0.22 + Math.sin(clock.elapsedTime * 30) * 0.03 * calor
      b.scale.setScalar(s)
      ;(b.material as MeshBasicMaterial).opacity = Math.min(1, calor * 1.2)
    }
  })
  return (
    <>
      <Caixa tam={[3.4, 1.2, 1.6]} pos={[0, 0.6, -0.5]} cor="#2f3640" />
      <Caixa tam={[3.2, 0.06, 1.4]} pos={[0, 1.23, -0.5]} cor="#232a33" />
      {/* tampa aberta, presa na borda de trás */}
      <group position={[0, 1.2, -1.3]} rotation={[-1.9, 0, 0]}>
        <Caixa tam={[3.2, 0.1, 1.3]} pos={[0, 0, 0.65]} cor="#3d4651" />
      </group>
      {/* telinha na frente */}
      <Caixa tam={[1.3, 0.6, 0.04]} pos={[0, 0.65, 0.32]} cor="#14301d" emissivo="#2bd66b" intensidade={0.5} sombra={false} />
      {/* suportes das fibras */}
      {[-1.3, 1.3].map((x) => (
        <Caixa key={x} tam={[0.5, 0.3, 0.5]} pos={[x, 1.41, 0]} cor="#8e99a6" />
      ))}
      <group ref={esq}>
        <Cilindro raio={0.05} altura={COMP} rot={[0, 0, Math.PI / 2]} cor={AMARELO_FIBRA} sombra={false} />
      </group>
      <group ref={dir}>
        <Cilindro raio={0.05} altura={COMP} rot={[0, 0, Math.PI / 2]} cor={AMARELO_FIBRA} sombra={false} />
      </group>
      <mesh ref={brilho} position={[0, Y_FIBRA, 0]} visible={false}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#ff8a2b" transparent opacity={0} depthWrite={false} />
      </mesh>
      <Rotulo pos={[0, 3.1, -0.5]} classe="grande">
        Máquina de fusão
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Emenda mecânica

function Mecanica() {
  const Y = 0.85
  const curva = useCurva(Array.from({ length: 9 }, (_, i) => [-4.5 + i * 1.125, Y, 0] as V3))
  return (
    <>
      {/* trilho translúcido */}
      <Caixa tam={[5, 0.6, 1]} pos={[0, Y, 0]} cor="#ffffff" opacidade={0.35} sombra={false} />
      <Cilindro raio={0.06} altura={4.0} rot={[0, 0, Math.PI / 2]} pos={[-2.5, Y, 0]} cor={AMARELO_FIBRA} />
      <Cilindro raio={0.06} altura={4.0} rot={[0, 0, Math.PI / 2]} pos={[2.5, Y, 0]} cor={AMARELO_FIBRA} />
      <Caixa tam={[1, 0.62, 1.04]} pos={[0, Y, 0]} cor={COBRE} opacidade={0.8} sombra={false} />
      <Pulsos curva={curva} cor="#fff27a" alongado duracao={2.6} quantidade={3} tamanho={0.1} />
      <Rotulo pos={[0, 1.9, 0]} classe="grande">
        Emenda mecânica (resina)
      </Rotulo>
      <Rotulo pos={[0, 0.2, 1.2]} classe="mini">
        resina
      </Rotulo>
    </>
  )
}

export function CenaConectores(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'conectores'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'conectores' && <Conectores cena={cena} />}
      {modo === 'fusao' && <Fusao />}
      {modo === 'mecanica' && <Mecanica />}
    </>
  )
}
