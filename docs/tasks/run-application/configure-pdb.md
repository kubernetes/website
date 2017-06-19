---
title: Specifying a Disruption Budget for your Application
---

{% capture overview %}

This page shows how to limit the number of concurrent disruption
that your application experiences, allowing for higher availability
while permitting the cluster administrator to manage the clusters
nodes.

{% endcapture %}

{% capture prerequisites %}
* You are the owner of an application running on a Kubernetes cluster that requires
  high availability.
* You should know how to deploy [Replicated Stateless Applications](docs/tasks/run-application/run-stateless-application-deployment.md)
  and/or [Replicated Stateful Applications](docs/tasks/run-application/run-replicated-stateful-application.md).
* You should have read about the [Pod Disruption Budget concept](docs/tasks/run-application/configure-pdb.md).
* You should confirm with your cluster owner or service provider that they respect
  Pod Disruption Budgets.
{% endcapture %}

{% capture steps %}

## Protecting an Application with a PodDisruptionBudget
1. Identify what application you want to protect with a PodDisruptionBudget (PDB).
1. Determine what level of unavailability you can tolerate.
1. Determine what label will be used to match the application's pods.
1. Create a PDB definition as a YAML file.
1. Create the PDB object from the YAML file.

{% endcapture %}

{% capture discussion %}

TODO: elaborate on above steps.

## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has three fields: 

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
semantics of `PodDisruptionBudget`.

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

{% endcapture %}

{% include templates/task.md %}
