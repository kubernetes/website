---
layout: blog
title: "Kubernetes v1.37: Scheduler Preemption for In-Place Pod Resize (Alpha)"
slug: scheduler-preemption-in-place-pod-resize-alpha
draft: true
author: "Natasha Sarkar (Google)"
---

In Kubernetes, resource allocation has historically been a static decision made during a Pod's initial scheduling and placement. With the graduation of the core [in-Place Pod resize](/blog/2025/12/19/kubernetes-v1-35-in-place-Pod-resize-ga/) feature to General Availability in v1.35, application developers and cluster operators gained the powerful ability to dynamically adjust CPU and memory allocations of running containers without incurring disruptive restarts or application downtime.

However, in-place resizing introduced a unique resource scheduling gap: if a running Pod requested a resource scale-up that exceeded the host node's allocatable headroom, the Kubelet was forced to mark the request as `Deferred`. The Pod would remain parked in this state indefinitely, waiting for resources on the node to naturally free up.

To bridge this scheduling gap, Kubernetes v1.37 introduces *scheduler preemption for in-place Pod resize* (Alpha), behind the `InPlacePodVerticalScalingSchedulerPreemption` feature gate.
This feature allows the Kubernetes control plane to actively free up capacity on a fully-utilized node by preempting lower-priority workloads, enabling the pending in-place resizes of critical, higher-priority applications to succeed.

## The "deferred" resize challenge

To understand why this preemption mechanism is needed, it is helpful to look at how Kubernetes handles running Pod resizing. When a user or controller (such as the Vertical Pod Autoscaler) updates the resource requests of an active container, the Kubelet evaluates whether the underlying node has enough spare allocatable capacity to fulfill the increase.

If the node's resources are fully utilized and cannot satisfy the new limits, the Kubelet sets the container's `resizeStatus` (reported in the Pod's `status.containerStatuses[]`) to `Deferred`. Unlike an `Infeasible` resize request (which is immediately rejected because it exceeds physical machine boundaries, namespace limit ranges, or admission quotas) a `Deferred` status indicates that the request is valid but is temporarily unable to be actuated, waiting until node capacity becomes available.

Before the introduction of this preemption mechanism, a Pod's in-place resize scale-up request could become permanently blocked if the node was heavily utilized. Even when a critical application (such as an in-memory database or a real-time web server) required more memory to prevent an imminent out-of-memory (OOM) crash, and the node lacked free capacity, the resize remained `Deferred`.

In this scenario, cluster administrators had limited choices:
1. Manually evict lower-priority Pods from the node to clear resource headroom.
2. Rely on the cluster autoscaler to eventually spin up a larger node and reschedule the Pod. However, this is an operation that is highly disruptive and violates the core "no restart" value proposition of in-place scaling.
3. Rely on a custom autoscaling solution, for example a cluster autoscaler that can trigger dynamic node resizing operations itself.

Because the `kube-scheduler` was unaware of deferred resizes on running Pods, it could not leverage standard priority-based preemption to evict lower-priority workloads and make room for the higher-priority running Pod's resource growth.

## Architectural mechanics: How it works

**Scheduler preemption for in-place Pod resize** integrates directly into the core scheduling cycle to coordinate resources dynamically and safely.

### Centralized scheduler tracking
The `kube-scheduler` monitors the cluster for running Pods with a `Deferred` resize status condition. Normally, Pods with `spec.nodeName` populated are considered successfully placed and bypass the active scheduling queue. Under this feature gate, the scheduler intercepts Pods carrying the `Deferred` condition, permitting them to remain in active scheduling evaluations specifically to trigger preemption. The scheduler maintains continuous tracking of these Pods until the Kubelet successfully completes the resize actuation.

### Single-node preemption boundary
Unlike placement preemption, which evaluates all nodes in a cluster to find the best scheduling fit, preemption for in-place resizing is strictly localized to the Pod's currently assigned node. The scheduler identifies eligible lower-priority "victim" Pods on the same host and initiates their graceful eviction, freeing up local capacity.

### Resource reservation safety
To prevent scheduling races and double-allocation, the requested resource delta is considered **already consumed** by the scheduler. These resources are blocked from being assigned to any other scheduling operations, remaining locked until either:
* The Kubelet successfully actuates the resize.
* Or the resize request is reverted back to the original size.

The scheduler computes these effective allocations using a unified resource-accounting safety formula:
$$\text{Effective Pod Request} = \max(\text{spec.requests}, \text{status.allocatedResources}, \text{status.resources.requests})$$

### Separation of concerns & critical admission
A significant architectural benefit of this design is the strict separation of concerns between the Kubelet and the scheduler. Under this feature gate, **the Kubelet's critical Pod admission handler no longer runs local preemption checks or triggers local evictions for in-place resizing operations.** Instead, the Kubelet defers the request and delegates the preemption decision entirely to the scheduler. This guarantees that a single, centralized orchestrator manages all resize-related preemption logic, respecting global priorities, Pod disruption budgets (PDBs), and graceful termination policies.

### Managing competing updates & races
If a competing, higher-priority resize request is submitted for another running Pod on the same node during an active preemption cycle, the Kubelet prioritizes the higher-priority request. The scheduler is designed to observe these updates and will dynamically trigger a new round of preemption if more capacity is required to fulfill the new state.

## Node-level preemption configuration

Administrators and automated controllers (such as a cluster autoscaler) can disable preemption specifically for in-place resizes on particular nodes. This is configured using the new `spec.podPreemptionPolicy` field in the Node Spec:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: batch-workload-node
spec:
  podPreemptionPolicy:
    disableResizePreemption:
      - "cluster-autoscaler.kubernetes.io/disable-preemption"
      - "operator.example.com/policy-override"
```

An example use case for this policy is when a controller would prefer to size down other pods or dynamically adjust the node capacity itself when possible, only enabling scheduler preemption as a last resort.

### API constraints & validation limits

* **List Execution**: The node-level bypass policy is honored **if and only if** the `disableResizePreemption` list is non-empty.
* **Maximum Size**: The array can contain a maximum of **20 items**.
* **Value Format**: Each string in the list must conform strictly to the standard **Kubernetes label key format** (up to 63 characters with optional DNS subdomain prefixes).

## Prerequisites and limitations

To utilize Scheduler Preemption for in-place Pod resize:
* Both the base `InPlacePodVerticalScaling` and the `InPlacePodVerticalScalingSchedulerPreemption` feature gates must be enabled across all control plane components (`kube-apiserver`, `kube-scheduler`) and the `kubelet`.
* Preemption is strictly scoped to the same node where the deferred Pod is running. If a node cannot accommodate the resize even after evicting all eligible lower-priority workloads, the resize remains in the `Deferred` state.

## Getting involved

This feature represents a major step forward for resource scheduling, bringing enterprise-grade density control and workload prioritization to dynamic resource scaling. We invite cluster operators, platform architects, and developers to enable the `InPlacePodVerticalScalingSchedulerPreemption` feature gate in their testing environments and share feedback.

If you want to share your experience with this feature, please get in touch with the community via [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling) or [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node) channels!
