---
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
title: DaemonSet
---

{{< toc >}}

## What is a DaemonSet?

A _DaemonSet_ ensures that all (or some) Nodes run a copy of a Pod.  As nodes are added to the
cluster, Pods are added to them.  As nodes are removed from the cluster, those Pods are garbage
collected.  Deleting a DaemonSet will clean up the Pods it created.

Some typical uses of a DaemonSet are:

- running a cluster storage daemon, such as `glusterd`, `ceph`, on each node.
- running a logs collection daemon on every node, such as `fluentd` or `logstash`.
- running a node monitoring daemon on every node, such as [Prometheus Node Exporter](
  https://github.com/prometheus/node_exporter), `collectd`, Datadog agent, New Relic agent, or Ganglia `gmond`.

In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.

## Writing a DaemonSet Spec

### Create a DaemonSet

You can describe a DaemonSet in a YAML file. For example, the `daemonset.yaml` file below describes a DaemonSet that runs the fluentd-elasticsearch Docker image:

{{< code file="daemonset.yaml" >}}

* Create a DaemonSet based on the YAML file:
```
kubectl create -f daemonset.yaml
```

### Required Fields

As with all other Kubernetes config, a DaemonSet needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications/),
[configuring containers](/docs/tasks/), and [object management using kubectl](/docs/concepts/overview/object-management-kubectl/overview/) documents.

A DaemonSet also needs a [`.spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) section.

### Pod Template

The `.spec.template` is one of the required fields in `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a Pod template in a DaemonSet has to specify appropriate
labels (see [pod selector](#pod-selector)).

A Pod Template in a DaemonSet must have a [`RestartPolicy`](/docs/user-guide/pod-states)
 equal to `Always`, or be unspecified, which defaults to `Always`.

### Pod Selector

The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).

As of Kubernetes 1.8, you must specify a pod selector that matches the labels of the
`.spec.template`. The pod selector will no longer be defaulted when left empty. Selector
defaulting was not compatible with `kubectl apply`. Also, once a DaemonSet is created,
its `spec.selector` can not be mutated. Mutating the pod selector can lead to the
unintentional orphaning of Pods, and it was found to be confusing to users.

The `spec.selector` is an object consisting of two fields:

* `matchLabels` - works the same as the `.spec.selector` of a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.

When the two are specified the result is ANDed.

If the `.spec.selector` is specified, it must match the `.spec.template.metadata.labels`. Config with these not matching will be rejected by the API.

Also you should not normally create any Pods whose labels match this selector, either directly, via
another DaemonSet, or via other controller such as ReplicaSet.  Otherwise, the DaemonSet
controller will think that those Pods were created by it.  Kubernetes will not stop you from doing
this.  One case where you might want to do this is manually create a Pod with a different value on
a node for testing.

### Running Pods on Only Some Nodes

If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create Pods on nodes which match that [node
selector](/docs/concepts/configuration/assign-pod-node/). Likewise if you specify a `.spec.template.spec.affinity`,
then DaemonSet controller will create Pods on nodes which match that [node affinity](/docs/concepts/configuration/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create Pods on all nodes.

## How Daemon Pods are Scheduled

Normally, the machine that a Pod runs on is selected by the Kubernetes scheduler.  However, Pods
created by the DaemonSet controller have the machine already selected (`.spec.nodeName` is specified
when the Pod is created, so it is ignored by the scheduler).  Therefore:

 - The [`unschedulable`](/docs/admin/node/#manual-node-administration) field of a node is not respected
   by the DaemonSet controller.
 - The DaemonSet controller can make Pods even when the scheduler has not been started, which can help cluster
   bootstrap.

Daemon Pods do respect [taints and tolerations](/docs/concepts/configuration/taint-and-toleration),
but they are created with `NoExecute` tolerations for the following taints with no `tolerationSeconds`:

 - `node.kubernetes.io/not-ready`
 - `node.alpha.kubernetes.io/unreachable`

This ensures that when the `TaintBasedEvictions` alpha feature is enabled,
they will not be evicted when there are node problems such as a network partition. (When the
`TaintBasedEvictions` feature is not enabled, they are also not evicted in these scenarios, but
due to hard-coded behavior of the NodeController rather than due to tolerations).

 They also tolerate following `NoSchedule` taints:

 - `node.kubernetes.io/memory-pressure`
 - `node.kubernetes.io/disk-pressure`

When the support to critical pods is enabled and the pods in a DaemonSet are
labeled as critical, the Daemon pods are created with an additional
`NoSchedule` toleration for the `node.kubernetes.io/out-of-disk` taint.

Note that all above `NoSchedule` taints above are created only in version 1.8 or later if the alpha feature `TaintNodesByCondition` is enabled.

Also note that the `node-role.kubernetes.io/master` `NoSchedule` toleration specified in the above example is needed on 1.6 or later to schedule on *master* nodes as this is not a default toleration.

## Communicating with Daemon Pods

Some possible patterns for communicating with Pods in a DaemonSet are:

- **Push**: Pods in the DaemonSet are configured to send updates to another service, such
  as a stats database.  They do not have clients.
- **NodeIP and Known Port**: Pods in the DaemonSet can use a `hostPort`, so that the pods are reachable via the node IPs.  Clients know the list of node IPs somehow, and know the port by convention.
- **DNS**: Create a [headless service](/docs/concepts/services-networking/service/#headless-services) with the same pod selector,
  and then discover DaemonSets using the `endpoints` resource or retrieve multiple A records from
  DNS.
- **Service**: Create a service with the same Pod selector, and use the service to reach a
  daemon on a random node. (No way to reach specific node.)

## Updating a DaemonSet

If node labels are changed, the DaemonSet will promptly add Pods to newly matching nodes and delete
Pods from newly not-matching nodes.

You can modify the Pods that a DaemonSet creates.  However, Pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.


You can delete a DaemonSet.  If you specify `--cascade=false` with `kubectl`, then the Pods
will be left on the nodes.  You can then create a new DaemonSet with a different template.
The new DaemonSet with the different template will recognize all the existing Pods as having
matching labels.  It will not modify or delete them despite a mismatch in the Pod template.
You will need to force new Pod creation by deleting the Pod or deleting the node.

In Kubernetes version 1.6 and later, you can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.

## Alternatives to DaemonSet

### Init Scripts

It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:

- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. Pod templates, `kubectl`) for daemons and applications.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a Pod
  (e.g. start directly via Docker).

### Bare Pods

It is possible to create Pods directly which specify a particular node to run on.  However,
a DaemonSet replaces Pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual Pods.

### Static Pods

It is possible to create Pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/concepts/cluster-administration/static-pod/).
Unlike DaemonSet, static Pods cannot be managed with kubectl
or other Kubernetes API clients.  Static Pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static Pods may be deprecated in the future.

### Deployments

DaemonSets are similar to [Deployments](/docs/concepts/workloads/controllers/deployment/) in that
they both create Pods, and those Pods have processes which are not expected to terminate (e.g. web servers,
storage servers).

Use a Deployment for stateless services, like frontends, where scaling up and down the
number of replicas and rolling out updates are more important than controlling exactly which host
the Pod runs on.  Use a DaemonSet when it is important that a copy of a Pod always run on
all or certain hosts, and when it needs to start before other Pods.
