---
title: Дані метрик вузла
content_type: reference
weight: 50
description: >-
  Механізми доступу до метрик на рівні вузла, томів, Pod та контейнерів, як їх бачить kubelet.
---

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) збирає статистичні дані метрик на рівні вузла, томів, pod та контейнерів, і надає цю інформацію через
[Summary API](https://github.com/kubernetes/kubernetes/blob/7d309e0104fedb57280b261e5677d919cb2a0e2d/staging/src/k8s.io/kubelet/pkg/apis/stats/v1alpha1/types.go).

Ви можете надіслати запит з проксі до Summary API через сервер API Kubernetes.

Ось приклад запиту до Summary API для вузла з іменем `minikube`:

```shell
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

Ось той самий виклик API за допомогою `curl`:

```shell
# Спочатку потрібно запустити "kubectl proxy"
# Змініть 8080 на порт, який призначає "kubectl proxy"
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
Починаючи з `metrics-server` версії 0.6.x, `metrics-server` запитує кінцеву точку kubelet `/metrics/resource`, а не `/stats/summary`.
{{< /note >}}

## Джерело метрик Summary API {#summary-api-source}

Стандартно, Kubernetes отримує дані метрик вузлів, використовуючи вбудований [cAdvisor](https://github.com/google/cadvisor), який працює в kubelet. Якщо ви увімкнете [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `PodAndContainerStatsFromCRI` у вашому кластері та використовуєте середовище виконання контейнерів, яке підтримує доступ до статистики через {{< glossary_tooltip term_id="cri" text="Інтерфейс Виконання Контейнерів">}} (CRI), тоді kubelet [отримує дані метрик на рівні Pod та контейнерів за допомогою CRI](/docs/reference/instrumentation/cri-pod-container-metrics), а не через cAdvisor.

## {{% heading "whatsnext" %}}

На сторінках завдань для [Виправлення неполадок у кластерах](/docs/tasks/debug/debug-cluster/) обговорюється, як використовувати конвеєр метрик, який залежить від цих даних.
