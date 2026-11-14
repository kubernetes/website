---
title: Безпечне розповсюдження облікових даних за допомогою Secrets
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

На цій сторінці показано, як безпечно передавати конфіденційні дані, такі як паролі й ключі шифрування, у Podʼи.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

### Перетворення секретних даних на подання base-64 {#convert-your-secret-data-to-a-base-64-representation}

Припустимо, ви хочете мати два елементи секретних даних: імʼя користувача `my-app` і пароль `39528$vdg7Jb`. Спочатку за допомогою інструмента кодування base64 перетворіть імʼя користувача й пароль на подання base64. Ось приклад із загальнодоступною програмою base64:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

Вивід показує, що подання base-64 вашого імені користувача — `bXktYXBw`, а подання base-64 вашого пароля — `Mzk1MjgkdmRnN0pi`.

{{< caution >}}
Використовуйте локальний інструмент, якому довіряє ваша ОС, щоб зменшити ризики безпеки зовнішніх інструментів.
{{< /caution >}}

<!-- steps -->

## Створіть Secret {#create-a-secret}

Ось файл конфігурації, за допомогою якого можна створити Secret з вашим іменем користувача та паролем:

{{% code_sample file="pods/inject/secret.yaml" %}}

1. Створіть Secret

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

1. Перегляньте інформацію про Secret:

   ```shell
   kubectl get secret test-secret
   ```

   Вивід:

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. Перегляньте докладнішу інформацію про Secret:

   ```shell
   kubectl describe secret test-secret
   ```

   Вивід:

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

### Створіть Secret безпосередньо за допомогою kubectl {#create-a-secret-directly-with-kubectl}

Якщо ви хочете пропустити крок кодування Base64, ви можете створити такий самий Secret за допомогою команди `kubectl create secret`. Наприклад:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

Це зручніше. Докладний підхід, показаний раніше, явно проходить кожен крок, щоб продемонструвати, що відбувається.

## Створіть Pod, який має доступ до секретних даних через том {#create-a-pod-that-has-access-to-the-secret-data-through-a-volume}

Ось файл конфігурації, за допомогою якого можна створити Pod:

{{% code_sample file="pods/inject/secret-pod.yaml" %}}

1. Створіть Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. Перевірте, що ваш Pod працює:

   ```shell
   kubectl get pod secret-test-pod
   ```

   Вивід:

   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Отримайте доступ до оболонки в контейнері, що працює у вашому Podʼі:

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. Секретні дані надаються контейнеру через том, змонтований у `/etc/secret-volume`.

   В оболонці виведіть список файлів у теці `/etc/secret-volume`:

   ```shell
   # Виконайте це в оболонці всередині контейнера
   ls /etc/secret-volume
   ```

   Вивід показує два файли, по одному для кожного елемента секретних даних:

   ```
   password username
   ```

1. В оболонці виведіть вміст файлів `username` і `password`:

   ```shell
   # Виконайте це в оболонці всередині контейнера
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   Вивід — ваше імʼя користувача та пароль:

   ```
   my-app
   39528$vdg7Jb
   ```

Змініть образ або командний рядок так, щоб програма шукала файли в теці `mountPath`. Кожен ключ у словнику `data` обʼєкта Secret стає назвою файлу в цій теці.

### Спроєцюйте ключі Secret на конкретні шляхи файлів {#project-secret-keys-to-specific-file-paths}

Ви також можете контролювати шляхи в томі, куди проєціюються ключі Secret. Використовуйте поле `.spec.volumes[].secret.items`, щоб змінити цільовий шлях кожного ключа:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

Під час розгортання цього Podʼа відбувається таке:

- Ключ `username` з `mysecret` доступний контейнеру за шляхом `/etc/foo/my-group/my-username` замість `/etc/foo/username`.
- Ключ `password` з цього обʼєкта Secret не проєціюється.

Якщо ви явно перелічуєте ключі в `.spec.volumes[].secret.items`, зверніть увагу на таке:

- Проєціюються лише ключі, вказані в `items`.
- Щоб використовувати всі ключі із Secret, усі вони мають бути перелічені в полі `items`.
- Усі перелічені ключі мають існувати у відповідному Secret. Інакше том не створюється.

### Встановіть дозволи POSIX для ключів Secret {#set-posix-permissions-for-secret-keys}

Ви можете встановити біти дозволів доступу до файлу POSIX для окремого ключа Secret. Якщо дозволи не вказано, стандартно використовується `0644`. Ви також можете встановити стандартний режим файлів POSIX для всього тому Secret і за потреби перевизначити його для окремих ключів.

Наприклад, стандартний режим можна вказати так:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

Secret змонтовано в `/etc/foo`; усі файли, створені монтуванням тому Secret, мають дозвіл `0400`.

{{< note >}}
Якщо ви визначаєте Pod або шаблон Podʼа за допомогою JSON, зверніть увагу, що специфікація JSON не підтримує вісімкові літерали чисел, оскільки JSON вважає `0400` _десятковим_ значенням `400`. У JSON натомість використовуйте десяткові значення для `defaultMode`. Якщо ви пишете YAML, `defaultMode` можна вказати у вісімковій системі.
{{< /note >}}

## Визначте змінні середовища контейнера, використовуючи дані з Secret {#define-container-environment-variables-using-secret-data}

Ви можете використовувати дані із Secrets як змінні середовища у своїх контейнерах.

Якщо контейнер уже використовує Secret у змінній середовища, він не побачить оновлення Secret, доки його не буде перезапущено. Існують сторонні рішення для запуску перезапусків у разі зміни Secrets.

### Визначення змінної середовища контейнера з даними з одного Secret {#define-a-container-environment-variable-with-data-from-a-single-secret}

- Визначте змінну середовища як пару ключ-значення в Secret:

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```

- Призначте значення `backend-username`, визначене у Secret, змінній середовища `SECRET_USERNAME` у специфікації Podʼа.

  {{% code_sample file="pods/inject/pod-single-secret-env-variable.yaml" %}}

- Створіть Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

- В оболонці виведіть вміст змінної середовища контейнера `SECRET_USERNAME`.

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  Вивід подібний до такого:

  ```
  backend-admin
  ```

### Визначення змінних середовища контейнера з даними з кількох Secrets {#define-container-environment-variables-with-data-from-multiple-secrets}

- Як і в попередньому прикладі, спочатку створіть Secrets.

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

- Визначте змінні середовища у специфікації Podʼа.

  {{% code_sample file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

- Створіть Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

- В оболонці виведіть змінні середовища контейнера.

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  Вивід подібний до такого:

  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

## Налаштування всіх пар ключ-значення в Secret як змінних середовища контейнера {#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables}

{{< note >}}
Ця можливість доступна в Kubernetes v1.6 і новіших версіях.
{{< /note >}}

- Створіть Secret із кількома парами ключ-значення

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

- Використайте envFrom, щоб визначити всі дані Secret як змінні середовища контейнера. Ключ із Secret стає назвою змінної середовища в Podʼі.

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

- Створіть Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

- В оболонці виведіть змінні середовища контейнера `username` і `password`.

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  Вивід подібний до такого:

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

## Приклад: Надання облікових даних prod/test Podʼам за допомогою Secrets {#provide-prod-test-creds}

У цьому прикладі показано Pod, який використовує Secret з обліковими даними промислового середовища, і ще один Pod, який використовує Secret з обліковими даними тестового середовища.

1. Створіть Secret для облікових даних промислового середовища:

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   Вивід подібний до такого:

   ```
   secret "prod-db-secret" created
   ```

1. Створіть Secret для облікових даних тестового середовища.

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   Вивід подібний до такого:

   ```
   secret "test-db-secret" created
   ```

   {{< note >}}
   Спеціальні символи, такі як `$`, `\`, `*`, `=` і `!`, інтерпретуватимуться вашою [оболонкою](https://en.wikipedia.org/wiki/Shell_(computing)) і потребують екранування.

   У більшості оболонок найпростіший спосіб екранувати пароль — взяти його в одинарні лапки (`'`). Наприклад, якщо ваш фактичний пароль — `S!B\*d$zDsb=`, виконайте команду так:

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   Спеціальні символи в паролях із файлів (`--from-file`) екранувати не потрібно.
   {{< /note >}}

1. Створіть маніфести Podʼів:

   ```shell
   cat <<EOF > pod.yaml
   apiVersion: v1
   kind: List
   items:
   - kind: Pod
     apiVersion: v1
     metadata:
       name: prod-db-client-pod
       labels:
         name: prod-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: prod-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   - kind: Pod
     apiVersion: v1
     metadata:
       name: test-db-client-pod
       labels:
         name: test-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: test-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   EOF
   ```

   {{< note >}}
   Зверніть увагу, що специфікації двох Podʼів відрізняються лише одним полем; це полегшує створення Podʼів із різними можливостями на основі спільного шаблону Podʼа.
   {{< /note >}}

1. Застосуйте всі ці обʼєкти на API-сервері, виконавши:

   ```shell
   kubectl create -f pod.yaml
   ```

Обидва контейнери матимуть у своїх файлових системах такі файли зі значеннями для середовища кожного контейнера:

```
/etc/secret-volume/username
/etc/secret-volume/password
```

Базову специфікацію Podʼа можна ще спростити, використовуючи два ServiceAccounts:

1. `prod-user` з `prod-db-secret`
1. `test-user` з `test-db-secret`

Специфікація Podʼа скорочується до:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### Посилання {#references}

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [Secrets](/docs/concepts/configuration/secret/).
- Дізнайтеся про [томи](/docs/concepts/storage/volumes/).
