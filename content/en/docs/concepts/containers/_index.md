---
title: Containers
weight: 40
description: Technology for packaging an application along with its runtime dependencies.
reviewers:
- erictune
- thockin
content_type: concept
card:
  name: concepts
  weight: 50
---

<!-- overview -->

This page will discuss containers and container images, as well as their use in operations and solution development.

The word _container_ is an overloaded term. Whenever you use the word, check whether your audience uses the same definition.

Each container that you run is repeatable; the standardization from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from the underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.

Each {{< glossary_tooltip text="node" term_id="node" >}} in a Kubernetes
cluster runs the containers that form the
[Pods](/docs/concepts/workloads/pods/) assigned to that node.
Containers in a Pod are co-located and co-scheduled to run on the same node.


## How CPU requests and limits work under the hood

### On Linux systems

In Linux, Kubernetes uses cgroups (control groups) to enforce CPU requests and limits. See the [RedHat documentation on cgroups](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_monitoring_and_updating_the_kernel/setting-limits-for-applications_managing-monitoring-and-updating-the-kernel) for more details.

#### CPU requests {#under-hood-cpu-request-linux}

- For cgroups v1: CPU requests are translated to CPU shares. The share value is calculated as `cpu.shares = request * 1024`. The default value is 1024, which corresponds to 1 CPU request. See the [kernel documentation on scheduler-domains](https://docs.kernel.org/scheduler/sched-domains.html).
- For cgroups v2: CPU requests are translated to CPU weight. Weight values range from 1 to 10000, with a default of 100. See the [kernel documentation on cgroup-v2](https://docs.kernel.org/admin-guide/cgroup-v2.html).
- The Linux CPU scheduler (CFS - Completely Fair Scheduler) uses these values to determine the proportion of CPU time each container gets when there is CPU contention. For more details, see the [kernel CFS scheduler documentation](https://docs.kernel.org/scheduler/sched-design-CFS.html).
- When there is no contention, containers may use more CPU than requested, up to their limit.

#### CPU limits {#under-hood-cpu-limit-linux}

- CPU limits are implemented using CPU quota and period.
- The quota is calculated as `cpu.cfs_quota_us = limit * cpu.cfs_period_us`.
- For example, if you set a limit of 0.5 CPU:
  - Period = 100,000 microseconds (100ms)
  - Quota = 50,000 microseconds (50ms)
- This means in every 100ms period, the container can use the CPU for up to 50ms.
- If a container tries to use more CPU than its limit, it will be throttled and must wait for the next period.
- Throttling can cause latency in applications, especially those that are CPU-intensive or require consistent CPU access.

### On Windows systems

Windows handles CPU requests and limits differently:

#### CPU requests {#under-hood-cpu-request-windows}

- Windows doesn't have a direct equivalent to Linux CPU shares.
- CPU requests are used primarily for scheduling decisions but don't directly affect runtime CPU allocation.

#### CPU limits {#under-hood-cpu-limit-windows}

- Windows implements CPU limits using CPU caps.
- The limit is expressed as a percentage of total CPU cycles across all online processors.
- For example, a limit of 0.5 CPU on a 2-core system means the container can use up to 25% of the total CPU cycles.
- Windows measures CPU usage over a longer time window compared to Linux, which can result in different throttling behavior.

Understanding how these mechanisms work is crucial for application performance tuning. For example, if you observe throttling in your application (which you can monitor through container runtime metrics), you might want to:
- Adjust your CPU limits to be closer to actual usage patterns
- Consider using horizontal pod autoscaling instead of relying on CPU bursting
- Profile your application to optimize CPU usage
