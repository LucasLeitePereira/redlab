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

/**
 * Horários de um percurso de nó em nó: `chegadas[i]` é quando chega em `pontos[i]`
 * (andando a `velocidade` unidades/s e parando `espera` s em cada nó intermediário).
 */
export function linhaDoTempo(pontos: V3[], velocidade: number, espera: number) {
  const chegadas = [0]
  for (let i = 1; i < pontos.length; i++) {
    const [a, b] = [pontos[i - 1], pontos[i]]
    const distancia = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    const saida = chegadas[i - 1] + (i > 1 ? espera : 0)
    chegadas.push(saida + distancia / velocidade)
  }
  return { chegadas, total: chegadas[chegadas.length - 1] }
}

/**
 * Leva `children` de nó em nó em linha reta, parando em cada nó intermediário
 * (guardar e encaminhar). Repete a cada `periodo` segundos; fora da viagem fica invisível.
 */
export function Percurso({
  pontos,
  velocidade = 2.5,
  espera = 0,
  atraso = 0,
  periodo,
  ativo = true,
  children,
}: {
  pontos: V3[]
  velocidade?: number
  espera?: number
  atraso?: number
  /** Duração do ciclo inteiro (padrão: a viagem + 1 s). */
  periodo?: number
  ativo?: boolean
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  const inicio = useRef<number | null>(null)
  const { chegadas, total } = useMemo(() => linhaDoTempo(pontos, velocidade, espera), [JSON.stringify(pontos), velocidade, espera])
  const ciclo = periodo ?? total + 1

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
    const u = t < 0 ? -1 : t % ciclo
    if (u < 0 || u > total) {
      g.visible = false
      return
    }
    g.visible = true
    let i = 1
    while (i < chegadas.length - 1 && u > chegadas[i]) i++
    const saida = chegadas[i - 1] + (i > 1 ? espera : 0)
    const [a, b] = [pontos[i - 1], pontos[i]]
    const s = u <= saida ? 0 : Math.min(1, (u - saida) / (chegadas[i] - saida))
    g.position.set(a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s)
    g.lookAt(g.position.x + b[0] - a[0], g.position.y, g.position.z + b[2] - a[2])
  })

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}

/** Mostra `children` só entre `de` e `ate` segundos de um ciclo que se repete a cada `periodo`. */
export function Janela({
  periodo,
  de,
  ate,
  atraso = 0,
  ativo = true,
  children,
}: {
  periodo: number
  de: number
  ate: number
  atraso?: number
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
    const u = t < 0 ? -1 : t % periodo
    g.visible = u >= de && u < ate
  })
  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}
