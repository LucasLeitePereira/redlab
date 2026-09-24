import type { Trilha } from '../engine/tipos'
import { trilha1 } from './t1/conteudo'

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
  emBreve(2, 'Classificação das redes', 'Aula 02', '#23915f'),
  emBreve(3, 'Endereçamento IPv4', 'Aulas 03 p1–p3', '#cf4b47'),
  emBreve(4, 'Usando a rede', 'Aula 04', '#e9a620'),
  emBreve(5, 'Modelo OSI', 'Aula 05 p1', '#7458c4'),
]

export const acharTrilha = (id: string) => TRILHAS.find((t) => t.id === id)
