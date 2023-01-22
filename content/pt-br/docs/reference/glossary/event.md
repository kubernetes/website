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

Os eventos tem um tempo limitado de retenção, e os gatilhos e as mensagens podem evoluir com o tempo. 
Os consumidores de um evento não devem confiar que a temporalidade de um evento com um determinado motivo reflita um gatilho com uma causa consistente, ou na existência de eventos continuados com aquele motivo.

Os eventos devem ser tratados como dados informativos, de melhor esforço, suplementares.

No Kubernetes, a [auditoria](/docs/tasks/debug/debug-cluster/audit/) gera um tipo diferente de registro de evento (grupo de API `audit.k8s.io`).
