---
# reviewers:
# - bprashanth
title: 인그레스(Ingress)
content_type: concept
description: >-
  URI, 호스트네임, 경로 등과 같은 웹 개념을 이해하는 프로토콜-인지형(protocol-aware configuration) 설정 메커니즘을 이용하여
  HTTP (혹은 HTTPS) 네트워크 서비스를 사용 가능하게 한다.
  인그레스 개념은 쿠버네티스 API를 통해 정의한 규칙에 기반하여 트래픽을 다른 백엔드에
  매핑할 수 있게 해준다.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}


<!-- body -->

## 용어

이 가이드는 용어의 명확성을 위해 다음과 같이 정의한다.

* 노드(Node): 클러스터의 일부이며, 쿠버네티스에 속한 워커 머신.
* 클러스터(Cluster): 쿠버네티스에서 관리되는 컨테이너화 된 애플리케이션을 실행하는 노드 집합. 이 예시와 대부분의 일반적인 쿠버네티스 배포에서 클러스터에 속한 노드는 퍼블릭 인터넷의 일부가 아니다.
* 에지 라우터(Edge router): 클러스터에 방화벽 정책을 적용하는 라우터. 이것은 클라우드 공급자 또는 물리적 하드웨어의 일부에서 관리하는 게이트웨이일 수 있다.
* 클러스터 네트워크(Cluster network): 쿠버네티스 [네트워킹 모델](/ko/docs/concepts/cluster-administration/networking/)에 따라 클러스터 내부에서 통신을 용이하게 하는 논리적 또는 물리적 링크 집합.
* 서비스: {{< glossary_tooltip text="레이블" term_id="label" >}} 셀렉터를 사용해서 파드 집합을 식별하는 쿠버네티스 {{< glossary_tooltip text="서비스" term_id="service" >}}. 달리 언급하지 않으면 서비스는 클러스터 네트워크 내에서만 라우팅 가능한 가상 IP를 가지고 있다고 가정한다.

## 인그레스란?

[인그레스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)는 클러스터 외부에서 클러스터 내부
{{< link text="서비스" url="/ko/docs/concepts/services-networking/service/" >}}로 HTTP와 HTTPS 경로를 노출한다.
트래픽 라우팅은 인그레스 리소스에 정의된 규칙에 의해 컨트롤된다.

다음은 인그레스가 모든 트래픽을 하나의 서비스로 보내는 간단한 예시이다.

{{< figure src="/ko/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="그림. 인그레스" link="https://mermaid.live/edit#pako:eNqNksFK7DAUhl8lZDYKrYzjVSQjs9KdK11OZ5E2p06w05Yk1XtR4QojiM5OuHBlBhUENy5mIVjBJzLtO5ja6kxx4yY55PznO39OcoS9iAEmeE_QuI-2d9pOiJAXcAjVQjc_fdKT12zylP1L84u0t2gvoWySvj2n-vY8u7i39cO9vjzPHv7qqzHacEUH6btxEetpqm-m2XCMluwOD_cESNmdL-19NKoytt05LhpdT_PRGXp7Hmcv_48liAPuQddA9Mvwq0Qmbum1MHfzaM7z4XSOVYrKWsONI7bczUcjY6r3PdWqpSBk5e2plJvgozigPEQ-DwLSYIxZUoloH0jD9_0qtg85U33yK_5teVEQCdJoNpvtGmR_XVaIldaaB6s_ophcneIFiVQgKtKslDRc161jWjNM2XFG-pyRVQ3BKqZTLK3C5pyu_ADlAGrHpYtqb2MLD0AMKGfmBx0VOgerPgzAwcSEDHyaBMrBTnhipEnMqIItxlUkMPFpIMHCNFHR7p_Qw0SJBD5Fm5yaRx5UqpN3zjkTIA" >}}

인그레스는 외부에서 서비스로 접속이 가능한 URL, 로드 밸런스 트래픽, SSL / TLS 종료 그리고 이름-기반의 가상 호스팅을 제공하도록 구성할 수 있다. [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers)는 일반적으로 로드 밸런서를 사용해서 인그레스를 수행할 책임이 있으며, 트래픽을 처리하는데 도움이 되도록 에지 라우터 또는 추가 프런트 엔드를 구성할 수도 있다.

인그레스는 임의의 포트 또는 프로토콜을 노출시키지 않는다. HTTP와 HTTPS 이외의 서비스를 인터넷에 노출하려면 보통
[Service.Type=NodePort](/ko/docs/concepts/services-networking/service/#type-nodeport) 또는
[Service.Type=LoadBalancer](/ko/docs/concepts/services-networking/service/#loadbalancer) 유형의 서비스를 사용한다.

## 전제 조건들

[인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers)가 있어야 인그레스를 충족할 수 있다. 인그레스 리소스만 생성한다면 효과가 없다.

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)와 같은 인그레스 컨트롤러를 배포해야 할 수도 있다. 여러
[인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers) 중에서 선택할 수도 있다.

이상적으로, 모든 인그레스 컨트롤러는 참조 사양이 맞아야 한다. 실제로, 다양한 인그레스
컨트롤러는 조금 다르게 작동한다.

{{< note >}}
인그레스 컨트롤러의 설명서를 검토하여 선택 시 주의 사항을 이해해야 한다.
{{< /note >}}

## 인그레스 리소스

최소한의 인그레스 리소스 예제:

{{< codenew file="service/networking/minimal-ingress.yaml" >}}

인그레스에는 `apiVersion`, `kind`, `metadata` 및 `spec` 필드가 명시되어야 한다.
인그레스 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.
설정 파일의 작성에 대한 일반적인 내용은 [애플리케이션 배포하기](/ko/docs/tasks/run-application/run-stateless-application-deployment/), [컨테이너 구성하기](/docs/tasks/configure-pod-container/configure-pod-configmap/), [리소스 관리하기](/ko/docs/concepts/cluster-administration/manage-deployment/)를 참조한다.
 인그레스는 종종 어노테이션을 이용해서 인그레스 컨트롤러에 따라 몇 가지 옵션을 구성하는데,
 그 예시는 [재작성-타겟 어노테이션](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)이다.
서로 다른 [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers)는 서로 다른 어노테이션을 지원한다.
 지원되는 어노테이션을 확인하려면 선택한 인그레스 컨트롤러의 설명서를 검토한다.

인그레스 [사양](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
에는 로드 밸런서 또는 프록시 서버를 구성하는데 필요한 모든 정보가 있다. 가장 중요한 것은,
들어오는 요청과 일치하는 규칙 목록을 포함하는 것이다. 인그레스 리소스는 HTTP(S) 트래픽을
지시하는 규칙만 지원한다.

`ingressClassName`을 생략하려면, [기본 인그레스 클래스](#default-ingress-class)가 
정의되어 있어야 한다.

몇몇 인그레스 컨트롤러는 기본 `IngressClass`가 정의되어 있지 않아도 동작한다. 
예를 들어, Ingress-NGINX 컨트롤러는 `--watch-ingress-without-class` 
[플래그](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)를 이용하여 구성될 수 있다. 
하지만 [아래](#default-ingress-class)에 나와 있는 것과 같이 기본 `IngressClass`를 명시하는 것을 
[권장](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)한다.

### 인그레스 규칙

각 HTTP 규칙에는 다음의 정보가 포함된다.

* 선택적 호스트. 이 예시에서는, 호스트가 지정되지 않기에 지정된 IP 주소를 통해 모든 인바운드
  HTTP 트래픽에 규칙이 적용 된다. 만약 호스트가 제공되면(예,
  foo.bar.com), 규칙이 해당 호스트에 적용된다.
* 경로 목록 (예, `/testpath`)에는 각각 `service.name` 과
  `service.port.name` 또는 `service.port.number` 가 정의되어 있는 관련
  백엔드를 가지고 있다. 로드 밸런서가 트래픽을 참조된 서비스로
  보내기 전에 호스트와 경로가 모두 수신 요청의 내용과
  일치해야 한다.
* 백엔드는 [서비스 문서](/ko/docs/concepts/services-networking/service/) 또는 [사용자 정의 리소스 백엔드](#resource-backend)에 설명된 바와 같이
  서비스와 포트 이름의 조합이다. 규칙의 호스트와 경로가 일치하는 인그레스에 대한
  HTTP(와 HTTPS) 요청은 백엔드 목록으로 전송된다.

`defaultBackend` 는 종종 사양의 경로와 일치하지 않는 서비스에 대한 모든 요청을 처리하도록 인그레스
컨트롤러에 구성되는 경우가 많다.

### DefaultBackend {#default-backend}

규칙이 없는 인그레스는 모든 트래픽을 단일 기본 백엔드로 전송하며, 
`.spec.defaultBackend`는 이와 같은 경우에 요청을 처리할 백엔드를 지정한다. 
`defaultBackend` 는 일반적으로 [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers)의 구성 옵션이며, 
인그레스 리소스에 지정되어 있지 않다. 
`.spec.rules` 가 명시되어 있지 않으면, 
`.spec.defaultBackend` 는 반드시 명시되어 있어야 한다. 
`defaultBackend` 가 설정되어 있지 않으면, 어느 규칙에도 해당되지 않는 요청의 처리는 인그레스 컨트롤러의 구현을 따른다(이러한 
경우를 어떻게 처리하는지 알아보려면 해당 인그레스 컨트롤러 문서를 참고한다).

만약 인그레스 오브젝트의 HTTP 요청과 일치하는 호스트 또는 경로가 없으면, 트래픽은
기본 백엔드로 라우팅 된다.

### 리소스 백엔드 {#resource-backend}

`Resource` 백엔드는 인그레스 오브젝트와 동일한 네임스페이스 내에 있는
다른 쿠버네티스 리소스에 대한 ObjectRef이다. `Resource` 는 서비스와
상호 배타적인 설정이며, 둘 다 지정하면 유효성 검사에 실패한다. `Resource`
백엔드의 일반적인 용도는 정적 자산이 있는 오브젝트 스토리지 백엔드로 데이터를
수신하는 것이다.

{{< codenew file="service/networking/ingress-resource-backend.yaml" >}}

위의 인그레스를 생성한 후, 다음의 명령으로 확인할 수 있다.

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### 경로 유형

인그레스의 각 경로에는 해당 경로 유형이 있어야 한다. 명시적
`pathType` 을 포함하지 않는 경로는 유효성 검사에 실패한다. 지원되는
경로 유형은 세 가지이다.

* `ImplementationSpecific`: 이 경로 유형의 일치 여부는 IngressClass에 따라
  달라진다. 이를 구현할 때 별도 `pathType` 으로 처리하거나, `Prefix` 또는 `Exact`
  경로 유형과 같이 동일하게 처리할 수 있다.

* `Exact`: URL 경로의 대소문자를 엄격하게 일치시킨다.

* `Prefix`: URL 경로의 접두사를 `/` 를 기준으로 분리한 값과 일치시킨다.
  일치는 대소문자를 구분하고,
  요소별로 경로 요소에 대해 수행한다.
  모든 _p_ 가 요청 경로의 요소별 접두사가 _p_ 인 경우
  요청은 _p_ 경로에 일치한다.

  {{< note >}} 경로의 마지막 요소가 요청 경로에 있는 마지막
  요소의 하위 문자열인 경우에는 일치하지 않는다(예시: `/foo/bar` 는
  `/foo/bar/baz` 와 일치하지만, `/foo/barbaz` 와는 일치하지 않는다). {{< /note >}}

### 예제

| 종류    | 경로                             | 요청 경로                       | 일치 여부                            |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                             | (모든 경로)                     | 예                                  |
| Exact  | `/foo`                          | `/foo`                        | 예                                  |
| Exact  | `/foo`                          | `/bar`                        | 아니오                               |
| Exact  | `/foo`                          | `/foo/`                       | 아니오                               |
| Exact  | `/foo/`                         | `/foo`                        | 아니오                               |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | 예                                  |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | 예                                  |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | 아니오                               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | 예                                  |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | 예, 마지막 슬래시 무시함                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | 예, 마지막 슬래시 일치함                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | 예, 하위 경로 일치함                    |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | 아니오, 문자열 접두사 일치하지 않음         |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | 예, `/aaa` 접두사 일치함                |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | 예, `/aaa/bbb` 접두사 일치함            |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | 예, `/` 접두사 일치함                   |
| Prefix | `/aaa`                          | `/ccc`                        | 아니오, 기본 백엔드 사용함                |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | 예, Exact 선호함                      |

#### 다중 일치
경우에 따라 인그레스의 여러 경로가 요청과 일치할 수 있다.
이 경우 가장 긴 일치하는 경로가 우선하게 된다. 두 개의 경로가
여전히 동일하게 일치하는 경우 접두사(prefix) 경로 유형보다
정확한(exact) 경로 유형을 가진 경로가 사용 된다.

## 호스트네임 와일드카드
호스트는 정확한 일치(예: "`foo.bar.com`") 또는 와일드카드(예:
"`* .foo.com`")일 수 있다. 정확한 일치를 위해서는 HTTP `host` 헤더가
`host` 필드와 일치해야 한다. 와일드카드 일치를 위해서는 HTTP `host` 헤더가
와일드카드 규칙의 접미사와 동일해야 한다.

| 호스트        | 호스트 헤더         | 일치 여부                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | 공유 접미사를 기반으로 일치함                            |
| `*.foo.com` | `baz.bar.foo.com` | 일치하지 않음, 와일드카드는 단일 DNS 레이블만 포함함          |
| `*.foo.com` | `foo.com`         | 일치하지 않음, 와일드카드는 단일 DNS 레이블만 포함함          |

{{< codenew file="service/networking/ingress-wildcard-host.yaml" >}}

## 인그레스 클래스

인그레스는 서로 다른 컨트롤러에 의해 구현될 수 있으며, 종종 다른 구성으로
구현될 수 있다. 각 인그레스에서는 클래스를 구현해야하는 컨트롤러
이름을 포함하여 추가 구성이 포함된 IngressClass
리소스에 대한 참조 클래스를 지정해야 한다.

{{< codenew file="service/networking/external-lb.yaml" >}}

인그레스클래스의 `.spec.parameters` 필드를 사용하여 
해당 인그레스클래스와 연관있는 환경 설정을 제공하는 다른 리소스를 참조할 수 있다.

사용 가능한 파라미터의 상세한 타입은 
인그레스클래스의 `.spec.parameters` 필드에 명시한 인그레스 컨트롤러의 종류에 따라 다르다.

### 인그레스클래스 범위

인그레스 컨트롤러의 종류에 따라, 클러스터 범위로 설정한 파라미터의 사용이 가능할 수도 있고, 
또는 한 네임스페이스에서만 사용 가능할 수도 있다.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="클러스터" %}}
인그레스클래스 파라미터의 기본 범위는 클러스터 범위이다.

`.spec.parameters` 필드만 설정하고 `.spec.parameters.scope` 필드는 지정하지 않거나,
`.spec.parameters.scope` 필드를 `Cluster`로 지정하면, 
인그레스클래스는 클러스터 범위의 리소스를 참조한다.
파라미터의 `kind`(+`apiGroup`)는 
클러스터 범위의 API (커스텀 리소스일 수도 있음) 를 참조하며, 
파라미터의 `name`은 
해당 API에 대한 특정 클러스터 범위 리소스를 가리킨다.

예시는 다음과 같다.
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # 이 인그레스클래스에 대한 파라미터는 "external-config-1" 라는
    # ClusterIngressParameter(API 그룹 k8s.example.net)에 기재되어 있다.
    # 이 정의는 쿠버네티스가 
    # 클러스터 범위의 파라미터 리소스를 검색하도록 한다.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```
{{% /tab %}}
{{% tab name="네임스페이스" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

`.spec.parameters` 필드를 설정하고 
`.spec.parameters.scope` 필드를 `Namespace`로 지정하면, 
인그레스클래스는 네임스페이스 범위의 리소스를 참조한다. 
사용하고자 하는 파라미터가 속한 네임스페이스를 
`.spec.parameters` 의 `namespace` 필드에 설정해야 한다.

파라미터의 `kind`(+`apiGroup`)는 
네임스페이스 범위의 API (예: 컨피그맵) 를 참조하며, 
파라미터의 `name`은 
`namespace`에 명시한 네임스페이스의 특정 리소스를 가리킨다.

네임스페이스 범위의 파라미터를 이용하여, 
클러스터 운영자가 워크로드에 사용되는 환경 설정(예: 로드 밸런서 설정, API 게이트웨이 정의)에 대한 제어를 위임할 수 있다.
클러스터 범위의 파라미터를 사용했다면 다음 중 하나에 해당된다.

- 다른 팀의 새로운 환경 설정 변경을 적용하려고 할 때마다 
  클러스터 운영 팀이 매번 승인을 해야 한다. 또는,
- 애플리케이션 팀이 클러스터 범위 파라미터 리소스를 변경할 수 있게 하는 
  [RBAC](/docs/reference/access-authn-authz/rbac/) 롤, 바인딩 등의 특별 접근 제어를 
  클러스터 운영자가 정의해야 한다.

인그레스클래스 API 자신은 항상 클러스터 범위이다.

네임스페이스 범위의 파라미터를 참조하는 인그레스클래스 예시가 
다음과 같다.
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # 이 인그레스클래스에 대한 파라미터는 
    # "external-configuration" 네임스페이스에 있는
    # "external-config" 라는 IngressParameter(API 그룹 k8s.example.com)에 기재되어 있다.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### 사용중단(Deprecated) 어노테이션

쿠버네티스 1.18에 IngressClass 리소스 및 `ingressClassName` 필드가 추가되기
전에 인그레스 클래스는 인그레스에서
`kubernetes.io/ingress.class` 어노테이션으로 지정되었다. 이 어노테이션은
공식적으로 정의된 것은 아니지만, 인그레스 컨트롤러에서 널리 지원되었었다.

인그레스의 최신 `ingressClassName` 필드는 해당 어노테이션을
대체하지만, 직접적으로 해당하는 것은 아니다. 어노테이션은 일반적으로
인그레스를 구현해야 하는 인그레스 컨트롤러의 이름을 참조하는 데 사용되었지만,
이 필드는 인그레스 컨트롤러의 이름을 포함하는 추가 인그레스 구성이
포함된 인그레스 클래스 리소스에 대한 참조이다.

### 기본 IngressClass {#default-ingress-class}

특정 IngressClass를 클러스터의 기본 값으로 표시할 수 있다. IngressClass
리소스에서 `ingressclass.kubernetes.io/is-default-class` 를 `true` 로
설정하면 `ingressClassName` 필드가 지정되지 않은
새 인그레스에게 기본 IngressClass가 할당된다.

{{< caution >}}
클러스터의 기본값으로 표시된 IngressClass가 두 개 이상 있는 경우
어드미션 컨트롤러에서 `ingressClassName` 이 지정되지 않은
새 인그레스 오브젝트를 생성할 수 없다. 클러스터에서 최대 1개의 IngressClass가
기본값으로 표시하도록 해서 이 문제를 해결할 수 있다.
{{< /caution >}}

몇몇 인그레스 컨트롤러는 기본 `IngressClass`가 정의되어 있지 않아도 동작한다. 
예를 들어, Ingress-NGINX 컨트롤러는 `--watch-ingress-without-class` 
[플래그](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)를 이용하여 구성될 수 있다. 
하지만 다음과 같이 기본 `IngressClass`를 명시하는 것을 
[권장](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)한다.

{{< codenew file="service/networking/default-ingressclass.yaml" >}}

## 인그레스 유형들

### 단일 서비스로 지원되는 인그레스 {#single-service-ingress}

단일 서비스를 노출할 수 있는 기존 쿠버네티스 개념이 있다
([대안](#대안)을 본다). 인그레스에 규칙 없이 *기본 백엔드* 를 지정해서
이를 수행할 수 있다.

{{< codenew file="service/networking/test-ingress.yaml" >}}

만약 `kubectl apply -f` 를 사용해서 생성한다면 추가한 인그레스의
상태를 볼 수 있어야 한다.

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

여기서 `203.0.113.123` 는 인그레스 컨트롤러가 인그레스를 충족시키기 위해
할당한 IP 이다.

{{< note >}}
인그레스 컨트롤러와 로드 밸런서는 IP 주소를 할당하는데 1~2분이 걸릴 수 있다.
할당될 때 까지는 주소는 종종 `<pending>` 으로 표시된다.
{{< /note >}}

### 간단한 팬아웃(fanout)

팬아웃 구성은 HTTP URI에서 요청된 것을 기반으로 단일 IP 주소에서 1개 이상의 서비스로
트래픽을 라우팅 한다. 인그레스를 사용하면 로드 밸런서의 수를
최소로 유지할 수 있다. 예를 들어 다음과 같은 설정을 한다.

{{< figure src="/ko/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="그림. 인그레스 팬아웃" link="https://mermaid.live/edit#pako:eNqNUk1r2zAY_itCuXRgu7acrak6cupuO23HOAfZkhtRRzaSvA_awgY5lK63wk4J3aDQSw85FOZBf9Hs_IfJtd2k6wa7SC96Pl69D-8RjFLKIIYHkmQT8PrNXiCihDOht0arz7fl4q5a3FZfi9VZMX5mO6BaFL9-FOW30-rsyi6vr8ovp9X1p_Ji_jKUw_L73FSgXBbl5bKazYFjD7k4kEyp0abQAt7OwNn1HA_5juejsWna8mx7eLwdp-mxYvIdj5g3Mj7lz5lRge4J95Hr_qkJiew06KkG4YE7MBoQCJWHzaz1eJc3hrSaLcGD2T2lbWSMs5R6o9X5uZlr_BRCf4FQA_n_hvqbEBMU1JETpfZZDLKEcAFiniS4Rym1lJbpIcO9OI7b2n7PqZ7gfvbBitIklbjnuu7epsfhQLUOPnoRsef_ZWKwRyZRkivNZGu0VuJeGIaPXdDapWn4YATaUK0utq5AVh1sfdxXfn3064-vpc0WNoFsvjbfam-zBIGAFpwyOSWcmj0-CgQAAdQTNmUBxKakLCZ5ogMYiBNDzTNKNHtFuU4lxDFJFLMgyXX69qOIINYyZx1pnxOzKtOWdfIbg1JDXw" >}}


다음과 같은 인그레스가 필요하다.

{{< codenew file="service/networking/simple-fanout-example.yaml" >}}

`kubectl apply -f` 를 사용해서 인그레스를 생성 할 때 다음과 같다.

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

인그레스 컨트롤러는 서비스(`service1`, `service2`)가 존재하는 한,
인그레스를 만족시키는 특정한 로드 밸런서를 프로비저닝한다.
이렇게 하면, 주소 필드에서 로드 밸런서의 주소를
볼 수 있다.

{{< note >}}
사용 중인 [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)에
따라 default-http-backend
[서비스](/ko/docs/concepts/services-networking/service/)를 만들어야 할 수도 있다.
{{< /note >}}

### 이름 기반의 가상 호스팅

이름 기반의 가상 호스트는 동일한 IP 주소에서 여러 호스트 이름으로 HTTP 트래픽을 라우팅하는 것을 지원한다.

{{< figure src="/ko/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="그림. 이름 기반의 가상 호스팅 인그레스" link="https://mermaid.live/edit#pako:eNqNks9r2zAUx_8VoVw2sE1sZ1umjJy6207bMc5BtuTG1JaMJO8HbWGDHErX22DskNANCr3skENhHuwvmpz_YXJsLy7tYBf5oe_3fd7T8zuGEScUIngocL4AL15OQMCiNKFMPZhtP9zo9a9qfVN9Lrfn5fyh7YBqXf7-UeqvZ9X5la2vr_THs-r6vf60ehaKqf62MhHQm1JfbqrlCjj2NGGHgko56ydawH0ydp66juv5jut780nAWp9tT0-2X0pjMhURiDl3QiyciGcnkorXSUTdmSHrn0tjAd0VGg_ndef3Q2pADepBvLsQr4PIImymUb__8ntNWW728J2lrWsK5Zy4s-3FhXn4_K7k3SN5jeT_Wxr1JcrI7p9gKQ9oDPIUJwzESZqiASHEkkrwI4oGcRy3sf0mIWqBRvlbK-IpF2gwHA4nfcbRWLYE33sc0Uf_BTHaLUiUFlJR0YL2mWgQhuFtirenNAX_gkA7VKsbWxd4Vj3Y-thFfn2M6sb3qc2aNgPp3zZttd8JtGBGRYYTYrb8OGAABFAtaEYDiExIaIyLVAUwYKfGWuQEK_qcJIoLiGKcSmpBXCj-6h2LIFKioJ3pIMFmTbLWdfoHV6NUVg" >}}


다음 인그레스는 [호스트 헤더](https://tools.ietf.org/html/rfc7230#section-5.4)에 기반한 요청을
라우팅 하기 위해 뒷단의 로드 밸런서를 알려준다.

{{< codenew file="service/networking/name-virtual-host-ingress.yaml" >}}

만약 규칙에 정의된 호스트 없이 인그레스 리소스를 생성하는 경우,
이름 기반 가상 호스트가 없어도 인그레스 컨트롤러의 IP 주소에 대한 웹
트래픽을 일치 시킬 수 있다.

예를 들어, 다음 인그레스는 `first.bar.com`에 요청된 트래픽을
`service1`로, `second.bar.com`는 `service2`로, 그리고 요청 헤더가 `first.bar.com` 또는 `second.bar.com`에 해당되지 않는 모든 트래픽을 `service3`로 라우팅한다.

{{< codenew file="service/networking/name-virtual-host-ingress-no-third-host.yaml" >}}

### TLS

TLS 개인 키 및 인증서가 포함된 {{< glossary_tooltip term_id="secret" >}}을
지정해서 인그레스를 보호할 수 있다. 인그레스 리소스는
단일 TLS 포트인 443만 지원하고 인그레스 지점에서 TLS 종료를
가정한다(서비스 및 해당 파드에 대한 트래픽은 일반 텍스트임).
인그레스의 TLS 구성 섹션에서 다른 호스트를 지정하면, SNI TLS 확장을 통해
지정된 호스트이름에 따라 동일한 포트에서 멀티플렉싱
된다(인그레스 컨트롤러가 SNI를 지원하는 경우). TLS secret에는
`tls.crt` 와 `tls.key` 라는 이름의 키가 있어야 하고, 여기에는 TLS에 사용할 인증서와
개인 키가 있다. 예를 들어 다음과 같다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

인그레스에서 시크릿을 참조하면 인그레스 컨트롤러가 TLS를 사용하여
클라이언트에서 로드 밸런서로 채널을 보호하도록 지시한다. 생성한
TLS 시크릿이 `https-example.foo.com` 의 정규화 된 도메인 이름(FQDN)이라고
하는 일반 이름(CN)을 포함하는 인증서에서 온 것인지 확인해야 한다.

{{< note >}}
가능한 모든 하위 도메인에 대해 인증서가 발급되어야 하기 때문에
TLS는 기본 규칙에서 작동하지 않는다. 따라서
`tls` 섹션의 `hosts`는 `rules`섹션의 `host`와 명시적으로 일치해야
한다.
{{< /note >}}

{{< codenew file="service/networking/tls-example-ingress.yaml" >}}

{{< note >}}
TLS 기능을 제공하는 다양한 인그레스 컨트롤러간의 기능
차이가 있다. 사용자 환경에서의 TLS의 작동 방식을 이해하려면
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https) 또는 기타
플랫폼의 특정 인그레스 컨트롤러에 대한 설명서를 참조한다.
{{< /note >}}

### 로드 밸런싱 {#load-balancing}

인그레스 컨트롤러는 로드 밸런싱 알고리즘, 백엔드 가중치 구성표 등
모든 인그레스에 적용되는 일부 로드 밸런싱
정책 설정으로 부트스트랩된다. 보다 진보된 로드 밸런싱 개념
(예: 지속적인 세션, 동적 가중치)은 아직 인그레스를 통해
노출되지 않는다. 대신 서비스에 사용되는 로드 밸런서를 통해 이러한 기능을
얻을 수 있다.

또한, 헬스 체크를 인그레스를 통해 직접 노출되지 않더라도, 쿠버네티스에는
[준비 상태 프로브](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)와
같은 동일한 최종 결과를 얻을 수 있는 병렬 개념이
있다는 점도 주목할 가치가 있다. 컨트롤러 별
설명서를 검토하여 헬스 체크를 처리하는 방법을 확인한다(예:
[nginx](https://git.k8s.io/ingress-nginx/README.md), 또는
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## 인그레스 업데이트

기존 인그레스를 업데이트해서 새 호스트를 추가하려면, 리소스를 편집해서 호스트를 업데이트 할 수 있다.

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

YAML 형식의 기존 구성이 있는 편집기가 나타난다.
새 호스트를 포함하도록 수정한다.

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

변경사항을 저장한 후, kubectl은 API 서버의 리소스를 업데이트하며, 인그레스
컨트롤러에게도 로드 밸런서를 재구성하도록 지시한다.

이것을 확인한다.

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

수정된 인그레스 YAML 파일을 `kubectl replace -f` 를 호출해서 동일한 결과를 얻을 수 있다.

## 가용성 영역에 전체에서의 실패

장애 도메인에 트래픽을 분산시키는 기술은 클라우드 공급자마다 다르다.
자세한 내용은 [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers) 설명서를 확인한다.

## 대안

사용자는 인그레스 리소스를 직접적으로 포함하지 않는 여러가지 방법으로 서비스를 노출할 수 있다.

* [Service.Type=LoadBalancer](/ko/docs/concepts/services-networking/service/#loadbalancer) 사용.
* [Service.Type=NodePort](/ko/docs/concepts/services-networking/service/#type-nodeport) 사용.



## {{% heading "whatsnext" %}}

* [인그레스](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API에 대해 배우기
* [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)에 대해 배우기
* [NGINX 컨트롤러로 Minikube에서 인그레스 구성하기](/ko/docs/tasks/access-application-cluster/ingress-minikube/)
