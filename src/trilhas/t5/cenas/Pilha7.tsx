import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Alvo, Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import { Percurso, Pulsos, useCurva } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Bloco, CINZA_CAMADA, LinhaDePares, OSI, Seta, type IdCamada } from './comum'

// Fases 5.3, 5.4 e 5.6 — o RM-OSI (Aula 05 p1, p. 4–9). Dois "prédios" de 7 andares, um por
// host, com as cores do slide. Nos modos de uma camada, ela fica colorida e as outras cinza
// (como os slides p. 5–9), e uma pequena animação mostra o exemplo do slide.

const XA = -3.2
const XB = 3.2
const TAM: V3 = [2.3, 0.48, 1.4]
const PASSO = 0.54
const FRENTE = TAM[2] / 2 + 0.02
/** Altura do centro da camada de número `n` (1 = Física, embaixo). */
const y = (n: number) => 0.38 + (n - 1) * PASSO

const FOCO: Record<string, IdCamada[]> = {
  aplicacao: ['aplicacao'],
  apresentacao: ['apresentacao'],
  sessao: ['sessao'],
  superiores: ['aplicacao', 'apresentacao', 'sessao'],
  enlace: ['enlace'],
  fisica: ['fisica'],
}

function Torre({ x, foco, numeros }: { x: number; foco?: IdCamada[]; numeros: boolean }) {
  return (
    <group>
      <Lote pos={[x, 0, 0]} tam={[2.9, 2]} />
      {OSI.map((c) => {
        const ativa = !foco || foco.includes(c.id)
        return (
          <group key={c.id}>
            <Bloco pos={[x, y(c.n), 0]} tam={TAM} cor={ativa ? c.cor : CINZA_CAMADA} />
            <Rotulo pos={[x, y(c.n), FRENTE]} classe={`camada-osi ${ativa ? '' : 'cinza'}`}>
              {numeros && `${c.n}ª `}
              {c.nome}
            </Rotulo>
          </group>
        )
      })}
    </group>
  )
}

/** Exemplo da camada de Sessão: o download cai no meio e continua de onde parou. */
function BarraDownload({ pos }: { pos: V3 }) {
  const cheio = useRef<HTMLDivElement>(null)
  const legenda = useRef<HTMLDivElement>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 9
    let p = 100
    let texto = '✓ download completo'
    let caiu = false
    if (t < 3) {
      p = (t / 3) * 60
      texto = `baixando… ${Math.round(p)}%`
    } else if (t < 5) {
      p = 60
      texto = '⚡ a conexão caiu em 60%'
      caiu = true
    } else if (t < 7) {
      p = 60 + ((t - 5) / 2) * 40
      texto = `↻ continua de 60%… ${Math.round(p)}%`
    }
    if (cheio.current) {
      cheio.current.style.width = `${p}%`
      cheio.current.style.background = caiu ? 'var(--vermelho)' : 'var(--verde)'
    }
    if (legenda.current) legenda.current.textContent = texto
  })
  return (
    <Rotulo pos={pos} classe="barra-download">
      <div className="legenda" ref={legenda} />
      <div className="trilho">
        <div className="cheio" ref={cheio} />
      </div>
    </Rotulo>
  )
}

/** Caminho da mensagem: desce as 7 camadas do Host A, atravessa o meio físico e sobe no B. */
const VIAGEM: V3[] = [
  ...OSI.map((c): V3 => [XA, y(c.n), FRENTE + 0.3]),
  [XA + 1.2, 0.3, 1.2],
  [XB - 1.2, 0.3, 1.2],
  ...[...OSI].reverse().map((c): V3 => [XB, y(c.n), FRENTE + 0.3]),
]

const CABO: V3[] = [
  [XA + 1.1, 0.16, 0.9],
  [XA + 1.3, 0.16, 1.2],
  [XB - 1.3, 0.16, 1.2],
  [XB - 1.1, 0.16, 0.9],
]

function Exemplo({ modo }: { modo: string }) {
  const cabo = useCurva(CABO)
  const par = (n: number): [V3, V3] => [
    [XA + TAM[0] / 2 + 0.1, y(n), 0.3],
    [XB - TAM[0] / 2 - 0.1, y(n), 0.3],
  ]

  if (modo === 'aplicacao') {
    const [a, b] = par(7)
    return (
      <>
        <LinhaDePares de={a} para={b} cor={OSI[0].cor} />
        <Percurso pontos={[a, b]} velocidade={2} periodo={5.6}>
          <Dado tipo="mensagem" cor="#ef6f6c" sombra={false} />
        </Percurso>
        <Percurso pontos={[b, a]} velocidade={2} atraso={2.8} periodo={5.6}>
          <Dado tipo="documento" cor="#3aa0e6" sombra={false} />
        </Percurso>
        <Rotulo pos={[XA - 2.35, y(7), 0.3]}>🌐 navegador</Rotulo>
        <Rotulo pos={[XB + 2.6, y(7), 0.3]}>servidor de páginas WEB</Rotulo>
      </>
    )
  }
  if (modo === 'apresentacao') {
    const [a, b] = par(6)
    return (
      <>
        <LinhaDePares de={a} para={b} cor={OSI[1].cor} />
        <Percurso pontos={[a, b]} velocidade={1.6} periodo={4.2}>
          <Dado tipo="documento" cor="#7458c4" sombra={false} />
          <Rotulo pos={[0, 0.85, 0]} classe="bits">
            📦 🔒
          </Rotulo>
        </Percurso>
        <Rotulo pos={[XA - 2.6, y(6), 0.3]}>
          comprime e criptografa<small>📦 🔒</small>
        </Rotulo>
        <Rotulo pos={[XB + 2.6, y(6), 0.3]}>volta ao formato original</Rotulo>
      </>
    )
  }
  if (modo === 'sessao') {
    const [a, b] = par(5)
    return (
      <>
        <LinhaDePares de={a} para={b} cor={OSI[2].cor} />
        <BarraDownload pos={[0, y(5) + 0.55, 0.3]} />
      </>
    )
  }
  if (modo === 'enlace') {
    const [a, b] = par(2)
    return (
      <>
        <LinhaDePares de={a} para={b} cor={OSI[5].cor} />
        {[0, 1.7, 3.4].map((atraso) => (
          <Percurso key={atraso} pontos={[a, b]} velocidade={2.4} atraso={atraso} periodo={6}>
            <group scale={0.7}>
              <Dado tipo="mensagem" cor="#c48a14" sombra={false} />
            </group>
          </Percurso>
        ))}
        <Rotulo pos={[0, y(2) + 0.62, 0.3]} classe="bits">
          controle de fluxo: um por vez, no ritmo do receptor
        </Rotulo>
        <Rotulo pos={[XA, 0.1, 1.95]}>
          🐇 transmissor rápido<small>MAC ba:16:3e:f4:a0:e5</small>
        </Rotulo>
        <Rotulo pos={[XB, 0.1, 1.95]}>
          🐢 receptor lento<small>MAC ba:16:3e:f4:a0:e9</small>
        </Rotulo>
      </>
    )
  }
  if (modo === 'fisica') {
    return (
      <>
        <Pulsos curva={cabo} cor="#ffd23f" quantidade={6} duracao={2.2} />
        <Percurso pontos={[CABO[1], CABO[2]]} velocidade={1.8} periodo={4.4}>
          <Rotulo pos={[0, 0.45, 0]} classe="bits">
            1 0 1 1 0 0 1 0
          </Rotulo>
        </Percurso>
        <Rotulo pos={[0, 0.3, 2.1]} escuro>
          sinais (bits) · voltagem · pinos do conector
        </Rotulo>
      </>
    )
  }
  if (modo === 'viagem') {
    return (
      <>
        {OSI.filter((c) => c.n > 1).map((c) => {
          const [a, b] = par(c.n)
          return <LinhaDePares key={c.id} de={a} para={b} cor="#7a8796" />
        })}
        <Percurso pontos={VIAGEM} velocidade={2.4} espera={0.3}>
          <group scale={0.7}>
            <Dado tipo="mensagem" sombra={false} />
          </group>
        </Percurso>
      </>
    )
  }
  if (modo === 'servico') {
    return (
      <>
        {[XA - TAM[0] / 2 - 0.3, XB + TAM[0] / 2 + 0.3].map((x) =>
          OSI.filter((c) => c.n < 7).map((c) => (
            <Seta key={`${x}-${c.id}`} de={[x, y(c.n) - 0.05, 0.3]} para={[x, y(c.n + 1) + 0.05, 0.3]} cor="#e8cf2a" raio={0.06} />
          )),
        )}
        <Rotulo pos={[XA - 2.6, y(4), 0.3]}>
          serve à de cima<small>↑</small>
        </Rotulo>
      </>
    )
  }
  if (modo === 'plataformas') {
    return (
      <>
        <Rotulo pos={[XA - 2.7, 2.0, 0.9]}>
          computador<small>Windows</small>
        </Rotulo>
        <Rotulo pos={[XB + 2.5, 2.2, 0.3]}>
          servidor<small>Linux</small>
        </Rotulo>
        <Rotulo pos={[0, 2.4, 0]} classe="grande">
          mesmas 7 camadas
        </Rotulo>
      </>
    )
  }
  return null
}

export function CenaOsi(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'predio'
  const foco = FOCO[modo]
  const numeros = !!cena.estado.numeros

  return (
    <>
      <Ilha raio={8.8} />
      <Torre x={XA} foco={foco} numeros={numeros} />
      <Torre x={XB} foco={foco} numeros={numeros} />
      <Rotulo pos={[XA, 4.45, 0]} classe="grande" escuro>
        Host A
      </Rotulo>
      <Rotulo pos={[XB, 4.45, 0]} classe="grande" escuro>
        Host B
      </Rotulo>
      <Computador pos={[XA - 2.7, 0.12, 0.9]} rot={[0, 0.35, 0]} escala={0.8} />
      <Servidor pos={[XB + 2.5, 0.12, 0.3]} rot={[0, -0.35, 0]} />
      <Ligacao pontos={CABO} cor="#2f5fa0" raio={0.06} />

      <group key={modo}>
        <Exemplo modo={modo} />
      </group>

      {OSI.map((c) => (
        <Alvo key={c.id} id={`c${c.n}`} pos={[XA - TAM[0] / 2 - 0.35, y(c.n), 0.4]} cena={cena} />
      ))}
      {OSI.slice(0, 3).map((c) => (
        <Alvo key={c.id} id={c.id} pos={[XA - TAM[0] / 2 - 0.35, y(c.n), 0.4]} cena={cena} />
      ))}

      <Arvore pos={[-6.6, 0, -3.2]} escala={0.9} />
      <Arvore pos={[6.8, 0, -2.6]} />
    </>
  )
}
