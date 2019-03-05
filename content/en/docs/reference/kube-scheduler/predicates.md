---
title: Kubernetes Scheduler's Predicates and Orders
reviewers:
- wgliang
- tengqm
content_template: templates/concept
weight: 30
toc_hide: false
---

{{% capture overview %}}

This page lists available predicates of Kubernetes scheduler and its order.

{{% /capture %}}

{{% capture body %}}

## Predicates

The scheduler policy is mainly composed of predicates and priorities rules. The predicates rules are used to filter the nodes and the priorities rules are used to elect the best fit node. Each priority rule has a `weight`, which specifies the factor of each rule. The scheduler calculates the score of each candidate node and the node with the highest rank is elected to host the pod.

The default scheduler doesn't facilitate all the predicates, the available predicates are listed in the following table, 

|Value                            |Default|Kubernetes Version|Usages|
|---------------------------------|-------|------------------|------|
|`CheckNodeCondition`             |   Y   |    `>=1.8`       |Checks if a pod can be scheduled on a node reporting out of disk, network unavailable and not ready condition. <br>Only node conditions are accounted in this predicate.|
|`CheckNodeDiskPressure`          |   Y   |    `>=1.4`       |Checks if a pod can be scheduled on a node reporting disk pressure condition.|
|`CheckNodeLabelPresence`         |   N   |    `>=1.0`       |Checks whether all of the specified labels exists on a node or not, regardless of their value. <br>If "presence" is false, then returns false if any of the requested labels matches any of the node's labels, otherwise returns true. <br>If "presence" is true, then returns false if any of the requested labels does not match any of the node's labels, otherwise returns true.
|`CheckNodeMemoryPressure`        |   Y   |    `>=1.3`       |Checks if a pod can be scheduled on a node reporting memory pressure condition.|
|`CheckNodePIDPressure`           |   Y   |    `>=1.10`      |Checks if a pod can be scheduled on a node reporting pid pressure condition.|
|`CheckNodeUnschedulable`         |   N   |  `>=1.13`        |Checks if a pod can be scheduled on a node with Unschedulable spec.|
|`CheckServiceAffinity`           |   N   |  `>=1.0`         |Matches nodes in such a way to force that ServiceAffinity.labels are homogenous for pods that are scheduled to a node.|
|`CheckVolumeBinding`             |   Y   |  `>=1.9`         |Evaluates if a pod can fit due to the volumes it requests, for both bound and unbound PVCs.|
|`GeneralPredicates`              |   Y   |  `>=1.3`         |Checks whether noncriticalPredicates and EssentialPredicates pass.|
|`HostName`                       |   N   |  `>=1.1`         |Filters out all nodes except the one specified in the PodSpec's NodeName field.|
|`MatchInterPodAffinity`          |   Y   |  `>=1.3`         |Checks if a pod can be scheduled on the specified node with pod affinity/anti-affinity configuration. |      
|`MatchNodeSelector`              |   N   |  `>=1.0`         |Checks if a pod node selector matches the node label.|
|`MaxAzureDiskVolumeCount`        |   Y   |  `>=1.2`         |Checkes whether or not there would be too many Azure Disk volumes attached to the node|
|`MaxCSIVolumeCount`              |   Y   |  `>=1.13`        |Checks whether or not there would be too many CSI volumes attached to the node|
|`MaxEBSVolumeCount`              |   Y   |  `>=1.2`         |Ensures that the number of attached ElasticBlockStore volumes does not exceed a maximum value (by default, 39). <br>The maximum value can be controlled by setting the KUBE_MAX_PD_VOLS environment variable.|
|`MaxGCEPDVolumeCount`            |   Y   |  `>=1.2`         |Ensure that the number of attached GCE PersistentDisk volumes does not exceed a maximum value (by default, 16). <br>The maximum value can be controlled by setting the KUBE_MAX_PD_VOLS environment variable.
|`NoDiskConflict`                 |   Y   |  `>=1.0`         |Evaluates if a pod can fit due to the volumes it requests, and those that are already mounted.|
|`NoVolumeZoneConflict`           |   Y   |  `>=1.2`         |Evaluates if the volumes a pod requests are available on the node, given the Zone restrictions.|
|`PodFitsHostPorts`               |   N   |  `>=1.1`         |Checks if a node has free ports for the requested pod ports.|
|`PodFitsPorts`                   |   N   |  `>=1.0`         |Checks if a pod spec node name matches the current node.(superset by PodFitsPorts, back compatiable for 1.0)|
|`PodFitsResources`               |   N   |  `>=1.0`         |Checks if the free resource (CPU and Memory) meets the requirement of the Pod.|
|`PodToleratesNodeNoExecuteTaints`|   N   |  `>=1.13`        |Checks if a pod tolerations can tolerate the node’s NoExecute taints.|
|`PodToleratesNodeTaints`         |   Y   |  `>=1.3`         |Checks if a pod tolerations can tolerate the node taints.


Based on the restrictiveness and computation complexity of predicates, the default order of the predicates is as follows,

|Position |Predicates                       |
|---------|---------------------------------|
|    1    | CheckNodeCondition              |  
|    2    | CheckNodeUnschedulable          |
|    3    | GeneralPredicates               |
|    4    | HostName                        |
|    5    | PodFitsHostPorts                |
|    6    | MatchNodeSelector               | 
|    7    | PodFitsResources                | 
|    8    | NoDiskConflict                  |
|    9    | PodToleratesNodeTaints          | 
|    10   | PodToleratesNodeNoExecuteTaints |
|    11   | CheckNodeLabelPresence          |
|    12   | CheckServiceAffinity            | 
|    13   | MaxEBSVolumeCount               | 
|    14   | MaxGCEPDVolumeCount             |
|    15   | MaxCSIVolumeCount               |
|    16   | MaxAzureDiskVolumeCount         |
|    17   | CheckVolumeBinding              |
|    18   | NoVolumeZoneConflict            |
|    19   | CheckNodeMemoryPressure         |
|    20   | CheckNodePIDPressure            |
|    21   | CheckNodeDiskPressure           |
|    22   | MatchInterPodAffinity           |


{{% /capture %}}


