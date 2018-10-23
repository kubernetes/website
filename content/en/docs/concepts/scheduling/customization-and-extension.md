---
reviewers:
- bsalamat 
- k82cn
- misterikkit
title: Customization and Extension
content_template: templates/concept
weight: 60
---

{{< toc >}}

{{% capture overview %}}

By default, the Kubernetes default scheduler can meet most of the requirements, such as scheduling one Pod to run on Nodes with sufficient resources, or scheduling one Pod to be distributed to different Nodes to balance cluster node resources. But in order to adapt to the user's unique scheduling scenarios and enhance the scalability of scheduling, we need to customize or extend our scheduler. Thanks to the implementation of kube-scheduler plug-in form, users can easily customize and extend it. 

Here are three ways to do this.

{{% /capture %}}

{{% capture body %}}

## Method 1: Customize Predicate and Priority Strategies

Kubernetes' scheduling strategies is divided into Predicates and Priorities. 

- Predicates are a set of strategies applied one by one to filter out inappropriate nodes. All of them are mandatory strategies. They traverse all the Nodes and filter out the matching Node list according to the specific pre-selection strategy. If no Node meets the Predicate strategies, the Pod will remain pending until a Node can satisfy;
- Priorities are a set of strategies applied one by one to rank nodes (that made it through the filter of the predicates). They are to sort the nodes to be selected according to the preferred strategy on the basis of the first step screening, and obtain the optimal one;

The kube-scheduler can specify the scheduling policy file on the component config file at startup, and the user can assemble the Predicate and Priority functions as needed. Selecting different filter functions and priority functions, controlling the weight of the priority function, and adjusting the order of the filter functions all affect the scheduling process.

### Predicate Strategies

The purpose of filtering the nodes is to filter out the nodes that do not meet certain requirements of the Pod. For example, if the free resource on a node (measured by the capacity minus the sum of the resource requests of all the Pods that already run on the node) is less than the Pod's required resource, the node should not be considered in the ranking phase so it is filtered out. Currently, there are several "predicates" implementing different filtering policies, including:

- `PodFitsHostPorts`: Checks if a node has free ports for the requested pod ports.

- `PodFitsHost`: Checks if a pod spec node name matches the current node.

- `PodFitsResources`: Checks if the free resource (CPU and Memory) meets the requirement of the Pod. The free resource is measured by the capacity minus the sum of requests of all Pods on the node. To learn more about the resource QoS in Kubernetes, please check QoS proposal.

- `PodMatchNodeSelector`:Checks if a pod node selector matches the node label.

- `NoVolumeZoneConflict`: Evaluate if the volumes a pod requests are available on the node, given the Zone restrictions.

- `MaxEBSVolumeCount`: Ensures that the number of attached ElasticBlockStore volumes does not exceed a maximum value (by default, 39, since Amazon recommends a maximum of 40 with one of those 40 reserved for the root volume -- see Amazon's documentation). The maximum value can be controlled by setting the KUBE_MAX_PD_VOLS environment variable.

- `MaxGCEPDVolumeCount`: Ensures that the number of attached GCE PersistentDisk volumes does not exceed a maximum value (by default, 16, which is the maximum GCE allows -- see GCE's documentation). The maximum value can be controlled by setting the KUBE_MAX_PD_VOLS environment variable.

- `MaxCSIVolumeCount`:  Decides how many CSI volumes should be attached.

- `MaxAzureDiskVolumeCount`: Fit is determined by whether or not there would be too many Azure Disk volumes attached to the node.

- `NoDiskConflict`: Evaluates if a pod can fit due to the volumes it requests, and those that are already mounted. If there is already a volume mounted on that node, another pod that uses the same volume can't be scheduled there. This is GCE, Amazon EBS, and Ceph RBD specific for now:
  - GCE PD allows multiple mounts as long as they're all read-only
  - AWS EBS forbids any two pods mounting the same volume ID
  - Ceph RBD forbids if any two pods share at least same monitor, and match pool and image.
  - ISCSI forbids if any two pods share at least same IQN, LUN and Target

- `GeneralPred`: Checks whether noncriticalPredicates and EssentialPredicates pass. noncriticalPredicates are the predicates that only non-critical pods need and EssentialPredicates are the predicates that all pods, including critical pods, need.

- `CheckNodeMemoryPressure`: Checks if a pod can be scheduled on a node reporting memory pressure condition.

- `CheckNodePIDPressure`: Checks if a pod can be scheduled on a node reporting pid pressure condition.

- `CheckNodeDiskPressure`: Checks if a pod can be scheduled on a node reporting disk pressure condition.

- `CheckNodeCondition`: Checks if a pod can be scheduled on a node reporting out of disk, network unavailable and not ready condition. Only node conditions are accounted in this predicate.

- `PodToleratesNodeTaints`: checks if a pod tolerations can tolerate the node taints.

- `CheckVolumeBinding`: Evaluates if a pod can fit due to the volumes it requests, for both bound and unbound PVCs.

- `CheckNodeUnschedulablePred`: Checks if a pod can be scheduled on a node with Unschedulable spec.

- `MatchNodeSelector`: Checks if a pod node selector matches the node label.

- `PodFitsResources`: Checks if a node has sufficient resources, such as cpu, memory, gpu, opaque int resources etc to run a pod. First return value indicates whether a node has sufficient resources to run a pod while the second return value indicates the predicate failure reasons if the node has insufficient resources to run the pod.

- `PodToleratesNodeNoExecuteTaints`: checks if a pod tolerations can tolerate the node's NoExecute taints.

- `CheckNodeLabelPresence`: Checks whether all of the specified labels exists on a node or not, regardless of their value. If "presence" is false, then returns false if any of the requested labels matches any of the node's labels,otherwise returns true. If "presence" is true, then returns false if any of the requested labels does not match any of the node's labels,otherwise returns true.Consider the cases where the nodes are placed in regions/zones/racks and these are identified by labels. In some cases, it is required that only nodes that are part of ANY of the defined regions/zones/racks be selected. Alternately, eliminating nodes that have a certain label, regardless of value, is also useful. A node may have a label with "retiring" as key and the date as the value and it may be desirable to avoid scheduling new pods on this node.

- `CheckServiceAffinity`: It is a predicate which matches nodes in such a way to force that ServiceAffinity.labels are homogenous for pods that are scheduled to a node. (i.e. it returns true IFF this pod can be added to this node such that all other pods in the same service are running on nodes with the exact same ServiceAffinity.label values).(WARNING: This Predicate is NOT guaranteed to work if some of the predicateMetadata data isn't precomputed... For that reason it is not exported, i.e. it is highly coupled to the implementation of the FitPredicate construction.)

- `MatchInterPodAffinity`: Checks if a pod can be scheduled on the specified node with pod affinity/anti-affinity configuration. First return value indicates whether a pod can be scheduled on the specified node while the second return value indicates the predicate failure reasons if the pod cannot be scheduled on the specified node.

- `PodFitsHost`: Checks if a pod spec node name matches the current node.

{{< note >}}
**Note:** Bold display is the default predicates.
{{< /note >}}

The details of the above predicates can be found in pkg/scheduler/algorithm/predicates/predicates.go. All predicates mentioned above can be used in combination to perform a sophisticated filtering policy. Kubernetes uses some, but not all, of these predicates by default. You can see which ones are used by default in pkg/scheduler/algorithmprovider/defaults/defaults.go.

### Priority Strategies

The filtered nodes are considered suitable to host the Pod, and it is often that there are more than one nodes remaining. Kubernetes prioritizes the remaining nodes to find the "best" one for the Pod. The prioritization is performed by a set of priority functions. For each remaining node, a priority function gives a score which scales from 0-10 with 10 representing for "most preferred" and 0 for "least preferred". Each priority function is weighted by a positive number and the final score of each node is calculated by adding up all the weighted scores. For example, suppose there are two priority functions, priorityFunc1 and priorityFunc2 with weighting factors weight1 and weight2 respectively, the final score of some NodeA is:

finalScoreNodeA = (weight1 * priorityFunc1) + (weight2 * priorityFunc2)
After the scores of all nodes are calculated, the node with highest score is chosen as the host of the Pod. If there are more than one nodes with equal highest scores, a random one among them is chosen.

Currently, Kubernetes scheduler provides some practical priority functions, including:

- `SelectorSpreadPriority`: Spreads pods across hosts, considering pods belonging to the same service,RC,RS or StatefulSet. When a pod is scheduled, it looks for services, RCs,RSs and StatefulSets that match the pod, then finds existing pods that match those selectors. It favors nodes that have fewer existing matching pods(i.e. it pushes the scheduler towards a node where there's the smallest number of pods which match the same service, RC,RSs or StatefulSets selectors as the pod being scheduled).

- `InterPodAffinityPriority`:Computes a sum by iterating through the elements of weightedPodAffinityTerm and adding "weight" to the sum if the corresponding PodAffinityTerm is satisfied for that node; the node(s) with the highest sum are the most preferred. Symmetry need to be considered for preferredDuringSchedulingIgnoredDuringExecution from podAffinity & podAntiAffinity, symmetry need to be considered for hard requirements from podAffinity.

- `LeastRequestedPriority`: Favors nodes with fewer requested resources. It calculates the percentage of memory and CPU requested by pods scheduled on the node, and prioritizes based on the minimum of the average of the fraction of requested to capacity. Details: (cpu((capacity-sum(requested))*10/capacity) + memory((capacity-sum(requested))*10/capacity))/2.

- `BalancedResourceAllocation`: Favors nodes with balanced resource usage rate. BalancedResourceAllocationMap should **NOT** be used alone, and **MUST** be used together with LeastRequestedPriority. It calculates the difference between the cpu and memory fraction of capacity, and prioritizes the host based on how close the two metrics are to each other. Detail: score = 10 - variance(cpuFraction,memoryFraction,volumeFraction)*10.

- `NodePreferAvoidPodsPriority`: Priorities nodes according to the node annotation "scheduler.alpha.kubernetes.io/preferAvoidPods".

- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution. Each time a node match a preferredSchedulingTerm,
 it will a get an add of preferredSchedulingTerm.Weight. Thus, the more preferredSchedulingTerms the node satisfies and the more the preferredSchedulingTerm that is satisfied weights, the higher score the node gets.

- `TaintTolerationPriority`: Prepares the priority list for all the nodes based on the number of intolerable taints on the node

- `ImageLocalityPriority`: Favors nodes that already have requested pod container's images. It will detect whether the requested images are present on a node, and then calculate a score ranging from 0 to 10 based on the total size of those images.
  - If none of the images are present, this node will be given the lowest priority.
  - If some of the images are present on a node, the larger their sizes' sum, the higher the node's priority.

- `ServiceSpreadingPriority`: Spreads pods by minimizing the number of pods (belonging to the same service) on the same node. Register the factory so that it's available, but do not include it as part of the default priorities. Largely replaced by "SelectorSpreadPriority", but registered for backward compatibility with 1.0.

- `EqualPriorityMap`: Gives an equal weight of one to all nodes. Register the priority function so that its available but do not include it as part of the default priorities.

- `MostRequestedPriority`: Favors nodes with most requested resources. It calculates the percentage of memory and CPU requested by pods scheduled on the node, and prioritizes based on the maximum of the average of the fraction of requested to capacity. Details: (cpu(10 * sum(requested) / capacity) + memory(10 * sum(requested) / capacity)) / 2

- `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape. The default function assigns 1.0 to resource when all capacity is available and 0.0 when requested amount is equal to capacity.

- `CalculateAntiAffinityPriorityMap`: Spreads pods by minimizing the number of pods belonging to the same service on given machine.

- ResourceLimitsPriority: Increases score of input node by 1 if the node satisfies input pod's resource limits. In detail, this priority function works as follows: If a node does not publish its allocatable resources (cpu and memory both), the node score is not affected. If a pod does not specify its cpu and memory limits both, the node score is not affected. If one or both of cpu and memory limits of the pod are satisfied, the node is assigned a score of 1. Rationale of choosing the lowest score of 1 is that this is mainly selected to break ties between nodes that have same scores assigned by one of least and most requested priority functions.

{{< note >}}
Note: Bold display is the default priorities.
{{< /note >}}

The details of the above priority functions can be found in pkg/scheduler/algorithm/priorities. Kubernetes uses some, but not all, of these priority functions by default. You can see which ones are used by default in pkg/scheduler/algorithmprovider/defaults/defaults.go. Similar as predicates, you can combine the above priority functions and assign weight factors (positive number) to them as you want (check scheduler.md for how to customize).

### Implement your own Priority and Predicate Strategies

Kubernetes also allows users to write their own Priority and Predicate strategies.

Predicates function interface:
```none
// FitPredicate is a function that indicates if a pod fits into an existing node.
// The failure information is given by the error.
type FitPredicate func(pod *v1.Pod, meta PredicateMetadata, nodeInfo *schedulercache.NodeInfo) (bool, []PredicateFailureReason, error)
```

The steps to customize the Predicates function are as follows:

1. Write the object in the pkg/scheduler/algorithm/predicates/predicates.go file to implement the above interface.
2. After writing the filter function, register it and let kube-scheduler know it exists when it starts. The registration part can be done at pkg/scheduler/algorithmprovider/defaults/defaults.go. You can refer to the registration of other filter functions (such as PodFitsHostPorts).
3. You can use your own Predicate strategies just like that default.

The custom priority function, the implementation process and the predicate function are similar.


### Custom Strategies

The policies that are applied when scheduling can be chosen in one of two ways. The default policies used are selected by the functions defaultPredicates() and defaultPriorities() in pkg/scheduler/algorithmprovider/defaults/defaults.go. However, the choice of policies can be overridden by setting on the component config file to the scheduler, pointing to a JSON file specifying which scheduling policies to use. 

See examples/scheduler-policy-config.json for an example config file. (Note that the config file format is versioned; the API is defined in pkg/scheduler/api). 
```none
{
"kind" : "Policy",
"apiVersion" : "v1",
"predicates" : [
	{"name" : "PodFitsHostPorts"},
	{"name" : "PodFitsResources"},
	{"name" : "NoDiskConflict"},
	{"name" : "NoVolumeZoneConflict"},
	{"name" : "MatchNodeSelector"},
	{"name" : "HostName"}
	],
"priorities" : [
	{"name" : "LeastRequestedPriority", "weight" : 1},
	{"name" : "BalancedResourceAllocation", "weight" : 1},
	{"name" : "ServiceSpreadingPriority", "weight" : 1},
	{"name" : "EqualPriority", "weight" : 1}
	],
"hardPodAffinitySymmetricWeight" : 10,
"alwaysCheckAllPredicates" : false
}
```

Thus to add a new scheduling policy, you should modify pkg/scheduler/algorithm/predicates/predicates.go or add to the directory pkg/scheduler/algorithm/priorities, and either register the policy in defaultPredicates() or defaultPriorities(), or use a policy config file.


## Method 2: Scheduler Extender

This approach is needed for use cases where scheduling decisions need to be made on resources not directly managed by the standard Kubernetes scheduler. The extender helps make scheduling decisions based on such resources. (Note that the three approaches are not mutually exclusive.)

When scheduling a pod, the extender allows an external process to filter and prioritize nodes. Two separate http/https calls are issued to the extender, one for "filter" and one for "prioritize" actions. To use the extender, you must create a scheduler policy configuration file. The configuration specifies how to reach the extender, whether to use http or https and the timeout.
```none
// ExtenderConfig holds the parameters used to communicate with the extender. If a verb is unspecified/empty,
// it is assumed that the extender chose not to provide that extension.
type ExtenderConfig struct {
  // URLPrefix at which the extender is available
  URLPrefix string
  // Verb for the filter call, empty if not supported. This verb is appended to the URLPrefix when issuing the filter call to extender.
  FilterVerb string
  // Verb for the preempt call, empty if not supported. This verb is appended to the URLPrefix when issuing the preempt call to extender.
  PreemptVerb string
  // Verb for the prioritize call, empty if not supported. This verb is appended to the URLPrefix when issuing the prioritize call to extender.
  PrioritizeVerb string
  // The numeric multiplier for the node scores that the prioritize call generates.
  // The weight should be a positive integer
  Weight int
  // Verb for the bind call, empty if not supported. This verb is appended to the URLPrefix when issuing the bind call to extender.
  // If this method is implemented by the extender, it is the extender's responsibility to bind the pod to apiserver. Only one extender
  // can implement this function.
  BindVerb string
  // EnableHTTPS specifies whether https should be used to communicate with the extender
  EnableHTTPS bool
  // TLSConfig specifies the transport layer security config
  TLSConfig *restclient.TLSClientConfig
  // HTTPTimeout specifies the timeout duration for a call to the extender. Filter timeout fails the scheduling of the pod. Prioritize
  // timeout is ignored, k8s/other extenders priorities are used to select the node.
  HTTPTimeout time.Duration
  // NodeCacheCapable specifies that the extender is capable of caching node information,
  // so the scheduler should only send minimal information about the eligible nodes
  // assuming that the extender already cached full details of all nodes in the cluster
  NodeCacheCapable bool
  // ManagedResources is a list of extended resources that are managed by
  // this extender.
  // - A pod will be sent to the extender on the Filter, Prioritize and Bind
  //   (if the extender is the binder) phases iff the pod requests at least
  //   one of the extended resources in this list. If empty or unspecified,
  //   all pods will be sent to this extender.
  // - If IgnoredByScheduler is set to true for a resource, kube-scheduler
  //   will skip checking the resource in predicates.
  // +optional
  ManagedResources []ExtenderManagedResource
  // Ignorable specifies if the extender is ignorable, i.e. scheduling should not
  // fail when the extender returns an error or is not reachable.
  Ignorable bool
}
```
A sample scheduler policy file with extender configuration:
```none
{
  "predicates": [
    {
      "name": "HostName"
    },
    {
      "name": "MatchNodeSelector"
    },
    {
      "name": "PodFitsResources"
    }
  ],
  "priorities": [
    {
      "name": "LeastRequestedPriority",
      "weight": 1
    }
  ],
  "extenders": [
    {
      "urlPrefix": "http://127.0.0.1:12345/api/scheduler",
      "filterVerb": "filter",
      "enableHttps": false
    }
  ]
}
```

Arguments passed to the FilterVerb endpoint on the extender are the set of nodes filtered through the k8s predicates and the pod. Arguments passed to the PrioritizeVerb endpoint on the extender are the set of nodes filtered through the k8s predicates and extender predicates and the pod.
```none
// ExtenderArgs represents the arguments needed by the extender to filter/prioritize
// nodes for a pod.
type ExtenderArgs struct {
  // Pod being scheduled
  Pod *v1.Pod
  // List of candidate nodes where the pod can be scheduled; to be populated
  // only if ExtenderConfig.NodeCacheCapable == false
  Nodes *v1.NodeList
  // List of candidate node names where the pod can be scheduled; to be
  // populated only if ExtenderConfig.NodeCacheCapable == true
  NodeNames *[]string
}
```

The "filter" call returns a list of nodes (api.NodeList). The "prioritize" call returns priorities for each node (schedulerapi.HostPriorityList).

The "filter" call may prune the set of nodes based on its predicates. Scores returned by the "prioritize" call are added to the k8s scores (computed through its priority functions) and used for final host selection.

Multiple extenders can be configured in the scheduler policy.

## Method 3: Write your own scheduler

In addition to the above two methods, Kubernetes also allows users to write their own scheduler components and reference them when creating resources. Also, you can run multiple scheduler instances simultaneously in the entire cluster, as long as the names do not conflict.

To use a scheduler, fill in the name of the scheduler in the spec.schedulername field of the Pod. The scheduler name provided by Kubernetes is default. If the custom scheduler name is my-scheduler, it will be dispatched only if the spec.schedulername field is my-scheduler.

For example, one of the simplest schedulers can be written in a shell (assuming Kubernetes listens on localhost:8001):

```none
#!/bin/bash
SERVER='localhost:8001'
while true;
do
    for PODNAME in $(kubectl --server $SERVER get pods -o json | jq '.items[] | select(.spec.schedulerName =="my-scheduler") | select(.spec.nodeName == null) | .metadata.name' | tr -d '"')
;
    do
        NODES=($(kubectl --server $SERVER get nodes -o json | jq '.items[].metadata.name' | tr -d '"'))
        NUMNODES=${#NODES[@]}
        CHOSEN=${NODES[$[ $RANDOM % $NUMNODES]]}
        curl --header "Content-Type:application/json" --request POST --data '{"apiVersion":"v1","kind":"Binding","metadata": {"name":"'$PODNAME'"},"target": {"apiVersion":"v1","kind"
: "Node", "name": "'$CHOSEN'"}}' http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding/
        echo "Assigned $PODNAME to $CHOSEN"
    done
    sleep 1
done
```

Now that our second scheduler is running, let’s create some pods, and direct them to be scheduled by either the default scheduler or the one we just deployed. In order to schedule a given pod using a specific scheduler, we specify the name of the scheduler in that pod spec. Let’s look at the examples.

```none
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  # Named schedulerName as my-scheduler
  schedulerName: my-scheduler
  containers:
  - name: nginx
    image: nginx:1.10
```


## What's Next

* Learn more about [Multiple Schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/)

{{% /capture %}}

