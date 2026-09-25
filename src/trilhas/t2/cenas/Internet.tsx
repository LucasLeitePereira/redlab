import { Alvo, Arvore, Ilha, Lote, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Notebook, Roteador, Servidor } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 2.2 — Internet × WEB (Aula 02, p. 6). Cinco redes (bairros), cada uma com seu
// roteador, ligadas entre si: isso é a Internet. Em cima dela, as aplicações que o
// usuário enxerga (páginas, e-mail, chat…): isso é o que o slide chama de WEB.

export const APPS: { id: string; icone: string; nome: string }[] = [
  { id: 'web', icone: '🌐', nome: 'Páginas web' },
  { id: 'email', icone: '✉️', nome: 'E-mail' },
  { id: 'chat', icone: '💬', nome: 'Chat' },
  { id: 'arquivos', icone: '📁', nome: 'Transferência de arquivos' },
  { id: 'remoto', icone: '🖥️', nome: 'Logon remoto' },
]

const RAIO = 4.7
const BAIRROS: V3[] = APPS.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return [Math.cos(a) * RAIO, 0, Math.sin(a) * RAIO * 0.92]
})
/** Roteador de cada bairro: um pouco para dentro, virado para o centro. */
const ROTEADORES: V3[] = BAIRROS.map(([x, , z]) => [x * 0.8, 0.12, z * 0.8])
const ENLACES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]]

export function CenaInternet(cena: CenaProps) {
  const foco = (cena.estado.foco as string | undefined) ?? 'internet'
  const internet = foco !== 'web'
  const apps = foco === 'web' || foco === 'tudo'

  return (
    <>
      <Ilha raio={8.4} />
      {BAIRROS.map((b, i) => (
        <group key={i}>
          <Lote pos={b} tam={[2.9, 2.5]} />
          <Servidor pos={[b[0] - 0.55, 0.12, b[2] - 0.35]} escala={0.62} />
          <Notebook pos={[b[0] + 0.7, 0.12, b[2] + 0.1]} rot={[0, -0.4, 0]} escala={0.6} />
          <Roteador pos={ROTEADORES[i]} escala={0.8} />
          <Ligacao pontos={[[b[0] - 0.5, 0.14, b[2] + 0.1], [ROTEADORES[i][0], 0.14, ROTEADORES[i][2]]]} raio={0.04} />
          <Rotulo pos={[b[0], 1.9, b[2]]} apagado={!internet}>Rede {i + 1}</Rotulo>
          <Alvo id={APPS[i].id} pos={[b[0] - 0.55, 1.5, b[2] - 0.35]} cena={cena} />
          {(apps || cena.revelados.includes(APPS[i].id)) && (
            <Rotulo pos={[b[0] - 0.55, 2.1, b[2] - 0.35]} escuro>
              {APPS[i].icone} {APPS[i].nome}
            </Rotulo>
          )}
        </group>
      ))}
      {ENLACES.map(([a, b], i) => (
        <Ligacao
          key={i}
          pontos={[
            [ROTEADORES[a][0], 0.16, ROTEADORES[a][2]],
            [ROTEADORES[b][0], 0.16, ROTEADORES[b][2]],
          ]}
          surgir={0.1}
          raio={internet ? 0.08 : 0.06}
          cor={internet ? '#2f5fb0' : '#7d95b8'}
          viagens={[
            { cor: '#ef6f6c', duracao: 2.6, pausa: 0.8, atraso: i * 0.45 },
            { cor: '#3aa0e6', duracao: 2.6, pausa: 0.8, atraso: 1.7 + i * 0.45, inverso: true },
          ]}
        />
      ))}
      <Rotulo pos={[0, 1.2, 0]} escuro={internet} apagado={!internet}>
        Internet<small>redes interligadas · TCP/IP</small>
      </Rotulo>
      <Arvore pos={[-7, 0, 2.6]} escala={0.8} />
      <Arvore pos={[7.1, 0, 2.2]} escala={0.9} />
      <Arvore pos={[0, 0, 7.2]} escala={0.7} />
    </>
  )
}
