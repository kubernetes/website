---
title: Використання RBAC авторизації
content_type: concept
aliases: [/rbac/]
weight: 33
---

<!-- overview -->
Контроль доступу на основі ролей (RBAC) — це метод регулювання доступу до компʼютерних або мережевих ресурсів на основі ролей окремих користувачів у вашій організації.

<!-- body -->

RBAC авторизація використовує групу API `rbac.authorization.k8s.io` {{< glossary_tooltip text="група API" term_id="api-group" >}} для прийняття рішень щодо авторизації, дозволяючи вам динамічно налаштовувати політики через Kubernetes API.

Щоб увімкнути RBAC, запустіть {{< glossary_tooltip text="API сервер" term_id="kube-apiserver" >}} з прапорцем `--authorization-config`, встановленим на список, розділений комами, що включає `RBAC`; наприклад:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: RBAC
  ...
```

Або, запустіть {{< glossary_tooltip text="API сервер" term_id="kube-apiserver" >}} з прапорцем `--authorization-mode` з переліком розділеним комами, що містить `RBAC`; наприклад:

```shell
kube-apiserver --authorization-mode=...,RBAC --other-options --more-options
```

## Обʼєкти API {#api-overview}

RBAC API визначає чотири типи обʼєктів Kubernetes: _Role_, _ClusterRole_, _RoleBinding_ та _ClusterRoleBinding_. Ви можете описувати або змінювати {{< glossary_tooltip text="обʼєкти" term_id="object" >}} RBAC за допомогою таких інструментів, як `kubectl`, так само як і будь-який інший обʼєкт Kubernetes.

{{< caution >}}
Ці обʼєкти за своєю конструкцією накладають обмеження на доступ. Якщо ви вносите зміни до кластера під час навчання, перегляньте розділ [запобігання підвищенню привілеїв та початкове налаштування](#privilege-escalation-prevention-and-bootstraping), щоб зрозуміти, як ці обмеження можуть завадити вам вносити деякі зміни.
{{< /caution >}}

### Role та ClusterRole {#role-and-clusterrole}

RBAC _Role_ або _ClusterRole_ містять правила, які представляють набір дозволів. Дозволи є виключно адитивними (немає правил "заборони").

Role завжди встановлює дозволи в межах певного {{< glossary_tooltip text="простору імен" term_id="namespace" >}}; коли ви створюєте Role, ви повинні вказати простір імен, до якого вона належить.

ClusterRole, на відміну, є ресурсом, який не належить до простору імен. Ресурси мають різні назви (Role і ClusterRole), оскільки обʼєкт Kubernetes завжди повинен бути або привʼязаним до простору імен, або не привʼязаним до простору імен; він не може бути одночасно і тим, і іншим.

ClusterRole мають кілька використань. Ви можете використовувати ClusterRole для:

1. визначення дозволів на ресурси, що належать до простору імен, і надання доступу в межах окремих просторів імен
1. визначення дозволів на ресурси, що належать до простору імен, і надання доступу до всіх просторів імен
1. визначення дозволів на ресурси, що належать до кластера

Якщо ви хочете визначити роль в межах простору імен, використовуйте Role; якщо ви хочете визначити роль для всього кластера, використовуйте ClusterRole.

#### Приклад Role {#role-example}

Ось приклад Role в просторі імен "default", яку можна використовувати для надання доступу на читання до {{< glossary_tooltip text="Podʼів" term_id="pod" >}}:

{{% code_sample file="access/simple-role.yaml" %}}

#### Приклад ClusterRole {#clusterrole-example}

ClusterRole може бути використана для надання тих самих дозволів, що й Role. Оскільки ClusterRole стосуються всього кластера, ви також можете використовувати їх для надання доступу до:

* ресурсів, що належать до кластера (наприклад, {{< glossary_tooltip text="вузли" term_id="node" >}})
* точок доступу, що не є ресурсами (наприклад, `/healthz`)
* ресурсів, що належать до простору імен (наприклад, контейнерів), в усіх просторах імен

  Наприклад: ви можете використовувати ClusterRole для дозволу конкретному користувачу виконувати `kubectl get pods --all-namespaces`.

Ось приклад ClusterRole, яку можна використовувати для надання доступу на читання {{< glossary_tooltip text="Secretʼів" term_id="secret" >}} в будь-якому просторі імен або в усіх просторах імен (залежно від того, як вона [звʼязана](#rolebinding-and-clusterrolebinding)):

{{% code_sample file="access/simple-clusterrole.yaml" %}}

Назва обʼєкта Role або ClusterRole повинна бути дійсною [назвою сегмента шляху](/docs/concepts/overview/working-with-objects/names#path-segment-names).

### RoleBinding та ClusterRoleBinding {#rolebinding-and-clusterrolebinding}

RoleBinding надає дозволи, визначені в ролі, користувачу або групі користувачів та містить список _субʼєктів_ (користувачів, груп або облікових записів сервісів) і посилання на роль, що надається. RoleBinding надає дозволи в межах конкретного простору імен, тоді як ClusterRoleBinding надає доступ на рівні всього кластера.

RoleBinding може посилатися на будь-яку Role в тому ж просторі імен. Альтернативно, RoleBinding може посилатися на ClusterRole і звʼязувати цю ClusterRole з простором імен RoleBinding. Якщо ви хочете звʼязати ClusterRole з усіма просторами імен у вашому кластері, використовуйте ClusterRoleBinding.

Назва обʼєкта RoleBinding або ClusterRoleBinding повинна бути дійсною [назвою сегмента шляху](/docs/concepts/overview/working-with-objects/names#path-segment-names).

#### Приклади RoleBinding {#rolebinding-example}

Ось приклад RoleBinding, який надає роль "pod-reader" користувачу "jane" в межах простору імен "default". Це дозволяє "jane" читати Podʼи в просторі імен "default".

{{% code_sample file="access/simple-rolebinding-with-role.yaml" %}}

RoleBinding також може посилатися на ClusterRole для надання дозволів, визначених у цій ClusterRole, на ресурси в межах простору імен RoleBinding. Такий вид посилання дозволяє визначати набір загальних ролей для всього вашого кластера, а потім використовувати їх у декількох просторах імен.

Наприклад, хоча наступний RoleBinding посилається на ClusterRole, "dave" (субʼєкт, чутливий до регістру) зможе читати Secretʼи лише в просторі імен "development", оскільки простір імен RoleBinding (у його метаданих) — "development".

{{% code_sample file="access/simple-rolebinding-with-clusterrole.yaml" %}}

#### Приклад ClusterRoleBinding {#clusterrolebinding-example}

Щоб надати дозволи на рівні всього кластера, ви можете використовувати ClusterRoleBinding. Наступний ClusterRoleBinding дозволяє будь-якому користувачу з групи "manager" читати Secretʼи в будь-якому просторі імен.

{{% code_sample file="access/simple-clusterrolebinding.yaml" %}}

Після створення звʼязування ви не можете змінити Role або ClusterRole, на які вони посилаються. Якщо ви спробуєте змінити `roleRef` звʼязування, ви отримаєте помилку валідації. Якщо ви дійсно хочете змінити `roleRef` для звʼязування, вам потрібно видалити обʼєкт звʼязування і створити новий.

Існує дві причини для цього обмеження:

1. Роблячи `roleRef` незмінним, можна надати комусь дозвіл `update` на наявний обʼєкт звʼязування, щоб він міг керувати списком субʼєктів, без можливості змінити роль, яка надається цим субʼєктам.
1. Звʼязування з іншою роллю є принципово іншим звʼязуванням. Вимога видалення/створення нового звʼязування для зміни `roleRef` гарантує, що весь список субʼєктів у звʼязуванні має намір отримати нову роль (на відміну від можливості випадково змінити лише roleRef без перевірки того, чи всі наявні субʼєкти повинні отримати дозволи нової ролі).

Команда `kubectl auth reconcile` створює або оновлює файл маніфесту, що містить обʼєкти RBAC, і обробляє видалення та відновлення обʼєктів звʼязування, якщо необхідно змінити роль, на яку вони посилаються. Дивіться [використання команд та приклади](#kubectl-auth-reconcile) для отримання додаткової інформації.

### Посилання на ресурси {#referring-to-resources}

У Kubernetes API більшість ресурсів представлені та доступні за допомогою рядкового представлення їхнього імені обʼєкта, наприклад, `pods` для Pod. RBAC посилається на ресурси, використовуючи точно таку ж назву, яка зʼявляється в URL для відповідної точки доступу API. Деякі Kubernetes API включають _субресурс_, такий як логи для Pod. Запит на логи Pod виглядає так:

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

У цьому випадку `pods` є ресурсом простору імен для Pod, а `log` є субресурсом `pods`. Щоб представити це в ролі RBAC, використовуйте слеш (`/`) для розділення ресурсу та субресурсу. Щоб дозволити субʼєкту читати `pods` і також отримувати доступ до субресурсу `log` для кожного з цих Pod, напишіть:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

Ви також можете посилатися на ресурси за назвою для певних запитів через список `resourceNames`. Коли зазначено, запити можуть бути обмежені окремими екземплярами ресурсу. Ось приклад, що обмежує субʼєкт лише до `get` або `update` {{< glossary_tooltip term_id="ConfigMap" >}} з назвою `my-configmap`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів ConfigMap є "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
Ви не можете обмежити запити **deletecollection** або **create** верхнього рівня за назвою ресурсу. Для **create** це обмеження виникає через те, що назва нового обʼєкта може бути невідомою на момент авторизації. Однак обмеження **create** застосовується тільки до ресурсів верхнього рівня, а не до субресурсів. Наприклад, ви можете використовувати поле `resourceNames` з `pods/exec`. Якщо ви обмежуєте **list** або **watch** за `resourceName`, клієнти повинні включати селектор поля `metadata.name` у свої запити **list** або **watch**, що відповідає зазначеному `resourceName`, щоб отримати авторизацію. Наприклад, `kubectl get configmaps --field-selector=metadata.name=my-configmap`
{{< /note >}}

Замість того, щоб посилатися на окремі `resources`, `apiGroups` і `verbs`, ви можете використовувати символ підстановки `*`, щоб посилатися на всі такі обʼєкти. Для `nonResourceURLs` ви можете використовувати символ підстановки `*` як суфікс для глобального збігу. Для `resourceNames` порожній набір означає, що все дозволено. Ось приклад, що дозволяє виконувати будь-яку поточну і майбутню дію для всіх поточних та майбутніх ресурсів в API групі `example.com`. Це схоже на вбудовану роль `cluster-admin`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: example.com-superuser # НЕ ВИКОРИСТОВУЙТЕ ЦЮ РОЛЬ, ЦЕ ЛИШЕ ПРИКЛАД
rules:
- apiGroups: ["example.com"]
  resources: ["*"]
  verbs: ["*"]
```

{{< caution >}}
Використання символів підстановки в записах ресурсів і дій може призвести до надмірно широкого доступу до чутливих ресурсів. Наприклад, якщо додано новий тип ресурсу або новий субресурс, або перевірено нову спеціальну дію, запис символу підстановки автоматично надає доступ, що може бути небажаним. Слід застосовувати [принцип мінімальних привілеїв](/docs/concepts/security/rbac-good-practices/#least-privilege), використовуючи конкретні ресурси та дії, щоб забезпечити лише ті дозволи, які необхідні для правильного функціонування робочого навантаження.
{{< /caution >}}

### Агреговані ClusterRole {#aggregated-clusterroles}

Ви можете _агрегувати_ декілька ClusterRole в одну комбіновану ClusterRole. Контролер, який працює як частина панелі управління кластера, слідкує за обʼєктами ClusterRole з встановленим `aggregationRule`. `aggregationRule` визначає мітку {{< glossary_tooltip text="селектора" term_id="selector" >}}, яку використовує контролер для вибору інших обʼєктів ClusterRole, що мають бути обʼєднані у поле `rules` цього обʼєкта.

{{< caution >}}
Панель управління перезаписує будь-які значення, які ви вручну вказуєте в полі `rules` агрегованої ClusterRole. Якщо ви хочете змінити або додати правила, робіть це в обʼєктах `ClusterRole`, вибраних за допомогою `aggregationRule`.
{{< /caution >}}

Ось приклад агрегованої ClusterRole:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # Панель управління автоматично заповнює правила
```

Якщо ви створюєте нову ClusterRole, що відповідає селектору міток поточної агрегованої ClusterRole, це зміна ініціює додавання нових правил до агрегованої ClusterRole. Ось приклад, що додає правила до ClusterRole "monitoring" шляхом створення іншої ClusterRole з міткою `rbac.example.com/aggregate-to-monitoring: true`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpointslices
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# При створенні ClusterRole "monitoring-endpointslices",
# правила нижче будуть додані до ClusterRole "monitoring".
rules:
- apiGroups: [""]
  resources: ["services", "pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["discovery.k8s.io"]
  resources: ["endpointslices"]
  verbs: ["get", "list", "watch"]
```

[Стандартні ролі для користувачів](#default-roles-and-role-bindings) використовують агрегацію ClusterRole. Це дозволяє вам, як адміністратору кластера, включати правила для спеціальних ресурсів, таких як ті, що надаються {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} або агрегованими API серверами, щоб розширити стандартні ролі.

Наприклад: наступні ClusterRole дозволяють стандартним ролям "admin" і "edit" керувати спеціальним ресурсом з назвою CronTab, тоді як роль "view" може виконувати лише читання ресурсів CronTab. Ви можете припустити, що обʼєкти CronTab називаються `"crontabs"` в URL, як це бачить API сервер.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Додайте ці дозволи до стандартних ролей "admin" і "edit".
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Додайте ці дозволи до стандартної ролі "view".
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### Приклади ролей {#role-examples}

Наступні приклади є фрагментами обʼєктів Role або ClusterRole, що показують лише секцію `rules`.

Дозволити читання ресурсів `"pods"` у базовій {{< glossary_tooltip text="API Group" term_id="api-group" >}}:

```yaml
rules:
- apiGroups: [""]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів Pod
  # є "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Дозволити читання/запис обʼєктів Deployment (на рівні HTTP: обʼєкти з `"deployments"` у частині ресурсу їх URL) в групах API `"apps"`:

```yaml
rules:
- apiGroups: ["apps"]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів Deployment
  # є "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Дозволити читання Podʼів у базовій групі API, а також читання або запис ресурсів Job у групі API `"batch"`:

```yaml
rules:
- apiGroups: [""]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів Pod
  # є "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch"]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів Job
  # є "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Дозволити читання ConfigMap з назвою "my-config" (повинно бути повʼязано з RoleBinding, щоб обмежити до одного ConfigMap в одному просторі імен):

```yaml
rules:
- apiGroups: [""]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів ConfigMap
  # є "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

Дозволити читання ресурсу `"nodes"` у базовій групі (оскільки Node є кластерним ресурсом, це повинно бути у ClusterRole, повʼязаної з ClusterRoleBinding, щоб бути ефективним):

```yaml
rules:
- apiGroups: [""]
  #
  # на рівні HTTP, назва ресурсу для доступу до обʼєктів Node
  # є "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

Дозволити GET і POST запити до не-ресурсної точки доступу `/healthz` та всіх субшляхів (повинно бути в ClusterRole, повʼязаній з ClusterRoleBinding, щоб бути ефективним):

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' у nonResourceURL є суфіксом для глобального збігу
  verbs: ["get", "post"]
```

### Посилання на субʼєктів {#referring-to-subjects}

RoleBinding або ClusterRoleBinding привʼязує роль до субʼєктів. Субʼєктами можуть бути групи, користувачі або {{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}.

Kubernetes представляє імена користувачів у вигляді рядків. Це можуть бути: звичайні імена, такі як "alice"; імена в стилі електронної пошти, як "bob@example.com"; або числові ідентифікатори користувачів, представлені у вигляді рядків. Вам, як адміністратору кластера, належить налаштувати [модулі автентифікації](/docs/reference/access-authn-authz/authentication/), щоб автентифікація генерувала імена користувачів у бажаному форматі.

{{< caution >}}
Префікс `system:` зарезервований для використання системою Kubernetes, тому переконайтеся, що випадково не маєте користувачів або груп з іменами, що починаються з `system:`. Окрім цього спеціального префікса, система авторизації RBAC не вимагає жодного формату для імен користувачів.
{{< /caution >}}

У Kubernetes модулі Автентифікатора надають інформацію про групи. Групи, як і користувачі, представлені у вигляді рядків, і цей рядок не має жодних вимог до формату, крім того, що префікс `system:` зарезервований.

[ServiceAccounts](/docs/tasks/configure-pod-container/configure-service-account/) мають імена з префіксом `system:serviceaccount:`, і належать до груп, що мають імена з префіксом `system:serviceaccounts:`.

{{< note >}}

* `system:serviceaccount:` (однина) є префіксом для імен користувачів службових облікових записів.
* `system:serviceaccounts:` (множина) є префіксом для імен груп службових облікових записів.

{{< /note >}}

#### Приклади RoleBinding {#role-binding-examples}

Наступні приклади є фрагментами `RoleBinding`, що показують лише секцію `subjects`.

Для користувача з імʼям `alice@example.com`:

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

Для групи з імʼям `frontend-admins`:

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

Для стандартного службового облікового запису у просторі імен "kube-system":

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

Для всіх службових облікових записів у просторі імен "qa":

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

Для всіх службових облікових записів у будь-якому просторі імен:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

Для всіх автентифікованих користувачів:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

Для всіх неавтентифікованих користувачів:

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

Для всіх користувачів:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## Стандартні ролі та привʼязки ролей {#default-roles-and-role-bindings}

API-сервери створюють набір стандартних обʼєктів ClusterRole і ClusterRoleBinding. Багато з них мають префікс `system:`, що вказує на те, що ресурс безпосередньо керується панеллю управління кластера. Усі стандартні ролі та привʼязки ролей мають мітку `kubernetes.io/bootstrapping=rbac-defaults`.

{{< caution >}}
Будьте обережні при зміні ClusterRole і ClusterRoleBinding з іменами, що мають префікс `system:`. Зміни цих ресурсів можуть призвести до несправних кластерів.
{{< /caution >}}

### Автоматичне узгодження {#auto-reconciliation}

При кожному запуску API-сервер оновлює стандартні ролі кластера, додаючи будь-які відсутні дозволи, та оновлює стандартні привʼязки ролей, додаючи будь-які відсутні субʼєкти. Це дозволяє кластеру виправляти випадкові зміни та допомагає підтримувати ролі та привʼязки ролей в актуальному стані, оскільки дозволи та субʼєкти змінюються у нових випусках Kubernetes.

Щоб відмовитися від цього узгодження, встановіть анотацію `rbac.authorization.kubernetes.io/autoupdate` на стандартній кластерній ролі або стандартній RoleBinding у значення `false`. Зверніть увагу, що відсутність стандартних дозволів та субʼєктів може призвести до несправних кластерів.

Автоматичне узгодження стандартно увімкнено, якщо авторизатор RBAC активний.

### Ролі виявлення API {#discovery-roles}

Стандартні кластерні привʼязки ролей дозволяють неавторизованим і авторизованим користувачам читати інформацію про API, яка вважається безпечною для публічного доступу (включаючи CustomResourceDefinitions). Щоб вимкнути анонімний неавторизований доступ, додайте прапорець `--anonymous-auth=false` до конфігурації API-сервера.

Щоб переглянути конфігурацію цих ролей через `kubectl`, запустіть:

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
Якщо ви зміните цю ClusterRole, ваші зміни будуть перезаписані при перезапуску API-сервера через [Автоматичне узгодження](#auto-reconciliation). Щоб уникнути цього перезапису, або не редагуйте роль вручну, або вимкніть Автоматичне узгодження.
{{< /note >}}

<table>
<caption>Ролі виявлення API Kubernetes RBAC</caption>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>Стандартна ClusterRole</th>
<th>Стандартна ClusterRoleBinding</th>
<th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:basic-user</b></td>
<td>Група <b>system:authenticated</b></td>
<td>Дозволяє користувачеві доступ лише для читання базової інформації про себе. До v1.14 ця роль також була стандартно повʼязана з <tt>system:unauthenticated</tt>.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td>Група <b>system:authenticated</b></td>
<td>Дозволяє доступ лише для читання точок доступу виявлення API, необхідних для виявлення та узгодження рівня API. До v1.14 ця роль також була стандартно повʼязана з <tt>system:unauthenticated</tt>.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td>Групи <b>system:authenticated</b> і <b>system:unauthenticated</b></td>
<td>Дозволяє доступ лише для читання несекретної інформації про кластер. Представлено у Kubernetes v1.14.</td>
</tr>
</tbody>
</table>

### Ролі для користувачів {#user-facing-roles}

Деякі зі стандартних ClusterRoles не мають префікса `system:`. Вони включають ролі суперкористувача (`cluster-admin`), ролі, призначені для надання у всьому кластері за допомогою ClusterRoleBindings, а також ролі, призначені для надання у певних просторах імен простору імен за допомогою RoleBindings (`admin`, `edit`, `view`).

Ролі для користувачів використовують [агрегацію ClusterRole](#aggregated-clusterroles), щоб дозволити адміністраторам включати правила для спеціальних ресурсів у ці ClusterRole. Щоб додати правила до ролей `admin`, `edit` або `view`, створіть ClusterRole з однією або кількома з наступних міток:

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>Стандартна ClusterRole</th>
<th>Стандартна ClusterRoleBinding</th>
<th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>cluster-admin</b></td>
<td>Група <b>system:masters</b></td>
<td>Дозволяє доступ суперкористувача для виконання будь-якої дії на будь-якому ресурсі. При використанні в <b>ClusterRoleBinding</b>, надає повний контроль над кожним ресурсом у кластері та у всіх просторах імен. При використанні в <b>RoleBinding</b>, надає повний контроль над кожним ресурсом у просторі імен, включаючи сам простір імен.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>Немає</td>
<td>Дозволяє доступ адміністратора, призначений для надання в межах простору імен за допомогою <b>RoleBinding</b>.

Якщо використовується в <b>RoleBinding</b>, дозволяє доступ для читання/запису до більшості ресурсів у просторі імен, включаючи можливість створювати ролі та привʼязки ролей у просторі імен. Ця роль не дозволяє доступу для запису до квоти ресурсів або до самого простору імен. Ця роль також не дозволяє доступу для запису до EndpointSlices у кластерах, створених за допомогою Kubernetes v1.22+. Більше інформації доступно у розділі
["Достпу на запису у EndpointSlices"](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>Немає</td>
<td>Дозволяє доступ для читання/запису до більшості обʼєктів у просторі імен.

Ця роль не дозволяє переглядати або змінювати ролі або привʼязки ролей. Однак ця роль дозволяє доступ до Secretʼів і запуску Podʼів як будь-який ServiceAccount у просторі імен, тому вона може бути використана для отримання рівня доступу API будь-якого ServiceAccount у просторі імен. Ця роль також не дозволяє доступу для запису до EndpointSlices у кластерах, створених за допомогою Kubernetes v1.22+. Більше інформації доступно у розділі ["Достпу на запису у EndpointSlices"](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>view</b></td>
<td>Немає</td>
<td>Дозволяє доступ лише для читання до більшості обʼєктів у просторі імен. Ця роль не дозволяє переглядати ролі або привʼязки ролей. Ця роль не дозволяє переглядати Secretʼи, оскільки читання вмісту секретів дозволяє доступ до облікових даних ServiceAccount у просторі імен, що дозволило б доступ до API як будь-який ServiceAccount у просторі імен (форма ескалації привілеїв).</td>
</tr>
</tbody>
</table>

### Ролі основних компонентів {#core-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>Стандартна ClusterRole</th>
<th>Стандартна ClusterRoleBinding</th>
<th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> користувач</td>
<td>Дозволяє доступ до ресурсів, необхідних компоненту {{< glossary_tooltip term_id="kube-scheduler" text="планувальника" >}}.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> користувач</td>
<td>Дозволяє доступ до ресурсів обʼєму, необхідних компоненту kube-scheduler.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> користувач</td>
<td>Дозволяє доступ до ресурсів, необхідних компоненту {{< glossary_tooltip term_id="kube-controller-manager" text="менеджера контролерів" >}}. Дозволи, необхідні окремим контролерам, детально описані в <a href="#controller-roles">ролях контролерів</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>Немає</td>
<td>Дозволяє доступ до ресурсів, необхідних для kubelet, <b>включаючи доступ на читання до всіх секретів та доступ на запис до всіх обʼєктів стану Podʼів</b>.

Ви повинні використовувати <a href="/uk/docs/reference/access-authn-authz/node/">Node authorizer</a> та <a href="/uk/docs/reference/access-authn-authz/admission-controllers/#noderestriction">втулок допуску NodeRestriction</a> замість ролі <tt>system:node</tt> та дозволяти надання доступу до API для kubelet на основі Podʼів, які заплановано для запуску на них.

Роль <tt>system:node</tt> існує лише для сумісності з кластерами Kubernetes, оновленими з версій до v1.8.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> користувач</td>
<td>Дозволяє доступ до ресурсів, необхідних компоненту {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}.</td>
</tr>
</tbody>
</table>

### Ролі інших компонентів {#other-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>Стандартна ClusterRole</th>
<th>Стандартна ClusterRoleBinding</th>
<th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:auth-delegator</b></td>
<td>Немає</td>
<td>Дозволяє делеговані перевірки автентифікації та авторизації. Це зазвичай використовується серверами надбудов API для уніфікованої автентифікації та авторизації.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>Немає</td>
<td>Роль для компонента <a href="https://github.com/kubernetes/heapster">Heapster</a> (застарілий).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>Немає</td>
<td>Роль для компонента <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a>.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> службовий обліковий запис у просторі імен <b>kube-system</b></td>
<td>Роль для компонента <a href="/uk/docs/concepts/services-networking/dns-pod-service/">kube-dns</a>.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>Немає</td>
<td>Дозволяє повний доступ до API kubelet.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>Немає</td>
<td>Дозволяє доступ до ресурсів, необхідних для виконання <a href="/uk/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">початкового завантаження kubelet TLS</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>Немає</td>
<td>Роль для компонента <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a>.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>Немає</td>
<td>Дозволяє доступ до ресурсів, необхідних для більшості <a href="/uk/docs/concepts/storage/persistent-volumes/#dynamic">динамічних провізорів томів</a>.</td>
</tr>
<tr>
<td><b>system:monitoring</b></td>
<td><b>system:monitoring</b> група</td>
<td>Дозволяє доступ на читання до точок доступу моніторингу панелі управління (тобто точок доступу перевірки придатності та готовності {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} (<tt>/healthz</tt>, <tt>/livez</tt>, <tt>/readyz</tt>), індивідуальних точок доступу перевірки стану (<tt>/healthz/*</tt>, <tt>/livez/*</tt>, <tt>/readyz/*</tt>), <tt>/metrics</tt>), і змушує kube-apiserver враховувати заголовок traceparent, що надається разом із запитами для відстеження. Зверніть увагу, що індивідуальні точки доступу перевірки стану та точка доступу метрик можуть розкривати конфіденційну інформацію.</td>
</tr>
</tbody>
</table>

### Ролі для вбудованих контролерів {#controller-roles}

{{< glossary_tooltip term_id="kube-controller-manager" text="Менеджер контролерів" >}} Kubernetes запускає {{< glossary_tooltip term_id="controller" text="контролери" >}}, які вбудовані в панель управління Kubernetes. Коли його викликають з `--use-service-account-credentials`, kube-controller-manager запускає кожен контролер використовуючи окремий службовий обліковий запис. Для кожного вбудованого контролера існують відповідні ролі з префіксом `system:controller:`. Якщо менеджер контролерів не запускається з `--use-service-account-credentials`, він виконує всі контрольні цикли використовуючи власні облікові дані, які повинні мати всі відповідні ролі. Ці ролі включають:

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

## Запобігання ескалації привілеїв і початкове налаштування {#privilege-escalation-prevention-and-bootstraping}

API RBAC запобігає ескалації привілеїв користувачами шляхом редагування ролей або привʼязок ролей. Оскільки це реалізується на рівні API, це застосовується навіть коли авторизатор RBAC не використовується.

### Обмеження на створення або оновлення ролей {#restrictions-on-role-creation-or-update}

Ви можете створити/оновити роль, тільки якщо виконується хоча б одна з наступних умов:

1. Ви вже маєте всі дозволи, що містяться в ролі, в тій же області, що й обʼєкт, який модифікується (кластерний рівень для ClusterRole, у тому ж просторі імен або кластерний рівень для Role).
2. Вам надано явний дозвіл виконувати дієслово `escalate` для ресурсу `roles` або `clusterroles` в групі API `rbac.authorization.k8s.io`.

Наприклад, якщо `user-1` не має можливості отриамння переліку Secrets на кластерному рівні, він не може створити ClusterRole, що містить цей дозвіл. Щоб дозволити користувачу створювати/оновлювати ролі:

1. Надайте йому роль, що дозволяє створювати/оновлювати обʼєкти Role або ClusterRole, те що треба.
2. Надати йому дозвіл включати конкретні дозволи в ролі, які він створює/оновлює:
   * неявно, надаючи йому ці дозволи (якщо він спробує створити або модифікувати Role або ClusterRole з дозволами, які йому самому не надані, запит до API буде заборонений)
   * або явно дозволити вказувати будь-які дозволи в `Role` або `ClusterRole`, надаючи йому дозвіл виконувати дієслово `escalate` для ресурсів `roles` або `clusterroles` в групі API `rbac.authorization.k8s.io`.

### Обмеження на створення або оновлення привʼязок ролей {#restrictions-on-role-binding-creation-or-update}

Ви можете створити/оновити привʼязку ролі, тільки якщо вже маєте всі дозволи, що містяться в згаданій ролі (в тій же області, що й привʼязка ролі) _або_ якщо вам надано дозвіл виконувати дієслово `bind` для згаданої ролі. Наприклад, якщо `user-1` не має можливості отримувати перелік Secrets на кластерному рівні, він не може створити ClusterRoleBinding для ролі, яка надає цей дозвіл. Щоб дозволити користувачу створювати/оновлювати привʼязки ролей:

1. Надати йому роль, що дозволяє створювати/оновлювати обʼєкти RoleBinding або  ClusterRoleBinding, як необхідно.
1. Надати йому дозволи, необхідні для привʼязки певної ролі:
   * неявно, надаючи йому дозволи, що м стяться в ролі.
   * явно, надаючи йому дозвіл виконувати дієслово `bind` для певної Role (або ClusterRole).

Наприклад, цей ClusterRole і RoleBinding дозволять `user-1` надавати іншим користувачам ролі  `admin`, `edit` і `view` у просторі імен `user-1-namespace`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  # пропустіть resourceNames, щоб дозволити привʼязку будь-якої ClusterRole
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

Коли початково налаштовуються перші ролі та привʼязки ролей, необхідно, щоб початковий користувач надав дозволи, які він ще не має. Щоб початково налаштувати ролі та привʼязки ролей:

* Використовуйте облікові дані з групою "system:masters", яка стандартно привʼязана до ролі суперкористувача "cluster-admin".

## Утиліти командного рядка {#command-line-utilities}

### `kubectl create role`

Створює обʼєкт Role, що визначає дозволи в межах одного простору імен. Приклади:

* Створити Role з назвою "pod-reader", яка дозволяє користувачам виконувати `get`, `watch` і `list` для pods:

  ```shell
  kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
  ```

* Створити Role з назвою "pod-reader" зі специфікованими resourceNames:

  ```shell
  kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

* Створити Role з назвою "foo" зі специфікованими apiGroups:

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
  ```

* Створити Role з назвою "foo" з дозволами на субресурси:

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
  ```

* Створити Role з назвою "my-component-lease-holder" з дозволами на отримання/оновлення ресурсу зі специфічною назвою:

  ```shell
  kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
  ```

### `kubectl create clusterrole`

Створює ClusterRole. Приклади:

* Створити ClusterRole з назвою "pod-reader", яка дозволяє користувачам виконувати `get`, `watch` і `list` для pods:

  ```shell
  kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
  ```

* Створити ClusterRole з назвою "pod-reader" зі специфікованими resourceNames:

  ```shell
  kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

* Створити ClusterRole з назвою "foo" зі специфікованими apiGroups:

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
  ```

* Створити ClusterRole з назвою "foo" з дозволами на субресурси:

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
  ```

* Створити ClusterRole з назвою "foo" зі специфікованими nonResourceURL:

  ```shell
  kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
  ```

* Створити ClusterRole з назвою "monitoring" зі специфікованим aggregationRule:

  ```shell
  kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
  ```

### `kubectl create rolebinding`

Надає Role або ClusterRole в межах певного простору імен. Приклади:

* В межах простору імен "acme" надати дозволи з ClusterRole "admin" користувачу з імʼям "bob":

  ```shell
  kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
  ```

* В межах простору імен "acme" надати дозволи з ClusterRole "view" службовому обліковому запису в просторі імен "acme" з імʼям "myapp":

  ```shell
  kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
  ```

* В межах простору імен "acme" надати дозволи з ClusterRole "view" службовому обліковому запису в просторі імен "myappnamespace" з імʼям "myapp":

  ```shell
  kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
  ```

### `kubectl create clusterrolebinding`

Надає ClusterRole в межах усього кластеру (всі простори імен). Приклади:

* В межах усього кластеру надати дозволи з ClusterRole "cluster-admin" користувачу з імʼям "root":

  ```shell
  kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
  ```

* В межах усього кластеру надати дозволи з ClusterRole "system:node-proxier" користувачу з імʼям "system:kube-proxy":

  ```shell
  kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
  ```

* В межах усього кластеру надати дозволи з ClusterRole "view" службовому обліковому запису з імʼям "myapp" у просторі імен "acme":

  ```shell
  kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
  ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Створює або оновлює обʼєкти API `rbac.authorization.k8s.io/v1` з файлу маніфесту.

Відсутні обʼєкти створюються, і простір імен для обʼєктів у просторі імен створюється за потреби.

Наявні ролі оновлюються, щоб включати дозволи з вхідних обʼєктів, і видаляти зайві дозволи, якщо вказано `--remove-extra-permissions`.

Наявні привʼязки оновлюються, щоб включати субʼєкти з вхідних обʼєктів, і видаляти зайві субʼєкти, якщо вказано `--remove-extra-subjects`.

Приклади:

* Тестове застосування файлу маніфесту обʼєктів RBAC, відображаючи зміни, які будуть зроблені:

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
  ```

* Застосування файлу маніфесту обʼєктів RBAC, збереження будь-яких зайвих дозволів (в ролях) і зайвих субʼєктів (в привʼязках):

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml
  ```

* Застосування файлу маніфесту обʼєктів RBAC, видалення будь-яких зайвих дозволів (в ролях) і зайвих субʼєктів (в привʼязках):

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
  ```

## Права доступу ServiceAccount {#service-account-permissions}

Типові політики RBAC надають обмежені права компонентам панелі управління, вузлам і контролерам, але не надають _жодних дозволів_ службовим обліковим записам за межами простору імен `kube-system` (поза межами дозволів, наданих [ролями виявлення API](#discovery-roles)).

Це дозволяє надавати конкретні ролі конкретним ServiceAccounts за необхідності. Тонке налаштування привʼязок ролей забезпечує більшу безпеку, але вимагає більше зусиль для адміністрування. Ширші привʼязки можуть надати зайвий (і потенційно ескалуючий) доступ до API ServiceAccounts, але їх легше адмініструвати.

Підходи від найбезпечніших до найменш безпечних:

1. Надання ролі для службового облікового запису для конкретного застосунку (найкращий варіант)

   Це вимагає від застосунку зазначення `serviceAccountName` в його специфікації Pod, і створення службового облікового запису (через API, маніфест програми, `kubectl create serviceaccount`, тощо).

   Наприклад, надати права лише на читання в межах "my-namespace" службовому обліковому запису "my-sa":

   ```shell
   kubectl create rolebinding my-sa-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:my-sa \
     --namespace=my-namespace
   ```

2. Надання ролі службовому обліковому запису "default"  в просторі імен

   Якщо програма не зазначає `serviceAccountName`, вона використовує службовий обліковий запис "default".

   {{< note >}}
   Дозволи, надані службовому обліковому запису "default", доступні будь-якому Pod в просторі імен, який не зазначає `serviceAccountName`.
   {{< /note >}}

   Наприклад, надати права лише на читання в межах "my-namespace" службовому обліковому запису "default":

   ```shell
   kubectl create rolebinding default-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:default \
     --namespace=my-namespace
   ```

   Багато [надбудов](/docs/concepts/cluster-administration/addons/) працюють від імені службового облікового запису "default" у просторі імен `kube-system`. Щоб дозволити цим надбудовам працювати з правами суперкористувача, надайте права cluster-admin службовому обліковому запису "default" у просторі імен `kube-system`.

   {{< caution >}}
   Включення цього означає, що в просторі імен `kube-system` знаходяться Secretʼи, які надають доступ суперкористувача до API вашого кластера.
   {{< /caution >}}

   ```shell
   kubectl create clusterrolebinding add-on-cluster-admin \
     --clusterrole=cluster-admin \
     --serviceaccount=kube-system:default
   ```

3. Надання ролі всім службовим обліковим записам у просторі імен

   Якщо ви хочете, щоб усі програми в просторі імен мали роль, незалежно від того, який службовий обліковий запис вони використовують, ви можете надати роль групі службових облікових записів для цього простору імен.

   Наприклад, надати права лише на читання в межах "my-namespace" усім службовим обліковим записам у цьому просторі імен:

   ```shell
   kubectl create rolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts:my-namespace \
     --namespace=my-namespace
   ```

4. Надання обмеженої ролі всім службовим обліковим записам у кластері (не рекомендується)

   Якщо ви не хочете керувати дозволами по кожному простору імен, ви можете надати кластерну роль усім службовим обліковим записам у кластері.

   Наприклад, надати права лише на читання в усіх просторах імен усім службовим обліковим записам у кластері:

   ```shell
   kubectl create clusterrolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts
   ```

5. Надання прав суперкористувача всім службовим обліковим записам у кластері (категорично не рекомендується)

   Якщо вам не важливо розподіляти дозволи взагалі, ви можете надати права суперкористувача всім службовим обліковим записам.

   {{< warning >}}
   Це надає будь-якому застосунку повний доступ до вашого кластера, а також надає будь-якому користувачеві з правами читання Secretʼів (або здатності створювати будь-які Pod) повний доступ до вашого кластера.
   {{< /warning >}}

   ```shell
   kubectl create clusterrolebinding serviceaccounts-cluster-admin \
     --clusterrole=cluster-admin \
     --group=system:serviceaccounts
   ```

## Права запису для EndpointSlices {#write-access-for-endpoints}

Кластери Kubernetes, створені до версії Kubernetes v1.22, включають права запису для EndpointSlices (і зараз визнаних застарілим Endpoints API) у ролях "edit" і "admin". У рамках помʼякшення наслідків [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675), цей доступ не є частиною агрегованих ролей у кластерах, створених із використанням Kubernetes v1.22 або пізніших версій.

Кластери, які були оновлені до Kubernetes v1.22, не підпадають під цю зміну. [Оголошення CVE](https://github.com/kubernetes/kubernetes/issues/103675) включає вказівки щодо обмеження цього доступу в поточних кластерах.

Якщо ви хочете, щоб нові кластери зберігали цей рівень доступу в агрегованих ролях, ви можете створити наступну ClusterRole:

{{% code_sample file="access/endpoints-aggregated.yaml" %}}

## Оновлення з ABAC {#upgrading-from-abac}

Кластери, що спочатку працювали на старіших версіях Kubernetes, часто використовували дозвільні політики ABAC, включаючи надання повного доступу до API всім службовим обліковим записам.

Типові політики RBAC надають обмежені права компонентам панелі управління, вузлам і контролерам, але не надають _жодних дозволів_ службовим обліковим записам за межами простору імен `kube-system` (поза межами дозволів, наданих [ролями виявлення API](#discovery-roles)).

Хоча це набагато безпечніше, це може бути руйнівним для поточних робочих навантажень, які очікують автоматичного отримання дозволів API. Ось два підходи для управління цим переходом:

### Паралельні авторизатори {#parallel-authorization}

Запускайте як RBAC, так і ABAC авторизатори, і вкажіть файл політики, що містить [стару політику ABAC](/docs/reference/access-authn-authz/abac/#policy-file-format):

```shell
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

Щоб детально пояснити цей перший параметр командного рядка: якщо раніші авторизатори, такі як Node, відхиляють запит, тоді авторизатор RBAC намагається авторизувати запит до API. Якщо RBAC також відхиляє цей запит до API, тоді запускається авторизатор ABAC. Це означає, що будь-який запит, дозволений _будь-якою_ політикою RBAC або ABAC, буде дозволений.

Коли kube-apiserver запускається з рівнем логування 5 або вище для компонента RBAC (`--vmodule=rbac*=5` або `--v=5`), ви можете побачити відмови RBAC у лозі сервера API (позначені як `RBAC`). Ви можете використовувати цю інформацію для визначення, які ролі потрібно надати яким користувачам, групам або службовим обліковим записам.

Після того, як ви [надали ролі службовим обліковим записам](#service-account-permissions) і робочі навантаження працюють без повідомлень про відмову RBAC у логах сервера, ви можете видалити авторизатор ABAC.

### Дозвільні права RBAC {#permissive-rbac-permissions}

Ви можете відтворити дозвільну політику ABAC, використовуючи привʼязки ролей RBAC.

{{< warning >}}
Наступна політика дозволяє **ВСІМ** службовим обліковим записам діяти як адміністратори кластера. Будь-який застосунок, що працює в контейнері, автоматично отримує облікові дані службового облікового запису і може виконувати будь-яку дію з API, включаючи перегляд секретів і зміну дозволів. Це не рекомендована політика.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```

{{< /warning >}}

Після переходу на використання RBAC, ви повинні налаштувати контроль доступу для вашого кластера, щоб забезпечити відповідність вашим інформаційним вимогам безпеки.
