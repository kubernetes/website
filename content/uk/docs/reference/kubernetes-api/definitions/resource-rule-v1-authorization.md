---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "ResourceRule"
content_type: "api_reference"
description: "ResourceRule є списком дій, які субʼєкт може виконувати над ресурсами. Порядок у списку не має значення, можуть бути дублікати, і можливо, що список є неповний."
title: "ResourceRule"
weight: 410
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## ResourceRule {#ResourceRule}

ResourceRule є списком дій, які субʼєкт може виконувати над ресурсами. Порядок у списку не має значення, можуть бути дублікати, і можливо, що список є неповний.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>apiGroups є імʼям APIGroup, яка містить ресурси. Якщо вказано кілька API груп, будь-яка дія, запитана для одного з перерахованих ресурсів у будь-якій API групі, буде дозволена. "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>resourceNames</code><br/><em>string array</em></td>
      <td>resourceNames є необовʼязковим білим списком імен, до яких застосовується правило. Порожній набір означає, що все дозволено. "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>resources є списком ресурсів, до яких застосовується правило. "*" означає всі в зазначених apiGroups. "*/foo" представляє підресурс 'foo' для всіх ресурсів у зазначених apiGroups.</td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>verbs є списком дій API ресурсів Kubernetes, таких як: get, list, watch, create, update, delete, proxy. "*" означає всі.</td>
    </tr>
  </tbody>
</table>
