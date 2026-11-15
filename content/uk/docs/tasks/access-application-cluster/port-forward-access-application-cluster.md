---
title: Використання перенаправлення портів для доступу до застосунків у кластері
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

На цій сторінці показано, як за допомогою `kubectl port-forward` підʼєднатися до сервера MongoDB, що працює в кластері Kubernetes. Таке підʼєднання може бути корисним для налагодження бази даних.

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Встановіть [MongoDB Shell](https://www.mongodb.com/try/download/shell).

<!-- steps -->

## Створення Deployment і Service для MongoDB {#creating-mongodb-deployment-and-service}

1. Створіть Deployment, що запускає MongoDB:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   Вивід успішної команди підтверджує, що Deployment створено:

   ```
   deployment.apps/mongo created
   ```

   Перегляньте статус Podʼа, щоб переконатися, що він готовий:

   ```shell
   kubectl get pods
   ```

   Вивід показує створений Pod:

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   Перегляньте статус Deployment:

   ```shell
   kubectl get deployment
   ```

   Вивід показує, що Deployment створено:

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   Deployment автоматично керує ReplicaSet. Перегляньте статус ReplicaSet за допомогою:

   ```shell
   kubectl get replicaset
   ```

   Вивід показує, що ReplicaSet створено:

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. Створіть Service, щоб відкрити доступ до MongoDB у мережі:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   Вивід успішної команди підтверджує, що Service створено:

   ```
   service/mongo created
   ```

   Перевірте створений Service:

   ```shell
   kubectl get service mongo
   ```

   Вивід показує створений Service:

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. Переконайтеся, що сервер MongoDB працює в Podʼі й слухає порт 27017:

   ```shell
   # Замініть mongo-75f59d57f4-4nd6q на назву Podʼа
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   Вивід показує порт MongoDB у цьому Podʼі:

   ```
   27017
   ```

   27017 — офіційний порт TCP для MongoDB.

## Перенаправлення локального порту на порт Podʼа {#forward-a-local-port-to-a-port-on-the-pod}

1. `kubectl port-forward` дозволяє використовувати назву ресурсу, наприклад назву Podʼа, щоб вибрати відповідний Pod для перенаправлення порту.

   ```shell
   # Замініть mongo-75f59d57f4-4nd6q на назву Podʼа
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   що те саме, що й

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

   Будь-яка з наведених вище команд працює. Вивід подібний до такого:

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` не завершується сам. Щоб продовжити вправи, потрібно відкрити інший термінал.
   {{< /note >}}

2. Запустіть інтерфейс командного рядка MongoDB:

   ```shell
   mongosh --port 28015
   ```

3. У командному рядку MongoDB введіть команду `ping`:

   ```
   db.runCommand( { ping: 1 } )
   ```

   Успішний запит ping повертає:

   ```
   { ok: 1 }
   ```

### За бажання дозвольте _kubectl_ вибрати локальний порт {#let-kubectl-choose-local-port}

Якщо вам не потрібен конкретний локальний порт, ви можете дозволити `kubectl` вибрати й призначити його, що позбавить вас потреби розвʼязувати конфлікти локальних портів, за допомогою дещо простішого синтаксису:

```shell
kubectl port-forward deployment/mongo :27017
```

Інструмент `kubectl` вибирає вільний номер локального порту (уникаючи низьких номерів, оскільки їх можуть використовувати інші застосунки). Вивід подібний до такого:

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## Обговорення {#discussion}

Зʼєднання з локальним портом 28015 перенаправляються на порт 27017 Podʼа, у якому працює сервер MongoDB. Завдяки цьому зʼєднанню ви можете налагоджувати базу даних, що працює в Podʼі, зі своєї локальної робочої станції.

{{< note >}}
`kubectl port-forward` реалізовано лише для портів TCP. Підтримка протоколу UDP відстежується в [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}

## Авторизація та міркування безпеки {#authorization-and-security-considerations}

Доступ до `kubectl port-forward` контролюється механізмами авторизації Kubernetes, такими як {{< glossary_tooltip text="контроль доступу на основі ролей (RBAC)" term_id="rbac" >}}. Авторизацію забезпечує API-сервер Kubernetes, а не клієнт `kubectl`.

Щоб використовувати `kubectl port-forward`, користувач повинен мати дозвіл на доступ до цільового ресурсу (наприклад, Pod або Service) і субресурсу `portforward`. Зазвичай потрібні дозволи `get` для `pods` і `create` для `pods/portforward`.

Адміністратори кластерів мають ретельно обмежувати ці дозволи, оскільки перенаправлення портів може надавати прямий мережевий доступ до робочих навантажень і обходити засоби контролю на рівні мережі.

## {{% heading "whatsnext" %}} {#what-s-next}

Дізнайтеся більше про [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
