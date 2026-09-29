import { Line } from '@react-three/drei'
import { Alvo, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { arco } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Tijolo } from './comum'

// Fase 6.4 — organização da Internet e normas (RFC) (Aula 05 p2, p. 5–8).
// Modo "orgs": o organograma do slide — ISOC com IAB, IETF, IRTF e RFC Editor; ICANN com
// IANA; linhas pontilhadas de IAB, IETF e IRTF até a IANA. Modo "rfc": a cronologia dos RFCs
// do slide, uma coluna por ano (cor do ano como no slide).

export type IdOrg = 'isoc' | 'iab' | 'ietf' | 'irtf' | 'rfceditor' | 'icann' | 'iana'

const ORGS: Record<IdOrg, { sigla: string; nome: string; pos: V3; mae?: IdOrg }> = {
  isoc: { sigla: 'ISOC', nome: 'Internet Society', pos: [-3.0, 3.3, -1.2] },
  iab: { sigla: 'IAB', nome: 'Internet Architecture Board', pos: [-5.4, 1.2, 0.6], mae: 'isoc' },
  ietf: { sigla: 'IETF', nome: 'Internet Engineering Task Force', pos: [-3.8, 1.2, 0.6], mae: 'isoc' },
  irtf: { sigla: 'IRTF', nome: 'Internet Research Task Force', pos: [-2.2, 1.2, 0.6], mae: 'isoc' },
  rfceditor: { sigla: 'RFC Editor', nome: 'Request for Comment Editor', pos: [-0.6, 1.2, 0.6], mae: 'isoc' },
  icann: { sigla: 'ICANN', nome: 'Internet Corporation for Assigned Names and Numbers', pos: [3.6, 3.3, -1.2] },
  iana: { sigla: 'IANA', nome: 'Internet Assigned Numbers Authority', pos: [3.6, 1.2, 0.6], mae: 'icann' },
}

/** O texto do slide de cada organização (aparece no cartão quando ela está em foco). */
const CARTAO: Partial<Record<IdOrg, string>> = {
  isoc: 'Organização internacional não lucrativa, fundada em 1992, dedicada à expansão, desenvolvimento e acessibilidade da Internet.',
  iab: 'Conselho de Arquitetura da Internet. Grupo de aconselhamento tecnológico do ISOC.',
  ietf: 'Força-Tarefa de Engenharia da Internet. Pesquisas de curta duração sobre problemas de engenharia e normas.',
  irtf: 'Força-Tarefa de Pesquisas da Internet. Pesquisas a longo prazo: novos protocolos, aplicações, arquitetura e tecnologia.',
  iana: 'Autoridade para Atribuição de Números da Internet. Departamento da ICANN com três funções principais.',
}

function Organograma({ foco, semNomes }: { foco?: IdOrg; semNomes: boolean }) {
  return (
    <group>
      {(Object.keys(ORGS) as IdOrg[]).map((id) => {
        const o = ORGS[id]
        const grande = !o.mae
        const apagado = !!foco && foco !== id && ORGS[foco].mae !== id && !(foco === id)
        const tam: V3 = grande ? [2.6, 0.8, 0.9] : [1.45, 0.55, 0.55]
        return (
          <group key={id}>
            {/* pilar até o chão, como um pequeno prédio */}
            <Caixa tam={[tam[0] * 0.8, o.pos[1] - tam[1] / 2, tam[2] * 0.8]} pos={[o.pos[0], (o.pos[1] - tam[1] / 2) / 2, o.pos[2]]} cor="#e6e9ee" />
            <Tijolo pos={o.pos} tam={tam} cor={grande ? '#2d5f9a' : '#eef1f4'} claro={grande} texto={o.sigla} apagado={apagado} pequeno={id === 'rfceditor'} />
            {!semNomes && (
              <Rotulo pos={[o.pos[0], o.pos[1] + tam[1] / 2 + 0.3, o.pos[2]]} classe="mini" apagado={apagado}>
                <i>{o.nome}</i>
              </Rotulo>
            )}
            {o.mae && (
              <Line
                points={[
                  [ORGS[o.mae].pos[0], ORGS[o.mae].pos[1] - 0.4, ORGS[o.mae].pos[2] + 0.3],
                  [o.pos[0], o.pos[1] + 0.28, o.pos[2]],
                ]}
                color="#5c6670"
                lineWidth={3}
              />
            )}
          </group>
        )
      })}
      {(['iab', 'ietf', 'irtf'] as IdOrg[]).map((id) => (
        <Line
          key={id}
          points={arco([ORGS[id].pos[0], ORGS[id].pos[1] + 0.3, ORGS[id].pos[2]], [ORGS.iana.pos[0] - 0.4, ORGS.iana.pos[1] + 0.3, ORGS.iana.pos[2]], 1.2 + (6 - Math.abs(ORGS[id].pos[0])) * 0.1, 16)}
          color="#2f6fb0"
          lineWidth={2}
          dashed
          dashSize={0.12}
          gapSize={0.1}
        />
      ))}
      <Rotulo pos={[0.3, 4.6, -1.2]}>
        <b>ISOC</b> e <b>ICANN</b> são grupos influentes de direção da Internet
      </Rotulo>
      {foco && CARTAO[foco] && (
        <Rotulo pos={[ORGS[foco].pos[0] + (ORGS[foco].pos[0] < 0 ? 0 : -0.2), -0.1 + 0.6, 2.4]} classe="cartao">
          <b>{ORGS[foco].sigla}</b>
          {CARTAO[foco]}
        </Rotulo>
      )}
    </group>
  )
}

// ---------- cronologia dos RFCs ----------

type Rfc = { protocolo: string; numero: number; data: string; titulo: string }
const RFCS: Rfc[] = [
  { protocolo: 'Telnet', numero: 97, data: 'fev/1971', titulo: 'Telnet Protocol' },
  { protocolo: 'FTP', numero: 114, data: 'abr/1971', titulo: 'File Transfer Protocol' },
  { protocolo: 'IP', numero: 760, data: 'jan/1980', titulo: 'Internet Protocol' },
  { protocolo: 'TCP', numero: 761, data: 'jan/1980', titulo: 'Transmission Control Protocol' },
  { protocolo: 'UDP', numero: 768, data: 'ago/1980', titulo: 'User Datagram Protocol' },
  { protocolo: 'ICMP', numero: 777, data: 'abr/1981', titulo: 'Internet Control Message Protocol' },
  { protocolo: 'SMTP', numero: 788, data: 'nov/1981', titulo: 'Simple Mail Transfer Protocol' },
  { protocolo: 'DNS', numero: 882, data: 'nov/1983', titulo: 'Domain names: Concepts and facilities' },
  { protocolo: 'POP3', numero: 1081, data: 'nov/1988', titulo: 'Post Office Protocol: Version 3' },
  { protocolo: 'DHCP', numero: 1541, data: 'out/1993', titulo: 'Dynamic Host Configuration Protocol' },
  { protocolo: 'NAT', numero: 1631, data: 'mai/1994', titulo: 'The IP Network Address Translator (NAT)' },
  { protocolo: 'IMAP4', numero: 1730, data: 'dez/1994', titulo: 'Internet Message Access Protocol - Version 4' },
  { protocolo: 'HTTP/1.0', numero: 1945, data: 'mai/1996', titulo: 'Hypertext Transfer Protocol – HTTP/1.0' },
  { protocolo: 'HTTP/1.1', numero: 2616, data: 'jun/1999', titulo: 'Hypertext Transfer Protocol – HTTP/1.1' },
  { protocolo: 'HTTP-S', numero: 2818, data: 'mai/2000', titulo: 'HTTP over TLS' },
  { protocolo: 'SSH', numero: 4251, data: 'jan/2006', titulo: 'The Secure Shell' },
  { protocolo: 'POP3-S', numero: 5034, data: 'jun/2007', titulo: 'POP3 Authentication Mechanism' },
  { protocolo: 'SMTP-S', numero: 4954, data: 'jul/2007', titulo: 'SMTP Extension for Authentication' },
  { protocolo: 'IMAP4-S', numero: 4959, data: 'set/2007', titulo: 'IMAP4 Authentication Mechanism' },
]
const ANOS = [...new Set(RFCS.map((r) => Number(r.data.slice(-4))))]
const COR_ANO = (ano: number) => (ano < 1980 ? '#c2571a' : ano < 1990 ? '#2f6fb0' : ano < 2000 ? '#1f8a6a' : '#7b2d8e')
const XANO = (ano: number) => -5.3 + ANOS.indexOf(ano) * (10.6 / (ANOS.length - 1))

function Cronologia({ destaque, semNumeros }: { destaque?: string[]; semNumeros: boolean }) {
  return (
    <group>
      <Caixa tam={[11.8, 0.08, 0.5]} pos={[0, 0.06, 0.9]} cor="#5c6670" />
      {ANOS.map((ano) => {
        const doAno = RFCS.filter((r) => r.data.endsWith(String(ano)))
        const x = XANO(ano)
        return (
          <group key={ano}>
            <Rotulo pos={[x, 0.35, 1.25]} classe="bits">
              <span style={{ color: COR_ANO(ano) }}>{ano}</span>
            </Rotulo>
            {doAno.map((r, i) => {
              const apagado = !!destaque && !destaque.includes(r.protocolo)
              return (
                <group key={r.protocolo}>
                  <Tijolo pos={[x, 0.55 + i * 1.0, 0.3]} tam={[0.76, 0.92, 0.35]} cor={COR_ANO(ano)} claro texto={r.protocolo} apagado={apagado} pequeno />
                  {!semNumeros && (
                    <Rotulo pos={[x, 0.3 + i * 1.0, 0.5]} classe="mini" apagado={apagado}>
                      RFC {r.numero}
                    </Rotulo>
                  )}
                </group>
              )
            })}
          </group>
        )
      })}
      <Rotulo pos={[0, 4.4, 0]} classe="grande" escuro>
        <i>Request for Comment</i> — Cronologia
      </Rotulo>
    </group>
  )
}

export function CenaOrganizacao(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'orgs'
  const foco = cena.estado.foco as IdOrg | undefined

  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'rfc' ? (
        <Cronologia destaque={(cena.estado.destaque as string | undefined)?.split(',')} semNumeros={!!cena.estado.semNumeros} />
      ) : (
        <>
          <Organograma foco={foco} semNomes={!!cena.estado.semNomes} />
          {(['isoc', 'iab', 'ietf', 'irtf', 'iana'] as IdOrg[]).map((id) => (
            <Alvo key={id} id={id} pos={[ORGS[id].pos[0] + (ORGS[id].mae ? 0 : 1.6), ORGS[id].pos[1] + (ORGS[id].mae ? -0.65 : 0), ORGS[id].pos[2] + 0.4]} cena={cena} />
          ))}
        </>
      )}
    </>
  )
}
