import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import { Janela, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Fileira, LARANJA, RegraBits, Tijolo, type Cel } from './comum'

// Fase 7.6 — UDP (Aula 06 p. 11–12): datagramas sem handshake e sem ACK, onde o UDP é usado
// e o cabeçalho fixo de 8 bytes.

const A: V3 = [-5, 0.14, 0]
const B: V3 = [5, 0.14, 0]
const MEIO: V3 = [0, 0.14, 0]

function Datagramas() {
  const P = 13
  const envio = (atraso: number, parar: boolean, cor: string, numero: number) => (
    <Percurso pontos={parar ? [A, MEIO] : [A, B]} velocidade={4} atraso={atraso} periodo={P} key={numero}>
      <group scale={0.55}>
        <Dado tipo="mensagem" cor={cor} sombra={false} />
      </group>
    </Percurso>
  )
  return (
    <group>
      <Computador pos={[A[0], 0.12, 0]} escala={0.85} />
      <Servidor pos={[B[0], 0.12, 0]} escala={0.85} />
      <Ligacao pontos={[[A[0] + 0.7, 0.14, 0], [B[0] - 0.7, 0.14, 0]]} cor="#2f5fa0" raio={0.05} />
      {envio(0, false, '#3aa0e6', 1)}
      {envio(2.7, true, '#ef6f6c', 2)}
      {envio(5.4, false, '#3aa0e6', 3)}
      {envio(8.1, false, '#3aa0e6', 4)}
      <Janela periodo={P} de={3.6} ate={P}>
        <Rotulo pos={[0, 1.0, 0]} escuro>
          ✗ datagrama perdido: ninguém reenvia
        </Rotulo>
      </Janela>
      <Rotulo pos={[-5, 1.8, 0]} escuro>
        Origem
      </Rotulo>
      <Rotulo pos={[5, 2.3, 0]} escuro>
        Destino
      </Rotulo>
      <Rotulo pos={[0, 3.6, 0]} escuro>
        Sem handshake · sem conexão
      </Rotulo>
      <Rotulo pos={[0, 2.9, 0]} classe="mini">
        os datagramas saem direto, um atrás do outro
      </Rotulo>
      <Rotulo pos={[0, -0.1, 1.4]} classe="mini">
        ✗ nenhum ACK volta
      </Rotulo>
    </group>
  )
}

function Usos() {
  const itens: { t: 'mensagem' | 'voz' | 'documento'; nome: string; desc: string; x: number }[] = [
    { t: 'mensagem', nome: 'DNS', desc: 'consultas de nomes', x: -3.8 },
    { t: 'voz', nome: 'VoIP', desc: 'chamadas de voz', x: 0 },
    { t: 'documento', nome: 'NFS', desc: 'arquivos em rede', x: 3.8 },
  ]
  return (
    <group>
      {itens.map((i) => (
        <group key={i.nome}>
          <group position={[i.x, 3.4, 0.2]} scale={2.2}>
            <Dado tipo={i.t} cor="#3e6480" sombra={false} altura={0} />
          </group>
          <Tijolo pos={[i.x, 2.1, 0]} tam={[2.4, 0.7, 0.3]} cor="#34506a" claro texto={i.nome} />
          <Rotulo pos={[i.x, 1.55, 0]} classe="mini">
            {i.desc}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[-2.6, 0.7, 0.2]} classe="cartao">
        <b>Cabeçalho fixo de 8 bytes</b>Só portas, tamanho e verificação
      </Rotulo>
      <Rotulo pos={[2.6, 0.7, 0.2]} classe="cartao">
        <b>Baixo overhead</b>Usado quando se quer melhores tempos de resposta
      </Rotulo>
    </group>
  )
}

function CabecalhoUdp({ semNomes }: { semNomes: boolean }) {
  const nome = (t: string) => (semNomes ? '?' : t)
  const campo = (t: string): Cel => ({ t: nome(t), f: 16, cor: LARANJA, claro: true })
  const X = -0.7
  return (
    <group>
      <RegraBits y={4.55} x={X} largura={9} />
      <Fileira y={3.85} x={X} largura={9} h={0.7} itens={[campo('Porta de Origem'), campo('Porta de Destino')]} />
      <Fileira y={3.05} x={X} largura={9} h={0.7} itens={[campo('Comprimento'), campo('Checksum')]} />
      <Fileira y={2.2} x={X} largura={9} h={0.9} itens={[{ t: 'Dados com a carga útil do Datagrama', f: 32, cor: '#ffffff' }]} />
      <Caixa tam={[0.06, 1.5, 0.06]} pos={[4.0, 3.45, 0]} cor="#1d2733" sombra={false} />
      <Rotulo pos={[4.8, 3.45, 0]} escuro>
        8 bytes
      </Rotulo>
      <Rotulo pos={[X, 1.35, 0]} classe="mini">
        4 campos de 16 bits
      </Rotulo>
    </group>
  )
}

export function CenaUdp(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'datagramas'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'datagramas' && <Datagramas />}
      {modo === 'usos' && <Usos />}
      {modo === 'cabecalho' && <CabecalhoUdp semNomes={!!cena.estado.semNomes} />}
    </>
  )
}
