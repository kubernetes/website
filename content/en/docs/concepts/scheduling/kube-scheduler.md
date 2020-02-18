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

For every newly created pod or other unscheduled pods, kube-scheduler
selects an optimal node for them to run on.  However, every container in
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
1. Scoring

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

There are two supported ways to configure the filtering and scoring behavior
of the scheduler:

1. [Scheduling Policies](#scheduling-policies)
1. [Scheduling Profiles](#scheduling-profiles)

### Scheduling policies

A scheduling Policy can be used to specify the predicates and priorities that
the scheduler runs to filter and score nodes, respectively.

A policy can be specified through a file (via `--policy-config-file` flag) or a
ConfigMap (via `--policy-configmap` flag) that follows the
[Policy type](https://pkg.go.dev/k8s.io/kube-scheduler@v0.18.0/config/v1?tab=doc#Policy).

#### Filtering

The following predicates implement filtering:

- `PodFitsHostPorts`: Checks if a Node has free ports (the network protocol kind)
  for the Pod ports the Pod is requesting.

- `PodFitsHost`: Checks if a Pod specifies a specific Node by its hostname.

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
  {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}.

#### Scoring

The following priorities implement scoring:

- `SelectorSpreadPriority`: Spreads Pods across hosts, considering Pods that
   belong to the same {{< glossary_tooltip text="Service" term_id="service" >}},
   {{< glossary_tooltip term_id="statefulset" >}} or
   {{< glossary_tooltip term_id="replica-set" >}}.

- `InterPodAffinityPriority`: Implements preferred
  [inter pod affininity and antiaffinity](/docs/concepts/configuration/assign-pod-node/#inter-pod-affinity-and-anti-affinity).

- `LeastRequestedPriority`: Favors nodes with fewer requested resources. In other
  words, the more Pods that are placed on a Node, and the more resources those
  Pods use, the lower the ranking this policy will give.

- `MostRequestedPriority`: Favors nodes with most requested resources. This policy
  will fit the scheduled Pods onto the smallest number of Nodes needed to run your
  overall set of workloads.

- `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape.

- `BalancedResourceAllocation`: Favors nodes with balanced resource usage.

- `NodePreferAvoidPodsPriority`: Prioritizes nodes according to the node annotation
  `scheduler.alpha.kubernetes.io/preferAvoidPods`. You can use this to hint that
  two different Pods shouldn't run on the same Node.

- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling
   preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution.
   You can read more about this in [Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/).

- `TaintTolerationPriority`: Prepares the priority list for all the nodes, based on
  the number of intolerable taints on the node. This policy adjusts a node's rank
  taking that list into account.

- `ImageLocalityPriority`: Favors nodes that already have the
  {{< glossary_tooltip text="container images" term_id="image" >}} for that
  Pod cached locally.

- `ServiceSpreadingPriority`: For a given Service, this policy aims to make sure that
  the Pods for the Service run on different nodes. It favours scheduling onto nodes
  that don't have Pods for the service already assigned there. The overall outcome is
  that the Service becomes more resilient to a single Node failure.

- `EqualPriority`: Gives an equal weight of one to all nodes.

- `EvenPodsSpreadPriority`: Implements preferred
  [pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).

### Scheduling profiles

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

In a profile, Plugins that implement scheduling behaviors can be enabled,
disabled and reordered. A plugin implements one or more scheduling extension
points, namely:

1. **QueueSort**: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
1. **PreFilter**: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering.
1. **Filter**: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order.
1. **PreScore**: This is an informational extension point that can be used
   for doing pre-scoring work.
1. **Score**: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
1. **Reserve**: This is an informational extension point that notifies plugins
   when resources have being reserved for a given Pod.
1. **Permit**: These plugins can prevent or delay the binding of a Pod.
1. **PreBind**: These plugins perform any work required before a Pod is bound.
1. **Bind**: The plugins bind a Pod to a Node. Bind plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
1. **PostBind**: This is an informational extension point that is called after
   a Pod has been bound.
1. **UnReserve**: This is an informational extension point that is called if
   a Pod is rejected after being reserved and put on hold by a Permit plugin.

The following plugins, enabled by default, implement one or more of these
extension points:

- `DefaultTopologySpread`: Favors spreading across nodes for Pods that belong to
  services, replica sets and stateful sets.
  Extension points: *PreScore*, *Score*.
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: *Score*.
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/configuration/taint-and-toleration/).
  Implements extension points: *Filter*, *Prescore*, *Score*.
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: *Filter*.
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: *PreFilter*, *Filter*.
- `NodePreferAvoidPods`: Scores nodes according to the node annotation
  `scheduler.alpha.kubernetes.io/preferAvoidPods`.
  Extension points: *Score*.
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/configuration/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/configuration/assign-pod-node/#node-affinity).
  Extension points: *Filter*, *Score*.
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
  Extension points: *PreFilter*, *Filter*, *PreScore*, *Score*.
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: *Filter*.
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting.
  Extension points: *PreFilter*, *Filter*.
- `NodeResourcesBallancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: *Score*.
- `NodeResourcesLeastAllocated`: Favors nodes that have a low allocation of
  resources.
  Extension points: *Score*.
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  volumes.
  Extension points: *Filter*.
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions which are specific to the volume provider.
  Extension points: *Filter*.
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: *Filter*.
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: *Filter*.
- `EBSLimits`: Checks that EBS volume limits can be satisfied for the node.
  Extension points: *Filter*.
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: *Filter*.
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: *Filter*.
- `InterPodAffinity`: Implements
  [inter Pod affininity and antiaffinity](/docs/concepts/configuration/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: *PreFilter*, *Filter*, *PreScore*, *Score*.
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: *QueueSort*.
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: *Bind*.

You can specify a profile in a configuration file (via `--config` flag) using
the component config APIs
([`v1alpha1`](https://pkg.go.dev/k8s.io/kube-scheduler@v0.18.0/config/v1alpha1?tab=doc#KubeSchedulerConfiguration)
or [`v1alpha2`](https://pkg.go.dev/k8s.io/kube-scheduler@v0.18.0/config/v1alpha2?tab=doc#KubeSchedulerConfiguration)).

You can also enable the following plugins through those APIs, that are not
enabled by default:

- `NodeResourcesMostAllocated`: Favors nodes that have a high allocation of
  resources.
  Extension points: *Score*.
- `RequestedToCapacityRatio`: Favor nodes according to a configured function of
  the allocated resources.
  Extension points: *Score*.
- `NodeResourceLimits`: Favors nodes that satisfy the Pod resource limits.
  Extension points: *PreScore*, *Score*.
- `CinderVolume`: Checks that Cinder volume limits can be satisfied for the
  node.
  Extension points: *Filter*.
- `NodeLabel`: Filters and/or scores a node according to the configured labels.
  Extension points: *Filter*, *Score*.
- `ServiceAffinity`: Checks that Pods that belong to a service fit in a set of
  nodes defined by configured labels. It also favors spreading the Pods
  belonging to a service across nodes.
  Extension points: *PreFilter*, *Filter*, *Score*.
  
#### Multiple profiles

When using the component config API v1alpha2, a scheduler can be configured to
run more than one profile. Each profile has an associated scheduler name.
Pods that want to be scheduled according to a specific profile can include
the corresponding scheduler name in its `.spec.schedulerName`.

By default, one profile with the scheduler name `default-scheduler` is created.
This profile includes the default plugins described above. When declaring more
than one profile, a unique scheduler name for each of them is required.

If a Pod doesn't specify a scheduler name, kube-apiserver will set it to
`default-scheduler`. Therefore, a profile with this scheduler name should exist
to get those pods scheduled.

{{< note >}}
Pod's scheduling events have `.spec.schedulerName` as the ReportingController.
Events for leader election use the scheduler name of the first profile in the
list.
{{< /note >}}

{{< note >}}
All profiles must use the same plugin in the QueueSort extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
{{< /note >}}

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [scheduler performance tuning](/docs/concepts/scheduling/scheduler-perf-tuning/)
* Read about [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Read the [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for kube-scheduler
* Learn about [configuring multiple schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/)
* Learn about [topology management policies](/docs/tasks/administer-cluster/topology-manager/)
* Learn about [Pod Overhead](/docs/concepts/configuration/pod-overhead/)
{{% /capture %}}
