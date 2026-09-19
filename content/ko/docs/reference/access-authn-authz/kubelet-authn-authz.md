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
익명의 요청으로 처리되며, 사용자 이름은 `system:anonymous`,
그룹은 `system:unauthenticated`로 지정된다.

익명의 접근을 비활성화하고 인증되지 않은 요청에 `401 Unauthorized` 응답을 보내려면 다음을 수행한다.

* `--anonymous-auth=false` 플래그를 사용하여 kubelet을 시작

kubelet의 HTTPS 엔드포인트에 대한 X509 클라이언트 인증서 인증을 활성화하려면 다음을 수행한다.

* 클라이언트 인증서 검증하는 데 사용할 CA 번들을 `--client-ca-file` 플래그에 지정하여 kubelet을 시작
* `--kubelet-client-certificate` 및 `--kubelet-client-key` 플래그를 사용하여 API 서버를 시작
* 자세한 내용은 [API 서버 인증 문서](/docs/reference/access-authn-authz/authentication/#x509-client-certificates)를 참고

API 베어러(bearer) 토큰(서비스 어카운트 토큰 포함)을 kubelet의 HTTPS 엔드포인트 인증에 사용하려면 다음을 수행한다.

* API 서버에서 `authentication.k8s.io/v1` API 그룹이 활성화되어 있는지 확인
* `--authentication-token-webhook` 및 `--kubeconfig` 플래그를 사용하여 kubelet을 시작
* kubelet은 구성된 API 서버에서 `TokenReview` API를 호출하여 베어러 토큰에서 사용자 정보를 결정

## Kubelet 인가

성공적으로 인증된 모든 요청(익명 요청 포함)이 인가된다. 기본 인가 모드는 모든 요청을 허용하는 `AlwaysAllow` 이다.

kubelet API에 대한 접근을 세분화하는 데는 다양한 이유가 있다.

* 익명 인증이 활성화되어 있지만, 익명 사용자의 kubelet API 호출 권한은 제한되어야 하는 경우
* 베어러 토큰 인증이 활성화되어 있지만, 임의의 API 사용자(예: 서비스 어카운트)의 kubelet API 호출 권한은 제한되어야 하는 경우
* 클라이언트 인증서 인증이 활성화되어 있지만, 구성된 CA가 서명한 클라이언트 인증서 중 일부에만 kubelet API 사용을 허용해야 하는 경우

kubelet API에 대한 접근을 세분화하려면 API 서버에 인가를 위임한다.

* API 서버에서 `authorization.k8s.io/v1` API 그룹이 활성화되어 있는지 확인
* `--authorization-mode=Webhook` 및 `--kubeconfig` 플래그를 사용하여 kubelet을 시작
* kubelet은 구성된 API 서버에서 `SubjectAccessReview` API를 호출하여 각 요청의 인가 여부를 확인

kubelet은 API 서버와 동일한 [요청 속성](/docs/reference/access-authn-authz/authorization/#요청-속성-검토) 방식을 사용하여 API 요청을 인가한다.

동사는 들어오는 요청의 HTTP 동사로부터 결정된다.

HTTP 동사 | 요청 동사
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

리소스 및 하위 리소스는 들어오는 요청의 경로로부터 결정된다.

Kubelet API         | 리소스    | 하위 리소스
--------------------|----------|------------
/stats/\*           | nodes    | stats
/metrics/\*         | nodes    | metrics
/logs/\*            | nodes    | log
/spec/\*            | nodes    | spec
/checkpoint/\*      | nodes    | checkpoint
*그 외 모두*         | nodes    | proxy

<a name="get-nodes-proxy-warning"></a>
{{< warning >}}
`nodes/proxy` 권한은 다른 모든 kubelet API에 대한 접근 권한을 부여한다.
여기에는 노드에서 실행 중인 모든 컨테이너에서 명령을 실행하는 데 사용할 수 있는 API도 포함된다.

이러한 엔드포인트 중 일부는 HTTP `GET` 요청을 통해 웹소켓(WebSocket) 프로토콜을 지원하며, 이 요청은 **get** 동사로 인가된다.
즉, `nodes/proxy`에 대한 **get** 권한은 읽기 전용 권한이 아니며,
노드에서 실행 중인 모든 컨테이너에서 명령을 실행하는 것을 인가한다는 의미이다.
{{< /warning >}}

네임스페이스와 API 그룹 속성은 항상 빈 문자열이며,
리소스 이름은 항상 kubelet의 `Node` API 오브젝트 이름이다.

이 모드로 실행하는 경우, API 서버에 전달된 `--kubelet-client-certificate` 및 `--kubelet-client-key` 플래그로 식별되는 사용자가
다음 속성에 대해 인가되어 있는지 확인한다.

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

### 세분화된 인가

{{< feature-state feature_gate_name="KubeletFineGrainedAuthz" >}}

Kubelet은 `/pods`, `/runningPods`, `/configz`, `/healthz` 엔드포인트에 대해
먼저 세분화된 검사를 수행하며, 검사에 실패하면 하위 리소스인
`proxy`를 기준으로 다시 검사한다. 리소스와 하위 리소스는 들어오는 요청의
경로를 기준으로 결정된다.

Kubelet API   | 리소스    | 하위 리소스
--------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/pods         | nodes    | pods, proxy
/runningPods/ | nodes    | pods, proxy
/healthz      | nodes    | healthz, proxy
/configz      | nodes    | configz, proxy 
*그 외 모두*   | nodes    | proxy


`KubeletFineGrainedAuthz` 기능 게이트가 활성화된 경우, API 서버에 전달된
`--kubelet-client-certificate` 및 `--kubelet-client-key` 플래그로 식별되는 사용자가
다음 속성에 대해 인가되어 있는지 확인해야 한다.

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=metrics
* verb=\*, resource=nodes, subresource=configz
* verb=\*, resource=nodes, subresource=healthz
* verb=\*, resource=nodes, subresource=pods

[RBAC 인가](/docs/reference/access-authn-authz/rbac/)를 사용하는 경우,
이 게이트를 활성화하면 내장된 `system:kubelet-api-admin` ClusterRole도
위에서 언급한 모든 하위 리소스에 접근할 수 있는 권한을 갖도록 업데이트된다.

