---
reviewers:
- freehan
title: Endpoint Slices
feature:
  title: Endpoint Slices
  description: >
    Scalable tracking of network endpoints in a Kubernetes cluster.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}
{{< glossary_definition term_id="endpoint-slice" length="short" >}}

_Endpoint Slices_ provide a simple way to track network endpoints within a
Kubernetes cluster. They offer a more scalable and extensible alternative to
Endpoints.

{{% /capture %}}

{{% capture body %}}

## Endpoint Slice resources {#endpointslice-resource}

In Kubernetes, an Endpoint Slice contains references to a set of network
endpoints. The EndpointSlice controller automatically creates Endpoint Slices
for a Kubernetes Service when a selector is specified. These Endpoint Slices
will include references to any Pods that match the Service selector. Endpoint
Slices group network endpoints together by unique Service and Port combinations.

As an example, here's a sample EndpointSlice resource for the `example`
Kubernetes Service.

```yaml
apiVersion: discovery.k8s.io/v1alpha
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IP
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
    - "10.1.2.3"
    - "2001:db8::1234:5678"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

By default, Endpoint Slices managed by the EndpointSlice controller will have no
more than 100 endpoints each. Below this scale, Endpoint Slices should map 1:1
with Endpoints and Services and have similar performance.

Endpoint Slices can act as the source of truth for kube-proxy when it comes to
how to route internal traffic. When enabled, they should provide a performance
improvement for services with large numbers of endpoints.

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

{{% /capture %}}

{{% capture whatsnext %}}

* [Enabling Endpoint Slices](/docs/tasks/administer-cluster/enabling-endpoint-slices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)

{{% /capture %}}
