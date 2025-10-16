---
title: Налаштування користувача для kubectl (kuberc)
content_type: concept
weight: 70
---

{{< feature-state state="beta" for_k8s_version="1.34" >}}

Файл конфігурації Kubernetes `kuberc` дозволяє вам визначити параметри для {{<glossary_tooltip text="kubectl" term_id="kubectl">}}, такі як стандартні параметри та аліаси команд. На відміну від файлу kubeconfig, файл конфігурації `kuberc` **не** містить відомостей про кластер, імен користувачів або паролів.

Стандартне розташування цього файлу конфігурації — `$HOME/.kube/kuberc`. Ви можете вказати `kubectl`, щоб він шукав конфігурацію в іншому шляху, використовуючи аргумент командного рядка `--kuberc`. Ви також можете встановити змінну середовища `KUBERC`.

Файл `kuberc`, що використовує формат `kubectl.config.k8s.io/v1beta1`, дозволяє вам визначити два типи налаштувань користувача:

1. [Aliases](#aliases) — дозволяють створювати коротші версії ваших улюблених команд, за бажанням встановлюючи параметри та аргументи.
1. [Defaults](#defaults) — дозволяють налаштовувати значення параметрів за замовчуванням для ваших улюблених команд.

## aliases

У конфігурації `kuberc` секція _aliases_ дозволяє вам визначити власні скорочення для команд kubectl, за бажанням з попередньо встановленими аргументами та прапорцями командного рядка.

Наступний приклад визначає аліас `kubectl getn` для команди `kubectl get`, додатково вказуючи формат виводу JSON: `--output=json`.

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

В цьому прикладі були використані такі налаштування:

1. `name` — Імʼя аліасу не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш аліас. Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть стандартне значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над стандартним значенням , визначеним у `kuberc`.

З цим аліасом виконання `kubectl getn pods` стандартно виведе JSON. Однак, якщо ви виконаєте `kubectl getn pods -oyaml`, вивід буде у форматі YAML.

Повний опис схеми `kuberc` доступний [тут](docs/reference/config-api/kuberc.v1beta1/).

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

В цьому прикладі були використані такі налаштування:

1. `name` — Імʼя аліасу не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш аліас.  Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть стандартне значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над стандартним значенням, визначеним у `kuberc`.
1. `prependArgs` — Вкажіть явний аргумент, який буде розміщено відразу після команди. Тут це буде перетворено на `kubectl get namespace test-ns --output json`.

### appendArgs

Цей приклад представляє механізм, подібний до додавання аргументів, але в цей раз ми будемо додавати аргументи в кінець команди kubectl.

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

В цьому прикладі були використані такі налаштування:

1. `name` — Імʼя аліасу не повинно збігатися з вбудованими командами.
1. `command` — Вкажіть вбудовану команду, яку буде виконувати ваш аліас. Це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть стандартне значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над стандартним значенням, визначеним у `kuberc`.
1. `appendArgs` — Вкажіть явні аргументи, які будуть розміщені в кінці команди. Тут це буде перетворено на `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## defaults

У рамках конфігурації `kuberc` секція `defaults` дозволяє вказати стандартні значення для аргументів командного рядка.

Цей приклад робить інтерактивне видалення стандартним режимом для виклику `kubectl delete`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
- command: delete
  options:
    - name: interactive
      default: "true"
```

В цьому прикладі були використані такі налаштування:

1. `command` — Вбудована команда, це включає підтримку підкоманд, таких як `create role`.
1. `options` — Вкажіть стандартні значення для параметрів. Якщо ви явно вкажете параметр під час виконання `kubectl`, значення, яке ви надасте, матиме пріоритет над стандартним значенням, визначеним у `kuberc`.

З цим налаштуванням, виконання `kubectl delete pod/test-pod` стандартно запитуватиме підтвердження. Однак, `kubectl delete pod/test-pod --interactive=false` обійде підтвердження.

## Запропоновані defaults {#suggested-defaults}

Розробники kubectl рекомендують використовувати kuberc із такими стандартними defaults:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  # (1) стандартно server-side apply
  - command: apply
    options:
      - name: server-side
        default: "true"

  # (2) стандартно інтерактивне видалення
  - command: delete
    options:
      - name: interactive
        default: "true"
```

В цьому прикладі були використані такі налаштування:

1. Стандартно використовується [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Стандартно інтерактивне видалення щоразу, коли викликається `kubectl delete`, щоб запобігти випадковому видаленню ресурсів з кластера.

## Вимкнення kuberc {#disable-kuberc}

Щоб тимчасово вимкнути функціональність kuberc, встановіть змінну середовища `KUBERC` зі значенням `off`:

```shell
export KUBERC=off
```

або вимкніть функціональну можливість:

```shell
export KUBECTL_KUBERC=false
```
