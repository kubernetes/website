---
title: "Планування, витіснення та виселення"
weight: 95
content_type: concept
no_list: true
---

У Kubernetes планування означає забезпечення відповідності {{< glossary_tooltip text="Podʼів" term_id="pod" >}} {{< glossary_tooltip text="вузлам" term_id="node" >}}, щоб {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} міг їх запустити. Витіснення — це процес завершення роботи Podʼів з нижчим {{< glossary_tooltip text="пріоритетом" term_id="pod-priority" >}}, щоб Podʼи з вищим пріоритетом могли плануватися на вузлах. Виселення — це процес завершення роботи одного або кількох Podʼів на вузлах.

## Планування {#scheduling}

* [Планувальник Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Запуск кількох планувальників](/docs/concepts/scheduling-eviction/running-multiple-schedulers/)
* [Призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Накладні витрати Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Обмеження топології розміщення Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Taints та Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Фреймворк планування](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Налаштування продуктивності планувальника](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Пакування ресурсів для розширених ресурсів](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Готовність Podʼів до планування](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [Групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Планування з урахуванням топології](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [Витіснення з урахуванням робочого навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Можливості, оголошені вузлом](/docs/concepts/scheduling-eviction/node-declared-features/)

## Порушення роботи Podʼів {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Пріоритет та витіснення Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Виселення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/)
