---
approvers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
---

{% capture overview %}

{% include feature-state-alpha.md %}

[Pods](/docs/user-guide/pods) in Kubernetes 1.8 and later can have priority. Priority
indicates the importance of a Pod relative to other Pods. When a Pod cannot be scheduled,
the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible. In a future Kubernetes release, priority will also affect
out-of-resource eviction ordering on the Node.

**Note:** Preemption does not respect PodDisruptionBudget; see 
[the limitations section](#poddisruptionbudget-is-not-supported) for more details.
{: .note}

{% endcapture %}

{% capture body %}

## How to use priority and preemption
To use priority and preemption in Kubernetes 1.8, follow these steps:

1. Enable the feature.

1. Add one or more PriorityClasses.

1. Create Pods with `PriorityClassName` set to one of the added PriorityClasses.
Of course you do not need to create the Pods directly; normally you would add 
`PriorityClassName` to the Pod template of a collection object like a Deployment.

The following sections provide more information about these steps.

## Enabling priority and preemption

Pod priority and preemption is disabled by default in Kubernetes 1.8.
To enable the feature, set this command-line flag for the API server 
and the scheduler:

```
--feature-gates=PodPriority=true
```

Also set this flag for API server:


```
--runtime-config=scheduling.k8s.io/v1alpha1=true
```

After the feature is enabled, you can create [PriorityClasses](#priorityclass)
and create Pods with [`PriorityClassName`](#pod-priority) set.

If you try the feature and then decide to disable it, you must remove the PodPriority
command-line flag or set it to false, and then restart the API server and
scheduler. After the feature is disabled, the existing Pods keep their priority
fields, but preemption is disabled, and priority fields are ignored, and you
cannot set PriorityClassName in new Pods.

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
be used for Pods without a `PriorityClassName`. Only one PriorityClass with
`globalDefault`  set to true can exist in the system. If there is no PriorityClass
with `globalDefault` set, the priority of Pods with no `PriorityClassName` is zero.

The `description` field is an arbitrary string. It is meant to tell users of
the cluster when they should use this PriorityClass.

**Note 1**: If you upgrade your existing cluster and enable this feature, the priority
of your existing Pods will be considered to be zero.
{: .note}

**Note 2**: Addition of a PriorityClass with `globalDefault` set to true does not
change the priorities of existing Pods. The value of such a PriorityClass is used only
for Pods created after the PriorityClass is added.
{: .note}

**Note 3**: If you delete a PriorityClass, existing Pods that use the name of the
deleted priority class remain unchanged, but you are not able to create more Pods
that use the name of the deleted PriorityClass.
{: .note}

### Example PriorityClass

```yaml
apiVersion: v1
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

## Preemption

When Pods are created, they go to a queue and wait to be scheduled. The scheduler
picks a Pod from the queue and tries to schedule it on a Node. If no Node is found
that satisfies all the specified requirements of the Pod, preemption logic is triggered 
for the pending Pod. Let's call the pending pod P. Preemption logic tries to find a Node
where removal of one or more Pods with lower priority than P would enable P to be scheduled
on that Node. If such a Node is found, one or more lower priority Pods get
deleted from the Node. After the Pods are gone, P can be scheduled on the Node. 

### Limitations of preemption (alpha version)

#### Starvation of preempting Pod

When Pods are preempted, the victims get their
[graceful termination period](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).
They have that much time to finish their work and exit. If they don't, they are
killed. This graceful termination period creates a time gap between the point
that the scheduler preempts Pods and the time when the pending Pod (P) can be
scheduled on the Node (N). In the meantime, the scheduler keeps scheduling other
pending Pods. As victims exit or get terminated, the scheduler tries to schedule
Pods in the pending queue, and one or more of them may be considered and
scheduled to N before the scheduler considers scheduling P on N. In such a case,
it is likely that when all the victims exit, Pod P won't fit on Node N anymore.
So, scheduler will have to preempt other Pods on Node N or another Node so that
P can be scheduled. This scenario might be repeated again for the second and
subsequent rounds of preemption, and P might not get scheduled for a while.
This scenario can cause problems in various clusters, but is particularly
problematic in clusters with a high Pod creation rate.

We will address this problem in the beta version of Pod preemption. The solution
we plan to implement is
[provided here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/pod-preemption.md#preemption-mechanics).

#### PodDisruptionBudget is not supported

A [Pod Disruption Budget (PDB)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
allows application owners to limit the number Pods of a replicated application that
are down simultaneously from voluntary disruptions. However, the alpha version of
preemption does not respect PDB when choosing preemption victims.
We plan to add PDB support in beta, but even in beta, respecting PDB will be best
effort. The Scheduler will try to find victims whose PDB won't be violated by preemption,
but if no such victims are found, preemption will still happen, and lower priority Pods
will be removed despite their PDBs  being violated.

#### Inter-Pod affinity on lower-priority Pods

In version 1.8, a Node is considered for preemption only when
the answer to this question is yes: "If all the Pods with lower priority than
the pending Pod are removed from the Node, can the pending pod be scheduled on
the Node?"

**Note:** Preemption does not necessarily remove all lower-priority Pods. If the 
pending pod can be scheduled by removing fewer than all lower-priority Pods, then
only a portion of the lower-priority Pods are removed. Even so, the answer to the
preceding question must be yes. If the answer is no, the Node is not considered
for preemption.
{: .note}

If a pending Pod has inter-pod affinity to one or more of the lower-priority Pods
on the Node, the inter-Pod affinity rule cannot be satisfied in the absence of those
lower-priority Pods. In this case, the scheduler does not preempt any Pods on the
Node. Instead, it looks for another Node. The scheduler might find a suitable Node
or it might not. There is no guarantee that the pending Pod can be scheduled.

We might address this issue in future versions, but we don't have a clear plan yet.
We will not consider it a blocker for Beta or GA. Part
of the reason is that finding the set of lower-priority Pods that satisfy all
inter-Pod affinity rules is computationally expensive, and adds substantial 
complexity to the preemption logic. Besides, even if preemption keeps the lower-priority
Pods to satisfy inter-Pod affinity, the lower priority Pods might be preempted
later by other Pods, which removes the benefits of having the complex logic of 
respecting inter-Pod affinity.

Our recommended solution for this problem is to create inter-Pod affinity only towards
equal or higher priority pods.

#### Cross node preemption

Suppose a Node N is being considered for preemption so that a pending Pod P
can be scheduled on N. P might become feasible on N only if a Pod on another
Node is preempted. Here's an example:

* Pod P is being considered for Node N.
* Pod Q is running on another Node in the same zone as Node N.
* Pod P has anit-affinity with Pod Q.
* There are no other cases of anti-affinity between Pod P and other Pods in the zone.
* In order to schedule Pod P on Node N, Pod Q should be preempted, but scheduler
does not perform cross-node preemption. So, Pod P will be deemed unschedulable
on Node N.

If Pod Q were removed from its Node, the anti-affinity violation would be gone,
and Pod P could possibly be scheduled on Node N.

We may consider adding cross Node preemption in future versions if we find an
algorithm with reasonable performance. We cannot promise anything at this point, 
and cross Node preemption will not be considered a blocker for Beta or GA.

{% endcapture %}

{% include templates/concept.md %}
