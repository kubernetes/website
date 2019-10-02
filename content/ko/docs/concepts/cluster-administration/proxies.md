---
title: 쿠버네티스에서 프락시(Proxy)
content_template: templates/concept
weight: 90
---

{{% capture overview %}}
이 페이지는 쿠버네티스에서 함께 사용되는 프락시(Proxy)를 설명한다.
{{% /capture %}}

{{% capture body %}}

## 프락시

쿠버네티스를 이용할 때에 사용할 수 있는 여러 프락시가 있다.

1.  [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - 사용자의 데스크탑이나 파드 안에서 실행한다.
    - 로컬 호스트 주소에서 쿠버네티스의 API 서버로 프락시한다.
    - 클라이언트로 프락시는 HTTP를 사용한다.
    - API 서버로 프락시는 HTTPS를 사용한다.
    - API 서버를 찾는다.
    - 인증 헤더를 추가한다.

1.  [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - API 서버에 내장된 요새(bastion)이다.
    - 클러스터 외부의 사용자가 도달할 수 없는 클러스터 IP 주소로 연결한다.
    - API 서버 프로세스에서 실행한다.
    - 클라이언트로 프락시는 HTTPS(또는 API서버에서 HTTP로 구성된 경우는 HTTP)를 사용한다.
    - 사용 가능한 정보를 이용하여 프락시에 의해 선택한 HTTP나 HTTPS를 사용할 수 있는 대상이다.
    - 노드, 파드, 서비스에 도달하는데 사용할 수 있다.
    - 서비스에 도달할 때에는 로드 밸런싱을 수행한다.

1.  [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - 각 노드에서 실행한다.
    - UDP, TCP, SCTP를 이용하여 프락시 한다.
    - HTTP는 이해하지 못한다.
    - 로드 밸런싱을 제공한다.
    - 단지 서비스에 도달하는데 사용한다.

1.  API 서버 앞단의 프락시/로드밸런서

    - 존재 및 구현은 클러스터 마다 다르다. (예: nginx)
    - 모든 클라이언트와 하나 이상의 API 서버에 위치한다.
    - 여러 API 서버가 있는 경우 로드 밸런서로서 작동한다.

1.  외부 서비스의 클라우드 로드 밸런서

    - 일부 클라우드 제공자는 제공한다. (예: AWS ELB, 구글 클라우드 로드 밸런서)
    - 쿠버네티스 서비스로 `LoadBalancer` 유형이 있으면 자동으로 생성된다.
    - 일반적으로 UDP/TCP만 지원한다.
    - SCTP 지원은 클라우드 제공자의 구현에 달려 있다.
    - 구현은 클라우드 제공자에 따라 다양하다.

쿠버네티스 사용자는 보통 처음 두 가지 유형 외의 것은 걱정할 필요없다.
클러스터 관리자는 일반적으로 후자의 유형이 올바르게 구성되었는지 확인한다.

## 요청을 리다이렉트하기

프락시는 리다이렉트 기능을 대체했다. 리다이렉트는 더 이상 사용하지 않는다.

{{% /capture %}}


