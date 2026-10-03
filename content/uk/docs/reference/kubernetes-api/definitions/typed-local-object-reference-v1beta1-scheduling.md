---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1beta1"
  import: "k8s.io/api/scheduling/v1beta1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference дозволяє посилатися на типізований обʼєкт всередині того ж простору імен."
title: "TypedLocalObjectReference"
weight: 610
auto_generated: false
---

`apiVersion: scheduling.k8s.io/v1beta1`

`import "k8s.io/api/scheduling/v1beta1"`

## TypedLocalObjectReference {#TypedLocalObjectReference}

TypedLocalObjectReference дозволяє посилатися на типізований обʼєкт всередині того ж простору імен.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>apiGroup — це група для ресурсу, на який посилаються. Якщо apiGroup не вказано, вказаний Kind повинен бути в основній групі API. Для будь-яких інших сторонніх типів apiGroup є обовʼязковим. Має бути DNS-піддоменом.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>kind — це тип ресурсу, на який посилаються. Має бути імʼям сегмента шляху.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name — це назва ресурсу, на який посилаються. Має бути імʼям сегмента шляху.</td>
    </tr>
  </tbody>
</table>
