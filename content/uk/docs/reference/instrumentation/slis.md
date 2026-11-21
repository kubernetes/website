---
title: Метрики SLI компонентів Kubernetes
linkTitle: Метрики індикаторів рівня обслуговування
content_type: reference
weight: 20
description: >-
  Високорівневі показники для вимірювання надійності та продуктивності компонентів Kubernetes.
---

<!-- overview -->

{{< feature-state feature_gate_name="ComponentSLIs" >}}

Типово Kubernetes {{< skew currentVersion >}} публікує метрики індикаторів рівня обслуговування (SLI) для кожного бінарного файлу компонента Kubernetes. Ця точка доступу метрик надається на порту HTTPS кожного компонента за шляхом `/metrics/slis`. Функціональна можливість [`ComponentSLIs`](/docs/reference/command-line-tools-reference/feature-gates/#ComponentSLIs) типово увімкнена для кожного компонента Kubernetes починаючи з v1.27.

<!-- body -->

## Метрики SLI {#sli-metrics}

З увімкненими метриками SLI кожен компонент Kubernetes надає дві метрики з мітками для кожної перевірки стану:

- вимірювач (gauge, який представляє поточний стан перевірки стану)
- лічильник (counter, який записує накопичувальні підрахунки, спостережені для кожного стану перевірки стану)

Ви можете використовувати інформацію метрики для розрахунку статистики доступності кожного компонента. Наприклад, API-сервер перевіряє стан etcd. Ви можете визначити та повідомити, наскільки доступним чи недоступним був etcd — як повідомляє його клієнт, API-сервер.

Дані вимірювача Prometheus виглядають так:

```
# HELP kubernetes_healthcheck [ALPHA] This metric records the result of a single healthcheck.
# TYPE kubernetes_healthcheck gauge
kubernetes_healthcheck{name="autoregister-completion",type="healthz"} 1
kubernetes_healthcheck{name="autoregister-completion",type="readyz"} 1
kubernetes_healthcheck{name="etcd",type="healthz"} 1
kubernetes_healthcheck{name="etcd",type="readyz"} 1
kubernetes_healthcheck{name="etcd-readiness",type="readyz"} 1
kubernetes_healthcheck{name="informer-sync",type="readyz"} 1
kubernetes_healthcheck{name="log",type="healthz"} 1
kubernetes_healthcheck{name="log",type="readyz"} 1
kubernetes_healthcheck{name="ping",type="healthz"} 1
kubernetes_healthcheck{name="ping",type="readyz"} 1
```

Дані лічильника виглядають так:

```
# HELP kubernetes_healthchecks_total [ALPHA] This metric records the results of all healthcheck.
# TYPE kubernetes_healthchecks_total counter
kubernetes_healthchecks_total{name="autoregister-completion",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="etcd",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="etcd",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="etcd-readiness",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="informer-sync",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="informer-sync",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="log",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="log",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="readyz"} 15
```

## Використання цих даних {#using-this-data}

Точка доступу метрик компонентів SLI призначена для збору даних з високою частотою. Збір даних з високою частотою означає, що ви отримуєте більш точний сигнал вимірювача, який можна потім використовувати для розрахунку SLO. Точка доступу `/metrics/slis` надає необроблені дані, необхідні для розрахунку SLO доступності для відповідного компонента Kubernetes.
