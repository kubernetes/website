---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "FieldSelectorAttributes"
content_type: "api_reference"
description: |
  FieldSelectorAttributes вказує на обмежений доступ до поля. Розробникам вебхуків рекомендується:
    * переконатися, що rawSelector і requirements не встановлені одночасно
    * враховувати поле requirements, якщо воно встановлене
    * не намагатися аналізувати або враховувати поле rawSelector, якщо воно встановлене.

  Це робиться для уникнення ще одного CVE-2022-2880 (тобто змусити різні системи погодитися щодо точного способу аналізу запиту — це не те, що ми хочемо), див. https://www.oxeye.io/resources/golang-parameter-smuggling-attack для отримання додаткової інформації.

  Для точок доступу *SubjectAccessReview kube-apiserver:
    * Якщо rawSelector порожній і requirements порожні, запит не обмежений.
    * Якщо rawSelector присутній і requirements порожні, rawSelector буде проаналізований і обмежений, якщо аналіз успішний.
    * Якщо rawSelector порожній і requirements присутні, слід дотримуватися requirements
    * Якщо rawSelector присутній і requirements присутні, запит недійсний.
title: "FieldSelectorAttributes"
weight: 110
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## FieldSelectorAttributes {#FieldSelectorAttributes}

FieldSelectorAttributes вказує на обмежений доступ до поля. Розробникам вебхуків рекомендується:

* переконатися, що rawSelector і requirements не встановлені одночасно
* враховувати поле requirements, якщо воно встановлене
* не намагатися аналізувати або враховувати поле rawSelector, якщо воно встановлене.

Це робиться для уникнення ще одного CVE-2022-2880 (тобто змусити різні системи погодитися щодо точного способу аналізу запиту — це не те, що ми хочемо), див. <https://www.oxeye.io/resources/golang-parameter-smuggling-attack> для отримання додаткової інформації.

Для точок доступу *SubjectAccessReview kube-apiserver:

* Якщо rawSelector порожній і requirements порожні, запит не обмежений.
* Якщо rawSelector присутній і requirements порожні, rawSelector буде проаналізований і обмежений, якщо аналіз успішний.
* Якщо rawSelector порожній і requirements присутні, слід дотримуватися requirements
* Якщо rawSelector присутній і requirements присутні, запит недійсний.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>rawSelector</code><br/><em>string</em></td>
      <td>rawSelector є серіалізацією селектора полів, який буде включений у параметр запиту. Рекомендується ігнорувати rawSelector у реалізаціях вебхуків. *SubjectAccessReview kube-apiserver буде аналізувати rawSelector, якщо requirements відсутні.</td>
    </tr>
    <tr>
      <td><code>requirements</code><br/><em><a href="{{< ref "field-selector-requirement-v1-meta#FieldSelectorRequirement" >}}">FieldSelectorRequirement array</a></em></td>
      <td>requirements є опрацьованою інтерпретацією селектора полів. Всі вимоги повинні бути виконані, щоб екземпляр ресурсу відповідав селектору. Реалізації вебхуків повинні обробляти requirements, але як саме їх обробляти залежить від вебхука. Оскільки requirements можуть лише обмежувати запит, безпечно авторизувати як необмежений запит, якщо requirements не зрозумілі.</td>
    </tr>
  </tbody>
</table>
