---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ManagedFieldsEntry"
content_type: "api_reference"
description: "ManagedFieldsEntry є ідентифікатором робочого процесу, набором полів (FieldSet) та версією групи ресурсу, до якого застосовується цей набір полів."
title: "ManagedFieldsEntry"
weight: 220
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ManagedFieldsEntry {#ManagedFieldsEntry}

ManagedFieldsEntry є ідентифікатором робочого процесу, набором полів (FieldSet) та версією групи ресурсу, до якого застосовується цей набір полів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію цього ресурсу, до якої застосовується цей набір полів. Формат такий же, як у верхньому рівні поля APIVersion: "group/version". Необхідно відстежувати версію набору полів, оскільки її не можна автоматично конвертувати.</td>
    </tr>
    <tr>
      <td><code>fieldsType</code><br/><em>string</em></td>
      <td>FieldsType є дискримінатором для різних форматів і версій полів. Наразі існує лише одне можливе значення: "FieldsV1"</td>
    </tr>
    <tr>
      <td><code>fieldsV1</code><br/><em><a href="{{< ref "fields-v1-v1-meta#FieldsV1" >}}">FieldsV1</a></em></td>
      <td>FieldsV1 містить перший формат версії JSON, як описано в типі "FieldsV1".</td>
    </tr>
    <tr>
      <td><code>manager</code><br/><em>string</em></td>
      <td>Manager є ідентифікатором робочого процесу, який керує цими полями.</td>
    </tr>
    <tr>
      <td><code>operation</code><br/><em>string</em></td>
      <td>Operation є типом операції, яка призвела до створення цього запису ManagedFieldsEntry. Єдині допустимі значення для цього поля: 'Apply' та 'Update'.</td>
    </tr>
    <tr>
      <td><code>subresource</code><br/><em>string</em></td>
      <td>Subresource є назвою субресурсу, який використовувався для оновлення цього обʼєкта, або порожній рядок, якщо обʼєкт було оновлено через основний ресурс. Значення цього поля використовується для розрізнення менеджерів, навіть якщо вони мають однакове імʼя. Наприклад, оновлення статусу буде відрізнятися від звичайного оновлення з використанням того ж імені менеджера. Зверніть увагу, що поле APIVersion не повʼязане з полем Subresource і завжди відповідає версії основного ресурсу.</td>
    </tr>
    <tr>
      <td><code>time</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Time є відбитком часу, коли запис ManagedFields було додано. Відбиток часу також оновлюється, якщо додано поле, менеджер змінює будь-яке з керованих полів або видаляє поле. Відбиток часу не оновлюється, коли поле видаляється з запису, оскільки його взяв інший менеджер.</td>
    </tr>
  </tbody>
</table>
