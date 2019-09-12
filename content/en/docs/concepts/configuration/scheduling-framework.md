---
reviewers:
- ahg-g
title: Scheduling Framework
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.15" state="alpha" >}}

The scheduling framework is a new plugable architecture for Kubernetes Scheduler
that makes scheduler customizations easy. It adds a new set of "plugin" APIs to
the existing scheduler. Plugins are compiled into the scheduler. The APIs
allow most scheduling features to be implemented as plugins, while keeping the
scheduling "core" simple and maintainable. Refer to the [design proposal of the
scheduling framework][kep] for more technical information on the design of the
framework.

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20180409-scheduling-framework.md

{{% /capture %}}

{{% capture body %}}

# Framework workflow

The Scheduling Framework defines a few extension points. Scheduler plugins
register to be invoked at one or more extension points. Some of these plugins
can change the scheduling decisions and some are informational only.

Each attempt to schedule one Pod is split into two phases, the **scheduling
cycle** and the **binding cycle**.

## Scheduling Cycle & Binding Cycle

The scheduling cycle selects a node for the Pod, and the binding cycle applies
that decision to the cluster. Together, a scheduling cycle and binding cycle are
referred to as a "scheduling context".

Scheduling cycles are run serially, while binding cycles may run concurrently.

A scheduling or binding cycle can be aborted if the Pod is determined to
be unschedulable or if there is an internal error. The Pod will be returned to
the queue and retried.

## Extension points

The following picture shows the scheduling context of a Pod and the extension
points that the scheduling framework exposes. In this picture "Filter" is
equivalent to "Predicate" and "Scoring" is equivalent to "Priority function".

One plugin may register at multiple extension points to perform more complex or
stateful tasks.

{{< figure src="/images/docs/scheduling-framework-extensions.png" title="scheduling framework extension points" >}}

### Queue sort

These plugins are used to sort Pods in the scheduling queue. A queue sort plugin
essentially will provide a "less(Pod1, Pod2)" function. Only one queue sort
plugin may be enabled at a time.

### Pre-filter

These plugins are used to pre-process info about the Pod, or to check certain
conditions that the cluster or the Pod must meet. If a pre-filter plugin returns
an error, the scheduling cycle is aborted.

### Filter

These plugins are used to filter out nodes that cannot run the Pod. For each
node, the scheduler will call filter plugins in their configured order. If any
filter plugin marks the node as infeasible, the remaining plugins will not be
called for that node. Nodes may be evaluated concurrently.

### Post-filter

This is an informational extension point. Plugins will be called with a list of
nodes that passed the filtering phase. A plugin may use this data to update
internal state or to generate logs/metrics.

**Note:** Plugins wishing to perform "pre-scoring" work should use the
post-filter extension point.

### Scoring

These plugins are used to rank nodes that have passed the filtering phase. The
scheduler will call each scoring plugin for each node. There will be a well
defined range of integers representing the minimum and maximum scores. After the
[normalize scoring](#normalize-scoring) phase, the scheduler will combine node
scores from all plugins according to the configured plugin weights.

### Normalize scoring

These plugins are used to modify scores before the scheduler computes a final
ranking of Nodes. A plugin that registers for this extension point will be
called with the [scoring](#scoring) results from the same plugin. This is called
once per plugin per scheduling cycle.

For example, suppose a plugin `BlinkingLightScorer` ranks Nodes based on how
many blinking lights they have.

```go
func ScoreNode(_ *v1.pod, n *v1.Node) (int, error) {
   return getBlinkingLightCount(n)
}
```

However, the maximum count of blinking lights may be small compared to
`NodeScoreMax`. To fix this, `BlinkingLightScorer` should also register for this
extension point.

```go
func NormalizeScores(scores map[string]int) {
   highest := 0
   for _, score := range scores {
      highest = max(highest, score)
   }
   for node, score := range scores {
      scores[node] = score*NodeScoreMax/highest
   }
}
```

If any normalize-scoring plugin returns an error, the scheduling cycle is
aborted.

**Note:** Plugins wishing to perform "pre-reserve" work should use the
normalize-scoring extension point.

### Reserve

This is an informational extension point. Plugins which maintain runtime state
(aka "stateful plugins") should use this extension point to be notified by the
scheduler when resources on a node are being reserved for a given Pod. This
happens before the scheduler actually binds the Pod to the Node, and it exists
to prevent race conditions while the scheduler waits for the bind to succeed.

This is the last step in a scheduling cycle. Once a Pod is in the reserved
state, it will either trigger [Unreserve](#unreserve) plugins (on failure) or
[Post-bind](#post-bind) plugins (on success) at the end of the binding cycle.

*Note: This concept used to be referred to as "assume".*

### Permit

These plugins are used to prevent or delay the binding of a Pod. A permit plugin
can do one of three things.

1.  **approve** \
    Once all permit plugins approve a Pod, it is sent for binding.

1.  **deny** \
    If any permit plugin denies a Pod, it is returned to the scheduling queue.
    This will trigger [Unreserve](#unreserve) plugins.

1.  **wait** (with a timeout) \
    If a permit plugin returns "wait", then the Pod is kept in the permit phase
    until a [plugin approves it](#frameworkhandle). If a timeout occurs, **wait**
    becomes **deny** and the Pod is returned to the scheduling queue, triggering
    [Unreserve](#unreserve) plugins.

**Approving a Pod binding**

While any plugin can access the list of "waiting" Pods from the cache and
approve them (see [`FrameworkHandle`](#frameworkhandle)) we expect only the permit
plugins to approve binding of reserved Pods that are in "waiting" state. Once a
Pod is approved, it is sent to the pre-bind phase.

### Pre-bind

These plugins are used to perform any work required before a Pod is bound. For
example, a pre-bind plugin may provision a network volume and mount it on the
target node before allowing the Pod to run there.

If any pre-bind plugin returns an error, the Pod is [rejected](#unreserve) and
returned to the scheduling queue.

### Bind

These plugins are used to bind a Pod to a Node. Bind plugins will not be called
until all pre-bind plugins have completed. Each bind plugin is called in the
configured order. A bind plugin may choose whether or not to handle the given
Pod. If a bind plugin chooses to handle a Pod, **the remaining bind plugins are
skipped**.

### Post-bind

This is an informational extension point. Post-bind plugins are called after a
Pod is successfully bound. This is the end of a binding cycle, and can be used
to clean up associated resources.

### Unreserve

This is an informational extension point. If a Pod was reserved and then
rejected in a later phase, then unreserve plugins will be notified. Unreserve
plugins should clean up state associated with the reserved Pod.

Plugins that use this extension point usually should also use
[Reserve](#reserve).

## Plugin API

There are two steps to the plugin API. First, plugins must register and get
configured, then they use the extension point interfaces. Extension point
interfaces have the following form.

```go
type Plugin interface {
   Name() string
}

type QueueSortPlugin interface {
   Plugin
   Less(*v1.pod, *v1.pod) bool
}

type PreFilterPlugin interface {
   Plugin
   PreFilter(PluginContext, *v1.pod) error
}

// ...
```

# Plugin Configuration

Plugins can be enabled in the scheduler configuration. Also, default plugins can
be disabled in the configuration. In 1.15, there are no default plugins for the
scheduling framework.

The scheduler configuration can include configuration for plugins as well. Such
configurations are passed to the plugins at the time the scheduler initializes
them. The configuration is an arbitrary value. The receiving plugin should
decode and process the configuration.

The following example shows a scheduler configuration that enables some
plugins at `reserve` and `preBind` extension points and disables a plugin. It
also provides a configuration to plugin `foo`.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration

...

plugins:
  reserve:
    enabled:
    - name: foo
    - name: bar
    disabled:
    - name: baz
  preBind:
    enabled:
    - name: foo
    disabled:
    - name: baz

pluginConfig:
- name: foo
  args: >
    Arbitrary set of args to plugin foo
```

When an extension point is omitted from the configuration default plugins for
that extension points are used. When an extension point exists and `enabled` is
provided, the `enabled` plugins are called in addition to default plugins.
Default plugins are called first and then the additional enabled plugins are
called in the same order specified in the configuration. If a different order of
calling default plugins is desired, default plugins must be `disabled` and
`enabled` in the desired order.

Assuming there is a default plugin called `foo` at `reserve` and we are adding
plugin `bar` that we want to be invoked before `foo`, we should disable `foo`
and enable `bar` and `foo` in order. The following example shows the
configuration that achieves this:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration

...

plugins:
  reserve:
    enabled:
    - name: bar
    - name: foo
    disabled:
    - name: foo
```

{{% /capture %}}
