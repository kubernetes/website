---
title: Дані метрик вузла
content_type: reference
weight: 50
description: >-
  Механізми доступу до метрик на рівні вузла, томів, Pod та контейнерів, як їх бачить kubelet.
---

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) збирає статистичні дані метрик на рівні вузла, томів, pod та контейнерів, і надає цю інформацію через
[Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/).

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

## Pressure Stall Information (PSI) {#psi}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

У бета-версії Kubernetes ви можете налаштувати kubelet для збору інформації про використання ядром Linux [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) щодо використання CPU, памʼяті та вводу-виводу. Інформація збирається на рівні вузлів, podʼів та контейнерів. Докладну схему див. у [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/). Ця функція є стандартно увімкненою через [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletPSI`. Інформацію також наведено у [Prometheus metrics](/docs/concepts/cluster-administration/system-metrics#psi-metrics).

Для того, щоб зрозуміти метрики PSI, ви можете ознайомитися зі статею [Розуміння метрик PSI](/docs/reference/instrumentation/understand-psi-metrics/).

### Вимоги {#requirements}

Pressure Stall Information вимагає:

- [Ядро Linux версії 4.20 чи новіше](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}}

На сторінках завдань для [Виправлення неполадок у кластерах](/docs/tasks/debug/debug-cluster/) обговорюється, як використовувати конвеєр метрик, який залежить від цих даних.
