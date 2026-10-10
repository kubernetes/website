---
layout: blog
title: "Kubernetes 1.29: PodReadyToStartContainers Condition Moves to Beta"
date: 2023-12-19
slug: pod-ready-to-start-containers-condition-now-in-beta
author: >
  Zefeng Chen (independent),
  Kevin Hannon (Red Hat)
---

With the recent release of Kubernetes 1.29, the `PodReadyToStartContainers`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) is 
available by default.
The kubelet manages the value for that condition throughout a Pod's lifecycle, 
in the status field of a Pod. The kubelet will use the `PodReadyToStartContainers`
condition to accurately surface the initialization state of a Pod,
from the perspective of Pod sandbox creation and network configuration by a container runtime.

## What's the motivation for this feature?

Cluster administrators did not have a clear and easily accessible way to view the completion of Pod's sandbox creation
and initialization. As of 1.28, the `Initialized` condition in Pods tracks the execution of init containers.
However, it has limitations in accurately reflecting the completion of sandbox creation and readiness to start containers for all Pods in a cluster. 
This distinction is particularly important in multi-tenant clusters where tenants own the Pod specifications, including the set of init containers, 
while cluster administrators manage storage plugins, networking plugins, and container runtime handlers. 
Therefore, there is a need for an improved mechanism to provide cluster administrators with a clear and 
comprehensive view of Pod sandbox creation completion and container readiness.

## What's the benefit?

1. Improved Visibility: Cluster administrators gain a clearer and more comprehensive view of Pod sandbox
   creation completion and container readiness.
   This enhanced visibility allows them to make better-informed decisions and troubleshoot issues more effectively.
2. Metric Collection and Monitoring: Monitoring services can leverage the fields associated with
   the `PodReadyToStartContainers` condition to report sandbox creation state and latency.
   Metrics can be collected at per-Pod cardinality or aggregated based on various
   properties of the Pod, such as `volumes`, `runtimeClassName`, custom annotations for CNI
   and IPAM plugins or arbitrary labels and annotations, and `storageClassName` of
   PersistentVolumeClaims.
   This enables comprehensive monitoring and analysis of Pod readiness across the cluster.
3. Enhanced Troubleshooting: With a more accurate representation of Pod sandbox creation and container readiness,
   cluster administrators can quickly identify and address any issues that may arise during the initialization process.
   This leads to improved troubleshooting capabilities and reduced downtime.

### What’s next?

Due to feedback and adoption, the Kubernetes team promoted `PodReadyToStartContainersCondition` to Beta in 1.29. 
Your comments will help determine if this condition continues forward to get promoted to GA, 
so please submit additional feedback on this feature!

### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodReadyToStartContainersCondition` to learn more about it and how it fits in relation to
other Pod conditions.

### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!