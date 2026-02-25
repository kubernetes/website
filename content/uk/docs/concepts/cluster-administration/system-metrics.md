---
title: Метрики для компонентів системи Kubernetes
content_type: concept
weight: 70
---

<!-- overview -->

Метрики системних компонентів можуть краще показати, що відбувається всередині. Метрики особливо корисні для побудови інформаційних панелей та сповіщень.

Компоненти Kubernetes видають метрики у [форматі Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/). Цей формат являє собою структурований звичайний текст, призначений для зручного сприйняття як людьми, так і машинами.

<!-- body -->

## Метрики в Kubernetes {#metrics-in-kubernetes}

У більшості випадків метрики доступні на точці доступу `/metrics` HTTP сервера. Для компонентів, які типово не показують цю точку, її можна активувати за допомогою прапорця `--bind-address`.

Приклади таких компонентів:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

У промисловому середовищі ви, можливо, захочете налаштувати [Prometheus Server](https://prometheus.io/) або інший інструмент збору метрик для їх періодичного отримання і доступу у якомусь виді бази даних часових рядів.

Зверніть увагу, що {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} також викладає метрики на `/metrics/cadvisor`, `/metrics/resource` та `/metrics/probes`. Ці метрики не мають того самого життєвого циклу.

Якщо ваш кластер використовує {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, для читання метрик потрібна авторизація через користувача, групу або ServiceAccount з ClusterRole, що дозволяє доступ до `/metrics`. Наприклад:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

## Життєвий цикл метрик {#metric-lifecycle}

Метрики альфа → Метрики бета → Стабільні метрики → Застарілі метрики → Приховані метрики → Видалені метрики

Альфа метрики не мають гарантій щодо їх стабільності. Ці метрики можуть бути змінені або навіть вилучені в будь-який момент.

Бета метрики мають більш вільний контракт API, ніж їх стабільні аналоги. Жодні мітки не можуть бути видалені з бета метрик протягом їх життєвого циклу, однак мітки можуть бути додані, поки метрика знаходиться на стадії бета.

Стабільні метрики гарантують, що їх формат залишиться незмінним. Це означає що:

* Стабільні метрики, які не мають позначки "DEPRECATED", не будуть змінені чи вилучені.
* Тип стабільних метрик не буде змінений.

Метрики, які позначені як застарілі, заплановані для видалення, але все ще доступні для використання. Ці метрики мають анотацію щодо версії, у якій вони стали застарілими.

Наприклад:

* Перед застарінням

  ```console
  # HELP some_counter this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

* Після застаріння

  ```console
  # HELP some_counter (Deprecated since 1.15.0) this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

Приховані метрики більше не публікуються для збирання, але все ще доступні для використання. Застаріла метрика стає прихованою метрикою через певний проміжок часу, залежно від її рівня стабільності: * **СТАБІЛЬНІ** метрики стають прихованими після мінімум 3 випусків або 9 місяців, залежно від того, що триває довше. * **БЕТА** метрики стають прихованими після мінімум 1 випуску або 4 місяців, залежно від того, що триває довше. * **АЛЬФА** метрики можуть бути приховані або видалені в тому ж випуску, в якому вони стали застарілими.

Щоб використовувати приховану метрику, будь ласка, звертайтесь до розділу [Показ прихованих метрик](#show-hidden-metrics).

Видалені метрики більше не публікуються і не можуть бути використані.

## Показ прихованих метрик {#show-hidden-metrics}

Як описано вище, адміністратори можуть увімкнути приховані метрики через прапорець командного рядка для конкретного бінарного файлу. Це призначено для використання адміністраторами, якщо вони пропустили міграцію метрик, які стали застарілими в останньому релізі.

Прапорець `show-hidden-metrics-for-version` приймає версію, для якої ви хочете показати метрики, які стали застарілими у цьому релізі. Версія зазначається як x.y, де x — головна версія, y — мінорна версія. Версія патчу не потрібна, хоча метрика може бути застарілою в патч-релізі, причина в тому, що політика застарілих метрик працює з мінорними релізами.

Прапорець може приймати лише попередню мінорну версію як своє значення. Якщо ви хочете показати всі метрики, приховані в попередньому випуску, ви можете встановити прапорець `show-hidden-metrics-for-version` на попередню версію. Використання занадто старої версії не допускається, оскільки це порушує політику виведення метрик з обігу.

Наприклад, припустимо, що метрика `A` є застарілою в `1.29`. Версія, в якій метрика `A` стає прихованою, залежить від її рівня стабільності:

* Якщо метрика `A` є **ALPHA**, вона може бути прихована в `1.29`.
* Якщо метрика `A` є **BETA**, вона буде прихована щонайменше у версії `1.30`. Якщо ви оновлюєте систему до версії `1.30` і все ще потребуєте `A`, ви повинні використовувати прапорець командного рядка `--show-hidden-metrics-for-version=1.29`.
* Якщо метрика `A` є **STABLE**, вона буде прихована в `1.32` не раніше. Якщо ви оновлюєте до `1.32` і все ще потребуєте `A`, ви повинні використовувати прапор командного рядка `--show-hidden-metrics-for-version=1.31`.

## Метрики компонентів {#component-metrics}

### Метрики kube-controller-manager {#kube-controller-manager-metrics}

Метрики менеджера контролера надають важливі відомості про продуктивність та стан контролера. Ці метрики включають загальні метрики часу виконання мови програмування Go, такі як кількість go_routine, а також специфічні для контролера метрики, такі як час виконання запитів до etcd або час виконання API Cloudprovider (AWS, GCE, OpenStack), які можна використовувати для оцінки стану кластера.

Починаючи з Kubernetes 1.7, доступні докладні метрики Cloudprovider для операцій зберігання для GCE, AWS, Vsphere та OpenStack. Ці метрики можуть бути використані для моніторингу стану операцій з постійними томами.

Наприклад, для GCE ці метрики називаються:

```console
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

### Метрики kube-scheduler {#kube-scheduler-metrics}

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

Планувальник надає опціональні метрики, які повідомляють про запитані ресурси та бажані обмеження всіх запущених Podʼів. Ці метрики можна використовувати для побудови панелей управління ресурсами, оцінки поточних або історичних обмежень планування, швидкого виявлення навантажень, які не можуть бути розміщені через відсутність ресурсів, і порівняння фактичного використання з запитом Podʼа.

kube-scheduler ідентифікує ресурсні [запити та обмеження](/docs/concepts/configuration/manage-resources-containers/) для кожного Podʼа; коли запит або обмеження не дорівнює нулю, kube-scheduler повідомляє про метричні часові ряди. Часові ряди мають мітки:

* простір імен
* імʼя Podʼа
* вузол, на якому запущений Pod, або пустий рядок, якщо він ще не запущений
* пріоритет
* призначений планувальник для цього Podʼа
* назва ресурсу (наприклад, `cpu`)
* одиниця ресурсу, якщо відома (наприклад, `core`)

Як тільки Pod досягає завершення (має `restartPolicy` `Never` або `OnFailure` і перебуває в стані `Succeeded` або `Failed`, або був видалений і всі контейнери мають стан завершення), часова послідовність більше не повідомляється, оскільки тепер планувальник вільний для розміщення інших Podʼів для запуску. Дві метрики називаються `kube_pod_resource_request` та `kube_pod_resource_limit`.

Метрики доступні за адресою HTTP `/metrics/resources`. Вони та вимагають авторизації для точки доступу `/metrics/resources`, яка зазвичай надається за допомогою ClusterRole з дієсловом `get` для URL `/metrics/resources`, що не є ресурсом.

В Kubernetes 1.21 вам потрібно використовувати прапорець `--show-hidden-metrics-for-version=1.20`, щоб показати ці альфа-метрики.

### Метрики kubelet Pressure Stall Information (PSI) {#kubelet-pressure-stall-information-psi-metrics}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

У бета-версії Kubernetes дозволяє налаштувати kubelet для збору даних про ядро Linux [Інформація про зупинку тиску](https://docs.kernel.org/accounting/psi.html) (PSI) про використання CPU, памʼяті та вводу-виводу. Інформація збирається на рівні вузлів, podʼів та контейнерів. Метрики виводяться у точці доступу `/metrics/cadvisor` з наступними назвами:

```none
container_pressure_cpu_stalled_seconds_total
container_pressure_cpu_waiting_seconds_total
контейнер_тиск_пам'яті_простій_секунд_всього
контейнер_тиск_пам'яті_очікування_секунд_всього
container_pressure_io_stalled_seconds_total
контейнер_тиск_іо_очікування_секунд_всього
```

Ця функція є стандартно увімкненою за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletPSI`. Інформацію також наведено у [Summary API](/docs/reference/instrumentation/node-metrics#psi).

Ви можете дізнатися, як інтерпретувати метрики PSI зі статті [Розуміння метрик PSI](/docs/reference/instrumentation/understand-psi-metrics/).

#### Вимоги {#requirements}

Pressure Stall Information вимагає:

* [Ядро Linux версії 4.20 або новіше](/docs/reference/node/kernel-version-requirements#requirements-psi).
* [cgroup v2](/docs/concepts/architecture/cgroups)

## Вимкнення метрик {#disabling-metrics}

Ви можете явно вимкнути метрики за допомогою прапорця командного рядка `--disabled-metrics`. Це може бути бажано, наприклад, якщо метрика викликає проблеми з продуктивністю. Вхідні дані — це список вимкнених метрик (тобто `--disabled-metrics=метрика1,метрика2`).

## Забезпечення послідовності метрик {#metric-cardinality-enforcement}

Метрики з нескінченними розмірами можуть викликати проблеми з памʼяттю в компонентах, які їх інструментують. Щоб обмежити використання ресурсів, ви можете використовувати опцію командного рядка `--allow-metric-labels`, щоб динамічно налаштувати список дозволених значень міток для метрики.

На стадії альфа, цей прапорець може приймати лише серію зіставлень як список дозволених міток метрики. Кожне зіставлення має формат `<metric_name>,<label_name>=<allowed_labels>`, де `<allowed_labels>` — це розділені комами допустимі назви міток.

Загальний формат виглядає так:

```none
--allow-metric-labels <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

Ось приклад:

```none
--allow-metric-labels number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

Крім того, що це можна вказати з командного рядка, теж саме можна зробити за допомогою конфігураційного файлу. Ви можете вказати шлях до цього файлу конфігурації, використовуючи аргумент командного рядка `--allow-metric-labels-manifest` для компонента. Ось приклад вмісту цього конфігураційного файлу:

```yaml
"metric1,label2": "v1,v2,v3"
"metric2,label1": "v1,v2,v3"
```

Додатково, метрика `cardinality_enforcement_unexpected_categorizations_total` записує кількість неочікуваних категоризацій під час вказання послідовності, тобто кожного разу, коли значення мітки зустрічається, що не дозволяється з урахуванням обмежень списку дозволених значень.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [текстовий формат Prometheus](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format) для метрик
* Перегляньте список [стабільних метрик Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Прочитайте про [політику застаріння Kubernetes](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
