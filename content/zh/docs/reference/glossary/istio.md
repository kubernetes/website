---
title: Istio
id: istio
date: 2018-04-12
full_link: https://istio.io/docs/concepts/what-is-istio/overview.html
short_description: >
  Istio 是个开放平台（非 Kubernetes特有），该平台提供了集成微服务、管理流量、执行策略、以及汇总遥测数据的统一方式。
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
full_link: https://istio.io/docs/concepts/what-is-istio/overview.html
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

Istio 是个开放平台（非 Kubernetes特有），该平台提供了集成微服务、管理流量、执行策略、以及汇总遥测数据的统一方式。

<!--more--> 

<!--
Adding Istio does not require changing application code. It is a layer of infrastructure between a service and the network, which when combined with service deployments, is commonly referred to as a service mesh. Istio's control plane abstracts away the underlying cluster management platform, which may be Kubernetes, Mesosphere, etc.
-->

增加 Istio 不需要修改应用代码。它是基础设施的一层，介于服务和网络之间。当它和服务的 Deployment 相结合时，通常是指服务网格。Istio 的控制平面抽象掉了底层的集群管理平台，可以是 Kubernetes、Mesosphere 等。

