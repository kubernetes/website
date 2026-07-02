---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "PolicyRule"
content_type: "api_reference"
description: "PolicyRule містить інформацію, яка описує правило політики, але не містить інформації про те, до кого застосовується правило або до якого простору імен застосовується правило."
title: "PolicyRule"
weight: 370
auto_generated: false
---

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## PolicyRule {#PolicyRule}

PolicyRule містить інформацію, яка описує правило політики, але не містить інформації про те, до кого застосовується правило або до якого простору імен застосовується правило.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>APIGroups є назвою APIGroup, яка містить ресурси. Якщо вказано кілька API груп, будь-яка дія, запитана для одного з перерахованих ресурсів у будь-якій API групі, буде дозволена. "" представляє основну API групу, а "*" представляє всі API групи.</td>
    </tr>
    <tr>
      <td><code>nonResourceURLs</code><br/><em>string array</em></td>
      <td>NonResourceURLs є набором часткових URL-адрес, до яких користувач повинен мати доступ. Дозволяються * як повний, кінцевий крок у шляху. Оскільки URL-адреси не є іменованими, це поле застосовується лише до ClusterRoles, на які посилаються ClusterRoleBinding. Правила можуть застосовуватися або до ресурсів API (наприклад, "pods" або "secrets"), або до шляхів URL-адрес, що не є ресурсами (наприклад, "/api"), але не до обох одночасно.</td>
    </tr>
    <tr>
      <td><code>resourceNames</code><br/><em>string array</em></td>
      <td>ResourceNames є необовʼязковим білим списком імен, до яких застосовується правило. Порожній набір означає, що все дозволено.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>Resources є списком ресурсів, до яких застосовується правило. '*' представляє всі ресурси.</td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>Verbs є списком дієслів, які застосовуються до всіх ResourceKinds, що містяться в цьому правилі. '*' представляє всі дієслова.</td>
    </tr>
  </tbody>
</table>
