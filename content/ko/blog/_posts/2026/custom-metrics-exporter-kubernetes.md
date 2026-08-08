---
layout: blog
title: "쿠버네티스용 사용자 정의 메트릭 익스포터 구축하기"
date: 2026-07-14T10:00:00-08:00
slug: custom-metrics-exporter-kubernetes
author: >
  Victor David Effiok
translator: >
  [Jaehan Byun(Supergate)](https://github.com/jaehanbyun)
---

쿠버네티스는 CPU와 메모리를 기본적으로 인식하지만, 실제 환경에서의
스케일링 결정은 대부분 이 좁은 범위 밖에 있는 신호에 의존한다. 큐에서
대기 중인 메시지 수, 마지막 배치 잡에 걸린 시간, 파드가 유지 중인 활성
WebSocket 연결 수 등이 그 예이다. 기본 제공 메트릭만으로 부족할 때는
메트릭 익스포터(metrics exporter)를 사용해 필요한 메트릭을 제공할 수 있다.

이 글에서는 익스포터를 처음부터 작성하고, 컨테이너로 패키징한 다음,
프로메테우스와 궁극적으로 [HorizontalPodAutoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)가
사용할 수 있도록 클러스터에 연결하는 과정을 살펴본다.

## 메트릭 익스포터의 실제 역할

익스포터는 애플리케이션 상태를 `/metrics` 엔드포인트에 텍스트로 노출하는
한 가지 역할만 담당하는 작은 HTTP 서버이다. 프로메테우스는 이 엔드포인트를
정기적으로 스크레이프(scrape)하고, 시계열 데이터를 저장한 뒤 쿼리,
알림, 오토스케일링 규칙에서 사용할 수 있게 한다.

경우에 따라 별도의 익스포터를 실행하는 대신, 프로메테우스 클라이언트
라이브러리를 포함하고 같은 프로세스에서 `/metrics`를 노출하여 애플리케이션을
직접 계측할 수 있다. 데이터 소스가 애플리케이션 외부에 있거나 애플리케이션
코드를 제어할 수 없다면 독립형 익스포터가 더 적합하다.

프로메테우스가 기대하는 형식은 일반 텍스트이다. 한 줄에 메트릭 하나가
기록되며 이름, 선택적 레이블, 숫자 값으로 구성된다. 클라이언트 라이브러리가
직렬화를 처리하므로 실제로는 무엇을 측정할지 결정하고 값이 변경될 때
올바른 함수를 호출하기만 하면 된다.

## 측정 대상 선택하기

코드를 작성하기 전에 어떤 종류의 신호를 다루는지 결정하면 도움이 된다.
프로메테우스 데이터 모델에는 세 가지 주요 유형이 있다.

- *카운터(counter)*: 계속 증가하기만 한다. 처리한 요청, 처리한 잡,
  발생한 오류와 같은 합계를 나타내는 데 적합하다. 감소할 수 있는 값에는
  카운터를 사용하지 않는다.

- *게이지(gauge)*: 자유롭게 증가하고 감소할 수 있는 값의 현재 상태를
  나타낸다. 큐 깊이, 활성 연결 수, 캐시 크기가 모두 게이지에 해당한다.

- *히스토그램(histogram)*: 요청 지연 시간과 같은 관측값의 분포를
  기록한다. 단순한 평균 대신 백분위수(p99, p50)를 계산할 수 있다.

신호에 맞는 유형을 결정했다면 `snake_case` 형식의
`<namespace>_<name>_<unit>` 규칙을 따르는 이름을 선택한다. 예를 들어 잡
프로세서는 `worker_jobs_processed_total`(카운터),
`worker_queue_depth`(게이지), `worker_job_duration_seconds`(히스토그램)를
노출할 수 있다. 이름을 명확하게 지으면 나중에 디버깅하는 시간을 절약할 수 있다.

## 프로젝트 설정하기

Go 프로메테우스 클라이언트는 쿠버네티스 생태계의 익스포터에서 가장 많이
사용되는 선택지이다. 대부분의 공식 쿠버네티스 컴포넌트가 같은 라이브러리를
사용하기 때문이다. 먼저 모듈을 생성하고 의존성을 가져온다.

```bash
mkdir my-exporter && cd my-exporter
go mod init example.com/my-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

## 메트릭 등록하기

`main.go`를 생성한다. 먼저 메트릭을 선언하고 프로메테우스 기본 레지스트리에
등록한다. 등록하면 첫 번째 관측값이 기록되기 전에도 라이브러리가 해당 메트릭의
존재를 인식하여 출력에 표시한다.

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

`prometheus.MustRegister`는 중복 등록이 발생하면 패닉을 일으킨다. 따라서 잘못된
구성이 런타임에 조용히 넘어가지 않고 시작 시점에 명확하게 드러난다. 다른
패키지도 계측할 라이브러리 안에 이 익스포터를 포함하는 경우에는
`prometheus.Register`를 사용하고 오류를 직접 처리한다.

## 실제 값 수집하기

메트릭을 등록한 다음에는 값을 최신 상태로 유지해야 한다. 데이터가 변경될 때마다
계속 업데이트하거나 내부 갱신 루프를 직접 실행할 수 있다.
다음 패턴은 애플리케이션이 관리하는 데이터 소스를 주기적으로 읽고 등록된
메트릭을 업데이트하는 고루틴인 폴링 루프를 보여준다. 시뮬레이션 값을 데이터베이스,
내부 API, 메시지 브로커에 대한 실제 호출로 교체한다.

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

폴링 간격(여기서는 5초)은 프로메테우스의 스크레이프 간격보다 짧아야 각
스크레이프에서 최신 값을 확인할 수 있다. 대부분의 클러스터 배포에서 기본
스크레이프 간격은 15초이므로 충분한 여유가 있다.

## 엔드포인트 노출하기

수집 루프와 HTTP 핸들러를 `main`에서 연결한다. `/metrics`와 함께 `/healthz`
경로를 제공하면 헬스 경로에 메트릭 데이터를 노출하지 않고도 쿠버네티스의
활성 프로브 대상으로 사용할 수 있다.

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

이미지를 빌드하기 전에 로컬에서 출력을 확인한다.

```bash
go run .
curl http://localhost:8080/metrics | grep worker_
```

현재 메트릭 값 앞에 세 개의 `# HELP` 및 `# TYPE` 블록이 표시되어야 한다.
이러한 줄이 나타나면 익스포터가 올바르게 작동하며 컨테이너화할 준비가 된 것이다.

## 컨테이너 이미지 빌드하기

멀티 스테이지 빌드를 사용하면 최종 이미지를 작게 유지하고 프로덕션에 Go
툴체인을 포함하지 않을 수 있다. 첫 번째 스테이지에서는 정적으로 링크된 바이너리를
컴파일하고, 두 번째 스테이지에서는 해당 바이너리만 최소 기본 이미지로 복사한다.
다음 예제에서는 도커를 사용하지만 Buildah 또는 Podman과 같은 OCI 호환 빌드
도구에서도 동일한 패턴을 사용할 수 있다.

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

`distroless/static:nonroot`에는 셸과 패키지 관리자가 없으며 기본적으로 루트가 아닌
사용자로 실행된다. 따라서 추가 구성 없이 대부분의 클러스터 보안 정책을 충족한다.

`<registry>`를 자신의 레지스트리 주소로 바꾸고 이미지를 빌드하여 푸시한다.

```bash
docker build -t <registry>/my-exporter:v1.0.0 .
docker push <registry>/my-exporter:v1.0.0
```
(참고: 일반적으로 이러한 명령을 수동으로 실행하는 것보다 CI/CD 파이프라인으로 자동화하는 편이 더 낫다.)

## 클러스터에 배포하기

익스포터를 실행하는 데는 두 개의 매니페스트면 충분하다. 디플로이먼트(Deployment)는
파드 라이프사이클을 관리하고, 서비스(Service)는 프로메테우스가 스크레이프할
수 있는 안정적인 주소를 제공한다.
(프로메테우스가 모든 파드를 스크레이프하도록 할 수도 있다. 사용 사례에 적합하다면
그 방식으로 구성해도 된다.)

다음 예제에서는 프로메테우스와 관련 컴포넌트를 함께 실행할 때 흔히 사용하는
`monitoring` 네임스페이스를 사용한다. 자신의 클러스터 설정에 맞게 네임스페이스를
조정한다.

디플로이먼트는 경량 사이드카(sidecar) 형태의 프로세스에 적합한 보수적인 리소스
한도를 설정하고 `/healthz` 경로를 활성 프로브에 사용한다.

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

서비스는 포트 이름을 `metrics`로 지정한다. 다음 섹션의 ServiceMonitor는 이
이름으로 포트를 참조한다.

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

두 매니페스트를 적용한다.

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

## 프로메테우스에 수집 위치 알려주기

스크레이프 구성 방식은 프로메테우스를 설치한 방법에 따라 달라진다.

**옵션 1: 프로메테우스 오퍼레이터(ServiceMonitor)**

[프로메테우스 오퍼레이터](https://github.com/prometheus-operator/prometheus-operator)나
`kube-prometheus-stack` Helm 차트로 프로메테우스를 설치했다면 ServiceMonitor를
생성하기 전에 클러스터에서 오퍼레이터가 실행 중이어야 한다. `release` 레이블은
프로메테우스 리소스에 구성된 레이블 셀렉터와 일치해야 한다. 표준 Helm 설치에서는
`kube-prometheus-stack`이 기본값이다.

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

**옵션 2: 어노테이션 기반 디스커버리**

프로메테우스가 어노테이션 기반 파드 디스커버리를 사용한다면 프로메테우스
구성에 일치하는 `scrape_config` 규칙이 필요하다. 프로메테우스 설치 관리자에게
이 규칙이 적용되어 있는지 확인한다.

사용 중인 스크레이프 방식에 관계없이 다음 어노테이션을 파드 템플릿에 추가할
수 있다. 프로메테우스 오퍼레이터는 이를 무시하지만, 어노테이션 기반 설정에서는
자동으로 인식한다.

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"     # omit if not using annotation-based discovery
  prometheus.io/path: "/metrics" # omit if not using annotation-based discovery
```

클러스터가 어떤 설정을 사용하는지 확실하지 않다면 ServiceMonitor 방식이 더
명시적이고 디버깅하기도 쉽다.

## 스크레이프 확인하기

프로메테우스 서비스로 포트 포워딩하고 대상 페이지를 열어 익스포터가 탐지되었는지
확인한다.

```bash
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```

`http://localhost:9090/targets`로 이동한다. `my-exporter` 대상이 **UP** 상태로
표시되어야 한다. **DOWN**으로 표시되면 ServiceMonitor의 `release` 레이블이
일치하고 파드가 실행 중인지 확인한다.

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=my-exporter
kubectl describe servicemonitor my-exporter -n monitoring
```

대상이 정상 상태가 되면 표현식 브라우저에서 간단한 쿼리를 실행하여 데이터가
전달되는지 확인한다.

```
rate(worker_jobs_processed_total{status="success"}[2m])
```

0이 아닌 결과가 나오면 전체 파이프라인이 작동하는 것이다. 애플리케이션이
데이터를 생성하고, 프로메테우스가 데이터를 스크레이프하며, 시계열 데이터가
저장되어 쿼리할 수 있는 상태이다.

## 다음 단계

작동하는 익스포터는 최종 목적지가 아니라 기반이다. 자연스러운 다음 단계는
이러한 메트릭을 [Horizontal Pod Autoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale/)에
제공하여 CPU뿐만 아니라 실제로 부하를 유발하는 신호를 기준으로 워크로드를
스케일링하는 것이다. 이를 위해서는 메트릭 어댑터가 필요하다. 프로메테우스
어댑터(Prometheus Adapter)가 가장 널리 배포된 선택지이며, 사용자 정의 메트릭을
쿠버네티스 사용자 정의 메트릭 API에 등록한다. 등록을 마치면 클러스터의 모든
HorizontalPodAutoscaler가 `metrics` 블록에서 `worker_queue_depth` 또는
`worker_jobs_processed_total`을 직접 참조할 수 있다.

설정 과정은
[여러 메트릭 및 사용자 정의 메트릭을 기준으로 오토스케일링하기](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#다양한-메트릭-및-사용자-정의-메트릭에-기반한-오토스케일링)를
참고한다. 데이터베이스, 메시지 브로커, 클라우드 서비스를 위한 완성된 익스포터
목록은 [프로메테우스 익스포터 및 통합](https://prometheus.io/docs/instrumenting/exporters/)
페이지에서 확인할 수 있다.
