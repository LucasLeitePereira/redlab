import { Alvo, Caixa, Ilha, Rotulo } from '../../../three/base'
import { Celular, Computador, PontoDeAcesso, Roteador, Switch } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { OSI, PilhaOsi } from '../../t5/cenas/comum'
import { Quadro } from './comum'

// Fase 8.1 — Camada de Enlace (Aula 07 p. 2–3).
// 'protocolos': pilha OSI no canto + cartão com exemplos de protocolos.
// 'servicos': pilha no canto + quadro (cabeçalho com MAC | dados | FCS) com 3 alvos + lista dos 5 serviços.
// 'subcamadas': pilha 3D com o Enlace dividido em LLC (em cima) e MAC (embaixo).

const SERVICOS = [
  'Endereçamento físico (ex.: endereço MAC).',
  'Delimitação e formato dos quadros.',
  'Detecção de erros da transmissão.',
  'Controle de fluxo de transmissão no enlace.',
  'Controle de acesso aos meios físicos.',
]

function Protocolos() {
  const ox = 0.8
  return (
    <>
      <Quadro pos={[ox, 3.4, 0]} largura={330}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6 }}>Exemplos de protocolos</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, fontWeight: 600, lineHeight: 1.55 }}>
          <li><i>Ethernet</i>, <i>FastEthernet</i>;</li>
          <li>Wifi, <i>Bluetooth</i>;</li>
          <li><i>TokenRing</i>;</li>
          <li>PPP, <i>Frame Relay</i>, ATM, etc.</li>
        </ul>
      </Quadro>
      <Switch pos={[ox - 3.4, 0.12, 2.2]} escala={1.1} />
      <PontoDeAcesso pos={[ox - 1.2, 0.12, 2.2]} />
      <Celular pos={[ox + 0.3, 0.12, 2.4]} />
      <Computador pos={[ox + 1.9, 0.12, 2.2]} escala={0.6} />
      <Roteador pos={[ox + 3.6, 0.12, 2.2]} escala={0.8} />
    </>
  )
}

function Servicos({ cena }: { cena: CenaProps }) {
  const ox = 0.8
  const y = 4.2
  const alt = 1.0
  // partes do quadro: [nome, largura, cor, id do alvo]
  const partes: { nome: string; x0: number; larg: number; cor: string; sub?: string[] }[] = [
    { nome: 'Cabeçalho', x0: -3.5, larg: 2.9, cor: '#6f9fd8', sub: ['MAC destino', 'MAC origem'] },
    { nome: 'Dados', x0: -0.6, larg: 3.1, cor: '#b9c4cf' },
    { nome: 'FCS', x0: 2.5, larg: 1.0, cor: '#e0606e' },
  ]
  return (
    <>
      {partes.map((p) => (
        <group key={p.nome}>
          <Caixa tam={[p.larg - 0.06, alt, 0.5]} pos={[ox + p.x0 + p.larg / 2, y, 0]} cor={p.cor} />
          {p.sub ? (
            p.sub.map((s, i) => (
              <Rotulo key={s} pos={[ox + p.x0 + p.larg / 4 + (i * p.larg) / 2, y, 0.27]} classe="tijolo pequeno">
                {s}
              </Rotulo>
            ))
          ) : (
            <Rotulo pos={[ox + p.x0 + p.larg / 2, y, 0.27]} classe={`tijolo ${p.nome === 'FCS' ? 'claro' : ''}`}>
              {p.nome}
            </Rotulo>
          )}
        </group>
      ))}
      <Rotulo pos={[ox - 2.05, y + 1.0, 0]} classe="mini">
        Cabeçalho
      </Rotulo>
      {/* colchete do quadro inteiro */}
      <Caixa tam={[7.0, 0.05, 0.1]} pos={[ox, y - 0.85, 0]} cor="#4a5a6a" sombra={false} />
      <Caixa tam={[0.05, 0.3, 0.1]} pos={[ox - 3.5, y - 0.72, 0]} cor="#4a5a6a" sombra={false} />
      <Caixa tam={[0.05, 0.3, 0.1]} pos={[ox + 3.5, y - 0.72, 0]} cor="#4a5a6a" sombra={false} />
      <Rotulo pos={[ox, y - 1.2, 0]} classe="mini">
        Quadro
      </Rotulo>
      <Alvo id="mac" pos={[ox - 2.05, y + 1.6, 0.3]} cena={cena} />
      <Alvo id="delimita" pos={[ox + 3.9, y - 0.85, 0.3]} cena={cena} />
      <Alvo id="fcs" pos={[ox + 3.0, y + 1.0, 0.3]} cena={cena} />

      <Quadro pos={[ox, 1.5, 0]} largura={400}>
        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Serviços fornecidos</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>
          {SERVICOS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Quadro>
    </>
  )
}

const ALTURAS: Record<string, number> = { fisica: 0.35, rede: 2.55, transporte: 3.15, sessao: 3.75, apresentacao: 4.35, aplicacao: 4.95 }

function Subcamadas({ semNomes }: { semNomes: boolean }) {
  const ox = -2.0
  const largura = 3.4
  return (
    <>
      {OSI.filter((c) => c.id !== 'enlace').map((c) => (
        <group key={c.id}>
          <Caixa tam={[largura, 0.5, 1.0]} pos={[ox, ALTURAS[c.id], 0]} cor={c.cor} />
          <Rotulo pos={[ox, ALTURAS[c.id], 0.52]} classe="camada-osi">
            {c.nome}
          </Rotulo>
        </group>
      ))}
      {/* Enlace dividido em LLC (em cima) e MAC (embaixo) */}
      <Caixa tam={[largura, 0.75, 1.0]} pos={[ox, 1.85, 0]} cor="#e0a92a" />
      <Caixa tam={[largura, 0.75, 1.0]} pos={[ox, 1.0, 0]} cor="#c48a14" />
      <Rotulo pos={[ox, 1.85, 0.52]} classe="tijolo">
        LLC
      </Rotulo>
      <Rotulo pos={[ox, 1.0, 0.52]} classe="tijolo">
        MAC
      </Rotulo>
      <Rotulo pos={[ox - largura / 2 - 0.75, 1.42, 0]} escuro>
        Enlace
      </Rotulo>
      <Rotulo pos={[ox, 5.6, 0]} classe="mini">
        RM-OSI
      </Rotulo>

      {!semNomes && (
        <>
          <Quadro pos={[ox + 5.0, 2.4, 0]} largura={330} estilo={{ borderLeft: '6px solid #e0a92a' }}>
            <div style={{ fontWeight: 900, fontSize: 14 }}>LLC — Subcamada de Controle de Enlace Lógico</div>
            <div style={{ fontSize: 12.5, fontStyle: 'italic', margin: '1px 0 3px' }}>Logic Link Control</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Conecta a subcamada MAC aos protocolos das camadas superiores.</div>
          </Quadro>
          <Quadro pos={[ox + 5.0, 0.6, 0]} largura={330} estilo={{ borderLeft: '6px solid #c48a14' }}>
            <div style={{ fontWeight: 900, fontSize: 14 }}>MAC — Subcamada de Controle de Acesso ao Meio</div>
            <div style={{ fontSize: 12.5, fontStyle: 'italic', margin: '1px 0 3px' }}>Media Access Control</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Faz o controle de acesso e acrescenta o endereço físico ao pacote.</div>
          </Quadro>
        </>
      )}
    </>
  )
}

export function CenaEnlace(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'protocolos'
  const semNomes = !!cena.estado.semNomes
  return (
    <>
      <Ilha raio={8.6} />
      {modo !== 'subcamadas' && <PilhaOsi foco={['enlace']} />}
      {modo === 'protocolos' && <Protocolos />}
      {modo === 'servicos' && <Servicos cena={cena} />}
      {modo === 'subcamadas' && <Subcamadas semNomes={semNomes} />}
    </>
  )
}
