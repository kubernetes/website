---
title: "Групове планування Podʼів: Розлад та пріоритети"
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

PodGroup може оголосити режим розладу. Цей режим визначає, як планувальник може зчинити розлад для PodGroup, що працює, наприклад, щоб розмістити PodGroup з вищим пріоритетом. PodGroup також має пріоритет, який перевизначає пріоритет окремих Podʼів з групи для подій [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).

<!-- body -->

## Типи режимів розладу {#disruption-mode-types}

{{< note >}}
У v1.36 поля `priority` або `disruptionMode` обʼєкта PodGroup враховуються лише в режимі [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/). Під час фази планування подів планувальник не враховує поля `priority` або `disruptionMode` обʼєкта PodGroup. Це обмеження більше не застосовується у v1.37.
{{< /note >}}

API підтримує два режими розладу: `Single` та `All`. Стандартний режим — `Single`.

### Single

Режим `Single` вказує планувальнику розглядати всі Podʼи в групі як окремі сутності, дозволяючи незалежний розлад окремого пода з PodGroup.

### All

Режим `All` підкреслює семантику "все або нічого" для розладу. Він вказує планувальнику, що всі поди з PodGroup повинні отримати сигнал розладу одночасно.

## CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

`CompositePodGroup` також може оголосити `disruptionMode` у своїй специфікації, який визначає, як планувальник зчиняє розлад дочірніх груп у межах складової групи під час подій витіснення.

API підтримує два режими розладу для `CompositePodGroups`:

- **`Single`**: дозволяє окремим дочірнім групам у межах `CompositePodGroup` отримати розлад незалежно під час витіснення.
- **`All`**: забезпечує семантику розладу "все або нічого" для всієї ієрархії `CompositePodGroup`. Якщо будь-який Pod, що міститься в ієрархії нижче цього `CompositePodGroup`, має бути витіснений, усі Podʼи з усієї ієрархії мають бути витіснені.

Якщо не вказано, стандартний режим — `Single`.

{{< note >}}
У v1.37 група може встановити свій режим розладу на `All` і мати дочірні групи з режимом `Single`. У такому випадку режим `All` верхнього рівня перевизначає режими `Single` нащадків.

Така конфігурація не рекомендується через неоднозначну семантику.
{{< /note >}}

## Пріоритет групи Podʼів {#pod-group-priority}

PodGroup використовує ту ж концепцію [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass), що й окремі Podʼи. Після створення одного або кількох PriorityClasses, ви можете створити PodGroup, яка вказує одне з цих імен PriorityClass у своїй специфікації. Контролер допуску пріоритету використовує поле `priorityClassName` і заповнює ціле значення пріоритету. Якщо клас пріоритету не знайдено, PodGroup відхиляється. Коли `priorityClassName` не встановлено для PodGroup, Kubernetes шукає стандартне значення (PriorityClass з `globalDefault`, встановленим у true). Якщо немає PriorityClass з `globalDefault`, встановленим у true, PodGroup без `priorityClassName` має пріоритет нуль.

Пріоритет PodGroup є авторитетним пріоритетом для всіх подів у групі під час подій [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/). Це значення також використовується для впорядкування PodGroup у черзі планування. Якщо пріоритети окремих подів, що формують цю PodGroup, відрізняються від пріоритету PodGroup, PodGroup не буде запланована з помилкою `all pods in a single pod group should have the same priority as the pod group` (усі поди в одній групі подів повинні мати такий самий пріоритет, як і сама група подів).

Коли увімкнено функціональну можливість [PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/), PodGroup також має поле `preemptionPolicy`. Це поле також береться з PriorityClass. Воно є авторитетним полем для всіх подів у групі та визначає, чи може PodGroup виконувати витіснення подів і груп подів з нижчим пріоритетом, щоб звільнити місце для себе. Коли функціональну можливість увімкнено, усі Podʼи в PodGroup повинні мати той самий `preemptionPolicy`, що й PodGroup. Інакше PodGroup не буде запланована з помилкою `all pods in a single pod group should have the same preemption policy as the pod group's preemption policy` (усі поди в одній групі подів повинні мати ту саму політику витіснення, що й політика витіснення цієї групи подів). Коли PodGroup має `preemptionPolicy: Never`, вона не виконуватиме витіснення з урахуванням робочого навантаження. Якщо функціональну можливість вимкнено, усі Podʼи, що формують PodGroup, повинні мати однаковий `preemptionPolicy`. Інакше PodGroup не буде запланована з помилкою `all pods in a single pod group should have the same preemption policy` (усі поди в одній групі подів повинні мати однакову політику витіснення).

Наступний YAML є прикладом конфігурації PodGroup, яка використовує PriorityClass `high-priority`, що відповідає цілому значенню пріоритету 1000000. Контролер допуску пріоритету перевіряє специфікацію та визначає пріоритет PodGroup як 1000000.

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

### Пріоритет CompositePodGroup {#compositepodgroup-priority}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

API `CompositePodGroup` також має поля `priorityClassName` та `priority`, і їх визначення виконується так само, як і для `PodGroups`, через контролер допуску пріоритету.

Пріоритет кореневого `CompositePodGroup` діє як авторитетний пріоритет для всіх дочірніх груп і Podʼів у межах його ієрархії під час подій [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/). Усі Podʼи в межах однієї ієрархії груп повинні мати точно такий самий пріоритет, який має дорівнювати пріоритету кореневого `CompositePodGroup`.

Значення пріоритету також використовується для впорядкування кореневих `CompositePodGroups` в активній черзі планування.

{{< note >}}
У v1.37 планувальник не перевіряє, чи мають некореневі групи значення пріоритету, що дорівнює пріоритету кореневого `CompositePodGroup`.
{{< /note >}}

### PreemptionPolicy у CompositePodGroup {#preemptionpolicy-in-compositepodgroup}

{{< feature-state feature_gate_name="PodGroupPreemptionPolicy" >}}

API `CompositePodGroup` також має поле `preemptionPolicy`, і його визначення виконується точно так само, як і для API `PodGroup`.

Значення `preemptionPolicy` кореневого `CompositePodGroup` визначає, чи може бути викликане [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/) для розміщення його Podʼів під час планування, якщо це необхідно:

- політика `PreemptLowerPriority` дозволяє витісняти жертв з нижчим пріоритетом;
- політика `Never` вимикає витіснення з урахуванням навантаження для цього кореневого `CompositePodGroup`.

Усі Podʼи в межах однієї ієрархії груп повинні мати точно таку саму політику витіснення, яка має дорівнювати політиці витіснення кореневого `CompositePodGroup`.

Якщо функціональну можливість вимкнено, кореневому `CompositePodGroup` буде дозволено виконувати витіснення, якщо жоден з Podʼів, що належить до ієрархії групи, не має `preemptionPolicy` зі значенням `Never`.

{{< note >}}
У v1.37, коли функціональну можливість увімкнено, планувальник не перевіряє, чи мають некореневі групи політику витіснення, що дорівнює політиці витіснення кореневого `CompositePodGroup`.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Дізнайтеся про алгоритм [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
- Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/).
- Дізнайтеся про [будівельні блоки планування та бібліотеку workloadbuilder](/docs/concepts/workloads/workload-api/workloadbuilder/), зокрема про будівельний блок режиму розладу.
