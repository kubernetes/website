---
title: Використання авторизації вузлів
content_type: concept
weight: 34
---

<!-- overview -->

Авторизація вузлів — це режим авторизації спеціального призначення, який спеціально авторизує запити API, зроблені kubeletʼами.

<!-- body -->

## Огляд {#overview}

Авторизатор вузлів дозволяє kubeletʼам виконувати операції з API. Це включає:

Операції читання:

* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims та persistent volumes, що стосуються Podʼів, привʼязаних до вузла kubeletʼа

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

kubeletʼи можуть читати лише власні обʼєкти Node і лише Podʼи, привʼязані до їхнього вузла.

Операції запису:

* вузли та статус вузлів (увімкніть втулок допуску `NodeRestriction`, щоб обмежити kubelet зміною лише власного вузла)
* Podʼи та статус Podʼів (увімкніть втулок допуску `NodeRestriction`, щоб обмежити kubelet зміною лише привʼязаних до нього Podʼів)
* події

Операції, повʼязані з авторизацією:

* доступ на читання/запис [API CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/) для початкового завантаження TLS
* можливість створювати TokenReview та SubjectAccessReview для делегованої автентифікації/авторизації

У майбутніх випусках авторизатор вузлів може додавати або видаляти дозволи, щоб забезпечити kubeletʼи мінімальним набором дозволів, необхідних для правильної роботи.

Для того, щоб бути авторизованими авторизатором вузлів, kubeletʼи повинні використовувати облікові дані, які ідентифікують їх як членів групи `system:nodes`, з іменем користувача `system:node:<nodeName>`. Цей формат групи та імені користувача відповідає ідентичності, створеній для кожного kubeletʼа в рамках [початкового завантаження TLS kubeletʼа](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).

Значення `<nodeName>` **має** точно відповідати імені вузла, як зареєстровано kubeletʼом. Типово це імʼя хоста, яке повертає `hostname`, або перевизначене за допомогою [параметра kubelet](/docs/reference/command-line-tools-reference/kubelet/) `--hostname-override`. Однак під час використання параметра kubelet `--cloud-provider` конкретне імʼя хоста може визначати постачальник хмарних послуг, ігноруючи локальний `hostname` та параметр `--hostname-override`. Докладніше про те, як kubelet визначає імʼя хоста, дивіться в [довіднику параметрів kubelet](/docs/reference/command-line-tools-reference/kubelet/).

Щоб увімкнути авторизатор вузлів, запустіть {{< glossary_tooltip text="API-сервер" term_id="kube-apiserver" >}} з прапорцем `--authorization-config`, що вказує на файл, який містить авторизатор `Node`; наприклад:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

Або запустіть {{< glossary_tooltip text="API-сервер" term_id="kube-apiserver" >}} з прапорцем `--authorization-mode`, встановленим на список, розділений комами, який включає `Node`; наприклад:

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

Щоб обмежити обʼєкти API, які можуть записувати kubeletʼи, увімкніть втулок допуску [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction), запустивши apiserver з `--enable-admission-plugins=...,NodeRestriction,...`.

## Обмеження аудиторії токена службового облікового запису {#service-account-token-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

Коли функціональну можливість [`ServiceAccountNodeAudienceRestriction`](/docs/reference/command-line-tools-reference/feature-gates/#ServiceAccountNodeAudienceRestriction) увімкнено і втулок допуску `NodeRestriction` активний, kubelet може запитувати токени службових облікових записів лише для аудиторій, які вже згадуються в Podʼах на цьому вузлі. Це запобігає отриманню токенів для довільних аудиторій у разі компрометації вузла.

Дозволені аудиторії визначаються зі специфікації Podʼа:

- Типова аудиторія API-сервера (порожня або налаштована аудиторія API-сервера).
- Аудиторії, встановлені в джерелах проєкційних томів токенів службових облікових записів.
- Аудиторії, налаштовані в `spec.tokenRequests` драйвера CSI для будь-якого драйвера CSI, що використовується Podʼом, незалежно від того, чи це вбудовані томи CSI, томи, підтримувані PersistentVolumeClaim, або ефемерні томи.

Це особливо актуально під час використання [токенів службових облікових записів для постачальників облікових даних образів](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls), де kubelet запитує токени з аудиторією, специфічною для реєстру, від імені Podʼів.

### Додавання додаткових аудиторій за допомогою RBAC {#allowing-additional-audiences}

Ви можете надати kubeletʼам дозвіл на запит токенів для аудиторій, які виходять за межі тих, що згадуються в специфікації Podʼа. Коли kubelet запитує токен з аудиторією, якої немає в специфікації Podʼа, втулок допуску NodeRestriction перевіряє, чи авторизований kubelet, виконуючи перевірку авторизації з такими атрибутами:

| Атрибут   | Значення |
| ---------- | ----- |
| Дієслово       | `request-serviceaccounts-token-audience` |
| Група API  | (порожній рядок, що означає основну групу API) |
| Ресурс   | Значення запитуваної аудиторії |
| Імʼя       | Імʼя службового облікового запису |
| Простір імен  | Простір імен службового облікового запису |

Ви можете використовувати стандартні правила RBAC для авторизації цих перевірок. Поле `resources` контролює, які аудиторії дозволені, а поле `resourceNames` контролює, до яких службових облікових записів застосовується правило.

Наприклад, щоб дозволити kubeletʼу запитувати аудиторію `my-registry-audience` для конкретного службового облікового запису:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-my-registry
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["my-service-account"]
```

Пропуск `resourceNames` дозволяє аудиторію для будь-якого службового облікового запису. Використання зірочки (`"*"`) для `resources` дозволяє будь-яку аудиторію:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-unrestricted
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["*"]  # будь-яка аудиторія
  # без resourceNames: будь-який службовий обліковий запис
```

Привʼяжіть ClusterRole до групи `system:nodes`, щоб застосувати її до всіх kubeletʼів:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-audience-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-audience-my-registry
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
```

{{< note >}}
Це обмеження є частиною втулка допуску NodeRestriction і застосовується лише до ідентичностей вузлів (kubeletʼів). Воно не обмежує, які аудиторії можуть запитувати інші клієнти API `TokenRequest`. Якщо вам потрібно обмежити інших клієнтів, розгляньте можливість використання [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
{{< /note >}}

## Міркування щодо міграції {#migration-considerations}

### Kubeletʼи поза групою `system:nodes` {#kubelets-outside-the-system-nodes-group}

Kubeletʼи, що перебувають поза групою `system:nodes`, не будуть авторизовані режимом авторизації `Node`, і їм потрібно буде продовжувати авторизацію через механізм, який їх наразі авторизує. Втулок допуску вузлів не буде обмежувати запити від цих kubeletʼів.

### Kubeletʼи з недиференційованими іменами користувачів {#kubelets-with-undifferentiated-usernames}

У деяких розгортаннях kubeletʼи мають облікові дані, що розміщують їх у групі `system:nodes`, але не ідентифікують конкретний вузол, з яким вони повʼязані, оскільки вони не мають імені користувача у форматі `system:node:...`. Ці kubeletʼи не будуть авторизовані режимом авторизації `Node`, і їм потрібно буде продовжувати авторизацію через механізм, який їх наразі авторизує.

Втулок допуску `NodeRestriction` буде ігнорувати запити від цих kubeletʼів, оскільки типова реалізація ідентифікатора вузла не вважатиме це ідентичністю вузла.
