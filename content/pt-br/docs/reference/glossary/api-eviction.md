---
title: Eviction iniciada pela API
id: api-eviction
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  A eviction iniciada pela API é o processo pelo qual você usa a API Eviction para criar um
  objeto Eviction que aciona o encerramento gracioso do pod.

aka:
tags:
- operation
---
A eviction iniciada pela API (API-initiated eviction) é o processo pelo qual você usa a [API Eviction](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
para criar um objeto `Eviction` que aciona o encerramento gracioso do pod.

<!--more-->

Você pode solicitar uma eviction chamando diretamente a API Eviction
usando um cliente do kube-apiserver, como o comando `kubectl drain`.
Quando um objeto `Eviction` é criado, o servidor de API encerra o Pod.

As evictions iniciadas pela API respeitam os [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
configurados por você e o [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

A eviction iniciada pela API não é o mesmo que a [eviction por pressão de nó (node-pressure eviction)](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Consulte [eviction iniciada pela API](/docs/concepts/scheduling-eviction/api-eviction/) para obter mais informações.
