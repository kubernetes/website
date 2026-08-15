---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusCause"
content_type: "api_reference"
description: "StatusCause надає більше інформації про помилку api.Status, включаючи випадки, коли виникає кілька помилок."
title: "StatusCause"
weight: 520
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## StatusCause {#StatusCause}

StatusCause надає більше інформації про помилку api.Status, включаючи випадки, коли виникає кілька помилок.

---
<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>field</code><br/><em>string</em></td>
      <td>Поле ресурсу, яке спричинило цю помилку, як воно названо у його JSON-серіалізації. Може включати крапкову та постфіксну нотацію для вкладених атрибутів. Масиви нумеруються з нуля. Поля можуть зʼявлятися більше одного разу в масиві причин через наявність кількох помилок у полях. Необовʼязково. Приклади:
      <ul>
        <li>"name" — поле "name" у поточному ресурсі</li>
        <li>"items[0].name" — поле "name" у першому елементі масиву "items"</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Зрозумілий для людини опис причини помилки. Це поле може бути представлене читачеві без змін.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>Опис причини в форматі, придатному для машинної обробки. Якщо це значення порожнє, інформація недоступна.</td>
    </tr>
  </tbody>
</table>
