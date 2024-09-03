---
title: Spec
id: spec
date: 2023-12-17
full_link: /zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  在 Kubernetes 清单中的此字段用来定义特定 Kubernetes 对象的预期状态或预期配置。

aka:
tags:
- fundamental
- architecture
---
<!--
title: Spec
id: spec
date: 2023-12-17
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  This field in Kubernetes manifests defines the desired state or configuration for specific Kubernetes objects.

aka:
tags:
- fundamental
- architecture
-->

<!--
Defines how each object, like Pods or Services, should be configured and its desired state.
-->
定义 Pod 或 Service 这类每种对象应被如何配置及其预期状态。

<!--more-->

<!--
Almost every Kubernetes object includes two nested object fields that govern the object's configuration: the object spec and the object status. For objects that have a spec, you have to set this when you create the object, providing a description of the characteristics you want the resource to have: its desired state.
-->
几乎每个 Kubernetes 对象都包含两个嵌套的对象字段，用于治理对象本身的配置：
对象规约（spec）和对象状态（status）。
对于具有规约的对象，你必须在创建对象时设置规约，并提供资源所需特征的描述：即其预期状态。

<!--
It varies for different objects like Pods, StatefulSets, and Services, detailing settings such as containers, volumes, replicas, ports,   
and other specifications unique to each object type. This field encapsulates what state Kubernetes should maintain for the defined   
object.
-->
此字段对于 Pod、StatefulSet 和 Service 等不同对象会有所差异，
字段详细说明如容器、卷、副本、端口等设置以及每种对象特有的其他规约。
此字段封装了 Kubernetes 针对所定义的对象应保持何种状态。
