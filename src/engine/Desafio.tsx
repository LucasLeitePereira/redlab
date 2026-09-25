import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { estrelas, type Resultado } from './progresso'
import { BarraPassos, Painel } from './Painel'
import { conferir, EXEMPLO_CAMPO } from './respostas'
import { FonteChip, Texto } from './Texto'
import type { Questao, QuestaoClassificar, QuestaoDigitar, QuestaoEscolha } from './tipos'

export function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

const LETRAS = 'ABCDEFGH'

type Props = {
  etiqueta: string
  titulo: string
  questoes: Questao[]
  onFim: (r: Resultado) => void
  onSair: () => void
  /** Avisa qual questão está na tela, para a cena 3D mostrar o que ela pede. */
  onQuestao?: (q: Questao) => void
}

export function Desafio({ etiqueta, titulo, questoes, onFim, onSair, onQuestao }: Props) {
  const [indice, setIndice] = useState(0)
  const [acertos, setAcertos] = useState(0)
  const [respondida, setRespondida] = useState<null | boolean>(null)
  const [fim, setFim] = useState(false)

  const questao = questoes[indice]
  useEffect(() => {
    onQuestao?.(questao)
  }, [questao, onQuestao])
  const ultima = indice === questoes.length - 1

  function responder(certa: boolean) {
    setRespondida(certa)
    if (certa) setAcertos((a) => a + 1)
  }

  function proxima() {
    if (ultima) {
      setFim(true)
      onFim({ acertos, total: questoes.length })
      return
    }
    setIndice((i) => i + 1)
    setRespondida(null)
  }

  function refazer() {
    setIndice(0)
    setAcertos(0)
    setRespondida(null)
    setFim(false)
  }

  if (fim) {
    const r = { acertos, total: questoes.length }
    const e = estrelas(r)
    return (
      <Painel cabeca={<><div className="etiqueta">{etiqueta}</div><h2>{titulo}</h2></>}>
        <div className="resultado">
          <div className="estrelas" aria-label={`${e} de 3 estrelas`}>
            {[0, 1, 2].map((i) => <span key={i} className={i < e ? '' : 'apagada'}>★</span>)}
          </div>
          <div className="nota-grande">{acertos}/{questoes.length}</div>
          <p className="texto">
            {e === 3 ? 'Mandou muito! Esse conteúdo está dominado.'
              : e >= 1 ? 'Bom caminho. Revise as questões que errou e tente de novo.'
              : 'Vale rever os passos da fase antes de tentar de novo.'}
          </p>
        </div>
        <div className="linha-botoes">
          <button className="btn btn-secundario" onClick={refazer}>Refazer</button>
          <button className="btn btn-primario" onClick={onSair}>Continuar</button>
        </div>
      </Painel>
    )
  }

  return (
    <Painel
      chave={indice}
      cabeca={
        <>
          <div className="etiqueta">{etiqueta} · questão {indice + 1} de {questoes.length}</div>
          <h2>{titulo}</h2>
          <BarraPassos total={questoes.length} atual={indice} />
        </>
      }
      pe={
        respondida !== null && (
          <div className="linha-botoes">
            <button className="btn btn-primario" onClick={proxima} autoFocus>
              {ultima ? 'Ver resultado' : 'Próxima questão →'}
            </button>
          </div>
        )
      }
    >
      <CorpoQuestao key={indice} questao={questao} onResponder={responder} />
      {respondida !== null && <Feedback questao={questao} certa={respondida} />}
    </Painel>
  )
}

/** A questão em si (enunciado + forma de responder), sem o painel em volta. */
export function CorpoQuestao({ questao, onResponder }: { questao: Questao; onResponder: (certa: boolean) => void }) {
  if (questao.tipo === 'escolha') return <Escolha q={questao} onResponder={onResponder} />
  if (questao.tipo === 'classificar') return <Classificar q={questao} onResponder={onResponder} />
  return <Digitar q={questao} onResponder={onResponder} />
}

export function Feedback({ questao, certa }: { questao: Questao; certa: boolean }) {
  return (
    <div className={`feedback ${certa ? 'certa' : 'errada'}`}>
      <div className="feedback-titulo">{certa ? 'Acertou!' : 'Não foi dessa vez'}</div>
      <Texto>{questao.explicacao}</Texto>
      <FonteChip fonte={questao.fonte} />
    </div>
  )
}

/** Os dados do slide que a questão usa (IPs, linhas de um prompt, uma tabela…). */
function Dados({ linhas }: { linhas?: string[] }) {
  if (!linhas) return null
  return (
    <div className="dados">
      {linhas.map((d, i) => <div key={i}>{d || ' '}</div>)}
    </div>
  )
}

function Escolha({ q, onResponder }: { q: QuestaoEscolha; onResponder: (certa: boolean) => void }) {
  const ordem = useMemo(() => embaralhar(q.opcoes.map((_, i) => i)), [q])
  const [escolhida, setEscolhida] = useState<number | null>(null)

  return (
    <>
      <div className="enunciado">{q.enunciado}</div>
      <Dados linhas={q.dados} />
      <div className="opcoes">
        {ordem.map((original, pos) => {
          const estado = escolhida === null ? ''
            : original === q.correta ? 'certa'
            : original === escolhida ? 'errada' : ''
          return (
            <button
              key={original}
              className={`opcao ${estado}`}
              disabled={escolhida !== null}
              onClick={() => {
                setEscolhida(original)
                onResponder(original === q.correta)
              }}
            >
              <span className="letra">{LETRAS[pos]}</span>
              <span>{q.opcoes[original]}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function Classificar({ q, onResponder }: { q: QuestaoClassificar; onResponder: (certa: boolean) => void }) {
  const itens = useMemo(() => embaralhar(q.itens), [q])
  const [escolhas, setEscolhas] = useState<(number | null)[]>(() => itens.map(() => null))
  const [conferido, setConferido] = useState(false)
  const completo = escolhas.every((e) => e !== null)

  return (
    <>
      <div className="enunciado">{q.enunciado}</div>
      <Dados linhas={q.dados} />
      <div className="classificar">
        {itens.map((item, i) => {
          const estado = !conferido ? '' : escolhas[i] === item.grupo ? 'certa' : 'errada'
          return (
            <div key={item.texto} className={`classificar-item ${estado}`}>
              <div className="item-texto">{item.texto}</div>
              <div className="grupos" role="radiogroup" aria-label={item.texto}>
                {q.grupos.map((g, gi) => (
                  <button
                    key={g}
                    role="radio"
                    aria-checked={escolhas[i] === gi}
                    className={`grupo-btn ${escolhas[i] === gi ? 'ativo' : ''}`}
                    disabled={conferido}
                    onClick={() => setEscolhas((e) => e.map((v, j) => (j === i ? gi : v)))}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {estado === 'errada' && <div className="gabarito">Correto: {q.grupos[item.grupo]}</div>}
            </div>
          )
        })}
      </div>
      {!conferido && (
        <div className="linha-botoes">
          <button
            className="btn btn-primario"
            disabled={!completo}
            onClick={() => {
              setConferido(true)
              onResponder(itens.every((item, i) => escolhas[i] === item.grupo))
            }}
          >
            {completo ? 'Conferir' : 'Classifique todos os itens'}
          </button>
        </div>
      )}
    </>
  )
}

function Digitar({ q, onResponder }: { q: QuestaoDigitar; onResponder: (certa: boolean) => void }) {
  const [valores, setValores] = useState(() => q.campos.map(() => ''))
  const [certos, setCertos] = useState<boolean[] | null>(null)
  const entradas = useRef<(HTMLInputElement | null)[]>([])

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (certos) return
    // Enter com campo vazio leva ao próximo campo em vez de conferir pela metade.
    const vazio = valores.findIndex((v) => v.trim() === '')
    if (vazio >= 0) {
      entradas.current[vazio]?.focus()
      return
    }
    const resultado = q.campos.map((c, i) => conferir(c.formato, valores[i], c.resposta))
    setCertos(resultado)
    onResponder(resultado.every(Boolean))
  }

  return (
    <form onSubmit={enviar}>
      <div className="enunciado">{q.enunciado}</div>
      <Dados linhas={q.dados} />
      <div className="campos">
        {q.campos.map((c, i) => {
          const estado = !certos ? '' : certos[i] ? 'certa' : 'errada'
          return (
            <label key={c.rotulo} className={`campo ${estado}`}>
              <span>{c.rotulo}</span>
              <input
                ref={(el) => { entradas.current[i] = el }}
                className="mono"
                value={valores[i]}
                onChange={(e) => setValores((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={EXEMPLO_CAMPO[c.formato]}
                inputMode={c.formato === 'numero' || c.formato === 'binario' ? 'numeric' : 'decimal'}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus={i === 0}
                readOnly={certos !== null}
              />
              {estado === 'errada' && <div className="gabarito">Correto: <span className="mono">{c.resposta}</span></div>}
            </label>
          )
        })}
      </div>
      {!certos && (
        <div className="linha-botoes">
          <button className="btn btn-primario" type="submit">Conferir</button>
        </div>
      )}
    </form>
  )
}
