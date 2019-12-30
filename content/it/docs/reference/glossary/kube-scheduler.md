---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Componente che gira sui master node che controlla i pod appena creati che non hanno un nodo assegnato, e dopo averlo identificato glielo assegna.

aka: 
tags:
- architecture
---
 Componente che gira sui master node che controlla i pod appena creati che non hanno un nodo assegnato, e dopo averlo identificato glielo assegna.

<!--more--> 

I fattori presi in considerazioni nella programmazione di un pod includono le risorse richieste individualmente e collettivamente, i vincoli delle hardware/software/policy, le indicazioni di affinità e di anti-affinità, il collocamento dei dati, le interferenze tra diversi workload e le scadenze.

