---
title: Service
id: service
date: 2021-09-17
full_link: /docs/concepts/services-networking/service/
short_description: >
  Uma forma abstrata de expor uma aplicação que está executando em um conjunto de Pods como um serviço de rede.

aka:
tags:
- fundamental
- core-object
---
Uma forma abstrata de expor uma aplicação que está executando em um conjunto de {{< glossary_tooltip text="Pods" term_id="pod" >}} como um serviço de rede.

<!--more-->

 O conjunto de Pods referenciado por um Service é (geralmente) determinado por um {{< glossary_tooltip text="seletor" term_id="selector" >}}. Se mais Pods são
 adicionados ou removidos, o conjunto de Pods que atende ao critério do seletor será alterado. O Service garante que o tráfego de rede pode ser direcionado ao
 conjunto atual de Pods para a carga de trabalho.
