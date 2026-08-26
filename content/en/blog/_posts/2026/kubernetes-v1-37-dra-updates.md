---
layout: blog
title: 'Kubernetes v1.37: DRA Updates'
slug: kubernetes-v1-37-dra-updates
date: 2026-09-02T10:30:00-08:00
author: >
  [Kashish Verma](https://github.com/KashishV999)
---


Kubernetes 1.37 is here and [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) keeps pushing past where it started! This release brings DRA Extended Resource support to GA, a milestone the team has been building toward for three straight releases. Several more features graduate to Beta or GA. A fresh batch of alpha features rounds out the release.

I'll dive into what's new for DRA in Kubernetes 1.37!

## What's stable in 1.37

[DRA Extended Resource support](https://www.kubernetes.dev/resources/keps/5004) has graduated to GA. This is the mechanism that lets DRA drivers satisfy requests made through the traditional extended resource API, think `example.com/gpu` in a Pod spec, without requiring a separate device plugin alongside the DRA driver. An extended resource name can be set directly on a DeviceClass, and Pods requesting it get matched to a device through DRA with no ResourceClaim needed on the workload's part.

It's been on a steady path since KEP acceptance in 1.34. Alpha landed in 1.35, Beta in 1.36, and now it's Stable. For cluster operators, this is what makes DRA adoption gradual. Existing workloads written against extended resources keep working unmodified while the backend allocation logic moves over to DRA.

[ResourceClaims status with possible standardized network interface data](https://www.kubernetes.dev/resources/keps/4817/) adds a `devices` field to ResourceClaim `.status`, letting DRA drivers report per-device status, including, for network devices, the interface name, MAC address, and IP addresses. This gives users and controllers visibility into device state that was previously invisible once a device was configured in a Pod, and makes it possible to build things like network services that rely on a device's reported IPs.

[DRA: device taints and tolerations](https://www.kubernetes.dev/resources/keps/5055/) is now Stable; DRA drivers can mark devices as tainted so they're skipped for new Pod scheduling, and cluster admins can apply the same taints cluster-wide via a DeviceTaintRule, without reconfiguring drivers. Pods already using a tainted device can be evicted automatically, unless their ResourceClaim explicitly tolerates the taint. This mirrors node taints and tolerations, letting operators take a single device offline for maintenance or mark it degraded, without disrupting the rest of the cluster.

[Standard numaNode device attribute](https://github.com/kubernetes/enhancements/issues/6072) standardizes `resource.kubernetes.io/numaNode` as a shared attribute name, so devices from different drivers can be compared on the same NUMA node instead of each driver inventing its own name for it. It landed directly as stable in 1.37, since it's a naming/registration KEP with no feature gate or in-tree behavior change.


## Feature promoted to Beta

[ResourceClaim support for workloads](https://www.kubernetes.dev/resources/keps/5729)
graduates to Beta behind the `DRAWorkloadResourceClaims` feature gate, which stays disabled by default.
In a cluster that has the feature enabled, Workloads and PodGroups can reference ResourceClaims directly, so 
a single claim can be shared across an entire group of Pods. This is instead of claims being capped at 256 
Pods through the old per-Pod reservation limit.

The [DRA Device Attributes Downward API](https://www.kubernetes.dev/resources/keps/5304/) is aimed at 
supporting device injection into KubeVirt VMs. Drivers populate a `Metadata` field when preparing a claim, 
and the framework writes it to a JSON file mounted into the container via CDI, letting workloads read a 
device's PCI bus address, MAC address, and other attributes directly instead of requiring custom controllers 
to watch and translate ResourceClaims and ResourceSlices.


## Alpha features

[List types for attributes](https://www.kubernetes.dev/resources/keps/5491) moved into a second Alpha in 1.37,
letting a device attribute hold more than one value instead of a single scalar, such as a CPU that's 
adjacent to more than one PCIe root. This makes it possible to match or distinguish devices based on 
overlapping or non-overlapping sets of values, while single-value attributes keep working as they do today.

[Node allocatable resource requests](https://www.kubernetes.dev/resources/keps/5517) moved into Alpha 2. It
lets the scheduler and kubelet treat DRA-managed CPU, memory, and similar node resources the same way they 
treat ordinary resource requests, so a node doesn't get oversubscribed and users no longer have to duplicate 
the same request in both a ResourceClaim and the pod spec.

[Resource availability visibility](https://www.kubernetes.dev/resources/keps/5677) moved to a second Alpha in Kubernetes 1.37. Users create a ResourcePoolStatusRequest to get a point-in-time availability snapshot. To refresh it, delete and recreate the request; it is not a continuous monitoring API.

[DRA: Optional Node Operations](https://www.kubernetes.dev/resources/keps/5945) lets a driver skip kubelet's 
prepare and unprepare calls for allocations that don't need any setup on the node. This makes it possible to 
avoid an unnecessary dependency on the driver for allocations where there's genuinely nothing for it to do 
locally.

[Derived Attributes](https://www.kubernetes.dev/resources/keps/6080) is a new feature that lets you use [CEL](/docs/reference/using-api/cel/) expressions to match up devices based on your own 
custom rules. Before this, pairing devices from different vendors (like a GPU/TPU and a NIC on the same NUMA 
node) only worked if both drivers used the exact same attribute name. If one used `numa` and the other used 
`numaNode`, the scheduler couldn't pair them together. Now, you can easily bridge these differences yourself 
inside your manifest, meaning you don't have to wait for hardware vendors to agree on standardized attribute 
names. Beyond just fixing naming differences, you can also use CEL to handle more complex scenarios like 
slicing a specific ID out of a long, monolithic topology string, or grouping devices into custom performance 
tiers based on their available capacity.

[DRA Device Compatibility Groups](https://www.kubernetes.dev/resources/keps/5963) lets drivers tag partitions 
of a device, like MIG vs vGPU profiles on the same GPU, with compatibility groups, so the scheduler rejects 
incompatible combinations up front instead of the driver failing at node preparation time. It's controlled by 
the `DRADeviceCompatibilityGroups` feature gate, disabled by default.

[PreQueueingHint extension point](https://www.kubernetes.dev/resources/keps/6132) is new as Alpha in 1.37.
DRA ResourceClaim events used to trigger a full scan of every unschedulable pod, an O(N²) cost during large 
scale-ups. The DRA plugin now uses a pod informer index to narrow that to just the pods actually affected, 
cutting the requeue path to O(1) and roughly doubling scheduling throughput in early benchmarks. Controlled 
by the `SchedulerPreQueueingHints` feature gate.

[DRA Consumable Capacity](https://www.kubernetes.dev/resources/keps/5075) now supports fractional values in
CapacityRequestPolicyRange, enabling more precise capacity requests and allocation for devices with fractional resources.
This improves flexibility for workloads that require fine-grained resource allocation. The enhancement is gated by the 
`DRAFractionalCapacityRange` feature gate, which is in Beta in 1.37.

## What’s next

DRA continues to mature with every release. Several features currently in Alpha and Beta are on track to progress in the
coming releases, and the community keeps working on DRA's performance, scalability, and reliability. Expect another 
ambitious set of DRA features in Kubernetes 1.38.

## Getting involved

A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings) which happens at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in `kubectl` which could be picked up by newcomers.

## Acknowledgments
The following KEP owners added or promoted a feature in the 1.37 release (in alphabetic order):

* Alay Patel ([alaypatel07](https://github.com/alaypatel07))
* Byonggon Chun([bg-chun](https://github.com/bg-chun))
* Gaurav Ghildiyal ([gauravkghildiyal](https://github.com/gauravkghildiyal))
* Jiefeng Xu ([jiefeng-xu](https://github.com/jiefeng-xu))
* John A. Hull ([johnahull](https://github.com/johnahull))
* Jon Huhn ([nojnhuh](https://github.com/nojnhuh))
* Lionel Jouin ([LionelJouin](https://github.com/LionelJouin))
* Patrick Ohly ([pohly](https://github.com/pohly))
* Praveen Krishna ([pravk03](https://github.com/pravk03))
* Shingo Omura ([everpeace](https://github.com/everpeace))
* Troy Chiu ([troychiu](https://github.com/troychiu))

This would not have been possible without the help of the reviewers and approvers.
So a huge thanks to everyone else who helped shape this release, in ways big and small. Given enough eyeballs, all bugs are shallow and this release had plenty of them, watching closely and caring enough to make things better. DRA got better this cycle because of all of you.




