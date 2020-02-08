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

EndpointSlices are considered a beta feature, but only the API is enabled by
default. Both the EndpointSlice controller and the usage of EndpointSlices by
kube-proxy are not enabled by default.

The EndpointSlice controller creates and manages EndpointSlices in a cluster.
You can enable it with the `EndpointSlice` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) on the {{<
glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} and {{<
glossary_tooltip text="kube-controller-manager"
term_id="kube-controller-manager" >}} (`--feature-gates=EndpointSlice=true`).

For better scalability, you can also enable this feature gate on {{<
glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} so EndpointSlices
will be used as the data source instead of Endpoints.

## Using EndpointSlices

With EndpointSlices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, EndpointSlices should include new bits of
information such as topology. They will allow for greater scalability and
extensibility of network endpoints in your cluster.

{{% capture whatsnext %}}

* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)

{{% /capture %}}
