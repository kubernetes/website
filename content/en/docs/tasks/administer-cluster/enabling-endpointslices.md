---
reviewers:
- bowei
- freehan
title: Enabling EndpointSlices
content_template: templates/task
---

{{% capture overview %}}
This page provides an overview of enabling EndpointSlices in Kubernetes.
{{% /capture %}}


{{% capture prerequisites %}}
  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

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

EndpointSlices are a beta feature. Both the API and the EndpointSlice
{{< glossary_tooltip term_id="controller" >}} are enabled by default.
{{<  glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
uses Endpoints by default, not EndpointSlices.

For better scalability and performance, you can enable the
`EndpointSliceProxying`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on kube-proxy. That change
switches the data source to be EndpointSlices, which reduces the amount of
Kubernetes API traffic to and from kube-proxy.

## Using EndpointSlices

With EndpointSlices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, EndpointSlices include new bits of information
such as topology. They will allow for greater scalability and extensibility of
network endpoints in your cluster.

{{% capture whatsnext %}}

* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)

{{% /capture %}}
