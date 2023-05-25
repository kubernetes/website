---
title: "Escalonamento, preempção e remoção"
weight: 95
content_type: concept
description: >
  No Kubernetes, escalonamento refere-se à certeza de que os Pods correspondam aos nós para que o kubelet possa executá-los. Preempção é o processo de finalizar Pods com menor prioridade, para que os Pods com maior prioridade possam ser escalonados nos nós. Remoção é o processo de finalização proativa de um ou mais Pods em nós com poucos recursos.
no_list: true
---

No Kubernetes, escalonamento refere-se à certeza de que {{<glossary_tooltip text="Pods" term_id="pod">}}
correspondam aos {{<glossary_tooltip text="nós" term_id="node">}} para que o
{{<glossary_tooltip text="Kubelet" term_id="kubelet">}} possa executá-los. Preempção é o processo de finalizar Pods com menor {{<glossary_tooltip text="prioridade" term_id="pod-priority">}}
para que os Pods com maior prioridade possam ser escalonados nos nós. Remoção é o processo de finalização de um ou mais Pods em nós.

## Escalonamento

- [Escalonador do Kubernetes](/pt-br/docs/concepts/scheduling-eviction/kube-scheduler/)
- [Atribuindo Pods à Nós](/docs/concepts/scheduling-eviction/assign-pod-node/)
- [Sobrecarga de Pod](/pt-br/docs/concepts/scheduling-eviction/pod-overhead/)
- [Restrições de Propagação da Topologia do Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
- [Taints e Tolerâncias](/pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/)
- [Framework do Escalonador](/docs/concepts/scheduling-eviction/scheduling-framework)
- [Refinando a Performance do Escalonador](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
- [Empacotamento de Recursos para Recursos Estendidos](/docs/concepts/scheduling-eviction/resource-bin-packing/)

## Disrupção do Pod

{{<glossary_definition term_id="pod-disruption" length="all">}}

- [Prioridade e Preempção do Pod](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
- [Remoção por Pressão do Nó](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
- [Remoção Iniciada por API](/docs/concepts/scheduling-eviction/api-eviction/)
