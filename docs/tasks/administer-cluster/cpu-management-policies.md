---
title: Control CPU Management Policies on the Node
---

* TOC
{:toc}

Kubernetes keeps many aspects of how the pod executes on the node abstracted
away from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably.  The kubelet provides methods for enabling more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.

## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node is running many CPU bound pods, this
can result in the workload being moved to different CPU cores depending on
whether the pod is throttled or not and which CPU cores are available at
scheduling time.  Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity and scheduling latency
significantly affects workload performance, the kubelet allows alternative CPU
management policies that allow users to express their desire for certain
placement preferences on the node.

These management policies are enabled with the `--cpu-manager-policy` kubelet
option.  There are two supported policies: `none` which is the default and
represents the existing scheduling behavior and `static` which allows pods with
certain resource characteristics to be granted increased CPU affinity and
exclusivity on the node.

### None Policy

The 'none' policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod)
are enforced using CFS quota.

### Static Policy

The `static` policy allows containers in Guaranteed pods with integer CPU
requests to be assigned to exclusive CPUs on the node.  This exclusivity is
enforced through the use of the
[cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt).

**Note:** System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
{: .note}

The policy manages a shared pool of CPUs that initially contains all CPUs the
node minus any reservations by the kubelet `--kube-reserved` or
`--system-reserved` options.  CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
BestEffort and Burstable pods run. Containers in Guaranteed pods with fractional
cpu requests also run on CPUs in the shared pool.  Only containers that are
both part of a Guaranteed pod and have integer CPU requests are assigned
exclusive CPUs.

**Note:** When reserving CPU with `--kube-reserved` or `--system-reserved` options, it is advised to use *integer* CPU quantities.
{: .note}

As Guaranteed pods whose containers fit the requirements for being statically
assigned are scheduled to the node, CPUs are removed from the shared pool and
placed in the cpuset for the container.  CFS quota is not used to bound
the CPU usage of these containers as their usage is bound by the scheduling domain
itself i.e. the number of CPUs in the container cpuset is equal to the integer
CPU limit specified in the pod spec.  This static assignment increases CPU
affinity and decreases context switches due to throttling for the CPU bound
workload.

In the event that the shared pool is depleted the kubelet takes two actions:
* Evict all pods that include a container that does not have a CPU request as
  those pods now have no CPUs on which to run 
* Set a `NodeCPUPressure` node condition to `true` in the node status. When
  this condition is true, the scheduler will not assign any pod to the node
  that has a container without a CPU request.

Consider the containers in the following pod specs:

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```yaml

**Result** BestEffort QoS because no resource requests or limits are specified.
Will be evicted if shared pool is depleted. Runs in the shared pool.

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
```yaml

**Result** Burstable QoS because resource requests != limits and CPU is not
specified.  Will be evicted if shared pool is depleted. Runs in the shared pool.


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
	cpu: "2"
      requests:
        memory: "100Mi"
	cpu: "1"
```yaml

**Result** Burstable QoS because resource requests != limits.  Non-zero CPU request
prevents the shared pool from depleting. Runs in the shared pool.


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
	cpu: "2"
```yaml

**Result** Guaranteed QoS because only limits are specified and requests are set to
limits when not explicitly specified.  nginx container will be granted 2
exclusive CPUs.

