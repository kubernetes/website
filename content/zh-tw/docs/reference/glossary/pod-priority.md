---
title: Pod 優先順序（Pod Priority）
id: pod-priority
date: 2019-01-31
full_link: /zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority
short_description: >
  Pod 優先順序表示一個 Pod 相對於其他 Pod 的重要性。

aka:
tags:
- operation
---

<!--
title: Pod Priority
id: pod-priority
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority
short_description: >
  Pod Priority indicates the importance of a Pod relative to other Pods.

aka:
tags:
- operation
-->

<!--
 Pod Priority indicates the importance of a {{< glossary_tooltip term_id="pod" >}} relative to other Pods.
-->
 Pod 優先順序表示一個  {{< glossary_tooltip term_id="pod" >}} 相對於其他 Pod 的重要性。

<!--more-->

<!--
[Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) gives the ability to set scheduling priority of a Pod to be higher and lower than other Pods — an important feature for production clusters workload.
-->
[Pod 優先順序](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)
允許使用者為 Pod 設定高於或低於其他 Pod 的優先順序 -- 這對於生產叢集
工作負載而言是一個重要的特性。

