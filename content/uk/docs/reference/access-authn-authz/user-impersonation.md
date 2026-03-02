---
title: Імперсонізація користувача
content_type: reference
weight: 50
---

<!-- overview -->

_Імперсонізація_ користувача — це метод, що дозволяє автентифікованим користувачам діяти від імені іншого користувача, групи або облікового запису служби через HTTP-заголовки.

<!-- body -->

Користувач може діяти від імені іншого користувача через заголовки імперсонізації. Це дозволяє вручну перевизначити інформацію про користувача, який виконує запит. Наприклад, адміністратор може використовувати цю функцію для налагодження політики авторизації, тимчасово видаючи себе за іншого користувача та перевіряючи, чи запит відхилено.

Запити на імперсонізацією спочатку автентифікуються як запити від імені запитувача, потім переключаються на інформацію для імперсонованої особи.

* Користувач робить API-запит зі своїми обліковими даними _та_ заголовками імперсонізації.
* API-сервер автентифікує користувача.
* API-сервер переконується, що автентифіковані користувачі мають права імперсонізації.
* Запит інформації про користувача замінюється значеннями імперсонізації.
* Запит обробляється, авторизація працює з імперсонованою інформацією про користувача.

Для здійснення запиту на імперсонізацію можна використовувати такі заголовки HTTP:

* `Impersonate-User`: Імʼя користувача, від імені якого потрібно діяти.
* `Impersonate-Uid`: Унікальний ідентифікатор, який представляє користувача, від імені якого потрібно виконувати дії. Опціонально. Вимагається "Impersonate-User". Kubernetes не накладає жодних вимог до формату цього рядка.
* `Impersonate-Group`: Імʼя групи, від імені якої потрібно діяти. Може бути надана кілька разів для встановлення кількох груп. Опціонально. Вимагається "Impersonate-User".
* `Impersonate-Extra-( extra name )`: Динамічний заголовок, що використовується для асоціації додаткових полів з користувачем. Опціонально. Вимагається "Impersonate-User". Для збереження послідовності, `( extra name )` має бути у нижньому регістрі, а будь-які символи, які не є [допустимими у заголовках HTTP](https://tools.ietf.org/html/rfc7230#section-3.2.6) мають бути закодовані у UTF8 та [процентно-кодовані](https://tools.ietf.org/html/rfc3986#section-2.1).

{{< note >}}
До версії 1.11.3 (та 1.10.7, 1.9.11), `( extra name )` міг містити лише символи, які були [допустимими в HTTP-заголовках](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}

{{< note >}}
`Impersonate-Uid` доступний лише у версіях 1.22.0 і вище.
{{< /note >}}

Приклад заголовків імперсонізації при імперсонуванні користувача з групами:

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

Приклад заголовків імперсонізації при імперсонуванні користувача з UID та додатковими полями:

```http
Impersonate-User: jane.doe@example.com
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
```

Для використання `kubectl` встановіть аргумент командного рядка `--as` для налаштування заголовка `Impersonate-User`, ви також можете встановити прапорець `--as-group` для налаштування заголовка `Impersonate-Group`，використовуйте прапорець `--as-uid` (1.23) для налаштування заголовка `Impersonate-Uid`, встановіть прапорець `--as-user-extra` (1.35) для налаштування заголовка `Impersonate-Extra-( extra name )`.

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

Встановіть прапорці `--as` і `--as-group`:

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

Для імперсонізації користувача, ідентифікатора користувача (UID), групи або додаткових полів, користувач, який виконує імперсонізацію, повинен мати можливість виконувати дію **impersonate** з типом атрибута, який імперсонується ("user", "group", "uid" і т.д.). Для кластерів, що використовують втулок авторизації RBAC, наступна роль ClusterRole охоплює правила, необхідні для налаштування заголовків імперсонізації користувачів і груп:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

Для імперсонізації, додаткові поля та імперсоновані UID належать до групи `apiGroup` "authentication.k8s.io". Додаткові поля оцінюються як субресурси ресурсу "userextras". Щоб дозволити користувачеві використовувати заголовки імперсонізації для додаткового поля `scopes` та для UID, користувачеві слід надати таку роль:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# Може встановлювати заголовок "Impersonate-Extra-scopes" та заголовок "Impersonate-Uid".
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

Значення заголовків імперсонізації також можна обмежити, обмеживши набір `resourceNames`, які ресурс може приймати.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Може імперсонувати користувача "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Може імперсонувати групи "developers" та "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Може імперсонувати додаткове поле "scopes" зі значеннями "view" і "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# Може імперсонувати UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
Імперсонізація користувача або групи дозволяє виконувати будь-яку дію від імені цього користувача або групи; з цієї причини імперсонізація не є обмеженою за простором імен. Якщо ви хочете дозволити імперсонізацію за допомогою Kubernetes RBAC, це вимагає використання ClusterRole та ClusterRoleBinding, а не Role та RoleBinding.

Надання імперсонізації через ServiceAccounts є обмеженою за простором імен, але імперсонований ServiceAccount може виконувати дії поза межами простору імен.
{{< /note >}}

## Обмежена імперсонізація {#constrained-impersonation}

{{< feature-state feature_gate_name="ConstrainedImpersonation" >}}

Дія **impersonate** не може бути обмежена. Вона або надає повну імперсонізацію, або взагалі не надає її. Після надання дозволу на імперсонізацію користувача, ви можете виконувати будь-яку дію, яку цей користувач може виконувати у всіх ресурсах і просторах імен.

З обмеженою імперсонізацією, імперсонатор може мати обмеження на дії від імені іншого користувача лише для певних дій на певних ресурсах, а не мати можливість виконувати всі дії, які може виконувати імперсонований користувач.

Ця функція вмикається шляхом використання [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/#ConstrainedImpersonation) `ConstrainedImpersonation`.

### Розуміння обмеженої імперсонізації {#understanding-constrained-impersonation}

Обмежена імперсонізація вимагає **два окремі дозволи**:

1. **Дозвіл на імперсонування конкретної особи** (користувач, UID, група, службовий обліковий запис або вузол)
2. **Дозвіл на виконання конкретних дій у певному масштабі під час імперсонування** (наприклад, лише `list` та `watch` подів у просторі імен `default`)

Це означає, що імперсонатор може бути обмежений виконанням дій від імені іншого користувача лише для певних операцій.

### Режими імперсонування {#impersonation-modes}

Обмежена імперсонізація визначає три окремі режими, кожен з яких має свій набір дій:

#### Режим user-info mode {#user-info-mode}

Використовуйте цей режим для виконання дій від імені звичайного користувача ( не службового облікового запису). Цей режим застосовується, коли значення заголовка `Impersonate-User`:

- **Не починається** з `system:serviceaccount:`
- **Не починається** з `system:node:`

**Дієслова:**

- `impersonate:user-info` — Дозвіл на імперсонування конкретного користувача, групи, UID або додаткового поля
- `impersonate-on:user-info:<verb>` — Дозвіл на виконання `<verb>` під час імперсонування загального користувача

#### Режим ServiceAccount {#serviceaccount-mode}

Виокристовуйте цей режим для виконання дій від імені ServiceAccounts.

**Дієслова:**
- `impersonate:serviceaccount` — Дозвіл на імперсонування конкретного службового облікового запису
- `impersonate-on:serviceaccount:<verb>` — Дозвіл на виконання `<verb>` під час імперсонування службового облікового запису

#### Режими arbitrary-node та associated-node {#arbitrary-node-and-associated-node-modes}

Використовуйте ці режими для імперсонування вузлів. Цей режим застосовується, коли значення заголовка `Impersonate-User` починається з `system:node:`.

**Дієслова:**

- `impersonate:arbitrary-node` — Дозвіл на імперсонування будь-якого вказаного вузла
- `impersonate:associated-node` — Дозвіл на імперсонування лише вузла, до якого привʼязаний імперсонатор
- `impersonate-on:arbitrary-node:<verb>` — Дозвіл на виконання `<verb>` під час імперсонування будь-якого вузла
- `impersonate-on:associated-node:<verb>` — Дозвіл на виконання `<verb>` під час імперсонування повʼязаного вузла

{{< note >}}
Дієслово `impersonate:associated-node` застосовується лише тоді, коли імперсонатор є службовим обліковим записом, привʼязаним до вузла, який він намагається імперсонувати. Це визначається шляхом перевірки, чи містить інформація про користувача службового облікового запису додаткове поле з ключем `authentication.kubernetes.io/node-name`, яке відповідає вузлу, що імперсонується.
{{< /note >}}

### Налаштування обмеженого імперсонування за допомогою RBAC {#configuring-constrained-impersonation-with-rbac}

Усі дозволи на обмежене імперсонування використовують групу API `authentication.k8s.io`. Ось як налаштувати різні режими.

#### Приклад: Імперсонація користувача для виконання певних дій {#example-impersonate-a-user-for-specific-actions}

Цей приклад показує, як дозволити службовому обліковому запису видавати себе за користувача з іменем  `jane.doe@example.com`, але тільки для `list` і `watch` подів у просторі імен `default`. Вам потрібні як `ClusterRoleBinding` для дозволу на ідентифікацію, так і `RoleBinding` для дозволу на дію

**Крок 1: Надайте дозвіл видавати себе за користувача**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-jane-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["users"]
  resourceNames: ["jane.doe@example.com"]
  verbs: ["impersonate:user-info"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-jane-identity
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-jane-identity
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

**Крок 2: Надайте дозвіл на виконання певних дій під час імперсонізації**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-list-watch-pods
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:user-info:list"
  - "impersonate-on:user-info:watch"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-list-watch-pods
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-list-watch-pods
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

Тепер службовий обліковий запис `my-controller` може видавати себе за `jane.doe@example.com`, щоб переглядати та спостерігати за подами в просторі імен `default`, але **не може** виконувати інші дії, такі як видалення подів або доступ до ресурсів в інших просторах імен.

#### Приклад: Імперсонація службового облікового запису {#example-impersonate-a-serviceaccount}

Щоб дозволити імперсонувати службовий обліковий запис з іменем `app-sa` у просторі імен `production` для створення та оновлення Deployment:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-app-sa
  namespace: default
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["serviceaccounts"]
  resourceNames: ["app-sa"]
  # Для службових облікових записів необхідно вказати простір імен у RoleBinding.
  verbs: ["impersonate:serviceaccount"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-manage-deployments
  namespace: production
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs:
  - "impersonate-on:serviceaccount:create"
  - "impersonate-on:serviceaccount:update"
  - "impersonate-on:serviceaccount:patch"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-app-sa
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-app-sa
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-manage-deployments
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-manage-deployments
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
```

#### Приклад: Імперсонація вузла {#example-impersonate-a-node}

Щоб дозволити службовому обліковому запису `node-impersonator` у просторі імен `default` імперсонувати вузол з іменем `mynode` для отримання та перегляду подів:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-node-sa
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["nodes"]
  resourceNames: ["mynode"]
  verbs: ["impersonate:arbitrary-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-list-pods
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs:
      - "impersonate-on:arbitrary-node:list"
      - "impersonate-on:arbitrary-node:get"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-node-sa
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-node-sa
subjects:
- kind: ServiceAccount
  name: node-impersonator
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-list-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-list-pods
subjects:
  - kind: ServiceAccount
    name: node-impersonator
    namespace: default
```

#### Приклад: Агент вузла, що видає себе за повʼязаний вузол {#example-node-agent-impersonating-the-associated-node}

Це типовий шаблон для агентів вузлів (таких як втулки CNI), яким потрібно читати поди на своєму вузлі, не маючи доступу до подів у всьому кластері.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-associated-node-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["nodes"]
  verbs: ["impersonate:associated-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-list-pods-on-node
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:associated-node:list"
  - "impersonate-on:associated-node:get"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-node
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-associated-node-identity
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-list-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-list-pods-on-node
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
```

Контролер отримає імʼя вузла за допомогою API downward:

```yaml
env:
- name: MY_NODE_NAME
  valueFrom:
    fieldRef:
      fieldPath: spec.nodeName
```

Потім налаштуйте kubeconfig для імперсонації:

```go
kubeConfig, _ := clientcmd.BuildConfigFromFlags("", "")
kubeConfig.Impersonate = rest.ImpersonationConfig{
    UserName: "system:node:" + os.Getenv("MY_NODE_NAME"),
}
```

### Використання обмеженої імперсонації {#using-constrained-impersonation}

З точки зору клієнта, використання обмеженої імперсонації ідентичне використанню традиційної імперсонації. Ви використовуєте ті самі заголовки імперсонації:

```http
Impersonate-User: jane.doe@example.com
```

Або з kubectl:

```bash
kubectl get pods -n default --as=jane.doe@example.com
```

Різниця полягає виключно в перевірках авторизації, що виконуються сервером API.

### Робота з дієсловом `impersonate` {#working-with-impersonate-verb}

- Якщо у вас є наявні правила RBAC, що використовують дієслово `impersonate`, вони продовжують функціонувати, коли функціональну можливість увімкнено.

- Коли надходить запит на імперсонацію, сервер API спочатку перевіряє дозволи на обмежену імперсонацію. Якщо ці перевірки не проходять, він переходить до перевірки дозволу `impersonate`.

## Аудит {#auditing}

Для кожного запиту на імперсонацію реєструється подія аудиту, щоб допомогти відстежувати, як використовується імперсонація.

Коли запит використовує обмежену імперсонацію, подія аудиту включає обʼєкт `authenticationMetadata` з полем `impersonationConstraint`, яке вказує, яке обмежене дієслово імперсонації було використано для авторизації запиту.

Приклад події аудиту:

```json
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "user": {
    "username": "system:serviceaccount:default:my-controller"
  },
  "impersonatedUser": {
    "username": "jane.doe@example.com"
  },
  "authenticationMetadata": {
    "impersonationConstraint": "impersonate:user-info"
  },
  "verb": "list",
  "objectRef": {
    "resource": "pods",
    "namespace": "default"
  }
}
```

Значення `impersonationConstraint` вказує, який режим був використаний (наприклад, `impersonate:user-info`, `impersonate:associated-node`). Конкретна дія (наприклад, `list`) може бути визначена з поля `verb` в аудиторській події.

## {{% heading "whatsnext" %}}

- Прочитайте про [авторизацію RBAC](/docs/reference/access-authn-authz/rbac/)
- Ознайомтеся з [автентифікацією Kubernetes](/docs/reference/access-authn-authz/authentication/)
