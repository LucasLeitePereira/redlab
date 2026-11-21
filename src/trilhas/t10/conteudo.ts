import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaEquipamentos } from './cenas/Equipamentos'

// Trilha 10 — Equipamentos de Redes. PDF: REDES-09_Equipamentos.pdf (22 páginas, 2 slides por
// página; p. 2, 5, 8, 12, 14 e 19 começam com slide de abertura de seção).
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.

const a9 = (pagina: number | string): Fonte => ({ aula: 'Aula 09', pagina })

const CAMERA: [number, number, number] = [0, 6, 11.5]
const ALVO: [number, number, number] = [0, 1.2, 0.4]

// ---------- 10.1 ----------

const fase101: Fase = {
  id: '10-1',
  titulo: 'Placa de rede e drivers',
  resumo: 'O que a NIC faz e o papel do driver (NDIS, ODI e NDISWrapper).',
  Cena: CenaEquipamentos,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Equipamentos da aula',
      texto: `
A aula apresenta: **placa de rede**, **repetidor** e **hub**, **ponte** e **switch**, **roteador**.

E classifica os equipamentos quanto a:
- funcionalidade e propósito;
- camada do RM-OSI em que atuam;
- limitação quanto ao encadeamento;
- segmentação: domínio de colisão e *broadcast*.`,
      fonte: a9(1),
      cena: { modo: 'nic' },
    },
    {
      titulo: 'Placa de rede (NIC)',
      texto: `
> A placa de rede é responsável pela conexão da estação ao meio físico de transmissão.

NIC = *Network Interface Card*.`,
      fonte: a9(2),
      cena: { modo: 'nic' },
    },
    {
      titulo: 'Driver de rede',
      texto: `
> *Driver* é o *software* que permite ao sistema operacional fazer o controle do dispositivo. São fornecidos pelo fabricante do dispositivo e tratam de aspectos da operação.

> *Drivers* de rede permitem facilitar a comunicação entre dispositivos de rede e os protocolos de transporte por meio de um conjunto de funções complexas específicas do sistema operacional.

No diagrama do slide, os **drivers da placa** ficam entre o **TCP/IP** (aplicação, transporte, rede) e as camadas de **enlace** e **física**.`,
      fonte: a9('3–4'),
      cena: { modo: 'nic' },
    },
    {
      titulo: 'NDIS, ODI e NDISWrapper',
      texto: `
- **NDIS** (*Network Driver Interface Specification*): desenvolvido pela **3COM e Microsoft**, define um conjunto de comandos (API) que padronizam a interface oferecida para os dispositivos de rede no ambiente **Windows**.
- **ODI** (*Open Data Link Interface*): criada pela **Novell e Apple** para computadores com arquitetura **não-X86**.
- **NDISWrapper**: driver de **código aberto** que permite que placas compatíveis com NDIS funcionem com o **Linux**.`,
      fonte: a9('3–4'),
      cena: { modo: 'nic' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual a função da placa de rede?',
      opcoes: ['Conectar a estação ao meio físico de transmissão', 'Escolher a melhor rota entre redes', 'Repetir o sinal para todas as portas', 'Guardar a tabela MAC da rede'],
      correta: 0,
      explicacao: '“A placa de rede é responsável pela **conexão da estação ao meio físico** de transmissão.”',
      fonte: a9(2),
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada interface de driver a quem a criou ou onde ela funciona.',
      grupos: ['NDIS', 'ODI', 'NDISWrapper'],
      itens: [
        { texto: '3COM e Microsoft', grupo: 0 },
        { texto: 'Ambiente Windows', grupo: 0 },
        { texto: 'Novell e Apple', grupo: 1 },
        { texto: 'Arquitetura não-X86', grupo: 1 },
        { texto: 'Código aberto, Linux', grupo: 2 },
      ],
      explicacao: 'NDIS: 3COM e Microsoft, Windows. ODI: Novell e Apple, não-X86. NDISWrapper: código aberto, placas NDIS no Linux.',
      fonte: a9('3–4'),
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é um driver?',
      opcoes: ['O software que permite ao sistema operacional controlar o dispositivo', 'Um cabo de rede', 'Um protocolo de transporte', 'Um tipo de switch'],
      correta: 0,
      explicacao: '“*Driver* é o **software** que permite ao sistema operacional fazer o controle do dispositivo.”',
      fonte: a9(3),
    },
  ],
}

// ---------- 10.2 ----------

const fase102: Fase = {
  id: '10-2',
  titulo: 'Repetidor e hub',
  resumo: 'Os equipamentos da camada 1: repetem o sinal e aumentam o domínio de colisão.',
  Cena: CenaEquipamentos,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Repetidor',
      texto: `
> Função: Receber e repetir o sinal usado no meio de transmissão;

> Usado apenas em meios físicos idênticos;

> Reforça o sinal, estendendo a distância de conexão dos computadores.`,
      fonte: a9(5),
      cena: { modo: 'repetidor' },
    },
    {
      titulo: 'O que limita o uso',
      texto: `
> Considerações que limitam o uso:
- Provoca **atraso** na retransmissão.
- Os **ruídos** também são amplificados.
- **Aumenta** o domínio de colisão.

**Domínio de colisão**: “área lógica onde as informações que transitam pela rede podem colidir. Envolve os equipamentos conectados.” Na cena, a mancha laranja é o domínio.`,
      fonte: a9(6),
      cena: { modo: 'repetidor' },
    },
    {
      titulo: 'Encadeamento e camada',
      texto: `
**Limitação quanto ao encadeamento:** no máximo **quatro repetidores** entre dois computadores.

> Repetidor (*Repeater*) – Atua na **camada 1** do modelo.`,
      fonte: a9(7),
      cena: { modo: 'encadeamento' },
    },
    {
      titulo: 'Hub',
      texto: `
> Funcionam como **repetidores multiportas**;

> O sinal de entrada é repetido para **todas as portas** (difusão);

> Correspondem a implementação física de uma **topologia estrela**.

Os hubs usam cabo UTP com conector **RJ-45**.`,
      fonte: a9('8–9'),
      cena: { modo: 'hub' },
    },
    {
      titulo: 'Hub: domínio, encadeamento e camada',
      texto: `
> Hubs repassam para todos os nós da rede.

Por isso, todos os computadores ligados ao hub (e a hubs ligados entre si) ficam em **um único domínio de colisão**.

- Encadeamento: no máximo **quatro hubs**.
- Camada: “*HUB* – Atua na **camada 1** do modelo.”`,
      fonte: a9('9–11'),
      cena: { modo: 'hub' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual destas NÃO é uma consideração que limita o uso do repetidor?',
      opcoes: ['Filtra os ruídos do sinal', 'Provoca atraso na retransmissão', 'Os ruídos também são amplificados', 'Aumenta o domínio de colisão'],
      correta: 0,
      explicacao: 'O repetidor **não filtra** ruído: “os ruídos **também são amplificados**”.',
      fonte: a9(6),
      cena: { modo: 'repetidor', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O hub recebe um sinal em uma porta. Para onde ele repete?',
      opcoes: ['Para todas as portas (difusão)', 'Só para a porta do destino', 'Só para o roteador', 'Para nenhuma: ele descarta'],
      correta: 0,
      explicacao: '“O sinal de entrada é repetido para **todas as portas** (difusão).”',
      fonte: a9(8),
      cena: { modo: 'hub', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Em que camada do RM-OSI atuam o repetidor e o hub?',
      opcoes: ['Camada 1 (física)', 'Camada 2 (enlace)', 'Camada 3 (rede)', 'Camada 4 (transporte)'],
      correta: 0,
      explicacao: 'Repetidor e hub atuam na **camada 1**.',
      fonte: a9('7, 11'),
      cena: { modo: 'hub', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual o número máximo de repetidores (ou hubs) encadeados entre dois computadores?',
      campos: [{ rotulo: 'Máximo', resposta: '4', formato: 'numero' }],
      explicacao: 'O slide mostra a limitação: **quatro** repetidores (e quatro hubs).',
      fonte: a9('7, 10'),
      cena: { modo: 'encadeamento', semNomes: true },
    },
  ],
}

// ---------- 10.3 ----------

const fase103: Fase = {
  id: '10-3',
  titulo: 'Ponte e switch',
  resumo: 'Os equipamentos da camada 2: separam domínios de colisão usando endereços MAC.',
  Cena: CenaEquipamentos,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Ponte (bridge)',
      texto: `
> Transmitem os QUADROS destinados aos computadores de acordo com a interligação, caso necessário.

> Diminuem o fluxo de dados pela rede.

A ponte guarda uma tabela: **A e B** à esquerda (segmento 1), **C e D** à direita (segmento 2). Um quadro de A para B não precisa atravessar.`,
      fonte: a9(12),
      cena: { modo: 'ponte' },
    },
    {
      titulo: 'Ponte: domínio e camada',
      texto: `
A ponte separa a rede em **dois domínios de colisão**: um de cada lado.

> PONTE – Atua na **camada 2** do modelo.`,
      fonte: a9(13),
      cena: { modo: 'ponte' },
    },
    {
      titulo: 'Switch',
      texto: `
> Funcionam como ***bridges* multiportas**;

> O sinal de entrada é retransmitido **apenas a porta onde esteja o equipamento de destino**;

> Permite a troca de mensagem entre várias estações simultaneamente.

Na cena, o PC da porta 1 fala com o da porta 4: as outras portas ficam quietas.`,
      fonte: a9('14–15'),
      cena: { modo: 'switch' },
    },
    {
      titulo: 'Tabela de endereçamento MAC',
      texto: `
O switch sabe onde está cada equipamento pela **tabela MAC**: cada porta associada ao endereço MAC de quem está nela (ex.: porta 1 → 00:83:bb:e9:54:72).

> *SWITCH* – Atua na **camada 2** do modelo.`,
      fonte: a9('16–17'),
      cena: { modo: 'switch' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'O switch funciona como…',
      opcoes: ['Bridges (pontes) multiportas', 'Repetidores multiportas', 'Roteadores multiportas', 'Modems multiportas'],
      correta: 0,
      explicacao: 'Switch = ***bridges* multiportas**. O hub é que é um repetidor multiportas.',
      fonte: a9(14),
      cena: { modo: 'switch', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Como o switch sabe para qual porta enviar o quadro?',
      opcoes: ['Pela tabela de endereçamento MAC', 'Pela tabela de roteamento IP', 'Repetindo para todas as portas', 'Pelo número da porta TCP'],
      correta: 0,
      explicacao: 'Pela **tabela MAC**: porta → endereço MAC.',
      fonte: a9(16),
      cena: { modo: 'switch', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'A ponte liga o segmento 1 (A, B) ao segmento 2 (C, D). Quantos domínios de colisão existem?',
      campos: [{ rotulo: 'Domínios de colisão', resposta: '2', formato: 'numero' }],
      explicacao: 'Um de cada lado da ponte: **domínio de colisão 1** e **domínio de colisão 2**.',
      fonte: a9(13),
      cena: { modo: 'ponte', semNomes: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Classifique cada equipamento pela camada do RM-OSI.',
      grupos: ['Camada 1', 'Camada 2'],
      itens: [
        { texto: 'Repetidor', grupo: 0 },
        { texto: 'Hub', grupo: 0 },
        { texto: 'Ponte', grupo: 1 },
        { texto: 'Switch', grupo: 1 },
      ],
      explicacao: 'Repetidor e hub: **camada 1**. Ponte e switch: **camada 2**.',
      fonte: a9('7, 11, 13, 17'),
      cena: { modo: 'switch', semNomes: true },
    },
  ],
}

// ---------- 10.4 ----------

const fase104: Fase = {
  id: '10-4',
  titulo: 'Switch: domínios e limites',
  resumo: 'Quando o switch elimina e quando só reduz o domínio de colisão, e por que não pode haver looping.',
  Cena: CenaEquipamentos,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Só switches',
      texto: `
> Quando a rede utiliza apenas SWITCHES o domínio de colisão é **eliminado**.

Cada porta vira seu próprio domínio (as manchas pequenas na cena).`,
      fonte: a9(15),
      cena: { modo: 'switch' },
    },
    {
      titulo: 'Switch com hub',
      texto: `
> Quando a rede utiliza outros equipamentos os SWITCHES **reduzem** o domínio de colisão.

Na cena, o hub pendurado no switch mantém os computadores dele em um domínio de colisão.`,
      fonte: a9(16),
      cena: { modo: 'misto' },
    },
    {
      titulo: 'Limitações',
      texto: `
- **Encadeamento**: o slide mostra também o limite de **quatro switches**.
- **Ligação**: “**Não pode** ser fechado um *looping* por causa da **tabela MAC**.”`,
      fonte: a9('17–18'),
      cena: { modo: 'misto' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'E na prática?',
          texto: 'Switches gerenciáveis usam o protocolo **STP** (*Spanning Tree*) para bloquear automaticamente os caminhos que fechariam um looping. Não está no slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Uma rede usa APENAS switches. O que acontece com o domínio de colisão?',
      opcoes: ['É eliminado', 'Aumenta', 'Fica igual ao de um hub', 'Vira um domínio de broadcast por porta'],
      correta: 0,
      explicacao: '“Quando a rede utiliza apenas SWITCHES o domínio de colisão é **eliminado**.”',
      fonte: a9(15),
      cena: { modo: 'switch', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'A rede tem switches e também hubs. O que os switches fazem com o domínio de colisão?',
      opcoes: ['Reduzem', 'Eliminam', 'Aumentam', 'Nada'],
      correta: 0,
      explicacao: 'Com outros equipamentos, os switches **reduzem** o domínio de colisão.',
      fonte: a9(16),
      cena: { modo: 'misto', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que não pode ser fechado um looping entre switches?',
      opcoes: ['Por causa da tabela MAC', 'Por causa do TTL', 'Porque o cabo UTP não deixa', 'Porque o hub bloqueia'],
      correta: 0,
      explicacao: '“Não pode ser fechado um *looping* por causa da **tabela MAC**.”',
      fonte: a9(18),
      cena: { modo: 'misto', semNomes: true },
    },
  ],
}

// ---------- 10.5 ----------

const fase105: Fase = {
  id: '10-5',
  titulo: 'Roteador e domínio de broadcast',
  resumo: 'A camada 3: rotas, tabela de roteamento e a separação dos domínios de broadcast.',
  Cena: CenaEquipamentos,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Roteador',
      texto: `
- Escolhe o **melhor caminho** para os pacotes (rotas);
- **Interliga** as redes;
- Gerencia as **tabelas** com as rotas a serem seguidas;
- **Compatibiliza enlaces diferentes**.

No exemplo de ligação do slide: os PCs no **switch** (LAN) → **roteador** → **modem** (WAN) → internet.`,
      fonte: a9('19–20'),
      cena: { modo: 'roteador' },
    },
    {
      titulo: 'Tabela de roteamento',
      texto: `
A tabela do primeiro roteador do slide:

- 172.16.0.0/16 → **Direto**, interface E1, métrica 0
- 172.17.0.0/16 → próximo salto R2, interface S2, métrica 1
- 172.18.0.0/16 → próximo salto R2, interface S2, métrica 2

A **métrica** é quantos roteadores faltam até a rede.`,
      fonte: a9(20),
      cena: { modo: 'roteador' },
    },
    {
      titulo: 'Domínio de broadcast',
      texto: `
> É um segmento lógico em que um *host* é capaz de se comunicar com outro sem a necessidade de utilizar um dispositivo de roteamento.

> Pode ser segmentado por um roteador, no qual **cada porta do roteador representa um domínio *broadcast* distinto**.

> Todas as portas de um *hub* ou de um *switch* pertencem ao **mesmo** domínio *broadcast*.

Na cena, o broadcast da rede azul não passa do roteador.`,
      fonte: a9('21–22'),
      cena: { modo: 'broadcast' },
    },
    {
      titulo: 'Camada do roteador',
      texto: `
> Roteador – Atua na **camada 3** do modelo.

O roteador tem **conexões WAN**, **conexões LAN** e **portas de controle** (console e AUX).`,
      fonte: a9('21–22'),
      cena: { modo: 'broadcast' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual destas NÃO é função do roteador?',
      opcoes: ['Repetir o sinal para todas as portas', 'Escolher o melhor caminho para os pacotes', 'Interligar as redes', 'Compatibilizar enlaces diferentes'],
      correta: 0,
      explicacao: 'Repetir para todas as portas é o **hub**.',
      fonte: a9(19),
      cena: { modo: 'roteador', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'O roteador tem 3 portas, cada uma com um switch. Quantos domínios de broadcast existem?',
      campos: [{ rotulo: 'Domínios de broadcast', resposta: '3', formato: 'numero' }],
      explicacao: 'Cada porta do roteador é um domínio de broadcast distinto: **3**.',
      fonte: a9(21),
      cena: { modo: 'roteador', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Na tabela do slide, qual a métrica da rede 172.18.0.0/16?',
      dados: ['172.16.0.0/16 | Direto | E1 | 0', '172.17.0.0/16 | R2     | S2 | 1', '172.18.0.0/16 | R2     | S2 | ?'],
      campos: [{ rotulo: 'Métrica', resposta: '2', formato: 'numero' }],
      explicacao: 'A rede 172.18 está a **2** roteadores de distância.',
      fonte: a9(20),
      cena: { modo: 'roteador', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Todas as portas de um switch pertencem…',
      opcoes: ['Ao mesmo domínio de broadcast', 'A domínios de broadcast diferentes', 'A nenhum domínio de broadcast', 'Ao domínio do roteador mais próximo'],
      correta: 0,
      explicacao: '“Todas as portas de um *hub* ou de um *switch* pertencem ao **mesmo** domínio *broadcast*.”',
      fonte: a9(21),
      cena: { modo: 'broadcast', semNomes: true },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'classificar',
    enunciado: 'Classifique os equipamentos pela camada do RM-OSI.',
    grupos: ['Camada 1', 'Camada 2', 'Camada 3'],
    itens: [
      { texto: 'Repetidor', grupo: 0 },
      { texto: 'Hub', grupo: 0 },
      { texto: 'Ponte', grupo: 1 },
      { texto: 'Switch', grupo: 1 },
      { texto: 'Roteador', grupo: 2 },
    ],
    explicacao: 'Camada 1: repetidor e hub. Camada 2: ponte e switch. Camada 3: roteador.',
    fonte: a9('7–21'),
  },
  {
    tipo: 'digitar',
    enunciado: 'Dois hubs ligados entre si, com 3 computadores cada. Quantos domínios de colisão?',
    campos: [{ rotulo: 'Domínios de colisão', resposta: '1', formato: 'numero' }],
    explicacao: 'Hubs repassam para todos os nós: tudo é **um** domínio de colisão.',
    fonte: a9(10),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual equipamento separa domínios de broadcast?',
    opcoes: ['Roteador', 'Switch', 'Hub', 'Repetidor'],
    correta: 0,
    explicacao: 'Só o **roteador**: cada porta é um domínio de broadcast distinto.',
    fonte: a9(21),
  },
  {
    tipo: 'escolha',
    enunciado: 'O repetidor pode ligar um cabo de par trançado a uma fibra ótica?',
    opcoes: ['Não: é usado apenas em meios físicos idênticos', 'Sim, ele converte o sinal', 'Sim, se houver um driver NDIS', 'Só com quatro repetidores'],
    correta: 0,
    explicacao: 'O repetidor é “usado apenas em **meios físicos idênticos**”.',
    fonte: a9(5),
  },
]

export const trilha10: Trilha = {
  id: 't10',
  numero: 10,
  titulo: 'Equipamentos de Redes',
  aula: 'Aula 09 · Equipamentos de Redes',
  cor: '#4a7a2c',
  disponivel: true,
  fases: [fase101, fase102, fase103, fase104, fase105],
  chefaoExtras: extras,
}
