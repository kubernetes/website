---
title: "Планування, Випередження та Виселення"
weight: 95
content_type: concept
no_list: true
---

У Kubernetes планування означає забезпечення відповідності {{< glossary_tooltip text="Podʼів" term_id="pod" >}} вузлам ({{< glossary_tooltip text="Nodes" term_id="node" >}}), щоб {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} міг їх запустити. Випередження — це процес припинення роботи Podʼів з низьким {{< glossary_tooltip text="пріоритетом" term_id="pod-priority" >}}, щоб Podʼи з вищим пріоритетом могли розміщуватися на вузлах. Виселення — це процес проактивного припинення роботи одного або кількох Podʼів на вузлах.

## Планування {#scheduling}

* [Планувальник Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Витрати ресурсів на Pod](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Обмеження поширення топології Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Заплямованість та Толерантність](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Фреймворк планування](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Динамічне виділення ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Налаштування продуктивності планувальника](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Пакування ресурсів для розширених ресурсів](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Готовність планування Pod](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Функції, оголошені вузлом](/docs/concepts/scheduling-eviction/node-declared-features/)

## Переривання роботи Podʼа {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Пріоритет та Випередження Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Виселення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/)
