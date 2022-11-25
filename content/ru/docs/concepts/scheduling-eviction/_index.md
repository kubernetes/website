---
title: "Планирование, приоритизация и вытеснение"
weight: 95
content_type: concept
description: >
  В Kubernetes под планированием понимается поиск подходящих узлов, на которых kubelet сможет запустить Pod'ы. 
  Приоритизация — процесс завершения работы Pod'ов с более низким приоритетом и высвобождения места для Pod'ов 
  с более высоким приоритетом. Вытеснение — это проактивное завершение работы одного или нескольких Pod'ов на 
  узлах с дефицитом ресурсов.

no_list: true
---

В Kubernetes под планированием понимается поиск {{<glossary_tooltip text="узлов" term_id="node">}}, подходящих для размещения {{<glossary_tooltip text="Pod'ов" term_id="pod">}} так, чтобы {{<glossary_tooltip text="kubelet" term_id="kubelet">}} 
мог их запустить. Приоритизация (упреждение; preemption) — процесс завершения работы Pod'ов 
с более низким {{<glossary_tooltip text="приоритетом" term_id="pod-priority">}} с освобождением места для Pod'ов с более высоким приоритетом. Вытеснение (eviction) — завершение работы одного или нескольких Pod'ов на узлах.

## Планирование

* [Планировщик Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/);
* [Распределение Pod'ов по узлам](/docs/concepts/scheduling-eviction/assign-pod-node/);
* [Overhead Pod'а](/docs/concepts/scheduling-eviction/pod-overhead/);
* [Ограничения на топологию распределения Pod'ов](/docs/concepts/scheduling-eviction/topology-spread-constraints/);
* [Ограничения (taints) и допуски (tolerations)](/docs/concepts/scheduling-eviction/taint-and-toleration/);
* [Фреймворк для планирования](/docs/concepts/scheduling-eviction/scheduling-framework);
* [Настройка производительности планировщика](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/);
* [Упаковка расширенных ресурсов](/docs/concepts/scheduling-eviction/resource-bin-packing/).

## Завершение работы Pod'ов

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Приоритет и приоритизация Pod'ов](/docs/concepts/scheduling-eviction/pod-priority-preemption/);
* [Вытеснение из-за недостатка ресурсов на узле](/docs/concepts/scheduling-eviction/node-pressure-eviction/);
* [Вытеснение, инициированное API](/docs/concepts/scheduling-eviction/api-eviction/).
