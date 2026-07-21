---
layout: blog
title: "Introducing Node Lifecycle Conditions"
slug: node-lifecycle-conditions
author: >
  Ryan Hallisey (NVIDIA)
---

# Building Lifecycle-Aware Kubernetes

Kubernetes has many ways to describe what is happening on a Node. Readiness,
taints, Pod state, labels, annotations, and provider-specific APIs each expose
part of the picture. What has been missing is a shared, Kubernetes-owned way to
say that a Node is draining, undergoing maintenance, or undergoing Graceful
Node Shutdown.

Kubernetes v1.37 introduces five well-known Node conditions that provide that
description:

- `DrainInProgress`
- `Drained`
- `MaintenancePlanned`
- `MaintenanceInProgress`
- `GracefulNodeShutdownInProgress`

This is a first step in a [larger effort to enhance Node Lifecycle management](https://github.com/kubernetes/enhancements/issues/5683).
In this phase, the new conditions make lifecycle state observable but core Kubernetes
controllers do not act on them yet. They create a foundation that controllers,
cluster operators, and ecosystem tools can build on.

## Shared Node Lifecycle Signal

Node lifecycle affects components across the cluster. The kubelet, Node
Lifecycle Controller, workload controllers, scheduler, autoscalers, storage
operators, and external maintenance systems all need some understanding of what
is happening to a Node.

Today, each component has to reconstruct that understanding from indirect
signals. One controller might look at Node readiness, another at taints, and
another at Pods that are terminating or missing. Infrastructure providers and
operators often add their own labels or annotations.

Those signals remain useful for their intended purposes, but they do not answer
the same question. A taint can influence scheduling or eviction, for example,
but it does not attest that a drain is in progress or that an administrator's
drain criteria have been met. A `NotReady` Node does not explain whether the
cause is an unexpected failure, a graceful shutdown, or planned maintenance.

Without shared lifecycle context, independently correct components can make
conflicting decisions. A DaemonSet controller can replace a Pod that the
kubelet intentionally terminated during graceful shutdown. A Job controller can
wait indefinitely for a terminal Pod phase on a Node that an administrator is
removing. A storage operator might learn about maintenance only after drain has
already started.

The new conditions provide a stable place on the Node for that missing context.

## The New Node Lifecycle Conditions

| Condition | What it reports |
| --- | --- |
| `DrainInProgress` | The Node is actively being drained according to the administrator's chosen drain criteria. |
| `Drained` | The Node has reached the drain criteria selected by the administrator. |
| `MaintenancePlanned` | The Node is expected to undergo a change in the future. |
| `MaintenanceInProgress` | The Node is actively undergoing maintenance. |
| `GracefulNodeShutdownInProgress` | Graceful Node Shutdown is determined to be in progress on the Node. |

Maintenance can include hardware or software rollout, remediation,
decommissioning, or debugging. Whether maintenance requires a drain depends on
its impact. A Kubernetes upgrade usually should follow a drain, while a kernel
live patch might not need one.

Like other Node conditions, each lifecycle condition uses `status` to report
whether the observation is active:

- `True`: the lifecycle state is currently observed.
- `False`: the lifecycle state is not currently observed.
- `Unknown`: Kubernetes cannot determine whether the lifecycle state is active.

The `reason` provides a stable, machine-readable cause for the current status,
and `message` can provide additional human-readable detail.

For example, an authorized maintenance controller could publish:

```yaml
status:
  conditions:
  - type: MaintenancePlanned
    status: "True"
    reason: MaintenanceWindow
    message: "Hardware maintenance is scheduled for this Node"
```

## What Changes in Kubernetes v1.37

The v1.37 release reserves these names as well-known `NodeConditionType`
constants and introduces the alpha `NodeLifecycleConditions` feature gate,
which is disabled by default.

For this release, an administrator or an administrator-authorized
controller is responsible for setting and clearing the lifecycle conditions.

Just as importantly, no core workload controller changes its behavior based on
these conditions in this first release. A condition set by an administrator is
an observable signal.

## The Foundation for Lifecycle-aware Kubernetes

The value of a shared signal comes from what can consume it - core controllers,
admins, or the ecosystem of lifecycle projects. Follow-up enhancements can build
on the conditions without every component inventing a different way to infer
Node lifecycle state.

Consider a long-standing DaemonSet rollout edge case. A Node that is broken or
undergoing maintenance can remain unavailable for reasons unrelated to the new
DaemonSet revision. That Node still consumes the rollout's availability budget,
which can slow or block the controller from progressing the rollout on healthy
Nodes.

The DaemonSet controller knows that a Pod is unavailable, but it cannot tell
whether the new revision failed or an administrator intentionally took the Node
out of service. Readiness, taints, and Pod state expose pieces of the situation,
but none provides authoritative maintenance context.

`MaintenanceInProgress` creates a Kubernetes-owned place to publish that
context. Future work can define how the DaemonSet controller uses it for rollout
ordering, availability accounting, and status reporting. Those behaviors
still require careful design, but the goal is for admins to no longer
have to manually address the issue.

## Future Expansions and Getting Involved

Node lifecycle is a cross-cutting problem. Solving it starts with
components sharing enough context to make compatible decisions.
The next stage is to build on Node Lifecycle Conditions to improve scenarios
such as Graceful Node Shutdown, drain, and maintenance. Longer-term lifecycle
coordination may require explicit ownership, locking, and potentially a
dedicated API.

The Kubernetes ecosystem already includes many solutions for Node maintenance,
remediation, drain, autoscaling, and fleet management. The experience behind
those projects is essential to building a foundation that works across
different environments and operational models. We invite maintainers
and users to share their use cases and ideas to shape the future work.

Follow the work through [Specialized Lifecycle Management](https://github.com/kubernetes/enhancements/issues/5683)
and [KEP-5683: Node Lifecycle Conditions](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5683-lifecycle-conditions).
To participate, join the [Node Lifecycle Working Group](https://github.com/kubernetes/community/tree/master/wg-node-lifecycle) or SIG Node and SIG Apps discussions.
