import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { Group } from 'three'
import { Caixa, Cilindro, Esfera, SombraFalsa, type V3 } from './base'
import { ComputadorKenney, NotebookKenney } from './kenney'
import { material, toroEngrenagem } from './recursos'

type Posicionado = { pos?: V3; rot?: V3; escala?: number }

const TELA_AZUL = '#5fb2f5'

export function Computador({ pos, rot, escala = 1, tela = TELA_AZUL, apagado }: Posicionado & { tela?: string; apagado?: boolean }) {
  const cor = apagado ? '#b9c0c8' : '#e3e8ee'
  // monitor próprio: aparece só enquanto o modelo do Kenney carrega
  const monitor = (
    <>
      <Caixa tam={[0.5, 0.05, 0.35]} pos={[0, 0.025, 0]} cor="#8e99a6" />
      <Caixa tam={[0.1, 0.4, 0.08]} pos={[0, 0.25, -0.05]} cor="#8e99a6" />
      <Caixa tam={[1.2, 0.8, 0.1]} pos={[0, 0.8, 0]} cor="#2d3540" />
      <Caixa tam={[1.08, 0.68, 0.02]} pos={[0, 0.8, 0.055]} cor={apagado ? '#5d6b78' : tela} emissivo={apagado ? undefined : tela} intensidade={0.5} sombra={false} />
      <Caixa tam={[0.95, 0.04, 0.3]} pos={[0, 0.02, 0.5]} cor={cor} />
    </>
  )
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Suspense fallback={monitor}><ComputadorKenney tela={tela} apagado={apagado} /></Suspense>
      {/* o Kenney não tem gabinete: fica o próprio */}
      <Caixa tam={[0.42, 0.9, 0.85]} pos={[0.95, 0.45, -0.1]} cor={cor} />
      <Esfera raio={0.035} pos={[0.95, 0.75, 0.33]} cor="#39d97a" emissivo="#39d97a" intensidade={1.2} sombra={false} />
    </group>
  )
}

export function Notebook({ pos, rot, escala = 1, tela = TELA_AZUL }: Posicionado & { tela?: string }) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Suspense fallback={<NotebookProprio tela={tela} />}><NotebookKenney tela={tela} /></Suspense>
    </group>
  )
}

function NotebookProprio({ tela }: { tela: string }) {
  return (
    <group>
      <Caixa tam={[1, 0.06, 0.7]} pos={[0, 0.03, 0.1]} cor="#39424e" />
      <Caixa tam={[0.85, 0.01, 0.35]} pos={[0, 0.065, 0.05]} cor="#232a33" sombra={false} />
      <group position={[0, 0.06, -0.25]} rotation={[-0.28, 0, 0]}>
        <Caixa tam={[1, 0.66, 0.05]} pos={[0, 0.33, 0]} cor="#39424e" />
        <Caixa tam={[0.9, 0.56, 0.01]} pos={[0, 0.33, 0.03]} cor={tela} emissivo={tela} intensidade={0.5} sombra={false} />
      </group>
    </group>
  )
}

export function Servidor({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.8, 1.7, 0.95]} pos={[0, 0.85, 0]} cor="#d3dae2" />
      {[0.45, 0.75, 1.05, 1.35].map((y) => (
        <Caixa key={y} tam={[0.62, 0.16, 0.02]} pos={[0, y, 0.48]} cor="#8b97a4" sombra={false} />
      ))}
      <Esfera raio={0.04} pos={[0.25, 1.55, 0.49]} cor="#39d97a" emissivo="#39d97a" intensidade={1.4} sombra={false} />
    </group>
  )
}

export function Mainframe({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {[-0.45, 0.45].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Caixa tam={[0.85, 2.6, 1]} pos={[0, 1.3, 0]} cor="#2a2f37" />
          <Caixa tam={[0.06, 1.6, 0.02]} pos={[0.2, 1.4, 0.51]} cor="#5ed36c" emissivo="#5ed36c" intensidade={0.9} sombra={false} />
          <Caixa tam={[0.5, 0.05, 0.02]} pos={[-0.1, 2.2, 0.51]} cor="#5b6470" sombra={false} />
        </group>
      ))}
    </group>
  )
}

/** Terminal "burro": monitor de fósforo verde + teclado, sem processamento próprio. */
export function Terminal({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.8, 0.65, 0.7]} pos={[0, 0.33, -0.05]} cor="#cfc6ae" />
      <Caixa tam={[0.6, 0.45, 0.02]} pos={[0, 0.38, 0.31]} cor="#0f3b1c" emissivo="#2bd66b" intensidade={0.35} sombra={false} />
      <Caixa tam={[0.75, 0.06, 0.28]} pos={[0, 0.03, 0.55]} cor="#cfc6ae" />
    </group>
  )
}

export function Switch({ pos, rot, escala = 1, portas = 5 }: Posicionado & { portas?: number }) {
  const largura = 0.3 + portas * 0.24
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[largura, 0.24, 0.6]} pos={[0, 0.12, 0]} cor="#9aa6b3" />
      {Array.from({ length: portas }, (_, i) => {
        const x = -largura / 2 + 0.27 + i * 0.24
        return (
          <group key={i}>
            <Caixa tam={[0.16, 0.1, 0.02]} pos={[x, 0.11, 0.3]} cor="#2d3540" sombra={false} />
            <Caixa tam={[0.04, 0.03, 0.02]} pos={[x, 0.2, 0.3]} cor="#39d97a" emissivo="#39d97a" intensidade={1} sombra={false} />
          </group>
        )
      })}
    </group>
  )
}

export function Impressora({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.9, 0.45, 0.7]} pos={[0, 0.23, 0]} cor="#e7ebf0" />
      <Caixa tam={[0.6, 0.02, 0.5]} pos={[0, 0.47, -0.05]} cor="#9fb4c9" />
      <Caixa tam={[0.5, 0.5, 0.01]} pos={[0, 0.7, -0.25]} rot={[-0.3, 0, 0]} cor="#ffffff" />
      <Caixa tam={[0.6, 0.03, 0.3]} pos={[0, 0.2, 0.45]} cor="#c9d1da" />
    </group>
  )
}

/** Ponto de acesso (roteador Wi-Fi) com duas antenas. */
export function PontoDeAcesso({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.8, 0.16, 0.5]} pos={[0, 0.08, 0]} cor="#f3f5f8" />
      {[-0.25, 0.25].map((x) => (
        <Cilindro key={x} raio={0.03} altura={0.6} pos={[x, 0.45, -0.18]} cor="#2d3540" />
      ))}
      {[-0.15, 0, 0.15].map((x) => (
        <Esfera key={x} raio={0.025} pos={[x, 0.12, 0.26]} cor="#4db7ff" emissivo="#4db7ff" intensidade={1.2} sombra={false} />
      ))}
    </group>
  )
}

/** Estação base de telefonia celular (torre com painéis de micro-ondas). */
export function EstacaoBase({ pos, rot, escala = 1 }: Posicionado) {
  const altura = 3.2
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2
        return (
          <Cilindro
            key={i}
            raio={0.035}
            altura={altura + 0.05}
            pos={[Math.cos(a) * 0.22, altura / 2, Math.sin(a) * 0.22]}
            rot={[Math.sin(a) * 0.08, 0, -Math.cos(a) * 0.08]}
            cor="#c95a4a"
          />
        )
      })}
      {[0.8, 1.6, 2.4].map((y) => (
        <Cilindro key={y} raio={0.3 - y * 0.05} altura={0.04} pos={[0, y, 0]} cor="#c95a4a" />
      ))}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6
        return (
          <Caixa key={i} tam={[0.16, 0.55, 0.06]} pos={[Math.cos(a) * 0.2, altura - 0.2, Math.sin(a) * 0.2]} rot={[0, -a + Math.PI / 2, 0]} cor="#eef1f4" />
        )
      })}
    </group>
  )
}

export function Celular({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.36, 0.68, 0.06]} pos={[0, 0.34, 0]} cor="#2d3540" />
      <Caixa tam={[0.3, 0.56, 0.01]} pos={[0, 0.35, 0.035]} cor={TELA_AZUL} emissivo={TELA_AZUL} intensidade={0.5} sombra={false} />
    </group>
  )
}

/** Placa de rede: o "dispositivo" que liga o computador ao meio de transmissão. */
export function PlacaDeRede({ pos, rot, escala = 1 }: Posicionado) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.8, 0.45, 0.04]} pos={[0, 0.3, 0]} cor="#2e8b57" />
      <Caixa tam={[0.2, 0.2, 0.05]} pos={[-0.1, 0.32, 0.04]} cor="#222831" />
      <Caixa tam={[0.12, 0.12, 0.05]} pos={[0.2, 0.36, 0.04]} cor="#222831" />
      <Caixa tam={[0.5, 0.06, 0.05]} pos={[0.05, 0.06, 0]} cor="#e4b74a" emissivo="#e4b74a" intensidade={0.25} />
      <Caixa tam={[0.06, 0.55, 0.14]} pos={[-0.43, 0.3, 0]} cor="#c3cad2" />
    </group>
  )
}

/** Livro de regras: representa um protocolo ("Regra 1, Regra 2, …, Regra n"). */
export function LivroDeRegras({ pos, rot, escala = 1, cor = '#e2703a' }: Posicionado & { cor?: string }) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 1.6) * 0.06
  })
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <group ref={ref}>
        {/* flutua: fica fora do mapa de sombras (ver SombrasSobDemanda) */}
        <Caixa tam={[0.5, 0.64, 0.14]} pos={[0, 0, 0]} cor={cor} sombra={false} />
        <Caixa tam={[0.44, 0.58, 0.15]} pos={[0.03, 0, 0]} cor="#fbf7ee" sombra={false} />
        <Caixa tam={[0.06, 0.64, 0.16]} pos={[-0.24, 0, 0]} cor={cor} sombra={false} />
      </group>
    </group>
  )
}

export function Envelope({ pos, rot, escala = 1, cor = '#ef6f6c' }: Posicionado & { cor?: string }) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.5, 0.32, 0.05]} pos={[0, 0, 0]} cor="#ffffff" sombra={false} />
      <Caixa tam={[0.3, 0.035, 0.06]} pos={[-0.12, 0.06, 0]} rot={[0, 0, -0.55]} cor={cor} sombra={false} />
      <Caixa tam={[0.3, 0.035, 0.06]} pos={[0.12, 0.06, 0]} rot={[0, 0, 0.55]} cor={cor} sombra={false} />
    </group>
  )
}

/** O pacote da cidade: um caminhãozinho que leva um envelope (a mensagem). */
export function Caminhao({ cor = '#ef6f6c', carga = '#ffffff' }: { cor?: string; carga?: string }) {
  const rodas = useRef<Group>(null)
  useFrame((_, dt) => rodas.current?.children.forEach((r) => (r.rotation.x += dt * 8)))
  // Anda o tempo todo: sem sombra real (refazer o mapa de sombras todo quadro é caro).
  return (
    <group>
      {/* frente do caminhão aponta para +z (direção do movimento) */}
      <SombraFalsa raio={0.34} pos={[0, 0.005, 0]} />
      <Caixa tam={[0.34, 0.3, 0.46]} pos={[0, 0.25, -0.08]} cor={carga} sombra={false} />
      <Caixa tam={[0.34, 0.24, 0.2]} pos={[0, 0.22, 0.26]} cor={cor} sombra={false} />
      <Caixa tam={[0.3, 0.1, 0.02]} pos={[0, 0.28, 0.365]} cor="#bfe3ff" sombra={false} />
      <Caixa tam={[0.35, 0.05, 0.3]} pos={[0, 0.28, -0.08]} cor={cor} sombra={false} />
      <group ref={rodas}>
        {[[-0.18, 0.2], [0.18, 0.2], [-0.18, -0.2], [0.18, -0.2]].map(([x, z], i) => (
          <group key={i} position={[x, 0.08, z]}>
            <Cilindro raio={0.08} altura={0.06} lados={10} rot={[0, 0, Math.PI / 2]} cor="#2d3540" sombra={false} />
          </group>
        ))}
      </group>
    </group>
  )
}

/** Engrenagem girando sobre quem está processando os dados. */
export function Processando({ pos, cor = '#f2b134', ativo = true }: { pos: V3; cor?: string; ativo?: boolean }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current && ativo) ref.current.rotation.y += dt * 2.2
  })
  if (!ativo) return null
  return (
    <group ref={ref} position={pos}>
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={toroEngrenagem} material={material({ cor, emissivo: cor, intensidade: 0.7 })} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <Caixa key={i} tam={[0.12, 0.1, 0.12]} pos={[Math.cos(a) * 0.38, 0, Math.sin(a) * 0.38]} rot={[0, -a, 0]} cor={cor} emissivo={cor} intensidade={0.7} sombra={false} />
      })}
    </group>
  )
}

/** Roteador (o "disco com setas" dos diagramas de rede): liga redes diferentes. */
export function Roteador({ pos, rot, escala = 1, cor = '#3b6fb5' }: Posicionado & { cor?: string }) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Cilindro raio={0.5} altura={0.34} lados={20} pos={[0, 0.17, 0]} cor={cor} />
      <Caixa tam={[0.66, 0.03, 0.09]} pos={[0, 0.355, 0]} cor="#ffffff" sombra={false} />
      <Caixa tam={[0.09, 0.03, 0.66]} pos={[0, 0.355, 0]} cor="#ffffff" sombra={false} />
      <Esfera raio={0.04} pos={[0, 0.2, 0.5]} cor="#39d97a" emissivo="#39d97a" intensidade={1.2} sombra={false} />
    </group>
  )
}

/** Telefone fixo de mesa (a comutação por circuitos nasceu na telefonia). */
export function Telefone({ pos, rot, escala = 1, cor = '#2f7fd0' }: Posicionado & { cor?: string }) {
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa tam={[0.8, 0.3, 0.7]} pos={[0, 0.15, 0]} cor={cor} />
      <Caixa tam={[0.4, 0.02, 0.36]} pos={[0.12, 0.31, 0.1]} cor="#f4f6f8" sombra={false} />
      <Caixa tam={[0.2, 0.16, 0.8]} pos={[-0.27, 0.4, 0]} cor={cor} />
      <Caixa tam={[0.24, 0.1, 0.22]} pos={[-0.27, 0.36, 0.34]} cor="#1f5a99" sombra={false} />
      <Caixa tam={[0.24, 0.1, 0.22]} pos={[-0.27, 0.36, -0.34]} cor="#1f5a99" sombra={false} />
    </group>
  )
}
