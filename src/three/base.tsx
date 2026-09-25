import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { Group, Object3D, PerspectiveCamera } from 'three'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  Suspense,
  type ReactNode,
  type RefObject,
} from 'react'
import { Medidor } from '../dev/Medidor'
import { RESOLUCOES, useConfig } from '../engine/config'
import type { CenaProps } from '../engine/tipos'
import { ArvoreKenney } from './kenney'
import {
  caixaUnitaria,
  discoSombra,
  esferaUnitaria,
  geometriaCilindro,
  material,
  materialSombraFalsa,
  type OpcoesMaterial,
} from './recursos'

export type V3 = [number, number, number]

type Forma = OpcoesMaterial & { pos?: V3; rot?: V3; sombra?: boolean }

export function Caixa({ tam, pos, rot, sombra = true, ...m }: Forma & { tam: V3 }) {
  return (
    <mesh
      geometry={caixaUnitaria}
      material={material(m)}
      position={pos}
      rotation={rot}
      scale={tam}
      castShadow={sombra}
      receiveShadow
    />
  )
}

/** Cilindro (ou cone, com `raio` 0) com geometria em cache por dimensões. */
export function Cilindro({
  raio,
  raioBase,
  altura,
  lados = 16,
  pos,
  rot,
  sombra = true,
  ...m
}: Forma & { raio: number; raioBase?: number; altura: number; lados?: number }) {
  return (
    <mesh
      geometry={geometriaCilindro(raio, raioBase ?? raio, altura, lados)}
      material={material(m)}
      position={pos}
      rotation={rot}
      castShadow={sombra}
      receiveShadow
    />
  )
}

export function Esfera({ raio, pos, sombra = true, ...m }: Forma & { raio: number }) {
  return <mesh geometry={esferaUnitaria} material={material(m)} position={pos} scale={raio} castShadow={sombra} />
}

/** Mancha escura no chão para objetos que se movem (eles não entram no mapa de sombras). */
export function SombraFalsa({ raio, pos }: { raio: number; pos?: V3 }) {
  return <mesh geometry={discoSombra} material={materialSombraFalsa} position={pos} scale={[raio, 1, raio]} />
}

/**
 * Mapa de sombras sob demanda: a cena é quase toda estática, então refazer as sombras
 * a cada quadro (um render extra da cena inteira) é desperdício. Elas são refeitas por
 * alguns quadros quando `versao` muda ou quando alguém chama useAtualizarSombras().
 * Regra para quem cria cenas: o que se move sozinho usa sombra={false} (+ SombraFalsa).
 */
const QUADROS_DE_SOMBRA = 45
const AtualizarSombras = createContext<() => void>(() => {})
export const useAtualizarSombras = () => useContext(AtualizarSombras)

function SombrasSobDemanda({ versao, children }: { versao: unknown; children: ReactNode }) {
  const gl = useThree((s) => s.gl)
  const restantes = useRef(0)
  const atualizar = useCallback(() => {
    restantes.current = QUADROS_DE_SOMBRA
  }, [])
  useLayoutEffect(() => {
    gl.shadowMap.autoUpdate = false
    atualizar()
  }, [gl, versao, atualizar])
  useFrame(() => {
    if (restantes.current > 0) {
      restantes.current--
      gl.shadowMap.needsUpdate = true
    }
  })
  return <AtualizarSombras.Provider value={atualizar}>{children}</AtualizarSombras.Provider>
}

/**
 * Camada DOM fixa por cima do canvas onde os <Html> são montados. Sem ela o drei
 * escolhe o alvo antes do R3F conectar os eventos, troca de alvo logo depois e o
 * primeiro rótulo de cada cena fica vazio.
 */
const Camada = createContext<RefObject<HTMLDivElement | null> | null>(null)

/**
 * Resolução escolhida pelo usuário (480/720/1080): é a altura, em pixels, que o canvas
 * desenha. O pixel ratio sai da altura do canvas na tela, então vale para qualquer
 * tamanho de janela ou densidade de tela.
 */
const pixelRatio = (resolucao: number, altura: number) => Math.min(Math.max(resolucao / Math.max(altura, 1), 0.3), 2.5)

function Resolucao({ alvo }: { alvo: number }) {
  const altura = useThree((s) => s.size.height)
  const setDpr = useThree((s) => s.setDpr)
  useEffect(() => setDpr(pixelRatio(alvo, altura)), [alvo, altura, setDpr])
  return null
}

function SeletorResolucao() {
  const resolucao = useConfig((s) => s.resolucao)
  const setResolucao = useConfig((s) => s.setResolucao)
  return (
    <div className="seletor-resolucao" role="radiogroup" aria-label="Resolução da cena 3D">
      <span>Resolução</span>
      {RESOLUCOES.map((r) => (
        <button key={r} role="radio" aria-checked={r === resolucao} className={r === resolucao ? 'ativo' : ''} onClick={() => setResolucao(r)}>
          {r}p
        </button>
      ))}
    </div>
  )
}

/**
 * O painel lateral cobre a direita da tela (ou a parte de baixo no celular):
 * desloca o centro da projeção para a cena ficar centralizada na área livre.
 * (O canvas continua em tela cheia para o chão da cena não terminar num corte seco ao lado do painel.)
 */
function Enquadrar() {
  const { camera, size } = useThree()
  useEffect(() => {
    const cam = camera as PerspectiveCamera
    if (size.width > 820) {
      const painel = 446
      cam.setViewOffset(size.width + painel, size.height, painel, 0, size.width, size.height)
    } else {
      const painel = size.height * 0.5
      cam.setViewOffset(size.width, size.height + painel, 0, painel, size.width, size.height)
    }
    cam.updateProjectionMatrix()
    return () => {
      cam.clearViewOffset()
    }
  }, [camera, size])
  return null
}

export function Palco({
  camera,
  alvo = [0, 0.6, 0],
  distancia = [6, 30],
  versao,
  children,
}: {
  camera: V3
  alvo?: V3
  distancia?: [number, number]
  /** Muda quando a cena muda de estado: dispara a atualização das sombras. */
  versao?: unknown
  children: ReactNode
}) {
  const camada = useRef<HTMLDivElement>(null)
  const resolucao = useConfig((s) => s.resolucao)
  return (
    <div className="palco">
      <Camada.Provider value={camada}>
        <Canvas
          shadows
          dpr={pixelRatio(resolucao, window.innerHeight)}
          camera={{ position: camera, fov: 38 }}
          gl={{ alpha: true, antialias: true, stencil: false, powerPreference: 'high-performance' }}
        >
          <Resolucao alvo={resolucao} />
          <Enquadrar />
          {import.meta.env.DEV && <Medidor />}
          <hemisphereLight args={['#ffffff', '#b7c9a8', 1.1]} />
          <directionalLight
            position={[8, 14, 6]}
            intensity={1.7}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-camera-near={1}
            shadow-camera-far={40}
            shadow-bias={-0.0006}
          />
          <OrbitControls
            target={alvo}
            enableDamping
            enablePan={false}
            minDistance={distancia[0]}
            maxDistance={distancia[1]}
            maxPolarAngle={1.32}
          />
          <SombrasSobDemanda versao={versao}>{children}</SombrasSobDemanda>
        </Canvas>
        <div ref={camada} className="camada-rotulos" />
      </Camada.Provider>
      <SeletorResolucao />
    </div>
  )
}

/** Ilha flutuante que serve de chão das cenas (visual de maquete). */
export function Ilha({ raio = 9, cor = '#a9d18e' }: { raio?: number; cor?: string }) {
  return (
    <group>
      <Cilindro raio={raio} altura={0.4} lados={48} pos={[0, -0.2, 0]} cor={cor} sombra={false} />
      <Cilindro raio={raio * 0.97} raioBase={raio * 0.7} altura={1.6} lados={48} pos={[0, -1.2, 0]} cor="#b98a5e" sombra={false} />
      <Cilindro raio={raio * 0.7} raioBase={raio * 0.25} altura={1.4} lados={48} pos={[0, -2.7, 0]} cor="#946a45" sombra={false} />
    </group>
  )
}

export function Arvore({ pos, escala = 1 }: { pos: V3; escala?: number }) {
  return (
    <group position={pos} scale={escala}>
      <Suspense fallback={<ArvorePropria />}><ArvoreKenney pos={pos} /></Suspense>
    </group>
  )
}

function ArvorePropria() {
  return (
    <group>
      <Cilindro raio={0.08} altura={0.5} pos={[0, 0.25, 0]} cor="#8a5a3b" />
      <Cilindro raio={0} raioBase={0.42} altura={0.9} lados={7} pos={[0, 0.85, 0]} cor="#4f9a57" />
      <Cilindro raio={0} raioBase={0.3} altura={0.65} lados={7} pos={[0, 1.25, 0]} cor="#5fae63" />
    </group>
  )
}

/** Plataforma de concreto onde fica cada "casa" (dispositivo) da cidade. */
export function Lote({ pos, tam = [2.4, 2.4] }: { pos: V3; tam?: [number, number] }) {
  return <Caixa tam={[tam[0], 0.12, tam[1]]} pos={[pos[0], 0.06, pos[2]]} cor="#ece6da" sombra={false} />
}

function useCamada() {
  // o drei tipa o portal como RefObject<HTMLElement>, mas só lê .current depois do mount
  return (useContext(Camada) ?? undefined) as RefObject<HTMLElement> | undefined
}

export function Rotulo({
  pos,
  children,
  escuro,
  apagado,
  classe = '',
}: {
  pos: V3
  children: ReactNode
  escuro?: boolean
  apagado?: boolean
  /** Classes extras do CSS (ex.: "bits", "grande", "emoji"). */
  classe?: string
}) {
  // O <Html> do drei não segue o `visible` do three: o rótulo some quando algum
  // ancestral está invisível (pacote fora da viagem, nível escondido do zoom…).
  const ancora = useRef<Group>(null)
  const caixa = useRef<HTMLDivElement>(null)
  useFrame(() => {
    let o: Object3D | null = ancora.current
    let visivel = true
    while (o) {
      if (!o.visible) {
        visivel = false
        break
      }
      o = o.parent
    }
    if (caixa.current) caixa.current.style.visibility = visivel ? '' : 'hidden'
  })
  return (
    <group ref={ancora} position={pos}>
      <Html center zIndexRange={[4, 0]} portal={useCamada()}>
        <div ref={caixa} className={`rotulo ${escuro ? 'escuro' : ''} ${apagado ? 'apagado' : ''} ${classe}`}>{children}</div>
      </Html>
    </group>
  )
}

/** Caixa de HTML presa num canto da tela (não acompanha a câmera). */
export function Fixo({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <Html calculatePosition={() => [x, y]} zIndexRange={[5, 0]} portal={useCamada()}>
      {children}
    </Html>
  )
}

/** Marcador "?" clicável dos passos de explorar; vira "✓" depois de clicado. */
export function Alvo({ id, pos, cena, simbolo = '?' }: { id: string; pos: V3; cena: CenaProps; simbolo?: string }) {
  const portal = useCamada()
  if (!cena.alvos.includes(id)) return null
  const feito = cena.revelados.includes(id)
  return (
    <Html position={pos} center zIndexRange={[4, 0]} portal={portal}>
      <button
        className={`marcador ${feito ? 'feito' : ''}`}
        onClick={() => cena.onRevelar(id)}
        aria-label={feito ? `${id} (já visto)` : `Descobrir: ${id}`}
      >
        {feito ? '✓' : simbolo}
      </button>
    </Html>
  )
}
