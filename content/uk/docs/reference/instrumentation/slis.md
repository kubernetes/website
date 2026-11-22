---
title: Метрики SLI компонентів Kubernetes
linkTitle: Метрики Індикаторів Рівня Обслуговування
content_type: reference
weight: 20
description: >-
  Високорівневі показники для вимірювання надійності та продуктивності компонентів Kubernetes.
---

<!-- overview -->

{{< feature-state feature_gate_name="ComponentSLIs" >}}

Типово Kubernetes {{< skew currentVersion >}} публікує метрики Індикаторів Рівня Обслуговування (SLI) для кожного компонентного бінарного файлу Kubernetes. Ця точка доступу метрики відкривається на порту HTTPS кожного компонента за шляхом `/metrics/slis`. [Функціональна можливість](/docs/reference/command-line-tools-reference/feature-gates/) `ComponentSLIs` типово увімкнена для кожного компонента Kubernetes починаючи з версії v1.27.

<!-- body -->

## Метрики SLI {#sli-metrics}

З увімкненими метриками SLI кожен компонент Kubernetes відкриває дві метрики, позначені для кожної перевірки стану:

- вимірювач (gauge, який представляє поточний стан перевірки стану)
- лічильник (counter, який записує накопичувальні підрахунки, спостережені для кожного стану перевірки стану)

Ви можете використовувати інформацію метрики для розрахунку статистики доступності кожного компонента. Наприклад, сервер API перевіряє стан etcd. Ви можете визначити та повідомити, наскільки доступним чи недоступним був etcd — як повідомляє його клієнт, сервер API.

Дані вимірювача Prometheus виглядають так:

```none
# HELP kubernetes_healthcheck [ALPHA] Ця метрика записує результат однієї перевірки стану.
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

```none
# HELP kubernetes_healthchecks_total [ALPHA] Ця метрика записує результати всіх перевірок стану.
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
