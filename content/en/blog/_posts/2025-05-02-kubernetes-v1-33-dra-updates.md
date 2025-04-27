---
layout: blog
title: "Kubernetes v1.33: New features in DRA"
slug: kubernetes-v1-33-dra-updates
date: 2025-05-02T10:30:00-08:00
author: >
  [Morten Torkildsen](https://github.com/mortent) (Google)
  [Patrick Ohly](https://github.com/pohly) (Intel)
---

Kubernetes [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) was originally introduced as an alpha feature in the v1.26 release, and then went through a significant redesign for Kubernetes v1.31. The main DRA feature went to beta in v1.32, and the project hopes it will be generally available in Kubernetes v1.34.

The basic feature set of DRA provides a far more powerful and flexible API for requesting devices than Device Plugin. And while DRA remains a beta feature for v1.33, the DRA team has been hard at work implementing a number of new features and UX improvements. One feature has been promoted to beta, while a number of new features have been added in alpha. The team has also made progress towards getting DRA ready for GA.

### Features promoted to beta

[Driver-owned Resource Claim Status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) was promoted to beta. This allows the driver to report driver-specific device status data for each allocated device in a resource claim, which is particularly useful for supporting network devices.

### New alpha features

[Partitionable Devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices) lets a driver advertise several overlapping logical devices (“partitions”), and the driver can reconfigure the physical device dynamically based on the actual devices allocated. This makes it possible to partition devices on-demand to meet the needs of the workloads and therefore increase the utilization.

[Device Taints and Tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) allow devices to be tainted and for workloads to tolerate those taints. This makes it possible for drivers or cluster administrators to mark devices as unavailable. Depending on the effect of the taint, this can prevent devices from being allocated or cause eviction of pods that are using the device.

[Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list) lets users specify a list of acceptable devices for their workloads, rather than just a single type of device. So while the workload might run best on a single high-performance GPU, it might also be able to run on 2 mid-level GPUs. The scheduler will attempt to satisfy the alternatives in the list in order, so the workload will be allocated the best set of devices available in the cluster.

[Admin Access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access) has been updated so that only users with access to a namespace with the `resource.k8s.io/admin-access: "true"` label are authorized to create ResourceClaim or ResourceClaimTemplates objects with the `adminAccess` field within the namespace. This grants administrators access to in-use devices and may enable additional permissions when making the device available in a container. This ensures that non-admin users cannot misuse the feature.

### Preparing for general availability

A new v1beta2 API has been added to simplify the user experience and to prepare for additional features being added in the future. The RBAC rules for DRA have been improved and support has been added for seamless upgrades of DRA drivers.

### What’s next?

The plan for v1.34 is even more ambitious than for v1.33. Most importantly, we (the Kubernetes device management working group) hope to bring DRA to general availability, which will make it available by default on all v1.34 Kubernetes clusters. This also means that many, perhaps all, of the DRA features that are still beta in v1.34 will become enabled by default, making it much easier to use them.

The alpha features that were added in v1.33 will be brought to beta in v1.34.

### Getting involved

A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq), which happen at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in kubectl, which could be picked up by newcomers.

### Acknowledgments

A huge thanks to everyone who has contributed:

* Cici Huang ([cici37](https://github.com/cici37))
* Ed Bartosh ([bart0sh](https://github.com/bart0sh])
* John Belamaric ([johnbelamaric](https://github.com/johnbelamaric))
* Jon Huhn ([nojnhuh](https://github.com/nojnhuh))
* Kevin Klues ([klueska](https://github.com/klueska))
* Morten Torkildsen ([mortent](https://github.com/mortent))
* Patrick Ohly ([pohly](https://github.com/pohly))
* Rita Zhang ([ritazh](https://github.com/ritazh))
* Shingo Omura ([everpeace](https://github.com/everpeace))
