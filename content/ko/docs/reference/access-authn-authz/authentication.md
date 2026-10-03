---
# reviewers:
# - erictune
# - lavalamp
# - deads2k
# - liggitt
title: 사용자 인증
content_type: concept
weight: 10
---

<!-- overview -->
이 페이지는 [쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)에 대한 인증을 중심으로
쿠버네티스 인증의 개요를 제공한다.

<!-- body -->
## 쿠버네티스의 사용자 {#users-in-kubernetes}

모든 쿠버네티스 클러스터에는 쿠버네티스가 관리하는 서비스 어카운트와
일반 사용자라는 두 가지 사용자 범주가 있다.

일반 사용자는 클러스터와 독립적인 서비스가 다음과 같은 방식으로 관리한다고 가정한다.

- 관리자가 개인 키를 배포한다.
- Keystone이나 Google Accounts와 같은 사용자 저장소를 사용한다.
- 사용자 이름과 비밀번호 목록이 있는 파일을 사용한다.

이와 관련하여, _쿠버네티스에는 일반 사용자 계정을 나타내는 오브젝트가 없다._
API 호출을 통해 일반 사용자를 클러스터에 추가할 수 없다.

API 호출로 일반 사용자를 추가할 수는 없지만, 클러스터의 인증 기관
(Certificate Authority, CA)이 서명한 유효한 인증서를 제시하는
사용자는 인증된 것으로 간주된다. 이 구성에서 쿠버네티스는
인증서 '주체(subject)'의 일반 이름(common name) 필드(예:
"/CN=bob")에서 사용자 이름을 결정한다. 이후 역할 기반 접근 제어
(Role-Based Access Control, RBAC) 하위 시스템이 해당 사용자가 리소스에
특정 작업을 수행하도록 인가되었는지 결정한다.

반면 서비스 어카운트는 쿠버네티스 API가 관리하는 사용자이다. 특정
네임스페이스에 바인딩되며 API 서버가 자동으로 생성하거나 API 호출로
수동 생성한다. 서비스 어카운트는 `Secrets`로 저장된 자격 증명 집합과
연결되며, 이 자격 증명은 파드에 마운트되어 클러스터 내부 프로세스가
쿠버네티스 API와 통신할 수 있도록 한다.

API 요청은 일반 사용자나 서비스 어카운트에 연결되거나,
[익명 요청](#anonymous-requests)으로 처리된다. 즉, 워크스테이션에서 `kubectl`을 입력하는
사용자부터 노드의 `kubelets`, 컨트롤 플레인 구성 요소에 이르기까지
클러스터 내부 또는 외부의 모든 프로세스는 API 서버에 요청할 때 인증해야 하며,
그렇지 않으면 익명 사용자로 처리된다.

인증을 시도하여 성공하면 API 서버는 자동으로 해당 사용자를
특별한 그룹인 `system:authenticated`의 멤버로 표시한다.

## 인증 전략 {#authentication-strategies}

쿠버네티스는 인증 플러그인을 통해 클라이언트 인증서, 베어러(bearer) 토큰 또는
인증 프록시를 사용하여 API 요청을 인증한다. API 서버에 HTTP 요청이
전달되면, 플러그인은 요청에 다음 속성을 연결하려고
시도한다.

* 사용자 이름: 최종 사용자를 식별하는 문자열이다. 일반적인 값으로 `kube-admin`이나 `jane@example.com` 등이 있다.
* UID: 최종 사용자를 식별하는 문자열로, 사용자 이름보다 일관되고 고유한 식별자를 제공하려는 목적이다.
* 그룹: 문자열 집합으로, 각 문자열은 이름이 지정된 논리적 사용자 집합에 사용자가 속함을 나타낸다.
  일반적인 값으로 `system:masters`나 `devops-team` 등이 있다.
* 추가 필드: 문자열을 문자열 목록에 매핑하며, 인가자에게 유용할 수 있는 추가 정보를 담는다.

{{< note >}}
인증 시스템은 이 값들의 의미를 해석하지 않으며,
[인가자](/docs/reference/access-authn-authz/authorization/)가 해석할 때만 의미를 가진다.
{{< /note >}}

## 익명 요청 {#anonymous-requests}

익명 접근을 활성화하면 구성된 다른 인증 방식에서 거부하지 않은 요청을
익명 요청으로 처리하고, 사용자 이름 `system:anonymous`와 그룹
`system:unauthenticated`를 부여한다.

예를 들어 토큰 인증을 구성하고 익명 접근을 활성화한 서버에서,
유효하지 않은 베어러 토큰을 제공하는 요청은 `401 Unauthorized` 오류를 받는다.
베어러 토큰을 제공하지 않는 요청은 익명 요청으로 처리된다.

`AlwaysAllow` 이외의
[인가 모드](/docs/reference/access-authn-authz/authorization/#authorization-modules)를
사용하면 익명 접근이 기본적으로 활성화된다. API 서버에 `--anonymous-auth=false`
커맨드라인 옵션을 전달하여 비활성화할 수 있다.
기본 제공 ABAC 및 RBAC 인가자는 `system:anonymous` 사용자나
`system:unauthenticated` 그룹에 대한 명시적인 인가를 요구한다. 쿠버네티스 1.5 이하 버전의
기존 정책 규칙이 있다면, `*` 사용자나 `*` 그룹에 접근 권한을 부여하는
해당 규칙은 익명 사용자에게 자동으로 접근을 허용하지 않는다.

### 익명 인증자 구성 {#anonymous-authenticator-configuration}

{{< feature-state feature_gate_name="AnonymousAuthConfigurableEndpoints" >}}

`AuthenticationConfiguration`을 사용하여 익명 인증자를
구성할 수 있다. `AuthenticationConfiguration` 파일에 anonymous 필드를
설정하면 `--anonymous-auth` 커맨드라인 옵션을 설정할 수 없다.

인증 구성 파일을 사용하여 익명 인증자를 구성하는 주요 장점은
익명 인증을 활성화하거나 비활성화하는 것 외에도,
어떤 엔드포인트에서 익명 인증을 지원할지 구성할 수 있다는 점이다.

인증 구성 파일의 예시는 다음과 같다.

{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
---
#
# CAUTION: this is an example configuration.
#          Do not use this as-is for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
{{< /highlight >}}

위 구성에서는 `/livez`, `/readyz`, `/healthz` 엔드포인트만
익명 요청으로 접근할 수 있다. 인가 구성에서 허용하더라도 다른
엔드포인트에는 익명으로 접근할 수 없다.

## 인증 방식 {#authentication-methods}

여러 인증 방식을 동시에 활성화할 수 있다. 일반적으로 최소한 다음 두 가지 방식을 사용해야 한다.

- 서비스어카운트(ServiceAccount)를 위한 [서비스 어카운트 토큰](/docs/concepts/security/service-accounts/#authenticating-credentials)
- (일반) 사용자 인증을 위한 하나 이상의 다른 방식

사용 가능한 인증 방식은 다음과 같다.

* [X.509 클라이언트 인증서](#x509-client-certificates)
* [부트스트랩 토큰](#bootstrap-tokens)
* [서비스 어카운트 토큰](#service-account-tokens)
* [정적 토큰 파일](#static-token-file)
* [외부 통합](#external-integrations)
  * [JSON 웹 토큰](#json-web-token-authentication)
  * [OpenID Connect 토큰](#openid-connect-tokens)
  * [웹훅 토큰 인증](#webhook-token-authentication)
  * [인증 리버스 프록시](#authenticating-proxy)

여러 인증자 모듈을 활성화하면 요청을 처음으로 인증하는 데 성공한
모듈에서 평가를 종료한다.
API 서버는 인증자의 실행 순서를 보장하지 않는다.

### X.509 클라이언트 인증서 {#x509-client-certificates}

클러스터의 _클라이언트 신뢰_ 인증 기관(CA)이 서명한 유효한 클라이언트 인증서를
제시하는 모든 쿠버네티스 클라이언트는 인증된 것으로 간주된다. 이 구성에서 쿠버네티스는
인증서 _주체_ 의 `commonName` 필드로 사용자 이름을 결정한다.
(예를 들어 `commonName=bob`은 사용자 이름이 "bob"인 사용자를 나타낸다.)
이후 쿠버네티스 [인가](/docs/reference/access-authn-authz/authorization)
메커니즘이 해당 사용자의 리소스에 대한 특정 작업 수행을 허용할지 결정한다.

클라이언트 인증서 인증은 API 서버에 `--client-ca-file=<SOMEFILE>`
옵션을 전달하여 활성화한다.
이 옵션은 클러스터의 _클라이언트 신뢰_ 인증 기관을 구성한다.
참조하는 파일에는 API 서버가 클라이언트 인증서를 검증할 때
사용할 수 있는 인증 기관이 하나 이상 포함되어야 한다.
클라이언트 인증서가 제시되고 검증되면, 주체의 일반 이름을 해당 요청의
사용자 이름으로 사용한다. 클라이언트 인증서는 조직 필드를 사용하여 사용자의 그룹 소속을
나타낼 수도 있다. 사용자에게 여러 그룹 소속을 포함하려면,
인증서에 여러 조직 필드를 포함한다.

클라이언트 인증서 생성 방법은 [인증서 관리](/docs/tasks/administer-cluster/certificates/)를 참고하거나, 이 페이지 뒷부분의 간단한 [예시](#x509-client-certificates-example)를 읽는다.

#### 쿠버네티스와 호환되는 클라이언트 인증서 {#x509-client-certificates-k8s}

API 서버가 클라이언트 인증서에 대해 수락하는 신뢰 체인의 CA에서 발급한
유효한 인증서를 제시하여 쿠버네티스에 인증할 수 있다.
인증서는 유효해야 하며, API 서버는 X.509의 `notBefore` 및 `notAfter` 속성을 기준으로 이를 확인한다. 또한 인증서의
_확장 키 용도(extended key usage)_ 에 클라이언트 인증(`ClientAuth`)이 포함되어야 한다.

{{< note >}}
쿠버네티스 {{< skew currentVersion >}}는 인증서 _폐기(revocation)_ 를 지원하지 않는다.
발급된 인증서는 만료될 때까지 유효하다.
{{< /note >}}

##### 사용자 이름 매핑 {#x509-client-certificates-k8s-username}

쿠버네티스는 클라이언트 인증서에 주체의 사용자 이름으로 사용하는
`commonName`(OID `2.5.4.3`) 속성이 포함되어 있다고 가정한다.

##### 사용자 ID 매핑 {#user-id-mapping}

{{< feature-state feature_gate_name="AllowParsingUserUIDFromCertAuth" >}}

이 기능을 사용하려면 인증서에 `1.3.6.1.4.1.57683.2` 속성이 포함되어 있어야 하며,
`AllowParsingUserUIDFromCertAuth` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가
활성화되어 있어야 한다(기본적으로 활성화되어 있음).

쿠버네티스는 인증서에서 **선택적** 사용자 UID를 파싱할 수 있다.
UID는 사용자 이름과 다르다. 인증서를 요청한 사람이나
인증서 승인 규칙을 설정한 사람이 그 의미를
정의하는 값이며, 쿠버네티스는 그 의미를 해석하지 않는다.

예를 들어 한 클러스터에서는 UID가 `1042`(단순한 정수)일 수 있지만,
다른 인증서에서는 `d3f77937-ec82-4f16-8010-61821abe315a`(UUID)를
UID로 사용할 수 있다.

다음 예시로 그 의미를 설명할 수 있다. 일반 이름이 "Ada Lovelace"로
설정되어 있고, `uid` 속성(OID `0.9.2342.19200300.100.1.1`)의 값이
"aaking1815"인 인증서가 있다면, 쿠버네티스는 클라이언트의 사용자 이름을 "Ada Lovelace"로 간주한다.
`uid` 속성은 쿠버네티스가 찾는 CNCF 전용 OID가 아니므로
쿠버네티스는 이를 무시한다.
쿠버네티스가 `aaking1815`를 UID로 인식하도록 하려면, 인증서 주체의
OID `1.3.6.1.4.1.57683.2` 속성 값으로 설정해야 한다.

##### 그룹 매핑 {#x509-client-certificates-k8s-group}

인증서에 그룹 정보를 정적으로 포함하여 사용자를 그룹에
매핑할 수 있다. 사용자가 속한 각 그룹의 이름을 인증서 주체의
`organization`(OID `2.5.6.4`)으로 추가한다.
사용자에게 여러 그룹 소속을 포함하려면 인증서 주체에 여러 조직을 포함한다.
(순서는 중요하지 않다.)
예시 사용자의 인증서 식별 이름(distinguished name)은
CN=Ada&nbsp;Lovelace,O=Users,O=Staff,O=Programmers일 수 있으며, 이 사용자는
"Programmers", "Staff", "system:authenticated", "Users" 그룹에 속하게 된다.

인증서에 그룹 정보를 포함하는 것은 선택 사항이다. 인증서에 그룹을 지정하지 않으면
사용자는 "system:authenticated"에만 속하게 된다.

##### 노드 클라이언트 인증서 {#x509-client-certificates-nodes}

쿠버네티스는 노드의 신원에도 동일한 방식을 사용할 수 있다. 노드는
{{<glossary_tooltip term_id="kubelet" text="kubelet">}}을 실행하는 쿠버네티스 API 서버의 클라이언트이다.
(여기서는 관련성이 낮지만, 일반적으로 API 서버 역시 각 노드의 클라이언트이다.)
예를 들어 도메인 이름이 "server-1a-antarctica42.cluster.example"인 노드 "server-1a-antarctica42"는 "CN=system:node:server-1a-antarctica/42,O=system:nodes"에 발급된 인증서를 사용할 수 있다. 그러면 노드의 사용자 이름은 "system:node:server-1a-antarctica/g42"이고, 노드는 "system:authenticated" 및 "system:nodes"의 멤버가 된다.

kubelet은 노드의 인증서와 개인 키를 사용하여
클러스터의 API 서버에 인증한다.

{{< note >}}
노드의 머신 신원은
{{< glossary_tooltip text="서비스어카운트" term_id="service-account" >}}와 같지 않다.
{{< /note >}}

#### 예시 {#x509-client-certificates-example}

`openssl` 커맨드라인 툴을 사용하여 인증서 서명 요청을 생성할 수 있다.

```bash
# This example assumes that you already have a private key alovelace.pem
openssl req -new -key alovelace.pem -out alovelace-csr.pem -subj "/CN=alovelace/O=app1/O=app2"
```

이 명령은 "app1"과 "app2"라는 두 그룹에 속하는 사용자 이름 "alovelace"에 대한 서명 요청을 생성한다. 이후 클러스터의 클라이언트 신뢰 인증 기관이 이 요청에 서명하도록 하여, 클러스터에 대한 클라이언트 인증에 사용할 인증서를 얻을 수 있다.

### 부트스트랩 토큰 {#bootstrap-tokens}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

새 클러스터의 부트스트래핑을 간소화하기 위해, 쿠버네티스는 동적으로
관리되는 베어러 토큰 유형인 *부트스트랩 토큰*을 제공한다. 이 토큰은
`kube-system` 네임스페이스에 시크릿(Secret)으로 저장되며,
동적으로 관리하고 생성할 수 있다. 컨트롤러 매니저에는 부트스트랩 토큰이
만료되면 삭제하는 TokenCleaner 컨트롤러가 포함된다.

토큰의 형식은 `[a-z0-9]{6}.[a-z0-9]{16}`이다. 첫 번째 부분은
토큰 ID이고 두 번째 부분은 토큰 시크릿이다. HTTP 헤더에서
토큰을 다음과 같이 지정한다.

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

API 서버에서 `--enable-bootstrap-token-auth` 플래그를 사용하여
부트스트랩 토큰 인증자를 활성화해야 한다. kube-controller-manager의
`--controllers` 커맨드라인 인자를 통해 TokenCleaner 컨트롤러도
활성화해야 한다.
예를 들어 `--controllers=*,tokencleaner`와 같이 설정한다.
`kubeadm` 도구를 사용하여 클러스터를 부트스트랩하면 이 설정을 자동으로 처리한다.

인증자는 `system:bootstrap:<Token ID>`로 인증한다. 이는
`system:bootstrappers` 그룹에 포함된다. 부트스트래핑 이후에도 이 토큰을
계속 사용하지 않도록 이름과 그룹을 의도적으로
제한한다. 이 사용자 이름과 그룹은 클러스터의 부트스트래핑을 지원하는
적절한 인가 정책을 작성하는 데 사용할 수 있으며,
실제로 `kubeadm`이 이렇게 사용한다.

부트스트랩 토큰 인증자와 컨트롤러, 그리고 `kubeadm`으로 이 토큰을 관리하는
방법에 대한 자세한 문서는
[부트스트랩 토큰](/docs/reference/access-authn-authz/bootstrap-tokens/)을 참고한다.

#### 요청에 베어러 토큰 포함하기 {#putting-a-bearer-token-in-a-request}

HTTP 클라이언트에서 베어러 토큰 인증을 사용할 때, API 서버는
값이 `Bearer <token>`인 `Authorization` 헤더를
요구한다. 베어러 토큰은 HTTP의 인코딩 및 인용
기능만으로 HTTP 헤더 값에 포함할 수 있는 문자열이어야 한다.
예를 들어 베어러 토큰이
`31ada4fd-adec-460c-809a-9e56ceb75269`라면, HTTP 헤더에서는
아래와 같이 나타낸다.

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```


### 서비스 어카운트 토큰 {#service-account-tokens}

서비스 어카운트는 서명된 베어러 토큰으로 요청을 검증하는,
자동으로 활성화되는 인증자이다. 이 플러그인은 두 가지 선택적 플래그를 받는다.

* `--service-account-key-file`: 서비스어카운트 토큰을 검증하는 데 사용하는 PEM 인코딩된 x509 RSA 또는 ECDSA
  개인 키나 공개 키를 포함한 파일이다. 지정된 파일에는
  여러 키를 포함할 수 있으며, 서로 다른 파일을 지정하여 플래그를 여러 번
  사용할 수 있다. 지정하지 않으면 --tls-private-key-file을 사용한다.
* `--service-account-lookup`: 활성화하면 API에서 삭제된 토큰을 폐기한다.

서비스 어카운트는 일반적으로 API 서버가 자동으로 생성하며,
`ServiceAccount` [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)를
통해 클러스터에서 실행 중인 파드와 연결된다. 베어러 토큰은
파드 내의 정해진 위치에 마운트되어 클러스터 내부 프로세스가
API 서버와 통신할 수 있도록 한다. `PodSpec`의 `serviceAccountName`
필드를 사용하여 계정을 파드에 명시적으로 연결할 수도 있다.

{{< note >}}
이 연결은 자동으로 이루어지므로 일반적으로 `serviceAccountName`을 생략한다.
{{< /note >}}

```yaml
apiVersion: apps/v1 # this apiVersion is relevant as of Kubernetes 1.9
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```

서비스 어카운트 베어러 토큰은 클러스터 외부에서도 유효하게 사용할 수 있으며,
쿠버네티스 API와 통신하려는 장기간 실행 작업의 신원을
생성하는 데 사용할 수 있다. 서비스 어카운트를 수동으로 생성하려면
`kubectl create serviceaccount (NAME)` 명령을 사용한다. 이 명령은 현재
네임스페이스에 서비스 어카운트를 생성한다.

```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount/jenkins created
```

연결된 토큰을 수동으로 생성할 수 있다.

```bash
kubectl create token jenkins
```

```none
eyJhbGciOiJSUzI1NiIsImtp...
```

생성된 토큰은 서명된 [JSON 웹 토큰(JSON Web Token)](https://www.rfc-editor.org/rfc/rfc7519)(JWT)이다.

서명된 JWT는 해당 서비스 어카운트로 인증하기 위한 베어러 토큰으로
사용할 수 있다. 요청에 토큰을 포함하는 방법은 [앞의 설명](#putting-a-bearer-token-in-a-request)을
참고한다. 일반적으로 이 토큰은 클러스터 내부에서 API 서버에 접근하기 위해
파드에 마운트되지만, 클러스터 외부에서도 사용할 수 있다.

서비스 어카운트는 사용자 이름 `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`로 인증하며,
`system:serviceaccounts` 및 `system:serviceaccounts:(NAMESPACE)` 그룹에 속한다.

{{< warning >}}
서비스 어카운트 토큰은 시크릿 API 오브젝트에 저장할 수도 있으므로, 시크릿에 대한
쓰기 접근 권한이 있는 모든 사용자는 토큰을 요청할 수 있으며, 해당 시크릿에 대한
읽기 접근 권한이 있는 모든 사용자는 서비스 어카운트로 인증할 수 있다. 서비스 어카운트에
권한을 부여하거나 시크릿의 읽기 또는 쓰기 권한을 부여할 때 주의한다.
{{< /warning >}}



## 외부 통합 {#external-integrations}

쿠버네티스는 JWT와 OpenID Connect(OIDC)를 기본적으로 지원한다. [JSON 웹 토큰 인증](#json-web-token-authentication)을 참고한다.

다른 인증 프로토콜(예: LDAP, SAML, Kerberos, 대체 X.509 방식)과의 통합은
[인증 프록시](#authenticating-proxy)를 사용하거나
[인증 웹훅](#webhook-token-authentication)과 통합하여 구현할 수 있다.

API 서버가 유효한 인증서를 신뢰한다면, 클라이언트에게 [X.509 클라이언트 인증서](#x509-client-certificates)를
발급하는 사용자 정의 방식도 사용할 수 있다.
인증서 생성 방법은 [X.509 클라이언트 인증서](#x509-client-certificates)를
참고한다.

클라이언트에 인증서를 발급한다면, 클라우드 플랫폼 관리자로서 인증서의
유효 기간과 그 밖의 설계상 선택이 적절한 보안 수준을
제공하도록 해야 한다.

### JSON 웹 토큰 인증 {#json-web-token-authentication}

[JSON 웹 토큰](https://www.rfc-editor.org/rfc/rfc7519)(JWT)을 준수하는 토큰으로 사용자를 인증하도록
쿠버네티스를 구성할 수 있다. JWT 인증 메커니즘은 쿠버네티스 자체에서 발급하는 서비스어카운트 토큰에 사용되며,
다른 신원 소스와 통합하는 데 사용할 수도 있다.

인증자는 원시 ID 토큰을 파싱하고, 구성된 발급자가 서명했는지 검증하려고 시도한다.
외부에서 발급된 토큰은 OIDC 디스커버리를 사용하여 발급자의 공개 엔드포인트에서 서명 검증용 공개 키를 찾는다.

최소한의 유효한 JWT 페이로드(payload)에는 다음 클레임(claim)이 **반드시** 포함되어야 한다.

```javascript
{
  "iss": "https://example.com",   // must match the issuer.url
  "aud": ["my-app"],              // at least one of the entries in issuer.audiences must match the "aud" claim in presented JWTs.
  "exp": 1234567890,              // token expiration as Unix time (the number of seconds elapsed since January 1, 1970 UTC)
  "<username-claim>": "user"      // this is the username claim configured in the claimMappings.username.claim or claimMappings.username.expression
}
```

#### JWT 이그레스 셀렉터 유형 {#jwt-egress-selector-type}

{{< feature-state feature_gate_name="StructuredAuthenticationConfigurationEgressSelector" >}}

JWT 발급자 구성의 `egressSelectorType` 필드를 사용하면 발급자와 관련된 모든 트래픽
(디스커버리, JWKS, 분산 클레임 등)을 보낼 때 사용할 _이그레스 셀렉터(egress selector)_ 를 지정할 수 있다.
이 기능을 사용하려면 `StructuredAuthenticationConfigurationEgressSelector` 기능 게이트를 활성화해야 한다.

#### OpenID Connect 토큰 {#openid-connect-tokens}

[OpenID Connect](https://openid.net/connect/)는 OAuth2의 한 형태로,
Microsoft Entra ID, Salesforce, Google 등의 OAuth2 제공자가 지원한다.
이 프로토콜이 OAuth2에 추가하는 주요 기능은 액세스 토큰과 함께 반환되는
[ID 토큰](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)이라는 추가 필드이다.
이 토큰은 사용자 이메일과 같은 정해진 필드를 포함하며,
서버가 서명한 JSON 웹 토큰(JWT)이다.

인증자는 사용자를 식별하기 위해 OAuth2
[토큰 응답](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)의 `id_token`을
베어러 토큰으로 사용한다(`access_token`이 아님). 요청에 토큰을 포함하는 방법은
[앞의 설명](#putting-a-bearer-token-in-a-request)을 참고한다.

{{< mermaid >}}
sequenceDiagram
    participant user as 사용자
    participant idp as 신원 제공자
    participant kube as kubectl
    participant api as API 서버

    user ->> idp: 1. IdP에 로그인
    activate idp
    idp -->> user: 2. access_token,<br>id_token, refresh_token 제공
    deactivate idp
    activate user
    user ->> kube: 3. --token에 id_token을 지정하여<br>kubectl 호출<br>또는 .kube/config에 토큰 추가
    deactivate user
    activate kube
    kube ->> api: 4. Authorization: Bearer...
    deactivate kube
    activate api
    api ->> api: 5. JWT 서명이 유효한가?
    api ->> api: 6. JWT가 만료되었는가? (iat+exp)
    api ->> api: 7. 사용자가 인가되었는가?
    api -->> kube: 8. 인가됨: 작업 수행<br>및 결과 반환
    deactivate api
    activate kube
    kube --x user: 9. 결과 반환
    deactivate kube
{{< /mermaid >}}

1. 신원 제공자에 로그인한다.
1. 신원 제공자는 `access_token`, `id_token`, `refresh_token`을 제공한다.
1. `kubectl`을 사용할 때 `--token` 커맨드라인 인자로 `id_token`을 전달하거나, `kubeconfig`에 직접 추가한다.
1. `kubectl`은 Authorization 헤더에 `id_token`을 담아 API 서버에 보낸다.
1. API 서버는 JWT 서명이 유효한지 확인한다.
1. `id_token`이 만료되지 않았는지 확인한다.

   `AuthenticationConfiguration`에 CEL 표현식이 구성되어 있으면 클레임 및/또는 사용자 검증을 수행한다.

1. 사용자가 인가되었는지 확인한다.
1. 인가되면 API 서버가 `kubectl`에 응답을 반환한다.
1. `kubectl`은 사용자에게 결과를 제공한다.

신원을 검증하는 데 필요한 모든 데이터가 `id_token`에 있으므로, 쿠버네티스가 신원 제공자에
다시 연락할 필요가 없다. 모든 요청이 스테이트리스인 모델에서 이는 확장성이 매우 높은
인증 솔루션을 제공한다. 다만 몇 가지 어려움이 있다.

1. 쿠버네티스에는 인증 과정을 시작하는 "웹 인터페이스"가 없다. 자격 증명을 수집하는 브라우저나
   인터페이스가 없으므로 먼저 신원 제공자에 인증해야 한다.
1. `id_token`은 폐기할 수 없고 인증서와 유사하므로 유효 기간이 짧아야 한다(몇 분 정도).
   따라서 몇 분마다 새 토큰을 받아야 하는 것이 매우 번거로울 수 있다.
1. 쿠버네티스 대시보드에 인증하려면 `kubectl proxy` 명령이나 `id_token`을 주입하는
   리버스 프록시를 사용해야 한다.

#### API 서버 구성하기 {#configuring-the-api-server}

##### 커맨드라인 인자 사용하기 {#using-command-line-arguments}

플러그인을 활성화하려면 API 서버에 다음 커맨드라인 인자를 구성한다.

| 파라미터 | 설명 | 예시 | 필수 여부 |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | API 서버가 공개 서명 키를 찾을 수 있는 제공자 URL이다. `https://` 스킴을 사용하는 URL만 허용한다. 일반적으로 제공자의 디스커버리 URL에서 경로를 비운 값이다. | 발급자의 OIDC 디스커버리 URL이 `https://accounts.provider.example/.well-known/openid-configuration`이면, 값은 `https://accounts.provider.example`이어야 한다. | 예 |
| `--oidc-client-id` | 모든 토큰의 발급 대상이어야 하는 클라이언트 ID이다. | kubernetes | 예 |
| `--oidc-username-claim` | 사용자 이름으로 사용할 JWT 클레임이다. 기본값은 최종 사용자의 고유 식별자로 기대되는 `sub`이다. 관리자는 제공자에 따라 `email`이나 `name` 등의 다른 클레임을 선택할 수 있다. 다만 `email` 이외의 클레임에는 다른 플러그인과의 이름 충돌을 방지하기 위해 발급자 URL이 접두사로 붙는다. | sub | 아니요 |
| `--oidc-username-prefix` | 기존 이름(예: `system:` 사용자)과의 충돌을 방지하기 위해 사용자 이름 클레임 앞에 붙이는 접두사이다. 예를 들어 `oidc:`를 지정하면 `oidc:jane.doe`와 같은 사용자 이름을 만든다. 이 인자를 제공하지 않고 `--oidc-username-claim`이 `email` 이외의 값이면, 기본 접두사는 `( Issuer URL )#`이며 `( Issuer URL )`은 `--oidc-issuer-url` 값이다. `-`를 사용하면 접두사를 모두 비활성화할 수 있다. | `oidc:` | 아니요 |
| `--oidc-groups-claim` | 사용자의 그룹으로 사용할 JWT 클레임이다. 클레임이 있으면 문자열 배열이어야 한다. | groups | 아니요 |
| `--oidc-groups-prefix` | 기존 이름(예: `system:` 그룹)과의 충돌을 방지하기 위해 그룹 클레임 앞에 붙이는 접두사이다. 예를 들어 `oidc:`를 지정하면 `oidc:engineering` 및 `oidc:infra`와 같은 그룹 이름을 만든다. | `oidc:` | 아니요 |
| `--oidc-required-claim` | ID 토큰의 필수 클레임을 나타내는 key=value 쌍이다. 설정하면 ID 토큰에 해당 클레임이 존재하고 값이 일치하는지 검증한다. 여러 클레임을 지정하려면 이 인자를 반복한다. | `claim=value` | 아니요 |
| `--oidc-ca-file` | 신원 제공자의 웹 인증서에 서명한 CA의 인증서 경로이다. 기본값은 호스트의 루트 CA이다. | `/etc/kubernetes/ssl/kc-ca.pem` | 아니요 |
| `--oidc-signing-algs` | 허용하는 서명 알고리즘이다. 기본값은 RS256이다. 허용되는 값은 RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512이다. 값은 RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1 에 정의되어 있다. | `RS512` | 아니요 |

##### 파일에서 인증 구성 읽기 {#using-authentication-configuration}

{{< feature-state feature_gate_name="StructuredAuthenticationConfiguration" >}}

구성 파일 방식에서는 각각 고유한 `issuer.url`과 `issuer.discoveryURL`을 가진
여러 JWT 인증자를 구성할 수 있다. 또한 [CEL](/docs/reference/using-api/cel/) 표현식을
지정하여 클레임을 사용자 속성에 매핑하고, 클레임과 사용자 정보를 검증할 수 있다.
구성 파일이 수정되면 API 서버가 인증자를 자동으로 다시 로드한다.
`apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds` 메트릭으로
API 서버가 마지막으로 구성을 다시 로드한 시점을 모니터링할 수 있다.

API 서버의 `--authentication-config` 커맨드라인 인자로 인증 구성 파일 경로를 지정해야 한다. 구성 파일 대신 커맨드라인 인자를 사용하려는 경우에도,
기존 인자는 계속 그대로 동작한다. 여러 인증자 구성이나 발급자에 대한
여러 오디언스 설정과 같은 새 기능을 사용하려면 구성 파일 방식으로 전환한다.

구조화된 인증을 사용하려면 kube-apiserver에 `--authentication-config` 커맨드라인
인자를 지정한다. 구조화된 인증 구성 파일의 예시는 아래와 같다.

{{< note >}}
`--authentication-config`와 `--oidc-*` 커맨드라인 인자를 함께 지정하면
잘못된 구성이다. 이 경우 API 서버는 오류를 보고한 후 즉시 종료한다.
구조화된 인증 구성으로 전환하려면 `--oidc-*` 커맨드라인 인자를 제거하고,
대신 구성 파일을 사용해야 한다.
{{< /note >}}

{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
# list of authenticators to authenticate Kubernetes users using JWT compliant tokens.
# the maximum number of allowed authenticators is 64.
jwt:
- issuer:
    # url must be unique across all authenticators.
    # url must not conflict with issuer configured in --service-account-issuer.
    url: https://example.com # Same as --oidc-issuer-url.
    # discoveryURL, if specified, overrides the URL used to fetch discovery
    # information instead of using "{url}/.well-known/openid-configuration".
    # The exact value specified is used, so "/.well-known/openid-configuration"
    # must be included in discoveryURL if needed.
    #
    # The "issuer" field in the fetched discovery information must match the "issuer.url" field
    # in the AuthenticationConfiguration and will be used to validate the "iss" claim in the presented JWT.
    # This is for scenarios where the well-known and jwks endpoints are hosted at a different
    # location than the issuer (such as locally in the cluster).
    # discoveryURL must be different from url if specified and must be unique across all authenticators.
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM encoded CA certificates used to validate the connection when fetching
    # discovery information. If not set, the system verifier will be used.
    # Same value as the content of the file referenced by the --oidc-ca-file command line argument.
    certificateAuthority: <PEM encoded CA certificates>
    # audiences is the set of acceptable audiences the JWT must be issued to.
    # At least one of the entries must match the "aud" claim in presented JWTs.
    audiences:
    - my-app # Same as --oidc-client-id.
    - my-other-app
    # this is required to be set to "MatchAny" when multiple audiences are specified.
    audienceMatchPolicy: MatchAny
    # egressSelectorType is an indicator of which egress selection should be used for sending all traffic related
    # to this issuer (discovery, JWKS, distributed claims, etc).  If unspecified, no custom dialer is used.
    # The StructuredAuthenticationConfigurationEgressSelector feature gate must be enabled
    # before you can use the egressSelectorType field.
    # When specified, the valid choices are "controlplane" and "cluster".  These correspond to the associated
    # values in the --egress-selector-config-file.
    # - controlplane: for traffic intended to go to the control plane.
    # - cluster: for traffic intended to go to the system being managed by Kubernetes.
    egressSelectorType: <egress-selector-type>
  # rules applied to validate token claims to authenticate users.
  claimValidationRules:
    # Same as --oidc-required-claim key=value.
  - claim: hd
    requiredValue: example.com
    # Instead of claim and requiredValue, you can use expression to validate the claim.
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for validation to succeed.
  - expression: 'claims.hd == "example.com"'
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: the hd claim must be set to example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: total token lifetime must not exceed 24 hours
  claimMappings:
    # username represents an option for the username attribute.
    # This is the only required attribute.
    username:
      # Same as --oidc-username-claim. Mutually exclusive with username.expression.
      claim: "sub"
      # Same as --oidc-username-prefix. Mutually exclusive with username.expression.
      # if username.claim is set, username.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with username.claim and username.prefix.
      # expression is a CEL expression that evaluates to a string.
      #
      # 1.  If username.expression uses 'claims.email', then 'claims.email_verified' must be used in
      #     username.expression or extra[*].valueExpression or claimValidationRules[*].expression.
      #     An example claim validation rule expression that matches the validation automatically
      #     applied when username.claim is set to 'email' is 'claims.?email_verified.orValue(true) == true'.
      #     By explicitly comparing the value to true, we let type-checking see the result will be a boolean, and
      #     to make sure a non-boolean email_verified claim will be caught at runtime.
      # 2.  If the username asserted based on username.expression is the empty string, the authentication
      #     request will fail.
      expression: 'claims.username + ":external-user"'
    # groups represents an option for the groups attribute.
    groups:
      # Same as --oidc-groups-claim. Mutually exclusive with groups.expression.
      claim: "sub"
      # Same as --oidc-groups-prefix. Mutually exclusive with groups.expression.
      # if groups.claim is set, groups.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with groups.claim and groups.prefix.
      # expression is a CEL expression that evaluates to a string or a list of strings.
      expression: 'claims.roles.split(",")'
    # uid represents an option for the uid attribute.
    uid:
      # Mutually exclusive with uid.expression.
      claim: 'sub'
      # Mutually exclusive with uid.claim
      # expression is a CEL expression that evaluates to a string.
      expression: 'claims.sub'
    # extra attributes to be added to the UserInfo object. Keys must be domain-prefix path and must be unique.
    extra:
      # key is a string to use as the extra attribute key.
      # key must be a domain-prefix path (e.g. example.org/foo). All characters before the first "/" must be a valid
      # subdomain as defined by RFC 1123. All characters trailing the first "/" must
      # be valid HTTP Path characters as defined by RFC 3986.
      # k8s.io, kubernetes.io and their subdomains are reserved for Kubernetes use and cannot be used.
      # key must be lowercase and unique across all extra attributes.
    - key: 'example.com/tenant'
      # valueExpression is a CEL expression that evaluates to a string or a list of strings.
      valueExpression: 'claims.tenant'
  # validation rules applied to the final user object.
  userValidationRules:
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for the user to be valid.
  - expression: "!user.username.startsWith('system:')"
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: 'username cannot used reserved system: prefix'
  - expression: "user.groups.all(group, !group.startsWith('system:'))"
    message: 'groups cannot used reserved system: prefix'
{{< /highlight >}}

* 클레임 검증 규칙 표현식

  `jwt.claimValidationRules[i].expression`은 CEL로 평가할 표현식을 나타낸다.
  CEL 표현식은 `claims` CEL 변수에 구성된 토큰 페이로드 내용에 접근할 수 있다.
  `claims`는 클레임 이름(문자열)을 클레임 값(모든 타입 가능)에 매핑한다.

* 사용자 검증 규칙 표현식

  `jwt.userValidationRules[i].expression`은 CEL로 평가할 표현식을 나타낸다.
  CEL 표현식은 `user` CEL 변수에 구성된 `userInfo` 내용에 접근할 수 있다.
  `user`의 스키마는 [UserInfo](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#userinfo-v1-authentication-k8s-io)
  API 문서를 참고한다.

* 클레임 매핑 표현식

  `jwt.claimMappings.username.expression`, `jwt.claimMappings.groups.expression`, `jwt.claimMappings.uid.expression`,
  `jwt.claimMappings.extra[i].valueExpression`은 CEL로 평가할 표현식을 나타낸다.
  CEL 표현식은 `claims` CEL 변수에 구성된 토큰 페이로드 내용에 접근할 수 있다.
  `claims`는 클레임 이름(문자열)을 클레임 값(모든 타입 가능)에 매핑한다.

  자세한 내용은 [CEL 문서](/docs/reference/using-api/cel/)를 참고한다.

  다음은 서로 다른 토큰 페이로드를 사용하는 `AuthenticationConfiguration`의 예시이다.

  {{< tabs name="example_configuration" >}}
  {{% tab name="유효한 토큰" %}}
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # the expression will evaluate to true, so validation will succeed.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  토큰 페이로드는 다음과 같다.

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  위 `AuthenticationConfiguration`에서 이 토큰은 다음 `UserInfo` 오브젝트를 생성하고 사용자를 성공적으로 인증한다.

  ```json
  {
      "username": "foo:external-user",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": ["72f988bf-86f1-41af-91ab-2d7cd011db4a"]
      }
  }
  ```
  {{% /tab %}}
  {{% tab name="클레임 검증 실패" %}}
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"' # the token below does not have this claim, so validation will fail.
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # the expression will evaluate to true, so validation will succeed.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  토큰 페이로드는 다음과 같다.

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  위 `AuthenticationConfiguration`에서는 `hd` 클레임이 `example.com`으로
  설정되어 있지 않으므로 토큰 인증에 실패한다. API 서버는 `401 Unauthorized` 오류를 반환한다.
  {{% /tab %}}
  {{% tab name="사용자 검증 실패" %}}
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"'
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: '"system:" + claims.username' # this will prefix the username with "system:" and will fail user validation.
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # the username will be system:foo and expression will evaluate to false, so validation will fail.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJoZCI6ImV4YW1wbGUuY29tIiwiaWF0IjoxNzAxMTEzMTAxLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwianRpIjoiYjViMDY1MjM3MmNkMjBlMzQ1YjZmZGZmY2RjMjE4MWY0YWZkNmYyNTlhYWI0YjdlMzU4ODEyMzdkMjkyMjBiYyIsIm5iZiI6MTcwMTExMzEwMSwicm9sZXMiOiJ1c2VyLGFkbWluIiwic3ViIjoiYXV0aCIsInRlbmFudCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0YSIsInVzZXJuYW1lIjoiZm9vIn0.FgPJBYLobo9jnbHreooBlvpgEcSPWnKfX6dc0IvdlRB-F0dCcgy91oCJeK_aBk-8zH5AKUXoFTlInfLCkPivMOJqMECA1YTrMUwt_IVqwb116AqihfByUYIIqzMjvUbthtbpIeHQm2fF0HbrUqa_Q0uaYwgy8mD807h7sBcUMjNd215ff_nFIHss-9zegH8GI1d9fiBf-g6zjkR1j987EP748khpQh9IxPjMJbSgG_uH5x80YFuqgEWwq-aYJPQxXX6FatP96a2EAn7wfPpGlPRt0HcBOvq5pCnudgCgfVgiOJiLr_7robQu4T1bis0W75VPEvwWtgFcLnvcQx0JWg
  ```

  토큰 페이로드는 다음과 같다.

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "hd": "example.com",
      "iat": 1701113101,
      "iss": "https://example.com",
      "jti": "b5b0652372cd20e345b6fdffcdc2181f4afd6f259aab4b7e35881237d29220bc",
      "nbf": 1701113101,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  위 `AuthenticationConfiguration`에서 이 토큰은 다음 `UserInfo` 오브젝트를 생성한다.

  ```json
  {
      "username": "system:foo",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": ["72f988bf-86f1-41af-91ab-2d7cd011db4a"]
      }
  }
  ```

  사용자 이름이 `system:`으로 시작하므로 사용자 검증에 실패한다.
  API 서버는 `401 Unauthorized` 오류를 반환한다.
  {{% /tab %}}
  {{< /tabs >}}



##### 제한 사항 {#oidc-limitations}

1. 분산 클레임은 [CEL](/docs/reference/using-api/cel/) 표현식으로 처리할 수 없다.

쿠버네티스는 OpenID Connect 신원 제공자를 제공하지 않는다.
기존 공개 OpenID Connect 신원 제공자를 사용하거나, OpenID Connect 프로토콜을
지원하는 자체 신원 제공자를 실행할 수 있다.

신원 제공자가 쿠버네티스와 함께 동작하려면 다음을 충족해야 한다.

1. [OpenID Connect 디스커버리](https://openid.net/specs/openid-connect-discovery-1_0.html)를 지원한다.

   OIDC 디스커버리를 사용하여 발급자의 공개 엔드포인트에서 서명 검증용 공개 키를 찾는다.
   인증 구성 파일을 사용하는 경우, 신원 제공자는 디스커버리 엔드포인트를 공개적으로 노출할 필요가 없다.
   디스커버리 엔드포인트를 발급자와 다른 위치(예: 클러스터 내부)에 호스팅하고, 구성 파일에
   `issuer.discoveryURL`을 지정할 수 있다.

1. 더 이상 사용되지 않는 암호가 아닌 안전한 암호를 사용하여 TLS로 실행한다.
1. CA가 서명한 인증서를 보유한다(CA가 상용 CA가 아니거나 자체 서명한 경우도 포함).

위의 세 번째 요구 사항인 CA 서명 인증서에 대해 추가로 설명한다. 자체 신원
제공자를 배포하는 경우, 자체 서명 인증서라도 `CA` 플래그가 `TRUE`로 설정된
인증서로 신원 제공자의 웹 서버 인증서에 반드시 서명해야 한다. 이는 Go 언어의
TLS 클라이언트 구현이 인증서 검증 표준을 매우 엄격하게 따르기 때문이다.
사용할 CA가 없다면 표준 인증서 생성 도구를 사용하여 간단한 CA와
서명된 인증서 및 키 쌍을 생성할 수 있다.

#### kubectl 사용하기 {#using-kubectl}

##### 방법 1 - OIDC 인증자 {#option-1-oidc-authenticator}

첫 번째 방법은 모든 요청에 `id_token`을 베어러 토큰으로 설정하고, 토큰이 만료되면 갱신하는
kubectl `oidc` 인증자를 사용하는 것이다. 제공자에 로그인한 후, kubectl을 사용하여
`id_token`, `refresh_token`, `client_id`, `client_secret`을 추가해 플러그인을 구성한다.

갱신 토큰 응답에 `id_token`을 포함하지 않는 제공자는 이 플러그인에서 지원하지 않으므로,
(`--token`을 지정하는) [방법 2](#option-2-use-the-token-option)를 사용해야 한다.

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token )
```

예를 들어 신원 제공자에 인증한 후 아래 명령을 실행한다.

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

그러면 아래와 같은 구성이 생성된다.

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```

`id_token`이 만료되면 `kubectl`은 `refresh_token`과 `client_secret`을 사용하여 `id_token`의 갱신을
시도하고, 새로운 `refresh_token`과 `id_token` 값을 `.kube/config`에 저장한다.

##### 방법 2 - `--token` 커맨드라인 인자 사용하기 {#option-2-use-the-token-option}

`kubectl` 명령은 `--token` 커맨드라인 인자로 토큰을 전달할 수 있다.
이 옵션에 `id_token`을 복사하여 붙여 넣는다.

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```


### 웹훅 토큰 인증 {#webhook-token-authentication}

쿠버네티스의 _웹훅 인증_ 은 베어러 토큰을 검증하기 위해 외부로 HTTP 호출을 수행하는 메커니즘이다.

API 서버의 구성 항목은 다음과 같다.

* `--authentication-token-webhook-config-file`: 원격 웹훅 서비스에 접근하는 방법을 설명하는 구성 파일이다.
* `--authentication-token-webhook-cache-ttl`: 인증 결정을 캐시하는 기간이다. 기본값은 2분이다.
* `--authentication-token-webhook-version`: 웹훅과 정보를 주고받을 때 `authentication.k8s.io/v1beta1` 또는 `authentication.k8s.io/v1`
  `TokenReview` 오브젝트 중 어느 것을 사용할지 결정한다. 기본값은 `v1beta1`이다.

구성 파일은 [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
파일 형식을 사용한다. 파일에서 `clusters`는 원격 서비스를 가리키고,
`users`는 API 서버 웹훅을 가리킨다. 예시는 다음과 같다.

```yaml
# Kubernetes API version
apiVersion: v1
# kind of the API object
kind: Config
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # CA for verifying the remote service.
      server: https://authn.example.com/authenticate # URL of remote service to query. 'https' recommended for production.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```

클라이언트가 [앞에서](#putting-a-bearer-token-in-a-request) 설명한 것처럼 베어러 토큰을 사용하여
API 서버에 인증하려고 하면, 인증 웹훅은 토큰을 포함한 `TokenReview` 오브젝트를
JSON으로 직렬화하여 원격 서비스에 POST 요청으로 보낸다.

웹훅 API 오브젝트에는 다른 쿠버네티스 API 오브젝트와 동일한 [버전 호환성 규칙](/docs/concepts/overview/kubernetes-api/)이 적용됨에 유의한다.
구현자는 올바르게 역직렬화할 수 있도록 요청의 `apiVersion` 필드를 확인해야 하며,
**반드시** 요청과 동일한 버전의 `TokenReview` 오브젝트로 응답해야 한다.

{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
쿠버네티스 API 서버는 하위 호환성을 위해 기본적으로 `authentication.k8s.io/v1beta1` 토큰리뷰(TokenReview)를 보낸다.
`authentication.k8s.io/v1` 토큰리뷰를 받으려면 `--authentication-token-webhook-version=v1`로 API 서버를 시작해야 한다.
{{< /note >}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

원격 서비스는 요청의 `status` 필드를 채워 로그인 성공 여부를 나타내야 한다.
응답 본문의 `spec` 필드는 무시되며 생략할 수 있다.
원격 서비스는 받은 것과 동일한 `TokenReview` API 버전으로 응답해야 한다.
베어러 토큰 검증에 성공하면 다음과 같이 반환한다.

{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

요청이 성공하지 못하면 다음과 같이 반환한다.

{{< tabs name="TokenReview_response_error" >}}
{{% tab name="authentication.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

### 인증 리버스 프록시 {#authenticating-proxy}

{{< warning >}}
다른 용도로도 사용하는 인증 기관(CA)이 있다면, 위험과 해당 CA의 사용을
보호하는 메커니즘을 이해하지 않는 한 그 인증 기관을
인증 프록시 클라이언트의 신원 확인용으로 **신뢰하지 않는다**.
{{< /warning >}}

`X-Remote-User`와 같은 요청 헤더 값으로 사용자를 식별하도록 API 서버를 구성할 수 있다.
이는 해당 헤더를 설정하는 _인증 프록시_ 와 함께 사용하도록 설계되었다.

인증 리버스 프록시 사용은 [사용자 가장(impersonation)](/docs/reference/access-authn-authz/user-impersonation/)과 다르다.
사용자 가장에서는 한 사용자가 API 서버에 다른 사용자가 보낸 것처럼 요청을
처리하도록 요구한다. 인증 리버스 프록시에서는 API 서버가 직접 연결된 클라이언트를 신뢰하여,
원래 요청을 보낸 주체의 신원 정보를 제공받는다.

커맨드라인 인자를 사용하여 구성하는 방법은
[웹 요청 헤더 구성](#api-server-authn-config-cli-reverse-proxy)을 참고한다.

#### 예시 {#authenticating-proxy-example}

예를 들어 다음 구성을 사용하는 경우,

```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

다음 요청은

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

다음 사용자 정보로 처리된다.

```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  acme.com/project:
  - some-project
  scopes:
  - openid
  - profile
```


#### 클라이언트 인증서 {#reverse-proxy-client-certificate}

헤더 위조를 방지하려면, 요청 헤더를 검사하기 전에 인증 프록시가 API 서버에
유효한 클라이언트 인증서를 제시하고 지정된 CA를 기준으로
검증받아야 한다.

요청 헤더 인증 모드의 [커맨드라인 옵션](#api-server-authn-config-cli-reverse-proxy)
레퍼런스를 참고한다.

<!-- deliberately repeating the earlier warning -->
위험과 CA의 사용을 보호하는 메커니즘을 이해하지 않는 한,
다른 용도로 사용하는 CA를 **재사용하지 않는다**.

### 정적 토큰 파일 통합 {#static-token-file}

API 서버는 커맨드라인에 `--token-auth-file=<SOMEFILE>` 옵션을
지정하면 파일에서 정적 베어러 토큰을 읽는다.
쿠버네티스 {{< skew currentVersion >}}에서 토큰은 무기한 유효하며, API 서버를
다시 시작하지 않고는 토큰 목록을 변경할 수 없다.

토큰 파일은 최소 세 개의 열(토큰, 사용자 이름, 사용자 UID)을 가진 CSV 파일이며,
뒤에 선택적으로 쉼표로 구분된 그룹 이름 목록이 올 수 있다.


{{< note >}}
그룹이 두 개 이상이면 해당 열을 큰따옴표로 묶어야 한다. 예시는 다음과 같다.

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

정적 토큰 파일은 본질적으로 유효 기간이 길고, 고정되어 있으며,
교체되지 않을 수도 있는 토큰에 적합하다. 또한 모니터링 에이전트와 같이
클라이언트가 컨트롤 플레인 내 특정 API 서버와 같은 곳에서 실행되는
경우에도 유용하다.

클러스터 프로비저닝 중 이 방식을 사용한 후 장기적으로 사용할
다른 인증 방식으로 전환한다면, 부트스트래핑에 사용한 토큰을
비활성화해야 한다. 이를 위해서는
각 API 서버를 다시 시작해야 한다.

그 밖의 상황, 특히 신속한 토큰 교체가 중요한 경우에는,
쿠버네티스 프로젝트는 이 메커니즘 대신
[웹훅 토큰 인증자](#webhook-token-authentication)를 사용할 것을 권장한다.

## 사용자 가장 {#user-impersonation}

[사용자 가장](/docs/reference/access-authn-authz/user-impersonation/)은
가장 헤더를 통해 사용자가 다른 사용자로 동작할 수 있는 방법을 제공한다.

## 인증 구성 {#api-server-authn-config}

쿠버네티스 인증은
[커맨드라인 인자](#api-server-authn-config-cli) 또는
[구성 파일](#api-server-authn-config-file)을 사용하여 구성할 수 있다.

일반적으로 두 방식을 함께 사용한다.

### 커맨드라인 인자를 통한 구성 {#api-server-authn-config-cli}

다음 커맨드라인 인자를 사용하여 클러스터 컨트롤 플레인이 클라이언트를 인증하는 방법을 구성할 수 있다.

API 서버의 [커맨드라인 레퍼런스](/docs/reference/command-line-tools-reference/kube-apiserver/)에서
관련된 모든 커맨드라인 인자를 더 자세히 설명한다.

#### 익명 인증 구성 {#api-server-authn-config-cli-anonymous}

`--anonymous-auth`
: 인증하지 않은 클라이언트가 API 서버의 보안 포트로 요청할 수 있는지 제어한다. 익명 요청의 사용자 이름은 `system:anonymous`이고, 그룹 이름은 `system:unauthenticated`이다. [익명 요청](#anonymous-requests)도 참고한다.

#### 부트스트랩 토큰 구성 {#api-server-authn-config-cli-bootstrap}

`--enable-bootstrap-token-auth`
: 이 플래그를 설정하면 [부트스트랩 토큰](#bootstrap-tokens)으로 인증할 수 있다.

#### 인증서 인증 구성 {#api-server-authn-config-cli-x-509}

`--client-ca-file`
: 클라이언트가 X.509 인증서 인증을 사용할 때 클라이언트의 신원을 검증하기 위한 신뢰 앵커(trust anchor)의 경로이다.

#### OIDC 구성 {#api-server-authn-config-cli-oidc}

`--oidc-ca-file`
: 클라이언트가 OIDC를 사용할 때 클라이언트의 신원을 검증하기 위한 신뢰 앵커의 경로이다.

`--oidc-client-id`
: OpenID Connect 클라이언트의 클라이언트 ID이다.

`--oidc-username-claim`
: 사용자 이름을 지정하는 JWT 클레임의 이름이다. 최종 사용자의 고유 식별자여야 하므로 기본 클레임 이름은 `sub`이다. `email`이나 `name`과 같은 다른 클레임을 선택할 수도 있다. `sub`나 `email` 이외의 클레임의 경우, kube-apiserver는 이름 충돌을 방지하기 위해 그룹 이름에 접두사를 추가한다.

`--oidc-username-prefix`
: 기존 이름(예: `system:` 사용자)과의 충돌을 방지하기 위해 사용자 이름 클레임 앞에 붙이는 접두사이다. 예를 들어 `oidc:`를 지정하면 `oidc:jane.doe`와 같은 사용자 이름을 만든다. 이 인자를 제공하지 않고 `--oidc-username-claim`이 `email` 이외의 값이면, 기본 접두사는 `( Issuer URL )#`이며 `( Issuer URL )`은 `--oidc-issuer-url` 값이다. 접두사 값을 `-`로 지정하면 사용자 이름 접두사를 비활성화할 수 있다.

`--oidc-groups-claim`
: 사용자 그룹을 지정하는 사용자 정의 OpenID Connect 클레임의 이름이다. 토큰의 클레임은 문자열 배열이어야 한다. 기본값은 없다.

`--oidc-groups-prefix`
: 기존 이름(예: `system:` 그룹)과의 충돌을 방지하기 위해 그룹 클레임 앞에 붙이는 접두사이다. 예를 들어 `oidc:`를 지정하면 `oidc:engineering` 및 `oidc:infra`와 같은 그룹 이름을 만든다. 기본 접두사는 `oidc:`이다.

`--oidc-issuer-url`
: OpenID 발급자의 URL이다. URL 스킴은 **반드시** `https`여야 한다. 발급자의 OIDC 디스커버리 URL이 `https://accounts.provider.example/.well-known/openid-configuration`이면, 값은 `https://accounts.provider.example`이어야 한다.

`--oidc-required-claim`
: 쿠버네티스가 클라이언트를 인증하기 전에 토큰에 반드시 존재해야 하는 클레임이다. 형식은 `key=value`이다. 이 인자는 여러 번 지정할 수 있다.

`--oidc-signing-algs`
: 허용하는 서명 알고리즘이다. 허용되는 값은 RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512이다. 값은 [RFC 7518](https://tools.ietf.org/html/rfc7518#section-3.1)에 정의되어 있다. 기본값은 `RS512`이다.

#### 서비스어카운트 구성 {#api-server-authn-config-cli-sa}

`--api-audiences`
: 서비스 어카운트 토큰의 인증 오디언스를 정의한다.

`--service-account-extend-token-expiration`
: 이 플래그는 토큰 생성 시 프로젝티드 서비스 어카운트 토큰의 만료 기간 연장을 활성화하여, 기존 토큰에서 바운드 서비스 어카운트 토큰 기능으로 안전하게 전환할 수 있도록 돕는다. [서비스 어카운트 자격 증명 인증](/docs/concepts/security/service-accounts/#authenticating-credentials)을 참고한다.

`--service-account-issuer`
: 서비스 어카운트 토큰 발급자의 식별자이다. 발급자는 발급하는 각 토큰의 `iss` 클레임에 이 식별자를 명시한다. 쿠버네티스 프로젝트는 스킴이 `https`인 URL을 사용할 것을 권장한다.

`--service-account-jwks-uri`
: `/.well-known/openid-configuration`에서 제공하는 디스커버리 문서의 [JSON 웹 키 집합(JSON Web Key Set)](https://www.rfc-editor.org/rfc/rfc7517) URI를 재정의한다.

`--service-account-key-file`
: 서비스어카운트 토큰을 검증하는 데 사용하는 PEM 인코딩된 X.509 공개 키 또는 개인 키(RSA 또는 ECDSA)를 포함한 파일의 경로이다. 지정된 파일에는 여러 키를 포함할 수 있으며, 서로 다른 경로로 인자를 여러 번 지정할 수 있다.

`--service-account-lookup`
: true이면 API 서버가 인증 과정의 일부로 서비스어카운트 토큰이 etcd에 존재하는지 검증한다.

`--service-account-max-token-expiration`
: 서비스 어카운트 토큰 발급자가 생성하는 토큰의 최대 유효 기간을 쿠버네티스 기간 문자열로 나타낸 값이다.

`--service-account-signing-endpoint`
: 외부 JWT 서명자가 수신 대기하는 소켓의 경로이다. 외부 토큰 서명자와 통합하는 데 사용할 수 있다.

`--service-account-signing-key-file`
: 서비스 어카운트 토큰 발급자의 현재 개인 키를 포함한 파일의 경로이다. API 서버가 실행 중일 때 이 파일을 변경해도 다시 읽지 **않는다**.

#### 정적 토큰 구성 {#api-server-authn-config-cli-bearer}

`--token-auth-file`
: [정적 베어러 토큰](#static-token-file)의 구성 파일 경로이다. API 서버가 실행 중일 때 이 파일을 변경해도 다시 읽지 **않는다**.

#### 웹훅 인증 구성 {#api-server-authn-config-cli-webhook}

`--authentication-token-webhook-cache-ttl`
: 토큰 검증을 위한 외부 HTTP 호출 결과를 API 서버가 캐시하는 기간으로, 쿠버네티스 기간 형식으로 지정한다.

`--authentication-token-webhook-config-file`
: API 서버가 외부 HTTP 호출을 할 때 인증하는 방법을 지정하는 kubeconfig 형식의 클라이언트 구성 경로이다. API 서버가 실행 중일 때 이 파일을 변경해도 다시 읽지 **않는다**.

`--authentication-token-webhook-version`
: 토큰을 검사하기 위해 외부 HTTP 호출을 할 때 사용할 토큰리뷰의 API 버전이다.

#### 웹 요청 인증 구성 {#api-server-authn-config-cli-reverse-proxy}

<!-- trailing whitespace (exactly two spaces) is significant in the following list -->

{{< caution >}}
반드시 따라야 하는 중요한 정보 보안 지침이 있으므로, 이 커맨드라인 인자를
지정하기 전에 [인증 프록시](#authenticating-proxy) 구성에 관한
문서를 읽어야 한다.
{{< /caution >}}

`--requestheader-client-ca-file`
: _필수._
  인증 프록시의 신원을 검증하기 위한 신뢰 앵커를 포함한 PEM 인코딩 인증서 번들의 경로이다.<br>
  요청 헤더에서 사용자 이름을 확인하기 전에 유효한
  [클라이언트 인증서](#reverse-proxy-client-certificate)를 제시하고, 지정된 파일에 포함된
  인증 기관을 기준으로 검증받아야 한다.

`--requestheader-allowed-names`
: _선택 사항._ 쉼표로 구분된 일반 이름(CN) 값의 목록이다.<br>
  설정하면 요청 헤더에서 사용자 이름을 확인하기 전에,
  지정된 목록에 포함된 CN을 가진 유효한 클라이언트 인증서를
  제시해야 한다. 비어 있으면 모든 CN을 허용한다.

`--requestheader-username-headers`
: _필수이며 대소문자를 구분하지 않는다._ 사용자 신원을 확인하기 위해 순서대로 검사할 헤더 이름이다.<br>
  값이 들어 있는 첫 번째 헤더를 사용자 이름으로 사용한다.

`--requestheader-group-headers`
: _선택 사항이며 대소문자를 구분하지 않는다._
  사용자의 그룹을 확인하기 위해 순서대로 검사할 헤더 이름이다.<br>
  `X-Remote-Group`을 권장한다.
  지정된 모든 헤더의 모든 값을 그룹 이름으로 사용한다.

`--requestheader-extra-headers-prefix`
: _선택 사항이며 대소문자를 구분하지 않는다._
  사용자에 대한 추가 정보를 확인하기 위해 찾을 헤더 접두사이다.<br>
  `X-Remote-Extra-`를 권장한다.
  추가 데이터는 일반적으로 구성된 인가 플러그인이 사용한다.
  지정된 접두사 중 하나로 시작하는 모든 헤더에서 접두사를 제거한다.
  나머지 헤더 이름을 소문자로 변환하고 [퍼센트 디코딩](https://tools.ietf.org/html/rfc3986#section-2.1)하여
  추가 정보의 키로 사용하며, 헤더 값을 추가 정보의 값으로 사용한다.


### 구성 파일을 통한 구성 {#api-server-authn-config-file}

{{< feature-state feature_gate_name="StructuredAuthenticationConfiguration" >}}

kube-apiserver에 `--authentication-config` 커맨드라인 인자를 지정하면, API 서버는
지정한 경로의 파일을 로드하고 그 내용으로 인증을 구성한다.

API 서버가 실행 중일 때도 해당 파일의 내용을 변경할 수 있으며, 변경하면 API 서버가 파일을 다시 읽는다.

{{< note >}}
이 파일은 원자적인 방식으로 수정해야 한다(예: 같은 위치에 임시 파일을 작성한 후, 임시 파일의 이름을 변경하여 이 파일을 대체한다).
{{< /note >}}

#### 구성 파일 경로 {#api-server-authn-config-cli-general}

`--authentication-config`
: 이 특별한 커맨드라인 인자는 [구성 파일을 사용하여 인증을 구성](#api-server-authn-config-file)하도록 지정한다.

#### 예시 {#api-server-authn-config-file-example}

다음은 쿠버네티스의 (구조화된) 인증 구성 파일 예시이다.

{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
---
#
# CAUTION: this is an example configuration.
#          Check and amend this before you use it in your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
anonymous:
  enabled: false
{{< /highlight >}}

## client-go 자격 증명 플러그인 {#client-go-credential-plugins}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

`k8s.io/client-go`와 이를 사용하는 `kubectl`, `kubelet` 등의 도구는 외부 명령을
실행하여 사용자 자격 증명을 받을 수 있다.

이 기능은 `k8s.io/client-go`가 기본적으로 지원하지 않는 인증 프로토콜
(LDAP, Kerberos, OAuth2, SAML 등)과의 클라이언트 측 통합을 위한 것이다. 플러그인은
프로토콜별 로직을 구현한 후, 클라이언트가 의미를 해석하지 않고 사용할 자격 증명을 반환한다. 거의 모든 자격 증명 플러그인
유스케이스에서는 클라이언트 플러그인이 생성한 자격 증명 형식을 해석하기 위해
[웹훅 토큰 인증자](#webhook-token-authentication)를 지원하는 서버 측 컴포넌트가 필요하다.

{{< note >}}
이전 `kubectl` 버전에는 AKS 및 GKE 인증을 위한 기본 지원이 포함되어 있었지만, 현재는 제공되지 않는다.
{{< /note >}}

### 유스케이스 예시 {#example-use-case}

가상의 유스케이스로, 조직이 LDAP 자격 증명을 사용자별 서명된 토큰으로 교환하는
외부 서비스를 운영한다고 가정한다. 이 서비스는 토큰을 검증하기 위한 [웹훅 토큰
인증자](#webhook-token-authentication) 요청에도 응답할 수 있다. 사용자는 워크스테이션에
자격 증명 플러그인을 설치해야 한다.

API에 인증하는 과정은 다음과 같다.

* 사용자가 `kubectl` 명령을 실행한다.
* 자격 증명 플러그인이 사용자에게 LDAP 자격 증명을 요청하고, 외부 서비스에서 이를 토큰으로 교환한다.
* 자격 증명 플러그인이 client-go에 토큰을 반환하면, client-go는 이를 API 서버에 대한 베어러 토큰으로 사용한다.
* API 서버는 [웹훅 토큰 인증자](#webhook-token-authentication)를 사용하여 외부 서비스에 `TokenReview`를 보낸다.
* 외부 서비스가 토큰의 서명을 검증하고 사용자의 사용자 이름과 그룹을 반환한다.

### 구성 {#configuration}

자격 증명 플러그인은 [kubectl 구성 파일](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)의
사용자 필드 일부로 구성한다.

{{< tabs name="exec_plugin_kubeconfig_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1beta1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Required.
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Optional.
      # Defaults to "IfAvailable".
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
{{% /tab %}}
{{< /tabs >}}

상대 명령 경로는 구성 파일의 디렉터리를 기준으로 해석한다.
KUBECONFIG가 `/home/jane/kubeconfig`이고 exec 명령이 `./bin/example-client-go-exec-plugin`이면,
`/home/jane/bin/example-client-go-exec-plugin` 바이너리를 실행한다.

```yaml
- name: my-user
  user:
    exec:
      # Path relative to the directory of the kubeconfig
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```

### 입력 및 출력 형식 {#input-and-output-formats}

실행된 명령은 `stdout`에 `ExecCredential` 오브젝트를 출력한다. `k8s.io/client-go`는
`status`에 반환된 자격 증명을 사용하여 쿠버네티스 API에 인증한다.
실행된 명령은 `KUBERNETES_EXEC_INFO` 환경 변수를 통해 `ExecCredential` 오브젝트를
입력으로 전달받는다. 이 입력에는 반환할 `ExecCredential` 오브젝트의 예상 API 버전이나,
플러그인이 `stdin`으로 사용자와 상호작용할 수 있는지 등 유용한
정보가 포함된다.

대화형 세션(즉, 터미널)에서 실행하면 `stdin`을 플러그인에 직접
노출할 수 있다. 플러그인은 `stdin`이 제공되었는지 확인하기 위해
`KUBERNETES_EXEC_INFO` 환경 변수에서 받은 입력 `ExecCredential` 오브젝트의
`spec.interactive` 필드를 사용해야 한다. 플러그인의 `stdin` 요구 사항
(즉, 플러그인이 성공적으로 실행되기 위해 `stdin`이 선택 사항인지, 반드시 필요한지,
전혀 사용하지 않는지)은
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)의 `user.exec.interactiveMode` 필드로
선언한다(유효한 값은 아래 표 참고). `user.exec.interactiveMode` 필드는
`client.authentication.k8s.io/v1beta1`에서는 선택 사항이며, `client.authentication.k8s.io/v1`에서는 필수이다.

{{< table caption="interactiveMode 값" >}}
| `interactiveMode` 값 | 의미 |
| ----------------------- | ------- |
| `Never` | 이 exec 플러그인은 표준 입력이 전혀 필요하지 않으므로, 사용자 입력을 위한 표준 입력의 사용 가능 여부와 관계없이 실행된다. |
| `IfAvailable` | 이 exec 플러그인은 표준 입력이 사용 가능하면 사용하려 하지만, 사용할 수 없어도 동작할 수 있다. 따라서 사용자 입력을 위한 stdin의 사용 가능 여부와 관계없이 실행된다. 사용자 입력을 위한 표준 입력을 사용할 수 있으면 이 exec 플러그인에 제공한다. |
| `Always` | 이 exec 플러그인은 실행에 표준 입력이 필요하므로, 사용자 입력을 위한 표준 입력을 사용할 수 있을 때만 실행된다. 표준 입력을 사용할 수 없으면 exec 플러그인을 실행하지 않고 플러그인 실행기가 오류를 반환한다. |
{{< /table >}}

베어러 토큰 자격 증명을 사용하려면, 플러그인은
[`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)의 status에 토큰을 반환한다.

{{< tabs name="exec_plugin_ExecCredential_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

또는 TLS 클라이언트 인증을 사용하기 위해 PEM 인코딩된 클라이언트 인증서와 키를 반환할 수 있다.
플러그인이 후속 호출에서 다른 인증서와 키를 반환하면, `k8s.io/client-go`는
새 TLS 핸드셰이크를 강제하기 위해 서버와의 기존 연결을 닫는다.

지정하는 경우, `clientKeyData`와 `clientCertificateData`가 모두 존재해야 한다.

`clientCertificateData`에는 서버에 보낼 추가 중간 인증서를 포함할 수 있다.

{{< tabs name="exec_plugin_ExecCredential_example_2" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

선택적으로 응답에 [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) 타임스탬프 형식의
자격 증명 만료 시점을 포함할 수 있다.

만료 시점의 유무는 다음과 같은 영향을 준다.

- 만료 시점을 포함하면, 만료 시점에 도달하거나 서버가 HTTP 상태 코드 401로
  응답하거나 프로세스가 종료될 때까지 베어러 토큰과 TLS 자격 증명을
  캐시한다.
- 만료 시점을 생략하면, 서버가 HTTP 상태 코드 401로 응답하거나
  프로세스가 종료될 때까지 베어러 토큰과 TLS 자격 증명을 캐시한다.

{{< tabs name="exec_plugin_ExecCredential_example_3" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

exec 플러그인이 클러스터별 정보를 얻을 수 있도록 하려면,
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)의 `user.exec` 필드에 `provideClusterInfo`를 설정한다.
그러면 `KUBERNETES_EXEC_INFO` 환경 변수를 통해 플러그인에 클러스터별 정보를 제공한다.
이 환경 변수의 정보를 사용하여 클러스터별 자격 증명
획득 로직을 수행할 수 있다.
다음 `ExecCredential` 매니페스트는 클러스터 정보 예시를 보여준다.

{{< tabs name="exec_plugin_ExecCredential_example_4" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{< /tabs >}}

## API를 통한 클라이언트 인증 정보 접근 {#self-subject-review}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

셀프서브젝트리뷰(SelfSubjectReview) API를 사용하면 쿠버네티스 클러스터가
인증 정보를 매핑하여 클라이언트를 식별하는 방식을 확인할 수 있다.
이는 사용자(일반적으로 실제 사람을 나타냄)로 인증하든
서비스어카운트로 인증하든 동작한다.

일반적인 쿠버네티스 클러스터에서는 인증된 모든 사용자가 셀프서브젝트리뷰를 생성할 수 있다.
이 작업에 대한 접근은 기본 제공 `system:basic-user`
[클러스터롤(ClusterRole)](/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)이 허용한다.

클라이언트가 자신의 신원을 확인하는 기능은 쿠버네티스 클러스터에서 사용하는 복잡한 인증 흐름의 문제를 해결할 때 매우 유용하다.
예를 들어 [웹훅 토큰 인증](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)이나
[인증 프록시](/docs/reference/access-authn-authz/authentication/#authenticating-proxy)를 사용하는 경우이다.

커맨드라인에서 이 정보를 조회하려면
[CLI를 통한 인증 정보 접근](#self-subject-review-cli)을 참고한다.

### HTTP를 통한 인증 정보 접근 {#self-subject-review-http-api}

셀프서브젝트리뷰에는 구성할 수 있는 필드가 없다. 요청을 받으면 쿠버네티스
API 서버는 사용자 속성으로 status를 채워 사용자에게 반환한다.
이는 이름이 있는 리소스를 클러스터에 영구 저장하지 **않는다**. 셀프서브젝트리뷰를
다시 가져올 수 없으며, `POST` 요청이 완료되면 버려진다.

요청 예시는 다음과 같다(본문은 셀프서브젝트리뷰이다).

```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews
```

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}
```

응답 예시는 다음과 같다.

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "janedoe@example.com",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ]
    }
  }
}
```


{{< note >}}
쿠버네티스 API 서버는 [가장](/docs/reference/access-authn-authz/authentication/#user-impersonation)을 포함한
모든 인증 메커니즘을 적용한 후 `userInfo`를 채운다.
사용자나 인증 프록시가 가장을 사용하여 셀프서브젝트리뷰를 생성하면,
가장한 사용자의 상세 정보와 속성이 표시된다.
{{< /note >}}

이 응답 예시는 사용 가능한 모든 필드를 보여주지는 않는다. 모든
인증 메커니즘이 사용 가능한 모든 필드를 채우는 것은 아니다.
사용할 수 있는 필드는 [셀프서브젝트리뷰 API 레퍼런스](/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/)를
참고한다.

다음은 `uid`와 `extra` 필드도 포함하는 다른 예시이다.

<!-- YAML highlighting intentional; JSON is valid YAML -->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "janedoe@example.com",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "uid": "000042",
      "extra": {
        "firstName": [
          "Jane"
        ],
        "familyName": [
          "Doe"
        ],
        "projectAssignments": [
          "web-frontend",
          "ai-training-proof-of-concept"
        ],
      }
    }
  }
}
```

이 선택적 필드의 데이터는 인증 통합 기능이나
해당 기능이 사용하는 사용자 데이터베이스에서 가져온다. 사용자 이름,
UID, 추가 정보, 이름이 `system:`으로 시작하지 않는 모든
그룹은 쿠버네티스 외부에서 가져온다.


HTTP로 쿠버네티스 API를 조회할 때는 `Accept:` HTTP 헤더를 사용하여 JSON 또는 YAML
응답을 요청할 수 있다. 예시는 다음과 같다.

{{< tabs name="self_subject_attributes_review_Example_1" >}}
{{% tab name="JSON" %}}
```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews HTTP/1.1
Accept: application/json;q=1.0
Content-Type: application/json
…other request headers

{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}

```

---

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "jane.doe",
      "uid": "b79dbf30-0c6a-11ed-861d-0242ac120002",
      "groups": [
        "students",
        "teachers",
        "system:authenticated"
      ],
      "extra": {
        "skills": [
          "reading",
          "learning"
        ],
        "subjects": [
          "math",
          "sports"
        ]
      }
    }
  }
}
```
{{% /tab %}}

{{% tab name="YAML" %}}
```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews HTTP/1.1
Accept: application/yaml;q=1.0
Content-Type: application/json
…other request headers

{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}

```

---

```yaml
apiVersion: authentication.k8s.io/v1
kind: SelfSubjectReview
status:
  userInfo:
    username: jane.doe
    uid: b79dbf30-0c6a-11ed-861d-0242ac120002
    groups:
    - students
    - teachers
    - system:authenticated
    extra:
      skills:
      - reading
      - learning
      subjects:
      - math
      - sports
```
{{% /tab %}}
{{< /tabs >}}

### CLI를 통한 인증 정보 접근 {#self-subject-review-cli}

편의를 위해 `kubectl auth whoami` 하위 명령도 제공한다.
```shell
kubectl auth whoami
```

출력은 다음과 유사하다.
```console
  ATTRIBUTE         VALUE
  Username          george.boole
  Groups            [system:authenticated]
```

자세한 내용은 [`kubectl auth whoami`](/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_whoami/)를
참고한다.


## {{% heading "whatsnext" %}}

* 사용자 인증서 발급에 대해 알아보려면 [CertificateSigningRequest를 사용하여 쿠버네티스 API 클라이언트 인증서 발급하기](/docs/tasks/tls/certificate-issue-client-csr/)를 읽는다.
* [클라이언트 인증 레퍼런스(v1)](/docs/reference/config-api/client-authentication.v1/)를 읽는다.
* [클라이언트 인증 레퍼런스(v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)를 읽는다.
