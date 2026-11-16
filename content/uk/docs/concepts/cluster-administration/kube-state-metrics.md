---
title: Метрики для станів обʼєктів Kubernetes
content_type: concept
weight: 75
description: >-
   kube-state-metrics — це агент-надбудова для генерації та надання метрик на рівні кластера.
---

Стан обʼєктів Kubernetes в API Kubernetes можна надавати у вигляді метрик. Агент-надбудова [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) може підʼєднуватися до API-сервера Kubernetes і надавати HTTP-точку доступу з метриками, згенерованими зі стану окремих обʼєктів у кластері. Він надає різну інформацію про стан обʼєктів, таку як мітки й анотації, час запуску та завершення, статус або фазу, у якій зараз перебуває обʼєкт. Наприклад, контейнери, що працюють у Podʼах, створюють метрику `kube_pod_container_info`. Вона містить як мітки назву контейнера, назву Podʼа, до якого він належить, {{< glossary_tooltip text="простір імен" term_id="namespace" >}}, у якому працює Pod, назву образу контейнера, ідентифікатор образу, назву образу зі специфікації контейнера, ідентифікатор запущеного контейнера та ідентифікатор Podʼа.

{{% thirdparty-content single="true" %}}

Зовнішній компонент, здатний збирати дані з точки доступу kube-state-metrics (наприклад, через Prometheus), тепер можна використовувати для таких сценаріїв.

## Приклад: використання метрик з kube-state-metrics для запиту стану кластера {#example-kube-state-metrics-query-1}

Серії метрик, які генерує kube-state-metrics, допомагають глибше зрозуміти стан кластера, оскільки їх можна використовувати в запитах.

Якщо ви використовуєте Prometheus або інший інструмент із тією самою мовою запитів, наведений нижче запит PromQL повертає кількість Podʼів, які не готові:

```console
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## Приклад: сповіщення на основі kube-state-metrics {#example-kube-state-metrics-alert-1}

Метрики, які генерує kube-state-metrics, також дозволяють налаштовувати сповіщення про проблеми в кластері.

Якщо ви використовуєте Prometheus або подібний інструмент із тією самою мовою правил сповіщень, наведене нижче сповіщення спрацює, якщо є Podʼи, які перебувають у стані `Terminating` понад 5 хвилин:

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: Pod {{$labels.namespace}}/{{$labels.pod}} blocked in Terminating state.
```
