---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceClass"
content_type: "api_reference"
description: "DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors."
title: "DeviceClass v1alpha3"
weight: 2
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


## DeviceClass {#DeviceClass}

DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors. It can be referenced in the device requests of a claim to apply these presets. Cluster scoped.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: DeviceClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClassSpec" >}}">DeviceClassSpec</a>), required

  Spec defines what can be allocated and how to configure it.
  
  This is mutable. Consumers have to be prepared for classes changing at any time, either because they get updated or replaced. Claim allocations are done once based on whatever was set in classes at the time of allocation.
  
  Changing the spec automatically increments the metadata.generation number.





## DeviceClassSpec {#DeviceClassSpec}

DeviceClassSpec is used in a [DeviceClass] to define what can be allocated and how to configure it.

<hr>

- **config** ([]DeviceClassConfiguration)

  *Atomic: will be replaced during a merge*
  
  Config defines configuration parameters that apply to each device that is claimed via this class. Some classses may potentially be satisfied by multiple drivers, so each instance of a vendor configuration applies to exactly one driver.
  
  They are passed to the driver, but are not considered while allocating the claim.

  <a name="DeviceClassConfiguration"></a>
  *DeviceClassConfiguration is used in DeviceClass.*

  - **config.opaque** (OpaqueDeviceConfiguration)

    Opaque provides driver-specific configuration parameters.

    <a name="OpaqueDeviceConfiguration"></a>
    *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*

    - **config.opaque.driver** (string), required

      Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
      
      An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
      
      Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.

    - **config.opaque.parameters** (RawExtension), required

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

- **selectors** ([]DeviceSelector)

  *Atomic: will be replaced during a merge*
  
  Each selector must be satisfied by a device which is claimed via this class.

  <a name="DeviceSelector"></a>
  *DeviceSelector must have exactly one field set.*

  - **selectors.cel** (CELDeviceSelector)

    CEL contains a CEL expression for selecting a device.

    <a name="CELDeviceSelector"></a>
    *CELDeviceSelector contains a CEL expression for selecting a device.*

    - **selectors.cel.expression** (string), required

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

- **suitableNodes** (NodeSelector)

  Only nodes matching the selector will be considered by the scheduler when trying to find a Node that fits a Pod when that Pod uses a claim that has not been allocated yet *and* that claim gets allocated through a control plane controller. It is ignored when the claim does not use a control plane controller for allocation.
  
  Setting this field is optional. If unset, all Nodes are candidates.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **suitableNodes.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **suitableNodes.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **suitableNodes.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.





## DeviceClassList {#DeviceClassList}

DeviceClassList is a collection of classes.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: DeviceClassList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>), required

  Items is the list of resource classes.





## Operations {#Operations}



<hr>






### `get` read the specified DeviceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceClass


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

401: Unauthorized


### `list` list or watch objects of kind DeviceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/deviceclasses

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


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClassList" >}}">DeviceClassList</a>): OK

401: Unauthorized


### `create` create a DeviceClass

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/deviceclasses

#### Parameters


- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

202 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized


### `update` replace the specified DeviceClass

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceClass


- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized


### `patch` partially update the specified DeviceClass

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceClass


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


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized


### `delete` delete a DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceClass


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


200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

202 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses

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

