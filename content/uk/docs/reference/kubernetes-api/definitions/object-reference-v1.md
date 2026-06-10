---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference містить достатньо інформації, щоб ви могли перевірити або змінити об’єкт, на який вона посилається."
title: "ObjectReference"
weight: 320
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ObjectReference {#ObjectReference}

ObjectReference містить достатньо інформації, щоб ви могли перевірити або змінити об’єкт, на який вона посилається.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>API версія об’єкта, на який посилаються.</td>
    </tr>
    <tr>
      <td><code>fieldPath</code><br/><em>string</em></td>
      <td>Якщо посилання стосується частини об’єкта, а не всього об’єкта, цей рядок повинен містити дійсне вираження доступу до поля JSON/Go, наприклад desiredState.manifest.containers[2]. Наприклад, якщо посилання на об’єкт стосується контейнера всередині поду, це може мати значення: "spec.containers{name}" (де "name" відноситься до імені контейнера, який викликав подію) або, якщо ім’я контейнера не вказано, "spec.containers[2]" (контейнер з індексом 2 у цьому поді). Ця синтаксис обраний лише для того, щоб мати чітко визначений спосіб посилання на частину об’єкта.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Тип об’єкта, на який посилаються. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Ім’я об’єкта, на який посилаються. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>Простір імен об’єкта, на який посилаються. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/namespaces/">https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/</a></td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Конкретна версія ресурсу, на яку посилається це посилання, якщо така є. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency</a></td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>UID об’єкта, на який посилаються. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#uids">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids</a></td>
    </tr>
  </tbody>
</table>
