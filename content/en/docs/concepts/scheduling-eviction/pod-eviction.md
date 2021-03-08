---
title: Pod Eviction
content_type: concept
weight: 10
---

<!-- overview -->

{{< glossary_definition term_id="eviction" length="all" prepend="In Kubernetes, ">}}

<!-- body -->

## Eviction due to resource constraints

In order to preserve the stability of a node, the kubelet will evict (terminate) pods and delete unused images when a node is running out of PIDs, memory, or filesystem storage. If the kubelet allows those resources to be exhausted, the node will become unstable.

A number of other control plane features and logic affect how and when pods are evicted, including:
* [Pod resource requests and limits](/docs/tasks/configure-pod-container/assign-memory-resource/), which are important to 
* [Eviction thresholds](/docs/tasks/administer-cluster/out-of-resource/#eviction-thresholds), which define the triggers at which the kubelet starts to reclaim resources
* [Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/), which is a set of classes for Pods that effect how and when they are evicted. Pods ar evicted in the following order:
  * Pods that are assigned with the `BestEffort` class 
  * Pods that are assigned the `Burstable` class and are using *more* of the starved resources than they requested
  * Pods that are assigned the `Burstable` class and are using *less* of the starved resources than they requested
  * Pods assigned with the `Guaranteed` class
* [Preemption](/docs/concepts/configuration/pod-priority-preemption/#preemption), which as the name suggests is the preemptive eviction of one or more pods to allow for the scheduling of a higher-priority pod and the avoidance of the resource starvation.


## Eviction due to a specific request

As well as being triggered due to resource constraints, evictions can also be triggered by a {{< glossary_tooltip term_id="cluster-operator" >}} or client application.

If you need to perform maintenance on a node, you can safely evict all the pods running on that node using the [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain) command.

If you prefer not to use kubectl drain (such as to avoid calling to an external command, or to get finer control over the pod eviction process), you can also programmatically cause evictions using the [eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api).


## {{% heading "whatsnext" %}}
* [Safely Drain A Node](/docs/tasks/administer-cluster/safely-drain-node)
