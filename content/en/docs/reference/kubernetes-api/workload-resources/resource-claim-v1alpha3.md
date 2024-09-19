---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim describes a request for access to resources in the cluster, for use by workloads."
title: "ResourceClaim v1alpha3"
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

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`


## ResourceClaim {#ResourceClaim}

ResourceClaim describes a request for access to resources in the cluster, for use by workloads. For example, if a workload needs an accelerator device with specific properties, this is how that request is expressed. The status stanza tracks whether this claim has been satisfied and what specific resources have been allocated.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceClaim


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes what is being requested and how to configure it. The spec is immutable.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the claim is ready to use and what has been allocated.





## ResourceClaimSpec {#ResourceClaimSpec}

ResourceClaimSpec defines what is being requested in a ResourceClaim and how to configure it.

<hr>

- **controller** (string)

  Controller is the name of the DRA driver that is meant to handle allocation of this claim. If empty, allocation is handled by the scheduler while scheduling a pod.
  
  Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.

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

  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: will be replaced during a merge*
    
    These constraints must be satisfied by the set of devices that get allocated for the claim.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint must have exactly one field set besides Requests.*

    - **devices.constraints.matchAttribute** (string)

      MatchAttribute requires that all devices in question have this attribute and that its type and value are the same across those devices.
      
      For example, if you specified "dra.example.com/numa" (a hypothetical example!), then only devices in the same NUMA node will be chosen. A device which does not have that attribute will not be chosen. All devices should use a value of the same type for this attribute because that is part of its specification, but if one device doesn't, then it also will not be chosen.
      
      Must include the domain qualifier.

    - **devices.constraints.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests is a list of the one or more requests in this claim which must co-satisfy this constraint. If a request is fulfilled by multiple devices, then all of the devices must satisfy the constraint. If this is not specified, this constraint applies to all requests in this claim.

  - **devices.requests** ([]DeviceRequest)

    *Atomic: will be replaced during a merge*
    
    Requests represent individual requests for distinct devices which must all be satisfied. If empty, nothing needs to be allocated.

    <a name="DeviceRequest"></a>
    *DeviceRequest is a request for devices required for a claim. This is typically a request for a single resource like a device, but can also ask for several identical devices.
    
    A DeviceClassName is currently required. Clients must check that it is indeed set. It's absence indicates that something changed in a way that is not supported by the client yet, in which case it must refuse to handle the request.*

    - **devices.requests.deviceClassName** (string), required

      DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this request.
      
      A class is required. Which classes are available depends on the cluster.
      
      Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.

    - **devices.requests.name** (string), required

      Name can be used to reference this request in a pod.spec.containers[].resources.claims entry and in a constraint of the claim.
      
      Must be a DNS label.

    - **devices.requests.adminAccess** (boolean)

      AdminAccess indicates that this is a claim for administrative access to the device(s). Claims with AdminAccess are expected to be used for monitoring or other management services for a device.  They ignore all ordinary claims to the device with respect to access modes and any resource allocations.

    - **devices.requests.allocationMode** (string)

      AllocationMode and its related fields define how devices are allocated to satisfy this request. Supported values are:
      
      - ExactCount: This request is for a specific number of devices.
        This is the default. The exact number is provided in the
        count field.
      
      - All: This request is for all of the matching devices in a pool.
        Allocation will fail if some devices are already allocated,
        unless adminAccess is requested.
      
      If AlloctionMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other requests must specify this field.
      
      More modes may get added in the future. Clients must refuse to handle requests with unknown modes.

    - **devices.requests.count** (int64)

      Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.

    - **devices.requests.selectors** ([]DeviceSelector)

      *Atomic: will be replaced during a merge*
      
      Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this request. All selectors must be satisfied for a device to be considered.

      <a name="DeviceSelector"></a>
      *DeviceSelector must have exactly one field set.*

      - **devices.requests.selectors.cel** (CELDeviceSelector)

        CEL contains a CEL expression for selecting a device.

        <a name="CELDeviceSelector"></a>
        *CELDeviceSelector contains a CEL expression for selecting a device.*

        - **devices.requests.selectors.cel.expression** (string), required

          Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
          
          The expression's input is an object named "device", which carries the following properties:
           - driver (string): the name of the driver which defines this device.
           - attributes (map[string]object): the device's attributes, grouped by prefix
             (e.g. device.attributes["dra.example.com"] evaluates to an object with all
             of the attributes which were prefixed by "dra.example.com".
           - capacity (map[string]object): the device's capacities, grouped by prefix.
          
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





## ResourceClaimStatus {#ResourceClaimStatus}

ResourceClaimStatus tracks whether the resource has been allocated and what the result of that was.

<hr>

- **allocation** (AllocationResult)

  Allocation is set once the claim has been allocated successfully.

  <a name="AllocationResult"></a>
  *AllocationResult contains attributes of an allocated resource.*

  - **allocation.controller** (string)

    Controller is the name of the DRA driver which handled the allocation. That driver is also responsible for deallocating the claim. It is empty when the claim can be deallocated without involving a driver.
    
    A driver may allocate devices provided by other drivers, so this driver name here can be different from the driver names listed for the results.
    
    This is an alpha field and requires enabling the DRAControlPlaneController feature gate.

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

        Request is the name of the request in the claim which caused this device to be allocated. Multiple devices may have been allocated per request.

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

- **deallocationRequested** (boolean)

  Indicates that a claim is to be deallocated. While this is set, no new consumers may be added to ReservedFor.
  
  This is only used if the claim needs to be deallocated by a DRA driver. That driver then must deallocate this claim and reset the field together with clearing the Allocation field.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.

- **reservedFor** ([]ResourceClaimConsumerReference)

  *Patch strategy: merge on key `uid`*
  
  *Map: unique values on key uid will be kept during a merge*
  
  ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started. A claim that is in use or might be in use because it has been reserved must not get deallocated.
  
  In a cluster with multiple scheduler instances, two pods might get scheduled concurrently by different schedulers. When they reference the same ResourceClaim which already has reached its maximum number of consumers, only one pod can be scheduled.
  
  Both schedulers try to add their pod to the claim.status.reservedFor field, but only the update that reaches the API server first gets stored. The other one fails with an error and the scheduler which issued it knows that it must put the pod back into the queue, waiting for the ResourceClaim to become usable again.
  
  There can be at most 32 such reservations. This may get increased in the future, but not reduced.

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

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceClaimList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.





## Operations {#Operations}



<hr>






### `get` read the specified ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized


### `get` read status of the specified ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaim

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourceclaims

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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized


### `create` create a ResourceClaim

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceClaim

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `update` replace status of the specified ResourceClaim

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaim


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceClaim

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ResourceClaim

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

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


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized


### `delete` delete a ResourceClaim

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

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


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceClaim

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

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

