---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "NonResourceAttributes"
content_type: "api_reference"
description: "NonResourceAttributes містить атрибути авторизації, доступні для запитів, що не стосуються ресурсів, до інтерфейсу Authorizer"
title: "NonResourceAttributes"
weight: 290
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## NonResourceAttributes {#NonResourceAttributes}

NonResourceAttributes містить атрибути авторизації, доступні для запитів, що не стосуються ресурсів, до інтерфейсу Authorizer

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path є URL-шляхом запиту</td>
    </tr>
    <tr>
      <td><code>verb</code><br/><em>string</em></td>
      <td>verb є стандартним HTTP-дієсловом</td>
    </tr>
  </tbody>
</table>
