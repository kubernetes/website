---
# reviewers:
# - bprashanth
title: 서비스
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: 서비스 디스커버리와 로드 밸런싱
  description: >
    쿠버네티스를 사용하면 익숙하지 않은 서비스 디스커버리 메커니즘을 사용하기 위해 애플리케이션을 수정할 필요가 없다. 쿠버네티스는 파드에게 고유한 IP 주소와 파드 집합에 대한 단일 DNS 명을 부여하고, 그것들 간에 로드 밸런스를 수행할 수 있다.
description: >-
  외부와 접하는 단일 엔드포인트 뒤에 있는 클러스터에서 실행되는 애플리케이션을 노출시키며,
  이는 워크로드가 여러 백엔드로 나뉘어 있는 경우에도 가능하다.
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="쿠버네티스에서 서비스는" >}}

쿠버네티스에서 서비스의 주된 목적은 익숙하지 않은 서비스 디스커버리 메커니즘을 사용하기
위해 기존 애플리케이션을 수정할 필요가 없도록 하는 것이다.
클라우드 네이티브 환경에 맞게 설계된 코드이든, 컨테이너화된 오래된 애플리케이션이든
파드에서 실행할 수 있다. 서비스를 사용하면 파드 집합을 네트워크에서 사용할 수 있게 되어
클라이언트가 이를 통해 상호 작용할 수 있다.

애플리케이션을 실행하기 위해 {{< glossary_tooltip term_id="deployment" >}}를 사용하는 경우, 해당
디플로이먼트는 파드를 동적으로 생성하고 제거할 수 있다. 어느 한 순간에서 다음 순간으로 넘어갈 때,
그 파드들 중 몇 개가 동작하고 정상 상태인지 알 수 없으며, 심지어 정상 상태인
파드의 이름이 무엇인지조차 알 수 없다.
쿠버네티스 {{< glossary_tooltip term_id="pod" text="파드" >}}는 클러스터의 목표 상태와 일치하도록
생성되고 삭제된다. 파드는 비영구적인 리소스이다(개별 파드가 신뢰할 수
있고 지속성이 있을 것이라 기대해서는 안 된다).

각 파드는 고유한 IP 주소를 갖는다(쿠버네티스는 네트워크 플러그인이 이를 보장할 것으로 기대한다).
클러스터의 특정 디플로이먼트에 대해, 한 시점에 실행 중인 파드 집합은 이후에
해당 애플리케이션을 실행하는 파드 집합과 다를 수 있다.

이는 다음과 같은 문제를 야기한다. ("백엔드"라 불리는) 일부 파드 집합이
클러스터의 ("프론트엔드"라 불리는) 다른 파드에 기능을 제공하는 경우,
프론트엔드가 워크로드의 백엔드를 사용하기 위해,
프론트엔드가 어떻게 연결할 IP 주소를 찾아서 추적할 수 있는가?

_서비스_ 로 들어가보자.

<!-- body -->

## 쿠버네티스에서의 서비스

쿠버네티스의 일부인 서비스 API는 파드 그룹을 네트워크를 통해 노출할 수 있도록 도와주는 
추상화이다. 각 서비스 오브젝트는 엔드포인트의 논리적
집합(일반적으로 이러한 엔드포인트는 파드이다)과, 해당 파드에 접근할 수 있도록 하는 정책을 함께 정의한다.

예를 들어, 3개의 레플리카로 실행되는 스테이트리스 이미지-처리 백엔드를
생각해보자. 이러한 레플리카는 대체 가능하다. 즉, 프론트엔드는 사용하는 백엔드를
신경쓰지 않는다. 백엔드 세트를 구성하는 실제 파드는 변경될 수 있지만,
프론트엔드 클라이언트는 이를 인식할 필요가 없으며, 백엔드 세트 자체를 추적해야 할 필요도
없다.

서비스 추상화는 이러한 디커플링을 가능하게 한다.

서비스가 대상으로 하는 파드 집합은 일반적으로 사용자가 정의하는
{{< glossary_tooltip text="셀렉터" term_id="selector" >}}에 의해
결정된다.
서비스 엔드포인트를 정의하는 다른 방법에 대해 알아보려면,
[셀렉터가 _없는_ 서비스](#셀렉터가-없는-서비스)를 참고한다.

워크로드가 HTTP를 사용한다면, 웹 트래픽이 해당 워크로드에 도달하는
방식을 제어하기 위해
[인그레스(Ingress)](/docs/concepts/services-networking/ingress/)를 사용하기로 선택할 수도 있다.
인그레스는 서비스 타입이 아니지만, 클러스터의 진입점 역할을 한다. 인그레스를
사용하면 라우팅 규칙을 단일 리소스로 통합할 수 있으므로, 클러스터 내에서 개별적으로
실행되는 워크로드의 여러 컴포넌트를 단일 리스너 뒤에서 노출할 수
있다.

쿠버네티스용 [게이트웨이](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api)
API는 인그레스와 서비스를 넘어서는 추가 기능을 제공한다. 게이트웨이는 
{{< glossary_tooltip term_id="CustomResourceDefinition" text="커스텀리소스데피니션" >}}을
사용하여 구현된 확장 API 집합으로, 클러스터에 추가한 후 이를 사용하여
클러스터에서 실행 중인 네트워크 서비스에 대한 접근을 구성할 수 있다.

### 클라우드 네이티브 서비스 디스커버리

애플리케이션에서 서비스 디스커버리를 위해 쿠버네티스 API를 사용할 수 있는 경우, 
매치되는 엔드포인트슬라이스를 
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}에 질의할 수 있다. 
쿠버네티스는 서비스의 파드가 변경될 때마다 서비스의 엔드포인트슬라이스를 업데이트한다.

네이티브 애플리케이션이 아닌 (non-native applications) 경우, 쿠버네티스는 애플리케이션과 백엔드 파드 사이에 네트워크 포트 또는 로드
밸런서를 배치할 수 있는 방법을 제공한다.

어느 쪽이든, 워크로드는 연결하려는 대상을 찾기 위해 이러한
[서비스 디스커버리](#서비스-디스커버리하기) 메커니즘을 사용할 수 있다.

## 서비스 정의

서비스는 {{< glossary_tooltip text="오브젝트" term_id="object" >}}이다(파드나 컨피그맵이 오브젝트인 것과 마찬가지로).
쿠버네티스 API를 사용하여 서비스
정의를 생성, 조회 또는 수정할 수 있다. 일반적으로는 
`kubectl`과 같은 도구를 사용하여 이러한 API 호출을 수행한다.

예를 들어, 각각 TCP 포트 9376에서 수신하고
`app.kubernetes.io/name=MyApp` 레이블을 가지고 있는 파드 세트가 있다고 가정해 보자.
해당 TCP 리스너를 노출하는 서비스를 다음과 같이 정의할 수 있다.

{{% code_sample file="service/simple-service.yaml" %}}

이 매니페스트를 적용하면 기본 ClusterIP [서비스 타입](#publishing-services-service-types)을
가진 "my-service"라는 새로운 서비스가 생성된다. 이 서비스는 `app.kubernetes.io/name: MyApp`
레이블을 가진 모든 파드의 TCP 포트 9376을 대상으로 한다.

쿠버네티스는 이 서비스에 가상 IP 주소 메커니즘에서 사용되는 IP 주소
(_클러스터 IP_)를 할당한다. 해당 메커니즘에 대한 자세한 내용은
[가상 IP 및 서비스 프록시](/docs/reference/networking/virtual-ips/)를 참고한다.

해당 서비스의 컨트롤러는 셀렉터와 일치하는 파드를 지속적으로 검색하고,
필요에 따라 해당 서비스의 엔드포인트슬라이스 집합에 대한
업데이트를 수행한다.

서비스 오브젝트의 이름은 유효한
[RFC 1123 레이블 이름](/docs/concepts/overview/working-with-objects/names#rfc-1123-label-names)이어야 한다.


{{< note >}}
서비스는 _모든_ 수신 `port`를 `targetPort`에 매핑할 수 있다. 기본적으로 그리고
편의상, `targetPort`는 `port`
필드와 같은 값으로 설정된다.
{{< /note >}}

### 포트 정의 {#field-spec-ports}

파드의 포트 정의에 이름이 있으므로, 
서비스의 `targetPort` 속성에서 이 이름을 참조할 수 있다. 
예를 들어, 다음과 같은 방법으로 서비스의 `targetPort`를 파드 포트에 바인딩할 수 있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc

---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
```

이것은 서로 다른 포트 번호를 통해 가용한 동일 네트워크 프로토콜이 있고, 
단일 구성 이름을 사용하는 서비스 내에 혼합된 파드가 존재해도 가능하다.
이를 통해 서비스를 배포하고 진전시키는 데 많은 유연성을 제공한다.
예를 들어, 클라이언트를 망가뜨리지 않고,
백엔드 소프트웨어의 다음 버전에서 파드가 노출시키는 포트 번호를 변경할 수 있다.

서비스의 기본 프로토콜은 
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp)이다. 
다른 [지원되는 프로토콜](/docs/reference/networking/service-protocols/)을 사용할 수도 있다.

많은 서비스가 하나 이상의 포트를 노출해야 하기 때문에, 쿠버네티스는 서비스 오브젝트에서
[다중 포트 정의](#멀티-포트-서비스)를 지원한다.
각 포트는 동일한 `protocol` 또는 다른 프로토콜로 정의될 수 있다.

### 셀렉터가 없는 서비스

서비스는 일반적으로 셀렉터를 이용하여 쿠버네티스 파드에 대한 접근을 추상화하지만, 
셀렉터 대신 서비스에 상응하는 
{{<glossary_tooltip term_id="endpoint-slice" text="엔드포인트슬라이스">}} 
오브젝트 집합과 함께 사용되면 다른 종류의 백엔드도 추상화할 수 있으며, 
여기에는 클러스터 외부에서 실행되는 것도 포함된다.

예시는 다음과 같다.

* 프로덕션 환경에서는 외부 데이터베이스 클러스터를 사용하려고 하지만,
  테스트 환경에서는 자체 데이터베이스를 사용한다.
* 한 서비스에서 다른
  {{< glossary_tooltip term_id="namespace" text="네임스페이스">}} 또는 다른 클러스터의 서비스를 지정하려고 한다.
* 워크로드를 쿠버네티스로 마이그레이션하고 있다. 해당 방식을 평가하는 동안,
  쿠버네티스에서는 백엔드의 일부만 실행한다.

이러한 시나리오에서는 파드 셀렉터 _없이_ 서비스를 정의할 수 있다.
예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

이 서비스에는 셀렉터가 없으므로, 상응하는 엔드포인트슬라이스 
오브젝트가 자동으로 생성되지 않는다. 
엔드포인트슬라이스 오브젝트를 수동으로 추가하여, 
서비스가 구동 중인 네트워크 주소 및 포트에 서비스를 수동으로 매핑할 수 있다. 예시는 다음과 같다.

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 관행적으로, 서비스의 이름을
                     # 엔드포인트슬라이스 이름의 접두어로 사용한다.
  labels:
    # "kubernetes.io/service-name" 레이블을 설정해야 한다.
    # 이 레이블의 값은 서비스의 이름과 일치하도록 지정한다.
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # 위에서 정의한 서비스 포트의 이름과 일치해야 한다.
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### 커스텀 엔드포인트슬라이스

서비스를 위한 [엔드포인트슬라이스](#엔드포인트슬라이스) 오브젝트를 생성할 때, 
엔드포인트슬라이스 이름으로는 원하는 어떤 이름도 사용할 수 있다. 
네임스페이스 내의 각 엔드포인트슬라이스 이름은 고유해야 한다. 
해당 엔드포인트슬라이스에 `kubernetes.io/service-name` {{< glossary_tooltip text="레이블" term_id="label" >}}을 설정하여 
엔드포인트슬라이스를 서비스와 연결할 수 있다.

{{< note >}}
엔드포인트 IP는 루프백(loopback) (IPv4의 경우 127.0.0.0/8, IPv6의 경우 ::1/128), 또는
링크-로컬 (IPv4의 경우 169.254.0.0/16와 224.0.0.0/24, IPv6의 경우 fe80::/64)이 _되어서는 안 된다_.

엔드포인트 IP 주소는 다른 쿠버네티스 서비스의 클러스터 IP일 수 없는데,
{{< glossary_tooltip term_id="kube-proxy" >}}는 가상 IP를
목적지(destination)로 지원하지 않기 때문이다.
{{< /note >}}

직접 생성했거나 직접 작성한 코드에 의해 생성된 엔드포인트슬라이스를 위해, 
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by) 
레이블에 사용할 값을 골라야 한다. 
엔드포인트슬라이스를 관리하는 컨트롤러 코드를 직접 작성하는 경우, 
`"my-domain.example/name-of-controller"`와 같은 값을 사용할 수 있다. 써드파티 도구를 사용하는 경우, 
도구의 이름에서 대문자는 모두 소문자로 바꾸고 
공백 및 다른 문장 부호는 하이픈(`-`)으로 대체한 문자열을 사용한다. 
`kubectl`과 같은 도구를 사용하여 직접 엔드포인트슬라이스를 관리하는 경우, 
`"staff"` 또는 `"cluster-admins"`와 같이 
이러한 수동 관리를 명시하는 이름을 사용한다. 
쿠버네티스 자체 컨트롤 플레인이 관리하는 엔드포인트슬라이스를 가리키는 
`"controller"`라는 예약된 값은 사용하지 말아야 한다.

#### 셀렉터가 없는 서비스에 접근하기 {#service-no-selector-access}

셀렉터가 없는 서비스에 접근하는 것은 셀렉터가 있는 서비스에 접근하는 것과 동일하게 동작한다. 
셀렉터가 없는 서비스 [예시](#셀렉터가-없는-서비스)에서, 트래픽은 
엔드포인트슬라이스 매니페스트에 정의된 두 엔드포인트 중 하나로 라우트된다.
즉, 포트 9376에서 10.1.2.3 또는 10.4.5.6으로의 TCP 연결이다.

{{< note >}}
쿠버네티스 API 서버는 파드에 매핑되지 않은 엔드포인트로의 프록시를 허용하지
않는다. 서비스에 셀렉터가 없는 경우 `kubectl port-forward service/<service-name> forwardedPort:servicePort`
와 같은 작업은 이 제약으로 인해 실패한다. 이는 호출자가 접근 권한이 없을 수도
있는 엔드포인트에 대한 프록시로 쿠버네티스 API 서버가 사용되는 것을 방지한다.
{{< /note >}}

ExternalName 서비스는 셀렉터가 없고 
대신 DNS 이름을 사용하는 특이 케이스 서비스이다. 
자세한 내용은 이 문서 뒷부분의 [ExternalName](#externalname) 섹션을 참조한다.

### 엔드포인트슬라이스

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[엔드포인트슬라이스](/docs/concepts/services-networking/endpoint-slices/)는 
특정 서비스의 하위(backing) 네트워크 엔드포인트 부분집합(_슬라이스_)을 나타내는 오브젝트이다.

쿠버네티스 클러스터는 각 엔드포인트슬라이스가 얼마나 많은 엔드포인트를 나타내는지를 추적한다. 
한 서비스의 엔드포인트가 너무 많아 역치에 도달하면, 
쿠버네티스는 빈 엔드포인트슬라이스를 생성하고 여기에 새로운 엔드포인트 정보를 저장한다. 
기본적으로, 쿠버네티스는 기존의 모든 엔드포인트슬라이스가 
엔드포인트를 최소 100개 이상 갖게 되면 새 엔드포인트슬라이스를 생성한다. 
쿠버네티스는 새 엔드포인트가 추가되어야 하는 상황이 아니라면 
새 엔드포인트슬라이스를 생성하지 않는다.

이 API에 대한 더 많은 정보는 
[엔드포인트슬라이스](/docs/concepts/services-networking/endpoint-slices/)를 참고한다.

### 엔드포인트(Endpoints) (사용 중단됨) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

엔드포인트슬라이스 API는 이전
[엔드포인트](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
API가 발전한 것이다. 사용 중단된 엔드포인트 API는 엔드포인트슬라이스와 비교했을 때
몇 가지 문제가 있다.

  - 듀얼 스택 클러스터를 지원하지 않는다.
  - [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution)과
    같은 최신 기능을 지원하는 데 필요한 정보를 포함하지 않는다.
  - 엔드포인트 목록이 너무 길어 단일 오브젝트에 담을 수 없는 경우 목록을 잘라낸다.

이러한 이유로, 모든 클라이언트는 엔드포인트 대신 엔드포인트슬라이스 API를
사용하는 것이 권장된다.

#### 용량 한계를 넘어선 엔드포인트

쿠버네티스는 단일 엔드포인트(Endpoints) 오브젝트에 포함될 수 있는 엔드포인트(endpoints)의 수를 제한한다. 
단일 서비스에 1000개 이상의 하위(backing) 엔드포인트가 있으면, 
쿠버네티스는 엔드포인트 오브젝트의 데이터를 덜어낸다(truncate). 
서비스는 하나 이상의 엔드포인트슬라이스와 연결될 수 있기 때문에, 
하위 엔드포인트 1000개 제한은 레거시 엔드포인트 API에만 적용된다.

이러한 경우, 쿠버네티스는 엔드포인트(Endpoints) 오브젝트에 저장될 수 있는 
백엔드 엔드포인트(endpoints)를 최대 1000개 선정하고, 
엔드포인트 오브젝트에 [`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity) 
{{< glossary_tooltip text="어노테이션" term_id="annotation" >}}을 설정한다. 
컨트롤 플레인은 또한 백엔드 파드 수가 1000 미만으로 내려가면 해당 어노테이션을 제거한다.

트래픽은 여전히 백엔드로 전송되지만, 레거시 엔드포인트 API에 의존하는 모든 로드 밸런싱 메커니즘은 
사용 가능한 하위(backing) 엔드포인트 중에서 최대 1000개까지에만 트래픽을 전송한다.

동일한 API 상한은 곧 하나의 엔드포인트(Endpoints) 오브젝트가 1000개 이상의 엔드포인트(endpoints)를 갖도록 수동으로 업데이트할 수는 없음을 의미한다.

### 애플리케이션 프로토콜

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

`appProtocol` 필드는 각 서비스 포트에 대한 애플리케이션 프로토콜을 지정하는 방법을 제공한다.
이는 구현체가 이해하는 프로토콜에 대해 더 풍부한 동작을
제공하도록 하는 단서로 사용된다.
이 필드의 값은 상응하는 엔드포인트와 엔드포인트슬라이스
오브젝트에 의해 미러링된다.

이 필드는 표준 쿠버네티스 레이블 구문을 따른다. 유효한 값은 다음 중 하나이다.

* [IANA 표준 서비스 이름](https://www.iana.org/assignments/service-names).

* `mycompany.com/my-custom-protocol`과 같이 구현체가 정의한 접두사가 붙은 이름.

* 쿠버네티스가 정의한 접두사가 붙은 이름.

| 프로토콜 | 설명 |
|----------|-------------|
| `kubernetes.io/h2c` | [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113)에 설명된 대로 평문(cleartext)을 통한 HTTP/2 |
| `kubernetes.io/ws`  | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)에 설명된 대로 평문을 통한 웹소켓 |
| `kubernetes.io/wss` | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)에 설명된 대로 TLS를 통한 웹소켓 |

### 멀티 포트 서비스

일부 서비스의 경우, 둘 이상의 포트를 노출해야 한다.
쿠버네티스는 서비스 오브젝트에서 멀티 포트 정의를 구성할 수 있도록 지원한다.
서비스에 멀티 포트를 사용하는 경우, 모든 포트 이름을
명확하게 지정해야 한다.
예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
쿠버네티스의 일반적인 {{< glossary_tooltip term_id="name" text="이름">}}과 마찬가지로, 포트 이름은
소문자 영숫자와 `-` 만 포함해야 한다. 포트 이름은
영숫자로 시작하고 끝나야 한다.

예를 들어, `123-abc`와 `web`은 유효하지만, `123_abc`와 `-web`은 유효하지 않다.
{{< /note >}}

## 서비스 타입  {#publishing-services-service-types}

애플리케이션의 일부(예: 프론트엔드)에 대하여, 클러스터 외부에서 접근할 수 있는
외부 IP 주소로 서비스를 노출하고
싶을 수 있다.

쿠버네티스 서비스 타입을 사용하면 원하는 서비스 종류를 지정할 수 있다.

사용 가능한 `type` 값과 그 동작은 다음과 같다.

[`ClusterIP`](#type-clusterip)
: 서비스를 클러스터 내부 IP에 노출시킨다. 이 값을 선택하면
  서비스는 클러스터 내에서만 접근할 수 있다. 이는 서비스에 대해 명시적으로
  `type`을 지정하지 않았을 때 사용되는 기본값이다.
  [인그레스](/docs/concepts/services-networking/ingress/)나
  [게이트웨이](https://gateway-api.sigs.k8s.io/)를 사용하여 서비스를 퍼블릭
  인터넷에 노출할 수 있다.

[`NodePort`](#type-nodeport)
: 각 노드의 IP에서 고정된 포트(`NodePort`)로 서비스를 노출시킨다.
  NodePort를 사용할 수 있게 하기 위해, 쿠버네티스는 `type: ClusterIP` 서비스를
  요청했을 때와 마찬가지로 클러스터 IP 주소를 구성한다.

[`LoadBalancer`](#loadbalancer)
: 외부 로드 밸런서를 사용하여 서비스를 외부에 노출시킨다. 쿠버네티스는
  로드 밸런싱 컴포넌트를 직접 제공하지 않으므로, 사용자가 직접 제공하거나
  쿠버네티스 클러스터를 클라우드 공급자와 통합해야 한다.

[`ExternalName`](#externalname)
: 서비스를 `externalName` 필드의 내용(예: 호스트 이름 `api.foo.bar.example`)에
  매핑한다. 이 매핑은 클러스터의 DNS 서버가 해당 외부 호스트 이름 값을 가진
  `CNAME` 레코드를 반환하도록 구성한다.
  어떠한 종류의 프록시도 설정되지 않는다.

서비스 API의 `type` 필드는 중첩된 기능으로 설계되어, 각 단계가 이전 단계에
추가되는 형태이다. 그러나 이러한 중첩 설계에는 예외가 있다.
[로드 밸런서의 `NodePort` 할당을 비활성화](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation)
하여 `LoadBalancer` 서비스를 정의할 수 있다.

### `type: ClusterIP` {#type-clusterip}

이 기본 서비스 타입은 클러스터가 해당 목적을 위해 예약한 IP 주소 풀에서
IP 주소를 할당한다.

서비스의 다른 몇몇 타입은 `ClusterIP` 타입을 기반으로
만들어진다.

`.spec.clusterIP`가 `"None"`으로 설정된 서비스를 정의하면 쿠버네티스는
IP 주소를 할당하지 않는다. 자세한 내용은
[헤드리스 서비스](#헤드리스-서비스)를 참고한다.

#### 자신의 IP 주소 선택

`서비스` 생성 요청시 고유한 클러스터 IP 주소를 지정할 수
있다. 이를 위해, `.spec.clusterIP` 필드를 설정한다. 예를 들어,
재사용하려는 기존 DNS 항목이 있거나, 특정 IP 주소로 구성되어
재구성이 어려운 레거시 시스템인 경우이다.

선택하는 IP 주소는 API 서버에 대해 구성된 `service-cluster-ip-range` CIDR
범위 내의 유효한 IPv4 또는 IPv6 주소여야 한다.
유효하지 않은 `clusterIP` 주소 값으로 서비스를 생성하려고 하면, API 서버는
문제가 있음을 나타내는 422 HTTP 상태 코드를 반환한다.

서로 다른 두 서비스가 동일한 IP 주소를 사용하려고 할 때, 쿠버네티스가 그
위험과 영향을 줄이는 데 어떻게 도움이 되는지 알아보려면
[충돌 방지하기](/docs/reference/networking/virtual-ips/#충돌-방지하기)를 참고한다.

### `type: NodePort` {#type-nodeport}

`type` 필드를 `NodePort`로 설정하면, 쿠버네티스 컨트롤 플레인은
`--service-node-port-range` 플래그로 지정된 범위에서 포트를 할당한다 (기본값: 30000-32767).
각 노드는 해당 포트(모든 노드에서 동일한 포트 번호)를 서비스로 프록시한다.
서비스는 할당된 포트를 `.spec.ports[*].nodePort` 필드에 나타낸다.

NodePort를 사용하면 자유롭게 자체 로드 밸런싱 솔루션을 설정하거나,
쿠버네티스가 완벽하게 지원하지 않는 환경을 구성하거나,
하나 이상의 노드 IP를 직접 노출시킬 수 있다.

NodePort 서비스에 대해, 쿠버네티스는 포트를 추가로 
할당한다(서비스의 프로토콜에 매치되도록 TCP, UDP, SCTP 중 하나). 
클러스터의 모든 노드는 할당된 해당 포트를 리슨하고 
해당 서비스에 연결된 활성(ready) 엔드포인트 중 하나로 트래픽을 전달하도록 자기 자신을 구성한다. 
적절한 프로토콜(예: TCP) 및 적절한 포트(해당 서비스에 할당된 대로)로 
클러스터 외부에서 클러스터의 아무 노드에 연결하여 `type: NodePort` 서비스로 접근할 수 있다.

#### 포트 직접 선택하기 {#nodeport-custom-port}

특정 포트 번호를 원한다면, `nodePort` 필드에 값을 명시할 수 있다. 
컨트롤 플레인은 해당 포트를 할당해 주거나, 
해당 API 트랜잭션이 실패했다고 알려줄 것이다. 
이는 사용자 스스로 포트 충돌의 가능성을 고려해야 한다는 의미이다.
또한 유효한(NodePort용으로 사용할 수 있도록 구성된 범위 내의) 
포트 번호를 사용해야 한다.

다음은 NodePort 값을 명시하는(이 예시에서는 30007) 
`type: NodePort` 서비스에 대한 예시 매니페스트이다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # 기본적으로 그리고 편의상, `targetPort`는
      # `port` 필드와 동일한 값으로 설정된다.
      targetPort: 80
      # 선택적 필드
      # 기본적으로 그리고 편의상, 쿠버네티스 컨트롤 플레인은
      # 범위(기본값: 30000-32767)에서 포트를 할당한다
      nodePort: 30007
```

#### 충돌을 피하기 위해 NodePort 범위 예약하기  {#avoid-nodeport-collisions}

NodePort 서비스에 포트를 할당하는 정책은 자동 할당과 수동 할당 시나리오
모두에 적용된다. 사용자가 특정 포트를 사용하는 NodePort 서비스를 생성하려는
경우, 대상 포트가 이미 할당된 다른 포트와 충돌할 수 있다.

이 문제를 피하기 위해, NodePort 서비스를 위한 포트 범위는 두 개의 대역으로 나뉜다.
동적 포트 할당은 기본적으로 상위 대역을 사용하며, 상위 대역이 소진되면
하위 대역을 사용할 수도 있다. 이후 사용자는 포트 충돌 위험이 더 낮은 하위 대역에서 할당받을 수 있다.

기본 NodePort 범위인 30000-32767을 사용하는 경우, 대역은 다음과 같이 나뉜다.

- 정적 대역: 30000-30085
- 동적 대역: 30086-32767

정적 및 동적 대역이 어떻게 계산되는지에 대한 자세한 내용은
[NodePort 서비스에 포트 할당 시 충돌 방지하기](/blog/2023/05/11/nodeport-dynamic-and-static-allocation/)를 참고한다.

#### `type: NodePort` 서비스를 위한 커스텀 IP 주소 구성 {#service-nodeport-custom-listen-address}

NodePort 서비스 노출에 특정 IP 주소를 사용하도록 
클러스터의 노드를 설정할 수 있다. 
각 노드가 여러 네트워크(예: 애플리케이션 트래픽용 네트워크 및 
노드/컨트롤 플레인 간 트래픽용 네트워크)에 연결되어 있는 경우에 이러한 구성을 고려할 수 있다.

포트를 프록시하기 위해 특정 IP를 지정하려면, kube-proxy에 대한
`--nodeport-addresses` 플래그 또는
[kube-proxy 구성 파일](/docs/reference/config-api/kube-proxy-config.v1alpha1/)의
동등한 `nodePortAddresses` 필드를 특정 IP 블록으로 설정할 수 있다.

이 플래그는 쉼표로 구분된 IP 블록 목록(예: `10.0.0.0/8`, `192.0.2.0/25`)을 사용하여
kube-proxy가 로컬 노드로 고려해야 하는 IP 주소 범위를 지정한다.

예를 들어, `--nodeport-addresses=127.0.0.0/8` 플래그로 kube-proxy를 시작하면,
kube-proxy는 NodePort 서비스에 대하여 루프백(loopback) 인터페이스만 선택한다.
`--nodeport-addresses`의 기본 값은 비어있는 목록이다.
이것은 kube-proxy가 NodePort에 대해 사용 가능한 모든 네트워크 인터페이스를 고려해야 한다는 것을 의미한다.
(이는 이전 쿠버네티스 릴리스와도 호환된다).
{{< note >}}
이 서비스는 `<NodeIP>:spec.ports[*].nodePort`와 `.spec.clusterIP:spec.ports[*].port`로 표기된다.
kube-proxy에 대한 `--nodeport-addresses` 플래그 또는 
kube-proxy 구성 파일의 동등한 필드가 설정된 경우, 
`<NodeIP>`는 노드 IP(또는 여러 IP 주소일 수도 있음)를 필터링한다.
{{< /note >}}

### `type: LoadBalancer` {#loadbalancer}

외부 로드 밸런서를 지원하는 클라우드 공급자 상에서, `type`
필드를 `LoadBalancer`로 설정하면 서비스에 대한 로드 밸런서를 프로비저닝한다.
로드 밸런서의 실제 생성은 비동기적으로 수행되고,
프로비저닝된 밸런서에 대한 정보는 서비스의
`.status.loadBalancer` 필드에 발행된다.
예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

외부 로드 밸런서의 트래픽은 백엔드 파드로 전달된다.
클라우드 공급자는 로드 밸런싱 방식을 결정한다.

`type: LoadBalancer` 서비스를 구현하기 위해, 쿠버네티스는 일반적으로
`type: NodePort` 서비스를 요청한 것과 동등한 변경을 적용하는 것으로
시작한다. 이후 cloud-controller-manager 컴포넌트가 할당된 노드 포트로
트래픽을 전달하도록 외부 로드 밸런서를 구성한다.

클라우드 공급자 구현이 이를 지원하는 경우, 로드 밸런싱된 서비스가 노드
포트 할당을
[생략](#load-balancer-nodeport-allocation)하도록 구성할 수 있다.

일부 클라우드 공급자는 `loadBalancerIP`를 지정할 수 있도록 허용한다. 이 경우, 로드 밸런서는
사용자 지정 `loadBalancerIP`로 생성된다. `loadBalancerIP` 필드가 지정되지 않으면,
임시 IP 주소로 로드 밸런서가 설정된다. `loadBalancerIP`를 지정했지만
클라우드 공급자가 이 기능을 지원하지 않는 경우, 설정한 `loadbalancerIP` 필드는
무시된다.


{{< note >}}
서비스의 `.spec.loadBalancerIP` 필드는 쿠버네티스 v1.24에서 사용 중단되었다.

이 필드는 명세가 불충분했으며 구현체마다 그 의미가 다르다.
또한 듀얼 스택 네트워킹을 지원할 수 없다. 이 필드는 향후 API 버전에서 제거될 수 있다.

(공급자별) 어노테이션을 통해 서비스의 로드 밸런서 IP 주소를 지정하는 것을
지원하는 공급자와 통합하는 경우, 그 방식으로 전환해야 한다.

쿠버네티스와의 로드 밸런서 통합을 위한 코드를 작성하는 경우, 이 필드 사용을 피한다.
서비스 대신 [게이트웨이](https://gateway-api.sigs.k8s.io/)와 통합하거나, 동등한 세부
정보를 지정하는 (공급자별) 자체 어노테이션을 서비스에 정의할 수 있다.
{{< /note >}}

#### 로드 밸런서 트래픽에 대한 노드 활성 상태(liveness)의 영향

로드 밸런서 헬스 체크는 최신 애플리케이션에 매우 중요하다. 이는 로드
밸런서가 트래픽을 전달할 서버(가상 머신 또는 IP 주소)를 결정하는 데
사용된다. 쿠버네티스 API는 쿠버네티스가 관리하는 로드 밸런서에 대해
헬스 체크가 어떻게 구현되어야 하는지 정의하지 않으며, 대신 클라우드
공급자(및 통합 코드를 구현하는 사람들)가 그 동작을 결정한다. 로드 밸런서
헬스 체크는 서비스의 `externalTrafficPolicy` 필드를 지원하는 맥락에서
광범위하게 사용된다.

#### 프로토콜 타입이 혼합된 로드 밸런서

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

기본적으로, LoadBalancer 타입의 서비스에서 둘 이상의 포트가 정의된 경우, 모든 
포트는 동일한 프로토콜을 가져야 하며 프로토콜은 클라우드 공급자가
지원하는 프로토콜이어야 한다.

`MixedProtocolLBService` 기능 게이트(v1.24에서 kube-apiserver에 대해 기본적으로 활성화되어 있음)는 
둘 이상의 포트가 정의되어 있는 경우에 로드 밸런서 타입의 서비스에 대해 서로 다른 프로토콜을 사용할 수 있도록 해 준다.

{{< note >}}
로드 밸런싱되는 서비스에 사용할 수 있는 프로토콜 집합은 클라우드 공급자가 정의한다.
클라우드 공급자는 쿠버네티스 API가 강제하는 것 이상의 제약을 둘 수 있다.
{{< /note >}}

#### 로드 밸런서 NodePort 할당 비활성화 {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`spec.allocateLoadBalancerNodePorts` 필드를 `false`로 설정하여, `type: LoadBalancer`
서비스에 대한 노드 포트 할당을 선택적으로 비활성화할 수 있다. 이는 
노드 포트를 사용하지 않고 트래픽을 파드로 직접 라우팅하는 로드 밸런서 구현에만 사용해야 한다.
기본적으로 `spec.allocateLoadBalancerNodePorts`는 `true`이며 LoadBalancer 타입의 서비스는 계속해서 노드 포트를 할당할 것이다.
노드 포트가 할당된 기존 서비스에서 `spec.allocateLoadBalancerNodePorts`가 `false`로 설정된 경우 해당 노드 포트는 자동으로 할당 해제되지 **않는다**.
이러한 노드 포트를 할당 해제하려면 모든 서비스 포트에서 `nodePorts` 항목을 명시적으로 제거해야 한다.

#### 로드 밸런서 구현 클래스 지정 {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`type`이 `LoadBalancer`로 설정된 서비스의 경우, `.spec.loadBalancerClass` 필드를
사용하여 클라우드 공급자의 기본값이 아닌 다른 로드 밸런서 구현을 사용할 수 있다.

기본적으로 `.spec.loadBalancerClass`는 설정되어 있지 않으며, 클러스터가
`--cloud-provider` 컴포넌트 플래그를 사용하는 클라우드 공급자로 구성된 경우
`LoadBalancer` 타입의 서비스는 클라우드 공급자의 기본 로드 밸런서 구현을 사용한다.

`.spec.loadBalancerClass`를 지정하면, 지정된 클래스와 일치하는 로드 밸런서
구현이 서비스를 감시하고 있다고 가정한다.
모든 기본 로드 밸런서 구현(예: 클라우드 공급자가 제공하는
로드 밸런서 구현)은 이 필드가 설정된 서비스를 무시한다.
`spec.loadBalancerClass`는 `LoadBalancer` 타입의 서비스에서만 설정할 수 있다.
한 번 설정하면 변경할 수 없다.
`spec.loadBalancerClass`의 값은 "`internal-vip`" 또는
"`example.com/internal-vip`" 와 같은 선택적 접두사가 있는 레이블 스타일 
식별자여야 한다.
접두사가 없는 이름은 최종 사용자를 위해 예약되어 있다.

#### 로드 밸런서 IP 주소 모드 {#load-balancer-ip-mode}

`type: LoadBalancer` 서비스의 경우, 컨트롤러는 `.status.loadBalancer.ingress.ipMode`를 설정할 수 있다.
`.status.loadBalancer.ingress.ipMode`는 로드 밸런서 IP의 동작 방식을 지정한다. 
이는 `.status.loadBalancer.ingress.ip` 필드도 함께 지정된 경우에만 지정할 수 있다.

`.status.loadBalancer.ingress.ipMode`에는 "VIP"와 "Proxy" 두 가지 값이 있을 수 있다.
기본값은 "VIP"이며, 이는 목적지가 로드 밸런서의 IP와 포트로 설정된 채로
트래픽이 노드에 전달된다는 것을 의미한다.
클라우드 공급자의 로드 밸런서가 트래픽을 전달하는 방식에 따라,
이를 "Proxy"로 설정하는 경우는 두 가지가 있다.

- 트래픽이 노드로 전달된 다음 파드로 DNAT되는 경우, 목적지는 노드의 IP와 노드 포트로 설정된다.
- 트래픽이 파드로 직접 전달되는 경우, 목적지는 파드의 IP와 포트로 설정된다.

서비스 구현은 이 정보를 사용하여 트래픽 라우팅을 조정할 수 있다.

#### 내부 로드 밸런서

혼재된 환경에서는 서비스의 트래픽을 동일한 (가상) 네트워크 주소 블록 내로
라우팅해야 하는 경우가 있다.

수평 분할 DNS 환경에서는 외부와 내부 트래픽을 엔드포인트로 라우팅할 수 있는
두 개의 서비스가 필요하다.

내부 로드 밸런서를 설정하려면, 사용 중인 클라우드 서비스 공급자에 따라
다음의 어노테이션 중 하나를 서비스에 추가한다.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
탭 중 하나를 선택한다.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

ExternalName 타입의 서비스는 `my-service`나 `cassandra`와 같은 일반적인 셀렉터가 아니라,
서비스를 DNS 이름에 매핑한다. 이러한 서비스는 `spec.externalName` 파라미터로 지정한다.

예를 들어, 다음 서비스 정의는 `prod` 네임스페이스의
`my-service` 서비스를 `my.database.example.com`에 매핑한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
`type: ExternalName`인 서비스는 IPv4 주소 문자열을 받아들이지만,
이 문자열을 IP 주소가 아니라 숫자로 구성된 DNS 이름으로 처리한다
(그러나 인터넷은 DNS에서 이러한 이름을 허용하지 않는다). 
IPv4 주소와 유사한 외부 이름을 가진 서비스는 
DNS 서버에 의해 확인되지 않는다.

서비스를 특정 IP 주소에 직접 매핑하려면, [헤드리스 서비스](#헤드리스-서비스)
사용을 고려한다.
{{< /note >}}

`my-service.prod.svc.cluster.local` 호스트를 조회하면, 클러스터 DNS 서비스는
`my.database.example.com` 값을 가진 `CNAME` 레코드를 반환한다. `my-service`에
접근하는 것은 다른 서비스와 같은 방식으로 동작하지만, 리다이렉션이 프록시나
포워딩이 아니라 DNS 수준에서 발생한다는 중요한 차이가 있다. 나중에
데이터베이스를 클러스터로 옮기기로 결정한 경우, 해당 파드를 구동하고
적절한 셀렉터나 엔드포인트를 추가한 다음, 
서비스의 `type`을 변경할 수 있다.

{{< caution >}}
HTTP와 HTTPS를 포함한 일부 일반적인 프로토콜에는 ExternalName을 사용하는 데 어려움이 있을 수 있다. 
ExternalName을 사용하면 클러스터 내부의 클라이언트가
사용하는 호스트 이름이 ExternalName이 참조하는 이름과 달라진다.

호스트 이름을 사용하는 프로토콜의 경우, 이러한 차이로 인해 오류가 발생하거나 예기치 않은 응답이 발생할 수 있다. 
HTTP 요청에는 원본 서버가 인식하지 못하는 `Host:` 헤더가 포함되며, 
TLS 서버는 클라이언트가 연결한 호스트 이름과 일치하는 인증서를 제공할 수 없다.
{{< /caution >}}

## 헤드리스 서비스

때로는 로드 밸런싱과 단일 서비스 IP가 필요하지 않은 경우가 있다. 이 경우,
클러스터 IP 주소(`.spec.clusterIP`)에 명시적으로 `"None"`을 지정하여
_헤드리스 서비스_ 라고 하는 것을 만들 수 있다.

헤드리스 서비스를 사용하면 쿠버네티스의 구현 방식에 얽매이지 않고 다른 
서비스 디스커버리 메커니즘과 상호작용할 수 있다.

헤드리스 서비스의 경우 클러스터 IP가 할당되지 않고, kube-proxy가 이러한
서비스를 처리하지 않으며, 플랫폼이 이들에 대해 로드 밸런싱이나 프록시를 수행하지 않는다.

헤드리스 서비스를 사용하면 클라이언트가 원하는 파드에 직접 연결할 수 있다.
헤드리스 서비스는 [가상 IP 주소와 프록시](/docs/reference/networking/virtual-ips/)를
사용하여 경로와 패킷 포워딩을 구성하지 않는다. 대신 헤드리스 서비스는
클러스터의 [DNS 서비스](/docs/concepts/services-networking/dns-pod-service/)를
통해 제공되는 내부 DNS 레코드를 통해 개별 파드의 엔드포인트 IP 주소를 보고한다.
헤드리스 서비스를 정의하려면, `.spec.type`을 (`type`의 기본값인) ClusterIP로 설정한 서비스를 만들고, 
추가로 `.spec.clusterIP`를 None으로 설정한다.

문자열 값 None은 특별한 경우이며, `.spec.clusterIP` 필드를 설정하지 않고 남겨두는 것과는 다르다.

DNS가 자동으로 구성되는 방식은 서비스에 셀렉터가 정의되어 있는지 여부에 따라 달라진다.

### 셀렉터가 있는 경우

셀렉터를 정의하는 헤드리스 서비스의 경우, 엔드포인트 컨트롤러는 쿠버네티스
API에 엔드포인트슬라이스를 생성하고, 서비스의 기반이 되는 파드를 직접
가리키는 A 또는 AAAA 레코드(IPv4 또는 IPv6 주소)를 반환하도록 DNS 구성을 수정한다.

### 셀렉터가 없는 경우

셀렉터를 정의하지 않는 헤드리스 서비스의 경우, 컨트롤 플레인은 엔드포인트슬라이스
오브젝트를 생성하지 않는다. 하지만 DNS 시스템은 다음 중 하나를 찾아서 
구성한다.

* [`type: ExternalName`](#externalname) 서비스에 대한 DNS CNAME 레코드.
* `ExternalName`을 제외한 모든 서비스 타입에 대해, 서비스의 준비된 
  엔드포인트의 모든 IP 주소에 대한 DNS A / AAAA 레코드.
  * IPv4 엔드포인트의 경우, DNS 시스템은 A 레코드를 생성한다.
  * IPv6 엔드포인트의 경우, DNS 시스템은 AAAA 레코드를 생성한다.

셀렉터가 없는 헤드리스 서비스를 정의하는 경우, `port`는 `targetPort`와
일치해야 한다.

## 서비스 디스커버리하기

클러스터 내부에서 실행되는 클라이언트의 경우, 쿠버네티스는 서비스를 찾는
두 가지 주요 방식을 지원한다. 바로 환경 변수와 DNS이다.

### 환경 변수

파드가 노드에서 실행되면, kubelet은 활성화된 각 서비스에 대한 환경 변수
집합을 추가한다. `{SVCNAME}_SERVICE_HOST`와 `{SVCNAME}_SERVICE_PORT` 변수를
추가하는데, 이때 서비스 이름은 대문자로 바뀌고 하이픈은 언더스코어로 변환된다.


예를 들어, TCP 포트 6379를 노출하고 클러스터 IP 주소 10.0.0.11이 할당된
서비스 `redis-primary`는 다음과 같은 
환경 변수를 생성한다.

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
서비스에 접근해야 하는 파드가 있고, 환경 변수 방식을 사용하여 포트와
클러스터 IP를 클라이언트 파드에 노출하는 경우, 클라이언트 파드가 존재하기
*전에* 서비스를 생성해야 한다. 그렇지 않으면 해당 클라이언트 파드는 환경
변수가 채워지지 않는다.

서비스의 클러스터 IP를 찾는 데 DNS만 사용한다면, 이러한 순서 문제를
걱정할 필요가 없다.
{{< /note >}}

쿠버네티스는 또한 도커 엔진의 "_[레거시 컨테이너 링크](https://docs.docker.com/network/links/)_"
기능과 호환되는 변수도 지원하고 제공한다.
쿠버네티스에서 이것이 어떻게 구현되어 있는지 확인하려면
[`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)를 참고한다.

### DNS

[애드온](/docs/concepts/cluster-administration/addons/)을 사용하여 쿠버네티스
클러스터에 DNS 서비스를 설정할 수 있다(거의 항상 그렇게 해야 한다).

CoreDNS와 같은 클러스터를 인식하는 DNS 서버는 새로운 서비스가 있는지
쿠버네티스 API를 감시하고, 각각에 대해 DNS 레코드 집합을 생성한다. 클러스터
전체에서 DNS가 활성화되어 있다면, 모든 파드는 자동으로 서비스를 해당 DNS
이름으로 확인할 수 있어야 한다.

예를 들어, 쿠버네티스 네임스페이스 `my-ns`에 `my-service`라는 서비스가
있다면, 컨트롤 플레인과 DNS 서비스가 함께 작동하여 `my-service.my-ns`에
대한 DNS 레코드를 생성한다. `my-ns` 네임스페이스의 파드는 `my-service`에
대한 이름 조회를 수행하여 해당 서비스를 찾을 수 있어야 한다
(`my-service.my-ns`도 마찬가지로 동작한다).

다른 네임스페이스의 파드는 이름을 `my-service.my-ns`로 한정해야 한다.
이러한 이름은 서비스에 할당된 클러스터 IP로 확인된다.

쿠버네티스는 또한 이름이 지정된 포트에 대해 DNS SRV(서비스) 레코드도
지원한다. `my-service.my-ns` 서비스에 프로토콜이 `TCP`로 설정된 `http`라는
이름의 포트가 있다면, `_http._tcp.my-service.my-ns`에 대한 DNS SRV 쿼리를
수행하여 IP 주소는 물론 `http`의 포트 번호도 발견할 수 있다.

쿠버네티스 DNS 서버는 `ExternalName` 서비스에 접근할 수 있는 유일한 방법이다.
`ExternalName` 확인에 대한 자세한 내용은
[서비스 및 파드용 DNS](/docs/concepts/services-networking/dns-pod-service/)에서 찾을 수 있다.

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## 가상 IP 주소 지정 메커니즘

[가상 IP 및 서비스 프록시](/docs/reference/networking/virtual-ips/)에서는 쿠버네티스가
가상 IP 주소를 사용하여 서비스를 노출하기 위해 제공하는 메커니즘을 설명한다.

### 트래픽 폴리시

`.spec.internalTrafficPolicy` 및 `.spec.externalTrafficPolicy` 필드를 설정하여,
쿠버네티스가 정상("준비된") 백엔드로 트래픽을 라우팅하는 방식을 제어할 수 있다.

자세한 내용은 [트래픽 폴리시](/docs/reference/networking/virtual-ips/#트래픽-폴리시)를 참고한다.

### 트래픽 분배 제어 {#traffic-distribution}

`.spec.trafficDistribution` 필드는 쿠버네티스 서비스 내에서 트래픽 라우팅에
영향을 미치는 또 다른 방법을 제공한다. 트래픽 정책이 엄격한 의미론적 보장에
초점을 맞추는 반면, 트래픽 분배는 (토폴로지상 더 가까운 엔드포인트로
라우팅하는 것과 같은) _선호(preference)_ 를 표현할 수 있게 해 준다. 이는
성능, 비용 또는 안정성을 최적화하는 데 도움이 될 수 있다. 쿠버네티스
{{< skew currentVersion >}}에서는 다음 값을 지원한다.

`PreferSameZone`
: 클라이언트와 동일한 영역에 있는 엔드포인트로 트래픽을 라우팅하는
  것을 선호함을 나타낸다.

`PreferSameNode`
: 클라이언트와 동일한 노드에 있는 엔드포인트로 트래픽을 라우팅하는
  것을 선호함을 나타낸다.

`PreferClose` (사용 중단됨)
: `PreferSameZone`의 이전 별칭으로, 
의미가 덜 명확하다.

이 필드가 설정되어 있지 않으면, 구현체는 기본 라우팅 전략을 적용한다.

자세한 내용은
[트래픽 분배](/docs/reference/networking/virtual-ips/#traffic-distribution)를
참고한다.

### 세션 스티킹(stickiness)

특정 클라이언트로부터의 연결이 매번 동일한 파드로 전달되도록 하고 싶다면, 
클라이언트의 IP 주소 기반으로 세션 어피니티를 구성할 수 있다. 
더 자세한 정보는 [세션 어피니티](/docs/reference/networking/virtual-ips/#세션-어피니티)를 
참고한다.

## 외부 IP

{{< feature-state for_k8s_version="v1.36" state="deprecated" >}}

모든 사용자는 `externalIPs`에서 벗어나 마이그레이션을 시작해야 한다.
대신 외부 로드 밸런서 컨트롤러나 
게이트웨이 API 구현을 사용하는 것을 고려한다.

하나 이상의 클러스터 노드로 라우팅되는 외부 IP가 있는 경우, 쿠버네티스 서비스는 이러한
`externalIPs`에 노출될 수 있다. 외부 IP(목적지 IP)와 해당 서비스에
일치하는 포트를 가진 네트워크 트래픽이 클러스터로 들어오면, 쿠버네티스가
구성한 규칙과 경로에 따라 해당 트래픽이 그 서비스의 엔드포인트 중 하나로
라우팅된다.

서비스를 정의할 때, 모든 [서비스 타입](#publishing-services-service-types)에
대해 `externalIPs`를 지정할 수 있다.
아래 예시에서, `"my-service"`라는 서비스는 클라이언트가 TCP를 사용하여
`"198.51.100.32:80"`(`.spec.externalIPs[]`와 `.spec.ports[].port`로부터 계산됨)으로 접근할 수 있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
쿠버네티스는 `externalIPs`의 할당을 관리하지 않으며, 이는 클러스터 관리자의
책임이다.
{{< /note >}}

## API 오브젝트

서비스는 쿠버네티스 REST API의 최상위 리소스이다. [서비스 API 오브젝트](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)에 대한
자세한 내용을 참고할 수 있다.

## {{% heading "whatsnext" %}}

서비스와 그것이 쿠버네티스에 어떻게 부합하는지 자세히 알아본다.

* [서비스와 애플리케이션 연결하기](/docs/tutorials/services/connect-applications-service/)
  튜토리얼을 따라해 본다.
* 클러스터 외부에서 클러스터 내의 서비스로 HTTP 및 HTTPS 경로를 노출시키는
  [인그레스](/docs/concepts/services-networking/ingress/)에 대해 
  읽어본다.
* 인그레스보다 더 많은 유연성을 제공하는 쿠버네티스의 익스텐션인
  [게이트웨이](/docs/concepts/services-networking/gateway/)에 대해 읽어본다.

더 많은 맥락을 위해 다음을 읽어본다.

* [가상 IP 및 서비스 프록시](/docs/reference/networking/virtual-ips/)
* [엔드포인트슬라이스](/docs/concepts/services-networking/endpoint-slices/)
* [서비스 API 레퍼런스](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [엔드포인트슬라이스 API 레퍼런스](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [엔드포인트 API 레퍼런스 (레거시)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
