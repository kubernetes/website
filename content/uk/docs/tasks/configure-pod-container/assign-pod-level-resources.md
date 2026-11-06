---
title: Призначення ресурсів CPU і памʼяті на рівні Podʼа
content_type: task
weight: 30
min-kubernetes-server-version: 1.34
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResources" >}}

Ця сторінка показує, як вказати ресурси CPU та памʼяті для Podʼа на рівні Podʼа на додачу до специфікацій ресурсів на рівні контейнерів. Вузол Kubernetes виділяє ресурси Podʼу на основі запитів ресурсів Podʼа. Ці запити можна визначити на рівні Podʼа або окремо для контейнерів у Podʼі. Якщо задано обидва, пріоритет мають запити на рівні Podʼа.

Так само використання ресурсів Podʼом стримують обмеження (limits), які також можна встановити на рівні Podʼа або окремо для контейнерів у Podʼі. І знову, якщо задано обидва, пріоритет мають обмеження на рівні Podʼа. Це дає змогу гнучко керувати ресурсами, контролюючи їх розподіл як на рівні Podʼа, так і на рівні контейнерів.

Щоб вказувати ресурси на рівні Podʼа, потрібно увімкнути функціональну можливість [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources).

Для ресурсів на рівні Podʼа:

* Пріоритет: якщо вказано ресурси і на рівні Podʼа, і на рівні контейнера, пріоритет мають ресурси на рівні Podʼа.
* QoS: на клас QoS Podʼа насамперед впливають ресурси на рівні Podʼа.
* OOM Score: під час обчислення коригування OOM score враховуються ресурси і на рівні Podʼа, і на рівні контейнерів.
* Сумісність: ресурси на рівні Podʼа спроєктовано так, щоб вони були сумісні з наявними можливостями.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Функціональна можливість [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources) має бути увімкнена для вашої панелі управління та для всіх вузлів вашого кластера.

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}} ресурси на рівні Podʼа мають такі обмеження:

* **Типи ресурсів:** на рівні Podʼа можна вказувати лише ресурси CPU, памʼяті та hugepages.
* **Операційна система:** ресурси на рівні Podʼа не підтримуються для Podʼів Windows.
* **Менеджери ресурсів:** менеджер топології, менеджер памʼяті та менеджер CPU підтримують ресурси на рівні Podʼа, коли увімкнено функціональну можливість [`PodLevelResourceManagers`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResourceManagers). Докладніше дивіться [Менеджери ресурсів на рівні Podʼа](/docs/concepts/resource-management/resource-managers/#pod-level-resource-managers). Якщо цю функціональну можливість не увімкнено, вони не вирівнюють Podʼи та контейнери на основі ресурсів на рівні Podʼа.
* **In-Place Resize:** [зміна розміру на місці](/docs/tasks/configure-pod-container/resize-container-resources/) ресурсів на рівні Podʼа потребує функціональної можливості `InPlacePodLevelResourcesVerticalScaling`, яка в Kubernetes {{< skew currentVersion >}} перебуває на стадії альфа. Докладніше дивіться [Зміна розміру ресурсів CPU та памʼяті, призначених Podʼам](/docs/tasks/configure-pod-container/resize-pod-resources/).

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace pod-resources-example
```

## Створення Podʼа із запитами й обмеженнями памʼяті на рівні Podʼа {#create-a-pod-with-memory-requests-and-limits-at-pod-level}

Щоб вказати запити памʼяті для Podʼа на рівні Podʼа, додайте поле `resources.requests.memory` до маніфесту специфікації Podʼа. Щоб вказати обмеження памʼяті, додайте `resources.limits.memory`.

У цій вправі ви створюєте Pod з одним контейнером. Pod має запит памʼяті 100 MiB та обмеження памʼяті 200 MiB. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/resource/pod-level-memory-request-limit.yaml" %}}

Розділ `args` у маніфесті задає аргументи для контейнера під час його запуску. Аргументи `"--vm-bytes", "150M"` вказують контейнеру спробувати виділити 150 MiB памʼяті.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-memory-request-limit.yaml --namespace=pod-resources-example
```

Перевірте, що Pod працює:

```shell
kubectl get pod memory-demo --namespace=pod-resources-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

Вивід показує, що Pod має запит памʼяті 100 MiB та обмеження памʼяті 200 MiB.

```yaml
...
spec:
  containers:
  ...
  resources:
    requests:
      memory: 100Mi
    limits:
      memory: 200Mi
...
```

Виконайте `kubectl top`, щоб отримати метрики Podʼа:

```shell
kubectl top pod memory-demo --namespace=pod-resources-example
```

Вивід показує, що Pod використовує близько 162,900,000 байтів памʼяті, тобто приблизно 150 MiB. Це більше за запит Podʼа в 100 MiB, але в межах обмеження Podʼа у 200 MiB.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

## Створення Podʼа із запитами й обмеженнями CPU на рівні Podʼа {#create-a-pod-with-cpu-requests-and-limits-at-pod-level}

Щоб вказати запит CPU для Podʼа, додайте поле `resources.requests.cpu` до маніфесту специфікації Podʼа. Щоб вказати обмеження CPU, додайте `resources.limits.cpu`.

У цій вправі ви створюєте Pod з одним контейнером. Pod має запит 0,5 CPU та обмеження 1 CPU. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/resource/pod-level-cpu-request-limit.yaml" %}}

Розділ `args` файлу конфігурації задає аргументи для контейнера під час його запуску. Аргумент `-cpus "2"` вказує контейнеру спробувати використовувати 2 CPU.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-cpu-request-limit.yaml --namespace=pod-resources-example
```

Перевірте, що Pod працює:

```shell
kubectl get pod cpu-demo --namespace=pod-resources-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=pod-resources-example
```

Вивід показує, що Pod має запит CPU 500 milliCPU та обмеження CPU 1 CPU.

```yaml
spec:
  containers:
  ...
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

Використайте `kubectl top`, щоб отримати метрики Podʼа:

```shell
kubectl top pod cpu-demo --namespace=pod-resources-example
```

Цей приклад виводу показує, що Pod використовує 974 milliCPU, що трохи менше за обмеження в 1 CPU, вказане в конфігурації Podʼа.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Нагадаємо, що, встановивши `-cpu "2"`, ви налаштували контейнер на спробу використовувати 2 CPU, але контейнеру дозволено використовувати лише близько 1 CPU. Використання CPU контейнером пригальмовується (throttling), оскільки контейнер намагається використати більше ресурсів CPU, ніж дозволяє обмеження CPU Podʼа.

## Створення Podʼа із запитами й обмеженнями ресурсів на рівні Podʼа і на рівні контейнера {#create-a-pod-with-resource-requests-and-limits-at-both-pod-level-and-container-level}

Щоб призначити Podʼу ресурси CPU та памʼяті, їх можна вказати і на рівні Podʼа, і на рівні контейнерів. Додайте поле `resources` до специфікації Podʼа, щоб визначити ресурси для всього Podʼа. Крім того, додайте поле `resources` до специфікації контейнера в маніфесті Podʼа, щоб задати вимоги до ресурсів для конкретного контейнера.

У цій вправі ви створите Pod з двома контейнерами, щоб дослідити взаємодію специфікацій ресурсів на рівні Podʼа і на рівні контейнерів. Сам Pod матиме визначені запити й обмеження CPU, тоді як лише один із контейнерів матиме власні явні запити й обмеження ресурсів. Інший контейнер успадкує обмеження ресурсів від налаштувань на рівні Podʼа. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/resource/pod-level-resources.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resources.yaml --namespace=pod-resources-example
```

Перевірте, що контейнер Podʼа працює:

```shell
kubectl get pod pod-resources-demo --namespace=pod-resources-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod pod-resources-demo --output=yaml --namespace=pod-resources-example
```

Вивід показує, що один контейнер у Podʼі має запит памʼяті 50 MiB і запит CPU 0,5 ядра, з обмеженням памʼяті 100 MiB і обмеженням CPU 0,5 ядра. Сам Pod має запит памʼяті 100 MiB і запит CPU 1 ядро, а також обмеження памʼяті 200 MiB і обмеження CPU 1 ядро.

```yaml
...
  containers:
  -
    name: pod-resources-demo-ctr-1
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
      requests:
        cpu: 500m
        memory: 50Mi
...
  -
    name: pod-resources-demo-ctr-2
    resources: {}
...
  resources:
    limits:
      cpu: "1"
      memory: 200Mi
    requests:
      cpu: "1"
      memory: 100Mi
...
```

Оскільки вказано запити й обмеження на рівні Podʼа, гарантовані запити для обох контейнерів у Podʼі разом становитимуть 1 ядро CPU та 100Mi памʼяті. Крім того, обидва контейнери разом не зможуть використовувати більше ресурсів, ніж указано в обмеженнях на рівні Podʼа, тож у сумі вони не перевищать 200 MiB памʼяті та 1 ядра CPU.

## Очищення {#clean-up}

Видаліть простір імен:

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Менеджери ресурсів на рівні Podʼа](/docs/concepts/resource-management/resource-managers/#pod-level-resource-managers)
