---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver."
title: "ResourceSlice"
weight: 18
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

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`


## ResourceSlice {#ResourceSlice}

ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver. A pool may span more than one ResourceSlice, and exactly how many ResourceSlices comprise a pool is determined by the driver.

At the moment, the only supported resources are devices with attributes and capacities. Each device in a given pool, regardless of how many ResourceSlices, must have a unique name. The ResourceSlice in which a device gets published may change over time. The unique identifier for a device is the tuple \<driver name>, \<pool name>, \<device name>.

Whenever a driver needs to update a pool, it increments the pool.Spec.Pool.Generation number and updates all ResourceSlices with that new number and new resource definitions. A consumer must only use ResourceSlices with the highest generation number and ignore all others.

When allocating all resources in a pool matching certain criteria or when looking for the best solution among several different alternatives, a consumer should check the number of ResourceSlices in a pool (included in each ResourceSlice) to determine whether its view of a pool is complete and if not, should wait until the driver has completed updating the pool.

For resources that are not local to a node, the node name is not set. Instead, the driver may use a node selector to specify where the devices are available.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1


- **kind**: ResourceSlice


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), required

  Contains the information published by the driver.
  
  Changing the spec automatically increments the metadata.generation number.





## ResourceSliceSpec {#ResourceSliceSpec}

ResourceSliceSpec contains the information published by the driver in one ResourceSlice.

<hr>

- **driver** (string), required

  Driver identifies the DRA driver providing the capacity information. A field selector can be used to list only ResourceSlice objects with a certain driver name.
  
  Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver. This field is immutable.

- **pool** (ResourcePool), required

  Pool describes the pool that this ResourceSlice belongs to.

  <a name="ResourcePool"></a>
  *ResourcePool describes the pool that ResourceSlices belong to.*

  - **pool.generation** (int64), required

    Generation tracks the change in a pool over time. Whenever a driver changes something about one or more of the resources in a pool, it must change the generation in all ResourceSlices which are part of that pool. Consumers of ResourceSlices should only consider resources from the pool with the highest generation number. The generation may be reset by drivers, which should be fine for consumers, assuming that all ResourceSlices in a pool are updated to match or deleted.
    
    Combined with ResourceSliceCount, this mechanism enables consumers to detect pools which are comprised of multiple ResourceSlices and are in an incomplete state.

  - **pool.name** (string), required

    Name is used to identify the pool. For node-local devices, this is often the node name, but this is not required.
    
    It must not be longer than 253 characters and must consist of one or more DNS sub-domains separated by slashes. This field is immutable.

  - **pool.resourceSliceCount** (int64), required

    ResourceSliceCount is the total number of ResourceSlices in the pool at this generation number. Must be greater than zero.
    
    Consumers can use this to check whether they have seen all ResourceSlices belonging to the same pool.

- **allNodes** (boolean)

  AllNodes indicates that all nodes have access to the resources in the pool.
  
  Exactly one of NodeName, NodeSelector, AllNodes, and PerDeviceNodeSelection must be set.

- **devices** ([]Device)

  *Atomic: will be replaced during a merge*
  
  Devices lists some or all of the devices in this pool.
  
  Must not have more than 128 entries.

  <a name="Device"></a>
  *Device represents one individual hardware instance that can be selected based on its attributes. Besides the name, exactly one field must be set.*

  - **devices.name** (string), required

    Name is unique identifier among all devices managed by the driver in the pool. It must be a DNS label.

  - **devices.allNodes** (boolean)

    AllNodes indicates that all nodes have access to the device.
    
    Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.

  - **devices.allowMultipleAllocations** (boolean)

    AllowMultipleAllocations marks whether the device is allowed to be allocated to multiple DeviceRequests.
    
    If AllowMultipleAllocations is set to true, the device can be allocated more than once, and all of its capacity is consumable, regardless of whether the requestPolicy is defined or not.

  - **devices.attributes** (map[string]DeviceAttribute)

    Attributes defines the set of attributes for this device. The name of each attribute must be unique in that set.
    
    The maximum number of attributes and capacities combined is 32.

    <a name="DeviceAttribute"></a>
    *DeviceAttribute must have exactly one field set.*

    - **devices.attributes.bool** (boolean)

      BoolValue is a true/false value.

    - **devices.attributes.int** (int64)

      IntValue is a number.

    - **devices.attributes.string** (string)

      StringValue is a string. Must not be longer than 64 characters.

    - **devices.attributes.version** (string)

      VersionValue is a semantic version according to semver.org spec 2.0.0. Must not be longer than 64 characters.

  - **devices.bindingConditions** ([]string)

    *Atomic: will be replaced during a merge*
    
    BindingConditions defines the conditions for proceeding with binding. All of these conditions must be set in the per-device status conditions with a value of True to proceed with binding the pod to the node while scheduling the pod.
    
    The maximum number of binding conditions is 4.
    
    The conditions must be a valid condition type string.
    
    This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.

  - **devices.bindingFailureConditions** ([]string)

    *Atomic: will be replaced during a merge*
    
    BindingFailureConditions defines the conditions for binding failure. They may be set in the per-device status conditions. If any is set to "True", a binding failure occurred.
    
    The maximum number of binding failure conditions is 4.
    
    The conditions must be a valid condition type string.
    
    This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.

  - **devices.bindsToNode** (boolean)

    BindsToNode indicates if the usage of an allocation involving this device has to be limited to exactly the node that was chosen when allocating the claim. If set to true, the scheduler will set the ResourceClaim.Status.Allocation.NodeSelector to match the node where the allocation was made.
    
    This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.

  - **devices.capacity** (map[string]DeviceCapacity)

    Capacity defines the set of capacities for this device. The name of each capacity must be unique in that set.
    
    The maximum number of attributes and capacities combined is 32.

    <a name="DeviceCapacity"></a>
    *DeviceCapacity describes a quantity associated with a device.*

    - **devices.capacity.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), required

      Value defines how much of a certain capacity that device has.
      
      This field reflects the fixed total capacity and does not change. The consumed amount is tracked separately by scheduler and does not affect this value.

    - **devices.capacity.requestPolicy** (CapacityRequestPolicy)

      RequestPolicy defines how this DeviceCapacity must be consumed when the device is allowed to be shared by multiple allocations.
      
      The Device must have allowMultipleAllocations set to true in order to set a requestPolicy.
      
      If unset, capacity requests are unconstrained: requests can consume any amount of capacity, as long as the total consumed across all allocations does not exceed the device's defined capacity. If request is also unset, default is the full capacity value.

      <a name="CapacityRequestPolicy"></a>
      *CapacityRequestPolicy defines how requests consume device capacity.
      
      Must not set more than one ValidRequestValues.*

      - **devices.capacity.requestPolicy.default** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        Default specifies how much of this capacity is consumed by a request that does not contain an entry for it in DeviceRequest's Capacity.

      - **devices.capacity.requestPolicy.validRange** (CapacityRequestPolicyRange)

        ValidRange defines an acceptable quantity value range in consuming requests.
        
        If this field is set, Default must be defined and it must fall within the defined ValidRange.
        
        If the requested amount does not fall within the defined range, the request violates the policy, and this device cannot be allocated.
        
        If the request doesn't contain this capacity entry, Default value is used.

        <a name="CapacityRequestPolicyRange"></a>
        *CapacityRequestPolicyRange defines a valid range for consumable capacity values.
        
          - If the requested amount is less than Min, it is rounded up to the Min value.
          - If Step is set and the requested amount is between Min and Max but not aligned with Step,
            it will be rounded up to the next value equal to Min + (n * Step).
          - If Step is not set, the requested amount is used as-is if it falls within the range Min to Max (if set).
          - If the requested or rounded amount exceeds Max (if set), the request does not satisfy the policy,
            and the device cannot be allocated.*

        - **devices.capacity.requestPolicy.validRange.min** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), required

          Min specifies the minimum capacity allowed for a consumption request.
          
          Min must be greater than or equal to zero, and less than or equal to the capacity value. requestPolicy.default must be more than or equal to the minimum.

        - **devices.capacity.requestPolicy.validRange.max** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Max defines the upper limit for capacity that can be requested.
          
          Max must be less than or equal to the capacity value. Min and requestPolicy.default must be less than or equal to the maximum.

        - **devices.capacity.requestPolicy.validRange.step** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Step defines the step size between valid capacity amounts within the range.
          
          Max (if set) and requestPolicy.default must be a multiple of Step. Min + Step must be less than or equal to the capacity value.

      - **devices.capacity.requestPolicy.validValues** ([]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        *Atomic: will be replaced during a merge*
        
        ValidValues defines a set of acceptable quantity values in consuming requests.
        
        Must not contain more than 10 entries. Must be sorted in ascending order.
        
        If this field is set, Default must be defined and it must be included in ValidValues list.
        
        If the requested amount does not match any valid value but smaller than some valid values, the scheduler calculates the smallest valid value that is greater than or equal to the request. That is: min(ceil(requestedValue) ∈ validValues), where requestedValue ≤ max(validValues).
        
        If the requested amount exceeds all valid values, the request violates the policy, and this device cannot be allocated.

  - **devices.consumesCounters** ([]DeviceCounterConsumption)

    *Atomic: will be replaced during a merge*
    
    ConsumesCounters defines a list of references to sharedCounters and the set of counters that the device will consume from those counter sets.
    
    There can only be a single entry per counterSet.
    
    The total number of device counter consumption entries must be \<= 32. In addition, the total number in the entire ResourceSlice must be \<= 1024 (for example, 64 devices with 16 counters each).

    <a name="DeviceCounterConsumption"></a>
    *DeviceCounterConsumption defines a set of counters that a device will consume from a CounterSet.*

    - **devices.consumesCounters.counterSet** (string), required

      CounterSet is the name of the set from which the counters defined will be consumed.

    - **devices.consumesCounters.counters** (map[string]Counter), required

      Counters defines the counters that will be consumed by the device.
      
      The maximum number counters in a device is 32. In addition, the maximum number of all counters in all devices is 1024 (for example, 64 devices with 16 counters each).

      <a name="Counter"></a>
      *Counter describes a quantity associated with a device.*

      - **devices.consumesCounters.counters.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), required

        Value defines how much of a certain device counter is available.

  - **devices.nodeName** (string)

    NodeName identifies the node where the device is available.
    
    Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.

  - **devices.nodeSelector** (NodeSelector)

    NodeSelector defines the nodes where the device is available.
    
    Must use exactly one term.
    
    Must only be set if Spec.PerDeviceNodeSelection is set to true. At most one of NodeName, NodeSelector and AllNodes can be set.

    <a name="NodeSelector"></a>
    *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

    - **devices.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

      *Atomic: will be replaced during a merge*
      
      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

      - **devices.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's labels.

      - **devices.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's fields.

  - **devices.taints** ([]DeviceTaint)

    *Atomic: will be replaced during a merge*
    
    If specified, these are the driver-defined taints.
    
    The maximum number of taints is 4.
    
    This is an alpha field and requires enabling the DRADeviceTaints feature gate.

    <a name="DeviceTaint"></a>
    *The device this taint is attached to has the "effect" on any claim which does not tolerate the taint and, through the claim, to pods using the claim.*

    - **devices.taints.effect** (string), required

      The effect of the taint on claims that do not tolerate the taint and through such claims on the pods using them. Valid effects are NoSchedule and NoExecute. PreferNoSchedule as used for nodes is not valid here.

    - **devices.taints.key** (string), required

      The taint key to be applied to a device. Must be a label name.

    - **devices.taints.timeAdded** (Time)

      TimeAdded represents the time at which the taint was added. Added automatically during create or update if not set.

      <a name="Time"></a>
      *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **devices.taints.value** (string)

      The taint value corresponding to the taint key. Must be a label value.

- **nodeName** (string)

  NodeName identifies the node which provides the resources in this pool. A field selector can be used to list only ResourceSlice objects belonging to a certain node.
  
  This field can be used to limit access from nodes to ResourceSlices with the same node name. It also indicates to autoscalers that adding new nodes of the same type as some old node might also make new resources available.
  
  Exactly one of NodeName, NodeSelector, AllNodes, and PerDeviceNodeSelection must be set. This field is immutable.

- **nodeSelector** (NodeSelector)

  NodeSelector defines which nodes have access to the resources in the pool, when that pool is not limited to a single node.
  
  Must use exactly one term.
  
  Exactly one of NodeName, NodeSelector, AllNodes, and PerDeviceNodeSelection must be set.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.

- **perDeviceNodeSelection** (boolean)

  PerDeviceNodeSelection defines whether the access from nodes to resources in the pool is set on the ResourceSlice level or on each device. If it is set to true, every device defined the ResourceSlice must specify this individually.
  
  Exactly one of NodeName, NodeSelector, AllNodes, and PerDeviceNodeSelection must be set.

- **sharedCounters** ([]CounterSet)

  *Atomic: will be replaced during a merge*
  
  SharedCounters defines a list of counter sets, each of which has a name and a list of counters available.
  
  The names of the SharedCounters must be unique in the ResourceSlice.
  
  The maximum number of counters in all sets is 32.

  <a name="CounterSet"></a>
  *CounterSet defines a named set of counters that are available to be used by devices defined in the ResourceSlice.
  
  The counters are not allocatable by themselves, but can be referenced by devices. When a device is allocated, the portion of counters it uses will no longer be available for use by other devices.*

  - **sharedCounters.counters** (map[string]Counter), required

    Counters defines the set of counters for this CounterSet The name of each counter must be unique in that set and must be a DNS label.
    
    The maximum number of counters in all sets is 32.

    <a name="Counter"></a>
    *Counter describes a quantity associated with a device.*

    - **sharedCounters.counters.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), required

      Value defines how much of a certain device counter is available.

  - **sharedCounters.name** (string), required

    Name defines the name of the counter set. It must be a DNS label.





## ResourceSliceList {#ResourceSliceList}

ResourceSliceList is a collection of ResourceSlices.

<hr>

- **apiVersion**: resource.k8s.io/v1


- **kind**: ResourceSliceList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>), required

  Items is the list of resource ResourceSlices.





## Operations {#Operations}



<hr>






### `get` read the specified ResourceSlice

#### HTTP Request

GET /apis/resource.k8s.io/v1/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceSlice

#### HTTP Request

GET /apis/resource.k8s.io/v1/resourceslices

#### Parameters


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized


### `create` create a ResourceSlice

#### HTTP Request

POST /apis/resource.k8s.io/v1/resourceslices

#### Parameters


- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceSlice

#### HTTP Request

PUT /apis/resource.k8s.io/v1/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceSlice

#### HTTP Request

PATCH /apis/resource.k8s.io/v1/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized


### `delete` delete a ResourceSlice

#### HTTP Request

DELETE /apis/resource.k8s.io/v1/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceSlice

#### HTTP Request

DELETE /apis/resource.k8s.io/v1/resourceslices

#### Parameters


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

