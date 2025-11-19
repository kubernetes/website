---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectRulesReview"
content_type: "api_reference"
description: "SelfSubjectRulesReview 枚舉當前使用者可以在某命名空間內執行的操作集合。"
title: "SelfSubjectRulesReview"
weight: 3
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectRulesReview"
content_type: "api_reference"
description: "SelfSubjectRulesReview enumerates the set of actions the current user can perform within a namespace."
title: "SelfSubjectRulesReview"
weight: 3
-->
`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectRulesReview {#SelfSubjectRulesReview}
<!--
SelfSubjectRulesReview enumerates the set of actions the current user can perform within a namespace. The returned list of actions may be incomplete depending on the server's authorization mode, and any errors experienced during the evaluation. SelfSubjectRulesReview should be used by UIs to show/hide actions, or to quickly let an end user reason about their permissions. It should NOT Be used by external systems to drive authorization decisions as this raises confused deputy, cache lifetime/revocation, and correctness concerns. SubjectAccessReview, and LocalAccessReview are the correct way to defer authorization decisions to the API server.
-->
SelfSubjectRulesReview 枚舉當前使用者可以在某命名空間內執行的操作集合。
返回的操作列表可能不完整，具體取決於伺服器的鑑權模式以及評估過程中遇到的任何錯誤。
SelfSubjectRulesReview 應由 UI 用於顯示/隱藏操作，或讓最終使用者儘快理解自己的權限。
SelfSubjectRulesReview 不得被外部系統使用以驅動鑑權決策，
因爲這會引起混淆代理人（Confused deputy）、緩存有效期/吊銷（Cache lifetime/revocation）和正確性問題。
SubjectAccessReview 和 LocalAccessReview 是遵從 API 伺服器所做鑑權決策的正確方式。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SelfSubjectRulesReview

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReviewSpec" >}}">SelfSubjectRulesReviewSpec</a>), required

  Spec holds information about the request being evaluated.
-->  
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReviewSpec" >}}">SelfSubjectRulesReviewSpec</a>)，必需
  
  spec 包含有關正在評估的請求的信息。
<!--
- **status** (SubjectRulesReviewStatus)
  Status is filled in by the server and indicates the set of actions a user can perform.
  <a name="SubjectRulesReviewStatus"></a>
  *SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it's safe to assume the subject has that permission, even if that list is incomplete.*
-->
- **status** (SubjectRulesReviewStatus)
  
  status 由伺服器填寫，表示使用者可以執行的操作的集合。
  
  <a name="SubjectRulesReviewStatus"></a>
  **SubjectRulesReviewStatus 包含規則檢查的結果。
  此檢查可能不完整，具體取決於伺服器設定的 Authorizer 的集合以及評估期間遇到的任何錯誤。
  由於鑑權規則是疊加的，所以如果某個規則出現在列表中，即使該列表不完整，也可以安全地假定該主體擁有該權限。**

  <!--
  - **status.incomplete** (boolean), required
    Incomplete is true when the rules returned by this call are incomplete. This is most commonly encountered when an authorizer, such as an external authorizer, doesn't support rules evaluation.
  - **status.nonResourceRules** ([]NonResourceRule), required
 
    *Atomic: will be replaced during a merge*
  
    NonResourceRules is the list of actions the subject is allowed to perform on non-resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
    <a name="NonResourceRule"></a>
    *NonResourceRule holds information that describes a rule for the non-resource*
  -->

  - **status.incomplete** (boolean)，必需
    
    當此調用返回的規則不完整時，incomplete 結果爲 true。
    這種情況常見於 Authorizer（例如外部 Authorizer）不支持規則評估時。
  
  - **status.nonResourceRules** ([]NonResourceRule)，必需

    **原子性：合併期間將被替換**
   
    nonResourceRules 是允許主體對非資源執行路徑執行的操作列表。
    該列表順序不重要，可以包含重複項，還可能不完整。
    
    <a name="NonResourceRule"></a>
    **nonResourceRule 包含描述非資源路徑的規則的信息。**

    <!--
    - **status.nonResourceRules.verbs** ([]string), required
      *Atomic: will be replaced during a merge*
      Verb is a list of kubernetes non-resource API verbs, like: get, post, put, delete, patch, head, options.  "*" means all.
    - **status.nonResourceRules.nonResourceURLs** ([]string)
      NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path.  "*" means all. 
    -->

    - **status.nonResourceRules.verbs** ([]string)，必需

      **原子性：合併期間將被替換**
      
      verb 是 kubernetes 非資源 API 動作的列表，例如 get、post、put、delete、patch、head、options。
      `*` 表示所有動作。
    
    - **status.nonResourceRules.nonResourceURLs** ([]string)
      
      nonResourceURLs 是使用者應有權訪問的一組部分 URL。
      允許使用 `*`，但僅能作爲路徑中最後一段且必須用於完整的一段。
      `*` 表示全部。
      
  <!--
  - **status.resourceRules** ([]ResourceRule), required
    *Atomic: will be replaced during a merge*
    ResourceRules is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
    <a name="ResourceRule"></a>
    *ResourceRule is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.*
    - **status.resourceRules.verbs** ([]string), required
      *Atomic: will be replaced during a merge*
      Verb is a list of kubernetes resource API verbs, like: get, list, watch, create, update, delete, proxy.  "*" means all. 
  -->

  - **status.resourceRules** ([]ResourceRule)，必需
  
    **原子性：合併期間將被替換**
  
    resourceRules 是允許主體對資源執行的操作的列表。
    該列表順序不重要，可以包含重複項，還可能不完整。
    
    <a name="ResourceRule"></a>
    **resourceRule 是允許主體對資源執行的操作的列表。該列表順序不重要，可以包含重複項，還可能不完整。**
    
    - **status.resourceRules.verbs** ([]string)，必需

      **原子性：合併期間將被替換**
      
      verb 是 kubernetes 資源 API 動作的列表，例如 get、list、watch、create、update、delete、proxy。
      `*` 表示所有動作。

    <!--
    - **status.resourceRules.apiGroups** ([]string)
      *Atomic: will be replaced during a merge*
      APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed.  "*" means all.
    - **status.resourceRules.resourceNames** ([]string)
      *Atomic: will be replaced during a merge*
      ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.  "*" means all.
    - **status.resourceRules.resources** ([]string)
      *Atomic: will be replaced during a merge*
      Resources is a list of resources this rule applies to.  "*" means all in the specified apiGroups.
       "*/foo" represents the subresource 'foo' for all resources in the specified apiGroups.
    -->

    - **status.resourceRules.apiGroups** ([]string)

      **原子性：合併期間將被替換**
      
      apiGroups 是包含資源的 APIGroup 的名稱。
      如果指定了多個 API 組，則允許對任何 API 組中枚舉的資源之一請求任何操作。
      `*` 表示所有 APIGroup。
    
    - **status.resourceRules.resourceNames** ([]string)

      **原子性：合併期間將被替換**
      
      resourceNames 是此規則所適用的資源名稱白名單，可選。
      空集合意味着允許所有資源。
      `*` 表示所有資源。
    
    - **status.resourceRules.resources** ([]string)

      **原子性：合併期間將被替換**
      
      resources 是此規則所適用的資源的列表。
      `*` 表示指定 APIGroup 中的所有資源。
      `*/foo` 表示指定 APIGroup 中所有資源的子資源 "foo"。

  <!--
  - **status.evaluationError** (string)
    EvaluationError can appear in combination with Rules. It indicates an error occurred during rule evaluation, such as an authorizer that doesn't support rule evaluation, and that ResourceRules and/or NonResourceRules may be incomplete.
  -->

  - **status.evaluationError** (string)
    
    evaluationError 可以與 rules 一起出現。
    它表示在規則評估期間發生錯誤，例如 Authorizer 不支持規則評估以及 resourceRules 和/或 nonResourceRules 可能不完整。

## SelfSubjectRulesReviewSpec {#SelfSubjectRulesReviewSpec}

<!--
SelfSubjectRulesReviewSpec defines the specification for SelfSubjectRulesReview.

<hr>

- **namespace** (string)

  Namespace to evaluate rules for. Required.
-->
SelfSubjectRulesReviewSpec 定義 SelfSubjectRulesReview 的規範。

<hr>

- **namespace** (string)
  
  namespace 是要評估規則的命名空間。
  必需。

<!--
## Operations {#Operations}

<hr>

### `create` create a SelfSubjectRulesReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 創建 SelfSubjectRulesReview

#### HTTP 請求

POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews
<!--
#### Parameters

- **body**: <a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>, required

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

- **body**: <a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Accepted

401: Unauthorized
