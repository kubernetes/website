---
layout: blog
title: "Kubernetes v1.36: DRA has graduated to GA"
slug: dra-136-updates
draft: true
date: XXXX-XX-XX
author: >
  The DRA team
---

Dynamic Resource Allocation (DRA) has fundamentally changed how we handle hardware
accelerators and specialized resources in Kubernetes. In the v1.36 release, DRA
continues to mature, bringing a wave of feature graduations, critical usability
improvements, and new capabilities that extends the flexibility of DRA to native
resources like memory and CPU, and support for ResourceClaims in PodGroups.

Whether you are managing massive fleets of GPUs, need better handling of failures,
or simply looking for better ways to define resource fallback options, the upgrades
to DRA in 1.36 have something for you. Let's dive into the new features and graduations!

## Feature graduations

The community has been hard at work stabilizing core DRA concepts. In Kubernetes 1.36,
several highly anticipated features have graduated to Beta and Stable.

**Prioritized List (Stable)**

Hardware heterogeneity is a reality in most clusters. With the
[Prioritized List](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
feature, you can confidently define fallback preferences when requesting
devices. Instead of hardcoding a request for a specific device model, you can specify an
ordered list of preferences (e.g., "Give me an H100, but if none are available, fall back
to an A100"). The scheduler will evaluate these requests in order, drastically improving
scheduling flexibility and cluster utilization.

**Extended Resource Support (Beta)**

As DRA becomes the standard for resource allocation, bridging the gap with legacy systems
is crucial. The DRA
[Extended Resource](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
feature allows users to request resources via traditional extended resources on a Pod.
This allows for a gradual transition to DRA, meaning application developers and
operators are not forced to immediately migrate their workloads to the ResourceClaim
API.

**Partitionable Devices (Beta)**

Hardware accelerators are powerful, and sometimes a single workload doesn't need an
entire device. The
[Partitionable Devices](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
feature, provides native DRA support for carving physical hardware into smaller,
logical instances (such as Multi-Instance GPUs). This allows administrators to
safely and efficiently share expensive accelerators across multiple Pods.

**Device Taints (Beta)**

Just as you can taint a Kubernetes Node, you can now apply taints directly to specific DRA
devices.
[Device Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
empower cluster administrators to manage hardware more effectively. You can taint faulty
devices to prevent them from being allocated to standard claims, or reserve specific hardware
for dedicated teams, specialized workloads, and experiments. Ultimately, only Pods with
matching tolerations are permitted to claim these tainted devices.

**Device Binding Conditions (Beta)**

To improve scheduling reliability, the Kubernetes scheduler can now use the
[Binding Conditions](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
feature to delay committing a Pod to a Node until its required external resources—such as attachable
devices or FPGAs—are fully prepared. By explicitly modeling resource readiness, this
prevents premature assignments that can lead to Pod failures, ensuring a much more robust
and predictable deployment process.

## New Features

Beyond stabilizing existing capabilities, v1.36 introduces foundational new features
that expand what DRA can do.

**ResourceClaim Support for Workloads**

To optimize large-scale AI/ML workloads that rely on strict topological scheduling, the 
[ResourceClaim Support for Workloads](add_link_here)
feature enables Kubernetes to seamlessly manage shared resources across massive sets
of Pods. By associating ResourceClaims or ResourceClaimTemplates with PodGroups,
this feature eliminates previous scaling bottlenecks, such as the limit on the
number of pods that can share a claim, and removes the burden of manual claim
management from specialized orchestrators.

**DRA for Native Resources**

Why should DRA only be for external accelerators? In v1.36, we are introducing the first
iterations of using the DRA API to manage Kubernetes native resources (like CPU and
Memory). By bringing CPU and memory allocation under the DRA umbrella with the DRA
[Native Resources](add_link_here)
feature, users can leverage DRA's advanced placement, NUMA-awareness, and prioritization
semantics for standard compute resources, paving the way for incredibly fine-grained
performance tuning.

**DRA Resource Availability Visibility**

One of the most requested features from cluster administrators has been better visibility
into hardware capacity. The new
[Resource Availability Visibility](add_link_here)
feature introduces robust mechanisms to query and expose the total capacity, allocated
usage, and available pool of DRA resources across the cluster. This unlocks better
integration with dashboards and capacity planning tools.

**Device Allocation Ordering through Lexicographical Ordering**

The Kubernetes scheduler has been updated to evaluate devices using lexicographical
ordering based on resource pool and ResourceSlice names. This change empowers drivers
to proactively influence the scheduling process, leading to improved throughput and
more optimal scheduling decisions. To support this capability, the ResourceSlice
controller toolkit now automatically generates names that reflect the exact device
ordering specified by the driver author.

## What’s next?

This cycle introduced a wealth of new DRA features, and the momentum continues.
Our focus remains on progressing existing features toward beta and stable releases
while enhancing DRA's performance, scalability, and reliability. Additionally,
integrating DRA with Workload-Aware and Topology-Aware Scheduling will be a key
priority over the coming releases.


## Getting involved

A good starting point is joining the WG Device Management 
[Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and
[meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq),
which happen at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you wantto help or have some ideas yourself!
We have work to do at all levels, from difficult core changes to usability enhancements in kubectl, which could be picked up by newcomers.