---
approvers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
---

[Pods](/docs/user-guide/pods) in Kubernetes 1.8 and later can have priority. Priority
indicates the importance of a pod. When a pod cannot be scheduled, scheduler tries
to preempt lower priority pods in order to make scheduling of the pending pod possible.

* TOC
{:toc}

## How to use it
In order to use priority and preemption in Kubernetes 1.8, you should follow these
steps:

1. Enable Priority and Preemption.
1. Add one or more PriorityClasses.
1. Create pods with `PriorityClassName` set to one of the added PriorityClasses.

The following sections provide more information about these steps.

## Enable Priority and Preemption
Pod priority and preemption is disabled by default in Kubernetes 1.8 as it is an
__alpha__ feature. It can be enabled by a command-line flag:

```
--feature-gates=PodPriority=true
```

Once enabled you can add PriorityClasses and create pods with `PriorityClassName` set.
If you tried it and decided to disable it, you must remove this command-line flag or
set it to false and restart API server and Scheduler. Once disabled, the existing
pods may keep their priority fields, but preemption will be disabled and priority
fields will be ignored.

**Note:** Alpha features should not be used in production systems! Alpha 
features are more likely to have bugs and future changes to them are not guaranteed to
be backward compatible.

## PriorityClass
A PriorityClass object defines a mapping from a PriorityClassName to the integer
value of the priority. The higher the value, the higher the priority. PriorityClass
objects can have any 32-bit integer value smaller than or equal to 1 billion. Larger
numbers are reserved for system use.

PriorityClass also has two optional fields: `globaleDefault` and `description`.
`globalDefault` indicates that the value of this PriorityClass should be used for
pods without a `PriorityClassName`. Only one PriorityClass with `globalDefault` 
set to true can exists in the system. If there is no PriorityClass with `globalDefault`
set, priority of pods with no `PriorityClassName` will be zero.

`description` is an arbitrary string. It is meant to tell users of the cluster
when they should use this PriorityClass.


**Note 1:** If you upgrade your existing cluster and enable this feature, the priority
of your existing pods will be considered to be zero.

**Note 2:** Addition of a PriorityClass with `globalDefault` set to true does not
change priority of existing pods. The value of such PriorityClass will be used only
for pods created after the PriorityClass is added.

#### Example PriorityClass
```yaml
apiVersion: v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

## Pod Priority
Once you have one or more PriorityClasses, you can create pods which specify one
of those PriorityClass names in their spec.
The following YAML is an example of a pod configuration that uses the PriorityClass
created above. Priority admission controller checks the spec and resolves the
priority of the pod to 1,000,000.


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
When pods are created, they go to a queue and wait to be scheduled. Scheduler picks a pod
from the queue and tries to schedule it on a node. If no node is found that satisfies
all the specified requirements of the pod, the pod is determined infeasible. At this
point preemption logic is triggered for the pending pod. Let's call the pending pod P.
Preemption logic tries to find a node where removal of pods with lower priority than
P helps schedule P. If such node is found, one or more lower priority pods will
be deleted from the node. Once the pods are gone, P may be scheduled on the node. 

### Limitations of Preemption (alpha version)

#### Starvation of Preempting Pod
When pods are preempted, the victims get their
[graceful termination period](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).
They have so much time to finish their work and exit. If they don't, they will be
killed. This graceful termination period creates a time gap between the point that
scheduler preempts pods until the pending pod (P) can be scheduled on the node (N).
When there are multiple victims on node N, they may exit or get terminated at
various points in time. When one exits, it creates some room on node N. Pod P can
only be scheduled on node N when __all__ the victims exit, but other pods with different requirements
may exist in the scheduling queue that fit on node N when some of the victims have
exited. Scheduler may schedule them on the node. In such a case, it is likely that
when all victims exit, pod P won't fit on node N anymore. So, scheduler will have to
preempt other pods on node N or another node to let P schedule. This scenario may 
be repeated again for the second and subsequent rounds of preemption and P may not
get scheduled for a while. This scenario can cause problems in various clusters, but
is particularly problematic in clusters where many new pods are created all the time.

We intend to address this problem in beta version of pod preemption. The solution
we plan to implement is [provided here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/pod-preemption.md#preemption-mechanics).

#### PodDisruptionBudget is not supported
[Pod Disruption Budget (PDB)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
allows application owners to limit the number pods of a replicated application that
are down simultaneously from voluntary disruptions. However, alpha version of
preemption does not respect PDB when choosing preemption victims.
We plan to add PDB support in beta, but even in beta respecting PDB will be best
effort. Scheduler will try to find victims whose
PDB won't be violated by preemption, but if no such victims are found, preemption
will still happen and lower priority pods will be removed despite their PDBs 
being violated.

#### Inter-Pod Affinity on Lower Priority Pods
The current implementation of preemption considers a node for preemption only when
the answer to this question is positive: "If all the pods with lower priority than
the pending pod are removed from the node, can the pending pod be scheduled on
the node?"

If the answer is no, that node will not be considered for preemption. If the pending
pod has inter-pod affinity on one or more of those lower priority pods on the node, the
inter-pod affinity rule cannot be satisfied in the absence of the lower priority
pods and scheduler will find the pending pod infeasible on the node. As a result,
it will not try to preempt any pods on that node.
Scheduler will try to find other nodes for preemption and could possibly find another
one, but there is no guarantee that such a node will be found.

We may address this issue in future versions, but we don't have a clear plan. Part
of the reason is that finding the set of lower priority pods that satisfy all
inter-pod affinity/anti-affinity rules is computationally expensive and adds
substantial complexity to the preemption logic. Besides, even if preemption keeps the lower
priority pods to satisfy inte-pod affinity, the lower priority pods may be preempted
later by other pods, which removes the benefits of having the complex logic of 
respecting inter-pod affinity to lower priority pods.

Our recommended solution for this problem is to create inter-pod affinity towards
equal or higher priority pods.

#### Cross Node Preemption
When considering a node N for preemption in order to schedule pending pod P,
P may become feasible on N only when pods on other nodes are preempted. For 
example, if there is anti-affinity from existing lower priority pods in a zone
towards pod P, P may be scheduled in the zone only when those lower priority pods
are preempted. Current preemption algorithm does not perform preemption of pods
on nodes other than N, when considering N for preemption.

We may consider adding cross node preemption in future versions if we find an
algorithm with reasonable performance. 

