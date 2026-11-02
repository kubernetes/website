---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview перевіряє, чи може користувач або група виконати певну дію."
title: "SubjectAccessReview"
weight: 550
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SubjectAccessReview {#SubjectAccessReview}

SubjectAccessReview перевіряє, чи може користувач або група виконати певну дію.

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
      <td>Kind є рядковим значенням, що представляє REST ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з кінцевої точки, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>metadata є стандартними метаданими списку. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a></em></td>
      <td>spec містить інформацію про запит, що оцінюється</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a></em></td>
      <td>status заповнюється сервером і вказує, чи дозволено запит чи ні</td>
    </tr>
  </tbody>
</table>

## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

SubjectAccessReviewSpec є описом запиту на доступ. Точнісінько одне з полів resourceAttributes або nonResourceAttributes повинно бути встановлено.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>extra</code><br/><em>object</em></td>
      <td>extra відповідає методу user.Info.GetExtra() з автентифікатора. Оскільки це є вхідними даними для авторизатора, тут потрібно застосувати рефлексію.</td>
    </tr>
    <tr>
      <td><code>groups</code><br/><em>string array</em></td>
      <td>groups є групами, для яких ви перевіряєте доступ.</td>
    </tr>
    <tr>
      <td><code>nonResourceAttributes</code><br/><em><a href="{{< ref "non-resource-attributes-v1-authorization#NonResourceAttributes" >}}">NonResourceAttributes</a></em></td>
      <td>nonResourceAttributes описує інформацію для запиту на доступ до не-ресурсу</td>
    </tr>
    <tr>
      <td><code>resourceAttributes</code><br/><em><a href="{{< ref "resource-attributes-v1-authorization#ResourceAttributes" >}}">ResourceAttributes</a></em></td>
      <td>resourceAttributes описує інформацію для запиту на доступ до ресурсу</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>uid містить інформацію про користувача, який робить запит.</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user є користувачем, для якого ви перевіряєте доступ. Якщо ви вказуєте "User", але не "Groups", то це інтерпретується як "Що якщо користувач не є членом жодної групи".</td>
    </tr>
  </tbody>
</table>

## SubjectAccessReviewStatus {#SubjectAccessReviewStatus}

SubjectAccessReviewStatus

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowed</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>allowed є обовʼязковим. True, якщо дія дозволена, false в іншому випадку.</td>
    </tr>
    <tr>
      <td><code>denied</code><br/><em>boolean</em></td>
      <td>denied є необовʼязковим. True, якщо дія буде заборонена, false в іншому випадку. Якщо allowed є false і denied є false, то авторизатор не має думки щодо того, чи дозволяти дію. Denied не може бути true, якщо Allowed є true.</td>
    </tr>
    <tr>
      <td><code>evaluationError</code><br/><em>string</em></td>
      <td>evaluationError є індикацією того, що під час перевірки авторизації сталася помилка. Можливо отримати помилку і все ж мати можливість визначити статус авторизації. Наприклад, RBAC може не мати ролі, але достатньо ролей все ще присутні і привʼязані для оцінки запиту.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>reason є необовʼязковим. Вказує, чому запит був дозволений або заборонений.</td>
    </tr>
  </tbody>
</table>
