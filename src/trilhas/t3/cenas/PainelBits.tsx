import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { Caixa, Rotulo, type V3 } from '../../../three/base'
import { caixaUnitaria, material } from '../../../three/recursos'

// Painel de bits: cada linha é um endereço de 32 bits, cada bit uma teclinha que fica
// alta (1), baixa (0) ou amarela ("H", bit da parte do host ainda sem valor, como no
// método do professor). Linhas com o mesmo id animam de um valor para o outro.

export type Celula = 0 | 1 | 'H'
export type Tom = 'rede' | 'host' | 'neutro' | 'mascara' | 'resultado'

/** [cor do bit 1, cor do bit 0] */
const TONS: Record<Tom, [string, string]> = {
  rede: ['#9c2b27', '#e7bcb9'],
  host: ['#27358f', '#bcc3ea'],
  neutro: ['#3b6fb5', '#c9d6e6'],
  mascara: ['#4b5563', '#d7dce2'],
  resultado: ['#23915f', '#bfe3cf'],
}
const COR_H = '#e9a620'
const ALTURA = { 1: 0.42, 0: 0.07, H: 0.24 }

export const PASSO_BIT = 0.27
const VAO_OCTETO = 0.3
const LARGURA_BIT = 0.21
export const ESPACO_LINHA = 1.25

/** Posição x do bit `i` numa linha de `n` bits (com um vão entre os octetos). */
export function xDoBit(i: number, n = 32, passo = PASSO_BIT) {
  const octetos = Math.ceil(n / 8)
  return (i - (n - 1) / 2) * passo + (Math.floor(i / 8) - (octetos - 1) / 2) * VAO_OCTETO * (passo / PASSO_BIT)
}

export type Linha = {
  id: string
  rotulo: string
  bits: Celula[]
  /** 'partes' pinta os bits antes do corte com o tom da rede e os depois com o do host. */
  tom?: Tom | 'partes'
  /** Texto à direita da linha (normalmente o endereço em decimal). */
  direita?: string
  /**
   * Rótulo embaixo de cada octeto: binário (padrão), decimal ou nada. 'misto' é o jeito
   * do professor: decimal nos octetos inteiros da parte rede, binário a partir do corte.
   */
  octetos?: 'bin' | 'dec' | 'misto' | 'nenhum'
  /** Segundos até a linha aparecer (as linhas surgem uma depois da outra). */
  atraso?: number
  /** Linha grossa embaixo (o "resultado" das contas no caderno). */
  traco?: boolean
  onBit?: (i: number) => void
}

function corDoBit(b: Celula, i: number, tom: Linha['tom'], corte: number | undefined) {
  if (b === 'H') return COR_H
  const t: Tom = tom === 'partes' ? (corte !== undefined && i < corte ? 'rede' : 'host') : tom ?? 'neutro'
  return TONS[t][b === 1 ? 0 : 1]
}

function textoOcteto(bits: Celula[], o: number, modo: Linha['octetos'], corte: number | undefined) {
  const fatia = bits.slice(o * 8, o * 8 + 8)
  if (modo === 'dec' || (modo === 'misto' && corte !== undefined && (o + 1) * 8 <= corte)) return fatia.includes('H') ? '?' : String(parseInt(fatia.join(''), 2))
  return fatia.join('')
}

function LinhaDeBits({ linha, z, corte, passo }: { linha: Linha; z: number; corte?: number; passo: number }) {
  const n = linha.bits.length
  const refs = useRef<(Mesh | null)[]>([])
  const inicio = useRef<number | null>(null)

  useFrame(({ clock }, dt) => {
    if (inicio.current === null) inicio.current = clock.elapsedTime
    const visivel = clock.elapsedTime - inicio.current >= (linha.atraso ?? 0)
    const k = Math.min(1, dt * 9)
    refs.current.forEach((m, i) => {
      if (!m) return
      const alvo = visivel ? ALTURA[linha.bits[i]] : 0.001
      const h = m.scale.y + (alvo - m.scale.y) * k
      m.scale.y = h
      m.position.y = 0.1 + h / 2
    })
  })

  const largura = xDoBit(n - 1, n, passo) - xDoBit(0, n, passo) + passo * 1.6
  const esquerda = xDoBit(0, n, passo) - passo * 0.8
  const direita = -esquerda
  const escala = passo / PASSO_BIT
  const mostrarOctetos = (linha.octetos ?? 'bin') !== 'nenhum'

  return (
    <group position={[0, 0, z]}>
      {/* base escura da linha */}
      <Caixa tam={[largura, 0.1, 0.62 * escala]} pos={[0, 0.05, 0]} cor="#2b3440" sombra={false} />
      {linha.bits.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => { refs.current[i] = m }}
          geometry={caixaUnitaria}
          material={material({ cor: corDoBit(b, i, linha.tom, corte) })}
          position={[xDoBit(i, n, passo), 0.1, 0]}
          scale={[LARGURA_BIT * escala, 0.001, 0.42 * escala]}
          onClick={linha.onBit ? (e) => { e.stopPropagation(); linha.onBit!(i) } : undefined}
          onPointerOver={linha.onBit ? () => { document.body.style.cursor = 'pointer' } : undefined}
          onPointerOut={linha.onBit ? () => { document.body.style.cursor = '' } : undefined}
        />
      ))}
      {linha.traco && <Caixa tam={[largura, 0.04, 0.05]} pos={[0, 0.03, 0.62 * escala]} cor="#1d2733" sombra={false} />}
      <Rotulo pos={[esquerda - 0.15, 0.25, 0]} classe="esq" escuro>{linha.rotulo}</Rotulo>
      {linha.direita && <Rotulo pos={[direita + 0.15, 0.25, 0]} classe="dir bits">{linha.direita}</Rotulo>}
      {mostrarOctetos &&
        Array.from({ length: Math.ceil(n / 8) }, (_, o) => (
          <Rotulo key={o} pos={[(xDoBit(o * 8, n, passo) + xDoBit(Math.min(o * 8 + 7, n - 1), n, passo)) / 2, 0.1, 0.5 * escala]} classe="bits">
            {textoOcteto(linha.bits, o, linha.octetos, corte)}
          </Rotulo>
        ))}
    </group>
  )
}

/**
 * Painel com várias linhas de bits. `corte` = tamanho do prefixo: desenha a divisa
 * rede | host (e os títulos "Parte Rede"/"Parte Host" com `partes`).
 */
export function PainelBits({
  linhas,
  corte,
  partes,
  destaque,
  pos = [0, 0, 0],
  passo = PASSO_BIT,
}: {
  linhas: Linha[]
  corte?: number
  partes?: boolean
  /** Octeto (0–3) a destacar com uma faixa amarela: o "octeto interessante" das contas. */
  destaque?: number
  pos?: V3
  passo?: number
}) {
  const z = (k: number) => (k - (linhas.length - 1) / 2) * ESPACO_LINHA
  const topo = z(0) - 0.75
  const fundo = z(linhas.length - 1) + 0.85
  const xCorte = corte !== undefined && corte > 0 && corte < 32 ? (xDoBit(corte - 1, 32, passo) + xDoBit(corte, 32, passo)) / 2 : null
  const meio = (a: number, b: number) => (xDoBit(a, 32, passo) + xDoBit(b, 32, passo)) / 2
  return (
    <group position={pos}>
      {destaque !== undefined && (
        <Caixa
          tam={[xDoBit(destaque * 8 + 7) - xDoBit(destaque * 8) + 0.4, 0.02, fundo - topo]}
          pos={[meio(destaque * 8, destaque * 8 + 7), 0.01, (topo + fundo) / 2]}
          cor="#f7d67a"
          sombra={false}
        />
      )}
      {linhas.map((l, k) => (
        <LinhaDeBits key={l.id} linha={l} z={z(k)} corte={corte} passo={passo} />
      ))}
      {xCorte !== null && (
        <>
          {Array.from({ length: Math.ceil((fundo - topo) / 0.3) }, (_, i) => (
            <Caixa key={i} tam={[0.05, 0.62, 0.16]} pos={[xCorte, 0.31, topo + 0.1 + i * 0.3]} cor={COR_H} emissivo={COR_H} intensidade={0.4} sombra={false} />
          ))}
          <Rotulo pos={[xCorte, 0.7, topo - 0.25]} classe="bits">/{corte}</Rotulo>
        </>
      )}
      {partes && corte !== undefined && (
        <>
          <Rotulo pos={[meio(0, corte - 1), 0.4, topo - 0.35]}>
            <span style={{ color: TONS.rede[0] }}>Parte Rede</span>
          </Rotulo>
          {corte < 32 && (
            <Rotulo pos={[meio(corte, 31), 0.4, topo - 0.35]}>
              <span style={{ color: TONS.host[0] }}>Parte Host</span>
            </Rotulo>
          )}
        </>
      )}
    </group>
  )
}

/** Converte "11000000 10101000 …" ou um número em células. */
export const celulas = (bits: (0 | 1)[] | string): Celula[] =>
  typeof bits === 'string' ? bits.replace(/[^01H]/g, '').split('').map((c) => (c === 'H' ? 'H' : (Number(c) as 0 | 1))) : bits

/** Bits da rede preservados e os do host trocados por `valor` (H, 0 ou 1). */
export const trocarHost = (bits: (0 | 1)[], prefixo: number, valor: Celula): Celula[] =>
  bits.map((b, i) => (i < prefixo ? b : valor))
