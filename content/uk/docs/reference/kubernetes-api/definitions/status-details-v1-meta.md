---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "StatusDetails"
content_type: "api_reference"
description: "StatusDetails є набором додаткових властивостей, які МОЖУТЬ бути встановлені сервером для надання додаткової інформації про відповідь. Поле Reason обʼєкта Status визначає, які атрибути будуть встановлені. Клієнти повинні ігнорувати поля, які не відповідають визначеному типу кожного атрибута, і повинні припускати, що будь-який атрибут може бути порожнім, недійсним або недостатньо визначеним."
title: "StatusDetails"
weight: 530
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## StatusDetails {#StatusDetails}

StatusDetails є набором додаткових властивостей, які МОЖУТЬ бути встановлені сервером для надання додаткової інформації про відповідь. Поле Reason обʼєкта Status визначає, які атрибути будуть встановлені. Клієнти повинні ігнорувати поля, які не відповідають визначеному типу кожного атрибута, і повинні припускати, що будь-який атрибут може бути порожнім, недійсним або недостатньо визначеним.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>causes</code><br/><em><a href="{{< ref "status-cause-v1-meta#StatusCause" >}}">масив StatusCause</a></em></td>
      <td>Масив Causes включає більше деталей, повʼязаних з помилкою StatusReason. Не всі StatusReasons можуть надавати детальні причини.</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>Атрибут group ресурсу, повʼязаного з помилкою StatusReason.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Атрибут kind ресурсу, повʼязаного з помилкою StatusReason. У деяких операціях може відрізнятися від запитаного ресурсу Kind. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Атрибут name ресурсу, повʼязаного з помилкою StatusReason (коли є одне імʼя, яке можна описати).</td>
    </tr>
    <tr>
      <td><code>retryAfterSeconds</code><br/><em>integer</em></td>
      <td>Якщо вказано, час у секундах до повторної спроби операції. Деякі помилки можуть вказувати, що клієнт повинен виконати альтернативну дію — для цих помилок це поле може вказувати, скільки часу чекати перед виконанням альтернативної дії.</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>UID ресурсу. (коли є один ресурс, який можна описати). Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names#uids">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids</a></td>
    </tr>
  </tbody>
</table>









