import { Caixa, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'
import { Fileira, LARANJA, RegraBits, Seta, Tijolo, type Cel } from './comum'

// Fase 7.5 — portas e conexões TCP (Aula 06 p. 9–10): clientes com porta aleatória, servidores
// com porta fixa, o par IP:porta de cada conexão e o cabeçalho do segmento TCP.

function PortasCS() {
  return (
    <group>
      {/* régua das portas (fora de escala: 0–1023 desenhado maior para caber o texto) */}
      <Caixa tam={[1.2, 0.16, 0.2]} pos={[-3.4, 4.15, 0]} cor="#8b97a4" />
      <Caixa tam={[6.4, 0.16, 0.2]} pos={[0.4, 4.15, 0]} cor="#3aa0e6" />
      <Rotulo pos={[-4.0, 4.45, 0]} classe="mini">
        0
      </Rotulo>
      <Rotulo pos={[-2.8, 4.45, 0]} classe="mini">
        1024
      </Rotulo>
      <Rotulo pos={[3.6, 4.45, 0]} classe="mini">
        65535
      </Rotulo>
      <Rotulo pos={[0.4, 3.85, 0]} classe="mini">
        portas dos clientes: 1024 a 65535 (aleatórias)
      </Rotulo>

      <Computador pos={[-4.8, 0.12, 0.6]} escala={0.9} />
      <Servidor pos={[4.8, 0.12, 0.6]} escala={0.9} />
      <Rotulo pos={[-4.8, 1.9, 0.6]} classe="cartao">
        <b>GOOGLE CHROME</b>Software Cliente
      </Rotulo>
      <Rotulo pos={[4.8, 2.4, 0.6]} classe="cartao">
        <b>APACHE</b>Software Servidor
      </Rotulo>

      <Tijolo pos={[-2.3, 2.9, 0]} tam={[2.2, 0.8, 0.3]} cor="#34506a" claro texto="porta aleatória" />
      <Tijolo pos={[2.2, 3.3, 0]} tam={[2.2, 0.7, 0.3]} cor="#9a4418" claro texto="TCP/80 · HTTP" />
      <Tijolo pos={[2.2, 2.3, 0]} tam={[2.2, 0.7, 0.3]} cor="#9a4418" claro texto="TCP/443 · HTTPs" />
      <Seta de={[-1.15, 2.95, 0]} para={[1.05, 3.3, 0]} cor="#1d2733" raio={0.03} duasPontas />
      <Seta de={[-1.15, 2.85, 0]} para={[1.05, 2.3, 0]} cor="#1d2733" raio={0.03} duasPontas />
      <Rotulo pos={[-2.3, 2.25, 0]} classe="mini">
        cliente: <b>solicita</b> o serviço
      </Rotulo>
      <Rotulo pos={[2.2, 1.65, 0]} classe="mini">
        servidor: <b>fornece</b> o serviço · portas fixas
      </Rotulo>

      <Ligacao
        pontos={[[-3.8, 0.14, 0.6], [3.8, 0.14, 0.6]]}
        cor="#2f5fa0"
        raio={0.05}
        viagens={[
          { cor: '#ef6f6c', tipo: 'mensagem' },
          { cor: '#3aa0e6', tipo: 'documento', inverso: true, atraso: 3.5 },
        ]}
      />
    </group>
  )
}

function Conexoes({ semPortas }: { semPortas: boolean }) {
  const SRV: V3 = [0, 0.12, -1.8]
  const C1: V3 = [-4.8, 0.12, 1.4]
  const C2: V3 = [4.8, 0.12, 1.4]
  const porta2 = semPortas ? '?????' : '52230'
  return (
    <group>
      <Servidor pos={SRV} escala={1.1} />
      <Computador pos={C1} escala={0.85} />
      <Computador pos={C2} escala={0.85} rot={[0, -0.4, 0]} />
      <Rotulo pos={[0, 2.5, SRV[2]]} escuro>
        SRV-HTTP · 10.1.1.1:80
      </Rotulo>
      <Rotulo pos={[C1[0], 1.8, C1[2]]} classe="bits">
        10.1.1.2:49152
      </Rotulo>
      <Rotulo pos={[C2[0], 1.8, C2[2]]} classe="bits">
        10.1.1.3:{porta2}
      </Rotulo>
      <Ligacao
        pontos={[[C1[0] + 0.6, 0.14, C1[2] - 0.2], [SRV[0] - 0.7, 0.14, SRV[2] + 0.2]]}
        cor="#2f7fd0"
        raio={0.07}
        viagens={[{ cor: '#ef6f6c', tipo: 'mensagem' }, { cor: '#3aa0e6', tipo: 'documento', inverso: true, atraso: 3.5 }]}
      />
      <Ligacao
        pontos={[[C2[0] - 0.6, 0.14, C2[2] - 0.2], [SRV[0] + 0.7, 0.14, SRV[2] + 0.2]]}
        cor="#d9822b"
        raio={0.07}
        viagens={[{ cor: '#ef6f6c', tipo: 'mensagem', atraso: 1.6 }, { cor: '#3aa0e6', tipo: 'documento', inverso: true, atraso: 5.1 }]}
      />
      <Rotulo pos={[-2.9, 1.15, 0.2]} classe="mini">
        Conexão 1: (10.1.1.2:49152) e (10.1.1.1:80)
      </Rotulo>
      <Rotulo pos={[2.9, 1.15, 0.2]} classe="mini">
        Conexão 2: (10.1.1.3:{porta2}) e (10.1.1.1:80)
      </Rotulo>
    </group>
  )
}

const campo = (t: string, f: number, destaque = false): Cel => (destaque ? { t, f, cor: LARANJA, claro: true } : { t, f })

function CabecalhoTcp({ cena }: { cena: CenaProps }) {
  const y = (i: number) => 4.55 - i * 0.62
  return (
    <group>
      <RegraBits y={5.1} />
      <Fileira y={y(0)} h={0.52} cena={cena} itens={[campo('Porta de Origem', 16, true), campo('Porta de Destino', 16, true)]} />
      <Fileira y={y(1)} h={0.52} itens={[campo('Número de Sequência', 32)]} />
      <Fileira y={y(2)} h={0.52} itens={[campo('Número de ACK (reconhecimento)', 32)]} />
      <Fileira y={y(3)} h={0.52} itens={[campo('OFF', 4), campo('RES', 6), campo('Código', 6), campo('Tamanho da Janela', 16)]} />
      <Fileira y={y(4)} h={0.52} itens={[campo('Cheksum', 16), campo('Urgent Pointer', 16)]} />
      <Fileira y={y(5)} h={0.52} itens={[campo('Opções', 24), campo('Pad', 8)]} />
      <Fileira y={y(6)} h={0.52} itens={[{ t: 'Dados com a carga útil do Segmento', f: 32, cor: '#ffffff' }]} />
    </group>
  )
}

export function CenaPortas(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'portas'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'portas' && <PortasCS />}
      {modo === 'conexoes' && <Conexoes semPortas={!!cena.estado.semPortas} />}
      {modo === 'cabecalho' && <CabecalhoTcp cena={cena} />}
    </>
  )
}
