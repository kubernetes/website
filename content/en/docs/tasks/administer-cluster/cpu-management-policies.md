---
title: Control CPU Management Policies on the Node
reviewers:
- sjenning
- ConnorDoyle
- balajismaniam
---

{{< feature-state state="beta" >}}

{{< toc >}}

Kubernetes keeps many aspects of how pods execute on nodes abstracted
from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably. The kubelet provides methods to enable more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.

## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time.  Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.

### Configuration

The CPU Manager is an alpha feature in Kubernetes v1.8. It was enabled by
default as a beta feature since v1.10.

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
option. There are two supported policies:

* `none`: the default, which represents the existing scheduling behavior.
* `static`: allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.

The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`--cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `--node-status-update-frequency`.

### None policy

The `none` policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/)
are enforced using CFS quota.

### Static policy

The `static` policy allows containers in `Guaranteed` pods with integer CPU
`requests` access to exclusive CPUs on the node. This exclusivity is enforced
using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt).

{{< note >}}
**Note:** System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
{{< /note >}}

{{< note >}}
**Note:** The alpha version of this policy does not guarantee static
exclusive allocations across Kubelet restarts.
{{< /note >}}

This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations by the kubelet `--kube-reserved` or
`--system-reserved` options. CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.

{{< note >}}
**Note:** The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved` when the static
policy is enabled. This is because zero CPU reservation would allow the shared
pool to become empty.
{{< /note >}}

As `Guaranteed` pods whose containers fit the requirements for being statically
assigned are scheduled to the node, CPUs are removed from the shared pool and
placed in the cpuset for the container. CFS quota is not used to bound
the CPU usage of these containers as their usage is bound by the scheduling domain
itself. In others words, the number of CPUs in the container cpuset is equal to the integer
CPU `limit` specified in the pod spec. This static assignment increases CPU
affinity and decreases context switches due to throttling for the CPU-bound
workload.

Consider the containers in the following pod specs:

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

This pod runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified. It runs in the shared pool.

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
```

This pod runs in the `Burstable` QoS class because resource `requests` do not
equal `limits` and the `cpu` quantity is not specified. It runs in the shared
pool.

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
```

This pod runs in the `Burstable` QoS class because resource `requests` do not
equal `limits`. It runs in the shared pool.

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
        memory: "200Mi"
        cpu: "2"
```

This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
And the container's resource limit for the CPU resource is an integer greater than 
or equal to one. The `nginx` container is granted 2 exclusive CPUs.


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "1.5"
      requests:
        memory: "200Mi"
        cpu: "1.5"
```

This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
But the container's resource limit for the CPU resource is a fraction. It runs in
the shared pool.


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
```

This pod runs in the `Guaranteed` QoS class because only `limits` are specified
and `requests` are set equal to `limits` when not explicitly specified. And the 
container's resource limit for the CPU resource is an integer greater than or 
equal to one. The `nginx` container is granted 2 exclusive CPUs.

