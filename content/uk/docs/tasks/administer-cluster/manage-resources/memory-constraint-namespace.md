---
title: Налаштування мінімальних та максимальних обмежень памʼяті для простору імен
content_type: task
weight: 30
description: >-
  Визначте діапазон дійсних обмежень ресурсів памʼяті для простору імен, так щоб кожний новий Pod у цьому просторі імен знаходився в межах встановленого вами діапазону.
---

<!-- overview -->

Ця сторінка показує, як встановити мінімальні та максимальні значення для памʼяті, яку використовують контейнери, що працюють у {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. Мінімальні та максимальні значення памʼяті ви вказуєте у
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/) обʼєкті. Якщо Pod не відповідає обмеженням, накладеним LimitRange, його неможливо створити в просторі імен.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

У вас повинен бути доступ до створення просторів імен у вашому кластері.

Кожен вузол у вашому кластері повинен мати щонайменше 1 GiB памʼяті для Podʼів.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цьому завданні, були відокремлені від решти вашого кластера.

```shell
kubectl create namespace constraints-mem-example
```

## Створення LimitRange та Podʼа {#create-a-limitrange-and-a-pod}

Ось приклад маніфесту для LimitRange:

{{% code_sample file="admin/resource/memory-constraints.yaml" %}}

Створіть LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

Перегляньте докладну інформацію про LimitRange:

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

Вивід показує мінімальні та максимальні обмеження памʼяті як очікувалося. Але зверніть увагу, що, навіть якщо ви не вказали типові значення в конфігураційному файлі для LimitRange, вони були створені автоматично.

```yaml
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

Тепер кожного разу, коли ви визначаєте Pod у просторі імен constraints-mem-example, Kubernetes
виконує такі кроки:

* Якщо будь-який контейнер в цьому Podʼі не вказує свій власний запит памʼяті та обмеження, панель управління надає типовий запит та обмеження памʼяті цьому контейнеру.

* Перевірте, що кожний контейнер у цьому Podʼі запитує принаймні 500 MiB памʼяті.

* Перевірте, що кожний контейнер у цьому Podʼі запитує не більше 1024 MiB (1 GiB) памʼяті.

Ось маніфест для Podʼа з одним контейнером. У специфікації Podʼа, єдиний контейнер вказує запит памʼяті 600 MiB та обмеження памʼяті 800 MiB. Ці значення задовольняють мінімальні та максимальні обмеження памʼяті, накладені LimitRange.

{{% code_sample file="admin/resource/memory-constraints-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

Перевірте, що Pod працює і його контейнер є справним:

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

Вивід показує, що контейнер у цьому Podʼі має запит памʼяті 600 MiB та обмеження памʼяті 800 MiB. Ці значення задовольняють обмеження, накладені LimitRange на цей простір імен:

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

Видаліть свій Pod:

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## Спроба створення Podʼа, який перевищує максимальне обмеження памʼяті {#attempt-to-create-a-pod-that-exceeds-the-maximum-memory-constraint}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує запит памʼяті 800 MiB та обмеження памʼяті 1.5 GiB.

{{% code_sample file="admin/resource/memory-constraints-pod-2.yaml" %}}

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

Вивід показує, що Pod не було створено, оскільки він визначає контейнер, який запитує більше памʼяті, ніж дозволяється:

```none
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## Спроба створення Podʼа, який не відповідає мінімальному запиту памʼяті {#attempt-to-create-a-pod-that-does-not-meet-the-minimum-memory-request}

Ось маніфест для Podʼа з одним контейнером. Цей контейнер вказує запит памʼяті 100 MiB та обмеження памʼяті 800 MiB.

{{% code_sample file="admin/resource/memory-constraints-pod-3.yaml" %}}

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

Вивід показує, що Pod не було створено, оскільки він визначає контейнер який запитує менше памʼяті, ніж вимагається:

```none
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## Створення Podʼа, який не вказує жодного запиту памʼяті чи обмеження {#create-a-pod-that-does-not-specify-any-memory-request-or-limit}

Ось маніфест для Podʼа з одним контейнером. Контейнер не вказує запиту памʼяті, і він не вказує обмеження памʼяті.

{{% code_sample file="admin/resource/memory-constraints-pod-4.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

Вивід показує, що єдиний контейнер у цьому Podʼі має запит памʼяті 1 GiB та обмеження памʼяті 1 GiB. Як цей контейнер отримав ці значення?

```yaml
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

Тому що ваш Pod не визначає жодного запиту памʼяті та обмеження для цього контейнера, кластер
застосував [типовий запит памʼяті та обмеження](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) з LimitRange.

Це означає, що визначення цього Podʼа показує ці значення. Ви можете перевірити це за допомогою `kubectl describe`:

```shell
# Подивіться розділ "Requests:" виводу
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

На цей момент ваш Pod може працювати або не працювати. Памʼятайте, що передумовою для цього завдання є те, що ваші вузли мають щонайменше 1 GiB памʼяті. Якщо кожен з ваших вузлів має лише 1 GiB памʼяті, тоді недостатньо виділеної памʼяті на будь-якому вузлі для обслуговування запиту памʼяті 1 GiB. Якщо ви використовуєте вузли з 2 GiB памʼяті, то, ймовірно, у вас достатньо місця для розміщення запиту 1 GiB.

Видаліть свій Pod:

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## Застосування мінімальних та максимальних обмежень памʼяті {#enforcment-of-minimum-and-maximum-memory-constraints}

Максимальні та мінімальні обмеження памʼяті, накладені на простір імен LimitRange, діють тільки під час створення або оновлення Podʼа. Якщо ви змінюєте LimitRange, це не впливає на Podʼи, що були створені раніше.

{{< note >}}
При використанні [зміни розміру Podʼів на місці](/docs/tasks/configure-pod-container/resize-container-resources/), також застосовуються обмеження памʼяті. Якщо зміна розміру призведе до того, що значення памʼяті Podʼіа порушать обмеження LimitRange (перевищать максимальне або опустяться нижче мінімального), зміна розміру буде відхилена, а ресурси Podʼа залишаться на попередніх значеннях.
{{< /note >}}

## Причини для мінімальних та максимальних обмежень памʼяті {#motivation-for-minimum-and-maximum-memory-constraints}

Як адміністратор кластера, вам може знадобитися накладати обмеження на кількість памʼяті, яку можуть використовувати Podʼи. Наприклад:

* Кожен вузол у кластері має 2 GiB памʼяті. Ви не хочете приймати будь-який Pod, який запитує більше ніж 2 GiB памʼяті, оскільки жоден вузол у кластері не може підтримати запит.

* Кластер використовується як виробництвом, так і розробкою вашими відділами. Ви хочете дозволити навантаженням в експлуатації використовувати до 8 GiB памʼяті, але ви хочете обмежити навантаження в розробці до 512 MiB. Ви створюєте окремі простори імен для експлуатації та розробки і застосовуєте обмеження памʼяті для кожного простору імен.

## Прибирання {#clean-up}

Видаліть свій простір імен:

```shell
kubectl delete namespace constraints-mem-example
```

## {{% heading "whatsnext" %}}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштувати типові запити та обмеження памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштувати типові запити та обмеження CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштувати мінімальні та максимальні обмеження CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштувати квоти памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштувати квоту Podʼів для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштувати квоти для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-application-developers}

* [Призначити ресурси памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначити ресурси CPU контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштувати якість обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
