---
title: Resource managers
reviewers:
- ffromani
- ndixita
content_type: concept
weight: 60
---

<!-- overview -->

In order to support latency-critical and high-throughput workloads, Kubernetes
offers a suite of Resource Managers. The managers aim to co-ordinate and
optimize the alignment of node's resources for pods configured with a specific
requirement for CPUs, devices, and memory (hugepages) resources.

<!-- body -->

## Topology manager

{{< feature-state feature_gate_name="TopologyManager" >}}

*Topology Manager* is a kubelet component that aims to coordinate the set of
components that are responsible for these optimizations. To learn more, read
[Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/).

## CPU manager

{{< feature-state feature_gate_name="CPUManager" >}}

*CPU Manager* is a kubelet component that provides exclusive resource allocation
for CPU resources. It consults with the Topology Manager to make resource
assignment decisions. To learn more, read
[Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/).

### Policies for assigning CPUs to Pods

Once a Pod is bound to a Node, the kubelet on that node may need to either multiplex the existing
hardware (for example, sharing CPUs across multiple Pods) or allocate hardware by dedicating some
resource (for example, assigning one of more CPUs for a Pod's exclusive use).

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods, the workload can move to
different CPU cores depending on whether the pod is throttled and which CPU cores are available
at scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity and scheduling latency significantly affect
workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.
This is implemented using the _CPU Manager_ and its policy.
There are two available policies:

- `none`: the `none` policy explicitly enables the existing default CPU
  affinity scheme, providing no affinity beyond what the OS scheduler does
  automatically.  Limits on CPU usage for
  [Guaranteed pods](/docs/concepts/workloads/pods/pod-qos/) and
  [Burstable pods](/docs/concepts/workloads/pods/pod-qos/)
  are enforced using CFS quota.
- `static`: the `static` policy allows containers in `Guaranteed` pods with integer CPU
  `requests` access to exclusive CPUs on the node. This exclusivity is enforced
  using the [cpuset cgroup controller](https://www.kernel.org/doc/Documentation/cgroup-v2.txt).

{{< note >}}
System services such as the container runtime and the kubelet itself can continue to run on
these exclusive CPUs.  The exclusivity only extends to other pods.
{{< /note >}}

CPU Manager doesn't support offlining and onlining of CPUs at runtime.

#### Static policy

The static policy enables finer-grained CPU management and exclusive CPU assignment.
This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations set by the kubelet configuration.
CPUs reserved by these options are taken, in integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.

{{< note >}}
The kubelet requires a CPU reservation greater than zero when the static policy is enabled.
This is because a zero CPU reservation would allow the shared pool to become empty.
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

##### Static policy options {#cpu-policy-static--options}

Here are the available policy options for the static CPU management policy,
listed in alphabetical order:

`align-by-socket` (alpha, hidden by default)
: Align CPUs by physical package / socket boundary, rather than logical NUMA boundaries
  (available since Kubernetes v1.25)

`distribute-cpus-across-cores` (alpha, hidden by default)
: Allocate virtual cores, sometimes called hardware threads, across different physical cores
  (available since Kubernetes v1.31)

`distribute-cpus-across-numa` (beta, visible by default)
: Spread CPUs across different NUMA domains, aiming for an even balance between the selected domains
  (available since Kubernetes v1.23)

`full-pcpus-only` (GA, visible by default)
: Always allocate full physical cores (available since Kubernetes v1.22, GA since Kubernetes v1.33)

`strict-cpu-reservation` (GA, visible by default)
: Prevent all the pods regardless of their Quality of Service class to run on reserved CPUs
  (available since Kubernetes v1.32, GA since Kubernetes v1.35)

`prefer-align-cpus-by-uncorecache` (GA, visible by default)
: Align CPUs by uncore (Last-Level) cache boundary on a best-effort way
  (available since Kubernetes v1.32)

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:

* `CPUManagerPolicyBetaOptions` (default enabled). Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` (default disabled). Enable to show alpha-level options.

You will still have to enable each option using the `cpuManagerPolicyOptions` field in the
kubelet configuration file.

For more detail about the individual options you can configure, read on.

###### `full-pcpus-only`

If the `full-pcpus-only` policy option is specified, the static policy will always allocate full physical cores.
By default, without this option, the static policy allocates CPUs using a topology-aware best-fit allocation.
On SMT enabled systems, the policy can allocate individual virtual cores, which correspond to hardware threads.
This can lead to different containers sharing the same physical cores; this behaviour in turn contributes
to the [noisy neighbours problem](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).
With the option enabled, the pod will be admitted by the kubelet only if the CPU request of all its containers
can be fulfilled by allocating full physical cores.
If the pod does not pass the admission, it will be put in Failed state with the message `SMTAlignmentError`.

###### `distribute-cpus-across-numa`

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

###### `align-by-socket`

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

###### `distribute-cpus-across-cores`

If the `distribute-cpus-across-cores` policy option is specified, the static policy
will attempt to allocate virtual cores (hardware threads) across different physical cores.
By default, the `CPUManager` tends to pack CPUs onto as few physical cores as possible,
which can lead to contention among CPUs on the same physical core and result
in performance bottlenecks. By enabling the `distribute-cpus-across-cores` policy,
the static policy ensures that CPUs are distributed across as many physical cores
as possible, reducing the contention on the same physical core and thereby
improving overall performance. However, it is important to note that this strategy
might be less effective when the system is heavily loaded. Under such conditions,
the benefit of reducing contention diminishes. Conversely, default behavior
can help in reducing inter-core communication overhead, potentially providing
better performance under high load conditions.

###### `strict-cpu-reservation`

The `reservedSystemCPUs` parameter in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/),
or the deprecated kubelet command line option `--reserved-cpus`, defines an explicit CPU set for OS system daemons
and kubernetes system daemons. More details of this parameter can be found on the
[Explicitly Reserved CPU List](/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list) page.
By default, this isolation is implemented only for guaranteed pods with integer CPU requests not for burstable and best-effort pods
(and guaranteed pods with fractional CPU requests). Admission is only comparing the CPU requests against the allocatable CPUs.
Since the CPU limit is higher than the request, the default behaviour allows burstable and best-effort pods to use up the capacity
of `reservedSystemCPUs` and cause host OS services to starve in real life deployments.
If the `strict-cpu-reservation` policy option is enabled, the static policy will not allow
any workload to use the CPU cores specified in `reservedSystemCPUs`.

###### `prefer-align-cpus-by-uncorecache`

If the `prefer-align-cpus-by-uncorecache` policy is specified, the static policy
will allocate CPU resources for individual containers such that all CPUs assigned
to a container share the same uncore cache block (also known as the Last-Level Cache
or LLC). By default, the `CPUManager` will tightly pack CPU assignments which can
result in containers being assigned CPUs from multiple uncore caches. This option
enables the `CPUManager` to allocate CPUs in a way that maximizes the efficient use
of the uncore cache. Allocation is performed on a best-effort basis, aiming to
affine as many CPUs as possible within the same uncore cache. If the container's
CPU requirement exceeds the CPU capacity of a single uncore cache, the `CPUManager`
minimizes the number of uncore caches used in order to maintain optimal uncore
cache alignment. Specific workloads can benefit in performance from the reduction
of inter-cache latency and noisy neighbors at the cache level. If the `CPUManager`
cannot align optimally while the node has sufficient resources, the container will
still be admitted using the default packed behavior.

## Memory manager

{{< feature-state feature_gate_name="MemoryManager" >}}

*Memory Manager* is a kubelet component that provides exclusive resource
allocation for memory resources. It consults with the Topology Manager to make
resource assignment decisions. To learn more, read
[Control Memory Management Policies on a Node](/docs/tasks/administer-cluster/memory-manager/).

### Policies for assigning memory to Pods {#memory-management-policies}

The Kubernetes *Memory Manager* allocates RAM (memory, and optionally Linux huge pages) resources
for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.

The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.

Moreover, the Memory Manager ensures that the memory which a pod requests
is allocated from a minimum number of NUMA nodes.

To learn more, read [Control Memory Management Policies on a Node](/docs/tasks/administer-cluster/memory-manager/).

## Device manager

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

*Device Manager* is a kubelet component that allocates hardware devices to pods
using the device plugin API. It consults with the Topology Manager, using
topology information provided by device plugins, to make resource assignment
decisions. To learn more, read
[Device Plugin Integration with the Topology Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

## Pod-level resource managers {#pod-level-resource-managers}

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

Pod-level resource support for the existing resource managers (Topology, CPU,
and Memory) extends them to handle pod-level resource specifications. When
enabled (via the `PodLevelResources` and `PodLevelResourceManagers` feature
gates), the resource managers can use `.spec.resources` directly as the basis
for their allocation decisions, evolving from a strictly per-container
allocation model to a pod-centric one. This partitioning scheme introduces a
more flexible and powerful resource management model, particularly for
performance-sensitive workloads. It allows you to define hybrid allocation
models where some containers in a Pod receive exclusive, NUMA-aligned resources,
while others share the remaining resources from a pod-level shared pool.

It is important to differentiate between the capabilities offered by each
Topology Manager scope, and how this modifies the behavior of the resource
managers. The `pod` scope enables allocation based on the entire pod's budget,
creating a pod-level shared pool for non-Guaranteed containers, alongside
exclusive allocations. In contrast, the `container` scope allows for a hybrid
allocation model where individual containers can get exclusive, NUMA-aligned
resources while others run in the node's shared pool, without aligning the
entire pod as a single unit.

Both standard init containers and restartable init containers (sidecars) are
fully supported. They can be granted exclusive resource slices or utilize the
pod's shared pool, and their lifecycle rules (e.g., reusable resources for
standard init containers vs. persistent reservations for sidecars) are respected
by the pod-level resource managers.

### Glossary

Pod level resources specification
:   The resource budget defined at the Pod level in `.spec.resources`, that
    specifies the collective requests and limits for the entire pod.

Guaranteed Container
:   Within the context of this feature, a container is considered `Guaranteed`
    if it specifies resource requests equal to its limits for both CPU
    (exclusive CPU allocation requires a positive integer value) and Memory.
    This status makes it eligible for exclusive resource allocation from the
    resource managers.

Exclusive slice
:   A dedicated portion of resources (for example: specific CPUs or memory
    pages) allocated solely to a single container, ensuring isolation from other
    containers.

Pod shared pool
:   The subset of a pod's allocated resources that remains after all exclusive
    slices have been reserved. These resources are shared by all containers in
    the pod that do not receive an exclusive allocation. While containers in
    this pool share resources with each other, they are strictly isolated from
    the exclusive slices and the general node-wide shared pool.

### How pod-level resource managers work

The CPU and Memory resource managers operate differently depending on the
configured Topology Manager scope.

#### Topology manager's pod scope and pod-level resources

When the Topology Manager scope is set to `pod`, the Kubelet performs a single
NUMA alignment for the entire pod based on the resource budget defined in
`.spec.resources`.

The resulting NUMA-aligned resource pool is then partitioned:

1.  **Exclusive Slices:** Containers that specify `Guaranteed` resources
    (requests equal to limits for both CPU and memory, and the CPU request is a
    positive integer) are allocated exclusive slices from the pod's total
    allocation.
2.  **Pod Shared Pool:** The remaining resources form a shared pool that is
    shared among all other containers in the pod that do not receive an
    exclusive allocation. While containers in this pool share resources with
    each other, they are strictly isolated from the exclusive slices and the
    general node-wide shared pool.

Note that when standard init containers run to completion, their resources are
added to a per-pod reusable set, rather than being returned to the node's
resource pool. Because they run sequentially, these resources are made reusable
for subsequent app containers (either for their own exclusive slices or for the
shared pool).

This allows you to co-locate containers that require exclusive resources (for
example: a high-performance primary application) with those that do not (for
example: sidecars for logging or monitoring), all within a single NUMA-aligned
pod.

Consider the containers in the following pod spec, where the Topology Manager
scope is `pod` and the pod has a total budget of 4 CPUs. `main-app` requests an
exclusive 2 CPU slice, while the sidecars share the remaining 2 CPUs in the
pod's shared pool:

{{% code_sample file="pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml" %}}

**Important considerations:**

When using pod-level resources with the Topology manager's pod scope, there are
some important considerations:

*   **Empty shared pool restriction:** This configuration does not allow pod
    specifications that would produce an empty pod shared pool if there are
    containers that require one. If the sum of resource requests from all
    containers that are `Guaranteed` exactly equals the total resource budget,
    and there is at least one other container that requires a shared pool, the
    pod will be rejected at admission.

    For example, the following pod asks for a pod-level budget of 4 CPUs.
    `main-app` requires an exclusive 3 CPUs and `metrics-sidecar` requires an
    exclusive 1 CPU. Because there are 0 CPUs left in the shared pool for
    `logging-sidecar`, this pod is rejected (the same validation is applied for
    memory):

    {{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

*   **Wasted resources:** Any resources overallocated when using the `pod` scope
    (the total container requests sum to less than the pod-level budget and
    there are no shared pool containers, or the shared pool containers don't
    fully utilize the remaining amount) will be assigned and reserved for the
    pod, effectively being wasted during the whole execution of the pod.

*   **Persistent pool:** The pod's total resource pool (the NUMA alignment and
    total reserved capacity) is persistent. If a shared-pool container crashes
    and restarts, the pod's overall resource reservation remains safely anchored
    on the node. The resources are only released back to the node's general pool
    when the entire pod is terminated.

#### Topology manager's container scope and pod-level resources

When the Topology Manager scope is set to `container`, the Kubelet evaluates
each container individually for exclusive allocation.

If the overall pod achieves a `Guaranteed` QoS class (through of having
appropriate values in the Pod-level `.spec.resources`), you can mix and match
containers:

*   Containers with their own `Guaranteed` requests receive exclusive
    NUMA-aligned resources.
*   Other `non-Guaranteed` containers in the pod run in the node's shared pool.
*   The collective resource consumption of all containers is still enforced by
    the pod's `.spec.resources` limits.

This scope is useful when you have an infrastructure sidecar that needs to be
aligned to a specific NUMA node for device access, while the main workload can
run in the general node shared pool.

Consider the containers in the following pod spec, where the Topology Manager
scope is `container` and the pod represents a workload with an infrastructure
sidecar and two application workers, with a total budget of 4 CPUs. The
`infrastructure-sidecar` gets an exclusive, NUMA-aligned 2 CPU slice. The two
application workers (`worker-1` and `worker-2`) run in the general, node-wide
shared pool:

{{% code_sample file="pods/resource/pod-level-resource-managers-container-scope-mixed.yaml" %}}

#### CPU quota (CFS)

When running mixed workloads within a pod, isolation is enforced differently
depending on the allocation:

*   **Exclusive Containers:** Containers granted exclusive CPU slices have their
    CPU CFS quota enforcement disabled, allowing them to run without being
    throttled by the Linux scheduler.
*   **Pod Shared Pool Containers:** Containers falling into the pod shared pool
    have CPU CFS quotas enabled, ensuring they do not consume more than the
    leftover pod budget and preventing them from interfering with the exclusive
    containers.

#### Persistent pool and restarts

The pod's total resource pool (the NUMA alignment and total reserved capacity)
is persistent. If a container utilizing the pod's shared pool crashes and
restarts, the pod's overall resource reservation remains safely anchored on the
node. The resources are only released back to the node's general pool when the
entire pod is terminated.

#### Kubelet downgrades and state checkpoints

{{< caution >}}

Enabling the `PodLevelResourceManagers` feature introduces new state versions
for the CPU and Memory managers.

If you downgrade the Kubelet to a version that does not support this feature, or
if you explicitly disable the feature gates after they have been active, the
older Kubelet will fail to read the newer checkpoint files due to this version
incompatibility. To recover, administrators must drain the affected node,
manually delete the
[internal state checkpoint files](/docs/reference/node/kubelet-files/#resource-managers-state)
(`cpu_manager_state` and `memory_manager_state`), and restart the Kubelet.

{{< /caution >}}

### Observability and metrics

You can monitor the behavior and health of the resource managers across both
container-level and pod-level allocations using the following Kubelet metrics
(enabled via the `PodLevelResourceManagers` feature gate):

*   `resource_manager_allocations_total`: Counts the total number of exclusive
    resource allocations performed by a manager. The `source` label ("pod" or
    "node") distinguishes between allocations drawn from the node-level pool
    versus a pre-allocated pod-level pool.
*   `resource_manager_allocation_errors_total`: Counts errors encountered during
    exclusive resource allocation, distinguished by the intended allocation
    `source` ("pod" or "node").
*   `resource_manager_container_assignments`: Tracks the cumulative number of
    containers that will be granted a specific type of resource assignment. The
    `assignment_type` label ("node_exclusive", "pod_exclusive", "pod_shared")
    provides visibility into how many containers are running with exclusive
    resources (from the node or pod pool) versus the pod-level shared pool.

### Limitations and caveats

*   The functionality is only implemented for the `static` CPU Manager policy
    and the `Static` Memory Manager policy. Note that the `BestEffort` policy is
    not supported for the Memory Manager.
*   This feature is only supported on Linux nodes. On Windows nodes, the
    resource managers will act as a no-op for pod-level allocations.

## {{% heading "whatsnext" %}}

For more detailed information on node-level resource managers, see:

*   [Node Resource Managers](/docs/concepts/policy/node-resource-managers/)

For more detailed information on how to configure and use pod-level resource
managers, see:

*   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
