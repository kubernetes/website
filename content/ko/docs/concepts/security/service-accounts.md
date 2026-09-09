---
title: 서비스 어카운트
description: >
  쿠버네티스의 서비스어카운트(ServiceAccount) 오브젝트에 대해 알아본다.
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"
content_type: concept
weight: 25
---

<!-- overview -->

이 페이지는 쿠버네티스의 서비스어카운트 오브젝트를 소개하고,
서비스 어카운트의 동작 방식, 유스케이스, 제한 사항,
대안 및 추가 지침을 위한 자료 링크를 제공한다.

<!-- body -->

## 서비스 어카운트란? {#what-are-service-accounts}

서비스 어카운트는 사람이 아닌 주체를 위한 계정 유형으로, 쿠버네티스
클러스터에서 구별되는 신원을 제공한다. 애플리케이션 파드, 시스템
컴포넌트, 클러스터 내부와 외부의 주체는 특정 서비스어카운트의
자격 증명을 사용하여 해당 서비스어카운트로 자신을 식별할 수 있다. 이 신원은
API 서버에 대한 인증이나 신원 기반 보안 정책 구현을 비롯한
여러 상황에서 유용하다.

서비스 어카운트는 API 서버에 서비스어카운트 오브젝트로 존재한다. 서비스
어카운트에는 다음과 같은 특성이 있다.

* **네임스페이스 범위:** 각 서비스 어카운트는 쿠버네티스
  {{<glossary_tooltip text="네임스페이스" term_id="namespace">}}에 바인딩된다. 모든 네임스페이스에는
  생성 시 [`default` 서비스어카운트](#default-service-accounts)가 생긴다.

* **경량:** 서비스 어카운트는 클러스터 내에 존재하며
  쿠버네티스 API에 정의된다. 특정 작업을 수행할 수 있도록
  서비스 어카운트를 빠르게 생성할 수 있다.

* **이식 가능:** 복잡한 컨테이너화된 워크로드의 구성 묶음에는
  시스템 컴포넌트의 서비스 어카운트 정의가 포함될 수 있다.
  서비스 어카운트의 경량 특성과 네임스페이스에 속하는 신원 덕분에
  구성을 이식할 수 있다.

서비스 어카운트는 클러스터에서 인증된 사람을 나타내는 사용자 계정과
다르다. 기본적으로 사용자 계정은 쿠버네티스 API 서버에 존재하지
않으며, 대신 API 서버는 사용자 신원을 의미를 해석하지 않는
데이터로 처리한다. 여러 방법으로 사용자 계정으로 인증할 수 있다. 일부
쿠버네티스 배포판은 API 서버에서 사용자 계정을 나타내기 위해
사용자 정의 확장 API를 추가할 수 있다.

{{< table caption="서비스 어카운트와 사용자 비교" >}}

| 설명 | 서비스어카운트 | 사용자 또는 그룹 |
| --- | --- | --- |
| 위치 | 쿠버네티스 API(서비스어카운트 오브젝트) | 외부 |
| 접근 제어 | 쿠버네티스 RBAC 또는 기타 [인가 메커니즘](/docs/reference/access-authn-authz/authorization/#authorization-modules) | 쿠버네티스 RBAC 또는 기타 신원 및 접근 관리 메커니즘 |
| 용도 | 워크로드, 자동화 | 사람 |

{{< /table >}}

### 기본 서비스 어카운트 {#default-service-accounts}

클러스터를 생성하면 쿠버네티스는 클러스터의 모든 네임스페이스에 `default`라는
서비스어카운트 오브젝트를 자동으로 생성한다. 각 네임스페이스의 `default`
서비스 어카운트에는 역할 기반 접근 제어(RBAC)가 활성화된 경우 쿠버네티스가 인증된 모든 주체에
부여하는 [기본 API 디스커버리 권한](/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)
외에는 기본적으로 아무런 권한도 없다.
네임스페이스의 `default` 서비스어카운트 오브젝트를 삭제하면,
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이
새 오브젝트로 대체한다.

네임스페이스에 파드를 배포할 때
[서비스어카운트를 파드에 수동으로 할당](#assign-to-pod)하지 않으면, 쿠버네티스는
해당 네임스페이스의 `default` 서비스어카운트를 파드에 할당한다.

## 쿠버네티스 서비스 어카운트의 유스케이스 {#use-cases}

일반적인 지침으로, 다음과 같은 상황에서 서비스 어카운트를 사용하여
신원을 제공할 수 있다.

* 파드가 쿠버네티스 API 서버와 통신해야 하는 경우. 예를 들어
  다음과 같은 상황이 있다.
  * 시크릿(Secret)에 저장된 민감한 정보에 대한 읽기 전용 접근 제공.
  * `example` 네임스페이스의 파드가 `kube-node-lease` 네임스페이스의
    리스(Lease) 오브젝트를 읽고, 나열하고, 감시할 수 있도록 허용하는 등의
    [네임스페이스 간 접근](#cross-namespace) 권한 부여.
* 파드가 외부 서비스와 통신해야 하는 경우. 예를 들어,
  워크로드 파드에 상용 클라우드 API용 신원이 필요하고,
  해당 제공자가 적절한 신뢰 관계를 구성할 수 있도록 허용하는 경우이다.
* [`imagePullSecret`을 사용하여 비공개 이미지 레지스트리에 인증하는 경우](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* 외부 서비스가 쿠버네티스 API 서버와 통신해야 하는 경우. 예를 들어,
  CI/CD 파이프라인의 일부로 클러스터에 인증하는 경우이다.
* 클러스터에서 여러 파드의 서비스어카운트 신원을 기준으로
  파드를 서로 다른 컨텍스트로 그룹화하는
  서드파티 보안 소프트웨어를 사용하는 경우.

## 서비스 어카운트 사용 방법 {#how-to-use}

쿠버네티스 서비스 어카운트를 사용하려면 다음을 수행한다.

1. `kubectl`과 같은 쿠버네티스 클라이언트나
   오브젝트를 정의하는 매니페스트로 서비스어카운트 오브젝트를 생성한다.
1. [RBAC](/docs/reference/access-authn-authz/rbac/)과 같은
   인가 메커니즘을 사용하여
   서비스어카운트 오브젝트에 권한을 부여한다.
1. 파드 생성 시 서비스어카운트 오브젝트를 파드에 할당한다.

   외부 서비스에서 이 신원을 사용하는 경우에는,
   대신 [서비스어카운트 토큰을 가져와](#get-a-token)
   해당 서비스에서 사용한다.

자세한 지침은
[파드를 위한 서비스 어카운트 구성](/docs/tasks/configure-pod-container/configure-service-account/)을 참고한다.

### 서비스어카운트에 권한 부여하기 {#grant-permissions}

쿠버네티스에 기본 제공되는
[역할 기반 접근 제어(RBAC)](/docs/reference/access-authn-authz/rbac/)
메커니즘을 사용하여 각 서비스 어카운트에 필요한 최소 권한을 부여할 수 있다.
접근 권한을 부여하는 *롤(Role)* 을 생성한 후, 이 롤을
서비스어카운트에 *바인딩*한다. RBAC을 사용하면 서비스 어카운트의 권한이
최소 권한 원칙을 따르도록 최소한의 권한 집합을 정의할 수 있다.
해당 서비스 어카운트를 사용하는 파드는 올바르게 동작하는 데
필요한 것보다 많은 권한을 받지 않는다.

자세한 지침은
[서비스어카운트 권한](/docs/reference/access-authn-authz/rbac/#service-account-permissions)을 참고한다.

#### 서비스어카운트를 사용한 네임스페이스 간 접근 {#cross-namespace}

RBAC을 사용하면 한 네임스페이스의 서비스 어카운트가 클러스터 내 다른
네임스페이스의 리소스에 대해 작업을 수행하도록 허용할 수 있다. 예를 들어,
`dev` 네임스페이스에 서비스 어카운트와 파드가 있고, 파드에서
`maintenance` 네임스페이스에서 실행 중인 잡(Job)을 보려고 한다고 가정한다.
잡 오브젝트를 나열할 권한을 부여하는 롤 오브젝트를 생성할 수 있다. 그런 다음
`maintenance` 네임스페이스에 롤바인딩(RoleBinding) 오브젝트를 생성하여
롤을 서비스어카운트 오브젝트에 바인딩한다. 이제 `dev` 네임스페이스의 파드는 해당
서비스 어카운트로 `maintenance` 네임스페이스의 잡 오브젝트를 나열할 수 있다.

### 파드에 서비스어카운트 할당하기 {#assign-to-pod}

파드에 서비스어카운트를 할당하려면 파드 명세의 `spec.serviceAccountName`
필드를 설정한다. 그러면 쿠버네티스가 해당 서비스어카운트의
자격 증명을 파드에 자동으로 제공한다. v1.22 이상에서 쿠버네티스는
`TokenRequest` API로 유효 기간이 짧고 **자동으로 교체되는** 토큰을
받아, 이를
[프로젝티드 볼륨](/docs/concepts/storage/projected-volumes/#serviceaccounttoken)으로 마운트한다.

기본적으로 쿠버네티스는 파드에 할당된 서비스어카운트가
`default` 서비스어카운트이든 사용자가 지정한 서비스어카운트이든
해당 자격 증명을 파드에 제공한다.

쿠버네티스가 지정된 서비스어카운트나 `default` 서비스어카운트의
자격 증명을 자동으로 주입하지 못하도록 하려면, 파드 명세의
`automountServiceAccountToken` 필드를 `false`로 설정한다.

<!-- OK to remove this historical detail after Kubernetes 1.31 is released -->

v1.22 이전 버전에서는 쿠버네티스가 유효 기간이 긴 정적 토큰을
시크릿으로 파드에 제공한다.

#### 서비스어카운트 자격 증명 수동으로 가져오기 {#get-a-token}

서비스어카운트 자격 증명을 표준 위치 이외의 위치에 마운트하거나,
API 서버가 아닌 오디언스(audience)에 사용해야 한다면, 다음 방법 중
하나를 사용한다.

* [TokenRequest API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
  (권장): 자체 *애플리케이션 코드* 내에서 유효 기간이 짧은
  서비스 어카운트 토큰을 요청한다. 토큰은 자동으로 만료되며 만료 시
  교체할 수 있다.
  쿠버네티스를 인식하지 못하는 레거시 애플리케이션이 있다면, 동일한
  파드 내의 사이드카(sidecar) 컨테이너로 이 토큰을 가져와
  애플리케이션 워크로드에 제공할 수 있다.
* [토큰 볼륨 프로젝션](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
  (역시 권장): 쿠버네티스 v1.20 이상에서는 파드 명세를 사용하여
  kubelet이 서비스 어카운트 토큰을 파드에
  *프로젝티드 볼륨*으로 추가하도록 지정한다. 프로젝션된 토큰은 자동으로 만료되며, kubelet은
  만료되기 전에 토큰을 교체한다.
* [서비스 어카운트 토큰 시크릿](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
  (권장하지 않음): 서비스 어카운트 토큰을 파드에 쿠버네티스 시크릿으로
  마운트할 수 있다. 이 토큰은 만료되거나 교체되지 않는다. v1.24 이전에는 서비스 어카운트마다 영구 토큰이 자동으로 생성되었다.
  정적이며 유효 기간이 긴 자격 증명의 위험 때문에, 특히 대규모 환경에서는
  이 방법을 더 이상 권장하지 않는다. [LegacyServiceAccountTokenNoAutoGeneration 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates-removed)는
  쿠버네티스 v1.24부터 v1.26까지 기본적으로 활성화되어, 쿠버네티스가 서비스어카운트에 대해 이러한 토큰을
  자동으로 생성하지 못하도록 했다. 이 기능 게이트는 GA로 승격되어 v1.27에서 제거되었다. 여전히 유효 기간이 무제한인 서비스 어카운트 토큰을 수동으로 생성할 수 있지만, 보안에 미치는 영향을 고려해야 한다.

#### 서비스 어카운트 토큰의 노드 오디언스 제한 {#node-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

`ServiceAccountNodeAudienceRestriction` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
활성화하면, [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
어드미션 플러그인은 kubelet이 `TokenRequest` API로 서비스 어카운트
토큰을 생성할 때 요청할 수 있는 오디언스를 제한한다. 기본적으로 kubelet은
해당 노드의 파드가 이미 참조하는 오디언스에 대해서만 토큰을 요청할 수 있다
(프로젝티드 서비스 어카운트 토큰 볼륨 또는 CSI 드라이버 토큰 요청으로 참조). 관리자는
`request-serviceaccounts-token-audience` 동사를 사용하는 RBAC 규칙을 통해
kubelet에 추가 오디언스에 대한 접근 권한을 부여할 수 있다.

이 제한은 kubelet(노드 신원)에만 적용되며 `TokenRequest` API의 다른
호출자에게는 영향을 주지 않는다. 자세한 내용과 RBAC 예시는
[서비스 어카운트 토큰 오디언스 제한](/docs/reference/access-authn-authz/node/#service-account-token-audience-restriction)을 참고한다.

{{< note >}}
쿠버네티스 클러스터 외부에서 실행되는 애플리케이션을 위해 시크릿에 저장되는
유효 기간이 긴 서비스어카운트 토큰의 생성을 고려할 수 있다. 이 방식으로 인증할 수는 있지만, 쿠버네티스 프로젝트는 이를 피할 것을 권장한다.
유효 기간이 긴 베어러(bearer) 토큰은 한 번 유출되면 악용될 수 있으므로
보안 위험이 된다. 대신 다른 방법을 고려한다. 예를 들어 외부
애플리케이션은 안전하게 보호되는 개인 키와 인증서를 사용하여 인증하거나,
직접 구현한 [인증 웹훅](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)과 같은 사용자 정의 메커니즘으로 인증할 수 있다.

TokenRequest를 사용하여 외부 애플리케이션용 단기 토큰을 얻을 수도 있다.
{{< /note >}}

### 시크릿에 대한 접근 제한 (사용 중단(deprecated)) {#enforce-mountable-secrets}

{{< feature-state for_k8s_version="v1.32" state="deprecated" >}}

{{< note >}}
`kubernetes.io/enforce-mountable-secrets`는 쿠버네티스 v1.32부터 사용 중단되었다. 마운트된 시크릿에 대한 접근을 격리하려면 별도의 네임스페이스를 사용한다.
{{< /note >}}

쿠버네티스는 서비스어카운트에 추가할 수 있는
`kubernetes.io/enforce-mountable-secrets` 어노테이션을 제공한다. 이 어노테이션을 적용하면,
서비스어카운트의 시크릿을 지정된 유형의 리소스에만 마운트할 수 있으므로
클러스터의 보안 수준을 강화할 수 있다.

매니페스트를 사용하여 서비스어카운트에 어노테이션을 추가할 수 있다.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubernetes.io/enforce-mountable-secrets: "true"
  name: my-serviceaccount
  namespace: my-namespace
```
이 어노테이션을 "true"로 설정하면 쿠버네티스 컨트롤 플레인은
이 서비스어카운트의 시크릿에 특정 마운트 제한을 적용한다.

1. 파드에 볼륨으로 마운트되는 각 시크릿의 이름은 파드의 서비스어카운트의 `secrets` 필드에
   포함되어야 한다.
1. 파드에서 `envFrom`으로 참조하는 각 시크릿의 이름도 파드의 서비스어카운트의 `secrets`
   필드에 포함되어야 한다.
1. 파드에서 `imagePullSecrets`로 참조하는 각 시크릿의 이름도 파드의 서비스어카운트의 `secrets`
   필드에 포함되어야 한다.

이러한 제한을 이해하고 적용하면 클러스터 관리자는 더 엄격한 보안 수준을 유지하고, 적절한 리소스만 시크릿에 접근하도록 보장할 수 있다.

## 서비스 어카운트 자격 증명 인증 {#authenticating-credentials}

서비스어카운트는 서명된
{{<glossary_tooltip term_id="jwt" text="JSON 웹 토큰(JSON Web Token)" >}}(JWT)을
사용하여 쿠버네티스 API 서버와 신뢰 관계가 있는
다른 시스템에 인증한다. 토큰의 발급 방식
(`TokenRequest`를 사용한 시간제한 방식 또는 시크릿을 사용하는
기존 방식)에 따라, 서비스어카운트 토큰에는 만료 시점, 오디언스,
토큰이 유효해지기 *시작하는* 시점이 포함될 수 있다. 서비스어카운트로
동작하는 클라이언트가 쿠버네티스 API 서버와 통신하려고 하면,
HTTP 요청에 `Authorization: Bearer <token>` 헤더를
포함한다. API 서버는 다음과 같이 해당 베어러 토큰의 유효성을 확인한다.

1. 토큰 서명을 확인한다.
1. 토큰이 만료되었는지 확인한다.
1. 토큰 클레임(claim)의 오브젝트 참조가 현재 유효한지 확인한다.
1. 토큰이 현재 유효한지 확인한다.
1. 오디언스 클레임을 확인한다.

TokenRequest API는 서비스어카운트에 대한 _바운드 토큰(bound token)_ 을 생성한다.
이 바인딩은 해당 서비스어카운트로 동작하는 파드와 같은 클라이언트의
수명에 연결된다. 바운드 파드 서비스 어카운트 토큰의 JWT 스키마와 페이로드(payload) 예시는
[토큰 볼륨 프로젝션](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)을 참고한다.

`TokenRequest` API로 발급한 토큰의 경우, API 서버는 해당 서비스어카운트를
사용하는 특정 오브젝트 참조가 여전히 존재하는지도 확인한다.
이때 오브젝트의 {{< glossary_tooltip term_id="uid" text="고유 ID" >}}를
비교한다. 파드에 시크릿으로 마운트된 기존 토큰의 경우,
API 서버는 토큰을 시크릿과 대조하여 확인한다.

인증 과정에 대한 자세한 내용은
[인증](/docs/reference/access-authn-authz/authentication/#service-account-tokens)을 참고한다.

### 자체 코드에서 서비스 어카운트 자격 증명 인증하기 {#authenticating-in-code}

자체 서비스에서 쿠버네티스 서비스 어카운트 자격 증명을
검증해야 한다면 다음 방법을 사용할 수 있다.

* [토큰리뷰(TokenReview) API](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)
  (권장)
* OIDC 디스커버리

쿠버네티스 프로젝트는 토큰리뷰 API 사용을 권장한다. 이 방법은
시크릿, 서비스어카운트, 파드 또는 노드와 같은 API 오브젝트가
삭제되면 해당 오브젝트에 바인딩된 토큰을 무효화하기 때문이다. 예를 들어,
프로젝티드 서비스어카운트 토큰을 포함한 파드를 삭제하면 클러스터는
즉시 해당 토큰을 무효화하고 토큰리뷰도 즉시 실패한다.
반면 OIDC 검증을 사용하면 클라이언트는 토큰의 만료 시점에
도달할 때까지 토큰을 유효한 것으로 처리한다.

애플리케이션은 허용할 오디언스를 항상 정의하고,
토큰의 오디언스가 애플리케이션에서 예상하는 오디언스와
일치하는지 확인해야 한다. 이를 통해 토큰의 범위를 최소화하여,
해당 애플리케이션에서만 사용하고 다른 곳에서는 사용하지 못하도록 할 수 있다.

## 대안 {#alternatives}

* 다른 메커니즘으로 자체 토큰을 발급한 후,
  [웹훅 토큰 인증](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)을 통해
  자체 검증 서비스로 베어러 토큰을 검증한다.
* 파드에 자체 신원을 제공한다.
  * [SPIFFE CSI 드라이버 플러그인으로 파드에 SPIFFE SVID를 X.509 인증서 쌍으로 제공한다](https://cert-manager.io/docs/projects/csi-driver-spiffe/).
    {{% thirdparty-content single="true" %}}
  * [이스티오(Istio)와 같은 서비스 메시로 파드에 인증서를 제공한다](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/).
* 서비스 어카운트 토큰을 사용하지 않고 클러스터 외부에서 API 서버에 인증한다.
  * [신원 제공자의 OpenID Connect(OIDC) 토큰을 수락하도록 API 서버를 구성한다](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
  * 클라우드 제공자 등이 제공하는 외부 신원 및 접근 관리
    (Identity and Access Management, IAM) 서비스로 생성한 서비스 어카운트나 사용자 계정을
    사용하여 클러스터에 인증한다.
  * [클라이언트 인증서와 함께 CertificateSigningRequest API를 사용한다](/docs/tasks/tls/managing-tls-in-a-cluster/).
* [이미지 레지스트리에서 자격 증명을 가져오도록 kubelet을 구성한다](/docs/tasks/administer-cluster/kubelet-credential-provider/).
* 디바이스 플러그인으로 가상 신뢰 플랫폼 모듈(Trusted Platform Module, TPM)에 접근하고,
  이를 통해 개인 키를 사용한 인증을 수행한다.

## {{% heading "whatsnext" %}}

* [클러스터 관리자로서 서비스어카운트를 관리하는 방법](/docs/reference/access-authn-authz/service-accounts-admin/)을 알아본다.
* [파드에 서비스어카운트를 할당하는 방법](/docs/tasks/configure-pod-container/configure-service-account/)을 알아본다.
* [서비스어카운트 API 레퍼런스](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/)를 읽는다.
