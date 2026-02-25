---
title: DaemonSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "DaemonSet"
description: >-
  DaemonSet визначає Podʼи, які надають локальні обʼєкти вузлів. Вони можуть бути фундаментальними для роботи вашого кластера, наприклад, допоміжним інструментом для роботи з мережею, або бути частиною надбудови.
content_type: concept
weight: 40
hide_summary: true # Listed separately in section index
---

<!-- overview -->

_**DaemonSet**_ переконується, що всі (або деякі) вузли запускають копію Podʼа. При додаванні вузлів до кластера, на них додаються Podʼи. При видаленні вузлів з кластера ці Podʼи видаляються. Видалення DaemonSet призведе до очищення створених ним Podʼів.

Деякі типові використання DaemonSet включають:

- запуск демона кластерного сховища на кожному вузлі
- запуск демона збору логів на кожному вузлі
- запуск демона моніторингу вузла на кожному вузлі

У простому випадку один DaemonSet, який охоплює всі вузли, може використовуватися для кожного типу демона. Складніше налаштування може використовувати кілька DaemonSet для одного типу демона, але з різними прапорцями, або різними запитами памʼяті та CPU для різних типів обладнання.

<!-- body -->

## Створення специфікації DaemonSet {#writing-a-daemonset-spec}

### Створення DaemonSet {#creating-a-daemonset}

Ви можете описати DaemonSet у файлі YAML. Наприклад, файл `daemonset.yaml` нижче описує DaemonSet, який запускає Docker-образ fluentd-elasticsearch:

{{% code_sample file="controllers/daemonset.yaml" %}}

Створіть DaemonSet на основі файлу YAML:

```bash
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

### Обовʼязкові поля {#required-fields}

Як і з будь-якою іншою конфігурацією Kubernetes, DaemonSet потребує полів `apiVersion`, `kind` та `metadata`. Для загальної інформації щодо роботи з файлами конфігурації, див. [запуск stateless застосунків](/docs/tasks/run-application/run-stateless-application-deployment/) та [управління обʼєктами за допомогою kubectl](/docs/concepts/overview/working-with-objects/object-management/).

Назва обʼєкта DaemonSet повинна бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

DaemonSet також потребує [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) розділу.

### Шаблон Podʼа {#pod-template}

`.spec.template` — одне з обовʼязкових полів в `.spec`.

`.spec.template` — це [шаблон Podʼа](/docs/concepts/workloads/pods/#pod-templates). Він має ту саму схему, що і {{< glossary_tooltip text="Pod" term_id="pod" >}}, за винятком того, що він вкладений і не має `apiVersion` або `kind`.

Окрім обовʼязкових полів для Podʼа, шаблон Podʼа в DaemonSet повинен вказати  відповідні мітки (див. [вибір Podʼа](#вибір-Podʼа)).

Шаблон Pod в DaemonSet повинен мати [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) рівну `Always` або бути не вказаною, що типово рівнозначно `Always`.

### Селектор Podʼа {#pod-selector}

`.spec.selector` — обовʼязкове поле в `.spec`.

Поле `.spec.selector` — це селектор Podʼа. Воно працює так само як і `.spec.selector` в [Job](/docs/concepts/workloads/controllers/job/).

Ви повинні вказати селектор Podʼа, який відповідає міткам `.spec.template`. Крім того, після створення DaemonSet, його `.spec.selector` не може бути змінено. Зміна вибору Podʼа може призвести до навмисного залишення Podʼів сиротами, і це буде плутати користувачів.

`.spec.selector` — це обʼєкт, що складається з двох полів:

- `matchLabels` - працює так само як і `.spec.selector` у [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
- `matchExpressions` - дозволяє будувати складніші селектори, вказуючи ключ, список значень та оператор, який повʼязує ключ і значення.

Коли вказані обидва, результат є має мати збіг з обома.

`.spec.selector` повинен відповідати `.spec.template.metadata.labels`. Конфігурація з цими двома несумісними буде відхилена API.

### Запуск Podʼів на вибраних вузлах {#running-pods-on-selected-nodes}

Якщо ви вказуєте `.spec.template.spec.nodeSelector`, тоді контролер DaemonSet буде
створювати Podʼи на вузлах, які відповідають [селектору вузла](/docs/concepts/scheduling-eviction/assign-pod-node/). Так само, якщо ви вказуєте `.spec.template.spec.affinity`, тоді контролер DaemonSet буде створювати Podʼи на вузлах, які відповідають цій [спорідненості вузла](/docs/concepts/scheduling-eviction/assign-pod-node/). Якщо ви не вказали жодного з них, контролер DaemonSet буде створювати Podʼи на всіх вузлах.

## Як заплановані Daemon Podʼи {#how-daemon-pods-are-scheduled}

DaemonSet може бути використаний для того, щоб забезпечити, щоб всі придатні вузли запускали копію Podʼа. Контролер DaemonSet створює Pod для кожного придатного вузла та додає поле `spec.affinity.nodeAffinity` Podʼа для відповідності цільовому хосту. Після створення Podʼа, зазвичай вступає в дію типовий планувальник і привʼязує Pod до цільового хосту, встановлюючи поле `.spec.nodeName`. Якщо новий Pod не може поміститися на вузлі, типовий планувальник може здійснити перерозподіл (виселення) деяких наявних Podʼів на основі [пріоритету](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) нового Podʼа.

{{< note >}}
Якщо важливо, щоб Pod DaemonSet запускався на кожному вузлі, часто бажано встановити `.spec.template.spec.priorityClassName` DaemonSet на [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) з вищим пріоритетом, щоб переконатись, що таке виселення видбувається.
{{< /note >}}

Користувач може вказати інший планувальник для Podʼів DaemonSet, встановивши поле `.spec.template.spec.schedulerName` DaemonSet.

Оригінальна спорідненість вузла, вказана в полі `.spec.template.spec.affinity.nodeAffinity` (якщо вказано), береться до уваги контролером DaemonSet при оцінці придатних вузлів, але замінюється на спорідненість вузла, що відповідає імені придатного вузла, на створеному Podʼі.

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```

### Taint та toleration {#taints-and-tolerations}

Контролер DaemonSet автоматично додає набір {{< glossary_tooltip text="toleration" term_id="toleration" >}} до Podʼів DaemonSet:

{{< table caption="Toleration для Podʼів DaemonSet" >}}

| Ключ толерантності                                                                                                    | Ефект        | Деталі                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`node.kubernetes.io/not-ready`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready)             | `NoExecute`  | Podʼи DaemonSet можуть бути заплановані на вузли, які не є справними або готовими приймати Podʼи. Будь-які Podʼи DaemonSet, які працюють на таких вузлах, не будуть виселені. |
| [`node.kubernetes.io/unreachable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unreachable)         | `NoExecute`  | Podʼи DaemonSet можуть бути заплановані на вузли, які недоступні з контролера вузла. Будь-які Podʼи DaemonSet, які працюють на таких вузлах, не будуть виселені. |
| [`node.kubernetes.io/disk-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-disk-pressure)     | `NoSchedule` | Podʼи DaemonSet можуть бути заплановані на вузли із проблемами дискового тиску.                                                                         |
| [`node.kubernetes.io/memory-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-memory-pressure) | `NoSchedule` | Podʼи DaemonSet можуть бути заплановані на вузли із проблемами памʼяті.                                                                        |
| [`node.kubernetes.io/pid-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-pid-pressure) | `NoSchedule` | Podʼи DaemonSet можуть бути заплановані на вузли з проблемами процесів.                                                                        |
| [`node.kubernetes.io/unschedulable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unschedulable)   | `NoSchedule` | Podʼи DaemonSet можуть бути заплановані на вузли, які не можна планувати.                                                                            |
| [`node.kubernetes.io/network-unavailable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-network-unavailable) | `NoSchedule` | **Додається лише для Podʼів DaemonSet, які запитують мережу вузла**, тобто Podʼи з `spec.hostNetwork: true`. Такі Podʼи DaemonSet можуть бути заплановані на вузли із недоступною мережею.|

{{< /table >}}

Ви можете додавати свої толерантності до Podʼів DaemonSet, визначивши їх в шаблоні Podʼа DaemonSet.

Оскільки контролер DaemonSet автоматично встановлює толерантність `node.kubernetes.io/unschedulable:NoSchedule`, Kubernetes може запускати Podʼи DaemonSet на вузлах, які відзначені як _unschedulable_.

Якщо ви використовуєте DaemonSet для надання важливої функції на рівні вузла, такої як [мережа кластера](/docs/concepts/cluster-administration/networking/), то корисно, що Kubernetes розміщує Podʼи DaemonSet на вузлах до того, як вони будуть готові. Наприклад, без цієї спеціальної толерантності ви можете опинитися в тупиковій ситуації, коли вузол не позначений як готовий, тому що мережевий втулок не працює там, і в той самий час мережевий втулок не працює на цьому вузлі, оскільки вузол ще не готовий.

## Взаємодія з Daemon Podʼами {#communicating-with-daemon-pods}

Деякі можливі шаблони для взаємодії з Podʼами у DaemonSet:

- **Push**: Podʼи в DaemonSet налаштовані надсилати оновлення до іншого сервісу, такого як база статистики. У них немає клієнтів.
- **NodeIP та відомий порт**: Podʼи в DaemonSet можуть використовувати `hostPort`, щоб їх можна було знайти за IP-адресою вузла. Клієнти певним чином знають стандартний список IP-адрес вузлів і порти.
- **DNS**: Створіть [headless сервіс](/docs/concepts/services-networking/service/#headless-services) за таким же вибором Podʼа, а потім виявіть DaemonSet, використовуючи ресурс `endpoints` або отримайте кілька записів A з DNS.
- **Сервіс**: Створіть сервіс із тим самим вибором Podʼа та використовуйте сервіс для зʼєднання з демоном на випадковому вузлі. Використовуйте [Політики внутрішнього трафіку Service](/docs/concepts/services-networking/service-traffic-policy/) для того, щоб обмежити трафік до Podʼів на тому ж вузлі.

## Оновлення DaemonSet {#updating-a-daemonset}

Якщо мітки вузлів змінюються, DaemonSet негайно додає Podʼи на нові відповідні вузли та видаляє Podʼи на нових не відповідних вузлах.

Ви можете змінювати Podʼи, які створює DaemonSet. Проте Podʼи не дозволяють оновлювати всі поля. Крім того, контролер DaemonSet буде використовувати початковий шаблон при наступному створенні вузла (навіть з тим самим імʼям).

Ви можете видалити DaemonSet. Якщо ви вказали `--cascade=orphan` з `kubectl`, тоді Podʼи залишаться на вузлах. Якщо ви потім створите новий DaemonSet з тим самим селектором, новий DaemonSet прийме наявні Podʼи. Якщо потрібно замінити які-небудь Podʼи, DaemonSet їх замінює згідно з його `updateStrategy`.

Ви можете [виконати поетапне оновлення](/docs/tasks/manage-daemon/update-daemon-set/) DaemonSet.

## Альтернативи DaemonSet {#alternatives-to-daemonset}

### Скрипти ініціалізації {#init-scripts}

Звичайно, можливо запускати процеси демонів, безпосередньо стартуючи їх на вузлі (наприклад, за допомогою `init`, `upstartd` або `systemd`). Це абсолютно прийнятно. Однак існують кілька переваг запуску таких процесів через DaemonSet:

- Можливість моніторингу та управління логами для демонів так само як і для застосунків.
- Однакова мова конфігурації та інструменти (наприклад, шаблони Podʼа, `kubectl`) для демонів та застосунків.
- Запуск демонів у контейнерах з обмеженням ресурсів підвищує ізоляцію між демонами та контейнерами застосунків. Однак це також можна досягти, запускаючи демонів у контейнері, але не в Podʼі.

### Тільки Podʼи {#bare-pods}

Можливо створити Podʼи безпосередньо, вказуючи певний вузол для запуску. Проте DaemonSet замінює Podʼи, які видаляються або завершуються з будь-якої причини, такої як збій вузла або руйнівне обслуговування вузла, наприклад, оновлення ядра. З цієї причини слід використовувати DaemonSet замість створення тільки Podʼів.

### Статичні Podʼи {#static-pods}

Можливо створити Podʼи, записавши файл у певну теку, що спостерігається Kubelet. Їх називають [статичними Podʼами](/docs/tasks/configure-pod-container/static-pod/). На відміну від DaemonSet, статичними Podʼами не можна управляти за допомогою `kubectl` або інших клієнтів API Kubernetes. Статичні Podʼи не залежать від apiserver, що робить їх корисними в разі початкового налаштування кластера. Однак, статичні Podʼи можуть бути застарілими у майбутньому.

### Deployments

DaemonSet схожий на [Розгортання (Deployments)](/docs/concepts/workloads/controllers/deployment/) тим, що обидва створюють Podʼи, і ці Podʼи мають процеси, які не очікується, що завершаться (наприклад, вебсервери, сервери сховищ).

Використовуйте Розгортання для stateless служб, таких як фронтенди, де важливо збільшувати та зменшувати кількість реплік та розгортати оновлення. Використовуйте DaemonSet, коли важливо, щоб копія Podʼа завжди працювала на всіх або певних вузлах, якщо DaemonSet надає функціональність рівня вузла, яка дозволяє іншим Podʼам правильно працювати на цьому конкретному вузлі.

Наприклад, [мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) часто включають компонент, який працює як DaemonSet. Цей компонент DaemonSet переконується, що вузол, де він працює, має справну кластерну мережу.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Podʼи](/docs/concepts/workloads/pods):
  - Дізнайтеся про [статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/), які корисні для запуску компонентів {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes.
- Дізнайтеся, як використовувати DaemonSets:
  - [Виконати поетапне оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
  - [Виконати відкат DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/) (наприклад, якщо розгортання не працює так, як ви очікували).
- Дізнайтесь [як Kubernetes призначає Podʼи вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/).
- Дізнайтеся про [втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) та [надбудови](/docs/concepts/cluster-administration/addons/), які часто працюють як DaemonSets.
- `DaemonSet` — це ресурс верхнього рівня у Kubernetes REST API. Ознайомтесь з визначенням обʼєкта {{< api-reference page="workload-resources/daemon-set-v1" >}}, щоб зрозуміти API для DaemonSet.
