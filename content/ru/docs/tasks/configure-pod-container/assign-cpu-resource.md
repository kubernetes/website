---
title: Задание ресурсов CPU для контейнеров и Pod'ов
content_type: task
weight: 20
---

<!-- overview -->

На этой странице показывается, как настроить *запрос* CPU и *лимит* CPU
для контейнера. Контейнер не сможет использовать больше ресурсов CPU,
чем для него ограничено. Если в системе есть свободное время CPU,
контейнеру гарантируется выдача запрошенных им ресурсов CPU.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

На кластере должен быть хотя бы 1 доступный для работы CPU, чтобы запускать учебные примеры.

Для некоторых шагов с этой страницы понадобится запущенный
[сервер метрик](https://github.com/kubernetes-incubator/metrics-server)
на вашем кластере. Если сервер метрик уже запущен, следующие шаги можно пропустить.

Если вы используете {{< glossary_tooltip term_id="minikube" >}}, выполните следующую команду,
чтобы запустить сервер метрик:

```shell
minikube addons enable metrics-server
```

Проверим, работает ли сервер метрик (или другой провайдер API ресурсов метрик,
`metrics.k8s.io`), выполните команду:

```shell
kubectl get apiservices
```

Если API ресурсов метрик доступно, в выводе будет присутствовать
ссылка на `metrics.k8s.io`.


```
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## Создание пространства имён

Создадим {{< glossary_tooltip term_id="namespace" >}}, чтобы создаваемые в этом упражнении
ресурсы были изолированы от остального кластера.

```shell
kubectl create namespace cpu-example
```

## Установка запроса CPU и лимита CPU

Чтобы установить запрос CPU для контейнера, подключите поле `resources:requests`
в манифест ресурсов контейнера. Для установки ограничения по CPU подключите `resources:limits`.

В этом упражнении мы создадим Pod, имеющий один контейнер. Зададим для контейнера запрос в
0.5 CPU и лимит в 1 CPU. Конфигурационный файл для такого Pod'а:

{{% codenew file="pods/resource/cpu-request-limit.yaml" %}}

Раздел `args` конфигурационного файла содержит аргументы для контейнера в момент старта.
Аргумент `-cpus "2"` говорит контейнеру попытаться использовать 2 CPU.

Создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Удостоверимся, что Pod запущен:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Посмотрим детальную информацию о Pod'е:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

В выводе видно, что Pod имеет один контейнер с запросом в 500 милли-CPU и с ограничением в 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Запустим `kubectl top`, чтобы получить метрики Pod'a:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

В этом варианте вывода Pod'ом использовано 974 милли-CPU, что лишь чуть меньше
заданного в конфигурации Pod'a ограничения в 1 CPU.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Напомним, что установкой параметра `-cpu "2"` для контейнера было задано попытаться использовать 2 CPU,
однако в конфигурации присутствует ограничение всего в 1 CPU. Использование контейнером CPU было отрегулировано,
поскольку он попытался занять больше ресурсов, чем ему позволено.

{{< note >}}
Другое возможное объяснение для выделения менее 1.0 CPU в отсутствии на ноде достаточного количества
свободных CPU ресурсов. Напомним, что в начальных условиях для этого упражнения было наличие у кластера
хотя бы 1 CPU, доступного для использования. Если контейнер запущен на ноде, имеющей в своём распоряжении всего 1 CPU,
контейнер не сможет использовать более 1 CPU независимо от заданных для него ограничений.
{{< /note >}}

Удалим Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Единицы измерения CPU

Ресурсы CPU измеряются в *CPU* единицах. Один CPU, в Kubernetes, соответствует:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 гипертрединговое ядро на физическом процессоре Intel с Гипертредингом

Дробные значения возможны. Контейнер, запрашивающий 0.5 CPU, получит вполовину меньше ресурсов,
чем контейнер, запрашивающий 1 CPU. Можно использовать окончание m для обозначения милли. Например,
100m CPU, 100 milliCPU и 0.1 CPU обозначают одно и то же. Точность выше 1m не поддерживается.

CPU всегда запрашивается в абсолютных величинах, не в относительных; 0.1 будет одинаковой частью от CPU
для одноядерного, двухъядерного или 48-ядерного процессора.

## Запрос ресурсов CPU больше доступного на ноде

Запросы и лимиты CPU устанавливаются для контейнеров, но также полезно рассматривать и Pod
имеющим эти характеристики. Запросом CPU для Pod'а является сумма запросов CPU всех его контейнеров.
Аналогично и лимит CPU для Pod'а - сумма всех ограничений CPU у его контейнеров.

Планирование Pod'а основано на запросах. Pod попадает в расписание запуска на ноде лишь в случае
достаточного количества доступных ресурсов CPU на ноде, чтобы удовлетворить запрос CPU Pod'а.

В этом упражнении мы создадим Pod с запросом CPU, превышающим мощности любой ноды в вашем кластере.
Ниже представлен конфигурационный файл для Pod'а с одним контейнером. Контейнер запрашивает 100 CPU,
что почти наверняка превышает имеющиеся мощности любой ноды в кластере.

{{% codenew file="pods/resource/cpu-request-limit-2.yaml" %}}

Создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Проверим статус Pod'а:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

Вывод показывает Pending статус у Pod'а. То есть Pod не запланирован к запуску
ни на одной ноде и будет оставаться в статусе Pending постоянно:


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Посмотрим подробную информацию о Pod'е, включающую в себя события:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

В выводе отражено, что контейнер не может быть запланирован из-за нехватки ресурсов 
CPU на нодах:


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Удалим Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Если ограничения на CPU не заданы

Если ограничения на использование контейнером CPU не установлены, возможны следующие варианты:

* У контейнера отсутствует верхняя граница количества CPU доступных ему ресурсов. В таком случае
он может занять все ресурсы CPU, доступные на ноде, на которой он запущен.

* Контейнер запущен в пространстве имён, в котором задана стандартная величина ограничения
ресурсов CPU. Тогда контейнеру автоматически присваивается это ограничение. Администраторы
кластера могут использовать [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/),
чтобы задать стандартную величину ограничения ресурсов CPU.

## Мотивация для использования запросов и лимитов CPU

Вы можете распоряжаться ресурсами CPU на нодах вашего кластера эффективнее, если для
запущенных контейнеров установлены запросы и ограничения на использование ресурсов CPU.
Задание небольшого запроса CPU даёт Pod'у хорошие шансы быть запланированным. Установка
лимита на ресурсы CPU, большего, чем запрос, позволяет достичь 2 вещей:

* При увеличении нагрузки Pod может задействовать дополнительные ресурсы CPU.
* Количество ресурсов CPU, которые Pod может задействовать при повышении нагрузки, ограничено
некоторой разумной величиной.

## Очистка

Удалим созданное для этого упражнения пространство имён:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}


### Для разработчиков приложений

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Для администраторов кластера

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
