---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "Variable"
content_type: "api_reference"
description: "Variable визначає змінну, яка використовується для композиції. Змінна визначається як іменований вираз."
title: "Variable"
weight: 630
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## Variable {#Variable}

Variable визначає змінну, яка використовується для композиції. Змінна визначається як іменований вираз.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>expression</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>expression — це вираз, який буде оцінюватися як значення змінної. Вираз CEL має доступ до тих самих ідентифікаторів, що й вирази CEL у валідації.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name — це імʼя змінної. Імʼя має бути дійсним ідентифікатором CEL і унікальним серед усіх змінних. Змінну можна використовувати в інших виразах через `variables`. Наприклад, якщо імʼя "foo", змінна буде доступна як `variables.foo`</td>
    </tr>
  </tbody>
</table>
