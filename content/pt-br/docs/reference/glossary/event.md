---
title: Evento
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Um relatório de um evento em algum lugar do cluster. Geralmente denota alguma mudança de estado no sistema.

aka: 
tags:
- core-object
- fundamental
---
Cada evento é uma informação de um acontecimento em algum lugar do {{< glossary_tooltip text="cluster" term_id="cluster" >}}. 
Geralmente denota alguma mudança de estado no sistema.

<!--more-->

Os eventos tem um tempo restrito de retenção, e os gatilhos e as mensagens podem estar envolvidos com tempo. 
Os consumidores de evento não devem confiar no tempo de um evento com um determinado motivo que reflita em um gatilhos subjacente consistente, ou em eventos contínuos que existam pelo mesmo motivo. 

No Kubernetes, a [auditoria](/docs/tasks/debug/debug-cluster/audit/) gera um tipo diferente de registro de evento (grupo de API `audit.k8s.io`).
