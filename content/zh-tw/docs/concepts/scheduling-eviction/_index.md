---
title: "調度、搶佔和驅逐"
weight: 95
content_type: concept
no_list: true
---
<!--
title: "Scheduling, Preemption and Eviction"
weight: 95
content_type: concept
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
在 Kubernetes 中，調度（scheduling）指的是確保 {{<glossary_tooltip text="Pod" term_id="pod">}}
匹配到合適的{{<glossary_tooltip text="節點" term_id="node">}}，
以便 {{<glossary_tooltip text="kubelet" term_id="kubelet">}} 能夠運行它們。
搶佔（Preemption）指的是終止低{{<glossary_tooltip text="優先級" term_id="pod-priority">}}的
Pod 以便高優先級的 Pod 可以調度到 Node 上的過程。
驅逐（Eviction）是在資源匱乏的節點上，主動讓一個或多個 Pod 失效的過程。

<!--
## Scheduling

* [Kubernetes Scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Assigning Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Scheduler Performance Tuning](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Resource Bin Packing for Extended Resources](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
-->
## 調度   {#scheduling}

* [Kubernetes 調度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* [將 Pod 指派到節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
* [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [調度器性能調試](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [擴展資源的資源裝箱](/zh-cn/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Pod 調度就緒](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)

<!--
## Pod Disruption

* [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/)
-->
## Pod 干擾   {#pod-disruption}

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Pod 優先級和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API 發起的驅逐](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)
