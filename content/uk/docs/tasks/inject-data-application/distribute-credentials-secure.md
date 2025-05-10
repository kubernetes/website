---
title: Розповсюдження облікових даних з використанням Secret
content_type: завдання
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

Ця сторінка показує, як безпечно передати чутливі дані, такі як паролі та ключі шифрування, у Podʼи.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

### Перетворення ваших секретних даних у base64 {#convert-your-secret-data-to-base-64-representation}

Припустимо, ви хочете мати дві частини секретних даних: імʼя користувача `my-app` та пароль `39528$vdg7Jb`. Спочатку використайте інструмент кодування base64, щоб перетворити ваше імʼя користувача та пароль на base64. Ось приклад використання загальнодоступної програми base64:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

Вивід показує, що base64 варіант вашого імені користувача — `bXktYXBw`, а base64 вашого пароля — `Mzk1MjgkdmRnN0pi`.

{{< caution >}}
Використовуйте локальний інструмент, якому довіряє ваша ОС, щоб зменшити ризики безпеки зовнішніх інструментів.
{{< /caution >}}

<!-- steps -->

## Створіть Secret {#create-a-secret}

Ось файл конфігурації, який ви можете використати для створення Secret, що містить ваше імʼя користувача та пароль:

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

   ```none
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. Перегляньте більш детальну інформацію про Secret:

   ```shell
   kubectl describe secret test-secret
   ```

   Вивід:

   ```none
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

Якщо ви хочете пропустити крок кодування Base64, ви можете створити такий самий Secret, використовуючи команду `kubectl create secret`. Наприклад:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

Це зручніше. Детальний підхід, показаний раніше, розглядає кожен крок явно, щоб продемонструвати, що відбувається.

## Створіть Pod, який має доступ до секретних даних через Том {#create-a-pod-that-has-access-to-the-secret-data-through-a-volume}

Ось файл конфігурації, який ви можете використати для створення Podʼа:

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

   ```none
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Отримайте доступ до оболонки в контейнері, що працює у вашому Podʼі:

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. Секретні дані доступні контейнеру через Том, змонтований у `/etc/secret-volume`.

   У вашій оболонці перегляньте файли у теці `/etc/secret-volume`:

   ```shell
   # Виконайте це в оболонці всередині контейнера
   ls /etc/secret-volume
   ```

   Вивід показує два файли, один для кожної частини секретних даних:

   ```none
   password username
   ```

1. У вашій оболонці gthtukzymnt вміст файлів `username` та `password`:

   ```shell
   # Виконайте це в оболонці всередині контейнера
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   Вивід — ваше імʼя користувача та пароль:

   ```none
   my-app
   39528$vdg7Jb
   ```

Змініть ваш образ або командний рядок так, щоб програма шукала файли у теці `mountPath`. Кожен ключ у масиві `data` Secretʼу стає імʼям файлу у цій теці.

### Спроєцюйте ключі Secret на конкретні шляхи файлів {#project-secret-keys-to-specific-file-paths}

Ви також можете контролювати шляхи в томі, куди проєцюються ключі Secret. Використовуйте поле `.spec.volumes[].secret.items`, щоб змінити шлях для кожного ключа:

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

При розгортанні цього Podʼа відбувається наступне:

- Ключ `username` з `mysecret` доступний контейнеру за шляхом `/etc/foo/my-group/my-username` замість `/etc/foo/username`.
- Ключ `password` з цього Secret не проєцюється.

Якщо ви отримуєте перелік ключів явно за допомогою `.spec.volumes[].secret.items`, розгляньте наступне:

- Проєцюються тільки ключі, вказані у `items`.
- Щоб використовувати всі ключі з Secret, всі вони повинні бути перераховані у полі `items`.
- Усі перераховані ключі повинні існувати у відповідному Secret. Інакше Том не створюється.

### Встановіть POSIX-права доступу до ключів Secret {#set-posix-permissions-for-secret-keys}

Ви можете встановити POSIX права доступу до файлів для окремого ключа Secret. Якщо ви не вказали жодних дозволів, стандартно використовується `0644`. Ви також можете встановити стандартно режим файлу POSIX для всього тому Secret, і ви можете перевизначити його за потреби для кожного ключа.

Наприклад, ви можете вказати режим стандартно так:

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

Секрет Secret у `/etc/foo`; всі файли, створені томом секрету, мають дозволи `0400`.

{{< note >}}
Якщо ви визначаєте Pod або шаблон Podʼа за допомогою JSON, зверніть увагу, що специфікація JSON не підтримує вісімкові літерали для чисел, оскільки JSON розглядає `0400` як _десяткове_ значення `400`. У JSON використовуйте десяткові значення для `defaultMode`. Якщо ви пишете YAML, ви можете написати `defaultMode` в вісімковій системі числення.
{{< /note >}}

## Визначте змінні середовища контейнера, використовуючи дані з Secret {#define-container-environment-variables-using-secret-data}

Ви можете використовувати дані у Secret як змінні середовища у ваших контейнерах.

Якщо контейнер вже використовує Secret у змінній середовища, оновлення Secret не буде видно контейнеру, якщо він не буде перезапущений. Існують сторонні рішення для виклику перезавантажень, коли змінюються Secret.

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

- У вашій оболонці покажіть вміст змінної середовища контейнера `SECRET_USERNAME`.

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  Вивід схожий на:

  ```none
  backend-admin
  ```

### Визначення змінних середовища контейнера з даними з декількох Secret {#define-container-environment-variables-with-data-from-multiple-secrets}

- Як і у попередньому прикладі, спочатку створіть Secretʼи.

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

- У вашій оболонці покажіть змінні середовища контейнера.

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  Вивід схожий на:

  ```none
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

## налаштування всіх пар ключ-значення в Secret як змінних середовища контейнера {#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables}

{{< note >}}
Ця функціональність доступна у Kubernetes v1.6 та пізніше.
{{< /note >}}

- Створіть Secret, що містить декілька пар ключ-значення

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

- Використовуйте `envFrom`, щоб визначити всі дані Secret як змінні середовища контейнера. Ключ з Secret стає імʼям змінної середовища у Pod.

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

- Створіть Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

- У вашій оболонці покажіть змінні середовища контейнера `username` та `password`.

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  Вивід схожий на:

  ```none
  username: my-app
  password: 39528$vdg7Jb
  ```

## Приклад: Надавання операційних/тестових облікових даних Podʼам за допомогою Secret {#provide-prod-test-creds}

У цьому прикладі показано Pod, який використовує Secret, що містить облікові дані операційного середовища, і ще один Pod, який використовує Secret з обліковими даними тестового середовища.

1. Створіть Secret для облікових даних операційного середовища:

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   Вивід схожий на:

   ```none
   secret "prod-db-secret" created
   ```

1. Створіть Secret для облікових даних тестового середовища.

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   Вивід схожий на:

   ```none
   secret "test-db-secret" created
   ```

   {{< note >}}
   Спеціальні символи, такі як `$`, `\`, `*`, `=`, та `!`, будуть інтерпретовані вашою [оболонкою](https://en.wikipedia.org/wiki/Shell_(computing)) і вимагатимуть екранування.

   У більшості оболонок найпростіший спосіб екранування пароля полягає в обрамленні його одинарними лапками (`'`). Наприклад, якщо ваш фактичний пароль — `S!B\*d$zDsb=`, ви повинні виконати команду наступним чином:

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   Вам не потрібно екранувати спеціальні символи у паролях з файлів (`--from-file`).
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
       name: prod-db-pod
     spec:
       containers:
       - name: prod-db-container
         image: mysql
         env:
         - name: MYSQL_ROOT_PASSWORD
           valueFrom:
             secretKeyRef:
               name: prod-db-secret
               key: password
         - name: MYSQL_DATABASE
           value: mydatabase
         - name: MYSQL_USER
           valueFrom:
             secretKeyRef:
               name: prod-db-secret
               key: username
   - kind: Pod
     apiVersion: v1
     metadata:
       name: test-db-pod
     spec:
       containers:
       - name: test-db-container
         image: mysql
         env:
         - name: MYSQL_ROOT_PASSWORD
           valueFrom:
             secretKeyRef:
               name: test-db-secret
               key: password
         - name: MYSQL_DATABASE
           value: mydatabase
         - name: MYSQL_USER
           valueFrom:
             secretKeyRef:
               name: test-db-secret
               key: username
   EOF
   ```

   {{< note >}}
   Специфікації для двох Podʼів відрізняються лише в одному полі; це сприяє створенню Podʼів з різними можливостями на основі загального шаблону Podʼа.
   {{< /note >}}

1. Застосуйте всі ці обʼєкти на сервер API, виконавши:

   ```shell
   kubectl create -f pod.yaml
   ```

Обидва контейнери матимуть у своїх файлових системах наступні файли зі значеннями для кожного середовища контейнера:

```none
/etc/secret-volume/username
/etc/secret-volume/password
```

Ви також можете подальшим спрощенням базової специфікації Podʼа використовуючи два службові облікові записи:

1. `prod-user` з `prod-db-secret`
2. `test-user` з `test-db-secret`

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

### Довідка {#reference}

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Secret](/docs/concepts/configuration/secret/).
- Дізнайтеся про [Томи](/docs/concepts/storage/volumes/).
