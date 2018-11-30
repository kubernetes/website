---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet 是下一代副本控制器（Replication Controller）。

aka: 
tags:
- fundamental
- core-object
- workload
---

<!--
---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet is the next-generation Replication Controller.

aka: 
tags:
- fundamental
- core-object
- workload
---
-->

<!--
 ReplicaSet is the next-generation Replication Controller.
-->

ReplicaSet 是下一代副本控制器（Replication Controller）。

<!--more--> 

<!--
ReplicaSet, like ReplicationController, ensures that a specified number of pods replicas are running at one time. ReplicaSet supports the new set-based selector requirements as described in the labels user guide, whereas a Replication Controller only supports equality-based selector requirements.
-->

ReplicaSet 就像 ReplicationController 那样，确保一次运行指定数量的 Pod 副本。ReplicaSet 支持新的基于集合的选择器需求（在标签的用户指南中有相关描述），而 ReplicationController 只支持基于相等的选择器需求。
