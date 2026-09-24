import { useMemo } from 'react'
import { ir } from '../app/rota'
import { Palco } from '../three/base'
import { Desafio, embaralhar } from './Desafio'
import { useProgresso } from './progresso'
import type { Trilha } from './tipos'

const QUESTOES_NO_CHEFAO = 10

/** Revisão final da trilha: sorteia questões de todas as fases + as extras. */
export function Chefao({ trilha }: { trilha: Trilha }) {
  const registrar = useProgresso((s) => s.registrarChefao)
  const questoes = useMemo(
    () => embaralhar([...trilha.fases.flatMap((f) => f.desafio), ...trilha.chefaoExtras]).slice(0, QUESTOES_NO_CHEFAO),
    [trilha],
  )
  // Fundo: a cena da última fase, no estado do seu último passo.
  const ultima = trilha.fases[trilha.fases.length - 1]
  const estado = [...ultima.passos].reverse().find((p) => p.cena)?.cena ?? {}
  const Cena = ultima.Cena

  return (
    <div className="tela">
      <div className="ceu">
        <Palco camera={ultima.camera}>
          <Cena estado={estado} revelados={[]} alvos={[]} onRevelar={() => {}} />
        </Palco>
      </div>
      <header className="hud-topo">
        <button className="btn btn-redondo" onClick={() => ir(`/trilha/${trilha.id}`)} aria-label="Voltar ao mapa">←</button>
        <div className="hud-titulo">
          <small>Trilha {trilha.numero} · Chefão</small>
          <strong>Revisão: {trilha.titulo}</strong>
        </div>
      </header>
      <Desafio
        etiqueta={`Chefão da Trilha ${trilha.numero}`}
        titulo={`Revisão: ${trilha.titulo}`}
        questoes={questoes}
        onFim={(r) => registrar(trilha.id, r)}
        onSair={() => ir(`/trilha/${trilha.id}`)}
      />
    </div>
  )
}
