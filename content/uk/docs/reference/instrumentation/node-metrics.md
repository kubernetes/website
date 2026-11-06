---
title: Дані метрик вузла
content_type: reference
weight: 50
description: >-
  Механізми доступу до метрик на рівні вузла, томів, Podʼів та контейнерів, як їх бачить kubelet.
---

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) збирає статистичні дані метрик на рівні вузла, томів, Podʼів та контейнерів, і надає цю інформацію через
[Summary API](/docs/reference/kubelet-api/stats.v1alpha1/).

Ви можете надіслати проксійований запит до Summary API через API-сервер Kubernetes.

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
Починаючи з `metrics-server` версії 0.6.x, `metrics-server` запитує точку доступу kubelet `/metrics/resource`, а не `/stats/summary`.
{{< /note >}}

## Джерело метрик Summary API {#summary-api-source}

Типово Kubernetes отримує дані зведених метрик вузла, використовуючи вбудований [cAdvisor](https://github.com/google/cadvisor), який працює в kubelet. Якщо ви увімкнете функціональну можливість [`PodAndContainerStatsFromCRI`](/docs/reference/command-line-tools-reference/feature-gates/#PodAndContainerStatsFromCRI) у вашому кластері та використовуєте середовище виконання контейнерів, яке підтримує доступ до статистики через {{< glossary_tooltip term_id="cri" text="інтерфейс середовища виконання контейнерів">}} (CRI), тоді kubelet [отримує дані метрик на рівні Podʼів та контейнерів за допомогою CRI](/docs/reference/instrumentation/cri-pod-container-metrics), а не через cAdvisor.

## Pressure Stall Information (PSI) {#psi}

{{< feature-state feature_gate_name="KubeletPSI" >}}

Як стабільна функція, Kubernetes дозволяє налаштувати kubelet для збору інформації ядра Linux [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) щодо використання CPU, памʼяті та вводу-виводу. Інформація збирається на рівні вузлів, Podʼів та контейнерів. Докладну схему див. у [Summary API](/docs/reference/kubelet-api/stats.v1alpha1/). Починаючи з Kubernetes v1.36, функціональна можливість [`KubeletPSI`](/docs/reference/command-line-tools-reference/feature-gates/#KubeletPSI) заблокована в значенні true і не може бути вимкнена. Інформація також доступна в [метриках Prometheus](/docs/concepts/cluster-administration/system-metrics#psi-metrics).

Для того, щоб зрозуміти метрики PSI, ви можете ознайомитися зі статтею [Розуміння метрик PSI](/docs/reference/instrumentation/understand-psi-metrics/).

### Вимоги {#requirements}

Pressure Stall Information вимагає:

- [Ядро Linux версії 4.20 чи новіше](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}} {#what-s-next}

На сторінках завдань розділу [Усунення несправностей кластерів](/docs/tasks/debug/debug-cluster/) обговорюється, як використовувати конвеєр метрик, який залежить від цих даних.
