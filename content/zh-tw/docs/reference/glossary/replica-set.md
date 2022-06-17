---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet 是下一代副本控制器。

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
full_link: /zh-cn/docs/concepts/workloads/controllers/replicaset/
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

ReplicaSet 是下一代副本控制器。

<!--more--> 

<!--
ReplicaSet, like ReplicationController, ensures that a specified number of pods replicas are running at one time. ReplicaSet supports the new set-based selector requirements as described in the labels user guide, whereas a Replication Controller only supports equality-based selector requirements.
-->

ReplicaSet 就像 ReplicationController 那樣，確保一次執行指定數量的 Pod 副本。ReplicaSet 支援新的基於集合的選擇器需求（在標籤的使用者指南中有相關描述），而副本控制器只支援基於等值的選擇器需求。
