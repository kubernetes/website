---
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "Scale"
content_type: "api_reference"
description: "Scale 表示针对资源的扩缩容请求。"
title: "Scale"
weight: 440
---

<!--
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "Scale"
content_type: "api_reference"
description: "Scale represents a scaling request for a resource."
title: "Scale"
weight: 440
auto_generated: true
-->

`apiVersion: autoscaling/v1`

`import "k8s.io/api/autoscaling/v1"`


## Scale {#Scale}

<!--
Scale represents a scaling request for a resource.
-->
Scale 表示针对资源的扩缩容请求。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了该对象表示形式的版本化模式（schema）。服务器应将已识别的模式转换为最新的内部值，
      并可拒绝无法识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，用于标识该对象所代表的 REST 资源。服务器可以根据客户端提交请求的端点推断出该值。
      该字段不可更新。采用驼峰命名法（CamelCase）。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>
      <!--
      Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.
      -->
      标准对象元数据；更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。
      </td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#ScaleSpec" >}}">ScaleSpec</a></em></td>
      <td>
      <!--
      spec defines the behavior of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.
      -->
      spec 定义了伸缩（scale）的行为。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status。
      </td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#ScaleStatus" >}}">ScaleStatus</a></em></td>
      <td>
      <!--
      status is the current status of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. Read-only.
      -->
      status 表示伸缩（scale）的当前状态。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status。
      </td>
    </tr>
  </tbody>
</table>


## ScaleSpec {#ScaleSpec}

<!--
ScaleSpec describes the attributes of a scale subresource.
-->
ScaleSpec 描述了伸缩（scale）子资源的属性。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>replicas</code><br/><em>integer</em></td>
      <td>
      <!--
      replicas is the desired number of instances for the scaled object.
      -->
      replicas 表示伸缩（scale）的目标实例数。
      </td>
    </tr>
  </tbody>
</table>


## ScaleStatus {#ScaleStatus}

<!--
ScaleStatus represents the current status of a scale subresource.
-->
ScaleStatus 表示伸缩（scale）子资源的当前状态。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>replicas</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>
      <!--
      replicas is the actual number of observed instances of the scaled object.
      -->
      replicas 表示伸缩（scale）的当前实例数。
      </td>
    </tr>
    <tr>
      <td><code>selector</code><br/><em>string</em></td>
      <td>
      <!--
      selector is the label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
      -->
      selector 是针对 Pod 的标签查询，用于匹配副本数量。它与标签选择器（label selector）相同，
      但采用字符串格式，以避免客户端进行内省（introspection）。该字符串的格式与查询参数（query-param）语法一致。
      关于标签选择器的更多信息，请参阅：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/
      </td>
    </tr>
  </tbody>
</table>
