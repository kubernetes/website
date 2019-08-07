---
title: StatefulSet controller
content_template: templates/concept
---

{{% capture overview %}}

The StatefulSet controller ensures that a {{< glossary_tooltip term_id="StatefulSet" >}}
is running on a suitable set of Nodes.

{{% /capture %}}

{{% capture body %}}

The StatefulSet controller is built in to kube-controller-manager.

## Controller behavior

The controller creates a number of Pods for each StatefulSet that it observes,
based on the count of replicas configured for that StatefulSet. The controller
creates these Pods *sequentially*.

When the StatefulSet controller creates a Pod, it adds a label, `statefulset.kubernetes.io/pod-name`,
that is set to the name of the Pod. This label gives each Pod a durable, stable
network identity, that allows you to attach a Service to a specific Pod in
the StatefulSet.
The controller constructs the pod name label valuebased on a pattern:
`$(statefulset name)-$(ordinal)`.

### Storage

If a StatefulSet resource requests storage with a defined
[StorageClass](/docs/concepts/storage/storage-classes/#the-storageclass-resource),
this controller will provide it, via the
[storage provisioner](/docs/concepts/storage/storage-classes/#provisioner) for
that storage class.

### Scaling

With the default `OrderedReady` setting for `.spec.podManagementPolicy`,
the controller treats the Pods in a StatefulSet as having a defined order:

* For a StatefulSet with N replicas, they controller creates Pods in order, working from Pod to Pod (N-1).
* If you reduce the replica count, the controller deletes Pods in reverse order, from {N-1..0}.
* Before a scaling operation is applied to a Pod, the controller waits until the Pods before it are Running and Ready.
* The controller will only delete a Pod once its successors are completely shut down.

If you create a StatefulSet with `.spec.podManagementPolicy` set to
`Parallel`, the controller will launch and delete all its Pods in parallel.

## Updates

StatefulSet's `.spec.updateStrategy` field allows you to configure and disable automated rolling
updates for containers, labels, resource request / limits, and annotations for the Pods in a StatefulSet.

### On Delete

The `OnDelete` update strategy implements the legacy (1.6 and prior) behavior. When a StatefulSet's
`.spec.updateStrategy.type` is set to `OnDelete`, the StatefulSet controller will not automatically
update the Pods in a StatefulSet. Users must manually delete Pods to cause the controller to
create new Pods that reflect modifications made to a StatefulSet's `.spec.template`.

### Rolling Updates

The `RollingUpdate` update strategy implements automated, rolling update for the Pods in a
StatefulSet. It is the default strategy when `.spec.updateStrategy` is left unspecified. When a StatefulSet's `.spec.updateStrategy.type` is set to `RollingUpdate`, the
StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed
in the same order as Pod termination (from the largest ordinal to the smallest), updating
each Pod one at a time. It will wait until an updated Pod is Running and Ready prior to
updating its predecessor.

#### Partitions

The `RollingUpdate` update strategy can be partitioned, by specifying a
`.spec.updateStrategy.rollingUpdate.partition`. If a partition is specified, all Pods with an
ordinal that is greater than or equal to the partition will be updated when the StatefulSet's
`.spec.template` is updated. All Pods with an ordinal that is less than the partition will not
be updated, and, even if they are deleted, they will be recreated at the previous version. If a
StatefulSet's `.spec.updateStrategy.rollingUpdate.partition` is greater than its `.spec.replicas`,
updates to its `.spec.template` will not be propagated to its Pods.

{{% /capture %}}
{{% capture whatsnext %}}

* Follow an example of [deploying a stateful application](/docs/tutorials/stateful-application/basic-stateful-set/).
* Read about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).

{{% /capture %}}

