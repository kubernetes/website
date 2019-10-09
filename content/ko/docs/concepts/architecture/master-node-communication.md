---
title: 마스터-노드 커뮤니케이션
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

이 문서는 마스터(실제 apiserver)와 쿠버네티스 클러스터 사이의 커뮤니케이션 경로를 나열해 본다.
그 목적은 사용자로 하여금 untrusted network(신뢰할 수 없는 네트워크) 상에서
(또는 클라우드 제공사업자 환경에서 완전히 공인 IP로) 동작될 수 있는
그러한 클러스터의 네트워크 구성을 강화하기 위해 사용자의 설치를 커스터마이즈 할 수 있도록 해주기 위함이다.

{{% /capture %}}


{{% capture body %}}

## 클러스터에서 마스터로

클러스터에서 마스터로의 모든 커뮤니케이션 경로는 apiserver에서 끝난다
(어떤 다른 마스터 컴포넌트도 원격 서비스를 노출하기 위해 설계되지 않는다).
전형적인 배포에서, apiserver는 하나 또는 그 이상의 클라이언트 [인증](/docs/reference/access-authn-authz/authentication/) 형태가
사용가능토록 하여 안전한 HTTPS 포트(443)를 통해 원격 연결에 대해 서비스 리슨하도록 구성된다.
특히 [익명의 요청](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
또는 [서비스 계정 토큰](/docs/reference/access-authn-authz/authentication/#service-account-tokens)이   
허용된 경우에는 하나 또는 그 이상의 [인가](/docs/reference/access-authn-authz/authorization/) 형태가 사용 가능해야만 한다.

노드는 유효한 클라이언트 자격증명과 함께 apiserver에 안전하게 접속할 수 있는
그런 클러스터용 공인 루트 인증서를 가지고 제공되어야 한다.
예를 들어, 기본 GKE 배포의 경우, kubelet에 제공되는 클라이언트 자격증명은
클라이언트 인증서의 형태로 존재한다. kubelet 클라이언트 인증서에 대한 자동화 프로비저닝에 대해서는
[kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)을 참고한다.

apiserver에 접속하려는 파드는 서비스 계정에 영향력을 발휘함으로써 안전하게
그리 행할 수 있으며 따라서 쿠버네티스는 인스턴스화 될 때 공인 루트 인증서와
유효한 베어러 토큰을 파드 속으로 자동 주입할 수 있게 된다.
(모든 네임스페이스 내) `kubernetes` 서비스는 apiserver 상의 HTTPS 엔드포인트로  
(kube-proxy를 통해) 리다이렉트 되는 가상 IP 주소를 가지고 구성된다.

마스터 컴포넌트는 또한 신뢰할 수 있는 포트를 통해 클러스터 apiserver와 소통한다.

결과적으로, 클러스터 (노드 그리고 노드에서 동작하는 파드)에서
마스터로의 기본 동작 모드는 기본적으로 안전하며
신뢰할 수 없는그리고/또는 공인 네트워크 상에서 동작할 수 있다.

## 마스터에서 클러스터로

마스터(apiserver)에서 클러스터로의 두 가지 주된 커뮤니케이션 경로가 존재한다.
첫 번째는 클러스터 내 각 노드를 동작시키는 apiserver에서 kubelet 프로세스로의
경로이다. 두 번째는 apiserver에서 apiserver의 프록시 기능을 통한 임의의 노드,
파드 또는 서비스로의 경로이다.

### apiserver에서 kubelet으로

apiserver에서 kubelet으로의 연결은 다음을 위해 이용된다.

  * 파드에 대한 로그 가져오기
  * 동작중인 파드에 (kubectl을 통해) 연관짓기
  * kubelet의 포트 포워딩 기능 제공하기

이 연결은 kubelet의 HTTPS 엔드포인트에서 끝난다. 기본적으로,
apiserver는 kubelet의 제공 인증서를 확인하지 않는데,
이는 연결에 대한 중간자 공격을 당하게 하고, 신뢰할 수 없는
그리고/또는 공인 네트워크에서 운영하기에는 **불안** 하게 만든다.  

이 연결을 확인하려면, apiserver에 kubelet의 제공 인증서 확인을 위해 사용하는
루트 인증서 번들로 `--kubelet-certificate-authority` 플래그를 이용한다

그것이 불가능한 경우, 신뢰할 수 없는 또는 공인 네트워크에 대한 연결을 피하고 싶다면,
apiserver와 kubelet 사이에 [SSH 터널링](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)을
사용한다.

마지막으로, kubelet API를 안전하게 하기 위해
[Kubelet 인증 그리고/또는 인가](/docs/admin/kubelet-authentication-authorization/)가 활성화 되어야만 한다.

### apiserver에서 노드, 파드, 그리고 서비스로

apiserver에서 노드, 파드, 또는 서비스로의 연결은 보통 HTTP 연결을
기본으로 하므로 인증도 암호화도 되지 않는다. API URL 내 노드, 파드, 또는 서비스 이름에
`https:` 프리픽스를 붙임으로써 안전한 HTTPS 연결로 동작될 수 있지만,
HTTPS 엔드포인트에 의해 제공되는 인증서를 확인하지 않으며
클라이언트 자격증명 또한 제공하지 않는다.
그래서 연결이 암호화될 동안, 어떠한 무결성도 제공되지 않을 것이다.
이러한 연결들은 신뢰할 수 없는 그리고/또는 공인 네트워크에서 동작하기에
**현재로서는 안전하지 않다**.

{{% /capture %}}
