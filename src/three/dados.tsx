import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import { CanvasTexture, MeshBasicMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, type Group, type Mesh, type Object3D } from 'three'
import { SombraFalsa, type V3 } from './base'

// O que anda pelos cabos: um ícone do tipo de dado (mensagem, música, documento, vídeo...).
// É um cartão desenhado num canvas, sempre de frente para a câmera; a cor do fundo segue a
// convenção de cada cena (vermelho = pedido, azul = resposta, cor de cada computador no P2P).

export type TipoDado = 'mensagem' | 'musica' | 'documento' | 'video' | 'imagem' | 'email' | 'voz'

/**
 * Sequência compartilhada: o dado que `conduz` troca de tipo a cada viagem e anota aqui; os outros
 * (a continuação do caminho, o aviso de chegada) só leem, então mostram sempre o mesmo tipo.
 */
export type Sequencia = { indice: number }

export const TIPOS_DADO: TipoDado[] = ['mensagem', 'musica', 'documento', 'video', 'imagem', 'email', 'voz']

const ROTULO: Record<TipoDado, string> = {
  mensagem: 'MSG',
  musica: 'MP3',
  documento: 'PDF',
  video: 'MP4',
  imagem: 'JPG',
  email: 'E-MAIL',
  voz: 'VOZ',
}

const L = 256

function arredondado(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath()
  c.roundRect(x, y, w, h, r)
}

/** Desenha o símbolo branco de cada tipo na área de cima do cartão (centro em 128, 108). */
function simbolo(c: CanvasRenderingContext2D, tipo: TipoDado, cor: string) {
  c.fillStyle = '#ffffff'
  c.strokeStyle = '#ffffff'
  c.lineWidth = 12
  c.lineJoin = 'round'
  c.lineCap = 'round'
  switch (tipo) {
    case 'mensagem': {
      arredondado(c, 58, 52, 140, 96, 26)
      c.fill()
      c.beginPath()
      c.moveTo(88, 140)
      c.lineTo(78, 172)
      c.lineTo(118, 144)
      c.fill()
      c.fillStyle = cor
      for (const x of [96, 128, 160]) {
        c.beginPath()
        c.arc(x, 100, 11, 0, Math.PI * 2)
        c.fill()
      }
      break
    }
    case 'musica': {
      c.beginPath()
      c.ellipse(96, 150, 24, 18, -0.4, 0, Math.PI * 2)
      c.ellipse(170, 134, 24, 18, -0.4, 0, Math.PI * 2)
      c.fill()
      c.lineWidth = 11
      c.beginPath()
      c.moveTo(117, 148)
      c.lineTo(117, 58)
      c.lineTo(191, 42)
      c.lineTo(191, 132)
      c.stroke()
      c.lineWidth = 18
      c.beginPath()
      c.moveTo(117, 66)
      c.lineTo(191, 50)
      c.stroke()
      break
    }
    case 'documento': {
      c.beginPath()
      c.moveTo(80, 40)
      c.lineTo(150, 40)
      c.lineTo(180, 70)
      c.lineTo(180, 176)
      c.lineTo(80, 176)
      c.closePath()
      c.fill()
      c.fillStyle = cor
      c.beginPath()
      c.moveTo(150, 40)
      c.lineTo(150, 70)
      c.lineTo(180, 70)
      c.closePath()
      c.globalAlpha = 0.45
      c.fill()
      c.globalAlpha = 1
      for (const [y, w] of [[92, 72], [114, 72], [136, 72], [158, 46]]) c.fillRect(94, y, w, 9)
      break
    }
    case 'video': {
      arredondado(c, 50, 54, 156, 110, 18)
      c.fill()
      c.fillStyle = cor
      c.beginPath()
      c.moveTo(112, 80)
      c.lineTo(112, 138)
      c.lineTo(160, 109)
      c.closePath()
      c.fill()
      break
    }
    case 'imagem': {
      arredondado(c, 50, 50, 156, 118, 16)
      c.fill()
      c.fillStyle = cor
      c.beginPath()
      c.arc(160, 84, 15, 0, Math.PI * 2)
      c.fill()
      c.beginPath()
      c.moveTo(62, 156)
      c.lineTo(108, 94)
      c.lineTo(140, 136)
      c.lineTo(158, 116)
      c.lineTo(194, 156)
      c.closePath()
      c.fill()
      break
    }
    case 'email': {
      arredondado(c, 48, 60, 160, 106, 12)
      c.fill()
      c.strokeStyle = cor
      c.lineWidth = 10
      c.beginPath()
      c.moveTo(58, 72)
      c.lineTo(128, 124)
      c.lineTo(198, 72)
      c.stroke()
      break
    }
    case 'voz': {
      // microfone
      arredondado(c, 104, 38, 48, 90, 24)
      c.fill()
      c.lineWidth = 11
      c.beginPath()
      c.arc(128, 100, 44, 0.15, Math.PI - 0.15)
      c.stroke()
      c.beginPath()
      c.moveTo(128, 146)
      c.lineTo(128, 170)
      c.moveTo(102, 172)
      c.lineTo(154, 172)
      c.stroke()
      break
    }
  }
}

const materiais = new Map<string, MeshBasicMaterial>()

/** Selo verde de confirmação (círculo com ✓) no canto de cima, à direita. */
function selo(c: CanvasRenderingContext2D) {
  c.fillStyle = '#23915f'
  c.strokeStyle = '#ffffff'
  c.lineWidth = 10
  c.beginPath()
  c.arc(L - 52, 52, 44, 0, Math.PI * 2)
  c.fill()
  c.stroke()
  c.lineWidth = 13
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.beginPath()
  c.moveTo(L - 74, 54)
  c.lineTo(L - 58, 70)
  c.lineTo(L - 30, 38)
  c.stroke()
}

/** Material do cartão (um por tipo, cor e selo, compartilhado entre todos os cabos). */
function materialDado(tipo: TipoDado, cor: string, confirmado = false) {
  const chave = `${tipo}|${cor}|${confirmado}`
  let m = materiais.get(chave)
  if (m) return m
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = L
  const c = canvas.getContext('2d')!
  // com selo, o cartão encolhe um pouco para o selo caber no canto sem ser cortado
  if (confirmado) {
    c.save()
    c.translate(10, L * 0.16)
    c.scale(0.8, 0.8)
  }
  // borda escura embaixo dá um pouco de volume ao cartão
  c.fillStyle = 'rgba(0,0,0,0.22)'
  arredondado(c, 10, 18, L - 20, L - 22, 44)
  c.fill()
  c.fillStyle = cor
  arredondado(c, 10, 8, L - 20, L - 22, 44)
  c.fill()
  c.strokeStyle = 'rgba(255,255,255,0.85)'
  c.lineWidth = 8
  c.stroke()
  simbolo(c, tipo, cor)
  c.fillStyle = '#ffffff'
  c.font = 'bold 40px system-ui, sans-serif'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText(ROTULO[tipo], L / 2, 212)
  if (confirmado) {
    c.restore()
    selo(c)
  }
  const textura = new CanvasTexture(canvas)
  textura.colorSpace = SRGBColorSpace
  textura.anisotropy = 4
  m = new MeshBasicMaterial({ map: textura, transparent: true, alphaTest: 0.5, toneMapped: false })
  materiais.set(chave, m)
  return m
}

const cartao = new PlaneGeometry(0.46, 0.46)
const q = new Quaternion()

/** Visível de verdade: ele e todos os grupos acima (o Viajante esconde o grupo entre as viagens). */
function visivel(o: Object3D | null) {
  for (; o; o = o.parent) if (!o.visible) return false
  return true
}

/**
 * Um dado viajando. Com `tipo`, é sempre o mesmo; sem ele, troca de tipo a cada viagem
 * (cada vez que reaparece), começando em `inicio` — assim o mesmo cabo mostra vários tipos.
 */
export function Dado({
  cor = '#ef6f6c',
  tipo,
  inicio = 0,
  sombra = true,
  altura = 0.34,
  confirmado = false,
  sequencia,
  conduz = false,
}: {
  cor?: string
  tipo?: TipoDado
  inicio?: number
  /** Sombra no chão (desligar quando o dado anda pelo ar, longe do chão). */
  sombra?: boolean
  /** Altura do centro do cartão acima do ponto do caminho. */
  altura?: number
  /** Com o selo verde de "recebido". */
  confirmado?: boolean
  sequencia?: Sequencia
  /** Este é o dado que avança a `sequencia` (os demais só a seguem). */
  conduz?: boolean
}) {
  const ref = useRef<Mesh>(null)
  const tipos = tipo ? [tipo] : TIPOS_DADO
  const lista = useMemo(() => tipos.map((t) => materialDado(t, cor, confirmado)), [cor, tipo, confirmado])
  const estado = useRef({ indice: inicio % lista.length, antes: false })

  useFrame(({ camera }) => {
    const m = ref.current
    if (!m) return
    // de frente para a câmera, desfazendo a rotação dos grupos acima (o Viajante gira no sentido da viagem)
    m.parent!.getWorldQuaternion(q)
    m.quaternion.copy(q.invert().multiply(camera.quaternion))
    const agora = visivel(m)
    if (sequencia && !conduz) estado.current.indice = sequencia.indice
    else if (agora && !estado.current.antes) {
      estado.current.indice = (estado.current.indice + 1) % lista.length
      if (sequencia) sequencia.indice = estado.current.indice
    }
    const certo = lista[estado.current.indice % lista.length]
    if (m.material !== certo) m.material = certo
    estado.current.antes = agora
  })

  return (
    <group>
      {sombra && <SombraFalsa raio={0.22} pos={[0, 0.005, 0]} />}
      <mesh ref={ref} geometry={cartao} material={lista[estado.current.indice % lista.length]} position={[0, altura, 0]} />
    </group>
  )
}

/** Cresce passando um pouco do tamanho e volta (efeito de "saltar" na tela). */
const saltar = (t: number) => {
  if (t >= 1) return 1
  const s = 1.70158
  const u = t - 1
  return 1 + (s + 1) * u ** 3 + s * u ** 2
}

/**
 * Aviso de "chegou": o ícone do que foi enviado, com o selo verde de confirmação, salta bem
 * na frente da tela de quem recebeu. Aparece em `de` segundos de cada ciclo de `periodo`
 * (o mesmo relógio do envio) e fica até o fim do ciclo. Passe a mesma `sequencia` do dado
 * enviado para os dois mostrarem o mesmo tipo.
 */
export function Chegada({
  pos,
  periodo,
  de,
  cor,
  tipo,
  sequencia,
  escala = 1,
  children,
}: {
  pos: V3
  periodo: number
  de: number
  cor?: string
  tipo?: TipoDado
  /** A mesma sequência do dado enviado: o aviso mostra o tipo que chegou. */
  sequencia?: Sequencia
  escala?: number
  children?: ReactNode
}) {
  const ref = useRef<Group>(null)
  const comeco = useRef<number | null>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    if (comeco.current === null) comeco.current = clock.elapsedTime
    const t = (clock.elapsedTime - comeco.current) % periodo
    g.visible = t >= de
    if (g.visible) g.scale.setScalar(escala * Math.max(0.01, saltar((t - de) / 0.35)))
  })
  return (
    <group ref={ref} position={pos} visible={false}>
      <Dado cor={cor} tipo={tipo} sequencia={sequencia} sombra={false} altura={0} confirmado />
      {children}
    </group>
  )
}
