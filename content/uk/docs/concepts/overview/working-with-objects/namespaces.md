---
title: Простори імен
aka:
  - Namespaces
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
---

<!-- overview -->

В Kubernetes _простори імен_ (_namespaces_) забезпечують механізм для ізоляції груп ресурсів в межах одного кластера. Імена ресурсів повинні бути унікальними в межах простору імен, але не між просторами імен. Засноване на просторах імен обмеження застосовується лише до {{< glossary_tooltip text="обʼєктів" term_id="object" >}}, які входять до простору імен _(наприклад, Deployments, Services тощо)_, а не до обʼєктів, що поширюються на весь кластер _(наприклад, StorageClass, Вузли, PersistentVolumes тощо)_.

<!-- body -->

## Коли використовувати кілька просторів імен {#when-to-use-multiple-namespaces}

Простори імен призначені для використання в середовищах з багатьма користувачами, розподіленими в різні команди чи проєкти. Для кластерів з кількома десятками користувачів вам, ймовірно, не потрібно створювати або думати про простори імен. Почніть використовувати простори імен, коли ви потребуєте функції, які вони забезпечують.

Простори імен визначають область імен. Назви ресурсів повинні бути унікальними в межах простору імен, але не між просторами імен. Простори імен не можуть бути вкладені один в одного, і кожен ресурс Kubernetes може бути лише в одному просторі імен.

Простори імен — це спосіб розділити ресурси кластера між кількома користувачами (за допомогою [квот ресурсів](/docs/concepts/policy/resource-quotas/)).

Не обовʼязково використовувати кілька просторів імен для відокремлення трохи відмінних ресурсів, таких як різні версії одного й того ж програмного забезпечення: використовуйте {{< glossary_tooltip text="мітки" term_id="label" >}} для розрізнення ресурсів в межах одного простору імен.

{{< note >}}
Для промислового кластера розгляньте можливість _не_ використовувати простір імен `default`. Замість цього створюйте і використовуйте інші простори імен.
{{< /note >}}

## Початкові простори імен {#initial-namespaces}

Після запуску в Kubernetes є чотирьох початкових простори імен:

`default`
: Kubernetes включає цей простір імен, щоб ви могли почати використовувати новий кластер без попереднього створення простору імен.

`kube-node-lease`
: Цей простір імен містить обʼєкти [Оренди](/docs/concepts/architecture/leases/), повʼязані з кожним вузлом. Обʼєкти оренди дозволяють kubelet відправляти [імпульси](/docs/concepts/architecture/nodes/#node-heartbeats), щоб панель управління могла виявити відмову вузла.

`kube-public`
: Цей простір імен може бути прочитаний _усіма_ клієнтами (включаючи тих, які не автентифіковані). Цей простір імен в основному призначений для внутрішнього використання кластером, у випадку, коли деякі ресурси повинні бути видимими та доступними публічно по всьому кластеру. Публічний аспект цього простору імен — це лише домовленість, яка не є обовʼязковою.

`kube-system`
: Простір імен для обʼєктів, створених системою Kubernetes.

## Робота з просторами імен {#working-with-namespaces}

Створення та видалення просторів імен описано в [документації з адміністрування просторів імен](/docs/tasks/administer-cluster/namespaces).

{{< note >}}
Уникайте створення просторів імен із префіксом `kube-`, оскільки він зарезервований для системних просторів імен Kubernetes.
{{< /note >}}

### Перегляд просторів імен {#viewing-namespaces}

Ви можете переглянути поточні простори імен у кластері за допомогою:

```shell
kubectl get namespace
```

```none
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

### Встановлення простору імен для запиту {#setting-the-namespace-for-a-request}

Щоб встановити простір імен для поточного запиту, використовуйте прапорець `--namespace`.

Наприклад:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Встановлення обраного простору імен {#setting-the-namespace-preference}

Ви можете постійно зберігати простір імен для всіх подальших команд kubectl в даному
контексті.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Перевірте його
kubectl config view --minify | grep namespace:
```

## Простори імен та DNS {#namespaces-and-dns}

При створенні [Service](/docs/concepts/services-networking/service/), створюється відповідний [DNS запис](/docs/concepts/services-networking/dns-pod-service/). Цей запис має форму `<service-name>.<namespace-name>.svc.cluster.local`, що означає,
що якщо контейнер використовує тільки `<service-name>`, він буде звертатись до сервісу, який є локальним для простору імен. Це корисно для використання одного і того ж конфігураційного файлу в кількох просторах імен, таких як Development, Staging та Production. Якщо вам потрібно досягти обʼєкта в іншому просторі імен, вам слід використовувати повне кваліфіковане доменне імʼя (FQDN).

Отже, всі імена просторів імен повинні бути дійсними
[DNS-мітками згідно RFC 1123](/docs/concepts/overview/working-with-objects/names/#dns-label-names).

{{< warning >}}
Створюючи простори імен із тими ж назвами, що і [публічні домени верхнього рівня (TLD)](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), Serviceʼи в цих просторах імен можуть мати короткі імена DNS, які перетинаються з публічними записами DNS. Завдання з будь-якого простору імен, яке виконує DNS-запит без [крапки в кінці](https://datatracker.ietf.org/doc/html/rfc1034#page-8) буде перенаправлено на ці сервіси, отримуючи перевагу над публічним DNS.

Для помʼякшення цього обмеження скоротіть привілеї для створення просторів імен довіреним користувачам. Якщо необхідно, ви можете додатково налаштувати сторонні перевірки на забезпечення безпеки, такі як [обробники доступу](/docs/reference/access-authn-authz/extensible-admission-controllers/), щоб блокувати створення будь-якого простору імен з іменем [публічних TLD](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
{{< /warning >}}

## Не всі обʼєкти мають простори імен {#not-all-objects-are-in-a-namespace}

Більшість ресурсів Kubernetes (наприклад, pods, services, replication controllers та інші) є в деяких просторах імен. Однак ресурси простору імен самі не перебувають в просторі імен. І ресурси низького рівня, такі як [nodes](/docs/concepts/architecture/nodes/) та [persistentVolumes](/docs/concepts/storage/persistent-volumes/), не перебувають в жодному просторі імен.

Щоб переглянути, які ресурси Kubernetes є в просторі імен, а які — ні:

```shell
# В просторі імен
kubectl api-resources --namespaced=true

# Не в просторі імен
kubectl api-resources --namespaced=false
```

## Автоматичне маркування {#automatic-labeling}

{{< feature-state for_k8s_version="1.22" state="stable" >}}

Панель управління Kubernetes встановлює незмінювану {{< glossary_tooltip text="мітку" term_id="label" >}} `kubernetes.io/metadata.name` для всіх просторів імен. Значення мітки — це назва простору імен.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [створення нового простору імен](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Дізнайтеся більше про [видалення простору імен](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
