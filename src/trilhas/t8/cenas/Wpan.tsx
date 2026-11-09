import { Line } from '@react-three/drei'
import { Caixa, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Celular, Computador, EstacaoBase, Impressora, Notebook } from '../../../three/modelos'
import { arco, Ondas, Pulsos, useCurva } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Elipse, Tabela3D, linha, type Col } from './comum'

// Fase 8.7 — IEEE 802.15 (WPAN) e 802.16 (WiMax) (Aula 07 p. 13–14).
// 'wpan': dispositivos pessoais ligados por sinais curtos, dentro de elipses tracejadas (figura p. 13);
// 'tabela': as sub-normas do 802.15; 'wimax': torre levando banda larga sem fio a 3 casas (p. 14).

const BT = '#2f7fd0'

function Fone({ pos }: { pos: V3 }) {
  return (
    <group position={pos}>
      {[-0.28, 0.28].map((x) => (
        <Cilindro key={x} raio={0.17} altura={0.12} pos={[x, 0.45, 0]} rot={[0, 0, Math.PI / 2]} cor="#2d3540" />
      ))}
      <Caixa tam={[0.6, 0.06, 0.06]} pos={[0, 0.78, 0]} cor="#4a5a6a" />
      <Caixa tam={[0.06, 0.34, 0.06]} pos={[-0.28, 0.62, 0]} cor="#4a5a6a" />
      <Caixa tam={[0.06, 0.34, 0.06]} pos={[0.28, 0.62, 0]} cor="#4a5a6a" />
    </group>
  )
}

function Mouse({ pos }: { pos: V3 }) {
  return (
    <group position={pos}>
      <Caixa tam={[0.32, 0.14, 0.5]} pos={[0, 0.07, 0]} cor="#e3e8ee" />
      <Caixa tam={[0.02, 0.02, 0.2]} pos={[0, 0.15, -0.1]} cor="#8e99a6" sombra={false} />
    </group>
  )
}

function Sinal({ de, para }: { de: V3; para: V3 }) {
  const curva = useCurva(arco(de, para, 0.35))
  return <Pulsos curva={curva} cor={BT} quantidade={2} duracao={1.8} tamanho={0.07} />
}

function Wpan() {
  const cel: V3 = [-3.0, 0.12, -0.5]
  const fone: V3 = [-5.0, 0.12, 0.5]
  const lapA: V3 = [-2.6, 0.12, 1.9]
  const lapB: V3 = [3.0, 0.12, -0.3]
  const mouse: V3 = [4.8, 0.12, 1.6]
  const imp: V3 = [2.1, 0.12, 2.0]
  const alto = (p: V3): V3 => [p[0], 0.8, p[2]]
  return (
    <>
      <Elipse pos={[-3.3, 0, 0.7]} rx={2.8} rz={2.6} />
      <Elipse pos={[3.3, 0, 0.7]} rx={2.8} rz={2.6} />
      <Rotulo pos={[-3.3, 0.1, -2.2]} classe="mini">
        WPAN
      </Rotulo>
      <Rotulo pos={[3.3, 0.1, -2.2]} classe="mini">
        WPAN
      </Rotulo>

      <Fone pos={fone} />
      <Celular pos={cel} escala={1.1} />
      <Notebook pos={lapA} escala={0.8} />
      <Notebook pos={lapB} escala={0.8} />
      <Mouse pos={mouse} />
      <Impressora pos={imp} escala={0.8} />

      <Rotulo pos={[fone[0], 1.2, fone[2]]} classe="mini">Headset</Rotulo>
      <Rotulo pos={[cel[0], 1.25, cel[2]]} classe="mini">Mobile phone</Rotulo>
      <Rotulo pos={[lapA[0], 1.1, lapA[2]]} classe="mini">Laptop</Rotulo>
      <Rotulo pos={[lapB[0], 1.1, lapB[2]]} classe="mini">Laptop</Rotulo>
      <Rotulo pos={[mouse[0], 0.5, mouse[2]]} classe="mini">Mouse</Rotulo>
      <Rotulo pos={[imp[0], 1.1, imp[2]]} classe="mini">Printer</Rotulo>

      <Sinal de={alto(cel)} para={alto(fone)} />
      <Sinal de={alto(cel)} para={alto(lapA)} />
      <Sinal de={alto(lapB)} para={alto(mouse)} />
      <Sinal de={alto(lapB)} para={alto(imp)} />
      <Ondas pos={[cel[0], 0.8, cel[2]]} cor={BT} raio={1.3} periodo={2} quantidade={2} />
      <Ondas pos={[lapB[0], 0.8, lapB[2]]} cor={BT} raio={1.3} periodo={2} quantidade={2} />
    </>
  )
}

const TABELA: [string, string][] = [
  ['802.15.1', 'WPAN (Bluetooth)'],
  ['802.15.3', 'Highrate WPAN (UWB, Wireless USB)'],
  ['802.15.4', 'Lowrate WPAN (ZigBee)'],
  ['802.15.6', 'BAN (Body Area Network)'],
]

function Casa({ pos, k }: { pos: V3; k: number }) {
  const topo: V3 = [0, 3.7, -1.3]
  const telhado: V3 = [pos[0], 1.9, pos[2]]
  const curva = useCurva(arco(topo, telhado, 0))
  return (
    <group>
      <Caixa tam={[1.7, 1.0, 1.4]} pos={[pos[0], 0.62, pos[2]]} cor="#f3e3c3" />
      <Cilindro raio={0} raioBase={1.25} altura={0.7} lados={4} pos={[pos[0], 1.45, pos[2]]} rot={[0, Math.PI / 4, 0]} cor="#c0553b" />
      <Computador pos={[pos[0], 0.12, pos[2] + 1.35]} escala={0.4} />
      <Line points={[topo, telhado]} color="#4a5a6a" lineWidth={2} dashed dashSize={0.25} gapSize={0.16} />
      <Pulsos curva={curva} cor={BT} quantidade={2} duracao={2 + k * 0.2} tamanho={0.08} />
    </group>
  )
}

function Wimax() {
  const casas: V3[] = [[-4.4, 0, 1.4], [0, 0, 3.3], [4.4, 0, 1.4]]
  return (
    <>
      <EstacaoBase pos={[0, 0.12, -1.3]} escala={1.15} />
      <Ondas pos={[0, 3.7, -1.3]} cor="#3aa0e6" raio={5} periodo={3} quantidade={3} />
      <Rotulo pos={[0, 4.5, -1.3]} escuro>
        Torre
      </Rotulo>
      {casas.map((p, k) => (
        <Casa key={k} pos={p} k={k} />
      ))}
    </>
  )
}

export function CenaWpan(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'wpan'
  const colunas: Col[] = [
    { id: 'norma', titulo: 'Norma' },
    { id: 'carac', titulo: 'Características', esconder: !!cena.estado.semNomes },
  ]
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'wpan' && <Wpan />}
      {modo === 'tabela' && (
        <Tabela3D pos={[0.5, 2.4, 0]} largura={500} colunas={colunas} linhas={TABELA.map((l) => linha(colunas, l))} fonte={15} titulo="IEEE 802.15" />
      )}
      {modo === 'wimax' && <Wimax />}
    </>
  )
}
