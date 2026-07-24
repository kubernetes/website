---
layout: blog
title: "Створення власного експортера метрик для Kubernetes"
date: 2026-07-14T10:00:00-08:00
slug: custom-metrics-exporter-kubernetes
author: >
  Victor David Effiok
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Kubernetes має вбудовану підтримку моніторингу CPU та памʼяті, але більшість рішень щодо масштабування в реальних сценаріях залежать від сигналів, які знаходяться повністю поза цими вузькими межами: скільки повідомлень чекають у черзі, скільки часу тривало останнє пакетне завдання, скільки активних WebSocket-зʼєднань утримує под. Коли вбудованих метрик недостатньо, _експортер метрик_ заповнює цю прогалину.

У цій статті ми розглянемо створення такого експортера з нуля, пакування його в контейнер та підключення до кластера, щоб Prometheus, і зрештою [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/), могли його використовувати.

## Що насправді робить експортер метрик {#what-a-metrics-exporter-actually-does}

Експортер — це невеликий HTTP-сервер з єдиним завданням: повідомляти стан застосунку у вигляді тексту в точці доступу `/metrics`. Prometheus _збирає_ дані з цієї точки доступу з певним інтервалом, зберігає часові ряди та робить їх доступними для запитів, сповіщень і правил автозмасштабування.

У деяких випадках ви можете інструментувати застосунок безпосередньо — вбудувати клієнтську бібліотеку Prometheus та відкрити `/metrics` всередині того ж процесу, замість запуску окремого експортера. Окремий експортер має більше сенсу, коли джерело даних знаходиться зовні вашого застосунку або коли ви не контролюєте код застосунку.

Формат, який очікує Prometheus — це звичайний текст: одна метрика на рядок, з назвою, опціональними мітками та числовим значенням. Клієнтські бібліотеки беруть на себе серіалізацію, тому на практиці вам потрібно лише вирішити, що вимірювати, та викликати відповідну функцію, коли значення змінюється.

## Вибір того, що вимірювати {#choosing-what-to-measure}

Перед написанням коду варто визначитися, з яким типом сигналу ви маєте справу. Модель даних Prometheus має три основні типи:

- _Лічильники_ (_Counters_) лише збільшуються. Вони підходять для підсумкових значень: кількість оброблених запитів, виконаних завдань, виниклих помилок. Ніколи не використовуйте лічильник для значення, яке може зменшуватися.

- _Вимірювачі_ (_Gauges_) представляють поточний знімок значення, яке може вільно зростати та спадати. Глибина черги, активні зʼєднання та розмір кешу — все це вимірювачі.

- _Гістограми_ (_Histograms_) записують розподіл спостережуваних значень, наприклад, затримку запитів. Вони дозволяють обчислювати перцентилі (p99, p50), а не лише середні значення.

Коли ви знаєте, який тип підходить для вашого сигналу, оберіть назву відповідно до конвенції `<простір_імен>_<назва>_<одиниця>` у форматі `snake_case`. Обробник завдань може надавати `worker_jobs_processed_total` (лічильник), `worker_queue_depth` (вимірювач) та `worker_job_duration_seconds` (гістограма). Зрозумілі назви заощаджують час усім під час налагодження.

## Налаштування проєкту {#setting-up-the-project}

Клієнт Prometheus для Go є найпоширенішим вибором для експортерів в екосистемі Kubernetes, значною мірою тому, що ця ж бібліотека використовується в більшості офіційних компонентів Kubernetes. Почніть зі створення модуля та додавання залежності:

```bash
mkdir my-exporter && cd my-exporter
go mod init example.com/my-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

## Реєстрація метрик {#registering-metrics}

Створіть `main.go`. Перше, що потрібно зробити — оголосити метрики та зареєструвати їх у стандартному реєстрі Prometheus. Реєстрація повідомляє бібліотеці, що ці метрики існують, тому вони зʼявляться у виводі навіть до того, як буде записано перше спостереження:

```go
package main

import (
    "log"
    "net/http"

    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    jobsProcessed = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "worker_jobs_processed_total",
            Help: "Total number of jobs processed, partitioned by status.",
        },
        []string{"status"},
    )

    queueDepth = prometheus.NewGauge(prometheus.GaugeOpts{
        Name: "worker_queue_depth",
        Help: "Current number of jobs waiting in the queue.",
    })

    jobDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
        Name:    "worker_job_duration_seconds",
        Help:    "Time spent processing a single job.",
        Buckets: prometheus.DefBuckets,
    })
)

func init() {
    prometheus.MustRegister(jobsProcessed, queueDepth, jobDuration)
}
```

`prometheus.MustRegister` викликає паніку у разі дублювання реєстрації, що дозволяє виявити помилки в налаштуваннях одразу під час запуску, а не бути їм непомітними під час роботи програми. Якщо ви вбудовуєте цей експортер у бібліотеку, яку будуть інструментувати інші пакети, використовуйте `prometheus.Register` та обробляйте помилку самостійно.

## Збір реальних значень {#collecting-real-values}

Після реєстрації метрик наступний крок — підтримувати їх в актуальному стані. Ви можете або постійно оновлювати дані в міру їх зміни, або запустити власний внутрішній цикл оновлення. У прикладі нижче показано цикл опитування — goroutine, що періодично читає дані з вашого джерела даних та оновлює зареєстровані метрики. Замініть імітовані значення реальними викликами до вашої бази даних, внутрішнього API або брокера повідомлень:

```go
import (
    "math/rand"
    "time"
)

func collectMetrics() {
    for {
        // Замініть це на реальні дані з вашого застосунку.
        depth := float64(rand.Intn(50))
        queueDepth.Set(depth)

        start := time.Now()
        time.Sleep(time.Duration(rand.Intn(200)) * time.Millisecond)
        jobDuration.Observe(time.Since(start).Seconds())
        jobsProcessed.WithLabelValues("success").Inc()

        time.Sleep(5 * time.Second)
    }
}
```

Інтервал опитування (тут пʼять секунд) має бути коротшим за інтервал збору Prometheus, щоб кожен збір бачив свіже значення. Стандартний інтервал збору в більшості розгортань кластера становить пʼятнадцять секунд, що дає комфортний запас.

## Експонування точки доступу {#exposing-the-endpoint}

Обʼєднайте цикл збору та HTTP-обробник у `main`. Шлях `/healthz` разом із `/metrics` надає Kubernetes ціль для проб життєздатності (liveness probe), не експонуючи дані метрик на цьому шляху:

```go
func main() {
    go collectMetrics()

    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
    })

    log.Println("Listening on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("server error: %v", err)
    }
}
```

Перевірте вивід локально перед створенням образу:

```bash
go run .
curl http://localhost:8080/metrics | grep worker_
```

Ви маєте побачити три блоки `# HELP` та `# TYPE`, за якими слідують поточні значення метрик. Якщо ці рядки зʼявилися, експортер працює правильно та готовий до контейнеризації.

## Створення образу контейнера {#build-a-container-image}

Багатоетапна збірка зберігає кінцевий образ невеликим та дозволяє уникнути постачання інструментів Go у кінцевий образ. Перший етап компілює статично зібраний бінарний файл; другий етап копіює лише цей бінарний файл у мінімальну базову систему. Приклад нижче використовує Docker, але той самий підхід працює з будь-яким OCI-сумісним інструментом, як-от Buildah або Podman:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /exporter .

FROM gcr.io/distroless/static:nonroot
COPY --from=builder /exporter /exporter
EXPOSE 8080
ENTRYPOINT ["/exporter"]
```

`distroless/static:nonroot` не містить оболонки, менеджера пакунків і стандартно працює від імені непривілейованого користувача, що відповідає більшості політик безпеки кластера без додаткового налаштування.

Зберіть та відправте образ, замінивши `<registry>` на адресу вашого реєстру:

```bash
docker build -t <registry>/my-exporter:v1.0.0 .
docker push <registry>/my-exporter:v1.0.0
```

(Примітка: використання конвеєра CI/CD для автоматизації цього процесу зазвичай є кращим підходом, ніж ручне виконання цих команд.)

## Розгортання в кластері {#deploying-to-the-cluster}

Двох маніфестів достатньо для запуску експортера: Deployment, який керує життєвим циклом подів, та Service, який надає Prometheus стабільну адресу для збору даних. (Ви можете налаштувати Prometheus на збір даних з кожного поду; якщо це має сенс для вашого випадку використання, то це також допустимо).

Приклади нижче використовують простір імен `monitoring`, що є поширеною практикою при запуску Prometheus та повʼязаних компонентів разом. Відкоригуйте простір імен відповідно до налаштувань вашого кластера.

Deployment встановлює консервативні обмеження ресурсів, прийнятні для легковагового процесу в стилі sidecar, та використовує шлях `/healthz` для своєї проби життєздатності (liveness probe):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    app.kubernetes.io/name: my-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: my-exporter
  template:
    metadata:
      labels:
        app.kubernetes.io/name: my-exporter
    spec:
      containers:
      - name: exporter
        image: <registry>/my-exporter:v1.0.0
        ports:
        - name: metrics
          containerPort: 8080
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

Service називає порт `metrics`, на який посилатиметься ServiceMonitor у наступному розділі:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    app.kubernetes.io/name: my-exporter
spec:
  selector:
    app.kubernetes.io/name: my-exporter
  ports:
  - name: metrics
    port: 8080
    targetPort: metrics
```

Застосуйте обидва:

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

## Налаштування Prometheus для пошуку експортера {#telling-prometheus-where-to-look}

Спосіб налаштування збору даних залежить від того, як встановлено Prometheus.

**Варіант 1: Prometheus Operator (ServiceMonitor)**

Якщо ви встановили Prometheus за допомогою [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) або Helm-чарту `kube-prometheus-stack`, оператор має бути запущений у вашому кластері перед створенням ServiceMonitor. Мітка `release` має збігатися з селектором міток, налаштованим у вашому ресурсі Prometheus —  `kube-prometheus-stack` є стандартним для звичайної установки Helm:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    release: kube-prometheus-stack
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-exporter
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics
```

**Варіант 2: Виявлення на основі анотацій**

Якщо ваш Prometheus використовує виявлення подів на основі анотацій, вам знадобиться відповідне правило `scrape_config` у конфігурації Prometheus — перевірте з тим, хто керує вашим примірником Prometheus, щоб підтвердити наявність такого правила.

Ви можете додати наступні дві анотації до шаблону Podʼа незалежно від методу збору. Вони ігноруються Prometheus Operator, але автоматично підхоплюються системами на основі анотацій:

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"     # опустіть, якщо не використовуєте виявлення на основі анотацій
  prometheus.io/path: "/metrics" # опустіть, якщо не використовуєте виявлення на основі анотацій
```

Якщо ви не впевнені, яке налаштування використовує ваш кластер,
підхід із ServiceMonitor є більш явним і простішим у налагодженні.

## Перевірка збору даних {#verifying-the-scrape}

Виконайте перенаправлення порту до сервісу Prometheus та відкрийте сторінку targets, щоб підтвердити, що експортер знайдено:

```bash
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```

Перейдіть на `http://localhost:9090/targets`. Ціль `my-exporter` має відображатися зі статусом **UP**. Якщо відображається **DOWN**, перевірте, чи збігається мітка `release` у ServiceMonitor та чи працює под:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=my-exporter
kubectl describe servicemonitor my-exporter -n monitoring
```

Коли ціль стане працездатною, виконайте швидкий запит у виразному переглядачі, щоб підтвердити надходження даних:

```none
rate(worker_jobs_processed_total{status="success"}[2m])
```

Ненульовий результат означає, що весь конвеєр працює: ваш застосунок генерує дані, Prometheus їх збирає, а часові ряди зберігаються та доступні для запитів.

## Що далі {#what-comes-next}

Працюючий експортер — це фундамент, а не кінцева мета. Наступним логічним кроком є передача цих метрик до [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/), щоб ваше навантаження масштабувалося на основі сигналів, які дійсно визначають навантаження, а не лише CPU. Для цього потрібен адаптер метрик, Prometheus Adapter є найпоширенішим варіантом, який реєструє ваші власні метрики в Kubernetes Custom Metrics API. Після реєстрації будь-який HorizontalPodAutoscaler у кластері може посилатися на `worker_queue_depth` або `worker_jobs_processed_total` безпосередньо у своєму блоці `metrics`.

Інструкцію з налаштування дивіться в [Автомасштабування на основі кількох метрик і власних метрик](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics). Каталог готових експортерів для баз даних, брокерів повідомлень і хмарних сервісів доступний на сторінці [Prometheus exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/).
