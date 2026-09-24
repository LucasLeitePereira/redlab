import { useEffect, useRef, type ReactNode } from 'react'

/** Painel lateral: cabeçalho fixo, corpo com rolagem e rodapé com os botões. */
export function Painel({
  cabeca,
  pe,
  children,
  chave,
}: {
  cabeca: ReactNode
  pe?: ReactNode
  children: ReactNode
  /** Quando muda, o corpo volta para o topo (troca de passo ou de questão). */
  chave?: string | number
}) {
  const corpo = useRef<HTMLDivElement>(null)
  useEffect(() => {
    corpo.current?.scrollTo({ top: 0 })
  }, [chave])

  return (
    <aside className="painel">
      <div className="painel-cabeca">{cabeca}</div>
      <div className="painel-corpo" ref={corpo}>{children}</div>
      {pe && <div className="painel-pe">{pe}</div>}
    </aside>
  )
}

export function BarraPassos({ total, atual }: { total: number; atual: number }) {
  return (
    <div className="passos" aria-label={`Passo ${atual + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < atual ? 'feito' : i === atual ? 'atual' : ''} />
      ))}
    </div>
  )
}
