import { useEffect, useRef, useState } from 'react'
import { ir } from '../app/rota'
import { inline } from '../engine/Texto'
import { QUESTOES_G2_2025 as QS } from './questoes2025'
import { placar, proximaPendente, type Respostas } from './logica'

// Revisão G2 2025/1 pensada para celular: uma questão por tela, correção na hora do toque,
// botão de avançar fixo embaixo (alcance do polegar). O progresso fica salvo no navegador.

const LETRAS = ['A', 'B', 'C', 'D', 'E']
const CHAVE = 'redelab-g2-2025'

type Salvo = { atual: number; respostas: Respostas; fim: boolean }

function ler(): Salvo {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) ?? '')
    if (s && typeof s === 'object')
      return {
        atual: Math.min(Math.max(0, Number(s.atual) || 0), QS.length - 1),
        respostas: s.respostas ?? {},
        fim: !!s.fim,
      }
  } catch {
    /* sem armazenamento: começa do zero */
  }
  return { atual: 0, respostas: {}, fim: false }
}

export function Revisao() {
  const [salvo, setSalvo] = useState<Salvo>(ler)
  const { atual, respostas, fim } = salvo
  const topo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(salvo))
    } catch {
      /* ignora */
    }
  }, [salvo])

  useEffect(() => {
    topo.current?.scrollTo({ top: 0 })
  }, [atual, fim])

  const { respondidas, acertos, nota } = placar(QS, respostas)
  const q = QS[atual]
  const resposta = respostas[q.id]
  const respondida = resposta !== undefined

  const ir_para = (i: number) => setSalvo({ ...salvo, atual: i, fim: false })
  const avancar = () => {
    const p = proximaPendente(QS, respostas, atual + 1)
    if (p === -1) setSalvo({ ...salvo, fim: true })
    else ir_para(p)
  }
  const recomecar = () => setSalvo({ atual: 0, respostas: {}, fim: false })
  const refazerErradas = () => {
    const sobra: Respostas = {}
    QS.forEach((x) => {
      if (respostas[x.id] === x.correta) sobra[x.id] = respostas[x.id]
    })
    const p = proximaPendente(QS, sobra, 0)
    setSalvo({ atual: p === -1 ? 0 : p, respostas: sobra, fim: p === -1 })
  }

  return (
    <div className="g2-pagina" ref={topo}>
      <header className="g2-barra">
        <button className="g2-voltar" onClick={() => ir('/')} aria-label="Voltar para as trilhas">
          ←
        </button>
        <div className="g2-titulo">
          <b>Revisão G2 2025/1</b>
          <span>
            {respondidas}/{QS.length} · {acertos} certas
          </span>
        </div>
        <button className={`g2-ver-nota ${fim ? 'ativo' : ''}`} onClick={() => setSalvo({ ...salvo, fim: !fim })}>
          {fim ? 'Questões' : 'Nota'}
        </button>
      </header>

      <nav className="g2-pontos" aria-label="Questões">
        {QS.map((x, i) => {
          const r = respostas[x.id]
          const cls = r === undefined ? '' : r === x.correta ? 'certa' : 'errada'
          return (
            <button
              key={x.id}
              className={`g2-ponto ${cls} ${i === atual && !fim ? 'atual' : ''}`}
              onClick={() => ir_para(i)}
              aria-label={`Questão ${i + 1}`}
            >
              {i + 1}
            </button>
          )
        })}
      </nav>

      {fim ? (
        <main className="g2-conteudo">
          <section className={`g2-cartao g2-final ${nota >= 6 ? 'bom' : 'ruim'}`}>
            <div className="g2-nota">{nota.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</div>
            <p>
              <b>
                {acertos} de {QS.length} certas
              </b>
              {respondidas < QS.length && <> · {QS.length - respondidas} sem responder</>}
            </p>
            <p className="g2-sub">{nota >= 6 ? 'Passaria na média.' : 'Revise as que errou antes da prova.'}</p>
          </section>
          {QS.some((x) => respostas[x.id] !== undefined && respostas[x.id] !== x.correta) && (
            <section className="g2-cartao">
              <b>Errou:</b>
              <ul className="g2-erros">
                {QS.map((x, i) =>
                  respostas[x.id] !== undefined && respostas[x.id] !== x.correta ? (
                    <li key={x.id}>
                      <button onClick={() => ir_para(i)}>
                        Q{i + 1} · {x.tema} <span>→ {LETRAS[x.correta]}</span>
                      </button>
                    </li>
                  ) : null,
                )}
              </ul>
            </section>
          )}
        </main>
      ) : (
        <main className="g2-conteudo">
          <section className="g2-cartao">
            <div className="g2-cabeca">
              <span className="g2-num">Questão {String(atual + 1).padStart(2, '0')}</span>
              <span className="g2-tema">{q.tema}</span>
            </div>
            {q.contexto && <p className="g2-contexto">{q.contexto}</p>}
            {q.itens && (
              <ul className="g2-itens">
                {q.itens.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {q.coluna && (
              <ul className="g2-itens">
                {q.coluna.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            <p className="g2-pergunta">{q.pergunta}</p>
          </section>

          <div className="g2-opcoes" role="radiogroup">
            {q.opcoes.map((o, i) => {
              const cls = !respondida ? '' : i === q.correta ? 'gabarito' : i === resposta ? 'errada' : 'apagada'
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={resposta === i}
                  className={`g2-opcao ${cls}`}
                  disabled={respondida}
                  onClick={() => setSalvo({ ...salvo, respostas: { ...respostas, [q.id]: i } })}
                >
                  <span className="g2-letra">{LETRAS[i]}</span>
                  <span>{o}</span>
                </button>
              )
            })}
          </div>

          {respondida && (
            <section className={`g2-explicacao ${resposta === q.correta ? 'certa' : 'errada'}`}>
              <b>{resposta === q.correta ? 'Acertou!' : `Errou: é a ${LETRAS[q.correta]}.`}</b> {inline(q.explicacao)}
              <div className="g2-fonte">{q.fonte}</div>
            </section>
          )}
        </main>
      )}

      <footer className="g2-acoes">
        {fim ? (
          <>
            <button className="g2-btn secundario" onClick={recomecar}>
              Recomeçar
            </button>
            <button className="g2-btn" onClick={refazerErradas} disabled={acertos === respondidas}>
              Refazer erradas
            </button>
          </>
        ) : (
          <>
            <button className="g2-btn secundario" onClick={() => ir_para(Math.max(0, atual - 1))} disabled={atual === 0}>
              ‹
            </button>
            <button className="g2-btn" onClick={avancar} disabled={!respondida}>
              {proximaPendente(QS, respostas, atual + 1) === -1 && respondida ? 'Ver nota' : 'Próxima ›'}
            </button>
          </>
        )}
      </footer>
    </div>
  )
}
