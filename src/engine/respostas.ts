import type { FormatoCampo } from './tipos'

// Confere respostas digitadas sem ser chato com a forma: o aluno pode escrever o IP com
// "·" como nos slides, usar vírgula no teclado do celular ou separar milhar com ponto.

type Ip = { octetos: number[]; prefixo: number | null }

function lerIp(texto: string): Ip | null {
  const s = texto.replace(/\s+/g, '').replace(/[·•,]/g, '.')
  const m = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/)
  if (!m) return null
  const octetos = m.slice(1, 5).map(Number)
  if (octetos.some((o) => o > 255)) return null
  const prefixo = m[5] === undefined ? null : Number(m[5])
  if (prefixo !== null && prefixo > 32) return null
  return { octetos, prefixo }
}

/** Prefixo (/n) de uma máscara escrita como 255.255.240.0, /20 ou 20; null se inválida. */
function lerPrefixo(texto: string): number | null {
  const s = texto.replace(/\s+/g, '')
  const barra = s.match(/^\/?(\d{1,2})$/)
  if (barra) return Number(barra[1]) <= 32 ? Number(barra[1]) : null
  const ip = lerIp(s)
  if (!ip || ip.prefixo !== null) return null
  const bits = ip.octetos.map((o) => o.toString(2).padStart(8, '0')).join('')
  return /^1*0*$/.test(bits) ? bits.indexOf('0') === -1 ? 32 : bits.indexOf('0') : null
}

const lerNumero = (texto: string) => {
  const s = texto.replace(/[\s.,]/g, '')
  return /^\d+$/.test(s) ? Number(s) : null
}

const lerBinario = (texto: string) => {
  const s = texto.replace(/[\s.·]/g, '')
  return /^[01]{1,32}$/.test(s) ? parseInt(s, 2) : null
}

export function conferir(formato: FormatoCampo, digitado: string, esperado: string): boolean {
  switch (formato) {
    case 'ip': {
      const a = lerIp(digitado)
      const b = lerIp(esperado)
      if (!a || !b) return false
      // "/n" é opcional; se o aluno escrever, tem que ser o certo.
      if (a.prefixo !== null && b.prefixo !== null && a.prefixo !== b.prefixo) return false
      return a.octetos.every((o, i) => o === b.octetos[i])
    }
    case 'mascara': {
      const a = lerPrefixo(digitado)
      return a !== null && a === lerPrefixo(esperado)
    }
    case 'numero': {
      const a = lerNumero(digitado)
      return a !== null && a === lerNumero(esperado)
    }
    case 'binario': {
      const a = lerBinario(digitado)
      return a !== null && a === lerBinario(esperado)
    }
  }
}

export const EXEMPLO_CAMPO: Record<FormatoCampo, string> = {
  ip: 'ex.: 192.168.10.0',
  mascara: 'ex.: 255.255.255.0 ou /24',
  numero: 'ex.: 254',
  binario: 'ex.: 11000000',
}
