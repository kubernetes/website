---
assignees:
- derekwaynecarr
- vishh
- timstclair

---

* TOC
{:toc}

The `kubelet` needs to preserve node stability when available compute resources are low.

This is especially important when dealing with incompressible resources such as memory or disk.

If either resource is exhausted, the node would become unstable.

## Eviction Policy

The `kubelet` can pro-actively monitor for and prevent against total starvation of a compute resource.  In
cases where it could appear to occur, the `kubelet` can pro-actively fail one or more pods in order to reclaim
the starved resource.  When the `kubelet` fails a pod, it terminates all containers in the pod, and the `PodPhase`
is transitioned to `Failed`.

### Eviction Signals

The `kubelet` can support the ability to trigger eviction decisions on the signals described in the
table below.  The value of each signal is described in the description column based on the `kubelet`
summary API.

| Eviction Signal  | Description                                                                     |
|------------------|---------------------------------------------------------------------------------|
| `memory.available` | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |

In future releases, the `kubelet` will support the ability to trigger eviction decisions based on disk pressure.

Until that time, it is recommended users take advantage of [garbage collection](/docs/admin/garbage-collection/).

### Eviction Thresholds

The `kubelet` supports the ability to specify eviction thresholds that trigger the `kubelet` to reclaim resources.

Each threshold is of the following form:

`<eviction-signal><operator><quantity>`

* valid `eviction-signal` tokens as defined above.
* valid `operator` tokens are `<`
* valid `quantity` tokens must match the quantity representation used by Kubernetes

#### Soft Eviction Thresholds

A soft eviction threshold pairs an eviction threshold with a required
administrator specified grace period.  No action is taken by the `kubelet`
to reclaim resources associated with the eviction signal until that grace
period has been exceeded.  If no grace period is provided, the `kubelet` will
error on startup.

In addition, if a soft eviction threshold has been met, an operator can
specify a maximum allowed pod termination grace period to use when evicting
pods from the node.  If specified, the `kubelet` will use the lesser value among
the `pod.Spec.TerminationGracePeriodSeconds` and the max allowed grace period.
If not specified, the `kubelet` will kill pods immediately with no graceful
termination.

To configure soft eviction thresholds, the following flags are supported:

* `eviction-soft` describes a set of eviction thresholds (e.g. `memory.available<1.5Gi`) that if met over a
corresponding grace period would trigger a pod eviction.
* `eviction-soft-grace-period` describes a set of eviction grace periods (e.g. `memory.available=1m30s`) that
correspond to how long a soft eviction threshold must hold before triggering a pod eviction.
* `eviction-max-pod-grace-period` describes the maximum allowed grace period (in seconds) to use when terminating
pods in response to a soft eviction threshold being met.

#### Hard Eviction Thresholds

A hard eviction threshold has no grace period, and if observed, the `kubelet`
will take immediate action to reclaim the associated starved resource.  If a
hard eviction threshold is met, the `kubelet` will kill the pod immediately
with no graceful termination.

To configure hard eviction thresholds, the following flag is supported:

* `eviction-hard` describes a set of eviction thresholds (e.g. `memory.available<1Gi`) that if met
would trigger a pod eviction.

### Eviction Monitoring Interval

The `kubelet` evaluates eviction thresholds per its configured housekeeping interval.

* `housekeeping-interval` is the interval between container housekeepings.

### Node Conditions

The `kubelet` will map one or more eviction signals to a corresponding node condition.

If a hard eviction threshold has been met, or a soft eviction threshold has been met
independent of its associated grace period, the `kubelet` will report a condition that
reflects the node is under pressure.

The following node conditions are defined that correspond to the specified eviction signal.

| Node Condition | Eviction Signal  | Description                                                      |
|----------------|------------------|------------------------------------------------------------------|
| `MemoryPressure` | `memory.available` | Available memory on the node has satisfied an eviction threshold |

The `kubelet` will continue to report node status updates at the frequency specified by
`--node-status-update-frequency` which defaults to `10s`.

### Oscillation of node conditions

If a node is oscillating above and below a soft eviction threshold, but not exceeding
its associated grace period, it would cause the corresponding node condition to
constantly oscillate between true and false, and could cause poor scheduling decisions
as a consequence.

To protect against this oscillation, the following flag is defined to control how
long the `kubelet` must wait before transitioning out of a pressure condition.

* `eviction-pressure-transition-period` is the duration for which the `kubelet` has
to wait before transitioning out of an eviction pressure condition.

The `kubelet` would ensure that it has not observed an eviction threshold being met
for the specified pressure condition for the period specified before toggling the
condition back to `false`.

### Eviction of Pods

If an eviction threshold has been met and the grace period has passed,
the `kubelet` will initiate the process of evicting pods until it has observed 
the signal has gone below its defined threshold.

The `kubelet` ranks pods for eviction 1) by their quality of service,
2) and among those with the same quality of service by the consumption of the
starved compute resource relative to the pods scheduling request.

* `BestEffort` pods that consume the most of the starved resource are failed
first.
* `Burstable` pods that consume the greatest amount of the starved resource
relative to their request for that resource are killed first.  If no pod
has exceeded its request, the strategy targets the largest consumer of the
starved resource.
* `Guaranteed` pods that consume the greatest amount of the starved resource
relative to their request are killed first.  If no pod has exceeded its request,
the strategy targets the largest consumer of the starved resource.

A `Guaranteed` pod is guaranteed to never be evicted because of another pod's
resource consumption.  If a system daemon (i.e. `kubelet`, `docker`, `journald`, etc.)
is consuming more resources than were reserved via `system-reserved` or `kube-reserved` allocations,
and the node only has `Guaranteed` pod(s) remaining, then the node must choose to evict a
`Guaranteed` pod in order to preserve node stability, and to limit the impact
of the unexpected consumption to other `Guaranteed` pod(s).

### Scheduler

The node will report a condition when a compute resource is under pressure.  The
scheduler views that condition as a signal to dissuade placing additional
pods on the node.

| Node Condition    | Scheduler Behavior                               |
| ---------------- | ------------------------------------------------ |
| `MemoryPressure` | `BestEffort` pods are not scheduled to the node. |

## Node OOM Behavior

If the node experiences a system OOM (out of memory) event prior to the `kubelet` is able to reclaim memory,
the node depends on the [oom_killer](https://lwn.net/Articles/391222/) to respond.

The `kubelet` sets a `oom_score_adj` value for each container based on the quality of service for the pod.

| Quality of Service | oom_score_adj |
| -----------------  | ------------- |
| `Guaranteed` | -998 |
| `BestEffort` | 1000 |
| `Burstable` | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |

If the `kubelet` is unable to reclaim memory prior to a node experiencing system OOM, the `oom_killer` will calculate
an `oom_score` based on the percentage of memory its using on the node, and then add the `oom_score_adj` to get an
effective `oom_score` for the container, and then kills the container with the highest score.

The intended behavior should be that containers with the lowest quality of service that
are consuming the largest amount of memory relative to the scheduling request should be killed first in order
to reclaim memory.

Unlike pod eviction, if a pod container is OOM killed, it may be restarted by the `kubelet` based on its `RestartPolicy`.

## Best Practices

### Schedulable resources and eviction policies

Let's imagine the following scenario:

* Node memory capacity: `10Gi`
* Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
* Operator wants to evict pods at 95% memory utilization to reduce thrashing and incidence of system OOM.

To facilitate this scenario, the `kubelet` would be launched as follows:

```
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

Implicit in this configuration is the understanding that "System reserved" should include the amount of memory
covered by the eviction threshold.

To reach that capacity, either some pod is using more than its request, or the system is using more than `500Mi`.

This configuration will ensure that the scheduler does not place pods on a node that immediately induce memory pressure
and trigger eviction assuming those pods use less than their configured request.

### DaemonSet

It is never desired for a `kubelet` to evict a pod that was derived from
a `DaemonSet` since the pod will immediately be recreated and rescheduled
back to the same node.

At the moment, the `kubelet` has no ability to distinguish a pod created
from `DaemonSet` versus any other object.  If/when that information is
available, the `kubelet` could pro-actively filter those pods from the
candidate set of pods provided to the eviction strategy.

In general, it is strongly recommended that `DaemonSet` not
create `BestEffort` pods to avoid being identified as a candidate pod
for eviction. Instead `DaemonSet` should ideally launch `Guaranteed` pods.
