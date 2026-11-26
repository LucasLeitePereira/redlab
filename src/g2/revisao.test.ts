import { describe, expect, it } from 'vitest'
import { QUESTOES_AV2 } from '../av2/questoes'
import { QUESTOES_G2_2025 } from './questoes2025'
import { placar, proximaPendente } from './logica'

describe('G2 2025/1: questões', () => {
  it('tem as 10 questões da prova, todas de origem "prova"', () => {
    expect(QUESTOES_G2_2025).toHaveLength(10)
    expect(QUESTOES_G2_2025.every((q) => q.origem === 'prova')).toBe(true)
  })

  it('gabarito igual ao conferido na prova escaneada', () => {
    const letras = QUESTOES_G2_2025.map((q) => 'ABCDE'[q.correta]).join('')
    expect(letras).toBe('BBBCCDDDEC')
  })

  it('cada questão tem 5 opções e a correta existe', () => {
    for (const q of QUESTOES_G2_2025) {
      expect(q.opcoes).toHaveLength(5)
      expect(q.correta).toBeGreaterThanOrEqual(0)
      expect(q.correta).toBeLessThan(q.opcoes.length)
      expect(q.explicacao.length).toBeGreaterThan(10)
    }
  })

  it('ids únicos e sem colidir com o simulado AV2', () => {
    const ids = QUESTOES_G2_2025.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    const antigos = new Set(QUESTOES_AV2.map((q) => q.id))
    expect(ids.some((id) => antigos.has(id))).toBe(false)
  })
})

describe('G2 2025/1: lógica da revisão', () => {
  const qs = QUESTOES_G2_2025

  it('placar vazio', () => {
    expect(placar(qs, {})).toEqual({ respondidas: 0, acertos: 0, nota: 0 })
  })

  it('placar conta acertos e nota de 0 a 10', () => {
    const r = { [qs[0].id]: qs[0].correta, [qs[1].id]: (qs[1].correta + 1) % 5 }
    expect(placar(qs, r)).toEqual({ respondidas: 2, acertos: 1, nota: 1 })
  })

  it('próxima pendente pula as respondidas e devolve -1 no fim', () => {
    expect(proximaPendente(qs, {}, 0)).toBe(0)
    expect(proximaPendente(qs, { [qs[0].id]: 0, [qs[1].id]: 0 }, 0)).toBe(2)
    // dá a volta: se só a primeira falta, acha ela
    const quase = Object.fromEntries(qs.slice(1).map((q) => [q.id, 0]))
    expect(proximaPendente(qs, quase, 5)).toBe(0)
    const todas = Object.fromEntries(qs.map((q) => [q.id, 0]))
    expect(proximaPendente(qs, todas, 0)).toBe(-1)
  })
})
