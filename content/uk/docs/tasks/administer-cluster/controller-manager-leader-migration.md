---
title: Міграція реплікованої панелі управління на використання Cloud Controller Manager
linkTitle: Міграція реплікованої панелі управління на використання Cloud Controller Manager
content_type: task
weight: 250
---

<!-- overview -->

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Cloud-controller-manager — це">}}

## Контекст {#background}

У рамках [зусиль щодо виокремлення хмарного провайдера](/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/), всі контролери, специфічні для хмари, повинні бути виокремлені з `kube-controller-manager`. Усі поточні кластери, які використовують контролери хмари в `kube-controller-manager`, повинні перейти на запуск контролерів за допомогою специфічного для хмарного провайдера `cloud-controller-manager`.

Міграція лідера надає механізм, за допомогою якого високодоступні кластери можуть безпечно переносити "хмароспецифічні" контролери між `kube-controller-manager` та `cloud-controller-manager` за допомогою спільного блокування ресурсу між двома компонентами під час оновлення реплікованої панелі управління. Для панелі управління з одним вузлом або якщо недоступність менеджерів контролерів під час оновлення допустима, міграція лідера не потрібна, і цей посібник можна ігнорувати.

Міграцію лідера можна увімкнути, встановивши `--enable-leader-migration` у `kube-controller-manager` або `cloud-controller-manager`. Міграція лідера застосовується лише під час оновлення і може бути безпечно вимкнена або залишена увімкненою після завершення оновлення.

Цей посібник крок за кроком показує процес ручного оновлення панелі управління з `kube-controller-manager` із вбудованим хмарним провайдером до запуску як `kube-controller-manager`, так і `cloud-controller-manager`. Якщо ви використовуєте інструмент для розгортання та управління кластером, зверніться до документації інструменту та хмарного провайдера щодо конкретних інструкцій з міграції.

## {{% heading "prerequisites" %}} {#before-you-begin}

Припускається, що панель управління працює на версії Kubernetes N і планується оновлення до версії N + 1. Хоча можливе мігрування в межах однієї версії, ідеально міграцію слід виконати як частину оновлення, щоб зміни конфігурації можна було узгодити з кожним випуском. Точні версії N та N + 1 залежать від кожного хмарного провайдера. Наприклад, якщо хмарний провайдер створює `cloud-controller-manager` для роботи з Kubernetes 1.24, то N може бути 1.23, а N + 1 може бути 1.24.

Вузли панелі управління повинні запускати `kube-controller-manager` з увімкненим вибором лідера, що є стандартною поведінкою. Станом на версію N вбудований хмарний провайдер має бути налаштований за допомогою прапорця `--cloud-provider`, а `cloud-controller-manager` ще не повинен бути розгорнутий.

Зовнішній хмарний провайдер повинен мати `cloud-controller-manager`, зібраний з реалізацією міграції лідера. Якщо хмарний провайдер імпортує `k8s.io/cloud-provider` та `k8s.io/controller-manager` версії v0.21.0 або новішої, міграція лідера буде доступною. Однак для версій до v0.22.0 міграція лідера є альфа-функцією та потребує увімкнення функціональної можливості `ControllerManagerLeaderMigration` в `cloud-controller-manager`.

Цей посібник передбачає, що kubelet кожного вузла панелі управління запускає `kube-controller-manager` та `cloud-controller-manager` як статичні Podʼи, визначені їхніми маніфестами. Якщо компоненти працюють в іншому середовищі, відповідно скоригуйте кроки.

Щодо авторизації цей посібник передбачає, що кластер використовує RBAC. Якщо інший режим авторизації надає дозволи компонентам `kube-controller-manager` та `cloud-controller-manager`, надайте необхідний доступ у спосіб, що відповідає цьому режиму.

<!-- steps -->

### Надання доступу до лізингу міграції {#grant-access-to-migration-lease}

Стандартні дозволи менеджера контролерів дозволяють доступ лише до їхнього основного лізингу. Щоб міграція працювала, потрібен доступ до ще одного лізингу.

Ви можете надати `kube-controller-manager` повний доступ до API leases, змінивши роль `system::leader-locking-kube-controller-manager`. Цей посібник передбачає, що назва лізингу для міграції — `cloud-provider-extraction-migration`.

```shell
kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge
```

Зробіть те саме для ролі `system::leader-locking-cloud-controller-manager`.

```shell
kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge
```

### Початкова конфігурація міграції лідера {#initial-leader-migration-configuration}

Міграція лідера за бажанням використовує файл конфігурації, що відображає стан призначення контролерів менеджерам. Наразі з вбудованим хмарним провайдером `kube-controller-manager` запускає `route`, `service` та `cloud-node-lifecycle`. Наведений нижче приклад конфігурації показує це призначення.

Міграцію лідера можна увімкнути без конфігурації. Докладніше див. [Стандартна конфігурація](#default-configuration).

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: kube-controller-manager
  - name: service
    component: kube-controller-manager
  - name: cloud-node-lifecycle
    component: kube-controller-manager
```

Як альтернатива, оскільки контролери можуть працювати під будь-яким із менеджерів контролерів, встановлення `component` у `*` для обох сторін робить файл конфігурації однаковим для обох учасників міграції.

```yaml
# версія з підстановкою
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: *
  - name: service
    component: *
  - name: cloud-node-lifecycle
    component: *
```

На кожному вузлі панелі управління збережіть вміст у `/etc/leadermigration.conf` та оновіть маніфест `kube-controller-manager`, щоб файл був змонтований всередині контейнера за тим самим шляхом. Також оновіть цей маніфест, щоб додати такі аргументи:

- `--enable-leader-migration` для увімкнення міграції лідера в менеджері контролерів
- `--leader-migration-config=/etc/leadermigration.conf` для встановлення файлу конфігурації

Перезапустіть `kube-controller-manager` на кожному вузлі. Тепер у `kube-controller-manager` увімкнено міграцію лідера, і він готовий до міграції.

### Розгортання Cloud Controller Manager {#deploy-cloud-controller-manager}

У версії N + 1 бажаний стан призначення контролерів менеджерам може бути представлений новим файлом конфігурації, який показано нижче. Зверніть увагу, що поле `component` кожного `controllerLeaders` змінюється з `kube-controller-manager` на `cloud-controller-manager`. Як альтернатива, використовуйте версію з підстановкою, згадану вище, яка має той самий ефект.

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: cloud-controller-manager
  - name: service
    component: cloud-controller-manager
  - name: cloud-node-lifecycle
    component: cloud-controller-manager
```

Під час створення вузлів панелі управління версії N + 1 вміст має бути розгорнутий в `/etc/leadermigration.conf`. Маніфест `cloud-controller-manager` має бути оновлений для монтування файлу конфігурації так само, як і для `kube-controller-manager` версії N. Так само додайте `--enable-leader-migration` та `--leader-migration-config=/etc/leadermigration.conf` до аргументів `cloud-controller-manager`.

Створіть новий вузол панелі управління версії N + 1 з оновленим маніфестом `cloud-controller-manager` та з прапорцем `--cloud-provider`, встановленим у `external` для `kube-controller-manager`. У `kube-controller-manager` версії N + 1 НЕ ПОВИННА бути увімкнена міграція лідера, оскільки із зовнішнім хмарним провайдером він більше не запускає мігровані контролери, а отже, не бере участі в міграції.

Докладніше про розгортання `cloud-controller-manager` див. [Адміністрування Cloud Controller Manager](/docs/tasks/administer-cluster/running-cloud-controller/).

### Оновлення панелі управління {#upgrade-control-plane}

Панель управління тепер містить вузли як версії N, так і N + 1. Вузли версії N запускають лише `kube-controller-manager`, а вузли версії N + 1 запускають як `kube-controller-manager`, так і `cloud-controller-manager`. Мігровані контролери, зазначені у конфігурації, працюють під `kube-controller-manager` версії N або `cloud-controller-manager` версії N + 1 залежно від того, який менеджер контролерів утримує лізинг міграції. Жоден контролер ніколи не працюватиме під обома менеджерами контролерів одночасно.

Поступово створіть новий вузол панелі управління версії N + 1 та вимкніть один вузол версії N до тих пір, поки панель управління не буде містити лише вузли версії N + 1. Якщо потрібно відкотитись з версії N + 1 на версію N, додайте вузли версії N з увімкненою міграцією лідера для `kube-controller-manager` назад до панелі управління, замінюючи один вузол версії N + 1 кожен раз, поки не залишаться лише вузли версії N.

### (Необовʼязково) Вимкнення міграції лідера {#disable-leader-migration}

Тепер, коли панель управління оновлено для запуску як `kube-controller-manager`, так і `cloud-controller-manager` версії N + 1, міграція лідера завершила свою роботу і може бути безпечно вимкнена, щоб заощадити один ресурс Lease. У майбутньому можна безпечно знову увімкнути міграцію лідера для відкату.

Поступово оновіть маніфест `cloud-controller-manager`, щоб прибрати обидва прапорці `--enable-leader-migration` та `--leader-migration-config=`, також видаліть монтування `/etc/leadermigration.conf`, а потім видаліть сам `/etc/leadermigration.conf`. Щоб знову увімкнути міграцію лідера, створіть файл конфігурації заново та поверніть до `cloud-controller-manager` його монтування і прапорці, які вмикають міграцію лідера.

### Стандартна конфігурація {#default-configuration}

Починаючи з Kubernetes 1.22, міграція лідера надає стандартну конфігурацію, яка підходить для стандартного призначення контролерів менеджерам. Стандартну конфігурацію можна увімкнути, встановивши `--enable-leader-migration`, але без `--leader-migration-config=`.

Для `kube-controller-manager` та `cloud-controller-manager`, якщо немає жодних прапорців, що вмикають будь-якого вбудованого хмарного провайдера або змінюють власника контролерів, можна використовувати стандартну конфігурацію, щоб уникнути ручного створення файлу конфігурації.

### Особливий випадок: міграція контролера Node IPAM {#node-ipam-controller-migration}

Якщо ваш хмарний провайдер надає реалізацію контролера Node IPAM, вам слід перейти до реалізації в `cloud-controller-manager`. Вимкніть контролер Node IPAM в `kube-controller-manager` версії N + 1, додавши `--controllers=*,-nodeipam` до його прапорців. Потім додайте `nodeipam` до списку мігрованих контролерів.

```yaml
# версія з підстановкою, з nodeipam
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: *
  - name: service
    component: *
  - name: cloud-node-lifecycle
    component: *
  - name: nodeipam
    component: *
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Прочитайте пропозицію щодо покращення [Міграція лідера менеджера контролерів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration).
