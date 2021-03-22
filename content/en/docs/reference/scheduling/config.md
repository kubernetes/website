---
title: Scheduler Configuration
content_type: concept
weight: 20
---

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

You can customize the behavior of the `kube-scheduler` by writing a configuration
file and passing its path as a command line argument.

<!-- overview -->

<!-- body -->

A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in a extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.

You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the component config APIs
([`v1beta1`](https://pkg.go.dev/k8s.io/kube-scheduler@v0.19.0/config/v1beta1?tab=doc#KubeSchedulerConfiguration)).

A minimal configuration looks as follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

## Profiles

A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an [extension point](#extension-points).
[Plugins](#scheduling-plugins) provide scheduling behaviors by implementing one
or more of these extension points.

You can configure a single instance of `kube-scheduler` to run
[multiple profiles](#multiple-profiles).

### Extension points

Scheduling happens in a series of stages that are exposed through the following
extension points:

1. `QueueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
1. `PreFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
1. `Filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
1. `PreScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
1. `Score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
1. `Reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
1. `Permit`: These plugins can prevent or delay the binding of a Pod.
1. `PreBind`: These plugins perform any work required before a Pod is bound.
1. `Bind`: The plugins bind a Pod to a Node. Bind plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
1. `PostBind`: This is an informational extension point that is called after
   a Pod has been bound.

For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: NodeResourcesLeastAllocated
        enabled:
        - name: MyCustomPluginA
          weight: 2
        - name: MyCustomPluginB
          weight: 1
```

You can use `*` as name in the disabled array to disable all default plugins
for that extension point. This can also be used to rearrange plugins order, if
desired.
   
### Scheduling plugins
1. `UnReserve`: This is an informational extension point that is called if
   a Pod is rejected after being reserved and put on hold by a `Permit` plugin.

## Scheduling plugins

The following plugins, enabled by default, implement one or more of these
extension points:

- `SelectorSpread`: Favors spreading across nodes for Pods that belong to
  {{< glossary_tooltip text="Services" term_id="service" >}},
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
  Extension points: `PreScore`, `Score`.
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `Score`.
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `Filter`, `Prescore`, `Score`.
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `Filter`.
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `PreFilter`, `Filter`.
- `NodePreferAvoidPods`: Scores nodes according to the node
  {{< glossary_tooltip text="annotation" term_id="annotation" >}}
  `scheduler.alpha.kubernetes.io/preferAvoidPods`.
  Extension points: `Score`.
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `Filter`, `Score`.
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
  Extension points: `PreFilter`, `Filter`, `PreScore`, `Score`.
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `Filter`.
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting.
  Extension points: `PreFilter`, `Filter`.
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `Score`.
- `NodeResourcesLeastAllocated`: Favors nodes that have a low allocation of
  resources.
  Extension points: `Score`.
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `PreFilter`, `Filter`, `Reserve`, `PreBind`, `Score`.
  {{< note >}}
  `Score` extension point is enabled when `VolumeCapacityPriority` feature is
  enabled. It prioritizes the smallest PVs that can fit the requested volume
  size.
  {{< /note >}}
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `Filter`.
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `Filter`.
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `Filter`.
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `Filter`.
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `Filter`.
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `Filter`.
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `PreFilter`, `Filter`, `PreScore`, `Score`.
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `QueueSort`.
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `Bind`.
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `PostFilter`.
  
You can also enable the following plugins, through the component config APIs,
that are not enabled by default:

- `NodeResourcesMostAllocated`: Favors nodes that have a high allocation of
  resources.
  Extension points: `Score`.
- `RequestedToCapacityRatio`: Favor nodes according to a configured function of
  the allocated resources.
  Extension points: `Score`.
- `CinderVolume`: Checks that OpenStack Cinder volume limits can be satisfied
  for the node.
  Extension points: `Filter`.
- `NodeLabel`: Filters and / or scores a node according to configured
  {{< glossary_tooltip text="label(s)" term_id="label" >}}.
  Extension points: `Filter`, `Score`.
- `ServiceAffinity`: Checks that Pods that belong to a
  {{< glossary_tooltip term_id="service" >}} fit in a set of nodes defined by
  configured labels. This plugin also favors spreading the Pods belonging to a
  Service across nodes.
  Extension points: `PreFilter`, `Filter`, `Score`.
  
### Multiple profiles

You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).

With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

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

## {{% heading "whatsnext" %}}

* Read the [kube-scheduler reference](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
