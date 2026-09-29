import { Line } from '@react-three/drei'
import { Alvo, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { PlacaDeRede, Roteador } from '../../../three/modelos'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Tijolo } from './comum'

// Fase 6.8 — exemplo de solicitação de serviço (Aula 05 p3, p. 5). O Google Chrome pede a
// página ao Apache: HTTP, TCP, IP e Ethernet de cada lado, placas de rede e o cabo. As linhas
// tracejadas são a conversa entre os pares (com o texto do slide). No modo "roteador" (Exemplo 2)
// há um roteador no meio, que só vai até a camada IP.

const XA = -4.7
const XB = 4.7
const T: V3 = [2.0, 0.55, 0.5]
const CAMADAS = [
  { id: 'http', nome: 'HTTP', y: 3.3, cor: '#2c4a22', claro: true },
  { id: 'tcp', nome: 'TCP', y: 2.5, cor: '#34506a', claro: true },
  { id: 'ip', nome: 'IP', y: 1.7, cor: '#7a3514', claro: true },
  { id: 'ethernet', nome: 'Ethernet', y: 0.9, cor: '#fbf6c8', claro: false },
]
const Y_APP = 4.3
const Y_PLACA = 0.35

/** O que os pares fazem em cada nível (texto do slide, Exemplo 1). */
const PARES: Record<string, string> = {
  app: 'Transferência dos Dados do Aplicativo',
  http: 'Transferência da Página WEB',
  tcp: 'Estabelecimento da Conexão · Detecção e Correção de Erros, etc.',
  ip: 'Endereçamento Lógico IP · Roteamento',
  ethernet: 'Endereçamento Físico MAC · Detecção de Erros, Controle de Fluxo, etc.',
}

function Tracejada({ de, ate, yy, texto, semNomes }: { de: number; ate: number; yy: number; texto?: string; semNomes: boolean }) {
  return (
    <>
      <Line points={[[de, yy, 0], [ate, yy, 0]]} color="#1d2733" lineWidth={1.8} dashed dashSize={0.16} gapSize={0.11} />
      {texto && !semNomes && (
        <Rotulo pos={[(de + ate) / 2, yy + 0.24, 0]} classe="mini">
          {texto}
        </Rotulo>
      )}
    </>
  )
}

function Pilha({ x, lado }: { x: number; lado: 'cliente' | 'servidor' }) {
  return (
    <group>
      <Rotulo pos={[x, Y_APP, 0]} classe="cartao">
        {lado === 'cliente' ? (
          <>
            <b>GOOGLE CHROME</b>Usuário acessa: <span style={{ color: '#2f6fb0' }}>www.google.com.br</span>
          </>
        ) : (
          <>
            <b>APACHE</b>Servidor HTTP <span style={{ color: '#2f6fb0' }}>www.google.com.br</span>
          </>
        )}
      </Rotulo>
      {CAMADAS.map((c) => (
        <Tijolo key={c.id} pos={[x, c.y, 0]} tam={T} cor={c.cor} claro={c.claro} texto={c.nome} />
      ))}
      <PlacaDeRede pos={[x, 0.05, Y_PLACA]} escala={1.3} />
    </group>
  )
}

const pelaPilha = (x: number, subindo: boolean): V3[] => {
  const ys = [Y_APP - 0.45, ...CAMADAS.map((c) => c.y), Y_PLACA + 0.2]
  return (subindo ? [...ys].reverse() : ys).map((yy): V3 => [x, yy, 0.45])
}

export function CenaSolicitacao(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'direto'
  const semNomes = !!cena.estado.semNomes
  const comRoteador = modo === 'roteador'
  const baixo = Y_PLACA + 0.2

  const caminho: V3[] = comRoteador
    ? [...pelaPilha(XA, false), [0, baixo, 0.45], [0, 1.7, 0.45], [0, baixo, 0.45], ...pelaPilha(XB, true)]
    : [...pelaPilha(XA, false), ...pelaPilha(XB, true)]

  return (
    <>
      <Ilha raio={8.6} />
      <Pilha x={XA} lado="cliente" />
      <Pilha x={XB} lado="servidor" />

      {comRoteador ? (
        <>
          <Ligacao pontos={[[XA + 0.5, 0.14, Y_PLACA], [-0.6, 0.14, 0.4]]} cor="#2f5fa0" raio={0.05} />
          <Ligacao pontos={[[0.6, 0.14, 0.4], [XB - 0.5, 0.14, Y_PLACA]]} cor="#2f5fa0" raio={0.05} />
          <Roteador pos={[0, 0.12, 0.4]} escala={0.9} />
          <Tijolo pos={[0, 1.7, 0]} tam={T} cor="#7a3514" claro texto="IP" />
          <Tijolo pos={[0, 0.9, 0]} tam={T} cor="#fbf6c8" texto="" />
          <Rotulo pos={[0, 2.3, 0]} escuro>
            ROTEADOR
          </Rotulo>
          <Tracejada de={XA + 1.1} ate={XB - 1.1} yy={Y_APP - 0.05} texto="Transferência dos Dados do Aplicativo" semNomes={semNomes} />
          <Tracejada de={XA + 1.1} ate={XB - 1.1} yy={3.3} texto="Transferência de páginas WEB" semNomes={semNomes} />
          <Tracejada de={XA + 1.1} ate={XB - 1.1} yy={2.5} texto="Estabelece a conexão" semNomes={semNomes} />
          <Tracejada de={XA + 1.1} ate={-1.1} yy={1.7} texto="Endereçamento" semNomes={semNomes} />
          <Tracejada de={1.1} ate={XB - 1.1} yy={1.7} texto="Endereçamento" semNomes={semNomes} />
        </>
      ) : (
        <>
          <Ligacao pontos={[[XA + 0.5, 0.14, Y_PLACA], [XB - 0.5, 0.14, Y_PLACA]]} cor="#2f5fa0" raio={0.05} />
          <Tracejada de={XA + 1.1} ate={XB - 1.1} yy={Y_APP - 0.05} texto={PARES.app} semNomes={semNomes} />
          {CAMADAS.map((c) => (
            <Tracejada key={c.id} de={XA + 1.1} ate={XB - 1.1} yy={c.y} texto={PARES[c.id]} semNomes={semNomes} />
          ))}
        </>
      )}

      <Percurso pontos={caminho} velocidade={2.6} espera={0.3}>
        <group scale={0.6}>
          <Dado tipo="mensagem" sombra={false} />
        </group>
      </Percurso>

      {CAMADAS.map((c) => (
        <Alvo key={c.id} id={c.id} pos={[XA - 1.35, c.y, 0.3]} cena={cena} />
      ))}
    </>
  )
}
