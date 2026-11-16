---
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "Eviction"
content_type: "api_reference"
description: "Eviction 操作会根据特定的策略和安全约束，
  将 Pod 从其所在节点上驱逐。这是 Pod 的一个子资源。可以通过向
  `.../pods/<pod name>/evictions` 发送 POST 请求来发起此类驱逐操作。"
title: "Eviction"
weight: 100
---

<!--
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "Eviction"
content_type: "api_reference"
description: "Eviction evicts a pod from its node subject to certain policies and safety constraints. 
  This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to 
  .../pods/&lt;pod name&gt;/evictions."
title: "Eviction"
weight: 100
auto_generated: true
-->

`apiVersion: policy/v1`

`import "k8s.io/api/policy/v1"`


## Eviction {#Eviction}

<!--
Eviction evicts a pod from its node subject to certain policies and safety constraints. 
This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to 
.../pods/&lt;pod name&gt;/evictions.
-->
Eviction 操作会根据特定的策略和安全约束，将 Pod 从其所在节点上驱逐。
这是 Pod 的一个子资源。可以通过向 `.../pods/<pod name>/evictions`
发送 POST 请求来发起此类驱逐操作。

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
      and may reject unrecognized values. More info: 
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      apiVersion 定义了该对象表示形式的版本化模式（schema）。
      服务器应将已识别的模式转换为最新的内部值，并可拒绝无法识别的值。
      更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>deleteOptions</code><br/><em><a href="{{< ref "delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td>
      <!--
      DeleteOptions may be provided
      -->
      可以提供 deleteOptions。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. 
      Servers may infer this from the endpoint the client submits requests to. 
      Cannot be updated. In CamelCase. More info: 
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是一个字符串值，用于标识该对象所代表的 REST 资源。
      服务器可以根据客户端提交请求的端点推断出该值。该字段不可更新。
      采用驼峰命名法（CamelCase）。
      更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>
      <!--
      ObjectMeta describes the pod that is being evicted.
      -->
      objectMeta 描述了正在被驱逐的 Pod。
      </td>
    </tr>
  </tbody>
</table>

