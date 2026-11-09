import { Alvo, Caixa, Ilha, Rotulo } from '../../../three/base'
import { Servidor } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { Seta, Tijolo } from './comum'

// Fase 7.8 — códigos de resposta HTTP (Aula 06 p. 18–19): a tabela das cinco famílias e um
// teste em que o aluno "pede páginas" e vê o código devolvido.

type Codigo = { n: string; d: string }
type Familia = { id: string; sigla: string; nome: string; cor: string; codigos: Codigo[] }

const FAMILIAS: Familia[] = [
  { id: '1', sigla: '1xx', nome: 'Informativo', cor: '#5b7fa6', codigos: [{ n: '100', d: 'Continue' }] },
  { id: '2', sigla: '2xx', nome: 'Sucesso', cor: '#2e8b3d', codigos: [{ n: '200', d: 'OK' }, { n: '202', d: 'Aceito' }] },
  {
    id: '3',
    sigla: '3xx',
    nome: 'Redirecionamento',
    cor: '#c48a14',
    codigos: [{ n: '301', d: 'Moved Permanently' }, { n: '302', d: 'Found (encontrado)' }],
  },
  {
    id: '4',
    sigla: '4xx',
    nome: 'Erro no Cliente',
    cor: '#c0562b',
    codigos: [
      { n: '400', d: 'Solicitação Inválida' },
      { n: '401', d: 'Não Autorizado' },
      { n: '403', d: 'Proibido' },
      { n: '404', d: 'Não encontrado' },
    ],
  },
  {
    id: '5',
    sigla: '5xx',
    nome: 'Erro no servidor',
    cor: '#a12f2f',
    codigos: [{ n: '500', d: 'Internal Server Error' }, { n: '505', d: 'Versão HTTP não suportada' }],
  },
]

const X_INI = -5.6
const PASSO = 2.35

function Tabela({ familia, semNomes }: { familia: string; semNomes: boolean }) {
  const ids = familia.split(',').map((s) => s.trim())
  const linhas = FAMILIAS.filter((f) => ids.includes(f.id))
  const espaco = 1.05
  const topo = 2.6 + ((linhas.length - 1) * espaco) / 2
  return (
    <group>
      <Rotulo pos={[0, topo + 0.95, 0]} escuro>
        Códigos usados no Response
      </Rotulo>
      {linhas.map((f, i) => {
        const y = topo - i * espaco
        return (
          <group key={f.id}>
            <Tijolo pos={[X_INI + 0.85, y, 0]} tam={[1.7, 0.85, 0.3]} cor={f.cor} claro texto={f.sigla} />
            {!semNomes && (
              <Rotulo pos={[X_INI + 0.85, y - 0.62, 0.1]} classe="mini">
                {f.nome}
              </Rotulo>
            )}
            {f.codigos.map((c, k) => {
              const x = X_INI + 1.9 + k * PASSO + 1.1
              return (
                <group key={c.n}>
                  <Caixa tam={[PASSO - 0.1, 0.85, 0.3]} pos={[x, y, 0]} cor="#e3e9f0" />
                  <Rotulo pos={[x, y + (semNomes ? 0 : 0.17), 0.18]} classe="tijolo">
                    <span style={{ fontSize: 16, fontFamily: 'var(--mono)' }}>{c.n}</span>
                  </Rotulo>
                  {!semNomes && (
                    <Rotulo pos={[x, y - 0.2, 0.18]} classe="tijolo pequeno">
                      {c.d}
                    </Rotulo>
                  )}
                </group>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

const PEDIDOS = [
  { id: 'ok', texto: 'GET /index.html', codigo: '200', nome: 'OK', cor: '#2e8b3d' },
  { id: 'sumiu', texto: 'GET /pagina-apagada', codigo: '404', nome: 'Não encontrado', cor: '#c0562b' },
  { id: 'senha', texto: 'GET /restrito (sem login)', codigo: '401', nome: 'Não Autorizado', cor: '#c48a14' },
  { id: 'quebrou', texto: 'GET /relatorio', codigo: '500', nome: 'Internal Server Error', cor: '#a12f2f' },
]

function Pedidos({ cena }: { cena: CenaProps }) {
  const explorando = cena.alvos.length > 0
  return (
    <group>
      <Servidor pos={[5.0, 0.12, 0.5]} escala={1.4} />
      <Rotulo pos={[5.0, 3.1, 0.5]} escuro>
        Servidor
      </Rotulo>
      {PEDIDOS.map((p, i) => {
        const y = 4.3 - i * 1.05
        const visivel = !explorando || cena.revelados.includes(p.id)
        return (
          <group key={p.id}>
            <Tijolo pos={[-3.9, y, 0]} tam={[3.4, 0.7, 0.3]} cor="#34506a" claro texto={p.texto} />
            <Alvo id={p.id} pos={[-2.0, y, 0.3]} cena={cena} />
            <Seta de={[-2.0, y, 0]} para={[0.2, y, 0]} cor="#1d2733" raio={0.025} />
            {visivel ? (
              <Tijolo pos={[1.6, y, 0]} tam={[2.6, 0.7, 0.3]} cor={p.cor} claro texto={`${p.codigo} ${p.nome}`} />
            ) : (
              <Tijolo pos={[1.6, y, 0]} tam={[2.6, 0.7, 0.3]} cor="#d5d9de" texto="?" />
            )}
          </group>
        )
      })}
    </group>
  )
}

export function CenaCodigos(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'tabela'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'tabela' && <Tabela familia={String(cena.estado.familia ?? '1,2,3,4,5')} semNomes={!!cena.estado.semNomes} />}
      {modo === 'pedidos' && <Pedidos cena={cena} />}
    </>
  )
}
