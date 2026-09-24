// Contas de endereçamento IPv4 usadas pelas cenas, pelos exercícios e pelo gerador.
// Os endereços são guardados como número de 32 bits sem sinal (>>> 0).

export type Bit = 0 | 1

export const paraNumero = (ip: string) =>
  ip.split('.').reduce((n, o) => ((n << 8) | Number(o)) >>> 0, 0)

export const paraIp = (n: number) => [24, 16, 8, 0].map((d) => (n >>> d) & 255).join('.')

/** Máscara com `prefixo` bits 1 à esquerda (ex.: 20 → 255.255.240.0). */
export const mascaraDe = (prefixo: number) => (prefixo === 0 ? 0 : (0xffffffff << (32 - prefixo)) >>> 0)

/** Quantidade de bits 1 de uma máscara escrita com pontos. */
export const prefixoDe = (mascara: string) => bitsDe(mascara).filter((b) => b === 1).length

export const bitsDe = (ip: string | number): Bit[] => {
  const n = typeof ip === 'number' ? ip : paraNumero(ip)
  return Array.from({ length: 32 }, (_, i) => ((n >>> (31 - i)) & 1) as Bit)
}

export const octetoBin = (o: number) => o.toString(2).padStart(8, '0')

export const binDe = (ip: string | number) => {
  const n = typeof ip === 'number' ? ip : paraNumero(ip)
  return paraIp(n).split('.').map((o) => octetoBin(Number(o))).join(' ')
}

export const rede = (ip: string, prefixo: number) => paraIp((paraNumero(ip) & mascaraDe(prefixo)) >>> 0)
export const broadcast = (ip: string, prefixo: number) => paraIp((paraNumero(ip) | ~mascaraDe(prefixo)) >>> 0)
export const primeiro = (ip: string, prefixo: number) => paraIp(paraNumero(rede(ip, prefixo)) + 1)
export const ultimo = (ip: string, prefixo: number) => paraIp(paraNumero(broadcast(ip, prefixo)) - 1)
/** Quantidade de IPs válidos (hosts): 2ⁿ − 2, com n = bits da parte do host. */
export const hosts = (prefixo: number) => 2 ** (32 - prefixo) - 2

const SOBRESCRITO: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
export const elevado = (n: number) => String(n).split('').map((c) => SOBRESCRITO[c]).join('')

/** Separador de milhar do jeito dos slides: 4.294.967.296. */
export const milhar = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
