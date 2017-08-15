---
title: Manage Workload Placement on the Node
---

* TOC
{:toc}

Kubernetes keeps many aspects of how the pod executes on the node abstracted
away from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably.  The kubelet provides methods for enabling more complex workload
placements policies while keeping the abstraction free from explicit placement
directives.

## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node is running many CPU bound pods, this
can result in the workload being moved to different CPU cores depending on
whether the pod is throttled or not and which CPU cores are available at
scheduling time.  Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity significantly affects workload
performance, the kubelet allows alternative CPU management policies that allow
users to express their desire for certain placement preferences on the node.

These management policies are enabled with the `--cpu-manager-policy` kubelet
option.  There are two supported policies: `none` which is the default and
represents the existing scheduling behavior and `static` which allows pods with
certain resource characteristics to be granted increased CPU affinity and
exclusivity on the node.

### None Policy

The 'none' policy maintains the historical CPU affinity scheme, providing no
affinity beyond what the OS scheduler does automatically.  Limits on CPU usage
for [Guaranteed pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod)
are enforced using CFS quota.

### Static Policy

The `static` policy allows guaranteed pods with integer CPU limits to be
assigned to exclusive CPUs on the node.  This exclusivity is enforced through
the use of the cpuset cgroup controller.

**Note:** System services such as the container runtime and the kubelet itself
can continue to run on these exclusive CPUs.  The exclusivity only extends to
other pods.
{: .note}

The policy manages a shared pool of CPUs that initially contains all CPUs on
the node minus CPU 0 and any reservations by the kubelet `--kube-reserved` or
`--system-reserved` options.  This shared pool is the set of CPUs on which any
BestEffort and Burstable pods run.

As guaranteed pods that fit the requirements for being statically assigned are
scheduled to the node, CPUs are removed from the shared pool and placed in the
cpuset for the guaranteed pod.  CFS quota is not used to bound the CPU usage of
these pods as their usage is bound by the scheduling domain itself i.e. the
number of CPUs in the container cpuset is equal to the integer CPU limit
specified in the pod spec.  This static assignment increases CPU affinity and
decreases context switches due to throttling for the CPU bound workload.

In the event that the shared pool is depleted the kubelet takes two actions:

The first is evicting all pods that do not have a CPU request as those pods now
have no CPUs on which to run.  Burstable pods with a CPU requests are still
allowed to run as the presence of such a pod will keep the shared pool from
depleting the first place. The scheduler would not assign a pod that depletes
the shared pool due to insufficient CPU if such a burstable pod is already
running.

The second action is setting a `NodeCPUPressure` node condition to `true` in
the node status. When this condition is true, the scheduler will not assign any
pod to the node that lacks a CPU request.
