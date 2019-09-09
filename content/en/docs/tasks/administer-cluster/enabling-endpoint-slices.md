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

## Using Endpoint Slices

With Endpoint Slices fully enabled in your cluster, you should see corresponding
EndpointSlice resources for each Endpoints resource. In addition to supporting
existing Endpoints functionality, Endpoint Slices should include new bits of
information such as topology. They will allow for greater scalability and
extensibility of network endpoints in your cluster.
