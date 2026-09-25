import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { armazenamentoSeguro } from './progresso'

/** Linhas de pixels que a cena 3D desenha na vertical (o navegador estica para a tela). */
export const RESOLUCOES = [480, 720, 1080] as const
export type Resolucao = (typeof RESOLUCOES)[number]

type Config = {
  resolucao: Resolucao
  setResolucao: (r: Resolucao) => void
}

export const useConfig = create<Config>()(
  persist(
    (set) => ({
      resolucao: 720,
      setResolucao: (resolucao) => set({ resolucao }),
    }),
    { name: 'redelab-config', storage: createJSONStorage(() => armazenamentoSeguro) },
  ),
)
