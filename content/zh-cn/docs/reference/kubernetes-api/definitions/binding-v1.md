---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding 将一个对象与另一个对象关联起来；例如，调度器将 Pod 绑定到节点。"
title: "Binding"
weight: 60
---

<!--
---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding ties one object to another; for example, a pod is bound to a node by a scheduler."
title: "Binding"
weight: 60
auto_generated: true
---
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## Binding {#Binding}

<!--
Binding ties one object to another; for example, a pod is bound to a node by a scheduler.
-->
Binding 将一个对象与另一个对象关联起来；例如，调度器将 Pod
绑定到节点。


<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object.
      Servers should convert recognized schemas to the latest internal value, 
      and may reject unrecognized values. 
      More info: 
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了该对象表示形式的版本化模式（schema）。
      服务器应将已识别的模式转换为最新的内部值，并可拒绝无法识别的值。
      更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. 
      Servers may infer this from the endpoint the client submits requests to. 
      Cannot be updated. In CamelCase. 
      More info: 
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，用于标识该对象所代表的 REST 资源。
      服务器可以根据客户端提交请求的端点推断出该值。
      该字段不可更新。
      采用驼峰命名法（CamelCase）。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>
      <!--
      Standard object's metadata. More info: 
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      -->
      标准对象的元数据。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      </td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "object-reference-v1#ObjectReference" >}}">ObjectReference</a></em></td>
      <td>
      <!--
      The target object that you want to bind to the standard object.
      -->
      你想要绑定到标准对象的目标对象。
      </td>
    </tr>
  </tbody>
</table>

