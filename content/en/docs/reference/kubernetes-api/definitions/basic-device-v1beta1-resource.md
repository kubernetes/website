---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta1"
  import: "k8s.io/api/resource/v1beta1"
  kind: "BasicDevice"
content_type: "api_reference"
description: "BasicDevice defines one device instance."
title: "BasicDevice"
weight: 50
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: resource.k8s.io/v1beta1`

`import "k8s.io/api/resource/v1beta1"`


## BasicDevice {#BasicDevice}

BasicDevice defines one device instance.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allNodes</code><br/><em>boolean</em></td>
      <td>AllNodes indicates that all nodes have access to the device.  Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.</td>
    </tr>
    <tr>
      <td><code>allowMultipleAllocations</code><br/><em>boolean</em></td>
      <td>AllowMultipleAllocations marks whether the device is allowed to be allocated to multiple DeviceRequests.  If AllowMultipleAllocations is set to true, the device can be allocated more than once, and all of its capacity is consumable, regardless of whether the requestPolicy is defined or not.</td>
    </tr>
    <tr>
      <td><code>attributes</code><br/><em>object</em></td>
      <td>Attributes defines the set of attributes for this device. The name of each attribute must be unique in that set.  The maximum number of attributes and capacities combined is 32.</td>
    </tr>
    <tr>
      <td><code>bindingConditions</code><br/><em>string array</em></td>
      <td>BindingConditions defines the conditions for proceeding with binding. All of these conditions must be set in the per-device status conditions with a value of True to proceed with binding the pod to the node while scheduling the pod.  The maximum number of binding conditions is 4.  The conditions must be a valid condition type string.  This is a beta field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.</td>
    </tr>
    <tr>
      <td><code>bindingFailureConditions</code><br/><em>string array</em></td>
      <td>BindingFailureConditions defines the conditions for binding failure. They may be set in the per-device status conditions. If any is true, a binding failure occurred.  The maximum number of binding failure conditions is 4.  The conditions must be a valid condition type string.  This is a beta field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.</td>
    </tr>
    <tr>
      <td><code>bindsToNode</code><br/><em>boolean</em></td>
      <td>BindsToNode indicates if the usage of an allocation involving this device has to be limited to exactly the node that was chosen when allocating the claim. If set to true, the scheduler will set the ResourceClaim.Status.Allocation.NodeSelector to match the node where the allocation was made.  This is a beta field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.</td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em>object</em></td>
      <td>Capacity defines the set of capacities for this device. The name of each capacity must be unique in that set.  The maximum number of attributes and capacities combined is 32.</td>
    </tr>
    <tr>
      <td><code>consumesCounters</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#DeviceCounterConsumption" >}}">DeviceCounterConsumption array</a></em></td>
      <td>ConsumesCounters defines a list of references to sharedCounters and the set of counters that the device will consume from those counter sets.  There can only be a single entry per counterSet.  The maximum number of device counter consumptions per device is 2.</td>
    </tr>
    <tr>
      <td><code>nodeAllocatableResourceMappings</code><br/><em>object</em></td>
      <td>NodeAllocatableResourceMappings defines the mapping of node resources that are managed by the DRA driver exposing this device. This includes resources currently reported in v1.Node `status.allocatable` that are not extended resources (see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources). Examples include "cpu", "memory", "ephemeral-storage", and hugepages. In addition to standard requests made through the Pod `spec`, these resources can also be requested through claims and allocated by the DRA driver. For example, a CPU DRA driver might allocate exclusive CPUs or auxiliary node memory dependencies of an accelerator device. The keys of this map are the node-allocatable resource names (e.g., "cpu", "memory"). Extended resource names are not permitted as keys.</td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td>NodeName identifies the node where the device is available.  Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.</td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em><a href="{{< ref "node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>NodeSelector defines the nodes where the device is available.  Must use exactly one term.  Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.</td>
    </tr>
    <tr>
      <td><code>taints</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#DeviceTaint" >}}">DeviceTaint array</a></em></td>
      <td>If specified, these are the driver-defined taints.  The maximum number of taints is 16. If taints are set for any device in a ResourceSlice, then the maximum number of allowed devices per ResourceSlice is 64 instead of 128.  This is a beta field and requires enabling the DRADeviceTaints feature gate.</td>
    </tr>
  </tbody>
</table>









