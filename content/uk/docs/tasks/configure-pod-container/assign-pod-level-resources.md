---
title: Надання ресурсів CPU та памʼяті на рівні Podʼів
content_type: task
weight: 30
min-kubernetes-server-version: 1.34
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResources" >}}

Ця сторінка показує, як вказати ресурси CPU та памʼяті для Pod на рівні podʼів, додатково до специфікацій ресурсів на рівні контейнера. Вузол Kubernetes виділяє ресурси для podʼів на основі запитів ресурсів podʼом. Ці запити можуть бути визначені на рівні podʼа або індивідуально для контейнерів у podʼі. Коли присутні обидва, запити на рівні podʼа мають пріоритет.

Аналогічно, використання ресурсів podʼом обмежується лімітами, які також можуть бути встановлені на рівні podʼа або індивідуально для контейнерів у podʼі. Знову ж таки, ліміти на рівні podʼа мають пріоритет, коли присутні обидва. Це дозволяє гнучко керувати ресурсами, дозволяючи контролювати розподіл ресурсів як на рівні podʼа, так і на рівні контейнера.

Щоб вказати ресурси на рівні podʼа, необхідно увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `PodLevelResources`.

Для ресурсів на рівні Podʼа:

* Пріоритет: Коли вказані як ресурси на рівні podʼа, так і на рівні контейнера, ресурси на рівні podʼа мають пріоритет.
* QoS: Ресурси на рівні podʼа мають пріоритет у впливі на клас QoS podʼа.
* OOM Score: Розрахунок коригування OOM score враховує як ресурси на рівні podʼа, так і на рівні контейнера.
* Сумісність: Ресурси на рівні pod розроблені для сумісності з наявними функціями.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

[Функціональна можливість](/docs/reference/command-line-tools-reference/feature-gates/) `PodLevelResources` має бути увімкнена для вашої панелі управління та для всіх вузлів у вашому кластері.

## Обмеження {#limitations}

Для Kubernetes {{< skew currentVersion >}}, зміна розміру ресурсів на рівні podʼа має такі обмеження:

* **Типи ресурсів:** Тільки ресурси CPU, памʼяті та hugepages можуть бути вказані на рівні podʼа.
* **Операційна система:** Ресурси на рівні podʼа не підтримуються для Windows podʼів.
* **Менеджери ресурсів:** Менеджери ресурсів Topology Manager, Memory Manager та CPU Manager не розташовують podʼи та контейнери на основі ресурсів на рівні podʼа, оскільки ці менеджери ресурсів наразі не підтримують ресурси на рівні podʼа.
* **In-Place Resize:** [Зміна розміру ресурсів на місці](https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/) на рівні podʼа вимагає функціональної можливості `InPlacePodLevelResourcesVerticalScaling`, яка перебуває в стані альфа у Kubernetes {{< skew currentVersion >}}. Для отримання додаткової інформації див. [Зміна розміру ресурсів CPU та пам'яті Podʼів](/docs/tasks/configure-pod-container/resize-pod-resources/).

<!-- steps -->

## Створіть простір імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace pod-resources-example
```

## Створіть pod із запитами та лімітами памʼяті на рівні podʼа {#create-a-pod-with-memory-requests-and-limits-at-pod-level}

Щоб вказати запити памʼяті для pod на рівні podʼа, включіть поле `resources.requests.memory` у маніфест pod. Щоб вказати ліміт памʼяті, включіть `resources.limits.memory`.

У цій вправі ви створюєте pod, який має один контейнер. Pod має запит памʼяті 100 MiB і ліміт памʼяті 200 MiB. Ось конфігураційний файл для podʼа:

{{% code_sample file="pods/resource/pod-level-memory-request-limit.yaml" %}}

Розділ `args` у маніфесті надає аргументи для контейнера під час його запуску. Аргументи `"--vm-bytes", "150M"` вказують контейнеру спробувати виділити 150 MiB памʼаяті.

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

Вивід показує, що Pod має запит памʼяті 100 MiB і ліміт памʼяті 200 MiB.

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

Запустіть `kubectl top`, щоб отримати метрики для pod:

```shell
kubectl top pod memory-demo --namespace=pod-resources-example
```

Вивід показує, що Pod використовує близько 162,900,000 байтів памʼяті, що становить близько 150 MiB. Це більше, ніж запит Pod у 100 MiB, але в межах ліміту Pod у 200 MiB.

```none
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

## Створіть pod із запитами та лімітами CPU на рівні podʼа {#create-a-pod-with-cpu-requests-and-limits-at-pod-level}

Щоб вказати запит CPU для Pod, включіть поле `resources.requests.cpu` у маніфест Pod. Щоб вказати ліміт CPU, включіть `resources.limits.cpu`.

У цій вправі ви створюєте Pod, який має один контейнер. Pod має запит 0.5 CPU і ліміт 1 CPU. Ось конфігураційний файл для Pod:

{{% code_sample file="pods/resource/pod-level-cpu-request-limit.yaml" %}}

Розділ `args` конфігураційного файлу надає аргументи для контейнера під час його запуску. Аргумент `-cpus "2"` вказує контейнеру спробувати використовувати 2 CPU.

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

Вивід показує, що Pod має запит CPU 500 milliCPU і ліміт CPU 1 CPU.

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

Використовуйте `kubectl top`, щоб отримати метрики для Pod:

```shell
kubectl top pod cpu-demo --namespace=pod-resources-example
```

Цей приклад виходу показує, що Pod використовує 974 milliCPU, що трохи менше ліміту 1 CPU, вказаного в конфігурації Pod.

```none
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Нагадаємо, що встановивши `-cpu "2"`, ви налаштували контейнер на спробу використовувати 2 CPU, але контейнеру дозволено використовувати лише близько 1 CPU. Використання CPU контейнера обмежується, оскільки контейнер намагається використовувати більше ресурсів CPU, ніж ліміт CPU Pod.

## Створіть pod із запитами та лімітами ресурсів як на рівні podʼа, так і на рівні контейнера {#create-a-pod-with-resource-requests-and-limits-at-both-pod-level-and-container-level}

Щоб призначити ресурси CPU та памʼяті Pod, ви можете вказати їх як на рівні podʼа, так і на рівні контейнера. Включіть поле `resources` у специфікацію Podʼа, щоб визначити ресурси для всього Podʼа. Додатково включіть поле `resources` у специфікацію контейнера в маніфесті Podʼа, щоб встановити вимоги до ресурсів для конкретного контейнера.

У цій вправі ви створите Pod із двома контейнерами, щоб дослідити взаємодію специфікацій ресурсів на рівні podʼа і контейнера. Сам Pod матиме визначені запити та ліміти CPU, тоді як лише один із контейнерів матиме власні явні запити та ліміти ресурсів. Інший контейнер успадкує обмеження ресурсів від налаштувань на рівні podʼа. Ось конфігураційний файл для Podʼа:

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

Вивід показує, що один контейнер у Pod має запит памʼяті 50 MiB і запит CPU 0.5 ядер, з лімітом памʼяті 100 MiB і лімітом CPU 0.5 ядер. Сам Pod має запит памʼяті 100 MiB і запит CPU 1 ядро, і ліміт памʼяті 200 MiB і ліміт CPU 1 ядро.

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

Оскільки вказані запити та ліміти на рівні podʼа, гарантії запитів для обох контейнерів у podʼі будуть рівні 1 ядру CPU та 100Mi памʼяті. Крім того, обидва контейнери разом не зможуть використовувати більше ресурсів, ніж вказано в лімітах на рівні podʼа, забезпечуючи, що вони не можуть перевищити загальну суму 200 MiB памʼяті та 1 ядро CPU.

## Очищення {#clean-up}

Видаліть простір імен:

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів ЦП для Контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та обмежень ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
