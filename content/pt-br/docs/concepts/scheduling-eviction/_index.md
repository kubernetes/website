---
title: "Escalonamento, preempção e expulsão"
weight: 95
content_type: concept
description: >
  No Kubernetes, escalonamento refere-se a garantia de que os Pods correspondam aos Nós para que o kubelet possa executá-los. Preempção é o processo de finalizar Pods com menor prioridade, para que os Pods com maior prioridade possam ser escalonados nos Nós. Expulsão é o processo de finalização proativa de um ou mais Pods em Nós com poucos recursos.
no_list: true
---

No Kubernetes, escalonamento refere-se a certeza de que {{<glossary_tooltip text="Pods" term_id="pod">}}
correspondam aos {{<glossary_tooltip text="Nós" term_id="node">}} para que o
{{<glossary_tooltip text="Kubelet" term_id="kubelet">}} possa executá-los. Preempção é o processo de finalizar Pods com menor {{<glossary_tooltip text="prioridade" term_id="pod-priority">}}
para que os Pods com maior prioridade possam ser escalonados nos Nós. Expulsão é o processo de finalização proativa de um ou mais Pods em Nós poucos recursos.

## Escalonamento

* [Escalonador do Kubernetes](/pt-br/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Atribuindo Pods à Nós](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Sobrecarga de Pod](/pt-br/docs/concepts/scheduling-eviction/pod-overhead/)
* [Restrições de propagação da topologia do Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Taints e Tolerâncias](/pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Framework do escalonador](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Refinando a performance do escalonador](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Empacotamento de recursos para recursos ampliados](/docs/concepts/scheduling-eviction/resource-bin-packing/)

## Interrupção do Pod

* [Prioridade e Preempção do Pod](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Expulsão por pressão do Nó](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Expulsão iniciada por API](/docs/concepts/scheduling-eviction/api-eviction/)
