---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview 检查当前用户是否可以执行某操作。"
title: "SelfSubjectAccessReview"
weight: 2
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview checks whether or the current user can perform an action."
title: "SelfSubjectAccessReview"
weight: 2
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectAccessReview {#SelfSubjectAccessReview}

<!--
SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action
-->
SelfSubjectAccessReview 检查当前用户是否可以执行某操作。
不填写 `spec.namespace` 表示“在所有命名空间中”。
Self 是一个特殊情况，因为用户应始终能够检查自己是否可以执行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SelfSubjectAccessReview

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated.  user and groups must be empty
  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>)，必需

  spec 包含有关正在评估的请求的信息。
  user 和 group 必须为空。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  status 由服务器填写，表示请求是否被允许。

## SelfSubjectAccessReviewSpec {#SelfSubjectAccessReviewSpec}

<!--
SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SelfSubjectAccessReviewSpec 是访问请求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes
二者必须设置其一，并且只能设置其一。

<hr>

<!--
- **nonResourceAttributes** (NonResourceAttributes)
  NonResourceAttributes describes information for a non-resource access request
  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface*
  - **nonResourceAttributes.path** (string)
    Path is the URL path of the request
  - **nonResourceAttributes.verb** (string)
    Verb is the standard HTTP verb
-->

- **nonResourceAttributes** (NonResourceAttributes)

  nonResourceAttributes 描述非资源访问请求的信息。

  <a name="NonResourceAttributes"></a>
  **nonResourceAttributes 包括提供给 Authorizer 接口进行非资源请求鉴权时所用的属性。**

  - **nonResourceAttributes.path** (string)

    path 是请求的 URL 路径。

  - **nonResourceAttributes.verb** (string)

    verb 是标准的 HTTP 动作。

<!--
- **resourceAttributes** (ResourceAttributes)
  ResourceAuthorizationAttributes describes information for a resource access request

  <a name="ResourceAttributes"></a>
  *ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface*
-->
- **resourceAttributes** (ResourceAttributes)
  
  resourceAuthorizationAttributes 描述资源访问请求的信息。

  <a name="ResourceAttributes"></a>
  **resourceAttributes 包括提供给 Authorizer 接口进行资源请求鉴权时所用的属性。**

  <!--
  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector describes the limitation on access based on field.  It can only limit access, not broaden it.
  -->

  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector 描述基于字段的访问限制。此字段只能限制访问权限，而不能扩大访问权限。

    <!--
    <a name="FieldSelectorAttributes"></a>
    *FieldSelectorAttributes indicates a field limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*
    -->

    <a name="FieldSelectorAttributes"></a>
    FieldSelectorAttributes 表示一个限制访问的字段。建议 Webhook 的开发者们：

    * 确保 rawSelector 和 requirements 未被同时设置。
    * 如果设置了 fieldSelector，则考虑 requirements 字段。
    * 如果设置了 fieldSelector，不要尝试解析或考虑 rawSelector 字段。

    这是为了避免出现另一个 CVE-2022-2880（即我们不希望不同系统以一致的方式解析某个查询），
    有关细节参见 https://www.oxeye.io/resources/golang-parameter-smuggling-attack。
    对于 kube-apiserver 的 SubjectAccessReview 端点：

    * 如果 rawSelector 为空且 requirements 为空，则请求未被限制。
    * 如果 rawSelector 存在且 requirements 为空，则 rawSelector 将被解析，并在解析成功的情况下进行限制。
    * 如果 rawSelector 为空且 requirements 存在，则应优先使用 requirements。
    * 如果 rawSelector 存在，requirements 也存在，则请求无效。

    <!--
    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.
    -->

    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector 是字段选择算符的序列化形式，将被包含在查询参数中。
      建议 Webhook 实现忽略 rawSelector。只要 requirements 不存在，
      kube-apiserver 的 SubjectAccessReview 将解析 rawSelector。

    <!--
    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      *Atomic: will be replaced during a merge*

      requirements is the parsed interpretation of a field selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="FieldSelectorRequirement"></a>
      *FieldSelectorRequirement is a selector that contains values, a key, and an operator that relates the key and values.*
    -->

    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      **原子：将在合并期间被替换**

      requirements 是字段选择算符已解析的解释。资源实例必须满足所有 requirements 才能匹配此选择算符。
      Webhook 实现应处理 requirements，但如何处理由 Webhook 自行决定。
      由于 requirements 只能限制请求，因此如果不理解 requirements，可以安全地将请求鉴权为无限制请求。

      <a name="FieldSelectorRequirement"></a>
      **FieldSelectorRequirement 是一个选择算符，包含值、键以及与将键和值关联起来的运算符。**

      <!--
      - **resourceAttributes.fieldSelector.requirements.key** (string), required

        key is the field selector key that the requirement applies to.

      - **resourceAttributes.fieldSelector.requirements.operator** (string), required

        operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. The list of operators may grow in the future.

      - **resourceAttributes.fieldSelector.requirements.values** ([]string)

        *Atomic: will be replaced during a merge*
        
        values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty.
      -->

      - **resourceAttributes.fieldSelector.requirements.key** (string)，必需

        key 是 requirements 应用到的字段选择算符键。

      - **resourceAttributes.fieldSelector.requirements.operator** (string)，必需

        operator 表示键与一组值之间的关系。有效的运算符有 In、NotIn、Exists、DoesNotExist。
        运算符列表可能会在未来增加。

      - **resourceAttributes.fieldSelector.requirements.values**（[]string）

        **原子：将在合并期间被替换**

        values 是一个字符串值的数组。如果运算符是 In 或 NotIn，则 values 数组必须非空。
        如果运算符是 Exists 或 DoesNotExist，则 values 数组必须为空。

  <!--
  - **resourceAttributes.group** (string)
    Group is the API Group of the Resource.  "*" means all.
  -->

  - **resourceAttributes.group** (string)
    
    group 是资源的 API 组。"*" 表示所有组。

  <!--
  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector describes the limitation on access based on labels.  It can only limit access, not broaden it.
  -->

  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector 描述基于标签的访问限制。此字段只能限制访问权限，而不能扩大访问权限。

    <!--
    <a name="LabelSelectorAttributes"></a>
    *LabelSelectorAttributes indicates a label limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*
    -->

    <a name="LabelSelectorAttributes"></a>
    LabelSelectorAttributes 表示通过标签限制的访问。建议 Webhook 开发者们：

    * 确保 rawSelector 和 requirements 未被同时设置。
    * 如果设置了 labelSelector，则考虑 requirements 字段。
    * 如果设置了 labelSelector，不要尝试解析或考虑 rawSelector 字段。

    这是为了避免出现另一个 CVE-2022-2880（即让不同系统以一致的方式解析为何某个查询不是我们想要的），
    有关细节参见 https://www.oxeye.io/resources/golang-parameter-smuggling-attack
    对于 kube-apiserver 的 SubjectAccessReview 端点：

    * 如果 rawSelector 为空且 requirements 为空，则请求未被限制。
    * 如果 rawSelector 存在且 requirements 为空，则 rawSelector 将被解析，并在解析成功的情况下进行限制。
    * 如果 rawSelector 为空且 requirements 存在，则应优先使用 requirements。
    * 如果 rawSelector 存在，requirements 也存在，则请求无效。

    <!--
    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.
    -->

    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector 是字段选择算符的序列化形式，将被包含在查询参数中。
      建议 Webhook 实现忽略 rawSelector。只要 requirements 不存在，
      kube-apiserver 的 SubjectAccessReview 将解析 rawSelector。

    <!--
    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      *Atomic: will be replaced during a merge*

      requirements is the parsed interpretation of a label selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="LabelSelectorRequirement"></a>
      *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*
    -->

    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      **原子：将在合并期间被替换**

      requirements 是字段选择算符已解析的解释。资源实例必须满足所有 requirements，才能匹配此选择算符。
      Webhook 实现应处理 requirements，但如何处理由 Webhook 自行决定。
      由于 requirements 只能限制请求，因此如果不理解 requirements，可以安全地将请求鉴权为无限制请求。

      <a name="FieldSelectorRequirement"></a>
      **FieldSelectorRequirement 是一个选择算符，包含值、键以及将键和值关联起来的运算符。**

      <!--
      - **resourceAttributes.labelSelector.requirements.key** (string), required

        key is the label key that the selector applies to.

      - **resourceAttributes.labelSelector.requirements.operator** (string), required

        operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.

      - **resourceAttributes.labelSelector.requirements.values** ([]string)

        *Atomic: will be replaced during a merge*

        values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
      -->

      - **resourceAttributes.labelSelector.requirements.key** (string)，必需

        key 是选择算符应用到的标签键。

      - **resourceAttributes.labelSelector.requirements.operator** (string)，必需

        operator 表示键与一组值之间的关系。有效的运算符有 In、NotIn、Exists、DoesNotExist。

      - **resourceAttributes.labelSelector.requirements.values** ([]string)

        **原子：将在合并期间被替换**

        values 是一个字符串值的数组。如果运算符是 In 或 NotIn，则 values 数组必须非空。
        如果运算符是 Exists 或 DoesNotExist，则 values 数组必须为空。
        此数组在策略性合并补丁（Strategic Merge Patch）期间被替换。

  <!--
  - **resourceAttributes.name** (string)
    Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.
  -->

  - **resourceAttributes.name** (string)

    name 是 "get" 正在请求或 "delete" 已删除的资源的名称。
    ""（空字符串）表示所有资源。

  <!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.
  -->

  - **resourceAttributes.namespace** (string)

    namespace 是正在请求的操作的命名空间。
    目前，无命名空间和所有命名空间之间没有区别。
    对于 LocalSubjectAccessReviews，默认为 ""（空字符串）。
    对于集群范围的资源，默认为 ""（空字符串）。
    对于来自 SubjectAccessReview 或 SelfSubjectAccessReview 的命名空间范围的资源，
    ""（空字符串）表示 "all"（所有资源）。

  - **resourceAttributes.resource** (string)

    resource 是现有的资源类别之一。"*" 表示所有资源类别。

  <!--
  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.

  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
  -->

  - **resourceAttributes.subresource** (string)

    subresource 是现有的资源类型之一。"" 表示无。

  - **resourceAttributes.verb** (string)

    verb 是 kubernetes 资源 API 动作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有动作。

  - **resourceAttributes.version** (string)

    version 是资源的 API 版本。"*" 表示所有版本。

<!--
## Operations {#Operations}

<hr>

### `create` create a SelfSubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 SelfSubjectAccessReview

#### HTTP 请求

POST /apis/authorization.k8s.io/v1/selfsubjectaccessreviews

<!--
#### Parameters

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>, required

- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Accepted

401: Unauthorized
