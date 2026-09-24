import { useEffect, useRef, useState } from 'react'
import { CorpoQuestao, Feedback } from './Desafio'
import { Painel } from './Painel'
import type { Questao } from './tipos'

type Props = {
  etiqueta: string
  titulo: string
  gerar: () => Questao
  /** Com tempo: modo contra o relógio. Sem: treino livre, até o aluno encerrar. */
  segundos?: number
  recorde?: number
  onFim?: (acertos: number) => void
  onSair: () => void
}

const relogio = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** Questões geradas uma atrás da outra, sem fim (ou até o tempo acabar). */
export function Treino({ etiqueta, titulo, gerar, segundos, recorde = 0, onFim, onSair }: Props) {
  const [questao, setQuestao] = useState(gerar)
  const [numero, setNumero] = useState(0)
  const [acertos, setAcertos] = useState(0)
  const [feitas, setFeitas] = useState(0)
  const [respondida, setRespondida] = useState<null | boolean>(null)
  const [fim, setFim] = useState(false)
  const [resta, setResta] = useState(segundos ?? 0)
  const acertosAgora = useRef(0)

  useEffect(() => {
    if (!segundos) return
    const inicio = Date.now()
    const id = window.setInterval(() => {
      const r = segundos - (Date.now() - inicio) / 1000
      if (r > 0) return setResta(r)
      window.clearInterval(id)
      setResta(0)
      setFim(true)
      onFim?.(acertosAgora.current)
    }, 250)
    return () => window.clearInterval(id)
    // o relógio começa uma vez por rodada (a rodada nova remonta o componente)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function responder(certa: boolean) {
    setRespondida(certa)
    setFeitas((f) => f + 1)
    if (certa) {
      acertosAgora.current += 1
      setAcertos((a) => a + 1)
    }
  }

  function proxima() {
    setQuestao(gerar())
    setNumero((n) => n + 1)
    setRespondida(null)
  }

  const placar = `${acertos} ${acertos === 1 ? 'acerto' : 'acertos'} em ${feitas}`

  if (fim) {
    const novo = segundos !== undefined && acertos > recorde
    return (
      <Painel cabeca={<><div className="etiqueta">{etiqueta}</div><h2>{titulo}</h2></>}>
        <div className="resultado">
          <div className="etiqueta">{segundos ? 'Tempo esgotado' : 'Treino encerrado'}</div>
          <div className="nota-grande">{acertos}</div>
          <p className="texto">
            {acertos === 1 ? 'acerto' : 'acertos'} em {feitas} {feitas === 1 ? 'questão' : 'questões'}.
            {novo ? ' Novo recorde! 🎉' : segundos && recorde > 0 ? ` Seu recorde é ${recorde}.` : ''}
          </p>
        </div>
        <div className="linha-botoes">
          <button className="btn btn-primario" onClick={onSair}>Continuar</button>
        </div>
      </Painel>
    )
  }

  return (
    <Painel
      chave={numero}
      cabeca={
        <>
          <div className="etiqueta">{etiqueta} · {placar}</div>
          <div className="treino-topo">
            <h2>{titulo}</h2>
            {segundos !== undefined && <span className={`relogio ${resta < 30 ? 'acabando' : ''}`}>{relogio(resta)}</span>}
          </div>
        </>
      }
      pe={
        <div className="linha-botoes">
          <button className="btn btn-secundario" onClick={() => (segundos ? onSair() : setFim(true))}>
            {segundos ? 'Desistir' : 'Encerrar'}
          </button>
          {respondida !== null && (
            <button className="btn btn-primario" onClick={proxima} autoFocus>Próxima →</button>
          )}
        </div>
      }
    >
      <CorpoQuestao key={numero} questao={questao} onResponder={responder} />
      {respondida !== null && (segundos
        ? <div className={`feedback curto ${respondida ? 'certa' : 'errada'}`}>
            <div className="feedback-titulo">{respondida ? 'Acertou!' : 'Errou: veja a resposta acima'}</div>
          </div>
        : <Feedback questao={questao} certa={respondida} />)}
    </Painel>
  )
}
