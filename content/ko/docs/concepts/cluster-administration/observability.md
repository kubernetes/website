---
title: 가시성(observability)
# reviewers:
weight: 55
content_type: concept
description: >
  메트릭, 로그, 추적을 수집하여 쿠버네티스 클러스터의 엔드투엔드 가시성을 확보하는 방법을 이해한다.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#메트릭"
    title: 메트릭
  - anchor: "#로그"
    title: 로그
  - anchor: "#추적"
    title: 추적
---

<!-- overview -->

쿠버네티스에서 관측가능성이란 흔히 관측가능성의 세 가지 축이라고 하는 메트릭, 로그, 트레이스를 수집하고 분석하여 클러스터의 내부 상태, 성능, 정상 여부를 더 잘 파악하는 과정이다.

쿠버네티스 컨트롤 플레인 컴포넌트와 여러 애드온은 이러한 신호를 생성하고 내보낸다. 이 신호를 집계하고 연관 지으면 클러스터 전반의 컨트롤 플레인, 애드온, 애플리케이션을 통합된 관점에서 파악할 수 있다.

그림 1은 클러스터 컴포넌트가 세 가지 주요 신호 유형을 내보내는 방식을 나타낸다.

{{< mermaid >}}
flowchart LR
    A[클러스터 컴포넌트] --> M[메트릭 파이프라인]
    A --> L[로그 파이프라인]
    A --> T[추적 파이프라인]
    M --> S[(저장 및 분석)]
    L --> S
    T --> S
    S --> O[운영자 및 자동화]
{{< /mermaid >}}

*그림 1. 클러스터 컴포넌트가 내보내는 상위 수준의 신호와 해당 신호의 소비자.*

<!-- body -->
## 메트릭

쿠버네티스 컴포넌트는 다음을 포함하여 각 `/metrics` 엔드포인트에서 [프로메테우스 형식](https://prometheus.io/docs/instrumenting/exposition_formats/)으로 메트릭을 내보낸다.

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

kubelet은 `/metrics/cadvisor`, `/metrics/resource`, `/metrics/probes`에서도 메트릭을 노출하며, [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/)와 같은 애드온은 쿠버네티스 오브젝트 상태를 추가하여 이러한 컨트롤 플레인 신호를 보강한다.

일반적인 쿠버네티스 메트릭 파이프라인은 주기적으로 이러한 엔드포인트에서 메트릭을 수집하고 시계열 데이터베이스(예: 프로메테우스)에 샘플을 저장한다.

자세한 내용과 구성 옵션은 [시스템 메트릭 가이드](/docs/concepts/cluster-administration/system-metrics/)를 참고한다.

그림 2는 일반적인 쿠버네티스 메트릭 파이프라인을 나타낸다.

{{< mermaid >}}
flowchart LR
    C[클러스터 컴포넌트] --> P["프로메테우스 수집기(scraper)"]
    P --> TS[(시계열 스토리지)]
    TS --> D[대시보드 및 경고]
    TS --> A[자동화된 작업]
{{< /mermaid >}}

*그림 2. 일반적인 쿠버네티스 메트릭 파이프라인의 컴포넌트.*

멀티 클러스터 또는 멀티 클라우드 가시성이 필요하다면 분산 시계열 데이터베이스(예: Thanos 또는 Cortex)로 프로메테우스를 보완하면 된다.

메트릭 수집기와 시계열 데이터베이스는 [일반적인 가시성 도구 - 메트릭 도구](#메트릭-도구)를 참고한다.

#### {{% heading "seealso" %}}

- [쿠버네티스 컴포넌트의 시스템 메트릭](/docs/concepts/cluster-administration/system-metrics/)
- [metrics-server를 사용한 리소스 사용량 모니터링](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metrics 개념](/docs/concepts/cluster-administration/kube-state-metrics/)
- [리소스 메트릭 파이프라인 개요](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

## 로그

로그는 애플리케이션, 쿠버네티스 시스템 컴포넌트 및 감사 로깅과 같은 보안 관련 활동에서 발생하는 이벤트를 시간순으로 기록한다.

컨테이너 런타임은 컨테이너화된 애플리케이션의 표준 출력(`stdout`) 및 표준 오류(`stderr`) 스트림 출력을 캡처한다. 런타임마다 구현은 다르지만 kubelet과의 통합은 _CRI 로깅 형식_ 으로 표준화되어 있으며, kubelet은 `kubectl logs`를 통해 이러한 로그를 제공한다.

![노드-레벨 로깅](/images/docs/user-guide/logging/logging-node-level.png)

*그림 3a. 노드-레벨 로깅 아키텍처.*

시스템 컴포넌트 로그는 클러스터의 이벤트를 캡처하며 디버깅 및 문제 해결에 유용한 경우가 많다. 이러한 컴포넌트는 컨테이너에서 실행되는 컴포넌트와 그렇지 않은 컴포넌트로 구분된다. 예를 들어 `kube-scheduler`와 `kube-proxy`는 일반적으로 컨테이너에서 실행되는 반면, `kubelet`과 컨테이너 런타임은 호스트에서 직접 실행된다.

- `systemd`를 사용하는 머신에서 kubelet과 컨테이너 런타임은 journald에 로그를 기록한다. 그렇지 않은 경우에는 `/var/log` 디렉터리의 `.log` 파일에 기록한다.
- 컨테이너 내부에서 실행되는 시스템 컴포넌트는 기본 컨테이너 로깅 메커니즘을 거치지 않고 항상 `/var/log`의 `.log` 파일에 기록한다.

로그가 제한 없이 증가하는 것을 방지하려면 `/var/log`에 저장된 시스템 컴포넌트와 컨테이너 로그에 로그 로테이션을 적용해야 한다. 일부 클러스터 프로비저닝 스크립트는 기본적으로 로그 로테이션을 설치하므로, 환경을 확인하고 필요에 따라 조정한다. 위치, 형식, 구성 옵션에 대한 자세한 내용은 [시스템 로그 레퍼런스](/docs/concepts/cluster-administration/system-logs/)를 참고한다.

대부분의 클러스터는 이러한 파일을 테일링(tailing)하고 항목을 중앙 로그 저장소로 전달하는 노드-레벨 로깅 에이전트(예: Fluent Bit 또는 Fluentd)를 실행한다. [로깅 아키텍처 가이드](/docs/concepts/cluster-administration/logging/)에서는 이러한 파이프라인을 설계하고, 보존 정책을 적용하며, 백엔드로 로그를 전송하는 방법을 설명한다.

그림 3은 일반적인 로그 집계 파이프라인을 나타낸다.

{{< mermaid >}}
flowchart LR
    subgraph Sources[소스]
        A[애플리케이션 stdout / stderr]
        B[컨트롤 플레인 로그]
        C[감사 기록]
    end
    A --> N[노드 로그 에이전트]
    B --> N
    C --> N
    N --> L[중앙 로그 저장소]
    L --> Q[대시보드, 경고, SIEM]
{{< /mermaid >}}

*그림 3. 일반적인 쿠버네티스 로그 파이프라인의 컴포넌트.*

로깅 에이전트와 중앙 로그 저장소는 [일반적인 가시성 도구 - 로깅 도구](#로깅-도구)를 참고한다.

#### {{% heading "seealso" %}}

- [로깅 아키텍처](/docs/concepts/cluster-administration/logging/)
- [시스템 로그](/docs/concepts/cluster-administration/system-logs/)
- [로깅 태스크 및 튜토리얼](/docs/tasks/debug/logging/)
- [감사 로깅 구성](/docs/tasks/debug/debug-cluster/audit/)

## 추적

추적(trace)은 요청이 쿠버네티스 컴포넌트와 애플리케이션을 거쳐 이동하는 방식을 캡처하며, 작업 간 지연 시간, 시점, 관계를 연결한다. 추적을 수집하면 엔드투엔드 요청 흐름을 시각화하고 성능 문제를 진단하며 컨트롤 플레인, 애드온 또는 애플리케이션의 병목이나 예기치 않은 상호 작용을 식별할 수 있다.

쿠버네티스 {{< skew currentVersion >}}는 기본 제공 gRPC exporter를 통해 직접 또는 OpenTelemetry 수집기를 거쳐 전달하는 방식으로 [OpenTelemetry 프로토콜](/docs/concepts/cluster-administration/system-traces/) (OTLP)을 사용하여 스팬을 내보낼 수 있다.

OpenTelemetry 수집기는 컴포넌트와 애플리케이션에서 스팬을 수신하고 처리한 다음(예: 샘플링 또는 민감 정보 제거 적용), 저장 및 분석을 위해 추적 백엔드로 전달한다.

그림 4는 일반적인 분산 추적 파이프라인을 나타낸다.

{{< mermaid >}}
flowchart LR
    subgraph Sources[소스]
        A[컨트롤 플레인 스팬]
        B[애플리케이션 스팬]
    end
    A --> X[OTLP exporter]
    B --> X
    X --> COL[OpenTelemetry 수집기]
    COL --> TS[(추적 백엔드)]
    TS --> V[시각화 및 분석]
{{< /mermaid >}}

*그림 4. 일반적인 쿠버네티스 추적 파이프라인의 컴포넌트.*

추적 수집기와 백엔드는 [일반적인 가시성 도구 - 추적 도구](#추적-도구)를 참고한다.

#### {{% heading "seealso" %}}

- [쿠버네티스 컴포넌트의 시스템 추적](/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry 수집기 시작하기 가이드](https://opentelemetry.io/docs/collector/getting-started/)
- [모니터링 및 추적 태스크](/docs/tasks/debug/monitoring/)

## 일반적인 가시성 도구

{{% thirdparty-content %}}

참고: 이 섹션은 쿠버네티스에 필요한 가시성 기능을 제공하는 서드파티 프로젝트로 연결된다.
쿠버네티스 프로젝트 작성자는 이러한 프로젝트에 책임이 없으며, 프로젝트는 알파벳순으로 나열되어 있다. 이
목록에 프로젝트를 추가하려면 변경 사항을 제출하기 전에 [콘텐츠 가이드](/docs/contribute/style/content-guide/)를 읽는다.

### 메트릭 도구

- [Cortex](https://cortexmetrics.io/)는 수평 확장이 가능한 장기 프로메테우스 스토리지를 제공한다.
- [Grafana Mimir](https://grafana.com/oss/mimir/)는 멀티 테넌트를 지원하고 수평 확장이 가능한 프로메테우스 호환 스토리지를 제공하는 Grafana Labs 프로젝트이다.
- [Prometheus](https://prometheus.io/)는 쿠버네티스 컴포넌트의 메트릭을 수집하고 저장하는 모니터링 시스템이다.
- [Thanos](https://thanos.io/)는 글로벌 쿼리, 다운샘플링 및 오브젝트 스토리지 지원으로 프로메테우스를 확장한다.

### 로깅 도구

- [Elasticsearch](https://www.elastic.co/elasticsearch/)는 분산 로그 인덱싱 및 검색 기능을 제공한다.
- [Fluent Bit](https://fluentbit.io/)는 적은 리소스를 사용하여 컨테이너 및 노드 로그를 수집하고 전달한다.
- [Fluentd](https://www.fluentd.org/)는 로그를 여러 대상으로 라우팅하고 변환한다.
- [Grafana Loki](https://grafana.com/oss/loki/)는 프로메테우스에서 착안한 레이블 기반 형식으로 로그를 저장한다.
- [OpenSearch](https://opensearch.org/)는 Elasticsearch API와 호환되는 오픈 소스 로그 인덱싱 및 검색 기능을 제공한다.

### 추적 도구

- [Grafana Tempo](https://grafana.com/oss/tempo/)는 확장 가능하고 저렴한 분산 추적 스토리지를 제공한다.
- [Jaeger](https://www.jaegertracing.io/)는 마이크로서비스의 분산 추적을 캡처하고 시각화한다.
- [OpenTelemetry 수집기](https://opentelemetry.io/docs/collector/)는 트레이스를 포함한 텔레메트리 데이터를 수신하고 처리하여 내보낸다.
- [Zipkin](https://zipkin.io/)은 분산 추적 수집 및 시각화 기능을 제공한다.

## {{% heading "whatsnext" %}}

- [metrics-server로 리소스 사용량을 수집](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)하는 방법을 알아본다.
- [로깅 태스크 및 튜토리얼](/docs/tasks/debug/logging/)을 살펴본다.
- [모니터링 및 추적 태스크 가이드](/docs/tasks/debug/monitoring/)를 따른다.
- 컴포넌트 엔드포인트와 안정성에 대해서는 [시스템 메트릭 가이드](/docs/concepts/cluster-administration/system-metrics/)를 검토한다.
- 검증된 서드파티 옵션은 [일반적인 가시성 도구](#일반적인-가시성-도구) 섹션을 검토한다.
