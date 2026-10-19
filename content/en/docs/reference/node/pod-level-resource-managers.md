---
title: Pod-level resource managers reference
content_type: reference
weight: 30
---

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

This document provides reference details for the pod-level resource managers
implementation in the `kubelet`, including PodResources API reporting
structures and state checkpoint format migrations during version upgrades
and downgrades.

## PodResources API {#podresources-api}

In Kubernetes 1.37, the `kubelet`'s node-local `PodResources` gRPC API
natively includes pod-level resource entries when the
`PodLevelResourceManagers` feature gate is enabled. This allows node-local
monitoring agents and device plugins to query exclusive resources assigned
to a Pod:

-   **Pod-level fields:** The `PodResources` gRPC message includes
    top-level `cpu_ids` and `memory` fields representing the exclusive
    CPUs and NUMA-aligned memory blocks allocated to the entire Pod.
-   **Container-level filtering:** Container-level reporting avoids
    double-counting:
    -   Containers receiving individual exclusive allocations report their
        specific assigned CPUs and memory in `ContainerResources`.
    -   Containers sharing resources within the Pod's budget (running in
        the pod-isolated shared pool or Node shared pool) leave
        container-level `cpu_ids` and `memory` fields empty, with the
        allocation reflected at the Pod level.
-   **Computing the Pod shared pool:** API consumers can compute the
    resources in the pod-level shared pool by taking the pod-level
    allocation and subtracting the union of all exclusive container-level
    allocations:
    `PodSharedPool.CpuIds = Pod.CpuIds - Union(all Container.CpuIds)`

Here is a summary of the `PodResources` API reporting behavior when
pod-level resources are specified:

### 1. Topology Manager scope: `pod`

The Topology Manager allocates a pod-level resource budget. Pod-level
fields in `PodResources` are populated with this allocation.

{{< table caption="PodResources API reporting for pod scope" >}}
Container Combination            | Pod-Level `cpu_ids` / `memory`                | Container-Level `cpu_ids` / `memory`             | Details / Notes
:------------------------------- | :-------------------------------------------- | :----------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Populated with the full Pod-level allocation. | Populated with the container's allocated subset. | The container receives exclusive CPUs carved out of the pod-level allocation.
Shared Pool Container            | Populated with the full Pod-level allocation. | Empty                                            | Avoids double-counting since the container runs in the Pod shared pool.
{{< /table >}}

### 2. Topology Manager scope: `container`

The `kubelet` evaluates resource allocations per container. Pod-level
`PodResources` API fields remain empty.

{{< table caption="PodResources API reporting for container scope" >}}
Container Combination            | Pod-Level `cpu_ids` / `memory` | Container-Level `cpu_ids` / `memory`                  | Details / Notes
:------------------------------- | :----------------------------- | :---------------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Empty                          | Populated with the container's allocated CPUs/Memory. | The container receives exclusive allocations directly from the Node's allocatable pool.
Shared Pool Container            | Empty                          | Empty                                                 | Runs in the Node's general shared pool.
{{< /table >}}

## `kubelet` state checkpoint formats {#state-checkpoints}

The `kubelet` maintains local state checkpoint files (`cpu_manager_state`
and `memory_manager_state` in the `kubelet` root directory) to preserve
resource assignments across restarts during `kubelet` version upgrades and
downgrades.

### Checkpoint format in Kubernetes v1.36

In Kubernetes v1.36, enabling the `PodLevelResourceManagers` feature gate
saved state checkpoints using an internal V3 format. While upgrading to
1.36 is backward compatible, the V3 format lacks forward compatibility. If
you downgrade a 1.36 `kubelet` to 1.35 or earlier (or disable the feature
gate after active use in 1.36), the older `kubelet` cannot parse V3
checkpoints and fails to start with a `checkpoint is corrupted` error.

To recover, drain the Node, manually remove the checkpoint files
(`cpu_manager_state` and `memory_manager_state`), and restart the
`kubelet`.

### Forward-compatible format in Kubernetes v1.37+

In Kubernetes v1.37, checkpoint files use a generalized V4 format that
embeds the standard V2 structure. This introduces a forward-compatible
internal format so that checkpoint incompatibility is a one-off issue
rather than something you should expect in future updates:

-   **Upgrade and downgrade compatibility:** Older `kubelet` versions can
    read V4 checkpoints without corruption errors. If you downgrade a
    v1.37 `kubelet` to v1.36 (even with `PodLevelResourceManagers`
    enabled in 1.36), the 1.36 `kubelet` safely restores standard
    container allocations from V2.
-   **Loss of pod-level entries:** While the `kubelet` starts safely
    without corruption, active pod-level resource assignments
    (`PodEntries`) are lost upon downgrade to v1.36.

If you are not running Kubernetes v1.37, consult the documentation for
that version of Kubernetes for information about upgrades and downgrades.

## See also

-   [Pod-level resource managers concept](/docs/concepts/resource-management/pod-level-resource-managers/):
    Read the concept page to understand the overall architecture, QoS
    class requirements, and resource manager allocation rules across
    `pod` and `container` scopes.
-   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/):
    Learn how to configure `.spec.resources` in Pod manifests to request
    pod-level compute resources.
-   [Use pod-level resources with `kubelet` resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/):
    Follow a step-by-step hands-on tutorial to configure the `kubelet`
    and verify allocation behaviors.
-   [`kubelet` state files reference](/docs/reference/node/kubelet-files/#resource-managers-state):
    Learn more about where local state checkpoint files
    (`cpu_manager_state` and `memory_manager_state`) are stored on the
    host filesystem.
