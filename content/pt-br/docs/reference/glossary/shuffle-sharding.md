---
title: Shuffle-sharding
id: shuffle-sharding
date: 2020-03-04
full_link:
short_description: >
  Uma técnica para atribuir requisições para filas que proporciona melhor isolamento do que efetuar a operação módulo (resto da divisão) do _hash_ da requisição pelo número de filas.

aka:
tags:
- fundamental
---
Uma técnica para atribuir requisições para filas que proporciona melhor isolamento do que efetuar a operação módulo (resto da divisão) do _hash_ da requisição pelo número de filas.

<!--more-->

Nos preocupamos frequentemente em isolar diferentes fluxos de requisições
uma das outras, de modo que um fluxo de alta intensidade não afete um fluxo de baixa intensidade.
Uma forma simples de colocar requisições em fila é gerar um _hash_ baseado
em características da requisição, efetuar a operação módulo, ou resto da divisão, do _hash_ calculado pelo número de filas, para ter o
índice da fila à ser usada. A função _hash_ usa como entrada características da requisição
que se alinha com o fluxo. Por exemplo, na Internet isso é frequentemente a tupla de 5 elementos de
endereço de origem e destino, protocolo, e portas de origem e destino.

Esse simples esquema baseado em _hash_ tem a propriedade de que qualquer fluxo de alta intensidade
irá tirar todos fluxos de baixa intensidade dessa mesma fila.
Fornecer um bom isolamento para um grande número de fluxos requer um grande
número de filas, o que é problemático. Shuffle-sharding é uma
técnica mais ágil que pode fazer um trabalho melhor de isolar fluxos de baixa intensidade
dos fluxos de alta intensidade. A terminologia do shuffle-sharding faz uso
da metáfora de distribuição da mão de cartas; cada fila é uma carta metafórica.
A técnica de shuffle-sharding começa fazendo _hashing_ das características de identificação
do fluxo da solicitação, para produzir um valor _hash_ com dezenas ou mais bits.
Em seguida, o valor _hash_ é usado como uma fonte de entropia para embaralhar o baralho e
dar uma mão de cartas (filas). Todas as filas tratadas são examinadas e a solicitação
é colocada em uma das filas examinadas com menor tamanho.
Com um número modesto de cartas, não custa examinar todas as cartas distribudas, em um dado
fluxo de baixa intensidade que tem uma boa chance de se esquivar dos efeitos de um dado
fluxo de alta intensidade.
Com um número maior de cartas é caro examinar as filas tratadas e mais dificil para que os
fluxos de baixa intensidade se esquivem do efeitos coletivos de um conjunto de fluxos de alta
intensidade. Assim, o tamanho da mão do baralho deve ser escolhido criteriosamente.
