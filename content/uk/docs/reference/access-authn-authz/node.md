---
title: Використання авторизації вузлів
content_type: concept
weight: 34
---

<!-- overview -->

Авторизація вузлів — це режим авторизації спеціального призначення, який спеціально авторизує запити API, зроблені kubelet-ами.

<!-- body -->

## Огляд {#overview}

Авторизатор вузлів дозволяє kubelet-ам виконувати операції з API. Це включає:

Операції читання:

* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims та persistent volumes, що стосуються Podʼів, привʼязаних до вузла kubelet-а

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

Kubelets обмежені читанням власних обʼєктів Node і читанням тільки подів, привʼязаних до їхнього вузла.

Операції запису:

* вузли та статус вузлів (увімкніть втулок допуску `NodeRestriction`, щоб обмежити kubelet у зміні свого власного вузла)
* поди та статус подів (увімкніть втулок допуску `NodeRestriction`, щоб обмежити kubelet у зміні подів, привʼязаних до себе)
* події

Операції, повʼязані з авторизацією:

* доступ на читання/запис [API CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/) для TLS початкового запуску
* можливість створювати TokenReview та SubjectAccessReview для делегованої автентифікації/авторизації

У майбутніх випусках авторизатор вузлів може додавати або видаляти дозволи, щоб забезпечити kubelet-и мінімальним набором дозволів, необхідних для правильної роботи.

Для того, щоб бути авторизованими авторизатором вузлів, kubelet-и повинні використовувати облікові дані, які ідентифікують їх як членів групи `system:nodes`, з іменем користувача `system:node:<nodeName>`. Цей формат групи та імені користувача відповідає ідентичності, створеній для кожного kubelet-а в рамках [TLS початкового запуску kubelet-а](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).

Значення `<nodeName>` **має** точно відповідати імені вузла, як зареєстровано kubelet-ом. Стандартно це імʼя хосту, надане `hostname`, або замінене за допомогою [опції kubelet](/docs/reference/command-line-tools-reference/kubelet/) `--hostname-override`. Однак, при використанні опції kubelet `--cloud-provider`, конкретне імʼя хосту може бути визначено постачальником хмарних послуг, ігноруючи локальний `hostname` та опцію `--hostname-override`. Для деталей щодо визначення імені хосту kubelet-ом, дивіться [довідник з опцій kubelet](/docs/reference/command-line-tools-reference/kubelet/).

Щоб увімкнути авторизатор вузла, запустіть {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} з прапорцем `--authorization-config`, встановленим у файлі, який містить авторизатор `Node`; наприклад:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

Або запустіть {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} з прапорцем `--authorization-mode`, встановленим на список, розділений комами, який включає `Node`; наприклад:

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

Щоб обмежити обʼєкти API, які можуть писати kubelet-и, увімкніть [втулок допуску NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction) шляхом запуску apiserver з `--enable-admission-plugins=...,NodeRestriction,...`.

## Міркування щодо міграції {#migration-considerations}

### Kubelet-и поза групою `system:nodes` {#kubelets-outside-the-system-nodes-group}

Kubelet-и, що знаходяться поза групою `system:nodes`, не будуть авторизовані режимом авторизації `Node`, і їм потрібно буде продовжувати авторизацію через механізм, який їх наразі авторизує. Вутлок допуску вузлів не буде обмежувати запити від цих kubelet-ів.

### Kubelet-и з недиференційованими іменами користувачів {#kubelets-with-undifferentiated-usernames}

У деяких розгортаннях kubelet-и мають облікові дані, що розміщують їх у групі `system:nodes`, але не ідентифікують конкретний вузол, з яким вони повʼязані, оскільки вони не мають імені користувача у форматі `system:node:...`. Ці kubelet-и не будуть авторизовані режимом авторизації `Node`, і їм потрібно буде продовжувати авторизацію через механізм, який їх наразі авторизує.

Втулок допуску `NodeRestriction` буде ігнорувати запити від цих kubelet-ів, оскільки стандартна реалізація ідентифікатора вузла не вважатиме це ідентичністю вузла.
