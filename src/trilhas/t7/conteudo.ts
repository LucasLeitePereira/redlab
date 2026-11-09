import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaCabecalhoIp } from './cenas/CabecalhoIp'
import { CenaCodigos } from './cenas/Codigos'
import { CenaConfirmacao } from './cenas/Confirmacao'
import { CenaEmail } from './cenas/Email'
import { CenaFtp } from './cenas/Ftp'
import { CenaIpv4 } from './cenas/Ipv4'
import { CenaPortas } from './cenas/Portas'
import { CenaRemoto } from './cenas/Remoto'
import { CenaSegmentacao } from './cenas/Segmentacao'
import { CenaUdp } from './cenas/Udp'
import { CenaWeb } from './cenas/Web'

// Trilha 7 — Protocolos e Serviços Internet. PDF: REDES-06_Servicos-Internet.pdf (32 páginas,
// 2 slides por página; a "página" das citações é a página do PDF). Slides em branco: 2ª metade
// das p. 7, 10, 19, 25, 29 e 32.
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const a6 = (pagina: number | string): Fonte => ({ aula: 'Aula 06', pagina })

// ---------- 7.1 ----------

const fase71: Fase = {
  id: '7-1',
  titulo: 'IPv4: entrega sem garantias',
  resumo: 'O que o IP faz, o que ele não garante e onde o pacote viaja (dentro do quadro Ethernet).',
  Cena: CenaIpv4,
  camera: [0, 6.5, 11],
  passos: [
    {
      titulo: 'Os protocolos da Internet',
      texto: `
Do ponto de vista do usuário, a Internet parece um conjunto de programas. Mas, para clientes acessarem os recursos nos servidores, são necessários protocolos:

> - **IPv4** — *Internet Protocol ver. 4* — Protocolo Internet Versão 4
> - **ICMP** — *Internet Control Message Protocol* — Protocolo de Mensagens de Controle da Internet
> - **TCP** — *Transmission Control Protocol* — Protocolo de Controle de Transmissão
> - **UDP** — *User Datagram Protocol* — Protocolo de Datagrama do Usuário

No slide, IPv4 e ICMP têm a mesma cor (camada de rede); TCP e UDP têm outra (transporte).`,
      fonte: a6('1–2'),
      cena: { modo: 'protocolos' },
    },
    {
      titulo: 'O que é o IP',
      texto: `
> O IP é um protocolo de comunicação da internet usado para identificar cada *host*, garantindo que as informações cheguem no destino através do roteamento dos dados.

> Serviços fornecidos pelo protocolo IPv4:
> - Endereçamento de *hosts* e roteamento dos pacotes;
> - Serviços de entrega não confiável (melhor esforço) sem conexão.

Na cena, cada pacote sai do host da esquerda e os roteadores escolhem o caminho até o host da direita.`,
      fonte: a6(3),
      cena: { modo: 'entrega' },
    },
    {
      titulo: 'Sem garantias, sem conexão, melhor esforço',
      texto: `
> - **Sem Garantias:** Um pacote pode ser perdido, duplicado, adiado ou entregue fora da ordem, mas o serviço não detectará essas condições, nem informará ao emissor ou receptor.
> - É denominado **sem conexão** porque cada pacote é tratado independentemente de todos os outros.
> - É considerado como **entrega pelo menor esforço** porque o *software* faz a melhor tentativa de entregar os pacotes.

Clique nos pacotes com problema para ver o que aconteceu com cada um.`,
      fonte: a6(3),
      cena: { modo: 'semGarantias' },
      explorar: {
        instrucao: 'Clique nos 4 pacotes com problema.',
        alvos: {
          perdido: { titulo: 'Perdido', texto: 'O pacote 2 sumiu no caminho. O IP **não avisa** ninguém.' },
          duplicado: { titulo: 'Duplicado', texto: 'O pacote 3 chegou **duas vezes**. O IP não detecta.' },
          adiado: { titulo: 'Adiado', texto: 'O pacote 4 pegou um caminho mais longo e **demorou**.' },
          foraDeOrdem: { titulo: 'Fora da ordem', texto: 'O 5 chegou **antes** do 4: cada pacote é tratado de forma independente (sem conexão).' },
        },
      },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: '“Melhor esforço” ou “menor esforço”?',
          noSlide: 'Em Serviços está **“melhor esforço”**, e nas Características está **“entrega pelo menor esforço”**.',
          naPratica: 'O termo em inglês é *best effort*, que se traduz como **melhor esforço**: o IP tenta entregar, mas não garante. As duas frases do slide falam da mesma coisa.',
        },
      ],
    },
    {
      titulo: 'O pacote viaja dentro do quadro',
      texto: `
> Os serviços fornecidos pelo IP são similares ao do protocolo do *hardware* de rede (*Ethernet*).

No **pacote IPv4**, o “Cabeçalho do Pacote” vem antes dos “Dados com a carga útil do PACOTE”. O pacote inteiro vira a carga útil do **quadro ETHERNET**, que tem o “Cabeçalho do Quadro” na frente e o **FCS** no fim.`,
      fonte: a6('3–4'),
      cena: { modo: 'quadro' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Quais são os serviços fornecidos pelo protocolo IPv4?',
      opcoes: [
        'Endereçamento de hosts e roteamento dos pacotes; entrega não confiável (melhor esforço) sem conexão',
        'Garantia de entrega, sequenciamento e integridade dos dados',
        'Transferência de páginas web usando links',
        'Endereçamento físico (MAC) e controle de acesso ao meio',
      ],
      correta: 0,
      explicacao: 'IPv4: endereçamento de *hosts* e roteamento dos pacotes; entrega **não confiável** (melhor esforço) **sem conexão**. Garantia, sequenciamento e integridade são do **TCP**.',
      fonte: a6(3),
      cena: { modo: 'entrega' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Pelo slide, o que pode acontecer com um pacote IP?',
      grupos: ['Pode acontecer', 'O IP não faz'],
      itens: [
        { texto: 'Ser perdido', grupo: 0 },
        { texto: 'Ser duplicado', grupo: 0 },
        { texto: 'Ser entregue fora da ordem', grupo: 0 },
        { texto: 'Avisar o emissor que o pacote se perdeu', grupo: 1 },
        { texto: 'Confirmar a entrega com ACK', grupo: 1 },
      ],
      explicacao: 'Um pacote pode ser perdido, duplicado, adiado ou entregue fora da ordem, **mas o serviço não detectará essas condições, nem informará ao emissor ou receptor**.',
      fonte: a6(3),
      cena: { modo: 'semGarantias' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que o IP é chamado de “sem conexão”?',
      opcoes: [
        'Porque cada pacote é tratado independentemente de todos os outros',
        'Porque não usa cabos',
        'Porque não tem endereço de destino',
        'Porque só funciona em redes sem fio',
      ],
      correta: 0,
      explicacao: '“É denominado **sem conexão** porque cada pacote é tratado independentemente de todos os outros.”',
      fonte: a6(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura do slide, onde o pacote IPv4 viaja?',
      opcoes: [
        'Como carga útil do quadro Ethernet, entre o cabeçalho do quadro e o FCS',
        'No FCS do quadro',
        'Antes do cabeçalho do quadro',
        'Dentro do segmento TCP',
      ],
      correta: 0,
      explicacao: 'O pacote inteiro (cabeçalho + dados) é a “carga útil do QUADRO”: Cabeçalho do Quadro | pacote | FCS.',
      fonte: a6(4),
      cena: { modo: 'quadro' },
    },
  ],
}

// ---------- 7.2 ----------

const fase72: Fase = {
  id: '7-2',
  titulo: 'Cabeçalho do pacote IPv4',
  resumo: 'Os campos do cabeçalho: versão, TTL, protocolo, IP de origem e de destino.',
  Cena: CenaCabecalhoIp,
  camera: [0, 4.5, 11],
  alvoCamera: [0, 1.8, 0],
  passos: [
    {
      titulo: 'O cabeçalho em linhas de 32 bits',
      texto: `
O slide desenha o cabeçalho como uma tabela com bits de **0 a 31** em cada linha:

- Versão · HLEN · Tipo de Serviço · Tamanho Total
- Identificação · FLAGS · OFFSET do fragmento
- Tempo de Vida · Protocolo · Cheksum do cabeçalho
- Endereço IPv4 de Origem
- Endereço IPv4 de Destino
- Dados com a carga útil do PACOTE

Os campos em **laranja escuro** são os que o professor explica. Clique neles.`,
      fonte: a6(4),
      cena: { modo: 'cabecalho' },
      explorar: {
        instrucao: 'Clique nos 5 campos destacados.',
        alvos: {
          versao: { titulo: 'Versão', texto: '> Identifica a versão do protocolo IP' },
          ttl: { titulo: 'Tempo de Vida', texto: '> (TTL, *Time-to-Live*) Indicador da quantidade de roteadores que podem ser ultrapassados' },
          protocolo: { titulo: 'Protocolo', texto: '> Número que identifica o protocolo na “carga útil”. 1 : ICMP · 6 : TCP · 17 : UDP' },
          origem: { titulo: 'IP de Origem', texto: '> Endereço do *host* formado por 32 bits' },
          destino: { titulo: 'IP de Destino', texto: '> Endereço do *host* formado por 32 bits' },
        },
      },
    },
    {
      titulo: 'O TTL em ação',
      texto: `
> **Tempo de Vida** (TTL, *Time-to-Live*): Indicador da quantidade de roteadores que podem ser ultrapassados.

A cada roteador, o TTL cai 1. Se chegar a **0**, o pacote é descartado: assim um pacote perdido num laço não fica circulando para sempre.`,
      fonte: a6(5),
      cena: { modo: 'ttl' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Quem avisa do descarte',
          texto: 'Quando o TTL zera, o roteador costuma mandar de volta uma mensagem **ICMP** (*Time Exceeded*). É assim que o comando **tracert** descobre o caminho. Isso não está no slide.',
        },
      ],
    },
    {
      titulo: 'Exemplo preenchido',
      texto: `
> Exemplo: alguns campos do cabeçalho preenchido

| 4 | 127 | 6 | 192.168.10.1 | 172.32.1.100 | Dados |

- **4** → versão IPv4;
- **127** → TTL;
- **6** → a carga útil é **TCP** (a seta do slide liga o 6 aos Dados);
- **192.168.10.1** → IP de origem; **172.32.1.100** → IP de destino.`,
      fonte: a6(5),
      cena: { modo: 'exemplo', exemplo: 1 },
    },
    {
      titulo: 'Segundo exemplo: broadcast',
      texto: `
No segundo exemplo, o protocolo é **1** e o destino é **255.255.255.255** (o *broadcast* da Trilha 4):

| 4 | 127 | 1 | 192.168.10.1 | 255.255.255.255 | Dados |`,
      fonte: a6(5),
      cena: { modo: 'exemplo', exemplo: 2 },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O 1 rotulado como “TCP”',
          noSlide: 'No 2º exemplo, o campo protocolo tem o valor **1**, mas o rótulo embaixo continua **“TCP”**.',
          naPratica: 'Pela tabela do próprio slide, **1 = ICMP** (6 = TCP, 17 = UDP). O rótulo foi copiado do 1º exemplo. Na prova, lembre da tabela: 1 é ICMP.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'digitar',
      enunciado: 'Qual número no campo Protocolo indica que a carga útil é UDP?',
      campos: [{ rotulo: 'Protocolo', resposta: '17', formato: 'numero' }],
      explicacao: '1 : ICMP · 6 : TCP · **17 : UDP**.',
      fonte: a6(5),
      cena: { modo: 'cabecalho' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue o número do campo Protocolo ao protocolo da carga útil.',
      grupos: ['ICMP', 'TCP', 'UDP'],
      itens: [
        { texto: '1', grupo: 0 },
        { texto: '6', grupo: 1 },
        { texto: '17', grupo: 2 },
      ],
      explicacao: 'Tabela do slide: 1 : ICMP · 6 : TCP · 17 : UDP.',
      fonte: a6(5),
      cena: { modo: 'cabecalho' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que o campo Tempo de Vida (TTL) indica?',
      opcoes: [
        'A quantidade de roteadores que podem ser ultrapassados',
        'Quantos segundos o host fica ligado',
        'O tempo que o servidor leva para responder',
        'A versão do protocolo IP',
      ],
      correta: 0,
      explicacao: '“(TTL, *Time-to-Live*) Indicador da quantidade de roteadores que podem ser ultrapassados.”',
      fonte: a6(5),
      cena: { modo: 'ttl' },
    },
    {
      tipo: 'digitar',
      enunciado: 'Um pacote sai com TTL 127 e passa por 3 roteadores. Com que TTL ele chega?',
      dados: ['TTL inicial : 127', 'Roteadores  : 3'],
      campos: [{ rotulo: 'TTL na chegada', resposta: '124', formato: 'numero' }],
      explicacao: 'Cada roteador ultrapassado diminui o TTL em 1: 127 − 3 = **124**.',
      fonte: a6(5),
      cena: { modo: 'ttl' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No 1º exemplo do slide, qual é o IP de destino?',
      dados: ['4 | 127 | 6 | 192.168.10.1 | 172.32.1.100 | Dados'],
      opcoes: ['172.32.1.100', '192.168.10.1', '255.255.255.255', '127.0.0.1'],
      correta: 0,
      explicacao: 'A ordem do exemplo é Versão, TTL, Protocolo, **IP origem** (192.168.10.1) e **IP destino** (172.32.1.100).',
      fonte: a6(5),
      cena: { modo: 'exemplo', exemplo: 1, semRotulos: true },
    },
  ],
}

// ---------- 7.3 ----------

const fase73: Fase = {
  id: '7-3',
  titulo: 'TCP e a segmentação',
  resumo: 'Os serviços do TCP e como uma mensagem grande vira segmentos, pacotes e quadros.',
  Cena: CenaSegmentacao,
  camera: [0, 4.8, 12],
  alvoCamera: [0, 1.8, 0],
  passos: [
    {
      titulo: 'O que o TCP fornece',
      texto: `
> **Serviços fornecidos:** Garantia de entrega, Sequenciamento e Integridade dos dados.

> **Características:**
> - É orientado a conexão;
> - Suporta transferência de dados nas duas direções (*Full Duplex*);
> - Fornece um sistema de entrega confiável de um fluxo (*stream*) de caracteres.

É tudo o que o IP **não** faz: o TCP fica em cima do IP e conserta a entrega sem garantias.`,
      fonte: a6(6),
      cena: { modo: 'servicos' },
    },
    {
      titulo: 'O segmento TCP',
      texto: `
Como no pacote IP, o slide mostra o encaixe:

- **Segmento**: Cabeçalho Segmento + *Payload* (Dados com carga útil);
- o segmento inteiro é o *payload* do **pacote**;
- o pacote inteiro é o *payload* do **quadro**, que termina no **FCS**.`,
      fonte: a6(6),
      cena: { modo: 'encapsula' },
    },
    {
      titulo: 'Conceito de segmentação',
      texto: `
> Quando a mensagem excede o “limite de carga” os dados são divididos em pedaços (segmentos) para que possam trafegar dentro do padrão de rede. **O limite do tamanho do segmento TCP é chamado MSS (*maximum segment size*).**

Na cena: o **Protocolo da Aplicação** entrega a **Mensagem**; o **TCP** corta em 5 segmentos (cada um com o seu cabeçalho verde); o **IP** põe cada segmento num pacote; a **Ethernet** põe cada pacote num quadro.`,
      fonte: a6(7),
      cena: { modo: 'segmentos' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'O que é do TCP e o que é do IP?',
      grupos: ['TCP', 'IP'],
      itens: [
        { texto: 'Garantia de entrega', grupo: 0 },
        { texto: 'Sequenciamento', grupo: 0 },
        { texto: 'Orientado a conexão', grupo: 0 },
        { texto: 'Endereçamento de hosts e roteamento', grupo: 1 },
        { texto: 'Entrega não confiável sem conexão', grupo: 1 },
      ],
      explicacao: 'TCP: garantia de entrega, sequenciamento, integridade, orientado a conexão. IP: endereçamento e roteamento, entrega não confiável (melhor esforço) sem conexão.',
      fonte: a6('3, 6'),
      cena: { modo: 'servicos' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Como se chama o limite do tamanho do segmento TCP?',
      opcoes: ['MSS (maximum segment size)', 'TTL (time-to-live)', 'FCS', 'MAC'],
      correta: 0,
      explicacao: '“O limite do tamanho do segmento TCP é chamado **MSS** (*maximum segment size*).”',
      fonte: a6(7),
      cena: { modo: 'segmentos' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura de segmentação, quem divide a mensagem em segmentos?',
      opcoes: ['TCP', 'IP', 'Ethernet', 'O protocolo da aplicação'],
      correta: 0,
      explicacao: 'A aplicação entrega a **Mensagem**; o **TCP** a divide em segmentos (até o MSS); o IP e a Ethernet só embalam cada segmento.',
      fonte: a6(7),
      cena: { modo: 'segmentos', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que significa o TCP ser Full Duplex?',
      opcoes: [
        'Suporta transferência de dados nas duas direções',
        'Envia cada pacote duas vezes',
        'Usa dois cabos',
        'Funciona sem conexão',
      ],
      correta: 0,
      explicacao: '“Suporta transferência de dados nas duas direções (*Full Duplex*).”',
      fonte: a6(6),
    },
  ],
}

// ---------- 7.4 ----------

const fase74: Fase = {
  id: '7-4',
  titulo: 'ACK, retransmissão e three-way handshake',
  resumo: 'Como o TCP confirma cada segmento, reenvia o que se perdeu e abre a conexão.',
  Cena: CenaConfirmacao,
  camera: [0, 4.5, 11],
  alvoCamera: [0, 2, 0],
  passos: [
    {
      titulo: 'Confirmação de entrega',
      texto: `
> - Toda vez que um segmento é recebido, uma mensagem de confirmação (**ACK**) é enviada à origem;
> - O emissor mantém um registro dos envios e espera o ACK antes de enviar o próximo;
> - O emissor inicia um “**timer**” toda vez que envia um segmento.

Na linha do tempo: Cliente envia Segmento 1 → Servidor recebe e envia ACK-1 → Cliente recebe ACK-1 e só então envia o Segmento 2…`,
      fonte: a6(7),
      cena: { modo: 'ack' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Um segmento por vez?',
          noSlide: 'O emissor **espera o ACK antes de enviar o próximo**.',
          naPratica: 'Esse é o modelo mais simples (“para e espera”). O TCP real usa uma **janela deslizante**: manda vários segmentos seguidos (até o “Tamanho da Janela” do cabeçalho) antes de receber os ACKs. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: 'Retransmissão',
      texto: `
O que acontece quando o segmento se perde:

- “Envia Segmento 1 · Inicia o Timer” → **Pacote é perdido!** ✗
- Do outro lado: “Segmento 1 deveria ter chegado”, “ACK-1 deveria ter sido transmitido”;
- No cliente: “**ACK-1 deveria ter chegado**”;
- “**Timer expirou!**” → **Re-Envia** Segmento 1 → Recebe Segmento 1 → Envia ACK-1 → Recebe ACK-1.`,
      fonte: a6(8),
      cena: { modo: 'perda' },
    },
    {
      titulo: 'Three-Way Handshake',
      texto: `
> O *Three-Way Handshake* é o estabelecimento de conexões em ambos os sentidos (*full-duplex*).

São **três** mensagens:

1. **SYN x** (cliente → servidor);
2. **SYN y, ACK x** (servidor → cliente);
3. **ACK y** (cliente → servidor).

Cada lado abre o seu sentido (SYN) e confirma o do outro (ACK). Só depois disso os dados começam a passar.`,
      fonte: a6(8),
      cena: { modo: 'handshake' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'O que o emissor TCP inicia toda vez que envia um segmento?',
      opcoes: ['Um timer', 'Um three-way handshake', 'Um broadcast', 'Um novo endereço IP'],
      correta: 0,
      explicacao: '“O emissor inicia um **timer** toda vez que envia um segmento.” Se o timer expira sem ACK, ele reenvia.',
      fonte: a6(7),
      cena: { modo: 'ack' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura de retransmissão, o que faz o cliente reenviar o Segmento 1?',
      opcoes: ['O timer expirou sem chegar o ACK-1', 'O servidor pediu o segmento de novo', 'O TTL chegou a zero', 'O cabo foi trocado'],
      correta: 0,
      explicacao: '“ACK-1 deveria ter chegado” → “**Timer expirou!**” → Re-Envia Segmento 1.',
      fonte: a6(8),
      cena: { modo: 'perda' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Coloque as mensagens do three-way handshake na ordem.',
      grupos: ['1ª', '2ª', '3ª'],
      itens: [
        { texto: 'SYN x', grupo: 0 },
        { texto: 'SYN y, ACK x', grupo: 1 },
        { texto: 'ACK y', grupo: 2 },
      ],
      explicacao: 'SYN x → SYN y, ACK x → ACK y: a conexão é aberta nos dois sentidos (*full-duplex*).',
      fonte: a6(8),
      cena: { modo: 'handshake', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Para que serve o three-way handshake?',
      opcoes: [
        'Estabelecer a conexão em ambos os sentidos (full-duplex)',
        'Encerrar a conexão',
        'Descobrir o endereço MAC do destino',
        'Escolher o roteador do caminho',
      ],
      correta: 0,
      explicacao: '“O *Three-Way Handshake* é o estabelecimento de conexões em ambos os sentidos (*full-duplex*).”',
      fonte: a6(8),
      cena: { modo: 'handshake' },
    },
  ],
}

// ---------- 7.5 ----------

const fase75: Fase = {
  id: '7-5',
  titulo: 'Portas e conexões TCP',
  resumo: 'Portas de cliente e de servidor, o par IP:porta e o cabeçalho do segmento TCP.',
  Cena: CenaPortas,
  camera: [0, 5, 11.5],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'Porta',
      texto: `
> **Porta** ➡ É um número entre **0 e 65535** que identifica o processo que está se comunicando em cada *host*.

> - Portas nos clientes (que solicitam serviço) **são aleatória**. » Usam valores de **1024 até 65535**.
> - Portas nos servidores (que fornecem serviço) **são fixas** e bem conhecidas (*Well-Known Ports*). Ex: TCP/80 | HTTP · TCP/443 | HTTPs

Na cena: o **Chrome** (*Software* Cliente) fala com o **Apache** (*Software* Servidor).`,
      fonte: a6(9),
      cena: { modo: 'portas' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Faixas oficiais',
          texto: 'A IANA divide as portas em: **0–1023** bem conhecidas, **1024–49151** registradas e **49152–65535** dinâmicas (as que o Windows usa como porta aleatória do cliente). Isso não está no slide.',
        },
      ],
    },
    {
      titulo: 'Conexões TCP',
      texto: `
> - Conexões possibilitam que segmentos sejam recebidos, remontados e confirmados no destino.
> - Para identificar os pontos terminais de uma conexão é necessário o **endereço IP e a porta**.

No exemplo do slide, dois clientes acessam o **SRV-HTTP** (10.1.1.1):

- (10.1.1.2:**49152**) e (10.1.1.1:**80**)
- (10.1.1.3:**52230**) e (10.1.1.1:**80**)

O servidor usa a mesma porta 80 nas duas, mas as conexões são diferentes porque o par IP:porta do cliente muda.`,
      fonte: a6(9),
      cena: { modo: 'conexoes' },
    },
    {
      titulo: 'Cabeçalho do segmento TCP',
      texto: `
O slide mostra o cabeçalho em linhas de 32 bits:

- Porta de Origem · Porta de Destino
- Número de Sequência
- Número de ACK (reconhecimento)
- OFF · RES · Código · Tamanho da Janela
- *Cheksum* · *Urgent Pointer*
- Opções · Pad
- Dados com a carga útil do Segmento

Repare: as **portas** estão no cabeçalho do **TCP**, e os **IPs** estão no cabeçalho do **IP** (fase 7.2). O **Número de Sequência** e o **Número de ACK** fazem o sequenciamento e a confirmação.`,
      fonte: a6(10),
      cena: { modo: 'cabecalho' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Pelo slide, qual faixa as portas dos clientes usam?',
      opcoes: ['De 1024 até 65535', 'De 0 até 1023', 'Só a porta 80', 'De 0 até 255'],
      correta: 0,
      explicacao: 'Portas nos clientes são aleatórias: “Usam valores de **1024 até 65535**”. As dos servidores são fixas e bem conhecidas.',
      fonte: a6(9),
      cena: { modo: 'portas' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é da porta do cliente ou do servidor?',
      grupos: ['Cliente', 'Servidor'],
      itens: [
        { texto: 'Aleatória', grupo: 0 },
        { texto: 'Solicita o serviço', grupo: 0 },
        { texto: 'Fixa e bem conhecida (Well-Known)', grupo: 1 },
        { texto: 'Fornece o serviço', grupo: 1 },
        { texto: 'TCP/443 do HTTPs', grupo: 1 },
      ],
      explicacao: 'Cliente: solicita serviço, porta aleatória (1024–65535). Servidor: fornece serviço, porta fixa e bem conhecida (TCP/80 HTTP, TCP/443 HTTPs).',
      fonte: a6(9),
      cena: { modo: 'portas' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é necessário para identificar os pontos terminais de uma conexão TCP?',
      opcoes: ['O endereço IP e a porta', 'Só o endereço MAC', 'Só a porta', 'O nome do navegador'],
      correta: 0,
      explicacao: '“Para identificar os pontos terminais de uma conexão é necessário o **endereço IP e a porta**.”',
      fonte: a6(9),
      cena: { modo: 'conexoes' },
    },
    {
      tipo: 'digitar',
      enunciado: 'No exemplo do slide, qual porta o cliente 10.1.1.3 usa na conexão com o SRV-HTTP?',
      dados: ['(10.1.1.2:49152) e (10.1.1.1:80)', '(10.1.1.3:?????) e (10.1.1.1:80)'],
      campos: [{ rotulo: 'Porta do cliente 10.1.1.3', resposta: '52230', formato: 'numero' }],
      explicacao: 'A segunda conexão é (10.1.1.3:**52230**) e (10.1.1.1:80).',
      fonte: a6(9),
      cena: { modo: 'conexoes', semPortas: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Em qual cabeçalho ficam a Porta de Origem e a Porta de Destino?',
      opcoes: ['No cabeçalho do segmento TCP', 'No cabeçalho do pacote IPv4', 'No FCS do quadro', 'No cabeçalho do quadro Ethernet'],
      correta: 0,
      explicacao: 'A 1ª linha do **cabeçalho do segmento TCP** é Porta de Origem | Porta de Destino. O cabeçalho IP tem os endereços IP.',
      fonte: a6(10),
      cena: { modo: 'cabecalho' },
    },
  ],
}

// ---------- 7.6 ----------

const fase76: Fase = {
  id: '7-6',
  titulo: 'UDP: rápido e sem garantias',
  resumo: 'O protocolo sem conexão e sem ACK, o cabeçalho de 8 bytes e onde ele é usado.',
  Cena: CenaUdp,
  camera: [0, 5, 11.5],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'Protocolo de Datagrama do Usuário',
      texto: `
> Protocolo não orientado a conexão e sem garantia de entrega
> - Mensagens podem ser perdidas ou duplicadas
> - Mensagens podem chegar fora de ordem
> - Não utiliza ACKs para confirmação de chegada de mensagens

Na cena, os datagramas saem sem *handshake* e ninguém responde com ACK. Um se perde e ninguém reenvia.`,
      fonte: a6(11),
      cena: { modo: 'datagramas' },
    },
    {
      titulo: 'Características',
      texto: `
> - Implementa o conceito de portas de origem e destino
> - Cabeçalho fixo de **8 bytes**
> - Baixo *overhead*
> - Usado em consultas de **DNS, VoIP, NFS**, etc.

> É usado quando se quer melhores tempo de resposta.

Numa chamada de voz (VoIP), um pedacinho perdido quase não se nota; esperar a retransmissão atrasaria a conversa inteira.`,
      fonte: a6(11),
      cena: { modo: 'usos' },
    },
    {
      titulo: 'Datagrama e cabeçalho UDP',
      texto: `
O encaixe é o mesmo do TCP: **Cabeçalho Datagrama** + *Payload* → dentro do pacote → dentro do quadro (com FCS).

O cabeçalho UDP tem só duas linhas de 32 bits:

- Porta de Origem · Porta de Destino
- Comprimento · *Checksum*

São 4 campos de 16 bits = **8 bytes**. Compare com o do TCP (fase 7.5): sem número de sequência, sem ACK, sem janela.`,
      fonte: a6(12),
      cena: { modo: 'cabecalho' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é do TCP ou do UDP?',
      grupos: ['TCP', 'UDP'],
      itens: [
        { texto: 'Orientado a conexão', grupo: 0 },
        { texto: 'Usa ACK para confirmar a entrega', grupo: 0 },
        { texto: 'Cabeçalho fixo de 8 bytes', grupo: 1 },
        { texto: 'Não utiliza ACKs', grupo: 1 },
        { texto: 'Usado quando se quer melhores tempos de resposta', grupo: 1 },
      ],
      explicacao: 'TCP: orientado a conexão, garantia de entrega com ACK. UDP: sem conexão, sem ACK, cabeçalho fixo de 8 bytes, baixo overhead, melhores tempos de resposta.',
      fonte: a6('6–7, 11'),
      cena: { modo: 'datagramas' },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual é o tamanho fixo do cabeçalho UDP, em bytes?',
      campos: [{ rotulo: 'Bytes', resposta: '8', formato: 'numero' }],
      explicacao: '“Cabeçalho fixo de **8 bytes**”: Porta de Origem, Porta de Destino, Comprimento e *Checksum*, 16 bits cada.',
      fonte: a6('11–12'),
      cena: { modo: 'cabecalho' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes serviços o slide cita como usuário do UDP?',
      opcoes: ['Consultas de DNS', 'Transferência de páginas web (HTTP)', 'Envio de e-mail (SMTP)', 'Acesso remoto seguro (SSH)'],
      correta: 0,
      explicacao: '“Usado em consultas de **DNS**, VoIP, NFS, etc.” HTTP, SMTP e SSH usam TCP.',
      fonte: a6(11),
      cena: { modo: 'usos' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes campos existe no cabeçalho UDP?',
      opcoes: ['Comprimento', 'Número de Sequência', 'Número de ACK', 'Tamanho da Janela'],
      correta: 0,
      explicacao: 'O cabeçalho UDP tem Porta de Origem, Porta de Destino, **Comprimento** e *Checksum*. Sequência, ACK e Janela são do TCP.',
      fonte: a6(12),
      cena: { modo: 'cabecalho', semNomes: true },
    },
  ],
}

// ---------- 7.7 ----------

const fase77: Fase = {
  id: '7-7',
  titulo: 'Serviço de Página WEB',
  resumo: 'Hipertexto, navegador e servidor, o HTTP sobre o TCP e o proxy.',
  Cena: CenaWeb,
  camera: [0, 5, 12],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'Serviços e protocolos',
      texto: `
> **Serviço de Rede → Protocolos Usados**
> - Página Web → HTTP e HTTPs
> - Correio Eletrônico → SMTP-S, POP3-S e IMAP4
> - Transferência Arquivos → FTP-Data e FTP-Controle
> - Acesso Remoto → Telnet e SSH

Esta fase é a da página Web; as próximas são as outras três linhas.`,
      fonte: a6(13),
      cena: { modo: 'servicos' },
    },
    {
      titulo: 'Hipertexto',
      texto: `
> Páginas Web permitem que usuários vejam vários documentos interligados usando ligações (*links*).

> Um documento com hipertextos possuí ligações (*links*) com outros documentos de forma não sequencial. A estrutura, formada por documentos, pode ser acessada de forma não linear, direta, seguindo a demanda do usuário.

Os documentos A a F estão ligados como na figura do slide. Clique em um *link* para pular de um documento a outro.`,
      fonte: a6('14–15'),
      cena: { modo: 'hipertexto' },
    },
    {
      titulo: 'Navegador e servidor WEB',
      texto: `
> Dois *softwares* principais são usados:
> - ❶ **Navegador (*browser*)**: Programa usado pelo usuário para acessar as páginas Web (documento de hipertexto).
> - ❷ **Servidor WEB**: Programa usado para gerenciar e disponibilizar os documentos solicitados pelo cliente.

> Exemplos Servidores de páginas Web: Apache HTTP *Server*, *Internet Information Services* (IIS), IBM HTTP *Server*, entre outros.

Na figura, o cliente clica num *hyperlink* para abcd.com e a página vem do servidor por uma **conexão TCP** pela Internet.`,
      fonte: a6('14–15'),
      cena: { modo: 'clienteServidor' },
    },
    {
      titulo: 'HTTP',
      texto: `
> **HTTP** (*Hypertext Transfer Protocol*): Protocolo usado para transferir documentos de hipertexto/hipermídia.
> - É considerado a base da internet – É usado para transferir páginas web usando *links*.
> - Usa os serviços do TCP para estabelecer uma a conexão e fornecer garantia de entrega.
> - HTTPS é a versão segura. Usa o método de criptografia na camada sessão/transporte.

> Detalhes:
> - **Requisição/Resposta:** O cliente envia requisições (*HTTP requests*) que são respondidos (*HTTP response*) pelo Servidor.
> - **Negociação de capacidade:** Permite que clientes e servidores negociem detalhes como o conjunto de caracteres a ser usado durante as transferências.
> - **Suporte para intermediários:** Permite que um *host* ao longo do caminho atue como um servidor *proxy* que coloca em cache as páginas WEB.`,
      fonte: a6(16),
      cena: { modo: 'clienteServidor', requisicao: true },
    },
    {
      titulo: 'Proxy HTTP e portas',
      texto: `
> Um servidor *proxy* proporciona melhores tempos de resposta quando usuários solicitam página Web na Internet.

Na figura, o **User** e o **Proxy** ficam na rede interna; o proxy busca a página em example.com na Internet e guarda uma cópia (cache). Na 2ª vez, a resposta sai do proxy, sem ir à Internet.

> - **TCP/80** — porta usada pelo **servidor HTTP**.
> - **TCP/443** — porta usada pelo **servidor HTTPS (seguro)**.
> - **TCP/3128** — porta usada pelo ***proxy* HTTP**.`,
      fonte: a6(17),
      cena: { modo: 'proxy' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada serviço de rede aos protocolos usados (tabela do slide).',
      grupos: ['Página Web', 'Correio Eletrônico', 'Transferência de Arquivos', 'Acesso Remoto'],
      itens: [
        { texto: 'HTTP e HTTPs', grupo: 0 },
        { texto: 'SMTP-S, POP3-S e IMAP4', grupo: 1 },
        { texto: 'FTP-Data e FTP-Controle', grupo: 2 },
        { texto: 'Telnet e SSH', grupo: 3 },
      ],
      explicacao: 'Página Web: HTTP e HTTPs. Correio: SMTP-S, POP3-S e IMAP4. Transferência de arquivos: FTP-Data e FTP-Controle. Acesso remoto: Telnet e SSH.',
      fonte: a6(13),
      cena: { modo: 'servicos', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o programa usado para gerenciar e disponibilizar os documentos solicitados pelo cliente?',
      opcoes: ['Servidor WEB (ex.: Apache, IIS)', 'Navegador (browser)', 'Proxy', 'DNS'],
      correta: 0,
      explicacao: '❷ **Servidor WEB**: Programa usado para gerenciar e disponibilizar os documentos solicitados pelo cliente. O navegador é o programa do usuário.',
      fonte: a6(14),
      cena: { modo: 'clienteServidor' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O HTTP usa os serviços de qual protocolo para estabelecer a conexão e garantir a entrega?',
      opcoes: ['TCP', 'UDP', 'ICMP', 'ARP'],
      correta: 0,
      explicacao: '“Usa os serviços do **TCP** para estabelecer uma a conexão e fornecer garantia de entrega.”',
      fonte: a6(16),
      cena: { modo: 'clienteServidor', requisicao: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual porta TCP o slide indica para o proxy HTTP?',
      campos: [{ rotulo: 'TCP/', resposta: '3128', formato: 'numero' }],
      explicacao: 'TCP/80: servidor HTTP · TCP/443: servidor HTTPS · **TCP/3128: proxy HTTP**.',
      fonte: a6(17),
      cena: { modo: 'proxy' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual detalhe do HTTP permite que um host no caminho guarde páginas em cache?',
      opcoes: ['Suporte para intermediários', 'Negociação de capacidade', 'Requisição/Resposta', 'Three-way handshake'],
      correta: 0,
      explicacao: '**Suporte para intermediários**: permite que um *host* ao longo do caminho atue como um servidor *proxy* que coloca em cache as páginas WEB.',
      fonte: a6(16),
      cena: { modo: 'proxy' },
    },
  ],
}

// ---------- 7.8 ----------

const fase78: Fase = {
  id: '7-8',
  titulo: 'Códigos de resposta HTTP',
  resumo: 'As cinco famílias de códigos (1xx a 5xx) e os exemplos do slide.',
  Cena: CenaCodigos,
  camera: [0, 4.6, 11],
  alvoCamera: [0, 1.8, 0],
  passos: [
    {
      titulo: '1xx, 2xx e 3xx',
      texto: `
> Códigos usados no *Response*:
> - **1xx/Informativo:** A requisição foi recebida e está sendo processada; — **100** Continue
> - **2xx/Sucesso:** Indica que a requisição foi bem sucedida; — **200** OK, a requisição foi bem sucedida · **202** Aceito, o servidor aprovou uma solicitação, mas não finalizou;
> - **3xx/Redirecionamento:** Informa a ação adicional que deve ser tomada para completar a requisição; — **301** Moved Permanently · **302** Found (encontrado), o recurso foi temporariamente alterado`,
      fonte: a6(18),
      cena: { modo: 'tabela', familia: '1,2,3' },
    },
    {
      titulo: '4xx: erro no cliente',
      texto: `
> **4xx/Erro no Cliente:** Informa que o cliente fez uma requisição que não pode ser atendida;
> - **400** Solicitação Inválida: significa que o servidor não conseguiu entender a solicitação devido o pedido de acesso ser inválido;
> - **401** Não Autorizado: a solicitação não foi aplicada porque o servidor requer credenciais de autenticação válidas;
> - **403** Proibido: é uma falha de arquivo ou permissão de acesso, que é ativada quando o servidor não reconhece ou nega a entrada no site, porque não há a permissão para isso;
> - **404** Não encontrado: indica que a URL solicitada não pode ser encontrada no servidor;`,
      fonte: a6(18),
      cena: { modo: 'tabela', familia: '4' },
    },
    {
      titulo: '5xx: erro no servidor',
      texto: `
> **5xx/Erro no servidor:** Informa que ocorreu um erro no servidor ao cumprir uma requisição válida.
> - **500** Internal Server Error: indica que o servidor encontrou uma situação que não sabe como lidar;
> - **505** Versão HTTP não suportada: aponta que a versão do HTTP usada na solicitação não é suportada pelo servidor;

Regra prática: o **primeiro dígito** diz a família. 4xx = a culpa é do pedido (cliente); 5xx = a culpa é do servidor.`,
      fonte: a6(19),
      cena: { modo: 'tabela', familia: '5' },
    },
    {
      titulo: 'Teste: peça uma página',
      texto: `
Clique nos pedidos da cena e veja qual código o servidor devolve em cada caso.`,
      fonte: a6('18–19'),
      cena: { modo: 'pedidos' },
      explorar: {
        instrucao: 'Clique nos 4 pedidos.',
        alvos: {
          ok: { titulo: 'GET /index.html → 200', texto: 'A página existe: **200 OK**, a requisição foi bem sucedida.' },
          sumiu: { titulo: 'GET /pagina-apagada → 404', texto: 'A URL não existe no servidor: **404 Não encontrado** (erro no cliente: o pedido aponta para algo que não está lá).' },
          senha: { titulo: 'GET /restrito sem login → 401', texto: 'O servidor requer credenciais: **401 Não Autorizado**.' },
          quebrou: { titulo: 'GET /relatorio → 500', texto: 'O pedido era válido, mas o programa do servidor falhou: **500 Internal Server Error**.' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada código é de qual família?',
      grupos: ['1xx Informativo', '2xx Sucesso', '3xx Redirecionamento', '4xx Erro no cliente', '5xx Erro no servidor'],
      itens: [
        { texto: '100 Continue', grupo: 0 },
        { texto: '202 Aceito', grupo: 1 },
        { texto: '301 Moved Permanently', grupo: 2 },
        { texto: '403 Proibido', grupo: 3 },
        { texto: '505 Versão HTTP não suportada', grupo: 4 },
      ],
      explicacao: 'O primeiro dígito dá a família: 1xx informativo, 2xx sucesso, 3xx redirecionamento, 4xx erro no cliente, 5xx erro no servidor.',
      fonte: a6('18–19'),
      cena: { modo: 'tabela', familia: '1,2,3,4,5', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual código indica que a URL solicitada não pode ser encontrada no servidor?',
      campos: [{ rotulo: 'Código', resposta: '404', formato: 'numero' }],
      explicacao: '**404** Não encontrado: indica que a URL solicitada não pode ser encontrada no servidor.',
      fonte: a6(18),
      cena: { modo: 'tabela', familia: '4', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O servidor exige login e o usuário não mandou credenciais. Qual código?',
      opcoes: ['401 Não Autorizado', '403 Proibido', '404 Não encontrado', '500 Internal Server Error'],
      correta: 0,
      explicacao: '**401**: a solicitação não foi aplicada porque o servidor requer credenciais de autenticação válidas. (403 é quando não há permissão mesmo.)',
      fonte: a6(18),
    },
    {
      tipo: 'escolha',
      enunciado: 'O que a família 3xx informa?',
      opcoes: [
        'A ação adicional que deve ser tomada para completar a requisição (redirecionamento)',
        'Que a requisição foi bem sucedida',
        'Que o cliente fez uma requisição que não pode ser atendida',
        'Que houve erro no servidor',
      ],
      correta: 0,
      explicacao: '**3xx/Redirecionamento**: Informa a ação adicional que deve ser tomada para completar a requisição (ex.: 301, 302).',
      fonte: a6(18),
      cena: { modo: 'tabela', familia: '3' },
    },
  ],
}

// ---------- 7.9 ----------

const fase79: Fase = {
  id: '7-9',
  titulo: 'Correio eletrônico',
  resumo: 'O endereço de e-mail, a viagem SMTP → POP3/IMAP4 e as portas atuais e obsoletas.',
  Cena: CenaEmail,
  camera: [0, 5.5, 12],
  alvoCamera: [0, 1.2, 0],
  passos: [
    {
      titulo: 'O endereço de e-mail',
      texto: `
> Um **correio eletrônico (e-mail)** é uma arquitetura de troca de mensagens que permite compor, enviar e receber mensagens através de sistemas eletrônicos de comunicação.

> O destinatário é identificado por uma *string* que contém: O endereço da caixa de correios, o símbolo de arroba e o domínio onde esta o servidor de e-mail, que contém a caixa de postal.

> Exemplo: **luftf@yahoo.com.br**, onde:
> - **luftf** → Endereço da caixa de correios.
> - **yahoo.com.br** → Domínio onde esta a caixa de correios.`,
      fonte: a6(20),
      cena: { modo: 'endereco' },
    },
    {
      titulo: 'Um serviço assíncrono',
      texto: `
> A arquitetura do serviço de e-mail usa um modo assíncrono de comunicação.

Assíncrono: o destinatário não precisa estar *on-line* quando a mensagem é enviada. Ela fica guardada no servidor dele até ser buscada.

A viagem da figura:

1. O **Cliente de e-mail Remetente** envia por **SMTP** (TCP/25) ao **Servidor de Correios do Remetente** (@gmail.com);
2. Os servidores conversam por **SMTP** (TCP/25);
3. O **Cliente de e-mail Destinatário** busca no **Servidor de Correios do Destinatário** (@yahoo.com.br) por **POP3** ou **IMAP4** (TCP/110, TCP/443).`,
      fonte: a6(21),
      cena: { modo: 'arquitetura' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'TCP/443 no POP3/IMAP4?',
          noSlide: 'A figura marca **TCP/110** e **TCP/443** do lado do POP3/IMAP4.',
          naPratica: 'A 443 é a porta do **HTTPS** (o webmail, quando você lê o e-mail pelo navegador). O próprio slide seguinte dá as portas seguras de recebimento: **995** (POP3-S) e **993** (IMAP4).',
        },
      ],
    },
    {
      titulo: 'SMTP, POP3 e IMAP4',
      texto: `
> - **SMTP** (*Simple Mail Transfer Protocol*) ➡ Protocolo usado para transferir mensagens de um cliente para o servidor ou entre servidores.
> - **POP3** (*Post Office Protocol*) ➡ Protocolo usado para transferir mensagens de uma caixa de correios para um computador local.
> - **IMAP4** (*Internet Message Access Protocol*) ➡ Alternativa para o POP3. Permite usuários manipularem mensagens sem armazenar localmente, além de outros recursos que facilitam a leitura via páginas Web.

Resumindo: **SMTP envia**; **POP3 e IMAP4 recebem**.`,
      fonte: a6(21),
      cena: { modo: 'arquitetura', destaque: 'protocolos' },
    },
    {
      titulo: 'Portas: atuais e obsoletas',
      texto: `
> Porta e Serviços:
> - **TCP/587** — servidor **SMTP-S** usado para envio de e-mails autenticados e criptografados.
> - **TCP/465** — servidor **SMTP-S** usado para envio de e-mails apenas criptografados.
> - **TCP/995** — servidor **POP3-S** usado para recebimento de e-mails autenticados/criptografado
> - **TCP/993** — servidor **IMAP4** usado para recebimento de e-mails autenticados/criptografado

> Porta e Serviços de e-mail **obsoletas**:
> - **TCP/25** — servidor **SMTP** usado para envio de e-mails.
> - **TCP/110** — servidor **POP3** usado para recebimento de e-mails
> - **TCP/143** — servidor **IMAP4** usado para recebimento.`,
      fonte: a6(22),
      cena: { modo: 'portas' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'A porta 25 é obsoleta?',
          noSlide: 'TCP/25 aparece entre as portas **obsoletas**.',
          naPratica: 'Para o **cliente enviar** e-mail, sim: hoje se usa 587 ou 465. Mas **entre servidores** (como na figura da p. 21) a porta 25 continua sendo a usada.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Em luftf@yahoo.com.br, o que é “luftf”?',
      opcoes: ['O endereço da caixa de correios', 'O domínio do servidor de e-mail', 'A senha do usuário', 'O protocolo usado'],
      correta: 0,
      explicacao: '**luftf** → Endereço da caixa de correios. **yahoo.com.br** → Domínio onde está a caixa de correios.',
      fonte: a6(20),
      cena: { modo: 'endereco' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada protocolo é de envio ou de recebimento?',
      grupos: ['Envio', 'Recebimento'],
      itens: [
        { texto: 'SMTP', grupo: 0 },
        { texto: 'SMTP-S', grupo: 0 },
        { texto: 'POP3', grupo: 1 },
        { texto: 'IMAP4', grupo: 1 },
      ],
      explicacao: 'SMTP transfere mensagens do cliente para o servidor ou entre servidores (envio). POP3 e IMAP4 levam a mensagem da caixa de correios até o usuário (recebimento).',
      fonte: a6(21),
      cena: { modo: 'arquitetura', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual protocolo permite manipular as mensagens sem armazenar localmente?',
      opcoes: ['IMAP4', 'POP3', 'SMTP', 'FTP'],
      correta: 0,
      explicacao: '**IMAP4**: alternativa para o POP3. Permite usuários manipularem mensagens sem armazenar localmente. O POP3 transfere para o computador local.',
      fonte: a6(21),
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada porta ao serviço (slide de portas).',
      grupos: ['SMTP-S', 'POP3-S', 'IMAP4'],
      itens: [
        { texto: 'TCP/587', grupo: 0 },
        { texto: 'TCP/465', grupo: 0 },
        { texto: 'TCP/995', grupo: 1 },
        { texto: 'TCP/993', grupo: 2 },
        { texto: 'TCP/143 (obsoleta)', grupo: 2 },
      ],
      explicacao: 'SMTP-S: 587 (autenticados e criptografados) e 465 (apenas criptografados). POP3-S: 995. IMAP4: 993 (e 143, obsoleta).',
      fonte: a6(22),
      cena: { modo: 'portas', semNumeros: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que significa o e-mail usar um modo assíncrono de comunicação?',
      opcoes: [
        'O destinatário não precisa estar on-line no momento do envio: a mensagem fica no servidor até ser buscada',
        'Remetente e destinatário precisam estar conectados ao mesmo tempo',
        'A mensagem é enviada byte a byte',
        'Não usa TCP',
      ],
      correta: 0,
      explicacao: 'A arquitetura do e-mail usa um modo **assíncrono**: a mensagem fica guardada no servidor do destinatário até ele buscar por POP3/IMAP4.',
      fonte: a6(21),
      cena: { modo: 'arquitetura' },
    },
  ],
}

// ---------- 7.10 ----------

const fase710: Fase = {
  id: '7-10',
  titulo: 'Transferência de arquivos (FTP)',
  resumo: 'Os dois canais do FTP: controle na porta 21 e dados na porta 20.',
  Cena: CenaFtp,
  camera: [0, 5, 11],
  alvoCamera: [0, 1.2, 0],
  passos: [
    {
      titulo: 'FTP',
      texto: `
> O Serviço de transferência de arquivos na Internet usa o protocolo **FTP** (*File Transfer Protocol*).

Entre o **Cliente FTP** e o **Servidor FTP** há a “Conexão usada para transferir os arquivos”.`,
      fonte: a6(23),
      cena: { modo: 'conexao' },
    },
    {
      titulo: 'Dois canais',
      texto: `
> - **Clientes FTP:** Programas que controlam a transferência de arquivos armazenado no servidor usando o protocolo **FTP-CONTROL**.
> - **Servidores FTP:** Permite que os arquivos em disco sejam acessados e copiados usando o protocolo **FTP-DATA**.

> O servidor FTP utiliza dois protocolos:
> - **TCP/21 — FTP-CONTROL** ➡ Permite o uso de comandos para controle interativo da transferência
> - **TCP/20 — FTP-DATA** ➡ Usado para transferência dos arquivos.

Na cena: pelo tubo de cima (21) passam os **comandos**; pelo de baixo (20) passam os **arquivos**.`,
      fonte: a6(24),
      cena: { modo: 'canais' },
    },
    {
      titulo: 'Comandar de um lado, dados de outro',
      texto: `
> Sendo as portas de controle e de dados canais separados, é possível enviar os comandos a partir de uma máquina e receber os dados a partir de outra.

Na figura, o **Cliente FTP** manda **FTP-CONTROL** para os dois **Servidores FTP**, e o **FTP-DATA** vai direto de um servidor para o outro.`,
      fonte: a6(25),
      cena: { modo: 'tres' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'FXP',
          texto: 'Essa cópia direta entre dois servidores comandada por um terceiro se chama **FXP** (*File eXchange Protocol*). Hoje quase todos os servidores bloqueiam, por segurança. Isso não está no slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada item é do FTP-CONTROL ou do FTP-DATA?',
      grupos: ['FTP-CONTROL', 'FTP-DATA'],
      itens: [
        { texto: 'TCP/21', grupo: 0 },
        { texto: 'Comandos para controle interativo da transferência', grupo: 0 },
        { texto: 'TCP/20', grupo: 1 },
        { texto: 'Transferência dos arquivos', grupo: 1 },
      ],
      explicacao: 'TCP/21 FTP-CONTROL: comandos para controle interativo. TCP/20 FTP-DATA: transferência dos arquivos.',
      fonte: a6(24),
      cena: { modo: 'canais', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual porta TCP o FTP usa para os comandos (FTP-CONTROL)?',
      campos: [{ rotulo: 'TCP/', resposta: '21', formato: 'numero' }],
      explicacao: '**TCP/21** — FTP-CONTROL. A porta 20 é a do FTP-DATA.',
      fonte: a6(24),
      cena: { modo: 'canais', semNumeros: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que é possível mandar os comandos de uma máquina e receber os dados em outra?',
      opcoes: [
        'Porque as portas de controle e de dados são canais separados',
        'Porque o FTP usa UDP',
        'Porque o servidor não precisa de porta',
        'Porque o FTP é criptografado',
      ],
      correta: 0,
      explicacao: '“Sendo as portas de controle e de dados **canais separados**, é possível enviar os comandos a partir de uma máquina e receber os dados a partir de outra.”',
      fonte: a6(25),
      cena: { modo: 'tres' },
    },
  ],
}

// ---------- 7.11 ----------

const fase711: Fase = {
  id: '7-11',
  titulo: 'Acesso remoto: TELNET, SSH e RDP',
  resumo: 'Terminal local e remoto, o TELNET em texto puro, o SSH com criptografia e túnel, e o RDP.',
  Cena: CenaRemoto,
  camera: [0, 5, 12],
  alvoCamera: [0, 1.4, 0],
  passos: [
    {
      titulo: 'Serviço de acesso remoto',
      texto: `
> O serviço de acesso remoto permite conectar-se (fazer *logon*) e usar os recursos computacionais de um computador remoto.
> - O *host* do cliente é chamado “**terminal local**” enquanto o Servidor tem o nome de “**terminal remoto**”.
> - Todos os comandos/programas são executados no computador remoto. O computador local é usado apenas para digitação (terminal virtual).

Na figura: “O texto digitado é enviado para o servidor” → “Comando processado no servidor” → “O resultado é ecoado para o cliente”.`,
      fonte: a6('26–27'),
      cena: { modo: 'terminal' },
    },
    {
      titulo: 'Protocolos de acesso remoto',
      texto: `
> Existem diversos protocolos que possibilitam o acesso remoto:
> - **TCP/23 — TELNET** ➡ Protocolo tradicional usado na Internet.
> - **TCP/22 — SSH** ➡ Protocolo que permite o uso de criptografia.
> - **TCP/3389 — RDP** ➡ Protocolo de Acesso Remoto que transfere a interface gráfica.`,
      fonte: a6(27),
      cena: { modo: 'portas' },
    },
    {
      titulo: 'TELNET',
      texto: `
> Protocolo de terminal remoto simples em modo texto, que permite o login em um *host* através da rede de forma transparente (o usuário tem a impressão de que o teclado e vídeo estão diretamente conectado na máquina remota).
> - 1º protocolo de aplicação demonstrado na ARPANet – RFC 97 (1971);
> - Faz a emulação de terminal VT 100;
> - Usa a porta **TCP/23**;

> Características:
> - Trata a conexão de forma simétrica, ou seja, não obriga que a entrada de cliente venha de um teclado, nem força o cliente a exibir a saída em uma tela, o que permite que um programa arbitrário se torne um cliente.
> - Envia **byte a byte** cada caractere digitado para o servidor, ou seja, todos caracteres recebidos pela rede são ecoados no monitor.

Repare na cena: cada letra viaja **sozinha e legível** pelo cabo.`,
      fonte: a6('28–29'),
      cena: { modo: 'telnet' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Por que o TELNET caiu em desuso',
          texto: 'Como tudo vai em texto puro, inclusive a **senha**, qualquer um que capture o tráfego lê o que foi digitado. Por isso ele foi trocado pelo SSH. Isso não está no slide.',
        },
      ],
    },
    {
      titulo: 'SSH: as duas melhorias',
      texto: `
> O **SSH** Permite estabelecer uma conexão com um terminal remoto através de login, sendo que possuí duas melhorias em relação ao TELNET:
> - 1º) Oferece comunicação segura usando um mecanismo de criptografia próprio.
> - 2º) Permite fazer transferências de dados adicionais e independentes pela mesma conexão que é usada para o login remoto.

> OBS: O SSH utiliza conexão/porta: **TCP/22**

> **Criptografia:** Técnica que permite a comunicação segura através da codificação da mensagem.

Na cena: o “Texto Claro Legível” (*Aula de Segurança de Redes*) passa pela **CIFRAGEM**, viaja como “Texto Cifrado Criptografado” na Conexão TCP/22 e passa pela **DECIFRAGEM** do outro lado.`,
      fonte: a6('30–31'),
      cena: { modo: 'ssh' },
    },
    {
      titulo: 'Os três mecanismos do SSH',
      texto: `
> O SSH oferece três mecanismos que formam a base dos serviços que ele oferece:
> - Mecanismo que fornece **autenticação de servidor**, confidencialidade de dados e integridade de dados com privacidade de encaminhamento (**criptografia**).
> - Um mecanismo de **autenticação de usuário** que autentica o usuário para o servidor.
> - Mecanismo de conexão que **multiplexa** diversos canais de comunicação lógicos através de uma única conexão SSH.

> **Multiplexação:** É a capacidade de enviar mais de um sinal em uma única linha ou conexão.`,
      fonte: a6(31),
      cena: { modo: 'multiplexacao' },
    },
    {
      titulo: 'VPN com túnel SSH',
      texto: `
> **VPN:** Rede Privada Virtual é uma técnica que permite o tráfego de dados de forma segura usando um rede pública não segura.

Na figura: a rede da esquerda liga no **Roteador Cliente SSH**, a da direita no **Roteador Servidor SSH**, e entre eles passa um **Túnel SSH** pela **Internet**. Quem está fora do túnel só vê dados cifrados.`,
      fonte: a6(32),
      cena: { modo: 'vpn' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada protocolo de acesso remoto à porta TCP.',
      grupos: ['TCP/23', 'TCP/22', 'TCP/3389'],
      itens: [
        { texto: 'TELNET', grupo: 0 },
        { texto: 'SSH', grupo: 1 },
        { texto: 'RDP', grupo: 2 },
      ],
      explicacao: 'TCP/23 TELNET (tradicional) · TCP/22 SSH (criptografia) · TCP/3389 RDP (interface gráfica).',
      fonte: a6(27),
      cena: { modo: 'portas', semNumeros: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'No acesso remoto, onde os comandos são executados?',
      opcoes: [
        'No computador remoto; o local é usado apenas para digitação',
        'No computador local',
        'No roteador',
        'Metade em cada computador',
      ],
      correta: 0,
      explicacao: '“Todos os comandos/programas são executados no computador **remoto**. O computador local é usado apenas para digitação (terminal virtual).”',
      fonte: a6(26),
      cena: { modo: 'terminal' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Quais são as duas melhorias do SSH em relação ao TELNET?',
      opcoes: [
        'Criptografia própria e transferências de dados adicionais pela mesma conexão do login',
        'Interface gráfica e uso do UDP',
        'Emulação de VT 100 e envio byte a byte',
        'Porta 23 e conexão simétrica',
      ],
      correta: 0,
      explicacao: '1º) comunicação segura com criptografia própria; 2º) transferências de dados adicionais e independentes pela mesma conexão do login remoto.',
      fonte: a6(30),
      cena: { modo: 'ssh' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é do TELNET ou do SSH?',
      grupos: ['TELNET', 'SSH'],
      itens: [
        { texto: 'Emulação de terminal VT 100', grupo: 0 },
        { texto: '1º protocolo de aplicação na ARPANet (RFC 97)', grupo: 0 },
        { texto: 'Envia byte a byte cada caractere', grupo: 0 },
        { texto: 'Multiplexa vários canais numa única conexão', grupo: 1 },
        { texto: 'Autenticação de servidor e de usuário', grupo: 1 },
      ],
      explicacao: 'TELNET: TCP/23, RFC 97 (1971), VT 100, simétrico, byte a byte. SSH: TCP/22, criptografia, autenticação de servidor e de usuário, multiplexação.',
      fonte: a6('28–31'),
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é uma VPN, segundo o slide?',
      opcoes: [
        'Técnica que permite o tráfego de dados de forma segura usando uma rede pública não segura',
        'Um servidor que guarda páginas em cache',
        'Uma rede sem fio de longa distância',
        'Um protocolo de envio de e-mail',
      ],
      correta: 0,
      explicacao: '**VPN**: Rede Privada Virtual é uma técnica que permite o tráfego de dados de forma segura usando uma rede pública não segura (na figura, um túnel SSH pela Internet).',
      fonte: a6(32),
      cena: { modo: 'vpn' },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'classificar',
    enunciado: 'Ligue cada porta TCP ao serviço.',
    grupos: ['HTTP', 'HTTPS', 'SSH', 'FTP-DATA', 'RDP'],
    itens: [
      { texto: '80', grupo: 0 },
      { texto: '443', grupo: 1 },
      { texto: '22', grupo: 2 },
      { texto: '20', grupo: 3 },
      { texto: '3389', grupo: 4 },
    ],
    explicacao: 'TCP/80 HTTP · TCP/443 HTTPS · TCP/22 SSH · TCP/20 FTP-DATA · TCP/3389 RDP.',
    fonte: a6('17, 24, 27'),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual código HTTP significa “Internal Server Error”?',
    opcoes: ['500', '404', '200', '301'],
    correta: 0,
    explicacao: '**500** Internal Server Error: o servidor encontrou uma situação que não sabe como lidar.',
    fonte: a6(19),
  },
  {
    tipo: 'escolha',
    enunciado: 'Uma chamada de voz pela Internet (VoIP) prefere qual protocolo de transporte?',
    opcoes: ['UDP', 'TCP', 'ICMP', 'SMTP'],
    correta: 0,
    explicacao: 'O slide cita **VoIP** entre os usos do UDP: “É usado quando se quer melhores tempo de resposta.”',
    fonte: a6(11),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual é a faixa de valores de uma porta?',
    opcoes: ['De 0 a 65535', 'De 0 a 255', 'De 1 a 1024', 'De 0 a 4.294.967.295'],
    correta: 0,
    explicacao: 'Porta é “um número entre **0 e 65535** que identifica o processo que está se comunicando em cada *host*” (16 bits).',
    fonte: a6(9),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual protocolo foi o 1º protocolo de aplicação demonstrado na ARPANet?',
    opcoes: ['TELNET', 'SSH', 'HTTP', 'FTP'],
    correta: 0,
    explicacao: '**TELNET**: 1º protocolo de aplicação demonstrado na ARPANet – RFC 97 (1971).',
    fonte: a6(28),
  },
]

export const trilha7: Trilha = {
  id: 't7',
  numero: 7,
  titulo: 'Protocolos e Serviços Internet',
  aula: 'Aula 06 · Protocolos e Serviços Internet',
  cor: '#c2408f',
  disponivel: true,
  fases: [fase71, fase72, fase73, fase74, fase75, fase76, fase77, fase78, fase79, fase710, fase711],
  chefaoExtras: extras,
}
