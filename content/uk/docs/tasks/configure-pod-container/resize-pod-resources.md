---
title: Зміна розміру ресурсів CPU та памʼяті, призначених Podʼам
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

На цій сторінці пояснюється, як змінити ресурси CPU та памʼяті, встановлені на рівні Podʼа, без повторного створення Podʼа.

Можливість In-place Pod Resize дає змогу змінювати розподіл ресурсів для запущеного Podʼа, уникаючи порушення роботи застосунку. Процес зміни розміру ресурсів окремих контейнерів описано в розділі [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources).

Ця сторінка зосереджена на зміні розміру ресурсів рівня Podʼа на місці. Ресурси рівня Podʼа визначаються в `spec.resources` і є верхньою межею сукупних ресурсів, що споживають усі контейнери в Podʼі. Можливість зміни розміру ресурсів рівня Podʼа на місці дає змогу безпосередньо змінювати ці сукупні виділення CPU та памʼяті для запущеного Podʼа.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Такі [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) мають бути ввімкнені для вашої панелі управління та для всіх вузлів вашого кластера:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

Версія клієнта kubectl повинна бути не нижче v1.32, щоб можна було використовувати прапорець `--subresource=resize`.

## Статус зміни розміру Podʼа та логіка повторної спроби {#pod-resize-status-and-retry-logic}

Механізм, який використовує `kubelet` для відстеження та повторної спроби зміни ресурсів, є спільним для запитів на зміну розміру на рівні контейнера та на рівні Podʼа.

Статуси, причини та пріоритети повторних спроб є ідентичними тим, що визначені для зміни розміру контейнера:

* Стани статусу: `kubelet` використовує PodResizePending (з причинами на кшталт Infeasible або Deferred) і PodResizeInProgress, щоб повідомляти про стан запиту.

* Пріоритет повторної спроби: відкладені зміни розміру повторюються з урахуванням PriorityClass, потім класу QoS (Guaranteed перед Burstable) і, нарешті, тривалості відкладення.

* Відстеження: можна використовувати поля `observedGeneration`, щоб відстежувати, яка специфікація Podʼа (metadata.generation) відповідає статусу останнього обробленого запиту на зміну розміру.

Повний опис цих станів і логіки повторних спроб дивіться в розділі [Статус зміни розміру Podʼа](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) документації щодо зміни розміру контейнерів.

## Політика зміни розміру контейнера та зміна розміру на рівні Podʼа {#container-resize-policy-and-pod-level-resize}

Зміна розміру ресурсів на рівні Podʼа не підтримує і не вимагає власної політики перезапуску.

* Немає політики рівня Podʼа: зміни сукупних ресурсів Podʼа (spec.resources) завжди застосовуються на місці без перезапуску. Причина в тому, що ресурси рівня Podʼа діють як загальне обмеження для cgroup Podʼа і не керують безпосередньо виконанням застосунку в контейнерах.

* [Політика контейнера](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) і далі діє: resizePolicy, як і раніше, потрібно налаштовувати на рівні контейнера (spec.containers[*].resizePolicy). Ця політика визначає, чи перезапускається окремий контейнер, коли змінюються його запити ресурсів або обмеження, незалежно від того, чи цю зміну ініційовано безпосередньою зміною розміру на рівні контейнера, чи оновленням загальних меж ресурсів рівня Podʼа.

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}} зміна розміру ресурсів на рівні Podʼа підлягає всім обмеженням, описаним для зміни розміру ресурсів на рівні контейнера, які можна знайти тут: [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам: обмеження](/docs/tasks/configure-pod-container/resize-container-resources/#limitations).

Крім того, для зміни розміру ресурсів на рівні Podʼа існує таке обмеження:

* Перевірка запитів контейнерів: зміна розміру дозволена лише в тому випадку, якщо отримані запити на ресурси на рівні Podʼа (spec.resources.requests) більші або дорівнюють сумі відповідних запитів на ресурси від усіх окремих контейнерів у Podʼі. Це забезпечує мінімальну гарантовану доступність ресурсів для Podʼа.

* Перевірка обмежень контейнерів: зміна розміру дозволена, якщо індивідуальні обмеження контейнерів менші або дорівнюють обмеженням ресурсів на рівні Podʼа (spec.resources.limits). Обмеження на рівні Podʼа слугує межею, яку жоден окремий контейнер не може перевищити, але сума обмежень контейнерів може перевищувати обмеження на рівні Podʼа, що дозволяє спільне використання ресурсів між контейнерами в Podʼі.

## Приклад: Зміна розміру ресурсів на рівні Podʼа {#example-resizing-pod-level-resources}

Спочатку створіть Pod, призначений для зміни розміру CPU на місці та зміни розміру памʼяті, що вимагає перезапуску.

{{% code_sample file="pods/resource/pod-level-resize.yaml" %}}

Створіть Pod:

```shell
kubectl create -f pod-level-resize.yaml
```

Цей Pod запускається в класі Guaranteed QoS, оскільки запити на рівні Podʼа дорівнюють обмеженням. Перевірте його початковий стан:

```shell
# Зачекайте, поки Pod запуститься.
kubectl get pod pod-level-resize-demo --output=yaml
```

Перегляньте `spec.resources` (200m CPU, 200Mi памʼяті). Зверніть увагу на `status.containerStatuses[0].restartCount` (має бути 0) і `status.containerStatuses[1].restartCount` (має бути 0).

Тепер збільште запит і обмеження CPU на рівні Podʼа до `300m`. Для цього використайте `kubectl patch` з аргументом командного рядка `--subresource resize`.

```shell
kubectl patch pod pod-level-resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Альтернативні методи:
# kubectl edit pod pod-level-resize-demo --subresource resize
# kubectl apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
Для використання аргументу командного рядка `--subresource resize` необхідна версія клієнта `kubectl` v1.32.0 або новіша. Старіші версії видаватимуть помилку `invalid subresource`.
{{< /note >}}

Після застосування патча знову перевірте стан Podʼа:

```shell
kubectl get pod pod-level-resize-demo --output=yaml
```

Ви маєте побачити:

* `spec.resources.requests` та `spec.resources.limits` тепер показують `cpu: 300m`.
* `status.containerStatuses[0].restartCount` залишається `0`, оскільки `resizePolicy` для CPU була `NotRequired`.
* `status.containerStatuses[1].restartCount` збільшився до `1`, що вказує на те, що контейнер було перезапущено для застосування зміни CPU. Перезапуск відбувся в контейнері 1, незважаючи на те, що зміна розміру була застосована на рівні Podʼа, через складний взаємозвʼязок між обмеженнями на рівні Podʼа і політиками на рівні контейнера. Оскільки контейнер 1 не мав явно заданого обмеження CPU, його базова конфігурація ресурсів (наприклад, cgroups) неявним чином прийняла загальне обмеження CPU Podʼа як ефективну межу максимального споживання. Коли обмеження CPU на рівні Podʼа було змінено з 200m до 300m, ця дія відповідно змінила неявне обмеження, застосоване до контейнера 1. Оскільки для контейнера 1 було явно встановлено resizePolicy на RestartContainer для CPU, `kubelet` був змушений перезапустити контейнер, щоб правильно застосувати цю зміну в базовому механізмі застосування ресурсів, тим самим підтвердивши, що зміна обмежень на рівні Podʼа може викликати політику перезапуску контейнера, навіть якщо обмеження контейнера не визначені безпосередньо.

## Очищення {#clean-up}

Видаліть Pod:

```shell
kubectl delete pod pod-level-resize-demo
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
