---
assignees:
- erictune
- foxish
- davidopp
title: Disruptions
redirect_from:
- "/docs/admin/disruptions/"
- "/docs/admin/disruptions.html"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/administer-cluster/configure-pod-disruption-budget/"
---

{% capture overview %}
This guide is for application owners who want to build
highly availabile applications, and thus need to understand
what types of Disruptions can happen to Pods.

It is also for Cluster Administrators will want to perform automated
cluster actions, like upgrades and cluster autoscaling.

{% endcapture %}

{:toc}

{% capture body %}

## Voluntary and Involuntary Disruptions

Pods generally do not dissappear until someone (a person or the controller) destroys them
However, once bound to a particular node, it is bound to that node for the rest of its lifetime.
If a node dies or is disconnected, the pod is terminated.  Kubernetes controllers automatically
create replacement pods when this happens.
(Read more about [pod lifetime](docs/concepts/workloads/pods/pod-lifecycle/#pod-lifetime)).)

Some node failures are unavoidable.  We call these *involuntary disruptions* to
an applicaton; for example, a hardware failure, kernel panic may cause
the node to disappear from the cluster, taking its Pods with it.  Other examples
are a node that is `NotReady` a cluster network partition, or an eviction of a pod
from a node due to the node being [out-of-resources](docs/tasks/administer-cluster/out-of-resource.md).

However, sometimes cluster management operations need to terminate pods.
We say these are *voluntary disruptions* since they can be safely delayed for a reasonable period
of time.  Examples are draining a node for maintenance or upgrade (learn how to
[safely drain a node](docs//tasks/administer-cluster/safely-drain-node.md)
) and removing nodes from a cluster to scale it down (learn about
[Cluster Autoscaling](docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)
).  In future releases of Kubernetes, a 
[rescheduler](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/rescheduling.md)
may also perform voluntary evictions.

All sources of voluntary disruptions are optional with Kubernetes.
Ask you cluster administrator or consult your cloud provider or distribution documentation
to determine if any are configured for your cluster.  If none are configured, you can skip
creating Pod Disruption Budgets.

## Dealing with Disruptions

Involuntary disruptions are typically infrequent,
and so it is often sufficient to just accept them. 

If higher availability is needed,
then the application can be replicated.   (Learn about running replicated
[stateless](docs/tasks/run-application/run-stateless-application-deployment.md)
and [stateful](docs/tasks/run-application/run-replicated-stateful-application.md) applications.)
Simultaneous failures of multiple nodes is less likely.  For even higher availability, use
multi-zone clusters, spread applications across racks (using
[anti-affinity](docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature)
or across zones (if using a
[multi-zone cluster](docs/admin/multiple-zones)

When enabled, voluntary evictions can be more frequent.
For example, cluster updates might roll out quarterly, or
cluster autoscaling might consolidate nodes in response to daily demand variations.
More frequent disruptions can mean more reliable and secure clusters (by being up to date),
and lower cost (due to better packing of containers onto nodes).

Kubernetes offers features to help run highly available applications at the same
time as frequent voluntary disruptions.  We call this set of features
*Disruption Budgets*.


## How Disruption Budgets Work

An Application Owner can create a `PodDisruptionBudget` object (PDB) for each application.
a PDB limits the number pods of a replicated application that are down simultaneously due
to voluntary disruptions.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum, even temporarily. A web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total, even briefly.  

Cluster management tools can use the `Eviction API` to "safely delete" pods
while respecting Pod Disruption Budgets.
When a tool attempts to delete a pod using the Eviction API, Kuberetes checks if the proposed
delete would leave the application with enough replicas.  If not, it rejects the request.
The tool retries again later, and will typically succeed later.
The `kubectl drain` tool uses the Eviction API.

A PDB specifies the number of replicas that an application can tolerate having, relative to how
many it is intended to have.  For example, a Deployment which has a `spec.replicas: 5` is
supposed to have 5 pods at any given time.  If its PDB allows for there to be 4 at a time,
then the Eviction API will allow voluntary disruption of one, but not two pods, at a time.

The group of pods that comprise the application is specified using a label selector, the same
as the one used by the application's controller (deployment, stateful-set, etc).

The "intended" number of pods is computed from the `.spec.replicas` of the pods controller.
The controller is discovered from the pods using the `.metadata.ownerRef` of the object.

PDBs cannot prevent [involuntary disruptions](#voluntary-and-involuntary-disruptions) from
occuring. 

Pods which are deleted or unavailable due to a rolling upgrade to an application do count
against the disruption budget, but controllers (like deployment and stateful-set)
are not limited by PDBs whe doing rolling upgrades -- the handling of failures
during application updates is configured in the controller spec.
(Learn about [updating a deployment](docs/concepts/cluster-administration/manage-deployment/#updating-your-application-without-a-service-outage).)

When a pod is evicted using the eviction API, it is gracefully terminated (see
`terminationGracePeriodSeconds` in [PodSpec](/docs/resources-reference/v1.6/#podspec-v1-core).)

## PDB Example

Consider a cluster with 3 nodes, `node-1` through `node-3`.
The cluster is running several applications.  One of them has 3 replicas initially called
`pod-a`, `pod-b`, and `pod-c`.  Another, unrelated pod without a PDB, called `pod-x`, is also shown.
Initially, the pods are layed out as follows:

| pod   | pod status | node   |  node status |
|:-----:|:----------:|:------:|:------------:|
| pod-a |  available | node-1 | normal       |
| pod-x |  available | node-1 | normal       |
| pod-b |  available | node-2 | normal       |
| pod-c |  available | node-3 | normal       |

All 3 pods are part of an deployment, and they collectively have a PDB which requires
that there be at least 2 of the 3 pods available at all times.

The cluster administrator want to reboot into a new kernel version to fix a bug in the kernel.
The cluster administrator first tries to drain `node-1` using the `kubectl drain` command.
That tool tries to evict `pod-a` and `pod-x`.  This succeeds immediately.
Both pods go into the `terminating` state at the same time.
This puts the cluster in this state:

| pod   | pod status  | node   |  node status |
|:-----:|:-----------:|:------:|:------------:|
| pod-a | terminating | node-1 | draining     |
| pod-x | terminating | node-1 | draining     |
| pod-b |  available  | node-2 | normal       |
| pod-c |  available  | node-3 | normal       |

The deployment notices that there is a missing pod, so it creates a replacement,
called `pod-d`.  Since `node-1` is cordoned, it lands on another node.
Also, `pod-x` terminates, and we ignore its replacement.

Now the cluster is in this state:

| pod name |  scheduled where |  status   |
|:--------:|:----------------:|:---------:|
| pod-a    | node-1           | terminating |
| pod-b    | node-2           | available |
| pod-d    | node-2           | not available (starting up) |
| pod-c    | node-3           | available |

| pod   | pod status  | node   |  node status |
|:-----:|:-----------:|:------:|:------------:|
| pod-a | terminating | node-1 | draining     |
| pod-b |  available  | node-2 | normal       |
| pod-c |  available  | node-3 | normal       |
| pod-d | not-available | node-2 | normal     |

At this point, if an impatient cluster administrator tries to drain `node-2` or
`node-3`, they will not succeed, because there are only 2 available pods for the deployment, and its PDB requires at least 2.

After some time passes, `pod-d` becomes available, and, independently, `pod-a` finishes terminating.

(Note: for a StatefulSet, the pod would need to terminate completely before the controller
would create a replacement, but otherwise, things work the same.)

The cluster state now looks like this:

| pod   | pod status  | node   |  node status |
|:-----:|:-----------:|:------:|:------------:|
|       |             | node-1 | drained      |
| pod-b |  available  | node-2 | normal       |
| pod-c |  available  | node-3 | normal       |
| pod-d |  available  | node-2 | normal       |

Now, the cluster admin tries again to drain `pod-b`.
The drain command will try, to evict `pod-b` and `pod-d`.  One will succeed
but the second will fail, and it will retry until a replacement, `pod-e`,
becomes available.  If there are not enough resources in the cluster to schedule
`pod-e` for it to start, then the drain will block.  The cluster may end up in this
state:

| pod   | pod status  | node   |  node status |
|:-----:|:-----------:|:------:|:------------:|
|       |             | node-1 | drained      |
| pod-b |  *deleted*  | node-2 | draining     |
| pod-c |  available  | node-3 | normal       |
| pod-d |  available  | node-2 | draining     |
| pod-e |  available  | node-3 | normal     |
| pod-f |  unscheduled  |      |           |

At this point, the cluster administrator needs to
add a node back to the cluster to proceed with the upgrade.

You can see how Kubernetes determine the rate at which disruptions, like node upgrades,
can happen, varying the rate as the operation progresses, according to:

- how many replicas an application needs
- how long it takes to gracefully shutdown an instance
- how long it takes a new instace to start up
- the type of controller
- the cluster's capacity for new pods

## Separating Cluster Owner and Application Owner Roles

Often, it is useful to think of the Cluster Manager
and Application Owner as separate roles with limited knowlege
of each other.   This separation of responsibilities
may make sense when:

- when there are many application teams sharing a Kubernetes cluster, and 
  there is natural specialization of roles
- when third-party tools or services are used to automate cluster management

Pod Disrutption Budgets supports this separation of roles by providing an
interface between the roles.

If you do not have such a separation of responsibilities in your organization,
you may not need to use Pod Disruption Budgets.  In that case, when performing
cluster management tasks, like upgrading node software, and so on, you will
think the impact on your application at each step.

## How to perform Distruptive Actions your Cluster

If you are a Cluster Administrator, and you need to perform a disruptive action on all
the nodes in your cluster, such as a node or system software upgrade, here are some options:

1. Accept downtime during the upgrade.  Schedule a time for this.
2. Fail over to another complete replica cluster.  No downtime, but may be costly
   both for the duplicated nodes, and for human effort to orchestrate the switchover.
3. Write disruption tolerant applications and use PDBs.  No downtime, lower resource cost, and allows increasing    automation of cluster administration.  PDBs help with this case.  Does require evaluation of

{% endcapture %}


{% capture whatsnext %}

* Follow steps to protect your application by [configuring a Pod Disruption Budget](docs/tasks/run-application//configure-pdb.md).

* Learn more about [draining nodes](docs/tasks/administer-cluster//safely-drain-node.md)

{% endcapture %} 


{% include templates/concept.md %}
