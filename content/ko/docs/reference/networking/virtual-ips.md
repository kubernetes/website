---
title: 가상 IP 및 서비스 프록시
content_type: reference
weight: 50
---

<!-- overview -->
쿠버네티스 클러스터의 모든 {{< glossary_tooltip term_id="node" text="노드" >}}는 
[`kube-proxy`](/ko/docs/reference/command-line-tools-reference/kube-proxy/)를 
실행한다(`kube-proxy`를 대체하는 구성요소를 직접 배포한 경우가 아니라면).

`kube-proxy`는 
[`ExternalName`](/ko/docs/concepts/services-networking/service/#externalname) 외의 `type`의 
{{< glossary_tooltip term_id="service" text="서비스">}}를 위한 
_가상 IP_ 메커니즘의 구현을 담당한다.


항상 발생하는 질문은, 
왜 쿠버네티스가 인바운드 트래픽을 백엔드로 전달하기 위해 
프록시에 의존하는가 하는 점이다. 
다른 접근법이 있는가? 예를 들어, 여러 A 값 (또는 IPv6의 경우 AAAA)을 가진 DNS 레코드를 구성하고, 
라운드-로빈 이름 확인 방식을 취할 수 있는가?

There are a few reasons for using proxying for Services:

* 레코드 TTL을 고려하지 않고, 만료된 이름 검색 결과를 캐싱하는 
  DNS 구현에 대한 오래된 역사가 있다.
* 일부 앱은 DNS 검색을 한 번만 수행하고 결과를 무기한으로 캐시한다.
* 앱과 라이브러리가 적절히 재-확인을 했다고 하더라도, 
  DNS 레코드의 TTL이 낮거나 0이면 
  DNS에 부하가 높아 관리하기가 어려워질 수 있다.

본 페이지의 뒷 부분에서 다양한 kube-proxy 구현이 동작하는 방식에 대해 읽을 수 있다. 
우선 알아두어야 할 것은, `kube-proxy`를 구동할 때, 
커널 수준의 규칙이 수정(예를 들어, iptables 규칙이 생성될 수 있음)될 수 있고, 
이는 때로는 리부트 전까지 정리되지 않을 수도 있다. 
그래서, kube-proxy는 컴퓨터에서 저수준의, 특권을 가진(privileged) 네트워킹 프록시 서비스가 구동됨으로써 발생하는 
결과를 이해하고 있는 관리자에 의해서만 구동되어야 한다. 
비록 `kube-proxy` 실행 파일이 `cleanup` 기능을 지원하기는 하지만, 
이 기능은 공식적인 기능이 아니기 때문에 구현된 그대로만 사용할 수 있다.


<a id="example"></a>
예를 들어, 3개의 레플리카로 실행되는 스테이트리스 이미지-처리 백엔드를 생각해보자. 
이러한 레플리카는 대체 가능하다. 
즉, 프론트엔드는 그것들이 사용하는 백엔드를 신경쓰지 않는다. 
백엔드 세트를 구성하는 실제 파드는 변경될 수 있지만, 
프론트엔드 클라이언트는 이를 인식할 필요가 없으며, 백엔드 세트 자체를 추적해야 할 필요도 없다.


<!-- body -->

## 프록시 모드들

kube-proxy는 여러 모드 중 하나로 기동될 수 있으며, 이는 환경 설정에 따라 결정됨에 유의한다.

- kube-proxy의 구성은 컨피그맵(ConfigMap)을 통해 이루어진다. 
  그리고 해당 kube-proxy를 위한 컨피그맵은 실효성있게 
  거의 대부분의 kube-proxy의 플래그의 행위를 더 이상 사용하지 않도록 한다.
- kube-proxy를 위한 해당 컨피그맵은 기동 중 구성의 재적용(live reloading)은 지원하지 않는다.
- kube-proxy를 위한 컨피그맵 파라미터는 기동 시에 검증이나 확인을 하지 않는다.
  예를 들어, 운영 체계가 iptables 명령을 허용하지 않을 경우,
  표준 커널 kube-proxy 구현체는 작동하지 않을 것이다.

### `iptables` 프록시 모드 {#proxy-mode-iptables}

이 모드에서는, kube-proxy는 쿠버네티스 컨트롤 플레인의 
서비스, 엔드포인트슬라이스 오브젝트의 추가와 제거를 감시한다. 
각 서비스에 대해, 서비스의 `clusterIP` 및 `port`에 대한 트래픽을 캡처하고 
해당 트래픽을 서비스의 백엔드 세트 중 하나로 리다이렉트(redirect)하는 
iptables 규칙을 설치한다. 
각 엔드포인트 오브젝트에 대해, 백엔드 파드를 선택하는 iptables 규칙을 설치한다.

기본적으로, iptables 모드의 kube-proxy는 백엔드를 임의로 선택한다.

트래픽을 처리하기 위해 iptables를 사용하면 시스템 오버헤드가 줄어드는데, 
유저스페이스와 커널 스페이스 사이를 전환할 필요없이 리눅스 넷필터(netfilter)가 
트래픽을 처리하기 때문이다. 이 접근 방식은 더 신뢰할 수 있기도 하다.

kube-proxy가 iptables 모드에서 실행 중이고 선택된 첫 번째 파드가 응답하지 않으면, 연결이 실패한다. 
이는 이전의 `userspace` 모드와 다르다. 
이전의 `userspace` 시나리오에서는, 
kube-proxy는 첫 번째 파드에 대한 연결이 실패했음을 감지하고 다른 백엔드 파드로 자동으로 재시도한다.

파드 [준비성 프로브(readiness probe)](/ko/docs/concepts/workloads/pods/pod-lifecycle/#컨테이너-프로브-probe)를 사용하여 
백엔드 파드가 제대로 작동하는지 확인할 수 있으므로, 
iptables 모드의 kube-proxy는 정상으로 테스트된 백엔드만 볼 수 있다. 
이렇게 하면 트래픽이 kube-proxy를 통해 실패한 것으로 알려진 파드로 전송되는 것을 막을 수 있다.

{{< figure src="/images/docs/services-iptables-overview.svg" title="iptables 프록시에 대한 서비스 개요 다이어그램" class="diagram-medium" >}}

#### 예시 {#packet-processing-iptables}

다시 한번, [위](#example)에서 설명한 
이미지 처리 애플리케이션을 고려한다.
백엔드 서비스가 생성되면, 
쿠버네티스 컨트롤 플레인은 가상 IP 주소(예 : 10.0.0.1)를 할당한다. 
서비스 포트를 1234라고 가정하자. 
클러스터의 모든 kube-proxy 인스턴스는 
새 서비스의 생성을 관찰할 수 있다.

프록시가 새로운 서비스를 발견하면, 
가상 IP 주소에서 서비스-별 규칙으로 리다이렉션되는 일련의 iptables 규칙을 설치한다. 
서비스-별 규칙은 트래픽을 (목적지 NAT를 사용하여) 백엔드로 리다이렉션하는 
엔드포인트-별 규칙에 연결한다.

클라이언트가 서비스의 가상 IP 주소에 연결하면 iptables 규칙이 시작한다. 
(세션 어피니티(Affinity)에 따라 또는 무작위로) 백엔드가 선택되고, 
패킷의 클라이언트 IP 주소를 덮어쓰지 않고 백엔드로 리다이렉션된다.

트래픽이 노드-포트 또는 로드 밸런서를 통해 들어오는 경우에도,
이와 동일한 기본 흐름이 실행되지만, 클라이언트 IP는 변경된다.

### IPVS 프록시 모드 {#proxy-mode-ipvs}

`ipvs` 모드에서, kube-proxy는 쿠버네티스 서비스와 엔드포인트슬라이스를 감시하고,
`netlink` 인터페이스를 호출하여 그에 따라 IPVS 규칙을 생성하고
IPVS 규칙을 쿠버네티스 서비스 및 엔드포인트슬라이스와 주기적으로 동기화한다.
이 제어 루프는 IPVS 상태가 원하는 상태와 일치하도록
보장한다.
서비스에 접근하면, IPVS는 트래픽을 백엔드 파드 중 하나로 보낸다.

IPVS 프록시 모드는 iptables 모드와 유사한 넷필터 후크 기능을
기반으로 하지만, 해시 테이블을 기본 데이터 구조로 사용하고
커널 스페이스에서 동작한다.
이는 IPVS 모드의 kube-proxy는 iptables 모드의 kube-proxy보다
지연 시간이 짧은 트래픽을 리다이렉션하고, 프록시 규칙을 동기화할 때 성능이
훨씬 향상됨을 의미한다. 다른 프록시 모드와 비교했을 때, IPVS 모드는
높은 네트워크 트래픽 처리량도 지원한다.

IPVS는 트래픽을 백엔드 파드로 밸런싱하기 위한 추가 옵션을 제공하며,
그 목록은 다음과 같다.

* `rr`: 라운드-로빈
* `lc`: 최소 연결 (가장 적은 수의 열려있는 연결)
* `dh`: 목적지 해싱
* `sh`: 소스 해싱
* `sed`: 최단 예상 지연 (shortest expected delay)
* `nq`: 큐 미사용 (never queue)

{{< note >}}
IPVS 모드에서 kube-proxy를 실행하려면, kube-proxy를 시작하기 전에 노드에서 IPVS를
사용 가능하도록 해야 한다.

kube-proxy가 IPVS 프록시 모드로 시작될 때, IPVS 커널 모듈이
사용 가능한지 확인한다. IPVS 커널 모듈이 감지되지 않으면, kube-proxy는
iptables 프록시 모드로 다시 실행된다.
{{< /note >}}

{{< figure src="/images/docs/services-ipvs-overview.svg" title="IPVS 프록시에 대한 서비스 개요 다이어그램" class="diagram-medium" >}}

## 세션 어피니티

이러한 프록시 모델에서, 
클라이언트가 쿠버네티스/서비스/파드에 대해 전혀 모르더라도 
서비스의 IP:포트로 향하는 트래픽은 적절한 백엔드로 프록시된다.

특정 클라이언트의 연결이 매번 동일한 파드로
전달되도록 하려면, 서비스의 `.spec.sessionAffinity`를 `ClientIP`로 설정하여
클라이언트의 IP 주소를 기반으로 세션 어피니티를 선택할 수 있다.
(기본값은 `None`)

### 세션 고정(Session stickiness) 타임아웃

서비스의 `.spec.sessionAffinityConfig.clientIP.timeoutSeconds`를 적절히 설정하여
최대 세션 고정 시간을 설정할 수도 있다.
(기본값은 10800으로, 이는 3시간에 해당됨)

{{< note >}}
윈도우에서는, 서비스의 최대 세션 고정 시간(maximum session sticky time)을 설정하는 것이 지원되지 않는다.
{{< /note >}}

## 서비스에 IP 주소 할당

고정된 목적지로 실제로 라우팅되는 파드 IP 주소와 달리,
서비스 IP는 실제로는 단일 호스트에서 응답하지 않는다. 
대신에, kube-proxy는 패킷 처리 로직(예: 리눅스의 iptables)을 사용하여, 
필요에 따라 투명하게 리다이렉션되는 _가상_ IP 주소를 정의한다.

클라이언트가 VIP에 연결하면, 트래픽이 자동으로 적절한 엔드포인트로 전송된다.
환경 변수와 서비스 용 DNS는 
실제로는 서비스의 가상 IP 주소 (및 포트)로 채워진다.

### 충돌 방지하기

쿠버네티스의 주요 철학 중 하나는, 
사용자가 잘못한 것이 없는 경우에는 실패할 수 있는 상황에 노출되어서는 안된다는 것이다. 
서비스 리소스 설계 시, 
다른 사람의 포트 선택과 충돌할 경우에 대비해 자신의 포트 번호를 선택하지 않아도 된다. 
만약 그러한 일이 발생한다면 그것은 격리 실패이다.

서비스에 대한 포트 번호를 사용자가 선택할 수 있도록 하려면, 
두 개의 서비스가 충돌하지 않도록 해야 한다. 
쿠버네티스는 API 서버에 설정되어 있는 `service-cluster-ip-range` CIDR 범위에서 
각 서비스에 고유한 IP 주소를 할당하여 이를 달성한다.

각 서비스가 고유한 IP를 받도록 하기 위해, 각 서비스를 만들기 전에 내부 할당기가 
{{< glossary_tooltip term_id="etcd" >}}에서 
글로벌 할당 맵을 원자적으로(atomically) 업데이트한다. 
서비스가 IP 주소 할당을 가져오려면 레지스트리에 맵 오브젝트가 있어야 하는데, 
그렇지 않으면 IP 주소를 할당할 수 없다는 메시지와 함께 생성에 실패한다.

컨트롤 플레인에서, 백그라운드 컨트롤러는 해당 맵을 생성해야 
한다(인-메모리 잠금을 사용하는 이전 버전의 쿠버네티스에서의 마이그레이션 지원을 위해 필요함). 
쿠버네티스는 또한 컨트롤러를 사용하여 유효하지 않은 
할당(예: 관리자 개입에 의한)을 체크하고 
더 이상 어떠한 서비스도 사용하지 않는 할당된 IP 주소를 정리한다.

#### 서비스 가상 IP 주소의 IP 주소 범위 {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

쿠버네티스는 `min(max(16, cidrSize / 16), 256)` 공식을 사용하여 얻어진 
`service-cluster-ip-range`의 크기에 기반하여 `ClusterIP` 범위를 두 대역으로 나누며, 
여기서 이 공식은 _16 이상 256 이하이며, 
그 사이에 계단 함수가 있음_ 으로 설명할 수 있다. 

쿠버네티스는 서비스에 대한 동적 IP 할당 시 상위 대역에서 우선적으로 선택하며, 
이는 곧 만약 사용자가 `type: ClusterIP` 서비스에 특정 IP 주소를 할당하고 싶다면 
**하위** 대역에서 골라야 함을 의미한다. 
이렇게 함으로써 할당 시 충돌의 위험을 줄일 수 있다.

만약 `ServiceIPStaticSubrange` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 비활성화하면 
쿠버네티스는 `type: ClusterIP` 서비스에 대해 
수동 및 동적 할당 IP 주소를 위한 하나의 공유되는 풀을 사용한다.

## 트래픽 폴리시

`.spec.internalTrafficPolicy` 및 `.spec.externalTrafficPolicy` 필드를 설정하여 
쿠버네티스가 트래픽을 어떻게 정상(healthy, “ready”) 백엔드로 라우팅할지를 제어할 수 있다.

### 내부 트래픽 폴리시

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

`spec.internalTrafficPolicy` 필드를 설정하여 내부 소스에서 오는 트래픽이 어떻게 라우트될지를 제어할 수 있다.
이 필드는 `Cluster` 또는 `Local`로 설정할 수 있다. 
필드를 `Cluster`로 설정하면 내부 트래픽을 준비 상태의 모든 엔드포인트로 라우트하며, 
`Local`로 설정하면 준비 상태의 노드-로컬 엔드포인트로만 라우트한다. 
만약 트래픽 정책이 `Local`로 설정되어 있는데 노드-로컬 엔드포인트가 하나도 없는 경우, kube-proxy는 트래픽을 드롭시킨다.

### 외부 트래픽 폴리시

`spec.externalTrafficPolicy` 필드를 설정하여 외부 소스에서 오는 트래픽이 어떻게 라우트될지를 제어할 수 있다.
이 필드는 `Cluster` 또는 `Local`로 설정할 수 있다. 
필드를 `Cluster`로 설정하면 외부 트래픽을 준비 상태의 모든 엔드포인트로 라우트하며, 
`Local`로 설정하면 준비 상태의 노드-로컬 엔드포인트로만 라우트한다. 
만약 트래픽 정책이 `Local`로 설정되어 있는데 노드-로컬 엔드포인트가 하나도 없는 경우, 
kube-proxy는 연관된 서비스로의 트래픽을 포워드하지 않는다.

### 종료 중인 엔드포인트로 가는 트래픽

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

kube-proxy에 대해 `ProxyTerminatingEndpoints` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있고 
트래픽 폴리시가 `Local`이면, 
해당 노드의 kube-proxy는 서비스에 대한 엔드포인트를 선택할 때 좀 더 복잡한 알고리즘을 사용한다. 
이 기능이 활성화되어 있으면, kube-proxy는 노드가 로컬 엔드포인트를 갖고 있는지, 
그리고 모든 로컬 엔드포인트가 '종료 중'으로 표시되어 있는지 여부를 확인한다. 
만약 로컬 엔드포인트가 존재하고 **모든** 로컬 엔드포인트가 종료 중이면, 
kube-proxy는 종료 중인 해당 엔드포인트로 트래픽을 전달한다. 
이외의 경우, kube-proxy는 종료 중이 아닌 엔드포인트로 트래픽을 전달하는 편을 선호한다.

종료 중인 엔드포인트에 대한 이러한 포워딩 정책 덕분에, `externalTrafficPolicy: Local`을 사용하는 경우에 
`NodePort` 및 `LoadBalancer` 서비스가 연결들을 자비롭게(gracefully) 종료시킬 수 있다.

디플로이먼트가 롤링 업데이트될 때, 로드밸런서 뒤에 있는 노드가 해당 디플로이먼트의 레플리카를 N개에서 0개 갖도록 변경될 수 있다. 
일부 경우에, 외부 로드 밸런서가 헬스 체크 프로브 사이의 기간에 레플리카 0개를 갖는 노드로 트래픽을 전송할 수 있다. 
종료 중인 엔드포인트로의 트래픽 라우팅 기능을 통해 
파드를 스케일 다운 중인 노드가 해당 종료 중인 파드로의 트래픽을 자비롭게 수신 및 드레인할 수 있다. 
파드 종료가 완료되면, 외부 로드 밸런서는 이미 노드의 헬스 체크가 실패했음을 확인하고 
해당 노드를 백엔드 풀에서 완전히 제거했을 것이다.

## {{% heading "whatsnext" %}}

서비스에 대해 더 알아보려면, 
[서비스와 애플리케이션 연결](/ko/docs/tutorials/services/connect-applications-service/)을 읽어 본다.

또한,

* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 읽어 본다.
* 서비스 API에 대한 [API 레퍼런스](/docs/reference/kubernetes-api/service-resources/service-v1/)를 읽어 본다.
