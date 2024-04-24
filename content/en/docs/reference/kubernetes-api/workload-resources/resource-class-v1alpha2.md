---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha2"
  import: "k8s.io/api/resource/v1alpha2"
  kind: "ResourceClass"
content_type: "api_reference"
description: "ResourceClass is used by administrators to influence how resources are allocated."
title: "ResourceClass v1alpha2"
weight: 17
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

`apiVersion: resource.k8s.io/v1alpha2`

`import "k8s.io/api/resource/v1alpha2"`


## ResourceClass {#ResourceClass}

ResourceClass is used by administrators to influence how resources are allocated.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha2


- **kind**: ResourceClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **driverName** (string), required

  DriverName defines the name of the dynamic resource driver that is used for allocation of a ResourceClaim that uses this class.
  
  Resource drivers have a unique name in forward domain order (acme.example.com).

- **parametersRef** (ResourceClassParametersReference)

  ParametersRef references an arbitrary separate object that may hold parameters that will be used by the driver when allocating a resource that uses this class. A dynamic resource driver can distinguish between parameters stored here and and those stored in ResourceClaimSpec.

  <a name="ResourceClassParametersReference"></a>
  *ResourceClassParametersReference contains enough information to let you locate the parameters for a ResourceClass.*

  - **parametersRef.kind** (string), required

    Kind is the type of resource being referenced. This is the same value as in the parameter object's metadata.

  - **parametersRef.name** (string), required

    Name is the name of resource being referenced.

  - **parametersRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.

  - **parametersRef.namespace** (string)

    Namespace that contains the referenced resource. Must be empty for cluster-scoped resources and non-empty for namespaced resources.

- **suitableNodes** (NodeSelector)

  Only nodes matching the selector will be considered by the scheduler when trying to find a Node that fits a Pod when that Pod uses a ResourceClaim that has not been allocated yet.
  
  Setting this field is optional. If null, all nodes are candidates.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **suitableNodes.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **suitableNodes.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **suitableNodes.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.





## ResourceClassList {#ResourceClassList}

ResourceClassList is a collection of classes.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha2


- **kind**: ResourceClassList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>), required

  Items is the list of resource classes.





## Operations {#Operations}



<hr>






### `get` read the specified ResourceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha2/resourceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClass


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha2/resourceclasses

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


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClassList" >}}">ResourceClassList</a>): OK

401: Unauthorized


### `create` create a ResourceClass

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha2/resourceclasses

#### Parameters


- **body**: <a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceClass

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha2/resourceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClass


- **body**: <a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceClass

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha2/resourceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClass


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


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): Created

401: Unauthorized


### `delete` delete a ResourceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha2/resourceclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClass


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


200 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-class-v1alpha2#ResourceClass" >}}">ResourceClass</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha2/resourceclasses

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

