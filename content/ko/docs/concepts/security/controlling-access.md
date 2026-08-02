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
사용자는 `kubectl`, 클라이언트 라이브러리 또는 REST 요청을 통해
[쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)에 접근한다. 사용자와
[쿠버네티스 서비스 어카운트](/docs/tasks/configure-pod-container/configure-service-account/) 모두
API 접근 권한을 부여받을 수 있다.
요청이 API에 도달하면 아래 다이어그램에 표시된 것처럼 여러 단계를
거친다.

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## 전송 보안

기본적으로 쿠버네티스 API 서버는 로컬 호스트가 아닌 첫 번째 네트워크 인터페이스의 6443 포트에서 수신 대기하며,
TLS로 보호된다. 일반적인 프로덕션 쿠버네티스 클러스터에서
API는 443 포트에서 서비스된다. 포트는 `--secure-port` 플래그로,
수신 대기 IP 주소는 `--bind-address` 플래그로 변경할 수 있다.

API 서버는 인증서를 제시한다. 이 인증서는 사설 인증 기관(CA)을 사용하여
서명되거나, 공인 CA와 연결된 공개키 인프라스트럭처에 기반한다.
인증서와 그에 해당하는 개인키는
`--tls-cert-file`과 `--tls-private-key-file` 플래그를 사용하여 설정할 수 있다.

클러스터에서 사설 인증 기관을 사용하는 경우, 해당 CA 인증서의 사본을
클라이언트의 ~/.kube/config에 구성해야 한다. 그래야
연결을 신뢰하고 누군가 중간에서 연결을 가로채지 않았음을 확신할 수 있다.

클라이언트는 이 단계에서 TLS 클라이언트 인증서를 제시할 수 있다.

## 인증

TLS가 설정되면 HTTP 요청이 인증 단계로 넘어간다.
이는 다이어그램에 **1**단계로 표시되어 있다.
클러스터 생성 스크립트 또는 클러스터 관리자는 API 서버가
하나 이상의 인증 모듈을 실행하도록 구성한다.
인증자에 대해서는 
[인증](/docs/reference/access-authn-authz/authentication/)에서 더 자세히 설명한다.

인증 단계의 입력은 전체 HTTP 요청이지만, 일반적으로
헤더 그리고/또는 클라이언트 인증서를 검사한다.

인증 모듈은 클라이언트 인증서, 암호 및 일반 토큰,
부트스트랩 토큰, JSON 웹 토큰(서비스 어카운트에 사용됨)을 포함한다.

여러 개의 인증 모듈을 지정할 수 있으며, 이 경우
인증 모듈 중 하나가 성공할 때까지 각 모듈을 순차적으로 시도한다.

요청을 인증할 수 없는 경우 HTTP 상태 코드 401과 함께 거부된다.
그렇지 않으면 사용자가 특정 `username`으로 인증되며, 사용자 이름은
후속 단계에서 결정을 내리는 데 사용될 수 있다. 일부 인증자는
사용자가 속한 그룹도 제공하지만, 다른 인증자는
제공하지 않는다.

쿠버네티스는 접근 제어 결정과 요청 기록 시 사용자 이름을 사용하지만,
`User` 오브젝트를 가지고 있지 않고 API에 사용자 이름이나 기타 사용자 정보를
저장하지도 않는다.

## 인가

특정 사용자로부터 온 요청임이 인증된 후에는
요청이 인가되어야 한다. 이는 다이어그램에 **2**단계로 표시되어 있다.

요청은 요청자의 사용자 이름, 요청된 작업 및
해당 작업이 영향을 주는 오브젝트를 포함해야 한다. 기존 정책이
요청된 작업을 완료할 권한이 해당 사용자에게 있다고 선언하는 경우 요청이 인가된다.

예를 들어, Bob이 아래와 같은 정책을 가지고 있다면 `projectCaribou` 네임스페이스에서만 파드를 읽을 수 있다.

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

Bob이 다음과 같은 요청을 하면 `projectCaribou` 네임스페이스의 오브젝트를 읽을 권한이
있기 때문에 요청이 인가된다.

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

Bob이 `projectCaribou` 네임스페이스의 오브젝트에 쓰기(`create` 또는 `update`) 요청을
하면 인가가 거부된다. Bob이 `projectFish`와 같은 다른 네임스페이스의 오브젝트에
읽기(`get`) 요청을 하면 인가가 거부된다.

쿠버네티스 인가는 공통 REST 속성을 사용하여
기존 조직 전체 또는 클라우드 제공자 전체의 접근 제어 시스템과 상호 작용해야 한다.
이러한 제어 시스템은 쿠버네티스 API 이외의 다른 API와도
상호 작용할 수 있으므로 REST 형식을 사용하는 것이 중요하다.

쿠버네티스는 ABAC 모드, RBAC 모드, 웹훅 모드와 같은
여러 개의 인가 모듈을 지원한다. 관리자가 클러스터를 생성할 때 API 서버에서
사용해야 하는 인가 모듈을 구성한다. 인가 모듈이 2개 이상
구성되면, 쿠버네티스가 각 모듈을 확인하고, 어느 하나의
모듈이라도 요청을 인가하면 요청을 계속 처리할 수 있다. 모든 모듈이
요청을 거부하면 요청이 거부된다(HTTP 상태 코드 403).

지원되는 인가 모듈을 사용한 정책 생성에 대한 자세한 내용을 포함해
쿠버네티스 인가에 대해 더 알아보려면 [인가 개요](/docs/reference/access-authn-authz/authorization/)를 참조한다.

## 어드미션 제어

어드미션 제어 모듈은 요청을 수정하거나 거부할 수 있는 소프트웨어 모듈이다.
인가 모듈이 사용할 수 있는 속성 외에도
어드미션 제어 모듈은 생성되거나 수정되는 오브젝트의 내용에 접근할 수 있다.

어드미션 컨트롤러는 오브젝트를 생성, 수정, 삭제 또는 연결(프록시)하는 요청에 대해 작동한다.
어드미션 컨트롤러는 단순히 오브젝트를 읽는 요청에는 작동하지 않는다.
여러 개의 어드미션 컨트롤러가 구성되면 순서대로 호출된다.

이는 다이어그램에 **3**단계로 표시되어 있다.

인증 및 인가 모듈과 달리, 어드미션 컨트롤러 모듈 중 하나라도 요청을
거부하면 해당 요청은 즉시 거부된다.

어드미션 컨트롤러는 오브젝트를 거부하는 것 외에도 필드의 복잡한 기본값을 설정
할 수 있다.

사용 가능한 어드미션 제어 모듈은 [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)에서 설명한다.

요청이 모든 어드미션 컨트롤러를 통과하면 해당 API 오브젝트의 유효성 검사 루틴을 사용하여
검증한 후, 오브젝트 저장소에 기록(**4**단계로 표시되어 있다)된다.

## 감사

쿠버네티스 감사는 클러스터에서 발생한 작업의 순서를 기록한, 보안과 관련되고 시간순으로 정리된 기록을 제공한다.
클러스터는 사용자, 쿠버네티스 API를 사용하는 애플리케이션, 그리고 컨트롤 플레인 자체가 생성한 활동을 감사한다.

더 많은 정보는 [감사](/docs/tasks/debug/debug-cluster/audit/)를 참고한다.

## {{% heading "whatsnext" %}}

인증, 인가 및 API 접근 제어에 대한 자세한 내용은 다음 문서를 참고한다.

- [인증](/docs/reference/access-authn-authz/authentication/)
   - [부트스트랩 토큰을 사용한 인증](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)
   - [동적 어드미션 제어](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [인가](/docs/reference/access-authn-authz/authorization/)
   - [역할 기반 접근 제어](/docs/reference/access-authn-authz/rbac/)
   - [속성 기반 접근 제어](/docs/reference/access-authn-authz/abac/)
   - [노드 인가](/docs/reference/access-authn-authz/node/)
   - [웹훅 인가](/docs/reference/access-authn-authz/webhook/)
- [인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - [CSR 승인](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection) 및
     [인증서 서명](/docs/reference/access-authn-authz/certificate-signing-requests/#signing) 포함
- 서비스 어카운트
  - [개발자 가이드](/docs/tasks/configure-pod-container/configure-service-account/)
  - [관리](/docs/reference/access-authn-authz/service-accounts-admin/)

다음에 대해 알아볼 수 있다.
- 파드가 API 자격증명을 얻기 위해
  [시크릿](/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  을 사용하는 방법
