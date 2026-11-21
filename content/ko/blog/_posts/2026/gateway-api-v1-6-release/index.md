---
layout: blog
title: "게이트웨이 API v1.6: TCPRoute와 UDPRoute가 Standard로 승격"
date: 2026-08-03T08:00:00-08:00
slug: gateway-api-v1-6-release
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
translator: >
  [Suhyen Im](https://github.com/suhyenim)
---

![게이트웨이 API 로고](gateway-api-logo.svg)

쿠버네티스 SIG Network 커뮤니티는 올해 6월 30일에 릴리스된 **게이트웨이 API v1.6.0**을 알리게 되어 매우 기쁩니다!

게이트웨이 API는 쿠버네티스에서 현대적이고 역할 지향적이며
표현력 있는 서비스 네트워킹의 표준이 되었습니다.
이전 릴리스에서 게이트웨이 API는 HTTP와 TLS 7계층 트래픽에 대한
프로덕션 수준의 기반을 마련했습니다.
버전 1.6.0에서 게이트웨이 API는 표준 4계층 프로토콜 라우팅을 확장하고
실험적 혁신을 위해 API 경계를 더 명확히 하면서 크게 한 걸음 나아갑니다.

게이트웨이 API v1.6.0의 새로운 점을 간단히 정리하면 다음과 같습니다.

- **TCPRoute와 UDPRoute가 Standard로 승격**: 원시(raw) L4 TCP와 UDP 트래픽 라우팅이 `v1` API 버전에서 GA 안정성에 도달합니다.
- **실험적 API 그룹 분리**: 실험과 표준의 경계를 아주 분명하게 하기 위해 실험적 리소스가 `X` 접두사를 달고 별도의 API 그룹(`gateway.networking.x-k8s.io`)으로 옮겨 갑니다.

자세한 내용을 살펴보겠습니다!


## TCPRoute와 UDPRoute가 Standard로 승격

리드: [Nick Young](https://github.com/youngnick), [Ricardo Katz](https://github.com/rikatz) 및 [Zac Nixon](https://github.com/zac-nixon)

* [GEP-2644 - TCPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2644/)
* [GEP-2645 - UDPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2645/)

지금까지 게이트웨이 API는 HTTP와 TLS 트래픽에 대한 안정적인 라우팅 모델만 제공했습니다.
데이터베이스, DNS, VoIP, 게임, IoT 텔레메트리(telemetry)처럼 TCP나 UDP 위에서
원시 프로토콜을 주고받는 워크로드는 게이트웨이에 연결할 이식 가능한
방법이 없었습니다. 사용자는 일반 쿠버네티스 서비스나,
게이트웨이 컨트롤러 사이를 오갈 수 없는 구현체별 CRD를 쓸 수밖에 없었습니다.

[TCPRoute]와 [UDPRoute]가 그 공백을 메웁니다. 두 리소스는 프로토콜과 포트만으로 백엔드에 트래픽을 라우팅하며, L7 인식은 필요하지 않습니다.
이번 릴리스와 함께 둘 다 Experimental 채널에서 Standard로 승격되었으며, `v1` API 버전으로 이동했습니다.
각각의 `v1alpha2` 버전은 v1.6 릴리스 시점에 사용 중단(deprecated)되었으며, 향후 릴리스에서 제거될 예정입니다.

### 동작 방식

게이트웨이에는 TCPRoute 연결을 허용하는 리스너(listener)가 필요합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: TCP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: TCPRoute
```

그다음 TCPRoute가 해당 리스너에 연결되어 백엔드로 트래픽을 전달합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: TCPRoute
metadata:
  name: tcp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

게이트웨이의 포트 `12345`로 들어오는 트래픽은 포트 `6000`의 `my-foo-service` 엔드포인트로 프록시됩니다. `parentRefs`에서 `sectionName`과 `port`를 생략하면 라우트가 게이트웨이의 리스너 하나가 아니라 모든 TCP 리스너에 연결됩니다.

UDPRoute도 같은 패턴을 따릅니다. 리스너 프로토콜과 라우트 종류를 바꾸면 됩니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: UDP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: UDPRoute
---
apiVersion: gateway.networking.k8s.io/v1
kind: UDPRoute
metadata:
  name: udp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

## XBackend가 Experimental에 등장

리드: [Keith Mattix II](https://github.com/keithmattix)

* [GEP-4894 - Backend Resource](https://github.com/kubernetes-sigs/gateway-api/issues/4894)

게이트웨이 API v1.6은 새로운 `XBackend` 리소스를 도입하며, 이는 게이트웨이 API 안에서 서비스(그리고 다른 백엔드 타입)에 대한 범용 데코레이터(decorator)입니다.

서비스 리소스는 훌륭하고 안정적이며 유연한 오브젝트이지만, 거기에는 몇 가지 대가가 따릅니다. 유연성 때문에 게이트웨이 API가 처리해야 하는 엣지 케이스가 많이 생기고, 안정성 때문에 서비스에 새로운 개념을 추가하기가 불가능합니다.

XBackend 리소스는 업스트림 [`EndpointSelector` KEP](https://github.com/kubernetes/enhancements/issues/6116)의 아이디어를 기반으로, 백엔드 앱을 그대로 대상으로 삼는 게이트웨이 API 네이티브 오브젝트를 추가하고, 동시에 서비스로는 다루기 어렵거나 위험한 유스케이스를 다룰 수 있도록 커뮤니티가 이를 확장할 수 있게 합니다.

XBackend의 첫 버전은 ExternalHostname 목적지 지원을 포함하며, 이 목적지는 혼동된 대리자 공격(confused deputy attack)의 가능성 때문에 게이트웨이 API의 서비스 지원에서 배제되어 있습니다.

XBackend에서 이 지원은 Extended/Optional 기능이며, 구현체와 사용자는 보안 트레이드오프를 이해한 뒤에 이를 선택해 사용할 수 있습니다.

이 지원은 이그레스 유스케이스(클러스터에서 호스팅하는 에이전틱(agentic) 워크로드에 가장 많이 쓰입니다)에 매우 유용하며, 커뮤니티는 이를 이그레스용 게이트웨이(Gateways for Egress)에 관한 GEP로 정식화하는 작업도 진행하고 있습니다(진행 중이니 계속 지켜봐 주세요!)

**XBackend API는 실험적이며 동작이 바뀔 수 있으므로, 프로덕션에 사용할 준비가 되었다고 여기지 마세요**

클라우드 AI API로의 이그레스에 사용할 수 있는 ExternalName 백엔드를 갖춘 게이트웨이 예시는 다음과 같습니다.

```yaml

# Gateway-level TLS remains authoritative for incoming connections
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
spec:
  listeners:
  - name: https
    protocol: HTTPS
    tls:
      certificateRefs:
      - name: gateway-cert
---
# Backend resource for external destination
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackend
metadata:
  name: ai-provider-api
  namespace: ai-apps
spec:
  type: ExternalHostname
  externalHostname:
    hostname: api.ai-provider.com

---
# HTTPRoute referencing XBackend
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
spec:
  rules:
  - backendRefs:
    - name: ai-provider-api
      kind: XBackend
      group: gateway.networking.x-k8s.io
```

커뮤니티는 재시도나 TLS 오리지네이션(TLS origination)처럼 라우트 단위가 아니라 애플리케이션 단위로 설정할 수 있으면 유용한 다른 유스케이스와 설정을 포함해, `XBackendTrafficPolicy`의 세션 지속성(Session Persistence) 설정을 `XBackend`로 옮기는 작업도 하고 있습니다.

## 실험적 리소스가 표준 API 그룹에서 분리

예전에는 실험적 리소스가 표준 리소스와 같은 API 그룹인 `gateway.networking.k8s.io`를 공유했고, `v1alpha2` 형태의 버전으로만 구분되었습니다. TCPRoute와 UDPRoute가 그 방식으로 승격한 마지막 리소스였습니다.

앞으로 새로운 실험적 리소스는 별도의 그룹인
`gateway.networking.x-k8s.io`에 정의되고,
API 타입의 이름에는 `X` 접두사가 붙는데, XBackend와 XMesh가 그 예입니다.
이 중 하나가 Standard로 승격되면 `gateway.networking.k8s.io` 그룹으로 이름이 바뀌고
`X` 접두사를 떼는데, XMesh가 Mesh가 될 것으로 예상되는 것과 같은 방식입니다.

이 분리로 실험과 표준의 경계가 버전 문자열에만 의존하지 않고 API 그룹 수준에서 명시적으로 드러납니다.


## 다음 단계와 참여 방법

TCPRoute와 UDPRoute의 Standard 승격은 게이트웨이 API를 4계층과 7계층 프로토콜에 걸쳐
쿠버네티스 워크로드용 완전하고 범용적인 인그레스와 메시 네트워킹 API로
만드는 데 중요한 마일스톤입니다.

### 사용해 보기

원하는 게이트웨이 컨트롤러 구현체로 지금 바로 게이트웨이 API v1.6.0을 사용할 수 있습니다.

- 자세한 가이드와 API 레퍼런스는 [게이트웨이 API 문서](https://gateway-api.sigs.k8s.io/)를 확인해 보세요.
- CRD 설치와 변경 사항의 전체 내용은 [v1.6.0 릴리스 노트](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.0)에서 살펴보세요.

게이트웨이 API는 모든 구현체에서 일관되고 이식 가능한 동작을 보장하기 위해 광범위한
적합성 테스트 스위트(conformance test suite)에 의존합니다.
이 글을 게시한 날을 기준으로 v1.6 적합성을 충족하는 구현체 목록은 다음과 같습니다.

- [Agentgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/agentgateway-agentgateway)
- [Airlock Microgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/airlock-microgateway)
- [GKE Gateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/gke-gateway)
- [kgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/kgateway)
- [NGINX Gateway Fabric](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/nginx-nginx-gateway-fabric)
- [Traefik Proxy](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/traefik-traefik)

### 참여 방법

게이트웨이 API는 쿠버네티스 SIG Network 아래에서 만들어진, 커뮤니티가 주도하는 열린 프로젝트입니다. 모든 분의 기여와 피드백, 참여를 환영합니다!

- **슬랙 채널 참여**: [쿠버네티스 슬랙](https://slack.k8s.io/)에서 `#sig-network-gateway-api`에 참여해 보세요.
- **커뮤니티 회의 참석**: 매주 커뮤니티 회의를 엽니다. 날짜와 안건은 [SIG Network 캘린더](https://www.kubernetes.dev/community/community-groups/sigs/network/)에서 확인해 보세요.
- **GitHub에서 기여**: [kubernetes-sigs/gateway-api](https://github.com/kubernetes-sigs/gateway-api)에서 이슈를 등록하고 개선 사항(GEP)을 제안하거나 PR을 제출해 보세요.

### 감사의 말

노고를 아끼지 않고 게이트웨이 API v1.6.0을 가능하게 만든 모든 기여자와 리뷰어, 메인테이너, 구현체 작성자에게 깊이 감사드립니다!

[TCPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/tcp/
[UDPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/udp/
