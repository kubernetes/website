---
assignees:
- davidopp
- filipg
- piosz

---

* TOC
{:toc}

# "Guaranteed" scheduling of critical addon pods

## Critical addons

In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of addons which due to various reasons have to run on a regular cluster node, not the master.
Some of them are critical to have a fully functional cluster: Heapster, DNS, UI.
Thus a cluster may stop working properly if a critical addon is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical addon pod or the amount of resources available on the node changed for some other reason).

## Rescheduler: guaranteed scheduling of critical addons

Rescheduler ensures that critical addons are always scheduled
(assuming the cluster has enough resources to run the critical addon pods in the absence of regular pods).
If the scheduler determines that no node has enough free resources to run the critical addon pod
given the pods that are already running in the cluster
(indicated by critical addon pod's pod condition PodScheduled set to false, the reason set to Unschedulable)
the rescheduler tries to free up space for the addon by evicting some pods; then the scheduler will schedule the addon pod.

To avoid situation when another pod is scheduled into the space prepared for the critical addon,
the chosen node gets a temporary taint “CriticalAddonsOnly” before the eviction(s)
(see [more details](https://github.com/kubernetes/kubernetes/blob/master/docs/design/taint-toleration-dedicated.md)).
Each critical addon has to tolerate it,
the other pods shouldn't tolerate the taint. The tain is removed once the addon is successfully scheduled.

*Warning:* currently there is no guarantee which node is chosen and which pods are being killed
in order to schedule crical pod, so if rescheduler is enabled you pods might be occasionally
killed for this purpose.

## Config

Rescheduler doesn't have any user facing configuration (component config) or API.
It's enabled by default. It can be disabled:
* during cluster setup by setting `ENABLE_RESCHEDULER` flag to `false`
* on running cluster by deleting its manifest from master node
(default path `/etc/kubernetes/manifests/rescheduler.manifest`)

### Marking addon as crticical

To be critical an addon has to run in `kube-system` namespace (cofigurable via flag)
and have the following annotations specified:
* `scheduler.alpha.kubernetes.io/critical-pod` set to empty string
* `scheduler.alpha.kubernetes.io/tolerations` set to `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`

The first one marks a pod a critical. The second one is required by Rescheduler algorithm.

