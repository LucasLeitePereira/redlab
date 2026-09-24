import { Fragment, type ReactNode } from 'react'
import type { Fonte, Nota } from './tipos'

// Mini-markdown do conteúdo: basta para escrever as fases sem depender de parser.
// Blocos separados por linha em branco; "- " vira lista, "1. " lista numerada e "> "
// citação do slide (que também pode conter uma lista: "> - item").

function inline(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((trecho, i) => {
    if (trecho.startsWith('**')) return <strong key={i}>{trecho.slice(2, -2)}</strong>
    if (trecho.startsWith('*')) return <em key={i}>{trecho.slice(1, -1)}</em>
    if (trecho.startsWith('`')) return <code key={i}>{trecho.slice(1, -1)}</code>
    return <Fragment key={i}>{trecho}</Fragment>
  })
}

export function Texto({ children }: { children: string }) {
  const blocos = children.trim().split(/\n\s*\n/)
  return (
    <div className="texto">
      {blocos.map((bloco, i) => {
        const linhas = bloco.split('\n').map((l) => l.trim())
        if (linhas.every((l) => l.startsWith('- '))) {
          return <ul key={i}>{linhas.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>
        }
        if (linhas.every((l) => /^\d+\. /.test(l))) {
          return <ol key={i}>{linhas.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ''))}</li>)}</ol>
        }
        if (linhas.every((l) => l.startsWith('> '))) {
          const dentro = linhas.map((l) => l.slice(2))
          if (dentro.every((l) => l.startsWith('- '))) {
            return (
              <div key={i} className="citacao">
                <ul>{dentro.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>
              </div>
            )
          }
          return <p key={i} className="citacao">{inline(dentro.join(' '))}</p>
        }
        return <p key={i}>{inline(linhas.join(' '))}</p>
      })}
    </div>
  )
}

export function FonteChip({ fonte }: { fonte: Fonte }) {
  return (
    <span className="fonte" title="Onde isso está no material do professor">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
        <path d="M4 19V5" />
      </svg>
      {fonte.aula} · p. {fonte.pagina}
    </span>
  )
}

const ICONES: Record<Nota['tipo'], string> = {
  pegadinha: '⚠️',
  dica: '💡',
  curiosidade: '🌎',
  'slide-vs-pratica': '🔍',
}

export function CaixaNota({ nota }: { nota: Nota }) {
  if (nota.tipo === 'slide-vs-pratica') {
    return (
      <div className="nota nota-slide">
        <div className="nota-titulo">{ICONES[nota.tipo]} {nota.titulo}</div>
        <div className="colunas">
          <div className="coluna no-slide"><b>No slide</b>{nota.noSlide}</div>
          <div className="coluna na-pratica"><b>Na prática</b>{nota.naPratica}</div>
        </div>
      </div>
    )
  }
  return (
    <div className={`nota nota-${nota.tipo}`}>
      <div className="nota-titulo">
        {ICONES[nota.tipo]} {nota.titulo}
        {nota.tipo === 'curiosidade' && <span className="em-breve">fora do slide</span>}
      </div>
      {inline(nota.texto)}
    </div>
  )
}
