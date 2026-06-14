---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "NamedRuleWithOperations"
content_type: "api_reference"
description: "NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames."
title: "NamedRuleWithOperations"
weight: 260
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## NamedRuleWithOperations {#NamedRuleWithOperations}

NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>масив рядків</em></td>
      <td>apiGroups — це API групи, до яких належать ресурси. '*' означає всі групи. Якщо присутній '*', довжина зрізу повинна бути одна. Обов'язково.</td>
    </tr>
    <tr>
      <td><code>apiVersions</code><br/><em>масив рядків</em></td>
      <td>apiVersions — це версії API, до яких належать ресурси. '*' означає всі версії. Якщо присутній '*', довжина зрізу повинна бути одна. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>operations</code><br/><em>масив рядків</em></td>
      <td>operations — це операції, які цікавлять вебхук допуску: CREATE, UPDATE, DELETE, CONNECT або '*' для всіх цих операцій та будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній '*', довжина зрізу повинна бути одна. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>resourceNames</code><br/><em>масив рядків</em></td>
      <td>resourceNames — це необов'язковий білий список імен, до яких застосовується правило. Порожній набір означає, що все дозволено.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>масив рядків</em></td>
      <td>resources — це список ресурсів, до яких застосовується правило. Наприклад: 'pods' означає pods. 'pods/log' означає субресурс log для pods. '*' означає всі ресурси, але не субресурси. 'pods/*' означає всі субресурси для pods. '*/scale' означає всі субресурси scale. '*/*' означає всі ресурси та їх субресурси. Якщо присутній символ заміни, правило валідації забезпечить, щоб ресурси не перекривалися. Залежно від обʼєкта, субресурси можуть бути заборонені. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>scope</code><br/><em>string</em></td>
      <td>scope визначає область застосування цього правила. Дійсні значення: "Cluster", "Namespaced" та "*". "Cluster" означає, що правило застосовується лише до ресурсів з областю дії кластера. Обʼєкти API простору імен мають область дії кластера. "Namespaced" означає, що правило застосовується лише до ресурсів з областю дії простору імен. "*" означає, що обмежень за областю дії немає. Субресурси відповідають області дії їх батьківського ресурсу. Стандартне значення: "*".
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"*"</code> означає, що включені всі області дії.</li>
        <li><code>"Cluster"</code> означає, що область дії обмежена обʼєктами з областю дії кластера. Обʼєкти простору імен мають область дії кластера.</li>
        <li><code>"Namespaced"</code> означає, що область дії обмежена обʼєктами з областю дії простору імен.</li>
      </ul>
    </td>
    </tr>
  </tbody>
</table>
