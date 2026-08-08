---
layout: blog
title: "Kubernetes v1.37: Pod-Level Resource Managers graduated to Beta"
draft: true
slug: kubernetes-v1-37-pod-level-resource-managers-beta
author: Kevin Torres Martinez (Google)
---

With the release of Kubernetes v1.37, the **Pod-Level Resource Managers**
feature has reached **Beta** status and is now **enabled by default**!

First introduced as an alpha feature in
[Kubernetes v1.36](/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/),
this enhancement builds on
[Pod-Level Resources](/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/) by
equipping Kubelet's Topology Manager, CPU Manager, and Memory Manager to use
Pod-level resource declarations (`.spec.resources`) directly when making
hardware placement decisions.

## Bringing pod-level resources to node managers

Before this feature, obtaining exclusive NUMA-aligned CPU cores or memory for
latency-critical applications forced cluster operators into an all-or-nothing
choice: assign integer resource requests to *every* container in the Pod, or
forfeit exclusive NUMA alignment entirely. For modern workloads running
lightweight sidecars (such as logging agents or telemetry exporters), allocating
dedicated physical cores to auxiliary containers was wasteful.

Pod-Level Resource Managers solves this challenge by enabling hybrid allocation
models. The Kubelet can reserve exclusive NUMA-aligned resources for primary
application containers while placing non-Guaranteed sidecars into a pod-isolated
shared pool. This ensures primary workloads get unthrottled, NUMA-local
performance while sidecars benefit from running in a pod-isolated shared pool,
enjoying local NUMA alignment and protection from external node interference
without consuming dedicated physical cores.

## What's New in Beta

Graduating to Beta brings key operational and API enhancements:

*   **Enabled by Default:** Controlled by the `PodLevelResourceManagers` feature
    gate, active out-of-the-box in Kubernetes v1.37.
*   **PodResources API Reporting:** The `v1` PodResources gRPC service
    (`PodResourcesLister`) introduces top-level `cpu_ids` and `memory` fields on
    `PodResources` responses. Monitoring tools and device plugins can query
    pod-level exclusive assignments directly without double-counting container
    allocations.

## Getting started and providing feedback

For a deep dive into the technical details and configuration of this feature,
check out the official concept documentation:

*   [Pod-level resource managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)

To follow a step-by-step tutorial on configuring and deploying workloads:

*   [Use pod-level resources with Kubelet resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)

To learn more about how to assign resources to pods:

*   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

As this feature moves through Beta toward GA, your feedback is invaluable.
Please report any issues or share your experiences via the standard Kubernetes
communication channels:

*   Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
*   [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
*   [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
