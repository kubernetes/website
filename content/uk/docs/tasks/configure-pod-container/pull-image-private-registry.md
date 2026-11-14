---
title: Завантаження образу з приватного реєстру
content_type: task
weight: 130
---

<!-- overview -->

Ця сторінка показує, як створити Pod, що використовує {{< glossary_tooltip text="Secret" term_id="secret" >}} для завантаження образу з приватного реєстру або репозиторію образів контейнерів. Використовується багато приватних реєстрів. У цьому завданні як приклад реєстру використано [Docker Hub](https://www.docker.com/products/docker-hub).

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}}

* Для виконання цієї вправи вам потрібен інструмент командного рядка `docker`, а також [Docker ID](https://docs.docker.com/docker-id/), пароль до якого ви знаєте.
* Якщо ви використовуєте інший приватний контейнерний реєстр, вам потрібен інструмент командного рядка для цього реєстру та будь-яка інформація для входу в реєстр.

<!-- steps -->

## Увійдіть до Docker Hub {#log-in-to-docker-hub}

На своєму компʼютері ви маєте автентифікуватися в реєстрі, щоб завантажити приватний образ.

Використовуйте інструмент `docker`, щоб увійти до Docker Hub. Докладніше про це дивіться у розділі _log in_ на сторінці [Docker ID accounts](https://docs.docker.com/docker-id/#log-in).

```shell
docker login
```

Коли буде запитано, введіть свій ідентифікатор Docker, а потім обрані вами облікові дані (токен доступу чи пароль до вашого Docker ID).

Процес входу створює або оновлює файл `config.json`, який містить токен авторизації. Ознайомтеся з [тим, як Kubernetes інтерпретує цей файл](/docs/concepts/containers/images#config-json).

Перегляньте файл `config.json`:

```shell
cat ~/.docker/config.json
```

Вивід містить секцію, подібну до цієї:

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

{{< note >}}
Якщо ви використовуєте сховище облікових даних Docker, ви не побачите запису `auth`, натомість буде запис `credsStore` з назвою сховища як значенням. У такому разі можна створити Secret безпосередньо. Дивіться [Створення Secret із зазначенням облікових даних у командному рядку](#create-a-secret-by-providing-credentials-on-the-command-line).
{{< /note >}}

## Створення Secret на основі наявних облікових даних {#registry-secret-existing-credentials}

Кластер Kubernetes використовує Secret типу `kubernetes.io/dockerconfigjson` для автентифікації в реєстрі контейнерів, щоб завантажити приватний образ.

Якщо ви вже виконали команду `docker login`, ви можете скопіювати ці облікові дані в Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Якщо вам потрібно більше контролю (наприклад, щоб задати простір імен або мітку для нового Secret), можна налаштувати Secret перед його збереженням. Обовʼязково:

- задайте назву елемента даних `.dockerconfigjson`
- закодуйте файл конфігурації Docker у base64 і вставте отриманий рядок без розривів як значення поля `data[".dockerconfigjson"]`
- встановіть `type` у `kubernetes.io/dockerconfigjson`

Приклад:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

Якщо ви отримали повідомлення про помилку `error: no objects passed to create`, це може означати, що рядок у base64 недійсний. Якщо ви отримали повідомлення про помилку на кшталт `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, це означає, що рядок у base64 у даних успішно декодовано, але його не вдалося розібрати як файл `.docker/config.json`.

## Створення Secret із зазначенням облікових даних у командному рядку {#create-a-secret-by-providing-credentials-on-the-command-line}

Створіть цей Secret, назвавши його `regcred`:

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

де:

* `<your-registry-server>` — це повна доменна назва вашого приватного реєстру Docker.
  Використовуйте `https://index.docker.io/v1/` для DockerHub.
* `<your-name>` — це ваше імʼя користувача Docker.
* `<your-pword>` — це ваш пароль Docker.
* `<your-email>` — це ваша електронна адреса Docker.

Ви успішно встановили ваші облікові дані Docker у кластері як Secret під назвою `regcred`.

{{< note >}}
Введення секретів у командному рядку може зберегти їх в історії вашої оболонки без захисту, а ще ці секрети можуть бути видимі іншим користувачам вашого компʼютера, поки виконується `kubectl`.
{{< /note >}}

## Перегляд Secret `regcred` {#inspecting-the-secret-regcred}

Щоб зрозуміти вміст Secret `regcred`, який ви створили, спочатку перегляньте Secret у форматі YAML:

```shell
kubectl get secret regcred --output=yaml
```

Вивід подібний до такого:

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
type: kubernetes.io/dockerconfigjson
```

Значення поля `.dockerconfigjson` — це представлення в base64 ваших облікових даних Docker.

Щоб зрозуміти, що міститься в полі `.dockerconfigjson`, перетворіть дані Secret у читабельний формат:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

Вивід подібний до такого:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Щоб зрозуміти, що міститься в полі `auth`, перетворіть дані, закодовані в base64, у читабельний формат:

```shell
echo "c3R...zE2" | base64 --decode
```

Вивід — імʼя користувача й пароль, зʼєднані через `:`, — подібний до такого:

```none
janedoe:xxxxxxxxxxx
```

Зверніть увагу, що дані Secret містять токен авторизації, аналогічний вашому локальному файлу `~/.docker/config.json`.

Ви успішно встановили ваші облікові дані Docker як Secret з назвою `regcred` у кластері.

## Створення Podʼа, який використовує ваш Secret {#create-a-pod-that-uses-your-secret}

Ось маніфест для прикладу Podʼа, якому потрібен доступ до ваших облікових даних Docker у `regcred`:

{{% code_sample file="pods/private-reg-pod.yaml" %}}

Завантажте наведений вище файл на свій компʼютер:

```shell
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

У файлі `my-private-reg-pod.yaml` замініть `<your-private-image>` на шлях до образу у приватному реєстрі, наприклад:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Щоб завантажити образ з приватного реєстру, Kubernetes потрібні облікові дані. Поле `imagePullSecrets` у файлі конфігурації вказує, що Kubernetes має отримати облікові дані з Secret з назвою `regcred`.

Створіть Pod, який використовує ваш Secret, і перевірте, що Pod працює:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

{{< note >}}
Щоб використовувати Secret для завантаження образів для Podʼа (або Deployment чи іншого обʼєкта із шаблоном Podʼа, який ви використовуєте), переконайтеся, що відповідний Secret існує в правильному просторі імен. Використовувати слід той самий простір імен, у якому ви визначили Pod.
{{< /note >}}

Також якщо Pod не запускається і має статус `ImagePullBackOff`, перегляньте події Podʼа:

```shell
kubectl describe pod private-reg
```

Якщо ви бачите подію з причиною `FailedToRetrieveImagePullSecret`, Kubernetes не може знайти Secret з назвою (у цьому прикладі `regcred`).

Переконайтеся, що вказаний вами Secret існує і що його назву написано правильно.

```shell
Events:
  ...  Reason                           ...  Message
       ------                                -------
  ...  FailedToRetrieveImagePullSecret  ...  Unable to retrieve some image pull secrets (<regcred>); attempting to pull the image may not succeed.
```

## Використання образів з кількох реєстрів {#using-images-from-multiple-registries}

Pod може мати кілька контейнерів, і образ кожного контейнера може бути з іншого реєстру. З одним Podʼом можна використовувати кілька `imagePullSecrets`, і кожен може містити кілька облікових даних.

Завантажити образ буде спробувано з кожними обліковими даними, що відповідають реєстру. Якщо жодні облікові дані не відповідають реєстру, образ спробують завантажити без авторизації або з використанням власної конфігурації, специфічної для середовища виконання.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Secret](/docs/concepts/configuration/secret/)
  * або прочитайте довідник API для {{< api-reference page="core/secret-v1" >}}
* Дізнайтеся більше про [використання приватного реєстру](/docs/concepts/containers/images/#using-a-private-registry).
* Дізнайтеся більше про [додавання Secret для завантаження образів до службового облікового запису](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Подивіться [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Дивіться поле `imagePullSecrets` у [визначеннях контейнерів](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers) Podʼа
