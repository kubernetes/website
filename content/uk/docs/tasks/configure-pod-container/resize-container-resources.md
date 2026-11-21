---
title: Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Ця сторінка пояснює, як змінити запити й обмеження ресурсів CPU та памʼяті, призначені контейнеру, *без перестворення Podʼа*.

Традиційно зміна вимог до ресурсів Podʼа потребувала видалення наявного Podʼа та створення заміни, чим часто керує [контролер робочого навантаження](/docs/concepts/workloads/controllers/). Зміна розміру Podʼа на місці (In-place Pod Resize) дає змогу змінювати виділення CPU/памʼяті контейнерам у запущеному Podʼі, потенційно уникаючи порушення роботи застосунку. Процес зміни розміру ресурсів Podʼа описано в розділі [Зміна розміру ресурсів CPU та памʼяті, призначених Podʼам](/docs/tasks/configure-pod-container/resize-pod-resources).

**Ключові концепції:**

* **Бажані ресурси:** поле контейнера `spec.containers[*].resources` задає *бажані* ресурси контейнера і є змінюваним для CPU та памʼяті.
* **Фактичні ресурси:** поле `status.containerStatuses[*].resources` відображає ресурси, *поточно налаштовані* для запущеного контейнера. Для контейнерів, які ще не запускалися або були перезапущені, воно відображає ресурси, виділені для їх наступного запуску.
* **Ініціювання зміни розміру:** зміну розміру можна запитати, оновивши бажані `requests` і `limits` у специфікації Podʼа. Зазвичай це роблять за допомогою `kubectl patch`, `kubectl apply` або `kubectl edit`, звертаючись до субресурсу `resize` Podʼа. Коли бажані ресурси не збігаються з виділеними, Kubelet намагатиметься змінити розмір контейнера.
* **Виділені ресурси (для досвідчених):** поле `status.containerStatuses[*].allocatedResources` відстежує значення ресурсів, підтверджені Kubelet, і використовується переважно для внутрішньої логіки планування. Для більшості завдань моніторингу та перевірки орієнтуйтеся на `status.containerStatuses[*].resources`.

Якщо на вузлі є Podʼи з очікуваною або незавершеною зміною розміру (дивіться [Статус зміни розміру Podʼа](#pod-resize-status) нижче), {{< glossary_tooltip text="планувальник" term_id="kube-scheduler" >}} під час ухвалення рішень про планування використовує *максимум* із бажаних запитів контейнера, виділених запитів і фактичних запитів зі статусу.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Функціональна можливість [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling) має бути увімкнена для вашої панелі управління і для всіх вузлів вашого кластера.

Щоб увімкнути автоматичне витіснення планувальником відкладених запитів на зміну розміру, функціональна можливість [`InPlacePodVerticalScalingSchedulerPreemption`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScalingSchedulerPreemption) також має бути увімкнена для вашої панелі управління.

Щоб динамічно змінювати розмір томів `emptyDir` на основі памʼяті (`medium: Memory`), функціональна можливість [`InPlacePodVerticalScalingMemoryBackedVolumes`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScalingMemoryBackedVolumes) також має бути увімкнена для вашої панелі управління та вузлів, а вузли повинні працювати з cgroup v2.

Версія клієнта `kubectl` має бути принаймні v1.32 для використання прапорця `--subresource=resize`.

## Статус зміни розміру Podʼа {#pod-resize-status}

Kubelet оновлює стани статусу Podʼа, щоб показати стан запиту на зміну розміру:

* `type: PodResizePending`: Kubelet не в змозі негайно виконати запит. Поле `message` надає пояснення чому.
  * `reason: Infeasible`: Запитана зміна розміру є неможливою на поточному вузлі (наприклад, запитано ресурсів більше ніж є на вузлі).
  * `reason: Deferred`: запитана зміна розміру зараз неможлива, але може стати можливою пізніше (наприклад, якщо буде вилучено інший Pod). Kubelet повторить спробу зміни розміру.
* `type: PodResizeInProgress`: Kubelet прийняв зміну розміру й виділив ресурси, але зміни ще застосовуються. Зазвичай це триває недовго, але може зайняти більше часу залежно від типу ресурсу та поведінки середовища виконання. Будь-які помилки під час застосування повідомляються в полі `message` (разом з `reason: Error`).

### Як повторюються та витісняються відкладені зміни розміру {#how-deferred-resizes-are-retried-and-preempted}

Якщо запитана зміна розміру має стан _Deferred_, kubelet періодично повторюватиме спробу зміни розміру, наприклад, коли інший Pod буде видалено або зменшено його масштаб.

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScalingSchedulerPreemption" >}}

Коли функціональну можливість `InPlacePodVerticalScalingSchedulerPreemption` увімкнено, `kube-scheduler` відстежує Podʼи зі статусом зміни розміру `Deferred`. Якщо вузлу бракує місткості для виконання запиту на зміну розміру Podʼа з вищим пріоритетом, планувальник може витіснити (виселити) Podʼи з нижчим пріоритетом на цьому вузлі, щоб звільнити потрібну місткість CPU або памʼяті. Докладніше дивіться [Витіснення для зміни розміру Podʼа на місці](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption-for-in-place-pod-resize).
{{< /note >}}

Якщо є кілька відкладених змін розміру, їх повторюють у такому порядку пріоритету:

* Запити на зміну розміру Podʼів з вищим пріоритетом (на основі PriorityClass) повторюються першими.
* Якщо два Podʼи мають однаковий пріоритет, зміна розміру Podʼів класу Guaranteed повторюється раніше, ніж Podʼів класу Burstable.
* Якщо все інше однакове, перевага надається Podʼам, які довше перебувають у стані Deferred.

Якщо зміну розміру з вищим пріоритетом позначено як очікувану, це не блокує спроб решти очікуваних змін розміру; усі решта очікуваних змін розміру повторюватимуться, навіть якщо зміну з вищим пріоритетом знову буде відкладено.

### Використання полів `observedGeneration` {#leveraging-observedgeneration-fields}

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* Поле верхнього рівня `status.observedGeneration` показує `metadata.generation`, що відповідає останній специфікації Podʼа, яку підтвердив kubelet. За ним можна визначити найновіший запит на зміну розміру, який обробив kubelet.
* У стані `PodResizeInProgress` поле `conditions[].observedGeneration` вказує на `metadata.generation` podSpec, коли була ініційована поточна зміна розміру.
* У стані `PodResizePending` поле `conditions[].observedGeneration` вказує на `metadata.generation` podSpec, коли востаннє намагалися виділити ресурси для відкладеної зміни розміру.

## Політики зміни розміру контейнерів {#container-resize-policies}

Можна керувати тим, чи потрібно перезапускати контейнер під час зміни розміру, задавши `resizePolicy` у специфікації контейнера. Це дає змогу детально керувати цим залежно від типу ресурсу (CPU або памʼять).

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

* `NotRequired`: (стандартно) застосувати зміну ресурсів до запущеного контейнера без його перезапуску.
* `RestartContainer`: перезапустити контейнер, щоб застосувати нові значення ресурсів. Це часто потрібно для змін памʼяті, оскільки багато застосунків і середовищ виконання не можуть динамічно змінювати виділення памʼяті.

Якщо `resizePolicy[*].restartPolicy` для ресурсу не вказано, стандартним значенням буде `NotRequired`.

{{< note >}}
Якщо загальна `restartPolicy` Podʼа має значення `Never`, то `resizePolicy` кожного контейнера має бути `NotRequired` для всіх ресурсів. У таких Podʼах не можна налаштувати політику зміни розміру, яка потребувала б перезапуску.
{{< /note >}}

**Приклад сценарію:**

Розгляньмо контейнер, налаштований з `restartPolicy: NotRequired` для CPU і `restartPolicy: RestartContainer` для памʼяті.

* Якщо змінюються лише ресурси CPU, розмір контейнера змінюється на місці.
* Якщо змінюються лише ресурси памʼяті, контейнер перезапускається.
* Якщо *і* CPU, *і* памʼять змінюються одночасно, контейнер перезапускається (через політику для памʼяті).

## Зміна розміру томів emptyDir на основі памʼяті {#resizing-memory-backed-emptydir-volumes}

{{< feature-state feature_gate_name="InPlacePodVerticalScalingMemoryBackedVolumes" >}}

Коли функціональну можливість `InPlacePodVerticalScalingMemoryBackedVolumes` увімкнено, субресурс `/resize` Podʼа підтримує оновлення `sizeLimit` томів `emptyDir` на основі памʼяті (`medium: Memory`) у запущених Podʼах без перезапуску контейнерів або перестворення Podʼа.

Коли `sizeLimit` тому оновлюється через субресурс `/resize`, Kubelet динамічно оновлює відповідне монтування `tmpfs` без порушення роботи контейнера, надійно запобігаючи помилкам через брак памʼяті та хибним спрацюванням виселення.

Щоб змінити розмір тому `emptyDir` на основі памʼяті, оновіть `spec.volumes[].emptyDir.sizeLimit`, звертаючись до субресурсу `resize` Podʼа:

```shell
kubectl patch pod <pod-name> --subresource resize --patch \
  '{"spec":{"volumes":[{"name":"cache-volume", "emptyDir":{"sizeLimit":"200Mi"}}]}}'
```

Перебіг зміни розміру можна відстежувати за станами статусу Podʼа (`PodResizePending` і `PodResizeInProgress`). Після завершення можна перевірити фактичну місткість тому всередині запущеного контейнера (наприклад, виконавши `df -h` за допомогою `kubectl exec`).

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}} зміна розміру ресурсів Podʼа на місці має такі обмеження:

* **Типи ресурсів:** змінювати розмір можна лише для ресурсів CPU та памʼяті.
* **Зменшення памʼяті:** якщо політика перезапуску для зміни розміру памʼяті — `NotRequired` (або не вказана), kubelet докладе максимальних зусиль, щоб запобігти OOM-kill під час зменшення обмежень памʼяті, але не надає жодних гарантій. Якщо перед зменшенням обмежень памʼяті контейнера використання памʼяті перевищує запитане обмеження, зміну розміру буде пропущено, а статус залишиться в стані "In Progress". Це вважається підходом best-effort, оскільки все ще можливий стан гонитви, за якого використання памʼяті різко зросте одразу після перевірки.
* **Клас QoS:** початковий [клас якості обслуговування (QoS)](/docs/concepts/workloads/pods/pod-qos/) Podʼа (Guaranteed, Burstable або BestEffort) визначається під час створення і **не може** змінитися через зміну розміру. Нові значення ресурсів мають і далі відповідати правилам початкового класу QoS:
  * *Guaranteed*: після зміни розміру запити мають і далі дорівнювати обмеженням як для CPU, так і для памʼяті.
  * *Burstable*: запити й обмеження не можуть одночасно стати рівними *і* для CPU, *і* для памʼяті (бо це змінило б клас на Guaranteed).
  * *BestEffort*: вимоги до ресурсів (`requests` або `limits`) не можна додати (бо це змінило б клас на Burstable або Guaranteed).
* **Типи контейнерів:** не можна змінювати розмір {{< glossary_tooltip text="init-контейнерів" term_id="init-container" >}}, що не перезапускаються, та {{< glossary_tooltip text="ефемерних контейнерів" term_id="ephemeral-container" >}}. Розмір [sidecar-контейнерів](/docs/concepts/workloads/pods/sidecar-containers/) змінювати можна.
* **Вилучення ресурсів:** після встановлення запити й обмеження ресурсів не можна повністю вилучити; їх можна лише змінити на інші значення.
* **Операційна система:** Podʼи Windows не підтримують зміну розміру ресурсів на місці.
* **Політики вузла:** розмір Podʼів, якими керують [статичні політики менеджера CPU або менеджера памʼяті](/docs/tasks/administer-cluster/cpu-management-policies/), не можна змінювати на місці.
* **Swap:** Podʼи, що використовують [swap-памʼять](/docs/concepts/architecture/nodes/#swap-memory), не можуть змінювати запити памʼяті, якщо `resizePolicy` для памʼяті не `RestartContainer`.
* **Зміна розміру томів на основі памʼяті:** зміна розміру томів `emptyDir` на основі памʼяті (`medium: Memory`) на місці потребує вузлів з cgroup v2. На вузлах з cgroup v1 запити на зміну розміру томів на місці відхиляються як неможливі. Розмір томів `emptyDir` на основі диска та постійних томів не можна змінювати через субресурс `/resize` Podʼа.

Ці обмеження можуть бути послаблені в майбутніх версіях Kubernetes.

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти кластера.

```shell
kubectl create namespace qos-example
```

## Приклад 1: Зміна розміру CPU без перезапуску {#example-1-resizing-cpu-without-restart}

Спочатку створіть Pod, розрахований на зміну розміру CPU на місці та зміну розміру памʼяті з перезапуском.

{{% code_sample file="pods/resource/pod-resize.yaml" %}}

Створіть Pod:

```shell
kubectl create -f pod-resize.yaml -n qos-example
```

Цей Pod запускається в класі QoS Guaranteed. Перевірте його початковий стан:

```shell
# Зачекайте трохи, доки Pod запуститься
kubectl get pod resize-demo --output=yaml -n qos-example
```

Перегляньте `spec.containers[0].resources` і `status.containerStatuses[0].resources`. Вони мають відповідати маніфесту (700m CPU, 200Mi памʼяті). Зверніть увагу на `status.containerStatuses[0].restartCount` (має бути 0).

Тепер збільште запит і обмеження CPU до `800m`. Використайте `kubectl patch` з аргументом командного рядка `--subresource resize`.

```shell
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# Альтернативні методи:
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
Аргумент командного рядка `--subresource resize` потребує клієнта `kubectl` версії v1.32.0 або новішої. Старіші версії повідомлятимуть про помилку `invalid subresource`.
{{< /note >}}

Після застосування патча знову перевірте стан Podʼа:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви маєте побачити:

* `spec.containers[0].resources` тепер показує `cpu: 800m`.
* `status.containerStatuses[0].resources` також показує `cpu: 800m`, що означає, що зміна розміру на вузлі пройшла успішно.
* `status.containerStatuses[0].restartCount` залишається `0`, оскільки `resizePolicy` для CPU була `NotRequired`.

## Приклад 2: Зміна розміру памʼяті з перезапуском {#example-2-resizing-memory-with-restart}

Тепер змініть розмір памʼяті *того самого* Podʼа, збільшивши її до `300Mi`. Оскільки `resizePolicy` для памʼяті — `RestartContainer`, очікується, що контейнер перезапуститься.

```shell
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

Невдовзі після застосування патча перевірте стан Podʼа:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви маєте побачити:

* `spec.containers[0].resources` показує `memory: 300Mi`.
* `status.containerStatuses[0].resources` також показує `memory: 300Mi`.
* `status.containerStatuses[0].restartCount` збільшився до `1` (або більше, якщо перезапуски відбувалися раніше), що вказує на те, що контейнер перезапущено для застосування зміни памʼяті.

## Усунення несправностей: неможливий запит на зміну розміру {#troubleshooting-infeasible-resize-request}

Далі спробуйте запитати нерозумну кількість CPU, наприклад 1000 повних ядер (записується як `"1000"`, а не `"1000m"` для міліядер), що, найімовірніше, перевищує місткість вузла.

```shell
# Спроба застосувати патч із надмірно великим запитом CPU
kubectl patch pod resize-demo -n qos-example --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

Перегляньте подробиці Podʼа:

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

Ви побачите зміни, які вказують на проблему:

* Поле `spec.containers[0].resources` показує _бажаний_ стан (`cpu: "1000"`).
* До Podʼа додано стан з `type: PodResizePending` і `reason: Infeasible`.
* Поле `message` цього стану пояснить причину (`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`)
* Що важливо, `status.containerStatuses[0].resources` *і далі показуватиме попередні значення* (`cpu: 800m`, `memory: 300Mi`), оскільки Kubelet не застосував неможливу зміну розміру.
* `restartCount` через цю невдалу спробу не зміниться.

Щоб виправити це, потрібно знову застосувати патч до Podʼа з прийнятними значеннями ресурсів.

## Очищення {#clean-up}

Видаліть свій простір імен. Це видалить усі Podʼи, які ви створили для цього завдання:

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів і обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
