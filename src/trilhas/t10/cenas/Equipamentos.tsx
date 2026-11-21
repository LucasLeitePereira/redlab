import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, PlacaDeRede, Roteador, Switch } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { PilhaOsi, type IdCamada } from '../../t5/cenas/comum'

// Trilha 10 — Equipamentos de Redes (Aula 09).
// Modos: 'nic', 'repetidor', 'encadeamento', 'hub', 'ponte', 'switch', 'misto', 'roteador', 'broadcast'.
// `semNomes` esconde a pilha OSI e os nomes que entregariam a resposta nas questões.

const CHAO = 0.12
const LARANJA = '#e8913a'
const VERMELHO = '#ef6f6c'

/** Mancha translúcida no chão: um domínio de colisão (laranja) ou de broadcast (outras cores). */
function Dominio({ pos, tam, cor = LARANJA, texto }: { pos: [number, number]; tam: [number, number]; cor?: string; texto?: string }) {
  return (
    <group>
      <Caixa tam={[tam[0], 0.02, tam[1]]} pos={[pos[0], 0.03, pos[1]]} cor={cor} opacidade={0.28} sombra={false} />
      {texto && (
        <Rotulo pos={[pos[0], 0.35, pos[1] + tam[1] / 2 - 0.2]} classe="mini">
          {texto}
        </Rotulo>
      )}
    </group>
  )
}

/** Caixinha de equipamento com nome (hub, repetidor, ponte). */
function Aparelho({ pos, cor, nome, largura = 1.3 }: { pos: V3; cor: string; nome?: string; largura?: number }) {
  return (
    <group>
      <Caixa tam={[largura, 0.3, 0.6]} pos={[pos[0], pos[1] + 0.15, pos[2]]} cor={cor} />
      <Caixa tam={[largura * 0.7, 0.04, 0.02]} pos={[pos[0], pos[1] + 0.2, pos[2] + 0.31]} cor="#39d97a" emissivo="#39d97a" intensidade={1} sombra={false} />
      {nome && (
        <Rotulo pos={[pos[0], pos[1] + 0.75, pos[2]]} escuro>
          {nome}
        </Rotulo>
      )}
    </group>
  )
}

const pc = (x: number, z: number, rot = 0) => <Computador key={`${x},${z}`} pos={[x, CHAO, z]} escala={0.6} rot={[0, rot, 0]} />

/** Cabo entre dois pontos, com (ou sem) um dado passando. */
function Fio({ de, para, dado = false, atraso = 0, cor = '#2f5fa0' }: { de: V3; para: V3; dado?: boolean; atraso?: number; cor?: string }) {
  return (
    <Ligacao
      pontos={[de, para]}
      cor={cor}
      raio={0.04}
      surgir={0.3}
      viagens={dado ? [{ cor: VERMELHO, tipo: 'mensagem', atraso, duracao: 1.6, pausa: 2.4 }] : []}
    />
  )
}

function Camada({ foco, semNomes }: { foco: IdCamada[]; semNomes: boolean }) {
  return semNomes ? null : <PilhaOsi foco={foco} />
}

// ---------- placa de rede ----------

function Nic() {
  return (
    <group>
      <Computador pos={[-3, CHAO, 0]} escala={1.1} />
      <PlacaDeRede pos={[0.4, CHAO + 0.4, 0.4]} escala={2.2} rot={[0, -0.3, 0]} />
      <Fio de={[1.6, 0.14, 0.6]} para={[5.2, 0.14, 0.6]} dado />
      <Rotulo pos={[5.2, 0.7, 0.6]} classe="mini">
        meio físico
      </Rotulo>
      <Rotulo pos={[0.6, 2.7, 0.4]} classe="cartao">
        <b>Placa de rede (NIC)</b>Responsável pela conexão da estação ao meio físico de transmissão.
      </Rotulo>
      <Rotulo pos={[-3.2, 3.1, 0]} classe="cartao">
        <b>Driver</b>Software que permite ao sistema operacional controlar a placa. Fica entre o TCP/IP e a placa.
      </Rotulo>
    </group>
  )
}

// ---------- repetidor ----------

function Repetidor({ encadeado, semNomes }: { encadeado: boolean; semNomes: boolean }) {
  const xs = encadeado ? [-3.6, -1.2, 1.2, 3.6] : [-1.6, 1.6]
  const todos = [-6, ...xs, 6]
  return (
    <group>
      {pc(-6, 0.3, 0.3)}
      {pc(6, 0.3, -0.3)}
      {xs.map((x) => (
        <Aparelho key={x} pos={[x, 0, 0.3]} cor="#3b82c4" largura={1} />
      ))}
      {todos.slice(0, -1).map((x, i) => (
        <Fio key={x} de={[x + 0.5, 0.14, 0.3]} para={[todos[i + 1] - 0.5, 0.14, 0.3]} dado atraso={i * 1.2} />
      ))}
      <Rotulo pos={[0, 2.8, 0]} classe="grande">
        {encadeado ? 'Limite do encadeamento: quatro repetidores' : 'Repetidor de sinal'}
      </Rotulo>
      {!encadeado && (
        <Rotulo pos={[0, 1.7, 0.3]} classe="cartao">
          <b>Considerações que limitam o uso</b>Provoca atraso, amplifica também o ruído e aumenta o domínio de colisão.
        </Rotulo>
      )}
      <Dominio pos={[0, 0.3]} tam={[13.6, 3]} texto="um só domínio de colisão" />
      <Camada foco={['fisica']} semNomes={semNomes} />
    </group>
  )
}

// ---------- hub, switch e ponte ----------

const ESTRELA: [number, number][] = [
  [-4, -1.6],
  [-4, 2.2],
  [4, -1.6],
  [4, 2.2],
]

/** Cabos em estrela: o PC 0 manda; `para` diz quais PCs recebem. */
function Estrela({ para }: { para: number[] }) {
  return (
    <>
      {ESTRELA.map(([x, z], i) => {
        const ponta: V3 = [x + (x < 0 ? 0.5 : -0.5), 0.14, z]
        return (
          <group key={i}>
            {pc(x, z, x < 0 ? 0.6 : -0.6)}
            <Fio de={i === 0 ? ponta : [0, 0.14, 0.3]} para={i === 0 ? [0, 0.14, 0.3] : ponta} dado={i === 0 || para.includes(i)} atraso={i === 0 ? 0 : 1.6} />
          </group>
        )
      })}
    </>
  )
}

function Hub({ semNomes }: { semNomes: boolean }) {
  return (
    <group>
      <Aparelho pos={[0, 0, 0.3]} cor="#2aa7d8" nome={semNomes ? undefined : 'HUB'} />
      <Estrela para={[1, 2, 3]} />
      <Dominio pos={[0, 0.3]} tam={[10.6, 5.6]} texto="um domínio de colisão" />
      <Rotulo pos={[0, 3.2, 0]} classe="grande">
        O sinal é repetido para todas as portas (difusão)
      </Rotulo>
      <Camada foco={['fisica']} semNomes={semNomes} />
    </group>
  )
}

function SwitchCena({ semNomes }: { semNomes: boolean }) {
  const macs = ['00:83:bb:e9:54:72', '00:83:bb:e9:53:70', '00:83:bb:e9:10:1a', '00:83:bb:e9:7c:05']
  return (
    <group>
      <Switch pos={[0, CHAO, 0.3]} escala={1.4} portas={4} />
      {!semNomes && (
        <Rotulo pos={[0, 1.2, 0.3]} escuro>
          SWITCH
        </Rotulo>
      )}
      <Estrela para={[3]} />
      {ESTRELA.map(([x, z], i) => (
        <group key={i}>
          <Dominio pos={[x, z]} tam={[2.2, 2]} />
          <Rotulo pos={[x, 1.35, z]} classe="bits">
            porta {i + 1}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[0, 3.6, 0]} classe="cartao">
        <b>Tabela de endereçamento MAC</b>
        {macs.map((m, i) => (
          <div key={m}>
            porta {i + 1} → {m}
          </div>
        ))}
      </Rotulo>
      <Camada foco={['enlace', 'fisica']} semNomes={semNomes} />
    </group>
  )
}

function Ponte({ semNomes }: { semNomes: boolean }) {
  const pcs: [string, number][] = [
    ['A', -4.8],
    ['B', -2.4],
    ['C', 2.4],
    ['D', 4.8],
  ]
  return (
    <group>
      <Aparelho pos={[0, 0, -1.2]} cor="#34404f" nome={semNomes ? undefined : 'PONTE'} largura={1.1} />
      <Caixa tam={[4.6, 0.08, 0.08]} pos={[-3.3, 0.14, 0.6]} cor="#8d99a6" />
      <Caixa tam={[4.6, 0.08, 0.08]} pos={[3.3, 0.14, 0.6]} cor="#8d99a6" />
      <Fio de={[-0.6, 0.14, -1.2]} para={[-1.0, 0.14, 0.6]} />
      <Fio de={[0.6, 0.14, -1.2]} para={[1.0, 0.14, 0.6]} />
      {pcs.map(([n, x]) => (
        <group key={n}>
          {pc(x, 2.2)}
          <Caixa tam={[0.06, 0.06, 1.2]} pos={[x, 0.14, 1.2]} cor="#6b7681" sombra={false} />
          <Rotulo pos={[x, 1.4, 2.2]} escuro>
            {n}
          </Rotulo>
        </group>
      ))}
      <Dominio pos={[-3.6, 1.4]} tam={[5.2, 2.8]} texto="Segmento 1 · domínio de colisão 1" />
      <Dominio pos={[3.6, 1.4]} tam={[5.2, 2.8]} texto="Segmento 2 · domínio de colisão 2" />
      <Rotulo pos={[0, 2.9, -1.2]} classe="cartao">
        <b>Tabela da ponte</b>
        <div>ESQUERDA → A, B</div>
        <div>DIREITA → C, D</div>
      </Rotulo>
      <Camada foco={['enlace', 'fisica']} semNomes={semNomes} />
    </group>
  )
}

/** Switch com um hub pendurado: o switch só reduz o domínio; o hub mantém o dele. */
function Misto({ semNomes }: { semNomes: boolean }) {
  return (
    <group>
      <Switch pos={[-1.5, CHAO, -1.2]} escala={1.3} portas={4} />
      {!semNomes && (
        <Rotulo pos={[-1.5, 1.0, -1.2]} escuro>
          SWITCH
        </Rotulo>
      )}
      {pc(-5, -1.2, 0.6)}
      <Fio de={[-4.5, 0.14, -1.2]} para={[-2.4, 0.14, -1.2]} />
      <Aparelho pos={[2.6, 0, 0.4]} cor="#2aa7d8" nome={semNomes ? undefined : 'HUB'} largura={1} />
      <Fio de={[-0.6, 0.14, -1.2]} para={[2.1, 0.14, 0.4]} />
      {[1.0, 2.6, 4.2].map((x) => (
        <group key={x}>
          {pc(x, 2.8)}
          <Fio de={[2.6, 0.14, 0.6]} para={[x, 0.14, 2.4]} />
        </group>
      ))}
      <Dominio pos={[2.6, 1.7]} tam={[5.2, 3.4]} texto="domínio de colisão (hub)" />
      <Dominio pos={[-5, -1.2]} tam={[1.8, 1.8]} />
      <Rotulo pos={[0, 3.6, 0]} classe="cartao">
        <b>Switch com outros equipamentos</b>Só com switches o domínio de colisão é eliminado. Com hubs, o switch apenas reduz o domínio.
      </Rotulo>
    </group>
  )
}

// ---------- roteador ----------

const REDES: { nome: string; x: number; z: number; cor: string }[] = [
  { nome: '172.16.0.0/16', x: -4.2, z: 1.6, cor: '#3aa0e6' },
  { nome: '172.17.0.0/16', x: 0, z: 3.0, cor: '#2e8b3d' },
  { nome: '172.18.0.0/16', x: 4.2, z: 1.6, cor: '#7458c4' },
]

function RoteadorCena({ broadcast, semNomes }: { broadcast: boolean; semNomes: boolean }) {
  return (
    <group>
      <Roteador pos={[0, CHAO, -1.6]} escala={1.4} />
      {!semNomes && (
        <Rotulo pos={[0, 1.3, -1.6]} escuro>
          ROTEADOR
        </Rotulo>
      )}
      {REDES.map((r, i) => {
        const anda = broadcast && i === 0
        return (
          <group key={r.nome}>
            <Switch pos={[r.x, CHAO, r.z - 1.4]} escala={0.9} portas={3} />
            <Fio de={[0, 0.14, -1.6]} para={[r.x, 0.14, r.z - 1.4]} dado={anda} cor={r.cor} />
            {pc(r.x - 0.9, r.z + 0.4)}
            {pc(r.x + 0.9, r.z + 0.4)}
            <Fio de={[r.x, 0.14, r.z - 1.4]} para={[r.x - 0.9, 0.14, r.z + 0.1]} dado={anda} atraso={1.6} cor={r.cor} />
            <Fio de={[r.x, 0.14, r.z - 1.4]} para={[r.x + 0.9, 0.14, r.z + 0.1]} dado={anda} atraso={1.6} cor={r.cor} />
            {broadcast ? (
              <Dominio pos={[r.x, r.z - 0.4]} tam={[3.2, 3]} cor={r.cor} texto={`domínio de broadcast ${i + 1}`} />
            ) : (
              <Rotulo pos={[r.x, 0.5, r.z + 1.3]} classe="bits">
                {r.nome}
              </Rotulo>
            )}
          </group>
        )
      })}
      <Rotulo pos={[0, 3.4, -1.6]} classe="cartao">
        {broadcast ? (
          <>
            <b>Domínio de broadcast</b>Cada porta do roteador é um domínio distinto. Todas as portas de um hub ou switch ficam no mesmo.
          </>
        ) : (
          <>
            <b>Roteador</b>Escolhe o melhor caminho (rotas), interliga as redes, gerencia as tabelas de rotas e compatibiliza enlaces diferentes.
          </>
        )}
      </Rotulo>
      <Camada foco={['rede', 'enlace', 'fisica']} semNomes={semNomes} />
    </group>
  )
}

export function CenaEquipamentos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'nic'
  const semNomes = !!cena.estado.semNomes
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'nic' && <Nic />}
      {modo === 'repetidor' && <Repetidor encadeado={false} semNomes={semNomes} />}
      {modo === 'encadeamento' && <Repetidor encadeado semNomes={semNomes} />}
      {modo === 'hub' && <Hub semNomes={semNomes} />}
      {modo === 'ponte' && <Ponte semNomes={semNomes} />}
      {modo === 'switch' && <SwitchCena semNomes={semNomes} />}
      {modo === 'misto' && <Misto semNomes={semNomes} />}
      {modo === 'roteador' && <RoteadorCena broadcast={false} semNomes={semNomes} />}
      {modo === 'broadcast' && <RoteadorCena broadcast semNomes={semNomes} />}
    </>
  )
}
