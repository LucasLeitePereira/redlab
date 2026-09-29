import { Line } from '@react-three/drei'
import { Alvo, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Tijolo } from './comum'

// Fase 6.5 — pseudocamadas do TCP/IP e RM-OSI × TCP/IP (Aula 05 p3, p. 2).
// Modo "pseudo": as três prateleiras do slide (aplicação, transporte, rede) com os protocolos
// de cada uma e as aplicações dos usuários em cima. Modo "comparar": a pilha do RM-OSI ao
// lado da do TCP/IP (Aplicação do tamanho de 3 camadas, Inter-redes, Interface de Rede).

const AZUL = '#b7cde6'
const VERDE = '#a9d18e'
const LARANJA = '#c1440e'

const APLICACAO = [
  ['HTTPS', 'SMTP-S', 'DHCP'],
  ['HTTP', 'POP3-S', 'DNS'],
  ['FTP', 'IMAP4-S'],
  ['SSH', 'TELNET'],
]
const COLX = [-3.3, -1.95, -0.6]
const T: V3 = [1.25, 0.46, 0.3]

type Faixa = 'aplicacao' | 'transporte' | 'rede'

function Pseudo({ foco, semNomes }: { foco?: Faixa; semNomes: boolean }) {
  const apaga = (f: Faixa) => !!foco && foco !== f
  return (
    <group>
      <Caixa tam={[10.2, 5.2, 0.1]} pos={[0.4, 2.65, -0.3]} cor="#f4f5f7" />
      <Rotulo pos={[-1.95, 5.0, 0.2]} classe="grande">
        🌐 ✉️ 💻 📁 🌍 💬
      </Rotulo>
      <Rotulo pos={[2.9, 5.0, 0.2]}>
        <b>Aplicações dos usuários</b>
      </Rotulo>

      {APLICACAO.map((linha, l) =>
        linha.map((nome, c) => <Tijolo key={nome} pos={[COLX[c], 4.25 - l * 0.56, 0]} tam={T} cor={AZUL} texto={nome} apagado={apaga('aplicacao')} />),
      )}
      {['TCP', 'UDP'].map((nome, i) => (
        <Tijolo key={nome} pos={[-2.65 + i * 1.4, 1.75, 0]} tam={T} cor={VERDE} texto={nome} apagado={apaga('transporte')} />
      ))}
      {['IPv4', 'ARP', 'ICMP'].map((nome, i) => (
        <Tijolo key={nome} pos={[COLX[i], 0.75, 0]} tam={T} cor={LARANJA} claro texto={nome} apagado={apaga('rede')} />
      ))}

      {[2.3, 1.25].map((y) => (
        <Line key={y} points={[[-4.4, y, 0], [5.3, y, 0]]} color="#8a939c" lineWidth={1.5} dashed dashSize={0.12} gapSize={0.1} />
      ))}

      {!semNomes && (
        <>
          <Rotulo pos={[2.85, 3.45, 0.2]} classe="cartao" apagado={apaga('aplicacao')}>
            <b>“CAMADA DE APLICAÇÃO”</b>
            Protocolos que prestam serviços as aplicações do usuário.
          </Rotulo>
          <Rotulo pos={[2.85, 1.78, 0.2]} classe="cartao" apagado={apaga('transporte')}>
            <b>“CAMADA DE TRANSPORTE”</b>… prestam serviço de entrega das mensagens.
          </Rotulo>
          <Rotulo pos={[2.85, 0.72, 0.2]} classe="cartao" apagado={apaga('rede')}>
            <b>“CAMADA DE REDE”</b>… endereçamento e roteamento
          </Rotulo>
        </>
      )}
    </group>
  )
}

// ---------- RM-OSI × TCP/IP ----------

const XO = -2.4
const XT = 2.4
const H = 0.58
const yc = (n: number) => 0.4 + (n - 1) * H
const TOPO = (n: number) => yc(n) + H / 2 - 0.02
const BASE = (n: number) => yc(n) - H / 2 + 0.02
const OSI = ['FÍSICA', 'ENLACE', 'REDE', 'TRANSPORTE', 'SESSÃO', 'APRESENTAÇÃO', 'APLICAÇÃO']

function Comparar({ foco, semNomes }: { foco?: string; semNomes: boolean }) {
  const tcp: { nome: string; de: number; ate: number; cor: string; claro?: boolean }[] = [
    { nome: 'APLICAÇÃO', de: BASE(5), ate: TOPO(7), cor: '#6f9fd2' },
    { nome: 'TRANSPORTE', de: BASE(4), ate: TOPO(4), cor: VERDE },
    { nome: 'INTER-REDES', de: BASE(3), ate: TOPO(3), cor: '#b8451a', claro: true },
    { nome: 'Interface de Rede', de: TOPO(2) - 0.3, ate: TOPO(2), cor: '#fbf6c8' },
  ]
  return (
    <group>
      <Rotulo pos={[XO, TOPO(7) + 0.45, 0]} classe="grande">
        <b>RM-OSI</b>
      </Rotulo>
      <Rotulo pos={[XT, TOPO(7) + 0.45, 0]} classe="grande">
        <b>TCP/IP</b>
      </Rotulo>
      {OSI.map((nome, i) => (
        <Tijolo key={nome} pos={[XO, yc(i + 1), 0]} tam={[2.4, H - 0.04, 1.2]} cor={i < 4 ? '#8f969d' : '#c9cdd1'} claro={i < 4} texto={nome} pequeno />
      ))}
      {tcp.map((c) => {
        const apagado = foco === 'interface' && c.nome !== 'Interface de Rede'
        return (
          <Tijolo
            key={c.nome}
            pos={[XT, (c.de + c.ate) / 2, 0]}
            tam={[2.4, c.ate - c.de, 1.2]}
            cor={c.cor}
            claro={c.claro}
            texto={semNomes && c.nome !== 'APLICAÇÃO' ? '?' : c.nome}
            apagado={apagado}
            pequeno={c.nome === 'Interface de Rede'}
          />
        )
      })}
      {/* linhas pontilhadas ligando as fronteiras das duas pilhas */}
      {[TOPO(7), BASE(5), BASE(4), BASE(3), TOPO(2) - 0.3].map((y) => (
        <Line key={y} points={[[XO + 1.2, y, 0.6], [XT - 1.2, y, 0.6]]} color="#5c6670" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.07} />
      ))}
      {foco === 'interface' && (
        <Rotulo pos={[XT + 3.0, TOPO(2) - 0.4, 0.4]} classe="cartao">
          <b>Interface de Rede</b>faz a ligação com a contraparte física da rede, que não faz parte do TCP/IP.
        </Rotulo>
      )}
    </group>
  )
}

export function CenaTcpIp(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'pseudo'
  const foco = cena.estado.foco as string | undefined
  const semNomes = !!cena.estado.semNomes

  return (
    <>
      <Ilha raio={8.4} />
      {modo === 'comparar' ? (
        <>
          <Comparar foco={foco} semNomes={semNomes} />
          <Alvo id="interface" pos={[XT + 1.55, TOPO(2) - 0.15, 0.6]} cena={cena} />
          <Alvo id="aplicacao-tcp" pos={[XT + 1.55, yc(6), 0.6]} cena={cena} />
        </>
      ) : (
        <>
          <Pseudo foco={foco as Faixa | undefined} semNomes={semNomes} />
          <Alvo id="aplicacao" pos={[-4.3, 3.45, 0.3]} cena={cena} />
          <Alvo id="transporte" pos={[-4.3, 1.75, 0.3]} cena={cena} />
          <Alvo id="rede" pos={[-4.3, 0.75, 0.3]} cena={cena} />
        </>
      )}
    </>
  )
}
