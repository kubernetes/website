---
title: Конвеєер метрик ресурсів
content_type: task
weight: 15
---

<!-- overview -->

Для Kubernetes _Metrics API_ пропонує базовий набір метрик для підтримки автоматичного масштабування та подібних випадків використання. Це API робить доступною інформацію про використання ресурсів для вузла та Podʼа, включаючи метрики для CPU та памʼяті. Якщо ви розгортаєте Metrics API у своєму кластері, клієнти API Kubernetes можуть запитувати цю інформацію, і ви можете використовувати механізми контролю доступу Kubernetes для управління дозволами на це.

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA) та [VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA) використовують дані з API метрик для налаштування реплік робочого навантаження та ресурсів для задоволення вимог користувачів.

Ви також можете переглядати метрики ресурсів, використовуючи команду [`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top).

{{< note >}}
Metrics API та конвеєр метрик, який він дозволяє, надають лише мінімальний набір метрик CPU та памʼяті для автоматичного масштабування за допомогою HPA та / або VPA. Якщо ви хочете надати повніший набір метрик, ви можете доповнити простіший Metrics API, розгорнувши другий
[конвеєр метрик](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline) який використовує _Custom Metrics API_.
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

Компоненти архітектури, справа наліво на схемі, включають наступне:

* [cAdvisor](https://github.com/google/cadvisor): Демон для збору, агрегування та викладання метрик контейнера, включених в Kubelet.
* [kubelet](/docs/concepts/architecture/#kubelet): Агент вузла для управління ресурсами контейнера. Метрики ресурсів доступні за допомогою точок доступу API kubelet `/metrics/resource` та `/stats`.
* [метрики ресурсів на рівні вузла](/docs/reference/instrumentation/node-metrics): API, наданий kubelet для виявлення та отримання підсумкових статистичних даних на рівні вузла, доступних через точку доступу `/metrics/resource`.
* [сервер метрик](#metrics-server): Компонент надбудови кластера, який збирає та агрегує метрики ресурсів, витягнуті з кожного kubelet. Сервер API надає API метрик для використання HPA, VPA та команди `kubectl top`. Сервер метрик є посиланням на реалізацію Metrics API.
* [Metrics API](#metrics-api): API Kubernetes, що підтримує доступ до CPU та памʼяті, використаних для автоматичного масштабування робочого навантаження. Щоб це працювало у вашому кластері, вам потрібен сервер розширення API, який надає API метрик.

  {{< note >}}
  cAdvisor підтримує читання метрик з cgroups, що працює з типовими середовищами виконання контейнерів на Linux. Якщо ви використовуєте середовище виконання контейнерів, яке використовує інший механізм ізоляції ресурсів, наприклад, віртуалізацію, то це середовище виконання контейнерів повинно підтримувати [метрики контейнера CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md) для того, щоб метрики були доступні kubelet.
  {{< /note >}}

<!-- body -->

## Metrics API

{{< feature-state for_k8s_version="1.8" state="beta" >}}

Metrics-server реалізує Metrics API. Це API дозволяє отримувати доступ до використання CPU та памʼяті для вузлів та Podʼів у вашому кластері. Його основна роль — надавати метрики використання ресурсів компонентам автомасштабування K8s.

Ось приклад запиту до Metrics API для вузла `minikube`, обробленого через `jq` для зручного перегляду:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/minikube" | jq '.'
```

Той же самий виклик API, використовуючи `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/nodes/minikube
```

Приклад відповіді:

```json
{
  "kind": "NodeMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "minikube",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/nodes/minikube",
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

Ось приклад запиту до Metrics API для Podʼа `kube-scheduler-minikube`, що міститься в просторі імен `kube-system`, оброблений через `jq` для зручного перегляду:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

Той же самий виклик API, використовуючи `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube
```

Приклад відповіді:

```json
{
  "kind": "PodMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "kube-scheduler-minikube",
    "namespace": "kube-system",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube",
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

Щоб дізнатися більше про Metrics API, див. [дизайн API метрик ресурсів](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md), репозиторій [metrics-server](https://github.com/kubernetes-sigs/metrics-server) та [API метрик ресурсів](https://github.com/kubernetes/metrics#resource-metrics-api).

{{< note >}}
Ви повинні розгорнути metrics-server або альтернативний адаптер, який надає Metrics API, щоб мати змогу отримувати до нього доступ.
{{< /note >}}

## Вимірювання використання ресурсів {#mesuring-resource-usage}

### ЦП {#cpu}

Відомості про CPU показуються як середнє значення використання ядра, виміряне в одиницях процесорного часу. Один CPU, у Kubernetes, еквівалентний 1 віртуальному процесору/ядру для хмарних постачальників, і 1 гіперпотоку на процесорах Intel для bare-metal конфігурацій.

Це значення обчислюється шляхом взяття швидкості над кумулятивним лічильником CPU, який надається ядром (як для Linux, так і для Windows ядер). Вікно часу, яке використовується для обчислення CPU, показано у полі window в Metrics API.

Щоб дізнатися більше про те, як Kubernetes розподіляє та вимірює ресурси CPU, див. [значення CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).

### Памʼять {#memory}

Відомості про памʼять показуються як обсяг робочого набору, виміряний в байтах, в момент збору метрики.

У ідеальному світі "робочий набір" — це обсяг памʼяті, що використовується, який не може бути звільнений під час тиску на памʼять. Однак розрахунок робочого набору варіюється залежно від операційної системи хосту і, як правило, інтенсивно використовує евристики для оцінки.

Модель Kubernetes для робочого набору контейнера передбачає, що робочий набір контейнера, що розглядається, підраховується відносно анонімної памʼяті, повʼязаної з цим контейнером. Зазвичай метрика робочого набору також включає деяку кешовану (файлоподібну) памʼять, оскільки операційна система хосту не завжди може повторно використовувати сторінки.

Щоб дізнатися більше про те, як Kubernetes розподіляє та вимірює ресурси памʼяті, див. [значення памʼяті](/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory).

## Metrics Server

Metrics-server витягує метрики ресурсів з kubeletʼів і надає їх в API-серверу Kubernetes через Metrics API для використання HPA та VPA. Ви також можете переглядати ці метрики за допомогою команди `kubectl top`.

Metrics-server використовує API Kubernetes для відстеження вузлів та Podʼів у вашому кластері. Metrics-server запитує кожний вузол через HTTP, щоб отримати метрики. Metrics-server також створює внутрішнє представлення метаданих про Pod та зберігає кеш стану справності Podʼа. Ця кешована інформація про стан справності Podʼів доступна через розширення API, яке надає metrics-server.

Наприклад, при запиті HPA metrics-server повинен визначити, які Podʼи відповідають селекторам міток у Deployment.

Metrics-server викликає [API kubelet](/docs/reference/command-line-tools-reference/kubelet/) для збору метрик з кожного вузла. Залежно від версії metrics-server використовується:

* Точка доступу ресурсів метрик `/metrics/resource` у версії v0.6.0+ або
* Точка доступу Summary API `/stats/summary` у старших версіях

## {{% heading "whatsnext" %}}

Щоб дізнатися більше про metrics-server, перегляньте [репозиторій metrics-server](https://github.com/kubernetes-sigs/metrics-server).

Також ви можете перевірити наступне:

* [дизайн metrics-server](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [часті запитання щодо metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [відомі проблеми metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [випуски metrics-server](https://github.com/kubernetes-sigs/metrics-server/releases)
* [Горизонтальне автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale/)

Щоб дізнатися про те, як kubelet надає метрики вузла, і як ви можете отримати до них доступ через API Kubernetes, прочитайте [Дані метрик вузлів](/docs/reference/instrumentation/node-metrics).
