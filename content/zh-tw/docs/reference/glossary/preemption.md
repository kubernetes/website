---
title: 搶佔（Preemption）
id: preemption
date: 2019-01-31
full_link: /zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Kubernetes 中的搶佔邏輯通過驅逐節點上的低優先級 Pod 來幫助懸決的
  Pod 找到合適的節點。

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
Kubernetes 中的搶佔邏輯通過驅逐{{< glossary_tooltip term_id="node" >}}
上的低優先級{{< glossary_tooltip term_id="pod" >}}
來幫助懸決的 Pod 找到合適的節點。

<!--more-->

<!--
If a Pod cannot be scheduled, the scheduler tries to [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
-->
如果一個 Pod 無法調度，調度器會嘗試
[搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
較低優先級的 Pod，以使得懸決的 Pod 有可能被調度。

