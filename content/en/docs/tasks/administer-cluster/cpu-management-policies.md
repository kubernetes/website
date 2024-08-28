---
title: Control CPU Management Policies on the Node
reviewers:
- sjenning
- ConnorDoyle
- balajismaniam

content_type: task
min-kubernetes-server-version: v1.26
weight: 140
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes keeps many aspects of how pods execute on nodes abstracted
from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably. The kubelet provides methods to enable more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.

For detailed information on resource management, please refer to the
[Resource Management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers)
documentation.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

If you are running an older version of Kubernetes, please look at the documentation for the version you are actually running.


<!-- steps -->

## CPU Management Policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.

### Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:

* [`none`](#none-policy): the default policy.
* [`static`](#static-policy): allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.

The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`--cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `--node-status-update-frequency`.

The behavior of the static policy can be fine-tuned using the `--cpu-manager-policy-options` flag.
The flag takes a comma-separated list of `key=value` policy options.
If you disable the `CPUManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
then you cannot fine-tune CPU manager policies. In that case, the CPU manager
operates only using its default settings.

In addition to the top-level `CPUManagerPolicyOptions` feature gate, the policy options are split
into two groups: alpha quality (hidden by default) and beta quality (visible by default).
The groups are guarded respectively by the `CPUManagerPolicyAlphaOptions`
and `CPUManagerPolicyBetaOptions` feature gates. Diverging from the Kubernetes standard, these
feature gates guard groups of options, because it would have been too cumbersome to add a feature
gate for each individual option.

### Changing the CPU Manager Policy

Since the CPU manager policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:

1. [Drain](/docs/tasks/administer-cluster/safely-drain-node) the node.
2. Stop kubelet.
3. Remove the old CPU manager state file. The path to this file is
`/var/lib/kubelet/cpu_manager_state` by default. This clears the state maintained by the
CPUManager so that the cpu-sets set up by the new policy won’t conflict with it.
4. Edit the kubelet configuration to change the CPU manager policy to the desired value.
5. Start kubelet.

Repeat this process for every node that needs its CPU manager policy changed. Skipping this
process will result in kubelet crashlooping with the following error:

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

### None policy

The `none` policy explicitly enables the existing default CPU
affinity scheme, providing no affinity beyond what the OS scheduler does
automatically.  Limits on CPU usage for
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/) and
[Burstable pods](/docs/tasks/configure-pod-container/quality-service-pod/)
are enforced using CFS quota.

### Static policy

The `static` policy allows containers in `Guaranteed` pods with integer CPU
`requests` access to exclusive CPUs on the node. This exclusivity is enforced
using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt).

{{< note >}}
System services such as the container runtime and the kubelet itself can continue to run on these exclusive CPUs.  The exclusivity only extends to other pods.
{{< /note >}}

{{< note >}}
CPU Manager doesn't support offlining and onlining of
CPUs at runtime. Also, if the set of online CPUs changes on the node,
the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
{{< /note >}}

This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations by the kubelet `--kube-reserved` or
`--system-reserved` options. From 1.17, the CPU reservation list can be specified
explicitly by kubelet `--reserved-cpus` option. The explicit CPU list specified by
`--reserved-cpus` takes precedence over the CPU reservation specified by
`--kube-reserved` and `--system-reserved`. CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.

{{< note >}}
The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved` or `--reserved-cpus` when
the static policy is enabled. This is because zero CPU reservation would allow the shared
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

The pod above runs in the `BestEffort` QoS class because no resource `requests` or
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

The pod above runs in the `Burstable` QoS class because resource `requests` do not
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

The pod above runs in the `Burstable` QoS class because resource `requests` do not
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

The pod above runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
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

The pod above runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
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

The pod above runs in the `Guaranteed` QoS class because only `limits` are specified
and `requests` are set equal to `limits` when not explicitly specified. And the
container's resource limit for the CPU resource is an integer greater than or
equal to one. The `nginx` container is granted 2 exclusive CPUs.

#### Static policy options

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
* `CPUManagerPolicyBetaOptions` default enabled. Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
You will still have to enable each option using the `CPUManagerPolicyOptions` kubelet option.

The following policy options exist for the static `CPUManager` policy:
* `full-pcpus-only` (beta, visible by default) (1.22 or higher)
* `distribute-cpus-across-numa` (alpha, hidden by default) (1.23 or higher)
* `align-by-socket` (alpha, hidden by default) (1.25 or higher)
* `distribute-cpus-across-cores` (alpha, hidden by default) (1.31 or higher)

If the `full-pcpus-only` policy option is specified, the static policy will always allocate full physical cores.
By default, without this option, the static policy allocates CPUs using a topology-aware best-fit allocation.
On SMT enabled systems, the policy can allocate individual virtual cores, which correspond to hardware threads.
This can lead to different containers sharing the same physical cores; this behaviour in turn contributes
to the [noisy neighbours problem](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).
With the option enabled, the pod will be admitted by the kubelet only if the CPU request of all its containers
can be fulfilled by allocating full physical cores.
If the pod does not pass the admission, it will be put in Failed state with the message `SMTAlignmentError`.

If the `distribute-cpus-across-numa`policy option is specified, the static
policy will evenly distribute CPUs across NUMA nodes in cases where more than
one NUMA node is required to satisfy the allocation.
By default, the `CPUManager` will pack CPUs onto one NUMA node until it is
filled, with any remaining CPUs simply spilling over to the next NUMA node.
This can cause undesired bottlenecks in parallel code relying on barriers (and
similar synchronization primitives), as this type of code tends to run only as
fast as its slowest worker (which is slowed down by the fact that fewer CPUs
are available on at least one NUMA node).
By distributing CPUs evenly across NUMA nodes, application developers can more
easily ensure that no single worker suffers from NUMA effects more than any
other, improving the overall performance of these types of applications.

If the `align-by-socket` policy option is specified, CPUs will be considered
aligned at the socket boundary when deciding how to allocate CPUs to a
container. By default, the `CPUManager` aligns CPU allocations at the NUMA
boundary, which could result in performance degradation if CPUs need to be
pulled from more than one NUMA node to satisfy the allocation. Although it
tries to ensure that all CPUs are allocated from the _minimum_ number of NUMA
nodes, there is no guarantee that those NUMA nodes will be on the same socket.
By directing the `CPUManager` to explicitly align CPUs at the socket boundary
rather than the NUMA boundary, we are able to avoid such issues. Note, this
policy option is not compatible with `TopologyManager` `single-numa-node`
policy and does not apply to hardware where the number of sockets is greater
than number of NUMA nodes.


If the `distribute-cpus-across-cores` policy option is specified, the static policy
will attempt to allocate virtual cores (hardware threads) across different physical cores.
By default, the `CPUManager` tends to pack cpus onto as few physical cores as possible,
which can lead to contention among cpus on the same physical core and result
in performance bottlenecks. By enabling the `distribute-cpus-across-cores` policy,
the static policy ensures that cpus are distributed across as many physical cores
as possible, reducing the contention on the same physical core and thereby
improving overall performance. However, it is important to note that this strategy
might be less effective when the system is heavily loaded. Under such conditions,
the benefit of reducing contention diminishes. Conversely, default behavior
can help in reducing inter-core communication overhead, potentially providing
better performance under high load conditions.


The `full-pcpus-only` option can be enabled by adding `full-pcpus-only=true` to
the CPUManager policy options.
Likewise, the `distribute-cpus-across-numa` option can be enabled by adding
`distribute-cpus-across-numa=true` to the CPUManager policy options.
When both are set, they are "additive" in the sense that CPUs will be
distributed across NUMA nodes in chunks of full-pcpus rather than individual
cores.
The `align-by-socket` policy option can be enabled by adding `align-by-socket=true`
to the `CPUManager` policy options. It is also additive to the `full-pcpus-only`
and `distribute-cpus-across-numa` policy options.

The `distribute-cpus-across-cores` option can be enabled by adding
`distribute-cpus-across-cores=true` to the `CPUManager` policy options.
It cannot be used with `full-pcpus-only` or `distribute-cpus-across-numa` policy
options together at this moment.
