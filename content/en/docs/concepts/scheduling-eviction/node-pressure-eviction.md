---
title: Node-pressure Eviction
content_type: concept
weight: 100
---

{{<glossary_definition term_id="node-pressure-eviction" length="short">}}</br>

{{< feature-state feature_gate_name="KubeletSeparateDiskGC" >}}

{{<note>}}
The _split image filesystem_ feature, which enables support for the `containerfs`
filesystem, adds several new eviction signals, thresholds and metrics. To use
`containerfs`, the Kubernetes release v{{< skew currentVersion >}} requires the
`KubeletSeparateDiskGC` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to be enabled. Currently, only CRI-O (v1.29 or higher) offers the `containerfs`
filesystem support.
{{</note>}}

The {{<glossary_tooltip term_id="kubelet" text="kubelet">}} monitors resources
like memory, disk space, and filesystem inodes on your cluster's nodes.
When one or more of these resources reach specific consumption levels, the
kubelet can proactively fail one or more pods on the node to reclaim resources
and prevent starvation.

During a node-pressure eviction, the kubelet sets the [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) for the
selected pods to `Failed`, and terminates the Pod.

Node-pressure eviction is not the same as
[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).

The kubelet does not respect your configured {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}
or the pod's
`terminationGracePeriodSeconds`. If you use [soft eviction thresholds](#soft-eviction-thresholds),
the kubelet respects your configured `eviction-max-pod-grace-period`. If you use
[hard eviction thresholds](#hard-eviction-thresholds), the kubelet uses a `0s` grace period (immediate shutdown) for termination.

## Self healing behavior

The kubelet attempts to [reclaim node-level resources](#reclaim-node-resources)
before it terminates end-user pods. For example, it removes unused container
images when disk resources are starved.

If the pods are managed by a {{< glossary_tooltip text="workload" term_id="workload" >}}
management object (such as {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
or {{< glossary_tooltip text="Deployment" term_id="deployment" >}}) that
replaces failed pods, the control plane (`kube-controller-manager`) creates new
pods in place of the evicted pods.

### Self healing for static pods

If you are running a [static pod](/docs/concepts/workloads/pods/#static-pods)
on a node that is under resource pressure, the kubelet may evict that static
Pod. The kubelet then tries to create a replacement, because static Pods always
represent an intent to run a Pod on that node.

The kubelet takes the _priority_ of the static pod into account when creating
a replacement. If the static pod manifest specifies a low priority, and there
are higher-priority Pods defined within the cluster's control plane, and the
node is under resource pressure, the kubelet may not be able to make room for
that static pod. The kubelet continues to attempt to run all static pods even
when there is resource pressure on a node.

## Eviction signals and thresholds

The kubelet uses various parameters to make eviction decisions, like the following:

- Eviction signals
- Eviction thresholds
- Monitoring intervals

### Eviction signals {#eviction-signals}

Eviction signals are the current state of a particular resource at a specific
point in time. The kubelet uses eviction signals to make eviction decisions by
comparing the signals to eviction thresholds, which are the minimum amount of
the resource that should be available on the node.

The kubelet uses the following eviction signals:

| Eviction Signal          | Description                                                                           | Linux Only |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| `memory.available`       | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |            |
| `nodefs.available`       | `nodefs.available` := `node.stats.fs.available`                                       |            |
| `nodefs.inodesFree`      | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |      •     |
| `imagefs.available`      | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |            |
| `imagefs.inodesFree`     | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |      •     |
| `containerfs.available`  | `containerfs.available` := `node.stats.runtime.containerfs.available`                 |            |
| `containerfs.inodesFree` | `containerfs.inodesFree` := `node.stats.runtime.containerfs.inodesFree`               |      •     |
| `pid.available`          | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |      •     |

In this table, the **Description** column shows how kubelet gets the value of the
signal. Each signal supports either a percentage or a literal value. The kubelet
calculates the percentage value relative to the total capacity associated with
the signal.

#### Memory signals

On Linux nodes, the value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`. This is important because `free -m` does not work in a
container, and if users use the [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
feature, out of resource decisions
are made local to the end user Pod part of the cgroup hierarchy as well as the
root node. This [script](/examples/admin/resource/memory-available.sh) or
[cgroupv2 script](/examples/admin/resource/memory-available-cgroupv2.sh)
reproduces the same set of steps that the kubelet performs to calculate
`memory.available`. The kubelet excludes inactive_file (the number of bytes of
file-backed memory on the inactive LRU list) from its calculation, as it assumes that
memory is reclaimable under pressure.

On Windows nodes, the value for `memory.available` is derived from the node's global
memory commit levels (queried through the [`GetPerformanceInfo()`](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)
system call) by subtracting the node's global [`CommitTotal`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information) from the node's [`CommitLimit`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information). Please note that `CommitLimit` can change if the node's page-file size changes!

#### Filesystem signals

The kubelet recognizes three specific filesystem identifiers that can be used with
eviction signals (`<identifier>.inodesFree` or `<identifier>.available`):

1. `nodefs`: The node's main filesystem, used for local disk volumes,
    emptyDir volumes not backed by memory, log storage, ephemeral storage,
    and more. For example, `nodefs` contains `/var/lib/kubelet`.

1. `imagefs`: An optional filesystem that container runtimes can use to store
   container images (which are the read-only layers) and container writable
   layers.

1. `containerfs`: An optional filesystem that container runtime can use to
   store the writeable layers. Similar to the main filesystem (see `nodefs`),
   it's used to store local disk volumes, emptyDir volumes not backed by memory,
   log storage, and ephemeral storage, except for the container images. When
   `containerfs` is used, the `imagefs` filesystem can be split to only store
   images (read-only layers) and nothing else.

As such, kubelet generally allows three options for container filesystems:

- Everything is on the single `nodefs`, also referred to as "rootfs" or
  simply "root", and there is no dedicated image filesystem.

- Container storage (see `nodefs`) is on a dedicated disk, and `imagefs`
  (writable and read-only layers) is separate from the root filesystem.
  This is often referred to as "split disk" (or "separate disk") filesystem.

- Container filesystem `containerfs` (same as `nodefs` plus writable
  layers) is on root and the container images (read-only layers) are
  stored on separate `imagefs`. This is often referred to as "split image"
  filesystem.

The kubelet will attempt to auto-discover these filesystems with their current
configuration directly from the underlying container runtime and will ignore
other local node filesystems.

The kubelet does not support other container filesystems or storage configurations,
and it does not currently support multiple filesystems for images and containers.

### Deprecated kubelet garbage collection features

Some kubelet garbage collection features are deprecated in favor of eviction:

| Existing Flag | Rationale |
| ------------- | --------- |
| `--maximum-dead-containers` | deprecated once old logs are stored outside of container's context |
| `--maximum-dead-containers-per-container` | deprecated once old logs are stored outside of container's context |
| `--minimum-container-ttl-duration` | deprecated once old logs are stored outside of container's context |

### Eviction thresholds

You can specify custom eviction thresholds for the kubelet to use when it makes
eviction decisions. You can configure [soft](#soft-eviction-thresholds) and
[hard](#hard-eviction-thresholds) eviction thresholds.

Eviction thresholds have the form `[eviction-signal][operator][quantity]`, where:

- `eviction-signal` is the [eviction signal](#eviction-signals) to use.
- `operator` is the [relational operator](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)
  you want, such as `<` (less than).
- `quantity` is the eviction threshold amount, such as `1Gi`. The value of `quantity`
  must match the quantity representation used by Kubernetes. You can use either
  literal values or percentages (`%`).

For example, if a node has 10GiB of total memory and you want trigger eviction if
the available memory falls below 1GiB, you can define the eviction threshold as
either `memory.available<10%` or `memory.available<1Gi` (you cannot use both).

#### Soft eviction thresholds {#soft-eviction-thresholds}

A soft eviction threshold pairs an eviction threshold with a required
administrator-specified grace period. The kubelet does not evict pods until the
grace period is exceeded. The kubelet returns an error on startup if you do
not specify a grace period.

You can specify both a soft eviction threshold grace period and a maximum
allowed pod termination grace period for kubelet to use during evictions. If you
specify a maximum allowed grace period and the soft eviction threshold is met,
the kubelet uses the lesser of the two grace periods. If you do not specify a
maximum allowed grace period, the kubelet kills evicted pods immediately without
graceful termination.

You can use the following flags to configure soft eviction thresholds:

- `eviction-soft`: A set of eviction thresholds like `memory.available<1.5Gi`
  that can trigger pod eviction if held over the specified grace period.
- `eviction-soft-grace-period`: A set of eviction grace periods like `memory.available=1m30s`
  that define how long a soft eviction threshold must hold before triggering a Pod eviction.
- `eviction-max-pod-grace-period`: The maximum allowed grace period (in seconds)
  to use when terminating pods in response to a soft eviction threshold being met.

#### Hard eviction thresholds {#hard-eviction-thresholds}

A hard eviction threshold has no grace period. When a hard eviction threshold is
met, the kubelet kills pods immediately without graceful termination to reclaim
the starved resource.

You can use the `eviction-hard` flag to configure a set of hard eviction
thresholds like `memory.available<1Gi`.

The kubelet has the following default hard eviction thresholds:

- `memory.available<100Mi` (Linux nodes)
- `memory.available<500Mi` (Windows nodes)
- `nodefs.available<10%`
- `imagefs.available<15%`
- `nodefs.inodesFree<5%` (Linux nodes)
- `imagefs.inodesFree<5%` (Linux nodes)

These default values of hard eviction thresholds will only be set if none
of the parameters is changed. If you change the value of any parameter,
then the values of other parameters will not be inherited as the default
values and will be set to zero. In order to provide custom values, you
should provide all the thresholds respectively.

The `containerfs.available` and `containerfs.inodesFree` (Linux nodes) default
eviction thresholds will be set as follows:

- If a single filesystem is used for everything, then `containerfs` thresholds
  are set the same as `nodefs`.

- If separate filesystems are configured for both images and containers,
  then `containerfs` thresholds are set the same as `imagefs`.

Setting custom overrides for thresholds related to `containersfs` is currently
not supported, and a warning will be issued if an attempt to do so is made; any
provided custom values will, as such, be ignored.

## Eviction monitoring interval

The kubelet evaluates eviction thresholds based on its configured `housekeeping-interval`,
which defaults to `10s`.

## Node conditions {#node-conditions}

The kubelet reports [node conditions](/docs/concepts/architecture/nodes/#condition)
to reflect that the node is under pressure because hard or soft eviction
threshold is met, independent of configured grace periods.

The kubelet maps eviction signals to node conditions as follows:

| Node Condition    | Eviction Signal                                                                       | Description                                                                                |
|-------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `MemoryPressure`  | `memory.available`                                                                    | Available memory on the node has satisfied an eviction threshold                           |
| `DiskPressure`    | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, `imagefs.inodesFree`, `containerfs.available`, or `containerfs.inodesFree` | Available disk space and inodes on either the node's root filesystem, image filesystem, or container filesystem has satisfied an eviction threshold              |
| `PIDPressure`     | `pid.available`                                                                       | Available processes identifiers on the (Linux) node has fallen below an eviction threshold |

The control plane also [maps](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
these node conditions to taints.

The kubelet updates the node conditions based on the configured
`--node-status-update-frequency`, which defaults to `10s`.

### Node condition oscillation

In some cases, nodes oscillate above and below soft eviction thresholds without
holding for the defined grace periods. This causes the reported node condition
to constantly switch between `true` and `false`, leading to bad eviction decisions.

To protect against oscillation, you can use the `eviction-pressure-transition-period`
flag, which controls how long the kubelet must wait before transitioning a node
condition to a different state. The transition period has a default value of `5m`.

### Reclaiming node level resources {#reclaim-node-resources}

The kubelet tries to reclaim node-level resources before it evicts end-user pods.

When a `DiskPressure` node condition is reported, the kubelet reclaims node-level
resources based on the filesystems on the node.

#### Without `imagefs` or `containerfs`

If the node only has a `nodefs` filesystem that meets eviction thresholds,
the kubelet frees up disk space in the following order:

1. Garbage collect dead pods and containers.
1. Delete unused images.

#### With `imagefs`

If the node has a dedicated `imagefs` filesystem for container runtimes to use,
the kubelet does the following:

- If the `nodefs` filesystem meets the eviction thresholds, the kubelet garbage
  collects dead pods and containers.

- If the `imagefs` filesystem meets the eviction thresholds, the kubelet
  deletes all unused images.

#### With `imagefs` and `containerfs`

If the node has a dedicated `containerfs` alongside the `imagefs` filesystem
configured for the container runtimes to use, then kubelet will attempt to
reclaim resources as follows:

- If the `containerfs` filesystem meets the eviction thresholds, the kubelet
  garbage collects dead pods and containers.

- If the `imagefs` filesystem meets the eviction thresholds, the kubelet
  deletes all unused images.

### Pod selection for kubelet eviction

If the kubelet's attempts to reclaim node-level resources don't bring the eviction
signal below the threshold, the kubelet begins to evict end-user pods.

The kubelet uses the following parameters to determine the pod eviction order:

1. Whether the pod's resource usage exceeds requests
1. [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. The pod's resource usage relative to requests

As a result, kubelet ranks and evicts pods in the following order:

1. `BestEffort` or `Burstable` pods where the usage exceeds requests. These pods
   are evicted based on their Priority and then by how much their usage level
   exceeds the request.

1. `Guaranteed` pods and `Burstable` pods where the usage is less than requests
   are evicted last, based on their Priority.

{{<note>}}
The kubelet does not use the pod's [QoS class](/docs/concepts/workloads/pods/pod-qos/) to determine the eviction order.
You can use the QoS class to estimate the most likely pod eviction order when
reclaiming resources like memory. QoS classification does not apply to EphemeralStorage requests,
so the above scenario will not apply if the node is, for example, under `DiskPressure`.
{{</note>}}

`Guaranteed` pods are guaranteed only when requests and limits are specified for
all the containers and they are equal. These pods will never be evicted because
of another pod's resource consumption. If a system daemon (such as `kubelet`
and `journald`) is consuming more resources than were reserved via
`system-reserved` or `kube-reserved` allocations, and the node only has
`Guaranteed` or `Burstable` pods using less resources than requests left on it,
then the kubelet must choose to evict one of these pods to preserve node stability
and to limit the impact of resource starvation on other pods. In this case, it
will choose to evict pods of lowest Priority first.

If you are running a [static pod](/docs/concepts/workloads/pods/#static-pods)
and want to avoid having it evicted under resource pressure, set the
`priority` field for that Pod directly. Static pods do not support the
`priorityClassName` field.

When the kubelet evicts pods in response to inode or process ID starvation, it uses
the Pods' relative priority to determine the eviction order, because inodes and PIDs have no
requests.

The kubelet sorts pods differently based on whether the node has a dedicated
`imagefs` or `containerfs` filesystem:

#### Without `imagefs` or `containerfs` (`nodefs` and `imagefs` use the same filesystem) {#without-imagefs}

- If `nodefs` triggers evictions, the kubelet sorts pods based on their
  total disk usage (`local volumes + logs and a writable layer of all containers`).

#### With `imagefs` (`nodefs` and `imagefs` filesystems are separate) {#with-imagefs}

- If `nodefs` triggers evictions, the kubelet sorts pods based on `nodefs`
  usage (`local volumes + logs of all containers`).

- If `imagefs` triggers evictions, the kubelet sorts pods based on the
  writable layer usage of all containers.

#### With `imagesfs` and `containerfs` (`imagefs` and `containerfs` have been split) {#with-containersfs}

- If `containerfs` triggers evictions, the kubelet sorts pods based on
  `containerfs` usage (`local volumes + logs and a writable layer of all containers`).

- If `imagefs` triggers evictions, the kubelet sorts pods based on the
  `storage of images` rank, which represents the disk usage of a given image.

### Minimum eviction reclaim

{{<note>}}
As of Kubernetes v{{< skew currentVersion >}}, you cannot set a custom value
for the `containerfs.available` metric. The configuration for this specific
metric will be set automatically to reflect values set for either the `nodefs`
or `imagefs`, depending on the configuration.
{{</note>}}

In some cases, pod eviction only reclaims a small amount of the starved resource.
This can lead to the kubelet repeatedly hitting the configured eviction thresholds
and triggering multiple evictions.

You can use the `--eviction-minimum-reclaim` flag or a [kubelet config file](/docs/tasks/administer-cluster/kubelet-config-file/)
to configure a minimum reclaim amount for each resource. When the kubelet notices
that a resource is starved, it continues to reclaim that resource until it
reclaims the quantity you specify.

For example, the following configuration sets minimum reclaim amounts:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "1Gi"
  imagefs.available: "100Gi"
evictionMinimumReclaim:
  memory.available: "0Mi"
  nodefs.available: "500Mi"
  imagefs.available: "2Gi"
```

In this example, if the `nodefs.available` signal meets the eviction threshold,
the kubelet reclaims the resource until the signal reaches the threshold of 1GiB,
and then continues to reclaim the minimum amount of 500MiB, until the available
nodefs storage value reaches 1.5GiB.

Similarly, the kubelet tries to reclaim the `imagefs` resource until the `imagefs.available`
value reaches `102Gi`, representing 102 GiB of available container image storage. If the amount
of storage that the kubelet could reclaim is less than 2GiB, the kubelet doesn't reclaim anything.

The default `eviction-minimum-reclaim` is `0` for all resources.

## Node out of memory behavior

If the node experiences an _out of memory_ (OOM) event prior to the kubelet
being able to reclaim memory, the node depends on the [oom_killer](https://lwn.net/Articles/391222/)
to respond.

The kubelet sets an `oom_score_adj` value for each container based on the QoS for the pod.

| Quality of Service | `oom_score_adj`                                                                   |
|--------------------|-----------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                              |
| `BestEffort`       | 1000                                                                              |
| `Burstable`        | _min(max(2, 1000 - (1000 × memoryRequestBytes) / machineMemoryCapacityBytes), 999)_ |

{{<note>}}
The kubelet also sets an `oom_score_adj` value of `-997` for any containers in Pods that have
`system-node-critical` {{<glossary_tooltip text="Priority" term_id="pod-priority">}}.
{{</note>}}

If the kubelet can't reclaim memory before a node experiences OOM, the
`oom_killer` calculates an `oom_score` based on the percentage of memory it's
using on the node, and then adds the `oom_score_adj` to get an effective `oom_score`
for each container. It then kills the container with the highest score.

This means that containers in low QoS pods that consume a large amount of memory
relative to their scheduling requests are killed first.

Unlike pod eviction, if a container is OOM killed, the kubelet can restart it
based on its `restartPolicy`.

## Good practices {#node-pressure-eviction-good-practices}

The following sections describe good practice for eviction configuration.

### Schedulable resources and eviction policies

When you configure the kubelet with an eviction policy, you should make sure that
the scheduler will not schedule pods if they will trigger eviction because they
immediately induce memory pressure.

Consider the following scenario:

- Node memory capacity: 10GiB
- Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
- Operator wants to evict Pods at 95% memory utilization to reduce incidence of system OOM.

For this to work, the kubelet is launched as follows:

```none
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

In this configuration, the `--system-reserved` flag reserves 1.5GiB of memory
for the system, which is `10% of the total memory + the eviction threshold amount`.

The node can reach the eviction threshold if a pod is using more than its request,
or if the system is using more than 1GiB of memory, which makes the `memory.available`
signal fall below 500MiB and triggers the threshold.

### DaemonSets and node-pressure eviction {#daemonset}

Pod priority is a major factor in making eviction decisions. If you do not want
the kubelet to evict pods that belong to a DaemonSet, give those pods a high
enough priority by specifying a suitable `priorityClassName` in the pod spec.
You can also use a lower priority, or the default, to only allow pods from that
DaemonSet to run when there are enough resources.

## Known issues

The following sections describe known issues related to out of resource handling.

### kubelet may not observe memory pressure right away

By default, the kubelet polls cAdvisor to collect memory usage stats at a
regular interval. If memory usage increases within that window rapidly, the
kubelet may not observe `MemoryPressure` fast enough, and the OOM killer
will still be invoked.

You can use the `--kernel-memcg-notification` flag to enable the `memcg`
notification API on the kubelet to get notified immediately when a threshold
is crossed.

If you are not trying to achieve extreme utilization, but a sensible measure of
overcommit, a viable workaround for this issue is to use the `--kube-reserved`
and `--system-reserved` flags to allocate memory for the system.

### active_file memory is not considered as available memory

On Linux, the kernel tracks the number of bytes of file-backed memory on active
least recently used (LRU) list as the `active_file` statistic. The kubelet treats `active_file` memory
areas as not reclaimable. For workloads that make intensive use of block-backed
local storage, including ephemeral local storage, kernel-level caches of file
and block data means that many recently accessed cache pages are likely to be
counted as `active_file`. If enough of these kernel block buffers are on the
active LRU list, the kubelet is liable to observe this as high resource use and
taint the node as experiencing memory pressure - triggering pod eviction.

For more details, see [https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)

You can work around that behavior by setting the memory limit and memory request
the same for containers likely to perform intensive I/O activity. You will need
to estimate or measure an optimal memory limit value for that container.

## {{% heading "whatsnext" %}}

- Learn about [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/)
- Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
- Learn about [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
- Learn about [Quality of Service](/docs/tasks/configure-pod-container/quality-service-pod/) (QoS)
- Check out the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
