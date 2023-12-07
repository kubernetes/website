---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass 代表 Ingress 的类，被 Ingress 的规约引用。"
title: "IngressClass"
weight: 5
---

<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass represents the class of the Ingress, referenced by the Ingress Spec."
title: "IngressClass"
weight: 5
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

<!--
## IngressClass {#IngressClass}

IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class.
-->
## IngressClass {#IngressClass}

IngressClass 代表 Ingress 的类，被 Ingress 的规约引用。
`ingressclass.kubernetes.io/is-default-class`
注解可以用来标明一个 IngressClass 应该被视为默认的 Ingress 类。
当某个 IngressClass 资源将此注解设置为 true 时，
没有指定类的新 Ingress 资源将被分配到此默认类。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  <!--
  Spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  spec 是 IngressClass 的期望状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IngressClassSpec {#IngressClassSpec}

<!--
IngressClassSpec provides information about the class of an Ingress.
-->
IngressClassSpec 提供有关 Ingress 类的信息。

<hr>

- **controller** (string)

  <!--
  controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different Parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable.
  -->
  
  controller 是指应该处理此类的控制器名称。
  这允许由同一控制器控制不同“口味”。例如，对于同一个实现的控制器你可能有不同的参数。
  此字段应该指定为长度不超过 250 个字符的域前缀路径，例如 “acme.io/ingress-controller”。
  该字段是不可变的。

- **parameters** (IngressClassParametersReference)

  <!--
  parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters.
  -->
  
  parameters 是指向控制器中包含额外配置的自定义资源的链接。
  如果控制器不需要额外的属性，这是可选的。

  <a name="IngressClassParametersReference"></a>
  <!--
  *IngressClassParametersReference identifies an API object. This can be used to specify a cluster or namespace-scoped resource.*
  -->
  **IngressClassParametersReference 标识一个 API 对象。这可以用来指定一个集群或者命名空间范围的资源**

  <!--
  - **parameters.kind** (string), required

    kind is the type of resource being referenced.
  -->

  - **parameters.kind** (string)，必需
    
    kind 是被引用资源的类型。

  <!--
  - **parameters.name** (string), required

    name is the name of resource being referenced.
  -->

  - **parameters.name** (string)，必需

    name 是被引用资源的名称。

  - **parameters.apiGroup** (string)
    <!--
    apiGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
    -->

    apiGroup 是被引用资源的组。
    如果未指定 apiGroup，则被指定的 kind 必须在核心 API 组中。
    对于任何其他第三方类型，apiGroup 是必需的。

  - **parameters.namespace** (string)
    <!--
    namespace is the namespace of the resource being referenced. This field is required when scope is set to "Namespace" and must be unset when scope is set to "Cluster".
    -->

    namespace 是被引用资源的命名空间。
    当范围被设置为 “namespace” 时，此字段是必需的；
    当范围被设置为 “Cluster” 时，此字段必须不设置。

  - **parameters.scope** (string)
    <!--
    scope represents if this refers to a cluster or namespace scoped resource. This may be set to "Cluster" (default) or "Namespace".
    -->

    scope 表示是否引用集群或者命名空间范围的资源。
    这可以设置为“集群”（默认）或者“命名空间”。

## IngressClassList {#IngressClassList}

<!--
IngressClassList is a collection of IngressClasses.
-->
IngressClassList 是 IngressClasses 的集合。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata.
  -->
  标准的列表元数据。

<!--
- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), required

  items is the list of IngressClasses.
-->
- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>)，必需

  items 是 IngressClasses 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified IngressClass

#### HTTP Request
-->
### `get` 读取指定的 IngressClass

#### HTTP 请求

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路径参数**）：string，必需

  IngressClass 的名称

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind IngressClass
#### HTTP Request
-->
### `list` 列出或监视 IngressClass 类型的对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1/ingressclasses

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): OK

401: Unauthorized

<!--
### `create` create an IngressClass

#### HTTP Request
-->
### `create` 创建一个 IngressClass

#### HTTP 请求

POST /apis/networking.k8s.io/v1/ingressclasses

<!--
#### Parameters
-->
#### 参数

<!--
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified IngressClass

#### HTTP Request
-->
### `update` 替换指定的 IngressClass

#### HTTP 请求

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路径参数**）：string，必需

  IngressClass 的名称

<!--
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified IngressClass

#### HTTP Request
-->
### `patch` 部分更新指定的 IngressClass

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路径参数**）：string，必需

  IngressClass 的名称

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

<!--
### `delete` delete an IngressClass

#### HTTP Request
-->
### `delete` 删除一个 IngressClass

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路径参数**）：string，必需

  IngressClass 的名称

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** （**查询字符串**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of IngressClass

#### HTTP Request
-->
### `deletecollection` 删除 IngressClass 的集合

DELETE /apis/networking.k8s.io/v1/ingressclasses

<!--
#### Parameters
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** （**查询字符串**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
