---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "FlowSchema"
content_type: "api_reference"
description: "FlowSchema 定义一组流的模式。"
title: "FlowSchema"
weight: 1
---
<!--
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "FlowSchema"
content_type: "api_reference"
description: "FlowSchema defines the schema of a group of flows."
title: "FlowSchema"
weight: 1
auto_generated: true
-->

`apiVersion: flowcontrol.apiserver.k8s.io/v1`

`import "k8s.io/api/flowcontrol/v1"`

## FlowSchema {#FlowSchema}

<!--
FlowSchema defines the schema of a group of flows. Note that a flow is made up of a set of inbound API requests with similar attributes and is identified by a pair of strings: the name of the FlowSchema and a "flow distinguisher".
-->
FlowSchema 定义一组流的模式。请注意，一个流由属性类似的一组入站 API 请求组成，
用一对字符串进行标识：FlowSchema 的名称和一个 “流区分项”。

<hr>

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: FlowSchema

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  `metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaSpec" >}}">FlowSchemaSpec</a>)

  `spec` is the specification of the desired behavior of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  `metadata` 是标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaSpec" >}}">FlowSchemaSpec</a>)

  `spec` 是 FlowSchema 预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaStatus" >}}">FlowSchemaStatus</a>)

  `status` is the current status of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaStatus" >}}">FlowSchemaStatus</a>)

  `status` 是 FlowSchema 的当前状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## FlowSchemaSpec {#FlowSchemaSpec}

<!--
FlowSchemaSpec describes how the FlowSchema's specification looks like.
-->
FlowSchemaSpec 描述 FlowSchema 的规约看起来是怎样的。

<hr>

<!--
- **distinguisherMethod** (FlowDistinguisherMethod)

  `distinguisherMethod` defines how to compute the flow distinguisher for requests that match this schema. `nil` specifies that the distinguisher is disabled and thus will always be the empty string.

  <a name="FlowDistinguisherMethod"></a>
  *FlowDistinguisherMethod specifies the method of a flow distinguisher.*

  - **distinguisherMethod.type** (string), required

    `type` is the type of flow distinguisher method The supported types are "ByUser" and "ByNamespace". Required.
-->
- **distinguisherMethod** (FlowDistinguisherMethod)

  `distinguisherMethod` 定义如何为匹配此模式的请求来计算流区分项。
  `nil` 表示该区分项被禁用，且因此将始终为空字符串。

  <a name="FlowDistinguisherMethod"></a>
  **FlowDistinguisherMethod 指定流区分项的方法。**

  - **distinguisherMethod.type** (string)，必需

    `type` 是流区分项的类型。支持的类型为 “ByUser” 和 “ByNamespace”。必需。

<!--
- **matchingPrecedence** (int32)

  `matchingPrecedence` is used to choose among the FlowSchemas that match a given request. The chosen FlowSchema is among those with the numerically lowest (which we take to be logically highest) MatchingPrecedence.  Each MatchingPrecedence value must be ranged in [1,10000]. Note that if the precedence is not specified, it will be set to 1000 as default.
-->
- **matchingPrecedence** (int32)

  `matchingPrecedence` 用于选择与给定请求匹配的一个 FlowSchema。
  选中的 FlowSchema 是某个 MatchingPrecedence 数值最小（我们视其为逻辑上最大）的 FlowSchema。
  每个 MatchingPrecedence 值必须在 [1,10000] 的范围内。
  请注意，如果未指定优先顺序，则其默认设为 1000。

<!--
- **priorityLevelConfiguration** (PriorityLevelConfigurationReference), required

  `priorityLevelConfiguration` should reference a PriorityLevelConfiguration in the cluster. If the reference cannot be resolved, the FlowSchema will be ignored and marked as invalid in its status. Required.

  <a name="PriorityLevelConfigurationReference"></a>
  *PriorityLevelConfigurationReference contains information that points to the "request-priority" being used.*

  - **priorityLevelConfiguration.name** (string), required

    `name` is the name of the priority level configuration being referenced Required.
-->
- **priorityLevelConfiguration** (PriorityLevelConfigurationReference)，必需

  `priorityLevelConfiguration` 应引用集群中的 PriorityLevelConfiguration。
  如果引用无法被解析，则忽略此 FlowSchema，并在其状态中将其标记为无效。必需。

  <a name="PriorityLevelConfigurationReference"></a>
  **PriorityLevelConfigurationReference 包含指向正被使用的 “request-priority” 的信息。**

  - **priorityLevelConfiguration.name** (string)，必需

    `name` 是正被引用的优先级配置的名称。必需。

<!--
- **rules** ([]PolicyRulesWithSubjects)

  *Atomic: will be replaced during a merge*
  
  `rules` describes which requests will match this flow schema. This FlowSchema matches a request if and only if at least one member of rules matches the request. if it is an empty slice, there will be no requests matching the FlowSchema.

  <a name="PolicyRulesWithSubjects"></a>
  *PolicyRulesWithSubjects prescribes a test that applies to a request to an apiserver. The test considers the subject making the request, the verb being requested, and the resource to be acted upon. This PolicyRulesWithSubjects matches a request if and only if both (a) at least one member of subjects matches the request and (b) at least one member of resourceRules or nonResourceRules matches the request.*
-->
- **rules** ([]PolicyRulesWithSubjects)

  **原子性：将在合并期间被替换**
  
  `rules` 描述哪些请求将与这个流模式匹配。只有当至少一条规则与请求匹配时，
  才视为此 FlowSchema 与该请求匹配。如果字段值为空表，则 FlowSchema 不会与任何请求匹配。

  <a name="PolicyRulesWithSubjects"></a>
  **PolicyRulesWithSubjects 给出针对 API 服务器请求的一个测试。
  该测试将检查发出请求的主体、所请求的动作和要操作的资源。
  只有同时满足以下两个条件时，才表示此 PolicyRulesWithSubjects 与请求匹配：
  (a) 至少一个主体成员与请求匹配且
  (b) 至少 resourceRules 或 nonResourceRules 的一个成员与请求匹配。**

  <!--
  - **rules.subjects** ([]Subject), required

    *Atomic: will be replaced during a merge*
    
    subjects is the list of normal user, serviceaccount, or group that this rule cares about. There must be at least one member in this slice. A slice that includes both the system:authenticated and system:unauthenticated user groups matches every request. Required.

    <a name="Subject"></a>
    *Subject matches the originator of a request, as identified by the request authentication system. There are three ways of matching an originator; by user, group, or service account.*
  -->

  - **rules.subjects** ([]Subject)，必需

    **原子性：将在合并期间被替换**
    
    subjects 是此规则相关的普通用户、服务账号或组的列表。在这个列表中必须至少有一个成员。
    同时包含 system:authenticated 和 system:unauthenticated 用户组的列表会与每个请求匹配。
    此字段为必需。

    <a name="Subject"></a>
    **Subject 用来与匹配请求的发起方，请求的发起方由请求身份认证系统识别出来。
    有三种方式来匹配一个发起方：按用户、按组或按服务账号。**

    <!--
    - **rules.subjects.kind** (string), required

      `kind` indicates which one of the other fields is non-empty. Required

    - **rules.subjects.group** (GroupSubject)

      `group` matches based on user group name.

      <a name="GroupSubject"></a>
      *GroupSubject holds detailed information for group-kind subject.*
    -->

    - **rules.subjects.kind** (string)，必需

      `kind` 标示其他字段中的哪个字段必须非空。必需。

    - **rules.subjects.group** (GroupSubject)

      `group` 根据用户组名称进行匹配。

      <a name="GroupSubject"></a>
      **GroupSubject 保存组类别主体的详细信息。**

      <!--
      - **rules.subjects.group.name** (string), required

        name is the user group that matches, or "*" to match all user groups. See https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go for some well-known group names. Required.
      -->

      - **rules.subjects.group.name** (string)，必需

        name 是要匹配的用户组，或使用 `*` 匹配所有用户组。有关一些广为人知的组名，请参阅
        https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go。必需。
    
    <!--
    - **rules.subjects.serviceAccount** (ServiceAccountSubject)

      `serviceAccount` matches ServiceAccounts.

      <a name="ServiceAccountSubject"></a>
      *ServiceAccountSubject holds detailed information for service-account-kind subject.*

      - **rules.subjects.serviceAccount.name** (string), required

        `name` is the name of matching ServiceAccount objects, or "*" to match regardless of name. Required.

      - **rules.subjects.serviceAccount.namespace** (string), required

        `namespace` is the namespace of matching ServiceAccount objects. Required.
    -->

    - **rules.subjects.serviceAccount** (ServiceAccountSubject)

      `serviceAccount` 与 ServiceAccount 对象进行匹配。

      <a name="ServiceAccountSubject"></a>
      **ServiceAccountSubject 保存服务账号类别主体的详细信息。**

      - **rules.subjects.serviceAccount.name** (string)，必需

        `name` 是要匹配的 ServiceAccount 对象的名称，可使用 `*` 匹配所有名称。必需。

      - **rules.subjects.serviceAccount.namespace** (string)，必需

        `namespace` 是要匹配的 ServiceAccount 对象的名字空间。必需。
    
    <!--
    - **rules.subjects.user** (UserSubject)

      `user` matches based on username.

      <a name="UserSubject"></a>
      *UserSubject holds detailed information for user-kind subject.*

      - **rules.subjects.user.name** (string), required

        `name` is the username that matches, or "*" to match all usernames. Required.
    -->

    - **rules.subjects.user** (UserSubject)

      `user` 根据用户名进行匹配。

      <a name="UserSubject"></a>
      **UserSubject 保存用户类别主体的详细信息。**

      - **rules.subjects.user.name** (string)，必需

        `name` 是要匹配的用户名，可使用 `*` 匹配所有用户名。必需。
  
  <!--
  - **rules.nonResourceRules** ([]NonResourcePolicyRule)

    *Atomic: will be replaced during a merge*
    
    `nonResourceRules` is a list of NonResourcePolicyRules that identify matching requests according to their verb and the target non-resource URL.

    <a name="NonResourcePolicyRule"></a>
    *NonResourcePolicyRule is a predicate that matches non-resource requests according to their verb and the target non-resource URL. A NonResourcePolicyRule matches a request if and only if both (a) at least one member of verbs matches the request and (b) at least one member of nonResourceURLs matches the request.*
  -->

  - **rules.nonResourceRules** ([]NonResourcePolicyRule)

    **原子性：将在合并期间被替换**
    
    `nonResourceRules` 是由 NonResourcePolicyRule 对象构成的列表，
    根据请求的动作和目标非资源 URL 来识别匹配的请求。

    <a name="NonResourcePolicyRule"></a>
    **NonResourcePolicyRule 是根据请求的动作和目标非资源 URL 来匹配非资源请求的一种规则。
    只有满足以下两个条件时，NonResourcePolicyRule 才会匹配一个请求：
    (a) 至少 verbs 的一个成员与请求匹配且 (b) 至少 nonResourceURLs 的一个成员与请求匹配。**
    
    <!--
    - **rules.nonResourceRules.nonResourceURLs** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `nonResourceURLs` is a set of url prefixes that a user should have access to and may not be empty. For example:
        - "/healthz" is legal
        - "/hea*" is illegal
        - "/hea" is legal but matches nothing
        - "/hea/*" also matches nothing
        - "/healthz/*" matches all per-component health checks.
      "*" matches all non-resource urls. if it is present, it must be the only entry. Required.
    -->

    - **rules.nonResourceRules.nonResourceURLs** ([]string)，必需

      **集合：合并期间保留唯一值**
      
      `nonResourceURLs` 是用户有权访问的一组 URL 前缀，不可以为空。
      此字段为必需设置的字段。例如：
        - "/healthz" 是合法的
        - "/hea*" 是不合法的
        - "/hea" 是合法的但不会与任何项匹配
        - "/hea/*" 也不会与任何项匹配
        - "/healthz/*" 与所有组件自身的的健康检查路径匹配。
      `*` 与所有非资源 URL 匹配。如果存在此字符，则必须是唯一的输入项。
      必需。
    
    <!--
    - **rules.nonResourceRules.verbs** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `verbs` is a list of matching verbs and may not be empty. "*" matches all verbs. If it is present, it must be the only entry. Required.
    -->

    - **rules.nonResourceRules.verbs** ([]string)，必需

      **集合：在合并期间保留唯一值**
      
      `verbs` 是与动作匹配的列表，不可以为空。`*` 与所有动作匹配。
      如果存在此字符，则必须是唯一的输入项。必需。
  
  <!--
  - **rules.resourceRules** ([]ResourcePolicyRule)

    *Atomic: will be replaced during a merge*
    
    `resourceRules` is a slice of ResourcePolicyRules that identify matching requests according to their verb and the target resource. At least one of `resourceRules` and `nonResourceRules` has to be non-empty.

    <a name="ResourcePolicyRule"></a>
    *ResourcePolicyRule is a predicate that matches some resource requests, testing the request's verb and the target resource. A ResourcePolicyRule matches a resource request if and only if: (a) at least one member of verbs matches the request, (b) at least one member of apiGroups matches the request, (c) at least one member of resources matches the request, and (d) either (d1) the request does not specify a namespace (i.e., `Namespace==""`) and clusterScope is true or (d2) the request specifies a namespace and least one member of namespaces matches the request's namespace.*
  -->

  - **rules.resourceRules** ([]ResourcePolicyRule)

    **原子性：将在合并期间被替换**
    
    `resourceRules` 是 ResourcePolicyRule 对象的列表，根据请求的动作和目标资源识别匹配的请求。
    `resourceRules` 和 `nonResourceRules` 两者必须至少有一个非空。

    <a name="ResourcePolicyRule"></a>
    **ResourcePolicyRule 是用来匹配资源请求的规则，对请求的动作和目标资源进行测试。
    只有满足以下条件时，ResourcePolicyRule 才会与某个资源请求匹配：
    (a) 至少 verbs 的一个成员与请求的动作匹配，
    (b) 至少 apiGroups 的一个成员与请求的 API 组匹配，
    (c) 至少 resources 的一个成员与请求的资源匹配，
    (d) 要么 (d1) 请求未指定一个名字空间（即，`namespace==""`）且 clusterScope 为 true，
    要么 (d2) 请求指定了一个名字空间，且至少 namespaces 的一个成员与请求的名字空间匹配。**

    <!--
    - **rules.resourceRules.apiGroups** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `apiGroups` is a list of matching API groups and may not be empty. "*" matches all API groups and, if present, must be the only entry. Required.

    - **rules.resourceRules.resources** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `resources` is a list of matching resources (i.e., lowercase and plural) with, if desired, subresource.  For example, [ "services", "nodes/status" ].  This list may not be empty. "*" matches all resources and, if present, must be the only entry. Required.
    -->

    - **rules.resourceRules.apiGroups** ([]string)，必需

      **集合：合并期间保留唯一值**
      
      `apiGroups` 是与 API 组匹配的列表，不可以为空。`*` 表示与所有 API 组匹配。
      如果存在此字符，则其必须是唯一的条目。必需。

    - **rules.resourceRules.resources** ([]string)，必需

      **集合：合并期间保留唯一值**
      
      `resources` 是匹配的资源（即小写和复数）的列表，如果需要的话，还可以包括子资源。
      例如 [ "services", "nodes/status" ]。此列表不可以为空。
      `*` 表示与所有资源匹配。如果存在此字符，则必须是唯一的条目。必需。

    <!--
    - **rules.resourceRules.verbs** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `verbs` is a list of matching verbs and may not be empty. "*" matches all verbs and, if present, must be the only entry. Required.

    - **rules.resourceRules.clusterScope** (boolean)

      `clusterScope` indicates whether to match requests that do not specify a namespace (which happens either because the resource is not namespaced or the request targets all namespaces). If this field is omitted or false then the `namespaces` field must contain a non-empty list.
    -->

    - **rules.resourceRules.verbs** ([]string)，必需

      **集合：合并期间保留唯一值**
      
      `verbs` 是匹配的动作的列表，不可以为空。`*` 表示与所有动作匹配。
      如果存在此字符，则必须是唯一的条目。必需。

    - **rules.resourceRules.clusterScope** (boolean)

      `clusterScope` 表示是否与未指定名字空间
      （出现这种情况的原因是该资源没有名字空间或请求目标面向所有名字空间）的请求匹配。
      如果此字段被省略或为 false，则 `namespaces` 字段必须包含一个非空的列表。

    <!--
    - **rules.resourceRules.namespaces** ([]string)

      *Set: unique values will be kept during a merge*
      
      `namespaces` is a list of target namespaces that restricts matches.  A request that specifies a target namespace matches only if either (a) this list contains that target namespace or (b) this list contains "*".  Note that "*" matches any specified namespace but does not match a request that _does not specify_ a namespace (see the `clusterScope` field for that). This list may be empty, but only if `clusterScope` is true.
    -->

    - **rules.resourceRules.namespaces** ([]string)

      **集合：合并期间保留唯一值**
      
      `namespaces` 是限制匹配的目标的名字空间的列表。
      指定一个目标名字空间的请求只会在以下某一个情况满足时进行匹配：
      (a) 此列表包含该目标名字空间或 (b) 此列表包含 `*`。
      请注意，`*` 与所指定的任何名字空间匹配，但不会与**未指定** 名字空间的请求匹配
      （请参阅 `clusterScope` 字段）。此列表可以为空，但前提是 `clusterScope` 为 true。

## FlowSchemaStatus {#FlowSchemaStatus}

<!--
FlowSchemaStatus represents the current state of a FlowSchema.
-->
FlowSchemaStatus 表示 FlowSchema 的当前状态。

<hr>

<!--
- **conditions** ([]FlowSchemaCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  `conditions` is a list of the current states of FlowSchema.

  <a name="FlowSchemaCondition"></a>
  *FlowSchemaCondition describes conditions for a FlowSchema.*
-->
- **conditions** ([]FlowSchemaCondition)

  **补丁策略：根据键 type 合并**

  **Map：合并期间保留根据键 type 保留其唯一值**
  
  `conditions` 是 FlowSchema 当前状况的列表。

  <a name="FlowSchemaCondition"></a>
  **FlowSchemaCondition 描述 FlowSchema 的状况。**

  <!--
  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` is the last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` 是状况上一次从一个状态转换为另一个状态的时间。

    <a name="Time"></a>
    **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。
    为 time 包的许多函数方法提供了封装器。**

  <!--
  - **conditions.message** (string)

    `message` is a human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    `reason` is a unique, one-word, CamelCase reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    `message` 是一条人类可读的消息，表示上一次转换有关的详细信息。

  - **conditions.reason** (string)

    `reason` 是状况上次转换原因的、驼峰格式命名的、唯一的一个词。
  
  <!--
  - **conditions.status** (string)

    `status` is the status of the condition. Can be True, False, Unknown. Required.

  - **conditions.type** (string)

    `type` is the type of the condition. Required.
  -->

  - **conditions.status** (string)

    `status` 是状况的状态。可以是 True、False、Unknown。必需。

  - **conditions.type** (string)

    `type` 是状况的类型。必需。

## FlowSchemaList {#FlowSchemaList}

<!--
FlowSchemaList is a list of FlowSchema objects.
-->
FlowSchemaList 是 FlowSchema 对象的列表。

<hr>

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: FlowSchemaList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  `metadata` is the standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>), required

  `items` is a list of FlowSchemas.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  `metadata` 是标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>)，必需

  `items` 是 FlowSchemas 的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified FlowSchema
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 FlowSchema

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified FlowSchema
#### HTTP Request
-->
### `get` 读取指定 FlowSchema 的状态

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind FlowSchema
#### HTTP Request
-->
### `list` 列出或监视 FlowSchema 类别的对象

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 参数

- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaList" >}}">FlowSchemaList</a>): OK

401: Unauthorized

<!--
### `create` create a FlowSchema
#### HTTP Request
-->
### `create` 创建 FlowSchema

#### HTTP 请求

POST /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

<!--
#### Parameters
- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

202 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified FlowSchema
#### HTTP Request
-->
### `update` 替换指定的 FlowSchema

#### HTTP 请求

PUT /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified FlowSchema
#### HTTP Request
-->
### `update` 替换指定的 FlowSchema 的状态

#### HTTP 请求

PUT /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified FlowSchema
#### HTTP Request
-->
### `patch` 部分更新指定的 FlowSchema

#### HTTP 请求

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified FlowSchema
#### HTTP Request
-->
### `patch` 部分更新指定的 FlowSchema 的状态

#### HTTP 请求

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `delete` delete a FlowSchema
#### HTTP Request
-->
### `delete` 删除 FlowSchema

#### HTTP 请求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  FlowSchema 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

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
### `deletecollection` delete collection of FlowSchema
#### HTTP Request
-->
### `deletecollection` 删除 FlowSchema 的集合

#### HTTP 请求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

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
