import { Arvore, Caixa, Cilindro, Esfera, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao, type Viagem } from '../../../three/Ligacao'
import { Computador } from '../../../three/modelos'
import { Janela } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.4 — formas de uso do enlace (Aula 02, p. 11–12), como ruas entre A e B:
// simplex = mão única; half-duplex = uma faixa, um sentido de cada vez (semáforo);
// full-duplex = duas faixas, os dois sentidos ao mesmo tempo.

const A: V3 = [-4.8, 0.12, -0.6]
const B: V3 = [4.8, 0.12, -0.6]
const IDA = '#ef6f6c'
const VOLTA = '#3aa0e6'

// Half-duplex: A manda dois dados, um de cada vez; quando o último chega, é a vez de B.
// O semáforo de cada um fica verde do primeiro envio até o último dado chegar do outro lado.
const TRECHO_HALF = 2.2
const FOLGA_HALF = 0.3
const TROCA_HALF = 0.5
const IDA_HALF = [0, TRECHO_HALF + FOLGA_HALF]
const FIM_A = IDA_HALF[1] + TRECHO_HALF
const VOLTA_HALF = [FIM_A + TROCA_HALF, FIM_A + TROCA_HALF + TRECHO_HALF + FOLGA_HALF]
const FIM_B = VOLTA_HALF[1] + TRECHO_HALF
const PERIODO_HALF = FIM_B + TROCA_HALF

// Laterais dos gabinetes (escala 0.9), virados um para o outro: o de A à direita dele, o de B à esquerda.
const LADO_A = A[0] + (0.95 + 0.21) * 0.9
const LADO_B = B[0] - (0.95 + 0.21) * 0.9

/** Rua reta entre os dois computadores, na profundidade `z`; `colada` a leva até a lateral de cada um. */
function Rua({ z, viagens, colada }: { z: number; viagens: Viagem[]; colada?: boolean }) {
  const [x0, x1] = colada ? [LADO_A, LADO_B] : [A[0] + 1.2, B[0] - 1.2]
  return <Ligacao pontos={[[x0, 0.16, z], [x1, 0.16, z]]} raio={0.09} viagens={viagens} />
}

/** Setas no chão (haste + ponta) indicando o sentido da faixa, ao lado da rua (`lado` 1 = frente, -1 = atrás). */
function Setas({ z, sentido, lado = 1 }: { z: number; sentido: 1 | -1; lado?: 1 | -1 }) {
  return (
    <>
      {[-1.8, 0, 1.8].map((x) => (
        <group key={x} position={[x, 0.06, z + lado * 0.45]} rotation={[0, sentido === 1 ? 0 : Math.PI, 0]}>
          <Caixa tam={[0.5, 0.06, 0.12]} pos={[-0.2, 0, 0]} cor="#f2b134" sombra={false} />
          {/* prisma de 3 lados em pé: a ponta do triângulo fica virada para +x */}
          <Cilindro raio={0.26} altura={0.06} lados={3} pos={[0.13, 0, 0]} rot={[0, Math.PI / 2, 0]} cor="#f2b134" sombra={false} />
        </group>
      ))}
    </>
  )
}

/** Luz sobre o computador: verde quando ele pode transmitir. */
function Semaforo({ pos, de, ate }: { pos: V3; de: number; ate: number }) {
  return (
    <group position={[pos[0], 2.0, pos[2]]}>
      <Cilindro raio={0.05} altura={0.5} pos={[0, -0.25, 0]} cor="#5b6470" />
      <Esfera raio={0.2} cor="#b23a36" emissivo="#e0463f" intensidade={0.4} />
      <Janela periodo={PERIODO_HALF} de={de} ate={ate}>
        <Esfera raio={0.22} cor="#39d97a" emissivo="#39d97a" intensidade={1.4} sombra={false} />
      </Janela>
    </group>
  )
}

export function CenaEnlace({ estado }: CenaProps) {
  const modo = (estado.modo as string | undefined) ?? 'simplex'
  return (
    <>
      <Ilha raio={8} />
      <Lote pos={A} tam={[2.6, 2.4]} />
      <Lote pos={B} tam={[2.6, 2.4]} />
      <Computador pos={A} escala={0.9} />
      <Computador pos={B} escala={0.9} tela="#8fd9a8" gabinete="esquerda" />
      <Rotulo pos={[A[0], 1.8, A[2]]}>A</Rotulo>
      <Rotulo pos={[B[0], 1.8, B[2]]}>B</Rotulo>

      {/* key: cada modo reinicia os relógios das animações juntos */}
      {modo === 'simplex' && (
        <group key="simplex">
          <Rua z={0.4} viagens={[0, 1, 2].map((i) => ({ cor: IDA, duracao: 3, pausa: 0, atraso: i }))} />
          <Setas z={0.4} sentido={1} />
          <Rotulo pos={[0, 1.3, 0.4]} escuro>Mão única: só A transmite</Rotulo>
          <Rotulo pos={[B[0], 2.5, B[2]]}>só recebe</Rotulo>
        </group>
      )}

      {modo === 'half' && (
        <group key="half">
          <Rua
            z={0.4}
            viagens={[
              ...IDA_HALF.map((atraso) => ({ cor: IDA, duracao: TRECHO_HALF, pausa: PERIODO_HALF - TRECHO_HALF, atraso })),
              ...VOLTA_HALF.map((atraso) => ({ cor: VOLTA, duracao: TRECHO_HALF, pausa: PERIODO_HALF - TRECHO_HALF, atraso, inverso: true })),
            ]}
          />
          <Semaforo pos={A} de={0} ate={FIM_A} />
          <Semaforo pos={B} de={VOLTA_HALF[0]} ate={FIM_B} />
          <Rotulo pos={[0, 1.3, 0.4]} escuro>Uma faixa: um sentido de cada vez</Rotulo>
        </group>
      )}

      {modo === 'full' && (
        <group key="full">
          {/* as duas faixas encostam na lateral dos computadores; cada uma com suas setas do lado de fora */}
          <Rua colada z={-0.9} viagens={[0, 1, 2].map((i) => ({ cor: IDA, duracao: 3, pausa: 0, atraso: i }))} />
          <Rua colada z={-0.4} viagens={[0, 1, 2].map((i) => ({ cor: VOLTA, duracao: 3, pausa: 0, atraso: i + 0.5, inverso: true }))} />
          <Setas z={-0.9} sentido={1} lado={-1} />
          <Setas z={-0.4} sentido={-1} />
          <Rotulo pos={[0, 1.6, -1.8]} escuro>Duas faixas: os dois ao mesmo tempo</Rotulo>
        </group>
      )}

      <Arvore pos={[-6.2, 0, 3.6]} escala={0.8} />
      <Arvore pos={[6.4, 0, 3.2]} />
      <Arvore pos={[0.4, 0, -5.4]} escala={0.9} />
    </>
  )
}
