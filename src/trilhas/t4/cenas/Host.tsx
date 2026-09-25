import { useEffect, useState } from 'react'
import { Alvo, Arvore, Esfera, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, PlacaDeRede, Roteador, Servidor, Switch } from '../../../three/modelos'
import { Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { JanelasWindows, Terminal, type ModoIP } from './Terminal'

// Fases 4.1 e 4.2 — configurando o host (Aula 04, p. 2–6).
// 4.1: a figura do slide p. 2 (três hosts num barramento e a gateway com um IP em cada
// sub-rede) e o endereço MAC (p. 3–4). 4.2: o mesmo host visto pelo ipconfig e pelo ncpa.cpl.

const Y = 0.16
const AZUL = '#2f6fb0'
const VERDE = '#23915f'
/** Cores dos aparelhos na cena (as mesmas do terminal, mais escuras para o fundo claro). */
const COR = {
  mac: '#d9691e',
  gateway: '#b77d06',
  dhcp: '#23915f',
  dns: '#7458c4',
  ip: '#2f6fb0',
}

/** No slide os pontos do IP são "·": fica igual aqui. */
const ponto = (ip: string) => ip.replaceAll('.', '·')

// ---------- 4.1 — Endereçamento lógico (p. 2–3) ----------

const BARRA_Z = -0.6
const GW_X = 1.2
const GW_Z = -3.3
const HOSTS = [
  { x: -4.4, ip: '192.168.10.1', gw: '192.168.10.5', cor: AZUL },
  { x: -1.5, ip: '192.168.10.2', gw: '192.168.10.5', cor: AZUL },
  { x: 4.4, ip: '192.168.20.1', gw: '192.168.20.5', cor: VERDE },
]
const LINHAS_Z = [2.35, 2.85, 3.35]

/** `oculto`: IP do host cujo gateway aparece como “?” (a pergunta do desafio). */
function Logico({ cena, rota, oculto }: { cena: CenaProps; rota: boolean; oculto?: string }) {
  const naBarra = (x: number): V3 => [x, Y, BARRA_Z]
  return (
    <>
      <Ligacao
        pontos={[
          [-6.2, Y, BARRA_Z],
          [6.2, Y, BARRA_Z],
        ]}
        raio={0.08}
        cor="#2d3540"
      />

      {/* gateway: um host com uma perna em cada sub-rede */}
      <Lote pos={[GW_X, 0, GW_Z]} tam={[3.2, 2]} />
      <Computador pos={[GW_X, 0.12, GW_Z]} escala={1.15} />
      <Ligacao pontos={[[GW_X - 0.5, Y, GW_Z + 0.6], naBarra(GW_X - 0.5)]} raio={0.06} cor={AZUL} />
      <Ligacao pontos={[[GW_X + 0.5, Y, GW_Z + 0.6], naBarra(GW_X + 0.5)]} raio={0.06} cor={VERDE} />
      <Rotulo pos={[GW_X - 1.2, 1.25, GW_Z + 0.2]} classe="esq bits">
        <span style={{ color: AZUL }}>{ponto('192.168.10.5')}</span> · 255·255·255·0
      </Rotulo>
      <Rotulo pos={[GW_X + 1.2, 1.25, GW_Z + 0.2]} classe="dir bits">
        <span style={{ color: VERDE }}>{ponto('192.168.20.5')}</span> · 255·255·255·0
      </Rotulo>
      <Rotulo pos={[GW_X, 2.05, GW_Z]} escuro>
        gateway
      </Rotulo>
      <Alvo id="gateway" pos={[GW_X, 2.75, GW_Z]} cena={cena} />

      {HOSTS.map((h) => (
        <group key={h.ip}>
          <Ligacao pontos={[naBarra(h.x), [h.x, Y, 0.45]]} raio={0.06} cor={h.cor} />
          <Lote pos={[h.x, 0, 1.1]} tam={[2.4, 1.6]} />
          <Computador pos={[h.x, 0.12, 1.1]} escala={0.95} />
          <Rotulo pos={[h.x, 0.25, LINHAS_Z[0]]} classe="bits">
            {ponto(h.ip)}
          </Rotulo>
          <Rotulo pos={[h.x, 0.25, LINHAS_Z[1]]} classe="bits">
            255·255·255·0
          </Rotulo>
          <Rotulo pos={[h.x, 0.25, LINHAS_Z[2]]} classe="bits">
            {h.ip === oculto ? <b>?</b> : <span style={{ color: h.cor }}>{ponto(h.gw)}</span>}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[-6.1, 0.25, LINHAS_Z[0]]} classe="esq">
        Endereço IP →
      </Rotulo>
      <Rotulo pos={[-6.1, 0.25, LINHAS_Z[1]]} classe="esq">
        Máscara →
      </Rotulo>
      <Rotulo pos={[-6.1, 0.25, LINHAS_Z[2]]} classe="esq">
        <i>Gateway</i> →
      </Rotulo>
      <Alvo id="ip" pos={[-8.2, 0.3, LINHAS_Z[0] - 0.2]} cena={cena} />
      <Alvo id="mascara" pos={[-8.2, 0.3, LINHAS_Z[1] + 0.45]} cena={cena} />

      {rota && <RotaPelaGateway />}
    </>
  )
}

/** 192.168.10.1 → gateway → 192.168.20.1: a gateway é o host que permite acessar a outra sub-rede. */
function RotaPelaGateway() {
  const [a, b] = [HOSTS[0], HOSTS[2]]
  const caminho: V3[] = [
    [a.x, Y, 0.45],
    [a.x, Y, BARRA_Z],
    [GW_X - 0.5, Y, BARRA_Z],
    [GW_X - 0.5, Y, GW_Z + 0.6],
    [GW_X + 0.5, Y, GW_Z + 0.6],
    [GW_X + 0.5, Y, BARRA_Z],
    [b.x, Y, BARRA_Z],
    [b.x, Y, 0.45],
  ]
  const velocidade = 2.6
  const { chegadas, total } = linhaDoTempo(caminho, velocidade, 0.3)
  const periodo = total + 2.2
  return (
    <>
      <Percurso pontos={caminho} velocidade={velocidade} espera={0.3} periodo={periodo}>
        <group scale={0.75}>
          <Dado cor="#e9a620" />
        </group>
      </Percurso>
      <Janela periodo={periodo} de={chegadas[3] - 0.2} ate={chegadas[4] + 1}>
        <Rotulo pos={[GW_X, 3.3, GW_Z]}>Encaminha: 192.168.10 → 192.168.20</Rotulo>
      </Janela>
      <Janela periodo={periodo} de={total} ate={periodo}>
        <Rotulo pos={[b.x, 2, 1.1]} escuro>
          ✓ Chegou pela gateway
        </Rotulo>
      </Janela>
    </>
  )
}

// ---------- 4.1 — Endereçamento físico MAC (p. 3–4) ----------

const MAC = ['ba', '16', '3e', 'f4', 'a0', 'e5']
const binario = (hex: string) => parseInt(hex, 16).toString(2).padStart(8, '0')

function MacBits() {
  return (
    <>
      <Lote pos={[0, 0, -0.6]} tam={[4.4, 2.6]} />
      <PlacaDeRede pos={[0, 0.12, -0.6]} escala={3.2} />
      <Rotulo pos={[0, 2.55, -0.6]} classe="bits grande">
        {MAC.join(':')}
      </Rotulo>
      <Rotulo pos={[0, 3.3, -0.6]} escuro>
        Endereço MAC <small>48 bits em hexadecimal</small>
      </Rotulo>
      {MAC.map((h, i) => {
        const x = (i - 2.5) * 2.05
        return (
          <group key={h}>
            <Ligacao
              pontos={[
                [x * 0.18, Y, 0.6],
                [x, Y, 1.9],
              ]}
              raio={0.03}
              cor="#8e99a6"
            />
            <Rotulo pos={[x, 0.3, 2.35]} classe="bits">
              <b style={{ color: COR.mac }}>{h}</b>
            </Rotulo>
            <Rotulo pos={[x, 0.3, 2.95]} classe="bits">
              {binario(h)}
            </Rotulo>
          </group>
        )
      })}
      <Rotulo pos={[0, 0.3, 3.75]}>6 grupos × 8 bits = 48 bits</Rotulo>
    </>
  )
}

const MACS = [
  { x: -4, ip: '192.168.10.1', fim: 'f4:a0:e5' },
  { x: 0, ip: '192.168.10.2', fim: 'f4:a0:e9' },
  { x: 4, ip: '192.168.10.3', fim: 'f4:a0:ea' },
]

/** `semDica`: sem os nomes das duas metades (para o desafio perguntar por elas). */
function Fabricante({ cena, semDica }: { cena: CenaProps; semDica?: boolean }) {
  return (
    <>
      <Ligacao
        pontos={[
          [-6, Y, -1.4],
          [6, Y, -1.4],
        ]}
        raio={0.08}
        cor="#2d3540"
      />
      {MACS.map((m) => (
        <group key={m.ip}>
          <Ligacao
            pontos={[
              [m.x, Y, -1.4],
              [m.x, Y, -0.2],
            ]}
            raio={0.06}
            cor={AZUL}
          />
          <Lote pos={[m.x, 0, 0.4]} tam={[2.4, 1.6]} />
          <Computador pos={[m.x, 0.12, 0.4]} escala={0.95} />
          <Rotulo pos={[m.x, 0.25, 1.7]} classe="bits">
            {ponto(m.ip)}
          </Rotulo>
          <Rotulo pos={[m.x, 0.25, 2.25]} classe="bits">
            <span style={{ color: COR.mac }}>ba:16:3e</span>:<span style={{ color: '#7458c4' }}>{m.fim}</span>
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[-6.2, 0.25, 1.7]} classe="esq">
        IP →
      </Rotulo>
      <Rotulo pos={[-6.2, 0.25, 2.25]} classe="esq">
        MAC →
      </Rotulo>
      {!semDica && (
        <>
          <Rotulo pos={[-1.6, 0.3, 3.3]} classe="esq bits grande">
            <span style={{ color: COR.mac }}>ba:16:3e</span>
          </Rotulo>
          <Rotulo pos={[-1.6, 0.3, 3.9]} classe="esq">
            Identifica o Fabricante
          </Rotulo>
          <Rotulo pos={[1.6, 0.3, 3.3]} classe="dir bits grande">
            <span style={{ color: '#7458c4' }}>f4:a0:e5</span>
          </Rotulo>
          <Rotulo pos={[1.6, 0.3, 3.9]} classe="dir">
            Identifica a Sequência
          </Rotulo>
        </>
      )}
      <Alvo id="fabricante" pos={[-5.2, 0.9, 3.4]} cena={cena} />
      <Alvo id="sequencia" pos={[5.2, 0.9, 3.4]} cena={cena} />
    </>
  )
}

export function CenaConfiguracao(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'logico'
  return (
    <>
      <Ilha raio={9} />
      <group key={modo}>
        {(modo === 'logico' || modo === 'rota') && (
          <Logico cena={cena} rota={modo === 'rota'} oculto={cena.estado.gatewayOculto as string | undefined} />
        )}
        {modo === 'mac' && <MacBits />}
        {modo === 'fabricante' && <Fabricante cena={cena} semDica={!!cena.estado.semDica} />}
      </group>
      <Arvore pos={[-6.6, 0, -4.4]} escala={0.8} />
      <Arvore pos={[6.6, 0, -4.2]} />
      <Arvore pos={[7.2, 0, 3.6]} escala={0.8} />
    </>
  )
}

// ---------- 4.2 — Verificando e alterando a configuração (p. 4–6) ----------

const PC: V3 = [-1.2, 0.12, 2.2]
const SW: V3 = [1.2, 0.12, 0]
const DHCP: V3 = [-1.8, 0.12, -2.4]
const GW: V3 = [3.6, 0.12, -1]
const DNS: V3 = [4.6, 0.12, -4.2]

const noChao = (p: V3, dx = 0, dz = 0): V3 => [p[0] + dx, Y, p[2] + dz]

/** O servidor DHCP entrega a configuração: um dado vai do servidor até o PC, passando pelo switch. */
function EntregaDHCP() {
  const caminho = [noChao(DHCP, 0.3, 0.5), noChao(SW), noChao(PC, 0.2, -0.6)]
  const velocidade = 2.4
  const { total } = linhaDoTempo(caminho, velocidade, 0.2)
  const periodo = total + 1.6
  return (
    <>
      <Percurso pontos={caminho} velocidade={velocidade} espera={0.2} periodo={periodo}>
        <group scale={0.7}>
          <Dado cor={COR.dhcp} />
        </group>
      </Percurso>
      <Janela periodo={periodo} de={total} ate={periodo}>
        <Rotulo pos={[PC[0], 2.3, PC[2]]} escuro>
          ✓ IP, máscara, gateway e DNS recebidos
        </Rotulo>
      </Janela>
    </>
  )
}

function RedeDoHost({ cena, modoIP }: { cena: CenaProps; modoIP?: ModoIP }) {
  const manual = modoIP === 'manual'
  return (
    <>
      <Lote pos={[PC[0], 0, PC[2]]} tam={[2.6, 1.8]} />
      <Computador pos={PC} escala={1.05} />
      <PlacaDeRede pos={[PC[0] - 1.25, 0.12, PC[2] + 0.5]} escala={0.9} rot={[0, 0.5, 0]} />
      <Rotulo pos={[PC[0], 0.3, PC[2] + 1.2]} classe="bits">
        <span style={{ color: COR.ip }}>192.168.10.1</span> · MAC <span style={{ color: COR.mac }}>BA-16-3E-F4-A0-E5</span>
      </Rotulo>
      <Rotulo pos={[PC[0], 1.75, PC[2]]} escuro>
        seu computador
      </Rotulo>
      <Alvo id="fisico" pos={[PC[0] - 1.6, 1.3, PC[2] + 0.5]} cena={cena} />

      <Switch pos={SW} portas={5} />
      <Ligacao pontos={[noChao(PC, 0.2, -0.6), noChao(SW, -0.3, 0.3)]} raio={0.05} />
      <Ligacao pontos={[noChao(DHCP, 0.3, 0.5), noChao(SW, -0.6, -0.2)]} raio={0.05} />
      <Ligacao pontos={[noChao(SW, 0.6, 0), noChao(GW, -0.5, 0)]} raio={0.05} />
      <Ligacao pontos={[noChao(GW, 0.2, -0.4), noChao(DNS, 0, 0.6)]} raio={0.05} cor="#7458c4" />

      <Lote pos={[DHCP[0], 0, DHCP[2]]} tam={[1.6, 1.6]} />
      <Servidor pos={DHCP} escala={0.95} />
      <Rotulo pos={[DHCP[0], 2.1, DHCP[2]]} classe="bits">
        Servidor DHCP · <span style={{ color: COR.dhcp }}>192.168.10.7</span>
      </Rotulo>
      <Alvo id="dhcp" pos={[DHCP[0] - 1, 1.2, DHCP[2]]} cena={cena} />

      <Roteador pos={GW} escala={1.1} cor="#b77d06" />
      <Rotulo pos={[GW[0], 1, GW[2]]} classe="bits">
        Gateway · <span style={{ color: COR.gateway }}>192.168.10.5</span>
      </Rotulo>
      <Alvo id="gateway" pos={[GW[0] + 1.1, 0.6, GW[2] + 0.4]} cena={cena} />

      <Esfera raio={0.9} pos={[DNS[0] + 1.3, 1.1, DNS[2] - 0.4]} cor="#3f7fc4" />
      <Servidor pos={DNS} escala={0.9} />
      <Rotulo pos={[DNS[0], 2, DNS[2]]} classe="bits">
        Servidor DNS · <span style={{ color: COR.dns }}>8.8.8.8</span>
      </Rotulo>
      <Rotulo pos={[DNS[0] + 1.3, 0.5, DNS[2] + 0.8]}>Internet</Rotulo>
      <Alvo id="dns" pos={[DNS[0] - 1, 1.2, DNS[2]]} cena={cena} />

      {modoIP && (
        <>
          <Rotulo pos={[PC[0], 2.9, PC[2]]} classe="grande">
            {manual ? '✍️ IP fixo, digitado à mão' : '⚙️ IP automático: pedido ao DHCP'}
          </Rotulo>
          {!manual && <EntregaDHCP />}
        </>
      )}
    </>
  )
}

export function CenaVerificando(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'ipconfig'
  // o "ncpa.cpl" digitado no terminal abre as janelas, até o passo mudar
  const [janela, setJanela] = useState(false)
  const [modoIP, setModoIP] = useState<ModoIP>('automatico')
  useEffect(() => {
    setJanela(false)
    setModoIP('automatico')
  }, [modo])

  const comJanelas = modo === 'ncpa' || modo === 'ipv4' || janela
  return (
    <>
      <Ilha raio={9} />
      <RedeDoHost cena={cena} modoIP={modo === 'ipv4' ? modoIP : undefined} />
      {comJanelas ? (
        <JanelasWindows
          inicio={modo === 'ipv4' ? 'ipv4' : 'ncpa'}
          modo={modoIP}
          onModo={setModoIP}
          onFechar={janela ? () => setJanela(false) : undefined}
        />
      ) : (
        <Terminal
          comando={modo === 'all' ? 'ipconfig /all' : 'ipconfig'}
          sugestoes={['ipconfig', 'ipconfig /all', 'ncpa.cpl', 'cls']}
          onAbrir={() => setJanela(true)}
        />
      )}
      <Arvore pos={[-5.5, 0, -4.6]} escala={0.8} />
      <Arvore pos={[6.4, 0, 2.6]} escala={0.8} />
    </>
  )
}
