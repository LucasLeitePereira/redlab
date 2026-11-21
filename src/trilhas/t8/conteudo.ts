import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaCabos } from './cenas/Cabos'
import { CenaCsma } from './cenas/Csma'
import { CenaEnlace } from './cenas/Enlace'
import { CenaEthernet } from './cenas/Ethernet'
import { CenaNormas } from './cenas/Normas'
import { CenaSemFio } from './cenas/SemFio'
import { CenaTokenRing } from './cenas/TokenRing'
import { CenaWpan } from './cenas/Wpan'

// Trilha 8 — Controle de Acesso ao Meio. PDFs: REDES-07_Acesso-Meio.pdf (14 páginas, 2 slides
// por página; slides em branco na 2ª metade das p. 4 e 7) e o anexo REDES-08_Anexo-Categoria-
// Cabos.pdf (1 página, tabela de categorias do par trançado).
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const a7 = (pagina: number | string): Fonte => ({ aula: 'Aula 07', pagina })
const anexo: Fonte = { aula: 'Aula 08 · Anexo', pagina: 1 }

// ---------- 8.1 ----------

const fase81: Fase = {
  id: '8-1',
  titulo: 'Camada de Enlace',
  resumo: 'Os protocolos da camada 2, os serviços que ela fornece e as subcamadas LLC e MAC.',
  Cena: CenaEnlace,
  camera: [0, 4.5, 11],
  alvoCamera: [0, 2, 0],
  passos: [
    {
      titulo: 'Camada 2 do Modelo OSI',
      texto: `
O **Enlace** é a camada 2 do modelo OSI, logo acima da Física.

> Exemplos de protocolos:
> - *Ethernet*, *FastEthernet*;
> - Wifi, *Bluetooth*;
> - *TokenRing*;
> - PPP, *Frame Relay*, ATM, etc.`,
      fonte: a7(2),
      cena: { modo: 'protocolos' },
    },
    {
      titulo: 'Serviços fornecidos',
      texto: `
> Serviços fornecidos:
> - Endereçamento físico (ex.: endereço MAC).
> - Delimitação e formato dos quadros.
> - Detecção de erros da transmissão.
> - Controle de fluxo de transmissão no enlace.
> - Controle de acesso aos meios físicos.

Clique em cada parte do quadro para ver qual serviço ela representa.`,
      fonte: a7(3),
      cena: { modo: 'servicos' },
      explorar: {
        instrucao: 'Clique nas 3 partes do quadro.',
        alvos: {
          mac: { titulo: 'Endereçamento físico', texto: 'O cabeçalho do quadro leva o **endereço MAC** de origem e de destino.' },
          delimita: { titulo: 'Delimitação e formato', texto: 'O quadro tem começo, meio e fim definidos: o receptor sabe onde cada quadro **começa e termina**.' },
          fcs: { titulo: 'Detecção de erros', texto: 'O **FCS** no fim do quadro permite **detectar** se algum bit chegou trocado.' },
        },
      },
    },
    {
      titulo: 'LLC e MAC',
      texto: `
> A camada 2 do Modelo RM-OSI é dividida em duas subcamadas, no IEEE 802:

> - **LLC** — Subcamada de Controle de Enlace Lógico (*Logic Link Control*): Conecta a subcamada MAC aos protocolos das camadas superiores.
> - **MAC** — Subcamada de Controle de Acesso ao Meio (*Media Access Control*): Faz o controle de acesso e acrescenta o endereço físico ao pacote.

A LLC fica em cima (perto da camada de Rede); a MAC fica embaixo (perto da Física).`,
      fonte: a7(3),
      cena: { modo: 'subcamadas' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'O que é serviço da camada de Enlace?',
      grupos: ['Serviço do Enlace', 'Não é do Enlace'],
      itens: [
        { texto: 'Endereçamento físico (MAC)', grupo: 0 },
        { texto: 'Delimitação e formato dos quadros', grupo: 0 },
        { texto: 'Controle de acesso aos meios físicos', grupo: 0 },
        { texto: 'Roteamento dos pacotes', grupo: 1 },
        { texto: 'Endereçamento lógico (IP)', grupo: 1 },
      ],
      explicacao: 'Enlace: endereçamento físico, delimitação e formato dos quadros, detecção de erros, controle de fluxo no enlace e controle de acesso aos meios físicos. Roteamento e IP são da camada de Rede.',
      fonte: a7(3),
      cena: { modo: 'servicos' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada função é da subcamada LLC ou da MAC?',
      grupos: ['LLC', 'MAC'],
      itens: [
        { texto: 'Conecta aos protocolos das camadas superiores', grupo: 0 },
        { texto: 'Logic Link Control', grupo: 0 },
        { texto: 'Faz o controle de acesso ao meio', grupo: 1 },
        { texto: 'Acrescenta o endereço físico ao pacote', grupo: 1 },
      ],
      explicacao: 'LLC (*Logic Link Control*): conecta a MAC aos protocolos das camadas superiores. MAC (*Media Access Control*): faz o controle de acesso e acrescenta o endereço físico.',
      fonte: a7(3),
      cena: { modo: 'subcamadas', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes é exemplo de protocolo da camada de Enlace?',
      opcoes: ['PPP', 'HTTP', 'TCP', 'IPv4'],
      correta: 0,
      explicacao: 'Exemplos do slide: Ethernet, FastEthernet, Wifi, Bluetooth, TokenRing, **PPP**, Frame Relay, ATM.',
      fonte: a7(2),
      cena: { modo: 'protocolos' },
    },
  ],
}

// ---------- 8.2 ----------

const fase82: Fase = {
  id: '8-2',
  titulo: 'Padrões IEEE e as normas 802',
  resumo: 'Alguns padrões do IEEE e como as normas 802 se encaixam no Enlace e na Física.',
  Cena: CenaNormas,
  camera: [0, 4.2, 11],
  alvoCamera: [0, 1.8, 0],
  passos: [
    {
      titulo: 'Alguns padrões IEEE',
      texto: `
**IEEE** = Instituto de Engenheiros Eletricistas e Eletrônicos.

> - **IEEE 802** ➡ Normas usadas para padronizar às redes locais e redes metropolitanas.
> - **IEEE 488** ➡ Padrão de comunicação usado para conectar instrumentos de teste. Também conhecido como GPIB (*General Purpose Interface Bus*).
> - **IEEE 829** ➡ Documentação de Teste de *Software*.
> - **IEEE 1284** ➡ Define comunicações bidirecionais paralelas entre computadores e outros dispositivos.`,
      fonte: a7(4),
      cena: { modo: 'padroes' },
    },
    {
      titulo: 'Normas IEEE 802',
      texto: `
> Conjunto de padrões desenvolvidos para definir métodos de acesso e controle para **redes locais** (LANs) e **metropolitanas** (MANs).
> - Correspondem à camada **Física** e **Enlace** (LLC e MAC) do RM-OSI.
> - Incluem os protocolos de baixo nível e os padrões da camada física.
> - As normas 802 são compatíveis e trabalham juntas.`,
      fonte: a7(9),
      cena: { modo: 'diagrama' },
    },
    {
      titulo: 'O diagrama RM-OSI × IEEE 802',
      texto: `
Do lado esquerdo, o **RM-OSI**: Enlace (dividido em LLC e MAC) e Física. Do lado direito, o **IEEE 802**:

- **802.1** na vertical, ao lado de todas;
- **802.2** em cima, na altura da LLC;
- embaixo, na altura da MAC + Física: **802.3** e **802.5** (Cabeado), **802.11**, **802.15** e **802.16** (Sem Fio).

Clique nas normas destacadas.`,
      fonte: a7(10),
      cena: { modo: 'diagrama' },
      explorar: {
        instrucao: 'Clique nas 2 normas destacadas.',
        alvos: {
          n1: { titulo: 'IEEE 802.1', texto: '> Descreve a relação entre os padrões IEEE 802, além dos mecanismos usados na gerência das redes LANs/MANs;' },
          n2: { titulo: 'IEEE 802.2', texto: '> descreve a subcamada LLC, demarcando como a conectividade básica de dados sobre cabo deverá ser feita. Usado com os padrões IEEE 802.3, 802.4 e 802.5;' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Sobre as normas IEEE 802, avalie as afirmativas:',
      dados: ['I. As normas 802 padronizam redes locais (LANs) e metropolitanas (MANs).', 'II. As normas 802 correspondem às camadas de Rede e Transporte do RM-OSI.', 'III. O IEEE 802.2 descreve a subcamada LLC.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 2,
      explicacao: '**II errada**: as normas 802 correspondem às camadas **Física e Enlace** (LLC e MAC).',
      fonte: a7('9–10'),
      cena: { modo: 'diagrama' },
    },
    {
      tipo: 'escolha',
      enunciado: 'A quais camadas do RM-OSI as normas IEEE 802 correspondem?',
      opcoes: ['Física e Enlace (LLC e MAC)', 'Rede e Transporte', 'Só a Física', 'Aplicação'],
      correta: 0,
      explicacao: '“Correspondem à camada **Física** e **Enlace** (LLC e MAC) do RM-OSI.”',
      fonte: a7(9),
      cena: { modo: 'diagrama' },
    },
    {
      tipo: 'classificar',
      enunciado: 'No diagrama do slide, cada norma é de rede cabeada ou sem fio?',
      grupos: ['Cabeado', 'Sem Fio'],
      itens: [
        { texto: '802.3', grupo: 0 },
        { texto: '802.5', grupo: 0 },
        { texto: '802.11', grupo: 1 },
        { texto: '802.15', grupo: 1 },
        { texto: '802.16', grupo: 1 },
      ],
      explicacao: 'Cabeado: 802.3 (Ethernet) e 802.5 (Token Ring). Sem Fio: 802.11 (Wi-Fi), 802.15 (WPAN) e 802.16 (WiMax).',
      fonte: a7(10),
      cena: { modo: 'diagrama', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual norma descreve a subcamada LLC?',
      opcoes: ['IEEE 802.2', 'IEEE 802.1', 'IEEE 802.3', 'IEEE 802.11'],
      correta: 0,
      explicacao: '**IEEE 802.2**: descreve a subcamada LLC. O 802.1 descreve a relação entre os padrões e a gerência.',
      fonte: a7(10),
      cena: { modo: 'diagrama' },
    },
  ],
}

// ---------- 8.3 ----------

const fase83: Fase = {
  id: '8-3',
  titulo: 'Acesso sem contenção: Token Ring',
  resumo: 'Acesso ordenado: só quem tem o token transmite, então não há colisão.',
  Cena: CenaTokenRing,
  camera: [0, 7, 9],
  alvoCamera: [0, 0.6, 0],
  passos: [
    {
      titulo: 'Acesso ordenado sem contenção',
      texto: `
> ❶ **Acesso Ordenado Sem Contenção**
> Nesse método os acessos ao meio físico são ordenados, evitando o problema da colisão.
> Exemplos: **Token Ring**, Token Bus, Polling e Slot.`,
      fonte: a7(5),
      cena: { modo: 'anel', parado: true },
    },
    {
      titulo: 'Token Ring',
      texto: `
> **Token Ring** → Rede em anel que usa a passagem de Token.
> - Nesse tipo de rede, uma permissão (*Token*) – mensagem – é passada de uma estação para outra.
> - Somente a estação que possui a permissão (o Token) poderá transmitir.

Na cena, o **Token** gira na “Direção do Token”. A “Estação que está transmitindo” é a que está com ele.`,
      fonte: a7(6),
      cena: { modo: 'anel' },
    },
    {
      titulo: 'Esperando a vez',
      texto: `
Repare: duas estações querem transmitir (balão “quero falar”). Mesmo assim, **cada uma espera o token chegar**. Por isso nunca há colisão: o acesso é ordenado.`,
      fonte: a7(6),
      cena: { modo: 'fila' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Onde foi parar o Token Ring',
          texto: 'O Token Ring (IBM, IEEE 802.5) quase não existe mais: a Ethernet ficou mais barata e mais rápida. Ele aparece no anexo de cabos como uso do CAT4 (20 Mbps). Isso não está no slide da Aula 07.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'No Token Ring, qual estação pode transmitir?',
      opcoes: ['Somente a que possui a permissão (o Token)', 'Qualquer uma, a qualquer momento', 'A que detectar o meio livre', 'A mais próxima do servidor'],
      correta: 0,
      explicacao: '“Somente a estação que possui a permissão (o Token) poderá transmitir.”',
      fonte: a7(6),
      cena: { modo: 'anel' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada exemplo é de acesso sem contenção ou com contenção?',
      grupos: ['Sem contenção (ordenado)', 'Com contenção'],
      itens: [
        { texto: 'Token Ring', grupo: 0 },
        { texto: 'Token Bus', grupo: 0 },
        { texto: 'Polling', grupo: 0 },
        { texto: 'Slot', grupo: 0 },
        { texto: 'Aloha', grupo: 1 },
        { texto: 'CSMA/CD', grupo: 1 },
        { texto: 'CSMA/CA', grupo: 1 },
      ],
      explicacao: 'Sem contenção: Token Ring, Token Bus, Polling e Slot. Com contenção: Aloha, CSMA/CD e CSMA/CA.',
      fonte: a7('5–6'),
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que o acesso ordenado não tem colisão?',
      opcoes: [
        'Porque os acessos ao meio físico são ordenados',
        'Porque cada estação tem um cabo exclusivo',
        'Porque usa o sinal jam',
        'Porque transmite em velocidade menor',
      ],
      correta: 0,
      explicacao: '“Nesse método os acessos ao meio físico são **ordenados**, evitando o problema da colisão.”',
      fonte: a7(5),
      cena: { modo: 'fila' },
    },
  ],
}

// ---------- 8.4 ----------

const fase84: Fase = {
  id: '8-4',
  titulo: 'Acesso com contenção: CSMA/CD',
  resumo: 'Quando todos disputam o meio: colisão, detecção, sinal jam e espera aleatória.',
  Cena: CenaCsma,
  camera: [0, 4.5, 10.5],
  alvoCamera: [0, 0.8, 0],
  passos: [
    {
      titulo: 'Acesso baseado em contenção',
      texto: `
> ❷ **Acesso Baseado em Contenção**
> Nesse método os acessos ao meio físico não são ordenados e nada impede que dois ou mais elementos transmitam ao mesmo tempo, causando uma colisão.
> - Toda vez que ocorrer uma colisão, haverá perda de performance.
> - A estratégia de controle de contenção depende do algoritmo detectar a colisão e fazer a retransmissão .
> Exemplos: Aloha, **CSMA/CD** e CSMA/CA.`,
      fonte: a7(6),
      cena: { modo: 'barramento' },
    },
    {
      titulo: 'CSMA: escuta antes de falar',
      texto: `
> **CSMA (Carrier Sense Multiple Access):** O algoritmo verifica se não há outras transmissões. Se o meio estiver ocupado, a estação irá esperar o meio ficar livre para transmitir.

Na figura: **A** começa (“Início da Transmissão”). O sinal ainda não chegou em **B**, então “B detecta meio livre e inicia transmissão”.`,
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 2 },
    },
    {
      titulo: 'CD: detecção de colisão e jam',
      texto: `
> **CD (Collision Detection):** O algoritmo “escuta” a rede enquanto os dados são transmitidos. Se uma colisão é detectada, a transmissão é interrompida e é emitido uma sinalização “jam”.

Na figura: “**B detecta colisão**” primeiro (está mais perto do encontro), depois “**A detecta colisão**”.`,
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 4 },
    },
    {
      titulo: 'Espera aleatória',
      texto: `
> Para evitar colisões sucessivas, um período aleatório de tempo é usado antes da estação voltar a tentar transmitir.

“Estações esperam tempo aleatório”: como cada uma sorteia um tempo diferente, uma volta antes e a outra encontra o meio ocupado e espera.

A cena agora repete a figura inteira em sequência.`,
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 0 },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'No CSMA, o que a estação faz se o meio estiver ocupado?',
      opcoes: ['Espera o meio ficar livre para transmitir', 'Transmite mesmo assim', 'Pede o token', 'Desliga a placa de rede'],
      correta: 0,
      explicacao: '“Se o meio estiver ocupado, a estação irá **esperar o meio ficar livre** para transmitir.”',
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 2 },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é emitido quando o CSMA/CD detecta uma colisão?',
      opcoes: ['Uma sinalização “jam”', 'Um token', 'Um ACK', 'Um broadcast DHCP'],
      correta: 0,
      explicacao: '“Se uma colisão é detectada, a transmissão é interrompida e é emitido uma sinalização **jam**.”',
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 4 },
    },
    {
      tipo: 'classificar',
      enunciado: 'Coloque as etapas da figura do CSMA/CD na ordem.',
      grupos: ['1ª', '2ª', '3ª', '4ª', '5ª'],
      itens: [
        { texto: 'Início da Transmissão (A)', grupo: 0 },
        { texto: 'B detecta meio livre e inicia transmissão', grupo: 1 },
        { texto: 'B detecta colisão', grupo: 2 },
        { texto: 'A detecta colisão', grupo: 3 },
        { texto: 'Estações esperam tempo aleatório', grupo: 4 },
      ],
      explicacao: 'A começa → B ainda vê o meio livre e começa → B detecta a colisão → A detecta a colisão → as duas esperam um tempo aleatório.',
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 0, semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que a espera depois da colisão é aleatória?',
      opcoes: [
        'Para evitar colisões sucessivas',
        'Para economizar energia',
        'Porque o token se perdeu',
        'Para dar prioridade ao servidor',
      ],
      correta: 0,
      explicacao: '“Para evitar colisões sucessivas, um período aleatório de tempo é usado antes da estação voltar a tentar transmitir.” Se esperassem o mesmo tempo, colidiriam de novo.',
      fonte: a7(7),
      cena: { modo: 'csma', etapa: 5 },
    },
  ],
}

// ---------- 8.5 ----------

const fase85: Fase = {
  id: '8-5',
  titulo: 'Ethernet DIX e IEEE 802.3',
  resumo: 'A Ethernet original da DEC, Intel e Xerox e a evolução do padrão 802.3.',
  Cena: CenaEthernet,
  camera: [0, 4.5, 11.5],
  alvoCamera: [0, 1.6, 0],
  passos: [
    {
      titulo: 'Ethernet DIX',
      texto: `
> Padrão para redes locais desenvolvido pela DEC, Intel e Xerox (DIX)
> - Taxa de transmissão: **10 Mbps**
> - Topologia: barramento ou estrela
> - Meio físico: cabo coaxial ou par-trançado
> - Modos de operação: *Half-duplex* e *Full-duplex*
> - Controle de acesso: **CSMA/CD**

A cena reproduz o desenho original do slide: **THE ETHER** (o cabo), o **TAP**, o **TRANSCEIVER**, o **INTERFACE CABLE**, o **INTERFACE CONTROLLER**, a **STATION** e o **TERMINATOR** na ponta.`,
      fonte: a7(8),
      cena: { modo: 'dix' },
    },
    {
      titulo: 'IEEE 802.3: evolução do padrão',
      texto: `
> **IEEE 802.3** ➡ Define os protocolos para redes com fio, especificando a camada de enlace de dados para controle de acesso ao meio (MAC).

> Evolução do Padrão:
> - **802.3a** — 10 Mbps — Padrão Ethernet
> - **802.3u** — 100 Mbps — Fast Ethernet
> - **802.3z** — 1 Gbps — Gigabit Ethernet
> - **802.3ae** — 10 Gbps — Dez-Gigabit Ethernet`,
      fonte: a7(11),
      cena: { modo: 'evolucao' },
    },
    {
      titulo: 'A tabela de anos',
      texto: `
- **802.3a** 1985 — 10Base-2 (Ethernet Fina)
- **802.3i** 1990 — 10Base-T (Par Trançado)
- **802.3j** 1993 — 10Base-F (Fibra Óptica)
- **802.3u** 1995 — 100Base-T (Fast Ethernet)
- **802.3z** 1998 — 1000Base-X (Gigabit Ethernet)
- **802.3ab** 1999 — 1000Base-T (Gigabit Ethernet sobre Par Trançado)
- **802.3ae** 2002 — Ethernet de 10 Gigabits
- **802.3at** 2005 — Power over Ethernet Plus
- **802.3db** 2022 — Operação de 100 Gbit/s, 200 Gbit/s e 400 Gbit/s sobre fibra
- **802.3dj** à definir — Operação de 1,6 Tbit/s

Lendo o nome: o número é a taxa em Mbps, **Base** = banda base, e o fim diz o meio (**T** = par trançado, **F**/**X** = fibra, **2** = coaxial fino).`,
      fonte: a7(11),
      cena: { modo: 'tabela' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O ano do 802.3at',
          noSlide: 'A tabela põe o **802.3at** (*Power over Ethernet Plus*) em **2005**.',
          naPratica: 'O 802.3at foi publicado em **2009**. O PoE original, **802.3af**, é de **2003**. Na prova, se perguntarem pela tabela, use o ano do slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Sobre a Ethernet DIX, avalie as afirmativas:',
      dados: ['I. O controle de acesso é o CSMA/CD.', 'II. Funciona em barramento ou estrela, com coaxial ou par trançado.', 'III. Usa passagem de permissão (token), como o 802.5.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: quem usa token é o 802.5 (Token Ring). A DIX usa **CSMA/CD**.',
      fonte: a7(8),
      cena: { modo: 'dix' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre o padrão IEEE 802.3, qual afirmativa está correta?',
      opcoes: ['Suporta half-duplex e full-duplex em redes cabeadas', 'É um padrão de rede sem fio', 'Usa passagem de token para acessar o meio', 'Descreve a subcamada LLC'],
      correta: 0,
      explicacao: 'O 802.3 (Ethernet) é **cabeado** e funciona em **half e full-duplex**. Token é o 802.5; LLC é o 802.2.',
      fonte: a7(8),
    },
    {
      tipo: 'classificar',
      enunciado: 'Sobre a evolução do 802.3, cada afirmativa é verdadeira ou falsa?',
      grupos: ['Verdadeira', 'Falsa'],
      itens: [
        { texto: 'A taxa evoluiu de 10 Mbps para 100 Mbps, 1 Gbps e 10 Gbps', grupo: 0 },
        { texto: 'Fast Ethernet é a Ethernet de 100 Mbps', grupo: 0 },
        { texto: 'Gigabit Ethernet é um padrão sem fio', grupo: 1 },
        { texto: 'As novas versões deixaram de ser compatíveis com o 802', grupo: 1 },
      ],
      explicacao: 'O 802.3 é cabeado e foi ficando mais rápido: Padrão (10 Mbps), Fast (100 Mbps), Gigabit (1 Gbps), Dez-Gigabit (10 Gbps). As normas 802 são compatíveis e trabalham juntas.',
      fonte: a7('9, 11'),
      cena: { modo: 'evolucao' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre a nomenclatura da Ethernet, avalie as afirmativas:',
      dados: ['I. O 1000Base-T é Gigabit Ethernet sobre par trançado.', 'II. O 1000Base-X é Gigabit Ethernet sobre fibra.', 'III. A Fast Ethernet é mais rápida que a Gigabit Ethernet.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: Fast Ethernet = 100 Mbps; Gigabit = 1 Gbps. O "T" indica par trançado (*twisted pair*).',
      fonte: a7(11),
      cena: { modo: 'tabela' },
    },
  ],
}

// ---------- 8.6 ----------

const fase86: Fase = {
  id: '8-6',
  titulo: 'IEEE 802.5, 802.11 e as gerações Wi-Fi',
  resumo: 'O anel do Token Ring, a rede sem fio com ponto de acesso e a tabela Wi-Fi 0 a 7.',
  Cena: CenaSemFio,
  camera: [0, 5, 11],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'IEEE 802.5',
      texto: `
> **IEEE 802.5** ➡ descreve o funcionamento de uma rede em anel usando passagem de permissão como método de acesso (Token Ring).

É a norma do Token Ring da fase 8.3. No diagrama 802 ela fica entre as **cabeadas**.`,
      fonte: a7(12),
      cena: { modo: 'anel' },
    },
    {
      titulo: 'IEEE 802.11',
      texto: `
> **IEEE 802.11** ➡ Rede Local sem fio (WLAN, Wireless LAN) também chamado de Wi-Fi; Define os padrões para funcionamento de redes sem fios por meio de radiofrequência.

> **Ponto de Acesso:** Envia pacotes entre a rede cabeada e os hospedeiros sem fio.

Na cena, o ponto de acesso está ligado ao cabo (rede cabeada) e conversa pelo ar com os notebooks.`,
      fonte: a7(12),
      cena: { modo: 'wifi' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'E o acesso ao meio no Wi-Fi?',
          texto: 'No ar todos compartilham o mesmo meio, então o 802.11 usa o **CSMA/CA** (evitar colisão), um dos exemplos de acesso com contenção do slide. Os detalhes do CSMA/CA não estão no slide.',
        },
      ],
    },
    {
      titulo: 'Gerações Wi-Fi',
      texto: `
- (1997) **802.11** — Wi-Fi 0 — 2,4 GHz — 2 Mbps
- (1999) **802.11b** — Wi-Fi 1 — 2,4 GHz — 11 Mbps
- (1999) **802.11a** — Wi-Fi 2 — 5,0 GHz — 54 Mbps
- (2003) **802.11g** — Wi-Fi 3 — 2,4 GHz — 54 Mbps
- (2005) 802.11e — Melhorias para suporte a QoS · (2004) 802.11i — Melhoria de Segurança
- (2008) **802.11n** — Wi-Fi 4 — 2,4/5,0 GHz — 72 a 600 Mbps
- (2014) **802.11ac** — Wi-Fi 5 — 5,0 GHz — 433Mbps a 6,9Gbps
- (2019) **802.11ax** — Wi-Fi 6 — 2,4/5,0 GHz — 574Mbps a 9,6Gbps
- (2024) **802.11be** — Wi-Fi 7 — 2,4/5/6,0 GHz — 1,3Gbps a 46Gbps`,
      fonte: a7(13),
      cena: { modo: 'tabela' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Wi-Fi 0 a Wi-Fi 3',
          noSlide: 'Todas as linhas têm um nome de geração, do **Wi-Fi 0** ao **Wi-Fi 7**.',
          naPratica: 'A Wi-Fi Alliance só criou os nomes oficiais a partir do **Wi-Fi 4** (802.11n). Wi-Fi 0 a 3 são uma numeração retroativa, não oficial. Na prova, use a tabela do slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'O que faz o ponto de acesso?',
      opcoes: [
        'Envia pacotes entre a rede cabeada e os hospedeiros sem fio',
        'Distribui o token no anel',
        'Converte fibra em par trançado',
        'Detecta colisões no cabo coaxial',
      ],
      correta: 0,
      explicacao: '**Ponto de Acesso**: envia pacotes entre a rede cabeada e os hospedeiros sem fio.',
      fonte: a7(12),
      cena: { modo: 'wifi' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada padrão à geração Wi-Fi (tabela do slide).',
      grupos: ['Wi-Fi 1', 'Wi-Fi 2', 'Wi-Fi 3', 'Wi-Fi 4', 'Wi-Fi 5'],
      itens: [
        { texto: '802.11b', grupo: 0 },
        { texto: '802.11a', grupo: 1 },
        { texto: '802.11g', grupo: 2 },
        { texto: '802.11n', grupo: 3 },
        { texto: '802.11ac', grupo: 4 },
      ],
      explicacao: '11b Wi-Fi 1 · 11a Wi-Fi 2 · 11g Wi-Fi 3 · 11n Wi-Fi 4 · 11ac Wi-Fi 5.',
      fonte: a7(13),
      cena: { modo: 'tabela', semNomes: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Em qual frequência cada padrão trabalha?',
      grupos: ['2,4 GHz', '5,0 GHz', '2,4 e 5,0 GHz'],
      itens: [
        { texto: '802.11b', grupo: 0 },
        { texto: '802.11g', grupo: 0 },
        { texto: '802.11a', grupo: 1 },
        { texto: '802.11ac', grupo: 1 },
        { texto: '802.11n', grupo: 2 },
      ],
      explicacao: '2,4 GHz: 11b e 11g · 5,0 GHz: 11a e 11ac · 2,4/5,0 GHz: 11n (e 11ax).',
      fonte: a7(13),
      cena: { modo: 'tabela', semFrequencia: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre as frequências dos padrões 802.11, avalie as afirmativas:',
      dados: ['I. O 802.11b e o 802.11g operam apenas em 2,4 GHz.', 'II. O 802.11a opera em 2,4 GHz e em 5 GHz.', 'III. O 802.11ac opera apenas em 5 GHz.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 2,
      explicacao: '**II errada**: o 802.11a usa **só 5 GHz**. O primeiro a usar as duas bandas foi o **802.11n**.',
      fonte: a7(13),
      cena: { modo: 'tabela', semFrequencia: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual norma descreve uma rede em anel com passagem de permissão?',
      opcoes: ['IEEE 802.5', 'IEEE 802.3', 'IEEE 802.11', 'IEEE 802.16'],
      correta: 0,
      explicacao: '**IEEE 802.5**: rede em anel usando passagem de permissão como método de acesso (Token Ring).',
      fonte: a7(12),
      cena: { modo: 'anel' },
    },
  ],
}

// ---------- 8.7 ----------

const fase87: Fase = {
  id: '8-7',
  titulo: 'IEEE 802.15 e 802.16',
  resumo: 'A rede pessoal sem fio (Bluetooth e companhia) e o acesso de banda larga sem fio (WiMax).',
  Cena: CenaWpan,
  camera: [0, 5.5, 11],
  alvoCamera: [0, 1, 0],
  passos: [
    {
      titulo: 'IEEE 802.15: WPAN',
      texto: `
> **IEEE 802.15** ➡ Rede Pessoal sem fio (WPAN, Wireless Personal Area Network); Equivale ao Bluetooth.

Na figura, pequenas redes de curto alcance (as linhas tracejadas) ligam **Headset**, **Mobile phone**, **Laptop**, **Mouse** e **Printer**.`,
      fonte: a7(13),
      cena: { modo: 'wpan' },
    },
    {
      titulo: 'As sub-normas do 802.15',
      texto: `
> - **802.15.1** — WPAN (Bluetooth)
> - **802.15.3** — Highrate WPAN (UWB, Wireless USB)
> - **802.15.4** — Lowrate WPAN (ZigBee)
> - **802.15.6** — BAN (Body Area Network)`,
      fonte: a7(14),
      cena: { modo: 'tabela' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Onde se vê cada uma',
          texto: '**ZigBee** (baixa taxa, pouca energia) aparece em lâmpadas e sensores de casa inteligente. **BAN** é a rede de sensores no corpo (relógio, sensores médicos). Isso não está no slide.',
        },
      ],
    },
    {
      titulo: 'IEEE 802.16: WiMax',
      texto: `
> **IEEE 802.16** ➡ Rede de acesso de banda larga sem fio (BBWA, Broadband Wireless Access); WiMax.

Na figura, uma **torre** leva o acesso sem fio a várias **casas**, cada uma com o seu computador.`,
      fonte: a7(14),
      cena: { modo: 'wimax' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'A que tecnologia o IEEE 802.15 equivale?',
      opcoes: ['Bluetooth', 'Wi-Fi', 'WiMax', 'Ethernet'],
      correta: 0,
      explicacao: '**IEEE 802.15**: Rede Pessoal sem fio (WPAN); Equivale ao **Bluetooth**.',
      fonte: a7(13),
      cena: { modo: 'wpan' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada sub-norma do 802.15 à característica.',
      grupos: ['802.15.1', '802.15.3', '802.15.4', '802.15.6'],
      itens: [
        { texto: 'WPAN (Bluetooth)', grupo: 0 },
        { texto: 'Highrate WPAN (UWB, Wireless USB)', grupo: 1 },
        { texto: 'Lowrate WPAN (ZigBee)', grupo: 2 },
        { texto: 'BAN (Body Area Network)', grupo: 3 },
      ],
      explicacao: '15.1 Bluetooth · 15.3 Highrate WPAN · 15.4 Lowrate WPAN (ZigBee) · 15.6 BAN.',
      fonte: a7(14),
      cena: { modo: 'tabela', semNomes: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada norma ao tipo de rede.',
      grupos: ['802.11', '802.15', '802.16'],
      itens: [
        { texto: 'WLAN (Wi-Fi)', grupo: 0 },
        { texto: 'WPAN (rede pessoal)', grupo: 1 },
        { texto: 'BBWA (WiMax)', grupo: 2 },
      ],
      explicacao: '802.11: Rede Local sem fio (WLAN). 802.15: Rede Pessoal sem fio (WPAN). 802.16: banda larga sem fio (BBWA, WiMax).',
      fonte: a7('12–14'),
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre os padrões IEEE 802 sem fio, avalie as afirmativas:',
      dados: ['I. O 802.15 é usado em redes pessoais sem fio (WPAN), como o Bluetooth.', 'II. O 802.16 é usado em redes sem fio de longa distância, em áreas metropolitanas.', 'III. O 802.11 é usado em redes metropolitanas de longa distância.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: o 802.11 (Wi-Fi) é rede **local** sem fio (WLAN). Metropolitana é o 802.16 (WiMAX).',
      fonte: a7('12–14'),
      cena: { modo: 'wimax' },
    },
  ],
}

// ---------- 8.8 ----------

const fase88: Fase = {
  id: '8-8',
  titulo: 'Par trançado: categorias',
  resumo: 'A tabela CAT1 a CAT8 do anexo: banda, taxa de transferência e uso comum.',
  Cena: CenaCabos,
  camera: [0, 4.5, 11.5],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'Par-Trançado: Categorias',
      texto: `
O anexo traz a tabela das categorias do cabo par trançado. Quanto maior a categoria, maior a **banda** (frequência que o cabo suporta) e maior a **taxa**.

Na cena, cada cabo é uma categoria. Clique nos cabos destacados.`,
      fonte: anexo,
      cena: { modo: 'cabos' },
      explorar: {
        instrucao: 'Clique nos 4 cabos destacados.',
        alvos: {
          cat3: { titulo: 'CAT3', texto: '10 MHz · **10 Mbps (Ethernet)** · Obsoleto.' },
          cat5e: { titulo: 'CAT5e', texto: '100 MHz · **100 Mbps (568A) / 1 Gbps (568B)** · Redes corporativas.' },
          cat6: { titulo: 'CAT6', texto: '250 MHz · **1 Gbps (Gigabit Ethernet)** · UTP ou STP.' },
          cat7: { titulo: 'CAT7', texto: '600 MHz · **10 Gbps (10 Gigas)** · Blindagem dupla, Conector GG45.' },
        },
      },
    },
    {
      titulo: 'A tabela completa',
      texto: `
- **CAT1** — -- — -- — Cabo telefônico tradicional (voz)
- **CAT2** — 4 MHz — -- — Transmissão de dados
- **CAT3** — 10 MHz — 10 Mbps (Ethernet) — Obsoleto
- **CAT4** — 16 MHz — 20 Mbps (Token Ring) — Obsoleto
- **CAT5** — 100 MHz — 100 Mbps (Fast Ethernet) — Obsoleto
- **CAT5e** — 100 MHz — 100 Mbps (568A) / 1 Gbps (568B) — Redes corporativas
- **CAT6** — 250 MHz — 1 Gbps (Gigabit Ethernet) — UTP ou STP
- **CAT7** — 600 MHz — 10 Gbps (10 Gigas) — Blindagem dupla -- Conector GG45
- **CAT8** — 2 GHz — 20-40 Gbps (30 m) — Altíssimo desempenho

O CAT5e e o CAT6 estão destacados em azul no anexo: são os mais usados hoje.`,
      fonte: anexo,
      cena: { modo: 'tabela' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: '568A e 568B no CAT5e',
          noSlide: 'O CAT5e aparece com **100 Mbps (568A)** e **1 Gbps (568B)**.',
          naPratica: 'T568A e T568B são só as duas **ordens de cores** dos fios no conector RJ-45. As duas dão a mesma velocidade: o CAT5e faz **1 Gbps** com qualquer uma. Na prova, se perguntarem pela tabela, responda como o anexo.',
        },
        {
          tipo: 'curiosidade',
          titulo: 'UTP e STP',
          texto: '**UTP** = par trançado sem blindagem; **STP** = com blindagem, que protege contra interferência. Isso não está no anexo.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Sobre as categorias de par trançado, avalie as afirmativas:',
      dados: ['I. Quanto maior a categoria, maior a banda (MHz) e a taxa de transferência.', 'II. O CAT1 é usado para dados em Gigabit Ethernet.', 'III. O CAT7 tem blindagem, o que reduz interferências.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 2,
      explicacao: '**II errada**: o CAT1 é o cabo telefônico tradicional (voz).',
      fonte: anexo,
      cena: { modo: 'tabela' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual a diferença entre o cabo UTP e o STP?',
      opcoes: ['O STP tem blindagem, que protege contra interferências', 'O UTP transmite luz', 'O STP não tem pares trançados', 'O UTP só funciona em redes sem fio'],
      correta: 0,
      explicacao: 'UTP = sem blindagem; **STP = com blindagem** (*Shielded*), mais protegido contra interferências.',
      fonte: anexo,
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual categoria é o cabo telefônico tradicional (voz)?',
      opcoes: ['CAT1', 'CAT2', 'CAT3', 'CAT5'],
      correta: 0,
      explicacao: '**CAT1**: cabo telefônico tradicional (voz), sem banda nem taxa de dados na tabela.',
      fonte: anexo,
      cena: { modo: 'cabos' },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'classificar',
    enunciado: 'Ligue cada norma ao foco.',
    grupos: ['802.1', '802.2', '802.3', '802.11'],
    itens: [
      { texto: 'Relação entre os padrões e gerência LAN/MAN', grupo: 0 },
      { texto: 'Subcamada LLC', grupo: 1 },
      { texto: 'Redes com fio (Ethernet)', grupo: 2 },
      { texto: 'Rede local sem fio (Wi-Fi)', grupo: 3 },
    ],
    explicacao: '802.1: relação entre os padrões e gerência · 802.2: LLC · 802.3: redes com fio · 802.11: WLAN/Wi-Fi.',
    fonte: a7('10–12'),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual é o controle de acesso da Ethernet DIX?',
    opcoes: ['CSMA/CD', 'Token Ring', 'Polling', 'CSMA/CA'],
    correta: 0,
    explicacao: 'Ethernet DIX: “Controle de acesso: **CSMA/CD**”.',
    fonte: a7(8),
  },
  {
    tipo: 'escolha',
    enunciado: 'Um roteador Wi-Fi transmite apenas em 5 GHz. Qual padrão NÃO consegue se conectar a ele?',
    opcoes: ['802.11g', '802.11a', '802.11n', '802.11ac'],
    correta: 0,
    explicacao: 'O **802.11g** usa só 2,4 GHz. O 11a e o 11ac usam 5 GHz; o 11n usa 2,4 e 5 GHz.',
    fonte: a7(13),
  },
  {
    tipo: 'escolha',
    enunciado: 'No acesso baseado em contenção, o que acontece toda vez que ocorre uma colisão?',
    opcoes: ['Perda de performance', 'O token é recriado', 'A rede desliga', 'Nada: a colisão é ignorada'],
    correta: 0,
    explicacao: '“Toda vez que ocorrer uma colisão, haverá **perda de performance**.”',
    fonte: a7(6),
  },
  {
    tipo: 'escolha',
    enunciado: 'Sobre os padrões IEEE 802, avalie as afirmativas:',
    dados: ['1. O 802.3 usa CSMA/CD como controle de acesso.', '2. O 802.5 usa CSMA/CA como controle de acesso.', '3. O 802.11n opera em 2,4 GHz e em 5 GHz.', '4. O 802.16 é usado em redes pessoais sem fio.', '5. O 802.1 trata da gerência das redes LAN/MAN.'],
    opcoes: ['Apenas 1, 3 e 5 estão corretas.', 'Apenas 1, 2 e 4 estão corretas.', 'Apenas 2, 3 e 5 estão corretas.', 'Apenas 1, 2, 3 e 5 estão corretas.', 'Todas estão corretas.'],
    correta: 0,
    explicacao: '**2 errada**: o 802.5 é Token Ring (passagem de permissão). **4 errada**: o 802.16 é metropolitano (WiMAX); pessoal é o 802.15.',
    fonte: a7('6–14'),
  },
]

export const trilha8: Trilha = {
  id: 't8',
  numero: 8,
  titulo: 'Acesso ao Meio',
  aula: 'Aula 07 · Controle de Acesso ao Meio (+ Anexo de cabos)',
  cor: '#8a5a2b',
  disponivel: true,
  fases: [fase81, fase82, fase83, fase84, fase85, fase86, fase87, fase88],
  chefaoExtras: extras,
}
