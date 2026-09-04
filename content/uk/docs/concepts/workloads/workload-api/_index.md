---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Ресурс `Workload` API визначає вимоги до планування та структуру багатоподового застосунку. У той час як контролери робочого навантаження, такі як [Job](/docs/concepts/workloads/controllers/job/), керують станом виконання застосунку, `Workload` визначає, як слід планувати групи `Pods`. Контролер Job є єдиним вбудованим контролером, який створює обʼєкти [PodGroup](/docs/concepts/workloads/podgroup-api/) з `PodGroupTemplates` ресурсу `Workload` під час виконання.

<!-- body -->

## Що таке Workload? {#what-is-a-workload}

Ресурс Workload API є частиною {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1beta1`  (і ваш кластер повинен мати цю групу API увімкнену, а також функціональну можливість [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload), перш ніж ви зможете скористатися цим API).

`Workload` є статичним, довгоживучим шаблоном політики. Він визначає, які політики планування слід застосовувати до груп Podʼів, але самостійно не відстежує стан виконання. Стан виконання планування підтримується обʼєктами [PodGroup](/docs/concepts/workloads/podgroup-api/), які контролери створюють з `PodGroupTemplates` ресурсу `Workload`.

## Структура API {#api-structure}

`Workload` складається з двох полів: списку `PodGroupTemplates` та необовʼязкового посилання на контролер. Вся специфікація `Workload` є незмінною після створення: ви не можете змінювати наявні шаблони, додавати нові шаблони або видаляти шаблони з `podGroupTemplates`.

### PodGroupTemplates

Список `spec.podGroupTemplates` визначає окремі компоненти вашого робочого навантаження. Наприклад, завдання машинного навчання може мати шаблон `driver` та шаблон `worker`.

Кожен елемент у `podGroupTemplates` повинен мати:

1. Унікальне поле `name`, яке буде використовуватися для посилання на шаблон у `spec.podGroupTemplateRef` обʼєкта `PodGroup`.
2. [Політику планування](/docs/concepts/workloads/workload-api/policies/) (`basic` або `gang`).

Кожен елемент також може мати поля [пріоритету та режиму розладу](/docs/concepts/workloads/workload-api/disruption-and-priority/).

{{< note >}}
У v1.36 поля [пріоритету та режиму розладу](/docs/concepts/workloads/workload-api/disruption-and-priority/) вмикалися функціональною можливістю [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption). Цю функціональну можливість було обʼєднано з [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) у v1.37.
{{< /note >}}

Максимальна кількість PodGroupTemplates в одному Workload становить 8.

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # gang може бути запланована тільки в тому випадку, якщо одночасно можуть працювати 4 пода.
        minCount: 4
    priorityClassName: high-priority
    disruptionMode:
      all: {}
```

Коли контролер робочого навантаження створює `PodGroup` з одного з цих шаблонів, він копіює `schedulingPolicy` у власну специфікацію `PodGroup`. Зміни в `Workload` впливають лише на новостворені `PodGroups`, а не на наявні.

### Посилання на обʼєкт керування робочим навантаженням {#referencing-a-workload-controlling-object}

Поле `controllerRef` звʼязує Workload з конкретним обʼєктом вищого рівня, що визначає застосунок, наприклад [Job](/docs/concepts/workloads/controllers/job/) або власний CRD. Це корисно для спостереження та інструментів. Ці дані не використовуються для планування або управління Workload.

### CompositePodGroupTemplates

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Коли увімкнено функціональну можливість [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`, ви можете використовувати `CompositePodGroupTemplates` для визначення багаторівневих ієрархічних вимог до планування у `Workload`. Ці вимоги можуть включати забезпечення вкладених топологічних обмежень на різних рівнях інфраструктури кластера (багаторівневе топологічно-орієнтоване планування), планування «все або нічого» для дочірніх груп (багаторівневе групове планування) або політики розладу на рівні групи.

`CompositePodGroupTemplates` можна визначити за допомогою поля `spec.compositePodGroupTemplates` в API `Workload`. Під час виконання контролери робочого навантаження створюють обʼєкти [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) та [PodGroup](/docs/concepts/workloads/podgroup-api/) з цих шаблонів для підтримки стану планування ієрархії під час виконання. У той час як обʼєкти `PodGroup` керують групами Podʼів на кінцевих рівнях, обʼєкти `CompositePodGroup` представляють проміжні групи, які забезпечують виконання політик планування для дочірніх груп.

{{< note >}}
У специфікації `Workload` поля `spec.compositePodGroupTemplates` та `spec.podGroupTemplates` утворюють обʼєднання: `Workload` повинен визначати або `spec.podGroupTemplates` (для пласких робочих навантажень), або `spec.compositePodGroupTemplates` (для ієрархічних робочих навантажень), але не може визначати обидва.
{{< /note >}}

#### Структура та обмеження {#structure-and-constraints}

Поле `spec.compositePodGroupTemplates` визначає проміжні шаблони в дереві ієрархії шаблонів груп. Кожен елемент представляє шаблон для `CompositePodGroup` і може містити:

- **Дочірні шаблони**: вкладені `CompositePodGroupTemplates` (для проміжних груп) або `PodGroupTemplates` (для кінцевих груп, що містять Podʼи).
- **Політику планування**: визначає, як плануються дочірні групи в межах цієї складової групи:
  - `basic`: дочірні групи приймаються та плануються незалежно.
  - `gang`: забезпечує багаторівневе планування «все або нічого» для дочірніх груп. Вимагає `minGroupCount`, який визначає мінімальну кількість дочірніх груп, які повинні бути заплановані одночасно, щоб складова група була реалізованою.
- **Обмеження планування**: необовʼязкові [топологічні обмеження](/docs/concepts/workloads/workload-api/topology-aware-scheduling/) для багаторівневого топологічно-орієнтованого планування.
- **Пріоритет, політика витіснення та режим розладу**: необовʼязкові `priorityClassName`, `disruptionMode` (`Single` або `All`) та `preemptionPolicy` для [витіснення з урахуванням навантаження](/docs/concepts/workloads/workload-api/disruption-and-priority/).

Щоб забезпечити стабільність кластера та ефективність панелі управління, ієрархія шаблонів груп застосовує такі обмеження:

- **Максимальна глибина вкладеності**: ієрархія шаблонів груп підтримує максимальну глибину 4 рівні.
- **Обмеження списку**: кожен список `compositePodGroupTemplates` та `podGroupTemplates` суворо обмежений максимум 8 елементами.

{{< note >}}
Наразі ви не можете додавати нові або видаляти наявні `CompositePodGroupTemplates`. Ви можете лише змінювати значення `minCount` у політиці групового планування, визначеній у кінцевих `PodGroupTemplates`.
{{< /note >}}

#### Приклад {#example}

Наступний приклад визначає ієрархічний `Workload` з шаблоном `CompositePodGroup`, який забезпечує групове планування для двох дочірніх шаблонів `PodGroup` (`minGroupCount: 2`), кожен з яких визначає власну політику групового планування:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: gang-of-gangs-workload
  namespace: default
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        # Вимагає, щоб обидві дочірні PodGroup були заплановані разом
        minGroupCount: 2
    podGroupTemplates:
    - name: workers-a
      schedulingPolicy:
        gang:
          # Вимагає, щоб 4 Podʼи в цій групі були заплановані
          minCount: 4
    - name: workers-b
      schedulingPolicy:
        gang:
          # Вимагає, щоб 4 Podʼи в цій групі були заплановані
          minCount: 4
```

## Групове планування з Job {#gang-scheduling-with-jobs}

{{< feature-state feature_gate_name="WorkloadWithJob" >}}

Коли функціональна можливість [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob) увімкнена, контролер [Job](/docs/concepts/workloads/controllers/job/) компілює конфігурацію `.spec.scheduling` завдання в обʼєкти `Workload` та `PodGroup` перед тим, як створити будь-які Podʼи. Ви вмикаєте групове планування, встановивши `.spec.scheduling.schedulingPolicy.gang` у Job; пропущений `gang.minCount` типово дорівнює `.spec.parallelism` завдання, тому всі Podʼи повинні бути заплановані одночасно, перш ніж будь-який з них буде привʼязаний до вузлів.

Коли `.spec.scheduling` пропущено, Job зазвичай використовує політику `basic`, яка зберігає стандартне планування под за подом. У будь-якому випадку контролер Job створює `Workload` та `PodGroup` за вас, тому вам не потрібно створювати їх самостійно. Інші контролери робочих навантажень (наприклад, JobSet) можуть самостійно керувати своїми обʼєктами `Workload` та `PodGroup`.

Повний набір полів планування та приклади дивіться у розділі [Інтеграція з Workload API](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis).

## {{% heading "whatsnext" %}}

* Дізнайтеся про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Дізнайтеся, як створюються PodGroup з Workload у огляді [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Прочитайте про те, як Podʼи посилаються на свою PodGroup через поле [scheduling group](/docs/concepts/workloads/pods/scheduling-group/).
* Дізнайтеся про [топологічно орієнтоване планування робочих навантажень](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Зрозумійте алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
