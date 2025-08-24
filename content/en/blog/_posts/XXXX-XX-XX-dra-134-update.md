---
layout: blog
title: "Kubernetes v1.34: DRA has graduated to GA"
slug: dra-134-updates
draft: true
date: XXXX-XX-XX
author: >
  The DRA team
---

Kubernetes 1.34 is here, and it has brought a huge wave of enhancements for Dynamic Resource Allocation (DRA)! This
release marks a major milestone with many APIs in the `resource.k8s.io` group graduating to General Availability (GA),
unlocking the full potential of how you manage devices on Kubernetes. On top of that, several key features have
moved to beta, and a fresh batch of new alpha features promise even more expressiveness and flexibility.

Let's dive into what's new for DRA in Kubernetes 1.34!

## The core of DRA is now GA

The headline feature of the v1.34 release is that the core of DRA has graduated to General Availability.

Kubernetes [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) provides
a flexible framework for managing specialized hardware and infrastructure resources, such as GPUs or FPGAs. DRA
provides APIs that enable each workload to specify the properties of the devices it needs, but leaving it to the
scheduler to allocate actual devices, allowing increased reliability and improved utilization of expensive hardware.

With the graduation to GA, DRA is stable and will be part of Kubernetes for the long run. The community can still
expect a steady stream of new features being added to DRA over the next several Kubernetes releases, but they will
not make any breaking changes to DRA. So users and developers of DRA drivers can start adopting DRA with confidence.

Starting with Kubernetes 1.34, DRA is enabled by default; the DRA features that have reached beta are **also** enabled by default.
That's because the default API version for DRA is now the stable `v1` version, and not the earlier versions
(eg: `v1beta1` or `v1beta2`) that needed explicit opt in.

## Features promoted to beta

Several powerful features have been promoted to beta, adding more control, flexibility, and observability to resource
management with DRA.

[Admin access labelling](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access) has been updated.
In v1.34, you can restrict device support to people (or software) authorized to use it. This is meant
as a way to avoid privilege escalation if a DRA driver grants additional privileges when admin access is requested
and to avoid accessing devices which are in use by normal applications, potentially in another namespace.
The restriction works by ensuring that only users with access to a namespace with the 
`resource.k8s.io/admin-access: "true"` label are authorized to create
ResourceClaim or ResourceClaimTemplates objects with the `adminAccess` field set to true. This ensures that non-admin users cannot misuse the feature.

[Prioritized list](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list) lets users specify
a list of acceptable devices for their workloads, rather than just a single type of device. So while the workload
might run best on a single high-performance GPU, it might also be able to run on 2 mid-level GPUs. The scheduler will
attempt to satisfy the alternatives in the list in order, so the workload will be allocated the best set of devices
available on the node.

The kubelet's API has been updated to report on Pod resources allocated through DRA. This allows node monitoring agents
to know the allocated DRA resources for Pods on a node and makes it possible to use the DRA information in the PodResources API
to develop new features and integrations.

## New alpha features

Kubernetes 1.34 also introduces several new alpha features that give us a glimpse into the future of resource management with DRA.

[Extended resource mapping](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource) support in DRA allows
cluster administrators to advertise DRA-managed resources as _extended resources_, allowing developers to consume them using
the familiar, simpler request syntax while still benefiting from dynamic allocation. This makes it possible for existing
workloads to start using DRA without modifications, simplifying the transition to DRA for both application developers and
cluster administrators.

[Consumable capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity) introduces a flexible
device sharing model where multiple, independent resource claims from unrelated
pods can each be allocated a share of the same underlying physical device. This new capability is managed through optional,
administrator-defined sharing policies that govern how a device's total capacity is divided and enforced by the platform for
each request. This allows for sharing of devices in scenarios where pre-defined partitions are not viable.

[Binding conditions](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#binding-conditions) improve scheduling
reliability for certain classes of devices by allowing the Kubernetes scheduler to delay binding a pod to a node until its
required external resources, such as attachable devices or FPGAs, are confirmed to be fully prepared. This prevents premature
pod assignments that could lead to failures and ensures more robust, predictable scheduling by explicitly modeling resource
readiness before the pod is committed to a node.

_Resource health status_ for DRA improves observability by exposing the health status of devices allocated to a Pod via Pod Status.
This works whether the device is allocated through DRA or Device Plugin. This makes it easier to understand the cause of an
unhealthy device and respond properly.

## What’s next?

While DRA got promoted to GA this cycle, the hard work on DRA doesn't stop. There are several features in alpha and beta that
we plan to bring to GA in the next couple of releases and we are looking to continue to improve performance, scalability
and reliability of DRA. So expect an equally ambitious set of features in DRA for the 1.35 release.

## Getting involved

A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq), which happen at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in kubectl, which could be picked up by newcomers.

## Acknowledgments

A huge thanks to the new contributors to DRA this cycle:
* Alay Patel ([alaypatel07](https://github.com/alaypatel07))
* Gaurav Kumar Ghildiyal ([gauravkghildiyal](https://github.com/gauravkghildiyal))
* JP ([Jpsassine](https://github.com/Jpsassine))
* Kobayashi Daisuke ([KobayashiD27](https://github.com/KobayashiD27))
* Laura Lorenz ([lauralorenz](https://github.com/lauralorenz))
* Sunyanan Choochotkaew ([sunya-ch](https://github.com/sunya-ch))
* Swati Gupta ([guptaNswati](https://github.com/guptaNswati))
* Yu Liao ([yliaog](https://github.com/yliaog))
