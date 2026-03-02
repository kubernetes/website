---
title: Спільне використання кластера з просторами імен
content_type: task
weight: 340
---

<!-- overview -->

Ця сторінка показує, як переглядати, працювати та видаляти {{< glossary_tooltip text="простори імен" term_id="namespace" >}}. На сторінці також розказується, як використовувати простори імен Kubernetes для розділення вашого кластера.

## {{% heading "prerequisites" %}}

* Вам потрібен [кластер Kubernetes](/docs/setup/).
* Ви маєте базове розуміння про {{< glossary_tooltip text="Pod" term_id="pod" >}}, {{< glossary_tooltip term_id="service" text="Service" >}}, та {{< glossary_tooltip text="Deployment" term_id="deployment" >}} в Kubernetes.

<!-- steps -->

## Перегляд просторів імен {#viewing-namespaces}

Перелік поточних просторів імен у кластері можна отримати за допомогою команди:

```shell
kubectl get namespaces
```

```console
NAME              STATUS   AGE
default           Active   11d
kube-node-lease   Active   11d
kube-public       Active   11d
kube-system       Active   11d
```

Kubernetes запускається з чотирма просторами імен:

* `default` — стандартний простір імен для обʼєктів без іншого простору імен.
* `kube-node-lease` — цей простір імен містить обʼєкти [Lease](/docs/concepts/architecture/leases/), повʼязані з кожним вузлом. Лізинги вузлів дозволяють kubelet надсилати [пульси](/docs/concepts/architecture/nodes/#heartbeats), щоб панель управління було в змозі виявляти збої вузлів.
* `kube-public` — цей простір імен створюється автоматично і доступний для читання всіма користувачами (включаючи неавтентифікованих). Цей простір імен зазвичай зарезервований для використання у межах кластера, у випадках коли деякі ресурси мають бути відкриті та доступні для загального огляду у всьому кластері. Публічний аспект цього простору імен є лише конвенцією, а не вимогою.
* `kube-system` — простір імен для обʼєктів, створених системою Kubernetes.

Також ви можете отримати інформацію про певний простір імен за допомогою команди:

```shell
kubectl get namespaces <name>
```

Або отримати детальну інформацію за допомогою:

```shell
kubectl describe namespaces <name>
```

```console
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----       --------    --- --- -------
 Container  cpu         -   -   100m
```

Зверніть увагу, що ці деталі включають інформацію про квоти ресурсів (якщо вони є) та обмеження діапазону ресурсів.

Квота ресурсів відстежує загальне використання ресурсів у просторі імен та дозволяє операторам кластера встановлювати жорсткі ліміти використання ресурсів, які може споживати простір імен.

Обмеження діапазону визначає мінімальні/максимальні обмеження на кількість ресурсів, які може споживати одиниця у просторі імен.

Див. [Контроль допуску: Limit Range](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)

Простір імен може перебувати в одному з двох станів:

* `Active` — простір імен використовується
* `Terminating` — простір імен видаляється і не може бути використаний для нових обʼєктів

Для отримання додаткової інформації дивіться [Простір імен](/docs/reference/kubernetes-api/cluster-resources/namespace-v1/) в довідковій документації API.

## Створення нового простору імен {#creating-a-new-namespace}

{{< note >}}
Уникайте створення просторів імен з префіксом `kube-`, оскільки він зарезервований для системних просторів імен Kubernetes.
{{< /note >}}

Створіть новий файл YAML з назвою `my-namespace.yaml` з таким вмістом:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <вставте-назву-простору-імен-тут>
```

Потім виконайте:

```shell
kubectl create -f ./my-namespace.yaml
```

Або ви можете створити простір імен за допомогою такої команди:

```shell
kubectl create namespace <вставте-назву-простору-імен-тут>
```

Назва вашого простору імен повинна бути дійсною [DNS-міткою](/docs/concepts/overview/working-with-objects/names#dns-label-names).

Є необовʼязкове поле `finalizers`, яке дозволяє спостережувачам очищати ресурси кожного разу, коли простір імен видаляється. Майте на увазі, що якщо ви вказуєте неіснуючий finalizer, простір імен буде створений, але залишиться в стані `Terminating`, якщо користувач спробує його видалити.

Більше інформації про `finalizers` можна знайти в документі про [проєктування просторів імен](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md#finalizers).

## Видалення простору імен {#deleting-a-namespace}

Видаліть простір імен за допомогою команди:

```shell
kubectl delete namespaces <вставте-назву-простору-імен-тут>
```

{{< warning >}}
Це видаляє _все_ у просторі імен!
{{< /warning >}}

Ця операція видалення є асинхронною, тому протягом певного часу ви будете бачити простір імен у стані `Terminating`.

## Поділ кластера за допомогою просторів імен Kubernetes {#subdividing-your-cluster-using-kubernetes-namespaces}

Типово кластер Kubernetes створює простір імен default при його розгортанні, щоб утримувати стандартний набір Podʼів, Serviceʼів та Deploymentʼів, які використовуються в кластері.

Припускаючи, що у вас є новий кластер, ви можете перевірити наявні простори імен, виконавши наступне:

```shell
kubectl get namespaces
```

```console
NAME      STATUS    AGE
default   Active    13m
```

### Створення нових просторів імен {#creating-new-namespaces}

У цьому завданні ми створимо два додаткових простори імен Kubernetes, щоб утримувати наш контент.

У випадку, коли організація використовує спільний кластер Kubernetes для розробки та операційної діяльності:

* Команда розробників хотіла б мати простір у кластері, де вони можуть переглядати список Podʼів, Serviceʼів та Deploymentʼів, які вони використовують для створення та запуску свого застосунку. У цьому просторі ресурси Kubernetes зʼявляються та зникають, і обмеження на те, хто може або не може змінювати ресурси є слабкими для забезпечення гнучкої розробки.

* Команда операторів хотіла б мати простір у кластері, де вони можуть використовувати строгі процедури на те, хто може або не може маніпулювати набором Podʼів, Serviceʼів та Deploymentʼів, що працюють в операційному середовищі.

Одним з можливих варіантів для цієї організації є розподіл кластера Kubernetes на два простори імен: `development` та `production`. Створімо два нових простори імен для нашої роботи.

Створіть простір імен `development` за допомогою kubectl:

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
```

А потім створімо простір імен `production` за допомогою kubectl:

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
```

Щоб переконатися, що все в порядку, виведемо список всіх просторів імен у нашому кластері.

```shell
kubectl get namespaces --show-labels
```

```console
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

### Створення Podʼів в кожному просторі імен {#creating-pods-in-each-namespace}

Простір імен Kubernetes забезпечує область для Podʼів, Serviceʼів та Deploymentʼів у кластері. Користувачі, що взаємодіють з одним простором імен, не бачать вмісту іншого простору імен. Щоб продемонструвати це, створімо простий Deployment та Podʼи в просторі імен `development`.

```shell
kubectl create deployment snowflake \
  --image=registry.k8s.io/serve_hostname \
  -n=development --replicas=2
```

Ми створили Deployment з 2 реплік, що запускає Pod з назвою `snowflake` з базовим контейнером, який обслуговує імʼя хосту.

```shell
kubectl get deployment -n=development
```

```console
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
snowflake    2/2     2            2           2m
```

```shell
kubectl get pods -l app=snowflake -n=development
```

```console
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

Це чудово, розробники можуть робити те, що вони хочуть, і їм не потрібно хвилюватися про те, як це вплине на контент у просторі імен `production`.

Перейдімо до простору імен `production` і покажемо, як ресурси в одному просторі імен приховані від іншого. Простір імен `production` повинен бути порожнім, і наступні команди не повинні повертати нічого.

```shell
kubectl get deployment -n=production
kubectl get pods -n=production
```

Операційна діяльність вимагає догляду за худобою, тому створімо кілька Podʼів для худоби.

```shell
kubectl create deployment cattle --image=registry.k8s.io/serve_hostname -n=production
kubectl scale deployment cattle --replicas=5 -n=production

kubectl get deployment -n=production
```

```console
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
cattle       5/5     5            5           10s
```

```shell
kubectl get pods -l app=cattle -n=production
```

```console
NAME                      READY     STATUS    RESTARTS   AGE
cattle-2263376956-41xy6   1/1       Running   0          34s
cattle-2263376956-kw466   1/1       Running   0          34s
cattle-2263376956-n4v97   1/1       Running   0          34s
cattle-2263376956-p5p3i   1/1       Running   0          34s
cattle-2263376956-sxpth   1/1       Running   0          34s
```

На цьому етапі має бути зрозуміло, що ресурси, які користувачі створюють в одному просторі імен, приховані від іншого простору імен.

Поки політика підтримки в Kubernetes розвивається, ми розширимо цей сценарій, щоб показати, як можна надавати різні правила авторизації для кожного простору імен.

<!-- discussion -->

## Розуміння мотивації використання просторів імен {#understanding-the-motivation-for-using-namespaces}

Один кластер повинен задовольняти потреби кількох користувачів або груп користувачів (далі в цьому документі _спільнота користувачів_).

Простори імен Kubernetes допомагають різним проєктам, командам або клієнтам спільно використовувати кластер Kubernetes.

Це робиться за допомогою такого:

1. Області для [імен](/docs/concepts/overview/working-with-objects/names/).
2. Механізму для прикріплення авторизації та політики до підрозділу кластера.

Використання кількох просторів імен не є обовʼязковим.

Кожна спільнота користувачів хоче мати можливість працювати в ізоляції від інших спільнот користувачів. У кожної спільноти користувачів свої:

1. ресурси (pods, services, replication controllers тощо)
2. політики (хто може або не може виконувати дії у своїй спільноті)
3. обмеження (цій спільноті дозволено стільки квоти тощо)

Оператор кластера може створити простір імен для кожної унікальної спільноти користувачів.

Простір імен забезпечує унікальну область для:

1. іменованих ресурсів (щоб уникнути базових конфліктів імен)
2. делегування прав управління довіреним користувачам
3. здатності обмежувати використання ресурсів спільнотою

Сценарії використання включають такі:

1. Як оператор кластера, я хочу підтримувати кілька спільнот користувачів на одному кластері.
2. Як оператор кластера, я хочу делегувати владу управління підрозділам кластера довіреним користувачам у цих спільнотах.
3. Як оператор кластера, я хочу обмежити кількість ресурсів, які кожна спільнота може споживати, щоб обмежити вплив на інші спільноти, що використовують кластер.
4. Як користувач кластера, я хочу взаємодіяти з ресурсами, які є важливими для моєї спільноти користувачів в ізоляції від того, що роблять інші спільноти користувачів на кластері.

## Розуміння просторів імен та DNS {#understanding-namespaces-and-dns}

Коли ви створюєте [Service](/docs/concepts/services-networking/service/), він створює відповідний [DNS-запис](/docs/concepts/services-networking/dns-pod-service/). Цей запис має вигляд `<імʼя-сервісу>.<імʼя-простору-імен>.svc.cluster.local`, що означає, що якщо контейнер використовує `<імʼя-сервісу>`, воно буде розпізнано як сервіс, який знаходиться в межах простору імен. Це корисно для використання однакової конфігурації в кількох просторах імен, таких як Development, Staging та Production. Якщо ви хочете отримати доступ за межі просторів імен, вам потрібно використовувати повністю кваліфіковане доменне імʼя (FQDN).

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [налаштування простору імен](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Дізнайтеся більше про [налаштування простору імен для запиту](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* Перегляньте [проєкт дизайну просторів імен](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md).
