import { Alvo, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Dado } from '../../../three/dados'
import { Computador, Roteador } from '../../../three/modelos'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Encaixe, Seta, Tijolo } from './comum'

// Fase 7.1 — IPv4 (Aula 06 p. 1–4): os protocolos da Internet, a entrega sem garantias e o
// pacote dentro do quadro Ethernet.

const REDE = '#9a4418'
const TRANSPORTE = '#3e6480'

const PROTOCOLOS = [
  { id: 'IPv4', x: -2.6, y: 1.7, cor: REDE, en: 'Internet Protocol ver. 4', pt: 'Protocolo Internet Versão 4' },
  { id: 'ICMP', x: 2.6, y: 1.7, cor: REDE, en: 'Internet Control Message Protocol', pt: 'Protocolo de Mensagens de Controle da Internet' },
  { id: 'TCP', x: -2.6, y: 3.9, cor: TRANSPORTE, en: 'Transmission Control Protocol', pt: 'Protocolo de Controle de Transmissão' },
  { id: 'UDP', x: 2.6, y: 3.9, cor: TRANSPORTE, en: 'User Datagram Protocol', pt: 'Protocolo de Datagrama do Usuário' },
]

function Protocolos() {
  return (
    <group>
      {PROTOCOLOS.map((p) => (
        <group key={p.id}>
          <Tijolo pos={[p.x, p.y, 0]} tam={[3.4, 0.9, 0.4]} cor={p.cor} claro texto={p.id} />
          <Rotulo pos={[p.x, p.y - 0.82, 0.2]} classe="mini">
            <i>{p.en}</i>
            <br />
            {p.pt}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[-5.4, 3.9, 0]} escuro>
        Transporte
      </Rotulo>
      <Rotulo pos={[-5.4, 1.7, 0]} escuro>
        Rede
      </Rotulo>
    </group>
  )
}

const H1: V3 = [-5.6, 0.14, 0]
const H2: V3 = [5.6, 0.14, 0]
const R: V3[] = [
  [-2.8, 0.14, -1.8],
  [0, 0.14, 1.4],
  [2.8, 0.14, -1.2],
]
const CABOS: [V3, V3][] = [
  [H1, R[0]],
  [R[0], R[1]],
  [R[1], R[2]],
  [R[2], H2],
  [R[0], R[2]],
]

function Entrega() {
  return (
    <group>
      <Computador pos={[H1[0], 0.12, 0]} escala={0.85} />
      <Computador pos={[H2[0], 0.12, 0]} escala={0.85} rot={[0, -0.3, 0]} />
      {R.map((p, i) => (
        <Roteador key={i} pos={[p[0], 0.12, p[2]]} escala={0.9} />
      ))}
      {CABOS.map(([a, b], i) => (
        <Ligacao key={i} pontos={[a, b]} cor="#2f5fa0" raio={0.05} />
      ))}
      <Rotulo pos={[H1[0], 1.8, 0]} escuro>
        Host de origem
      </Rotulo>
      <Rotulo pos={[H2[0], 1.8, 0]} escuro>
        Host de destino
      </Rotulo>
      {R.map((p, i) => (
        <Rotulo key={i} pos={[p[0], 1.1, p[2]]} classe="mini">
          Roteador
        </Rotulo>
      ))}
      <Rotulo pos={[0, 3.6, -1]} escuro>
        Os roteadores escolhem o caminho de cada pacote
      </Rotulo>
      <Percurso pontos={[H1, R[0], R[1], R[2], H2]} velocidade={3} espera={0.3} periodo={12}>
        <group scale={0.6}>
          <Dado tipo="mensagem" cor="#3aa0e6" sombra={false} />
        </group>
      </Percurso>
      <Percurso pontos={[H1, R[0], R[2], H2]} velocidade={3} espera={0.3} periodo={12} atraso={6}>
        <group scale={0.6}>
          <Dado tipo="mensagem" cor="#ef6f6c" sombra={false} />
        </group>
      </Percurso>
    </group>
  )
}

const TOPO = [-4, -2, 0, 2, 4]
const BAIXO = [-5, -3, -1, 1, 3, 5]
const Y_TOPO = 3.9
const Y_BAIXO = 1.5
const COR_PACOTE = '#e0606e'
// ordem de chegada: 1, (2 perdido), 3, 3 (duplicado), 5 (antes do 4), 4 (adiado)
const CHEGADAS = [
  { t: '1', de: 0, id: undefined },
  { t: '✗', de: 1, id: 'perdido' },
  { t: '3', de: 2, id: undefined },
  { t: '3', de: 2, id: 'duplicado' },
  { t: '5', de: 4, id: 'foraDeOrdem' },
  { t: '4', de: 3, id: 'adiado' },
]

function SemGarantias({ cena }: { cena: CenaProps }) {
  return (
    <group>
      <Rotulo pos={[0, 4.75, 0]} escuro>
        Enviados em ordem: 1 a 5
      </Rotulo>
      {TOPO.map((x, i) => (
        <Tijolo key={i} pos={[x, Y_TOPO, 0]} tam={[1.2, 0.6, 0.3]} cor={COR_PACOTE} claro texto={String(i + 1)} />
      ))}
      {CHEGADAS.map((c, k) => (
        <group key={k}>
          <Seta
            de={[TOPO[c.de], Y_TOPO - 0.35, 0]}
            para={[BAIXO[k], Y_BAIXO + 0.4, 0]}
            cor={c.t === '✗' ? '#b8bec6' : '#1d2733'}
            raio={0.02}
          />
          <Tijolo pos={[BAIXO[k], Y_BAIXO, 0]} tam={[1.2, 0.6, 0.3]} cor={COR_PACOTE} claro apagado={c.t === '✗'} texto={c.t} />
          {c.id && <Alvo id={c.id} pos={[BAIXO[k] + 0.5, Y_BAIXO + 0.3, 0.3]} cena={cena} />}
        </group>
      ))}
      <Rotulo pos={[0, 0.65, 0]} escuro>
        Chegaram, na ordem de chegada
      </Rotulo>
    </group>
  )
}

export function CenaIpv4(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'protocolos'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'protocolos' && <Protocolos />}
      {modo === 'entrega' && <Entrega />}
      {modo === 'semGarantias' && <SemGarantias cena={cena} />}
      {modo === 'quadro' && (
        <>
          <Encaixe
            y={2.6}
            camadas={[
              { nome: 'QUADRO ETHERNET', cab: 'Cabeçalho do Quadro', cor: '#fbf6c8', fim: 'FCS' },
              { nome: 'PACOTE IPv4', cab: 'Cabeçalho do Pacote', cor: '#f4c1c6' },
            ]}
            dados="Dados com a carga útil do PACOTE"
          />
          <Rotulo pos={[0, 0.7, 0]} escuro>
            O pacote inteiro é a carga útil do quadro
          </Rotulo>
        </>
      )}
    </>
  )
}
