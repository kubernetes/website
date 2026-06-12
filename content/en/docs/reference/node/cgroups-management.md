---
title: cgroups Management on Linux Nodes
content_type: concept
weight: 60
---

<!-- overview -->

This page describes how Kubernetes manages
{{< glossary_tooltip text="cgroups" term_id="cgroup" >}} on Linux nodes. cgroups are a
Linux kernel feature, so nothing on this page applies to Windows nodes. This page gives
an overview of the approach; it does not cover every possible customization.

The page describes [cgroup v2](/docs/concepts/architecture/cgroups/) together with the
`systemd` cgroup driver.

<!-- body -->


## Top level cgroups hierarchy

The root directory for all cgroups in a cgroup v2 system is `/sys/fs/cgroup/`. With the
`systemd` [cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/),
Kubernetes organizes {{< glossary_tooltip text="Pods" term_id="pod" >}} into a hierarchy
of [systemd slices](https://www.freedesktop.org/software/systemd/man/latest/systemd.slice.html).
The base slice for all Kubernetes-managed containers is `kubepods.slice`. systemd calls
its own topmost slice the *root slice* and names it `-.slice`; `kubepods.slice` is a
child of the root slice and is not itself one.

The `cgroupRoot` and `cgroupsPerQOS` settings of the
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) control where
the kubelet places this hierarchy and whether it creates the QoS sub-slices, and the
`kubeletCgroups` and `systemCgroups` settings place the kubelet itself and the system
daemons. The paths on this page assume the defaults, so that `kubepods.slice` is a direct
child of `-.slice` and the QoS sub-slices exist. A non-default `cgroupRoot` nests the same
tree under another slice, which changes the paths but not the settings that the kubelet
writes at each level, nor the reasoning behind them.

A typical top level of slices looks like the following:

- `/sys/fs/cgroup/`:
  - `kubepods.slice`: contains all Kubernetes Pods.
  - `system.slice`: contains system services (for example, `sshd`, `containerd`, `kubelet`).
  - `user.slice`: contains user sessions.

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} manages the cgroup settings
of `kubepods.slice` to define its relative importance against system services and user
sessions. These slice settings are intended to help assure node stability.


## Child slices for `kubepods.slice` {#kubepods-child-slices}

Under `kubepods.slice`, Kubernetes creates sub-slices based on the
{{< glossary_tooltip text="Quality of Service (QoS) class" term_id="qos-class" >}} of the
Pods:

1.  **Guaranteed**: the kubelet places these Pods directly under `kubepods.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-pod<UID>.slice/`
1.  **Burstable**: the kubelet places these Pods under `kubepods-burstable.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod<UID>.slice/`
1.  **BestEffort**: the kubelet places these Pods under `kubepods-besteffort.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod<UID>.slice/`

Within each Pod slice, the container runtime creates a further sub-group for each
container in the Pod.

An example tree for a node with one Guaranteed Pod and one Burstable Pod:

```
/sys/fs/cgroup/
├── kubepods.slice/
│   ├── kubepods-pod<UID1>.slice/           # Guaranteed Pod
│   │   ├── cri-containerd-<ID1>.scope      # container 1
│   │   └── cri-containerd-<ID2>.scope      # container 2
│   ├── kubepods-burstable.slice/
│   │   └── kubepods-burstable-pod<UID2>.slice/  # Burstable Pod
│   │       ├── cri-containerd-<ID3>.scope
│   │       └── cri-containerd-<ID4>.scope
│   └── kubepods-besteffort.slice/
├── system.slice/                           # system services
└── user.slice/                             # user sessions
```

This hierarchy gives Pods the resources they requested while still allowing overcommit
of node resources.


## Infrastructure resource management

### CPU

Kubernetes uses two primary mechanisms in cgroup v2 to manage CPU resources:

- **`cpu.weight`**: controls the proportional share of CPU time, and **replaces**
  `cpu.shares` from cgroup v1. It gives each group its requested share of CPU when the
  node is under load.
- **`cpu.max`**: sets a hard limit on CPU usage, and **consolidates** the
  `cpu.cfs_quota_us` and `cpu.cfs_period_us` files from cgroup v1 into a single file. It
  stops a group from using more than a specific amount of CPU time, even when the node is
  idle.

These mechanisms work together to provide both resource guarantees and workload isolation.

#### Algorithm for calculation of CPU weight

cgroup v2 expresses relative CPU priority as `cpu.weight`, whereas cgroup v1 used
`cpu.shares`. Kubernetes derives a `cpu.shares` value from the CPU requests of a
container, and the OCI runtime converts that value into `cpu.weight`.

The original conversion is linear. Under that conversion, the 1024 shares that
correspond to a 1 CPU request map to a weight of approximately `39`, while systemd gives
`system.slice` a default weight of `100`. A Pod that requests 1 CPU therefore ends up
with about 2.5 times less CPU priority than system services.

A non-linear conversion replaces the linear one. The OCI runtime performs the conversion,
so the formula that a node uses depends on the runtime version rather than on a
Kubernetes setting: `runc` applies the non-linear conversion from version 1.3.2 and
`crun` from version 1.23. To read the formula itself and the reasoning behind it, see
[New Conversion from cgroup v1 CPU Shares to v2 CPU Weight](/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/).

#### Design rationale

##### Why not set `cpu.max` on the Pod base cgroup? {#why-not-set-cpu-max-on-pod-base-cgroup}

Kubernetes does not set `cpu.max` on `kubepods.slice`, nor on the intermediate QoS slices
such as `kubepods-burstable.slice`, because a hard limit there introduces collective
throttling that can hurt high-priority Pods.

Consider a node that runs two Pods:

1.  A **Guaranteed** Pod that serves latency-sensitive requests.
1.  A **Burstable** Pod that performs background data processing, with low CPU requests.

With a hard limit (`cpu.max`) on `kubepods.slice`, the following could happen:

- The Burstable Pod consumes the entire collective quota while the Guaranteed Pod is idle.
- A request arrives for the Guaranteed Pod, and the kernel throttles it immediately,
  because `kubepods.slice` has exhausted its quota for the current period, even though
  the Guaranteed Pod itself has used no CPU.

By using only proportional weights (`cpu.weight`) at the `kubepods.slice` and QoS levels,
Kubernetes ensures that:

- Pods can always take up idle CPU cycles across the node.
- Guaranteed Pods can claim their requested share of CPU immediately on demand, and a
  collective quota that lower-priority neighbors exhausted does not block them.
- Each Pod is subject only to the limits in its own cgroup.

##### Setting `cpu.max` on individual Pods

Kubernetes allows omitting CPU limits, which sets `cpu.max` to `max`. Whether to set
limits depends on the QoS behavior and the workload isolation that you need:

- **Guaranteed Pods**: these Pods **must** set CPU limits, because a Pod only joins the
  Guaranteed class when every container sets a CPU limit equal to its CPU request. The
  limit also isolates the Pod from the bursting behavior of other Pods on the node.
- **Burstable and BestEffort Pods**: CPU limits make the performance of these Pods more
  predictable, but they also stop the Pods from bursting into idle CPU cycles. Because
  that leads to less efficient use of node resources, setting CPU limits for Burstable and
  BestEffort Pods is **typically not recommended** unless you require strict isolation.

For more detail on how Kubernetes manages these resources internally, read
[Kubernetes Resources Under the Hood - Part 3](https://medium.com/directeam/kubernetes-resources-under-the-hood-part-3-6ee7d6015965).

##### Hierarchical priority enforcement

The kernel compares `cpu.weight` only among siblings at the same level of the hierarchy.
It does not flatten the hierarchy when it calculates priority.

By placing **Guaranteed Pods** as direct children of `kubepods.slice`, alongside the
Burstable and BestEffort slices, Kubernetes achieves:

- **Direct competition**: a Guaranteed Pod competes directly with the *entire group* of
  Burstable Pods and the *entire group* of BestEffort Pods.
- **Priority isolation**: however many Burstable Pods run on the node, they collectively
  receive only the weight that `kubepods-burstable.slice` carries. This stops a large
  number of low-priority Pods from washing out the priority of a high-priority Guaranteed
  Pod, which is what would happen if they all lived at the same level.
- **Predictable performance**: a Guaranteed Pod with a high weight directly under
  `kubepods.slice` keeps its relative share against the QoS slices, whatever the internal
  complexity or workload of those slices.

#### QoS CPU max calculations

The `cpu.max` setting enforces the hard CPU limit from the `resources.limits.cpu` field of
a container. It uses the format `quota period`, where `quota` is the allowed CPU time
within a given `period`. The `period` defaults to `100000` microseconds.

##### Guaranteed and Burstable Pods

For Pods with CPU limits defined:

- **Pod level**: the kubelet sets `cpu.max` on the cgroup slice of the Pod to the sum of
  the CPU limits of all containers in the Pod.
- **Container level**: each container also has `cpu.max` set to its specific limit.
- **Example**: a container with a `200m` limit results in `20000 100000`, which is 20ms
  per 100ms period.

##### BestEffort Pods

BestEffort Pods have no CPU limits.

- **Pod and container level**: `cpu.max` is set to `max`, so no hard limit applies.

##### QoS slices

The kubelet does not typically enforce a hard CPU limit at the QoS tier level.

- **`kubepods-burstable.slice`**: `cpu.max` is set to `max`.
- **`kubepods-besteffort.slice`**: `cpu.max` is set to `max`.

This design lets Pods within these slices burst into any idle CPU cycles on the node, as
long as they have not hit their own Pod-specific or container-specific limits.

##### Kubernetes Pod base cgroup (`kubepods.slice`)

`kubepods.slice` also has `cpu.max` set to `max`. This value is not configurable;
Kubernetes reserves CPU for system services through `cpu.weight` and `cpuset.cpus` rather
than through a hard limit. The collective set of all Pods can therefore use the entire CPU
capacity of the node while the system does not need it. Read
[Why not set `cpu.max` on the Pod base cgroup?](#why-not-set-cpu-max-on-pod-base-cgroup)
for the reasoning.

#### QoS CPU weight calculations

The `cpu.weight` of `kubepods.slice` is fixed and derives from
[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/). The
kubelet recalculates the weights of its children as Pods arrive and leave, to divide the
available share internally.

- **Guaranteed Pods**: these Pods sit directly under `kubepods.slice`. The kubelet sets
  `cpu.weight` individually from the CPU requests of each Pod.
- **Burstable slice (`kubepods-burstable.slice`)**: its `cpu.weight` is the **sum of all
  CPU requests** of all active Burstable Pods on the node. The Burstable tier as a whole
  therefore carries enough priority to satisfy the requests of its Pods when it competes
  with other tiers.
- **BestEffort slice (`kubepods-besteffort.slice`)**: its `cpu.weight` is fixed at the
  **minimum configurable weighting**, which is `1`. BestEffort Pods therefore receive only
  the CPU cycles that the Guaranteed and Burstable tiers leave unused; assuring this is
  left to the Linux kernel.

### Memory

Kubernetes manages memory resources in cgroup v2 primarily through the **`memory.max`**
setting, which enforces a hard limit. The kubelet applies memory limits to
`kubepods.slice` and to individual Pod and container cgroups, but not to the intermediate
QoS slices. When a cgroup exceeds its limit, the kernel first tries to reclaim memory; if
reclaim fails, the kernel OOM (Out of Memory) killer can kill the processes within that
cgroup.

#### Principles Kubernetes follows

##### Why not set `memory.max` on Burstable and BestEffort slices?

Leaving these slices unlimited may seem counter-intuitive, because it lets Burstable Pods
collectively consume all the memory available to Pods. Kubernetes instead **protects
Guaranteed Pods** through several layers of defense:

- **Individual limits**: every Guaranteed Pod, and every Burstable Pod that defines limits,
  has its own `memory.max` at the Pod cgroup level.
- **Node-pressure eviction (first layer)**: the kubelet monitors node memory usage. When
  usage reaches an
  [eviction threshold](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-thresholds),
  the kubelet evicts Pods to reclaim memory before the kernel OOM killer runs, starting
  with BestEffort Pods and then the Burstable Pods that exceed their requests.
- **OOM score adjustment (second layer)**: if memory pressure grows faster than eviction
  can keep up with, the kernel OOM killer acts as a safety net. Kubernetes sets
  `oom_score_adj` for processes so that the kernel targets lower-priority Pods first
  (BestEffort, then Burstable) and protects Guaranteed Pods. This layer covers the kernel
  OOM killer only. A userspace OOM manager, such as `systemd-oomd`, selects victims by its
  own criteria and ignores `oom_score_adj`, so a node that delegates OOM handling to one
  loses this ordering.
- **Avoiding collective OOM kills**: a hard limit on the Burstable slice could make the
  kernel kill a Pod while the node still has plenty of free memory, only because the
  neighbors of that Pod in the same slice consumed the collective quota.

#### `memory.max` calculation

##### Guaranteed and Burstable Pods

For Pods with memory limits defined:

- **Pod level**: the kubelet sets `memory.max` on the cgroup slice of the Pod to the sum
  of the memory limits of all containers in the Pod.
- **Container level**: each container also has `memory.max` set to its specific limit.
- **Example**: a container with a `256Mi` limit results in `268435456` bytes.

##### BestEffort Pods

BestEffort Pods have no memory limits.

- **Pod and container level**: `memory.max` is set to `max`, so the Pod can in theory
  consume all the memory available on the node.

##### QoS slices

The kubelet does not enforce hard memory limits at the intermediate QoS tier level.

- **`kubepods-burstable.slice`**: `memory.max` is set to `max`.
- **`kubepods-besteffort.slice`**: `memory.max` is set to `max`.


## Appendix

A standard GKE node (`e2-medium`) reports the following settings within
`/sys/fs/cgroup/kubepods.slice/`. Read them as an example rather than as values to expect
on every node.

The kubelet calculates the following from
[Node Allocatable and reserved resources](/docs/tasks/administer-cluster/reserve-compute-resources/):

- **`cpu.weight`**: `37`. Relative CPU weight for all Pods.
- **`memory.max`**: `3040550912`. Hard memory limit for the entire `kubepods.slice`.
- **`pids.max`**: `4194304`. Maximum number of processes across all Pods.

The `cpu.weight` value defines the CPU share that Kubernetes-managed Pods receive compared
with the system processes. The default `cpu.weight` for `system.slice` is `100`. Read
[New Conversion from cgroup v1 CPU Shares to v2 CPU Weight](/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)
to understand why the weight of `system.slice` is so much higher than the weight of
`kubepods.slice` in this example.

The `memory.max` and `pids.max` settings keep Kubernetes workloads from consuming the
resources that the node reserves for system daemons.

CPU reservation for system daemons:

- **`cpuset.cpus`**: `0-1`. CPU cores available to Pods. The kubelet calculates this from
  its `reservedSystemCPUs` configuration setting, or from the `--reserved-cpus` command
  line argument.

The kubelet also writes one setting that restates a kernel default:

- **`cpu.max`**: `max 100000`. No hard limit, so Pods can use all the CPU of the node.

Read
[Why not set `cpu.max` on the Pod base cgroup?](#why-not-set-cpu-max-on-pod-base-cgroup)
to learn why this is set to `max`.


## {{% heading "whatsnext" %}}

- Read [About cgroup v2](/docs/concepts/architecture/cgroups/)
- Read about [Pod Quality of Service classes](/docs/concepts/workloads/pods/pod-qos/)
- Learn how to [reserve compute resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/)
