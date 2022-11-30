---
title: Leases
content_type: concept
weight: 30
---

<!-- overview -->

Distrbuted systems often have a need for "leases", which provides a mechanism to lock shared resources and coordinate activity between nodes.
In Kubernetes, the "lease" concept is represented by `Lease` objects in the `coordination.k8s.io` API group, which are used for system-critical
capabilities like node heart beats and component-level leader election.

<!-- body -->

## Node Heart Beats

Kubernetes uses the Lease API to communicate kubelet node heart beats to the Kubernetes API server.
For every `Node` , there is a `Lease` object with a matching name in the `kube-node-lease`
namespace. Under the hood, every kubelet heart beat is an UPDATE request to this `Lease` object, updating
the `spec.renewTime` field for the Lease. The Kubernetes control plane uses the time stamp of this field
to determine the availability of this `Node`.

See [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats) for more details.

## Leader Election

Leases are also used in Kubernetes to ensure only one instance of a component is running at any given time.
This is used by control plane components like `kube-controller-manager` and `kube-scheduler` in
HA configurations, where only one instance of the component should be actively running while the other
instances are on stand-by.

## kube-apiserver identity

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Starting in Kubernetes v1.26, each `kube-apiserver` uses the Lease API to publish its identity to the
rest of the system. While not particularly useful on its own, this provides a mechanism for clients to
discover how many instances of `kube-apiserver` are operating the Kubernetes control plane.
Existence of kube-apiserver leases enables future capabilities that may require coordination between
each kube-apiserver.
