---
title: Призначення ресурсів памʼяті контейнерам і Podʼам
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка показує, як призначити контейнеру *запит* (request) та *обмеження* (limit) памʼяті. Контейнеру гарантовано стільки памʼяті, скільки він запитує, але йому не дозволено використовувати більше памʼяті, ніж дозволяє обмеження.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Кожен вузол у вашому кластері повинен мати принаймні 300 MiB памʼяті.

Деякі кроки на цій сторінці потребують запуску [metrics-server](https://github.com/kubernetes-sigs/metrics-server) у вашому кластері. Якщо у вас уже працює metrics-server, ці кроки можна пропустити.

Якщо ви використовуєте Minikube, виконайте таку команду, щоб увімкнути metrics-server:

```shell
minikube addons enable metrics-server
```

Щоб перевірити, чи працює metrics-server або інший постачальник API метрик ресурсів (`metrics.k8s.io`), виконайте таку команду:

```shell
kubectl get apiservices
```

Якщо API метрик ресурсів доступне, вивід міститиме посилання на `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти кластера.

```shell
kubectl create namespace mem-example
```

## Встановлення запиту й обмеження памʼяті {#specify-a-memory-request-and-a-memory-limit}

Щоб вказати запит памʼяті для контейнера, додайте поле `resources.requests.memory` до маніфесту ресурсів контейнера. Щоб вказати обмеження памʼяті, додайте `resources.limits.memory`.

У цій вправі ви створюєте Pod з одним контейнером. Контейнер має запит памʼяті 100 MiB та обмеження памʼяті 200 MiB. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/resource/memory-request-limit.yaml" options="hl_lines=10-14" %}}

Розділ `args` у файлі конфігурації задає аргументи для контейнера під час його запуску. Аргументи `"--vm-bytes", "150M"` вказують контейнеру спробувати виділити 150 MiB памʼяті.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Перевірте, що контейнер Podʼа працює:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

Вивід показує, що єдиний контейнер у Podʼі має запит памʼяті 100 MiB та обмеження памʼяті 200 MiB.

```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

Виконайте команду `kubectl top`, щоб отримати метрики для Podʼа:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

Вивід показує, що Pod використовує приблизно 162,900,000 байтів памʼяті, тобто близько 150 MiB. Це більше за запит Podʼа в 100 MiB, але в межах обмеження Podʼа у 200 MiB.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Перевищення обмеження памʼяті контейнера {#exceed-a-container-s-memory-limit}

Контейнер може перевищити свій запит памʼяті, якщо на вузлі є вільна памʼять. Але контейнеру не дозволено використовувати більше памʼяті, ніж дозволяє його обмеження. Якщо контейнер виділяє більше памʼяті, ніж дозволяє обмеження, він стає кандидатом на завершення. Якщо контейнер і далі споживає памʼять понад обмеження, його буде завершено. Якщо завершений контейнер можна перезапустити, kubelet перезапускає його, як і в разі будь-якого іншого збою під час виконання.

У цій вправі ви створюєте Pod, який намагається виділити більше памʼяті, ніж дозволяє його обмеження. Ось файл конфігурації Podʼа з одним контейнером із запитом памʼяті 50 MiB та обмеженням памʼяті 100 MiB:

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" options="hl_lines=10-14" %}}

У розділі `args` файлу конфігурації видно, що контейнер спробує виділити 250 MiB памʼяті, що значно перевищує обмеження в 100 MiB.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

На цей момент контейнер може працювати або бути знищеним. Повторіть попередню команду, доки контейнер не буде знищено:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Отримайте більш детальний огляд стану контейнера:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

Вивід показує, що контейнер був знищений через вичерпання памʼяті (OOM):

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

Контейнер у цьому завданні може бути перезапущений, тому kubelet перезапускає його. Повторіть цю команду кілька разів, щоб переконатися, що контейнер постійно знищується та перезапускається:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Вивід показує, що контейнер знищується, перезапускається, знищується знову, знову перезапускається і так далі:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```

```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Перегляньте детальну інформацію про історію Podʼа:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

Вивід показує, що контейнер раз у раз запускається й завершується збоєм:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Перегляньте детальну інформацію про вузли вашого кластера:

```
kubectl describe nodes
```

Вивід містить запис про знищення контейнера через умову вичерпання памʼяті:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Запит памʼяті, завеликий для ваших вузлів {#specify-a-memory-request-that-is-too-big-for-your-nodes}

Запити й обмеження памʼяті повʼязані з контейнерами, але корисно уявляти, що запит і обмеження памʼяті має Pod. Запит памʼяті для Podʼа — це сума запитів памʼяті всіх контейнерів у Podʼі. Так само обмеження памʼяті для Podʼа — це сума обмежень усіх контейнерів у Podʼі.

Планування Podʼа ґрунтується на запитах. Pod призначається для запуску на вузол, лише якщо на вузлі достатньо вільної памʼяті, щоб задовольнити запит памʼяті Podʼа.

У цій вправі ви створюєте Pod із запитом памʼяті настільки великим, що він перевищує місткість будь-якого вузла у вашому кластері. Ось файл конфігурації Podʼа з одним контейнером, який запитує 1000 GiB памʼяті, що, найімовірніше, перевищує місткість будь-якого вузла у вашому кластері.

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" options="hl_lines=10-14" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Перегляньте статус Podʼа:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

Вивід показує, що статус Podʼа — PENDING. Це означає, що Pod не заплановано для запуску на жодному вузлі, і він залишатиметься у стані PENDING безстроково:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Перегляньте детальну інформацію про Pod, включаючи події:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

Вивід показує, що контейнер не може бути запланований через нестачу памʼяті на вузлах:

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Одиниці памʼяті {#memory-units}

Ресурс памʼяті вимірюється в байтах. Памʼять можна вказати як звичайне ціле число або як число з фіксованою комою з одним із таких суфіксів: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki. Наприклад, такі значення приблизно однакові:

```
128974848, 129e6, 129M, 123Mi
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Якщо ви не вказуєте обмеження памʼяті {#if-you-do-not-specify-a-memory-limit}

Якщо ви не вказуєте обмеження памʼяті для контейнера, можлива одна з таких ситуацій:

* Контейнер не має верхньої межі обсягу памʼяті, яку він використовує. Контейнер може використати всю памʼять, доступну на вузлі, де він працює, що, своєю чергою, може викликати OOM Killer. Крім того, у разі OOM Kill контейнер без обмежень ресурсів має більше шансів бути знищеним.

* Контейнер працює в просторі імен, що має стандартне обмеження памʼяті, і контейнеру автоматично призначається це стандартне обмеження. Адміністратори кластера можуть використовувати [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core), щоб задати стандартне значення обмеження памʼяті.

## Навіщо потрібні запити й обмеження памʼяті {#motivation-for-memory-requests-and-limits}

Налаштувавши запити й обмеження памʼяті для контейнерів, що працюють у вашому кластері, можна ефективно використовувати ресурси памʼяті, доступні на вузлах кластера. Тримаючи запит памʼяті Podʼа низьким, ви даєте Podʼу добрі шанси бути запланованим. Маючи обмеження памʼяті, більше за запит памʼяті, ви досягаєте двох речей:

* Pod може мати сплески активності, під час яких він використовує памʼять, що випадково виявилася доступною.
* Обсяг памʼяті, який Pod може використати під час сплеску, обмежений певною розумною величиною.

## Очищення {#clean-up}

Видаліть простір імен. Це видалить всі Podʼи, які ви створили для цього завдання:

```shell
kubectl delete namespace mem-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів CPU контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів і обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти для Podʼів у просторі імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

* [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)
