---
layout: blog
title: "Kubernetes 1.24: Storage Capacity Tracking Now Generally Available"
date: 2022-05-06
slug: storage-capacity-ga
author: >
   Patrick Ohly (Intel)
---

The v1.24 release of Kubernetes brings [storage capacity](/docs/concepts/storage/storage-capacity/)
tracking as a generally available feature.

## Problems we have solved

As explained in more detail in the [previous blog post about this
feature](/blog/2021/04/14/local-storage-features-go-beta/), storage capacity
tracking allows a CSI driver to publish information about remaining
capacity. The kube-scheduler then uses that information to pick suitable nodes
for a Pod when that Pod has volumes that still need to be provisioned.

Without this information, a Pod may get stuck without ever being scheduled onto
a suitable node because kube-scheduler has to choose blindly and always ends up
picking a node for which the volume cannot be provisioned because the
underlying storage system managed by the CSI driver does not have sufficient
capacity left.

Because CSI drivers publish storage capacity information that gets used at a
later time when it might not be up-to-date anymore, it can still happen that a
node is picked that doesn't work out after all. Volume provisioning recovers
from that by informing the scheduler that it needs to try again with a
different node.

[Load
tests](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/storage-capacity-tracking.md)
that were done again for promotion to GA confirmed that all storage in a
cluster can be consumed by Pods with storage capacity tracking whereas Pods got
stuck without it.

## Problems we have *not* solved

Recovery from a failed volume provisioning attempt has one known limitation: if a Pod
uses two volumes and only one of them could be provisioned, then all future
scheduling decisions are limited by the already provisioned volume. If that
volume is local to a node and the other volume cannot be provisioned there, the
Pod is stuck. This problem pre-dates storage capacity tracking and while the
additional information makes it less likely to occur, it cannot be avoided in
all cases, except of course by only using one volume per Pod.

An idea for solving this was proposed in a [KEP
draft](https://github.com/kubernetes/enhancements/pull/1703): volumes that were
provisioned and haven't been used yet cannot have any valuable data and
therefore could be freed and provisioned again elsewhere. SIG Storage is
looking for interested developers who want to continue working on this.

Also not solved is support in Cluster Autoscaler for Pods with volumes. For CSI
drivers with storage capacity tracking, a prototype was developed and discussed
in [a PR](https://github.com/kubernetes/autoscaler/pull/3887). It was meant to
work with arbitrary CSI drivers, but that flexibility made it hard to configure
and slowed down scale up operations: because autoscaler was unable to simulate
volume provisioning, it only scaled the cluster by one node at a time, which
was seen as insufficient.

Therefore that PR was not merged and a different approach with tighter coupling
between autoscaler and CSI driver will be needed. For this a better
understanding is needed about which local storage CSI drivers are used in
combination with cluster autoscaling. Should this lead to a new KEP, then users
will have to try out an implementation in practice before it can move to beta
or GA. So please reach out to SIG Storage if you have an interest in this
topic.

## Acknowledgements

Thanks a lot to the members of the community who have contributed to this
feature or given feedback including members of [SIG
Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling),
[SIG
Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling),
and of course [SIG
Storage](https://github.com/kubernetes/community/tree/master/sig-storage)!
