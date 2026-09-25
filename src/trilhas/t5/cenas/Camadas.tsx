import { Alvo, Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { cantosSuaves, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Bloco, Seta } from './comum'

// Fase 5.2 — camadas, serviços e protocolos (Aula 05 p1, p. 3). A figura do slide: Host A e
// Host B com 3 camadas cada; setas amarelas (serviço) entre as camadas de um mesmo host,
// setas duplas (protocolo) entre os pares e o fluxo de mensagem pelo meio físico.
// No modo "n", as camadas viram N+1, N e N−1 (figura "Protocolos de Camadas").

const XA = -3.3
const XB = 3.3
const TAM: V3 = [2.3, 0.7, 1.4]
/** Centro de cada camada: 1, 2 e 3. */
const Y = [0.62, 1.97, 3.32]
const COR_CAMADA = ['#a0451c', '#2f64a6', '#2f5a2c']
const COR_PROTOCOLO = ['#f0a0a0', '#9ec0e0', '#a9cbc2']
const AMARELO = '#f2e35a'
const FRENTE = TAM[2] / 2 + 0.02

const CABO = cantosSuaves([[XA, 0.14, 0.75], [XA, 0.14, 1.7], [XB, 0.14, 1.7], [XB, 0.14, 0.75]], 0.45)
const FLUXO: V3[] = [
  [XA, Y[2], FRENTE + 0.25],
  [XA, Y[1], FRENTE + 0.25],
  [XA, Y[0], FRENTE + 0.25],
  [XA, 0.3, 1.7],
  [XB, 0.3, 1.7],
  [XB, Y[0], FRENTE + 0.25],
  [XB, Y[1], FRENTE + 0.25],
  [XB, Y[2], FRENTE + 0.25],
]

export function CenaCamadas(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'pilha'
  const semNomes = !!cena.estado.semNomes
  const ehN = modo === 'n'
  const servico = ['servico', 'protocolos', 'fluxo', 'tudo'].includes(modo)
  const protocolo = ['protocolos', 'fluxo', 'tudo'].includes(modo)
  const nome = (i: number) => (ehN ? ['Camada N-1', 'Camada N', 'Camada N+1'][i] : `Camada ${i + 1}`)

  return (
    <>
      <Ilha raio={8.4} />
      {[XA, XB].map((x, h) => (
        <group key={x}>
          <Lote pos={[x, 0, 0]} tam={[2.9, 2]} />
          {Y.map((y, i) => (
            <group key={i}>
              <Bloco pos={[x, y, 0]} tam={TAM} cor={COR_CAMADA[i]} />
              <Rotulo pos={[x, y, FRENTE]} classe="camada-osi">
                {nome(i)}
              </Rotulo>
            </group>
          ))}
          <Rotulo pos={[x, 4.25, 0]} classe="grande" escuro>
            Host {h === 0 ? 'A' : 'B'}
          </Rotulo>
          {servico &&
            [0, 1].map((i) => (
              <Seta key={i} de={[x, Y[i] + TAM[1] / 2 + 0.02, 0.2]} para={[x, Y[i + 1] - TAM[1] / 2 - 0.02, 0.2]} cor={AMARELO} raio={0.08} />
            ))}
        </group>
      ))}

      {servico &&
        !semNomes &&
        [0, 1].map((i) => (
          <Rotulo key={i} pos={[XA - 2.35, (Y[i] + Y[i + 1]) / 2, 0.2]}>
            Serviço da camada {i + 1}
          </Rotulo>
        ))}

      {protocolo &&
        Y.map((y, i) => (
          <group key={i}>
            <Seta de={[XA + TAM[0] / 2 + 0.1, y, 0]} para={[XB - TAM[0] / 2 - 0.1, y, 0]} cor={COR_PROTOCOLO[i]} raio={0.09} duasPontas />
            {!semNomes && (
              <Rotulo pos={[0, y + 0.42, 0]} classe="bits">
                Protocolo da camada {i + 1}
              </Rotulo>
            )}
          </group>
        ))}

      {ehN && (
        <>
          <Seta de={[XA + TAM[0] / 2 + 0.1, Y[1], 0]} para={[XB - TAM[0] / 2 - 0.1, Y[1], 0]} cor="#6fa3d8" raio={0.1} duasPontas />
          <Rotulo pos={[0, Y[1] + 0.45, 0]} classe="bits">
            Protocolo da Camada N
          </Rotulo>
        </>
      )}

      <Ligacao pontos={CABO} cor="#2f5fa0" raio={0.07} />
      <Rotulo pos={[0, 0.45, 2.15]} escuro>
        MEIO FÍSICO DE COMUNICAÇÃO
      </Rotulo>

      {modo === 'fluxo' && (
        <>
          <Rotulo pos={[0, 0.2, 2.95]}>Fluxo de Mensagem</Rotulo>
          <Percurso pontos={FLUXO} velocidade={2.4} espera={0.45}>
            <group scale={0.75}>
              <Dado tipo="mensagem" sombra={false} />
            </group>
          </Percurso>
        </>
      )}

      {Y.map((y, i) => (
        <Alvo key={i} id={`p${i + 1}`} pos={[0, y - 0.05, 0.55]} cena={cena} />
      ))}

      <Arvore pos={[-6.6, 0, -2.4]} escala={0.9} />
      <Arvore pos={[6.5, 0, -2.6]} />
    </>
  )
}
