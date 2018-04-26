---
assignees:
- erictune
title: Daemon Sets
redirect_from:
- "/docs/admin/daemons/"
- "/docs/admin/daemons.html"
---

* TOC
{:toc}

## What is a DaemonSet?

A _DaemonSet_ ensures that all (or some) nodes run a copy of a pod.  As nodes are added to the
cluster, pods are added to them.  As nodes are removed from the cluster, those pods are garbage
collected.  Deleting a DaemonSet will clean up the pods it created.

Some typical uses of a DaemonSet are:

- running a cluster storage daemon, such as `glusterd`, `ceph`, on each node.
- running a logs collection daemon on every node, such as `fluentd` or `logstash`.
- running a node monitoring daemon on every node, such as [Prometheus Node Exporter](
  https://github.com/prometheus/node_exporter), `collectd`, Datadog agent, New Relic agent, or Ganglia `gmond`.

In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.

## Writing a DaemonSet Spec

### Required Fields

As with all other Kubernetes config, a DaemonSet needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications/),
[configuring containers](/docs/user-guide/configuring-containers/), and [working with resources](/docs/concepts/tools/kubectl/object-management-overview/) documents.

A DaemonSet also needs a [`.spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) section.

### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/user-guide/replication-controller/#pod-template).
It has exactly the same schema as a [pod](/docs/user-guide/pods), except
it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a pod, a pod template in a DaemonSet has to specify appropriate
labels (see [pod selector](#pod-selector)).

A pod template in a DaemonSet must have a [`RestartPolicy`](/docs/user-guide/pod-states)
 equal to `Always`, or be unspecified, which defaults to `Always`.

### Pod Selector

The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) or other new resources.

The `spec.selector` is an object consisting of two fields:

* `matchLabels` - works the same as the `.spec.selector` of a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.

When the two are specified the result is ANDed.

If the `.spec.selector` is specified, it must match the `.spec.template.metadata.labels`.  If not
specified, they are defaulted to be equal.  Config with these not matching will be rejected by the API.

Also you should not normally create any pods whose labels match this selector, either directly, via
another DaemonSet, or via other controller such as ReplicationController.  Otherwise, the DaemonSet
controller will think that those pods were created by it.  Kubernetes will not stop you from doing
this.  One case where you might want to do this is manually create a pod with a different value on
a node for testing.

### Running Pods on Only Some Nodes

If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create pods on nodes which match that [node
selector](/docs/concepts/configuration/assign-pod-node/). Likewise if you specify a `.spec.template.spec.affinity` 
then DaemonSet controller will create pods on nodes which match that [node affinity](/docs/concepts/configuration/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create pods on all nodes.

## How Daemon Pods are Scheduled

Normally, the machine that a pod runs on is selected by the Kubernetes scheduler.  However, pods
created by the Daemon controller have the machine already selected (`.spec.nodeName` is specified
when the pod is created, so it is ignored by the scheduler).  Therefore:

 - the [`unschedulable`](/docs/admin/node/#manual-node-administration) field of a node is not respected
   by the DaemonSet controller.
 - DaemonSet controller can make pods even when the scheduler has not been started, which can help cluster
   bootstrap.
   
Daemon pods do respect [taints and tolerations](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature), but they are
created with `NoExecute` tolerations for the `node.alpha.kubernetes.io/notReady` and `node.alpha.kubernetes.io/unreachable`
taints with no `tolerationSeconds`. This ensures that when the `TaintBasedEvictions` alpha feature is enabled,
they will not be evicted when there are node problems such as a network partition. (When the
`TaintBasedEvictions` feature is not enabled, they are also not evicted in these scenarios, but
due to hard-coded behavior of the NodeController rather than due to tolerations).


## Communicating with Daemon Pods

Some possible patterns for communicating with pods in a DaemonSet are:

- **Push**: Pods in the DaemonSet are configured to send updates to another service, such
  as a stats database.  They do not have clients.
- **NodeIP and Known Port**: Pods in the DaemonSet can use a `hostPort`, so that the pods are reachable via the node IPs.  Clients know the list of nodes ips somehow, and know the port by convention.
- **DNS**: Create a [headless service](/docs/user-guide/services/#headless-services) with the same pod selector,
  and then discover DaemonSets using the `endpoints` resource or retrieve multiple A records from
  DNS.
- **Service**: Create a service with the same pod selector, and use the service to reach a
  daemon on a random node. (No way to reach specific node.)

## Updating a DaemonSet

If node labels are changed, the DaemonSet will promptly add pods to newly matching nodes and delete
pods from newly not-matching nodes.

You can modify the pods that a DaemonSet creates.  However, pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.


You can delete a DaemonSet.  If you specify `--cascade=false` with `kubectl`, then the pods
will be left on the nodes.  You can then create a new DaemonSet with a different template.
the new DaemonSet with the different template will recognize all the existing pods as having
matching labels.  It will not modify or delete them despite a mismatch in the pod template.
You will need to force new pod creation by deleting the pod or deleting the node.

In Kubernetes version 1.6 and later, you can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.

Future releases of Kubernetes will support controlled updating of nodes.

## Alternatives to DaemonSet

### Init Scripts

It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:

- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. pod templates, `kubectl`) for daemons and applications.
- Future versions of Kubernetes will likely support integration between DaemonSet-created
  pods and node upgrade workflows.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a pod
  (e.g. start directly via Docker).

### Bare Pods

It is possible to create pods directly which specify a particular node to run on.  However,
a DaemonSet replaces pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual pods.

### Static Pods

It is possible to create pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/concepts/cluster-administration/static-pod/).
Unlike DaemonSet, static pods cannot be managed with kubectl
or other Kubernetes API clients.  Static pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static pods may be deprecated in the future.

### Replication Controller

DaemonSet are similar to [Replication Controllers](/docs/user-guide/replication-controller) in that
they both create pods, and those pods have processes which are not expected to terminate (e.g. web servers,
storage servers).

Use a replication controller for stateless services, like frontends, where scaling up and down the
number of replicas and rolling out updates are more important than controlling exactly which host
the pod runs on.  Use a Daemon Controller when it is important that a copy of a pod always run on
all or certain hosts, and when it needs to start before other pods.
