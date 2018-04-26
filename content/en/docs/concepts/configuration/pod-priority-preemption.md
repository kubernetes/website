---
reviewers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state state="alpha" >}}

[Pods](/docs/user-guide/pods) in Kubernetes 1.8 and later can have priority. Priority
indicates the importance of a Pod relative to other Pods. When a Pod cannot be scheduled,
the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible. In Kubernetes 1.9 and later, Priority also affects scheduling
order of Pods and out-of-resource eviction ordering on the Node.

{{% /capture %}}

{{% capture body %}}

## How to use priority and preemption
To use priority and preemption in Kubernetes 1.8 and later, follow these steps:

1. Enable the feature.

1. Add one or more PriorityClasses.

1. Create Pods with `priorityClassName` set to one of the added PriorityClasses.
Of course you do not need to create the Pods directly; normally you would add 
`priorityClassName` to the Pod template of a collection object like a Deployment.

The following sections provide more information about these steps.

## Enabling priority and preemption

Pod priority and preemption is disabled by default in Kubernetes 1.8.
To enable the feature, set this command-line flag for the API server, scheduler and kubelet:

```
--feature-gates=PodPriority=true
```

Also enable scheduling.k8s.io/v1alpha1 API and Priority [admission controller](/docs/admin/admission-controllers/) in API server:


```
--runtime-config=scheduling.k8s.io/v1alpha1=true --enable-admission-plugins=Controller-Foo,Controller-Bar,...,Priority
```

After the feature is enabled, you can create [PriorityClasses](#priorityclass)
and create Pods with [`priorityClassName`](#pod-priority) set.

If you try the feature and then decide to disable it, you must remove the PodPriority
command-line flag or set it to false, and then restart the API server and
scheduler. After the feature is disabled, the existing Pods keep their priority
fields, but preemption is disabled, and priority fields are ignored, and you
cannot set `priorityClassName` in new Pods.

## How to disable preemption

In Kubernetes 1.11 and later, preemption is controlled by a kube-scheduler flag `disablePreemption`, which is set to `false` by default.

If you want to disable preemption, just set `disablePreemption` to true. This will keep pod priority enabled while preemption is disabled. Here is a sample configuration:

```yaml
apiVersion: componentconfig/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

disablePreemption: true

```

Please note: although preemption of scheduler is enabled by default, preemption will not happen if `PodPriority` feature is not available.

## PriorityClass

A PriorityClass is a non-namespaced object that defines a mapping from a priority
class name to the integer value of the priority. The name is specified in the `name`
field of the PriorityClass object's metadata. The value is specified in the required
`value` field. The higher the value, the higher the priority. 

A PriorityClass object can have any 32-bit integer value smaller than or equal to
1 billion. Larger numbers are reserved for critical system Pods that should not
normally be preempted or evicted. A cluster admin should create one PriorityClass
object for each such mapping that they want.

PriorityClass also has two optional fields: `globalDefault` and `description`.
The `globalDefault` field indicates that the value of this PriorityClass should
be used for Pods without a `priorityClassName`. Only one PriorityClass with
`globalDefault`  set to true can exist in the system. If there is no PriorityClass
with `globalDefault` set, the priority of Pods with no `priorityClassName` is zero.

The `description` field is an arbitrary string. It is meant to tell users of
the cluster when they should use this PriorityClass.

{{< note >}}
**Note 1**: If you upgrade your existing cluster and enable this feature, the priority
of your existing Pods will be considered to be zero.
{{< /note >}}

{{< note >}}
**Note 2**: Addition of a PriorityClass with `globalDefault` set to true does not
change the priorities of existing Pods. The value of such a PriorityClass is used only
for Pods created after the PriorityClass is added.
{{< /note >}}

{{< note >}}
**Note 3**: If you delete a PriorityClass, existing Pods that use the name of the
deleted priority class remain unchanged, but you are not able to create more Pods
that use the name of the deleted PriorityClass.
{{< /note >}}

### Example PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

## Pod priority

After you have one or more PriorityClasses, you can create Pods that specify one
of those PriorityClass names in their specifications. The priority admission
controller uses the `priorityClassName` field and populates the integer value
of the priority. If the priority class is not found, the Pod is rejected.

The following YAML is an example of a Pod configuration that uses the PriorityClass
created in the preceding example. The priority admission controller checks the
specification and resolves the priority of the Pod to 1000000.


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

### Effect of Pod priority on scheduling order

In Kubernetes 1.9 and later, when Pod priority is enabled, scheduler orders pending
Pods by their priority and a pending Pod is placed ahead of other pending Pods with
lower priority in the scheduling queue. As a result, the higher priority Pod may
by scheduled sooner that Pods with lower priority if its scheduling requirements
are met. If such Pod cannot be scheduled, scheduler will continue and tries to
schedule other lower priority Pods. 

## Preemption

When Pods are created, they go to a queue and wait to be scheduled. The scheduler
picks a Pod from the queue and tries to schedule it on a Node. If no Node is found
that satisfies all the specified requirements of the Pod, preemption logic is triggered 
for the pending Pod. Let's call the pending Pod P. Preemption logic tries to find a Node
where removal of one or more Pods with lower priority than P would enable P to be scheduled
on that Node. If such a Node is found, one or more lower priority Pods get
deleted from the Node. After the Pods are gone, P can be scheduled on the Node.

### User exposed information

When Pod P preempts one or more Pods on Node N, `nominatedNodeName` field of Pod P's status is set to 
the name of Node N. This field helps scheduler track resources reserved for Pod P and also gives
users information about preemptions in their clusters.

Please note that Pod P is not necessarily scheduled to the "nominated Node". After victim Pods are
preempted, they get their graceful termination period. If another node becomes available while 
scheduler is waiting for the victim Pods to terminate, scheduler will use the other node to schedule
Pod P. As a result `nominatedNodeName` and `nodeName` of Pod spec are not always the same. Also, if
scheduler preempts Pods on Node N, but then a higher priority Pod than Pod P arrives, scheduler may
give Node N to the new higher priority Pod. In such a case, scheduler clears `nominatedNodeName` of
Pod P. By doing this, scheduler makes Pod P eligible to preempt Pods on another Node.

### Limitations of preemption

#### Graceful termination of preemption victims

When Pods are preempted, the victims get their
[graceful termination period](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).
They have that much time to finish their work and exit. If they don't, they are
killed. This graceful termination period creates a time gap between the point
that the scheduler preempts Pods and the time when the pending Pod (P) can be
scheduled on the Node (N). In the meantime, the scheduler keeps scheduling other
pending Pods. As victims exit or get terminated, the scheduler tries to schedule
Pods in the pending queue. Therefore, there is usually a time gap between the point 
that scheduler preempts victims and the time that Pod P is scheduled. In order to
minimize this gap, one can set graceful termination period of lower priority Pods
to zero or a small number.

#### PodDisruptionBudget is supported, but not guaranteed!

A [Pod Disruption Budget (PDB)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
allows application owners to limit the number Pods of a replicated application that
are down simultaneously from voluntary disruptions. Kubernetes 1.9 supports PDB
when preempting Pods, but respecting PDB is best effort. The Scheduler tries to
find victims whose PDB are not violated by preemption, but if no such victims are
found, preemption will still happen, and lower priority Pods will be removed
despite their PDBs  being violated.

#### Inter-Pod affinity on lower-priority Pods

A Node is considered for preemption only when
the answer to this question is yes: "If all the Pods with lower priority than
the pending Pod are removed from the Node, can the pending Pod be scheduled on
the Node?"

{{< note >}}
**Note:** Preemption does not necessarily remove all lower-priority Pods. If the 
pending Pod can be scheduled by removing fewer than all lower-priority Pods, then
only a portion of the lower-priority Pods are removed. Even so, the answer to the
preceding question must be yes. If the answer is no, the Node is not considered
for preemption.
{{< /note >}}

If a pending Pod has inter-pod affinity to one or more of the lower-priority Pods
on the Node, the inter-Pod affinity rule cannot be satisfied in the absence of those
lower-priority Pods. In this case, the scheduler does not preempt any Pods on the
Node. Instead, it looks for another Node. The scheduler might find a suitable Node
or it might not. There is no guarantee that the pending Pod can be scheduled.

Our recommended solution for this problem is to create inter-Pod affinity only towards
equal or higher priority Pods.

#### Cross node preemption

Suppose a Node N is being considered for preemption so that a pending Pod P
can be scheduled on N. P might become feasible on N only if a Pod on another
Node is preempted. Here's an example:

* Pod P is being considered for Node N.
* Pod Q is running on another Node in the same Zone as Node N.
* Pod P has Zone-wide anti-affinity with Pod Q
(`topologyKey: failure-domain.beta.kubernetes.io/zone`).
* There are no other cases of anti-affinity between Pod P and other Pods in the Zone.
* In order to schedule Pod P on Node N, Pod Q can be preempted, but scheduler
does not perform cross-node preemption. So, Pod P will be deemed unschedulable
on Node N.

If Pod Q were removed from its Node, the Pod anti-affinity violation would be gone,
and Pod P could possibly be scheduled on Node N.

We may consider adding cross Node preemption in future versions if we find an
algorithm with reasonable performance. We cannot promise anything at this point, 
and cross Node preemption will not be considered a blocker for Beta or GA.

{{% /capture %}}


