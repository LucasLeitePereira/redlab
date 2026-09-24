import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import { Painel } from '../engine/Painel'
import { estrelas, useProgresso } from '../engine/progresso'
import type { Trilha } from '../engine/tipos'
import { Arvore, Caixa, Cilindro, Palco, Rotulo, useAtualizarSombras, type V3 } from '../three/base'
import { Ligacao } from '../three/Ligacao'
import { Computador, Servidor, PontoDeAcesso, Switch } from '../three/modelos'
import { TRILHAS } from '../trilhas'
import { ir } from './rota'

const POSICOES: V3[] = [[-7.4, 0, 1.2], [-3.7, 0, -2], [0, 0, 1.4], [3.7, 0, -2], [7.4, 0, 1.2]]
const CINZA = '#b8bfc7'

/** Miniatura que representa cada trilha em cima da sua ilha. */
function Miniatura({ numero }: { numero: number }) {
  switch (numero) {
    case 1:
      return (
        <group scale={0.6}>
          <Computador pos={[-1.4, 0, 0]} />
          <Computador pos={[1.0, 0, 0]} tela="#8fd9a8" />
          <Ligacao pontos={[[-0.5, 0.05, 0.4], [0.2, 0.05, 1.2], [1.95, 0.05, 0.4]]} viagens={[{ duracao: 2 }]} />
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

function IlhaTrilha({ trilha, pos, selecionada }: { trilha: Trilha; pos: V3; selecionada: boolean }) {
  const [sobre, setSobre] = useState(false)
  const ref = useRef<Group>(null)
  const alvoY = selecionada ? 0.35 : sobre ? 0.18 : 0
  // a ilha sobe/desce: as sombras dela precisam acompanhar
  const atualizarSombras = useAtualizarSombras()
  useEffect(atualizarSombras, [alvoY, atualizarSombras])
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y += (alvoY - ref.current.position.y) * Math.min(1, dt * 8)
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
      <Cilindro raio={2.1} altura={0.35} lados={32} pos={[0, -0.18, 0]} cor={trilha.disponivel ? '#a9d18e' : '#cfd5cc'} />
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

function CenaMapa({ selecionada }: { selecionada?: string }) {
  return (
    <>
      {TRILHAS.map((t, i) => (
        <IlhaTrilha key={t.id} trilha={t} pos={POSICOES[i]} selecionada={t.id === selecionada} />
      ))}
      {POSICOES.slice(0, -1).map((p, i) => {
        const q = POSICOES[i + 1]
        return (
          <Ligacao
            key={i}
            pontos={[[p[0] + 1.6, -0.1, p[2] * 0.6], [(p[0] + q[0]) / 2, -0.4, (p[2] + q[2]) / 2 + 0.6], [q[0] - 1.6, -0.1, q[2] * 0.6]]}
            cor="#6c7a89"
            raio={0.09}
            viagens={[
              { cor: TRILHAS[i].cor, duracao: 2.6, atraso: i * 0.7, pausa: 1.5 },
              { cor: TRILHAS[i + 1].cor, duracao: 2.6, atraso: 1.4 + i * 0.7, pausa: 1.5, inverso: true },
            ]}
          />
        )
      })}
      <Arvore pos={[-9.6, -0.6, -1.8]} escala={0.9} />
      <Arvore pos={[9.4, -0.6, -2.2]} />
    </>
  )
}

export function Mapa({ trilhaId }: { trilhaId?: string }) {
  const trilha = TRILHAS.find((t) => t.id === trilhaId)
  const { fases, chefoes, zerar } = useProgresso()
  const [confirmarZerar, setConfirmarZerar] = useState(false)

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

      {trilha && trilha.disponivel ? (
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
