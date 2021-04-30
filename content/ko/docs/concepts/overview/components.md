---
title: 쿠버네티스 컴포넌트
content_type: concept
description: >
  쿠버네티스 클러스터는 컴퓨터 집합인 노드 컴포넌트와 컨트롤 플레인
  컴포넌트로 구성된다.
weight: 20
card:
  name: concepts
  weight: 20
---

<!-- overview -->
쿠버네티스를 배포하면 클러스터를 얻는다.
{{< glossary_definition term_id="cluster" length="all" prepend="쿠버네티스 클러스터는">}}

이 문서는 완전히 작동하는 쿠버네티스 클러스터를 갖기 위해 필요한
다양한 컴포넌트들에 대해 요약하고 정리한다.

여기에 모든 컴포넌트가 함께 있는 쿠버네티스 클러스터 다이어그램이 있다.

![쿠버네티스의 컴포넌트](/images/docs/components-of-kubernetes.svg)



<!-- body -->
## 컨트롤 플레인 컴포넌트

컨트롤 플레인 컴포넌트는 클러스터에 관한 전반적인 결정(예를 들어, 스케줄링)을 수행하고 클러스터 이벤트(예를 들어, 디플로이먼트의 `replicas` 필드에 대한 요구 조건이 충족되지 않을 경우 새로운 {{< glossary_tooltip text="파드" term_id="pod">}}를 구동시키는 것)를 감지하고 반응한다.

컨트롤 플레인 컴포넌트는 클러스터 내 어떠한 머신에서든지 동작할 수 있다. 그러나
간결성을 위하여, 구성 스크립트는 보통 동일 머신 상에 모든 컨트롤 플레인 컴포넌트를 구동시키고,
사용자 컨테이너는 해당 머신 상에 동작시키지 않는다. 여러 VM에서
실행되는 컨트롤 플레인 설정의 예제를 보려면
[kubeadm을 사용하여 고가용성 클러스터 만들기](/docs/setup/production-environment/tools/kubeadm/high-availability/)를 확인해본다.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

이들 컨트롤러는 다음을 포함한다.

  * 노드 컨트롤러: 노드가 다운되었을 때 통지와 대응에 관한 책임을 가진다.
  * 레플리케이션 컨트롤러: 시스템의 모든 레플리케이션 컨트롤러 오브젝트에 대해 알맞은 수의 파드들을
  유지시켜 주는 책임을 가진다.
  * 엔드포인트 컨트롤러: 엔드포인트 오브젝트를 채운다(즉, 서비스와 파드를 연결시킨다.)
  * 서비스 어카운트 & 토큰 컨트롤러: 새로운 네임스페이스에 대한 기본 계정과 API 접근 토큰을 생성한다.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-manager는 클라우드 제공자 전용 컨트롤러만 실행한다.
자신의 사내 또는 PC 내부의 학습 환경에서 쿠버네티스를 실행 중인 경우
클러스터에는 클라우드 컨트롤러 매니저가 없다.

kube-controller-manager와 마찬가지로 cloud-controller-manager는 논리적으로
독립적인 여러 컨트롤 루프를 단일 프로세스로 실행하는 단일 바이너리로 결합한다.
수평으로 확장(두 개 이상의 복제 실행)해서 성능을 향상시키거나 장애를 견딜 수 있다.

다음 컨트롤러들은 클라우드 제공 사업자의 의존성을 가질 수 있다.

  * 노드 컨트롤러: 노드가 응답을 멈춘 후 클라우드 상에서 삭제되었는지 판별하기 위해 클라우드 제공 사업자에게 확인하는 것
  * 라우트 컨트롤러: 기본 클라우드 인프라에 경로를 구성하는 것
  * 서비스 컨트롤러: 클라우드 제공 사업자 로드밸런서를 생성, 업데이트 그리고 삭제하는 것

## 노드 컴포넌트

노드 컴포넌트는 동작 중인 파드를 유지시키고 쿠버네티스 런타임 환경을 제공하며, 모든 노드 상에서 동작한다.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### 컨테이너 런타임

{{< glossary_definition term_id="container-runtime" length="all" >}}

## 애드온

애드온은 쿠버네티스 리소스({{< glossary_tooltip text="데몬셋" term_id="daemonset" >}},
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}} 등)를
이용하여 클러스터 기능을 구현한다. 이들은 클러스터 단위의 기능을 제공하기 때문에
애드온에 대한 네임스페이스 리소스는 `kube-system` 네임스페이스에 속한다.

선택된 일부 애드온은 아래에 설명하였고, 사용 가능한 전체 확장 애드온 리스트는
[애드온](/ko/docs/concepts/cluster-administration/addons/)을 참조한다.

### DNS

여타 애드온들이 절대적으로 요구되지 않지만, 많은 예시에서 필요로 하기 때문에 모든 쿠버네티스 클러스터는 [클러스터 DNS](/ko/docs/concepts/services-networking/dns-pod-service/)를 갖추어야만 한다.

클러스터 DNS는 구성환경 내 다른 DNS 서버와 더불어, 쿠버네티스 서비스를 위해 DNS 레코드를 제공해주는 DNS 서버다.

쿠버네티스에 의해 구동되는 컨테이너는 DNS 검색에서 이 DNS 서버를 자동으로 포함한다.

### 웹 UI (대시보드)

[대시보드](/ko/docs/tasks/access-application-cluster/web-ui-dashboard/)는 쿠버네티스 클러스터를 위한 범용의 웹 기반 UI다. 사용자가 클러스터 자체뿐만 아니라, 클러스터에서 동작하는 애플리케이션에 대한 관리와 문제 해결을 할 수 있도록 해준다.

### 컨테이너 리소스 모니터링

[컨테이너 리소스 모니터링](/ko/docs/tasks/debug-application-cluster/resource-usage-monitoring/)은
중앙 데이터베이스 내의 컨테이너들에 대한 포괄적인 시계열 매트릭스를 기록하고 그 데이터를 열람하기 위한 UI를 제공해 준다.

### 클러스터-레벨 로깅

[클러스터-레벨 로깅](/ko/docs/concepts/cluster-administration/logging/) 메커니즘은
검색/열람 인터페이스와 함께 중앙 로그 저장소에 컨테이너 로그를 저장하는 책임을 진다.


## {{% heading "whatsnext" %}}

* [노드](/ko/docs/concepts/architecture/nodes/)에 대해 더 배우기
* [컨트롤러](/ko/docs/concepts/architecture/controller/)에 대해 더 배우기
* [kube-scheduler](/ko/docs/concepts/scheduling-eviction/kube-scheduler/)에 대해 더 배우기
* etcd의 공식 [문서](https://etcd.io/docs/) 읽기
