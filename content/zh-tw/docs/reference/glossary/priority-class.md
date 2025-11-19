---
title: PriorityClass
id: priority-class
date: 2024-03-19
full_link: /zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  從類別名稱到 Pod 本身調度優先級的映射。
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
PriorityClass 是針對應分配給此類別 Pod 的調度優先級而命名的一種類別。

<!--more-->

<!--
A [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
is a non-namespaced object mapping a name to an integer priority, used for a Pod. The name is
specified in the `metadata.name` field, and the priority value in the `value` field. Priorities range from
-2147483648 to 1000000000 inclusive. Higher values indicate higher priority.
-->
[PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
是用於 Pod 的一個非命名空間對象，負責將某個名稱映射到一個整數優先級。
此名稱在 `metadata.name` 字段中指定，優先級值在 `value` 字段中指定。
優先級範圍從 -2147483648 到 1000000000（包含邊界值）。
值越大，優先級越高。
