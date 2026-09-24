import { Chefao } from '../engine/Chefao'
import { FasePlayer } from '../engine/FasePlayer'
import { acharTrilha } from '../trilhas'
import { Mapa } from './Mapa'
import { useRota } from './rota'

export function App() {
  const rota = useRota()

  if (rota.tela === 'fase') {
    const trilha = acharTrilha(rota.trilha)
    const fase = trilha?.fases.find((f) => f.id === rota.fase)
    // key: trocar de fase precisa zerar passo, desafio e alvos revelados
    if (trilha && fase) return <FasePlayer key={fase.id} trilha={trilha} fase={fase} />
  }

  if (rota.tela === 'chefao') {
    const trilha = acharTrilha(rota.trilha)
    if (trilha?.disponivel) return <Chefao trilha={trilha} />
  }

  return <Mapa trilhaId={rota.tela === 'mapa' ? rota.trilha : undefined} />
}
