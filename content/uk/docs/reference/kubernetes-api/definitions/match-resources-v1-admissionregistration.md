---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MatchResources"
content_type: "api_reference"
description: "MatchResources вирішує, чи запускати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає має збіг з обома, він виключається)"
title: "MatchResources"
weight: 240
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## MatchResources {#MatchResources}

MatchResources вирішує, чи запускати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає має збіг з обома, він виключається)

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>excludeResourceRules</code><br/><em><a href="{{< ref "named-rule-with-operations-v1-admissionregistration#NamedRuleWithOperations" >}}">NamedRuleWithOperations array</a></em></td>
      <td>excludeResourceRules описує, які операції над якими ресурсами/субресурсами ValidatingAdmissionPolicy не повинна враховувати. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом, він виключається)</td>
    </tr>
    <tr>
      <td><code>matchPolicy</code><br/><em>string</em></td>
      <td>matchPolicy визначає, як список "MatchResources" використовується для відповідності вхідним запитам. Дозволені значення: "Exact" або "Equivalent".
      <ul>
        <li>Exact: відповідність запиту лише якщо він точно відповідає зазначеному правилу. Наприклад, якщо розгортання можна змінювати через apps/v1, apps/v1beta1 та extensions/v1beta1, але "rules" включали лише <code>apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]</code>, запит до apps/v1beta1 або extensions/v1beta1 не буде надіслано до ValidatingAdmissionPolicy.</li>
        <li>Equivalent: відповідність запиту, якщо він змінює ресурс, зазначений у правилах, навіть через іншу групу API або версію. Наприклад, якщо розгортання можна змінювати через apps/v1, apps/v1beta1 та extensions/v1beta1, і "rules" включали лише <code>apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]</code>, запит до apps/v1beta1 або extensions/v1beta1 буде перетворено на apps/v1 і надіслано до ValidatingAdmissionPolicy.</li>
      </ul>
      Стандартне значення: "Equivalent"
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Equivalent"</code> означає, що запити повинні бути надіслані до вебхука, якщо вони змінюють ресурс, зазначений у правилах, через іншу групу API або версію.</li>
        <li><code>"Exact"</code> означає, що запити повинні бути надіслані до вебхука лише якщо вони точно відповідають заданому правилу.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>namespaceSelector</code><br/><em><a href="{{< ref "label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>namespaceSelector вирішує, чи запускати політику контролю допуску до обʼєкта на основі того, чи відповідає простір імен для цього обʼєкта селектору. Якщо обʼєкт сам є простором імен, відповідність перевіряється на object.metadata.labels. Якщо обʼєкт є іншим ресурсом з кластерною областю, політика ніколи не пропускається.
      <br/><br/>
      Наприклад, щоб запустити вебхук на будь-яких обʼєктах, простір імен яких не повʼязаний з "runlevel" значенням "0" або "1", ви встановите селектор наступним чином:
      <pre>
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "runlevel",
            "operator": "NotIn",
            "values": [
              "0",
              "1"
            ]
          }
        ]
      }
      </pre>
      Якщо замість цього ви хочете запускати політику лише на обʼєктах, простір імен яких повʼязаний з "environment" значенням "prod" або "staging", ви встановите селектор наступним чином:
      <pre>
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "environment",
            "operator": "In",
            "values": [
              "prod",
              "staging"
            ]
          }
        ]
      }
      </pre>
      Див. <a href="/uk/docs/concepts/overview/working-with-objects/labels/">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/</a> для отримання додаткових прикладів селекторів міток.
      <br/><br/>
      Стандартно використовується порожній LabelSelector, який відповідає всьому.</td>
    </tr>
    <tr>
      <td><code>objectSelector</code><br/><em><a href="{{< ref "label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>objectSelector вирішує, чи запускати валідацію на основі того, чи має обʼєкт відповідні мітки. objectSelector оцінюється як для oldObject, так і для newObject, які будуть надіслані до cel валідації, і вважається, що він відповідає, якщо будь-який з обʼєктів відповідає селектору. Null обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати мітки (наприклад, DeploymentRollback або PodProxyOptions), не вважається відповідним. Використовуйте objectSelector лише якщо вебхук є опціональним, оскільки кінцеві користувачі можуть пропустити вебхук, встановивши мітки. Стандартно використовується порожній LabelSelector, який відповідає всьому.</td>
    </tr>
    <tr>
      <td><code>resourceRules</code><br/><em><a href="{{< ref "named-rule-with-operations-v1-admissionregistration#NamedRuleWithOperations" >}}">NamedRuleWithOperations array</a></em></td>
      <td>resourceRules описує, які операції над якими ресурсами/підресурсами відповідають ValidatingAdmissionPolicy. Політика враховує операцію, якщо вона відповідає <em>будь-якому</em> правилу.</td>
    </tr>
  </tbody>
</table>
