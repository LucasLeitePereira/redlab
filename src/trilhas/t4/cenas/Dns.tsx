import { Alvo, Arvore, Caixa, Cilindro, Esfera, Fixo, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import { Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Terminal } from './Terminal'

// Fases 4.5 e 4.6 — resolução de nomes de domínio (Aula 04, p. 10–14).
// Modos: tradução nome → IP (p. 10), os domínios da La Salle com seus registros (p. 11–12),
// a árvore do DNS e a consulta andando por ela (p. 13), nslookup (p. 13), FQDN e URL (p. 14).

const Y = 0.16
const VERDE = '#1f9a6b'
const AZUL = '#2f7fd0'

// ---------- Tradução nome → IP (p. 10) ----------

function Traducao() {
  const pc: V3 = [-3.6, 0.12, 1.2]
  const dns: V3 = [3.6, 0.12, -0.6]
  const ida: V3[] = [[pc[0] + 0.9, Y, pc[2] - 0.2], [dns[0] - 0.6, Y, dns[2] + 0.2]]
  const velocidade = 2.6
  const t = linhaDoTempo(ida, velocidade, 0).total
  const periodo = 2 * t + 2.6
  return (
    <>
      <Lote pos={[pc[0], 0, pc[2]]} tam={[2.8, 1.8]} />
      <Computador pos={pc} />
      <Lote pos={[dns[0], 0, dns[2]]} tam={[1.8, 1.8]} />
      <Servidor pos={dns} />
      <Rotulo pos={[dns[0], 2.2, dns[2]]} escuro>
        Servidor DNS
      </Rotulo>
      <Ligacao pontos={ida} raio={0.05} />
      <Percurso pontos={ida} velocidade={velocidade} periodo={periodo}>
        <group scale={0.7}>
          <Dado cor={VERDE} tipo="mensagem" />
        </group>
        <Rotulo pos={[0, 1, 0]} classe="bits">
          www.unilasalle.edu.br ?
        </Rotulo>
      </Percurso>
      <Percurso pontos={[...ida].reverse()} velocidade={velocidade} atraso={t + 0.8} periodo={periodo}>
        <group scale={0.7}>
          <Dado cor={AZUL} tipo="mensagem" />
        </group>
        <Rotulo pos={[0, 1, 0]} classe="bits">
          34.226.91.154
        </Rotulo>
      </Percurso>
      <Janela periodo={periodo} de={2 * t + 0.8} ate={periodo}>
        <Rotulo pos={[pc[0], 2.3, pc[2]]} escuro>
          ✓ Nome traduzido para o IP
        </Rotulo>
      </Janela>
      {[
        { tld: '.com', texto: 'domínios comerciais', x: -4 },
        { tld: '.net', texto: 'empresas de networking', x: 0 },
        { tld: '.org', texto: 'organizações sem fins lucrativos', x: 4 },
      ].map((d) => (
        <group key={d.tld}>
          <Rotulo pos={[d.x, 0.3, 3.9]} classe="bits grande">
            {d.tld}
          </Rotulo>
          <Rotulo pos={[d.x, 0.3, 4.5]}>{d.texto}</Rotulo>
        </group>
      ))}
    </>
  )
}

// ---------- Os domínios da La Salle (p. 11–12) ----------

const ZONA = {
  aspmx: [-3.6, 0.12, -2.4] as V3,
  ns01: [-4.4, 0.12, 0.2] as V3,
  ns02: [-2.8, 0.12, 0.2] as V3,
  svr: [0.2, 0.12, -1.2] as V3,
  www: [0.2, 0.12, 1.8] as V3,
}

function Tracejado({ de, ate }: { de: [number, number]; ate: [number, number] }) {
  const pecas = []
  for (let x = de[0]; x <= ate[0]; x += 0.5) {
    pecas.push(<Caixa key={`a${x}`} tam={[0.25, 0.04, 0.06]} pos={[x, 0.08, de[1]]} cor="#1d2733" sombra={false} />)
    pecas.push(<Caixa key={`b${x}`} tam={[0.25, 0.04, 0.06]} pos={[x, 0.08, ate[1]]} cor="#1d2733" sombra={false} />)
  }
  for (let z = de[1]; z <= ate[1]; z += 0.5) {
    pecas.push(<Caixa key={`c${z}`} tam={[0.06, 0.04, 0.25]} pos={[de[0], 0.08, z]} cor="#1d2733" sombra={false} />)
    pecas.push(<Caixa key={`d${z}`} tam={[0.06, 0.04, 0.25]} pos={[ate[0], 0.08, z]} cor="#1d2733" sombra={false} />)
  }
  return <>{pecas}</>
}

function Registros({ lista, pos }: { lista: [string, string][]; pos: V3 }) {
  return (
    <>
      {lista.map(([tipo, valor], i) => (
        <Rotulo key={tipo} pos={[pos[0], pos[1] - i * 0.55, pos[2]]} classe="dir bits">
          {tipo}: <span style={{ color: AZUL }}>{valor}</span>
        </Rotulo>
      ))}
    </>
  )
}

function Zona({ cena }: { cena: CenaProps }) {
  return (
    <group position={[1, 0, 0]}>
      <Tracejado de={[-5.6, -3.4]} ate={[1.4, 3.2]} />
      <Servidor pos={ZONA.aspmx} escala={0.75} />
      <Rotulo pos={[ZONA.aspmx[0], 1.75, ZONA.aspmx[2]]} classe="bits">
        ✉ aspmx.l.google.com
      </Rotulo>
      <Alvo id="mx" pos={[ZONA.aspmx[0] - 1.1, 1, ZONA.aspmx[2]]} cena={cena} />

      {(['ns01', 'ns02'] as const).map((n) => (
        <group key={n}>
          <Servidor pos={ZONA[n]} escala={0.75} />
          <Cilindro raio={0.18} altura={0.3} lados={14} pos={[ZONA[n][0] + 0.45, 0.27, ZONA[n][2] + 0.3]} cor="#8fd19e" />
          <Rotulo pos={[ZONA[n][0], 1.75, ZONA[n][2]]} classe="bits">
            {n}
          </Rotulo>
        </group>
      ))}
      <Alvo id="ns" pos={[-3.6, 1.1, 0.4]} cena={cena} />
      <Rotulo pos={[-3.6, 0.3, 1.8]}>lasalle.edu.br</Rotulo>
      <Rotulo pos={[-3.6, 0.3, 2.4]}>unilasalle.edu.br</Rotulo>

      <Servidor pos={ZONA.svr} escala={0.75} />
      <Esfera raio={0.16} pos={[ZONA.svr[0], 0.9, ZONA.svr[2] + 0.4]} cor="#39a0d9" />
      <Rotulo pos={[ZONA.svr[0], 1.75, ZONA.svr[2]]} classe="bits">
        svr-net03
      </Rotulo>
      <Ligacao pontos={[[ZONA.svr[0] + 0.5, Y, ZONA.svr[2]], [2.1, Y, ZONA.svr[2]]]} raio={0.03} cor="#1d2733" />
      <Registros
        pos={[2.2, 0.9, ZONA.svr[2]]}
        lista={[
          ['A', '45.181.173.133'],
          ['PTR', 'svr-net03.lasalle.edu.br'],
          ['CNAME', 'www.lasalle.edu.br'],
        ]}
      />
      <Alvo id="a" pos={[ZONA.svr[0] - 1, 1.1, ZONA.svr[2]]} cena={cena} />
      <Alvo id="cname" pos={[5.9, 0.9 - 2 * 0.55, ZONA.svr[2]]} cena={cena} />

      <Servidor pos={ZONA.www} escala={0.75} />
      <Esfera raio={0.16} pos={[ZONA.www[0], 0.9, ZONA.www[2] + 0.4]} cor="#39a0d9" />
      <Rotulo pos={[ZONA.www[0] - 0.9, 0.3, ZONA.www[2] + 0.6]} classe="bits">
        www
      </Rotulo>
      <Ligacao pontos={[[ZONA.www[0] + 0.5, Y, ZONA.www[2]], [2.1, Y, ZONA.www[2]]]} raio={0.03} cor="#1d2733" />
      <Registros
        pos={[2.2, 0.6, ZONA.www[2]]}
        lista={[
          ['A', '34.226.91.154'],
          ['PTR', 'www.unilasalle.edu.br'],
        ]}
      />
      <Alvo id="ptr" pos={[5.7, 0.6 - 0.55, ZONA.www[2]]} cena={cena} />
    </group>
  )
}

const TABELA: [string, string, string][] = [
  ['ns01.unilasalle.edu.br', 'NS', '45.181.173.2'],
  ['ns02.unilasalle.edu.br', 'NS', '45.181.173.3'],
  ['svr-net03.lasalle.edu.br', 'A', '45.181.173.133'],
  ['www.lasalle.edu.br', 'CNAME', 'svr-net03.lasalle.edu.br'],
  ['aspmx.l.google.com', 'MX', '142.251.0.26'],
  ['alt2.aspmx.l.google.com', 'MX', '142.251.27.26'],
]

function Tabela() {
  return (
    <Fixo x={16} y={84}>
      <div className="tabela-dns">
        <div className="diagrama-titulo">Tabela no Servidor DNS</div>
        <table>
          <thead>
            <tr>
              <th>Nome Domínio</th>
              <th>TIPO</th>
              <th>Endereço IP</th>
            </tr>
          </thead>
          <tbody>
            {TABELA.map(([nome, tipo, ip]) => (
              <tr key={nome}>
                <td>{nome}</td>
                <td className="tipo">{tipo}</td>
                <td>{ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fixo>
  )
}

// ---------- A árvore do DNS (p. 13) ----------

type No = { nome: string; pos: V3; servidor?: boolean; pai?: string }
const Z_ARVORE = -1.6
const NOS: No[] = [
  { nome: 'root', pos: [3.4, 6.6, Z_ARVORE] },
  { nome: '.br', pos: [0.6, 5.1, Z_ARVORE], servidor: true, pai: 'root' },
  { nome: '.gb', pos: [4.6, 5.1, Z_ARVORE], pai: 'root' },
  { nome: '.jp', pos: [6.4, 5.1, Z_ARVORE], pai: 'root' },
  { nome: '.com', pos: [-2.4, 3.5, Z_ARVORE], servidor: true, pai: '.br' },
  { nome: '.edu', pos: [0.8, 3.5, Z_ARVORE], servidor: true, pai: '.br' },
  { nome: '.org', pos: [3.2, 3.5, Z_ARVORE], pai: '.br' },
  { nome: '.gov', pos: [5, 3.5, Z_ARVORE], pai: '.br' },
  { nome: '.google', pos: [-3.6, 1.9, Z_ARVORE], servidor: true, pai: '.com' },
  { nome: '.unilasalle', pos: [1.6, 1.9, Z_ARVORE], servidor: true, pai: '.edu' },
]
const no = (nome: string) => NOS.find((n) => n.nome === nome)!
const NIVEIS: [string, number][] = [
  ['root', 6.6],
  ['1º nível', 5.1],
  ['2º nível', 3.5],
  ['3º nível', 1.9],
]
const PC_ARVORE: V3 = [-6.2, 0.12, 0.8]

function NoArvore({ n, destaque }: { n: No; destaque?: boolean }) {
  const [x, y, z] = n.pos
  if (n.nome === 'root') return <Esfera raio={0.14} pos={n.pos} cor="#1d2733" />
  return (
    <group>
      {n.servidor && (
        <>
          <Cilindro raio={0.55} altura={0.1} lados={20} pos={[x, y - 0.6, z]} cor={destaque ? '#f2d58f' : '#dfe5ec'} />
          <Servidor pos={[x, y - 0.55, z]} escala={0.42} />
        </>
      )}
      <Rotulo pos={[n.servidor ? x + 0.75 : x, n.servidor ? y - 0.3 : y, z]} classe={n.servidor ? 'dir bits' : 'bits'}>
        {destaque ? <b style={{ color: '#b77d06' }}>{n.nome}</b> : n.nome}
      </Rotulo>
      {n.nome === '.unilasalle' && (
        <>
          <Cilindro raio={0.55} altura={0.1} lados={20} pos={[x + 2.2, y - 0.6, z]} cor="#dfe5ec" />
          <Servidor pos={[x + 2, y - 0.55, z]} escala={0.42} />
          <Esfera raio={0.12} pos={[x + 2.5, y - 0.35, z + 0.2]} cor="#39a0d9" />
          <Rotulo pos={[x + 1.7, y - 0.95, z + 0.6]} classe="bits">
            ns01
          </Rotulo>
          <Rotulo pos={[x + 2.7, y - 0.95, z + 0.6]} classe="bits">
            www
          </Rotulo>
        </>
      )}
    </group>
  )
}

/** `semNiveis`: sem os nomes dos níveis (para o desafio perguntar por eles). */
function Arvore3D({ destaque = [], semNiveis }: { destaque?: string[]; semNiveis?: boolean }) {
  return (
    <>
      {NOS.filter((n) => n.pai).map((n) => {
        const p = no(n.pai!)
        const topo: V3 = [p.pos[0], p.pos[1] - (p.servidor ? 0.6 : 0.1), p.pos[2]]
        const fundo: V3 = [n.pos[0], n.pos[1] + (n.servidor ? -0.1 : 0.25), n.pos[2]]
        const ligado = destaque.includes(n.nome) && destaque.includes(p.nome)
        return <Ligacao key={n.nome} pontos={[topo, fundo]} raio={ligado ? 0.05 : 0.025} cor={ligado ? '#b77d06' : n.pai === 'root' ? '#8a5a3b' : '#1d2733'} />
      })}
      {NOS.map((n) => (
        <NoArvore key={n.nome} n={n} destaque={destaque.includes(n.nome)} />
      ))}
      {NIVEIS.map(([nome, y]) => (
        <group key={nome}>
          {!semNiveis && (
            <Rotulo pos={[-7.4, y, Z_ARVORE]} classe="nivel-dns">
              {nome}
            </Rotulo>
          )}
          {Array.from({ length: 14 }, (_, i) => (
            <Caixa key={i} tam={[0.28, 0.02, 0.02]} pos={[-6.4 + i * 1, y - 0.75, Z_ARVORE - 0.3]} cor="#9aa6b3" sombra={false} />
          ))}
        </group>
      ))}
      <Lote pos={[PC_ARVORE[0], 0, PC_ARVORE[2]]} tam={[2.2, 1.6]} />
      <Computador pos={PC_ARVORE} escala={0.8} />
    </>
  )
}

/** A consulta do slide: sobe da .google até a .br, desce até o ns01 e a resposta volta. */
function Consulta() {
  const velocidade = 2.4
  const acima = (nome: string): V3 => {
    const n = no(nome)
    return [n.pos[0], n.pos[1] - 0.1, n.pos[2] + 0.5]
  }
  const ns01: V3 = [no('.unilasalle').pos[0] + 2, no('.unilasalle').pos[1] - 0.1, Z_ARVORE + 0.5]
  const pc: V3 = [PC_ARVORE[0], 1.2, PC_ARVORE[2]]
  const pergunta: V3[] = [pc, acima('.google'), acima('.com'), acima('.br'), acima('.edu'), ns01]
  const resposta: V3[] = [ns01, acima('.google'), pc]
  const t1 = linhaDoTempo(pergunta, velocidade, 0.35).total
  const t2 = linhaDoTempo(resposta, velocidade, 0.35).total
  const periodo = t1 + t2 + 3
  return (
    <>
      <Percurso pontos={pergunta} velocidade={velocidade} espera={0.35} periodo={periodo}>
        <group scale={0.9}>
          <Dado cor={VERDE} tipo="mensagem" sombra={false} />
        </group>
        <Rotulo pos={[0, 0.9, 0]} classe="bits">
          www.lasalle.edu.br ?
        </Rotulo>
      </Percurso>
      <Percurso pontos={resposta} velocidade={velocidade} espera={0.35} atraso={t1 + 0.6} periodo={periodo}>
        <group scale={0.9}>
          <Dado cor={AZUL} tipo="mensagem" sombra={false} />
        </group>
        <Rotulo pos={[0, 0.9, 0]} classe="bits">
          45.181.173.133
        </Rotulo>
      </Percurso>
      <Janela periodo={periodo} de={t1 - 0.2} ate={t1 + 1.2}>
        <Rotulo pos={[ns01[0], ns01[1] + 1.4, ns01[2]]} escuro>
          ns01 conhece o domínio: responde
        </Rotulo>
      </Janela>
      <Janela periodo={periodo} de={t1 + 0.6 + t2} ate={periodo}>
        <Rotulo pos={[PC_ARVORE[0], 2.2, PC_ARVORE[2]]} escuro>
          ✓ Nome resolvido
        </Rotulo>
      </Janela>
    </>
  )
}

/** www.lasalle.edu.br com cada parte na cor do seu nível. */
function Fqdn() {
  const partes: [string, string, string][] = [
    ['www', '#7458c4', 'host'],
    ['.lasalle', '#23915f', '3º nível'],
    ['.edu', '#2f6fb0', '2º nível'],
    ['.br', '#cf4b47', '1º nível (superior)'],
  ]
  return (
    <>
      {partes.map(([p, cor, nivel], i) => (
        <group key={p}>
          <Rotulo pos={[-3.3 + i * 2.2, 0.3, 3.6]} classe="bits grande">
            <span style={{ color: cor }}>{p}</span>
          </Rotulo>
          <Rotulo pos={[-3.3 + i * 2.2, 0.3, 4.3]}>{nivel}</Rotulo>
        </group>
      ))}
    </>
  )
}

// ---------- URL (p. 14) ----------

const URL_PARTES: { id: string; texto: string; rotulo: string; cor: string }[] = [
  { id: 'protocolo', texto: 'https', rotulo: 'protocolo', cor: '#cf4b47' },
  { id: 'sep1', texto: '://', rotulo: '', cor: '#1d2733' },
  { id: 'dominio', texto: 'www.lasalle.edu.br', rotulo: 'domínio', cor: '#2f6fb0' },
  { id: 'sep2', texto: ':', rotulo: '', cor: '#1d2733' },
  { id: 'porta', texto: '443', rotulo: 'porta', cor: '#b77d06' },
  { id: 'caminho', texto: '/cursos/redes', rotulo: 'caminho', cor: '#23915f' },
  { id: 'sep3', texto: '/', rotulo: '', cor: '#1d2733' },
  { id: 'recurso', texto: 'aula04.pdf', rotulo: 'recurso', cor: '#7458c4' },
]

/** `semRotulos`: só o URL e a estrutura do slide, sem o nome de cada parte (para o desafio). */
function Url({ cena, semRotulos }: { cena: CenaProps; semRotulos?: boolean }) {
  // posição de cada pedaço proporcional ao número de letras
  const larguraLetra = 0.2
  const total = URL_PARTES.reduce((s, p) => s + p.texto.length, 0) * larguraLetra
  let x = -total / 2
  return (
    <>
      <Caixa tam={[total + 1.2, 0.08, 2.6]} pos={[0, 0.04, 1.2]} cor="#f4f6f9" />
      {URL_PARTES.map((p) => {
        const largura = p.texto.length * larguraLetra
        const centro = x + largura / 2
        x += largura
        return (
          <group key={p.id}>
            <Rotulo pos={[centro, 0.3, 0.8]} classe="url-parte">
              <span style={{ color: p.cor }}>{p.texto}</span>
            </Rotulo>
            {p.rotulo && (
              <>
                <Caixa tam={[largura - 0.1, 0.06, 0.06]} pos={[centro, 0.12, 1.35]} cor={p.cor} sombra={false} />
                {!semRotulos && <Rotulo pos={[centro, 0.3, 1.8]}>{p.rotulo}</Rotulo>}
                <Alvo id={p.id} pos={[centro, 1.2, 1.8]} cena={cena} />
              </>
            )}
          </group>
        )
      })}
      <Rotulo pos={[0, 0.3, 3.4]} classe="bits">
        protocolo://domínio:porta/caminho/recurso
      </Rotulo>
    </>
  )
}

export function CenaDns(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'traducao'
  const comArvore = modo === 'arvore' || modo === 'consulta' || modo === 'fqdn'
  return (
    <>
      <Ilha raio={9.4} />
      <group key={modo}>
        {modo === 'traducao' && <Traducao />}
        {(modo === 'zona' || modo === 'registros' || modo === 'tabela') && <Zona cena={cena} />}
        {modo === 'tabela' && <Tabela />}
        {comArvore && <Arvore3D destaque={modo === 'fqdn' ? ['.br', '.edu'] : []} semNiveis={!!cena.estado.semNiveis} />}
        {modo === 'consulta' && <Consulta />}
        {modo === 'fqdn' && <Fqdn />}
        {modo === 'nslookup' && (
          <>
            <Traducao />
            <Terminal
              comando="nslookup www.unilasalle.edu.br"
              sugestoes={['nslookup www.unilasalle.edu.br', 'nslookup www.lasalle.edu.br', 'nslookup svr-net03.lasalle.edu.br', 'cls']}
            />
          </>
        )}
        {modo === 'url' && <Url cena={cena} semRotulos={!!cena.estado.semRotulos} />}
      </group>
      <Arvore pos={[-7.4, 0, 4]} escala={0.8} />
      <Arvore pos={[7.6, 0, -3.4]} />
    </>
  )
}
