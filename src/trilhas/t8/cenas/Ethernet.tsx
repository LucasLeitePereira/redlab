import { Line } from '@react-three/drei'
import { Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Computador, PlacaDeRede } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { Quadro, Tabela3D, linha, type Col } from './comum'

// Fase 8.5 — Ethernet DIX e IEEE 802.3 (Aula 07 p. 8 e 11).
// 'dix': réplica 3D do desenho original; 'evolucao': árvore 802.3a/u/z/ae; 'tabela': tabela de anos.

const AMARELO = '#f2c230'
const ZE = -1.6 // posição (z) do cabo "THE ETHER"
const YE = 1.1

function Dix() {
  const xp = -3.4 // estação principal
  const outras = [-0.4, 1.9, 4.2]
  return (
    <>
      {/* THE ETHER */}
      <Cilindro raio={0.1} altura={10.8} pos={[0, YE, ZE]} rot={[0, 0, Math.PI / 2]} cor={AMARELO} />
      {[-1, 1].map((s) => (
        <Caixa key={s} tam={[0.3, 0.4, 0.4]} pos={[s * 5.55, YE, ZE]} cor="#2d3540" />
      ))}
      <Rotulo pos={[5.55, YE + 0.55, ZE]} classe="mini">
        TERMINATOR
      </Rotulo>
      <Rotulo pos={[1.0, YE + 0.55, ZE]} escuro>
        THE ETHER
      </Rotulo>

      {/* estação principal: TAP → TRANSCEIVER → INTERFACE CABLE → INTERFACE CONTROLLER → STATION */}
      <Caixa tam={[0.34, 0.2, 0.34]} pos={[xp, YE - 0.18, ZE]} cor="#1d2733" />
      <Caixa tam={[0.7, 0.45, 0.55]} pos={[xp, 0.5, ZE]} cor="#2e8b8b" />
      <Caixa tam={[0.1, 0.1, 2.2]} pos={[xp, 0.3, ZE + 1.5]} cor="#7b8794" />
      <PlacaDeRede pos={[xp, 0.12, 0.65]} escala={0.9} />
      <Computador pos={[xp, 0.12, 2.5]} escala={0.75} />
      <Rotulo pos={[xp - 1.2, YE + 0.6, ZE]} classe="mini">
        TAP
      </Rotulo>
      <Rotulo pos={[xp - 1.4, 0.5, ZE]} classe="mini">
        TRANSCEIVER
      </Rotulo>
      <Rotulo pos={[xp + 1.5, 0.3, ZE + 1.5]} classe="mini">
        INTERFACE CABLE
      </Rotulo>
      <Rotulo pos={[xp - 1.6, 0.4, 0.65]} classe="mini">
        INTERFACE CONTROLLER
      </Rotulo>
      <Rotulo pos={[xp, 2.25, 2.5]} escuro>
        STATION
      </Rotulo>

      {/* outras estações no mesmo cabo */}
      {outras.map((x) => (
        <group key={x}>
          <Caixa tam={[0.3, 0.16, 0.3]} pos={[x, YE - 0.16, ZE]} cor="#1d2733" />
          <Caixa tam={[0.4, 0.3, 0.4]} pos={[x, 0.55, ZE]} cor="#2e8b8b" />
          <Caixa tam={[0.07, 0.07, 1.9]} pos={[x, 0.25, ZE + 1.2]} cor="#7b8794" />
          <Computador pos={[x, 0.12, 0.6]} escala={0.45} />
        </group>
      ))}

      <Quadro pos={[1.0, 4.0, -1]} largura={370}>
        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Ethernet DIX (DEC, Intel e Xerox)</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>
          <li>10 Mbps</li>
          <li>barramento ou estrela</li>
          <li>cabo coaxial ou par-trançado</li>
          <li>Half-duplex e Full-duplex</li>
          <li>CSMA/CD</li>
        </ul>
      </Quadro>
    </>
  )
}

const EVOLUCAO = [
  { norma: '802.3a', taxa: '10 Mbps', nome: 'Padrão Ethernet', cor: '#9fc4e8', h: 0.9 },
  { norma: '802.3u', taxa: '100 Mbps', nome: 'Fast Ethernet', cor: '#6f9fd8', h: 1.5 },
  { norma: '802.3z', taxa: '1 Gbps', nome: 'Gigabit Ethernet', cor: '#4a7fc4', h: 2.1 },
  { norma: '802.3ae', taxa: '10 Gbps', nome: 'Dez-Gigabit Ethernet', cor: '#2f5fa0', h: 2.7 },
]

function Evolucao({ semNomes }: { semNomes: boolean }) {
  const ox = 0.5
  const xs = [-3.45, -1.15, 1.15, 3.45]
  return (
    <>
      <Rotulo pos={[ox, 5.2, 0]} classe="grande" escuro>
        IEEE 802.3 · Evolução do Padrão
      </Rotulo>
      {EVOLUCAO.map((e, i) => {
        const x = ox + xs[i]
        const linhaPontos: V3[] = [[ox, 4.85, 0], [x, 4.15, 0]]
        return (
          <group key={e.norma}>
            <Line points={linhaPontos} color="#4a5a6a" lineWidth={2} />
            <Caixa tam={[0.05, 4.15 - e.h, 0.05]} pos={[x, (4.15 + e.h) / 2, 0]} cor="#4a5a6a" sombra={false} />
            <Caixa tam={[2.0, e.h, 0.8]} pos={[x, e.h / 2, 0]} cor={e.cor} />
            <Rotulo pos={[x, e.h / 2, 0.42]} classe={`tijolo ${i > 0 ? 'claro' : ''}`}>
              {e.norma}
            </Rotulo>
            <Rotulo pos={[x, e.h + 0.4, 0]} classe="bits">
              {e.taxa}
            </Rotulo>
            {!semNomes && (
              <Rotulo pos={[x, 3.9, 0]} classe="mini">
                {e.nome}
              </Rotulo>
            )}
          </group>
        )
      })}
    </>
  )
}

const TABELA: [string, string, string][] = [
  ['802.3a', '1985', '10Base-2 (Ethernet Fina)'],
  ['802.3i', '1990', '10Base-T (Par Trançado)'],
  ['802.3j', '1993', '10Base-F (Fibra Óptica)'],
  ['802.3u', '1995', '100Base-T (Fast Ethernet)'],
  ['802.3z', '1998', '1000Base-X (Gigabit Ethernet)'],
  ['802.3ab', '1999', '1000Base-T (Gigabit Ethernet sobre Par Trançado)'],
  ['802.3ae', '2002', 'Ethernet de 10 Gigabits'],
  ['802.3at', '2005', 'Power over Ethernet Plus'],
  ['802.3db', '2022', 'Operação de 100 Gbit/s, 200 Gbit/s e 400 Gbit/s sobre fibra'],
  ['802.3dj', 'à definir', 'Operação de 1,6 Tbit/s'],
]

export function CenaEthernet(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'dix'
  const semNomes = !!cena.estado.semNomes
  const semAnos = !!cena.estado.semAnos
  const colunas: Col[] = [
    { id: 'padrao', titulo: 'Padrão', esconder: semNomes },
    { id: 'ano', titulo: 'ANO', esconder: semAnos },
    { id: 'desc', titulo: 'Descrição' },
  ]
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'dix' && <Dix />}
      {modo === 'evolucao' && <Evolucao semNomes={semNomes} />}
      {modo === 'tabela' && (
        <Tabela3D pos={[0.4, 2.4, 0]} largura={560} colunas={colunas} linhas={TABELA.map((l) => linha(colunas, l))} fonte={13} />
      )}
    </>
  )
}
