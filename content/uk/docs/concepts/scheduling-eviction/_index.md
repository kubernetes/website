---
title: "Планування, Випередження та Вивільнення"
weight: 95
content_type: concept
description: >
  У Kubernetes планування означає забезпечення відповідності робочих навантажень (Pods) вузлам (Nodes), щоб kubelet міг їх запустити. Випередження — це процес припинення роботи Podʼів з низьким пріоритетом, щоб Podʼи з вищим пріоритетом могли розміщуватися на вузлах. Вивільнення — це процес проактивного припинення роботи одного або кількох Podʼів на вузлах з нестачею ресурсів.
no_list: true
---

У Kubernetes планування означає забезпечення відповідності {{< glossary_tooltip text="Podʼів" term_id="pod" >}} вузлам ({{< glossary_tooltip text="Nodes" term_id="node" >}}), щоб {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} міг їх запустити. Випередження — це процес припинення роботи Podʼів з низьким {{< glossary_tooltip text="пріоритетом" term_id="pod-priority" >}}, щоб Podʼи з вищим пріоритетом могли розміщуватися на вузлах. Вивільнення — це процес проактивного припинення роботи одного або кількох Podʼів на вузлах.

## Планування {#scheduling}

* [Планувальник Kubernetes](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Витрати ресурсів на Pod](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Топологія обмежень розподілу Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Заплямованість та Толерантність](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Фреймворк планування](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Динамічний розподіл ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Налаштування продуктивності планувальника](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Пакування ресурсів для розширених ресурсів](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Готовність планування Pod](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)

## Переривання роботи Podʼу {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Пріоритет та Випередження Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Вивільнення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Вивільнення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/)
