---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Status"
content_type: "api_reference"
description: "Status є значенням, що повертається для викликів, які не повертають інші обʼєкти."
title: "Status"
weight: 510
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## Status {#Status}

Status є значенням, що повертається для викликів, які не повертають інші обʼєкти.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>code</code><br/><em>integer</em></td>
      <td>Пропонований HTTP код повернення для цього статусу, 0 якщо не встановлено.</td>
    </tr>
    <tr>
      <td><code>details</code><br/><em><a href="{{< ref "status-details-v1-meta#StatusDetails" >}}">StatusDetails</a></em></td>
      <td>Розширені дані, повʼязані з причиною. Кожна причина може визначати свої власні розширені деталі. Це поле є необовʼязковим, і дані, що повертаються, не гарантують відповідність будь-якій схемі, окрім тієї, що визначена типом причини.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind є рядковим значенням, що представляє REST ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з кінцевої точки, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Зрозумілий для людини опис статусу цієї операції.</td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>Опис того, чому ця операція знаходиться в статусі "Failure" в форматі придатному для машинної обробки. Якщо це значення порожнє, інформація недоступна. Reason уточнює HTTP код статусу, але не перевизначає його.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em>string</em></td>
      <td>Статус операції. Одне з: "Success" або "Failure". Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a></td>
    </tr>
  </tbody>
</table>
