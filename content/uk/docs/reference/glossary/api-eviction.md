---
title: Виселення, ініційоване API
id: api-eviction
date: 2021-04-27
full_link: /uk/docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Виселення, ініційоване API — процес, під час якого використовується Eviction API для створення обʼєкта Eviction, який викликає належне завершення роботи Podʼа.
aka:
- API-initiated eviction
tags:
- operation
---

Виселення, ініційоване API — процес, під час якого використовується [Eviction API](/uk/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) для створення обʼєкта `Eviction`, який викликає належне завершення роботи Podʼа.

<!--more-->

Ви можете зробити запит на виселення, якщо ви напряму звертаєтесь до Eviction API з використанням клієнта kube-apiserver, такого як команда `kubectl drain`. Коли створюється обʼєкт `Eviction`, сервер API завершує роботу Podʼа.

Виселення, ініційоване API дотримуються параметрів [`PodDisruptionBudgets`](/uk/docs/tasks/run-application/configure-pdb/) та [`terminationGracePeriodSeconds`](/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Виселення, ініційоване API не є тим самим, що й [виселення через тиск на вузол](/uk/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Дивіться [Виселення, ініційоване API](/uk/docs/concepts/scheduling-eviction/api-eviction/) для отримання додаткової інформації.
