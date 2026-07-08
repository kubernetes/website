---
title: "클라우드 네이티브 보안과 쿠버네티스"
linkTitle: "클라우드 네이티브 보안"
weight: 10

# The section index lists this explicitly
hide_summary: true

description: >
  클라우드 네이티브 워크로드를 안전하게 유지하기 위한 개념
---

쿠버네티스는 클라우드 네이티브 아키텍쳐 기반으로 구성되어 있으며,
클라우드 네이티브 정보보안의 모범 사례에 대해 {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
재단에게 조언을 얻고 있다.

이 페이지를 통해 어떻게 쿠버네티스가 안전한 클라우드 네이티브 플랫폼을 배포할 수 있도록
설계되었는지에 대해 읽어보자.

## 클라우드 네이티브 정보 보안

{{< comment >}}
이 백서는 현지화 버전도 가능하다. 만약에 현지화된 문서를 연결할 수 있으면,
더 좋을 것이다.
{{< /comment >}}

CNCF 클라우드 네이티브 보안
[백서](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
에는 각 _생애주기_ 에 따른 보안 통제와 사례를 정의한다.

## _개발_ 라이프사이클 {#lifecycle-phase-develop}

- 개발 환경의 무결성을 유지한다.
- 상황에 맞는 정보보안 모범 사례를 따라
  애플리케이션을 디자인한다.
- 솔루션 디자인의 일부분으로서 최종 사용자 보안을 고려한다.

이를 달성하기 위해서 아래와 같이 할 수 있다.

1. 내부 위협까지 포함하여 공격 표면을 최소화할 수 있는
   [제로 트러스트](https://glossary.cncf.io/zero-trust-architecture/)와 같은 아키텍처를 채택한다.
1. 보안 관점을 고려할 수 있는 코드 리뷰 과정을 정한다.
1. 시스템이나 애플리케이션의 _위협 모델_ 을 구축하여 신뢰 경계를
   식별한다. 이는 위험을 파악하고 해결 방안을 찾는데
   도움을 준다.
1. 필요시 _퍼징_ 이나
   [보안 카오스 엔지니어링](https://glossary.cncf.io/security-chaos-engineering/)과
   같은 고급 보안 자동화 시스템을 도입한다.

## _분배_ 라이프사이클 {#lifecycle-phase-distribute}

- 실행하고 있는 컨테이너 이미지의 공급망 보안을 보장한다.
- 애플리케이션을 실행하는 클러스터와 컴포넌트의 공급망 보안을 보장한다.
  예로 들어, 클라우드 네이티브 애플리케이션이 영속성을 위해 사용하는 외부 데이터베이스도
  그 구성 요소 중 하나일 수 있다.

이를 달성하기 위해서 아래와 같이 할 수 있다.

1. 컨테이너 이미지와 다른 아티팩트를 스캔하여 알려진 취약점을 탐지한다.
1. 소프트웨어 배포 중에 전송 구간 암호화를 사용하여 소프트웨어 소스에
   대한 신뢰 체계를 보장한다.
1. 보안 공지에 대응하기 위해 업데이트가 가능할 때마다 의존성을
   갱신하는 과정을 도입하고 따른다.
1. 공급망 검증을 위해 디지털 인증서와 같은
   유효성 검사 매커니즘을 사용한다.
1. 피드나 다른 매커니즘을 구독하여
   보안 위협 관련 알림을 받는다.
1. 아티팩트의 접근을 제한한다. 인증받은 클라이언트만 이미지를 가져올 수 있도록
   [프라이빗 레지스트리](/ko/docs/concepts/containers/images/#프라이빗-레지스트리-사용)
   컨테이너 이미지를 배치한다.

## _배포_ 라이프사이클 {#lifecycle-phase-deploy}

무엇이 배포될 수 있는지, 누가 배포할 수 있는지,
그리고 어디에 배포할 수 있는지에 대한 적절한 제약을 설정한다.
예를 들어, 컨테이너 이미지 산출물의 암호학적 신원을 검증하며
_분배_ 단계에서 조치를 강화할 수 있다.

쿠버네티스를 배포하면 애플리케이션 런타임 환경의 기반인
쿠버네티스 클러스터(혹은
다중 클러스터)가 구성된다.
해당 IT 인프라는 상위 계층에서 기대하는
보안 보장을 제공해야 한다.

## _런타임_ 라이프사이클 {#lifecycle-phase-runtime}

런타임 단계는 세 가지 핵심 영역으로 구성된다. [접근](#protection-runtime-access)
[컴퓨트](#protection-runtime-compute) 그리고 [스토리지](#protection-runtime-storage).

### 런타임 보호: 접근 권한 {#protection-runtime-access}

쿠버네티스 API는 클러스터가 동작하는 핵심이다. 이 API를 보호하는 것은
효과적인 클러스터 보안을 제공하는 데 핵심적이다.

쿠버네티스 문서의 다른 페이지에서는 접근 제어를 설정하는
구체적인 방법을 다루고 있다. [보안 점검사항](/docs/concepts/security/security-checklist/)
에서 클러스터를 위한 기초적인 점검 항목을 제시한다.

그 이외에도, 클러스터를 안전하게 보호하기 위해서 API 접근에 대해 효과적인
[인증](/ko/docs/concepts/security/controlling-access/#authentication)과
[인가](/ko/docs/concepts/security/controlling-access/#authorization)를 구현해야 한다.
워크로드와 클러스터 컴포넌트의 보안 신원을 제공하고 관리하기 위해
[서비스어카운트](/docs/concepts/security/service-accounts/)를 사용한다.

쿠버네티스는 API 트래픽을 보호하기 위해 TLS를 사용한다. 반드시 TLS를 사용하여
클러스터를 배포하거나 (노드와 컨트롤 플레인 사이에 있는 트래픽을 포함한다),
암호화된 키를 보호해야 한다. 만약 [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)를 위해
쿠버네티스의 API를 사용한다면,
오용을 방지하도록 특별히 주의한다.

### 런타임 보호: 컴퓨트 {#protection-runtime-compute}

{{< glossary_tooltip text="컨테이너" term_id="container" >}}는 두 가지를 제공한다.
하나는 서로 다른 애플리케이션 간의 격리이고, 다른 하나는
이러한 격리된 애플리케이션을 결합하여
동일한 호스트 컴퓨터에서 작동하도록 하는 매커니즘이다. 격리와 집합 두 가지 측면에서 런타임 보안은 절충을 식별하여 적절한 균형을 찾는 것이
포함된다는 의미이다.

쿠버네티스는 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을 사용하여
컨테이너를 실제로 설치하고 실행한다. 쿠버네티스 프로젝트는
특정 컨테이너 런타임을 권장하지 않으며,
선택한 런타임이 정보 보안 요구 사항을 충족하는지 확인해야 한다.

런타임에 있는 컴퓨트를 보호하기 위해서 아래와 같이 할 수 있다.

1. 애플리케이션에 [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/)을 적용하여
   필요한 권한으로만 실행되도록 강제한다.
1. 컨테이너화된 워크로드 실행을 위해 만들어진 전문화된
   운영체제를 노드에서 실행한다. 이는 일반적으로 읽기 전용
   운영체제(_불변의 이미지_) 기반이며
   오직 컨테이너를 실행하는데 필수적인 서비스만 제공한다.

   컨테이너에 특화된 운영체제는 시스템 컴포넌트를 격리하여
   컨테이너 탈출과 관련된 공격 표면을 감소시킨다.
1. [리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)를 정의하여
   공유된 리소스를 공정하게 할당하고
   [리밋 레인지](/ko/docs/concepts/policy/limit-range/)와 같은 매커니즘을 사용하여
   파드가 리소스 요구사항을 지정하도록 한다.
1. 서로 다른 노드들에 워크로드를 분산한다.
   쿠버네티스 또는 생태계에서
   [노드 격리](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction) 매커니즘을 사용하여
   서로 다른 신뢰 컨텍스트를 가진 파드가 별도의 노드 집합에서 실행되도록 한다.
1. 보안 제약사항을 제공하기 위해
   {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을 사용한다.
1. 리눅스 노드에서는 [AppArmor](/ko/docs/tutorials/security/apparmor/)
   혹은 [seccomp](/docs/tutorials/security/seccomp/)와 같은 리눅스 보안 모듈을 사용한다.

### 런타임 보호: 스토리지 {#protection-runtime-storage}

클러스터 내에 있는 스토리지나 실행 중인 애플리케이션을 보호하기 위해서는 아래와 같이 할 수 있다.

1. 클러스터를 볼륨 암호화 기능을 제공하는 외부 스토리지 플러그인과 통합한다.
1. API 오브젝트에 [암호화](/docs/tasks/administer-cluster/encrypt-data/)를
   가능하게 한다.
1. 백업하는 동안 데이터 내구성을 보호한다. 필요할 때마다 복구할 수 있는지
   검증한다.
1. 클러스터 노드와 해당 노드가 사용하는 모든 네트워크 스토리지 간의
   연결을 인증한다.
1. 자체 애플리케이션 내에 데이터 암호화를 구현한다.

특수 하드웨어 내에서 생성된 암호화 키는 노출 위험으로부터
최상의 보호 효과를 제공한다. _하드웨어 보안 모듈_ 을 사용하면
보안 키를 다른 곳에 복사하지 않고도
암호화 작업을 수행할 수 있다.

### 네트워킹 및 보안

[네트워크 정책](/ko/docs/concepts/services-networking/network-policies/) 혹은
[서비스 메시](https://glossary.cncf.io/service-mesh/)와 같은 네트워크 보안 조치도
고려해야 한다.
일부 쿠버네티스용 네트워크 플러그인은
가상 사설 네트워크 (VPN) 오버레이와 같은 기술을 활용하여
클러스터 네트워크에 암호화를 제공한다.
쿠버네티스는 기본적으로 클러스터에 자체 네트워크 플러그인을 사용할 수 있도록 설계되었다.
(만약 당신이 관리형 쿠버네티스를 사용한다면, 클러스터를 관리하는 개인 혹은 조직은
원하는 네트워크 플러그인을 선택했을 수 있다).

선택한 네트워크 플러그인과 통합하는 방식은
전송 중의 정보 보안에 큰 영향을 줄 수 있다.

### 관찰가능성과 런타임 보안

쿠버네티스에 추가 도구를 사용하여 클러스터를 확장할 수 있다. 애플리케이션과 실행 중인 쿠버네티스를
모니터링하거나 문제 해결을 도와주는 써드파티 솔루션을 설치할 수 있다.
또한, 쿠버네티스 자체에 기본으로 내장된 몇 가지 기본적인 관찰가능성 기능을 사용할 수 있다.
컨테이너 내에 실행 중인 코드는 로그를 생성할 수 있으며, 메트릭을 발행하거나
다른 관찰 가능성 데이터를 제공할 수 있다. 배포 시점에는
클러스터가 적절한 수준의 보호를 제공하는지 확인해야 한다.

메트릭 대시보드 또는 이와 유사한 기능을 설정하는 경우, 대시보드에 데이터를 입력하는
구성 요소 체인과 대시보드 자체를 검토해야 한다. 전체적으로
클러스터의 품질이 저하되는 사고가 발생하는 동안에도 의존할 수 있는
충분한 탄력성과 무결성 보호 기능을 갖춘 채로 설계되었는지 확인한다.

필요한 경우 암호화 기반 측정 부팅이나 인증된 시간 전달
(로그 및 감사 기록의 정확성을 보장하는 데 도움을 준다) 처럼
쿠버네티스 자체 수준에서 보안 조치를 시행한다.

높은 신뢰가 요구되는 환경을 위해서는 암호화 보호 기능을 구축하여
로그가 변조되지 않고 기밀성이 보장될 수 있도록 한다.

## {{% heading "whatsnext" %}}

### 클라우드 네이티브 보안 {#further-reading-cloud-native}

- 클라우드 네이티브 보안과 관련된
  CNCF [백서](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
- 소프트웨어 공급망을 보호하기 위한 모범 사례가 있는
  CNCF [백서](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)
- [쿠버네티스 보안 대혼란 해결하기: 커널에서부터 이해하는 보안](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
- [쿠버네티스 보안 모범 사례](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
- [기본적으로 사용할 수 있는 측정 부트를 향하여](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

### 쿠버네티스와 정보 보안 {#further-reading-k8s}

- [쿠버네티스 보안](/ko/docs/concepts/security/)
- [클러스터 보호하기](/docs/tasks/administer-cluster/securing-a-cluster/)
- 컨트롤 플레인을 위한 [전송 중 데이터 암호화](/ko/docs/tasks/tls/managing-tls-in-a-cluster/)
- [저장된 데이터 암호화](/docs/tasks/administer-cluster/encrypt-data/)
- [쿠버네티스 시크릿](/ko/docs/concepts/configuration/secret/)
- [쿠버네티스 API 접근 제어하기](/ko/docs/concepts/security/controlling-access)
- 파드를 위한 [네트워크 정책](/ko/docs/concepts/services-networking/network-policies/)
- [파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards/)
- [런타임클래스](/ko/docs/concepts/containers/runtime-class)
