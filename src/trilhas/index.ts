import type { Trilha } from '../engine/tipos'
import { trilha1 } from './t1/conteudo'
import { trilha2 } from './t2/conteudo'
import { trilha3 } from './t3/conteudo'
import { trilha4 } from './t4/conteudo'
import { trilha5 } from './t5/conteudo'
import { trilha6 } from './t6/conteudo'

export const TRILHAS: Trilha[] = [
  trilha1,
  trilha2,
  trilha3,
  trilha4,
  trilha5,
  trilha6,
]

export const acharTrilha = (id: string) => TRILHAS.find((t) => t.id === id)
