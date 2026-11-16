---
title: Керування Secrets за допомогою kubectl
content_type: task
weight: 10
description: Створення обʼєктів Secret за допомогою командного рядка kubectl.
---

<!-- overview -->

На цій сторінці показано, як створювати й редагувати {{<glossary_tooltip text="Secrets" term_id="secret">}} Kubernetes, керувати ними та видаляти їх за допомогою інструмента командного рядка `kubectl`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-a-secret}

Обʼєкт `Secret` зберігає конфіденційні дані, такі як облікові дані, які Podʼи використовують для доступу до сервісів. Наприклад, Secret може знадобитися для зберігання імені користувача й пароля, потрібних для доступу до бази даних.

Ви можете створити Secret, передавши необроблені дані в команді або зберігши облікові дані у файлах, які ви передаєте в команді. Наведені нижче команди створюють Secret, який зберігає імʼя користувача `admin` і пароль `S!B\*d$zDsb=`.

### Використання необроблених даних {#use-raw-data}

Виконайте таку команду:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```

Щоб екранувати спеціальні символи, такі як `$`, `\`, `*`, `=` і `!`, у рядках, потрібно використовувати одинарні лапки `''`. Інакше ваша оболонка інтерпретуватиме ці символи.

{{< note >}}
Поле `stringData` у Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

### Використання вихідних файлів {#use-source-files}

1. Збережіть облікові дані у файлах:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   Прапорець `-n` гарантує, що згенеровані файли не матимуть зайвого символу нового рядка в кінці тексту. Це важливо, бо коли `kubectl` читає файл і кодує вміст у рядок base64, зайвий символ нового рядка теж кодується. Спеціальні символи в рядках, які ви додаєте у файл, екранувати не потрібно.

1. Передайте шляхи до файлів у команду `kubectl`:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   Стандартно назвою ключа є назва файлу. За потреби ви можете задати назву ключа за допомогою `--from-file=[key=]source`. Наприклад:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

За будь-якого способу вивід подібний до такого:

```
secret/db-user-pass created
```

### Перевірка Secret {#verify-the-secret}

Перевірте, що Secret створено:

```shell
kubectl get secrets
```

Вивід подібний до такого:

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

Перегляньте подробиці Secret:

```shell
kubectl describe secret db-user-pass
```

Вивід подібний до такого:

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

Команди `kubectl get` і `kubectl describe` стандартно не показують вміст `Secret`. Це захищає `Secret` від випадкового розкриття або збереження в логах термінала.

### Розкодування Secret {#decoding-secret}

1. Перегляньте вміст створеного вами Secret:

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   Вивід подібний до такого:

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. Розкодуйте дані `password`:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   Вивід подібний до такого:

   ```
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   Це приклад для цілей документації. На практиці цей спосіб може призвести до збереження команди із закодованими даними в історії оболонки. Будь-хто з доступом до вашого компʼютера може знайти цю команду й розкодувати Secret. Кращий підхід — поєднати команди перегляду та розкодування.
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## Редагування Secret {#edit-secret}

Ви можете редагувати наявний обʼєкт `Secret`, якщо він не є [незмінним](/docs/concepts/configuration/secret/#secret-immutable). Щоб відредагувати Secret, виконайте таку команду:

```shell
kubectl edit secrets <secret-name>
```

Це відкриє ваш типовий редактор і дозволить оновити закодовані в base64 значення Secret у полі `data`, як у наведеному нижче прикладі:

```yaml
# Будь ласка, відредагуйте наведений нижче обʼєкт. Рядки, що починаються з символу «#», ігноруватимуться,
# а порожній файл призведе до припинення редагування. Якщо під час збереження цього файлу виникне помилка, його
# буде знову відкрито з зазначенням відповідних помилок.
#
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## Очищення {#clean-up}

Щоб видалити Secret, виконайте таку команду:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтеся, як [керувати Secrets за допомогою файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Дізнайтеся, як [керувати Secrets за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
