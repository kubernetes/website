---
title: "スケジューリング、プリエンプションと退避"
weight: 95
content_type: concept
no_list: true
---

Kubernetesにおいてスケジューリングとは、稼働させたい{{<glossary_tooltip text="Pod" term_id="pod">}}を{{<glossary_tooltip text="ノード" term_id="node">}}にマッチさせ、{{<glossary_tooltip text="kubelet" term_id="kubelet">}}が実行できるようにすることを指します。
プリエンプションは、{{<glossary_tooltip text="優先度" term_id="pod-priority">}}の低いPodを終了させて、より優先度の高いPodがノード上でスケジュールできるようにするプロセスです。
退避とは、リソース不足のノードで1つ以上のPodを積極的に終了させるプロセスです。

## スケジューリング {#scheduling}

* [Kubernetesのスケジューラー](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [ノード上へのPodのスケジューリング](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Podのオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [TaintとToleration](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [スケジューリングフレームワーク](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [スケジューラーのパフォーマンスチューニング](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [拡張リソースのリソースビンパッキング](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [PodGroup Scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [Gangスケジューリング](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Topology-aware Scheduling](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [Workload-Aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/)

## Pod Disruption {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [ノードの圧迫による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [APIを起点とした退避](/docs/concepts/scheduling-eviction/api-eviction/)
