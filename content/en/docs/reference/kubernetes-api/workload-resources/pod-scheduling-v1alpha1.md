---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha1"
  import: "k8s.io/api/resource/v1alpha1"
  kind: "PodScheduling"
content_type: "api_reference"
description: "PodScheduling objects hold information that is needed to schedule a Pod with ResourceClaims that use \"WaitForFirstConsumer\" allocation mode."
title: "PodScheduling v1alpha1"
weight: 14
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

`apiVersion: resource.k8s.io/v1alpha1`

`import "k8s.io/api/resource/v1alpha1"`


## PodScheduling {#PodScheduling}

PodScheduling objects hold information that is needed to schedule a Pod with ResourceClaims that use "WaitForFirstConsumer" allocation mode.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha1


- **kind**: PodScheduling


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodSchedulingSpec" >}}">PodSchedulingSpec</a>), required

  Spec describes where resources for the Pod are needed.

- **status** (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodSchedulingStatus" >}}">PodSchedulingStatus</a>)

  Status describes where resources for the Pod can be allocated.





## PodSchedulingSpec {#PodSchedulingSpec}

PodSchedulingSpec describes where resources for the Pod are needed.

<hr>

- **potentialNodes** ([]string)

  *Set: unique values will be kept during a merge*
  
  PotentialNodes lists nodes where the Pod might be able to run.
  
  The size of this field is limited to 128. This is large enough for many clusters. Larger clusters may need more attempts to find a node that suits all pending resources. This may get increased in the future, but not reduced.

- **selectedNode** (string)

  SelectedNode is the node for which allocation of ResourceClaims that are referenced by the Pod and that use "WaitForFirstConsumer" allocation is to be attempted.





## PodSchedulingStatus {#PodSchedulingStatus}

PodSchedulingStatus describes where resources for the Pod can be allocated.

<hr>

- **resourceClaims** ([]ResourceClaimSchedulingStatus)

  *Map: unique values on key name will be kept during a merge*
  
  ResourceClaims describes resource availability for each pod.spec.resourceClaim entry where the corresponding ResourceClaim uses "WaitForFirstConsumer" allocation mode.

  <a name="ResourceClaimSchedulingStatus"></a>
  *ResourceClaimSchedulingStatus contains information about one particular ResourceClaim with "WaitForFirstConsumer" allocation mode.*

  - **resourceClaims.name** (string)

    Name matches the pod.spec.resourceClaims[*].Name field.

  - **resourceClaims.unsuitableNodes** ([]string)

    *Set: unique values will be kept during a merge*
    
    UnsuitableNodes lists nodes that the ResourceClaim cannot be allocated for.
    
    The size of this field is limited to 128, the same as for PodSchedulingSpec.PotentialNodes. This may get increased in the future, but not reduced.





## PodSchedulingList {#PodSchedulingList}

PodSchedulingList is a collection of Pod scheduling objects.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha1


- **kind**: PodSchedulingList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>), required

  Items is the list of PodScheduling objects.





## Operations {#Operations}



<hr>






### `get` read the specified PodScheduling

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

401: Unauthorized


### `get` read status of the specified PodScheduling

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodScheduling

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodSchedulingList" >}}">PodSchedulingList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodScheduling

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha1/podschedulings

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodSchedulingList" >}}">PodSchedulingList</a>): OK

401: Unauthorized


### `create` create a PodScheduling

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Accepted

401: Unauthorized


### `update` replace the specified PodScheduling

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Created

401: Unauthorized


### `update` replace status of the specified PodScheduling

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Created

401: Unauthorized


### `patch` partially update the specified PodScheduling

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Created

401: Unauthorized


### `patch` partially update status of the specified PodScheduling

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Created

401: Unauthorized


### `delete` delete a PodScheduling

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodScheduling


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-scheduling-v1alpha1#PodScheduling" >}}">PodScheduling</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of PodScheduling

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha1/namespaces/{namespace}/podschedulings

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

