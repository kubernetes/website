---
title: DRANodeAllocatableResources
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Дозволяє `kube-scheduler` враховувати ресурси вузла, доступні для виділення (такі як CPU, памʼять та hugepages), керовані Dynamic Resource Allocation (DRA), у своєму стандартному обліку ресурсів вузла.

Коли увімкнено, драйвери DRA можуть використовувати поле `nodeAllocatableResources` на пристроях `ResourceSlice`, щоб вказати, як їхні пристрої споживають ресурси вузла, доступні для виділення. Це поле підтримує два різні варіанти використання:

- `mapping`: для драйверів, які безпосередньо надають власний ресурс вузла (наприклад, драйвер DRA для CPU або памʼяті). Підтримує масштабування ємностей або кількості пристроїв.
- `overhead`: для пристроїв, які потребують додаткових залежностей вузла (наприклад, прискорювач, який споживає памʼять хоста). Підтримує витрати на под або контейнер.

Це дозволяє планувальнику поєднувати ці розподіли DRA зі стандартними запитами Pod, щоб запобігти перевищенню підписки вузла під час допуску Pod.

Також це відкриває поле `status.nodeAllocatableResourceClaimStatuses` у API Pod для відстеження результативних розподілів ресурсів. `kubelet` використовує це для оновлення налаштувань cgroup Pod і контейнерів та коригування оцінок OOM.

Для отримання додаткової інформації див. [Ресурси вузла, доступні для виділення](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources) у документації з Dynamic Resource Allocation.
