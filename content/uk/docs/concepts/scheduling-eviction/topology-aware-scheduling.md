---
title: Планування робочих навантажень з урахуванням топології
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Планування з урахуванням топології* (Topology-Aware Scheduling, TAS) є [алгоритмом розміщення](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm), який дозволяє знайти оптимальне розміщення для заданої групи PodGroup, гарантуючи, що всі поди будуть розміщені в межах одного топологічного домену. Користувачі можуть налаштувати TAS відповідно до своїх конкретних потреб, змінюючи конфігурацію втулків TAS.

## Структура планування: налаштування втулків TAS {#scheduling-framework-tas-plugins-configuration}

Планувальник включає нові та розширені вбудовані втулки, які реалізують точки розширення TAS:

* `TopologyPlacement`: Реалізує інтерфейс `PlacementGeneratePlugin`. Він генерує розміщення кандидатів, гуртуючи вузли на основі різних значень запитуваного ключа `key` топології (визначеного в PodGroup).

* `NodeResourcesFit`: Розширено для реалізації інтерфейсу `PlacementScorePlugin`. Використовуючи подібну логіку до стандартного пакування подів, він оцінює розміщення на основі коефіцієнта використання ресурсів на всіх вузлах у розміщенні. Використовується стратегія `MostAllocated` для максимізації використання ресурсів у розміщенні, а також успадковуються ваги ресурсів із стандартних налаштувань втулка pod-by-pod.

* `PodGroupPodsCount`: Реалізує інтерфейс `PlacementScorePlugin`. Він оцінює кандидатські розміщення на основі загальної кількості подів у PodGroup, які можна успішно запланувати.

### Налаштування ваг втулків та ваг ресурсів пакування {#customizing-plugin-weights-and-bin-packing-resource-weights}

Зазвичай, втулки `NodeResourcesFit` та `PodGroupPodsCount` налаштовані з однаковими вагами (обидві стандартно мають вагу 1), щоб підтримувати хороший баланс між логікою пакування подів та плануванням максимальної кількості подів.

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
            # Тип буде враховуватися лише при плануванні pod-by-pod. Оцінка розміщення завжди
            # використовує стратегію MostAllocated
            type: LeastAllocated
            # Ваги ресурсів будуть використовуватися як у алгоритмах планування pod-by-pod, так і в алгоритмах оцінки розміщення
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [API планування з урахуванням топології](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Дізнайтеся про [планування груп подів](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Дізнайтеся про [політики груп подів](/docs/concepts/workloads/workload-api/policies/).
