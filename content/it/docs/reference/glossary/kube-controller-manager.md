---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Componente sui master node che gestisce i controller.

aka: 
tags:
- architecture
- fundamental
---
 Componente sui master node che gestisce {{< glossary_tooltip text="controllers" term_id="controller" >}}.

<!--more-->

Da un punto di vista logica, ogni {{< glossary_tooltip text="controller" term_id="controller" >}} è un processo separato, ma per ridurre la complessità, vengono tutti compilati in un unico binario ed eseguiti in un singolo processo.
