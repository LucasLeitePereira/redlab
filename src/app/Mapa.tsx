import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { CatmullRomCurve3, DoubleSide, MeshStandardMaterial, Vector3, type Group, type Mesh } from 'three'
import { Painel } from '../engine/Painel'
import { estrelas, useProgresso } from '../engine/progresso'
import type { Trilha } from '../engine/tipos'
import { Caixa, Cilindro, Palco, Rotulo, useAtualizarSombras, type V3 } from '../three/base'
import { geometriaFaixa, geometriaPista, LARGURA_PISTA } from '../three/estrada'
import { PosteKenney } from '../three/kenney'
import { emSequencia, Ligacao } from '../three/Ligacao'
import { Caminhao, Computador, Servidor, PontoDeAcesso, Switch } from '../three/modelos'
import { curvaSuave, Viajante } from '../three/movimento'
import { TRILHAS } from '../trilhas'
import { ir } from './rota'
import { DESENVOLVEDOR, DISCIPLINA, PROFESSOR, VERSAO } from '../versao'

const POSICOES: V3[] = [[-7.4, 0, 1.2], [-3.7, 0, -2], [0, 0, 1.4], [3.7, 0, -2], [7.4, 0, 1.2]]
const CINZA = '#b8bfc7'
const RAIO_ILHA = 2.1
const MATERIAL_PISTA = new MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: DoubleSide })

/** Miniatura que representa cada trilha em cima da sua ilha. */
function Miniatura({ numero }: { numero: number }) {
  switch (numero) {
    case 1:
      return (
        <group scale={0.6}>
          <Computador pos={[-1.4, 0, 0]} />
          <Computador pos={[1.0, 0, 0]} tela="#8fd9a8" />
          <Ligacao pontos={curvaSuave([-0.45, 0.05, 0.4], [1.95, 0.05, 0.4], 0.55)} viagens={[{ duracao: 2 }]} surgir={0.12} caminhao />
        </group>
      )
    case 2:
      return (
        <group scale={0.55}>
          <Switch pos={[0, 0, 0]} portas={4} />
          {[[-1.8, -1.2], [1.8, -1.2], [-1.8, 1.4], [1.8, 1.4]].map(([x, z], i) => (
            <Caixa key={i} tam={[0.6, 0.5, 0.5]} pos={[x, 0.25, z]} cor="#e3e8ee" />
          ))}
        </group>
      )
    case 3:
      return (
        <group>
          {[1, 1, 0, 0, 0, 0, 0, 0].map((b, i) => (
            <Caixa key={i} tam={[0.3, 0.3, 0.3]} pos={[-1.2 + i * 0.34, 0.2 + b * 0.15, 0]} cor={b ? '#cf4b47' : '#f4f1ea'} />
          ))}
        </group>
      )
    case 4:
      return (
        <group scale={0.6}>
          <Servidor pos={[-0.8, 0, 0]} />
          <PontoDeAcesso pos={[1, 0, 0.3]} />
        </group>
      )
    default:
      return (
        <group scale={0.6}>
          {['#b9892a', '#b9892a', '#8a3f17', '#34506e', '#2d5a2a', '#2d5a2a', '#2d5a2a'].map((cor, i) => (
            <Caixa key={i} tam={[1.1, 0.26, 0.8]} pos={[0, 0.14 + i * 0.28, 0]} cor={cor} />
          ))}
        </group>
      )
  }
}

type Alturas = RefObject<number[]>

function IlhaTrilha({ trilha, pos, selecionada, indice, alturas }: { trilha: Trilha; pos: V3; selecionada: boolean; indice: number; alturas: Alturas }) {
  const [sobre, setSobre] = useState(false)
  const ref = useRef<Group>(null)
  const alvoY = selecionada ? 0.35 : sobre ? 0.18 : 0
  // a ilha sobe/desce: as sombras dela precisam acompanhar
  const atualizarSombras = useAtualizarSombras()
  useEffect(atualizarSombras, [alvoY, atualizarSombras])
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.position.y += (alvoY - ref.current.position.y) * Math.min(1, dt * 8)
    alturas.current[indice] = ref.current.position.y
  })
  const cor = trilha.disponivel ? trilha.cor : CINZA

  return (
    <group
      ref={ref}
      position={pos}
      onClick={(e) => {
        e.stopPropagation()
        ir(`/trilha/${trilha.id}`)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setSobre(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setSobre(false)
        document.body.style.cursor = ''
      }}
    >
      <Cilindro raio={RAIO_ILHA} altura={0.35} lados={32} pos={[0, -0.18, 0]} cor={trilha.disponivel ? '#a9d18e' : '#cfd5cc'} />
      <Cilindro raio={2.0} raioBase={1.2} altura={1.1} lados={32} pos={[0, -0.9, 0]} cor="#b98a5e" sombra={false} />
      {/* aro na borda: a cor da trilha, acesa quando selecionada */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[2.06, selecionada ? 0.1 : 0.06, 8, 48]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={selecionada ? 0.6 : 0} />
      </mesh>
      <group position={[0, 0.05, 0]}>
        <Miniatura numero={trilha.numero} />
      </group>
      <Rotulo pos={[0, 2.5, 0]} escuro={selecionada}>
        {trilha.disponivel ? '' : '🔒 '}Trilha {trilha.numero}<small>{trilha.titulo}</small>
      </Rotulo>
    </group>
  )
}

/** Onde a rua começa em cima da ilha (distância do centro) e a mão de cada caminhão. */
const PONTA = 1.55
const MAO = 0.15

/**
 * Centro da pista entre as ilhas `de` e `para`, cada uma na altura `ya`/`yb`:
 * começa em cima da ilha, passa por cima do aro da borda e faz uma lombada leve sobre o vão.
 */
function pontosPonte(de: number, para: number, ya: number, yb: number): V3[] {
  const a = POSICOES[de]
  const b = POSICOES[para]
  const dx = b[0] - a[0]
  const dz = b[2] - a[2]
  const d = Math.hypot(dx, dz)
  const noA = (r: number, y: number): V3 => [a[0] + (dx / d) * r, y, a[2] + (dz / d) * r]
  const noB = (r: number, y: number): V3 => [b[0] - (dx / d) * r, y, b[2] - (dz / d) * r]
  return [
    noA(PONTA, ya + 0.01),
    noA(RAIO_ILHA, ya + 0.1),
    [(a[0] + b[0]) / 2, (ya + yb) / 2 + 0.15, (a[2] + b[2]) / 2],
    noB(RAIO_ILHA, yb + 0.1),
    noB(PONTA, yb + 0.01),
  ]
}

/** Postes nas cabeceiras: um em cada ilha, do lado direito de quem sai dela, com o braço sobre a pista. */
function postesPonte(de: number, para: number, ya: number, yb: number) {
  const a = POSICOES[de]
  const b = POSICOES[para]
  const dx = (b[0] - a[0]) / Math.hypot(b[0] - a[0], b[2] - a[2])
  const dz = (b[2] - a[2]) / Math.hypot(b[0] - a[0], b[2] - a[2])
  const r = 1.8
  const lado = LARGURA_PISTA / 2 + 0.08
  // direita de quem anda na direção (dx, dz) = (-dz, dx)
  return [
    { pos: [a[0] + dx * r - dz * lado, ya, a[2] + dz * r + dx * lado] as V3, rotY: Math.atan2(-dz, dx) },
    { pos: [b[0] - dx * r + dz * lado, yb, b[2] - dz * r - dx * lado] as V3, rotY: Math.atan2(dz, -dx) },
  ]
}

/**
 * Rua em arco entre duas ilhas vizinhas, com um caminhão em cada mão.
 * As ilhas sobem ao passar o mouse ou ao selecionar: a rua acompanha a altura delas,
 * para o caminhão nunca passar por dentro do chão.
 */
function Ponte({ de, para, alturas }: { de: number; para: number; alturas: Alturas }) {
  const curva = useMemo(
    () => new CatmullRomCurve3(pontosPonte(de, para, 0, 0).map((p) => new Vector3(...p)), false, 'centripetal'),
    [de, para],
  )
  const inicial = useMemo(() => ({ pista: geometriaPista(curva), faixa: geometriaFaixa(curva) }), [curva])
  const pista = useRef<Mesh>(null)
  const faixa = useRef<Mesh>(null)
  const postes = useRef<(Group | null)[]>([])
  const montada = useRef<[number, number]>([0, 0])
  useEffect(
    () => () => {
      pista.current?.geometry.dispose()
      faixa.current?.geometry.dispose()
    },
    [],
  )

  useFrame(() => {
    const ya = alturas.current[de]
    const yb = alturas.current[para]
    const [ma, mb] = montada.current
    if (!pista.current || !faixa.current || (Math.abs(ya - ma) < 2e-4 && Math.abs(yb - mb) < 2e-4)) return
    montada.current = [ya, yb]
    pontosPonte(de, para, ya, yb).forEach((p, i) => curva.points[i].set(...p))
    curva.updateArcLengths()
    pista.current.geometry.dispose()
    pista.current.geometry = geometriaPista(curva)
    faixa.current.geometry.dispose()
    faixa.current.geometry = geometriaFaixa(curva)
    postesPonte(de, para, ya, yb).forEach((p, i) => postes.current[i]?.position.set(...p.pos))
  })

  const viagens = emSequencia([
    { cor: TRILHAS[de].cor, duracao: 2.8, atraso: de * 0.7 },
    { cor: TRILHAS[para].cor, duracao: 2.8, atraso: 0.1 + de * 0.7, inverso: true },
  ])
  return (
    <>
      <mesh ref={pista} geometry={inicial.pista} material={MATERIAL_PISTA} castShadow receiveShadow />
      <mesh ref={faixa} geometry={inicial.faixa} material={MATERIAL_PISTA} />
      {postesPonte(de, para, 0, 0).map((p, i) => (
        <group key={i} ref={(g) => { postes.current[i] = g }} position={p.pos} rotation={[0, p.rotY, 0]}>
          <Suspense fallback={null}>
            <PosteKenney escala={1.1} />
          </Suspense>
        </group>
      ))}
      {viagens.map((v, i) => (
        <Viajante key={i} curva={curva} duracao={v.duracao} pausa={v.pausa} atraso={v.atraso} inverso={v.inverso} lado={MAO} inclinar surgir={0.12}>
          <group scale={0.8}>
            <Caminhao cor={v.cor} />
          </group>
        </Viajante>
      ))}
    </>
  )
}

function CenaMapa({ selecionada }: { selecionada?: string }) {
  const alturas = useRef(POSICOES.map(() => 0))
  return (
    <>
      {TRILHAS.map((t, i) => (
        <IlhaTrilha key={t.id} trilha={t} pos={POSICOES[i]} selecionada={t.id === selecionada} indice={i} alturas={alturas} />
      ))}
      {POSICOES.slice(0, -1).map((_, i) => (
        <Ponte key={i} de={i} para={i + 1} alturas={alturas} />
      ))}
    </>
  )
}

export function Mapa({ trilhaId }: { trilhaId?: string }) {
  const trilha = TRILHAS.find((t) => t.id === trilhaId)
  const { fases, chefoes, zerar } = useProgresso()
  const [confirmarZerar, setConfirmarZerar] = useState(false)
  const [sobre, setSobre] = useState(false)

  return (
    <div className="tela">
      <div className="ceu">
        <Palco camera={[0, 12, 21]} alvo={[0, 0, -0.3]} distancia={[10, 34]}>
          <CenaMapa selecionada={trilhaId} />
        </Palco>
      </div>

      <header className="hud-topo">
        <div className="hud-titulo marca">
          <img src="/icone.svg" alt="" />
          RedeLab
        </div>
      </header>
      <div className="dica-camera">🖱️ clique numa ilha para abrir a trilha</div>

      {sobre ? (
        <Painel
          chave="sobre"
          cabeca={
            <>
              <div className="etiqueta">Sobre</div>
              <h2>RedeLab</h2>
            </>
          }
          pe={
            <div className="linha-botoes">
              <button className="btn btn-secundario" onClick={() => setSobre(false)}>← Voltar</button>
            </div>
          }
        >
          <p className="texto">
            Laboratório 3D para estudar Redes de Computadores, trilha por trilha, seguindo as aulas e os slides do professor.
          </p>
          <dl className="sobre-lista">
            <dt>Desenvolvedor</dt>
            <dd>{DESENVOLVEDOR}</dd>
            <dt>Professor</dt>
            <dd>{PROFESSOR}</dd>
            <dt>Disciplina</dt>
            <dd>{DISCIPLINA}</dd>
            <dt>Versão</dt>
            <dd>
              {VERSAO}
              <small>nº de deploys . nº de commits</small>
            </dd>
          </dl>
        </Painel>
      ) : trilha && trilha.disponivel ? (
        <Painel
          chave={trilha.id}
          cabeca={
            <>
              <div className="etiqueta">Trilha {trilha.numero} · {trilha.aula}</div>
              <h2>{trilha.titulo}</h2>
            </>
          }
          pe={
            <div className="linha-botoes">
              <button className="btn btn-secundario" onClick={() => ir('/')}>← Todas as trilhas</button>
            </div>
          }
        >
          <div className="fase-lista">
            {trilha.fases.map((f, i) => {
              const r = fases[f.id]
              const e = estrelas(r)
              return (
                <button key={f.id} className="fase-item" onClick={() => ir(`/fase/${trilha.id}/${f.id}`)}>
                  <span className={`status ${r ? 'ok' : ''}`}>{r ? '✓' : i + 1}</span>
                  <span style={{ flex: 1 }}>
                    <b>{f.titulo}</b>
                    <span>{f.resumo}</span>
                  </span>
                  {r && <span className="estrelas">{'★'.repeat(e)}<span className="apagada">{'★'.repeat(3 - e)}</span></span>}
                </button>
              )
            })}
            <button className="fase-item chefao" onClick={() => ir(`/chefao/${trilha.id}`)}>
              <span className="status">★</span>
              <span style={{ flex: 1 }}>
                <b>Chefão: revisão da trilha</b>
                <span>
                  {chefoes[trilha.id]
                    ? `Melhor nota: ${chefoes[trilha.id].acertos}/${chefoes[trilha.id].total}`
                    : 'Questões sorteadas de todas as fases.'}
                </span>
              </span>
            </button>
          </div>
        </Painel>
      ) : (
        <Painel
          cabeca={
            <>
              <div className="etiqueta">Laboratório de Redes de Computadores</div>
              <h2>Escolha uma trilha</h2>
            </>
          }
          pe={
            <div className="linha-botoes">
              <button
                className="btn btn-secundario"
                onClick={() => {
                  if (confirmarZerar) {
                    zerar()
                    setConfirmarZerar(false)
                  } else setConfirmarZerar(true)
                }}
              >
                {confirmarZerar ? 'Confirmar: apagar progresso' : 'Zerar progresso'}
              </button>
              <button className="btn btn-secundario" onClick={() => setSobre(true)}>Sobre</button>
            </div>
          }
        >
          <p className="texto">
            Cada trilha segue uma aula do professor, com cenas 3D, explicações fiéis aos slides e desafios no final.
            Seu progresso fica salvo neste navegador.
          </p>
          {trilha && !trilha.disponivel && (
            <div className="nota nota-dica">
              <div className="nota-titulo">🚧 Trilha {trilha.numero} em construção</div>
              {trilha.titulo} ({trilha.aula}) chega nas próximas partes.
            </div>
          )}
          <div className="trilhas-lista" style={{ marginTop: 14 }}>
            {TRILHAS.map((t) => {
              const feitas = t.fases.filter((f) => fases[f.id]).length
              return (
                <button
                  key={t.id}
                  className={`trilha-card ${t.id === trilhaId ? 'ativa' : ''}`}
                  disabled={!t.disponivel}
                  onClick={() => ir(`/trilha/${t.id}`)}
                >
                  <span className="trilha-num" style={{ background: t.disponivel ? t.cor : CINZA }}>{t.numero}</span>
                  <span className="trilha-info">
                    <b>
                      {t.titulo}
                      {!t.disponivel && <span className="em-breve">em breve</span>}
                    </b>
                    <span>{t.aula}{t.disponivel && ` · ${feitas}/${t.fases.length} fases`}</span>
                    {t.disponivel && (
                      <div className="barra"><i style={{ width: `${(feitas / t.fases.length) * 100}%` }} /></div>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </Painel>
      )}
    </div>
  )
}
