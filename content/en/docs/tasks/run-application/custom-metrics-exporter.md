---
title: Create a custom metrics exporter
linkTitle: Custom metrics exporter
content_type: task
weight: 81
---

<!-- overview -->

A _metrics exporter_ is a process that collects application or system data and
exposes it on an HTTP endpoint in a format that a metrics scraper such as
Prometheus can consume.

This page shows you how to write a minimal custom metrics exporter in Go,
package it as a container image, and deploy it to a Kubernetes cluster so
that the exposed metrics become available for autoscaling and alerting.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Requirements include:

- Go 1.21 or later installed on your development machine.
- A container registry your cluster can pull from (for example, Docker Hub or a
  private registry).
- Prometheus running in your cluster. See
  [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
  for a quick-start installation.

<!-- body -->

## Define what to measure

Before writing any code, decide which signals your exporter will expose.
Good metrics candidates are:

- _Counters_ — values that only increase (for example, total processed jobs,
  total errors).
- _Gauges_ — values that can go up or down (for example, queue depth,
  active connections).
- _Histograms_ — distributions of observed values (for example, request
  latency in seconds).

Keep metric names in `snake_case` and include a unit suffix where relevant
(for example, `_seconds`, `_bytes`, `_total`).

## Step 1 — Initialize the Go module

Create a project directory and initialize a Go module:

```bash
mkdir my-exporter && cd my-exporter
go mod init example.com/my-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

## Step 2 — Register your metrics

Create `main.go` and register the metrics your exporter will track.
The example below exposes three metrics for a fictional job-processing service:

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
            Name: "jobs_processed_total",
            Help: "Total number of jobs processed, partitioned by status.",
        },
        []string{"status"},
    )

    queueDepth = prometheus.NewGauge(prometheus.GaugeOpts{
        Name: "queue_depth",
        Help: "Current number of jobs waiting in the queue.",
    })

    processingDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
        Name:    "job_processing_duration_seconds",
        Help:    "Time spent processing a single job.",
        Buckets: prometheus.DefBuckets,
    })
)

func init() {
    prometheus.MustRegister(jobsProcessed, queueDepth, processingDuration)
}
```

{{< note >}}
`prometheus.MustRegister` panics on duplicate registration. If you load the
exporter as a library alongside other instrumented packages, use
`prometheus.Register` and handle the error explicitly.
{{< /note >}}

## Step 3 — Update metric values

Collect the real values from your application logic and update the registered
metrics. The example below simulates a polling loop:

```go
import (
    "math/rand"
    "time"
)

func collectMetrics() {
    for {
        // Simulate queue depth fluctuating between 0 and 50.
        queueDepth.Set(float64(rand.Intn(50)))

        // Simulate a job completing successfully.
        start := time.Now()
        time.Sleep(time.Duration(rand.Intn(200)) * time.Millisecond)
        processingDuration.Observe(time.Since(start).Seconds())
        jobsProcessed.WithLabelValues("success").Inc()

        time.Sleep(5 * time.Second)
    }
}
```

Replace the simulated values with real reads from your application — a
database query, an internal queue length API call, or any other data source.

## Step 4 — Expose the `/metrics` endpoint

Wire the Prometheus HTTP handler to a dedicated port and start the collection
loop in `main`:

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

Verify the endpoint locally before containerizing:

```bash
go run .
curl http://localhost:8080/metrics | grep jobs_processed
```

Expected output:

```
# HELP jobs_processed_total Total number of jobs processed, partitioned by status.
# TYPE jobs_processed_total counter
jobs_processed_total{status="success"} 3
```

## Step 5 — Write a Dockerfile

Create a minimal, multi-stage Dockerfile to produce a small production image:

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

Build and push the image, replacing `<registry>` with your registry address:

```bash
docker build -t <registry>/my-exporter:v1.0.0 .
docker push <registry>/my-exporter:v1.0.0
```

## Step 6 — Create Kubernetes manifests

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    app: my-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-exporter
  template:
    metadata:
      labels:
        app: my-exporter
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

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    app: my-exporter
spec:
  selector:
    app: my-exporter
  ports:
  - name: metrics
    port: 8080
    targetPort: metrics
```

Apply both manifests:

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

## Step 7 — Configure Prometheus scraping

Choose one of the two options below depending on how your Prometheus instance
is managed.

### Option A: ServiceMonitor (Prometheus Operator)

If you installed Prometheus using the Prometheus Operator or
kube-prometheus-stack, create a ServiceMonitor:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-exporter
  namespace: monitoring
  labels:
    release: kube-prometheus-stack   # must match the Prometheus selector label
spec:
  selector:
    matchLabels:
      app: my-exporter
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics
```

### Option B: Pod annotations (annotation-based scraping)

If your Prometheus uses annotation-based discovery, add these annotations to
the Pod template in the Deployment:

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```

{{< caution >}}
Annotation-based scraping requires a matching `scrape_config` rule in your
Prometheus configuration. Verify the rule exists before relying on
annotations alone.
{{< /caution >}}

## Step 8 — Verify the exporter is scraped

Check that Prometheus has discovered the scrape target:

```bash
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```

Open `http://localhost:9090/targets` in a browser and confirm that
`my-exporter` appears with state **UP**.

Query the metric directly in the Prometheus expression browser:

```
rate(jobs_processed_total{status="success"}[2m])
```

To confirm the metric is reachable through the Kubernetes API:

```bash
kubectl get --raw \
  "/apis/custom.metrics.k8s.io/v1beta2/namespaces/monitoring/pods/*/queue_depth" \
  | jq .
```

{{< note >}}
The Custom Metrics API endpoint is only available after you deploy a metrics
adapter such as the Prometheus Adapter. See
[Implementing Custom Metrics in Kubernetes](/docs/tasks/run-application/custom-metrics/)
for adapter setup instructions.
{{< /note >}}

## Troubleshooting

**Target shows state `DOWN` in Prometheus**

Confirm the Pod is running and the port name matches the ServiceMonitor
`port` field:

```bash
kubectl get pods -n monitoring -l app=my-exporter
kubectl describe servicemonitor my-exporter -n monitoring
```

**Metrics endpoint returns no data**

Check that `collectMetrics` is running and that `prometheus.MustRegister`
was called before the first scrape:

```bash
kubectl logs -n monitoring deployment/my-exporter
```

**Container image pull error**

Verify your registry credentials are configured as an `imagePullSecret` on
the ServiceAccount used by the Deployment:

```bash
kubectl get events -n monitoring --field-selector reason=Failed
```

## {{% heading "whatsnext" %}}

* Learn how to expose custom metrics to the HPA in
  [Implementing Custom Metrics in Kubernetes](/docs/tasks/run-application/custom-metrics/).
* Read the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/)
  specification for naming and label conventions.
* Browse the
  [Prometheus client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)
  for Java, Python, Ruby, and other languages.
* Explore [writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/)
  in the Prometheus documentation for best practices on metric naming and
  label cardinality.

