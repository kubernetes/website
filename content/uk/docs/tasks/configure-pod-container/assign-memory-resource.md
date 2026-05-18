---
title: Виділення ресурсів памʼяті для контейнерів та Podʼів
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка показує, як вказати *запити* та *ліміти* памʼяті для контейнерів. Контейнери гарантовано матимуть стільки памʼяті, скільки вказано у запиті, і не отримають більше, ніж вказано у ліміті.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Кожен вузол у вашому кластері повинен мати принаймні 300 МіБ памʼяті.

Деякі кроки на цій сторінці вимагають запуску служби [metrics-server](https://github.com/kubernetes-sigs/metrics-server) у вашому кластері. Якщо у вас запущено metrics-server,
ви можете пропустити ці кроки.

Якщо ви використовуєте {{< glossary_tooltip term_id="minikube" >}}, виконайте таку команду, щоб увімкнути metrics-server:

```shell
minikube addons enable metrics-server
```

Щоб перевірити, чи запущений metrics-server, або інший постачальник API ресурсів метрик (`metrics.k8s.io`), виконайте таку команду:

```shell
kubectl get apiservices
```

Якщо API ресурсів метрик доступне, у виводі буде міститися посилання на `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були відокремлені від інших ресурсів у вашому кластері.

```shell
kubectl create namespace mem-example
```

## Визначення запитів та лімітів памʼяті {#specify-a-memory-request-and-a-memory-limit}

Щоб вказати запит памʼяті для Контейнера, включіть поле `resources.requests.memory` у маніфесті ресурсів Контейнера. Для вказівки ліміти памʼяті включіть `resources.limits.memory`.

У цьому завданні ви створюєте Pod, який має один Контейнер. У Контейнера вказано запит памʼяті 100 МіБ і ліміти памʼяті 200 МіБ. Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/resource/memory-request-limit.yaml" options="hl_lines=10-14" %}}

Розділ `args` у файлі конфігурації надає аргументи для Контейнера при його запуску. Аргументи `"--vm-bytes", "150M"` вказують Контейнеру спробувати виділити 150 МіБ памʼяті.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Перевірте, що Контейнер Podʼа працює:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

Вивід показує, що один Контейнер у Podʼі має запит памʼяті 100 МіБ та ліміти памʼяті 200 МіБ.

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

Вивід показує, що Pod використовує приблизно 162,900,000 байт памʼяті, що становить близько 150 МіБ. Це більше, ніж запит Podʼа на 100 МіБ, але в межах ліміти Podʼа на 200 МіБ.

```none
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Перевищення лімітів памʼяті Контейнера {#exceed-a-container-s-memory-limit}

Контейнер може перевищити свій запит на памʼять, якщо на вузлі є вільна памʼять. Але Контейнер не може використовувати памʼяті більше, ніж його ліміт памʼяті. Якщо Контейнер використовує більше памʼяті, ніж його ліміт, Контейнер стає кандидатом на зупинку роботи. Якщо Контейнер продовжує використовувати памʼять поза своїм лімітом, він зупиняється. Якщо Контейнер може бути перезапущений, kubelet перезапускає його, як із будь-яким іншим типом відмови під час роботи.

У цьому завданні ви створюєте Pod, який намагається виділити більше памʼяті, ніж його ліміт. Ось файл конфігурації для Podʼа, який має один Контейнер з запитом памʼяті 50 МіБ та лімітом памʼяті 100 МіБ:

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" options="hl_lines=10-14" %}}

У розділі `args` файлу конфігурації видно, що Контейнер спробує використати 250 МіБ памʼяті, що значно перевищує ліміт в 100 МіБ.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

На цей момент Контейнер може працювати або бути знищеним. Повторіть попередню команду, доки Контейнер не буде знищено:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Отримайте більш детальний огляд стану Контейнера:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

Вивід показує, що Контейнер був знищений через вичерпання памʼяті (OOM):

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

Контейнер у цьому завданні може бути перезапущений, тому kubelet перезапускає його. Повторіть цю команду кілька разів, щоб переконатися, що Контейнер постійно знищується та перезапускається:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Вивід показує, що Контейнер знищується, перезапускається, знищується знову, знову перезапускається і так далі:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Перегляньте детальну інформацію про історію Podʼа:

```shell
kubectʼ describe pod лімітомo-2 ʼ-namespace=mem-example
```

Вивід показує, що Контейнер починається і знову не вдається:

```none
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Перегляньте детальну інформацію про вузли вашого кластера:

```shell
kubectl describe nodes
```

Вивід містить запис про знищення Контейнера через умову вичерпання памʼяті:

```none
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Визначення запиту памʼяті, що є завеликим для вашого вузла {#specify-a-memory-request-that-is-too-big-for-your-nodes}

Запити та ліміт памʼяті повʼязані з Контейнерами, але корисно думати про Pod як про елемент, що має запит та ліміт памʼяті. Запит памʼяті для Podʼа — це сума запитів памʼяті для всіх Контейнерів у Podʼі. Аналогічно, ліміт памʼяті для Podʼа — це сума лімітів всіх Контейнерів у Podʼі.

Планування Podʼа ґрунтується на запитах. Pod планується кзапуску на вузлі лише у разі, якщо вузол має достатньо вільної памʼяті, щоб задовольнити запит памʼяті Podʼа.

У цьому завданні ви створюєте Pod, у якого запит памʼяті настільки великий, що перевищує можливості будь-якого вузла у вашому кластері. Ось файл конфігурації для Podʼа, у якого один Контейнер з запитом на 1000 ГіБ памʼяті, що, ймовірно, перевищує можливості будь-якого вузла у вашому кластері.

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

```none
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Перегляньте детальну інформацію про Pod, включаючи події:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

Вивід показує, що Контейнер не може бути запланований через нестачу памʼяті на вузлах:

```none
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Одиниці памʼяті {#memory-units}

Ресурс памʼяті вимірюється у байтах. Ви можете виразити памʼять як ціле число або ціле число з одним із наступних суфіксів: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki. Наприклад, наступні значення приблизно однакові:

```none
128974848, 129e6, 129M, 123Mi
```

Видаліть свій Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Якщо ви не вказуєте ліміт памʼяті {#if-you-do-not-specify-a-memory-limit}

Якщо ви не вказуєте ліміт памʼяті для Контейнера, відбувається одне з наступного:

* Контейнер не має верхньої межі на кількість використаної памʼяті. Контейнер може
використовувати всю доступну памʼять на вузлі, де він працює, що, своєю чергою, може спричинити активацію "OOM Killer". Крім того, в разі активації "OOM Kill" Контейнер без обмежень ресурсів матиме більше шансів на знищення.

* Контейнер працює в просторі імен, який має стандартний ліміт памʼяті, і Контейнер автоматично отримує визначений стандартний ліміт. Адміністратори кластера можуть використовувати [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core) для зазначення стандартного ліміту памʼяті.

## Для чого вказувати запит та ліміт памʼяті {#motivation-for-memory-requests-and-limits}

Налаштовуючи запити та ліміти памʼяті для Контейнерів, які працюють у вашому
кластері, ви можете ефективно використовувати ресурси памʼяті, доступні на вузлах вашого кластера. Знижуючи запит памʼяті для Podʼа, ви даєте Podʼу хороший шанс на планування. Маючи ліміти памʼяті, який перевищує запит памʼяті, ви досягаєте двох цілей:

* Pod може мати періоди сплеску активності, коли він використовує доступну памʼять.
* Обсяг памʼяті, який Pod може використовувати під час сплесків, обмежений до якогось розумного значення.

## Очищення {#clean-up}

Видаліть простір імен. Це видалить всі Podʼи, які ви створили для цього завдання:

```shell
kubectl delete namespace mem-example
```

## {{% heading "whatsnext" %}}

### Для розробників застосунків #for-application-developers

* [Призначення ресурсів ЦП для Контейнерів та Podʼів](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Зміна обсягів CPU та памʼяті, призначених для контейнерів](/docs/tasks/configure-pod-container/resize-container-resources/)

### Для адміністраторів кластера {#for-cluster-administrators}

* [Налаштування стандартних запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Налаштування стандартних запитів та обмежень ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування мінімальних та максимальних обмежень ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Налаштування квот памʼяті та ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти для Podʼів у просторі імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

* [Зміна розміру ресурсів ЦП та памʼяті, які призначені для Контейнерів](/docs/tasks/configure-pod-container/resize-container-resources/)
