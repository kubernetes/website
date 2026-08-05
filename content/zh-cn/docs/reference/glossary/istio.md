---
title: Istio
id: istio
date: 2018-04-12
full_link: https://istio.io/latest/about/service-mesh/#what-is-istio
short_description: >
  Istio 是一个（非 Kubernetes 特有的）开放平台，提供了一种统一的方式来集成微服务、管理流量、实施策略和汇总度量数据。
aka: 
tags:
- networking
- architecture
- extension
---
<!--
title: Istio
id: istio
date: 2018-04-12
full_link: https://istio.io/latest/about/service-mesh/#what-is-istio
short_description: >
  An open platform (not Kubernetes-specific) that provides a uniform way to integrate microservices, manage traffic flow, enforce policies, and aggregate telemetry data.

aka: 
tags:
- networking
- architecture
- extension
-->

<!--
 An open platform (not Kubernetes-specific) that provides a uniform way to integrate microservices, manage traffic flow, enforce policies, and aggregate telemetry data.
-->
Istio 是一个（非 Kubernetes 特有的）开放平台，提供了一种统一的方式来集成微服务、管理流量、实施策略和汇总度量数据。

<!--more--> 

<!--
Adding Istio does not require changing application code. It is a layer of infrastructure between a service and the network, which when combined with service deployments, is commonly referred to as a service mesh. Istio's control plane abstracts away the underlying cluster management platform, which may be Kubernetes, Mesosphere, etc.
-->
添加 Istio 时不需要修改应用代码。它是基础设施的一层，介于服务和网络之间。
当它和服务的 Deployment 相结合时，就构成了通常所谓的服务网格（Service Mesh）。
Istio 的控制面抽象掉了底层的集群管理平台，这一集群管理平台可以是 Kubernetes、Mesosphere 等。
