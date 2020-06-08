---
reviewers:
- bowei
- freehan
title: Enabling EndpointSlices
content_type: task
---

<!-- overview -->
This page provides an overview of enabling EndpointSlices in Kubernetes.



## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Introduction

EndpointSlices provide a scalable and extensible alternative to Endpoints in
Kubernetes. They build on top of the base of functionality provided by Endpoints
and extend that in a scalable way. When Services have a large number (>100) of
network endpoints, they will be split into multiple smaller EndpointSlice
resources instead of a single large Endpoints resource.

## Enabling EndpointSlices

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

{{< note >}}
Although EndpointSlices may eventually replace Endpoints, many Kubernetes
components still rely on Endpoints. For now, enabling EndpointSlices should be
seen as an addition to Endpoints in a cluster, not a replacement for them.
{{< /note >}}

EndpointSlice functionality in Kubernetes is made up of several different
components, most are enabled by default:
* _The EndpointSlice API_: EndpointSlices are part of the
  `discovery.k8s.io/v1beta1` API. This is beta and enabled by default since
  Kubernetes 1.17. All components listed below are dependent on this API being
  enabled.
* _The EndpointSlice Controller_: This {{< glossary_tooltip text="controller"
  term_id="controller" >}} maintains EndpointSlices for Services and the Pods
  they reference. This is controlled by the `EndpointSlice` feature gate. It has
  been enabled by default since Kubernetes 1.18.
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

## Using EndpointSlices

With EndpointSlices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, EndpointSlices include new bits of information
such as topology. They will allow for greater scalability and extensibility of
network endpoints in your cluster.

## {{% heading "whatsnext" %}}


* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)


