---
title: "Planificación, apropiación y desalojo"
weight: 95
content_type: concept
no_list: true
---

En Kubernetes, la planificación se refiere a asegurarse de que los {{<glossary_tooltip text="Pods" term_id="pod">}}
se asignen a los {{<glossary_tooltip text="nodos" term_id="node">}} para que
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} pueda ejecutarlos. La apropiación (Preemption)
es el proceso de terminar Pods con menor {{<glossary_tooltip text="prioridad" term_id="pod-priority">}}
para que los Pods con mayor prioridad puedan planificarse en los nodos. El desalojo es el proceso
de terminar uno o más Pods en los nodos.

## Planificación

* [Planificador de Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Ejecutar múltiples planificadores](/docs/concepts/scheduling-eviction/running-multiple-schedulers/)
* [Asignar Pods a nodos](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Sobrecarga de Pod](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Restricciones de propagación de topología de Pods](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Contaminaciones y tolerancias](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Framework de planificación](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Ajuste del rendimiento del planificador](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Empaquetado de recursos (bin packing) para recursos extendidos](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Preparación para la planificación de Pods](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Planificación de PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [Planificación en grupo (Gang Scheduling)](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Planificación basada en topología](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [Apropiación basada en cargas de trabajo](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Características declaradas por el nodo](/docs/concepts/scheduling-eviction/node-declared-features/)

## Interrupción de Pods

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Prioridad y apropiación de Pods](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Desalojo por presión en el nodo](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Desalojo iniciado por API](/docs/concepts/scheduling-eviction/api-eviction/)
