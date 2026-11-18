import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Notebook, PontoDeAcesso, Switch } from '../../../three/modelos'
import { arco, Cabo, Ondas, Pulsos, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Elipse } from '../../t8/cenas/comum'

// Fase 9.8 — WLAN 802.11 (Aula 08 p. 23–25).
// 'bss': AP + rede cabeada + 3 notebooks; 'ess': dois BSS unidos por um switch;
// 'adhoc': 4 notebooks sem AP (estado `saindo`); 'csma': 4 etapas do CSMA (estado `etapa` 1–4).

const VERMELHO = '#ef6f6c'
const AZUL = '#3aa0e6'
const VERDE = '#39b36a'
const AMARELO = '#f2b134'
const SINAL = '#2f7fd0'

const alto = (p: V3, y = 0.9): V3 => [p[0], y, p[2]]
const virado = (de: V3, para: V3): V3 => [0, Math.atan2(para[0] - de[0], para[2] - de[2]), 0]

/** Pacote que anda de `de` a `para` no ar (arco) uma vez por ciclo. */
function Trecho({ de, para, atraso, ciclo, cor = VERMELHO, altura = 0.6 }: { de: V3; para: V3; atraso: number; ciclo: number; cor?: string; altura?: number }) {
  const curva = useCurva(arco(de, para, altura))
  return (
    <Viajante curva={curva} duracao={1.6} pausa={ciclo - 1.6} atraso={atraso}>
      <Dado cor={cor} sombra={false} />
    </Viajante>
  )
}

// ---------------------------------------------------------------- BSS

const AP_BSS: V3 = [0.8, 0.12, -1.2]
const NB_BSS: V3[] = [[-3.4, 0.12, 2.4], [0.8, 0.12, 3.6], [4.4, 0.12, 2.0]]

function Bss() {
  const CICLO = 10
  const ap = alto(AP_BSS, 1.0)
  const n = NB_BSS.map((p) => alto(p, 0.7))
  return (
    <>
      <Elipse pos={[0.4, 0, 1.2]} rx={5.4} rz={4.4} cor={SINAL} />

      {/* rede cabeada: barra no chão saindo do AP */}
      <Caixa tam={[5.0, 0.12, 0.3]} pos={[-2.2, 0.06, AP_BSS[2]]} cor="#2f5fa0" />
      <Caixa tam={[0.5, 0.5, 0.9]} pos={[-5.0, 0.25, AP_BSS[2]]} cor="#4a5a6a" />
      <Rotulo pos={[-4.6, 1.0, AP_BSS[2]]} escuro>
        Rede cabeada
      </Rotulo>

      <PontoDeAcesso pos={AP_BSS} escala={1.4} />
      <Ondas pos={[AP_BSS[0], 1.0, AP_BSS[2]]} cor={AZUL} raio={4.5} periodo={2.6} quantidade={3} />
      <Rotulo pos={[AP_BSS[0], 2.4, AP_BSS[2]]} classe="mini">
        AP
      </Rotulo>

      {NB_BSS.map((p, k) => (
        <group key={k}>
          <Notebook pos={p} rot={virado(p, AP_BSS)} escala={0.9} />
          <Rotulo pos={[p[0], 1.3, p[2]]} classe="mini">
            Host {k + 1}
          </Rotulo>
        </group>
      ))}

      {/* host 1 → AP → host 3, depois host 3 → AP → host 2: nunca direto */}
      <Trecho de={n[0]} para={ap} atraso={0} ciclo={CICLO} />
      <Trecho de={ap} para={n[2]} atraso={1.9} ciclo={CICLO} />
      <Trecho de={n[2]} para={ap} atraso={5} ciclo={CICLO} cor={AZUL} />
      <Trecho de={ap} para={n[1]} atraso={6.9} ciclo={CICLO} cor={AZUL} />

      <Rotulo pos={[0.4, 3.5, -1.2]} classe="grande">
        Infraestructure BSS
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- ESS

function Bss2({ cx, k }: { cx: number; k: number }) {
  const ap: V3 = [cx, 0.12, -1.5]
  const nbs: V3[] = [[cx - 1.4, 0.12, 1.6], [cx + 1.4, 0.12, 1.6]]
  return (
    <>
      <Elipse pos={[cx, 0, 0.2]} rx={2.55} rz={3.3} cor={SINAL} />
      <Rotulo pos={[cx, 0.1, -3.7]} classe="mini">
        BSS {k}
      </Rotulo>
      <PontoDeAcesso pos={ap} escala={1.2} />
      <Ondas pos={[cx, 0.9, -1.5]} cor={AZUL} raio={2.6} periodo={2.6} quantidade={2} />
      {nbs.map((p, i) => {
        const a = alto(ap, 0.9)
        const b = alto(p, 0.7)
        return (
          <group key={i}>
            <Notebook pos={p} rot={virado(p, ap)} escala={0.8} />
            <Trecho de={b} para={a} atraso={i * 2.2} ciclo={9} altura={0.4} />
          </group>
        )
      })}
    </>
  )
}

function Ess() {
  const SW: V3 = [0, 0.12, -1.5]
  const cabo1 = useCurva([[-3.3, 0.15, -1.5], [-0.6, 0.15, -1.5]])
  const cabo2 = useCurva([[3.3, 0.15, -1.5], [0.6, 0.15, -1.5]])
  return (
    <>
      <Bss2 cx={-3.3} k={1} />
      <Bss2 cx={3.3} k={2} />
      <Switch pos={SW} escala={1.1} />
      <Rotulo pos={[0, 1.0, -1.5]} escuro>
        Switch Ethernet
      </Rotulo>
      <Cabo curva={cabo1} cor="#2f5fa0" />
      <Cabo curva={cabo2} cor="#2f5fa0" />
      <Pulsos curva={cabo1} cor={VERMELHO} quantidade={2} duracao={2.4} tamanho={0.09} />
      <Pulsos curva={cabo2} cor={AZUL} quantidade={2} duracao={2.4} tamanho={0.09} />
      <Rotulo pos={[0, 3.6, -1.5]} classe="grande">
        Infraestructure ESS
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- Ad hoc

const AD: V3[] = [[0, 0.12, -2.0], [-3.6, 0.12, 0.8], [3.4, 0.12, 0.8], [0, 0.12, 3.4]]
const AD_FORA: V3 = [5.3, 0.12, 3.8]
const LIGACOES: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2]]

function Sinal({ de, para }: { de: V3; para: V3 }) {
  const curva = useCurva(arco(alto(de, 0.8), alto(para, 0.8), 0.4))
  return <Pulsos curva={curva} cor={SINAL} quantidade={2} duracao={2} tamanho={0.07} />
}

function AdHoc({ saindo }: { saindo: boolean }) {
  const pos = (i: number): V3 => (saindo && i === 2 ? AD_FORA : AD[i])
  const centro: V3 = [0, 0.12, 0.8]
  return (
    <>
      {AD.map((_, i) => {
        const p = pos(i)
        return (
          <group key={i}>
            <Notebook pos={p} rot={virado(p, centro)} escala={0.9} />
            {saindo && i === 2 && (
              <Rotulo pos={[p[0], 1.4, p[2]]} classe="mini">
                fora do alcance
              </Rotulo>
            )}
          </group>
        )
      })}
      {LIGACOES.filter(([a, b]) => !(saindo && (a === 2 || b === 2))).map(([a, b]) => (
        <Sinal key={`${a}-${b}`} de={AD[a]} para={AD[b]} />
      ))}
      <Rotulo pos={[0, 3.5, 0.8]} classe="grande">
        Ad hoc · sem controle centralizado
      </Rotulo>
    </>
  )
}

// ---------------------------------------------------------------- CSMA

const APC: V3 = [0, 0.12, -2.6]
const EST: { l: string; p: V3; cor: string }[] = [
  { l: 'A', p: [-4.2, 0.12, 0.2], cor: AZUL },
  { l: 'B', p: [0, 0.12, 1.4], cor: VERDE },
  { l: 'C', p: [4.2, 0.12, 0.2], cor: AMARELO },
]
const SLOTS = 6
const SLOT_T = 1.3
const slotX = (i: number) => (i - (SLOTS - 1) / 2) * 1.1
const SLOT_Z = 0
// a linha do tempo fica de pé, no ar, atrás das estações (no chão à frente ela saía da tela)
const LINHA_POS: V3 = [0, 3.0, -0.8]
const LINHA_ROT: V3 = [Math.PI * 0.42, 0, 0]

function Linha({ etapa }: { etapa: number }) {
  const realce = useRef<Group>(null)
  const pacote = useRef<Group>(null)
  const grupoTx = useRef<Group>(null)
  const curvaB = useCurva(arco(alto(EST[1].p, 0.7), alto(APC, 0.9), 0.5))
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % (SLOTS * SLOT_T)
    const i = Math.floor(t / SLOT_T)
    const u = (t % SLOT_T) / SLOT_T
    if (realce.current) realce.current.position.x = slotX(i)
    const ehB = etapa === 4 && i % 3 === 1
    if (pacote.current) {
      pacote.current.visible = ehB
      if (ehB) curvaB.getPointAt(u, pacote.current.position)
    }
    if (grupoTx.current) grupoTx.current.visible = ehB
  })
  return (
    <>
      <group position={LINHA_POS} rotation={LINHA_ROT}>
      <Caixa tam={[SLOTS * 1.1 + 0.3, 0.06, 1.1]} pos={[0, 0.03, SLOT_Z]} cor="#3a4654" />
      {Array.from({ length: SLOTS }, (_, i) => {
        const e = EST[i % 3]
        return (
          <group key={i}>
            <Caixa tam={[0.95, 0.12, 0.8]} pos={[slotX(i), 0.1, SLOT_Z]} cor={e.cor} opacidade={0.85} />
            <Rotulo pos={[slotX(i), 0.45, SLOT_Z]} classe="grande">
              {e.l}
            </Rotulo>
          </group>
        )
      })}
      <Rotulo pos={[0, 0.1, SLOT_Z + 1.2]} classe="mini">
        intervalos pré-alocados →
      </Rotulo>
      {etapa === 4 && (
        <>
          <group ref={realce} position={[slotX(0), 0.2, SLOT_Z]}>
            <Caixa tam={[1.05, 0.04, 0.9]} cor="#fff27a" emissivo="#fff27a" intensidade={0.9} sombra={false} />
          </group>
          <Rotulo pos={[-4.6, 0.1, SLOT_Z]} classe="mini">
            A e C pulam
          </Rotulo>
        </>
      )}
      </group>
      {etapa === 4 && (
        <>
          <group ref={pacote} visible={false}>
            <Dado cor={VERDE} sombra={false} />
          </group>
          <group ref={grupoTx} visible={false}>
            <Rotulo pos={[EST[1].p[0] + 1.6, 1.3, EST[1].p[2]]} classe="mini">
              B transmite no seu intervalo
            </Rotulo>
          </group>
        </>
      )}
    </>
  )
}

function Csma({ etapa }: { etapa: number }) {
  const ap = alto(APC, 1.0)
  const curvaA = useCurva(arco(alto(EST[0].p, 0.7), ap, 0.8))
  return (
    <>
      <PontoDeAcesso pos={APC} escala={1.4} />
      {/* o meio: disco no chão, verde = livre, laranja = ocupado */}
      {etapa <= 2 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.4]}>
          <circleGeometry args={[5.8, 48]} />
          <meshBasicMaterial color={etapa === 1 ? VERDE : '#f28a3a'} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      )}
      {etapa <= 2 && (
        <Rotulo pos={[0, 0.15, -4.6]} classe="mini">
          {etapa === 1 ? 'meio livre' : 'meio ocupado (A transmitindo)'}
        </Rotulo>
      )}
      <Ondas pos={[0, 1.0, APC[2]]} cor={AZUL} raio={4} periodo={3} quantidade={2} ativo={etapa === 1 || etapa === 2} />

      {EST.map((e) => (
        <group key={e.l}>
          <Notebook pos={e.p} rot={virado(e.p, APC)} escala={0.9} />
          <Rotulo pos={[e.p[0], 1.4, e.p[2]]} classe="grande">
            {e.l}
          </Rotulo>
        </group>
      ))}

      {etapa === 1 && (
        <Rotulo pos={[EST[0].p[0], 2.2, EST[0].p[2]]} classe="cartao">
          <span style={{ fontSize: 20 }}>👂</span> escutando…
        </Rotulo>
      )}
      {etapa === 2 && (
        <>
          <Viajante curva={curvaA} duracao={1.8} pausa={0.9}>
            <Dado cor={AZUL} sombra={false} />
          </Viajante>
          <Rotulo pos={[EST[0].p[0], 2.2, EST[0].p[2]]} classe="mini">
            meio livre → transmite
          </Rotulo>
          <Rotulo pos={[EST[1].p[0], 2.0, EST[1].p[2]]} classe="mini">
            ⏳ aguardando
          </Rotulo>
        </>
      )}
      {etapa >= 3 && <Linha etapa={etapa} />}
    </>
  )
}

export function CenaWlan(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'bss'
  const etapa = Math.min(4, Math.max(1, Number(cena.estado.etapa ?? 1)))
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'bss' && <Bss />}
      {modo === 'ess' && <Ess />}
      {modo === 'adhoc' && <AdHoc saindo={!!cena.estado.saindo} />}
      {modo === 'csma' && <Csma etapa={etapa} />}
    </>
  )
}
