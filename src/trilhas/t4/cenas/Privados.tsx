import { Arvore, Caixa, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Dado } from '../../../three/dados'
import { Ligacao } from '../../../three/Ligacao'
import { Notebook, Roteador, Servidor } from '../../../three/modelos'
import { arco, Janela, linhaDoTempo, Percurso, useCurva, Viajante } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'

// Fase 4.3 — endereços IPs privados (Aula 04, p. 6). Três redes locais, uma para cada
// faixa privada do slide, ligadas à Internet (o globo) por um roteador.

const Y = 0.16
const INTERNET: V3 = [0, 0, -4.6]
const REDES = [
  { x: -5.6, faixa: '10.0.0.0/8', base: '10.0.0.', cor: '#f3dcda', forte: '#cf4b47' },
  { x: 0, faixa: '172.16.0.0/12', base: '172.16.0.', cor: '#fdf3dc', forte: '#b77d06' },
  { x: 5.6, faixa: '192.168.0.0/16', base: '192.168.0.', cor: '#dde2f6', forte: '#2f6fb0' },
]
const DX = [-1.4, 0, 1.4]
const Z_HOST = 2.3
const Z_ROTEADOR = 0.1

const host = (x: number, i: number): V3 => [x + DX[i], Y, Z_HOST - 0.5]
/** Os dados andam acima dos cabos, para não sumirem atrás das telas dos notebooks. */
const alto = (pontos: V3[]): V3[] => pontos.map(([x, , z]) => [x, 0.75, z])

function Rede({ x, faixa, base, cor, forte }: (typeof REDES)[number]) {
  return (
    <>
      <Caixa tam={[4.6, 0.06, 3.9]} pos={[x, 0.03, 1.5]} cor={cor} sombra={false} />
      <Rotulo pos={[x, 0.25, 3.75]} classe="bits grande">
        <span style={{ color: forte }}>{faixa}</span>
      </Rotulo>
      <Roteador pos={[x, 0.08, Z_ROTEADOR]} cor={forte} />
      <Ligacao pontos={[[x, Y, Z_ROTEADOR - 0.4], [INTERNET[0] + x * 0.18, Y, INTERNET[2] + 1.3]]} raio={0.05} cor="#6b7785" />
      {DX.map((dx, i) => (
        <group key={i}>
          <Ligacao pontos={[host(x, i), [x + dx * 0.3, Y, Z_ROTEADOR + 0.35]]} raio={0.04} cor={forte} />
          <Notebook pos={[x + dx, 0.08, Z_HOST]} escala={0.9} />
          <Rotulo pos={[x + dx, 0.25, Z_HOST + 0.85]} classe="bits">
            .{i + 1}
          </Rotulo>
        </group>
      ))}
      <Rotulo pos={[x - 2.1, 0.25, Z_HOST + 0.85]} classe="esq bits">
        {base.slice(0, -1)}
      </Rotulo>
    </>
  )
}

function Internet() {
  return (
    <>
      <Esfera raio={1.3} pos={[INTERNET[0], 1.5, INTERNET[2]]} cor="#3f7fc4" />
      <Servidor pos={[INTERNET[0] - 2.4, 0.08, INTERNET[2] - 0.2]} escala={0.8} />
      <Servidor pos={[INTERNET[0] + 2.4, 0.08, INTERNET[2] - 0.2]} escala={0.8} />
      <Rotulo pos={[INTERNET[0], 3.2, INTERNET[2]]} escuro>
        Internet
      </Rotulo>
    </>
  )
}

/** Dentro de cada rede o IP privado funciona; na Internet ninguém entrega para ele. */
function Privados() {
  const velocidade = 2.4
  const [r] = [REDES[2]]
  const barrado: V3[] = [[INTERNET[0] + 1.2, Y, INTERNET[2] + 1.4], [r.x - 1.8, Y, -1.6]]
  const tBarrado = linhaDoTempo(barrado, velocidade, 0).total
  const periodo = 7
  return (
    <>
      {REDES.map((rede, k) => {
        const caminho = [host(rede.x, 0), [rede.x - 0.42, Y, Z_ROTEADOR + 0.35] as V3, [rede.x + 0.42, Y, Z_ROTEADOR + 0.35] as V3, host(rede.x, 2)]
        return (
          <Percurso key={rede.faixa} pontos={alto(caminho)} velocidade={velocidade} atraso={k * 0.5} periodo={periodo}>
            <group scale={0.9}>
              <Dado cor="#23915f" tipo="mensagem" />
            </group>
          </Percurso>
        )
      })}
      <Janela periodo={periodo} de={2.6} ate={periodo}>
        <Rotulo pos={[0, 2.2, 1.6]} escuro>
          ✓ Dentro da rede, o IP privado funciona
        </Rotulo>
      </Janela>
      <Percurso pontos={alto(barrado)} velocidade={velocidade} atraso={0.5} periodo={periodo}>
        <group scale={0.9}>
          <Dado cor="#cf4b47" tipo="mensagem" />
          <Rotulo pos={[0, 1, 0]} classe="bits">
            para 192.168.0.2
          </Rotulo>
        </group>
      </Percurso>
      <Janela periodo={periodo} de={0.5 + tBarrado} ate={periodo}>
        <Rotulo pos={[r.x - 1.8, 1.4, -1.6]} escuro>
          ⛔ IP privado não é usado na Internet
        </Rotulo>
      </Janela>
    </>
  )
}

/** 172.16.0.0/12 = as 16 redes /16 de 172.16 a 172.31, empilhadas. */
function Faixa172() {
  const x = REDES[1].x
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <Caixa key={i} tam={[2.2, 0.1, 0.8]} pos={[x + 3, 0.2 + i * 0.2, -1.5]} cor={i % 2 ? '#e9c56a' : '#f2d58f'} />
      ))}
      {[0, 15].map((i) => (
        <Rotulo key={i} pos={[x + 4.3, 0.2 + i * 0.2, -1.5]} classe="dir bits">
          172.{16 + i}.0.0/16
        </Rotulo>
      ))}
      <Rotulo pos={[x + 4.3, 1.7, -1.5]} classe="dir bits">
        ⋮
      </Rotulo>
      <Rotulo pos={[x + 3, 4, -1.5]} escuro>
        172.16.0.0/12 → 16 redes /16
      </Rotulo>
    </>
  )
}

/** 127.0.0.1: o dado sai do computador e volta para ele mesmo. */
function Localhost() {
  const x = REDES[2].x + DX[0]
  const volta = useCurva([...arco([x - 0.3, 0.6, Z_HOST], [x - 0.3, 3, Z_HOST - 0.2], 0.9), ...arco([x - 0.3, 3, Z_HOST - 0.2], [x + 0.3, 0.6, Z_HOST], 0.9).slice(1)])
  return (
    <>
      <Viajante curva={volta} duracao={2.6} pausa={0.6}>
        <group scale={0.9}>
          <Dado cor="#7458c4" tipo="mensagem" sombra={false} />
        </group>
      </Viajante>
      <Rotulo pos={[x, 4.3, Z_HOST]} escuro>
        para 127.0.0.1 <small>localhost</small>
      </Rotulo>
    </>
  )
}

/** 255.255.255.255: uma cópia para cada host da rede local. */
function Broadcast() {
  const r = REDES[2]
  const velocidade = 2.4
  const centro: V3 = [r.x, Y, Z_ROTEADOR + 0.35]
  const destinos = [host(r.x, 1), host(r.x, 2)]
  const periodo = 4.5
  return (
    <>
      {destinos.map((d, i) => (
        <Percurso key={i} pontos={alto([host(r.x, 0), centro, d])} velocidade={velocidade} periodo={periodo}>
          <group scale={0.9}>
            <Dado cor="#e9a620" tipo="mensagem" />
          </group>
        </Percurso>
      ))}
      <Rotulo pos={[r.x, 2.3, 1.2]} escuro>
        para 255.255.255.255: todos da rede
      </Rotulo>
    </>
  )
}

export function CenaPrivados({ estado }: CenaProps) {
  const modo = (estado.modo as string | undefined) ?? 'privados'
  return (
    <>
      <Ilha raio={9.4} />
      <Internet />
      {REDES.map((r) => (
        <Rede key={r.faixa} {...r} />
      ))}
      <group key={modo}>
        {modo === 'privados' && <Privados />}
        {modo === '172' && <Faixa172 />}
        {modo === 'localhost' && <Localhost />}
        {modo === 'broadcast' && <Broadcast />}
      </group>
      <Arvore pos={[-7.2, 0, -3.6]} escala={0.8} />
      <Arvore pos={[7.4, 0, -3.4]} />
    </>
  )
}
