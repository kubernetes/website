---
reviewers:
- klueska
- pohly
title: How DRA Works
content_type: concept
weight: 20
---

<!-- overview -->

This page describes how Kubernetes allocates devices to workloads with dynamic
resource allocation (DRA), and how pre-scheduled Pods interact with the process.

<!-- body -->

## How resource allocation with DRA works {#how-it-works}

The following sections describe the workflow for the various
[types of DRA users](/docs/concepts/resource-management/dynamic-resource-allocation/#dra-user-types)
and for the Kubernetes system during
dynamic resource allocation.

### Workflow for users {#user-workflow}

1. **Driver creation**: device owners or third-party entities create drivers
   that can create and manage ResourceSlices in the cluster. These drivers
   optionally also create DeviceClasses that define a category of devices and
   how to request them.
1. **Cluster configuration**: cluster admins create clusters, attach devices to
   nodes, and install the DRA device drivers. Cluster admins optionally create
   DeviceClasses that define categories of devices and how to request them.
1. **Resource claims**: workload operators create ResourceClaimTemplates or
   ResourceClaims that request specific device configurations within a
   DeviceClass. In the same step, workload operators modify their Kubernetes
   manifests to request those ResourceClaimTemplates or ResourceClaims.

### Workflow for Kubernetes {#kubernetes-workflow}

1. **ResourceSlice creation**: drivers in the cluster create ResourceSlices that
   represent one or more devices in a managed pool of similar devices.
1. **Workload creation**: the cluster control plane checks new workloads for
   references to ResourceClaimTemplates or to specific ResourceClaims.

   * If the workload uses a ResourceClaimTemplate, a controller named the
     `resourceclaim-controller` generates ResourceClaims for the workload.
   * If the workload uses a specific ResourceClaim, Kubernetes checks whether
     that ResourceClaim exists in the cluster. If the ResourceClaim doesn't
     exist, the Pods won't deploy.

1. **ResourceSlice filtering**: for every Pod, Kubernetes checks the
   ResourceSlices in the cluster to find a device that satisfies all of the
   following criteria:

   * The nodes that can access the resources are eligible to run the Pod.
   * The ResourceSlice has unallocated resources that match the requirements of
     the Pod's ResourceClaim.

1. **Resource allocation**: after finding an eligible ResourceSlice for a
   Pod's ResourceClaim, the Kubernetes scheduler updates the ResourceClaim
   with the allocation details. The scheduler uses a first-fit strategy and
   evaluates pools and ResourceSlices in lexicographical order by their names.
   Drivers can prioritize specific slices or pools by naming them appropriately.
   For details, see
   [Naming and prioritization](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceslice-naming-and-prioritization).
1. **Pod scheduling**: when resource allocation is complete, the scheduler
   places the Pod on a node that can access the allocated resource. The device
   driver and the `kubelet` on that node coordinate via gRPC to configure the
   device and the Pod's access to the device, unless the driver declared
   [optional node operations](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)
   for devices that do not require node-local preparation or cleanup.

## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled later.

Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.

It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

You may also be able to mutate the incoming Pod, at admission time, to unset
the `.spec.nodeName` field and to use a node selector instead.

## Device binding conditions

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

Device Binding Conditions allow the Kubernetes scheduler to delay Pod binding until
external resources, such as fabric-attached GPUs or reprogrammable FPGAs, are confirmed
to be ready.

This waiting behavior is implemented in the 
[PreBind phase](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
of the scheduling framework.
During this phase, the scheduler checks whether all required device conditions are
satisfied before proceeding with binding.

This improves scheduling reliability by avoiding premature binding and enables coordination
with external device controllers.

To use this feature, device drivers (typically managed by driver owners) must publish the
following fields in the `Device` section of a `ResourceSlice`. Cluster administrators
must enable the `DRADeviceBindingConditions` and `DRAResourceClaimDeviceStatus` feature
gates for the scheduler to honor these fields.

`bindingConditions`
: A list of _condition types_ that must be set to True (in the `.status.conditions` field of the associated ResourceClaim) before the Pod can be bound. These conditions typically represent readiness signals, such as DeviceAttached or DeviceInitialized.

`bindingFailureConditions`
: A list of condition types that, if set to True in
  status.conditions field of the associated ResourceClaim, indicate a failure state.
  If any of these conditions are True, the scheduler will abort binding and reschedule the Pod.

`bindsToNode`
: if set to `true`, the scheduler records the selected node name in the
  `status.allocation.nodeSelector` field of the ResourceClaim.
  This does not affect the Pod's `spec.nodeSelector`. Instead, it sets a node selector
  inside the ResourceClaim, which external controllers can use to perform node-specific
  operations such as device attachment or preparation.

All condition types listed in bindingConditions and bindingFailureConditions are evaluated
from the `status.conditions` field of the ResourceClaim.
External controllers are responsible for updating these conditions using standard Kubernetes
condition semantics (`type`, `status`, `reason`, `message`, `lastTransitionTime`).

The scheduler waits up to **600 seconds** (default) for all `bindingConditions` to become `True`.
If the timeout is reached or any `bindingFailureConditions` are `True`, the scheduler
clears the allocation and reschedules the Pod.
A cluster administration can configure this timeout duration by editing the kube-scheduler configuration file.

An example of configuring this timeout in `KubeSchedulerConfiguration` is given below:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  pluginConfig:
  - name: DynamicResources
    args:
      apiVersion: kubescheduler.config.k8s.io/v1
      kind: DynamicResourcesArgs
      bindingTimeout: 60s
```

### Example {#device-binding-conditions-example}

Here is an example of a ResourceSlice that you might see in a cluster where there's a DRA driver in use, and that driver supports binding conditions:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-slice-1
spec:
  driver: dra.example.com
  nodeSelector:
    nodeSelectorTerms:
    - matchExpressions:
      - key: accelerator-type
        operator: In
        values:
        - "high-performance"
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
    - name: gpu-1
      attributes:
        vendor:
          string: "example"
        model:
          string: "example-gpu"
      bindsToNode: true
      bindingConditions:
        - dra.example.com/is-prepared
      bindingFailureConditions:
        - dra.example.com/preparing-failed
```
This example ResourceSlice has the following properties:

- The ResourceSlice targets nodes labeled with `accelerator-type=high-performance`, 
so that the scheduler uses only a specific set of eligible nodes.
- The scheduler selects one node from the selected group (for example, `node-3`) and sets 
the `status.allocation.nodeSelector` field in the ResourceClaim to that node name.
- The `dra.example.com/is-prepared` binding condition indicates that the device `gpu-1`
must be prepared (the `is-prepared` condition has a status of `True`) before binding. 
- If the `gpu-1` device preparation fails (the `preparing-failed` condition has a status of `True`), the scheduler aborts binding.
- The scheduler waits up to 600 seconds (default) for the device to become ready.
- External controllers can use the node selector in the ResourceClaim to perform
node-specific setup on the selected node.

Device binding conditions is controlled by the
[`DRADeviceBindingConditions` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)
in the `kube-apiserver` and `kube-scheduler`.


## Node allocatable resources {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

Devices managed by DRA can have an underlying footprint composed of node allocatable
resources, such as `cpu`, `memory`, or `hugepages`.
This feature integrates these DRA-based requests into the scheduler's standard
accounting alongside regular Pod `spec` requests for these resources.

DRA drivers define how devices consume node allocatable resources using two distinct models:

*   **Direct Resource Mapping (`mapping`)**: The DRA device directly provides a standard node resource (such as a custom CPU core pool or memory block). The claim allocation directly maps to standard CPU or memory capacity on the node.
*   **Auxiliary Device Overhead (`overhead`)**: The DRA device (such as a GPU or accelerator) requires host resources (such as host RAM) as secondary overhead to operate when allocated to a Pod or container.

### Considerations for Pod Authors

When authoring a PodSpec using claims for these types of devices, there are a few things to be aware of:

*   When Pod-level resources are used, the scheduler strictly validates them against both container requests and limits:
    *  The sum of all container requests and DRA claim resources must not exceed the Pod-level requests; otherwise, the Pod will fail to schedule.
    *  Each individual container's limit plus its DRA allocations must not exceed the Pod-level limits; otherwise, the Pod will fail to schedule.
*   A container's total resource requirement is the sum of its container-level resources
    and any node allocatable resources from its associated resource claims.
*   **Claim Sharing Restriction**: Claims that use direct resource mappings (`mapping`) cannot be shared across multiple Pods. Claims for devices 
    with `overhead` can support device sharing and overhead is tracked per Pod or per container.
*   Pods with DRA claims support in-place resizing for standard requests in `spec`. The scheduler ensures 
    that resized standard requests combined with static DRA allocations still fit on the node.

### Details for DRA Driver Authors

DRA drivers declare this node allocatable resource footprint using the
`nodeAllocatableResources` field on devices within a ResourceSlice.
This defines the translation of the requested DRA device or capacity into standard
resources that are tracked in the node's `status.allocatable` (note that extended
resources are not supported for this field). This is useful both for drivers that directly
expose native resources (like a CPU or Memory DRA driver) and for devices that
require auxiliary node dependencies (like an accelerator that needs host memory).

The `nodeAllocatableResources` field supports two different use cases:

*   **Mapping**: Used when the DRA device directly represents the standard resource
    (e.g., a CPU or Memory DRA driver). The scheduler calculates the exact quantity
    by scaling the capacity using `capacityMultiplier`, or scaling the device count
    using `deviceMultiplier`.
*   **Overhead**: Used when the device requires auxiliary node dependencies (e.g.,
    host memory consumed by a GPU). This can be defined as a flat `perPod` cost or
    a variable `perContainer` cost that scales linearly with the number of
    referencing containers.

#### Example: CPU DRA Driver (Mapping)

Here is an example where a CPU DRA driver exposes a CPU socket as a pool of 128
CPUs using [DRA consumable capacity](#consumable-capacity). The `capacityKey` links the consumed
`cpu.example.com/cpu` capacity directly to the node's standard `cpu`
allocatable resource:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-cpus
spec:
  driver: cpu.example.com
  nodeName: my-node
  pool:
    name: socket-cpus
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: socket0cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
          capacityMultiplier: 1
```

#### Example: Accelerator with Auxiliary Resources (Overhead)

Here is an example of a resource slice where an accelerator requires an
additional 8Gi of memory per Pod to function:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-xpus
spec:
  driver: xpu.example.com
  nodeName: my-node
  pool:
    name: xpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: xpu-model-x-001
    attributes:
      example.com/model:
        string: "model-x"
    nodeAllocatableResources:
      overhead:
        memory:
          perPod: "8Gi"
```

After a Pod is successfully bound to the node, the exact quantities of 
node allocatable resources allocated via DRA are aggregated by the `kube-scheduler`
and embedded directly into the Pod's `status.nodeAllocatableResourceClaimStatuses` field.
This provides a clear, persistent handoff from the scheduler to the `kubelet`.

Crucially, the `kubelet` natively consumes this API to perfectly align system-level boundaries:
- **cgroups**: Pod and container cgroups would now include DRA based allocations, preventing workloads from being artificially throttled by the kernel.
- **OOM Scores**: The `kubelet` factors the container's DRA memory requests into its effective memory request.

Node allocatable resources is an alpha feature and is enabled when the
[`DRANodeAllocatableResources` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources) is enabled in the `kube-apiserver`,
`kube-scheduler`, and `kubelet`.

