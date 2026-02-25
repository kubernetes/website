---
title: Метрики для станів обʼєктів Kubernetes
content_type: concept
weight: 75
description: >-
   kube-state-metrics — це агент-надбудова для генерації та надання метрик на рівні кластера.
---

Стан обʼєктів Kubernetes у Kubernetes API може бути поданий у вигляді метрик. Агент-надбудова [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) може підключатися до сервера Kubernetes API та надавати доступ до точки доступу з метриками, що генеруються зі стану окремих обʼєктів у кластері. Він надає різні дані про стан обʼєктів, такі як мітки та анотації, час запуску та завершення, статус або фазу, в яких обʼєкт знаходиться зараз. Наприклад, контейнери, що працюють у Podʼах, створюють метрику `kube_pod_container_info`. Вона включає імʼя контейнера, імʼя Podʼа, до якого він належить, простір імен, в якому працює Pod, імʼя образу контейнера, ідентифікатор образу, імʼя образу з опису контейнера, ідентифікатор працюючого контейнера та ідентифікатор Podʼа як мітки.

{{% thirdparty-content single="true" %}}

Зовнішній компонент, який може зчитувати точку доступу kube-state-metrics (наприклад, за допомогою Prometheus), можна використовувати для активації наступних варіантів використання.

### Приклад: використання метрик з kube-state-metrics для запиту стану кластера {#example-kube-state-metrics-query-1}

Серії метрик, що генеруються kube-state-metrics, допомагають отримати додаткові уявлення про кластер, оскільки їх можна використовувати для запитів.

Якщо ви використовуєте Prometheus або інструмент, який використовує ту саму мову запитів, наступний запит PromQL поверне кількість Podʼів, які не готові:

```console
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

### Приклад: сповіщення на основі kube-state-metrics {#example-kube-state-metrics-alert-1}

Метрики, що генеруються з kube-state-metrics, також дозволяють сповіщати про проблеми в кластері.

Якщо ви використовуєте Prometheus або схожий інструмент, який використовує ту саму мову правил сповіщень, наступне сповіщення буде активовано, якщо є Podʼи, які перебувають у стані `Terminating` протягом понад 5 хвилин:

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
