---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "RoleRef"
content_type: "api_reference"
description: "RoleRef містить інформацію, яка вказує на роль, що використовується"
title: "RoleRef"
weight: 420
auto_generated: false
---

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## RoleRef {#RoleRef}

RoleRef містить інформацію, яка вказує на роль, що використовується

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>APIGroup є групою для ресурсу, на який посилаються</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kind є типом ресурсу, на який посилаються</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name є імʼям ресурсу, на який посилаються</td>
    </tr>
  </tbody>
</table>
