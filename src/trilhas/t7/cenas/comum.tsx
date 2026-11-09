import type { ReactNode } from 'react'
import { Alvo, Caixa, Rotulo, type V3 } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Tijolo } from '../../t6/cenas/comum'

// Peças comuns das cenas da Trilha 7: tabelas de bits (cabeçalhos IP/TCP/UDP), o encaixe
// quadro > pacote > segmento e etiquetas de duas linhas. Tijolo, Seta e Bloco vêm das trilhas 5 e 6.

export { Tijolo, Seta, LinhaDePares } from '../../t6/cenas/comum'
export { Bloco } from '../../t5/cenas/comum'

export const LARANJA = '#c0562b'
export const NEUTRO = '#e3e9f0'
export const ESCURO = '#1d2733'
export const VERDE = '#2e8b3d'
export const VERMELHO = '#ef6f6c'
export const AZUL = '#3aa0e6'
export const AMARELO = '#f7d64a'

/** Uma célula de tabela: `f` é a fração da largura (ex.: bits do campo). */
export type Cel = { t: string; f: number; cor?: string; claro?: boolean; id?: string }

/** Uma linha de células lado a lado, centrada em `x`; células com `id` ganham o Alvo clicável. */
export function Fileira({
  y,
  itens,
  cena,
  x = 0,
  largura = 10,
  h = 0.58,
  z = 0,
  pequeno = true,
}: {
  y: number
  itens: Cel[]
  cena?: CenaProps
  x?: number
  largura?: number
  h?: number
  z?: number
  pequeno?: boolean
}) {
  const total = itens.reduce((s, c) => s + c.f, 0)
  let cursor = x - largura / 2
  return (
    <group>
      {itens.map((c, i) => {
        const w = (c.f / total) * largura
        const cx = cursor + w / 2
        cursor += w
        return (
          <group key={i}>
            <Tijolo pos={[cx, y, z]} tam={[w - 0.08, h, 0.3]} cor={c.cor ?? NEUTRO} claro={c.claro} texto={c.t} pequeno={pequeno} />
            {c.id && cena && <Alvo id={c.id} pos={[cx + w / 2 - 0.2, y + h / 2 - 0.02, z + 0.3]} cena={cena} />}
          </group>
        )
      })}
    </group>
  )
}

/** Régua "0 … 31" que fica em cima das tabelas de bits. */
export function RegraBits({ y, x = 0, largura = 10, fim = '31' }: { y: number; x?: number; largura?: number; fim?: string }) {
  return (
    <group>
      <Caixa tam={[largura, 0.03, 0.03]} pos={[x, y - 0.14, 0]} cor="#8b97a4" sombra={false} />
      <Rotulo pos={[x - largura / 2 + 0.1, y, 0]} classe="mini">
        0
      </Rotulo>
      <Rotulo pos={[x + largura / 2 - 0.1, y, 0]} classe="mini">
        {fim}
      </Rotulo>
      <Rotulo pos={[x, y, 0]} classe="mini">
        bits
      </Rotulo>
    </group>
  )
}

/** Etiqueta de uma ou duas linhas (cartão branco; `destaque` = laranja escuro). */
export function Etiqueta({
  pos,
  children,
  destaque = false,
  largura,
}: {
  pos: V3
  children: ReactNode
  destaque?: boolean
  largura?: number
}) {
  return (
    <Rotulo pos={pos} classe="tijolo">
      <div
        style={{
          padding: '3px 9px',
          borderRadius: 8,
          background: destaque ? LARANJA : 'rgba(255,255,255,0.96)',
          color: destaque ? '#fff' : ESCURO,
          fontWeight: 800,
          fontSize: 11.5,
          lineHeight: 1.25,
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(20,40,70,0.2)',
          width: largura,
        }}
      >
        {children}
      </div>
    </Rotulo>
  )
}

export type CamadaEncaixe = { nome: string; cab: string; cor: string; fim?: string }

const CW = 1.7
const FW = 0.9

/**
 * Caixas encaixadas como nos slides: cada camada tem o cabeçalho (escuro) à esquerda, o
 * FCS opcional à direita e, no meio, a camada seguinte; no fundo, os dados.
 */
export function Encaixe({
  y = 2.6,
  camadas,
  dados,
  largura = 10.4,
  semNomes = false,
}: {
  y?: number
  camadas: CamadaEncaixe[]
  dados: string
  largura?: number
  semNomes?: boolean
}) {
  const n = camadas.length
  let x0 = -largura / 2
  let x1 = largura / 2
  const pecas = camadas.map((c, i) => {
    const h = 0.7 + 0.75 * (n - i)
    const z = i * 0.18
    const meio = (x0 + x1) / 2
    const cabX = x0 + 0.1 + CW / 2
    const bx0 = x0 + 0.1 + CW + 0.06
    const bx1 = x1 - 0.1 - (c.fim ? FW + 0.06 : 0)
    const peca = (
      <group key={c.nome}>
        <Caixa tam={[x1 - x0, h, 0.16]} pos={[meio, y, z]} cor={c.cor} />
        <Tijolo pos={[cabX, y, z + 0.12]} tam={[CW, h - 0.2, 0.16]} cor={ESCURO} claro texto={c.cab} pequeno />
        {c.fim && <Tijolo pos={[x1 - 0.1 - FW / 2, y, z + 0.12]} tam={[FW, h - 0.2, 0.16]} cor={ESCURO} claro texto={c.fim} pequeno />}
        {!semNomes && (
          <Rotulo pos={[meio, y + h / 2 - 0.19, z + 0.1]} classe="mini">
            <b>{c.nome}</b>
          </Rotulo>
        )}
      </group>
    )
    x0 = bx0
    x1 = bx1
    return peca
  })
  return (
    <group>
      {pecas}
      <Tijolo pos={[(x0 + x1) / 2, y, n * 0.18 + 0.12]} tam={[x1 - x0, 0.7, 0.16]} cor="#ffffff" texto={dados} pequeno />
    </group>
  )
}
