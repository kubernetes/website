---
title: Налаштування стандартних запитів та обмежень CPU для простору імен
content_type: task
weight: 20
description: >-
  Визначте стандартне обмеження ресурсів CPU для простору імен, щоб кожен новий Pod у цьому просторі імен мав налаштоване обмеження ресурсів CPU.
---

<!-- overview -->

Ця сторінка показує, як налаштувати стандартні запити та обмеження CPU для {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

Кластер Kubernetes може бути розділений на простори імен. Якщо ви створюєте Pod у просторі імен, який має стандартне [обмеження](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) CPU, і будь-який контейнер у цьому Podʼі не вказує своє власне обмеження CPU, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} призначає цьому контейнеру стандартне обмеження CPU.

Kubernetes призначає стандартний [запит](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) CPU, але лише за певних умов, які пояснено далі на цій сторінці.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібно мати доступ для створення просторів імен у вашому кластері.

Якщо ви ще не знайомі з тим, що означає 1.0 CPU в Kubernetes, прочитайте [значення CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace default-cpu-example
```

## Створення LimitRange та Podʼа {#create-a-limitrange-and-a-pod}

Ось маніфест для прикладу {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}. У маніфесті вказано стандартний запит CPU та стандартне обмеження CPU.

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

Створіть LimitRange у просторі імен default-cpu-example:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

Тепер, якщо ви створите Pod у просторі імен default-cpu-example, і будь-який контейнер у цьому Podʼі не вкаже власних значень для запиту та обмеження CPU, то панель управління застосує стандартні значення: запит CPU 0.5 та стандартне обмеження CPU 1.

Ось маніфест для Podʼа з одним контейнером. Контейнер не вказує запит і обмеження CPU.

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

Створіть Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

Перегляньте специфікацію Podʼа:

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

Вивід показує, що єдиний контейнер Podʼа має запит CPU 500m `cpu` (що ви можете читати як “500 millicpu”) і обмеження CPU 1 `cpu`. Це стандартні значення, вказані в LimitRange.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

## Що якщо ви вказуєте обмеження контейнера, але не його запит? {#what-if-you-specify-a-container-s-limit-but-not-its-request}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує обмеження CPU, але не запит:

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

Перегляньте [специфікацію](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
Podʼа, який ви створили:

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

Вивід показує, що запит CPU контейнера встановлено таким, що відповідає його обмеженню CPU. Зверніть увагу, що контейнеру не було призначено стандартне значення запиту CPU 0.5 `cpu`:

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## Що якщо ви вказуєте запит контейнера, але не його обмеження? {#what-if-you-specify-a-container-s-request-but-not-its-limit}

Ось приклад маніфесту для Podʼа з одним контейнером. Контейнер вказує запит CPU, але не обмеження:

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

Перегляньте специфікацію Podʼа, який ви створили:

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

Вивід показує, що запит CPU контейнера встановлено на значення, яке ви вказали під час створення Podʼа (іншими словами: воно відповідає маніфесту). Однак обмеження CPU цього ж контейнера встановлено на 1 `cpu`, що є стандартним обмеженням CPU для цього простору імен.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## Мотивація для стандартних обмежень та запитів CPU {#motivation-for-default-cpu-limits-and-requests}

Якщо у вашому просторі імен налаштовано {{< glossary_tooltip text="квоту ресурсів" term_id="resource-quota" >}} CPU, корисно мати стандартне значення для обмеження CPU. Ось два обмеження, які квота ресурсів CPU накладає на простір імен:

* Для кожного Podʼа, який працює в просторі імен, кожен з його контейнерів повинен мати обмеження CPU.
* Обмеження CPU резервує ресурси на вузлі, на який заплановано відповідний Pod. Загальна кількість CPU, зарезервована для використання всіма Podʼами в просторі імен, не повинна перевищувати вказане обмеження.

Коли ви додаєте LimitRange:

Якщо будь-який Pod у цьому просторі імен, що містить контейнер, не вказує власне обмеження CPU, панель управління застосовує до цього контейнера стандартне обмеження CPU, і Pod може отримати дозвіл на запуск у просторі імен, обмеженому квотою ResourceQuota для CPU.

## Очищення {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace default-cpu-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

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
