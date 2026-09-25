import { Arvore, Fixo, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Notebook, Servidor, Switch } from '../../../three/modelos'
import { Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 4.4 — configuração automática: DHCP e APIPA (Aula 04, p. 7–9).
// A cena segue a figura do slide (switch, servidor e cliente) com os dois servidores do
// "Diagrama de Transição" (Server A e Server B); o diagrama aparece desenhado ao lado,
// uma seta a mais a cada passo, com as mesmas cores do slide.

const Y = 0.16
const SW: V3 = [0, 0.1, -2.2]
const A: V3 = [-4.2, 0.1, 0.6]
const B: V3 = [4.2, 0.1, 0.6]
const CLIENTE: V3 = [0, 0.1, 2.4]
const OUTRO: V3 = [-2, 0.1, 2.6]

const COR = { discover: '#e8462e', offer: '#5aa02c', request: '#f07070', ack: '#3d9be9' }
type Etapa = keyof typeof COR
const ETAPAS: Etapa[] = ['discover', 'offer', 'request', 'ack']
const NOME: Record<Etapa, string> = { discover: 'DHCP Discover', offer: 'DHCP Offer', request: 'DHCP Request', ack: 'DHCP ACK' }

const porta = (p: V3): V3 => [SW[0] + p[0] * 0.08, Y, SW[2] + 0.35]
const saida = (p: V3, dz = -0.6): V3 => [p[0], Y, p[2] + dz]
const caminho = (de: V3, para: V3): V3[] => [saida(de), porta(de), porta(para), saida(para)]

function Aparelhos({ semServidor }: { semServidor: boolean }) {
  return (
    <>
      <Switch pos={SW} portas={5} escala={1.2} />
      {[A, B, CLIENTE, OUTRO].map((p, i) => (
        <Ligacao key={i} pontos={[saida(p), porta(p)]} raio={0.05} cor="#2f5fa0" />
      ))}
      {[
        { p: A, nome: 'Server A' },
        { p: B, nome: 'Server B' },
      ].map(({ p, nome }) => (
        <group key={nome}>
          <Lote pos={[p[0], 0, p[2]]} tam={[1.6, 1.6]} />
          <Servidor pos={p} escala={0.95} />
          <Rotulo pos={[p[0], 2.1, p[2]]} escuro apagado={semServidor}>
            {nome} <small>servidor DHCP</small>
          </Rotulo>
          {semServidor && (
            <Rotulo pos={[p[0], 1, p[2] + 0.6]} classe="emoji">
              ❌
            </Rotulo>
          )}
        </group>
      ))}
      <Notebook pos={CLIENTE} escala={1.2} />
      <Rotulo pos={[CLIENTE[0], 0.3, CLIENTE[2] + 1.1]} escuro>
        Cliente
      </Rotulo>
      <Notebook pos={OUTRO} escala={1} />
    </>
  )
}

/** A configuração que o cliente tem em cada momento. */
function Configuracao({ texto }: { texto: string }) {
  return (
    <Rotulo pos={[CLIENTE[0] + 1.3, 1.3, CLIENTE[2]]} classe="dir bits">
      {texto}
    </Rotulo>
  )
}

/** Mensagens da etapa atual, repetindo: cada uma com a cor do slide. */
function Mensagens({ etapa }: { etapa: Etapa }) {
  const velocidade = 2.6
  const trajetos: V3[][] =
    etapa === 'discover'
      ? [caminho(CLIENTE, A), caminho(CLIENTE, B), caminho(CLIENTE, OUTRO)]
      : etapa === 'offer'
        ? [caminho(A, CLIENTE), caminho(B, CLIENTE)]
        : etapa === 'request'
          ? [caminho(CLIENTE, B)]
          : [caminho(B, CLIENTE)]
  const total = linhaDoTempo(trajetos[0], velocidade, 0.15).total
  const periodo = total + 1.8
  return (
    <>
      {trajetos.map((t, i) => (
        <Percurso key={i} pontos={t} velocidade={velocidade} espera={0.15} periodo={periodo}>
          <group scale={0.7}>
            <Dado cor={COR[etapa]} tipo="mensagem" />
          </group>
          <Rotulo pos={[0, 0.95, 0]} classe="bits">
            <span style={{ color: COR[etapa] }}>{NOME[etapa]}</span>
          </Rotulo>
        </Percurso>
      ))}
      {etapa === 'ack' && (
        <Janela periodo={periodo} de={total} ate={periodo}>
          <Rotulo pos={[CLIENTE[0], 2.3, CLIENTE[2]]} escuro>
            ✓ Configurado!
          </Rotulo>
        </Janela>
      )}
    </>
  )
}

/** Sem servidor DHCP: o Discover não tem resposta e o Windows usa um endereço APIPA. */
function Apipa() {
  const velocidade = 2.6
  const ida = [saida(CLIENTE), porta(CLIENTE), [SW[0], Y, SW[2] + 0.2] as V3]
  const total = linhaDoTempo(ida, velocidade, 0).total
  const periodo = total + 2.4
  return (
    <>
      <Percurso pontos={ida} velocidade={velocidade} periodo={periodo}>
        <group scale={0.7}>
          <Dado cor={COR.discover} tipo="mensagem" />
        </group>
        <Rotulo pos={[0, 0.95, 0]} classe="bits">
          <span style={{ color: COR.discover }}>DHCP Discover</span>
        </Rotulo>
      </Percurso>
      <Janela periodo={periodo} de={total} ate={periodo}>
        <Rotulo pos={[SW[0], 1.3, SW[2]]} escuro>
          … nenhum servidor responde
        </Rotulo>
      </Janela>
    </>
  )
}

// ---------- Diagrama de Transição (lado esquerdo da tela) ----------

const XS = { A: 40, C: 150, B: 260 }
type Seta = { de: number; para: number; y1: number; y2: number; etapa: Etapa }
const SETAS: Seta[] = [
  { de: XS.C, para: XS.A, y1: 50, y2: 78, etapa: 'discover' },
  { de: XS.C, para: XS.B, y1: 50, y2: 78, etapa: 'discover' },
  { de: XS.A, para: XS.C, y1: 100, y2: 128, etapa: 'offer' },
  { de: XS.B, para: XS.C, y1: 100, y2: 128, etapa: 'offer' },
  { de: XS.C, para: XS.B, y1: 150, y2: 178, etapa: 'request' },
  { de: XS.B, para: XS.C, y1: 200, y2: 228, etapa: 'ack' },
]
const Y_TEXTO: Record<Etapa, number> = { discover: 72, offer: 122, request: 172, ack: 222 }

/** `requestOculto`: a seta do Request fica sem destino (“?”), para o desafio perguntar por ele. */
function Diagrama({ ate, requestOculto }: { ate: number; requestOculto?: boolean }) {
  const visiveis = ETAPAS.slice(0, ate + 1)
  return (
    <Fixo x={16} y={84}>
      <div className="diagrama-dhcp">
        <div className="diagrama-titulo">
          <b>DHCP:</b> Diagrama de Transição
        </div>
        <svg viewBox="0 0 300 250" width="300" height="250" role="img" aria-label="Diagrama de transição do DHCP">
          <defs>
            {ETAPAS.map((e) => (
              <marker key={e} id={`seta-${e}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={COR[e]} />
              </marker>
            ))}
          </defs>
          {(['A', 'C', 'B'] as const).map((k) => (
            <g key={k}>
              <text x={XS[k]} y={14} textAnchor="middle" className="diagrama-nome">
                {k === 'C' ? 'Cliente' : `Server ${k}`}
              </text>
              <line x1={XS[k]} y1={22} x2={XS[k]} y2={246} stroke="#1d2733" strokeWidth={2} />
            </g>
          ))}
          <circle cx={XS.C} cy={42} r={5} fill={COR.discover} />
          {SETAS.filter((s) => visiveis.includes(s.etapa)).map((s, i) =>
            requestOculto && s.etapa === 'request' ? (
              <g key={i}>
                <circle cx={s.de} cy={s.y1} r={4} fill={COR[s.etapa]} />
                <text x={s.de} y={s.y2 + 4} textAnchor="middle" className="diagrama-nome" fill={COR[s.etapa]}>
                  ← ? →
                </text>
              </g>
            ) : (
              <g key={i}>
                <circle cx={s.de} cy={s.y1} r={4} fill={COR[s.etapa]} />
                <line x1={s.de} y1={s.y1} x2={s.para} y2={s.y2} stroke={COR[s.etapa]} strokeWidth={2} markerEnd={`url(#seta-${s.etapa})`} />
              </g>
            ),
          )}
          {visiveis.map((e) => (
            <text key={e} x={XS.C} y={Y_TEXTO[e] - 6} textAnchor="middle" className="diagrama-rotulo">
              {NOME[e]}
            </text>
          ))}
        </svg>
      </div>
    </Fixo>
  )
}

export function CenaDhcp({ estado }: CenaProps) {
  const modo = (estado.modo as string | undefined) ?? 'discover'
  const etapa = ETAPAS.indexOf(modo as Etapa)
  const apipa = modo === 'apipa'
  const config = apipa
    ? 'APIPA: 169.254.x.x / 255.255.0.0'
    : modo === 'ack'
      ? 'IP 192.168.10.1 · máscara · gateway · DNS'
      : 'IP: ? (ainda sem configuração)'
  return (
    <>
      <Ilha raio={8.4} />
      <Aparelhos semServidor={apipa} />
      <Configuracao texto={config} />
      <group key={modo}>
        {etapa >= 0 && <Mensagens etapa={ETAPAS[etapa]} />}
        {apipa && <Apipa />}
      </group>
      {etapa >= 0 && <Diagrama ate={etapa} requestOculto={!!estado.requestOculto} />}
      <Arvore pos={[-6.4, 0, 3.4]} escala={0.8} />
      <Arvore pos={[6.3, 0, -3.6]} />
    </>
  )
}
