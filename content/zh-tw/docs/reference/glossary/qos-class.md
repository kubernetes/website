---
title: QoS 類（QoS Class）
id: qos-class
date: 2019-04-15
full_link: 
short_description: >
 QoS 類（Quality of Service Class）為 Kubernetes 提供了一種將叢集中的 Pod 分為幾個類並做出有關排程和驅逐決策的方法。

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
full_link: 
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

 QoS Class（Quality of Service Class）為 Kubernetes 提供了一種將叢集中的 Pod 分為幾個型別並做出有關排程和驅逐決策的方法。

<!--more--> 

<!--
QoS Class of a Pod is set at creation time  based on its compute resources requests and limits settings. QoS classes are used to make decisions about Pods scheduling and eviction.
Kubernetes can assign one of the following  QoS classes to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.
-->
Pod 的 QoS 類是基於 Pod 在建立時配置的計算資源請求和限制。QoS 類用於制定有關 Pod 排程和逐出的決策。
Kubernetes 可以為 Pod 分配以下 QoS 類：`Guaranteed`，`Burstable` 或者 `BestEffort`。