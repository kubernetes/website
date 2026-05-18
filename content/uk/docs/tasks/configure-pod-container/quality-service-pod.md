---
title: Налаштування якості обслуговування для Podʼів
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка показує, як налаштувати Podʼи так, щоб їм були призначені певні {{< glossary_tooltip text="класи якості обслуговування (QoS)" term_id="qos-class" >}}. Kubernetes використовує класи QoS для прийняття рішень про видалення Podʼів, коли використання ресурсів вузла збільшується.

Коли Kubernetes створює Pod, він призначає один з таких класів QoS для Podʼа:

* [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
* [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
* [BestEffort](/docs/concepts/workloads/pods/pod-qos/#besteffort)

{{< note >}}
Kubernetes призначає клас QoS під час створення Podʼа, і він залишається незмінним протягом усього терміну існування Podʼа. Якщо ви спробуєте [змінити розмір ресурсів Podʼа](/docs/tasks/configure-pod-container/resize-container-resources/) на значення, які призведуть до зміни класу QoS, панель управління відхилить ваш запит із повідомленням про помилку.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Також вам потрібно мати можливість створювати та видаляти простори імен.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace qos-example
```

## Створення Podʼа, якому призначено клас QoS Guaranteed {#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed}

Щоб Podʼа був наданий клас QoS Guaranteed:

* Кожний контейнер у Pod повинен мати ліміт памʼяті та запит памʼяті.
* Для кожного контейнера у Pod ліміт памʼяті повинен дорівнювати запиту памʼяті.
* Кожний контейнер у Pod повинен мати ліміт CPU та запит CPU.
* Для кожного контейнера у Pod ліміт CPU повинен дорівнювати запиту CPU.

Ці обмеження так само застосовуються до контейнерів ініціалізації і до контейнерів застосунків. [Ефемерні контейнери](/docs/concepts/workloads/pods/ephemeral-containers/) не можуть визначати ресурси, тому ці обмеження не застосовуються до них.

Нижче подано маніфест для Podʼа з одним контейнером. Контейнер має ліміт памʼяті та запит памʼяті, обидва дорівнюють 200 MiB. Контейнер має ліміт CPU та запит CPU, обидва дорівнюють 700 міліCPU:

{{% code_sample file="pods/qos/qos-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS `Guaranteed`. Також вивід підтверджує, що у контейнера Podʼа є запит памʼяті, який відповідає його ліміту памʼяті, і є запит CPU, який відповідає його ліміту CPU.

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
Якщо контейнер вказує свій власний ліміт памʼяті, але не вказує запит памʼяті, Kubernetes автоматично призначає запит памʼяті, який відповідає ліміту. Так само, якщо контейнер вказує свій власний ліміт CPU, але не вказує запит CPU, Kubernetes автоматично призначає запит CPU, який відповідає ліміту.
{{< /note >}}

#### Очищення {#clean-up-guaranteed}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Створення Podʼа, якому призначено клас QoS Burstable {#create-a-pod-that-gets-assigned-a-qos-class-of-burstable}

Podʼу надається клас QoS Burstable, якщо:

* Pod не відповідає критеріям для класу QoS `Guaranteed`.
* Принаймні один контейнер у Podʼі має запит або ліміт памʼяті або CPU.

Нижче подано маніфест для Podʼа з одним контейнером. Контейнер має ліміт памʼяті 200 MiB
та запит памʼяті 100 MiB.

{{% code_sample file="pods/qos/qos-pod-2.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼу клас QoS Burstable:

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

#### Очищення {#clean-up-burstable}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Створення Podʼа, якому призначено клас QoS BestEffort {#create-a-pod-that-gets-assigned-a-qos-class-of-besteffort}

Для того, щоб Podʼу був призначений клас QoS `BestEffort`, контейнери у Podʼі не повинні мати жодних лімітів або запитів памʼяті чи CPU.

Нижче подано маніфест для Podʼа з одним контейнером. контейнер не має лімітів або запитів памʼяті чи CPU:

{{% code_sample file="pods/qos/qos-pod-3.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

Вивід показує, що Kubernetes призначив Podʼа клас QoS BestEffort:

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

#### Очищення {#clean-up-besteffort}

Видаліть свій Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Створення Podʼа з двома контейнерами {#create-a-pod-that-has-two-containers}

Нижче подано маніфест для Podʼа з двома контейнерами. Один контейнер вказує запит памʼяті 200 MiB. Інший контейнер не вказує жодних запитів або лімітів.

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

## {{% heading "whatsnext" %}}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних лімітів CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти Podʼа для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

* [Керування політиками управління топологією на вузлі](/docs/tasks/administer-cluster/topology-manager/)
