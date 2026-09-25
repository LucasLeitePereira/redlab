import type { CampoResposta, Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaBits } from './cenas/Bits'
import { CenaEnderecos } from './cenas/Enderecos'
import { CenaSubredes } from './cenas/Subredes'
import { explicarCorte, explicarQuantidade, explicarValidos, gerarQuestao } from './gerador'
import { broadcast, hosts, mascaraDe, paraIp, prefixoDe, primeiro, rede, ultimo } from './ip'

// Trilha 3 — Endereçamento IPv4. Três PDFs da Aula 03:
//   p1 = REDES-03p1_Endereca-Hosts.pdf    (5 páginas, 2 slides por página)
//   p2 = REDES-03p2_Calc-Rede-BrdCast.pdf (4 páginas)
//   p3 = REDES-03p3_Exemplos.pdf          (3 páginas)
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.
// Os slides escrevem os IPs com "·" no meio (192·168·10·1); aqui usamos o ponto normal.

const p1 = (pagina: number | string): Fonte => ({ aula: 'Aula 03 p1', pagina })
const p2 = (pagina: number | string): Fonte => ({ aula: 'Aula 03 p2', pagina })
const p3 = (pagina: number | string): Fonte => ({ aula: 'Aula 03 p3', pagina })

const mascara = (pref: number) => paraIp(mascaraDe(pref))

function digitar(enunciado: string, dados: string[], campos: CampoResposta[], explicacao: string | string[], fonte: Fonte): Questao {
  return { tipo: 'digitar', enunciado, dados, campos, explicacao: Array.isArray(explicacao) ? explicacao.join('\n') : explicacao, fonte }
}

// ---------- 3.1 ----------

const fase31: Fase = {
  id: '3-1',
  titulo: 'Endereços e o IPv4',
  resumo: 'Os 3 tipos de endereço, o IPv4 de 32 bits e quantos endereços existem.',
  Cena: CenaEnderecos,
  camera: [0, 7.5, 15],
  passos: [
    {
      titulo: 'Três endereços para achar um serviço',
      texto: `
A Aula 03 começa assim:

> Para encontrar um serviço na Internet são usados 3 tipos de endereços

A cena empilha os três como andares, na mesma ordem do slide: o **1º** embaixo, perto do cabo, e o **3º** em cima, perto dos programas.`,
      fonte: p1(2),
      cena: { modo: 'tipos' },
      explorar: {
        instrucao: 'Clique nos 3 marcadores “?” para ver cada tipo de endereço.',
        alvos: {
          mac: { titulo: '1º Endereços Físicos (ex.: Endereço MAC)', texto: 'Fica na placa de rede: é o endereço do *hardware* que liga o computador ao cabo.' },
          ip: { titulo: '2º Endereços Lógicos (ex.: Endereço IP)', texto: 'É o endereço do computador na rede, como o 192.168.10.1 do slide. É dele que trata esta trilha.' },
          porta: { titulo: '3º Endereços de Aplicações (ex.: Número das Portas)', texto: 'Dentro do mesmo computador rodam vários programas: a porta diz para qual deles a mensagem vai.' },
        },
      },
    },
    {
      titulo: 'O endereço lógico',
      texto: `
O slide destaca o segundo tipo:

> Endereço Lógico ⇒ Usado para o gerenciamento dos computadores.

O endereço físico já vem na placa de rede. O lógico é **configurado** por quem administra a rede, e é com ele que os computadores são organizados em grupos (as sub-redes, que aparecem daqui a pouco).`,
      fonte: p1(2),
      cena: { modo: 'tipos' },
    },
    {
      titulo: 'Endereço IPv4',
      texto: `
> - Identificador lógico do protocolo Internet versão 4.
> - Formado por um conjunto de 32 bits.
> - Representado por um conjunto de 4 octetos (decimais).
> - Usado para identificar um *host* na rede TCP/IP.

Cada teclinha da cena é **um bit**: alta = 1, baixa = 0. Os 32 bits são separados em **4 octetos** (grupos de 8), e cada octeto vira um número decimal. O exemplo do slide:

\`11000000 10101000 00001010 00000001\` = **192.168.10.1**`,
      fonte: p1(2),
      cena: { modo: 'ip', ip: '192.168.10.1' },
    },
    {
      titulo: 'Dimensão de uma rede IPv4',
      texto: `
Se o IP tem 32 bits, quantos endereços existem? O slide conta do primeiro ao último, como um odômetro:

- 1º IP: \`00000000.00000000.00000000.00000000\` = 0.0.0.0
- depois 0.0.0.1, 0.0.0.2, … 0.0.0.255, 0.0.1.0, …
- Último IP: \`11111111.11111111.11111111.11111111\` = 255.255.255.255

Cada bit dobra a quantidade, então são **2³²**:

> 2³² = 2² × 2¹⁰ × 2¹⁰ × 2¹⁰ … = 4.294.967.296 endereços IPs`,
      fonte: p1(3),
      cena: { modo: 'dimensao' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Erro de digitação na conta do slide',
          noSlide: '2³² = 2² × 2¹⁰ × 2¹⁰ × 2¹⁰ = 4² × 1024 × 1024 × 1024 = 4.294.967.296',
          naPratica: '2² é 4, não 4². O certo é 4 × 1024 × 1024 × 1024 = 4.294.967.296 (com 4² daria 17.179.869.184). O resultado final do slide está certo.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada exemplo é de qual tipo de endereço?',
      grupos: ['1º Físico', '2º Lógico', '3º Aplicação'],
      itens: [
        { texto: 'Endereço MAC', grupo: 0 },
        { texto: 'Endereço IP', grupo: 1 },
        { texto: 'Número da porta', grupo: 2 },
      ],
      explicacao: 'Slide: **3º** Endereços de Aplicações (ex.: Número das Portas), **2º** Endereços Lógicos (ex.: Endereço IP), **1º** Endereços Físicos (ex.: Endereço MAC).',
      fonte: p1(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, o endereço lógico é usado para…',
      opcoes: ['O gerenciamento dos computadores', 'Identificar o fabricante da placa de rede', 'Escolher o programa que recebe a mensagem', 'Medir a velocidade da rede'],
      correta: 0,
      explicacao: '> Endereço Lógico ⇒ Usado para o gerenciamento dos computadores.',
      fonte: p1(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Um endereço IPv4 é formado por…',
      opcoes: ['32 bits, em 4 octetos', '32 bits, em 8 octetos', '64 bits, em 4 octetos', '4 bits, em 32 octetos'],
      correta: 0,
      explicacao: 'IPv4: **32 bits**, representados por **4 octetos** decimais (4 × 8 = 32).',
      fonte: p1(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Quantos endereços IPv4 existem?',
      opcoes: ['2³² = 4.294.967.296', '2²⁴ = 16.777.216', '4 × 255 = 1.020', '255⁴ = 4.228.250.625'],
      correta: 0,
      explicacao: 'São 32 bits, cada um 0 ou 1: **2³² = 4.294.967.296** endereços (de 0.0.0.0 a 255.255.255.255). Cuidado com o 255⁴: cada octeto tem 256 valores (0 a 255), não 255.',
      fonte: p1(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o último endereço IPv4?',
      opcoes: ['255.255.255.255', '256.256.256.256', '999.999.999.999', '255.255.255.0'],
      correta: 0,
      explicacao: 'Todos os 32 bits em 1: `11111111.11111111.11111111.11111111` = **255.255.255.255**. Um octeto vai de 0 a 255.',
      fonte: p1(3),
    },
  ],
}

// ---------- 3.2 ----------

const fase32: Fase = {
  id: '3-2',
  titulo: 'Binário ↔ decimal',
  resumo: 'Os pesos 128, 64, 32… e a conversão de cada octeto.',
  Cena: CenaBits,
  camera: [0, 8.5, 10],
  passos: [
    {
      titulo: 'Um octeto = 8 bits',
      texto: `
O slide mostra \`11000000\` = 192, mas não mostra *como* converter. Como todas as contas desta trilha dependem disso, vale treinar.

Cada posição do octeto tem um **peso**, dobrando da direita para a esquerda:

**128 · 64 · 32 · 16 · 8 · 4 · 2 · 1**

O valor do octeto é a **soma dos pesos dos bits 1**. Clique nas teclas da cena para ligar e desligar os bits e veja a soma mudar.`,
      fonte: p1(2),
      cena: { modo: 'binario', valor: 0 },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O método dos pesos',
          texto: 'O slide só mostra o resultado da conversão. O método dos pesos é o jeito usual de fazer a conta (e o mais rápido na prova): 8 bits todos em 1 dão 128+64+32+16+8+4+2+1 = 255, o maior valor de um octeto.',
        },
      ],
    },
    {
      titulo: 'Forme o 192',
      texto: `
O 1º octeto do IP do slide é **192**. Ligue as teclas certas para formar esse número.

Dica: comece pelo maior peso que cabe. 128 cabe em 192? Sobra quanto?`,
      fonte: p1(2),
      cena: { modo: 'binario', meta: 192 },
      explorar: {
        instrucao: 'Ligue os bits até a soma dar 192.',
        alvos: { meta: { titulo: '192 = 11000000', texto: '128 + 64 = 192. Sobrou 0, então os outros bits ficam em 0.' } },
      },
    },
    {
      titulo: 'Forme o 168',
      texto: `
Agora o 2º octeto: **168**.

168 − 128 = 40 → 40 − 32 = 8 → 8 − 8 = 0.`,
      fonte: p1(2),
      cena: { modo: 'binario', meta: 168 },
      explorar: {
        instrucao: 'Ligue os bits até a soma dar 168.',
        alvos: { meta: { titulo: '168 = 10101000', texto: '128 + 32 + 8 = 168.' } },
      },
    },
    {
      titulo: 'Forme o 10',
      texto: `
O 3º octeto: **10**. Números pequenos só usam os bits da direita; os da esquerda ficam em 0 (e **não podem sumir**: o octeto sempre tem 8 bits).`,
      fonte: p1(2),
      cena: { modo: 'binario', meta: 10 },
      explorar: {
        instrucao: 'Ligue os bits até a soma dar 10.',
        alvos: { meta: { titulo: '10 = 00001010', texto: '8 + 2 = 10. Os quatro zeros da esquerda fazem parte do octeto.' } },
      },
    },
    {
      titulo: 'O IP inteiro',
      texto: `
Juntando os quatro octetos (o último, 1, é \`00000001\`):

> 11000000 10101000 00001010 00000001 = 192.168.10.1

Cada octeto é convertido **separado**. Por isso o IP é escrito em decimal com pontos: é bem mais fácil de ler que 32 zeros e uns.`,
      fonte: p1(2),
      cena: { modo: 'ip', ip: '192.168.10.1' },
    },
    {
      titulo: 'Os octetos das máscaras',
      texto: `
Nas próximas fases vão aparecer máscaras como 255.255.240.0. Os octetos de máscara são sempre **uns à esquerda e zeros à direita**, então só existem estes:

- \`10000000\` = 128
- \`11000000\` = 192
- \`11100000\` = 224
- \`11110000\` = 240
- \`11111000\` = 248
- \`11111100\` = 252
- \`11111110\` = 254
- \`11111111\` = 255

A cena mostra o 240. Vale decorar essa lista: ela economiza muito tempo na prova.`,
      fonte: p2(3),
      cena: { modo: 'binario', valor: 240 },
      notas: [{ tipo: 'dica', titulo: 'Truque para montar a lista', texto: 'Cada linha soma o próximo peso: 128, 128+64 = 192, 192+32 = 224, 224+16 = 240, e assim por diante.' }],
    },
  ],
  desafio: [
    digitar('Converta o octeto para binário (8 bits).', ['192'], [{ rotulo: 'Binário', resposta: '11000000', formato: 'binario' }], '- 192 = 128 + 64 → `11000000`', p1(2)),
    digitar('Converta o octeto para decimal.', ['10101000'], [{ rotulo: 'Decimal', resposta: '168', formato: 'numero' }], '- `10101000` → 128 + 32 + 8 = **168**', p1(2)),
    digitar('Converta o octeto para decimal.', ['00001010'], [{ rotulo: 'Decimal', resposta: '10', formato: 'numero' }], '- `00001010` → 8 + 2 = **10**', p1(2)),
    digitar('Converta o octeto de máscara para binário (8 bits).', ['240'], [{ rotulo: 'Binário', resposta: '11110000', formato: 'binario' }], '- 240 = 128 + 64 + 32 + 16 → `11110000`', p2(3)),
    {
      tipo: 'escolha',
      enunciado: 'Qual é o maior valor que um octeto pode ter?',
      opcoes: ['255', '256', '128', '999'],
      correta: 0,
      explicacao: '`11111111` = 128+64+32+16+8+4+2+1 = **255**. Um octeto vai de 0 a 255 (256 valores).',
      fonte: p1(3),
    },
  ],
}

// ---------- 3.3 ----------

const fase33: Fase = {
  id: '3-3',
  titulo: 'Sub-redes e máscara',
  resumo: 'Quem conversa direto, a máscara e a operação AND.',
  Cena: CenaSubredes,
  camera: [0, 9.5, 14.5],
  passos: [
    {
      titulo: 'Determinando sub-redes',
      texto: `
> - Sub-redes são usadas para melhor gerenciamento da rede.
> - Cada sub-rede possui uma identificação.
> - Apenas *hosts* na mesma sub-rede se comunicam diretamente.

A figura do slide: três notebooks **no mesmo cabo**. Os dois 192.168.10.x estão na **sub-rede A** e conversam (dado verde). O 172.16.10.1 está na **sub-rede B** e fica de cara feia: mesmo ligado no mesmo cabo, não conversa direto com A (dado vermelho).

> Como sabemos diferenciar as sub-redes?`,
      fonte: p1(3),
      cena: { modo: 'mesma' },
    },
    {
      titulo: 'A máscara',
      texto: `
A resposta é a **máscara**:

> máscara ⇒ É usado para calcular o endereço IP da sub-rede.

Cada *host* é configurado com o IP **e** a máscara. No slide, os de A usam 255.255.255.0 e o de B usa 255.255.0.0.

> OBS: Não é possível ter dois *hosts* com o mesmo endereço IP.`,
      fonte: p1(4),
      cena: { modo: 'mascara' },
    },
    {
      titulo: 'Operação AND',
      texto: `
> Para calcular o endereço da sub-rede é realizada uma operação **AND** entre os dois endereços IPs (IP do *host* e máscara).

A conta é **bit a bit**, coluna por coluna:

- 1 AND 1 = **1**
- qualquer outra combinação = **0**

Onde a máscara tem 1, o bit do IP passa igual. Onde tem 0, vira 0. Resultado do slide:

> 192.168.10.1 AND 255.255.255.0 → 192.168.10.0`,
      fonte: p1(4),
      cena: { modo: 'and', ip: '192.168.10.1', pref: 24 },
      notas: [{ tipo: 'dica', titulo: 'Atalho com octetos 255 e 0', texto: 'Octeto 255 na máscara: copia o octeto do IP. Octeto 0: vira 0. Só precisa converter para binário o octeto da máscara que não é 255 nem 0.' }],
    },
    {
      titulo: 'O AND do host da sub-rede B',
      texto: `
O mesmo cálculo para o 172.16.10.1 com máscara 255.255.0.0:

- 172 e 16 passam (máscara 255)
- 10 e 1 viram 0 (máscara 0)

Sub-rede: **172.16.0.0**. Diferente de 192.168.10.0, por isso ele não conversa direto com os outros dois.`,
      fonte: p1(5),
      cena: { modo: 'and', ip: '172.16.10.1', pref: 16 },
    },
    {
      titulo: 'Endereço e identificador da sub-rede',
      texto: `
A figura completa do slide:

- Endereço da sub-rede: **192.168.10.0**, **192.168.10.0** e **172.16.0.0**
- Identificador da sub-rede: **192.168.10** e **172.16**

O identificador é a parte que "sobra" do IP depois do AND, sem os zeros do fim. Hosts com o mesmo endereço de sub-rede estão na mesma sub-rede.`,
      fonte: p1(5),
      cena: { modo: 'identificador' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, a máscara é usada para…',
      opcoes: ['Calcular o endereço IP da sub-rede', 'Esconder o IP do host', 'Trocar o endereço MAC', 'Ligar duas sub-redes diferentes'],
      correta: 0,
      explicacao: '> máscara ⇒ É usado para calcular o endereço IP da sub-rede.\n\nQuem liga sub-redes diferentes é a gateway (próxima fase).',
      fonte: p1(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual operação calcula o endereço da sub-rede?',
      opcoes: ['AND entre o IP do host e a máscara', 'OR entre o IP do host e a máscara', 'Soma do IP com a máscara', 'AND entre o IP e o endereço MAC'],
      correta: 0,
      explicacao: '> … é realizada uma operação **AND** entre os dois endereços IPs (IP do *host* e máscara).',
      fonte: p1(4),
    },
    digitar(
      'Calcule o endereço da sub-rede do host abaixo.',
      ['Endereço IP : 192.168.10.2', 'Máscara     : 255.255.255.0'],
      [{ rotulo: 'Endereço da sub-rede', resposta: '192.168.10.0', formato: 'ip' }],
      '- Octetos com 255 na máscara passam: 192.168.10\n- Octeto com 0 vira 0 → **192.168.10.0** (a mesma sub-rede do 192.168.10.1)',
      p1(5),
    ),
    {
      tipo: 'escolha',
      enunciado: 'Na figura do slide, quais hosts se comunicam diretamente?',
      opcoes: ['192.168.10.1 e 192.168.10.2', '192.168.10.2 e 172.16.10.1', '192.168.10.1 e 172.16.10.1', 'Os três, porque estão no mesmo cabo'],
      correta: 0,
      explicacao: '> Apenas *hosts* na mesma sub-rede se comunicam diretamente.\n\nOs dois 192.168.10.x estão na sub-rede 192.168.10.0; o 172.16.10.1 está na 172.16.0.0. Estar no mesmo cabo não basta.',
      fonte: p1(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o identificador da sub-rede do host 172.16.10.1 com máscara 255.255.0.0?',
      opcoes: ['172.16', '172.16.10', '172', '10.1'],
      correta: 0,
      explicacao: 'Sub-rede: 172.16.10.1 AND 255.255.0.0 = **172.16.0.0** → identificador **172.16**.',
      fonte: p1(5),
    },
    {
      tipo: 'escolha',
      enunciado: 'Dois hosts podem ter o mesmo endereço IP?',
      opcoes: ['Não', 'Sim, se estiverem em sub-redes diferentes', 'Sim, se tiverem máscaras diferentes', 'Sim, se um deles for a gateway'],
      correta: 0,
      explicacao: '> OBS: Não é possível ter dois *hosts* com o mesmo endereço IP.',
      fonte: p1(4),
    },
  ],
}

// ---------- 3.4 ----------

const fase34: Fase = {
  id: '3-4',
  titulo: 'Gateway',
  resumo: 'O elemento que liga sub-redes diferentes.',
  Cena: CenaSubredes,
  camera: [0, 9.5, 14.5],
  passos: [
    {
      titulo: 'Ligando sub-redes diferentes',
      texto: `
Se só *hosts* da mesma sub-rede conversam direto, como A fala com B?

> gateway ⇒ É o elemento de rede que possibilita a conexão de *hosts* entre sub-redes diferentes.

> Configurado para fazer o encaminhamento dos pacotes entre diferentes sub-redes.

Veja o dado: sai da sub-rede A, **passa pela gateway** e ela encaminha para a sub-rede B. Agora todo mundo sorri.`,
      fonte: p1(5),
      cena: { modo: 'gateway' },
    },
    {
      titulo: 'Um endereço em cada sub-rede',
      texto: `
Repare nos dois endereços da gateway no slide:

- **192.168.10.3** / 255.255.255.0 → sub-rede 192.168.10.0 (A)
- **172.16.10.2** / 255.255.0.0 → sub-rede 172.16.0.0 (B)

Ela tem uma configuração **em cada sub-rede** que liga. Por isso consegue conversar direto com os dois lados e passar os pacotes de um para o outro.`,
      fonte: p1(5),
      cena: { modo: 'gateway' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Quem faz o papel de gateway',
          texto: 'O slide desenha a gateway como um servidor. No dia a dia, esse papel costuma ser do roteador (o da sua casa é a gateway entre a sua rede e a Internet).',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'O que é a gateway?',
      opcoes: [
        'O elemento de rede que possibilita a conexão de hosts entre sub-redes diferentes',
        'O endereço usado para mandar mensagem a todos os hosts da sub-rede',
        'O primeiro endereço válido de toda sub-rede',
        'A máscara usada pelos hosts da sub-rede',
      ],
      correta: 0,
      explicacao: '> gateway ⇒ É o elemento de rede que possibilita a conexão de *hosts* entre sub-redes diferentes.',
      fonte: p1(5),
    },
    {
      tipo: 'escolha',
      enunciado: 'O host 192.168.10.1 (máscara 255.255.255.0) quer mandar um pacote para 172.16.10.1 (máscara 255.255.0.0). Como o pacote chega?',
      opcoes: ['Pela gateway, que encaminha entre as sub-redes', 'Direto, porque estão no mesmo cabo', 'Não chega de jeito nenhum', 'Pelo endereço de broadcast'],
      correta: 0,
      explicacao: 'Sub-redes diferentes (192.168.10.0 e 172.16.0.0) não conversam direto: a gateway é **configurada para fazer o encaminhamento dos pacotes entre diferentes sub-redes**.',
      fonte: p1(5),
    },
    digitar(
      'A interface da gateway na sub-rede B tem a configuração abaixo. Qual é o endereço da sub-rede dela?',
      ['Endereço IP : 172.16.10.2', 'Máscara     : 255.255.0.0'],
      [{ rotulo: 'Endereço da sub-rede', resposta: '172.16.0.0', formato: 'ip' }],
      '- 172.16 passam (255), 10.2 viram 0 → **172.16.0.0**: a mesma sub-rede do 172.16.10.1.',
      p1(5),
    ),
    {
      tipo: 'escolha',
      enunciado: 'Por que a gateway do slide tem dois endereços IP?',
      opcoes: ['Porque tem uma configuração em cada sub-rede que liga', 'Porque um é o IP e o outro é o MAC', 'Por segurança: um é reserva do outro', 'Porque toda gateway usa o endereço de broadcast'],
      correta: 0,
      explicacao: '192.168.10.3/255.255.255.0 está na sub-rede A; 172.16.10.2/255.255.0.0 está na B. Com um pé em cada sub-rede ela conversa direto com as duas.',
      fonte: p1(5),
    },
  ],
}

// ---------- 3.5 ----------

const fase35: Fase = {
  id: '3-5',
  titulo: 'Parte rede, parte host e broadcast',
  resumo: 'As duas partes do IP e o endereço de broadcast.',
  Cena: CenaBits,
  camera: [0, 10.5, 11],
  passos: [
    {
      titulo: 'Partes de um endereço IPv4',
      texto: `
> O endereço IP é dividido logicamente em duas partes:

> - **Parte de rede** ⇒ Identifica a sub-rede
> - **Parte do host** ⇒ Identifica o *host* dentro de uma sub-rede

Quem marca a divisa é a máscara: os bits **1** da máscara ficam em cima da **parte rede** (vermelho, como no slide) e os bits **0** em cima da **parte host** (azul).

Com 255.255.255.0: \`11000000·10101000·00001010\` é rede e \`00000001\` é host.`,
      fonte: p2(1),
      cena: { modo: 'partes', ip: '192.168.10.1', pref: 24 },
    },
    {
      titulo: 'A divisa no meio de um octeto',
      texto: `
A divisa nem sempre cai entre dois octetos. Com a máscara **255.255.240.0** (\`11111111.11111111.11110000.00000000\`), são 20 bits de rede: o 3º octeto fica **dividido**, 4 bits para cada lado.

É por isso que os exercícios do professor dão trabalho: o octeto dividido precisa ser convertido para binário.`,
      fonte: p2(1),
      cena: { modo: 'partes', ip: '192.168.100.4', pref: 20 },
    },
    {
      titulo: 'Endereço de broadcast',
      texto: `
> - É o endereço usado para enviar mensagens para todos os *hosts* na sub-rede.
> - É calculado atribuindo bits 1 à parte do *host*.

O exemplo do slide: 192.168.10.1 com máscara 255.255.255.0. A parte rede fica igual e a parte host vira toda **1**:

\`00000001\` → \`11111111\` = 255 → **192.168.10.255**`,
      fonte: p2(2),
      cena: { modo: 'broadcast', ip: '192.168.10.1', pref: 24 },
    },
    {
      titulo: 'Sub-rede × broadcast',
      texto: `
Compare os dois cálculos:

- **Endereço da sub-rede**: parte host toda **0** (é o que o AND faz)
- **Broadcast**: parte host toda **1**

Com a divisa no meio do 3º octeto (192.168.100.4 / 255.255.240.0):

- 3º octeto do IP: 100 = \`0110|0100\`
- host em 1: \`0110|1111\` = 111, e o 4º octeto vira 255
- Broadcast: **192.168.111.255**`,
      fonte: p2(2),
      cena: { modo: 'broadcast', ip: '192.168.100.4', pref: 20 },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'A parte de rede do endereço IP…',
      opcoes: ['Identifica a sub-rede', 'Identifica o host dentro da sub-rede', 'Identifica a placa de rede', 'Identifica o programa que recebe a mensagem'],
      correta: 0,
      explicacao: '> - **Parte de rede** ⇒ Identifica a sub-rede\n> - **Parte do host** ⇒ Identifica o *host* dentro de uma sub-rede',
      fonte: p2(1),
    },
    {
      tipo: 'classificar',
      enunciado: 'No IP 192.168.10.1 com máscara 255.255.255.0, cada octeto é de qual parte?',
      grupos: ['Parte rede', 'Parte host'],
      itens: [
        { texto: '192', grupo: 0 },
        { texto: '168', grupo: 0 },
        { texto: '10', grupo: 0 },
        { texto: '1', grupo: 1 },
      ],
      explicacao: 'Os três octetos com 255 na máscara são **rede** (192.168.10); o octeto com 0 é **host** (1). É a figura REDE | *Host* do slide.',
      fonte: p2(1),
    },
    {
      tipo: 'escolha',
      enunciado: 'Para que serve o endereço de broadcast?',
      opcoes: ['Enviar mensagens para todos os hosts na sub-rede', 'Identificar a sub-rede', 'Ligar sub-redes diferentes', 'Ser o primeiro endereço de um host'],
      correta: 0,
      explicacao: '> É o endereço usado para enviar mensagens para todos os *hosts* na sub-rede.',
      fonte: p2(2),
    },
    {
      tipo: 'escolha',
      enunciado: 'Como se calcula o endereço de broadcast?',
      opcoes: ['Atribuindo bits 1 à parte do host', 'Atribuindo bits 0 à parte do host', 'Atribuindo bits 1 à parte de rede', 'Somando 1 ao endereço da sub-rede'],
      correta: 0,
      explicacao: '> É calculado atribuindo bits 1 à parte do *host*.\n\nBits 0 na parte host dão o endereço da **sub-rede**; somar 1 à sub-rede dá o **1º válido** (fase 3.7).',
      fonte: p2(2),
    },
    digitar(
      'Calcule o endereço de broadcast da sub-rede do host abaixo.',
      ['Endereço IP : 172.16.10.1', 'Máscara     : 255.255.0.0'],
      [{ rotulo: 'Broadcast', resposta: '172.16.255.255', formato: 'ip' }],
      explicarCorte('172.16.10.1', 16, { broadcast: true }),
      p2(2),
    ),
  ],
}

// ---------- 3.6 ----------

const fase36: Fase = {
  id: '3-6',
  titulo: "Notação /n e o método dos H's",
  resumo: "Máscara com barra e a receita de rede e broadcast.",
  Cena: CenaBits,
  camera: [0, 11, 10],
  passos: [
    {
      titulo: 'Notação simplificada usando / (barra)',
      texto: `
Em vez de escrever a máscara inteira, conta-se **quantos bits 1** ela tem:

> - 255.255.255.0 → 24 bits 1's → **/24**
> - 255.255.255.128 → 25 bits 1's → **/25**
> - 255.255.255.192 → **/26**

Então "192.168.10.1/24" quer dizer IP 192.168.10.1 com máscara 255.255.255.0.`,
      fonte: p2(3),
      cena: { modo: 'barra' },
    },
    {
      titulo: "O método dos H's",
      texto: `
O slide resolve "Calcule o endereço de rede e *broadcast* sabendo que há um *host* em endereço IPv4 **172.28.100.0/19**" assim:

1. Escreve a máscara /19 e o IP um embaixo do outro: \`255·255·111|00000·00000000\` e \`172·28·011|00100·00000000\`
2. Marca a divisa **Parte Rede | Parte Host**
3. Copia a parte rede do IP e troca cada bit da parte host por **H**: \`172·28·011HHHHH·HHHHHHHH\`
4. **End. Rede**: H's = 0 → \`011|00000\` = 96 → **172.28.96.0/19**
5. **End. Broadcast**: H's = 1 → \`011|11111\` = 127 → **172.28.127.255/19**

As linhas da cena aparecem nessa ordem. O octeto dividido fica com a faixa amarela.`,
      fonte: p2(4),
      cena: { modo: 'hs', ip: '172.28.100.0', pref: 19 },
    },
    {
      titulo: 'Idem para 34.72.250.42/27',
      texto: `
Agora o corte cai no **4º octeto** (27 = 24 + 3):

- IP: 42 = \`001|01010\`
- H's: \`001HHHHH\`
- Rede (H=0): \`001|00000\` = 32 → **34.72.250.32/27**
- Broadcast (H=1): \`001|11111\` = 63 → **34.72.250.63/27**`,
      fonte: p2(4),
      cena: { modo: 'hs', ip: '34.72.250.42', pref: 27 },
    },
    {
      titulo: 'Idem para 10.100.230.201/29',
      texto: `
/29 → 5 bits de rede e 3 de host no 4º octeto:

- IP: 201 = \`11001|001\`
- H's: \`11001HHH\`
- Rede (H=0): \`11001|000\` = 200 → **10.100.230.200/29**
- Broadcast (H=1): \`11001|111\` = 207 → **10.100.230.207/29**`,
      fonte: p3(1),
      cena: { modo: 'hs', ip: '10.100.230.201', pref: 29 },
    },
    {
      titulo: 'Quando o corte cai entre octetos',
      texto: `
O exercício **G** do slide: IP **130.14.10.1/16**. Com /16 a divisa cai certinho depois do 2º octeto, então nem precisa de binário:

- parte rede: 130.14 (copia)
- Rede: host todo 0 → **130.14.0.0**
- Broadcast: host todo 1 → **130.14.255.255**`,
      fonte: p2(3),
      cena: { modo: 'hs', ip: '130.14.10.1', pref: 16 },
    },
  ],
  desafio: [
    digitar('Escreva esta máscara na notação com barra.', ['Máscara : 255.255.255.128'], [{ rotulo: 'Notação com barra', resposta: '/25', formato: 'mascara' }], '> 255.255.255.128 → 25 bits 1\'s → **/25**', p2(3)),
    digitar('Escreva a máscara /26 em decimal.', ['/26'], [{ rotulo: 'Máscara em decimal', resposta: '255.255.255.192', formato: 'ip' }], '- 26 = 24 + 2 → três octetos 255 e o 4º com 2 bits 1: `11000000` = 192\n- **255.255.255.192**', p2(3)),
    digitar(
      'Calcule o IP da sub-rede e o do broadcast.',
      ['IP 192.168.1.77/26'],
      [
        { rotulo: 'IP da sub-rede', resposta: '192.168.1.64/26', formato: 'ip' },
        { rotulo: 'Broadcast', resposta: '192.168.1.127/26', formato: 'ip' },
      ],
      explicarCorte('192.168.1.77', 26),
      p2(4),
    ),
    digitar(
      'Calcule o IP da sub-rede e o do broadcast.',
      ['IP 150.10.201.9/22'],
      [
        { rotulo: 'IP da sub-rede', resposta: '150.10.200.0/22', formato: 'ip' },
        { rotulo: 'Broadcast', resposta: '150.10.203.255/22', formato: 'ip' },
      ],
      explicarCorte('150.10.201.9', 22),
      p2(4),
    ),
    {
      tipo: 'escolha',
      enunciado: "No método dos H's, o endereço de rede é obtido fazendo…",
      opcoes: ["H's = 0", "H's = 1", 'Somando 1 aos H\'s', "Trocando os H's pela máscara"],
      correta: 0,
      explicacao: "Slide: **End. Rede → H's = 0** e **End. Broadcast → H's = 1**.",
      fonte: p2(4),
    },
  ],
}

// ---------- 3.7 ----------

const fase37: Fase = {
  id: '3-7',
  titulo: 'Endereços válidos e quantidade de hosts',
  resumo: '1º e último válidos (+1 e −1) e a fórmula 2ⁿ − 2.',
  Cena: CenaBits,
  camera: [0, 11, 11],
  passos: [
    {
      titulo: 'Endereços válidos',
      texto: `
> - São os endereços usados pelos *hosts* em uma mesma sub-rede.
> - O 1º endereço válido é o endereço seguinte ao IP da sub-rede (basta somar 1),
> - O último endereço válido é o endereço anterior ao IP de *broadcast* (basta subtrair 1).

O exemplo do slide, sub-rede **10.100.230.200/29**:

- 1º End. IP (sub-rede): 10.100.230.200
- **+1** → 10.100.230.201 ← 1º IP válido para *host*
- **−1** → 10.100.230.206 ← Último IP válido
- *Broadcast*: 10.100.230.207`,
      fonte: p3(1),
      cena: { modo: 'validos', ip: '10.100.230.201', pref: 29 },
    },
    {
      titulo: 'Quantidade de IPs válidos',
      texto: `
> - É equivalente a quantidade de *hosts* na sub-rede
> - O cálculo é feito usando a parte do *host* na máscara de rede
> - Fórmula : 2ⁿ - 2

**n** é o número de bits da parte host (os zeros da máscara). O exemplo do slide, sub-rede **200.220.50.96/27**:

- /27 → \`255·255·255·111|00000\` → n = 5
- QTDE IPs = 2⁵ = **32 IPs**
- 2⁵ − 2 = **30 IPs válidos**`,
      fonte: p3(3),
      cena: { modo: 'quantidade', ip: '200.220.50.96', pref: 27 },
    },
    {
      titulo: 'Por que menos 2?',
      texto: `
Dos 32 endereços da sub-rede 200.220.50.96/27, dois já têm dono:

- o **1º** (200.220.50.96) é o endereço **da sub-rede**
- o **último** (200.220.50.127) é o de **broadcast**

Sobram do .97 ao .126 para os *hosts*: 30 endereços. É o mesmo +1 e −1 do passo anterior.`,
      fonte: p3(3),
      cena: { modo: 'validos', ip: '200.220.50.96', pref: 27 },
    },
    {
      titulo: 'Cuidado com o exercício (6)',
      texto: `
No slide, o exercício **(6)** calcula os hosts de **172.16.10.0/17**:

> 2¹⁵-2 ⇒ 2⁵x2¹⁰-2 ⇒ 32x1024-2 ⇒ 32768-2 = 32764 Hosts

O raciocínio está certo até o fim, mas a última subtração não: **32768 − 2 = 32766**.`,
      fonte: p3(3),
      cena: { modo: 'quantidade', ip: '172.16.10.0', pref: 17 },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Erro de conta no slide',
          noSlide: '32768 − 2 = 32764 Hosts',
          naPratica: '32768 − 2 = 32766 hosts. Aqui no RedeLab o gabarito usa 32766. Se cair na prova, faça a conta: não copie o 32764.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual é a fórmula da quantidade de hosts (IPs válidos) de uma sub-rede?',
      opcoes: ['2ⁿ − 2, com n = bits da parte host', '2ⁿ, com n = bits da parte rede', '2ⁿ − 2, com n = bits da parte rede', '256 − n'],
      correta: 0,
      explicacao: '> Fórmula : 2ⁿ - 2\n\n> O cálculo é feito usando a parte do *host* na máscara de rede',
      fonte: p3(3),
    },
    {
      tipo: 'escolha',
      enunciado: 'Por que se subtrai 2 na fórmula?',
      opcoes: ['Os endereços da sub-rede e de broadcast não podem ser usados por hosts', 'Por causa da gateway e do servidor', 'Porque o primeiro octeto não conta', 'Para sobrar espaço para a máscara'],
      correta: 0,
      explicacao: 'O 1º endereço é o **da sub-rede** e o último é o de **broadcast**. Os válidos vão de sub-rede + 1 até broadcast − 1.',
      fonte: p3(1),
    },
    digitar(
      'Calcule o 1º e o último endereços válidos da sub-rede em que está o IP abaixo.',
      ['IP 192.168.5.130/26'],
      [
        { rotulo: '1º válido', resposta: '192.168.5.129/26', formato: 'ip' },
        { rotulo: 'Último válido', resposta: '192.168.5.190/26', formato: 'ip' },
      ],
      explicarValidos('192.168.5.130', 26),
      p3(2),
    ),
    digitar('Calcule a quantidade de possíveis hosts da sub-rede abaixo.', ['192.168.5.0/28'], [{ rotulo: 'Quantidade de hosts', resposta: '14', formato: 'numero' }], explicarQuantidade(28), p3(3)),
    digitar('Calcule a quantidade de possíveis hosts da sub-rede abaixo.', ['10.1.4.0/22'], [{ rotulo: 'Quantidade de hosts', resposta: '1022', formato: 'numero' }], explicarQuantidade(22), p3(3)),
  ],
}

// ---------- 3.8 ----------

/** Exercícios A–C (sub-rede) e D–F (broadcast): mesma configuração, pergunta diferente. */
const CONFIGS_AF = [
  { ip: '192.168.100.4', masc: '255.255.240.0' },
  { ip: '200.220.150.40', masc: '255.255.224.0' },
  { ip: '172.16.220.14', masc: '255.255.255.248' },
]

const exerciciosRede = CONFIGS_AF.map(({ ip, masc }, i) =>
  digitar(
    `Exercício ${'ABC'[i]}: calcule o endereço que identifica a sub-rede na configuração do host abaixo.`,
    [`Endereço IP : ${ip}`, `Máscara     : ${masc}`],
    [{ rotulo: 'Endereço da sub-rede', resposta: rede(ip, prefixoDe(masc)), formato: 'ip' }],
    explicarCorte(ip, prefixoDe(masc), { rede: true }),
    p2(1),
  ),
)

const exerciciosBroadcast = CONFIGS_AF.map(({ ip, masc }, i) =>
  digitar(
    `Exercício ${'DEF'[i]}: calcule o endereço que identifica o broadcast na sub-rede que possui o IP abaixo.`,
    [`Endereço IP : ${ip}`, `Máscara     : ${masc}`],
    [{ rotulo: 'Broadcast', resposta: broadcast(ip, prefixoDe(masc)), formato: 'ip' }],
    explicarCorte(ip, prefixoDe(masc), { broadcast: true }),
    p2(2),
  ),
)

const exerciciosGH = (
  [
    ['G', '130.14.10.1', 16],
    ['H', '220.140.100.1', 21],
  ] as const
).map(([letra, ip, pref]) =>
  digitar(
    `Exercício ${letra}: calcule o IP da sub-rede e o do broadcast.`,
    [`IP ${ip}/${pref}`],
    [
      { rotulo: 'IP da sub-rede', resposta: rede(ip, pref), formato: 'ip' },
      { rotulo: 'Broadcast', resposta: broadcast(ip, pref), formato: 'ip' },
    ],
    [`- /${pref} = \`${mascara(pref)}\``, ...explicarCorte(ip, pref).slice(1)],
    p2(3),
  ),
)

const exerciciosValidos = (
  [
    [4, '200.220.50.100', 27],
    [5, '190.180.50.200', 25],
  ] as const
).map(([n, ip, pref]) =>
  digitar(
    `Exercício (${n}): calcule o 1º e o último endereços válidos da sub-rede em que está o IP abaixo.`,
    [`IP ${ip}/${pref}`],
    [
      { rotulo: '1º válido', resposta: `${primeiro(ip, pref)}/${pref}`, formato: 'ip' },
      { rotulo: 'Último válido', resposta: `${ultimo(ip, pref)}/${pref}`, formato: 'ip' },
    ],
    explicarValidos(ip, pref),
    p3(2),
  ),
)

const exerciciosQuantidade = ([17, 24, 30] as const).map((pref, i) =>
  digitar(
    `Exercício (${6 + i}): calcule a quantidade de possíveis hosts que podem pertencer à sub-rede abaixo.`,
    [`IP 172.16.10.0/${pref}`],
    [{ rotulo: 'Quantidade de hosts', resposta: String(hosts(pref)), formato: 'numero' }],
    pref === 17
      ? [...explicarQuantidade(pref), '', '⚠ O slide escreve **32764 Hosts**, mas 32768 − 2 = **32766**: erro de conta no slide.']
      : explicarQuantidade(pref),
    p3(3),
  ),
)

const fase38: Fase = {
  id: '3-8',
  titulo: 'Exercícios do professor',
  resumo: 'A receita completa e os exercícios A–H e (4)–(8) dos slides.',
  Cena: CenaBits,
  camera: [0, 11, 10],
  passos: [
    {
      titulo: 'A receita',
      texto: `
Tudo o que a trilha mostrou, na ordem em que se faz a conta:

1. **Máscara → /n**: conte os bits 1 (ou use a lista de octetos de máscara da fase 3.2).
2. **Ache o octeto do corte**: os octetos antes dele copiam do IP; os depois são todo host.
3. **Octeto do corte em binário**, com H's no lugar dos bits de host.
4. **Rede**: H's = 0. **Broadcast**: H's = 1.
5. **Válidos**: rede + 1 e broadcast − 1.
6. **Quantidade de hosts**: 2ⁿ − 2, com n = 32 − /n.

A cena mostra o exercício **H** (220.140.100.1/21) feito assim: corte no 3º octeto, 100 = \`01100|100\`, rede \`01100|000\` = 96 e broadcast \`01100|111\` = 103.`,
      fonte: p2(4),
      cena: { modo: 'hs', ip: '220.140.100.1', pref: 21 },
    },
    {
      titulo: 'Atalho: o tamanho do bloco',
      texto: `
Um atalho que dá o mesmo resultado sem escrever os bits:

- **bloco = 256 − octeto da máscara** onde o corte cai
- **rede** = maior múltiplo do bloco que não passa do octeto do IP
- **broadcast** = rede + bloco − 1

Exercício **A** (192.168.100.4 / 255.255.240.0): bloco = 256 − 240 = **16**. Múltiplos de 16: …, 80, **96**, 112. O 100 fica no bloco do 96 → sub-rede **192.168.96.0**, broadcast **192.168.111.255** (96 + 16 − 1 = 111).`,
      fonte: p2(1),
      cena: { modo: 'hs', ip: '192.168.100.4', pref: 20 },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Atalho fora do slide',
          texto: "O professor usa o método dos H's. O atalho do bloco é só para conferir mais rápido: na prova, mostre a conta do jeito do slide.",
        },
      ],
    },
    {
      titulo: 'Hora dos exercícios',
      texto: `
O desafio desta fase são **todos os exercícios dos slides**, com a resposta digitada:

- **A, B, C**: endereço da sub-rede (Aula 03 p2, p. 1)
- **D, E, F**: broadcast (p2, p. 2)
- **G, H**: sub-rede e broadcast com /n (p2, p. 3)
- **(4), (5)**: 1º e último válidos (p3, p. 2)
- **(6), (7), (8)**: quantidade de hosts (p3, p. 3)

Pode escrever o IP com ponto, vírgula ou "·", e o "/n" no fim é opcional.`,
      fonte: p3(3),
      cena: { modo: 'validos', ip: '200.220.50.100', pref: 27 },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'O gabarito do (6)',
          noSlide: '172.16.10.0/17 → 32764 Hosts',
          naPratica: '2¹⁵ − 2 = 32768 − 2 = 32766 hosts. O gabarito daqui usa 32766.',
        },
      ],
    },
  ],
  desafio: [...exerciciosRede, ...exerciciosBroadcast, ...exerciciosGH, ...exerciciosValidos, ...exerciciosQuantidade],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'Qual é o exemplo de endereço de aplicação dado no slide?',
    opcoes: ['Número das portas', 'Endereço MAC', 'Endereço IP', 'Máscara de rede'],
    correta: 0,
    explicacao: '> 3º Endereços de Aplicações (ex.: Número das Portas)',
    fonte: p1(2),
  },
  {
    tipo: 'classificar',
    enunciado: 'Na sub-rede 200.220.50.96/27, cada endereço é o quê?',
    grupos: ['Sub-rede', 'Válido (host)', 'Broadcast'],
    itens: [
      { texto: '200.220.50.96', grupo: 0 },
      { texto: '200.220.50.97', grupo: 1 },
      { texto: '200.220.50.110', grupo: 1 },
      { texto: '200.220.50.126', grupo: 1 },
      { texto: '200.220.50.127', grupo: 2 },
    ],
    explicacao: '/27 → blocos de 32: sub-rede **.96**, válidos de **.97** a **.126**, broadcast **.127**.',
    fonte: p3(2),
  },
  {
    tipo: 'escolha',
    enunciado: 'Um host 192.168.10.1/24 manda uma mensagem para 192.168.10.255. Quem recebe?',
    opcoes: ['Todos os hosts da sub-rede 192.168.10.0', 'Só a gateway', 'Só o host 192.168.10.255', 'Todos os hosts da Internet'],
    correta: 0,
    explicacao: '192.168.10.255 é o **broadcast** da sub-rede 192.168.10.0/24: o endereço usado para enviar mensagens para **todos os hosts na sub-rede**.',
    fonte: p2(2),
  },
  digitar(
    'Calcule o IP da sub-rede e o do broadcast.',
    ['IP 172.28.100.0/19'],
    [
      { rotulo: 'IP da sub-rede', resposta: '172.28.96.0/19', formato: 'ip' },
      { rotulo: 'Broadcast', resposta: '172.28.127.255/19', formato: 'ip' },
    ],
    explicarCorte('172.28.100.0', 19),
    p2(4),
  ),
]

export const trilha3: Trilha = {
  id: 't3',
  numero: 3,
  titulo: 'Endereçamento IPv4',
  aula: 'Aulas 03 · Endereçamento',
  cor: '#cf4b47',
  disponivel: true,
  fases: [fase31, fase32, fase33, fase34, fase35, fase36, fase37, fase38],
  chefaoExtras: extras,
  gerador: gerarQuestao,
}
