---
title: Керування потоком
weight: 130
---

<!-- overview -->

API Priority and Fairness контролює поведінку сервера API Kubernetes у ситуації перевантаження. Ви можете знайти більше інформації про нього у розділі [API Priority & Fairness](/docs/concepts/cluster-administration/flow-control/) документації.

<!-- body -->

## Діагностика {#diagnostics}

Кожна відповідь HTTP від API-сервера з увімкненою функцією пріоритету та справедливості має два додаткові заголовки: `X-Kubernetes-PF-FlowSchema-UID` та `X-Kubernetes-PF-PriorityLevel-UID`, які вказують на схему потоку, що відповідала запиту, та рівень пріоритету, до якого він був призначений, відповідно. Імена обʼєктів API не включені в ці заголовки (щоб уникнути розкриття деталей у випадку, якщо користувач, який робить запит, не має дозволу на їх перегляд). Під час налагодження ви можете використовувати команду:

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

щоб отримати відповідність UID до імен для FlowSchemas та PriorityLevelConfigurations.

## Точки налагодження {#debug-endpoints}

З увімкненою функцією `APIPriorityAndFairness`, `kube-apiserver` обслуговує наступні додаткові шляхи на своїх HTTP(S) портах.

Вам потрібно переконатися, що у вас є дозволи для доступу до цих точок. Вам не потрібно нічого робити, якщо ви адміністратор. Дозволи можуть бути надані за необхідністю відповідно до [RBAC](/docs/reference/access-authn-authz/rbac/) документа для доступу до `/debug/api_priority_and_fairness/` шляхом зазначення `nonResourceURLs`.

- `/debug/api_priority_and_fairness/dump_priority_levels` — перелік
  усіх рівнів пріоритету та поточний стан кожного. Ви можете отримати його так:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  Вихідні дані будуть у форматі CSV та подібні до цього:

  ```none
  PriorityLevelName, ActiveQueues, IsIdle, IsQuiescing, WaitingRequests, ExecutingRequests, DispatchedRequests, RejectedRequests, TimedoutRequests, CancelledRequests
  catch-all,         0,            true,   false,       0,               0,                 1,                  0,                0,                0
  exempt,            0,            true,   false,       0,               0,                 0,                  0,                0,                0
  global-default,    0,            true,   false,       0,               0,                 46,                 0,                0,                0
  leader-election,   0,            true,   false,       0,               0,                 4,                  0,                0,                0
  node-high,         0,            true,   false,       0,               0,                 34,                 0,                0,                0
  system,            0,            true,   false,       0,               0,                 48,                 0,                0,                0
  workload-high,     0,            true,   false,       0,               0,                 500,                0,                0,                0
  workload-low,      0,            true,   false,       0,               0,                 0,                  0,                0,                0
  ```

  Пояснення для вибраних назв стовпців:
  - `IsQuiescing` вказує, чи буде цей рівень пріоритету видалено, коли його черги буде спустошено.

- `/debug/api_priority_and_fairness/dump_queues` — перелік усіх черг та їх поточний стан. Ви можете отримати його так:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  Вихідні дані будуть у форматі CSV та подібні до цього:

  ```none
  PriorityLevelName, Index,  PendingRequests, ExecutingRequests, SeatsInUse, NextDispatchR,   InitialSeatsSum, MaxSeatsSum, TotalWorkSum
  workload-low,      14,     27,              0,                 0,          77.64342019ss,   270,             270,         0.81000000ss
  workload-low,      74,     26,              0,                 0,          76.95387841ss,   260,             260,         0.78000000ss
  ...
  leader-election,   0,      0,               0,                 0,          5088.87053833ss, 0,               0,           0.00000000ss
  leader-election,   1,      0,               0,                 0,          0.00000000ss,    0,               0,           0.00000000ss
  ...
  workload-high,     0,      0,               0,                 0,          0.00000000ss,    0,               0,           0.00000000ss
  workload-high,     1,      0,               0,                 0,          1119.44936475ss, 0,               0,           0.00000000ss
  ```

  Пояснення для вибраних назв стовпців:
  - `NextDispatchR`: показник прогресу R, в одиницях секунд-місць, на якому буде відправлено наступний запит.
  - `InitialSeatsSum`: сума InitialSeats, повʼязана з усіма запитами в даній черзі.
  - `MaxSeatsSum`: сума MaxSeats, повʼязана з усіма запитами в даній черзі.
  - `TotalWorkSum`: сума загальної роботи, в одиницях секунд-місць, усіх запитів, що очікують в черзі.

  Примітка: `seat-second` (скорочено як `ss`) є одиницею вимірювання роботи в світі APF.

- `/debug/api_priority_and_fairness/dump_requests` — перелік усіх запитів, включаючи запити, що очікують у черзі та запити, що виконуються. Ви можете отримати його так:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  Вихідні дані будуть у форматі CSV та подібні до цього:

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.386556253Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.487092539Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  ```

  Ви можете отримати більш детальний перелік за допомогою команди:

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  Вихідні дані будуть у форматі CSV та подібні до цього:

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime,                      UserName,                               Verb,   APIPath,                                   Namespace,   Name,   APIVersion, Resource,   SubResource
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z, system:serviceaccount:system:admin,     list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:08.986534842Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:09.086476021Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  ```

  Пояснення для вибраних назв стовпців:
  - `QueueIndex`: індекс черги. Він буде -1 для рівнів пріоритету без черг.
  - `RequestIndexInQueue`: індекс у черзі для даного запиту. Він буде -1 для запитів, що виконуються.
  - `InitialSeats`: кількість місць, які будуть зайняті під час початкового (нормального) етапу виконання запиту.
  - `FinalSeats`: кількість місць, які будуть зайняті під час завершального етапу виконання запиту, враховуючи повʼязані повідомлення WATCH.
  - `AdditionalLatency`: додатковий час, витрачений під час завершального етапу виконання запиту. FinalSeats будуть зайняті протягом цього періоду. Це не означає будь-яку затримку, яку спостерігатиме користувач.
  - `StartTime`: час початку виконання запиту. Він буде 0001-01-01T00:00:00Z для запитів, що очікують у черзі.

## Ведення логів налагодження {#debug-logging}

На рівні `-v=3` або вище, API-сервер виводить рядок httplog для кожного запиту в лозі API-сервера, і він містить наступні атрибути.

- `apf_fs`: імʼя схеми потоку, до якої був класифікований запит.
- `apf_pl`: імʼя рівня пріоритету для цієї схеми потоку.
- `apf_iseats`: кількість місць, визначених для початкового (нормального) етапу виконання запиту.
- `apf_fseats`: кількість місць, визначених для завершального етапу виконання (з урахуванням повʼязаних повідомлень `watch`) запиту.
- `apf_additionalLatency`: тривалість завершального етапу виконання запиту.

На вищих рівнях деталізації логу будуть рядки, що розкривають деталі того, як APF обробив запит, в основному для цілей налагодження.

## Заголовки відповіді {#response-headers}

APF додає наступні два заголовки до кожного HTTP повідомлення. Вони не зʼявляться в лозі аудиту. Їх можна переглянути з боку клієнта. Для клієнтів, що використовують `klog`, використовуйте рівень деталізації `-v=8` або вище, щоб переглянути ці заголовки.

- `X-Kubernetes-PF-FlowSchema-UID` містить UID обʼєкта FlowSchema, до якого був класифікований відповідний запит.
- `X-Kubernetes-PF-PriorityLevel-UID` містить UID обʼєкта PriorityLevelConfiguration, повʼязаного з цією FlowSchema.

## {{% heading "whatsnext" %}}

Для отримання фонової інформації про деталі дизайну пріоритету та справедливості API дивіться [пропозицію щодо покращення](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
