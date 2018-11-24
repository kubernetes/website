---
title: How to Configure Your Kubernetes Scheduler
reviewers:
- wgliang
content_template: templates/concept
weight: 30
toc_hide: false
---

{{% capture overview %}}

This is third article of how to use and extend the Kubernetes scheduler series, the whole series of artices are,

* [How does the Kubernetes scheduler work?](TODO)
* [How to customize and extend the kubernetes scheduler?](/docs/concepts/scheduling/customization-and-extension/)
* How to configure your kubernetes scheduler?
* [Choose scheduling algorithms and strategies for your cluster](TODO)
* [Learning kube-scheduler's design and implementation from source code.](TODO)

This page explains how to configure Kubernetes scheduler.

{{% /capture %}}

{{% capture body %}}

## Scheduler

The Kubernetes scheduler is one of main components of Kubernetes and responsible for selecting the best node for the pod running against based on a series of predefined scheduler policies. The Kubenetes provides the default scheduler and policies to place the pod one by one to approprorite node in a Kubernetes cluster.

## Configure the Policies

The Kubernetes scheduler plugin frameworks provides the user to 1) Customize the default scheduler policies and 
2) extend the scheduler or write the new scheduler(s) to either run alongside the default scheduler or replace the default scheduler, please refer to the article [Customization and Extension ](/docs/concepts/scheduling/customization-and-extension/).

The default scheduler policies fit for the most use cases, furthermore the user can fine-tune the scheduler behaviors without modifying the default scheduler, the user can specify the customized policies file when the kube-scheduler starting with the `--policy-config-file` option. 

A example of typical policy file is as follows,

```json
{
   "kind":"Policy",
   "apiVersion":"v1",
   "predicates":[
      {
         "name":"NoVolumeZoneConflict"
      },
      {
         "name":"MaxEBSVolumeCount"
      },
      {
         "name":"MaxGCEPDVolumeCount"
      },
      {
         "name":"MaxAzureDiskVolumeCount"
      },
      {
         "name":"MatchInterPodAffinity"
      },
      {
         "name":"NoDiskConflict"
      },
      {
         "name":"GeneralPredicates"
      },
      {
         "name":"CheckNodeMemoryPressure"
      },
      {
         "name":"CheckNodeDiskPressure"
      },
      {
         "name":"PodToleratesNodeTaints"
      },
      {
         "name":"CheckVolumeBinding"
      }
   ],
   "priorities":[
      {
         "name":"ImageLocalityPriority",
         "weight":1
      },
      {
         "name":"SelectorSpreadPriority",
         "weight":1
      },
      {
         "name":"InterPodAffinityPriority",
         "weight":1
      },
      {
         "name":"LeastRequestedPriority",
         "weight":1
      },
      {
         "name":"BalancedResourceAllocation",
         "weight":1
      },
      {
         "name":"NodeAffinityPriority",
         "weight":1
      },
      {
         "name":"TaintTolerationPriority",
         "weight":1
      }
   ],
}

```

## Predicates

The scheduler policy are mainly composed of predicates and priorities rules, the predicates rules are used for filtering the nodes and the priorities rules are used for electing the best fit nodd. Each priority rule has the "weight" which specifies the factor of each priority rule during the scheduler calculating the score of each candidate node, the node with highest rank will be elected to host the pod. 

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

- CheckNodeCondition 
- CheckNodeUnschedulable
- GeneralPredicates 
- HostName
- PodFitsHostPorts
- MatchNodeSelector 
- PodFitsResources 
- NoDiskConflict
- PodToleratesNodeTaints 
- PodToleratesNodeNoExecuteTaints 
- CheckNodeLabelPresence
- CheckServiceAffinity 
- MaxEBSVolumeCount 
- MaxGCEPDVolumeCount 
- MaxCSIVolumeCount
- MaxAzureDiskVolumeCount 
- CheckVolumeBinding 
- NoVolumeZoneConflict
- CheckNodeMemoryPressure 
- CheckNodePIDPressure 
- CheckNodeDiskPressure 
- MatchInterPodAffinity


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

## User Cases

### checkServiceAffinity

checkServiceAffinity is a predicate which matches nodes in such a way to force that
ServiceAffinity.labels are homogenous for pods that are scheduled to a node.
(i.e. it returns true IFF this pod can be added to this node such that all other pods in
the same service are running on nodes with the exact same ServiceAffinity.label values).

For example:

If the first pod of a service was scheduled to a node with label "region=foo",
all the other subsequent pods belong to the same service will be schedule on
nodes with the same "region=foo" label.


{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Configure Multiple Schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/).
* See [kube-scheduler](docs/reference/command-line-tools-reference/kube-scheduler/) for command line reference.

{{% /capture %}}


