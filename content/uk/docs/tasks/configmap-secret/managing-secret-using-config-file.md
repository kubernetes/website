---
title: Керування Secret за допомогою конфігураційного файлу
content_type: task
weight: 20
description: Створення обʼєктів Secret за допомогою конфігураційного файлу ресурсів.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-the-config-file}

Ви можете спочатку визначити обʼєкт `Secret` у форматі JSON або YAML у маніфесті, а потім створити цей обʼєкт. Ресурс [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core) містить два словники: `data` та `stringData`. Поле `data` використовується для зберігання довільних даних, закодованих за допомогою base64. Поле `stringData` надається для зручності, і воно дозволяє вам надавати ті самі дані у вигляді незакодованих рядків. Ключі `data` та `stringData` повинні складатися з буквено-цифрових символів, `-`, `_` або `.`.

Наведений нижче приклад зберігає два рядки у Secret, використовуючи поле `data`.

1. Конвертуйте рядки в base64:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   Серіалізовані значення JSON та YAML даних Secret кодуються як рядки base64. Переходи на новий рядок не дійсні у цих рядках та повинні бути вилучені. При використанні утиліти `base64` у Darwin/macOS користувачі повинні уникати використання опції `-b` для розбиття довгих рядків. Навпаки, користувачам Linux *слід* додавати опцію `-w 0` до команд `base64` або конвеєру `base64 | tr -d '\n'`, якщо опція `-w` недоступна.
   {{< /note >}}

   Вивід буде подібний до:

   ```none
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

   Зверніть увагу, що імʼя обʼєкта Secret повинно бути дійсним [піддоменом DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Створіть Secret, використовуючи [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вивід буде подібний до:

   ```none
   secret/mysecret created
   ```

Щоб перевірити, що Secret був створений та щоб розкодувати дані Secret, див. [Керування Secret за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#перевірка-секрету).

### Вказання незакодованих даних під час створення Secret {#specify-unencoded-data-when-creating-a-secret}

Для певних сценаріїв можливо вам захочеться використовувати поле `stringData`. Це поле дозволяє вам розміщувати незакодований рядок безпосередньо у Secret, і цей рядок буде закодований за вас при створенні або оновленні Secret.

Практичний приклад цього може бути там, де ви розгортаєте застосунок, що використовує Secret для зберігання файлу конфігурації, і ви хочете заповнити частини цього файлу конфігурації під час процесу розгортання.

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
Поле `stringData` для Secret погано працює із застосуванням на стороні сервера.
{{< /note >}}

При отриманні даних Secret, команда повертає закодовані значення, а не текстові значення, які ви вказали у `stringData`.

Наприклад, якщо ви виконаєте наступну команду:

```shell
kubectl get secret mysecret -o yaml
```

Вивід буде подібний до:

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

Якщо ви вказали поле як у `data`, так і у `stringData`, буде використано значення з `stringData`.

Наприклад, якщо ви визначите наступний секрет:

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
Поле `stringData` для Secret погано працює із застосуванням на стороні сервера.
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

`YWRtaW5pc3RyYXRvcg==` декодується у `administrator`.

## Редагування Secret {#edit-secret}

Щоб редагувати дані у Secret, створеному за допомогою маніфесту, змініть поле `data` або `stringData` у вашому маніфесті та застосуйте файл у вашому кластері. Ви можете редагувати наявний обʼєкт `Secret`, за винятком випадку, коли він є [незмінним](/docs/concepts/configuration/secret/#secret-immutable).

Наприклад, якщо ви хочете змінити пароль з попереднього прикладу на `birdsarentreal`, виконайте наступне:

1. Закодуйте новий рядок пароля:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   Вивід буде подібний до:

   ```none
   YmlyZHNhcmVudHJlYWw=
   ```

1. Оновіть поле `data` із вашим новим рядком пароля:

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

1. Застосуйте маніфест у вашому кластері:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вивід буде подібний до:

   ```none
   secret/mysecret configured
   ```

Kubernetes оновлює наявний обʼєкт `Secret`. Докладно, інструмент `kubectl` помічає, що є обʼєкт `Secret` з тим самим імʼям. `kubectl` отримує поточний обʼєкт, планує зміни в ньому і надсилає змінений обʼєкт `Secret` до панелі управління кластера.

Якщо ви вказали `kubectl apply --server-side`, `kubectl` використовує [застосування на боці сервера](/docs/reference/using-api/server-side-apply/) замість цього.

## Прибирання {#clean-up}

Щоб видалити створений вами Secret:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтесь, як [керувати Secret за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтесь, як [керувати Secret за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
