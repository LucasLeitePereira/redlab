import { Alvo, Caixa, Ilha, Lote, Rotulo } from '../../../three/base'
import { Celular, Computador, EstacaoBase, Notebook, PlacaDeRede, PontoDeAcesso } from '../../../three/modelos'
import { Cabo, cantosSuaves, Ondas, Pulsos, useCurva } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 1.2 — meios de transmissão (Aula 01, p. 3). Três "ruas" lado a lado:
// cabo par trançado (pulsos elétricos), fibra ótica (luz) e o ar (ondas de rádio/micro-ondas).

type Faixa = 'cobre' | 'fibra' | 'ar'

const Z: Record<Faixa, number> = { cobre: -3.6, fibra: -0.4, ar: 3.2 }

function Destaque({ z, ativo }: { z: number; ativo: boolean }) {
  if (!ativo) return null
  return <Caixa tam={[15, 0.02, 2.9]} pos={[0.2, 0.02, z]} cor="#ffe28a" opacidade={0.55} sombra={false} />
}

function Guiado({ faixa, cor, raio, pulso, alongado, duracao, rotulo, sub, apagado, foco }: {
  faixa: Faixa
  cor: string
  raio: number
  pulso: string
  alongado?: boolean
  duracao: number
  rotulo: string
  sub: string
  apagado: boolean
  foco: boolean
}) {
  const z = Z[faixa]
  // sai da frente de um gabinete, corre reto na frente das mesas e entra no outro
  const pontos = cantosSuaves([[-3.59, 0.16, z + 0.3], [-3.59, 0.16, z + 1.25], [5.01, 0.16, z + 1.25], [5.01, 0.16, z + 0.3]], 0.4)
  const curva = useCurva(pontos)
  return (
    <group>
      <Destaque z={z + 0.3} ativo={foco} />
      <Lote pos={[-4.4, 0, z]} tam={[3, 2.2]} />
      <Lote pos={[4.6, 0, z]} tam={[3, 2.2]} />
      <Computador pos={[-4.4, 0.12, z]} escala={0.85} />
      <Computador pos={[4.2, 0.12, z]} escala={0.85} tela="#8fd9a8" />
      <Cabo curva={curva} cor={cor} raio={raio} opacidade={faixa === 'fibra' ? 0.55 : undefined} />
      <Pulsos curva={curva} cor={pulso} alongado={alongado} duracao={duracao} quantidade={alongado ? 7 : 5} tamanho={alongado ? 0.06 : 0.1} />
      <Rotulo pos={[0.3, 1.2, z + 0.9]} apagado={apagado}>
        {rotulo}<small>{sub}</small>
      </Rotulo>
    </group>
  )
}

export function CenaMeios(cena: CenaProps) {
  const foco = (cena.estado.foco as string | undefined) ?? 'todos'
  const apagado = (f: Faixa) => foco !== 'todos' && foco !== f

  return (
    <>
      <Ilha raio={9} />

      <Guiado faixa="cobre" cor="#e0823d" raio={0.08} pulso="#ffd23f" duracao={2.6}
        rotulo="Cabo par trançado" sub="guiado · sinal elétrico" apagado={apagado('cobre')} foco={foco === 'cobre'} />
      <PlacaDeRede pos={[-3.0, 0.12, Z.cobre + 0.95]} rot={[0, -0.4, 0]} escala={0.55} />

      <Guiado faixa="fibra" cor="#cfe9f5" raio={0.07} pulso="#48e5ff" alongado duracao={1.1}
        rotulo="Fibra ótica" sub="guiado · sinal ótico (luz)" apagado={apagado('fibra')} foco={foco === 'fibra'} />

      <Destaque z={Z.ar} ativo={foco === 'ar'} />
      <Lote pos={[-3.9, 0, Z.ar]} tam={[5, 2.4]} />
      <PontoDeAcesso pos={[-5.3, 0.12, Z.ar]} escala={1.2} />
      <Ondas pos={[-5.3, 0.5, Z.ar]} cor="#4aa8ff" raio={3} periodo={2.2} />
      <Notebook pos={[-2.6, 0.12, Z.ar + 0.1]} rot={[0, -0.5, 0]} escala={0.9} />
      <Rotulo pos={[-4, 1.7, Z.ar]} apagado={apagado('ar')}>
        Ponto de acesso<small>não guiado · rádio ou micro-ondas</small>
      </Rotulo>

      <Lote pos={[3.6, 0, Z.ar]} tam={[5, 2.4]} />
      <EstacaoBase pos={[2.3, 0.12, Z.ar]} />
      <Ondas pos={[2.3, 2.9, Z.ar]} cor="#b57bff" raio={3.4} periodo={1.6} />
      <Celular pos={[5.0, 0.12, Z.ar + 0.3]} rot={[0, -0.4, 0]} escala={1.3} />
      <Rotulo pos={[4.4, 1.7, Z.ar]} apagado={apagado('ar')}>
        Estação base<small>não guiado · micro-ondas</small>
      </Rotulo>

      <Alvo id="placa" pos={[-3.0, 0.7, Z.cobre + 0.95]} cena={cena} />
      <Alvo id="ap" pos={[-5.3, 1.2, Z.ar]} cena={cena} />
      <Alvo id="base" pos={[2.3, 3.8, Z.ar]} cena={cena} />
    </>
  )
}
