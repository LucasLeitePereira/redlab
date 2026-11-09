import { Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Notebook, PontoDeAcesso, Switch } from '../../../three/modelos'
import { arco, Ondas, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Anel, Tabela3D, linha, type Cel, type Col, type Lin } from './comum'

// Fase 8.6 — IEEE 802.5, 802.11 e as gerações Wi-Fi (Aula 07 p. 12–13).
// 'anel': anel Token Ring com 4 computadores; 'wifi': ponto de acesso + rede cabeada + 3 notebooks;
// 'tabela': padrões 802.11 (Padrão | Geração | Frequência | Taxa).

const VERMELHO = '#ef6f6c'
const AZUL = '#3aa0e6'
const AP: V3 = [1.0, 0.12, -1.0]
const NOTEBOOKS: V3[] = [[-1.8, 0.12, 2.6], [1.8, 0.12, 3.3], [4.6, 0.12, 1.5]]
const CICLO = 12.6

/** Pacote no ar entre o ponto de acesso e um notebook: vai e volta, um de cada vez. */
function EnlaceAr({ de, para, k }: { de: V3; para: V3; k: number }) {
  const curva = useCurva(arco([de[0], 1.0, de[2]], [para[0], 1.0, para[2]], 0.7))
  return (
    <>
      <Viajante curva={curva} duracao={1.8} pausa={CICLO - 1.8} atraso={k * 4.2}>
        <Dado cor={VERMELHO} sombra={false} />
      </Viajante>
      <Viajante curva={curva} duracao={1.8} pausa={CICLO - 1.8} atraso={k * 4.2 + 2.1} inverso>
        <Dado cor={AZUL} sombra={false} />
      </Viajante>
    </>
  )
}

function Wifi() {
  return (
    <>
      {/* rede cabeada */}
      <Switch pos={[-4.8, 0.12, -1]} escala={1.1} rot={[0, Math.PI / 2, 0]} />
      <Rotulo pos={[-4.8, 1.0, -1]} escuro>
        Rede cabeada
      </Rotulo>
      <Ligacao
        pontos={[[-4.3, 0.2, -1], [AP[0] - 0.5, 0.2, -1]]}
        cor="#2f5fa0"
        viagens={[{ cor: VERMELHO, duracao: 1.8 }, { cor: AZUL, duracao: 1.8, inverso: true, atraso: 2.1 }]}
      />

      <PontoDeAcesso pos={AP} escala={1.4} />
      <Ondas pos={[AP[0], 1.0, AP[2]]} cor="#3aa0e6" raio={4.5} periodo={2.6} quantidade={3} />
      <Rotulo pos={[AP[0], 3.3, AP[2]]} classe="cartao">
        <b>Ponto de Acesso:</b> Envia pacotes entre a rede cabeada e os hospedeiros sem fio
      </Rotulo>

      {NOTEBOOKS.map((p, k) => (
        <group key={k}>
          <Notebook pos={p} rot={[0, Math.atan2(AP[0] - p[0], AP[2] - p[2]), 0]} escala={0.9} />
          <EnlaceAr de={AP} para={p} k={k} />
        </group>
      ))}
      <Rotulo pos={[1.6, 0.4, 4.5]} classe="mini">
        Hospedeiros sem fio
      </Rotulo>
    </>
  )
}

const COLUNAS = (semNomes: boolean, semFrequencia: boolean, semTaxa: boolean): Col[] => [
  { id: 'padrao', titulo: 'Padrão' },
  { id: 'geracao', titulo: 'Geração', esconder: semNomes },
  { id: 'freq', titulo: 'Frequência', esconder: semFrequencia },
  { id: 'taxa', titulo: 'Taxa', esconder: semTaxa },
]

const cel = (t: string, col: string, extra: Partial<Cel> = {}): Cel => ({ t, col, ...extra })

function linhasWifi(c: Col[]): Lin[] {
  const L = (p: string, g: string, f: string, t: string) => linha(c, [p, g, f, t])
  return [
    L('(1997) 802.11', 'Wi-Fi 0', '2,4 GHz', '2 Mbps'),
    L('(1999) 802.11b', 'Wi-Fi 1', '2,4 GHz', '11 Mbps'),
    L('(1999) 802.11a', 'Wi-Fi 2', '5,0 GHz', '54 Mbps'),
    // 802.11e, g e i compartilham "Wi-Fi 3" no slide
    { cels: [cel('(2005) 802.11e', 'padrao', { negrito: true }), cel('Wi-Fi 3', 'geracao', { rowSpan: 3 }), cel('Melhorias para suporte a QoS', 'freq', { colSpan: 2, fixo: true })] },
    { cels: [cel('(2003) 802.11g', 'padrao', { negrito: true }), cel('2,4 GHz', 'freq'), cel('54 Mbps', 'taxa')] },
    { cels: [cel('(2004) 802.11i', 'padrao', { negrito: true }), cel('Melhoria de Segurança', 'freq', { colSpan: 2, fixo: true })] },
    L('(2008) 802.11n', 'Wi-Fi 4', '2,4/5,0 GHz', '72 a 600 Mbps'),
    L('(2014) 802.11ac', 'Wi-Fi 5', '5,0 GHz', '433Mbps a 6,9Gbps'),
    L('(2019) 802.11ax', 'Wi-Fi 6', '2,4/5,0 GHz', '574Mbps a 9,6Gbps'),
    L('(2024) 802.11be', 'Wi-Fi 7', '2,4/5/6,0 GHz', '1,3Gbps a 46Gbps'),
  ]
}

export function CenaSemFio(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'anel'
  const colunas = COLUNAS(!!cena.estado.semNomes, !!cena.estado.semFrequencia, !!cena.estado.semTaxa)
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'anel' && (
        <>
          <Anel n={4} raio={3.0} />
          <Rotulo pos={[0, 3.6, 0]} classe="grande" escuro>
            IEEE 802.5 · Token Ring
          </Rotulo>
        </>
      )}
      {modo === 'wifi' && <Wifi />}
      {modo === 'tabela' && <Tabela3D pos={[0.4, 2.5, 0]} largura={600} colunas={colunas} linhas={linhasWifi(colunas)} fonte={13} />}
    </>
  )
}
