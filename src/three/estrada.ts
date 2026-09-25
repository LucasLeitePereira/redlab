import { BufferGeometry, Color, Float32BufferAttribute, Vector3, type Curve } from 'three'

// Rua/ponte gerada ao longo de uma curva (a curva é o centro da pista, na altura do asfalto).
// Visual inspirado no City Kit (Roads) do Kenney: asfalto escuro, meio-fio lilás e faixa tracejada.
// As peças do kit são quadradas e retas; aqui a pista precisa seguir um arco entre ilhas em alturas
// que mudam, por isso a geometria é montada na hora.

export const LARGURA_PISTA = 0.72
const MEIO_FIO = 0.06
const ALTURA_MEIO_FIO = 0.05
const ESPESSURA = 0.1

const COR_ASFALTO = new Color('#5b606b')
const COR_MEIO_FIO = new Color('#c9cde6')
const COR_LATERAL = new Color('#9aa1bd')

const W = LARGURA_PISTA / 2
const A = W - MEIO_FIO
const H = ALTURA_MEIO_FIO
const E = ESPESSURA

/** Contorno da seção da pista: [x lateral, y] de cada aresta, com a cor da face que ela gera. */
const PERFIL: [[number, number], [number, number], Color][] = [
  [[-A, 0], [A, 0], COR_ASFALTO],
  [[A, 0], [A, H], COR_MEIO_FIO],
  [[A, H], [W, H], COR_MEIO_FIO],
  [[W, H], [W, -E], COR_LATERAL],
  [[W, -E], [-W, -E], COR_LATERAL],
  [[-W, -E], [-W, H], COR_LATERAL],
  [[-W, H], [-A, H], COR_MEIO_FIO],
  [[-A, H], [-A, 0], COR_MEIO_FIO],
]
/** Tampa das pontas: [x0, y0, x1, y1] de cada retângulo. */
const TAMPA: [number, number, number, number][] = [
  [-W, -E, W, 0],
  [A, 0, W, H],
  [-W, 0, -A, H],
]

const CIMA = new Vector3(0, 1, 0)

/** Ponto da curva e vetor "para a direita" (horizontal) em cada posição `u` (0 a 1). */
function amostrasEm(curva: Curve<Vector3>, ...us: number[]) {
  return us.map((u) => {
    const t = curva.getTangentAt(u)
    return { c: curva.getPointAt(u), direita: new Vector3(-t.z, 0, t.x).normalize() }
  })
}

const ponto = (s: { c: Vector3; direita: Vector3 }, x: number, y: number) =>
  s.c.clone().addScaledVector(s.direita, x).addScaledVector(CIMA, y)

function montar(posicoes: number[], cores: number[]) {
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(posicoes, 3))
  g.setAttribute('color', new Float32BufferAttribute(cores, 3))
  g.computeVertexNormals()
  return g
}

function quad(posicoes: number[], cores: number[], cor: Color, a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
  for (const v of [a, b, c, a, c, d]) {
    posicoes.push(v.x, v.y, v.z)
    cores.push(cor.r, cor.g, cor.b)
  }
}

/** Corpo da pista (asfalto, meio-fios, laterais, fundo e tampas), com cor por vértice. */
export function geometriaPista(curva: Curve<Vector3>, segmentos = 64) {
  const s = amostrasEm(curva, ...Array.from({ length: segmentos + 1 }, (_, i) => i / segmentos))
  const posicoes: number[] = []
  const cores: number[] = []
  for (let i = 0; i < segmentos; i++) {
    for (const [[x0, y0], [x1, y1], cor] of PERFIL) {
      quad(posicoes, cores, cor, ponto(s[i], x0, y0), ponto(s[i], x1, y1), ponto(s[i + 1], x1, y1), ponto(s[i + 1], x0, y0))
    }
  }
  for (const [x0, y0, x1, y1] of TAMPA) {
    const ini = s[0]
    const fim = s[segmentos]
    // a de trás olha para trás, a da frente olha para frente
    quad(posicoes, cores, COR_LATERAL, ponto(ini, x0, y0), ponto(ini, x1, y0), ponto(ini, x1, y1), ponto(ini, x0, y1))
    quad(posicoes, cores, COR_LATERAL, ponto(fim, x0, y1), ponto(fim, x1, y1), ponto(fim, x1, y0), ponto(fim, x0, y0))
  }
  return montar(posicoes, cores)
}

/** Faixa branca tracejada no meio da pista (separa as duas mãos). */
export function geometriaFaixa(curva: Curve<Vector3>, traco = 0.12, vao = 0.1, largura = 0.035) {
  const total = curva.getLength()
  const posicoes: number[] = []
  const cores: number[] = []
  const branco = new Color('#f4f1ea')
  const y = 0.004
  for (let d = vao / 2; d + traco <= total - vao / 2; d += traco + vao) {
    const [p, q] = amostrasEm(curva, d / total, (d + traco) / total)
    quad(posicoes, cores, branco, ponto(p, -largura / 2, y), ponto(p, largura / 2, y), ponto(q, largura / 2, y), ponto(q, -largura / 2, y))
  }
  return montar(posicoes, cores)
}
