---
title: 쿠버네티스 시스템 컴포넌트에 대한 추적(trace)
# reviewers:
# - logicalhan
# - lilic
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

시스템 컴포넌트 추적은 클러스터 내에서 수행된 동작들 간의 지연(latency)과 관계(relationship)를 기록한다.

쿠버네티스 컴포넌트들은 [OpenTelemetry 프로토콜](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#opentelemetry-protocol-specification)과
gRPC exporter를 이용하여 추적을 생성하고
[OpenTelemetry 수집기](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector)를
통해 추적 백엔드(tracing backends)로 라우팅되거나 수집될 수 있다.

<!-- body -->

## 추적 수집

추적 수집 및 수집기에 대한 전반적인 가이드는
[OpenTelemetry 수집기 시작하기](https://opentelemetry.io/docs/collector/getting-started/)에서 제공한다.
그러나, 쿠버네티스 컴포넌트에 관련된 몇 가지 사항에 대해서는 특별히 살펴볼 필요가 있다.

기본적으로, 쿠버네티스 컴포넌트들은 [IANA OpenTelemetry 포트](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry)인
4317 포트로 OTLP에 대한 grpc exporter를 이용하여 추적를 내보낸다.
예를 들면, 수집기가 쿠버네티스 컴포넌트에 대해 사이드카(sidecar)로 동작한다면,
다음과 같은 리시버 설정을 통해 스팬(span)을 수집하고 그 로그를 표준 출력(standard output)으로 내보낼 것이다.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # 이 exporter를 사용자의 백엔드를 위한 exporter로 변경
  logging:
    logLevel: debug
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [logging]
```

## 컴포넌트 추적

### kube-apiserver 추적

kube-apiserver는 들어오는 HTTP 요청들과 
webhook, etcd 로 나가는 요청들, 그리고 재진입 요청들에 대해 span을 생성한다. 
kube-apiserver는 자주 퍼블릭 엔드포인트로 이용되기 때문에, 
들어오는 요청들에 첨부된 추적 컨택스트를 사용하지 않고, 
나가는 요청들을 통해 [W3C Trace Context](https://www.w3.org/TR/trace-context/)를 전파한다.

#### kube-apiserver 에서의 추적 활성화

추적을 활성화하기 위해서는, kube-apiserve에서 `APIServerTracing`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화한다. 
또한, kube-apiserver의 추적 설정 파일에 
`--tracing-config-file=<path-to-config>`을 추가한다. 
다음은 10000개 요청 당 1개에 대한 span을 기록하는 설정에 대한 예시이고, 이는 기본 OpenTelemetry 엔드포인트를 이용한다.

```yaml
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: TracingConfiguration
# 기본값
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

`TracingConfiguration` 구조체에 대해 더 많은 정보를 얻고 싶다면 
[API server config API (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-TracingConfiguration)를 참고한다.

### kubelet 추적

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

kubelet CRI 인터페이스와 인증된 http 서버는 추적(trace) 스팬(span)을 생성하도록 설정 할수 있다.
apiserver와 마찬가지로 해당 엔드포인트 및 샘플링률을 구성할 수 있다.
추적 컨텍스트 전파(trace context propagation)도 구성할 수 있다. 상위 스팬(span)의 샘플링 설정이 항상 적용된다.
제공되는 설정의 샘플링률은 상위가 없는 스팬(span)에 기본 적용된다.
엔드포인트를 구성하지 않고 추적을 활성화로 설정하면, 기본 OpenTelemetry Collector receiver 주소는 "localhost:4317"으로 기본 설정된다.

#### kubelet tracing 활성화

추적을 활성화하려면 kubelet에서 `KubeletTracing`
[기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)을 활성화한다.
또한 kubelet에서
[tracing configuration](https://github.com/kubernetes/component-base/blob/release-1.25/tracing/api/v1/types.go)을 제공한다.
[tracing 구성](https://github.com/kubernetes/component-base/blob/release-1.25/tracing/api/v1/types.go)을 참조한다.
다음은 10000개 요청 중 1개에 대하여 스팬(span)을 기록하고, 기본 OpenTelemetry 앤드포인트를 사용하도록 한 kubelet 구성 예시이다. 

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletTracing: true
tracing:
  # 기본값
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

## 안정성

추적의 계측화(tracing instrumentation)는 여전히 활발히 개발되는 중이어서 다양한 형태로 변경될 수 있다. 
스팬(span)의 이름, 첨부되는 속성, 계측될 엔드포인트(instrumented endpoints)들 등이 그렇다. 
이 속성이 안정화(graduates to stable)되기 전까지는 
이전 버전과의 호환성은 보장되지 않는다.

## {{% heading "whatsnext" %}}

* [OpenTelemetry 수집기 시작하기](https://opentelemetry.io/docs/collector/getting-started/)을 참고

