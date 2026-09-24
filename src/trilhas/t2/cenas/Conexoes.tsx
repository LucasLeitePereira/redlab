import { Arvore, Caixa, Cilindro, Esfera, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Caminhao, Computador } from '../../../three/modelos'
import { Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.3 — quantidade de conexões e endereçamento (Aula 02, p. 7–10).
// "ponto": enlaces dedicados em fila (A–B–C), com B como nó intermediário.
// "difusao": um único cabo (barramento) compartilhado; o sinal chega a todos.
// "unicast" / "multicast" / "broadcast": o mesmo barramento dos desenhos do slide,
// com A enviando e só os destinatários certos acendendo a tela.

const Y = 0.16
const TELA_OK = '#5ee08a'

/** Brilho verde na tela de quem recebeu (a tela do Computador fica a 0.8 de altura, escala 0.8). */
function Recebeu({ x, z, periodo, de }: { x: number; z: number; periodo: number; de: number }) {
  return (
    <Janela periodo={periodo} de={de} ate={periodo}>
      <Caixa tam={[0.9, 0.56, 0.03]} pos={[x, 0.12 + 0.64, z + 0.07]} cor={TELA_OK} emissivo={TELA_OK} intensidade={0.9} sombra={false} />
    </Janela>
  )
}

// ---------- Ponto a ponto ----------

const PP: V3[] = [[-4.6, 0.12, -0.4], [0, 0.12, -0.4], [4.6, 0.12, -0.4]]
const PP_CABO = PP.map(([x, , z]): V3 => [x, Y, z + 0.9])

function PontoAPonto() {
  const velocidade = 2.6
  const espera = 0.9
  const { chegadas, total } = linhaDoTempo(PP_CABO, velocidade, espera)
  const periodo = total + 1.6
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
      <Ligacao pontos={[PP_CABO[0], PP_CABO[1]]} raio={0.08} />
      <Ligacao pontos={[PP_CABO[1], PP_CABO[2]]} raio={0.08} />
      <Rotulo pos={[-2.3, 0.7, 0.5]}>enlace dedicado A–B</Rotulo>
      <Rotulo pos={[2.3, 0.7, 0.5]}>enlace dedicado B–C</Rotulo>
      <Percurso pontos={PP_CABO} velocidade={velocidade} espera={espera} periodo={periodo}>
        <group scale={0.8}>
          <Caminhao />
        </group>
      </Percurso>
      <Recebeu x={PP[2][0]} z={PP[2][2]} periodo={periodo} de={chegadas[2]} />
      <Janela periodo={periodo} de={chegadas[1]} ate={chegadas[1] + espera}>
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
            <Esfera raio={0.2} cor="#ffd23f" emissivo="#ffd23f" intensidade={1.2} sombra={false} />
          </Percurso>
          {[1, 2, 3].map((d) => {
            const rota: V3[] = [[XS[0], Y + 0.12, Z_PC - 0.2], [XS[0], Y + 0.12, Z_BARRA], [XS[d], Y + 0.12, Z_BARRA], [XS[d], Y + 0.12, Z_PC - 0.2]]
            return (
              <group key={d}>
                <Percurso pontos={rota} velocidade={velocidade} periodo={periodo}>
                  <Esfera raio={0.2} cor="#ffd23f" emissivo="#ffd23f" intensidade={1.2} sombra={false} />
                </Percurso>
                <Recebeu x={XS[d]} z={Z_PC} periodo={periodo} de={linhaDoTempo(rota, velocidade, 0).total} />
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
                  <Caminhao cor="#e0463f" />
                </group>
              </Percurso>
              <Recebeu x={XS[destinos[i]]} z={Z_PC} periodo={periodo} de={linhaDoTempo(rota, velocidade, 0).total} />
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
