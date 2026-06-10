---
title: Використання перенаправлення портів для доступу до застосунків у кластері
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

Ця сторінка показує, як використовувати `kubectl port-forward` для підключення до сервера MongoDB, який працює у кластері Kubernetes. Такий тип підключення може бути корисним для налагодження бази даних.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Встановіть [MongoDB Shell](https://www.mongodb.com/try/download/shell).

<!-- steps -->

## Створення розгортання та сервісу MongoDB

1. Створіть Deployment, що запускає MongoDB:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   Вивід успішної команди підтверджує, що Deployment створено:

   ```none
   deployment.apps/mongo created
   ```

   Перегляньте стан Podʼа, щоб переконатися, що він готовий:

   ```shell
   kubectl get pods
   ```

   Вивід відображає показує Pod:

   ```none
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   Перегляньте стан Deployment:

   ```shell
   kubectl get deployment
   ```

   Вивід відображає, що Deployment було створено:

   ```none
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   Deployment автоматично керує ReplicaSet. Перегляньте стан ReplicaSet, використовуючи:

   ```shell
   kubectl get replicaset
   ```

   Вивід показує, що ReplicaSet був створений:

   ```none
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. Створіть Service для доступу до MongoDB в мережі:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   Вивід успішної команди підтверджує, що Service був створений:

   ```none
   service/mongo created
   ```

   Перевірте створений Service:

   ```shell
   kubectl get service mongo
   ```

   Вивід показує створений Service:

   ```none
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. Переконайтеся, що сервер MongoDB працює у Pod та слухає на порту 27017:

   ```shell
   # Замініть mongo-75f59d57f4-4nd6q на імʼя Pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   Вивід показує порт для MongoDB у цьому Pod:

   ```none
   27017
   ```

   27017 є офіційним TCP портом для MongoDB.

## Перенаправлення локального порту на порт Pod {#forward-a-local-port-to-a-port-on-the-pod}

1. `kubectl port-forward` дозволяє використовувати імʼя ресурсу, такого як імʼя Podʼа, для вибору відповідного Podʼа для перенаправлення портів.

   ```shell
   # Замініть mongo-75f59d57f4-4nd6q на імʼя Pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   що те саме, що і

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   або

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   або

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   або

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   Будь-яка з наведених вище команд працює. Вивід схожий на це:

   ```none
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` не повертає інформацію. Щоб продовжити вправи, вам потрібно буде відкрити інший термінал.
   {{< /note >}}

2. Запустіть інтерфейс командного рядка MongoDB:

   ```shell
   mongosh --port 28015
   ```

3. На командному рядку MongoDB введіть команду `ping`:

   ```none
   db.runCommand( { ping: 1 } )
   ```

   Успішний запит ping повертає:

   ```none
   { ok: 1 }
   ```

### Дозвольте _kubectl_ вибрати локальний порт {#let-kubectl-choose-local-port}

Якщо вам не потрібен конкретний локальний порт, ви можете дозволити `kubectl` вибрати та призначити локальний порт і таким чином позбавити себе від необхідності керувати конфліктами локальних портів, з дещо простішим синтаксисом:

```shell
kubectl port-forward deployment/mongo :27017
```

Інструмент `kubectl` знаходить номер локального порту, який не використовується (уникаючи низьких номерів портів, оскільки вони можуть використовуватися іншими застосунками). Вивід схожий на:

```none
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## Обговорення {#discussion}

Підключення до локального порту 28015 пересилаються на порт 27017 Podʼа, який запускає сервер MongoDB. З цим підключенням ви можете використовувати свій локальний робочий компʼютер для налагодження бази даних, яка працює у Pod.

{{< note >}}
`kubectl port-forward` реалізовано тільки для TCP портів. Підтримка UDP протоколу відстежується у [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
