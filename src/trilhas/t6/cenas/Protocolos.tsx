import { Line } from '@react-three/drei'
import { Alvo, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Seta, Tijolo } from './comum'

// Fase 6.2 — pilha de protocolos TCP/IP e a relação entre eles (Aula 05 p2, p. 3).
// Modo "tabela": o quadro do slide (40 protocolos, cor = grupo), num painel de pé.
// Modo "relacao": a figura "Relação entre Protocolos" (HTTP, DNS, DHCP → TCP/UDP → IPv4),
// com os quadros amarelos do que cada um fornece e um dado descendo pelo caminho.

export type Grupo = 'rede' | 'web' | 'remotas' | 'gerencia' | 'multimidia' | 'roteamento'

export const GRUPOS: Record<Grupo, { nome: string; cor: string; claro?: boolean }> = {
  rede: { nome: 'Rede e Transporte', cor: '#8c8c8c', claro: true },
  web: { nome: 'Página Web e E-mail', cor: '#eef5b0' },
  remotas: { nome: 'Operações Remotas', cor: '#b7cde6' },
  gerencia: { nome: 'Gerência e Configuração', cor: '#f59a9a' },
  multimidia: { nome: 'Multimídia', cor: '#7fd49a' },
  roteamento: { nome: 'Roteamento', cor: '#fbbd7a' },
}

/** O quadro do slide, linha por linha (8 linhas × 5 colunas). */
const TABELA: [string, Grupo][][] = [
  [['ARP', 'rede'], ['HTTPS', 'web'], ['MGCP', 'multimidia'], ['RSVP', 'multimidia'], ['SNMP', 'gerencia']],
  [['BGP', 'roteamento'], ['ICMP', 'rede'], ['MPLS', 'roteamento'], ['RTCP', 'multimidia'], ['SSH', 'remotas']],
  [['BOOTP', 'gerencia'], ['IGMP', 'multimidia'], ['MTP', 'remotas'], ['RTP', 'multimidia'], ['TCP', 'rede']],
  [['DHCP', 'gerencia'], ['IMAP4-S', 'web'], ['NTP', 'gerencia'], ['RTSP', 'multimidia'], ['TELNET', 'remotas']],
  [['DNS', 'gerencia'], ['IPSec', 'rede'], ['OSPF', 'roteamento'], ['SCTP', 'multimidia'], ['TLS', 'rede']],
  [['FTP', 'remotas'], ['IPv4', 'rede'], ['POP3-S', 'web'], ['SIP', 'multimidia'], ['UDP', 'rede']],
  [['H323', 'multimidia'], ['IPv6', 'rede'], ['RDP', 'remotas'], ['SMB', 'remotas'], ['VRRP', 'roteamento']],
  [['HTTP', 'web'], ['LDAP', 'gerencia'], ['RIP', 'roteamento'], ['SMTP-S', 'web'], ['XMPP', 'multimidia']],
]

const COL = (c: number) => -4.3 + c * 1.5
const LIN = (l: number) => 4.75 - l * 0.6

function Tabela({ grupo, destaque, semCores }: { grupo?: Grupo; destaque?: string[]; semCores: boolean }) {
  return (
    <group>
      <Caixa tam={[10.6, 5.3, 0.12]} pos={[0.35, 2.55, -0.25]} cor="#f4f5f7" />
      <Caixa tam={[0.2, 0.2, 0.8]} pos={[-4.5, 0.1, -0.25]} cor="#9aa3ab" />
      <Caixa tam={[0.2, 0.2, 0.8]} pos={[5.2, 0.1, -0.25]} cor="#9aa3ab" />
      {TABELA.map((linha, l) =>
        linha.map(([nome, g], c) => {
          const apagado = (grupo && g !== grupo) || (destaque && !destaque.includes(nome))
          const info = GRUPOS[g]
          return (
            <Tijolo
              key={nome}
              pos={[COL(c), LIN(l), 0]}
              tam={[1.38, 0.5, 0.25]}
              cor={semCores ? '#e3e7ec' : info.cor}
              claro={!semCores && info.claro}
              texto={nome}
              apagado={!!apagado}
            />
          )
        }),
      )}
      {(Object.keys(GRUPOS) as Grupo[]).map((g, i) => (
        <group key={g}>
          <Caixa tam={[0.26, 0.5, 0.25]} pos={[3.35, 4.6 - i * 0.82, 0]} cor={semCores ? '#e3e7ec' : GRUPOS[g].cor} />
          <Rotulo pos={[3.6, 4.6 - i * 0.82, 0.15]} classe="dir mini" apagado={!!grupo && grupo !== g}>
            {GRUPOS[g].nome}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[-2.9, 0.12, 0.4]} classe="mini">
        Alguns protocolos da pilha…
      </Rotulo>
    </group>
  )
}

// ---------- relação entre protocolos ----------

const T: V3 = [1.7, 0.62, 0.45]
const POS = {
  HTTP: [-3.1, 4.1, 0] as V3,
  DNS: [0, 4.1, 0] as V3,
  DHCP: [3.1, 4.1, 0] as V3,
  TCP: [-3.1, 2.45, 0] as V3,
  UDP: [3.1, 2.45, 0] as V3,
  IPv4: [0, 0.75, 0] as V3,
}
const baixo = (p: V3): V3 => [p[0], p[1] - T[1] / 2 - 0.02, p[2]]
const cima = (p: V3): V3 => [p[0], p[1] + T[1] / 2 + 0.02, p[2]]
const JUNCAO = 1.55

/** Caminho do dado de cada protocolo de aplicação até o IPv4. */
const CAMINHOS: Record<'http' | 'dns' | 'dhcp', V3[]> = {
  http: [POS.HTTP, POS.TCP, [POS.TCP[0], JUNCAO, 0], [0, JUNCAO, 0], POS.IPv4],
  dhcp: [POS.DHCP, POS.UDP, [POS.UDP[0], JUNCAO, 0], [0, JUNCAO, 0], POS.IPv4],
  dns: [POS.DNS, POS.UDP, [POS.UDP[0], JUNCAO, 0], [0, JUNCAO, 0], POS.IPv4],
}
/** O DNS tem seta para o TCP e para o UDP: vai um dado por cada lado. */
const DNS_TCP: V3[] = [POS.DNS, POS.TCP, [POS.TCP[0], JUNCAO, 0], [0, JUNCAO, 0], POS.IPv4]
const COR_CAMINHO = { http: '#ef6f6c', dns: '#7458c4', dhcp: '#23915f' }
const frente = (p: V3): V3 => [p[0], p[1], 0.45]

function Fornece({ pos, children }: { pos: V3; children: React.ReactNode }) {
  return (
    <Rotulo pos={pos} classe="fornece">
      <u>Fornece</u>: {children}
    </Rotulo>
  )
}

function Relacao({ foco, semFornece }: { foco?: 'http' | 'dns' | 'dhcp'; semFornece: boolean }) {
  const liga = (de: V3, para: V3) => <Seta de={de} para={para} cor="#1d2733" raio={0.035} />
  const focos = foco ? [foco] : (['http', 'dns', 'dhcp'] as const)
  return (
    <group>
      <Caixa tam={[14.4, 4.75, 0.12]} pos={[0, 2.55, -0.45]} cor="#f4f5f7" />
      <Caixa tam={[0.2, 0.2, 0.8]} pos={[-6.8, 0.1, -0.45]} cor="#9aa3ab" />
      <Caixa tam={[0.2, 0.2, 0.8]} pos={[6.8, 0.1, -0.45]} cor="#9aa3ab" />
      <Tijolo pos={POS.HTTP} tam={T} cor="#b7cde6" texto="HTTP" />
      <Tijolo pos={POS.DNS} tam={T} cor="#b7cde6" texto="DNS" />
      <Tijolo pos={POS.DHCP} tam={T} cor="#b7cde6" texto="DHCP" />
      <Tijolo pos={POS.TCP} tam={T} cor="#a9d18e" texto="TCP" />
      <Tijolo pos={POS.UDP} tam={T} cor="#a9d18e" texto="UDP" />
      <Tijolo pos={POS.IPv4} tam={T} cor="#c1440e" claro texto="IPv4" />

      {liga(baixo(POS.HTTP), cima(POS.TCP))}
      {liga(baixo(POS.DHCP), cima(POS.UDP))}
      {liga([-0.3, baixo(POS.DNS)[1], 0], [-2.55, cima(POS.TCP)[1], 0])}
      {liga([0.3, baixo(POS.DNS)[1], 0], [2.55, cima(POS.UDP)[1], 0])}
      <Line points={[baixo(POS.TCP), [POS.TCP[0], JUNCAO, 0], [POS.UDP[0], JUNCAO, 0], baixo(POS.UDP)]} color="#1d2733" lineWidth={2.5} />
      {liga([0, JUNCAO, 0], cima(POS.IPv4))}

      {!semFornece && (
        <>
          <Fornece pos={[-5.75, 4.1, 0]}>o serviço de Páginas Web</Fornece>
          <Fornece pos={[5.75, 4.1, 0]}>
            serviço de configura. automática de <i>hosts</i>
          </Fornece>
          <Fornece pos={[-5.75, 2.35, 0]}>o serviço de entrega com garantia e orientado à conexão.</Fornece>
          <Fornece pos={[5.75, 2.35, 0]}>o serviço de entrega sem garantias e sem conexão.</Fornece>
          <Rotulo pos={[3.6, 0.8, 0.3]} classe="fornece">
            <u>Fornece</u>: o mecanismo de entrega não-confiável, sem conexão, fazendo o endereçamento lógico dos pacotes na rede.
          </Rotulo>
        </>
      )}

      {focos.flatMap((f, i) =>
        (f === 'dns' ? [CAMINHOS.dns, DNS_TCP] : [CAMINHOS[f]]).map((caminho, j) => (
          <Percurso key={f + j} pontos={caminho.map(frente)} velocidade={2.2} espera={0.35} atraso={i * 3.2} periodo={focos.length * 3.2 + 1.5}>
            <group scale={0.6}>
              <Dado tipo={f === 'http' ? 'documento' : 'mensagem'} cor={COR_CAMINHO[f]} sombra={false} />
            </group>
          </Percurso>
        )),
      )}
    </group>
  )
}

export function CenaProtocolos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'tabela'
  const grupo = cena.estado.grupo as Grupo | undefined
  const destaque = (cena.estado.destaque as string | undefined)?.split(',')
  const foco = cena.estado.foco as 'http' | 'dns' | 'dhcp' | undefined

  return (
    <>
      <Ilha raio={8.4} />
      {modo === 'relacao' ? (
        <>
          <Relacao foco={foco} semFornece={!!cena.estado.semFornece} />
          <Alvo id="http" pos={[POS.HTTP[0] - 1.1, POS.HTTP[1] + 0.5, 0.3]} cena={cena} />
          <Alvo id="tcp" pos={[POS.TCP[0] - 1.1, POS.TCP[1] + 0.5, 0.3]} cena={cena} />
          <Alvo id="udp" pos={[POS.UDP[0] + 1.1, POS.UDP[1] + 0.5, 0.3]} cena={cena} />
          <Alvo id="ipv4" pos={[POS.IPv4[0] - 1.1, POS.IPv4[1] + 0.5, 0.3]} cena={cena} />
        </>
      ) : (
        <Tabela grupo={grupo} destaque={destaque} semCores={!!cena.estado.semCores} />
      )}
    </>
  )
}
