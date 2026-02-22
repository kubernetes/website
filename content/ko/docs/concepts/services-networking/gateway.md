---
title: 게이트웨이 API
content_type: concept
description: >-
  게이트웨이 API는 동적 인프라 프로비저닝과
  고급 트래픽 라우팅을 제공하는 API 종류들의 모음이다.
weight: 55
---

<!-- overview -->

확장 가능하고 역할 지향적이며, 프로토콜을 인식하는 구성 메커니즘을 사용하여 네트워크 서비스를 사용할 수 있도록
한다. [게이트웨이 API(Gateway API)](https://gateway-api.sigs.k8s.io/)는 동적 인프라 프로비저닝과 고급 트래픽 라우팅을
제공하는 API [종류(kind)](https://gateway-api.sigs.k8s.io/references/spec/)를 포함하는
{{<glossary_tooltip text="애드온(Add-ons)" term_id="addons">}}이다.

<!-- body -->

## 설계 원칙

다음 원칙들은 게이트웨이 API의 설계와 아키텍처에 기반이 되었다.

* __역할 지향:__ 게이트웨이 API의 종류들은 쿠버네티스 서비스 네트워킹을 관리하는
  책임을 가진 조직 내 역할을 기반으로 모델링되었다.
  * __인프라 제공자:__ 다수의 격리된 클러스터가 여러 개의 테넌트를 서비스할 수 있도록 하는 인프라를
    관리하며 예를 들어 클라우드 제공자가 이에 해당한다.
  * __클러스터 운영자:__ 클러스터를 관리하며 일반적으로 정책, 네트워크 접근, 애플리케이션
    권한 등에 관심을 둔다.
  * __애플리케이션 개발자:__ 클러스터에서 실행되는 애플리케이션을 관리하며 일반적으로
    애플리케이션 레벨의 구성과 [서비스](/docs/concepts/services-networking/service/)
    조합에 관심을 둔다.
* __이식성:__ 게이트웨이 API 사양은 [커스텀 리소스](/docs/concepts/extend-kubernetes/api-extension/custom-resources)로
  정의되며 다양한 [구현체](https://gateway-api.sigs.k8s.io/implementations/)에서 지원된다.
* __표현력:__ 게이트웨이 API 종류들은 [인그레스](/docs/concepts/services-networking/ingress/)에서
  커스텀 어노테이션을 사용해야만 가능했던 헤더 기반 매칭, 트래픽 가중치 설정 등의
  일반적인 트래픽 라우팅 사용 사례를 위한 기능을 지원한다.
* __확장성:__ 게이트웨이는 API의 다양한 계층에서 커스텀 리소스를 연결할 수 있도록 한다.
  이렇게 하면 API 구조 내의 적절한 위치에서 세밀한 사용자 정의가 가능하다.

## 리소스 모델

게이트웨이 API에는 네 가지 안정화 API 종류가 있다.

* __게이트웨이클래스(GatewayClass):__ 공통 구성을 가진 게이트웨이들의 집합을 정의하며, 해당 클래스를 구현하는 컨트롤러에
  의해 관리된다.

* __게이트웨이(Gateway):__ 클라우드 로드 밸런서와 같은 트래픽 처리 인프라의 인스턴스를 정의한다.

* __HTTP라우트(HTTPRoute):__ 게이트웨이 리스너에서 오는 트래픽을 백엔드 네트워크 엔드포인트들의 표현으로 매핑하기 위한 HTTP
  전용 규칙을 정의한다. 이러한 엔드포인트들은 종종
  {{<glossary_tooltip text="서비스" term_id="service">}}로 표현된다.

* __GRPC라우트(GRPCRoute):__ 게이트웨이 리스너에서 오는 트래픽을 백엔드 네트워크 엔드포인트들의 표현으로 매핑하기 위한 gRPC
  전용 규칙을 정의한다. 이러한 엔드포인트들은 종종
  {{<glossary_tooltip text="서비스" term_id="service">}}로 표현된다.

게이트웨이 API는 조직의 역할 지향적 특성을 지원하기 위해 상호 의존적인 관계를 가진 서로 다른
API 종류들로 구성된다. 게이트웨이 오브젝트는 정확히 하나의 게이트웨이클래스와 연결되어 있으며,
게이트웨이클래스는 해당 클래스의 게이트웨이를 관리하는 게이트웨이 컨트롤러를 설명한다.
그 다음 HTTPRoute와 같은 하나 이상의 라우트 종류가 게이트웨이에 연결된다. 게이트웨이는 자신의
`listeners`에 연결될 수 있는 라우트를 필터링할 수 있으며, 이를 통해 라우트와의 양방향 신뢰 모델을 형성한다.

다음 그림은 세 가지 안정화 게이트웨이 API 종류 간의 관계를 보여준다.

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="세 가지 안정화 게이트웨이 API 종류 간의 관계를 보여주는 그림" class="diagram-medium" >}}

### 게이트웨이클래스 {#api-kind-gateway-class}

게이트웨이들은 종종 서로 다른 구성을 가지며, 서로 다른 컨트롤러들에 의해 구현될 수 있다. 게이트웨이는
해당 클래스를 구현하는 컨트롤러의 이름을 포함한 게이트웨이클래스를 반드시
참조해야 한다.

다음은 최소한의 게이트웨이클래스 예시이다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

이 예시에서는 게이트웨이 API를 구현한 컨트롤러가 `example.com/gateway-controller`라는
컨트롤러 이름을 가진 게이트웨이클래스를 관리하도록 구성되어 있다. 이 클래스에 속한 게이트웨이들은
해당 구현체의 컨트롤러에 의해 관리된다.

이 API 종류의 전체 정의에 대해서는 [게이트웨이클래스](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)
레퍼런스를 참고한다.

### 게이트웨이 {#api-kind-gateway}

게이트웨이는 트래픽 처리 인프라의 인스턴스를 설명한다. 이는 서비스와 같은
백엔드를 위해 필터링, 밸런싱, 분할 등의 트래픽 처리를 수행하는데 사용할 수 있는 네트워크 엔드포인트를
정의한다. 예를 들어, 게이트웨이는 HTTP 트래픽을 수신하도록 구성된 클라우드 로드 밸런서나 클러스터 내 프록시
서버를 나타낼 수 있다.

다음은 일반적인 게이트웨이 리소스 예시이다. 

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-namespace
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    hostname: "www.example.com"
    allowedRoutes:
      namespaces:
        from: Same
```

이 예시에서는 트래픽 처리 인프라의 인스턴스가 포트 80에서 HTTP 트래픽을 수신하도록
구성되어 있다. `addresses` 필드가 지정되지 않았기 때문에, 주소나 호스트네임은 구현체의 컨트롤러에 의해
게이트웨이에 할당된다. 이 주소는 라우트에 정의된 백엔드 네트워크 엔드포인트의 트래픽을 처리하기 위한 네트워크
엔드포인트로 사용된다.

이 API 종류의 전체 정의에 대해서는 [게이트웨이](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)
레퍼런스를 참고한다.

{{< note >}}
기본적으로 게이트웨이는 같은 네임스페이스의 라우트만 수신한다. 교차 네임스페이스(cross-namespace)의 라우트를 사용하려면 `allowedRoutes`를 구성해야 한다.
{{< /note >}}

### HTTP라우트 {#api-kind-httproute}

HTTP라우트 종류는 게이트웨이 리스너에서 백엔드 네트워크 엔드포인트로 전달되는 HTTP 요청의 라우팅 동작을
지정한다. 서비스 백엔드의 경우, 구현체는 백엔드 네트워크 엔드포인트를 서비스 IP 또는 해당 서비스를 뒷받침하는 엔드포인트슬라이스(EndpointSlice)로
표현할 수 있다. HTTP라우트는 하위 게이트웨이 구현체에 적용되는 구성을
나타낸다. 예를 들어, 새로운 HTTP라우트를 정의하면 클라우드 로드 밸런서나 클러스터 내 프록시 서버에 추가적인
트래픽 라우트를 구성하게 될 수 있다.

다음은 일반적인 HTTP라우트 예시이다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

이 예시에서는 호스트: 헤더가 `www.example.com`으로 설정되고 요청 경로가 `/login`으로 지정된 `example-gateway` 게이트웨이의
HTTP 트래픽은 포트 `8080`의 `example-svc` 서비스로 라우팅된다.

이 API 종류의 전체 정의에 대해서는 [HTTP라우트](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)
레퍼런스를 참고한다.


### GRPC라우트 {#api-kind-grpcroute}

GRPC라우트 종류는 게이트웨이 리스너에서 백엔드 네트워크 엔드포인트로 전달되는 gRPC 요청의 라우팅 동작을
지정한다. 서비스 백엔드의 경우, 구현체는 네트워크 엔드포인트를 서비스 IP 또는 해당 서비스를 뒷받침하는 엔드포인트슬라이스(EndpointSlice)로
표현할 수 있다. GRPC라우트는 하위 게이트웨이 구현체에 적용되는 구성을
나타낸다. 예를 들어, 새로운 GRPC라우트를 정의하면 클라우드 로드 밸런서나 클러스터 내 프록시 서버에 추가적인
트래픽 라우트를 구성하게 될 수 있다.

GRPC라우트를 지원하는 게이트웨이는 HTTP/1에서의 초기 업그레이드 없이 HTTP/2를 지원해야 하므로,
gRPC 트래픽이 정상적으로 전달되는 것이 보장된다.

다음은 일반적인 GRPC라우트 예시이다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 50051
```

이 예시에서는 호스트가 `svc.example.com`으로 설정된 `example-gateway` 게이트웨이의 gRPC 트래픽이 동일한
네임스페이스에 있는 포트 `50051`의 `example-svc` 서비스로 전달된다.

GRPC라우트는 다음 예시와 같이 특정 gRPC 서비스를 매칭할 수 있다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - matches:
    - method:
        service: com.example
        method: Login
    backendRefs:
    - name: foo-svc
      port: 50051
```

이 경우 GRPC라우트는 svc.example.com에 대한 모든 트래픽을 매칭하며, 해당 트래픽을 올바른 백엔드로 전달하기 위해
라우팅 규칙을 적용한다. 지정된 매치가 하나뿐이므로, svc.example.com에 대한 com.example.User.Login
메서드 요청만 전달된다.
다른 모든 메서드의 RPC는 이 라우트에 의해 매칭되지 않는다.

이 API 종류의 전체 정의에 대해서는 [GRPC라우트](https://gateway-api.sigs.k8s.io/reference/spec/#grpcroute)
레퍼런스를 참고한다.

## 요청 흐름

다음은 게이트웨이와 HTTP라우트를 사용하여 HTTP 트래픽이 서비스로 라우팅되는 간단한 예시이다.

{{< figure src="/docs/images/gateway-request-flow.svg" alt="게이트웨이와 HTTP라우트를 사용하여 HTTP 트래픽이 서비스로 라우팅되는 예시를 보여주는 다이어그램" class="diagram-medium" >}}

이 예시에서, 리버스 프록시로 구현된 게이트웨이에 대한 요청 흐름은 다음과 같다. 

1. 클라이언트는 `http://www.example.com` URL에 대한 HTTP 요청을 준비하기 시작한다. 
2. 클라이언트의 DNS 리졸버는 목적지 이름에 대해 쿼리하고 게이트웨이와 연관된 하나 이상의 IP
   주소에 대한 매핑을 얻는다. 
3. 클라이언트는 게이트웨이 IP 주소로 요청을 전송하며, 리버스 프록시는 HTTP 요청을 수신한 뒤
   호스트: 헤더를 사용하여 게이트웨이와 연결된 HTTP라우트로부터 파생된 구성과
   매칭한다. 
4. 선택적으로, 리버스 프록시는 HTTP라우트의 매칭 규칙을 기반으로 요청 헤더 및/또는 경로 매칭을
   수행할 수 있다.
5. 선택적으로, 리버스 프록시는 HTTP라우트의 필터 규칙을 기반으로 헤더를 추가하거나 제거하는 등
   요청을 수정할 수 있다.
6. 마지막으로, 리버스 프록시는 요청을 하나 이상의 백엔드로 전달한다.

## 적합성

게이트웨이 API는 광범위한 기능들을 다루며 널리 구현되어 있다. 이러한 조합은
API가 사용되는 어디에서나 일관된 경험을 제공하도록 보장하기 위해 명확한 적합성
정의와 테스트를 요구한다.

릴리스 채널, 지원 수준, 적합성 테스트 실행 방법과 같은 세부 사항을 이해하려면
[적합성](https://gateway-api.sigs.k8s.io/concepts/conformance/) 문서를 참고한다.

## 인그레스에서 마이그레이션

게이트웨이 API는 [인그레스(Ingress)](/docs/concepts/services-networking/ingress/)의 후속 API이다.
그러나, 인그레스 종류를 포함하지 않는다. 따라서 기존 인그레스 리소스를 게이트웨이 API 리소스로 한 번 변환하는
과정이 필요하다.

인그레스 리소스를 게이트웨이 API 리소스로 마이그레이션하는 방법에 대한 자세한 내용은 [인그레스 마이그레이션](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress)
가이드를 참고한다.

## {{% heading "whatsnext" %}}

게이트웨이 API 리소스는 쿠버네티스에 의해 네이티브로 구현되는 대신
[커스텀 리소스](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)로 사양이 정의되어
있으며, 다양한 [구현체](https://gateway-api.sigs.k8s.io/implementations/)에서 이를 지원한다.
게이트웨이 API CRD를 [설치](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api)하거나
선택한 구현체의 설치 지침을 따른다. 구현체를 설치한 후에는 [시작하기](https://gateway-api.sigs.k8s.io/guides/)
가이드를 참고하여 빠르게 게이트웨이 API 사용을
시작할 수 있다.

{{< note >}}
선택한 구현체의 문서를 검토하여 주의 사항이 있는지 반드시 확인한다.
{{< /note >}}

모든 게이트웨이 API 종류에 대한 추가적인 세부 정보는 [API 사양](https://gateway-api.sigs.k8s.io/reference/spec/)을
참고한다.
