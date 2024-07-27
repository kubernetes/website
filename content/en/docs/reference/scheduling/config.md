---
title: Scheduler Configuration
content_type: concept
weight: 20
---

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

You can customize the behavior of the `kube-scheduler` by writing a configuration
file and passing its path as a command line argument.

<!-- overview -->

<!-- body -->

A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.

You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the
KubeSchedulerConfiguration [v1](/docs/reference/config-api/kube-scheduler-config.v1/)
struct.

A minimal configuration looks as follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

{{< note >}}
KubeSchedulerConfiguration v1beta3 is deprecated in v1.26 and is removed in v1.29.
Please migrate KubeSchedulerConfiguration to [v1](/docs/reference/config-api/kube-scheduler-config.v1/).
{{< /note >}}

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

1. `queueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
1. `preFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
1. `filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
1. `postFilter`: These plugins are called in their configured order when no
   feasible nodes were found for the pod. If any `postFilter` plugin marks the
   Pod _schedulable_, the remaining plugins are not called.
1. `preScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
1. `score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
1. `reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
1. `permit`: These plugins can prevent or delay the binding of a Pod.
1. `preBind`: These plugins perform any work required before a Pod is bound.
1. `bind`: The plugins bind a Pod to a Node. `bind` plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
1. `postBind`: This is an informational extension point that is called after
   a Pod has been bound.
1. `multiPoint`: This is a config-only field that allows plugins to be enabled
   or disabled for all of their applicable extension points simultaneously.

For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: PodTopologySpread
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

The following plugins, enabled by default, implement one or more of these
extension points:

- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `score`.
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `filter`, `preScore`, `score`.
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `filter`.
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `preFilter`, `filter`.
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `filter`, `score`.
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `filter`.
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting. The score can use one of three strategies: `LeastAllocated`
  (default), `MostAllocated` and `RequestedToCapacityRatio`.
  Extension points: `preFilter`, `filter`, `score`.
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `score`.
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
  {{< note >}}
  `score` extension point is enabled when `VolumeCapacityPriority` feature is
  enabled. It prioritizes the smallest PVs that can fit the requested volume
  size.
  {{< /note >}}
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `filter`.
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `filter`.
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `filter`.
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `filter`.
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `filter`.
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `filter`.
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `queueSort`.
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `bind`.
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `postFilter`.

You can also enable the following plugins, through the component config APIs,
that are not enabled by default:

- `CinderLimits`: Checks that [OpenStack Cinder](https://docs.openstack.org/cinder/)
  volume limits can be satisfied for the node.
  Extension points: `filter`.

### Multiple profiles

You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).

With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
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
Pod's scheduling events have `.spec.schedulerName` as their `reportingController`.
Events for leader election use the scheduler name of the first profile in the list.

For more information, please refer to the `reportingController` section under
[Event API Reference](/docs/reference/kubernetes-api/cluster-resources/event-v1/).
{{< /note >}}

{{< note >}}
All profiles must use the same plugin in the `queueSort` extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
{{< /note >}}

### Plugins that apply to multiple extension points {#multipoint}

Starting from `kubescheduler.config.k8s.io/v1beta3`, there is an additional field in the
profile config, `multiPoint`, which allows for easily enabling or disabling a plugin
across several extension points. The intent of `multiPoint` config is to simplify the
configuration needed for users and administrators when using custom profiles.

Consider a plugin, `MyPlugin`, which implements the `preScore`, `score`, `preFilter`,
and `filter` extension points. To enable `MyPlugin` for all its available extension
points, the profile config looks like:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: MyPlugin
```

This would equate to manually enabling `MyPlugin` for all of its extension
points, like so:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
        - name: MyPlugin
      score:
        enabled:
        - name: MyPlugin
      preFilter:
        enabled:
        - name: MyPlugin
      filter:
        enabled:
        - name: MyPlugin
```

One benefit of using `multiPoint` here is that if `MyPlugin` implements another
extension point in the future, the `multiPoint` config will automatically enable it
for the new extension.

Specific extension points can be excluded from `MultiPoint` expansion using
the `disabled` field for that extension point. This works with disabling default
plugins, non-default plugins, or with the wildcard (`'*'`) to disable all plugins.
An example of this, disabling `Score` and `PreScore`, would be:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'MyPlugin'
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

Starting from `kubescheduler.config.k8s.io/v1beta3`, all [default plugins](#scheduling-plugins)
are enabled internally through `MultiPoint`.
However, individual extension points are still available to allow flexible
reconfiguration of the default values (such as ordering and Score weights). For
example, consider two Score plugins `DefaultScore1` and `DefaultScore2`, each with
a weight of `1`. They can be reordered with different weights like so:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
        - name: 'DefaultScore2'
          weight: 5
```

In this example, it's unnecessary to specify the plugins in `MultiPoint` explicitly
because they are default plugins. And the only plugin specified in `Score` is `DefaultScore2`.
This is because plugins set through specific extension points will always take precedence
over `MultiPoint` plugins. So, this snippet essentially re-orders the two plugins
without needing to specify both of them.

The general hierarchy for precedence when configuring `MultiPoint` plugins is as follows:
1. Specific extension points run first, and their settings override whatever is set elsewhere
2. Plugins manually configured through `MultiPoint` and their settings
3. Default plugins and their default settings

To demonstrate the above hierarchy, the following example is based on these plugins:
|Plugin|Extension Points|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

A valid sample configuration for these plugins would be:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'CustomQueueSort'
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultQueueSort'
      filter:
        disabled:
        - name: 'DefaultPlugin1'
      score:
        enabled:
        - name: 'DefaultPlugin2'
```

Note that there is no error for re-declaring a `MultiPoint` plugin in a specific
extension point. The re-declaration is ignored (and logged), as specific extension points
take precedence.

Besides keeping most of the config in one spot, this sample does a few things:
* Enables the custom `queueSort` plugin and disables the default one
* Enables `CustomPlugin1` and `CustomPlugin2`, which will run first for all of their extension points
* Disables `DefaultPlugin1`, but only for `filter`
* Reorders `DefaultPlugin2` to run first in `score` (even before the custom plugins)

In versions of the config before `v1beta3`, without `multiPoint`, the above snippet would equate to this:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # Disable the default QueueSort plugin
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # Enable custom Filter plugins
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # Enable and reorder custom score plugins
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 3
```

While this is a complicated example, it demonstrates the flexibility of `MultiPoint` config
as well as its seamless integration with the existing methods for configuring extension points.

## Scheduler configuration migrations

{{< tabs name="tab_with_md" >}}
{{% tab name="v1beta1 → v1beta2" %}}
* With the v1beta2 configuration version, you can use a new score extension for the
  `NodeResourcesFit` plugin.
  The new extension combines the functionalities of the `NodeResourcesLeastAllocated`,
  `NodeResourcesMostAllocated` and `RequestedToCapacityRatio` plugins.
  For example, if you previously used the `NodeResourcesMostAllocated` plugin, you
  would instead use `NodeResourcesFit` (enabled by default) and add a `pluginConfig`
  with a `scoreStrategy` that is similar to:
  ```yaml
  apiVersion: kubescheduler.config.k8s.io/v1beta2
  kind: KubeSchedulerConfiguration
  profiles:
  - pluginConfig:
    - args:
        scoringStrategy:
          resources:
          - name: cpu
            weight: 1
          type: MostAllocated
      name: NodeResourcesFit
  ```

* The scheduler plugin `NodeLabel` is deprecated; instead, use the [`NodeAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.

* The scheduler plugin `ServiceAffinity` is deprecated; instead, use the [`InterPodAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.

* The scheduler plugin `NodePreferAvoidPods` is deprecated; instead, use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) to achieve similar behavior.

* A plugin enabled in a v1beta2 configuration file takes precedence over the default configuration for that plugin.

* Invalid `host` or `port` configured for scheduler healthz and metrics bind address will cause validation failure.
{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
* Three plugins' weight are increased by default:
  * `InterPodAffinity` from 1 to 2
  * `NodeAffinity` from 1 to 2
  * `TaintToleration` from 1 to 3
{{% /tab %}}

{{% tab name="v1beta3 → v1" %}}
* The scheduler plugin `SelectorSpread` is removed, instead, use the `PodTopologySpread` plugin (enabled by default)
to achieve similar behavior.
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* Read the [kube-scheduler reference](/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read the [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) reference
