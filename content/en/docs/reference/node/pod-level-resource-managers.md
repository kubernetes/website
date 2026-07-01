---
title: Pod-level resource managers reference
content_type: reference
weight: 30
---

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

This document provides reference details for the Pod-level Resource Managers
implementation in the Kubelet, including PodResources API reporting structures
and state checkpoint format migrations during version upgrades and downgrades.

## PodResources API {#podresources-api}

Starting in Kubernetes 1.37, the Kubelet's node-local `PodResources` gRPC API
natively includes pod-level resource entries when the `PodLevelResourceManagers`
feature gate is enabled. This allows node-local monitoring agents and device
plugins to query exclusive resources assigned to a Pod:

*   **Pod-level fields:** The `PodResources` gRPC message includes top-level
    `cpu_ids` and `memory` fields representing the exclusive CPUs and
    NUMA-aligned memory blocks allocated to the entire pod.
*   **Container-level filtering:** Container-level reporting is structured to
    avoid double-counting:
    *   Containers receiving individual exclusive allocations report their
        specific assigned CPUs and memory in `ContainerResources`.
    *   Containers sharing resources within the pod's budget (running in the
        pod-isolated shared pool or node shared pool) leave container-level
        `cpu_ids` and `memory` fields empty, with the allocation reflected at
        the pod level.
*   **Computing the pod shared pool:** API consumers can compute the resources
    in the pod-level shared pool by taking the pod-level allocation and
    subtracting the union of all exclusive container-level allocations:
    `PodSharedPool.CpuIds = Pod.CpuIds - Union(all Container.CpuIds)`

Here is a summary of the `PodResources` API reporting behavior when pod-level
resources are specified:

### 1. Topology Manager scope: `pod`

The Topology Manager allocates a pod-level resource budget. Pod-level fields in
`PodResources` are populated with this allocation.

Container Combination            | Pod-Level `cpu_ids` / `memory`                | Container-Level `cpu_ids` / `memory`             | Details / Notes
:------------------------------- | :-------------------------------------------- | :----------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Populated with the full pod level allocation. | Populated with the container's allocated subset. | The container receives exclusive CPUs carved out of the pod-level allocation.
Shared Pool Container            | Populated with the full pod level allocation. | Empty                                            | Avoids double-counting since the container runs in the pod shared pool.

### 2. Topology Manager scope: `container`

Resource allocations are evaluated per container. Pod-level `PodResources` API
fields remain empty.

Container Combination            | Pod-Level `cpu_ids` / `memory` | Container-Level `cpu_ids` / `memory`                  | Details / Notes
:------------------------------- | :----------------------------- | :---------------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Empty                          | Populated with the container's allocated CPUs/Memory. | The container receives exclusive allocations directly from the node's allocatable pool.
Shared Pool Container            | Empty                          | Empty                                                 | Runs in the node's general shared pool.

## Kubelet state checkpoint formats {#state-checkpoints}

The Kubelet maintains local state checkpoint files (`cpu_manager_state` and
`memory_manager_state` in the Kubelet root directory) to preserve resource
assignments across restarts during Kubelet version upgrades and downgrades.

### Checkpoint format in Kubernetes v1.36

In Kubernetes v1.36, enabling the `PodLevelResourceManagers` feature gate saved
state checkpoints using an internal V3 format. While upgrading to 1.36 is
backward compatible, the V3 format lacks forward compatibility. If you downgrade
a 1.36 Kubelet to 1.35 or earlier (or disable the feature gate after active use
in 1.36), older Kubelets cannot parse V3 checkpoints and fail to start with a
`checkpoint is corrupted` error.

To recover from this, administrators must drain the node, manually remove the
checkpoint files (`cpu_manager_state` and `memory_manager_state`), and restart
the Kubelet.

### Forward-compatible format in Kubernetes v1.37+

Starting in Kubernetes v1.37, checkpoint files use a generalized V4 format that
embeds the standard V2 structure. This introduces a forward-compatible internal
format so that checkpoint incompatibility is a one-off issue rather than
something users should expect in future updates:

*   **Upgrade and downgrade compatibility:** Older Kubelets can read V4
    checkpoints without corruption errors. If you downgrade a v1.37 Kubelet to
    v1.36 (even with `PodLevelResourceManagers` enabled in 1.36), the 1.36
    Kubelet safely restores standard container allocations from V2.
*   **Loss of pod-level entries:** While the Kubelet starts safely without
    corruption, active pod-level resource assignments (`PodEntries`) are lost
    upon downgrade to v1.36.

If you are not running Kubernetes v1.37, consult the documentation for that
version of Kubernetes for information about upgrades and downgrades.

## See also

*   [Pod-level resource managers concept](/docs/concepts/resource-management/pod-level-resource-managers/):
    Read the concept page to understand the overall architecture, QoS class
    requirements, and resource manager allocation rules across `pod` and
    `container` scopes.
*   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/):
    Learn how to configure `.spec.resources` in pod manifests to request
    pod-level compute resources.
*   [Use pod-level resources with Kubelet resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/):
    Follow a step-by-step hands-on tutorial to configure the Kubelet and verify
    allocation behaviors.
*   [Kubelet state files reference](/docs/reference/node/kubelet-files/#resource-managers-state):
    Learn more about where local state checkpoint files (`cpu_manager_state` and
    `memory_manager_state`) are stored on the host filesystem.
