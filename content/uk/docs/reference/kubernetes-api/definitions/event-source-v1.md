---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "EventSource"
content_type: "api_reference"
description: "EventSource містить інформацію про подію."
title: "EventSource"
weight: 90
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## EventSource {#EventSource}

EventSource містить інформацію про подію.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>component</code><br/><em>string</em></td>
      <td>Компонент, з якого генерується подія.</td>
    </tr>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>Імʼя вузла, на якому генерується подія.</td>
    </tr>
  </tbody>
</table>
