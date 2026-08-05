---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview 检查用户或组是否可以执行某操作。"
title: "SubjectAccessReview"
weight: 4
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview checks whether or not a user or group can perform an action."
title: "SubjectAccessReview"
weight: 4
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SubjectAccessReview {#SubjectAccessReview}

<!--
SubjectAccessReview checks whether or not a user or group can perform an action.
-->
SubjectAccessReview 检查用户或组是否可以执行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated
- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>)，必需

  spec 包含有关正在评估的请求的信息。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  status 由服务器填写，表示请求是否被允许。

## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

<!--
SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SubjectAccessReviewSpec 是访问请求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必须设置其一，并且只能设置其一。

<hr>

<!--
- **extra** (map[string][]string)

  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.

- **groups** ([]string)

  *Atomic: will be replaced during a merge*
 
  Groups is the groups you're testing for.
-->
- **extra** (map[string][]string)

  extra 对应于来自鉴权器的 user.Info.GetExtra() 方法。
  由于这是针对 Authorizer 的输入，所以它需要在此处反映。

- **groups** ([]string)

  **原子：将在合并期间被替换**

  groups 是你正在测试的组。

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

    * 确保 rawSelector 和 requirements 未被同时设置
    * 如果设置，则考虑 requirements 字段
    * 如果设置，不要尝试解析或考虑 rawSelector 字段。

    这是为了避免出现另一个 CVE-2022-2880（即我们不希望不同系统以一致的方式解析某个查询），
    有关细节参见 https://www.oxeye.io/resources/golang-parameter-smuggling-attack
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

    group 是资源的 API 组。
    "*" 表示所有资源。

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

    * 确保 rawSelector 和 requirements 未被同时设置
    * 如果设置，则考虑 requirements 字段
    * 如果设置，不要尝试解析或考虑 rawSelector 字段。

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

    name 是 "get" 正在请求或 "delete" 已删除的资源。
    ""（空字符串）表示所有资源。

  <!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.
  -->

  - **resourceAttributes.namespace** (string)

    namespace 是正在请求的操作的命名空间。
    目前，无命名空间和所有命名空间之间没有区别。
    对于 LocalSubjectAccessReviews，默认为 ""（空字符串）。
    对于集群范围的资源，默认为 ""（空字符串）。
    对于来自 SubjectAccessReview 或 SelfSubjectAccessReview 的命名空间范围的资源，
    ""（空字符串）表示 "all"（所有资源）。

  - **resourceAttributes.resource** (string)

    resource 是现有的资源类别之一。
    "*" 表示所有资源类别。

  - **resourceAttributes.subresource** (string)

    subresource 是现有的资源类别之一。
    "" 表示无子资源。

  <!--
  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
  -->

  - **resourceAttributes.verb** (string)

    verb 是 kubernetes 资源的 API 动作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有动作。

  - **resourceAttributes.version** (string)

    version 是资源的 API 版本。
    "*" 表示所有版本。

<!--
- **uid** (string)
  UID information about the requesting user.

- **user** (string)
  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups
-->

- **uid** (string)

  有关正在请求的用户的 UID 信息。

- **user** (string)

  user 是你正在测试的用户。
  如果你指定 “user” 而不是 “groups”，它将被解读为“如果 user 不是任何组的成员，将会怎样”。

## SubjectAccessReviewStatus {#SubjectAccessReviewStatus}

SubjectAccessReviewStatus

<hr>

<!--
- **allowed** (boolean), required
  Allowed is required. True if the action would be allowed, false otherwise.

- **denied** (boolean)
  Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true.
-->
- **allowed** (boolean)，必需

  allowed 是必需的。
  如果允许该操作，则为 true，否则为 false。

- **denied** (boolean)

  denied 是可选的。
  如果拒绝该操作，则为 true，否则为 false。
  如果 allowed 和 denied 均为 false，则 Authorizer 对是否鉴权操作没有意见。
  如果 allowed 为 true，则 denied 不能为 true。

<!--
- **evaluationError** (string)
  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)
  Reason is optional.  It indicates why a request was allowed or denied.
-->
- **evaluationError** (string)

  evaluationError 表示鉴权检查期间发生一些错误。
  出现错误的情况下完全有可能继续确定鉴权状态。
  例如，RBAC 可能缺少一个角色，但仍存在足够多的角色进行绑定，进而了解请求有关的原因。

- **reason** (string)

  reason 是可选的。
  它表示为什么允许或拒绝请求。

<!--
## Operations {#Operations}

<hr>

### `create` create a SubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 SubjectAccessReview

#### HTTP 请求

POST /apis/authorization.k8s.io/v1/subjectaccessreviews

<!--
#### Parameters
- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>, required
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

- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized
