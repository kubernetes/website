---
title: Зміна розміру ресурсів CPU та памʼяті, призначених для Podʼів
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

На цій сторінці пояснюється, як змінити ресурси CPU та памʼяті, встановлені на рівні Podʼа, без повторного створення Podʼа.

Функція In-place Pod Resize дозволяє змінювати розподіл ресурсів для запущеного Pod, уникаючи переривання роботи застосунків. Процес зміни розміру окремих ресурсів контейнера описано в розділі [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources).

На цій сторінці описано зміну розміру ресурсів на рівні Pod. Ресурси на рівні Pod визначаються в `spec.resources` і виступають верхньою межею сукупних ресурсів, що споживаються всіма контейнерами в Podʼі. Функція зміни розміру ресурсів на рівні Podʼа дозволяє безпосередньо змінювати сукупні розподіли ресурсів CPU та памʼяті для запущеного Podʼа.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Наступні [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) повинні бути ввімкнені для вашої панелі управління та для всіх вузлів у вашому кластері:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

Версія клієнта kubectl повинна бути не нижче v1.32, щоб можна було використовувати прапорець `--subresource=resize`.

## Статус зміни розміру Podʼа та логіка повторної спроби {#pod-resize-status-and-retry-logic}

Механізм, який використовує `kubelet` для відстеження та повторної спроби зміни ресурсів, є спільним для запитів на зміну розміру на рівні контейнера та на рівні Podʼа.

Статуси, причини та пріоритети повторних спроб є ідентичними тим, що визначені для зміни розміру контейнера:

* Умови стану: `kubelet` використовує PodResizePending (з причинами, такими як Infeasible або Deferred) та PodResizeInProgress для повідомлення про стан запиту.

* Пріоритет повторної спроби: відкладені зміни розміру повторюються на основі PriorityClass, потім класу QoS (Guaranteed на перевагу до Burstable) і, нарешті, за тривалістю відкладення.

* Відстеження: Ви можете використовувати поля `observedGeneration`, щоб відстежувати, яка специфікація Pod (metadata.generation) відповідає статусу останнього обробленого запиту на зміну розміру.

Повний опис цих умов та логіки повторних спроб див. у розділі [Статус зміни розміру Podʼа](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) у документації щодо зміни розміру контейнера.

## Політика зміни розміру контейнера та зміна розміру на рівні Podʼа {#container-resize-policy-and-pod-level-resize}

Зміна розміру ресурсів на рівні Podʼа не підтримує і не вимагає власної політики перезапуску.

* Відсутність політики на рівні Podʼа: зміни сукупних ресурсів Podʼа (spec.resources) завжди застосовуються на місці без перезапуску. Це повʼязано з тим, що ресурси на рівні Podʼа діють як загальне обмеження для cgroup Podʼа і не керують безпосередньо часом виконання застосунку в контейнерах.

* [Політика контейнера](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) все ще діє: Політика resizePolicy все ще повинна бути налаштована на рівні контейнера (spec.containers[*].resizePolicy). Ця політика регулює, чи буде окремий контейнер перезапущений, коли зміняться його запити на ресурси або обмеження, незалежно від того, чи була ця зміна ініційована безпосередньо на рівні контейнера або оновленням загального ресурсного конверту на рівні Podʼа.

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}} зміна розміру ресурсів на рівні Podʼа підлягає всім обмеженням, описаним для зміни розміру ресурсів на рівні контейнера, які можна знайти тут: (Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам: обмеження)[docs/tasks/configure-pod-container/resize-container-resources/#limitations].

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

Спостерігайте за `spec.resources` (200m CPU, 200Mi пам'яті). Зверніть увагу на `status.containerStatuses[0].restartCount` (повинно бути 0) і `status.containerStatuses[1].restartCount` (повинно бути 0).

Тепер збільште запит на CPU на рівні пода і обмежте його до `300m`. Використовуйте `kubectl patch` з аргументом командного рядка `--subresource resize`.

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Альтернативні методи:
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
Для використання аргументу командного рядка `--subresource resize` необхідна версія клієнта `kubectl` v1.32.0 або новіша. Старіші версії видаватимуть помилку `invalid subresource`.
{{< /note >}}

Після встановлення виправлення знову перевірте стан пода:

```shell
kubectl get pod pod-level-resize-demo --output=yaml
```

Ви повинні побачити:

* `spec.resources.requests` та `spec.resources.limits` тепер показують `cpu: 300m`.
* `status.containerStatuses[0].restartCount` залишається `0`, оскільки CPU `resizePolicy` було `NotRequired`.
* `status.containerStatuses[1].restartCount` збільшився до `1`, що вказує на те, що контейнер було перезапущено для застосування зміни CPU. Перезапуск відбувся в контейнері 1, незважаючи на те, що зміна розміру була застосована на рівні Podʼа, через складний взаємозвʼязок між обмеженнями на рівні Podʼаі політиками на рівні контейнера. Оскільки контейнер 1 не мав явно заданого обмеження CPU, його базова конфігурація ресурсів (наприклад, cgroups) неявним чином прийняла загальне обмеження CPU Podʼа як ефективну межу максимального споживання. Коли обмеження CPU на рівні Podʼа було змінено з 200m до 300m, ця дія відповідно змінила неявне обмеження, застосоване до контейнера 1. Оскільки для контейнера 1 було явно встановлено resizePolicy на RestartContainer для CPU, `kubelet` був змушений перезапустити контейнер, щоб правильно застосувати цю зміну в базовому механізмі застосування ресурсів, тим самим підтвердивши, що зміна обмежень на рівні Podʼа може викликати політику перезапуску контейнера, навіть якщо обмеження контейнера не визначені безпосередньо.

## Очищення {#clean-up}

Видаліть под:

```shell
kubectl delete pod pod-level-resize-demo
```

## {{% heading "whatsnext" %}}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті контейнерам і подам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і подам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні пода](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування запитів і стандартних обмежень для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот пам'яті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
