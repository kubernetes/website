---
title: Політики планування PodGroup
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Кожен [PodGroup](/docs/concepts/workloads/podgroup-api/) повинен оголосити політику планування у своєму полі `spec.schedulingPolicy`. Ця політика визначає, як планувальник обробляє набір Podʼів у групі.

<!-- body -->

## Типи політик {#policy-types}

Поле `schedulingPolicy` підтримує два типи політик: `basic` та `gang`. Ви повинні вказати рівно одну.

### Політика `basic` {#basic-policy}

Політика `basic` вказує планувальнику оцінювати всі Podʼи за принципом best-effort. На відміну від політики `gang`, PodGroup, що використовує політику `basic`, вважається здійсненним незалежно від того, скільки його Podʼів наразі придатні для планування.

Основною причиною використання політики `basic` є організація Podʼів у групу для кращої спостережуваності та керування, водночас вони все одно оцінюються разом у рамках єдиного атомарного [циклу планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle).

Ця політика підходить для груп, які не потребують одночасного запуску, але логічно належать до одного цілого, або для створення можливості для обмежень на рівні групи, які не передбачають розміщення за принципом «все або нічого».

```yaml
schedulingPolicy:
  basic: {}
```

### Політика `gang` {#gang-policy}

Політика `gang` забезпечує планування «все або нічого». Це необхідно для тісно повʼязаних робочих навантажень, де частковий запуск призводить до взаємних блокувань або марнування ресурсів.

Цю політику можна використовувати для [Jobs](/docs/concepts/workloads/controllers/job/) або будь-якого іншого пакетного процесу, де всі робочі процеси повинні працювати одночасно, щоб просуватися в роботі.

Політика `gang` вимагає поля `minCount`, яке визначає мінімальну кількість Podʼів, які мають бути придатними для планування одночасно, щоб група була здійсненною:

```yaml
schedulingPolicy:
  gang:
    # Кількість Podʼів, які повинні бути заплановані одночасно
    # для того, щоб група була прийнята.
    minCount: 4
```

## Встановлення політик через PodGroupTemplates {#setting-policies-via-podgrouptemplates}

Під час використання [Workload API](/docs/concepts/workloads/workload-api/) ви визначаєте політики планування всередині `PodGroupTemplates`. Контролер робочого навантаження копіює політику з шаблону в кожен створений PodGroup, роблячи PodGroup самодостатнім. Зміни в шаблонах Workload впливають лише на новостворені PodGroups, а не на наявні.

Для автономних PodGroups (створених без Workload) ви встановлюєте `spec.schedulingPolicy` безпосередньо на самому PodGroup.

## Політики в CompositePodGroups {#policies-in-compositepodgroups}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Коли увімкнено функціональну можливість [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`, `CompositePodGroupTemplates` у Workload та обʼєкти `CompositePodGroup` також оголошують політику планування.

У той час як політика планування в `PodGroup` керує колекцією окремих Podʼів, політика планування `CompositePodGroup` керує його безпосередніми **дочірніми групами** (які можуть бути як обʼєктами `CompositePodGroup`, так і `PodGroup`).

### Типи політик для CompositePodGroups {#policy-types-for-compositepodgroups}

Подібно до `PodGroups`, поле `spec.schedulingPolicy` обʼєкта `CompositePodGroup` підтримує два типи:

- **`basic`**: дочірні групи в межах `CompositePodGroup` оцінюються та приймаються незалежно.
- **`gang`**: забезпечує багаторівневе планування «все або нічого» для дочірніх груп. `CompositePodGroup` придатний для планування, лише якщо принаймні `minGroupCount` дочірніх груп можуть бути заплановані одночасно.

```yaml
schedulingPolicy:
  gang:
    # Мінімальна кількість дочірніх груп, які повинні бути заплановані
    # одночасно, щоб ця складова група була прийнята.
    minGroupCount: 2
```

### Встановлення складених політик через шаблони {#setting-composite-policies-via-templates}

Під час використання [Workload API](/docs/concepts/workloads/workload-api/) політики планування для `CompositePodGroups` визначаються всередині `CompositePodGroupTemplates`. Контролери робочого навантаження копіюють `schedulingPolicy`, вказану в шаблонах, у кожен `CompositePodGroup`, створений під час виконання. На відміну від кінцевих `PodGroupTemplates`, де `minCount` можна оновлювати, `minGroupCount` у `CompositePodGroupTemplate` є незмінним.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся про [PodGroup API](/docs/concepts/workloads/podgroup-api/) щоб зрозуміти, як політики застосовуються під час виконання.
- Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/), який визначає PodGroupTemplates.
- Прочитайте про [планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
- Прочитайте про алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
- Дізнайтеся про [будівельні блоки планування та бібліотеку workloadbuilder](/docs/concepts/workloads/workload-api/workloadbuilder/), які контролери використовують для компіляції цих політик.

