---
title: Coletor de lixo
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

Coletor de lixo (Garbage collection) é um termo coletivo para os vários mecanismos que o Kubernetes usa para limpar os recursos do cluster.

<!--more-->

O Kubernetes usa o coletor de lixo para limpar recursos 
[não utilizados como contêineres e imagens](/docs/concepts/architecture/garbage-collection/#containers-images), 
[Pods com falha](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), 
[objetos proprietários do recurso alvo](/docs/concepts/overview/working-with-objects/owners-dependents/), 
[trabalhos concluídos](/docs/concepts/workloads/controllers/ttlafterfinished/) e recursos que expiraram ou falharam.
