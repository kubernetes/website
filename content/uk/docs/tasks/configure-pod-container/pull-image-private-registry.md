---
title: Отримання образів з приватного реєстру
content_type: task
weight: 130
---

<!-- overview -->

Ця сторінка показує, як створити Pod, що використовує {{< glossary_tooltip text="Secret" term_id="secret" >}} для отримання образу з приватного реєстру або сховища контейнерних образів. Існує багато приватних реєстрів, які використовуються. У цьому завданні використовується [Docker Hub](https://www.docker.com/products/docker-hub) як приклад реєстру.

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* Для виконання цієї вправи вам потрібно мати інструмент командного рядка `docker`, а також [ідентифікатор Docker](https://docs.docker.com/docker-id/), та пароль до якого ви знаєте.
* Якщо ви використовуєте інший приватний контейнерний реєстр, вам потрібен інструмент командного рядка для цього реєстру та будь-яка інформація для входу в реєстр.

<!-- steps -->

## Увійдіть до Docker Hub {#log-in-to-docker-hub}

На вашому компʼютері вам необхідно автентифікуватися в реєстрі, щоб отримати приватний образ.

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
Якщо ви використовуєте сховище облікових даних Docker, ви не побачите цей запис `auth`, а замість нього буде запис `credsStore` з назвою сховища як значення. У цьому випадку ви можете створити Secret безпосередньо. Дивіться [Створення Secret, за допомогою вводу облікових даних в командному рядку](#create-a-secret-by-providing-credentials-on-the-command-line).
{{< /note >}}

## Створення Secret на основі наявних облікових даних {#registry-secret-existing-credentials}

Кластер Kubernetes використовує Secret типу `kubernetes.io/dockerconfigjson` для автентифікації в контейнерному реєстрі для отримання приватного образу.

Якщо ви вже виконали команду `docker login`, ви можете скопіювати ці облікові дані в Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<шлях/до/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Якщо вам потрібно більше контролю (наприклад, встановити простір імен чи мітку для нового Secret), то ви можете налаштувати Secret перед збереженням його. Переконайтеся, що:

- встановлено назву елемента даних як `.dockerconfigjson`
- файл конфігурації Docker закодовано у base64, а потім вставлено цей рядок без розривів як значення для поля `data[".dockerconfigjson"]`
- встановлено `type` як `kubernetes.io/dockerconfigjson`

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

Якщо ви отримали повідомлення про помилку `error: no objects passed to create`, це може означати, що закодований у base64 рядок є недійсним. Якщо ви отримали повідомлення про помилку, подібне до `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, це означає, що закодований у base64 рядок у даних успішно декодувався, але не може бути розпізнаний як файл `.docker/config.json`.

## Створення Secret, за допомогою вводу облікових даних в командному рядку {#create-a-secret-by-providing-credentials-on-the-command-line}

Створіть цей Secret, назвавши його `regcred`:

```shell
kubectl create secret docker-registry regcred \
    --docker-server=<your-registry-server> \
    --docker-username=<your-name> \
    --docker-password=<your-pword> \
    --docker-email=<your-email>
```

де:

* `<your-registry-server>` — це повна доменна назва вашого приватного реєстру Docker.
  Використовуйте `https://index.docker.io/v1/` для DockerHub.
* `<your-name>` — це ваше імʼя користувача Docker.
* `<your-pword>` — це ваш пароль Docker.
* `<your-email>` — це ваша електронна адреса Docker.

Ви успішно встановили ваші облікові дані Docker у кластері як Secret під назвою `regcred`.

{{< note >}}
Ввід секретів у командному рядку може зберігатися в історії вашої оболонки в незахищеному вигляді, і ці секрети також можуть бути видимими для інших користувачів на вашому компʼютері протягом часу, коли виконується `kubectl`.
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

Щоб зрозуміти, що знаходиться у полі `.dockerconfigjson`, конвертуйте дані Secret в читабельний формат:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

Вивід подібний до такого:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Щоб зрозуміти, що знаходиться у полі `auth`, конвертуйте дані, закодовані в base64, у читабельний формат:

```shell
echo "c3R...zE2" | base64 --decode
```

Вивід, імʼя користувача та пароль, зʼєднані через `:`, подібний до такого:

```none
janedoe:xxxxxxxxxxx
```

Зверніть увагу, що дані Secret містять токен авторизації, аналогічний вашому локальному файлу `~/.docker/config.json`.

Ви успішно встановили ваші облікові дані Docker як Secret з назвою `regcred` у кластері.

## Створення Pod, який використовує ваш Secret {#create-a-pod-that-uses-your-secret}

Нижче подано опис для прикладу Pod, який потребує доступу до ваших облікових даних Docker у `regcred`:

{{% code_sample file="pods/private-reg-pod.yaml" %}}

Завантажте вищезазначений файл на свій компʼютер:

```shell
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

У файлі `my-private-reg-pod.yaml` замініть `<your-private-image>` на шлях до образу у приватному реєстрі, наприклад:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Для отримання образу з приватного реєстру Kubernetes потрібні облікові дані. Поле `imagePullSecrets` у файлі конфігурації вказує, що Kubernetes повинен отримати облікові дані з Secret з назвою `regcred`.

Створіть Pod, який використовує ваш Secret, і перевірте, що Pod працює:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

{{< note >}}
Щоб використовувати Secret для отримання образів для Pod (або Deployment, або іншого обʼєкта, який має шаблон Pod, який ви використовуєте), вам потрібно переконатися, що відповідний Secret існує в правильному просторі імен. Простір імен для використання — той самий, де ви визначили Pod.
{{< /note >}}

Також, якщо запуск Podʼа не вдається і ви отримуєте статус `ImagePullBackOff`, перегляньте події Pod:

```shell
kubectl describe pod private-reg
```

Якщо ви побачите подію з причиною, встановленою на `FailedToRetrieveImagePullSecret`, Kubernetes не може знайти Secret із назвою (`regcred`, у цьому прикладі).

Переконайтеся, що вказаний вами Secret існує і що його назва вірно вказана.

```shell
Events:
  ...  Reason                           ...  Message
       ------                                -------
  ...  FailedToRetrieveImagePullSecret  ...  Unable to retrieve some image pull secrets (<regcred>); attempting to pull the image may not succeed.
```

## Використання образів з кількох реєстрів {#using-images-from-multiple-registries}

Pod може складатись з кількох контейнерів, образи для яких можуть бути з різних реєстрів. Ви можете використовувати кілька `imagePullSecrets` з одним Podʼом, і кожен може містити кілька облікових даних.

Для витягування образів з реєстрів буде спробувано кожний обліковий запис, який відповідає реєстру. Якщо жоден обліковий запис не відповідає реєстру, витягування образу буде відбуватись без авторизації або з використанням конфігурації, специфічної для виконавчого середовища.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Secret](/docs/concepts/configuration/secret/)
  * або перегляньте посилання на API для {{< api-reference page="config-and-storage-resources/secret-v1" >}}
* Дізнайтеся більше про [використання приватного реєстру](/docs/concepts/containers/images/#using-a-private-registry).
* Дізнайтеся більше про [додавання Secrets для отримання образів до службового облікового запису](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Подивіться [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Подивіться поле `imagePullSecrets` у [визначеннях контейнерів](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers) Pod
