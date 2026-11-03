---
title: Налаштування квот для обʼєктів API
content_type: task
weight: 130
---

<!-- overview -->

Ця сторінка показує, як налаштувати квоти для обʼєктів API, зокрема PersistentVolumeClaim та Service. Квота обмежує кількість обʼєктів певного типу, які можуть бути створені в просторі імен. Ви вказуєте квоти в обʼєкті [ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були ізольовані від решти вашого кластера.

```shell
kubectl create namespace quota-object-example
```

## Створення ResourceQuota {#create-a-resourcequota}

Ось файл конфігурації для обʼєкта ResourceQuota:

{{% code_sample file="admin/resource/quota-objects.yaml" %}}

Створіть ResourceQuota:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

Перегляньте докладну інформацію про ResourceQuota:

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

У виводі показано, що в просторі імен quota-object-example може бути максимум один PersistentVolumeClaim, максимум два Service типу LoadBalancer і жодного Service типу NodePort.

```yaml
status:
  hard:
    persistentvolumeclaims: "1"
    services.loadbalancers: "2"
    services.nodeports: "0"
  used:
    persistentvolumeclaims: "0"
    services.loadbalancers: "0"
    services.nodeports: "0"
```

## Створення PersistentVolumeClaim {#create-a-persistentvolumeclaim}

Ось файл конфігурації для обʼєкта PersistentVolumeClaim:

{{% code_sample file="admin/resource/quota-objects-pvc.yaml" %}}

Створіть PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

Перевірте, що PersistentVolumeClaim було створено:

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

У виводі показано, що PersistentVolumeClaim існує і має статус Pending:

```
NAME             STATUS
pvc-quota-demo   Pending
```

## Спроба створити другий PersistentVolumeClaim {#attempt-to-create-a-second-persistentvolumeclaim}

Ось файл конфігурації для другого PersistentVolumeClaim:

{{% code_sample file="admin/resource/quota-objects-pvc-2.yaml" %}}

Спробуйте створити другий PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

У виводі показано, що другий PersistentVolumeClaim не було створено, оскільки це перевищило б квоту для простору імен.

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

## Примітки {#notes}

Ось рядки, які використовуються для ідентифікації ресурсів API, що можуть бути обмежені квотами:

<table>
<tr><th>Рядок</th><th>Обʼєкт API</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services"</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<tr><td>"services.nodeports"</td><td>Service типу NodePort</td></tr>
<tr><td>"services.loadbalancers"</td><td>Service типу LoadBalancer</td></tr>
</table>

## Очищення {#clean-up}

Видаліть свій простір імен:

```shell
kubectl delete namespace quota-object-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти Podʼів для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
