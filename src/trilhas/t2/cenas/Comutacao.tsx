import { Arvore, Caixa, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Telefone } from '../../../three/modelos'
import { Dado, type TipoDado } from '../../../three/dados'
import { Janela, linhaDoTempo, Percurso, Pulsos, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.6 — comutação (Aula 02, p. 16–19). A mesma malha de nós para os três tipos:
// circuitos (caminho reservado de ponta a ponta), mensagens (a mensagem inteira pula
// de nó em nó: guardar-encaminhar) e pacotes (pedaços numerados por caminhos diferentes,
// remontados no destino).

const Y = 0.16
const NOS: Record<string, V3> = {
  O: [-6.2, 0.12, 0],
  n1: [-3.7, 0.12, 0],
  n2: [-1.3, 0.12, -2.3],
  n3: [-1.3, 0.12, 2.3],
  n4: [1.3, 0.12, -2.3],
  n5: [1.3, 0.12, 2.3],
  n6: [3.7, 0.12, 0],
  D: [6.2, 0.12, 0],
}
const ENLACES: [string, string][] = [
  ['O', 'n1'], ['n1', 'n2'], ['n1', 'n3'], ['n2', 'n4'], ['n2', 'n5'],
  ['n3', 'n4'], ['n3', 'n5'], ['n4', 'n6'], ['n5', 'n6'], ['n6', 'D'],
]
const INTERMEDIARIOS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']
const naLinha = (id: string, dy = 0): V3 => [NOS[id][0], Y + dy, NOS[id][2]]
const rota = (ids: string[], dy = 0) => ids.map((id) => naLinha(id, dy))

/** Nó de comutação (os quadrados verdes do slide); `aceso` = está guardando a mensagem. */
function No({ id, aceso }: { id: string; aceso?: boolean }) {
  const p = NOS[id]
  return (
    // aceso fica um pouco maior: é desenhado por cima do nó apagado durante a espera
    <group position={p} scale={aceso ? 1.06 : 1}>
      <Caixa tam={[0.95, 0.5, 0.8]} pos={[0, 0.25, 0]} cor={aceso ? '#f2c230' : '#b5e07a'} emissivo={aceso ? '#f2b134' : undefined} intensidade={0.5} />
      <Caixa tam={[0.8, 0.04, 0.65]} pos={[0, 0.52, 0]} cor={aceso ? '#ffe28a' : '#d3f0a8'} sombra={false} />
    </group>
  )
}

/** `semAcesso`: sem os enlaces O–n1 e n6–D (a cena desenha os seus próprios). */
function Malha({ fraca, trafego, semAcesso }: { fraca?: boolean; trafego?: boolean; semAcesso?: boolean }) {
  return (
    <>
      {ENLACES.map(([a, b], i) => (semAcesso && (a === 'O' || b === 'D')) ? null : (
        <Ligacao
          key={`${a}-${b}`}
          pontos={[naLinha(a), naLinha(b)]}
          raio={0.06}
          cor={fraca ? '#9fb0c6' : '#3b6fb5'}
          viagens={trafego ? [{ cor: i % 2 ? '#7458c4' : '#2e9e6a', duracao: 1.8, pausa: 1.6 + (i % 3) * 0.7, atraso: i * 0.37, inverso: i % 3 === 0 }] : []}
        />
      ))}
    </>
  )
}

function Pontas() {
  return (
    <>
      <Lote pos={NOS.O} tam={[2.2, 2.2]} />
      <Lote pos={NOS.D} tam={[2.2, 2.2]} />
      <Computador pos={NOS.O} escala={0.75} />
      <Computador pos={NOS.D} escala={0.75} tela="#8fd9a8" />
      <Rotulo pos={[NOS.O[0], 1.6, 0]}>Origem</Rotulo>
      <Rotulo pos={[NOS.D[0], 1.6, 0]}>Destino</Rotulo>
    </>
  )
}

// ---------- Circuitos ----------

// Duas ligações (1 e 2), cada uma com um telefone de cada lado, disputando os mesmos enlaces.
// Em cada metade do ciclo uma delas tem o circuito reservado e a outra espera no primeiro nó;
// quando a dona desliga, a outra estabelece o seu circuito, e os papéis se invertem.
const MIOLO = ['n1', 'n2', 'n4', 'n6']
const LIGACOES = {
  1: { origem: [-6.2, 0.12, -1.2] as V3, destino: [6.2, 0.12, -1.2] as V3, cor: '#e0463f' },
  2: { origem: [-6.2, 0.12, 1.2] as V3, destino: [6.2, 0.12, 1.2] as V3, cor: '#7458c4' },
}
type Id = keyof typeof LIGACOES
const noChao = (p: V3, dy = 0): V3 => [p[0], Y + dy, p[2]]
const caminhoDa = (id: Id, dy = 0): V3[] => [noChao(LIGACOES[id].origem, dy), ...rota(MIOLO, dy), noChao(LIGACOES[id].destino, dy)]
/** Onde a ligação que não tem o circuito para: no enlace de acesso, pouco antes do primeiro nó. */
const pontoDeEspera = (id: Id): V3 => {
  const [o, n] = [LIGACOES[id].origem, NOS.n1]
  return [o[0] + (n[0] - o[0]) * 0.72, Y + 0.02, o[2] + (n[2] - o[2]) * 0.72]
}

const EM_USO = 6 // circuito de uma ligação ativo; a outra chega e espera
const TROCA = 4.5 // a dona desliga; a outra estabelece o circuito
const METADE = EM_USO + TROCA
const PERIODO_CIRCUITOS = 2 * METADE

/** Uma metade do ciclo: `dona` com o circuito reservado, `outra` esperando e depois assumindo. */
function MetadeCircuitos({ dona, outra, t0 }: { dona: Id; outra: Id; t0: number }) {
  const caminho = caminhoDa(dona, 0.03)
  const curvaVoz = useCurva(caminhoDa(dona, 0.04))
  const chegando = useCurva([noChao(LIGACOES[outra].origem, 0.02), pontoDeEspera(outra)])
  const estabelecendo = useCurva([pontoDeEspera(outra), ...caminhoDa(outra, 0.02).slice(1)])
  const espera = pontoDeEspera(outra)
  return (
    <>
      <Janela periodo={PERIODO_CIRCUITOS} de={t0} ate={t0 + EM_USO}>
        {caminho.slice(1).map((p, i) => (
          <Ligacao key={i} pontos={[caminho[i], p]} raio={0.1} cor={LIGACOES[dona].cor} />
        ))}
        <Pulsos curva={curvaVoz} cor="#ffd23f" quantidade={10} duracao={4} />
        <Rotulo pos={[0, 1.4, -2.9]} escuro>Ligação {dona}: circuito reservado só para ela</Rotulo>
      </Janela>

      {/* a outra ligação chega ao primeiro nó e fica esperando o enlace */}
      <Viajante curva={chegando} duracao={1.5} pausa={PERIODO_CIRCUITOS - 1.5} atraso={t0 + 0.5}>
        <group scale={0.8}><Dado cor="#8e99a6" tipo="voz" /></group>
      </Viajante>
      <Janela periodo={PERIODO_CIRCUITOS} de={t0 + 2} ate={t0 + EM_USO}>
        <group position={espera} scale={0.8}><Dado cor="#8e99a6" tipo="voz" /></group>
        <Rotulo pos={[espera[0], 1.0, espera[2]]}>⛔ Ligação {outra} esperando: enlace ocupado</Rotulo>
      </Janela>

      {/* a dona desligou: a outra estabelece o seu circuito até o destino */}
      <Viajante curva={estabelecendo} duracao={TROCA - 0.5} pausa={PERIODO_CIRCUITOS - TROCA + 0.5} atraso={t0 + EM_USO}>
        <group scale={0.8}><Dado cor="#8e99a6" tipo="voz" /></group>
      </Viajante>
      <Janela periodo={PERIODO_CIRCUITOS} de={t0 + EM_USO} ate={t0 + METADE}>
        <Rotulo pos={[0, 1.4, -2.9]} escuro>Ligação {dona} desligou: a ligação {outra} estabelece o seu circuito</Rotulo>
      </Janela>
    </>
  )
}

function Circuitos() {
  return (
    <>
      <Lote pos={NOS.O} tam={[2.2, 4.2]} />
      <Lote pos={NOS.D} tam={[2.2, 4.2]} />
      {([1, 2] as Id[]).map((id) => (
        <group key={id}>
          <Telefone pos={LIGACOES[id].origem} rot={[0, 0.4, 0]} escala={1.2} cor={LIGACOES[id].cor} />
          <Telefone pos={LIGACOES[id].destino} rot={[0, -0.4, 0]} escala={1.2} cor={LIGACOES[id].cor} />
          <Rotulo pos={[LIGACOES[id].origem[0], 1.0, LIGACOES[id].origem[2]]}>{id}</Rotulo>
          <Rotulo pos={[LIGACOES[id].destino[0], 1.0, LIGACOES[id].destino[2]]}>{id}</Rotulo>
          {/* enlaces de acesso de cada telefone */}
          <Ligacao pontos={[noChao(LIGACOES[id].origem), naLinha('n1')]} raio={0.06} cor="#9fb0c6" />
          <Ligacao pontos={[naLinha('n6'), noChao(LIGACOES[id].destino)]} raio={0.06} cor="#9fb0c6" />
        </group>
      ))}
      <Rotulo pos={[NOS.O[0], 0.5, 2.5]}>Origem</Rotulo>
      <Rotulo pos={[NOS.D[0], 0.5, 2.5]}>Destino</Rotulo>
      <Malha fraca semAcesso />
      {INTERMEDIARIOS.map((id) => <No key={id} id={id} aceso={MIOLO.includes(id)} />)}
      <MetadeCircuitos dona={1} outra={2} t0={0} />
      <MetadeCircuitos dona={2} outra={1} t0={METADE} />
    </>
  )
}

// ---------- Mensagens ----------

const CAMINHO_MSG = ['O', 'n1', 'n3', 'n4', 'n6', 'D']

function Mensagens({ perda }: { perda?: boolean }) {
  const velocidade = 2.4
  const espera = 1.1
  const ids = perda ? CAMINHO_MSG.slice(0, 4) : CAMINHO_MSG
  const pontos = rota(ids)
  const { chegadas, total } = linhaDoTempo(pontos, velocidade, espera)
  const periodo = total + (perda ? 2.2 : 1.8)
  return (
    <>
      <Pontas />
      <Malha />
      {INTERMEDIARIOS.map((id) => {
        const i = ids.indexOf(id)
        return (
          <group key={id}>
            <No id={id} />
            {i > 0 && (
              <Janela periodo={periodo} de={chegadas[i]} ate={perda && i === ids.length - 1 ? chegadas[i] + 0.8 : chegadas[i] + espera}>
                <No id={id} aceso />
                <Rotulo pos={[NOS[id][0], 1.2, NOS[id][2]]} escuro>Guarda</Rotulo>
              </Janela>
            )}
          </group>
        )
      })}
      <Percurso pontos={pontos} velocidade={velocidade} espera={espera} periodo={periodo}>
        {/* a mensagem inteira: o mesmo vídeo dos pacotes, mas num dado só, bem maior que um pacote */}
        <group scale={1.7}>
          <Dado cor="#e0463f" tipo="video" />
        </group>
        {!perda && <Rotulo pos={[0, 1.25, 0]}>Mensagem</Rotulo>}
      </Percurso>
      {!perda && (
        <Janela periodo={periodo} de={total} ate={periodo}>
          <Rotulo pos={[NOS.D[0], 2.3, 0]} escuro>✓ Mensagem inteira entregue</Rotulo>
        </Janela>
      )}
      {perda && (
        <>
          <Janela periodo={periodo} de={total + 0.8} ate={periodo}>
            <Rotulo pos={[NOS.n4[0], 1.3, NOS.n4[2]]} escuro>✖ Mensagem perdida!</Rotulo>
            <Rotulo pos={[NOS.O[0], 2.3, 0]}>Recomeça tudo do início</Rotulo>
          </Janela>
        </>
      )}
    </>
  )
}

// ---------- Pacotes ----------

const CORES_PACOTE = ['#e0463f', '#f2b134', '#2e9e6a', '#3aa0e6', '#7458c4']
const PACOTES: { caminho: string[]; velocidade: number; atraso: number }[] = [
  { caminho: ['O', 'n1', 'n2', 'n5', 'n6', 'D'], velocidade: 2.0, atraso: 0 },
  { caminho: ['O', 'n1', 'n3', 'n5', 'n6', 'D'], velocidade: 3.6, atraso: 0.45 },
  { caminho: ['O', 'n1', 'n2', 'n4', 'n6', 'D'], velocidade: 2.2, atraso: 0.9 },
  { caminho: ['O', 'n1', 'n3', 'n4', 'n6', 'D'], velocidade: 4.0, atraso: 1.35 },
  { caminho: ['O', 'n1', 'n2', 'n4', 'n6', 'D'], velocidade: 3.2, atraso: 1.8 },
]
const ESPERA_PACOTE = 0.3
const CHEGADAS = PACOTES.map((p) => p.atraso + linhaDoTempo(rota(p.caminho), p.velocidade, ESPERA_PACOTE).total)
const TODOS_CHEGARAM = Math.max(...CHEGADAS)
const PERIODO_PACOTES = TODOS_CHEGARAM + 2.8
/** Ordem em que os pacotes chegam (números de 1 a 5). */
export const ORDEM_DE_CHEGADA = CHEGADAS.map((t, i) => [t, i + 1]).sort((a, b) => a[0] - b[0]).map(([, n]) => n)

// Outras conversas (passo das vantagens): computadores atrás dos nós de cima e de baixo, com
// pacotes sem número e em cores fora de CORES_PACOTE. Usam os mesmos enlaces que os nossos
// pacotes, mas cada um segue para o seu destino.
const OUTRAS: { nome: string; cor: string; tipo: TipoDado; origem: V3; entrada: string; destino: V3; saida: string; caminhos: string[][] }[] = [
  {
    nome: 'B', cor: '#e46aa8', tipo: 'musica',
    origem: [-2.6, 0.12, -5.1], entrada: 'n2', destino: [2.6, 0.12, 5.1], saida: 'n5',
    caminhos: [['n2', 'n5'], ['n2', 'n4', 'n6', 'n5'], ['n2', 'n5']],
  },
  {
    nome: 'C', cor: '#17a2a2', tipo: 'imagem',
    origem: [-2.6, 0.12, 5.1], entrada: 'n3', destino: [2.6, 0.12, -5.1], saida: 'n4',
    caminhos: [['n3', 'n4'], ['n3', 'n5', 'n6', 'n4'], ['n3', 'n4']],
  },
]

function OutrasConversas() {
  return (
    <>
      {OUTRAS.map((c, k) => (
        <group key={c.nome}>
          {[c.origem, c.destino].map((p, i) => (
            <group key={i}>
              <Lote pos={p} tam={[2.0, 1.8]} />
              <Computador pos={p} escala={0.6} tela={c.cor} />
              <Rotulo pos={[p[0], 1.35, p[2]]}>{c.nome} · {i === 0 ? 'origem' : 'destino'}</Rotulo>
            </group>
          ))}
          <Ligacao pontos={[[c.origem[0], Y, c.origem[2]], naLinha(c.entrada)]} raio={0.06} cor="#3b6fb5" />
          <Ligacao pontos={[naLinha(c.saida), [c.destino[0], Y, c.destino[2]]]} raio={0.06} cor="#3b6fb5" />
          {c.caminhos.map((meio, i) => (
            <Percurso
              key={i}
              pontos={[[c.origem[0], Y, c.origem[2]], ...rota(meio), [c.destino[0], Y, c.destino[2]]]}
              velocidade={2.6 + i * 0.5}
              espera={ESPERA_PACOTE}
              atraso={0.3 + k * 0.5 + i * 1.1}
              periodo={PERIODO_PACOTES}
            >
              <group scale={0.6}><Dado cor={c.cor} tipo={c.tipo} /></group>
            </Percurso>
          ))}
        </group>
      ))}
    </>
  )
}

function Pacotes({ outros }: { outros?: boolean }) {
  const prateleira = (i: number): V3 => [3.6 + i * 0.62, 0.12, -3.1]
  return (
    <>
      <Pontas />
      <Malha />
      {outros && <OutrasConversas />}
      {INTERMEDIARIOS.map((id) => <No key={id} id={id} />)}
      {PACOTES.map((p, i) => (
        <group key={i}>
          <Percurso
            pontos={rota(p.caminho)}
            velocidade={p.velocidade}
            espera={ESPERA_PACOTE}
            atraso={p.atraso}
            periodo={PERIODO_PACOTES}
          >
            <group scale={0.7}>
              <Dado cor={CORES_PACOTE[i]} tipo="video" />
            </group>
            <Rotulo pos={[0, 0.75, 0]}>{i + 1}</Rotulo>
          </Percurso>
          {/* prateleira de remontagem: o espaço do pacote i se enche quando ele chega */}
          <Caixa tam={[0.5, 0.06, 0.5]} pos={prateleira(i)} cor="#dfe4ea" sombra={false} />
          <Janela periodo={PERIODO_PACOTES} de={CHEGADAS[i]} ate={PERIODO_PACOTES}>
            <Caixa tam={[0.46, 0.4, 0.46]} pos={[prateleira(i)[0], 0.35, prateleira(i)[2]]} cor={CORES_PACOTE[i]} sombra={false} />
          </Janela>
          <Rotulo pos={[prateleira(i)[0], 0.85, prateleira(i)[2]]}>{i + 1}</Rotulo>
        </group>
      ))}
      <Rotulo pos={[4.8, 1.5, -3.1]} escuro>Remontagem no destino</Rotulo>
      <Janela periodo={PERIODO_PACOTES} de={TODOS_CHEGARAM} ate={PERIODO_PACOTES}>
        <Rotulo pos={[NOS.D[0], 2.2, 0]} escuro>✓ Mensagem remontada</Rotulo>
      </Janela>
      <Rotulo pos={[NOS.O[0], 2.3, 0]}>Mensagem → 5 pacotes</Rotulo>
      {outros && <Rotulo pos={[0, 1.2, 0]} escuro>Enlaces compartilhados com outros pacotes</Rotulo>}
    </>
  )
}

export function CenaComutacao({ estado }: CenaProps) {
  const modo = (estado.modo as string | undefined) ?? 'intro'
  return (
    <>
      <Ilha raio={8.2} />
      {/* key: cada modo reinicia os relógios das animações juntos */}
      <group key={modo}>
        {modo === 'intro' && (
          <>
            <Pontas />
            <Malha trafego />
            {INTERMEDIARIOS.map((id) => <No key={id} id={id} />)}
          </>
        )}
        {modo === 'circuitos' && <Circuitos />}
        {modo === 'mensagens' && <Mensagens />}
        {modo === 'perda' && <Mensagens perda />}
        {modo === 'pacotes' && <Pacotes />}
        {modo === 'vantagens' && <Pacotes outros />}
      </group>
      <Arvore pos={[-5.8, 0, -4.4]} escala={0.8} />
      <Arvore pos={[-5.4, 0, 4.6]} escala={0.9} />
      <Arvore pos={[5.6, 0, 4.4]} />
    </>
  )
}
