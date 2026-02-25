---
title: Керування Secret за допомогою kubectl
content_type: task
weight: 10
description: Створення обʼєктів Secret за допомогою інструменту командного рядка kubectl.
---

<!-- overview -->

На цій сторінці ви дізнаєтесь, як створювати, редагувати, керувати та видаляти {{<glossary_tooltip text="Secret" term_id="secret">}} Kubernetes за допомогою інструменту командного рядка `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-a-secret}

Обʼєкт `Secret` зберігає конфіденційні дані, такі як облікові дані, які використовуються потоками для доступу до служб. Наприклад, вам може знадобитися Secret для зберігання імені користувача та пароля, необхідних для доступу до бази даних.

Ви можете створити Secret, передаючи необроблену інформацію у команді, або зберігаючи облікові дані у файлах, які ви передаєте в команді. Наступні команди створюють Secret, який зберігає імʼя користувача `admin` та пароль `S!B\*d$zDsb=`.

### Використання необробленої інформації {#use-raw-data}

Виконайте наступну команду:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```

Вам потрібно використовувати одинарні лапки `''`, щоб екранувати спеціальні символи, такі як `$`, `\`, `*`, `=`, і `!` у вашому рядку. Якщо ви цього не зробите, ваша оболонка буде інтерпретувати ці символи відповідним чином.

{{< note >}}
Поле `stringData` для Secret не працює добре з apply на боці сервера.
{{< /note >}}

### Використання сирцевих файлів {#use-source-files}

1. Збережіть облікові дані у файлах:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   Прапорець `-n` гарантує, що згенеровані файли не матимуть додаткового символу нового рядка в кінці тексту. Це важливо, оскільки коли `kubectl` зчитує файл і кодує вміст у рядок base64, додатковий символ нового рядка також буде закодований. Вам не потрібно екранувати спеціальні символи у рядках, які ви включаєте в файл.

1. Передайте шляхи до файлів у команду `kubectl`:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   Стандартне імʼя ключа — це назва файлу. За потреби ви можете встановити імʼя ключа за допомогою `--from-file=[key=]source`. Наприклад:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

Не важливо який метод буде використаний вивід буде подібний до:

```none
secret/db-user-pass created
```

### Перевірка Secret {#verify-the-secret}

Перевірте, що Secret був створений:

```shell
kubectl get secrets
```

Вивід буде подібний до:

```none
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

Перегляньте деталі Secret:

```shell
kubectl describe secret db-user-pass
```

Вивід буде подібний до:

```none
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

Команди `kubectl get` та `kubectl describe` стандартно уникають показу вмісту `Secret`. Це зроблено для захисту Secret від випадкового розкриття або збереження в журналі термінала.

### Розкодування Secret {#decoding-secret}

1. Перегляньте вміст створеного вами Secret:

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   Вивід буде подібний до:

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. Розкодуйте дані `password`:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   Вивід буде подібний до:

   ```none
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   Це приклад для цілей документації. На практиці цей метод може спричинити збереження команди з закодованими даними в історії вашої оболонки. Будь-хто, хто має доступ до вашого компʼютера, може знайти цю команду та розкодувати Secret. Кращий підхід — поєднувати команди перегляду та розкодування.
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## Редагування Secret {#edit-secret}

Ви можете редагувати наявний обʼєкт `Secret`, якщо він не є [незмінним](/docs/concepts/configuration/secret/#secret-immutable). Щоб редагувати Secret, виконайте наступну команду:

```shell
kubectl edit secrets <secret-name>
```

Це відкриває ваш стандартний редактор і дозволяє оновити значення Secret, закодовані в base64, у полі `data`, як у наступному прикладі:

```yaml
# Будь ласка, відредагуйте обʼєкт нижче. Рядки, що починаються з '#', будуть ігноруватися,
# і порожній файл припинить редагування. Якщо виникне помилка під час збереження цього файлу, він буде
# знову відкритий з відповідними збоями.
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

## Прибирання {#clean-up}

Щоб видалити Secret, виконайте наступну команду:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтесь, як [керувати Secret за допомогою файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Дізнайтесь, як [керувати Secret за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
