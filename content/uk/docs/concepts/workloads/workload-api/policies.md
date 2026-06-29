---
title: Політики планування PodGroup
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Кожна [PodGroup](/docs/concepts/workloads/podgroup-api/) повинна оголосити політику планування у своєму полі `spec.schedulingPolicy`. Ця політика визначає, як планувальник обробляє колекцію Podʼів у групі.

<!-- body -->

## Типи політик {#policy-types}

Поле `schedulingPolicy` підтримує два типи політик: `basic` та `gang`. Ви повинні вказати лише одну.

### Політика `basic` {#basic-policy}

Політика `basic` вказує планувальнику оцінювати всі Pod за принципом «наскільки це можливо». На відміну від політики `gang`, PodGroup, що використовує політику `basic`, вважається реалізованою незалежно від того, скільки її Podʼів на даний момент підлягають плануванню.

Основною причиною використання політики `basic` є організація Podʼів у групу для кращої спостережуваності та управління, при цьому вони все одно оцінюються разом у рамках єдиного атомарного [циклу планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle).

Ця політика підходить для груп, які не потребують одночасного запуску, але логічно належать до одного цілого, або для створення можливості для обмежень на рівні групи, які не передбачають розміщення за принципом «все або нічого».

```yaml
schedulingPolicy:
  basic: {}
```

### Політика `gang` {#gang-policy}

Політика `gang` забезпечує планування «все або нічого». Це необхідно для сильно звʼязаних робочих навантажень, де частковий запуск призводить до блокувань або втрати ресурсів.

Цю політику можна використовувати для [Jobs](/docs/concepts/workloads/controllers/job/) або будь-якого іншого пакетного процесу, де всі працівники повинні працювати одночасно, щоб зробити прогрес.

Політика `gang` вимагає параметра `minCount`, який визначає мінімальну кількість Podʼів, які повинні бути заплановані одночасно, щоб група була прийнятною:

```yaml
schedulingPolicy:
  gang:
    # Кількість Podʼів, які повинні бути заплановані одночасно
    # для того, щоб група була прийнята.
    minCount: 4
```

## Встановлення політик через PodGroupTemplates {#setting-policies-via-podgrouptemplates}

Під час використання [Workload API](/docs/concepts/workloads/workload-api/), ви визначаєте політики планування всередині `PodGroupTemplates`. Контролер робочого навантаження копіює політику з шаблону в кожну створену PodGroup, роблячи PodGroup самодостатньою. Зміни в шаблонах Workload впливають лише на новостворені PodGroup, а не на наявні.

Для автономних PodGroup (створених без Workload) ви встановлюєте `spec.schedulingPolicy` безпосередньо на самій PodGroup.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [PodGroup API](/docs/concepts/workloads/podgroup-api/) для того щоб зрозуміти, як політики застосовуються під час виконання.
* Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/), який визначає PodGroupTemplates.
* Прочитайте про [планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Прочитайте про алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).

