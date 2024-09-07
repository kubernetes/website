---
api_metadata:
  apiVersion: "events.k8s.io/v1"
  import: "k8s.io/api/events/v1"
  kind: "Event"
content_type: "api_reference"
description: "Event 是集群中某个事件的报告。"
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
Event 是集群中某个事件的报告。它一般表示系统的某些状态变化。
Event 的保留时间有限，触发器和消息可能会随着时间的推移而演变。
事件消费者不应假定给定原因的事件的时间所反映的是一致的下层触发因素，或具有该原因的事件的持续存在。
Events 应被视为通知性质的、尽最大努力而提供的补充数据。

<hr>

- **apiVersion**: events.k8s.io/v1

- **kind**: Event

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **eventTime** (MicroTime), required

  eventTime is the time when this Event was first observed. It is required.
-->

- **eventTime** (MicroTime)，必需

  evenTime 是该事件首次被观察到的时间。它是必需的。

  <a name="MicroTime"></a>

  <!--
  *MicroTime is version of Time with microsecond level precision.*
  -->
  
  **MicroTime 是微秒级精度的 Time 版本**

- **action** (string)

  <!--
  action is what action was taken/failed regarding to the regarding object. It is machine-readable. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  action 是针对相关对象所采取的或已失败的动作。字段值是机器可读的。对于新的 Event，此字段不能为空，
  且最多为 128 个字符。

- **deprecatedCount** (int32)

  <!--
  deprecatedCount is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedCount 是确保与 core.v1 Event 类型向后兼容的已弃用字段。

- **deprecatedFirstTimestamp** (Time)

  <!--
  deprecatedFirstTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedFirstTimestamp 是确保与 core.v1 Event 类型向后兼容的已弃用字段。

  <a name="Time"></a>
  
  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

- **deprecatedLastTimestamp** (Time)

  <!--
  deprecatedLastTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->
  deprecatedLastTimestamp 是确保与 core.v1 Event 类型向后兼容的已弃用字段。

  <a name="Time"></a>

  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  --> 
  **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

- **deprecatedSource** (EventSource)

  <!--
  deprecatedSource is the deprecated field assuring backward compatibility with core.v1 Event type.
  -->  
  deprecatedSource 是确保与 core.v1 Event 类型向后兼容的已弃用字段。

  <a name="EventSource"></a>
  
  <!--
  *EventSource contains information for an event.*
  -->

  **EventSource 包含事件信息。**

  - **deprecatedSource.component** (string)

    <!--
    Component from which the event is generated.
    -->

    生成事件的组件。

  - **deprecatedSource.host** (string)

    <!--
    Node name on which the event is generated.
    -->

    产生事件的节点名称。

- **note** (string)

  <!--
  note is a human-readable description of the status of this operation. Maximal length of the note is 1kB, but libraries should be prepared to handle values up to 64kB.
  -->
  note 是对该操作状态的可读描述。注释的最大长度是 1kB，但是库应该准备好处理最多 64kB 的值。

- **reason** (string)

  <!--
  reason is why the action was taken. It is human-readable. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  reason 是采取行动的原因。它是人类可读的。对于新的 Event，此字段不能为空，且最多为128个字符。

- **regarding** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  <!--
  regarding contains the object this Event is about. In most cases it's an Object reporting controller implements, e.g. ReplicaSetController implements ReplicaSets and this event is emitted because it acts on some changes in a ReplicaSet object.
  -->
  关于包含此 Event 所涉及的对象。在大多数情况下，所指的是报告事件的控制器所实现的一个 Object。
  例如 ReplicaSetController 实现了 ReplicaSet，这个事件被触发是因为控制器对 ReplicaSet 对象做了一些变化。

- **related** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  <!--
  related is the optional secondary object for more complex actions. E.g. when regarding object triggers a creation or deletion of related object.
  -->
  related 是用于更复杂操作的、可选的、从属性的对象。例如，当 regarding 对象触发 related 对象的创建或删除时。

- **reportingController** (string)

  <!--
  reportingController is the name of the controller that emitted this Event, e.g. `kubernetes.io/kubelet`. This field cannot be empty for new Events.
  -->
  reportingController 是触发该事件的控制器的名称,例如 `kubernetes.io/kubelet`。对于新的　Event，此字段不能为空。

- **reportingInstance** (string)

  <!--
  reportingInstance is the ID of the controller instance, e.g. `kubelet-xyzf`. This field cannot be empty for new Events and it can have at most 128 characters.
  -->
  reportingInstance 为控制器实例的 ID,例如 `kubelet-xyzf`。对于新的 Event，此字段不能为空，且最多为 128 个字符。 

- **series** (EventSeries)

  <!--
  series is data about the Event series this event represents or nil if it's a singleton Event.
  -->
  series 是该事件代表的事件系列的数据，如果是单事件，则为 nil。

  <a name="EventSeries"></a>

  <!--
  *EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time. How often to update the EventSeries is up to the event reporters. The default event reporter in "k8s.io/client-go/tools/events/event_broadcaster.go" shows how this struct is updated on heartbeats and can guide customized reporter implementations.*
  -->
  EventSeries 包含一系列事件的信息，即一段时间内持续发生的事情。
  EventSeries 的更新频率由事件报告者决定。
  默认事件报告程序在 "k8s.io/client-go/tools/events/event_broadcaster.go" 
  展示在发生心跳时该结构如何被更新，可以指导定制的报告者实现。

  <!--
  - **series.count** (int32), required
  -->

  - **series.count** (int32)，必需

    <!--
    count is the number of occurrences in this series up to the last heartbeat time.
    -->
    
    count 是到最后一次心跳时间为止在该系列中出现的次数。

  <!--
  - **series.lastObservedTime** (MicroTime), required

    lastObservedTime is the time when last Event from the series was seen before last heartbeat.
  -->

  - **series.lastObservedTime** (MicroTime)，必需

    lastObservedTime 是在最后一次心跳时间之前看到最后一个 Event 的时间。

    <a name="MicroTime"></a>

    <!--
    *MicroTime is version of Time with microsecond level precision.*
    -->

    **MicroTime 是微秒级精度的 Time 版本。**

- **type** (string)

  <!--
  type is the type of this event (Normal, Warning), new types could be added in the future. It is machine-readable. This field cannot be empty for new Events.
  -->
  type 是该事件的类型（Normal、Warning），未来可能会添加新的类型。字段值是机器可读的。
  对于新的 Event，此字段不能为空。

## EventList {#EventList}

<!--
EventList is a list of Event objects.
-->
EventList 是一个 Event 对象列表。

<hr>

- **apiVersion**: events.k8s.io/v1

- **kind**: EventList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
   标准的列表元数据。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>), required

  items is a list of schema objects.
-->
- **items** ([]<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>)，必需

  items 是模式（Schema）对象的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#操作}

<hr>

<!--
### `get` read the specified Event

#### HTTP Request
-->
### `get` 读取特定 Event

#### HTTP 请求

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路径参数**)：string，必需

  Event 名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**路径参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Event

#### HTTP Request
-->
### `list` 列出或观察事件类型对象

#### HTTP 请求

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查询参数**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Event

#### HTTP Request
-->
### `list` 列出或观察事件类型对象

#### HTTP 请求

GET /apis/events.k8s.io/v1/events

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查询参数**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

<!--
### `create` create an Event

#### HTTP Request
-->
### `create` 创建一个 Event

#### HTTP 请求

POST /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**查询参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, required
-->
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

202 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Event

#### HTTP Request
-->
### `update` 替换指定 Event

#### HTTP 请求

PUT /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}
<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路径参数**)：string，必需

  Event 名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, required
-->
- **body**：<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>，必需
  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：必需

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Event

#### HTTP Request
-->
### `patch` 部分更新指定的 Event

#### HTTP 请求

PATCH /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路径参数**)：string，必需

  Event 名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

<!--
### `delete` delete an Event

#### HTTP Request
-->
### `delete` 删除 Event

#### HTTP 请求

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Event
-->
- **name** (**路径参数**)：string，必需

  Event 名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Event

#### HTTP Request
-->
### `deletecollection` 删除 Event 集合

#### HTTP 请求

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (*in path*)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (*查询参数*)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **sendInitialEvents** (**查询参数**)： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

