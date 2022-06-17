---
title: 排程，搶佔和驅逐
weight: 90
content_type: concept
description: >
  在Kubernetes中，排程 (scheduling) 指的是確保 Pods 匹配到合適的節點，
  以便 kubelet 能夠執行它們。搶佔 (Preemption) 指的是終止低優先順序的 Pods 以便高優先順序的 Pods 可以
  排程執行的過程。驅逐 (Eviction) 是在資源匱乏的節點上，主動讓一個或多個 Pods 失效的過程。
no_list: true
---

<!--
title: "Scheduling, Preemption and Eviction"
weight: 90
content_type: concept
description: >
  In Kubernetes, scheduling refers to making sure that Pods are matched to Nodes
  so that the kubelet can run them. Preemption is the process of terminating
  Pods with lower Priority so that Pods with higher Priority can schedule on
  Nodes. Eviction is the process of proactively terminating one or more Pods on
  resource-starved Nodes.
no_list: true
-->

<!--
In Kubernetes, scheduling refers to making sure that {{<glossary_tooltip text="Pods" term_id="pod">}}
are matched to {{<glossary_tooltip text="Nodes" term_id="node">}} so that the
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} can run them. Preemption
is the process of terminating Pods with lower {{<glossary_tooltip text="Priority" term_id="pod-priority">}}
so that Pods with higher Priority can schedule on Nodes. Eviction is the process
of terminating one or more Pods on Nodes.
-->

<!-- ## Scheduling -->

## 排程

* [Kubernetes 排程器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* [將 Pods 指派到節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
* [汙點和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [排程框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework)
* [排程器的效能除錯](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [擴充套件資源的資源裝箱](/zh-cn/docs/concepts/scheduling-eviction/resource-bin-packing/)

<!-- ## Pod Disruption -->

## Pod 干擾

* [Pod 優先順序和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [API發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)
