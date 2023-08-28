---
title: 关键插件 Pod 的调度保证
content_type: concept
weight: 220
---
<!--
reviewers:
- davidopp
- filipg
- piosz
title: Guaranteed Scheduling For Critical Add-On Pods
content_type: concept
weight: 220
-->

<!-- overview -->

<!-- 
Kubernetes core components such as the API server, scheduler, and controller-manager run on a control plane node. However, add-ons must run on a regular cluster node.
Some of these add-ons are critical to a fully functional cluster, such as metrics-server, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).
-->
Kubernetes 核心组件（如 API 服务器、调度器、控制器管理器）在控制平面节点上运行。
但是插件必须在常规集群节点上运行。
其中一些插件对于功能完备的集群至关重要，例如 Heapster、DNS 和 UI。
如果关键插件被逐出（手动或作为升级等其他操作的副作用）或者变成挂起状态，集群可能会停止正常工作。
关键插件进入挂起状态的例子有：集群利用率过高；被逐出的关键插件 Pod 释放了空间，但该空间被之前悬决的
Pod 占用；由于其它原因导致节点上可用资源的总量发生变化。

<!--
Note that marking a pod as critical is not meant to prevent evictions entirely; it only prevents the pod from becoming permanently unavailable.
A static pod marked as critical can't be evicted. However, non-static pods marked as critical are always rescheduled.
-->
注意，把某个 Pod 标记为关键 Pod 并不意味着完全避免该 Pod 被逐出；它只能防止该 Pod 变成永久不可用。
被标记为关键性的静态 Pod 不会被逐出。但是，被标记为关键性的非静态 Pod 总是会被重新调度。

<!-- body -->

<!--
### Marking pod as critical
-->
### 标记关键 Pod

<!--
To mark a Pod as critical, set priorityClassName for that Pod to `system-cluster-critical` or `system-node-critical`. `system-node-critical` is the highest available priority, even higher than `system-cluster-critical`.
-->
要将 Pod 标记为关键性（critical），设置 Pod 的 priorityClassName 为 `system-cluster-critical` 或者 `system-node-critical`。
`system-node-critical` 是最高级别的可用性优先级，甚至比 `system-cluster-critical` 更高。
