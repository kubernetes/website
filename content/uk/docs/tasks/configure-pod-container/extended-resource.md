---
title: Призначення розширених ресурсів контейнеру
content_type: task
weight: 70
---

<!-- overview -->

{{< feature-state state="stable" >}}

Ця сторінка показує, як призначити розширені ресурси контейнеру.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Перш ніж виконувати це завдання, виконайте завдання [Оголошення розширених ресурсів для вузла](/docs/tasks/administer-cluster/extended-resource-node/). Це налаштує один з ваших вузлів для оголошення ресурсу "dongle".

<!-- steps -->

## Призначте розширений ресурс Podʼу {#assign-an-extended-resource-to-a-pod}

Щоб запитати розширений ресурс, включіть поле `resources.requests.<resource_name>` у ваш маніфест контейнера. Розширені ресурси повністю кваліфікуються будь-яким доменом поза `*.kubernetes.io/`. Дійсні імена розширених ресурсів мають форму `example.com/foo`, де `example.com` замінено на домен вашої організації, а `foo` — це описове імʼя ресурсу.

Нижче подано конфігураційний файл для Podʼа з одним контейнером:

{{% code_sample file="pods/resource/extended-resource-pod.yaml" %}}

У конфігураційному файлі можна побачити, що контейнер запитує 3 розширених ресурси "dongle".

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

Перевірте, що Pod працює:

```shell
kubectl get pod extended-resource-demo
```

Опишіть Pod:

```shell
kubectl describe pod extended-resource-demo
```

Виведений текст показує запити донглів:

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## Спроба створення другого Podʼа {#attempt-to-create-a-second-pod}

Нижче наведено конфігураційний файл для Podʼа з одним контейнером. Контейнер запитує два розширені ресурси "dongle".

{{% code_sample file="pods/resource/extended-resource-pod-2.yaml" %}}

Kubernetes не зможе задовольнити запит на два донгли, оскільки перший Pod використав три з чотирьох доступних донглів.

Спроба створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

Опишіть Pod:

```shell
kubectl describe pod extended-resource-demo-2
```

Текст виводу показує, що Pod не може бути запланованим, оскільки немає вузла, на якому було б доступно 2 донгли:


```none
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

Перегляньте статус Podʼа:

```shell
kubectl get pod extended-resource-demo-2
```

Текст виводу показує, що Pod було створено, але не заплановано для виконання на вузлі. Він має статус Pending:

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## Очищення {#clean-up}

Видаліть Podʼи, які ви створили для цього завдання:

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```

## {{% heading "щодалі" %}}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Оголошення розширених ресурсів для вузла](/docs/tasks/administer-cluster/extended-resource-node/)
