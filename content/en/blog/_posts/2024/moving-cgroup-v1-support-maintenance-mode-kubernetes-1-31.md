---
layout: blog
title: "Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode"
date: 2024-08-14
slug: kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode
author: Harshal Patil
---

As Kubernetes continues to evolve and adapt to the changing landscape of
container orchestration, the community has decided to move cgroup v1 support
into [maintenance mode](#what-does-maintenance-mode-mean) in v1.31.
This shift aligns with the broader industry's move towards cgroup v2, offering
improved functionalities: including scalability and a more consistent interface.
Before we dive into the consequences for Kubernetes, let's take a step back to
understand what cgroups are and their significance in Linux.

## Understanding cgroups

[Control groups](https://man7.org/linux/man-pages/man7/cgroups.7.html), or
cgroups, are a Linux kernel feature that allows the allocation, prioritization,
denial, and management of system resources (such as CPU, memory, disk I/O,
and network bandwidth) among processes. This functionality is crucial for
maintaining system performance and ensuring that no single process can
monopolize system resources, which is especially important in multi-tenant
environments.

There are two versions of cgroups:
[v1](https://docs.kernel.org/admin-guide/cgroup-v1/index.html) and
[v2](https://docs.kernel.org/admin-guide/cgroup-v2.html). While cgroup v1
provided sufficient capabilities for resource management, it had limitations
that led to the development of cgroup v2. Cgroup v2 offers a more unified and
consistent interface, on top of better resource control features.

## Cgroups in Kubernetes

For Linux nodes, Kubernetes relies heavily on cgroups to manage and isolate the
resources consumed by containers running in pods. Each container in Kubernetes
is placed in its own cgroup, which allows Kubernetes to enforce resource limits,
monitor usage, and ensure fair resource distribution among all containers.

### How Kubernetes uses cgroups

**Resource Allocation**
: Ensures that containers do not exceed their allocated CPU and memory limits.

**Isolation**
: Isolates containers from each other to prevent resource contention.

**Monitoring**
: Tracks resource usage for each container to provide insights and metrics.

## Transitioning to Cgroup v2

The Linux community has been focusing on cgroup v2 for new features and
improvements. Major Linux distributions and projects like
[systemd](https://systemd.io/) are
[transitioning](https://github.com/systemd/systemd/issues/30852) towards cgroup v2.
Using cgroup v2 provides several benefits over cgroupv1, such as Unified Hierarchy,
Improved Interface, Better Resource Control,
[cgroup aware OOM killer](https://github.com/kubernetes/kubernetes/pull/117793),
[rootless support](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless/README.md#cgroup) etc.

Given these advantages, Kubernetes is also making the move to embrace cgroup
v2 more fully. However, this transition needs to be handled carefully to avoid
disrupting existing workloads and to provide a smooth migration path for users.

## Moving cgroup v1 support into maintenance mode

### What does maintenance mode mean?

When cgroup v1 is placed into maintenance mode in Kubernetes, it means that:

1. **Feature Freeze**: No new features will be added to cgroup v1 support.
2. **Security Fixes**: Critical security fixes will still be provided.
3. **Best-Effort Bug Fixes**: Major bugs may be fixed if feasible, but some
issues might remain unresolved.

### Why move to maintenance mode?

The move to maintenance mode is driven by the need to stay in line with the
broader ecosystem and to encourage the adoption of cgroup v2, which offers
better performance, security, and usability. By transitioning cgroup v1 to
maintenance mode, Kubernetes can focus on enhancing support for cgroup v2
and ensure it meets the needs of modern workloads. It's important to note
that maintenance mode does not mean deprecation; cgroup v1 will continue to
receive critical security fixes and major bug fixes as needed.

## What this means for cluster administrators

Users currently relying on cgroup v1 are highly encouraged to plan for the
transition to cgroup v2. This transition involves:

1. **Upgrading Systems**: Ensuring that the underlying operating systems and
container runtimes support cgroup v2.
2. **Testing Workloads**: Verifying that workloads and applications function
correctly with cgroup v2.

## Further reading

- [Linux cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [Cgroup v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
