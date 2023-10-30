---
id: PodSchedulingContext
title: PodSchedulingContext
full-link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
date: 2023-11-28
short_description: >
 A short-lived object that is created by the kube-scheduler to coordinate with resource drivers the
 selection of a Node for the Pod, that uses one or more ResourceClaims.

related:
 - kube-scheduler
 - resource-claim
 - resource-driver
---

 A [Pod Scheduling Context](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) is used
 by kube-scheduler when Pod needs ResourceClaims in order to be scheduled.

<!--more-->

Resource drivers and kube-scheduler communicate through RecourceClaim and PodSchedulingContext objects
during scheduling. The Pod only gets a Node name assigned when all the ResourceClaims listed in
PodSchedulingContext are in status `Allocated` and are `ReservedFor` for the Pod that is being scheduled.