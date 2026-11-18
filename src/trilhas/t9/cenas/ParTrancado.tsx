import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { Alvo, Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Computador, Switch } from '../../../three/modelos'
import { Cabo, Pulsos, curvaSuave, useCurva } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Tabela3D, linha, type Col } from '../../t8/cenas/comum'

// Fase 9.3 — Par trançado (Aula 08 p. 8-10).
// 'tipos': UTP x STP em corte; 'cancelamento': a figura do slide; 'categorias': tabela EIA/TIA 568-A;
// 'estrela': 100BASE-T (estado `rompido`).

const PARES: { cor: string; nome: string }[] = [
  { cor: '#f08a24', nome: 'laranja' },
  { cor: '#3aa655', nome: 'verde' },
  { cor: '#3b6fd6', nome: 'azul' },
  { cor: '#8a5a3b', nome: 'marrom' },
]
const Y_CAPA = 1.2
const Y_TOPO = 3.2

/** Um fio do par: hélice em volta do eixo do par, que se abre para fora acima da capa. */
function Fio({ ang, fase, cor }: { ang: number; fase: number; cor: string }) {
  const pontos = useMemo(() => {
    const n = 70
    return Array.from({ length: n + 1 }, (_, i) => {
      const y = 1.0 + ((Y_TOPO - 1.0) * i) / n
      const R = 0.2 + Math.max(0, y - Y_CAPA) * 0.15
      const ph = (y / 0.4) * Math.PI * 2 + fase
      const cx = Math.cos(ang) * R + Math.cos(ph) * 0.05
      const cz = Math.sin(ang) * R + Math.sin(ph) * 0.05
      return [cx, y, cz] as V3
    })
  }, [ang, fase])
  const curva = useCurva(pontos)
  return <Cabo curva={curva} cor={cor} raio={0.035} />
}

function CaboCorte({ x, blindado }: { x: number; blindado: boolean }) {
  return (
    <group position={[x, 0, 0]}>
      <Cilindro raio={0.5} altura={1.1} lados={24} pos={[0, 0.65, 0]} cor="#d5dae0" />
      {blindado && <Cilindro raio={0.5} altura={1.15} lados={24} pos={[0, 1.775, 0]} cor="#cfd8e0" opacidade={0.5} emissivo="#e8eef4" intensidade={0.3} sombra={false} />}
      {PARES.map((p, k) => {
        const ang = k * (Math.PI / 2) + Math.PI / 4
        return (
          <group key={p.nome}>
            <Fio ang={ang} fase={0} cor={p.cor} />
            <Fio ang={ang} fase={Math.PI} cor="#f6f6f6" />
          </group>
        )
      })}
    </group>
  )
}

function Tipos({ cena }: { cena: CenaProps }) {
  return (
    <>
      <CaboCorte x={-3} blindado={false} />
      <CaboCorte x={3} blindado />
      <Rotulo pos={[-3, 3.9, 0]} classe="grande">UTP · sem blindagem</Rotulo>
      <Rotulo pos={[3, 3.9, 0]} classe="grande">STP · com blindagem</Rotulo>
      <Rotulo pos={[3, 0.1, 0.9]} classe="mini">malha / folha metálica</Rotulo>
      <Rotulo pos={[-3, 0.1, 0.9]} classe="mini">só a capa</Rotulo>
      <Alvo id="utp" pos={[-3, 1.4, 0.7]} cena={cena} />
      <Alvo id="stp" pos={[3, 1.4, 0.7]} cena={cena} />
    </>
  )
}

// ---------------------------------------------------------------- cancelamento

const X0 = -4
const X1 = 4
const A = 0.4
const sinal = (x: number) => A * Math.sin((x / 2) * Math.PI)
const ruido = (x: number) => 0.7 * Math.exp(-(((x - 2) / 0.22) ** 2))
const LINHAS = [
  { y: 2.9, cor: '#3b82c4', f: (x: number) => sinal(x) + ruido(x), nome: 'Par 1', pol: '+' },
  { y: 1.6, cor: '#8e5bd0', f: (x: number) => -sinal(x) + ruido(x), nome: 'Par 2', pol: '−' },
  { y: 0.3, cor: '#2f9e5b', f: (x: number) => sinal(x), nome: 'Cancelamento do ruído', pol: '' },
]

function curvaPontos(f: (x: number) => number, y: number, a = X0, b = X1): V3[] {
  const n = Math.round((b - a) * 20)
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = a + ((b - a) * i) / n
    return [x, y + f(x), 0] as V3
  })
}

function Cancelamento() {
  const pontos = useMemo(() => LINHAS.map((l) => curvaPontos(l.f, l.y)), [])
  const picos = useMemo(() => [curvaPontos(LINHAS[0].f, LINHAS[0].y, 1.3, 2.7), curvaPontos(LINHAS[1].f, LINHAS[1].y, 1.3, 2.7)], [])
  const alerta = useRef<Group>(null)
  const bolas = useRef<(Group | null)[]>([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (alerta.current) alerta.current.visible = t % 2.4 < 1.5
    const x = X0 + ((t * 1.6) % (X1 - X0))
    bolas.current.forEach((b, i) => {
      if (b) b.position.set(x, LINHAS[i].y + LINHAS[i].f(x), 0.05)
    })
  })
  return (
    <>
      {LINHAS.map((l, i) => (
        <group key={l.nome}>
          <Line points={pontos[i]} color={l.cor} lineWidth={3} />
          <Line points={[[X0, l.y, 0], [X1, l.y, 0]]} color="#9aa5b1" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
          <group ref={(g) => { bolas.current[i] = g }}>
            <mesh>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color={l.cor} emissive={l.cor} emissiveIntensity={0.9} />
            </mesh>
          </group>
          <Rotulo pos={[X0 + (i === 2 ? 1.35 : 0.6), l.y + 0.72, 0]} classe={i === 2 ? '' : 'mini'}>
            {l.pol ? `${l.nome} (${l.pol})` : l.nome}
          </Rotulo>
        </group>
      ))}
      <group ref={alerta}>
        {picos.map((p, i) => (
          <Line key={i} points={p} color="#e03a3a" lineWidth={5} />
        ))}
        <Rotulo pos={[2, LINHAS[0].y + 0.98, 0]} classe="mini">ruído</Rotulo>
        <Rotulo pos={[2, LINHAS[1].y + 0.98, 0]} classe="mini">ruído</Rotulo>
      </group>
      <Rotulo pos={[4.9, LINHAS[2].y, 0]} classe="mini">ruído anulado</Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- categorias

const COLS: Col[] = [
  { id: 'cat', titulo: 'Categoria' },
  { id: 'freq', titulo: 'Frequência' },
  { id: 'taxa', titulo: 'Taxa / Uso' },
]

const DADOS: [string, string, string, boolean?][] = [
  ['CAT1', '--', 'Cabo telefônico tradicional (voz)'],
  ['CAT2', 'até 4 MHz', 'Transmissão de dados'],
  ['CAT3', 'até 10 MHz', '10 Mbps (ETHERNET)'],
  ['CAT4', 'até 16 MHz', '20 Mbps (TOKEN RING)'],
  ['CAT5e', 'até 100 MHz', '100 Mbps (FAST ETHERNET)', true],
  ['CAT6', 'até 250 MHz', '1 Gbps (GIGA BIT ETHERNET)', true],
  ['CAT7', 'até 600 MHz', '10 Gbps'],
]

function Categorias({ semTaxa, semFreq }: { semTaxa: boolean; semFreq: boolean }) {
  const colunas = COLS.map((c) => ({ ...c, esconder: (c.id === 'taxa' && semTaxa) || (c.id === 'freq' && semFreq) }))
  const linhas = DADOS.map((d) => linha(colunas, [d[0], d[1], d[2]], !!d[3]))
  return <Tabela3D pos={[0, 2.2, 0]} colunas={colunas} linhas={linhas} titulo="EIA/TIA 568-A" largura={640} fonte={14} />
}

// ---------------------------------------------------------------- estrela

function Ligacao({ de, para }: { de: V3; para: V3 }) {
  const ida = useCurva(curvaSuave(de, para, 0.15))
  const volta = useCurva(curvaSuave(para, de, -0.15))
  return (
    <>
      <Cabo curva={ida} cor="#3b82c4" raio={0.06} />
      <Pulsos curva={ida} cor="#ffb02e" quantidade={3} duracao={1.8} tamanho={0.08} />
      <Pulsos curva={volta} cor="#ffd9a0" quantidade={2} duracao={2.2} tamanho={0.07} />
    </>
  )
}

function Estrela({ rompido }: { rompido: boolean }) {
  const Z = 0.4
  const reto = (de: V3, para: V3) => curvaSuave(de, para, 0, 2)
  const trecho1 = useCurva(reto([1.0, 0.12, Z], [2.0, 0.12, Z]))
  const trecho2 = useCurva(reto([2.9, 0.12, Z], [3.4, 0.12, Z]))
  return (
    <>
      <Switch pos={[0, 0, Z]} escala={1.3} />
      <Rotulo pos={[0, 0.75, Z]} classe="mini">Switch</Rotulo>

      <Computador pos={[-4.4, 0, Z]} rot={[0, Math.PI / 2, 0]} escala={0.9} gabinete="esquerda" />
      <Computador pos={[0, 0, -3.5]} escala={0.9} />
      <Computador pos={[4.4, 0, Z]} rot={[0, -Math.PI / 2, 0]} escala={0.9} tela={rompido ? '#e04b4b' : undefined} />

      <Ligacao de={[-1.0, 0.12, Z]} para={[-3.4, 0.12, Z]} />
      <Ligacao de={[0, 0.12, Z - 0.35]} para={[0, 0.12, -2.7]} />
      {rompido ? (
        <>
          <Cabo curva={trecho1} cor="#3b82c4" raio={0.06} />
          <Cabo curva={trecho2} cor="#3b82c4" raio={0.06} />
          <Caixa tam={[0.1, 0.16, 0.16]} pos={[2.0, 0.12, Z]} cor="#e03a3a" emissivo="#e03a3a" intensidade={0.6} sombra={false} />
          <Caixa tam={[0.1, 0.16, 0.16]} pos={[2.9, 0.12, Z]} cor="#e03a3a" emissivo="#e03a3a" intensidade={0.6} sombra={false} />
          <Rotulo pos={[2.45, 0.95, Z]} escuro>Rompimento do cabo</Rotulo>
        </>
      ) : (
        <Ligacao de={[1.0, 0.12, Z]} para={[3.4, 0.12, Z]} />
      )}
      <Rotulo pos={[0, 3.6, 0]} classe="grande">100BASE-T · topologia em estrela</Rotulo>
    </>
  )
}

export function CenaParTrancado(cena: CenaProps) {
  const e = cena.estado
  const modo = typeof e.modo === 'string' ? e.modo : 'tipos'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'tipos' && <Tipos cena={cena} />}
      {modo === 'cancelamento' && <Cancelamento />}
      {modo === 'categorias' && <Categorias semTaxa={!!e.semTaxa} semFreq={!!e.semFreq} />}
      {modo === 'estrela' && <Estrela rompido={!!e.rompido} />}
    </>
  )
}
