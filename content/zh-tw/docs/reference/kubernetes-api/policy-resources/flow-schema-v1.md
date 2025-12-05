---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "FlowSchema"
content_type: "api_reference"
description: "FlowSchema 定義一組流的模式。"
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
FlowSchema 定義一組流的模式。請注意，一個流由屬性類似的一組入站 API 請求組成，
用一對字符串進行標識：FlowSchema 的名稱和一個 “流區分項”。

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

  `metadata` 是標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaSpec" >}}">FlowSchemaSpec</a>)

  `spec` 是 FlowSchema 預期行爲的規約。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaStatus" >}}">FlowSchemaStatus</a>)

  `status` is the current status of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaStatus" >}}">FlowSchemaStatus</a>)

  `status` 是 FlowSchema 的當前狀態。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## FlowSchemaSpec {#FlowSchemaSpec}

<!--
FlowSchemaSpec describes how the FlowSchema's specification looks like.
-->
FlowSchemaSpec 描述 FlowSchema 的規約看起來是怎樣的。

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

  `distinguisherMethod` 定義如何爲匹配此模式的請求來計算流區分項。
  `nil` 表示該區分項被禁用，且因此將始終爲空字符串。

  <a name="FlowDistinguisherMethod"></a>
  **FlowDistinguisherMethod 指定流區分項的方法。**

  - **distinguisherMethod.type** (string)，必需

    `type` 是流區分項的類型。支持的類型爲 “ByUser” 和 “ByNamespace”。必需。

<!--
- **matchingPrecedence** (int32)

  `matchingPrecedence` is used to choose among the FlowSchemas that match a given request. The chosen FlowSchema is among those with the numerically lowest (which we take to be logically highest) MatchingPrecedence.  Each MatchingPrecedence value must be ranged in [1,10000]. Note that if the precedence is not specified, it will be set to 1000 as default.
-->
- **matchingPrecedence** (int32)

  `matchingPrecedence` 用於選擇與給定請求匹配的一個 FlowSchema。
  選中的 FlowSchema 是某個 MatchingPrecedence 數值最小（我們視其爲邏輯上最大）的 FlowSchema。
  每個 MatchingPrecedence 值必須在 [1,10000] 的範圍內。
  請注意，如果未指定優先順序，則其預設設爲 1000。

<!--
- **priorityLevelConfiguration** (PriorityLevelConfigurationReference), required

  `priorityLevelConfiguration` should reference a PriorityLevelConfiguration in the cluster. If the reference cannot be resolved, the FlowSchema will be ignored and marked as invalid in its status. Required.

  <a name="PriorityLevelConfigurationReference"></a>
  *PriorityLevelConfigurationReference contains information that points to the "request-priority" being used.*

  - **priorityLevelConfiguration.name** (string), required

    `name` is the name of the priority level configuration being referenced Required.
-->
- **priorityLevelConfiguration** (PriorityLevelConfigurationReference)，必需

  `priorityLevelConfiguration` 應引用叢集中的 PriorityLevelConfiguration。
  如果引用無法被解析，則忽略此 FlowSchema，並在其狀態中將其標記爲無效。必需。

  <a name="PriorityLevelConfigurationReference"></a>
  **PriorityLevelConfigurationReference 包含指向正被使用的 “request-priority” 的資訊。**

  - **priorityLevelConfiguration.name** (string)，必需

    `name` 是正被引用的優先級設定的名稱。必需。

<!--
- **rules** ([]PolicyRulesWithSubjects)

  *Atomic: will be replaced during a merge*
  
  `rules` describes which requests will match this flow schema. This FlowSchema matches a request if and only if at least one member of rules matches the request. if it is an empty slice, there will be no requests matching the FlowSchema.

  <a name="PolicyRulesWithSubjects"></a>
  *PolicyRulesWithSubjects prescribes a test that applies to a request to an apiserver. The test considers the subject making the request, the verb being requested, and the resource to be acted upon. This PolicyRulesWithSubjects matches a request if and only if both (a) at least one member of subjects matches the request and (b) at least one member of resourceRules or nonResourceRules matches the request.*
-->
- **rules** ([]PolicyRulesWithSubjects)

  **原子性：將在合併期間被替換**
  
  `rules` 描述哪些請求將與這個流模式匹配。只有當至少一條規則與請求匹配時，
  才視爲此 FlowSchema 與該請求匹配。如果字段值爲空表，則 FlowSchema 不會與任何請求匹配。

  <a name="PolicyRulesWithSubjects"></a>
  **PolicyRulesWithSubjects 給出針對 API 伺服器請求的一個測試。
  該測試將檢查發出請求的主體、所請求的動作和要操作的資源。
  只有同時滿足以下兩個條件時，才表示此 PolicyRulesWithSubjects 與請求匹配：
  (a) 至少一個主體成員與請求匹配且
  (b) 至少 resourceRules 或 nonResourceRules 的一個成員與請求匹配。**

  <!--
  - **rules.subjects** ([]Subject), required

    *Atomic: will be replaced during a merge*
    
    subjects is the list of normal user, serviceaccount, or group that this rule cares about. There must be at least one member in this slice. A slice that includes both the system:authenticated and system:unauthenticated user groups matches every request. Required.

    <a name="Subject"></a>
    *Subject matches the originator of a request, as identified by the request authentication system. There are three ways of matching an originator; by user, group, or service account.*
  -->

  - **rules.subjects** ([]Subject)，必需

    **原子性：將在合併期間被替換**
    
    subjects 是此規則相關的普通使用者、服務賬號或組的列表。在這個列表中必須至少有一個成員。
    同時包含 system:authenticated 和 system:unauthenticated 使用者組的列表會與每個請求匹配。
    此字段爲必需。

    <a name="Subject"></a>
    **Subject 用來與匹配請求的發起方，請求的發起方由請求身份認證系統識別出來。
    有三種方式來匹配一個發起方：按使用者、按組或按服務賬號。**

    <!--
    - **rules.subjects.kind** (string), required

      `kind` indicates which one of the other fields is non-empty. Required

    - **rules.subjects.group** (GroupSubject)

      `group` matches based on user group name.

      <a name="GroupSubject"></a>
      *GroupSubject holds detailed information for group-kind subject.*
    -->

    - **rules.subjects.kind** (string)，必需

      `kind` 標示其他字段中的哪個字段必須非空。必需。

    - **rules.subjects.group** (GroupSubject)

      `group` 根據使用者組名稱進行匹配。

      <a name="GroupSubject"></a>
      **GroupSubject 保存組類別主體的詳細資訊。**

      <!--
      - **rules.subjects.group.name** (string), required

        name is the user group that matches, or "*" to match all user groups. See https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go for some well-known group names. Required.
      -->

      - **rules.subjects.group.name** (string)，必需

        name 是要匹配的使用者組，或使用 `*` 匹配所有使用者組。有關一些廣爲人知的組名，請參閱
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

      `serviceAccount` 與 ServiceAccount 對象進行匹配。

      <a name="ServiceAccountSubject"></a>
      **ServiceAccountSubject 保存服務賬號類別主體的詳細資訊。**

      - **rules.subjects.serviceAccount.name** (string)，必需

        `name` 是要匹配的 ServiceAccount 對象的名稱，可使用 `*` 匹配所有名稱。必需。

      - **rules.subjects.serviceAccount.namespace** (string)，必需

        `namespace` 是要匹配的 ServiceAccount 對象的名字空間。必需。
    
    <!--
    - **rules.subjects.user** (UserSubject)

      `user` matches based on username.

      <a name="UserSubject"></a>
      *UserSubject holds detailed information for user-kind subject.*

      - **rules.subjects.user.name** (string), required

        `name` is the username that matches, or "*" to match all usernames. Required.
    -->

    - **rules.subjects.user** (UserSubject)

      `user` 根據使用者名進行匹配。

      <a name="UserSubject"></a>
      **UserSubject 保存使用者類別主體的詳細資訊。**

      - **rules.subjects.user.name** (string)，必需

        `name` 是要匹配的使用者名，可使用 `*` 匹配所有使用者名。必需。
  
  <!--
  - **rules.nonResourceRules** ([]NonResourcePolicyRule)

    *Atomic: will be replaced during a merge*
    
    `nonResourceRules` is a list of NonResourcePolicyRules that identify matching requests according to their verb and the target non-resource URL.

    <a name="NonResourcePolicyRule"></a>
    *NonResourcePolicyRule is a predicate that matches non-resource requests according to their verb and the target non-resource URL. A NonResourcePolicyRule matches a request if and only if both (a) at least one member of verbs matches the request and (b) at least one member of nonResourceURLs matches the request.*
  -->

  - **rules.nonResourceRules** ([]NonResourcePolicyRule)

    **原子性：將在合併期間被替換**
    
    `nonResourceRules` 是由 NonResourcePolicyRule 對象構成的列表，
    根據請求的動作和目標非資源 URL 來識別匹配的請求。

    <a name="NonResourcePolicyRule"></a>
    **NonResourcePolicyRule 是根據請求的動作和目標非資源 URL 來匹配非資源請求的一種規則。
    只有滿足以下兩個條件時，NonResourcePolicyRule 纔會匹配一個請求：
    (a) 至少 verbs 的一個成員與請求匹配且 (b) 至少 nonResourceURLs 的一個成員與請求匹配。**
    
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

      **集合：合併期間保留唯一值**
      
      `nonResourceURLs` 是使用者有權訪問的一組 URL 前綴，不可以爲空。
      此字段爲必需設置的字段。例如：
        - "/healthz" 是合法的
        - "/hea*" 是不合法的
        - "/hea" 是合法的但不會與任何項匹配
        - "/hea/*" 也不會與任何項匹配
        - "/healthz/*" 與所有組件自身的的健康檢查路徑匹配。
      `*` 與所有非資源 URL 匹配。如果存在此字符，則必須是唯一的輸入項。
      必需。
    
    <!--
    - **rules.nonResourceRules.verbs** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `verbs` is a list of matching verbs and may not be empty. "*" matches all verbs. If it is present, it must be the only entry. Required.
    -->

    - **rules.nonResourceRules.verbs** ([]string)，必需

      **集合：在合併期間保留唯一值**
      
      `verbs` 是與動作匹配的列表，不可以爲空。`*` 與所有動作匹配。
      如果存在此字符，則必須是唯一的輸入項。必需。
  
  <!--
  - **rules.resourceRules** ([]ResourcePolicyRule)

    *Atomic: will be replaced during a merge*
    
    `resourceRules` is a slice of ResourcePolicyRules that identify matching requests according to their verb and the target resource. At least one of `resourceRules` and `nonResourceRules` has to be non-empty.

    <a name="ResourcePolicyRule"></a>
    *ResourcePolicyRule is a predicate that matches some resource requests, testing the request's verb and the target resource. A ResourcePolicyRule matches a resource request if and only if: (a) at least one member of verbs matches the request, (b) at least one member of apiGroups matches the request, (c) at least one member of resources matches the request, and (d) either (d1) the request does not specify a namespace (i.e., `Namespace==""`) and clusterScope is true or (d2) the request specifies a namespace and least one member of namespaces matches the request's namespace.*
  -->

  - **rules.resourceRules** ([]ResourcePolicyRule)

    **原子性：將在合併期間被替換**
    
    `resourceRules` 是 ResourcePolicyRule 對象的列表，根據請求的動作和目標資源識別匹配的請求。
    `resourceRules` 和 `nonResourceRules` 兩者必須至少有一個非空。

    <a name="ResourcePolicyRule"></a>
    **ResourcePolicyRule 是用來匹配資源請求的規則，對請求的動作和目標資源進行測試。
    只有滿足以下條件時，ResourcePolicyRule 纔會與某個資源請求匹配：
    (a) 至少 verbs 的一個成員與請求的動作匹配，
    (b) 至少 apiGroups 的一個成員與請求的 API 組匹配，
    (c) 至少 resources 的一個成員與請求的資源匹配，
    (d) 要麼 (d1) 請求未指定一個名字空間（即，`namespace==""`）且 clusterScope 爲 true，
    要麼 (d2) 請求指定了一個名字空間，且至少 namespaces 的一個成員與請求的名字空間匹配。**

    <!--
    - **rules.resourceRules.apiGroups** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `apiGroups` is a list of matching API groups and may not be empty. "*" matches all API groups and, if present, must be the only entry. Required.

    - **rules.resourceRules.resources** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `resources` is a list of matching resources (i.e., lowercase and plural) with, if desired, subresource.  For example, [ "services", "nodes/status" ].  This list may not be empty. "*" matches all resources and, if present, must be the only entry. Required.
    -->

    - **rules.resourceRules.apiGroups** ([]string)，必需

      **集合：合併期間保留唯一值**
      
      `apiGroups` 是與 API 組匹配的列表，不可以爲空。`*` 表示與所有 API 組匹配。
      如果存在此字符，則其必須是唯一的條目。必需。

    - **rules.resourceRules.resources** ([]string)，必需

      **集合：合併期間保留唯一值**
      
      `resources` 是匹配的資源（即小寫和複數）的列表，如果需要的話，還可以包括子資源。
      例如 [ "services", "nodes/status" ]。此列表不可以爲空。
      `*` 表示與所有資源匹配。如果存在此字符，則必須是唯一的條目。必需。

    <!--
    - **rules.resourceRules.verbs** ([]string), required

      *Set: unique values will be kept during a merge*
      
      `verbs` is a list of matching verbs and may not be empty. "*" matches all verbs and, if present, must be the only entry. Required.

    - **rules.resourceRules.clusterScope** (boolean)

      `clusterScope` indicates whether to match requests that do not specify a namespace (which happens either because the resource is not namespaced or the request targets all namespaces). If this field is omitted or false then the `namespaces` field must contain a non-empty list.
    -->

    - **rules.resourceRules.verbs** ([]string)，必需

      **集合：合併期間保留唯一值**
      
      `verbs` 是匹配的動作的列表，不可以爲空。`*` 表示與所有動作匹配。
      如果存在此字符，則必須是唯一的條目。必需。

    - **rules.resourceRules.clusterScope** (boolean)

      `clusterScope` 表示是否與未指定名字空間
      （出現這種情況的原因是該資源沒有名字空間或請求目標面向所有名字空間）的請求匹配。
      如果此字段被省略或爲 false，則 `namespaces` 字段必須包含一個非空的列表。

    <!--
    - **rules.resourceRules.namespaces** ([]string)

      *Set: unique values will be kept during a merge*
      
      `namespaces` is a list of target namespaces that restricts matches.  A request that specifies a target namespace matches only if either (a) this list contains that target namespace or (b) this list contains "*".  Note that "*" matches any specified namespace but does not match a request that _does not specify_ a namespace (see the `clusterScope` field for that). This list may be empty, but only if `clusterScope` is true.
    -->

    - **rules.resourceRules.namespaces** ([]string)

      **集合：合併期間保留唯一值**
      
      `namespaces` 是限制匹配的目標的名字空間的列表。
      指定一個目標名字空間的請求只會在以下某一個情況滿足時進行匹配：
      (a) 此列表包含該目標名字空間或 (b) 此列表包含 `*`。
      請注意，`*` 與所指定的任何名字空間匹配，但不會與**未指定** 名字空間的請求匹配
      （請參閱 `clusterScope` 字段）。此列表可以爲空，但前提是 `clusterScope` 爲 true。

## FlowSchemaStatus {#FlowSchemaStatus}

<!--
FlowSchemaStatus represents the current state of a FlowSchema.
-->
FlowSchemaStatus 表示 FlowSchema 的當前狀態。

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

  **補丁策略：根據鍵 type 合併**

  **Map：合併期間保留根據鍵 type 保留其唯一值**
  
  `conditions` 是 FlowSchema 當前狀況的列表。

  <a name="FlowSchemaCondition"></a>
  **FlowSchemaCondition 描述 FlowSchema 的狀況。**

  <!--
  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` is the last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` 是狀況上一次從一個狀態轉換爲另一個狀態的時間。

    <a name="Time"></a>
    **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。
    爲 time 包的許多函數方法提供了封裝器。**

  <!--
  - **conditions.message** (string)

    `message` is a human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    `reason` is a unique, one-word, CamelCase reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    `message` 是一條人類可讀的消息，表示上一次轉換有關的詳細資訊。

  - **conditions.reason** (string)

    `reason` 是狀況上次轉換原因的、駝峯格式命名的、唯一的一個詞。
  
  <!--
  - **conditions.status** (string)

    `status` is the status of the condition. Can be True, False, Unknown. Required.

  - **conditions.type** (string)

    `type` is the type of the condition. Required.
  -->

  - **conditions.status** (string)

    `status` 是狀況的狀態。可以是 True、False、Unknown。必需。

  - **conditions.type** (string)

    `type` 是狀況的類型。必需。

## FlowSchemaList {#FlowSchemaList}

<!--
FlowSchemaList is a list of FlowSchema objects.
-->
FlowSchemaList 是 FlowSchema 對象的列表。

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

  `metadata` 是標準的列表元資料。更多資訊：
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

### `get` 讀取指定的 FlowSchema

#### HTTP 請求

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified FlowSchema
#### HTTP Request
-->
### `get` 讀取指定 FlowSchema 的狀態

#### HTTP 請求

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind FlowSchema
#### HTTP Request
-->
### `list` 列出或監視 FlowSchema 類別的對象

#### HTTP 請求

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
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaList" >}}">FlowSchemaList</a>): OK

401: Unauthorized

<!--
### `create` create a FlowSchema
#### HTTP Request
-->
### `create` 創建 FlowSchema

#### HTTP 請求

POST /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

<!--
#### Parameters
- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

202 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified FlowSchema
#### HTTP Request
-->
### `update` 替換指定的 FlowSchema

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified FlowSchema
#### HTTP Request
-->
### `update` 替換指定的 FlowSchema 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified FlowSchema
#### HTTP Request
-->
### `patch` 部分更新指定的 FlowSchema

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified FlowSchema
#### HTTP Request
-->
### `patch` 部分更新指定的 FlowSchema 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

<!--
### `delete` delete a FlowSchema
#### HTTP Request
-->
### `delete` 刪除 FlowSchema

#### HTTP 請求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the FlowSchema
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  FlowSchema 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
### `deletecollection` delete collection of FlowSchema
#### HTTP Request
-->
### `deletecollection` 刪除 FlowSchema 的集合

#### HTTP 請求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

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
