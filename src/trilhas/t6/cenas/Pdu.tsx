import { Line } from '@react-three/drei'
import { Alvo, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Janela, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Seta, Tijolo } from './comum'

// Fase 6.7 — Unidade de Dados do Protocolo (PDU) e encapsulamento (Aula 05 p3, p. 4).
// A figura do slide: duas pilhas (Software + 5 camadas, cores do slide), setas entre os pares
// e, no meio, a PDU de cada camada: cabeçalho (preto) + carga útil (a PDU da camada de cima);
// no enlace, também o FCS; na física, os sinais. No modo "encapsular" as PDUs aparecem uma
// por vez, de cima para baixo, enquanto o dado desce a pilha da esquerda.

export const NIVEIS = [
  { id: 'software', nome: 'Software', cor: '#9e9e9e', pdu: 'Dados' },
  { id: 'aplicacao', nome: 'Aplicação', cor: '#f7d64a', pdu: 'MENSAGENS' },
  { id: 'transporte', nome: 'Transporte', cor: '#6dbb5a', pdu: 'SEGMENTOS' },
  { id: 'rede', nome: 'Rede', cor: '#e0606e', pdu: 'PACOTES' },
  { id: 'enlace', nome: 'Enlace', cor: '#6f9fd8', pdu: 'QUADROS' },
  { id: 'fisica', nome: 'Física', cor: '#b3aed6', pdu: 'Sinais' },
]
const XP = 4.6
const y = (k: number) => 4.5 - k * 0.82
const CAB = 0.6
const FCS = 0.5
const ALTURA = 0.3
const PASSO_T = 1.3
const CICLO = NIVEIS.length * PASSO_T + 3

/** Largura total da PDU do nível `k` (sem o FCS). */
const largura = (k: number) => 1.2 + k * CAB

function Barra({ k, semNomes }: { k: number; semNomes: boolean }) {
  const n = NIVEIS[k]
  const yb = y(k)
  if (n.id === 'fisica') {
    const pontos: V3[] = []
    for (let i = 0; i <= 12; i++) {
      const x = -2.4 + i * 0.4
      const alto = i % 2 === 0
      pontos.push([x, yb + (alto ? 0.15 : -0.15), 0.2], [x + 0.4, yb + (alto ? 0.15 : -0.15), 0.2])
    }
    return (
      <group>
        <Line points={pontos} color="#1f8a3a" lineWidth={3} />
        {!semNomes && (
          <Rotulo pos={[-3.2, yb, 0.2]} classe="bits">
            Sinais
          </Rotulo>
        )}
      </group>
    )
  }
  const carga = k === 0 ? 1.2 : largura(k - 1)
  const total = largura(k) + (n.id === 'enlace' ? FCS : 0)
  const x0 = -total / 2
  const anterior = NIVEIS[k - 1]
  return (
    <group>
      {k > 0 && <Caixa tam={[CAB, ALTURA, 0.3]} pos={[x0 + CAB / 2, yb, 0.2]} cor="#1d2733" />}
      <Tijolo
        pos={[x0 + (k > 0 ? CAB : 0) + carga / 2, yb, 0.2]}
        tam={[carga, ALTURA, 0.3]}
        cor={k === 0 ? '#c9c9c9' : anterior.cor}
        texto={k === 0 || k === 1 ? 'Dados' : semNomes ? '?' : anterior.pdu}
        pequeno
      />
      {n.id === 'enlace' && <Tijolo pos={[x0 + CAB + carga + FCS / 2, yb, 0.2]} tam={[FCS, ALTURA, 0.3]} cor="#1d2733" claro texto="FCS" pequeno />}
      {k > 0 && !semNomes && (
        <Rotulo pos={[0, yb - 0.33, 0.25]} classe="mini">
          <b>{n.pdu}</b>
        </Rotulo>
      )}
    </group>
  )
}

export function CenaPdu(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'pdu'
  const semNomes = !!cena.estado.semNomes
  const animar = modo === 'encapsular'

  return (
    <>
      <Ilha raio={8.6} />
      {NIVEIS.map((n, k) => (
        <group key={n.id}>
          {[-XP, XP].map((x) => (
            <Tijolo key={x} pos={[x, y(k), 0]} tam={[1.8, 0.52, 0.5]} cor={n.cor} texto={n.nome} />
          ))}
          <Seta de={[-XP + 0.95, y(k), -0.15]} para={[XP - 0.95, y(k), -0.15]} cor="#1d2733" raio={0.022} duasPontas />
          {animar ? (
            <Janela periodo={CICLO} de={k * PASSO_T} ate={CICLO}>
              <Barra k={k} semNomes={semNomes} />
            </Janela>
          ) : (
            <Barra k={k} semNomes={semNomes} />
          )}
        </group>
      ))}
      <Rotulo pos={[0, y(0) + 0.5, 0.2]} classe="bits">
        <span style={{ color: '#2f6fb0' }}>www.google.com.br</span>
      </Rotulo>
      <Rotulo pos={[4.3, y(0) + 1.05, 0]} classe="mini">
        <span style={{ color: '#1d2733' }}>■</span> Cabeçalho
      </Rotulo>

      {animar && (
        <Percurso pontos={NIVEIS.map((_, k): V3 => [-XP - 1.15, y(k), 0.3])} velocidade={0.82 / PASSO_T} periodo={CICLO}>
          <group scale={0.6}>
            <Dado tipo="mensagem" sombra={false} />
          </group>
        </Percurso>
      )}

      {NIVEIS.slice(1).map((n, i) => (
        <Alvo key={n.id} id={n.pdu.toLowerCase()} pos={[XP - 1.3, y(i + 1) + 0.3, 0.4]} cena={cena} />
      ))}
    </>
  )
}
