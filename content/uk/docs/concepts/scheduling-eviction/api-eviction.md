---
title: Виселення, ініційоване API
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

Ви можете ініціювати виселення, викликавши Eviction API безпосередньо або програмно,
використовуючи клієнт {{<glossary_tooltip term_id="kube-apiserver" text="API-сервера">}}, наприклад, команду `kubectl drain`. Це створює обʼєкт `Eviction`, що змушує API-сервер завершити роботу Podʼа.

Виселення, ініційовані API, враховують налаштовані вами [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) та [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Використання API для створення обʼєкта Eviction для Podʼа схоже на виконання контрольованої політикою [операції `DELETE`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod) над Podʼом.

## Виклик Eviction API {#calling-the-eviction-api}

Ви можете використовувати [клієнтську бібліотеку Kubernetes](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api), щоб отримати доступ до API Kubernetes та створити обʼєкт `Eviction`. Для цього надішліть POST-запит на виконання операції, подібний до наведеного нижче прикладу:

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

Також ви можете спробувати виконати операцію виселення, звернувшись до API за допомогою `curl` або `wget`, як у наведеному нижче прикладі:

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## Як працює виселення, ініційоване через API {#how-api-initiated-eviction-works}

Коли ви запитуєте виселення за допомогою API, API-сервер виконує перевірки допуску
і відповідає одним із таких способів:

* `200 OK`: виселення дозволено, субресурс `Eviction` створюється, і Pod видаляється, подібно до надсилання `DELETE`-запиту на URL Podʼа.
* `429 Too Many Requests`: виселення на цей момент не дозволено через налаштований {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}. Можливо, ви зможете спробувати виселення пізніше. Ви також можете отримати цю відповідь через обмеження швидкості API.
* `500 Internal Server Error`: виселення не дозволено через помилкову конфігурацію, наприклад, якщо декілька PodDisruptionBudget посилаються на той самий Pod.

Якщо Pod, який ви хочете виселити, не є частиною робочого навантаження, яке має PodDisruptionBudget, API-сервер завжди повертає `200 OK` та дозволяє виселення.

Якщо API-сервер дозволяє виселення, Pod видаляється так:

1. Ресурс `Pod` в API-сервері оновлюється з часовою міткою видалення, після чого API-сервер вважає ресурс `Pod` таким, що завершив роботу. Ресурс `Pod` також позначений налаштованим періодом належного завершення роботи.
1. {{<glossary_tooltip term_id="kubelet" text="kubelet">}} на вузлі, на якому запущений локальний Pod, помічає, що ресурс `Pod` позначений для припинення та починає належним чином завершувати локальний Pod.
1. Поки kubelet завершує роботу Podʼа, панель управління видаляє Pod з обʼєктів {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}. В результаті контролери більше не вважають Pod за дійсний обʼєкт.
1. Після закінчення періоду належного завершення роботи для Podʼа kubelet примусово завершує локальний Pod.
1. kubelet повідомляє API-серверу, що ресурс `Pod` треба видалити.
1. API-сервер видаляє ресурс `Pod`.

## Виправлення застряглих виселень {#troubleshooting-stuck-evictions}

У деяких випадках ваші застосунки можуть потрапити в непрацездатний стан, де Eviction API буде повертати лише відповіді `429` або `500`, поки ви не втрутитеся. Це може відбуватися, наприклад, якщо ReplicaSet створює Podʼи для вашого застосунку, але нові Podʼи не переходять в стан `Ready`. Ви також можете помітити цю поведінку у випадках, коли останній виселений Pod мав довгий період належного завершення роботи.

Якщо ви помічаєте застряглі виселення, спробуйте одне з таких рішень:

* Скасуйте або призупиніть автоматизовану операцію, що викликає проблему. Дослідіть застряглий застосунок, перш ніж перезапустити операцію.
* Почекайте трохи, а потім безпосередньо видаліть Pod з панелі управління вашого кластера замість використання Eviction API.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся, як захистити ваші застосунки за допомогою [бюджету порушень Podʼів](/docs/tasks/run-application/configure-pdb/).
* Дізнайтеся про [Виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Дізнайтеся про [Пріоритет та витіснення Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
