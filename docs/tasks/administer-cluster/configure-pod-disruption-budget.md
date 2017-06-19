---
assignees:
- davidopp
- foxish
- kow3ns
title: Configuring a Pod Disruption Budget
redirect_from:
- "/docs/admin/disruptions/"
- "/docs/admin/disruptions.html"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
---

This guide is for anyone wishing to specify safety constraints on pods or anyone
wishing to write software (typically automation software) that respects those
constraints.

* TOC
{:toc}

## Rationale

Various cluster management operations may voluntarily evict pods.  "Voluntary"
means an eviction can be safely delayed for a reasonable period of time. The
principal examples today are draining a node for maintenance or upgrade
(`kubectl drain`), and cluster autoscaling down. In the future the
[rescheduler](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/rescheduling.md)
may also perform voluntary evictions.  By contrast, something like evicting pods
because a node has become unreachable or reports `NotReady`, is not "voluntary."

For voluntary evictions, it can be useful for applications to be able to limit
the number of pods that are down simultaneously.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum, even temporarily. Or a web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total, even briefly.  `PodDisruptionBudget` is an API object
that specifies the minimum number or percentage of replicas of a collection that
must be up at a time.  Components that wish to evict a pod subject to disruption
budget use the `/eviction` subresource; unlike a regular pod deletion, this
operation may be rejected by the API server if the eviction would cause a
disruption budget to be violated.

## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has three components, of which two must be specified: 

* A label selector `selector` to specify the set of
pods to which it applies. This is a required field.
* `minAvailable` which is a description of the number of pods from that
set that must still be available after the eviction, i.e. even in the absence
of the evicted pod. `minAvailable` can be either an absolute number or a percentage.
* `maxUnavailable` (available in Kubernetes 1.7 and higher) which is a description 
of the number of pods from that set that can be unavailable after the eviction. 
It can also be either an absolute number or a percentage.

You can specify only one of `maxUnavailable` and `minAvailable` in a single `PodDisruptionBudget`. 
`maxUnavailable` can only be used to control the eviction of pods 
that have an associated controller managing them. In the examples below, "desired replicas"
is the `scale` of the controller managing the pods being selected by the
`PodDisruptionBudget`.

Example 1: With a `minAvailable` of 5, evictions will be allowed as long as they leave behind
5 or more healthy pods among those selected by the PodDisruptionBudget's `selector`.

Example 2: With a `minAvailable` of 30%, evictions will be allowed as long as at least 30%
of the number of desired replicas are healthy. 

Example 3: With a `maxUnavailable` of 5, evictions will be allowed as long as there are at most 5
unhealthy replicas among the total number of desired replicas.

Example 4: With a `maxUnavailable` of 30%, evictions will be allowed as long as no more than 30% 
of the desired replicas are unhealthy.

In typical usage, a single budget would be used for a collection of pods managed by
a controller—for example, the pods in a single ReplicaSet or StatefulSet. 

Note that a disruption budget does not truly guarantee that the specified
number/percentage of pods will always be up.  For example, a node that hosts a
pod from the collection may fail when the collection is at the minimum size
specified in the budget, thus bringing the number of available pods from the
collection below the specified size. The budget can only protect against
voluntary evictions, not all causes of unavailability.

A `maxUnavailable` of 0% (or 0) or a `minAvailable` of 100% (or equal to the
number of replicas) may block node drains entirely. This is permitted as per the 
semantics of `PodDisruptionBudget`. Cluster administrators may restrict this 
behavior through admission control.

You can find examples of pod disruption budgets defined below. They match pods with the label 
`app: zookeeper`.

Example PDB Using maxUnavailable:

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: zookeeper
```

Example PDB Using maxUnavailable (Kubernetes 1.7 or higher):

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: zookeeper
```

For example, if the above `zk-pdb` object selects the pods of a StatefulSet of size 3, both
specifications have the exact same meaning. The use of `maxUnavailable` is recommended as it
automatically responds to changes in the number of replicas of the corresponding controller.

