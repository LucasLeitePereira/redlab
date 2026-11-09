import { Ilha } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Anel } from './comum'

// Fase 8.3 — Acesso sem contenção: Token Ring (Aula 07 p. 5–6).
// 'anel': 5 estações, o token gira e quem o tem transmite (com `parado`, o token fica parado).
// 'fila': mesma cena, mas só duas estações querem falar e cada uma espera o token chegar.

export function CenaTokenRing(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'anel'
  const parado = !!cena.estado.parado
  return (
    <>
      <Ilha raio={7.2} />
      <Anel key={modo} n={5} raio={3.3} parado={parado} querem={modo === 'fila' ? [1, 3] : undefined} />
    </>
  )
}
