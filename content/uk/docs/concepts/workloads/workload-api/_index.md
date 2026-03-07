---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Ресурс Workload API дозволяє описати вимоги до планування та структуру застосунку з кількома Podʼами. Контролери робочого навантаження забезпечують поведінку робочих навантажень під час виконання, а Workload API призначений для забезпечення обмежень планування для «справжніх» робочих навантажень, таких як Job та інші.

<!-- body -->

## Що таке робоче навантаження? {#what-is-a-workload}

Ресурс Workload API є частиною `scheduling.k8s.io/v1alpha1` {{< glossary_tooltip text="групи API" term_id="api-group" >}} (і ваш кластер повинен мати цю групу API увімкнену, а також  [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) `GenericWorkload`, перш ніж ви зможете скористатися цим API). Цей ресурс діє як структуроване, машиночитане визначення вимог до планування багатоподових застосунків. У той час як робочі навантаження, орієнтовані на користувача, такі як [Jobs](/docs/concepts/workloads/controllers/job/), визначають, що потрібно запустити, ресурс Workload визначає, як слід планувати групу Podʼів і як слід керувати її розміщенням протягом усього життєвого циклу.

## Структура API {#api-structure}

Workload дозволяє визначити групу Podsʼів і застосувати до них політику планування. Він складається з двох розділів: списку груп подів і посилання на контролер.

### Групи Podʼів {#pod-groups}

Список `podGroups` визначає окремі компоненти вашого робочого навантаження. Наприклад, завдання машинного навчання може мати групу `driver` та групу `worker`.

Кожен запис у `podGroups` повинен мати:

1. Унікальне поле `name`, яке можна використовувати в [посиланні на Workload](/docs/concepts/workloads/pods/workload-reference/) Podʼів.
2. [Політику планування](/docs/concepts/workloads/workload-api/policies/) (`basic` або `gang`).

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroups:
  - name: workers
    policy:
      gang:
        # gang може бути запланована тільки в тому випадку, якщо одночасно можуть працювати 4 пода.
        minCount: 4
```

### Посилання на обʼєкт керування робочим навантаженням {#referencing-a-workload-controlling-object}

Поле `controllerRef` звʼязує Workload з конкретним обʼєктом вищого рівня, що визначає застосунок, наприклад [Job](/docs/concepts/workloads/controllers/job/) або власний CRD. Це корисно для спостереження та інструментів. Ці дані не використовуються для планування або управління Workload.

## {{% heading "whatsnext" %}}

* Дізнайтеся, як [посилатися на Workload](/docs/concepts/workloads/pods/workload-reference/) у Podʼах.
* Дізнайтеся про [політики груп Pod](/docs/concepts/workloads/workload-api/policies/).
* Прочитайте про алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
