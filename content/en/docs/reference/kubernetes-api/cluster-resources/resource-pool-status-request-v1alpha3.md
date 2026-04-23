---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourcePoolStatusRequest"
content_type: "api_reference"
description: "ResourcePoolStatusRequest triggers a one-time calculation of resource pool status based on the provided filters."
title: "ResourcePoolStatusRequest v1alpha3"
weight: 10
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


## ResourcePoolStatusRequest {#ResourcePoolStatusRequest}

ResourcePoolStatusRequest triggers a one-time calculation of resource pool status based on the provided filters. Once status is set, the request is considered complete and will not be reprocessed. Users should delete and recreate requests to get updated information.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourcePoolStatusRequest


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>), required

  Standard object metadata

- **spec** (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestSpec" >}}">ResourcePoolStatusRequestSpec</a>), required

  Spec defines the filters for which pools to include in the status. The spec is immutable once created.

- **status** (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestStatus" >}}">ResourcePoolStatusRequestStatus</a>)

  Status is populated by the controller with the calculated pool status. When status is non-nil, the request is considered complete and the entire object becomes immutable.





## ResourcePoolStatusRequestSpec {#ResourcePoolStatusRequestSpec}

ResourcePoolStatusRequestSpec defines the filters for the pool status request.

<hr>

- **driver** (string), required

  Driver specifies the DRA driver name to filter pools. Only pools from ResourceSlices with this driver will be included. Must be a DNS subdomain (e.g., "gpu.example.com").

- **limit** (int32)

  Limit optionally specifies the maximum number of pools to return in the status. If more pools match the filter criteria, the response will be truncated (i.e., len(status.pools) \< status.poolCount).
  
  Default: 100 Minimum: 1 Maximum: 1000

- **poolName** (string)

  PoolName optionally filters to a specific pool name. If not specified, all pools from the specified driver are included. When specified, must be a non-empty valid resource pool name (DNS subdomains separated by "/").





## ResourcePoolStatusRequestStatus {#ResourcePoolStatusRequestStatus}

ResourcePoolStatusRequestStatus contains the calculated pool status information.

<hr>

- **poolCount** (int32), required

  PoolCount is the total number of pools that matched the filter criteria, regardless of truncation. This helps users understand how many pools exist even when the response is truncated. A value of 0 means no pools matched the filter criteria.

- **conditions** ([]Condition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Conditions provide information about the state of the request. A condition with type=Complete or type=Failed will always be set when the status is populated.
  
  Known condition types: - "Complete": True when the request has been processed successfully - "Failed": True when the request could not be processed

  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*

  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.

  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.

  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.

- **pools** ([]PoolStatus)

  *Atomic: will be replaced during a merge*
  
  Pools contains the first `spec.limit` matching pools, sorted by driver then pool name. If `len(pools) \< poolCount`, the list was truncated. When omitted, no pools matched the request filters.

  <a name="PoolStatus"></a>
  *PoolStatus contains status information for a single resource pool.*

  - **pools.driver** (string), required

    Driver is the DRA driver name for this pool. Must be a DNS subdomain (e.g., "gpu.example.com").

  - **pools.generation** (int64), required

    Generation is the pool generation observed across all ResourceSlices in this pool. Only the latest generation is reported. During a generation rollout, if not all slices at the latest generation have been published, the pool is included with a validationError and device counts unset.

  - **pools.poolName** (string), required

    PoolName is the name of the pool. Must be a valid resource pool name (DNS subdomains separated by "/").

  - **pools.allocatedDevices** (int32)

    AllocatedDevices is the number of devices currently allocated to claims. A value of 0 means no devices are allocated. May be unset when validationError is set.

  - **pools.availableDevices** (int32)

    AvailableDevices is the number of devices available for allocation. This equals TotalDevices - AllocatedDevices - UnavailableDevices. A value of 0 means no devices are currently available. May be unset when validationError is set.

  - **pools.nodeName** (string)

    NodeName is the node this pool is associated with. When omitted, the pool is not associated with a specific node. Must be a valid DNS subdomain name (RFC1123).

  - **pools.resourceSliceCount** (int32)

    ResourceSliceCount is the number of ResourceSlices that make up this pool. May be unset when validationError is set.

  - **pools.totalDevices** (int32)

    TotalDevices is the total number of devices in the pool across all slices. A value of 0 means the pool has no devices. May be unset when validationError is set.

  - **pools.unavailableDevices** (int32)

    UnavailableDevices is the number of devices that are not available due to taints or other conditions, but are not allocated. A value of 0 means all unallocated devices are available. May be unset when validationError is set.

  - **pools.validationError** (string)

    ValidationError is set when the pool's data could not be fully validated (e.g., incomplete slice publication). When set, device count fields and ResourceSliceCount may be unset.





## ResourcePoolStatusRequestList {#ResourcePoolStatusRequestList}

ResourcePoolStatusRequestList is a collection of ResourcePoolStatusRequests.

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3


- **kind**: ResourcePoolStatusRequestList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>), required

  Items is the list of ResourcePoolStatusRequests.





## Operations {#Operations}



<hr>






### `get` read the specified ResourcePoolStatusRequest

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

401: Unauthorized


### `get` read status of the specified ResourcePoolStatusRequest

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ResourcePoolStatusRequest

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

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


- **shardSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestList" >}}">ResourcePoolStatusRequestList</a>): OK

401: Unauthorized


### `create` create a ResourcePoolStatusRequest

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

#### Parameters


- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

202 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Accepted

401: Unauthorized


### `update` replace the specified ResourcePoolStatusRequest

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized


### `update` replace status of the specified ResourcePoolStatusRequest

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized


### `patch` partially update the specified ResourcePoolStatusRequest

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


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


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ResourcePoolStatusRequest

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


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


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized


### `delete` delete a ResourcePoolStatusRequest

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ResourcePoolStatusRequest


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


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

202 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ResourcePoolStatusRequest

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

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


- **shardSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

