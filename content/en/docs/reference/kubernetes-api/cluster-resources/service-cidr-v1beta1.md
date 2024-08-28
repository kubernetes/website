---
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR defines a range of IP addresses using CIDR format (e."
title: "ServiceCIDR v1beta1"
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

`apiVersion: networking.k8s.io/v1beta1`

`import "k8s.io/api/networking/v1beta1"`


## ServiceCIDR {#ServiceCIDR}

ServiceCIDR defines a range of IP addresses using CIDR format (e.g. 192.168.0.0/24 or 2001:db2::/64). This range is used to allocate ClusterIPs to Service objects.

<hr>

- **apiVersion**: networking.k8s.io/v1beta1


- **kind**: ServiceCIDR


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec is the desired state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status represents the current state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## ServiceCIDRSpec {#ServiceCIDRSpec}

ServiceCIDRSpec define the CIDRs the user wants to use for allocating ClusterIPs for Services.

<hr>

- **cidrs** ([]string)

  *Atomic: will be replaced during a merge*
  
  CIDRs defines the IP blocks in CIDR notation (e.g. "192.168.0.0/24" or "2001:db8::/64") from which to assign service cluster IPs. Max of two CIDRs is allowed, one of each IP family. This field is immutable.





## ServiceCIDRStatus {#ServiceCIDRStatus}

ServiceCIDRStatus describes the current state of the ServiceCIDR.

<hr>

- **conditions** ([]Condition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  conditions holds an array of metav1.Condition that describe the state of the ServiceCIDR. Current service state

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





## ServiceCIDRList {#ServiceCIDRList}

ServiceCIDRList contains a list of ServiceCIDR objects.

<hr>

- **apiVersion**: networking.k8s.io/v1beta1


- **kind**: ServiceCIDRList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>), required

  items is the list of ServiceCIDRs.





## Operations {#Operations}



<hr>






### `get` read the specified ServiceCIDR

#### HTTP Request

GET /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized


### `get` read status of the specified ServiceCIDR

#### HTTP Request

GET /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ServiceCIDR

#### HTTP Request

GET /apis/networking.k8s.io/v1beta1/servicecidrs

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


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRList" >}}">ServiceCIDRList</a>): OK

401: Unauthorized


### `create` create a ServiceCIDR

#### HTTP Request

POST /apis/networking.k8s.io/v1beta1/servicecidrs

#### Parameters


- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

202 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Accepted

401: Unauthorized


### `update` replace the specified ServiceCIDR

#### HTTP Request

PUT /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized


### `update` replace status of the specified ServiceCIDR

#### HTTP Request

PUT /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized


### `patch` partially update the specified ServiceCIDR

#### HTTP Request

PATCH /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


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


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ServiceCIDR

#### HTTP Request

PATCH /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


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


200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized


### `delete` delete a ServiceCIDR

#### HTTP Request

DELETE /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ServiceCIDR


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


### `deletecollection` delete collection of ServiceCIDR

#### HTTP Request

DELETE /apis/networking.k8s.io/v1beta1/servicecidrs

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

