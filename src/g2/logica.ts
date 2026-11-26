import type { QuestaoAv2 } from '../av2/questoes'

/** id da questão → índice da alternativa marcada. */
export type Respostas = Record<string, number>

export function placar(qs: QuestaoAv2[], r: Respostas) {
  const respondidas = qs.filter((q) => r[q.id] !== undefined).length
  const acertos = qs.filter((q) => r[q.id] === q.correta).length
  const nota = qs.length ? (acertos / qs.length) * 10 : 0
  return { respondidas, acertos, nota }
}

/** Índice da próxima questão sem resposta a partir de `de` (dando a volta); -1 se não sobrou nenhuma. */
export function proximaPendente(qs: QuestaoAv2[], r: Respostas, de: number): number {
  for (let k = 0; k < qs.length; k++) {
    const i = (de + k) % qs.length
    if (r[qs[i].id] === undefined) return i
  }
  return -1
}
