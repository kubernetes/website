---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectRulesReviewStatus"
content_type: "api_reference"
description: "SubjectRulesReviewStatus містить результат перевірки правил. Ця перевірка може бути неповною залежно від набору авторизаторів, з якими налаштований сервер, та будь-яких помилок, що виникли під час оцінки. Оскільки правила авторизації є адитивними, якщо правило зʼявляється в списку, можна вважати, що субʼєкт має цей дозвіл, навіть якщо список неповний."
title: "SubjectRulesReviewStatus"
weight: 560
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SubjectRulesReviewStatus {#SubjectRulesReviewStatus}

SubjectRulesReviewStatus містить результат перевірки правил. Ця перевірка може бути неповною залежно від набору авторизаторів, з якими налаштований сервер, та будь-яких помилок, що виникли під час оцінки. Оскільки правила авторизації є адитивними, якщо правило зʼявляється в списку, можна вважати, що субʼєкт має цей дозвіл, навіть якщо список неповний.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>evaluationError</code><br/><em>string</em></td>
      <td>evaluationError може зʼявлятися у поєднанні з Rules. Це вказує на те, що під час оцінки правил сталася помилка, наприклад, авторизатор не підтримує оцінку правил, і ResourceRules та/або NonResourceRules можуть бути неповними.</td>
    </tr>
    <tr>
      <td><code>incomplete</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>incomplete є true, коли правила, повернені цим викликом, є неповними. Це найчастіше зустрічається, коли авторизатор, такий як зовнішній авторизатор, не підтримує оцінку правил.</td>
    </tr>
    <tr>
      <td><code>nonResourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "non-resource-rule-v1-authorization#NonResourceRule" >}}">NonResourceRule array</a></em></td>
      <td>nonResourceRules є списком дій, які субʼєкт може виконувати на не-ресурсах. Порядок у списку не має значення, може містити дублікати і, можливо, бути неповним.</td>
    </tr>
    <tr>
      <td><code>resourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "resource-rule-v1-authorization#ResourceRule" >}}">ResourceRule array</a></em></td>
      <td>resourceRules є списком дій, які субʼєкт може виконувати на ресурсах. Порядок у списку не має значення, може містити дублікати і, можливо, бути неповним.</td>
    </tr>
  </tbody>
</table>
