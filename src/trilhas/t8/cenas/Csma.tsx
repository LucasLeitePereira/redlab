import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Group, Mesh } from 'three'
import { Caixa, Ilha, Rotulo } from '../../../three/base'
import { Computador } from '../../../three/modelos'
import { caixaUnitaria, material } from '../../../three/recursos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 8.4 — Acesso com contenção: CSMA/CD (Aula 07 p. 6–7).
// Um barramento horizontal; o sinal de cada estação se espalha pelo cabo nos dois sentidos.
// 'barramento': duas estações transmitem ao mesmo tempo e colidem.
// 'csma' com `etapa` 0..5: a figura do slide p. 7 (A na esquerda, B na direita).

const XA = -4.5
const XB = 4.5
const V = 4.5 // unidades por segundo (de tempo simulado)
const LIM = 5.2 // pontas do cabo
const AZUL = '#3b82c4'
const LARANJA = '#e8913a'
const VERMELHO = '#d93a3a'

type Estacao = { x: number; ini: number; fim: number; jam: number; cor: string }
type Trecho = { lo: number; hi: number; cor: string }

/** Trechos do cabo ocupados por cada estação no instante `t` (dados e jam, nos dois sentidos). */
function trechos(e: Estacao, t: number): Trecho[] {
  const saida: Trecho[] = []
  const parte = (a: number, b: number, cor: string) => {
    if (t <= a) return
    const d0 = V * Math.max(0, t - b)
    const d1 = V * (t - a)
    for (const s of [-1, 1]) {
      const p = e.x + s * d0
      const q = e.x + s * d1
      const lo = Math.max(-LIM, Math.min(p, q))
      const hi = Math.min(LIM, Math.max(p, q))
      if (hi - lo > 0.01) saida.push({ lo, hi, cor })
    }
  }
  parte(e.ini, e.fim, e.cor)
  if (Number.isFinite(e.fim) && e.jam > 0) parte(e.fim, e.fim + e.jam, VERMELHO)
  return saida
}

const MAX_BARRAS = 8
const MAX_ONDAS = 28

function Sinais({
  a,
  b,
  modo,
  tFinal,
  onEtapa,
  colisao,
}: {
  a: Estacao
  b: Estacao
  modo: 'fixo' | 'loop'
  tFinal: number
  /** Etapa do slide em que o tempo simulado está (para o rótulo). */
  onEtapa?: (n: number, t: number) => void
  colisao: RefObject<Group | null>
}) {
  const barras = useRef<(Mesh | null)[]>([])
  const ondas = useRef<(Mesh | null)[]>([])
  const inicio = useRef<number | null>(null)
  const ultima = useRef(-1)

  useFrame(({ clock }) => {
    if (inicio.current === null) inicio.current = clock.elapsedTime
    const real = clock.elapsedTime - inicio.current
    // 1 s simulado = 1,7 s reais; no modo fixo, anima os últimos 1,2 s simulados até a etapa
    const t = modo === 'loop' ? (real / 1.7) % tFinal : Math.min(tFinal, Math.max(0, tFinal - 1.2) + real / 1.7)
    if (onEtapa) {
      const n = t < 1.4 ? 1 : t < 2.0 ? 2 : t < 3.4 ? 3 : t < 4.4 ? 4 : 5
      if (n !== ultima.current) {
        ultima.current = n
        onEtapa(n, t)
      }
    }
    const ta = trechos(a, t)
    const tb = trechos(b, t)
    const todas = [...ta, ...tb]
    barras.current.forEach((m, i) => {
      if (!m) return
      const s = todas[i]
      m.visible = !!s
      if (!s) return
      m.position.set((s.lo + s.hi) / 2, 0.62, i < ta.length ? -0.12 : 0.12)
      m.scale.set(s.hi - s.lo, 0.1, 0.18)
      m.material = material({ cor: s.cor, emissivo: s.cor, intensidade: 0.5 })
    })
    // onde os sinais de A e de B se sobrepõem: sinal "ondulado"
    let lo = Infinity
    let hi = -Infinity
    for (const p of ta) for (const q of tb) {
      const l = Math.max(p.lo, q.lo)
      const h = Math.min(p.hi, q.hi)
      if (h - l > 0.05) {
        lo = Math.min(lo, l)
        hi = Math.max(hi, h)
      }
    }
    const tem = hi > lo
    ondas.current.forEach((m, i) => {
      if (!m) return
      m.visible = tem
      if (!tem) return
      const f = (i + 0.5) / MAX_ONDAS
      const x = lo + (hi - lo) * f
      m.position.set(x, 0.62 + Math.sin(x * 5 + t * 14) * 0.2, 0)
      m.scale.set(Math.max(0.05, (hi - lo) / MAX_ONDAS), 0.1, 0.3)
    })
    if (colisao.current) {
      colisao.current.visible = tem
      if (tem) colisao.current.position.set((lo + hi) / 2, 1.5, 0)
    }
  })

  return (
    <>
      {Array.from({ length: MAX_BARRAS }, (_, i) => (
        <mesh key={i} ref={(m) => { barras.current[i] = m }} geometry={caixaUnitaria} material={material({ cor: AZUL })} visible={false} />
      ))}
      {Array.from({ length: MAX_ONDAS }, (_, i) => (
        <mesh key={i} ref={(m) => { ondas.current[i] = m }} geometry={caixaUnitaria} material={material({ cor: VERMELHO, emissivo: VERMELHO, intensidade: 0.8 })} visible={false} />
      ))}
    </>
  )
}

function Estacoes({ meio }: { meio: boolean }) {
  const xs = meio ? [XA, -2.25, 0, 2.25, XB] : [XA, XB]
  const nomes = meio ? ['A', 'C', 'D', 'E', 'B'] : ['A', 'B']
  return (
    <>
      {xs.map((x, i) => (
        <group key={x}>
          <Computador pos={[x, 0.12, -2.2]} escala={0.5} />
          <Caixa tam={[0.07, 0.07, 1.6]} pos={[x, 0.42, -0.85]} cor="#6b7681" sombra={false} />
          <Rotulo pos={[x, 1.35, -2.2]} escuro={nomes[i] === 'A' || nomes[i] === 'B'}>
            {nomes[i]}
          </Rotulo>
        </group>
      ))}
      {/* o barramento com os terminadores nas pontas */}
      <Caixa tam={[10.6, 0.14, 0.14]} pos={[0, 0.42, 0]} cor="#8d99a6" />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Caixa tam={[0.3, 0.4, 0.3]} pos={[s * 5.45, 0.42, 0]} cor="#2d3540" />
          <Rotulo pos={[s * 5.45, 0.95, 0]} classe="mini">
            terminador
          </Rotulo>
        </group>
      ))}
    </>
  )
}

const ROTULOS = [
  '',
  'Início da Transmissão',
  'B detecta meio livre e inicia transmissão',
  'B detecta colisão',
  'A detecta colisão + sinal jam',
  'Estações esperam tempo aleatório',
]
const ORDINAL = ['', '1ª', '2ª', '3ª', '4ª', '5ª']
// instante simulado em que cada etapa fixa é mostrada
const T_ETAPA = [0, 1.0, 1.7, 2.3, 3.8, 6.2]

export function CenaCsma(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'barramento'
  const etapa = Number(cena.estado.etapa ?? 0)
  const semNomes = !!cena.estado.semNomes
  const colisao = useRef<Group>(null)
  const [et, setEt] = useState(etapa || 1)
  useEffect(() => setEt(etapa || 1), [etapa, modo])

  const csma = modo === 'csma'
  const A: Estacao = csma
    ? { x: XA, ini: 0, fim: 3.4, jam: 0.4, cor: AZUL }
    : { x: XA, ini: 0, fim: Infinity, jam: 0, cor: AZUL }
  const B: Estacao = csma
    ? { x: XB, ini: 1.4, fim: 2.0, jam: 0.4, cor: LARANJA }
    : { x: XB, ini: 0.3, fim: Infinity, jam: 0, cor: LARANJA }

  return (
    <>
      <Ilha raio={8.2} />
      <Estacoes meio={!csma} />
      <Sinais
        key={`${modo}-${etapa}`}
        a={A}
        b={B}
        modo={csma && etapa > 0 ? 'fixo' : 'loop'}
        tFinal={csma ? (etapa > 0 ? T_ETAPA[etapa] : 7.4) : 3.2}
        onEtapa={csma ? (n) => etapa === 0 && setEt(n) : undefined}
        colisao={colisao}
      />
      <group ref={colisao} visible={false}>
        <Rotulo pos={[0, 0, 0]} escuro classe="grande">
          colisão!
        </Rotulo>
      </group>

      {csma && (
        <>
          <Rotulo pos={[0, 3.3, 0]} classe="grande">
            {semNomes ? ORDINAL[et] : `${et}. ${ROTULOS[et]}`}
          </Rotulo>
          {et === 5 && (
            <>
              <Rotulo pos={[XA, 2.0, -2.2]} classe="mini">
                ⏱ 3 ms
              </Rotulo>
              <Rotulo pos={[XB, 2.0, -2.2]} classe="mini">
                ⏱ 8 ms
              </Rotulo>
            </>
          )}
        </>
      )}
      {!csma && (
        <Rotulo pos={[0, 3.3, 0]} classe="grande">
          Duas estações transmitem ao mesmo tempo
        </Rotulo>
      )}
    </>
  )
}
