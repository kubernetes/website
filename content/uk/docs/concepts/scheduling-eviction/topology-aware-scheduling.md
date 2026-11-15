---
title: Планування робочих навантажень з урахуванням топології
content_type: concept
weight: 85
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Планування з урахуванням топології* (Topology-Aware Scheduling, TAS) є [алгоритмом планування розміщення](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm), який дозволяє знайти оптимальне розміщення для розглянутого PodGroup, гарантуючи, що всі Podʼи будуть розміщені разом у межах одного топологічного домену. Користувачі можуть налаштувати TAS відповідно до своїх конкретних потреб, змінюючи конфігурацію втулків TAS.

## Фреймворк планування: налаштування втулків TAS {#scheduling-framework-tas-plugins-configuration}

Планувальник включає нові та розширені вбудовані втулки, які реалізують точки розширення TAS:

* `TopologyPlacement`: Реалізує інтерфейс `PlacementGeneratePlugin`. Він генерує кандидатів на розміщення, групуючи вузли на основі різних значень запитуваного ключа `key` топології (визначеного в PodGroup).

* `NodeResourcesFit`: Розширено для реалізації інтерфейсу `PlacementScorePlugin`. Використовуючи подібну логіку до стандартного пакування Podʼів, він оцінює розміщення на основі коефіцієнта використання ресурсів на всіх вузлах у розміщенні. Використовується стратегія `MostAllocated` для максимізації використання ресурсів у розміщенні, а також успадковуються ваги ресурсів із стандартних налаштувань втулка pod-by-pod.

* `PodGroupPodsCount`: Реалізує інтерфейс `PlacementScorePlugin`. Він оцінює кандидатів на розміщення на основі загальної кількості Podʼів у PodGroup, які можна успішно запланувати.

### Налаштування ваг втулків та ваг ресурсів пакування {#customizing-plugin-weights-and-bin-packing-resource-weights}

Стандартно втулки `NodeResourcesFit` та `PodGroupPodsCount` налаштовані з однаковими вагами (обидві стандартно мають вагу 1), щоб підтримувати хороший баланс між логікою пакування Podʼів та плануванням максимальної кількості Podʼів.

Ви можете змінити ці ваги або ваги ресурсів у стратегії пакування у вашій конфігурації KubeSchedulerConfiguration. Ось приклад фрагмента, який показує, як змінити ваги для обох втулків і як перевизначити ваги ресурсів для `NodeResourcesFit`. Остання зміна буде застосована як до алгоритмів планування pod-by-pod, так і до алгоритмів оцінки розміщення:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      placementScore:
        enabled:
          # 1) Зміна стандартних ваг втулків оцінки розміщення
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) Зміна ваг ресурсів для обох алгоритмів оцінки pod-by-pod та розміщення
          scoringStrategy:
            # Тип буде враховуватися лише під час планування pod-by-pod. Оцінка розміщення завжди
            # використовує стратегію MostAllocated
            type: LeastAllocated
            # Ваги ресурсів будуть використовуватися як в алгоритмах планування pod-by-pod, так і в алгоритмах оцінки розміщення
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```

## Багаторівневі розміщення топології {#multi-level-topology-placements}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Коли функціональну можливість [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3` увімкнено, втулки планування з урахуванням топології розширюють свою підтримку на багаторівневі ієрархії `CompositePodGroup`. Ці втулки викликаються для `CompositePodGroups` під час [ієрархічного планування](/docs/concepts/scheduling-eviction/podgroup-scheduling).

### Генерація кандидатів на розміщення {#candidate-placement-generation}

Для робочих навантажень, визначених з ієрархією `CompositePodGroup`, втулок `TopologyPlacement` генерує кандидатів на розміщення зверху вниз по ієрархії груп шляхом послідовного поділу:

* Для кореневого `CompositePodGroup` втулок `TopologyPlacement` генерує кандидатів на розміщення по всіх доступних вузлах кластера, групуючи вузли на основі різних значень запитуваного ключа `key` топології.
* Для дочірнього `CompositePodGroup` або кінцевого `PodGroup` втулок `TopologyPlacement` генерує кандидатів на розміщення, обмежених розміщенням, прийнятим батьківською групою. Він поділяє набір вузлів із розміщення батьківської групи, групуючи ці вузли на основі запитуваного ключа `key` топології дочірньої групи.

{{< note >}}
Якщо обмеження топології не вказано, втулок `TopologyPlacement` генерує одного кандидата на розміщення, еквівалентного розміщенню батьківської групи.

Аналогічно, якщо коренева група не вказує жодного обмеження топології, втулок генерує одного кандидата на розміщення, що відповідає всім доступним вузлам у кластері. Це також справедливо для однорівневих робочих навантажень, що використовують API `PodGroup`, де обмеження топології не вказано.
{{< /note >}}

### Оцінка розміщення {#placement-scoring}

Під час оцінки кандидата на розміщення для `CompositePodGroup` втулки оцінки застосовують логіку, подібну до однорівневого випадку `PodGroup`:

* `PodGroupPodsCount`: Оцінює кандидатів на розміщення на основі загальної кількості Podʼів (як уже запланованих, так і щойно прийнятих) по всіх дочірніх кінцевих `PodGroups` цього `CompositePodGroup`. Кандидати на розміщення, здатні вмістити більшу загальну кількість Podʼів по підієрархії, отримують вищі оцінки.
* `NodeResourcesFit`: Агрегує запити ресурсів усіх запропонованих Podʼів по всіх дочірніх `PodGroups` цього `CompositePodGroup` та оцінює використання ресурсів по всіх вузлах у межах домену кандидата на розміщення.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся більше про [API планування з урахуванням топології](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Дізнайтеся про [планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Дізнайтеся про [політики груп Podʼів](/docs/concepts/workloads/workload-api/policies/).
