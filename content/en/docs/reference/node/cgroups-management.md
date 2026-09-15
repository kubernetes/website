---
title: CGroups management in Kubernetes
content_type: concept
weight: 55
---

<!-- overview -->

This document describes the cgroups management in Kubernetes nodes. This is an overview the describes the approach and is not going into details of all possible customizations.

The document concentrates on cgroupv2 and systemd cgroup driver.

<!-- body -->

## Top level Cgroups hierarchy

The root directory for all cgroups in a cgroupv2 system is `/sys/fs/cgroup/`. When using the `systemd` cgroup driver, Kubernetes organizes pods into a hierarchy of systemd slices. The root for all Kubernetes-managed containers is `kubepods.slice`.

Some non-standard cgroup configuration can be done using the settings `kubeletCgroups`, `systemCgroups`, `cgroupRoot`, and `cgroupsPerQOS` of [kubelet configuration](https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/). These are not covered in this article.

A typical top level of slices looks like the following:

- `/sys/fs/cgroup/`:
  - `kubepods.slice`: Contains all Kubernetes pods.
  - `system.slice`: Contains system services (for example, `sshd`, `containerd`, `kubelet`).
  - `user.slice`: Contains user sessions.

The kubelet manages the cgroup settings of `kubepods.slice` to define its
relative importance against system services and user sessions.
These slice settings are intended to help assure node stability.

## Child slices for `kubepods.slice` {#kubepods-child-slices}

Under `kubepods.slice`, Kubernetes creates sub-slices based on the Quality of Service (QoS) class of the pods:

1.  **Guaranteed**: These pods are placed directly under `kubepods.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-pod<UID>.slice/`
2.  **Burstable**: These pods are placed under the `kubepods-burstable.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod<UID>.slice/`
3.  **BestEffort**: These pods are placed under the `kubepods-besteffort.slice`.
    - Path: `/sys/fs/cgroup/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod<UID>.slice/`

Within each pod slice, there are further sub-groups for each container in the pod.

An example tree for a node with one Guaranteed pod and one Burstable pod:

```
/sys/fs/cgroup/
├── kubepods.slice/
│   ├── kubepods-pod<UID1>.slice/           # Guaranteed pod
│   │   ├── cri-containerd-<ID1>.scope      # container 1
│   │   └── cri-containerd-<ID2>.scope      # container 2
│   ├── kubepods-burstable.slice/
│   │   └── kubepods-burstable-pod<UID2>.slice/  # Burstable pod
│   │       ├── cri-containerd-<ID3>.scope
│   │       └── cri-containerd-<ID4>.scope
│   └── kubepods-besteffort.slice/
├── system.slice/                           # system services
└── user.slice/                             # user sessions
```

The main goal of this hierarchy is to ensure that Pods are getting resources they requested while allowing overcommit of resources.

## Infrastructure resource management

### CPU

Kubernetes uses two primary mechanisms in cgroupv2 to manage CPU resources:

- **`cpu.weight`**: Controls the proportional share of CPU time. This **replaces** `cpu.shares` from cgroupv1. It ensures that groups receive their requested share of CPU when the node is under load.
- **`cpu.max`**: Sets a hard limit on CPU usage. This **consolidates** the legacy `cpu.cfs_quota_us` and `cpu.cfs_period_us` from cgroupv1 into a single file. It prevents a group from using more than a specific amount of CPU time, even if the node is idle.

These mechanisms work together to provide both resource guarantees and workload isolation.

#### Algorithm for calculation of CPU weight

In cgroupv2, resource control is handled through different files than in cgroupv1. Originally, `cpu.weight` was mapped to `cpu.shares` using the linear formula.

This formula has many issues. For example, under this formula, the standard 1024 shares (1 CPU) maps to approximately **40 weight**. However, systemd's default weight for `system.slice` is **100**. This means that by default, system services are prioritized ~2.5x higher than pods with 1 CPU request.

So the non-linear formula is being rolled out as discussed in the [January 2026 Kubernetes Blog](https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/).

#### Design rationale

##### Why not set `cpu.max` on root cgroup?

We do not set `cpu.max` on the root `kubepods.slice` or the intermediate QoS slices (`kubepods-burstable.slice`, etc.) because doing so would introduce collective throttling that can negatively impact high-priority pods.

Consider a scenario with two pods:
1.  **Guaranteed Pod**: Serving latency-sensitive requests.
2.  **Burstable Pod**: Performing background data processing (with low CPU requests).

If a hard limit (`cpu.max`) were set on the root `kubepods.slice`, the following could occur:
-   The Burstable pod could consume the entire collective quota while the Guaranteed pod is idle.
-   When a request arrives for the Guaranteed pod, it might be immediately throttled because the *root cgroup* has exhausted its quota for the current period, even if the Guaranteed pod itself has used no CPU.

By using only proportional weights (`cpu.weight`) at the root and QoS levels, Kubernetes ensures that:
-   Pods can always scavenge idle CPU cycles across the node.
-   High-priority (Guaranteed) pods can always preempt or claim their requested share of CPU immediately upon demand, without being blocked by a collective quota exhausted by lower-priority neighbors.
-   Pods are only subject to their own specific limits defined in their individual cgroups.

##### Setting cpu.max on individual Pods

While Kubernetes allows omitting CPU limits (which sets `cpu.max` to `max`), the decision to set them should depend on the desired QoS behavior and workload isolation requirements.

**Summary of Advice:**
- **Guaranteed Pods**: These pods **must** set CPU limits. This ensures they always receive their fair share of total CPU predictably and are isolated from the bursting behavior of other pods on the node.
- **Burstable and BestEffort Pods**: Setting CPU limits for these pods can make their performance more predictable, but it also prevents them from bursting into idle CPU cycles. Because this leads to less efficient use of node resources, setting CPU limits for Burstable and BestEffort pods is **typically not recommended** unless strict isolation is required.

For a deeper dive into how these resources are managed under the hood, see [Kubernetes Resources Under the Hood - Part 3](https://medium.com/directeam/kubernetes-resources-under-the-hood-part-3-6ee7d6015965).

##### Hierarchical Priority Enforcement

It is important to note that `cpu.weight` is considered only among siblings at the same level of the hierarchy. The hierarchy is not "flattened" when calculating priority.

By placing **Guaranteed pods** as direct children of `kubepods.slice` (alongside the Burstable and BestEffort slices), Kubernetes ensures:
- **Direct Competition**: Guaranteed pods compete directly with the *entire group* of Burstable pods and the *entire group* of BestEffort pods.
- **Priority Isolation**: No matter how many Burstable pods are created, they collectively only receive the weight assigned to the `kubepods-burstable.slice`. This prevents a large number of low-priority pods from "washing out" the priority of a high-priority Guaranteed pod, which would happen if they all lived at the same level.
- **Predictable Performance**: A Guaranteed pod with a high weight at the root level will always have its relative share preserved against the QoS slices, regardless of the internal complexity or workload of those slices.

#### QoS CPU Max Calculations

The `cpu.max` setting enforces the hard CPU limit (`cpu.limits`) in cgroupv2. It uses the format `quota period`, where `quota` is the allowed CPU time within a given `period` (defaulting to 100,000 microseconds).

##### 1. Guaranteed and Burstable Pods
For pods with CPU limits defined:
- **Pod Level**: The `cpu.max` is set at the pod's cgroup slice. It is the sum of the CPU limits of all containers in the pod.
- **Container Level**: Each container also has `cpu.max` set to its specific limit.
- **Example**: A container with a `200m` limit results in `20000 100000` (20ms per 100ms period).

##### 2. BestEffort Pods
BestEffort pods have no CPU limits.
- **Pod and Container Level**: `cpu.max` is set to `max`, meaning no hard limit is enforced.

##### 3. QoS Slices
Kubelet does not typically enforce a hard CPU limit at the QoS tier level.
- **`kubepods-burstable.slice`**: `cpu.max` is set to `max`.
- **`kubepods-besteffort.slice`**: `cpu.max` is set to `max`.

This design allows pods within these slices to burst into any idle CPU cycles on the node, provided they haven't hit their own pod-specific or container-specific limits.

##### 4. Root Cgroup (`kubepods.slice`)
As noted in the responsibilities section, the root `kubepods.slice` also has `cpu.max` set to `max`. This value is not configurable; CPU reservation for system services is enforced through `cpu.weight` and `cpuset.cpus` rather than a hard limit. This ensures the collective set of all pods can utilize the entire node's CPU capacity if it is not being used by the system.

#### QoS CPU Weight Calculations

While the root's CPU weight is fixed and based on Node Allocatable, the weights of its children are recalculated dynamically to slice the available "pie" internally.

- **Guaranteed Pods**: Located directly under `kubepods.slice`. Their `cpu.weight` is set individually based on their specific CPU requests.
- **Burstable Slice (`kubepods-burstable.slice`)**: Its `cpu.weight` is the **sum of all CPU requests** of all active Burstable pods on the node. This ensures the Burstable tier as a whole has enough priority to satisfy its pods' requests when competing with other tiers.
- **BestEffort Slice (`kubepods-besteffort.slice`)**: Its `cpu.weight` is fixed at the **minimum value** (1 weight / 2 shares). This ensures that BestEffort pods only receive "slack" CPU cycles that are not being used by the Guaranteed or Burstable tiers.

### Memory

Kubernetes manages memory resources in cgroupv2 primarily through the **`memory.max`** setting, which enforces hard limits. Kubernetes does not enforce memory limits at the QoS slice level; limits are applied at individual pod and container cgroups. If a cgroup exceeds this limit, the kernel will attempt to reclaim memory; if it fails, the processes within that cgroup are subject to being killed by the OOM (Out of Memory) killer.

#### Principles Kubernetes follows

##### Why not set memory.max on Burstable and BestEffort slices

This may seem counter-intuitive, as it allows Burstable pods collectively to consume all memory available to pods. However, **Guaranteed pods are protected** through a multi-layered defense strategy:
- **Individual Limits**: Every Guaranteed and Burstable pod (with limits defined) has its own `memory.max` enforced at the pod cgroup level.
- **Node-Pressure Eviction (First Layer)**: Kubelet proactively monitors node memory usage. When memory reaches an [Eviction Threshold](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/), Kubelet begins evicting pods (starting with BestEffort and then Burstable pods that exceed their requests) to reclaim memory before the kernel OOM killer is triggered.
- **OOM Score Adjustment (Second Layer)**: If memory pressure is so sudden that eviction cannot keep up, the kernel OOM killer acts as a safety net. Kubernetes sets the `oom_score_adj` for processes so that the kernel targets lower-priority pods first (BestEffort/Burstable) and protects Guaranteed pods.
- **Avoiding Collective OOMs**: Setting a hard limit on the Burstable slice could cause a pod to be killed even if the node has plenty of free memory, simply because its neighbors in the same slice consumed the collective quota.

#### `memory.max` calculation

##### 1. Guaranteed and Burstable Pods
For pods with memory limits defined:
- **Pod Level**: The `memory.max` is set at the pod's cgroup slice. It is the sum of the memory limits of all containers in the pod.
- **Container Level**: Each container also has `memory.max` set to its specific limit.
- **Example**: A container with a `256Mi` limit results in `268435456` bytes.

##### 2. BestEffort Pods
BestEffort pods have no memory limits.
- **Pod and Container Level**: `memory.max` is set to `max`, meaning the pod can theoretically consume all available memory on the node.

##### 3. QoS Slices
Kubelet does not enforce hard memory limits at the intermediate QoS tier level.
- **`kubepods-burstable.slice`**: `memory.max` is set to `max`.
- **`kubepods-besteffort.slice`**: `memory.max` is set to `max`.

## Appendix

The following settings were observed on a standard GKE node (`e2-medium`) within `/sys/fs/cgroup/kubepods.slice/` and given as an example.

Calculated from [Node Allocatable and Reserved Resources](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/):

- **`cpu.weight`**: `37`. Relative CPU weight for all pods.
- **`memory.max`**: `3040550912`. Hard memory limit for the entire `kubepods.slice`.
- **`pids.max`**: `4194304`. Max number of processes allowed across all pods.

The `cpu.weight` defines the amount of CPU shares Kubernetes-managed pods are receiving comparing to the system processes. The default `cpu.weight` for `system.slice` is `100`. See [January 2026 Kubernetes Blog](https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/) to understand why the shares of `system.slice` are so much higher than `kubepods.slice` in this example.

The `memory.max` and `pids.max` ensures that resources reserved for system daemons will not be consumed by the Kubernetes workloads.

CPU reservation for system daemons:

- **`cpuset.cpus`**: `0-1`. Available CPU cores for pods (calculated based on the `ReservedCPUs` or `--reserved-cpus` Kubelet setting).

Default value re-enforcement:

- **`cpu.max`**: `max 100000`. No hard limit (allows using all node CPU).

See [Why not set `cpu.max` on root cgroup?](#why-not-set-cpumax-on-root-cgroup) to learn why it is set to max.

Kubelet can also set other fields, for example hugepages limits.
