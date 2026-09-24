import type { Fase, Questao, Trilha } from '../../engine/tipos'
import { CenaAbrangencia } from './cenas/Abrangencia'
import { CenaComutacao, ORDEM_DE_CHEGADA } from './cenas/Comutacao'
import { CenaConexoes } from './cenas/Conexoes'
import { CenaEnlace } from './cenas/Enlace'
import { CenaInternet } from './cenas/Internet'
import { CenaTopologias } from './cenas/Topologias'

// Trilha 2 — Classificação das redes. Fonte única: REDES-02_Classifica.pdf (19 páginas,
// 2 slides por página). Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const AULA = 'Aula 02'
const f = (pagina: number | string) => ({ aula: AULA, pagina })

const fase21: Fase = {
  id: '2-1',
  titulo: 'Abrangência: da mesa ao planeta',
  resumo: 'PAN, LAN, MAN, WAN e Internet; redes sem fio WPAN e WLAN.',
  Cena: CenaAbrangencia,
  camera: [0, 7.5, 13.5],
  passos: [
    {
      titulo: 'Classificar pelo tamanho',
      texto: `
A Aula 02 classifica as redes por vários critérios. O primeiro é a **abrangência**:

> É o critério usado para classificar as redes dependendo do seu tamanho e a organização física.

A tabela à esquerda é a do slide: do tamanho de uma **mesa** (1 metro) até o **planeta** (10.000 Km). Nesta fase a câmera vai se afastando, nível por nível, como se você subisse num foguete.

Você também pode **clicar em qualquer linha da tabela** para viajar até aquele nível.`,
      fonte: f(2),
      cena: { nivel: 0 },
    },
    {
      titulo: 'Redes Pessoais: mesa e casa',
      texto: `
As duas primeiras linhas da tabela são as **Redes Pessoais**:

- **1 metro** → Mesa
- **70 metros** → Casa

Veja o afastamento: a mesa virou um pontinho dentro de um cômodo da casa. Uma rede pessoal liga os aparelhos de **uma pessoa**, bem pertinho dela.`,
      fonte: f(2),
      cena: { nivel: 1 },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'A casa inteira é “rede pessoal”?',
          noSlide: 'Mesa (1 m) e casa (70 m) são Redes Pessoais.',
          naPratica: 'Nos livros de redes, a rede pessoal (PAN) costuma ir só até uns poucos metros em volta da pessoa. O Wi-Fi que cobre a casa toda é tratado como rede local sem fio (WLAN). Na prova, responda com a tabela do slide.',
        },
      ],
    },
    {
      titulo: 'LAN: a rede do edifício',
      texto: `
**LAN** (*Local Area Network*):

> “A **rede de área local** é a responsável pela comunicação entre computadores em uma área restrita (de forma geral em um único prédio).”

> “Dependendo das necessidades da empresa, ou do tipo de tecnologia usada, uma LAN pode ser muito simples, ou muito complexa e cara.”

No último andar do prédio (aberto, como no desenho do slide) está a LAN do escritório: computadores, servidor e impressora ligados a um switch.`,
      fonte: f(3),
      cena: { nivel: 2 },
    },
    {
      titulo: 'Características da LAN',
      texto: `
Na tabela, **edifício (100 metros)** e **campus (1 Km)** são **Redes Locais**. Agora o prédio é só um dos edifícios do campus.

Características da LAN, segundo o slide:

- Conectam dispositivos **fisicamente adjacentes**;
- **Administradas e controladas localmente**;
- Possibilitam uma **grande taxa de transmissão**, visto que, fisicamente, a menor distância resulta em um melhor nível do sinal (**menor interferência**).`,
      fonte: f('2–3'),
      cena: { nivel: 3 },
    },
    {
      titulo: 'MAN: do tamanho de uma cidade',
      texto: `
**MAN** (*Metropolitan Area Network*):

> “Redes de Área Metropolitana tem a dimensão de uma cidade.”

Características:

- Projetadas para conectar **pontos espalhados numa cidade**;
- Possuem **taxas de erros MAIORES** do que as LANs.

Exemplos do slide: **banco com várias sucursais**, **companhia telefônica** (acesso à Internet) e **televisão a cabo**. As quatro torres coloridas ligadas pelo alto são o banco e suas sucursais, como no desenho do slide.`,
      fonte: f(4),
      cena: { nivel: 4 },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'LAN × MAN na prova',
          texto: 'LAN tem **grande taxa de transmissão** (distância curta, menos interferência). MAN tem **taxa de erros maior** que a LAN. Não troque os dois.',
        },
      ],
    },
    {
      titulo: 'WAN: país e continente',
      texto: `
**WAN** (*Wide Area Network*):

> “Uma **Rede Geograficamente Distribuída** abrange uma ampla área, com frequência um país ou continente.”

Na tabela: **país (100 Km)** e **continente (1.000 Km)**. Características:

- Fornecem **conectividade ininterrupta** (alta disponibilidade);
- Consiste em **dois componentes distintos**: **linhas de transmissão** e **equipamentos de conexão (Roteadores)**.

No mapa, as linhas vermelhas são as linhas de transmissão e os cilindros com a cruz branca são os roteadores, como no mapa do Brasil do slide.`,
      fonte: f('2, 4'),
      cena: { nivel: 5 },
    },
    {
      titulo: 'Planeta: a Internet',
      texto: `
Última linha da tabela: **10.000 Km → Planeta → Internet**.

A cidade, o país e o continente viraram pontinhos. No planeta inteiro, as redes estão **interligadas**, e os envelopes dão a volta ao mundo, como no globo do slide.

O que é a Internet (e por que ela **não** é a mesma coisa que a WEB) é a próxima fase.`,
      fonte: f(2),
      cena: { nivel: 7 },
    },
    {
      titulo: 'Redes sem fio: WPAN',
      texto: `
**Redes Sem Fio (*Wireless*):**

> Usam como meio de transmissão sinais eletromagnéticos enviados/recebidos “no ar”

**WPAN** = **Redes Pessoais SEM-FIO**:

- Interligam dispositivos **fisicamente próximos**;
- Ideal para **eliminar os cabos** usados em teclados, impressoras, etc.;
- Exemplo de protocolo usado: **BLUETOOTH**.

De volta à mesa: teclado, mouse e impressora falam com o computador pelo ar.`,
      fonte: f(5),
      cena: { nivel: 0, semFio: 'wpan' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Aula 01',
          texto: 'Na Aula 01, **bluetooth** e **wifi** aparecem como protocolos **de baixo nível** (entre dispositivos). Aqui eles são os exemplos de protocolo da WPAN e da WLAN.',
        },
      ],
    },
    {
      titulo: 'Redes sem fio: WLAN',
      texto: `
**WLAN** = **Redes Locais SEM-FIO**:

- **Reduzem o tempo de configuração** de novas posições de trabalho (basta chegar com o notebook, sem puxar cabo novo);
- **Ponto de Acesso** (AP, *Access Point*): equipamento usado para conectar os elementos na rede;
- Exemplo de protocolo: **WIFI**.

No escritório, o AP na parede espalha o sinal para os notebooks.`,
      fonte: f(5),
      cena: { nivel: 2, semFio: 'wlan' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Segundo a tabela do slide, classifique cada abrangência.',
      grupos: ['Pessoal', 'Local', 'Metropolitana', 'Geog. distribuída'],
      itens: [
        { texto: 'Mesa (1 metro)', grupo: 0 },
        { texto: 'Casa (70 metros)', grupo: 0 },
        { texto: 'Edifício (100 metros)', grupo: 1 },
        { texto: 'Campus (1 Km)', grupo: 1 },
        { texto: 'Cidade (10 Km)', grupo: 2 },
        { texto: 'País (100 Km)', grupo: 3 },
        { texto: 'Continente (1.000 Km)', grupo: 3 },
      ],
      explicacao: 'Tabela do slide: mesa e casa → **Redes Pessoais**; edifício e campus → **Redes Locais**; cidade → **Metropolitana**; país e continente → **Geograficamente distribuídas**; planeta → **Internet**.',
      fonte: f(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na tabela de abrangência, o que corresponde a 10.000 Km (planeta)?',
      opcoes: ['Internet', 'WAN', 'MAN', 'WLAN'],
      correta: 0,
      explicacao: 'A última linha da tabela: **10.000 Km → Planeta → Internet**. País e continente são as redes geograficamente distribuídas (WAN).',
      fonte: f(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que as LANs possibilitam uma grande taxa de transmissão?',
      opcoes: [
        'Porque a menor distância resulta em um melhor nível do sinal (menor interferência)',
        'Porque usam sempre fibra ótica',
        'Porque são administradas por uma companhia telefônica',
        'Porque usam roteadores e linhas de transmissão',
      ],
      correta: 0,
      explicacao: 'Slide: “Possibilitam uma **grande taxa de transmissão**, visto que, fisicamente, a menor distância resulta em um melhor nível do sinal (menor interferência).”',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual tipo de rede possui taxas de erros MAIORES do que as LANs?',
      opcoes: ['MAN', 'WPAN', 'WLAN', 'Nenhuma: as LANs têm a maior taxa de erros'],
      correta: 0,
      explicacao: 'Características da **MAN**: projetadas para conectar pontos espalhados numa cidade e possuem **taxas de erros MAIORES** do que as LANs.',
      fonte: f(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes é um exemplo de MAN citado no slide?',
      opcoes: ['Banco com várias sucursais', 'Teclado e mouse sem fio', 'Escritório num único prédio', 'Rede ligando vários países'],
      correta: 0,
      explicacao: 'Exemplos de MAN: **banco com várias sucursais**, companhia telefônica (acesso à Internet) e televisão a cabo.',
      fonte: f(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, uma WAN consiste em quais dois componentes distintos?',
      opcoes: [
        'Linhas de transmissão e equipamentos de conexão (roteadores)',
        'Computadores e impressoras',
        'Pontos de acesso e bluetooth',
        'Concentrador e terminais',
      ],
      correta: 0,
      explicacao: 'WAN: fornece conectividade ininterrupta (alta disponibilidade) e consiste em dois componentes distintos: **linhas de transmissão** e **equipamentos de conexão (Roteadores)**.',
      fonte: f(4),
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é da WPAN ou da WLAN?',
      grupos: ['WPAN', 'WLAN'],
      itens: [
        { texto: 'Exemplo de protocolo: Bluetooth', grupo: 0 },
        { texto: 'Elimina os cabos de teclados e impressoras', grupo: 0 },
        { texto: 'Exemplo de protocolo: Wi-Fi', grupo: 1 },
        { texto: 'Usa um Ponto de Acesso (AP)', grupo: 1 },
        { texto: 'Reduz o tempo de configuração de novas posições de trabalho', grupo: 1 },
      ],
      explicacao: '**WPAN** (redes pessoais sem fio): dispositivos próximos, elimina cabos de teclados e impressoras, **Bluetooth**. **WLAN** (redes locais sem fio): reduz o tempo de configuração de novas posições de trabalho, usa **Ponto de Acesso**, **Wi-Fi**.',
      fonte: f(5),
    },
  ],
}

const fase22: Fase = {
  id: '2-2',
  titulo: 'Internet × WEB',
  resumo: 'Não são sinônimos: redes interligadas × aplicações.',
  Cena: CenaInternet,
  camera: [0, 8, 13.5],
  passos: [
    {
      titulo: 'Internet: redes interligadas',
      texto: `
> **INTERNET** → “Conjunto de redes interligadas espalhadas pelo mundo. Todos os serviços disponíveis seguem o mesmo padrão e utilizam o conjunto de protocolos (TCP/IP).”

Na cena, cada bairro é **uma rede**, com seu roteador. Os cabos entre os roteadores juntam essas redes numa só: isso é a Internet. Todos os caminhões seguem as mesmas regras (**TCP/IP**), por isso qualquer rede entende qualquer outra.`,
      fonte: f(6),
      cena: { foco: 'internet' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'TCP/IP você já viu',
          texto: 'Na Aula 01, **TCP/IP** é o primeiro exemplo de protocolo **de alto nível** (entre aplicações, disponibilizado pelo sistema operacional).',
        },
      ],
    },
    {
      titulo: 'WEB: as aplicações',
      texto: `
> **WEB** → “Conjunto de aplicações disponíveis aos usuários.”

Agora apareceram as **aplicações** em cima de cada rede. Um jeito de lembrar: a **Internet** são as ruas e os caminhões; a **WEB** são os serviços que você usa por essas ruas.`,
      fonte: f(6),
      cena: { foco: 'web' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'Internet e WEB não são sinônimos',
          texto: 'Frase em destaque no slide. **Internet** = conjunto de **redes** interligadas (TCP/IP). **WEB** = conjunto de **aplicações** disponíveis aos usuários.',
        },
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O que entra na “WEB”',
          noSlide: 'WEB é o conjunto de aplicações disponíveis aos usuários, incluindo e-mail, chats, transferência de arquivos e logon remoto.',
          naPratica: 'Fora do curso, “Web” (WWW) costuma significar só o serviço de páginas acessadas pelo navegador; e-mail, chat e acesso remoto são outros serviços da Internet. Na prova, use a definição do slide.',
        },
      ],
    },
    {
      titulo: 'Aplicações tradicionais',
      texto: `
O slide lista as **aplicações tradicionais WEB na Internet**. Cada uma está num servidor de uma das redes.`,
      fonte: f(6),
      cena: { foco: 'apps' },
      explorar: {
        instrucao: 'Clique nos 5 servidores marcados com “?” para descobrir as aplicações.',
        alvos: {
          web: { titulo: '1. Páginas webs (web)', texto: 'Os sites que você abre no navegador.' },
          email: { titulo: '2. Correio eletrônico (e-mail)', texto: 'Mensagens enviadas para uma caixa postal, que o destinatário lê quando quiser.' },
          chat: { titulo: '3. Conversas online (chats)', texto: 'Troca de mensagens em tempo real.' },
          arquivos: { titulo: '4. Transferência de arquivos', texto: 'Enviar e baixar arquivos entre computadores.' },
          remoto: { titulo: '5. Logon remoto (acesso remoto)', texto: 'Usar outro computador à distância, como se estivesse na frente dele.' },
        },
      },
    },
    {
      titulo: 'Juntando as duas ideias',
      texto: `
- Pergunta fala em **redes interligadas**, **mundo** ou **TCP/IP** → é a **Internet**.
- Pergunta fala em **aplicações disponíveis aos usuários** → é a **WEB**.

As aplicações (WEB) só funcionam porque existe a Internet por baixo, levando os dados de uma rede para outra.`,
      fonte: f(6),
      cena: { foco: 'tudo' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: '“Conjunto de redes interligadas espalhadas pelo mundo.” Essa é a definição de:',
      opcoes: ['Internet', 'WEB', 'WAN', 'MAN'],
      correta: 0,
      explicacao: '**INTERNET** → “Conjunto de redes interligadas espalhadas pelo mundo. Todos os serviços disponíveis seguem o mesmo padrão e utilizam o conjunto de protocolos (TCP/IP).”',
      fonte: f(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, o que é a WEB?',
      opcoes: [
        'Conjunto de aplicações disponíveis aos usuários',
        'Conjunto de redes interligadas espalhadas pelo mundo',
        'O conjunto de protocolos TCP/IP',
        'Um sinônimo de Internet',
      ],
      correta: 0,
      explicacao: '**WEB** → “Conjunto de aplicações disponíveis aos usuários.” E o slide destaca: **Internet e WEB não são sinônimos**.',
      fonte: f(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Todos os serviços da Internet seguem o mesmo padrão e utilizam qual conjunto de protocolos?',
      opcoes: ['TCP/IP', 'NETBIOS', 'Bluetooth', 'IPX/SPX'],
      correta: 0,
      explicacao: 'Definição de Internet no slide: “…utilizam o conjunto de protocolos (**TCP/IP**).”',
      fonte: f(6),
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada frase descreve a Internet ou a WEB?',
      grupos: ['Internet', 'WEB'],
      itens: [
        { texto: 'Redes interligadas espalhadas pelo mundo', grupo: 0 },
        { texto: 'Usa o conjunto de protocolos TCP/IP', grupo: 0 },
        { texto: 'Aplicações disponíveis aos usuários', grupo: 1 },
        { texto: 'Páginas, e-mail, chats, transferência de arquivos e logon remoto', grupo: 1 },
      ],
      explicacao: '**Internet** = as redes interligadas (TCP/IP). **WEB** = as aplicações que o usuário usa: páginas, e-mail, chats, transferência de arquivos e logon remoto.',
      fonte: f(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destas NÃO está na lista de aplicações tradicionais WEB do slide?',
      opcoes: ['Impressão local por cabo USB', 'Logon remoto (acesso remoto)', 'Transferência de arquivos', 'Correio eletrônico (e-mail)'],
      correta: 0,
      explicacao: 'A lista do slide: 1. páginas webs, 2. correio eletrônico, 3. conversas online (chats), 4. transferência de arquivos, 5. logon remoto (acesso remoto).',
      fonte: f(6),
    },
  ],
}

const fase23: Fase = {
  id: '2-3',
  titulo: 'Conexões e endereçamento',
  resumo: 'Ponto a ponto × difusão; unicast, multicast e broadcast.',
  Cena: CenaConexoes,
  camera: [0, 10, 10],
  passos: [
    {
      titulo: '❶ Ponto a ponto',
      texto: `
**Tecnologias de transmissão:**

> A tecnologia usada no meio de transmissão determina a quantidade de pontos de conexão entre os dispositivos

**❶ Ponto a Ponto:** fornece um **enlace dedicado entre dois dispositivos**.

- Consistem em conexões entre **pares individuais**.
- Para ir da origem ao destino, **nós intermediários** precisam ser usados.

Veja: A não tem cabo até C. O caminhão para em **B**, que repassa para C.`,
      fonte: f(7),
      cena: { modo: 'ponto' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: '“Ponto a ponto” tem três sentidos no material',
          texto: 'Aula 01: **Redes Ponto-a-Ponto** = arquitetura descentralizada (grupo de trabalho). Aula 02 (aqui): **enlace dedicado entre dois dispositivos**. Aula 05: comunicação ponto a ponto entre roteadores. Leia o contexto da questão.',
        },
      ],
    },
    {
      titulo: '❷ Difusão (ponto-multiponto)',
      texto: `
**❷ Difusão (Ponto-Multiponto):** um **único enlace é compartilhado** por todos os participantes da rede.

- O sinal enviado é **recebido por todos** os outros computadores conectados ao mesmo meio de transmissão.

A resposta sai de A, corre pelo cabo para os dois lados e acende a tela de todo mundo. O slide resume a comparação assim:

- **Ponto-a-ponto** → **um** receptor do sinal;
- **Difusão** → **vários** receptores do sinal.`,
      fonte: f(8),
      cena: { modo: 'difusao' },
    },
    {
      titulo: 'Endereçamento ❶ Unicast',
      texto: `
**Classificação quanto ao endereçamento:** os dispositivos podem ser endereçados de **três formas**. Os desenhos do slide usam quatro computadores (A, B, C e D) num mesmo cabo, e A sempre envia.

> ❶ **UNICAST** → A informação é endereçada apenas para **um único destinatário**.

Só a tela de **D** acende.`,
      fonte: f(9),
      cena: { modo: 'unicast' },
    },
    {
      titulo: '❷ Multicast',
      texto: `
> ❷ **MULTICAST** → A transmissão é feita para um **grupo específico** de destinatários.

O grupo aqui é **C e D**. No slide, o **B** aparece pintado de preto: ele está **fora do grupo** e não recebe.`,
      fonte: f(10),
      cena: { modo: 'multicast' },
    },
    {
      titulo: '❸ Broadcast',
      texto: `
> ❸ **BROADCAST** → A transmissão é endereçada à **todos** os destinatários.

B, C e D recebem.

Para decorar: **uni** = um, **multi** = um grupo, **broad** (amplo) = todos.`,
      fonte: f(10),
      cena: { modo: 'broadcast' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'O broadcast volta nas próximas aulas',
          texto: 'Na Aula 03 você vai calcular o **endereço de broadcast** de uma rede IP: o endereço usado para falar com todos os hosts dela.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual tecnologia de transmissão “fornece um enlace dedicado entre dois dispositivos”?',
      opcoes: ['Ponto a ponto', 'Difusão (ponto-multiponto)', 'Broadcast', 'Multicast'],
      correta: 0,
      explicacao: '**Ponto a Ponto**: enlace dedicado entre dois dispositivos; conexões entre pares individuais; nós intermediários são usados para ir da origem ao destino.',
      fonte: f(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na tecnologia ponto a ponto, como a mensagem vai da origem até um destino que não está ligado diretamente a ela?',
      opcoes: [
        'Passando por nós intermediários',
        'Pelo cabo compartilhado, que entrega para todos',
        'Por broadcast',
        'Não é possível',
      ],
      correta: 0,
      explicacao: 'Slide: “Para ir da origem ao destino, **nós intermediários** precisam ser usados.”',
      fonte: f(7),
    },
    {
      tipo: 'escolha',
      enunciado: '“Um único enlace é compartilhado por todos os participantes da rede.” Isso é:',
      opcoes: ['Difusão (ponto-multiponto)', 'Ponto a ponto', 'Unicast', 'Full-duplex'],
      correta: 0,
      explicacao: '**Difusão (Ponto-Multiponto)**: um único enlace compartilhado; o sinal enviado é recebido por todos os outros computadores conectados ao mesmo meio. Vários receptores do sinal.',
      fonte: f(8),
    },
    {
      tipo: 'classificar',
      enunciado: 'A envia. Classifique cada situação quanto ao endereçamento.',
      grupos: ['Unicast', 'Multicast', 'Broadcast'],
      itens: [
        { texto: 'A → D (só D)', grupo: 0 },
        { texto: 'A → C e D (B fica de fora)', grupo: 1 },
        { texto: 'A → B, C e D', grupo: 2 },
        { texto: 'Endereçada a um único destinatário', grupo: 0 },
        { texto: 'Feita para um grupo específico de destinatários', grupo: 1 },
        { texto: 'Endereçada a todos os destinatários', grupo: 2 },
      ],
      explicacao: '**Unicast** → um único destinatário. **Multicast** → um grupo específico. **Broadcast** → todos os destinatários.',
      fonte: f('9–10'),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na Aula 02, “ponto a ponto” (tecnologia de transmissão) significa:',
      opcoes: [
        'Um enlace dedicado entre dois dispositivos',
        'A arquitetura descentralizada, com grupo de trabalho',
        'Redes P2P, em que o download é dividido entre os participantes',
        'Transmissão endereçada a todos os destinatários',
      ],
      correta: 0,
      explicacao: 'Na Aula 02, ponto a ponto é a tecnologia com **enlace dedicado entre dois dispositivos**. A arquitetura descentralizada (grupo de trabalho) é o sentido da Aula 01, e P2P é a arquitetura colaborativa.',
      fonte: f(7),
    },
  ],
}

const fase24: Fase = {
  id: '2-4',
  titulo: 'Formas de uso do enlace',
  resumo: 'Simplex, half-duplex e full-duplex.',
  Cena: CenaEnlace,
  camera: [0, 6.5, 12.5],
  passos: [
    {
      titulo: '❶ Simplex',
      texto: `
> **SIMPLEX:** Apenas um dispositivo no enlace pode transmitir; o outro pode apenas receber.

- É **unidirecional**, como em uma **via de mão única**;
- Pode usar **toda a capacidade do canal** para enviar dados.

**Exemplos:** teclados, monitores e o fio de fibra ótica.

Na cena, todos os caminhões vão de A para B. B nunca responde.`,
      fonte: f(11),
      cena: { modo: 'simplex' },
    },
    {
      titulo: '❷ Half-duplex',
      texto: `
> **HALF-DUPLEX:** Neste modo, cada dispositivo pode transmitir ou receber, mas **não ao mesmo tempo**.

- Quando um está transmitindo o outro apenas recebe e vice-versa.
- Usado quando não existe necessidade de comunicação em ambas as direções ao mesmo tempo.

**Exemplos:** *walkie-talkies*, cabo coaxial (usado na TV), etc.

Uma faixa só, com semáforo: **verde** em cima de quem pode transmitir. Primeiro A manda, depois B.`,
      fonte: f(12),
      cena: { modo: 'half' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Pense no walkie-talkie',
          texto: 'Quem fala aperta o botão e diz “câmbio” no fim; só então o outro pode falar. Um de cada vez: half-duplex.',
        },
      ],
    },
    {
      titulo: '❸ Full-duplex',
      texto: `
> **FULL-DUPLEX:** Ambas as estações podem transmitir e receber **simultaneamente**.

- Usado quando é necessária a comunicação em ambas as direções simultaneamente.
- **Diferentes meios de transmissão (faixas)** são usados.

**Exemplos:** cabo par trançado, cabo da linha telefônica convencional ou a transmissão do aparelho celular.

Duas faixas, uma para cada sentido: ninguém espera.`,
      fonte: f(12),
      cena: { modo: 'full' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O modo é do uso, não do cabo',
          noSlide: 'Cabo coaxial é exemplo de half-duplex; cabo par trançado é exemplo de full-duplex.',
          naPratica: 'O mesmo cabo pode trabalhar nos dois modos. Um par trançado ligado a um hub funciona em half-duplex; ligado a um switch, em full-duplex. Na prova, use os exemplos do slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Classifique os exemplos do slide.',
      grupos: ['Simplex', 'Half-duplex', 'Full-duplex'],
      itens: [
        { texto: 'Teclado', grupo: 0 },
        { texto: 'Fio de fibra ótica', grupo: 0 },
        { texto: 'Walkie-talkie', grupo: 1 },
        { texto: 'Cabo coaxial (TV)', grupo: 1 },
        { texto: 'Cabo par trançado', grupo: 2 },
        { texto: 'Aparelho celular', grupo: 2 },
      ],
      explicacao: '**Simplex**: teclados, monitores e fio de fibra ótica. **Half-duplex**: walkie-talkies, cabo coaxial (TV). **Full-duplex**: cabo par trançado, linha telefônica convencional, celular.',
      fonte: f('11–12'),
    },
    {
      tipo: 'escolha',
      enunciado: '“Cada dispositivo pode transmitir ou receber, mas não ao mesmo tempo.” Qual modo?',
      opcoes: ['Half-duplex', 'Simplex', 'Full-duplex', 'Broadcast'],
      correta: 0,
      explicacao: '**Half-duplex**: quando um está transmitindo, o outro apenas recebe, e vice-versa.',
      fonte: f(12),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual modo é unidirecional, como uma via de mão única, e pode usar toda a capacidade do canal para enviar dados?',
      opcoes: ['Simplex', 'Half-duplex', 'Full-duplex', 'Difusão'],
      correta: 0,
      explicacao: '**Simplex**: apenas um transmite, o outro só recebe; unidirecional; usa toda a capacidade do canal.',
      fonte: f(11),
    },
    {
      tipo: 'escolha',
      enunciado: 'No full-duplex, segundo o slide, como os dois lados conseguem transmitir ao mesmo tempo?',
      opcoes: [
        'Diferentes meios de transmissão (faixas) são usados',
        'Um espera o outro terminar',
        'Só um lado transmite',
        'O sinal é enviado para todos os computadores',
      ],
      correta: 0,
      explicacao: 'Full-duplex: “**Diferentes meios de transmissão (faixas)** são usados.”',
      fonte: f(12),
    },
    {
      tipo: 'escolha',
      enunciado: 'O cabo da linha telefônica convencional é exemplo de qual modo, segundo o slide?',
      opcoes: ['Full-duplex', 'Half-duplex', 'Simplex', 'Nenhum dos três'],
      correta: 0,
      explicacao: 'Exemplos de **full-duplex**: cabo par trançado, **cabo da linha telefônica convencional** e a transmissão do aparelho celular.',
      fonte: f(12),
    },
  ],
}

const fase25: Fase = {
  id: '2-5',
  titulo: 'Topologia física',
  resumo: 'Barra, estrela, anel e malha. Corte cabos e veja o que cai.',
  Cena: CenaTopologias,
  camera: [0, 10, 10.5],
  passos: [
    {
      titulo: 'O desenho da rede',
      texto: `
> “É a maneira pela qual os enlaces de comunicação e dispositivos de comutação estão interligados, provendo efetivamente a transmissão do sinal entre nós da rede.”

Topologias físicas dos meios de transmissão:

- Barra (*BUS*)
- Estrela (*STAR*)
- Anel (*RING*)
- Malha (*MESH*)

Nos próximos passos você vai **cortar cabos** com a tesoura ✂ para ver o que acontece em cada uma.`,
      fonte: f(13),
      cena: { topo: 'estrela' },
    },
    {
      titulo: '❶ Barra (barramento)',
      texto: `
> Configuração física de rede na qual **um único cabo** é usado para conectar todos os computadores.

- Foi uma das **1ªs topologias** adotadas em redes locais.
- Todas as estações se ligam ao **mesmo meio de comunicação**.
- A **expansão da rede é mais fácil** porém, qualquer problema **no cabo (não no dispositivo)** causa a **parada de toda a rede**.`,
      fonte: f(14),
      cena: { topo: 'barra' },
      explorar: {
        instrucao: 'Desligue um computador (⏻) e corte o cabo principal (✂).',
        alvos: {
          pc: { titulo: '⏻ Computador desligado → só ele sai', texto: 'Problema no dispositivo não para a rede: os outros continuam conversando pelo cabo.' },
          cabo: { titulo: '✂ Cabo cortado → a rede inteira para', texto: 'Todas as estações dependem do mesmo cabo. Problema nele derruba todo mundo.' },
        },
      },
    },
    {
      titulo: '❷ Estrela',
      texto: `
> Nesse tipo de topologia cada dispositivo é ligado a um **nó central (concentrador)**, através do qual **todos os sinais devem passar**.

- A **perda de um enlace não afeta toda a rede**.
- Pode ou não atuar **difusão**, dependendo do equipamento concentrador.`,
      fonte: f(14),
      cena: { topo: 'estrela' },
      explorar: {
        instrucao: 'Corte um dos cabos da estrela (✂).',
        alvos: {
          enlace: { titulo: '✂ Um enlace cortado → só um computador cai', texto: 'Os outros continuam falando com o concentrador. A perda de um enlace não afeta toda a rede.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Hub ou switch no centro',
          texto: 'O “pode ou não atuar difusão” vem do concentrador: um **hub** repete o sinal para todas as portas (difusão); um **switch** entrega só na porta do destino.',
        },
      ],
    },
    {
      titulo: '❸ Anel',
      texto: `
> Como no barramento, a topologia em anel também têm dispositivos **ligados em série**, a diferença é que **não existe extremidade**.

- As transmissões ocorrem em **sentido único**;
- O gerenciamento é feito através de uma **mensagem (*token*)** que é enviada **nó a nó**;
- Quando o sinal entra no anel, ele **circula até ser retirado pelo nó de destino**.

A moeda dourada é o token dando a volta. O envelope sai da origem e segue o sentido do anel até o destino.`,
      fonte: f(15),
      cena: { topo: 'anel' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Quem tira a mensagem do anel',
          noSlide: 'O sinal circula até ser retirado pelo nó de destino.',
          naPratica: 'No padrão Token Ring (IEEE 802.5), o destino copia a mensagem e marca que recebeu; ela continua girando até voltar à origem, que a retira do anel e libera o token. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: '❹ Malha',
      texto: `
> Cada dispositivo possui um **enlace dedicado com cada um dos demais** dispositivos.

- Oferece **redundância** no caso de falhas nos enlaces.
- É empregada na **Internet**.

Corte o cabo direto entre a origem e o destino e veja a mensagem pegar outro caminho.`,
      fonte: f(15),
      cena: { topo: 'malha' },
      explorar: {
        instrucao: 'Corte o enlace direto entre origem e destino (✂).',
        alvos: {
          enlace: { titulo: '✂ Enlace cortado → a mensagem desvia', texto: 'Existem outros caminhos até o destino: isso é a redundância da malha.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Quantos cabos numa malha completa?',
          texto: 'Com **n** dispositivos são **n × (n − 1) ÷ 2** enlaces: aqui, 5 × 4 ÷ 2 = **10**. Por isso a Internet usa uma malha parcial (vários caminhos, mas não um cabo de cada roteador para todos os outros).',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Em qual topologia um problema no cabo (não no dispositivo) causa a parada de toda a rede?',
      opcoes: ['Barra', 'Estrela', 'Malha', 'Nenhuma'],
      correta: 0,
      explicacao: '**Barra**: um único cabo liga todos; a expansão é mais fácil, porém qualquer problema no cabo (não no dispositivo) causa a parada de toda a rede.',
      fonte: f(14),
    },
    {
      tipo: 'escolha',
      enunciado: '“Cada dispositivo é ligado a um nó central, através do qual todos os sinais devem passar.” Qual topologia?',
      opcoes: ['Estrela', 'Barra', 'Anel', 'Malha'],
      correta: 0,
      explicacao: '**Estrela**: nó central (concentrador); a perda de um enlace não afeta toda a rede.',
      fonte: f(14),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na topologia em anel, o gerenciamento é feito através de:',
      opcoes: [
        'Uma mensagem (token) enviada nó a nó',
        'Um concentrador central',
        'Um único cabo com duas extremidades',
        'Enlaces dedicados entre todos os dispositivos',
      ],
      correta: 0,
      explicacao: '**Anel**: transmissões em sentido único; gerenciamento por uma mensagem (**token**) enviada nó a nó; o sinal circula até ser retirado pelo nó de destino.',
      fonte: f(15),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual topologia oferece redundância no caso de falhas nos enlaces e é empregada na Internet?',
      opcoes: ['Malha', 'Barra', 'Estrela', 'Anel'],
      correta: 0,
      explicacao: '**Malha**: cada dispositivo tem enlace dedicado com cada um dos demais; oferece redundância e é empregada na Internet.',
      fonte: f(15),
    },
    {
      tipo: 'classificar',
      enunciado: 'A qual topologia pertence cada característica?',
      grupos: ['Barra', 'Estrela', 'Anel', 'Malha'],
      itens: [
        { texto: 'Uma das 1ªs topologias adotadas em redes locais', grupo: 0 },
        { texto: 'Pode ou não atuar difusão, dependendo do concentrador', grupo: 1 },
        { texto: 'Ligados em série, sem extremidade', grupo: 2 },
        { texto: 'Transmissões em sentido único', grupo: 2 },
        { texto: 'Enlace dedicado com cada um dos demais dispositivos', grupo: 3 },
      ],
      explicacao: 'Barra: uma das primeiras em redes locais. Estrela: difusão depende do concentrador. Anel: em série, sem extremidade, sentido único. Malha: enlace dedicado com cada um dos demais.',
      fonte: f('14–15'),
    },
  ],
}

const fase26: Fase = {
  id: '2-6',
  titulo: 'Comutação',
  resumo: 'Circuitos, mensagens (guardar-encaminhar) e pacotes.',
  Cena: CenaComutacao,
  camera: [0, 8.5, 13],
  passos: [
    {
      titulo: 'Ligar os pontos da rede',
      texto: `
> **Comutação:** É a ligação entre os pontos na rede.

- Obtida através da **alocação dos recursos nos nós** (meio de transmissão, sistemas intermediários, etc.).
- A tecnologia de comutação determina **como os dados serão transferidos** entre os diversos nós de uma malha.

**Tipos de comutação:** ① Circuitos ② Mensagens ③ Pacotes.

Os quadrados verdes são os nós, como no desenho do slide.`,
      fonte: f(16),
      cena: { modo: 'intro' },
    },
    {
      titulo: '① Comutação por circuitos',
      texto: `
- Neste tipo de comutação, **antes de ser enviado qualquer dado**, há o estabelecimento de uma **“ligação física”** entre origem/destino.
- O canal criado é **mantido até a desconexão** do circuito.

> **PROBLEMA** → Há o **monopólio do enlace**… o canal fica dedicado exclusivamente à ligação até que a comunicação seja desfeita.

O caminho vermelho foi reservado para a ligação entre os dois telefones. O caminhão cinza quer usar um desses enlaces e fica esperando.`,
      fonte: f(17),
      cena: { modo: 'circuitos' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'A telefonia antiga',
          texto: 'O desenho do slide usa telefones porque a telefonia fixa tradicional funciona assim: enquanto a ligação dura, o circuito fica reservado, mesmo nos momentos de silêncio.',
        },
      ],
    },
    {
      titulo: '② Comutação por mensagens',
      texto: `
Neste tipo **não existe o monopólio do canal**.

- Em cada nó, **a mensagem inteira é recebida** e o próximo caminho é determinado com base no **endereço contido na mensagem**.
- O funcionamento segue o princípio **GUARDAR-ENCAMINHAR** (*store-and-forward*).

O bloco vermelho é a mensagem inteira: em cada nó ela para, fica **guardada** (o nó acende) e depois é **encaminhada**.`,
      fonte: f(17),
      cena: { modo: 'mensagens' },
    },
    {
      titulo: 'O problema das mensagens',
      texto: `
> **PROBLEMA** → A perda da mensagem em qualquer nó necessitará que **todo o processo seja refeito**, pois os nós armazenam as mensagens **temporariamente**.

Veja: a mensagem se perde no meio do caminho e precisa sair de novo da origem, desde o começo.`,
      fonte: f(18),
      cena: { modo: 'perda' },
    },
    {
      titulo: '③ Comutação de pacotes',
      texto: `
- Neste tipo de comutação a **mensagem é quebrada em pequenos pedaços**, antes da transmissão ser efetuada.
- Os bits são agrupados em blocos, aos quais se juntam **bits de controle** (**PACOTES**): cada pacote é **cabeçalho + segmento** da mensagem.
- Os pacotes são enviados para o primeiro nó, que os **armazena temporariamente** e determina o caminho a seguir (com base no **endereço indicado no cabeçalho**);
- A transmissão de cada pacote é feita por um **caminho escolhido** (rota definida), até o destino onde são **reagrupados**.

Os 5 pacotes vão por caminhos diferentes e chegam fora de ordem: **${ORDEM_DE_CHEGADA.join(', ')}**. Na prateleira do destino, cada um ocupa o seu lugar pelo número.`,
      fonte: f('18–19'),
      cena: { modo: 'pacotes' },
    },
    {
      titulo: 'Vantagens dos pacotes',
      texto: `
**Vantagens:**

- O enlace entre dois nós consecutivos é **compartilhado** por pacotes de outras proveniências e com outros destinos (**o canal não é monopolizado**).
- Caso haja a perda de pacotes, o **pequeno tamanho permite uma fácil retransmissão**, pois o **cabeçalho** possibilita que a mensagem seja remontada **mesmo quando chegam fora de sequência**.

Os caminhões roxos e verdes são pacotes de outras conversas usando os mesmos cabos.`,
      fonte: f(19),
      cena: { modo: 'vantagens' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Resumo para a prova',
          texto: '**Circuitos**: reserva o caminho antes; monopólio do enlace. **Mensagens**: mensagem inteira, guardar-encaminhar; perdeu, refaz tudo. **Pacotes**: pedaços com cabeçalho, caminhos diferentes, remontados no destino; canal compartilhado.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Em qual comutação, antes de ser enviado qualquer dado, há o estabelecimento de uma “ligação física” entre origem e destino?',
      opcoes: ['Circuitos', 'Mensagens', 'Pacotes', 'Difusão'],
      correta: 0,
      explicacao: '**Circuitos**: a ligação física é estabelecida antes; o canal é mantido até a desconexão.',
      fonte: f(17),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o PROBLEMA da comutação por circuitos, segundo o slide?',
      opcoes: [
        'O monopólio do enlace: o canal fica dedicado à ligação até ela ser desfeita',
        'A perda da mensagem obriga a refazer todo o processo',
        'Os pacotes chegam fora de sequência',
        'Não existe caminho entre origem e destino',
      ],
      correta: 0,
      explicacao: 'Circuitos → **monopólio do enlace**. Refazer todo o processo é o problema das **mensagens**.',
      fonte: f(17),
    },
    {
      tipo: 'escolha',
      enunciado: 'O princípio GUARDAR-ENCAMINHAR (store-and-forward), com a mensagem inteira recebida em cada nó, é da comutação por:',
      opcoes: ['Mensagens', 'Circuitos', 'Pacotes', 'Topologia em anel'],
      correta: 0,
      explicacao: '**Mensagens**: em cada nó a mensagem inteira é recebida e o próximo caminho é escolhido pelo endereço contido nela.',
      fonte: f(17),
    },
    {
      tipo: 'escolha',
      enunciado: 'O que permite remontar a mensagem mesmo quando os pacotes chegam fora de sequência?',
      opcoes: ['O cabeçalho de cada pacote', 'O monopólio do canal', 'O token', 'O concentrador'],
      correta: 0,
      explicacao: 'Vantagem dos pacotes: o pequeno tamanho facilita a retransmissão, e o **cabeçalho** possibilita remontar a mensagem mesmo fora de sequência.',
      fonte: f(19),
    },
    {
      tipo: 'classificar',
      enunciado: 'Classifique cada característica no tipo de comutação.',
      grupos: ['Circuitos', 'Mensagens', 'Pacotes'],
      itens: [
        { texto: 'Canal mantido até a desconexão', grupo: 0 },
        { texto: 'Há monopólio do enlace', grupo: 0 },
        { texto: 'Mensagem inteira recebida em cada nó', grupo: 1 },
        { texto: 'Perda obriga a refazer todo o processo', grupo: 1 },
        { texto: 'Mensagem quebrada em pedaços com bits de controle', grupo: 2 },
        { texto: 'Podem chegar fora de sequência', grupo: 2 },
      ],
      explicacao: 'Circuitos: canal dedicado até a desconexão (monopólio). Mensagens: guardar-encaminhar a mensagem inteira; perdeu, refaz tudo. Pacotes: pedaços com cabeçalho, remontados no destino mesmo fora de ordem.',
      fonte: f('17–19'),
    },
  ],
}

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'Qual destes critérios NÃO aparece no conteúdo da Aula 02 (análise das características das redes)?',
    opcoes: [
      'Onde os dados são processados (arquitetura)',
      'Abrangência e topologia',
      'Utilização do meio de transmissão',
      'Técnicas de comutação',
    ],
    correta: 0,
    explicacao: 'Conteúdo da Aula 02: abrangência e topologia; quantidade de conexões e endereçamento; utilização do meio de transmissão; técnicas de comutação. **Arquitetura** (onde os dados são processados) é da Aula 01.',
    fonte: f(1),
  },
  {
    tipo: 'escolha',
    enunciado: 'Uma empresa num único prédio, com os computadores administrados e controlados localmente, forma uma:',
    opcoes: ['LAN', 'MAN', 'WAN', 'WPAN'],
    correta: 0,
    explicacao: '**LAN**: comunicação em área restrita (de forma geral em um único prédio); dispositivos fisicamente adjacentes; administradas e controladas localmente.',
    fonte: f(3),
  },
  {
    tipo: 'escolha',
    enunciado: 'Fornecer conectividade ininterrupta (alta disponibilidade) é característica de qual rede?',
    opcoes: ['WAN', 'LAN', 'WPAN', 'MAN'],
    correta: 0,
    explicacao: 'Características da **WAN**: conectividade ininterrupta (alta disponibilidade); linhas de transmissão + roteadores.',
    fonte: f(4),
  },
  {
    tipo: 'escolha',
    enunciado: 'Numa rede em estrela, um cabo que liga um computador ao concentrador foi cortado. O que acontece?',
    opcoes: [
      'Só aquele computador fica sem rede',
      'A rede inteira para',
      'O token para de circular',
      'Os pacotes passam a ir por broadcast',
    ],
    correta: 0,
    explicacao: 'Estrela: **a perda de um enlace não afeta toda a rede**. Quem para inteira com problema no cabo é a barra.',
    fonte: f(14),
  },
]

export const trilha2: Trilha = {
  id: 't2',
  numero: 2,
  titulo: 'Classificação das redes',
  aula: 'Aula 02 · Classificação',
  cor: '#23915f',
  disponivel: true,
  fases: [fase21, fase22, fase23, fase24, fase25, fase26],
  chefaoExtras: extras,
}
