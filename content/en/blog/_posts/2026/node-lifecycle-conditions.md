---
layout: blog
title: "Introducing Node Lifecycle Conditions"
slug: node-lifecycle-conditions
draft: true
author: >
  Ryan Hallisey (NVIDIA)
---

Kubernetes has many ways to describe what is happening on a Node. Readiness,
taints, Pod state, labels, annotations, and provider-specific APIs each expose
part of the picture. What has been missing is a shared, Kubernetes-owned way to
say that a Node is [draining](/docs/tasks/administer-cluster/safely-drain-node/),
undergoing maintenance, or undergoing [Graceful Node Shutdown](/docs/concepts/cluster-administration/node-shutdown/).

Kubernetes v1.37 introduces five well-known [Node conditions](/docs/reference/node/node-status/#condition)
that provide that description:

- `DrainInProgress`
- `Drained`
- `MaintenancePlanned`
- `MaintenanceInProgress`
- `GracefulNodeShutdownInProgress`

<!--more-->

## The new Node lifecycle conditions

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
    lastTransitionTime: "2026-08-05T12:00:00Z"
    message: "Hardware maintenance is scheduled for this Node"
```

## What changes in Kubernetes v1.37

The v1.37 release reserves these names as well-known `NodeConditionType`
constants and introduces the Alpha `NodeLifecycleConditions` feature gate,
which is disabled by default.

For this release, an administrator or an administrator-authorized
controller is responsible for setting and clearing the lifecycle conditions.

In this first release, no core workload controller changes its behavior based
on these conditions. A condition set by an administrator is an observable
signal.

## How to use lifecycle conditions today

The immediate value is operational clarity. Administrators and
lifecycle automation can use these conditions as a common status channel for
Node lifecycle work that already happens today.

For example, maintenance automation can set `MaintenancePlanned` when a future
maintenance window is scheduled, then set `MaintenanceInProgress` when work
starts. Drain automation can set `DrainInProgress` when it begins evicting Pods
and `Drained` when the administrator's selected drain criteria have been met.
The `GracefulNodeShutdownInProgress` condition can report that Graceful Node
Shutdown is in progress on the Node.

The recommended pattern is to use lifecycle conditions as status. Continue to
use existing Kubernetes mechanisms such as [`kubectl cordon`](/docs/reference/kubectl/generated/kubectl_cordon/),
[`kubectl drain`](/docs/tasks/administer-cluster/safely-drain-node/),
[taints](/docs/concepts/scheduling-eviction/taint-and-toleration/), and
workload-specific controls to change scheduling or eviction behavior. Use
lifecycle conditions to make the state of that work visible to people,
dashboards, alerts, and automation that choose to consume the signal.

When setting a condition, use `True` while the lifecycle state is active. Set the
condition to `False`, or remove it, when the state is no longer active. Use a
stable `reason` value and a clear `message` so that both people and automation
can understand why the condition changed. Cluster administrators should also
decide which component owns each lifecycle condition to avoid conflicting writes.

## Why a shared signal matters

Node lifecycle affects components across the cluster. The `kubelet`, node
lifecycle controller, workload controllers, scheduler, autoscalers, storage
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
`kubelet` intentionally terminated during graceful shutdown. A Job controller can
wait indefinitely for a terminal Pod phase on a Node that an administrator is
removing. A storage operator might learn about maintenance only after drain has
already started.

The new conditions provide a stable place on the Node for that missing context,
as part of the
[larger effort to enhance Node Lifecycle management](https://kep.k8s.io/5683).

## The foundation for lifecycle-aware Kubernetes

The value of a shared signal comes from what can consume it — core controllers,
administrators, or the ecosystem of lifecycle projects. Follow-up enhancements
can build on the conditions without every component inventing a different way to
infer Node lifecycle state.

Consider a long-standing DaemonSet rollout edge case. A Node that is broken or
undergoing maintenance can remain unavailable for reasons unrelated to the new
DaemonSet revision. That Node still consumes the rollout's availability budget,
which can slow or block the controller from progressing the rollout on healthy
Nodes.

The DaemonSet controller knows that a Pod is unavailable, but it cannot tell
whether the new revision failed or an administrator intentionally took the Node
out of service. Readiness, taints, and Pod state expose pieces of the situation,
but none provides authoritative maintenance context.

The `MaintenanceInProgress` condition creates a Kubernetes-owned place to publish
that context. Future work can define how the DaemonSet controller uses it for
rollout ordering, availability accounting, and status reporting. Those behaviors
still require careful design, but the goal is for administrators to no longer
have to manually adjust the rollout.

## Future expansions and getting involved

Node lifecycle is a cross-cutting problem. Solving it starts with
components sharing enough context to make compatible decisions.
The next stage is to build on Node Lifecycle Conditions to improve scenarios
such as Graceful Node Shutdown, drain, and maintenance. Longer-term lifecycle
coordination may require explicit ownership, locking, and potentially a
dedicated API.

The Kubernetes ecosystem already includes many solutions for Node maintenance,
remediation, drain, autoscaling, and fleet management. The experience behind
those projects is essential to building a foundation that works across
different environments and operational models. The Node Lifecycle Working Group,
SIG Node, and SIG Apps invite maintainers and users to share their use cases
and ideas to shape the future work.

Follow the work through [KEP-5683: Node Lifecycle Conditions](https://kep.k8s.io/5683).
To participate on our discussions, join one of our groups:

- [Node Lifecycle Working Group](https://www.kubernetes.dev/community/community-groups/wg/node-lifecycle/)
- [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/)
- [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/).
