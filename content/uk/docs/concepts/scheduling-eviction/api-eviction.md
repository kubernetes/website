---
title: Виселення, ініційоване API
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

Ви можете ініціювати виселення, викликавши Eviction API безпосередньо або програмно,
використовуючи клієнт {{<glossary_tooltip term_id="kube-apiserver" text="API-сервера">}}, наприклад, команду `kubectl drain`. Це створює обʼєкт `Eviction`, що призводить до завершення роботи Podʼа через API-сервер.

Виселення ініційовані API дотримуються вашого налаштованого [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) та [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Використання API для створення обʼєкта Eviction для Podʼа схоже на виконання контрольованої політикою операції [`DELETE`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod) на Podʼі.

## Виклик Eviction API {#calling-the-eviction-api}

Ви можете використовувати [клієнт кластера Kubernetes](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api), щоб отримати доступ до API Kubernetes та створити обʼєкт `Eviction`. Для цього ви надсилаєте POST-запит на виконання операції, схожий на наступний приклад:

{{< tabs name="Приклад виселення" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
`policy/v1` Eviction доступний в v1.22+. Використовуйте `policy/v1beta1` для попередніх версій.
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
Застаріло в v1.22 на користь `policy/v1`
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

Також ви можете спробувати виконати операцію виселення, звернувшись до API за допомогою
`curl` або `wget`, схожою на наступний приклад:

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## Як працює виселення, ініційоване через API {#how-api-initiated-eviction-works}

Коли ви запитуєте виселення за допомогою API, сервер API виконує перевірки допуску
і відповідає одним із таких способів:

* `200 ОК`: виселення дозволено, субресурс `Eviction` створюється, і Pod видаляється, подібно до надсилання `DELETE`-запиту на URL Podʼа.
* `429 Забагато запитів`: виселення на цей момент не дозволено через налаштований {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}. Можливо, ви зможете спробувати виселення пізніше. Ви також можете отримати цю відповідь через обмеження швидкості API.
* `500 Внутрішня помилка сервера`: виселення не дозволено через помилкову конфігурацію, наприклад, якщо декілька PodDisruptionBudget посилаються на той самий Pod.

Якщо Pod, який ви хочете виселити, не є частиною робочого навантаження, яке має PodDisruptionBudget, сервер API завжди повертає `200 OK` та дозволяє виселення.

Якщо сервер API дозволяє виселення, Pod видаляється наступним чином:

1. Ресурс `Pod` в сервері API оновлюється з часовою міткою видалення, після чого сервер API вважає ресурс `Pod` таким, що завершив роботу. Ресурс `Pod` також позначений для відповідного звершення роботи.
2. {{<glossary_tooltip term_id="kubelet" text="Kubelet">}} на вузлі, на якому запущений локальний Pod, помічає, що ресурс `Pod` позначений для припинення та починає видаляти локальний Pod.
3. Під час припинення роботи Podʼа kubelet видаляє Pod з обʼєктів {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}. В результаті контролери більше не вважають Pod за дійсний обʼєкт.
4. Після закінчення періоду належного завершення роботи для Podʼа kubelet примусово вимикає локальний Pod.
5. kubelet повідомляє сервер API про видалення ресурсу `Pod`.
6. Сервер API видаляє ресурс `Pod`.

## Виправлення застряглих виселень {#troubleshooting-stuck-evictions}

У деяких випадках ваші застосунки можуть потрапити в непрацездатний стан, де Eviction API буде повертати лише відповіді `429` або `500`, поки ви не втрутитеся. Це може відбуватися, наприклад, якщо ReplicaSet створює Podʼи для вашого застосунку, але нові Podʼи не переходять в стан `Ready`. Ви також можете помітити це поведінку у випадках, коли останній виселений Pod мав довгий період належного завершення роботи при примусовому завершенні роботи.

Якщо ви помічаєте застряглі виселення, спробуйте одне з таких рішень:

* Скасуйте або призупиніть автоматизовану операцію, що викликає проблему. Дослідіть застряглий застосунок, перш ніж перезапустити операцію.
* Почекайте трохи, а потім безпосередньо видаліть Pod з панелі управління вашого кластера замість використання API виселення.

## {{% heading "whatsnext" %}}

* Дізнайтеся, як захистити ваші застосунки за допомогою [Бюджету відмови Podʼів](/docs/tasks/run-application/configure-pdb/).
* Дізнайтеся про [Виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Дізнайтеся про [Пріоритет та випередження Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
