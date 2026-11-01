---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 包含足够的信息，使你能够在同一命名空间内定位所引用的类型化对象。"
title: "TypedLocalObjectReference"
weight: 600
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace."
title: "TypedLocalObjectReference"
weight: 600
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## TypedLocalObjectReference {#TypedLocalObjectReference}

<!--
TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.
-->
TypedLocalObjectReference 包含足够的信息，使你能够在同一命名空间内定位所引用的类型化对象。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>
      <!--
      APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required. 
      -->
      apiGroup 是所引用资源所属的 API 组。如果未指定 apiGroup，则指定的 kind
      必须属于核心 API 组。对于任何其他第三方类型，必须指定 apiGroup。
      </td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Kind is the type of resource being referenced
      -->
      kind 是所引用资源的类型。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Name is the name of resource being referenced
      -->
      name 是所引用资源的名称。
      </td>
    </tr>
  </tbody>
</table>
