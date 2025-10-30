---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim describes a request for access to resources in the cluster, for use by workloads."
title: "ResourceClaim"
weight: 16
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


## ResourceClaim {#ResourceClaim}

ResourceClaim describes a request for access to resources in the cluster, for use by workloads. For example, if a workload needs an accelerator device with specific properties, this is how that request is expressed. The status stanza tracks whether this claim has been satisfied and what specific resources have been allocated.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1


- **kind**: ResourceClaim


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes what is being requested and how to configure it. The spec is immutable.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the claim is ready to use and what has been allocated.





## ResourceClaimSpec {#ResourceClaimSpec}

ResourceClaimSpec defines what is being requested in a ResourceClaim and how to configure it.

<hr>

- **devices** (DeviceClaim)

  Devices defines how to request devices.

  <a name="DeviceClaim"></a>
  *DeviceClaim defines how to request devices with a ResourceClaim.*

  - **devices.config** ([]DeviceClaimConfiguration)

    *Atomic: will be replaced during a merge*
    
    This field holds configuration for multiple potential drivers which could satisfy requests in this claim. It is ignored while allocating the claim.

    <a name="DeviceClaimConfiguration"></a>
    *DeviceClaimConfiguration is used for configuration parameters in DeviceClaim.*

    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      Opaque provides driver-specific configuration parameters.

      <a name="OpaqueDeviceConfiguration"></a>
      *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*

      - **devices.config.opaque.driver** (string), required

        Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
        
        An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.

      - **devices.config.opaque.parameters** (RawExtension), required

        Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.
        
        The length of the raw data must be smaller or equal to 10 Ki.

        <a name="RawExtension"></a>
        *RawExtension is used to hold extensions in external versions.
        
        To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
        
        // Internal package:
        
        	type MyAPIObject struct {
        		runtime.TypeMeta `json:",inline"`
        		MyPlugin runtime.Object `json:"myPlugin"`
        	}
        
        	type PluginA struct {
        		AOption string `json:"aOption"`
        	}
        
        // External package:
        
        	type MyAPIObject struct {
        		runtime.TypeMeta `json:",inline"`
        		MyPlugin runtime.RawExtension `json:"myPlugin"`
        	}
        
        	type PluginA struct {
        		AOption string `json:"aOption"`
        	}
        
        // On the wire, the JSON will look something like this:
        
        	{
        		"kind":"MyAPIObject",
        		"apiVersion":"v1",
        		"myPlugin": {
        			"kind":"PluginA",
        			"aOption":"foo",
        		},
        	}
        
        So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*

    - **devices.config.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests lists the names of requests where the configuration applies. If empty, it applies to all requests.
      
      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.

  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: will be replaced during a merge*
    
    These constraints must be satisfied by the set of devices that get allocated for the claim.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint must have exactly one field set besides Requests.*

    - **devices.constraints.distinctAttribute** (string)

      DistinctAttribute requires that all devices in question have this attribute and that its type and value are unique across those devices.
      
      This acts as the inverse of MatchAttribute.
      
      This constraint is used to avoid allocating multiple requests to the same device by ensuring attribute-level differentiation.
      
      This is useful for scenarios where resource requests must be fulfilled by separate physical devices. For example, a container requests two network interfaces that must be allocated from two different physical NICs.

    - **devices.constraints.matchAttribute** (string)

      MatchAttribute requires that all devices in question have this attribute and that its type and value are the same across those devices.
      
      For example, if you specified "dra.example.com/numa" (a hypothetical example!), then only devices in the same NUMA node will be chosen. A device which does not have that attribute will not be chosen. All devices should use a value of the same type for this attribute because that is part of its specification, but if one device doesn't, then it also will not be chosen.
      
      Must include the domain qualifier.

    - **devices.constraints.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests is a list of the one or more requests in this claim which must co-satisfy this constraint. If a request is fulfilled by multiple devices, then all of the devices must satisfy the constraint. If this is not specified, this constraint applies to all requests in this claim.
      
      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the constraint applies to all subrequests.

  - **devices.requests** ([]DeviceRequest)

    *Atomic: will be replaced during a merge*
    
    Requests represent individual requests for distinct devices which must all be satisfied. If empty, nothing needs to be allocated.

    <a name="DeviceRequest"></a>
    *DeviceRequest is a request for devices required for a claim. This is typically a request for a single resource like a device, but can also ask for several identical devices. With FirstAvailable it is also possible to provide a prioritized list of requests.*

    - **devices.requests.name** (string), required

      Name can be used to reference this request in a pod.spec.containers[].resources.claims entry and in a constraint of the claim.
      
      References using the name in the DeviceRequest will uniquely identify a request when the Exactly field is set. When the FirstAvailable field is set, a reference to the name of the DeviceRequest will match whatever subrequest is chosen by the scheduler.
      
      Must be a DNS label.

    - **devices.requests.exactly** (ExactDeviceRequest)

      Exactly specifies the details for a single request that must be met exactly for the request to be satisfied.
      
      One of Exactly or FirstAvailable must be set.

      <a name="ExactDeviceRequest"></a>
      *ExactDeviceRequest is a request for one or more identical devices.*

      - **devices.requests.exactly.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this request.
        
        A DeviceClassName is required.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.

      - **devices.requests.exactly.adminAccess** (boolean)

        AdminAccess indicates that this is a claim for administrative access to the device(s). Claims with AdminAccess are expected to be used for monitoring or other management services for a device.  They ignore all ordinary claims to the device with respect to access modes and any resource allocations.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.

      - **devices.requests.exactly.allocationMode** (string)

        AllocationMode and its related fields define how devices are allocated to satisfy this request. Supported values are:
        
        - ExactCount: This request is for a specific number of devices.
          This is the default. The exact number is provided in the
          count field.
        
        - All: This request is for all of the matching devices in a pool.
          At least one device must exist on the node for the allocation to succeed.
          Allocation will fail if some devices are already allocated,
          unless adminAccess is requested.
        
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other requests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.

      - **devices.requests.exactly.capacity** (CapacityRequirements)

        Capacity define resource requirements against each capacity.
        
        If this field is unset and the device supports multiple allocations, the default value will be applied to each capacity according to requestPolicy. For the capacity that has no requestPolicy, default is the full capacity value.
        
        Applies to each device allocation. If Count > 1, the request fails if there aren't enough devices that meet the requirements. If AllocationMode is set to All, the request fails if there are devices that otherwise match the request, and have this capacity, with a value >= the requested amount, but which cannot be allocated to this request.

        <a name="CapacityRequirements"></a>
        *CapacityRequirements defines the capacity requirements for a specific device request.*

        - **devices.requests.exactly.capacity.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Requests represent individual device resource requests for distinct resources, all of which must be provided by the device.
          
          This value is used as an additional filtering condition against the available capacity on the device. This is semantically equivalent to a CEL selector with `device.capacity[\<domain>].\<name>.compareTo(quantity(\<request quantity>)) >= 0`. For example, device.capacity['test-driver.cdi.k8s.io'].counters.compareTo(quantity('2')) >= 0.
          
          When a requestPolicy is defined, the requested amount is adjusted upward to the nearest valid value based on the policy. If the requested amount cannot be adjusted to a valid value—because it exceeds what the requestPolicy allows— the device is considered ineligible for allocation.
          
          For any capacity that is not explicitly requested: - If no requestPolicy is set, the default consumed capacity is equal to the full device capacity
            (i.e., the whole device is claimed).
          - If a requestPolicy is set, the default consumed capacity is determined according to that policy.
          
          If the device allows multiple allocation, the aggregated amount across all requests must not exceed the capacity value. The consumed capacity, which may be adjusted based on the requestPolicy if defined, is recorded in the resource claim’s status.devices[*].consumedCapacity field.

      - **devices.requests.exactly.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.

      - **devices.requests.exactly.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this request. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*

        - **devices.requests.exactly.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*

          - **devices.requests.exactly.selectors.cel.expression** (string), required

            Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
            
            The expression's input is an object named "device", which carries the following properties:
             - driver (string): the name of the driver which defines this device.
             - attributes (map[string]object): the device's attributes, grouped by prefix
               (e.g. device.attributes["dra.example.com"] evaluates to an object with all
               of the attributes which were prefixed by "dra.example.com".
             - capacity (map[string]object): the device's capacities, grouped by prefix.
             - allowMultipleAllocations (bool): the allowMultipleAllocations property of the device
               (v1.34+ with the DRAConsumableCapacity feature enabled).
            
            Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
            
                device.driver
                device.attributes["dra.example.com"].model
                device.attributes["ext.example.com"].family
                device.capacity["dra.example.com"].modules
            
            The device.driver field can be used to check for a specific driver, either as a high-level precondition (i.e. you only want to consider devices from this driver) or as part of a multi-clause expression that is meant to consider devices from different drivers.
            
            The value type of each attribute is defined by the device definition, and users who write these expressions must consult the documentation for their specific drivers. The value type of each capacity is Quantity.
            
            If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
            
            A robust expression should check for the existence of attributes before referencing them.
            
            For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
            
                cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
            
            The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.

      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
        
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*

        - **devices.requests.exactly.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.
          
          
          Possible enum values:
           - `"NoExecute"` Evict any already-running pods that do not tolerate the device taint.
           - `"NoSchedule"` Do not allow new pods to schedule which use a tainted device unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running.

        - **devices.requests.exactly.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.

        - **devices.requests.exactly.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
          
          
          Possible enum values:
           - `"Equal"`
           - `"Exists"`

        - **devices.requests.exactly.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.

        - **devices.requests.exactly.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.

    - **devices.requests.firstAvailable** ([]DeviceSubRequest)

      *Atomic: will be replaced during a merge*
      
      FirstAvailable contains subrequests, of which exactly one will be selected by the scheduler. It tries to satisfy them in the order in which they are listed here. So if there are two entries in the list, the scheduler will only check the second one if it determines that the first one can not be used.
      
      DRA does not yet implement scoring, so the scheduler will select the first set of devices that satisfies all the requests in the claim. And if the requirements can be satisfied on more than one node, other scheduling features will determine which node is chosen. This means that the set of devices allocated to a claim might not be the optimal set available to the cluster. Scoring will be implemented later.

      <a name="DeviceSubRequest"></a>
      *DeviceSubRequest describes a request for device provided in the claim.spec.devices.requests[].firstAvailable array. Each is typically a request for a single resource like a device, but can also ask for several identical devices.
      
      DeviceSubRequest is similar to ExactDeviceRequest, but doesn't expose the AdminAccess field as that one is only supported when requesting a specific device.*

      - **devices.requests.firstAvailable.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this subrequest.
        
        A class is required. Which classes are available depends on the cluster.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.

      - **devices.requests.firstAvailable.name** (string), required

        Name can be used to reference this subrequest in the list of constraints or the list of configurations for the claim. References must use the format \<main request>/\<subrequest>.
        
        Must be a DNS label.

      - **devices.requests.firstAvailable.allocationMode** (string)

        AllocationMode and its related fields define how devices are allocated to satisfy this subrequest. Supported values are:
        
        - ExactCount: This request is for a specific number of devices.
          This is the default. The exact number is provided in the
          count field.
        
        - All: This subrequest is for all of the matching devices in a pool.
          Allocation will fail if some devices are already allocated,
          unless adminAccess is requested.
        
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other subrequests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.

      - **devices.requests.firstAvailable.capacity** (CapacityRequirements)

        Capacity define resource requirements against each capacity.
        
        If this field is unset and the device supports multiple allocations, the default value will be applied to each capacity according to requestPolicy. For the capacity that has no requestPolicy, default is the full capacity value.
        
        Applies to each device allocation. If Count > 1, the request fails if there aren't enough devices that meet the requirements. If AllocationMode is set to All, the request fails if there are devices that otherwise match the request, and have this capacity, with a value >= the requested amount, but which cannot be allocated to this request.

        <a name="CapacityRequirements"></a>
        *CapacityRequirements defines the capacity requirements for a specific device request.*

        - **devices.requests.firstAvailable.capacity.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Requests represent individual device resource requests for distinct resources, all of which must be provided by the device.
          
          This value is used as an additional filtering condition against the available capacity on the device. This is semantically equivalent to a CEL selector with `device.capacity[\<domain>].\<name>.compareTo(quantity(\<request quantity>)) >= 0`. For example, device.capacity['test-driver.cdi.k8s.io'].counters.compareTo(quantity('2')) >= 0.
          
          When a requestPolicy is defined, the requested amount is adjusted upward to the nearest valid value based on the policy. If the requested amount cannot be adjusted to a valid value—because it exceeds what the requestPolicy allows— the device is considered ineligible for allocation.
          
          For any capacity that is not explicitly requested: - If no requestPolicy is set, the default consumed capacity is equal to the full device capacity
            (i.e., the whole device is claimed).
          - If a requestPolicy is set, the default consumed capacity is determined according to that policy.
          
          If the device allows multiple allocation, the aggregated amount across all requests must not exceed the capacity value. The consumed capacity, which may be adjusted based on the requestPolicy if defined, is recorded in the resource claim’s status.devices[*].consumedCapacity field.

      - **devices.requests.firstAvailable.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.

      - **devices.requests.firstAvailable.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this subrequest. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*

        - **devices.requests.firstAvailable.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*

          - **devices.requests.firstAvailable.selectors.cel.expression** (string), required

            Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
            
            The expression's input is an object named "device", which carries the following properties:
             - driver (string): the name of the driver which defines this device.
             - attributes (map[string]object): the device's attributes, grouped by prefix
               (e.g. device.attributes["dra.example.com"] evaluates to an object with all
               of the attributes which were prefixed by "dra.example.com".
             - capacity (map[string]object): the device's capacities, grouped by prefix.
             - allowMultipleAllocations (bool): the allowMultipleAllocations property of the device
               (v1.34+ with the DRAConsumableCapacity feature enabled).
            
            Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
            
                device.driver
                device.attributes["dra.example.com"].model
                device.attributes["ext.example.com"].family
                device.capacity["dra.example.com"].modules
            
            The device.driver field can be used to check for a specific driver, either as a high-level precondition (i.e. you only want to consider devices from this driver) or as part of a multi-clause expression that is meant to consider devices from different drivers.
            
            The value type of each attribute is defined by the device definition, and users who write these expressions must consult the documentation for their specific drivers. The value type of each capacity is Quantity.
            
            If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
            
            A robust expression should check for the existence of attributes before referencing them.
            
            For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
            
                cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
            
            The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.

      - **devices.requests.firstAvailable.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
        
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*

        - **devices.requests.firstAvailable.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.
          
          
          Possible enum values:
           - `"NoExecute"` Evict any already-running pods that do not tolerate the device taint.
           - `"NoSchedule"` Do not allow new pods to schedule which use a tainted device unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running.

        - **devices.requests.firstAvailable.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.

        - **devices.requests.firstAvailable.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
          
          
          Possible enum values:
           - `"Equal"`
           - `"Exists"`

        - **devices.requests.firstAvailable.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.

        - **devices.requests.firstAvailable.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.





## ResourceClaimStatus {#ResourceClaimStatus}

ResourceClaimStatus tracks whether the resource has been allocated and what the result of that was.

<hr>

- **allocation** (AllocationResult)

  Allocation is set once the claim has been allocated successfully.

  <a name="AllocationResult"></a>
  *AllocationResult contains attributes of an allocated resource.*

  - **allocation.allocationTimestamp** (Time)

    AllocationTimestamp stores the time when the resources were allocated. This field is not guaranteed to be set, in which case that time is unknown.
    
    This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gate.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **allocation.devices** (DeviceAllocationResult)

    Devices is the result of allocating devices.

    <a name="DeviceAllocationResult"></a>
    *DeviceAllocationResult is the result of allocating devices.*

    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      *Atomic: will be replaced during a merge*
      
      This field is a combination of all the claim and class configuration parameters. Drivers can distinguish between those based on a flag.
      
      This includes configuration parameters for drivers which have no allocated devices in the result because it is up to the drivers which configuration parameters they support. They can silently ignore unknown configuration parameters.

      <a name="DeviceAllocationConfiguration"></a>
      *DeviceAllocationConfiguration gets embedded in an AllocationResult.*

      - **allocation.devices.config.source** (string), required

        Source records whether the configuration comes from a class and thus is not something that a normal user would have been able to set or from a claim.

      - **allocation.devices.config.opaque** (OpaqueDeviceConfiguration)

        Opaque provides driver-specific configuration parameters.

        <a name="OpaqueDeviceConfiguration"></a>
        *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*

        - **allocation.devices.config.opaque.driver** (string), required

          Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
          
          An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
          
          Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.

        - **allocation.devices.config.opaque.parameters** (RawExtension), required

          Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.
          
          The length of the raw data must be smaller or equal to 10 Ki.

          <a name="RawExtension"></a>
          *RawExtension is used to hold extensions in external versions.
          
          To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
          
          // Internal package:
          
          	type MyAPIObject struct {
          		runtime.TypeMeta `json:",inline"`
          		MyPlugin runtime.Object `json:"myPlugin"`
          	}
          
          	type PluginA struct {
          		AOption string `json:"aOption"`
          	}
          
          // External package:
          
          	type MyAPIObject struct {
          		runtime.TypeMeta `json:",inline"`
          		MyPlugin runtime.RawExtension `json:"myPlugin"`
          	}
          
          	type PluginA struct {
          		AOption string `json:"aOption"`
          	}
          
          // On the wire, the JSON will look something like this:
          
          	{
          		"kind":"MyAPIObject",
          		"apiVersion":"v1",
          		"myPlugin": {
          			"kind":"PluginA",
          			"aOption":"foo",
          		},
          	}
          
          So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*

      - **allocation.devices.config.requests** ([]string)

        *Atomic: will be replaced during a merge*
        
        Requests lists the names of requests where the configuration applies. If empty, its applies to all requests.
        
        References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.

    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      *Atomic: will be replaced during a merge*
      
      Results lists all allocated devices.

      <a name="DeviceRequestAllocationResult"></a>
      *DeviceRequestAllocationResult contains the allocation result for one request.*

      - **allocation.devices.results.device** (string), required

        Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

      - **allocation.devices.results.driver** (string), required

        Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.

      - **allocation.devices.results.pool** (string), required

        This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
        
        Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.

      - **allocation.devices.results.request** (string), required

        Request is the name of the request in the claim which caused this device to be allocated. If it references a subrequest in the firstAvailable list on a DeviceRequest, this field must include both the name of the main request and the subrequest using the format \<main request>/\<subrequest>.
        
        Multiple devices may have been allocated per request.

      - **allocation.devices.results.adminAccess** (boolean)

        AdminAccess indicates that this device was allocated for administrative access. See the corresponding request field for a definition of mode.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.

      - **allocation.devices.results.bindingConditions** ([]string)

        *Atomic: will be replaced during a merge*
        
        BindingConditions contains a copy of the BindingConditions from the corresponding ResourceSlice at the time of allocation.
        
        This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.

      - **allocation.devices.results.bindingFailureConditions** ([]string)

        *Atomic: will be replaced during a merge*
        
        BindingFailureConditions contains a copy of the BindingFailureConditions from the corresponding ResourceSlice at the time of allocation.
        
        This is an alpha field and requires enabling the DRADeviceBindingConditions and DRAResourceClaimDeviceStatus feature gates.

      - **allocation.devices.results.consumedCapacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        ConsumedCapacity tracks the amount of capacity consumed per device as part of the claim request. The consumed amount may differ from the requested amount: it is rounded up to the nearest valid value based on the device’s requestPolicy if applicable (i.e., may not be less than the requested amount).
        
        The total consumed capacity for each device must not exceed the DeviceCapacity's Value.
        
        This field is populated only for devices that allow multiple allocations. All capacity entries are included, even if the consumed amount is zero.

      - **allocation.devices.results.shareID** (string)

        ShareID uniquely identifies an individual allocation share of the device, used when the device supports multiple simultaneous allocations. It serves as an additional map key to differentiate concurrent shares of the same device.

      - **allocation.devices.results.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        A copy of all tolerations specified in the request at the time when the device got allocated.
        
        The maximum number of tolerations is 16.
        
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*

        - **allocation.devices.results.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.
          
          
          Possible enum values:
           - `"NoExecute"` Evict any already-running pods that do not tolerate the device taint.
           - `"NoSchedule"` Do not allow new pods to schedule which use a tainted device unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running.

        - **allocation.devices.results.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.

        - **allocation.devices.results.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
          
          
          Possible enum values:
           - `"Equal"`
           - `"Exists"`

        - **allocation.devices.results.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.

        - **allocation.devices.results.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.

  - **allocation.nodeSelector** (NodeSelector)

    NodeSelector defines where the allocated resources are available. If unset, they are available everywhere.

    <a name="NodeSelector"></a>
    *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

      *Atomic: will be replaced during a merge*
      
      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's labels.

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's fields.

- **devices** ([]AllocatedDeviceStatus)

  *Map: unique values on keys `driver, device, pool, shareID` will be kept during a merge*
  
  Devices contains the status of each device allocated for this claim, as reported by the driver. This can include driver-specific information. Entries are owned by their respective drivers.

  <a name="AllocatedDeviceStatus"></a>
  *AllocatedDeviceStatus contains the status of an allocated device, if the driver chooses to report it. This may include driver-specific information.
  
  The combination of Driver, Pool, Device, and ShareID must match the corresponding key in Status.Allocation.Devices.*

  - **devices.device** (string), required

    Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

  - **devices.driver** (string), required

    Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
    
    Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.

  - **devices.pool** (string), required

    This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
    
    Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.

  - **devices.conditions** ([]Condition)

    *Map: unique values on key type will be kept during a merge*
    
    Conditions contains the latest observation of the device's state. If the device has been configured according to the class and claim config references, the `Ready` condition should be True.
    
    Must not contain more than 8 entries.

    <a name="Condition"></a>
    *Condition contains details for one aspect of the current state of this API Resource.*

    - **devices.conditions.lastTransitionTime** (Time), required

      lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

      <a name="Time"></a>
      *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **devices.conditions.message** (string), required

      message is a human readable message indicating details about the transition. This may be an empty string.

    - **devices.conditions.reason** (string), required

      reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.

    - **devices.conditions.status** (string), required

      status of the condition, one of True, False, Unknown.

    - **devices.conditions.type** (string), required

      type of condition in CamelCase or in foo.example.com/CamelCase.

    - **devices.conditions.observedGeneration** (int64)

      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.

  - **devices.data** (RawExtension)

    Data contains arbitrary driver-specific data.
    
    The length of the raw data must be smaller or equal to 10 Ki.

    <a name="RawExtension"></a>
    *RawExtension is used to hold extensions in external versions.
    
    To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
    
    // Internal package:
    
    	type MyAPIObject struct {
    		runtime.TypeMeta `json:",inline"`
    		MyPlugin runtime.Object `json:"myPlugin"`
    	}
    
    	type PluginA struct {
    		AOption string `json:"aOption"`
    	}
    
    // External package:
    
    	type MyAPIObject struct {
    		runtime.TypeMeta `json:",inline"`
    		MyPlugin runtime.RawExtension `json:"myPlugin"`
    	}
    
    	type PluginA struct {
    		AOption string `json:"aOption"`
    	}
    
    // On the wire, the JSON will look something like this:
    
    	{
    		"kind":"MyAPIObject",
    		"apiVersion":"v1",
    		"myPlugin": {
    			"kind":"PluginA",
    			"aOption":"foo",
    		},
    	}
    
    So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*

  - **devices.networkData** (NetworkDeviceData)

    NetworkData contains network-related information specific to the device.

    <a name="NetworkDeviceData"></a>
    *NetworkDeviceData provides network-related details for the allocated device. This information may be filled by drivers or other components to configure or identify the device within a network context.*

    - **devices.networkData.hardwareAddress** (string)

      HardwareAddress represents the hardware address (e.g. MAC Address) of the device's network interface.
      
      Must not be longer than 128 characters.

    - **devices.networkData.interfaceName** (string)

      InterfaceName specifies the name of the network interface associated with the allocated device. This might be the name of a physical or virtual network interface being configured in the pod.
      
      Must not be longer than 256 characters.

    - **devices.networkData.ips** ([]string)

      *Atomic: will be replaced during a merge*
      
      IPs lists the network addresses assigned to the device's network interface. This can include both IPv4 and IPv6 addresses. The IPs are in the CIDR notation, which includes both the address and the associated subnet mask. e.g.: "192.0.2.5/24" for IPv4 and "2001:db8::5/64" for IPv6.

  - **devices.shareID** (string)

    ShareID uniquely identifies an individual allocation share of the device.

- **reservedFor** ([]ResourceClaimConsumerReference)

  *Patch strategy: merge on key `uid`*
  
  *Map: unique values on key uid will be kept during a merge*
  
  ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started. A claim that is in use or might be in use because it has been reserved must not get deallocated.
  
  In a cluster with multiple scheduler instances, two pods might get scheduled concurrently by different schedulers. When they reference the same ResourceClaim which already has reached its maximum number of consumers, only one pod can be scheduled.
  
  Both schedulers try to add their pod to the claim.status.reservedFor field, but only the update that reaches the API server first gets stored. The other one fails with an error and the scheduler which issued it knows that it must put the pod back into the queue, waiting for the ResourceClaim to become usable again.
  
  There can be at most 256 such reservations. This may get increased in the future, but not reduced.

  <a name="ResourceClaimConsumerReference"></a>
  *ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim.*

  - **reservedFor.name** (string), required

    Name is the name of resource being referenced.

  - **reservedFor.resource** (string), required

    Resource is the type of resource being referenced, for example "pods".

  - **reservedFor.uid** (string), required

    UID identifies exactly one incarnation of the resource.

  - **reservedFor.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.





## ResourceClaimList {#ResourceClaimList}

ResourceClaimList is a collection of claims.

<hr>

- **apiVersion**: resource.k8s.io/v1


- **kind**: ResourceClaimList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.





## Operations {#Operations}



<hr>






### `get` read the specified ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized


### `get` read status of the specified ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1/resourceclaims

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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized


### `create` create a ResourceClaim

#### HTTP Request

POST /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceClaim

#### HTTP Request

PUT /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `update` replace status of the specified ResourceClaim

#### HTTP Request

PUT /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceClaim

#### HTTP Request

PATCH /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ResourceClaim

#### HTTP Request

PATCH /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `delete` delete a ResourceClaim

#### HTTP Request

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceClaim

#### HTTP Request

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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

