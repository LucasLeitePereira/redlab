import type { Fonte, Questao } from '../../engine/tipos'
import { broadcast, elevado, hosts, mascaraDe, milhar, octetoBin, paraIp, paraNumero, primeiro, rede, ultimo } from './ip'

// Gerador infinito de exercícios no formato dos slides do professor (Aula 03 p1–p3).
// As explicações refazem a conta pelo método dele: acha o octeto onde a máscara corta,
// escreve esse octeto em binário e troca os bits de host (H) por 0 ou por 1.

const p1 = (pagina: number): Fonte => ({ aula: 'Aula 03 p1', pagina })
const p2 = (pagina: number): Fonte => ({ aula: 'Aula 03 p2', pagina })
const p3 = (pagina: number): Fonte => ({ aula: 'Aula 03 p3', pagina })

const ORDINAL = ['1º', '2º', '3º', '4º']

/** Octeto em binário com uma barra onde a máscara corta: 011|00100. */
const comCorte = (o: number, bitsDeRede: number) => {
  const b = octetoBin(o)
  return `${b.slice(0, bitsDeRede)}|${b.slice(bitsDeRede)}`
}

/** Linhas "- " da conta de rede e broadcast pelo método dos H's. */
export function explicarCorte(ip: string, pref: number, mostrar: { rede?: boolean; broadcast?: boolean } = { rede: true, broadcast: true }) {
  const masc = paraIp(mascaraDe(pref))
  const r = rede(ip, pref)
  const b = broadcast(ip, pref)
  const linhas = [`- Máscara \`${masc}\` = **/${pref}** (${pref} bits 1).`]
  if (pref % 8 === 0) {
    linhas.push(
      `- O corte cai certinho entre octetos: os ${pref / 8} primeiro(s) octeto(s) são a parte rede, o resto é host.`,
    )
    if (mostrar.rede) linhas.push(`- Rede: octetos de host viram **0** → **${r}**`)
    if (mostrar.broadcast) linhas.push(`- Broadcast: octetos de host viram **255** → **${b}**`)
    return linhas
  }
  const o = Math.floor(pref / 8)
  const k = pref % 8
  const doIp = Number(ip.split('.')[o])
  const nr = Number(r.split('.')[o])
  const nb = Number(b.split('.')[o])
  linhas.push(
    `- O corte cai no **${ORDINAL[o]} octeto**: ${k} bit(s) de rede e ${8 - k} de host nele.`,
    `- ${ORDINAL[o]} octeto do IP: ${doIp} = \`${comCorte(doIp, k)}\``,
  )
  if (mostrar.rede) linhas.push(`- Rede (H's = 0): \`${comCorte(nr, k)}\` = ${nr} → **${r}**`)
  if (mostrar.broadcast) linhas.push(`- Broadcast (H's = 1): \`${comCorte(nb, k)}\` = ${nb} → **${b}**`)
  return linhas
}

export function explicarValidos(ip: string, pref: number) {
  return [
    ...explicarCorte(ip, pref),
    `- 1º válido = rede + 1 → **${primeiro(ip, pref)}**`,
    `- Último válido = broadcast − 1 → **${ultimo(ip, pref)}**`,
  ]
}

export function explicarQuantidade(pref: number) {
  const n = 32 - pref
  return [
    `- /${pref} → sobram 32 − ${pref} = **${n} bits** para a parte host.`,
    `- 2${elevado(n)} = ${milhar(2 ** n)} IPs na sub-rede; tirando o da rede e o de broadcast:`,
    `- 2${elevado(n)} − 2 = **${milhar(hosts(pref))} hosts**`,
  ]
}

// ---------- sorteios ----------

const entre = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const um = <T,>(lista: readonly T[]) => lista[Math.floor(Math.random() * lista.length)]

const PRIMEIROS = [10, 34, 130, 172, 190, 192, 200, 220] as const

function prefixo(min = 17, max = 30) {
  if (Math.random() < 0.12) return um([16, 24].filter((p) => p >= min && p <= max))
  let p = entre(min, max)
  while (p === 24) p = entre(min, max)
  return p
}

/** IP de host qualquer: nunca o endereço da rede nem o de broadcast. */
function ipDeHost(pref: number) {
  for (;;) {
    const ip = [um(PRIMEIROS), entre(0, 255), entre(0, 255), entre(0, 255)].join('.')
    if (ip !== rede(ip, pref) && ip !== broadcast(ip, pref)) return ip
  }
}

const mascara = (pref: number) => paraIp(mascaraDe(pref))

// ---------- tipos de questão ----------

function questaoRede(): Questao {
  const pref = prefixo()
  const ip = ipDeHost(pref)
  return {
    tipo: 'digitar',
    enunciado: 'Calcule o endereço que identifica a sub-rede na configuração do host abaixo.',
    dados: [`Endereço IP : ${ip}`, `Máscara     : ${mascara(pref)}`],
    campos: [{ rotulo: 'Endereço da sub-rede', resposta: rede(ip, pref), formato: 'ip' }],
    explicacao: explicarCorte(ip, pref, { rede: true }).join('\n'),
    fonte: p2(1),
  }
}

function questaoBroadcast(): Questao {
  const pref = prefixo()
  const ip = ipDeHost(pref)
  return {
    tipo: 'digitar',
    enunciado: 'Calcule o endereço que identifica o broadcast na sub-rede que possui o IP abaixo.',
    dados: [`Endereço IP : ${ip}`, `Máscara     : ${mascara(pref)}`],
    campos: [{ rotulo: 'Endereço de broadcast', resposta: broadcast(ip, pref), formato: 'ip' }],
    explicacao: explicarCorte(ip, pref, { broadcast: true }).join('\n'),
    fonte: p2(2),
  }
}

function questaoRedeEBroadcast(): Questao {
  const pref = prefixo(16, 30)
  const ip = ipDeHost(pref)
  return {
    tipo: 'digitar',
    enunciado: 'Calcule o IP da sub-rede e o do broadcast.',
    dados: [`IP ${ip}/${pref}`],
    campos: [
      { rotulo: 'IP da sub-rede', resposta: `${rede(ip, pref)}/${pref}`, formato: 'ip' },
      { rotulo: 'Broadcast', resposta: `${broadcast(ip, pref)}/${pref}`, formato: 'ip' },
    ],
    explicacao: explicarCorte(ip, pref).join('\n'),
    fonte: p2(3),
  }
}

function questaoValidos(): Questao {
  const pref = prefixo(17, 30)
  const ip = ipDeHost(pref)
  return {
    tipo: 'digitar',
    enunciado: 'Calcule o 1º e o último endereços válidos da sub-rede em que está contido o IP abaixo.',
    dados: [`IP ${ip}/${pref}`],
    campos: [
      { rotulo: '1º válido', resposta: `${primeiro(ip, pref)}/${pref}`, formato: 'ip' },
      { rotulo: 'Último válido', resposta: `${ultimo(ip, pref)}/${pref}`, formato: 'ip' },
    ],
    explicacao: explicarValidos(ip, pref).join('\n'),
    fonte: p3(2),
  }
}

function questaoQuantidade(): Questao {
  const pref = entre(16, 30)
  const r = rede(ipDeHost(pref), pref)
  return {
    tipo: 'digitar',
    enunciado: 'Calcule a quantidade de possíveis hosts que podem pertencer à sub-rede abaixo.',
    dados: [`${r}/${pref}`],
    campos: [{ rotulo: 'Quantidade de hosts', resposta: String(hosts(pref)), formato: 'numero' }],
    explicacao: explicarQuantidade(pref).join('\n'),
    fonte: p3(3),
  }
}

function questaoBarra(): Questao {
  const pref = entre(16, 30)
  const masc = mascara(pref)
  const bits = masc.split('.').map((o) => octetoBin(Number(o))).join('·')
  const explicacao = [`- \`${bits}\``, `- ${pref} bits 1's → **/${pref}** = **${masc}**`].join('\n')
  if (Math.random() < 0.5) {
    return {
      tipo: 'digitar',
      enunciado: 'Escreva esta máscara na notação simplificada, usando / (barra).',
      dados: [`Máscara : ${masc}`],
      campos: [{ rotulo: 'Notação com barra', resposta: `/${pref}`, formato: 'mascara' }],
      explicacao,
      fonte: p2(3),
    }
  }
  return {
    tipo: 'digitar',
    enunciado: 'Escreva a máscara /n abaixo em decimal (4 octetos).',
    dados: [`/${pref}`],
    campos: [{ rotulo: 'Máscara em decimal', resposta: masc, formato: 'ip' }],
    explicacao,
    fonte: p2(3),
  }
}

/** Octetos que aparecem nas contas: os valores "de máscara" e alguns quaisquer. */
const OCTETOS_DE_MASCARA = [128, 192, 224, 240, 248, 252, 254, 255]

function questaoBinario(): Questao {
  const n = Math.random() < 0.4 ? um(OCTETOS_DE_MASCARA) : entre(1, 254)
  const bin = octetoBin(n)
  const pesos = [128, 64, 32, 16, 8, 4, 2, 1].filter((_, i) => bin[i] === '1')
  const explicacao = `- Pesos: 128 64 32 16 8 4 2 1\n- \`${bin}\` → ${pesos.join(' + ')} = **${n}**`
  if (Math.random() < 0.5) {
    return {
      tipo: 'digitar',
      enunciado: 'Converta o octeto para binário (8 bits).',
      dados: [String(n)],
      campos: [{ rotulo: 'Binário', resposta: bin, formato: 'binario' }],
      explicacao,
      fonte: p1(2),
    }
  }
  return {
    tipo: 'digitar',
    enunciado: 'Converta o octeto para decimal.',
    dados: [bin],
    campos: [{ rotulo: 'Decimal', resposta: String(n), formato: 'numero' }],
    explicacao,
    fonte: p1(2),
  }
}

function questaoMesmaSubrede(): Questao {
  const pref = prefixo(17, 30)
  const a = ipDeHost(pref)
  // metade das vezes o segundo host fica na mesma sub-rede, metade numa vizinha
  const tamanho = 2 ** (32 - pref)
  const base = paraNumero(rede(a, pref))
  const mesma = Math.random() < 0.5
  const outraBase = mesma ? base : (base + (Math.random() < 0.5 ? tamanho : -tamanho)) >>> 0
  let b = a
  while (b === a || b === rede(b, pref) || b === broadcast(b, pref)) b = paraIp(outraBase + entre(1, tamanho - 2))
  return {
    tipo: 'escolha',
    enunciado: `Os hosts ${a}/${pref} e ${b}/${pref} estão na mesma sub-rede (podem se comunicar diretamente)?`,
    opcoes: ['Sim: mesma sub-rede', 'Não: sub-redes diferentes (precisa de gateway)'],
    correta: mesma ? 0 : 1,
    explicacao: [
      `- Sub-rede de ${a}: **${rede(a, pref)}**`,
      `- Sub-rede de ${b}: **${rede(b, pref)}**`,
      mesma ? '- Mesmo endereço de sub-rede → se comunicam diretamente.' : '- Endereços de sub-rede diferentes → só pela gateway.',
    ].join('\n'),
    fonte: p1(3),
  }
}

/** Mais peso para as contas que caem na prova (rede, broadcast, válidos, quantidade). */
const SORTEIO: [() => Questao, number][] = [
  [questaoRede, 3],
  [questaoBroadcast, 3],
  [questaoRedeEBroadcast, 3],
  [questaoValidos, 3],
  [questaoQuantidade, 2],
  [questaoBarra, 1.5],
  [questaoBinario, 1.5],
  [questaoMesmaSubrede, 1.5],
]

export function gerarQuestao(): Questao {
  const total = SORTEIO.reduce((s, [, p]) => s + p, 0)
  let r = Math.random() * total
  for (const [gerar, peso] of SORTEIO) {
    r -= peso
    if (r < 0) return gerar()
  }
  return SORTEIO[0][0]()
}
