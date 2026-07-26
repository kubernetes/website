---
layout: blog
title: "Kubernetes v1.36: Tiered Memory Protection with Memory QoS"
date: 2026-04-29T10:35:00-08:00
slug: kubernetes-v1-36-memory-qos-tiered-protection
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
---

On behalf of SIG Node, we are pleased to announce updates to the Memory QoS
feature (alpha) in Kubernetes v1.36. Memory QoS uses the cgroup v2 memory
controller to give the kernel better guidance on how to treat container memory.
It was first introduced in v1.22 and updated in v1.27. In Kubernetes v1.36, we're introducing: opt-in memory reservation, tiered
protection by QoS class, observability metrics, and kernel-version warning for `memory.high`.

## What's new in v1.36

### Opt-in memory reservation with `memoryReservationPolicy`

v1.36 separates throttling from reservation. Enabling the feature gate turns on
`memory.high` throttling (the kubelet sets `memory.high` based on
`memoryThrottlingFactor`, default 0.9), but memory reservation is now controlled
by a separate kubelet configuration field:

- **`None`** (default): no `memory.min` or `memory.low` is written. Throttling
  via `memory.high` still works.
- **`TieredReservation`**: the kubelet writes tiered memory protection based on the Pod's
[QoS class](/docs/concepts/workloads/pods/pod-qos/):

**Guaranteed** Pods get hard protection via `memory.min`. For example, a
Guaranteed Pod requesting 512 MiB of memory results in:

```none
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-pod6a4f2e3b_1c9d_4a5e_8f7b_2d3e4f5a6b7c.slice/memory.min
536870912
```

The kernel will not reclaim this memory under any circumstances. If it cannot
honor the guarantee, it invokes the OOM killer on other processes to free pages.

**Burstable** Pods get soft protection via `memory.low`. For the same 512 MiB
request on a Burstable Pod:

```none
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod8b3c7d2e_4f5a_6b7c_9d1e_3f4a5b6c7d8e.slice/memory.low
536870912
```

The kernel avoids reclaiming this memory under normal pressure, but may reclaim
it if the alternative is a system-wide OOM.

**BestEffort** Pods get neither `memory.min` nor `memory.low`. Their memory
remains fully reclaimable.

#### Comparison with v1.27 behavior

In earlier versions, enabling the MemoryQoS feature gate immediately set `memory.min` for every container with a memory request. `memory.min` is a hard reservation that the kernel will not reclaim, regardless of memory pressure.

Consider a node with 8 GiB of RAM where Burstable Pod requests total 7 GiB. In earlier versions, that 7 GiB would be locked as `memory.min`, leaving little headroom for the kernel, system daemons, or BestEffort workloads and increasing the risk of OOM kills.

With v1.36 tiered reservation, those Burstable requests map to `memory.low` instead of `memory.min`. Under normal pressure, the kernel still protects that memory, but under extreme pressure it can reclaim part of it to avoid system-wide OOM. Only Guaranteed Pods use `memory.min`, which keeps hard reservation lower.

With `memoryReservationPolicy` in v1.36, you can enable throttling first, observe workload behavior, and opt into reservation when your node has enough headroom.

### Observability metrics

Two alpha-stability metrics are exposed on the kubelet `/metrics` endpoint:

| Metric | Description |
|--------|-------------|
| `kubelet_memory_qos_node_memory_min_bytes` | Total `memory.min` across Guaranteed Pods |
| `kubelet_memory_qos_node_memory_low_bytes` | Total `memory.low` across Burstable Pods |

These are useful for capacity planning. If `kubelet_memory_qos_node_memory_min_bytes`
is creeping toward your node's physical memory, you know hard reservation is
getting tight.

```none
$ curl -sk https://localhost:10250/metrics | grep memory_qos
# HELP kubelet_memory_qos_node_memory_min_bytes [ALPHA] Total memory.min in bytes for Guaranteed pods
kubelet_memory_qos_node_memory_min_bytes 5.36870912e+08
# HELP kubelet_memory_qos_node_memory_low_bytes [ALPHA] Total memory.low in bytes for Burstable pods
kubelet_memory_qos_node_memory_low_bytes 2.147483648e+09
```

### Kernel version check

On kernels older than 5.9, `memory.high` throttling can trigger the
[kernel livelock](https://lore.kernel.org/all/a4e23b59e9ef499b575ae73a8120ee089b7d3373.1594640214.git.chris@chrisdown.name/) issue. The bug was fixed
in kernel 5.9. In v1.36, when the feature gate is enabled, the kubelet checks the
kernel version at startup and logs a warning if it is below 5.9. The feature
continues to work — this is informational, not a hard block.

### How Kubernetes maps Memory QoS to cgroup v2

Memory QoS uses four cgroup v2 memory controller interfaces:

- **`memory.max`**: hard memory limit — unchanged from previous versions
- **`memory.min`**: hard memory protection — with `TieredReservation`, set only for Guaranteed Pods
- **`memory.low`**: soft memory protection — set for Burstable Pods with `TieredReservation`
- **`memory.high`**: memory throttling threshold — unchanged from previous versions

The following table shows how Kubernetes container resources map to cgroup v2
interfaces when `memoryReservationPolicy: TieredReservation` is configured.
With the default `memoryReservationPolicy: None`, no `memory.min` or
`memory.low` values are set.

<table>
    <tr>
        <th>QoS Class</th>
        <th><tt>memory.min</tt></th>
        <th><tt>memory.low</tt></th>
        <th><tt>memory.high</tt></th>
        <th><tt>memory.max</tt></th>
    </tr>
    <tr>
        <td><b>Guaranteed</b></td>
        <td>Set to <code>requests.memory</code><br>(hard protection)</td>
        <td>Not set</td>
        <td>Not set<br>(requests == limits, so throttling is not useful)</td>
        <td>Set to <code>limits.memory</code></td>
    </tr>
    <tr>
        <td><b>Burstable</b></td>
        <td>Not set</td>
        <td>Set to <code>requests.memory</code><br>(soft protection)</td>
        <td>Calculated based on<br>formula with throttling factor</td>
        <td>Set to <code>limits.memory</code><br>(if specified)</td>
    </tr>
    <tr>
        <td><b>BestEffort</b></td>
        <td>Not set</td>
        <td>Not set</td>
        <td>Calculated based on<br>node allocatable memory</td>
        <td>Not set</td>
    </tr>
</table>

### Cgroup hierarchy

cgroup v2 requires that a parent cgroup's memory protection is at least as
large as the sum of its children's. The kubelet maintains this by setting
`memory.min` on the kubepods root cgroup to the sum of all Guaranteed and
Burstable Pod memory requests, and `memory.low` on the Burstable QoS cgroup
to the sum of all Burstable Pod memory requests. This way the kernel can
enforce the per-container and per-pod protection values correctly.

The kubelet manages pod-level and QoS-class cgroups directly using the runc
libcontainer library, while container-level cgroups are managed by the
container runtime (containerd or CRI-O).

## How do I use it?

### Prerequisites

1. Kubernetes v1.36 or later
2. Linux with cgroup v2. Kernel 5.9 or higher is recommended — earlier kernels
   work but may experience the livelock issue. You can verify cgroup v2 is
   active by running `mount | grep cgroup2`.
3. A container runtime that supports cgroup v2 (containerd 1.6+, CRI-O 1.22+)

### Configuration

To enable Memory QoS with tiered protection:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: TieredReservation  # Options: None (default), TieredReservation
memoryThrottlingFactor: 0.9  # Optional: default is 0.9
```

If you want `memory.high` throttling without memory protection, omit
`memoryReservationPolicy` or set it to `None`:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: None  # This is the default
```

## How can I learn more?

- [KEP-2570: Memory QoS](https://kep.k8s.io/2570)
- [Pod Quality of Service Classes](/docs/concepts/workloads/pods/pod-qos/)
- [Managing Resources for Containers](/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes cgroups v2 support](/docs/concepts/architecture/cgroups/)
- [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)

## Getting involved

This feature is driven by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
If you are interested in contributing or have feedback, you can find us on
[Slack](https://kubernetes.slack.com/messages/sig-node) (#sig-node), the
[mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node),
or at the regular
[SIG Node meetings](https://github.com/kubernetes/community/tree/master/sig-node#meetings).
Please file bugs at [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues)
and enhancement proposals at
[kubernetes/enhancements](https://github.com/kubernetes/enhancements/issues/2570).