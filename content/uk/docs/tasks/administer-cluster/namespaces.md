---
title: Спільне використання кластера з просторами імен
content_type: task
weight: 340
---

<!-- overview -->

Ця сторінка показує, як переглядати, працювати та видаляти {{< glossary_tooltip text="простори імен" term_id="namespace" >}}. На сторінці також розповідається, як використовувати простори імен Kubernetes для розділення вашого кластера.

## {{% heading "prerequisites" %}} {#before-you-begin}

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

Kubernetes починає роботу з чотирма початковими просторами імен:

* `default` — стандартний простір імен для обʼєктів без іншого простору імен.
* `kube-node-lease` — цей простір імен містить обʼєкти [Lease](/docs/concepts/architecture/leases/), повʼязані з кожним вузлом. Лізинги вузлів дозволяють kubelet надсилати [пульс](/docs/concepts/architecture/nodes/#heartbeats), щоб панель управління могла виявляти збої вузлів.
* `kube-public` — цей простір імен створюється автоматично і доступний для читання всім користувачам (зокрема неавтентифікованим). Цей простір імен здебільшого зарезервований для використання кластером на випадок, якщо деякі ресурси мають бути видимими та доступними для читання публічно в усьому кластері. Публічність цього простору імен — лише домовленість, а не вимога.
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
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

Зверніть увагу, що ці відомості показують і квоту ресурсів (якщо вона є), і діапазони обмежень ресурсів.

Квота ресурсів відстежує сукупне використання ресурсів у просторі імен і дозволяє операторам кластера визначати *жорсткі* (Hard) обмеження використання ресурсів, які може споживати простір імен.

Діапазон обмежень (limit range) визначає мінімальні/максимальні обмеження на кількість ресурсів, які може споживати окрема сутність у просторі імен.

Див. [Контроль допуску: Limit Range](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)

Простір імен може перебувати в одній із двох фаз:

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
  name: <insert-namespace-name-here>
```

Потім виконайте:

```shell
kubectl create -f ./my-namespace.yaml
```

Або ви можете створити простір імен за допомогою такої команди:

```shell
kubectl create namespace <insert-namespace-name-here>
``` 

Назва вашого простору імен повинна бути дійсною [DNS-міткою](/docs/concepts/overview/working-with-objects/names#dns-label-names).

Є необовʼязкове поле `finalizers`, яке дозволяє спостерігачам (observables) очищати ресурси щоразу, коли простір імен видаляється. Майте на увазі, що якщо ви вкажете неіснуючий завершувач (finalizer), простір імен буде створено, але він застрягне в стані `Terminating`, коли користувач спробує його видалити.

Докладніше про `finalizers` див. у [документі з проєктування](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md#finalizers) просторів імен.

## Видалення простору імен {#deleting-a-namespace}

Видаліть простір імен за допомогою команди:

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
Це видаляє _все_ у просторі імен!
{{< /warning >}}

Ця операція видалення є асинхронною, тому протягом певного часу ви будете бачити простір імен у стані `Terminating`.

## Поділ кластера за допомогою просторів імен Kubernetes {#subdividing-your-cluster-using-kubernetes-namespaces}

Стандартно під час розгортання кластера Kubernetes створюється простір імен default, щоб містити стандартний набір Podʼів, Service та Deployment, які використовуються кластером.

Якщо у вас новий кластер, ви можете переглянути наявні простори імен, виконавши такі дії:

```shell
kubectl get namespaces
```

```console
NAME      STATUS    AGE
default   Active    13m
```

### Створення нових просторів імен {#create-new-namespaces}

У цій вправі ви створите два додаткових простори імен Kubernetes для вашого вмісту.

Розгляньмо сценарій, у якому організація використовує спільний кластер Kubernetes для розробки та промислової експлуатації:

* Команда розробників хотіла б мати простір у кластері, де вона може переглядати список Podʼів, Service та Deployment, які використовує для створення та запуску свого застосунку. У цьому просторі ресурси Kubernetes зʼявляються та зникають, а обмеження на те, хто може або не може змінювати ресурси, послаблені, щоб забезпечити гнучку розробку.

* Команда експлуатації хотіла б мати простір у кластері, де вона може запровадити суворі процедури щодо того, хто може або не може змінювати набір Podʼів, Service та Deployment, які забезпечують роботу промислового сайту.

Один із шаблонів, якого може дотримуватися ця організація, — розділити кластер Kubernetes на два простори імен: `development` та `production`. Створіть два нових простори імен для вашої роботи.

Створіть простір імен `development` за допомогою kubectl:

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
```

Створіть простір імен `production` за допомогою kubectl:

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
```

Щоб переконатися, що все в порядку, виведіть список всіх просторів імен у кластері.

```shell
kubectl get namespaces --show-labels
```

```console
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

### Створення Podʼів у кожному просторі імен {#create-pods-in-each-namespace}

Простір імен Kubernetes надає область видимості для Podʼів, Service та Deployment у кластері. Користувачі, що взаємодіють з одним простором імен, не бачать вмісту іншого простору імен. Щоб продемонструвати це, створіть Deployment та Podʼи в просторі імен `development`.

```shell
kubectl create deployment snowflake \
  --image=registry.k8s.io/serve_hostname \
  -n=development --replicas=2
```

Ви створили Deployment з 2 репліками, який запускає Pod з назвою `snowflake` з базовим контейнером, що повертає імʼя хоста.

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

Це демонструє, що розробники можуть робити те, що вони хочуть, і їм не потрібно хвилюватися про те, як це вплине на контент у просторі імен `production`.

Перейдіть до простору імен `production` і покажіть, як ресурси в одному просторі імен приховані від іншого. Простір імен `production` повинен бути порожнім, і такі команди не повинні нічого повертати.

```shell
kubectl get deployment -n=production
kubectl get pods -n=production
```

Створіть кілька Podʼів у просторі імен `production`.

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

З розвитком підтримки політик у Kubernetes цей сценарій буде розширено, щоб показати, як можна надавати різні правила авторизації для кожного простору імен.

<!-- discussion -->

## Розуміння мотивації використання просторів імен {#understanding-the-motivation-for-using-namespaces}

Один кластер повинен задовольняти потреби кількох користувачів або груп користувачів (далі в цьому документі _спільнота користувачів_).

Простори імен Kubernetes допомагають різним проєктам, командам або клієнтам спільно використовувати кластер Kubernetes.

Це робиться за допомогою такого:

1. Області для [імен](/docs/concepts/overview/working-with-objects/names/).
1. Механізму для прикріплення авторизації та політики до частини кластера.

Використання кількох просторів імен не є обовʼязковим.

Кожна спільнота користувачів хоче мати можливість працювати в ізоляції від інших спільнот користувачів. У кожної спільноти користувачів свої:

1. ресурси (pods, services, replication controllers тощо)
1. політики (хто може або не може виконувати дії у своїй спільноті)
1. обмеження (цій спільноті дозволено стільки квоти тощо)

Оператор кластера може створити простір імен для кожної унікальної спільноти користувачів.

Простір імен забезпечує унікальну область для:

1. іменованих ресурсів (щоб уникнути базових конфліктів імен)
1. делегування прав управління довіреним користувачам
1. здатності обмежувати використання ресурсів спільнотою

Сценарії використання включають такі:

1. Як оператор кластера, я хочу підтримувати кілька спільнот користувачів на одному кластері.
1. Як оператор кластера, я хочу делегувати повноваження щодо частин кластера довіреним користувачам у цих спільнотах.
1. Як оператор кластера, я хочу обмежити кількість ресурсів, які кожна спільнота може споживати, щоб обмежити вплив на інші спільноти, що використовують кластер.
1. Як користувач кластера, я хочу взаємодіяти з ресурсами, які стосуються моєї спільноти користувачів, ізольовано від того, що роблять інші спільноти користувачів у кластері.

## Розуміння просторів імен та DNS {#understanding-namespaces-and-dns}

Коли ви створюєте [Service](/docs/concepts/services-networking/service/), він створює відповідний [DNS-запис](/docs/concepts/services-networking/dns-pod-service/). Цей запис має вигляд `<service-name>.<namespace-name>.svc.cluster.local`, що означає, що якщо контейнер використовує `<service-name>`, це імʼя буде розвʼязано в Service, локальний для простору імен. Це корисно для використання однакової конфігурації в кількох просторах імен, таких як Development, Staging та Production. Якщо ви хочете звертатися до інших просторів імен, вам потрібно використовувати повне доменне імʼя (FQDN).

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [встановлення обраного простору імен](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Дізнайтеся більше про [встановлення простору імен для запиту](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* Перегляньте [проєкт дизайну просторів імен](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md).
