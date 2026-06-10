---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview перевіряє, чи може поточний користувач виконати дію. Не заповнення spec.namespace означає \"у всіх просторах імен\". Self є особливим випадком, оскільки користувачі завжди повинні мати можливість перевірити, чи можуть вони виконати дію"
title: "SelfSubjectAccessReview"
weight: 450
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectAccessReview {#SelfSubjectAccessReview}

SelfSubjectAccessReview перевіряє, чи може поточний користувач виконати дію. Не заповнення spec.namespace означає "у всіх просторах імен". Self є особливим випадком, оскільки користувачі завжди повинні мати можливість перевірити, чи можуть вони виконати дію

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
      <td>Метадані є стандартними метаданими списку. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a></em></td>
      <td>spec містить інформацію про запит, що оцінюється. user та groups повинні бути порожніми</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em>SubjectAccessReviewStatus</em></td>
      <td>status заповнюється сервером і вказує, чи дозволено запит чи ні</td>
    </tr>
  </tbody>
</table>

## SelfSubjectAccessReviewSpec {#SelfSubjectAccessReviewSpec}

SelfSubjectAccessReviewSpec описує запит на доступ. Точно один з resourceAttributes або nonResourceAttributes повинен бути встановлений

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nonResourceAttributes</code><br/><em><a href="{{< ref "non-resource-attributes-v1-authorization#NonResourceAttributes" >}}">NonResourceAttributes</a></em></td>
      <td>nonResourceAttributes описує інформацію для запиту доступу до не-ресурсу</td>
    </tr>
    <tr>
      <td><code>resourceAttributes</code><br/><em><a href="{{< ref "resource-attributes-v1-authorization#ResourceAttributes" >}}">ResourceAttributes</a></em></td>
      <td>resourceAttributes описує інформацію для запиту доступу до ресурсу</td>
    </tr>
  </tbody>
</table>
