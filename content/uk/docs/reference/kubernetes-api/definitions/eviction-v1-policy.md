---
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "Eviction"
content_type: "api_reference"
description: "Eviction виселяє под з його вузла відповідно до певних політик та обмежень безпеки. Є субресурсом Pod. Запит на виклик такого виселення створюється шляхом POST до .../pods/&lt;pod name&gt;/evictions."
title: "Eviction"
weight: 100
auto_generated: false
---

`apiVersion: policy/v1`

`import "k8s.io/api/policy/v1"`

## Eviction {#Eviction}

Eviction виселяє под з його вузла відповідно до певних політик та обмежень безпеки. Це субресурс Pod. Запит на виклик такого виселення створюється шляхом POST до .../pods/&lt;pod name&gt;/evictions.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>deleteOptions</code><br/><em><a href="{{< ref "delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td>Можна надати DeleteOptions</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind є рядковим значенням, що представляє REST-ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>ObjectMeta описує под, який виселяється.</td>
    </tr>
  </tbody>
</table>
