---
title: 서비스가 지원하는 프로토콜
content_type: reference
weight: 10
---

<!-- overview -->
{{< glossary_tooltip text="서비스" term_id="service" >}}를 구성하여, 
쿠버네티스가 지원하는 네트워크 프로토콜 중 하나를 선택할 수 있다.

쿠버네티스는 서비스에 대해 다음의 프로토콜을 지원한다.

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) _(기본값)_
- [`UDP`](#protocol-udp)

서비스를 정의할 때, 서비스가 사용할 
[애플리케이션 프로토콜](/ko/docs/concepts/services-networking/service/#애플리케이션-프로토콜)을 
지정할 수도 있다.

이 문서에서는 몇 가지 특수 사례에 대해 설명하며, 
이들 모두는 일반적으로 전송 프로토콜(transport protocol)로 TCP를 사용한다.

- [HTTP](#protocol-http-special) 및 [HTTPS](#protocol-http-special)
- [PROXY 프로토콜](#protocol-proxy-special)
- 로드밸런서에서의 [TLS](#protocol-tls-special) 터미네이션

<!-- body -->
## 지원하는 프로토콜 {#protocol-support}

서비스 포트의 `protocol`에 대해 다음 3개의 값이 유효하다.

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

SCTP 트래픽을 지원하는 네트워크 플러그인을 사용하는 경우, 대부분의 서비스에 
SCTP를 사용할 수 있다. `type: LoadBalancer` 서비스의 경우 SCTP 지원 여부는 
이 기능을 제공하는 클라우드 공급자에 따라 다르다. (대부분 지원하지 않음)

SCTP는 윈도우 노드에서는 지원되지 않는다.

#### 멀티홈(multihomed) SCTP 연결 지원 {#caveat-sctp-multihomed}

멀티홈 SCTP 연결 지원을 위해서는 CNI 플러그인이 파드에 복수개의 인터페이스 및 IP 주소를 할당하는 기능을 지원해야 한다.

멀티홈 SCTP 연결에서의 NAT는 상응하는 커널 모듈 내의 특수한 로직을 필요로 한다.

### `TCP` {#protocol-tcp}

모든 종류의 서비스에 TCP를 사용할 수 있으며, 이는 기본 네트워크 프로토콜이다.

### `UDP` {#protocol-udp}

대부분의 서비스에 UDP를 사용할 수 있다. `type: LoadBalancer` 서비스의 경우, 
UDP 지원 여부는 이 기능을 제공하는 클라우드 공급자에 따라 다르다.


## 특수 케이스

### HTTP {#protocol-http-special}

클라우드 공급자가 이를 지원하는 경우, 
LoadBalancer 모드의 서비스를 사용하여, 
쿠버네티스 클러스터 외부에, HTTP / HTTPS 리버스 프록싱을 통해 
해당 서비스의 백엔드 엔드포인트로 트래픽을 전달하는 로드밸런서를 구성할 수 있다.

일반적으로, 트래픽을 HTTP 수준에서 제어하려면 
해당 서비스의 프로토콜을 `TCP`로 지정하고 
로드밸런서를 구성하는 
{{< glossary_tooltip text="어노테이션" term_id="annotation" >}}(보통 
클라우드 공급자마다 다름)을 추가한다. 
이 구성은 워크로드로의 HTTPS (HTTP over TLS) 지원 및 평문 HTTP 리버스 프록시도 포함할 수 있다.

{{< note >}}
서비스 대신 {{< glossary_tooltip term_id="ingress" text="인그레스" >}} 를 사용하여
HTTP/HTTPS 서비스를 노출할 수도 있다.
{{< /note >}}

특정 연결의 
[애플리케이션 프로토콜](/ko/docs/concepts/services-networking/service/#애플리케이션-프로토콜)을 
`http` 또는 `https`로 추가적으로 명시하고 싶을 수도 있다. 
로드밸런서에서 워크로드로 가는 세션이 HTTP without TLS이면 `http`를 사용하고, 
로드밸런서에서 워크로드로 가는 세션이 TLS 암호화를 사용하면 `https`를 사용한다.

### PROXY 프로토콜 {#protocol-proxy-special}

클라우드 공급자가 지원하는 경우에, 
`type: LoadBalancer`로 설정된 서비스를 사용하여, 
쿠버네티스 외부에 존재하면서 연결들을 
[PROXY 프로토콜](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt)로 감싸 전달하는 로드밸런서를 구성할 수 있다.

이러한 로드 밸런서는 들어오는 연결을 설명하는 초기 일련의 옥텟(octets)을 전송하며, 
이는 다음의 예시(PROXY 프로토콜 v1)와 유사하다.

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

프록시 프로토콜 프리앰블(preamble) 뒤에 오는 데이터는 
클라이언트가 전송한 원본 데이터이다. 
양쪽 중 한쪽에서 연결을 닫으면, 
로드밸런서도 연결 종료를 트리거하며 남아있는 데이터를 수신 가능한 쪽으로 보낸다.

일반적으로는, 프로토콜을 `TCP`로 설정한 서비스를 정의한다. 
또한, 클라우드 공급자별로 상이한 어노테이션을 설정하여 
로드밸런서가 각 인커밍 연결을 PROXY 프로토콜로 감싸도록 구성할 수도 있다.

### TLS {#protocol-tls-special}

클라우드 공급자가 지원하는 경우에, 
`type: LoadBalancer`로 설정된 서비스를 사용하여, 
쿠버네티스 외부에 존재하는 리버스 프록시를 구축할 수 있으며, 
이 때 클라이언트로부터 로드밸런서까지의 연결은 TLS 암호화되고 로드밸런서는 TLS 서버 피어가 된다. 
로드밸런서로부터 워크로드까지의 연결은 TLS일 수도 있으며, 평문일 수도 있다. 
사용 가능한 정확한 옵션의 범위는 클라우드 공급자 또는 커스텀 서비스 구현에 따라 다를 수 있다.

일반적으로는, 프로토콜을 `TCP`로 설정하고 
어노테이션(보통 클라우드 공급자별로 상이함)을 설정하여 
로드밸런서가 TLS 서버로 작동하도록 구성한다. 
클라우드 공급자별로 상이한 메커니즘을 사용하여 
TLS 아이덴티티(서버, 그리고 경우에 따라 워크로드로 연결하는 클라이언트도 가능)를 구성할 수도 있다.
