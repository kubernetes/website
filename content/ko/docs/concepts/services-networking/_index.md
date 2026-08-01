---
title: "서비스, 로드밸런싱, 네트워킹"
weight: 60
description: >
  쿠버네티스의 네트워킹에 대한 개념과 리소스에 대해 설명한다.
no_list: true
---

## 쿠버네티스 네트워크 모델

쿠버네티스 네트워크 모델은 다음과 같은 여러 요소로 구성된다.

* 클러스터의 각 [파드](/docs/concepts/workloads/pods/)에는 클러스터 전체에서
  해당 파드만의 고유한 IP 주소가 할당된다.

  * 파드에는 파드 내 모든 컨테이너가 공유하는 해당 파드만의
    네트워크 네임스페이스가 있다. 같은 파드의 서로 다른
    컨테이너에서 실행되는 프로세스는 `localhost`를 통해 서로
    통신할 수 있다.

* _파드 네트워크_(클러스터 네트워크라고도 함)는 파드 간 통신을
  처리한다. 파드 네트워크는 의도적으로 네트워크를 분할한 경우를 제외하고 다음을 보장한다.

  * 모든 파드는 같은 [노드](/docs/concepts/architecture/nodes/)에
    있든 서로 다른 노드에 있든 다른 모든 파드와 통신할 수 있다.
    파드는 프록시나 네트워크 주소 변환(NAT)을 사용하지 않고
    서로 직접 통신할 수 있다.

    윈도우에서는 이 규칙이 호스트 네트워크 파드에 적용되지 않는다.

  * 노드의 에이전트(예: 시스템 데몬 또는 kubelet)는 해당
    노드의 모든 파드와 통신할 수 있다.

* [서비스](/docs/concepts/services-networking/service/) API를 사용하면
  하나 이상의 백엔드 파드가 제공하는 서비스에 안정적인(수명이 긴) IP 주소나 호스트네임을
  제공할 수 있다. 이때 서비스를 구성하는 개별 파드는 시간이
  지남에 따라 변경될 수 있다.

  * 쿠버네티스는 서비스의 현재 백엔드 파드에 관한 정보를 제공하기 위해
    [엔드포인트슬라이스(EndpointSlice)](/docs/concepts/services-networking/endpoint-slices/)
    오브젝트를 자동으로 관리한다.

  * 서비스 프록시 구현체는 서비스와 엔드포인트슬라이스 오브젝트
    집합을 모니터링하고, 운영 체제 또는 클라우드 공급자 API로
    패킷을 가로채거나 다시 작성하여 서비스 트래픽을 백엔드로
    라우팅하도록 데이터 플레인을 구성한다.

* [게이트웨이 API(Gateway API)](/docs/concepts/services-networking/gateway/)
  또는 그 전신인 [인그레스(Ingress)](/docs/concepts/services-networking/ingress/)를
  사용하면 클러스터 외부의 클라이언트가 서비스에 접근할 수 있다.

  * 더 단순하지만 구성 옵션이 적은 클러스터
    인그레스 방식은 지원되는 {{< glossary_tooltip term_id="cloud-provider">}}를 사용하는 경우 서비스 API의
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)를 통해
    사용할 수 있다.

* [네트워크폴리시(NetworkPolicy)](/docs/concepts/services-networking/network-policies)는
  파드 간 트래픽이나 파드와 외부 환경 간 트래픽을 제어할 수 있게 해주는
  쿠버네티스 내장 API이다.

예전 컨테이너 시스템에서는 컨테이너 간 연결이 자동으로
제공되지 않았으므로, 서로 다른 호스트의 컨테이너 간 링크를
명시적으로 만들거나 컨테이너 포트를 호스트 포트에 매핑하여 다른
호스트의 컨테이너가 접근할 수 있게 해야 하는 경우가 많았다.
쿠버네티스에서는 이 작업이 필요하지 않다. 쿠버네티스 모델에서는
파드를 VM이나 물리 호스트와 매우 유사하게 취급할 수 있으며,
이는 포트 할당, 네이밍, 서비스 디스커버리, 로드
밸런싱, 애플리케이션 구성, 마이그레이션 관점에서도 마찬가지다.

이 모델 중 쿠버네티스가 직접 구현하는 부분은 일부에 불과하다.
나머지 부분은 쿠버네티스가 API를 정의하지만, 이에 해당하는
기능은 외부 컴포넌트에서 제공되며, 이러한 컴포넌트 중
일부는 선택 사항이다.

* 파드 네트워크 네임스페이스 설정은
  [컨테이너 런타임 인터페이스(CRI)](/docs/concepts/containers/cri/)를 구현하는 시스템 수준의 소프트웨어가 처리한다.

* 파드 네트워크 자체는
  [파드 네트워크 구현체](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)가 관리한다.
  리눅스에서는 대부분의 컨테이너 런타임이
  {{< glossary_tooltip text="컨테이너 네트워크 인터페이스(CNI)" term_id="cni" >}}를
  사용하여 파드 네트워크 구현체와 상호 작용하므로, 이러한
  구현체를 흔히 _CNI 플러그인_ 이라고 한다.

* 쿠버네티스는 기본 서비스 프록시 구현체를 제공하며,
  이를 {{< glossary_tooltip term_id="kube-proxy">}}라고 한다. 하지만 일부 파드
  네트워크 구현체는 자체 서비스 프록시를 대신 사용하는데, 이 프록시는
  해당 구현체의 나머지 부분과 더 긴밀하게 통합되어 있다.

* 네트워크폴리시도 일반적으로 파드 네트워크 구현체에서
  구현한다. (더 단순한 일부 파드 네트워크 구현체는 네트워크폴리시를
  구현하지 않거나, 관리자가 네트워크폴리시 지원 없이
  파드 네트워크를 구성할 수도 있다. 이 경우 API는
  여전히 존재하지만 아무런 효과가 없다.)

* [게이트웨이 API 구현체](https://gateway-api.sigs.k8s.io/implementations/)는 다양하며,
  일부는 특정 클라우드 환경 전용이고 일부는 "베어 메탈"
  환경에 더 중점을 두며 나머지는 더 범용적이다.

## {{% heading "whatsnext" %}}

[서비스와 애플리케이션 연결하기](/docs/tutorials/services/connect-applications-service/)
튜토리얼에서는 실습 예제를 통해 서비스와 쿠버네티스 네트워킹을 배울 수 있다.

[클러스터 네트워킹](/docs/concepts/cluster-administration/networking/)에서는 클러스터의 네트워킹을
설정하는 방법을 설명하고, 관련 기술에 대한 개요도 제공한다.

특정 네트워킹 개념에 대해 알아보려면 다음을 참고한다.

* [서비스](/docs/concepts/services-networking/service/) - 외부와 접하는 단일 엔드포인트 뒤에 있는 애플리케이션 노출
* [인그레스](/docs/concepts/services-networking/ingress/) - URI, 호스트네임, 경로를 사용하는 프로토콜 인식 HTTP/HTTPS 라우팅
* [게이트웨이 API](/docs/concepts/services-networking/gateway/) - 동적 인프라 프로비저닝 및 고급 트래픽 라우팅
* [네트워크 정책](/docs/concepts/services-networking/network-policies/) - IP 주소 또는 포트 수준(OSI 계층 3 또는 4)에서 트래픽 흐름 제어
* [서비스 및 파드용 DNS](/docs/concepts/services-networking/dns-pod-service/) - DNS를 사용하여 클러스터 내 서비스 검색
