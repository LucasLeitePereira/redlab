import type { CenaProps } from '../../../engine/tipos'
import { Alvo, Caixa, Cilindro, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Celular, EstacaoBase, PontoDeAcesso } from '../../../three/modelos'
import { Elipse } from '../../t8/cenas/comum'

// Fase 9.7: faixas ISM e classificação por abrangência (Aula 08 p. 22).
// Modos: 'faixas' (estado semBanda esconde os "BW ..."), 'abrangencia' (estado semNomes esconde os nomes).

type Bloco = { bw: number; rotuloBw: string; faixa: string; cor: string; grupo: number }
const BLOCOS: Bloco[] = [
  { bw: 26, rotuloBw: 'BW 26 MHz', faixa: '902–928 MHz', cor: '#a57ce0', grupo: 0 },
  { bw: 83.5, rotuloBw: 'BW 83,5 MHz', faixa: '2,4–2,4835 GHz', cor: '#3a8fe0', grupo: 1 },
  { bw: 100, rotuloBw: 'BW 100 MHz', faixa: '5,15–5,25 GHz', cor: '#4caf6a', grupo: 2 },
  { bw: 100, rotuloBw: 'BW 100 MHz', faixa: '5,25–5,35 GHz', cor: '#5cc07a', grupo: 2 },
  { bw: 255, rotuloBw: 'BW 255 MHz', faixa: '5,47–5,725 GHz', cor: '#3f9d5c', grupo: 2 },
  { bw: 125, rotuloBw: 'BW 125 MHz', faixa: '5,725–5,85 GHz', cor: '#6fcf8a', grupo: 2 },
]
const GRUPOS = ['900 MHz', '2,4 GHz', '5 GHz']

function Faixas({ semBanda }: { semBanda: boolean }) {
  // posições: largura proporcional à banda; folga maior entre grupos
  const larg = BLOCOS.map((b) => Math.max(0.45, b.bw * 0.012))
  const x: number[] = []
  let cursor = 0
  BLOCOS.forEach((b, i) => {
    if (i > 0) cursor += b.grupo === BLOCOS[i - 1].grupo ? 0.15 : 0.9
    x.push(cursor + larg[i] / 2)
    cursor += larg[i]
  })
  const desloc = -cursor / 2
  const cx = x.map((v) => v + desloc)
  const grupoCentro = GRUPOS.map((_, g) => {
    const idx = BLOCOS.map((b, i) => (b.grupo === g ? i : -1)).filter((i) => i >= 0)
    return (cx[idx[0]] - larg[idx[0]] / 2 + cx[idx[idx.length - 1]] + larg[idx[idx.length - 1]] / 2) / 2
  })
  return (
    <>
      <Caixa tam={[cursor + 0.6, 0.05, 1.2]} pos={[0, 0.03, 0]} cor="#e4e9ee" sombra={false} />
      {BLOCOS.map((b, i) => (
        <group key={i}>
          <Caixa tam={[larg[i], 1.2, 0.9]} pos={[cx[i], 0.65, 0]} cor={b.cor} />
          {!semBanda && (
            <Rotulo pos={[cx[i], i % 2 ? 2.4 : 1.9, 0]} classe="mini">
              {b.rotuloBw}
            </Rotulo>
          )}
          <Rotulo pos={[cx[i], 0.1, i % 2 ? 1.9 : 1.2]} classe="mini" escuro>
            {b.faixa}
          </Rotulo>
        </group>
      ))}
      {GRUPOS.map((g, k) => (
        <Rotulo key={g} pos={[grupoCentro[k], 3.2, 0]}>
          {g}
        </Rotulo>
      ))}
      <Rotulo pos={[0, 3.95, 0]} classe="grande">
        ISM: Industrial, Scientific e Medical
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Abrangência

const ANEIS = [
  { id: 'wpan', r: 1.3, cor: '#e8743b', nome: 'WPAN · Pessoal', rot: [0, 1.4, 0] as V3, alvo: [1.1, 1.4, 0] as V3 },
  { id: 'wlan', r: 2.7, cor: '#3a8fe0', nome: 'WLAN · Local', rot: [2.7, 0.35, 0] as V3, alvo: [3.4, 0.9, 0] as V3 },
  { id: 'wman', r: 4.1, cor: '#8e5ad6', nome: 'WMAN · Metropolitana', rot: [-4.1, 0.35, 0] as V3, alvo: [-4.1, 1.0, 0] as V3 },
  { id: 'wwan', r: 5.5, cor: '#2fa66a', nome: 'WWAN · Longa distância', rot: [3.9, 0.35, 3.9] as V3, alvo: [3.9, 1.0, 3.9] as V3 },
]

function Pessoa({ pos }: { pos: V3 }) {
  return (
    <group position={pos}>
      <Cilindro raio={0.14} raioBase={0.2} altura={0.5} pos={[0, 0.25, 0]} cor="#e8743b" />
      <Esfera raio={0.15} pos={[0, 0.65, 0]} cor="#f1c9a0" />
    </group>
  )
}

function Predio({ pos, alt }: { pos: V3; alt: number }) {
  return <Caixa tam={[0.55, alt, 0.55]} pos={[pos[0], alt / 2, pos[2]]} cor="#c8d1dc" />
}

function Abrangencia({ cena }: { cena: CenaProps }) {
  const nomes = !cena.estado.semNomes
  return (
    <>
      {ANEIS.map((a) => (
        <Elipse key={a.id} pos={[0, 0, 0]} rx={a.r} rz={a.r} cor={a.cor} y={0.06} />
      ))}

      {/* WPAN: pessoa com celular */}
      <Pessoa pos={[-0.4, 0, 0]} />
      <Celular pos={[0.3, 0, 0.1]} escala={0.9} />

      {/* WLAN: casa com ponto de acesso */}
      <group position={[-1.3, 0, -1.7]}>
        <Caixa tam={[0.9, 0.6, 0.8]} pos={[0, 0.3, 0]} cor="#f2d9b1" />
        <Cilindro raio={0} raioBase={0.75} altura={0.45} lados={4} rot={[0, Math.PI / 4, 0]} pos={[0, 0.82, 0]} cor="#c95a4a" />
        <PontoDeAcesso pos={[0.9, 0, 0.2]} escala={0.6} />
      </group>

      {/* WMAN: prédios e torre */}
      <Predio pos={[0.5, 0, -3.4]} alt={1.3} />
      <Predio pos={[1.3, 0, -3.2]} alt={1.9} />
      <Predio pos={[-0.3, 0, -3.3]} alt={0.9} />
      <EstacaoBase pos={[2.5, 0, -3.0]} escala={0.5} />

      {/* WWAN: globo */}
      <group position={[-1.5, 0, -4.7]}>
        <Cilindro raio={0.25} raioBase={0.4} altura={0.3} pos={[0, 0.15, 0]} cor="#8e99a6" />
        <Esfera raio={0.6} pos={[0, 0.95, 0]} cor="#3a8fe0" />
        <Esfera raio={0.2} pos={[0.3, 1.1, 0.35]} cor="#4caf6a" />
        <Esfera raio={0.16} pos={[-0.35, 0.8, 0.4]} cor="#4caf6a" />
      </group>

      {ANEIS.map((a) => (
        <group key={a.id}>
          {nomes && (
            <Rotulo pos={a.rot} classe="mini">
              {a.nome}
            </Rotulo>
          )}
          <Alvo id={a.id} pos={a.alvo} cena={cena} />
        </group>
      ))}
    </>
  )
}

export function CenaIsm(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'faixas'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'faixas' && <Faixas semBanda={!!cena.estado.semBanda} />}
      {modo === 'abrangencia' && <Abrangencia cena={cena} />}
    </>
  )
}
