import { Line } from '@react-three/drei'
import { Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Computador, Envelope, LivroDeRegras, PlacaDeRede } from '../../../three/modelos'
import { arco, Cabo, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 1.3 — protocolos (Aula 01, p. 4). Dois "andares" de regras entre os computadores:
// em cima, alto nível (entre aplicações); embaixo, baixo nível (entre dispositivos de rede).
// No passo "ambos", a mensagem desce de um andar para o outro, atravessa o cabo e sobe.

const A: V3 = [-3.6, 0.12, 0]
const B: V3 = [3.6, 0.12, 0]

const VIAGEM: V3[] = [
  [-3.6, 1.25, 0.5], [-3.0, 0.7, 0.9], [-2.3, 0.35, 1.2],
  [0, 0.3, 1.9],
  [2.3, 0.35, 1.2], [3.0, 0.7, 0.9], [3.6, 1.25, 0.5],
]

export function CenaProtocolos(cena: CenaProps) {
  const foco = (cena.estado.foco as string | undefined) ?? 'ambos'
  const alto = foco === 'alto' || foco === 'ambos' || foco === 'regras'
  const baixo = foco === 'baixo' || foco === 'ambos' || foco === 'regras'
  const cabo = useCurva([[-2.3, 0.14, 1.1], [0, 0.14, 1.9], [2.3, 0.14, 1.1]])
  const viagem = useCurva(VIAGEM)

  return (
    <>
      <Ilha raio={8} />
      <Lote pos={A} tam={[3.2, 2.6]} />
      <Lote pos={B} tam={[3.2, 2.6]} />
      <Computador pos={A} />
      <Computador pos={B} tela="#8fd9a8" />
      <PlacaDeRede pos={[-2.3, 0.12, 1.1]} rot={[0, -0.6, 0]} escala={0.6} />
      <PlacaDeRede pos={[2.3, 0.12, 1.1]} rot={[0, 0.6, 0]} escala={0.6} />
      <Cabo curva={cabo} cor="#2f5fb0" raio={0.07} />

      {/* andar de cima: alto nível, entre as aplicações */}
      <LivroDeRegras pos={[-3.6, 2.5, 0]} cor="#e2703a" />
      <LivroDeRegras pos={[3.6, 2.5, 0]} cor="#e2703a" />
      <Line
        points={arco([-3.3, 2.55, 0], [3.3, 2.55, 0], 0.5)}
        color="#d06a1e"
        lineWidth={alto ? 4 : 2}
        dashed
        dashSize={0.25}
        gapSize={0.15}
        transparent
        opacity={alto ? 1 : 0.25}
      />
      <Rotulo pos={[0, 3.45, 0]} apagado={!alto}>
        Protocolos de alto nível<small>TCP/IP · NETBIOS · IPX/SPX</small>
      </Rotulo>

      {/* andar de baixo: baixo nível, entre os dispositivos de rede */}
      <LivroDeRegras pos={[-2.3, 1.3, 1.1]} cor="#8a4fbf" escala={0.7} />
      <LivroDeRegras pos={[2.3, 1.3, 1.1]} cor="#8a4fbf" escala={0.7} />
      <Line
        points={arco([-2.05, 1.3, 1.1], [2.05, 1.3, 1.1], 0.3)}
        color="#7a3fb0"
        lineWidth={baixo ? 4 : 2}
        dashed
        dashSize={0.25}
        gapSize={0.15}
        transparent
        opacity={baixo ? 1 : 0.25}
      />
      <Rotulo pos={[0, 1.95, 1.1]} apagado={!baixo}>
        Protocolo de baixo nível<small>ethernet · wifi · bluetooth</small>
      </Rotulo>

      <Viajante curva={viagem} duracao={4.5} pausa={0.8} ativo={cena.estado.viagem === true}>
        <Envelope escala={0.9} pos={[0, 0.1, 0]} />
      </Viajante>

      {foco === 'sor' && (
        <>
          <Rotulo pos={[-3.6, 1.7, 0.6]} escuro>SOR · Windows</Rotulo>
          <Rotulo pos={[3.6, 1.7, 0.6]} escuro>SOR · Linux</Rotulo>
        </>
      )}

      <Arvore pos={[-6.2, 0, -2.4]} />
      <Arvore pos={[6.0, 0, -2.8]} escala={1.1} />
    </>
  )
}
