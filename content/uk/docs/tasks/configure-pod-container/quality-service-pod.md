---
title: Налаштування якості обслуговування для Podʼів
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка показує, як налаштувати Podʼи так, щоб їм призначалися певні {{< glossary_tooltip text="класи якості обслуговування (QoS)" term_id="qos-class" >}}. Kubernetes використовує класи QoS, щоб ухвалювати рішення про виселення Podʼів, коли ресурсів вузла не вистачає.

Коли Kubernetes створює Pod, він призначає один з таких класів QoS для Podʼа:

* [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
* [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
* [BestEffort](/docs/concepts/workloads/pods/pod-qos/#besteffort)

{{< note >}}
Kubernetes призначає клас QoS під час створення Podʼа, і він залишається незмінним протягом усього терміну існування Podʼа. Якщо ви спробуєте [змінити розмір ресурсів Podʼа](/docs/tasks/configure-pod-container/resize-container-resources/) на значення, які призведуть до зміни класу QoS, панель управління відхилить ваш запит із повідомленням про помилку.
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Також вам потрібно мати можливість створювати та видаляти простори імен.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace qos-example
```

## Створення Podʼа, якому призначено клас QoS Guaranteed {#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed}

Щоб Podʼу було надано клас QoS `Guaranteed`:

* Кожен контейнер у Podʼі повинен мати обмеження памʼяті та запит памʼяті.
* Для кожного контейнера в Podʼі обмеження памʼяті повинно дорівнювати запиту памʼяті.
* Кожен контейнер у Podʼі повинен мати обмеження CPU та запит CPU.
* Для кожного контейнера в Podʼі обмеження CPU повинно дорівнювати запиту CPU.

Ці вимоги однаково стосуються init-контейнерів і контейнерів застосунків. [Ефемерні контейнери](/docs/concepts/workloads/pods/ephemeral-containers/) не можуть визначати ресурси, тому на них ці вимоги не поширюються.

Ось маніфест Podʼа з одним контейнером. Контейнер має обмеження памʼяті та запит памʼяті, обидва дорівнюють 200 MiB. Контейнер має обмеження CPU та запит CPU, обидва дорівнюють 700 milliCPU:

{{% code_sample file="pods/qos/qos-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS `Guaranteed`. Вивід також підтверджує, що контейнер Podʼа має запит памʼяті, який дорівнює його обмеженню памʼяті, і запит CPU, який дорівнює його обмеженню CPU.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    ...
status:
  qosClass: Guaranteed
```

{{< note >}}
Якщо контейнер вказує власне обмеження памʼяті, але не вказує запит памʼяті, Kubernetes автоматично призначає запит памʼяті, що дорівнює обмеженню. Так само, якщо контейнер вказує власне обмеження CPU, але не вказує запит CPU, Kubernetes автоматично призначає запит CPU, що дорівнює обмеженню.
{{< /note >}}

<!-- 4th level heading to suppress entry in nav -->
#### Очищення {#clean-up-guaranteed}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Створення Podʼа, якому призначено клас QoS Burstable {#create-a-pod-that-gets-assigned-a-qos-class-of-burstable}

Podʼу надається клас QoS `Burstable`, якщо:

* Pod не відповідає критеріям для класу QoS `Guaranteed`.
* Щонайменше один контейнер у Podʼі має запит або обмеження памʼяті чи CPU.

Ось маніфест Podʼа з одним контейнером. Контейнер має обмеження памʼяті 200 MiB і запит памʼяті 100 MiB.

{{% code_sample file="pods/qos/qos-pod-2.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS `Burstable`:

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

<!-- 4th level heading to suppress entry in nav -->
#### Очищення {#clean-up-burstable}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Створення Podʼа, якому призначено клас QoS BestEffort {#create-a-pod-that-gets-assigned-a-qos-class-of-besteffort}

Щоб Podʼу було призначено клас QoS `BestEffort`, контейнери в Podʼі не повинні мати жодних обмежень чи запитів памʼяті або CPU.

Ось маніфест Podʼа з одним контейнером. Контейнер не має обмежень чи запитів памʼяті або CPU:

{{% code_sample file="pods/qos/qos-pod-3.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS `BestEffort`:

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

<!-- 4th level heading to suppress entry in nav -->
#### Очищення {#clean-up-besteffort}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Створення Podʼа з двома контейнерами {#create-a-pod-that-has-two-containers}

Ось маніфест Podʼа з двома контейнерами. Один контейнер вказує запит памʼяті 200 MiB. Інший контейнер не вказує жодних запитів чи обмежень.

{{% code_sample file="pods/qos/qos-pod-4.yaml" %}}

Зверніть увагу, що цей Pod відповідає критеріям класу QoS `Burstable`. Тобто, він не відповідає критеріям для класу QoS `Guaranteed`, і один з його контейнерів має запит памʼяті.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS `Burstable`:

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

## Отримання класу QoS Podʼа {#retrieve-the-qos-class-for-a-pod}

Замість того, щоб бачити всі поля, ви можете переглянути лише поле, яке вам потрібно:

```bash
kubectl --namespace=qos-example get pod qos-demo-4 -o jsonpath='{ .status.qosClass}{"\n"}'
```

```none
Burstable
```

## Очищення {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів і обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти Podʼа для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

* [Керування політиками керування топологією на вузлі](/docs/tasks/administer-cluster/topology-manager/)
