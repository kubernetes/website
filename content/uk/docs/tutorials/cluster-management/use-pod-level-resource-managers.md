---
title: Використання ресурсів рівня Podʼів з менеджерами ресурсів kubelet
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.36
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

Цей посібник демонструє, як налаштувати менеджери ресурсів kubelet (topology, CPU та memory) для підтримки специфікацій ресурсів на рівні Podʼів. Ви можете визначити *гібридні моделі розподілу*, де деякі контейнери отримують ексклюзивні, вирівняні за NUMA інфраструктурні ресурси, тоді як інші спільно використовують решту ресурсів із спільного пулу на рівні Podʼа.

Щоб дізнатися більше про концепції, що стоять за цією можливістю, прочитайте сторінку концепцій [Менеджери ресурсів на рівні Podʼів](/docs/concepts/resource-management/pod-level-resource-managers/).

<!-- lessoncontent -->

## {{% heading "objectives" %}} {#objectives}

- Налаштувати менеджери ресурсів kubelet (CPU, memory та topology) для підтримки ресурсів на рівні Podʼів.
- Розгорнути робочі навантаження, використовуючи область дії `pod` менеджера Topology Manager, щоб досягти вирівнювання за одним NUMA-вузлом зі змішаними ексклюзивними та спільними контейнерами.
- Перевірити та підтвердити, як ресурси CPU та памʼяті розподіляються між ексклюзивними контейнерами та спільним пулом Podʼа.
- Зрозуміти правила відхилення під час допуску, коли спільний пул на рівні Podʼа був би порожнім.
- Розгорнути робочі навантаження, використовуючи область дії `container` менеджера Topology Manager зі змішаними розподілами контейнерів.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Для виконання цього посібника вам потрібно:

- Кластер Kubernetes з **робочими вузлами Linux** (менеджери ресурсів на рівні Podʼів не підтримуються на вузлах Windows).
- Принаймні один робочий вузол з **топологією NUMA** (бажано кілька NUMA-вузлів, щоб спостерігати вирівнювання).
- **Адміністративний доступ** (root або `sudo`) на робочому(их) вузлі(ах) для зміни [конфігурації `kubelet`](/docs/reference/config-api/kubelet-config.v1beta1/) та перезапуску сервісу `kubelet`.
- Доступ до `kubectl` з дозволом створювати простори імен та Podʼи.

Переконайтеся, що такі [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) увімкнено для вашої панелі управління та робочих вузлів:

- `PodLevelResources`
- `PodLevelResourceManagers`

## Створення простору імен {#create-namespace}

Створіть простір імен, щоб ресурси, створені в цьому посібнику, були ізольовані від решти вашого кластера:

```shell
kubectl create namespace plrm-tutorial
```

## Використання області дії pod зі змішаним розподілом {#use-pod-scope-with-mixed-allocation}

Коли область дії менеджера Topology Manager встановлено у `pod`, `kubelet` виконує єдине вирівнювання NUMA для всього Podʼа на основі `.spec.resources`. Отриманий бюджет ресурсів потім розподіляється: контейнери, які запитують ресурси `Guaranteed`, отримують ексклюзивні частки, тоді як контейнери, які не отримують ексклюзивного розподілу, спільно використовують решту бюджету у спільному пулі на рівні Podʼа.

### Крок 1: Налаштування kubelet для області дії `pod` {#step-1-configure-kubelet-for-pod-scope}

Щоб увімкнути цю поведінку, налаштуйте `kubelet` з потрібними політиками на цільовому(их) робочому(их) вузлі(ах), де ви хочете запускати ці робочі навантаження. Ви можете оновити [конфігурацію kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) для цих вузлів так:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "pod"
topologyManagerPolicy: "single-numa-node"
```

- Для `topologyManagerPolicy` допустимими значеннями є `single-numa-node`, `restricted` або `best-effort`. Під час використання керування ресурсами на рівні Podʼа ви не можете вказати жодне інше значення.

Перезапустіть kubelet, щоб застосувати конфігурацію. Наприклад, на Linux з systemd: `systemctl restart kubelet.service`.

### Крок 2: Розгортання Podʼа зі змішаним розподілом {#step-2-deploy-a-mixed-allocation-pod}

Розгляньмо такий приклад маніфесту Podʼа. Pod запитує загальний бюджет 4 CPU на рівні Podʼа (`.spec.resources`). Усередині Podʼа:

- контейнер `main-app` запитує ексклюзивний розподіл 2 цілих ядер CPU (`requests` = `limits` = 2 CPU).
- оскільки `metrics-sidecar` та `logging-sidecar` не вказують запити на рівні контейнера, ці два sidecar-контейнери спільно використовують ядра CPU, що залишилися зі спільного пулу на рівні Podʼа: 2 ядра CPU.

{{% code_sample file="pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml" %}}

Застосуйте маніфест до вашого кластера:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml --namespace=plrm-tutorial
```

### Крок 3: Перевірка та дослідження розподілу ресурсів {#step-3-verify-and-inspect-resource-partitioning}

1. Перевірте, що Pod успішно працює:

   ```shell
   kubectl get pod pod-scope-mixed --namespace=plrm-tutorial
   ```

2. Зрозумійте, що відбулося за лаштунками:

   ```mermaid
   flowchart TD
     subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
         direction TB
         C1["main-app<br/>(Exclusive: 2 CPUs, 2Gi Memory)"]
         subgraph Pool["Pod Shared Pool: 2 CPUs, 2Gi Memory"]
             C2["metrics-sidecar"]
             C3["logging-sidecar"]
         end
     end
   ```

    - Вирівнювання Podʼа: Topology Manager оцінив запит Podʼа на 4 CPU (`spec.resources`) та призначив весь Pod одному NUMA-вузлу.
    - Ексклюзивний розподіл: CPU Manager виділив для `main-app` окрему частку у 2 CPU. Обмеження (throttling) за квотою CFS CPU для `main-app` вимкнено, що дає йому необмежений доступ до цих ексклюзивних ядер.
    - Спільний пул Podʼа: Решта 2 CPU утворюють спільний пул на рівні Podʼа. `metrics-sidecar` та `logging-sidecar` не вказують ресурсів на рівні контейнера (`resources: {}`), тому вони працюють у цьому ізольованому для Podʼа спільному пулі з увімкненим застосуванням квоти CFS. Хоча пул є спільним між цими двома sidecar-контейнерами, він ізольований від зовнішніх робочих навантажень на вузлі, що надає sidecar-контейнерам виділену локальність NUMA та захист від конкуренції за ресурси на рівні вузла.

## Спостереження за обмеженнями допуску в разі порожнього спільному пулі {#empty-shared-pool-restrictions}

Під час використання області дії `pod` контроль допуску `kubelet` відхиляє специфікації Podʼів, які призвели б до порожнього спільного пулу Podʼа, коли є контейнери, які потребують його.

Якщо сума ексклюзивних запитів ресурсів від контейнерів `Guaranteed` дорівнює загальному бюджету на рівні Podʼа, і принаймні один інший контейнер потребує спільного пулу, `kubelet` відхиляє Pod.

### Крок 4: Розгляд недійсного маніфесту Podʼа {#step-4-examine-the-invalid-pod-manifest}

Розгляньмо такий маніфест. Pod запитує загальний бюджет 4 CPU. `container-a` запитує ексклюзивний 1 CPU, а `container-b` — ексклюзивні 3 CPU (разом 4 CPU). `container-c` не запитує ексклюзивних ресурсів і потребує спільного пулу, але в ньому не залишається жодного CPU:

{{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

### Крок 5: Спроба розгортання та спостереження за відхиленням {#step-5-attempt-deployment-and-observe-rejection}

1. Застосуйте маніфест:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-empty-shared-pool.yaml --namespace=plrm-tutorial
   ```

2. Перегляньте події Podʼа, щоб побачити помилку допуску:

   ```shell
   kubectl describe pod empty-shared-pool --namespace=plrm-tutorial
   ```

   Зверніть увагу на повідомлення події, яке пояснює, що `kubelet` відхилив Pod, оскільки спільний пул на рівні Podʼа був би порожнім для контейнерів, які потребують спільних ресурсів:

   ```
   Status:           Failed
   Reason:           TopologyAffinityError
   Message:          Pod was rejected: Pod Scope pod with pod-level resources failed admission under pod-scope topology manager
    ```

   ```mermaid
   flowchart TD
     subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
         direction TB
         C1["container-a<br/>(Exclusive: 1 CPU, 1Gi Memory)"]
         C2["container-b<br/>(Exclusive: 3 CPUs, 3Gi Memory)"]
         subgraph Pool["Pod Shared Pool: 0 CPUs, 0Gi Memory"]
             C3["container-c<br/>(Requires shared pool)"]
         end
     end
     Pool --> Rejection["Admission Error: Pod Rejected!"]
     style Rejection fill:#ffcccc,stroke:#ff0000,stroke-width:2px
   ```

## Використання області дії container зі змішаним розподілом {#use-container-scope-with-mixed-allocation}

Ви також можете встановити область дії Topology Manager у `container`. У цьому режимі `kubelet` оцінює кожен контейнер окремо для ексклюзивного розподілу, тоді як загальний бюджет Podʼа в `.spec.resources` і далі задає межі QoS і обмежень cgroup.

### Крок 6: Налаштування kubelet для області дії `container` {#step-6-configure-kubelet-for-container-scope}

Оновіть [конфігурацію kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) на цільовому(их) робочому(их) вузлі(ах) для області дії `container`:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: "static"
memoryManagerPolicy: "Static"
topologyManagerScope: "container"
topologyManagerPolicy: "single-numa-node"
```

Перезапустіть kubelet, щоб застосувати конфігурацію. Наприклад, на Linux з systemd: `systemctl restart kubelet.service`.

### Крок 7: Розгортання змішаного робочого навантаження з областю дії `container` {#step-7-deploy-a-container-scoped-mixed-workload}

Розгляньмо такий приклад маніфесту Podʼа. Pod має загальний бюджет 4 CPU:

- `infrastructure-sidecar` запитує ексклюзивну частку у 2 CPU (`requests` = `limits` = 2 CPU).
- `worker-1` та `worker-2` не вказують запитів на рівні контейнера та працюють у загальному, спільному для всього вузла пулі.

{{% code_sample file="pods/resource/pod-level-resource-managers-container-scope-mixed.yaml" %}}

Застосуйте маніфест:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resource-managers-container-scope-mixed.yaml --namespace=plrm-tutorial
```

### Крок 8: Перевірка розгортання {#step-8-verify-the-deployment}

1. Перевірте, що Pod працює:

   ```shell
   kubectl get pod container-scope-mixed --namespace=plrm-tutorial
   ```

2. Зрозумійте, що відбулося за лаштунками:

   ```mermaid
   flowchart TD
     subgraph Pod["Pod-Level Budget: 4 CPUs, 4Gi Memory"]
         direction TB
         C1["infrastructure-sidecar<br/>(Exclusive NUMA Slice: 2 CPUs, 2Gi Memory)"]
         subgraph NodePool["Node Shared Pool: Pod-level limit"]
             C3["worker-2"]
             C2["worker-1"]
         end
     end
   ```

   - Вирівнювання з областю дії container: в області дії `container` `kubelet` оцінює контейнери окремо. `infrastructure-sidecar` отримує ексклюзивну, вирівняну за NUMA частку у 2 CPU безпосередньо з пулу розподілюваних ресурсів вузла.
   - Спільний пул вузла: `worker-1` та `worker-2` не вказують запитів ресурсів на рівні контейнера (`resources: {}`), тому в області дії `container` вони працюють у загальному спільному пулі вузла (а не в ізольованому для Podʼа пулі).
   - Застосування обмеження Podʼа: загальне споживання CPU всіма контейнерами не перевищує 4 CPU завдяки обмеженню на рівні Podʼа (`spec.resources.limits`).

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть простір імен та всі приклади Podʼів, створені під час цього посібника:

```shell
kubectl delete namespace plrm-tutorial
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Прочитайте документацію концепцій:
  - [Менеджери ресурсів на рівні Podʼів](/docs/concepts/resource-management/pod-level-resource-managers/)
- Дізнайтеся, як налаштувати менеджери ресурсів на рівні вузла:
  - [Керування політиками топології на вузлі](/docs/tasks/administer-cluster/topology-manager/)
  - [Налаштування політик керування ЦП на вузлі](/docs/tasks/administer-cluster/cpu-management-policies/)
  - [Керування політиками управління памʼяттю на вузлі](/docs/tasks/administer-cluster/memory-manager/)
- Дізнайтеся, як призначати ресурси:
  - [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
  - [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)
  - [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)
