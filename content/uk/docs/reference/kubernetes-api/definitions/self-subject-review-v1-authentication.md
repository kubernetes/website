---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview містить інформацію про користувача, яку kube-apiserver має про користувача, який робить цей запит. При використанні імперсоніфікації користувачі отримають інформацію про користувача, якого імітують. Якщо використовується імітація або автентифікація за заголовком запиту, будь-які додаткові ключі будуть ігнорувати регістр і повертатися у нижньому регістрі."
title: "SelfSubjectReview"
weight: 460
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## SelfSubjectReview {#SelfSubjectReview}

SelfSubjectReview містить інформацію про користувача, яку kube-apiserver має про користувача, який робить цей запит. При використанні імперсоніфікації користувачі отримають інформацію про користувача, якого імітують. Якщо використовується імітація або автентифікація за заголовком запиту, будь-які додаткові ключі будуть ігнорувати регістр і повертатися у нижньому регістрі.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind є рядком, що представляє REST-ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Метадані є стандартними метаданими обʼєкта. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a></em></td>
      <td>status заповнюється сервером і містить атрибути користувача.</td>
    </tr>
  </tbody>
</table>

## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

SelfSubjectReviewStatus заповнюється kube-apiserver і надсилається назад користувачу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>userInfo</code><br/><em><a href="{{< ref "user-info-v1-authentication#UserInfo" >}}">UserInfo</a></em></td>
      <td>userInfo є набором атрибутів, що належать користувачу, який робить цей запит.</td>
    </tr>
  </tbody>
</table>
