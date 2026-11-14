---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference містить достатньо інформації, щоб дозволити вам знайти вказаний обʼєкт всередині того самого простору імен."
title: "LocalObjectReference"
weight: 200
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## LocalObjectReference {#LocalObjectReference}

LocalObjectReference містить достатньо інформації, щоб дозволити вам знайти вказаний обʼєкт всередині того самого простору імен."
title: "LocalObjectReference

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Назва обʼєкта, на який ви посилаєтеся. Це поле є фактично обовʼязковим, але через зворотну сумісність дозволено залишати його порожнім. Екземпляри цього типу з порожнім значенням тут, як правило, є помилковими. Докладніше: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
  </tbody>
</table>
