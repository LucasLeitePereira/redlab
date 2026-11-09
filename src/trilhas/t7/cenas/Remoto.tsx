import { Caixa, Esfera, Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Processando, Roteador, Servidor, Terminal } from '../../../three/modelos'
import { Percurso } from '../../../three/movimento'
import type { CenaProps } from '../../../engine/tipos'
import { Seta, Tijolo } from './comum'

// Fase 7.11 — acesso remoto (Aula 06 p. 26–32): terminal local e remoto, portas, TELNET em
// texto puro, SSH com cifragem, multiplexação de canais e VPN com túnel SSH.

const CINZA_CIFRADO = '#5b6470'

function TerminalRemoto() {
  const A: V3 = [-4.8, 0.14, 0]
  const B: V3 = [4.8, 0.14, 0]
  return (
    <group>
      <Terminal pos={[A[0], 0.12, 0]} escala={1.3} />
      <Servidor pos={[B[0], 0.12, 0]} escala={1.0} />
      <Processando pos={[B[0], 2.3, 0]} />
      <Rotulo pos={[A[0], 1.5, 0.3]} classe="papel">
        {'> dir\n> '}
        <small>terminal local</small>
      </Rotulo>
      <Rotulo pos={[B[0], 2.9, 0]} escuro>
        Terminal remoto (Servidor)
      </Rotulo>
      <Ligacao
        pontos={[[A[0] + 0.8, 0.16, 0], [B[0] - 0.8, 0.16, 0]]}
        cor="#2f5fa0"
        raio={0.07}
        viagens={[
          { cor: '#ef6f6c', tipo: 'mensagem' },
          { cor: '#3aa0e6', tipo: 'mensagem', inverso: true, atraso: 5.5 },
        ]}
      />
      <Rotulo pos={[0, 3.4, 0]} classe="cartao">
        <b>① O texto digitado é enviado para o servidor</b>
      </Rotulo>
      <Rotulo pos={[0, 2.6, 0]} classe="cartao">
        <b>② Comando processado no servidor</b>
      </Rotulo>
      <Rotulo pos={[0, 1.8, 0]} classe="cartao">
        <b>③ O resultado é ecoado para o cliente</b>
      </Rotulo>
    </group>
  )
}

function Portas({ semNumeros }: { semNumeros: boolean }) {
  const itens = [
    { x: -4.1, n: '23', nome: 'TELNET', desc: 'Protocolo tradicional usado na Internet', cor: '#7a3514' },
    { x: 0, n: '22', nome: 'SSH', desc: 'Protocolo que permite o uso de criptografia', cor: '#2e6b3a' },
    { x: 4.1, n: '3389', nome: 'RDP', desc: 'Protocolo de Acesso Remoto que transfere a interface gráfica', cor: '#34506a' },
  ]
  return (
    <group>
      {itens.map((i) => (
        <group key={i.nome}>
          <Tijolo pos={[i.x, 3.6, 0]} tam={[3.4, 1.0, 0.4]} cor={i.cor} claro texto={`${semNumeros ? 'TCP/?' : `TCP/${i.n}`} — ${i.nome}`} />
          <Rotulo pos={[i.x, 2.7, 0]} classe="cartao">
            {i.desc}
          </Rotulo>
        </group>
      ))}
      <Terminal pos={[-4.1, 0.12, 0.5]} escala={1.2} />
      <Terminal pos={[0, 0.12, 0.5]} escala={1.2} />
      <Rotulo pos={[0, 1.5, 0.5]} classe="emoji">
        🔒
      </Rotulo>
      <Computador pos={[4.1, 0.12, 0.5]} escala={0.9} />
    </group>
  )
}

function Telnet() {
  const A: V3 = [-4.8, 0.14, 0]
  const B: V3 = [4.8, 0.14, 0]
  const letras = ['s', 'e', 'n', 'h', 'a']
  const passo = 2.3
  return (
    <group>
      <Terminal pos={[A[0], 0.12, 0]} escala={1.3} />
      <Servidor pos={[B[0], 0.12, 0]} escala={1.0} />
      <Ligacao pontos={[[A[0] + 0.8, 0.16, 0], [B[0] - 0.8, 0.16, 0]]} cor="#8a5a3b" raio={0.07} />
      {letras.map((l, i) => (
        <Percurso key={i} pontos={[[A[0] + 0.8, 0.5, 0], [B[0] - 0.8, 0.5, 0]]} velocidade={4} atraso={i * passo} periodo={letras.length * passo + 1}>
          <Rotulo pos={[0, 0.3, 0]} classe="bits grande">
            {l}
          </Rotulo>
        </Percurso>
      ))}
      <Rotulo pos={[A[0], 1.6, 0.3]} classe="papel">
        {'login: aluno\nsenha: senha'}
      </Rotulo>
      <Rotulo pos={[0, 2.8, 0]} escuro>
        TELNET · TCP/23
      </Rotulo>
      <Rotulo pos={[0, 2.1, 0]} classe="cartao">
        <b>byte a byte</b>cada caractere viaja sozinho e legível, em texto puro
      </Rotulo>
      <Rotulo pos={[B[0], 2.6, 0]} classe="mini">
        ecoa cada caractere
      </Rotulo>
    </group>
  )
}

function Ssh() {
  const A: V3 = [-5.6, 0.14, 0]
  const B: V3 = [5.6, 0.14, 0]
  return (
    <group>
      <Terminal pos={[A[0], 0.12, 0]} escala={1.1} />
      <Servidor pos={[B[0], 0.12, 0]} escala={0.9} />
      <Rotulo pos={[-4.5, 2.5, 0]} classe="cartao">
        <b>Texto Claro Legível</b>
        <i>Aula de Segurança de Redes</i>
      </Rotulo>
      <Rotulo pos={[4.5, 2.5, 0]} classe="cartao">
        <b>Texto Claro Legível</b>
        <i>Aula de Segurança de Redes</i>
      </Rotulo>
      <Tijolo pos={[-3.1, 1.0, 0]} tam={[1.9, 0.6, 0.4]} cor="#2e6b3a" claro texto="CIFRAGEM" />
      <Tijolo pos={[3.1, 1.0, 0]} tam={[1.9, 0.6, 0.4]} cor="#2e6b3a" claro texto="DECIFRAGEM" />
      <Ligacao
        pontos={[[-2.1, 0.16, 0], [2.1, 0.16, 0]]}
        cor="#2f5fa0"
        raio={0.1}
        viagens={[{ cor: CINZA_CIFRADO, tipo: 'mensagem' }]}
      />
      <Rotulo pos={[0, 1.15, 0]} classe="cartao">
        <b>🔒 Texto Cifrado Criptografado</b>
        <span style={{ fontFamily: 'var(--mono)' }}>9f3a·c7e1·b04d·72aa·e5</span>
      </Rotulo>
      <Rotulo pos={[0, 0.2, 1.0]} classe="mini">
        <b>Conexão TCP/22</b>
      </Rotulo>
    </group>
  )
}

const CANAIS = [
  { nome: 'login remoto', cor: '#ef6f6c', tipo: 'mensagem' as const, y: 0.35 },
  { nome: 'transferência de arquivo', cor: '#3aa0e6', tipo: 'documento' as const, y: 0.7 },
  { nome: 'outro canal lógico', cor: '#39a35a', tipo: 'imagem' as const, y: 1.05 },
]

function Multiplexacao() {
  return (
    <group>
      <Terminal pos={[-5.4, 0.12, 0]} escala={1.1} />
      <Servidor pos={[5.4, 0.12, 0]} escala={0.9} />
      <Caixa tam={[8.6, 1.5, 1.2]} pos={[0, 0.72, 0]} cor="#7fa8d6" opacidade={0.28} sombra={false} />
      {CANAIS.map((c, i) => (
        <Ligacao
          key={c.nome}
          pontos={[[-4.2, c.y, 0], [4.2, c.y, 0]]}
          cor={c.cor}
          raio={0.07}
          viagens={[{ cor: c.cor, tipo: c.tipo, atraso: i * 1.1, duracao: 3.2 }]}
        />
      ))}
      <Rotulo pos={[0, 2.2, 0]} escuro>
        Uma única conexão SSH · TCP/22
      </Rotulo>
      {CANAIS.map((c, i) => (
        <Rotulo key={c.nome} pos={[-3.2 + i * 3.2, 3.0, 0]} classe="mini">
          <span style={{ color: c.cor }}>■</span> canal {i + 1}: {c.nome}
        </Rotulo>
      ))}
      <Rotulo pos={[0, 3.8, 0]} classe="cartao">
        <b>Multiplexação</b>enviar mais de um sinal em uma única linha ou conexão
      </Rotulo>
    </group>
  )
}

function Vpn() {
  const RC: V3 = [-3.0, 0.12, 0]
  const RS: V3 = [3.0, 0.12, 0]
  return (
    <group>
      <Computador pos={[-5.6, 0.12, -0.9]} escala={0.7} />
      <Computador pos={[-5.6, 0.12, 1.1]} escala={0.7} />
      <Computador pos={[5.6, 0.12, -0.9]} escala={0.7} rot={[0, -0.3, 0]} />
      <Computador pos={[5.6, 0.12, 1.1]} escala={0.7} rot={[0, -0.3, 0]} />
      <Roteador pos={RC} escala={0.9} />
      <Roteador pos={RS} escala={0.9} />
      <Ligacao pontos={[[-5.0, 0.16, -0.9], [RC[0] - 0.5, 0.16, 0]]} cor="#2f5fa0" raio={0.05} viagens={[{ cor: '#ef6f6c', tipo: 'mensagem' }]} />
      <Ligacao pontos={[[-5.0, 0.16, 1.1], [RC[0] - 0.5, 0.16, 0]]} cor="#2f5fa0" raio={0.05} />
      <Ligacao pontos={[[RS[0] + 0.5, 0.16, 0], [5.0, 0.16, -0.9]]} cor="#2f5fa0" raio={0.05} viagens={[{ cor: '#ef6f6c', tipo: 'mensagem', atraso: 6 }]} />
      <Ligacao pontos={[[RS[0] + 0.5, 0.16, 0], [5.0, 0.16, 1.1]]} cor="#2f5fa0" raio={0.05} />
      {/* Internet e túnel */}
      <Esfera raio={1.0} pos={[-1.3, 1.1, -1.4]} cor="#eef3f8" sombra={false} />
      <Esfera raio={1.45} pos={[0.1, 1.3, -1.5]} cor="#f6f9fc" sombra={false} />
      <Esfera raio={1.0} pos={[1.5, 1.1, -1.4]} cor="#eef3f8" sombra={false} />
      <Caixa tam={[4.8, 0.7, 0.7]} pos={[0, 0.4, 0]} cor="#39a35a" opacidade={0.45} sombra={false} />
      <Ligacao
        pontos={[[-2.4, 0.4, 0], [2.4, 0.4, 0]]}
        cor="#1f6b3a"
        raio={0.06}
        viagens={[{ cor: CINZA_CIFRADO, tipo: 'mensagem', atraso: 2.5 }]}
      />
      <Rotulo pos={[0, 1.15, 0.5]} escuro>
        Túnel SSH
      </Rotulo>
      <Rotulo pos={[0.1, 2.9, -1.5]} escuro>
        Internet
      </Rotulo>
      <Rotulo pos={[RC[0], 1.7, 0]} classe="mini">
        Roteador
        <br />
        <b>Cliente SSH</b>
      </Rotulo>
      <Rotulo pos={[RS[0], 1.7, 0]} classe="mini">
        Roteador
        <br />
        <b>Servidor SSH</b>
      </Rotulo>
      <Rotulo pos={[-5.3, 1.8, 0]} classe="mini">
        rede da esquerda
      </Rotulo>
      <Rotulo pos={[5.3, 1.8, 0]} classe="mini">
        rede da direita
      </Rotulo>
      <Rotulo pos={[0, 3.8, 0]} classe="cartao">
        <b>VPN</b>tráfego seguro numa rede pública não segura: fora do túnel só se veem dados cifrados
      </Rotulo>
      <Seta de={[-1.6, 2.2, 0.6]} para={[1.6, 2.2, 0.6]} cor="#1f6b3a" raio={0.03} duasPontas />
    </group>
  )
}

export function CenaRemoto(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'terminal'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'terminal' && <TerminalRemoto />}
      {modo === 'portas' && <Portas semNumeros={!!cena.estado.semNumeros} />}
      {modo === 'telnet' && <Telnet />}
      {modo === 'ssh' && <Ssh />}
      {modo === 'multiplexacao' && <Multiplexacao />}
      {modo === 'vpn' && <Vpn />}
    </>
  )
}
