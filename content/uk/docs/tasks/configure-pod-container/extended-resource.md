---
title: Призначення розширених ресурсів контейнеру
content_type: task
weight: 70
---

<!-- overview -->

{{< feature-state state="stable" >}}

Ця сторінка показує, як призначити розширені ресурси контейнеру.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Перш ніж виконувати цю вправу, виконайте вправу [Оголошення розширених ресурсів для вузла](/docs/tasks/administer-cluster/extended-resource-node/). Це налаштує один з ваших вузлів на оголошення ресурсу dongle.

<!-- steps -->

## Призначення розширеного ресурсу Podʼу {#assign-an-extended-resource-to-a-pod}

Щоб запитати розширений ресурс, включіть поле `resources.requests.<resource_name>` у ваш маніфест контейнера. Розширені ресурси повністю кваліфікуються будь-яким доменом поза `*.kubernetes.io/`. Дійсні імена розширених ресурсів мають форму `example.com/foo`, де `example.com` замінено на домен вашої організації, а `foo` — це описове імʼя ресурсу.

Ось файл конфігурації Podʼа з одним контейнером:

{{% code_sample file="pods/resource/extended-resource-pod.yaml" %}}

У файлі конфігурації видно, що контейнер запитує 3 ресурси dongle.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

Перевірте, що Pod працює:

```shell
kubectl get pod extended-resource-demo
```

Перегляньте опис Podʼа:

```shell
kubectl describe pod extended-resource-demo
```

Вивід показує запити dongle:

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## Спроба створення другого Podʼа {#attempt-to-create-a-second-pod}

Ось файл конфігурації Podʼа з одним контейнером. Контейнер запитує два ресурси dongle.

{{% code_sample file="pods/resource/extended-resource-pod-2.yaml" %}}

Kubernetes не зможе задовольнити запит на два dongle, оскільки перший Pod використав три з чотирьох доступних dongle.

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

Перегляньте опис Podʼа:

```shell
kubectl describe pod extended-resource-demo-2
```

Вивід показує, що Pod не можна запланувати, оскільки немає вузла з 2 доступними dongle:


```
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

Вивід показує, що Pod створено, але не заплановано на вузол. Він має статус Pending:

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## Очищення {#clean-up}

Видаліть Podʼи, які ви створили для цієї вправи:

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```

## Розширені ресурси, що забезпечуються DRA {#extended-resources-backed-by-dra}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

Вправа вище використовує розширений ресурс, який оголошує вузол. Розширені ресурси також можуть забезпечуватися {{< glossary_tooltip text="динамічним розподілом ресурсів" term_id="dra" >}} (DRA): DeviceClass встановлює `extendedResourceName`, і планувальник задовольняє відповідні запити розширених ресурсів пристроями DRA замість місткості, оголошеної вузлом.

Pod запитує ресурс однаково в обох випадках — через `resources.requests.<resource_name>`, — тож робочому навантаженню не потрібно знати, чи надає його втулок пристрою, чи DRA. Те саме імʼя ресурсу може навіть надаватися втулком пристрою на одних вузлах і DRA на інших.

Налаштування DeviceClass і приклади дивіться в розділі [Розподіл розширених ресурсів за допомогою DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#extended-resource).

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Оголошення розширених ресурсів для вузла](/docs/tasks/administer-cluster/extended-resource-node/)
