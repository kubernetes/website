---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference містить достатньо інформації, щоб дозволити вам знаходити типізований згаданий обʼєкт всередині того ж простору імен."
title: "TypedLocalObjectReference"
weight: 600
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## TypedLocalObjectReference {#TypedLocalObjectReference}

`TypedLocalObjectReference` містить достатньо інформації, щоб дозволити вам знаходити типізований згаданий обʼєкт всередині того ж простору імен.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>APIGroup — це група для ресурсу, на який посилаються. Якщо APIGroup не вказано, вказаний Kind повинен бути в основній групі API. Для будь-яких інших сторонніх типів APIGroup є обовʼязковим.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kind — це тип ресурсу, на який посилаються.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name — це назва ресурсу, на який посилаються.</td>
    </tr>
  </tbody>
</table>
