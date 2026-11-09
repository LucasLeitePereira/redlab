import { Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Envelope, Notebook, Servidor } from '../../../three/modelos'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Etiqueta, Fileira, LARANJA, NEUTRO } from './comum'

// Fase 7.9 — correio eletrônico (Aula 06 p. 20–22): o endereço, a viagem SMTP → POP3/IMAP4
// e as portas atuais e obsoletas.

const parte = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6 }
const grande = { fontFamily: 'var(--mono)', fontSize: 34, fontWeight: 800, lineHeight: 1 }
const legenda = { fontFamily: 'var(--fonte)', fontSize: 12, fontWeight: 700, color: '#445', borderTop: '3px solid currentColor', paddingTop: 4 }

function Endereco() {
  return (
    <group>
      <Envelope pos={[0, 3.9, 0]} escala={2} />
      <Rotulo pos={[0, 3.0, 0]}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, padding: '8px 14px' }}>
          <div style={{ ...parte, color: '#2f6fb0' }}>
            <span style={grande}>luftf</span>
            <span style={legenda}>Endereço da caixa de correios</span>
          </div>
          <span style={{ ...grande, color: '#1d2733' }}>@</span>
          <div style={{ ...parte, color: LARANJA }}>
            <span style={grande}>yahoo.com.br</span>
            <span style={legenda}>Domínio</span>
          </div>
        </div>
      </Rotulo>
      <Servidor pos={[0, 0.12, 0.4]} escala={0.9} />
      <Rotulo pos={[0, 1.95, 0.4]} classe="mini">
        servidor de e-mail do domínio, com a caixa postal
      </Rotulo>
    </group>
  )
}

const CR: V3 = [-5.4, 0.14, 0]
const SG: V3 = [-1.9, 0.14, 0]
const SY: V3 = [1.9, 0.14, 0]
const CD: V3 = [5.4, 0.14, 0]

function Arquitetura({ destaque, semNomes }: { destaque: boolean; semNomes: boolean }) {
  const nomes = (n: string) =>
    semNomes ? null : (
      <>
        <b>{n}</b>
        <br />
      </>
    )
  return (
    <group>
      <Notebook pos={[CR[0], 0.12, 0]} escala={0.9} />
      <Servidor pos={[SG[0], 0.12, 0]} escala={0.8} />
      <Servidor pos={[SY[0], 0.12, 0]} escala={0.8} />
      <Notebook pos={[CD[0], 0.12, 0]} escala={0.9} rot={[0, -0.3, 0]} />
      <Ligacao pontos={[[CR[0] + 0.7, 0.14, 0], [SG[0] - 0.6, 0.14, 0]]} cor="#2f5fa0" raio={0.05} />
      <Ligacao pontos={[[SG[0] + 0.6, 0.14, 0], [SY[0] - 0.6, 0.14, 0]]} cor="#2f5fa0" raio={0.05} />
      <Ligacao pontos={[[SY[0] + 0.6, 0.14, 0], [CD[0] - 0.7, 0.14, 0]]} cor="#8a5a3b" raio={0.05} />

      <Rotulo pos={[CR[0], 1.7, 0]} classe="mini">
        Cliente de e-mail
        <br />
        <b>Remetente</b>
      </Rotulo>
      <Rotulo pos={[SG[0], 2.3, 0]} classe="mini">
        Servidor de Correios
        <br />
        do Remetente · <b>@gmail.com</b>
      </Rotulo>
      <Rotulo pos={[SY[0], 2.3, 0]} classe="mini">
        Servidor de Correios
        <br />
        do Destinatário · <b>@yahoo.com.br</b>
      </Rotulo>
      <Rotulo pos={[CD[0], 1.7, 0]} classe="mini">
        Cliente de e-mail
        <br />
        <b>Destinatário</b>
      </Rotulo>

      <Etiqueta pos={[-3.65, 1.0, 0]} destaque={destaque}>
        {nomes('SMTP')}
        TCP/25
      </Etiqueta>
      <Etiqueta pos={[0, 1.0, 0]} destaque={destaque}>
        {nomes('SMTP')}
        TCP/25
      </Etiqueta>
      <Etiqueta pos={[3.65, 1.0, 0]} destaque={destaque}>
        {nomes('POP3 / IMAP4')}
        TCP/110, TCP/443
      </Etiqueta>

      <Rotulo pos={[0, 4.2, 0]} escuro>
        Modo assíncrono: a mensagem espera no servidor até ser buscada
      </Rotulo>
      <Percurso pontos={[CR, SG, SY, CD]} velocidade={2.6} espera={0.8}>
        <group scale={0.7}>
          <Dado tipo="email" cor="#ef6f6c" sombra={false} />
        </group>
      </Percurso>
    </group>
  )
}

type LinhaPorta = { n: string; nome: string; desc: string }
const ATUAIS: LinhaPorta[] = [
  { n: '587', nome: 'SMTP-S', desc: 'envio autenticado e criptografado' },
  { n: '465', nome: 'SMTP-S', desc: 'envio apenas criptografado' },
  { n: '995', nome: 'POP3-S', desc: 'recebimento autenticado/criptografado' },
  { n: '993', nome: 'IMAP4', desc: 'recebimento autenticado/criptografado' },
]
const OBSOLETAS: LinhaPorta[] = [
  { n: '25', nome: 'SMTP', desc: 'envio de e-mails' },
  { n: '110', nome: 'POP3', desc: 'recebimento de e-mails' },
  { n: '143', nome: 'IMAP4', desc: 'recebimento' },
]

function Coluna({ x, titulo, cor, linhas, semNumeros }: { x: number; titulo: string; cor: string; linhas: LinhaPorta[]; semNumeros: boolean }) {
  return (
    <group>
      <Fileira y={4.9} x={x} largura={5.7} h={0.6} pequeno={false} itens={[{ t: titulo, f: 1, cor, claro: true }]} />
      {linhas.map((l, i) => (
        <Fileira
          key={l.n}
          y={4.0 - i * 0.85}
          x={x}
          largura={5.7}
          h={0.68}
          itens={[
            { t: semNumeros ? 'TCP/?' : `TCP/${l.n}`, f: 1.3, cor: NEUTRO },
            { t: l.nome, f: 1.2, cor: NEUTRO },
            { t: l.desc, f: 3.2, cor: '#ffffff' },
          ]}
        />
      ))}
    </group>
  )
}

function Portas({ semNumeros }: { semNumeros: boolean }) {
  return (
    <group>
      <Coluna x={-3.0} titulo="Portas e Serviços (atuais)" cor="#2e8b3d" linhas={ATUAIS} semNumeros={semNumeros} />
      <Coluna x={3.0} titulo="Obsoletas" cor="#8a8f96" linhas={OBSOLETAS} semNumeros={semNumeros} />
    </group>
  )
}

export function CenaEmail(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'endereco'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'endereco' && <Endereco />}
      {modo === 'arquitetura' && <Arquitetura destaque={cena.estado.destaque === 'protocolos'} semNomes={!!cena.estado.semNomes} />}
      {modo === 'portas' && <Portas semNumeros={!!cena.estado.semNumeros} />}
    </>
  )
}
