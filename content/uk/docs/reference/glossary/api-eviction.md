---
title: Ініційоване API вивільнення ресурсів
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Ініційоване API вивільнення ресурсів — процес, під час якого  використовується Eviction API для створення обʼєкта Eviction, який викликає гармонійне завершення роботи Podʼу.
aka:
tags:
- operation
---
Ініційоване API вивільнення ресурсів — процес, під час якого використовується [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
для створення обʼєкта `Eviction`, який викликає гармонійне завершення роботи Podʼу.

<!--more-->

Ви можете зробити запит на вивільнення, якщо ви напряму звертаєтесь до Eviction API з використанням клієнта kube-apiserver, такого як команда `kubectl drain`. Коли створюється обʼєкт `Eviction`, сервер API завершує роботу Podʼу.

Ініційоване API вивільнення ресурсів дотримуються параметрів з [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
та [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Ініційоване API вивільнення ресурсів не є тим самим, що й [вивільнення через тиск на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Дивіться [Ініційоване API вивільнення ресурсів](/docs/concepts/scheduling-eviction/api-eviction/) для отримання додаткової інформації.
