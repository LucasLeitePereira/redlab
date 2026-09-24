import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type Resultado = { acertos: number; total: number }

type Progresso = {
  /** Melhor resultado do desafio de cada fase, por id da fase. */
  fases: Record<string, Resultado>
  /** Melhor resultado do chefão de cada trilha, por id da trilha. */
  chefoes: Record<string, Resultado>
  registrarFase: (id: string, r: Resultado) => void
  registrarChefao: (id: string, r: Resultado) => void
  zerar: () => void
}

// localStorage pode não existir ou lançar exceção (aba anônima, dados bloqueados):
// nesse caso o progresso vale só enquanto a página estiver aberta.
export const armazenamentoSeguro: StateStorage = {
  getItem: (nome) => {
    try { return localStorage.getItem(nome) } catch { return null }
  },
  setItem: (nome, valor) => {
    try { localStorage.setItem(nome, valor) } catch { /* sem persistência */ }
  },
  removeItem: (nome) => {
    try { localStorage.removeItem(nome) } catch { /* sem persistência */ }
  },
}

const melhor = (antigo: Resultado | undefined, novo: Resultado) =>
  !antigo || novo.acertos / novo.total > antigo.acertos / antigo.total ? novo : antigo

export const useProgresso = create<Progresso>()(
  persist(
    (set) => ({
      fases: {},
      chefoes: {},
      registrarFase: (id, r) => set((s) => ({ fases: { ...s.fases, [id]: melhor(s.fases[id], r) } })),
      registrarChefao: (id, r) => set((s) => ({ chefoes: { ...s.chefoes, [id]: melhor(s.chefoes[id], r) } })),
      zerar: () => set({ fases: {}, chefoes: {} }),
    }),
    { name: 'redelab-progresso', storage: createJSONStorage(() => armazenamentoSeguro) },
  ),
)

/** Estrelas de 0 a 3 conforme a porcentagem de acertos. */
export function estrelas(r: Resultado | undefined) {
  if (!r || r.total === 0) return 0
  const p = r.acertos / r.total
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0
}
