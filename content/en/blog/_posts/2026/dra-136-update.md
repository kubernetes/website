---
layout: blog
title: "Kubernetes v1.36: More Drivers, New Features, and the Next Era of DRA"
slug: dra-136-updates
draft: true
date: 2026-04-27
author: >
  The DRA team
---

Dynamic Resource Allocation (DRA) has fundamentally changed how platform administrators handle hardware
accelerators and specialized resources in Kubernetes. In the v1.36 release, DRA
continues to mature, bringing a wave of feature graduations, critical usability
improvements, and new capabilities that extend the flexibility of DRA to native
resources like memory and CPU, and support for ResourceClaims in PodGroups.

Driver availability continues to expand. Beyond specialized compute accelerators,
the ecosystem includes support for networking and other hardware types,
reflecting a move toward a more robust, hardware-agnostic infrastructure.

Whether you are managing massive fleets of GPUs, need better handling of failures,
or simply looking for better ways to define resource fallback options, the upgrades
to DRA in 1.36 have something for you. Let's dive into the new features and graduations!

## Feature graduations

The community has been hard at work stabilizing core DRA concepts. In Kubernetes 1.36,
several highly anticipated features have graduated to Beta and Stable.

### Prioritized list (stable) {#prioritized-list}

Hardware heterogeneity is a reality in most clusters. With the
[Prioritized list](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
feature, you can confidently define fallback preferences when requesting
devices. Instead of hardcoding a request for a specific device model, you can specify an
ordered list of preferences (e.g., "Give me an H100, but if none are available, fall back
to an A100"). The scheduler will evaluate these requests in order, drastically improving
scheduling flexibility and cluster utilization.

### Extended resource support (beta) {#extended-resource}

As DRA becomes the standard for resource allocation, bridging the gap with legacy systems
is crucial. The DRA
[Extended resource](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
feature allows users to request resources via traditional extended resources on a Pod.
This allows for a gradual transition to DRA, meaning cluster operators can migrate clusters
to DRA but let application developers adopt the ResourceClaim API on their own schedule.

### Partitionable devices (beta) {#partitionable-devices}

Hardware accelerators are powerful, and sometimes a single workload doesn't need an
entire device. The
[Partitionable devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
feature, provides native DRA support for dynamically carving physical hardware into smaller,
logical instances (such as Multi-Instance GPUs) based on workload demands. This allows
administrators to safely and efficiently share expensive accelerators across multiple Pods.

### Device taints (beta) {#device-taints}

Just as you can taint a Kubernetes Node, you can apply taints directly to specific DRA
devices.
[Device taints and tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
empower cluster administrators to manage hardware more effectively. You can taint faulty
devices to prevent them from being allocated to standard claims, or reserve specific hardware
for dedicated teams, specialized workloads, and experiments. Ultimately, only Pods with
matching tolerations are permitted to claim these tainted devices.

### Device binding conditions (beta) {#device-binding-conditions}

To improve scheduling reliability, the Kubernetes scheduler can use the
[Binding conditions](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions)
feature to delay committing a Pod to a Node until its required external resources—such as attachable
devices or FPGAs—are fully prepared. By explicitly modeling resource readiness, this
prevents premature assignments that can lead to Pod failures, ensuring a much more robust
and predictable deployment process.

### Resource health status (beta) {#device-health-monitoring}

Knowing when a device has failed or become unhealthy is critical for workloads running on
specialized hardware. With
[Resource health status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring),
Kubernetes expose device health information directly in the Pod status, giving users and
controllers crucial visibility to quickly identify and react to hardware failures. The
feature includes support for human-readable health status messages, making it
significantly easier to diagnose issues without the need to dive into complex driver logs.

## New Features

Beyond stabilizing existing capabilities, v1.36 introduces foundational new features
that expand what DRA can do. These are alpha features, so they are behind feature gates
that are disabled by default.

### ResourceClaim support for workloads {#workload-resourceclaims}

To optimize large-scale AI/ML workloads that rely on strict topological scheduling, the 
[ResourceClaim support for workloads](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resourceclaims)
feature enables Kubernetes to seamlessly manage shared resources across massive sets
of Pods. By associating ResourceClaims or ResourceClaimTemplates with PodGroups,
this feature eliminates previous scaling bottlenecks, such as the limit on the
number of pods that can share a claim, and removes the burden of manual claim
management from specialized orchestrators.

### Node allocatable resources {#node-allocatable-resources}

Why should DRA only be for external accelerators? In v1.36, we are introducing the first
iteration of using the DRA APIs to manage _node allocatable_ infrastructure resources (like CPU and
memory). By bringing CPU and memory allocation under the DRA umbrella with the DRA
[Node allocatable resources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
feature, users can leverage DRA's advanced placement, NUMA-awareness, and prioritization
semantics for standard compute resources, paving the way for incredibly fine-grained
performance tuning.

### DRA resource availability visibility {#resource-pool-status}

One of the most requested features from cluster administrators has been better visibility
into hardware capacity. The new
[Resource pool status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status)
feature allows you to query the availability of devices in DRA resource pools. By creating a
`ResourcePoolStatusRequest` object, you get a point-in-time snapshot of device counts
— total, allocated, available, and unavailable — for each pool managed by a given
driver. This enables better integration with dashboards and capacity planning tools.

### List types for attributes {#list-type-attributes}

ResourceClaim constraint evaluation has changed to work better with scalar
and list values:
`matchAttribute` now checks for a non-empty intersection, and
`distinctAttribute` checks for pairwise disjoint values.

An `includes()` function in CEL has also been introduced,
that lets device selectors keep working more easily when an attribute
changes between scalar and list representations.
(The `includes()` function is only available in DRA
contexts for expression evaluation).

### Deterministic device selection {#deterministic-device-selection}

The Kubernetes scheduler has been updated to evaluate devices using lexicographical
ordering based on resource pool and ResourceSlice names. This change empowers drivers
to proactively influence the scheduling process, leading to improved throughput and
more optimal scheduling decisions. The ResourceSlice controller toolkit automatically
generates names that reflect the exact device ordering specified by the driver author.

### Discoverable device metadata in containers {#device-metadata}

Workloads running on nodes with DRA devices often need to discover details about
their allocated devices, such as PCI bus addresses or network
interface configuration, without querying the Kubernetes API. With
[Device metadata](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata),
Kubernetes defines a standard protocol for how DRA drivers expose device
attributes to containers as versioned JSON files at well-known paths. Drivers
built with the
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
get this behavior transparently; they just provide the metadata and the
library handles file layout, CDI bind-mounts, versioning, and lifecycle. This
gives applications a consistent, driver-independent way to discover and
consume device metadata, eliminating the need for custom controllers or
looking up ResourceSlice objects to get metadata via attributes.

## What’s next?

This release introduced a wealth of new Dynamic Resource Allocation (DRA) features,
and the momentum is only building. As we look ahead, our roadmap focuses on maturing
existing features toward beta and stable releases while hardening DRA’s performance,
scalability, and reliability. A key priority over the coming cycles will be deep
integration with _workload aware_ and _topology aware scheduling_.

A big goal for us is to migrate users from Device Plugin to DRA, and we want
you involved. Whether you are currently maintaining a driver or are just beginning
to explore the possibilities, your input is vital. Partner with us to shape the next
generation of resource management. Reach out today to collaborate on development,
share feedback, or start building your first DRA driver.


## Getting involved

A good starting point is joining the WG Device Management 
[Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and
[meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq),
which happen at Americas/EMEA and EMEA/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself!
We have work to do at all levels, from difficult core changes to usability enhancements in kubectl, which could be picked up by newcomers.
