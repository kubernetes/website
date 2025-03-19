---
title: Зміна обсягів CPU та памʼяті, призначених для контейнерів
content_type: task
weight: 35
min-kubernetes-server-version: 1.27
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Ця сторінка передбачає, що ви обізнані з [Якістю обслуговування](/docs/tasks/configure-pod-container/quality-service-pod/) для Podʼів Kubernetes.

Ця сторінка показує, як змінити обсяги CPU та памʼяті, призначені для контейнерів працюючого Podʼа без перезапуску самого Podʼа або його контейнерів. Вузол Kubernetes виділяє ресурси для Podʼа на основі його `запитів`, і обмежує використання ресурсів Podʼа на основі `лімітів`, вказаних у контейнерах Podʼа.

Зміна розподілу ресурсів для запущеного Podʼа вимагає, що [функціональна можливість](/docs/reference/command-line-tools-reference/feature-gates/) `InPlacePodVerticalScaling` має бути увімкнено. Альтернативою може бути видалення Podʼа і ввімкнення параметра, щоб [workload controller](/docs/concepts/workloads/controllers/) створив новий Pod з іншими вимогами до ресурсів.

Запит на зміну розміру виконується через підресурс pod `/resize`, який отримує повністю оновлений pod для запиту на оновлення, або патч на обʼєкті pod для запиту на виправлення.

Для зміни ресурсів Podʼа на місці:

- Ресурси `запитів` та `лімітів` контейнера є _змінними_ для ресурсів CPU та памʼяті. Ці поля представляють _бажані_ ресурси для контейнера.
- Поле `resources` у `containerStatuses` статусу Podʼа відображає фактичні ресурси `requests` та `limits`, які _виділені_ для контейнерів podʼів. Для запущених контейнерів це відображає фактичні ресурси `requests` і `limits` контейнерів, це ресурси, виділені для контейнера під час його запуску. Для не запущених контейнерів це ресурси, виділені для контейнера під час його запуску.
- Поле `resize` у статусі Podʼа показує статус останнього запиту очікуваної зміни розміру. Воно може мати наступні значення:
  - `Proposed`: Це значення вказує на те, що розмір podʼа було змінено, але Kubelet ще не обробив зміну розміру.
  - `InProgress`: Це значення вказує, що вузол прийняв запит на зміну розміру та знаходиться у процесі застосування його до контейнерів Podʼа.
  - `Deferred`: Це значення означає, що запитаної зміни розміру наразі не можна виконати, і вузол буде спробувати її виконати пізніше. Зміна розміру може бути виконана, коли інші Podʼи будуть вилучені та звільнять ресурси вузла.
  - `Infeasible`: це сигнал того, що вузол не може задовольнити запит на зміну розміру. Це може статися, якщо запит на зміну розміру перевищує максимальні ресурси, які вузол може виділити для Podʼа.
  - `""`: Порожнє або не встановлене значення вказує на те, що останню зміну розміру завершено. Це має відбуватися лише у випадку, якщо ресурси у специфікації контейнера збігаються з ресурсами у статусі контейнера.

Якщо у вузлі є контейнери з незавершеною зміною розміру, планувальник буде обчислювати запити на контейнери на основі максимальних запитів на бажані ресурси контейнера, і це будуть фактичні запити, про які повідомляється у статусі.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Має бути увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `InPlacePodVerticalScaling` для вашої панелі управління і для всіх вузлів вашого кластера.

## Політики зміни розміру контейнера {#container-resize-policies}

Політики зміни розміру дозволяють більш детально керувати тим, як контейнери Podʼа змінюють свої ресурси CPU та памʼяті. Наприклад, застосунок з контейнера може використовувати ресурси CPU, змінені без перезапуску, але зміна памʼяті може вимагати перезапуску застосунку та відповідно контейнерів.

Для активації цього користувачам дозволяється вказати `resizePolicy` у специфікації контейнера. Наступні політики перезапуску можна вказати для зміни розміру CPU та памʼяті:

- `NotRequired`: Змінити ресурси контейнера під час його роботи.
- `RestartContainer`: Перезапустити контейнер та застосувати нові ресурси після перезапуску.

Якщо `resizePolicy[*].restartPolicy` не вказано, воно стандартно встановлюється в `NotRequired`.

{{< note >}}
Якщо `restartPolicy` Podʼа є `Never`, політика зміни розміру контейнера повинна бути встановленою в `NotRequired` для всіх контейнерів у Podʼі.
{{< /note >}}

У наведеному нижче прикладі Podʼа CPU контейнера може бути змінено без перезапуску, але змінювання памʼяті вимагає перезапуску контейнера.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qos-demo-5
  namespace: qos-example
spec:
  containers:
  - name: qos-demo-ctr-5
    image: nginx
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
    resources:
      limits:
        memory: "200Mi"
        cpu: "700m"
      requests:
        memory: "200Mi"
        cpu: "700m"
```

{{< note >}}
У вищенаведеному прикладі, якщо бажані запити або ліміти як для CPU, так і для памʼяті змінилися, контейнер буде перезапущено для зміни його памʼяті.
{{< /note >}}

<!-- steps -->

## Обмеження {#limitations}

Зміна розміру ресурсів на місці наразі має наступні обмеження:

- Можна змінити лише ресурси процесора та памʼяті.
- Клас QoS не може бути змінений. Це означає, що запити повинні продовжувати дорівнювати лімітам для Guaranteed podʼам, Burstable podʼам не можуть встановлювати запити і ліміти рівними для CPU і памʼяті, і ви не можете додавати вимоги до ресурсів для Best Effort podʼів.
- Init-контейнери та Ефемерні контейнери не можуть бути змінені за розміром.
- Вимоги до ресурсів та ліміти не можна видалити після встановлення.
- Ліміт памʼяті контейнера не може бути зменшений нижче рівня його використання. Якщо запит переводить контейнер у цей стан, статус зміни розміру залишатиметься у стані `InProgress` доти, доки бажаний ліміт памʼяті не стане можливим.
- Розмір Windows-podʼів не може бути змінений.

## Створення Podʼа із запитами та лімітами ресурсів {#create-pod-with-resource-requests-and-limits}

Ви можете створити Guaranteed або Burstable [клас якості обслуговування](/docs/tasks/configure-pod-container/quality-service-pod/) Podʼу, вказавши запити та/або ліміти для контейнерів Podʼа.

Розгляньте наступний маніфест для Podʼа, який має один контейнер.

{{% code_sample file="pods/qos/qos-pod-5.yaml" %}}

Створіть Pod у просторі імен `qos-example`:

```shell
kubectl create namespace qos-example
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-5.yaml
```

Цей Pod класифікується як Pod класу якості обслуговування Guaranteed, і має запит 700 мілі CPU та 200 мегабайтів памʼяті.

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod qos-demo-5 --output=yaml --namespace=qos-example
```

Також погляньте, що значення `resizePolicy[*].restartPolicy` типово встановлено в `NotRequired`, що вказує, що CPU та памʼять можна змінити, поки контейнер працює.

```yaml
spec:
  containers:
    ...
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: NotRequired
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
...
  containerStatuses:
...
    name: qos-demo-ctr-5
    ready: true
...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    restartCount: 0
    started: true
...
  qosClass: Guaranteed
```

## Оновлення ресурсів Podʼа {#updating-the-pod-s-resources}

Скажімо, вимоги до CPU зросли, і тепер потрібно 0.8 CPU. Це можна вказати вручну, або визначити і застосувати програмно, наприклад, за допомогою таких засобів, як [VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) (VPA).

{{< note >}}
Хоча ви можете змінити запити та ліміти Podʼа, щоб виразити нові бажані ресурси, ви не можете змінити клас якості обслуговування, в якому був створений Pod.
{{< /note >}}

Тепер відредагуйте контейнер Podʼа, встановивши як запити, так і ліміти CPU на `800m`:

```shell
kubectl -n qos-example patch pod qos-demo-5 --subresource resize --patch '{"spec":{"containers":[{"name":"qos-demo-ctr-5", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'
```

Отримайте докладну інформацію про Pod після внесення змін.

```shell
kubectl get pod qos-demo-5 --output=yaml --namespace=qos-example
```

Специфікація Podʼа нижче показує оновлені запити та ліміти CPU.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
...
  containerStatuses:
...
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
    restartCount: 0
    started: true
```

Зверніть увагу, що `resources` у `containerStatuses` було оновлено, щоб відобразити нові бажані запити на CPU. Це вказує на те, що вузол зміг задовольнити збільшені потреби у ресурсах CPU, і нові ресурси CPU було застосовано. Параметр `restartCount` контейнера залишився незмінним, що вказує на те, що розмір ресурсів CPU контейнера було змінено без перезапуску контейнера.

## Очищення {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace qos-example
```

## {{% heading "щодалі" %}}

### Для розробників застосунків {#for-app-developers}

- [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

- [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

- [Призначення ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

- [Налаштування стандартних запитів та лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

- [Налаштування стандартних запитів та лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

- [Налаштування мінімальних та максимальних лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

- [Налаштування мінімальних та максимальних лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

- [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
