---
layout: blog
title: 'The Shift to cgroups v2 in Kubernetes: What You Need to Know'
date: 2024-11-10
slug: kubernetes-cgroups-v2-shift
author: >
   Paco Xu (DaoCloud)
---

`cgroups` (control groups) are a Linux kernel feature used for managing system resources.
Kubernetes uses cgroups to allocate resources like CPU and memory to containers,
ensuring that applications run smoothly without interfering with each other.
With the release of Kubernetes v1.31, cgroups v1 has been moved into [maintenance mode]/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/).
For cgroups v2, it graduated in v1.25 2 years ago.

Top FAQs are why we should migrate, what's the benifits and lost,
and what needs to be noticed when using cgroups v2.

## cgroups v1 problem, and solutions in cgroups v2

cgroups v1 and cgroups official doc can be found in

- [v1 doc](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [v2 doc](https://www.kernel.org/doc/Documentation/cgroup-v2.txt)

Let's enumerate some known issues.

### active_file memory is not considered as available memory

There is [a known issue](/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory) of page cache: [#43916](https://github.com/kubernetes/kubernetes/issues/43916).

- In cgroups v1, we have no native solutions.
  Workarounds are setting larger memory limit for Pods or using some external projects to drop cache or
  throttling memory allocating when memory is beyond a threshold.
- In cgroups v2, we can use `memory.high` to throttle.

Support for Memory QoS was initially added in Kubernetes v1.22, 
and later some limitations around the formula for calculating `memory.high` were identified.
These limitations are addressed in Kubernetes v1.27.

However, until v1.31, the feature gate is still alpha due to another known issue
that application pod may be hanging forever due to heavy memory reclaiming.

### Container aware OOM killer and better OOM handling strategies

In cgroups v2, one process of a multi-processes Pod could be killed by the OOM killer.
In this case, Pod has to use [runit](https://github.com/void-linux/runit) or
supervisord to manage multi processes lifecycle.

cgroups v2 uses `cgroup.kill` file.
Writing “1” to the file causes the cgroups and all descendant cgroups to be killed.
This means that all processes located in the affected cgroup tree will be killed via SIGKILL.
Pod may run multiple processes, and all processes can be killed simultaneously.

As mentioned above, cgroups v2 `memory.high` can throttle the new memory allocation and
cgroups can be aware of the OOM earsiler.
Besides, PSI can also help to know the memory load. [oomd](https://github.com/facebookincubator/oomd) is a good example
using PSI to implement a userspace out-of-memory killer.

### Rootless support

In cgroups v1,  delegating cgroups v1 controllers to less privileged containers may be dangerous.

Unlike cgroups v1, cgroups v2 officially supports delegation.
Most Rootless Containers implementations rely on systemd for
delegating v2 controllers to non-root users.

User Namespace minimal kernel version is 6.5, according to
[KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md).

### What's more?

1. eBPF stories:
   - In cgroups v1, the device access control are defined in the static configuration/.
   - cgroups v2 device controller has no interface files and is implemented on top of cgroup BPF.
   - Cilium will automatically mount cgroups v2 filesystem required to attach BPF cgroup programs
     by default at the path /run/cilium/cgroupv2 .
2. PSI is planned in a future release [KEP-4205](https://github.com/kubernetes/enhancements/issues/4205),
   but pending due to runc 1.2.0 release delay.
3. monitoring tools support, like [Cadvisor](https://github.com/google/cadvisor/).
   Currently, cgroups v2 features are not fully-supported yet.

## Adopting cgroup version 2

### Requirements

Here's what you need to use cgroup v2 with Kubernetes.
First up, you need to be using a version of Kubernetes with support for v2 cgroup management;
that's been stable since Kubernetes v1.25 and all supported Kubernetes releases include this support.

- OS distribution enables cgroups v2
- Linux Kernel version is 5.8 or later
- Container runtime supports cgroups v2. For example:
  - containerd v1.4 or later (at the time of writing, containerd releases v1.6 and later are within that project's support period)
  - CRI-O v1.20 or later
- The kubelet and the container runtime are configured to use the systemd cgroup driver

#### kernel updates around cgroups v2

cgroups v2 first appeared in Linux Kernel 4.5 in 2016.

- In Linux 4.5, cgroups v2 `io`, `memory` & `pid` cgroups management were supported.
- Linux 4.15 added support for cgroups v2 `cpu` management
- [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) support began with Linux 4.20.
- The Kubernetes project does not recommend using cgroups v2 with a Linux kernel older than 5.2 due to lack of cgroup-level task freezer support.
- In Kubernetes, 5.8 is the minimal kernel version for cgroups v2 as root `cpu.stat` file on cgroupv2
  was only added on kernel 5.8.
- `memory.peak` is added in 5.19.

### Use systemd as cgroup driver

[Configure the kubelet's cgroup driver to match the container runtime cgroup driver](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

The [Container runtimes](/docs/setup/production-environment/container-runtimes)
page explains that the `systemd` driver is recommended for kubeadm
based setups instead of the kubelet's default `cgroupfs` driver,
because kubeadm manages the kubelet as a systemd service.

A minimal example of configuring the field explicitly:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
```

In v1.31, [KEP-4033](https://github.com/kubernetes/enhancements/issues/4033) is beta to extend CRI API for the kubelet
to discover the cgroup driver from the container runtime. This will help installer and kubelet to autodetect

- TODO

### Tools and commands for troubleshooting

Tools and commands that you should know about cgroups:

- `stat -fc %T /sys/fs/cgroup/`: Check if cgroups v2 is enabled which will return `cgroup2fs`
- `systemctl list-units kube* --type=slice` or `--type=scope`: List kube related units that systemd currently has in memory.
- `bpftool cgroup list /sys/fs/cgroup/*`: List all programs attached to the cgroup CGROUP.
- `systemd-cgls /sys/fs/cgroup/*`: Recursively show control group contents.
- `systemd-cgtop`: Show top control groups by their resource usage.
- `tree -L 2 -d /sys/fs/cgroup/kubepods.slice`: Show Pods' related cgroups directories.

How to check if a Pod CPU or memory limit is successfully applied to the cgroup file?

- Kubernetes Pod Spec: check limits `spec.containers[*].resources.limits.{cpu,memory}` and requests `spec.containers[*].resources.requests.{cpu,memory}`
- CRI: `cpu_period`, `cpu_quota`, `cpu_shares` for CPU and `memory_limit_in_bytes` for memory limit
- OCI Spec: `memorry.limit`, `cpu.shares`, `cpu.quota`, `cpu.period`
- Systemd Scope Unit: `CPUWeight`, `CPUQuotaPerSecUSec`, `CPUQuotaPeriodUSec`, `MemoryMax`
- Cgroupfs value: `/sys/fs/cgroup/../cpu.weight`, `/sys/fs/cgroup/../cpu.max`, `/sys/fs/cgroup/../memory.max`

## Further reading

- [Kubernetes 1.31: Moving cgroups v1 Support into Maintenance Mode](/blog/2024/08/15/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [cgroups v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.27: Quality-of-Service for Memory Resources (alpha)](/blog/2023/05/05/qos-memory-resources/)
- [Kubernetes 1.25: cgroups v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022 [Cgroups V2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk) by Tony Gosselin & Mike Tougeron, Adobe Systems
- KubeCon NA 2022 [Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA) - David Porter, Google & Mrunal Patel, RedHat
- KubeCon EU 2020 [Kubernetes On cgroups v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s) by Giuseppe Scrivano, Red Hat.
- Note, this blog will only include the basic requirments and configurations in Kubernetes components.
  It will not include how to enable cgroup fs in OS distributions.
  For migration, you can refer to [migrating cgroups v2](/docs/concepts/architecture/cgroups/#migrating-cgroupv2)
