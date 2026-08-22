---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Preconditions"
content_type: "api_reference"
description: "Preconditions повинні бути виконані перед виконанням операції (оновлення, видалення тощо)."
title: "Preconditions"
weight: 380
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## Preconditions {#Preconditions}

Preconditions повинні бути виконані перед виконанням операції (оновлення, видалення тощо).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Вказує цільовий ResourceVersion</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>Вказує цільовий UID.</td>
    </tr>
  </tbody>
</table>
