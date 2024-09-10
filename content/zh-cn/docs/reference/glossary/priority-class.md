---
title: PriorityClass
id: priority-class
date: 2024-03-19
full_link: /zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  从类别名称到 Pod 本身调度优先级的映射。
aka:
tags:
- core-object
---
<!--
title: PriorityClass
id: priority-class
date: 2024-03-19
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  A mapping from a class name to the scheduling priority that a Pod should have.
aka:
tags:
- core-object
-->

<!--
A PriorityClass is a named class for the scheduling priority that should be assigned to a Pod
in that class.
-->
PriorityClass 是针对应分配给此类别 Pod 的调度优先级而命名的一种类别。

<!--more-->

<!--
A [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
is a non-namespaced object mapping a name to an integer priority, used for a Pod. The name is
specified in the `metadata.name` field, and the priority value in the `value` field. Priorities range from
-2147483648 to 1000000000 inclusive. Higher values indicate higher priority.
-->
[PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
是用于 Pod 的一个非命名空间对象，负责将某个名称映射到一个整数优先级。
此名称在 `metadata.name` 字段中指定，优先级值在 `value` 字段中指定。
优先级范围从 -2147483648 到 1000000000（包含边界值）。
值越大，优先级越高。
