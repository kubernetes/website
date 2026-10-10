---
title: 서비스 어카운트
description: >
  쿠버네티스 서비스어카운트 오브젝트에 대해 배운다.
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"  
content_type: concept
weight: 25
---

<!-- overview -->

이 페이지는 쿠버네티스 서비스어카운트(ServiceAccount) 오브젝트를 소개하면서, 서비스 어카운트의
동작 방식, 사용 사례, 제한 사항, 대안,
그리고 추가 안내를 위한 자료 링크에 대한 정보를 제공한다.

<!-- body -->

## 서비스 어카운트란 무엇인가? {#what-are-service-accounts}

서비스 어카운트란 사람이 사용하지 않는 계정으로, 쿠버네티스
클러스터 내에서 구분되는 신원을 제공한다. 애플리케이션 파드, 시스템
컴포넌트, 그리고 클러스터 내부와 외부의 엔티티들은 특정
서비스어카운트(ServiceAccount)의 자격 증명을 사용하여 해당 서비스어카운트(ServiceAccount)로 식별될 수 있다. 이러한 신원은
API 서버에 대한 인증이나 신원 기반의 보안 정책을 구현하는 등
다양한 상황에서 유용하다.

서비스 어카운트는 API 서버 내에서 서비스어카운트(ServiceAccount) 오브젝트로 존재한다. 서비스
어카운트는 다음과 같은 속성을 가진다.

* **네임스페이스 범위:** 각 서비스 어카운트는 쿠버네티스
  {{<glossary_tooltip text="네임스페이스" term_id="namespace">}}에 속한다. 모든 네임스페이스는
  생성될 때 [`default` 서비스어카운트(ServiceAccount)](#default-service-accounts)를 자동으로 가진다.

* **경량성:** 서비스 어카운트는 클러스터 내에 존재하며
  쿠버네티스 API에 의해 정의된다. 특정 작업을 수행할 수 있도록 서비스 어카운트를
  빠르게 생성할 수 있다.

* **이식성:** 복잡하게 컨테이너화된 워크로드의
  구성 번들에는 시스템 컴포넌트를 위한 서비스 어카운트 정의가 포함될 수 있다. 서비스 어카운트는
  가볍고 네임스페이스 단위로 구분되기 때문에
  이러한 구성을 손쉽게 다른 환경에서도 사용할 수 있다.

서비스 어카운트는 클러스터 내에서 인증된 사용자 계정인
유저 어카운트와는 다르다. 기본적으로, 유저 어카운트는 쿠버네티스 API 서버에 존재하지 않으며,
API 서버는 사용자 신원을 불투명한 데이터로
취급한다. 사용자 계정으로 인증하는 여러 가지 방법이 있다. 일부
쿠버네티스 버전은 API 서버에 유저 어카운트를 표현하기 위해 커스텀 확장 API를
추가하기도 한다.

{{< table caption="서비스 어카운트와 유저 비교" >}}

| 설명 | 서비스어카운트(ServiceAccount) | 유저 혹은 그룹 |
| --- | --- | --- |
| 위치 | 쿠버네티스 API 서비스어카운트 오브젝트(ServiceAccount object) | 외부 |
| 접근 제어 | 쿠버네티스 RBAC 또는 기타 [인가 메커니즘](/docs/reference/access-authn-authz/authorization/#authorization-modules) | 쿠버네티스 RBAC 또는 기타 신원 및 접근 관리 메커니즘 |
| 사용 목적 | 워크로드, 자동화 | 사람 |

{{< /table >}}

### 기본 서비스 어카운트 {#default-service-accounts}

클러스터를 생성하면, 쿠버네티스는 클러스터의 각 네임스페이스에 `default`라는 이름의 서비스어카운트(ServiceAccount)
오브젝트를 자동으로 생성한다. 각 네임스페이스의 `default`
서비스 어카운트는 역할 기반 접근 제어(RBAC)가 활성화된 경우 쿠버네티스가 모든 인증된 주체에게 부여하는
[기본 API 검색 권한](/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)
외에는 기본 권한을 가지지 않는다.
만약 특정 네임스페이스에서 `default` 서비스어카운트(ServiceAccount)를 삭제한다면,
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이
새로운 것으로 대체한다.

네임스페이스에 파드를 배포할 때,
[서비스어카운트(ServiceAccount)를 파드에 수동으로 할당](#assign-to-pod)하지 않으면, 쿠버네티스는
해당 네임스페이스의 `default` 서비스어카운트(ServiceAccount)를 파드에 자동으로 할당한다.

## 쿠버네티스 서비스 어카운트 사용 사례 {#use-cases}

일반적인 지침으로서 다음과 같은 상황에서 서비스 어카운트를 사용하여
신원을 부여할 수 있다.

* 파드가 쿠버네티스 API 서버와 통신해야 하는 경우, 예를 들어
  다음과 같은 상황이 있다.
  * 시크릿에 저장된 민감한 정보에 읽기 전용으로 접근하는 경우.
  * [네임스페이스 간 접근](#cross-namespace)을 허용하는 경우, 예를 들어
    `example` 네임스페이스의 파드가 `kube-node-lease` 네임스페이스의 리스(Lease) 오브젝트를
    read, list, 그리고 watch 할 수 있도록 하는 경우.
  * 파드가 외부의 서비스와 통신해야 하는 경우. 예를 들어,
    워크로드 파드가 상용 클라우드 API를 위한 신원이 필요하고,
    해당 상용 제공자가 적절한 신뢰 관계 구성을 허용하는 경우.
  * [`imagePullSecret`을 사용하여 프라이빗 이미지 레지스트리에 인증하는 경우](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
  * 외부 서비스가 쿠버네티스 API 서버와 통신해야 하는 경우. 예를
    들어, CI/CD 파이프라인의 일부로서 클러스터에 인증해야 하는 경우
  * 클러스터에서 서드파티 보안 소프트웨어를 사용하는 경우. 이 소프트웨어는
    다른 파드의 서비스어카운트(ServiceAccount) 신원에 의존하여 파드들을 서로 다른 컨텍스트로
    그룹화한다.

## 서비스 어카운트 사용 방법 {#how-to-use}

쿠버네티스 서비스 어카운트를 사용하려면, 다음을 따른다.

1. `kubectl`과 같은 쿠버네티스 클라이언트나 오브젝트를 정의한
   매니페스트를 사용하여 서비스어카운트(ServiceAccount) 오브젝트를 생성한다.
1. [RBAC](/docs/reference/access-authn-authz/rbac/)과
   같은 인가 매커니즘을 사용하여
   서비스어카운트(ServiceAccount) 오브젝트에 권한을 부여한다.
1. 파드를 생성할 때 서비스어카운트(ServiceAccount) 오브젝트를 파드에 할당한다.

   외부 서비스의 신원을 사용하는 경우,
   [서비스어카운트(ServiceAccount) 토큰을 가져와](#get-a-token) 해당 서비스에서
   대신 사용한다.
  
자세한 지침은,
[파드를 위한 서비스 어카운트 구성](/docs/tasks/configure-pod-container/configure-service-account/)을 참고한다.

### 서비스어카운트(ServiceAccount)에 대한 권한 부여 {#grant-permissions}

쿠버네티스에 내장된
[역할 기반 접근 제어(RBAC)](/docs/reference/access-authn-authz/rbac/)
매커니즘을 활용하면 각 서비스 어카운트에 필요한 최소한의 권한을 부여할 수 있다.
먼저 접근 권한을 정의하는 *role*을 생성하고, 이를 서비스어카운트(ServiceAccount)에
*바인딩*한다. RBAC을 사용하면 최소 권한 원칙에 따라
서비스 어카운트의 권한을 정의할 수 있다. 따라서 해당 서비스 어카운트를 사용하는 파드는
올바르게 동작하는 데 필요한 권한 이상을
가지지 않는다.

자세한 지침은
[서비스어카운트(ServiceAccount) 권한](/docs/reference/access-authn-authz/rbac/#service-account-permissions)을 참고한다.

#### 서비스어카운트(ServiceAccount)를 이용한 네임스페이스 간 접근 {#cross-namespace}

RBAC을 사용하면 하나의 네임스페이스에 있는 서비스 어카운트가 클러스터 내
다른 네임스페이스의 리소스에 대해 작업을 수행할 수 있도록 허용할 수 있다. 예를 들어, `dev` 네임스페이스에
서비스 어카운트와 파드가 있고 해당 파드가 `maintenance` 네임스페이스에서
실행 중인 잡(Job)을 확인하고 싶어하는 시나리오를 생각해보자. 이 경우
잡 오브젝트를 나열할 수 있는 권한을 부여하는 롤(Role) 오브젝트를 생성한다. 그리고,
`maintenance` 네임스페이스에서 해당 롤(Role)과 서비스어카운트(ServiceAccount) 오브젝트를 바인딩하는
롤바인딩(RoleBinding) 오브젝트를 생성한다. 이제, `dev` 네임스페이스의 파드는 해당 서비스 어카운트를 사용해
`maintenance` 네임스페이스의 잡 오브젝트를 나열할 수 있다.

#### 파드에 서비스어카운트(ServiceAccount) 할당하기 {#assign-to-pod}

파드에 서비스어카운트(ServiceAccount)를 할당하려면, 파드 명세에 `spec.serviceAccountName`
필드를 설정한다. 그러면 쿠버네티스는 해당 서비스어카운트(ServiceAccount)의
자격 증명을 자동으로 파드에 제공한다. v1.22 이상에서는, 쿠버네티스가
`TokenRequest` API를 사용하여 **자동으로 갱신되는** 단기 토큰을 발급받아 이를
[프로젝티드 볼륨](/docs/concepts/storage/projected-volumes/#serviceaccounttoken)으로
파드에 마운트한다.

기본적으로 쿠버네티스는 
`default` 서비스어카운트(ServiceAccount)든, 사용자가 지정한 커스텀 서비스어카운트(ServiceAccount)든
파드에 할당된 서비스어카운트(ServiceAccount)의 자격 증명을 제공한다.

특정 서비스어카운트(ServiceAccount)나 `default` 서비스어카운트(ServiceAccount)의 자격 증명이
자동으로 주입되지 않도록 하려면,
파드 명세에서 `automountServiceAccountToken` 필드를 `false`로 설정해야 한다.

<!-- 쿠버네티스 1.31이 릴리스된 이후에는 이 과거 버전에 대한 설명은 삭제해도 된다 -->

v1.22 이전 버전에서는, 쿠버네티스가 시크릿(Secret)을 통해 파드에 장기간 유효한 정적 토큰을
제공했었다.

#### 서비스어카운트(ServiceAccount) 자격 증명 수동으로 가져오기 {#get-a-token}

서비스어카운트(ServiceAccount)의 자격 증명을 API 서버가 아닌 다른 대상에서 사용하거나,
기본이 아닌 위치에 마운트해야 하는 경우에는 다음 방법 중
하나를 사용한다.

* [토큰리퀘스트 API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
  (권장): *애플리케이션 코드* 내에서 단기 서비스 어카운트
  토큰을 요청한다. 이 토큰은 자동으로 만료되며 만료 시
  갱신될 수 있다.
  쿠버네티스를 인식하지 못하는 레거시 애플리케이션이 있는 경우, 동일한
  파드 내에서 사이드카 컨테이너를 사용해 이러한 토큰을 가져와
  애플리케이션 워크로드에서 사용할 수 있도록 만들 수 있다.
* [토큰 볼륨 프로젝션](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
  (권장): 쿠버네티스 v1.20 이상에서는, 파드 명세를 사용하여
  kubelet이 서비스 어카운트 토큰을 파드에
  *프로젝티드 볼륨*으로 추가하도록 지정할 수 있다. 프로젝션된 토큰은 자동으로 만료되며, kubelet이
  만료 전에 토큰을 갱신한다.
* [서비스 어카운트 토큰 시크릿](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
  (권장하지 않음): 서비스 어카운트 토큰을 파드 내 쿠버네티스 시크릿에
  마운트할 수도 있다. 하지만 이 토큰들은 만료되지 않고 회전도 이루어지지 않는다. v1.24 이전 버전에서는, 각 서비스 어카운트마다 영구 토큰이 자동으로 생성되었다.
  정적이고 장기간 유효한 자격 증명과 관련된 보안 위험 때문에, 특히 규모가 큰 환경에서는
  이 방법을 더이상 권장하지 않는다. [LegacyServiceAccountTokenNoAutoGeneration 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates-removed)는
  (쿠버네티스 v1.24부터 v1.26까지 기본적으로 활성화되어 있었으며), 서비스 어카운트에 대해 이러한 토큰이 자동 생성되지
  않도록 했다. 해당 기능 게이트는 v1.27에서 GA로 승격되면서 제거되었고, 여전히 무기한의 서비스 어카운트 토큰을 수동으로 생성할 수 있지만, 반드시 보안상의 영향을 고려해야 한다.

{{< note >}}
쿠버네티스 클러스터 외부에서 실행되는 애플리케이션의 경우, 시크릿에 저장된
장기간 유효한 서비스어카운트(ServiceAccount) 토큰을 생성하는 방법을 고려할 수 있다. 이는 인증을 가능하게 하지만, 쿠버네티스 프로젝트에서는 이러한 접근 방식을 피할 것을 권장한다.
장기간 유효한 베어러(bearer) 토큰은 한 번 유출되면 악용될 수 있기 때문에
보안 위험을 초래한다. 대신 다른 방법을 고려해야 한다. 예를 들어, 외부
애플리케이션은 잘 보호된 개인키`와` 인증서를 사용해 인증하거나,
직접 구현한 [인증 웹훅](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)과 같은 커스텀 매커니즘을 사용할 수 있다.

또한 토큰리퀘스트를 사용하여 외부 애플리케이션에서 단기간 유효한 토큰을 발급받을 수 있다.
{{< /note >}}

### 시크릿에 대한 접근 제한 (사용 중단(deprecated)) {#enforce-mountable-secrets}

{{< feature-state for_k8s_version="v1.32" state="deprecated" >}}

{{< note >}}
`kubernetes.io/enforce-mountable-secrets`는 쿠버네티스 v1.32부터 더 이상 사용되지 않는다. 마운트된 시크릿에 대한 접근을 분리하려면 별도의 네임스페이스를 사용한다.
{{< /note >}}

쿠버네티스는 `kubernetes.io/enforce-mountable-secrets`라는 어노테이션을 제공하며
이를 서비스어카운트(ServiceAccount)에 추가할 수 있다. 이 어노테이션을 적용하면,
해당 서비스어카운트(ServiceAccount)의 시크릿은 지정된 유형의 리소스에만 마운트 될 수 있어,
클러스터의 보안 수준을 강화할 수 있다.

매니페스트를 사용해 서비스어카운트(ServiceAccount)에 이 어노테이션을 추가할 수 있다.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubernetes.io/enforce-mountable-secrets: "true"
  name: my-serviceaccount
  namespace: my-namespace
```
이 어노테이션을 "true"로 설정하면, 쿠버네티스 컨트롤 플레인은 해당
서비스어카운트(ServiceAccount)에서 사용하는 시크릿에 특정 마운트 제한을 적용한다.

1. 파드 안에서 볼륨으로 마운트되는 각 시크릿의 이름은 파드의 서비스어카운트(ServiceAccount)에 있는 `secret` 필드에
   반드시 명시되어야 한다.
1. 파드 안에서 `envFrom`을 사용해 참조하는 각 시크릿의 이름 또한 서비스어카운트(ServiceAccount)에 있는 `secret`
   필드에 반드시 명시되어야 한다.
1. 파드 안에서 `imagePullSecrets`으로 참조하는 각 시크릿의 이름 또한 서비스어카운트(ServiceAccount)에 있는 `secret`
   필드에 반드시 명시되어야 한다.

이러한 제한을 이해하고 적용함으로써, 클러스터 관리자는 보안 수준을 더 엄격하게 유지하고 시크릿이 적절한 리소스에서만 접근되도록 보장할 수 있다.

## 서비스 어카운트 자격 증명 인증 {#authenticating-credentials}

서비스어카운트(ServiceAccount)는 서명된 
{{<glossary_tooltip term_id="jwt" text="JSON Web Tokens">}}  (JWT)들을
사용해 쿠버네티스 API 서버와, 신뢰 관계가 설정된
다른 시스템에 인증한다. 어떻게 토큰이 발급되었는지
(`TokenRequest`를 통해 기간 제한을 두었는지 혹은 시크릿을 사용하는 
레거시 방식을 사용했는지)에 따라, 서비스어카운트(ServiceAccount) 토큰에는 만료 시간, 오디언스(audience),
그리고 토큰이 유효하기 *시작하는* 시간이 포함될 수 있다. 서비스어카운트(ServiceAccount)로
동작하는 클라이언트가 쿠버네티스 API 서버와 통신하려고 할 때,
해당 클라이언트는 HTTP 요청에 `Authorization: Bearer <token>` 헤더를
포함한다. API 서버는 다음과 같은 방식으로 해당 베어러 토큰의 유효성을 검사한다.

1. 토큰 서명을 확인한다.
1. 토큰이 만료되었는지 확인한다.
1. 토큰 클레임에 포함된 오브젝트 참조가 현재 유효한지 확인한다.
1. 토큰이 현재 시점에 유효한지 확인한다.
1. 오디언스 클레임을 확인한다.

`TokenRequest` API는 서비스어카운트(ServiceAccount)에 대해 _바운드 토큰_ 을 생성한다. 이 바인딩은
해당 서비스어카운트(ServiceAccount)로 동작하는 파드와 같이 클라이언트의 수명과
연결된다. 바운드 파드 서비스 어카운트 토큰의 JWT 스키마와 페이로드 예시는
[토큰 볼륨 프로젝션](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)을 참고한다.

`TokenRequest` API로 발급된 토큰의 경우, API 서버는 해당 서비스어카운트(ServiceAccount)를
사용 중인 특정 오브젝트 참조가 여전히 존재하는지도 확인하며,
이때 해당 오브젝트의 {{< glossary_tooltip term_id="uid" text="고유 ID" >}}를 기준으로
검사한다. 파드에 시크릿으로 마운트된 레거시 토큰에 대해서는, API 서버가
그 토큰을 시크릿과 대조해 확인한다.

인증 과정에 대한 더 자세한 정보는,
[인증](/docs/reference/access-authn-authz/authentication/#service-account-tokens)을 참고한다.

### 코드에서 서비스 어카운트 자격 증명 인증하기 {#authenticating-in-code}

자체 서비스에서 쿠버네티스 서비스
어카운트 자격 증명을 검증해야 하는 경우, 다음 방법을 사용할 수 있다.

* [TokenReview API](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)
  (권장)
* OIDC 디스커버리

쿠버네티스 프로젝트에서는 TokenReview API 사용을 권장한다. 왜냐하면
이 방법은 시크릿, 서비스어카운트(ServiceAccount), 파드나 노드와 같은
API 오브젝트에 바인딩된 토큰이 해당 오브젝트가 삭제될 때 무효화되도록 하기 때문이다. 예를 들어, 프로젝티드 서비스어카운트(projected ServiceAccount)
토큰을 포함하는 파드를 삭제하는 경우, 클러스터는
해당 토큰을 즉각적으로 무효화하고, TokenReview는 즉시 실패한다.
반면에 OIDC 검증을 사용하는 경우, 클라이언트는 토큰이 만료 시점에 도달할 때까지
계속 유효한 것으로 처리한다.

애플리케이션은 자신이 허용하는 오디언스를 항상 정의하고, 토큰의 오디언스가
애플리케이션이 기대하는 오디언스와 일치하는지
확인해야 한다. 이렇게 하면 토큰의 사용 범위를 최소화하여 해당 토큰이 오직 애플리케이션 내에서만 사용되고
다른 곳에서는 사용할 수 없도록 할 수 있다.

## 대안

* 다른 메커니즘을 사용해 자체적으로 토큰을 발급하고,
  [웹훅 토큰 인증](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)을 통해
  자체 검증 서비스를 사용하여 베어러 토큰을 검증한다.
* 파드에 자체적인 신원을 제공한다.
  * [SPIFFE CSI 드라이버 플러그인을 사용하여 파드에 SPIFFE SVIDs를 X.509 인증서 쌍으로 제공](https://cert-manager.io/docs/projects/csi-driver-spiffe/).
    {{% thirdparty-content single="true" %}}
  * [Istio와 같은 서비스 메시를 사용하여 파드에 인증서를 제공](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/).
* 서비스 어카운트 토큰을 사용하지 않고 클러스터 외부에서 API 서버에 인증한다.
  * [API 서버가 신원 제공자의 OpenID Connect(OIDC) 토큰을 수락하도록 구성](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
  * 클라우드 제공자와 같이, 외부 ID 및 접근 관리(IAM) 서비스를
    사용해 생성된 서비스 어카운트나 사용자 계정을 이용해,
    클러스터에 인증한다.
  * [CertificateSigningRequest API를 클라이언트 인증서와 함께 사용](/docs/tasks/tls/managing-tls-in-a-cluster/).
* [kubelet이 이미지 레지스트리에서 자격 증명을 가져오도록 구성](/docs/tasks/administer-cluster/kubelet-credential-provider/).
* 가상 플랫폼 모듈(TPM)에 접근하기 위해 디바이스 플러그인을 사용하고,
  이를 통해 개인키를 사용한 인증을 허용한다.

## {{% heading "whatsnext" %}}

* [클러스터 관리자 권한으로 서비스어카운트(ServiceAccount) 관리하기](/docs/reference/access-authn-authz/service-accounts-admin/)에 대해 배우기.
* [파드에 서비스어카운트(ServiceAccount) 할당하기](/docs/tasks/configure-pod-container/configure-service-account/)에 대해 배우기.
* [서비스어카운트(ServiceAccount) API 레퍼런스](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/)에 대해 읽기.
