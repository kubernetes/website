---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "PriorityLevelConfiguration"
content_type: "api_reference"
description: "PriorityLevelConfiguration 表示一个优先级的配置。"
title: "PriorityLevelConfiguration v1"
weight: 6
---
<!--
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "PriorityLevelConfiguration"
content_type: "api_reference"
description: "PriorityLevelConfiguration represents the configuration of a priority level."
title: "PriorityLevelConfiguration"
weight: 6
auto_generated: true
-->

`apiVersion: flowcontrol.apiserver.k8s.io/v1`

`import "k8s.io/api/flowcontrol/v1"`

## PriorityLevelConfiguration {#PriorityLevelConfiguration}

<!--
PriorityLevelConfiguration represents the configuration of a priority level.
-->
PriorityLevelConfiguration 表示一个优先级的配置。

<hr>

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: PriorityLevelConfiguration

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  `metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationSpec" >}}">PriorityLevelConfigurationSpec</a>)

  `spec` is the specification of the desired behavior of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  `metadata` 是标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationSpec" >}}">PriorityLevelConfigurationSpec</a>)
  
  `spec` 是 “request-priority” 预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationStatus" >}}">PriorityLevelConfigurationStatus</a>)

  `status` is the current status of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationStatus" >}}">PriorityLevelConfigurationStatus</a>)
  
  `status` 是 “请求优先级” 的当前状况。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PriorityLevelConfigurationSpec {#PriorityLevelConfigurationSpec}

<!--
PriorityLevelConfigurationSpec specifies the configuration of a priority level.
-->
PriorityLevelConfigurationSpec 指定一个优先级的配置。

<hr>

- **exempt** (ExemptPriorityLevelConfiguration)

  <!--
  `exempt` specifies how requests are handled for an exempt priority level. This field MUST be empty if `type` is `"Limited"`. This field MAY be non-empty if `type` is `"Exempt"`. If empty and `type` is `"Exempt"` then the default values for `ExemptPriorityLevelConfiguration` apply.
  -->
  
  `exempt` 指定了对于豁免优先级的请求如何处理。
  如果 `type` 取值为 `"Limited"`，则此字段必须为空。
  如果 `type` 取值为 `"Exempt"`，则此字段可以非空。
  如果为空且 `type` 取值为 `"Exempt"`，则应用 `ExemptPriorityLevelConfiguration` 的默认值。

  <!--
  <a name="ExemptPriorityLevelConfiguration"></a>
  *ExemptPriorityLevelConfiguration describes the configurable aspects of the handling of exempt requests. In the mandatory exempt configuration object the values in the fields here can be modified by authorized users, unlike the rest of the `spec`.*
  -->

  <a name="ExemptPriorityLevelConfiguration"></a>
  **ExemptPriorityLevelConfiguration 描述豁免请求处理的可配置方面。
  在强制豁免配置对象中，与 `spec` 中的其余部分不同，此处字段的取值可以被授权用户修改。**

  - **exempt.lendablePercent** (int32)

    <!--
    `lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels.  This value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.
    -->

    `lendablePercent` 规定该级别的 NominalCL 可被其他优先级租借的百分比。
    此字段的值必须在 0 到 100 之间，包括 0 和 100，默认为 0。
    其他级别可以从该级别借用的席位数被称为此级别的 LendableConcurrencyLimit（LendableCL），定义如下。
    
    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )

  - **exempt.nominalConcurrencyShares** (int32)

    <!--
    `nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats nominally reserved for this priority level. This DOES NOT limit the dispatching from this priority level but affects the other priority levels through the borrowing mechanism. The server's concurrency limit (ServerCL) is divided among all the priority levels in proportion to their NCS values:
    -->

    `nominalConcurrencyShares`（NCS）也被用来计算该级别的 NominalConcurrencyLimit（NominalCL）。
    字段值是为该优先级保留的执行席位的数量。这一设置不限制此优先级别的调度行为，
    但会通过借用机制影响其他优先级。服务器的并发限制（ServerCL）会按照各个优先级的 NCS 值按比例分配：
    
    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)
    
    <!--
    Bigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level. This field has a default value of zero.
    -->

    较大的数字意味着更大的标称并发限制，且将影响其他优先级。此字段的默认值为零。
  
<!--
- **limited** (LimitedPriorityLevelConfiguration)

  `limited` specifies how requests are handled for a Limited priority level. This field must be non-empty if and only if `type` is `"Limited"`.

  <a name="LimitedPriorityLevelConfiguration"></a>
  *LimitedPriorityLevelConfiguration specifies how to handle requests that are subject to limits. It addresses two issues:
    - How are requests for this priority level limited?
    - What should be done with requests that exceed the limit?*
-->
- **limited** (LimitedPriorityLevelConfiguration)
  
  `limited` 指定如何为某个受限的优先级处理请求。
  当且仅当 `type` 是 `"Limited"` 时，此字段必须为非空。
  
  <a name="LimitedPriorityLevelConfiguration"></a>
  LimitedPriorityLevelConfiguration 指定如何处理需要被限制的请求。它解决两个问题：

  - 如何限制此优先级的请求？
  - 应如何处理超出此限制的请求？
  
  <!--
  - **limited.borrowingLimitPercent** (int32)

    `borrowingLimitPercent`, if present, configures a limit on how many seats this priority level can borrow from other priority levels. The limit is known as this level's BorrowingConcurrencyLimit (BorrowingCL) and is a limit on the total number of seats that this level may borrow at any one time. This field holds the ratio of that limit to the level's nominal concurrency limit. When this field is non-nil, it must hold a non-negative integer and the limit is calculated as follows.
    
    BorrowingCL(i) = round( NominalCL(i) * borrowingLimitPercent(i)/100.0 )
    
    The value of this field can be more than 100, implying that this priority level can borrow a number of seats that is greater than its own nominal concurrency limit (NominalCL). When this field is left `nil`, the limit is effectively infinite.
  -->
  
  - **limited.borrowingLimitPercent** (int32)
   
    `borrowingLimitPercent` 配置如果存在，则可用来限制此优先级可以从其他优先级中租借多少资源。
    该限制被称为该级别的 BorrowingConcurrencyLimit（BorrowingCL），它限制了该级别可以同时租借的资源总数。
    该字段保存了该限制与该级别标称并发限制之比。当此字段非空时，必须为正整数，并按以下方式计算限制值：

    BorrowingCL(i) = round(NominalCL(i) * borrowingLimitPercent(i) / 100.0)

    该字段值可以大于100，表示该优先级可以大于自己标称并发限制（NominalCL）。当此字段为 `nil` 时，表示无限制。
  
  <!--
  - **limited.lendablePercent** (int32)

    `lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels. The value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.
    
    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )
  -->
  
  - **limited.lendablePercent** (int32)

    `lendablePercent` 规定了 NominalCL 可被其他优先级租借资源数百分比。
    此字段的值必须在 0 到 100 之间，包括 0 和 100，默认为 0。
    其他级别可以从该级别借用的资源数被称为此级别的 LendableConcurrencyLimit（LendableCL），定义如下。

    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )
  
  <!--
  - **limited.limitResponse** (LimitResponse)

    `limitResponse` indicates what to do with requests that can not be executed right now

    <a name="LimitResponse"></a>
    *LimitResponse defines how to handle requests that can not be executed right now.*
  -->

  - **limited.limitResponse** (LimitResponse)
    
    `limitResponse` 指示如何处理当前无法立即执行的请求。
    
    <a name="LimitResponse"></a>
    **LimitResponse 定义如何处理当前无法立即执行的请求。**
    
    <!--
    - **limited.limitResponse.type** (string), required

      `type` is "Queue" or "Reject". "Queue" means that requests that can not be executed upon arrival are held in a queue until they can be executed or a queuing limit is reached. "Reject" means that requests that can not be executed upon arrival are rejected. Required.
    -->

    - **limited.limitResponse.type** (string)，必需
      
      `type` 是 “Queue” 或 “Reject”。此字段必须设置。
      “Queue” 意味着在到达时无法被执行的请求可以被放到队列中，直到它们被执行或者队列长度超出限制为止。
      “Reject” 意味着到达时无法执行的请求将被拒绝。
    
    <!--
    - **limited.limitResponse.queuing** (QueuingConfiguration)

      `queuing` holds the configuration parameters for queuing. This field may be non-empty only if `type` is `"Queue"`.

      <a name="QueuingConfiguration"></a>
      *QueuingConfiguration holds the configuration parameters for queuing*
    -->

    - **limited.limitResponse.queuing** (QueuingConfiguration)
      
      `queuing` 包含排队所用的配置参数。只有 `type` 是 `"Queue"` 时，此字段才可以为非空。
      
      <a name="QueuingConfiguration"></a>
      **QueuingConfiguration 保存排队所用的配置参数。**
      
      <!--
      - **limited.limitResponse.queuing.handSize** (int32)

        `handSize` is a small positive number that configures the shuffle sharding of requests into queues.  When enqueuing a request at this priority level the request's flow identifier (a string pair) is hashed and the hash value is used to shuffle the list of queues and deal a hand of the size specified here.  The request is put into one of the shortest queues in that hand. `handSize` must be no larger than `queues`, and should be significantly smaller (so that a few heavy flows do not saturate most of the queues).  See the user-facing documentation for more extensive guidance on setting this field.  This field has a default value of 8.
      -->

      - **limited.limitResponse.queuing.handSize** (int32)
        
        `handSize` 是一个小的正数，用于配置如何将请求随机分片到队列中。
        当以该优先级将请求排队时，将对请求的流标识符（字符串对）进行哈希计算，
        该哈希值用于打乱队列队列的列表，并处理此处指定的一批请求。
        请求被放入这一批次中最短的队列中。
        `handSize` 不得大于 `queues`，并且应该明显更小（以便几个大的流量不会使大多数队列饱和）。
        有关设置此字段的更多详细指导，请参阅面向用户的文档。此字段的默认值为 8。
      
      <!--
      - **limited.limitResponse.queuing.queueLengthLimit** (int32)

        `queueLengthLimit` is the maximum number of requests allowed to be waiting in a given queue of this priority level at a time; excess requests are rejected.  This value must be positive.  If not specified, it will be defaulted to 50.

      - **limited.limitResponse.queuing.queues** (int32)

        `queues` is the number of queues for this priority level. The queues exist independently at each apiserver. The value must be positive.  Setting it to 1 effectively precludes shufflesharding and thus makes the distinguisher method of associated flow schemas irrelevant.  This field has a default value of 64.
      -->

      - **limited.limitResponse.queuing.queueLengthLimit** (int32)
        
        `queueLengthLimit` 是任意时刻允许在此优先级的给定队列中等待的请求数上限；
        额外的请求将被拒绝。
        此值必须是正数。如果未指定，则默认为 50。
      
      - **limited.limitResponse.queuing.queues** (int32)
        
        `queues` 是这个优先级的队列数。此队列在每个 API 服务器上独立存在。此值必须是正数。
        将其设置为 1 相当于禁止了混洗分片操作，进而使得对相关流模式的区分方法不再有意义。
        此字段的默认值为 64。

  <!--
  - **limited.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats available at this priority level. This is used both for requests dispatched from this priority level as well as requests dispatched from other priority levels borrowing seats from this level. The server's concurrency limit (ServerCL) is divided among the Limited priority levels in proportion to their NCS values:
    
    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)
    
    Bigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level.
  -->

  - **limited.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares`（NCS）用于计算该优先级的标称并发限制（NominalCL）。
    NCS 表示可以在此优先级同时运行的席位数量上限，包括来自本优先级的请求，
    以及从此优先级租借席位的其他级别的请求。
    服务器的并发度限制（ServerCL）根据 NCS 值按比例分别给各 Limited 优先级：

    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)

    较大的数字意味着更大的标称并发限制，但是这将牺牲其他优先级的资源。

<!--
- **type** (string), required

  `type` indicates whether this priority level is subject to limitation on request execution.  A value of `"Exempt"` means that requests of this priority level are not subject to a limit (and thus are never queued) and do not detract from the capacity made available to other priority levels.  A value of `"Limited"` means that (a) requests of this priority level _are_ subject to limits and (b) some of the server's limited capacity is made available exclusively to this priority level. Required.
-->
- **type** (string)，必需
  
  `type` 指示此优先级是否遵从有关请求执行的限制。
  取值为 `"Exempt"` 意味着此优先级的请求不遵从某个限制（且因此从不排队）且不会减损其他优先级可用的容量。
  取值为 `"Limited"` 意味着 (a) 此优先级的请求遵从这些限制且
  (b) 服务器某些受限的容量仅可用于此优先级。必需。

## PriorityLevelConfigurationStatus {#PriorityLevelConfigurationStatus}

<!--
PriorityLevelConfigurationStatus represents the current state of a "request-priority".
-->
PriorityLevelConfigurationStatus 表示 “请求优先级” 的当前状况。

<hr>

<!--
- **conditions** ([]PriorityLevelConfigurationCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  `conditions` is the current state of "request-priority".

  <a name="PriorityLevelConfigurationCondition"></a>
  *PriorityLevelConfigurationCondition defines the condition of priority level.*
-->
- **conditions** ([]PriorityLevelConfigurationCondition)
  
  **补丁策略：基于键 `type` 合并**

  **Map：合并期间保留根据键 type 保留其唯一值**
  
  `conditions` 是 “请求优先级” 的当前状况。
  
  <a name="PriorityLevelConfigurationCondition"></a>
  **PriorityLevelConfigurationCondition 定义优先级的状况。**
  
  <!--
  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` is the last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)
    
    `lastTransitionTime` 是状况上次从一个状态转换为另一个状态的时间。
    
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
    
    `message` 是人类可读的消息，指示有关上次转换的详细信息。
  
  - **conditions.reason** (string)
    
    `reason` 是状况上次转换原因的、驼峰格式命名的、唯一的一个词。
  
  <!--
  - **conditions.status** (string)

    `status` is the status of the condition. Can be True, False, Unknown. Required.

  - **conditions.type** (string)

    `type` is the type of the condition. Required.
  -->

  - **conditions.status** (string)
    
    `status` 表示状况的状态，取值为 True、False 或 Unknown 之一。必需。
  
  - **conditions.type** (string)
    
    `type` 表示状况的类型，必需。

## PriorityLevelConfigurationList {#PriorityLevelConfigurationList}

<!--
PriorityLevelConfigurationList is a list of PriorityLevelConfiguration objects.
-->
PriorityLevelConfigurationList 是 PriorityLevelConfiguration 对象的列表。

<hr>

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: PriorityLevelConfigurationList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  `metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>), required

  `items` is a list of request-priorities.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  `metadata` 是标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>)，必需
  
  `items` 是请求优先级设置的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified PriorityLevelConfiguration
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 PriorityLevelConfiguration

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `get` 读取指定的 PriorityLevelConfiguration 的状态

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PriorityLevelConfiguration
#### HTTP Request
-->
### `list` 列出或监视 PriorityLevelConfiguration 类别的对象

#### HTTP 请求

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

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

- **allowWatchBookmarks**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

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

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationList" >}}">PriorityLevelConfigurationList</a>): OK

401: Unauthorized

<!--
### `create` create a PriorityLevelConfiguration
#### HTTP Request
-->
### `create` 创建 PriorityLevelConfiguration

#### HTTP 请求

POST /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

<!--
#### Parameters
- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

202 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `update` 替换指定的 PriorityLevelConfiguration

#### HTTP 请求

PUT /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `update` 替换指定的 PriorityLevelConfiguration 的状态

#### HTTP 请求

PUT /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `patch` 部分更新指定的 PriorityLevelConfiguration

#### HTTP 请求

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `patch` 部分更新指定的 PriorityLevelConfiguration 的状态

#### HTTP 请求

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `delete` delete a PriorityLevelConfiguration
#### HTTP Request
-->
### `delete` 删除 PriorityLevelConfiguration

#### HTTP 请求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  PriorityLevelConfiguration 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PriorityLevelConfiguration
#### HTTP Request
-->
### `deletecollection` 删除 PriorityLevelConfiguration 的集合

#### HTTP 请求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

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

- **continue**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
