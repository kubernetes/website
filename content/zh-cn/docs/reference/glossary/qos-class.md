---
title: QoS 类（QoS Class）
id: qos-class
date: 2019-04-15
full_link: /zh-cn/docs/concepts/workloads/pods/pod-qos/
short_description: >
  QoS 类（Quality of Service Class）为 Kubernetes 提供了一种将集群中的 Pod 分为几个类并做出有关调度和驱逐决策的方法。

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod

---
<!--
---
title: QoS Class
id: qos-class
date: 2019-04-15
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  QoS Class (Quality of Service Class) provides a way for Kubernetes to classify pods within the cluster into several classes and make decisions about scheduling and eviction.
aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod

---
-->

<!--
 QoS Class (Quality of Service Class) provides a way for Kubernetes to classify Pods within the cluster into several classes and make decisions about scheduling and eviction.
-->
 QoS Class（Quality of Service Class）为 Kubernetes 提供了一种将集群中的 Pod
 分为几个类并做出有关调度和驱逐决策的方法。

<!--more--> 

<!--
QoS Class of a Pod is set at creation time  based on its compute resources requests and limits settings. QoS classes are used to make decisions about Pods scheduling and eviction.
Kubernetes can assign one of the following  QoS classes to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.
-->
Pod 的 QoS 类是基于 Pod 在创建时配置的计算资源请求和限制。QoS 类用于制定有关 Pod 调度和逐出的决策。
Kubernetes 可以为 Pod 分配以下 QoS 类：`Guaranteed`，`Burstable` 或者 `BestEffort`。