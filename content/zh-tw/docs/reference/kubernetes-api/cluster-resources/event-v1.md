---
api_metadata:
  apiVersion: "events.k8s.io/v1"
  import: "k8s.io/api/events/v1"
  kind: "Event"
content_type: "api_reference"
description: "Event 是叢集中某個事件的報告。"
title: "Event"
weight: 3
---

<!--
api_metadata:
  apiVersion: "events.k8s.io/v1"
  import: "k8s.io/api/events/v1"
  kind: "Event"
content_type: "api_reference"
description: "Event is a report of an event somewhere in the cluster."
title: "Event"
weight: 3
auto_generated: true
-->

`apiVersion: events.k8s.io/v1`

`import "k8s.io/api/events/v1"`

## Event {#Event}
<!--
Event is a report of an event somewhere in the cluster. It generally denotes some state change in the system.
Events have a limited retention time and triggers and messages may evolve with time. 
Event consumers should not rely on the timing of an event with a given Reason reflecting a consistent underlying trigger, or the continued existence of events with that Reason. 
Events should be treated as informative, best-effort, supplemental data.
-->
Event 是叢集中某個事件的報告。它一般表示系統的某些狀態變化。
Event 的保留時間有限，觸發器和消息可能會隨着時間的推移而演變。
事件消費者不應假定給定原因的事件的時間所反映的是一致的下層觸發因素，或具有該原因的事件的持續存在。
Events 應被視爲通知性質的、盡最大努力而提供的補充資料。

<hr>

- **apiVersion**: events.k8s.io/v1

- **kind**: Event

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元資料。更多資訊: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **eventTime** (MicroTime), required

  eventTime is the time when this Event was first observed. It is required.
-->

- **eventTime** (MicroTime)，必需

  evenTime 是該事件首次被觀察到的時間。它是必需的。

  <a name="MicroTime"></a>

  <!--
  *MicroTime is version of Time with microsecond level precision.*
  -->
  
  **MicroTime 是微秒級精度的 Time 版本**

- **action** (string)

  <!--
  action is what action was taken/failed regarding to the regarding object. It is machine-readable. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  action 是針對相關對象所採取的或已失敗的動作。字段值是機器可讀的。對於新的 Event，此字段不能爲空，
  且最多爲 128 個字符。

- **deprecatedCount** (int32)

  <!--
  deprecatedCount is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedCount 是確保與 core.v1 Event 類型向後兼容的已棄用字段。

- **deprecatedFirstTimestamp** (Time)

  <!--
  deprecatedFirstTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedFirstTimestamp 是確保與 core.v1 Event 類型向後兼容的已棄用字段。

  <a name="Time"></a>
  
  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。**

- **deprecatedLastTimestamp** (Time)

  <!--
  deprecatedLastTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedLastTimestamp 是確保與 core.v1 Event 類型向後兼容的已棄用字段。

  <a name="Time"></a>

  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  --> 
  **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。**

- **deprecatedSource** (EventSource)

  <!--
  deprecatedSource is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->  
  deprecatedSource 是確保與 core.v1 Event 類型向後兼容的已棄用字段。

  <a name="EventSource"></a>
  
  <!--
  *EventSource contains information for an event.*
  -->

  **EventSource 包含事件資訊。**

  - **deprecatedSource.component** (string)

    <!--
    Component from which the event is generated.
    -->

    生成事件的組件。

  - **deprecatedSource.host** (string)

    <!--
    Node name on which the event is generated.
    -->

    產生事件的節點名稱。

- **note** (string)

  <!--
  note is a human-readable description of the status of this operation. Maximal length of the note is 1kB, but libraries should be prepared to handle values up to 64kB.
  -->
  note 是對該操作狀態的可讀描述。註釋的最大長度是 1kB，但是庫應該準備好處理最多 64kB 的值。

- **reason** (string)

  <!--
  reason is why the action was taken. It is human-readable. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  reason 是採取行動的原因。它是人類可讀的。對於新的 Event，此字段不能爲空，且最多爲128個字符。

- **regarding** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  <!--
  regarding contains the object this Event is about. In most cases it's an Object reporting controller implements, e.g. ReplicaSetController implements ReplicaSets and this event is emitted because it acts on some changes in a ReplicaSet object.
  -->
  關於包含此 Event 所涉及的對象。在大多數情況下，所指的是報告事件的控制器所實現的一個 Object。
  例如 ReplicaSetController 實現了 ReplicaSet，這個事件被觸發是因爲控制器對 ReplicaSet 對象做了一些變化。

- **related** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  <!--
  related is the optional secondary object for more complex actions. E.g. when regarding object triggers a creation or deletion of related object.
  -->
  related 是用於更復雜操作的、可選的、從屬性的對象。例如，當 regarding 對象觸發 related 對象的創建或刪除時。

- **reportingController** (string)

  <!--
  reportingController is the name of the controller that emitted this Event, e.g. `kubernetes.io/kubelet`. This field cannot be empty for new Events.
  -->
  reportingController 是觸發該事件的控制器的名稱,例如 `kubernetes.io/kubelet`。對於新的　Event，此字段不能爲空。

- **reportingInstance** (string)

  <!--
  reportingInstance is the ID of the controller instance, e.g. `kubelet-xyzf`. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  reportingInstance 爲控制器實例的 ID,例如 `kubelet-xyzf`。對於新的 Event，此字段不能爲空，且最多爲 128 個字符。 

- **series** (EventSeries)

  <!--
  series is data about the Event series this event represents or nil if it's a singleton Event.
  -->
  series 是該事件代表的事件系列的資料，如果是單事件，則爲 nil。

  <a name="EventSeries"></a>

  <!--
  *EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time. How often to update the EventSeries is up to the event reporters. The default event reporter in "k8s.io/client-go/tools/events/event_broadcaster.go" shows how this struct is updated on heartbeats and can guide customized reporter implementations.*
  -->
  EventSeries 包含一系列事件的資訊，即一段時間內持續發生的事情。
  EventSeries 的更新頻率由事件報告者決定。
  預設事件報告程式在 "k8s.io/client-go/tools/events/event_broadcaster.go" 
  展示在發生心跳時該結構如何被更新，可以指導定製的報告者實現。

  <!--
  - **series.count** (int32), required
  -->

  - **series.count** (int32)，必需

    <!--
    count is the number of occurrences in this series up to the last heartbeat time.
    -->
    
    count 是到最後一次心跳時間爲止在該系列中出現的次數。

  <!--
  - **series.lastObservedTime** (MicroTime), required

    lastObservedTime is the time when last Event from the series was seen before last heartbeat.
  -->

  - **series.lastObservedTime** (MicroTime)，必需

    lastObservedTime 是在最後一次心跳時間之前看到最後一個 Event 的時間。

    <a name="MicroTime"></a>

    <!--
    *MicroTime is version of Time with microsecond level precision.*
    -->

    **MicroTime 是微秒級精度的 Time 版本。**

- **type** (string)

  <!--
  type is the type of this event (Normal, Warning), new types could be added in the future. It is machine-readable. This field cannot be empty for new Events.
  -->
  type 是該事件的類型（Normal、Warning），未來可能會添加新的類型。字段值是機器可讀的。
  對於新的 Event，此字段不能爲空。

## EventList {#EventList}

<!--
EventList is a list of Event objects.
-->
EventList 是一個 Event 對象列表。

<hr>

- **apiVersion**: events.k8s.io/v1

- **kind**: EventList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
   標準的列表元資料。更多資訊: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>), required

  items is a list of schema objects.
-->
- **items** ([]<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>)，必需

  items 是模式（Schema）對象的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#操作}

<hr>

<!--
### `get` read the specified Event

#### HTTP Request
-->
### `get` 讀取特定 Event

#### HTTP 請求

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路徑參數**)：string，必需

  Event 名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**路徑參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Event

#### HTTP Request
-->
### `list` 列出或觀察事件類型對象

#### HTTP 請求

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查詢參數**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Event

#### HTTP Request
-->
### `list` 列出或觀察事件類型對象

#### HTTP 請求

GET /apis/events.k8s.io/v1/events

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查詢參數**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

<!--
### `create` create an Event

#### HTTP Request
-->
### `create` 創建一個 Event

#### HTTP 請求

POST /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**查詢參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, required
-->
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

202 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Event

#### HTTP Request
-->
### `update` 替換指定 Event

#### HTTP 請求

PUT /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}
<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路徑參數**)：string，必需

  Event 名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, required
-->
- **body**：<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>，必需
  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：必需

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Event

#### HTTP Request
-->
### `patch` 部分更新指定的 Event

#### HTTP 請求

PATCH /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路徑參數**)：string，必需

  Event 名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

<!--
### `delete` delete an Event

#### HTTP Request
-->
### `delete` 刪除 Event

#### HTTP 請求

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路徑參數**)：string，必需

  Event 名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Event

#### HTTP Request
-->
### `deletecollection` 刪除 Event 集合

#### HTTP 請求

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (*in path*)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (*查詢參數*)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查詢參數**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

