---
title: "Planificación, preferencia y desalojo"
weight: 95
content_type: concept
no_list: true
---

En Kubernetes, la planificación se refiere a asegurarse de que los {{<glossary_tooltip text="Pods" term_id="pod">}}
se asignen a los {{<glossary_tooltip text="Nodos" term_id="node">}} para que el
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} pueda ejecutarlos. La preferencia (preemption)
es el proceso de finalizar Pods con menor {{<glossary_tooltip text="prioridad" term_id="pod-priority">}}
para que los Pods con mayor prioridad puedan planificarse en los nodos. El desalojo (eviction) es el proceso
de finalizar uno o más Pods en los nodos.

## Planificación

* [Planificador de Kubernetes](/es/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Ejecutar múltiples planificadores](/es/docs/concepts/scheduling-eviction/running-multiple-schedulers/)
* [Asignar Pods a Nodos](/es/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Sobrecarga de Pod](/es/docs/concepts/scheduling-eviction/pod-overhead/)
* [Restricciones de dispersión de topología de Pods](/es/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Tolerancias y taints](/es/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Marco de planificación](/es/docs/concepts/scheduling-eviction/scheduling-framework)
* [Ajuste de rendimiento del planificador](/es/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Empaquetado de recursos extendidos](/es/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Preparación para la planificación de Pods](/es/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Planificación de PodGroup](/es/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [Planificación Gang](/es/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Planificación consciente de la topología](/es/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [Preferencia consciente de la carga de trabajo](/es/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Características declaradas del nodo](/es/docs/concepts/scheduling-eviction/node-declared-features/)

## Interrupción de Pods

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Prioridad y preferencia de Pods](/es/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Desalojo por presión de nodo](/es/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Desalojo iniciado por API](/es/docs/concepts/scheduling-eviction/api-eviction/)
