---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectRulesReview"
content_type: "api_reference"
description: "SelfSubjectRulesReview 枚举当前用户可以在某命名空间内执行的操作集合。"
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
SelfSubjectRulesReview 枚举当前用户可以在某命名空间内执行的操作集合。
返回的操作列表可能不完整，具体取决于服务器的鉴权模式以及评估过程中遇到的任何错误。
SelfSubjectRulesReview 应由 UI 用于显示/隐藏操作，或让最终用户尽快理解自己的权限。
SelfSubjectRulesReview 不得被外部系统使用以驱动鉴权决策，
因为这会引起混淆代理人（Confused deputy）、缓存有效期/吊销（Cache lifetime/revocation）和正确性问题。
SubjectAccessReview 和 LocalAccessReview 是遵从 API 服务器所做鉴权决策的正确方式。

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

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReviewSpec" >}}">SelfSubjectRulesReviewSpec</a>)，必需
  
  spec 包含有关正在评估的请求的信息。
<!--
- **status** (SubjectRulesReviewStatus)
  Status is filled in by the server and indicates the set of actions a user can perform.
  <a name="SubjectRulesReviewStatus"></a>
  *SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it's safe to assume the subject has that permission, even if that list is incomplete.*
-->
- **status** (SubjectRulesReviewStatus)
  
  status 由服务器填写，表示用户可以执行的操作的集合。
  
  <a name="SubjectRulesReviewStatus"></a>
  **SubjectRulesReviewStatus 包含规则检查的结果。
  此检查可能不完整，具体取决于服务器配置的 Authorizer 的集合以及评估期间遇到的任何错误。
  由于鉴权规则是叠加的，所以如果某个规则出现在列表中，即使该列表不完整，也可以安全地假定该主体拥有该权限。**

  <!--
  - **status.incomplete** (boolean), required
    Incomplete is true when the rules returned by this call are incomplete. This is most commonly encountered when an authorizer, such as an external authorizer, doesn't support rules evaluation.
  - **status.nonResourceRules** ([]NonResourceRule), required
    NonResourceRules is the list of actions the subject is allowed to perform on non-resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
    <a name="NonResourceRule"></a>
    *NonResourceRule holds information that describes a rule for the non-resource*
  -->

  - **status.incomplete** (boolean)，必需
    
    当此调用返回的规则不完整时，incomplete 结果为 true。
    这种情况常见于 Authorizer（例如外部 Authorizer）不支持规则评估时。
  
  - **status.nonResourceRules** ([]NonResourceRule)，必需
    
    nonResourceRules 是允许主体对非资源执行路径执行的操作列表。
    该列表顺序不重要，可以包含重复项，还可能不完整。
    
    <a name="NonResourceRule"></a>
    **nonResourceRule 包含描述非资源路径的规则的信息。**

    <!--
    - **status.nonResourceRules.verbs** ([]string), required
      Verb is a list of kubernetes non-resource API verbs, like: get, post, put, delete, patch, head, options.  "*" means all.
    - **status.nonResourceRules.nonResourceURLs** ([]string)
      NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path.  "*" means all. 
    -->

    - **status.nonResourceRules.verbs** ([]string)，必需
      
      verb 是 kubernetes 非资源 API 动作的列表，例如 get、post、put、delete、patch、head、options。
      `*` 表示所有动作。
    
    - **status.nonResourceRules.nonResourceURLs** ([]string)
      
      nonResourceURLs 是用户应有权访问的一组部分 URL。
      允许使用 `*`，但仅能作为路径中最后一段且必须用于完整的一段。
      `*` 表示全部。
      
  <!--
  - **status.resourceRules** ([]ResourceRule), required
    ResourceRules is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
    <a name="ResourceRule"></a>
    *ResourceRule is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.*
    - **status.resourceRules.verbs** ([]string), required
    Verb is a list of kubernetes resource API verbs, like: get, list, watch, create, update, delete, proxy.  "*" means all. 
  -->

  - **status.resourceRules** ([]ResourceRule)，必需
    
    resourceRules 是允许主体对资源执行的操作的列表。
    该列表顺序不重要，可以包含重复项，还可能不完整。
    
    <a name="ResourceRule"></a>
    **resourceRule 是允许主体对资源执行的操作的列表。该列表顺序不重要，可以包含重复项，还可能不完整。**
    
    - **status.resourceRules.verbs** ([]string)，必需
      
      verb 是 kubernetes 资源 API 动作的列表，例如 get、list、watch、create、update、delete、proxy。
      `*` 表示所有动作。

    <!--
    - **status.resourceRules.apiGroups** ([]string)
      APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed.  "*" means all.
    - **status.resourceRules.resourceNames** ([]string)
      ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.  "*" means all.
    - **status.resourceRules.resources** ([]string)
      Resources is a list of resources this rule applies to.  "*" means all in the specified apiGroups.
       "*/foo" represents the subresource 'foo' for all resources in the specified apiGroups.
    -->

    - **status.resourceRules.apiGroups** ([]string)
      
      apiGroups 是包含资源的 APIGroup 的名称。
      如果指定了多个 API 组，则允许对任何 API 组中枚举的资源之一请求任何操作。
      `*` 表示所有 APIGroup。
    
    - **status.resourceRules.resourceNames** ([]string)
      
      resourceNames 是此规则所适用的资源名称白名单，可选。
      空集合意味着允许所有资源。
      `*` 表示所有资源。
    
    - **status.resourceRules.resources** ([]string)
      
      resources 是此规则所适用的资源的列表。
      `*` 表示指定 APIGroup 中的所有资源。
      `*/foo` 表示指定 APIGroup 中所有资源的子资源 "foo"。

  <!--
  - **status.evaluationError** (string)
    EvaluationError can appear in combination with Rules. It indicates an error occurred during rule evaluation, such as an authorizer that doesn't support rule evaluation, and that ResourceRules and/or NonResourceRules may be incomplete.
  -->

  - **status.evaluationError** (string)
    
    evaluationError 可以与 rules 一起出现。
    它表示在规则评估期间发生错误，例如 Authorizer 不支持规则评估以及 resourceRules 和/或 nonResourceRules 可能不完整。

## SelfSubjectRulesReviewSpec {#SelfSubjectRulesReviewSpec}

<!--
SelfSubjectRulesReviewSpec defines the specification for SelfSubjectRulesReview.

<hr>

- **namespace** (string)

  Namespace to evaluate rules for. Required.
-->
SelfSubjectRulesReviewSpec 定义 SelfSubjectRulesReview 的规范。

<hr>

- **namespace** (string)
  
  namespace 是要评估规则的命名空间。
  必需。

<!--
## Operations {#Operations}

<hr>

### `create` create a SelfSubjectRulesReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 SelfSubjectRulesReview

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Accepted

401: Unauthorized
