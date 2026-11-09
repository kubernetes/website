---
title: Керування Secrets за допомогою файлу конфігурації
content_type: task
weight: 20
description: Створення обʼєктів Secret за допомогою файлу конфігурації ресурсу.
---

<!-- overview -->

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-the-config-file}

Ви можете спочатку визначити обʼєкт `Secret` у маніфесті у форматі JSON або YAML, а потім створити цей обʼєкт. Ресурс [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core) містить два словники: `data` і `stringData`. Поле `data` використовується для зберігання довільних даних, закодованих у base64. Поле `stringData` надається для зручності й дозволяє вказувати ті самі дані у вигляді незакодованих рядків. Ключі `data` і `stringData` мають складатися з буквено-цифрових символів, `-`, `_` або `.`.

Наведений нижче приклад зберігає два рядки в Secret за допомогою поля `data`.

1. Перетворіть рядки на base64:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   Серіалізовані значення JSON і YAML даних Secret кодуються як рядки base64. Символи нового рядка в цих рядках неприпустимі й мають бути вилучені. Під час використання утиліти `base64` у Darwin/macOS користувачам слід уникати параметра `-b` для розбиття довгих рядків. Натомість користувачам Linux *слід* додавати параметр `-w 0` до команд `base64` або використовувати конвеєр `base64 | tr -d '\n'`, якщо параметр `-w` недоступний.
   {{< /note >}}

   Вивід подібний до такого:

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. Створіть маніфест:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```

   Зверніть увагу, що назва обʼєкта Secret має бути дійсною [назвою піддомену DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Створіть Secret за допомогою [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вивід подібний до такого:

   ```
   secret/mysecret created
   ```

Щоб перевірити, що Secret створено, і розкодувати дані Secret, дивіться [Керування Secrets за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

### Вказання незакодованих даних під час створення Secret {#specify-unencoded-data-when-creating-a-secret}

У деяких сценаріях ви можете натомість використовувати поле `stringData`. Це поле дозволяє розмістити рядок без кодування base64 безпосередньо в Secret, і цей рядок буде закодовано автоматично під час створення або оновлення Secret.

Практичний приклад: ви розгортаєте застосунок, який використовує Secret для зберігання файлу конфігурації, і хочете заповнити частини цього файлу конфігурації під час розгортання.

Наприклад, якщо ваш застосунок використовує такий файл конфігурації:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

Ви можете зберегти це в Secret, використовуючи таке визначення:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

{{< note >}}
Поле `stringData` у Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

Коли ви отримуєте дані Secret, команда повертає закодовані значення, а не відкритий текст, який ви вказали в `stringData`.

Наприклад, якщо ви виконаєте таку команду:

```shell
kubectl get secret mysecret -o yaml
```

Вивід подібний до такого:

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

### Вказання як `data`, так і `stringData` {#specify-both-data-and-stringdata}

Якщо ви вкажете поле і в `data`, і в `stringData`, буде використано значення зі `stringData`.

Наприклад, якщо ви визначите такий Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
Поле `stringData` у Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

Обʼєкт `Secret` буде створено так:

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

`YWRtaW5pc3RyYXRvcg==` розкодовується в `administrator`.

## Редагування Secret {#edit-secret}

Щоб відредагувати дані в Secret, створеному за допомогою маніфесту, змініть поле `data` або `stringData` у маніфесті й застосуйте файл до кластера. Ви можете редагувати наявний обʼєкт `Secret`, якщо він не є [незмінним](/docs/concepts/configuration/secret/#secret-immutable).

Наприклад, якщо ви хочете змінити пароль із попереднього прикладу на `birdsarentreal`, зробіть таке:

1. Закодуйте новий рядок пароля:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   Вивід подібний до такого:

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

1. Оновіть поле `data`, вказавши новий рядок пароля:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. Застосуйте маніфест до кластера:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вивід подібний до такого:

   ```
   secret/mysecret configured
   ```

Kubernetes оновлює наявний обʼєкт `Secret`. Докладніше: інструмент `kubectl` помічає, що вже існує обʼєкт `Secret` із такою самою назвою. `kubectl` отримує наявний обʼєкт, планує зміни в ньому й надсилає змінений обʼєкт `Secret` до панелі управління кластера.

Якщо натомість ви вказали `kubectl apply --server-side`, `kubectl` використовує [застосування на боці сервера](/docs/reference/using-api/server-side-apply/).

## Очищення {#clean-up}

Щоб видалити створений вами Secret:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтеся, як [керувати Secrets за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтеся, як [керувати Secrets за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
