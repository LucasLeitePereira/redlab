import type { ReactNode } from 'react'
import type { CenaProps } from '../../../engine/tipos'
import { Alvo, Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Computador } from '../../../three/modelos'
import { Pulsos, useCurva } from '../../../three/movimento'
import { Seta } from '../../t5/cenas/comum'

// Fase 9.2 — Cabo coaxial (Aula 08, p. 5–7).
// modos: 'camadas' (semNomes) | 'barramento' (interrompido) | 'nomenclatura' (semCabo)

const DOURADO = '#e0b341'
const COBRE = '#c9873a'

function Camadas({ cena, nomes }: { cena: CenaProps; nomes: boolean }) {
  const y = 1.5
  const xf = 5.5
  const camada = (x0: number, raio: number, cor: string, extra?: ReactNode) => (
    <>
      <Cilindro raio={raio} altura={xf - x0} lados={24} pos={[(x0 + xf) / 2, y, 0]} rot={[0, 0, Math.PI / 2]} cor={cor} />
      {extra}
    </>
  )
  // malha: anéis finos em volta do condutor externo
  const malha = Array.from({ length: 10 }, (_, i) => -1.8 + i * 0.18)
  return (
    <>
      {camada(-5.5, 0.12, DOURADO)}
      {camada(-3.7, 0.35, '#f4f4f0')}
      {camada(
        -1.9,
        0.5,
        COBRE,
        malha.map((x) => (
          <Cilindro key={x} raio={0.515} altura={0.04} lados={24} pos={[x, y, 0]} rot={[0, 0, Math.PI / 2]} cor="#7a4a1c" sombra={false} />
        )),
      )}
      {camada(-0.1, 0.66, '#3a424b')}
      {nomes && (
        <>
          <Rotulo pos={[-4.6, 2.9, 0]}>Condutor interno</Rotulo>
          <Rotulo pos={[-2.8, 2.3, 0]}>Dielétrico</Rotulo>
          <Rotulo pos={[-1, 3.5, 0]}>Condutor externo</Rotulo>
          <Rotulo pos={[2.8, 2.9, 0]}>Invólucro externo</Rotulo>
        </>
      )}
      <Alvo id="interno" pos={[-4.6, y + 0.3, 0.4]} cena={cena} />
      <Alvo id="dieletrico" pos={[-2.8, y + 0.5, 0.4]} cena={cena} />
      <Alvo id="externo" pos={[-1, y + 0.7, 0.4]} cena={cena} />
      <Alvo id="involucro" pos={[2.8, y + 0.85, 0.4]} cena={cena} />
    </>
  )
}

function Barramento({ parou }: { parou: boolean }) {
  const y = 0.5
  const xs = [-3.9, -1.3, 1.3, 3.9]
  const dado = useCurva([[-5, y, 0], [0, y, 0], [5, y, 0]])
  const trecho = (a: number, b: number) => (
    <Cilindro raio={0.08} altura={b - a} pos={[(a + b) / 2, y, 0]} rot={[0, 0, Math.PI / 2]} cor="#2d3540" />
  )
  return (
    <>
      <Rotulo pos={[0, 4.0, 0]} classe="grande" escuro>10BASE2 · topologia em barra</Rotulo>
      {parou ? (
        <>
          {trecho(-5, -0.45)}
          {trecho(0.45, 5)}
          <Caixa tam={[0.1, 0.4, 0.4]} pos={[-0.45, y, 0]} cor="#e5484d" emissivo="#e5484d" intensidade={0.6} sombra={false} />
          <Caixa tam={[0.1, 0.4, 0.4]} pos={[0.45, y, 0]} cor="#e5484d" emissivo="#e5484d" intensidade={0.6} sombra={false} />
          <Rotulo pos={[0, 1.2, 0]}>Interrupção</Rotulo>
        </>
      ) : (
        <>
          {trecho(-5, 5)}
          <Pulsos curva={dado} cor="#ffd54a" quantidade={4} duracao={4} tamanho={0.14} />
        </>
      )}
      {[-5.15, 5.15].map((x) => (
        <Cilindro key={x} raio={0.2} altura={0.35} pos={[x, y, 0]} rot={[0, 0, Math.PI / 2]} cor="#222a33" />
      ))}
      <Rotulo pos={[-5.15, 1.0, 0]} classe="mini">Terminador</Rotulo>
      <Rotulo pos={[5.15, 1.0, 0]} classe="mini">Terminador</Rotulo>
      {xs.map((x) => (
        <group key={x}>
          <Cilindro raio={0.07} altura={1.7} pos={[x, y, 1.2]} rot={[Math.PI / 2, 0, 0]} cor="#7d8794" />
          <Cilindro raio={0.17} altura={0.3} pos={[x, y, 0]} rot={[Math.PI / 2, 0, 0]} cor="#4a5560" />
          <Computador pos={[x, 0, 2.3] as V3} escala={0.75} tela={parou ? '#e5484d' : '#4cc38a'} gabinete="direita" />
        </group>
      ))}
      <Rotulo pos={[-3.9, 0.9, 1.2]} classe="mini">Conector T</Rotulo>
    </>
  )
}

function Nomenclatura({ semCabo }: { semCabo: boolean }) {
  const cor = '#ff9a2e'
  return (
    <>
      <Rotulo pos={[-1.9, 3.7, 0]} classe="grande" escuro>10</Rotulo>
      <Rotulo pos={[0, 3.7, 0]} classe="grande" escuro>Base</Rotulo>
      <Rotulo pos={[1.8, 3.7, 0]} classe="grande" escuro>2</Rotulo>
      <Seta de={[-1.9, 3.2, 0]} para={[-3.9, 2.4, 0]} cor={cor} />
      <Seta de={[0, 3.2, 0]} para={[0, 2.4, 0]} cor={cor} />
      <Seta de={[1.8, 3.2, 0]} para={[3.9, 2.4, 0]} cor={cor} />
      <Rotulo pos={[-3.9, 1.7, 0]}>
        <b>10</b> → Largura de banda
        <br />
        10 Mbps
      </Rotulo>
      <Rotulo pos={[0, 1.7, 0]}>
        <b>Base</b> → Banda básica
        <br />
        sinal não é codificado
      </Rotulo>
      {semCabo ? (
        <Rotulo pos={[3.9, 1.7, 0]}>
          <b>2</b> → ?
        </Rotulo>
      ) : (
        <>
          <Rotulo pos={[3.9, 1.7, 0]}>
            <b>2</b> → Tipo de cabo
            <br />
            coaxial fino (185 m)
          </Rotulo>
          <Rotulo pos={[0, 0.6, 0]}>
            <b>10Base5</b> → coaxial grosso (500 m)
          </Rotulo>
        </>
      )}
    </>
  )
}

export function CenaCoaxial(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'camadas'
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'camadas' && <Camadas cena={cena} nomes={!cena.estado.semNomes} />}
      {modo === 'barramento' && <Barramento parou={!!cena.estado.interrompido} />}
      {modo === 'nomenclatura' && <Nomenclatura semCabo={!!cena.estado.semCabo} />}
    </>
  )
}
