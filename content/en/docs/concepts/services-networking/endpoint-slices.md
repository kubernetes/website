---
reviewers:
- freehan
title: EndpointSlices
feature:
  title: EndpointSlices
  description: >
    Scalable tracking of network endpoints in a Kubernetes cluster.

content_template: templates/concept
weight: 15
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

_EndpointSlices_ provide a simple way to track network endpoints within a
Kubernetes cluster. They offer a more scalable and extensible alternative to
Endpoints.

{{% /capture %}}

{{% capture body %}}

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
EndpointSlices help you mitigate those issues as well as provide an extensible
platform for additional features such as topological routing.

## EndpointSlice resources {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The EndpointSlice controller automatically creates EndpointSlices
for a Kubernetes Service when a {{< glossary_tooltip text="selector"
term_id="selector" >}} is specified. These EndpointSlices will include
references to any Pods that match the Service selector. EndpointSlices group
network endpoints together by unique Service and Port combinations.
The name of a EndpointSlice object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

As an example, here's a sample EndpointSlice resource for the `example`
Kubernetes Service.

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

By default, EndpointSlices managed by the EndpointSlice controller will have no
more than 100 endpoints each. Below this scale, EndpointSlices should map 1:1
with Endpoints and Services and have similar performance.

EndpointSlices can act as the source of truth for kube-proxy when it comes to
how to route internal traffic. When enabled, they should provide a performance
improvement for services with large numbers of endpoints.

### Address Types

EndpointSlices support three address types:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)

### Topology

Each endpoint within an EndpointSlice can contain relevant topology information.
This is used to indicate where an endpoint is, containing information about the
corresponding Node, zone, and region. When the values are available, the
following Topology labels will be set by the EndpointSlice controller:

* `kubernetes.io/hostname` - The name of the Node this endpoint is on.
* `topology.kubernetes.io/zone` - The zone this endpoint is in. 
* `topology.kubernetes.io/region` - The region this endpoint is in.

The values of these labels are derived from resources associated with each
endpoint in a slice. The hostname label represents the value of the NodeName
field on the corresponding Pod. The zone and region labels represent the value
of the labels with the same names on the corresponding Node. 

### Management

By default, EndpointSlices are created and managed by the EndpointSlice
controller. There are a variety of other use cases for EndpointSlices, such as
service mesh implementations, that could result in other entities or controllers
managing additional sets of EndpointSlices. To ensure that multiple entities can
manage EndpointSlices without interfering with each other, a
`endpointslice.kubernetes.io/managed-by` label is used to indicate the entity
managing an EndpointSlice. The EndpointSlice controller sets
`endpointslice-controller.k8s.io` as the value for this label on all
EndpointSlices it manages. Other entities managing EndpointSlices should also
set a unique value for this label.

### Ownership

In most use cases, EndpointSlices will be owned by the Service that it tracks
endpoints for. This is indicated by an owner reference on each EndpointSlice as
well as a `kubernetes.io/service-name` label that enables simple lookups of all
EndpointSlices belonging to a Service.

## EndpointSlice Controller

The EndpointSlice controller watches Services and Pods to ensure corresponding
EndpointSlices are up to date. The controller will manage EndpointSlices for
every Service with a selector specified. These will represent the IPs of Pods
matching the Service selector.

### Size of EndpointSlices

By default, EndpointSlices are limited to a size of 100 endpoints each. You can
configure this with the `--max-endpoints-per-slice` {{< glossary_tooltip
text="kube-controller-manager" term_id="kube-controller-manager" >}} flag up to
a maximum of 1000.

### Distribution of EndpointSlices

Each EndpointSlice has a set of ports that applies to all endpoints within the
resource. When named ports are used for a Service, Pods may end up with
different target port numbers for the same named port, requiring different
EndpointSlices. This is similar to the logic behind how subsets are grouped
with Endpoints.

The controller tries to fill EndpointSlices as full as possible, but does not
actively rebalance them. The logic of the controller is fairly straightforward:

1. Iterate through existing EndpointSlices, remove endpoints that are no longer
   desired and update matching endpoints that have changed.
2. Iterate through EndpointSlices that have been modified in the first step and
   fill them up with any new endpoints needed.
3. If there's still new endpoints left to add, try to fit them into a previously
   unchanged slice and/or create new ones.
   
Importantly, the third step prioritizes limiting EndpointSlice updates over a
perfectly full distribution of EndpointSlices. As an example, if there are 10
new endpoints to add and 2 EndpointSlices with room for 5 more endpoints each,
this approach will create a new EndpointSlice instead of filling up the 2
existing EndpointSlices. In other words, a single EndpointSlice creation is
preferrable to multiple EndpointSlice updates.

With kube-proxy running on each Node and watching EndpointSlices, every change
to an EndpointSlice becomes relatively expensive since it will be transmitted to
every Node in the cluster. This approach is intended to limit the number of
changes that need to be sent to every Node, even if it may result with multiple
EndpointSlices that are not full.

In practice, this less than ideal distribution should be rare. Most changes
processed by the EndpointSlice controller will be small enough to fit in an
existing EndpointSlice, and if not, a new EndpointSlice is likely going to be
necessary soon anyway. Rolling updates of Deployments also provide a natural
repacking of EndpointSlices with all pods and their corresponding endpoints
getting replaced.

{{% /capture %}}

{{% capture whatsnext %}}

* [Enabling EndpointSlices](/docs/tasks/administer-cluster/enabling-endpointslices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)

{{% /capture %}}
