---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "RoleRef"
content_type: "api_reference"
description: "RoleRef 包含指向所使用角色的信息。"
title: "RoleRef"
weight: 420
---

<!--
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "RoleRef"
content_type: "api_reference"
description: "RoleRef contains information that points to the role being used"
title: "RoleRef"
weight: 420
auto_generated: true
-->

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## RoleRef {#RoleRef}

<!--
RoleRef contains information that points to the role being used
-->
RoleRef 包含指向所使用角色的信息。

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>
      <!--
      APIGroup is the group for the resource being referenced
      -->
      APIGroup 是所引用资源所属的 API 组。
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
