---
title: "Harmonogramowanie, pierszeństwo i eksmisja"
weight: 95
content_type: concept
no_list: true
---

W Kubernetesie, planowanie odnosi się do zapewnienia, że
{{<glossary_tooltip text="Pody" term_id="pod">}} są dopasowane do {{<glossary_tooltip text="Węzłów" term_id="node">}},
aby {{<glossary_tooltip text="kubelet" term_id="kubelet">}} mógł je uruchomić. Pierszeństwo (ang.
preemption) to proces zakończania Podów z niższym
{{<glossary_tooltip text="Priorytetem" term_id="pod-priority">}} po to, aby Pody z wyższym Priorytetem mogły być
zaplanowane na Węzłach. Eksmisja (ang. eviction) to proces zakończania jednego lub więcej Podów na Węzłach.

## Harmonogramowanie {#scheduling}

* [Scheduler Kubernetesa](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Przypisywanie Podów do Węzłów](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Narzut na utrzymanie poda (ang. Pod overhead)](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Reguły rozmieszczenia Podów w klastrze](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Reguły wykluczania i dopuszczania podów](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Dynamiczne przydzielanie zasobów](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Tuning wydajności schedulera](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Pakowanie zasobów (Bin Packing) dla niestandardowych zasobów klastra](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Gotowość do planowania Podów](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)

## Zakłócenia w działaniu Podów {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Priorytet poda i wywłaszczenie](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Usuwanie z powodu presji na węzeł](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [Usunięcie zainicjowane przez API](/docs/concepts/scheduling-eviction/api-eviction/)
