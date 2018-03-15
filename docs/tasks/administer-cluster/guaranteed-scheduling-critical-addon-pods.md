---
reviewers:
- davidopp
- filipg
- piosz
title: Guaranteed Scheduling For Critical Add-On Pods
---

* TOC
{:toc}

## Overview

In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of add-ons which, for various reasons, must run on a regular cluster node (rather than the Kubernetes master).
Some of these add-ons are critical to a fully functional cluster, such as Heapster, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).

## Rescheduler: guaranteed scheduling of critical add-ons
**Rescheduler is deprecated as of Kubernetes 1.10 and will be removed in version 1.11 in
accordance with the [deprecation policy](/docs/reference/deprecation-policy) for beta features.**

**To avoid eviction of critical pods, you must
[enable priorities in scheduler](/docs/concepts/configuration/pod-priority-preemption/)
before upgrading to Kubernetes 1.10 or higher.**

Rescheduler ensures that critical add-ons are always scheduled
(assuming the cluster has enough resources to run the critical add-on pods in the absence of regular pods).
If the scheduler determines that no node has enough free resources to run the critical add-on pod
given the pods that are already running in the cluster
(indicated by critical add-on pod's pod condition PodScheduled set to false, the reason set to Unschedulable)
the rescheduler tries to free up space for the add-on by evicting some pods; then the scheduler will schedule the add-on pod.

To avoid situation when another pod is scheduled into the space prepared for the critical add-on,
the chosen node gets a temporary taint "CriticalAddonsOnly" before the eviction(s)
(see [more details](https://git.k8s.io/community/contributors/design-proposals/scheduling/taint-toleration-dedicated.md)).
Each critical add-on has to tolerate it,
while the other pods shouldn't tolerate the taint. The taint is removed once the add-on is successfully scheduled.

*Warning:* currently there is no guarantee which node is chosen and which pods are being killed
in order to schedule critical pods, so if rescheduler is enabled your pods might be occasionally
killed for this purpose. Please ensure that rescheduler is not enabled along with priorities & preemptions in default-scheduler as rescheduler is oblivious to priorities and it may evict high priority pods, instead of low priority ones.

## Config

Rescheduler doesn't have any user facing configuration (component config) or API.

### Marking pod as critical when using Rescheduler. 
** Marking pod as critical when using Rescheduler.

To be considered critical, the pod has to run in the `kube-system` namespace (configurable via flag) and

* have the `scheduler.alpha.kubernetes.io/critical-pod` annotation set to empty string, and
* have the PodSpec's `tolerations` field set to `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`.

The first one marks a pod a critical. The second one is required by Rescheduler algorithm.

### Marking pod as critical when priorites are enabled.

To be considered critical, the pod has to run in the `kube-system` namespace (configurable via flag) and

* Have the priorityClass set as "system-cluster-critical" or "system-node-critical", the latter being the highest for entire cluster and `scheduler.alpha.kubernetes.io/critical-pod` annotation set to empty string(This will be deprecated too).
