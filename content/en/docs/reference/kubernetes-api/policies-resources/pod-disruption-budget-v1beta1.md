---
api_metadata:
  apiVersion: "policy/v1beta1"
  import: "k8s.io/api/policy/v1beta1"
  kind: "PodDisruptionBudget"
content_type: "api_reference"
description: "PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods."
title: "PodDisruptionBudget v1beta1"
weight: 4
---

`apiVersion: policy/v1beta1`

`import "k8s.io/api/policy/v1beta1"`


## PodDisruptionBudget {#PodDisruptionBudget}

PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods

<hr>

- **apiVersion**: policy/v1beta1


- **kind**: PodDisruptionBudget


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)


- **spec** (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudgetSpec" >}}">PodDisruptionBudgetSpec</a>)

  Specification of the desired behavior of the PodDisruptionBudget.

- **status** (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudgetStatus" >}}">PodDisruptionBudgetStatus</a>)

  Most recently observed status of the PodDisruptionBudget.





## PodDisruptionBudgetSpec {#PodDisruptionBudgetSpec}

PodDisruptionBudgetSpec is a description of a PodDisruptionBudget.

<hr>

- **maxUnavailable** (IntOrString)

  An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable".

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

- **minAvailable** (IntOrString)

  An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  Label query over pods whose evictions are managed by the disruption budget.





## PodDisruptionBudgetStatus {#PodDisruptionBudgetStatus}

PodDisruptionBudgetStatus represents information about the status of a PodDisruptionBudget. Status may trail the actual state of a system.

<hr>

- **currentHealthy** (int32), required

  current number of healthy pods

- **desiredHealthy** (int32), required

  minimum desired number of healthy pods

- **disruptionsAllowed** (int32), required

  Number of pod disruptions that are currently allowed.

- **expectedPods** (int32), required

  total number of pods counted by this disruption budget

- **disruptedPods** (map[string]Time)

  DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **observedGeneration** (int64)

  Most recent generation observed when updating this PDB status. DisruptionsAllowed and other status information is valid only if observedGeneration equals to PDB's object generation.





## PodDisruptionBudgetList {#PodDisruptionBudgetList}

PodDisruptionBudgetList is a collection of PodDisruptionBudgets.

<hr>

- **apiVersion**: policy/v1beta1


- **kind**: PodDisruptionBudgetList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)


- **items** ([]<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>), required






## Operations {#Operations}



<hr>






### `get` read the specified PodDisruptionBudget

#### HTTP Request

GET /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized


### `get` read status of the specified PodDisruptionBudget

#### HTTP Request

GET /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodDisruptionBudget

#### HTTP Request

GET /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets

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


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodDisruptionBudget

#### HTTP Request

GET /apis/policy/v1beta1/poddisruptionbudgets

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


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized


### `create` create a PodDisruptionBudget

#### HTTP Request

POST /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

202 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Accepted

401: Unauthorized


### `update` replace the specified PodDisruptionBudget

#### HTTP Request

PUT /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized


### `update` replace status of the specified PodDisruptionBudget

#### HTTP Request

PUT /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized


### `patch` partially update the specified PodDisruptionBudget

#### HTTP Request

PATCH /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized


### `patch` partially update status of the specified PodDisruptionBudget

#### HTTP Request

PATCH /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../policies-resources/pod-disruption-budget-v1beta1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized


### `delete` delete a PodDisruptionBudget

#### HTTP Request

DELETE /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodDisruptionBudget


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


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of PodDisruptionBudget

#### HTTP Request

DELETE /apis/policy/v1beta1/namespaces/{namespace}/poddisruptionbudgets

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

