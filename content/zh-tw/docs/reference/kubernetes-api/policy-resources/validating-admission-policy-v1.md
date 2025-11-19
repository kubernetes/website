---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ValidatingAdmissionPolicy"
content_type: "api_reference"
description: "ValidatingAdmissionPolicy 描述了一種准入驗證策略的定義，這種策略接受或拒絕一個對象而不對其進行修改。"
title: "ValidatingAdmissionPolicy"
weight: 7
---
<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ValidatingAdmissionPolicy"
content_type: "api_reference"
description: "ValidatingAdmissionPolicy describes the definition of an admission validation policy that accepts or rejects an object without changing it."
title: "ValidatingAdmissionPolicy"
weight: 7
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ValidatingAdmissionPolicy {#ValidatingAdmissionPolicy}

<!--
ValidatingAdmissionPolicy describes the definition of an admission validation policy that accepts or rejects an object without changing it.
-->
ValidatingAdmissionPolicy 描述了一種准入驗證策略的定義，
這種策略用於接受或拒絕一個對象，而不對其進行修改。

<hr>

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: ValidatingAdmissionPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.
  -->

  標準的對象元數據；更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicySpec)

  <!--
  Specification of the desired behavior of the ValidatingAdmissionPolicy.
  -->

  ValidatingAdmissionPolicy 的期望行爲規範。

  <a name="ValidatingAdmissionPolicySpec"></a>
  <!--
  *ValidatingAdmissionPolicySpec is the specification of the desired behavior of the AdmissionPolicy.*

  - **spec.auditAnnotations** ([]AuditAnnotation)

    *Atomic: will be replaced during a merge*
    
    auditAnnotations contains CEL expressions which are used to produce audit annotations for the audit event of the API request. validations and auditAnnotations may not both be empty; a least one of validations or auditAnnotations is required.
  -->

  **ValidatingAdmissionPolicySpec** 是 AdmissionPolicy 的期望行爲規範。
  
  - **spec.auditAnnotations** ([]AuditAnnotation)
  
    **原子性：合併期間將被替換**
    
    auditAnnotations 包含用於爲 API 請求的審計事件生成審計註解的 CEL 表達式。
    validations 和 auditAnnotations 不能同時爲空；至少需要 validations 或 auditAnnotations 中的一個。

    <a name="AuditAnnotation"></a>
    <!--
    *AuditAnnotation describes how to produce an audit annotation for an API request.*

    - **spec.auditAnnotations.key** (string), required

      key specifies the audit annotation key. The audit annotation keys of a ValidatingAdmissionPolicy must be unique. The key must be a qualified name ([A-Za-z0-9][-A-Za-z0-9_.]*) no more than 63 bytes in length.
      
      The key is combined with the resource name of the ValidatingAdmissionPolicy to construct an audit annotation key: "{ValidatingAdmissionPolicy name}/{key}".
      
      If an admission webhook uses the same resource name as this ValidatingAdmissionPolicy and the same audit annotation key, the annotation key will be identical. In this case, the first annotation written with the key will be included in the audit event and all subsequent annotations with the same key will be discarded.
      
      Required.
    -->

    **AuditAnnotation** 描述瞭如何爲 API 請求生成審計註解。
    
    - **spec.auditAnnotations.key** (string)，必需
    
      key 指定了審計註解的鍵。ValidatingAdmissionPolicy 的審計註解鍵必須是唯一的。
      鍵必須是一個合格的名字（[A-Za-z0-9][-A-Za-z0-9_.]*），長度不超過 63 字節。
      
      鍵與 ValidatingAdmissionPolicy 的資源名稱組合以構建審計註解鍵："{ValidatingAdmissionPolicy 名稱}/{key}"。
      
      如果一個准入 Webhook 使用與這個 ValidatingAdmissionPolicy 相同的資源名稱和相同的審計註解鍵，
      那麼註解鍵將是相同的。在這種情況下，使用該鍵寫入的第一個註解將包含在審計事件中，
      並且所有後續使用相同鍵的註解將被丟棄。
      
      必需。
  
    <!--
    - **spec.auditAnnotations.valueExpression** (string), required

      valueExpression represents the expression which is evaluated by CEL to produce an audit annotation value. The expression must evaluate to either a string or null value. If the expression evaluates to a string, the audit annotation is included with the string value. If the expression evaluates to null or empty string the audit annotation will be omitted. The valueExpression may be no longer than 5kb in length. If the result of the valueExpression is more than 10kb in length, it will be truncated to 10kb.
      
      If multiple ValidatingAdmissionPolicyBinding resources match an API request, then the valueExpression will be evaluated for each binding. All unique values produced by the valueExpressions will be joined together in a comma-separated list.
      
      Required.
    -->

    - **spec.auditAnnotations.valueExpression** (string)，必需
    
      valueExpression 表示由 CEL 求值以生成審計註解值的表達式。該表達式求值結果爲字符串或 null 值。
      如果表達式計算爲字符串，則包含帶有字符串值的審計註解。如果表達式計算爲 null 或空字符串，
      則審計註解將被省略。valueExpression 的長度不得超過 5kb。如果 valueExpression
      的結果長度超過 10KB，它將被截斷爲 10KB。
      
      如果多個 ValidatingAdmissionPolicyBinding 資源匹配一個 API 請求，
      則會爲每個綁定計算 valueExpression。所有由 valueExpressions
      產生的唯一值將以逗號分隔列表的形式連接在一起。
      
      必需。

  <!--
  - **spec.failurePolicy** (string)

    failurePolicy defines how to handle failures for the admission policy. Failures can occur from CEL expression parse errors, type check errors, runtime errors and invalid or mis-configured policy definitions or bindings.
    
    A policy is invalid if spec.paramKind refers to a non-existent Kind. A binding is invalid if spec.paramRef.name refers to a non-existent resource.
    
    failurePolicy does not define how validations that evaluate to false are handled.
    
    When failurePolicy is set to Fail, ValidatingAdmissionPolicyBinding validationActions define how failures are enforced.
    
    Allowed values are Ignore or Fail. Defaults to Fail.
  -->

  - **spec.failurePolicy** (string)
  
    failurePolicy 定義瞭如何處理准入策略的失敗。失敗可能由 CEL
    表達式解析錯誤、類型檢查錯誤、運行時錯誤以及無效或設定錯誤的策略定義或綁定引起。
    
    如果 spec.paramKind 引用了一個不存在的 Kind，則該策略無效。如果
    spec.paramRef.name 引用了不存在的資源，則綁定無效。
    
    failurePolicy 不定義如何處理計算爲 false 的驗證。
    
    當 failurePolicy 設置爲 Fail 時，ValidatingAdmissionPolicyBinding validationActions 定義如何處理失敗。
    
    允許的值有 Ignore 或 Fail。默認爲 Fail。

    <!--
    Possible enum values:
     - `"Fail"` means that an error calling the webhook causes the admission to fail.
     - `"Ignore"` means that an error calling the webhook is ignored.
    -->
  
    可能的枚舉值：
      - `"Fail"` 表示調用 Webhook 發生錯誤時，准入失敗。
      - `"Ignore"` 表示調用 Webhook 發生的錯誤將被忽略。
  
  <!--
  - **spec.matchConditions** ([]MatchCondition)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    MatchConditions is a list of conditions that must be met for a request to be validated. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.
  -->

  - **spec.matchConditions** ([]MatchCondition)
  
    **補丁策略：基於 `name` 鍵合併**
    
    **映射：在合併期間，基於 name 鍵的唯一值將被保留**
    
    matchConditions 是請求能夠被驗證時必須滿足的一系列條件。匹配條件過濾已經由 rules、
    namespaceSelector 和 objectSelector 匹配的請求。空的 matchConditions
    列表匹配所有請求。最多允許有 64 個匹配條件。

    <!--
    If a parameter object is provided, it can be accessed via the `params` handle in the same manner as validation expressions.
    
    The exact matching logic is (in order):
      1. If ANY matchCondition evaluates to FALSE, the policy is skipped.
      2. If ALL matchConditions evaluate to TRUE, the policy is evaluated.
      3. If any matchCondition evaluates to an error (but none are FALSE):
         - If failurePolicy=Fail, reject the request
         - If failurePolicy=Ignore, the policy is skipped
    -->

    如果提供了參數對象，可以通過 `params` 句柄以與驗證表達式相同的方式訪問它。
    
    精確的匹配邏輯（按順序）：
      1. 如果 matchConditions 中**任意一個**解析爲 FALSE，則跳過該策略。
      2. 如果 matchConditions 中**所有條件**都解析爲 TRUE，則執行該策略。
      3. 如果任何 matchCondition 解析出現錯誤（但沒有解析爲 FALSE）：
         - 如果 failurePolicy=Fail，拒絕請求
         - 如果 failurePolicy=Ignore，則跳過該策略

    <a name="MatchCondition"></a>
    <!--
    *MatchCondition represents a condition which must by fulfilled for a request to be sent to a webhook.*

    - **spec.matchConditions.expression** (string), required

      Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:
      
      'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
        See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the
        request resource.
      Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
      
      Required.
    -->

    **MatchCondition 表示將請求發送到 Webhook 時必須滿足的條件。**
    
    - **spec.matchConditions.expression** (string)，必需
    
      expression 表示由 CEL 處理的表達式。表達式求值結果必須爲 Bool 類型。CEL 表達式可以訪問
      AdmissionRequest 和 Authorizer 的內容，這些內容被組織成 CEL 變量：
      
      - 'object' - 來自傳入請求的對象。對於 DELETE 請求，該值爲 null。
      - 'oldObject' - 現有對象。對於 CREATE 請求，該值爲 null。
      - 'request' - 准入請求的屬性(/pkg/apis/admission/types.go#AdmissionRequest)。
      - 'authorizer' - 一個 CEL 授權器。可用於對請求的主體（使用者或服務賬戶）執行授權檢查。
        參見 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' - 由 'authorizer' 構建並設定了請求資源的 CEL ResourceCheck。
      
      必需。
   
    <!--
    - **spec.matchConditions.name** (string), required

      Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')
      
      Required.
    -->

    - **spec.matchConditions.name** (string)，必需
    
      name 是此匹配條件的標識符，用於 matchConditions 的策略性合併以及爲日誌記錄提供標識符。
      一個好的名稱應該能夠描述相關的表達式。名稱必須是由字母數字字符、`-`、`_` 或 `.` 組成的合格名稱，
      並且必須以字母數字字符開頭和結尾（例如 'MyName' 或 'my.name' 或 '123-abc'，
      用於驗證的正則表達式是 '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]')
      可以包含一個可選的 DNS 子域前綴和 '/' （例如 'example.com/MyName'）。
    
      必需。

  <!--
  - **spec.matchConstraints** (MatchResources)

    MatchConstraints specifies what resources this policy is designed to validate. The AdmissionPolicy cares about a request if it matches _all_ Constraints. However, in order to prevent clusters from being put into an unstable state that cannot be recovered from via the API ValidatingAdmissionPolicy cannot match ValidatingAdmissionPolicy and ValidatingAdmissionPolicyBinding. Required.

    <a name="MatchResources"></a>
    *MatchResources decides whether to run the admission control policy on an object based on whether it meets the match criteria. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)*

    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: will be replaced during a merge*
      
      ExcludeResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy should not care about. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)
  -->

  - **spec.matchConstraints** (MatchResources)
  
    matchConstraints 指定此策略設計用來驗證的資源。僅當 AdmissionPolicy 匹配**所有**約束時，纔會關注請求。
    然而，爲了避免叢集進入無法通過 API 恢復的不穩定狀態，ValidatingAdmissionPolicy 不能匹配 ValidatingAdmissionPolicy 和 ValidatingAdmissionPolicyBinding。
    必需。
  
    <a name="MatchResources"></a>
    **matchResources 決定了是否根據對象是否符合匹配標準來運行准入控制策略。
    排除規則優先於包含規則（如果一個資源同時匹配兩者，則它被排除）**
  
    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)
  
      **原子性：在合併期間將被替換**
  
      excludeResourceRules 描述 ValidatingAdmissionPolicy 不應關心的操作及其資源/子資源。
      排除規則優先於包含規則（如果一個資源同時匹配兩者，則它被排除）

      <a name="NamedRuleWithOperations"></a>
      <!--
      *NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.*

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
      -->

      **namedRuleWithOperations 是操作和資源及其資源名稱的元組。**

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        **原子性：在合併期間將被替換**
        
        apiGroups 是資源所屬的 API 組。`*` 表示所有組。
        如果存在 `*`，切片的長度必須爲一。必需。

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        **原子性：在合併期間將被替換**
        
        apiVersions 是資源所屬的 API 版本。`*` 表示所有版本。
        如果存在 `*`，切片的長度必須爲一。必需。

      <!--
      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->

      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        **原子性：在合併期間將被替換**
        
        operations 是准入鉤子關心的操作 - CREATE、UPDATE、DELETE、CONNECT 或者 `*`
        表示所有這些操作以及將來可能添加的任何准入操作。
        如果存在 `*`，切片的長度必須爲一。必需。

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        **原子性：在合併期間將被替換**
        
        resourceNames 是規則適用的名稱白名單。空集表示允許所有。

      <!--
      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        **原子性：在合併期間將被替換**
        
        resources 是此規則適用的資源列表。
        
        例如：`pods` 表示 Pods。`pods/log` 表示 Pods 的日誌子資源。
        `*` 表示所有資源，但不包括子資源。`pods/*` 表示 Pods 的所有子資源。
        `*/scale` 表示所有擴縮子資源。`*/*` 表示所有資源及其子資源。
        
        如果通配符存在，驗證規則將確保資源不會相互重疊。
        
        根據封裝對象的不同，可能不允許有子資源。必需。

      <!--
      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope 指定此規則的作用範圍。有效值爲 `Cluster`、`Namespaced` 和 `*`。
        `Cluster` 表示僅叢集作用域的資源匹配此規則。Namespace API 對象是叢集作用域的。
        `Namespaced` 表示僅命名空間資源匹配此規則。`*` 表示沒有作用範圍限制。
        子資源匹配其父資源的作用範圍。默認是 `*`。

    <!--
    - **spec.matchConstraints.matchPolicy** (string)

      matchPolicy defines how the "MatchResources" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
      
      - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the ValidatingAdmissionPolicy.
      
      - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the ValidatingAdmissionPolicy.
      
      Defaults to "Equivalent"
  
      Possible enum values:
       - `"Equivalent"` means requests should be sent to the webhook if they modify a resource listed in rules via another API group or version.
       - `"Exact"` means requests should only be sent to the webhook if they exactly match a given rule.
    -->

    - **spec.matchConstraints.matchPolicy** (string)

      matchPolicy 定義瞭如何使用 "MatchResources" 列表來匹配傳入的請求。允許的值爲 "Exact" 或 "Equivalent"。

      - Exact：僅當請求完全匹配指定規則時才匹配請求。
        例如，如果 deployments 可以通過 apps/v1、apps/v1beta1 和 extensions/v1beta1 修改，
        但 "rules" 僅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        則對 apps/v1beta1 或 extensions/v1beta1 的請求不會發送到 ValidatingAdmissionPolicy。

      - Equivalent：如果請求修改了規則中列出的資源，即使通過另一個 API 組或版本，
        也會匹配請求。例如，如果 deployments 可以通過 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，
        並且 "rules" 僅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        則對 `apps/v1beta1` 或 `extensions/v1beta1` 的請求將被轉換爲 `apps/v1` 併發送到 ValidatingAdmissionPolicy。

      默認爲 "Equivalent"
  
      可能的枚舉值：
        - `"Equivalent"` 表示如果請求通過另一個 API 組或版本修改規則中列出的資源，
          則應將請求發送到 Webhook。
        - `"Exact"` 表示僅當請求與給定規則完全匹配時，才應將請求發送到 Webhook。

    <!--
    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.
      
      For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows:
    -->

    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector 決定了是否基於對象的命名空間是否匹配選擇器來對該對象運行准入控制策略。
      如果對象本身是一個命名空間，則匹配是針對 `object.metadata.labels` 執行的。
      如果對象是另一個叢集範圍的資源，則永遠不會跳過此策略。

      例如，要對任何命名空間未關聯 "runlevel" 爲 "0" 或 "1" 的對象運行 Webhook，你可以將選擇算符設置如下：
  
      ```yaml
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "runlevel",
            "operator": "NotIn",
            "values": [
              "0",
              "1"
            ]
          }
        ]
      }
      ```

      <!--
      If instead you want to only run the policy on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows:
      -->

      如果你只想對那些命名空間與 "environment" 爲 "prod" 或 "staging"
      相關聯的對象運行策略，你可以將選擇器設置如下：
  
      ```yaml
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "environment",
            "operator": "In",
            "values": [
              "prod",
              "staging"
            ]
          }
        ]
      }
      ```
      
      <!--
      See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.
      
      Default to the empty LabelSelector, which matches everything.
      -->

      參閱[標籤選擇算符示例](/zh-cn/docs/concepts/overview/working-with-objects/labels/)獲取更多的示例。

      默認爲空的 LabelSelector，匹配所有內容。
  
    - **spec.matchConstraints.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.
      -->

      objectSelector 決定了是否基於對象是否有匹配的標籤來運行驗證。
      objectSelector 會針對將被髮送到 CEL 驗證的舊對象和新對象進行計算，
      只要其中一個對象匹配選擇算符，則視爲匹配。Null 對象（在創建時爲舊對象，或在刪除時爲新對象）
      或不能有標籤的對象（如 DeploymentRollback 或 PodProxyOptions 對象）不被認爲匹配。
      僅當 Webhook 是可選時使用對象選擇器，因爲終端使用者可以通過設置標籤跳過准入 Webhook。
      默認爲"空" LabelSelector，它匹配所有內容。

    - **spec.matchConstraints.resourceRules** ([]NamedRuleWithOperations)

      <!--
      *Atomic: will be replaced during a merge*
      
      ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.
      -->

      **原子性：將在合併期間被替換**

      resourceRules 描述了 ValidatingAdmissionPolicy 匹配的資源/子資源上的什麼操作。
      只要匹配**任何**規則，策略就會關心該操作。

      <a name="NamedRuleWithOperations"></a>
      <!--
      *NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.*

      - **spec.matchConstraints.resourceRules.apiGroups** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.resourceRules.apiVersions** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
      -->

      **NamedRuleWithOperations 是操作和帶有資源名稱的資源的元組。**
        
        - **spec.matchConstraints.resourceRules.apiGroups** ([]string)
        
          **原子性：將在合併期間被替換**
        
          apiGroups 是資源所屬的 API 組。`*` 表示所有組。如果存在 `*`，則切片的長度必須爲一。必需。
        
        - **spec.matchConstraints.resourceRules.apiVersions** ([]string)
        
          **原子性：將在合併期間被替換**
        
          apiVersions 是資源所屬的 API 版本。`*` 表示所有版本。如果存在 `*`，則切片的長度必須爲一。必需。

      <!--
      - **spec.matchConstraints.resourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->

      - **spec.matchConstraints.resourceRules.operations** ([]string)
      
        **原子性：在合併期間將被替換**
        
        operations 是准入鉤子關心的操作 - CREATE、UPDATE、DELETE、CONNECT
        或者是代表所有這些操作以及任何未來可能添加的准入操作的通配符 `*`。
        如果包含了 `*`，那麼切片的長度必須爲一。必需字段。
      
      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)
      
        **原子性：在合併期間將被替換**
        
        resourceNames 是規則適用的名稱白名單。一個空集合意味着允許所有。可選項。

      <!--
      - **spec.matchConstraints.resourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchConstraints.resourceRules.resources** ([]string)
      
        **原子性：在合併期間將被替換**
        
        resources 是此規則適用的資源列表。
        
        例如：`pods` 表示 pods。`pods/log` 表示 pods 的日誌子資源。
        `*` 表示所有資源，但不包括子資源。`pods/*` 表示 pods 的所有子資源。
        `*/scale` 表示所有資源的 scale 子資源。`*/*` 表示所有資源及其子資源。
        
        如果存在通配符，驗證規則將確保資源之間不會相互重疊。
        
        根據封裝對象的不同，可能不允許有子資源。必需字段。

      <!--
      - **spec.matchConstraints.resourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchConstraints.resourceRules.scope** (string)

        scope 指定此規則的作用範圍。有效值爲 "`Cluster`"、"`Namespaced`" 和 "`*`"。
        "`Cluster`" 表示只有叢集範圍的資源匹配此規則。Namespace API 對象是叢集範圍的。
        "`Namespaced`" 表示只有名字空間作用域的資源匹配此規則。"`*`" 表示沒有作用範圍限制。
        子資源匹配其父資源的作用範圍。默認值爲 "`*`"。
 
  <!-- 
  - **spec.paramKind** (ParamKind)

    ParamKind specifies the kind of resources used to parameterize this policy. If absent, there are no parameters for this policy and the param CEL variable will not be provided to validation expressions. If ParamKind refers to a non-existent kind, this policy definition is mis-configured and the FailurePolicy is applied. If paramKind is specified but paramRef is unset in ValidatingAdmissionPolicyBinding, the params variable will be null.

    <a name="ParamKind"></a>
    *ParamKind is a tuple of Group Kind and Version.*

    - **spec.paramKind.apiVersion** (string)

      APIVersion is the API group version the resources belong to. In format of "group/version". Required.

    - **spec.paramKind.kind** (string)

      Kind is the API kind the resources belong to. Required.
  -->

  - **spec.paramKind** (ParamKind)
  
    paramKind 指定用於參數化此策略的資源類型。如果不存在，則此策略沒有參數，
    且不會向驗證表達式提供 param CEL 變量。如果 paramKind 引用了一個不存在的類型，
    則此策略定義設定錯誤，並應用 FailurePolicy。
    如果指定了 paramKind 但在 ValidatingAdmissionPolicyBinding 中未設置
    paramRef，則 params 變量將爲 null。
  
    <a name="ParamKind"></a>
    **ParamKind 是組類型和版本的組合。**
  
    - **spec.paramKind.apiVersion** (string)
  
      apiVersion 是資源所屬的 API 組版本。格式爲 "group/version"。必需字段。
  
    - **spec.paramKind.kind** (string)
  
      kind 是資源所屬的 API 類型。必需字段。

  <!--
  - **spec.validations** ([]Validation)

    *Atomic: will be replaced during a merge*
    
    Validations contain CEL expressions which is used to apply the validation. Validations and AuditAnnotations may not both be empty; a minimum of one Validations or AuditAnnotations is required.

    <a name="Validation"></a>
    *Validation specifies the CEL expression which is used to apply the validation.*
  -->

  - **spec.validations** ([]Validation)
  
    **原子性：將在合併期間被替換**
    
    validations 包含用於應用驗證的 CEL 表達式。validations
    和 auditAnnotations 不能同時爲空；至少需要一個 validations 或 auditAnnotations。
  
    <a name="Validation"></a>
    **Validation 指定用於應用驗證的 CEL 表達式。**

    <!--
    - **spec.validations.expression** (string), required

      Expression represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec CEL expressions have access to the contents of the API request/response, organized into CEL variables as well as some other useful variables:
      
      - 'object' - The object from the incoming request. The value is null for DELETE requests. - 'oldObject' - The existing object. The value is null for CREATE requests. - 'request' - Attributes of the API request([ref](/pkg/apis/admission/types.go#AdmissionRequest)). - 'params' - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind. - 'namespaceObject' - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources. - 'variables' - Map of composited variables, from its name to its lazily evaluated value.
        For example, a variable named 'foo' can be accessed as 'variables.foo'.
      - 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
        See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the
        request resource.
    -->

    - **spec.validations.expression** (string)，必需

      expression 表示將由 CEL 計算的表達式。參考：
      https://github.com/google/cel-spec

      CEL 表達式可以訪問 API 請求/響應的內容，這些內容被組織成 CEL 變量以及一些其他有用的變量：

      - 'object' - 來自傳入請求的對象。對於 DELETE 請求，該值爲 null。
      - 'oldObject' - 現有對象。對於 CREATE 請求，該值爲 null。
      - 'request' - API 請求的屬性（[參考](/pkg/apis/admission/types.go#AdmissionRequest)）。
      - 'params' - 由正在計算的策略綁定引用的參數資源。僅在策略具有 ParamKind 時填充。
      - 'namespaceObject' - 傳入對象所屬的命名空間對象。對於叢集範圍的資源，該值爲 null。
      - 'variables' - 複合變量的映射，從其名稱到其惰性求值的值。
        例如，名爲 'foo' 的變量可以作爲 'variables.foo' 訪問。
      - 'authorizer' - 一個 CEL 鑑權器。可用於對請求的主體（使用者或服務帳戶）執行授權檢查。
        請參閱 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' - 由 'authorizer' 構建並使用請求資源設定的 CEL 資源檢查。
  
      <!--      
      The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object. No other metadata properties are accessible.
      
      Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - '__' escapes to '__underscores__' - '.' escapes to '__dot__' - '-' escapes to '__dash__' - '/' escapes to '__slash__' - Property names that exactly match a CEL RESERVED keyword escape to '__{keyword}__'. The keywords are:
          "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",
          "import", "let", "loop", "package", "namespace", "return".
      Examples:
        - Expression accessing a property named "namespace": {"Expression": "object.__namespace__ > 0"}
        - Expression accessing a property named "x-prop": {"Expression": "object.x__dash__prop > 0"}
        - Expression accessing a property named "redact__d": {"Expression": "object.redact__underscores__d > 0"}
      -->

      `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName` 總是可以從對象的根部訪問。沒有其他元數據屬性是可訪問的。
      
      只有形式爲 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的屬性名稱是可訪問的。當在表達式中訪問時，根據以下規則對可訪問的屬性名稱進行轉義：
      - `__` 轉義爲 `__underscores__`
      - `.` 轉義爲 `__dot__`
      - `-` 轉義爲 `__dash__`
      - `/` 轉義爲 `__slash__`
      - 完全匹配 CEL 保留關鍵字的屬性名稱轉義爲 `__{keyword}__`。這些關鍵字包括：
          "true"、"false"、"null"、"in"、"as"、"break"、"const"、"continue"、"else"、"for"、"function"、"if"、
          "import"、"let"、"loop"、"package"、"namespace"、"return"。
      示例：
      - 訪問名爲 "namespace" 的屬性的表達式：{"Expression": "object.__namespace__ > 0"}
      - 訪問名爲 "x-prop" 的屬性的表達式：{"Expression": "object.x__dash__prop > 0"}
      - 訪問名爲 "redact__d" 的屬性的表達式：{"Expression": "object.redact__underscores__d > 0"}

      <!--
      Equality on arrays with list type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:
        - 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
          non-intersecting elements in `Y` are appended, retaining their partial order.
        - 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
          are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
          non-intersecting keys are appended, retaining their partial order.
      Required.
      -->

      對於類型爲 'set' 或 'map' 的列表，數組上的相等性忽略元素順序，即 [1, 2] == [2, 1]。
      帶有 x-kubernetes-list-type 的數組上的連接使用列表類型的語義：

      - 'set'：`X + Y` 執行一個聯合操作，其中 `X` 中所有元素的數組位置被保留，
        並且 `Y` 中不相交的元素被追加，保持它們的部分順序。
      - 'map'：`X + Y` 執行一個合併操作，其中 `X` 中所有鍵的數組位置被保留，
        但值被 `Y` 中的值覆蓋，當 `X` 和 `Y` 的鍵集相交時。`Y` 中具有不相交鍵的元素被追加，
        保持它們的部分順序。

      必需。
  
    <!--
    - **spec.validations.message** (string)

      Message represents the message displayed when validation fails. The message is required if the Expression contains line breaks. The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host" If the Expression contains line breaks. Message is required. The message must not contain line breaks. If unset, the message is "failed Expression: {Expression}".

    - **spec.validations.messageExpression** (string)

      messageExpression declares a CEL expression that evaluates to the validation failure message that is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string. If both message and messageExpression are present on a validation, then messageExpression will be used if validation fails. If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string with only spaces, or a string that contains line breaks, then the validation failure message will also be produced as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the `expression` except for 'authorizer' and 'authorizer.requestResource'. Example: "object.x must be less than max ("+string(params.max)+")"
    -->

    - **spec.validations.message** (string)

      message 表示驗證失敗時顯示的消息。如果 expression 包含換行符，
      則消息是必需的。消息中不能包含換行符。如果未設置，消息爲 "failed rule: {Rule}"。
      例如 "must be a URL with the host matching spec.host"。
      如果 expression 包含換行符，則 message 是必需的。消息中不能包含換行符。
      如果未設置，消息爲 "failed Expression: {Expression}"。

    - **spec.validations.messageExpression** (string)

      messageExpression 聲明一個 CEL 表達式，當此規則失敗時返回該表達式計算得到的驗證失敗消息。
      由於 messageExpression 用作失敗消息，它必須計算爲字符串。如果驗證同時包含
      message 和 messageExpression，則驗證失敗時將使用 messageExpression。
      如果 messageExpression 導致運行時錯誤，將記錄運行時錯誤，並且如同未設置
      messageExpression 字段一樣生成驗證失敗消息。如果 messageExpression
      計算爲空字符串、僅包含空格的字符串或包含換行符的字符串，則同樣會如同未設置 messageExpression
      字段一樣生成驗證失敗消息，並且將記錄 messageExpression 產生了空字符串/僅包含空格的字符串/包含換行符的字符串的情況。
      messageExpression 可訪問與 `expression` 相同的所有變量，除了 'authorizer' 和
      'authorizer.requestResource'。示例："object.x 必須小於最大值 ("+string(params.max)+")"

    <!--
    - **spec.validations.reason** (string)

      Reason represents a machine-readable description of why this validation failed. If this is the first validation in the list to fail, this reason, as well as the corresponding HTTP response code, are used in the HTTP response to the client. The currently supported reasons are: "Unauthorized", "Forbidden", "Invalid", "RequestEntityTooLarge". If not set, StatusReasonInvalid is used in the response to the client.
    -->

    - **spec.validations.reason** (string)

      reason 表示機器可讀的描述，說明爲何此驗證失敗。如果這是列表中第一個失敗的驗證，
      則這個 reason 以及相應的 HTTP 響應代碼將用於對客戶端的 HTTP 響應。
      當前支持的原因有："Unauthorized"、"Forbidden"、"Invalid"、"RequestEntityTooLarge"。
      如果沒有設置，在響應給客戶端時將使用 StatusReasonInvalid。

  <!--
  - **spec.variables** ([]Variable)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    Variables contain definitions of variables that can be used in composition of other expressions. Each variable is defined as a named CEL expression. The variables defined here will be available under `variables` in other expressions of the policy except MatchConditions because MatchConditions are evaluated before the rest of the policy.
    
    The expression of a variable can refer to other variables defined earlier in the list but not those after. Thus, Variables must be sorted by the order of first appearance and acyclic.
  -->

  - **spec.variables** ([]Variable)

    **補丁策略：基於 `name` 鍵合併**

    **映射：在合併期間，基於 name 鍵的唯一值將被保留**
    
    變量包含可用於其他表達式組合的變量定義。每個變量都被定義爲一個命名的 CEL 表達式。
    這裏定義的變量將在策略的其他表達式中的 `variables` 下可用，除了 `matchConditions`，
    因爲 `matchConditions` 會在策略其餘部分之前進行計算。
    
    變量的表達式可以引用列表中先前定義的其他變量，但不能引用後續定義的變量。
    因此，variables 必須按照首次出現的順序排序並且不可存在循環的。

    <a name="Variable"></a>
    <!--
    *Variable is the definition of a variable that is used for composition. A variable is defined as a named expression.*

    - **spec.variables.expression** (string), required

      Expression is the expression that will be evaluated as the value of the variable. The CEL expression has access to the same identifiers as the CEL expressions in Validation.

    - **spec.variables.name** (string), required

      Name is the name of the variable. The name must be a valid CEL identifier and unique among all variables. The variable can be accessed in other expressions through `variables` For example, if name is "foo", the variable will be available as `variables.foo`
    -->

    **Variable** 是用於組合的變量定義。變量被定義爲一個命名的表達式。
    
    - **spec.variables.expression** (string)，必需
    
      `expression` 是將被計算爲變量值的表達式。CEL 表達式可以訪問與 validation 中的 CEL 表達式相同的標識符。
    
    - **spec.variables.name** (string)，必需
    
      name 是變量的名稱。名稱必須是有效的 CEL 標識符，並且在所有變量中唯一。變量可以通過 `variables`
      在其他表達式中訪問。例如，如果名稱是 "foo"，變量將作爲 `variables.foo` 可用。

<!--
- **status** (ValidatingAdmissionPolicyStatus)

  The status of the ValidatingAdmissionPolicy, including warnings that are useful to determine if the policy behaves in the expected way. Populated by the system. Read-only.

  <a name="ValidatingAdmissionPolicyStatus"></a>
  *ValidatingAdmissionPolicyStatus represents the status of an admission validation policy.*

  - **status.conditions** ([]Condition)

    *Map: unique values on key type will be kept during a merge*
    
    The conditions represent the latest available observations of a policy's current state.

    <a name="Condition"></a>
    *Condition contains details for one aspect of the current state of this API Resource.*
-->
- **status** (ValidatingAdmissionPolicyStatus)

  ValidatingAdmissionPolicy 的狀態，包括有助於確定策略是否按預期行爲的警告。由系統填充。只讀。

  <a name="ValidatingAdmissionPolicyStatus"></a>
  **ValidatingAdmissionPolicyStatus** 表示一個准入驗證策略的狀態。

  - **status.conditions** ([]Condition)

    **在合併期間，鍵類型上的唯一值將被保留**

    這些條件表示策略當前狀態的最新可用觀察結果。

    <a name="Condition"></a>
    **Condition** 包含此 API 資源當前狀態某一方面的詳細信息。

    <!--
    - **status.conditions.lastTransitionTime** (Time), required

      lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

      <a name="Time"></a>
      *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **status.conditions.message** (string), required

      message is a human readable message indicating details about the transition. This may be an empty string.

    - **status.conditions.reason** (string), required

      reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
    -->

- **status.conditions.lastTransitionTime** (Time)，必填

  `lastTransitionTime` 是條件從一個狀態轉換到另一個狀態的最後時間。這應該是底層條件改變的時間。
  如果不知道該時間，使用 API 字段更改的時間是可以接受的。

  <a name="Time"></a>
  **Time** 是對 time.Time 的封裝，支持正確地序列化爲 YAML 和 JSON。time 包提供的許多工廠方法都有對應的封裝。

  - **status.conditions.message** (string)，必填

    `message` 是一個人類可讀的消息，指示有關過渡的詳細信息。這可以是一個空字符串。

  - **status.conditions.reason** (string)，必填

    `reason` 包含一個編程標識符，指示條件上次轉換的原因。特定條件類型的提供者可以爲此字段定義預期值和含義，
    以及這些值是否被視爲保證的 API。值應當是 CamelCase 格式的字符串。此字段不能爲空。

    <!--
    - **status.conditions.status** (string), required

      status of the condition, one of True, False, Unknown.

    - **status.conditions.type** (string), required

      type of condition in CamelCase or in foo.example.com/CamelCase.

    - **status.conditions.observedGeneration** (int64)

      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
    -->

    - **status.conditions.status** (string)，必需
    
      `condition` 的狀態，可能是 True、False、Unknown 中的一個。
    
    - **status.conditions.type** (string)，必需
    
      `condition` 的類型，採用 CamelCase 或 `foo.example.com/CamelCase` 格式。
    
    - **status.conditions.observedGeneration** (int64)
    
      `observedGeneration` 表示設置條件時依據的 `.metadata.generation`。例如，如果當前
      `.metadata.generation` 是 12，而 `.status.conditions[x].observedGeneration` 是 9，
      則說明該條件相對於實例的當前狀態已過期。

  <!--
  - **status.observedGeneration** (int64)

    The generation observed by the controller.

  - **status.typeChecking** (TypeChecking)

    The results of type checking for each expression. Presence of this field indicates the completion of the type checking.

    <a name="TypeChecking"></a>
    *TypeChecking contains results of type checking the expressions in the ValidatingAdmissionPolicy*
  -->

  - **status.observedGeneration** (int64)
  
    控制器觀察到的 `generation`。
  
  - **status.typeChecking** (TypeChecking)
  
    每個表達式的類型檢查結果。此字段的存在表明類型檢查已完成。
  
    <a name="TypeChecking"></a>
    **`TypeChecking` 包含了對 ValidatingAdmissionPolicy 中表達式進行類型檢查的結果**

    <!--
    - **status.typeChecking.expressionWarnings** ([]ExpressionWarning)

      *Atomic: will be replaced during a merge*
      
      The type checking warnings for each expression.

      <a name="ExpressionWarning"></a>
      *ExpressionWarning is a warning information that targets a specific expression.*

      - **status.typeChecking.expressionWarnings.fieldRef** (string), required

        The path to the field that refers the expression. For example, the reference to the expression of the first item of validations is "spec.validations[0].expression"

      - **status.typeChecking.expressionWarnings.warning** (string), required

        The content of type checking information in a human-readable form. Each line of the warning contains the type that the expression is checked against, followed by the type check error from the compiler.
    -->

    - **status.typeChecking.expressionWarnings** ([]ExpressionWarning)

      **原子性：將在合併期間被替換**

      每個表達式的類型檢查警告。

      <a name="ExpressionWarning"></a>
      **`ExpressionWarning` 是針對特定表達式的警告信息。**

      - **status.typeChecking.expressionWarnings.fieldRef** (string)，必需

        引用表達式的字段路徑。例如，對 validations 第一項的表達式的引用是 "spec.validations[0].expression"

      - **status.typeChecking.expressionWarnings.warning** (string)，必需

        人類可讀形式的類型檢查信息內容。警告的每一行包含表達式所檢查的類型，然後是編譯器報告的類型檢查錯誤。

## ValidatingAdmissionPolicyList {#ValidatingAdmissionPolicyList}

<!--
ValidatingAdmissionPolicyList is a list of ValidatingAdmissionPolicy.
-->
ValidatingAdmissionPolicyList 是 ValidatingAdmissionPolicy 的列表。

<hr>

<!--
- **items** ([]<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>), required

  List of ValidatingAdmissionPolicy.

- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
- **items** ([]<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>)，必需

  ValidatingAdmissionPolicy 的列表。

- **apiVersion** (string)

  `apiVersion` 定義了對象表示的版本化模式。伺服器應該將識別的模式轉換爲最新的內部值，並可能拒絕未識別的值。
  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind** (string)

  `kind` 是一個字符串值，表示此對象代表的 REST 資源。伺服器可能從客戶端提交請求的端點推斷出該值。
  不能更新。採用駝峯命名法。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## ValidatingAdmissionPolicyBinding {#ValidatingAdmissionPolicyBinding}

<!--
ValidatingAdmissionPolicyBinding binds the ValidatingAdmissionPolicy with paramerized resources. ValidatingAdmissionPolicyBinding and parameter CRDs together define how cluster administrators configure policies for clusters.
-->
ValidatingAdmissionPolicyBinding 將 ValidatingAdmissionPolicy 與參數化資源綁定。
ValidatingAdmissionPolicyBinding 和參數 CRD 共同定義了叢集管理員如何爲叢集設定策略。

<!--
For a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don't use params, otherwise N is the number of parameters selected by the binding.

The CEL expressions of a policy must have a computed CEL cost below the maximum CEL budget. Each evaluation of the policy is given an independent CEL cost budget. Adding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget.
-->
對於一個給定的准入請求，每個綁定將導致其策略被計算 N 次，其中 N 對於不使用參數的策略/綁定是 1，
否則 N 是由綁定選擇的參數數量。

策略的 CEL 表達式必須具有低於最大 CEL 預算的計算 CEL 成本。每次策略計算都有獨立的
CEL 成本預算。添加/移除策略、綁定或參數不會影響特定（策略，綁定，參數）組合是否在其自身的 CEL 預算內。

<hr>

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **apiVersion** (string)

  `apiVersion` 定義了對象此表示形式的版本化模式。伺服器應將識別的模式轉換爲最新的內部值，
  並可能拒絕未識別的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  `kind` 是一個字符串值，代表此對象表示的 REST 資源。伺服器可從客戶端提交請求的端點推斷出該值。
  不能更新。採用駝峯式命名法。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicyBindingSpec)

  Specification of the desired behavior of the ValidatingAdmissionPolicyBinding.

  <a name="ValidatingAdmissionPolicyBindingSpec"></a>
  *ValidatingAdmissionPolicyBindingSpec is the specification of the ValidatingAdmissionPolicyBinding.*
-->
- **metadata**（<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>）

  標準的對象元數據；更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

- **spec** (ValidatingAdmissionPolicyBindingSpec)

  ValidatingAdmissionPolicyBinding 的期望行爲規範。

  <a name="ValidatingAdmissionPolicyBindingSpec"></a>
  **ValidatingAdmissionPolicyBindingSpec 是 ValidatingAdmissionPolicyBinding 的規範。**
 
  <!--
  - **spec.matchResources** (MatchResources)

    MatchResources declares what resources match this binding and will be validated by it. Note that this is intersected with the policy's matchConstraints, so only requests that are matched by the policy can be selected by this. If this is unset, all resources matched by the policy are validated by this binding When resourceRules is unset, it does not constrain resource matching. If a resource is matched by the other fields of this object, it will be validated. Note that this is differs from ValidatingAdmissionPolicy matchConstraints, where resourceRules are required.

    <a name="MatchResources"></a>
    *MatchResources decides whether to run the admission control policy on an object based on whether it meets the match criteria. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)*

    - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: will be replaced during a merge*
      
      ExcludeResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy should not care about. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.*
  -->
  - **spec.matchResources** (MatchResources)
  
    `matchResources` 聲明瞭哪些資源匹配此綁定並會由此進行驗證。注意，這與策略的 matchConstraints 相交，
    因此只有被策略匹配的請求才能由此選擇。如果此字段未設置，則由策略匹配的所有資源都將由此綁定驗證。
    當 resourceRules 未設置時，它不限制資源匹配。如果資源符合此對象的其他字段，它將被驗證。
    注意，這與 ValidatingAdmissionPolicy matchConstraints 不同，在那裏 resourceRules 是必需的。
  
    <a name="MatchResources"></a>
    **MatchResources 根據對象是否滿足匹配條件來決定是否對其運行准入控制策略。
    排除規則優先於包含規則（如果一個資源同時匹配兩者，則該資源被排除）**
  
  - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)
  
    **原子性：將在合併期間被替換**
  
    `excludeResourceRules` 描述了 ValidatingAdmissionPolicy 應忽略的操作和資源/子資源。
    排除規則優先於包含規則（如果一個資源同時匹配兩者，則該資源被排除）
  
    <a name="NamedRuleWithOperations"></a>
    **NamedRuleWithOperations 是操作和資源及資源名稱的元組。**

      <!--
      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
      -->

      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)
      
       **原子性：將在合併期間被替換**
     
        `apiGroups` 是資源所屬的 API 組。`*` 表示所有組。
        如果存在 `*`，則切片的長度必須爲一。必需。
        
        - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)
        
        **原子性：將在合併期間被替換**
        
        `apiVersions` 是資源所屬的 API 版本。`*` 表示所有版本。
        如果存在 `*`，則切片的長度必須爲一。必需。

      <!--
      - **spec.matchResources.excludeResourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->
  
      - **spec.matchResources.excludeResourceRules.operations** ([]string)
      
        **原子性：將在合併期間被替換**
      
        `operations` 是 admission hook 關心的操作 - CREATE、UPDATE、DELETE、CONNECT 或者
        `*` 表示所有這些操作以及將來可能添加的任何 admission 操作。
        如果存在 `*`，則切片的長度必須爲一。必需。
      
      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)
      
        **原子性：將在合併期間被替換**
      
        `resourceNames` 是規則適用的名字白名單。空集表示允許所有。
  
      <!--
      - **spec.matchResources.excludeResourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchResources.excludeResourceRules.resources** ([]string)
      
        **原子性：將在合併期間被替換**
      
        `resources` 是此規則適用的資源列表。
      
        例如：`pods` 表示 Pod。`pods/log` 表示 Pod 的日誌子資源。`*` 表示所有資源，
        但不包括子資源。`pods/*` 表示 Pod 的所有子資源。`*/scale` 表示所有 scale 子資源。
        `*/*` 表示所有資源及其子資源。
      
        如果存在通配符，驗證規則將確保資源不會相互重疊。
      
        根據封裝對象的不同，可能不允許有子資源。必需。

      <!--
      - **spec.matchResources.excludeResourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchResources.excludeResourceRules.scope** (string)
      
        `scope` 指定此規則的範圍。有效值爲 "`Cluster`"、"`Namespaced`" 和 "`*`"。"`Cluster`"
        表示只有叢集範圍的資源將匹配此規則。Namespace API 對象是叢集範圍的。"`Namespaced`"
        表示只有命名空間範圍的資源將匹配此規則。"`*`" 表示沒有範圍限制。子資源匹配其父資源的範圍。默認是 "`*`"。
  
    <!--
    - **spec.matchResources.matchPolicy** (string)

      matchPolicy defines how the "MatchResources" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
      
      - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the ValidatingAdmissionPolicy.
      
      - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the ValidatingAdmissionPolicy.
      
      Defaults to "Equivalent"
  
      Possible enum values:
       - `"Equivalent"` means requests should be sent to the webhook if they modify a resource listed in rules via another API group or version.
       - `"Exact"` means requests should only be sent to the webhook if they exactly match a given rule.
    -->

    - **spec.matchResources.matchPolicy** (string)
    
      `matchPolicy` 定義瞭如何使用 "MatchResources" 列表來匹配傳入的請求。允許的值爲 "Exact" 或 "Equivalent"。
    
      - `Exact`：僅當請求完全匹配指定規則時才匹配請求。例如，如果 deployments 可以通過
        `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，但 "rules" 僅包含
        `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        則對 `apps/v1beta1` 或 `extensions/v1beta1` 的請求不會發送到 ValidatingAdmissionPolicy。
    
      - `Equivalent`：如果請求修改了規則中列出的資源，即使通過另一個 API 組或版本，也會匹配請求。
        例如，如果 Deployment 可以通過 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，
        並且 "rules" 僅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        則對 `apps/v1beta1` 或 `extensions/v1beta1` 的請求將被轉換爲 `apps/v1` 併發送到 ValidatingAdmissionPolicy。
    
      默認爲 `"Equivalent"`

      可能的枚舉值：
        - `"Equivalent"` 表示如果請求通過另一個 API 組或版本修改規則中列出的資源，
          則應將請求發送到 Webhook。
        - `"Exact"` 表示僅當請求與給定規則完全匹配時，才應將請求發送到 Webhook。

    <!--
    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.
      
      For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: 
    -->

    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)
    
      `namespaceSelector` 決定了是否基於對象的命名空間是否匹配選擇器來對對象運行准入控制策略。
      如果對象本身是一個命名空間，則匹配是在 `object.metadata.labels` 上執行的。
      如果對象是另一個叢集範圍的資源，則永遠不會跳過該策略。
    
      例如，要對任何命名空間未關聯 "runlevel" 爲 "0" 或 "1" 的對象運行 Webhook，你可以將選擇器設置如下：

      ```yaml
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "runlevel",
            "operator": "NotIn",
            "values": [
              "0",
              "1"
            ]
          }
        ]
      }
      ```

      <!--
      If instead you want to only run the policy on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows:
      -->

      如果你只想對那些命名空間與 "environment" 的 "prod" 或 "staging" 相關聯的對象運行策略，你可以將選擇器設置如下：
  
      ```yaml
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "environment",
            "operator": "In",
            "values": [
              "prod",
              "staging"
            ]
          }
        ]
      }
      ```
      
      <!--
      See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.
      
      Default to the empty LabelSelector, which matches everything.
      -->
  
      參見[標籤選擇器示例](/zh-cn/docs/concepts/overview/working-with-objects/labels/)獲取更多例子。

      默認爲空的 LabelSelector，它匹配所有內容。
  
    - **spec.matchResources.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.
      -->

      objectSelector 決定是否基於對象是否有匹配的標籤來運行驗證。objectSelector 會針對將被髮送到
      CEL 驗證的舊對象和新對象進行計算，只要其中一個對象匹配選擇器，則認爲匹配。
      一個空對象（在創建時的舊對象，或在刪除時的新對象）或不能有標籤的對象（如
      DeploymentRollback 或 PodProxyOptions 對象）不被認爲是匹配的。
      僅在 Webhook 是可選的情況下使用對象選擇器，因爲最終使用者可以通過設置標籤跳過准入
      Webhook。默認爲空的 LabelSelector ，它匹配所有內容。
  
    - **spec.matchResources.resourceRules** ([]NamedRuleWithOperations)

      <!--
      *Atomic: will be replaced during a merge*
      
      ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.*
      -->

      **原子性：將在合併期間被替換**
      
      resourceRules 描述了 ValidatingAdmissionPolicy 匹配的資源/子資源上的什麼操作。
      如果操作匹配**任意**規則，策略就會關心該操作。
      
      <a name="NamedRuleWithOperations"></a>
      **NamedRuleWithOperations 是操作和帶有資源名稱的資源的元組。**

      - **spec.matchResources.resourceRules.apiGroups** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：將在合併期間被替換**
      
        apiGroups 是資源所屬的 API 組。`*` 表示所有組。如果存在 `*`，則切片的長度必須爲一。必需。
  
      - **spec.matchResources.resourceRules.apiVersions** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：將在合併期間被替換**
      
        apiVersions 是資源所屬的 API 版本。`*` 表示所有版本。如果存在 `*`，則切片的長度必須爲一。必需。

      - **spec.matchResources.resourceRules.operations** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
   
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：將在合併期間被替換**
  
        operations 是准入鉤子關心的操作 - CREATE、UPDATE、DELETE、CONNECT 或 `*`
        表示所有這些操作和將來可能添加的任何其他准入操作。如果存在 `*`，則切片的長度必須爲一。必需。

      - **spec.matchResources.resourceRules.resourceNames** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
        -->
  
        **原子性：將在合併期間被替換**

        resourceNames 是規則適用的名稱可選白名單。一個空集意味着允許所有。

      - **spec.matchResources.resourceRules.resources** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
        -->
  
        **原子性：將在合併期間被替換**

        resources 是此規則適用的資源列表。
        
        例如：'pods' 表示 Pods。'pods/log' 表示 Pods 的日誌子資源。`*` 表示所有資源，
        但不包括子資源。`pods/*` 表示 Pods 的所有子資源。`*/scale` 表示所有擴縮子資源。
        `*/*` 表示所有資源及其子資源。
        
        如果通配符存在，驗證規則將確保資源不會相互重疊。
        
        取決於外層對象是什麼，可能不允許有子資源。必需。

      - **spec.matchResources.resourceRules.scope** (string)

        <!--
        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
        -->

        scope 指定此規則的範圍。有效值爲 "`Cluster`"、"`Namespaced`" 和 "`*`"。
        
        - "`Cluster`" 表示只有叢集範圍的資源會匹配此規則。Namespace API 對象是叢集範圍的。
        - "`Namespaced`" 表示只有命名空間範圍的資源會匹配此規則。
        - "`*`" 表示沒有範圍限制。
        
        子資源匹配其父資源的範圍。默認是 "`*`"。

  - **spec.paramRef** (ParamRef)

    <!--
    paramRef specifies the parameter resource used to configure the admission control policy. It should point to a resource of the type specified in ParamKind of the bound ValidatingAdmissionPolicy. If the policy specifies a ParamKind and the resource referred to by ParamRef does not exist, this binding is considered mis-configured and the FailurePolicy of the ValidatingAdmissionPolicy applied. If the policy does not specify a ParamKind then this field is ignored, and the rules are evaluated without a param.
    
    <a name="ParamRef"></a>
    *ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding.*
    -->

    paramRef 指定了用於設定准入控制策略的參數資源。它應該指向綁定的 ValidatingAdmissionPolicy
    中 paramKind 所指定類型的資源。如果策略指定了 paramKind 而且由 paramRef 引用的資源不存在，
    則認爲此綁定設定錯誤，並應用 ValidatingAdmissionPolicy 的 FailurePolicy。
    如果策略沒有指定 paramKind，則此字段將被忽略，規則將在沒有參數的情況下進行計算。
    
    <a name="ParamRef"></a>
    **ParamRef** 描述瞭如何定位將作爲策略綁定所應用規則表達式的輸入參數。
  
    - **spec.paramRef.name** (string)

      <!--
      name is the name of the resource being referenced.
      
      One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.
      
      A single parameter used for all admission requests can be configured by setting the `name` field, leaving `selector` blank, and setting namespace if `paramKind` is namespace-scoped.
      -->

      name 是被引用資源的名稱。
      
      `name` 或 `selector` 必須設置一個，但 `name` 和 `selector` 是互斥屬性。
      如果設置了其中一個，另一個必須未設置。
      
      通過設置 `name` 字段，留空 `selector`，並根據需要設置 namespace
     （如果 `paramKind` 是命名空間範圍的），可以爲所有準入請求設定單個參數。
  
    - **spec.paramRef.namespace** (string)

      <!--
      namespace is the namespace of the referenced resource. Allows limiting the search for params to a specific namespace. Applies to both `name` and `selector` fields.
      
      A per-namespace parameter may be used by specifying a namespace-scoped `paramKind` in the policy and leaving this field empty.
      
      - If `paramKind` is cluster-scoped, this field MUST be unset. Setting this field results in a configuration error.
      
      - If `paramKind` is namespace-scoped, the namespace of the object being evaluated for admission will be used when this field is left unset. Take care that if this is left empty the binding must not match any cluster-scoped resources, which will result in an error.
      -->

      namespace 是被引用資源的命名空間。允許將參數搜索限制到特定命名空間。適用於 `name` 和 `selector` 字段。
      
      通過在策略中指定命名空間範圍的 `paramKind` 並留空此字段，可以使用每個命名空間的參數。
      
      - 如果 `paramKind` 是叢集範圍的，此字段必須未設置。設置此字段會導致設定錯誤。
      
      - 如果 `paramKind` 是命名空間範圍的，在計算准入的對象時，如果此字段未設置，則會使用該對象的命名空間。
        請注意，如果此字段爲空，則綁定不能匹配任何叢集範圍的資源，否則將導致錯誤。
  
    - **spec.paramRef.parameterNotFoundAction** (string)

      <!--
      `parameterNotFoundAction` controls the behavior of the binding when the resource exists, and name or selector is valid, but there are no parameters matched by the binding. If the value is set to `Allow`, then no matched parameters will be treated as successful validation by the binding. If set to `Deny`, then no matched parameters will be subject to the `failurePolicy` of the policy.
      
      Allowed values are `Allow` or `Deny`
      
      Required
      -->

      `parameterNotFoundAction` 控制當資源存在，且名稱或選擇器有效但沒有匹配的參數時綁定的行爲。
      如果值設置爲 `Allow`，則未匹配到參數將被視爲綁定的成功驗證。如果設置爲 `Deny`，
      則未匹配到參數將會受到策略的 `failurePolicy` 的影響。
      
      允許的值爲 `Allow` 或 `Deny`
      
      必需

    - **spec.paramRef.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      selector can be used to match multiple param objects based on their labels. Supply selector: {} to match all resources of the ParamKind.
      
      If multiple params are found, they are all evaluated with the policy expressions and the results are ANDed together.
      
      One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.
      -->

      selector 可以用於根據 param 對象的標籤匹配多個對象。提供 `selector: {}` 以匹配所有 ParamKind 的資源。
      
      如果找到多個 params，它們都將使用策略表達式進行計算，並將結果進行 AND 連接。
      
      必須設置 `name` 或 `selector` 中的一個，但 `name` 和 `selector` 是互斥屬性。如果設置了其中一個，另一個必須未設置。
  
  - **spec.policyName** (string)

    <!--
    PolicyName references a ValidatingAdmissionPolicy name which the ValidatingAdmissionPolicyBinding binds to. If the referenced resource does not exist, this binding is considered invalid and will be ignored Required.
    -->

    policyName 引用一個 ValidatingAdmissionPolicy 的名稱，ValidatingAdmissionPolicyBinding
    將綁定到該名稱。如果引用的資源不存在，此綁定將被視爲無效並被忽略。必需。
  
  - **spec.validationActions** ([]string)

    <!--
    *Set: unique values will be kept during a merge*
    
    validationActions declares how Validations of the referenced ValidatingAdmissionPolicy are enforced. If a validation evaluates to false it is always enforced according to these actions.
    
    Failures defined by the ValidatingAdmissionPolicy's FailurePolicy are enforced according to these actions only if the FailurePolicy is set to Fail, otherwise the failures are ignored. This includes compilation errors, runtime errors and misconfigurations of the policy.
    
    validationActions is declared as a set of action values. Order does not matter. validationActions may not contain duplicates of the same action.
    -->

    **集合：唯一值將在合併期間被保留**
    
    validationActions 聲明瞭如何執行引用的 ValidatingAdmissionPolicy 的驗證。
    如果驗證結果爲 false，則根據這些操作強制執行。
    
    僅當 FailurePolicy 設置爲 Fail 時，根據這些操作強制執行由 ValidatingAdmissionPolicy
    的 FailurePolicy 定義的失敗，包括編譯錯誤、運行時錯誤和策略的錯誤設定。否則，這些失敗將被忽略。
    
    validationActions 被聲明爲一組操作值。順序不重要。validationActions 不得包含相同操作的重複項。
  
    <!--
    The supported actions values are:
    
    "Deny" specifies that a validation failure results in a denied request.
    
    "Warn" specifies that a validation failure is reported to the request client in HTTP Warning headers, with a warning code of 299. Warnings can be sent both for allowed or denied admission responses.
    -->

    支持的操作值包括：
    
    "Deny" 指定驗證失敗將導致請求被拒絕。
    
    "Warn" 指定驗證失敗將以 HTTP 警告頭的形式報告給請求客戶端，警告代碼爲 299。警告可以隨允許或拒絕的准入響應一起發送。
  
    <!--
    "Audit" specifies that a validation failure is included in the published audit event for the request. The audit event will contain a `validation.policy.admission.k8s.io/validation_failure` audit annotation with a value containing the details of the validation failures, formatted as a JSON list of objects, each with the following fields: - message: The validation failure message string - policy: The resource name of the ValidatingAdmissionPolicy - binding: The resource name of the ValidatingAdmissionPolicyBinding - expressionIndex: The index of the failed validations in the ValidatingAdmissionPolicy - validationActions: The enforcement actions enacted for the validation failure Example audit annotation: `"validation.policy.admission.k8s.io/validation_failure": "[{\"message\": \"Invalid value\", {\"policy\": \"policy.example.com\", {\"binding\": \"policybinding.example.com\", {\"expressionIndex\": \"1\", {\"validationActions\": [\"Audit\"]}]"`
    -->

    "Audit" 指定驗證失敗將包含在請求的已發佈審計事件中。審計事件將包含一個
    `validation.policy.admission.k8s.io/validation_failure` 審計註解，
    其值包含驗證失敗的詳細信息，格式爲對象列表的 JSON，每個對象具有以下字段：

    - message：驗證失敗消息字符串
    - policy：ValidatingAdmissionPolicy 的資源名稱
    - binding：ValidatingAdmissionPolicyBinding 的資源名稱
    - expressionIndex：在 ValidatingAdmissionPolicy 中失敗驗證的索引
    - validationActions：針對驗證失敗執行的強制操作

    示例審計註解：
    `"validation.policy.admission.k8s.io/validation_failure": "[{\"message\": \"Invalid value\", {\"policy\": \"policy.example.com\", {\"binding\": \"policybinding.example.com\", {\"expressionIndex\": \"1\", {\"validationActions\": [\"Audit\"]}]"`

    <!--
    Clients should expect to handle additional values by ignoring any values not recognized.
    
    "Deny" and "Warn" may not be used together since this combination needlessly duplicates the validation failure both in the API response body and the HTTP warning headers.
    
    Required.
    -->

    客戶端應預期通過忽略任何未識別的值來處理額外的值。
    
    "Deny" 和 "Warn" 不能一起使用，因爲這種組合會不必要地在 API 響應體和 HTTP 警告頭中重複驗證失敗。
    
    必需。

<!--
## Operations {#Operations}
-->
## 操作   {#Operations}

<hr>

<!--
### `get` read the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `get` 讀取指定的 ValidatingAdmissionPolicy

#### HTTP 請求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}


<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  ValidatingAdmissionPolicy 的名稱。

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
## 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `get` 讀取指定 ValidatingAdmissionPolicy 的狀態

#### HTTP 請求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** （**路徑參數**）: string，必需

  ValidatingAdmissionPolicy 的名稱。

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ValidatingAdmissionPolicy

#### HTTP Request
-->
### `list` 列出或監視 ValidatingAdmissionPolicy 類型的對象

#### HTTP 請求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-v1#ValidatingAdmissionPolicyList" >}}">ValidatingAdmissionPolicyList</a>): OK

401: Unauthorized

<!--
### `create` create a ValidatingAdmissionPolicy

#### HTTP Request
-->
### `create` 創建 ValidatingAdmissionPolicy

#### HTTP 請求

POST /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

<!--
#### Parameters

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
#### 參數

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, 必填

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ValidatingAdmissionPolicy

#### HTTP Request

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, required
-->
### `update` 替換指定的 ValidatingAdmissionPolicy

#### HTTP 請求

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### 參數

- **name** （*路徑參數*）：string，必需

  ValidatingAdmissionPolicy 的名稱。

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

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

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ValidatingAdmissionPolicy

#### HTTP Request

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, required
-->
### `update` 替換指定 ValidatingAdmissionPolicy 的狀態

#### HTTP 請求

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### 參數

- **name** （**路徑參數**）：字符串，必需

  ValidatingAdmissionPolicy 的名稱。

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, 必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
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

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `patch` 部分更新指定的 ValidatingAdmissionPolicy

#### HTTP 請求

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

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
-->
- **name** (**路徑參數**): string，必需

  ValidatingAdmissionPolicy 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `patch` 部分更新指定 ValidatingAdmissionPolicy 的狀態

#### HTTP 請求

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  name of the ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `delete` delete a ValidatingAdmissionPolicy

#### HTTP Request
-->
### `delete` 刪除 ValidatingAdmissionPolicy

#### HTTP 請求

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy
-->
### 參數

- **name** (**路徑參數**): string，必需

  ValidatingAdmissionPolicy 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ValidatingAdmissionPolicy

#### HTTP Request
-->
### `deletecollection` 刪除 ValidatingAdmissionPolicy 的集合

#### HTTP 請求

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
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
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
