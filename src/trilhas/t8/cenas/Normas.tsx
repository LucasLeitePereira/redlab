import { Line } from '@react-three/drei'
import { Alvo, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Quadro } from './comum'

// Fase 8.2 — Padrões IEEE e as normas 802 (Aula 07 p. 4, 9–10).
// 'padroes': 4 cartões. 'diagrama': réplica do diagrama da p. 10 (RM-OSI × IEEE 802).

const PADROES = [
  { nome: 'IEEE 802', cor: '#3f6b3a', texto: 'Normas usadas para padronizar as redes locais e redes metropolitanas.' },
  { nome: 'IEEE 488', cor: '#3e6480', texto: 'Padrão de comunicação usado para conectar instrumentos de teste. Também conhecido como GPIB (General Purpose Interface Bus).' },
  { nome: 'IEEE 829', cor: '#9a4418', texto: 'Documentação de Teste de Software.' },
  { nome: 'IEEE 1284', cor: '#8a5a8f', texto: 'Define comunicações bidirecionais paralelas entre computadores e outros dispositivos.' },
]

function Padroes({ semNomes }: { semNomes: boolean }) {
  return (
    <>
      {PADROES.map((p, i) => {
        const x = i % 2 === 0 ? -2.5 : 2.5
        const y = i < 2 ? 3.45 : 1.55
        return (
          <group key={p.nome}>
            <Caixa tam={[4.6, 1.7, 0.3]} pos={[x, y, -0.2]} cor={p.cor} />
            <Rotulo pos={[x, y + 0.5, 0]} classe="tijolo claro">
              <span style={{ fontSize: 20 }}>{p.nome}</span>
            </Rotulo>
            {!semNomes && (
              <Quadro pos={[x, y - 0.3, 0.1]} largura={290} estilo={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, padding: '5px 9px' }}>
                {p.texto}
              </Quadro>
            )}
          </group>
        )
      })}
    </>
  )
}

function Bloco({ pos, tam, cor, texto, claro = true }: { pos: V3; tam: [number, number]; cor: string; texto: string; claro?: boolean }) {
  return (
    <>
      <Caixa tam={[tam[0], tam[1], 0.4]} pos={pos} cor={cor} />
      <Rotulo pos={[pos[0], pos[1], pos[2] + 0.22]} classe={`tijolo ${claro ? 'claro' : ''}`}>
        {texto}
      </Rotulo>
    </>
  )
}

function Diagrama({ cena, semNomes }: { cena: CenaProps; semNomes: boolean }) {
  const explorando = cena.alvos.length > 0
  const brilho = (id: string) => (explorando && cena.alvos.includes(id) ? { emissivo: '#ffd54a', intensidade: 0.6 } : {})
  const normas = [
    { n: '802.3', x: -1.8, cab: true },
    { n: '802.5', x: -0.5, cab: true },
    { n: '802.11', x: 0.8, cab: false },
    { n: '802.15', x: 2.1, cab: false },
    { n: '802.16', x: 3.4, cab: false },
  ]
  const yBaixo = 1.9
  const caixa: V3[] = [
    [-3.35, 0.45, 0.2], [4.7, 0.45, 0.2], [4.7, 4.95, 0.2], [-3.35, 4.95, 0.2], [-3.35, 0.45, 0.2],
  ]
  const corCab = semNomes ? '#7a8590' : '#2f6fd0'
  const corSem = semNomes ? '#7a8590' : '#d9822b'
  return (
    <group position={[0.2, 0, 0]}>
      {/* lado esquerdo: RM-OSI */}
      <Rotulo pos={[-4.7, 5.3, 0]} classe="mini">
        RM-OSI
      </Rotulo>
      <Caixa tam={[1.9, 2.2, 0.3]} pos={[-4.7, 3.05, -0.1]} cor="#f2dca0" sombra={false} />
      <Rotulo pos={[-4.7, 4.3, 0.1]} classe="mini">
        Enlace
      </Rotulo>
      <Bloco pos={[-4.7, 3.65, 0.1]} tam={[1.6, 0.8]} cor="#e0a92a" texto="LLC" claro={false} />
      <Bloco pos={[-4.7, 2.65, 0.1]} tam={[1.6, 0.8]} cor="#c48a14" texto="MAC" />
      <Bloco pos={[-4.7, 1.2, 0.1]} tam={[1.9, 0.8]} cor="#c48a14" texto="Física" />

      {/* lado direito: IEEE 802 em caixa tracejada */}
      <Line points={caixa} color="#4a5a6a" lineWidth={2.5} dashed dashSize={0.25} gapSize={0.16} />
      <Rotulo pos={[0.7, 5.3, 0]} classe="mini">
        IEEE 802
      </Rotulo>

      <Caixa tam={[0.8, 3.9, 0.4]} pos={[-2.85, 2.7, 0.1]} cor="#3e6480" {...brilho('n1')} />
      <Rotulo pos={[-2.85, 2.7, 0.33]} classe="tijolo claro">
        <span style={{ display: 'inline-block', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>802.1</span>
      </Rotulo>
      <Alvo id="n1" pos={[-2.85, 4.95, 0.3]} cena={cena} />

      <Caixa tam={[6.75, 0.8, 0.4]} pos={[1.025, 3.65, 0.1]} cor="#3f6b3a" {...brilho('n2')} />
      <Rotulo pos={[1.025, 3.65, 0.33]} classe="tijolo claro">
        802.2
      </Rotulo>
      <Alvo id="n2" pos={[4.0, 3.65, 0.3]} cena={cena} />

      {normas.map((n) => (
        <group key={n.n}>
          <Caixa tam={[1.2, 2.3, 0.4]} pos={[n.x, yBaixo + 0.1, 0.1]} cor={n.cab ? '#2f6fd0' : '#d9822b'} />
          <Rotulo pos={[n.x, yBaixo + 0.1, 0.33]} classe="tijolo claro">
            {n.n}
          </Rotulo>
        </group>
      ))}

      {/* chaves: Cabeado (802.3 e 802.5) e Sem Fio (802.11, 802.15, 802.16) */}
      <Caixa tam={[2.5, 0.07, 0.1]} pos={[-0.95, 0.65, 0.1]} cor={corCab} sombra={false} />
      <Caixa tam={[3.6, 0.07, 0.1]} pos={[2.2, 0.65, 0.1]} cor={corSem} sombra={false} />
      {!semNomes && (
        <>
          <Rotulo pos={[-0.95, 0.3, 0.1]}>Cabeado</Rotulo>
          <Rotulo pos={[2.2, 0.3, 0.1]}>Sem Fio</Rotulo>
        </>
      )}
    </group>
  )
}

export function CenaNormas(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'padroes'
  const semNomes = !!cena.estado.semNomes
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'padroes' ? <Padroes semNomes={semNomes} /> : <Diagrama cena={cena} semNomes={semNomes} />}
    </>
  )
}
