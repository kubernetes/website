---
title: 端点切片（Endpoint Slices）
feature:
  title: 端点切片
  description: >
    Kubernetes 集群中网络端点的可扩展跟踪。

content_type: concept
weight: 10
---

<!--
title: Endpoint Slices
feature:
  title: Endpoint Slices
  description: >
    Scalable tracking of network endpoints in a Kubernetes cluster.

content_type: concept
weight: 10
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
_Endpoint Slices_ provide a simple way to track network endpoints within a
Kubernetes cluster. They offer a more scalable and extensible alternative to
Endpoints.
-->
_端点切片（Endpoint Slices）_ 提供了一种简单的方法来跟踪 Kubernetes 集群中的网络端点
（network endpoints）。它们为 Endpoints 提供了一种可伸缩和可拓展的替代方案。

<!-- body -->

<!--
## Endpoint Slice resources {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The EndpointSlice controller automatically creates Endpoint Slices
for a Kubernetes Service when a selector is specified. These Endpoint Slices
will include references to any Pods that match the Service selector. Endpoint
Slices group network endpoints together by unique Service and Port combinations.

As an example, here's a sample EndpointSlice resource for the `example`
Kubernetes Service.
-->
## Endpoint Slice 资源 {#endpointslice-resource}

在 Kubernetes 中，`EndpointSlice` 包含对一组网络端点的引用。
指定选择器后，EndpointSlice 控制器会自动为 Kubernetes 服务创建 EndpointSlice。
这些 EndpointSlice 将包含对与服务选择器匹配的所有 Pod 的引用。EndpointSlice 通过唯一的服务和端口组合将网络端点组织在一起。

例如，这里是 Kubernetes服务 `example` 的示例 EndpointSlice 资源。

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
    - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

<!--
By default, Endpoint Slices managed by the EndpointSlice controller will have no
more than 100 endpoints each. Below this scale, Endpoint Slices should map 1:1
with Endpoints and Services and have similar performance.

Endpoint Slices can act as the source of truth for kube-proxy when it comes to
how to route internal traffic. When enabled, they should provide a performance
improvement for services with large numbers of endpoints.
-->
默认情况下，由 EndpointSlice 控制器管理的 Endpoint Slice 将有不超过 100 个端点。
低于此比例时，Endpoint Slices 应与 Endpoints 和服务进行 1:1 映射，并具有相似的性能。

当涉及如何路由内部流量时，Endpoint Slices 可以充当 kube-proxy 的真实来源。
启用该功能后，在服务的 endpoints 规模庞大时会有可观的性能提升。

<!--
## Address Types

EndpointSlices support three address types:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)
-->
## 地址类型

EndpointSlice 支持三种地址类型：

* IPv4
* IPv6
* FQDN (完全合格的域名)

<!--
## Motivation

The Endpoints API has provided a simple and straightforward way of
tracking network endpoints in Kubernetes. Unfortunately as Kubernetes clusters
and Services have gotten larger, limitations of that API became more visible.
Most notably, those included challenges with scaling to larger numbers of
network endpoints.

Since all network endpoints for a Service were stored in a single Endpoints
resource, those resources could get quite large. That affected the performance
of Kubernetes components (notably the master control plane) and resulted in
significant amounts of network traffic and processing when Endpoints changed.
Endpoint Slices help you mitigate those issues as well as provide an extensible
platform for additional features such as topological routing.
-->
## 动机

Endpoints API 提供了一种简单明了的方法在 Kubernetes 中跟踪网络端点。
不幸的是，随着 Kubernetes 集群与服务的增长，该 API 的局限性变得更加明显。
最值得注意的是，这包含了扩展到更多网络端点的挑战。

由于服务的所有网络端点都存储在单个 Endpoints 资源中，
因此这些资源可能会变得很大。
这影响了 Kubernetes 组件（尤其是主控制平面）的性能，并在 Endpoints 
发生更改时导致大量网络流量和处理。
Endpoint Slices 可帮助您缓解这些问题并提供可扩展的
附加特性（例如拓扑路由）平台。

## {{% heading "whatsnext" %}}

<!--
* [Enabling Endpoint Slices](/docs/tasks/administer-cluster/enabling-endpoint-slices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* [启用端点切片](/zh/docs/tasks/administer-cluster/enabling-endpointslices)
* 阅读[使用服务链接应用](/zh/docs/concepts/services-networking/connect-applications-service/)

