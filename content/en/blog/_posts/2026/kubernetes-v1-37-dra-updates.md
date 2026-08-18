---
layout: blog
title: 'Kubernetes v1.37: DRA Updates'
draft: true
slug: kubernetes-v1-37-dra-updates
author: >
  Kashish Verma
---


Kubernetes 1.37 is here and [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) keeps pushing past where it started! This release brings DRA Extended Resource support to GA, a milestone the team has been building toward for three straight releases, alongside several more features graduating directly to Stable. A couple of features move to beta and a fresh batch of alpha features rounds out the release.

I'll dive into what's new for DRA in Kubernetes 1.37!

## What's stable in 1.37

[DRA Extended Resource support](https://www.kubernetes.dev/resources/keps/5004) has graduated to GA. This is the mechanism that lets DRA drivers satisfy requests made through the traditional extended resource API, think `example.com/gpu` in a Pod spec, without requiring a separate device plugin alongside the DRA driver. An extended resource name can be set directly on a DeviceClass, and Pods requesting it get matched to a device through DRA with no ResourceClaim needed on the workload's part.

It's been on a steady path since KEP acceptance in 1.34. Alpha landed in 1.35, beta in 1.36, and now it's stable. For cluster operators, this is what makes DRA adoption gradual. Existing workloads written against extended resources keep working unmodified while the backend allocation logic moves over to DRA.

[Resource Claim Status with possible standardized network interface data](https://www.kubernetes.dev/resources/keps/4817/)
adds a `Devices` field to `ResourceClaim.Status`, letting DRA drivers report per-device status, including, for network 
devices, the interface name, MAC address, and IP addresses. This gives users and controllers visibility into device state 
that was previously invisible once a device was configured in a Pod, and makes it possible to build things like network 
services that rely on a device's reported IPs.

[DRA: device taints and tolerations](https://www.kubernetes.dev/resources/keps/5055/) now Stable, DRA drivers can 
now mark devices as tainted so they're skipped for new pod scheduling, and cluster admins can apply the same taints 
cluster-wide via a `DeviceTaintRule`, without reconfiguring drivers. Pods already using a tainted device can be evicted 
automatically, unless their `ResourceClaim` explicitly tolerates the taint. This mirrors node taints and tolerations, 
letting operators take a single device offline for maintenance or mark it degraded, without disrupting the rest of the 
cluster.

[Standard numaNode device attribute](https://github.com/kubernetes/enhancements/issues/6072) standardizes `resource.kubernetes.io/numaNode` as a shared attribute name, so devices from different drivers can be compared on the same NUMA node instead of each driver inventing its own name for it. It landed directly as Stable in 1.37, since it's a naming/registration KEP with no feature gate or in-tree behavior change.


## Feature promoted to Beta

[ResourceClaim support for workloads](https://www.kubernetes.dev/resources/keps/5729)
graduates to beta behind the `DRAWorkloadResourceClaims` feature gate, which stays disabled by default. 
In a cluster that has the feature enabled, Workloads and PodGroups can reference ResourceClaims directly, so a single claim can be shared across an entire group of Pods.
This is instead of claims being capped at 256 Pods through the old per-Pod reservation limit.

[DRA Device Attributes Downward API](https://www.kubernetes.dev/resources/keps/5304/) graduates to Beta. This is aimed at 
supporting device injection into KubeVirt VMs, letting DRA drivers expose device metadata, like a GPU's PCI bus address or 
MAC address, to workloads as JSON files mounted via CDI, instead of requiring custom controllers to watch and translate 
ResourceClaims and ResourceSlices.

## Alpha features

[List types for attributes](https://www.kubernetes.dev/resources/keps/5491) moved into a second alpha in 1.37, letting a device attribute hold more than one value instead of a single scalar, like a CPU that's adjacent to more than one PCIe root. This makes it possible to match or distinguish devices based on overlapping or non-overlapping sets of values, while single-value attributes keep working as they do today.

[Node allocatable resource requests](https://www.kubernetes.dev/resources/keps/5517) moved into alpha2. It lets the scheduler and kubelet treat DRA-managed CPU, memory, and similar node resources the same way they treat ordinary resource requests, so a node doesn't get oversubscribed and users no longer have to duplicate the same request in both a ResourceClaim and the pod spec.

[Resource availability visibility](https://www.kubernetes.dev/resources/keps/5677) lets a user see how much device capacity is actually left in a pool, not just the total. `kubectl describe resourceslice` and `kubectl describe node` are planned to show that directly. It moved into a second alpha in 1.37 to make those numbers accurate for devices that can be shared or split across workloads.

[DRA: Optional Node Operations](https://www.kubernetes.dev/resources/keps/5945) lets a driver skip kubelet's prepare and unprepare calls for allocations that don't need any setup on the node. This makes it possible to avoid an unnecessary dependency on the driver for allocations where there's genuinely nothing for it to do locally.

[Derived Attributes](https://www.kubernetes.dev/resources/keps/6080) is a new feature that lets you use [CEL](https://kubernetes.io/docs/reference/using-api/cel/) expressions to match up devices based on your own custom rules. Before this, pairing devices from different vendors (like a GPU/TPU and a NIC on the same NUMA node) only worked if both drivers used the exact same attribute name. If one used `numa` and the other used `numaNode`, the scheduler couldn't pair them together. Now, you can easily bridge these differences yourself inside your manifest, meaning you don't have to wait for hardware vendors to agree on standardized attribute names. Beyond just fixing naming differences, you can also use CEL to handle more complex scenarios like slicing a specific ID out of a long, monolithic topology string, or grouping devices into custom performance tiers based on their available capacity.

[DRA Device Compatibility Groups](https://www.kubernetes.dev/resources/keps/5963) is new as alpha in 1.37. Partitionable devices can represent multiple logical devices that consume capacity from the same counter set, but counter accounting alone cannot express that some device modes are mutually incompatible. Drivers can now attach opaque compatibility-group names to each device’s counter-set consumption, and devices consuming from the same counter-set may be co-allocated only when all of them share at least one common group. Devices without groups can only be co-allocated with other ungrouped devices. This lets Kubernetes reject incompatible combinations during scheduling instead of discovering the conflict later during node preparation. The feature is controlled by the `DRADeviceCompatibilityGroups` feature gate, which is disabled by default.


## What’s next

DRA continues to mature with every release. Several features currently in Alpha and Beta are on track to progress in the 
coming releases, and the community keeps working on DRA's performance, scalability, and reliability. Expect another 
ambitious set of DRA features in Kubernetes 1.38.

## Getting involved

A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq) which happens at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in kubectl which could be picked up by newcomers.

## Acknowledgments

A huge thanks to everyone who has contributed:

* Patrick Ohly ([pohly](https://github.com/pohly))
* John Belamaric ([johnbelamaric](https://github.com/johnbelamaric))
* Kevin Klues ([klueska](https://github.com/klueska))
* John A. Hull ([johnahull](https://github.com/johnahull))  
* Praveen Krishna ([pravk03](https://github.com/pravk03)) 
* Jiefeng Xu ([jiefeng-xu](https://github.com/jiefeng-xu)) 
* Jon Huhn ([nojnhuh](https://github.com/nojnhuh)) 
* Troy Chiu ([troychiu](https://github.com/troychiu))
* Gaurav Ghildiyal ([gauravkghildiyal](https://github.com/gauravkghildiyal))
* Shingo Omura ([everpeace](https://github.com/everpeace))
* John A. Hull ([johnahull](https://github.com/johnahull))
* Byonggon Chun([bg-chun](https://github.com/bg-chun))
* Alay Patel ([alaypatel07](https://github.com/alaypatel07))







