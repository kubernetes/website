---
title: Istio
id: istio
date: 2018-04-12
full_link: https://istio.io/docs/concepts/what-is-istio/
short_description: >
  Istio 是個開放平臺（非 Kubernetes 特有），提供了一種統一的方式來整合微服務、管理流量、實施策略和彙總度量資料。
aka: 
tags:
- networking
- architecture
- extension
---

<!--
---
title: Istio
id: istio
date: 2018-04-12
full_link: https://istio.io/docs/concepts/what-is-istio/
short_description: >
  An open platform (not Kubernetes-specific) that provides a uniform way to integrate microservices, manage traffic flow, enforce policies, and aggregate telemetry data.

aka: 
tags:
- networking
- architecture
- extension
---
-->

<!--
 An open platform (not Kubernetes-specific) that provides a uniform way to integrate microservices, manage traffic flow, enforce policies, and aggregate telemetry data.
-->

Istio 是個開放平臺（非 Kubernetes 特有），提供了一種統一的方式來整合微服務、管理流量、實施策略和彙總度量資料。

<!--more--> 

<!--
Adding Istio does not require changing application code. It is a layer of infrastructure between a service and the network, which when combined with service deployments, is commonly referred to as a service mesh. Istio's control plane abstracts away the underlying cluster management platform, which may be Kubernetes, Mesosphere, etc.
-->

新增 Istio 時不需要修改應用程式碼。它是基礎設施的一層，介於服務和網路之間。
當它和服務的 Deployment 相結合時，就構成了通常所謂的服務網格（Service Mesh）。
Istio 的控制面抽象掉了底層的叢集管理平臺，這一叢集管理平臺可以是 Kubernetes、Mesosphere 等。

