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
If it's managing a Pod on a Node that no longer matches the DaemonSet,
the controller will remove that Pod.

## How DaemonSet Pods are scheduled

### Scheduled by DaemonSet controller (disabled by default since v1.12) {#scheduled-by-daemonset-controller}

For most Pods, the main Kubernetes scheduler allocates each Pod to a Node.
However, Pods created by the DaemonSet controller have the machine already selected (`.spec.nodeName` is specified
when the Pod is created, so it is ignored by the scheduler).  Therefore:

 - The [`unschedulable`](/docs/admin/node/#manual-node-administration) field of a node is not respected
   by the DaemonSet controller.
 - The DaemonSet controller can make Pods even when the scheduler has not been started, which can help cluster
   bootstrap.

### Scheduled by default scheduler (enabled by default since v1.12) {#scheduled-by-default-scheduler}

{{< feature-state state="beta" for-kubernetes-version="1.12" >}}

A DaemonSet ensures that all eligible nodes run a copy of a Pod. Normally, the
node that a Pod runs on is selected by the Kubernetes scheduler. However,
DaemonSet pods are created and scheduled by the DaemonSet controller instead.
That introduces the following issues:

 * Inconsistent Pod behavior: Normal Pods waiting to be scheduled are created
   and in `Pending` state, but DaemonSet pods are not created in `Pending`
   state. This is confusing to the user.
 * [Pod preemption](/docs/concepts/configuration/pod-priority-preemption/)
   is handled by default scheduler. When preemption is enabled, the DaemonSet controller
   will make scheduling decisions without considering pod priority and preemption.

`ScheduleDaemonSetPods` allows you to schedule DaemonSets using the default
scheduler instead of the DaemonSet controller, by adding the `NodeAffinity` term
to the DaemonSet pods, instead of the `.spec.nodeName` term. The default
scheduler is then used to bind the pod to the target host. If node affinity of
the DaemonSet pod already exists, it is replaced. The DaemonSet controller only
performs these operations when creating or modifying DaemonSet pods, and no
changes are made to the `spec.template` of the DaemonSet.

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```

In addition, `node.kubernetes.io/unschedulable:NoSchedule` toleration is added
automatically to DaemonSet Pods. The default scheduler ignores
`unschedulable` Nodes when scheduling DaemonSet Pods.

### Taints and Tolerations

Although DaemonSet Pods respect
{{< glossary_tooltip text="taints" term_id="taint" >}} and
L{{< glossary_tooltip text="tolerations" term_id="toleration" >}},
the following tolerations are added to DaemonSet Pods automatically according to
the related features:

| Toleration Key                           | Effect     | Version | Description                                                  |
| ---------------------------------------- | ---------- | ------- | ------------------------------------------------------------ |
| `node.kubernetes.io/not-ready`           | NoExecute  | 1.13+    | DaemonSet pods will not be evicted when there are node problems such as a network partition. |
| `node.kubernetes.io/unreachable`         | NoExecute  | 1.13+    | DaemonSet pods will not be evicted when there are node problems such as a network partition. |
| `node.kubernetes.io/disk-pressure`       | NoSchedule | 1.8+    |                                                              |
| `node.kubernetes.io/memory-pressure`     | NoSchedule | 1.8+    |                                                              |
| `node.kubernetes.io/unschedulable`       | NoSchedule | 1.12+   | DaemonSet pods tolerate unschedulable attributes by default scheduler.                                                    |
| `node.kubernetes.io/network-unavailable` | NoSchedule | 1.12+   | DaemonSet pods, who uses host network, tolerate network-unavailable attributes by default scheduler.                      |

## Updating a DaemonSet

If node labels are changed, the DaemonSet controller will promptly add Pods to
newly matching nodes and delete Pods from newly not-matching nodes.

You can modify the Pods that a DaemonSet creates.  However, Pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.

You can delete a DaemonSet.  If you specify `--cascade=false` with `kubectl`, then the Pods
will be left on the nodes.  You can then create a new DaemonSet with a different template.
The new DaemonSet with the different template will recognize all the existing Pods as having
matching labels.  It will not modify or delete them despite a mismatch in the Pod template.
You will need to force new Pod creation by deleting the Pod or deleting the node.

In Kubernetes version 1.6 and later, you can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.

{{% /capture %}}
