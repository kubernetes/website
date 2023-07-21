---
title: Вытеснение, инициированное через API
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Вытеснение, инициированное через API — процесс, при котором с помощью Eviction API создается объект Eviction,
  который запускает корректное завершение работы Pod'а.
aka:
tags:
- operation
---
  Вытеснение, инициированное через API — процесс, при котором с помощью [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) 
создается объект `Eviction`, который запускает корректное завершение работы Pod'а.

<!--more-->

Вытеснение можно запросить через Eviction API, обратившись к нему напрямую, либо программно (через клиент API-сервера — например, с помощью команды `kubectl drain`). При этом будет создан объект `Eviction`, на основании которого API-сервер завершит работу Pod'а.

Вытеснения, инициированные через API, учитывают заданные параметры [`PodDisruptionBudget`](/docs/tasks/run-application/configure-pdb/) (минимальное количество реплик, которые должны быть доступны для данного развертывания в любой момент времени) и [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) (период ожидания корректного завершения работы Pod'а).

Обратите внимание: вытеснение, инициированное через API — не то же самое, что вытеснение из-за [дефицита ресурсов на узле](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Дополнительная информация доступна в разделе ["Вытеснение, инициированное API"](/docs/concepts/scheduling-eviction/api-eviction/).
