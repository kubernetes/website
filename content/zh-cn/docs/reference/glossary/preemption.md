---
title: 抢占（Preemption）
id: preemption
date: 2019-01-31
full_link: /zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Kubernetes 中的抢占逻辑通过驱逐节点上的低优先级 Pod 来帮助悬决的
  Pod 找到合适的节点。

aka:
tags:
- operation
---

<!--
title: Preemption
id: preemption
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.

aka:
tags:
- operation
-->
<!--
 Preemption logic in Kubernetes helps a pending {{< glossary_tooltip term_id="pod" >}} to find a suitable {{< glossary_tooltip term_id="node" >}} by evicting low priority Pods existing on that Node.
-->
Kubernetes 中的抢占逻辑通过驱逐{{< glossary_tooltip term_id="node" >}}
上的低优先级{{< glossary_tooltip term_id="pod" >}}
来帮助悬决的 Pod 找到合适的节点。

<!--more-->

<!--
If a Pod cannot be scheduled, the scheduler tries to [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
-->
如果一个 Pod 无法调度，调度器会尝试
[抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
较低优先级的 Pod，以使得悬决的 Pod 有可能被调度。

