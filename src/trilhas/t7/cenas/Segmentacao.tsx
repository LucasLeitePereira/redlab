import type { ReactElement } from 'react'
import { Line } from '@react-three/drei'
import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { AMARELO, ESCURO, Encaixe, VERDE, Tijolo } from './comum'

// Fase 7.3 — TCP e a segmentação (Aula 06 p. 6–7): serviços do TCP, o encaixe segmento >
// pacote > quadro e a mensagem cortada em segmentos (MSS).

function Servicos() {
  const cartoes = ['Garantia de entrega', 'Sequenciamento', 'Integridade dos dados']
  const A: V3 = [-4.4, 0.14, 1.4]
  const B: V3 = [4.4, 0.14, 1.4]
  return (
    <group>
      <Rotulo pos={[0, 5.2, 0]} escuro>
        Serviços fornecidos pelo TCP
      </Rotulo>
      {cartoes.map((c, i) => (
        <Tijolo key={c} pos={[-3.6 + i * 3.6, 4.2, 0]} tam={[3.2, 0.9, 0.4]} cor="#34506a" claro texto={c} />
      ))}
      <Computador pos={[A[0], 0.12, A[2]]} escala={0.85} />
      <Computador pos={[B[0], 0.12, B[2]]} escala={0.85} rot={[0, -0.3, 0]} />
      <Ligacao
        pontos={[[A[0] + 0.7, 0.14, A[2]], [B[0] - 0.7, 0.14, B[2]]]}
        cor="#2f5fa0"
        raio={0.06}
        viagens={[
          { cor: '#ef6f6c', tipo: 'mensagem' },
          { cor: '#3aa0e6', tipo: 'mensagem', inverso: true, atraso: 3.5 },
        ]}
      />
      <Rotulo pos={[0, 2.6, 1.4]} escuro>
        Orientado a conexão
      </Rotulo>
      <Rotulo pos={[0, 1.9, 1.4]} classe="mini">
        Full Duplex: dados nas duas direções
      </Rotulo>
      <Rotulo pos={[0, 1.3, 1.4]} classe="mini">
        Entrega confiável de um fluxo (stream) de caracteres
      </Rotulo>
    </group>
  )
}

function Encapsula() {
  return (
    <Encaixe
      y={2.6}
      camadas={[
        { nome: 'QUADRO', cab: 'Cabeçalho do Quadro', cor: '#fbf6c8', fim: 'FCS' },
        { nome: 'PACOTE (payload do quadro)', cab: 'Cabeçalho Pacote', cor: '#f4c1c6' },
        { nome: 'SEGMENTO (payload do pacote)', cab: 'Cabeçalho Segmento', cor: '#cfe9c8' },
      ]}
      dados="Payload (Dados com a carga útil)"
    />
  )
}

const N = 5
const PAYLOAD = 0.9
const CAB = 0.2
const FCS = 0.2
const GAP = 0.1
const X0 = -3.9
const YS = { app: 4.5, tcp: 3.4, ip: 2.3, eth: 1.2 }
const H = 0.55

/** Linha de N unidades iguais: cabeçalhos (cor, largura) + payload + FCS opcional. */
function LinhaDeSegmentos({ y, cabs, fcs = false }: { y: number; cabs: { cor: string }[]; fcs?: boolean }) {
  const un = cabs.length * CAB + PAYLOAD + (fcs ? FCS : 0)
  return (
    <group>
      {Array.from({ length: N }, (_, k) => {
        const ini = X0 + k * (un + GAP)
        let x = ini
        const pecas: ReactElement[] = []
        cabs.forEach((c, j) => {
          pecas.push(<Caixa key={`c${j}`} tam={[CAB, H, 0.3]} pos={[x + CAB / 2, y, 0]} cor={c.cor} />)
          x += CAB
        })
        pecas.push(<Tijolo key="p" pos={[x + PAYLOAD / 2, y, 0]} tam={[PAYLOAD, H, 0.3]} cor={AMARELO} texto={String(k + 1)} pequeno />)
        x += PAYLOAD
        if (fcs) pecas.push(<Caixa key="f" tam={[FCS, H, 0.3]} pos={[x + FCS / 2, y, 0]} cor={ESCURO} />)
        return <group key={k}>{pecas}</group>
      })}
    </group>
  )
}

function Segmentos({ semNomes }: { semNomes: boolean }) {
  const larguraMsg = N * PAYLOAD
  const mss = X0 + CAB
  return (
    <group>
      {/* mensagem inteira */}
      <Caixa tam={[larguraMsg, H, 0.3]} pos={[X0 + larguraMsg / 2, YS.app, 0]} cor={AMARELO} />
      {[1, 2, 3, 4].map((k) => (
        <Caixa key={k} tam={[0.03, H, 0.32]} pos={[X0 + k * PAYLOAD, YS.app, 0]} cor="#b99a1a" sombra={false} />
      ))}
      <Rotulo pos={[X0 + larguraMsg / 2, YS.app, 0.2]} classe="tijolo">
        Mensagem
      </Rotulo>

      <LinhaDeSegmentos y={YS.tcp} cabs={[{ cor: VERDE }]} />
      <LinhaDeSegmentos y={YS.ip} cabs={[{ cor: '#9a4418' }, { cor: VERDE }]} />
      <LinhaDeSegmentos y={YS.eth} cabs={[{ cor: '#c48a14' }, { cor: '#9a4418' }, { cor: VERDE }]} fcs />

      {/* MSS: o limite de cada pedaço de dados do segmento */}
      <Line points={[[mss, YS.tcp + 0.42, 0.2], [mss + PAYLOAD, YS.tcp + 0.42, 0.2]]} color="#1d2733" lineWidth={2} />
      <Rotulo pos={[mss + PAYLOAD / 2, YS.tcp + 0.62, 0.2]} classe="mini">
        <b>MSS</b>
      </Rotulo>

      {!semNomes && (
        <>
          <Rotulo pos={[-5.0, YS.app, 0]} escuro>
            Protocolo da Aplicação
          </Rotulo>
          <Rotulo pos={[-5.0, YS.tcp, 0]} escuro>
            TCP
          </Rotulo>
          <Rotulo pos={[-5.0, YS.ip, 0]} escuro>
            IP
          </Rotulo>
          <Rotulo pos={[-5.0, YS.eth, 0]} escuro>
            Ethernet
          </Rotulo>
        </>
      )}
      <Rotulo pos={[3.6, YS.app, 0]} classe="mini">
        cada pedaço cabe no limite de carga
      </Rotulo>
      <Rotulo pos={[3.2, YS.tcp + 0.62, 0]} classe="mini">
        <span style={{ color: VERDE }}>■</span> cabeçalho do segmento
      </Rotulo>
      <Rotulo pos={[3.2, YS.eth - 0.62, 0]} classe="mini">
        pacotes viram quadros (com FCS)
      </Rotulo>
    </group>
  )
}

export function CenaSegmentacao(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'servicos'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'servicos' && <Servicos />}
      {modo === 'encapsula' && <Encapsula />}
      {modo === 'segmentos' && <Segmentos semNomes={!!cena.estado.semNomes} />}
    </>
  )
}
