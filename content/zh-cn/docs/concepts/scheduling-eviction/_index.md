---
title: 调度，抢占和驱逐
weight: 90
content_type: concept
description: >
  在Kubernetes中，调度 (scheduling) 指的是确保 Pods 匹配到合适的节点，
  以便 kubelet 能够运行它们。抢占 (Preemption) 指的是终止低优先级的 Pods 以便高优先级的 Pods 可以
  调度运行的过程。驱逐 (Eviction) 是在资源匮乏的节点上，主动让一个或多个 Pods 失效的过程。
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

## 调度

* [Kubernetes 调度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* [将 Pods 指派到节点](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod 开销](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
* [污点和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework)
* [调度器的性能调试](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [扩展资源的资源装箱](/zh-cn/docs/concepts/scheduling-eviction/resource-bin-packing/)

<!-- ## Pod Disruption -->

## Pod 干扰

* [Pod 优先级和抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [API发起的驱逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)
