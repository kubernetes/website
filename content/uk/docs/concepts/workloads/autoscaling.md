---
title: Автомасштабування робочих навантажень
description: >-
  З автомасштабуванням ви можете автоматично оновлювати ваші робочі навантаження різними способами. Це дозволяє вашому кластеру еластичніше та ефективніше реагувати на зміни попиту на ресурси.
content_type: concept
weight: 50
---

<!-- overview -->

У Kubernetes ви можете _масштабувати_ робоче навантаження залежно від поточного попиту на ресурси. Це дозволяє вашому кластеру більш еластично та ефективно реагувати на зміни попиту на ресурси.

Під час масштабування робочого навантаження ви можете збільшувати або зменшувати кількість реплік, якими керує робоче навантаження, або налаштовувати ресурси, доступні реплікам, на місці.

Перший підхід називається _горизонтальним масштабуванням_, тоді як другий — _вертикальним масштабуванням_.

Є ручні та автоматичні способи масштабування робочих навантажень, залежно від вашого сценарію використання.

<!-- body -->

## Ручне масштабування робочих навантажень {#scaling-workloads-manually}

Kubernetes підтримує _ручне масштабування_ робочих навантажень. Горизонтальне масштабування можна виконати за допомогою інтерфейсу командного рядка `kubectl`. Для вертикального масштабування вам потрібно _застосувати патч_ до визначення ресурсів вашого робочого навантаження.

Дивіться нижче приклади обох стратегій.

- **Горизонтальне масштабування**: [Запуск кількох екземплярів вашого застосунку](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **Вертикальне масштабування**: [Зміна розміру CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)

## Автоматичне масштабування робочих навантажень {#scaling-workloads-automatically}

Kubernetes також підтримує _автоматичне масштабування_ робочих навантажень, що є основною темою цієї сторінки.

Поняття _автомасштабування_ в Kubernetes означає можливість автоматично оновлювати обʼєкт, який керує набором Podʼів (наприклад, {{< glossary_tooltip text="Deployment" term_id="deployment" >}}).

### Горизонтальне масштабування робочих навантажень {#scaling-workloads-horizontally}

У Kubernetes ви можете автоматично масштабувати робоче навантаження горизонтально за допомогою [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA).

Він реалізований як ресурс API Kubernetes та {{< glossary_tooltip text="контролер" term_id="controller" >}} і періодично коригує кількість {{< glossary_tooltip text="реплік" term_id="replica" >}} в робочому навантаженні відповідно до спостережуваного використання ресурсів, наприклад, використання CPU чи памʼяті.

Є [покроковий навчальний матеріал](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) з налаштування HorizontalPodAutoscaler для Deployment.

### Вертикальне масштабування робочих навантажень {#scaling-workloads-vertically}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Ви можете автоматично масштабувати робоче навантаження вертикально за допомогою [VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA). На відміну від HPA, VPA стандартно не постачається з Kubernetes, але це надбудова, яку вам або адміністратору кластера може знадобитися розгорнути, перш ніж ви зможете нею користуватися.

Після встановлення він дозволяє створювати {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}} (CRDs) для ваших робочих навантажень, які визначають _як_ і _коли_ масштабувати ресурси керованих реплік.

{{< note >}}
Для роботи VPA у вашому кластері має бути встановлений [Metrics Server](https://github.com/kubernetes-sigs/metrics-server).
{{< /note >}}

#### Вертикальне масштабування Podʼів на місці {#in-place-pod-vertical-scaling}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Станом на Kubernetes {{< skew currentVersion >}} VPA не підтримує зміну розміру Podʼів на місці, але над цією інтеграцією працюють. Щоб вручну змінити розмір Podʼів на місці, див. [Зміна розміру ресурсів контейнера на місці](/docs/tasks/configure-pod-container/resize-container-resources/).

### Автомасштабування на основі розміру кластера {#autoscaling-based-on-cluster-size}

Для робочих навантажень, які потрібно масштабувати залежно від розміру кластера (наприклад, `cluster-dns` чи інші системні компоненти), ви можете використовувати [_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler). Так само як і VPA, він не є частиною ядра Kubernetes, а розміщений як окремий проєкт на GitHub.

Cluster Proportional Autoscaler відстежує кількість придатних для планування {{< glossary_tooltip text="вузлів" term_id="node" >}} та ядер і відповідно масштабує кількість реплік цільового робочого навантаження.

Якщо кількість реплік має залишитися незмінною, ви можете масштабувати свої робочі навантаження вертикально залежно від розміру кластера, використовуючи [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler). Проєкт **наразі перебуває у бета-версії** та доступний на GitHub.

Тоді як Cluster Proportional Autoscaler масштабує кількість реплік робочого навантаження, Cluster Proportional Vertical Autoscaler коригує запити на ресурси для робочого навантаження (наприклад, Deployment або DaemonSet) залежно від кількості вузлів та/або ядер у кластері.

### Автомасштабування на основі подій {#event-driven-autoscaling}

Також існує можливість масштабування робочих навантажень на основі подій, наприклад, використовуючи [_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/).

KEDA — це проєкт CNCF зі статусом graduated, що дозволяє масштабувати ваші робочі навантаження залежно від кількості подій, які потрібно обробити, наприклад, кількості повідомлень у черзі. Існує широкий спектр адаптерів для різних джерел подій на вибір.

### Автомасштабування на основі розкладу {#autoscaling-based-on-schedules}

Ще одна стратегія масштабування ваших робочих навантажень — **планувати** операції масштабування за розкладом, наприклад, щоб зменшити споживання ресурсів у непікові години.

Як і у випадку автомасштабування на основі подій, такої поведінки можна досягти за допомогою KEDA разом з його [`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/). `Cron` scaler дозволяє вам визначати розклади (і часові пояси) для збільшення чи зменшення ваших робочих навантажень.

## Масштабування інфраструктури кластера {#scaling-cluster-infrastructure}

Якщо масштабування робочих навантажень недостатньо для ваших потреб, ви також можете масштабувати саму інфраструктуру вашого кластера.

Масштабування інфраструктури кластера зазвичай передбачає додавання або видалення {{< glossary_tooltip text="вузлів" term_id="node" >}}. Дивіться [Автомасштабування вузлів](/docs/concepts/cluster-administration/node-autoscaling/) для отримання додаткової інформації.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся більше про горизонтальне масштабування
  - [Масштабування StatefulSet](/docs/tasks/run-application/scale-stateful-set/)
  - [Покроковий посібник із HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [Зміна розміру ресурсів контейнера на місці](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Автомасштабування сервісу DNS у кластері](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- Дізнайтеся про [автомасштабування вузлів](/docs/concepts/cluster-administration/node-autoscaling/)
