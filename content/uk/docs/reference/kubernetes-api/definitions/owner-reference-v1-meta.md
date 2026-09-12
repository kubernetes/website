---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "OwnerReference"
content_type: "api_reference"
description: "OwnerReference містить достатньо інформації, щоб ви могли ідентифікувати обʼєкт-власник. Обʼєкт-власник повинен знаходитися в тому ж просторі імен, що й залежний обʼєкт, або бути глобальним, тому поле простору імен відсутнє."
title: "OwnerReference"
weight: 330
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## OwnerReference {#OwnerReference}

OwnerReference містить достатньо інформації, щоб ви могли ідентифікувати обʼєкт-власник. Обʼєкт-власник повинен знаходитися в тому ж просторі імен, що й залежний обʼєкт, або бути глобальним, тому поле простору імен відсутнє.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>API версія обʼєкта, на який посилаються.</td>
    </tr>
    <tr>
      <td><code>blockOwnerDeletion</code><br/><em>boolean</em></td>
      <td>Якщо true, AND якщо у власника є завершувач "foregroundDeletion", тоді власника не можна видалити зі сховища ключ-значення, поки це посилання не буде видалено. Див. <a href="/uk/docs/concepts/architecture/garbage-collection/#foreground-deletion">https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion</a> для того, як збирач сміття взаємодіє з цим полем і забезпечує передній видалення. Стандартне значення — false. Щоб встановити це поле, користувач повинен мати дозвіл "delete" для власника, інакше буде повернуто 422 (Unprocessable Entity).</td>
    </tr>
    <tr>
      <td><code>controller</code><br/><em>boolean</em></td>
      <td>Якщо true, це посилання вказує на керуючий контролер.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kind референта. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя референта. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</a></td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>UID референта. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names#uids">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids</a></td>
    </tr>
  </tbody>
</table>
