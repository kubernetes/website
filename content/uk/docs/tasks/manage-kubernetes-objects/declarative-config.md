---
title: Декларативне керування обʼєктами Kubernetes з використанням конфігураційних файлів
content_type: task
weight: 10
---

<!-- overview -->

Обʼєкти Kubernetes можна створювати, оновлювати та видаляти, зберігаючи декілька файлів конфігурації обʼєктів у теці та використовувати `kubectl apply` для рекурсивного створення та оновлення цих обʼєктів за потреби. Цей метод зберігає записи, зроблені у поточних обʼєктах, без злиття змін до файлів конфігурації обʼєкта. За допомогою `kubectl diff` також можна переглянути зміни, які буде внесено командою `apply`.

## {{% heading "prerequisites" %}}

Встановіть [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Компроміси {#trade-offs}

Інструмент `kubectl` підтримує три види управління обʼєктами:

* Імперативні команди
* Імперативне конфігурування обʼєктів
* Декларативне конфігурування обʼєктів

Див. [Управління обʼєктами Kubernetes](/docs/concepts/overview/working-with-objects/object-management/) для обговорення переваг та недоліків кожного виду управління обʼєктами.

## Огляд {#overview}

Декларативна конфігурація обʼєктів потребує чіткого розуміння визначень та конфігурації обʼєктів Kubernetes. Прочитайте наступні документи, якщо ви ще цього не зробили:

* [Управління обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Імперативне управління обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)

Нижче подано визначення термінів, використаних у цьому документі:

* *файл конфігурації обʼєкта / файл конфігурації*: Файл, який визначає конфігурацію для обʼєкта Kubernetes. Ця тема показує, як передавати файли конфігурації до `kubectl apply`. Файли конфігурації зазвичай зберігаються у системі контролю версій, такі як Git.
* *поточна конфігурація обʼєкта / поточна конфігурація*: Поточні значення конфігурації обʼєкта, які використовуються кластером Kubernetes. Їх зберігають у сховищі кластера Kubernetes, зазвичай etcd.
* *декларативний записувач конфігурації / декларативний письменник*: Особа або компонент програмного забезпечення, який вносить оновлення до поточного обʼєкта. Поточні записувачі, на які посилається ця тема, вносять зміни до файлів конфігурації обʼєктів та запускають `kubectl apply` для запису змін.

## Як створити обʼєкти {#how-to-create-objects}

Використовуйте `kubectl apply`, щоб створити всі обʼєкти, за винятком тих, що вже існують, які визначені у конфігураційних файлах у вказаній теці:

```shell
kubectl apply -f <тека>
```

Це встановлює анотацію `kubectl.kubernetes.io/last-applied-configuration: '{...}'` для кожного обʼєкта. Анотація містить вміст файлу конфігурації обʼєкта, який був використаний для створення обʼєкта.

{{< note >}}
Додайте прапорець `-R`, щоб рекурсивно обробляти теки.
{{< /note >}}

Ось приклад файлу конфігурації обʼєкта:

{{% code_sample file="application/simple_deployment.yaml" %}}

Запустіть `kubectl diff`, щоб показати обʼєкт, який буде створено:

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
`diff` використовує [запуск без внесення змін на сервері (dry-run)](/docs/reference/using-api/api-concepts/#dry-run), таку можливість потрібно ввімкнути на `kube-apiserver`.

Оскільки `diff` виконує запит на стороні сервера для застосування в режимі без внесення змін, для його роботи потрібно дозволити дії `PATCH`, `CREATE` та `UPDATE`. Детальніше див. [Авторизація запуску dry-run](/docs/reference/using-api/api-concepts#dry-run-authorization).
{{< /note >}}

Створіть обʼєкт за допомогою `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Виведіть поточну конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що анотація `kubectl.kubernetes.io/last-applied-configuration` була записана до поточної конфігурації та відповідає конфігураційному файлу:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Це json-представлення simple_deployment.yaml
    # Воно було створено за допомогою kubectl apply під час створення обʼєкта
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

Ви також можете використовувати `kubectl apply`, щоб оновити всі обʼєкти, визначені у теці, навіть якщо ці обʼєкти вже існують. Цей підхід виконує наступне:

1. Встановлює поля, що зʼявляються у файлі конфігурації, у поточній конфігурації.
2. Очищає поля, які були видалені з файлу конфігурації, у поточній конфігурації.

```shell
kubectl diff -f <тека>
kubectl apply -f <тека>
```

{{< note >}}
Додайте прапорець `-R`, щоб рекурсивно обробляти теки.
{{< /note >}}

Ось приклад конфігураційного файлу:

{{% code_sample file="application/simple_deployment.yaml" %}}

Створіть обʼєкт за допомогою `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
З метою ілюстрації, попередня команда посилається на один конфігураційний файл замість теки.
{{< /note >}}

Виведіть поточну конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що анотація `kubectl.kubernetes.io/last-applied-configuration` була записана до поточної конфігурації та відповідає конфігураційному файлу:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Це json-представлення simple_deployment.yaml
    # Воно було створено за допомогою kubectl apply під час створення обʼєкта
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

Напряму оновіть поле `replicas` у поточній конфігурації за допомогою `kubectl scale`. Для цього не використовується `kubectl apply`:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Виведіть поточну конфігурацію за допомогою `kubectl get`:

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
    # Зверніть увагу, що анотація не містить replicas
    # тому що воно не було оновлено через apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # Встановлено за допомогою `kubectl scale`. Ігнорується `kubectl apply`.
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
      - image: nginx:1.14.2 # Встановлено за допомогою `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
    # ...
  # ...
```

Оновіть конфігураційний файл `simple_deployment.yaml`, щоб змінити образ з `nginx:1.14.2` на `nginx:1.16.1` та видалити поле `minReadySeconds`:

{{% code_sample file="application/update_deployment.yaml" %}}

Застосуйте зміни, внесені до конфігураційного файлу:

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

Виведіть поточну конфігурацію за допомогою `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

Вивід показує наступні зміни в поточній конфігурації:

* Поле `replicas` зберігає значення 2, встановлене за допомогою `kubectl scale`. Це можливо через його відсутність у конфігураційному файлі.
* Поле `image` було оновлено на `nginx:1.16.1` з `nginx:1.14.2`.
* Анотація `last-applied-configuration` була оновлена новим образом.
* Поле `minReadySeconds` було очищено.
* Анотація `last-applied-configuration` більше не містить поле `minReadySeconds`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Анотація містить оновлений образ nginx 1.16.1,
    # але не містить оновлення копій на 2
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
```

{{< warning >}}
Змішування `kubectl apply` з імперативними командами конфігурації обʼєктів `create` та `replace` не підтримується. Це через те, що `create` та `replace` не зберігають анотацію `kubectl.kubernetes.io/last-applied-configuration`, яку використовує `kubectl apply` для обробки оновлень.
{{< /warning >}}

## Як видалити обʼєкти {#how-to-delete-objects}

Існують два підходи до видалення обʼєктів, керованих за допомогою `kubectl apply`.

### Рекомендований: `kubectl delete -f <filename>` {#recommended-kubectl-delete-f-filename}

Ручне видалення обʼєктів за допомогою імперативної команди є рекомендованим підходом, оскільки він більш явно вказує на те, що видаляється, і менш ймовірно призводить до випадкового видалення чогось:

```shell
kubectl delete -f <filename>
```

### Альтернатива: `kubectl apply -f <directory> --prune` {#alternative-kubectl-apply-f-directory-prune}

Як альтернативу `kubectl delete`, ви можете використовувати `kubectl apply` для ідентифікації обʼєктів, які мають бути видалені після видалення їх маніфестів з теки у локальній файловій системі.

У Kubernetes {{< skew currentVersion >}}, доступні два режими очищення в `kubectl apply`:

* Очищення на основі allowlist: Цей режим існує з моменту kubectl v1.5, але все ще знаходиться на етапі альфа-тестування через проблеми з використанням, коректністю і продуктивністю його дизайну. Режим на основі ApplySet призначений для заміни його.
* Очищення на основі ApplySet: _apply set_ — це обʼєкт на стороні сервера (типово, Secret), який kubectl може використовувати для точного та ефективного відстеження членства в наборі під час операцій **apply**. Цей режим був введений у альфа-версії в kubectl v1.27 як заміна очищенню на основі allowlist.

{{< tabs name="kubectl_apply_prune" >}}
{{% tab name="Allow list" %}}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

{{< warning >}}
Будьте обережні при використанні `--prune` з `kubectl apply` в режимі allow list. Те, які обʼєкти очищаються, залежить від значень прапорців `--prune-allowlist`, `--selector` та `--namespace`, і ґрунтується на динамічному виявленні обʼєктів, що підпадають під область застосування. Особливо, якщо значення прапорців змінюються між викликами, це може призвести до неочікуваного видалення або збереження обʼєктів.
{{< /warning >}}

Щоб використовувати очищення на основі allowlist, додайте наступні прапорці до свого виклику `kubectl apply`:

* `--prune`: Видалити попередньо застосовані обʼєкти, які не є у наборі, що передані поточному виклику.
* `--prune-allowlist`: Список груп-версій-типів (GVK, group-version-kind), які розглядаються для очищення. Цей прапорець є необовʼязковим, але наполегливо рекомендується, оскільки його стандартне значення є частковим списком обʼєктів з просторами імен та областями застосування, що може призвести до несподіваних результатів.
* `--selector/-l`: Використовуйте селектор міток для обмеження набору обʼєктів, обраних для очищення. Цей прапорець є необовʼязковим, але наполегливо рекомендується.
* `--all`: використовуйте замість `--selector/-l`, щоб явно вибрати всі попередньо застосовані обʼєкти відповідних типів, які знаходяться у списку дозволених.

Очищення на основі allowlist запитує API-сервер щодо всіх обʼєктів затверджених GVK, які відповідають заданим міткам (якщо є), і намагається зіставити конфігурації активних обʼєктів, отриманих в результаті, з файлами маніфестів обʼєктів. Якщо обʼєкт відповідає запиту і він не має маніфесту в теці, і має анотацію `kubectl.kubernetes.io/last-applied-configuration`, він видаляється.

```shell
kubectl apply -f <directory> --prune -l <labels> --prune-allowlist=<gvk-list>
```

{{< warning >}}
Очищення з використанням `--prune` повинне бути виконане тільки для кореневої теки, що містить маніфести обʼєктів. Виконання для підтек може призвести до неочікуваного видалення обʼєктів, які раніше були застосовані, мають задані мітки (якщо є) і не зʼявляються у підтеці.
{{< /warning >}}

{{% /tab %}}

{{% tab name="Apply set" %}}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< caution >}}
`kubectl apply --prune --applyset` знаходиться на етапі альфа-тестування, і в майбутніх випусках можуть бути внесені зміни, що несумісні з попередніми версіями.
{{< /caution >}}

Для використання очищення на основі ApplySet встановіть змінну середовища `KUBECTL_APPLYSET=true`, і додайте наступні прапорці до свого виклику `kubectl apply`:

* `--prune`: Видалити попередньо застосовані обʼєкти, які не є у наборі, що передані поточному виклику.
* `--applyset`: Назва обʼєкта, який kubectl може використовувати для точного та ефективного відстеження членства в наборі під час операцій **apply**.

```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory> --prune --applyset=<name>
```

Типово тип батьківського обʼєкта ApplySet, що використовується, — Secret. Однак також можуть бути використані ConfigMaps у форматі: `--applyset=configmaps/<name>`. При використанні Secret або ConfigMap, kubectl створить обʼєкт, якщо він ще не існує.

Також можливе використання власних ресурсів як батьківських обʼєктів ApplySet. Для цього позначте міткою Custom Resource Definition (CRD), що визначає ресурс, який ви хочете використовувати з наступним: `applyset.kubernetes.io/is-parent-type: true`. Потім створіть обʼєкт, який ви хочете використовувати як батьківський обʼєкт ApplySet (kubectl цього не робить автоматично для Custom Resource). Нарешті, посилайтеся на цей обʼєкт у прапорці applyset таким чином: `--applyset=<resource>.<group>/<name>` (наприклад, `widgets.custom.example.com/widget-name`).

Під час очищення на основі ApplySet kubectl додає мітку `applyset.kubernetes.io/part-of=<parentID>` до кожного обʼєкта в наборі, перш ніж вони будуть надіслані на сервер. З метою продуктивності він також збирає список типів ресурсів і просторів імен, які включаються у набір, і додає ці дані в анотації поточного батьківського обʼєкта. В кінеці операції apply, він запитує API-сервер щодо обʼєктів цих типів в цих просторах імен (або в областях кластера, якщо це доречно), які належать до набору, визначеного міткою `applyset.kubernetes.io/part-of=<parentID>`.

Застереження та обмеження:

* Кожен обʼєкт може бути членом не більше одного набору.
* Прапорець `--namespace` є обовʼязковим при використанні будь-якого обʼєкта з простором імен, включаючи типово Secret. Це означає, що ApplySets, які охоплюють кілька просторів імен, повинні використовувати кластерний обʼєкт з кореневою текою.
* Щоб безпечно використовувати очищення на основі ApplySet з декількома теками, використовуйте унікальне імʼя ApplySet для кожного.

{{% /tab %}}

{{< /tabs >}}

## Як переглянути обʼєкт {#how-to-view-objects}

Ви можете використовувати `kubectl get` з `-o yaml`, щоб переглянути конфігурацію поточного обʼєкта:

```shell
kubectl get -f <filename|url> -o yaml
```

## Як apply обчислює різницю та обʼєднує зміни {#how-apply-calculates-differences-and-merges-changes}

{{< caution >}}
*Патч (накладання латок)* — це операція оновлення, яка обмежена конкретними полями обʼєкта замість всього обʼєкта. Це дозволяє оновлювати лише певний набір полів обʼєкта без читання всього обʼєкта.
{{< /caution >}}

Коли `kubectl apply` оновлює поточну конфігурацію обʼєкта, він робить це, надсилаючи запит на патч до API-сервера. Патч визначає оновлення для конкретних полів конфігурації живого обʼєкта. Команда `kubectl apply` обчислює цей запит на патч за допомогою файлу конфігурації, поточної конфігурації та анотації `last-applied-configuration`, збереженої в поточній конфігурації.

### Обчислення злиття патчів {#calculating-patch-merges}

Команда `kubectl apply` записує вміст файлу конфігурації до анотації `kubectl.kubernetes.io/last-applied-configuration`. Вона використовується для ідентифікації полів, які були видалені з файлу конфігурації та які потрібно видалити з поточної конфігурації. Ось кроки, які використовуються для обчислення того, які поля потрібно видалити або встановити:

1. Обчислити поля для видалення. Це поля, які присутні в `last-applied-configuration` та відсутні в файлі конфігурації.
2. Обчислити поля для додавання або встановлення. Це поля, які присутні в файлі конфігурації, значення яких не відповідають поточній конфігурації.

Ось приклад. Припустимо, що це файл конфігурації для обʼєкта типу Deployment:

{{% code_sample file="application/update_deployment.yaml" %}}

Також, припустимо, що це поточна конфігурація для того самого обʼєкта типу Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Зауважте, що анотація не містить поля replicas,
    # оскільки воно не було оновлено через apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # вказано через scale
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

1. Обчислення полів для видалення, отримуючи значення з `last-applied-configuration` і порівнюючи їх зі значеннями у файлі конфігурації. Очищення полів, які явно встановлені ​​на null у локальному файлі конфігурації обʼєкта, незалежно від того, чи вони зʼявляються в анотації `last-applied-configuration`. У цьому прикладі `minReadySeconds` зʼявляється в анотації `last-applied-configuration`, але не зʼявляється у файлі конфігурації. **Дія:** Прибрати `minReadySeconds` з поточної конфігурації.
2. Обчислення полів для встановлення, отримуючи значення з файлу конфігурації та порівнюючи їх зі значеннями у поточній конфігурації. У цьому прикладі значення `image` у файлі конфігурації не відповідає значенню у поточній конфігурації. **Дія:** Встановити значення `image` у поточній конфігурації.
3. Встановити анотацію `last-applied-configuration`, щоб вона відповідала значенню файлу конфігурації.
4. Обʼєднати результати з 1, 2, 3 у єдиний запит на патч до API-сервера.

Ось поточна конфігурація, яка є результатом злиття:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Анотація містить оновлений образ nginx 1.16.1,
    # але не містить оновлення реплік до 2
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
  replicas: 2 # Встановлено за допомогою `kubectl scale`.  Ігнорується `kubectl apply`.
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

Як певне поле в конфігураційному файлі зливається з поточною конфігурацією залежить від типу поля. Існують кілька типів полів:

* *primitive*: Поле типу рядок, ціле число або логічне значення. Наприклад, `image` та `replicas` є полями примітивів. **Дія:** Замінити.

* *map*, також відомий як *object*: Поле типу map або комплексний тип, який містить підполя. Наприклад, `labels`, `annotations`, `spec` та `metadata` — це всі map. **Дія:** Злити елементи або підполя.

* *list*: Поле, яке містить список елементів, які можуть бути або типами primitive, або map. Наприклад, `containers`, `ports` та `args` є списками. **Дія:** Варіюється.

Коли `kubectl apply` оновлює map або list, він зазвичай не замінює все поле цілком, а замість цього оновлює окремі піделементи. Наприклад, при злитті `spec` в Deployment, весь `spec` не
замінюється. Замість цього порівнюються та зливаються підполя `spec`, такі як `replicas`.

### Злиття змін для полів типу primitive {#merging-changes-to-primitive-fields}

Поля primitive замінюються або очищаються.

{{< note >}}
`-` використовується для "not applicable", оскільки значення не використовується.
{{< /note >}}

| Поле в конфігураційному файлі обʼєкта | Поле в поточній конфігурації обʼєкта | Поле в останній застосованій конфігурації | Дія                                          |
|----------------------------------------|-----------------------------------|-----------------------------------------|---------------------------------------------|
| Так                                    | Так                               | -                                       | Встановити поточне значення з конфігураційного файлу.  |
| Так                                    | Ні                                | -                                       | Встановити поточне значення з локального конфігураційного файлу. |
| Ні                                     | -                                 | Так                                     | Очистити з поточної конфігурації.             |
| Ні                                     | -                                 | Ні                                      | Нічого не робити. Зберегти значення поточного обʼєкта.   |

### Злиття змін у полях типу map {#merging-changes-to-map-fields}

Поля, які є map, зливаються шляхом порівняння кожного з підполів або елементів map:

{{< note >}}
`-` використовується для "not applicable", оскільки значення не використовується.
{{< /note >}}

| Ключ в конфігураційному файлі обʼєкта | Ключ у поточній конфігурації обʼєкта | Поле в останній застосованій конфігурації | Дія                                     |
|----------------------------------------|------------------------------------|--------------------------------------------|----------------------------------------|
| Так                                    | Так                                | -                                          | Порівняти значення підполів.          |
| Так                                    | Ні                                 | -                                          | Встановити поточне значення з локального конфігураційного файлу. |
| Ні                                     | -                                  | Так                                        | Видалити з поточної конфігурації.       |
| Ні                                     | -                                  | Ні                                         | Нічого не робити. Зберігти значення поточного обʼєкта. |

### Злиття змін для полів типу list {#merging-changes-for-fields-of-type-list}

Злиття змін у list використовує одну з трьох стратегій:

* Заміна list, якщо всі його елементи є primitive.
* Злиття окремих елементів у списку комплексних елементів.
* Злиття list елементів primitive.

Вибір стратегії залежить від конкретного поля.

#### Заміна list, якщо всі його елементи є primitive {#replace-the-list-if-all-its-elements-are-primitive}

Такий список трактується так само як і поле primitive. Замініть або видаліть
весь список. Це зберігає порядок.

**Приклад:** Використовуйте `kubectl apply`, щоб оновити поле `args` контейнера в Podʼі. Це встановлює значення `args` в поточній конфігурації на значення у файлі конфігурації. Будь-які елементи `args`, які раніше були додані до поточної конфігурації, втрачаються. Порядок елементів `args`, визначених у файлі конфігурації, зберігається у поточній конфігурації.

```yaml
# Значення last-applied-configuration
    args: ["a", "b"]

# Значення файлу конфігурації
    args: ["a", "c"]

# Поточна конфігурація
    args: ["a", "b", "d"]

# Результат після злиття
    args: ["a", "c"]
```

**Пояснення:** Злиття використовує значення файлу конфігурації як нове значення списку.

#### Злиття окремих елементів списку комлексних елементів: {#merging-individual-elements-of-a-list-of-complex-elements}

Трактуйте список як map, а конкретне поле кожного елемента як ключ. Додавайте, видаляйте або оновлюйте окремі елементи. Це не зберігає порядок.

Ця стратегія злиття використовує спеціальний теґ на кожному полі, який називається `patchMergeKey`. `patchMergeKey` визначено для кожного поля в коді Kubernetes: [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747) При злитті списку map, поле, вказане як `patchMergeKey` для певного елемента, використовується як ключ map для цього елемента.

**Приклад:** Використайте `kubectl apply`, щоб оновити поле `containers` у PodSpec. Це злиття списку, ніби він був map, де кожен елемент має ключ `name`.

```yaml
# Значення last-applied-configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # ключ: nginx-helper-a; буде видалено у результаті
      image: helper:1.3
    - name: nginx-helper-b # ключ: nginx-helper-b; буде збережено
      image: helper:1.3

# Значення файлу конфігурації
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # ключ: nginx-helper-c; буде додано у результаті
      image: helper:1.3

# Поточна конфігурація
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
      # Елемент nginx-helper-a був видалений
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Поле було збережено
    - name: nginx-helper-c # Елемент був доданий
      image: helper:1.3
    - name: nginx-helper-d # Елемент був ігнорований
      image: helper:1.3
```

**Пояснення:**

* Контейнер з імʼям "nginx-helper-a" був видалений, оскільки жодного контейнера з іменем "nginx-helper-a" не знайдено у файлі конфігурації.
* Контейнер з імʼям "nginx-helper-b" зберіг зміни у `args` в поточній конфігурації. `kubectl apply` зміг ідентифікувати, що "nginx-helper-b" у поточній конфігурації був тим самим "nginx-helper-b", що й у файлі конфігурації, навіть якщо їхні поля мали різні значення (немає `args` у файлі конфігурації). Це тому, що значення поля `patchMergeKey` (name) було ідентичним у обох.
* Контейнер з імʼям "nginx-helper-c" був доданий, оскільки жодного контейнера з таким імʼям не було у поточній конфігурації, але один з таким імʼям був у файлі конфігурації.
* Контейнер з імʼям "nginx-helper-d" був збережений, оскільки жодного елемента з таким імʼям не було в last-applied-configuration.

#### Злиття списку елементів типу primitive {#merging-a-list-of-primitive-elements}

Зараз, починаючи з Kubernetes 1.5, злиття списків елементів типу primitive не підтримується.

{{< note >}}
Яка зі стратегій вище вибирається для певного поля контролюється теґом `patchStrategy` у [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748). Якщо для поля типу списку не вказано `patchStrategy`, тоді список замінюється.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Розкоментуйте це для 1.6

* Трактувати список як набір primitive. Замінюйте або видаляйте окремі елементи. Не зберігає порядок. Не зберігає дублікати.

**Приклад:** Використання apply для оновлення поля `finalizers` у ObjectMeta зберігає додані до поточної конфігурації елементи. Порядок завершувачів втрачається.
{{< /comment >}}

## Стандартні значення полів {#default-field-values}

Сервер API встановлює в певні поля станадартні значення у поточній конфігурації, якщо вони не вказані при створенні обʼєкта.

Ось файл конфігурації для обʼєкта Deployment. У файлі не вказано `strategy`:

{{% code_sample file="application/simple_deployment.yaml" %}}

Створіть обʼєкт, використовуючи `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Виведіть поточну конфігурацію, використовуючи `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Вивід показує, що сервер API встановив в деякі поля стандартні значення у поточній конфігурації. Ці поля не були вказані в файлі конфігурації.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # станадратне значення додане apiserver
  strategy:
    rollingUpdate: # станадратне значення додане apiserver - походить з strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # станадратне значення додане apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # станадратне значення додане apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # станадратне значення додане apiserver
        resources: {} # станадратне значення додане apiserver
        terminationMessagePath: /dev/termination-log # станадратне значення додане apiserver
      dnsPolicy: ClusterFirst # станадратне значення додане apiserver
      restartPolicy: Always # станадратне значення додане apiserver
      securityContext: {} # станадратне значення додане apiserver
      terminationGracePeriodSeconds: 30 # станадратне значення додане apiserver
# ...
```

У запиті на патч, поля, які мають станаддартні значення, не перезаписуються, якщо вони явно не очищені як частина запиту на патч. Це може призвести до неочікуваної поведінки для полів, які мають стнадартні значення на основі значень інших полів. Після зміни інших полів значення, які мають стандартні значення з них, не будуть оновлені, якщо їх не явно очищено.

З цієї причини рекомендується, щоб певні поля, стандартні значення яких встановлює сервер, були явно визначені в файлі конфігурації обʼєкта, навіть якщо бажані значення відповідають станадартним значенням сервера. Це полегшить розпізнавання суперечливих значень, які не будуть перезаписані сервером на станадартні значення.

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

# конфігураційний файл
spec:
  strategy:
    type: Recreate # оновленне значення
  template:
    metadata:
      labels:
        app:

 nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# поточна конфігурація
spec:
  strategy:
    type: RollingUpdate # встановлене типове значення
    rollingUpdate: # встановлене типове значення отримане з type
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

# результат після злиття - ПОМИЛКА!
spec:
  strategy:
    type: Recreate # оновленне значення: несумісне з rollingUpdate
    rollingUpdate: # встановлене типове значення: несумісне з "type: Recreate"
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
2. Сервер встановлює станадартне значення для `strategy.type` на `RollingUpdate` тв стандартне значення для `strategy.rollingUpdate`.
3. Користувач змінює `strategy.type` на `Recreate`. Значення `strategy.rollingUpdate` залишаються стандартними значеннями, хоча сервер очікує, що вони будуть очищені. Якщо значення `strategy.rollingUpdate` були визначені спочатку в файлі конфігурації, було б більш зрозуміло, що їх потрібно було б видалити.
4. Оновлення не вдається через те, що `strategy.rollingUpdate` не очищено. Поле `strategy.rollingupdate` не може бути визначено з `strategy.type` `Recreate`.

Рекомендація: Ці поля слід явно визначити в файлі конфігурації обʼєкта:

* Селектори та мітки PodTemplate для робочих навантажень, таких як Deployment, StatefulSet, Job, DaemonSet, ReplicaSet та ReplicationController.
* Стратегія розгортання Deployment.

### Як очистити стандартні поля встановлені сервером або поля, встановлені іншими записувачами {#how-to-clear-server-defaulted-fields-or-fields-set-by-other-writers}

Поля, які не зʼявляються у файлі конфігурації, можна очистити, встановивши їх значення в `null`, а потім застосувати файл конфігурації. Для полів, стандартні значення яких встановлено сервером, це спричинить перезапис цих значень.

## Як змінити власника поля між файлом конфігурації та прямими імперативними записувачами {#how-to-change-ownership-of-a-field-between-the-configuration-file-and-direct-imperative-writers}

Ці методи — єдиний вірний спосіб змінювати окреме поле обʼєкта:

* Використовуйте `kubectl apply`.
* Пишіть безпосередньо в поточну конфігурацію без змін файлу конфігурації: наприклад, використовуйте `kubectl scale`.

### Зміна власника з прямого імперативного записувача на файл конфігурації {#changing-the-owner-from-direct-imperative-writer-to-a-configuration-file}

Додайте поле до файлу конфігурації. Для цього поля припиніть прямі оновлення поточної конфігурації, які не проходять через `kubectl apply`.

### Зміна власника з файлу конфігурації на безпосереднього імперативного записувача {#changing-the-owner-from-a-configuration-file-to-a-direct-imperative-writer}

Починаючи з Kubernetes 1.5, зміна власника поля з файлу конфігурації на імперативного запусувача вимагає виконання наступних кроків:

* Видаліть поле з файлу конфігурації.
* Видаліть поле з анотації `kubectl.kubernetes.io/last-applied-configuration` на поточному обʼєкті.

## Зміна методів управління {#changing-management-methods}

Обʼєктами Kubernetes слід керувати за допомогою лише одного методу одночасно. Перехід з одного методу на інший можливий, але це вимагає ручної обробки.

{{< note >}}
Використання імперативного видалення з декларативним управлінням є прийнятним.
{{< /note >}}

{{< comment >}}
TODO (pwittrock): Нам потрібно зробити так, щоб використання імперативних команд з декларативною конфігурацією обʼєктів працювало так, щоб вона не записувала поля в анотацію, а замість цього. Потім додайте цей пункт.

* використання імперативних команд із декларативною конфігурацією для керування різними полями.
{{< /comment >}}

### Міграція з управління імперативними командами до декларативної конфігурації обʼєктів {#migrating-from-imperative-command-management-to-declarative-object-configuration}

Міграція з управління імперативними командами до декларативної конфігурації обʼєктів включає кілька ручних кроків:

1. Експортуйте поточний обʼєкт у локальний файл конфігурації:

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

1. Змініть процеси так, щоб вони використовували виключно `kubectl apply` для керування обʼєктом.

{{< comment >}}
TODO (pwittrock): Чому експорт не видаляє поле статусу? Здається, він повинен.
{{< /comment >}}

### Міграція з імперативної конфігурації обʼєктів до декларативної конфігурації обʼєктів {#migrating-from-imperative-object-configuration-to-declarative-object-configuration}

1. Встановіть анотацію `kubectl.kubernetes.io/last-applied-configuration` на обʼєкті:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Змініть процеси так, щоб використовували `kubectl apply` виключно для керування обʼєктом.

## Визначення селекторів контролера та міток PodTemplate {#defining-controller-selectors-and-podtemplate-labels}

{{< warning >}}
Рекомендується утриматися від оновлення селекторів на контролерах.
{{< /warning >}}

Рекомендований підхід — це визначення єдиного, незмінного підпису PodTemplate, який використовується тільки селектором контролера без іншого семантичного значення.

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

## {{% heading "whatsnext" %}}

* [Керування обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Імперативне керування обʼєктами Kubernetes за допомогою конфігураційних файлів](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Довідник команд kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
