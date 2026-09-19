---
title: Eviction por pressão de nó
id: node-pressure-eviction
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  A eviction por pressão de nó é o processo pelo qual o kubelet termina proativamente
  pods para recuperar recursos nos nós.
aka:
- kubelet eviction
tags:
- operation
---
A eviction por pressão de nó (node-pressure eviction) é o processo pelo qual o {{<glossary_tooltip term_id="kubelet" text="kubelet">}} termina proativamente
pods para recuperar {{< glossary_tooltip text="recursos" term_id="infrastructure-resource" >}}
nos nós.

<!--more-->

O kubelet monitora recursos como CPU, memória, espaço em disco e inodes do
sistema de arquivos nos nós do seu cluster. Quando um ou mais desses recursos atingem
níveis específicos de consumo, o kubelet pode falhar proativamente um ou mais pods
no nó para recuperar recursos e evitar a privação (starvation).

A eviction por pressão de nó não é o mesmo que a [eviction iniciada pela API](/docs/concepts/scheduling-eviction/api-eviction/).
