---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "UserInfo"
content_type: "api_reference"
description: "UserInfo містить інформацію про користувача, необхідну для реалізації інтерфейсу user.Info."
title: "UserInfo"
weight: 620
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## UserInfo {#UserInfo}

UserInfo містить інформацію про користувача, необхідну для реалізації інтерфейсу user.Info.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>extra</code><br/><em>object</em></td>
      <td>extra — будь-яка додаткова інформація, надана автентифікатором.</td>
    </tr>
    <tr>
      <td><code>groups</code><br/><em>string array</em></td>
      <td>groups — це назви груп, до яких належить цей користувач.</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>uid — це унікальне значення, яке ідентифікує цього користувача протягом часу. Якщо цього користувача видалено і додано іншого користувача з тим самим імʼям, вони матимуть різні UID.</td>
    </tr>
    <tr>
      <td><code>username</code><br/><em>string</em></td>
      <td>username — це імʼя, яке унікально ідентифікує цього користувача серед усіх активних користувачів.</td>
    </tr>
  </tbody>
</table>
