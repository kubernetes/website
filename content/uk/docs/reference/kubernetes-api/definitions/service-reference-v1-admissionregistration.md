---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ServiceReference"
content_type: "api_reference"
description: "ServiceReference містить посилання на Service.legacy.k8s.io"
title: "ServiceReference"
weight: 490
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ServiceReference {#ServiceReference}

ServiceReference містить посилання на Service.legacy.k8s.io

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name є імʼям сервісу. Обовʼязково</td>
    </tr>
    <tr>
      <td><code>namespace</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>namespace є простором імен сервісу. Обовʼязково</td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path є необовʼязковим URL-шляхом, який буде надіслано в будь-якому запиті до цього сервісу.</td>
    </tr>
    <tr>
      <td><code>port</code><br/><em>integer</em></td>
      <td>port є портом на сервісі, який обслуговує вебхук. Зазвичай 443 для зворотної сумісності. <code>port</code> повинен бути дійсним номером порту (1-65535, включно).</td>
    </tr>
  </tbody>
</table>
