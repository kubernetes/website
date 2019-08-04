---
content_template: templates/concept
title: 리소스 모니터링 도구
---

{{% capture overview %}}

애플리케이션을 스케일하여 신뢰할 수 있는 서비스를 제공하려면, 
애플리케이션이 배포되었을 때 애플리케이션이 어떻게 동작하는지를 이해해야 한다. 
컨테이너, [파드](/ko/docs/concepts/workloads/pods/pod), 
[서비스](/docs/concepts/services-networking/service), 그리고 전체 클러스터의 특성을 
검사하여 쿠버네티스 클러스터 내의 애플리케이션 성능을 검사할 수 있다. 쿠버네티스는 각 레벨에서 
애플리케이션의 리소스 사용량에 대한 상세 정보를 제공한다.
이 정보는 애플리케이션의 성능을 평가하고 
병목 현상을 제거하여 전체 성능을 향상할 수 있게 해준다.

{{% /capture %}}

{{% capture body %}}

쿠버네티스에서 애플리케이션 모니터링은 단일 모니터링 솔루션에 의존하지 않는다.
신규 클러스터에서는 기본적으로 두 개의 개별 파이프라인을 사용하여 모니터링 통계를 
수집할 수 있다.

- [**리소스 메트릭 파이프라인**](#리소스-메트릭-파이프라인)은 HorizontalPodAutoscaler 
  컨트롤러와 같은 클러스터 구성요소나 `kubectl top` 유틸리티에 관련되어 있는 메트릭들로 
  제한된 집합을 제공한다. 이 메트릭은 
  [metrics-server](https://github.com/kubernetes-incubator/metrics-server)
  에 의해서 수집되며 `metrics.k8s.io` API를 통해 노출된다. `metrics-server`는 클러스터 
  상의 모든 노드를 발견하고 각 노드의 
  [Kubelet](/docs/reference/command-line-tools-reference/kubelet)에 CPU와 메모리 
  사용량을 질의한다. Kubelet은 [cAdvisor](https://github.com/google/cadvisor)에서 
  데이터를 가져온다. `metrics-server`는 경량의 단기 인메모리 저장소이다.
  
- 프로메테우스 같이 [**완전한 메트릭 파이프라인**](#완전한-메트릭-파이프라인)은 보다 풍부한 
  메트릭에 액세스할 수 있게 해준다. 추가적으로 쿠버네티스는 Horizontal Pod Autoscaler와 
  같은 메커니즘을 사용하여 현재 상태를 기반으로 클러스터를 자동으로 확장 또는 
  조정함으로써 이런 메트릭에 응답할 수 있다. 모니터링 파이프라인은 Kubelet에서 
  메트릭을 가져온 다음 `custom.metrics.k8s.io` 이나 
  `external.metrics.k8s.io` API로 구현된 어댑터를 통해 
  이들을 쿠버네티스에 노출한다.

## 리소스 메트릭 파이프라인

### Kubelet

Kubelet은 쿠버네티스 마스터와 노드들 사이의 다리 역할을 한다. 이는 머신 상에서 실행되는 파드들과 컨테이너들을 관리한다. Kubelet은 각 파드를 이를 구성하는 컨테이너들로 변환하며 컨테이너 런타임 인터페이스를 통해 컨테이너 런타임에서 개별 컨테이너의 사용량 통계를 가져온다. 레거시 도커 통합에서는 cAdvisor에서 이 정보를 가져온다. 그런 다음 Kubelet 리소스 메트릭 API를 통해 집계된 파드 리소스 사용량 통계를 노출한다. 이 API는 Kubelet의 인증되고 읽기 전용의 포트들 상에서 `/metrics/resource/v1alpha1`으로 제공된다.

### cAdvisor

cAdvisor는 오픈 소스 컨테이너 자원 사용률/성능 분석 에이전트이다. 이는 컨테이너 전용으로 설계되었으며 도커 컨테이너를 기본적으로 지원한다. 쿠버네티스에서 cAdvisor는 Kubelet 바이너리와 통합된다. cAdvisor는 머신 내 모든 컨테이너를 자동으로 발견하며 CPU, 메모리, 파일시스템, 네트워크 사용량 통계를 수집한다. cAdvisor는 또한 machine 상의 'root' 컨테이너 분석에 의한 전체 머신 사용량도 제공한다.

Kubelet은 기본 포트 4194를 통해 머신의 컨테이너에 대한 단순한 cAdvisor UI를 노출한다.
아래 그림은 전체 머신의 사용량을 예제로 보여준다. 하지만, 이 기능은 v1.10에서는 사용 중단(deprecated)으로 
표시되었으며, v1.12에서는 완전히 제거되었다.

![cAdvisor](/images/docs/cadvisor.png)

v1.13부터, [cAdvisor를 데몬셋으로 배포](https://github.com/google/cadvisor/tree/master/deploy/kubernetes)하여 cAdvisor UI에 액세스할 수 있다.

## 완전한 메트릭 파이프라인

쿠버네티스를 위한 많은 완전한 메트릭 솔루션들이 존재한다.

### 프로메테우스

[프로메테우스](https://prometheus.io)는 기본적으로 쿠버네티스, 노드, 프로메테우스 자체를 모니터링할 수 있다.
[Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/)는 
쿠버네티스에서 프로메테우스 설정을 단순화하고, 
[Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter)를 
사용하여 커스텀 메트릭 API를 제공할 수 있게 해준다.
프로메테우스는 강력한 쿼리 언어와 데이터 쿼리와 시각화를 위한 내장 대시보드를 제공한다.
또한 [Grafana](https://prometheus.io/docs/visualization/grafana/)에서는 
데이터 소스로 프로메테우스가 지원된다.

### Sysdig
[Sysdig](http://sysdig.com)는 완전한 스펙트럼 컨테이너와 플랫폼 인텔리전스를 제공하며, 
진정한 컨테이너 네이티브 솔루션이다. Sysdig는 시스템 호출, 쿠버네티스 이벤트, 프로메테우스 메트릭, 
statsD, JMX 등의 데이터를 하나의 창으로 통합하여 환경에 대한 포괄적인 그림을 제공한다. 
또한 Sysdig는 강력하고 사용자 정의가 가능한 솔루션을 제공하기 위해 쿼리를 실행할 수 있는 API를 제공한다.
Sysdig는 오픈 소스로 만들어졌다. [Sysdig와 Sysdig Inspect](https://sysdig.com/opensource/inspect/)는 
자유롭게 트러블슈팅, 분석, 포렌식을 수행할 수 있는 기능을 제공한다.

### 구글 클라우드 모니터링

구글 클라우드 모니터링은 호스팅 모니터링 서비스로 애플리케이션의 
중요한 메트릭을 시각화하고 경고하는데 사용할 수 있으며, 
쿠버네티스에서 메트릭을 수집하고 
[Cloud Monitoring Console](https://app.google.stackdriver.com/)을 
통해 이 메트릭들에 접근할 수 있다. 대시보드를 만들고 사용자 정의하여 쿠버네티스 클러스터에서 
수집한 데이터를 시각화할 수 있다.

이 동영상은 힙스터(Heapster)를 기반으로 구글 클라우드 모니터링을 구성하고 실행하는 방법을 보여준다.

[![힙스터를 기반으로 구글 클라우드 모니터링을 구성하고 실행하는 방법](https://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](https://www.youtube.com/watch?v=xSMNR2fcoLs)


{{< figure src="/images/docs/gcm.png" alt="구글 클라우드 모니터링 대시보드 예제" title="구글 클라우드 모니터링 대시보드 예제" caption="대시보드는 클러스터 전역의 리소스 사용량을 보여준다." >}}

## 크론잡 모니터링

### Kubernetes Job Monitor

[Kubernetes Job Monitor](https://github.com/pietervogelaar/kubernetes-job-monitor) 대시보드를 사용하여 클러스터 관리자는 실행되고 있는 잡들과 완료된 잡의 상태를 볼 수 있다.

### New Relic 쿠버네티스 모니터링 통합

[New Relic 쿠버네티스](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration) 통합은 쿠버네티스 환경의 성능에 대한 가시성을 향상시킨다. New Relic의 쿠버네티스 통합은 쿠버네티스 오브젝트의 메트릭을 리포팅하는 것으로 컨테이너 오케스트레이션 계층을 측정한다. 통합을 통해 쿠버네티스 노드, 네임스페이스, 디플로이먼트, 레플리카 셋, 파드, 컨테이너에 대한 인사이트를 얻을 수 있다.

중요 기능:
사전 구축된 대시보드에서 데이터를 확인하여 쿠버네티스 환경에 대한 즉각적인 인사이트를 확인한다.
자동으로 보고되는 데이터의 인사이트로 커스텀 쿼리와 차트를 생성한다.
쿠버네티스 데이터에 대해 경고 조건을 생성한다.
이 [페이지](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration)에서 더 알아볼 수 있다.

{{% /capture %}}
