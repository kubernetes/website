---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass 代表 Ingress 等级，由 Ingress Spec 引用."
title: "IngressClass"
weight: 5
---
<!--
---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass represents the class of the Ingress, referenced by the Ingress Spec."
title: "IngressClass"
weight: 5
auto_generated: true
---
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

<!--
## IngressClass {#IngressClass}

IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class.
-->
## IngressClass {#IngressClass}

IngressClass 表示 Ingress 类别，由 Ingress Spec 引用。
`ingressclass.kubernetes.io/is-default-class` 注释可用于指示应将 IngressClass 视为默认。
当单个 IngressClass 资源将此注释设置为true时，将为未指定类的新 IngressClass 资源分配此默认类

<hr>

<!--
- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  Spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准对象的元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  Spec 是 IngressClass 的所需状态。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status


<!--
## IngressClassSpec {#IngressClassSpec}

IngressClassSpec provides information about the class of an Ingress.

<hr>
-->
## IngressClassSpec {#IngressClassSpec}

IngressClassSpec 提供有关 Ingress 类别的信息

<hr>

<!--
- **controller** (string)

  Controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different Parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable.
-->
  Controller 是指应处理此类的控制器的名称。
  这允许由同一控制器控制不同的 “flavors”。
  例如，对于同一个实现控制器，您可能有不同的参数。
  应将其指定为长度不超过250个字符的域前缀路径，例如 “acme.io/ingress controller”。
  此字段是不可变的。

<!--
- **parameters** (IngressClassParametersReference)

  Parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters.

  <a name="IngressClassParametersReference"></a>
  *IngressClassParametersReference identifies an API object. This can be used to specify a cluster or namespace-scoped resource.*
-->
- **parameters** (IngressClassParametersReference)

  Parameters是指向包含控制器其他配置的自定义资源的链接。
  如果控制器不需要额外参数，这是可选的。

  <a name="IngressClassParametersReference"></a>
  *IngressClassParametersReference 标识 API 对象。这可用于指定群集或命名空间范围的资源。*

<!--
  - **parameters.kind** (string), required

    Kind is the type of resource being referenced.

  - **parameters.name** (string), required

    Name is the name of resource being referenced.

  - **parameters.apiGroup** (string)

    APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
-->
 - **parameters.kind** (string), 必选

    Kind 是被引用的资源的类型。

  - **parameters.name** (string), 必选

    Name 是被引用资源的类型。

  - **parameters.apiGroup** (string)

   APIGroup 是所引用资源的组。
   如果未指定 APIGroup，则指定的种类必须在核心 API 组中。
   对于任何其他第三方类型，都需要APIGroup。

<!--
  - **parameters.namespace** (string)

    Namespace is the namespace of the resource being referenced. This field is required when scope is set to "Namespace" and must be unset when scope is set to "Cluster".

  - **parameters.scope** (string)

    Scope represents if this refers to a cluster or namespace scoped resource. This may be set to "Cluster" (default) or "Namespace".
-->
  - **parameters.namespace** (string)

    Namespace 是被引用资源的命名空间。
    当 scope 设置为 “Namespace” 时，此字段是必需的，当 scope 设置为 “Cluster” 时，此字段必须取消设置。

  - **parameters.scope** (string)

    Scope 表示这是否引用集群或命名空间范围的资源。
    这可以设置为 “Cluster”（默认）或 “Namespace”。


<!--
## IngressClassList {#IngressClassList}

IngressClassList is a collection of IngressClasses.

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClassList
-->
# IngressClassList {#IngressClassList}

IngressClassList 是 IngressClass 的集合

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), required

  Items is the list of IngressClasses.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。

- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), required

  Items 是 IngressClasses 列表。


<!--
## Operations {#Operations}

<hr>

### `get` read the specified IngressClass

#### HTTP Request

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters
-->
## Operations {#Operations}

<hr>

### `get` 读取指定 IngressClass

#### HTTP 请求

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

#### 参数

<!-->
- **name** (*in path*): string, required

  name of the IngressClass


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (*in path*): string, 必选

  IngressClass名称


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: Unauthorized
-->
#### 请求


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: 未授权

<!--
### `list` list or watch objects of kind IngressClass

#### HTTP Request

GET /apis/networking.k8s.io/v1/ingressclasses

#### Parameters
-->
### `list` 列出或查看 IngressClass

#### HTTP 请求

GET /apis/networking.k8s.io/v1/ingressclasses

#### 参数

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


<!-->
#### Response


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): OK

401: 未授权

<!--
### `create` create an IngressClass

#### HTTP Request

POST /apis/networking.k8s.io/v1/ingressclasses

#### Parameters
-->
### `create` 创建一个 IngressClass

#### HTTP 请求

POST /apis/networking.k8s.io/v1/ingressclasses

#### 参数

<!--
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, 必选

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: 未授权

<!--
### `update` replace the specified IngressClass

#### HTTP Request

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters
-->
### `update` 替换指定 IngressClass

#### HTTP 请求

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

#### 应答

<!--
- **name** (*in path*): string, required

  name of the IngressClass


- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **name** (*in path*): string, 必选

  IngressClass名称


- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, 必选 



- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: 未授权

<!--
### `patch` partially update the specified IngressClass

#### HTTP Request

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters
-->
### `patch` 部分更新指定 IngressClass

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (*in path*): string, required

  IngressClass名称


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必选

  


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


<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: 未授权

<!--
### `delete` delete an IngressClass

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters
-->
### `delete` 删除一个 IngressClass

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **name** (*in path*): string, 必选

  IngressClass名称


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>  





- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: 未授权


<!--
### `deletecollection` delete collection of IngressClass

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/ingressclasses

#### Parameters
-->
### `deletecollection` 删除 IngressClass 集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/ingressclasses

#### 参数

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


<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授权
