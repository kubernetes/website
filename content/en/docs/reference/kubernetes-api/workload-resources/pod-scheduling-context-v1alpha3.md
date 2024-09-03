---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "PodSchedulingContext"
content_type: "api_reference"
description: "PodSchedulingContext objects hold information that is needed to schedule a Pod with ResourceClaims that use \"WaitForFirstConsumer\" allocation mode."
title: "PodSchedulingContext v1alpha3"
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


## PodSchedulingContext {#PodSchedulingContext}

PodSchedulingContext objects hold information that is needed to schedule a Pod with ResourceClaims that use "WaitForFirstConsumer" allocation mode.

This is an alpha type and requires enabling the DRAControlPlaneController feature gate.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: PodSchedulingContext


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextSpec" >}}">PodSchedulingContextSpec</a>), required

  Spec describes where resources for the Pod are needed.

- **status** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextStatus" >}}">PodSchedulingContextStatus</a>)

  Status describes where resources for the Pod can be allocated.





## PodSchedulingContextSpec {#PodSchedulingContextSpec}

PodSchedulingContextSpec describes where resources for the Pod are needed.

<hr>

- **potentialNodes** ([]string)

  *Atomic: will be replaced during a merge*
  
  PotentialNodes lists nodes where the Pod might be able to run.
  
  The size of this field is limited to 128. This is large enough for many clusters. Larger clusters may need more attempts to find a node that suits all pending resources. This may get increased in the future, but not reduced.

- **selectedNode** (string)

  SelectedNode is the node for which allocation of ResourceClaims that are referenced by the Pod and that use "WaitForFirstConsumer" allocation is to be attempted.





## PodSchedulingContextStatus {#PodSchedulingContextStatus}

PodSchedulingContextStatus describes where resources for the Pod can be allocated.

<hr>

- **resourceClaims** ([]ResourceClaimSchedulingStatus)

  *Map: unique values on key name will be kept during a merge*
  
  ResourceClaims describes resource availability for each pod.spec.resourceClaim entry where the corresponding ResourceClaim uses "WaitForFirstConsumer" allocation mode.

  <a name="ResourceClaimSchedulingStatus"></a>
  *ResourceClaimSchedulingStatus contains information about one particular ResourceClaim with "WaitForFirstConsumer" allocation mode.*

  - **resourceClaims.name** (string), required

    Name matches the pod.spec.resourceClaims[*].Name field.

  - **resourceClaims.unsuitableNodes** ([]string)

    *Atomic: will be replaced during a merge*
    
    UnsuitableNodes lists nodes that the ResourceClaim cannot be allocated for.
    
    The size of this field is limited to 128, the same as for PodSchedulingSpec.PotentialNodes. This may get increased in the future, but not reduced.





## PodSchedulingContextList {#PodSchedulingContextList}

PodSchedulingContextList is a collection of Pod scheduling objects.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: PodSchedulingContextList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>), required

  Items is the list of PodSchedulingContext objects.





## Operations {#Operations}



<hr>






### `get` read the specified PodSchedulingContext

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized


### `get` read status of the specified PodSchedulingContext

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodSchedulingContext

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodSchedulingContext

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/podschedulingcontexts

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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized


### `create` create a PodSchedulingContext

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized


### `update` replace the specified PodSchedulingContext

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized


### `update` replace status of the specified PodSchedulingContext

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized


### `patch` partially update the specified PodSchedulingContext

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized


### `patch` partially update status of the specified PodSchedulingContext

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized


### `delete` delete a PodSchedulingContext

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodSchedulingContext


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


200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of PodSchedulingContext

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

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

