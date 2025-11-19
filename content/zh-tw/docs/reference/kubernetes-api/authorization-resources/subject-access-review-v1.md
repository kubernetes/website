---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview 檢查用戶或組是否可以執行某操作。"
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
SubjectAccessReview 檢查用戶或組是否可以執行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated
- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>)，必需

  spec 包含有關正在評估的請求的信息。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  status 由服務器填寫，表示請求是否被允許。

## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

<!--
SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SubjectAccessReviewSpec 是訪問請求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必須設置其一，並且只能設置其一。

<hr>

<!--
- **extra** (map[string][]string)

  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.

- **groups** ([]string)

  *Atomic: will be replaced during a merge*
 
  Groups is the groups you're testing for.
-->
- **extra** (map[string][]string)

  extra 對應於來自鑑權器的 user.Info.GetExtra() 方法。
  由於這是針對 Authorizer 的輸入，所以它需要在此處反映。

- **groups** ([]string)

  **原子：將在合併期間被替換**

  groups 是你正在測試的組。

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

  nonResourceAttributes 描述非資源訪問請求的信息。

  <a name="NonResourceAttributes"></a> 
  **nonResourceAttributes 包括提供給 Authorizer 接口進行非資源請求鑑權時所用的屬性。**
  
  - **nonResourceAttributes.path** (string)

    path 是請求的 URL 路徑。

  - **nonResourceAttributes.verb** (string)

    verb 是標準的 HTTP 動作。

<!--
- **resourceAttributes** (ResourceAttributes)

  ResourceAuthorizationAttributes describes information for a resource access request

  <a name="ResourceAttributes"></a>
  *ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface*
-->
- **resourceAttributes** (ResourceAttributes)

  resourceAuthorizationAttributes 描述資源訪問請求的信息。

  <a name="ResourceAttributes"></a> 
  **resourceAttributes 包括提供給 Authorizer 接口進行資源請求鑑權時所用的屬性。**

  <!--
  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector describes the limitation on access based on field.  It can only limit access, not broaden it.
  -->

  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector 描述基於字段的訪問限制。此字段只能限制訪問權限，而不能擴大訪問權限。

    <!--
    <a name="FieldSelectorAttributes"></a>
    *FieldSelectorAttributes indicates a field limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*
    -->

    <a name="FieldSelectorAttributes"></a>
    FieldSelectorAttributes 表示一個限制訪問的字段。建議 Webhook 的開發者們：

    * 確保 rawSelector 和 requirements 未被同時設置
    * 如果設置，則考慮 requirements 字段
    * 如果設置，不要嘗試解析或考慮 rawSelector 字段。

    這是爲了避免出現另一個 CVE-2022-2880（即我們不希望不同系統以一致的方式解析某個查詢），
    有關細節參見 https://www.oxeye.io/resources/golang-parameter-smuggling-attack
    對於 kube-apiserver 的 SubjectAccessReview 端點：

    * 如果 rawSelector 爲空且 requirements 爲空，則請求未被限制。
    * 如果 rawSelector 存在且 requirements 爲空，則 rawSelector 將被解析，並在解析成功的情況下進行限制。
    * 如果 rawSelector 爲空且 requirements 存在，則應優先使用 requirements。
    * 如果 rawSelector 存在，requirements 也存在，則請求無效。

    <!--
    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.
    -->

    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector 是字段選擇算符的序列化形式，將被包含在查詢參數中。
      建議 Webhook 實現忽略 rawSelector。只要 requirements 不存在，
      kube-apiserver 的 SubjectAccessReview 將解析 rawSelector。

    <!--
    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      *Atomic: will be replaced during a merge*
      
      requirements is the parsed interpretation of a field selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="FieldSelectorRequirement"></a>
      *FieldSelectorRequirement is a selector that contains values, a key, and an operator that relates the key and values.*
    -->

    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      **原子：將在合併期間被替換**

      requirements 是字段選擇算符已解析的解釋。資源實例必須滿足所有 requirements 才能匹配此選擇算符。
      Webhook 實現應處理 requirements，但如何處理由 Webhook 自行決定。
      由於 requirements 只能限制請求，因此如果不理解 requirements，可以安全地將請求鑑權爲無限制請求。

      <a name="FieldSelectorRequirement"></a>
      **FieldSelectorRequirement 是一個選擇算符，包含值、鍵以及與將鍵和值關聯起來的運算符。**

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

        key 是 requirements 應用到的字段選擇算符鍵。

      - **resourceAttributes.fieldSelector.requirements.operator** (string)，必需

        operator 表示鍵與一組值之間的關係。有效的運算符有 In、NotIn、Exists、DoesNotExist。
        運算符列表可能會在未來增加。

      - **resourceAttributes.fieldSelector.requirements.values**（[]string）

        **原子：將在合併期間被替換**

        values 是一個字符串值的數組。如果運算符是 In 或 NotIn，則 values 數組必須非空。
        如果運算符是 Exists 或 DoesNotExist，則 values 數組必須爲空。

  <!--
  - **resourceAttributes.group** (string)

    Group is the API Group of the Resource.  "*" means all.
  -->

  - **resourceAttributes.group** (string)

    group 是資源的 API 組。
    "*" 表示所有資源。

  <!--
  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector describes the limitation on access based on labels.  It can only limit access, not broaden it.
  -->

  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector 描述基於標籤的訪問限制。此字段只能限制訪問權限，而不能擴大訪問權限。

    <!--
    <a name="LabelSelectorAttributes"></a>
    *LabelSelectorAttributes indicates a label limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*
    -->

    <a name="LabelSelectorAttributes"></a>
    LabelSelectorAttributes 表示通過標籤限制的訪問。建議 Webhook 開發者們：

    * 確保 rawSelector 和 requirements 未被同時設置
    * 如果設置，則考慮 requirements 字段
    * 如果設置，不要嘗試解析或考慮 rawSelector 字段。

    這是爲了避免出現另一個 CVE-2022-2880（即讓不同系統以一致的方式解析爲何某個查詢不是我們想要的），
    有關細節參見 https://www.oxeye.io/resources/golang-parameter-smuggling-attack
    對於 kube-apiserver 的 SubjectAccessReview 端點：

    * 如果 rawSelector 爲空且 requirements 爲空，則請求未被限制。
    * 如果 rawSelector 存在且 requirements 爲空，則 rawSelector 將被解析，並在解析成功的情況下進行限制。
    * 如果 rawSelector 爲空且 requirements 存在，則應優先使用 requirements。
    * 如果 rawSelector 存在，requirements 也存在，則請求無效。

    <!--
    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.
    -->

    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector 是字段選擇算符的序列化形式，將被包含在查詢參數中。
      建議 Webhook 實現忽略 rawSelector。只要 requirements 不存在，
      kube-apiserver 的 SubjectAccessReview 將解析 rawSelector。

    <!--
    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      *Atomic: will be replaced during a merge*

      requirements is the parsed interpretation of a label selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="LabelSelectorRequirement"></a>
      *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*
    -->

    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      **原子：將在合併期間被替換**

      requirements 是字段選擇算符已解析的解釋。資源實例必須滿足所有 requirements，才能匹配此選擇算符。
      Webhook 實現應處理 requirements，但如何處理由 Webhook 自行決定。
      由於 requirements 只能限制請求，因此如果不理解 requirements，可以安全地將請求鑑權爲無限制請求。

      <a name="FieldSelectorRequirement"></a>
      **FieldSelectorRequirement 是一個選擇算符，包含值、鍵以及將鍵和值關聯起來的運算符。**

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

        key 是選擇算符應用到的標籤鍵。

      - **resourceAttributes.labelSelector.requirements.operator** (string)，必需

        operator 表示鍵與一組值之間的關係。有效的運算符有 In、NotIn、Exists、DoesNotExist。

      - **resourceAttributes.labelSelector.requirements.values** ([]string)

        **原子：將在合併期間被替換**

        values 是一個字符串值的數組。如果運算符是 In 或 NotIn，則 values 數組必須非空。
        如果運算符是 Exists 或 DoesNotExist，則 values 數組必須爲空。
        此數組在策略性合併補丁（Strategic Merge Patch）期間被替換。

  <!--
  - **resourceAttributes.name** (string)

    Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.
  -->

  - **resourceAttributes.name** (string)

    name 是 "get" 正在請求或 "delete" 已刪除的資源。
    ""（空字符串）表示所有資源。

  <!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.
  -->

  - **resourceAttributes.namespace** (string)

    namespace 是正在請求的操作的命名空間。
    目前，無命名空間和所有命名空間之間沒有區別。
    對於 LocalSubjectAccessReviews，默認爲 ""（空字符串）。
    對於集羣範圍的資源，默認爲 ""（空字符串）。
    對於來自 SubjectAccessReview 或 SelfSubjectAccessReview 的命名空間範圍的資源，
    ""（空字符串）表示 "all"（所有資源）。

  - **resourceAttributes.resource** (string)

    resource 是現有的資源類別之一。
    "*" 表示所有資源類別。

  - **resourceAttributes.subresource** (string)

    subresource 是現有的資源類別之一。
    "" 表示無子資源。

  <!--
  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
  -->

  - **resourceAttributes.verb** (string)

    verb 是 kubernetes 資源的 API 動作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有動作。

  - **resourceAttributes.version** (string)

    version 是資源的 API 版本。
    "*" 表示所有版本。

<!--
- **uid** (string)
  UID information about the requesting user.

- **user** (string)
  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups
-->

- **uid** (string)

  有關正在請求的用戶的 UID 信息。

- **user** (string)

  user 是你正在測試的用戶。
  如果你指定 “user” 而不是 “groups”，它將被解讀爲“如果 user 不是任何組的成員，將會怎樣”。

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
  如果允許該操作，則爲 true，否則爲 false。

- **denied** (boolean)

  denied 是可選的。
  如果拒絕該操作，則爲 true，否則爲 false。
  如果 allowed 和 denied 均爲 false，則 Authorizer 對是否鑑權操作沒有意見。
  如果 allowed 爲 true，則 denied 不能爲 true。

<!--
- **evaluationError** (string)
  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)
  Reason is optional.  It indicates why a request was allowed or denied.
-->
- **evaluationError** (string)

  evaluationError 表示鑑權檢查期間發生一些錯誤。
  出現錯誤的情況下完全有可能繼續確定鑑權狀態。
  例如，RBAC 可能缺少一個角色，但仍存在足夠多的角色進行綁定，進而瞭解請求有關的原因。

- **reason** (string)

  reason 是可選的。
  它表示爲什麼允許或拒絕請求。

<!--
## Operations {#Operations}

<hr>

### `create` create a SubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 創建 SubjectAccessReview

#### HTTP 請求

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
#### 參數

- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized
