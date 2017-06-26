---
assignees:
- davidopp
- filipg
- piosz
title: Guaranteed Scheduling For Critical Add-On Pods
redirect_from:
- "/docs/admin/rescheduler/"
- "/docs/admin/rescheduler.html"
- "/docs/concepts/cluster-administration/guaranteed-scheduling-critical-addon-pods/"
- "/docs/concepts/cluster-administration/guaranteed-scheduling-critical-addon-pods.html"
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

Rescheduler ensures that critical add-ons are always scheduled
(assuming the cluster has enough resources to run the critical add-on pods in the absence of regular pods).
If the scheduler determines that no node has enough free resources to run the critical add-on pod
given the pods that are already running in the cluster
(indicated by critical add-on pod's pod condition PodScheduled set to false, the reason set to Unschedulable)
the rescheduler tries to free up space for the add-on by evicting some pods; then the scheduler will schedule the add-on pod.

To avoid situation when another pod is scheduled into the space prepared for the critical add-on,
the chosen node gets a temporary taint "CriticalAddonsOnly" before the eviction(s)
(see [more details](https://git.k8s.io/community/contributors/design-proposals/taint-toleration-dedicated.md)).
Each critical add-on has to tolerate it,
while the other pods shouldn't tolerate the taint. The taint is removed once the add-on is successfully scheduled.

*Warning:* currently there is no guarantee which node is chosen and which pods are being killed
in order to schedule critical pods, so if rescheduler is enabled your pods might be occasionally
killed for this purpose.

## Config

Rescheduler should be [enabled by default as a static pod](https://git.k8s.io/kubernetes/cluster/saltbase/salt/rescheduler/rescheduler.manifest).
It doesn't have any user facing configuration (component config) or API and can be disabled:

* during cluster setup by setting `ENABLE_RESCHEDULER` flag to `false`
* on running cluster by deleting its manifest from master node
(default path `/etc/kubernetes/manifests/rescheduler.manifest`)

### Marking add-on as critical

To be critical an add-on has to run in `kube-system` namespace (configurable via flag) and
* have the `scheduler.alpha.kubernetes.io/critical-pod` annotation set to empty string, and
* have the PodSpec's `tolerations` field set to `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`

The first one marks a pod a critical. The second one is required by Rescheduler algorithm.
