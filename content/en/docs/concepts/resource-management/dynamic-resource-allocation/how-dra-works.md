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
   driver and the kubelet on that node configure the device and the Pod's access
   to the device.

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

Devices managed by DRA can have an underlying footprint composed of node-allocatable
resources, such as `cpu`, `memory`, `hugepages`, or `ephemeral-storage`.
This feature integrates these DRA-based requests into the scheduler's standard
accounting alongside regular Pod `spec` requests for these resources.

Users (PodSpec authors) can use a mixture of Pod-level resources, container-level resources, 
and resource claims with associated node-allocatable resources. These devices represent 
resources like CPUs or memory directly, or they could be accelerators, network interface cards,
or other devices that require some host resources when allocated. The DRA driver will 
populate information in the ResourceSlice that tells the scheduler how to calculate the
node allocatable resources when the device is allocated to a ResourceClaim.
PodSpec authors do not need to make that calculation themselves.

When authoring a PodSpec using claims for these types of devices, there are a few things to be aware of:

*   When Pod-level resources are used, the sum of all container and claim resources 
    must not exceed the Pod-level resources; otherwise, the Pod will fail to schedule.
*   A container's total resource requirement is the sum of its container-level resources
    and any node-allocatable resources from its associated resource claims.
*   Claims that consume node allocatable resources cannot be shared between Pods.

### Details for DRA Driver Authors

DRA drivers declare this node allocatable resource footprint using the
`nodeAllocatableResourceMappings` field on devices within a ResourceSlice.
This mapping translates the requested DRA device or capacity into standard
resources that are tracked in the node's `status.allocatable` (note that extended
resources are not supported for this mapping). This is useful both for drivers that directly
expose native resources (like a CPU or Memory DRA driver) and for devices that
require auxiliary node dependencies (like an accelerator that needs host memory).

This mapping defines the translation of the requested DRA device or capacity
units to the corresponding quantity of the node-allocatable resource. The
scheduler calculates the exact quantity using:

*   **Device-based scaling:** If `capacityKey` is not set, the
    `allocationMultiplier` multiplies the device count allocated to the claim.
    The `allocationMultiplier` defaults to 1 if not specified.
*   **Capacity-based scaling:** If `capacityKey` is set, it references a
    capacity name defined in the device's `capacity` map. The scheduler looks
    up the amount of that capacity consumed by the claim and multiplies it by
    the `allocationMultiplier`.

#### Example: CPU DRA Driver (Capacity-based scaling)

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
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # allocationMultiplier defaults to 1 if omitted
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # allocationMultiplier defaults to 1 if omitted
```

#### Example: Accelerator with Auxiliary Resources (Device-based scaling)

Here is an example of a resource slice where an accelerator requires an
additional 8Gi of memory per device instance to function:

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
    nodeAllocatableResourceMappings:
      memory:
        allocationMultiplier: "8Gi"
```

After a Pod is successfully bound to the node, the exact quantities of 
node-allocatable resources allocated via DRA are included in the Pod's
`status.nodeAllocatableResourceClaimStatuses` field.

Node-allocatable resources is controlled by the
[`DRANodeAllocatableResources` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources)
in the `kube-apiserver`, `kube-scheduler`, and `kubelet`. While this feature is alpha,
the `kubelet` does not account for these resources when determining QoS classes,
configuring cgroups, or making eviction decisions.

