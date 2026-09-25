import { useMemo } from 'react'
import { Arvore, Caixa, Cilindro, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador } from '../../../three/modelos'
import { Chegada, Dado, type Sequencia } from '../../../three/dados'
import { cantosSuaves, Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.3 — quantidade de conexões e endereçamento (Aula 02, p. 7–10).
// "ponto": enlaces dedicados em fila (A–B–C), com B como nó intermediário.
// "difusao": um único cabo (barramento) compartilhado; o sinal chega a todos.
// "unicast" / "multicast" / "broadcast": o mesmo barramento dos desenhos do slide,
// com A enviando e o aviso de chegada (ícone com ✓) só na tela dos destinatários certos.

const Y = 0.16
/**
 * Aviso de chegada: o ícone do que chegou, com selo verde, salta bem na frente da tela de quem
 * recebeu (a tela do Computador fica a 0,76 de altura, escala 0.8). A `sequencia` é a do dado enviado.
 */
function Recebeu({ x, z, periodo, de, cor, sequencia }: { x: number; z: number; periodo: number; de: number; cor?: string; sequencia: Sequencia }) {
  return <Chegada pos={[x, 0.78, z + 0.32]} periodo={periodo} de={de} cor={cor} sequencia={sequencia} escala={0.95} />
}

// ---------- Ponto a ponto ----------

const PP: V3[] = [[-4.6, 0.12, -0.4], [0, 0.12, -0.4], [4.6, 0.12, -0.4]]
const Z_TOMADA = 0.5
const Z_CORREDOR = 1.05
/** Portas de rede: A tem uma, C tem uma e B tem duas (uma para cada enlace dedicado). */
const PORTA_A = PP[0][0] + 0.4
const PORTA_B1 = PP[1][0] - 0.5
const PORTA_B2 = PP[1][0] + 0.5
const PORTA_C = PP[2][0] - 0.4

/** Cabo de uma porta até outra: sai para a frente, corre reto e entra na outra porta (cantos arredondados). */
function caboPP(de: number, para: number): V3[] {
  return cantosSuaves([[de, Y, Z_TOMADA], [de, Y, Z_CORREDOR], [para, Y, Z_CORREDOR], [para, Y, Z_TOMADA]], 0.3)
}

/** Tomada no chão com uma porta escura para cada cabo. */
function Tomada({ x, portas }: { x: number; portas: number[] }) {
  const largura = Math.max(...portas.map((p) => Math.abs(p - x))) * 2 + 0.4
  return (
    <>
      <Caixa tam={[largura, 0.08, 0.4]} pos={[x, 0.1, Z_TOMADA]} cor="#dfe4ea" />
      {portas.map((px) => (
        <Caixa key={px} tam={[0.2, 0.14, 0.2]} pos={[px, 0.16, Z_TOMADA]} cor="#2d3540" sombra={false} />
      ))}
    </>
  )
}

function PontoAPonto() {
  // o dado vai pelo cabo A–B, B guarda e repassa, e ele segue pelo outro cabo até C
  const trecho = 1.9
  const espera = 0.9
  const saiDeB = trecho + espera
  const chegaEmC = saiDeB + trecho
  const periodo = chegaEmC + 1.6
  const sequencia = useMemo<Sequencia>(() => ({ indice: 0 }), [])
  return (
    <>
      {PP.map((p, i) => (
        <group key={i}>
          <Lote pos={p} tam={[2.4, 2.4]} />
          <Computador pos={p} escala={0.8} />
          <Rotulo pos={[p[0], 1.6, p[2]]} escuro={i === 1}>
            {'ABC'[i]}
            {i === 1 && <small>nó intermediário</small>}
          </Rotulo>
        </group>
      ))}
      {/* dois cabos de verdade: cada um liga só um par e termina numa porta própria */}
      <Tomada x={PP[0][0]} portas={[PORTA_A]} />
      <Tomada x={PP[1][0]} portas={[PORTA_B1, PORTA_B2]} />
      <Tomada x={PP[2][0]} portas={[PORTA_C]} />
      <Ligacao pontos={caboPP(PORTA_A, PORTA_B1)} raio={0.08} surgir={0.08} viagens={[{ duracao: trecho, pausa: periodo - trecho, sequencia, conduz: true }]} />
      <Ligacao pontos={caboPP(PORTA_B2, PORTA_C)} raio={0.08} surgir={0.08} viagens={[{ duracao: trecho, atraso: saiDeB, pausa: periodo - trecho, sequencia }]} />
      <Rotulo pos={[-2.3, 0.7, Z_CORREDOR + 0.4]}>enlace dedicado A–B</Rotulo>
      <Rotulo pos={[2.3, 0.7, Z_CORREDOR + 0.4]}>enlace dedicado B–C</Rotulo>
      <Recebeu x={PP[2][0]} z={PP[2][2]} periodo={periodo} de={chegaEmC} sequencia={sequencia} />
      <Janela periodo={periodo} de={trecho} ate={saiDeB}>
        <Rotulo pos={[0, 2.3, -0.4]}>B repassa para C</Rotulo>
      </Janela>
    </>
  )
}

// ---------- Barramento (difusão e endereçamento) ----------

const XS = [-4.2, -1.4, 1.4, 4.2]
const Z_PC = 0.9
const Z_BARRA = -1.6
const PONTA = 6.2

function Barramento({ modo }: { modo: string }) {
  const velocidade = 3
  const periodo = 6
  // Quem recebe em cada modo (A = 0 é sempre quem envia).
  const destinos = modo === 'unicast' ? [3] : modo === 'multicast' ? [2, 3] : [1, 2, 3]
  const rotas = destinos.map((d): V3[] => [
    [XS[0], Y, Z_PC - 0.2],
    [XS[0], Y, Z_BARRA],
    [XS[d], Y, Z_BARRA],
    [XS[d], Y, Z_PC - 0.2],
  ])
  const difusao = modo === 'difusao'
  // todas as cópias e todos os avisos mostram o mesmo tipo: a primeira cópia conduz a sequência
  const sequencia = useMemo<Sequencia>(() => ({ indice: 0 }), [])

  return (
    <>
      <Ligacao pontos={[[-PONTA, Y, Z_BARRA], [PONTA, Y, Z_BARRA]]} raio={0.1} cor="#2f5fb0" />
      {[-PONTA, PONTA].map((x) => (
        <Cilindro key={x} raio={0.16} altura={0.3} lados={12} pos={[x, Y, Z_BARRA]} rot={[0, 0, Math.PI / 2]} cor="#2d3540" />
      ))}
      {XS.map((x, i) => {
        const fora = modo === 'multicast' && i === 1
        return (
          <group key={i}>
            <Lote pos={[x, 0, Z_PC + 0.3]} tam={[2.3, 2.1]} />
            <Computador pos={[x, 0.12, Z_PC]} escala={0.8} apagado={fora} />
            <Ligacao pontos={[[x, Y, Z_PC - 0.2], [x, Y, Z_BARRA]]} raio={0.06} cor="#2f5fb0" />
            <Rotulo pos={[x, 1.65, Z_PC]} escuro={fora}>
              {'ABCD'[i]}
              {i === 0 && <small>envia</small>}
              {fora && <small>fora do grupo</small>}
            </Rotulo>
          </group>
        )
      })}

      {difusao ? (
        <>
          {/* O sinal entra no cabo e se espalha para os dois lados: todos recebem. */}
          <Percurso pontos={[[XS[0], Y + 0.12, Z_PC - 0.2], [XS[0], Y + 0.12, Z_BARRA], [-PONTA, Y + 0.12, Z_BARRA]]} velocidade={velocidade} periodo={periodo}>
            <group scale={0.8}><Dado cor="#e0463f" sequencia={sequencia} conduz /></group>
          </Percurso>
          {[1, 2, 3].map((d) => {
            const rota: V3[] = [[XS[0], Y + 0.12, Z_PC - 0.2], [XS[0], Y + 0.12, Z_BARRA], [XS[d], Y + 0.12, Z_BARRA], [XS[d], Y + 0.12, Z_PC - 0.2]]
            return (
              <group key={d}>
                <Percurso pontos={rota} velocidade={velocidade} periodo={periodo}>
                  <group scale={0.8}><Dado cor="#e0463f" sequencia={sequencia} /></group>
                </Percurso>
                <Recebeu x={XS[d]} z={Z_PC} cor="#e0463f" periodo={periodo} de={linhaDoTempo(rota, velocidade, 0).total} sequencia={sequencia} />
              </group>
            )
          })}
          <Rotulo pos={[0, 0.9, Z_BARRA - 0.6]}>um único enlace compartilhado por todos</Rotulo>
        </>
      ) : (
        <>
          {rotas.map((rota, i) => (
            <group key={i}>
              <Percurso pontos={rota} velocidade={velocidade} periodo={periodo}>
                <group scale={0.8}>
                  <Dado cor="#e0463f" sequencia={sequencia} conduz={i === 0} />
                </group>
              </Percurso>
              <Recebeu x={XS[destinos[i]]} z={Z_PC} cor="#e0463f" periodo={periodo} de={linhaDoTempo(rota, velocidade, 0).total} sequencia={sequencia} />
            </group>
          ))}
          <Rotulo pos={[0, 2.6, -2.4]} escuro>
            {modo === 'unicast' ? 'UNICAST · A → D' : modo === 'multicast' ? 'MULTICAST · A → grupo {C, D}' : 'BROADCAST · A → todos'}
          </Rotulo>
        </>
      )}
    </>
  )
}

export function CenaConexoes({ estado }: CenaProps) {
  const modo = (estado.modo as string | undefined) ?? 'ponto'
  return (
    <>
      <Ilha raio={8} />
      {/* key: trocar de modo reinicia as animações, todas juntas */}
      {modo === 'ponto' ? <PontoAPonto key={modo} /> : <Barramento key={modo} modo={modo} />}
      <Arvore pos={[-6.2, 0, 3.4]} escala={0.8} />
      <Arvore pos={[6.3, 0, 3.0]} escala={0.9} />
      <Arvore pos={[5.6, 0, -4.4]} />
    </>
  )
}
