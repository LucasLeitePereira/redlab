import type { Trilha } from '../engine/tipos'
import { trilha1 } from './t1/conteudo'
import { trilha2 } from './t2/conteudo'
import { trilha3 } from './t3/conteudo'
import { trilha4 } from './t4/conteudo'
import { trilha5 } from './t5/conteudo'

// Trilhas ainda não construídas aparecem no mapa como "em breve" (ver redes/PLANO.md).
const emBreve = (numero: number, titulo: string, aula: string, cor: string): Trilha => ({
  id: `t${numero}`,
  numero,
  titulo,
  aula,
  cor,
  disponivel: false,
  fases: [],
  chefaoExtras: [],
})

export const TRILHAS: Trilha[] = [
  trilha1,
  trilha2,
  trilha3,
  trilha4,
  trilha5,
  emBreve(6, 'TCP/IP e 5 camadas', 'Aula 05 p2–p3', '#17a2a2'),
]

export const acharTrilha = (id: string) => TRILHAS.find((t) => t.id === id)
