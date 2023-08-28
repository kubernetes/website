---
# reviewers:
# - dchen1107
# - liggitt
title: 컨트롤 플레인-노드 간 통신
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

이 문서는 API 서버와 쿠버네티스 클러스터 사이에 대한 통신 경로의 목록을 작성한다. 
이는 사용자가 신뢰할 수 없는 네트워크(또는 클라우드 공급자의 완전한 퍼블릭 IP)에서 
클러스터를 실행할 수 있도록 네트워크 구성을 강화하기 위한 맞춤 설치를 할 수 있도록 한다.


<!-- body -->

## 노드에서 컨트롤 플레인으로의 통신

쿠버네티스에는 "허브 앤 스포크(hub-and-spoke)" API 패턴을 가지고 있다. 노드(또는 노드에서 실행되는 파드들)의
모든 API 사용은 API 서버에서 종료된다. 다른 컨트롤 플레인 컴포넌트 중 어느 것도 원격 서비스를 노출하도록 
설계되지 않았다. API 서버는 하나 이상의 클라이언트 
[인증](/docs/reference/access-authn-authz/authentication/) 형식이 활성화된
보안 HTTPS 포트(일반적으로 443)에서 원격 연결을 수신하도록 구성된다.
특히 [익명의 요청](/docs/reference/access-authn-authz/authentication/#anonymous-requests) 
또는[서비스 어카운트 토큰](/docs/reference/access-authn-authz/authentication/#service-account-tokens)이 허용되는 경우,
하나 이상의 [권한 부여](/ko/docs/reference/access-authn-authz/authorization/) 형식을 
사용해야 한다.

노드는 유효한 클라이언트 자격 증명과 함께 API 서버에 안전하게 연결할 수 있도록 
클러스터에 대한 공개 루트 인증서(root certificate)로 프로비전해야 한다. 클라이언트 인증서(client certificate) 형식으로 
kubelet의 클라이언트 자격 증명을 사용하는 것은 좋은 방법이다.
kubelet 클라이언트 인증서(client certificate)의 자동 프로비저닝은
[kubelet TLS 부트스트랩](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)을 참고한다.

API 서버에 연결하려는 파드는 서비스 어카운트를 활용하여 안전하게
쿠버네티스가 공개 루트 인증서(root certificate)와 유효한 베어러 토큰(bearer token)을 파드가 인스턴스화될 때 
파드에 자동으로 주입할 수 있다.
`kubernetes` 서비스(`default` 네임스페이스의)는 API 서버의 HTTPS 엔드포인트로 리디렉션되는
가상 IP 주소(kube-proxy를 통해)로 구성되어 있다.

컨트롤 플레인 컴포넌트는 보안 포트를 통해 클러스터 API 서버와도 통신한다.

결과적으로, 노드 및 노드에서 실행되는 파드에서 컨트롤 플레인으로 연결하기 위한
기본 작동 모드는 기본적으로 보호되며 
신뢰할 수 없는 네트워크 및/또는 공용 네트워크에서 실행될 수 있다.

## 컨트롤 플레인에서 노드로의 통신

컨트롤 플레인(API 서버)에서 노드로는 두 가지 기본 통신 경로가 있다. 
첫 번째는 API 서버에서 클러스터의 각 노드에서 실행되는 kubelet 프로세스이다.
두 번째는 API 서버의 _프록시_ 기능을 통해 API 서버에서 모든 노드, 파드 또는 서비스에 
이르는 것이다.

### API 서버에서 kubelet으로의 통신

API 서버에서 kubelet으로의 연결은 다음의 용도로 사용된다.

* 파드에 대한 로그를 가져온다.
* 실행 중인 파드에 (보통의 경우 kubectl을 통해) 연결한다.
* kubelet의 포트-포워딩 기능을 제공한다.

위와 같은 연결은 kubelet의 HTTPS 엔드포인트에서 종료된다. 기본적으로, API 서버는 kubelet의 
제공(serving) 인증서를 확인하지 않는다. 이는 연결이 중간자 공격(man-in-the-middle)에 시달리게 하며,
신뢰할 수 없는 네트워크 및/또는 공용 네트워크에서 실행하기에 **안전하지 않다** .

이 연결을 확인하려면, `--kubelet-certificate-authority` 플래그를 사용하여
API 서버에 kubelet의 제공(serving) 인증서를 확인하는데 사용할 루트 인증서 번들을 제공한다.

이것이 가능하지 않은 경우, 신뢰할 수 없는 네트워크 또는 공용 네트워크를 통한 연결을 피하기 위해
필요한 경우, API 서버와 kubelet 간 [SSH 터널링](#ssh-터널)을
사용한다.


마지막으로, kubelet API를 보호하려면 
[Kubelet 인증 및/또는 인가](/ko/docs/reference/access-authn-authz/kubelet-authn-authz/)를 활성화해야 한다.

### API 서버에서 노드, 파드 및 서비스로의 통신

API 서버에서 노드, 파드 또는 서비스로의 연결은 기본적으로 일반 HTTP 연결로 연결되므로
인증되거나 암호화되지 않는다. 이 연결에서 URL을 노드, 파드 또는 서비스 이름에 접두어 `https:` 을 붙여
보안 HTTPS 연결이 되도록 실행할 수 있지만, HTTPS 엔드포인트가 제공한 인증서의 유효성을 검증하지 않으며
클라이언트 자격 증명도 제공하지 않는다. 
그래서 연결이 암호화되는 동안 그 어떤 무결성도 보장되지 않는다.
이러한 연결은 신뢰할 수 없는 네트워크 및/또는 공용 네트워크에서 실행하기에 **현재는 안전하지 않다** .

### SSH 터널

쿠버네티스는 SSH 터널을 지원하여 컨트롤 플레인에서 노드로의 통신 경로를 보호한다. 
이 구성에서, API 서버는 클러스터의 각 노드에 SSH 터널을 시작하고
(포트 22에서 수신 대기하는 ssh 서버에 연결) 터널을 통해 
kubelet, 노드, 파드 또는 서비스로 향하는 모든 트래픽을 전달한다.
이 터널은 노드가 실행 중인 네트워크의 외부로 트래픽이 
노출되지 않도록 한다.

{{< note >}}
SSH 터널은 현재 더 이상 사용되지 않으므로, 수행 중인 작업이 어떤 것인지 모른다면 사용하면 안 된다. 
[Konnectivity 서비스](#konnectivity-service)가 SSH 통신 채널을 
대체한다.
{{< /note >}}

### Konnectivity 서비스 {#konnectivity-service}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

SSH 터널을 대체로, Konnectivity 서비스는 컨트롤 플레인과 클러스터 간 통신에 TCP 레벨 프록시를 제공한다.
Konnectivity 서비스는 컨트롤 플레인 네트워크의 Konnectivity 서버와 
노드 네트워크의 Konnectivity 에이전트, 두 부분으로 구성된다.
Konnectivity 에이전트는 Konnectivity 서버에 대한 연결을 시작하고 
네트워크 연결을 유지한다.
Konnectivity 서비스를 활성화한 후, 모든 컨트롤 플레인에서 노드로의 트래픽은 
이 연결을 통과한다.

[Konnectivity 서비스 태스크](/ko/docs/tasks/extend-kubernetes/setup-konnectivity/)에 따라 
클러스터에서 Konnectivity 서비스를 설정한다.
