import { useMemo, useState } from 'react'
import { ir } from '../app/rota'
import { Palco } from '../three/base'
import { Desafio } from './Desafio'
import { BarraPassos, Painel } from './Painel'
import { useProgresso } from './progresso'
import { CaixaNota, FonteChip, Texto } from './Texto'
import type { EstadoCena, Fase, Trilha } from './tipos'

export function FasePlayer({ trilha, fase }: { trilha: Trilha; fase: Fase }) {
  const [passo, setPasso] = useState(0)
  const [modo, setModo] = useState<'roteiro' | 'desafio'>('roteiro')
  const [revelados, setRevelados] = useState<string[]>([])
  const [ultimo, setUltimo] = useState<string | null>(null)
  const registrar = useProgresso((s) => s.registrarFase)

  const indice = trilha.fases.indexOf(fase)
  const proxima = trilha.fases[indice + 1]
  const atual = fase.passos[passo]
  const explorar = modo === 'roteiro' ? atual.explorar : undefined
  const alvos = explorar ? Object.keys(explorar.alvos) : []
  const faltam = alvos.filter((id) => !revelados.includes(id)).length

  // Durante o desafio, a cena fica no estado do último passo que definiu um.
  const estado: EstadoCena = useMemo(() => {
    const ate = modo === 'desafio' ? fase.passos.length - 1 : passo
    for (let i = ate; i >= 0; i--) if (fase.passos[i].cena) return fase.passos[i].cena!
    return {}
  }, [fase, passo, modo])

  function irPara(n: number) {
    setPasso(n)
    setRevelados([])
    setUltimo(null)
  }

  function revelar(id: string) {
    setUltimo(id)
    setRevelados((r) => (r.includes(id) ? r : [...r, id]))
  }

  // Muda quando algo da cena pode ter mudado de lugar: as sombras são refeitas.
  const versaoCena = useMemo(() => [estado, revelados], [estado, revelados])
  const Cena = fase.Cena
  const etiqueta = `Trilha ${trilha.numero} · Fase ${indice + 1}`

  return (
    <div className="tela">
      <div className="ceu">
        <Palco key={fase.id} camera={fase.camera} versao={versaoCena}>
          <Cena estado={estado} revelados={revelados} alvos={alvos} onRevelar={revelar} />
        </Palco>
      </div>

      <header className="hud-topo">
        <button className="btn btn-redondo" onClick={() => ir(`/trilha/${trilha.id}`)} aria-label="Voltar ao mapa">←</button>
        <div className="hud-titulo">
          <small>{etiqueta}</small>
          <strong>{fase.titulo}</strong>
        </div>
      </header>
      <div className="dica-camera">🖱️ arraste para girar · rodinha para aproximar</div>

      {modo === 'desafio' ? (
        <Desafio
          etiqueta={`${etiqueta} · Desafio`}
          titulo={fase.titulo}
          questoes={fase.desafio}
          onFim={(r) => registrar(fase.id, r)}
          onSair={() => ir(proxima ? `/fase/${trilha.id}/${proxima.id}` : `/chefao/${trilha.id}`)}
        />
      ) : (
        <Painel
          chave={passo}
          cabeca={
            <>
              <div className="etiqueta">{etiqueta} · passo {passo + 1} de {fase.passos.length}</div>
              <h2>{atual.titulo}</h2>
              <BarraPassos total={fase.passos.length} atual={passo} />
            </>
          }
          pe={
            <div className="linha-botoes">
              <button className="btn btn-secundario" disabled={passo === 0} onClick={() => irPara(passo - 1)}>← Voltar</button>
              {passo < fase.passos.length - 1 ? (
                <button className="btn btn-primario" disabled={faltam > 0} onClick={() => irPara(passo + 1)}>
                  {faltam > 0 ? `Faltam ${faltam}` : 'Próximo →'}
                </button>
              ) : (
                <button className="btn btn-primario" disabled={faltam > 0} onClick={() => setModo('desafio')}>
                  {faltam > 0 ? `Faltam ${faltam}` : 'Ir para o desafio →'}
                </button>
              )}
            </div>
          }
        >
          <Texto>{atual.texto}</Texto>
          {explorar && (
            <>
              <p className="texto">
                <strong>{explorar.instrucao}</strong>{' '}
                <span className="contador">{alvos.length - faltam}/{alvos.length}</span>
              </p>
              <div className="explorar-lista">
                {alvos.map((id) => {
                  const visto = revelados.includes(id)
                  const alvo = explorar.alvos[id]
                  return visto ? (
                    <div key={id} className={`explorar-item ${ultimo === id ? 'novo' : ''}`}>
                      <b>{alvo.titulo}</b>
                      {alvo.texto}
                    </div>
                  ) : (
                    <div key={id} className="explorar-item oculto">? Ainda não descoberto</div>
                  )
                })}
              </div>
            </>
          )}
          {atual.notas?.map((n, i) => <CaixaNota key={i} nota={n} />)}
          {atual.fonte && <FonteChip fonte={atual.fonte} />}
        </Painel>
      )}
    </div>
  )
}
