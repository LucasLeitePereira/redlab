import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Fixo } from '../../../three/base'

// Prompt de comando e janelas do Windows da Aula 04, desenhados em HTML por cima da cena.
// As saídas são as dos slides (ipconfig p. 4, ipconfig/all p. 5, nslookup p. 13); os "⋮"
// marcam, como no slide, as linhas que foram cortadas.
//
// Nas saídas, {x:texto} pinta o texto com a cor do aparelho da cena:
// l = placa de rede (MAC), a = gateway, v = servidor DHCP, r = servidor DNS, i = IP do host.

export const COR_TERMINAL: Record<string, string> = {
  l: '#f08a3c',
  a: '#f2b134',
  v: '#4cc38a',
  r: '#b59cf0',
  i: '#7cc4ff',
}

const IPCONFIG = [
  'Configuração de IP do Windows',
  '',
  'Adaptador Ethernet Ethernet:',
  '',
  '   Endereço IPv4. . . . . . . : {i:192.168.10.1}',
  '   Máscara de Sub-rede . . . : 255.255.255.0',
  '   Gateway Padrão. . . . . . : {a:192.168.10.5}',
]

const IPCONFIG_ALL = [
  '   ⋮',
  '   Endereço Físico . . . . . . . . : {l:BA-16-3E-F4-A0-E5}',
  '   DHCP Habilitado . . . . . . . . : Sim',
  '   Configuração Automática Habilitada: Sim',
  '   ⋮',
  '   Endereço IPv4 . . . . . . . . . : {i:192.168.10.1}',
  '   Máscara de Sub-rede . . . . . . : 255.255.255.0',
  '   Gateway Padrão. . . . . . . . . : {a:192.168.10.5}',
  '   ⋮',
  '   Servidor DHCP . . . . . . . . . : {v:192.168.10.7}',
  '   Concessão Obtida. . . . . . . . : sábado, 27 de maio de 2023 21:59:08',
  '   Concessão Expira. . . . . . . . : quarta-feira, 6 de setembro de 2023 03:09:40',
  '   Servidores DNS. . . . . . . . . : {r:8.8.8.8}',
]

/** Registros da tabela do slide (p. 12) mais o "www" da unilasalle (p. 11 e 13). */
const NOMES: Record<string, string[]> = {
  'www.unilasalle.edu.br': ['Name:    www.unilasalle.edu.br', 'Address: {i:34.226.91.154}'],
  'svr-net03.lasalle.edu.br': ['Name:    svr-net03.lasalle.edu.br', 'Address: {i:45.181.173.133}'],
  'www.lasalle.edu.br': ['Name:    svr-net03.lasalle.edu.br', 'Address: {i:45.181.173.133}', 'Aliases: www.lasalle.edu.br'],
  'ns01.unilasalle.edu.br': ['Name:    ns01.unilasalle.edu.br', 'Address: {i:45.181.173.2}'],
  'ns02.unilasalle.edu.br': ['Name:    ns02.unilasalle.edu.br', 'Address: {i:45.181.173.3}'],
}

const NAO_RECONHECIDO = (cmd: string) => [
  `'${cmd.split(' ')[0]}' não é reconhecido como um comando interno`,
  'ou externo, um programa operável ou um arquivo em lotes.',
]

type Saida = { linhas: string[]; limpar?: boolean; abrir?: 'ncpa' }

function executar(bruto: string): Saida {
  const cmd = bruto.trim().replace(/\s+/g, ' ')
  const c = cmd.toLowerCase().replace('ipconfig/all', 'ipconfig /all')
  if (!c) return { linhas: [] }
  if (c === 'cls') return { linhas: [], limpar: true }
  if (c === 'ipconfig') return { linhas: IPCONFIG }
  if (c === 'ipconfig /all') return { linhas: IPCONFIG_ALL }
  if (c === 'ncpa.cpl') return { linhas: ['(abrindo a janela Conexões de Rede…)'], abrir: 'ncpa' }
  if (c === 'help' || c === 'ajuda') {
    return {
      linhas: [
        'Comandos deste laboratório:',
        '  ipconfig          configuração TCP/IP resumida',
        '  ipconfig /all     configuração completa',
        '  ncpa.cpl          janela Conexões de Rede',
        '  nslookup <nome>   consulta um nome ao DNS',
        '  cls               limpa a tela',
      ],
    }
  }
  if (c === 'nslookup') return { linhas: ['Aqui use: nslookup <nome>  (ex.: nslookup www.unilasalle.edu.br)'] }
  if (c.startsWith('nslookup ')) {
    const nome = c.slice(9).replace(/\.$/, '')
    const achado = NOMES[nome]
    if (!achado) return { linhas: [`*** O servidor DNS não encontrou ${nome}: Non-existent domain`] }
    return { linhas: ['Non-authoritative answer:', ...achado] }
  }
  return { linhas: NAO_RECONHECIDO(cmd) }
}

/** Troca os {x:texto} por spans coloridos. */
function Linha({ texto }: { texto: string }) {
  const partes: ReactNode[] = []
  let resto = texto
  let k = 0
  for (let m = /\{(\w):([^}]*)\}/.exec(resto); m; m = /\{(\w):([^}]*)\}/.exec(resto)) {
    partes.push(<Fragment key={k++}>{resto.slice(0, m.index)}</Fragment>)
    partes.push(
      <b key={k++} style={{ color: COR_TERMINAL[m[1]] }}>
        {m[2]}
      </b>,
    )
    resto = resto.slice(m.index + m[0].length)
  }
  partes.push(<Fragment key={k++}>{resto}</Fragment>)
  return <div className="terminal-linha">{partes}</div>
}

type Entrada = { cmd: string; linhas: string[] }

/**
 * Prompt de comando que dá para usar de verdade: aceita ipconfig, ipconfig /all, ncpa.cpl,
 * nslookup e cls. `comando` já vem executado quando o passo abre; `sugestoes` viram botões.
 */
/**
 * Rola a tela do prompt até o fim quando `versao` muda. Fica DENTRO do Fixo: o Html do drei
 * desenha os filhos numa raiz React própria, depois do pai; um efeito no Terminal rodaria
 * antes das linhas novas existirem e a rolagem parava no meio da saída.
 */
function RolarAoFim({ versao }: { versao: unknown }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const tela = ref.current?.parentElement
    if (tela) tela.scrollTop = tela.scrollHeight
  }, [versao])
  return <div ref={ref} />
}

export function Terminal({
  comando,
  sugestoes = [],
  onAbrir,
}: {
  comando?: string
  sugestoes?: string[]
  onAbrir?: (janela: 'ncpa') => void
}) {
  const inicial = (): Entrada[] => (comando ? [{ cmd: comando, linhas: executar(comando).linhas }] : [])
  const [historico, setHistorico] = useState<Entrada[]>(inicial)
  const [texto, setTexto] = useState('')

  // passo novo, comando novo: a tela recomeça
  useEffect(() => {
    setHistorico(inicial())
  }, [comando]) // eslint-disable-line react-hooks/exhaustive-deps

  const rodar = (cmd: string) => {
    const s = executar(cmd)
    setHistorico((h) => (s.limpar ? [] : [...h, { cmd, linhas: s.linhas }]))
    if (s.abrir) onAbrir?.(s.abrir)
    setTexto('')
  }

  return (
    <Fixo x={16} y={84}>
      <div className="terminal" onPointerDown={(e) => e.stopPropagation()}>
        <div className="terminal-barra">
          <span>Prompt de Comando</span>
          <span className="terminal-botoes">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="terminal-tela">
          {historico.map((e, i) => (
            <div key={i} className="terminal-bloco">
              <div className="terminal-linha">
                C:\&gt; <span className="terminal-cmd">{e.cmd}</span>
              </div>
              {e.linhas.map((l, j) => (
                <Linha key={j} texto={l} />
              ))}
            </div>
          ))}
          <form
            className="terminal-linha terminal-entrada"
            onSubmit={(ev) => {
              ev.preventDefault()
              rodar(texto)
            }}
          >
            C:\&gt;&nbsp;
            <input
              value={texto}
              onChange={(ev) => setTexto(ev.target.value)}
              spellCheck={false}
              autoComplete="off"
              aria-label="Digite um comando"
              placeholder="digite um comando e Enter"
            />
          </form>
          <RolarAoFim versao={historico} />
        </div>
        {sugestoes.length > 0 && (
          <div className="terminal-sugestoes">
            <span>Experimente:</span>
            {sugestoes.map((s) => (
              <button key={s} onClick={() => rodar(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </Fixo>
  )
}

// ---------- Janelas do Windows (ncpa.cpl → Propriedades → TCP/IPv4), slides p. 5–6 ----------

export type ModoIP = 'automatico' | 'manual'

function Radio({ marcado, onClick, children }: { marcado: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <label className="win-radio" onClick={onClick}>
      <span className={`win-bolinha ${marcado ? 'marcado' : ''}`} />
      {children}
    </label>
  )
}

function Campo({ rotulo, valor, ativo }: { rotulo: string; valor: string; ativo: boolean }) {
  return (
    <div className={`win-campo ${ativo ? '' : 'inativo'}`}>
      <span>{rotulo}</span>
      <span className="win-valor">{ativo ? valor : ' .   .   . '}</span>
    </div>
  )
}

function JanelaIPv4({ modo, onModo, onFechar }: { modo: ModoIP; onModo: (m: ModoIP) => void; onFechar?: () => void }) {
  const manual = modo === 'manual'
  return (
    <div className="win-janela">
      <div className="win-titulo">
        Propriedades de Protocolo IP Versão 4 (TCP/IPv4)
        {onFechar && (
          <button className="win-x" onClick={onFechar} aria-label="Fechar">
            ✕
          </button>
        )}
      </div>
      <div className="win-abas">
        <span className="ativa">Geral</span>
        <span>Configuração alternativa</span>
      </div>
      <div className="win-corpo">
        <p className="win-texto">
          As configurações IP podem ser atribuídas automaticamente se a rede oferecer suporte a esse recurso. Caso contrário, você precisa
          solicitar ao administrador de rede as configurações IP adequadas.
        </p>
        <Radio marcado={!manual} onClick={() => onModo('automatico')}>
          Obter um endereço IP automaticamente
        </Radio>
        <Radio marcado={manual} onClick={() => onModo('manual')}>
          Usar o seguinte endereço IP:
        </Radio>
        <Campo rotulo="Endereço IP:" valor="192.168.10.1" ativo={manual} />
        <Campo rotulo="Máscara de sub-rede:" valor="255.255.255.0" ativo={manual} />
        <Campo rotulo="Gateway padrão:" valor="192.168.10.5" ativo={manual} />
        <div className="win-sep" />
        <Radio marcado={!manual} onClick={() => onModo('automatico')}>
          Obter o endereço dos servidores DNS automaticamente
        </Radio>
        <Radio marcado={manual} onClick={() => onModo('manual')}>
          Usar os seguintes endereços de servidor DNS:
        </Radio>
        <Campo rotulo="Servidor DNS preferencial:" valor="8.8.8.8" ativo={manual} />
        <Campo rotulo="Servidor DNS alternativo:" valor="" ativo={manual} />
      </div>
    </div>
  )
}

const MENU = ['Desativar', 'Status', 'Diagnosticar', '—', 'Conexões de Ponte', '—', 'Criar Atalho', 'Excluir', 'Renomear', '—', 'Propriedades']
const ITENS_ETHERNET = [
  'Agendador de pacotes de serviço',
  'Protocolo IP Versão 4 (TCP/IPv4)',
  'Protocolo do Multiplexador de Adaptador de Rede da Microsoft',
  'Driver de Protocolo LLDP da Microsoft',
]

type Tela = 'ncpa' | 'ethernet' | 'ipv4'

/**
 * O caminho do slide, clicável: Conexões de Rede → botão direito em Ethernet → Propriedades →
 * Protocolo IP Versão 4 → Propriedades. `inicio` escolhe a janela em que o passo começa.
 */
export function JanelasWindows({
  inicio,
  modo,
  onModo,
  onFechar,
}: {
  inicio: Tela
  modo: ModoIP
  onModo: (m: ModoIP) => void
  /** Volta ao prompt (quando a janela foi aberta pelo ncpa.cpl digitado). */
  onFechar?: () => void
}) {
  const [tela, setTela] = useState<Tela>(inicio)
  const [item, setItem] = useState(1)
  useEffect(() => {
    setTela(inicio)
  }, [inicio])

  return (
    <Fixo x={16} y={84}>
      <div className="win" onPointerDown={(e) => e.stopPropagation()}>
        {tela === 'ncpa' && (
          <div className="win-janela">
            <div className="win-titulo">
              Conexões de Rede
              {onFechar && (
                <button className="win-x" onClick={onFechar} aria-label="Fechar e voltar ao prompt">
                  ✕
                </button>
              )}
            </div>
            <div className="win-corpo win-ncpa">
              <div className="win-adaptador selecionado">
                <span className="win-icone">🖧</span>
                <span>
                  <b>Ethernet</b>
                  <br />
                  Rede 4<br />
                  Intel(R) PRO/1000 MT Desktop Ad...
                </span>
              </div>
              <div className="win-menu" role="menu">
                {MENU.map((m, i) =>
                  m === '—' ? (
                    <div key={i} className="win-sep" />
                  ) : (
                    <button
                      key={i}
                      role="menuitem"
                      className={m === 'Propriedades' ? 'destaque' : ''}
                      disabled={m !== 'Propriedades'}
                      onClick={() => setTela('ethernet')}
                    >
                      {m}
                    </button>
                  ),
                )}
              </div>
              <div className="win-rodape">1 item · 1 item selecionado · clique em Propriedades</div>
            </div>
          </div>
        )}
        {tela === 'ethernet' && (
          <div className="win-janela">
            <div className="win-titulo">
              Propriedades de Ethernet
              <button className="win-x" onClick={() => setTela('ncpa')} aria-label="Fechar">
                ✕
              </button>
            </div>
            <div className="win-abas">
              <span className="ativa">Rede</span>
            </div>
            <div className="win-corpo">
              <div className="win-texto">Conectar-se usando: Intel(R) PRO/1000 MT Desktop Adapter</div>
              <div className="win-texto">Esta conexão utiliza os seguintes itens:</div>
              <div className="win-lista">
                {ITENS_ETHERNET.map((t, i) => (
                  <button key={t} className={i === item ? 'selecionado' : ''} onClick={() => setItem(i)}>
                    ☑ {t}
                  </button>
                ))}
              </div>
              <div className="win-botoes">
                <button disabled>Instalar...</button>
                <button disabled>Desinstalar</button>
                <button className="destaque" disabled={item !== 1} onClick={() => setTela('ipv4')}>
                  Propriedades
                </button>
              </div>
              <div className="win-texto win-pequeno">
                {item === 1
                  ? 'Selecione o Protocolo IP Versão 4 e clique em Propriedades.'
                  : 'Dica: as configurações de IP ficam no item “Protocolo IP Versão 4 (TCP/IPv4)”.'}
              </div>
            </div>
          </div>
        )}
        {tela === 'ipv4' && <JanelaIPv4 modo={modo} onModo={onModo} onFechar={inicio === 'ipv4' ? undefined : () => setTela('ethernet')} />}
      </div>
    </Fixo>
  )
}
