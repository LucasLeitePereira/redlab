import type { Fase, Fonte, Questao, Trilha } from '../../engine/tipos'
import { CenaCamadas } from './cenas/Camadas'
import { CenaCaminho } from './cenas/Caminho'
import { CenaFilosofos } from './cenas/Filosofos'
import { CenaOsi } from './cenas/Pilha7'

// Trilha 5 — Modelo OSI. PDF: REDES-05p1_RM-OSI.pdf (9 páginas, 2 slides por página; a
// segunda metade da p. 9 é um slide em branco). A "página" das citações é a página do PDF.
// Textos entre aspas ("> ") são cópia do slide; o resto é explicação.
// Nota "curiosidade" = informação que NÃO está no slide.

const a = (pagina: number | string): Fonte => ({ aula: 'Aula 05 p1', pagina })

// ---------- 5.1 ----------

const fase51: Fase = {
  id: '5-1',
  titulo: 'Filósofo, tradutor e secretária',
  resumo: 'O exemplo conceitual do slide: três camadas de pessoas para dois filósofos conversarem.',
  Cena: CenaFilosofos,
  camera: [0, 4.8, 14],
  alvoCamera: [0, 2.3, 0],
  passos: [
    {
      titulo: 'Dois filósofos querendo se comunicar',
      texto: `
A Aula 05 abre o **Modelo de Referência OSI** com um exemplo:

> Exemplo Conceitual ➡ Arquitetura filósofo–tradutor–secretária. “Dois filósofos querendo se comunicar!”

> Um filósofo fala inglês e outro francês (camada 3).

No alto de cada prédio está um filósofo. O da esquerda escreve *I like rabbits* (“eu gosto de coelhos”, em inglês); o da direita só entende francês. Sozinhos, eles não se entendem.`,
      fonte: a(2),
      cena: { modo: 'filosofos' },
    },
    {
      titulo: 'Os tradutores (camada 2)',
      texto: `
> São contratados tradutores para o holandês (camada 2).

O tradutor da esquerda passa a frase para o holandês: *Ik vind konijnen leuk*. Em cima dela, anota **L: Dutch** (língua: holandês). Essa anotação não é para o filósofo: é para o **tradutor do outro lado** saber de qual língua traduzir. Na figura do slide: *Information for the remote translator*.`,
      fonte: a(2),
      cena: { modo: 'tradutores' },
    },
    {
      titulo: 'As secretárias (camada 1)',
      texto: `
> Secretárias, que falam holandês (camada 1), enviarão a informação.

A secretária acrescenta **Fax #** (o número do fax), uma informação para a **secretária do outro lado** (*Information for the remote secretary*), e manda a folha pelo fax. O fax é o único caminho de verdade entre os dois prédios.`,
      fonte: a(2),
      cena: { modo: 'secretarias' },
    },
    {
      titulo: 'A viagem completa',
      texto: `
A folha **desce** do filósofo até a secretária, **atravessa** pelo fax e **sobe** do outro lado: a secretária entrega ao tradutor, que passa do holandês para o francês, e o filósofo lê *J'aime bien les lapins*.

Cada um só entrega a folha para quem está logo acima ou abaixo. Mesmo assim, cada um “conversa” com o **seu par** do outro lado (as linhas tracejadas): filósofo com filósofo, tradutor com tradutor, secretária com secretária. Essa é a ideia das **camadas**, da próxima fase.`,
      fonte: a(2),
      cena: { modo: 'viagem' },
      explorar: {
        instrucao: 'Clique nos 3 andares do prédio da esquerda para ver o que cada um faz.',
        alvos: {
          filosofo: { titulo: 'Camada 3 · Filósofo', texto: 'Tem a **mensagem** (*I like rabbits*). Não traduz nem mexe no fax: entrega a ideia ao tradutor.' },
          tradutor: { titulo: 'Camada 2 · Tradutor', texto: 'Traduz para o holandês, a língua combinada entre os tradutores, e anota **L: Dutch** para o outro tradutor.' },
          secretaria: { titulo: 'Camada 1 · Secretária', texto: 'Anota o **Fax #** para a outra secretária e envia a folha pelo fax, o meio que liga os dois lados.' },
        },
      },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'Trocar uma camada sem mexer nas outras',
          texto: 'Não está no slide: a figura é do livro *Redes de Computadores*, de Andrew Tanenbaum. Lá, os tradutores podem combinar outra língua no lugar do holandês, e as secretárias podem trocar o fax por e-mail, sem os filósofos perceberem nada. Cada camada muda por dentro sem atrapalhar as outras.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'No exemplo do slide, cada pessoa está em qual camada?',
      grupos: ['Camada 3', 'Camada 2', 'Camada 1'],
      itens: [
        { texto: 'Filósofos', grupo: 0 },
        { texto: 'Tradutores', grupo: 1 },
        { texto: 'Secretárias', grupo: 2 },
      ],
      explicacao: 'Slide: filósofos que falam inglês e francês (**camada 3**); tradutores para o holandês (**camada 2**); secretárias que enviam a informação (**camada 1**).',
      fonte: a(2),
      cena: { modo: 'viagem', semCamadas: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'Para qual língua os tradutores do exemplo traduzem?',
      opcoes: ['Holandês', 'Inglês', 'Francês', 'Português'],
      correta: 0,
      explicacao: '“São contratados tradutores para o **holandês** (camada 2).” Os filósofos falam inglês e francês.',
      fonte: a(2),
      cena: { modo: 'tradutores' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura do slide, a anotação “L: Dutch” é uma informação para quem?',
      opcoes: ['Para o tradutor do outro lado', 'Para o filósofo do outro lado', 'Para a secretária do outro lado', 'Para o fax'],
      correta: 0,
      explicacao: 'Na figura, “L: Dutch” é *Information for the remote translator*: o tradutor do outro lado precisa saber de qual língua traduzir.',
      fonte: a(2),
      cena: { modo: 'tradutores' },
    },
    {
      tipo: 'escolha',
      enunciado: 'No exemplo, qual é o único caminho de verdade entre os dois lados?',
      opcoes: ['O fax, entre as secretárias', 'Uma conversa direta entre os filósofos', 'Uma conversa direta entre os tradutores', 'Não existe: eles não se comunicam'],
      correta: 0,
      explicacao: 'As secretárias (camada 1) “enviarão a informação”: a folha desce até elas e atravessa pelo **fax**. Filósofos e tradutores só conversam com o par através das camadas de baixo.',
      fonte: a(2),
      cena: { modo: 'viagem' },
    },
  ],
}

// ---------- 5.2 ----------

const fase52: Fase = {
  id: '5-2',
  titulo: 'Camadas e protocolos',
  resumo: 'A pilha de camadas, o serviço de uma camada à de cima e o protocolo entre pares.',
  Cena: CenaCamadas,
  camera: [0, 4.6, 14],
  alvoCamera: [0, 1.9, 0],
  passos: [
    {
      titulo: 'Uma pilha de camadas',
      texto: `
> **CAMADAS:** Para reduzir a complexidade do projeto, a maioria das redes é organizada como um pilha de camadas, colocadas umas sobre as outras.

A figura do slide tem dois computadores, **Host A** e **Host B**, cada um com três camadas, como os prédios dos filósofos: a Camada 3 em cima e a Camada 1 embaixo, perto do meio físico.`,
      fonte: a(3),
      cena: { modo: 'pilha' },
    },
    {
      titulo: 'Serviço: uma camada serve à de cima',
      texto: `
> O objetivo de cada camada é **oferecer serviços às camadas de cima**, isolando essas camadas dos detalhes de implementação.

As setas amarelas são os **serviços**: a Camada 1 serve à Camada 2 (*Serviço da camada 1*) e a Camada 2 serve à Camada 3 (*Serviço da camada 2*). A de cima usa o serviço sem saber **como** a de baixo trabalha, como o filósofo, que não precisa saber usar o fax.`,
      fonte: a(3),
      cena: { modo: 'servico' },
    },
    {
      titulo: 'Protocolo: a conversa entre pares',
      texto: `
> As regras usadas no diálogo entre camadas são conhecidas como PROTOCOLO DA CAMADA N.

> **“Protocolo é um conjunto de regras que controla a comunicação entre os pares de uma mesma camada”.**

**Pares** são as camadas de **mesmo número** nos dois hosts: a Camada 2 do Host A e a Camada 2 do Host B. As setas duplas são os protocolos da camada 1, 2 e 3.`,
      fonte: a(3),
      cena: { modo: 'protocolos' },
      explorar: {
        instrucao: 'Clique nas 3 setas de protocolo.',
        alvos: {
          p3: { titulo: 'Protocolo da camada 3', texto: 'Regras entre as Camadas 3 do Host A e do Host B. No exemplo: os dois filósofos.' },
          p2: { titulo: 'Protocolo da camada 2', texto: 'Regras entre as Camadas 2. No exemplo: os tradutores, que combinaram o holandês.' },
          p1: { titulo: 'Protocolo da camada 1', texto: 'Regras entre as Camadas 1. No exemplo: as secretárias, com o fax.' },
        },
      },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Aula 01',
          texto: 'Na Aula 01, protocolo era o “conjunto de regras usadas para comunicação entre pares”. Aqui o slide completa: os **pares** são as camadas de mesmo nível nos dois hosts.',
        },
      ],
    },
    {
      titulo: 'Camada N, N+1 e N-1',
      texto: `
O slide **Protocolos de Camadas** usa letras: a **Camada N** fica entre a **N+1** (acima) e a **N-1** (abaixo). Vale para qualquer camada.

> Protocolos são projetados de modo que a camada N no destino recebe exatamente o mesmo objeto enviado pela camada N na origem.

No exemplo: o tradutor da direita recebe exatamente a folha em holandês que o tradutor da esquerda escreveu.`,
      fonte: a(3),
      cena: { modo: 'n' },
    },
    {
      titulo: 'O fluxo de mensagem',
      texto: `
Os protocolos são a conversa **entre pares**, mas a mensagem não anda de lado. Na figura, o **Fluxo de Mensagem** desce pelas camadas do Host A, passa pelo **MEIO FÍSICO DE COMUNICAÇÃO** e sobe no Host B, como a folha do fax.`,
      fonte: a(3),
      cena: { modo: 'fluxo' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, por que a maioria das redes é organizada em camadas?',
      opcoes: ['Para reduzir a complexidade do projeto', 'Para aumentar a velocidade do cabo', 'Para economizar endereços IP', 'Para não precisar de protocolos'],
      correta: 0,
      explicacao: '“**Para reduzir a complexidade do projeto**, a maioria das redes é organizada como um pilha de camadas, colocadas umas sobre as outras.”',
      fonte: a(3),
      cena: { modo: 'pilha' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o objetivo de cada camada, segundo o slide?',
      opcoes: [
        'Oferecer serviços às camadas de cima, isolando-as dos detalhes de implementação',
        'Conversar direto com o meio físico',
        'Traduzir nomes em endereços IP',
        'Dar ordens às camadas de baixo',
      ],
      correta: 0,
      explicacao: '“O objetivo de cada camada é **oferecer serviços às camadas de cima**, isolando essas camadas dos detalhes de implementação.”',
      fonte: a(3),
      cena: { modo: 'servico' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Na figura do slide (na tela), cada seta é um serviço ou um protocolo?',
      grupos: ['Serviço', 'Protocolo'],
      itens: [
        { texto: 'Da Camada 1 para a Camada 2 do mesmo host', grupo: 0 },
        { texto: 'Da Camada 2 para a Camada 3 do mesmo host', grupo: 0 },
        { texto: 'Entre a Camada 2 do Host A e a Camada 2 do Host B', grupo: 1 },
        { texto: 'Entre a Camada 3 do Host A e a Camada 3 do Host B', grupo: 1 },
      ],
      explicacao: 'Setas **verticais** (amarelas), dentro de um host: **serviço** de uma camada à de cima. Setas **horizontais**, entre os pares dos dois hosts: **protocolo** da camada.',
      fonte: a(3),
      cena: { modo: 'tudo', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: '“Protocolo é um conjunto de regras que controla a comunicação entre…”',
      opcoes: ['os pares de uma mesma camada', 'uma camada e a camada de cima', 'o host e o meio físico', 'as camadas N+1 e N-1'],
      correta: 0,
      explicacao: 'Definição do slide: “Protocolo é um conjunto de regras que controla a comunicação entre **os pares de uma mesma camada**”.',
      fonte: a(3),
      cena: { modo: 'n' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O que a camada N no destino recebe?',
      opcoes: [
        'Exatamente o mesmo objeto enviado pela camada N na origem',
        'O objeto da camada N+1 da origem',
        'O objeto já modificado pela camada N-1',
        'Só os bits do meio físico',
      ],
      correta: 0,
      explicacao: '“Protocolos são projetados de modo que a camada N no destino recebe **exatamente o mesmo objeto** enviado pela camada N na origem.”',
      fonte: a(3),
      cena: { modo: 'n' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Na figura do slide, por onde a mensagem passa de verdade do Host A para o Host B?',
      opcoes: [
        'Desce as camadas do A, passa pelo meio físico e sobe as camadas do B',
        'Vai direto da Camada 3 do A para a Camada 3 do B',
        'Vai só pela Camada 2',
        'Sobe as camadas do A e desce as do B',
      ],
      correta: 0,
      explicacao: 'O **Fluxo de Mensagem** do slide passa pelo **meio físico de comunicação**: desce no Host A e sobe no Host B. As setas horizontais são a conversa lógica entre pares.',
      fonte: a(3),
      cena: { modo: 'fluxo' },
    },
  ],
}

// ---------- 5.3 ----------

const fase53: Fase = {
  id: '5-3',
  titulo: 'O modelo RM-OSI',
  resumo: 'O que é o RM-OSI, quem o propôs, as 7 camadas e para que serve a estrutura em camadas.',
  Cena: CenaOsi,
  camera: [0, 4.1, 14.4],
  alvoCamera: [0, 2.0, 0],
  passos: [
    {
      titulo: 'O que é o RM-OSI',
      texto: `
> **RM-OSI** ➡ É um modelo conceitual que caracteriza e padroniza as funções de comunicação de um sistema de computação.

- Trata da **Interconexão de Sistemas Abertos** (OSI, *Open System Interconnection*).
- Faz a **interoperabilidade** de sistemas de comunicação, sem levar em conta a estrutura interna e as tecnologias subjacentes.
- Proposta pela Organização de Padronização de Normas Internacional (**ISO**, *International Organization for Standardization*) em **1984**.

RM vem de *Reference Model*: Modelo de Referência.`,
      fonte: a(4),
      cena: { modo: 'predio' },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: 'OSI × ISO',
          texto: 'As letras são as mesmas, em outra ordem. **OSI** é o modelo (*Open System Interconnection*); **ISO** é a organização que o propôs, em 1984.',
        },
      ],
    },
    {
      titulo: 'Sete camadas',
      texto: `
> O modelo particiona um sistema de comunicação em **7 camadas** de abstração.

> Estabelece o modo como a informação deve ser transmitida entre os pontos de uma rede.

Cada prédio da cena é um host com as 7 camadas, nas cores do slide. A contagem começa **por baixo**: a **1ª** é a Física e a **7ª** é a Aplicação.`,
      fonte: a(4),
      cena: { modo: 'predio', numeros: true },
      explorar: {
        instrucao: 'Clique nas 7 camadas do Host A.',
        alvos: {
          c7: { titulo: '7ª Camada: Aplicação', texto: '“Dá suporte das aplicações do usuário do sistema.”' },
          c6: { titulo: '6ª Camada: Apresentação', texto: '“Realiza a conversão informação num formato comum para a transmissão dos dados.”' },
          c5: { titulo: '5ª Camada: Sessão', texto: '“Fornece uma estrutura de controle para a comunicação entre aplicações.”' },
          c4: { titulo: '4ª Camada: Transporte', texto: '“Proporciona a interface entre as 3 camadas superiores e as três camadas inferiores…”' },
          c3: { titulo: '3ª Camada: Rede', texto: '“Gerencia o encaminhamento dos pacotes ponto a ponto, da origem até o destino.”' },
          c2: { titulo: '2ª Camada: Enlace', texto: '“Fornece um canal livre de erros (detectando os erros).”' },
          c1: { titulo: '1ª Camada: Física', texto: '“Faz a transmissão dos sinais (bits) que trafegam no canal.”' },
        },
      },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Para decorar a ordem',
          texto: 'De cima para baixo: **A**plicação, **A**presentação, **S**essão, **T**ransporte, **R**ede, **E**nlace, **F**ísica. Uma frase para lembrar: “**A**s **A**ulas **S**ó **T**êm **R**edes **E** **F**ísica”.',
        },
      ],
    },
    {
      titulo: 'Uma camada serve à outra',
      texto: `
> Uma camada serve à camada acima dela e é servida pela camada abaixo dela.

As setas mostram o serviço subindo: a Física serve ao Enlace, o Enlace serve à Rede… até a Aplicação, que é servida pela Apresentação. É o mesmo **serviço** da fase anterior, agora com 7 camadas.

> Não informa os protocolos usados, apenas recomenda o que deve ser feito.

O RM-OSI diz **o que** cada camada deve fazer, não **qual** protocolo usar.`,
      fonte: a(4),
      cena: { modo: 'servico' },
    },
    {
      titulo: 'Para que servem as camadas',
      texto: `
> A estrutura em camadas é proposta para:
> - o desenvolvimento de novas soluções
> - que funcionem sob qualquer plataforma
> - ser independente do hardware ou software.

Na cena, o Host A é um computador e o Host B é um servidor, cada um com seu hardware e seu sistema. Com as mesmas 7 camadas, os dois conversam.`,
      fonte: a(5),
      cena: { modo: 'plataformas' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'O que significa a sigla OSI?',
      opcoes: [
        'Open System Interconnection (Interconexão de Sistemas Abertos)',
        'International Organization for Standardization',
        'Organização dos Sistemas da Internet',
        'Open Service Internet',
      ],
      correta: 0,
      explicacao: 'O RM-OSI “trata da Interconexão de Sistemas Abertos (OSI, *Open System Interconnection*)”. *International Organization for Standardization* é a **ISO**, que o propôs.',
      fonte: a(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'Quem propôs o RM-OSI, e em que ano?',
      opcoes: ['A ISO, em 1984', 'A ISO, em 1974', 'O IEEE, em 1990', 'A ARPA, em 1962'],
      correta: 0,
      explicacao: '“Proposta pela Organização de Padronização de Normas Internacional (**ISO**, *International Organization for Standardization*) em **1984**.”',
      fonte: a(4),
    },
    {
      tipo: 'digitar',
      enunciado: 'Contando a partir de baixo na pilha da tela, qual é o número de cada camada?',
      campos: [
        { rotulo: 'Transporte', resposta: '4', formato: 'numero' },
        { rotulo: 'Enlace', resposta: '2', formato: 'numero' },
        { rotulo: 'Aplicação', resposta: '7', formato: 'numero' },
        { rotulo: 'Rede', resposta: '3', formato: 'numero' },
      ],
      explicacao: 'De baixo para cima: 1ª Física, 2ª **Enlace**, 3ª **Rede**, 4ª **Transporte**, 5ª Sessão, 6ª Apresentação, 7ª **Aplicação**.',
      fonte: a('5–9'),
      cena: { modo: 'predio' },
    },
    {
      tipo: 'escolha',
      enunciado: 'O RM-OSI informa quais protocolos usar em cada camada?',
      opcoes: ['Não: apenas recomenda o que deve ser feito', 'Sim: um protocolo fixo para cada camada', 'Só nas camadas de baixo', 'Só na camada de Aplicação'],
      correta: 0,
      explicacao: 'Slide: “**Não informa os protocolos usados**, apenas recomenda o que deve ser feito.”',
      fonte: a(4),
    },
    {
      tipo: 'escolha',
      enunciado: 'A camada de Transporte serve a qual camada e é servida por qual?',
      opcoes: ['Serve à Sessão e é servida pela Rede', 'Serve à Rede e é servida pela Sessão', 'Serve à Aplicação e é servida pela Física', 'Serve ao Enlace e é servida pela Apresentação'],
      correta: 0,
      explicacao: '“Uma camada serve à camada **acima** dela e é servida pela camada **abaixo** dela.” Acima do Transporte está a **Sessão**; abaixo, a **Rede**.',
      fonte: a(4),
      cena: { modo: 'servico' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual destes NÃO é um motivo da estrutura em camadas, segundo o slide?',
      opcoes: ['Obrigar todos a usar o mesmo hardware', 'Desenvolver novas soluções', 'Funcionar sob qualquer plataforma', 'Ser independente do hardware ou software'],
      correta: 0,
      explicacao: 'A estrutura em camadas é proposta para o desenvolvimento de novas soluções que funcionem sob qualquer plataforma e para ser **independente do hardware ou software**: o contrário de obrigar um único hardware.',
      fonte: a(5),
    },
  ],
}

// ---------- 5.4 ----------

const fase54: Fase = {
  id: '5-4',
  titulo: 'Aplicação, apresentação e sessão',
  resumo: 'As três camadas de cima do RM-OSI e os exemplos do slide.',
  Cena: CenaOsi,
  camera: [0, 4.1, 14.4],
  alvoCamera: [0, 2.0, 0],
  passos: [
    {
      titulo: '7ª Camada: Aplicação',
      texto: `
> - Dá suporte das aplicações do usuário do sistema.
> - Serve de "janela", através da qual ocorre a troca das informações entre os usuários.

**Exemplo do slide:** a troca de informação entre o **navegador** e o **servidor de páginas WEB**.

Na cena, o pedido (vermelho) vai do navegador ao servidor e a página (azul) volta.`,
      fonte: a(5),
      cena: { modo: 'aplicacao' },
    },
    {
      titulo: '6ª Camada: Apresentação',
      texto: `
> - Realiza a conversão informação num formato comum para a transmissão dos dados.
> - É relacionada a semântica das informações.

**Exemplo do slide:** compressão e criptografia usada em páginas web.

Semântica é o **significado**: os dois lados precisam entender os dados do mesmo jeito. Na cena, o dado viaja comprimido e criptografado (📦 🔒) e do outro lado volta ao formato original.`,
      fonte: a(6),
      cena: { modo: 'apresentacao' },
    },
    {
      titulo: '5ª Camada: Sessão',
      texto: `
> - Fornece uma estrutura de controle para a comunicação entre aplicações.
> - Estabelece a conexão de sessão entre duas entidades.

**Exemplo do slide:** permite que a transmissão continue a partir da última recepção, caso haja queda da conexão.

Na cena, o download cai em 60% e, quando a conexão volta, continua dos 60%, sem começar do zero.`,
      fonte: a(6),
      cena: { modo: 'sessao' },
    },
    {
      titulo: 'As três camadas de cima',
      texto: `
No slide, as três camadas de cima têm a **mesma cor** (verde): Aplicação, Apresentação e Sessão. Logo abaixo delas fica o Transporte, que a próxima fase mostra fazendo a ligação entre essas três e as três de baixo.`,
      fonte: a('5–6'),
      cena: { modo: 'superiores' },
      explorar: {
        instrucao: 'Clique nas 3 camadas verdes do Host A para rever o exemplo de cada uma.',
        alvos: {
          aplicacao: { titulo: '7ª Aplicação', texto: 'Exemplo: a troca de informação entre o navegador e o servidor de páginas WEB.' },
          apresentacao: { titulo: '6ª Apresentação', texto: 'Exemplo: compressão e criptografia usada em páginas web.' },
          sessao: { titulo: '5ª Sessão', texto: 'Exemplo: a transmissão continua a partir da última recepção, caso haja queda da conexão.' },
        },
      },
    },
  ],
  desafio: [
    {
      tipo: 'classificar',
      enunciado: 'Cada exemplo do slide é de qual camada?',
      grupos: ['Aplicação', 'Apresentação', 'Sessão'],
      itens: [
        { texto: 'Troca de informação entre o navegador e o servidor de páginas WEB', grupo: 0 },
        { texto: 'Compressão e criptografia usada em páginas web', grupo: 1 },
        { texto: 'A transmissão continua da última recepção depois de uma queda da conexão', grupo: 2 },
      ],
      explicacao: 'Aplicação: navegador ↔ servidor de páginas WEB. Apresentação: compressão e criptografia. Sessão: continuar a transmissão depois de uma queda da conexão.',
      fonte: a('5–6'),
      cena: { modo: 'predio' },
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada definição é de qual camada?',
      grupos: ['Aplicação', 'Apresentação', 'Sessão'],
      itens: [
        { texto: 'Dá suporte das aplicações do usuário do sistema', grupo: 0 },
        { texto: 'Serve de “janela” para a troca de informações entre os usuários', grupo: 0 },
        { texto: 'Conversão da informação num formato comum', grupo: 1 },
        { texto: 'Relacionada à semântica das informações', grupo: 1 },
        { texto: 'Estrutura de controle para a comunicação entre aplicações', grupo: 2 },
        { texto: 'Estabelece a conexão de sessão entre duas entidades', grupo: 2 },
      ],
      explicacao: '**Aplicação**: suporte às aplicações do usuário e “janela” da troca de informações. **Apresentação**: formato comum e semântica. **Sessão**: estrutura de controle e conexão de sessão.',
      fonte: a('5–6'),
      cena: { modo: 'predio' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o número da camada de Apresentação?',
      opcoes: ['6ª', '7ª', '5ª', '4ª'],
      correta: 0,
      explicacao: 'De cima para baixo: 7ª Aplicação, **6ª Apresentação**, 5ª Sessão.',
      fonte: a(6),
      cena: { modo: 'predio' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Um download caiu na metade e, quando a conexão voltou, continuou de onde parou. Segundo o slide, qual camada permite isso?',
      opcoes: ['Sessão', 'Apresentação', 'Física', 'Aplicação'],
      correta: 0,
      explicacao: 'Exemplo da **Sessão**: “permite que a transmissão continue a partir da última recepção, caso haja queda da conexão.”',
      fonte: a(6),
    },
  ],
}

// ---------- 5.5 ----------

const fase55: Fase = {
  id: '5-5',
  titulo: 'Transporte e rede',
  resumo: 'Comunicação fim a fim (transporte) × ponto a ponto (rede).',
  Cena: CenaCaminho,
  camera: [-0.8, 8.5, 14],
  alvoCamera: [-0.8, 0.6, 0.6],
  passos: [
    {
      titulo: '4ª Camada: Transporte',
      texto: `
> Proporciona a interface entre as 3 camadas superiores e as três camadas inferiores, isolando o utilizador dos aspectos funcionais e físicos da rede.

> Controla a transferência de dados garantindo a comunicação fim a fim entre os *host* (faz a **correção dos erros** que ocorrem na transmissão).

**Fim a fim**: a conversa do transporte é só entre os dois *hosts* das pontas, o cliente e o servidor. Os roteadores do meio não participam dela (a linha laranja por baixo).`,
      fonte: a(7),
      cena: { modo: 'fimafim' },
    },
    {
      titulo: 'O transporte garante a entrega',
      texto: `
> **Garante** que todos os segmentos da mensagem chegarão corretamente no destino.

> Define e controla a **qualidade** da transmissão, considerando os requisitos da aplicação.

Na cena, a mensagem vai em **segmentos** numerados. O 2 se perde no caminho (✗); o servidor percebe que falta o 2, e o cliente envia o 2 de novo.

**Exemplo do slide:** Informa ao navegador que o destino não pode ser alcançado.`,
      fonte: a(7),
      cena: { modo: 'segmentos' },
      notas: [
        {
          tipo: 'slide-vs-pratica',
          titulo: 'Quem avisa “destino inalcançável”?',
          noSlide: 'Exemplo da camada de **transporte**: informa ao navegador que o destino não pode ser alcançado.',
          naPratica: 'O aviso “destino inalcançável” (*destination unreachable*) é do **ICMP**, que trabalha junto com o IP, na camada de **rede**. O transporte (TCP) percebe que a conexão falhou e avisa o programa. Na prova, responda como o slide.',
        },
      ],
    },
    {
      titulo: '3ª Camada: Rede',
      texto: `
> Gerencia o encaminhamento dos pacotes ponto a ponto, da origem até o destino.

> Faz o **endereçamento lógico** (número IP).

O **endereço IP** das Trilhas 3 e 4 é desta camada. Na cena, o pacote vai de roteador em roteador, um trecho por vez, até chegar ao servidor.`,
      fonte: a(7),
      cena: { modo: 'rede' },
    },
    {
      titulo: 'Fim a fim × ponto a ponto',
      texto: `
A figura **Comunicação entre hosts** compara as duas:

- **Comunicação fim a fim** (transporte): uma única conversa, do *host* cliente ao *host* servidor.
- **Comunicação ponto a ponto** (rede): uma conversa em **cada trecho**, de um equipamento ao vizinho: cliente → roteador → roteador → … → servidor.`,
      fonte: a(8),
      cena: { modo: 'comparar' },
      explorar: {
        instrucao: 'Clique nas 2 formas de comunicação.',
        alvos: {
          fim: { titulo: 'Comunicação fim a fim', texto: 'Uma seta só, do cliente ao servidor. É a da camada de **transporte**.' },
          ponto: { titulo: 'Comunicação ponto a ponto', texto: 'Uma seta em cada trecho, de roteador em roteador. É a da camada de **rede**.' },
        },
      },
      notas: [
        {
          tipo: 'pegadinha',
          titulo: '“Ponto a ponto” com três sentidos',
          texto: 'Aula 01: **Redes Ponto-a-Ponto** = arquitetura descentralizada (grupo de trabalho). Aula 02: **enlace dedicado entre dois dispositivos**. Aula 05 (aqui): comunicação **de equipamento em equipamento** da camada de rede. Leia o contexto da questão.',
        },
      ],
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual camada garante a comunicação fim a fim entre os hosts?',
      opcoes: ['Transporte', 'Rede', 'Enlace', 'Sessão'],
      correta: 0,
      explicacao: 'Transporte: “Controla a transferência de dados garantindo a **comunicação fim a fim** entre os *host*.”',
      fonte: a(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual camada faz o endereçamento lógico (número IP)?',
      opcoes: ['Rede', 'Enlace', 'Transporte', 'Física'],
      correta: 0,
      explicacao: 'Rede: “Faz o **endereçamento lógico** (número IP).” O endereçamento físico (MAC) é do Enlace.',
      fonte: a(7),
    },
    {
      tipo: 'classificar',
      enunciado: 'Na figura do slide (na tela), cada comunicação é de qual tipo?',
      grupos: ['Fim a fim', 'Ponto a ponto'],
      itens: [
        { texto: 'Cliente conversa direto com o servidor', grupo: 0 },
        { texto: 'Cliente → primeiro roteador', grupo: 1 },
        { texto: 'Roteador → roteador vizinho', grupo: 1 },
        { texto: 'Último roteador → servidor', grupo: 1 },
      ],
      explicacao: '**Fim a fim**: uma conversa só, de host a host (transporte). **Ponto a ponto**: uma conversa por trecho, de equipamento em equipamento (rede).',
      fonte: a(8),
      cena: { modo: 'comparar', semNomes: true },
    },
    {
      tipo: 'escolha',
      enunciado: 'A camada de Transporte faz a interface entre…',
      opcoes: ['as 3 camadas superiores e as 3 inferiores', 'a camada Física e o cabo', 'a Aplicação e o usuário', 'o Enlace e a Física'],
      correta: 0,
      explicacao: '“Proporciona a interface entre as **3 camadas superiores** e as **três camadas inferiores**, isolando o utilizador dos aspectos funcionais e físicos da rede.”',
      fonte: a(7),
    },
    {
      tipo: 'escolha',
      enunciado: 'Segundo o slide, o que a camada de Transporte garante?',
      opcoes: [
        'Que todos os segmentos da mensagem chegarão corretamente no destino',
        'Que o cabo nunca vai falhar',
        'Que cada roteador tenha um endereço MAC',
        'Que a página chegue comprimida',
      ],
      correta: 0,
      explicacao: '“**Garante** que todos os segmentos da mensagem chegarão corretamente no destino.” Ela também faz a correção dos erros e controla a qualidade da transmissão.',
      fonte: a(7),
      cena: { modo: 'segmentos' },
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é o exemplo que o slide dá para a camada de Transporte?',
      opcoes: [
        'Informa ao navegador que o destino não pode ser alcançado',
        'Compressão e criptografia usada em páginas web',
        'Voltagem e pinos do conector de rede',
        'Continuar a transmissão depois de uma queda da conexão',
      ],
      correta: 0,
      explicacao: 'Exemplo do Transporte no slide: “Informa ao navegador que o destino não pode ser alcançado.” Os outros são da Apresentação, da Física e da Sessão.',
      fonte: a(7),
    },
  ],
}

// ---------- 5.6 ----------

const fase56: Fase = {
  id: '5-6',
  titulo: 'Enlace, física e a viagem completa',
  resumo: 'As duas camadas de baixo e a mensagem descendo e subindo as 7 camadas.',
  Cena: CenaOsi,
  camera: [0, 4.1, 14.4],
  alvoCamera: [0, 2.0, 0],
  passos: [
    {
      titulo: '2ª Camada: Enlace',
      texto: `
> - Fornece um canal livre de erros (detectando os erros).
> - Faz o **controle de fluxo**, evitando que um transmissor rápido envie uma quantidade excessiva de dados à um receptor lento.
> - Permite o controle de um canal compartilhado (difusão).
> - Faz o **endereçamento físico** da informação (endereço MAC).

O **MAC** da Aula 04 (ba:16:3e:f4:a0:e5) é desta camada. Na cena, o transmissor é rápido e o receptor é lento: o enlace manda um dado por vez, no ritmo de quem recebe.`,
      fonte: a(8),
      cena: { modo: 'enlace' },
      notas: [
        {
          tipo: 'dica',
          titulo: 'Liga com a Aula 02',
          texto: 'Na Aula 02, **difusão** é a tecnologia em que todos compartilham o mesmo canal. O slide diz que o enlace permite o controle desse canal compartilhado.',
        },
      ],
    },
    {
      titulo: '1ª Camada: Física',
      texto: `
> - Faz a transmissão dos sinais (bits) que trafegam no canal.
> - Define as características elétricas e mecânicas do meio de transmissão.

**Exemplo do slide:** voltagem, quantos de pinos são usados no conector de rede e a finalidade de cada um.

Os bits viram sinais no cabo, como os pulsos da fase 1.2 (meios de transmissão).`,
      fonte: a(9),
      cena: { modo: 'fisica' },
      notas: [
        {
          tipo: 'curiosidade',
          titulo: 'O conector de rede',
          texto: 'Não está no slide: o conector do cabo par trançado comum é o **RJ-45**, com 8 pinos.',
        },
      ],
    },
    {
      titulo: 'A viagem pelas 7 camadas',
      texto: `
Juntando tudo: quando o Host A envia, a mensagem **desce** as 7 camadas, vira sinais no meio físico e **sobe** as 7 camadas no Host B.

Como no exemplo dos filósofos, cada camada conversa com o seu **par** do outro lado (as linhas tracejadas), mas o caminho de verdade é pelo meio físico.`,
      fonte: a('3–9'),
      cena: { modo: 'viagem' },
    },
  ],
  desafio: [
    {
      tipo: 'escolha',
      enunciado: 'Qual camada faz o endereçamento físico (endereço MAC)?',
      opcoes: ['Enlace', 'Física', 'Rede', 'Transporte'],
      correta: 0,
      explicacao: 'Enlace: “Faz o **endereçamento físico** da informação (endereço MAC).” O endereço lógico (IP) é da camada de Rede.',
      fonte: a(8),
    },
    {
      tipo: 'escolha',
      enunciado: 'Evitar que um transmissor rápido envie dados demais a um receptor lento é o…',
      opcoes: ['controle de fluxo, da camada de Enlace', 'endereçamento lógico, da camada de Rede', 'controle de sessão, da camada de Sessão', 'formato comum, da camada de Apresentação'],
      correta: 0,
      explicacao: 'Enlace: “Faz o **controle de fluxo**, evitando que um transmissor rápido envie uma quantidade excessiva de dados à um receptor lento.”',
      fonte: a(8),
    },
    {
      tipo: 'classificar',
      enunciado: 'Cada item é da camada de Enlace ou da Física?',
      grupos: ['Enlace', 'Física'],
      itens: [
        { texto: 'Canal livre de erros (detectando os erros)', grupo: 0 },
        { texto: 'Controle de um canal compartilhado (difusão)', grupo: 0 },
        { texto: 'Endereço MAC', grupo: 0 },
        { texto: 'Transmissão dos sinais (bits) no canal', grupo: 1 },
        { texto: 'Características elétricas e mecânicas do meio', grupo: 1 },
        { texto: 'Voltagem e pinos do conector de rede', grupo: 1 },
      ],
      explicacao: '**Enlace**: canal livre de erros, controle de fluxo, canal compartilhado e endereço MAC. **Física**: sinais (bits), características elétricas e mecânicas, voltagem e pinos do conector.',
      fonte: a('8–9'),
    },
    {
      tipo: 'escolha',
      enunciado: 'Numa transmissão do Host A para o Host B, por onde a mensagem passa?',
      opcoes: [
        'Desce as 7 camadas do A, vai pelo meio físico e sobe as 7 do B',
        'Sobe as 7 camadas do A e desce as 7 do B',
        'Vai direto da Aplicação do A para a Aplicação do B',
        'Passa só pelas camadas de Rede dos dois',
      ],
      correta: 0,
      explicacao: 'Como no Fluxo de Mensagem do slide p. 3: desce as camadas na origem, passa pelo **meio físico** e sobe no destino. A conversa entre pares é lógica.',
      fonte: a(3),
      cena: { modo: 'viagem' },
    },
  ],
}

// ---------- Chefão ----------

const extras: Questao[] = [
  {
    tipo: 'classificar',
    enunciado: 'Cada função é de qual camada do RM-OSI?',
    grupos: ['Transporte', 'Rede', 'Enlace', 'Física'],
    itens: [
      { texto: 'Comunicação fim a fim entre os hosts', grupo: 0 },
      { texto: 'Encaminhamento dos pacotes ponto a ponto', grupo: 1 },
      { texto: 'Endereço IP', grupo: 1 },
      { texto: 'Endereço MAC', grupo: 2 },
      { texto: 'Controle de fluxo', grupo: 2 },
      { texto: 'Transmissão dos bits no canal', grupo: 3 },
    ],
    explicacao: 'Transporte: fim a fim. Rede: encaminhamento ponto a ponto e IP. Enlace: MAC e controle de fluxo. Física: sinais (bits).',
    fonte: a('7–9'),
  },
  {
    tipo: 'escolha',
    enunciado: 'No exemplo filósofo–tradutor–secretária, as secretárias correspondem a qual camada?',
    opcoes: ['Camada 1', 'Camada 2', 'Camada 3', 'Camada 7'],
    correta: 0,
    explicacao: '“Secretárias, que falam holandês (**camada 1**), enviarão a informação.”',
    fonte: a(2),
  },
  {
    tipo: 'digitar',
    enunciado: 'Em quantas camadas o RM-OSI particiona um sistema de comunicação?',
    campos: [{ rotulo: 'Camadas', resposta: '7', formato: 'numero' }],
    explicacao: '“O modelo particiona um sistema de comunicação em **7 camadas** de abstração.”',
    fonte: a(4),
  },
  {
    tipo: 'escolha',
    enunciado: 'Qual sequência está na ordem do RM-OSI, de cima para baixo?',
    opcoes: [
      'Aplicação, Apresentação, Sessão, Transporte, Rede, Enlace, Física',
      'Aplicação, Sessão, Apresentação, Transporte, Rede, Física, Enlace',
      'Aplicação, Apresentação, Transporte, Sessão, Enlace, Rede, Física',
      'Apresentação, Aplicação, Sessão, Rede, Transporte, Enlace, Física',
    ],
    correta: 0,
    explicacao: 'De cima (7ª) para baixo (1ª): **Aplicação, Apresentação, Sessão, Transporte, Rede, Enlace, Física**.',
    fonte: a(4),
  },
  {
    tipo: 'escolha',
    enunciado: 'Segundo o slide, compressão e criptografia usada em páginas web é exemplo de qual camada?',
    opcoes: ['Apresentação', 'Aplicação', 'Sessão', 'Transporte'],
    correta: 0,
    explicacao: 'Exemplo da **6ª Camada: Apresentação**: “compressão e criptografia usada em páginas web.”',
    fonte: a(6),
  },
]

export const trilha5: Trilha = {
  id: 't5',
  numero: 5,
  titulo: 'Modelo OSI',
  aula: 'Aula 05 p1 · Modelo OSI',
  cor: '#7458c4',
  disponivel: true,
  fases: [fase51, fase52, fase53, fase54, fase55, fase56],
  chefaoExtras: extras,
}
