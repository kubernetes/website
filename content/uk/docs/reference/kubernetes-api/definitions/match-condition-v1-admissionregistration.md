---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MatchCondition"
content_type: "api_reference"
description: "MatchCondition представляє умову, яка повинна бути виконана, щоб запит був надісланий вебхуку."
title: "MatchCondition"
weight: 230
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## MatchCondition {#MatchCondition}

MatchCondition представляє умову, яка повинна бути виконана, щоб запит був надісланий вебхуку.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>expression</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>expression представляє вираз, який буде оцінюватися за допомогою CEL. Повинен оцінюватися до bool. Вирази CEL мають доступ до вмісту AdmissionRequest та Authorizer, організованих у змінні CEL:
      <ul>
        <li>'object' — Обʼєкт з вхідного запиту. Значення дорівнює null для запитів DELETE.</li>
        <li>'oldObject' — Наявний обʼєкт. Значення дорівнює null для запитів CREATE.</li>
        <li>'request' — Атрибути запиту на допуск(/pkg/apis/admission/types.go#AdmissionRequest).</li>
        <li>'authorizer' — авторизатор CEL. Може використовуватися для перевірки авторизації для принципала (користувача або службового облікового запису) запиту. Див. <a href="https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz">https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz</a></li>
        <li>'authorizer.requestResource' — CEL ResourceCheck, створений з 'authorizer' і налаштований з ресурсом запиту. Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></li>
      </ul>
      Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name є ідентифікатором для цієї умови відповідності, використовується для стратегічного обʼєднання MatchConditions, а також для надання ідентифікатора для цілей журналювання. Хороше імʼя повинно бути описовим для повʼязаного виразу. Імʼя повинно бути кваліфікованим іменем, що складається з буквено-цифрових символів, '-', '_' або '.', і повинно починатися та закінчуватися буквено-цифровим символом (наприклад, 'MyName',  або 'my.name',  або '123-abc', регулярний вираз, що використовується для перевірки, це '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') з необовʼязковим префіксом піддомену DNS і '/' (наприклад, 'example.com/MyName')  Обовʼязково.</td>
    </tr>
  </tbody>
</table>
