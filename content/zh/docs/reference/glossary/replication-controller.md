---
title: 副本控制器
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  副本控制器是 Kubernetes 的一种服务，它确保 Pod 一直按照声明的实例数量来运行。

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

副本控制器是 Kubernetes 的一种服务，它确保 Pod 一直按照声明的实例数量来运行。

<!--more--> 

<!--
Will automatically add or remove running instances of a pod, based on a set value for that pod. Allows the pod to return to the defined number of instances if pods are deleted or if too many are started by mistake.
-->

副本控制器会基于预先设置的数值自动增删 Pod 的实例。如果 Pod 被用户删除或者用户误操作启动了过多的 Pod 实例，副本控制器允许 Pod 的实例数恢复到预先定义的数值。
