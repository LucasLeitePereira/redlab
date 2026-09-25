import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Mesh, type Object3D } from 'three'
import { useAtualizarSombras } from './base'

// Modelos baixados do Poly Pizza (poly.pizza). Diferente dos do Kenney, estes são CC-BY:
// o crédito ao autor precisa aparecer no app (tela "Sobre").
// - telefone.glb: "Phone" por Poly by Google, CC-BY 3.0 — https://poly.pizza/m/esa-gfuZgup
// Os GLBs ficam em public/modelos/poly/ e usam a textura que vem no próprio arquivo.

const url = (nome: string) => `${import.meta.env.BASE_URL}modelos/poly/${nome}.glb`
useGLTF.preload(url('telefone'))

// Caixa do modelo original (unidades do arquivo): x −32,9…36,3, y 0…41, z −47,5…40,2.
const CENTRO_TELEFONE = [(-32.93 + 36.3) / 2, 0, (-47.52 + 40.15) / 2]
const ESCALA_TELEFONE = 0.011 // ~0,76 × 0,45 × 0,97: o mesmo tamanho do telefone feito à mão

/**
 * Telefone de mesa com fone, centrado na origem e apoiado no chão (y = 0). No arquivo o disco
 * aponta para +x; aqui ele é girado para a frente ficar em +z, como no Computador.
 */
export function TelefonePoly() {
  const { scene } = useGLTF(url('telefone'))
  const atualizarSombras = useAtualizarSombras()
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o: Object3D) => {
      if (o instanceof Mesh) o.castShadow = o.receiveShadow = true
    })
    return c
  }, [scene])
  // o modelo chega depois da cena (Suspense): as sombras precisam ser redesenhadas
  useEffect(() => atualizarSombras(), [clone, atualizarSombras])
  const s = ESCALA_TELEFONE
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={clone} scale={s} position={[-CENTRO_TELEFONE[0] * s, 0, -CENTRO_TELEFONE[2] * s]} />
    </group>
  )
}
