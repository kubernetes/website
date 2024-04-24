---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Status"
content_type: "api_reference"
description: "状态（Status）是不返回其他对象的调用的返回值。"
title: "Status"
weight: 12
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Status"
content_type: "api_reference"
description: "Status is a return value for calls that don't return other objects."
title: "Status"
weight: 12
auto_generated: true
-->

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!--
Status is a return value for calls that don't return other objects.
-->
状态（Status）是不返回其他对象的调用的返回值。

<hr>

- **apiVersion** (string)

  <!--
  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources 
  -->

  apiVersion 定义对象表示的版本化模式。
  服务器应将已识别的模式转换为最新的内部值，并可能拒绝无法识别的值。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **code** (int32)

  <!--
  Suggested HTTP return code for this status, 0 if not set.
  -->

  此状态的建议 HTTP 返回代码，如果未设置，则为 0。

- **details** (StatusDetails)

  <!--
  Extended data associated with the reason.  Each reason may define its own extended details. 
  This field is optional and the data returned is not guaranteed to conform to any schema except that defined by the reason type.

  <a name="StatusDetails"></a>
  *StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined.*
  -->

  与原因（Reason）相关的扩展数据。每个原因都可以定义自己的扩展细节。
  此字段是可选的，并且不保证返回的数据符合任何模式，除非由原因类型定义。

  <a name="StatusDetails"></a>
  **StatusDetails 是一组附加属性，可以由服务器设置以提供有关响应的附加信息。
  状态对象的原因字段定义将设置哪些属性。
  客户端必须忽略与每个属性的定义类型不匹配的字段，并且应该假定任何属性可能为空、无效或未定义。**

  - **details.causes** ([]StatusCause)

    <!--
    The Causes array includes more details associated with the StatusReason failure. 
    Not all StatusReasons may provide detailed causes. 

    <a name="StatusCause"></a>
    *StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered.*
    -->

    causes 数组包含与 StatusReason 故障相关的更多详细信息。
    并非所有 StatusReasons 都可以提供详细的原因。

    <a name="StatusCause"></a>
    **StatusCause 提供有关 api.Status 失败的更多信息，包括遇到多个错误的情况。**

    - **details.causes.field** (string)

      <!--
      The field of the resource that has caused this error, as named by its JSON serialization. May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.
      
      Examples:
        "name" - the field "name" on the current resource
        "items[0].name" - the field "name" on the first array entry in "items"
      -->

      导致此错误的资源字段，由其 JSON 序列化命名。
      可能包括嵌套属性的点和后缀表示法。数组是从零开始索引的。
      由于字段有多个错误，字段可能会在一系列原因中出现多次。可选。

      示例：
        - “name”：当前资源上的字段 “name”
        - “items[0].name”：“items” 中第一个数组条目上的字段 “name”

    - **details.causes.message** (string)

      <!--
      A human-readable description of the cause of the error.  This field may be presented as-is to a reader.
      -->

      对错误原因的可读描述。该字段可以按原样呈现给读者。

    - **details.causes.reason** (string)

      <!--
      A machine-readable description of the cause of the error. If this value is empty there is no information available.
      -->

      错误原因的机器可读描述。如果此值为空，则没有可用信息。

  - **details.group** (string)

    <!--
    The group attribute of the resource associated with the status StatusReason.
    -->
  
    与状态 StatusReason 关联的资源的组属性。

  - **details.kind** (string)

    <!--
    The kind attribute of the resource associated with the status StatusReason. 
    On some operations may differ from the requested resource Kind. 
    More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    -->

    与状态 StatusReason 关联的资源的类别属性。
    在某些操作上可能与请求的资源类别不同。
    更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **details.name** (string)

    <!--
    The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described).
    -->

    与状态 StatusReason 关联的资源的名称属性（当有一个可以描述的名称时）。

  - **details.retryAfterSeconds** (int32)

    <!--
    If specified, the time in seconds before the operation should be retried. 
    Some errors may indicate the client must take an alternate action - 
    for those errors this field may indicate how long to wait before taking the alternate action.
    -->

    如果指定，则应重试操作前的时间（以秒为单位）。
    一些错误可能表明客户端必须采取替代操作——对于这些错误，此字段可能指示在采取替代操作之前等待多长时间。

  - **details.uid** (string)

    <!--
    UID of the resource. (when there is a single resource which can be described). 
    More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
    -->
  
    资源的 UID（当有单个可以描述的资源时）。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids

- **kind** (string)

  <!--
  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  kind 是一个字符串值，表示此对象表示的 REST 资源。
  服务器可以从客户端提交请求的端点推断出这一点。
  无法更新。驼峰式规则。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **message** (string)

  <!--
  A human-readable description of the status of this operation.
  -->

  此操作状态的人类可读描述。

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **reason** (string)

  <!--
  A machine-readable description of why this operation is in the "Failure" status. 
  If this value is empty there is no information available. 
  A Reason clarifies an HTTP status code but does not override it.
  -->

  机器可读的说明，说明此操作为何处于“失败”状态。
  如果此值为空，则没有可用信息。
  reason 澄清了 HTTP 状态代码，但不会覆盖它。

- **status** (string)

  <!--
  Status of the operation. One of: "Success" or "Failure". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

  操作状态。“Success”或“Failure” 之一。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
