---
title: Coleta de lixo
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  Um termo coletivo para os vários mecanismos que o Kubernetes usa para limpar os recursos do cluster.

aka: 
tags:
- fundamental
- operation
---

Coleta de lixo (Garbage collection) é um termo coletivo para os vários mecanismos que o Kubernetes usa para limpar os recursos do cluster.

<!--more-->

O Kubernetes usa a coleta de lixo para limpar recursos como 
[contêineres e imagens de contêiner não utilizados](/docs/concepts/architecture/garbage-collection/#containers-images), 
[Pods em estado de falha](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), 
[objetos dependentes do recurso alvo](/docs/concepts/overview/working-with-objects/owners-dependents/), 
[Jobs concluídos](/docs/concepts/workloads/controllers/ttlafterfinished/) e recursos que expiraram ou falharam.
