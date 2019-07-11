---
toc_hide: true
title: DaemonSet controller
content_template: templates/concept
---

{{% capture overview %}}

The DaemonSet {{< glossary_tooltip term_id="controller" text="controller" >}} manages
{{< glossary_tooltip term_id="pod" text="Pods">}} configured via a
{{< glossary_tooltip term_id="daemonset" >}} object. A DaemonSet makes
sure that, for Nodes meeting some condition you specify, they are
all running a copy of a Pod.

{{< note >}}
If you don't specify any selector for a DaemonSet, this controller runs it on every node.
{{< /note >}}

{{% /capture %}}


{{% capture body %}}

The DaemonSet controller is built into the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

The DaemonSet controller ensures that all eligible nodes run a copy of a Pod,
by creating Pods with a Node assignment (one Pod for each eligible Node).

This controller creates one Pod for each Node that the DaemonSet matches.
It creates new Pods in batches, doubling the batch size each time a request
succeeds. This helps to avoid sending a very large number of API requests that
will ultimately all fail with the same error.

To track changes efficiently, this controller labels new Pods using a hash
of the the DaemonSet the Pod belongs to.

If this controller is managing a Pod on a Node that no longer matches
the DaemonSet, or where the Node no longer exists, the controller will remove
that Pod.

If a DaemonSet's Pods fail the controller recreates them, applying a rate
limit to avoid a hot loop of killing and then recreating broken Pods.

## How DaemonSet Pods are scheduled

A DaemonSet ensures that all eligible nodes run a copy of a Pod. Normally, the
Kubernetes scheduler selects the node that a Pod runs on. However, this controller
ceates Pods for DaemonSets with the aim of having each Pod run on a specific Node.
That would introduce the following issues:

 * Inconsistent Pod behavior: Normal Pods waiting to be scheduled are created
   and in `Pending` state, but DaemonSet pods are not created in `Pending`
   state. This is confusing to the user.
 * [Pod preemption](/docs/concepts/configuration/pod-priority-preemption/)
   is handled by the default scheduler. When preemption is enabled, the DaemonSet
   controller would take scheduling decisions without considering pod priority or
   preemption.

The DaemonSet controller sets
[node affinity](/docs/concepts/configuration/assign-pod-node/#node-affinity)
so that the Pods it creates are scheduled onto the correct Node.

This controller creates Pods with a
`RequiredDuringSchedulingIgnoredDuringExecution` node affinity, so that the
`nodeName` matches the target Node where the DaemonSet controller intends to
place a particular Pod.

If the DaemonSet controller is handling an existing Pod for a DaemonSet, it
makes sure that `nodeAffinity` matches the Node where the Pod is executing,
and that there is only ever one Pod running on a Node for a given DaemonSet.

### Taints and Tolerations

This controller automatically adds
{{< glossary_tooltip text="tolerations" term_id="toleration" >}} to every
Pod that it creates, so that the scheduler is able to place the DaemonSet's
Pods onto Nodes that are not yet ready to accept Pods for application workloads.


{{% /capture %}}
{{% capture whatsnext %}}
* Read about [DaemonSets](/docs/concepts/workloads/daemonset)
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)
{{% /capture %}}
