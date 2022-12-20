---
# reviewers:
# - erictune
# - lavalamp
title: 쿠버네티스 API 접근 제어하기
content_type: concept
weight: 50
---

<!-- overview -->
이 페이지는 쿠버네티스 API에 대한 접근 제어의 개요를 제공한다.


<!-- body -->
사용자는 `kubectl`, 클라이언트 라이브러리
또는 REST 요청을 통해
[API에 접근한다](/ko/docs/tasks/access-application-cluster/access-cluster/).
사용자와 쿠버네티스 서비스 어카운트 모두 API에 접근할 수 있다.
요청이 API에 도달하면,
다음 다이어그램에 설명된 몇 가지 단계를 거친다.

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## 전송 보안

기본적으로 쿠버네티스 API 서버는 TLS에 의해 보호되는 첫번째 non-localhost 네트워크 인터페이스의 6443번 포트에서 수신을 대기한다. 일반적인 쿠버네티스 클러스터에서 API는 443번 포트에서 서비스한다. 포트번호는 `--secure-port` 플래그를 통해, 수신 대기 IP 주소는 `--bind-address` 플래그를 통해 변경될 수 있다.

API 서버는 인증서를 제시한다.
이러한 인증서는 사설 인증 기관(CA)에 기반하여 서명되거나, 혹은 공인 CA와 연결된 공개키 인프라스트럭처에 기반한다.
인증서와 그에 해당하는 개인키는 각각 `--tls-cert-file`과 `--tls-private-key-file` 플래그를 통해 지정한다.

만약 클러스터가 사설 인증 기관을 사용한다면,
해당 CA 인증서를 복사하여 클라이언트의 `~/.kube/config` 안에 구성함으로써
연결을 신뢰하고 누군가 중간에 가로채지 않았음을 보장해야 한다.

클라이언트는 이 단계에서 TLS 클라이언트 인증서를 제시할 수 있다.

## 인증

TLS가 설정되면 HTTP 요청이 인증 단계로 넘어간다.
이는 다이어그램에 **1**단계로 표시되어 있다.
클러스터 생성 스크립트 또는 클러스터 관리자는
API 서버가 하나 이상의 인증기 모듈을 실행하도록 구성한다.
인증기에 대해서는 
[인증](/docs/reference/access-authn-authz/authentication/)에서 더 자세히 서술한다.

인증 단계로 들어가는 것은 온전한 HTTP 요청이지만
일반적으로 헤더 그리고/또는 클라이언트 인증서를 검사한다.

인증 모듈은 클라이언트 인증서, 암호 및 일반 토큰, 부트스트랩 토큰,
JWT 토큰(서비스 어카운트에 사용됨)을 포함한다.

여러 개의 인증 모듈을 지정할 수 있으며,
이 경우 하나의 인증 모듈이 성공할 때까지 각 모듈을 순차적으로 시도한다.

요청을 인증할 수 없는 경우 HTTP 상태 코드 401과 함께 거부된다.
이 외에는 사용자가 특정 `username`으로 인증되며,
이 username은 다음 단계에서 사용자의 결정에 사용할 수 있다.
일부 인증기는 사용자 그룹 관리 기능을 제공하는 반면,
이외의 인증기는 그렇지 않다.

쿠버네티스는 접근 제어 결정과 요청 기록 시 `usernames`를 사용하지만,
`user` 오브젝트를 가지고 있지 않고 usernames 나 기타 사용자 정보를
오브젝트 저장소에 저장하지도 않는다.

## 인가

특정 사용자로부터 온 요청이 인증된 후에는 인가되어야 한다. 이는 다이어그램에 **2**단계로 표시되어 있다.

요청은 요청자의 username, 요청된 작업 및 해당 작업이 영향을 주는 오브젝트를 포함해야 한다. 기존 정책이 요청된 작업을 완료할 수 있는 권한이 해당 사용자에게 있다고 선언하는 경우 요청이 인가된다.

예를 들어 Bob이 아래와 같은 정책을 가지고 있다면 `projectCaribou` 네임스페이스에서만 파드를 읽을 수 있다.

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
Bob이 다음과 같은 요청을 하면 'projectCaribou' 네임스페이스의 오브젝트를 읽을 수 있기 때문에 요청이 인가된다.

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
Bob이 `projectCaribou` 네임스페이스에 있는 오브젝트에 쓰기(`create` 또는 `update`) 요청을 하면 그의 인가는 거부된다. 만약 Bob이 `projectFish`처럼 다른 네임스페이스의 오브젝트 읽기(`get`) 요청을 하면 그의 인가는 거부된다.

쿠버네티스 인가는 공통 REST 속성을 사용하여 기존 조직 전체 또는 클라우드 제공자 전체의 접근 제어 시스템과 상호 작용할 것을 요구한다. 이러한 제어 시스템은 쿠버네티스 API 이외의 다른 API와 상호작용할 수 있으므로 REST 형식을 사용하는 것이 중요하다.

쿠버네티스는 ABAC 모드, RBAC 모드, 웹훅 모드와 같은 여러 개의 인가 모듈을 지원한다. 관리자가 클러스터를 생성할 때 API 서버에서 사용해야 하는 인가 모듈을 구성했다. 인가 모듈이 2개 이상 구성되면 쿠버네티스가 각 모듈을 확인하고, 어느 모듈이 요청을 승인하면 요청을 진행할 수 있다. 모든 모듈이 요청을 거부하면 요청이 거부된다(HTTP 상태 코드 403).

인가 모듈을 사용한 정책 생성을 포함해 쿠버네티스 인가에 대해 더 배우려면 [인가 개요](/ko/docs/reference/access-authn-authz/authorization/)를 참조한다.


## 어드미션 제어

어드미션 제어 모듈은 요청을 수정하거나 거부할 수 있는 소프트웨어 모듈이다.
인가 모듈에서 사용할 수 있는 속성 외에도
어드미션 제어 모듈은 생성되거나 수정된 오브젝트 내용에 접근할 수 있다.

어드미션 컨트롤러는 오브젝트를 생성, 수정, 삭제 또는 (프록시에) 연결하는 요청에 따라 작동한다.
어드미션 컨트롤러는 단순히 오브젝트를 읽는 요청에는 작동하지 않는다.
여러 개의 어드미션 컨트롤러가 구성되면 순서대로 호출된다.

이는 다이어그램에 **3**단계로 표시되어 있다.

인증 및 인가 모듈과 달리,
어드미션 제어 모듈이 거부되면 요청은 즉시 거부된다.

어드미션 제어 모듈은 오브젝트를 거부하는 것 외에도
필드의 복잡한 기본값을 설정할 수 있다.

사용 가능한 어드미션 제어 모듈은 [여기](/docs/reference/access-authn-authz/admission-controllers/)에 서술되어 있다.

요청이 모든 어드미션 제어 모듈을 통과하면 유효성 검사 루틴을 사용하여 해당 API 오브젝트를 검증한 후
오브젝트 저장소에 기록(**4**단계)된다.

## 감사(Auditing)

쿠버네티스 감사는 클러스터에서 발생하는 일들의 순서를 문서로 기록하여, 보안과 관련되어 있고 시간 순서로 정리된 기록을 제공한다.
클러스터는 사용자, 쿠버네티스 API를 사용하는 애플리케이션, 그리고 컨트롤 플레인 자신이 생성한 활동을 감사한다.

더 많은 정보는 [감사](/ko/docs/tasks/debug/debug-cluster/audit/)를 참고한다.

## {{% heading "whatsnext" %}}

인증 및 인가 그리고 API 접근 제어에 대한 추가적인 문서는 아래에서 찾을 수 있다.

- [인증하기](/docs/reference/access-authn-authz/authentication/)
   - [부트스트랩 토큰(bootstrap token)으로 인증하기](/ko/docs/reference/access-authn-authz/bootstrap-tokens/)
- [어드미션 컨트롤러(admission controller)](/docs/reference/access-authn-authz/admission-controllers/)
   - [동적 어드미션(admission) 제어](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [인가](/ko/docs/reference/access-authn-authz/authorization/)
   - [역할 기반 접근 제어(role based access control)](/docs/reference/access-authn-authz/rbac/)
   - [속성 기반 접근 제어(attribute based access control)](/docs/reference/access-authn-authz/abac/)
   - [노드 인가](/docs/reference/access-authn-authz/node/)
   - [웹훅(webhook) 인가](/docs/reference/access-authn-authz/webhook/)
- [인증서 서명 요청(Certificate Signing Request)](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - [CSR 승인](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection) 및
     [인증서 서명](/docs/reference/access-authn-authz/certificate-signing-requests/#signing) 포함하기
- 서비스 어카운트
  - [개발자 가이드](/docs/tasks/configure-pod-container/configure-service-account/)
  - [운영](/ko/docs/reference/access-authn-authz/service-accounts-admin/)

또한, 다음 사항을 익힐 수 있다.
- 파드가 API 크리덴셜(credential)을 얻기 위해
  [시크릿(Secret)](/ko/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  을 사용하는 방법.
