import { useFrame } from '@react-three/fiber'
import { useCallback, useRef, useState } from 'react'
import { Alvo, Arvore, Cilindro, Esfera, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao, type Viagem } from '../../../three/Ligacao'
import { Computador, Switch } from '../../../three/modelos'
import { Dado } from '../../../three/dados'
import { Janela, linhaDoTempo, Percurso, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.5 — topologias físicas (Aula 02, p. 13–15). Nos passos de explorar, os alvos
// são tesouras: cortar o cabo mostra o que cai em cada topologia.

const Y = 0.16
const PEDIDO = '#ef6f6c'
const RESPOSTA = '#3aa0e6'

/** Cabo reto entre dois pontos; se `cortado`, abre um buraco (em `corte`, de 0 a 1) com faíscas. */
function Enlace({ de, para, cortado, corte = 0.5, raio = 0.07, cor = '#2f5fb0', viagens = [] }: {
  de: V3
  para: V3
  cortado?: boolean
  corte?: number
  raio?: number
  cor?: string
  viagens?: Viagem[]
}) {
  if (!cortado) return <Ligacao pontos={[de, para]} raio={raio} cor={cor} viagens={viagens} />
  const folga = 0.28 / Math.hypot(para[0] - de[0], para[2] - de[2])
  const ponto = (t: number): V3 => [de[0] + (para[0] - de[0]) * t, de[1] + (para[1] - de[1]) * t, de[2] + (para[2] - de[2]) * t]
  const [a, b] = [ponto(corte - folga), ponto(corte + folga)]
  return (
    <>
      <Ligacao pontos={[de, a]} raio={raio} cor={cor} />
      <Ligacao pontos={[b, para]} raio={raio} cor={cor} />
      <Esfera raio={0.13} pos={a} cor="#ff6a3d" emissivo="#ff6a3d" intensidade={1.4} sombra={false} />
      <Esfera raio={0.13} pos={b} cor="#ff6a3d" emissivo="#ff6a3d" intensidade={1.4} sombra={false} />
    </>
  )
}

/** Ângulo em y para o computador em `p` olhar para o centro da cena. */
const paraOCentro = (p: V3) => Math.atan2(-p[0], -p[2])

function Maquina({ pos, apagado, rotulo, giro = 0 }: { pos: V3; apagado?: boolean; rotulo?: string; giro?: number }) {
  return (
    <>
      <Lote pos={pos} tam={[1.9, 1.8]} />
      <Computador pos={[pos[0], 0.12, pos[2]]} rot={[0, giro, 0]} escala={0.62} apagado={apagado} />
      {rotulo && <Rotulo pos={[pos[0], 1.35, pos[2]]} escuro={apagado}>{rotulo}</Rotulo>}
    </>
  )
}

// ---------- Barra ----------

const XS_BARRA = [-4.8, -2.4, 0, 2.4, 4.8]
const Z_BARRA = -1.0

function Barra(cena: CenaProps) {
  const cabo = cena.revelados.includes('cabo')
  const pc = cena.revelados.includes('pc')
  const caiuTudo = cabo
  const rota = (de: number, para: number): V3[] => [
    [XS_BARRA[de], Y + 0.02, 0.1],
    [XS_BARRA[de], Y + 0.02, Z_BARRA],
    [XS_BARRA[para], Y + 0.02, Z_BARRA],
    [XS_BARRA[para], Y + 0.02, 0.1],
  ]
  // um dado por vez no cabo: a resposta só sai depois que o pedido chega
  const tPedido = linhaDoTempo(rota(0, 4), 3.2, 0).total
  const tResposta = linhaDoTempo(rota(4, 1), 3.2, 0).total
  const periodo = tPedido + tResposta + 0.6
  return (
    <>
      <Enlace de={[-6.3, Y, Z_BARRA]} para={[6.3, Y, Z_BARRA]} raio={0.1} cortado={cabo} corte={5.1 / 12.6} />
      {[-6.3, 6.3].map((x) => (
        <Cilindro key={x} raio={0.17} altura={0.3} lados={12} pos={[x, Y, Z_BARRA]} rot={[0, 0, Math.PI / 2]} cor="#2d3540" />
      ))}
      {XS_BARRA.map((x, i) => (
        <group key={i}>
          <Maquina pos={[x, 0, 0.9]} apagado={caiuTudo || (pc && i === 3)} />
          <Ligacao pontos={[[x, Y, 0.2], [x, Y, Z_BARRA]]} raio={0.05} />
        </group>
      ))}
      {!caiuTudo && (
        <>
          <Percurso pontos={rota(0, 4)} velocidade={3.2} periodo={periodo}>
            <group scale={0.7}><Dado cor={PEDIDO} /></group>
          </Percurso>
          <Percurso pontos={rota(4, 1)} velocidade={3.2} periodo={periodo} atraso={tPedido + 0.3}>
            <group scale={0.7}><Dado cor={RESPOSTA} /></group>
          </Percurso>
        </>
      )}
      {/* a tesoura só aparece depois do computador desligado: primeiro o problema no dispositivo, depois no cabo */}
      {pc && <Alvo id="cabo" pos={[-1.2, 0.8, Z_BARRA]} cena={cena} simbolo="✂" />}
      <Alvo id="pc" pos={[XS_BARRA[3], 1.35, 0.9]} cena={cena} simbolo="⏻" />
      {caiuTudo && <Rotulo pos={[0, 2.4, -0.6]} escuro>✖ Cabo rompido: a rede inteira parou</Rotulo>}
      {pc && !caiuTudo && <Rotulo pos={[XS_BARRA[3], 2.1, 0.9]} escuro>Só este computador saiu</Rotulo>}
    </>
  )
}

// ---------- Estrela ----------

const ESTRELA: V3[] = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return [Math.cos(a) * 4.6, 0, Math.sin(a) * 4.2]
})

function Estrela(cena: CenaProps) {
  const cortado = cena.revelados.includes('enlace')
  return (
    <>
      <Switch pos={[0, 0.12, 0]} escala={1.3} portas={5} />
      <Rotulo pos={[0, 1.1, 0]}>Concentrador</Rotulo>
      {ESTRELA.map((p, i) => {
        const caiu = cortado && i === 1
        return (
          <group key={i}>
            <Maquina pos={p} apagado={caiu} giro={paraOCentro(p)} />
            <Enlace
              de={[p[0] * 0.78, Y, p[2] * 0.78]}
              para={[p[0] * 0.14, Y, p[2] * 0.14]}
              cortado={caiu}
              viagens={caiu ? [] : [
                { cor: PEDIDO, duracao: 1.6, pausa: 2.4, atraso: i * 0.8 },
                { cor: RESPOSTA, duracao: 1.6, pausa: 2.4, atraso: 2 + i * 0.8, inverso: true },
              ]}
            />
          </group>
        )
      })}
      <Alvo id="enlace" pos={[ESTRELA[1][0] * 0.46, 0.8, ESTRELA[1][2] * 0.46]} cena={cena} simbolo="✂" />
      {cortado && <Rotulo pos={[ESTRELA[1][0], 1.9, ESTRELA[1][2]]} escuro>Só este ficou sem rede</Rotulo>}
    </>
  )
}

// ---------- Anel ----------

const N_ANEL = 6
const R_ANEL = 3.3
const ANEL: V3[] = Array.from({ length: N_ANEL }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N_ANEL
  return [Math.cos(a) * 4.9, 0, Math.sin(a) * 4.5]
})
// Cada rodada do anel tem três etapas de LEITURA s (uma por texto na tela):
// 1) a origem segura o token e a mensagem vai até o destino; 2) o destino a retirou, o token
// ainda com a origem; 3) o token livre anda de nó em nó até a origem da próxima rodada.
const LEITURA = 4.5
const PERIODO_ANEL = 3 * LEITURA

function Moeda() {
  return <Cilindro raio={0.28} altura={0.08} lados={16} pos={[0, 0.45, 0]} cor="#f2c230" emissivo="#f2b134" intensidade={0.8} sombra={false} />
}

const anguloDoNo = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N_ANEL
const pontoDoAnel = (a: number): V3 => [Math.cos(a) * R_ANEL, Y, Math.sin(a) * R_ANEL * 0.92]
/** Pontos do anel saindo do nó `de` e andando `passos` nós no sentido único. */
const trechoDoAnel = (de: number, passos: number): V3[] =>
  Array.from({ length: passos * 8 + 1 }, (_, i) => pontoDoAnel(anguloDoNo(de) + (i / 8) * (2 * Math.PI / N_ANEL)))
/** Quantos nós separam `de` de `para` no sentido do anel (1 a N_ANEL). */
const passosAte = (de: number, para: number) => ((para - de + N_ANEL - 1) % N_ANEL) + 1

const sortear = (n: number) => Math.floor(Math.random() * n)
type Rodada = { n: number; origem: number; destino: number; proxima: number }
/** Sorteia destino ≠ origem e a próxima origem a 3+ nós (o token livre não fica lento demais). */
function novaRodada(n: number, origem: number): Rodada {
  const destino = (origem + 1 + sortear(N_ANEL - 1)) % N_ANEL
  const proxima = (origem + 3 + sortear(N_ANEL - 2)) % N_ANEL
  return { n, origem, destino, proxima }
}

/** Uma rodada: remontada a cada ciclo (key), então todas as animações começam juntas do zero. */
function RodadaAnel({ rodada, fim }: { rodada: Rodada; fim: () => void }) {
  const { origem, destino, proxima } = rodada
  const k = passosAte(origem, destino)
  // mensagem a ~1,3 nó/s (no máximo LEITURA − 1,5 s); a origem espera o resto da etapa segurando o token
  const viagemMsg = Math.min(LEITURA - 1.5, 1.5 + 0.75 * k)
  const preparo = LEITURA - viagemMsg
  const caminhoMsg = useCurva(trechoDoAnel(origem, k))
  const caminhoToken = useCurva(trechoDoAnel(origem, passosAte(origem, proxima)))
  const inicio = useRef<number | null>(null)
  const acabou = useRef(false)
  useFrame(({ clock }) => {
    if (inicio.current === null) inicio.current = clock.elapsedTime
    if (!acabou.current && clock.elapsedTime - inicio.current >= PERIODO_ANEL) {
      acabou.current = true
      fim()
    }
  })
  return (
    <>
      {/* token parado com a origem enquanto ela transmite */}
      <Janela periodo={PERIODO_ANEL} de={0} ate={2 * LEITURA}>
        <group position={pontoDoAnel(anguloDoNo(origem))}>
          <Moeda />
          <Rotulo pos={[0, 0.95, 0]}>token com a origem</Rotulo>
        </group>
      </Janela>
      {/* token livre indo até a próxima origem */}
      <Viajante curva={caminhoToken} duracao={LEITURA} pausa={2 * LEITURA} atraso={2 * LEITURA}>
        <Moeda />
        <Rotulo pos={[0, 0.95, 0]}>token</Rotulo>
      </Viajante>
      <Viajante curva={caminhoMsg} duracao={viagemMsg} pausa={PERIODO_ANEL - viagemMsg} atraso={preparo}>
        <Dado cor="#ef6f6c" />
      </Viajante>

      <Janela periodo={PERIODO_ANEL} de={0} ate={LEITURA}>
        <Rotulo pos={[0, 1.7, 0]}>A origem tem o token: só ela pode transmitir</Rotulo>
      </Janela>
      <Janela periodo={PERIODO_ANEL} de={LEITURA} ate={2 * LEITURA}>
        <Rotulo pos={[0, 1.7, 0]}>O destino retirou a mensagem do anel</Rotulo>
      </Janela>
      <Janela periodo={PERIODO_ANEL} de={2 * LEITURA} ate={PERIODO_ANEL}>
        <Rotulo pos={[0, 1.7, 0]}>Token liberado: passa de nó em nó até alguém querer transmitir</Rotulo>
      </Janela>
    </>
  )
}

function Anel() {
  // Sentido único: ângulos crescendo. O token é a permissão para transmitir: a origem o segura,
  // manda a mensagem, o destino a retira do anel e só então a origem libera o token. A cada
  // rodada, origem e destino são sorteados.
  const volta = useCurva(Array.from({ length: 49 }, (_, i) => pontoDoAnel(-Math.PI / 2 + (i / 48) * Math.PI * 2)))
  const [rodada, setRodada] = useState(() => novaRodada(0, sortear(N_ANEL)))
  const proximaRodada = useCallback(() => setRodada((r) => novaRodada(r.n + 1, r.proxima)), [])
  const { origem, destino } = rodada
  return (
    <>
      <mesh>
        <tubeGeometry args={[volta, 120, 0.08, 8, true]} />
        <meshStandardMaterial color="#2f5fb0" roughness={0.6} />
      </mesh>
      {ANEL.map((p, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / N_ANEL
        const seta = a + Math.PI / N_ANEL
        const s = pontoDoAnel(seta)
        return (
          <group key={i}>
            <Maquina pos={p} giro={paraOCentro(p)} rotulo={i === origem ? 'origem' : i === destino ? 'destino' : undefined} />
            <Ligacao pontos={[[p[0] * 0.84, Y, p[2] * 0.84], pontoDoAnel(a)]} raio={0.05} />
            {/* seta no anel apontando o sentido único */}
            <Cilindro raio={0} raioBase={0.2} altura={0.45} lados={3} pos={[s[0], 0.3, s[2]]} rot={[0, -(seta + Math.PI / 2), -Math.PI / 2]} cor="#f2b134" sombra={false} />
          </group>
        )
      })}
      <RodadaAnel key={rodada.n} rodada={rodada} fim={proximaRodada} />
      <Rotulo pos={[0, 0.9, 0]} escuro>sentido único ↻</Rotulo>
    </>
  )
}

// ---------- Malha ----------

const MALHA: V3[] = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return [Math.cos(a) * 4.6, 0, Math.sin(a) * 4.2]
})
const PARES: [number, number][] = []
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) PARES.push([i, j])
const noCabo = (i: number): V3 => [MALHA[i][0] * 0.84, Y + 0.02, MALHA[i][2] * 0.84]

function Malha(cena: CenaProps) {
  const cortado = cena.revelados.includes('enlace')
  // Mensagem de 0 para 1: pelo enlace direto ou, se ele for cortado, desviando por 3.
  const rota: V3[] = cortado ? [noCabo(0), noCabo(3), noCabo(1)] : [noCabo(0), noCabo(1)]
  return (
    <>
      {MALHA.map((p, i) => (
        <Maquina key={i} pos={p} giro={paraOCentro(p)} rotulo={i === 0 ? 'origem' : i === 1 ? 'destino' : undefined} />
      ))}
      {PARES.map(([a, b]) => {
        const direto = a === 0 && b === 1
        const desvio = cortado && ((a === 0 && b === 3) || (a === 1 && b === 3))
        return (
          <Enlace key={`${a}-${b}`} de={noCabo(a)} para={noCabo(b)} cortado={direto && cortado} raio={desvio ? 0.09 : 0.06} cor={desvio ? '#e98a2e' : '#2f5fb0'} />
        )
      })}
      <Percurso key={cortado ? 'desvio' : 'direto'} pontos={rota} velocidade={2.6} espera={0.3}>
        <group scale={0.75}><Dado cor={PEDIDO} /></group>
      </Percurso>
      <Alvo id="enlace" pos={[(noCabo(0)[0] + noCabo(1)[0]) / 2, 0.8, (noCabo(0)[2] + noCabo(1)[2]) / 2]} cena={cena} simbolo="✂" />
      {cortado && <Rotulo pos={[noCabo(3)[0], 1.5, noCabo(3)[2] - 0.8]} escuro>Desvio: redundância</Rotulo>}
    </>
  )
}

export function CenaTopologias(cena: CenaProps) {
  const topo = (cena.estado.topo as string | undefined) ?? 'barra'
  return (
    <>
      <Ilha raio={8.2} />
      {topo === 'barra' && <Barra {...cena} />}
      {topo === 'estrela' && <Estrela {...cena} />}
      {topo === 'anel' && <Anel />}
      {topo === 'malha' && <Malha {...cena} />}
      <Arvore pos={[-6.6, 0, 3.6]} escala={0.8} />
      <Arvore pos={[6.8, 0, 3.0]} escala={0.9} />
    </>
  )
}
