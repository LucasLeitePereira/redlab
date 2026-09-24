import {
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  type BufferGeometry,
} from 'three'

/**
 * Geometrias e materiais compartilhados por todas as cenas.
 *
 * Cada <Caixa> criava a própria BoxGeometry e o próprio material: 150+ objetos por
 * cena, recriados a cada troca de fase. Aqui existe um só de cada tipo: caixas e
 * esferas usam uma geometria unitária + `scale`, e materiais iguais são o mesmo objeto.
 * Nada disso é descartado no unmount (é passado por prop, não como filho JSX).
 */

export const caixaUnitaria = new BoxGeometry(1, 1, 1)
export const esferaUnitaria = new SphereGeometry(1, 16, 12)
export const toroEngrenagem = new TorusGeometry(0.28, 0.07, 8, 18)
export const anelOnda = new RingGeometry(0.9, 1, 48).rotateX(-Math.PI / 2)
export const discoSombra = new CircleGeometry(1, 20).rotateX(-Math.PI / 2)

const cilindros = new Map<string, BufferGeometry>()

export function geometriaCilindro(raio: number, raioBase: number, altura: number, lados: number) {
  const chave = `${raio}|${raioBase}|${altura}|${lados}`
  let g = cilindros.get(chave)
  if (!g) {
    g = new CylinderGeometry(raio, raioBase, altura, lados)
    cilindros.set(chave, g)
  }
  return g
}

export type OpcoesMaterial = {
  cor: string
  emissivo?: string
  intensidade?: number
  opacidade?: number
}

const materiais = new Map<string, MeshStandardMaterial>()

export function material({ cor, emissivo, intensidade = 0.6, opacidade }: OpcoesMaterial) {
  const chave = `${cor}|${emissivo ?? ''}|${emissivo ? intensidade : 0}|${opacidade ?? 1}`
  let m = materiais.get(chave)
  if (!m) {
    m = new MeshStandardMaterial({
      color: cor,
      emissive: emissivo ?? '#000000',
      emissiveIntensity: emissivo ? intensidade : 0,
      roughness: 0.75,
      metalness: 0.05,
      flatShading: true,
      transparent: opacidade !== undefined,
      opacity: opacidade ?? 1,
    })
    materiais.set(chave, m)
  }
  return m
}

/** Sombra "falsa" (mancha escura) para o que se move: não obriga a refazer o mapa de sombras. */
export const materialSombraFalsa = new MeshBasicMaterial({
  color: '#1d2a36',
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
})
