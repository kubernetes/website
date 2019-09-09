---
title: Kubernetes Scheduler
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

In Kubernetes, _scheduling_ refers to making sure that {{< glossary_tooltip text="Pods" term_id="pod" >}}
are matched to {{< glossary_tooltip text="Nodes" term_id="node" >}} so that
{{< glossary_tooltip term_id="kubelet" >}} can run them.

{{% /capture %}}

{{% capture body %}}

## Scheduling overview {#scheduling}

A scheduler watches for newly created Pods that have no Node assigned. For
every Pod that the scheduler discovers, the scheduler becomes responsible
for finding the best Node for that Pod to run on. The scheduler reaches
this placement decision taking into account the scheduling principles
described below.

If you want to understand why Pods are placed onto a particular Node,
or if you're planning to implement a custom scheduler yourself, this
page will help you learn about scheduling.

## kube-scheduler

[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
is the default scheduler for Kubernetes and runs as part of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
kube-scheduler is designed so that, if you want and need to, you can
write your own scheduling component and use that instead.

For every newly created pods or other unscheduled pods, kube-scheduler
selects a optimal node for them to run on.  However, every container in
pods has different requirements for resources and every pod also has
different requirements. Therefore, existing nodes need to be filtered
according to the specific scheduling requirements.

In a cluster, Nodes that meet the scheduling requirements for a Pod
are called _feasible_ nodes. If none of the nodes are suitable, the pod
remains unscheduled until the scheduler is able to place it.

The scheduler finds feasible Nodes for a Pod and then runs a set of
functions to score the feasible Nodes and picks a Node with the highest
score among the feasible ones to run the Pod. The scheduler then notifies
the API server about this decision in a process called _binding_.

Factors that need taken into account for scheduling decisions include
individual and collective resource requirements, hardware / software /
policy constraints, affinity and anti-affinity specifications, data
locality, inter-workload interference, and so on.

## Scheduling with kube-scheduler {#kube-scheduler-implementation}

kube-scheduler selects a node for the pod in a 2-step operation:

1. Filtering

2. Scoring


The _filtering_ step finds the set of Nodes where it's feasible to
schedule the Pod. For example, the PodFitsResources filter checks whether a
candidate Node has enough available resource to meet a Pod's specific
resource requests. After this step, the node list contains any suitable
Nodes; often, there will be more than one. If the list is empty, that
Pod isn't (yet) schedulable.

In the _scoring_ step, the scheduler ranks the remaining nodes to choose
the most suitable Pod placement. The scheduler assigns a score to each Node
that survived filtering, basing this score on the active scoring rules.

Finally, kube-scheduler assigns the Pod to the Node with the highest ranking.
If there is more than one node with equal scores, kube-scheduler selects
one of these at random.


### Default policies

kube-scheduler has a default set of scheduling policies.

### Filtering

- `PodFitsHostPorts`: Checks if a Node has free ports (the network protocol kind)
  for the Pod ports the the Pod is requesting.

- `PodFitsHost`: Checks if a Pod specifies a specific Node by it hostname.

- `PodFitsResources`: Checks if the Node has free resources (eg, CPU and Memory)
  to meet the requirement of the Pod.

- `PodMatchNodeSelector`: Checks if a Pod's Node {{< glossary_tooltip term_id="selector" >}}
   matches the Node's {{< glossary_tooltip text="label(s)" term_id="label" >}}.

- `NoVolumeZoneConflict`: Evaluate if the {{< glossary_tooltip text="Volumes" term_id="volume" >}}
  that a Pod requests are available on the Node, given the failure zone restrictions for
  that storage.

- `NoDiskConflict`: Evaluates if a Pod can fit on a Node due to the volumes it requests,
   and those that are already mounted.

- `MaxCSIVolumeCount`: Decides how many {{< glossary_tooltip text="CSI" term_id="csi" >}}
  volumes should be attached, and whether that's over a configured limit.

- `CheckNodeMemoryPressure`: If a Node is reporting memory pressure, and there's no
  configured exception, the Pod won't be scheduled there.

- `CheckNodePIDPressure`: If a Node is reporting that process IDs are scarce, and
  there's no configured exception, the Pod won't be scheduled there.

- `CheckNodeDiskPressure`: If a Node is reporting storage pressure (a filesystem that
   is full or nearly full), and there's no configured exception, the Pod won't be
   scheduled there.

- `CheckNodeCondition`: Nodes can report that they have a completely full filesystem,
  that networking isn't available or that kubelet is otherwise not ready to run Pods.
  If such a condition is set for a Node, and there's no configured exception, the Pod
  won't be scheduled there.

- `PodToleratesNodeTaints`: checks if a Pod's {{< glossary_tooltip text="tolerations" term_id="toleration" >}}
  can tolerate the Node's {{< glossary_tooltip text="taints" term_id="taint" >}}.

- `CheckVolumeBinding`: Evaluates if a Pod can fit due to the volumes it requests.
  This applies for both bound and unbound
  {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}

### Scoring

- `SelectorSpreadPriority`: Spreads Pods across hosts, considering Pods that
   belonging to the same {{< glossary_tooltip text="Service" term_id="service" >}},
   {{< glossary_tooltip term_id="statefulset" >}} or
   {{< glossary_tooltip term_id="replica-set" >}}.

- `InterPodAffinityPriority`: Computes a sum by iterating through the elements
  of weightedPodAffinityTerm and adding “weight” to the sum if the corresponding
  PodAffinityTerm is satisfied for that node; the node(s) with the highest sum
  are the most preferred.

- `LeastRequestedPriority`: Favors nodes with fewer requested resources. In other
  words, the more Pods that are placed on a Node, and the more resources those
  Pods use, the lower the ranking this policy will give.

- `MostRequestedPriority`: Favors nodes with most requested resources. This policy
  will fit the scheduled Pods onto the smallest number of Nodes needed to run your
  overall set of workloads.

- `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape.

- `BalancedResourceAllocation`: Favors nodes with balanced resource usage.

- `NodePreferAvoidPodsPriority`: Priorities nodes according to the node annotation
  `scheduler.alpha.kubernetes.io/preferAvoidPods`. You can use this to hint that
  two different Pods shouldn't run on the same Node.

- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling
   preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution.
   You can read more about this in [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)

- `TaintTolerationPriority`: Prepares the priority list for all the nodes, based on
  the number of intolerable taints on the node. This policy adjusts a node's rank
  taking that list into account.

- `ImageLocalityPriority`: Favors nodes that already have the
  {{< glossary_tooltip text="container images" term_id="image" >}} for that
  Pod cached locally.

- `ServiceSpreadingPriority`: For a given Service, this policy aims to make sure that
  the Pods for the Service run on different nodes. It favouring scheduling onto nodes
  that don't have Pods for the service already assigned there. The overall outcome is
  that the Service becomes more resilient to a single Node failure.

- `CalculateAntiAffinityPriorityMap`: This policy helps implement
  [pod anti-affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).

- `EqualPriorityMap`: Gives an equal weight of one to all nodes.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [scheduler performance tuning](/docs/concepts/scheduling/scheduler-perf-tuning/)
* Read about [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Read the [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for kube-scheduler
* Learn about [configuring multiple schedulers](https://kubernetes.io/docs/tasks/administer-cluster/configure-multiple-schedulers/)
* Learn about [Pod Overhead](/docs/concepts/configuration/pod-overhead/)
{{% /capture %}}
