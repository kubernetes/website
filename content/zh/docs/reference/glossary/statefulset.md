---
title: 状态集（StatefulSet）
id: statefulset
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/statefulset/
short_description: >
 StatefulSet 用来管理部署和伸缩一组 Pod，包括这些 Pod 的持久存储和持久标识符。
aka: 
tags:
- fundamental
- core-object
- workload
- storage
---

<!--
---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
-->

<!--
 Manages the deployment and scaling of a set of {{< glossary_tooltip text="Pods" term_id="pod" >}}, *and provides guarantees about the ordering and uniqueness* of these Pods.
-->
 StatefulSet 用来管理部署和伸缩一组 {{< glossary_tooltip text="Pod" term_id="pod" >}}，包括这些 Pod 的持久存储和持久标识符。
 
<!--more--> 

<!--
Like a {{< glossary_tooltip term_id="deployment" >}}, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable&#58; each has a persistent identifier that it maintains across any rescheduling.
-->

和 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 相同的是，StatefulSet 管理了基于相同容器定义的一组 Pod。但和 Deployment 不同的是，StatefulSet 为它们的每个 Pod 维护了一个固定的 ID。这些 Pod 是基于相同的声明来创建的，但是不能相互替换：无论怎么调度，每个 Pod 都有一个永久不变的 ID。

<!--
If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.
-->

如果希望使用存储卷为工作负载提供持久性，可以使用状态集作为解决方案的一部分。尽管状态完整集中的单个Pod很容易出现故障，但持久的Pod标识符使得将现有卷与替换任何出现故障的新Pod相匹配变得更加容易。如果希望使用存储卷为工作负载提供持久性，可以使用状态集作为解决方案的一部分。尽管状态完整集中的单个Pod很容易出现故障，但持久的Pod标识符使得将现有卷与替换任何出现故障的新Pod相匹配变得更加容易。
