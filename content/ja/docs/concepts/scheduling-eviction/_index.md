---
title: "スケジューリング、プリエンプションと退避"
weight: 95
description: >
  Kubernetesにおいてスケジューリングとは、稼働させたいPodをノードにマッチさせ、kubeletが実行できるようにすることを指します。
  プリエンプションは、優先度の低いPodを終了させて、より優先度の高いPodがノード上でスケジュールできるようにするプロセスです。
  退避(eviction)とは、リソース不足のノードで1つ以上のPodを積極的に終了させるプロセスです。
no_list: true
---

Kubernetesにおいてスケジューリングとは、稼働させたい{{<glossary_tooltip text="Pod" term_id="pod">}}を{{<glossary_tooltip text="ノード" term_id="node">}}にマッチさせ、{{<glossary_tooltip text="kubelet" term_id="kubelet">}}が実行できるようにすることを指します。
プリエンプションは、{{<glossary_tooltip text="優先度" term_id="pod-priority">}}の低いPodを終了させて、より優先度の高いPodがノード上でスケジュールできるようにするプロセスです。
退避とは、リソース不足のノードで1つ以上のPodを積極的に終了させるプロセスです。

## スケジューリング

* [Kubernetesのスケジューラー](/ja/docs/concepts/scheduling-eviction/kube-scheduler/)
* [ノード上へのPodのスケジューリング](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Podのオーバーヘッド](/ja/docs/concepts/scheduling-eviction/pod-overhead/)
* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [スケジューリングフレームワーク](/ja/docs/concepts/scheduling-eviction/scheduling-framework)
* [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [スケジューラーのパフォーマンスチューニング](/ja/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [拡張リソースのリソースビンパッキング](/ja/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)

## Pod Disruption

* [Podの優先度とプリエンプション](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [APIを起点とした退避](/ja/docs/concepts/scheduling-eviction/api-eviction/)
