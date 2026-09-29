import { Line } from '@react-three/drei'
import { Alvo, Cilindro, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Celular, PlacaDeRede, PontoDeAcesso } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { Tijolo } from './comum'

// Fase 6.6 — modelo com 5 camadas (Aula 05 p3, p. 3). A pilha do slide (cores do slide) e,
// ao lado, o que cada parte tem: as 3 de cima equivalem ao TCP/IP; o enlace tem ETHERNET,
// BLUETOOTH e WIFI; a física tem par-trançado (UTP), fibra ótica e cabo coaxial.

export const CINCO = [
  { id: 'fisica', nome: 'FÍSICA', cor: '#6b4a14' },
  { id: 'enlace', nome: 'ENLACE', cor: '#b8860b' },
  { id: 'rede', nome: 'REDE', cor: '#7a3514' },
  { id: 'transporte', nome: 'TRANSPORTE', cor: '#34506a' },
  { id: 'aplicacao', nome: 'APLICAÇÃO', cor: '#2f5a2c' },
]
const X = -3.0
const TAM: V3 = [2.6, 0.7, 1.6]
const yc = (i: number) => 0.45 + i * 0.78
const DIREITA = X + TAM[0] / 2 + 0.1

function Cabo({ pos, cor, raio, nucleo, brilho }: { pos: V3; cor: string; raio: number; nucleo?: string; brilho?: boolean }) {
  return (
    <group position={pos}>
      <Cilindro raio={raio} altura={1.5} rot={[0, 0, Math.PI / 2]} cor={cor} />
      {nucleo && <Cilindro raio={raio * 0.35} altura={0.2} pos={[0.82, 0, 0]} rot={[0, 0, Math.PI / 2]} cor={nucleo} emissivo={brilho ? nucleo : undefined} intensidade={1.4} />}
    </group>
  )
}

export function CenaCinco(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'pilha'
  const semNomes = !!cena.estado.semNomes
  const tudo = modo === 'tudo'
  const sup = modo === 'superiores' || tudo
  const enl = modo === 'enlace' || tudo
  const fis = modo === 'fisica' || tudo
  const foco = modo === 'superiores' ? ['aplicacao', 'transporte', 'rede'] : modo === 'enlace' ? ['enlace'] : modo === 'fisica' ? ['fisica'] : undefined

  return (
    <>
      <Ilha raio={8.4} />
      {CINCO.map((c, i) => (
        <Tijolo key={c.id} pos={[X, yc(i), 0]} tam={TAM} cor={c.cor} claro texto={semNomes ? '?' : c.nome} apagado={!!foco && !foco.includes(c.id)} />
      ))}

      {sup && (
        <>
          {/* chave das 3 camadas de cima */}
          <Line
            points={[[DIREITA, yc(4) + 0.33, 0.8], [DIREITA + 0.3, yc(4) + 0.33, 0.8], [DIREITA + 0.3, yc(2) - 0.33, 0.8], [DIREITA, yc(2) - 0.33, 0.8]]}
            color="#1d2733"
            lineWidth={2.5}
          />
          <Line points={[[DIREITA + 0.3, yc(3), 0.8], [DIREITA + 0.9, yc(3), 0.8]]} color="#1d2733" lineWidth={2.5} />
          {['HTTP', 'TCP', 'IP'].map((p, i) => (
            <Tijolo key={p} pos={[DIREITA + 1.8, yc(4 - i), 0.8]} tam={[1.0, 0.45, 0.2]} cor="#e3e8ee" texto={p} />
          ))}
          {modo === 'superiores' && (
            <Rotulo pos={[3.9, yc(3), 0.8]} classe="cartao">
              Os protocolos usados nas camadas de aplicação, transporte e redes são equivalentes ao TCP/IP.
            </Rotulo>
          )}
        </>
      )}

      {enl && (
        <>
          <Line points={[[DIREITA, yc(1), 0.6], [0.4, 0.9, -0.8]]} color="#1d2733" lineWidth={2} />
          <PlacaDeRede pos={[1.1, 0.1, -0.8]} escala={1.2} />
          <Celular pos={[2.8, 0.1, -0.8]} escala={1.1} />
          <PontoDeAcesso pos={[4.5, 0.1, -0.8]} />
          <Rotulo pos={[1.1, 1.25, -0.8]} classe="mini">
            ETHERNET
          </Rotulo>
          <Rotulo pos={[2.8, 1.25, -0.8]} classe="mini">
            BLUETOOTH
          </Rotulo>
          <Rotulo pos={[4.5, 1.25, -0.8]} classe="mini">
            WIFI
          </Rotulo>
          {modo === 'enlace' && (
            <Rotulo pos={[2.8, 2.6, -0.8]} classe="cartao">
              A camada de enlace possui os protocolos usados no controle de acesso ao meio (baixo nível), tais como o ETHERNET, o BLUETOOTH e o WIFI.
            </Rotulo>
          )}
        </>
      )}

      {fis && (
        <>
          <Line points={[[DIREITA, yc(0), 0.8], [0.3, 0.2, 2.4]]} color="#1d2733" lineWidth={2} />
          <Cabo pos={[1.2, 0.18, 2.5]} cor="#3b7fd0" raio={0.07} nucleo="#e8a33b" />
          <Cabo pos={[3.0, 0.18, 2.5]} cor="#f08a24" raio={0.045} nucleo="#fff2a8" brilho />
          <Cabo pos={[4.8, 0.2, 2.5]} cor="#22262b" raio={0.12} nucleo="#c87533" />
          <Rotulo pos={[1.2, 0.6, 2.5]} classe="mini">
            par-trançado (UTP)
          </Rotulo>
          <Rotulo pos={[3.0, 0.6, 2.5]} classe="mini">
            fibra ótica
          </Rotulo>
          <Rotulo pos={[4.8, 0.6, 2.5]} classe="mini">
            cabo coaxial
          </Rotulo>
          {modo === 'fisica' && (
            <Rotulo pos={[3.0, 1.6, 2.5]} classe="cartao">
              A camada física possui os padrões usados nos meios de transmissão, tais como o par-trançado (UTP), fibra ótica ou cabo coaxial.
            </Rotulo>
          )}
        </>
      )}

      <Alvo id="superiores" pos={[X - 1.75, yc(3), 0.9]} cena={cena} />
      <Alvo id="enlace" pos={[X - 1.75, yc(1), 0.9]} cena={cena} />
      <Alvo id="fisica" pos={[X - 1.75, yc(0), 0.9]} cena={cena} />
    </>
  )
}
