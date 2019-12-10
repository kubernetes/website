---
reviewers:
- bowei
- freehan
title: Enabling Endpoint Slices
content_template: templates/task
---

{{% capture overview %}}
This page provides an overview of enabling Endpoint Slices in Kubernetes.
{{% /capture %}}


{{% capture prerequisites %}}
  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## Introduction

Endpoint Slices provide a scalable and extensible alternative to Endpoints in
Kubernetes. They build on top of the base of functionality provided by Endpoints
and extend that in a scalable way. When Services have a large number (>100) of
network endpoints, they will be split into multiple smaller Endpoint Slice
resources instead of a single large Endpoints resource.

## Enabling Endpoint Slices

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

{{< note >}}
Although Endpoint Slices may eventually replace Endpoints, many Kubernetes
components still rely on Endpoints. For now, enabling Endpoint Slices should be
seen as an addition to Endpoints in a cluster, not a replacement for them.
{{< /note >}}

As an alpha feature, Endpoint Slices are not enabled by default in Kubernetes.
To enable them, the EndpointSlice feature gate will need to be enabled
(`--feature-gates=EndpointSlice=true`).

## Using Endpoint Slices

With Endpoint Slices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, Endpoint Slices should include new bits of
information such as topology. They will allow for greater scalability and
extensibility of network endpoints in your cluster.