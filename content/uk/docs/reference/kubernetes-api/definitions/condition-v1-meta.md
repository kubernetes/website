---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Condition"
content_type: "api_reference"
description: "Condition містить деталі щодо одного аспекту поточного стану цього API ресурсу."
title: "Condition"
weight: 70
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## Condition {#Condition}

Condition містить деталі щодо одного аспекту поточного стану цього API ресурсу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastTransitionTime</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>lastTransitionTime — це останній час, коли стан перейшов з одного стану в інший. Це має бути тоді, коли змінився основний стан. Якщо це невідомо, можна використовувати час, коли змінилося поле API.</td>
    </tr>
    <tr>
      <td><code>message</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>message — це повідомлення, зрозуміле людині, яке вказує деталі щодо переходу. Це може бути порожній рядок.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>observedGeneration представляє .metadata.generation, на основі якого була встановлено стан. Наприклад, якщо .metadata.generation наразі 12, але .status.conditions[x].observedGeneration дорівнює 9, стан застарів щодо поточного стану екземпляра.</td>
    </tr>
    <tr>
      <td><code>reason</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>reason містить програмний ідентифікатор, що вказує причину останнього переходу стану. Створювачі конкретних типів станіів можуть визначати очікувані значення та значення для цього поля, а також чи вважаються ці значення гарантованим API. Значення повинно бути рядком у CamelCase. Це поле не може бути порожнім.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>status стану, одне з True, False, Unknown.</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type стану у CamelCase або у foo.example.com/CamelCase.</td>
    </tr>
  </tbody>
</table>
