---
layout: blog
title: "为 Kubernetes 构建自定义指标导出器"
date: 2026-07-14T10:00:00-08:00
slug: custom-metrics-exporter-kubernetes
author: >
  Victor David Effiok
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Building a Custom Metrics Exporter for Kubernetes"
date: 2026-07-14T10:00:00-08:00
slug: custom-metrics-exporter-kubernetes
author: >
  Victor David Effiok
-->

<!--
Kubernetes ships with built-in awareness of CPU and memory, but most
real-world scaling decisions depend on signals that live entirely outside
that narrow window: how many messages are waiting in a queue, how long
the last batch job took, how many active WebSocket connections a pod is
holding. When the built-in metrics are not enough, a _metrics exporter_
bridges that gap.
-->
Kubernetes 内置了对 CPU 和内存的感知能力，但大多数实际的扩缩容决策所依赖的信号完全超出了这个范围：
队列中有多少消息在等待、上一个批处理作业花费了多长时间、Pod 持有多少个活跃的 WebSocket 连接。
当内置指标不够用时，**指标导出器（metrics exporter）** 可以填补这一空白。

<!--
This post walks through writing one from scratch, packaging it as a
container, and wiring it into a cluster so that Prometheus — and
ultimately the [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) — can consume it.
-->
本文将从头开始编写一个指标导出器，将其打包为容器，并将其接入集群，以便
Prometheus —— 最终是 [HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) —— 能够消费这些指标。

<!--
## What a metrics exporter actually does
-->
## 指标导出器实际上做什么

<!--
An exporter is a small HTTP server with a single responsibility: expose
application state as text on a `/metrics` endpoint. Prometheus _scrapes_
that endpoint on a regular interval, stores the time-series data, and
makes it available for queries, alerts, and autoscaling rules.
-->
导出器是一个小型 HTTP 服务器，只有一个职责：将应用状态以文本形式暴露在 `/metrics` 端点上。
Prometheus 定期**抓取**该端点，存储时间序列数据，并使其可用于查询、告警和自动扩缩容规则。

<!--
In some cases you can instrument your application directly — embedding
the Prometheus client library and exposing `/metrics` from within the
same process — rather than running a separate exporter. A standalone
exporter makes more sense when the data source is external to your
application or when you do not control the application code.
-->
在某些情况下，你可以直接在应用中添加监控 —— 嵌入 Prometheus 客户端库并从同一进程中暴露
`/metrics` —— 而不是运行单独的导出器。
当数据源位于应用外部或你无法控制应用代码时，独立的导出器更有意义。

<!--
The format Prometheus expects is plain text — one metric per line, with
a name, optional labels, and a numeric value. Client libraries handle
the serialization for you, so in practice you only need to decide what
to measure and call the right function when that value changes.
-->
Prometheus 期望的格式是纯文本 —— 每行一个指标，包含名称、可选标签和数值。
客户端库会处理序列化，因此实际上你只需要决定要测量什么，并在值变化时调用正确的函数。

<!--
## Choosing what to measure
-->
## 选择要暴露的内容

<!--
Before writing any code, it helps to decide what kind of signal you are
dealing with. The Prometheus data model has three main types:
-->
在编写任何代码之前，最好先确定你要处理的信号类型。Prometheus 数据模型有三种主要类型：

<!--
- _Counters_ only ever increase. They are the right tool for totals:
  requests served, jobs processed, errors encountered. Never use a
  counter for a value that can go down.

- _Gauges_ represent a current snapshot of a value that can rise and
  fall freely. Queue depth, active connections, and cache size are all
  gauges.

- _Histograms_ record the distribution of observed values, such as
  request latency. They let you calculate percentiles (p99, p50) rather
  than just averages.
-->
- **Counter**（计数器）只会增加。
  它们是统计总量的正确工具：服务的请求数、处理的作业数、遇到的错误数。永远不要用计数器来表示可能下降的值。

- **Gauge**（仪表）代表一个可以自由上升和下降的值的当前快照。
  队列深度、活跃连接数和缓存大小都是仪表。

- **Histogram**（直方图）记录观察值的分布，如请求延迟。
  它们允许你计算百分位数（p99、p50）而不仅仅是平均值。

<!--
Once you know which type fits your signal, choose a name that follows
the convention `<namespace>_<name>_<unit>` in `snake_case`. A job
processor might expose `worker_jobs_processed_total` (counter),
`worker_queue_depth` (gauge), and `worker_job_duration_seconds`
(histogram). Clear names save everyone debugging time later.
-->
一旦你知道哪种类型适合你的信号，选择一个遵循 `<namespace>_<name>_<unit>`
约定的 `snake_case` 名称。
一个作业处理器可能会暴露 `worker_jobs_processed_total`（计数器）、`worker_queue_depth`（仪表）
和 `worker_job_duration_seconds`（直方图）。清晰的名称可以节省以后的调试时间。

<!--
## Setting up the project
-->
## 设置项目

<!--
The Go Prometheus client is the most common choice for exporters in the
Kubernetes ecosystem, largely because the same library powers most of
the official Kubernetes components. Start by creating a module and
pulling in the dependency:
-->
Go Prometheus 客户端是 Kubernetes 生态系统中导出器最常见的选择，
主要因为大多数官方 Kubernetes 组件都使用同一个库。首先创建一个模块并引入依赖：

```bash
mkdir my-exporter && cd my-exporter
go mod init example.com/my-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

<!--
## Registering metrics
-->
## 注册指标

<!--
Create `main.go`. The first thing to do is declare the metrics and
register them with Prometheus's default registry. Registration tells
the library that these metrics exist so they appear in the output even
before the first observation is recorded:
-->
创建 `main.go`。首先要做的是声明指标并将它们注册到 Prometheus 的默认注册表中。
注册告诉库这些指标存在，因此即使在记录第一个观测值之前，它们也会出现在输出中：

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

<!--
`prometheus.MustRegister` panics on a duplicate registration, which
makes misconfigurations obvious at startup rather than silently at
runtime. If you are embedding this exporter inside a library that other
packages will also instrument, prefer `prometheus.Register` and handle
the error yourself.
-->
`prometheus.MustRegister` 在重复注册时会 panic，这使得配置错误在启动时就很明显，而不是在运行时静默发生。
如果你将此导出器嵌入到其它包也会添加监控的库中，建议使用 `prometheus.Register` 并自行处理错误。

<!--
## Collecting real values
-->
## 收集实际值

<!--
With the metrics registered, the next step is to keep them current.
The pattern below shows a polling loop — a goroutine that periodically
reads from whatever data source your application owns and updates the
registered metrics. Replace the simulated values with real calls to
your database, internal API, or message broker:
-->
指标注册后，下一步是保持它们的更新。
下面的模式显示了一个轮询循环 —— 一个 goroutine，定期从应用拥有的任何数据源读取数据并更新注册的指标。
将模拟值替换为对数据库、内部 API 或消息代理的实际调用：

```go
import (
    "math/rand"
    "time"
)

func collectMetrics() {
    for {
        // Replace these with real reads from your application.
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

<!--
The polling interval (here five seconds) should be shorter than
Prometheus's scrape interval so that each scrape sees a fresh value.
The default scrape interval in most cluster deployments is fifteen
seconds, which gives you comfortable headroom.
-->
轮询间隔（此处为五秒）应短于 Prometheus 的抓取间隔，以便每次抓取都能看到最新值。
大多数集群部署中的默认抓取间隔是十五秒，这给了你足够的余量。

<!--
## Exposing the endpoint
-->
## 暴露端点

<!--
Wire the collection loop and the HTTP handler together in `main`. A
`/healthz` path alongside `/metrics` gives Kubernetes a liveness probe
target without exposing metric data on the health route:
-->
在 `main` 中将收集循环和 HTTP 处理器连接在一起。
`/healthz` 路径与 `/metrics` 一起提供，使 Kubernetes 有一个存活探针目标，而不会在健康路由上暴露指标数据：

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

<!--
Verify the output locally before building the image:
-->
在构建镜像之前，先在本地验证输出：

```bash
go run .
curl http://localhost:8080/metrics | grep worker_
```

<!--
You should see three `# HELP` and `# TYPE` blocks followed by the
current metric values. If those lines appear, the exporter is working
correctly and is ready to be containerized.
-->
你应该看到三个 `# HELP` 和 `# TYPE` 块，后面跟着当前的指标值。
如果这些行出现，说明导出器工作正常，可以进行容器化了。

<!--
## Build a container image
-->
## 构建容器镜像

<!--
A multi-stage build keeps the final image small and avoids shipping a
Go toolchain to production. The first stage compiles a statically linked
binary; the second stage copies only that binary into a minimal base.
The example below uses Docker, but the same pattern works with any
OCI-compatible build tool such as Buildah or Podman:
-->
多阶段构建使最终镜像更小，并避免将 Go 工具链运送到生产环境。
第一阶段编译静态链接的二进制文件；第二阶段只将该二进制文件复制到最小化的基础镜像中。
下面的示例使用 Docker，但相同的模式适用于任何 OCI 兼容的构建工具，如 Buildah 或 Podman：

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

<!--
`distroless/static:nonroot` contains no shell, no package manager, and
runs as a non-root user by default, which satisfies most cluster
security policies without extra configuration.
-->
`distroless/static:nonroot` 不包含 shell、不包含包管理器，
并且默认以非 root 用户身份运行，这在无需额外配置的情况下满足了大多数集群安全策略。

<!--
Build and push the image, replacing `<registry>` with your own registry
address:
-->
构建并推送镜像，将 `<registry>` 替换为你自己的镜像仓库地址：

```bash
docker build -t <registry>/my-exporter:v1.0.0 .
docker push <registry>/my-exporter:v1.0.0
```

<!--
## Deploying to the cluster
-->
## 部署到集群

<!--
Two manifests are enough to run the exporter: a Deployment that manages
the pod lifecycle, and a Service that gives Prometheus a stable address
to scrape.

The examples below use the `monitoring` namespace, which is a common
convention when running Prometheus and related components together. Adjust
the namespace to match your own cluster setup.

The Deployment sets conservative resource limits appropriate for a
lightweight sidecar-style process, and uses the `/healthz` route for
its liveness probe:
-->
运行导出器只需要两个清单：一个管理 Pod 生命周期的 Deployment，
以及一个为 Prometheus 提供稳定抓取地址的 Service。

下面的示例使用 `monitoring` 命名空间，这是一起运行 Prometheus
和相关组件时的常见约定。根据你自己的集群设置调整命名空间。

Deployment 设置了适合轻量级边车式进程的保守资源限制，并使用 `/healthz` 路由作为存活探针：

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

<!--
The Service names the port `metrics`, which the ServiceMonitor in the
next section will reference by that name:
-->
Service 将端口命名为 `metrics`，下一节中的 ServiceMonitor 将通过该名称引用它：

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

<!--
Apply both:
-->
应用这两个清单：

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

<!--
## Telling Prometheus where to look
-->
## 告诉 Prometheus 去哪里找

<!--
How you configure scraping depends on how Prometheus was installed.

**Option 1: Prometheus Operator (ServiceMonitor)**

If you installed Prometheus using the
[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
or the `kube-prometheus-stack` Helm chart, the operator must be running
in your cluster before you create a ServiceMonitor. The `release` label
must match the label selector configured on your Prometheus resource —
`kube-prometheus-stack` is the default for a standard Helm install:
-->
如何配置抓取取决于 Prometheus 的安装方式。

**选项 1：Prometheus Operator（ServiceMonitor）**

如果你使用 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
或 `kube-prometheus-stack` Helm Chart 安装了 Prometheus，
那么在创建 ServiceMonitor 之前，Operator 必须在你的集群中运行。
`release` 标签必须与 Prometheus 资源上配置的标签选择器匹配——标准 Helm 安装的默认值是 `kube-prometheus-stack`：

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

<!--
**Option 2: Annotation-based discovery**

If your Prometheus uses annotation-based pod discovery instead, you will
need a matching `scrape_config` rule in your Prometheus configuration —
check with whoever manages your Prometheus installation to confirm it is
in place.

You can add the following two annotations to the Pod template regardless
of which scraping method you use. They are ignored by the Prometheus
Operator but picked up automatically by annotation-based setups:
-->
**选项 2：基于注解的发现**

如果你的 Prometheus 使用基于注解的 Pod 发现，那么你需要在 Prometheus
配置中添加匹配的 `scrape_config` 规则 —— 请与管理你 Prometheus 安装的人确认它已到位。

无论你使用哪种抓取方法，都可以向 Pod 模板添加以下两个注解。
Prometheus Operator 会忽略它们，但基于注解的设置会自动抓取它们：

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"     # omit if not using annotation-based discovery
  prometheus.io/path: "/metrics" # omit if not using annotation-based discovery
```

<!--
If you are unsure which setup your cluster uses, the ServiceMonitor
approach is more explicit and easier to debug.
-->
如果你不确定你的集群使用哪种设置，ServiceMonitor 方法更明确且更容易调试。

<!--
## Verifying the scrape
-->
## 验证抓取

<!--
Port-forward to the Prometheus service and open the targets page to
confirm the exporter has been discovered:
-->
端口转发到 Prometheus 服务并打开目标页面，确认导出器已被发现：

```bash
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```

<!--
Navigate to `http://localhost:9090/targets`. The `my-exporter` target
should appear with state **UP**. If it shows **DOWN**, check that the
ServiceMonitor's `release` label matches and that the pod is running:
-->
导航到 `http://localhost:9090/targets`。`my-exporter` 目标应该显示状态为 **UP**。
如果显示为 **DOWN**，请检查 ServiceMonitor 的 `release` 标签是否匹配以及 Pod 是否正在运行：

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=my-exporter
kubectl describe servicemonitor my-exporter -n monitoring
```

<!--
Once the target is healthy, run a quick query in the expression browser
to confirm data is flowing:
-->
目标健康后，在表达式浏览器中运行快速查询，确认数据正在流动：

```
rate(worker_jobs_processed_total{status="success"}[2m])
```

<!--
A non-zero result here means the full pipeline is working: your
application is producing data, Prometheus is scraping it, and the
time-series are stored and queryable.
-->
非零结果意味着整个管道正在工作：你的应用正在生成数据，Prometheus 正在抓取它，时间序列已存储且可查询。

<!--
## What comes next
-->
## 下一步是什么

<!--
A working exporter is the foundation, not the destination. The natural
next step is surfacing these metrics to the
[HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
so that your workload scales on the signals that actually drive load,
not just CPU. That requires a metrics adapter — the Prometheus Adapter
is the most widely deployed option — which registers your custom metrics
with the Kubernetes Custom Metrics API. Once registered, any
HorizontalPodAutoscaler in the cluster can reference `worker_queue_depth`
or `worker_jobs_processed_total` directly in its `metrics` block.
-->
一个工作正常的导出器是基础，而不是终点。自然的下一步是将这些指标呈现给
[HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)，
以便你的工作负载根据实际驱动负载的信号进行扩缩容，而不仅仅是 CPU。
这需要一个指标适配器 —— Prometheus Adapter 是部署最广泛的选项 —— 它将你的自定义指标注册到
Kubernetes Custom Metrics API。一旦注册，集群中的任何 HorizontalPodAutoscaler
都可以在其 `metrics` 块中直接引用 `worker_queue_depth` 或 `worker_jobs_processed_total`。

<!--
For a walkthrough of that setup, see
[Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
For a catalog of ready-made exporters covering databases, message
brokers, and cloud services, the
[Prometheus exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/)
page is a good starting point.
-->
有关该设置的演练，请参阅
[基于多个指标和自定义指标进行自动扩缩容](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)。
有关涵盖数据库、消息代理和云服务的现成导出器目录，请访问
[Prometheus exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/)
页面，这是一个很好的起点。
