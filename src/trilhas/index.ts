import type { Trilha } from '../engine/tipos'
import { trilha1 } from './t1/conteudo'
import { trilha2 } from './t2/conteudo'
import { trilha3 } from './t3/conteudo'

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
  emBreve(4, 'Usando a rede', 'Aula 04', '#e9a620'),
  emBreve(5, 'Modelo OSI', 'Aula 05 p1', '#7458c4'),
]

export const acharTrilha = (id: string) => TRILHAS.find((t) => t.id === id)
