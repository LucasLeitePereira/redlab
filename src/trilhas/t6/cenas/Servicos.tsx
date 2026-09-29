import { Alvo, Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import type { Viagem } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 6.3 — protocolos comuns da Internet e o serviço de cada um (Aula 05 p2, p. 4).
// O computador do usuário na frente e seis servidores em arco atrás, um por linha do slide.
// No modo de um serviço, o cabo dele acende e os dados andam (vermelho = pedido/envio,
// azul = resposta/recebimento).

export type IdServico = 'web' | 'email' | 'ftp' | 'remoto' | 'dns' | 'dhcp'

export const SERVICOS: { id: IdServico; nome: string; protocolos: string; servico: string; pos: V3 }[] = [
  { id: 'web', nome: 'Servidor Web', protocolos: 'HTTP · HTTPS', servico: 'Transferência de Hipertexto (Página WEB)', pos: [-5.7, 0.12, -0.4] },
  { id: 'email', nome: 'Servidor de E-mail', protocolos: 'SMTP · SMTP-S\nPOP3/S · IMAP4/S', servico: 'Envio e recebimento de E-mail', pos: [-3.5, 0.12, -2.3] },
  { id: 'ftp', nome: 'Servidor de Arquivos', protocolos: 'FTP', servico: 'Transferência de Arquivos', pos: [-1.2, 0.12, -3.2] },
  { id: 'remoto', nome: 'Computador remoto', protocolos: 'TELNET · SSH', servico: 'Controle Remoto', pos: [1.2, 0.12, -3.2] },
  { id: 'dns', nome: 'Servidor DNS', protocolos: 'DNS', servico: 'Resolução de Nome de Domínios', pos: [3.5, 0.12, -2.3] },
  { id: 'dhcp', nome: 'Servidor DHCP', protocolos: 'DHCP', servico: 'Configuração Automática de Hosts', pos: [5.7, 0.12, -0.4] },
]

const PC: V3 = [0, 0.12, 3.0]
const VERMELHO = '#ef6f6c'
const AZUL = '#3aa0e6'

const VIAGENS: Record<IdServico, Viagem[]> = {
  web: [{ cor: VERMELHO, tipo: 'mensagem' }, { cor: AZUL, tipo: 'documento', inverso: true, atraso: 1.5 }],
  email: [{ cor: VERMELHO, tipo: 'email' }, { cor: AZUL, tipo: 'email', inverso: true, atraso: 1.5 }],
  ftp: [{ cor: VERMELHO }, { cor: AZUL, inverso: true, atraso: 1.5 }],
  remoto: [{ cor: VERMELHO, tipo: 'mensagem' }, { cor: AZUL, tipo: 'mensagem', inverso: true, atraso: 1.5 }],
  dns: [{ cor: VERMELHO, tipo: 'mensagem' }, { cor: AZUL, tipo: 'mensagem', inverso: true, atraso: 1.5 }],
  dhcp: [{ cor: VERMELHO, tipo: 'mensagem' }, { cor: AZUL, tipo: 'documento', inverso: true, atraso: 1.5 }],
}

/** O que acontece no exemplo de cada serviço (rótulos perto do computador). */
const LEGENDA: Record<IdServico, [string, string]> = {
  web: ['pede a página', 'a página chega'],
  email: ['SMTP: envia o e-mail', 'POP3/IMAP4: recebe os e-mails'],
  ftp: ['envia um arquivo', 'baixa um arquivo'],
  remoto: ['>_ comando', 'resultado na tela'],
  dns: ['www.google.com.br ?', 'o número IP'],
  dhcp: ['preciso de configuração', 'IP · máscara · gateway · DNS'],
}

export function CenaServicos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'todos'
  const semNomes = !!cena.estado.semNomes
  const foco = SERVICOS.find((s) => s.id === modo)
  // Sem nomes, a legenda também não pode entregar o protocolo ("SMTP: …").
  const legenda = (i: 0 | 1) => (foco ? (semNomes ? LEGENDA[foco.id][i].replace(/^[\w/]+: /, '') : LEGENDA[foco.id][i]) : '')

  return (
    <>
      <Ilha raio={8.6} />
      <Lote pos={PC} tam={[2.2, 1.6]} />
      <Computador pos={PC} rot={[0, 0, 0]} escala={0.85} />
      <Rotulo pos={[PC[0], 1.9, PC[2]]} escuro>
        Usuário
      </Rotulo>

      {SERVICOS.map((s) => {
        const ativo = !foco || foco.id === s.id
        return (
          <group key={s.id}>
            <Lote pos={s.pos} tam={[1.4, 1.4]} />
            <Servidor pos={s.pos} rot={[0, -Math.atan2(s.pos[0], 3.5 - s.pos[2]) * 0.6, 0]} escala={0.85} />
            <Ligacao
              pontos={[[PC[0], 0.14, PC[2] - 0.5], [s.pos[0], 0.14, s.pos[2] + 0.55]]}
              cor={foco?.id === s.id ? '#2f5fa0' : '#8fa6c2'}
              raio={foco?.id === s.id ? 0.06 : 0.035}
              viagens={foco?.id === s.id ? VIAGENS[s.id] : []}
            />
            <Rotulo pos={[s.pos[0], 2.35, s.pos[2]]} apagado={!ativo} escuro={foco?.id === s.id}>
              {semNomes ? '?' : s.nome}
            </Rotulo>
            {!semNomes && (
              <Rotulo pos={[s.pos[0], 1.85, s.pos[2]]} classe="papel" apagado={!ativo}>
                {s.protocolos}
              </Rotulo>
            )}
            <Alvo id={s.id} pos={[s.pos[0], 2.9, s.pos[2]]} cena={cena} />
          </group>
        )
      })}

      {foco && (
        <>
          {!semNomes && (
            <Rotulo pos={[0, 3.6, -3.2]} classe="grande">
              ⇨ {foco.servico}
            </Rotulo>
          )}
          <Rotulo pos={[-2.4, 0.5, 2.7]}>
            <span style={{ color: VERMELHO }}>●</span> {legenda(0)}
          </Rotulo>
          <Rotulo pos={[2.6, 0.5, 2.7]}>
            <span style={{ color: AZUL }}>●</span> {legenda(1)}
          </Rotulo>
        </>
      )}

      <Arvore pos={[-6.6, 0, 2.6]} escala={0.9} />
      <Arvore pos={[6.4, 0, 2.9]} />
    </>
  )
}
