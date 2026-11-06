---
title: Налаштування стандартних запитів та обмежень памʼяті для простору імен
content_type: task
weight: 10
description: >-
  Визначте стандартне обмеження ресурсів памʼяті для простору імен, щоб кожен новий Pod у цьому просторі імен мав налаштоване обмеження ресурсів памʼяті.
---

<!-- overview -->

Ця сторінка показує, як налаштувати стандартні запити та обмеження памʼяті для {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

Кластер Kubernetes може бути розділений на простори імен. Якщо у вас є простір імен, який має стандартне [обмеження](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) памʼяті, і ви спробуєте створити Pod з контейнером, який не вказує власне обмеження памʼяті, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} призначить цьому контейнеру стандартне обмеження памʼяті.

Kubernetes призначає стандартний запит памʼяті за певних умов, які пояснено далі в цій темі.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

У вас має бути доступ для створення просторів імен у вашому кластері.

Кожен вузол у вашому кластері повинен мати принаймні 2 GiB памʼяті.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace default-mem-example
```

## Створення LimitRange та Podʼа {#create-a-limitrange-and-a-pod}

Ось маніфест для прикладу {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}. Маніфест вказує стандартний запит памʼяті та стандартне обмеження памʼяті.

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

Створіть LimitRange у просторі імен default-mem-example:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

Тепер, якщо ви створите Pod у просторі імен default-mem-example, і будь-який контейнер у цьому Podʼі не вкаже власних значень для запиту та обмеження памʼяті, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} застосує стандартні значення: запит памʼяті 256MiB та обмеження памʼяті 512MiB.

Ось приклад маніфесту для Podʼа з одним контейнером. Контейнер не вказує запит і обмеження памʼяті.

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

Створіть Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Перегляньте докладну інформацію про Pod:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

Вивід показує, що контейнер Podʼа має запит памʼяті 256 MiB та обмеження памʼяті 512 MiB. Це стандартні значення, вказані в LimitRange.

```shell
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
kubectl delete pod default-mem-demo --namespace=default-mem-example
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

Вивід показує, що запит памʼяті контейнера встановлено таким, що відповідає його обмеженню памʼяті. Зверніть увагу, що контейнеру не було призначено стандартне значення запиту памʼяті 256Mi.

```
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

Вивід показує, що запит памʼяті контейнера встановлено на значення, вказане в маніфесті контейнера. Контейнер може використовувати не більше 512MiB памʼяті, що відповідає стандартному обмеженню памʼяті для простору імен.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

`LimitRange` **не** перевіряє узгодженість стандартних значень, які він застосовує. Це означає, що стандартне значення _обмеження_, встановлене `LimitRange`, може бути меншим за значення _запиту_, вказане для контейнера в специфікації, яку клієнт надсилає до API-сервера. Якщо це станеться, остаточний Pod не можна буде запланувати. Докладніше див. [Вимоги до обмежень і запитів ресурсів](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests).

{{< /note >}}

## Мотивація для стандартних обмежень та запитів памʼяті {#motivation-for-default-memory-limits-and-requests}

Якщо у вашому просторі імен налаштовано {{< glossary_tooltip text="квоту ресурсів" term_id="resource-quota" >}} памʼяті, корисно мати стандартне значення для обмеження памʼяті. Ось три обмеження, які квота ресурсів накладає на простір імен:

* Для кожного Podʼа, який працює у просторі імен, Pod та кожен з його контейнерів повинні мати обмеження памʼяті. (Якщо ви вказуєте обмеження памʼяті для кожного контейнера у Podʼі, Kubernetes може вивести обмеження памʼяті на рівні Podʼа, додавши обмеження його контейнерів).
* Обмеження памʼяті резервує ресурси на вузлі, на який заплановано відповідний Pod. Загальна кількість памʼяті, зарезервована для всіх Podʼів у просторі імен, не повинна перевищувати вказаного обмеження.
* Загальна кількість памʼяті, що фактично використовується всіма Podʼами у просторі імен, також не повинна перевищувати вказаного обмеження.

Коли ви додаєте LimitRange:

Якщо будь-який Pod у цьому просторі імен, що містить контейнер, не вказує власне обмеження памʼяті, панель управління застосовує до цього контейнера стандартне обмеження памʼяті, і Podʼу може бути дозволено працювати в просторі імен, обмеженому квотою ResourceQuota для памʼяті.

## Очищення {#clean-up}

Видаліть простір імен:

```shell
kubectl delete namespace default-mem-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти Podʼів для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
