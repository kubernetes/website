---
approvers:
- derekwaynecarr
- vishh
- timstclair
title: Configure Out Of Resource Handling
---

* TOC
{:toc}

The `kubelet` needs to preserve node stability when available compute resources
are low.

This is especially important when dealing with incompressible resources such as
memory or disk.

If either resource is exhausted, the node would become unstable.

## Eviction Policy

The `kubelet` can pro-actively monitor for and prevent against total starvation
of a compute resource.  In those cases, the `kubelet` can pro-actively fail one
or more pods in order to reclaim the starved resource.  When the `kubelet` fails
a pod, it terminates all containers in the pod, and the `PodPhase` is
transitioned to `Failed`.

### Eviction Signals

The `kubelet` can support the ability to trigger eviction decisions on the
signals described in the table below.  The value of each signal is described in
the description column based on the `kubelet` summary API.

| Eviction Signal  | Description                                                                     |
|----------------------------|-----------------------------------------------------------------------|
| `memory.available` | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available` | `nodefs.available` := `node.stats.fs.available` |
| `nodefs.inodesFree` | `nodefs.inodesFree` := `node.stats.fs.inodesFree` |
| `imagefs.available` | `imagefs.available` := `node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree` |

Each of the above signals supports either a literal or percentage based value.
The percentage based value is calculated relative to the total capacity
associated with each signal.

The value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`.  This is important because `free -m` does not work in a
container, and if users use the [node
allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) feature, out of resource decisions
are made local to the end user pod part of the cgroup hierarchy as well as the
root node.  This
[script](/docs/tasks/administer-cluster/out-of-resource/memory-available.sh)
reproduces the same set of steps that the `kubelet` performs to calculate
`memory.available`. The `kubelet` excludes inactive_file (i.e. # of bytes of
file-backed memory on inactive LRU list) from its calculation as it assumes that
memory is reclaimable under pressure.

`kubelet` supports only two filesystem partitions.

1. The `nodefs` filesystem that kubelet uses for volumes, daemon logs, etc.
1. The `imagefs` filesystem that container runtimes uses for storing images and
   container writable layers.

`imagefs` is optional. `kubelet` auto-discovers these filesystems using
cAdvisor.  `kubelet` does not care about any other filesystems. Any other types
of configurations are not currently supported by the kubelet. For example, it is
*not OK* to store volumes and logs in a dedicated `filesystem`.

In future releases, the `kubelet` will deprecate the existing [garbage
collection](/docs/concepts/cluster-administration/kubelet-garbage-collection/) support in favor of eviction in
response to disk pressure.

### Eviction Thresholds

The `kubelet` supports the ability to specify eviction thresholds that trigger the `kubelet` to reclaim resources.

Each threshold is of the following form:

`<eviction-signal><operator><quantity>`

* valid `eviction-signal` tokens as defined above.
* valid `operator` tokens are `<`
* valid `quantity` tokens must match the quantity representation used by Kubernetes
* an eviction threshold can be expressed as a percentage if ends with `%` token.

For example, if a node has `10Gi` of memory, and the desire is to induce eviction
if available memory falls below `1Gi`, an eviction threshold can be specified as either
of the following (but not both).

* `memory.available<10%`
* `memory.available<1Gi`

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

The `kubelet` has the following default hard eviction threshold:

* `--eviction-hard=memory.available<100Mi`

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
|-------------------------|-------------------------------|--------------------------------------------|
| `MemoryPressure` | `memory.available` | Available memory on the node has satisfied an eviction threshold |
| `DiskPressure` | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, or `imagefs.inodesFree` | Available disk space and inodes on either the node's root filesystem or image filesystem has satisfied an eviction threshold |

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

### Reclaiming node level resources

If an eviction threshold has been met and the grace period has passed,
the `kubelet` will initiate the process of reclaiming the pressured resource
until it has observed the signal has gone below its defined threshold.

The `kubelet` attempts to reclaim node level resources prior to evicting end-user pods. If
disk pressure is observed, the `kubelet` reclaims node level resources differently if the
machine has a dedicated `imagefs` configured for the container runtime.

#### With Imagefs

If `nodefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:

1. Delete dead pods/containers

If `imagefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:

1. Delete all unused images

#### Without Imagefs

If `nodefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:

1. Delete dead pods/containers
1. Delete all unused images

### Evicting end-user pods

If the `kubelet` is unable to reclaim sufficient resource on the node,
it will begin evicting pods.

The `kubelet` ranks pods for eviction as follows:

* by their quality of service.
* by the consumption of the starved compute resource relative to the pods scheduling request.

As a result, pod eviction occurs in the following order:

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

Local disk is a `BestEffort` resource.  If necessary, `kubelet` will evict pods one at a time to reclaim
disk when `DiskPressure` is encountered.  The `kubelet` will rank pods by quality of service.  If the `kubelet`
is responding to `inode` starvation, it will reclaim `inodes` by evicting pods with the lowest quality of service
first.  If the `kubelet` is responding to lack of available disk, it will rank pods within a quality of service
that consumes the largest amount of disk and kill those first.

#### With Imagefs

If `nodefs` is triggering evictions, `kubelet` will sort pods based on the usage on `nodefs`
- local volumes + logs of all its containers.

If `imagefs` is triggering evictions, `kubelet` will sort pods based on the writable layer usage of all its containers.

#### Without Imagefs

If `nodefs` is triggering evictions, `kubelet` will sort pods based on their total disk usage
- local volumes + logs & writable layer of all its containers.

### Minimum eviction reclaim

In certain scenarios, eviction of pods could result in reclamation of small amount of resources. This can result in
`kubelet` hitting eviction thresholds in repeated successions. In addition to that, eviction of resources like `disk`,
 is time consuming.

To mitigate these issues, `kubelet` can have a per-resource `minimum-reclaim`. Whenever `kubelet` observes
resource pressure, `kubelet` will attempt to reclaim at least `minimum-reclaim` amount of resource below
the configured eviction threshold.

For example, with the following configuration:

```
--eviction-hard=memory.available<500Mi,nodefs.available<1Gi,imagefs.available<100Gi
--eviction-minimum-reclaim="memory.available=0Mi,nodefs.available=500Mi,imagefs.available=2Gi"`
```

If an eviction threshold is triggered for `memory.available`, the `kubelet` will work to ensure
that `memory.available` is at least `500Mi`.  For `nodefs.available`, the `kubelet` will work
to ensure that `nodefs.available` is at least `1.5Gi`, and for `imagefs.available` it will
work to ensure that `imagefs.available` is at least `102Gi` before no longer reporting pressure
on their associated resources.

The default `eviction-minimum-reclaim` is `0` for all resources.

### Scheduler

The node will report a condition when a compute resource is under pressure.  The
scheduler views that condition as a signal to dissuade placing additional
pods on the node.

| Node Condition    | Scheduler Behavior                               |
| ---------------- | ------------------------------------------------ |
| `MemoryPressure` | No new `BestEffort` pods are scheduled to the node. |
| `DiskPressure` | No new pods are scheduled to the node. |

## Node OOM Behavior

If the node experiences a system OOM (out of memory) event prior to the `kubelet` is able to reclaim memory,
the node depends on the [oom_killer](https://lwn.net/Articles/391222/) to respond.

The `kubelet` sets a `oom_score_adj` value for each container based on the quality of service for the pod.

| Quality of Service | oom_score_adj |
|----------------------------|-----------------------------------------------------------------------|
| `Guaranteed` | -998 |
| `BestEffort` | 1000 |
| `Burstable` | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |

If the `kubelet` is unable to reclaim memory prior to a node experiencing system OOM, the `oom_killer` will calculate
an `oom_score` based on the percentage of memory it's using on the node, and then add the `oom_score_adj` to get an
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

## Deprecation of existing feature flags to reclaim disk

`kubelet` has been freeing up disk space on demand to keep the node stable.

As disk based eviction matures, the following `kubelet` flags will be marked for deprecation
in favor of the simpler configuration supported around eviction.

| Existing Flag | New Flag |
| ------------- | -------- |
| `--image-gc-high-threshold` | `--eviction-hard` or `eviction-soft` |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` |
| `--maximum-dead-containers` | deprecated |
| `--maximum-dead-containers-per-container` | deprecated |
| `--minimum-container-ttl-duration` | deprecated |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` |

## Known issues

### kubelet may not observe memory pressure right away

The `kubelet` currently polls `cAdvisor` to collect memory usage stats at a regular interval.  If memory usage
increases within that window rapidly, the `kubelet` may not observe `MemoryPressure` fast enough, and the `OOMKiller`
will still be invoked.  We intend to integrate with the `memcg` notification API in a future release to reduce this
latency, and instead have the kernel tell us when a threshold has been crossed immediately.

If you are not trying to achieve extreme utilization, but a sensible measure of overcommit, a viable workaround for
this issue is to set eviction thresholds at approximately 75% capacity.  This increases the ability of this feature
to prevent system OOMs, and promote eviction of workloads so cluster state can rebalance.

### kubelet may evict more pods than needed

The pod eviction may evict more pods than needed due to stats collection timing gap. This can be mitigated by adding
the ability to get root container stats on an on-demand basis [(https://github.com/google/cadvisor/issues/1247)](https://github.com/google/cadvisor/issues/1247) in the future.

### How kubelet ranks pods for eviction in response to inode exhaustion

At this time, it is not possible to know how many inodes were consumed by a particular container.  If the `kubelet` observes
inode exhaustion, it will evict pods by ranking them by quality of service.  The following issue has been opened in cadvisor
to track per container inode consumption [(https://github.com/google/cadvisor/issues/1422)](https://github.com/google/cadvisor/issues/1422) which would allow us to rank pods
by inode consumption.  For example, this would let us identify a container that created large numbers of 0 byte files, and evict
that pod over others.
