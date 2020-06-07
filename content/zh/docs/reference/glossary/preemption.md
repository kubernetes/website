---
title: 抢占
id: preemption
date: 2019-01-31
full_link: /docs/concepts/configuration/pod-priority-preemption/#preemption
short_description: >
  Kubernetes 中的抢占逻辑通过驱逐节点上的低优先级 Pod 来帮助挂起的 Pod 找到合适的节点。

aka:
tags:
- operation
---

<!--
---
title: Preemption
id: preemption
date: 2019-01-31
full_link: /docs/concepts/configuration/pod-priority-preemption/#preemption
short_description: >
  Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.

aka:
tags:
- operation
---
-->
<!--
 Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.
-->
 Kubernetes 中的抢占逻辑通过驱逐节点上的低优先级 Pod 来帮助挂起的 Pod 找到合适的节点。

<!--more-->

<!--
If a Pod cannot be scheduled, the scheduler tries to [preempt](/docs/concepts/configuration/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
-->
如果一个 Pod 无法调度，调度器会尝试[抢占](/docs/concepts/configuration/pod-priority-preemption/#preemption)较低优先级的 Pod，以使得挂起的 Pod 可能被调度。