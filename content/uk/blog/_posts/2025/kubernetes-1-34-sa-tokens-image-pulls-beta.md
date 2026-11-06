---
layout: blog
title: "Kubernetes v1.34: Інтеграція токенів ServiceAccount для завантаження образів контейнерів переходить у стадію бета"
date: 2025-09-03T10:30:00-08:00
slug: kubernetes-v1-34-sa-tokens-image-pulls-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Спільнота Kubernetes продовжує вдосконалювати найкращі практики безпеки, зменшуючи залежність від довготривалих облікових даних. Після успішного [випуску альфа-версії в Kubernetes v1.33](/blog/2025/05/07/kubernetes-v1-33-wi-for-image-pulls/), *Інтеграція токенів ServiceAccount для постачальників облікових даних Kubelet* перейшла на **бета-версію** в Kubernetes v1.34, що наблизило нас до усунення довготривалих секретів завантаження образів контейнерів із кластерів Kubernetes.

Це вдосконалення дозволяє постачальникам облікових даних використовувати токени ServiceAccount, специфічні для робочих навантажень, для отримання облікових даних реєстру, забезпечуючи безпечну ефемерну альтернативу традиційним секретам для завантаження образів.

## Що нового в бета-версії? {#what-s-new-in-beta}

Перехід у бета-версію приносить кілька важливих змін, які роблять цю можливість більш надійною та готовою до промислової експлуатації:

### Обовʼязкове поле `cacheType` {#required-cachetype-field}

**Зміна, що порушує сумісність з альфа-версією**: поле `cacheType` є **обовʼязковим** у конфігурації постачальника облікових даних під час використання токенів ServiceAccount. Це поле є новим у бета-версії і має бути вказане для забезпечення належного функціонування кешування.

```yaml
# УВАГА: це не повний приклад конфігурації, а лише посилання на поле 'tokenAttributes.cacheType'.
tokenAttributes:
  serviceAccountTokenAudience: "my-registry-audience"
  cacheType: "ServiceAccount"  # Required field in beta
  requireServiceAccount: true
```

Обирайте поміж двома стратегіями кешування:

- **`Token`**: Кешуйте облікові дані для кожного токена ServiceAccount (використовуйте, коли термін дії облікових даних повʼязаний із токеном). Це корисно, коли постачальник облікових даних перетворює токен ServiceAccount на облікові дані реєстру з таким же терміном дії, як і токен, або коли реєстри безпосередньо підтримують токени ServiceAccount Kubernetes. Примітка: Kubelet не може безпосередньо надсилати токени ServiceAccount до реєстрів; для перетворення токенів у формат імені користувача/пароля, очікуваний реєстрами, потрібні втулки постачальників облікових даних.
- **`ServiceAccount`**: Кешуйте облікові дані для кожної ідентичності ServiceAccount (використовуйте, коли облікові дані дійсні для всіх Podʼів, які використовують один і той же ServiceAccount)

### Ізольовані облікові дані для завантаження образів {#isolated-image-pull-credentials}

Бета-версія забезпечує сильнішу ізоляцію безпеки для образів контейнерів при використанні токенів ServiceAccount для завантаження образів. Вона гарантує, що Podʼи можуть отримувати доступ лише до образів, які були завантажені за допомогою ServiceAccount, до яких вони мають право доступу. Це запобігає несанкціонованому доступу до чутливих образів контейнерів і дозволяє здійснювати детальний контроль доступу, де різні робочі навантаження можуть мати різні дозволи реєстру на основі їх ServiceAccount.

Коли постачальники облікових даних використовують токени ServiceAccount, система відстежує ідентичність ServiceAccount (простір імен, імʼя та [UID](/docs/concepts/overview/working-with-objects/names/#uids)) для кожного завантаженого образу. Коли Pod намагається використовувати кешований образ, система перевіряє, що ServiceAccount Podʼа точно збігається з ServiceAccount, який був використаний для початкового завантаження образу.

Адміністратори можуть відкликати доступ до раніше завантажених образів, видаливши та створивши наново ServiceAccount, що змінює UID і робить недоступним кешований доступ до образів.

Для отримання додаткової інформації про цю можливість дивіться документацію [перевірки облікових даних для завантаження образів](/docs/concepts/containers/images/#ensureimagepullcredentialverification).

## Як це працює {#how-it-works}

### Конфігурація {#configuration}

Постачальники облікових даних вмикають використання токенів ServiceAccount, налаштовуючи поле `tokenAttributes`:

```yaml
#
# УВАГА: це лише приклад конфігурації.
#          Не використовуйте це для свого кластера!
#
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
providers:
- name: my-credential-provider
  matchImages:
  - "*.myregistry.io/*"
  defaultCacheDuration: "10m"
  apiVersion: credentialprovider.kubelet.k8s.io/v1
  tokenAttributes:
    serviceAccountTokenAudience: "my-registry-audience"
    cacheType: "ServiceAccount"  # New in beta
    requireServiceAccount: true
    requiredServiceAccountAnnotationKeys:
    - "myregistry.io/identity-id"
    optionalServiceAccountAnnotationKeys:
    - "myregistry.io/optional-annotation"
```

### Порядок отримання образів {#image-pull-flow}

На високому рівні, `kubelet` координує свою роботу з постачальником облікових даних та середовищем виконання контейнерів так:

- Коли образ відсутній локально:
  - `kubelet` перевіряє свій кеш облікових даних, використовуючи налаштований `cacheType` (`Token` або `ServiceAccount`)
  - Якщо потрібно, `kubelet` запитує токен ServiceAccount для ServiceAccount Podʼа і передає його, а також будь-які необхідні анотації, постачальнику облікових даних
  - Постачальник обмінює цей токен на облікові дані реєстру і повертає їх `kubelet`
  - `kubelet` кешує облікові дані відповідно до стратегії `cacheType` і завантажує образ з цими обліковими даними
  - `kubelet` записує координати ServiceAccount (простір імен, імʼя, UID) повʼязані з завантаженим образом для подальших перевірок авторизації

- Коли образ вже присутній локально:
  - `kubelet` перевіряє координати ServiceAccount Podʼа на відповідність координатам, записаним для кешованого образу
  - Якщо вони точно збігаються, можна використовувати кешований образ без завантаження з реєстру
  - Якщо вони відрізняються, `kubelet` виконує нове завантаження з використанням облікових даних для нового ServiceAccount

- З увімкненою перевіркою облікових даних для завантаження образів:
  - Авторизація виконується з використанням записаних координат ServiceAccount, що забезпечує використання Podʼами лише образів, завантажених за допомогою ServiceAccount, до яких вони мають право доступу
  - Адміністратори можуть відкликати доступ, видаливши та створивши наново ServiceAccount; UID змінюється, і раніше записана авторизація більше не збігається

### Обмеження аудиторії {#audience-restriction}

Бета-реліз базується на обмеженні аудиторії токенів ServiceAccount для вузлів (бета з v1.33), щоб забезпечити можливість `kubelet` запитувати токени лише для авторизованих аудиторій. Адміністратори налаштовують дозволені аудиторії за допомогою RBAC, щоб дозволити kubelet запитувати токени ServiceAccount для завантаження образів:

```yaml
#
# УВАГА: це лише приклад конфігурації.
#          Не використовуйте це для свого кластера!
#
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubelet-credential-provider-audiences
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["registry-access-sa"]  # Опціонально: конкретний SA
```

## Початок роботи з бета-версією {#getting-started-with-beta}

### Необхідні умови {#prerequisites}

1. **Kubernetes v1.34 або новіший**
2. **Увімкнено функціональні можливості**: `KubeletServiceAccountTokenForCredentialProviders=true` (бета, типово увімкнено)
3. **Підтримка постачальника облікових даних**: оновіть свого постачальника облікових даних, щоб він обробляв токени ServiceAccount

### Міграція з альфа-версії {#migration-from-alpha}

У випадку, якщо ви вже використовуєте альфа-версію, міграція на бета-версію вимагає мінімальних змін:

1. **Додайте поле `cacheType`**:
   Оновіть конфігурацію вашого постачальника облікових даних, щоб включити необхідне поле `cacheType`
2. **Перегляньте стратегію кешування**:
   Виберіть між типами кешу `Token` і `ServiceAccount` на основі поведінки вашого постачальника
3. **Перевірте обмеження аудиторії**:
   Переконайтеся, що ваша конфігурація RBAC або інші правила авторизації кластера правильно обмежують аудиторії токенів

### Приклад налаштування {#example-setup}

Ось повний приклад налаштування постачальника облікових даних з токенами ServiceAccount (цей приклад передбачає, що ваш кластер використовує авторизацію RBAC):

```yaml
#
# УВАГА: це лише приклад конфігурації.
#          Не використовуйте це для свого кластера!
#

# ServiceAccount з анотаціями реєстру
apiVersion: v1
kind: ServiceAccount
metadata:
  name: registry-access-sa
  namespace: default
  annotations:
    myregistry.io/identity-id: "user123"
---
# RBAC для обмеження аудиторії
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: registry-audience-access
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["registry-access-sa"]  # Опціонально: конкретний ServiceAccount
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubelet-registry-audience
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: registry-audience-access
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
---
# Pod, що використовує ServiceAccount
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: registry-access-sa
  containers:
  - name: my-app
    image: myregistry.example/my-app:latest
```

## Що далі? {#what-s-next}

Для Kubernetes v1.35 ми, Kubernetes SIG Auth, очікуємо, що можливість залишиться в бета-версії, і ми будемо продовжувати збирати відгуки.

Ви можете дізнатися більше про цю можливість на сторінці [токена ServiceAccount для завантаження зображень](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls) в документації Kubernetes.

Ви також можете стежити за [KEP-4412](https://kep.k8s.io/4412), щоб відстежувати прогрес у майбутніх випусках Kubernetes.

## Заклик до дії {#call-to-action}

У цьому блозі ми висвітлили бета-випуск інтеграції токенів ServiceAccount для Kubelet Credential Providers в Kubernetes v1.34. Ми розглянули ключові поліпшення, включаючи необхідне поле `cacheType` та вдосконалену інтеграцію з Ensure Secret Pull Images.

Ми отримали позитивні відгуки від спільноти під час альфа-фази і хотіли б почути більше, оскільки ми стабілізуємо цю можливість для GA. Зокрема, ми хотіли б отримати відгуки від розробників постачальників облікових даних під час інтеграції з новим бета-API та механізмами кешування. Будь ласка, звʼяжіться з нами в каналі [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) на Kubernetes Slack.

## Як взяти участь {#how-to-get-involved}

Якщо ви зацікавлені в участі в розробці цієї можливості, поділіться відгуками або візьміть участь в інших поточних проєктах SIG Auth, будь ласка, звʼяжіться з нами в каналі [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) на Kubernetes Slack.

Ви також можете приєднатися до [зустрічей SIG Auth](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings), що відбуваються раз на два тижні, кожної другої середи.
