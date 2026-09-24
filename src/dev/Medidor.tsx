import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

/**
 * Só em desenvolvimento: ao receber o evento 'medir' no document, mede a cena por 3 s
 * e grava o resultado em <body data-medicao>. Serve para comparar antes/depois de otimizações.
 */
export function Medidor() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const medir = async () => {
      const original = gl.render.bind(gl)
      let ms = 0
      let renders = 0
      let calls = 0
      let tris = 0
      let comSombra = 0
      gl.render = (cena, camera) => {
        if (gl.shadowMap.autoUpdate || gl.shadowMap.needsUpdate) comSombra++
        const a = performance.now()
        original(cena, camera)
        ms += performance.now() - a
        renders++
        calls = gl.info.render.calls
        tris = gl.info.render.triangles
      }
      const tempos: number[] = []
      let ultimo = performance.now()
      await new Promise<void>((fim) => {
        const limite = ultimo + 3000
        const passo = (agora: number) => {
          tempos.push(agora - ultimo)
          ultimo = agora
          if (agora < limite) requestAnimationFrame(passo)
          else fim()
        }
        requestAnimationFrame(passo)
      })
      gl.render = original
      let malhas = 0
      let sombras = 0
      scene.traverse((o) => {
        if ((o as { isMesh?: boolean }).isMesh) {
          malhas++
          if (o.castShadow) sombras++
        }
      })
      tempos.sort((a, b) => a - b)
      document.body.dataset.medicao = JSON.stringify({
        fps: +(tempos.length / 3).toFixed(1),
        frameP95: +tempos[Math.floor(tempos.length * 0.95)].toFixed(1),
        renderMs: +(ms / renders).toFixed(2),
        drawCalls: calls,
        quadrosComSombra: `${comSombra}/${renders}`,
        triangulos: tris,
        malhas,
        lancamSombra: sombras,
        geometrias: gl.info.memory.geometries,
        programas: gl.info.programs?.length,
        dpr: gl.getPixelRatio(),
        canvas: `${gl.domElement.width}x${gl.domElement.height}`,
        rotulos: document.querySelectorAll('.camada-rotulos > div').length,
      })
    }
    document.addEventListener('medir', medir)
    return () => document.removeEventListener('medir', medir)
  }, [gl, scene])

  return null
}
