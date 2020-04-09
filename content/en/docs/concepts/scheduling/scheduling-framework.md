---
reviewers:
- ahg-g
title: Scheduling Framework
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

The scheduling framework is a pluggable architecture for Kubernetes Scheduler
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

### QueueSort {#queue-sort}

These plugins are used to sort Pods in the scheduling queue. A queue sort plugin
essentially provides a `Less(Pod1, Pod2)` function. Only one queue sort
plugin may be enabled at a time.

### PreFilter {#pre-filter}

These plugins are used to pre-process info about the Pod, or to check certain
conditions that the cluster or the Pod must meet. If a PreFilter plugin returns
an error, the scheduling cycle is aborted.

### Filter

These plugins are used to filter out nodes that cannot run the Pod. For each
node, the scheduler will call filter plugins in their configured order. If any
filter plugin marks the node as infeasible, the remaining plugins will not be
called for that node. Nodes may be evaluated concurrently.

### PreScore {#pre-score}

These plugins are used to perform "pre-scoring" work, which generates a sharable
state for Score plugins to use. If a PreScore plugin returns an error, the
scheduling cycle is aborted.

### Score {#scoring}

These plugins are used to rank nodes that have passed the filtering phase. The
scheduler will call each scoring plugin for each node. There will be a well
defined range of integers representing the minimum and maximum scores. After the
[NormalizeScore](#normalize-scoring) phase, the scheduler will combine node
scores from all plugins according to the configured plugin weights.

### NormalizeScore {#normalize-scoring}

These plugins are used to modify scores before the scheduler computes a final
ranking of Nodes. A plugin that registers for this extension point will be
called with the [Score](#scoring) results from the same plugin. This is called
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

If any NormalizeScore plugin returns an error, the scheduling cycle is
aborted.

{{< note >}}
Plugins wishing to perform "pre-reserve" work should use the
NormalizeScore extension point.
{{< /note >}}

### Reserve

This is an informational extension point. Plugins which maintain runtime state
(aka "stateful plugins") should use this extension point to be notified by the
scheduler when resources on a node are being reserved for a given Pod. This
happens before the scheduler actually binds the Pod to the Node, and it exists
to prevent race conditions while the scheduler waits for the bind to succeed.

This is the last step in a scheduling cycle. Once a Pod is in the reserved
state, it will either trigger [Unreserve](#unreserve) plugins (on failure) or
[PostBind](#post-bind) plugins (on success) at the end of the binding cycle.

### Permit

_Permit_ plugins are invoked at the end of the scheduling cycle for each Pod, to
prevent or delay the binding to the candidate node. A permit plugin can do one of
the three things:

1.  **approve** \
    Once all Permit plugins approve a Pod, it is sent for binding.

1.  **deny** \
    If any Permit plugin denies a Pod, it is returned to the scheduling queue.
    This will trigger [Unreserve](#unreserve) plugins.

1.  **wait** (with a timeout) \
    If a Permit plugin returns "wait", then the Pod is kept in an internal "waiting"
    Pods list, and the binding cycle of this Pod starts but directly blocks until it
    gets [approved](#frameworkhandle). If a timeout occurs, **wait** becomes **deny**
    and the Pod is returned to the scheduling queue, triggering [Unreserve](#unreserve)
    plugins.

{{< note >}}
While any plugin can access the list of "waiting" Pods and approve them
(see [`FrameworkHandle`](#frameworkhandle)), we expect only the permit
plugins to approve binding of reserved Pods that are in "waiting" state. Once a Pod
is approved, it is sent to the [PreBind](#pre-bind) phase.
{{< /note >}}

### PreBind {#pre-bind}

These plugins are used to perform any work required before a Pod is bound. For
example, a pre-bind plugin may provision a network volume and mount it on the
target node before allowing the Pod to run there.

If any PreBind plugin returns an error, the Pod is [rejected](#unreserve) and
returned to the scheduling queue.

### Bind

These plugins are used to bind a Pod to a Node. Bind plugins will not be called
until all PreBind plugins have completed. Each bind plugin is called in the
configured order. A bind plugin may choose whether or not to handle the given
Pod. If a bind plugin chooses to handle a Pod, **the remaining bind plugins are
skipped**.

### PostBind {#post-bind}

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
    PreFilter(context.Context, *framework.CycleState, *v1.pod) error
}

// ...
```

## Plugin configuration

You can enable or disable plugins in the scheduler configuration. If you are using
Kubernetes v1.18 or later, most scheduling
[plugins](/docs/reference/scheduling/profiles/#scheduling-plugins) are in use and
enabled by default.

In addition to default plugins, you can also implement your own scheduling
plugins and get them configured along with default plugins. You can visit
[scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins) for more details.

If you are using Kubernetes v1.18 or later, you can configure a set of plugins as
a scheduler profile and then define multiple profiles to fit various kinds of workload.
Learn more at [multiple profiles](/docs/reference/scheduling/profiles/#multiple-profiles).

{{% /capture %}}
