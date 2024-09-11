---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ResourceQuota"
content_type: "api_reference"
description: "ResourceQuota sets aggregate quota restrictions enforced per namespace."
title: "ResourceQuota"
weight: 3
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

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## ResourceQuota {#ResourceQuota}

ResourceQuota sets aggregate quota restrictions enforced per namespace

<hr>

- **apiVersion**: v1


- **kind**: ResourceQuota


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaSpec" >}}">ResourceQuotaSpec</a>)

  Spec defines the desired quota. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaStatus" >}}">ResourceQuotaStatus</a>)

  Status defines the actual enforced quota and its current usage. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## ResourceQuotaSpec {#ResourceQuotaSpec}

ResourceQuotaSpec defines the desired hard limits to enforce for Quota.

<hr>

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  hard is the set of desired hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/

- **scopeSelector** (ScopeSelector)

  scopeSelector is also a collection of filters like scopes that must match each object tracked by a quota but expressed using ScopeSelectorOperator in combination with possible values. For a resource to match, both scopes AND scopeSelector (if specified in spec), must be matched.

  <a name="ScopeSelector"></a>
  *A scope selector represents the AND of the selectors represented by the scoped-resource selector requirements.*

  - **scopeSelector.matchExpressions** ([]ScopedResourceSelectorRequirement)

    *Atomic: will be replaced during a merge*
    
    A list of scope selector requirements by scope of the resources.

    <a name="ScopedResourceSelectorRequirement"></a>
    *A scoped-resource selector requirement is a selector that contains values, a scope name, and an operator that relates the scope name and values.*

    - **scopeSelector.matchExpressions.operator** (string), required

      Represents a scope's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist.

    - **scopeSelector.matchExpressions.scopeName** (string), required

      The name of the scope that the selector applies to.

    - **scopeSelector.matchExpressions.values** ([]string)

      *Atomic: will be replaced during a merge*
      
      An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.

- **scopes** ([]string)

  *Atomic: will be replaced during a merge*
  
  A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects.





## ResourceQuotaStatus {#ResourceQuotaStatus}

ResourceQuotaStatus defines the enforced hard limits and observed use.

<hr>

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Hard is the set of enforced hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/

- **used** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Used is the current observed total usage of the resource in the namespace.





## ResourceQuotaList {#ResourceQuotaList}

ResourceQuotaList is a list of ResourceQuota items.

<hr>

- **apiVersion**: v1


- **kind**: ResourceQuotaList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>), required

  Items is a list of ResourceQuota objects. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/





## Operations {#Operations}



<hr>






### `get` read the specified ResourceQuota

#### HTTP Request

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized


### `get` read status of the specified ResourceQuota

#### HTTP Request

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceQuota

#### HTTP Request

GET /api/v1/namespaces/{namespace}/resourcequotas

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourceQuota

#### HTTP Request

GET /api/v1/resourcequotas

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized


### `create` create a ResourceQuota

#### HTTP Request

POST /api/v1/namespaces/{namespace}/resourcequotas

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourceQuota

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized


### `update` replace status of the specified ResourceQuota

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourceQuota

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ResourceQuota

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized


### `delete` delete a ResourceQuota

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourceQuota


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>



#### Response


200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourceQuota

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/resourcequotas

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

