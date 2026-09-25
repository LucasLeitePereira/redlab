import { Arvore, Caixa, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao, type Viagem } from '../../../three/Ligacao'
import { cantosSuaves } from '../../../three/movimento'
import { Computador, Impressora, Mainframe, Notebook, Processando, Servidor, Switch, Terminal } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 1.4 — as 4 arquiteturas (Aula 01, p. 5–7). O que muda entre elas é ONDE os dados
// são processados: a engrenagem girando marca quem processa.
// Convenção das cores dos dados: vermelho = pedido, azul = resposta.

const PEDIDO = '#ef6f6c'
const RESPOSTA = '#3aa0e6'
const SW: V3 = [0, 0.12, 0.6]
/** Bordas do switch (5 portas, 1,5 × 0,6): os cabos entram pelas laterais ou por trás. */
const SW_ESQ = -0.6
const SW_DIR = 0.6
const SW_TRAS = 0.35

/**
 * Cabo pelo chão em trechos retos com cantos arredondados, como um cabeamento organizado:
 * `pontos` são [x, z] dos cantos, do aparelho até o switch.
 */
function fio(...pontos: [number, number][]): V3[] {
  return cantosSuaves(pontos.map(([x, z]): V3 => [x, 0.14, z]), 0.3)
}

/**
 * Três aparelhos à direita do switch (de cima para baixo): cada cabo desce/sobe reto do aparelho
 * e entra na lateral direita numa faixa própria (0,45 · 0,65 · 0,85), sem cruzar os outros.
 */
const FAIXAS_DIR = [0.45, 0.65, 0.85]
function daDireita(x: number, z: number, i: number): V3[] {
  const faixa = FAIXAS_DIR[i]
  return Math.abs(z - faixa) < 0.05 ? fio([x, faixa], [SW_DIR, faixa]) : fio([x, z], [x, faixa], [SW_DIR, faixa])
}

function Centralizada() {
  const terminais: V3[] = [[2.8, 0.12, -1.6], [3.6, 0.12, 0.65], [2.4, 0.12, 3.0]]
  return (
    <>
      <Lote pos={[-3.2, 0, -0.6]} tam={[3, 2.6]} />
      <Mainframe pos={[-3.2, 0.12, -0.6]} />
      <Processando pos={[-3.2, 3.3, -0.6]} />
      <Switch pos={SW} />
      <Ligacao pontos={fio([-2.4, -0.2], [-1.4, -0.2], [-1.4, 0.6], [SW_ESQ, 0.6])} cor="#3b6fb5" surgir={0.1} viagens={[
        { cor: PEDIDO, duracao: 1.6, atraso: 1.4, pausa: 5.2, inverso: true },
        { cor: RESPOSTA, duracao: 1.6, atraso: 3.4, pausa: 5.2 },
      ]} />
      {terminais.map((t, i) => (
        <group key={i}>
          <Terminal pos={t} rot={[0, -0.9 - i * 0.2, 0]} />
          <Ligacao pontos={daDireita(t[0] - 0.4, t[2], i)} cor="#3b6fb5" surgir={0.1} viagens={[
            { cor: PEDIDO, duracao: 1.4, atraso: i * 0.25, pausa: 5.4 },
            { cor: RESPOSTA, duracao: 1.4, atraso: 5 + i * 0.25, pausa: 5.4, inverso: true },
          ]} />
        </group>
      ))}
      <Rotulo pos={[-3.2, 4.1, -0.6]}>Mainframe<small>processa tudo · custo elevado</small></Rotulo>
      <Rotulo pos={[3.4, 1.5, 0.9]}>Terminais “burros”<small>só entrada e saída</small></Rotulo>
    </>
  )
}

function Descentralizada() {
  const maquinas: V3[] = [[-0.4, 0.12, -2.6], [2.6, 0.12, -1.6], [3.2, 0.12, 1.8]]
  return (
    <>
      <Switch pos={SW} />
      <Impressora pos={[-3.4, 0.12, 1.4]} rot={[0, 0.5, 0]} />
      <Ligacao pontos={fio([-3.0, 1.2], [-1.5, 1.2], [-1.5, 0.6], [SW_ESQ, 0.6])} cor="#3b6fb5" surgir={0.1} viagens={[{ cor: '#7458c4', duracao: 1.6, atraso: 1.7, pausa: 3.4 }]} />
      {maquinas.map((m, i) => (
        <group key={i}>
          <Notebook pos={m} rot={[0, -0.6 - i * 0.4, 0]} />
          <Processando pos={[m[0], 1.5, m[2]]} cor="#f2b134" />
          <Ligacao
            pontos={i === 0 ? fio([m[0], m[2] + 0.35], [m[0], SW_TRAS]) : daDireita(m[0], m[2] + 0.3, i === 1 ? 0 : 2)}
            cor="#3b6fb5"
            surgir={0.1}
            viagens={i === 1 ? [{ cor: '#7458c4', duracao: 1.6, pausa: 3.4 }] : []}
          />
        </group>
      ))}
      <Rotulo pos={[1.2, 2.6, -1.4]}>Grupo de Trabalho<small>cada um processa o seu</small></Rotulo>
      <Rotulo pos={[-3.4, 1.3, 1.4]}>Impressora compartilhada</Rotulo>
    </>
  )
}

function Distribuida() {
  const clientes: V3[] = [[2.8, 0.12, -1.8], [3.6, 0.12, 0.65], [2.6, 0.12, 2.9]]
  const pedido = (i: number): Viagem => ({ cor: PEDIDO, duracao: 1.4, atraso: i * 0.5, pausa: 3.4 })
  const resposta = (i: number): Viagem => ({ cor: RESPOSTA, duracao: 1.4, atraso: 2.4 + i * 0.5, pausa: 3.4, inverso: true })
  return (
    <>
      <Lote pos={[-3.2, 0, 0]} tam={[2.6, 2.6]} />
      <Servidor pos={[-3.2, 0.12, 0]} />
      <Processando pos={[-3.2, 2.4, 0]} />
      <Switch pos={SW} />
      <Ligacao pontos={fio([-2.7, 0.6], [SW_ESQ, 0.6])} cor="#3b6fb5" surgir={0.1} viagens={[
        { cor: PEDIDO, duracao: 0.9, atraso: 1.2, pausa: 3.9, inverso: true },
        { cor: RESPOSTA, duracao: 1.2, atraso: 2.4, pausa: 3.6 },
      ]} />
      {clientes.map((c, i) => (
        <group key={i}>
          <Notebook pos={c} rot={[0, -1.1 - i * 0.2, 0]} />
          <Ligacao pontos={daDireita(c[0] - 0.3, c[2], i)} cor="#3b6fb5" surgir={0.1} viagens={[pedido(i), resposta(i)]} />
        </group>
      ))}
      <Rotulo pos={[-3.2, 3.2, 0]}>Servidor<small>entrega as respostas</small></Rotulo>
      <Rotulo pos={[3.6, 1.6, 0.7]}>Clientes<small>solicitam os dados</small></Rotulo>
    </>
  )
}

/** Computadores nos cantos de um retângulo; cada par tem o seu próprio cabo (6 cabos: 4 lados e um X). */
const PARES: V3[] = [[-3.2, 0.12, -2.5], [3.2, 0.12, -2.5], [3.2, 0.12, 2.3], [-3.2, 0.12, 2.3]]
/** Tomada de cada computador: na frente dos de trás e atrás dos da frente (o cabo nunca passa por cima da mesa). */
const TOMADAS: V3[] = PARES.map(([x, , z]) => [x, 0.14, z < 0 ? z + 0.95 : z - 0.75])
const Y_CABO = 0.14

/**
 * Cada tomada tem 3 portas, uma por cabo, em lugares diferentes: a do cabo do lado horizontal fica
 * para fora em z, a do lado vertical para fora em x e a da diagonal no canto de dentro.
 * Assim as pontas nunca se encontram e dá para ver que são cabos separados.
 */
function porta(i: number, qual: 'h' | 'v' | 'd'): V3 {
  const [x, , z] = TOMADAS[i]
  const sx = Math.sign(x)
  const sz = Math.sign(z)
  const [dx, dz] = qual === 'h' ? [-sx * 0.15, sz * 0.2] : qual === 'v' ? [sx * 0.2, -sz * 0.15] : [-sx * 0.14, -sz * 0.14]
  return [x + dx, Y_CABO, z + dz]
}

/** Cabo de `a` até `b`; `ponte` levanta o meio (a segunda diagonal passa por cima da primeira no centro). */
function caboP2P(a: number, b: number, qual: 'h' | 'v' | 'd', ponte = false): V3[] {
  const [p, q] = [porta(a, qual), porta(b, qual)]
  if (!ponte) return [p, q]
  const em = (t: number, y: number): V3 => [p[0] + (q[0] - p[0]) * t, y, p[2] + (q[2] - p[2]) * t]
  return [p, em(0.38, Y_CABO), em(0.5, Y_CABO + 0.16), em(0.62, Y_CABO), q]
}

function Colaborativa() {
  const cores = ['#ef6f6c', '#3aa0e6', '#2e9e6a', '#f2b134']
  // [de, para, lado, atraso]: as duas diagonais saem defasadas para os dados não se cruzarem no centro juntos
  const ligacoes: [number, number, 'h' | 'v' | 'd', number][] = [
    [0, 1, 'h', 0], [1, 2, 'v', 0.4], [2, 3, 'h', 0.8], [3, 0, 'v', 1.2], [0, 2, 'd', 1.6], [1, 3, 'd', 2.85],
  ]
  return (
    <>
      {PARES.map((p, i) => (
        <group key={i}>
          <Lote pos={[p[0] + 0.3, 0, p[2]]} tam={[2.6, 2.2]} />
          <Computador pos={p} escala={0.8} />
          <Processando pos={[p[0], 1.8, p[2]]} cor={cores[i]} />
          {/* tomada com 3 portas; o cabo do próprio computador sai dela para a máquina */}
          <Caixa tam={[0.72, 0.08, 0.72]} pos={[TOMADAS[i][0], 0.1, TOMADAS[i][2]]} cor="#dfe4ea" />
          {(['h', 'v', 'd'] as const).map((q) => {
            const [x, , z] = porta(i, q)
            return <Caixa key={q} tam={[0.16, 0.12, 0.16]} pos={[x, 0.15, z]} cor="#2d3540" sombra={false} />
          })}
        </group>
      ))}
      {ligacoes.map(([a, b, qual, atraso], i) => (
        <Ligacao
          key={i}
          pontos={caboP2P(a, b, qual, i === 5)}
          cor="#3b6fb5"
          surgir={0.1}
          viagens={[
            // pedaços do mesmo arquivo (o download dividido): todos do mesmo tipo, cada cor um pedaço
            { cor: cores[a], tipo: 'video', duracao: 2.2, atraso, pausa: 1.2 },
            { cor: cores[b], tipo: 'video', duracao: 2.2, atraso: atraso + 1.5, pausa: 1.2, inverso: true },
          ]}
        />
      ))}
      <Rotulo pos={[0, 2.6, 0]}>P2P: cada um é cliente e servidor<small>o download é dividido entre todos</small></Rotulo>
    </>
  )
}

export function CenaArquiteturas({ estado }: CenaProps) {
  const arq = (estado.arq as string | undefined) ?? 'centralizada'
  return (
    <>
      <Ilha raio={8} />
      {arq === 'centralizada' && <Centralizada />}
      {arq === 'descentralizada' && <Descentralizada />}
      {arq === 'distribuida' && <Distribuida />}
      {arq === 'colaborativa' && <Colaborativa />}
      <Arvore pos={[-6, 0, -3.6]} />
      <Arvore pos={[5.9, 0, -3.2]} escala={1.1} />
      <Arvore pos={[-6.3, 0, 3.2]} escala={0.8} />
    </>
  )
}
