---
title: Налаштування користувача для kubectl (kuberc)
content_type: concept
weight: 70
---

{{< feature-state state="alpha" for_k8s_version="1.33" >}}

Файл конфігурації Kubernetes `kuberc` дозволяє вам визначити параметри для kubectl, такі як стандартні параметри та аліаси команд. На відміну від файлу kubeconfig, файл конфігурації `kuberc` **не** містить відомостей про кластер, імен користувачів або паролів.

Типово цей файл конфігурації розташований за адресою `$HOME/.kube/kuberc`. Ви можете вказати `kubectl`, щоб він шукав конфігурацію в іншому шляху, використовуючи аргумент командного рядка `--kuberc`.

## aliases

У конфігурації `kuberc` _аліаси_ дозволяють вам визначити власні скорочення для команд kubectl, за бажанням з попередньо встановленими аргументами командного рядка.

### name

Імʼя аліаса не повинно конфліктувати з вбудованими командами.

### command

Вкажіть вбудовану команду, яку буде виконувати ваш аліас. Це включає підтримку підкоманд, таких як `create role`.

### flags

Вкажіть типове значення для аргументів командного рядка (які формат kuberc називає _flags_). Якщо ви явно вкажете аргумент командного рядка під час виконання kubectl, значення, яке ви надасте, матиме пріоритет над значенням за замовчуванням, визначеним у kuberc.

#### Приклад {#flags-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
- name: getn
  command: get
  flags:
   - name: output
     default: json
```

З цим аліасом виконання `kubectl getn pods` буде типово робити вивід у форматі JSON. Однак, якщо ви виконаєте `kubectl getn pods -oyaml`, вивід буде у форматі YAML.

### prependArgs

Додає довільні аргументи одразу після команди kubectl та її підкоманди (якщо такі є).

#### Приклад {#prependArgs-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
  - name: getn
    command: get
    prependArgs:
      - namespace
    flags:
      - name: output
        default: json
```

`kubectl getn test-ns` will be translated to `kubectl get namespace test-ns --output json`.

### appendArgs

Додає довільні аргументи в кінець команди kubectl.

#### Приклад {#appendArgs-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
- name: runx
  command: run
  flags:
    - name: image
      default: busybox
    - name: namespace
      default: test-ns
  appendArgs:
    - --
    - custom-arg
```

`kubectl runx test-pod` буде перетворено на `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## Перевизначення команд {#command-overrides}

У конфігурації `kuberc` _перевизначення команд_ дозволяють вам вказати власні значення для аргументів командного рядка.

### command

Вкажіть вбудовану команду. Це включає підтримку підкоманд, таких як `create role`.

### flags

У конфігурації `kuberc` аргументи командного рядка називаються _flags_ (навіть якщо вони не представляють булевий тип). Ви можете використовувати `flags`, щоб встановити стандартне значення для аргументу командного рядка.

Якщо ви явно вкажете прапорець на своєму терміналі, явне значення завжди матиме пріоритет над значенням, яке ви визначили в kuberc за допомогою `overrides`.

{{< note >}}
Ви не можете використовувати `kuberc`, щоб перевизначити значення аргументу командного рядка, щоб воно мало пріоритет над тим, що користувач вказує в командному рядку. Термін `overrides` в цьому контексті відноситься до вказівки стандартного значення, яке відрізняється від вбудованого стандартного значення.
{{< /note >}}

#### Приклад {#exemple}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
overrides:
- command: delete
  flags:
    - name: interactive
      default: "true"
```

Цим перевизначенням ви вказуєте, що команда `kubectl delete pod/test-pod` типово повинна запитувати підтвердження перед видаленням ресурсу. Однак, `kubectl delete pod/test-pod --interactive=false` обійде підтвердження.

Супровідники kubectl заохочують вас прийняти kuberc з наведеними значеннями за замовчуванням:

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
overrides:
  - command: apply
    flags:
      - name: server-side
        default: "true"
  - command: delete
    flags:
      - name: interactive
        default: "true"
```

## Вимкнення kuberc {#disable-kuberc}

Щоб тимчасово вимкнути функціональність kuberc, просто експортуйте змінну середовища `KUBERC` зі значенням `off`:

```shell
export KUBERC=off
```

або вимкніть функціональну можливість:

```shell
export KUBECTL_KUBERC=false
```
