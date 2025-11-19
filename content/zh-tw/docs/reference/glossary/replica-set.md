---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet 確保一次運行指定數量的 Pod 副本。

aka: 
tags:
- fundamental
- core-object
- workload
---
<!--
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
 ReplicaSet ensures that a specified number of Pod replicas are running at one time

aka: 
tags:
- fundamental
- core-object
- workload
-->

<!--
 A ReplicaSet (aims to) maintain a set of replica Pods running at any given time.
-->
ReplicaSet（旨在）在任何給定時間確保運行一組 Pod 副本。

<!--more-->

<!--
Workload objects such as {{< glossary_tooltip term_id="deployment" >}} make use of ReplicaSets
to ensure that the configured number of {{< glossary_tooltip term_id="pod" text="Pods" >}} are
running in your cluster, based on the spec of that ReplicaSet.
-->
像 {{< glossary_tooltip term_id="deployment" >}} 這類工作負載對象利用 ReplicaSet
基於其規約來確保叢集中運行的 {{< glossary_tooltip term_id="pod" text="Pod" >}} 數量符合設定要求。
