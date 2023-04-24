---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/statefulset/
short_description: >
  StatefulSet 用来管理某 Pod 集合的部署和扩缩，并为这些 Pod 提供持久存储和持久标识符。
aka: 
tags:
- fundamental
- core-object
- workload
- storage
---

<!--
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  A StatefulSet manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
-->

<!--
 Manages the deployment and scaling of a set of {{< glossary_tooltip text="Pods" term_id="pod" >}}, *and provides guarantees about the ordering and uniqueness* of these Pods.
-->
StatefulSet 用来管理某 {{< glossary_tooltip text="Pod" term_id="pod" >}} 集合的部署和扩缩，
并为这些 Pod 提供持久存储和持久标识符。 
<!--more--> 

<!--
Like a {{< glossary_tooltip term_id="deployment" >}}, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of its Pods. These pods are created from the same spec, but are not interchangeable&#58; each has a persistent identifier that it maintains across any rescheduling.
-->

和 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 类似，
StatefulSet 管理基于相同容器规约的一组 Pod。但和 Deployment 不同的是，
StatefulSet 为它们的每个 Pod 维护了一个有粘性的 ID。这些 Pod 是基于相同的规约来创建的，
但是不能相互替换：无论怎么调度，每个 Pod 都有一个永久不变的 ID。
<!--
If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.
-->

如果希望使用存储卷为工作负载提供持久存储，可以使用 StatefulSet 作为解决方案的一部分。
尽管 StatefulSet 中的单个 Pod 仍可能出现故障，
但持久的 Pod 标识符使得将现有卷与替换已失败 Pod 的新 Pod 相匹配变得更加容易。