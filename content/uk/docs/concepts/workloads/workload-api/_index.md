---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Ресурс `Workload` API визначає вимоги до планування та структуру багатоподового застосунку. У той час як контролери робочого навантаження, такі як [Job](/docs/concepts/workloads/controllers/job/), керують станом виконання застосунку, `Workload` визначає, як слід планувати групи `Pods`. Контролер Job є єдиним вбудованим контролером, який створює обʼєкти [PodGroup](/docs/concepts/workloads/podgroup-api/) з `PodGroupTemplates` ресурсу `Workload` під час виконання.

<!-- body -->

## Що таке робоче навантаження? {#what-is-a-workload}

Ресурс Workload API є частиною {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha2`  (і ваш кластер повинен мати цю групу API увімкнену, а також функціональну можливість [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload), перш ніж ви зможете скористатися цим API).

`Workload` є статичним, довгоживучим шаблоном політики. Він визначає, які політики планування слід застосовувати до груп Podʼів, але самостійно не відстежує стан виконання. Стан виконання планування підтримується обʼєктами [PodGroup](/docs/concepts/workloads/podgroup-api/), які контролери створюють з `PodGroupTemplates` ресурсу `Workload`.

## Структура API {#api-structure}

`Workload` складається з двох полів: списку `PodGroupTemplates` та необовʼязкового посилання на контролер. Вся специфікація `Workload` є незмінною після створення: ви не можете змінювати наявні шаблони, додавати нові шаблони або видаляти шаблони з `podGroupTemplates`.

### PodGroupTemplates

Список `spec.podGroupTemplates` визначає окремі компоненти вашого робочого навантаження. Наприклад, завдання машинного навчання може мати шаблон `driver` та шаблон `worker`.

Кожен елемент у `podGroupTemplates` повинен мати:

1. Унікальне поле `name`, яке буде використовуватися для посилання на шаблон у `spec.podGroupTemplateRef` обʼєкта `PodGroup`.
2. [Політику планування](/docs/concepts/workloads/workload-api/policies/) (`basic` або `gang`).

Якщо увімкнено функціональну можливість [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption), кожен елемент у `podGroups` також може мати [пріоритет та режим розладу](/docs/concepts/workloads/workload-api/disruption-and-priority/).

Максимальна кількість PodGroupTemplates в одному Workload становить 8.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
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
    priorityClassName: high-priority # Застосовується лише з функціональною можливістю WorkloadAwarePreemption
    disruptionMode: PodGroup # Застосовується лише з функціональною можливістю WorkloadAwarePreemption
```

Коли контролер робочого навантаження створює `PodGroup` з одного з цих шаблонів, він копіює `schedulingPolicy` у власну специфікацію `PodGroup`. Зміни в `Workload` впливають лише на новостворені `PodGroups`, а не на наявні.

### Посилання на обʼєкт керування робочим навантаженням {#referencing-a-workload-controlling-object}

Поле `controllerRef` звʼязує Workload з конкретним обʼєктом вищого рівня, що визначає застосунок, наприклад [Job](/docs/concepts/workloads/controllers/job/) або власний CRD. Це корисно для спостереження та інструментів. Ці дані не використовуються для планування або управління Workload.

## Gang scheduling with Jobs {#gang-scheduling-with-jobs}

{{< feature-state feature_gate_name="WorkloadWithJob" >}}

Коли функціональна можливість [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/) увімкнена, контролер [Job](/docs/concepts/workloads/controllers/job/) автоматично створює обʼєкти Workload та PodGroup для паралельних індексованих Job, де `.spec.parallelism` дорівнює `.spec.completions`. Політика gang встановлює `minCount` рівним паралелізму Job, тому всі Podʼи повинні бути заплановані одночасно, перш ніж будь-який з них буде привʼязаний до вузлів.

Це вбудований шлях для використання групового планування з використанням завдань (Jobs). Вам не потрібно самостійно створювати обʼєкти Workload або PodGroup, оскільки контролер завдань (Job controller) робить це автоматично. Інші контролери робочих навантажень (наприклад, JobSet) можуть самостійно керувати своїми обʼєктами Workload та PodGroup.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Дізнайтеся, як створюються PodGroup з Workload у огляді [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Прочитайте про те, як Podʼи посилаються на свою PodGroup через поле [scheduling group](/docs/concepts/workloads/pods/scheduling-group/).
* Дізнайтеся про [топологічно-орієнтоване планування робочих навантажень](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Зрозумійте алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
