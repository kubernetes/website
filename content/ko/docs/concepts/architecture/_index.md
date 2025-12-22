---
title: "클러스터 아키텍처"
weight: 30
description: >
  쿠버네티스 뒤편의 구조와 설계 개념들
---

쿠버네티스 클러스터는 컨트롤 플레인과 노드라고 불리는 일련의 워커 머신으로 구성되어 있으며, 
이 노드들은 컨테이너화된 애플리케이션을 실행한다. 모든 클러스터는 파드를 실행하기 위해 최소한 하나의 워커 노드가 필요하다.

워커 노드는 애플리케이션 워크로드의 구성 요소인 파드를 호스팅한다.
컨트롤 플레인은 클러스터 내의 워커 노드와 파드를 관리한다. 프로덕션 환경에서,
컨트롤 플레인은 보통 여러 대의 컴퓨터에서 실행되며, 클러스터는
일반적으로 여러 개의 노드를 실행하여, 장애 허용성과 고가용성을 제공한다.

이 문서는 완전하고 동작하는 쿠버네티스 클러스터를 구성하기 위해 필요한 다양한 컴포넌트를 설명한다.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="컨트롤 플레인 (kube-apiserver, etcd, kube-controller-manager, kube-scheduler)과 여러 노드이다. 각 노드는 kubelet과 kube-proxy를 실행한다." caption="그림 1. 쿠버네티스 클러스터 컴포넌트." class="diagram-large" >}}

{{< details summary="이 아키텍처에 대해서" >}}
그림 1의 다이어그램은 쿠버네티스 클러스터에 대한 예시 참조 아키텍처를 나타낸다.
실제 컴포넌트의 분포는 특정 클러스터의 설정과 요구사항에 따라 달라질 수 있다.

다이어그램에서, 각 노드는 [`kube-proxy`](#kube-proxy) 컴포넌트를 실행한다. 클러스터 네트워크에서
{{< glossary_tooltip text="서비스" term_id="service">}} API와 관련 동작을
사용할 수 있도록 각 노드에는
네트워크 프록시 컴포넌트가 필요하다. 그러나, 일부 네트워크 플러그인은
자체 서드파티 프록시 구현을 제공한다. 그러한 네트워크 플러그인을 사용할 경우,
해당 노드에서 `kube-proxy`를 실행할 필요가 없다. 
{{< /details >}}

## 컨트롤 플레인 컴포넌트

컨트롤 플레인의 컴포넌트는 클러스터에 대한 전역적인 결정(예를 들어, 스케줄링)뿐만 아니라,
클러스터의 이벤트를 감지하고 대응한다. (예를 들면, 디플로이먼트의 
`{{< glossary_tooltip text="레플리카" term_id="replica" >}}` 필드가 충족되지 않을 때
{{< glossary_tooltip text="파드" term_id="pod">}}를 새로 시작)

컨트롤 플레인 컴포넌트는 클러스터 안의 어떤 머신에서도 실행될 수 있다. 그러나 설정 스크립트는
일반적으로 모든 컨포넌트를 동일한 머신에서 시작하며, 이 머신에서는 사용자 컨테이너를 실행하지 않는다.
여러 머신에 걸쳐 컨트롤 플레인을 실행하는 예시 설정은
[kubeadm을 사용한 고가용성 클러스터 생성](/docs/setup/production-environment/tools/kubeadm/high-availability/)에서 참고한다.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

컨트롤러에는 여러 가지 유형이 있다. 몇 가지 예시는 다음과 같다.

- 노드 컨트롤러(Node Controller): 노드가 다운될 때 이를 감지하고 대응한다.
- 잡 컨트롤러(Job Controller): 일회성 작업을 나타내는 잡(Job) 오브젝트를 감시하고, 해당 작업을 수행하기 위한 파드를 생성한다.
- 엔드포인트슬라이스 컨트롤러(EndpointSlice controller): 엔드포인트슬라이스 오브젝트를 채워서 파드와 서비스 사이의 연결을 제공한다.
- 서비스어카운트 컨트롤러(ServiceAccount controller): 신규 네임스페이스에 기본 서비스어카운트를 생성한다.

위 목록이 전부는 아니다.

### 클라우드 컨트롤러 매니저

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

클라우드 컨트롤러 매니저는 오직 클라우드 공급자에 특화된 컨트롤러만 실행한다.
쿠버네티스를 온프레미스 환경이나, 개인 PC의 학습환경에서
실행하는 경우, 클러스터에는 클라우드 컨트롤러 매니저가 없다.

kube-controller-manager와 마찬가지로, 클라우드 컨트롤러 매니저는 여러 개의 논리적으로
독립된 컨트롤 루프를 단일 바이너리로 결합하여 하나의 프로세스로 실행한다. 성능을 향상시키거나 장애 허용성을 높이기 위해
수평 확장(하나 이상의 복제본을 실행)할 수 있다.

다음과 같은 컨트롤러는 클라우드 공급자 의존성을 가질 수 있다.

- 노드 컨트롤러(Node controller): 노드가 응답을 멈춘 뒤 클라우드에서 해당 노드가
삭제되었는지를 판단하기 위해 클라우드 공급자를 확인한다.
- 라우트 컨트롤러(Route controller): 클라우드 인프라스트럭처 기반에서 라우트를 설정한다.
- 서비스 컨트롤러(Service controller): 클라우드 공급자의 로드 밸런서를 생성, 업데이트, 삭제한다.

---

## 노드 컴포넌트

노드 컴포넌트는 모든 노드에서 실행되며, 실행 중인 파드를 유지하고 쿠버네티스 런타임 환경을 제공한다.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (선택 사항) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
서비스에 대한 패킷 포워딩을 자체적으로 구현하고, kube-proxy와 동등한 동작을 제공하는
[네트워크 플러그인](#network-plugins)을 사용하는 경우, 클러스터 노드에서 kube-proxy를
실행할 필요가 없다.

### 컨테이너 런타임

{{< glossary_definition term_id="container-runtime" length="all" >}}

## 애드온

애드온은 쿠버네티스 리소스({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, 등)를 사용하여, 클러스터의 기능을 구현한다.
클러스터 수준의 기능을 제공하기 때문에, 애드온의 네임스페이스 리소스는
`kube-system` 네임스페이스에 속한다.

선택된 애드온은 아래에 설명되어 있다. 사용 가능한 애드온의 더 많은 목록은,
[애드온](/ko/docs/concepts/cluster-administration/addons/)을 참고한다.

### DNS

다른 애드온들은 반드시 필요하지 않지만, 많은 예제가 이를 기반으로 하기에,
모든 클러스터에는 [클러스터 DNS](/ko/docs/concepts/services-networking/dns-pod-service/)가 있어야 한다.

클러스터 DNS는 쿠버네티스 서비스에 대한 DNS 레코드를 제공하는 DNS 서버로,
사용자 환경에 있는 다른 DNS 서버와 별개로 동작한다.

쿠버네티스에 의해 실행된 컨테이너는 자동으로 이 DNS 서버를 DNS 검색에 포함한다.

### 웹 UI (대시보드)

[대시보드](/ko/docs/tasks/access-application-cluster/web-ui-dashboard/)는 쿠버네티스 클러스터를 위한
범용 웹 기반 UI이다. 이를 통해 사용자는 클러스터 자체 뿐만 아니라, 클러스터에서 실행중인 애플리케이션을
관리하고 문제를 해결할 수 있다.

### 컨테이너 리소스 모니터링

[컨테이너 리소스 모니터링](/ko/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)은
컨테이너에 대한 일반적인 시계열 메트릭을 중앙 데이터베이스에 기록하고, 해당 데이터를 탐색할 수 있는 UI를 제공한다.

### 클러스터 수준 로깅

[클러스터 수준 로깅](/docs/concepts/cluster-administration/logging/) 메커니즘은 
컨테이너 로그를 검색/탐색 인터페이스를 갖춘 중앙 로그 저장소에 저장하는 역할을 한다.

### 네트워크 플러그인

[네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)은
컨테이너 네트워크 인터페이스(CNI) 사양을 구현하는 소프트웨어 컴포넌트이다.
이는 파드에 IP 주소를 할당하고 클러스터 내에서
서로 통신할 수 있도록 하는 역할을 한다.

## 아키텍처 변형

쿠버네티스의 핵심 컴포넌트는 일관성을 유지하지만, 배포되고 관리되는 방식은
달라질 수 있다. 이러한 변형을 이해하는 것은 특정 운영 요구 사항을 충족하는 쿠버네티스 클러스터를
설계하고 유지하는 데 매우 중요하다.

### 컨트롤 플레인 배포 옵션

컨트롤 플레인 컴포넌트는 여러 방식으로 배포될 수 있다.

전통적인 배포
: 컨트롤 플레인 컴포넌트가 전용 머신이나 VM에서 직접적으로 실행되며, 보통 systemd 서비스로 관리된다.

정적 파드
: 컨트롤 플레인 컴포넌트가 정적 파드로 배포되며, 특정 노드의 kubelet에 의해 관리된다.
  이는 kubeadm과 같은 도구에서 사용하는 일반적인 방식이다.

셀프 호스팅(Self-hosted)
: 컨트롤 플레인이 쿠버네티스 클러스터 자체 내에서 파드로 실행되며, 디플로이먼트(Deployment)와
  스테이트풀셋(StatefulSet) 또는 다른 쿠버네티스 리소스에 의해 관리된다.

매니지드 쿠버네티스 서비스(Managed Kubernetes services)
: 클라우드 공급자는 종종 컨트롤 플레인을 추상화하여, 자사 서비스 제공의 일부로 컴포넌트를 관리해 준다.

### 워크로드 배치 고려사항

컨트롤 플레인 컨포넌트를 포함한 워크로드 배치는 클러스터의 크기,
성능 요구사항, 운영 정책에 따라 달라질 수 있다.

- 작은 규모의 클러스터나 개발용 클러스터에서는, 컨트롤 플레인 컴포넌트와 사용자 워크로드가 동일한 노드에서 실행될 수 있다.
- 대규모 프로덕션 클러스터에서는 보통 컨트롤 플레인 컴포넌트 전용 노드를 두어,
  사용자 워크로드와 분리한다.
- 일부 조직은 중요한 애드온이나 모니터링 도구를 컨트롤 플레인에서 실행한다.

### 클러스터 관리 도구

kubeadm, kops 그리고 Kubespray 같은 도구들은 클러스터를 배포하고 관리하는 데 서로 다른 접근 방식을 제공하며,
각 도구는 고유한 컴포넌트 배치 및 관리 방식을 가진다.

쿠버네티스 아키텍처의 유연성 덕분에 조직은 기능 복잡성, 성능, 그리고 관리 부담과 같은 요소들을 균형있게 고려하여
클러스터를 특정 요구사항에 맞게 조정할 수 있다.

### 커스터마이제이션과 확장성

쿠버네티스 아키텍처는 다양한 커스터마이제이션을 허용한다.

- 기본 쿠버네티스 스케줄러와 함께 동작하거나 완전히 대체하기 위해 커스텀 스케줄러를 배포할 수 있다.
- API 서버는 커스텀리소스정의(CustomResourceDefinitions)와 API 집계를 통해 확장될 수 있다.
- 클라우드 공급자는 클라우드 컨트롤러 매니저를 사용하여 쿠버네티스와 긴밀하게 통합할 수 있다.

쿠버네티스 아키텍처의 유연성 덕분에 조직은 기능 복잡성, 성능, 그리고 관리 부담과 같은 요소들을 균형있게 고려하여
클러스터를 특정 요구사항에 맞게 조정할 수 있다.

## {{% heading "whatsnext" %}}

다음 내용을 통해 더 알아보자.

- [노드](/ko/docs/concepts/architecture/nodes/)와
  컨트롤 플레인과의
  [통신](/ko/docs/concepts/architecture/control-plane-node-communication/).
- 쿠버네티스 [컨트롤러](/ko/docs/concepts/architecture/controller/).
- 쿠버네티스의 기본 스케줄러인 [kube-scheduler](/ko/docs/concepts/scheduling-eviction/kube-scheduler/).
- Etcd의 공식 [문서](https://etcd.io/docs/).
- 쿠버네티스에서 사용되는 여러 [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/).
- [클라우드 컨트롤러 매니저](/ko/docs/concepts/architecture/cloud-controller/)를 사용한 클라우드 공급자 통합.
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) 명령어.
