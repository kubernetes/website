---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "LocalSubjectAccessReview"
content_type: "api_reference"
description: "LocalSubjectAccessReview перевіряє, чи може користувач або група виконати дію в заданому просторі імен. Наявність ресурсу з обмеженням за простором імен значно спрощує надання політики з обмеженням за простором імен, яка включає перевірку дозволів."
title: "LocalSubjectAccessReview"
weight: 210
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## LocalSubjectAccessReview {#LocalSubjectAccessReview}

LocalSubjectAccessReview перевіряє, чи може користувач або група виконати дію в заданому просторі імен. Наявність ресурсу з обмеженням за простором імен значно спрощує надання політики з обмеженням за простором імен, яка включає перевірку дозволів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Докладніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind є рядковим значенням, що представляє REST-ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з кінцевої точки, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Докладніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>metadata є стандартною метаданою списку. Докладніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em>SubjectAccessReviewSpec</em></td>
      <td>spec містить інформацію про запит, що оцінюється.  spec.namespace повинен бути рівним простору імен, до якого ви зробили запит.  Якщо порожній, використовується значення за замовчуванням.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em>SubjectAccessReviewStatus</em></td>
      <td>status заповнюється сервером і вказує, чи дозволено запит чи ні.</td>
    </tr>
  </tbody>
</table>
