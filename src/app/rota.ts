import { useSyncExternalStore } from 'react'

// Rotas por hash (#/fase/t1/1-1): o site é 100% estático, então não precisa de
// reescrita de URL na Vercel e o botão "voltar" do navegador funciona.

export type Rota =
  | { tela: 'mapa'; trilha?: string }
  | { tela: 'fase'; trilha: string; fase: string }
  | { tela: 'chefao'; trilha: string }

function ler(): Rota {
  const partes = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (partes[0] === 'fase' && partes[1] && partes[2]) return { tela: 'fase', trilha: partes[1], fase: partes[2] }
  if (partes[0] === 'chefao' && partes[1]) return { tela: 'chefao', trilha: partes[1] }
  if (partes[0] === 'trilha' && partes[1]) return { tela: 'mapa', trilha: partes[1] }
  return { tela: 'mapa' }
}

let atual = ler()
const ouvintes = new Set<() => void>()

window.addEventListener('hashchange', () => {
  atual = ler()
  ouvintes.forEach((f) => f())
})

export function useRota() {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f)
      return () => ouvintes.delete(f)
    },
    () => atual,
  )
}

export function ir(caminho: string) {
  window.location.hash = caminho
}
