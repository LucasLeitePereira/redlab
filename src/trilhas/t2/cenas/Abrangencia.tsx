import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type RefObject } from 'react'
import { Quaternion, Vector3, type Group } from 'three'
import { Arvore, Caixa, Cilindro, Esfera, Fixo, Ilha, Rotulo, useAtualizarSombras, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import {
  Celular,
  Computador,
  Envelope,
  Impressora,
  Notebook,
  PontoDeAcesso,
  Roteador,
  Servidor,
  Switch,
} from '../../../three/modelos'
import { arco, Ondas, useCurva, Viajante } from '../../../three/movimento'
import { esferaUnitaria, material } from '../../../three/recursos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.1 — abrangência (Aula 02, p. 2–5). "Potências de dez": cada nível da tabela do
// slide (mesa → planeta) é uma maquete, e o nível anterior fica encaixado dentro do
// seguinte, R vezes menor. Afastar a câmera = passar de uma maquete para a de fora.

const R = 7
const CHAO = '#a9d18e'
const TERRA = '#e6dcc0'
const MAR = '#7cc0e3'
const ASFALTO = '#aab3ba'

type NivelProps = { semFio?: string }

type Nivel = {
  medida: string
  lugar: string
  classe: string
  /** Cor da faixa na tabela do slide. */
  cor: string
  /** Onde o nível anterior fica encaixado dentro deste (coordenadas deste nível). */
  encaixe?: V3
  Conteudo: ComponentType<NivelProps>
}

/** Número pseudoaleatório fixo (a cidade é sempre igual). */
const sorte = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453
  return x - Math.floor(x)
}

function Predio({ pos, tam, cor = '#d9dee4', janela = '#6f9fcc' }: { pos: V3; tam: V3; cor?: string; janela?: string }) {
  const [l, a, p] = tam
  const andares = Math.max(1, Math.round(a / 0.38))
  const h = a / andares
  return (
    <group position={pos}>
      <Caixa tam={tam} pos={[0, a / 2, 0]} cor={cor} />
      {Array.from({ length: andares }, (_, i) => (
        <group key={i}>
          <Caixa tam={[l * 0.8, h * 0.4, 0.02]} pos={[0, (i + 0.55) * h, p / 2 + 0.01]} cor={janela} sombra={false} />
          <Caixa tam={[0.02, h * 0.4, p * 0.8]} pos={[l / 2 + 0.01, (i + 0.55) * h, 0]} cor={janela} sombra={false} />
        </group>
      ))}
    </group>
  )
}

/** Faixa plana no chão entre dois pontos (calçada, rua, trilha). */
function Faixa({ de, para, largura, cor, y = 0.015 }: { de: [number, number]; para: [number, number]; largura: number; cor: string; y?: number }) {
  const dx = para[0] - de[0]
  const dz = para[1] - de[1]
  return (
    <Caixa
      tam={[Math.hypot(dx, dz), 0.03, largura]}
      pos={[(de[0] + para[0]) / 2, y, (de[1] + para[1]) / 2]}
      rot={[0, -Math.atan2(dz, dx), 0]}
      cor={cor}
      sombra={false}
    />
  )
}

/** Mancha de terra num mapa: polígono baixo (cada um numa altura para não piscar). */
function Terra({ x, z, raio, lados = 7, giro = 0, topo, cor }: { x: number; z: number; raio: number; lados?: number; giro?: number; topo: number; cor: string }) {
  return <Cilindro raio={raio} altura={topo} lados={lados} pos={[x, topo / 2, z]} rot={[0, giro, 0]} cor={cor} sombra={false} />
}

// ---------- 1 metro · Mesa ----------

function Mesa({ semFio }: NivelProps) {
  const bt = semFio === 'wpan'
  return (
    <>
      <Ilha raio={8} cor="#e3cfa8" />
      <Caixa tam={[8.6, 0.04, 5.2]} pos={[0, 0.02, 0.6]} cor="#8fa9cf" sombra={false} />
      <Caixa tam={[6.4, 0.22, 2.8]} pos={[0, 2.2, -0.9]} cor="#b07a4f" />
      {[[-3, -2.1], [3, -2.1], [-3, 0.3], [3, 0.3]].map(([x, z], i) => (
        <Caixa key={i} tam={[0.22, 2.1, 0.22]} pos={[x, 1.05, z]} cor="#8a5a3b" />
      ))}
      <Computador pos={[-0.8, 2.31, -1.5]} escala={1.5} />
      <Caixa tam={[0.22, 0.09, 0.34]} pos={[1.2, 2.36, -0.4]} cor="#e3e8ee" />
      <Impressora pos={[2.3, 2.31, -1.2]} escala={1.1} />
      <Celular pos={[-2.6, 2.31, -1.0]} rot={[0, 0.4, 0]} escala={1.2} />
      {/* cadeira */}
      <Caixa tam={[1.5, 0.16, 1.4]} pos={[-0.6, 1.35, 1.3]} cor="#3f5f8f" />
      <Caixa tam={[1.5, 1.3, 0.16]} pos={[-0.6, 2.05, 2.0]} cor="#3f5f8f" />
      <Cilindro raio={0.08} altura={1.25} pos={[-0.6, 0.66, 1.3]} cor="#5b6470" />
      <Cilindro raio={0.6} altura={0.08} pos={[-0.6, 0.06, 1.3]} cor="#5b6470" />
      {/* vaso */}
      <Cilindro raio={0.42} raioBase={0.3} altura={0.7} pos={[4.9, 0.35, -2.6]} cor="#c96f4a" />
      <Esfera raio={0.7} pos={[4.9, 1.2, -2.6]} cor="#5fae63" />
      <Esfera raio={0.5} pos={[5.2, 1.75, -2.4]} cor="#4f9a57" />

      <Ondas pos={[0.63, 2.9, -1.6]} cor="#3d6bff" raio={2.6} periodo={1.8} ativo={bt} />
      {bt && (
        <>
          <Rotulo pos={[-0.8, 3.1, -0.2]}>Teclado sem fio</Rotulo>
          <Rotulo pos={[1.6, 2.8, 0.1]}>Mouse</Rotulo>
          <Rotulo pos={[2.6, 3.4, -1.2]}>Impressora</Rotulo>
          <Rotulo pos={[3.4, 4.0, -1.6]} escuro>WPAN · Bluetooth</Rotulo>
        </>
      )}
    </>
  )
}

// ---------- 70 metros · Casa ----------

function Casa() {
  const parede = '#f5f0e6'
  return (
    <>
      <Ilha raio={8} cor={CHAO} />
      <Caixa tam={[10, 0.14, 7.2]} pos={[0.4, 0.07, -0.4]} cor="#eadfc9" sombra={false} />
      <Caixa tam={[10, 1, 0.16]} pos={[0.4, 0.64, -4.0]} cor={parede} />
      <Caixa tam={[0.16, 1, 7.2]} pos={[-4.6, 0.64, -0.4]} cor={parede} />
      <Caixa tam={[0.16, 1, 7.2]} pos={[5.4, 0.64, -0.4]} cor={parede} />
      <Caixa tam={[10, 0.3, 0.16]} pos={[0.4, 0.29, 3.2]} cor={parede} />
      <Caixa tam={[0.16, 1, 4]} pos={[-0.4, 0.64, -2.0]} cor={parede} />
      <Caixa tam={[3, 1, 0.16]} pos={[-3.1, 0.64, 0]} cor={parede} />
      {/* sala: sofá, TV e o roteador */}
      <Caixa tam={[2.4, 0.4, 0.9]} pos={[2.6, 0.34, 1.6]} cor="#d9774e" />
      <Caixa tam={[2.4, 0.6, 0.25]} pos={[2.6, 0.6, 2.05]} cor="#c7653e" />
      <Caixa tam={[2, 0.5, 0.5]} pos={[2.6, 0.39, -3.4]} cor="#8a5a3b" />
      <Caixa tam={[2.2, 1.2, 0.08]} pos={[2.6, 1.25, -3.55]} cor="#23272e" />
      <Caixa tam={[2, 1.05, 0.02]} pos={[2.6, 1.25, -3.5]} cor="#5fb2f5" emissivo="#5fb2f5" intensidade={0.5} sombra={false} />
      <PontoDeAcesso pos={[4.6, 0.14, -3.3]} />
      <Notebook pos={[1.2, 0.54, 0.5]} rot={[0, 0.5, 0]} escala={0.7} />
      <Caixa tam={[1.2, 0.4, 0.8]} pos={[1.2, 0.34, 0.6]} cor="#b07a4f" />
      {/* quarto */}
      <Caixa tam={[1.8, 0.4, 2.4]} pos={[-2.8, 0.34, 1.6]} cor="#f0f0f0" />
      <Caixa tam={[1.84, 0.1, 1.6]} pos={[-2.8, 0.59, 2.0]} cor="#6d9bd1" />
      <Caixa tam={[1.2, 0.15, 0.4]} pos={[-2.8, 0.62, 0.65]} cor="#ffffff" />
      {/* jardim */}
      <Faixa de={[1.4, 3.3]} para={[2.2, 7.2]} largura={0.9} cor="#d9cfbb" />
      <Arvore pos={[-6, 0, -3.6]} />
      <Arvore pos={[6.6, 0, 2.6]} escala={1.1} />
      <Arvore pos={[-5.6, 0, 4.2]} escala={0.9} />
      <Arvore pos={[-1.6, 0, 5.6]} escala={0.8} />
    </>
  )
}

// ---------- 100 metros · Edifício ----------

const MESAS: V3[] = [[-2.1, 0, -1.1], [-0.6, 0, -1.1], [0.9, 0, -1.1], [-0.6, 0, 0.9], [0.9, 0, 0.9]]
const SWITCH_ESCRITORIO: V3 = [2.4, 0, 0.9]

function Edificio({ semFio }: NivelProps) {
  const wlan = semFio === 'wlan'
  const piso = 3.44
  return (
    <>
      <Ilha raio={8} cor={CHAO} />
      <group position={[1.2, 0, -0.8]}>
        <Caixa tam={[6.4, 3.3, 4.6]} pos={[0, 1.65, 0]} cor="#a9bfd6" />
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <Caixa tam={[6.0, 0.45, 0.03]} pos={[0, 0.6 + i * 1.1, 2.31]} cor="#5d8fc0" sombra={false} />
            <Caixa tam={[0.03, 0.45, 4.2]} pos={[3.21, 0.6 + i * 1.1, 0]} cor="#5d8fc0" sombra={false} />
          </group>
        ))}
        <Caixa tam={[1, 0.8, 0.04]} pos={[0, 0.4, 2.32]} cor="#3d5f82" />
        {/* último andar aberto, como no desenho do slide: a LAN do escritório */}
        <Caixa tam={[6.6, 0.14, 4.8]} pos={[0, 3.37, 0]} cor="#e8e4dc" />
        <Caixa tam={[6.6, 0.9, 0.12]} pos={[0, piso + 0.45, -2.34]} cor="#dfe6ee" />
        <Caixa tam={[0.12, 0.9, 4.8]} pos={[-3.24, piso + 0.45, 0]} cor="#dfe6ee" />
        <Caixa tam={[6.6, 0.3, 0.12]} pos={[0, piso + 0.15, 2.34]} cor="#dfe6ee" />
        <group position={[0, piso, 0]}>
          {MESAS.map((m, i) => (
            <group key={i} position={m}>
              <Caixa tam={[1.1, 0.4, 0.6]} pos={[0, 0.2, 0]} cor="#c9a27a" />
              {i < 3 ? <Computador pos={[0, 0.4, -0.05]} escala={0.42} /> : <Notebook pos={[0, 0.4, 0]} escala={0.5} />}
              <Ligacao pontos={[[0.2, 0.03, 0.35], [SWITCH_ESCRITORIO[0] - m[0], 0.03, SWITCH_ESCRITORIO[2] - m[2] - 0.3]]} raio={0.03} viagens={i % 2 ? [{ duracao: 1.6, pausa: 1.4, atraso: i * 0.3 }] : []} />
            </group>
          ))}
          <Switch pos={SWITCH_ESCRITORIO} escala={0.6} />
          <Servidor pos={[2.4, 0, -1.3]} escala={0.6} />
          <Impressora pos={[-2.3, 0, 1.2]} escala={0.6} />
          <PontoDeAcesso pos={[0.2, 0.9, -2.1]} escala={0.8} />
          <Ondas pos={[0.2, 1.1, -2.1]} cor="#4aa8ff" raio={3.2} periodo={2} ativo={wlan} />
        </group>
      </group>
      {wlan && (
        <>
          <Rotulo pos={[1.4, 5.4, -2.9]} escuro>Ponto de Acesso (AP)</Rotulo>
          <Rotulo pos={[1.4, 4.6, 1.6]}>Notebooks sem fio<small>WLAN · Wi-Fi</small></Rotulo>
        </>
      )}
      <Caixa tam={[3.2, 0.03, 2.2]} pos={[4.6, 0.02, 3.6]} cor="#9aa2aa" sombra={false} />
      <Arvore pos={[-5.6, 0, -3.4]} />
      <Arvore pos={[6.4, 0, -2.4]} escala={1.1} />
      <Arvore pos={[-1.2, 0, 5.6]} escala={0.9} />
      <Arvore pos={[1.4, 0, 6.0]} escala={0.8} />
    </>
  )
}

// ---------- 1 Km · Campus ----------

const PREDIOS_CAMPUS: { pos: V3; tam: V3; cor: string }[] = [
  { pos: [-4.4, 0, -1.8], tam: [1.8, 0.7, 1.2], cor: '#e6d3b3' },
  { pos: [3.8, 0, -3.0], tam: [1.4, 1.0, 1.4], cor: '#d9dee4' },
  { pos: [4.6, 0, 2.0], tam: [2.0, 0.6, 1.1], cor: '#e8c9a0' },
  { pos: [-3.4, 0, 3.6], tam: [1.5, 0.9, 1.2], cor: '#cfd8e0' },
  { pos: [-0.4, 0, -5.0], tam: [2.4, 0.5, 1.0], cor: '#e6d3b3' },
]

function Campus() {
  return (
    <>
      <Ilha raio={8} cor={CHAO} />
      {PREDIOS_CAMPUS.map((p, i) => (
        <group key={i}>
          <Faixa de={[0, 0]} para={[p.pos[0], p.pos[2]]} largura={0.45} cor="#efe6d2" y={0.012} />
          <Predio pos={p.pos} tam={p.tam} cor={p.cor} />
          <Ligacao
            pontos={[[p.pos[0] * 0.2, 0.05, p.pos[2] * 0.2], [p.pos[0] * 0.8, 0.05, p.pos[2] * 0.8]]}
            raio={0.05}
            viagens={[{ duracao: 2, pausa: 1.2, atraso: i * 0.5, inverso: i % 2 === 0 }]}
          />
        </group>
      ))}
      <Caixa tam={[2.6, 0.03, 1.5]} pos={[1.4, 0.02, 5.2]} cor="#6fb86a" sombra={false} />
      <Caixa tam={[2.2, 0.035, 1.1]} pos={[1.4, 0.02, 5.2]} cor="#7cc777" sombra={false} />
      {[[-6.2, -3.2], [6.3, -0.4], [-1.8, 6.2], [5.2, 4.8], [-6.4, 1.2], [2.0, -6.4], [-5.6, -4.8]].map(([x, z], i) => (
        <Arvore key={i} pos={[x, 0, z]} escala={0.7} />
      ))}
    </>
  )
}

// ---------- 10 Km · Cidade ----------

const TORRES_MAN: { quadra: [number, number]; cor: string }[] = [
  { quadra: [2.55, -2.55], cor: '#f2b134' },
  { quadra: [-2.55, -5.1], cor: '#2a3f7a' },
  { quadra: [5.1, 0], cor: '#2e9e6a' },
  { quadra: [0, 5.1], cor: '#c9423f' },
]
const QUADRAS: [number, number][] = []
for (const x of [-5.1, -2.55, 0, 2.55, 5.1]) {
  for (const z of [-5.1, -2.55, 0, 2.55, 5.1]) {
    if (Math.hypot(x, z) + 1.4 > 7.8) continue
    if (x === -2.55 && z === 2.55) continue // encaixe do campus
    QUADRAS.push([x, z])
  }
}
const CORES_PREDIO = ['#e6d3b3', '#d9dee4', '#e8c9a0', '#cfd8e0', '#f0e2cf', '#c9d4c6']

function Cidade() {
  return (
    <>
      <Ilha raio={8} cor={ASFALTO} />
      {QUADRAS.map(([x, z], i) => {
        const torre = TORRES_MAN.find((t) => t.quadra[0] === x && t.quadra[1] === z)
        return (
          <group key={i} position={[x, 0, z]}>
            <Caixa tam={[2.0, 0.08, 2.0]} pos={[0, 0.04, 0]} cor="#dcdfe0" sombra={false} />
            {torre ? (
              <Predio pos={[0, 0.08, 0]} tam={[0.9, 3.0, 0.9]} cor={torre.cor} janela="#f7f3e3" />
            ) : (
              <>
                <Predio pos={[-0.45, 0.08, -0.35]} tam={[0.8, 0.5 + sorte(i) * 1.6, 0.8]} cor={CORES_PREDIO[i % 6]} />
                <Predio pos={[0.45, 0.08, 0.4]} tam={[0.8, 0.4 + sorte(i + 30) * 1.1, 0.7]} cor={CORES_PREDIO[(i + 3) % 6]} />
              </>
            )}
          </group>
        )
      })}
      {/* MAN: o banco e suas sucursais espalhadas pela cidade, ligados entre si */}
      {TORRES_MAN.map((t, i) => {
        const u = TORRES_MAN[(i + 1) % TORRES_MAN.length]
        return (
          <Ligacao
            key={i}
            pontos={arco([t.quadra[0], 3.2, t.quadra[1]], [u.quadra[0], 3.2, u.quadra[1]], 1)}
            cor="#8fc3ea"
            raio={0.05}
            viagens={[{ cor: t.cor, duracao: 2.4, pausa: 1, atraso: i * 0.6 }]}
          />
        )
      })}
    </>
  )
}

// ---------- 100 Km · País ----------

const CIDADES_PAIS: V3[] = [[-0.6, 0.18, 0.5], [2.4, 0.18, -1.8], [-2.6, 0.18, -2.0], [3.0, 0.18, 2.0], [-2.6, 0.18, 2.8], [0.8, 0.18, -3.6], [0.6, 0.18, 3.6]]
const ROTAS_PAIS: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [1, 3], [3, 6], [4, 6], [2, 4]]

function Pais() {
  const pais = '#f0c987'
  return (
    <>
      <Ilha raio={8} cor={TERRA} />
      <Terra x={0} z={0} raio={4.2} lados={7} giro={0.3} topo={0.12} cor={pais} />
      <Terra x={-2.4} z={-2.2} raio={2.6} lados={6} giro={1.1} topo={0.13} cor={pais} />
      <Terra x={2.6} z={1.6} raio={2.8} lados={5} giro={0.2} topo={0.14} cor={pais} />
      <Terra x={1.2} z={-3.2} raio={2.2} lados={6} giro={0.7} topo={0.11} cor={pais} />
      <Terra x={-2.0} z={2.8} raio={2.2} lados={7} giro={2.1} topo={0.15} cor={pais} />
      {CIDADES_PAIS.slice(1).map((c, i) => (
        <group key={i}>
          <Cilindro raio={0.3} altura={0.06} pos={[c[0], 0.19, c[2]]} cor="#c9423f" sombra={false} />
          <Roteador pos={[c[0] + 0.45, 0.16, c[2] - 0.2]} escala={0.45} cor="#c9423f" />
        </group>
      ))}
      {/* WAN: linhas de transmissão + roteadores */}
      {ROTAS_PAIS.map(([a, b], i) => (
        <Ligacao
          key={i}
          pontos={arco([CIDADES_PAIS[a][0], 0.22, CIDADES_PAIS[a][2]], [CIDADES_PAIS[b][0], 0.22, CIDADES_PAIS[b][2]], 0.35, 6)}
          cor="#d8453f"
          raio={0.05}
          viagens={i % 3 === 0 ? [{ duracao: 2.2, pausa: 1.2, atraso: i * 0.3 }] : []}
        />
      ))}
    </>
  )
}

// ---------- 1.000 Km · Continente ----------

const PAISES_VIZINHOS: { x: number; z: number; raio: number; cor: string }[] = [
  { x: -2.2, z: -2.0, raio: 1.6, cor: '#c9dcb0' },
  { x: 3.0, z: -2.4, raio: 1.3, cor: '#e8c1c1' },
  { x: -2.6, z: 2.4, raio: 1.4, cor: '#c8c4e6' },
  { x: 1.6, z: 3.6, raio: 1.1, cor: '#bfe0dc' },
]

function Continente() {
  return (
    <>
      <Ilha raio={8} cor={MAR} />
      <Terra x={0.8} z={0.4} raio={3.4} lados={7} giro={0.2} topo={0.1} cor={TERRA} />
      <Terra x={-1.9} z={-1.8} raio={2.6} lados={6} giro={0.9} topo={0.11} cor={TERRA} />
      <Terra x={2.8} z={-2.2} raio={2.0} lados={5} giro={0.4} topo={0.12} cor={TERRA} />
      <Terra x={-2.4} z={2.3} raio={2.3} lados={7} giro={1.7} topo={0.13} cor={TERRA} />
      <Terra x={1.5} z={3.4} raio={1.8} lados={6} giro={0.1} topo={0.14} cor={TERRA} />
      {PAISES_VIZINHOS.map((p, i) => (
        <Terra key={i} x={p.x} z={p.z} raio={p.raio} lados={6} giro={i} topo={0.16} cor={p.cor} />
      ))}
      <Terra x={-5.4} z={-1.2} raio={0.9} lados={5} topo={0.1} cor={TERRA} />
      <Terra x={5.6} z={2.0} raio={0.7} lados={6} topo={0.1} cor={TERRA} />
      {PAISES_VIZINHOS.map((p, i) => (
        <group key={i}>
          <Roteador pos={[p.x, 0.16, p.z]} escala={0.5} cor="#c9423f" />
          <Ligacao pontos={arco([p.x, 0.25, p.z], [1.0, 0.25, 0.6], 0.9, 8)} cor="#d8453f" raio={0.05} viagens={[{ duracao: 2.4, pausa: 1, atraso: i * 0.5 }]} />
        </group>
      ))}
    </>
  )
}

// ---------- 10.000 Km · Planeta ----------

const RAIO_GLOBO = 3.1
const CENTRO_GLOBO: V3 = [0, -RAIO_GLOBO, 0]
const MANCHAS: [number, number, V3][] = [
  [1.0, 0.4, [1.5, 0.3, 1.0]],
  [1.3, 2.2, [1.3, 0.3, 1.1]],
  [1.1, 3.6, [1.7, 0.3, 0.9]],
  [1.7, 1.2, [1.1, 0.3, 1.4]],
  [1.9, 4.6, [1.2, 0.3, 1.0]],
  [0.9, 5.4, [1.0, 0.3, 0.8]],
]

function Mancha({ polar, azimute, tam }: { polar: number; azimute: number; tam: V3 }) {
  const { posicao, giro } = useMemo(() => {
    const n = new Vector3(Math.sin(polar) * Math.cos(azimute), Math.cos(polar), Math.sin(polar) * Math.sin(azimute))
    return {
      posicao: n.clone().multiplyScalar(RAIO_GLOBO - 0.12).add(new Vector3(...CENTRO_GLOBO)),
      giro: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), n),
    }
  }, [polar, azimute])
  return <mesh geometry={esferaUnitaria} material={material({ cor: '#8cc07a' })} position={posicao} quaternion={giro} scale={tam} />
}

function Orbita({ inclinacao, giro, atraso }: { inclinacao: number; giro: number; atraso: number }) {
  const raio = RAIO_GLOBO + 0.9
  const pontos = useMemo(
    () =>
      Array.from({ length: 49 }, (_, i): V3 => {
        const a = (i / 48) * Math.PI * 2
        const p = new Vector3(Math.cos(a) * raio, 0, Math.sin(a) * raio)
          .applyAxisAngle(new Vector3(1, 0, 0), inclinacao)
          .applyAxisAngle(new Vector3(0, 1, 0), giro)
        return [p.x + CENTRO_GLOBO[0], p.y + CENTRO_GLOBO[1], p.z + CENTRO_GLOBO[2]]
      }),
    [raio, inclinacao, giro],
  )
  const curva = useCurva(pontos)
  return (
    <>
      <mesh>
        <tubeGeometry args={[curva, 120, 0.035, 6, true]} />
        <meshStandardMaterial color="#e98a2e" emissive="#e98a2e" emissiveIntensity={0.3} />
      </mesh>
      <Viajante curva={curva} duracao={7} pausa={0} atraso={atraso}>
        <Envelope escala={0.8} cor="#e98a2e" />
      </Viajante>
    </>
  )
}

function Planeta() {
  return (
    <>
      <Esfera raio={RAIO_GLOBO} pos={CENTRO_GLOBO} cor="#6fb3d9" sombra={false} />
      {MANCHAS.map(([p, a, t], i) => (
        <Mancha key={i} polar={p} azimute={a} tam={t} />
      ))}
      <Orbita inclinacao={0.35} giro={0} atraso={0} />
      <Orbita inclinacao={-0.5} giro={1.2} atraso={2.3} />
      <Orbita inclinacao={0.9} giro={2.4} atraso={4.6} />
    </>
  )
}

// ---------- Os níveis e o zoom ----------

export const NIVEIS: Nivel[] = [
  { medida: '1 metro', lugar: 'Mesa', classe: 'Redes Pessoais', cor: '#e6e8f5', Conteudo: Mesa },
  { medida: '70 metros', lugar: 'Casa', classe: 'Redes Pessoais', cor: '#e6e8f5', encaixe: [-2.4, 0.15, -1.9], Conteudo: Casa },
  { medida: '100 metros', lugar: 'Edifício', classe: 'Redes Locais', cor: '#f5dfe1', encaixe: [-4.8, 0.03, 3.4], Conteudo: Edificio },
  { medida: '1 Km', lugar: 'Campus', classe: 'Redes Locais', cor: '#f5dfe1', encaixe: [0, 0.03, 0], Conteudo: Campus },
  { medida: '10 Km', lugar: 'Cidade', classe: 'Redes Metropolitanas', cor: '#dedede', encaixe: [-2.55, 0.03, 2.55], Conteudo: Cidade },
  { medida: '100 Km', lugar: 'País', classe: 'Redes Geograficamente Distribuídas', cor: '#d9e8c8', encaixe: [-0.6, 0.2, 0.5], Conteudo: Pais },
  { medida: '1.000 Km', lugar: 'Continente', classe: 'Redes Geograficamente Distribuídas', cor: '#d9e8c8', encaixe: [1.0, 0.18, 0.6], Conteudo: Continente },
  { medida: '10.000 Km', lugar: 'Planeta', classe: 'Internet', cor: '#f8cfa8', encaixe: [0, 0.02, 0], Conteudo: Planeta },
]

const TOPO = NIVEIS.length - 1

// Referencial de cada nível dentro do mais externo (o planeta): origem e escala.
const ESCALA: number[] = []
const ORIGEM: Vector3[] = []
ESCALA[TOPO] = 1
ORIGEM[TOPO] = new Vector3()
for (let k = TOPO; k > 0; k--) {
  ESCALA[k - 1] = ESCALA[k] / R
  ORIGEM[k - 1] = ORIGEM[k].clone().addScaledVector(new Vector3(...NIVEIS[k].encaixe!), ESCALA[k])
}

function Andar({ k, refs, semFio }: { k: number; refs: RefObject<(Group | null)[]>; semFio?: string }) {
  const { Conteudo } = NIVEIS[k]
  return (
    <group>
      <group ref={(g) => { refs.current[k] = g }}>
        <Conteudo semFio={semFio} />
      </group>
      {k > 0 && (
        <group position={NIVEIS[k].encaixe} scale={1 / R}>
          <Andar k={k - 1} refs={refs} semFio={semFio} />
        </group>
      )}
    </group>
  )
}

const tmp = new Vector3()

/**
 * Anima o nível `t` (contínuo) até `alvo`. O nível k fica em tamanho real quando t = k;
 * entre k e k+1 a escala muda em progressão geométrica em volta do ponto de encaixe.
 */
function Zoom({ alvo, semFio, onChegou }: { alvo: number; semFio?: string; onChegou: (chegou: boolean) => void }) {
  const raiz = useRef<Group>(null)
  const niveis = useRef<(Group | null)[]>([])
  const t = useRef(alvo)
  const atualizarSombras = useAtualizarSombras()

  function aplicar() {
    const tt = t.current
    const k = Math.min(Math.floor(tt), TOPO - 1)
    const s = ESCALA[k] * R ** (tt - k)
    const f = (s - ESCALA[k]) / (ESCALA[k + 1] - ESCALA[k])
    tmp.lerpVectors(ORIGEM[k], ORIGEM[k + 1], f)
    raiz.current?.scale.setScalar(1 / s)
    raiz.current?.position.copy(tmp).multiplyScalar(-1 / s)
    const [de, ate] = [Math.floor(tt) - 1, Math.ceil(tt)]
    niveis.current.forEach((g, j) => {
      if (g) g.visible = j >= de && j <= ate
    })
  }

  useLayoutEffect(aplicar, [])
  useEffect(() => onChegou(t.current === alvo), [alvo])

  useFrame((_, dt) => {
    const d = alvo - t.current
    if (d === 0) return
    const passo = Math.max(0.9, Math.min(3.5, Math.abs(d) * 2.4)) * Math.min(dt, 0.05)
    t.current = Math.abs(d) <= passo ? alvo : t.current + Math.sign(d) * passo
    aplicar()
    atualizarSombras()
    if (t.current === alvo) onChegou(true)
  })

  return (
    <group ref={raiz}>
      <Andar k={TOPO} refs={niveis} semFio={semFio} />
    </group>
  )
}

/** A tabela do slide, fixa na tela; clicar numa linha leva a câmera até aquele nível. */
function Tabela({ atual, onEscolher }: { atual: number; onEscolher: (n: number) => void }) {
  return (
    <Fixo x={16} y={84}>
      <div className="escala-tabela" role="list" aria-label="Abrangência das redes">
        {NIVEIS.map((n, i) => (
          <button
            key={i}
            role="listitem"
            className={i === atual ? 'ativa' : ''}
            style={{ background: n.cor }}
            onClick={() => onEscolher(i)}
          >
            {(i === 0 || NIVEIS[i - 1].classe !== n.classe) && <span className="classe">{n.classe}</span>}
            <span className="medida">{n.medida}</span>
            <span className="lugar">{n.lugar}</span>
          </button>
        ))}
      </div>
    </Fixo>
  )
}

export function CenaAbrangencia({ estado }: CenaProps) {
  const doPasso = (estado.nivel as number | undefined) ?? 0
  const semFio = estado.semFio as string | undefined
  // O aluno pode passear pela tabela; ao trocar de passo, volta ao nível do roteiro.
  const [livre, setLivre] = useState<number | null>(null)
  useEffect(() => setLivre(null), [doPasso])
  const alvo = livre ?? doPasso
  const [chegou, setChegou] = useState(true)
  const nivel = NIVEIS[alvo]

  return (
    <>
      <Zoom alvo={alvo} semFio={semFio} onChegou={setChegou} />
      {chegou && (
        <Rotulo pos={alvo === TOPO ? [0, 1.9, 0] : [0, 4.4, -1.5]}>
          {nivel.lugar} · {nivel.medida}<small>{nivel.classe}</small>
        </Rotulo>
      )}
      <Tabela atual={alvo} onEscolher={setLivre} />
    </>
  )
}
