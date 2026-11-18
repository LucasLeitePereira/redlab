import { Line } from '@react-three/drei'
import { Alvo, Caixa, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Wpan } from '../../t8/cenas/Wpan'
import { Elipse } from '../../t8/cenas/comum'
import { Seta } from '../../t5/cenas/comum'

// Fase 9.9 — Bluetooth (Aula 08 p. 25–28).
// 'conectividade': figura WPAN; 'single': mestre + 1 escravo; 'multi': mestre + 7 escravos
// (estado `oitavo`); 'scatternet': 3 piconets com 2 bridges; 'nome': origem do nome.

const MESTRE = '#1c3f8f'
const ESCRAVO = '#f2a03a'
const BRIDGE = '#e0453f'
const CINZA = '#9aa3ad'
const BT = '#2f7fd0'

function Haste({ de, para }: { de: V3; para: V3 }) {
  return <Line points={[de, para]} color="#4a5a6a" lineWidth={3} />
}

function Mestre({ pos, raio = 0.8 }: { pos: V3; raio?: number }) {
  return (
    <group>
      <Esfera raio={raio} pos={pos} cor={MESTRE} />
      <Rotulo pos={pos} classe="grande">M</Rotulo>
    </group>
  )
}

function Escravo({ pos, raio = 0.5, cor = ESCRAVO, letra = 'S' }: { pos: V3; raio?: number; cor?: string; letra?: string }) {
  return (
    <group>
      <Esfera raio={raio} pos={pos} cor={cor} />
      <Rotulo pos={pos} classe="mini">{letra}</Rotulo>
    </group>
  )
}

const M1: V3 = [-2.3, 1.6, 0]
const S1: V3 = [2.3, 1.6, 0]
const P1: V3 = [-1.4, 1.6, 0]
const P2: V3 = [1.7, 1.6, 0]

function Single() {
  return (
    <>
      <Mestre pos={M1} />
      <Escravo pos={S1} raio={0.6} />
      <Seta de={P1} para={P2} cor="#4a5a6a" raio={0.07} duasPontas />
      <Rotulo pos={[M1[0], 0.5, 0]} classe="mini">Mestre</Rotulo>
      <Rotulo pos={[S1[0], 0.7, 0]} classe="mini">Escravo</Rotulo>
      <Rotulo pos={[0, 3.4, 0]} classe="grande">Single Slave Operation</Rotulo>
    </>
  )
}

const CM: V3 = [0, 1.0, 0]
const anguloS = (i: number) => Math.PI / 2 + (i * Math.PI * 2) / 7 + 0.2
const posS = (i: number): V3 => [Math.cos(anguloS(i)) * 4.2, 1.0, Math.sin(anguloS(i)) * 2.8]
const OITAVO: V3 = [-5.2, 1.0, -3.6]

function Multi({ oitavo }: { oitavo: boolean }) {
  return (
    <>
      <Mestre pos={CM} />
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i}>
          <Haste de={CM} para={posS(i)} />
          <Escravo pos={posS(i)} raio={0.42} />
        </group>
      ))}
      {oitavo && (
        <group>
          <Escravo pos={OITAVO} raio={0.42} cor={CINZA} />
          <Caixa tam={[1.0, 0.12, 0.12]} pos={[OITAVO[0], OITAVO[1], OITAVO[2] + 0.5]} rot={[0, 0, Math.PI / 4]} cor="#d62f2f" sombra={false} />
          <Caixa tam={[1.0, 0.12, 0.12]} pos={[OITAVO[0], OITAVO[1], OITAVO[2] + 0.5]} rot={[0, 0, -Math.PI / 4]} cor="#d62f2f" sombra={false} />
          <Rotulo pos={[OITAVO[0], 2.0, OITAVO[2]]} classe="mini">não entra (máx. 7)</Rotulo>
        </group>
      )}
      <Rotulo pos={[0, 3.6, 0]} classe="grande">Multi Slave Operation · até 7 escravos</Rotulo>
    </>
  )
}

// piconets: [centro x, ângulos dos escravos]
const rad = (g: number) => (g * Math.PI) / 180
const PICO: { cx: number; angs: number[] }[] = [
  { cx: -3.7, angs: [90, 150, 210, 270].map(rad) },
  { cx: 0, angs: [60, 120, 240, 300, 90].map(rad) },
  { cx: 3.7, angs: [90, 30, -30, 270].map(rad) },
]
const Y = 0.7
const BRIDGES: V3[] = [[-1.85, Y, 0], [1.85, Y, 0]]

function Scatternet({ cena }: { cena: CenaProps }) {
  return (
    <>
      {PICO.map((p, k) => {
        const m: V3 = [p.cx, Y, 0]
        return (
          <group key={k}>
            <Elipse pos={[p.cx, 0, 0]} rx={2.1} rz={2.1} cor={BT} />
            <Rotulo pos={[p.cx, 0.1, -2.5]} classe="mini">Piconet {k + 1}</Rotulo>
            <Mestre pos={m} raio={0.5} />
            {p.angs.map((a, i) => {
              const s: V3 = [p.cx + Math.cos(a) * 1.25, Y, Math.sin(a) * 1.25]
              return (
                <group key={i}>
                  <Haste de={m} para={s} />
                  <Escravo pos={s} raio={0.3} />
                </group>
              )
            })}
          </group>
        )
      })}
      {BRIDGES.map((b, i) => (
        <group key={i}>
          <Haste de={[PICO[i].cx, Y, 0]} para={b} />
          <Haste de={[PICO[i + 1].cx, Y, 0]} para={b} />
          <Escravo pos={b} raio={0.34} cor={BRIDGE} />
          <Rotulo pos={[b[0], 1.5, 0.3]} classe="mini">BRIDGE</Rotulo>
        </group>
      ))}
      <Rotulo pos={[0, 3.2, -1]} classe="grande">Scatternet: conjunto de piconets</Rotulo>
      <Alvo id="mestre" pos={[PICO[1].cx, 1.5, 0]} cena={cena} />
      <Alvo id="bridge" pos={[BRIDGES[0][0], 1.2, 0.8]} cena={cena} />
    </>
  )
}

function Nome() {
  return (
    <>
      <Caixa tam={[2.4, 0.25, 2.4]} pos={[0, 0.12, 1.2]} cor={BT} />
      <Rotulo pos={[0, 0.6, 1.2]} classe="emoji">ᚼ ᛒ</Rotulo>
      <Rotulo pos={[0, 3.4, 0]} classe="grande">ᚼ (H) + ᛒ (B) = ✱ Bluetooth</Rotulo>
      <Rotulo pos={[0, 2.2, 0]} classe="grande">Rei Viking Harald Blatand</Rotulo>
    </>
  )
}

export function CenaBluetooth(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'conectividade'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'conectividade' && <Wpan />}
      {modo === 'single' && <Single />}
      {modo === 'multi' && <Multi oitavo={!!cena.estado.oitavo} />}
      {modo === 'scatternet' && <Scatternet cena={cena} />}
      {modo === 'nome' && <Nome />}
    </>
  )
}
