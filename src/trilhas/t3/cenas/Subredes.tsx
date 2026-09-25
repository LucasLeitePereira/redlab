import { Arvore, Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Notebook, Servidor } from '../../../three/modelos'
import { Dado } from '../../../three/dados'
import { Janela, linhaDoTempo, Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { CenaBits } from './Bits'

// Fases 3.3 e 3.4 — a figura dos slides (Aula 03 p1, p. 3–5): três notebooks no mesmo
// cabo, dois na sub-rede A (192.168.10) e um na B (172.16). Cada modo acrescenta uma
// linha da figura: IP → máscara → endereço/identificador da sub-rede → gateway.

const Y = 0.16
const BARRA_Z = -1.4
const HOSTS = [
  { x: -4, ip: '192.168.10.1', mascara: '255.255.255.0', subrede: '192.168.10.0', sr: 'A' },
  { x: -1, ip: '192.168.10.2', mascara: '255.255.255.0', subrede: '192.168.10.0', sr: 'A' },
  { x: 3.6, ip: '172.16.10.1', mascara: '255.255.0.0', subrede: '172.16.0.0', sr: 'B' },
]
const GATEWAY_X = 1.3
const FRONTEIRA_X = 1.3

/** No slide os pontos do IP são "·": fica igual aqui. */
const comPonto = (ip: string) => ip.replaceAll('.', '·')

function Hosts({ modo }: { modo: string }) {
  const comMascara = modo !== 'mesma'
  const comSubrede = modo === 'identificador'
  const feliz = (sr: string) => sr === 'A' || modo === 'gateway'
  return (
    <>
      {/* chão das duas sub-redes */}
      <Caixa tam={[5.6, 0.06, 5.2]} pos={[-2.5, 0.03, 1.1]} cor="#f3dcda" sombra={false} />
      <Caixa tam={[4.4, 0.06, 5.2]} pos={[3.6, 0.03, 1.1]} cor="#dde2f6" sombra={false} />
      <Rotulo pos={[-2.5, 0.2, 3.35]} escuro>SUB-REDE A</Rotulo>
      <Rotulo pos={[3.6, 0.2, 3.35]} escuro>SUB-REDE B</Rotulo>

      <Ligacao pontos={[[-5.4, Y, BARRA_Z], [5.4, Y, BARRA_Z]]} raio={0.08} cor="#2f5fa0" />
      {HOSTS.map((h) => (
        <group key={h.ip}>
          <Ligacao pontos={[[h.x, Y, BARRA_Z], [h.x, Y, 0.1]]} raio={0.05} cor="#2f5fa0" />
          <Notebook pos={[h.x, 0.08, 0.6]} escala={1.45} tela={feliz(h.sr) ? '#9fd8b4' : '#f0a8a4'} />
          <Rotulo pos={[h.x, 0.95, 0.35]} classe="emoji">{feliz(h.sr) ? '🙂' : '😠'}</Rotulo>
          <Rotulo pos={[h.x, 0.25, 1.55]} classe="bits">{comPonto(h.ip)}</Rotulo>
          {comMascara && <Rotulo pos={[h.x, 0.25, 2.05]} classe="bits">{comPonto(h.mascara)}</Rotulo>}
          {comSubrede && (
            <Rotulo pos={[h.x, 0.25, 2.6]} classe="bits">
              <span style={{ color: '#23915f' }}>{comPonto(h.subrede)}</span>
            </Rotulo>
          )}
        </group>
      ))}
      <Rotulo pos={[-6.3, 0.25, 1.55]} classe="esq">IP →</Rotulo>
      {comMascara && <Rotulo pos={[-6.3, 0.25, 2.05]} classe="esq">Máscara →</Rotulo>}
      {comSubrede && (
        <>
          <Rotulo pos={[-6.3, 0.25, 2.6]} classe="esq">Sub-rede →</Rotulo>
          <Rotulo pos={[-2.5, 0.9, 4.1]} classe="bits grande">Identificador: 192·168·10</Rotulo>
          <Rotulo pos={[3.6, 0.9, 4.1]} classe="bits grande">Identificador: 172·16</Rotulo>
        </>
      )}
    </>
  )
}

const acima = (x: number): V3 => [x, Y, BARRA_Z]
const naMesa = (x: number): V3 => [x, Y, 0.1]

/** A1 → A2 funciona; A2 → B para na fronteira: sub-redes diferentes não se falam direto. */
function MesmaSubrede() {
  const velocidade = 2.6
  const ok = [naMesa(-4), acima(-4), acima(-1), naMesa(-1)]
  const barrado = [naMesa(-1), acima(-1), acima(FRONTEIRA_X - 0.4)]
  const tOk = linhaDoTempo(ok, velocidade, 0).total
  const tBarrado = linhaDoTempo(barrado, velocidade, 0).total
  const periodo = tOk + tBarrado + 3.2
  return (
    <>
      <Percurso pontos={ok} velocidade={velocidade} periodo={periodo}>
        <group scale={0.75}><Dado cor="#23915f" /></group>
      </Percurso>
      <Janela periodo={periodo} de={tOk} ate={tOk + 1.4}>
        <Rotulo pos={[-1, 1.9, 0.4]} escuro>✓ Mesma sub-rede: entregue</Rotulo>
      </Janela>
      <Percurso pontos={barrado} velocidade={velocidade} atraso={tOk + 1.4} periodo={periodo}>
        <group scale={0.75}><Dado cor="#cf4b47" /></group>
      </Percurso>
      <Janela periodo={periodo} de={tOk + 1.4 + tBarrado} ate={periodo}>
        <Rotulo pos={[FRONTEIRA_X, 1.1, BARRA_Z]} escuro>⛔ Outra sub-rede: não vai direto</Rotulo>
      </Janela>
      {/* fronteira pontilhada entre as duas sub-redes */}
      {Array.from({ length: 12 }, (_, i) => (
        <Caixa key={i} tam={[0.08, 0.05, 0.22]} pos={[FRONTEIRA_X, 0.08, -3.3 + i * 0.5]} cor="#cf4b47" sombra={false} />
      ))}
    </>
  )
}

function Gateway() {
  const velocidade = 2.6
  const g: V3 = [GATEWAY_X, Y, -2.5]
  const caminho = [naMesa(-1), acima(-1), acima(GATEWAY_X), g, acima(GATEWAY_X), acima(3.6), naMesa(3.6)]
  const { chegadas, total } = linhaDoTempo(caminho, velocidade, 0.25)
  const periodo = total + 2
  return (
    <>
      <Ligacao pontos={[acima(GATEWAY_X), [GATEWAY_X, Y, -2.3]]} raio={0.06} cor="#2f5fa0" />
      <Servidor pos={[GATEWAY_X, 0.08, -3.1]} escala={1.1} />
      <Rotulo pos={[GATEWAY_X, 2.35, -3.1]} escuro>gateway</Rotulo>
      <Rotulo pos={[GATEWAY_X - 0.7, 1.2, -2.5]} classe="esq bits">192·168·10·3 / 255·255·255·0</Rotulo>
      <Rotulo pos={[GATEWAY_X + 0.7, 1.2, -2.5]} classe="dir bits">172·16·10·2 / 255·255·0·0</Rotulo>
      <Percurso pontos={caminho} velocidade={velocidade} espera={0.25} periodo={periodo}>
        <group scale={0.75}><Dado cor="#e9a620" /></group>
      </Percurso>
      <Janela periodo={periodo} de={chegadas[3] - 0.2} ate={chegadas[3] + 1.4}>
        <Rotulo pos={[GATEWAY_X, 2.9, -3.1]}>Encaminha: A → B</Rotulo>
      </Janela>
      <Janela periodo={periodo} de={total} ate={periodo}>
        <Rotulo pos={[3.6, 1.9, 0.4]} escuro>✓ Chegou pela gateway</Rotulo>
      </Janela>
    </>
  )
}

export function CenaSubredes(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'mesma'
  if (modo === 'and') return <CenaBits {...cena} />
  return (
    <>
      <Ilha raio={8.6} />
      <group key={modo}>
        <Hosts modo={modo} />
        {modo === 'mesma' && <MesmaSubrede />}
        {modo === 'mascara' && <Rotulo pos={[0, 1.6, -3]} classe="grande">OBS: Não é possível ter dois hosts com o mesmo endereço IP.</Rotulo>}
        {modo === 'gateway' && <Gateway />}
      </group>
      <Arvore pos={[-6.4, 0, -4.2]} escala={0.8} />
      <Arvore pos={[6.3, 0, -4.1]} />
      <Arvore pos={[6.6, 0, 4.2]} escala={0.8} />
    </>
  )
}
