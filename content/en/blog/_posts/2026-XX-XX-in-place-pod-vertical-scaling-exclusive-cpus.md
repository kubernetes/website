---
layout: blog
title: "Kubernetes v1.37: In place update pod resources alongside static cpu manager policy (Alpha)"
date: 2026-XX-XXTXX:XX:XX-XX:XX
slug: kubernetes-v1-37-feature-in-place-pod-vertical-scaling-exclusive-cpus-alpha
author: Sotiris Salloumis (Ericsson)
---

Kubernetes v1.37 introduces
[InPlacePodVerticalScalingExclusiveCPUs](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
as an alpha feature, enabling the support of In place update pod resources alongside static cpu manager policy
allowing telecom grade performance-sensitive workloads. This enhancement extends the kubelet's
Topology and CPU manager to support in place update pod resources ( container-level ) alongside cpu manager policy.

## Why do we need In place update pod resources alongside static cpu manager policy ?

When running performance-critical workloads such as telecom high performance and/or low-latency applications, 
you often need exclusive, NUMA-aligned resources for your primary application
containers to ensure predictable performance.

## Introducing InPlacePodVerticalScalingExclusiveCPUs

Enabling in place update pod resources alongside static cpu manager policy (via the
`InPlacePodVerticalScalingExclusiveCPUs` feature gate) allows the
kubelet to **pod resize of Guaranteed pods managed by CPU Static Policy Manager**. This brings flexibility
without compromising efficiency to high-performance workloads enabling cloud-native design patterns such us
canary upgrades, dynamic scaling without impacting end user services availability. 

### Real-world use cases

Here are a few practical scenarios demonstrating how this feature can be
applied:

#### 1. Example 1 

Consider a ...

#### 2. Example 2

Imagine a ...

#### 3. Example 4

Conceive a ...

## How to enable in place update pod resources alongside static cpu manager policy

Using this feature requires Kubernetes v1.37 or newer. To enable it, you must
configure the kubelet with the appropriate feature gates and policies:

1.  Enable the `InPlacePodVerticalScalingExclusiveCPUs`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
2.  Configure the
    [CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/) with
    the `static` policy.
3.    

## Observability

To help cluster administrators monitor and debug in place update pod resources alongside
static cpu manager policy, we have introduced several new kubelet metrics when the
feature gate is enabled:

*  

## Current limitations and caveats

While this feature opens up new possibilities, there are a few things to keep in
mind during its alpha phase. Be sure to review the
[Limitations and caveats](/docs/concepts/xxxx)
in the official documentation for full details on compatibility, requirements,
and downgrade instructions.

## Getting started and providing feedback

For a deep dive into the technical details and configuration of this feature,
check out the official concept documentation:

*   [InPlacePodVerticalScalingExclusiveCPUs](/docs/WIP)

To learn more about the overall InPlacePodVerticalScalingExclusiceCPUs feature and how
to assign resources to pods, see:

*   [In Place update pod resources alongside static cpu manager policy](/docs/WIP)

As this feature moves through Alpha, your feedback is invaluable. Please report
any issues or share your experiences via the standard Kubernetes communication
channels:

*   Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node), [#sig-node-inplace-pod-resize](https://kubernetes.slack.com/messages/sig-node-inplace-pod-resize)
*   [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
*   [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
