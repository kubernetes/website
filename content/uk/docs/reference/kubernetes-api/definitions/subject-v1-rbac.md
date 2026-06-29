---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Subject"
content_type: "api_reference"
description: "Subject містить посилання на обʼєкт або ідентичності користувачів, до яких застосовується привʼязка ролі. Це може бути пряме посилання на обʼєкт API або значення для не-обʼєктів, таких як імена користувачів і груп."
title: "Subject"
weight: 540
auto_generated: false
---

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## Subject {#Subject}

Subject містить посилання на обʼєкт або ідентичності користувачів, до яких застосовується привʼязка ролі. Це може бути пряме посилання на обʼєкт API або значення для не-обʼєктів, таких як імена користувачів і груп.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>APIGroup містить групу API для посилання на субʼєкт. Зазвичай "" для субʼєктів ServiceAccount. Стандартно "rbac.authorization.k8s.io" для субʼєктів User і Group.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Тип обʼєкта, на який посилається. Значення, визначені цією групою API, це "User", "Group" і "ServiceAccount". Якщо авторизатор не розпізнає значення типу, авторизатор повинен повідомити про помилку.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя обʼєкта, на який посилається.</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>Простір імен обʼєкта, на який посилається. Якщо тип обʼєкта не є просторовим, наприклад "User" або "Group", і це значення не порожнє, авторизатор повинен повідомити про помилку.</td>
    </tr>
  </tbody>
</table>
