---
title: Використання каскадного видалення у кластері
content_type: task
weight: 360
---

<!--overview-->

Ця сторінка показує, як вказати тип [каскадного видалення](/docs/concepts/architecture/garbage-collection/#cascading-deletion), який використовується у вашому кластері під час {{<glossary_tooltip text="збору сміття" term_id="garbage-collection">}}.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам також потрібно [створити приклад Deployment](/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment), щоб експериментувати з різними типами каскадного видалення. Вам доведеться створити Deployment заново для кожного типу.

## Перевірка посилань на власника у ваших Podʼах {#check-owner-references-on-your-pods}

Перевірте, що поле `ownerReferences` присутнє у ваших Podʼах:

```shell 
kubectl get pods -l app=nginx --output=yaml
```

Вивід має поле `ownerReferences`, схоже на це:

```yaml
apiVersion: v1
    ...
    ownerReferences:
    - apiVersion: apps/v1
      blockOwnerDeletion: true
      controller: true
      kind: ReplicaSet
      name: nginx-deployment-6b474476c4
      uid: 4fdcd81c-bd5d-41f7-97af-3a3b759af9a7
    ...
```

## Використання каскадного видалення на передньому плані {#use-foreground-cascading-deletion}

Стандартно Kubernetes використовує [каскадне видалення у фоні](/docs/concepts/architecture/garbage-collection/#background-deletion) для видалення залежних обʼєктів. Ви можете перейти на каскадне видалення на передньому плані за допомогою `kubectl` або API Kubernetes, залежно від версії Kubernetes вашого кластера. {{< version-check >}}

Ви можете видаляти обʼєкти за допомогою каскадного видалення на передньому плані, використовуючи `kubectl` або API Kubernetes.

**За допомогою kubectl**

Виконайте таку команду:
<!--TODO: verify release after which the --cascade flag is switched to a string in https://github.com/kubernetes/kubectl/commit/fd930e3995957b0093ecc4b9fd8b0525d94d3b4e-->

```shell
kubectl delete deployment nginx-deployment --cascade=foreground
```

**За допомогою API Kubernetes**

1. Запустіть локальний проксі:

   ```shell
   kubectl proxy --port=8080
   ```

1. Використовуйте `curl` для виклику видалення:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
       -H "Content-Type: application/json"
   ```

   Вивід містить {{<glossary_tooltip text="завершувач" term_id="finalizer">}} `foregroundDeletion`, подібно до цього:

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "metadata": {
       "name": "nginx-deployment",
       "namespace": "default",
       "uid": "d1ce1b02-cae8-4288-8a53-30e84d8fa505",
       "resourceVersion": "1363097",
       "creationTimestamp": "2021-07-08T20:24:37Z",
       "deletionTimestamp": "2021-07-08T20:27:39Z",
       "finalizers": [
         "foregroundDeletion"
       ]
       ...
   ```

## Використання каскадного видалення у фоні {#use-background-cascading-deletion}

1. [Створіть приклад Deployment](/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment).
1. Використовуйте або `kubectl`, або API Kubernetes для видалення Deployment, залежно від версії Kubernetes вашого кластера. {{<version-check>}}

Ви можете видаляти обʼєкти за допомогою каскадного видалення у фоні, використовуючи `kubectl` або API Kubernetes.

Kubernetes стандартно використовує каскадне видалення у фоні, і робить це навіть якщо ви виконуєте наведені нижче команди без прапорця `--cascade` або аргументу `propagationPolicy`.

**За допомогою kubectl**

Виконайте таку команду:

```shell
kubectl delete deployment nginx-deployment --cascade=background
```

**За допомогою API Kubernetes**

1. Запустіть локальний проксі:

   ```shell
   kubectl proxy --port=8080
   ```

1. Використовуйте `curl` для виклику видалення:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
       -H "Content-Type: application/json"
   ```

   Вивід подібний до цього:

   ```
   "kind": "Status",
   "apiVersion": "v1",
   ...
   "status": "Success",
   "details": {
       "name": "nginx-deployment",
       "group": "apps",
       "kind": "deployments",
       "uid": "cc9eefb9-2d49-4445-b1c1-d261c9396456"
   }
   ```

## Видалення обʼєктів-власників і залишення залежних обʼєктів {#set-orphan-deletion-policy}

Стандартно, коли ви вказуєте Kubernetes видалити обʼєкт, {{< glossary_tooltip text="контролер" term_id="controller" >}} також видаляє залежні обʼєкти. Ви можете змусити Kubernetes *залишити* ці залежні обʼєкти, використовуючи `kubectl` або API Kubernetes, залежно від версії Kubernetes вашого кластера. {{< version-check >}}
{{< version-check >}}

**За допомогою kubectl**

Виконайте таку команду:

```shell
kubectl delete deployment nginx-deployment --cascade=orphan
```

**За допомогою API Kubernetes**

1. Запустіть локальний проксі:

   ```shell
   kubectl proxy --port=8080
   ```

1. Використовуйте `curl` для виклику видалення:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
       -H "Content-Type: application/json"
   ```

   Вивід містить `orphan` у полі `finalizers`, подібно до цього:

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "namespace": "default",
   "uid": "6f577034-42a0-479d-be21-78018c466f1f",
   "creationTimestamp": "2021-07-09T16:46:37Z",
   "deletionTimestamp": "2021-07-09T16:47:08Z",
   "deletionGracePeriodSeconds": 0,
   "finalizers": [
     "orphan"
   ],
   ...
   ```

Ви можете перевірити, що Podʼи, керовані Deployment, все ще працюють:

```shell
kubectl get pods -l app=nginx
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся про [власників та залежності](/docs/concepts/overview/working-with-objects/owners-dependents/) у Kubernetes.
* Дізнайтеся про [завершувачі](/docs/concepts/overview/working-with-objects/finalizers/) в Kubernetes.
* Дізнайтеся про [збір сміття](/docs/concepts/architecture/garbage-collection/).
