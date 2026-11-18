import { Line } from '@react-three/drei'
import { Caixa, Cilindro, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { EstacaoBase } from '../../../three/modelos'
import { arco, Pulsos, useCurva } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Tabela3D, linha, type Col } from '../../t8/cenas/comum'

// Fase 9.10 — WiMAX 802.16 (Aula 08 p. 28–31).
// 'topologia': provedor + casas, condomínios e empresa; 'modulacao': anéis QAM-64/QAM-16/QPSK
// (estados `destaque`, `semNomes`); 'pilha': 5 camadas (estado `semCamada`); 'tabela' (estado `semBanda`).

const AMARELO = '#f2c21b'

function Casa({ pos }: { pos: V3 }) {
  return (
    <group>
      <Caixa tam={[1.5, 0.9, 1.2]} pos={[pos[0], 0.45, pos[2]]} cor="#f3e3c3" />
      <Cilindro raio={0} raioBase={1.1} altura={0.65} lados={4} pos={[pos[0], 1.22, pos[2]]} rot={[0, Math.PI / 4, 0]} cor="#c0553b" />
    </group>
  )
}

function Predio({ pos, alt = 2.4, larg = 1.5, cor = '#b8c4d0' }: { pos: V3; alt?: number; larg?: number; cor?: string }) {
  return (
    <group>
      <Caixa tam={[larg, alt, 1.3]} pos={[pos[0], alt / 2, pos[2]]} cor={cor} />
      {[0.3, 0.55, 0.8].map((f) => (
        <Caixa key={f} tam={[larg * 0.7, 0.14, 0.02]} pos={[pos[0], alt * f, pos[2] + 0.66]} cor="#5fb2f5" emissivo="#5fb2f5" intensidade={0.4} sombra={false} />
      ))}
    </group>
  )
}

function Galpao({ pos }: { pos: V3 }) {
  return (
    <group>
      <Caixa tam={[2.6, 1.0, 1.5]} pos={[pos[0], 0.5, pos[2]]} cor="#d9d3c4" />
      <Cilindro raio={0} raioBase={1.5} altura={0.5} lados={4} pos={[pos[0], 1.25, pos[2]]} rot={[0, Math.PI / 4, 0]} cor="#7a8794" />
      <Caixa tam={[0.8, 0.7, 0.04]} pos={[pos[0], 0.35, pos[2] + 0.77]} cor="#4a5a6a" sombra={false} />
    </group>
  )
}

const TOPO: V3 = [0, 3.7, -1.3]

function Raio({ para }: { para: V3 }) {
  const curva = useCurva(arco(TOPO, para, 0))
  return (
    <>
      <Line points={[TOPO, para]} color={AMARELO} lineWidth={2} dashed dashSize={0.25} gapSize={0.16} />
      <Pulsos curva={curva} cor={AMARELO} quantidade={2} duracao={2.2} tamanho={0.09} />
    </>
  )
}

function Topologia() {
  const casas: V3[] = [[-4.4, 0, 1.0], [4.4, 0, 1.0]]
  const condos: V3[] = [[-4.6, 0, -3.0], [4.6, 0, -3.0]]
  const galpao: V3 = [0, 0, 3.4]
  return (
    <>
      <Caixa tam={[2.2, 2.2, 1.6]} pos={[0, 1.1, -1.3]} cor="#8fa6bd" />
      <Cilindro raio={0.05} altura={1.5} pos={[0, 2.95, -1.3]} cor="#c95a4a" />
      <Esfera raio={0.12} pos={TOPO} cor={AMARELO} emissivo={AMARELO} intensidade={1} sombra={false} />
      <Rotulo pos={[0, 1.1, -0.35]} escuro>Provedor Internet</Rotulo>

      {casas.map((p, i) => (
        <group key={i}>
          <Casa pos={p} />
          <Rotulo pos={[p[0], 1.9, p[2]]} classe="mini">Usuário doméstico</Rotulo>
          <Raio para={[p[0], 1.6, p[2]]} />
        </group>
      ))}
      {condos.map((p, i) => (
        <group key={i}>
          <Predio pos={p} />
          <Rotulo pos={[p[0], 2.9, p[2]]} classe="mini">Condomínio</Rotulo>
          <Raio para={[p[0], 2.45, p[2]]} />
        </group>
      ))}
      <Galpao pos={galpao} />
      <Rotulo pos={[galpao[0], 1.9, galpao[2]]} classe="mini">Empresa</Rotulo>
      <Raio para={[galpao[0], 1.55, galpao[2]]} />
    </>
  )
}

const TORRE: V3 = [0, 0.12, -0.5]
const ANEIS: { id: string; nome: string; r: number; y: number; cor: string; z: number }[] = [
  { id: 'qpsk', nome: 'QPSK', r: 5.4, y: 0.03, cor: '#d3d8dd', z: 4.6 },
  { id: 'qam16', nome: 'QAM-16', r: 3.8, y: 0.06, cor: '#aeb5bd', z: 3.1 },
  { id: 'qam64', nome: 'QAM-64', r: 2.2, y: 0.09, cor: '#8b939d', z: 1.5 },
]

function Modulacao({ destaque, semNomes }: { destaque?: string; semNomes: boolean }) {
  return (
    <>
      {ANEIS.map((a) => {
        const aceso = destaque === a.id
        return (
          <Cilindro
            key={a.id}
            raio={a.r}
            altura={0.04}
            lados={64}
            pos={[0, a.y, TORRE[2]]}
            cor={aceso ? '#f2c21b' : a.cor}
            emissivo={aceso ? '#f2c21b' : undefined}
            intensidade={0.5}
            sombra={false}
          />
        )
      })}
      <EstacaoBase pos={TORRE} escala={1} />
      <Predio pos={[1.2, 0, 0.5]} alt={1.6} larg={1.2} />
      <Casa pos={[4.7, 0, 0.4]} />
      <Rotulo pos={[1.2, 1.9, 0.5]} classe="mini">Prédio (perto)</Rotulo>
      <Rotulo pos={[4.7, 1.8, 0.4]} classe="mini">Casa (longe)</Rotulo>
      {!semNomes &&
        ANEIS.map((a) => (
          <Rotulo key={a.id} pos={[0, 0.2, a.z]} classe="grande">
            {a.nome}
          </Rotulo>
        ))}
    </>
  )
}

const CAMADAS = [
  { n: '①', nome: 'QPSK · QAM-16 · QAM-64', cor: '#c48a14' },
  { n: '②', nome: 'Transmission convergence sublayer', cor: '#c48a14' },
  { n: '③', nome: 'Security sublayer', cor: '#3e6480' },
  { n: '④', nome: 'MAC sublayer common part', cor: '#3e6480' },
  { n: '⑤', nome: 'Service specific convergence sublayer', cor: '#3e6480' },
]
const PX = -1.4
const base = (i: number) => 0.12 + i * 0.62

function Chave({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const h = y1 - y0
  return (
    <group>
      <Caixa tam={[0.08, h, 0.08]} pos={[x, y0 + h / 2, 0]} cor="#1d2733" sombra={false} />
      {[y0 + 0.04, y1 - 0.04].map((y) => (
        <Caixa key={y} tam={[0.3, 0.08, 0.08]} pos={[x - 0.15, y, 0]} cor="#1d2733" sombra={false} />
      ))}
    </group>
  )
}

function Pilha({ semCamada }: { semCamada: boolean }) {
  return (
    <>
      {CAMADAS.map((c, i) => (
        <group key={i}>
          <Caixa tam={[4.4, 0.58, 1.6]} pos={[PX, base(i) + 0.29, 0]} cor={c.cor} />
          <Rotulo pos={[PX, base(i) + 0.29, 0.85]}>
            {c.n} {c.nome}
          </Rotulo>
        </group>
      ))}
      <Caixa tam={[4.4, 0.58, 1.6]} pos={[PX, base(5) + 0.29, 0]} cor="#ffffff" />
      <Rotulo pos={[PX, base(5) + 0.29, 0.85]} escuro>
        Camadas superiores
      </Rotulo>
      <Chave y0={base(0)} y1={base(1) + 0.58} x={1.15} />
      <Chave y0={base(2)} y1={base(4) + 0.58} x={1.15} />
      {!semCamada && (
        <>
          <Rotulo pos={[3.3, (base(0) + base(1) + 0.58) / 2, 0]} classe="grande">Camada física</Rotulo>
          <Rotulo pos={[3.3, (base(2) + base(4) + 0.58) / 2, 0]} classe="grande">Camada enlace</Rotulo>
        </>
      )}
    </>
  )
}

const TAB_LINHAS = [
  ['802.16d', 'Uso fixo, antena montada no teto da casa', '2,5 GHz e 3,5 GHz (licenciada) e 5,8 GHz (ISM)', '75 Mbps – 10 km'],
  ['802.16e', 'Liga clientes móveis à Internet ou serviços móveis', '2 GHz – 6 GHz (licenciada)', '30 Mbps – 3,5 km'],
]

export function CenaWimax(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'topologia'
  const colunas: Col[] = [
    { id: 'padrao', titulo: 'Padrão' },
    { id: 'uso', titulo: 'Uso' },
    { id: 'freq', titulo: 'Frequência' },
    { id: 'banda', titulo: 'Banda e alcance', esconder: !!cena.estado.semBanda },
  ]
  return (
    <>
      <Ilha raio={8.8} />
      {/* recuadas e reduzidas: na escala original o galpão e o anel QPSK saíam por baixo da tela */}
      {modo === 'topologia' && (
        <group position={[0, 0, -1]} scale={0.85}>
          <Topologia />
        </group>
      )}
      {modo === 'modulacao' && (
        <group position={[0, 0, -0.8]} scale={0.72}>
          <Modulacao destaque={cena.estado.destaque as string | undefined} semNomes={!!cena.estado.semNomes} />
        </group>
      )}
      {modo === 'pilha' && <Pilha semCamada={!!cena.estado.semCamada} />}
      {modo === 'tabela' && (
        <Tabela3D pos={[0, 2.4, 0]} largura={580} colunas={colunas} linhas={TAB_LINHAS.map((l) => linha(colunas, l))} fonte={13} titulo="IEEE 802.16 · WiMAX" />
      )}
    </>
  )
}
