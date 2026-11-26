// Revisão G2 2025/1 (Redes de Computadores, prof. Luiz Fernando T. de Farias, prova de 26/06/2025).
// Cópia das 10 questões da prova, na ordem e com as alternativas na ordem original.
// Gabarito pela correção do professor na prova escaneada (traços vermelhos).
// Q2 = B (Carrier Sense), confirmado pelo Lucas: o professor não aceitou a D (CD).
// Só questões da prova: nada de "parecidas", para não repetir o Simulado AV2.

import type { QuestaoAv2 } from '../av2/questoes'

export const QUESTOES_G2_2025: QuestaoAv2[] = [
  {
    id: 'g25-1',
    origem: 'prova',
    tema: 'PDUs',
    contexto:
      'Cada unidade de dados de protocolo (PDU) desempenha um papel fundamental na comunicação em redes, desde o momento em que os dados são gerados pelo usuário até sua transmissão física.',
    pergunta: 'Associe as PDUs (Coluna A) às suas principais características (Coluna B).',
    itens: ['1. Mensagem', '2. Segmento', '3. Pacote', '4. Quadro'],
    coluna: [
      'a) Adiciona endereços lógicos (como IP) para roteamento entre redes diferentes.',
      'b) Contém os dados do usuário no formato bruto, sem encapsulamento adicional.',
      'c) Contém endereços físicos e verificação de erros para transmissão na camada física.',
      'd) Adiciona informações de cabeçalho e tráfego, como números de porta para entrega confiável.',
    ],
    opcoes: ['1-a, 2-d, 3-c, 4-b.', '1-b, 2-d, 3-a, 4-c.', '1-c, 2-b, 3-a, 4-d.', '1-d, 2-b, 3-c, 4-a.', '1-a, 2-d, 3-b, 4-c.'],
    correta: 1,
    explicacao:
      '**Mensagem** (aplicação): dados do usuário → b. **Segmento** (transporte): portas → d. **Pacote** (rede): endereço IP → a. **Quadro** (enlace): MAC e verificação de erros → c.',
    fonte: 'Aula 05 p3 · Modelo de 5 camadas',
  },
  {
    id: 'g25-2',
    origem: 'prova',
    tema: 'Acesso ao Meio',
    contexto:
      'Nas versões antigas da Ethernet (coaxial ou hubs), o meio era compartilhado. A Ethernet adotou um mecanismo em que a estação, durante a transmissão, percebe se há outro sinal no meio; se houver, interrompe e tenta de novo depois de um tempo aleatório.',
    pergunta: 'Qual é o nome desse mecanismo?',
    opcoes: [
      'Controlador de Acesso Múltiplo (MA, Multiple Access).',
      'Sensor de Portadora (CS, Carrier Sense).',
      'Evasor de Colisão (CA, Collision Avoidance).',
      'Detector de Colisão (CD, Collision Detection).',
      'Ajustador de Contenção (CW, Contention Windows).',
    ],
    correta: 1,
    explicacao:
      'Gabarito do professor: **Sensor de Portadora (CS, Carrier Sense)**. A pista é "perceba se há outro sinal no meio": sentir o sinal (a portadora) no meio é o **CS**. Cuidado: a D (CD) parece certa por causa do "durante a transmissão", mas não foi a resposta aceita.',
    fonte: 'Aula 07 · CSMA/CD',
  },
  {
    id: 'g25-3',
    origem: 'prova',
    tema: 'Portas',
    pergunta: 'Qual alternativa apresenta a correspondência correta entre portas e protocolos?',
    opcoes: [
      '25:DNS ; 143:HTTP-S ; 465:SMTP-S ; 993:POP3-S',
      '22:SSH ; 53:DNS ; 443:HTTP-S ; 993:IMAP4-S',
      '21:FTP ; 22:SSH ; 443:HTTP-S ; 993:POP3-S',
      '21:FTP ; 53:DNS ; 587:SMTP-S ; 995:IMAP4-S',
      '22:SSH ; 25:DNS ; 143:HTTP-S ; 995:POP3-S',
    ],
    correta: 1,
    explicacao:
      'Tudo certo na B. Pegadinhas: **993 é IMAP4-S** e **995 é POP3-S** (a C troca). 25 é SMTP, não DNS. 143 é IMAP, não HTTPS.',
    fonte: 'Aula 06 · Serviços Internet',
  },
  {
    id: 'g25-4',
    origem: 'prova',
    tema: 'Serviços Internet',
    pergunta: 'Sobre serviços usados na Internet, está(ão) correta(s):',
    itens: [
      'I. Páginas web podem ser acessadas mais rapidamente usando servidores proxies, que melhoram o tempo de resposta quando usuários de uma empresa fazem solicitações na Internet.',
      'II. O controle remoto de um host pode ser feito com SSH, que permite login remoto, uso de recursos como uma impressora e cria um canal multiplexado por onde outros protocolos podem ser transferidos.',
      'III. No e-mail, um host na Internet fornece o SMTP para transferir mensagens do cliente ao servidor, enquanto no host do cliente é necessário um software que fornece o serviço POP3 para acessar as caixas postais no servidor.',
    ],
    opcoes: ['I, somente.', 'II, somente.', 'I e II, somente.', 'I e III, somente.', 'II e III, somente.'],
    correta: 2,
    explicacao:
      'I certa: o proxy guarda páginas em cache. II certa: o SSH faz login remoto e túneis. **III errada**: quem **fornece** o serviço POP3 é o **servidor** de e-mail; o cliente só o usa para baixar as mensagens.',
    fonte: 'Aula 06 · Serviços Internet',
  },
  {
    id: 'g25-5',
    origem: 'prova',
    tema: 'Meio Físico',
    pergunta: 'Qual a categoria de cabo par trançado mínima requerida pelo padrão 1000BASE-T?',
    opcoes: ['CAT 3.', 'CAT 1.', 'CAT 5e.', 'CAT 6.', 'CAT 7.'],
    correta: 2,
    explicacao:
      '1000BASE-T = **1 Gbps** em UTP. CAT 5 é do 100BASE-T. A menor categoria que atende o gigabit é a **CAT 5e**. CAT 6 e 7 também funcionam, mas não são o mínimo.',
    fonte: 'Aula 08 · Anexo Categoria de Cabos',
  },
  {
    id: 'g25-6',
    origem: 'prova',
    tema: 'TCP x UDP',
    contexto:
      'Num sistema distribuído para transações financeiras em tempo real, a equipe precisa escolher entre TCP e UDP para a comunicação entre microsserviços.',
    pergunta: 'Qual alternativa associa corretamente as características aos protocolos?',
    itens: [
      'I. É orientado a conexão.',
      'II. A entrega não é confiável.',
      'III. Não fornece controle de fluxo.',
      'IV. Divide as mensagens enviadas.',
      'V. Reagrupa as mensagens no destino.',
      'VI. Não verifica conexão antes de enviar.',
      'VII. Reenvia o que foi perdido.',
    ],
    opcoes: [
      'I, II, III, VI e VII são do UDP.',
      'I, III, V e VI são do UDP.',
      'I, IV, V e VI são do TCP.',
      'II, III e VI são do UDP.',
      'II, III, IV e V são do UDP.',
    ],
    correta: 3,
    explicacao:
      '**TCP**: I, IV, V e VII (conexão, divide, reagrupa, reenvia). **UDP**: II, III e VI (não confiável, sem controle de fluxo, sem conexão). A C erra por incluir a VI no TCP.',
    fonte: 'Aula 05 p2 · TCP/IP',
  },
  {
    id: 'g25-7',
    origem: 'prova',
    tema: 'Acesso ao Meio',
    contexto:
      'Na Ethernet com fio (802.3) um protocolo detecta colisões durante a transmissão. No Wi-Fi (802.11) não dá para detectar colisões da mesma forma, então outro protocolo tenta evitá-las.',
    pergunta: 'Qual é esse protocolo usado no Wi-Fi?',
    opcoes: [
      'OFDM (Orthogonal Frequency Division Multiplexing)',
      'OFDMA (Orthogonal Frequency Division Multiple Access)',
      'CSMA/CD (Collision Detection)',
      'CSMA/CA (Collision Avoidance)',
      'PPPoE (Point-to-Point Protocol over Ethernet)',
    ],
    correta: 3,
    explicacao:
      'Sem fio não dá para ouvir enquanto transmite, então o Wi-Fi **evita** colisões: **CSMA/CA**. O CSMA/CD é o da Ethernet com fio. OFDM e OFDMA são técnicas de modulação e multiplexação, não controle de acesso.',
    fonte: 'Aula 07 · CSMA/CA',
  },
  {
    id: 'g25-8',
    origem: 'prova',
    tema: 'Padrões IEEE 802',
    pergunta: 'Associe as descrições aos padrões IEEE 802.',
    itens: [
      'A. Redes pessoais sem fio (WPAN).',
      'B. Wireless LAN (redes locais sem fio).',
      'C. Controle do enlace lógico.',
      'D. Controle de rede local e metropolitana.',
      'E. Rádio de banda larga (acesso sem fio de longa distância).',
    ],
    opcoes: [
      'A→802.3; B→802.11; C→802.2; D→802.1; E→802.15',
      'A→802.2; B→802.11; C→802.15; D→802.16; E→802.15',
      'A→802.16; B→802.15; C→802.11; D→802.2; E→802.1',
      'A→802.3; B→802.11; C→802.2; D→802.1; E→802.16',
      'A→802.3; B→802.2; C→802.1; D→802.15; E→802.16',
    ],
    correta: 3,
    explicacao:
      'Certo: **802.11** Wi-Fi, **802.2** LLC (enlace lógico), **802.1** gerência de LAN/MAN, **802.16** WiMAX (banda larga sem fio). A prova tem um erro: WPAN é **802.15**, mas nenhuma alternativa traz isso. A **D** é a única com os outros quatro certos.',
    fonte: 'Aula 07 · Padrões IEEE 802',
  },
  {
    id: 'g25-9',
    origem: 'prova',
    tema: 'Domínio de Colisão',
    contexto:
      'Paul foi contratado como administrador de redes. A empresa usava hubs e ele os substituiu por switches para melhorar desempenho e eficiência.',
    pergunta: 'Qual resultado é correto em relação ao funcionamento da rede?',
    opcoes: [
      'Reduziu o desempenho da rede.',
      'Reduziu a eficiência da rede.',
      'A largura de banda foi aumentada.',
      'O domínio de colisão foi estendido.',
      'Aumentou o número de domínios de colisão.',
    ],
    correta: 4,
    explicacao:
      'No hub tudo é **um** domínio de colisão. No switch **cada porta** é um domínio de colisão, então o número de domínios **aumenta** (e cada um fica menor). A largura de banda do cabo não muda.',
    fonte: 'Aula 09 · Switch e Domínio de Colisão',
  },
  {
    id: 'g25-10',
    origem: 'prova',
    tema: 'Equipamentos x OSI',
    contexto:
      'Uma empresa amplia a rede sem fio, melhora o roteamento entre setores e a comunicação dos dispositivos cabeados. O administrador revisa em que camada do OSI atua a função principal de cada equipamento.',
    pergunta: 'Access Point, Switch e Roteador estão associados, respectivamente, a quais camadas?',
    opcoes: ['Rede, enlace e rede.', 'Enlace, rede e enlace.', 'Enlace, enlace e rede.', 'Física, física e enlace.', 'Física, rede e rede.'],
    correta: 2,
    explicacao:
      'O **AP** é uma ponte entre o sem fio e o cabeado (**enlace**, usa MAC). O **switch** encaminha por MAC (**enlace**). O **roteador** encaminha por IP (**rede**).',
    fonte: 'Aula 09 · Equipamentos',
  },
]
