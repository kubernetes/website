---
title: 副本控制器（Replication Controller）
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  Replication Controller 是 Kubernetes 的一种服务，用来确保给定个数的 Pod 一直处于运行状态。

aka: 
tags:
- workload
- core-object
---

<!--
---
title: Replication Controller
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  Kubernetes service that ensures a specific number of instances of a pod are always running.

aka: 
tags:
- workload
- core-object
---
-->

<!--
 Kubernetes service that ensures a specific number of instances of a pod are always running.
-->

Replication Controller 是 Kubernetes 的一种服务，用来确保给定个数的 Pod 一直处于运行状态。

<!--more--> 

<!--
Will automatically add or remove running instances of a pod, based on a set value for that pod. Allows the pod to return to the defined number of instances if pods are deleted or if too many are started by mistake.
-->

Replication Controller 会基于设定值自动增删 Pod 的实例。如果 Pod 被误删除或者启动实例过多，Replication Controller 允许 Pod 的实例个数恢复到设定值。
