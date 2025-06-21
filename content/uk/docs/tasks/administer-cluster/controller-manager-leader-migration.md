---
title: Міграція реплікованої панелі управління на використання менеджера керування хмарою
linkTitle: Міграція реплікованої панелі управління на використання менеджера керування хмарою
content_type: task
weight: 250
---

<!-- overview -->

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Менеджер керування хмарою — ">}}

## Контекст {#background}

У рамках [зусиль щодо виокремлення хмарного провайдера](/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/), всі контролери, специфічні для хмари, повинні бути виокремлені з `kube-controller-manager`. Усі поточні кластери, які використовують контролери хмари в `kube-controller-manager`, повинні перейти на запуск контролерів за допомогою специфічному для хмарного провайдера `cloud-controller-manager`.

Міграція лідера надає механізм, за допомогою якого високодоступні кластери можуть безпечно мігрувати у "хмароспецифічні" контролери між `kube-controller-manager` та `cloud-controller-manager` за допомогою загального замикання ресурсів між двома компонентами під час оновлення реплікованої панелі управління. Для панелі управління з одним вузлом або якщо недоступність менеджерів контролерів може бути терпимим під час оновлення, міграція лідера не потрібна, і цей посібник можна ігнорувати.

Міграція лідера може бути увімкнена, встановленням `--enable-leader-migration` у `kube-controller-manager` або `cloud-controller-manager`. Міграція лідера застосовується лише під час оновлення і може бути безпечно вимкнена або залишена увімкненою після завершення оновлення.

Цей посібник на крок за кроком показує вам процес оновлення вручну панелі управління з `kube-controller-manager` із вбудованим хмарним провайдером до запуску як `kube-controller-manager`, так і `cloud-controller-manager`. Якщо ви використовуєте інструмент для розгортання та управління кластером, будь ласка, зверніться до документації інструменту та хмарного провайдера для конкретних інструкцій щодо міграції.

## {{% heading "prerequisites" %}}

Припускається, що панель управління працює на версії Kubernetes N і планується оновлення до версії N + 1. Хоча можливе мігрування в межах однієї версії, ідеально міграцію слід виконати як частину оновлення, щоб зміни конфігурації можна було узгодити з кожним випуском. Точні версії N та N + 1 залежать від кожного хмарного провайдера. Наприклад, якщо хмарний провайдер створює `cloud-controller-manager` для роботи з Kubernetes 1.24, то N може бути 1.23, а N + 1 може бути 1.24.

Вузли панелі управління повинні запускати `kube-controller-manager` з увімкненим вибором лідера, що є стандартною поведінкою. З версії N, вбудований хмарний провайдер має бути налаштований за допомогою прапорця `--cloud-provider`, а `cloud-controller-manager` ще не повинен бути розгорнутим.

Зовнішній хмарний провайдер повинен мати `cloud-controller-manager` зібраний з реалізацією міграції лідера. Якщо хмарний провайдер імпортує `k8s.io/cloud-provider` та `k8s.io/controller-manager` версії v0.21.0 або пізніше, міграція лідера буде доступною. Однак для версій до v0.22.0 міграція лідера є альфа-версією та потребує увімкнення `ControllerManagerLeaderMigration` в `cloud-controller-manager`.

Цей посібник передбачає, що kubelet кожного вузла панелі управління запускає `kube-controller-manager` та `cloud-controller-manager` як статичні контейнери, визначені їх маніфестами. Якщо компоненти працюють в іншому середовищі, будь ласка, відповідно скорегуйте дії.

Щодо авторизації цей посібник передбачає, що кластер використовує RBAC. Якщо інший режим авторизації надає дозволи на компоненти `kube-controller-manager` та `cloud-controller-manager`, будь ласка, надайте необхідний доступ таким чином, що відповідає режиму.

<!-- steps -->

### Надання доступу до Лізингу Міграції {#grant-access-to-migration-lease}

Стандартні дозволи менеджера керування дозволяють доступ лише до їхнього основного Лізингу. Для того, щоб міграція працювала, потрібен доступ до іншого Лізингу.

Ви можете надати `kube-controller-manager` повний доступ до API лізингів, змінивши роль `system::leader-locking-kube-controller-manager`. Цей посібник передбачає, що назва лізингу для міграції — `cloud-provider-extraction-migration`.

```shell
kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`
```

Зробіть те саме для ролі `system::leader-locking-cloud-controller-manager`.

```shell
kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`
```

### Початкова конфігурація міграції лідера {#initial-leader-migration-configuration}

Міграція лідера опціонально використовує файл конфігурації, що представляє стан призначення контролерів до менеджера. На цей момент, з вбудованим хмарним провайдером, `kube-controller-manager` запускає `route`, `service`, та `cloud-node-lifecycle`. Наведений нижче приклад конфігурації показує призначення.

Міграцію лідера можна увімкнути без конфігурації. Будь ласка, див. [Станадартну конфігурацію](#default-configuration) для отримання деталей.

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

Альтернативно, оскільки контролери можуть працювати з менеджерами контролера, налаштування `component` на `*` для обох сторін робить файл конфігурації збалансованим між обома сторонами міграції.

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

На кожному вузлі панелі управління збережіть вміст у `/etc/leadermigration.conf`, та оновіть маніфест `kube-controller-manager`, щоб файл був змонтований всередині контейнера за тим самим шляхом. Також, оновіть цей маніфест, щоб додати наступні аргументи:

- `--enable-leader-migration` для увімкнення міграції лідера у менеджері керування
- `--leader-migration-config=/etc/leadermigration.conf` для встановлення файлу конфігурації

Перезапустіть `kube-controller-manager` на кожному вузлі. Тепер, `kube-controller-manager` має увімкнену міграцію лідера і готовий до міграції.

### Розгортання менеджера керування хмарою {#deploy-cloud-controller-manager}

У версії N + 1, бажаний стан призначення контролерів до менеджера може бути представлений новим файлом конфігурації, який показано нижче. Зверніть увагу, що поле `component` кожного `controllerLeaders` змінюється з `kube-controller-manager` на `cloud-controller-manager`. Альтернативно, використовуйте версію з підстановкою, згадану вище, яка має той самий ефект.

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

Під час створення вузлів панелі управління версії N + 1, вміст повинен бути розгорнутим в `/etc/leadermigration.conf`. Маніфест `cloud-controller-manager` повинен бути оновлений для монтування файлу конфігурації так само як і `kube-controller-manager` версії N. Також, додайте `--enable-leader-migration` та `--leader-migration-config=/etc/leadermigration.conf` до аргументів `cloud-controller-manager`.

Створіть новий вузол панелі управління версії N + 1 з оновленим маніфестом `cloud-controller-manager`, та з прапорцем `--cloud-provider`, встановленим на `external` для `kube-controller-manager`. `kube-controller-manager` версії N + 1 НЕ МУСИТЬ мати увімкненої міграції лідера, оскільки, зовнішній хмарний провайдер вже не запускає мігровані контролери, і, отже, він не бере участі в міграції.

Будь ласка, зверніться до [Адміністрування менеджера керування хмарою](/docs/tasks/administer-cluster/running-cloud-controller/) для отримання детальнішої інформації щодо розгортання `cloud-controller-manager`.

### Оновлення панелі управління {#update-control-plane}

Панель управління тепер містить вузли як версії N, так і N + 1. Вузли версії N запускають лише `kube-controller-manager`, а вузли версії N + 1 запускають як `kube-controller-manager`, так і `cloud-controller-manager`. Мігровані контролери, зазначені у конфігурації, працюють під менеджером управління хмарою версії N або `cloud-controller-manager` версії N + 1 залежно від того, який менеджер управління утримує лізинг міграції. Жоден контролер ніколи не працюватиме під обома менеджерами управління одночасно.

Поступово створіть новий вузол панелі управління версії N + 1 та вимкніть один вузол версії N до тих пір, поки панель управління не буде містити лише вузли версії N + 1. Якщо потрібно відкотитись з версії N + 1 на версію N, додайте вузли версії N з увімкненою міграцією лідера для `kube-controller-manager` назад до панелі управління, замінюючи один вузол версії N + 1 кожен раз, поки не залишаться лише вузли версії N.

### (Необовʼязково) Вимкнення міграції лідера {#disable-leader-migration}

Тепер, коли панель управління була оновлена для запуску як `kube-controller-manager`, так і `cloud-controller-manager` версії N + 1, міграція лідера завершила свою роботу і може бути безпечно вимкнена для збереження ресурсу лізингу. У майбутньому можна безпечно повторно увімкнути міграцію лідера для відкату.

Поступово у менеджері оновіть маніфест `cloud-controller-manager`, щоб скасувати встановлення як `--enable-leader-migration`, так і `--leader-migration-config=`, також видаліть підключення `/etc/leadermigration.conf`, а потім видаліть `/etc/leadermigration.conf`. Щоб повторно увімкнути міграцію лідера, створіть знову файл конфігурації та додайте його монтування та прапорці, які увімкнуть міграцію лідера назад до `cloud-controller-manager`.

### Стандартна конфігурація {#default-configuration}

Починаючи з Kubernetes 1.22, Міграція лідера надає стандартну конфігурацію, яка підходить для стандартного призначення контролерів до менеджера. Стандартну конфігурацію можна увімкнути, встановивши `--enable-leader-migration`, але без `--leader-migration-config=`.

Для `kube-controller-manager` та `cloud-controller-manager`, якщо немає жодних прапорців, що увімкнуть будь-якого вбудованого хмарного провайдера або змінять володільця контролерів, можна використовувати стандартну конфігурацію, щоб уникнути ручного створення файлу конфігурації.

### Спеціальний випадок: міграція контролера Node IPAM {#node-ipam-controller-migration}

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

## {{% heading "whatsnext" %}}

- Прочитайте пропозицію щодо покращення [Міграції лідера менеджера управління](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration).
