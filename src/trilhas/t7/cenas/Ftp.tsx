import { Ilha, Rotulo, type V3 } from '../../../three/base'
import { Ligacao } from '../../../three/Ligacao'
import { Computador, Servidor } from '../../../three/modelos'
import type { CenaProps } from '../../../engine/tipos'

// Fase 7.10 — FTP (Aula 06 p. 23–25): a conexão de transferência, os dois canais (controle
// TCP/21 e dados TCP/20) e o comando de uma máquina com os dados em outra.

const COR_CONTROLE = '#c0562b'
const COR_DADOS = '#2f7fd0'

function Conexao() {
  return (
    <group>
      <Computador pos={[-4.6, 0.12, 0]} escala={0.9} />
      <Servidor pos={[4.6, 0.12, 0]} escala={0.9} />
      <Rotulo pos={[-4.6, 1.9, 0]} escuro>
        Cliente FTP
      </Rotulo>
      <Rotulo pos={[4.6, 2.6, 0]} escuro>
        Servidor FTP
      </Rotulo>
      <Ligacao
        pontos={[[-3.7, 0.16, 0], [3.7, 0.16, 0]]}
        cor={COR_DADOS}
        raio={0.1}
        viagens={[
          { cor: '#ef6f6c', tipo: 'documento' },
          { cor: '#3aa0e6', tipo: 'imagem', inverso: true, atraso: 3.5 },
        ]}
      />
      <Rotulo pos={[0, 1.2, 0]} classe="cartao">
        <b>FTP</b>Conexão usada para transferir os arquivos
      </Rotulo>
    </group>
  )
}

/** Texto de um canal, respeitando semNomes (esconde nome e descrição) e semNumeros (esconde a porta). */
function Canal({ pos, porta, nome, desc, semNomes, semNumeros }: { pos: V3; porta: string; nome: string; desc: string; semNomes: boolean; semNumeros: boolean }) {
  if (semNomes && semNumeros) return null
  return (
    <Rotulo pos={pos} classe="cartao">
      {!semNumeros && <b>TCP/{porta}</b>}
      {!semNomes && (
        <>
          <b>{nome}</b>
          {desc}
        </>
      )}
    </Rotulo>
  )
}

function Canais({ semNomes, semNumeros }: { semNomes: boolean; semNumeros: boolean }) {
  return (
    <group>
      <Computador pos={[-4.8, 0.12, 0]} escala={0.9} />
      <Servidor pos={[4.8, 0.12, 0]} escala={0.9} />
      <Rotulo pos={[-4.8, 1.9, 0]} escuro>
        Cliente FTP
      </Rotulo>
      <Rotulo pos={[4.8, 2.6, 0]} escuro>
        Servidor FTP
      </Rotulo>
      <Ligacao
        pontos={[[-3.9, 0.16, -1.3], [3.9, 0.16, -1.3]]}
        cor={COR_CONTROLE}
        raio={0.07}
        viagens={[
          { cor: '#ef6f6c', tipo: 'mensagem' },
          { cor: '#3aa0e6', tipo: 'mensagem', inverso: true, atraso: 3.5 },
        ]}
      />
      <Ligacao
        pontos={[[-3.9, 0.16, 1.3], [3.9, 0.16, 1.3]]}
        cor={COR_DADOS}
        raio={0.13}
        viagens={[
          { cor: '#ef6f6c', tipo: 'documento' },
          { cor: '#3aa0e6', tipo: 'imagem', inverso: true, atraso: 3.5 },
          { cor: '#9b7be0', tipo: 'musica', atraso: 7 },
        ]}
      />
      <Canal pos={[0, 1.7, -1.3]} porta="21" nome="FTP-CONTROL" desc="comandos para controle interativo da transferência" semNomes={semNomes} semNumeros={semNumeros} />
      <Canal pos={[0, 1.4, 1.3]} porta="20" nome="FTP-DATA" desc="transferência dos arquivos" semNomes={semNomes} semNumeros={semNumeros} />
    </group>
  )
}

const CLI: V3 = [0, 0.12, 2.6]
const SA: V3 = [-4.8, 0.12, -1.6]
const SB: V3 = [4.8, 0.12, -1.6]

function Tres() {
  return (
    <group>
      <Computador pos={CLI} escala={0.9} />
      <Servidor pos={SA} escala={0.9} />
      <Servidor pos={SB} escala={0.9} />
      <Rotulo pos={[0, 1.7, CLI[2]]} escuro>
        Cliente FTP
      </Rotulo>
      <Rotulo pos={[SA[0], 2.6, SA[2]]} escuro>
        Servidor FTP
      </Rotulo>
      <Rotulo pos={[SB[0], 2.6, SB[2]]} escuro>
        Servidor FTP
      </Rotulo>
      <Ligacao
        pontos={[[-0.9, 0.16, 2.3], [SA[0] + 0.7, 0.16, SA[2] + 0.4]]}
        cor={COR_CONTROLE}
        raio={0.06}
        viagens={[{ cor: '#ef6f6c', tipo: 'mensagem' }, { cor: '#3aa0e6', tipo: 'mensagem', inverso: true, atraso: 3.5 }]}
      />
      <Ligacao
        pontos={[[0.9, 0.16, 2.3], [SB[0] - 0.7, 0.16, SB[2] + 0.4]]}
        cor={COR_CONTROLE}
        raio={0.06}
        viagens={[{ cor: '#ef6f6c', tipo: 'mensagem', atraso: 1.7 }, { cor: '#3aa0e6', tipo: 'mensagem', inverso: true, atraso: 5.2 }]}
      />
      <Ligacao
        pontos={[[SA[0] + 0.8, 0.16, SA[2] - 0.3], [SB[0] - 0.8, 0.16, SB[2] - 0.3]]}
        cor={COR_DADOS}
        raio={0.13}
        viagens={[{ cor: '#ef6f6c', tipo: 'documento' }, { cor: '#9b7be0', tipo: 'musica', atraso: 3.6 }]}
      />
      <Rotulo pos={[-2.7, 1.2, 0.9]} classe="mini">
        <b>FTP-CONTROL</b> (comandos)
      </Rotulo>
      <Rotulo pos={[2.7, 1.2, 0.9]} classe="mini">
        <b>FTP-CONTROL</b> (comandos)
      </Rotulo>
      <Rotulo pos={[0, 1.2, -1.9]} classe="cartao">
        <b>FTP-DATA</b>os arquivos vão direto de um servidor para o outro
      </Rotulo>
    </group>
  )
}

export function CenaFtp(cena: CenaProps) {
  const modo = (cena.estado.modo as string | undefined) ?? 'conexao'
  return (
    <>
      <Ilha raio={8.6} />
      {modo === 'conexao' && <Conexao />}
      {modo === 'canais' && <Canais semNomes={!!cena.estado.semNomes} semNumeros={!!cena.estado.semNumeros} />}
      {modo === 'tres' && <Tres />}
    </>
  )
}
