---
title: Cloud Controller Manager
content_type: concept
weight: 40
theme_lock: light
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

Технології хмарної інфраструктури дозволяють вам запускати Kubernetes в публічних, приватних та гібридних хмарах. Kubernetes вірить в автоматизовану інфраструктуру, що працює за допомогою API без тісного звʼязку між компонентами.

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Cloud-controller-manager — це">}}

Cloud-controller-manager структурується за допомогою механізму втулків, який дозволяє різним хмарним провайдерам інтегрувати свої платформи з Kubernetes.

<!-- body -->

## Дизайн {#design}

![Компоненти Kubernetes](/images/docs/components-of-kubernetes.svg)

Cloud-controller-manager працює в панелі управління як реплікований набір процесів (зазвичай це контейнери в Podʼах). Кожен cloud-controller-manager реалізує кілька {{< glossary_tooltip text="контролерів" term_id="controller" >}} в одному процесі.

{{< note >}}
Ви також можете запускати cloud-controller-manager як {{< glossary_tooltip text="надбудову" term_id="addons" >}} Kubernetes, а не як частину панелі управління.
{{< /note >}}

## Функції cloud-controller-manager {#functions-of-the-ccm}

Контролери всередині cloud-controller-manager включають:

### Контролер вузлів {#node-controller}

Контролер вузлів відповідає за оновлення обʼєктів {{< glossary_tooltip text="Node" term_id="node" >}} при створенні нових серверів у вашій хмарній інфраструктурі. Контролер вузлів отримує інформацію про хости, які працюють у вашому обліковому записі у хмарному провайдері. Контролер вузлів виконує такі функції:

1. Оновлення обʼєкта Node відповідним унікальним ідентифікатором сервера, отриманим з API хмарного провайдера.
2. Додавання до обʼєкта Node анотацій та міток з інформацією, специфічною для хмари, такою як регіон, в якому розгорнуто вузол, та доступні йому ресурси (CPU, памʼять тощо).
3. Отримання імені хоста та мережевих адрес.
4. Перевірка стану вузла. Якщо вузол перестає відповідати, цей контролер перевіряє за допомогою API вашого хмарного провайдера, чи сервер був деактивований / видалений / завершений. Якщо вузол був видалений з хмари, контролер видаляє обʼєкт Node з вашого кластера Kubernetes.

Деякі реалізації від хмарних провайдерів розділяють це на контролер вузлів та окремий контролер життєвого циклу вузла.

### Контролер маршрутів {#route-controller}

Контролер маршрутів відповідає за налаштування маршрутів у хмарі відповідним чином, щоб контейнери на різних вузлах вашого кластера Kubernetes могли взаємодіяти один з одним.

Залежно від хмарного провайдера контролер маршрутів може також виділяти блоки IP-адрес для мережі Podʼів.

### Контролер Service {#service-controller}

{{< glossary_tooltip text="Services" term_id="service" >}} інтегруються з компонентами хмарної інфраструктури, такими як керовані балансувальники навантаження, IP-адреси, мережеве фільтрування пакетів та перевірка стану цільового обʼєкта. Контролер Service взаємодіє з API вашого хмарного провайдера для налаштування балансувальників навантаження та інших компонентів інфраструктури, коли ви оголошуєте ресурс Service, який їх потребує.

## Авторизація {#authorization}

У цьому розділі розглядаються доступи, яких потребує cloud-controller-manager для різних обʼєктів API для виконання своїх операцій.

### Контролер вузлів {#authorization-node-controller}

Контролер вузлів працює тільки з обʼєктами Node. Він вимагає повного доступу для читання та модифікації обʼєктів Node.

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### Контролер маршрутів {#authorization-route-controller}

Контролер маршрутів відстежує створення обʼєктів Node та налаштовує маршрути відповідним чином. Він вимагає доступу Get до обʼєктів Node.

`v1/Node`:

- get

### Контролер Service {#authorization-service-controller}

Контролер Service відстежує події **create**, **update** та **delete** обʼєктів Service, а потім відповідним чином налаштовує балансувальники навантаження для цих Services.

Для доступу до Service потрібні доступи **list** та **watch**. Для оновлення Service потрібен доступ **patch** та **update** до підресурсу `status`.

`v1/Service`:

- list
- get
- watch
- patch
- update

### Інші {#authorization-miscellaneous}

Реалізація ядра cloud-controller-manager потребує доступу до створення Event, а для забезпечення безпечної роботи — доступу до створення ServiceAccounts.

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

{{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRole для cloud-controller-manager виглядає так:

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

## {{% heading "whatsnext" %}} {#whats-next}

- [Адміністрування cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager) містить інструкції щодо запуску cloud-controller-manager та управління ним.

- Щодо оновлення панелі управління з високою доступністю для використання cloud-controller-manager див. [Міграція реплікованої панелі управління для використання cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

- Хочете знати, як реалізувати свій власний cloud-controller-manager або розширити наявний проєкт?

  - Cloud-controller-manager використовує інтерфейси Go, зокрема, інтерфейс `CloudProvider`, визначений у [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69) з [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider), щоб дозволити підключати реалізації для будь-якої хмари.
  - Реалізація загальних контролерів, виділених у цьому документі (Node, Route та Service), а також допоміжний каркас разом із загальним інтерфейсом хмарного провайдера є частиною ядра Kubernetes. Реалізації, специфічні для хмарних провайдерів, знаходяться поза ядром Kubernetes і реалізують інтерфейс `CloudProvider`.
  - Для отримання додаткової інформації щодо розробки втулків див. [Розробка cloud-controller-manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
