---
# reviewers:
# - liggitt
title: Kubelet 인증/인가
weight: 110
---


## 개요

kubelet의 HTTPS 엔드포인트는 다양한 민감도의 데이터에 대한 접근을 제공하는 API를 노출하며,
노드와 컨테이너 내에서 다양한 수준의 권한으로 작업을 수행할 수 있도록 허용한다.

이 문서는 kubelet의 HTTPS 엔드포인트에 대한 접근을 인증하고 인가하는 방법을 설명한다.

## Kubelet 인증

기본적으로, 다른 구성의 인증 방법에 의해 거부되지 않은 kubelet의 HTTPS 엔드포인트에 대한 요청은
익명의 요청으로 처리되며, `system:anonymous`의 사용자 이름과 `system:unauthenticated`
의 그룹이 부여된다.

익명의 접근을 비활성화하고 인증되지 않은 요청에 `401 Unauthorized` 응답을 보내려면 아래를 참고한다.

* `--anonymous-auth=false` 플래그로 kubelet을 시작

kubelet의 HTTPS 엔드포인트에 대한 X509 클라이언트 인증서 인증을 활성화하려면 아래를 참고한다.

* `--client-ca-file` 플래그로 kubelet을 시작하면 클라이언트 인증서를 확인할 수 있는 CA 번들을 제공
* `--kubelet-client-certificate` 및 `--kubelet-client-key` 플래그로 apiserver를 시작
* 자세한 내용은 [apiserver 인증 문서](/docs/reference/access-authn-authz/authentication/#x509-client-certs)를 참고

API bearer 토큰(서비스 계정 토큰 포함)을 kubelet의 HTTPS 엔드포인트 인증에 사용하려면 아래를 참고한다.

* API 서버에서 `authentication.k8s.io/v1beta1` API 그룹이 사용 가능한지 확인
* `--authentication-token-webhook` 및 `--kubeconfig` 플래그로 kubelet을 시작
* kubelet은 구성된 API 서버의 `TokenReview` API를 호출하여 bearer 토큰에서 사용자 정보를 결정

## Kubelet 승인

성공적으로 인증된 모든 요청(익명 요청 포함)이 승인된다. 기본 인가 모드는 모든 요청을 허용하는 `AlwaysAllow` 이다.

kubelet API에 대한 접근을 세분화하는 데는 다양한 이유가 있다.

* 익명 인증을 사용할 수 있지만, 익명 사용자의 kubelet API 호출 기능은 제한되어야 함
* bearer 토큰 인증을 사용할 수 있지만, 임의의 API 사용자(API 계정)의 kubelet API 호출 기능은 제한되어야 함
* 클라이언트 인증을 사용할 수 있지만, 구성된 CA에서 서명한 일부 클라이언트 인증서만 kubelet API를 사용하도록 허용해야 함

kubelet API에 대한 접근을 세분화하려면 API 서버에 권한을 위임한다.

* `authorization.k8s.io/v1beta1` API 그룹이 API 서버에서 사용 가능한지 확인
* `--authorization-mode=Webhook` 및 `--kubeconfig` 플래그로 kubelet을 시작
* kubelet은 구성된 API 서버의 `SubjectAccessReview` API를 호출하여 각각의 요청이 승인되었는지 여부를 확인

kubelet은 API 요청을 apiserver와 동일한 [요청 속성](/ko/docs/reference/access-authn-authz/authorization/#요청-속성-검토) 접근 방식을 사용하여 승인한다.

동사는 들어오는 요청의 HTTP 동사로부터 결정된다.

HTTP 동사 | 요청 동사
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

리소스 및 하위 리소스는 들어오는 요청의 경로로부터 결정된다.

Kubelet API  | 리소스 | 하위 리소스
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
*all others* | nodes    | proxy

네임스페이스와 API 그룹 속성은 항상 빈 문자열이며,
리소스 이름은 항상 kubelet의 `Node` API 오브젝트 이름이다.

이 모드로 실행할 때, `--kubelet-client-certificate` 및 `--kubelet-client-key` 플래그로 식별된 사용자에게
다음 속성에 대한 권한이 있는지 확인한다.

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics
