---
title: QoS 類（QoS Class）
id: qos-class
date: 2019-04-15
full_link: /zh-cn/docs/concepts/workloads/pods/pod-qos/
short_description: >
  QoS 類（Quality of Service Class）爲 Kubernetes 提供了一種將集羣中的 Pod 分爲幾個類並做出有關調度和驅逐決策的方法。

aka: 
tags:
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
- fundamental
- architecture
related:
 - pod

---
-->

<!--
 QoS Class (Quality of Service Class) provides a way for Kubernetes to classify Pods within the cluster into several classes and make decisions about scheduling and eviction.
-->
 QoS Class（Quality of Service Class）爲 Kubernetes 提供了一種將集羣中的 Pod
 分爲幾個類並做出有關調度和驅逐決策的方法。

<!--more--> 

<!--
QoS Class of a Pod is set at creation time  based on its compute resources requests and limits settings. QoS classes are used to make decisions about Pods scheduling and eviction.
Kubernetes can assign one of the following  QoS classes to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.
-->
Pod 的 QoS 類是基於 Pod 在創建時配置的計算資源請求和限制。QoS 類用於制定有關 Pod 調度和逐出的決策。
Kubernetes 可以爲 Pod 分配以下 QoS 類：`Guaranteed`，`Burstable` 或者 `BestEffort`。