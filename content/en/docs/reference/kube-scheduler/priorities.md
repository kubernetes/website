---
title: Kubernetes Scheduler's Priorities and Weights
reviewers:
- wgliang
- tengqm
content_template: templates/concept
weight: 30
toc_hide: false
---

{{% capture overview %}}

This page lists available priorities of Kubernetes scheduler.

{{% /capture %}}

{{% capture body %}}

## Priorites

The default scheduler facilitates some of the priority rules with default weight value, the available priorities are listed in the following table,

|Value                           |Default|Default Weight|Kebernetes Version|Usages|
|--------------------------------|-------|--------------|------------------|------|
|`BalancedResourcePriority`        |   Y   |       1      |  `>=1.1`       |Favors nodes with balanced resource usage rate, should **NOT** be used alone, and **MUST** be used together with LeastRequestedPriority. <br>It calculates the difference between the cpu and memory fraction of capacity, and prioritizes the host based on how close the two metrics are to each other.|
|`EqualPriority`                   |   N   |              |  `>=1.1`       |Gives an equal weight of one to all nodes.| 
|`ImageLocalityPriority`           |   Y   |       1      |  `>=1.2`       |Favors nodes that already have requested pod container's images. <br>It will detect whether the requested images are present on a node, and then calculate a score ranging from 0 to 10 based on the total size of those images. <br>If none of the images are present, this node will be given the lowest priority; <br>If some of the images are present on a node, the larger their sizes' sum, the higher the node's priority.| 
|`InterPodAffinityPriority`        |   Y   |       1      |  `>=1.3`       |Computes a sum by iterating through the elements of weightedPodAffinityTerm and adding "weight" to the sum if the corresponding PodAffinityTerm is satisfied for that node; <br>The node(s) with the highest sum are the most preferred. <br>Symmetry need to be considered for preferredDuringSchedulingIgnoredDuringExecution from podAffinity & podAntiAffinity; <br>Symmetry need to be considered for hard requirements from podAffinity.|
|`LeastRequestedPriority`          |   Y   |       1      |  `>=1.0`       |Favors nodes with fewer requested resources. <br>It calculates the percentage of memory and CPU requested by pods scheduled on the node, and prioritizes based on the minimum of the average of the fraction of requested to capacity. <br>Details: (cpu((capacity-sum(requested)) * 10 / capacity) + memory((capacity - sum(requested)) * 10 / capacity)) / 2|
|`MostRequestedPriority`           |   N   |              |  `>=1.4`       |Favors nodes with most requested resources. <br>It calculates the percentage of memory and CPU requested by pods scheduled on the node, and prioritizes based on the maximum of the average of the fraction of requested to capacity. <br>Details: (cpu(10 * sum(requested) / capacity) + memory(10 * sum(requested) / capacity)) / 2|
|`NodeAffinityPriority`            |   Y   |       1      |  `>=1.2`       |Prioritizes nodes according to node affinity scheduling preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution. <br>Each time a node match a preferredSchedulingTerm, it will a get an add of preferredSchedulingTerm.Weight. <br>Thus, the more preferredSchedulingTerms the node satisfies and the more the preferredSchedulingTerm that is satisfied weights, the higher score the node gets.|
|`NodeLabelPriority`               |   N   |              |  `>=1.0`       |Checks whether a particular label exists on a node or not, regardless of its value. <br>If presence is true, prioritizes nodes that have the specified label, regardless of value. <br>If presence is false, prioritizes nodes that do not have the specified label.|
|`NodePreferAvoidPodsPriority`     |   Y   |       10000  |  `>=1.4`       |Priorities nodes according to the node annotation scheduler.alpha.kubernetes.io/preferAvoidPods.|
|`RequestedToCapacityRatioPriority`|   N   |              |  `>=1.11`      |Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape. <br>The default function assigns 1.0 to resource when all capacity is available and 0.0 when requested amount is equal to capacity.|
|`ResourceLimitsPriority`          |   N   |              |  `>=1.13`       |Increases score of input node by 1 if the node satisfies input pod's resource limits. <br>In detail, this priority function works as follows, <br>If a node does not publish its allocatable resources (cpu and memory both), the node score is not affected. <br>If a pod does not specify its cpu and memory limits both, the node score is not affected. <br>If one or both of cpu and memory limits of the pod are satisfied, the node is assigned a score of 1. <br>Rationale of choosing the lowest score of 1 is that this is mainly selected to break ties between nodes that have same scores assigned by one of least and most requested priority functions.|
|`SelectorSpreadPriority`          |   Y   |       1      | `>=1.1`        |Spreads pods across hosts, considering pods belonging to the same service,RC,RS or StatefulSet. <br>When a pod is scheduled, it looks for services, RCs,RSs and StatefulSets that match the pod, then finds existing pods that match those selectors. <br>It favors nodes that have fewer existing matching pods. <br>i.e. it pushes the scheduler towards a node where there's the smallest number of pods which match the same service, RC,RSs or StatefulSets selectors as the pod being scheduled.|
|`ServiceSpreadingPriority`        |   N   |              |  `>=1.0`       |Spreads pods by minimizing the number of pods (belonging to the same service) on the same node. Largely replaced by "SelectorSpreadPriority", backward compatibility with 1.0.|
|`TaintTolerationPriority`         |   Y   |       1      |  `>=1.3`       |Prepares the priority list for all the nodes based on the number of intolerable taints on the node|

{{% /capture %}}


