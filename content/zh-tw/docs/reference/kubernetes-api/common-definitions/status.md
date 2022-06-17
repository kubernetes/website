---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Status"
content_type: "api_reference"
description: "狀態（Status）是不返回其他物件的呼叫的返回值。"
title: "Status"
weight: 12
auto_generated: true
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

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->



`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


<!-- Status is a return value for calls that don't return other objects. -->
狀態（Status）是不返回其他物件的呼叫的返回值。

<hr>

- **apiVersion** (string)

  <!--
  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources 
  -->

  APIVersion 定義物件表示的版本化模式。
  伺服器應將已識別的模式轉換為最新的內部值，並可能拒絕無法識別的值。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **code** (int32)

  <!-- Suggested HTTP return code for this status, 0 if not set. -->
  此狀態的建議 HTTP 返回程式碼，如果未設定，則為 0。

- **details** (StatusDetails)

  <!--
  Extended data associated with the reason.  Each reason may define its own extended details. 
  This field is optional and the data returned is not guaranteed to conform to any schema except that defined by the reason type.
  -->
  與原因（Reason）相關的擴充套件資料。每個原因都可以定義自己的擴充套件細節。
  此欄位是可選的，並且不保證返回的資料符合任何模式，除非由原因型別定義。

  <a name="StatusDetails"></a>
  <!--
  *StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. 
  The Reason field of a Status object defines what attributes will be set. 
  Clients must ignore fields that do not match the defined type of each attribute, 
  and should assume that any attribute may be empty, invalid, or under defined.* 
  -->
  *StatusDetails 是一組附加屬性，可以由伺服器設定以提供有關響應的附加資訊。*
  *狀態物件的原因欄位定義將設定哪些屬性。*
  *客戶端必須忽略與每個屬性的定義型別不匹配的欄位，並且應該假定任何屬性可能為空、無效或未定義。*

  - **details.causes** ([]StatusCause)

    <!--
    The Causes array includes more details associated with the StatusReason failure. 
    Not all StatusReasons may provide detailed causes. 
    -->
    Causes 陣列包含與 StatusReason 故障相關的更多詳細資訊。
    並非所有 StatusReasons 都可以提供詳細的原因。

    <a name="StatusCause"></a>
    <!--
    *StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered.*
    -->
    *StatusCause 提供有關 api.Status 失敗的更多資訊，包括遇到多個錯誤的情況。*

    - **details.causes.field** (string)

      <!--
      The field of the resource that has caused this error, as named by its JSON serialization. 
      May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  
      Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.
      -->
      導致此錯誤的資源欄位，由其 JSON 序列化命名。
      可能包括巢狀屬性的點和字尾表示法。陣列是從零開始索引的。
      由於欄位有多個錯誤，欄位可能會在一系列原因中出現多次。可選。

      <!--
      Examples:
        "name" - the field "name" on the current resource
        "items[0].name" - the field "name" on the first array entry in "items"
      -->
      示例：
        - “name”：當前資源上的欄位 “name”
        - “items[0].name”：“items” 中第一個陣列條目上的欄位 “name”

    - **details.causes.message** (string)

      <!-- A human-readable description of the cause of the error.  This field may be presented as-is to a reader. -->
      對錯誤原因的可讀描述。該欄位可以按原樣呈現給讀者。

    - **details.causes.reason** (string)

      <!-- A machine-readable description of the cause of the error. If this value is empty there is no information available. -->
      錯誤原因的機器可讀描述。如果此值為空，則沒有可用資訊。

  - **details.group** (string)

    <!-- The group attribute of the resource associated with the status StatusReason. -->
    與狀態 StatusReason 關聯的資源的組屬性。

  - **details.kind** (string)

    <!--
    The kind attribute of the resource associated with the status StatusReason. 
    On some operations may differ from the requested resource Kind. 
    More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    -->
    與狀態 StatusReason 關聯的資源的種類屬性。
    在某些操作上可能與請求的資源種類不同。
    更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **details.name** (string)

    <!-- The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described). -->
    與狀態 StatusReason 關聯的資源的名稱屬性（當有一個可以描述的名稱時）。

  - **details.retryAfterSeconds** (int32)

    <!--
    If specified, the time in seconds before the operation should be retried. 
    Some errors may indicate the client must take an alternate action - 
    for those errors this field may indicate how long to wait before taking the alternate action.
    -->
    如果指定，則應重試操作前的時間（以秒為單位）。
    一些錯誤可能表明客戶端必須採取替代操作——對於這些錯誤，此欄位可能指示在採取替代操作之前等待多長時間。

  - **details.uid** (string)

    <!--
    UID of the resource. (when there is a single resource which can be described). 
    More info: http://kubernetes.io/docs/user-guide/identifiers#uids 
    -->
    資源的 UID（當有單個可以描述的資源時）。
    更多資訊： http://kubernetes.io/docs/user-guide/identifiers#uids

- **kind** (string)

  <!--
   Kind is a string value representing the REST resource this object represents. 
   Servers may infer this from the endpoint the client submits requests to. 
   Cannot be updated. In CamelCase.
   More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  Kind 是一個字串值，表示此物件表示的 REST 資源。
  伺服器可以從客戶端提交請求的端點推斷出這一點。
  無法更新。駝峰式規則。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **message** (string)

  <!-- A human-readable description of the status of this operation. -->
  此操作狀態的人類可讀描述。

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!-- Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds -->
  標準列表元資料。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds


- **reason** (string)

  <!--
  A machine-readable description of why this operation is in the "Failure" status. 
  If this value is empty there is no information available. 
  A Reason clarifies an HTTP status code but does not override it.
  -->
  機器可讀的說明，說明此操作為何處於“失敗”狀態。
  如果此值為空，則沒有可用資訊。
  Reason 澄清了 HTTP 狀態程式碼，但不會覆蓋它。

- **status** (string)

  <!--
  Status of the operation. One of: "Success" or "Failure". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  操作狀態。“Success”或“Failure” 之一。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
