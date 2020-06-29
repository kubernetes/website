---
reviewers:
- andrewsykim
- johnbelamaric
- imroc
title: Enabling Service Topology
content_type: task
---

<!-- overview -->
This page provides an overview of enabling Service Topology in Kubernetes.



## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Introduction

_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.

## Prerequisites

The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes 1.17 or later
   * {{< glossary_tooltip text="Kube-proxy" term_id="kube-proxy" >}} running in iptables mode or IPVS mode
   * Enable [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/)

## Enable Service Topology

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

To enable service topology, enable the `ServiceTopology` and `EndpointSlice` feature gate for all Kubernetes components:

```
--feature-gates="ServiceTopology=true,EndpointSlice=true"
```


## {{% heading "whatsnext" %}}


* Read about the [Service Topology](/docs/concepts/services-networking/service-topology) concept
* Read about [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)


