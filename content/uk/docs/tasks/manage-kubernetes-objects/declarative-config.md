---
title: Декларативне керування обʼєктами Kubernetes за допомогою файлів конфігурації
content_type: task
weight: 10
---

<!-- overview -->

Обʼєкти Kubernetes можна створювати, оновлювати й видаляти, зберігаючи кілька файлів конфігурації обʼєктів у теці та використовуючи `kubectl apply` для рекурсивного створення й оновлення цих обʼєктів за потреби. Цей метод зберігає записи, зроблені в живих обʼєктах, без внесення змін назад до файлів конфігурації обʼєктів. `kubectl diff` також дає змогу попередньо переглянути зміни, які внесе `apply`.

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Компроміси {#trade-offs}

Інструмент `kubectl` підтримує три види керування обʼєктами:

* Імперативні команди
* Імперативне конфігурування обʼєктів
* Декларативна конфігурація обʼєктів

Переваги й недоліки кожного виду керування обʼєктами розглянуто в розділі [Управління обʼєктами Kubernetes](/docs/concepts/overview/working-with-objects/object-management/).

## Огляд {#overview}

Декларативна конфігурація обʼєктів потребує чіткого розуміння визначень і конфігурації обʼєктів Kubernetes. Прочитайте й виконайте наведені нижче документи, якщо ви ще цього не зробили:

* [Керування обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Імперативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)

Нижче подано визначення термінів, використаних у цьому документі:

- *файл конфігурації обʼєкта / файл конфігурації*: файл, який визначає конфігурацію обʼєкта Kubernetes. У цій темі показано, як передавати файли конфігурації до `kubectl apply`. Файли конфігурації зазвичай зберігаються в системі контролю версій, як-от Git.
- *жива конфігурація обʼєкта / жива конфігурація*: живі значення конфігурації обʼєкта, які спостерігає кластер Kubernetes. Вони зберігаються у сховищі кластера Kubernetes, зазвичай etcd.
- *декларативний записувач конфігурації / декларативний записувач*: особа або програмний компонент, що вносить оновлення до живого обʼєкта. Живі записувачі, про яких ідеться в цій темі, змінюють файли конфігурації обʼєктів і запускають `kubectl apply`, щоб записати зміни.

## Як створити обʼєкти {#how-to-create-objects}

Використовуйте `kubectl apply`, щоб створити всі обʼєкти, визначені файлами конфігурації у вказаній теці, за винятком тих, що вже існують:

```shell
kubectl apply -f <directory>
```

Це встановлює анотацію `kubectl.kubernetes.io/last-applied-configuration: '{...}'` для кожного обʼєкта. Анотація містить вміст файлу конфігурації обʼєкта, який був використаний для створення обʼєкта.

{{< note >}}
Додайте прапорець `-R`, щоб рекурсивно обробляти теки.
{{< /note >}}

Ось приклад файлу конфігурації обʼєкта:

{{% code_sample file="application/simple_deployment.yaml" %}}

Виконайте `kubectl diff`, щоб вивести обʼєкт, який буде створено:

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
`diff` використовує [запуск без внесення змін на сервері (dry-run)](/docs/reference/using-api/api-concepts/#dry-run), таку можливість потрібно ввімкнути на `kube-apiserver`.

Оскільки `diff` виконує запит застосування на стороні сервера в режимі dry-run, для нього потрібно надати дозволи `PATCH`, `CREATE` і `UPDATE`. Докладніше дивіться в розділі [Авторизація запуску dry-run](/docs/reference/using-api/api-concepts#dry-run-authorization).
{{< /note >}}

Створіть обʼєкт за допомогою `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Виведіть живу конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що анотація `kubectl.kubernetes.io/last-applied-configuration` була записана до живої конфігурації та відповідає файлу конфігурації:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Це json-представлення simple_deployment.yaml
    # Його записав kubectl apply під час створення обʼєкта
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

## Як оновити обʼєкти {#how-to-update-objects}

Ви також можете використовувати `kubectl apply`, щоб оновити всі обʼєкти, визначені в теці, навіть якщо ці обʼєкти вже існують. Цей підхід робить таке:

1. Встановлює в живій конфігурації поля, що є у файлі конфігурації.
2. Очищає в живій конфігурації поля, вилучені з файлу конфігурації.

```shell
kubectl diff -f <directory>
kubectl apply -f <directory>
```

{{< note >}}
Додайте прапорець `-R`, щоб рекурсивно обробляти теки.
{{< /note >}}

Ось приклад файлу конфігурації:

{{% code_sample file="application/simple_deployment.yaml" %}}

Створіть обʼєкт за допомогою `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
Для наочності наведена вище команда посилається на один файл конфігурації, а не на теку.
{{< /note >}}

Виведіть живу конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що анотація `kubectl.kubernetes.io/last-applied-configuration` була записана до живої конфігурації та відповідає файлу конфігурації:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Це json-представлення simple_deployment.yaml
    # Його записав kubectl apply під час створення обʼєкта
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

Оновіть поле `replicas` безпосередньо в живій конфігурації за допомогою `kubectl scale`. Тут `kubectl apply` не використовується:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Виведіть живу конфігурацію за допомогою `kubectl get`:

```shell
kubectl get deployment nginx-deployment -o yaml
```

Вивід показує, що поле `replicas` встановлено на 2, і анотація `last-applied-configuration`
не містить поле `replicas`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # зверніть увагу, що анотація не містить replicas
    # оскільки це поле не оновлювалося через apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # записано командою scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Оновіть файл конфігурації `simple_deployment.yaml`, щоб змінити образ з `nginx:1.14.2` на `nginx:1.16.1` та видалити поле `minReadySeconds`:

{{% code_sample file="application/update_deployment.yaml" %}}

Застосуйте зміни, внесені до файлу конфігурації:

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

Виведіть живу конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

Вивід показує такі зміни в живій конфігурації:

* Поле `replicas` зберігає значення 2, встановлене `kubectl scale`. Це можливо, бо воно відсутнє у файлі конфігурації.
* Поле `image` оновлено з `nginx:1.14.2` до `nginx:1.16.1`.
* Анотацію `last-applied-configuration` оновлено новим образом.
* Поле `minReadySeconds` очищено.
* Анотація `last-applied-configuration` більше не містить поле `minReadySeconds`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Анотація містить оновлений образ nginx 1.16.1,
    # але не містить оновлення replicas до 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Встановлено за допомогою `kubectl scale`. Ігнорується `kubectl apply`.
  # minReadySeconds очищено за допомогою `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Встановлено за допомогою `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
Поєднання `kubectl apply` з командами імперативної конфігурації обʼєктів `create` і `replace` не підтримується. Це тому, що `create` і `replace` не зберігають `kubectl.kubernetes.io/last-applied-configuration`, який `kubectl apply` використовує для обчислення оновлень.
{{< /warning >}}

## Як видалити обʼєкти {#how-to-delete-objects}

Існують два підходи до видалення обʼєктів, керованих за допомогою `kubectl apply`.

### Рекомендований: `kubectl delete -f <filename>` {#recommended-kubectl-delete-f-filename}

Рекомендований підхід — видаляти обʼєкти вручну за допомогою імперативної команди, оскільки так явніше видно, що саме видаляється, і менша ймовірність, що користувач випадково щось видалить:

```shell
kubectl delete -f <filename>
```

### Альтернатива: `kubectl apply -f <directory> --prune` {#alternative-kubectl-apply-f-directory-prune}

Як альтернативу `kubectl delete`, ви можете використовувати `kubectl apply` для ідентифікації обʼєктів, які мають бути видалені після видалення їх маніфестів з теки у локальній файловій системі.

У Kubernetes {{< skew currentVersion >}} у kubectl apply доступні два режими очищення:

- Очищення на основі allowlist: цей режим існує з kubectl v1.5, але досі перебуває на етапі альфа через проблеми зі зручністю використання, коректністю та продуктивністю його дизайну. Режим на основі ApplySet призначений для його заміни.
- Очищення на основі ApplySet: _apply set_ — це обʼєкт на стороні сервера (стандартно Secret), який kubectl може використовувати для точного й ефективного відстеження членства в наборі під час операцій **apply**. Цей режим зʼявився як альфа у kubectl v1.27 на заміну очищенню на основі allowlist.

{{< tabs name="kubectl_apply_prune" >}}
{{% tab name="Allow list" %}}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

{{< warning >}}
Будьте обережні, використовуючи `--prune` з `kubectl apply` у режимі allowlist. Те, які обʼєкти очищаються, залежить від значень прапорців `--prune-allowlist`, `--selector` і `--namespace` та ґрунтується на динамічному виявленні обʼєктів в області дії. Особливо якщо значення прапорців змінюються між викликами, це може призвести до неочікуваного видалення або збереження обʼєктів.
{{< /warning >}}

Щоб використовувати очищення на основі allowlist, додайте такі прапорці до виклику `kubectl apply`:

- `--prune`: видалити раніше застосовані обʼєкти, яких немає в наборі, переданому поточному виклику.
- `--prune-allowlist`: список груп-версій-типів (GVK) для розгляду під час очищення. Цей прапорець необовʼязковий, але наполегливо рекомендований, оскільки його стандартне значення — це частковий список типів як у просторах імен, так і в області кластера, що може призвести до несподіваних результатів.
- `--selector/-l`: використовуйте селектор міток, щоб обмежити набір обʼєктів, вибраних для очищення. Цей прапорець необовʼязковий, але наполегливо рекомендований.
- `--all`: використовуйте замість `--selector/-l`, щоб явно вибрати всі раніше застосовані обʼєкти типів зі списку дозволених.

Очищення на основі allowlist запитує в API-сервера всі обʼєкти дозволених GVK, що відповідають заданим міткам (якщо такі є), і намагається зіставити отримані живі конфігурації обʼєктів із файлами маніфестів обʼєктів. Якщо обʼєкт відповідає запиту, не має маніфесту в теці та має анотацію `kubectl.kubernetes.io/last-applied-configuration`, його буде видалено.

```shell
kubectl apply -f <directory> --prune -l <labels> --prune-allowlist=<gvk-list>
```

{{< warning >}}
Apply із prune слід виконувати лише для кореневої теки, що містить маніфести обʼєктів. Виконання для підтек може призвести до ненавмисного видалення обʼєктів, які раніше були застосовані, мають задані мітки (якщо є) і не зʼявляються в підтеці.
{{< /warning >}}

{{% /tab %}}

{{% tab name="Apply set" %}}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< caution >}}
`kubectl apply --prune --applyset` перебуває на етапі альфа, і в наступних випусках можуть зʼявитися несумісні зміни.
{{< /caution >}}

Щоб використовувати очищення на основі ApplySet, встановіть змінну середовища `KUBECTL_APPLYSET=true` і додайте такі прапорці до виклику `kubectl apply`:

- `--prune`: видалити раніше застосовані обʼєкти, яких немає в наборі, переданому поточному виклику.
- `--applyset`: назва обʼєкта, який kubectl може використовувати для точного й ефективного відстеження членства в наборі під час операцій `apply`.

```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory> --prune --applyset=<name>
```

Стандартно тип батьківського обʼєкта ApplySet — Secret. Однак також можна використовувати ConfigMaps у форматі `--applyset=configmaps/<name>`. Якщо використовується Secret або ConfigMap, kubectl створить обʼєкт, якщо його ще немає.

Також можна використовувати власні ресурси як батьківські обʼєкти ApplySet. Для цього додайте до Custom Resource Definition (CRD), що визначає потрібний ресурс, мітку `applyset.kubernetes.io/is-parent-type: true`. Потім створіть обʼєкт, який ви хочете використовувати як батьківський обʼєкт ApplySet (kubectl не робить цього автоматично для власних ресурсів). Нарешті, посилайтеся на цей обʼєкт у прапорці applyset так: `--applyset=<resource>.<group>/<name>` (наприклад, `widgets.custom.example.com/widget-name`).

Під час очищення на основі ApplySet kubectl додає мітку `applyset.kubernetes.io/part-of=<parentID>` до кожного обʼєкта в наборі перед надсиланням на сервер. З міркувань продуктивності він також збирає список типів ресурсів і просторів імен, що містить набір, і додає їх в анотації живого батьківського обʼєкта. Нарешті, наприкінці операції apply він запитує в API-сервера обʼєкти цих типів у цих просторах імен (або в області кластера, якщо потрібно), що належать до набору, визначеного міткою `applyset.kubernetes.io/part-of=<parentID>`.

Застереження та обмеження:

- Кожен обʼєкт може бути членом не більше одного набору.
- Прапорець `--namespace` обовʼязковий під час використання будь-якого батьківського обʼєкта в просторі імен, зокрема стандартного Secret. Це означає, що ApplySets, які охоплюють кілька просторів імен, мають використовувати як батьківський обʼєкт власний ресурс в області кластера.
- Щоб безпечно використовувати очищення на основі ApplySet з кількома теками, використовуйте унікальну назву ApplySet для кожної.

{{% /tab %}}

{{< /tabs >}}

## Як переглянути обʼєкт {#how-to-view-an-object}

Ви можете використовувати `kubectl get` з `-o yaml`, щоб переглянути конфігурацію живого обʼєкта:

```shell
kubectl get -f <filename|url> -o yaml
```

## Як apply обчислює різницю та обʼєднує зміни {#how-apply-calculates-differences-and-merges-changes}

{{< caution >}}
*Патч* — це операція оновлення, обмежена конкретними полями обʼєкта, а не всім обʼєктом. Це дає змогу оновлювати лише певний набір полів обʼєкта без попереднього читання обʼєкта.
{{< /caution >}}

Коли `kubectl apply` оновлює живу конфігурацію обʼєкта, він робить це, надсилаючи запит на патч до API-сервера. Патч визначає оновлення для конкретних полів конфігурації живого обʼєкта. Команда `kubectl apply` обчислює цей запит на патч за допомогою файлу конфігурації, живої конфігурації та анотації `last-applied-configuration`, збереженої в живій конфігурації.

### Обчислення merge patch {#merge-patch-calculation}

Команда `kubectl apply` записує вміст файлу конфігурації до анотації `kubectl.kubernetes.io/last-applied-configuration`. Вона використовується для визначення полів, які було вилучено з файлу конфігурації й потрібно очистити з живої конфігурації. Ось кроки для обчислення того, які поля слід видалити або встановити:

1. Обчислити поля для видалення. Це поля, які присутні в `last-applied-configuration` та відсутні у файлі конфігурації.
2. Обчислити поля для додавання або встановлення. Це поля, які присутні у файлі конфігурації, значення яких не відповідають живій конфігурації.

Ось приклад. Припустимо, що це файл конфігурації для обʼєкта Deployment:

{{% code_sample file="application/update_deployment.yaml" %}}

Також, припустимо, що це жива конфігурація для того самого обʼєкта Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # зверніть увагу, що анотація не містить replicas
    # оскільки це поле не оновлювалося через apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # записано командою scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Ось обчислення злиття, які виконає `kubectl apply`:

1. Обчислити поля для видалення, прочитавши значення з `last-applied-configuration` і порівнявши їх зі значеннями у файлі конфігурації. Очистити поля, явно встановлені в null у локальному файлі конфігурації обʼєкта, незалежно від того, чи є вони в `last-applied-configuration`. У цьому прикладі `minReadySeconds` є в анотації `last-applied-configuration`, але немає у файлі конфігурації. **Дія:** очистити `minReadySeconds` у живій конфігурації.
2. Обчислити поля для встановлення, прочитавши значення з файлу конфігурації й порівнявши їх зі значеннями в живій конфігурації. У цьому прикладі значення `image` у файлі конфігурації не збігається зі значенням у живій конфігурації. **Дія:** встановити значення `image` у живій конфігурації.
3. Встановити анотацію `last-applied-configuration`, щоб вона відповідала значенню файлу конфігурації.
4. Обʼєднати результати з 1, 2, 3 у єдиний запит на патч до API-сервера.

Ось жива конфігурація, яка є результатом злиття:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Анотація містить оновлений образ nginx 1.16.1,
    # але не містить оновлення replicas до 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Встановлено за допомогою `kubectl scale`. Ігнорується `kubectl apply`.
  # minReadySeconds очищено за допомогою `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Встановлено за допомогою `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

### Як зливаються поля різних типів {#how-different-types-of-fields-are-merged}

Те, як певне поле у файлі конфігурації зливається з живою конфігурацією, залежить від типу поля. Існує кілька типів полів:

- *primitive*: поле типу рядок, ціле число або логічне значення. Наприклад, `image` і `replicas` є полями primitive. **Дія:** замінити.

- *map*, також званий *object*: поле типу map або складний тип, що містить підполя. Наприклад, `labels`, `annotations`, `spec` і `metadata` — це map. **Дія:** злити елементи або підполя.

- *list*: поле, що містить список елементів, які можуть бути типів primitive або map. Наприклад, `containers`, `ports` і `args` є списками. **Дія:** залежить від випадку.

Коли `kubectl apply` оновлює поле map або list, він зазвичай не замінює все поле, а оновлює окремі піделементи. Наприклад, під час злиття `spec` у Deployment весь `spec` не замінюється. Натомість порівнюються й зливаються підполя `spec`, як-от `replicas`.

### Злиття змін для полів типу primitive {#merging-changes-to-primitive-fields}

Поля primitive замінюються або очищаються.

{{< note >}}
`-` використовується для "not applicable", оскільки значення не використовується.
{{< /note >}}

| Поле у файлі конфігурації обʼєкта | Поле в живій конфігурації обʼєкта | Поле в last-applied-configuration | Дія                                          |
|----------------------------------------|-----------------------------------|-----------------------------------------|---------------------------------------------|
| Так                                    | Так                               | -                                       | Встановити живе значення з файлу конфігурації.  |
| Так                                    | Ні                                | -                                       | Встановити живе значення з локальної конфігурації. |
| Ні                                     | -                                 | Так                                     | Очистити з живої конфігурації.             |
| Ні                                     | -                                 | Ні                                      | Нічого не робити. Зберегти живе значення.   |

### Злиття змін у полях типу map {#merging-changes-to-map-fields}

Поля, які є map, зливаються шляхом порівняння кожного з підполів або елементів map:

{{< note >}}
`-` використовується для "not applicable", оскільки значення не використовується.
{{< /note >}}

| Ключ у файлі конфігурації обʼєкта | Ключ у живій конфігурації обʼєкта | Поле в last-applied-configuration | Дія                                     |
|----------------------------------------|------------------------------------|--------------------------------------------|----------------------------------------|
| Так                                    | Так                                | -                                          | Порівняти значення підполів.          |
| Так                                    | Ні                                 | -                                          | Встановити живе значення з локальної конфігурації. |
| Ні                                     | -                                  | Так                                        | Видалити з живої конфігурації.       |
| Ні                                     | -                                  | Ні                                         | Нічого не робити. Зберегти живе значення. |

### Злиття змін для полів типу list {#merging-changes-for-fields-of-type-list}

Злиття змін у list використовує одну з трьох стратегій:

* Заміна list, якщо всі його елементи є primitive.
* Злиття окремих елементів у списку складних елементів.
* Злиття list елементів primitive.

Вибір стратегії залежить від конкретного поля.

#### Заміна list, якщо всі його елементи є primitive {#replace-the-list-if-all-its-elements-are-primitives}

Список обробляється так само, як поле primitive. Замініть або видаліть увесь список. Це зберігає порядок.

**Приклад:** Використовуйте `kubectl apply`, щоб оновити поле `args` контейнера в Podʼі. Це встановлює значення `args` в живій конфігурації на значення у файлі конфігурації. Будь-які елементи `args`, які раніше були додані до живої конфігурації, втрачаються. Порядок елементів `args`, визначених у файлі конфігурації, зберігається у живій конфігурації.

```yaml
# Значення last-applied-configuration
    args: ["a", "b"]

# Значення файлу конфігурації
    args: ["a", "c"]

# Жива конфігурація
    args: ["a", "b", "d"]

# Результат після злиття
    args: ["a", "c"]
```

**Пояснення:** Під час злиття значення з файлу конфігурації використано як нове значення списку.

#### Злиття окремих елементів списку складних елементів: {#merge-individual-elements-of-a-list-of-complex-elements}

Обробляйте список як map, а конкретне поле кожного елемента — як ключ. Додавайте, видаляйте або оновлюйте окремі елементи. Це не зберігає порядок.

Ця стратегія злиття використовує спеціальний теґ кожного поля, який називається `patchMergeKey`. `patchMergeKey` визначено для кожного поля у вихідному коді Kubernetes: [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747) Під час злиття списку map поле, вказане як `patchMergeKey` для певного елемента, використовується як ключ map для цього елемента.

**Приклад:** Використайте `kubectl apply`, щоб оновити поле `containers` у PodSpec. Це зливає список так, ніби він є map, у якому ключем кожного елемента є `name`.

```yaml
# Значення last-applied-configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # ключ: nginx-helper-a; буде видалено в результаті
      image: helper:1.3
    - name: nginx-helper-b # ключ: nginx-helper-b; буде збережено
      image: helper:1.3

# Значення файлу конфігурації
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # ключ: nginx-helper-c; буде додано в результаті
      image: helper:1.3

# Жива конфігурація
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Поле буде збережено
    - name: nginx-helper-d # ключ: nginx-helper-d; буде збережено
      image: helper:1.3

# Результат після злиття
    containers:
    - name: nginx
      image: nginx:1.16
      # Елемент nginx-helper-a видалено
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Поле збережено
    - name: nginx-helper-c # Елемент додано
      image: helper:1.3
    - name: nginx-helper-d # Елемент проігноровано
      image: helper:1.3
```

**Пояснення:**

- Контейнер з назвою "nginx-helper-a" видалено, оскільки у файлі конфігурації немає контейнера з назвою "nginx-helper-a".
- Контейнер з назвою "nginx-helper-b" зберіг зміни в `args` у живій конфігурації. `kubectl apply` зміг визначити, що "nginx-helper-b" у живій конфігурації — це той самий "nginx-helper-b", що й у файлі конфігурації, хоча їхні поля мали різні значення (у файлі конфігурації немає `args`). Це тому, що значення поля `patchMergeKey` (name) було однаковим в обох.
- Контейнер з назвою "nginx-helper-c" додано, оскільки в живій конфігурації не було контейнера з такою назвою, а у файлі конфігурації він був.
- Контейнер з назвою "nginx-helper-d" збережено, оскільки в last-applied-configuration не було елемента з такою назвою.

#### Злиття списку елементів типу primitive {#merge-a-list-of-primitive-elements}

Станом на Kubernetes 1.5 злиття списків елементів типу primitive не підтримується.

{{< note >}}
Вибір стратегії для певного поля визначається теґом `patchStrategy` у [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748) Якщо для поля типу list не вказано `patchStrategy`, список замінюється.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Розкоментуйте це для 1.6

- Трактувати список як набір primitive. Замінюйте або видаляйте окремі елементи. Не зберігає порядок. Не зберігає дублікати.

**Приклад:** Використання apply для оновлення поля `finalizers` у ObjectMeta зберігає додані до живої конфігурації елементи. Порядок завершувачів втрачається.
{{< /comment >}}

## Стандартні значення полів {#default-field-values}

API-сервер встановлює певним полям стандартні значення в живій конфігурації, якщо їх не вказано під час створення обʼєкта.

Ось файл конфігурації для обʼєкта Deployment. У файлі не вказано `strategy`:

{{% code_sample file="application/simple_deployment.yaml" %}}

Створіть обʼєкт, використовуючи `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Виведіть живу конфігурацію, використовуючи `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що API-сервер встановив кільком полям стандартні значення в живій конфігурації. Ці поля не було вказано у файлі конфігурації.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # стандартне значення від apiserver
  strategy:
    rollingUpdate: # стандартне значення від apiserver, виведене з strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # стандартне значення від apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # стандартне значення від apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # стандартне значення від apiserver
        resources: {} # стандартне значення від apiserver
        terminationMessagePath: /dev/termination-log # стандартне значення від apiserver
      dnsPolicy: ClusterFirst # стандартне значення від apiserver
      restartPolicy: Always # стандартне значення від apiserver
      securityContext: {} # стандартне значення від apiserver
      terminationGracePeriodSeconds: 30 # стандартне значення від apiserver
# ...
```

У запиті на патч поля зі стандартними значеннями не отримують стандартні значення повторно, якщо їх явно не очищено в цьому запиті. Це може спричинити неочікувану поведінку полів, стандартні значення яких залежать від інших полів. Коли ці інші поля згодом змінюються, виведені з них значення не оновлюються, якщо їх явно не очистити.

Тому рекомендовано явно визначати у файлі конфігурації певні поля, стандартні значення яких задає сервер, навіть якщо бажані значення збігаються зі стандартними значеннями сервера. Так легше розпізнавати конфліктні значення, які сервер не встановить повторно.

**Приклад:**

```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# Файл конфігурації
spec:
  strategy:
    type: Recreate # оновлене значення
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# Жива конфігурація
spec:
  strategy:
    type: RollingUpdate # стандартне значення
    rollingUpdate: # стандартне значення, виведене з type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# Результат після злиття — ПОМИЛКА!
spec:
  strategy:
    type: Recreate # оновлене значення: несумісне з rollingUpdate
    rollingUpdate: # стандартне значення: несумісне з "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

**Пояснення:**

1. Користувач створює Deployment без визначення `strategy.type`.
2. Сервер встановлює для `strategy.type` стандартне значення `RollingUpdate` і стандартні значення для `strategy.rollingUpdate`.
3. Користувач змінює `strategy.type` на `Recreate`. Значення `strategy.rollingUpdate` лишаються стандартними, хоча сервер очікує, що їх буде очищено. Якби значення `strategy.rollingUpdate` було спочатку визначено у файлі конфігурації, було б зрозуміліше, що їх потрібно видалити.
4. Apply завершується збоєм, бо `strategy.rollingUpdate` не очищено. Поле `strategy.rollingupdate` не можна визначати, якщо `strategy.type` дорівнює `Recreate`.

Рекомендація: ці поля слід явно визначати у файлі конфігурації обʼєкта:

- Селектори та мітки PodTemplate робочих навантажень, як-от Deployment, StatefulSet, Job, DaemonSet, ReplicaSet і ReplicationController
- Стратегія розгортання Deployment

### Як очистити поля зі стандартними значеннями сервера або поля, встановлені іншими записувачами {#how-to-clear-server-defaulted-fields-or-fields-set-by-other-writers}

Поля, яких немає у файлі конфігурації, можна очистити, встановивши їхні значення в `null` і застосувавши файл конфігурації. Для полів зі стандартними значеннями сервера це повторно встановлює стандартні значення.

## Як змінити власника поля між файлом конфігурації та прямими імперативними записувачами {#how-to-change-ownership-of-a-field-between-the-configuration-file-and-direct-imperative-writers}

Лише цими методами слід змінювати окреме поле обʼєкта:

- Використовуйте `kubectl apply`.
- Записуйте безпосередньо в живу конфігурацію без зміни файлу конфігурації: наприклад, використовуйте `kubectl scale`.

### Зміна власника з прямого імперативного записувача на файл конфігурації {#changing-the-owner-from-a-direct-imperative-writer-to-a-configuration-file}

Додайте поле до файлу конфігурації. Для цього поля припиніть прямі оновлення живої конфігурації, які не проходять через `kubectl apply`.

### Зміна власника з файлу конфігурації на безпосереднього імперативного записувача {#changing-the-owner-from-a-configuration-file-to-a-direct-imperative-writer}

Станом на Kubernetes 1.5 зміна власника поля з файлу конфігурації на імперативного записувача потребує ручних кроків:

- Видаліть поле з файлу конфігурації.
- Видаліть поле з анотації `kubectl.kubernetes.io/last-applied-configuration` на живому обʼєкті.

## Зміна методів керування {#changing-management-methods}

Обʼєктами Kubernetes слід керувати лише одним методом одночасно. Перехід з одного методу на інший можливий, але виконується вручну.

{{< note >}}
Можна використовувати імперативне видалення разом із декларативним керуванням.
{{< /note >}}

{{< comment >}}
TODO (pwittrock): Нам потрібно зробити так, щоб використання імперативних команд з декларативною конфігурацією обʼєктів працювало так, щоб вона не записувала поля в анотацію, а замість цього. Потім додайте цей пункт.

- використання імперативних команд із декларативною конфігурацією для керування різними полями.
{{< /comment >}}

### Міграція з керування імперативними командами на декларативну конфігурацію обʼєктів {#migrating-from-imperative-command-management-to-declarative-object-configuration}

Міграція з керування імперативними командами на декларативну конфігурацію обʼєктів складається з кількох ручних кроків:

1. Експортуйте живий обʼєкт у локальний файл конфігурації:

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

1. Видаліть вручну поле `status` з файлу конфігурації.

   {{< note >}}
   Цей крок є необовʼязковим, оскільки `kubectl apply` не оновлює поле статусу, навіть якщо воно присутнє у файлі конфігурації.
   {{< /note >}}

1. Встановіть анотацію `kubectl.kubernetes.io/last-applied-configuration` на обʼєкті:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Змініть процеси так, щоб для керування обʼєктом використовувався виключно `kubectl apply`.

{{< comment >}}
TODO (pwittrock): Чому експорт не видаляє поле статусу? Здається, він повинен.
{{< /comment >}}

### Міграція з імперативного конфігурування обʼєктів на декларативну конфігурацію обʼєктів {#migrating-from-imperative-object-configuration-to-declarative-object-configuration}

1. Встановіть анотацію `kubectl.kubernetes.io/last-applied-configuration` на обʼєкті:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Змініть процеси так, щоб для керування обʼєктом використовувався виключно `kubectl apply`.

## Визначення селекторів контролера та міток PodTemplate {#defining-controller-selectors-and-podtemplate-labels}

{{< warning >}}
Оновлювати селектори контролерів категорично не рекомендовано.
{{< /warning >}}

Рекомендований підхід — визначити одну незмінну мітку PodTemplate, яка використовується тільки селектором контролера й не має іншого семантичного значення.

**Приклад:**

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Керування обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Імперативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Довідник команд kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
