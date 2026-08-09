---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 允许引用同一命名空间内的类型化对象。"
title: "TypedLocalObjectReference"
weight: 610
---

<!--
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference allows to reference typed object inside the same namespace."
title: "TypedLocalObjectReference"
weight: 610
-->

`apiVersion: scheduling.k8s.io/v1alpha2`

`import "k8s.io/api/scheduling/v1alpha2"`

## TypedLocalObjectReference {#TypedLocalObjectReference}

<!--
TypedLocalObjectReference allows to reference typed object inside the same namespace.
-->
TypedLocalObjectReference 允许引用同一命名空间内的类型化对象。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>
      <!--
      APIGroup is the group for the resource being referenced. If APIGroup is empty, the specified Kind must be in the core API group. For any other third-party types, setting APIGroup is required. It must be a DNS subdomain.
      -->
      apiGroup 是所引用资源所属的 API 组。如果 apiGroup 为空，则指定的 kind 必须属于核心 API 组。
      对于任何其他第三方类型，必须设置 apiGroup。该值必须符合 DNS 子域名的格式要求。
      </td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Kind is the type of resource being referenced. It must be a path segment name.
      -->
      kind 是所引用资源的类型。它必须是一个路径段名称。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Name is the name of resource being referenced. It must be a path segment name.
      -->
      name 是所引用资源的名称。它必须是一个路径段名称。
      </td>
    </tr>
  </tbody>
</table>
