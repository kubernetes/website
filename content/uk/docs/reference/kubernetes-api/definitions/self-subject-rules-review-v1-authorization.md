---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectRulesReview"
content_type: "api_reference"
description: "SelfSubjectRulesReview перераховує набір дій, які поточний користувач може виконувати в межах простору імен. Отриманий список дій може бути неповним залежно від режиму авторизації сервера та будь-яких помилок, що виникли під час оцінки. SelfSubjectRulesReview слід використовувати інтерфейсами користувача для показу/приховування дій або для швидкого дозволу кінцевому користувачу оцінити свої права. Його НЕ слід використовувати зовнішніми системами для прийняття рішень про авторизацію, оскільки це викликає проблеми з плутаним довіреним, часом життя кешу/скасуванням та правильністю. SubjectAccessReview та LocalAccessReview є правильним способом делегування рішень про авторизацію серверу API."
title: "SelfSubjectRulesReview"
weight: 470
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectRulesReview {#SelfSubjectRulesReview}

SelfSubjectRulesReview перераховує набір дій, які поточний користувач може виконувати в межах простору імен. Отриманий список дій може бути неповним залежно від режиму авторизації сервера та будь-яких помилок, що виникли під час оцінки. SelfSubjectRulesReview слід використовувати інтерфейсами користувача для показу/приховування дій або для швидкого дозволу кінцевому користувачу оцінити свої права. Його НЕ слід використовувати зовнішніми системами для прийняття рішень про авторизацію, оскільки це викликає проблеми з плутаним довіреним, часом життя кешу/скасуванням та правильністю. SubjectAccessReview та LocalAccessReview є правильним способом делегування рішень про авторизацію серверу API.

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
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#SelfSubjectRulesReviewSpec" >}}">SelfSubjectRulesReviewSpec</a></em></td>
      <td>spec містить інформацію про запит, що оцінюється.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "subject-rules-review-status-v1-authorization#SubjectRulesReviewStatus" >}}">SubjectRulesReviewStatus</a></em></td>
      <td>status заповнюється сервером і вказує набір дій, які користувач може виконувати.</td>
    </tr>
  </tbody>
</table>

## SelfSubjectRulesReviewSpec {#SelfSubjectRulesReviewSpec}

SelfSubjectRulesReviewSpec визначає специфікацію для SelfSubjectRulesReview.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>namespace для оцінки правил. Обовʼязково.</td>
    </tr>
  </tbody>
</table>
