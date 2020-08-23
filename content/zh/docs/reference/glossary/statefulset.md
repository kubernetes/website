---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /zh/docs/concepts/workloads/controllers/statefulset/
short_description: >
 StatefulSet 用来管理 Deployment 和伸缩一组 Pod，并且能为这些 Pod 提供*序号和唯一性保证*。
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
full_link: /zh/docs/concepts/workloads/controllers/statefulset/
short_description: >
  Manages the deployment and scaling of a set of Pods, *and provides guarantees about the ordering and uniqueness* of these Pods.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
-->

 StatefulSet 用来管理 Deployment 和扩展一组 Pod，并且能为这些 Pod 提供*序号和唯一性保证*。
 
<!--more--> 

<!--
Like a {{< glossary_tooltip term_id="deployment" >}}, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable&#58; each has a persistent identifier that it maintains across any rescheduling.
-->

和 {{< glossary_tooltip term_id="Deployment" >}} 相同的是，StatefulSet 管理了基于相同容器定义的一组 Pod。但和 Deployment 不同的是，StatefulSet 为它们的每个 Pod 维护了一个固定的 ID。这些 Pod 是基于相同的声明来创建的，但是不能相互替换：无论怎么调度，每个 Pod 都有一个永久不变的 ID。

<!--
A StatefulSet operates under the same pattern as any other Controller. You define your desired state in a StatefulSet *object*, and the StatefulSet *controller* makes any necessary updates to get there from the current state.
-->

StatefulSet 和其他控制器使用相同的工作模式。你在 StatefulSet *对象* 中定义你期望的状态，然后 StatefulSet 的 *控制器* 就会通过各种更新来达到那种你想要的状态。

