---
toc_hide: true
title: Replication controller
content_template: templates/concept
---

{{% capture overview %}}

The replication controller ensures that a specified number of Pod replicas are running at any one
time.
You can set up a ReplicationController object in order to make sure that a Pod or a homogeneous set
of Pods is always up and available.

{{< note >}}
You should set up replication using a [Deployment](/docs/concepts/workloads/controllers/deployment/) that configures a [ReplicaSet](/docs/concepts/workloads/replicaset/). ReplicationController is available but deprecated.
{{< /note >}}

{{% /capture %}}


{{% capture body %}}

## ReplicationController objects

Each controller in Kubernetes works with a particular set of objects. The _replication controller_
is a {{< glossary_tooltip term_id="controller" text="controller" >}} that
manages Pod objects based on its configuration object (_ReplicationController_).

## Controller behavior

The replication controller works similarly to the ReplicaSet controller. For a given
replication configuration, the replication controller matches the running number of Pods to
its desired state.
If there are too many Pods, this controller selects surplus Pods and removes
(terminates) them.
If there are too few Pods running, this controller creates more. That means that if a
Pod for the ReplicationController's label selector terminates unexpectedly, this
controller will set up a replacement.

{{< note >}}
The ReplicationController controller does not check readiness nor liveness of the Pods
that it manages.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* Read about the [ReplicaSet controller](/docs/reference/controllers/replicaset/)
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)

{{% /capture %}}
