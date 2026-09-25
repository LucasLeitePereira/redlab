import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { LinearSRGBColorSpace, Mesh, type MeshStandardMaterial, type Object3D } from 'three'
import { useAtualizarSombras, type V3 } from './base'
import { material } from './recursos'

// Modelos do Kenney (kenney.nl, licença CC0) para o Computador, o Notebook e a Árvore.
// Os feitos à mão (modelos.tsx / base.tsx) só aparecem enquanto os GLBs carregam.
// O poste vem do City Kit (Roads) e usa a textura do kit (Textures/colormap.png).
// Os GLBs ficam em public/modelos/kenney/. As cores do Kenney vêm "cruas" no arquivo
// (valores sRGB gravados como lineares), por isso são relidas como sRGB aqui.

const url = (nome: string) => `${import.meta.env.BASE_URL}modelos/kenney/${nome}.glb`

const ARVORES = [
  // altura do modelo em metros → escala para ficar do tamanho da árvore própria (~1,6)
  { nome: 'tree_default', escala: 0.96 },
  { nome: 'tree_oak', escala: 1.3 },
  { nome: 'tree_cone', escala: 1.15 },
  { nome: 'tree_pineRoundA', escala: 1.2 },
]
const TODOS = ['computerScreen', 'computerKeyboard', 'computerMouse', 'laptop', 'light-square', ...ARVORES.map((a) => a.nome)]
TODOS.forEach((n) => useGLTF.preload(url(n)))

/**
 * Clona o modelo trocando os materiais pelos da casa (cache compartilhado).
 * `tela`: o material "metal" do Kenney é o vidro da tela → vira a cor de estado da cena.
 */
function useModelo(nome: string, tela?: { cor: string; acesa: boolean }) {
  const { scene } = useGLTF(url(nome))
  const atualizarSombras = useAtualizarSombras()
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o: Object3D) => {
      if (!(o instanceof Mesh)) return
      const m = o.material as MeshStandardMaterial
      o.castShadow = true
      o.receiveShadow = true
      o.material =
        tela && m.name === 'metal'
          ? material({ cor: tela.cor, emissivo: tela.acesa ? tela.cor : undefined, intensidade: 0.5 })
          : material({ cor: `#${m.color.getHexString(LinearSRGBColorSpace)}` })
    })
    return c
  }, [scene, tela?.cor, tela?.acesa])
  // o modelo chega depois da cena (Suspense): as sombras precisam ser redesenhadas
  useEffect(() => atualizarSombras(), [clone, atualizarSombras])
  return clone
}

function Peca({ nome, pos, escala, tela }: { nome: string; pos: V3; escala: number; tela?: { cor: string; acesa: boolean } }) {
  const obj = useModelo(nome, tela)
  return <primitive object={obj} position={pos} scale={escala} />
}

/** Mesma área do Computador próprio: monitor ~1,2 × 0,9 centrado, teclado e mouse na frente. */
export function ComputadorKenney({ tela, apagado }: { tela: string; apagado?: boolean }) {
  const s = 3
  return (
    <>
      <Peca nome="computerScreen" pos={[-0.393 * s / 2, 0, 0.052 * s]} escala={s} tela={{ cor: apagado ? '#5d6b78' : tela, acesa: !apagado }} />
      <Peca nome="computerKeyboard" pos={[-0.282 * s / 2, 0, 0.55 + 0.059 * s]} escala={s} />
      <Peca nome="computerMouse" pos={[0.62, 0, 0.55 + 0.042 * s]} escala={s} />
    </>
  )
}

/** Notebook de 1 m de largura (o laptop do Kenney tem 26 cm). */
export function NotebookKenney({ tela }: { tela: string }) {
  const s = 3.8
  return <Peca nome="laptop" pos={[-0.132 * s, 0, 0.12 * s]} escala={s} tela={{ cor: tela, acesa: true }} />
}

/** Sorteia (de forma fixa, pela posição) um dos 4 modelos de árvore. */
export function ArvoreKenney({ pos }: { pos: V3 }) {
  const i = Math.abs(Math.round(pos[0] * 7 + pos[2] * 13)) % ARVORES.length
  const { nome, escala } = ARVORES[i]
  return <Peca nome={nome} pos={[0, 0, 0]} escala={escala} />
}

/** Poste de rua (City Kit Roads): o braço aponta para -z, com a textura original do kit. */
export function PosteKenney({ escala = 1 }: { escala?: number }) {
  const { scene } = useGLTF(url('light-square'))
  const atualizarSombras = useAtualizarSombras()
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o: Object3D) => {
      if (o instanceof Mesh) o.castShadow = o.receiveShadow = true
    })
    return c
  }, [scene])
  useEffect(() => atualizarSombras(), [clone, atualizarSombras])
  return <primitive object={clone} scale={escala} />
}
