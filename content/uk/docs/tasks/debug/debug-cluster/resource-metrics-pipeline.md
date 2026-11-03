---
title: Конвеєр метрик ресурсів
content_type: concept
weight: 15
---

<!-- overview -->

Для Kubernetes _Metrics API_ пропонує базовий набір метрик для підтримки автоматичного масштабування та подібних випадків використання. Це API робить доступною інформацію про використання ресурсів вузлами й Podʼами, зокрема метрики CPU та памʼяті. Якщо ви розгорнете Metrics API у своєму кластері, клієнти API Kubernetes зможуть запитувати цю інформацію, а ви зможете використовувати механізми контролю доступу Kubernetes для керування дозволами на це.

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA) і [VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA) використовують дані з Metrics API, щоб коригувати кількість реплік і ресурси робочих навантажень відповідно до попиту користувачів.

Ви також можете переглядати метрики ресурсів, використовуючи команду [`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top).

{{< note >}}
Metrics API та конвеєр метрик, який воно уможливлює, надають лише мінімальний набір метрик CPU та памʼяті для автоматичного масштабування за допомогою HPA та / або VPA. Якщо ви хочете надати повніший набір метрик, ви можете доповнити простіший Metrics API, розгорнувши другий [конвеєр метрик](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline), який використовує _Custom Metrics API_.
{{< /note >}}

Схема 1 ілюструє архітектуру конвеєра метрик ресурсів.

{{< mermaid >}}
flowchart RL
subgraph cluster[Кластер]
    direction RL
    S[ <br><br> ]
    A[Сервер-<br>метрик]
    subgraph B[Вузли]
        direction TB
        D[cAdvisor] --> C[kubelet]
        E[Середовище<br>виконання<br>контейнерів] --> D
        E1[Середовище<br>виконання<br>контейнерів] --> D
        P[Дані Podʼа] -.- C
    end
    L[API-сервер]
    W[HPA]
    C ---->|метрики ресурсів<br>на рівні вузла| A -->|Metrics<br>API| L --> W
end
L ---> K[kubectl<br>top]
classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
class W,B,P,K,cluster,D,E,E1 box
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class S spacewhite
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
class A,L,C k8s
{{< /mermaid >}}

Схема 1. Конвеєр метрик ресурсів

Компоненти архітектури, справа наліво на схемі, такі:

* [cAdvisor](https://github.com/google/cadvisor): демон, вбудований у kubelet, для збирання, агрегування та надання метрик контейнерів.
* [kubelet](/docs/concepts/architecture/#kubelet): агент вузла для керування ресурсами контейнерів. Метрики ресурсів доступні через точки доступу API kubelet `/metrics/resource` і `/stats`.
* [метрики ресурсів на рівні вузла](/docs/reference/instrumentation/node-metrics): API, який надає kubelet для виявлення й отримання підсумкової статистики по вузлу, доступної через точку доступу `/metrics/resource`.
* [metrics-server](#metrics-server): компонент-надбудова кластера, який збирає й агрегує метрики ресурсів, отримані від кожного kubelet. API-сервер обслуговує Metrics API для HPA, VPA і команди `kubectl top`. Metrics Server — це еталонна реалізація Metrics API.
* [Metrics API](#metrics-api): API Kubernetes, що надає доступ до даних про CPU та памʼять, які використовуються для автомасштабування робочих навантажень. Щоб це працювало у вашому кластері, потрібен API-сервер розширення, який надає Metrics API.

  {{< note >}}
  cAdvisor підтримує читання метрик з cgroups, що працює зі звичайними середовищами виконання контейнерів у Linux. Якщо ви використовуєте середовище виконання контейнерів з іншим механізмом ізоляції ресурсів, наприклад віртуалізацією, це середовище виконання контейнерів має підтримувати [метрики контейнерів CRI](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/cri-container-stats.md), щоб метрики були доступні kubelet.
  {{< /note >}}

<!-- body -->

## Metrics API {#metrics-api}

{{< feature-state for_k8s_version="1.37" state="stable" >}}

Metrics-server реалізує Metrics API. Це API дає змогу отримати дані про використання CPU та памʼяті вузлами й Podʼами вашого кластера. Його основна роль — передавати метрики використання ресурсів компонентам автомасштабування K8s.

Ось приклад запиту до Metrics API для вузла `minikube`, обробленого через `jq` для зручного перегляду:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1/nodes/minikube" | jq '.'
```

Той самий виклик API за допомогою `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1/nodes/minikube
```

Приклад відповіді:

```json
{
  "kind": "NodeMetrics",
  "apiVersion": "metrics.k8s.io/v1",
  "metadata": {
    "name": "minikube",
    "selfLink": "/apis/metrics.k8s.io/v1/nodes/minikube",
    "creationTimestamp": "2022-01-27T18:48:43Z"
  },
  "timestamp": "2022-01-27T18:48:33Z",
  "window": "30s",
  "usage": {
    "cpu": "487558164n",
    "memory": "732212Ki"
  }
}
```

Ось приклад запиту до Metrics API для Podʼа `kube-scheduler-minikube` у просторі імен `kube-system`, обробленого через `jq` для зручного перегляду:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

Той самий виклик API за допомогою `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1/namespaces/kube-system/pods/kube-scheduler-minikube
```

Приклад відповіді:

```json
{
  "kind": "PodMetrics",
  "apiVersion": "metrics.k8s.io/v1",
  "metadata": {
    "name": "kube-scheduler-minikube",
    "namespace": "kube-system",
    "selfLink": "/apis/metrics.k8s.io/v1/namespaces/kube-system/pods/kube-scheduler-minikube",
    "creationTimestamp": "2022-01-27T19:25:00Z"
  },
  "timestamp": "2022-01-27T19:24:31Z",
  "window": "30s",
  "containers": [
    {
      "name": "kube-scheduler",
      "usage": {
        "cpu": "9559630n",
        "memory": "22244Ki"
      }
    }
  ]
}
```

Metrics API визначено в репозиторії [k8s.io/metrics](https://github.com/kubernetes/metrics). Вам потрібно увімкнути [шар агрегації API](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) та зареєструвати [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) для API `metrics.k8s.io`.

Щоб дізнатися більше про Metrics API, дивіться [дизайн API метрик ресурсів](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md), [репозиторій metrics-server](https://github.com/kubernetes-sigs/metrics-server) і [API метрик ресурсів](https://github.com/kubernetes/metrics#resource-metrics-api).

{{< note >}}
Щоб отримати доступ до Metrics API, потрібно розгорнути metrics-server або інший адаптер, який його надає.
{{< /note >}}

## Вимірювання використання ресурсів {#measuring-resource-usage}

### CPU {#cpu}

CPU відображається як середнє використання ядер, виміряне в одиницях CPU. Один CPU у Kubernetes еквівалентний 1 vCPU/ядру в хмарних провайдерів і 1 гіперпотоку на процесорах Intel на bare-metal.

Це значення отримують, обчислюючи швидкість зміни накопичувального лічильника CPU, який надає ядро (і в Linux, і в Windows). Часове вікно, використане для обчислення CPU, показано в полі window у Metrics API.

Щоб дізнатися більше про те, як Kubernetes розподіляє та вимірює ресурси CPU, дивіться [значення CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).

### Памʼять {#memory}

Памʼять відображається як робочий набір, виміряний у байтах, у момент збору метрики.

В ідеальному світі "робочий набір" — це обсяг памʼяті, що використовується й не може бути звільнений за умов тиску на памʼять. Однак обчислення робочого набору залежить від ОС хоста й, як правило, значною мірою покладається на евристики для отримання оцінки.

Модель Kubernetes для робочого набору контейнера очікує, що середовище виконання контейнерів враховує анонімну памʼять, повʼязану з відповідним контейнером. Метрика робочого набору зазвичай також включає деяку кешовану памʼять (file-backed), оскільки ОС хоста не завжди може звільнити сторінки.

Щоб дізнатися більше про те, як Kubernetes розподіляє та вимірює ресурси памʼяті, дивіться [значення памʼяті](/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory).

## Metrics Server {#metrics-server}

Metrics-server отримує метрики ресурсів від kubelet і надає їх через Metrics API на API-сервері Kubernetes для використання HPA та VPA. Ці метрики також можна переглядати командою `kubectl top`.

Metrics-server використовує API Kubernetes для відстеження вузлів і Podʼів у вашому кластері. Metrics-server запитує кожен вузол через HTTP, щоб отримати метрики. Metrics-server також будує внутрішнє подання метаданих Podʼів і зберігає кеш стану справності Podʼів. Ця кешована інформація про стан справності Podʼів доступна через API розширення, яке надає metrics-server.

Наприклад, для запиту HPA metrics-server має визначити, які Podʼи відповідають селекторам міток у Deployment.

Metrics-server викликає [API kubelet](/docs/reference/command-line-tools-reference/kubelet/) для збору метрик з кожного вузла. Залежно від версії metrics-server використовується:

* Точка доступу ресурсів метрик `/metrics/resource` у версії v0.6.0+ або
* Точка доступу Summary API `/stats/summary` у старіших версіях

## {{% heading "whatsnext" %}} {#what-s-next}

Щоб дізнатися більше про metrics-server, перегляньте [репозиторій metrics-server](https://github.com/kubernetes-sigs/metrics-server).

Також можна переглянути таке:

* [дизайн metrics-server](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [часті запитання щодо metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [відомі проблеми metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [випуски metrics-server](https://github.com/kubernetes-sigs/metrics-server/releases)
* [Горизонтальне автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale/)

Щоб дізнатися про те, як kubelet надає метрики вузла, і як ви можете отримати до них доступ через API Kubernetes, прочитайте [Дані метрик вузлів](/docs/reference/instrumentation/node-metrics).
