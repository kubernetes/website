---
title: Вытеснение, инициированное через API
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

Вытеснение можно инициировать напрямую с помощью Eviction API или программно, 
используя клиент {{<glossary_tooltip term_id="kube-apiserver" text="API-сервера">}} 
(например, командой `kubectl drain`). В результате будет создан объект `Eviction`, 
который запустит процесс контролируемого завершения работы Pod'а.

Вытеснения, инициированные через API, учитывают настройки [`PodDisruptionBudget`](/docs/tasks/run-application/configure-pdb/)
и [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination). 

Создание с помощью API объекта Eviction для Pod'а аналогично выполнению 
[операции `DELETE`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)
для этого Pod'а, которая контролируется политикой. 

## Вызов API Eviction

Для доступа к API Kubernetes и создания объекта `Eviction` можно воспользоваться [клиентской библиотекой](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api). Необходимая операция оформляется в виде POST-запроса (см. пример ниже):

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
Вытеснение с версией `policy/v1` доступно начиная с v1.22. Для более ранних релизов используйте `policy/v1beta1`.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
Признана устаревшей в v1.22; заменена на `policy/v1`.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

Также можно попытаться выполнить операцию вытеснения, 
обратившись к API с помощью `curl` или `wget`, как показано в следующем примере:

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## Как работает вытеснение, инициированное через API

При вытеснении, инициированном через API, сервер API выполняет admission-проверки 
и отвечает одним из следующих способов:

* `200 OK`: вытеснение разрешено, подресурс `Eviction` создан, 
  Pod удален (аналогично отправке запроса `DELETE` на URL Pod'а).
* `429 Too Many Requests`: вытеснение в данный момент не разрешено из-за настроек
 {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}.
  Попытку вытеснения можно повторить позже. Такой ответ также может быть вызван 
  работой механизма по ограничению частоты запросов к API.
* `500 Internal Server Error`: вытесение запрещено из-за неправильной конфигурации; 
  например, несколько PodDisruptionBudget'ов могут ссылаться на один и тот же Pod.

Если Pod, предназначенный для вытеснения, не является частью рабочей нагрузки 
с настроенным PodDisruptionBudget'ом, сервер API всегда возвращает `200 OK` и 
разрешает вытеснение. 

В случае, если вытеснение разрешено, процесс удаления Pod'а выглядит следующим образом:

1. К ресурсу `Pod` на сервере API добавляется метка времени удаления, 
   после чего сервер API считает ресурс Pod завершенным (terminated). Ресурс `Pod` также помечается 
   настроенным grace-периодом.
1. {{<glossary_tooltip term_id="kubelet" text="kubelet">}} на узле, где запущен 
   локальный Pod, замечает, что ресурс `Pod` помечен на удаление, и приступает к 
   корректному завершению работы локального Pod'а.
1. Пока kubelet завершает работу Pod'а, управляющий слой удаляет Pod из объектов 
   {{<glossary_tooltip term_id="endpoint" text="Endpoint">}} и 
   {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}. 
   В результате контроллеры больше не рассматривают Pod как валидный объект.
1. После истечения периода корректного завершения работы (grace-периода) kubelet 
   принудительно завершает работу локального Pod'а.
1. kubelet передает API-серверу информацию о необходимости удалить ресурс `Pod`.
1. Сервер API удаляет ресурс `Pod`.

## Зависшие вытеснения

В некоторых ситуациях сбой приводит к тому, что API Eviction начинает возвращать 
исключительно ответы `429` или `500`. Такое может случиться, если, например, 
за создание Pod'ов для приложения отвечает ReplicaSet, однако новые Pod'ы не 
переходят в состояние `Ready`. Подобное поведение также может наблюдаться в случаях, 
когда у последнего вытесненного Pod'а слишком долгий период завершения работы (grace-период).

Одно из следующих решений может помочь решить проблему: 

* Прервите или приостановите автоматическую операцию, вызвавшую сбой. 
  Перед повторным запуском операции внимательно изучите сбойное приложение.
* Подождите некоторое время, затем напрямую удалите Pod из управляющего слоя 
  кластера вместо того, чтобы пытаться удалить его с помощью Eviction API.

## {{% heading "whatsnext" %}}

* Обеспечение работоспособности приложений с помощью [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
* [Вытеснение из-за дефицита ресурсов на узле](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* [Приоритет Pod'а и приоритизация](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
