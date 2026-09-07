---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusDetails"
content_type: "api_reference"
description: "StatusDetails 是一组由服务器设置的附加属性，用于提供关于响应的额外信息。Status 对象的 Reason 字段定义了将设置哪些属性。客户端必须忽略那些与各属性定义类型不符的字段，并应假定任何属性都可能为空、无效或未定义。"
title: "StatusDetails"
weight: 530
---
<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusDetails"
content_type: "api_reference"
description: "StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined."
title: "StatusDetails"
weight: 530
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## StatusDetails {#StatusDetails}

<!--
StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined.
-->
StatusDetails 是一组由服务器设置的附加属性，用于提供关于响应的额外信息。
Status 对象的 Reason 字段定义了将设置哪些属性。
客户端必须忽略那些与各属性定义类型不符的字段，并应假定任何属性都可能为空、无效或未定义。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>causes</code><br/><em><a href="{{< ref "status-cause-v1-meta#StatusCause" >}}">StatusCause array</a></em></td>
      <td>
      <!--
      The Causes array includes more details associated with the StatusReason failure. Not all StatusReasons may provide detailed causes. 
      -->
      causes 数组包含与 StatusReason 故障相关的更多详细信息。
      并非所有 StatusReason 都会提供详细的故障原因。
      </td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>
      <!--
      The group attribute of the resource associated with the status StatusReason.
      -->
      与 StatusReason 状态关联的资源的组属性。      
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      The kind attribute of the resource associated with the status StatusReason. On some operations may differ from the requested resource Kind. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      与 StatusReason 状态相关联的资源的 kind（类型）属性。在某些操作中，
      该值可能与请求的资源 kind 不同。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>
      <!--
      The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described).
      -->
      与 StatusReason 状态关联的资源的名称属性。当资源只有一个名称时。
      </td>
    </tr>
    <tr>
      <td><code>retryAfterSeconds</code><br/><em>integer</em></td>
      <td>
      <!--
      Some errors may indicate the client must take an alternate action - for those errors this field may indicate how long to wait before taking the alternate action.
      -->
      如果指定，操作在指定的秒数后应重试。
      一些错误可能指示客户端必须采取替代操作，对于这些错误，此字段可能指示在采取替代操作之前等待的秒数。
      </td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>
      <!--
      UID of the resource. (when there is a single resource which can be described). More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
      -->
      与 StatusReason 状态关联的资源的唯一标识符（UID）。当资源只有一个时。
      </td>
    </tr>
  </tbody>
</table>
