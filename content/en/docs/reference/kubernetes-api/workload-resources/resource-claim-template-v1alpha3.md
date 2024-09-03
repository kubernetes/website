---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceClaimTemplate"
content_type: "api_reference"
description: "ResourceClaimTemplate is used to produce ResourceClaim objects."
title: "ResourceClaimTemplate v1alpha3"
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

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`


## ResourceClaimTemplate {#ResourceClaimTemplate}

ResourceClaimTemplate is used to produce ResourceClaim objects.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceClaimTemplate


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplateSpec" >}}">ResourceClaimTemplateSpec</a>), required

  Describes the ResourceClaim that is to be generated.
  
  This field is immutable. A ResourceClaim will get created by the control plane for a Pod when needed and then not get updated anymore.





## ResourceClaimTemplateSpec {#ResourceClaimTemplateSpec}

ResourceClaimTemplateSpec contains the metadata and fields for a ResourceClaim.

<hr>

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec for the ResourceClaim. The entire content is copied unchanged into the ResourceClaim that gets created from this template. The same fields as in a ResourceClaim are also valid here.

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  ObjectMeta may contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.





## ResourceClaimTemplateList {#ResourceClaimTemplateList}

ResourceClaimTemplateList is a collection of claim templates.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourceClaimTemplateList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>), required

  Items is the list of resource claim templates.





## Operations {#Operations}



<hr>






### `get` read the specified ResourceClaimTemplate

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaimTemplate


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaimTemplate

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates

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


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceClaimTemplate

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourceclaimtemplates

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


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized


### `create` create a ResourceClaimTemplate

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceClaimTemplate

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaimTemplate


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceClaimTemplate

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaimTemplate


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


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized


### `delete` delete a ResourceClaimTemplate

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceClaimTemplate


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


200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1alpha3#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceClaimTemplate

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaimtemplates

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

