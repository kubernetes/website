---
title: 开启服务拓扑
content_type: task
---

<!-- overview -->
<!--
This page provides an overview of enabling Service Topology in Kubernetes.
-->
本页面提供了在 Kubernetes 中启用服务拓扑的概述。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
<!--
## Introduction

_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->
## 介绍

_服务拓扑（Service Topology）_ 使服务能够根据集群中的 Node 拓扑来路由流量。
比如，服务可以指定将流量优先路由到与客户端位于同一节点或者同一可用区域的端点上。

<!--
## Prerequisites

The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes 1.17 or later
   * {{< glossary_tooltip text="Kube-proxy" term_id="kube-proxy" >}} running in iptables mode or IPVS mode
   * Enable [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/)
-->
## 先决条件

需要下面列的先决条件，才能启用拓扑感知的服务路由：

   * Kubernetes 1.17 或更新版本
   * {{< glossary_tooltip text="Kube-proxy" term_id="kube-proxy" >}} 以 iptables 或者 IPVS 模式运行
   * 启用[端点切片](/zh/docs/concepts/services-networking/endpoint-slices/)

<!--
## Enable Service Topology

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

To enable service topology, enable the `ServiceTopology` and `EndpointSlice` feature gate for all Kubernetes components:
-->
## 启用服务拓扑

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

要启用服务拓扑功能，需要为所有 Kubernetes 组件启用 `ServiceTopology` 和 `EndpointSlice` 特性门控：

```
--feature-gates="ServiceTopology=true,EndpointSlice=true"
```


## {{% heading "whatsnext" %}}

<!--
* Read about the [Service Topology](/docs/concepts/services-networking/service-topology) concept
* Read about [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 阅读[服务拓扑](/zh/docs/concepts/services-networking/service-topology)概念
* 阅读[端点切片](/zh/docs/concepts/services-networking/endpoint-slices)
* 阅读[通过服务来连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)