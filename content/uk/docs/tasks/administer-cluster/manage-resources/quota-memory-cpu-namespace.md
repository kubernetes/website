---
title: Налаштування квот памʼяті та CPU для простору імен
content_type: task
weight: 50
description: >
  Визначте загальні обмеження памʼяті та CPU для всіх Podʼів, які працюють у просторі імен.
---

<!-- overview -->

На цій сторінці показано, як встановити квоти для загальної кількості памʼяті та CPU, які можуть бути використані всіма Podʼами, що працюють у {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. Ви вказуєте квоти в обʼєкті [ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен доступ до створення просторів імен у вашому кластері.

Кожен вузол у вашому кластері повинен мати принаймні 1 ГБ памʼяті.

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від інших частин вашого кластера.

```shell
kubectl create namespace quota-mem-cpu-example
```

## Створення ResourceQuota {#create-a-resourcequota}

Ось маніфест для прикладу ResourceQuota:

{{% code_sample file="admin/resource/quota-mem-cpu.yaml" %}}

Створіть ResourceQuota:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

Перегляньте детальну інформацію про ResourceQuota:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

ResourceQuota накладає такі вимоги на простір імен quota-mem-cpu-example:

* Для кожного Podʼа у просторі імен кожен контейнер повинен мати запит памʼяті, обмеження памʼяті, запит CPU та обмеження CPU.
* Загальний запит памʼяті для всіх Podʼів у цьому просторі імен не повинен перевищувати 1 ГБ.
* Загальне обмеження памʼяті для всіх Podʼів у цьому просторі імен не повинно перевищувати 2 ГБ.
* Загальний запит CPU для всіх Podʼів у цьому просторі імен не повинен перевищувати 1 CPU.
* Загальне обмеження CPU для всіх Podʼів у цьому просторі імен не повинно перевищувати 2 CPU.

Дивіться [значення CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu), щоб дізнатися, що має на увазі Kubernetes, коли говорить про "1 CPU".

## Створення Podʼа {#create-a-pod}

Ось маніфест для прикладу Podʼа:

{{% code_sample file="admin/resource/quota-mem-cpu-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

Перевірте, що Pod працює, і його (єдиний) контейнер є справним:

```shell
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

Знову перегляньте детальну інформацію про ResourceQuota:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

У виводі вказано квоту разом з тим, скільки з квоти було використано. Ви можете побачити, що запити памʼяті та CPU для вашого Podʼа не перевищують квоту.

```yaml
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

Якщо у вас є інструмент `jq`, ви також можете запитувати (використовуючи [JSONPath](/docs/reference/kubectl/jsonpath/)) лише значення `used`, **і** друкувати ці значення з приємним форматуванням. Наприклад:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example -o jsonpath='{ .status.used }' | jq .
```

## Спроба створити другий Pod {#attempt-to-create-a-second-pod}

Ось маніфест для другого Podʼа:

{{% code_sample file="admin/resource/quota-mem-cpu-pod-2.yaml" %}}

У маніфесті можна побачити, що Pod має запит памʼяті 700 MiB. Зверніть увагу, що сума використаного запиту памʼяті та цього нового запиту памʼяті перевищує квоту запиту памʼяті: 600 MiB + 700 MiB > 1 GiB.

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

Другий Pod не створюється. У виводі вказано, що створення другого Podʼа призведе до того, що загальний запит памʼяті перевищить квоту запиту памʼяті.

```none
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

## Обговорення {#discussion}

Як ви бачили у цьому завданні, ви можете використовувати ResourceQuota для обмеження загального запиту памʼяті для всіх Podʼів, що працюють у просторі імен. Ви також можете обмежити загальні суми для обмеження памʼяті, запиту CPU та обмеження CPU.

Замість керування загальним використанням ресурсів у просторі імен, ви, можливо, захочете обмежити окремі Podʼи або контейнери у цих Podʼах. Щоб досягти такого обмеження, використовуйте [LimitRange](/docs/concepts/policy/limit-range/).

{{< note >}}
При використанні [зміни розміру Podʼів на місці](/docs/tasks/configure-pod-container/resize-container-resources/) до змінених значень застосовується обмеження ResourceQuota. Якщо зміна розміру призведе до перевищення обмежень квоти простору імен, зміна розміру буде відхилена, а ресурси Podʼа залишаться без змін.
{{< /note >}}

## Прибирання {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace quota-mem-cpu-example
```

## {{% heading "whatsnext" %}}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування станадртних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування станадртних запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квоти Podʼів для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-application-developers}

* [Надання ресурсів памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Надання ресурсів CPU контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштувати якість обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
