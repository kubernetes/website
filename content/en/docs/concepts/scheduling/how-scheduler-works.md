---
title: How Scheduler Works
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

Pod placement is a very important part of the container orchestration in Kubernetes and kube-scheduler, one of the core components of Kubernetes, is the one to solve this problem. It's a master components watches newly created pods that have no node assigned. For every pod created, it’s responsible for finding the optimal node for that pod to run on, according to the specific scheduling algorithm and strategy. Nodes in a cluster that meet the scheduling requirements of a pod are called “optimal” nodes. If none of the node is suitable, the pod remains unscheduled until find a “best” one. 

Understanding how does the kube-scheduler works can help us better understand why pod is running on this nodes, how to choose an optimal node,  and helps us better customize and extend our own scheduler.
​    
{{% /capture %}}
​    
{{% capture body %}}

## How does scheduler works

Kube-scheduler is the Kubernetes default scheduler. For every newly created pods or other unscheduled pods, kube-scheduler selects a optimal node for them to run on.  However, every container in pods has different requirements for resources and every pod also has different requirements. Therefore, existing nodes need to be filtered according to the specific scheduling algorithm and strategy. Factors that need taken into account for scheduling decisions include individual and collective resource requirements, QoS(Quality of Service) requirements, hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference, deadlines and so on.



Kube-scheduler selects a node for the pod in a 2-step operation:

1. **Predicates**：filter the nodes

2. **Priorities**：prioritize the filtered list of nodes


The predicates step is filtering out the inappropriate nodes based on some "predicates policies". For example, the PodFitsResources policy means whether node has enough available resource to meet node's specifies resource requests. After predicates step, the suitable node are remaining and it is ofen there are more than one nodes. 

The priorities step is ranking the remaining nodes to find the "best" one for the Pod based on some "priorities policies". For each remaining node, it will has a score according to the policies and the node with highest score is chosen to host the Pod. If there are more than one nodes with equal scores, a random one among them will be chosen.





The default policies are as follows.  For more details about policies and implement your own priority and predicate policy please see [Customization and Extension](/docs/concepts/scheduling/customization-and-extension/).

### Predicates Policies

- `PodFitsHostPorts`: Checks if a node has free ports for the requested pod ports.

- `PodFitsHost`: Checks if a pod spec node name matches the current node.

- `PodFitsResources`: Checks if the free resource (CPU and Memory) meets the requirement of the Pod. 

- `PodMatchNodeSelector`:Checks if a pod node selector matches the node label.

- `NoVolumeZoneConflict`: Evaluate if the volumes a pod requests are available on the node, given the Zone restrictions.

- `MaxEBSVolumeCount`: Ensures that the number of attached ElasticBlockStore volumes does not exceed a maximum value. 

- `MaxGCEPDVolumeCount`: Ensures that the number of attached GCE PersistentDisk volumes does not exceed a maximum value. 

- `MaxCSIVolumeCount`: Decides how many CSI volumes should be attached.

- `MaxAzureDiskVolumeCount`: Fit is determined by whether or not there would be too many Azure Disk volumes attached to the node.

- `NoDiskConflict`: Evaluates if a pod can fit due to the volumes it requests, and those that are already mounted. 

- `GeneralPred`: Checks whether noncriticalPredicates and EssentialPredicates pass. 

- `CheckNodeMemoryPressure`: Checks if a pod can be scheduled on a node reporting memory pressure condition.

- `CheckNodePIDPressure`: Checks if a pod can be scheduled on a node reporting pid pressure condition.

- `CheckNodeDiskPressure`: Checks if a pod can be scheduled on a node reporting disk pressure condition.

- `CheckNodeCondition`: Checks if a pod can be scheduled on a node reporting out of disk, network unavailable and not ready condition. Only node conditions are accounted in this predicate.

- `PodToleratesNodeTaints`: checks if a pod tolerations can tolerate the node taints.

- `CheckVolumeBinding`: Evaluates if a pod can fit due to the volumes it requests, for both bound and unbound PVCs.


### Priorites Policies

- `SelectorSpreadPriority`: Spreads pods across hosts, considering pods belonging to the same service,RC,RS or StatefulSet. 
- `InterPodAffinityPriority`: Computes a sum by iterating through the elements of weightedPodAffinityTerm and adding “weight” to the sum if the corresponding PodAffinityTerm is satisfied for that node; the node(s) with the highest sum are the most preferred.
- `LeastRequestedPriority`: Favors nodes with fewer requested resources. 
- `BalancedResourceAllocation`: Favors nodes with balanced resource usage rate. 
- `NodePreferAvoidPodsPriority`: Priorities nodes according to the node annotation “scheduler.alpha.kubernetes.io/preferAvoidPods”.
- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution.
- `TaintTolerationPriority`: Prepares the priority list for all the nodes based on the number of intolerable taints on the node
- `ImageLocalityPriority`: Favors nodes that already have requested pod container’s images. 
- `ServiceSpreadingPriority`: Spreads pods by minimizing the number of pods (belonging to the same service) on the same node. 
- `EqualPriorityMap`: Gives an equal weight of one to all nodes. 
- `MostRequestedPriority`: Favors nodes with most requested resources. 
- `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape. 
- `CalculateAntiAffinityPriorityMap`: Spreads pods by minimizing the number of pods belonging to the same service on given machine.









{{% /capture %}}
​    
{{% capture whatsnext %}}
​    
{{% /capture %}}
