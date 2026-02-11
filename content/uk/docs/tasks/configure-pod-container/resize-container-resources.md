---
title: Зміна розміру CPU та memory, призначених контейнерам
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Ця сторінка пояснює як змінити запити та обмеження ресурсів CPU та памʼяті повʼязані з контейнером _без перестворення Podʼу_.

Зазвичай, зміна ресурсів Podʼа вимагає вилучення наявного Podʼа та створення його заміни, що виконується [контролером робочого навантаження](/docs/concepts/workloads/controllers/). Зміна розміру Podʼа на місці дозволяє змінювати виділені його контейнерам CPU/памʼять уникаючи потенційної перерви в роботі застосунку. Процес зміни розміру ресурсів Podʼів описано в розділі [Зміна розміру ресурсів CPU та памʼяті, призначених для Podʼів](/docs/tasks/configure-pod-container/resize-pod-resources).

**Ключові концепції:**

* **Бажані ресурси:** Поле `spec.containers[*].resources` контейнера представляє _бажані_ ресурси і є змінюваним для значень CPU та memory.
* **Поточні ресурси:** Поле `status.containerStatuses[*].resources` показує _поточно налаштовані_ ресурси для запуску контейнера. Для контейнерів, що не були запущені воно показує ресурси виділені для наступного запуску контейнера.
* **Запуск зміни розміру:** Ви можете запитати зміну розміру оновлюючи відповідні значення `requests` та `limits` в специфікації Podʼа. Це, як правило, робиться з використанням `kubectl patch`, `kubectl apply` або `kubectl edit` для Podʼа залучаючи субресурс `resize`. Коли бажаний ресурс не збігається з виділеними ресурсами, Kubelet намагатиметься змінити розмір контейнера.
* **Виділені ресурси (Advanced):** Поле `status.containerStatuses[*].allocatedResources` відстежує значення ресурсів, що були підтверджені Kubelet, переважно використовується для внутрішньої логіки планування. Для більшості потреб моніторингу та валідації зосереджуйтесь на `status.containerStatuses[*].resources`.

Якщо у вузлі є podʼи з очікуваною або незавершеною зміною розміру (див [Статус Pod Resize](#pod-resize-status) нижче), {{< glossary_tooltip text="планувальник" term_id="kube-scheduler" >}} буде використовувати **максимальні** запити на бажані ресурси контейнера, запити виділення та запити поточних ресурсів зі статусу для прийняття рішення.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Має бути увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `InPlacePodVerticalScaling` для вашої панелі управління і для всіх вузлів вашого кластера.

Версія клієнта `kubectl` має бути принаймні v1.32 для використання прапорця `--subresource=resize`.

## Статус Pod resize {#pod-resize-status}

Kubelet оновлює умови статусу Pod, щоб вказати стан запиту на зміну розміру:

* `type: PodResizePending`: Kubelet не в змозі негайно виконати запит. Поле `message` надає пояснення чому.
  * `reason: Infeasible`: Запитана зміна розміру є неможливою на поточному вузлі (наприклад, запитано ресурсів більше ніж є на вузлі).
  * `reason: Deferred`: Запитана зміна ресурсу зараз є неможливою, але може стати можливою згодом (наприклад, інший pod буде вилучено). Kubelet спробує змінити розмір.
* `type: PodResizeInProgress`: Kubelet прийняв зміну розміру та розподілив ресурси, але зміни все ще застосовуються. Зазвичай це швидко, але може зайняти більше часу залежно від типу ресурсу та поведінки під час виконання. Будь-які помилки під час активації повідомляються в полі `message` (разом з `reason: Error`).

### Як kubelet повторно намагається змінити розмір Deferred {#how-kubelet-retries-deferred-resizes}

Якщо запитана зміна розміру є _Deferred_, kubelet періодично повторно намагатиметься змінити розмір, наприклад, коли інший pod буде видалено або масштабовано вниз. Якщо є кілька відкладених змін розміру, вони повторно намагаються відповідно до наступного пріоритету:

* Podʼи з вищим пріоритетом (на основі PriorityClass) матимуть свої запити на зміну розміру повторно спробовані першими.
* Якщо два podʼа мають однаковий пріоритет, зміна розміру гарантованих podʼів буде повторно спробована перед зміною розміру burstable podʼів.
* Якщо все інше однакове, podʼи, які перебувають у стані Deferred довше, отримають пріоритет.

Зміна розміру з вищим пріоритетом, позначена як така, що очікує на виконання, не блокуватиме спроби зміни розміру, що залишаються в очікуванні; всі інші очікуючі зміни розміру все ще будуть повторно спробовані, навіть якщо зміна розміру з вищим пріоритетом знову буде відкладена.

### Використання полів `observedGeneration`{#leveraging-observedgeneration-fields}

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* Поле верхнього рівня `status.observedGeneration` показує `metadata.generation`, що відповідає останній специфікації pod, яку визнала kubelet. Ви можете використовувати це, щоб визначити найостанніший запит на зміну розміру, який обробив kubelet.
* У стані `PodResizeInProgress` поле `conditions[].observedGeneration` вказує на `metadata.generation` podSpec, коли була ініційована поточна зміна розміру.
* У стані `PodResizePending` поле `conditions[].observedGeneration` вказує на `metadata.generation` podSpec, коли востаннє намагалися виділити ресурси для відкладеної зміни розміру.

## Політики зміни розміру контейнерів {#container-resize-policies}

Ви можете вказати чи потрібно перезапускати контейнер під час зміни розміру за допомогою поля `resizePolicy` в специфікації контейнера. Це дозволяє докладний контроль за типами ресурсів (CPU чи memory).

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

* `NotRequired`: (типово) застосовувати зміну ресурсів без перезапуску контейнера.
* `RestartContainer`: перезапускати контейнер під час зміни ресурсів. Це часто необхідно для зміни memory оскільки багато застосунків та середовищ виконання не можуть підлаштовуватись до динамічної зміни виділення памʼяті.

Якщо `resizePolicy[*].restartPolicy` не вказано для ресурсу, типовим значенням буде `NotRequired`.

{{< note >}}
Якщо загальний параметр Podʼа `restartPolicy` має значення `Never`, тоді параметр `resizePolicy` кожного контейнера має бути `NotRequired` для всіх ресурсів. Ви не зможете налаштовувати зміну ресурсів, що вимагають перезапуску в таких Podʼах
{{< /note >}}

**Приклад сценарію:**

Уявіть контейнер з налаштованими `restartPolicy: NotRequired` для CPU та `restartPolicy: RestartContainer` для memory.

* Якщо тільки ресурс CPU буде змінено, розмір контейнера буде змінено на місці.
* Якщо тільки ресурс memory буде змінено, контейнер буде перезапущено.
* Якщо _обидва_ ресурси CPU та memory будуть змінені одночасно, контейнер буде перезапущено (через правило перезапуску для ресурсу memory).

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}} зміна розміру ресурсів podʼа на місці має наступні обмеження:

* **Типи ресурсів:** Тільки ресурси CPU та memory можуть змінювати розмір.
* **Зменшення memory:** Якщо політика перезапуску зміни розміру памʼяті є `NotRequired` (або не вказана), kubelet зробить спробу запобігти oom-kills при зменшенні лімітів памʼяті, але не надає жодних гарантій. Перед зменшенням лімітів памʼяті контейнера, якщо використання памʼяті перевищує запитуваний ліміт, зміна розміру буде пропущена, а статус залишиться в стані "In Progress". Це вважається найкращим варіантом, оскільки все ще існує ризик виникнення ситуації, коли використання памʼяті може різко зрости одразу після виконання перевірки.
* **Клас QoS:** Оригінальний [клас Quality of Service (QoS)](/docs/concepts/workloads/pods/pod-qos/) Podʼа (Guaranteed, Burstable або BestEffort) визначається під час створення і **не може** бути змінений під час зміни розміру. Зміна значень розміру ресурсів все ще має дотримуватись правил оригінальних класів QoS:
  * _Guaranteed_: Запити мають продовжувати дорівнювати лімітам як для CPU, так і для memory після зміни розміру.
  * _Burstable_: Запити та ліміти не можуть бути тотожними як для CPU, так і для memory одночасно (оскільки це призведе до їх зміни до Guaranteed).
  * _BestEffort_: Вимоги до ресурсів (`requests` чи `limits`) не можуть бути додані (оскільки це призведе до зміни до Burstable або Guaranteed).
* **Типи контейнерів:** {{< glossary_tooltip text="Контейнери init" term_id="init-container" >}}, що не перезапускаються, та {{< glossary_tooltip text="ефемерні контейнери" term_id="ephemeral-container" >}} не можуть змінювати розмір. [Контейнери sidecar](/docs/concepts/workloads/pods/sidecar-containers/) можуть змінювати розмір.
* **Вилучення ресурсів:** Після встановлення запити та ліміти ресурсів не можуть бути вилучені; їх можна тільки змінити іншими значеннями.
* **Операційна система:** Podʼи Windows не підтримують зміну розміру ресурсів на місці.
* **Політики Node:** Podʼи, які керуються [статичними політиками менеджера CPU та Memory](/docs/tasks/administer-cluster/cpu-management-policies/) не можуть змінювати розмір на місці.
* **Swap:** Podʼи, що використовують [swap-памʼять](/docs/concepts/architecture/nodes/#swap-memory), не можуть змінювати розмір запитів памʼять якщо `resizePolicy` для memory не встановлено у `RestartContainer`.

Ці обмеження можуть бути послаблені в наступних версіях Kubernetes.

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти кластера.

```shell
kubectl create namespace qos-example
```

## Приклад 1: Зміна розміру CPU без перезапуску {#example-1-resizing-cpu-without-restart}

Спочатку, створіть Pod створений для зміни розміру CPU на місці та такий що вимагає перезапуску під час зміни memory.

{{% code_sample file="pods/resource/pod-resize.yaml" %}}

Створіть Pod:

```shell
kubectl create -f pod-resize.yaml -n qos-example
```

Цей Pod запускається з класом Guaranteed QoS. Перевірте його початковий стан:

```shell
# Почекайте трохи доки pod запуститься
kubectl get pod resize-demo --output=yaml -n qos-example
```

Погляньте на `spec.containers[0].resources` та `status.containerStatuses[0].resources`. Вони мають відповідати маніфесту (700m CPU, 200Mi memory). Зверніть увагу на `status.containerStatuses[0].restartCount` (має бути 0).

Тепер збільште запит та ліміт CPU до `800m`. Використовуйте `kubectl patch` з аргументом командного рядка `--subresource resize`.

```shell
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# Альтернативні методи:
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
Для використання аргументу командного рядка `--subresource resize` у вас має бути версія клієнта `kubectl` не менша ніж v1.32.0.
{{< /note >}}

Перевірте стан podʼа після накладання латки:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви мажте побачити:

* `spec.containers[0].resources` тепер показує `cpu: 800m`.
* `status.containerStatuses[0].resources` також показує `cpu: 800m`, що означає, що зміна розміру на вузлі відбулась.
* `status.containerStatuses[0].restartCount` залишається `0`, оскільки CPU `resizePolicy` було `NotRequired`.

## Приклад 2: Зміна розміру memory без перезапуску{#example-2-resizing-memory-with-restart}

Тепер змінимо розмір memory в _тому ж_ поді збільшивши її до `300Mi`. Оскільки memory `resizePolicy` має значення `RestartContainer`, контейнер має перезапуститись.

```shell
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

Перевірте стан podʼа невдовзі після застосування латки:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви маєте побачити:

* `spec.containers[0].resources` показує `memory: 300Mi`.
* `status.containerStatuses[0].resources` також показує `memory: 300Mi`.
* `status.containerStatuses[0].restartCount` збільшився до `1` (або більше, якщо до цього вже відбувались перезапуски), що вказує на те, що контейнер було перезапущено після застосування зміни розміру memory.

## Розвʼязання проблем: Неможливий запит на зміну розміру {#troubleshooting-infeasible-resize-request}

Далі, спробуємо запитати якесь неможливе значення CPU, наприклад 1000 цілих ядер (записується як `"1000"`, в той час, коли йдеться про міліядра це — `"1000m"`), що очевидно перевищує можливості вузла.

```shell
# Спроба застосувати латку з запитом явно більшої кількістю CPU
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

Запитайте інформацію Podʼа:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви побачите зміни, що сповіщають про проблему:

* Поле `spec.containers[0].resources` показує _бажаний_ стан (`cpu: "1000"`).
* Стан з `type: PodResizePending` та `reason: Infeasible` було додано до Pod.
* Поле `message` буде містити пояснення (`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`)
* Найважливіше, `status.containerStatuses[0].resources` буде _все ще показувати попередні значення_ (`cpu: 800m`, `memory: 300Mi`), тому що неможлива зміна розміру не була застосована Kubelet.
* Поле `restartCount` не зміниться через невдалу спробу.

Щоб виправити це, вам потрібно застосувати латку до podʼа з прийнятними параметрами.

## Очищення {#clean-up}

Видаліть свій простір імен. Це видалить усі Podʼи, які ви створили для цього завдання:

```shell
kubectl delete namespace qos-example
```

## {{% heading "щодалі" %}}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів та лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
