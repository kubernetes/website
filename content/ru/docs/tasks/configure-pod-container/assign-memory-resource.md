---
title: Задание ресурсов памяти для контейнеров и Pod'ов
content_type: task
weight: 10
---

<!-- overview -->

На этой странице рассказывается, как настраивать *запрос* памяти и её *лимит* для контейнеров. Контейнеру гарантируется столько памяти, сколько он запросит, но не больше установленных ограничений.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Каждая нода вашего кластера должна располагать хотя бы 300 Мб памяти.

Некоторые операции на этой странице предполагают работу
[сервера метрик](https://github.com/kubernetes-incubator/metrics-server)
на вашем кластере. Если сервер метрик у вас уже запущен, следующие действия
можно пропустить.

Если вы используете Minikube, выполните следующую команду, чтобы запустить
сервер метрик:

```shell
minikube addons enable metrics-server
```

Чтобы проверить работу сервера меток или другого провайдера API ресурсов метрик
 (`metrics.k8s.io`), запустите команду:

```shell
kubectl get apiservices
```

Если API ресурсов метрики доступно, в выводе команды будет содержаться
ссылка на `metrics.k8s.io`.

```shell
NAME      
v1beta1.metrics.k8s.io
```

<!-- steps -->

## Создание пространства имён

Создадим пространство имён, чтобы ресурсы, которыми будем пользоваться в данном упражнении,
были изолированы от остального кластера:

```shell
kubectl create namespace mem-example
```

## Установка запроса памяти и лимита памяти

Для установки запроса памяти контейнеру подключите поле `resources:requests` в манифест ресурсов контейнера.
Для ограничений по памяти - добавьте `resources:limits`.

В этом упражнении создаётся Pod, содержащий один контейнер.
Зададим контейнеру запрос памяти в 100 Мб и её ограничение в 200 Мб. Конфигурационный файл для Pod'а:

{{% codenew file="pods/resource/memory-request-limit.yaml" %}}

Раздел `args` конфигурационного файла содержит аргументы для контейнера в момент старта.
Аргументы `"--vm-bytes", "150M"` указывают контейнеру попытаться занять 150 Мб памяти.

Создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Убедимся, что контейнер Pod'a запущен:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Посмотрим подробную информацию о Pod'е:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

В выводе мы видим, что для контейнера в Pod'е зарезервировано 100 Мб памяти и выставлено 200 Мб ограничения.


```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

Запустим `kubectl top`, чтобы получить метрики Pod'a:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

Вывод команды показывает, что Pod использовал примерно 162900000 байт памяти - и это около 150 Мб. 
Данная величина больше установленного запроса в 100 Мб, но укладывается в имеющееся ограничение на 200 Мб.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Удалим Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Превышение контейнером лимита памяти

Контейнер может превысить величину запроса памяти, если нода имеет достаточно ресурсов памяти.
Но превышение заданного ограничения памяти не допускается. Если контейнер запрашивает
больше памяти, чем ему разрешено использовать, то он становится кандидатом на удаление.
Если превышение лимита памяти продолжится, контейнер удаляется. 
Если удалённый контейнер может быть перезапущен, то kubelet перезапускает его, как и в случае
любой другой неполадки в работе.

В этом упражнении создадим Pod, который попытается занять больше памяти, чем для него ограничено.
Ниже представлен конфигурационный файл для Pod'a с одним контейнером, имеющим 50 Мб
на запрос памяти и 100 Мб лимита памяти:

{{% codenew file="pods/resource/memory-request-limit-2.yaml" %}}

В разделе `args` можно увидеть, что контейнер будет пытаться занять
250 Мб - и это значительно превышает лимит в 100 Мб.

Создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Посмотрим подробную информацию о Pod'е:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

В этот момент контейнер уже либо запущен, либо убит. 
Будем повторять предыдущую команду, пока контейнер не окажется убитым:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Посмотрим ещё более подробный вид статуса контейнера:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

В выводе показано, что контейнер был убит по причине недостатка памяти (OOM):

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

В данном упражнении контейнер может быть перезапущен, поэтому kubelet стартует его. 
Выполните следующую команду несколько раз, чтобы увидеть, как контейнер раз за разом
убивается и запускается снова:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Вывод показывает, что контейнер убит, перезапущен, снова убит, перезапущен, и т.д.:

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

Посмотрим подробную информацию об истории Pod'a:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

Вывод показывает, что контейнер постоянно запускается и падает:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Посмотрим детальную информацию о нодах на кластере:

```
kubectl describe nodes
```

В выводе содержится запись о том, что контейнер убивается по причине нехватки памяти:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Удалим Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Установка слишком большого для нод запроса памяти

Запросы и ограничения памяти связаны с контейнерами, но полезно также рассматривать
эти параметры и для Pod'а. Запросом памяти для Pod'a будет сумма всех запросов памяти
контейнеров, имеющихся в Pod'е. Также и лимитом памяти будет сумма всех ограничений,
установленных для контейнеров.

Планирование Pod'a основано на запросах. Pod запускается на ноде лишь в случае, если нода
может удовлетворить запрос памяти Pod'a.

В данном упражнении мы создадим Pod, чей запрос памяти будет превышать ёмкость любой ноды
в кластере. Ниже представлен конфигурационный файл для Pod'a с одним контейнером,
имеющим запрос памяти в 1000 Гб (что наверняка превышает ёмкость любой имеющейся ноды):

{{% codenew file="pods/resource/memory-request-limit-3.yaml" %}}

Создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Проверим статус Pod'a:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

Вывод показывает, что Pod имеет статус PENDING. Это значит, что он не запланирован ни на одной ноде,
и такой статус будет сохраняться всё время:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Посмотрим подробную информацию о Pod'е, включающую события:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

Вывод показывает невозможность запуска контейнера из-за нехватки памяти на нодах:

```shell
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

Удалим Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Единицы измерения памяти

Ресурсы памяти измеряются в байтах. Их можно задавать просто целым числом либо
целым числом с одним из следующих окончаний: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
Например, представленные здесь варианты задают приблизительно одну и ту же величину:

```shell
128974848, 129e6, 129M , 123Mi
```

## Если лимит памяти не задан

Если вы не задали ограничение памяти для контейнера, возможны следующие варианты:

* У контейнера отсутствует верхняя граница для памяти, которую он может использовать.
Такой контейнер может занять всю память, доступную на ноде, где он запущен, что, в свою очередь, может вызвать OOM Killer.
Также контейнеры без ограничений по ресурсам имеют более высокие шансы быть убитыми в случае вызова OOM Kill.

* Контейнер запущен в пространстве имён, в котором настроена величина ограничений по умолчанию.
Тогда контейнеру автоматически присваивается это стандартное значение лимита.
Администраторы кластера могут использовать
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
для задания стандартной величины ограничений по памяти.

## Мотивация для использования запросов и ограничений памяти

При помощи задания величины запросов и лимитов памяти для контейнеров,
запущенных на вашем кластере, можно эффективно распоряжаться имеющимися на нодах ресурсами.
Задание Pod'у небольшого запроса памяти даёт хорошие шансы для него быть запланированным.
Ограничение памяти, превышающее величину запроса памяти, позволяет достичь 2 вещей:

* Pod может иметь всплески активности, в течение которых ему может потребоваться дополнительная память.

* Величина памяти, доступная Pod'у при повышении активности, ограничена некоторой разумной величиной.

## Очистка

Удалим пространство имён. Эта операция удалит все Pod'ы, созданные в рамках данного упражнения:

```shell
kubectl delete namespace mem-example
```

## {{% heading "whatsnext" %}}


### Для разработчиков приложений

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Для администраторов кластера

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)