---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenReview"
content_type: "api_reference"
description: "TokenReview намагається автентифікувати токен для відомого користувача. Примітка: запити TokenReview можуть кешуватися втулком веб-хука автентифікації токенів у kube-apiserver."
title: "TokenReview"
weight: 580
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## TokenReview {#TokenReview}

TokenReview намагається автентифікувати токен для відомого користувача. Примітка: запити TokenReview можуть кешуватися втулком веб-хука автентифікації токенів у kube-apiserver.

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
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати його з точки доступу, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>metadata є стандартною метаданою обʼєкта. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#TokenReviewSpec" >}}">TokenReviewSpec</a></em></td>
      <td>spec містить інформацію про запит, що оцінюється</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#TokenReviewStatus" >}}">TokenReviewStatus</a></em></td>
      <td>status заповнюється сервером і вказує, чи можна автентифікувати запит.</td>
    </tr>
  </tbody>
</table>

## TokenReviewSpec {#TokenReviewSpec}

TokenReviewSpec є описом запиту на автентифікацію токена.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audiences</code><br/><em>string array</em></td>
      <td>audiences є списком ідентифікаторів, з якими ідентифікується сервер ресурсів, що надав цей токен. Автентифікатори токенів, що підтримують audience, перевірять, чи призначений токен хоча б для однієї з аудиторій у цьому списку. Якщо аудиторії не вказано, стандартною буде аудиторія сервера API Kubernetes.</td>
    </tr>
    <tr>
      <td><code>token</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>token є непрозорим токеном на предʼявника.</td>
    </tr>
  </tbody>
</table>

## TokenReviewStatus {#TokenReviewStatus}

TokenReviewStatus є результатом запиту на автентифікацію токена.

---


<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audiences</code><br/><em>string array</em></td>
      <td>audiences є ідентифікаторами аудиторії, обраними автентифікатором, які сумісні як з TokenReview, так і з токеном. Ідентифікатором є будь-який ідентифікатор, що знаходиться на перетині аудиторій TokenReviewSpec та аудиторій токена. Клієнт API TokenReview, який встановлює поле spec.audiences, повинен перевірити, що сумісний ідентифікатор аудиторії повертається в полі status.audiences, щоб переконатися, що сервер TokenReview підтримує аудиторії. Якщо TokenReview повертає порожнє поле status.audience, де status.authenticated дорівнює "true", токен дійсний для аудиторії сервера API Kubernetes.</td>
    </tr>
    <tr>
      <td><code>authenticated</code><br/><em>boolean</em></td>
      <td>authenticated вказує, що токен був повʼязаний з відомим користувачем.</td>
    </tr>
    <tr>
      <td><code>error</code><br/><em>string</em></td>
      <td>error вказує, що токен не вдалося перевірити</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em><a href="{{< ref "user-info-v1-authentication#UserInfo" >}}">UserInfo</a></em></td>
      <td>user є UserInfo, повʼязаним із наданим токеном.</td>
    </tr>
  </tbody>
</table>
