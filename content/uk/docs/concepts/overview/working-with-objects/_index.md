---
title: Обʼєкти в Kubernetes
content_type: concept
weight: 30
description: >
  Обʼєкти Kubernetes є постійними сутностями в системі Kubernetes.
  Kubernetes використовує ці сутності для подання стану вашого кластера.
  Дізнайтеся про модель обʼєктів Kubernetes та про те, як працювати з цими обʼєктами.
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

Ця сторінка пояснює, як обʼєкти Kubernetes подаються в API Kubernetes, та як ви можете описати їх у форматі `.yaml`.

<!-- body -->

## Розуміння обʼєктів Kubernetes {#kubernetes-objects}

*Обʼєкти Kubernetes* є постійними сутностями в системі Kubernetes. Kubernetes використовує ці сутності для подання стану вашого кластера. Зокрема, вони можуть описувати:

* Які контейнеризовані застосунки працюють (і на яких вузлах)
* Ресурси, доступні для цих застосунків
* Політики щодо того, як ці застосунки поводяться, такі як політики перезапуску, оновлення та стійкості до відмов

Обʼєкт Kubernetes є "записом про наміри" — після створення обʼєкта система Kubernetes постійно працюватиме, щоб переконатися, що обʼєкт існує. Створюючи обʼєкт, ви фактично повідомляєте системі Kubernetes, ваші побажання щодо того, як має виглядати робоче навантаження вашого кластера; це *бажаний стан* вашого кластера.

Для роботи з обʼєктами Kubernetes — чи то для створення, зміни чи видалення — вам потрібно використовувати [API Kubernetes](/docs/concepts/overview/kubernetes-api/). Наприклад, коли ви використовуєте інтерфейс командного рядка `kubectl`, CLI виконує необхідні виклики API Kubernetes за вас. Ви також можете використовувати API Kubernetes безпосередньо у ваших власних програмах за допомогою однієї з [Клієнтських бібліотек](/docs/reference/using-api/client-libraries/).

### Специфікація та стан обʼєкта {#object-spec-and-status}

Майже кожен обʼєкт Kubernetes містить два вкладених поля обʼєкта, які керують конфігурацією обʼєкта: *`spec`* та *`status`* обʼєкта. Для обʼєктів, які мають `spec`, вам потрібно встановити його при створенні обʼєкта, надаючи опис характеристик, які ви хочете, щоб ресурс мав: його *бажаний стан*.

`status` описує *поточний стан* обʼєкта, який надається та оновлюється системою Kubernetes та її компонентами. {{< glossary_tooltip text="Control plane" term_id="control-plane" >}} Kubernetes постійно та активно керує фактичним станом кожного обʼєкта, щоб він відповідав бажаному стану, який ви вказали.

Наприклад: в Kubernetes, Deployment є обʼєктом, який може представляти застосунок, який працює на вашому кластері. При створенні Deployment ви можете встановити `spec` Deployment, щоб вказати, що ви хочете, щоб працювало три репліки застосунку. Система Kubernetes читає `spec` Deployment та запускає три екземпляри вашого застосунку — оновлюючи `status` Deployment, щоб віддзеркалювати поточний стан розгорнення. Якщо один цих екземплярів зазнає збою (зміни стану), Kubernetes відреагує на відмінність між `spec` та `status`, створивши новий екземпляр, щоб забезпечити, щоб `status` відповідав `spec`.

З докладнішою інформацією про spec, status та metadata обʼєктів Kubernetes звертайтесь до [Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Опис обʼєктів Kubernetes {#describing-a-kubernetes-object}

Коли ви створюєте обʼєкт Kubernetes, ви повинні визначити spec обʼєкта, який описує бажаний стан обʼєкта, а також інші відомості про обʼєкт, наприклад його назву (name). Коли ви використовуєте API Kubernetes для створення обʼєкта, чи безпосередньо, чи за допомогою `kubectl`, цей запит до API має містити ці відомості у вигляді JSON в тілі запиту. Найчастіше інформація про обʼєкт подається `kubectl` у вигляді файлу, який називається *маніфестом*. За домовленістю, маніфести обʼєктів Kubernetes подаються у форматі YAML (ви також можете використовувати JSON). Інструменти, такі як `kubectl`, перетворюють інформацію з маніфесту у JSON або інший підтримуваний формат серіалізації надсилаючи HTTP-запити до API.

Ось приклад маніфесту, який містить обовʼязкові поля обʼєкта та його spec для Kubernetes Deployment:

{{% code_sample file="application/deployment.yaml" %}}

Один зі способів створення Deployment за допомогою маніфесту, подібного до показаного вище, — використання команди [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) в інтерфейсі командного рядка `kubectl`, передаючи файл `.yaml` як аргумент. Ось так:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Вивід буде схожий на цей:

```output
deployment.apps/nginx-deployment created
```

### Обовʼязкові поля {#required-fields}

В маніфесті (файл YAML або JSON) обʼєкта Kubernetes, який ви хочете створити, ви повинні вказати значення для наступних обовʼязкових полів:

* `apiVersion` — версія API Kubernetes, яку ви використовуєте для створення обʼєкта
* `kind` — тип обʼєкта, який ви хочете створити
* `metadata` — відомості про обʼєкт, які дозволяють ідентифікувати обʼєкт, включаючи рядок `name`, який вказує назву обʼєкта, `UID`, та, необовʼязково, `namespace`
* `spec` — опис бажаного стану обʼєкта

Точний формат `spec` обʼєкта є різним для кожного типу обʼєкта в Kubernetes та містить вкладені поля, що притаманні конкретному типу обʼєкта. [Kubernetes API Reference](/docs/reference/kubernetes-api/) може допомогти знайти формати для всіх типів обʼєктів, які ви хочете створити використовуючи API Kubernetes.

Наприклад, подивіться на [поле `spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) для обʼєкта Pod. Для кожного Pod, поле `.spec` вказує на Pod та його бажаний стан (наприклад, назву образу контейнера для кожного контейнера всередині цього Pod). Інший приклад специфікації обʼєкта — [поле `spec`](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec) для обʼєкта StatefulSet. Для StatefulSet, поле `.spec` вказує на StatefulSet та його бажаний стан. У `.spec` StatefulSet є [template](/docs/concepts/workloads/pods/#pod-templates) для обʼєктів Pod. Цей шаблон описує Pod, які контролер StatefulSet створить, щоб задовольнити специфікацію StatefulSet. Різні типи обʼєктів Kubernetes можуть мати різні `.status`; дивіться [Kubernetes API Reference](/docs/reference/kubernetes-api/) для отримання відомостей структуру поля `.status` та його вміст для кожного типу обʼєкта.

{{< note >}}
[Рекомендації щодо конфігурації Kubernetes](/blog/2025/11/25/configuration-good-practices/), містять інформацію про те, як створювати конфігураційні файли YAML.
{{< /note >}}

## Перевірка полів на стороні сервера {#server-side-field-validation}

Починаючи з Kubernetes v1.25, API сервера Kubernetes може виконувати [перевірку полів на стороні сервера](/docs/reference/using-api/api-concepts/#field-validation), що дозволяє виявляти невідомі та задвоєні поля в описі обʼєктів. Це надає функціонал `kubectl --validate` на стороні сервера.

`kubectl` використовує прапорець `--validate` для встановлення рівня перевірки полів маніфесту. Його значенням може бути `ignore`, `warn` та `strict`, також можна вказати `true` (еквівалент `strict`) та `false` (еквівалент `ignore`). Типове значення перевірки для `kubectl` — `--validate=true`.

`Strict`
: Сувора перевірка, повертає збій під час виявлення помилок.

`Warn`
: Перевірка виконується, але виявлення помилок призводить до виведення попереджень, а не збою.

`Ignore`
: Перевірка на стороні сервера не виконується.

Якщо `kubectl` не може підʼєднатися до API сервера, він використовує локальну перевірку, яка виконується на стороні клієнта. Kubernetes v1.27 та пізніші версії завжди пропонуватимуть перевірку полів; версії до v1.27, скоріш за все — ні. Якщо версія Kubernetes на вашому кластері старіша за v1.27, звіртесь з документацією до вашої версії Kubernetes.

## {{% heading "whatsnext" %}}

Якщо ви тільки починаєте свій шлях з Kubernetes, дізнайтесь більше про:

* [Podʼи](/docs/concepts/workloads/pods/) — найважливіші базові обʼєкти в Kubernetes.
* [Deployment](/docs/concepts/workloads/controllers/deployment/) — ресурс, який допомагає вам керувати наборами Podʼів.
* [Контролери](/docs/concepts/architecture/controller/) в Kubernetes.
* [kubectl](/docs/reference/kubectl/) та [команди `kubectl`](/docs/reference/generated/kubectl/kubectl-commands/).

[Керування обʼєктами в Kubernetes](/docs/concepts/overview/working-with-objects/object-management/) надає додаткову інформацію про те, як працювати використовувати `kubectl` для керування обʼєктами. Скоріш за все вам буде потрібно [встановити `kubectl`](/docs/tasks/tools/install-kubectl/), якщо тільки ви цього ще не зробили.

Щоб дізнатись про API Kubernetes, зверніться до:

* [Огляд API Kubernetes](/docs/reference/using-api/)

Якщо ви хочете дізнатись про Kubernetes більше, зверніться до інших сторінок в цьому розділі:

<!-- Docsy automatically includes a list of pages in the section -->
