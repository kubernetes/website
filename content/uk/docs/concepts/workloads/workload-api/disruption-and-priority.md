---
title: "Групове планування Podʼів: Розлад та пріоритети"
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="WorkloadAwarePreemption" >}}

PodGroup може оголосити режим розладу. Цей режим визначає, як планувальник може зчинити розлад для PodGroup, що працює, наприклад, щоб розмістити PodGroup з вищим пріоритетом. PodGroup також має пріоритет, який перевизначає пріоритет окремих Podʼів з групи для подій [випередження з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).

<!-- body -->

## Типи режимів розладу {#disruption-mode-types}

{{< note >}}
Починаючи з версії 1.36, поля `priority` або `disruptionMode` обʼєкта PodGroup враховуються лише в режимі [випередження з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/). Під час фази планування подів планувальник не враховує поля `priority` або `disruptionMode` обʼєкта PodGroup.
{{< /note >}}

API підтримує два режими розладу: `Pod` та `PodGroup`. Стандартний режим — `Pod`.

### Pod

Режим `Pod` інструктує планувальник розглядати всі Podʼи в групі як окремі сутності, дозволяючи незалежний розлад окремого Podʼа з PodGroup.

### PodGroup

Режим `PodGroup` підкреслює семантику "все або нічого" для розладу. Він інструктує планувальник, що всі поди з PodGroup повинні отримати сигнал розладу одночасно.

## Пріоритет групи Podʼів {#pod-group-priority}

PodGroup використовує ту ж концепцію [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass), що й окремі Podʼи. Після створення одного або кількох PriorityClasses, ви можете створити PodGroup, яка вказує одне з цих імен PriorityClass у своїй специфікації. Контролер допуску пріоритету використовує поле `priorityClassName` і заповнює ціле значення пріоритету. Якщо клас пріоритету не знайдено, PodGroup відхиляється. Коли `priorityClassName` не встановлено для PodGroup, Kubernetes шукає стандартне значення (PriorityClass з `globalDefault`, встановленим у true). Якщо немає PriorityClass з `globalDefault`, встановленим у true, PodGroup без `priorityClassName` має пріоритет нуль.

Пріоритет PodGroup є авторитетним пріоритетом для всіх подів у групі під час подій [випередження з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/), навіть якщо пріоритети окремих подів, що формують цю PodGroup, відрізняються.

Наступний YAML є прикладом конфігурації PodGroup, яка використовує PriorityClass `high-priority`, що відповідає цілому значенню пріоритету 1000000. Контролер допуску пріоритету перевіряє специфікацію та визначає пріоритет PodGroup як 1000000.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

## {{% heading "whatsnext" %}}

* Дізнайтеся про алгоритм [випередження з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
* Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/).
