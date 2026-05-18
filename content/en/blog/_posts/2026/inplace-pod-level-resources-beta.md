---
layout: blog
title: "Kubernetes v1.36: In-Place Vertical Scaling for Pod-Level Resources Graduates to Beta"
date: 2026-04-30T10:35:00-08:00
slug: kubernetes-v1-36-inplace-pod-level-resources-beta
author: Narang Dixita Sohanlal (Google)
---

Following the graduation of Pod-Level Resources to Beta in v1.34 and the General Availability (GA) of In-Place Pod Vertical Scaling in v1.35, the Kubernetes community is thrilled to announce that **In-Place Pod-Level Resources Vertical Scaling has graduated to Beta in v1.36!**

This feature is now enabled by default via the `InPlacePodLevelResourcesVerticalScaling` feature gate. It allows users to update the aggregate Pod resource budget (`.spec.resources`) for a running Pod, **often without requiring a container restart.**

## Why Pod-level in-place resize?

The Pod-level resource model simplified management for complex Pods (such as those with sidecars) by allowing containers to share a collective pool of resources. In v1.36, you can now adjust this aggregate boundary on-the-fly.

This is particularly useful for Pods where containers do not have individual limits defined. These containers automatically scale their effective boundaries to fit the newly resized Pod-level dimensions, allowing you to expand the shared pool during peak demand without manual per-container recalculations.

## Resource inheritance and the `resizePolicy`

When a Pod-level resize is initiated, the Kubelet treats the change as a resize event for every container that inherits its limits from the Pod-level budget. To determine whether a restart is required, the Kubelet consults the `resizePolicy` defined within individual containers:

*   **Non-disruptive Updates:** If a container's `restartPolicy` is set to `NotRequired`, the Kubelet attempts to update the cgroup limits dynamically via the Container Runtime Interface (CRI).
*   **Disruptive Updates:** If set to `RestartContainer`, the container will be restarted to apply the new aggregate boundary safely.

> **Note:** Currently, `resizePolicy` is not supported at the Pod level. The Kubelet always defers to individual container settings to decide if an update can be applied in-place or requires a restart.

## Example: Scaling a shared resource pool

In this scenario, a Pod is defined with a 2 CPU pod-level limit. Because the individual containers do not have their own limits defined, they share this total pool.

### 1. Initial Pod specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-pool-app
spec:
  resources: # Pod-level limits
    limits:
      cpu: "2"
      memory: "4Gi"
  containers:
  - name: main-app
    image: my-app:v1
    resizePolicy: [{resourceName: "cpu", restartPolicy: "NotRequired"}]
  - name: sidecar
    image: logger:v1
    resizePolicy: [{resourceName: "cpu", restartPolicy: "NotRequired"}]
```

### 2. The resize operation

To double the CPU capacity to 4 CPUs, apply a patch using the `resize` subresource:

```bash
kubectl patch pod shared-pool-app --subresource resize --patch \
  '{"spec":{"resources":{"limits":{"cpu":"4"}}}}'
```

## Node-Level reality: feasibility and safety

Applying a resize patch is only the first step. The Kubelet performs several checks and follows a specific sequence to ensure node stability:

### 1. The feasibility check

Before admitting a resize, the Kubelet verifies if the new aggregate request fits within the Node's allocatable capacity. If the Node is overcommitted, the resize is not ignored; instead, the `PodResizePending` condition will reflect a `Deferred` or `Infeasible` status, providing immediate feedback on why the "envelope" hasn't grown.

### 2. Update sequencing

To prevent resource "overshoot", the Kubelet coordinates the cgroup updates in a specific order:
*   **When Increasing:** The Pod-level cgroup is expanded first, creating the "room" before the individual container cgroups are enlarged.
*   **When Decreasing:** The container cgroups are throttled first, and only then is the aggregate Pod-level cgroup shrunken.

## Observability: tracking resize status

With the move to Beta, Kubernetes uses **Pod Conditions** to track the lifecycle of a resize:

*   **`PodResizePending`**: The spec is updated, but the Node hasn't admitted the change (e.g., due to capacity).
*   **`PodResizeInProgress`**: The Node has admitted the resize (`status.allocatedResources`) but the changes aren't yet fully applied to the cgroups (`status.resources`).

```yaml
status:
  allocatedResources:
    cpu: "4"
  resources:
    limits:
      cpu: "4"
  conditions:
  - type: PodResizeInProgress
    status: "True"
```

## Constraints and requirements

*   **cgroup v2 Only:** Required for accurate aggregate enforcement.
*   **CRI Support:** Requires a container runtime that supports the `UpdateContainerResources` CRI call (e.g., containerd v2.0+ or CRI-O).
*   **Feature Gates:** Requires `PodLevelResources`, `InPlacePodVerticalScaling`, `InPlacePodLevelResourcesVerticalScaling`, and `NodeDeclaredFeatures`.
*   **Linux Only:** Currently exclusive to Linux-based nodes.

## What's next?

As we move toward General Availability (GA), the community is focusing on **Vertical Pod Autoscaler (VPA) Integration**, enabling VPA to issue Pod-level resource recommendations and trigger in-place actuation automatically.

## Getting started and providing feedback

We encourage you to test this feature and provide feedback via the standard Kubernetes communication channels:

*   Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
*   [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
*   [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
