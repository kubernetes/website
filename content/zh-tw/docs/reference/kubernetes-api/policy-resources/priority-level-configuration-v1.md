---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "PriorityLevelConfiguration"
content_type: "api_reference"
description: "PriorityLevelConfiguration 表示一個優先級的設定。"
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
PriorityLevelConfiguration 表示一個優先級的設定。

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
  
  `metadata` 是標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationSpec" >}}">PriorityLevelConfigurationSpec</a>)
  
  `spec` 是 “request-priority” 預期行爲的規約。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationStatus" >}}">PriorityLevelConfigurationStatus</a>)

  `status` is the current status of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationStatus" >}}">PriorityLevelConfigurationStatus</a>)
  
  `status` 是 “請求優先級” 的當前狀況。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PriorityLevelConfigurationSpec {#PriorityLevelConfigurationSpec}

<!--
PriorityLevelConfigurationSpec specifies the configuration of a priority level.
-->
PriorityLevelConfigurationSpec 指定一個優先級的設定。

<hr>

- **exempt** (ExemptPriorityLevelConfiguration)

  <!--
  `exempt` specifies how requests are handled for an exempt priority level. This field MUST be empty if `type` is `"Limited"`. This field MAY be non-empty if `type` is `"Exempt"`. If empty and `type` is `"Exempt"` then the default values for `ExemptPriorityLevelConfiguration` apply.
  -->
  
  `exempt` 指定了對於豁免優先級的請求如何處理。
  如果 `type` 取值爲 `"Limited"`，則此字段必須爲空。
  如果 `type` 取值爲 `"Exempt"`，則此字段可以非空。
  如果爲空且 `type` 取值爲 `"Exempt"`，則應用 `ExemptPriorityLevelConfiguration` 的默認值。

  <!--
  <a name="ExemptPriorityLevelConfiguration"></a>
  *ExemptPriorityLevelConfiguration describes the configurable aspects of the handling of exempt requests. In the mandatory exempt configuration object the values in the fields here can be modified by authorized users, unlike the rest of the `spec`.*
  -->

  <a name="ExemptPriorityLevelConfiguration"></a>
  **ExemptPriorityLevelConfiguration 描述豁免請求處理的可設定方面。
  在強制豁免設定對象中，與 `spec` 中的其餘部分不同，此處字段的取值可以被授權使用者修改。**

  - **exempt.lendablePercent** (int32)

    <!--
    `lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels.  This value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.
    -->

    `lendablePercent` 規定該級別的 NominalCL 可被其他優先級租借的百分比。
    此字段的值必須在 0 到 100 之間，包括 0 和 100，默認爲 0。
    其他級別可以從該級別借用的席位數被稱爲此級別的 LendableConcurrencyLimit（LendableCL），定義如下。
    
    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )

  - **exempt.nominalConcurrencyShares** (int32)

    <!--
    `nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats nominally reserved for this priority level. This DOES NOT limit the dispatching from this priority level but affects the other priority levels through the borrowing mechanism. The server's concurrency limit (ServerCL) is divided among all the priority levels in proportion to their NCS values:
    -->

    `nominalConcurrencyShares`（NCS）也被用來計算該級別的 NominalConcurrencyLimit（NominalCL）。
    字段值是爲該優先級保留的執行席位的數量。這一設置不限制此優先級別的調度行爲，
    但會通過借用機制影響其他優先級。伺服器的併發限制（ServerCL）會按照各個優先級的 NCS 值按比例分配：
    
    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)
    
    <!--
    Bigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level. This field has a default value of zero.
    -->

    較大的數字意味着更大的標稱併發限制，且將影響其他優先級。此字段的默認值爲零。
  
<!--
- **limited** (LimitedPriorityLevelConfiguration)

  `limited` specifies how requests are handled for a Limited priority level. This field must be non-empty if and only if `type` is `"Limited"`.

  <a name="LimitedPriorityLevelConfiguration"></a>
  *LimitedPriorityLevelConfiguration specifies how to handle requests that are subject to limits. It addresses two issues:
    - How are requests for this priority level limited?
    - What should be done with requests that exceed the limit?*
-->
- **limited** (LimitedPriorityLevelConfiguration)
  
  `limited` 指定如何爲某個受限的優先級處理請求。
  當且僅當 `type` 是 `"Limited"` 時，此字段必須爲非空。
  
  <a name="LimitedPriorityLevelConfiguration"></a>
  LimitedPriorityLevelConfiguration 指定如何處理需要被限制的請求。它解決兩個問題：

  - 如何限制此優先級的請求？
  - 應如何處理超出此限制的請求？
  
  <!--
  - **limited.borrowingLimitPercent** (int32)

    `borrowingLimitPercent`, if present, configures a limit on how many seats this priority level can borrow from other priority levels. The limit is known as this level's BorrowingConcurrencyLimit (BorrowingCL) and is a limit on the total number of seats that this level may borrow at any one time. This field holds the ratio of that limit to the level's nominal concurrency limit. When this field is non-nil, it must hold a non-negative integer and the limit is calculated as follows.
    
    BorrowingCL(i) = round( NominalCL(i) * borrowingLimitPercent(i)/100.0 )
    
    The value of this field can be more than 100, implying that this priority level can borrow a number of seats that is greater than its own nominal concurrency limit (NominalCL). When this field is left `nil`, the limit is effectively infinite.
  -->
  
  - **limited.borrowingLimitPercent** (int32)
   
    `borrowingLimitPercent` 設定如果存在，則可用來限制此優先級可以從其他優先級中租借多少資源。
    該限制被稱爲該級別的 BorrowingConcurrencyLimit（BorrowingCL），它限制了該級別可以同時租借的資源總數。
    該字段保存了該限制與該級別標稱併發限制之比。當此字段非空時，必須爲正整數，並按以下方式計算限制值：

    BorrowingCL(i) = round(NominalCL(i) * borrowingLimitPercent(i) / 100.0)

    該字段值可以大於100，表示該優先級可以大於自己標稱併發限制（NominalCL）。當此字段爲 `nil` 時，表示無限制。
  
  <!--
  - **limited.lendablePercent** (int32)

    `lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels. The value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.
    
    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )
  -->
  
  - **limited.lendablePercent** (int32)

    `lendablePercent` 規定了 NominalCL 可被其他優先級租借資源數百分比。
    此字段的值必須在 0 到 100 之間，包括 0 和 100，默認爲 0。
    其他級別可以從該級別借用的資源數被稱爲此級別的 LendableConcurrencyLimit（LendableCL），定義如下。

    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )
  
  <!--
  - **limited.limitResponse** (LimitResponse)

    `limitResponse` indicates what to do with requests that can not be executed right now

    <a name="LimitResponse"></a>
    *LimitResponse defines how to handle requests that can not be executed right now.*
  -->

  - **limited.limitResponse** (LimitResponse)
    
    `limitResponse` 指示如何處理當前無法立即執行的請求。
    
    <a name="LimitResponse"></a>
    **LimitResponse 定義如何處理當前無法立即執行的請求。**
    
    <!--
    - **limited.limitResponse.type** (string), required

      `type` is "Queue" or "Reject". "Queue" means that requests that can not be executed upon arrival are held in a queue until they can be executed or a queuing limit is reached. "Reject" means that requests that can not be executed upon arrival are rejected. Required.
    -->

    - **limited.limitResponse.type** (string)，必需
      
      `type` 是 “Queue” 或 “Reject”。此字段必須設置。
      “Queue” 意味着在到達時無法被執行的請求可以被放到隊列中，直到它們被執行或者隊列長度超出限制爲止。
      “Reject” 意味着到達時無法執行的請求將被拒絕。
    
    <!--
    - **limited.limitResponse.queuing** (QueuingConfiguration)

      `queuing` holds the configuration parameters for queuing. This field may be non-empty only if `type` is `"Queue"`.

      <a name="QueuingConfiguration"></a>
      *QueuingConfiguration holds the configuration parameters for queuing*
    -->

    - **limited.limitResponse.queuing** (QueuingConfiguration)
      
      `queuing` 包含排隊所用的設定參數。只有 `type` 是 `"Queue"` 時，此字段纔可以爲非空。
      
      <a name="QueuingConfiguration"></a>
      **QueuingConfiguration 保存排隊所用的設定參數。**
      
      <!--
      - **limited.limitResponse.queuing.handSize** (int32)

        `handSize` is a small positive number that configures the shuffle sharding of requests into queues.  When enqueuing a request at this priority level the request's flow identifier (a string pair) is hashed and the hash value is used to shuffle the list of queues and deal a hand of the size specified here.  The request is put into one of the shortest queues in that hand. `handSize` must be no larger than `queues`, and should be significantly smaller (so that a few heavy flows do not saturate most of the queues).  See the user-facing documentation for more extensive guidance on setting this field.  This field has a default value of 8.
      -->

      - **limited.limitResponse.queuing.handSize** (int32)
        
        `handSize` 是一個小的正數，用於設定如何將請求隨機分片到隊列中。
        當以該優先級將請求排隊時，將對請求的流標識符（字符串對）進行哈希計算，
        該哈希值用於打亂隊列隊列的列表，並處理此處指定的一批請求。
        請求被放入這一批次中最短的隊列中。
        `handSize` 不得大於 `queues`，並且應該明顯更小（以便幾個大的流量不會使大多數隊列飽和）。
        有關設置此字段的更多詳細指導，請參閱面向使用者的文檔。此字段的默認值爲 8。
      
      <!--
      - **limited.limitResponse.queuing.queueLengthLimit** (int32)

        `queueLengthLimit` is the maximum number of requests allowed to be waiting in a given queue of this priority level at a time; excess requests are rejected.  This value must be positive.  If not specified, it will be defaulted to 50.

      - **limited.limitResponse.queuing.queues** (int32)

        `queues` is the number of queues for this priority level. The queues exist independently at each apiserver. The value must be positive.  Setting it to 1 effectively precludes shufflesharding and thus makes the distinguisher method of associated flow schemas irrelevant.  This field has a default value of 64.
      -->

      - **limited.limitResponse.queuing.queueLengthLimit** (int32)
        
        `queueLengthLimit` 是任意時刻允許在此優先級的給定隊列中等待的請求數上限；
        額外的請求將被拒絕。
        此值必須是正數。如果未指定，則默認爲 50。
      
      - **limited.limitResponse.queuing.queues** (int32)
        
        `queues` 是這個優先級的隊列數。此隊列在每個 API 伺服器上獨立存在。此值必須是正數。
        將其設置爲 1 相當於禁止了混洗分片操作，進而使得對相關流模式的區分方法不再有意義。
        此字段的默認值爲 64。

  <!--
  - **limited.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats available at this priority level. This is used both for requests dispatched from this priority level as well as requests dispatched from other priority levels borrowing seats from this level. The server's concurrency limit (ServerCL) is divided among the Limited priority levels in proportion to their NCS values:
    
    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)
    
    Bigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level.
  -->

  - **limited.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares`（NCS）用於計算該優先級的標稱併發限制（NominalCL）。
    NCS 表示可以在此優先級同時運行的席位數量上限，包括來自本優先級的請求，
    以及從此優先級租借席位的其他級別的請求。
    伺服器的併發度限制（ServerCL）根據 NCS 值按比例分別給各 Limited 優先級：

    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)

    較大的數字意味着更大的標稱併發限制，但是這將犧牲其他優先級的資源。

<!--
- **type** (string), required

  `type` indicates whether this priority level is subject to limitation on request execution.  A value of `"Exempt"` means that requests of this priority level are not subject to a limit (and thus are never queued) and do not detract from the capacity made available to other priority levels.  A value of `"Limited"` means that (a) requests of this priority level _are_ subject to limits and (b) some of the server's limited capacity is made available exclusively to this priority level. Required.
-->
- **type** (string)，必需
  
  `type` 指示此優先級是否遵從有關請求執行的限制。
  取值爲 `"Exempt"` 意味着此優先級的請求不遵從某個限制（且因此從不排隊）且不會減損其他優先級可用的容量。
  取值爲 `"Limited"` 意味着 (a) 此優先級的請求遵從這些限制且
  (b) 伺服器某些受限的容量僅可用於此優先級。必需。

## PriorityLevelConfigurationStatus {#PriorityLevelConfigurationStatus}

<!--
PriorityLevelConfigurationStatus represents the current state of a "request-priority".
-->
PriorityLevelConfigurationStatus 表示 “請求優先級” 的當前狀況。

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
  
  **補丁策略：基於鍵 `type` 合併**

  **Map：合併期間保留根據鍵 type 保留其唯一值**
  
  `conditions` 是 “請求優先級” 的當前狀況。
  
  <a name="PriorityLevelConfigurationCondition"></a>
  **PriorityLevelConfigurationCondition 定義優先級的狀況。**
  
  <!--
  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` is the last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)
    
    `lastTransitionTime` 是狀況上次從一個狀態轉換爲另一個狀態的時間。
    
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
    
    `message` 是人類可讀的消息，指示有關上次轉換的詳細信息。
  
  - **conditions.reason** (string)
    
    `reason` 是狀況上次轉換原因的、駝峯格式命名的、唯一的一個詞。
  
  <!--
  - **conditions.status** (string)

    `status` is the status of the condition. Can be True, False, Unknown. Required.

  - **conditions.type** (string)

    `type` is the type of the condition. Required.
  -->

  - **conditions.status** (string)
    
    `status` 表示狀況的狀態，取值爲 True、False 或 Unknown 之一。必需。
  
  - **conditions.type** (string)
    
    `type` 表示狀況的類型，必需。

## PriorityLevelConfigurationList {#PriorityLevelConfigurationList}

<!--
PriorityLevelConfigurationList is a list of PriorityLevelConfiguration objects.
-->
PriorityLevelConfigurationList 是 PriorityLevelConfiguration 對象的列表。

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
  
  `metadata` 是標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>)，必需
  
  `items` 是請求優先級設置的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified PriorityLevelConfiguration
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 PriorityLevelConfiguration

#### HTTP 請求

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **pretty** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `get` 讀取指定的 PriorityLevelConfiguration 的狀態

#### HTTP 請求

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **pretty** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PriorityLevelConfiguration
#### HTTP Request
-->
### `list` 列出或監視 PriorityLevelConfiguration 類別的對象

#### HTTP 請求

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
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

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

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationList" >}}">PriorityLevelConfigurationList</a>): OK

401: Unauthorized

<!--
### `create` create a PriorityLevelConfiguration
#### HTTP Request
-->
### `create` 創建 PriorityLevelConfiguration

#### HTTP 請求

POST /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

<!--
#### Parameters
- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

202 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `update` 替換指定的 PriorityLevelConfiguration

#### HTTP 請求

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
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `update` 替換指定的 PriorityLevelConfiguration 的狀態

#### HTTP 請求

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
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `patch` 部分更新指定的 PriorityLevelConfiguration

#### HTTP 請求

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
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PriorityLevelConfiguration
#### HTTP Request
-->
### `patch` 部分更新指定的 PriorityLevelConfiguration 的狀態

#### HTTP 請求

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
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

<!--
### `delete` delete a PriorityLevelConfiguration
#### HTTP Request
-->
### `delete` 刪除 PriorityLevelConfiguration

#### HTTP 請求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PriorityLevelConfiguration
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  PriorityLevelConfiguration 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PriorityLevelConfiguration
#### HTTP Request
-->
### `deletecollection` 刪除 PriorityLevelConfiguration 的集合

#### HTTP 請求

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

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

- **continue**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
