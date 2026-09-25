import type { Fase, Questao, Trilha } from '../../engine/tipos'
import { CenaArquiteturas } from './cenas/Arquiteturas'
import { CenaComponentes } from './cenas/Componentes'
import { CenaMeios } from './cenas/Meios'
import { CenaProtocolos } from './cenas/Protocolos'

// Trilha 1 — Fundamentos. Fonte única: REDES-01_Intro.pdf (7 páginas, 2 slides por página).
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação em cima deles.
// Nota "curiosidade" = informação que NÃO está no slide.

const AULA = 'Aula 01'
const f = (pagina: number | string) => ({ aula: AULA, pagina })

const fase11: Fase = {
  id: '1-1',
  titulo: 'O que é uma rede?',
  resumo: 'Definição, propósitos e os 6 componentes básicos.',
  Cena: CenaComponentes,
  camera: [0, 6.5, 13],
  passos: [
    {
      titulo: 'Bem-vindo à Cidade de Dados',
      texto: `
Nesta cidade, cada computador é uma casa. Pelos cabos viajam os **dados**: cada ícone mostra o tipo (mensagem, música, documento, vídeo, foto, e-mail, voz). Gire a câmera arrastando o mouse e use a rodinha para aproximar.

A definição do professor:

> **REDE DE COMPUTADORES** → É um sistema de comunicação de dados constituído através da conexão de computadores e que usa meios físicos de transmissão.

Guarde as três ideias: **comunicação de dados**, **computadores conectados** e **meios físicos de transmissão**.`,
      fonte: f(1),
    },
    {
      titulo: 'Para que serve uma rede?',
      texto: `
Os propósitos das redes, segundo o slide:

- **Troca de mensagens** → e-mail, chat, telegram, etc.
- **Compartilhamento** → impressora, documentos, etc.
- **Estudo** → aulas à distância (EAD), etc.
- **Entretenimento** → YouTube, Netflix, etc.
- **Entre outros.**

Os caminhõezinhos vermelho e azul são exatamente isso: mensagens indo e voltando entre os dois computadores.`,
      fonte: f(2),
    },
    {
      titulo: 'Os 6 componentes básicos',
      texto: `
Toda rede, da mais simples à Internet, tem os mesmos **6 componentes básicos**. Eles estão todos nesta cena.`,
      fonte: f('3–4'),
      explorar: {
        instrucao: 'Clique nos 6 pontos de interrogação da cena para descobrir cada componente.',
        alvos: {
          mensagem: {
            titulo: '❶ Mensagens',
            texto: 'São as informações (dados) transmitidas pelos usuários. Exemplos: texto, número, figuras, áudio e vídeo.',
          },
          computador: {
            titulo: '❷ Computador',
            texto: 'Equipamento que processa os dados. Além de computadores, uma rede pode ser formada por outros equipamentos que atuam de forma similar. Exemplo: celular, smart-TV, etc.',
          },
          dispositivo: {
            titulo: '❸ Dispositivo de rede',
            texto: 'Equipamento que transmite/recebe as mensagens de dados. Podem ser: placas de rede, switches, etc.',
          },
          meio: {
            titulo: '❹ Meio de transmissão',
            texto: 'Caminho físico pelo qual a mensagem trafega do emissor ao receptor.',
          },
          protocolo: {
            titulo: '❺ Protocolo de comunicação',
            texto: 'Conjunto de regras usadas para comunicação entre pares. No desenho do slide, é a lista “Regra 1, Regra 2, …, Regra n” que os dois lados seguem.',
          },
          sor: {
            titulo: '❻ Sistema Operacional de Rede (SOR)',
            texto: 'Tipo de Sistema Operacional que possui módulos necessários para utilizar os recursos disponíveis na rede.',
          },
        },
      },
    },
    {
      titulo: 'Juntando tudo',
      texto: `
Agora todos os nomes estão na cena. O caminho de uma mensagem fica assim:

- A **mensagem** sai de um **computador**, que roda um **SOR**;
- passa pelo **dispositivo de rede** (a placa de rede);
- viaja pelo **meio de transmissão** (o cabo);
- e os dois lados seguem o mesmo **protocolo** (as mesmas regras) para se entender.

Um jeito de decorar a ordem do slide: **M**ensagem, **C**omputador, **D**ispositivo, **M**eio, **P**rotocolo, **S**OR.`,
      fonte: f('3–4'),
      cena: { rotulos: true },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Celular também conta',
          texto: 'Na prova, se aparecer “celular” ou “smart-TV”, eles entram como **computador**: o slide diz que outros equipamentos que atuam de forma similar também formam a rede.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, o que é uma rede de computadores?',
      opcoes: [
        'Um sistema de comunicação de dados constituído através da conexão de computadores e que usa meios físicos de transmissão.',
        'Um conjunto de páginas web acessadas pelo navegador.',
        'Um computador central que processa os dados de vários terminais.',
        'Um conjunto de regras usadas para a comunicação entre pares.',
      ],
      correta: 0,
      explicacao: 'É a definição literal do slide. “Páginas web” é a WEB (Aula 02), o computador central é a arquitetura centralizada e “conjunto de regras” é a definição de **protocolo**.',
      fonte: f(1),
    },
    {
      tipo: 'classificar',
      enunciado: 'Classifique cada exemplo no propósito de rede correspondente.',
      grupos: ['Troca de mensagens', 'Compartilhamento', 'Estudo', 'Entretenimento'],
      itens: [
        { texto: 'E-mail', grupo: 0 },
        { texto: 'Telegram', grupo: 0 },
        { texto: 'Impressora usada por vários computadores', grupo: 1 },
        { texto: 'Documentos na rede', grupo: 1 },
        { texto: 'Aulas à distância (EAD)', grupo: 2 },
        { texto: 'Netflix', grupo: 3 },
      ],
      explicacao: 'Troca de mensagens: e-mail, chat, telegram. Compartilhamento: impressora, documentos. Estudo: EAD. Entretenimento: YouTube, Netflix.',
      fonte: f(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Placas de rede e switches são exemplos de qual componente básico?',
      opcoes: ['Dispositivo de rede', 'Computador', 'Meio de transmissão', 'Protocolo de comunicação'],
      correta: 0,
      explicacao: '**Dispositivo de rede** é o equipamento que transmite/recebe as mensagens de dados. Exemplos: placas de rede, switches, etc.',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Um celular e uma smart-TV conectados à rede entram em qual componente?',
      opcoes: ['Computador', 'Dispositivo de rede', 'Mensagem', 'Sistema Operacional de Rede'],
      correta: 0,
      explicacao: 'O slide define **computador** como o equipamento que processa os dados e diz que outros equipamentos que atuam de forma similar também formam a rede. Exemplo: celular, smart-TV.',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: '“Caminho físico pelo qual a mensagem trafega do emissor ao receptor.” Essa é a definição de:',
      opcoes: ['Meio de transmissão', 'Protocolo de comunicação', 'Dispositivo de rede', 'Topologia'],
      correta: 0,
      explicacao: 'É a definição de **meio de transmissão**, o 4º componente básico.',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'O tipo de sistema operacional que possui os módulos necessários para utilizar os recursos disponíveis na rede é o:',
      opcoes: ['SOR — Sistema Operacional de Rede', 'Protocolo de alto nível', 'Servidor', 'Mainframe'],
      correta: 0,
      explicacao: 'É o **SOR**, o 6º componente básico.',
      fonte: f(4),
    },
  ],
}

const fase12: Fase = {
  id: '1-2',
  titulo: 'Meios de transmissão',
  resumo: 'Guiados (cabo e fibra) × não guiados (rádio e micro-ondas).',
  Cena: CenaMeios,
  camera: [0, 9, 14],
  passos: [
    {
      titulo: 'O caminho da mensagem',
      texto: `
> **MEIOS DE TRANSMISSÃO:** Caminho físico pelo qual a mensagem trafega do emissor ao receptor.

O slide divide os meios em dois grupos:

- **Guiados** → o sinal vai “preso” dentro de um cabo;
- **Não guiados** → o sinal viaja pelo ar.

Nesta cena há três ruas: as duas de trás são **guiadas** e a da frente é **não guiada**.`,
      fonte: f(3),
      cena: { foco: 'todos' },
    },
    {
      titulo: 'Guiado: cabo par trançado',
      texto: `
> **GUIADOS** → A conexão dos dispositivos usam sinais elétricos (cabo par trançado) ou óticos (fibra ótica).

No **cabo par trançado**, a mensagem vira **sinais elétricos**: são as bolinhas amarelas correndo pelo cabo laranja.`,
      fonte: f(3),
      cena: { foco: 'cobre' },
    },
    {
      titulo: 'Guiado: fibra ótica',
      texto: `
Na **fibra ótica**, a mensagem vira **sinais óticos**, ou seja, **luz**. São os traços azuis-claros, bem mais rápidos, dentro da fibra.

Os dois são **guiados**: o sinal segue o caminho do cabo.`,
      fonte: f(3),
      cena: { foco: 'fibra' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Por que fibra é usada entre cidades',
          texto: 'A luz dentro da fibra perde muito pouca força com a distância e não sofre interferência elétrica. Por isso os cabos submarinos que ligam os continentes são de fibra ótica.',
        },
      ],
    },
    {
      titulo: 'Não guiados: pelo ar',
      texto: `
> **NÃO-GUIADOS** → A conexão dos dispositivos usam sinais eletromagnéticos cuja frequência de operação podem ser "ondas de RÁDIO" ou "MICROONDAS".

Os anéis que se espalham pela cena são as ondas saindo das antenas. Não existe cabo: o sinal se espalha pelo ar.`,
      fonte: f(3),
      cena: { foco: 'ar' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Detalhe sobre “eletromagnético”',
          noSlide: 'Só os não guiados usam “sinais eletromagnéticos”.',
          naPratica: 'Luz e corrente elétrica também são fenômenos eletromagnéticos. O que separa os grupos é se o sinal vai guiado por um cabo ou livre pelo ar. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: 'Quem usa qual meio?',
      texto: `
O slide tem uma tabela ligando cada **dispositivo** ao seu **meio de transmissão**.`,
      fonte: f(3),
      cena: { foco: 'todos' },
      explorar: {
        instrucao: 'Clique nos 3 dispositivos marcados com “?” para montar a tabela.',
        alvos: {
          placa: { titulo: 'Placa de Rede → Cabo (Elétrico ou Ótico)', texto: 'A placa de rede liga o computador a um meio guiado: cabo par trançado (elétrico) ou fibra (ótico).' },
          ap: { titulo: 'Ponto de Acesso → Antena (Ondas de Rádio ou micro-ondas)', texto: 'O ponto de acesso (o “roteador Wi-Fi”) usa antena, com ondas de rádio ou micro-ondas.' },
          base: { titulo: 'Estação Base → Antena (Microondas)', texto: 'A estação base (torre de celular) usa antena de micro-ondas.' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Classifique cada meio de transmissão.',
      grupos: ['Guiado', 'Não guiado'],
      itens: [
        { texto: 'Cabo par trançado', grupo: 0 },
        { texto: 'Fibra ótica', grupo: 0 },
        { texto: 'Ondas de rádio', grupo: 1 },
        { texto: 'Micro-ondas', grupo: 1 },
      ],
      explicacao: '**Guiados** usam sinais elétricos (par trançado) ou óticos (fibra). **Não guiados** usam sinais eletromagnéticos: ondas de rádio ou micro-ondas.',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Que tipo de sinal a fibra ótica usa?',
      opcoes: ['Ótico (luz)', 'Elétrico', 'Ondas de rádio', 'Micro-ondas'],
      correta: 0,
      explicacao: 'Guiados: sinais **elétricos** no cabo par trançado e **óticos** na fibra ótica.',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a tabela do slide, qual é o meio de transmissão de um Ponto de Acesso?',
      opcoes: [
        'Antena (ondas de rádio ou micro-ondas)',
        'Antena (só micro-ondas)',
        'Cabo (elétrico ou ótico)',
        'Fibra ótica',
      ],
      correta: 0,
      explicacao: 'Tabela do slide: Placa de Rede → Cabo (Elétrico ou Ótico); **Ponto de Acesso → Antena (Ondas de Rádio ou micro-ondas)**; Estação Base → Antena (Microondas).',
      fonte: f(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a tabela do slide, qual dispositivo usa antena de micro-ondas?',
      opcoes: ['Estação Base', 'Placa de Rede', 'Switch', 'Impressora'],
      correta: 0,
      explicacao: 'A **Estação Base** (torre de telefonia) usa **Antena (Microondas)**.',
      fonte: f(3),
    },
  ],
}

const fase13: Fase = {
  id: '1-3',
  titulo: 'Protocolos',
  resumo: 'Alto nível (aplicações) × baixo nível (dispositivos) e o SOR.',
  Cena: CenaProtocolos,
  camera: [0, 5.5, 12.5],
  passos: [
    {
      titulo: 'Regras para conversar',
      texto: `
> **PROTOCOLO DE COMUNICAÇÃO:** Conjunto de regras usadas para comunicação entre pares.

Pense em dois países que precisam trocar cartas: se cada um usar um formato diferente de endereço, nada chega. O protocolo é o **acordo de regras** que os dois lados seguem. Os livros flutuando na cena são essas regras.

O slide separa os protocolos em **dois níveis**.`,
      fonte: f(4),
      cena: { foco: 'regras' },
    },
    {
      titulo: 'Alto nível: entre aplicações',
      texto: `
> **DE ALTO NÍVEL** → Conjunto de regras usadas entre aplicações. São disponibilizadas pelo sistema operacional. Ex.: TCP/IP, NETBIOS, IPX/SPX, etc.

É a ponte de cima, que liga as **telas** (os programas) dos dois computadores.`,
      fonte: f(4),
      cena: { foco: 'alto' },
    },
    {
      titulo: 'Baixo nível: entre dispositivos',
      texto: `
> **DE BAIXO NÍVEL** → Conjunto de regras usadas entre dispositivos de rede. Exemplos: ethernet, wifi, bluetooth, etc.

É a ponte de baixo, que liga as **placas de rede**.`,
      fonte: f(4),
      cena: { foco: 'baixo' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'Wifi e bluetooth são protocolos',
          texto: 'Pelo slide, **wifi** e **bluetooth** são protocolos **de baixo nível**, não meios de transmissão. O meio deles é o ar (ondas de rádio).',
        },
      ],
    },
    {
      titulo: 'Os dois níveis trabalham juntos',
      texto: `
Acompanhe a mensagem: ela sai do programa, **desce** até a placa de rede, atravessa o cabo e **sobe** até o programa do outro lado.

Cada nível conversa com o seu **par** do outro lado: aplicação com aplicação e dispositivo com dispositivo.

Essa ideia de andares empilhados é a semente do **Modelo OSI**, que você vai ver na Trilha 5.`,
      fonte: f(4),
      cena: { foco: 'ambos', viagem: true },
    },
    {
      titulo: 'O Sistema Operacional de Rede',
      texto: `
> **SISTEMA OPERACIONAL DE REDE:** Tipo de Sistema Operacional que possui módulos necessário para utilizar os recursos disponíveis na rede.

No desenho do slide, um lado tem o logo do Windows e o outro o pinguim do Linux, e os dois estão marcados como **SOR**. Sistemas diferentes conversam porque seguem os mesmos protocolos.

Lembre também que os protocolos de alto nível **são disponibilizados pelo sistema operacional**.`,
      fonte: f(4),
      cena: { foco: 'sor' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Classifique cada protocolo conforme o nível, segundo o slide.',
      grupos: ['Alto nível', 'Baixo nível'],
      itens: [
        { texto: 'TCP/IP', grupo: 0 },
        { texto: 'NETBIOS', grupo: 0 },
        { texto: 'IPX/SPX', grupo: 0 },
        { texto: 'Ethernet', grupo: 1 },
        { texto: 'Wifi', grupo: 1 },
        { texto: 'Bluetooth', grupo: 1 },
      ],
      explicacao: 'Alto nível (entre aplicações): TCP/IP, NETBIOS, IPX/SPX. Baixo nível (entre dispositivos de rede): ethernet, wifi, bluetooth.',
      fonte: f(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Protocolos de alto nível são regras usadas entre:',
      opcoes: [
        'Aplicações, e são disponibilizados pelo sistema operacional',
        'Dispositivos de rede, como placas e switches',
        'Antenas de rádio e micro-ondas',
        'Apenas servidores',
      ],
      correta: 0,
      explicacao: '**Alto nível** → entre **aplicações**, disponibilizados pelo sistema operacional. **Baixo nível** → entre **dispositivos de rede**.',
      fonte: f(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Bluetooth, segundo o slide, é um exemplo de:',
      opcoes: ['Protocolo de baixo nível', 'Protocolo de alto nível', 'Meio de transmissão guiado', 'Sistema Operacional de Rede'],
      correta: 0,
      explicacao: 'Exemplos de **baixo nível**: ethernet, wifi, **bluetooth**.',
      fonte: f(4),
    },
    {
      tipo: 'escolha',
      enunciado: '“Conjunto de regras usadas para comunicação entre pares” define:',
      opcoes: ['Protocolo de comunicação', 'Meio de transmissão', 'Sistema Operacional de Rede', 'Arquitetura de rede'],
      correta: 0,
      explicacao: 'É a definição de **protocolo de comunicação**, o 5º componente básico.',
      fonte: f(4),
    },
  ],
}

const fase14: Fase = {
  id: '1-4',
  titulo: 'Arquiteturas de rede',
  resumo: 'Centralizada, descentralizada, distribuída e colaborativa.',
  Cena: CenaArquiteturas,
  camera: [0, 8, 13],
  passos: [
    {
      titulo: 'Onde os dados são processados?',
      texto: `
> Os serviços disponíveis numa rede estão organizados de acordo com o modelo computacional, no qual os dados são processados.

São 4 tipos de arquitetura:

- ❶ Centralizada
- ❷ Descentralizada
- ❸ Distribuída
- ❹ Colaborativa

A pergunta-chave para diferenciar é **quem processa**. Na cena, a **engrenagem girando** marca quem está processando. Dado vermelho é **pedido** e dado azul é **resposta**.`,
      fonte: f(5),
      cena: { arq: 'centralizada' },
    },
    {
      titulo: '❶ Centralizada: Mainframes',
      texto: `
- Processamento realizado em **um único computador**. Os terminais “burros” são usados para **entrada e saída** (teclado, monitor), solicitando e recebendo as informações.
- Possuem **custo elevado**.

Repare: só o mainframe tem engrenagem. Os terminais mandam o pedido e esperam a resposta.`,
      fonte: f(6),
      cena: { arq: 'centralizada' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Mainframes ainda existem',
          texto: 'Bancos e companhias aéreas ainda usam mainframes para processar grandes volumes de transações.',
        },
      ],
    },
    {
      titulo: '❷ Descentralizada: Redes Ponto-a-Ponto',
      texto: `
- O foco neste modelo é a **independência** das tarefas e dos serviços;
- Cada computador tem **capacidade de processamento própria**, independente dos demais;
- Neste tipo de arquitetura costuma-se trabalhar logicamente com o conceito de **“Grupo de Trabalho”**.

Agora cada notebook tem sua própria engrenagem. Eles só usam a rede para compartilhar coisas, como a impressora.`,
      fonte: f(6),
      cena: { arq: 'descentralizada' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: '“Ponto-a-ponto” ≠ “P2P” nesta matéria',
          texto: 'No material do professor, **Redes Ponto-a-Ponto** = arquitetura **descentralizada** (grupo de trabalho) e **Redes P2P** = arquitetura **colaborativa**. Em inglês as duas expressões parecem a mesma coisa, mas aqui são arquiteturas diferentes. E “ponto a ponto” ainda volta na Aula 02 com outro sentido (enlace dedicado entre dois dispositivos).',
        },
      ],
    },
    {
      titulo: '❸ Distribuída: Cliente/Servidor',
      texto: `
- Existe a figura do **servidor**, que atende a pedidos feitos por máquinas **clientes**;
- O processamento da informação é dividido em processos distintos: um processo é responsável pela **solicitação** dos dados (**clientes**) e outro pela **entrega das respostas** (**servidores**).

Veja os pedidos vermelhos saindo dos clientes e as respostas azuis voltando do servidor.`,
      fonte: f(7),
      cena: { arq: 'distribuida' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Você usa isso agora',
          texto: 'Abrir um site é cliente/servidor: o navegador (cliente) pede a página e o servidor web entrega a resposta.',
        },
      ],
    },
    {
      titulo: '❹ Colaborativa: Redes P2P',
      texto: `
**P2P (peer-to-peer): pessoa-para-pessoa.**

- Cada um dos computadores se comporta como **cliente ou servidor**, possibilitando compartilhar serviços e dados **sem que haja um centralizador** das informações.
- O serviço oferecido (**download**) é **dividido** entre os computadores participantes.

Cada cor é um pedaço do arquivo. Os pedaços circulam entre todos até cada um ter o arquivo completo.`,
      fonte: f(7),
      cena: { arq: 'colaborativa' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Exemplo famoso',
          texto: 'O BitTorrent funciona assim: você baixa pedaços de vários participantes ao mesmo tempo e envia os pedaços que já tem para os outros.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Terminais “burros” usados só para entrada e saída, com todo o processamento em um único computador de custo elevado. Qual arquitetura?',
      opcoes: ['Centralizada (Mainframes)', 'Descentralizada (Ponto-a-Ponto)', 'Distribuída (Cliente/Servidor)', 'Colaborativa (P2P)'],
      correta: 0,
      explicacao: '**Centralizada**: processamento em um único computador (mainframe); terminais “burros” para entrada e saída; custo elevado.',
      fonte: f(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Em qual arquitetura costuma-se trabalhar logicamente com o conceito de “Grupo de Trabalho”?',
      opcoes: ['Descentralizada', 'Centralizada', 'Distribuída', 'Colaborativa'],
      correta: 0,
      explicacao: '**Descentralizada (Redes Ponto-a-Ponto)**: independência das tarefas, cada computador com processamento próprio e o conceito de “Grupo de Trabalho”.',
      fonte: f(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Um processo é responsável pela solicitação dos dados e outro pela entrega das respostas. Qual arquitetura?',
      opcoes: ['Distribuída (Cliente/Servidor)', 'Colaborativa (P2P)', 'Centralizada (Mainframes)', 'Descentralizada (Ponto-a-Ponto)'],
      correta: 0,
      explicacao: '**Distribuída**: o processamento é dividido; os **clientes** solicitam e os **servidores** entregam as respostas.',
      fonte: f(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'Cada computador se comporta como cliente ou servidor, sem centralizador, e o download é dividido entre os participantes. Qual arquitetura?',
      opcoes: ['Colaborativa (P2P)', 'Distribuída (Cliente/Servidor)', 'Descentralizada (Ponto-a-Ponto)', 'Centralizada (Mainframes)'],
      correta: 0,
      explicacao: '**Colaborativa (P2P, peer-to-peer, pessoa-para-pessoa)**: todos são clientes e servidores, e o download é dividido entre os participantes.',
      fonte: f(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'No material do professor, “Redes Ponto-a-Ponto” e “Redes P2P” são:',
      opcoes: [
        'Arquiteturas diferentes: descentralizada e colaborativa, respectivamente',
        'A mesma arquitetura com dois nomes',
        'Duas topologias físicas',
        'Arquiteturas diferentes: distribuída e centralizada, respectivamente',
      ],
      correta: 0,
      explicacao: 'Pegadinha clássica: **Ponto-a-Ponto** é a **descentralizada** (grupo de trabalho) e **P2P** é a **colaborativa** (download dividido).',
      fonte: f('6–7'),
    },
    {
      tipo: 'classificar',
      enunciado: 'Qual arquitetura cada situação representa?',
      grupos: ['Centralizada', 'Descentralizada', 'Distribuída', 'Colaborativa'],
      itens: [
        { texto: 'Banco antigo com terminais ligados a um mainframe', grupo: 0 },
        { texto: 'Escritório pequeno onde cada PC trabalha sozinho e todos usam a mesma impressora', grupo: 1 },
        { texto: 'Navegador pedindo uma página a um servidor web', grupo: 2 },
        { texto: 'Arquivo baixado em pedaços de vários usuários ao mesmo tempo', grupo: 3 },
      ],
      explicacao: 'Mainframe + terminais = **centralizada**. Cada um processa e existe grupo de trabalho = **descentralizada**. Pedido e resposta = **distribuída**. Download dividido entre participantes = **colaborativa**.',
      fonte: f('6–7'),
    },
  ],
}

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'Qual destes NÃO é um dos 6 componentes básicos de uma rede, segundo o slide?',
    opcoes: ['Topologia', 'Mensagens', 'Meio de transmissão', 'Sistema Operacional de Rede'],
    correta: 0,
    explicacao: 'Os 6 componentes: mensagens, computador, dispositivo de rede, meio de transmissão, protocolo de comunicação e SOR. **Topologia** é assunto da Aula 02.',
    fonte: f('3–4'),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual é o critério que diferencia as 4 arquiteturas de rede?',
    opcoes: [
      'O modelo computacional no qual os dados são processados',
      'O tamanho da área que a rede cobre',
      'O tipo de cabo usado',
      'A quantidade de computadores',
    ],
    correta: 0,
    explicacao: 'O slide diz que os serviços estão organizados de acordo com o **modelo computacional, no qual os dados são processados**. O tamanho da área é a **abrangência** (Aula 02).',
    fonte: f(5),
  },
]

export const trilha1: Trilha = {
  id: 't1',
  numero: 1,
  titulo: 'Fundamentos',
  aula: 'Aula 01 · Introdução',
  cor: '#2f6fb0',
  disponivel: true,
  fases: [fase11, fase12, fase13, fase14],
  chefaoExtras: extras,
}
