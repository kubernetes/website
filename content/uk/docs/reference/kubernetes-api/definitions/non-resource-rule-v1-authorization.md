---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceRule"
content_type: "api_reference"
description: "NonResourceRule містить інформацію, що описує правило для обʼєктів, які не є ресурсами"
title: "NonResourceRule"
weight: 300
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## NonResourceRule {#NonResourceRule}

NonResourceRule містить інформацію, що описує правило для обʼєктів, які не є ресурсами

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nonResourceURLs</code><br/><em>string array</em></td>
      <td>nonResourceURLs є набором часткових URL, до яких користувач повинен мати доступ. Дозволяються * лише як повний, останній крок у шляху. "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>verbs є списком Kubernetes non-resource API дієслів, таких як: get, post, put, delete, patch, head, options. "*" означає всі.</td>
    </tr>
  </tbody>
</table>
