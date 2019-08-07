---
title: Replication controller
content_template: templates/concept
---

{{% capture overview %}}

The replication controller ensures that a specified number of pod replicas are running at any one
time.
You can set up a ReplicationController object in order to make sure that a pod or a homogeneous set
of pods is always up and available.

{{< note >}}
A [Deployment](/docs/concepts/workloads/deployment/) that configures a [ReplicaSet](/docs/concepts/workloads/replicaset/) is now the recommended way to set up replication.
{{< /note >}}

{{% /capture %}}


{{% capture body %}}

## ReplicationController objects

Each controller in Kubernetes works with a particular set of objects. The _replication controller_
manages Pod objects based on its configuration object, named _ReplicationController_.

## How the replication controller works

The replication controller works similarly to the replica set controller. For a given replication
configuration, the controller matches the running number of pods to the configuration.
If there are too many pods, the replication controller terminates the extra pods.
If there are too few, the replication controller starts more pods.

Unlike manually created pods, pods managed via a ReplicationController
object are automatically replaced if they fail, are deleted, or are
terminated.

To deploy an application (whether it uses one Pod or several), you can use ReplicationController
to act as a supervisor and make sure that the right number of Pods are running for your app.
(In Kubernetes {{< param "version" >}}, Deployment is a better choice).
The replication controller is similar to a process supervisor. Instead of supervising individual
processes on a single server, the replication controller supervises multiple pods
across multiple nodes.

ReplicationController is often abbreviated to "rc" or "rcs" in discussion, and as a shortcut in
kubectl commands.

### Rolling updates

The replication controller is designed to facilitate rolling updates to
a service by replacing pods one-by-one. (For Kubernetes {{< param "version" >}},
you should consider using a Deployment to manage ReplicaSet objects instead).

You can create a new ReplicationController object with a single replica,
scale out the new ReplicationController object whilst scaling in the old
ReplicationController object, and then finally delete the old ReplicationController
object once is reaches 0 replicaes.

If you're using ReplicationController objects, rolling updates are implemented
client-side in {{< glossary_tooltip term_id="kubectl" >}}.
You can learn more about rolling updates from the [`kubectl rolling-update` task](/docs/tasks/run-application/rolling-update-replication-controller/) page.

## Replication controller responsibilities

The replication controller simply ensures that the desired number
of pods matches its label selector and are operational. The controller
counts all matching pods that aren't Terminated.

The replication controller does *not* check Pod readiness nor liveness.

The ReplicationController object was intended to be a composable building-block
primitive. You should consider using resources such as Deployment, that build
upon the replacement for ReplicationController: ReplicaSet.

{{% /capture %}}

{{% capture whatsnext %}}

* Learn to [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)

{{% /capture %}}
