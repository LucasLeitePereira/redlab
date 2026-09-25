import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaDhcp } from './cenas/Dhcp'
import { CenaDns } from './cenas/Dns'
import { CenaConfiguracao, CenaVerificando } from './cenas/Host'
import { CenaPrivados } from './cenas/Privados'

// Trilha 4 — Usando a rede. PDF da Aula 04: REDES-04_Usando-Rede.pdf (14 páginas, 2 slides
// por página). A "página" das citações é a página do PDF.
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.
// Os slides escrevem os IPs com "·" no meio (192·168·10·1); no texto usamos o ponto normal.

const a = (pagina: number | string): Fonte => ({ aula: 'Aula 04', pagina })

// ---------- 4.1 ----------

const fase41: Fase = {
  id: '4-1',
  titulo: 'Configurando o host',
  resumo: 'Endereço IP, máscara e gateway de cada host; o endereço MAC da placa de rede.',
  Cena: CenaConfiguracao,
  camera: [0, 10.5, 16],
  passos: [
    {
      titulo: 'Endereçamento lógico IP',
      texto: `
A Aula 04 começa configurando os *hosts* da rede. A cena é a figura do slide: três computadores ligados no mesmo cabo e, atrás deles, um quarto computador com **dois** endereços.

Embaixo de cada *host* estão as três informações que ele precisa ter configuradas, na ordem do slide: **Endereço IP**, **Máscara** e **Gateway**.`,
      fonte: a(2),
      cena: { modo: 'logico' },
      explorar: {
        instrucao: 'Clique nos 3 marcadores “?” para ver a definição de cada item.',
        alvos: {
          ip: { titulo: 'Endereço IP', texto: '“Rótulo numérico atribuído a cada *host* conectado em uma rede TCP/IP.”' },
          mascara: { titulo: 'Máscara', texto: '“Endereço IP usado para calcular o endereço da subrede.” É a conta com o **AND** da Trilha 3.' },
          gateway: { titulo: 'Gateway', texto: '“É um *host* que permite acessar outras subredes.”' },
        },
      },
    },
    {
      titulo: 'Um host com um pé em cada sub-rede',
      texto: `
Repare nos endereços da figura:

- **192.168.10.1** e **192.168.10.2** (azul) estão na sub-rede 192.168.10.0 e usam o *gateway* **192.168.10.5**.
- **192.168.20.1** (verde) está na sub-rede 192.168.20.0 e usa o *gateway* **192.168.20.5**.

O *gateway* é um *host* só, com um IP em **cada** sub-rede. Por isso cada computador aponta para o IP do *gateway* que fica na sua própria sub-rede.

Na cena, o 192.168.10.1 manda um dado para o 192.168.20.1: como são sub-redes diferentes, o dado passa pelo *gateway*.`,
      fonte: a(2),
      cena: { modo: 'rota' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Gateway na mesma sub-rede do host',
          texto: 'O IP de *gateway* configurado num *host* é sempre da mesma sub-rede dele: 192.168.10.1 usa 192.168.10.5, nunca 192.168.20.5. Dá para conferir com o AND da Trilha 3.',
        },
      ],
    },
    {
      titulo: 'Endereçamento físico MAC',
      texto: `
> ENDEREÇO MAC ➡ É um identificador único usado por dispositivos *Ethernet*.

> Identificador formado por 48 bits, representados com símbolos hexadecimais.

O MAC fica gravado na **placa de rede**. No exemplo do slide, **ba:16:3e:f4:a0:e5**, cada par de símbolos vale **8 bits**:

- **ba** = 10111010
- **16** = 00010110
- … até **e5** = 11100101

São 6 pares × 8 bits = **48 bits**.`,
      fonte: a(3),
      cena: { modo: 'mac' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Hexadecimal → binário',
          texto: 'Cada símbolo hexadecimal vale 4 bits: 0–9 são 0000 a 1001, e a=1010, b=1011, c=1100, d=1101, e=1110, f=1111. Então **ba** = 1011 1010 e **e5** = 1110 0101.',
        },
      ],
    },
    {
      titulo: 'Fabricante e sequência',
      texto: `
O slide mostra três computadores na mesma rede, cada um com seu IP e seu MAC:

- 192.168.10.1 → \`ba:16:3e:f4:a0:e5\`
- 192.168.10.2 → \`ba:16:3e:f4:a0:e9\`
- 192.168.10.3 → \`ba:16:3e:f4:a0:ea\`

A primeira metade é igual nos três e a segunda muda.`,
      fonte: a(4),
      cena: { modo: 'fabricante' },
      explorar: {
        instrucao: 'Clique nos 2 marcadores “?” para ver o que cada metade do MAC identifica.',
        alvos: {
          fabricante: { titulo: 'ba:16:3e — Identifica o Fabricante', texto: 'Os três computadores têm placas do **mesmo fabricante**, por isso a primeira metade é igual.' },
          sequencia: { titulo: 'f4:a0:e5 — Identifica a Sequência', texto: 'É o número de cada placa daquele fabricante (e5, e9, ea…). É o que deixa cada MAC **único**.' },
        },
      },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'IP × MAC',
          texto: 'O IP é o endereço **lógico**: é configurado e pode mudar. O MAC é o **físico**: vem gravado na placa de rede. São o 2º e o 1º tipos de endereço da Aula 03.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada definição do slide é de qual item?',
      cena: { modo: 'logico' },
      grupos: ['Endereço IP', 'Máscara', 'Gateway', 'Endereço MAC'],
      itens: [
        { texto: 'Rótulo numérico atribuído a cada host de uma rede TCP/IP', grupo: 0 },
        { texto: 'Endereço usado para calcular o endereço da subrede', grupo: 1 },
        { texto: 'Host que permite acessar outras subredes', grupo: 2 },
        { texto: 'Identificador único usado por dispositivos Ethernet', grupo: 3 },
      ],
      explicacao: 'IP = rótulo numérico de cada host; máscara = calcula o endereço da subrede; gateway = host que dá acesso a outras subredes; MAC = identificador único dos dispositivos Ethernet.',
      fonte: a(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura do slide, qual gateway o host 192.168.20.1 usa?',
      cena: { modo: 'logico', gatewayOculto: '192.168.20.1' },
      opcoes: ['192.168.20.5', '192.168.10.5', '192.168.20.1', '255.255.255.0'],
      correta: 0,
      explicacao: 'O gateway tem um IP em cada sub-rede: 192.168.10.5 e **192.168.20.5**. O host 192.168.20.1 usa o da sua sub-rede, 192.168.20.5.',
      fonte: a(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'O endereço MAC é formado por…',
      opcoes: ['48 bits, em hexadecimal', '32 bits, em decimal', '48 bits, em decimal', '64 bits, em binário'],
      correta: 0,
      explicacao: '> Identificador formado por 48 bits, representados com símbolos hexadecimais.\n\n32 bits em decimal é o IPv4.',
      fonte: a(3),
    },
    {
      tipo: 'digitar',
      enunciado: 'Converta para binário dois grupos do MAC ba:16:3e:f4:a0:e5.',
      dados: ['MAC ba:16:3e:f4:a0:e5'],
      campos: [
        { rotulo: 'ba', resposta: '10111010', formato: 'binario' },
        { rotulo: 'a0', resposta: '10100000', formato: 'binario' },
      ],
      explicacao: 'Cada símbolo vale 4 bits: b=1011, a=1010 → **ba = 10111010**; a=1010, 0=0000 → **a0 = 10100000**. É a tabela de baixo do slide.',
      fonte: a(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'No MAC ba:16:3e:f4:a0:e9, qual parte identifica o fabricante?',
      cena: { modo: 'fabricante', semDica: true },
      opcoes: ['ba:16:3e', 'f4:a0:e9', 'e9', 'ba'],
      correta: 0,
      explicacao: 'A primeira metade (**ba:16:3e**) identifica o fabricante; a segunda (f4:a0:e9) identifica a sequência.',
      fonte: a(4),
    },
  ],
}

// ---------- 4.2 ----------

const fase42: Fase = {
  id: '4-2',
  titulo: 'ipconfig e ncpa.cpl',
  resumo: 'Ver a configuração no prompt (ipconfig, ipconfig /all) e mudar pelas Conexões de Rede.',
  Cena: CenaVerificando,
  camera: [1, 10, 14.5],
  passos: [
    {
      titulo: 'Verificando o endereço: ipconfig',
      texto: `
> IPCONFIG ➡ Programa do Windows capaz de dar informações sobre a configuração TCP/IP da rede local

O prompt da cena já rodou o **ipconfig** do slide: aparecem o **Endereço IPv4**, a **Máscara de Sub-rede** e o **Gateway Padrão**, as três informações da fase anterior.

O prompt funciona: dá para digitar os comandos e apertar Enter.`,
      fonte: a(4),
      cena: { modo: 'ipconfig' },
    },
    {
      titulo: 'A configuração completa: ipconfig /all',
      texto: `
Com **/all**, o ipconfig mostra bem mais coisas (o slide corta algumas linhas, marcadas com ⋮).

Cada informação colorida no prompt é um aparelho da cena.`,
      fonte: a(5),
      cena: { modo: 'all' },
      explorar: {
        instrucao: 'Clique nos 4 marcadores “?” da cena para ligar cada linha do ipconfig /all a um aparelho.',
        alvos: {
          fisico: {
            titulo: 'Endereço Físico: BA-16-3E-F4-A0-E5',
            texto: 'É o **MAC** da placa de rede, o mesmo ba:16:3e:f4:a0:e5 da fase anterior. O Windows escreve com hífens e letras maiúsculas.',
          },
          dhcp: {
            titulo: 'Servidor DHCP: 192.168.10.7',
            texto: 'Usa o **DHCP** (Protocolo de Configuração Dinâmica de *Host*) para “fornecer dinamicamente para os *HOSTS* de uma rede os ajustes de configuração TCP/IP” (p. 7): IP, máscara, gateway, DNS… Com “DHCP Habilitado: Sim”, este computador recebeu tudo do 192.168.10.7.',
          },
          gateway: { titulo: 'Gateway Padrão: 192.168.10.5', texto: 'O *host* que permite acessar outras sub-redes: é por ele que o computador chega à Internet.' },
          dns: { titulo: 'Servidores DNS: 8.8.8.8', texto: 'O servidor que traduz nomes (como www.unilasalle.edu.br) em endereços IP. Ele fica fora da rede local, então é acessado passando pelo *gateway*. O DNS é a fase 4.5.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Quem é o 8.8.8.8?',
          texto: 'Não está no slide: 8.8.8.8 é o servidor DNS público do Google.',
        },
      ],
    },
    {
      titulo: 'Alterando a configuração: ncpa.cpl',
      texto: `
> NCPA.CPL (*Network Connections Control-Panel Stub*) ➡ Comando usado Windows que permite configurar as conexões de rede.

No slide ele é digitado na caixa **Abrir:** (a janela Executar do Windows). Abre a janela **Conexões de Rede**: clicando com o botão direito no adaptador *Ethernet*, a última opção do menu é **Propriedades**.

Na cena a janela é clicável: siga o caminho do slide até as propriedades do **Protocolo IP Versão 4 (TCP/IPv4)**.`,
      fonte: a(5),
      cena: { modo: 'ncpa' },
    },
    {
      titulo: 'Protocolo IP Versão 4 (TCP/IPv4)',
      texto: `
Nas propriedades do TCP/IPv4 estão as duas formas de configurar o *host*:

- **Obter um endereço IP automaticamente**: o computador pede a configuração à rede.
- **Usar o seguinte endereço IP**: o IP, a máscara e o *gateway* são digitados à mão.

O mesmo vale para os servidores DNS, logo abaixo. Troque a opção na janela e veja a cena mudar.`,
      fonte: a(6),
      cena: { modo: 'ipv4' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Automático = DHCP',
          texto: 'O slide seguinte (p. 7) mostra que “Obter um endereço IP automaticamente” é a **Configuração Automática** feita pelo DHCP. É por isso que o ipconfig /all dizia “DHCP Habilitado: Sim”.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual comando mostra o Endereço Físico, o Servidor DHCP e os Servidores DNS?',
      opcoes: ['ipconfig /all', 'ipconfig', 'ncpa.cpl', 'nslookup'],
      correta: 0,
      explicacao: 'O **ipconfig** sozinho mostra só IPv4, máscara e gateway. O **ipconfig /all** mostra a configuração completa, com MAC, DHCP e DNS.',
      fonte: a(5),
    },
    {
      tipo: 'classificar',
      enunciado: 'No slide, cada informação aparece em qual saída?',
      cena: { modo: 'ipconfig' },
      grupos: ['ipconfig e ipconfig /all', 'Só no ipconfig /all'],
      itens: [
        { texto: 'Endereço IPv4', grupo: 0 },
        { texto: 'Máscara de Sub-rede', grupo: 0 },
        { texto: 'Gateway Padrão', grupo: 0 },
        { texto: 'Endereço Físico', grupo: 1 },
        { texto: 'Servidor DHCP', grupo: 1 },
        { texto: 'Servidores DNS', grupo: 1 },
      ],
      explicacao: 'O ipconfig do slide (p. 4) tem 3 linhas: Endereço IPv4, Máscara de Sub-rede e Gateway Padrão. O ipconfig/all (p. 5) repete essas e acrescenta Endereço Físico, DHCP, concessão e DNS.',
      fonte: a(5),
    },
    {
      tipo: 'digitar',
      enunciado: 'No ipconfig /all do slide (na tela), qual é o IP de cada servidor?',
      cena: { modo: 'all' },
      campos: [
        { rotulo: 'Quem entregou a configuração automática', resposta: '192.168.10.7', formato: 'ip' },
        { rotulo: 'Quem traduz nomes em IPs', resposta: '8.8.8.8', formato: 'ip' },
      ],
      explicacao: 'A configuração automática vem do **Servidor DHCP: 192.168.10.7**. Quem traduz nomes é o **Servidor DNS: 8.8.8.8**. O 192.168.10.5 é o gateway.',
      fonte: a(5),
    },
    {
      tipo: 'escolha',
      enunciado: 'Para que serve o comando ncpa.cpl?',
      cena: { modo: 'ncpa' },
      opcoes: ['Abrir as conexões de rede para configurá-las', 'Mostrar a configuração TCP/IP no prompt', 'Consultar um nome no DNS', 'Pedir um IP ao servidor DHCP'],
      correta: 0,
      explicacao: '> NCPA.CPL ➡ Comando usado Windows que permite configurar as conexões de rede.',
      fonte: a(5),
    },
    {
      tipo: 'escolha',
      enunciado: 'Nas propriedades do TCP/IPv4, onde se digita o IP à mão?',
      cena: { modo: 'ipv4' },
      opcoes: ['Em “Usar o seguinte endereço IP”', 'Em “Obter um endereço IP automaticamente”', 'Na aba “Configuração alternativa”', 'No menu “Diagnosticar”'],
      correta: 0,
      explicacao: '“Usar o seguinte endereço IP” libera os campos Endereço IP, Máscara de sub-rede e Gateway padrão. “Obter automaticamente” deixa a configuração para o DHCP.',
      fonte: a(6),
    },
  ],
}

// ---------- 4.3 ----------

const fase43: Fase = {
  id: '4-3',
  titulo: 'Endereços IPs privados',
  resumo: 'As faixas reservadas do slide: redes privadas, localhost e broadcast.',
  Cena: CenaPrivados,
  camera: [0, 11, 17],
  passos: [
    {
      titulo: 'Redes privadas',
      texto: `
> Existem IPs que **não são** considerados como endereçáveis, são reservados, e não podem ser usados na Internet.

O slide lista três faixas de **Redes Privadas**, uma para cada rede da cena:

- **10.0.0.0/8**
- **172.16.0.0/12**
- **192.168.0.0/16**

Dentro de cada rede local esses IPs funcionam normalmente. Mas um dado endereçado a um IP privado não é entregue pela Internet: é o dado vermelho da cena.

Repare que o 192.168.10.1 de todas as fases anteriores é um IP **privado**.`,
      fonte: a(6),
      cena: { modo: 'privados' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Então como a rede privada acessa a Internet?',
          texto: 'Não está no slide: o roteador que liga a rede local à Internet troca o IP privado pelo IP público dele antes de mandar o dado para fora. Esse recurso se chama **NAT**. É por isso que milhões de casas podem usar o mesmo 192.168.0.0/16 ao mesmo tempo.',
        },
      ],
    },
    {
      titulo: '172.16.0.0/12 são 16 redes',
      texto: `
A faixa do meio vem com uma chave no slide: **172.16.0.0/12** vai de **172.16.0.0/16** até **172.31.0.0/16**.

É a conta da Trilha 3. A máscara /12 fixa os 8 bits do 1º octeto e só **4** bits do 2º:

- 16 = 0001 0000
- 31 = 0001 1111

Os 4 primeiros bits (0001) ficam iguais e os outros 4 variam: são 2⁴ = **16** valores, de 172.16 a 172.31.`,
      fonte: a(6),
      cena: { modo: '172' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: '172.32 já não é privado',
          texto: '172.15.0.1 e 172.32.0.1 estão **fora** da faixa: só 172.16 até 172.31 são privados. Já no 10.0.0.0/8 qualquer 10.x.x.x é privado, e no 192.168.0.0/16 qualquer 192.168.x.x.',
        },
      ],
    },
    {
      titulo: 'Localhost: 127.0.0.0/8',
      texto: `
Abaixo das redes privadas, o slide reserva mais uma faixa: **Localhost 127.0.0.0/8**.

Na cena, o computador manda um dado para **127.0.0.1** e o dado volta para ele mesmo, sem passar pelo cabo.`,
      fonte: a(6),
      cena: { modo: 'localhost' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Para que serve o localhost?',
          texto: 'Não está no slide: *localhost* quer dizer “o próprio computador”. O endereço mais usado é o **127.0.0.1**. Serve para testar programas de rede na própria máquina (um servidor web de teste, por exemplo) sem precisar de outra máquina nem de cabo.',
        },
      ],
    },
    {
      titulo: 'Broadcast: 255.255.255.255',
      texto: `
A última linha do slide é o **Broadcast 255.255.255.255**.

O broadcast é da Aula 02:

> ❸ **BROADCAST** → A transmissão é endereçada à **todos** os destinatários.

Na cena, um dado para 255.255.255.255 chega a **todos** os computadores da rede local.`,
      fonte: a(6),
      cena: { modo: 'broadcast' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Quem usa o broadcast? O DHCP',
          texto: 'Um computador que ainda não tem IP não sabe o endereço do servidor DHCP. Então ele fala com **todos** da rede. É a próxima fase.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Pelas faixas do slide, cada IP é privado ou não?',
      cena: { modo: 'privados' },
      grupos: ['Rede privada', 'Não é privado'],
      itens: [
        { texto: '10.20.30.40', grupo: 0 },
        { texto: '172.20.1.1', grupo: 0 },
        { texto: '192.168.10.1', grupo: 0 },
        { texto: '172.32.0.1', grupo: 1 },
        { texto: '192.169.0.1', grupo: 1 },
        { texto: '8.8.8.8', grupo: 1 },
      ],
      explicacao: 'Privados: 10.0.0.0/8 (10.x.x.x), 172.16.0.0/12 (172.16 a 172.31) e 192.168.0.0/16 (192.168.x.x). 172.32.0.1 passa do 172.31; 192.169.0.1 não é 192.168; 8.8.8.8 é o DNS do ipconfig /all.',
      fonte: a(6),
    },
    {
      tipo: 'digitar',
      enunciado: 'Quantas redes /16 cabem na faixa 172.16.0.0/12?',
      cena: { modo: 'privados' },
      campos: [{ rotulo: 'Redes /16', resposta: '16', formato: 'numero' }],
      explicacao: 'De /12 para /16 são 4 bits a mais: 2⁴ = **16** redes, de 172.16.0.0/16 a 172.31.0.0/16.',
      fonte: a(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual faixa o slide reserva para o localhost?',
      cena: { modo: 'localhost' },
      opcoes: ['127.0.0.0/8', '10.0.0.0/8', '169.254.0.0/16', '255.255.255.255'],
      correta: 0,
      explicacao: 'Localhost = **127.0.0.0/8**. O 10.0.0.0/8 é rede privada e o 255.255.255.255 é o broadcast.',
      fonte: a(6),
    },
    {
      tipo: 'escolha',
      enunciado: 'Um dado endereçado a 255.255.255.255 vai para…',
      cena: { modo: 'broadcast' },
      opcoes: ['Todos os hosts da rede', 'O próprio computador', 'O gateway', 'O servidor DNS'],
      correta: 0,
      explicacao: '255.255.255.255 é o **broadcast**: a transmissão é endereçada a todos os destinatários. O próprio computador é o localhost (127.0.0.1).',
      fonte: a(6),
    },
  ],
}

// ---------- 4.4 ----------

const fase44: Fase = {
  id: '4-4',
  titulo: 'DHCP e APIPA',
  resumo: 'Configuração automática: Discover, Offer, Request e ACK; e o APIPA quando ninguém responde.',
  Cena: CenaDhcp,
  camera: [0, 10, 15],
  passos: [
    {
      titulo: 'Configuração automática: DHCP',
      texto: `
Na janela do TCP/IPv4, a opção **Obter um endereço IP automaticamente** entrega a configuração ao DHCP:

> **DHCP** - Protocolo de Configuração Dinâmica de *Host*

> Fornecer dinamicamente para os *HOSTS* de uma rede os ajustes de configuração TCP/IP:

- ✔ Endereço de IP
- ✔ Máscara de rede
- ✔ Default Gateway
- ✔ Servidor(es) DNS
- ✔ Entre outros.

São as mesmas informações da fase 4.1, só que ninguém precisa digitá-las. O cliente da cena ainda não tem nenhuma.`,
      fonte: a(7),
      cena: { modo: 'parado' },
    },
    {
      titulo: 'DHCP Discover',
      texto: `
O slide mostra a conversa num **Diagrama de Transição**, que aparece à esquerda: uma linha para o **Cliente** e uma para cada servidor DHCP (**Server A** e **Server B**).

Primeiro vem o **DHCP Discover** (*discover* = descobrir). O cliente ainda não sabe quem é o servidor DHCP, então a mensagem sai do cliente e vai para **todos**: no desenho do slide a seta chega ao servidor e ao outro computador.`,
      fonte: a(7),
      cena: { modo: 'discover' },
    },
    {
      titulo: 'DHCP Offer',
      texto: `
Os **dois** servidores respondem com um **DHCP Offer** (*offer* = oferta): cada um oferece uma configuração ao cliente.

No diagrama, as setas verdes saem do Server A e do Server B e chegam ao Cliente.`,
      fonte: a(8),
      cena: { modo: 'offer' },
    },
    {
      titulo: 'DHCP Request',
      texto: `
O cliente escolhe **uma** das ofertas e pede aquela configuração com um **DHCP Request** (*request* = pedido).

No slide ele escolhe o **Server B**: a seta vai só para ele.`,
      fonte: a(8),
      cena: { modo: 'request' },
    },
    {
      titulo: 'DHCP ACK',
      texto: `
Por fim, o Server B confirma com um **DHCP ACK** (*acknowledgement* = confirmação), e o cliente passa a usar a configuração: IP, máscara, gateway e DNS.

Era isso que o **ipconfig /all** da fase 4.2 mostrava: “DHCP Habilitado: Sim”, o **Servidor DHCP 192.168.10.7** que concedeu a configuração e as datas da **concessão**.`,
      fonte: a(9),
      cena: { modo: 'ack' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'D-O-R-A',
          texto: 'A ordem é **D**iscover, **O**ffer, **R**equest, **A**CK. O cliente fala no 1º e no 3º; o servidor responde no 2º e no 4º.',
        },
        {
          tipo: 'curiosidade',
          titulo: 'E o Server A?',
          texto: 'Não está no slide: na prática o Request também vai para todos (broadcast), com a indicação do servidor escolhido. Assim o Server A fica sabendo que a oferta dele foi recusada e guarda aquele IP para outro cliente.',
        },
      ],
    },
    {
      titulo: 'APIPA: quando o DHCP não responde',
      texto: `
> **APIPA** - Endereçamento Automático IP Privado

> Recurso do Windows que permite que *hosts* configurem um endereço IP e uma máscara de sub-rede automaticamente quando o servidor DHCP não estiver acessível.

> Faixa de endereços reservados APIPA: 169.254.0.1 até 169.254.255.254 máscara 255.255.0.0

Na cena os dois servidores estão fora do ar: o Discover sai e ninguém responde. O Windows escolhe sozinho um IP **169.254.x.x** com máscara **255.255.0.0** (/16).`,
      fonte: a(9),
      cena: { modo: 'apipa' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Viu 169.254 no ipconfig?',
          texto: 'Se o ipconfig mostra um IP 169.254.x.x, o computador **não** conseguiu falar com o servidor DHCP. O APIPA não configura gateway nem DNS, então o computador fica sem Internet.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual é a ordem das mensagens do DHCP?',
      cena: { modo: 'parado' },
      opcoes: ['Discover, Offer, Request, ACK', 'Request, Offer, Discover, ACK', 'Discover, Request, Offer, ACK', 'Offer, Discover, ACK, Request'],
      correta: 0,
      explicacao: '**D**iscover (cliente procura) → **O**ffer (servidores oferecem) → **R**equest (cliente pede) → **A**CK (servidor confirma).',
      fonte: a(9),
    },
    {
      tipo: 'classificar',
      enunciado: 'No DHCP, quem envia cada mensagem?',
      cena: { modo: 'parado' },
      grupos: ['Cliente', 'Servidor DHCP'],
      itens: [
        { texto: 'DHCP Discover', grupo: 0 },
        { texto: 'DHCP Offer', grupo: 1 },
        { texto: 'DHCP Request', grupo: 0 },
        { texto: 'DHCP ACK', grupo: 1 },
      ],
      explicacao: 'O cliente envia o Discover e o Request; os servidores respondem com o Offer e o ACK.',
      fonte: a(8),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes itens NÃO está na lista do que o DHCP fornece, no slide?',
      cena: { modo: 'parado' },
      opcoes: ['Endereço MAC', 'Endereço de IP', 'Máscara de rede', 'Servidor(es) DNS'],
      correta: 0,
      explicacao: 'O DHCP fornece Endereço de IP, Máscara de rede, Default Gateway, Servidor(es) DNS, entre outros. O **MAC** vem gravado na placa de rede, não é configurado pelo DHCP.',
      fonte: a(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'No diagrama do slide, para qual servidor o cliente envia o DHCP Request?',
      cena: { modo: 'ack', requestOculto: true },
      opcoes: ['Server B', 'Server A', 'Para os dois', 'Para o gateway'],
      correta: 0,
      explicacao: 'Os dois servidores fizeram um Offer, mas o cliente escolheu o **Server B**: o Request vai para ele, e por isso é ele que responde o ACK.',
      fonte: a(8),
    },
    {
      tipo: 'digitar',
      enunciado: 'Um host sem resposta do DHCP se configurou pelo APIPA. Complete com a faixa do slide.',
      cena: { modo: 'apipa' },
      dados: ['Faixa APIPA: ? até 169.254.255.254'],
      campos: [
        { rotulo: 'Primeiro endereço', resposta: '169.254.0.1', formato: 'ip' },
        { rotulo: 'Máscara', resposta: '255.255.0.0', formato: 'mascara' },
      ],
      explicacao: '> Faixa de endereços reservados APIPA: 169.254.0.1 até 169.254.255.254 máscara 255.255.0.0',
      fonte: a(9),
    },
  ],
}

// ---------- 4.5 ----------

const fase45: Fase = {
  id: '4-5',
  titulo: 'DNS e domínios',
  resumo: 'O Sistema de Nomes de Domínio, o registro de domínios e os tipos de registro.',
  Cena: CenaDns,
  camera: [0, 10, 16],
  passos: [
    {
      titulo: 'Sistema de Nomes de Domínio',
      texto: `
> **DNS**, *Domain Name System*

> Surgiu da necessidade de traduzir nomes mais fáceis de serem lembrados para seus respectivos endereços na rede.

> Criado em 1983 por Paul Mockapertris.

Na cena, o computador pergunta ao servidor DNS o endereço de **www.unilasalle.edu.br** e recebe o IP **34.226.91.154**.

> Para facilitar a identificação dos serviços, criaram-se terminações elucidativas:

- **.com** → domínios comerciais.
- **.net** → empresas de *networking*.
- **.org** → organizações sem fins lucrativos.`,
      fonte: a(10),
      cena: { modo: 'traducao' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O nome do criador',
          noSlide: 'Criado em 1983 por Paul **Mockapertris**.',
          naPratica: 'O nome se escreve Paul **Mockapetris**, sem o “r” do meio.',
        },
      ],
    },
    {
      titulo: 'Domínios',
      texto: `
> Concebido com o objetivo de facilitar a memorização.

> Para registrar um domínio no Brasil → \`Registro.br\`.

Para o registro é necessário:

- Ser uma entidade legalmente representada (CNPJ ou CPF).
- Ao menos 2 servidores DNS conectados.

A cena é a figura do slide: os domínios **lasalle.edu.br** e **unilasalle.edu.br** têm exatamente **2** servidores DNS, o **ns01** e o **ns02**. Ao lado estão os servidores **svr-net03** e **www**, e em cima o servidor de e-mail **aspmx.l.google.com**.`,
      fonte: a(11),
      cena: { modo: 'zona' },
    },
    {
      titulo: 'Principais tipos de registros',
      texto: `
Cada informação que o servidor DNS guarda é um **registro**, e cada registro tem um **tipo**. Na figura, as chaves ao lado do svr-net03 e do www listam os registros deles.

Clique nos marcadores para ver a definição de cada tipo, como está no slide.`,
      fonte: a(12),
      cena: { modo: 'registros' },
      explorar: {
        instrucao: 'Clique nos 5 marcadores “?” para ver os 5 tipos de registro do slide.',
        alvos: {
          ns: { titulo: 'NS: ns01 e ns02', texto: '“Identificador de Servidor DNS”. O ns01 e o ns02 são os 2 servidores DNS dos domínios.' },
          a: { titulo: 'A: 45.181.173.133', texto: '“Endereço IP do *host*”. O IP do svr-net03 é 45.181.173.133.' },
          cname: { titulo: 'CNAME: www.lasalle.edu.br', texto: '“Apelido para outro hostname”. **www.lasalle.edu.br** é um apelido: quem acessa esse nome chega ao svr-net03.' },
          mx: { titulo: 'MX: aspmx.l.google.com', texto: '“Identificador do Servidor de email”. Os e-mails dos domínios são entregues ao servidor do Google.' },
          ptr: { titulo: 'PTR: www.unilasalle.edu.br', texto: 'O slide diz “Endereço IP do Servidor de email”, mas veja a nota: o PTR faz o caminho **contrário** do A, do IP para o nome.' },
        },
      },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O que é o registro PTR',
          noSlide: 'PTR → Endereço IP do Servidor de email (quase a mesma definição do MX).',
          naPratica: 'O PTR é o registro **reverso**: dado um IP, diz qual é o nome. É o que a própria figura do slide mostra: o IP 45.181.173.133 tem PTR **svr-net03.lasalle.edu.br**. Servidores de e-mail usam o PTR para conferir quem está mandando mensagens, mas ele não é o “IP do servidor de email”. Na prova, se cair a definição, responda como o slide.',
        },
      ],
    },
    {
      titulo: 'Tabela no Servidor DNS',
      texto: `
O slide junta os registros numa tabela, com três colunas: **Nome Domínio**, **TIPO** e **Endereço IP**.

- ns01 e ns02 são os dois **NS**, com IPs 45.181.173.2 e 45.181.173.3.
- svr-net03.lasalle.edu.br é um **A**: 45.181.173.133.
- www.lasalle.edu.br é um **CNAME** de svr-net03.lasalle.edu.br.
- aspmx e alt2.aspmx são dois **MX**: os e-mails têm um servidor reserva.`,
      fonte: a(12),
      cena: { modo: 'tabela' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'CNAME aponta para um nome',
          texto: 'Na linha do CNAME, a coluna “Endereço IP” traz um **nome** (svr-net03.lasalle.edu.br), não um IP. Para achar o IP de www.lasalle.edu.br, segue-se o apelido até o registro **A** do svr-net03: 45.181.173.133.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Por que o DNS foi criado?',
      cena: { modo: 'traducao' },
      opcoes: ['Para traduzir nomes fáceis de lembrar em endereços da rede', 'Para dar IPs automaticamente aos hosts', 'Para guardar o MAC das placas de rede', 'Para ligar redes privadas à Internet'],
      correta: 0,
      explicacao: '> Surgiu da necessidade de traduzir nomes mais fáceis de serem lembrados para seus respectivos endereços na rede.\n\nDar IPs automaticamente é o DHCP.',
      fonte: a(10),
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada tipo de registro à sua definição no slide.',
      cena: { modo: 'zona' },
      grupos: ['NS', 'A', 'CNAME', 'MX'],
      itens: [
        { texto: 'Identificador de Servidor DNS', grupo: 0 },
        { texto: 'Endereço IP do host', grupo: 1 },
        { texto: 'Apelido para outro hostname', grupo: 2 },
        { texto: 'Identificador do Servidor de email', grupo: 3 },
      ],
      explicacao: 'NS → servidor DNS; A → IP do host; CNAME → apelido; MX → servidor de e-mail.',
      fonte: a(12),
    },
    {
      tipo: 'escolha',
      enunciado: 'Pelo slide, o que é necessário para registrar um domínio no Registro.br?',
      cena: { modo: 'zona' },
      opcoes: ['CNPJ ou CPF e ao menos 2 servidores DNS', 'Só um CPF', 'Um IP público e um servidor DHCP', 'Ao menos 2 servidores de e-mail'],
      correta: 0,
      explicacao: 'Ser uma entidade legalmente representada (**CNPJ ou CPF**) e ter **ao menos 2 servidores DNS** conectados, como o ns01 e o ns02.',
      fonte: a(11),
    },
    {
      tipo: 'digitar',
      enunciado: 'Use a tabela do servidor DNS do slide (na tela) para achar os IPs.',
      cena: { modo: 'tabela' },
      campos: [
        { rotulo: 'IP de www.lasalle.edu.br', resposta: '45.181.173.133', formato: 'ip' },
        { rotulo: 'IP do servidor de e-mail', resposta: '142.251.0.26', formato: 'ip' },
      ],
      explicacao: 'www.lasalle.edu.br é um **CNAME** (apelido) de svr-net03.lasalle.edu.br, cujo registro **A** é **45.181.173.133**. O servidor de e-mail é o registro **MX**: **142.251.0.26**.',
      fonte: a(12),
    },
    {
      tipo: 'escolha',
      enunciado: 'Na tabela, www.lasalle.edu.br é um registro CNAME. Isso quer dizer que…',
      cena: { modo: 'tabela' },
      opcoes: ['Ele é um apelido de svr-net03.lasalle.edu.br', 'Ele é um servidor DNS', 'Ele é o servidor de e-mail do domínio', 'Ele não tem IP'],
      correta: 0,
      explicacao: 'CNAME → apelido para outro hostname. Quem acessa www.lasalle.edu.br chega ao **svr-net03.lasalle.edu.br**, cujo IP é 45.181.173.133.',
      fonte: a(12),
    },
  ],
}

// ---------- 4.6 ----------

const fase46: Fase = {
  id: '4-6',
  titulo: 'Consultas, FQDN e URL',
  resumo: 'A árvore do DNS, o nslookup, o nome de domínio completo e as partes de um URL.',
  Cena: CenaDns,
  camera: [0, 6.8, 18.5],
  alvoCamera: [0, 2.4, 0],
  passos: [
    {
      titulo: 'A árvore do DNS',
      texto: `
Os nomes de domínio formam uma **árvore**. O slide separa os níveis com linhas tracejadas:

- **root**: o ponto no topo, de onde tudo sai.
- **1º nível**: .br, .gb, .jp.
- **2º nível**: .com, .edu, .org, .gov (embaixo do .br).
- **3º nível**: .google (embaixo do .com) e .unilasalle (embaixo do .edu).

No 3º nível, dentro da caixa, ficam o **ns01** e o **www** da fase anterior.`,
      fonte: a(13),
      cena: { modo: 'arvore' },
    },
    {
      titulo: 'Diagrama da consulta DNS',
      texto: `
O computador quer acessar **www.lasalle.edu.br**. As setas do slide mostram o caminho da consulta:

1. A pergunta (verde) vai do computador ao servidor **.google**, que é o DNS que ele usa.
2. Sobe pelo **.com** até o **.br**.
3. Desce pelo **.edu** até o **ns01**, que conhece o domínio.
4. A resposta (azul) volta do ns01 para o .google, e dele para o computador.`,
      fonte: a(13),
      cena: { modo: 'consulta' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O .google e o 8.8.8.8',
          texto: 'Não está no slide: o .google do desenho faz o papel do DNS configurado no computador, como o **8.8.8.8** (Google) do ipconfig /all. Na prática, ele começa perguntando à **raiz** (root), depois ao servidor do .br, ao do edu.br e por fim ao ns01, e guarda a resposta por um tempo para não repetir a viagem.',
        },
      ],
    },
    {
      titulo: 'Consultas ao DNS: nslookup',
      texto: `
> **NSLOOKUP** ➡ Aplicativo que permite obter informações sobre registros de DNS ao servidor DNS.

O prompt da cena rodou o exemplo do slide: **nslookup www.unilasalle.edu.br** respondeu **Address: 34.226.91.154**, o registro A do www.

Experimente também os nomes da tabela da fase anterior.`,
      fonte: a(13),
      cena: { modo: 'nslookup' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: '“Non-authoritative answer”',
          texto: 'Não está no slide: “resposta não autoritativa” quer dizer que quem respondeu **não** foi o servidor do próprio domínio (ns01 ou ns02), e sim o DNS configurado no computador, que já tinha a resposta guardada.',
        },
      ],
    },
    {
      titulo: 'FQDN: nome de domínio totalmente qualificado',
      texto: `
> **FQDN**, *Fully Qualified Domain Name*

> É um nome de domínio que especifica sua localização exata na árvore hierárquica do DNS.

> Especifica todos os níveis de domínio, incluindo o domínio de segundo nível e o domínio de nível superior.

> Também chamado de nome de domínio absoluto

O exemplo do slide é **www.lasalle.edu.br**. Lido da direita para a esquerda, ele desce a árvore: **.br** (1º nível) → **.edu** (2º nível) → **.lasalle** → **www**, o *host*.`,
      fonte: a(14),
      cena: { modo: 'fqdn' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O ponto escondido',
          texto: 'Não está no slide: o FQDN completo termina com um ponto, **www.lasalle.edu.br.**, que representa a raiz (root). Na prática quase ninguém escreve esse último ponto.',
        },
      ],
    },
    {
      titulo: 'URL: Localizador Universal de Pesquisa',
      texto: `
> **URL**, *Uniform Resource Locator*

> É o endereço de rede no qual se encontra algum recurso.

> Exemplo: um arquivo, ou dispositivo em um *host*. A rede pode ser a Internet, uma rede corporativa, etc.

> Nas redes TCP/IP, um URL completo possui a seguinte estrutura:

\`protocolo://domínio:porta/caminho/recurso\`

A cena monta um URL com essa estrutura. O domínio é o FQDN do passo anterior.`,
      fonte: a(14),
      cena: { modo: 'url' },
      explorar: {
        instrucao: 'Clique nos 5 marcadores “?” para ver cada parte do URL.',
        alvos: {
          protocolo: { titulo: 'protocolo: https', texto: 'Como o recurso vai ser buscado. **https** é o protocolo das páginas web (com segurança).' },
          dominio: { titulo: 'domínio: www.lasalle.edu.br', texto: 'O FQDN do *host* onde o recurso está. Antes de conectar, o navegador pergunta o IP dele ao **DNS**.' },
          porta: { titulo: 'porta: 443', texto: 'Qual serviço do *host* vai atender. O **443** é a porta padrão do https, por isso normalmente ela nem aparece no URL.' },
          caminho: { titulo: 'caminho: /cursos/redes', texto: 'As pastas até o recurso, como num computador.' },
          recurso: { titulo: 'recurso: aula04.pdf', texto: 'O arquivo pedido.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O exemplo não é do slide',
          texto: 'O slide só dá a estrutura. O URL da cena (https://www.lasalle.edu.br:443/cursos/redes/aula04.pdf) foi inventado para mostrar cada parte, e a porta padrão do https (443) não está no slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'No diagrama do slide, cada domínio está em qual nível?',
      cena: { modo: 'arvore', semNiveis: true },
      grupos: ['1º nível', '2º nível', '3º nível'],
      itens: [
        { texto: '.br', grupo: 0 },
        { texto: '.jp', grupo: 0 },
        { texto: '.com', grupo: 1 },
        { texto: '.edu', grupo: 1 },
        { texto: '.google', grupo: 2 },
        { texto: '.unilasalle', grupo: 2 },
      ],
      explicacao: 'Abaixo da root vem o 1º nível: .br, .gb, .jp. Abaixo do .br, o 2º nível: .com, .edu, .org, .gov. Abaixo deles, o 3º nível: .google e .unilasalle.',
      fonte: a(13),
    },
    {
      tipo: 'digitar',
      enunciado: 'Olhe os registros do servidor www na figura do slide (na tela) e complete a resposta do nslookup.',
      cena: { modo: 'zona' },
      dados: [
        'C:\\> nslookup www.unilasalle.edu.br',
        'Non-authoritative answer:',
        'Name:    www.unilasalle.edu.br',
        'Address: ?',
      ],
      campos: [{ rotulo: 'Address', resposta: '34.226.91.154', formato: 'ip' }],
      explicacao: 'O nslookup devolve o registro A do www.unilasalle.edu.br: **34.226.91.154**.',
      fonte: a(13),
    },
    {
      tipo: 'escolha',
      enunciado: 'Para que serve o nslookup?',
      cena: { modo: 'nslookup' },
      opcoes: ['Obter informações sobre registros de DNS', 'Mostrar a configuração TCP/IP da placa de rede', 'Abrir as conexões de rede', 'Pedir um IP ao servidor DHCP'],
      correta: 0,
      explicacao: '> NSLOOKUP ➡ Aplicativo que permite obter informações sobre registros de DNS ao servidor DNS.',
      fonte: a(13),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o outro nome do FQDN, segundo o slide?',
      cena: { modo: 'fqdn' },
      opcoes: ['Nome de domínio absoluto', 'Apelido (CNAME)', 'Domínio de nível superior', 'Endereço de rede'],
      correta: 0,
      explicacao: 'O FQDN é “também chamado de nome de domínio absoluto”: especifica todos os níveis, até o domínio de nível superior.',
      fonte: a(14),
    },
    {
      tipo: 'classificar',
      enunciado: 'Em https://www.lasalle.edu.br:443/cursos/redes/aula04.pdf, qual parte é cada trecho?',
      cena: { modo: 'url', semRotulos: true },
      grupos: ['protocolo', 'domínio', 'porta', 'caminho', 'recurso'],
      itens: [
        { texto: 'https', grupo: 0 },
        { texto: 'www.lasalle.edu.br', grupo: 1 },
        { texto: '443', grupo: 2 },
        { texto: '/cursos/redes', grupo: 3 },
        { texto: 'aula04.pdf', grupo: 4 },
      ],
      explicacao: 'A estrutura do slide é **protocolo://domínio:porta/caminho/recurso**.',
      fonte: a(14),
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'O ipconfig de um computador mostra o IP 169.254.37.12. O que aconteceu?',
    opcoes: ['O servidor DHCP não respondeu e o Windows usou o APIPA', 'O computador está usando um IP privado 10.x', 'O DNS está fora do ar', 'É o endereço de localhost'],
    correta: 0,
    explicacao: '169.254.0.1 até 169.254.255.254 é a faixa **APIPA**: o Windows a usa quando o servidor DHCP não está acessível.',
    fonte: a(9),
  },
  {
    tipo: 'classificar',
    enunciado: 'Cada tarefa é feita por qual comando ou serviço?',
    grupos: ['ipconfig', 'ncpa.cpl', 'DHCP', 'DNS'],
    itens: [
      { texto: 'Mostrar a configuração TCP/IP no prompt', grupo: 0 },
      { texto: 'Abrir as conexões de rede para configurar', grupo: 1 },
      { texto: 'Entregar IP, máscara, gateway e DNS ao host', grupo: 2 },
      { texto: 'Traduzir um nome no endereço IP', grupo: 3 },
    ],
    explicacao: 'ipconfig mostra; ncpa.cpl configura; o DHCP fornece a configuração automaticamente; o DNS traduz nomes em IPs.',
    fonte: a(10),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual registro DNS guarda o IP de um host?',
    opcoes: ['A', 'NS', 'CNAME', 'MX'],
    correta: 0,
    explicacao: '**A** → Endereço IP do host. NS = servidor DNS, CNAME = apelido, MX = servidor de e-mail.',
    fonte: a(12),
  },
  {
    tipo: 'escolha',
    enunciado: 'Um computador recebeu IP, máscara, gateway e DNS automaticamente de 192.168.10.7. No ipconfig /all, esse IP aparece na linha…',
    opcoes: ['Servidor DHCP', 'Servidor DNS', 'Gateway Padrão', 'Endereço IPv4 do computador'],
    correta: 0,
    explicacao: 'Servidor DHCP: **192.168.10.7**. O gateway é o 192.168.10.5, o DNS é o 8.8.8.8 e o IP do computador é o 192.168.10.1.',
    fonte: a(5),
  },
]

export const trilha4: Trilha = {
  id: 't4',
  numero: 4,
  titulo: 'Usando a rede',
  aula: 'Aula 04 · Usando a rede',
  cor: '#e9a620',
  disponivel: true,
  fases: [fase41, fase42, fase43, fase44, fase45, fase46],
  chefaoExtras: extras,
}
