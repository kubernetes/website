---
title: Preemption
id: preemption
date: 2019-01-31
full_link: /docs/concepts/configuration/pod-priority-preemption/#preemption
short_description: >
  Kubernetes 中的抢占逻辑通过驱逐该节点上存在的低优先级 Pod 来帮助待处理的 Pod 找到合适的节点。

aka:
tags:
- operation
---
<!--
 Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.
-->

Kubernetes 中的抢占逻辑通过驱逐该节点上存在的低优先级 Pod 来帮助待处理的 Pod 找到合适的节点。

<!--more-->

<!--
If a Pod cannot be scheduled, the scheduler tries to [preempt](/docs/concepts/configuration/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
-->


如果无法调度 Pod，则调度程序会尝试[抢占](/docs/concepts/configuration/pod-priority-preemption/#preemption) 优先级较低的 Pod ，以便可以调度待处理的 Pod 。
