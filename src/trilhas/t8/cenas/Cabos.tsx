import { Alvo, Caixa, Cilindro, Ilha, Rotulo } from '../../../three/base'
import type { CenaProps } from '../../../engine/tipos'
import { Tabela3D, linha, type Col } from './comum'

// Fase 8.8 — Par trançado: categorias CAT1 a CAT8 (anexo de cabos).
// 'cabos': 9 cabos lado a lado (mais grosso e mais escuro = categoria maior), conector RJ-45 (GG45 no CAT7);
// 'tabela': Categoria | Banda | Taxa Transferência | Uso Comum.

type Cat = { id: string; nome: string; banda: string; taxa: string; uso: string; azul?: boolean }

const CATS: Cat[] = [
  { id: 'cat1', nome: 'CAT1', banda: '--', taxa: '--', uso: 'Cabo telefônico tradicional (voz)' },
  { id: 'cat2', nome: 'CAT2', banda: '4 MHz', taxa: '--', uso: 'Transmissão de dados' },
  { id: 'cat3', nome: 'CAT3', banda: '10 MHz', taxa: '10 Mbps (Ethernet)', uso: 'Obsoleto' },
  { id: 'cat4', nome: 'CAT4', banda: '16 MHz', taxa: '20 Mbps (Token Ring)', uso: 'Obsoleto' },
  { id: 'cat5', nome: 'CAT5', banda: '100 MHz', taxa: '100 Mbps (Fast Ethernet)', uso: 'Obsoleto' },
  { id: 'cat5e', nome: 'CAT5e', banda: '100 MHz', taxa: '100 Mbps (568A) / 1 Gbps (568B)', uso: 'Redes corporativas', azul: true },
  { id: 'cat6', nome: 'CAT6', banda: '250 MHz', taxa: '1 Gbps (Gigabit Ethernet)', uso: 'UTP ou STP', azul: true },
  { id: 'cat7', nome: 'CAT7', banda: '600 MHz', taxa: '10 Gbps (10 Gigas)', uso: 'Blindagem dupla -- Conector GG45' },
  { id: 'cat8', nome: 'CAT8', banda: '2 GHz', taxa: '20-40 Gbps (30 m)', uso: 'Altíssimo desempenho' },
]

// cor da capa: de um cinza claro a um azul bem escuro, conforme a categoria
const CAPAS = ['#c9d1da', '#b9c8d8', '#a3bbd6', '#8aaed4', '#6f9fd8', '#5589c8', '#3f72b4', '#2c5a99', '#1d4380']
const DESTAQUES = ['cat3', 'cat5e', 'cat6', 'cat7']

function Cabos({ cena }: { cena: CenaProps }) {
  const explorando = cena.alvos.length > 0
  return (
    <>
      {CATS.map((c, i) => {
        const x = -5 + i * 1.25
        const r = 0.09 + i * 0.022
        const dest = explorando && DESTAQUES.includes(c.id)
        const gg45 = c.id === 'cat7'
        return (
          <group key={c.id}>
            {dest && <Cilindro raio={0.62} altura={0.06} lados={24} pos={[x, 0.03, 0]} cor="#ffd54a" emissivo="#ffd54a" intensidade={0.5} sombra={false} />}
            {/* capa do cabo */}
            <Cilindro raio={r} altura={2.5} pos={[x, 1.3, 0]} cor={CAPAS[i]} />
            {/* anéis: a "trança" dos pares */}
            {[0.5, 0.95, 1.4, 1.85].map((y) => (
              <Cilindro key={y} raio={r + 0.012} altura={0.05} pos={[x, y, 0]} rot={[0, 0, 0]} cor="#f2f5f8" sombra={false} />
            ))}
            {gg45 && <Cilindro raio={r + 0.03} altura={0.2} pos={[x, 2.4, 0]} cor="#1d2733" />}
            {/* conector: RJ-45 transparente com contatos dourados (GG45 é mais largo) */}
            <Caixa tam={[gg45 ? 0.6 : 0.42, 0.5, 0.34]} pos={[x, 2.7, 0]} cor="#dfe9f2" opacidade={0.85} />
            <Caixa tam={[gg45 ? 0.5 : 0.32, 0.18, 0.36]} pos={[x, 2.86, 0]} cor="#e4b74a" emissivo="#e4b74a" intensidade={0.3} sombra={false} />
            <Caixa tam={[0.12, 0.12, 0.3]} pos={[x, 2.4, 0]} cor="#dfe9f2" sombra={false} />
            <Rotulo pos={[x, 0.0, 0.9]} escuro={dest}>
              {c.nome}
            </Rotulo>
            <Rotulo pos={[x, 3.3, 0]} classe="mini" apagado={explorando && !dest}>
              {gg45 ? 'GG45' : 'RJ-45'}
            </Rotulo>
            <Alvo id={c.id} pos={[x, 3.9, 0]} cena={cena} />
          </group>
        )
      })}
      <Rotulo pos={[0, 4.6, 0]} classe="grande" escuro>
        Par trançado · CAT1 a CAT8
      </Rotulo>
    </>
  )
}

export function CenaCabos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'cabos'
  const colunas: Col[] = [
    { id: 'cat', titulo: 'Categoria' },
    { id: 'banda', titulo: 'Banda', esconder: !!cena.estado.semBanda },
    { id: 'taxa', titulo: 'Taxa Transferência', esconder: !!cena.estado.semTaxa },
    { id: 'uso', titulo: 'Uso Comum', esconder: !!cena.estado.semUso },
  ]
  return (
    <>
      <Ilha raio={8.8} />
      {modo === 'cabos' ? (
        <Cabos cena={cena} />
      ) : (
        <Tabela3D
          pos={[0.4, 2.4, 0]}
          largura={640}
          colunas={colunas}
          linhas={CATS.map((c) => linha(colunas, [c.nome, c.banda, c.taxa, c.uso], !!c.azul))}
          fonte={13}
        />
      )}
    </>
  )
}
