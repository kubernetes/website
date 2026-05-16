---
title: Cloud Controller Manager
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

Технології хмарної інфраструктури дозволяють вам запускати Kubernetes в публічних, приватних та гібридних хмарах. Kubernetes вірить в автоматизовану інфраструктуру, що працює за допомогою API без тісного звʼязку між компонентами.

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Сloud-controller-manager це">}}

Cloud-controller-manager структурується з допомогою механізму втулків, який дозволяє різним постачальникам хмар інтегрувати свої платформи з Kubernetes.

<!-- body -->

## Дизайн {#design}

![Компоненти Kubernetes](/images/docs/components-of-kubernetes.svg)

Менеджер контролера хмар працює в панелі управління як реплікований набір процесів (зазвичай це контейнери в Podʼах). Кожен контролер хмар реалізує кілька {{< glossary_tooltip text="контролерів" term_id="controller" >}} в одному процесі.

{{< note >}}
Ви також можете запускати менеджер контролера хмар як {{< glossary_tooltip text="надбудову" term_id="addons" >}} Kubernetes, а не як частину панелі управління.
{{< /note >}}

## Функції менеджера контролера хмар {#functions-of-the-ccm}

Контролери всередині менеджера контролера хмар складаються з:

### Контролер Node {#node-controller}

Контролер Node відповідає за оновлення обʼєктів {{< glossary_tooltip text="Node" term_id="node" >}} при створенні нових серверів у вашій хмарній інфраструктурі. Контролер Node отримує інформацію про хости, які працюють у вашому оточені у хмарному провайдері. Контролер Node виконує наступні функції:

1. Оновлення обʼєкта Node відповідним унікальним ідентифікатором сервера, отриманим з API постачальника хмари.
2. Анотація та маркування обʼєкта Node хмароспецифічною інформацією, такою як регіон, в якому розгорнуто вузол, та ресурси (CPU, памʼять і т. д.), якими він володіє.
3. Отримання імені хосту та мережевих адрес.
4. Перевірка стану вузла. У випадку, якщо вузол стає непридатним для відповіді, цей контролер перевіряє за допомогою API вашого постачальника хмари, чи сервер був деактивований / видалений / завершений. Якщо вузол був видалений з хмари, контролер видаляє обʼєкт Node з вашого кластера Kubernetes.

Деякі реалізації від постачальників хмар розділяють це на контролер Node та окремий контролер життєвого циклу вузла.

### Контролер Route {#route-controller}

Контролер Route відповідає за налаштування маршрутів у хмарі відповідним чином, щоб контейнери на різних вузлах вашого Kubernetes кластера могли спілкуватися один з одним.

Залежно від постачальника хмари, контролер Route може також виділяти блоки IP-адрес для мережі Podʼа.

### Контролер Service {#service-controller}

{{< glossary_tooltip text="Services" term_id="service" >}} інтегруються з компонентами хмарної інфраструктури, такими як керовані балансувальники трафіку, IP-адреси, мережеве фільтрування пакетів та перевірка стану цільового обʼєкта. Контролер Service взаємодіє з API вашого постачальника хмари для налаштування балансувальника навантаження та інших компонентів інфраструктури, коли ви оголошуєте ресурс Service, який вимагає їх.

## Авторизація {#authorization}

У цьому розділі розглядаються доступи, яких вимагає менеджер контролера хмар для різних обʼєктів API для виконання своїх операцій.

### Контролер Node {#authorization-node-controller}

Контролер Node працює тільки з обʼєктами Node. Він вимагає повного доступу для читання та модифікації обʼєктів Node.

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### Контролер Route {#authorization-route-controller}

Контролер Route відстежує створення обʼєктів Node та налаштовує маршрути відповідним чином. Він вимагає доступу Get до обʼєктів Node.

`v1/Node`:

- get

### Контролер Service {#authorization-service-controller}

Контролер Service відстежує події **create**, **update** та **delete** обʼєктів та після цього налаштовує балансувальники навантаження для цих Serviceʼів відповідно.

Для доступу до Service потрібні доступи **list** та **watch**. Для оновлення Service потрібен доступ **patch** та **update** до підресурсу `status`..

`v1/Service`:

- list
- get
- watch
- patch
- update

### Інші {#authorization-miscellaneous}

Реалізація основи менеджера контролера хмар потребує доступу до створення Event та для забезпечення безпечної роботи він потребує доступу до створення ServiceAccounts.

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

{{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRole для менеджера контролера хмар виглядає наступним чином:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - services/status
  verbs:
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
```

## {{% heading "whatsnext" %}}

- [Адміністрування менеджера контролера хмар](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager) містить інструкції щодо запуску та управління менеджером контролера хмар.

- Щодо оновлення панелі управління з розділеною доступністю для використання менеджера контролера хмар, див. [Міграція реплікованої панелі управління для використання менеджера контролера хмар](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

- Хочете знати, як реалізувати свій власний менеджер контролера хмар або розширити поточний проєкт?

  - Менеджер контролера хмар використовує інтерфейси Go, зокрема, інтерфейс `CloudProvider`, визначений у [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69) з [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider), щоб дозволити використовувати імплементації з будь-якої хмари.
  - Реалізація загальних контролерів, виділених у цьому документі (Node, Route та Service), разом із загальним інтерфейсом хмарного постачальника, є частиною ядра Kubernetes. Реалізації, специфічні для постачальників хмари, знаходяться поза ядром Kubernetes і реалізують інтерфейс `CloudProvider`.
  - Для отримання додаткової інформації щодо розробки втулків, див. [Розробка менеджера контролера хмар](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
