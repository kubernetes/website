---
title: Виселення, ініційоване API
id: api-eviction
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Виселення, ініційоване API, — це процес, під час якого ви використовуєте Eviction API для створення обʼєкта Eviction, що запускає коректне завершення роботи Podʼа.
aka:
- API-initiated eviction
tags:
- operation
---

Виселення, ініційоване API, — це процес, під час якого ви використовуєте [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) для створення обʼєкта `Eviction`, що запускає коректне завершення роботи Podʼа.

<!--more-->

Ви можете запросити виселення, безпосередньо викликавши Eviction API за допомогою клієнта kube-apiserver, як-от команди `kubectl drain`. Коли створюється обʼєкт `Eviction`, API-сервер завершує роботу Podʼа.

Виселення, ініційовані API, дотримуються налаштованих вами [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) і [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Виселення, ініційоване API, — це не те саме, що [виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Докладніше дивіться в розділі [Виселення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/).
