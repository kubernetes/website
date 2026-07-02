---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIResource"
content_type: "api_reference"
description: "APIResource визначає назву ресурсу та чи є він обмеженим простором імен."
title: "APIResource"
weight: 30
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## APIResource {#APIResource}

APIResource визначає назву ресурсу та чи є він обмеженим простором імен.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>categories</code><br/><em>string array</em></td>
      <td>categories є списком групованих ресурсів, до яких належить цей ресурс (наприклад, 'all')</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>group є переважною групою ресурсу. Порожнє значення означає групу списку ресурсів, що містить цей ресурс. Для субресурсів це може мати інше значення, наприклад: Scale".</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>kind визначає тип ресурсу (наприклад, 'Foo' є типом для ресурсу 'foo')</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name є множинною назвою ресурсу.</td>
    </tr>
    <tr>
      <td><code>namespaced</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>namespaced визначає, чи є ресурс обмеженим простором імен.</td>
    </tr>
    <tr>
      <td><code>shortNames</code><br/><em>string array</em></td>
      <td>shortNames є списком рекомендованих коротких назв ресурсу.</td>
    </tr>
    <tr>
      <td><code>singularName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>singularName є назвою ресурсу в однині. Це дозволяє клієнтам обробляти множину та однину прозоро. Назва в однині більш коректна для звітування про стан одного елемента, і обидві форми, однина та множина, дозволені з інтерфейсу kubectl CLI.</td>
    </tr>
    <tr>
      <td><code>storageVersionHash</code><br/><em>string</em></td>
      <td>Хеш-значення версії зберігання, версії, до якої цей ресурс конвертується при записі в сховище даних. Значення повинно розглядатися як непрозоре для клієнтів. Дійсним є лише порівняння на рівність значення. Це альфа-функція і може змінюватися або бути видаленою в майбутньому. Поле заповнюється лише API-сервером, якщо увімкнено функціональну можливість StorageVersionHash. Це поле залишатиметься необовʼязковим, навіть якщо воно стане стабільним.</td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>verbs є списком підтримуваних kube-дій (це включає get, list, watch, create, update, patch, delete, deletecollection та proxy)</td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>version є переважною версією ресурсу. Порожнє значення означає версію списку ресурсів, що містить цей ресурс. Для субресурсів це може мати інше значення, наприклад: v1 (поки всередині версії v1beta1 групи основного ресурсу)".</td>
    </tr>
  </tbody>
</table>

## APIResourceList {#APIResourceList}

APIResourceList є списком APIResource, він використовується для відображення назв ресурсів, підтримуваних у конкретній групі та версії, а також чи є ресурс обмеженим простором імен.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>groupVersion визначає групу та версію, для якої призначений цей APIResourceList.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>resources</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-resource-v1-meta#APIResource" >}}">APIResource array</a></em></td>
      <td>resources містить назви ресурсів та інформацію про те, чи вони обмежені простором імен.</td>
    </tr>
  </tbody>
</table>
