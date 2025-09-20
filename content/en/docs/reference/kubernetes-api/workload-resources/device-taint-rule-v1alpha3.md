---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceTaintRule"
content_type: "api_reference"
description: "DeviceTaintRule adds one taint to all devices which match the selector."
title: "DeviceTaintRule v1alpha3"
weight: 15
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


## DeviceTaintRule {#DeviceTaintRule}

DeviceTaintRule adds one taint to all devices which match the selector. This has the same effect as if the taint was specified directly in the ResourceSlice by the DRA driver.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: DeviceTaintRule


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleSpec" >}}">DeviceTaintRuleSpec</a>), required

  Spec specifies the selector and one taint.
  
  Changing the spec automatically increments the metadata.generation number.





## DeviceTaintRuleSpec {#DeviceTaintRuleSpec}

DeviceTaintRuleSpec specifies the selector and one taint.

<hr>

- **taint** (DeviceTaint), required

  The taint that gets applied to matching devices.

  <a name="DeviceTaint"></a>
  *The device this taint is attached to has the "effect" on any claim which does not tolerate the taint and, through the claim, to pods using the claim.*

  - **taint.effect** (string), required

    The effect of the taint on claims that do not tolerate the taint and through such claims on the pods using them. Valid effects are NoSchedule and NoExecute. PreferNoSchedule as used for nodes is not valid here.

  - **taint.key** (string), required

    The taint key to be applied to a device. Must be a label name.

  - **taint.timeAdded** (Time)

    TimeAdded represents the time at which the taint was added. Added automatically during create or update if not set.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **taint.value** (string)

    The taint value corresponding to the taint key. Must be a label value.

- **deviceSelector** (DeviceTaintSelector)

  DeviceSelector defines which device(s) the taint is applied to. All selector criteria must be satisfied for a device to match. The empty selector matches all devices. Without a selector, no devices are matches.

  <a name="DeviceTaintSelector"></a>
  *DeviceTaintSelector defines which device(s) a DeviceTaintRule applies to. The empty selector matches all devices. Without a selector, no devices are matched.*

  - **deviceSelector.device** (string)

    If device is set, only devices with that name are selected. This field corresponds to slice.spec.devices[].name.
    
    Setting also driver and pool may be required to avoid ambiguity, but is not required.

  - **deviceSelector.deviceClassName** (string)

    If DeviceClassName is set, the selectors defined there must be satisfied by a device to be selected. This field corresponds to class.metadata.name.

  - **deviceSelector.driver** (string)

    If driver is set, only devices from that driver are selected. This fields corresponds to slice.spec.driver.

  - **deviceSelector.pool** (string)

    If pool is set, only devices in that pool are selected.
    
    Also setting the driver name may be useful to avoid ambiguity when different drivers use the same pool name, but this is not required because selecting pools from different drivers may also be useful, for example when drivers with node-local devices use the node name as their pool name.

  - **deviceSelector.selectors** ([]DeviceSelector)

    *Atomic: will be replaced during a merge*
    
    Selectors contains the same selection criteria as a ResourceClaim. Currently, CEL expressions are supported. All of these selectors must be satisfied.

    <a name="DeviceSelector"></a>
    *DeviceSelector must have exactly one field set.*

    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      CEL contains a CEL expression for selecting a device.

      <a name="CELDeviceSelector"></a>
      *CELDeviceSelector contains a CEL expression for selecting a device.*

      - **deviceSelector.selectors.cel.expression** (string), required

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
        
        The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.





## DeviceTaintRuleList {#DeviceTaintRuleList}

DeviceTaintRuleList is a collection of DeviceTaintRules.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: DeviceTaintRuleList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>), required

  Items is the list of DeviceTaintRules.





## Operations {#Operations}



<hr>






### `get` read the specified DeviceTaintRule

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceTaintRule


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

401: Unauthorized


### `list` list or watch objects of kind DeviceTaintRule

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules

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


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleList" >}}">DeviceTaintRuleList</a>): OK

401: Unauthorized


### `create` create a DeviceTaintRule

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/devicetaintrules

#### Parameters


- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized


### `update` replace the specified DeviceTaintRule

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceTaintRule


- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized


### `patch` partially update the specified DeviceTaintRule

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceTaintRule


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


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized


### `delete` delete a DeviceTaintRule

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the DeviceTaintRule


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


200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of DeviceTaintRule

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules

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

