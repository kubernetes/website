---
title: Налаштування квоти Podʼів для простору імен
content_type: task
weight: 60
description: >
  Обмежте кількість Podʼів, які можна створити у просторі імен.
---

<!-- overview -->

На цій сторінці показано, як встановити квоту на загальну кількість Podʼів, які можуть працювати в {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. Ви вказуєте квоти в обʼєкті [ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен доступ до створення просторів імен у вашому кластері.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від інших частин вашого кластера.

```shell
kubectl create namespace quota-pod-example
```

## Створення ResourceQuota {#create-a-resourcequota}

Ось приклад маніфесту для ResourceQuota:

{{% code_sample file="admin/resource/quota-pod.yaml" %}}

Створіть ResourceQuota:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

Перегляньте детальну інформацію про ResourceQuota:

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

У виводі показано, що у просторі імен є квота на два Podʼи, і наразі немає Podʼів; іншими словами, жодна частина квоти не використовується.

```yaml
spec:
  hard:
    pods: "2"
status:
  hard:
    pods: "2"
  used:
    pods: "0"
```

Ось приклад маніфесту для {{< glossary_tooltip term_id="deployment" >}}:

{{% code_sample file="admin/resource/quota-pod-deployment.yaml" %}}

У цьому маніфесті `replicas: 3` повідомляє Kubernetes спробувати створити три нові Podʼи, які всі працюватимуть з одним і тим же застосунком.

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

Перегляньте детальну інформацію про Deployment:

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

У виводі показано, що навіть якщо Deployment вказує три репліки, було створено лише два Podʼи через раніше визначену вами квоту:

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2021-04-02T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

### Вибір ресурсу {#choice-of-resource}

У цьому завданні ви визначили ResourceQuota, яке обмежує загальну кількість Podʼів, але ви також можете обмежити загальну кількість інших видів обʼєктів. Наприклад, ви можете вирішити обмежити кількість {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}, які можуть існувати в одному просторі імен.

## Прибирання {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace quota-pod-example
```

## {{% heading "щодалі" %}}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-application-developers}

* [Надання ресурсів памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Надання ресурсів CPU контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштувати якість обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
