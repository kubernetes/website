---
title: Pod-level resource managers
content_type: concept
weight: 40
min-kubernetes-server-version: v1.36
---

<!-- overview -->

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

To practice setting up Kubelet resource managers with pod-level resources and
observe allocation behaviors hands-on, follow the
[Use pod-level resources with Kubelet resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)
tutorial.

<!-- body -->

To understand pod-level resource managers, it is helpful to contrast them with
the traditional container-focused model. Previously, Kubelet resource
allocations were strictly all or nothing: to receive exclusive NUMA-aligned
resources for your workload, every container in the pod had to be Guaranteed
(specifying requests equal to limits for both CPU and memory).

Pod-level resource managers use `.spec.resources` to enable flexible
partitioning based on the configured Topology Manager scope:

*   **`pod` scope:** The Kubelet allocates and NUMA-aligns a single pod bubble
    for the entire pod based on `.spec.resources`. Containers requesting
    exclusive allocations carve out dedicated slices from within this pod
    bubble, while all other containers share the remaining bubble capacity in a
    pod-isolated shared pool.
*   **`container` scope:** Enables a hybrid allocation model. The Kubelet allows
    individual containers to receive exclusive, NUMA-aligned resources directly
    from the node's allocatable pool, while using the pod's `.spec.resources`
    ceiling to cap collective consumption—allowing sidecars to run in the
    general node shared pool without requiring every container in the pod to be
    Guaranteed.

Both standard init containers and restartable init containers (sidecars) are
fully supported. They can be granted exclusive resource slices or utilize the
pod's shared pool, and their lifecycle rules (e.g., reusable resources for
standard init containers vs. persistent reservations for sidecars) are respected
by the pod-level resource managers.

## Glossary

Pod level resources specification
:   The resource budget defined at the Pod level in `.spec.resources`, that
    specifies the collective requests and limits for the entire pod.

Guaranteed container
:   A container that specifies resource requests equal to its limits for both
    CPU (exclusive CPU allocation requires a positive integer value) and Memory.
    Consistent with existing Kubelet behavior, this makes the container eligible
    for exclusive resource allocation from the resource managers.

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

## How pod-level resource managers work

The CPU and Memory resource managers operate differently depending on the
configured Topology Manager scope.

### Topology manager's pod scope and pod-level resources

When the Topology Manager scope is set to `pod`, the Kubelet performs a single
NUMA alignment for the entire pod based on the resource budget defined in
`.spec.resources`.

The resulting NUMA-aligned resource pool is then partitioned:

1.  **Exclusive slices:** Containers that specify `Guaranteed` resources
    (requests equal to limits for both CPU and memory, and the CPU request is a
    positive integer) are allocated exclusive slices from the pod's total
    allocation.
2.  **Pod shared pool:** The remaining resources form a shared pool that is
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

### Topology manager's container scope and pod-level resources

When the Topology Manager scope is set to `container`, the Kubelet evaluates
each container individually for exclusive allocation.

If the overall pod achieves a `Guaranteed` QoS class (by specifying appropriate
values in the Pod-level `.spec.resources`), you can mix and match containers:

*   Containers with their own `Guaranteed` requests receive exclusive
    NUMA-aligned resources.
*   Other containers in the pod that do not specify `Guaranteed` requests run in
    the node's shared pool.
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

### CPU quota (CFS)

When running mixed workloads within a pod, isolation is enforced differently
depending on the allocation:

*   **Exclusive containers:** Containers granted exclusive CPU slices have their
    CPU CFS quota enforcement disabled, allowing them to run without being
    throttled by the Linux scheduler.
*   **Pod shared pool containers:** Containers falling into the pod shared pool
    have CPU CFS quotas enabled, ensuring they do not consume more than the
    leftover pod budget and preventing them from interfering with the exclusive
    containers.

### Persistent pool and restarts

The pod's total resource pool (the NUMA alignment and total reserved capacity)
is persistent. If a container utilizing the pod's shared pool crashes and
restarts, the pod's overall resource reservation remains safely anchored on the
node. The resources are only released back to the node's general pool when the
entire pod is terminated.

### Kubelet downgrades and state checkpoints

In Kubernetes 1.36, enabling `PodLevelResourceManagers` updated internal Kubelet
state checkpoint files (`cpu_manager_state` and `memory_manager_state`) to a
format that older Kubelets cannot load. If you downgrade a 1.36 Kubelet after
active use, the older Kubelet fails to start; you must drain the node, delete
these checkpoint files, and restart the Kubelet.

Starting in Kubernetes 1.37, checkpoint files use a forward-compatible format to
prevent start-up failures during downgrades, though active pod-level resource
assignments are not restored by 1.36 Kubelets. For complete details on
checkpoint formats and recovery, see the
[Pod-level resource managers reference](/docs/reference/node/pod-level-resource-managers/#state-checkpoints).

## Observability and metrics

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

### PodResources API {#podresources-api}

Starting in Kubernetes 1.37, the Kubelet's node-local `PodResources` gRPC API
includes pod-level resource allocations when `PodLevelResourceManagers` is
enabled. Node-local monitoring agents and device plugins can query top-level pod
assignments (`cpu_ids` and `memory`) while avoiding double-counting
container-level allocations.

For complete API schemas, field masks, and scope-by-scope reporting tables, see
the
[Pod-level resource managers reference](/docs/reference/node/pod-level-resource-managers/#podresources-api).

## Limitations and caveats

*   The functionality is only implemented for the `static` CPU Manager policy
    and the `Static` Memory Manager policy. Note that the `BestEffort` policy is
    not supported for the Memory Manager.
*   This feature is only supported on Linux nodes. On Windows nodes, the
    resource managers will act as a no-op for pod-level allocations.

## {{% heading "whatsnext" %}}

*   Learn how to
    [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/).
*   Follow the
    [Use pod-level resources with Kubelet resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)
    tutorial.
*   Read about
    [Node Resource Managers](/docs/concepts/policy/node-resource-managers/).
