// Simulado da AV2 (Redes de Computadores, prof. Luiz Fernando T. de Farias).
// Questões "prova": cópia da AV2 2024/2 (26/11/2024). O gabarito vem da correção do professor
// na prova escaneada (nota 8,0: o aluno errou só a Q2 e a Q8, que estão com a resposta circulada).
// Questões "parecida": mesmo formato e assunto, escritas a partir dos slides das Aulas 05 a 09.

export type QuestaoAv2 = {
  id: string
  origem: 'prova' | 'parecida'
  tema: string
  /** Texto de contexto antes da pergunta (como na prova). */
  contexto?: string
  pergunta: string
  /** Afirmativas numeradas (I, II, III… ou 1, 2, 3…) ou colunas para associar. */
  itens?: string[]
  /** Segunda coluna, nas questões de associar. */
  coluna?: string[]
  opcoes: string[]
  correta: number
  explicacao: string
  fonte: string
}

export const QUESTOES_AV2: QuestaoAv2[] = [
  // ---------------- Q1 · Arquitetura de 5 camadas ----------------
  {
    id: 'p1',
    origem: 'prova',
    tema: 'Arquitetura de 5 camadas',
    contexto:
      'Cada unidade de dados de protocolo (PDU) desempenha um papel fundamental na comunicação em redes, desde o momento em que os dados são gerados pelo usuário até sua transmissão física.',
    pergunta: 'Associe as unidades de dados de protocolo (Coluna A) às suas principais características descritas na Coluna B.',
    itens: ['1. Quadro', '2. Pacote', '3. Segmento', '4. Mensagem'],
    coluna: [
      'a) Adiciona informações de cabeçalho e tráfego, como números de porta para entrega confiável.',
      'b) Contém os dados do usuário no formato bruto, sem encapsulamento adicional.',
      'c) Contém endereços físicos e verificação de erros para transmissão na camada física.',
      'd) Adiciona endereços lógicos (como IP) para roteamento entre redes diferentes.',
    ],
    opcoes: ['1-a, 2-b, 3-c, 4-d', '1-c, 2-d, 3-a, 4-b', '1-b, 2-a, 3-d, 4-c', '1-d, 2-c, 3-a, 4-b', '1-c, 2-b, 3-d, 4-a'],
    correta: 1,
    explicacao:
      '**Quadro** (enlace): endereços físicos (MAC) e verificação de erros (FCS) → c. **Pacote** (rede): endereço IP → d. **Segmento** (transporte): portas → a. **Mensagem** (aplicação): os dados do usuário → b.',
    fonte: 'AV2 2024/2 · Q1',
  },
  {
    id: 's1a',
    origem: 'parecida',
    tema: 'Arquitetura de 5 camadas',
    pergunta: 'Associe cada camada do modelo de 5 camadas à sua PDU.',
    itens: ['1. Aplicação', '2. Transporte', '3. Rede', '4. Enlace', '5. Física'],
    coluna: ['a) Bits', 'b) Quadro', 'c) Pacote', 'd) Segmento', 'e) Mensagem'],
    opcoes: ['1-e, 2-d, 3-c, 4-b, 5-a', '1-e, 2-c, 3-d, 4-b, 5-a', '1-d, 2-e, 3-c, 4-a, 5-b', '1-e, 2-d, 3-b, 4-c, 5-a', '1-a, 2-b, 3-c, 4-d, 5-e'],
    correta: 0,
    explicacao: 'Aplicação → **mensagem**; transporte → **segmento**; rede → **pacote**; enlace → **quadro**; física → **bits**.',
    fonte: 'Aula 05 p3 · Modelo de 5 camadas',
  },
  {
    id: 's1b',
    origem: 'parecida',
    tema: 'Arquitetura de 5 camadas',
    pergunta: 'Em qual PDU ficam a porta de origem e a porta de destino?',
    opcoes: ['Quadro', 'Pacote', 'Segmento', 'Mensagem', 'Bit'],
    correta: 2,
    explicacao: 'As portas estão no cabeçalho do **segmento** (camada de transporte). O pacote tem os endereços IP; o quadro, os endereços MAC.',
    fonte: 'Aula 06 · cabeçalho TCP',
  },

  // ---------------- Q2 · Protocolos ----------------
  {
    id: 'p2',
    origem: 'prova',
    tema: 'Arquitetura de 5 camadas',
    contexto:
      'Um professor de redes de computadores examina a importância dos protocolos de comunicação durante a troca de dados em uma rede. Ele explica que esses protocolos são essenciais para garantir a interoperabilidade entre diferentes dispositivos e aplicações.',
    pergunta: 'Quais das alternativas abaixo estão corretas?',
    itens: [
      'I. Protocolos de alto nível, como TCP, são utilizados para estabelecer conexões entre aplicações, garantindo a entrega confiável de dados.',
      'II. Protocolos de baixo nível, como Ethernet, operam apenas na camada de aplicação e não têm relação com a camada de enlace.',
      'III. A escolha de um protocolo deve considerar as necessidades da aplicação, como o UDP usado em transmissões de vídeo.',
    ],
    opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas as alternativas estão corretas.'],
    correta: 2,
    explicacao:
      'I certa: o TCP é orientado a conexão e confiável. **II errada**: Ethernet é protocolo de **enlace** (e física), não de aplicação. III certa: vídeo usa UDP porque prefere rapidez a retransmissão.',
    fonte: 'AV2 2024/2 · Q2',
  },
  {
    id: 's2a',
    origem: 'parecida',
    tema: 'Arquitetura de 5 camadas',
    pergunta: 'Avalie as afirmativas sobre protocolos.',
    itens: [
      'I. O IP é o protocolo da camada de rede e cuida do roteamento dos pacotes.',
      'II. O UDP garante a entrega dos datagramas e retransmite os que se perdem.',
      'III. Ethernet define regras das camadas de enlace e física.',
    ],
    opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
    correta: 2,
    explicacao: 'II errada: o UDP **não** garante entrega nem retransmite; quem faz isso é o TCP.',
    fonte: 'Aulas 05 e 06',
  },

  // ---------------- Q3 · Protocolos Internet ----------------
  {
    id: 'p3',
    origem: 'prova',
    tema: 'Protocolos Internet',
    contexto:
      'Considere que a rede de uma empresa usará os protocolos TCP/IP para facilitar o acesso do público às informações dessa empresa a partir de máquinas conectadas à Internet. Considere ainda que, ao serem descritos os protocolos que serão usados na rede, alguns erros foram cometidos.',
    pergunta: 'Estão corretas apenas as descrições:',
    itens: [
      'I. O Internet Protocol (IP) provê serviço não-orientado a conexão, e garante a entrega dos pacotes enviados. Além de garantir a entrega dos pacotes enviados, outra importante responsabilidade do IP é rotear os pacotes por meio de redes interligadas. O roteamento é feito usando-se endereços IP.',
      'II. O Transmission Control Protocol (TCP) provê um serviço orientado a conexão. Os dados são transferidos por meio de uma conexão em unidades conhecidas como segmentos. O TCP espera que a recepção dos segmentos transmitidos seja confirmada pelo destino e retransmite segmentos cuja recepção não seja confirmada.',
      'III. O User Datagram Protocol (UDP) provê um mecanismo para que aplicações possam comunicar-se usando datagramas. O UDP provê um protocolo de transporte orientado a conexão e não garante a entrega dos datagramas.',
      'IV. A emulação de terminal usará o protocolo TELNET, e a transferência de arquivos, o File Transfer Protocol (FTP). O correio eletrônico será provido pelo Simple Mail Transfer Protocol (SMTP) e as mensagens serão transferidas dos servidores de correio eletrônico para as máquinas dos usuários via Internet Mail Access Protocol (IMAP).',
    ],
    opcoes: ['I, II e III apenas.', 'I, II e IV apenas.', 'I e III apenas.', 'II e IV apenas.', 'I, II, III e IV.'],
    correta: 3,
    explicacao:
      '**I errada**: o IP **não garante** a entrega (é sem garantias). II certa. **III errada**: o UDP é **não orientado** a conexão. IV certa: TELNET, FTP, SMTP para enviar e IMAP para o usuário ler.',
    fonte: 'AV2 2024/2 · Q3',
  },
  {
    id: 's3a',
    origem: 'parecida',
    tema: 'Protocolos Internet',
    pergunta: 'Sobre IP, TCP e UDP, avalie:',
    itens: [
      'I. O TCP numera os segmentos e confirma o recebimento (ACK).',
      'II. O IP é orientado a conexão e confirma cada pacote.',
      'III. O UDP não estabelece conexão e não confirma o recebimento.',
      'IV. O TTL do cabeçalho IP impede que um pacote circule para sempre.',
    ],
    opcoes: ['I e II apenas.', 'I, III e IV apenas.', 'II e III apenas.', 'III e IV apenas.', 'I, II, III e IV.'],
    correta: 1,
    explicacao: 'II errada: o IP é **não orientado** a conexão e não confirma nada. As outras estão certas.',
    fonte: 'Aula 06',
  },
  {
    id: 's3b',
    origem: 'parecida',
    tema: 'Protocolos Internet',
    pergunta: 'Qual protocolo de e-mail é usado para ENVIAR mensagens até o servidor e entre servidores?',
    opcoes: ['SMTP', 'POP3', 'IMAP', 'FTP', 'HTTP'],
    correta: 0,
    explicacao: '**SMTP** envia. POP3 e IMAP são usados pelo usuário para receber/ler as mensagens.',
    fonte: 'Aula 06 · e-mail',
  },

  // ---------------- Q4 · Portas ----------------
  {
    id: 'p4',
    origem: 'prova',
    tema: 'Portas e Serviços Internet',
    contexto:
      'Os protocolos seguros são usados em diversas situações para proteger a troca de dados sensíveis na internet. Cada protocolo é especializado em uma função, como navegação, transferência de e-mails ou acesso remoto.',
    pergunta: 'Associe os protocolos listados abaixo às suas respectivas portas padrão.',
    itens: ['1. HTTP-S', '2. SMTP-S', '3. POP3-S', '4. IMAP4-S', '5. SSH'],
    coluna: ['a) Porta 587', 'b) Porta 993', 'c) Porta 995', 'd) Porta 22', 'e) Porta 443'],
    opcoes: ['1-a, 2-b, 3-d, 4-c, 5-e', '1-e, 2-a, 3-c, 4-b, 5-d', '1-d, 2-e, 3-a, 4-b, 5-c', '1-c, 2-d, 3-e, 4-a, 5-b', '1-b, 2-a, 3-d, 4-e, 5-c'],
    correta: 1,
    explicacao: 'HTTPS **443**, SMTP-S **587**, POP3-S **995**, IMAP4-S **993**, SSH **22**.',
    fonte: 'AV2 2024/2 · Q4',
  },
  {
    id: 's4a',
    origem: 'parecida',
    tema: 'Portas e Serviços Internet',
    pergunta: 'Associe os protocolos (sem segurança) às portas padrão.',
    itens: ['1. HTTP', '2. SMTP', '3. TELNET', '4. FTP (controle)', '5. POP3'],
    coluna: ['a) Porta 21', 'b) Porta 110', 'c) Porta 80', 'd) Porta 23', 'e) Porta 25'],
    opcoes: ['1-c, 2-e, 3-d, 4-a, 5-b', '1-c, 2-d, 3-e, 4-a, 5-b', '1-e, 2-c, 3-d, 4-b, 5-a', '1-c, 2-e, 3-a, 4-d, 5-b', '1-b, 2-e, 3-d, 4-a, 5-c'],
    correta: 0,
    explicacao: 'HTTP **80**, SMTP **25**, TELNET **23**, FTP **21** (controle; 20 é dados), POP3 **110**.',
    fonte: 'Aula 06 · portas',
  },
  {
    id: 's4b',
    origem: 'parecida',
    tema: 'Portas e Serviços Internet',
    pergunta: 'Qual protocolo de acesso remoto é criptografado e usa a porta 22?',
    opcoes: ['SSH', 'TELNET', 'RDP', 'FTP', 'SMTP'],
    correta: 0,
    explicacao: '**SSH** (22) é o acesso remoto seguro. TELNET (23) manda tudo em texto aberto.',
    fonte: 'Aula 06 · acesso remoto',
  },

  // ---------------- Q5 · CSMA/CD ----------------
  {
    id: 'p5',
    origem: 'prova',
    tema: 'Acesso ao Meio',
    contexto:
      'Em redes Ethernet, o protocolo CSMA/CD (Carrier Sense Multiple Access with Collision Detection) é utilizado para regular o acesso ao meio compartilhado e minimizar colisões. Ele permite que dispositivos compartilhem o meio de transmissão, detectando e respondendo a colisões para evitar perdas de dados.',
    pergunta: 'No contexto do protocolo CSMA/CD, o que ocorre quando uma colisão é detectada durante a transmissão de um quadro?',
    opcoes: [
      'Os dispositivos envolvidos na colisão continuam a transmitir até que o quadro seja entregue.',
      'Os dispositivos entram em estado de espera passivo até o meio ser reiniciado manualmente.',
      'O dispositivo com maior prioridade continua transmitindo, enquanto os outros aguardam um sinal de liberação do meio.',
      'A colisão é ignorada, e os dados corrompidos são retransmitidos automaticamente.',
      'A transmissão é imediatamente interrompida, e cada dispositivo aguarda um tempo aleatório antes de tentar retransmitir.',
    ],
    correta: 4,
    explicacao: 'Detectou colisão: **para de transmitir**, manda o sinal **jam** e cada estação espera um **tempo aleatório** antes de tentar de novo.',
    fonte: 'AV2 2024/2 · Q5',
  },
  {
    id: 's5a',
    origem: 'parecida',
    tema: 'Acesso ao Meio',
    pergunta: 'Qual a diferença entre CSMA/CD e CSMA/CA?',
    opcoes: [
      'CSMA/CD detecta colisões (Ethernet cabeada); CSMA/CA tenta evitá-las (Wi-Fi, 802.11).',
      'CSMA/CD é usado no Wi-Fi e CSMA/CA na Ethernet.',
      'Os dois usam passagem de token.',
      'CSMA/CA detecta colisões depois que acontecem; CSMA/CD as evita antes.',
      'Não há diferença: são nomes do mesmo método.',
    ],
    correta: 0,
    explicacao: '**CD** = *Collision Detection* (Ethernet, 802.3). **CA** = *Collision Avoidance* (redes sem fio, 802.11).',
    fonte: 'Aula 07',
  },
  {
    id: 's5b',
    origem: 'parecida',
    tema: 'Acesso ao Meio',
    pergunta: 'No CSMA/CD, o que a estação faz ANTES de transmitir?',
    opcoes: ['Escuta o meio para ver se está livre', 'Espera receber o token', 'Pede permissão ao roteador', 'Envia um sinal jam', 'Nada: transmite direto'],
    correta: 0,
    explicacao: '*Carrier Sense*: a estação **escuta o meio** e só transmite se ele estiver livre.',
    fonte: 'Aula 07',
  },

  // ---------------- Q6 · IEEE 802 ----------------
  {
    id: 'p6',
    origem: 'prova',
    tema: 'Acesso ao Meio',
    contexto:
      'A evolução das tecnologias de rede levou ao desenvolvimento de diferentes padrões IEEE 802, cada um com aplicações específicas. Esses padrões incluem tecnologias para redes cabeadas, redes sem fio de longa e curta distância e métodos para gerenciamento e segurança.',
    pergunta: 'Sobre os padrões IEEE 802, avalie as seguintes afirmativas:',
    itens: [
      '1. O padrão 802.5 implementa CSMA/CA como método de controle de acesso ao meio.',
      '2. O padrão 802.1 inclui especificações para o gerenciamento de redes locais.',
      '3. O padrão 802.3 suporta transmissões em modo half-duplex e full-duplex em redes cabeadas.',
      '4. O padrão 802.15 é utilizado para redes sem fio de longa distância em áreas metropolitanas.',
      '5. O padrão 802.11 pode operar em frequências de 2,4 GHz e 5 GHz para redes locais sem fio.',
    ],
    opcoes: [
      'Apenas as afirmativas 1, 2 e 4 estão corretas.',
      'Apenas as afirmativas 1, 3 e 5 estão corretas.',
      'Apenas as afirmativas 2, 3 e 5 estão corretas.',
      'Apenas as afirmativas 1, 2, 4 e 5 estão corretas.',
      'Todas as afirmativas estão corretas.',
    ],
    correta: 2,
    explicacao:
      '**1 errada**: 802.5 é **Token Ring** (passagem de token), não CSMA/CA. **4 errada**: 802.15 é rede **pessoal** (WPAN, Bluetooth); metropolitana é o 802.16 (WiMAX).',
    fonte: 'AV2 2024/2 · Q6',
  },
  {
    id: 's6a',
    origem: 'parecida',
    tema: 'Acesso ao Meio',
    pergunta: 'Associe cada padrão IEEE à tecnologia.',
    itens: ['1. 802.3', '2. 802.5', '3. 802.11', '4. 802.15', '5. 802.16'],
    coluna: ['a) Wi-Fi (WLAN)', 'b) Bluetooth (WPAN)', 'c) Ethernet', 'd) WiMAX (WMAN)', 'e) Token Ring'],
    opcoes: ['1-c, 2-e, 3-a, 4-b, 5-d', '1-c, 2-e, 3-a, 4-d, 5-b', '1-e, 2-c, 3-a, 4-b, 5-d', '1-a, 2-e, 3-c, 4-b, 5-d', '1-c, 2-a, 3-e, 4-b, 5-d'],
    correta: 0,
    explicacao: '802.3 Ethernet · 802.5 Token Ring · 802.11 Wi-Fi · 802.15 Bluetooth · 802.16 WiMAX.',
    fonte: 'Aulas 07 e 08',
  },

  // ---------------- Q7 · Meio físico ----------------
  {
    id: 'p7',
    origem: 'prova',
    tema: 'Meio Físico de transmissão',
    contexto:
      'Em uma análise de uma rede de uma grande empresa, o administrador observa que a escolha dos meios de transmissão é fundamental para garantir a integridade dos dados. Ele discute com sua equipe as características dos diferentes tipos de meios e como eles impactam a performance da rede.',
    pergunta: 'Quais das alternativas abaixo estão corretas?',
    itens: [
      'I. A escolha entre meios de transmissão guiados e não-guiados deve considerar fatores como custo, distância e tipo de dados a serem transmitidos.',
      'II. Sinais eletromagnéticos utilizados em meios de transmissão não-guiados são sempre mais rápidos que sinais transmitidos por cabos.',
      'III. Os meios de transmissão guiados, como cabos de fibra óptica, oferecem maior largura de banda e sofrem mais interferência do que os não-guiados.',
    ],
    opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas as alternativas estão corretas.'],
    correta: 0,
    explicacao:
      'II errada: "**sempre** mais rápidos" é falso (a fibra é muito rápida). III errada: a fibra é **imune** a interferências; sofre **menos**, não mais.',
    fonte: 'AV2 2024/2 · Q7',
  },
  {
    id: 's7a',
    origem: 'parecida',
    tema: 'Meio Físico de transmissão',
    pergunta: 'Avalie as afirmativas sobre meios físicos.',
    itens: [
      'I. No cobre, o calor causa atenuação (perda de intensidade do sinal).',
      'II. O campo magnético gera ruído em fios próximos (indução).',
      'III. A fibra ótica sofre ruído por indução magnética, como o cobre.',
    ],
    opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
    correta: 1,
    explicacao: 'III errada: a fibra transmite **luz** e é imune a interferências eletromagnéticas.',
    fonte: 'Aula 08',
  },
  {
    id: 's7b',
    origem: 'parecida',
    tema: 'Meio Físico de transmissão',
    pergunta: 'Para que serve o trançado dos pares no cabo UTP?',
    opcoes: ['Reduzir o ruído (cancelamento)', 'Aumentar a atenuação', 'Transmitir luz', 'Dispensar a placa de rede', 'Permitir passar de 100 m sem repetidor'],
    correta: 0,
    explicacao: 'O trançado faz o **cancelamento**: os campos dos dois fios se anulam e o ruído diminui.',
    fonte: 'Aula 08',
  },

  // ---------------- Q8 · 802.11 ----------------
  {
    id: 'p8',
    origem: 'prova',
    tema: 'Meio Físico de transmissão',
    contexto:
      'A escolha do padrão IEEE 802.11 influencia diretamente o desempenho e a compatibilidade de dispositivos em redes sem fio. Entender as diferenças de frequência, alcance e taxa de transmissão ajuda a determinar o padrão mais adequado para diferentes ambientes.',
    pergunta: 'Qual padrão IEEE 802.11 foi o primeiro a introduzir suporte simultâneo às bandas de 2,4 GHz e 5 GHz?',
    opcoes: ['802.11g', '802.11n', '802.11ac', '802.11ax', '802.11a'],
    correta: 1,
    explicacao: '**802.11n** (Wi-Fi 4, 2008): 2,4 **e** 5 GHz. A pegadinha é o 802.11a: ele usa só 5 GHz. O 802.11g e o b usam só 2,4 GHz; o ac, só 5 GHz.',
    fonte: 'AV2 2024/2 · Q8',
  },
  {
    id: 's8a',
    origem: 'parecida',
    tema: 'Meio Físico de transmissão',
    pergunta: 'Qual padrão 802.11 opera APENAS em 5 GHz e é chamado de Wi-Fi 5?',
    opcoes: ['802.11ac', '802.11n', '802.11g', '802.11b', '802.11ax'],
    correta: 0,
    explicacao: '**802.11ac** = Wi-Fi 5, só 5 GHz. 11n = Wi-Fi 4 (2,4 e 5). 11ax = Wi-Fi 6.',
    fonte: 'Aula 07 · tabela 802.11',
  },
  {
    id: 's8b',
    origem: 'parecida',
    tema: 'Meio Físico de transmissão',
    pergunta: 'Os padrões 802.11b e 802.11g operam em qual frequência?',
    opcoes: ['2,4 GHz', '5 GHz', '2,4 e 5 GHz', '60 GHz', '900 MHz'],
    correta: 0,
    explicacao: '11b e 11g: só **2,4 GHz**. O 11a usa 5 GHz.',
    fonte: 'Aula 07 · tabela 802.11',
  },

  // ---------------- Q9 · Equipamentos ----------------
  {
    id: 'p9',
    origem: 'prova',
    tema: 'Equipamentos de Redes',
    contexto:
      'Dispositivos como hubs, switches, modems, pontos de acesso e roteadores são frequentemente confundidos em termos da função realizada na rede. Diferenciá-los é crucial para entender como a comunicação ocorre em redes.',
    pergunta: 'Considere as funções dos dispositivos de rede no modelo OSI e analise as seguintes afirmativas:',
    itens: [
      '1. Roteadores utilizam tabelas de roteamento para encaminhar pacotes entre redes diferentes, funcionando na camada de Rede.',
      '2. Pontos de acesso operam na camada de Rede, interligando diferentes redes de computadores.',
      '3. Modems desempenham funções de modulação e demodulação, trabalhando exclusivamente na camada de física.',
      '4. Hubs não possuem inteligência de comutação ou roteamento e operam na camada Física.',
      '5. Switches realizam filtragem e encaminhamento de pacotes com base em endereços MAC, operando na camada de rede.',
    ],
    opcoes: [
      'Apenas as afirmativas 1, 3 e 4 estão corretas.',
      'Apenas as afirmativas 1, 2 e 5 estão corretas.',
      'Apenas as afirmativas 1, 2, 3 e 5 estão corretas.',
      'Apenas as afirmativas 2, 3 e 5 estão corretas.',
      'Apenas as afirmativas 1, 2, 3 e 4 estão corretas.',
    ],
    correta: 0,
    explicacao:
      '**2 errada**: ponto de acesso não interliga redes diferentes (isso é o roteador). **5 errada**: o switch usa MAC, mas opera na camada **2 (enlace)**, não na de rede. Roteador = camada 3; hub e modem = camada 1.',
    fonte: 'AV2 2024/2 · Q9',
  },
  {
    id: 's9a',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'Associe cada equipamento à camada do RM-OSI em que ele atua.',
    itens: ['1. Repetidor', '2. Hub', '3. Ponte (bridge)', '4. Switch', '5. Roteador'],
    coluna: ['a) Camada 1 (física)', 'b) Camada 2 (enlace)', 'c) Camada 3 (rede)'],
    opcoes: ['1-a, 2-a, 3-b, 4-b, 5-c', '1-a, 2-b, 3-b, 4-c, 5-c', '1-b, 2-a, 3-b, 4-b, 5-c', '1-a, 2-a, 3-a, 4-b, 5-c', '1-a, 2-a, 3-b, 4-c, 5-c'],
    correta: 0,
    explicacao: 'Repetidor e hub: **camada 1**. Ponte e switch: **camada 2**. Roteador: **camada 3**.',
    fonte: 'Aula 09 · classificação no RM-OSI',
  },
  {
    id: 's9b',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'Sobre o repetidor, avalie:',
    itens: [
      'I. Recebe e repete o sinal, estendendo a distância de conexão.',
      'II. Só pode ser usado entre meios físicos idênticos.',
      'III. Filtra o ruído, entregando um sinal limpo.',
      'IV. Aumenta o domínio de colisão.',
    ],
    opcoes: ['I e II apenas.', 'I, II e IV apenas.', 'I, III e IV apenas.', 'II e III apenas.', 'I, II, III e IV.'],
    correta: 1,
    explicacao: 'III errada: o slide diz que "os ruídos **também são amplificados**". O repetidor ainda provoca atraso e aumenta o domínio de colisão.',
    fonte: 'Aula 09 · p. 5–6',
  },
  {
    id: 's9c',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'Qual a diferença entre hub e switch na hora de repassar um quadro?',
    opcoes: [
      'O hub repete para todas as portas; o switch envia só para a porta onde está o destino.',
      'O switch repete para todas as portas; o hub envia só para o destino.',
      'Os dois usam a tabela de roteamento.',
      'O hub usa a tabela MAC e o switch não.',
      'Nenhum dos dois repassa quadros.',
    ],
    correta: 0,
    explicacao: 'Hub: repetidor multiportas, **difusão** para todas. Switch: bridge multiportas, usa a **tabela MAC** e manda só para a porta do destino.',
    fonte: 'Aula 09 · HUBs e Switch',
  },
  {
    id: 's9d',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'O que é o driver da placa de rede?',
    opcoes: [
      'O software que permite ao sistema operacional controlar a placa',
      'O conector RJ-45 da placa',
      'O cabo que liga a placa ao switch',
      'A tabela de rotas do roteador',
      'O endereço MAC gravado na placa',
    ],
    correta: 0,
    explicacao: '"**Driver** é o software que permite ao sistema operacional fazer o controle do dispositivo." Exemplos: NDIS (3COM e Microsoft), ODI (Novell e Apple), NDISWrapper (Linux).',
    fonte: 'Aula 09 · p. 2–3',
  },
  {
    id: 's9e',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'Qual NÃO é uma função do roteador segundo o slide?',
    opcoes: [
      'Repetir o sinal para todas as portas',
      'Escolher o melhor caminho para os pacotes',
      'Interligar as redes',
      'Gerenciar as tabelas de rotas',
      'Compatibilizar enlaces diferentes',
    ],
    correta: 0,
    explicacao: 'Repetir para todas as portas é o que o **hub** faz. O roteador escolhe rotas, interliga redes, gerencia tabelas e compatibiliza enlaces.',
    fonte: 'Aula 09 · Roteador',
  },
  {
    id: 's9f',
    origem: 'parecida',
    tema: 'Equipamentos de Redes',
    pergunta: 'Por que não se pode fechar um looping entre switches?',
    opcoes: ['Por causa da tabela MAC', 'Porque o hub não deixa', 'Porque o roteador bloqueia', 'Por causa do TTL do quadro', 'Porque o cabo UTP não permite'],
    correta: 0,
    explicacao: '"Não pode ser fechado um *looping* por causa da **tabela MAC**."',
    fonte: 'Aula 09 · Switch, limitação quanto à ligação',
  },

  // ---------------- Q10 · Domínios ----------------
  {
    id: 'p10',
    origem: 'prova',
    tema: 'Domínio de Colisão',
    contexto:
      'Em redes de computadores, o tráfego de dados pode ser organizado em domínios de colisão e domínios de broadcast, dependendo da topologia e dos dispositivos usados. Dispositivos como switches e roteadores desempenham papéis fundamentais na separação e gerenciamento desses domínios.',
    pergunta: 'Sobre os conceitos de domínio de colisão e domínio de broadcast e sua relação com switches e roteadores, analise as seguintes afirmativas:',
    itens: [
      '1. Um switch segmenta os domínios de colisão, criando um domínio por porta, mas mantém todos os dispositivos no mesmo domínio de broadcast.',
      '2. Mensagens de broadcast enviadas podem atravessar roteadores, alcançando outras redes conectadas.',
      '3. Um roteador separa tanto os domínios de colisão quanto os domínios de broadcast.',
      '4. Em uma rede Ethernet conectada por um hub, todos os dispositivos compartilham o mesmo domínio de colisão e o mesmo domínio de broadcast.',
    ],
    opcoes: [
      'Apenas as afirmativas 1, 2 e 3 estão corretas.',
      'Apenas as afirmativas 1, 3 e 4 estão corretas.',
      'Apenas as afirmativas 2, 3 e 4 estão corretas.',
      'Apenas a afirmativa 4 está correta.',
      'Todas as afirmativas estão corretas.',
    ],
    correta: 1,
    explicacao: '**2 errada**: o broadcast **não atravessa** o roteador; cada porta do roteador é um domínio de broadcast distinto.',
    fonte: 'AV2 2024/2 · Q10',
  },
  {
    id: 's10a',
    origem: 'parecida',
    tema: 'Domínio de Colisão',
    pergunta: 'Uma rede tem 2 hubs ligados entre si, com 3 computadores em cada. Quantos domínios de colisão existem?',
    opcoes: ['1', '2', '3', '6', '8'],
    correta: 0,
    explicacao: 'O hub repassa para todos os nós: os dois hubs e os 6 PCs ficam em **um único** domínio de colisão.',
    fonte: 'Aula 09 · HUBs, domínio de colisão',
  },
  {
    id: 's10b',
    origem: 'parecida',
    tema: 'Domínio de Colisão',
    pergunta: 'Uma ponte liga dois segmentos, cada um com 3 computadores. Quantos domínios de colisão existem?',
    opcoes: ['2', '1', '3', '6', '0'],
    correta: 0,
    explicacao: 'A ponte separa os segmentos: **domínio de colisão 1** e **domínio de colisão 2**.',
    fonte: 'Aula 09 · Ponte, domínio de colisão',
  },
  {
    id: 's10c',
    origem: 'parecida',
    tema: 'Domínio de Colisão',
    pergunta: 'Sobre os domínios, avalie:',
    itens: [
      'I. Quando a rede usa apenas switches, o domínio de colisão é eliminado.',
      'II. Todas as portas de um hub ou de um switch pertencem ao mesmo domínio de broadcast.',
      'III. O repetidor diminui o domínio de colisão.',
      'IV. Cada porta do roteador representa um domínio de broadcast distinto.',
    ],
    opcoes: ['I e II apenas.', 'I, II e IV apenas.', 'II e III apenas.', 'III e IV apenas.', 'I, II, III e IV.'],
    correta: 1,
    explicacao: 'III errada: o repetidor **aumenta** o domínio de colisão.',
    fonte: 'Aula 09 · Switch e Roteador',
  },
  {
    id: 's10d',
    origem: 'parecida',
    tema: 'Domínio de Colisão',
    pergunta: 'Um roteador com 3 portas liga 3 switches. Quantos domínios de broadcast existem?',
    opcoes: ['3', '1', '2', '6', 'Nenhum'],
    correta: 0,
    explicacao: 'Cada porta do roteador é um domínio de broadcast: **3**. Os switches não separam broadcast.',
    fonte: 'Aula 09 · Domínio de Broadcast',
  },
]
