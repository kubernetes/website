---
layout: blog
title: "Kubernetes v1.37: Metrics API стає стабільним"
slug: kubernetes-v1-37-metrics-api-ga
date: 2026-08-27T10:30:00-08:00
author: >
  [ChengHao Yang](https://github.com/tico88612)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Kubernetes v1.37 переводить API `metrics.k8s.io` до стабільного статусу (`v1`). Цей API надає дані про використання CPU та памʼяті вузлами та Podʼами і лежить в основі таких команд, як `kubectl top`, а також автомасштабування на основі метрик ресурсів.

Для операторів кластера та розробників застосунків цей перехід означає, що API тепер має гарантії стабільності, які асоціюються зі стабільним API Kubernetes. API `v1` має ті самі типи ресурсів і поля, що й `v1beta1`; це перехід версії API, а не зміна метрик, які збираються чи повертаються.

## Давній API досягає стабільного статусу {#a-long-lived-api-reaches-stable}

Metrics API ресурсів було введено як альфа-версію в Kubernetes v1.6, а бета-версію він отримав у v1.8. Він залишався незмінним і роками використовувався у виробничих середовищах такими клієнтами, як HorizontalPodAutoscaler (HPA) та `kubectl top`. Kubernetes v1.37 формально переводить цей перевірений API до `metrics.k8s.io/v1`.

API надає два типи ресурсів:

- `NodeMetrics` — використання CPU та памʼяті вузлом.
- `PodMetrics` — використання CPU та памʼяті Podʼом, з розбивкою за контейнерами у полі `containers`.

API навмисно залишається малим. Він надає метрики ресурсів, необхідні для автомасштабування та базового інспектування; він не є заміною повного конвеєра моніторингу або API користувацьких метрик (`custom.metrics.k8s.io`).

## Що змінилося з випуском v1.37? {#changes}

Поверхня API `v1` ідентична `v1beta1`, за винятком версії API. Немає жодних перейменованих полів, нових полів або змін у значенні повернутих значень використання CPU та памʼяті.

Наприклад, клієнт може отримати метрики вузлів зі стабільної точки доступу:

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/nodes
```

Так само він може отримати метрики для Podʼів у просторі імен:

```shell
kubectl get --raw /apis/metrics.k8s.io/v1/namespaces/default/pods
```

`kubectl top` підтримує обидві версії API. Він надає перевагу `v1`, коли вона доступна, і автоматично переходить на `v1beta1` у кластерах, які ще не надають `v1`. Контролер HPA наразі підтримує лише `v1beta1`. Підтримку вибору між `v1` та `v1beta1` на основі виявлення заплановано, але вона недоступна в Kubernetes v1.37.

## Що вам потрібно зробити {#what-you-need-to-do}

Вам не потрібно вмикати жодної функціональної можливості. Metrics API надається через [шар агрегації API](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), реалізацією, такою як [metrics-server](https://github.com/kubernetes-sigs/metrics-server). Ви можете обрати будь-яку реалізацію `metrics.k8s.io`; щоб API метрик v1 був доступний у вашому кластері, ваша обрана реалізація має надавати API `v1.metrics.k8s.io`, і вам потрібно [зареєструвати](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) відповідний [APIService](/docs/reference/kubernetes-api/apiregistration/api-service-v1/).

Під час перехідного періоду реалізації мають надавати обидві версії — `v1` та `v1beta1`. Збереження доступності обох версій підтримує сумісність зі старішими клієнтами. API `v1beta1` залишається доступним у Kubernetes v1.37.

Ви можете переглянути, які версії надає ваш кластер, за допомогою:

```shell
kubectl get --raw /apis/metrics.k8s.io/ | jq .
```

Щойно ваша реалізація метрик підтримає `v1`, ви також можете перевірити, що її APIService доступний:

```shell
kubectl get apiservice v1.metrics.k8s.io
```

## Дізнайтеся більше {#learn-more}

- Прочитайте документацію про [конвеєр метрик ресурсів](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/).
- Ознайомтесь з [KEP-5207](https://www.kubernetes.dev/resources/keps/5207/) — пропозицію щодо (підвищення) цього API.
- Дізнайтеся більше про [Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api) та його еталонну реалізацію, [metrics-server](https://github.com/kubernetes-sigs/metrics-server).

## Долучайтеся {#get-involved}

Metrics API підтримується [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/). Щоб ставити запитання, ділитися відгуками або робити внесок, приєднуйтеся до каналу [#sig-instrumentation](https://kubernetes.slack.com/messages/sig-instrumentation) у Kubernetes Slack або відвідуйте зустрічі SIG Instrumentation.
