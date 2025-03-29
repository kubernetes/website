---
title: Налаштування типових запитів та обмежень памʼяті для простору імен
content_type: task
weight: 10
description: >-
  Визначте типове обмеження ресурсів памʼяті для простору імен, щоб кожний новий Контейнер у цьому просторі імен мав налаштоване обмеження ресурсів памʼяті.
---

<!-- overview -->

Ця сторінка показує, як налаштувати типові запити та обмеження памʼяті для {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

Кластер Kubernetes може бути розділений на простори імен. Якщо у вас є простір імен, в якому вже є типове обмеження памʼяті [limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits), і ви спробуєте створити Pod з контейнером, який не вказує своє власне обмеження памʼяті, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} назначає типове обмеження памʼяті цьому контейнеру.

Kubernetes назначає типовий запит памʼяті за певних умов, які будуть пояснені пізніше в цій темі.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

У вас має бути доступ до створення просторів імен у вашому кластері.

Кожен вузол у вашому кластері повинен мати принаймні 2 ГіБ памʼяті.

<!-- steps -->

## Створення простору імен {#create-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace default-mem-example
```

## Створення LimitRange та Pod {#create-limitrange-pod}

Ось маніфест для прикладу {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}. Маніфест вказує типовий запит памʼяті та типове обмеження памʼяті.

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

Створіть LimitRange у просторі імен default-mem-example:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

Тепер, якщо ви створите Pod у просторі імен default-mem-example, і будь-який контейнер у цьому Podʼі не вказує свої власні значення для запиту та обмеження памʼяті, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} застосовує типові значення: запит памʼяті 256MiB та обмеження памʼяті 512MiB.

Ось приклад маніфесту для Pod, який має один контейнер. Контейнер не вказує запиту та обмеження памʼяті.

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

Створіть цей Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Перегляньте інформацію про цей Pod:

```shell
kubectl get pod memory-defaults-pod --namespace=default-mem-example
```

Вивід має показати, що контейнер Podʼа має обмеження на запит памʼяті 256MiB та обмеження памʼяті 512MiB. Ці значення були назначені через типові обмеження памʼяті, вказані в LimitRange.

```yaml
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-defaults-pod --namespace=default-mem-example
```

## Що якщо ви вказуєте обмеження контейнера, але не його запит? {#what-if-you-specify-a-container-s-limit-but-not-its-request}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує обмеження памʼяті, але не запит:

{{% code_sample file="admin/resource/memory-defaults-pod-2.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

Вивід показує, що запит памʼяті контейнера встановлено таким чином, щоб відповідати його обмеженню памʼяті. Зверніть увагу, що контейнеру не було назначено типового значення запиту памʼяті 256Mi.

```yaml
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## Що якщо ви вказуєте запит контейнера, але не його обмеження? {#what-if-you-specify-a-container-s-request-but-not-its-limit}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує запит памʼяті, але не обмеження:

{{% code_sample file="admin/resource/memory-defaults-pod-3.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

Перегляньте специфікацію Podʼа:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

Вивід показує, що запит памʼяті контейнера встановлено на значення, вказане в маніфесті контейнера. Контейнер обмежений використовувати не більше 512MiB памʼяті, що відповідає типовому обмеженню памʼяті для простору імен.

```yaml
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

`LimitRange` **не** перевіряє відповідність типових значень, які він застосовує. Це означає, що типове значення для _обмеження_, встановлене за допомогою `LimitRange`, може бути меншим за значення _запиту_, вказане для контейнера в специфікації, яку клієнт подає на сервер API. Якщо це станеться, остаточний Pod не буде можливим для розміщення. Дивіться [Обмеження на ресурси лімітів та запитів](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests) для отримання додаткової інформації.

{{< /note >}}

## Мотивація для типових обмежень та запитів памʼяті {#motivation-for-default-memory-limits-and-requests}

Якщо у вашому просторі імен налаштовано квоту ресурсів памʼяті, корисно мати типове значення для обмеження памʼяті. Ось три обмеження, які накладає квота ресурсів на простір імен:

* Для кожного Podʼа, який працює у просторі імен, Pod та кожен з його контейнерів повинні мати обмеження памʼяті. (Якщо ви вказуєте обмеження памʼяті для кожного контейнера у Podʼі, Kubernetes може вивести типове обмеження памʼяті на рівні Podʼа, додавши обмеження для його контейнерів).
* Обмеження памʼяті застосовує резервування ресурсів на вузлі, де запускається відповідний Pod. Загальна кількість памʼяті, зарезервована для всіх Podʼів у просторі імен, не повинна перевищувати вказаного обмеження.
* Загальна кількість памʼяті, що фактично використовується всіма Podʼами у просторі імен, також не повинна перевищувати вказаного обмеження.

Коли ви додаєте обмеження (LimitRange):

Якщо будь-який Pod у цьому просторі імен, що містить контейнер, не вказує своє власне обмеження памʼяті, панель управління застосовує типове обмеження памʼяті для цього контейнера, і Podʼу може бути дозволено запуститися в просторі імен, який обмежено квотою ресурсів памʼяті.

## Очищення {#clean-up}

Видаліть простір імен:

```shell
kubectl delete namespace default-mem-example
```

## {{% heading "whatsnext" %}}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування типових запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти для Podʼів у просторі імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-application-developers}

* [Призначення ресурсів памʼяті для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU для контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштувати якість обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
