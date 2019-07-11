---
title: DaemonSet controller
content_template: templates/concept
---

{{% capture overview %}}

The DaemonSet controller manages Pods configured via a
{{< glossary_tooltip term_id="daemonset" >}} object, to make sure that some
(or all) Nodes run a copy of a Pod.

{{% /capture %}}


{{% capture body %}}

The DaemonSet controller is built in to kube-controller-manager.

## Controller behavior

The DaemonSet controller ensures that all eligible nodes run a copy of a Pod,
by creating Pods with a Node assignment (one Pod for each eligible Node).

This controller creates one Pod for each Node that the DaemonSet matches.
It creates new Pods in batches, doubling the batch size each time a request
succeeds. This helps to avoid sending a very large number of API requests that
will ultimately all fail with the same error.

To track changes efficiently, this controller labels new Pods using a hash
of the the DaemonSet the Pod belongs to.

If it's managing a Pod on a Node that no longer matches the DaemonSet,
or where the Node no longer exists, the controller will remove that Pod.

If a DaemonSet's Pods fail the controller recreates them, applying a rate
limit to avoid a hot loop of killing and then recreating broken Pods.

## How DaemonSet Pods are scheduled

### Scheduled by DaemonSet controller (disabled by default since v1.12) {#scheduled-by-daemonset-controller}

For most Pods, the main Kubernetes scheduler allocates each Pod to a Node.
However, when the DaemonSet controller creates Pods these already have a node
specified. The scheduler will see that `spec.nodeName` is set and will ignore
that Pod for scheduler.
Therefore:

 - The DaemonSet controller does not respect the
   [`unschedulable`](/docs/admin/node/#manual-node-administration) field of Nodes.
 - The DaemonSet controller can make Pods even when the scheduler has not been
   started. This can help with cluster bootstrap.

### Scheduled by default scheduler (enabled by default since v1.12) {#scheduled-by-default-scheduler}

{{< feature-state state="beta" for-kubernetes-version="1.12" >}}

A DaemonSet ensures that all eligible nodes run a copy of a Pod. Normally, the
Kubernetes scheduler selects the node that a Pod runs on. However, this controller
ceates Pods for DaemonSets with the aim of having each Pod run on a specific Node.
That introduces the following issues:

 * Inconsistent Pod behavior: Normal Pods waiting to be scheduled are created
   and in `Pending` state, but DaemonSet pods are not created in `Pending`
   state. This is confusing to the user.
 * [Pod preemption](/docs/concepts/configuration/pod-priority-preemption/)
   is handled by default scheduler. When preemption is enabled, the DaemonSet controller
   will make scheduling decisions without considering pod priority and preemption.

If you have the
[feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
ScheduleDaemonSetPods enabled, your cluster will schedule DaemonSets using the
default scheduler instead of via this controller.
With ScheduleDaemonSetPods enabled, the DaemonSet controller users
[node affinity`](/docs/concepts/configuration/assign-pod-node/#node-affinity)
so that the Pods it creates are scheduled onto the correct node.

Specifically, the controller acts as if the pod template in the DaemonSet contained
a `RequiredDuringSchedulingIgnoredDuringExecution` node affinity that
requires `nodeName` to be the target Node where the controller is scheduling
a particular Pod.
To be clear: the controller does not make any changes to the DaemonSet's actual
`spec.template`.

If the DaemonSet controller is handling an existing Pod for a DaemonSet, it
will make sure that `nodeAffinity` matches the Node where the Pod is executing,
and that there is only ever one Pod running on a Node for a given DaemonSet.

### Taints and Tolerations

This controller automatically adds the following
{{< glossary_tooltip text="tolerations" term_id="toleration" >}} to
Pods that it creates:

| Toleration                               | Effect     |
| ---------------------------------------- | ---------- |
| `node.kubernetes.io/not-ready`           | NoExecute  |
| `node.kubernetes.io/unreachable`         | NoExecute  |
| `node.kubernetes.io/disk-pressure`       | NoSchedule |
| `node.kubernetes.io/memory-pressure`     | NoSchedule |
| `node.kubernetes.io/unschedulable`       | NoSchedule |
| `node.kubernetes.io/network-unavailable` | NoSchedule |

The default scheduler is therefore willing to place a DaemonSet's Pods
onto Nodes that are not ready to accept workload Pods.

{{% /capture %}}
