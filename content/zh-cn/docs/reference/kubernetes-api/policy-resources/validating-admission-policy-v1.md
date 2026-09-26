---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ValidatingAdmissionPolicy"
content_type: "api_reference"
description: "ValidatingAdmissionPolicy 描述了一种准入验证策略的定义，这种策略接受或拒绝一个对象而不对其进行修改。"
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
ValidatingAdmissionPolicy 描述了一种准入验证策略的定义，
这种策略用于接受或拒绝一个对象，而不对其进行修改。

<hr>

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: ValidatingAdmissionPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.
  -->

  标准的对象元数据；更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicySpec)

  <!--
  Specification of the desired behavior of the ValidatingAdmissionPolicy.
  -->

  ValidatingAdmissionPolicy 的期望行为规范。

  <a name="ValidatingAdmissionPolicySpec"></a>
  <!--
  *ValidatingAdmissionPolicySpec is the specification of the desired behavior of the AdmissionPolicy.*

  - **spec.auditAnnotations** ([]AuditAnnotation)

    *Atomic: will be replaced during a merge*
    
    auditAnnotations contains CEL expressions which are used to produce audit annotations for the audit event of the API request. validations and auditAnnotations may not both be empty; a least one of validations or auditAnnotations is required.
  -->

  **ValidatingAdmissionPolicySpec** 是 AdmissionPolicy 的期望行为规范。
  
  - **spec.auditAnnotations** ([]AuditAnnotation)
  
    **原子性：合并期间将被替换**
    
    auditAnnotations 包含用于为 API 请求的审计事件生成审计注解的 CEL 表达式。
    validations 和 auditAnnotations 不能同时为空；至少需要 validations 或 auditAnnotations 中的一个。

    <a name="AuditAnnotation"></a>
    <!--
    *AuditAnnotation describes how to produce an audit annotation for an API request.*

    - **spec.auditAnnotations.key** (string), required

      key specifies the audit annotation key. The audit annotation keys of a ValidatingAdmissionPolicy must be unique. The key must be a qualified name ([A-Za-z0-9][-A-Za-z0-9_.]*) no more than 63 bytes in length.
      
      The key is combined with the resource name of the ValidatingAdmissionPolicy to construct an audit annotation key: "{ValidatingAdmissionPolicy name}/{key}".
      
      If an admission webhook uses the same resource name as this ValidatingAdmissionPolicy and the same audit annotation key, the annotation key will be identical. In this case, the first annotation written with the key will be included in the audit event and all subsequent annotations with the same key will be discarded.
      
      Required.
    -->

    **AuditAnnotation** 描述了如何为 API 请求生成审计注解。
    
    - **spec.auditAnnotations.key** (string)，必需
    
      key 指定了审计注解的键。ValidatingAdmissionPolicy 的审计注解键必须是唯一的。
      键必须是一个合格的名字（[A-Za-z0-9][-A-Za-z0-9_.]*），长度不超过 63 字节。
      
      键与 ValidatingAdmissionPolicy 的资源名称组合以构建审计注解键："{ValidatingAdmissionPolicy 名称}/{key}"。
      
      如果一个准入 Webhook 使用与这个 ValidatingAdmissionPolicy 相同的资源名称和相同的审计注解键，
      那么注解键将是相同的。在这种情况下，使用该键写入的第一个注解将包含在审计事件中，
      并且所有后续使用相同键的注解将被丢弃。
      
      必需。
  
    <!--
    - **spec.auditAnnotations.valueExpression** (string), required

      valueExpression represents the expression which is evaluated by CEL to produce an audit annotation value. The expression must evaluate to either a string or null value. If the expression evaluates to a string, the audit annotation is included with the string value. If the expression evaluates to null or empty string the audit annotation will be omitted. The valueExpression may be no longer than 5kb in length. If the result of the valueExpression is more than 10kb in length, it will be truncated to 10kb.
      
      If multiple ValidatingAdmissionPolicyBinding resources match an API request, then the valueExpression will be evaluated for each binding. All unique values produced by the valueExpressions will be joined together in a comma-separated list.
      
      Required.
    -->

    - **spec.auditAnnotations.valueExpression** (string)，必需
    
      valueExpression 表示由 CEL 求值以生成审计注解值的表达式。该表达式求值结果为字符串或 null 值。
      如果表达式计算为字符串，则包含带有字符串值的审计注解。如果表达式计算为 null 或空字符串，
      则审计注解将被省略。valueExpression 的长度不得超过 5kb。如果 valueExpression
      的结果长度超过 10KB，它将被截断为 10KB。
      
      如果多个 ValidatingAdmissionPolicyBinding 资源匹配一个 API 请求，
      则会为每个绑定计算 valueExpression。所有由 valueExpressions
      产生的唯一值将以逗号分隔列表的形式连接在一起。
      
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
  
    failurePolicy 定义了如何处理准入策略的失败。失败可能由 CEL
    表达式解析错误、类型检查错误、运行时错误以及无效或配置错误的策略定义或绑定引起。
    
    如果 spec.paramKind 引用了一个不存在的 Kind，则该策略无效。如果
    spec.paramRef.name 引用了不存在的资源，则绑定无效。
    
    failurePolicy 不定义如何处理计算为 false 的验证。
    
    当 failurePolicy 设置为 Fail 时，ValidatingAdmissionPolicyBinding validationActions 定义如何处理失败。
    
    允许的值有 Ignore 或 Fail。默认为 Fail。

    <!--
    Possible enum values:
     - `"Fail"` means that an error calling the webhook causes the admission to fail.
     - `"Ignore"` means that an error calling the webhook is ignored.
    -->
  
    可能的枚举值：
      - `"Fail"` 表示调用 Webhook 发生错误时，准入失败。
      - `"Ignore"` 表示调用 Webhook 发生的错误将被忽略。
  
  <!--
  - **spec.matchConditions** ([]MatchCondition)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    MatchConditions is a list of conditions that must be met for a request to be validated. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.
  -->

  - **spec.matchConditions** ([]MatchCondition)
  
    **补丁策略：基于 `name` 键合并**
    
    **映射：在合并期间，基于 name 键的唯一值将被保留**
    
    matchConditions 是请求能够被验证时必须满足的一系列条件。匹配条件过滤已经由 rules、
    namespaceSelector 和 objectSelector 匹配的请求。空的 matchConditions
    列表匹配所有请求。最多允许有 64 个匹配条件。

    <!--
    If a parameter object is provided, it can be accessed via the `params` handle in the same manner as validation expressions.
    
    The exact matching logic is (in order):
      1. If ANY matchCondition evaluates to FALSE, the policy is skipped.
      2. If ALL matchConditions evaluate to TRUE, the policy is evaluated.
      3. If any matchCondition evaluates to an error (but none are FALSE):
         - If failurePolicy=Fail, reject the request
         - If failurePolicy=Ignore, the policy is skipped
    -->

    如果提供了参数对象，可以通过 `params` 句柄以与验证表达式相同的方式访问它。
    
    精确的匹配逻辑（按顺序）：
      1. 如果 matchConditions 中**任意一个**解析为 FALSE，则跳过该策略。
      2. 如果 matchConditions 中**所有条件**都解析为 TRUE，则执行该策略。
      3. 如果任何 matchCondition 解析出现错误（但没有解析为 FALSE）：
         - 如果 failurePolicy=Fail，拒绝请求
         - 如果 failurePolicy=Ignore，则跳过该策略

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

    **MatchCondition 表示将请求发送到 Webhook 时必须满足的条件。**
    
    - **spec.matchConditions.expression** (string)，必需
    
      expression 表示由 CEL 处理的表达式。表达式求值结果必须为 Bool 类型。CEL 表达式可以访问
      AdmissionRequest 和 Authorizer 的内容，这些内容被组织成 CEL 变量：
      
      - 'object' - 来自传入请求的对象。对于 DELETE 请求，该值为 null。
      - 'oldObject' - 现有对象。对于 CREATE 请求，该值为 null。
      - 'request' - 准入请求的属性(/pkg/apis/admission/types.go#AdmissionRequest)。
      - 'authorizer' - 一个 CEL 授权器。可用于对请求的主体（用户或服务账户）执行授权检查。
        参见 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' - 由 'authorizer' 构建并配置了请求资源的 CEL ResourceCheck。
      
      必需。
   
    <!--
    - **spec.matchConditions.name** (string), required

      Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')
      
      Required.
    -->

    - **spec.matchConditions.name** (string)，必需
    
      name 是此匹配条件的标识符，用于 matchConditions 的策略性合并以及为日志记录提供标识符。
      一个好的名称应该能够描述相关的表达式。名称必须是由字母数字字符、`-`、`_` 或 `.` 组成的合格名称，
      并且必须以字母数字字符开头和结尾（例如 'MyName' 或 'my.name' 或 '123-abc'，
      用于验证的正则表达式是 '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]')
      可以包含一个可选的 DNS 子域前缀和 '/' （例如 'example.com/MyName'）。
    
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
  
    matchConstraints 指定此策略设计用来验证的资源。仅当 AdmissionPolicy 匹配**所有**约束时，才会关注请求。
    然而，为了避免集群进入无法通过 API 恢复的不稳定状态，ValidatingAdmissionPolicy 不能匹配 ValidatingAdmissionPolicy 和 ValidatingAdmissionPolicyBinding。
    必需。
  
    <a name="MatchResources"></a>
    **matchResources 决定了是否根据对象是否符合匹配标准来运行准入控制策略。
    排除规则优先于包含规则（如果一个资源同时匹配两者，则它被排除）**
  
    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)
  
      **原子性：在合并期间将被替换**
  
      excludeResourceRules 描述 ValidatingAdmissionPolicy 不应关心的操作及其资源/子资源。
      排除规则优先于包含规则（如果一个资源同时匹配两者，则它被排除）

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

      **namedRuleWithOperations 是操作和资源及其资源名称的元组。**

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        **原子性：在合并期间将被替换**
        
        apiGroups 是资源所属的 API 组。`*` 表示所有组。
        如果存在 `*`，切片的长度必须为一。必需。

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        **原子性：在合并期间将被替换**
        
        apiVersions 是资源所属的 API 版本。`*` 表示所有版本。
        如果存在 `*`，切片的长度必须为一。必需。

      <!--
      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->

      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        **原子性：在合并期间将被替换**
        
        operations 是准入钩子关心的操作 - CREATE、UPDATE、DELETE、CONNECT 或者 `*`
        表示所有这些操作以及将来可能添加的任何准入操作。
        如果存在 `*`，切片的长度必须为一。必需。

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        **原子性：在合并期间将被替换**
        
        resourceNames 是规则适用的名称白名单。空集表示允许所有。

      <!--
      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        **原子性：在合并期间将被替换**
        
        resources 是此规则适用的资源列表。
        
        例如：`pods` 表示 Pods。`pods/log` 表示 Pods 的日志子资源。
        `*` 表示所有资源，但不包括子资源。`pods/*` 表示 Pods 的所有子资源。
        `*/scale` 表示所有扩缩子资源。`*/*` 表示所有资源及其子资源。
        
        如果通配符存在，验证规则将确保资源不会相互重叠。
        
        根据封装对象的不同，可能不允许有子资源。必需。

      <!--
      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope 指定此规则的作用范围。有效值为 `Cluster`、`Namespaced` 和 `*`。
        `Cluster` 表示仅集群作用域的资源匹配此规则。Namespace API 对象是集群作用域的。
        `Namespaced` 表示仅命名空间资源匹配此规则。`*` 表示没有作用范围限制。
        子资源匹配其父资源的作用范围。默认是 `*`。

        <!--
        Possible enum values:
         - `"*"` means that all scopes are included.
         - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.
         - `"Namespaced"` means that scope is limited to namespaced objects.
        -->

        可能的枚举值：
  
         - `"*"` 表示包含所有作用域。
         - `"Cluster"` 表示作用域仅限于集群作用域的对象。Namespace 对象属于集群作用域。
         - `"Namespaced"` 表示范围仅限于命名空间作用域的对象。
  
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

      matchPolicy 定义了如何使用 "MatchResources" 列表来匹配传入的请求。允许的值为 "Exact" 或 "Equivalent"。

      - Exact：仅当请求完全匹配指定规则时才匹配请求。
        例如，如果 deployments 可以通过 apps/v1、apps/v1beta1 和 extensions/v1beta1 修改，
        但 "rules" 仅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        则对 apps/v1beta1 或 extensions/v1beta1 的请求不会发送到 ValidatingAdmissionPolicy。

      - Equivalent：如果请求修改了规则中列出的资源，即使通过另一个 API 组或版本，
        也会匹配请求。例如，如果 deployments 可以通过 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，
        并且 "rules" 仅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        则对 `apps/v1beta1` 或 `extensions/v1beta1` 的请求将被转换为 `apps/v1` 并发送到 ValidatingAdmissionPolicy。

      默认为 "Equivalent"
  
      可能的枚举值：
        - `"Equivalent"` 表示如果请求通过另一个 API 组或版本修改规则中列出的资源，
          则应将请求发送到 Webhook。
        - `"Exact"` 表示仅当请求与给定规则完全匹配时，才应将请求发送到 Webhook。

    <!--
    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.
      
      For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows:
    -->

    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector 决定了是否基于对象的命名空间是否匹配选择器来对该对象运行准入控制策略。
      如果对象本身是一个命名空间，则匹配是针对 `object.metadata.labels` 执行的。
      如果对象是另一个集群范围的资源，则永远不会跳过此策略。

      例如，要对任何命名空间未关联 "runlevel" 为 "0" 或 "1" 的对象运行 Webhook，你可以将选择算符设置如下：
  
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

      如果你只想对那些命名空间与 "environment" 为 "prod" 或 "staging"
      相关联的对象运行策略，你可以将选择器设置如下：
  
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

      参阅[标签选择算符示例](/zh-cn/docs/concepts/overview/working-with-objects/labels/)获取更多的示例。

      默认为空的 LabelSelector，匹配所有内容。
  
    - **spec.matchConstraints.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.
      -->

      objectSelector 决定了是否基于对象是否有匹配的标签来运行验证。
      objectSelector 会针对将被发送到 CEL 验证的旧对象和新对象进行计算，
      只要其中一个对象匹配选择算符，则视为匹配。Null 对象（在创建时为旧对象，或在删除时为新对象）
      或不能有标签的对象（如 DeploymentRollback 或 PodProxyOptions 对象）不被认为匹配。
      仅当 Webhook 是可选时使用对象选择器，因为终端用户可以通过设置标签跳过准入 Webhook。
      默认为"空" LabelSelector，它匹配所有内容。

    - **spec.matchConstraints.resourceRules** ([]NamedRuleWithOperations)

      <!--
      *Atomic: will be replaced during a merge*
      
      ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.
      -->

      **原子性：将在合并期间被替换**

      resourceRules 描述了 ValidatingAdmissionPolicy 匹配的资源/子资源上的什么操作。
      只要匹配**任何**规则，策略就会关心该操作。

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

      **NamedRuleWithOperations 是操作和带有资源名称的资源的元组。**
        
        - **spec.matchConstraints.resourceRules.apiGroups** ([]string)
        
          **原子性：将在合并期间被替换**
        
          apiGroups 是资源所属的 API 组。`*` 表示所有组。如果存在 `*`，则切片的长度必须为一。必需。
        
        - **spec.matchConstraints.resourceRules.apiVersions** ([]string)
        
          **原子性：将在合并期间被替换**
        
          apiVersions 是资源所属的 API 版本。`*` 表示所有版本。如果存在 `*`，则切片的长度必须为一。必需。

      <!--
      - **spec.matchConstraints.resourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->

      - **spec.matchConstraints.resourceRules.operations** ([]string)
      
        **原子性：在合并期间将被替换**
        
        operations 是准入钩子关心的操作 - CREATE、UPDATE、DELETE、CONNECT
        或者是代表所有这些操作以及任何未来可能添加的准入操作的通配符 `*`。
        如果包含了 `*`，那么切片的长度必须为一。必需字段。
      
      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)
      
        **原子性：在合并期间将被替换**
        
        resourceNames 是规则适用的名称白名单。一个空集合意味着允许所有。可选项。

      <!--
      - **spec.matchConstraints.resourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchConstraints.resourceRules.resources** ([]string)
      
        **原子性：在合并期间将被替换**
        
        resources 是此规则适用的资源列表。
        
        例如：`pods` 表示 pods。`pods/log` 表示 pods 的日志子资源。
        `*` 表示所有资源，但不包括子资源。`pods/*` 表示 pods 的所有子资源。
        `*/scale` 表示所有资源的 scale 子资源。`*/*` 表示所有资源及其子资源。
        
        如果存在通配符，验证规则将确保资源之间不会相互重叠。
        
        根据封装对象的不同，可能不允许有子资源。必需字段。

      <!--
      - **spec.matchConstraints.resourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchConstraints.resourceRules.scope** (string)

        scope 指定此规则的作用范围。有效值为 "`Cluster`"、"`Namespaced`" 和 "`*`"。
        "`Cluster`" 表示只有集群范围的资源匹配此规则。Namespace API 对象是集群范围的。
        "`Namespaced`" 表示只有名字空间作用域的资源匹配此规则。"`*`" 表示没有作用范围限制。
        子资源匹配其父资源的作用范围。默认值为 "`*`"。
 
        <!--
        Possible enum values:
         - `"*"` means that all scopes are included.
         - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.
         - `"Namespaced"` means that scope is limited to namespaced objects.
        -->

        可能的枚举值：
  
         - `"*"` 表示包含所有作用域。
         - `"Cluster"` 表示作用域仅限于集群作用域的对象。Namespace 对象属于集群作用域。
         - `"Namespaced"` 表示作用域仅限于命名空间作用域的对象。 
  
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
  
    paramKind 指定用于参数化此策略的资源类型。如果不存在，则此策略没有参数，
    且不会向验证表达式提供 param CEL 变量。如果 paramKind 引用了一个不存在的类型，
    则此策略定义配置错误，并应用 FailurePolicy。
    如果指定了 paramKind 但在 ValidatingAdmissionPolicyBinding 中未设置
    paramRef，则 params 变量将为 null。
  
    <a name="ParamKind"></a>
    **ParamKind 是组类型和版本的组合。**
  
    - **spec.paramKind.apiVersion** (string)
  
      apiVersion 是资源所属的 API 组版本。格式为 "group/version"。必需字段。
  
    - **spec.paramKind.kind** (string)
  
      kind 是资源所属的 API 类型。必需字段。

  <!--
  - **spec.validations** ([]Validation)

    *Atomic: will be replaced during a merge*
    
    Validations contain CEL expressions which is used to apply the validation. Validations and AuditAnnotations may not both be empty; a minimum of one Validations or AuditAnnotations is required.

    <a name="Validation"></a>
    *Validation specifies the CEL expression which is used to apply the validation.*
  -->

  - **spec.validations** ([]Validation)
  
    **原子性：将在合并期间被替换**
    
    validations 包含用于应用验证的 CEL 表达式。validations
    和 auditAnnotations 不能同时为空；至少需要一个 validations 或 auditAnnotations。
  
    <a name="Validation"></a>
    **Validation 指定用于应用验证的 CEL 表达式。**

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

      expression 表示将由 CEL 计算的表达式。参考：
      https://github.com/google/cel-spec

      CEL 表达式可以访问 API 请求/响应的内容，这些内容被组织成 CEL 变量以及一些其他有用的变量：

      - 'object' - 来自传入请求的对象。对于 DELETE 请求，该值为 null。
      - 'oldObject' - 现有对象。对于 CREATE 请求，该值为 null。
      - 'request' - API 请求的属性（[参考](/pkg/apis/admission/types.go#AdmissionRequest)）。
      - 'params' - 由正在计算的策略绑定引用的参数资源。仅在策略具有 ParamKind 时填充。
      - 'namespaceObject' - 传入对象所属的命名空间对象。对于集群范围的资源，该值为 null。
      - 'variables' - 复合变量的映射，从其名称到其惰性求值的值。
        例如，名为 'foo' 的变量可以作为 'variables.foo' 访问。
      - 'authorizer' - 一个 CEL 鉴权器。可用于对请求的主体（用户或服务帐户）执行授权检查。
        请参阅 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' - 由 'authorizer' 构建并使用请求资源配置的 CEL 资源检查。
  
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

      `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName` 总是可以从对象的根部访问。没有其他元数据属性是可访问的。
      
      只有形式为 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的属性名称是可访问的。当在表达式中访问时，根据以下规则对可访问的属性名称进行转义：
      - `__` 转义为 `__underscores__`
      - `.` 转义为 `__dot__`
      - `-` 转义为 `__dash__`
      - `/` 转义为 `__slash__`
      - 完全匹配 CEL 保留关键字的属性名称转义为 `__{keyword}__`。这些关键字包括：
          "true"、"false"、"null"、"in"、"as"、"break"、"const"、"continue"、"else"、"for"、"function"、"if"、
          "import"、"let"、"loop"、"package"、"namespace"、"return"。
      示例：
      - 访问名为 "namespace" 的属性的表达式：{"Expression": "object.__namespace__ > 0"}
      - 访问名为 "x-prop" 的属性的表达式：{"Expression": "object.x__dash__prop > 0"}
      - 访问名为 "redact__d" 的属性的表达式：{"Expression": "object.redact__underscores__d > 0"}

      <!--
      Equality on arrays with list type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:
        - 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
          non-intersecting elements in `Y` are appended, retaining their partial order.
        - 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
          are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
          non-intersecting keys are appended, retaining their partial order.
      Required.
      -->

      对于类型为 'set' 或 'map' 的列表，数组上的相等性忽略元素顺序，即 [1, 2] == [2, 1]。
      带有 x-kubernetes-list-type 的数组上的连接使用列表类型的语义：

      - 'set'：`X + Y` 执行一个联合操作，其中 `X` 中所有元素的数组位置被保留，
        并且 `Y` 中不相交的元素被追加，保持它们的部分顺序。
      - 'map'：`X + Y` 执行一个合并操作，其中 `X` 中所有键的数组位置被保留，
        但值被 `Y` 中的值覆盖，当 `X` 和 `Y` 的键集相交时。`Y` 中具有不相交键的元素被追加，
        保持它们的部分顺序。

      必需。
  
    <!--
    - **spec.validations.message** (string)

      Message represents the message displayed when validation fails. The message is required if the Expression contains line breaks. The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host" If the Expression contains line breaks. Message is required. The message must not contain line breaks. If unset, the message is "failed Expression: {Expression}".

    - **spec.validations.messageExpression** (string)

      messageExpression declares a CEL expression that evaluates to the validation failure message that is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string. If both message and messageExpression are present on a validation, then messageExpression will be used if validation fails. If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string with only spaces, or a string that contains line breaks, then the validation failure message will also be produced as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the `expression` except for 'authorizer' and 'authorizer.requestResource'. Example: "object.x must be less than max ("+string(params.max)+")"
    -->

    - **spec.validations.message** (string)

      message 表示验证失败时显示的消息。如果 expression 包含换行符，
      则消息是必需的。消息中不能包含换行符。如果未设置，消息为 "failed rule: {Rule}"。
      例如 "must be a URL with the host matching spec.host"。
      如果 expression 包含换行符，则 message 是必需的。消息中不能包含换行符。
      如果未设置，消息为 "failed Expression: {Expression}"。

    - **spec.validations.messageExpression** (string)

      messageExpression 声明一个 CEL 表达式，当此规则失败时返回该表达式计算得到的验证失败消息。
      由于 messageExpression 用作失败消息，它必须计算为字符串。如果验证同时包含
      message 和 messageExpression，则验证失败时将使用 messageExpression。
      如果 messageExpression 导致运行时错误，将记录运行时错误，并且如同未设置
      messageExpression 字段一样生成验证失败消息。如果 messageExpression
      计算为空字符串、仅包含空格的字符串或包含换行符的字符串，则同样会如同未设置 messageExpression
      字段一样生成验证失败消息，并且将记录 messageExpression 产生了空字符串/仅包含空格的字符串/包含换行符的字符串的情况。
      messageExpression 可访问与 `expression` 相同的所有变量，除了 'authorizer' 和
      'authorizer.requestResource'。示例："object.x 必须小于最大值 ("+string(params.max)+")"

    <!--
    - **spec.validations.reason** (string)

      Reason represents a machine-readable description of why this validation failed. If this is the first validation in the list to fail, this reason, as well as the corresponding HTTP response code, are used in the HTTP response to the client. The currently supported reasons are: "Unauthorized", "Forbidden", "Invalid", "RequestEntityTooLarge". If not set, StatusReasonInvalid is used in the response to the client.
    -->

    - **spec.validations.reason** (string)

      reason 表示机器可读的描述，说明为何此验证失败。如果这是列表中第一个失败的验证，
      则这个 reason 以及相应的 HTTP 响应代码将用于对客户端的 HTTP 响应。
      当前支持的原因有："Unauthorized"、"Forbidden"、"Invalid"、"RequestEntityTooLarge"。
      如果没有设置，在响应给客户端时将使用 StatusReasonInvalid。

  <!--
  - **spec.variables** ([]Variable)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    Variables contain definitions of variables that can be used in composition of other expressions. Each variable is defined as a named CEL expression. The variables defined here will be available under `variables` in other expressions of the policy except MatchConditions because MatchConditions are evaluated before the rest of the policy.
    
    The expression of a variable can refer to other variables defined earlier in the list but not those after. Thus, Variables must be sorted by the order of first appearance and acyclic.
  -->

  - **spec.variables** ([]Variable)

    **补丁策略：基于 `name` 键合并**

    **映射：在合并期间，基于 name 键的唯一值将被保留**
    
    变量包含可用于其他表达式组合的变量定义。每个变量都被定义为一个命名的 CEL 表达式。
    这里定义的变量将在策略的其他表达式中的 `variables` 下可用，除了 `matchConditions`，
    因为 `matchConditions` 会在策略其余部分之前进行计算。
    
    变量的表达式可以引用列表中先前定义的其他变量，但不能引用后续定义的变量。
    因此，variables 必须按照首次出现的顺序排序并且不可存在循环的。

    <a name="Variable"></a>
    <!--
    *Variable is the definition of a variable that is used for composition. A variable is defined as a named expression.*

    - **spec.variables.expression** (string), required

      Expression is the expression that will be evaluated as the value of the variable. The CEL expression has access to the same identifiers as the CEL expressions in Validation.

    - **spec.variables.name** (string), required

      Name is the name of the variable. The name must be a valid CEL identifier and unique among all variables. The variable can be accessed in other expressions through `variables` For example, if name is "foo", the variable will be available as `variables.foo`
    -->

    **Variable** 是用于组合的变量定义。变量被定义为一个命名的表达式。
    
    - **spec.variables.expression** (string)，必需
    
      `expression` 是将被计算为变量值的表达式。CEL 表达式可以访问与 validation 中的 CEL 表达式相同的标识符。
    
    - **spec.variables.name** (string)，必需
    
      name 是变量的名称。名称必须是有效的 CEL 标识符，并且在所有变量中唯一。变量可以通过 `variables`
      在其他表达式中访问。例如，如果名称是 "foo"，变量将作为 `variables.foo` 可用。

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

  ValidatingAdmissionPolicy 的状态，包括有助于确定策略是否按预期行为的警告。由系统填充。只读。

  <a name="ValidatingAdmissionPolicyStatus"></a>
  **ValidatingAdmissionPolicyStatus** 表示一个准入验证策略的状态。

  - **status.conditions** ([]Condition)

    **在合并期间，键类型上的唯一值将被保留**

    这些条件表示策略当前状态的最新可用观察结果。

    <a name="Condition"></a>
    **Condition** 包含此 API 资源当前状态某一方面的详细信息。

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

  `lastTransitionTime` 是条件从一个状态转换到另一个状态的最后时间。这应该是底层条件改变的时间。
  如果不知道该时间，使用 API 字段更改的时间是可以接受的。

  <a name="Time"></a>
  **Time** 是对 time.Time 的封装，支持正确地序列化为 YAML 和 JSON。time 包提供的许多工厂方法都有对应的封装。

  - **status.conditions.message** (string)，必填

    `message` 是一个人类可读的消息，指示有关过渡的详细信息。这可以是一个空字符串。

  - **status.conditions.reason** (string)，必填

    `reason` 包含一个编程标识符，指示条件上次转换的原因。特定条件类型的提供者可以为此字段定义预期值和含义，
    以及这些值是否被视为保证的 API。值应当是 CamelCase 格式的字符串。此字段不能为空。

    <!--
    - **status.conditions.status** (string), required

      status of the condition, one of True, False, Unknown.

    - **status.conditions.type** (string), required

      type of condition in CamelCase or in foo.example.com/CamelCase.

    - **status.conditions.observedGeneration** (int64)

      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
    -->

    - **status.conditions.status** (string)，必需
    
      `condition` 的状态，可能是 True、False、Unknown 中的一个。
    
    - **status.conditions.type** (string)，必需
    
      `condition` 的类型，采用 CamelCase 或 `foo.example.com/CamelCase` 格式。
    
    - **status.conditions.observedGeneration** (int64)
    
      `observedGeneration` 表示设置条件时依据的 `.metadata.generation`。例如，如果当前
      `.metadata.generation` 是 12，而 `.status.conditions[x].observedGeneration` 是 9，
      则说明该条件相对于实例的当前状态已过期。

  <!--
  - **status.observedGeneration** (int64)

    The generation observed by the controller.

  - **status.typeChecking** (TypeChecking)

    The results of type checking for each expression. Presence of this field indicates the completion of the type checking.

    <a name="TypeChecking"></a>
    *TypeChecking contains results of type checking the expressions in the ValidatingAdmissionPolicy*
  -->

  - **status.observedGeneration** (int64)
  
    控制器观察到的 `generation`。
  
  - **status.typeChecking** (TypeChecking)
  
    每个表达式的类型检查结果。此字段的存在表明类型检查已完成。
  
    <a name="TypeChecking"></a>
    **`TypeChecking` 包含了对 ValidatingAdmissionPolicy 中表达式进行类型检查的结果**

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

      **原子性：将在合并期间被替换**

      每个表达式的类型检查警告。

      <a name="ExpressionWarning"></a>
      **`ExpressionWarning` 是针对特定表达式的警告信息。**

      - **status.typeChecking.expressionWarnings.fieldRef** (string)，必需

        引用表达式的字段路径。例如，对 validations 第一项的表达式的引用是 "spec.validations[0].expression"

      - **status.typeChecking.expressionWarnings.warning** (string)，必需

        人类可读形式的类型检查信息内容。警告的每一行包含表达式所检查的类型，然后是编译器报告的类型检查错误。

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

  `apiVersion` 定义了对象表示的版本化模式。服务器应该将识别的模式转换为最新的内部值，并可能拒绝未识别的值。
  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind** (string)

  `kind` 是一个字符串值，表示此对象代表的 REST 资源。服务器可能从客户端提交请求的端点推断出该值。
  不能更新。采用驼峰命名法。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## ValidatingAdmissionPolicyBinding {#ValidatingAdmissionPolicyBinding}

<!--
ValidatingAdmissionPolicyBinding binds the ValidatingAdmissionPolicy with paramerized resources. ValidatingAdmissionPolicyBinding and parameter CRDs together define how cluster administrators configure policies for clusters.
-->
ValidatingAdmissionPolicyBinding 将 ValidatingAdmissionPolicy 与参数化资源绑定。
ValidatingAdmissionPolicyBinding 和参数 CRD 共同定义了集群管理员如何为集群配置策略。

<!--
For a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don't use params, otherwise N is the number of parameters selected by the binding.

The CEL expressions of a policy must have a computed CEL cost below the maximum CEL budget. Each evaluation of the policy is given an independent CEL cost budget. Adding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget.
-->
对于一个给定的准入请求，每个绑定将导致其策略被计算 N 次，其中 N 对于不使用参数的策略/绑定是 1，
否则 N 是由绑定选择的参数数量。

策略的 CEL 表达式必须具有低于最大 CEL 预算的计算 CEL 成本。每次策略计算都有独立的
CEL 成本预算。添加/移除策略、绑定或参数不会影响特定（策略，绑定，参数）组合是否在其自身的 CEL 预算内。

<hr>

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **apiVersion** (string)

  `apiVersion` 定义了对象此表示形式的版本化模式。服务器应将识别的模式转换为最新的内部值，
  并可能拒绝未识别的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  `kind` 是一个字符串值，代表此对象表示的 REST 资源。服务器可从客户端提交请求的端点推断出该值。
  不能更新。采用驼峰式命名法。更多信息：
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

  标准的对象元数据；更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

- **spec** (ValidatingAdmissionPolicyBindingSpec)

  ValidatingAdmissionPolicyBinding 的期望行为规范。

  <a name="ValidatingAdmissionPolicyBindingSpec"></a>
  **ValidatingAdmissionPolicyBindingSpec 是 ValidatingAdmissionPolicyBinding 的规范。**
 
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
  
    `matchResources` 声明了哪些资源匹配此绑定并会由此进行验证。注意，这与策略的 `matchConstraints` 相交，
    因此只有被策略匹配的请求才能由此选择。如果此字段未设置，则由策略匹配的所有资源都将由此绑定验证。
    当 `resourceRules` 未设置时，它不限制资源匹配。如果资源符合此对象的其他字段，它将被验证。
    注意，这与 ValidatingAdmissionPolicy matchConstraints 不同，在那里 resourceRules 是必需的。
  
    <a name="MatchResources"></a>
    **MatchResources 根据对象是否满足匹配条件来决定是否对其运行准入控制策略。
    排除规则优先于包含规则（如果一个资源同时匹配两者，则该资源被排除）**
  
  - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)
  
    **原子性：将在合并期间被替换**
  
    `excludeResourceRules` 描述了 ValidatingAdmissionPolicy 应忽略的操作和资源/子资源。
    排除规则优先于包含规则（如果一个资源同时匹配两者，则该资源被排除）
  
    <a name="NamedRuleWithOperations"></a>
    **NamedRuleWithOperations 是操作和资源及资源名称的元组。**

      <!--
      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)

        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
      -->

      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)
      
       **原子性：将在合并期间被替换**
     
        `apiGroups` 是资源所属的 API 组。`*` 表示所有组。
        如果存在 `*`，则切片的长度必须为一。必需。
        
      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)
        
        **原子性：将在合并期间被替换**
        
        `apiVersions` 是资源所属的 API 版本。`*` 表示所有版本。
        如果存在 `*`，则切片的长度必须为一。必需。

      <!--
      - **spec.matchResources.excludeResourceRules.operations** ([]string)

        *Atomic: will be replaced during a merge*
        
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.

      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)

        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
      -->
  
      - **spec.matchResources.excludeResourceRules.operations** ([]string)
      
        **原子性：将在合并期间被替换**
      
        `operations` 是 admission hook 关心的操作 - CREATE、UPDATE、DELETE、CONNECT 或者
        `*` 表示所有这些操作以及将来可能添加的任何 admission 操作。
        如果存在 `*`，则切片的长度必须为一。必需。
      
      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)
      
        **原子性：将在合并期间被替换**
      
        `resourceNames` 是规则适用的名字白名单。空集表示允许所有。
  
      <!--
      - **spec.matchResources.excludeResourceRules.resources** ([]string)

        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
      -->

      - **spec.matchResources.excludeResourceRules.resources** ([]string)
      
        **原子性：将在合并期间被替换**
      
        `resources` 是此规则适用的资源列表。
      
        例如：`pods` 表示 Pod。`pods/log` 表示 Pod 的日志子资源。`*` 表示所有资源，
        但不包括子资源。`pods/*` 表示 Pod 的所有子资源。`*/scale` 表示所有 scale 子资源。
        `*/*` 表示所有资源及其子资源。
      
        如果存在通配符，验证规则将确保资源不会相互重叠。
      
        根据封装对象的不同，可能不允许有子资源。必需。

      <!--
      - **spec.matchResources.excludeResourceRules.scope** (string)

        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
      -->

      - **spec.matchResources.excludeResourceRules.scope** (string)
      
        `scope` 指定此规则的范围。有效值为 "`Cluster`"、"`Namespaced`" 和 "`*`"。"`Cluster`"
        表示只有集群范围的资源将匹配此规则。Namespace API 对象是集群范围的。"`Namespaced`"
        表示只有命名空间范围的资源将匹配此规则。"`*`" 表示没有范围限制。子资源匹配其父资源的范围。默认是 "`*`"。
  
        <!--
        Possible enum values:
         - `"*"` means that all scopes are included.
         - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.
         - `"Namespaced"` means that scope is limited to namespaced objects.
        -->

        可能的枚举值：
  
         - `"*"` 表示包含所有作用域。
         - `"Cluster"` 表示作用域仅限于集群作用域的对象。Namespace 对象属于集群作用域。
         - `"Namespaced"` 表示作用域仅限于命名空间作用域的对象。 
  
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
    
      `matchPolicy` 定义了如何使用 "MatchResources" 列表来匹配传入的请求。允许的值为 "Exact" 或 "Equivalent"。
    
      - `Exact`：仅当请求完全匹配指定规则时才匹配请求。例如，如果 deployments 可以通过
        `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，但 "rules" 仅包含
        `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        则对 `apps/v1beta1` 或 `extensions/v1beta1` 的请求不会发送到 ValidatingAdmissionPolicy。
    
      - `Equivalent`：如果请求修改了规则中列出的资源，即使通过另一个 API 组或版本，也会匹配请求。
        例如，如果 Deployment 可以通过 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改，
        并且 "rules" 仅包含 `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`，
        则对 `apps/v1beta1` 或 `extensions/v1beta1` 的请求将被转换为 `apps/v1` 并发送到 ValidatingAdmissionPolicy。
    
      默认为 `"Equivalent"`

      可能的枚举值：
        - `"Equivalent"` 表示如果请求通过另一个 API 组或版本修改规则中列出的资源，
          则应将请求发送到 Webhook。
        - `"Exact"` 表示仅当请求与给定规则完全匹配时，才应将请求发送到 Webhook。

    <!--
    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.
      
      For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: 
    -->

    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)
    
      `namespaceSelector` 决定了是否基于对象的命名空间是否匹配选择器来对对象运行准入控制策略。
      如果对象本身是一个命名空间，则匹配是在 `object.metadata.labels` 上执行的。
      如果对象是另一个集群范围的资源，则永远不会跳过该策略。
    
      例如，要对任何命名空间未关联 "runlevel" 为 "0" 或 "1" 的对象运行 Webhook，你可以将选择器设置如下：

      ```
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

      如果你只想对那些命名空间与 "environment" 的 "prod" 或 "staging" 相关联的对象运行策略，你可以将选择器设置如下：
  
      ```
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
  
      参见[标签选择器示例](/zh-cn/docs/concepts/overview/working-with-objects/labels/)获取更多例子。

      默认为空的 LabelSelector，它匹配所有内容。
  
    - **spec.matchResources.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.
      -->

      `objectSelector` 决定是否基于对象是否有匹配的标签来运行验证。`objectSelector` 会针对将被发送到
      CEL 验证的旧对象和新对象进行计算，只要其中一个对象匹配选择器，则认为匹配。
      一个空对象（在创建时的旧对象，或在删除时的新对象）或不能有标签的对象（如
      DeploymentRollback 或 PodProxyOptions 对象）不被认为是匹配的。
      仅在 Webhook 是可选的情况下使用对象选择器，因为最终用户可以通过设置标签跳过准入
      Webhook。默认为空的 LabelSelector ，它匹配所有内容。
  
    - **spec.matchResources.resourceRules** ([]NamedRuleWithOperations)

      <!--
      *Atomic: will be replaced during a merge*
      
      ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.*
      -->

      **原子性：将在合并期间被替换**
      
      `resourceRules` 描述了 ValidatingAdmissionPolicy 匹配的资源/子资源上的什么操作。
      如果操作匹配**任意**规则，策略就会关心该操作。
      
      <a name="NamedRuleWithOperations"></a>
      **NamedRuleWithOperations 是操作和带有资源名称的资源的元组。**

      - **spec.matchResources.resourceRules.apiGroups** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：将在合并期间被替换**
      
        `apiGroups` 是资源所属的 API 组。`*` 表示所有组。如果存在 `*`，则切片的长度必须为一。必需。
  
      - **spec.matchResources.resourceRules.apiVersions** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：将在合并期间被替换**
      
        `apiVersions` 是资源所属的 API 版本。`*` 表示所有版本。如果存在 `*`，则切片的长度必须为一。必需。

      - **spec.matchResources.resourceRules.operations** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
   
        Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.
        -->
  
        **原子性：将在合并期间被替换**
  
        `operations` 是准入钩子关心的操作 - CREATE、UPDATE、DELETE、CONNECT 或 `*`
        表示所有这些操作和将来可能添加的任何其他准入操作。如果存在 `*`，则切片的长度必须为一。必需。

      - **spec.matchResources.resourceRules.resourceNames** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
        -->
  
        **原子性：将在合并期间被替换**

        `resourceNames` 是规则适用的名称可选白名单。一个空集意味着允许所有。

      - **spec.matchResources.resourceRules.resources** ([]string)

        <!--
        *Atomic: will be replaced during a merge*
        
        Resources is a list of resources this rule applies to.
        
        For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
        
        If wildcard is present, the validation rule will ensure resources do not overlap with each other.
        
        Depending on the enclosing object, subresources might not be allowed. Required.
        -->
  
        **原子性：将在合并期间被替换**

        `resources` 是此规则适用的资源列表。
        
        例如：'pods' 表示 Pods。'pods/log' 表示 Pods 的日志子资源。`*` 表示所有资源，
        但不包括子资源。`pods/*` 表示 Pods 的所有子资源。`*/scale` 表示所有扩缩子资源。
        `*/*` 表示所有资源及其子资源。
        
        如果通配符存在，验证规则将确保资源不会相互重叠。
        
        取决于外层对象是什么，可能不允许有子资源。必需。

      - **spec.matchResources.resourceRules.scope** (string)

        <!--
        scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
        -->

        `scope` 指定此规则的范围。有效值为 "`Cluster`"、"`Namespaced`" 和 "`*`"。
        
        - "`Cluster`" 表示只有集群范围的资源会匹配此规则。Namespace API 对象是集群范围的。
        - "`Namespaced`" 表示只有命名空间范围的资源会匹配此规则。
        - "`*`" 表示没有范围限制。
        
        子资源匹配其父资源的范围。默认是 "`*`"。

        <!--
        Possible enum values:
         - `"*"` means that all scopes are included.
         - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.
         - `"Namespaced"` means that scope is limited to namespaced objects.
        -->

        可能的枚举值：
  
         - `"*"` 表示包含所有作用域。
         - `"Cluster"` 表示作用域仅限于集群作用域的对象。Namespace 对象属于集群作用域。
         - `"Namespaced"` 表示作用域仅限于命名空间作用域的对象。 
   
  - **spec.paramRef** (ParamRef)

    <!--
    paramRef specifies the parameter resource used to configure the admission control policy. It should point to a resource of the type specified in ParamKind of the bound ValidatingAdmissionPolicy. If the policy specifies a ParamKind and the resource referred to by ParamRef does not exist, this binding is considered mis-configured and the FailurePolicy of the ValidatingAdmissionPolicy applied. If the policy does not specify a ParamKind then this field is ignored, and the rules are evaluated without a param.
    
    <a name="ParamRef"></a>
    *ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding.*
    -->

    `paramRef` 指定了用于配置准入控制策略的参数资源。它应该指向绑定的 ValidatingAdmissionPolicy
    中 `paramKind` 所指定类型的资源。如果策略指定了 `paramKind` 而且由 paramRef 引用的资源不存在，
    则认为此绑定配置错误，并应用 ValidatingAdmissionPolicy 的 FailurePolicy。
    如果策略没有指定 `paramKind`，则此字段将被忽略，规则将在没有参数的情况下进行计算。
    
    <a name="ParamRef"></a>
    **ParamRef** 描述了如何定位将作为策略绑定所应用规则表达式的输入参数。
  
    - **spec.paramRef.name** (string)

      <!--
      name is the name of the resource being referenced.
      
      One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.
      
      A single parameter used for all admission requests can be configured by setting the `name` field, leaving `selector` blank, and setting namespace if `paramKind` is namespace-scoped.
      -->

      `name` 是被引用资源的名称。
      
      `name` 或 `selector` 必须设置一个，但 `name` 和 `selector` 是互斥属性。
      如果设置了其中一个，另一个必须未设置。
      
      通过设置 `name` 字段，留空 `selector`，并根据需要设置 namespace
     （如果 `paramKind` 是命名空间范围的），可以为所有准入请求配置单个参数。
  
    - **spec.paramRef.namespace** (string)

      <!--
      namespace is the namespace of the referenced resource. Allows limiting the search for params to a specific namespace. Applies to both `name` and `selector` fields.
      
      A per-namespace parameter may be used by specifying a namespace-scoped `paramKind` in the policy and leaving this field empty.
      
      - If `paramKind` is cluster-scoped, this field MUST be unset. Setting this field results in a configuration error.
      
      - If `paramKind` is namespace-scoped, the namespace of the object being evaluated for admission will be used when this field is left unset. Take care that if this is left empty the binding must not match any cluster-scoped resources, which will result in an error.
      -->

      `namespace` 是被引用资源的命名空间。允许将参数搜索限制到特定命名空间。适用于
      `name` 和 `selector` 字段。
      
      通过在策略中指定命名空间范围的 `paramKind` 并留空此字段，可以使用每个命名空间的参数。
      
      - 如果 `paramKind` 是集群范围的，此字段必须未设置。设置此字段会导致配置错误。
      
      - 如果 `paramKind` 是命名空间范围的，在计算准入的对象时，如果此字段未设置，则会使用该对象的命名空间。
        请注意，如果此字段为空，则绑定不能匹配任何集群范围的资源，否则将导致错误。
  
    - **spec.paramRef.parameterNotFoundAction** (string)

      <!--
      `parameterNotFoundAction` controls the behavior of the binding when the resource exists, and name or selector is valid, but there are no parameters matched by the binding. If the value is set to `Allow`, then no matched parameters will be treated as successful validation by the binding. If set to `Deny`, then no matched parameters will be subject to the `failurePolicy` of the policy.
      
      Allowed values are `Allow` or `Deny`
      
      Required
      -->

      `parameterNotFoundAction` 控制当资源存在，且名称或选择器有效但没有匹配的参数时绑定的行为。
      如果值设置为 `Allow`，则未匹配到参数将被视为绑定的成功验证。如果设置为 `Deny`，
      则未匹配到参数将会受到策略的 `failurePolicy` 的影响。
      
      允许的值为 `Allow` 或 `Deny`
      
      必需

    - **spec.paramRef.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      <!--
      selector can be used to match multiple param objects based on their labels. Supply selector: {} to match all resources of the ParamKind.
      
      If multiple params are found, they are all evaluated with the policy expressions and the results are ANDed together.
      
      One of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.
      -->

      `selector` 可以用于根据 param 对象的标签匹配多个对象。提供 `selector: {}` 以匹配所有 ParamKind 的资源。
      
      如果找到多个 `params`，它们都将使用策略表达式进行计算，并将结果进行 AND 连接。
      
      必须设置 `name` 或 `selector` 中的一个，但 `name` 和 `selector` 是互斥属性。如果设置了其中一个，另一个必须未设置。
  
  - **spec.policyName** (string)

    <!--
    PolicyName references a ValidatingAdmissionPolicy name which the ValidatingAdmissionPolicyBinding binds to. If the referenced resource does not exist, this binding is considered invalid and will be ignored Required.
    -->

    `policyName` 引用一个 ValidatingAdmissionPolicy 的名称，ValidatingAdmissionPolicyBinding
    将绑定到该名称。如果引用的资源不存在，此绑定将被视为无效并被忽略。必需。
  
  - **spec.validationActions** ([]string)

    <!--
    *Set: unique values will be kept during a merge*
    
    validationActions declares how Validations of the referenced ValidatingAdmissionPolicy are enforced. If a validation evaluates to false it is always enforced according to these actions.
    
    Failures defined by the ValidatingAdmissionPolicy's FailurePolicy are enforced according to these actions only if the FailurePolicy is set to Fail, otherwise the failures are ignored. This includes compilation errors, runtime errors and misconfigurations of the policy.
    
    validationActions is declared as a set of action values. Order does not matter. validationActions may not contain duplicates of the same action.
    -->

    **集合：唯一值将在合并期间被保留**
    
    `validationActions` 声明了如何执行引用的 ValidatingAdmissionPolicy 的验证。
    如果验证结果为 false，则根据这些操作强制执行。
    
    仅当 FailurePolicy 设置为 Fail 时，根据这些操作强制执行由 ValidatingAdmissionPolicy
    的 FailurePolicy 定义的失败，包括编译错误、运行时错误和策略的错误配置。否则，这些失败将被忽略。
    
    `validationActions` 被声明为一组操作值。顺序不重要。`validationActions` 不得包含相同操作的重复项。
  
    <!--
    The supported actions values are:
    
    "Deny" specifies that a validation failure results in a denied request.
    
    "Warn" specifies that a validation failure is reported to the request client in HTTP Warning headers, with a warning code of 299. Warnings can be sent both for allowed or denied admission responses.
    -->

    支持的操作值包括：
    
    "Deny" 指定验证失败将导致请求被拒绝。
    
    "Warn" 指定验证失败将以 HTTP 警告头的形式报告给请求客户端，警告代码为 299。警告可以随允许或拒绝的准入响应一起发送。
  
    <!--
    "Audit" specifies that a validation failure is included in the published audit event for the request. The audit event will contain a `validation.policy.admission.k8s.io/validation_failure` audit annotation with a value containing the details of the validation failures, formatted as a JSON list of objects, each with the following fields: - message: The validation failure message string - policy: The resource name of the ValidatingAdmissionPolicy - binding: The resource name of the ValidatingAdmissionPolicyBinding - expressionIndex: The index of the failed validations in the ValidatingAdmissionPolicy - validationActions: The enforcement actions enacted for the validation failure Example audit annotation: `"validation.policy.admission.k8s.io/validation_failure": "[{\"message\": \"Invalid value\", {\"policy\": \"policy.example.com\", {\"binding\": \"policybinding.example.com\", {\"expressionIndex\": \"1\", {\"validationActions\": [\"Audit\"]}]"`
    -->

    "Audit" 指定验证失败将包含在请求的已发布审计事件中。审计事件将包含一个
    `validation.policy.admission.k8s.io/validation_failure` 审计注解，
    其值包含验证失败的详细信息，格式为对象列表的 JSON，每个对象具有以下字段：

    - message：验证失败消息字符串
    - policy：ValidatingAdmissionPolicy 的资源名称
    - binding：ValidatingAdmissionPolicyBinding 的资源名称
    - expressionIndex：在 ValidatingAdmissionPolicy 中失败验证的索引
    - validationActions：针对验证失败执行的强制操作

    示例审计注解：
    `"validation.policy.admission.k8s.io/validation_failure": "[{\"message\": \"Invalid value\", {\"policy\": \"policy.example.com\", {\"binding\": \"policybinding.example.com\", {\"expressionIndex\": \"1\", {\"validationActions\": [\"Audit\"]}]"`

    <!--
    Clients should expect to handle additional values by ignoring any values not recognized.
    
    "Deny" and "Warn" may not be used together since this combination needlessly duplicates the validation failure both in the API response body and the HTTP warning headers.
    
    Required.
    -->

    客户端应预期通过忽略任何未识别的值来处理额外的值。
    
    "Deny" 和 "Warn" 不能一起使用，因为这种组合会不必要地在 API 响应体和 HTTP 警告头中重复验证失败。
    
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
### `get` 读取指定的 ValidatingAdmissionPolicy

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}


<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** （**路径参数**）: string，必需

  ValidatingAdmissionPolicy 的名称。

- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
## 响应

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `get` 读取指定 ValidatingAdmissionPolicy 的状态

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** （**路径参数**）: string，必需

  ValidatingAdmissionPolicy 的名称。

- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ValidatingAdmissionPolicy

#### HTTP Request
-->
### `list` 列出或监视 ValidatingAdmissionPolicy 类型的对象

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-v1#ValidatingAdmissionPolicyList" >}}">ValidatingAdmissionPolicyList</a>): OK

401: Unauthorized

<!--
### `create` create a ValidatingAdmissionPolicy

#### HTTP Request
-->
### `create` 创建 ValidatingAdmissionPolicy

#### HTTP 请求

POST /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

<!--
#### Parameters

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
#### 参数

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, 必填

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

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
### `update` 替换指定的 ValidatingAdmissionPolicy

#### HTTP 请求

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### 参数

- **name** （*路径参数*）：string，必需

  ValidatingAdmissionPolicy 的名称。

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
### `update` 替换指定 ValidatingAdmissionPolicy 的状态

#### HTTP 请求

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### 参数

- **name** （**路径参数**）：字符串，必需

  ValidatingAdmissionPolicy 的名称。

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

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `patch` 部分更新指定的 ValidatingAdmissionPolicy

#### HTTP 请求

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

<!--
#### Parameters
-->
#### 参数

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
- **name** (**路径参数**): string，必需

  ValidatingAdmissionPolicy 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ValidatingAdmissionPolicy

#### HTTP Request
-->
### `patch` 部分更新指定 ValidatingAdmissionPolicy 的状态

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  name of the ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

<!--
### `delete` delete a ValidatingAdmissionPolicy

#### HTTP Request
-->
### `delete` 删除 ValidatingAdmissionPolicy

#### HTTP 请求

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ValidatingAdmissionPolicy
-->
### 参数

- **name** (**路径参数**): string，必需

  ValidatingAdmissionPolicy 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ValidatingAdmissionPolicy

#### HTTP Request
-->
### `deletecollection` 删除 ValidatingAdmissionPolicy 的集合

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

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
- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

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
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
