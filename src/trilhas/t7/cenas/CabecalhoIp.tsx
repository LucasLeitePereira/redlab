import { Line } from '@react-three/drei'
import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Dado } from '../../../three/dados'
import { Computador, Roteador } from '../../../three/modelos'
import { arco, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Fileira, LARANJA, RegraBits, type Cel } from './comum'

// Fase 7.2 — cabeçalho do pacote IPv4 (Aula 06 p. 4–5): a tabela de 32 bits, o TTL passando
// pelos roteadores e os dois exemplos preenchidos.

const campo = (t: string, f: number, id?: string): Cel => (id ? { t, f, id, cor: LARANJA, claro: true } : { t, f })

function Cabecalho({ cena }: { cena: CenaProps }) {
  const y = (i: number) => 4.6 - i * 0.72
  return (
    <group>
      <RegraBits y={5.25} />
      <Fileira y={y(0)} cena={cena} itens={[campo('Versão', 4, 'versao'), campo('HLEN', 4), campo('Tipo de Serviço', 8), campo('Tamanho Total', 16)]} />
      <Fileira y={y(1)} cena={cena} itens={[campo('Identificação', 16), campo('FLAGS', 3), campo('OFFSET do fragmento', 13)]} />
      <Fileira y={y(2)} cena={cena} itens={[campo('Tempo de Vida', 8, 'ttl'), campo('Protocolo', 8, 'protocolo'), campo('Cheksum do cabeçalho', 16)]} />
      <Fileira y={y(3)} cena={cena} itens={[campo('Endereço IPv4 de Origem', 32, 'origem')]} />
      <Fileira y={y(4)} cena={cena} itens={[campo('Endereço IPv4 de Destino', 32, 'destino')]} />
      <Fileira y={y(5)} cena={cena} itens={[{ t: 'Dados com a carga útil do PACOTE', f: 32, cor: '#ffffff' }]} />
      <TabelaProtocolos y={0.55} />
    </group>
  )
}

/** A tabelinha do slide: 1 : ICMP · 6 : TCP · 17 : UDP. */
function TabelaProtocolos({ y }: { y: number }) {
  return (
    <group>
      <Rotulo pos={[-3.9, y, 0]} classe="mini">
        <b>Protocolo</b>
      </Rotulo>
      <Fileira y={y} x={0.4} largura={6.6} h={0.5} itens={[{ t: '1 : ICMP', f: 1 }, { t: '6 : TCP', f: 1 }, { t: '17 : UDP', f: 1 }]} />
    </group>
  )
}

const HOST: V3 = [-5.8, 0.14, 0]
const FIM: V3 = [5.8, 0.14, 0]
const RA: V3[] = [[-2.9, 0.14, -1.7], [0, 0.14, -1.7], [2.9, 0.14, -1.7]]
const RB: V3[] = [[-2.9, 0.14, 1.9], [0, 0.14, 1.9], [2.9, 0.14, 1.9]]

function Ttl() {
  const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0.95, (a[2] + b[2]) / 2]
  const fila = (rs: V3[], pontas: V3[], cor: string) => (
    <group>
      {rs.map((p, i) => (
        <Roteador key={i} pos={[p[0], 0.12, p[2]]} escala={0.8} />
      ))}
      {pontas.slice(0, -1).map((a, i) => (
        <Ligacao key={i} pontos={[a, pontas[i + 1]]} cor={cor} raio={0.05} />
      ))}
    </group>
  )
  const ttlA = ['127', '126', '125', '124']
  const ttlB = ['3', '2', '1']
  const pontasA = [HOST, ...RA, FIM]
  const pontasB = [HOST, ...RB]
  return (
    <group>
      <Computador pos={[HOST[0], 0.12, 0]} escala={0.8} />
      <Computador pos={[FIM[0], 0.12, 0]} escala={0.8} rot={[0, -0.3, 0]} />
      {fila(RA, pontasA, '#2f5fa0')}
      {fila(RB, pontasB, '#8a5a3b')}
      {pontasA.slice(0, -1).map((a, i) => (
        <Rotulo key={i} pos={meio(a, pontasA[i + 1])} classe="bits">
          TTL {ttlA[i]}
        </Rotulo>
      ))}
      {pontasB.slice(0, -1).map((a, i) => (
        <Rotulo key={i} pos={meio(a, pontasB[i + 1])} classe="bits">
          TTL {ttlB[i]}
        </Rotulo>
      ))}
      <Rotulo pos={[RB[2][0], 1.4, RB[2][2]]} escuro>
        TTL 0: pacote descartado ✗
      </Rotulo>
      <Rotulo pos={[0, 2.9, -1.7]} escuro>
        Chega ao destino com TTL 124
      </Rotulo>
      <Percurso pontos={pontasA} velocidade={3} espera={0.3} periodo={12}>
        <group scale={0.6}>
          <Dado tipo="mensagem" cor="#3aa0e6" sombra={false} />
        </group>
      </Percurso>
      <Percurso pontos={pontasB} velocidade={3} espera={0.3} periodo={12} atraso={0.5}>
        <group scale={0.6}>
          <Dado tipo="mensagem" cor="#ef6f6c" sombra={false} />
        </group>
      </Percurso>
    </group>
  )
}

function Exemplo({ numero, semRotulos }: { numero: number; semRotulos: boolean }) {
  const protocolo = numero === 2 ? '1' : '6'
  const destino = numero === 2 ? '255.255.255.255' : '172.32.1.100'
  const larg = [1, 1.4, 1.1, 2.9, 2.9, 1.7]
  const textos = ['4', '127', protocolo, '192.168.10.1', destino, 'Dados']
  const rotulos = ['Versão', 'TTL', 'Protocolo', 'IP Origem', 'IP Destino']
  const total = larg.reduce((s, v) => s + v, 0)
  let x = -total / 2
  const xs = larg.map((w) => {
    const c = x + w / 2
    x += w
    return c
  })
  const Y = 2.7
  return (
    <group>
      {textos.map((t, i) => (
        <group key={i}>
          <Caixa tam={[larg[i] - 0.08, 1.0, 0.3]} pos={[xs[i], Y, 0]} cor={i === 5 ? '#ffffff' : '#e3e9f0'} />
          <Rotulo pos={[xs[i], Y, 0.18]} classe="bits grande">
            {t}
          </Rotulo>
          {!semRotulos && i < 5 && (
            <Rotulo pos={[xs[i], Y - 0.85, 0]} classe="mini">
              {rotulos[i]}
            </Rotulo>
          )}
        </group>
      ))}
      <Line points={arco([xs[2], Y + 0.52, 0.2], [xs[5], Y + 0.52, 0.2], 0.9, 12)} color={LARANJA} lineWidth={2.5} />
      <Rotulo pos={[(xs[2] + xs[5]) / 2, Y + 1.55, 0.2]} classe="mini">
        o {protocolo} diz que protocolo vai nos Dados
      </Rotulo>
      <TabelaProtocolos y={0.7} />
    </group>
  )
}

export function CenaCabecalhoIp(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'cabecalho'
  const numero = Number(cena.estado.exemplo ?? 1)
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'cabecalho' && <Cabecalho cena={cena} />}
      {modo === 'ttl' && <Ttl />}
      {modo === 'exemplo' && <Exemplo numero={numero} semRotulos={!!cena.estado.semRotulos} />}
    </>
  )
}

