import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaArpanet } from './cenas/Arpanet'
import { CenaCinco } from './cenas/Cinco'
import { CenaOrganizacao } from './cenas/Organizacao'
import { CenaPdu } from './cenas/Pdu'
import { CenaProtocolos } from './cenas/Protocolos'
import { CenaServicos } from './cenas/Servicos'
import { CenaSolicitacao } from './cenas/Solicitacao'
import { CenaTcpIp } from './cenas/TcpIp'

// Trilha 6 — TCP/IP e modelo de 5 camadas. PDFs: REDES-05p2_TCPIP.pdf (8 páginas) e
// REDES-05p3_Modelo-5-Camadas.pdf (5 páginas), 2 slides por página; a "página" das citações é
// a página do PDF. O sumário da p2 cita "Serviços e Portas", mas esse slide está em branco (p. 4).
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const p2 = (pagina: number | string): Fonte => ({ aula: 'Aula 05 p2', pagina })
const p3 = (pagina: number | string): Fonte => ({ aula: 'Aula 05 p3', pagina })

// ---------- 6.1 ----------

const fase61: Fase = {
  id: '6-1',
  titulo: 'Surgimento da Internet',
  resumo: 'A ARPANET: quem criou, para quê, com quais tecnologias e como virou a Internet.',
  Cena: CenaArpanet,
  camera: [0, 9.5, 10],
  alvoCamera: [0, 0, 0.3],
  passos: [
    {
      titulo: 'A ARPANET',
      texto: `
> **ARPANET** → Rede criada em 1962 pela agencia de projetos de pesquisas avançado (ARPA, *Advanced Research Projects Agency*) do Departamento de Defesa (DoD) dos EUA.

No chão está o mapa do slide: o território dos EUA em amarelo, os nós da rede em vermelho (universidades e centros de pesquisa, como UCLA, SRI, UTAH, MIT e HARVARD) e os *links* entre eles.`,
      fonte: p2(2),
      cena: { modo: 'mapa' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'ARPANET: 1962 ou 1969?',
          noSlide: 'A ARPANET foi criada em **1962**.',
          naPratica: 'Em 1962 surgiram as primeiras ideias e pesquisas de rede da ARPA. A ARPANET entrou no ar em **1969**, ligando a UCLA ao SRI. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: 'O objetivo',
      texto: `
> **Objetivo**: Manter interconectada as diferentes redes militares dos EUA, caso houvesse a perda de conexão em alguma das conexões (*links*).

Na cena, o *link* entre GWC e CASE caiu (✗). Como a rede tem vários caminhos, os dados **desviam** por outro e ainda chegam ao MIT.`,
      fonte: p2(2),
      cena: { modo: 'objetivo' },
    },
    {
      titulo: 'Linhas de 56 kbps, pacotes e TCP/IP',
      texto: `
> - A conexão foi obtida com linhas alugadas ponto a ponto convencional de 56 kbps (linhas telefônicas).
> - Neste projeto foram desenvolvidas as tecnologias de **comutação de pacotes** e o **conjunto de protocolos TCP/IP**.

Na cena, a mensagem vai em três pacotes (1, 2 e 3), cada um por um caminho, até o MIT.`,
      fonte: p2(2),
      cena: { modo: 'tecnologias' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Aula 02',
          texto: 'A **comutação de pacotes** é a da fase 2.6: a mensagem é quebrada em pacotes, e cada pacote segue por um caminho escolhido até o destino, onde são reagrupados.',
        },
      ],
    },
    {
      titulo: '1990: surge a Internet',
      texto: `
> Em 1990 a **ARPANET** foi desativada, surgindo a INTERNET … para acomodar as empresas comerciais.

Os nós da ARPANET ficam cinza (desativada) e entram as **empresas** (azul). É a Internet que usamos hoje, com o conjunto de protocolos TCP/IP criado no projeto da ARPANET.`,
      fonte: p2(2),
      cena: { modo: 'internet' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Quem criou a ARPANET, segundo o slide?',
      opcoes: [
        'A ARPA, do Departamento de Defesa (DoD) dos EUA',
        'A ISO, organização internacional de padrões',
        'A ISOC (Internet Society)',
        'Um grupo de empresas comerciais',
      ],
      correta: 0,
      explicacao: 'ARPANET: rede criada pela agência de projetos de pesquisas avançado (**ARPA**, *Advanced Research Projects Agency*) do **Departamento de Defesa (DoD)** dos EUA.',
      fonte: p2(2),
      cena: { modo: 'mapa', semAno: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Segundo o slide, em que ano a ARPANET foi criada?',
      campos: [{ rotulo: 'Ano', resposta: '1962', formato: 'numero' }],
      explicacao: '“ARPANET → Rede criada em **1962** pela agencia de projetos de pesquisas avançado (ARPA…)”. (Na prática ela entrou no ar em 1969; na prova, responda como o slide.)',
      fonte: p2(2),
      cena: { modo: 'mapa', semAno: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual era o objetivo da ARPANET?',
      opcoes: [
        'Manter interconectadas as redes militares dos EUA, mesmo se algum link fosse perdido',
        'Vender acesso à Internet para as empresas',
        'Ligar os computadores de casa à televisão',
        'Substituir as linhas telefônicas',
      ],
      correta: 0,
      explicacao: '“**Objetivo**: Manter interconectada as diferentes redes militares dos EUA, caso houvesse a perda de conexão em alguma das conexões (*links*).”',
      fonte: p2(2),
      cena: { modo: 'objetivo' },
    },
    {
      tipo: 'digitar',
      enunciado: 'Qual era a velocidade das linhas alugadas (telefônicas) da ARPANET, em kbps?',
      campos: [{ rotulo: 'kbps', resposta: '56', formato: 'numero' }],
      explicacao: '“A conexão foi obtida com linhas alugadas ponto a ponto convencional de **56 kbps** (linhas telefônicas).”',
      fonte: p2(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Quais tecnologias foram desenvolvidas no projeto da ARPANET?',
      opcoes: ['Comutação de pacotes e o conjunto de protocolos TCP/IP', 'Comutação de circuitos e o telefone', 'Wi-Fi e Bluetooth', 'Fibra ótica e cabo coaxial'],
      correta: 0,
      explicacao: '“Neste projeto foram desenvolvidas as tecnologias de **comutação de pacotes** e o **conjunto de protocolos TCP/IP**.”',
      fonte: p2(2),
      cena: { modo: 'tecnologias' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que aconteceu em 1990?',
      opcoes: [
        'A ARPANET foi desativada, surgindo a INTERNET para acomodar as empresas comerciais',
        'A ARPANET foi criada',
        'O TCP/IP foi desativado',
        'A ISOC foi fundada',
      ],
      correta: 0,
      explicacao: '“Em 1990 a **ARPANET** foi desativada, surgindo a INTERNET … para acomodar as empresas comerciais.” (A ISOC é de 1992.)',
      fonte: p2(2),
      cena: { modo: 'internet' },
    },
  ],
}

// ---------- 6.2 ----------

const fase62: Fase = {
  id: '6-2',
  titulo: 'Pilha e relação entre protocolos',
  resumo: 'O quadro da pilha TCP/IP por grupos e o que HTTP, DNS, DHCP, TCP, UDP e IPv4 fornecem.',
  Cena: CenaProtocolos,
  camera: [0, 3.4, 14.5],
  alvoCamera: [0.3, 2.5, 0],
  passos: [
    {
      titulo: 'Pilha de Protocolos TCP/IP',
      texto: `
O slide mostra um quadro com **alguns protocolos da pilha** TCP/IP (o próprio slide diz: “Alguns protocolos da pilha…”). São 40, e a **cor** diz o grupo de cada um:

- Rede e Transporte (cinza)
- Página Web e E-mail (amarelo-claro)
- Operações Remotas (azul)
- Gerência e Configuração (rosa)
- Multimídia (verde)
- Roteamento (laranja)

Não precisa decorar os 40: nas próximas páginas os slides focam em poucos (HTTP, SMTP, POP3, IMAP4, FTP, TELNET, SSH, DNS, DHCP, TCP, UDP e IPv4).`,
      fonte: p2(3),
      cena: { modo: 'tabela' },
    },
    {
      titulo: 'Rede e Transporte',
      texto: `
Os cinzas são a base: **ARP, ICMP, IPSec, IPv4, IPv6, TCP, TLS e UDP**.

O **IPv4** é o protocolo dos endereços das Trilhas 3 e 4; o **TCP** e o **UDP** fazem a entrega das mensagens (próximos passos).`,
      fonte: p2(3),
      cena: { modo: 'tabela', grupo: 'rede' },
    },
    {
      titulo: 'Web, e-mail, operações remotas e gerência',
      texto: `
- **Página Web e E-mail**: HTTP, HTTPS, IMAP4-S, POP3-S, SMTP-S.
- **Operações Remotas**: FTP, MTP, RDP, SMB, SSH, TELNET.
- **Gerência e Configuração**: BOOTP, DHCP, DNS, LDAP, NTP, SNMP.

O **DHCP** e o **DNS** da Aula 04 estão em **Gerência e Configuração**.`,
      fonte: p2(3),
      cena: {
        modo: 'tabela',
        destaque: 'HTTP,HTTPS,IMAP4-S,POP3-S,SMTP-S,FTP,MTP,RDP,SMB,SSH,TELNET,BOOTP,DHCP,DNS,LDAP,NTP,SNMP',
      },
    },
    {
      titulo: 'Multimídia e roteamento',
      texto: `
- **Multimídia**: H323, IGMP, MGCP, RSVP, RTCP, RTP, RTSP, SCTP, SIP, XMPP.
- **Roteamento**: BGP, MPLS, OSPF, RIP, VRRP.`,
      fonte: p2(3),
      cena: { modo: 'tabela', destaque: 'H323,IGMP,MGCP,RSVP,RTCP,RTP,RTSP,SCTP,SIP,XMPP,BGP,MPLS,OSPF,RIP,VRRP' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Alguns nomes conhecidos',
          texto: 'Não está no slide: o **SIP** e o **RTP** são usados em chamadas de voz pela Internet (VoIP); o **OSPF** e o **BGP** são usados pelos roteadores para descobrir caminhos.',
        },
      ],
    },
    {
      titulo: 'Relação entre protocolos',
      texto: `
A figura **Relação entre Protocolos** mostra quem usa quem: os de cima usam o serviço dos de baixo.

- **HTTP** → usa o **TCP**.
- **DHCP** → usa o **UDP**.
- **DNS** → tem seta para o **TCP** e para o **UDP**.
- **TCP** e **UDP** → usam o **IPv4**.

Os quadros amarelos dizem o que cada um **fornece**.`,
      fonte: p2(3),
      cena: { modo: 'relacao' },
      explorar: {
        instrucao: 'Clique nos 4 marcadores para ler o que cada protocolo fornece.',
        alvos: {
          http: { titulo: 'HTTP', texto: '> **Fornece**: o serviço de Páginas Web' },
          tcp: { titulo: 'TCP', texto: '> **Fornece**: o serviço de entrega com garantia e orientado à conexão.' },
          udp: { titulo: 'UDP', texto: '> **Fornece**: o serviço de entrega sem garantias e sem conexão.' },
          ipv4: { titulo: 'IPv4', texto: '> **Fornece**: o mecanismo de entrega não-confiável, sem conexão, fazendo o endereçamento lógico dos pacotes na rede.' },
        },
      },
    },
    {
      titulo: 'TCP × UDP',
      texto: `
A diferença está no que eles fornecem:

- **TCP**: entrega **com garantia** e **orientada à conexão**.
- **UDP**: entrega **sem garantias** e **sem conexão**.

E o **IPv4**, embaixo dos dois, é **não-confiável** e **sem conexão**: ele só faz o **endereçamento lógico** dos pacotes. Na cena, os dois dados do DNS descem um por cada lado.`,
      fonte: p2(3),
      cena: { modo: 'relacao', foco: 'dns' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'Quem dá a garantia?',
          texto: 'O IPv4 é **não-confiável**. Quem garante a entrega é o **TCP**, que roda em cima dele. O UDP também usa o IPv4 e também não garante.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'No quadro do slide (na tela, sem as cores), cada protocolo é de qual grupo?',
      grupos: ['Rede e Transporte', 'Página Web e E-mail', 'Operações Remotas', 'Gerência e Configuração', 'Multimídia', 'Roteamento'],
      itens: [
        { texto: 'TCP', grupo: 0 },
        { texto: 'HTTPS', grupo: 1 },
        { texto: 'SSH', grupo: 2 },
        { texto: 'DHCP', grupo: 3 },
        { texto: 'DNS', grupo: 3 },
        { texto: 'RTP', grupo: 4 },
        { texto: 'OSPF', grupo: 5 },
      ],
      explicacao: 'Pelas cores do quadro: TCP é **Rede e Transporte**; HTTPS, **Página Web e E-mail**; SSH, **Operações Remotas**; DHCP e DNS, **Gerência e Configuração**; RTP, **Multimídia**; OSPF, **Roteamento**.',
      fonte: p2(3),
      cena: { modo: 'tabela', semCores: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a figura, o que o TCP fornece?',
      opcoes: [
        'O serviço de entrega com garantia e orientado à conexão',
        'O serviço de entrega sem garantias e sem conexão',
        'O endereçamento lógico dos pacotes na rede',
        'O serviço de Páginas Web',
      ],
      correta: 0,
      explicacao: 'TCP — “**Fornece**: o serviço de entrega **com garantia** e **orientado à conexão**.” Sem garantias e sem conexão é o UDP.',
      fonte: p2(3),
      cena: { modo: 'relacao', semFornece: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a figura, o que o UDP fornece?',
      opcoes: [
        'O serviço de entrega sem garantias e sem conexão',
        'O serviço de entrega com garantia e orientado à conexão',
        'O serviço de configuração automática de hosts',
        'O mecanismo de entrega confiável',
      ],
      correta: 0,
      explicacao: 'UDP — “**Fornece**: o serviço de entrega **sem garantias** e **sem conexão**.”',
      fonte: p2(3),
      cena: { modo: 'relacao', semFornece: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a figura, o que o IPv4 fornece?',
      opcoes: [
        'O mecanismo de entrega não-confiável, sem conexão, fazendo o endereçamento lógico dos pacotes',
        'O serviço de entrega com garantia',
        'O serviço de Páginas Web',
        'A resolução de nomes de domínio',
      ],
      correta: 0,
      explicacao: 'IPv4 — “**Fornece**: o mecanismo de entrega **não-confiável**, **sem conexão**, fazendo o **endereçamento lógico** dos pacotes na rede.”',
      fonte: p2(3),
      cena: { modo: 'relacao', semFornece: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Na figura, cada protocolo de cima tem seta para qual protocolo de entrega?',
      grupos: ['Só TCP', 'Só UDP', 'TCP e UDP'],
      itens: [
        { texto: 'HTTP', grupo: 0 },
        { texto: 'DHCP', grupo: 1 },
        { texto: 'DNS', grupo: 2 },
      ],
      explicacao: 'Na figura: HTTP → **TCP**; DHCP → **UDP**; o DNS tem seta para os **dois**.',
      fonte: p2(3),
      cena: { modo: 'relacao', semFornece: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo a figura, o que o DHCP fornece?',
      opcoes: ['Serviço de configuração automática de hosts', 'O serviço de Páginas Web', 'A entrega com garantia', 'O endereçamento físico (MAC)'],
      correta: 0,
      explicacao: 'DHCP — “**Fornece**: serviço de configura. automática de *hosts*.” (É o mesmo DHCP da Aula 04.)',
      fonte: p2(3),
      cena: { modo: 'relacao', foco: 'dhcp', semFornece: true },
    },
  ],
}

// ---------- 6.3 ----------

const fase63: Fase = {
  id: '6-3',
  titulo: 'Protocolos da Internet',
  resumo: 'HTTP, SMTP, POP3, IMAP4, FTP, TELNET, SSH, DNS e DHCP: o serviço de cada um.',
  Cena: CenaServicos,
  camera: [0, 7, 11.5],
  alvoCamera: [0, 0.9, 0],
  passos: [
    {
      titulo: 'Protocolos Internet',
      texto: `
O slide **Protocolos Internet** liga cada protocolo ao seu serviço:

- **HTTP**, **HTTPS** ⇨ Transferência de **Hipertexto** (Página WEB)
- **SMTP**, **SMTP-S** ⇨ Envio de **E-mail**
- **POP3/S**, **IMAP4/S** ⇨ Recebimento de **E-mail**
- **FTP** ⇨ **Transferência de Arquivos**
- **TELNET**, **SSH** ⇨ Protocolos de **Controle Remoto**
- **DNS** ⇨ **Resolução de Nome de Domínios**
- **DHCP** ⇨ **Configuração Automática de Hosts**

Na cena, o usuário está na frente e cada servidor atrás tem os seus protocolos.`,
      fonte: p2(4),
      cena: { modo: 'todos' },
      explorar: {
        instrucao: 'Clique nos 6 servidores.',
        alvos: {
          web: { titulo: 'HTTP · HTTPS', texto: 'Transferência de **Hipertexto** (Página WEB).' },
          email: { titulo: 'SMTP · POP3 · IMAP4', texto: 'SMTP/SMTP-S: **envio** de e-mail. POP3/S e IMAP4/S: **recebimento** de e-mail.' },
          ftp: { titulo: 'FTP', texto: '**Transferência de Arquivos**.' },
          remoto: { titulo: 'TELNET · SSH', texto: 'Protocolos de **Controle Remoto**: usar outro computador pela rede.' },
          dns: { titulo: 'DNS', texto: '**Resolução de Nome de Domínios**: transforma o nome (www.google.com.br) no número IP.' },
          dhcp: { titulo: 'DHCP', texto: '**Configuração Automática de Hosts**: IP, máscara, gateway, DNS.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Serviços e Portas',
          texto: 'O sumário do PDF cita “Serviços e Portas”, mas esse slide está em branco. Não está no slide: cada serviço atende numa **porta**, por exemplo HTTP 80, HTTPS 443, SMTP 25, POP3 110, IMAP 143, FTP 21, SSH 22, TELNET 23, DNS 53 e DHCP 67/68.',
        },
      ],
    },
    {
      titulo: 'Página WEB: HTTP e HTTPS',
      texto: `
> **HTTP** **HTTPS** ⇨ Transferência de **Hipertexto** (Página WEB)

O navegador pede a página (vermelho) e o servidor Web manda a página (azul). **Hipertexto** é o texto com *links* para outras páginas.`,
      fonte: p2(4),
      cena: { modo: 'web' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O “S” do HTTPS',
          texto: 'O “S” é de **seguro**: o HTTPS é o HTTP com criptografia. A cronologia dos RFCs (fase 6.4) mostra isso no título do HTTP-S: *HTTP over TLS*.',
        },
      ],
    },
    {
      titulo: 'E-mail: enviar e receber',
      texto: `
> **SMTP** **SMTP-S** ⇨ Envio de **E-mail**

> **POP3/S** **IMAP4/S** ⇨ Recebimento de **E-mail**

Para **enviar** o e-mail até o servidor, o SMTP; para **receber** os e-mails do servidor, o POP3 ou o IMAP4. O “S” no fim é a versão segura de cada um.`,
      fonte: p2(4),
      cena: { modo: 'email' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'SMTP envia, POP3/IMAP4 recebem',
          texto: 'Os dois grupos são de e-mail. Na prova, preste atenção no verbo: **envio** = SMTP; **recebimento** = POP3 ou IMAP4.',
        },
      ],
    },
    {
      titulo: 'Arquivos: FTP',
      texto: `
> **FTP** ⇨ **Transferência de Arquivos**

FTP é *File Transfer Protocol*: enviar arquivos para o servidor ou baixar arquivos dele. Na cena, vão e voltam arquivos de vários tipos.`,
      fonte: p2(4),
      cena: { modo: 'ftp' },
    },
    {
      titulo: 'Controle remoto: TELNET e SSH',
      texto: `
> **TELNET** **SSH** ⇨ Protocolos de **Controle Remoto**

O usuário digita um comando aqui e ele roda no **computador remoto**; o resultado volta para a tela.`,
      fonte: p2(4),
      cena: { modo: 'remoto' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'TELNET × SSH',
          texto: 'Não está no slide: o TELNET manda tudo sem criptografia (até a senha); o **SSH** (*Secure Shell*) é a versão segura, por isso hoje se usa o SSH.',
        },
      ],
    },
    {
      titulo: 'DNS: nome → IP',
      texto: `
> **DNS** ⇨ **Resolução de Nome de Domínios**

O usuário pergunta pelo nome **www.google.com.br** e o servidor DNS responde com o **número IP**. É o DNS da Aula 04 (fase 4.6).`,
      fonte: p2(4),
      cena: { modo: 'dns' },
    },
    {
      titulo: 'DHCP: configuração automática',
      texto: `
> **DHCP** ⇨ **Configuração Automática de Hosts**

O computador pede a configuração e o servidor DHCP entrega IP, máscara, gateway e DNS. É o DHCP da Aula 04 (fase 4.5).`,
      fonte: p2(4),
      cena: { modo: 'dhcp' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada protocolo de e-mail é de envio ou de recebimento?',
      grupos: ['Envio de E-mail', 'Recebimento de E-mail'],
      itens: [
        { texto: 'SMTP', grupo: 0 },
        { texto: 'SMTP-S', grupo: 0 },
        { texto: 'POP3/S', grupo: 1 },
        { texto: 'IMAP4/S', grupo: 1 },
      ],
      explicacao: 'SMTP e SMTP-S ⇨ **Envio** de E-mail. POP3/S e IMAP4/S ⇨ **Recebimento** de E-mail.',
      fonte: p2(4),
      cena: { modo: 'email', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na cena, o usuário pergunta “www.google.com.br ?” e recebe o número IP. Qual protocolo faz isso?',
      opcoes: ['DNS', 'DHCP', 'HTTP', 'FTP'],
      correta: 0,
      explicacao: '**DNS** ⇨ Resolução de Nome de Domínios.',
      fonte: p2(4),
      cena: { modo: 'dns', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual protocolo faz a Transferência de Arquivos?',
      opcoes: ['FTP', 'SMTP', 'SSH', 'DHCP'],
      correta: 0,
      explicacao: '**FTP** ⇨ Transferência de Arquivos.',
      fonte: p2(4),
      cena: { modo: 'ftp', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'TELNET e SSH são protocolos de…',
      opcoes: ['Controle Remoto', 'Envio de E-mail', 'Resolução de Nome de Domínios', 'Transferência de Hipertexto'],
      correta: 0,
      explicacao: '**TELNET**, **SSH** ⇨ Protocolos de **Controle Remoto**.',
      fonte: p2(4),
      cena: { modo: 'remoto', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O computador recebeu IP, máscara, gateway e DNS sozinho. Qual protocolo fez isso?',
      opcoes: ['DHCP', 'DNS', 'HTTP', 'POP3'],
      correta: 0,
      explicacao: '**DHCP** ⇨ Configuração Automática de *Hosts*.',
      fonte: p2(4),
      cena: { modo: 'dhcp', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'HTTP e HTTPS fazem a…',
      opcoes: ['Transferência de Hipertexto (Página WEB)', 'Transferência de Arquivos', 'Configuração Automática de Hosts', 'Recebimento de E-mail'],
      correta: 0,
      explicacao: '**HTTP**, **HTTPS** ⇨ Transferência de **Hipertexto** (Página WEB).',
      fonte: p2(4),
      cena: { modo: 'web', semNomes: true },
    },
  ],
}

// ---------- 6.4 ----------

const fase64: Fase = {
  id: '6-4',
  titulo: 'Organização da Internet e RFCs',
  resumo: 'ISOC, IAB, IETF, IRTF, ICANN e IANA; e a cronologia das normas (RFC).',
  Cena: CenaOrganizacao,
  camera: [0, 4.6, 13.5],
  alvoCamera: [0, 2.0, 0],
  passos: [
    {
      titulo: 'Quem dirige a Internet',
      texto: `
O organograma do slide tem dois grupos:

- **ISOC** (*Internet Society*), com **IAB**, **IETF**, **IRTF** e o **RFC Editor** (*Request for Comment Editor*).
- **ICANN** (*Internet Corporation for Assigned Names and Numbers*), com a **IANA** (*Internet Assigned Numbers Authority*).

As linhas pontilhadas saem do IAB, do IETF e do IRTF e chegam na IANA.

> **ISOC** e **ICANN** são grupos influentes de direção da Internet.`,
      fonte: p2(5),
      cena: { modo: 'orgs' },
      explorar: {
        instrucao: 'Clique nos 5 marcadores para ver o que cada organização faz.',
        alvos: {
          isoc: { titulo: 'ISOC · Internet Society', texto: 'Organização internacional não lucrativa, fundada em **1992**.' },
          iab: { titulo: 'IAB · Internet Architecture Board', texto: 'Conselho de Arquitetura da Internet: grupo de **aconselhamento tecnológico** do ISOC.' },
          ietf: { titulo: 'IETF · Internet Engineering Task Force', texto: 'Força-Tarefa de Engenharia: pesquisas de **curta duração**.' },
          irtf: { titulo: 'IRTF · Internet Research Task Force', texto: 'Força-Tarefa de Pesquisas: pesquisas a **longo prazo**.' },
          iana: { titulo: 'IANA · Internet Assigned Numbers Authority', texto: 'Autoridade para Atribuição de Números da Internet: **departamento da ICANN**.' },
        },
      },
    },
    {
      titulo: 'Internet Society (ISOC)',
      texto: `
> Organização internacional não lucrativa, fundada em 1992, dedicada à expansão, desenvolvimento e acessibilidade da Internet.

> Atividades/competências incluem:
> - Desenvolvimento e manutenção de padrões
> - Evolução das tecnologias da Internet
> - Educação e investigação no domínio da Internet
> - Desenvolvimento de infraestruturas Internet`,
      fonte: p2(5),
      cena: { modo: 'orgs', foco: 'isoc' },
    },
    {
      titulo: 'IAB: Conselho de Arquitetura',
      texto: `
**IAB** — *Internet Architecture Board*, Conselho de Arquitetura da Internet.

> Grupo de aconselhamento tecnológico do ISOC.

> Funções:
> - Controlar o desenvolvimento de padrões e protocolos para a Internet.
> - Atuar como interface entre a ISOC e outras entidades de desenvolvimento de padrões.`,
      fonte: p2(6),
      cena: { modo: 'orgs', foco: 'iab' },
    },
    {
      titulo: 'IETF: pesquisas de curta duração',
      texto: `
**IETF** — *Internet Engineering Task Force*, Força-Tarefa de **Engenharia** da Internet.

> Concentra-se em **pesquisas de curta duração** sobre problemas de engenharia e normas, facilitando a transferência de novas tecnologias para a comunidade.`,
      fonte: p2(6),
      cena: { modo: 'orgs', foco: 'ietf' },
    },
    {
      titulo: 'IRTF: pesquisas a longo prazo',
      texto: `
**IRTF** — *Internet Research Task Force*, Força-Tarefa de **Pesquisas** da Internet.

> Desenvolve **pesquisas a longo prazo**, como novos protocolos, aplicações, arquitetura e tecnologia.`,
      fonte: p2(7),
      cena: { modo: 'orgs', foco: 'irtf' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'IETF × IRTF',
          texto: 'Só muda uma letra. **E** de *Engineering* (engenharia): pesquisas de **curta** duração. **R** de *Research* (pesquisa): pesquisas a **longo** prazo.',
        },
      ],
    },
    {
      titulo: 'IANA: os números da Internet',
      texto: `
**IANA** — Autoridade para Atribuição de Números da Internet.

> Departamento da ICANN que tem três funções principais:
> - ① Administrar a designação dos recursos numéricos da Internet;
> - ② Administrar o sistema de nomes de domínio associado a esses números;
> - ③ Manter o registro de parâmetros técnicos de protocolo, para ajudar a manter unificada a Internet.

Os recursos numéricos são, por exemplo, os **endereços IP**; os nomes de domínio são os do **DNS**.`,
      fonte: p2(7),
      cena: { modo: 'orgs', foco: 'iana' },
    },
    {
      titulo: 'RFC: as normas da Internet',
      texto: `
Os protocolos da Internet são publicados como **RFC** (*Request for Comment*), com um número e uma data. A **cronologia** do slide, em ordem:

- **1971**: Telnet (RFC 97) e FTP (114): os mais antigos.
- **1980**: IP (760), TCP (761) e UDP (768): o **TCP/IP**.
- **1981**: ICMP (777, o do “ping”) e SMTP (788, e-mail).
- **1983**: DNS (882). **1988**: POP3 (1081).
- **1993–1994**: DHCP (1541), NAT (1631) e IMAP4 (1730).
- **1996–2000**: HTTP/1.0 (1945), HTTP/1.1 (2616) e HTTP-S (2818): página WEB.
- **2006**: SSH (4251). **2007**: POP3-S (5034), SMTP-S (4954) e IMAP4-S (4959): e-mail seguro.`,
      fonte: p2(8),
      cena: { modo: 'rfc' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'SSH é “VPN”?',
          noSlide: 'Na cronologia, o SSH aparece com a anotação **“VPN”**.',
          naPratica: 'O **SSH** (*The Secure Shell*) é para **acesso remoto seguro** (como está na p. 4: controle remoto). Ele consegue criar túneis, mas VPN costuma ser outra tecnologia (como IPsec). Na prova, responda como o slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'No organograma (na tela), cada organização fica debaixo de qual grupo?',
      grupos: ['ISOC', 'ICANN'],
      itens: [
        { texto: 'IAB', grupo: 0 },
        { texto: 'IETF', grupo: 0 },
        { texto: 'IRTF', grupo: 0 },
        { texto: 'RFC Editor', grupo: 0 },
        { texto: 'IANA', grupo: 1 },
      ],
      explicacao: 'ISOC: IAB, IETF, IRTF e RFC Editor. ICANN: IANA (“Departamento da ICANN…”).',
      fonte: p2(5),
      cena: { modo: 'orgs', semNomes: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'Em que ano a Internet Society (ISOC) foi fundada?',
      campos: [{ rotulo: 'Ano', resposta: '1992', formato: 'numero' }],
      explicacao: '“Organização internacional não lucrativa, fundada em **1992**, dedicada à expansão, desenvolvimento e acessibilidade da Internet.”',
      fonte: p2(5),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual grupo se concentra em pesquisas de curta duração sobre problemas de engenharia e normas?',
      opcoes: ['IETF', 'IRTF', 'IAB', 'IANA'],
      correta: 0,
      explicacao: '**IETF** (Força-Tarefa de **Engenharia**): “Concentra-se em **pesquisas de curta duração**…”. O IRTF faz as de longo prazo.',
      fonte: p2(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual grupo desenvolve pesquisas a longo prazo, como novos protocolos, aplicações, arquitetura e tecnologia?',
      opcoes: ['IRTF', 'IETF', 'IAB', 'ICANN'],
      correta: 0,
      explicacao: '**IRTF** (Força-Tarefa de **Pesquisas**): “Desenvolve **pesquisas a longo prazo**…”.',
      fonte: p2(7),
    },
    {
      tipo: 'escolha',
      enunciado: '“Grupo de aconselhamento tecnológico do ISOC” é o…',
      opcoes: ['IAB', 'IETF', 'IANA', 'RFC Editor'],
      correta: 0,
      explicacao: '**IAB** (*Internet Architecture Board*): “Grupo de aconselhamento tecnológico do ISOC.”',
      fonte: p2(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'A IANA é um departamento de qual organização?',
      opcoes: ['ICANN', 'ISOC', 'IETF', 'ARPA'],
      correta: 0,
      explicacao: 'IANA: “**Departamento da ICANN** que tem três funções principais”: recursos numéricos, nomes de domínio e parâmetros técnicos de protocolo.',
      fonte: p2(7),
      cena: { modo: 'orgs', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na cronologia do slide, qual é o protocolo mais antigo?',
      opcoes: ['Telnet', 'IP', 'DNS', 'HTTP'],
      correta: 0,
      explicacao: 'A cronologia começa com **Telnet** (RFC 97, fev/1971) e FTP (RFC 114, abr/1971).',
      fonte: p2(8),
      cena: { modo: 'rfc', semNumeros: true },
    },
  ],
}

// ---------- 6.5 ----------

const fase65: Fase = {
  id: '6-5',
  titulo: 'Pseudocamadas e RM-OSI × TCP/IP',
  resumo: 'As camadas de aplicação, transporte e rede do TCP/IP e a comparação com o RM-OSI.',
  Cena: CenaTcpIp,
  camera: [0, 3.3, 13.5],
  alvoCamera: [0.3, 2.5, 0],
  passos: [
    {
      titulo: 'Pseudocamadas do TCP/IP',
      texto: `
O TCP/IP também pode ser visto em camadas (o slide diz **pseudocamadas**, por isso os nomes vêm entre aspas):

> **“CAMADA DE APLICAÇÃO”** Protocolos que prestam serviços as aplicações do usuário.

> **“CAMADA DE TRANSPORTE”** … prestam serviço de entrega das mensagens.

> **“CAMADA DE REDE”** … endereçamento e roteamento

Em cima de tudo estão as **aplicações dos usuários** (navegador, e-mail, terminal SSH, FTP, DNS, WhatsApp).`,
      fonte: p3(2),
      cena: { modo: 'pseudo' },
      explorar: {
        instrucao: 'Clique nas 3 camadas.',
        alvos: {
          aplicacao: { titulo: '“Camada de aplicação”', texto: 'HTTPS, HTTP, FTP, SSH, SMTP-S, POP3-S, IMAP4-S, TELNET, DHCP e DNS.' },
          transporte: { titulo: '“Camada de transporte”', texto: 'TCP e UDP.' },
          rede: { titulo: '“Camada de rede”', texto: 'IPv4, ARP e ICMP.' },
        },
      },
    },
    {
      titulo: '“Camada de aplicação”',
      texto: `
> Protocolos que prestam serviços as aplicações do usuário.

São os protocolos da fase 6.3: **HTTPS, HTTP, FTP, SSH, SMTP-S, POP3-S, IMAP4-S, TELNET, DHCP e DNS**. O navegador usa o HTTP/HTTPS; o programa de e-mail, o SMTP e o POP3/IMAP4.`,
      fonte: p3(2),
      cena: { modo: 'pseudo', foco: 'aplicacao' },
    },
    {
      titulo: '“Camada de transporte”',
      texto: `
> … prestam serviço de entrega das mensagens.

São o **TCP** e o **UDP**. Na fase 6.2: o TCP entrega com garantia e orientado à conexão; o UDP, sem garantias e sem conexão.`,
      fonte: p3(2),
      cena: { modo: 'pseudo', foco: 'transporte' },
    },
    {
      titulo: '“Camada de rede”',
      texto: `
> … endereçamento e roteamento

São o **IPv4**, o **ARP** e o **ICMP**. O IPv4 faz o endereçamento lógico (os endereços IP das Trilhas 3 e 4).`,
      fonte: p3(2),
      cena: { modo: 'pseudo', foco: 'rede' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'ARP e ICMP',
          texto: 'Não está no slide: o **ARP** descobre o endereço MAC a partir do IP (fica na fronteira com o enlace); o **ICMP** é o do “ping” (a cronologia da fase 6.4 marca isso).',
        },
      ],
    },
    {
      titulo: 'RM-OSI × TCP/IP',
      texto: `
> - O TCP/IP é formado pelo conjunto de protocolos que são conceitualmente organizados em camadas.
> - Os protocolos prestam serviços “equivalentes” aos descritos nas camadas do modelo OSI.

Na figura do slide:

- A **APLICAÇÃO** do TCP/IP ocupa o lugar de **três** camadas do OSI: aplicação, apresentação e sessão.
- **TRANSPORTE** fica na altura do transporte.
- **INTER-REDES** fica na altura da rede.
- **Interface de Rede** é uma faixa fina, em cima do enlace.`,
      fonte: p3(2),
      cena: { modo: 'comparar' },
    },
    {
      titulo: 'A Interface de Rede',
      texto: `
> A camada “Interface de Rede” faz a ligação com a contraparte física da rede, que não faz parte do TCP/IP.

Por isso, na figura, a pilha do TCP/IP **não desce** até o enlace e a física: o TCP/IP não define cabos nem sinais. A próxima fase mostra um modelo que inclui essas partes.`,
      fonte: p3(2),
      cena: { modo: 'comparar', foco: 'interface' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Nas pseudocamadas do slide (na tela), cada protocolo fica em qual “camada”?',
      grupos: ['Aplicação', 'Transporte', 'Rede'],
      itens: [
        { texto: 'HTTP', grupo: 0 },
        { texto: 'DNS', grupo: 0 },
        { texto: 'SSH', grupo: 0 },
        { texto: 'TCP', grupo: 1 },
        { texto: 'UDP', grupo: 1 },
        { texto: 'IPv4', grupo: 2 },
        { texto: 'ARP', grupo: 2 },
        { texto: 'ICMP', grupo: 2 },
      ],
      explicacao: 'Aplicação: HTTPS, HTTP, FTP, SSH, SMTP-S, POP3-S, IMAP4-S, TELNET, DHCP, DNS. Transporte: TCP, UDP. Rede: IPv4, ARP, ICMP.',
      fonte: p3(2),
      cena: { modo: 'pseudo', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, a “camada de transporte” do TCP/IP…',
      opcoes: ['presta serviço de entrega das mensagens', 'faz endereçamento e roteamento', 'presta serviços às aplicações do usuário', 'define os cabos e os sinais'],
      correta: 0,
      explicacao: '“**CAMADA DE TRANSPORTE**” … prestam serviço de **entrega das mensagens**.',
      fonte: p3(2),
      cena: { modo: 'pseudo', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, a “camada de rede” do TCP/IP faz…',
      opcoes: ['endereçamento e roteamento', 'a entrega das mensagens com garantia', 'a conversão para um formato comum', 'a transmissão dos bits no cabo'],
      correta: 0,
      explicacao: '“**CAMADA DE REDE**” … **endereçamento e roteamento**.',
      fonte: p3(2),
      cena: { modo: 'pseudo', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura (na tela), a camada de APLICAÇÃO do TCP/IP ocupa o lugar de quais camadas do RM-OSI?',
      opcoes: ['Aplicação, Apresentação e Sessão', 'Só a Aplicação', 'Aplicação e Transporte', 'Sessão, Transporte e Rede'],
      correta: 0,
      explicacao: 'Na figura do slide, a APLICAÇÃO do TCP/IP vai da **sessão** até a **aplicação** do RM-OSI: três camadas.',
      fonte: p3(2),
      cena: { modo: 'comparar', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura, a camada INTER-REDES do TCP/IP fica na altura de qual camada do RM-OSI?',
      opcoes: ['Rede', 'Transporte', 'Enlace', 'Sessão'],
      correta: 0,
      explicacao: 'INTER-REDES fica na altura da **REDE** do RM-OSI (é onde está o IP).',
      fonte: p3(2),
      cena: { modo: 'comparar' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que a camada “Interface de Rede” faz, segundo o slide?',
      opcoes: [
        'A ligação com a contraparte física da rede, que não faz parte do TCP/IP',
        'O endereçamento lógico dos pacotes',
        'A entrega das mensagens sem conexão',
        'Serve de janela para as aplicações do usuário',
      ],
      correta: 0,
      explicacao: '“A camada “Interface de Rede” faz a **ligação com a contraparte física** da rede, que **não faz parte do TCP/IP**.”',
      fonte: p3(2),
      cena: { modo: 'comparar' },
    },
  ],
}

// ---------- 6.6 ----------

const fase66: Fase = {
  id: '6-6',
  titulo: 'Modelo de 5 camadas',
  resumo: 'Aplicação, transporte, rede, enlace e física: o TCP/IP em cima, o acesso ao meio e os meios embaixo.',
  Cena: CenaCinco,
  camera: [0, 4.2, 12.5],
  alvoCamera: [0.4, 1.6, 0],
  passos: [
    {
      titulo: 'Modelo com 5 camadas',
      texto: `
> Modelo que incorpora todos os protocolos e padrões usados em redes de computadores.

De cima para baixo: **APLICAÇÃO**, **TRANSPORTE**, **REDE**, **ENLACE** e **FÍSICA** (com as cores do slide).

Comparando com os outros dois: do RM-OSI (7 camadas), as três de cima viram uma só (aplicação); do TCP/IP, a “Interface de Rede” dá lugar a duas camadas de verdade, **enlace** e **física**.`,
      fonte: p3(3),
      cena: { modo: 'pilha' },
    },
    {
      titulo: 'Aplicação, transporte e rede = TCP/IP',
      texto: `
> Os protocolos usados nas camadas de aplicação, transporte e redes são equivalentes ao TCP/IP.

Ou seja: HTTP, DNS, DHCP… na aplicação; TCP e UDP no transporte; IP na rede.`,
      fonte: p3(3),
      cena: { modo: 'superiores' },
    },
    {
      titulo: 'Enlace: controle de acesso ao meio',
      texto: `
> A camada de enlace possui os protocolos usados no controle de acesso ao meio (baixo nível), tais como o ETHERNET, o BLUETOOTH e o WIFI.

Na cena: a placa de rede (**ETHERNET**, o cabo da rede local), o celular (**BLUETOOTH**) e o ponto de acesso (**WIFI**).`,
      fonte: p3(3),
      cena: { modo: 'enlace' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Aula 05 p1',
          texto: 'No RM-OSI, o enlace faz o endereçamento físico (**MAC**) e o controle do canal compartilhado. A placa Ethernet e o Wi-Fi têm um endereço MAC cada.',
        },
      ],
    },
    {
      titulo: 'Física: os meios de transmissão',
      texto: `
> A camada física possui os padrões usados nos meios de transmissão, tais como o par-trançado (UTP), fibra ótica ou cabo coaxial..

São os meios de transmissão da Trilha 1: cabo **par-trançado** (UTP), **fibra ótica** (luz) e **cabo coaxial**.`,
      fonte: p3(3),
      cena: { modo: 'fisica' },
    },
    {
      titulo: 'O modelo inteiro',
      texto: `
Juntando: as **3 de cima** são o TCP/IP; o **enlace** controla o acesso ao meio; a **física** define os meios de transmissão.`,
      fonte: p3(3),
      cena: { modo: 'tudo' },
      explorar: {
        instrucao: 'Clique nas 3 partes da pilha.',
        alvos: {
          superiores: { titulo: 'Aplicação, transporte e rede', texto: 'Protocolos **equivalentes ao TCP/IP**.' },
          enlace: { titulo: 'Enlace', texto: 'Controle de acesso ao meio (baixo nível): **ETHERNET**, **BLUETOOTH** e **WIFI**.' },
          fisica: { titulo: 'Física', texto: 'Padrões dos meios de transmissão: **par-trançado (UTP)**, **fibra ótica** e **cabo coaxial**.' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'digitar',
      enunciado: 'Quantas camadas tem este modelo?',
      campos: [{ rotulo: 'Camadas', resposta: '5', formato: 'numero' }],
      explicacao: 'Modelo com **5 camadas**: aplicação, transporte, rede, enlace e física.',
      fonte: p3(3),
      cena: { modo: 'pilha', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é a ordem do modelo de 5 camadas, de cima para baixo?',
      opcoes: [
        'Aplicação, Transporte, Rede, Enlace, Física',
        'Aplicação, Rede, Transporte, Enlace, Física',
        'Aplicação, Transporte, Enlace, Rede, Física',
        'Física, Enlace, Rede, Transporte, Aplicação',
      ],
      correta: 0,
      explicacao: 'De cima para baixo: **APLICAÇÃO, TRANSPORTE, REDE, ENLACE, FÍSICA**.',
      fonte: p3(3),
      cena: { modo: 'pilha', semNomes: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada exemplo do slide é da camada de enlace ou da física?',
      grupos: ['Enlace', 'Física'],
      itens: [
        { texto: 'ETHERNET', grupo: 0 },
        { texto: 'BLUETOOTH', grupo: 0 },
        { texto: 'WIFI', grupo: 0 },
        { texto: 'Par-trançado (UTP)', grupo: 1 },
        { texto: 'Fibra ótica', grupo: 1 },
        { texto: 'Cabo coaxial', grupo: 1 },
      ],
      explicacao: '**Enlace**: protocolos de controle de acesso ao meio (ETHERNET, BLUETOOTH, WIFI). **Física**: padrões dos meios de transmissão (UTP, fibra ótica, coaxial).',
      fonte: p3(3),
      cena: { modo: 'tudo', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Em quais camadas os protocolos são equivalentes ao TCP/IP?',
      opcoes: ['Aplicação, transporte e rede', 'Enlace e física', 'Só a aplicação', 'Transporte, rede e enlace'],
      correta: 0,
      explicacao: '“Os protocolos usados nas camadas de **aplicação, transporte e redes** são equivalentes ao TCP/IP.”',
      fonte: p3(3),
      cena: { modo: 'superiores', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, a camada de enlace possui os protocolos usados…',
      opcoes: ['no controle de acesso ao meio (baixo nível)', 'nos meios de transmissão', 'nas páginas web', 'no endereçamento lógico IP'],
      correta: 0,
      explicacao: '“A camada de enlace possui os protocolos usados no **controle de acesso ao meio** (baixo nível), tais como o ETHERNET, o BLUETOOTH e o WIFI.”',
      fonte: p3(3),
      cena: { modo: 'enlace' },
    },
  ],
}

// ---------- 6.7 ----------

const fase67: Fase = {
  id: '6-7',
  titulo: 'PDU e encapsulamento',
  resumo: 'Mensagem, segmento, pacote, quadro e sinais: o que cada camada acrescenta aos dados.',
  Cena: CenaPdu,
  camera: [0, 3.2, 13],
  alvoCamera: [0, 2.4, 0],
  passos: [
    {
      titulo: 'Unidade de Dados do Protocolo',
      texto: `
> Unidade de Dados do Protocolo (PDU, *Protocol Data Unit*) é a informação trocada entre os protocolos associados às camadas.

Na figura, o usuário digita **www.google.com.br**. Em cada camada, a PDU é um **cabeçalho** (preto) + a PDU da camada de cima:

- **Aplicação**: cabeçalho + Dados = **MENSAGENS**
- **Transporte**: cabeçalho + MENSAGENS = **SEGMENTOS**
- **Rede**: cabeçalho + SEGMENTOS = **PACOTES**
- **Enlace**: cabeçalho + PACOTES + **FCS** = **QUADROS**
- **Física**: **Sinais**`,
      fonte: p3(4),
      cena: { modo: 'pdu' },
      explorar: {
        instrucao: 'Clique nas 5 PDUs.',
        alvos: {
          mensagens: { titulo: 'Aplicação → Mensagem', texto: 'Cabeçalho da mensagem + carga útil da mensagem (**Dados**).' },
          segmentos: { titulo: 'Transporte → Segmento', texto: 'Cabeçalho do segmento + carga útil do segmento (**Mensagens**).' },
          pacotes: { titulo: 'Rede → Pacote', texto: 'Cabeçalho do pacote + carga útil do pacote (**Segmentos**).' },
          quadros: { titulo: 'Enlace → Quadro', texto: 'Cabeçalho do quadro (*Frame*) + carga útil do quadro (**Pacote**) + **FCS**.' },
          sinais: { titulo: 'Física → Sinais', texto: 'Os bits viram sinais no meio de transmissão.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'FCS',
          texto: 'Não está no slide: FCS é *Frame Check Sequence*, um código no fim do quadro para o receptor **detectar erros** (a função do enlace no RM-OSI).',
        },
      ],
    },
    {
      titulo: 'Encapsulamento',
      texto: `
> **Encapsulamento** → É o fluxo dos dados que são trocados passando por alterações à medida que os protocolos executam seus serviços.

Veja a figura se montar: os **Dados do APP** descem a pilha e cada camada põe o seu cabeçalho na frente, como um envelope dentro de outro:

- **Mensagem** = Cabeçalho Mensagem + Carga útil da Mensagem (Dados)
- **Segmento** = Cabeçalho Segmento + Carga útil do segmento (Mensagens)
- **Pacote** = Cabeçalho do Pacote + Carga útil do pacote (Segmentos)
- **Quadro** = Cabeçalho do Quadro (*Frame*) + Carga útil do quadro (Pacote) + FCS`,
      fonte: p3(4),
      cena: { modo: 'encapsular' },
    },
    {
      titulo: 'Do outro lado',
      texto: `
As setas da figura ligam os **pares**: a Rede de um lado conversa com a Rede do outro, e o pacote que chega é o mesmo que saiu (como na Trilha 5).

No destino, o caminho é o inverso: cada camada tira o **seu** cabeçalho e entrega a carga útil para a camada de cima, até os dados chegarem ao software.`,
      fonte: p3(4),
      cena: { modo: 'pdu' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Desencapsulamento',
          texto: 'Não está no slide: o processo inverso, no destino, costuma ser chamado de **desencapsulamento**.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Na figura (na tela), qual é a PDU de cada camada?',
      grupos: ['Aplicação', 'Transporte', 'Rede', 'Enlace', 'Física'],
      itens: [
        { texto: 'Mensagem', grupo: 0 },
        { texto: 'Segmento', grupo: 1 },
        { texto: 'Pacote', grupo: 2 },
        { texto: 'Quadro', grupo: 3 },
        { texto: 'Sinais', grupo: 4 },
      ],
      explicacao: 'Aplicação: **MENSAGENS**. Transporte: **SEGMENTOS**. Rede: **PACOTES**. Enlace: **QUADROS**. Física: **Sinais**.',
      fonte: p3(4),
      cena: { modo: 'pdu', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é PDU (Protocol Data Unit)?',
      opcoes: [
        'A informação trocada entre os protocolos associados às camadas',
        'O cabo que liga dois computadores',
        'O endereço físico da placa de rede',
        'Um protocolo de e-mail',
      ],
      correta: 0,
      explicacao: '“Unidade de Dados do Protocolo (PDU, *Protocol Data Unit*) é a **informação trocada entre os protocolos** associados às camadas.”',
      fonte: p3(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'O que é encapsulamento, segundo o slide?',
      opcoes: [
        'O fluxo dos dados trocados, passando por alterações à medida que os protocolos executam seus serviços',
        'A criptografia dos dados',
        'A compressão dos dados',
        'A troca de um cabo por outro',
      ],
      correta: 0,
      explicacao: '“**Encapsulamento** → É o fluxo dos dados que são trocados passando por alterações à medida que os protocolos executam seus serviços.”',
      fonte: p3(4),
      cena: { modo: 'encapsular' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Em qual PDU aparece o FCS, no fim?',
      opcoes: ['No quadro (enlace)', 'No pacote (rede)', 'No segmento (transporte)', 'Na mensagem (aplicação)'],
      correta: 0,
      explicacao: 'Quadro = Cabeçalho do Quadro (*Frame*) + Carga útil do quadro (Pacote) + **FCS**.',
      fonte: p3(4),
      cena: { modo: 'pdu', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'A carga útil do pacote é formada por…',
      opcoes: ['Segmentos', 'Quadros', 'Sinais', 'Só os Dados do APP'],
      correta: 0,
      explicacao: 'Pacote = Cabeçalho do Pacote + **Carga útil do pacote (Segmentos)**.',
      fonte: p3(4),
      cena: { modo: 'pdu', semNomes: true },
    },
  ],
}

// ---------- 6.8 ----------

const fase68: Fase = {
  id: '6-8',
  titulo: 'Exemplo: solicitação de serviço',
  resumo: 'O Google Chrome pede uma página ao Apache: HTTP, TCP, IP e Ethernet, direto e com um roteador.',
  Cena: CenaSolicitacao,
  camera: [0, 3.6, 13],
  alvoCamera: [0, 2.2, 0],
  passos: [
    {
      titulo: 'Chrome pede, Apache responde',
      texto: `
O slide **Exemplo: Solicitação de Serviço** junta tudo:

- À esquerda, o **GOOGLE CHROME**: “Usuário acessa: www.google.com.br”.
- À direita, o **APACHE**: “Servidor HTTP”.
- Cada lado tem **HTTP**, **TCP**, **IP** e **Ethernet**, e embaixo a **placa de rede**, ligada pelo cabo.

As linhas tracejadas são a conversa entre os **pares**, com o que cada um faz.`,
      fonte: p3(5),
      cena: { modo: 'direto' },
      explorar: {
        instrucao: 'Clique nos 4 protocolos do Chrome.',
        alvos: {
          http: { titulo: 'HTTP (aplicação)', texto: '> Transferência da Página WEB' },
          tcp: { titulo: 'TCP (transporte)', texto: '> Estabelecimento da Conexão · Detecção e Correção de Erros, etc.' },
          ip: { titulo: 'IP (rede)', texto: '> Endereçamento Lógico IP · Roteamento' },
          ethernet: { titulo: 'Ethernet (enlace)', texto: '> Endereçamento Físico MAC · Detecção de Erros, Controle de Fluxo, etc.' },
        },
      },
    },
    {
      titulo: 'O caminho de verdade',
      texto: `
A conversa entre pares é **lógica**. O pedido de verdade **desce** a pilha do Chrome (encapsulamento, fase 6.7), passa pelas **placas de rede** e pelo cabo, e **sobe** a pilha do Apache.

É o mesmo fluxo da Trilha 5, agora com os protocolos de verdade no lugar dos nomes das camadas.`,
      fonte: p3(5),
      cena: { modo: 'direto' },
    },
    {
      titulo: 'Exemplo 2: com um roteador',
      texto: `
No **Exemplo 2**, há um **ROTEADOR** no meio do caminho. Ele só vai até a camada **IP**:

- **HTTP** (“Transferência de páginas WEB”) e **TCP** (“Estabelece a conexão”) continuam de **host a host**: o roteador não participa.
- No **IP**, o “Endereçamento” é feito **em cada trecho**: Chrome → roteador → Apache.`,
      fonte: p3(5),
      cena: { modo: 'roteador' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Trilha 5',
          texto: 'É a figura “Comunicação entre hosts” da fase 5.5: o **transporte** (TCP) é **fim a fim**, e a **rede** (IP) é **ponto a ponto**, de equipamento em equipamento.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'No exemplo do slide, cada função é de qual protocolo?',
      grupos: ['HTTP', 'TCP', 'IP', 'Ethernet'],
      itens: [
        { texto: 'Transferência da Página WEB', grupo: 0 },
        { texto: 'Estabelecimento da Conexão; Detecção e Correção de Erros', grupo: 1 },
        { texto: 'Endereçamento Lógico IP; Roteamento', grupo: 2 },
        { texto: 'Endereçamento Físico MAC; Controle de Fluxo', grupo: 3 },
      ],
      explicacao: 'HTTP: Transferência da Página WEB. TCP: Estabelecimento da Conexão, Detecção e Correção de Erros. IP: Endereçamento Lógico IP, Roteamento. Ethernet: Endereçamento Físico MAC, Detecção de Erros, Controle de Fluxo.',
      fonte: p3(5),
      cena: { modo: 'direto', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'No exemplo, qual é o programa do lado do servidor?',
      opcoes: ['Apache (Servidor HTTP)', 'Google Chrome', 'Outlook', 'DHCP'],
      correta: 0,
      explicacao: 'O usuário acessa pelo **GOOGLE CHROME**; do outro lado está o **APACHE**, Servidor HTTP de www.google.com.br.',
      fonte: p3(5),
      cena: { modo: 'direto' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No Exemplo 2, até qual camada o roteador vai?',
      opcoes: ['IP', 'TCP', 'HTTP', 'Ele não usa nenhuma'],
      correta: 0,
      explicacao: 'O roteador só tem o **IP** (e a interface de baixo): ele faz o “Endereçamento” em cada trecho. HTTP e TCP passam direto, de host a host.',
      fonte: p3(5),
      cena: { modo: 'roteador', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'No Exemplo 2, qual conversa continua direto entre o Chrome e o Apache, sem o roteador participar?',
      opcoes: ['TCP: “Estabelece a conexão”', 'IP: “Endereçamento”', 'A placa de rede com o cabo', 'Nenhuma: tudo passa pelo roteador'],
      correta: 0,
      explicacao: 'A linha tracejada do **TCP** (“Estabelece a conexão”) vai do Chrome ao Apache: é fim a fim. O IP faz o “Endereçamento” trecho a trecho, passando pelo roteador.',
      fonte: p3(5),
      cena: { modo: 'roteador' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No modelo de 5 camadas, a Ethernet do exemplo fica em qual camada?',
      opcoes: ['Enlace', 'Física', 'Rede', 'Transporte'],
      correta: 0,
      explicacao: 'A camada de **enlace** possui os protocolos de controle de acesso ao meio, tais como o **ETHERNET**, o BLUETOOTH e o WIFI (p. 3).',
      fonte: p3('3, 5'),
      cena: { modo: 'direto' },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'Em que ano a ARPANET foi desativada, surgindo a Internet?',
    opcoes: ['1990', '1962', '1984', '1992'],
    correta: 0,
    explicacao: '“Em **1990** a ARPANET foi desativada, surgindo a INTERNET … para acomodar as empresas comerciais.” (1962: criação, pelo slide; 1984: RM-OSI; 1992: ISOC.)',
    fonte: p2(2),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual protocolo faz o envio de e-mail?',
    opcoes: ['SMTP', 'POP3', 'IMAP4', 'FTP'],
    correta: 0,
    explicacao: '**SMTP**, SMTP-S ⇨ Envio de E-mail. POP3 e IMAP4 são de recebimento.',
    fonte: p2(4),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual é a PDU da camada de rede?',
    opcoes: ['Pacote', 'Quadro', 'Segmento', 'Mensagem'],
    correta: 0,
    explicacao: 'Rede: cabeçalho + SEGMENTOS = **PACOTES**.',
    fonte: p3(4),
  },
  {
    tipo: 'escolha',
    enunciado: 'No modelo de 5 camadas, o WIFI é exemplo de protocolo de qual camada?',
    opcoes: ['Enlace', 'Física', 'Rede', 'Aplicação'],
    correta: 0,
    explicacao: 'A camada de **enlace** possui os protocolos de controle de acesso ao meio: ETHERNET, BLUETOOTH e **WIFI**.',
    fonte: p3(3),
  },
  {
    tipo: 'classificar',
    enunciado: 'Cada descrição é de qual força-tarefa?',
    grupos: ['IETF', 'IRTF'],
    itens: [
      { texto: 'Pesquisas de curta duração', grupo: 0 },
      { texto: 'Problemas de engenharia e normas', grupo: 0 },
      { texto: 'Pesquisas a longo prazo', grupo: 1 },
      { texto: 'Novos protocolos, aplicações, arquitetura e tecnologia', grupo: 1 },
    ],
    explicacao: 'IETF (Engenharia): curta duração, problemas de engenharia e normas. IRTF (Pesquisas): longo prazo, novos protocolos, aplicações, arquitetura e tecnologia.',
    fonte: p2('6–7'),
  },
]

export const trilha6: Trilha = {
  id: 't6',
  numero: 6,
  titulo: 'TCP/IP e 5 camadas',
  aula: 'Aula 05 p2–p3 · TCP/IP e 5 camadas',
  cor: '#17a2a2',
  disponivel: true,
  fases: [fase61, fase62, fase63, fase64, fase65, fase66, fase67, fase68],
  chefaoExtras: extras,
}
