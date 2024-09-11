---
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "IPAddress"
content_type: "api_reference"
description: "IPAddress represents a single IP of a single IP Family."
title: "IPAddress v1beta1"
weight: 4
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


## IPAddress {#IPAddress}

IPAddress represents a single IP of a single IP Family. The object is designed to be used by APIs that operate on IP addresses. The object is used by the Service core API for allocation of IP addresses. An IP address can be represented in different formats, to guarantee the uniqueness of the IP, the name of the object is the IP address in canonical format, four decimal digits separated by dots suppressing leading zeros for IPv4 and the representation defined by RFC 5952 for IPv6. Valid: 192.168.1.5 or 2001:db8::1 or 2001:db8:aaaa:bbbb:cccc:dddd:eeee:1 Invalid: 10.01.2.3 or 2001:db8:0:0:0::1

<hr>

- **apiVersion**: networking.k8s.io/v1beta1


- **kind**: IPAddress


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddressSpec" >}}">IPAddressSpec</a>)

  spec is the desired state of the IPAddress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## IPAddressSpec {#IPAddressSpec}

IPAddressSpec describe the attributes in an IP Address.

<hr>

- **parentRef** (ParentReference), required

  ParentRef references the resource that an IPAddress is attached to. An IPAddress must reference a parent object.

  <a name="ParentReference"></a>
  *ParentReference describes a reference to a parent object.*

  - **parentRef.name** (string), required

    Name is the name of the object being referenced.

  - **parentRef.resource** (string), required

    Resource is the resource of the object being referenced.

  - **parentRef.group** (string)

    Group is the group of the object being referenced.

  - **parentRef.namespace** (string)

    Namespace is the namespace of the object being referenced.





## IPAddressList {#IPAddressList}

IPAddressList contains a list of IPAddress.

<hr>

- **apiVersion**: networking.k8s.io/v1beta1


- **kind**: IPAddressList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>), required

  items is the list of IPAddresses.





## Operations {#Operations}



<hr>






### `get` read the specified IPAddress

#### HTTP Request

GET /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IPAddress


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

401: Unauthorized


### `list` list or watch objects of kind IPAddress

#### HTTP Request

GET /apis/networking.k8s.io/v1beta1/ipaddresses

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


200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddressList" >}}">IPAddressList</a>): OK

401: Unauthorized


### `create` create an IPAddress

#### HTTP Request

POST /apis/networking.k8s.io/v1beta1/ipaddresses

#### Parameters


- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

202 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Accepted

401: Unauthorized


### `update` replace the specified IPAddress

#### HTTP Request

PUT /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IPAddress


- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized


### `patch` partially update the specified IPAddress

#### HTTP Request

PATCH /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IPAddress


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


200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized


### `delete` delete an IPAddress

#### HTTP Request

DELETE /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IPAddress


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


### `deletecollection` delete collection of IPAddress

#### HTTP Request

DELETE /apis/networking.k8s.io/v1beta1/ipaddresses

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

