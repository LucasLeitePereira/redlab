import { Alvo, Arvore, Caixa, Cilindro, Esfera, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { LivroDeRegras } from '../../../three/modelos'
import { cantosSuaves, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { LinhaDePares } from './comum'

// Fase 5.1 — exemplo conceitual filósofo–tradutor–secretária (Aula 05 p1, p. 2).
// Dois prédios de 3 andares, um por filósofo, como a figura do slide: filósofo em cima
// (camada 3), tradutor no meio (camada 2) e secretária embaixo (camada 1), com o fax.
// Os papéis ao lado de cada um são os da figura; os modos revelam um andar por vez.

const XL = -3.4
const XR = 3.4
/** Altura do piso de cada andar: camada 1, 2 e 3. */
const ANDAR = [0.12, 1.72, 3.32]
const ALTURA = 4.9

function Predio({ x }: { x: number }) {
  return (
    <group>
      <Lote pos={[x, 0, 0]} tam={[2.8, 2.2]} />
      <Caixa tam={[2.6, ALTURA, 0.12]} pos={[x, ALTURA / 2, -0.95]} cor="#f3efe6" />
      {ANDAR.slice(1).map((y) => (
        <Caixa key={y} tam={[2.6, 0.14, 1.9]} pos={[x, y - 0.07, 0]} cor="#d8cfbf" />
      ))}
      <Caixa tam={[2.6, 0.14, 1.9]} pos={[x, ALTURA + 0.07, 0]} cor="#b9ad98" />
      {[-1.25, 1.25].map((dx) => (
        <Cilindro key={dx} raio={0.06} altura={ALTURA} pos={[x + dx, ALTURA / 2, 0.88]} cor="#b9ad98" />
      ))}
    </group>
  )
}

function Pessoa({ pos, roupa, cabelo, barba = false }: { pos: V3; roupa: string; cabelo: string; barba?: boolean }) {
  return (
    <group position={pos}>
      <Cilindro raio={0.19} raioBase={0.3} altura={0.8} lados={10} pos={[0, 0.4, 0]} cor={roupa} />
      <Esfera raio={0.19} pos={[0, 1.0, 0]} cor="#f1c9a5" />
      <Esfera raio={0.19} pos={[0, 1.07, -0.05]} cor={cabelo} />
      {barba && <Cilindro raio={0.12} raioBase={0} altura={0.26} lados={8} pos={[0, 0.84, 0.1]} cor="#e8e4dc" />}
    </group>
  )
}

function Moveis({ x, lado }: { x: number; lado: 1 | -1 }) {
  const [y1, y2, y3] = ANDAR
  return (
    <>
      {/* camada 3: o filósofo */}
      <Pessoa pos={[x, y3, 0]} roupa="#8d6e63" cabelo="#d9d4cc" barba />
      {/* camada 2: o tradutor, com o dicionário */}
      <Pessoa pos={[x, y2, 0]} roupa="#37474f" cabelo="#3b2a20" />
      <LivroDeRegras pos={[x + 0.5 * lado, y2 + 0.75, 0.25]} escala={0.5} cor="#2f5f9e" />
      {/* camada 1: a secretária, com o fax */}
      <Pessoa pos={[x, y1, -0.1]} roupa="#b0487a" cabelo="#6b3b1e" />
      <Caixa tam={[1.2, 0.5, 0.55]} pos={[x, y1 + 0.25, 0.5]} cor="#a67c52" />
      <Caixa tam={[0.42, 0.16, 0.32]} pos={[x + 0.3 * lado, y1 + 0.58, 0.5]} cor="#e3e6ea" />
      <Caixa tam={[0.24, 0.02, 0.2]} pos={[x + 0.3 * lado, y1 + 0.67, 0.44]} cor="#ffffff" />
    </>
  )
}

/** Os papéis da figura do slide, ao lado de quem os escreveu. */
function Papel({ pos, texto, legenda }: { pos: V3; texto: string; legenda: string }) {
  return (
    <Rotulo pos={pos} classe="papel">
      {texto}
      <small>{legenda}</small>
    </Rotulo>
  )
}

const VIAGEM: V3[] = [
  [XL + 0.55, ANDAR[2] + 1.0, 0.55],
  [XL + 0.55, ANDAR[1] + 1.0, 0.55],
  [XL + 0.55, ANDAR[0] + 0.95, 0.8],
  [XL + 0.6, 0.3, 1.45],
  [XR - 0.6, 0.3, 1.45],
  [XR - 0.55, ANDAR[0] + 0.95, 0.8],
  [XR - 0.55, ANDAR[1] + 1.0, 0.55],
  [XR - 0.55, ANDAR[2] + 1.0, 0.55],
]

const FAX = cantosSuaves([[XL + 0.6, 0.14, 0.8], [XL + 0.6, 0.14, 1.45], [XR - 0.6, 0.14, 1.45], [XR - 0.6, 0.14, 0.8]], 0.4)

export function CenaFilosofos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'filosofos'
  const etapa = ['filosofos', 'tradutores', 'secretarias', 'viagem'].indexOf(modo)
  const semCamadas = !!cena.estado.semCamadas
  const [y1, y2, y3] = ANDAR
  const fora = 2.35

  return (
    <>
      <Ilha raio={8.4} />
      <Predio x={XL} />
      <Predio x={XR} />
      <Moveis x={XL} lado={1} />
      <Moveis x={XR} lado={-1} />
      <Ligacao pontos={FAX} cor="#2f5fa0" raio={0.05} />

      <Papel pos={[XL - fora, y3 + 0.9, 0.3]} texto="I like rabbits" legenda="inglês" />
      <Papel pos={[XR + fora, y3 + 0.9, 0.3]} texto="J'aime bien les lapins" legenda="francês" />
      {etapa >= 1 && (
        <>
          <Papel pos={[XL - fora, y2 + 0.9, 0.3]} texto={'L: Dutch\nIk vind konijnen leuk'} legenda="holandês · para o outro tradutor" />
          <Papel pos={[XR + fora, y2 + 0.9, 0.3]} texto={'L: Dutch\nIk vind konijnen leuk'} legenda="holandês" />
        </>
      )}
      {etapa >= 2 && (
        <>
          <Papel pos={[XL - fora, y1 + 1.1, 0.3]} texto={'Fax #—\nL: Dutch\nIk vind konijnen leuk'} legenda="para a outra secretária" />
          <Papel pos={[XR + fora, y1 + 1.1, 0.3]} texto={'Fax #—\nL: Dutch\nIk vind konijnen leuk'} legenda="chegou pelo fax" />
          <Rotulo pos={[0, 0.5, 1.45]} escuro>
            fax
          </Rotulo>
        </>
      )}
      {etapa === 0 && (
        <Rotulo pos={[0, y3 + 0.45, 0]} classe="grande">
          🤷 não se entendem
        </Rotulo>
      )}

      {!semCamadas &&
        ANDAR.map((y, i) => (
          <Rotulo key={i} pos={[0, y + 1.35, 0]} escuro apagado={etapa < 2 - i}>
            Camada {i + 1}
          </Rotulo>
        ))}

      {etapa === 3 && (
        <>
          {ANDAR.map((y, i) => (
            <LinhaDePares key={i} de={[XL + 1.4, y + 0.9, 0]} para={[XR - 1.4, y + 0.9, 0]} cor="#7a8796" />
          ))}
          <Percurso pontos={VIAGEM} velocidade={2.2} espera={0.55}>
            <group scale={0.75}>
              <Dado tipo="documento" cor="#2f6fb0" sombra={false} />
            </group>
          </Percurso>
        </>
      )}

      <Alvo id="filosofo" pos={[XL, y3 + 1.55, 0.3]} cena={cena} />
      <Alvo id="tradutor" pos={[XL, y2 + 1.4, 0.3]} cena={cena} />
      <Alvo id="secretaria" pos={[XL, y1 + 1.35, 0.3]} cena={cena} />

      <Arvore pos={[-6.4, 0, -2.6]} escala={0.9} />
      <Arvore pos={[6.3, 0, -2.9]} />
    </>
  )
}
