---
reviewers:
title: 启用 EndpointSlices
content_type: task
---

<!--
reviewers:
- bowei
- freehan
title: Enabling EndpointSlices
content_type: task
-->

<!-- overview -->

<!--
This page provides an overview of enabling EndpointSlices in Kubernetes.
-->
本页提供启用 Kubernetes EndpointSlice 的总览。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Introduction

EndpointSlices provide a scalable and extensible alternative to Endpoints in
Kubernetes. They build on top of the base of functionality provided by Endpoints
and extend that in a scalable way. When Services have a large number (>100) of
network endpoints, they will be split into multiple smaller EndpointSlice
resources instead of a single large Endpoints resource.
-->
## 介绍

EndpointSlice （端点切片）为 Kubernetes Endpoints 提供了可伸缩和可扩展的替代方案。
它们建立在 Endpoints 提供的功能基础之上，并以可伸缩的方式进行扩展。
当 Service 具有大量（>100）网络端点时，它们将被分成多个较小的 EndpointSlice 资源，
而不是单个大型 Endpoints 资源。

<!--
## Enabling EndpointSlices
-->
## 启用 EndpointSlice

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

{{< note >}}
<!--
The EndpointSlice resource was designed to address shortcomings in a earlier
resource: Endpoints. Some Kubernetes components and third-party applications
continue to use and rely on Endpoints. Whilst that remains the case,
EndpointSlices should be seen as an addition to Endpoints in a cluster, not as
an outright replacement.
-->
EndpointSlice 资源旨在解决较早资源：Endpoints 中的缺点。一些 Kubernetes 组件和第三方应用程序
继续使用并依赖 Endpoints。既然情况如此，应该将 EndpointSlices 视为集群中 Endpoints 的补充，而不是
彻底替代。
{{< /note >}}

<!--
EndpointSlice functionality in Kubernetes is made up of several different
components, most are enabled by default:
-->
Kubernetes 中的 EndpointSlice 功能包含若干不同组件。它们中的大部分都是
默认被启用的：

<!--
* _The EndpointSlice API_: EndpointSlices are part of the
  `discovery.k8s.io/v1beta1` API. This is beta and enabled by default since
  Kubernetes 1.17. All components listed below are dependent on this API being
  enabled.
* _The EndpointSlice Controller_: This {{< glossary_tooltip text="controller"
  term_id="controller" >}} maintains EndpointSlices for Services and the Pods
  they reference. This is controlled by the `EndpointSlice` feature gate. It has
  been enabled by default since Kubernetes 1.18.
-->
* _EndpointSlice API_：EndpointSlice 隶属于 `discovery.k8s.io/v1beta1` API。
  此 API 处于 Beta 阶段，从 Kubernetes 1.17 开始默认被启用。
  下面列举的所有组件都依赖于此 API 被启用。
* _EndpointSlice 控制器_：此 {{< glossary_tooltip text="控制器" term_id="controller" >}}
  为 Service  维护 EndpointSlice 及其引用的 Pods。
  此控制器通过 `EndpointSlice` 特性门控控制。自从 Kubernetes 1.18 起，
  该特性门控默认被启用。

<!--
* _The EndpointSliceMirroring Controller_: This {{< glossary_tooltip
  text="controller" term_id="controller" >}} mirrors custom Endpoints to
  EndpointSlices. This is controlled by the `EndpointSlice` feature gate. It has
  been enabled by default since Kubernetes 1.19.
* _Kube-Proxy_: When {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy">}}
  is configured to use EndpointSlices, it can support higher numbers of Service
  endpoints. This is controlled by the `EndpointSliceProxying` feature gate on
  Linux and `WindowsEndpointSliceProxying` on Windows. It has been enabled by
  default on Linux since Kubernetes 1.19. It is not enabled by default for
  Windows nodes. To configure kube-proxy to use EndpointSlices on Windows, you
  can enable the `WindowsEndpointSliceProxying` [feature
  gate](/docs/reference/command-line-tools-reference/feature-gates/) on
  kube-proxy.
-->
* _EndpointSliceMirroring 控制器_：此 {{< glossary_tooltip text="控制器" term_id="controller" >}}
  将自定义的 Endpoints 映射为 EndpointSlice。
  控制器受 `EndpointSlice` 特性门控控制。该特性门控自 1.19 开始被默认启用。
* _kube-proxy_：当 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy">}}
  被配置为使用 EndpointSlice 时，它会支持更大数量的 Service 端点。
  此功能在 Linux 上受 `EndpointSliceProxying` 特性门控控制；在 Windows 上受
  `WindowsEndpointSliceProxying` 特性门控控制。
  在 Linux 上，从 Kubernetes 1.19 版本起自动启用。目前尚未在 Windows 节点
  上默认启用。
  要在 Windows 节点上配置 kube-proxy 使用 EndpointSlice，你需要为 kube-proxy 启用
  `WindowsEndpointSliceProxying`
  [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)。


<!--
## API fields

Some fields in the EndpointSlice API are feature-gated.

- The `EndpointSliceNodeName` feature gate controls access to the `nodeName`
  field. This is an alpha feature that is disabled by default.
- The `EndpointSliceTerminating` feature gate controls access to the `serving`
  and `terminating` condition fields. This is an alpha feature that is disabled
  by default.
-->
## API 字段

EndpointSlice API 中的某些字段有对应的特性门控控制。

- `EndpointSliceNodeName` 特征门控控制对 `nodeName` 字段的访问。这是默认情况下禁用的 Alpha 功能。
- `EndpointSliceTerminating` 特征门控控制对 `serving` 和 `terminating` 状况字段的访问。这是默认情况下禁用的 Alpha 功能。

<!--
## Using Endpoint Slices

With EndpointSlices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, EndpointSlices will allow for greater
scalability and extensibility of network endpoints in your cluster.
-->
## 使用 EndpointSlice

在集群中完全启用 EndpointSlice 的情况下，你应该看到对应于每个
Endpoints 资源的 EndpointSlice 资源。除了支持现有的 Endpoints 功能外，
EndpointSlices 将允许集群中网络端点更大的的可伸缩性和可扩展性。

<!--
## {{% heading "whatsnext" %}}


* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
## {{% heading "whatsnext" %}}


* 参阅 [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* 参阅 [将应用程序与服务连接](/docs/concepts/services-networking/connect-applications-service/)
