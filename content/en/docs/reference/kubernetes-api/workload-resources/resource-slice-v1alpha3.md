---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver."
title: "ResourceSlice v1alpha3"
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

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`


## ResourceSlice {#ResourceSlice}

ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver. A pool may span more than one ResourceSlice, and exactly how many ResourceSlices comprise a pool is determined by the driver.

At the moment, the only supported resources are devices with attributes and capacities. Each device in a given pool, regardless of how many ResourceSlices, must have a unique name. The ResourceSlice in which a device gets published may change over time. The unique identifier for a device is the tuple \<driver name>, \<pool name>, \<device name>.

Whenever a driver needs to update a pool, it increments the pool.Spec.Pool.Generation number and updates all ResourceSlices with that new number and new resource definitions. A consumer must only use ResourceSlices with the highest generation number and ignore all others.

When allocating all resources in a pool matching certain criteria or when looking for the best solution among several different alternatives, a consumer should check the number of ResourceSlices in a pool (included in each ResourceSlice) to determine whether its view of a pool is complete and if not, should wait until the driver has completed updating the pool.

For resources that are not local to a node, the node name is not set. Instead, the driver may use a node selector to specify where the devices are available.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceSlice


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), required

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
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.

- **devices** ([]Device)

  *Atomic: will be replaced during a merge*
  
  Devices lists some or all of the devices in this pool.
  
  Must not have more than 128 entries.

  <a name="Device"></a>
  *Device represents one individual hardware instance that can be selected based on its attributes. Besides the name, exactly one field must be set.*

  - **devices.name** (string), required

    Name is unique identifier among all devices managed by the driver in the pool. It must be a DNS label.

  - **devices.basic** (BasicDevice)

    Basic defines one device instance.

    <a name="BasicDevice"></a>
    *BasicDevice defines one device instance.*

    - **devices.basic.attributes** (map[string]DeviceAttribute)

      Attributes defines the set of attributes for this device. The name of each attribute must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.

      <a name="DeviceAttribute"></a>
      *DeviceAttribute must have exactly one field set.*

      - **devices.basic.attributes.bool** (boolean)

        BoolValue is a true/false value.

      - **devices.basic.attributes.int** (int64)

        IntValue is a number.

      - **devices.basic.attributes.string** (string)

        StringValue is a string. Must not be longer than 64 characters.

      - **devices.basic.attributes.version** (string)

        VersionValue is a semantic version according to semver.org spec 2.0.0. Must not be longer than 64 characters.

    - **devices.basic.capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Capacity defines the set of capacities for this device. The name of each capacity must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.

- **nodeName** (string)

  NodeName identifies the node which provides the resources in this pool. A field selector can be used to list only ResourceSlice objects belonging to a certain node.
  
  This field can be used to limit access from nodes to ResourceSlices with the same node name. It also indicates to autoscalers that adding new nodes of the same type as some old node might also make new resources available.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set. This field is immutable.

- **nodeSelector** (NodeSelector)

  NodeSelector defines which nodes have access to the resources in the pool, when that pool is not limited to a single node.
  
  Must use exactly one term.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.

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





## ResourceSliceList {#ResourceSliceList}

ResourceSliceList is a collection of ResourceSlices.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceSliceList


- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>), required

  Items is the list of resource ResourceSlices.

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata





## Operations {#Operations}



<hr>






### `get` read the specified ResourceSlice

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceSlice

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourceslices

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


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized


### `create` create a ResourceSlice

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/resourceslices

#### Parameters


- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceSlice

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceSlice

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

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


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized


### `delete` delete a ResourceSlice

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceSlice


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


200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceSlice

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices

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

