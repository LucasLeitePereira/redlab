import { Alvo, Arvore, Caixa, Cilindro, Ilha, Lote, Rotulo } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, PlacaDeRede } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { CenaBits } from './Bits'

// Fase 3.1 — os 3 tipos de endereço (Aula 03 p1, p. 2) empilhados como andares:
// 1º físico (MAC, na placa de rede) embaixo, 2º lógico (IP) no meio e 3º de aplicação
// (portas) em cima, do jeito que o slide lista. Os outros modos são o IPv4 em bits.

/** Janelinha de programa flutuando sobre o computador. */
function Janela({ pos, cor }: { pos: [number, number, number]; cor: string }) {
  return (
    <group position={pos}>
      <Caixa tam={[1.05, 0.72, 0.06]} pos={[0, 0, 0]} cor="#f4f6f9" />
      <Caixa tam={[1.05, 0.14, 0.07]} pos={[0, 0.29, 0.005]} cor={cor} sombra={false} />
      <Caixa tam={[0.7, 0.06, 0.07]} pos={[-0.1, 0.05, 0.005]} cor="#c9d1db" sombra={false} />
      <Caixa tam={[0.5, 0.06, 0.07]} pos={[-0.2, -0.1, 0.005]} cor="#c9d1db" sombra={false} />
    </group>
  )
}

function Tipos({ cena }: { cena: CenaProps }) {
  return (
    <>
      <Ilha raio={8} />
      <Lote pos={[0.4, 0, 0]} tam={[3.4, 2.6]} />
      <Computador pos={[0.4, 0.12, 0]} escala={1.35} />

      {/* 1º — físico: a placa de rede */}
      <PlacaDeRede pos={[-2.2, 0.12, 0.9]} rot={[0, 0.35, 0]} escala={1.6} />
      <Ligacao pontos={[[-7.4, 0.14, 1.0], [-2.6, 0.14, 1.0]]} surgir={0.1} viagens={[{ duracao: 2.6, pausa: 1.4 }]} />
      <Rotulo pos={[-2.2, 1.55, 0.9]} escuro>1º Físico <small>MAC</small></Rotulo>
      <Alvo id="mac" pos={[-2.2, 2.2, 0.9]} cena={cena} />

      {/* 2º — lógico: a placa com o IP */}
      <Cilindro raio={0.05} altura={1.9} pos={[3.3, 0.95, 0.6]} cor="#8e99a6" />
      <Caixa tam={[2.2, 0.62, 0.08]} pos={[3.3, 2.05, 0.6]} cor="#2f6fb0" />
      <Rotulo pos={[3.3, 2.05, 0.7]} classe="bits">192.168.10.1</Rotulo>
      <Rotulo pos={[3.3, 2.75, 0.6]} escuro>2º Lógico <small>IP</small></Rotulo>
      <Alvo id="ip" pos={[4.7, 2.05, 0.6]} cena={cena} />

      {/* 3º — aplicações: janelas de programas, cada uma com a sua porta */}
      <Janela pos={[-0.35, 3.0, -0.2]} cor="#e0463f" />
      <Janela pos={[0.95, 3.25, -0.4]} cor="#23915f" />
      <Rotulo pos={[0.3, 4.1, -0.3]} escuro>3º Aplicações <small>portas</small></Rotulo>
      <Alvo id="porta" pos={[-1.3, 3.1, -0.2]} cena={cena} />

      <Arvore pos={[-5.5, 0, -3.8]} escala={0.9} />
      <Arvore pos={[5.4, 0, -3.6]} />
      <Arvore pos={[5.8, 0, 3.4]} escala={0.8} />
    </>
  )
}

export function CenaEnderecos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'tipos'
  return modo === 'tipos' ? <Tipos cena={cena} /> : <CenaBits {...cena} />
}
