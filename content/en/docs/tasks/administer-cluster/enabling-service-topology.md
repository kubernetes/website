---
reviewers:
- andrewsykim
- johnbelamaric
- imroc
title: Enabling Service Topology
content_type: task
min-kubernetes-server-version: 1.17
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

This feature, specifically the alpha `topologyKeys` field, is deprecated since
Kubernetes v1.21.
[Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints/),
introduced in Kubernetes v1.21, provide similar functionality.

_Service Topology_ enables a {{< glossary_tooltip term_id="service">}} to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes v1.17 or later
   * Configure {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to run in iptables mode or IPVS mode


<!-- steps -->

## Enable Service Topology

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

To enable service topology, enable the `ServiceTopology`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for all Kubernetes components:

```
--feature-gates="ServiceTopology=true`
```

## {{% heading "whatsnext" %}}

* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints/), the replacement for the `topologyKeys` field.
* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read about the [Service Topology](/docs/concepts/services-networking/service-topology/) concept
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)


