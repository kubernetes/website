---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "RuleWithOperations"
content_type: "api_reference"
description: "RuleWithOperations є кортежем Operations та Resources. Рекомендується переконатися, що всі розширення кортежу є дійсними."
title: "RuleWithOperations"
weight: 430
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## RuleWithOperations {#RuleWithOperations}

RuleWithOperations є кортежем Operations та Resources. Рекомендується переконатися, що всі розширення кортежу є дійсними.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>apiGroups є групами API, до яких належать ресурси. '*' означає всі групи. Якщо присутній '*', довжина зрізу повинна бути одна. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>apiVersions</code><br/><em>string array</em></td>
      <td>apiVersions є версіями API, до яких належать ресурси. '*' означає всі версії. Якщо присутній '*', довжина зрізу повинна бути одна. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>operations</code><br/><em>string array</em></td>
      <td>operations є операціями, які цікавлять хук допуску — CREATE, UPDATE, DELETE, CONNECT або * для всіх цих операцій та будь-яких майбутніх операцій admission, які будуть додані. Якщо присутній '*', довжина зрізу повинна бути одна. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>resources є списком ресурсів, до яких застосовується правило. Наприклад: 'pods' означає pods. 'pods/log' означає субресурс log для pods. '*' означає всі ресурси, але не субресурси. 'pods/*' означає всі субресурси для pods. '*/scale' означає всі субресурси scale. '*/ *' означає всі ресурси та їх субресурси. Якщо присутній символ підстановки, правило валідації забезпечить, що ресурси не перекриваються. Залежно від об'єкта, субресурси можуть бути заборонені. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>scope</code><br/><em>string</em></td>
      <td>scope визначає область дії цього правила. Дійсні значення: "Cluster", "Namespaced" та "*" "Cluster" означає, що лише ресурси з областю кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є ресурсами з областю дії кластера. "Namespaced" означає, що лише ресурси з областю дії простору імен відповідатимуть цьому правилу. "*" означає, що обмежень за областю немає. Субресурси відповідають області свого батьківського ресурсу. Стандартне значення — "*".
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"*"</code> означає, що включені всі області.</li>
        <li><code>"Cluster"</code> означає, що область обмежена ресурсами з областю кластера. Обʼєкти простору імен є ресурсами з областю кластера.</li>
        <li><code>"Namespaced"</code> означає, що область обмежена ресурсами з областю простору імен.</li>
      </ul></td>
    </tr>
  </tbody>
</table>
