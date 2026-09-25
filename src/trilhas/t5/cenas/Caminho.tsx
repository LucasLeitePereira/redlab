import { Line } from '@react-three/drei'
import { Alvo, Arvore, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Roteador, Servidor } from '../../../three/modelos'
import { arco, cantosSuaves, Janela, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { PilhaOsi, type IdCamada } from './comum'

// Fase 5.5 — transporte e rede; comunicação fim a fim × ponto a ponto (Aula 05 p1, p. 7–8).
// A figura "Comunicação entre hosts" do slide: host cliente, roteadores (amarelos nas pontas,
// laranja no meio) e host servidor. Fim a fim = a linha laranja por baixo, de host a host;
// ponto a ponto = um arco em cada trecho do caminho.

const AMARELO = '#e8c547'
const LARANJA = '#d9772b'
const COR_LINHA = '#e8531f'

const N = {
  cliente: [-6.3, 0.12, 0] as V3,
  y1: [-4.4, 0.12, 0] as V3,
  o1: [-2.4, 0.12, 0.3] as V3,
  o2: [0, 0.12, -1.7] as V3,
  o3: [-1.1, 0.12, 2.0] as V3,
  o4: [1.4, 0.12, 2.0] as V3,
  o5: [2.5, 0.12, 0] as V3,
  y2: [4.4, 0.12, 0] as V3,
  servidor: [6.3, 0.12, 0] as V3,
}
type No = keyof typeof N
const LIGACOES: [No, No][] = [
  ['cliente', 'y1'],
  ['y1', 'o1'],
  ['o1', 'o2'],
  ['o1', 'o3'],
  ['o3', 'o4'],
  ['o4', 'o5'],
  ['o2', 'o5'],
  ['o5', 'y2'],
  ['y2', 'servidor'],
]
/** O caminho da figura do slide (por cima). */
const CAMINHO: No[] = ['cliente', 'y1', 'o1', 'o2', 'o5', 'y2', 'servidor']
const alto = (p: V3, h = 0.45): V3 => [p[0], h, p[2]]

/** A linha laranja da comunicação fim a fim: sai do cliente, passa por baixo e entra no servidor. */
const FIM_A_FIM = cantosSuaves([[-6.3, 0.3, 0.9], [-6.3, 0.3, 3.7], [6.3, 0.3, 3.7], [6.3, 0.3, 0.9]], 0.8)
const METADE = cantosSuaves([[-6.3, 0.3, 0.9], [-6.3, 0.3, 3.7], [0, 0.3, 3.7]], 0.8)

function Segmento({ numero, pontos, atraso, periodo, cor = '#3e6480' }: { numero: string; pontos: V3[]; atraso: number; periodo: number; cor?: string }) {
  return (
    <Percurso pontos={pontos} velocidade={5} atraso={atraso} periodo={periodo}>
      <group scale={0.7}>
        <Dado tipo="mensagem" cor={cor} sombra={false} />
      </group>
      <Rotulo pos={[0, 0.85, 0]} classe="bits">
        {numero}
      </Rotulo>
    </Percurso>
  )
}

/** Transporte: a mensagem vai em segmentos; o 2 se perde, falta no destino e é enviado de novo. */
function Segmentos() {
  const periodo = 12.5
  return (
    <>
      <Segmento numero="1" pontos={FIM_A_FIM} atraso={0} periodo={periodo} />
      <Segmento numero="2" pontos={METADE} atraso={0.9} periodo={periodo} />
      <Segmento numero="3" pontos={FIM_A_FIM} atraso={1.8} periodo={periodo} />
      <Janela periodo={periodo} de={2.8} ate={4.6}>
        <Rotulo pos={[0, 0.9, 3.7]} classe="emoji">
          ✗
        </Rotulo>
      </Janela>
      <Janela periodo={periodo} de={5.6} ate={6.8}>
        <Rotulo pos={[4.7, 2.5, 0]} escuro>
          chegaram 1 e 3 · falta o 2
        </Rotulo>
      </Janela>
      <Janela periodo={periodo} de={6.4} ate={8}>
        <Rotulo pos={[-6.3, 2.45, 0]} escuro>
          envia o 2 de novo
        </Rotulo>
      </Janela>
      <Segmento numero="2" pontos={FIM_A_FIM} atraso={6.6} periodo={periodo} cor="#23915f" />
      <Janela periodo={periodo} de={10.4} ate={periodo}>
        <Rotulo pos={[4.7, 2.5, 0]} escuro>
          ✓ 1 2 3: mensagem completa
        </Rotulo>
      </Janela>
    </>
  )
}

export function CenaCaminho(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'fimafim'
  const semNomes = !!cena.estado.semNomes
  const fim = modo === 'fimafim' || modo === 'segmentos' || modo === 'comparar'
  const ponto = modo === 'rede' || modo === 'comparar'
  const foco: IdCamada[] = modo === 'rede' ? ['rede'] : modo === 'comparar' ? ['transporte', 'rede'] : ['transporte']

  return (
    <>
      <Ilha raio={9} />
      {LIGACOES.map(([a, b]) => (
        <Ligacao key={a + b} pontos={[alto(N[a], 0.14), alto(N[b], 0.14)]} cor="#3b6fb5" raio={0.04} />
      ))}
      {(['y1', 'y2'] as No[]).map((k) => (
        <Roteador key={k} pos={N[k]} cor={AMARELO} escala={0.8} />
      ))}
      {(['o1', 'o2', 'o3', 'o4', 'o5'] as No[]).map((k) => (
        <Roteador key={k} pos={N[k]} cor={LARANJA} escala={0.8} />
      ))}
      <Computador pos={N.cliente} rot={[0, 0.5, 0]} escala={0.7} />
      <Servidor pos={N.servidor} rot={[0, -0.5, 0]} escala={0.85} />
      <Rotulo pos={[N.cliente[0], 1.55, 0]}>
        Host<small>(cliente)</small>
      </Rotulo>
      <Rotulo pos={[N.servidor[0], 2.0, 0]}>
        Host<small>(servidor)</small>
      </Rotulo>
      <Rotulo pos={[0, 0.9, -2.9]} classe="bits">
        Roteadores
      </Rotulo>

      {fim && (
        <>
          <Line points={FIM_A_FIM} color={COR_LINHA} lineWidth={4} />
          {!semNomes && (
            <Rotulo pos={[0, 0.35, 4.3]} escuro>
              Comunicação fim a fim
            </Rotulo>
          )}
        </>
      )}
      {modo === 'fimafim' && (
        <Percurso pontos={FIM_A_FIM} velocidade={4.5} periodo={5.5}>
          <group scale={0.75}>
            <Dado tipo="mensagem" sombra={false} />
          </group>
        </Percurso>
      )}
      {modo === 'segmentos' && <Segmentos />}

      {ponto && (
        <>
          {CAMINHO.slice(1).map((b, i) => (
            <Line key={b} points={arco(alto(N[CAMINHO[i]], 0.7), alto(N[b], 0.7), 0.8)} color={COR_LINHA} lineWidth={3} />
          ))}
          <Percurso pontos={CAMINHO.map((k) => alto(N[k], 0.55))} velocidade={3} espera={0.5}>
            <group scale={0.7}>
              <Dado tipo="mensagem" cor="#9a4418" sombra={false} />
            </group>
            {modo === 'rede' && (
              <Rotulo pos={[0, 0.9, 0]} classe="bits">
                IP do servidor
              </Rotulo>
            )}
          </Percurso>
          {!semNomes && (
            <Rotulo pos={[0, 2.3, -1.7]} escuro>
              Comunicação ponto a ponto
            </Rotulo>
          )}
        </>
      )}

      <PilhaOsi foco={foco} />
      <Alvo id="fim" pos={[-3.5, 0.9, 3.7]} cena={cena} />
      <Alvo id="ponto" pos={[-1.35, 1.6, -0.7]} cena={cena} />

      <Arvore pos={[-5.6, 0, -4.8]} escala={0.9} />
      <Arvore pos={[5.4, 0, -5.0]} />
      <Arvore pos={[4.6, 0, 4.6]} escala={0.8} />
    </>
  )
}
