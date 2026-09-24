import { Line } from '@react-three/drei'
import { Alvo, Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Envelope, LivroDeRegras, PlacaDeRede } from '../../../three/modelos'
import { arco } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 1.1 — os 6 componentes básicos, montados como no desenho do slide (Aula 01, p. 3–4):
// dois computadores, placas de rede, o cabo entre eles, a mensagem indo e voltando,
// os livros de regras (protocolo) e o sistema operacional de rede em cada um.

const A: V3 = [-3.6, 0.12, 0]
const B: V3 = [3.0, 0.12, 0]
const CABO: V3[] = [[-2.45, 0.14, 0.35], [-1.4, 0.14, 1.6], [0.7, 0.14, 2.0], [2.9, 0.14, 1.5], [3.95, 0.14, 0.35]]

const ROTULOS: Record<string, { pos: V3; texto: string }> = {
  computador: { pos: [-3.6, 2.05, 0.1], texto: 'Computador' },
  sor: { pos: [-3.6, 0.45, 0.6], texto: 'SOR' },
  dispositivo: { pos: [-2.2, 1.25, 0.9], texto: 'Dispositivo (placa de rede)' },
  meio: { pos: [0.7, 1.0, 2.1], texto: 'Meio de transmissão' },
  mensagem: { pos: [-0.6, 2.5, 1.2], texto: 'Mensagem' },
  protocolo: { pos: [-0.3, 3.95, 0], texto: 'Protocolo (regras)' },
}

export function CenaComponentes(cena: CenaProps) {
  const todos = cena.estado.rotulos === true
  const visivel = (id: string) => todos || cena.revelados.includes(id)

  return (
    <>
      <Ilha raio={8} />
      <Lote pos={A} tam={[3.2, 2.6]} />
      <Lote pos={B} tam={[3.2, 2.6]} />
      <Computador pos={A} />
      <Computador pos={B} tela="#8fd9a8" />
      <PlacaDeRede pos={[-2.2, 0.12, 0.9]} rot={[0, -0.5, 0]} escala={0.6} />
      <PlacaDeRede pos={[3.7, 0.12, 1.0]} rot={[0, 0.5, 0]} escala={0.6} />

      <Ligacao
        pontos={CABO}
        cor="#2f5fb0"
        raio={0.07}
        viagens={[
          { cor: '#ef6f6c', duracao: 3.4 },
          { cor: '#3aa0e6', duracao: 3.4, atraso: 1.9, inverso: true },
        ]}
      />

      <Envelope pos={[-0.6, 1.6, 1.2]} escala={1.4} />

      <LivroDeRegras pos={[-3.6, 2.6, 0]} />
      <LivroDeRegras pos={[3.0, 2.6, 0]} />
      <Line points={arco([-3.3, 2.7, 0], [2.7, 2.7, 0], 0.8)} color="#d06a1e" lineWidth={3} dashed dashSize={0.25} gapSize={0.15} />

      <Arvore pos={[-6, 0, -3]} />
      <Arvore pos={[5.8, 0, -2.6]} escala={1.2} />
      <Arvore pos={[-5.4, 0, 3.4]} escala={0.8} />
      <Arvore pos={[6.2, 0, 2.6]} escala={0.9} />

      <Alvo id="computador" pos={[-3.6, 1.55, 0.1]} cena={cena} />
      <Alvo id="sor" pos={[-3.6, 0.9, 0.4]} cena={cena} />
      <Alvo id="dispositivo" pos={[-2.2, 0.75, 0.9]} cena={cena} />
      <Alvo id="meio" pos={[0.7, 0.55, 2.0]} cena={cena} />
      <Alvo id="mensagem" pos={[-0.6, 2.05, 1.2]} cena={cena} />
      <Alvo id="protocolo" pos={[-0.3, 3.45, 0]} cena={cena} />

      {Object.entries(ROTULOS).map(([id, r]) =>
        visivel(id) ? <Rotulo key={id} pos={r.pos} escuro={id === 'sor'}>{r.texto}</Rotulo> : null,
      )}
      {!cena.alvos.length && !todos && (
        <>
          <Rotulo pos={[-3.6, 2.05, 0.1]}>Computador A</Rotulo>
          <Rotulo pos={[3.0, 2.05, 0.1]}>Computador B</Rotulo>
        </>
      )}
    </>
  )
}
