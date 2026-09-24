import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { CatmullRomCurve3, DoubleSide, MeshBasicMaterial, Vector3, type Group, type Mesh } from 'three'
import type { V3 } from './base'
import { anelOnda, esferaUnitaria, material } from './recursos'

export function useCurva(pontos: V3[]) {
  const chave = JSON.stringify(pontos)
  return useMemo(() => new CatmullRomCurve3(pontos.map((p) => new Vector3(...p)), false, 'centripetal'), [chave])
}

/** Pontos de um arco entre dois lugares (para pedidos, respostas e "pontes" de protocolo). */
export function arco(de: V3, para: V3, altura: number, segmentos = 8): V3[] {
  return Array.from({ length: segmentos + 1 }, (_, i) => {
    const t = i / segmentos
    return [
      de[0] + (para[0] - de[0]) * t,
      de[1] + (para[1] - de[1]) * t + Math.sin(Math.PI * t) * altura,
      de[2] + (para[2] - de[2]) * t,
    ]
  })
}

export function Cabo({
  curva,
  cor = '#3b82c4',
  raio = 0.06,
  opacidade,
}: {
  curva: CatmullRomCurve3
  cor?: string
  raio?: number
  opacidade?: number
}) {
  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curva, 96, raio, 8, false]} />
      <meshStandardMaterial
        color={cor}
        roughness={0.6}
        transparent={opacidade !== undefined}
        opacity={opacidade ?? 1}
      />
    </mesh>
  )
}

const tmp = new Vector3()

/** Leva `children` ao longo da curva; a frente (+z) aponta para onde está indo. */
export function Viajante({
  curva,
  duracao = 3,
  pausa = 0.6,
  atraso = 0,
  altura = 0,
  inverso = false,
  ativo = true,
  children,
}: {
  curva: CatmullRomCurve3
  duracao?: number
  pausa?: number
  atraso?: number
  altura?: number
  inverso?: boolean
  ativo?: boolean
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  const inicio = useRef<number | null>(null)

  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    if (!ativo) {
      g.visible = false
      inicio.current = null
      return
    }
    if (inicio.current === null) inicio.current = clock.elapsedTime
    const t = clock.elapsedTime - inicio.current - atraso
    const ciclo = duracao + pausa
    const u = t < 0 ? -1 : (t % ciclo) / duracao
    if (u < 0 || u > 1) {
      g.visible = false
      return
    }
    g.visible = true
    const s = inverso ? 1 - u : u
    curva.getPointAt(s, g.position)
    g.position.y += altura
    curva.getTangentAt(s, tmp)
    if (inverso) tmp.negate()
    tmp.y = 0
    if (tmp.lengthSq() > 1e-6) g.lookAt(g.position.x + tmp.x, g.position.y, g.position.z + tmp.z)
  })

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}

/** Sinais correndo pelo cabo: pulsos elétricos (esferas) ou luz (traços alongados). */
export function Pulsos({
  curva,
  cor,
  quantidade = 5,
  duracao = 2,
  tamanho = 0.09,
  alongado = false,
  ativo = true,
}: {
  curva: CatmullRomCurve3
  cor: string
  quantidade?: number
  duracao?: number
  tamanho?: number
  alongado?: boolean
  ativo?: boolean
}) {
  const refs = useRef<Mesh[]>([])
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      m.visible = ativo
      if (!ativo) return
      const u = (clock.elapsedTime / duracao + i / quantidade) % 1
      curva.getPointAt(u, m.position)
      curva.getTangentAt(u, tmp)
      m.lookAt(m.position.x + tmp.x, m.position.y + tmp.y, m.position.z + tmp.z)
    })
  })
  return (
    <>
      {Array.from({ length: quantidade }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => { if (m) refs.current[i] = m }}
          geometry={esferaUnitaria}
          material={material({ cor, emissivo: cor, intensidade: 1.4 })}
          scale={alongado ? [tamanho, tamanho, tamanho * 3.5] : tamanho}
        />
      ))}
    </>
  )
}

/** Ondas eletromagnéticas saindo de uma antena: anéis que crescem e somem. */
export function Ondas({
  pos,
  cor,
  raio = 3,
  periodo = 2,
  quantidade = 3,
  ativo = true,
}: {
  pos: V3
  cor: string
  raio?: number
  periodo?: number
  quantidade?: number
  ativo?: boolean
}) {
  const refs = useRef<Mesh[]>([])
  // Cada anel tem opacidade própria (animada), então precisa do próprio material.
  const materiais = useMemo(
    () =>
      Array.from(
        { length: quantidade },
        () => new MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.6, depthWrite: false, side: DoubleSide }),
      ),
    [cor, quantidade],
  )
  useEffect(() => () => materiais.forEach((m) => m.dispose()), [materiais])
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      m.visible = ativo
      if (!ativo) return
      const u = (clock.elapsedTime / periodo + i / quantidade) % 1
      const r = 0.2 + u * raio
      m.scale.set(r, r, r)
      materiais[i].opacity = (1 - u) * 0.7
    })
  })
  return (
    <group position={pos}>
      {materiais.map((mat, i) => (
        <mesh key={i} ref={(m) => { if (m) refs.current[i] = m }} geometry={anelOnda} material={mat} />
      ))}
    </group>
  )
}
