---
assignees:
- davidopp
- filipg
- piosz

---

* TOC
{:toc}

## Critical addons

In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there is a bunch of addons which due to various reasons have to run on a regular cluster node, not the master.
Some of them are critical to have fully functional cluster: Heapster, DNS, UI.
Users can break their cluster by evicting a critical addon (either manually or as a side effect of an other operation like upgrade)
which possibly can become pending (for example when the cluster is highly utilized).

## Rescheduler: guaranteed scheduling of critical addons

Rescheduler ensures that critical addons are always scheduled (assuming the cluster is big enough).
If one of them is marked by scheduler as unschedulable (pod condition `PodScheduled` set to `false`,
the reason set to `Unschedulable`) the component tries to find a space for the addon
by evicting some pods and then the scheduler will schedule the addon.

To avoid situation when another pod is scheduled into the space prepared for the critical addon,
the chosen node get a temporary taint “CriticalAddonsOnly”. Each critical addons has to tolerate it,
the other pods shouldn't tolerate the taint. The tain is released once the addon is successfully scheduled.

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

