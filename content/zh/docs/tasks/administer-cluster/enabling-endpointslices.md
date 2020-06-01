---
reviewers:
- bowei
- freehan
title: 启用端点切片
content_type: task
---

<!--
---
reviewers:
- bowei
- freehan
title: Enabling Endpoint Slices
content_type: task
---
-->

<!-- overview -->

<!--
This page provides an overview of enabling Endpoint Slices in Kubernetes.
-->
本页提供启用 Kubernetes 端点切片的总览




## {{% heading "prerequisites" %}}


  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

<!--
## Introduction

Endpoint Slices provide a scalable and extensible alternative to Endpoints in
Kubernetes. They build on top of the base of functionality provided by Endpoints
and extend that in a scalable way. When Services have a large number (>100) of
network endpoints, they will be split into multiple smaller Endpoint Slice
resources instead of a single large Endpoints resource.
-->
## 介绍

端点切片为 Kubernetes 端点提供了可伸缩和可扩展的替代方案。它们建立在端点提供的功能基础之上，并以可伸缩的方式进行扩展。当服务具有大量（>100）网络端点，
它们将被分成多个较小的端点切片资源，而不是单个大型端点资源。

<!--
## Enabling Endpoint Slices
-->
## 启用端点切片
{{< feature-state for_k8s_version="v1.16" state="alpha" >}}


{{< note >}}
<!--
Although Endpoint Slices may eventually replace Endpoints, many Kubernetes
components still rely on Endpoints. For now, enabling Endpoint Slices should be
seen as an addition to Endpoints in a cluster, not a replacement for them.
-->

尽管端点切片最终可能会取代端点，但许多 Kubernetes 组件仍然依赖于端点。目前，启用端点切片应该被视为集群中端点的补充，而不是它们的替代。

{{< /note >}}

<!--
As an alpha feature, Endpoint Slices are not enabled by default in Kubernetes.
Enabling Endpoint Slices requires as many as 3 changes to Kubernetes cluster
configuration.

To enable the Discovery API group that includes Endpoint Slices, use the runtime
 config flag (`--runtime-config=discovery.k8s.io/v1alpha1=true`).

The logic responsible for watching services, pods, and nodes and creating or
updating associated Endpoint Slices lives within the EndpointSlice controller.
This is disabled by default but can be enabled with the controllers flag on
kube-controller-manager (`--controllers=endpointslice`).

For Kubernetes components like kube-proxy to actually start using Endpoint
Slices, the EndpointSlice feature gate will need to be enabled
(`--feature-gates=EndpointSlice=true`).
-->

作为 Alpha 功能，默认情况下，Kubernetes 中未启用端点切片。启用端点切片需要对 Kubernetes 集群进行多达 3 项配置修改。

要启用包括端点切片的 Discovery API 组，请使用运行时配置标志（`--runtime-config=discovery.k8s.io/v1alpha1=true`）。

该逻辑负责监视服务，pod 和节点以及创建或更新与之关联，在端点切片控制器内的端点切片。
默认情况下，此功能处于禁用状态，但可以通过启用在 kube-controller-manager 控制器的标志（`--controllers=endpointslice`）来开启。

对于像 kube-proxy 这样的 Kubernetes 组件真正开始使用端点切片，需要开启端点切片功能标志（`--feature-gates=EndpointSlice=true`）。

<!--
## Using Endpoint Slices

With Endpoint Slices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, Endpoint Slices should include new bits of
information such as topology. They will allow for greater scalability and
extensibility of network endpoints in your cluster.
-->

## 使用端点切片

在集群中完全启用端点切片的情况下，您应该看到对应的每个端点资源的端点切片资源。除了兼容现有的端点功能，端点切片应包括拓扑等新的信息。它们将使集群中网络端点具有更强的可伸缩性，可扩展性。