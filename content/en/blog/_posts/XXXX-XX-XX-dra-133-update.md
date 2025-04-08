---
layout: blog
title: "Kubernetes 1.33: New features in DRA"
slug: dra-133-updates
canonicalUrl: https://www.kubernetes.dev/blog/XXXX/XX/XX/dra-133-updates
date: XXXX-XX-XX
author: >
  [Morten Torkildsen](https://github.com/mortent) (Google)
  [Patrick Ohly](https://github.com/pohly) (Intel)
---

## Kubernetes 1.33: New features in DRA

Dynamic Resource Allocation (DRA) was originally introduced as an Alpha feature in 1.26, but went through a significant redesign for 1.31. The main DRA feature went to beta in 1.32 and is planned for GA in 1.34.

The basic feature set of DRA provides a far more powerful and flexible API for requesting devices than Device Plugin. And while DRA remains a beta feature for 1.33, the DRA team has been hard at work implementing a number of new features and UX improvements. One feature has been promoted to Beta, while a number of new features have been added in Alpha. The team has also made progress towards getting DRA ready for GA.

### Features promoted to Beta

[Driver-owned Resource Claim Status](https://github.com/kubernetes/enhancements/issues/4817) was promoted to beta. This allows the driver to report driver-specific device status data for each allocated device in a resource claim, which is particularly useful for supporting network devices.

### New Alpha features

[Partitionable Devices](https://github.com/kubernetes/enhancements/issues/4815) lets a driver advertise several overlapping logical devices (“partitions”) and the driver can reconfigure the physical device dynamically based on the actual devices allocated. This makes it possible to partition devices on-demand to meet the need of the workloads and therefore increase the utilization.

[Device Taints and Tolerations](https://github.com/kubernetes/enhancements/issues/5055) allow devices to be tainted and for workloads to tolerate those taints. This makes it possible for drivers or cluster administrators to mark devices as unavailable. Depending on the effect of the taint, this can prevent devices from being allocated or cause eviction of pods that are using the device.

[Prioritized List](https://github.com/kubernetes/enhancements/issues/4816) lets users specify a list of acceptable devices for their workloads, rather than just a single type of device. So while the workload might run best on a single high-performance GPU, it might also be able to run on 2 mid-level GPUs. The scheduler will attempt to satisfy the alternatives in the list in order, so the workload will be allocated the best set of devices available in the cluster.

[Admin Access](https://github.com/kubernetes/enhancements/issues/5018) has been updated so that only users with access to a namespace with the `resource.k8s.io/admin-access: "true"` label are authorized to create ResourceClaim or ResourceClaimTemplates objects with the `adminAccess` field within the namespace. This grants administrators access to in-use devices and may enable additional permissions when making the device available in a container. This ensures that non-admin users cannot misuse the feature.

### Preparing for GA

A new v1beta2 API has been added to simplify the user experience and to prepare for additional features being added in the future. The RBAC rules for DRA have been improved and support has been added for seamless upgrades of DRA drivers.

### What’s next?

The plan for 1.34 is even more ambitious than for 1.33. Most importantly, we plan to bring DRA to GA, making it available by default on all Kubernetes clusters. This also means that all the DRA beta features will also be enabled by default, making it much easier to use them.

The Alpha features that were added in 1.33 will be brought to Beta in 1.34.

### Getting involved

A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq) which happens at US/EU and EU/APAC friendly time slots.

Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in kubectl which could be picked up by newcomers.
