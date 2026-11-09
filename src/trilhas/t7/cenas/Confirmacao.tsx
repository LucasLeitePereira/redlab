import type { ReactNode } from 'react'
import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Computador, Servidor } from '../../../three/modelos'
import { Janela, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Seta, VERDE, VERMELHO } from './comum'

// Fase 7.4 — ACK, retransmissão e three-way handshake (Aula 06 p. 7–8): linha do tempo
// vertical com o Cliente à esquerda e o Servidor à direita; o tempo corre para baixo.

const XC = -2.8
const XS = 2.8
const ZP = 0.2

const c = (y: number): V3 => [XC, y, ZP]
const s = (y: number): V3 => [XS, y, ZP]

/** Uma seta entre as duas linhas com o dado viajando por ela. */
function Mensagem({
  de,
  para,
  cor,
  ack = false,
  atraso,
  periodo,
  parar = 1,
  texto,
  pesoY = 0.3,
}: {
  de: V3
  para: V3
  cor: string
  ack?: boolean
  atraso: number
  periodo: number
  /** Fração do caminho que o dado percorre (0,5 = some no meio: pacote perdido). */
  parar?: number
  texto?: string
  pesoY?: number
}) {
  const fim: V3 = [de[0] + (para[0] - de[0]) * parar, de[1] + (para[1] - de[1]) * parar, ZP + 0.1]
  return (
    <group>
      <Seta de={de} para={para} cor={cor} raio={0.025} />
      {texto && (
        <Rotulo pos={[(de[0] + para[0]) / 2, (de[1] + para[1]) / 2 + pesoY, ZP]} classe="mini">
          <b>{texto}</b>
        </Rotulo>
      )}
      <Percurso pontos={[[de[0], de[1], ZP + 0.1], fim]} velocidade={3.6} atraso={atraso} periodo={periodo}>
        <group scale={0.5}>
          <Dado tipo="mensagem" cor={cor} confirmado={ack} sombra={false} altura={0} />
        </group>
      </Percurso>
    </group>
  )
}

function Linhas() {
  return (
    <group>
      <Caixa tam={[0.05, 4.4, 0.05]} pos={[XC, 2.9, 0]} cor="#5b6470" sombra={false} />
      <Caixa tam={[0.05, 4.4, 0.05]} pos={[XS, 2.9, 0]} cor="#5b6470" sombra={false} />
      <Computador pos={[XC, 0.12, 0.9]} escala={0.8} />
      <Servidor pos={[XS, 0.12, 0.9]} escala={0.8} />
      <Rotulo pos={[XC, 5.4, 0]} escuro>
        Cliente
      </Rotulo>
      <Rotulo pos={[XS, 5.4, 0]} escuro>
        Servidor
      </Rotulo>
    </group>
  )
}

function Nota({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <Rotulo pos={[x, y, 0]} classe="mini">
      {children}
    </Rotulo>
  )
}

function Ack() {
  const P = 11
  return (
    <group>
      <Linhas />
      <Mensagem de={c(4.8)} para={s(4.1)} cor={VERMELHO} texto="Segmento 1" atraso={0} periodo={P} />
      <Mensagem de={s(3.9)} para={c(3.2)} cor={VERDE} ack texto="ACK-1" atraso={2.4} periodo={P} />
      <Mensagem de={c(3.0)} para={s(2.3)} cor={VERMELHO} texto="Segmento 2" atraso={4.8} periodo={P} />
      <Mensagem de={s(2.1)} para={c(1.4)} cor={VERDE} ack texto="ACK-2" atraso={7.2} periodo={P} />
      <Nota x={-5.0} y={4.8}>⏱ envia e inicia o timer</Nota>
      <Nota x={-5.0} y={3.1}>⏱ ACK-1 chegou: envia o Segmento 2</Nota>
      <Nota x={-5.0} y={1.4}>ACK-2 recebido</Nota>
      <Nota x={5.0} y={4.0}>recebe Segmento 1 · envia ACK-1</Nota>
      <Nota x={5.0} y={2.2}>recebe Segmento 2 · envia ACK-2</Nota>
    </group>
  )
}

function Perda() {
  const P = 12
  return (
    <group>
      <Linhas />
      {/* 1º envio: o pacote some no meio */}
      <Mensagem de={c(4.9)} para={s(4.4)} cor={VERMELHO} parar={0.5} texto="Segmento 1" atraso={0} periodo={P} />
      <Rotulo pos={[0, 4.65, 0.2]} classe="grande" escuro>
        ✗ Pacote é perdido!
      </Rotulo>
      <Nota x={-5.0} y={4.9}>⏱ Envia Segmento 1 · Inicia o Timer</Nota>
      <Nota x={5.0} y={4.4}>Segmento 1 deveria ter chegado</Nota>
      <Nota x={5.0} y={4.0}>ACK-1 deveria ter sido transmitido</Nota>
      <Nota x={-5.0} y={3.6}>ACK-1 deveria ter chegado</Nota>
      <Janela periodo={P} de={2} ate={P}>
        <Rotulo pos={[-5.0, 3.1, 0]} escuro>
          Timer expirou!
        </Rotulo>
      </Janela>
      {/* reenvio */}
      <Mensagem de={c(2.7)} para={s(2.1)} cor={VERMELHO} texto="Re-Envia Segmento 1" atraso={4.5} periodo={P} />
      <Mensagem de={s(1.9)} para={c(1.3)} cor={VERDE} ack texto="ACK-1" atraso={7.5} periodo={P} />
      <Nota x={-5.0} y={2.7}>Re-Envia Segmento 1</Nota>
      <Nota x={5.0} y={2.0}>Recebe Segmento 1 · Envia ACK-1</Nota>
      <Nota x={-5.0} y={1.3}>Recebe ACK-1</Nota>
    </group>
  )
}

function Handshake({ semNomes }: { semNomes: boolean }) {
  const P = 9
  const passos = [
    { de: c(4.4), para: s(3.7), texto: 'SYN x', ordem: '1ª', atraso: 0 },
    { de: s(3.3), para: c(2.6), texto: 'SYN y, ACK x', ordem: '2ª', atraso: 2.6 },
    { de: c(2.2), para: s(1.5), texto: 'ACK y', ordem: '3ª', atraso: 5.2 },
  ]
  return (
    <group>
      <Linhas />
      {passos.map((p, i) => (
        <Mensagem
          key={i}
          de={p.de}
          para={p.para}
          cor={i === 1 ? VERDE : VERMELHO}
          ack={i === 1}
          atraso={p.atraso}
          periodo={P}
          pesoY={0.32}
          texto={semNomes ? p.ordem : `${p.ordem} · ${p.texto}`}
        />
      ))}
      <Rotulo pos={[0, 0.75, 0.2]} escuro>
        Conexão aberta nos dois sentidos (full-duplex)
      </Rotulo>
    </group>
  )
}

export function CenaConfirmacao(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'ack'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'ack' && <Ack />}
      {modo === 'perda' && <Perda />}
      {modo === 'handshake' && <Handshake semNomes={!!cena.estado.semNomes} />}
    </>
  )
}
