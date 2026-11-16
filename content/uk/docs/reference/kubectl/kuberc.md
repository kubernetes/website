---
title: Налаштування користувача для kubectl (kuberc)
content_type: concept
weight: 70
---

{{< feature-state state="beta" for_k8s_version="1.34" >}}

Файл конфігурації Kubernetes `kuberc` дозволяє визначити налаштування для {{<glossary_tooltip text="kubectl" term_id="kubectl">}}, такі як типові параметри та псевдоніми команд. На відміну від файлу kubeconfig, файл конфігурації `kuberc` **не** містить відомостей про кластер, імен користувачів або паролів.

У системах Linux/POSIX типове розташування цього файлу конфігурації — `$HOME/.kube/kuberc`. У Windows типовий шлях схожий: `%USERPROFILE%\.kube\kuberc`. Щоб вказати kubectl шлях до власного файлу kuberc, скористайтеся параметром командного рядка `--kuberc` або встановіть змінну середовища `KUBERC`.

Файл `kuberc`, що використовує формат `kubectl.config.k8s.io/v1beta1`, дозволяє визначити такі типи налаштувань користувача:

1. [Aliases](#aliases) — дозволяють створювати коротші версії ваших улюблених команд, за бажанням встановлюючи параметри та аргументи.
2. [Defaults](#defaults) — дозволяють налаштовувати типові значення параметрів для ваших улюблених команд.
3. [Політика втулків облікових даних](#credential-plugin-policy) — дозволяє налаштувати політику для втулків облікових даних exec.

## aliases

У конфігурації `kuberc` секція _aliases_ дозволяє вам визначити власні скорочення для команд kubectl, за бажанням з попередньо встановленими аргументами та прапорцями командного рядка.

Наступний приклад визначає псевдонім `kubectl getn` для підкоманди `kubectl get`, додатково вказуючи формат виводу JSON: `--output=json`.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
- name: getn
  command: get
  options:
   - name: output
     default: json
```

У цьому прикладі використано такі налаштування:

1. `name` — Імʼя псевдоніма не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш псевдонім. Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть типові значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над типовим значенням, визначеним у `kuberc`.

З цим псевдонімом виконання `kubectl getn pods` типово виведе JSON. Однак, якщо ви виконаєте `kubectl getn pods -oyaml`, вивід буде у форматі YAML.

Повний опис схеми `kuberc` доступний [тут](/docs/reference/config-api/kuberc.v1beta1/).

### prependArgs

Цей приклад розширює попередній, вводячи секцію `prependArgs`, яка дозволяє вставляти довільні аргументи безпосередньо після команди kubectl та її підкоманди (якщо така є).

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
  - name: getn
    command: get
    options:
      - name: output
        default: json
    prependArgs:
      - namespace
```

У цьому прикладі використано такі налаштування:

1. `name` — Імʼя псевдоніма не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш псевдонім. Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть типові значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над типовим значенням, визначеним у `kuberc`.
1. `prependArgs` — Вкажіть явний аргумент, який буде розміщено відразу після команди. Тут це буде перетворено на `kubectl get namespace test-ns --output json`.

### appendArgs

Цей приклад представляє механізм, подібний до вставлення аргументів на початок, але цього разу ми додаватимемо аргументи в кінець команди kubectl.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
- name: runx
  command: run
  options:
    - name: image
      default: busybox
    - name: namespace
      default: test-ns
  appendArgs:
    - --
    - custom-arg
```

У цьому прикладі використано такі налаштування:

1. `name` — Імʼя псевдоніма не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш псевдонім. Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть типові значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над типовим значенням, визначеним у `kuberc`.
1. `appendArgs` — Вкажіть явні аргументи, які будуть розміщені в кінці команди. Тут це буде перетворено на `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## defaults

У рамках конфігурації `kuberc` секція `defaults` дозволяє вказати типові значення для аргументів командного рядка.

Цей приклад робить інтерактивне видалення типовим режимом для виклику `kubectl delete`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
- command: delete
  options:
    - name: interactive
      default: "true"
```

У цьому прикладі використано такі налаштування:

1. `command` — Вбудована команда, це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть типові значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над типовим значенням, визначеним у `kuberc`.

З цим налаштуванням, виконання `kubectl delete pod/test-pod` типово запитуватиме підтвердження. Однак, `kubectl delete pod/test-pod --interactive=false` обійде підтвердження.

## Політика втулків облікових даних {#credential-plugin-policy}

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

Ті, хто редагує `kubeconfig`, можуть вказати виконуваний втулок, який буде використовуватися для отримання облікових даних для автентифікації клієнта в кластері. У конфігурації `kuberc` ви можете встановити політику виконання для таких втулків за допомогою двох полів верхнього рівня. Обидва поля є необовʼязковими.

### credentialPluginPolicy

Ви можете налаштувати політику для втулків облікових даних, використовуючи необовʼязкове поле `credentialPluginPolicy`. Для цього поля існує три допустимі значення:

1. `"AllowAll"`

Коли політика встановлена на `"AllowAll"`, не буде жодних обмежень щодо того, які втулки можуть працювати. Ця поведінка така сама, як у версіях Kubernetes до 1.35.

2. `"DenyAll"`

Коли політика встановлена на `"DenyAll"`, жодному втулку exec не буде дозволено запускатися.

3. `"Allowlist"`

Коли політика встановлена на `"Allowlist"`, користувач може вибірково дозволяти виконання втулків облікових даних. Коли політика встановлена на `"Allowlist"`, ви **повинні** також вказати поле `credentialPluginAllowlist` (також на верхньому рівні). Це поле описано нижче.

{{< note >}}
Для збереження зворотної сумісності невизначена або порожня `credentialPluginPolicy` рівнозначна явному встановленню політики на `"AllowAll"`.
{{< /note >}}

### credentialPluginAllowlist

{{< note >}}
Встановлення цього поля, коли `credentialPluginPolicy` не є `Allowlist` (включно з випадками, коли це поле відсутнє або порожнє), вважається помилкою конфігурації.
{{< /note >}}

Поле `credentialPluginAllowlist` визначає список наборів критеріїв (наборів *вимог*) для дозволу на виконання втулків облікових даних. Кожен набір вимог буде перевірятися по черзі; як тільки втулок відповідатиме всім вимогам хоча б одного набору, йому буде дозволено виконуватися. Тобто загальний результат застосування allowlist до втулка `my-binary-plugin` є _логічним АБО_ рішень, прийнятих для кожного елемента списку.

Як приклад, розглянемо таку конфігурацію списку дозволених втулків:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: foo
  - command: bar
  - command: baz
```

В наведеному вище прикладі allowlist дозволить втулки з командами "foo", "bar", _АБО_ "baz".

{{< note >}}
Щоб набір вимог був дійсним, він **повинен** мати принаймні одне поле, яке не є порожнім і явно вказане. Якщо всі поля порожні або не вказані, це вважається помилкою конфігурації, і втулку не буде дозволено виконуватися. Те саме стосується поля `credentialPluginAllowlist`, якщо воно не вказане або явно вказане як порожній список. Це зроблено для того, щоб запобігти ситуаціям, коли користувач неправильно вводить ключ `credentialPluginAllowlist`, думаючи, що вказав список дозволених, хоча насправді цього не зробив.

Наприклад, така конфігурація недійсна:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: ""
```

{{< /note >}}

##### command

`command` задає назву втулка облікових даних, який можна виконувати. Воно може бути вказане як базова назва бажаного втулка або повний шлях. Якщо вказано як базова назва, рішення, прийняте цим полем, буде "allow", якщо виконується одна з двох таких умов:

1. Поле `command` точно дорівнює полю `command` втулка.
1. Визначення повного шляху виконується як для allowlist `command`, так і для `command` втулка, і результати збігаються.

Якщо вказано повний шлях, рішення, прийняте цим полем, є "allow", якщо виконується одна з таких умов:

1. Поле `command` точно дорівнює полю `command` втулка (тобто `command` втулка також є повним шляхом).
1. Визначення повного шляху виконується для поля `command` втулка, і поле `command` allowlist точно збігається.

Що стосується _визначення повного шляху_, згаданого раніше на цій сторінці, ні символічні посилання, ні шаблони оболонки (globs) не розкриваються.

Наприклад, розглянемо запис у allowlist з `command` `/usr/local/bin/my-binary`, де `/usr/local/bin/my-binary` є символічним посиланням на `/this/is/a/target`. Якщо `command`, вказаний у kubeconfig, є `/this/is/a/target`, він не буде дозволений. Щоб це працювало, потрібно явно додати `/this/is/a/target` до allowlist. З іншого боку, якщо kubeconfig має `command` як `/usr/local/bin/my-binary`, то allowlist дозволить його запуск.

{{< note >}}
Поки kuberc перебуває на стадії beta, `name` може використовуватися як псевдонім для `command` у записах allowlist. Починаючи з Kubernetes 1.36, `name` вважається застарілим на користь `command`. Надання **обох** `name` та `command` в одному записі allowlist вважається помилкою, оскільки ці налаштування критичні для безпеки. Поле `name` буде повністю вилучено, коли kuberc досягне GA.
{{< /note >}}

### Приклад {#credential-plugin-policy-example}

Приклад нижче показує політику `"Allowlist"` разом зі списком дозволених втулків:

{{< tabs name="tab_with_code" >}}
{{< tab name="POSIX" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: my-trusted-binary
  - command: /usr/local/bin/my-other-trusted-binary
{{< /tab >}}
{{< tab name="Windows" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: my-trusted-binary
  - command: "C:\my-other-trusted-binary"
{{< /tab >}}
{{< /tabs >}}

### Керування політикою втулків облікових даних за допомогою `kubectl kuberc set` {#managing-credential-plugin-policy-with-kubectl-kuberc-set}

Замість того, щоб редагувати файл kuberc безпосередньо, ви можете використовувати `kubectl kuberc set`, щоб налаштувати політику втулків облікових даних з командного рядка.

```shell
# Встановити політику для заборони всіх втулків облікових даних
kubectl kuberc set --section credentialplugin --policy DenyAll

# Встановити політику для дозволу всіх втулків облікових даних
kubectl kuberc set --section credentialplugin --policy AllowAll

# Дозволити лише конкретні втулки облікових даних
kubectl kuberc set --section credentialplugin \
    --policy Allowlist \
    --allowlist-entry command=my-trusted-binary \
    --allowlist-entry command=my-other-trusted-binary
```

У цьому прикладі використано такі прапорці:

1. `--section credentialplugin` - Вибір секції конфігурації втулків облікових даних.
1. `--policy` - Обовʼязково. Встановіть політику на `AllowAll`, `DenyAll` або `Allowlist`.
1. `--allowlist-entry` - Обовʼязково, коли `--policy=Allowlist`. Вкажіть втулок, який потрібно дозволити, у вигляді пар `key=value`, розділених комами. Наразі підтримується лише ключ `command` (наприклад, `command=<binary-name>`), але формат передбачає майбутні додавання, такі як перевірка дайджесту або відкритого ключа. Повторіть цей прапорець, щоб дозволити кілька втулків.

## Рекомендовані типові налаштування {#suggested-defaults}

Розробники kubectl рекомендують використовувати kuberc з такими типовими налаштуваннями:

{{< caution >}}
Якщо ви використовуєте провайдера керованого Kubernetes, перевірте документацію провайдера щодо того, які втулки exec потрібні у вашому середовищі, і замість цього використовуйте політику ["Allowlist"](#credentialPluginPolicy).

Якщо після встановлення політики ["DenyAll"](#credentialPluginPolicy), як показано нижче, виникнуть проблеми, перегляньте повідомлення про помилки `kubectl`, щоб зʼясувати, яким втулкам заборонено запуск, і порівняйте їх з документацією вашого провайдера. Нарешті, змініть політику на "Allowlist" і додайте необхідні втулки в поле [credentialPluginAllowlist](#credentialPluginAllowlist).
{{< /caution >}}

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  # (1) типово server-side apply
  - command: apply
    options:
      - name: server-side
        default: "true"

  # (2) типово інтерактивне видалення
  - command: delete
    options:
      - name: interactive
        default: "true"

# Перед вибором DenyAll ознайомтеся з наведеною вище приміткою про провайдерів керованого Kubernetes
credentialPluginPolicy: DenyAll
```

У цьому прикладі застосовуються такі налаштування:

1. Типово використовується [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Типово — інтерактивне видалення щоразу, коли викликається `kubectl delete`, щоб запобігти випадковому видаленню ресурсів з кластера.
1. Запуск виконуваних втулків для облікових даних буде заборонено.

## Вимкнення kuberc {#disable-kuberc}

Щоб тимчасово вимкнути функціональність `kuberc`, встановіть (і експортуйте) змінну середовища `KUBERC` зі значенням `off`:

```shell
export KUBERC=off
```

або вимкніть функціональну можливість:

```shell
export KUBECTL_KUBERC=false
```

Це може допомогти зʼясувати, чи не спричиняє проблему ваш `kuberc`.
