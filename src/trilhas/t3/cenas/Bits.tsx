import { useEffect, useState } from 'react'
import { Arvore, Caixa, Ilha, Rotulo } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { bitsDe, broadcast, elevado, hosts, mascaraDe, milhar, paraIp, primeiro, rede, ultimo, type Bit } from '../ip'
import { PainelBits, trocarHost, xDoBit, type Linha } from './PainelBits'

// Cenas "de caderno" da Trilha 3: o endereço aberto em bits, do jeito que o professor
// faz as contas nos slides (Aula 03 p1–p3). O estado do passo escolhe o modo e o endereço.

const PESOS = [128, 64, 32, 16, 8, 4, 2, 1]

/** Chão comum: a ilha com uma "folha de caderno" por baixo do painel. */
export function Mesa({ profundidade = 7 }: { profundidade?: number }) {
  return (
    <>
      <Ilha raio={8.4} />
      <Caixa tam={[13.2, 0.08, profundidade]} pos={[0, 0.04, 0]} cor="#f6f1e6" sombra={false} />
      <Arvore pos={[-6.6, 0, -4.2]} escala={0.8} />
      <Arvore pos={[6.7, 0, 4.1]} escala={0.9} />
      <Arvore pos={[6.4, 0, -4.4]} escala={0.7} />
    </>
  )
}

// ---------- Binário ↔ decimal (8 interruptores) ----------

function Octeto({ meta, inicial, cena }: { meta?: number; inicial: number; cena: CenaProps }) {
  const [bits, setBits] = useState<Bit[]>(() => bitsDe(inicial).slice(24))
  const soma = bits.reduce<number>((s, b, i) => s + b * PESOS[i], 0)
  const acertou = meta !== undefined && soma === meta
  const { alvos, revelados, onRevelar } = cena

  useEffect(() => {
    if (acertou && alvos.includes('meta') && !revelados.includes('meta')) onRevelar('meta')
  }, [acertou, alvos, revelados, onRevelar])

  const linha: Linha = {
    id: 'octeto',
    rotulo: 'Octeto',
    bits: bits,
    tom: acertou ? 'resultado' : 'neutro',
    octetos: 'nenhum',
    onBit: (i) => setBits((b) => b.map((x, j) => (j === i ? ((1 - x) as Bit) : x))),
  }
  const ligados = PESOS.filter((_, i) => bits[i] === 1)
  return (
    <>
      <group scale={2.7} position={[0, 0.05, 0.3]}>
        <PainelBits linhas={[linha]} />
        {PESOS.map((p, i) => (
          <Rotulo key={p} pos={[xDoBit(i, 8), 0.6, -0.72]} classe="bits" apagado={bits[i] === 0}>{p}</Rotulo>
        ))}
        {bits.map((b, i) => (
          <Rotulo key={i} pos={[xDoBit(i, 8), 0.2, 0.48]} classe="bits grande">{b}</Rotulo>
        ))}
      </group>
      <Rotulo pos={[0, 0.6, 3.3]} classe="grande" escuro>
        {ligados.length ? ligados.join(' + ') : '0'} = {soma}
      </Rotulo>
      {meta !== undefined && (
        <Rotulo pos={[0, 0.8, -2.6]} classe="grande">
          {acertou ? `✓ ${meta} = ${bits.join('')}` : `Meta: formar ${meta}`}
        </Rotulo>
      )}
    </>
  )
}

// ---------- Dimensão: contando de 0.0.0.0 até 255.255.255.255 ----------

const TOTAL = 2 ** 32
/** Valor do "odômetro" em t segundos: devagar no começo (como a tabela do slide), depois dispara. */
function valorNoTempo(t: number) {
  if (t < 1.6) return Math.floor(t / 0.4)
  if (t < 4.2) return 4 + Math.floor(((t - 1.6) / 2.6) * 253)
  if (t < 7.2) return Math.min(TOTAL - 1, Math.floor(257 * ((TOTAL - 1) / 257) ** ((t - 4.2) / 3)))
  return TOTAL - 1
}
const CICLO_CONTADOR = 10

function Contador() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const inicio = performance.now()
    const id = window.setInterval(() => setN(valorNoTempo(((performance.now() - inicio) / 1000) % CICLO_CONTADOR)), 70)
    return () => window.clearInterval(id)
  }, [])
  const linha: Linha = { id: 'ip', rotulo: n === 0 ? '1º IP' : n === TOTAL - 1 ? 'Último IP' : 'IP', bits: bitsDe(n), direita: paraIp(n) }
  return (
    <>
      <group scale={1.12} position={[0.3, 0.08, -0.4]}>
        <PainelBits linhas={[linha]} />
      </group>
      <Rotulo pos={[0, 0.6, -2.2]} classe="grande">Endereço nº {milhar(n + 1)}</Rotulo>
      <Rotulo pos={[0, 0.6, 1.9]} classe="grande" escuro>2³² = 4.294.967.296 endereços IPs</Rotulo>
    </>
  )
}

// ---------- Endereços em bits ----------

/** Linhas do painel para cada modo; `ip` e `pref` vêm do estado do passo. */
function linhasDoModo(modo: string, ip: string, pref: number): { linhas: Linha[]; corte?: number; partes?: boolean; destaque?: number } {
  const bIp = bitsDe(ip)
  const bMasc = bitsDe(mascaraDe(pref))
  const masc = paraIp(mascaraDe(pref))
  const interessante = pref % 8 === 0 ? undefined : Math.floor(pref / 8)
  switch (modo) {
    case 'ip':
      return { linhas: [{ id: 'ip', rotulo: 'IP', bits: bIp, direita: ip }] }
    case 'and':
      return {
        linhas: [
          { id: 'ip', rotulo: 'IP do host', bits: bIp, direita: ip },
          { id: 'masc', rotulo: 'AND  Máscara', bits: bMasc, tom: 'mascara', direita: masc, traco: true, atraso: 0.5 },
          { id: 'rede', rotulo: 'Sub-rede', bits: bitsDe(rede(ip, pref)), tom: 'resultado', direita: rede(ip, pref), atraso: 1.4 },
        ],
      }
    case 'partes':
      return {
        linhas: [
          { id: 'ip', rotulo: 'IP', bits: bIp, tom: 'partes', direita: ip },
          { id: 'masc', rotulo: 'Máscara', bits: bMasc, tom: 'mascara', direita: masc },
        ],
        corte: pref,
        partes: true,
      }
    case 'broadcast':
      return {
        linhas: [
          { id: 'ip', rotulo: 'IP', bits: bIp, tom: 'partes', direita: ip },
          { id: 'masc', rotulo: 'Máscara', bits: bMasc, tom: 'mascara', direita: masc, traco: true },
          { id: 'bc', rotulo: 'Broadcast', bits: trocarHost(bIp, pref, 1), tom: 'partes', direita: broadcast(ip, pref), atraso: 0.9 },
        ],
        corte: pref,
        partes: true,
      }
    case 'barra':
      return {
        linhas: [24, 25, 26].map((p, k) => ({
          id: `m${p}`,
          rotulo: `/${p}`,
          bits: bitsDe(mascaraDe(p)),
          tom: 'mascara' as const,
          direita: paraIp(mascaraDe(p)),
          atraso: k * 0.5,
        })),
      }
    case 'hs':
      return {
        linhas: [
          { id: 'masc', rotulo: `Máscara /${pref}`, bits: bMasc, tom: 'mascara', octetos: 'misto', direita: masc },
          { id: 'ip', rotulo: 'IP', bits: bIp, tom: 'partes', octetos: 'misto', direita: ip, atraso: 0.4 },
          { id: 'hs', rotulo: "H's", bits: trocarHost(bIp, pref, 'H'), tom: 'partes', octetos: 'misto', atraso: 1.2 },
          { id: 'rede', rotulo: 'Sub-rede (H=0)', bits: trocarHost(bIp, pref, 0), tom: 'partes', octetos: 'misto', direita: `${rede(ip, pref)}/${pref}`, atraso: 2.2 },
          { id: 'bc', rotulo: 'Broadcast (H=1)', bits: trocarHost(bIp, pref, 1), tom: 'partes', octetos: 'misto', direita: `${broadcast(ip, pref)}/${pref}`, atraso: 3.2 },
        ],
        corte: pref,
        partes: true,
        destaque: interessante,
      }
    case 'validos': {
      const r = rede(ip, pref)
      const b = broadcast(ip, pref)
      return {
        linhas: [
          { id: 'rede', rotulo: 'Sub-rede', bits: bitsDe(r), tom: 'partes', octetos: 'misto', direita: r },
          { id: 'prim', rotulo: '1º válido (+1)', bits: bitsDe(primeiro(ip, pref)), tom: 'partes', octetos: 'misto', direita: primeiro(ip, pref), atraso: 0.6 },
          { id: 'ult', rotulo: 'Último válido (−1)', bits: bitsDe(ultimo(ip, pref)), tom: 'partes', octetos: 'misto', direita: ultimo(ip, pref), atraso: 1.2 },
          { id: 'bc', rotulo: 'Broadcast', bits: bitsDe(b), tom: 'partes', octetos: 'misto', direita: b, atraso: 1.8 },
        ],
        corte: pref,
        destaque: 3,
      }
    }
    case 'quantidade':
      return {
        linhas: [
          { id: 'masc', rotulo: `Máscara /${pref}`, bits: bMasc, tom: 'partes', direita: masc },
          { id: 'hs', rotulo: 'Hosts', bits: trocarHost(bitsDe(rede(ip, pref)), pref, 'H'), tom: 'partes', direita: `${rede(ip, pref)}/${pref}`, atraso: 0.5 },
        ],
        corte: pref,
        partes: true,
      }
    default:
      return { linhas: [] }
  }
}

function Quantidade({ pref }: { pref: number }) {
  const n = 32 - pref
  return (
    <Rotulo pos={[0, 0.6, 2.4]} classe="grande" escuro>
      n = {n} bits de host → 2{elevado(n)} = {milhar(2 ** n)} IPs → 2{elevado(n)} − 2 = {milhar(hosts(pref))} válidos
    </Rotulo>
  )
}

/** O painel de um modo, centralizado (usado aqui e na cena das sub-redes). */
export function QuadroBits({ modo, ip, pref }: { modo: string; ip: string; pref: number }) {
  const { linhas, corte, partes, destaque } = linhasDoModo(modo, ip, pref)
  const escala = linhas.length <= 2 ? 1.12 : 1
  return (
    <group scale={escala} position={[0.3, 0.08, modo === 'quantidade' ? -0.6 : 0]}>
      <PainelBits linhas={linhas} corte={corte} partes={partes} destaque={destaque} />
    </group>
  )
}

export function CenaBits(cena: CenaProps) {
  const { estado } = cena
  const modo = (estado.modo as string | undefined) ?? 'binario'
  const ip = (estado.ip as string | undefined) ?? '192.168.10.1'
  const pref = (estado.pref as number | undefined) ?? 24
  const meta = estado.meta as number | undefined
  return (
    <>
      <Mesa />
      {modo === 'dimensao' ? (
        <Contador />
      ) : modo === 'binario' ? (
        // key: cada meta nova começa com os interruptores zerados
        <Octeto key={`${meta}-${estado.valor}`} meta={meta} inicial={(estado.valor as number | undefined) ?? 0} cena={cena} />
      ) : (
        <>
          <QuadroBits modo={modo} ip={ip} pref={pref} />
          {modo === 'ip' && (
            <>
              <Rotulo pos={[0, 0.6, -1.6]} classe="grande">32 bits = 4 octetos</Rotulo>
              <Rotulo pos={[0, 0.6, 1.9]} classe="grande" escuro>{ip}</Rotulo>
            </>
          )}
          {modo === 'quantidade' && <Quantidade pref={pref} />}
        </>
      )}
    </>
  )
}
