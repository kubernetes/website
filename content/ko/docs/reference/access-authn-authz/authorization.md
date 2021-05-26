---
title: 인가 개요
content_type: concept
weight: 60
---

<!-- overview -->
지원되는 인가 모듈을 사용하여 정책을 만드는 방법을 포함한
쿠버네티스 인가에 대해 자세히 알아보자.


<!-- body -->
쿠버네티스에서는 사용자의 요청이 인가(접근 권한을 부여) 받기 전에 사용자가 인증(로그인)되어야 한다.
인증에 대한 자세한 내용은 [쿠버네티스 API 접근 제어하기](/ko/docs/concepts/security/controlling-access/)를
참고한다.

쿠버네티스는 REST API 요청에 공통적인 속성을 요구한다.
이는 쿠버네티스 인가가 쿠버네티스 API 이외에 다른 API를 처리할 수 있는
기존 조직 전체 또는 클라우드 제공자 전체의 접근 제어 시스템과
연동된다는 것을 의미한다.

## 요청 허용 또는 거부 결정
쿠버네티스는 API 서버를 이용하여 API 요청을 인가한다.
모든 정책과 비교하여 모든 요청 속성을 평가하고 요청을 허용하거나 거부한다.
계속 진행하려면 API 요청의 모든 부분이 일부 정책에 의해 반드시 허용되어야 한다.
이는 기본적으로 승인이 거부된다는 것을 의미한다.

(쿠버네티스는 API 서버를 사용하지만,
특정 오브젝트의 특정 필드에 의존하는 접근 제어 및 정책은
어드미션 컨트롤러에 의해 처리된다.)

여러 개의 인가 모듈이 구성되면 각 모듈이 순서대로 확인된다.
어느 인가 모듈이 요청을 승인하거나 거부할 경우, 그 결정은 즉시 반환되며 다른 인가 모듈이 참고되지 않는다.
모든 모듈에서 요청에 대한 평가가 없으면 요청이 거부된다.
요청 거부는 HTTP 상태 코드 403을 반환한다.

## 요청 속성 검토
쿠버네티스는 다음 API 요청 속성만 검토한다.

 * **user** - 인증 중에 제공된 `user` 문자열.
 * **group** - 인증된 사용자가 속한 그룹 이름 목록.
 * **extra** - 인증 계층에서 제공하는 문자열 값에 대한 임의의 문자열 키 맵.
 * **API** - 요청이 API 리소스에 대한 것인지 여부.
 * **Request path** - `/api` 또는 `/healthz`와 같이 다양한 리소스가 아닌 엔드포인트의 경로.
 * **API request verb** - `get`, `list`, `create`, `update`, `patch`, `watch`, `delete`, `deletecollection`과 같은 리소스 요청에 사용하는 API 동사. 리소스 API 엔드포인트의 요청 동사를 결정하려면 [요청 동사 결정](/ko/docs/reference/access-authn-authz/authorization/#요청-동사-결정)을 참고한다.
 * **HTTP request verb** - `get`, `post`, `put`, `delete`처럼 소문자 HTTP 메서드는 리소스가 아닌 요청에 사용한다.
 * **Resource** - 접근 중인 리소스의 ID 또는 이름(리소스 요청만 해당) -- `get`, `update`, `patch`, `delete` 동사를 사용하는 리소스 요청의 경우 리소스 이름을 지정해야 한다.
 * **Subresource** - 접근 중인 하위 리소스(리소스 요청만 해당).
 * **Namespace** - 접근 중인 오브젝트의 네임스페이스(네임스페이스에 할당된 리소스 요청만 해당)
 * **API group** - 접근 중인 {{< glossary_tooltip text="API 그룹" term_id="api-group" >}}(리소스 요청에만 해당). 빈 문자열은 _핵심(core)_ [API 그룹](/ko/docs/reference/using-api/#api-그룹)을 지정한다.

## 요청 동사 결정

**리소스가 아닌 요청**
`/api/v1/...` 또는 `/apis/<group>/<version>/...` 이외에 다른 엔드포인트에 대한 요청은
"리소스가 아닌 요청"으로 간주되며, 요청의 소문자 HTTP 메서드를 동사로 사용한다.
예를 들어, `/api` 또는 `/healthz`와 같은 엔드포인트에 대한 `GET` 요청은 `get`을 동사로 사용할 것이다.

**리소스 요청**
리소스 API 엔드포인트에 대한 요청 동사를 결정하려면
사용된 HTTP 동사와 해당 요청이 개별 리소스 또는 리소스 모음에 적용되는지 여부를
검토한다.

HTTP 동사 | 요청 동사
----------|---------------
POST      | create
GET, HEAD | get(개별 리소스), list(전체 오브젝트 내용을 포함한 리소스 모음), watch(개별 리소스 또는 리소스 모음을 주시)
PUT       | update
PATCH     | patch
DELETE    | delete(개별 리소스), deletecollection(리소스 모음)

쿠버네티스는 종종 전문 동사를 사용하여 부가적인 권한 인가를 확인한다. 예를 들면,

* [파드시큐리티폴리시(PodSecurityPolicy)](/ko/docs/concepts/policy/pod-security-policy/)
  * `policy` API 그룹의 `podsecuritypolicies` 리소스에 대한 `use` 동사.
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * `rbac.authorization.k8s.io` API 그룹의 `roles` 및 `clusterroles` 리소스에 대한 `bind` 동사.
* [인증](/docs/reference/access-authn-authz/authentication/)
  * 핵심 API 그룹의 `users`, `groups`, `serviceaccounts`와 `authentication.k8s.io` API 그룹의 `userextras` 동사.

## 인가 모드 {#authorization-modules}

쿠버네티스 API 서버는 몇 가지 인가 모드 중 하나를 사용하여 요청을 승인할 수 있다.

 * **Node** - 실행되도록 스케줄된 파드에 따라 kubelet에게 권한을 부여하는 특수 목적 인가 모드. Node 인가 모드 사용에 대한 자세한 내용은 [Node 인가](/docs/reference/access-authn-authz/node/)을 참조한다.
 * **ABAC** - 속성 기반 접근 제어 (ABAC, Attribute-based access control)는 속성과 결합한 정책의 사용을 통해 사용자에게 접근 권한을 부여하는 접근 제어 패러다임을 말한다. 이 정책은 모든 유형의 속성(사용자 속성, 리소스 속성, 오브젝트, 환경 속성 등)을 사용할 수 있다. ABAC 모드 사용에 대한 자세한 내용은 [ABAC 모드](/docs/reference/access-authn-authz/abac/)를 참조한다.
 * **RBAC** - 역할 기반 접근 제어(RBAC, Role-based access control)는 기업 내 개별 사용자의 역할을 기반으로 컴퓨터나 네트워크 리소스에 대한 접근을 규제하는 방식이다. 이 맥락에서 접근은 개별 사용자가 파일을 보거나 만들거나 수정하는 것과 같은 특정 작업을 수행할 수 있는 능력이다. RBAC 모드 사용에 대한 자세한 내용은 [RBAC 모드](/docs/reference/access-authn-authz/rbac/)를 참조한다.
   * 지정된 RBAC(역할 기반 접근 제어)이 인가 결정을 위해 `rbac.authorization.k8s.io` API 그룹을 사용하면, 관리자가 쿠버네티스 API를 통해 권한 정책을 동적으로 구성할 수 있다.
   * RBAC을 활성화하려면 `--authorization-mode=RBAC`로 API 서버를 시작한다.
 * **Webhook** - WebHook은 HTTP 콜백이다(어떤 일이 일어날 때 발생하는 HTTP POST와 HTTP POST를 통한 간단한 이벤트 알림). WebHook을 구현하는 웹 애플리케이션은 특정한 일이 발생할 때 URL에 메시지를 POST 할 것이다. Webhook 모드 사용에 대한 자세한 내용은 [Webhook 모드](/docs/reference/access-authn-authz/webhook/)를 참조한다.

#### API 접근 확인

`kubectl`은 API 인증 계층을 신속하게 쿼리하기 위한 "auth can-i" 하위 명령어를 제공한다.
이 명령은 현재 사용자가 지정된 작업을 수행할 수 있는지 여부를 알아내기 위해 `SelfSubjectAccessReview` API를 사용하며,
사용되는 인가 모드에 관계없이 작동한다.


```bash
kubectl auth can-i create deployments --namespace dev
```

다음과 유사하게 출력된다.

```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```

다음과 유사하게 출력된다.

```
no
```

관리자는 이를 [사용자 가장(impersonation)](/docs/reference/access-authn-authz/authentication/#user-impersonation)과
병행하여 다른 사용자가 수행할 수 있는 작업을 결정할 수 있다.

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```

다음과 유사하게 출력된다.

```
no
```

`SelfSubjectAccessReview`는 `authorization.k8s.io` API 그룹의 일부로서
API 서버 인가를 외부 서비스에 노출시킨다.
이 그룹의 기타 리소스에는 다음이 포함된다.

* `SubjectAccessReview` - 현재 사용자뿐만 아니라 모든 사용자에 대한 접근 검토. API 서버에 인가 결정을 위임하는 데 유용하다. 예를 들어, kubelet 및 확장(extension) API 서버는 자신의 API에 대한 사용자 접근을 결정하기 위해 해당 리소스를 사용한다.
* `LocalSubjectAccessReview` - `SubjectAccessReview`와 비슷하지만 특정 네임스페이스로 제한된다.
* `SelfSubjectRulesReview` - 사용자가 네임스페이스 안에서 수행할 수 있는 작업 집합을 반환하는 검토. 사용자가 자신의 접근을 빠르게 요약해서 보거나 UI가 작업을 숨기거나 표시하는 데 유용하다.

이러한 API는 반환된 오브젝트의 응답 "status" 필드가 쿼리의 결과인
일반 쿠버네티스 리소스를 생성하여 쿼리할 수 있다.

```bash
kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    verb: create
    namespace: dev
EOF
```

생성된 `SelfSubjectAccessReview` 는 다음과 같다.
```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

## 인가 모듈에 플래그 사용

정책에 포함된 인가 모듈을 나타내기 위해
정책에 플래그를 포함시켜야 한다.

다음 플래그를 사용할 수 있다.

  * `--authorization-mode=ABAC` 속성 기반 접근 제어(ABAC) 모드를 사용하면 로컬 파일을 사용하여 정책을 구성할 수 있다.
  * `--authorization-mode=RBAC` 역할 기반 접근 제어(RBAC) 모드를 사용하면 쿠버네티스 API를 사용하여 정책을 만들고 저장할 수 있다.
  * `--authorization-mode=Webhook` WebHook은 원격 REST 엔드포인트를 사용하여 인가를 관리할 수 있는 HTTP 콜백 모드다.
  * `--authorization-mode=Node` 노드 인가는 kubelet이 생성한 API 요청을 특별히 인가시키는 특수 목적 인가 모드다.
  * `--authorization-mode=AlwaysDeny` 이 플래그는 모든 요청을 차단한다. 이 플래그는 테스트에만 사용한다.
  * `--authorization-mode=AlwaysAllow` 이 플래그는 모든 요청을 허용한다. API 요청에 대한 인가가 필요하지 않은 경우에만 이 플래그를 사용한다.

하나 이상의 인가 모듈을 선택할 수 있다. 모듈이 순서대로 확인되기 때문에
우선 순위가 더 높은 모듈이 요청을 허용하거나 거부할 수 있다.

## 파드 생성을 통한 권한 확대

네임스페이스에서 파드를 생성할 수 있는 권한을 가진 사용자는
해당 네임스페이스 안에서 자신의 권한을 확대할 가능성이 있다.
네임스페이스에서 자신의 권한에 접근할 수 있는 파드를 만들 수 있다.
사용자가 스스로 읽을 수 없는 시크릿에 접근할 수 있는 파드나
서로 다른/더 큰 권한을 가진 서비스 어카운트로 실행되는 파드를 생성할 수 있다.

{{< caution >}}
시스템 관리자는 파드 생성에 대한 접근 권한을 부여할 때 주의한다.
네임스페이스에서 파드(또는 파드를 생성하는 컨트롤러)를 생성할 수 있는 권한을 부여받은 사용자는
네임스페이스의 모든 시크릿을 읽을 수 있으며 네임스페이스의 모든 컨피그 맵을 읽을 수 있고
네임스페이스의 모든 서비스 어카운트를 가장하고 해당 어카운트가 취할 수 있는 모든 작업을 취할 수 있다.
이는 인가 모드에 관계없이 적용된다.
{{< /caution >}}


## {{% heading "whatsnext" %}}

* 인증에 대한 자세한 내용은 [쿠버네티스 API 접근 제어하기](/ko/docs/concepts/security/controlling-access/)에서 **인증** 을 참조한다.
* 어드미션 제어에 대한 자세한 내용은 [어드미션 컨트롤러 사용하기](/docs/reference/access-authn-authz/admission-controllers/)를 참조한다.
