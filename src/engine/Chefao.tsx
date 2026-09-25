import { useMemo, useState } from 'react'
import { ir } from '../app/rota'
import { Palco } from '../three/base'
import { Desafio, embaralhar } from './Desafio'
import { Painel } from './Painel'
import { useProgresso } from './progresso'
import { Treino } from './Treino'
import type { Questao, Trilha } from './tipos'

const QUESTOES_NO_CHEFAO = 10
/** Na revisão de uma trilha com gerador, quantas das 10 questões são geradas na hora. */
const GERADAS_NA_REVISAO = 4
const SEGUNDOS_NO_RELOGIO = 180

type Modo = 'menu' | 'revisao' | 'treino' | 'relogio'

function sortear(trilha: Trilha): Questao[] {
  const fixas = [...trilha.fases.flatMap((f) => f.desafio), ...trilha.chefaoExtras]
  if (!trilha.gerador) return embaralhar(fixas).slice(0, QUESTOES_NO_CHEFAO)
  const geradas = Array.from({ length: GERADAS_NA_REVISAO }, trilha.gerador)
  return embaralhar([...embaralhar(fixas).slice(0, QUESTOES_NO_CHEFAO - GERADAS_NA_REVISAO), ...geradas])
}

/** Revisão final da trilha: sorteia questões de todas as fases + as extras. */
export function Chefao({ trilha }: { trilha: Trilha }) {
  const { registrarChefao, registrarRecorde, chefoes, recordes } = useProgresso()
  const [modo, setModo] = useState<Modo>(trilha.gerador ? 'menu' : 'revisao')
  // Cada vez que um modo começa, ele recebe uma rodada nova (questões e relógio zerados).
  const [rodada, setRodada] = useState(0)
  const questoes = useMemo(() => sortear(trilha), [trilha, rodada])

  const [questao, setQuestao] = useState<Questao | null>(null)

  function comecar(m: Modo) {
    setRodada((r) => r + 1)
    setQuestao(null)
    setModo(m)
  }

  const voltar = () => (trilha.gerador ? setModo('menu') : ir(`/trilha/${trilha.id}`))

  // Fundo: a cena da fase de onde veio a questão da vez, no estado que a questão pede (ou
  // no último passo da fase). Fora da revisão e nas questões extras, a última fase.
  const faseDe = useMemo(() => new Map(trilha.fases.flatMap((f) => f.desafio.map((q) => [q, f] as const))), [trilha])
  const ultima = trilha.fases[trilha.fases.length - 1]
  const daFase = modo === 'revisao' && questao ? faseDe.get(questao) : undefined
  const fase = daFase ?? ultima
  const estado = (daFase && questao?.cena) || [...fase.passos].reverse().find((p) => p.cena)?.cena || {}
  const Cena = fase.Cena
  const etiqueta = `Chefão da Trilha ${trilha.numero}`
  const melhor = chefoes[trilha.id]

  return (
    <div className="tela">
      <div className="ceu">
        <Palco key={fase.id} camera={fase.camera} alvo={fase.alvoCamera} versao={estado}>
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

      {modo === 'menu' && (
        <Painel cabeca={<><div className="etiqueta">{etiqueta}</div><h2>Escolha o desafio</h2></>}>
          <div className="fase-lista">
            <button className="fase-item" onClick={() => comecar('revisao')}>
              <span className="status">★</span>
              <span style={{ flex: 1 }}>
                <b>Revisão da trilha</b>
                <span>
                  {QUESTOES_NO_CHEFAO} questões: das fases e exercícios novos.
                  {melhor ? ` Melhor nota: ${melhor.acertos}/${melhor.total}.` : ''}
                </span>
              </span>
            </button>
            <button className="fase-item" onClick={() => comecar('treino')}>
              <span className="status">∞</span>
              <span style={{ flex: 1 }}>
                <b>Treino livre</b>
                <span>Exercícios gerados no formato do professor, sem fim. Pare quando quiser.</span>
              </span>
            </button>
            <button className="fase-item" onClick={() => comecar('relogio')}>
              <span className="status">⏱</span>
              <span style={{ flex: 1 }}>
                <b>Contra o relógio</b>
                <span>
                  Quantos você acerta em {SEGUNDOS_NO_RELOGIO / 60} minutos?
                  {recordes[trilha.id] ? ` Recorde: ${recordes[trilha.id]}.` : ''}
                </span>
              </span>
            </button>
          </div>
        </Painel>
      )}

      {modo === 'revisao' && (
        <Desafio
          key={rodada}
          etiqueta={etiqueta}
          titulo={`Revisão: ${trilha.titulo}`}
          questoes={questoes}
          onFim={(r) => registrarChefao(trilha.id, r)}
          onSair={voltar}
          onQuestao={setQuestao}
        />
      )}

      {(modo === 'treino' || modo === 'relogio') && trilha.gerador && (
        <Treino
          key={rodada}
          etiqueta={etiqueta}
          titulo={modo === 'treino' ? 'Treino livre' : 'Contra o relógio'}
          gerar={trilha.gerador}
          segundos={modo === 'relogio' ? SEGUNDOS_NO_RELOGIO : undefined}
          recorde={recordes[trilha.id] ?? 0}
          onFim={modo === 'relogio' ? (n) => registrarRecorde(trilha.id, n) : undefined}
          onSair={voltar}
        />
      )}
    </div>
  )
}
