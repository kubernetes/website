---
layout: blog
title: 'The Shift to cgroup v2 in Kubernetes: What You Need to Know'
draft: true
slug: kubernetes-cgroups-v2-shift
author: >
   Paco Xu (DaoCloud)
---

In Linux, _cgroups_ (control groups) are a kernel feature used for managing system resources.
Kubernetes uses cgroups to allocate resources like CPU and memory to containers,
ensuring that applications run smoothly without interfering with each other.
With the release of Kubernetes v1.31, support for v1 cgroup management moved into
[maintenance mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/).
Support for v2 cgroup management has been stable since Kubernetes v1.25.

Compared with cgroup v1, cgroup v2 provides a single unified hierarchy,
a more consistent interface, and a stronger foundation for resource isolation
and modern resource-management features.

## Deprecation of cgroup v1

Kubernetes has [deprecated cgroup v1](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1).
Starting with Kubernetes v1.35, `failCgroupV1` defaults to `true`, so the kubelet does not start
on a cgroup v1 node by default. Administrators can temporarily set `failCgroupV1: false` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/), but removal will
follow the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/).
Further removal work is tracked in [KEP-5573: Remove cgroup v1 support](https://www.kubernetes.dev/resources/keps/5573).

If you are still on a release older than v1.35, migrate every Linux node to
cgroup v2 before upgrading, or plan to set the temporary `failCgroupV1: false`
override. If you are already on v1.35 or later, confirm that every Linux node
runs cgroup v2 (or that you intentionally keep the override). Under the default
configuration, a remaining cgroup v1 node fails during kubelet startup.

For kubeadm-managed clusters, Kubernetes v1.35 also makes this an earlier, stricter check. The
`SystemVerification` preflight check, provided by `k8s.io/system-validators`, returns an error during
`kubeadm init`, `kubeadm join`, and `kubeadm upgrade` when it detects cgroup v1 with kubelet v1.35 or
later; with an older kubelet, the check remains a warning. See
[kubernetes/system-validators#1.12.1 release notes](https://github.com/kubernetes/system-validators/releases/tag/v1.12.1) for details.

The top FAQs cover three main areas: why to migrate, the benefits and drawbacks,
and key points to keep in mind when using cgroup v2.

## Limitations of cgroup v1 and Improvements with cgroup v2

The Linux kernel documentation describes both interfaces:

- [cgroup v1 documentation](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [cgroup v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)

Let's enumerate some known issues.

### `active_file` memory is not considered available memory

The kubelet treats `active_file` memory as not reclaimable. For I/O-intensive workloads, a large
page cache can therefore make the kubelet report memory pressure and evict Pods. This is a
[known kubelet issue](/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory)
([kubernetes/kubernetes#43916](https://github.com/kubernetes/kubernetes/issues/43916)); migrating to
cgroup v2 does not by itself change that calculation. The documented workaround is to set equal
memory requests and limits for containers that perform intensive I/O, after measuring an appropriate
value.

### Memory QoS updates in Kubernetes v1.36

[Memory QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) was introduced as an alpha feature in Kubernetes v1.22 and
updated in v1.27. It remains alpha in v1.36, but now separates memory throttling from memory
reservation and adds [tiered memory protection](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/):

Memory QoS is available **only** on Linux nodes that use cgroup v2. It relies on the cgroup v2 memory
controller: `memory.high` provides throttling, while `memory.min` and `memory.low` provide hard and
soft protection when tiered reservation is enabled. cgroup v1 cannot provide this protection model.

- Enabling the `MemoryQoS` feature gate applies `memory.high` throttling to Burstable containers.
  The threshold is derived from the request, limit, and `memoryThrottlingFactor` (default `0.9`).
- `memoryReservationPolicy: None` is the default. It does not write `memory.min` or `memory.low`.
- `memoryReservationPolicy: TieredReservation` maps Guaranteed Pod memory requests to `memory.min`
  (hard protection) and Burstable Pod requests to `memory.low` (soft protection). BestEffort Pods
  receive neither protection.
- The kubelet exposes Alpha metrics for the total `memory.min` and `memory.low` reservations on a node.

- Kernel 5.9 or later is recommended. On older kernels, `memory.high` reclaim can trigger a known
  livelock; from v1.36 the kubelet logs a warning when Memory QoS is enabled on an affected kernel.

For example, to opt in to tiered protection:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: TieredReservation
memoryThrottlingFactor: 0.9
```

The overall Kubernetes recommendation is not to enable Alpha features in production; however, if you
judge that memory QoS with tiered reservations is useful for your platform in production, make sure
to test the configuration **and** account for hard-reserved memory before you enable
the `TieredReservation` feature gate.
See the
[Pod QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) documentation
for the current mapping of Kubernetes QoS classes to cgroup v2 controls.

### Container-aware OOM handling

On cgroup v2 nodes, the kubelet defaults `singleProcessOOMKill` to `false`. It therefore sets
`memory.oom.group` for each container cgroup so that an OOM event kills all processes in that
container together, rather than leaving a partially functioning multi-process container. Set
`singleProcessOOMKill: true` only if you need the cgroup v1-compatible behavior where the kernel
may kill one process at a time. See the
[`KubeletConfiguration` reference](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
for this setting.

This behavior is scoped to a container cgroup, not the whole Pod. Also, `cgroup.kill` is a separate
administrative interface: writing `1` to it sends `SIGKILL` to every process in that cgroup and its
descendants; it does not configure OOM behavior. The cgroup v2 memory controller additionally
provides `memory.events` counters that monitoring systems and userspace OOM managers can observe.

### Rootless support

In cgroup v1, delegating controllers to less privileged containers may be dangerous.

Unlike cgroup v1, cgroup v2 officially supports delegation.
Most implementations of rootless containers rely on systemd for
delegating v2 controllers to non-root users.

This delegation mechanism is separate from Kubernetes Pod user namespaces, which map container
users to unprivileged host users. [Pod user namespace support](/docs/concepts/workloads/pods/user-namespaces/)
graduated to stable in Kubernetes v1.36; check its filesystem, kernel, CRI runtime, and OCI runtime
prerequisites before enabling it.

### What else?

1. eBPF stories:
   - In cgroup v1, device access controls are exposed through interface files.
   - The cgroup v2 device controller has no interface files, and is implemented on top of cgroup BPF.
   - Cilium attaches BPF cgroup programs for socket-based load balancing. Its
     [default cgroup root](https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/#validate-bpf-cgroup-programs-attachment)
     is `/run/cilium/cgroupv2`.
2. [Pressure Stall Information (PSI)](/docs/reference/instrumentation/understand-psi-metrics/)
   reports CPU, memory, and I/O contention at node, Pod, and container level. On supported
   clusters, the kubelet exposes PSI by default (`KubeletPSI` is stable and locked on). PSI
   requires cgroup v2, Linux 4.20 or later, `CONFIG_PSI=y`, and a kernel not booted with
   `psi=0`. The kubelet surfaces the data through the
   [Summary API](/docs/reference/instrumentation/node-metrics/#summary-api-source) and
   `/metrics/cadvisor`.
3. When migrating, update software that reads the cgroup filesystem directly. The
   [migration guidance](/docs/concepts/architecture/cgroups/#migrating-cgroupv2) recommends
   cAdvisor v0.43.0 or later and lists compatible Java, Node.js, and `automaxprocs` versions.

### CPU weight conversion in newer OCI runtimes

cgroup v1 uses `cpu.shares`, whereas cgroup v2 uses `cpu.weight`. Newer OCI runtimes use an improved
non-linear conversion that preserves the default priority and gives small CPU requests more usable
granularity. The change is implemented in the OCI runtime rather than Kubernetes: it is available
in crun v1.23 and runc v1.3.2. After upgrading a runtime, monitoring or policy tools that predict
exact `cpu.weight` values may need updates. Read
[New Conversion from cgroup v1 CPU Shares to v2 CPU Weight](/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)
for the formula, examples, and compatibility considerations.

### In-place resource updates

[In-place Pod vertical scaling](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace)
graduated to stable in Kubernetes v1.35. Kubernetes v1.36 then [enabled]
(/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/)
in-place vertical scaling for Pod-level resources
by default, as a Beta feature. The kubelet coordinates changes between the Pod-level and container
cgroups so that increases create headroom before container limits grow, while decreases constrain
containers before shrinking the Pod-level boundary. Accurate aggregate enforcement for this
v1.36 feature requires cgroup v2.

## Adopting cgroup version 2

### Requirements

Here's what you need to use cgroup v2 with Kubernetes.
First up, you need to be using a version of Kubernetes with support for v2 cgroup management;
that's been stable since Kubernetes v1.25 and all supported Kubernetes releases include this support.

- You need at least one Linux node; cgroup is a Linux-only concept
- Your OS install must run with cgroup v2 enabled
- The kernel version must be 5.8 or later (5.9 or later is recommended when using memory QoS)
- The container runtime must support cgroup v2. For example:
  - containerd v1.4 or later supports cgroup v2; use containerd v2.0 or later for automatic
    cgroup-driver discovery
  - CRI-O v1.20 or later
- The kubelet and the container runtime must both be configured to use the correct cgroup driver. See [Configure the kubelet's cgroup driver to match the container runtime cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

For now, you can opt back in to use cgroup v1; the Kubernetes project recommends using cgroup v1, but in Kubernetes 1.36 (the current release) the cgroup v1 option remains
supported as a fallback.
That fallback is scheduled for removal in
Kubernetes v1.38. If you are running an older cluster, plan to migrate; if you are setting
up a new cluster with Linux nodes, you should prefer cgroup v2.
In either case, review both the [Kubernetes runtime documentation](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)
and (if relevant) the [containerd compatibility matrix](https://github.com/containerd/containerd/blob/main/RELEASES.md#kubernetes-support).

#### kernel updates around cgroup v2

When Kubernetes was first announced, in 2014, only v1 cgroup existed.
Version 2 cgroup management first appeared in Linux kernel 4.5, released in 2016.

- In Linux 4.5, the cgroup v2 `io`, `memory`, and `pids` controllers were supported.
- Linux 4.15 added support for the cgroup v2 `cpu` controller.
- [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) support began with Linux 4.20.
- The Kubernetes project does not recommend using cgroup v2 with a Linux kernel older than 5.2
  due to lack of cgroup-level task freezer support.
- Kubernetes documents 5.8 as the minimum kernel version for cgroup v2; the root cgroup's
  system-level `cpu.stat` file was added in Linux 5.8.
- The `memory.high` livelock fix used by Memory QoS is present in Linux 5.9 and later.
- `memory.peak` was added in Linux 5.19.

### cgroup driver configuration

[Configure the kubelet's cgroup driver to match the container runtime cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

If you use `kubeadm` to manage your cluster, Kubernetes recommends that you use the `systemd` cgroup driver,
because `kubeadm` manages the kubelet as a systemd service. For other management tooling,
check the documentation for the tool you're using to manage your cluster.

If you can pick either option, I recommend using the systemd driver.

Whatever tooling you've chosen, the kubelet automatically tries to detect the runtime's recommended cgroup driver.
This automatic detection relies on using a runtime
that implements the `RuntimeConfig`
CRI RPC (for example: containerd v2.0+ or CRI-O v1.28+).

If you're using a container runtime that supports cgroup v2 but doesn't support automatic cgroup driver detection,
you can manually configure an override by editing
the kubelet configuration file. For example:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
```

Automatic discovery of the runtime's cgroup driver through the CRI, tracked by
[KEP-4033](https://www.kubernetes.dev/resources/keps/4033), graduated to stable in Kubernetes v1.34. It requires a runtime
that implements the `RuntimeConfig` CRI RPC (containerd v2.0+ or CRI-O v1.28+). When available,
the kubelet uses the value reported by the runtime instead of its configured `cgroupDriver` value.

### Tools and commands for troubleshooting

Tools and commands that you should know about cgroups:

- `stat -fc %T /sys/fs/cgroup/`: Check whether cgroup v2 is enabled; it returns `cgroup2fs`.
- `systemctl list-units 'kube*' --type=slice` or `--type=scope`: List Kubernetes-related units
  that systemd currently has in memory.
- `bpftool cgroup list /sys/fs/cgroup/*`: List all programs attached to the cgroup CGROUP.
- `systemd-cgls /sys/fs/cgroup/*`: Recursively show control group contents.
- `systemd-cgtop`: Show top control groups by their resource usage.
- `tree -L 2 -d /sys/fs/cgroup/kubepods.slice`: Show Pods' related cgroups directories.

How to check if a Pod CPU or memory limit is successfully applied to the cgroup file?

- Kubernetes Pod spec: check limits `spec.containers[*].resources.limits.{cpu,memory}` and requests
  `spec.containers[*].resources.requests.{cpu,memory}`
- CRI: `cpu_period`, `cpu_quota`, `cpu_shares` for CPU and `memory_limit_in_bytes` for memory limit
- OCI Spec: `memory.limit`, `cpu.shares`, `cpu.quota`, `cpu.period`
- Systemd scope unit: `CPUWeight`, `CPUQuotaPerSecUSec`, `CPUQuotaPeriodUSec`, `MemoryMax`
- Cgroupfs value: `/sys/fs/cgroup/../cpu.weight`, `/sys/fs/cgroup/../cpu.max`, `/sys/fs/cgroup/../memory.max`

## Further reading

- [Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Kubernetes v1.36: Tiered Memory Protection with Memory QoS](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)
- [Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022 [cgroup v2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk) by Tony Gosselin & Mike Tougeron, Adobe Systems
- KubeCon NA 2022 [Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA) - David Porter, Google & Mrunal Patel, RedHat
- KubeCon EU 2020 [Kubernetes On cgroup v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s) by Giuseppe Scrivano, Red Hat.
- This blog only covers the basic requirements and configuration of Kubernetes components.
  It will not include how to enable cgroup fs in OS distributions.
  For migration, you can refer to [migrating cgroup v2](/docs/concepts/architecture/cgroups/#migrating-cgroupv2)
