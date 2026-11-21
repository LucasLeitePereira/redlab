import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaBluetooth } from './cenas/Bluetooth'
import { CenaCoaxial } from './cenas/Coaxial'
import { CenaCobre } from './cenas/Cobre'
import { CenaConectores } from './cenas/Conectores'
import { CenaEspectro } from './cenas/Espectro'
import { CenaFibra } from './cenas/Fibra'
import { CenaIsm } from './cenas/Ism'
import { CenaParTrancado } from './cenas/ParTrancado'
import { CenaWimax } from './cenas/Wimax'
import { CenaWlan } from './cenas/Wlan'

// Trilha 9 — Meio Físico de Transmissão. PDF: REDES-08r_Meio-Fisico.pdf (31 páginas, 2 slides
// por página; p. 4, 8, 11, 18, 23, 25 e 28 têm slides de abertura de seção).
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const a8 = (pagina: number | string): Fonte => ({ aula: 'Aula 08', pagina })

const CAMERA: [number, number, number] = [0, 4.5, 11]
const ALVO: [number, number, number] = [0, 1.8, 0]

// ---------- 9.1 ----------

const fase91: Fase = {
  id: '9-1',
  titulo: 'Corrente, calor e magnetismo',
  resumo: 'O que é o meio físico e os dois efeitos da corrente elétrica no cobre: atenuação e ruído.',
  Cena: CenaCobre,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'O meio físico',
      texto: `
> Os meios físicos para transmissão de dados são as características mecânicas, elétricas e funcionais das conexões, que se destinam a transmitir os sinais entre os nós em uma rede computadores.

Na figura, os computadores ligados por cabo usam **meio guiado**; os notebooks ligados pelo ar usam **meio não guiado**.`,
      fonte: a8(1),
      cena: { modo: 'intro' },
    },
    {
      titulo: 'Corrente elétrica',
      texto: `
> A informação enviada em um cabo de cobre é transmitida através de corrente elétrica.

A corrente é o movimento dos **elétrons** pelo fio. Essa passagem de corrente causa dois efeitos: **calor** e **campo magnético**.`,
      fonte: a8(2),
      cena: { modo: 'corrente' },
    },
    {
      titulo: 'Calor → atenuação',
      texto: `
> **INDUÇÃO TÉRMICA** → Efeito causado com a passagem da corrente elétrica.

> **CONSEQUÊNCIA** → **Atenuação Elétrica**: Perda da intensidade do sinal elétrico.

Na figura, o sinal entra com **5 Watts** e chega com **3 Watts**: parte da energia virou calor no caminho.`,
      fonte: a8('2–3'),
      cena: { modo: 'calor' },
    },
    {
      titulo: 'Magnetismo → ruído',
      texto: `
> **CAMPO MAGNÉTICO** → Outro efeito causado com a passagem da corrente elétrica.

> **CONSEQUÊNCIA** → **RUÍDOS** causados pela **Indução Magnética**: Sinal elétrico gerado em "fios" próximos.

O campo de um fio "empurra" os elétrons do fio vizinho (em azul): aparece um sinal que ninguém mandou, o **ruído**.`,
      fonte: a8('3–4'),
      cena: { modo: 'inducao' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada efeito da corrente elétrica à sua consequência.',
      grupos: ['Atenuação elétrica', 'Ruído'],
      itens: [
        { texto: 'Indução térmica (calor)', grupo: 0 },
        { texto: 'Perda da intensidade do sinal', grupo: 0 },
        { texto: 'Campo magnético', grupo: 1 },
        { texto: 'Sinal gerado em fios próximos', grupo: 1 },
      ],
      explicacao: 'Calor (indução térmica) → **atenuação elétrica**: perda da intensidade do sinal. Campo magnético (indução magnética) → **ruídos**: sinal elétrico gerado em fios próximos.',
      fonte: a8('2–4'),
      cena: { modo: 'calor' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura, o sinal sai com 5 W e chega com 3 W. Que fenômeno é esse?',
      opcoes: ['Atenuação elétrica', 'Ruído', 'Cancelamento', 'Refração'],
      correta: 0,
      explicacao: '**Atenuação elétrica**: perda da intensidade do sinal elétrico, consequência do calor (indução térmica).',
      fonte: a8(3),
      cena: { modo: 'calor' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Como a informação é transmitida em um cabo de cobre?',
      opcoes: ['Por corrente elétrica', 'Por feixes de luz', 'Por ondas de rádio', 'Por calor'],
      correta: 0,
      explicacao: '“A informação enviada em um cabo de cobre é transmitida através de **corrente elétrica**.”',
      fonte: a8(2),
      cena: { modo: 'corrente' },
    },
  ],
}

// ---------- 9.2 ----------

const fase92: Fase = {
  id: '9-2',
  titulo: 'Cabo coaxial',
  resumo: 'As camadas do coaxial, o padrão 10BASE2 em barra, as desvantagens e a nomenclatura.',
  Cena: CenaCoaxial,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Constituição física',
      texto: `
> Foi um dos primeiros tipos de cabos utilizados como meio de transmissão nas redes de computadores, sendo que hoje em dia são mais usados na transmissão de sinais de TV.

Clique em cada camada do cabo.`,
      fonte: a8(5),
      cena: { modo: 'camadas' },
      explorar: {
        instrucao: 'Clique nas 4 camadas do coaxial.',
        alvos: {
          interno: { titulo: 'Condutor Interno', texto: 'Núcleo sólido (fio metálico). É por ele que passa o sinal.' },
          dieletrico: { titulo: 'Dielétrico', texto: 'Separador isolante entre os dois condutores.' },
          externo: { titulo: 'Condutor Externo', texto: 'Em forma de malha. Também é usado no aterramento.' },
          involucro: { titulo: 'Invólucro Externo', texto: 'Capa isolante que protege o cabo.' },
        },
      },
    },
    {
      titulo: 'Coaxial fino: 10BASE2',
      texto: `
> **Padrão 10BASE2**
> - Tamanho máximo do segmento: 185 metros;
> - Pouco maleável e um pouco difícil de instalar.
> - Normalmente implementa a topologia em barra.

Cada placa de rede se liga ao cabo por um **conector T** com **conector BNC**, e as duas pontas do barramento levam um **terminador**.`,
      fonte: a8(6),
      cena: { modo: 'barramento' },
    },
    {
      titulo: 'Desvantagens',
      texto: `
> - Necessita manter a impedância constante através dos resistores;
> - A instalação não é muito fácil, quebra e apresenta "mau contato" com muita facilidade;
> - O aterramento é feito usando a malha metálica.

Como todos dividem o mesmo cabo, uma **interrupção** em qualquer ponto derruba a rede inteira.`,
      fonte: a8(7),
      cena: { modo: 'barramento', interrompido: true },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Os "resistores"',
          texto: 'Os resistores do slide são os **terminadores** das pontas do barramento (50 Ω no 10BASE2). Sem eles, o sinal bate na ponta do cabo e volta, atrapalhando a transmissão.',
        },
      ],
    },
    {
      titulo: 'Nomenclatura',
      texto: `
> A nomenclatura utilizada indica três características do meio de transmissão.

> - **10** → Largura de banda: 10Mbps
> - **Base** → Banda básica: Sinal não é codificado
> - **2** → Tipo de cabo: Coaxial fino (182 metros)
> - **10Base5** → Tipo de cabo: Coaxial Grosso (500 metros)`,
      fonte: a8(7),
      cena: { modo: 'nomenclatura' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: '185 ou 182 metros?',
          noSlide: 'O 10BASE2 aparece com **185 metros** na p. 6 e com **182 metros** na nomenclatura da p. 7.',
          naPratica: 'O padrão define **185 m** por segmento (o "2" é o arredondamento de 185 m para 200 m). Na prova, prefira 185 m.',
        },
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Banda básica',
          noSlide: '"Banda básica: Sinal não é codificado".',
          naPratica: 'Banda básica (*baseband*) quer dizer que o sinal digital vai direto no cabo, **sem modulação** em uma portadora e ocupando o cabo todo. O sinal ainda é **codificado** (Manchester, no Ethernet).',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada camada do coaxial à sua descrição.',
      grupos: ['Condutor interno', 'Dielétrico', 'Condutor externo', 'Invólucro externo'],
      itens: [
        { texto: 'Núcleo sólido (fio metálico)', grupo: 0 },
        { texto: 'Separador isolante', grupo: 1 },
        { texto: 'Em forma de malha', grupo: 2 },
        { texto: 'Capa isolante', grupo: 3 },
      ],
      explicacao: 'Condutor interno: núcleo sólido · Dielétrico: separador isolante · Condutor externo: malha · Invólucro externo: capa isolante.',
      fonte: a8(5),
      cena: { modo: 'camadas', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre o padrão 10BASE2, avalie as afirmativas:',
      dados: ['I. Usa cabo coaxial fino e topologia em barra.', 'II. Se o cabo for interrompido, a rede inteira para.', 'III. O "10" indica o tamanho máximo do segmento, em metros.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: o "10" é a taxa, **10 Mbps**.',
      fonte: a8('6–7'),
      cena: { modo: 'barramento', interrompido: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Em 10Base5, o que o "5" indica?',
      opcoes: ['Coaxial grosso (500 metros)', 'Largura de banda de 5 Mbps', 'Banda básica', '5 computadores por segmento'],
      correta: 0,
      explicacao: 'O último número indica o **tipo de cabo**: 10Base2 = coaxial fino; 10Base5 = **coaxial grosso (500 metros)**. O "10" é a largura de banda (10 Mbps) e "Base" é banda básica.',
      fonte: a8(7),
      cena: { modo: 'nomenclatura', semCabo: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Que topologia o 10BASE2 normalmente implementa?',
      opcoes: ['Barra', 'Estrela', 'Anel', 'Malha'],
      correta: 0,
      explicacao: '“Normalmente implementa a topologia em **barra**.”',
      fonte: a8(6),
      cena: { modo: 'barramento', interrompido: true },
    },
  ],
}

// ---------- 9.3 ----------

const fase93: Fase = {
  id: '9-3',
  titulo: 'Par trançado',
  resumo: 'UTP e STP, a técnica de cancelamento, as categorias e o padrão 100BASE-T em estrela.',
  Cena: CenaParTrancado,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'UTP e STP',
      texto: `
> O cabo par trançado surgiu com a necessidade de haver cabos mais flexíveis e com maior taxa de transmissão.

> Usa o mesmo princípio dos cabos usados nos telefones: Consiste de fios de cobre isolados trançados entre si em forma helicoidal.

> É o tipo de cabo mais comumente usado em redes de computadores. Existem dois tipos:`,
      fonte: a8('8–9'),
      cena: { modo: 'tipos' },
      explorar: {
        instrucao: 'Clique nos dois cabos.',
        alvos: {
          utp: { titulo: 'UTP', texto: 'Sem Blindagem: UTP (*Unshield Twisted Pair*). Só a capa protege os pares.' },
          stp: { titulo: 'STP', texto: 'Com Blindagem: STP (*Shielded Twisted Pair*). Uma blindagem metálica envolve os pares.' },
        },
      },
    },
    {
      titulo: 'Cancelamento',
      texto: `
> Técnica usada no cabo UTP para reduzir o ruído.

> O sinal é repetido em dois pares, sendo que no segundo a informação tem polaridade invertida.

> Com isso, o ruído gerado pelo campo magnético é anulado pelo outro par.

O ruído atinge os dois pares do mesmo jeito; como o sinal de um é o inverso do outro, o ruído se cancela e o sinal sobra.`,
      fonte: a8(9),
      cena: { modo: 'cancelamento' },
    },
    {
      titulo: 'Categorias',
      texto: `
> Devido aos diversos usos do cabo par trançado, a norma EIA/TIA 568-A definiu as seguintes categorias:

O CAT5e e o CAT6 estão destacados no slide. A tabela completa do anexo (até o CAT8) está na fase 8.8.`,
      fonte: a8(10),
      cena: { modo: 'categorias' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'CAT5e',
          noSlide: 'CAT5e: até 100 MHz, **100 Mbps** (Fast Ethernet).',
          naPratica: 'O CAT5e foi feito para o **Gigabit Ethernet** (1 Gbps, 1000BASE-T). Os 100 Mbps são do CAT5. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: 'Padrão 100BASE-T',
      texto: `
> - No máximo 100 metros por segmento
> - Maleável e fácil de ser instalado
> - Implementa a topologia em estrela.

Cada computador tem o seu próprio cabo até o switch: se um cabo rompe, **só aquele computador** fica sem rede.`,
      fonte: a8(10),
      cena: { modo: 'estrela', rompido: true },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é do UTP ou do STP?',
      grupos: ['UTP', 'STP'],
      itens: [
        { texto: 'Sem blindagem', grupo: 0 },
        { texto: 'Unshield Twisted Pair', grupo: 0 },
        { texto: 'Com blindagem', grupo: 1 },
        { texto: 'Shielded Twisted Pair', grupo: 1 },
      ],
      explicacao: 'UTP (*Unshield Twisted Pair*): sem blindagem. STP (*Shielded Twisted Pair*): com blindagem.',
      fonte: a8(9),
      cena: { modo: 'tipos' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No cancelamento, o que acontece com o sinal no segundo par?',
      opcoes: ['Tem polaridade invertida', 'É atrasado', 'É amplificado', 'Não é transmitido'],
      correta: 0,
      explicacao: '“O sinal é repetido em dois pares, sendo que no segundo a informação tem **polaridade invertida**.” Assim o ruído é anulado pelo outro par.',
      fonte: a8(9),
      cena: { modo: 'cancelamento' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada categoria à taxa do slide.',
      grupos: ['10 Mbps', '20 Mbps', '1 Gbps', '10 Gbps'],
      itens: [
        { texto: 'CAT3', grupo: 0 },
        { texto: 'CAT4', grupo: 1 },
        { texto: 'CAT6', grupo: 2 },
        { texto: 'CAT7', grupo: 3 },
      ],
      explicacao: 'CAT3: 10 Mbps (Ethernet) · CAT4: 20 Mbps (Token Ring) · CAT6: 1 Gbps (Gigabit Ethernet) · CAT7: 10 Gbps.',
      fonte: a8(10),
      cena: { modo: 'categorias', semTaxa: true },
    },
    {
      tipo: 'digitar',
      enunciado: 'No padrão 100BASE-T, qual é o máximo de metros por segmento?',
      campos: [{ rotulo: 'metros', resposta: '100', formato: 'numero' }],
      explicacao: '100BASE-T: **no máximo 100 metros por segmento**, topologia em estrela.',
      fonte: a8(10),
      cena: { modo: 'estrela' },
    },
  ],
}

// ---------- 9.4 ----------

const fase94: Fase = {
  id: '9-4',
  titulo: 'Fibra ótica',
  resumo: 'As partes da fibra, como a luz leva os bits, as vantagens e a diferença entre multímodo e monomodo.',
  Cena: CenaFibra,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'O que é a fibra',
      texto: `
> A fibra óptica é uma pequena haste de vidro, revestida por materiais protetores, que utiliza-se da refração interna, para poder transmitir feixes de luz ao longo da fibra por grandes distâncias.

> Um cabo de fibra óptica é composto por diferentes materiais:`,
      fonte: a8('11–12'),
      cena: { modo: 'camadas' },
      explorar: {
        instrucao: 'Clique nas 4 partes do cabo.',
        alvos: {
          nucleo: { titulo: 'Núcleo', texto: 'Geralmente produzido de vidro, possui em média 125 mícrons, por onde passa a luz emitida e refletida por toda a fibra.' },
          casca: { titulo: 'Casca', texto: 'Geralmente de plástico, serve para revestir a fibra.' },
          capa: { titulo: 'Capa', texto: 'Feita de plástico, tem o objetivo de proteger tanto a casca como a fibra.' },
          revestimento: { titulo: 'Revestimento externo', texto: 'Usado quando o cabo possui várias fibras. É uma camada de plástico externa que protege os cabos internos.' },
        },
      },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Refração ou reflexão?',
          noSlide: 'A fibra "utiliza-se da **refração** interna".',
          naPratica: 'A luz fica presa no núcleo por **reflexão interna total**: ela bate na divisa com a casca e volta. A casca tem índice de refração menor que o núcleo, e é essa diferença que causa a reflexão.',
        },
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Núcleo de 125 mícrons',
          noSlide: 'Núcleo com **125 mícrons** em média; casca **geralmente de plástico**.',
          naPratica: '125 µm é o diâmetro da **casca**. O núcleo tem cerca de **9 µm** (monomodo) ou **50/62,5 µm** (multímodo), e a casca costuma ser de **vidro**.',
        },
      ],
    },
    {
      titulo: 'Luz = 1, sem luz = 0',
      texto: `
> Os sinais são transmitidos usando fótons de luz. Por isso é necessário a conversão do sinal elétrico em luminoso, antes da transmissão através da fibra.

> - Luz transmitida indica o valor "1".
> - Luz não transmitida indica o valor "0".

Sinal elétrico → **fonte de luz** → fibra (sinal óptico) → **receptor de luz** → sinal elétrico.`,
      fonte: a8(12),
      cena: { modo: 'luz' },
    },
    {
      titulo: 'Vantagens',
      texto: `
> - A fibra é bastante fina, por isso é possível incluir uma grande quantidade de fios em um cabo.
> - Por usar refração a fibra **é imune a interferências**.
> - **A atenuação é muito menor** do que a do sinal elétrico, por isso o sinal transmitido nas fibras tem um longo alcance
> - A quantidade de transmissão de dados possível em uma fibra é muito maior do que a capacidade alcançada através de cabos metálicos.`,
      fonte: a8(13),
      cena: { modo: 'luz' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Por que é imune',
          texto: 'A fibra leva **luz**, não corrente elétrica, e é feita de vidro, que não conduz eletricidade. Por isso não sofre o ruído de indução magnética que o cobre sofre.',
        },
      ],
    },
    {
      titulo: 'Multímodo e monomodo',
      texto: `
> **FIBRAS MULTÍMODO** (MMF, *Multiple Mode Fiber*): O núcleo da fibra tem uma espessura maior, isso faz o sinal luminoso ricochetear dentro da fibra. Por isso, tem maior perda e atenuação.

> **FIBRAS MONOMODO** (SMF, *Single Mode Fiber*): O núcleo da fibra é menor, isso faz com que a luz trafegue mantendo uma constância do sinal, tendo desta forma um número menor de reflexões dentro da fibra, o que torna a mesma menos suscetível a perdas ou atenuação do sinal.`,
      fonte: a8('13–14'),
      cena: { modo: 'comparar' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é da fibra multímodo ou da monomodo?',
      grupos: ['Multímodo', 'Monomodo'],
      itens: [
        { texto: 'Núcleo mais espesso', grupo: 0 },
        { texto: 'A luz ricocheteia dentro da fibra', grupo: 0 },
        { texto: 'Maior perda e atenuação', grupo: 0 },
        { texto: 'Núcleo menor', grupo: 1 },
        { texto: 'Menos reflexões', grupo: 1 },
        { texto: 'SMF', grupo: 1 },
      ],
      explicacao: 'Multímodo (MMF): núcleo maior, a luz ricocheteia, maior perda e atenuação. Monomodo (SMF): núcleo menor, menos reflexões, menos perdas.',
      fonte: a8('13–14'),
      cena: { modo: 'comparar', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na fibra, que valor indica a luz transmitida?',
      opcoes: ['1', '0', 'Depende do núcleo', 'Nenhum: a luz só sincroniza'],
      correta: 0,
      explicacao: '“Luz transmitida indica o valor **1**. Luz não transmitida indica o valor **0**.”',
      fonte: a8(12),
      cena: { modo: 'luz' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual parte da fibra é usada quando o cabo possui várias fibras?',
      opcoes: ['Revestimento externo', 'Núcleo', 'Casca', 'Capa'],
      correta: 0,
      explicacao: '**Revestimento externo**: usado quando o cabo possui várias fibras; camada de plástico externa que protege os cabos internos.',
      fonte: a8(12),
      cena: { modo: 'camadas', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destas NÃO é vantagem da fibra no slide?',
      opcoes: ['Precisa de terminadores nas pontas', 'É imune a interferências', 'Atenuação muito menor', 'Muitos fios em um cabo'],
      correta: 0,
      explicacao: 'Vantagens do slide: fibra fina (muitos fios em um cabo), imune a interferências, atenuação muito menor e capacidade muito maior. Terminadores são do coaxial.',
      fonte: a8(13),
      cena: { modo: 'luz' },
    },
  ],
}

// ---------- 9.5 ----------

const fase95: Fase = {
  id: '9-5',
  titulo: 'Conectores e emendas',
  resumo: 'Os conectores ST, SC e LC e as duas formas de unir fibras: fusão e emenda mecânica.',
  Cena: CenaConectores,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Conectores para fibra ótica',
      texto: 'A fibra chega à placa de rede por conectores próprios. Clique em cada um.',
      fonte: a8('14–16'),
      cena: { modo: 'conectores' },
      explorar: {
        instrucao: 'Clique nos 3 conectores.',
        alvos: {
          st: { titulo: 'Conector ST', texto: 'ST (*Straight Tip*) foi bastante utilizado na conexão de fibras multímodo, é um dos padrões mais antigos no mercado.' },
          sc: { titulo: 'Conector SC', texto: 'Popular em redes gigabit, é eficiente e tem baixa perda de sinal.' },
          lc: { titulo: 'Conector LC', texto: 'Usados principalmente em fibras monomodo e em transceivers Gigabit Ethernet, além de possuir um tamanho miniaturizado.' },
        },
      },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Frase incompleta no slide',
          texto: 'O slide do SC termina com "Porém, tem um conector relativamente." Falta uma palavra; o mais provável é "relativamente **grande**", já que o LC é a versão miniaturizada.',
        },
      ],
    },
    {
      titulo: 'Fusão de fibra óptica',
      texto: `
> As fibras podem ser unidas através de dois métodos:

> **Fusão de fibra óptica**: É utilizada uma **máquina de fusão de fibra óptica**, onde ocorre um alinhamento das fibras (ficando frente-a-frente), aquecendo as extremidades da fibra e aplicando uma pressão para fazer a união.`,
      fonte: a8('16–17'),
      cena: { modo: 'fusao' },
    },
    {
      titulo: 'Emenda mecânica',
      texto: `
> **Fusão por emenda mecânica**: É uma emenda de aplicação manual, ou seja, as duas extremidades do fio são unidas e coladas com uma resina especial, permitindo a passagem da luz.`,
      fonte: a8(17),
      cena: { modo: 'mecanica' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: '"Fusão" por emenda mecânica',
          noSlide: 'O título é "Fusão por emenda mecânica".',
          naPratica: 'Na emenda mecânica **não há fusão**: as fibras só são alinhadas e presas, com resina ou gel. Ela é mais rápida e barata, mas perde mais luz que a fusão.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual método de emenda usa uma resina especial?',
      opcoes: ['Emenda mecânica', 'Fusão de fibra óptica', 'Conector ST', 'Cancelamento'],
      correta: 0,
      explicacao: 'Na **emenda mecânica** as duas extremidades são unidas e coladas com uma resina especial. A fusão usa a máquina de fusão, que aquece as pontas.',
      fonte: a8(17),
      cena: { modo: 'mecanica' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre a fibra ótica, avalie as afirmativas:',
      dados: ['I. Transmite luz e é imune a interferências eletromagnéticas.', 'II. Na emenda mecânica, as pontas são unidas e coladas com resina; na fusão, são aquecidas.', 'III. Sofre mais interferência que o cabo de cobre.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: a fibra **não** sofre interferência eletromagnética; o cobre sofre.',
      fonte: a8('13–17'),
      cena: { modo: 'fusao' },
    },
  ],
}

// ---------- 9.6 ----------

const fase96: Fase = {
  id: '9-6',
  titulo: 'Redes sem fio e espectro',
  resumo: 'Por que usar redes sem fio e como se comportam as ondas de rádio, as micro-ondas e o infravermelho.',
  Cena: CenaEspectro,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Redes sem fio',
      texto: `
> Redes sem fio são compostas por dispositivos que se comunicam sem a necessidade de fios.

> Motivação:
> - Mobilidade
> - Rapidez na Instalação
> - Conexão em áreas inóspitas

> Usam como meio de transmissão frequências nas faixas das ondas de rádio, micro-ondas e infravermelho.`,
      fonte: a8(18),
      cena: { modo: 'semfio' },
    },
    {
      titulo: 'Espectro eletromagnético',
      texto: `
> "Quando se movem, os elétrons criam ondas eletromagnéticas que podem se propagar no espaço livre."

> "As **ondas** podem ser transmitidas e recebidas por dispositivos contendo uma antena e um circuito."

> Ondas existem em diversas frequências, que são organizadas de acordo com a sua utilização.

Da menor para a maior frequência: ondas de rádio, micro-ondas, infravermelho, luz visível, ultravioleta, raios-X e raios gama.`,
      fonte: a8(19),
      cena: { modo: 'espectro' },
    },
    {
      titulo: 'Ondas de rádio',
      texto: `
> Propagam-se em todos os sentidos, Alcançam largas áreas geográficas e Penetram em vários tipos de materiais.

> - em **BAIXA FREQUÊNCIA**, seguem a curvatura da Terra.
> - em **ALTA FREQUÊNCIA**, viajam em linha reta em direção à ionosfera, onde são refletidas para a Terra.`,
      fonte: a8(20),
      cena: { modo: 'alta' },
    },
    {
      titulo: 'Micro-ondas',
      texto: `
> **MICRO-ONDAS** → Acima de 1GHz, trafegam em linha reta.
> - É influenciado pela geografia. Antenas devem ser alinhadas com a máxima precisão.
> - Acima de 10GHz o sinal é influenciado pelas condições atmosférica (sofrem absorção pela água!)`,
      fonte: a8(21),
      cena: { modo: 'microondas' },
    },
    {
      titulo: 'Infravermelho',
      texto: `
> **INFRAVERMELHO** → São relativamente direcionais, baratas e fáceis de construir, mas não atravessam objetos sólidos.`,
      fonte: a8(21),
      cena: { modo: 'infravermelho' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada característica ao tipo de onda.',
      grupos: ['Ondas de rádio', 'Micro-ondas', 'Infravermelho'],
      itens: [
        { texto: 'Penetram em vários tipos de materiais', grupo: 0 },
        { texto: 'Em alta frequência, refletem na ionosfera', grupo: 0 },
        { texto: 'Antenas alinhadas com a máxima precisão', grupo: 1 },
        { texto: 'Acima de 10 GHz sofrem absorção pela água', grupo: 1 },
        { texto: 'Não atravessam objetos sólidos', grupo: 2 },
      ],
      explicacao: 'Rádio: todos os sentidos, largas áreas, penetra materiais; baixa frequência segue a curvatura, alta reflete na ionosfera. Micro-ondas: acima de 1 GHz, linha reta, alinhamento preciso, acima de 10 GHz absorção pela água. Infravermelho: direcional, barato, não atravessa sólidos.',
      fonte: a8('20–21'),
      cena: { modo: 'espectro' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Como se propagam as ondas de rádio em BAIXA frequência?',
      opcoes: ['Seguem a curvatura da Terra', 'Refletem na ionosfera', 'Em linha reta acima de 1 GHz', 'Não atravessam paredes'],
      correta: 0,
      explicacao: 'Em **baixa frequência**, as ondas de rádio seguem a curvatura da Terra. Em alta frequência, viajam em linha reta até a ionosfera e são refletidas.',
      fonte: a8(20),
      cena: { modo: 'baixa' },
    },
    {
      tipo: 'classificar',
      enunciado: 'O que é motivação para usar redes sem fio?',
      grupos: ['Motivação', 'Não é motivação'],
      itens: [
        { texto: 'Mobilidade', grupo: 0 },
        { texto: 'Rapidez na instalação', grupo: 0 },
        { texto: 'Conexão em áreas inóspitas', grupo: 0 },
        { texto: 'Imunidade a interferências', grupo: 1 },
      ],
      explicacao: 'Motivação: **mobilidade**, **rapidez na instalação** e **conexão em áreas inóspitas**. Imunidade a interferências é vantagem da fibra ótica.',
      fonte: a8(18),
      cena: { modo: 'semfio' },
    },
  ],
}

// ---------- 9.7 ----------

const fase97: Fase = {
  id: '9-7',
  titulo: 'Faixas ISM e classificação',
  resumo: 'As faixas de frequência ISM e a classificação das redes sem fio por abrangência.',
  Cena: CenaIsm,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Industrial, Scientific e Medical',
      texto: `
> **ISM** → Faixas de frequências reservadas para o desenvolvimento Industrial, científico e médico.
> - Não tem necessidade de licenciamento
> - Possuem limitação de potência de transmissão.

As faixas da figura: **900 MHz**, **2,4 GHz** e **5 GHz** (esta dividida em vários blocos). BW é a largura de banda de cada faixa.`,
      fonte: a8(22),
      cena: { modo: 'faixas' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Onde você usa ISM',
          texto: 'O **Wi-Fi** usa as faixas de 2,4 GHz e 5 GHz, e o **Bluetooth** usa a de 2,4 GHz. Como não precisa de licença, qualquer um pode usar, por isso a potência é limitada.',
        },
      ],
    },
    {
      titulo: 'Classificação por abrangência',
      texto: `
> A classificação é baseada na abrangência:

Clique em cada círculo, do menor para o maior.`,
      fonte: a8(22),
      cena: { modo: 'abrangencia' },
      explorar: {
        instrucao: 'Clique nos 4 tipos de rede sem fio.',
        alvos: {
          wpan: { titulo: 'Pessoais', texto: 'WPAN, *Wireless **Personal** Area Networks*.' },
          wlan: { titulo: 'Locais', texto: 'WLAN, *Wireless **Local** Area Networks*.' },
          wman: { titulo: 'Metropolitanas', texto: 'WMAN, *Wireless **Metropolitan** Area Network*.' },
          wwan: { titulo: 'Longa Distância', texto: 'WWAN, *Wireless **Wide** Area Network*.' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'O que é característica das faixas ISM?',
      grupos: ['ISM', 'Não é ISM'],
      itens: [
        { texto: 'Não tem necessidade de licenciamento', grupo: 0 },
        { texto: 'Limitação de potência de transmissão', grupo: 0 },
        { texto: 'Reservada para uso industrial, científico e médico', grupo: 0 },
        { texto: 'Exige licença do governo', grupo: 1 },
      ],
      explicacao: 'ISM: faixas reservadas para o desenvolvimento industrial, científico e médico; **não têm necessidade de licenciamento** e **possuem limitação de potência**.',
      fonte: a8(22),
      cena: { modo: 'faixas' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Sobre as faixas ISM, avalie as afirmativas:',
      dados: ['I. ISM significa Industrial, Científica e Médica.', 'II. A faixa de 2,4 GHz é usada por Wi-Fi e Bluetooth.', 'III. As faixas ISM são de uso exclusivo do governo.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 1,
      explicacao: '**III errada**: as faixas ISM são de uso livre, sem licença.',
      fonte: a8(22),
      cena: { modo: 'faixas' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada sigla à abrangência.',
      grupos: ['Pessoal', 'Local', 'Metropolitana', 'Longa distância'],
      itens: [
        { texto: 'WPAN', grupo: 0 },
        { texto: 'WLAN', grupo: 1 },
        { texto: 'WMAN', grupo: 2 },
        { texto: 'WWAN', grupo: 3 },
      ],
      explicacao: 'WPAN: *Personal* · WLAN: *Local* · WMAN: *Metropolitan* · WWAN: *Wide* (longa distância).',
      fonte: a8(22),
      cena: { modo: 'abrangencia', semNomes: true },
    },
  ],
}

// ---------- 9.8 ----------

const fase98: Fase = {
  id: '9-8',
  titulo: 'WLAN',
  resumo: 'Os modos de operação da rede local sem fio (BSS, ESS e ad hoc) e o CSMA/CA.',
  Cena: CenaWlan,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Modo 1: infraestrutura básica',
      texto: `
> **Modo de Operação 1 – Infraestrutura Básico**
> - Utilizam o dispositivo que centraliza as informações.
> - Os clientes acessam o Pontos de Acesso (AP, *Access Point*) para enviar/receber dados de outros *hosts*.

Esse conjunto (AP + clientes) é o **BSS**. O AP também se liga à rede cabeada.`,
      fonte: a8(23),
      cena: { modo: 'bss' },
    },
    {
      titulo: 'Modo 1: infraestrutura estendida',
      texto: `
> **Modo de Operação 1 – Infraestrutura Estendida**
> - União de dois ou mais BSS por meio de um *switch ethernet*.

O conjunto de BSS ligados é o **ESS**.`,
      fonte: a8(24),
      cena: { modo: 'ess' },
    },
    {
      titulo: 'Modo 2: ad hoc',
      texto: `
> **Modo de Operação 2 – AdHoc**
> - Se caracteriza pela ausência de uma topologia predeterminada ou controle centralizado.
> - Dispositivos móveis fazem parte da rede apenas enquanto estão a uma certa proximidade do restante da rede.`,
      fonte: a8(24),
      cena: { modo: 'adhoc', saindo: true },
    },
    {
      titulo: 'CSMA/CA: escutar antes',
      texto: `
> Acesso múltiplo com verificação de portadora e Prevenção de Colisão (CSMA/CA, *Carrier Sense Multiple Access with Collision Avoidance*).

> ❶ A estação "escuta" o meio para determinar se está livre.

> ❷ SE SIM: a estação transmite; CASO CONTRÁRIO: ela aguarda a liberação.`,
      fonte: a8(25),
      cena: { modo: 'csma', etapa: 2 },
    },
    {
      titulo: 'CSMA/CA: intervalos',
      texto: `
> ❸ Após cada transmissão com ou sem colisão, a rede entra no modo onde as estações só podem começar a transmitir em intervalos de tempo a elas pré alocados.

> ❹ Ao findar uma transmissão, as estações alocadas têm o direito de transmitir. Se não o fazem, o direito passa as estações alocadas para o próximo intervalo, e assim sucessivamente.`,
      fonte: a8(25),
      cena: { modo: 'csma', etapa: 4 },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'CSMA/CA no Wi-Fi',
          noSlide: 'Depois de cada transmissão, cada estação transmite no **intervalo pré-alocado** a ela.',
          naPratica: 'No 802.11, depois que o meio fica livre, cada estação espera um tempo **aleatório** (*backoff*) antes de transmitir, e o receptor confirma cada quadro com um **ACK**. Na prova, use a descrição do slide.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Ligue cada característica ao modo de operação.',
      grupos: ['Infraestrutura básica (BSS)', 'Infraestrutura estendida (ESS)', 'Ad hoc'],
      itens: [
        { texto: 'Os clientes acessam o ponto de acesso', grupo: 0 },
        { texto: 'União de dois ou mais BSS por um switch', grupo: 1 },
        { texto: 'Sem controle centralizado', grupo: 2 },
        { texto: 'Só faz parte da rede quem está próximo', grupo: 2 },
      ],
      explicacao: 'BSS: clientes acessam o AP · ESS: dois ou mais BSS unidos por um switch ethernet · Ad hoc: sem topologia predeterminada nem controle centralizado; o dispositivo só participa enquanto está próximo.',
      fonte: a8('23–24'),
      cena: { modo: 'ess' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No CSMA/CA, o que a estação faz se o meio NÃO está livre?',
      opcoes: ['Aguarda a liberação', 'Transmite assim mesmo', 'Detecta a colisão e para', 'Passa o token'],
      correta: 0,
      explicacao: '“SE SIM: a estação transmite; CASO CONTRÁRIO: ela **aguarda a liberação**.”',
      fonte: a8(25),
      cena: { modo: 'csma', etapa: 2 },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que significa o "CA" de CSMA/CA?',
      opcoes: ['Collision Avoidance (prevenção de colisão)', 'Collision Detection (detecção de colisão)', 'Carrier Access', 'Centralized Access'],
      correta: 0,
      explicacao: 'CSMA/CA: *Carrier Sense Multiple Access with **Collision Avoidance***, prevenção de colisão.',
      fonte: a8(25),
      cena: { modo: 'csma', etapa: 1 },
    },
  ],
}

// ---------- 9.9 ----------

const fase99: Fase = {
  id: '9-9',
  titulo: 'WPAN e Bluetooth',
  resumo: 'Piconet, scatternet, a norma 802.15 e as vantagens e desvantagens do Bluetooth.',
  Cena: CenaBluetooth,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Conectividade',
      texto: 'Na WPAN, dispositivos pessoais (fone, celular, notebooks, mouse, impressora) se ligam a curta distância, sem fio.',
      fonte: a8(26),
      cena: { modo: 'conectividade' },
    },
    {
      titulo: 'Piconet',
      texto: `
> **PICONET**: 1 Mestre centraliza a comunicação
> - Não existe comunicação entre escravos.
> - Formado por 1 mestre ⇔ até 7 escravos

Com um escravo só é *Single Slave Operation*; com vários, *Multi Slave Operation*.`,
      fonte: a8(26),
      cena: { modo: 'multi', oitavo: true },
    },
    {
      titulo: 'Scatternet',
      texto: `
> **SCATTERNET**: Conjunto de *Piconets*
> - Num mesmo local podem existir várias *Piconets*.
> - Possuem mestres diferentes (canais próprios).
> - Um único mestre por Piconet.`,
      fonte: a8(27),
      cena: { modo: 'scatternet' },
      explorar: {
        instrucao: 'Clique num mestre e numa bridge.',
        alvos: {
          mestre: { titulo: 'Mestre', texto: 'Cada piconet tem **um único mestre**, com canal próprio.' },
          bridge: { titulo: 'Bridge', texto: 'Escravo que participa de duas piconets e liga uma à outra, formando a scatternet.' },
        },
      },
    },
    {
      titulo: 'IEEE 802.15 e Bluetooth',
      texto: `
> **IEEE 802.15** – Grupo de trabalho do IEEE que especifica os padrões de rede pessoal sem fio.

> **BLUETOOTH**: Tecnologia sem fio, para comunicação à curta distância entre diversos tipos de dispositivos

> Origem do nome: Rei Viking Harald Blatand

O símbolo junta as runas do **H** e do **B**.`,
      fonte: a8(27),
      cena: { modo: 'nome' },
    },
    {
      titulo: 'Vantagens e desvantagens',
      texto: `
> **Vantagens**
> - Facilidade de uso
> - Não exige visada direta
> - Baixo consumo de energia
> - Transmissão de voz e dados

> **Desvantagens**
> - Número limitado de dispositivos conectados
> - Alcance curto
> - Baixa taxa de dados`,
      fonte: a8(28),
      cena: { modo: 'multi' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Sobre o Bluetooth, avalie as afirmativas:',
      dados: ['I. Na piconet, um mestre controla a comunicação com os escravos.', 'II. Os escravos de uma piconet se comunicam diretamente entre si.', 'III. Uma scatternet é formada pela união de piconets.'],
      opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
      correta: 2,
      explicacao: '**II errada**: não há comunicação direta entre escravos; tudo passa pelo mestre.',
      fonte: a8(26),
      cena: { modo: 'multi' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada afirmação é da piconet ou da scatternet?',
      grupos: ['Piconet', 'Scatternet'],
      itens: [
        { texto: '1 mestre centraliza a comunicação', grupo: 0 },
        { texto: 'Não existe comunicação entre escravos', grupo: 0 },
        { texto: 'Conjunto de piconets', grupo: 1 },
        { texto: 'Mestres diferentes, com canais próprios', grupo: 1 },
      ],
      explicacao: 'Piconet: 1 mestre, até 7 escravos, sem comunicação entre escravos. Scatternet: conjunto de piconets no mesmo local, cada uma com seu mestre e canal.',
      fonte: a8('26–27'),
      cena: { modo: 'scatternet' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Vantagem ou desvantagem do Bluetooth?',
      grupos: ['Vantagem', 'Desvantagem'],
      itens: [
        { texto: 'Não exige visada direta', grupo: 0 },
        { texto: 'Baixo consumo de energia', grupo: 0 },
        { texto: 'Alcance curto', grupo: 1 },
        { texto: 'Baixa taxa de dados', grupo: 1 },
      ],
      explicacao: 'Vantagens: facilidade de uso, não exige visada direta, baixo consumo, voz e dados. Desvantagens: número limitado de dispositivos, alcance curto, baixa taxa de dados.',
      fonte: a8(28),
      cena: { modo: 'multi' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual grupo do IEEE especifica os padrões de rede pessoal sem fio?',
      opcoes: ['802.15', '802.11', '802.16', '802.3'],
      correta: 0,
      explicacao: '**IEEE 802.15**: padrões de rede pessoal sem fio (WPAN). 802.11 é WLAN e 802.16 é WMAN.',
      fonte: a8(27),
      cena: { modo: 'nome' },
    },
  ],
}

// ---------- 9.10 ----------

const fase910: Fase = {
  id: '9-10',
  titulo: 'WMAN e WiMAX',
  resumo: 'A rede metropolitana sem fio: topologia, modulação, pilha de protocolos e o padrão 802.16.',
  Cena: CenaWimax,
  camera: CAMERA,
  alvoCamera: ALVO,
  passos: [
    {
      titulo: 'Topologia',
      texto: 'Na WMAN, a antena do **provedor de Internet** leva o acesso sem fio a usuários domésticos, condomínios e empresas de uma região inteira.',
      fonte: a8(29),
      cena: { modo: 'topologia' },
    },
    {
      titulo: 'Compartilhamento da frequência',
      texto: `
> Mecanismos de modulação utilizadas em sistemas que necessitam de alta taxa de transferência.

Na figura, perto da torre usa-se **QAM-64**, mais longe **QAM-16** e na borda **QPSK**.`,
      fonte: a8(29),
      cena: { modo: 'modulacao' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Por que muda com a distância',
          texto: 'QAM-64 leva 6 bits por símbolo, QAM-16 leva 4 e QPSK leva 2. Quanto mais bits, mais rápido, mas mais limpo precisa chegar o sinal. Por isso a modulação mais rápida fica perto da torre.',
        },
      ],
    },
    {
      titulo: 'Pilha de protocolos',
      texto: `
A pilha do 802.16 tem cinco subcamadas:

- **Camada física**: ① modulação (QPSK, QAM-16, QAM-64) e ② *Transmission convergence sublayer*.
- **Camada enlace**: ③ *Security sublayer*, ④ *MAC sublayer common part* e ⑤ *Service specific convergence sublayer*.

Acima delas ficam as camadas superiores.`,
      fonte: a8(30),
      cena: { modo: 'pilha' },
    },
    {
      titulo: 'IEEE 802.16 e WiMAX',
      texto: `
> **IEEE 802.16** – Grupo de trabalho do IEEE que especifica os padrões Interface aérea para acesso sem fio de sistemas de banda larga.

> **WIMAX**
> - *Worldwide Interoperability for Microwave Access*;
> - Padrão de rede sem fios metropolitano (WMAN);
> - Criado pelas empresas Intel e Alvarion (2002).`,
      fonte: a8(30),
      cena: { modo: 'topologia' },
    },
    {
      titulo: '802.16d e 802.16e',
      texto: `
> **802.16d**
> - Para um uso fixo com antena montada no teto da casa;
> - Frequência: 2.5 GHz e 3.5 GHz (licenciada) e 5.8 GHz (ISM);
> - Largura de Banda: 75 Mbps – 10 km.

> **802.16e**
> - Liga clientes móveis à rede Internet ou serviços móveis;
> - Frequência: 2 GHz – 6 GHz (licenciada);
> - Largura de Banda: 30 Mbps - 3,5 km.`,
      fonte: a8(31),
      cena: { modo: 'tabela' },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada característica é do 802.16d ou do 802.16e?',
      grupos: ['802.16d', '802.16e'],
      itens: [
        { texto: 'Uso fixo, antena no teto da casa', grupo: 0 },
        { texto: '75 Mbps – 10 km', grupo: 0 },
        { texto: 'Liga clientes móveis', grupo: 1 },
        { texto: '30 Mbps – 3,5 km', grupo: 1 },
      ],
      explicacao: '802.16d: uso fixo, 2,5/3,5 GHz (licenciada) e 5,8 GHz (ISM), 75 Mbps – 10 km. 802.16e: clientes móveis, 2–6 GHz (licenciada), 30 Mbps – 3,5 km.',
      fonte: a8(31),
      cena: { modo: 'tabela', semBanda: true },
    },
    {
      tipo: 'classificar',
      enunciado: 'Em qual camada fica cada subcamada do 802.16?',
      grupos: ['Camada física', 'Camada enlace'],
      itens: [
        { texto: 'QPSK / QAM-16 / QAM-64', grupo: 0 },
        { texto: 'Transmission convergence sublayer', grupo: 0 },
        { texto: 'Security sublayer', grupo: 1 },
        { texto: 'MAC sublayer common part', grupo: 1 },
        { texto: 'Service specific convergence sublayer', grupo: 1 },
      ],
      explicacao: 'Física: ① modulação e ② *transmission convergence*. Enlace: ③ *security*, ④ *MAC common part* e ⑤ *service specific convergence*.',
      fonte: a8(30),
      cena: { modo: 'pilha', semCamada: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'No WiMAX, por que a modulação muda conforme a distância da torre?',
      opcoes: ['Longe da torre o sinal é mais fraco, então usa uma modulação mais robusta e mais lenta', 'Perto da torre há mais colisões', 'A modulação muda conforme o horário', 'Longe da torre o sinal passa a ser por fibra'],
      correta: 0,
      explicacao: 'Perto da torre o sinal é forte: QAM-64 (mais rápida). Na borda, QPSK: mais lenta, mas aguenta sinal fraco.',
      fonte: a8(29),
      cena: { modo: 'modulacao' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O WiMAX (IEEE 802.16) é um padrão de rede:',
      opcoes: ['Metropolitana sem fio (WMAN)', 'Pessoal sem fio (WPAN)', 'Local cabeada (LAN)', 'Em anel com passagem de token'],
      correta: 0,
      explicacao: 'WiMAX = **802.16**, rede metropolitana sem fio. Pessoal é o 802.15 (Bluetooth).',
      fonte: a8(30),
      cena: { modo: 'topologia' },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'escolha',
    enunciado: 'Qual meio é imune a interferências?',
    opcoes: ['Fibra ótica', 'Par trançado UTP', 'Cabo coaxial', 'Par trançado STP'],
    correta: 0,
    explicacao: '“Por usar refração a fibra **é imune a interferências**.” Os cabos de cobre sofrem ruído por indução magnética.',
    fonte: a8(13),
  },
  {
    tipo: 'classificar',
    enunciado: 'Ligue cada padrão à topologia.',
    grupos: ['Barra', 'Estrela'],
    itens: [
      { texto: '10BASE2 (coaxial fino)', grupo: 0 },
      { texto: '100BASE-T (par trançado)', grupo: 1 },
    ],
    explicacao: '10BASE2: topologia em **barra**. 100BASE-T: topologia em **estrela**.',
    fonte: a8('6, 10'),
  },
  {
    tipo: 'escolha',
    enunciado: 'Para que serve a técnica de cancelamento?',
    opcoes: ['Reduzir o ruído no cabo UTP', 'Reduzir a atenuação na fibra', 'Evitar colisões no Wi-Fi', 'Unir duas fibras'],
    correta: 0,
    explicacao: 'Cancelamento: “Técnica usada no cabo UTP para **reduzir o ruído**.”',
    fonte: a8(9),
  },
  {
    tipo: 'escolha',
    enunciado: 'Sobre a transmissão sem fio, avalie as afirmativas:',
    dados: ['I. Ondas de rádio de baixa frequência atravessam obstáculos.', 'II. Os sinais sem fio são sempre mais rápidos que os sinais em cabos.', 'III. Micro-ondas de frequência alta sofrem influência das condições atmosféricas, como a chuva.'],
    opcoes: ['Apenas I está correta.', 'Apenas I e II estão corretas.', 'Apenas I e III estão corretas.', 'Apenas II e III estão corretas.', 'Todas estão corretas.'],
    correta: 2,
    explicacao: '**II errada**: "sempre" é falso. A fibra, por exemplo, é muito rápida. Essa é a pegadinha da Q7 da AV2.',
    fonte: a8('19–21'),
  },
  {
    tipo: 'classificar',
    enunciado: 'Ligue cada norma ao tipo de rede sem fio.',
    grupos: ['WPAN', 'WMAN'],
    itens: [
      { texto: 'IEEE 802.15 / Bluetooth', grupo: 0 },
      { texto: 'IEEE 802.16 / WiMAX', grupo: 1 },
    ],
    explicacao: '802.15 (Bluetooth): rede pessoal sem fio (WPAN). 802.16 (WiMAX): rede metropolitana sem fio (WMAN).',
    fonte: a8('27, 30'),
  },
]

export const trilha9: Trilha = {
  id: 't9',
  numero: 9,
  titulo: 'Meio Físico',
  aula: 'Aula 08 · Meio Físico de Transmissão',
  cor: '#3f6fb5',
  disponivel: true,
  fases: [fase91, fase92, fase93, fase94, fase95, fase96, fase97, fase98, fase99, fase910],
  chefaoExtras: extras,
}
