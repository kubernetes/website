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
클라우드 네이티브 정보보안의 모범 사례에 대해 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 재단에게 조언을 얻고 있다.

이 페이지를 통해 어떻게 쿠버네티스가 안전한 클라우드 네이티브 플랫폼을 배포할 수 있도록
설계되었는지에 대해 읽어보자.

## 클라우드 네이티브 정보 보안

{{< comment >}}
이 백서는 현지화 버전도 가능합니다. 만약에 현지화된 문서를 연결할 수 있으면,
더 좋을 것이다.
{{< /comment >}}

CNCF 재단의 클라우드 네이티브 보안 [백서](<(https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)>)
에는 각 _생애주기_ 에 따른 보안 통제와 사례 정의한다.

## _개발_ 단계 {#lifecycle-phase-develop}

- 개발 환경의 무결성을 유지한다.
- 맥락에 적합한 정보보안 모범 사례를 따라서
  애플리케이션을 디자인한다.
- 솔루션 디자인의 일부분으로서 엔드 유저 보안을 고려한다.

이를 달성하기 위해서는, 아래와 같이 할 수 있다.

1. 공격 표면과 내부 위협도 최소화하는 [제로 트러스트](https://glossary.cncf.io/zero-trust-architecture/)
   아키텍쳐를 쓴다.
1. 보안 관점이 반영된 코드 리뷰 과정을 거친다.
1. 신뢰 경계를 정의하는 시스템이나 애플리케이션의 _위협 모델_ 을 수립한다.
   해당 모델은 위험을 인지하고 해결 방안을 찾는데 도움을 준다.
1. 필요시 퍼징이나 [보안 카오스 엔지니어링](https://glossary.cncf.io/security-chaos-engineering/)과
   같은 고급 보안 자동화 시스템을 도입한다.

## _분배_ 단계 {#lifecycle-phase-distribute}

- 실행하고 있는 컨테이너 이미지의 공급망 보안을 유지한다.
- 애플리케이션을 실행하는 클러스터와 컴포넌트에 대한 공급망 보안을 유지한다.
  다른 컴포넌트를 예로 들면 외부 데이터베이스는 클라우드 네이티브 애플리케이션이 공격의 지속성을 위해 활용될 수 있다.

이를 달성하기 위해서는 아래와 같이 할 수 있다.

1. 알려진 취약점을 찾기 위해 컨테이너 이미지와 다른 아티펙트를 스캔한다.
1. 소프트웨어 배포 중에 소스의 신뢰 사슬과 함께 암호화 되었는지 확인한다.
1. 보안 발표가 나올때, 업데이트가 가능하다면 의존성을 업데이트하는 과정을 도입하고 준수한다.
1. 공급망 검증을 위해 디지털 인증서와 같은 유효성 검사 매커니즘을 사용한다.
1. 보안 위협 관련 알림을 받기 위해 피드나 다른 매커니즘을 구독한다.
1. 아티팩트의 접근을 제한한다. 인증받은 클라이언트만 이미지를 가져올 수 있도록
   [사설 레지스트리](/docs/concepts/containers/images/#using-a-private-registry)에
   컨테이너 이미지를 배치한다.

## _배포_ 단계 {#lifecycle-phase-deploy}

무엇이 배포되고, 누가 배포하고, 그리고 어디에 배포되는지에 대한 적절한 제약사항을 확인한다.
컨테이너 이미지 아티펙트의 암호학적인 신원을 검증하는 것처럼 _분배_ 단계에서 조치를 시행할 수 있다.

만약에 쿠버네티스를 배포한다면, 당신은 애플리케이션의 런타임 환경을
위해 기반을 마련한다.: 쿠버네티스 클러스터(혹은 다중 클러스터).
IT 인프라에서는 기대한 것보다 높은 계층에서 보안 인증서를 제공해야 한다.

## _런타임_ 단계 {#lifecycle-phase-runtime}

런타임 단계에서는 3가지 핵심 영역으로 구성된다.: [접근 권한](#protection-runtime-access),
[컴퓨트](#protection-runtime-compute) 그리고 [스토리지](#protection-runtime-storage).

### 런타임 보호: 접근 권한 {#protection-runtime-access}

쿠버네티스 API는 클러스터가 어떤 작업을 하는지 보여준다. 효율적으로 클러스터를 보호하는 것의 핵심은
API를 보호하는 것이다.

쿠버네티스 문서의 다른 페이지에서 어떻게 권한 제어 측면에서 설치해야 하는지에 대해 자세하게 나와 있다. [보안 점검사항](/docs/concepts/security/security-checklist/)
에서 클러스터에서의 기초적인 점검 사항을 제시한다.

그 이외에도, 클러스터를 안전하게 보호하는 것은 API의 효율적인
[인증](/ko/docs/concepts/security/controlling-access/#authentication)과
[인가](/ko/docs/concepts/security/controlling-access/#authorization) 를 구현한다는 의미이다.
워크로드와 클러스터 컴포넌트의 보안 신원을 제공하고 관리하기 위해
[서비스어카운트](/docs/concepts/security/service-accounts/)를 사용한다.

쿠버네티스는 API 트래픽을 보호하기 위해 TLS를 사용한다. 반드시 TLS를 사용하여
클러스터를 배포하거나 (노드와 컨트롤 플레인 사이에 있는 트래픽을 포함한다.),
암호화된 키를 보호해야 한다. 만약 [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)를 위해
쿠버네티스의 API를 사용한다면,
오용을 제한하는 것에 특별히 주의한다.

### 런타임 보호: 컴퓨트 {#protection-runtime-compute}

{{< glossary_tooltip text="컨테이너" term_id="container" >}}는 2가지의 애플리케이션을 제공한다.: 다른 애플리케이션 간에 독립되거나 격리된 애플리케이션을 결합하여 동일한 호스트 컴퓨터로 작동하게 만드는 매커니즘이 있다. 격리와 집합 두 가지 측면에서 런타임 보안은 트레이드 오프를 식별하여 적절한 균형을 찾는 것이 포함된다는 의미이다.

쿠버네티스는 컨테이너를 설치하고 실행하기 위해
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}에 의존한다.
쿠버네티스 프로젝트는 특정 컨테이너 런타임을 추천하지 않으며
선택한 런타임이 정보 보안의 요구에 충족해야 한다.

런타임에 있는 컴퓨트를 보호하기 위해서는 아래와 같이 할 수 있다.

1. 애플리케이션을 위해 오직 필요한 권한으로만 작동될 수 있도록 도와주는
   [파드 시큐리티 표준](/ko/docs/concepts/security/pod-security-standards/)을 강제한다.
1. 컨테이너화된 워크로드를 실행하기 위해 만들어진 전문화된
   운영체제를 노드로 사용한. 일반적으로 읽기 전용 운영체제(_불변의 이미지_) 기반이며
   오직 컨테이너를 실행하는데 필수적인 서비스만 제공한다.

   컨테이너 특화된 운영체제 시스템은 시스템 컴포넌트를 격리하고
   컨테이너 탈출과 관련된 공격 표면을 감소시킨다.

1. 공정하게 공유된 리소스를 할당하기 위해 [리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)를
   정의하고, 파드가 리소스 요구사항을 명시할 수 있도록
   [리밋 레인지](/ko/docs/concepts/policy/limit-range/)과 같은 매커니즘을 사용한다.
1. 서로 다른 노드들로 워크로드를 분산시키자.
   쿠버네티스 혹은 생태계에서든 다른 신뢰 컨텍스트가 있는 파드가 분리된 노드들에서 작동될 수 있도록
   [노드 격리](/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction) 매커니즘을 사용한다.
1. 보안 제약사항을 제공하기 위해
   {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을 사용한다.
1. 리눅스 노드에서는 [AppArmor](/ko/docs/tutorials/security/apparmor/)
   혹은 [seccomp](/docs/tutorials/security/seccomp/)와 같은 리눅스 보안 모듈을 사용한다.

### 런타임 보호: 스토리지 {#protection-runtime-storage}

클러스터 내에 있는 스토리지나 실행 중인 애플리케이션을 보호하기 위해서는 아래와 같이 할 수 있다.

1. 클러스터를 볼륨 암호화 기능을 제공하는 외부 스토리지 플러그인과 통합한다.
1. API 오브젝트에 [암호화](/docs/tasks/administer-cluster/encrypt-data/)를
   가능하게 한다.
1. 백업하는 동안 데이터 내구성을 보호한다. 필요할때마다 복구할 수 있는지
   검증한다.
1. 클러스터 노드와 의존하는 스토리지 간 네트워크 연결을 인증한다.
1. 애플리케이션 내에 데이터 암호화를 구현한다.

전문화된 하드웨어 내에서 생성된 암호화 키는 노출 위험에
대응하여 최고의 보호를 제공한다. _하드웨어 보안 모듈_
은 보안 키가 다른곳에 복사되지 않으면서 암호학적인 작동을 수행한다.

### 네트워킹과 보안

[네트워크 정책](/ko/docs/concepts/services-networking/network-policies/) 혹은
[서비스 메시](https://glossary.cncf.io/service-mesh/)와 같이 네트워크 보안 측정을
고려할 것이다.
어떤 쿠버네티스 네트워크 플러그인은
가상 사설 네트워크 (VPN)의 오버레이와 기술을 활용하여
클러스터 네트워크에 암호화를 제공한다.
계획적으로, 쿠버네티스는 클러스터에 네트워크 플러그인을 사용하도록 한다
(만약 당신이 관리형 쿠버네티스를 사용한다면, 클러스터를 관리하는 개인 혹은 조직은
원하는 네트워크 플러그인을 선택했을 수 있다).

선택한 네트워크 플러그인과 그것을 통합하는 방법은
전송 중에 정보 보안에 큰 영향을 줄 수 있다.

### 관찰가능성과 런타임 보안

쿠버네티스는 클러스터를 추가적인 도구와 함께 확장하게 한다. 애플리케이션과 실행 중인 쿠버네티스를
모니터링하거나 트러블 슈팅하도록 도와주는 써드 파티 솔루션을 설치할 수 있다.
쿠버네티스 내에서 제공하는 기초적인 관찰가능성 기능을 사용할 수 있다.
컨테이너 내에 실행 중인 코드는 로그를 생성할 수 있으며, 메트릭을 발행하거나
다른 관찰 가능성 데이터를 제공할 수 있다.: 배포 시간에는
클러스터가 적절한 수준의 보호를 제공하는지 확실히 한다.

만약에 메트릭 대시보드나 유사한 무언가를 구축했다면, 데시보드에 데이터를 입력하는
구성 요소들과 대시보드 자체를 검토한다. 전체적으로
클러스터의 품질이 저하되는 사고가 발생하는 동안에도 의존할 수 있는
충분한 탄력성과 무결성 보호로 설계되었는지 확인하다.

필요한 경우에는, 암호학적으로 측정된 부트 혹은 인증된 시간 전달
(로그와 감사 기록의 신뢰성에 도움을 준다) 처럼
쿠버네티스 자체 수준에서 보안 조치를 시행한다.

높은 신뢰가 요구되는 환경인 경우에는, 로그가 변조되지 않고 기밀성이 보장될 수 있도록
암호학적인 조치를 취한다.

## {{% heading "whatsnext" %}}

### 클라우드 네이티브 보안 {#further-reading-cloud-native}

- 클라우드 네이티브 보안과 관련되 CNCF [백서](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
- 소프트웨어 공급망을 보호하기 위한 모범 사례가 있는 CNCF [백서](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)
- [Fixing the Kubernetes clusterf\*\*k: Understanding security from the kernel up](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
- [Kubernetes Security Best Practices](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
- [Towards Measured Boot Out of the Box](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

### 쿠버네티스와 정보 보안 {#further-reading-k8s}

- [쿠버네티스 보안](/docs/ko/concepts/security/)
- [클러스터 보호하기](/docs/tasks/administer-cluster/securing-a-cluster/)
- 컨트롤 플레인을 위한 [전송 중 데이터 암호화](/docs/tasks/tls/managing-tls-in-a-cluster/)
- [데이터 암호화](/docs/tasks/administer-cluster/encrypt-data/)
- [쿠버네티스 시크릿](/ko/docs/concepts/configuration/secret/)
- [쿠버네티스 API 접근 제어하기](/ko/docs/concepts/security/controlling-access)
- 파드를 위한 [네트워크 정책](/ko/docs/concepts/services-networking/network-policies/)
- [파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards/)
- [런타임클래스](/ko/docs/concepts/containers/runtime-class)
