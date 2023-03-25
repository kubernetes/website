---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Garante que uma cópia de um Pod esteja sendo executada em um conjunto de nós em um cluster.

aka: 
tags:
- fundamental
- core-object
- workload
---
 Garante que uma cópia de um {{< glossary_tooltip text="Pod" term_id="pod" >}} esteja sendo executada em um conjunto de nós em um {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
<!--more--> 

Usado para instalar daemons do sistema como coletores de log e agentes de monitoramento que normalmente devem ser executados em todos os {{< glossary_tooltip text="nós" term_id="node" >}}.