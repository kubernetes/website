---
# reviewers:
# - mikedanese
content_type: concept
title: 리소스 모니터링 도구
weight: 15
---

<!-- overview -->

애플리케이션을 스케일하여 신뢰할 수 있는 서비스를 제공하려면,
애플리케이션이 배포되었을 때 애플리케이션이 어떻게 동작하는지를 이해해야 한다.
컨테이너, [파드](/ko/docs/concepts/workloads/pods/),
[서비스](/ko/docs/concepts/services-networking/service),
그리고 전체 클러스터의 특성을 검사하여
쿠버네티스 클러스터 내의 애플리케이션 성능을 검사할 수 있다. 쿠버네티스는 각 레벨에서
애플리케이션의 리소스 사용량에 대한 상세 정보를 제공한다.
이 정보는 애플리케이션의 성능을 평가하고
병목 현상을 제거하여 전체 성능을 향상할 수 있게 해준다.

<!-- body -->

쿠버네티스에서 애플리케이션 모니터링은 단일 모니터링 솔루션에 의존하지 않는다.
신규 클러스터에서는, [리소스 메트릭](#리소스-메트릭-파이프라인) 또는
[완전한 메트릭](#완전한-메트릭-파이프라인) 파이프라인으로 모니터링 통계를 수집할 수 있다.

## 리소스 메트릭 파이프라인

리소스 메트릭 파이프라인은
[Horizontal Pod Autoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale)
컨트롤러와 같은 클러스터 구성요소나
`kubectl top` 유틸리티에 관련되어 있는
메트릭들로 제한된 집합을 제공한다. 이 메트릭은 경량의 단기 인메모리 저장소인
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)에
의해서 수집되며 `metrics.k8s.io` API를 통해 노출된다.

metrics-server는 클러스터 상의 모든 노드를 발견하고 
각 노드의 [kubelet](/docs/reference/command-line-tools-reference/kubelet/)에 
CPU와 메모리 사용량을 질의한다. 
Kubelet은 쿠버네티스 마스터와 노드 간의 다리 역할을 하면서 
머신에서 구동되는 파드와 컨테이너를 관리한다. 
Kubelet은 각각의 파드를 해당하는 컨테이너에 매치시키고 
컨테이너 런타임 인터페이스를 통해 
컨테이너 런타임에서 개별 컨테이너의 사용량 통계를 가져온다. 
컨테이너를 구현하기 위해 리눅스 cgroup 및 네임스페이스를 활용하는 컨테이너 런타임을 사용하며, 
해당 컨테이너 런타임이 사용 통계치를 퍼블리싱 하지 않는 경우, 
kubelet은 해당 통계치를 ([cAdvisor](https://github.com/google/cadvisor)의 코드 사용하여) 직접 조회 할 수 있다.
이런 통계가 어떻게 도착하든 kubelet은 취합된 파드 리소스 사용량 통계를 
metric-server 리소스 메트릭 API를 통해 노출한다.
이 API는 kubelet의 인증이 필요한 읽기 전용 포트 상의 
`/metrics/resource/v1beta1`에서 제공된다.

## 완전한 메트릭 파이프라인

완전한 메트릭 파이프라인은 보다 풍부한 메트릭에 접근할 수 있도록 해준다.
쿠버네티스는 Horizontal Pod Autoscaler와 같은 메커니즘을 활용해서 이런 메트릭에
대한 반응으로 클러스터의 현재 상태를 기반으로 자동으로 스케일링하거나 클러스터를
조정할 수 있다. 모니터링 파이프라인은 kubelet에서 메트릭을 가져와서 쿠버네티스에
`custom.metrics.k8s.io`와 `external.metrics.k8s.io` API를 구현한 어댑터를 통해
노출한다.

CNCF 프로젝트인 [프로메테우스](https://prometheus.io)는 기본적으로 쿠버네티스, 노드, 프로메테우스 자체를 모니터링할 수 있다.
CNCF 프로젝트가 아닌 완전한 메트릭 파이프라인 프로젝트는 쿠버네티스 문서의 범위가 아니다.

## {{% heading "whatsnext" %}}


다음과 같은 추가 디버깅 도구에 대해 더 알아본다.

* [로깅](/ko/docs/concepts/cluster-administration/logging/)
* [모니터링](/ko/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* [`exec`를 통해 컨테이너에 접속하기](/ko/docs/tasks/debug/debug-application/get-shell-running-container/)
* [프록시를 통해 컨테이너에 연결하기](/ko/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [포트 포워딩을 사용해서 클러스터 내 애플리케이션에 접근하기](/ko/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [crictl을 사용하여 쿠버네티스 노드 조사하기](/ko/docs/tasks/debug/debug-cluster/crictl/)
