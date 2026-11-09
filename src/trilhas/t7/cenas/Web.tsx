import { Caixa, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { AMARELO, Fileira, NEUTRO, Seta, Tijolo } from './comum'

// Fase 7.7 — Serviço de Página WEB (Aula 06 p. 13–17): tabela de serviços, hipertexto,
// navegador e servidor, HTTP sobre TCP e o proxy.

const SERVICOS = [
  { s: 'Página Web', p: 'HTTP e HTTPs' },
  { s: 'Correio Eletrônico', p: 'SMTP-S, POP3-S e IMAP4' },
  { s: 'Transferência Arquivos', p: 'FTP-Data e FTP-Controle' },
  { s: 'Acesso Remoto', p: 'Telnet e SSH' },
]

function Servicos({ semNomes }: { semNomes: boolean }) {
  const y = (i: number) => 3.5 - i * 0.75
  const lado = (x: number, largura: number, t: string, i: number, cor: string, claro = false) => (
    <Fileira y={y(i)} x={x} largura={largura} h={0.6} itens={[{ t, f: 1, cor, claro }]} pequeno={false} />
  )
  return (
    <group>
      {lado(-2.6, 4.6, 'Serviço de Rede', -1, '#34506a', true)}
      {lado(2.6, 5.2, 'Protocolos Usados', -1, '#34506a', true)}
      {SERVICOS.map((r, i) => (
        <group key={r.s}>
          {lado(-2.6, 4.6, r.s, i, NEUTRO)}
          {lado(2.6, 5.2, semNomes ? '?' : r.p, i, AMARELO)}
        </group>
      ))}
    </group>
  )
}

const DOCS: { id: string; pos: V3 }[] = [
  { id: 'A', pos: [-4.6, 3.6, 0] },
  { id: 'B', pos: [-1.4, 4.4, 0] },
  { id: 'C', pos: [2.0, 3.8, 0] },
  { id: 'D', pos: [-3.4, 1.4, 0] },
  { id: 'E', pos: [0.2, 1.8, 0] },
  { id: 'F', pos: [4.2, 2.0, 0] },
]
const LINKS: [string, string][] = [['A', 'B'], ['B', 'C'], ['C', 'F'], ['F', 'E'], ['E', 'D'], ['A', 'D'], ['B', 'E'], ['D', 'B']]
const doc = (id: string) => DOCS.find((d) => d.id === id)!.pos

/** A seta começa e termina na borda dos documentos (raio `r` a partir do centro). */
function ligar(a: V3, b: V3, r = 0.85): [V3, V3] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const d = Math.hypot(dx, dy)
  return [
    [a[0] + (dx / d) * r, a[1] + (dy / d) * r, 0.1],
    [b[0] - (dx / d) * r, b[1] - (dy / d) * r, 0.1],
  ]
}

function Hipertexto() {
  const roteiro = ['A', 'B', 'C', 'F', 'E', 'D'].map((id): V3 => [doc(id)[0], doc(id)[1], 0.6])
  return (
    <group>
      {LINKS.map(([a, b]) => {
        const [de, para] = ligar(doc(a), doc(b))
        return <Seta key={a + b} de={de} para={para} cor="#2f6fb0" raio={0.035} />
      })}
      {DOCS.map((d) => (
        <Tijolo key={d.id} pos={d.pos} tam={[1.2, 1.5, 0.15]} cor="#ffffff" texto={d.id} />
      ))}
      <Rotulo pos={[0, 5.3, 0]} escuro>
        Documentos ligados de forma não linear (links)
      </Rotulo>
      <Percurso pontos={roteiro} velocidade={2.2} espera={0.5}>
        <Esfera raio={0.17} cor="#c0562b" emissivo="#c0562b" intensidade={1} sombra={false} />
      </Percurso>
    </group>
  )
}

function ClienteServidor({ requisicao }: { requisicao: boolean }) {
  return (
    <group>
      <Computador pos={[-5.0, 0.12, 0.6]} escala={0.9} />
      <Servidor pos={[5.0, 0.12, 0.6]} escala={0.9} />
      <Rotulo pos={[-5.0, 2.0, 0.6]} classe="cartao">
        <b>① NAVEGADOR (browser)</b>
        clica no hyperlink <span style={{ color: '#2f6fb0' }}>abcd.com</span>
      </Rotulo>
      <Rotulo pos={[4.6, 2.9, 0.6]} classe="cartao">
        <b>② SERVIDOR WEB</b>
        <span style={{ color: '#2f6fb0' }}>abcd.com</span> · Apache · IIS
      </Rotulo>
      <Esfera raio={1.0} pos={[-1.1, 1.1, -0.9]} cor="#eef3f8" sombra={false} />
      <Esfera raio={1.35} pos={[0.2, 1.3, -1.0]} cor="#f6f9fc" sombra={false} />
      <Esfera raio={0.95} pos={[1.6, 1.0, -0.9]} cor="#eef3f8" sombra={false} />
      <Rotulo pos={[0.2, 2.5, -1.0]} escuro>
        Internet
      </Rotulo>
      <Ligacao
        pontos={[[-4.0, 0.16, 0.6], [4.0, 0.16, 0.6]]}
        cor="#2f7fd0"
        raio={0.09}
        viagens={
          requisicao
            ? [{ cor: '#ef6f6c', tipo: 'mensagem' }, { cor: '#3aa0e6', tipo: 'documento', inverso: true, atraso: 3.5 }]
            : [{ cor: '#3aa0e6', tipo: 'documento', inverso: true }]
        }
      />
      <Rotulo pos={[0, 0.95, 0.6]} classe="mini">
        <b>Conexão TCP</b>
      </Rotulo>
      {requisicao && (
        <>
          <Rotulo pos={[-2.2, 1.7, 0.6]} escuro>
            HTTP request →
          </Rotulo>
          <Rotulo pos={[2.2, 1.7, 0.6]} escuro>
            ← HTTP response
          </Rotulo>
        </>
      )}
    </group>
  )
}

const U: V3 = [-5.2, 0.14, 1.2]
const P: V3 = [-2.0, 0.14, 1.2]
const X: V3 = [5.0, 0.14, 1.2]

function Proxy() {
  const ciclo = 15
  const pedido = (pontos: V3[], atraso: number, cor: string, tipo: 'mensagem' | 'documento') => (
    <Percurso pontos={pontos} velocidade={3.2} espera={0.3} periodo={ciclo} atraso={atraso}>
      <group scale={0.55}>
        <Dado tipo={tipo} cor={cor} sombra={false} />
      </group>
    </Percurso>
  )
  return (
    <group>
      {/* rede interna */}
      <Caixa tam={[6.4, 0.06, 3.4]} pos={[-3.6, 0.03, 1.2]} cor="#cfe3f5" sombra={false} />
      <Rotulo pos={[-3.6, 0.2, 2.7]} classe="mini">
        <b>Rede interna</b>
      </Rotulo>
      <Computador pos={[U[0], 0.12, U[2]]} escala={0.8} />
      <Servidor pos={[P[0], 0.12, P[2]]} escala={0.8} />
      <Servidor pos={[X[0], 0.12, X[2]]} escala={0.8} />
      <Esfera raio={0.9} pos={[1.0, 1.0, -0.6]} cor="#eef3f8" sombra={false} />
      <Esfera raio={1.25} pos={[2.2, 1.2, -0.7]} cor="#f6f9fc" sombra={false} />
      <Rotulo pos={[1.9, 2.4, -0.7]} escuro>
        Internet
      </Rotulo>
      <Rotulo pos={[U[0], 1.8, U[2]]} escuro>
        User
      </Rotulo>
      <Rotulo pos={[P[0], 1.9, P[2]]} escuro>
        Proxy · cache
      </Rotulo>
      <Rotulo pos={[X[0], 1.9, X[2]]} escuro>
        example.com
      </Rotulo>
      <Ligacao pontos={[U, P]} cor="#2f5fa0" raio={0.05} />
      <Ligacao pontos={[P, X]} cor="#2f5fa0" raio={0.05} />
      <Rotulo pos={[-3.6, 0.75, 1.2]} classe="mini">
        TCP/3128
      </Rotulo>
      <Rotulo pos={[1.5, 0.75, 1.2]} classe="mini">
        TCP/80 · TCP/443
      </Rotulo>
      <Rotulo pos={[0, 4.6, 0]} classe="cartao">
        <b>1ª vez</b>o proxy busca a página em example.com, na Internet, e guarda uma cópia
      </Rotulo>
      <Rotulo pos={[0, 3.5, 0]} classe="cartao">
        <b>2ª vez</b>o proxy responde do cache, sem ir à Internet
      </Rotulo>
      {pedido([U, P, X], 0, '#ef6f6c', 'mensagem')}
      {pedido([X, P, U], 4.6, '#3aa0e6', 'documento')}
      {pedido([U, P], 9.2, '#ef6f6c', 'mensagem')}
      {pedido([P, U], 11.2, '#3aa0e6', 'documento')}
    </group>
  )
}

export function CenaWeb(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'servicos'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'servicos' && <Servicos semNomes={!!cena.estado.semNomes} />}
      {modo === 'hipertexto' && <Hipertexto />}
      {modo === 'clienteServidor' && <ClienteServidor requisicao={!!cena.estado.requisicao} />}
      {modo === 'proxy' && <Proxy />}
    </>
  )
}
