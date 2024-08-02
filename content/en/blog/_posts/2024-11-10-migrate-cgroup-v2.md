---
layout: blog
title: 'Why we should migrate to vgroup v2?'
date: 2024-11-10
slug: kubernetes-cgroup-v2-process
author: >
   Paco Xu (DaoCloud)
---

Kubernetes v1.31 moves cgroup v1 Support into Maintenance Mode, and in v1.25, cgroup v2 graduated.

Before talking about how to migrate, users needs to know why we should migrate and what's the benifits and lost.

## cgroup v1 problem, and solutions in cgroup v2

Cgroup v1 and cgroup official doc can be found in

- [v1 doc](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [v2 doc](https://www.kernel.org/doc/Documentation/cgroup-v2.txt)

Let's talk from the known issue.

### [active_file memory is not considered as available memory](/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory)

There is a known issue of page cache: [#43916](https://github.com/kubernetes/kubernetes/issues/43916).

- In cgroup v1, we have no native solutions. Workarounds are setting larger memory limit for Pods or using some external projects to drop cache or throttling memory allocating when memory is beyond a threshold.
- In cgroup v2, we can use `memory.high` to throttle. 

Support for Memory QoS was initially added in Kubernetes v1.22, and later some limitations around the formula for calculating memory.high were identified. These limitations are addressed in Kubernetes v1.27.

However, until v1.31, the feature gate is still alpha due to another known issue that application pod may be hanging forever due to heavy memory reclaiming.

### OOM handling

[TODO]
As mentioned above, cgroup v2 `memory.high` can throttle the new memory allocation and cgroup can be aware of the OOM earsiler. Besides, PSI can also help to know memory load.

[oomd](https://github.com/facebookincubator/oomd): A userspace out-of-memory killer.

### rootless support

In cgroup v1,  delegating cgroup v1 controllers to less privileged containers may be dangerous.

Unlike cgroup v1, cgroup v2 officially supports delegation. Most Rootless Containers implementations rely on systemd for delegating v2 controllers to non-root users.

User Namespace minimal kernel version is 6.5, according to [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md).

### What's more?

1. eBPF stories:
   - In cgroup v1, the device access control are defined in the static configuration/.
   - Cgroup v2 device controller has no interface files and is implemented on top of cgroup BPF.
2. PSI is planned in a future release [KEP-4205](https://github.com/kubernetes/enhancements/issues/4205), but pending due to runc 1.2.0 release which is in progress.
3. monitoring tools support, like Cadvisor. Currently, cgroup v2 features are not fully-supported yet.

## How to migrate?

### cgroup v2 requirements

- OS distribution enables cgroup v2
- Linux Kernel version is 5.8 or later
- Container runtime supports cgroup v2. For example:
  - containerd v1.4 and later(Currently, containerd 1.6+ are in support)
  - cri-o v1.20 and later
- The kubelet and the container runtime are configured to use the systemd cgroup driver

### troubleshooting

TBC

## Further reading

- [Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode](/blog/2024/08/15/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Cgroup v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.27: Quality-of-Service for Memory Resources (alpha)](/blog/2023/05/05/qos-memory-resources/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022 [Cgroups V2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk) by Tony Gosselin & Mike Tougeron, Adobe Systems
- KubeCon NA 2022 [Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA) - David Porter, Google & Mrunal Patel, RedHat
- KubeCon EU 2020 [Kubernetes On Cgroup v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s) by Giuseppe Scrivano, Red Hat.
