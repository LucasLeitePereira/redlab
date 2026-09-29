import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import { ExtrudeGeometry, Shape } from 'three'
import { Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 6.1 — surgimento da Internet (Aula 05 p2, p. 2). O mapa da ARPANET do slide: o
// território dos EUA em amarelo, os nós em vermelho e os links entre eles. Os modos mostram
// o objetivo (a rede continua ligada se um link cair), as tecnologias (linhas de 56 kbps,
// comutação de pacotes) e 1990, quando a ARPANET foi desativada e surgiu a Internet.

/** Contorno aproximado dos EUA, em (x, z) no chão (z positivo = sul, perto da câmera). */
const CONTORNO: [number, number][] = [
  [-5.6, -3.0], [-2.0, -3.0], [1.2, -3.0], [1.6, -2.4], [2.4, -2.0], [3.0, -2.3], [3.6, -2.6], [4.3, -3.2],
  [5.0, -3.3], [5.4, -2.8], [4.8, -2.2], [4.6, -1.6], [4.3, -1.1], [4.2, -0.4], [4.4, 0.3], [4.3, 0.6],
  [3.6, 1.4], [3.3, 2.0], [3.6, 3.0], [3.4, 3.5], [3.0, 3.2], [2.7, 2.3], [2.0, 2.1], [1.0, 2.2],
  [0.4, 2.4], [-0.4, 2.3], [-0.9, 2.9], [-1.3, 3.4], [-1.9, 2.8], [-2.4, 2.2], [-3.2, 2.3], [-4.3, 2.0],
  [-4.6, 2.1], [-5.3, 1.3], [-5.8, 0.3], [-6.0, -0.6], [-5.9, -1.8], [-5.7, -2.6],
]

const Y = 0.2
const NOS = {
  SRI: [-5.3, -1.2], AMES: [-5.6, -0.5], STAN: [-5.0, -0.1], UCSB: [-4.9, 0.9], UCLA: [-4.5, 1.3],
  RAND: [-5.0, 1.7], USC: [-4.3, 1.8], SDC: [-3.9, 1.4], UTAH: [-3.2, -1.0], AFWL: [-2.3, 1.6],
  DOCB: [-2.4, 0.1], GWC: [-1.4, -0.6], ILL: [0.4, 0.1], PURDUE: [0.9, -0.4], CASE: [1.9, -1.2],
  CARNEGIE: [3.0, -0.8], HARVARD: [4.2, -1.3], BBN: [4.5, -1.7], MIT: [4.6, -2.2], LINCOLN: [4.7, -2.7],
  MITRE: [3.8, 0.0], ARPA: [3.9, 0.4], NBS: [3.5, 0.7], RML: [3.2, 2.8],
} satisfies Record<string, [number, number]>
type No = keyof typeof NOS
const p = (n: No, h = Y): V3 => [NOS[n][0], h, NOS[n][1]]

const LINKS: [No, No][] = [
  ['SRI', 'AMES'], ['AMES', 'STAN'], ['STAN', 'UCSB'], ['SRI', 'UCSB'], ['UCSB', 'UCLA'], ['UCLA', 'RAND'],
  ['RAND', 'USC'], ['USC', 'SDC'], ['SDC', 'UCLA'], ['SRI', 'UTAH'], ['UTAH', 'GWC'], ['GWC', 'CASE'],
  ['SDC', 'DOCB'], ['DOCB', 'ILL'], ['ILL', 'PURDUE'], ['PURDUE', 'CARNEGIE'], ['CASE', 'LINCOLN'],
  ['LINCOLN', 'MIT'], ['MIT', 'BBN'], ['BBN', 'HARVARD'], ['HARVARD', 'CARNEGIE'], ['CARNEGIE', 'CASE'],
  ['UCLA', 'AFWL'], ['AFWL', 'RML'], ['RML', 'NBS'], ['NBS', 'ARPA'], ['ARPA', 'MITRE'], ['MITRE', 'HARVARD'],
  ['BBN', 'ARPA'],
]
const COM_NOME: No[] = ['SRI', 'UCLA', 'UCSB', 'UTAH', 'STAN', 'RAND', 'AFWL', 'GWC', 'ILL', 'CASE', 'CARNEGIE', 'MIT', 'BBN', 'HARVARD', 'ARPA', 'RML']

/** O caminho de sempre, de SRI até o MIT; e o desvio quando o link GWC–CASE cai. */
const CAMINHO: No[] = ['SRI', 'UTAH', 'GWC', 'CASE', 'LINCOLN', 'MIT']
const DESVIO: No[] = ['SRI', 'UCSB', 'UCLA', 'SDC', 'DOCB', 'ILL', 'PURDUE', 'CARNEGIE', 'HARVARD', 'BBN', 'MIT']
const TERCEIRO: No[] = ['SRI', 'UCSB', 'UCLA', 'AFWL', 'RML', 'NBS', 'ARPA', 'BBN', 'MIT']

/** Empresas que entram na rede depois de 1990 (azul). */
const EMPRESAS: [number, number][] = [
  [-4.2, -2.2], [-1.2, -2.2], [0.2, 1.4], [2.2, 0.6], [1.4, -2.2], [-3.2, 0.7], [2.6, 1.7], [-0.8, -1.2],
]

function Mapa() {
  const geometria = useMemo(() => {
    const s = new Shape()
    CONTORNO.forEach(([x, z], i) => (i === 0 ? s.moveTo(x, -z) : s.lineTo(x, -z)))
    s.closePath()
    return new ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false })
  }, [])
  return (
    <group>
      <mesh geometry={geometria} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial color="#f3e24a" roughness={0.9} />
      </mesh>
      {/* Grandes Lagos */}
      {[
        [2.0, -2.35, 0.55, 0.22],
        [2.75, -2.05, 0.4, 0.28],
        [1.7, -1.8, 0.2, 0.4],
        [3.4, -1.75, 0.45, 0.16],
      ].map(([x, z, sx, sz], i) => (
        <group key={i} position={[x, 0.15, z]} scale={[sx, 1, sz]}>
          <Cilindro raio={1} altura={0.02} lados={20} cor="#3aa0d8" sombra={false} />
        </group>
      ))}
    </group>
  )
}

function Pacote({ caminho, atraso = 0, periodo, cor = '#2f6fb0', numero }: { caminho: No[]; atraso?: number; periodo?: number; cor?: string; numero?: string }) {
  return (
    <Percurso pontos={caminho.map((n) => p(n, 0.28))} velocidade={3.2} espera={0.12} atraso={atraso} periodo={periodo}>
      <group scale={0.6}>
        <Dado tipo="mensagem" cor={cor} sombra={false} />
      </group>
      {numero && (
        <Rotulo pos={[0, 0.72, 0]} classe="mini">
          {numero}
        </Rotulo>
      )}
    </Percurso>
  )
}

export function CenaArpanet(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'mapa'
  const semAno = !!cena.estado.semAno
  const desativada = modo === 'internet'
  const caiu = modo === 'objetivo'
  const corNo = desativada ? '#9aa3ab' : '#d8262c'

  return (
    <>
      <Ilha raio={8.6} />
      <Mapa />

      {LINKS.map(([a, b]) => {
        const quebrado = caiu && a === 'GWC' && b === 'CASE'
        return (
          <Line
            key={a + b}
            points={[p(a), p(b)]}
            color={quebrado ? '#d8262c' : desativada ? '#b9b39a' : '#4a4a4a'}
            lineWidth={quebrado ? 2.5 : 1.6}
            dashed={quebrado}
            dashSize={0.12}
            gapSize={0.1}
          />
        )
      })}
      {(Object.keys(NOS) as No[]).map((n) => (
        <Cilindro key={n} raio={0.11} altura={0.12} lados={10} pos={p(n, 0.2)} cor={corNo} />
      ))}
      {!desativada &&
        COM_NOME.map((n) => (
          <Rotulo key={n} pos={p(n, 0.55)} classe="mini">
            {n}
          </Rotulo>
        ))}

      <Rotulo pos={[-0.6, 1.9, -3.4]} classe="grande" escuro>
        {desativada ? 'INTERNET' : semAno ? 'ARPANET' : 'ARPANET · 1962 · ARPA / DoD (EUA)'}
      </Rotulo>

      {modo === 'mapa' && <Pacote caminho={CAMINHO} />}

      {caiu && (
        <>
          <Rotulo pos={[0.25, 0.55, -0.9]} classe="emoji">
            ✗
          </Rotulo>
          <Rotulo pos={[0.25, 1.35, -0.9]} escuro>
            link perdido
          </Rotulo>
          <Pacote caminho={DESVIO} cor="#23915f" />
          <Rotulo pos={[-0.8, 0.9, 1.1]}>os dados desviam por outro caminho</Rotulo>
        </>
      )}

      {modo === 'tecnologias' && (
        <>
          <Pacote caminho={CAMINHO} numero="1" periodo={9} />
          <Pacote caminho={DESVIO} numero="2" atraso={0.5} periodo={9} />
          <Pacote caminho={TERCEIRO} numero="3" atraso={1} periodo={9} />
          <Rotulo pos={[-2.3, 0.75, -0.55]} classe="bits">
            56 kbps
          </Rotulo>
          <Rotulo pos={[0.6, 0.75, 1.9]}>
            linha telefônica alugada<small>ponto a ponto · 56 kbps</small>
          </Rotulo>
          <Rotulo pos={[1.2, 1.5, -3.0]}>comutação de pacotes + TCP/IP</Rotulo>
        </>
      )}

      {desativada && (
        <>
          {EMPRESAS.map(([x, z], i) => (
            <group key={i}>
              <Line points={[[x, Y, z], i === 0 ? [EMPRESAS[EMPRESAS.length - 1][0], Y, EMPRESAS[EMPRESAS.length - 1][1]] : [EMPRESAS[i - 1][0], Y, EMPRESAS[i - 1][1]]]} color="#2f6fb0" lineWidth={2} />
              <Cilindro raio={0.14} altura={0.35} lados={4} pos={[x, 0.3, z]} cor="#2f6fb0" />
              <Rotulo pos={[x, 0.85, z]} classe="emoji">
                🏢
              </Rotulo>
            </group>
          ))}
          <Rotulo pos={[0.4, 1.2, 3.3]} escuro>
            1990: ARPANET desativada → surge a Internet
          </Rotulo>
        </>
      )}
    </>
  )
}
