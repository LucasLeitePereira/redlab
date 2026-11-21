import { useEffect, useMemo, useState } from 'react'
import { ir } from '../app/rota'
import { inline } from '../engine/Texto'
import { QUESTOES_AV2, type QuestaoAv2 } from './questoes'

type Filtro = 'prova' | 'parecidas' | 'tudo'
const LETRAS = ['A', 'B', 'C', 'D', 'E']
const CHAVE = 'redelab-av2'

const FILTROS: { id: Filtro; nome: string; desc: string }[] = [
  { id: 'prova', nome: 'Prova AV2', desc: '10 questões, igual à prova' },
  { id: 'parecidas', nome: 'Parecidas', desc: 'mesmos temas, questões novas' },
  { id: 'tudo', nome: 'Tudo', desc: 'prova + parecidas, por tema' },
]

type Salvo = { filtro: Filtro; respostas: Record<string, number>; corrigido: boolean }

function ler(): Salvo {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) ?? '')
    if (s && typeof s === 'object') return { filtro: s.filtro ?? 'prova', respostas: s.respostas ?? {}, corrigido: !!s.corrigido }
  } catch {
    /* sem armazenamento: começa do zero */
  }
  return { filtro: 'prova', respostas: {}, corrigido: false }
}

function Questao({
  q,
  n,
  resposta,
  corrigido,
  onResponder,
}: {
  q: QuestaoAv2
  n: number
  resposta?: number
  corrigido: boolean
  onResponder: (i: number) => void
}) {
  const acertou = resposta === q.correta
  const estado = !corrigido ? '' : resposta === undefined ? 'em-branco' : acertou ? 'certa' : 'errada'
  return (
    <article className={`av2-questao ${estado}`} id={`q-${q.id}`}>
      <header className="av2-q-cabeca">
        <span className="av2-q-num">Questão {String(n).padStart(2, '0')}</span>
        <span className="av2-q-tema">{q.tema}</span>
        <span className={`av2-selo ${q.origem}`}>{q.origem === 'prova' ? 'da prova' : 'parecida'}</span>
      </header>
      {q.contexto && <p className="av2-contexto">{q.contexto}</p>}
      <p className="av2-pergunta">{q.pergunta}</p>
      {q.itens && (
        <div className={`av2-itens ${q.coluna ? 'duas' : ''}`}>
          <ul>
            {q.itens.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {q.coluna && (
            <ul>
              {q.coluna.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="av2-opcoes" role="radiogroup">
        {q.opcoes.map((o, i) => {
          const marcada = resposta === i
          const cls = corrigido ? (i === q.correta ? 'gabarito' : marcada ? 'marcada-errada' : '') : marcada ? 'marcada' : ''
          return (
            <button
              key={i}
              role="radio"
              aria-checked={marcada}
              className={`av2-opcao ${cls}`}
              disabled={corrigido}
              onClick={() => onResponder(i)}
            >
              <span className="av2-letra">{LETRAS[i]}</span>
              <span>{o}</span>
            </button>
          )
        })}
      </div>
      {corrigido && (
        <div className="av2-explicacao">
          <b>{resposta === undefined ? 'Em branco.' : acertou ? 'Acertou!' : `Errou: a resposta é ${LETRAS[q.correta]}.`}</b> {inline(q.explicacao)}
          <div className="av2-fonte">{q.fonte}</div>
        </div>
      )}
    </article>
  )
}

export function Simulado() {
  const [salvo, setSalvo] = useState<Salvo>(ler)
  const { filtro, respostas, corrigido } = salvo

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(salvo))
    } catch {
      /* ignora */
    }
  }, [salvo])

  const lista = useMemo(() => {
    if (filtro === 'prova') return QUESTOES_AV2.filter((q) => q.origem === 'prova')
    if (filtro === 'parecidas') return QUESTOES_AV2.filter((q) => q.origem === 'parecida')
    return QUESTOES_AV2
  }, [filtro])

  const respondidas = lista.filter((q) => respostas[q.id] !== undefined).length
  const acertos = lista.filter((q) => respostas[q.id] === q.correta).length
  const nota = lista.length ? (acertos / lista.length) * 10 : 0

  const trocar = (f: Filtro) => setSalvo({ filtro: f, respostas, corrigido: false })
  const refazer = () => {
    const limpas = { ...respostas }
    lista.forEach((q) => delete limpas[q.id])
    setSalvo({ filtro, respostas: limpas, corrigido: false })
    document.querySelector('.av2-pagina')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="av2-pagina">
      <div className="av2-folha">
        <button className="btn btn-secundario av2-voltar" onClick={() => ir('/')}>
          ← Trilhas
        </button>
        <header className="av2-topo">
          <div className="etiqueta">Redes de Computadores · UNILASALLE</div>
          <h1>Simulado AV2</h1>
          <p>
            As questões da AV2 de 2024/2 (com o gabarito da correção do professor) e questões parecidas sobre os mesmos temas,
            incluindo o conteúdo novo de <b>Equipamentos de Redes</b> (Aula 09).
          </p>
        </header>

        <div className="av2-filtros">
          {FILTROS.map((f) => (
            <button key={f.id} className={`av2-filtro ${filtro === f.id ? 'ativo' : ''}`} onClick={() => trocar(f.id)}>
              <b>{f.nome}</b>
              <span>{f.desc}</span>
            </button>
          ))}
        </div>

        {corrigido && (
          <div className={`av2-resultado ${nota >= 6 ? 'bom' : 'ruim'}`}>
            <div className="av2-nota">{nota.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</div>
            <div>
              <b>
                {acertos} de {lista.length} certas
              </b>
              <span>{nota >= 6 ? 'Passaria na média.' : 'Revise as explicações das que errou.'}</span>
            </div>
          </div>
        )}

        {lista.map((q, i) => (
          <Questao
            key={q.id}
            q={q}
            n={i + 1}
            resposta={respostas[q.id]}
            corrigido={corrigido}
            onResponder={(r) => setSalvo({ filtro, respostas: { ...respostas, [q.id]: r }, corrigido })}
          />
        ))}

        <footer className="av2-rodape">
          <span>
            {respondidas}/{lista.length} respondidas
          </span>
          {corrigido ? (
            <button className="btn" onClick={refazer}>
              Refazer
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setSalvo({ filtro, respostas, corrigido: true })
                document.querySelector('.av2-pagina')?.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Corrigir
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
