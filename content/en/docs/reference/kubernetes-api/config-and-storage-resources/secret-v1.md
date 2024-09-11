---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Secret"
content_type: "api_reference"
description: "Secret holds secret data of a certain type."
title: "Secret"
weight: 2
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


## Secret {#Secret}

Secret holds secret data of a certain type. The total bytes of the values in the Data field must be less than MaxSecretSize bytes.

<hr>

- **apiVersion**: v1


- **kind**: Secret


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **data** (map[string][]byte)

  Data contains the secret data. Each key must consist of alphanumeric characters, '-', '_' or '.'. The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here. Described in https://tools.ietf.org/html/rfc4648#section-4

- **immutable** (boolean)

  Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil.

- **stringData** (map[string]string)

  stringData allows specifying non-binary secret data in string form. It is provided as a write-only input field for convenience. All keys and values are merged into the data field on write, overwriting any existing values. The stringData field is never output when reading from the API.

- **type** (string)

  Used to facilitate programmatic handling of secret data. More info: https://kubernetes.io/docs/concepts/configuration/secret/#secret-types





## SecretList {#SecretList}

SecretList is a list of Secret.

<hr>

- **apiVersion**: v1


- **kind**: SecretList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>), required

  Items is a list of secret objects. More info: https://kubernetes.io/docs/concepts/configuration/secret





## Operations {#Operations}



<hr>






### `get` read the specified Secret

#### HTTP Request

GET /api/v1/namespaces/{namespace}/secrets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Secret


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Secret

#### HTTP Request

GET /api/v1/namespaces/{namespace}/secrets

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


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Secret

#### HTTP Request

GET /api/v1/secrets

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


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized


### `create` create a Secret

#### HTTP Request

POST /api/v1/namespaces/{namespace}/secrets

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Accepted

401: Unauthorized


### `update` replace the specified Secret

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/secrets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Secret


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized


### `patch` partially update the specified Secret

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/secrets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Secret


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


200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized


### `delete` delete a Secret

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/secrets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Secret


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

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of Secret

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/secrets

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

