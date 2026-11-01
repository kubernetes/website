---
title: Використання ABAC авторизації
content_type: concept
weight: 39
---

<!-- overview -->

Авторизація на основі атрибутів (ABAC) визначає парадигму контролю доступу, за якою права доступу надаються користувачам за допомогою політик, які комбінують атрибути.

<!-- body -->

## Формат файлу політики {#policy-file-format}

Для увімкнення режиму `ABAC` вказуйте `--authorization-policy-file=SOME_FILENAME` та `--authorization-mode=ABAC` при запуску.

Формат файлу — [один обʼєкт JSON на рядок](https://jsonlines.org/). Не повинно бути жодного вкладеного списку або map, тільки один map на рядок.

Кожний рядок — "обʼєкт політики", де такий обʼєкт є map із такими властивостями:

- Властивості версіювання:
  - `apiVersion`, типу string; допустимі значення "abac.authorization.kubernetes.io/v1beta1". Дозволяє версіювання та конвертацію формату політики.
  - `kind`, типу string: допустимі значення "Policy". Дозволяє версіювання та конвертацію формату політики.
- Властивість `spec` встановлена на мапу з такими властивостями:
  - Властивості зіставлення субʼєкта:
    - `user`, типу string; рядок користувача з `--token-auth-file`. Якщо ви вказуєте `user`, він повинен збігатися з імʼям користувача автентифікованого користувача.
    - `group`, типу string; якщо ви вказуєте `group`, він повинен збігатися з однією з груп автентифікованого користувача. `system:authenticated` збігається з усіма автентифікованими запитами. `system:unauthenticated` збігається з усіма неавтентифікованими запитами.
  - Властивості зіставлення ресурсу:
    - `apiGroup`, типу string; група API.
      - Наприклад: `apps`, `networking.k8s.io`
      - Маска: `*` збігається з усіма групами API.
    - `namespace`, типу string; простір імен.
      - Наприклад: `kube-system`
      - Маска: `*` збігається з усіма запитами ресурсів.
    - `resource`, типу string; тип ресурсу
      - Наприклад: `pods`, `deployments`
      - Маска: `*` збігається з усіма запитами ресурсів.
  - Властивості зіставлення нересурсів:
    - `nonResourcePath`, типу string; шляхи запитів нересурсів.
      - Наприклад: `/version` або `/apis`
      - Маска:
        - `*` збігається з усіма запитами нересурсів.
        - `/foo/*` збігається з усіма підшляхами `/foo/`.
  - `readonly`, типу boolean, якщо true, означає, що політика, що зіставляється з ресурсом, застосовується тільки до операцій get, list, та watch, а політика, що зіставляється з нересурсами, застосовується тільки до операції get.

{{< note >}}
Невстановлена властивість є такою самою, як властивість, що встановлена на нульове значення для свого типу (наприклад, порожній рядок, 0, false). Проте невстановлена властивість має перевагу для зручності читання.

У майбутньому політики можна буде виражати у форматі JSON і керувати ними через REST-інтерфейс.
{{< /note >}}

## Алгоритм авторизації {#authorization-algorithm}

У запиту є атрибути, які відповідають властивостям обʼєкта політики.

Коли отримано запит, визначаються атрибути. Невідомі атрибути встановлюються на нульове значення свого типу (наприклад, порожній рядок, 0, false).

Властивість, встановлена на `"*"`, буде збігатися з будь-яким значенням відповідного атрибута.

Кортеж атрибутів перевіряється на відповідність кожній політиці в файлі політики. Якщо принаймні один рядок відповідає атрибутам запиту, тоді запит авторизований (але може зазнати невдачі під час подальшої перевірки).

Щоб дозволити будь-якому автентифікованому користувачеві зробити щось, створіть політику з властивістю group, встановленою на `"system:authenticated"`.

Щоб дозволити будь-якому неавтентифікованому користувачеві зробити щось, створіть політику з властивістю group, встановленою на `"system:unauthenticated"`.

Щоб дозволити користувачеві зробити все, створіть політику з властивостями apiGroup, namespace, resource та nonResourcePath, встановленими на `"*"`.

## Kubectl

Kubectl використовує точки доступу `/api` та `/apis` apiserver для виявлення сервісів, які обслуговують типи ресурсів, і перевіряє обʼєкти, надіслані до API за допомогою операцій create/update, використовуючи інформацію про схему, розташовану в `/openapi/v2`.

При використанні авторизації на основі атрибутів, ці спеціальні ресурси мають бути явно відкриті за допомогою властивості `nonResourcePath` в політиці (див. [приклади](#examples) нижче):

- `/api`, `/api/*`, `/apis` та `/apis/*` для вибору версії API.
- `/version` для отримання версії сервера через `kubectl version`.
- `/swaggerapi/*` для операцій create/update.

Щоб перевірити HTTP-виклики, повʼязані з певною операцією kubectl, ви можете збільшити рівень деталізації:

```shell
kubectl --v=8 version
```

## Приклади {#examples}

1. Alice може робити все з усіма ресурсами:

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
   ```

1. Kubelet може читати будь-які Podʼи:

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
   ```

1. Kubelet може читати та записувати події:

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
   ```

1. Bob може лише читати Podʼи в просторі імен "projectCaribou":

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
   ```

1. Будь-хто може робити запити тільки для читання на всі нересурсні шляхи:

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
   ```

[Приклад повного файлу](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## Коротка нотатка про службові облікові записи {#a-quick-note-on-service-accounts}

Кожен службовий обліковий запис має відповідне імʼя користувача ABAC, і імʼя цього службового облікового запису генерується згідно з конвенцією щодо найменування:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

Створюючи новий простір імен, створюється новий службовий обліковий запис у наступному форматі:

```shell
system:serviceaccount:<namespace>:default
```

Наприклад, якщо ви хочете надати стандартному службовому обліковому запису (у просторі імен `kube-system`) повні привілеї в API за допомогою ABAC, ви додаєте цей рядок до файлу політики:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

apiserver повинен бути перезапущений, щоб використати нові рядки.
