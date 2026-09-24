import { Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao, type Viagem } from '../../../three/Ligacao'
import { Computador, Impressora, Mainframe, Notebook, Processando, Servidor, Switch, Terminal } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 1.4 — as 4 arquiteturas (Aula 01, p. 5–7). O que muda entre elas é ONDE os dados
// são processados: a engrenagem girando marca quem processa.
// Convenção das cores dos caminhões: vermelho = pedido, azul = resposta.

const PEDIDO = '#ef6f6c'
const RESPOSTA = '#3aa0e6'
const SW: V3 = [0, 0.12, 0.6]

/** Cabo de um aparelho até o switch, passando pelo chão. */
function ate(de: V3, para: V3 = SW): V3[] {
  return [[de[0], 0.14, de[2]], [(de[0] + para[0]) / 2, 0.14, (de[2] + para[2]) / 2 + 0.3], [para[0], 0.14, para[2]]]
}

function Centralizada() {
  const terminais: V3[] = [[2.8, 0.12, -1.6], [3.6, 0.12, 0.9], [2.4, 0.12, 3.0]]
  return (
    <>
      <Lote pos={[-3.2, 0, -0.6]} tam={[3, 2.6]} />
      <Mainframe pos={[-3.2, 0.12, -0.6]} />
      <Processando pos={[-3.2, 3.3, -0.6]} />
      <Switch pos={SW} />
      <Ligacao pontos={ate([-2.4, 0, -0.2])} cor="#3b6fb5" viagens={[
        { cor: PEDIDO, duracao: 1.6, atraso: 1.4, inverso: true },
        { cor: RESPOSTA, duracao: 1.6, atraso: 3.4 },
      ]} />
      {terminais.map((t, i) => (
        <group key={i}>
          <Terminal pos={t} rot={[0, -0.9 - i * 0.2, 0]} />
          <Ligacao pontos={ate([t[0] - 0.4, 0, t[2]])} cor="#3b6fb5" viagens={[
            { cor: PEDIDO, duracao: 1.4, atraso: i * 0.25 },
            { cor: RESPOSTA, duracao: 1.4, atraso: 5 + i * 0.25, inverso: true },
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
      <Ligacao pontos={ate([-3.0, 0, 1.2])} cor="#3b6fb5" viagens={[{ cor: '#7458c4', duracao: 1.6, atraso: 1.7, pausa: 3.4 }]} />
      {maquinas.map((m, i) => (
        <group key={i}>
          <Notebook pos={m} rot={[0, -0.6 - i * 0.4, 0]} />
          <Processando pos={[m[0], 1.5, m[2]]} cor="#f2b134" />
          <Ligacao
            pontos={ate(m)}
            cor="#3b6fb5"
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
  const clientes: V3[] = [[2.8, 0.12, -1.8], [3.6, 0.12, 0.7], [2.6, 0.12, 2.9]]
  const pedido = (i: number): Viagem => ({ cor: PEDIDO, duracao: 1.4, atraso: i * 0.5, pausa: 3.4 })
  const resposta = (i: number): Viagem => ({ cor: RESPOSTA, duracao: 1.4, atraso: 2.4 + i * 0.5, pausa: 3.4, inverso: true })
  return (
    <>
      <Lote pos={[-3.2, 0, 0]} tam={[2.6, 2.6]} />
      <Servidor pos={[-3.2, 0.12, 0]} />
      <Processando pos={[-3.2, 2.4, 0]} />
      <Switch pos={SW} />
      <Ligacao pontos={ate([-2.7, 0, 0.3])} cor="#3b6fb5" viagens={[
        { cor: PEDIDO, duracao: 1.2, atraso: 1.3, pausa: 3.6, inverso: true },
        { cor: RESPOSTA, duracao: 1.2, atraso: 2.4, pausa: 3.6 },
      ]} />
      {clientes.map((c, i) => (
        <group key={i}>
          <Notebook pos={c} rot={[0, -1.1 - i * 0.2, 0]} />
          <Ligacao pontos={ate([c[0] - 0.3, 0, c[2]])} cor="#3b6fb5" viagens={[pedido(i), resposta(i)]} />
        </group>
      ))}
      <Rotulo pos={[-3.2, 3.2, 0]}>Servidor<small>entrega as respostas</small></Rotulo>
      <Rotulo pos={[3.6, 1.6, 0.7]}>Clientes<small>solicitam os dados</small></Rotulo>
    </>
  )
}

function Colaborativa() {
  const pares: V3[] = [[-3.4, 0.12, -1.8], [2.6, 0.12, -2.4], [3.4, 0.12, 2.0], [-2.6, 0.12, 2.6]]
  const cores = ['#ef6f6c', '#3aa0e6', '#2e9e6a', '#f2b134']
  const ligacoes: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]]
  return (
    <>
      {pares.map((p, i) => (
        <group key={i}>
          <Lote pos={p} tam={[2.6, 2.2]} />
          <Computador pos={[p[0] - 0.4, 0.12, p[2]]} escala={0.8} />
          <Processando pos={[p[0] - 0.4, 1.8, p[2]]} cor={cores[i]} />
        </group>
      ))}
      {ligacoes.map(([a, b], i) => (
        <Ligacao
          key={i}
          pontos={[[pares[a][0], 0.14, pares[a][2] + 0.7], [pares[b][0], 0.14, pares[b][2] + 0.7]]}
          cor="#3b6fb5"
          viagens={[
            { cor: cores[a], carga: cores[a], duracao: 2.2, atraso: i * 0.4, pausa: 1.2 },
            { cor: cores[b], carga: cores[b], duracao: 2.2, atraso: 1.5 + i * 0.4, pausa: 1.2, inverso: true },
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
