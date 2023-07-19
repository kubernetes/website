---
# reviewers:
# - erictune
# - lavalamp
# - deads2k
# - liggitt
title: 인증
content_type: concept
weight: 10
---

<!-- overview -->
이 페이지는 인증에 대한 개요를 제공합니다.


<!-- body -->
## 쿠버네티스에서의 사용자(Users)

모든 Kubernetes 클러스터는 Kubernetes가 관리하는 서비스 계정과 일반 사용자 두 가지 범주의 사용자를 가지고 있습니다.

일반 사용자는 다음과 같은 방식으로 클러스터-독립적인 서비스를 통해 관리됩니다:

- Private key를 배포하는 관리자
- Keystone이나 Google 계정과 같은 사용자 저장소
- 사용자 이름과 비밀번호 목록이 들어 있는 파일

위의 항목에 따르면, _Kubernetes는 일반 사용자 계정을 나타내는 객체를 갖고 있지 않습니다._
일반 사용자 계정은 API 호출을 통해 클러스터에 추가될 수 없습니다..

API 호출을 통해 일반 사용자를 추가할 수는 없지만, 클러스터의 인증서 기관(CA)에 의해 서명된 유효한 인증서를 제시하는 모든 사용자는 인증된 것으로 간주됩니다.
이 구성에서 Kubernetes는 인증서의 'subject'의 공통 이름 필드(예: "/CN=bob")에서 사용자 이름을 결정합니다.
그런 다음, 역할 기반 접근 제어(RBAC) 하위 시스템은 사용자가 특정 작업을 수행할 수 있는지 여부를 결정합니다. 
자세한 내용은 [certificate request](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
를 참조하십시오.

반면, 서비스 계정은 Kubernetes API에 의해 관리되는 사용자입니다. 서비스 계정은 특정 네임스페이스에 바인딩되며, 
API 서버에 의해 자동으로 생성되거나 API 호출을 통해 수동으로 생성됩니다. 서비스 계정은 `Secrets`로 저장된 일련의 
자격 증명과 연결되어 있으며, 이는 Pod에 마운트되어 클러스터 내부 프로세스가 Kubernetes API와 통신할 수 있게 합니다.

API 요청은 일반 사용자나 서비스 계정에 바인딩되거나 [anonymous requests](#anonymous-requests)으로 처리됩니다. 
이는 워크스테이션에서 'kubectl'을 입력하는 사용자부터 노드의 'kubelet' 및 control-plane 멤버까지, 
클러스터 내부 또는 외부의 모든 프로세스가 API 서버에 요청을 보낼 때 인증해야 하거나 익명 사용자로 처리되어야 함을 의미합니다.

## 인증 전략(Authentication strategies)

Kubernetes는 API 요청을 인증하기 위해 클라이언트 인증서, bearer token 또는 인증 프록시를 사용하여 인증 전략을 구현합니다. 
API 서버로 HTTP 요청이 전송될 때, 플러그인은 다음과 같은 속성을 요청과 연관시키려고 합니다:

* 사용자 이름(Username): 엔드 유저를 식별하는 문자열입니다. 일반적으로 `kube-admin` 또는 `jane@example.com`과 같은 값을 가질 수 있습니다.
* 사용자 식별자(UID): 사용자를 식별하는 문자열로, 사용자 이름보다 일관되고 고유하게 설정됩니다.
* 그룹(Group): 사용자가 소속된 명명된 논리적인 사용자 집합을 나타내는 문자열의 집합입니다. 
               일반적으로 `system:masters` 또는 `devops-team`과 같은 값을 가질 수 있습니다.
* 추가 필드(Extra fields): 인가자(authorizer)가 유용하게 활용할 수 있는 추가 정보를 문자열에서 문자열 리스트로 매핑한 map입니다.

이러한 값들은 인증 시스템에 대해 알 수 없으며[authorizer](/docs/reference/access-authn-authz/authorization/)가 해석할 때에만 의미가 있습니다.

여러 인증 방법을 동시에 활성화할 수도 있습니다. 일반적으로 다음과 같은 방법을 사용해야 합니다:
- 서비스 계정을 위한 서비스 계정 토큰
- 사용자 인증을 위한 적어도 하나의 다른 방법

여러 개의 인증 모듈이 활성화된 경우, 첫 번째로 요청을 성공적으로 인증하는 모듈이 평가를 중단시킵니다. 
API 서버는 인증자가 실행되는 순서를 보장하지 않습니다.

`system:authenticated` 그룹은 모든 인증된 사용자의 그룹 목록에 포함됩니다.

다른 인증 프로토콜 (LDAP, SAML, Kerberos, 대체 x509 스키마 등)과의 통합은 [인증 프록시](#authenticating-proxy) 또는
[인증 웹훅](#webhook-token-authentication)을 사용하여 수행할 수 있습니다.

### X509 Client Certs

클라이언트 인증서를 사용한 인증은 API 서버에 `--client-ca-file=SOMEFILE`옵션을 전달하여 활성화됩니다. 참조된 파일은 API 서버에 제시된 클라이언트 인증서를 검증하는 데 사용할 하나 이상의 인증 기관을 포함해야 합니다. 클라이언트 인증서가 제시되고 확인된 경우, 주체의 공통 이름이 요청의 사용자 이름으로 사용됩니다. Kubernetes 1.4부터는 클라이언트 인증서의 조직 필드를 사용하여 사용자의 그룹 소속을 나타낼 수도 있습니다. 사용자에 대해 여러 그룹 소속을 포함하려면 인증서에 여러 조직 필드를 포함하면 됩니다.

예를 들어, `openssl` 명령 줄 도구를 사용하여 인증서 서명 요청을 생성하는 방법은 다음과 같습니다:
``` bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```


다음은 "jbeda"라는 사용자 이름을 가진 CSR을 생성하며, "app1"과 "app2"라는 두 개의 그룹에 속하는 예시입니다.

클라이언트 인증서를 생성하는 방법에 대해서는 .[인증서 관리](/docs/tasks/administer-cluster/certificates/)를 참조 하십시오.

### Static Token File

API 서버는 커맨드 라인에서 `--token-auth-file=SOMEFILE` 옵션을 주면 파일에서 bearer token을 읽습니다. 현재 토큰은 무기한으로 유지되며, 토큰 목록을 변경하려면 API 서버를 재시작해야 합니다.

토큰 파일은 최소 3개의 열(토큰, 사용자 이름, 사용자 UID)로 구성된 CSV 파일입니다. 선택적으로 그룹 이름을 추가할 수도 있습니다.

{{< note >}}
여러 개의 그룹이 있는 경우, 해당 열은 이중 인용부호로 감싸야 합니다. 예:

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

#### HTTP request에 Bearer Token 넣기

HTTP 클라이언트에서 베어러 토큰 인증을 사용할 때, API 서버는 Authorization 헤더에 `Bearer <토큰>` 값을 예상합니다. bearer token은 HTTP의 인코딩 및 인용 기능을 사용하여 HTTP 헤더 값에 넣을 수 있는 문자열 시퀀스여야 합니다. 예를 들어, 베어러 토큰이 `31ada4fd-adec-460c-809a-9e56ceb75269`라면 아래와 같이 HTTP 헤더에 표시됩니다.

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

### Bootstrap Tokens

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

새로운 클러스터에 대한 간소화된 부트스트래핑을 위해, Kubernetes는 *Bootstrap Token*이라고 불리는 동적으로 관리된 bearer token을 포함합니다. 이러한 토큰은 `kube-system` 네임스페이스의 Secrets로 저장되어 동적으로 관리하고 생성할 수 있습니다. 컨트롤러 매니저에는 만료되는 부트스트랩 토큰을 삭제하는 TokenCleaner 컨트롤러가 포함되어 있습니다.

토큰은 [a-z0-9]{6}.[a-z0-9]{16} 형식을 가지고 있습니다. 첫 번째 구성 요소는 토큰 ID이고, 두 번째 구성 요소는 토큰 Secret입니다. 토큰은 다음과 같이 HTTP 헤더에 지정합니다:

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

API 서버에서는 `--enable-bootstrap-token-auth` 플래그를 사용하여 부트스트랩 토큰 인증을 활성화해야 합니다. 컨트롤러 매니저에서는 `--controllers` 플래그를 사용하여 TokenCleaner 컨트롤러를 활성화해야 합니다. 예를 들어 `--controllers=*,tokencleaner`와 같이 설정합니다. 클러스터 부트스트래핑에 kubeadm을 사용하는 경우, 이 작업은 `kubeadm`이 대신 수행해줍니다.

인증자는 `system:bootstrap:<Token ID>`로 인증됩니다. 이는 `system:bootstrappers` 그룹에 포함됩니다. 이러한 네이밍과 그룹은 의도적으로 부트스트래핑 이후에 이러한 토큰을 사용하지 않도록 제한되어 있습니다. 사용자 이름과 그룹은 (그리고 `kubeadm`에서 사용되는 대로) 클러스터 부트스트래핑을 지원하기 위해 적절한 인가 정책을 작성하는 데 사용될 수 있습니다.

부트스트랩 토큰 인증자와 컨트롤러에 대한 자세한 문서 및 `kubeadm`을 사용하여 이러한 토큰을 관리하는 방법은 [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)를 참조하십시오.

### Service Account Tokens

서비스 계정은 요청을 검증하기 위해 서명된 베어러 토큰을 사용하는 자동으로 활성화된 인증자입니다. 이 플러그인은 두 개의 선택적인 플래그를 사용합니다:

*`--service-account-key-file`: 서비스 계정 토큰을 검증하는 데 사용되는 PEM 형식의 x509 RSA 또는 ECDSA 개인 또는 공개 키가 포함된 파일입니다. 지정된 파일에는 여러 개의 키가 포함될 수 있으며, 다른 파일과 함께 여러 번의 플래그로 지정할 수 있습니다. 지정되지 않은 경우, --tls-private-key-file이 사용됩니다.
*`--service-account-lookup`: 활성화된 경우, API에서 삭제된 토큰은 폐기됩니다.

서비스 계정은 일반적으로 API 서버에 의해 자동으로 생성되며 `ServiceAccount`[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/)를 통해 클러스터에서 실행 중인 pod와 연결됩니다. bearer token은 알려진 위치의 pod에 마운트되어 클러스터 내부 프로세스가 API 서버와 통신할 수 있게 합니다. `PodSpec`의 `serviceAccountName` 필드를 사용하여 계정을 명시적으로 pod와 연관시킬 수도 있습니다.

{{< note >}}
`serviceAccountName`은 자동으로 처리되기에 보통 생략됩니다.
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

클러스터 외부에서도 서비스 계정 베어러 토큰은 완벽하게 유효하며, Kubernetes API와 통신하려는 장기 실행 작업에 대한 신원을 생성하는 데 사용할 수 있습니다. 수동으로 서비스 계정을 생성하려면 `kubectl create serviceaccount (이름)` 명령을 사용하십시오. 이렇게 하면 현재 네임스페이스에 서비스 계정이 생성됩니다.

```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount/jenkins created
```

associated token 만들기:

```bash
kubectl create token jenkins
```

```none
eyJhbGciOiJSUzI1NiIsImtp...
```

생성된 토큰은 서명된 JSON Web Token (JWT)입니다.

서명된 JWT는 주어진 서비스 계정으로 인증하는 데 사용할 수 있는 bearer token으로 사용될 수 있습니다. 토큰을 요청에 포함하는 방법에 대해서는 [위의 내용](#putting-a-bearer-token-in-a-request)을 참조하십시오. 일반적으로 이러한 토큰은 pod에 마운트되어 클러스터 내에서 API 서버에 접근하는 데 사용되지만, 클러스터 외부에서도 사용할 수 있습니다.

서비스 계정은 `system:serviceaccount:(네임스페이스):(서비스 계정)`과 같은 사용자 이름으로 인증되며, `system:serviceaccounts` 및 `system:serviceaccounts:(네임스페이스)` 그룹에 할당됩니다.

{{< warning >}}
서비스 계정 토큰은 Secret API 객체에 저장될 수도 있기 때문에 Secrets에 대한 쓰기 액세스 권한을 가진 사용자는 토큰을 요청할 수 있으며, 해당 Secrets에 대한 읽기 액세스 권한을 가진 사용자는 서비스 계정으로 인증할 수 있습니다. 서비스 계정에 대한 권한 및 Secrets에 대한 읽기 또는 쓰기 기능을 부여할 때 주의가 필요합니다. 사용자에게 부여하는 권한을 신중하게 관리해야 합니다.
{{< /warning >}}

### OpenID Connect Tokens

[OpenID Connect](https://openid.net/connect/) 은 OAuth2를 지원하는 일부 OAuth2 공급자, 특히 Azure Active Directory, Salesforce 및 Google에서 지원하는 OAuth2의 변형입니다. 이 프로토콜은 OAuth2의 주요 확장 기능으로 액세스 토큰과 함께 반환되는 [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)이라는 추가 필드를 가지고 있습니다. 이 토큰은 서버에 의해 서명된 사용자의 이메일과 같은 잘 알려진 필드가 포함된 JSON Web Token (JWT)입니다.

사용자를 식별하기 위해 인증자는 OAuth2 [토큰 응답](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)에서 `id_token`(access_token 아님)을 bearer token으로 사용합니다. 토큰이 요청에 포함되는 방법에 대해서는 [위의 내용](#putting-a-bearer-token-in-a-request)을 참조하십시오.

{{< mermaid >}}
sequenceDiagram
    participant user as User
    participant idp as Identity Provider
    participant kube as Kubectl
    participant api as API Server

    user ->> idp: 1. Login to IdP
    activate idp
    idp -->> user: 2. Provide access_token,<br>id_token, and refresh_token
    deactivate idp
    activate user
    user ->> kube: 3. Call Kubectl<br>with --token being the id_token<br>OR add tokens to .kube/config
    deactivate user
    activate kube
    kube ->> api: 4. Authorization: Bearer...
    deactivate kube
    activate api
    api ->> api: 5. Is JWT signature valid?
    api ->> api: 6. Has the JWT expired? (iat+exp)
    api ->> api: 7. User authorized?
    api -->> kube: 8. Authorized: Perform<br>action and return result
    deactivate api
    activate kube
    kube --x user: 9. Return result
    deactivate kube
{{< /mermaid >}}

1.  아이덴티티 제공자에 로그인합니다.
2.  아이덴티티 제공자는 `access_token`, `id_token`, `refresh_token`을 제공합니다.
3.  `kubectl`을 사용할 때 `id_token`을 `--token` 플래그와 함께 사용하거나 직접 `kubeconfig`에 추가합니다.
4.  `kubectl`은 `id_token`을 Authorization 헤더에 담아 API 서버로 전송합니다.
5.  API 서버는 구성에서 지정된 인증서와 비교하여 JWT 서명이 유효한지 확인합니다.
6.  `id_token`이 만료되지 않았는지 확인합니다.
7.  사용자에게 권한이 있는지 확인합니다.
8.  권한이 부여되면 API 서버가 `kubectl`에 응답을 반환합니다.
9.  `kubectl`은 사용자에게 피드백을 제공합니다.


Kubernetes는 신원 제공자로 "통신"할 필요가 없기 때문에 신원을 확인하는 데 필요한 모든 데이터가 `id_token`에 포함되어 있습니다. 모든 요청이 상태를 유지하지 않는(stateless) 모델에서는 인증에 대한 확장 가능한 솔루션을 제공합니다. 그러나 몇 가지 어려움이 있을 수 있습니다:

1. Kubernetes에는 인증 프로세스를 시작할 수 있는 "웹 인터페이스"가 없습니다. 자격 증명을 수집할 수 있는 브라우저나 인터페이스가 없으므로 먼저 신원 제공자에 대해 인증해야 합니다
2. `id_token`은 취소할 수 없으며, 인증서와 유사하게 동작합니다. 따라서 토큰은 수명이 짧아야 합니다(몇 분 정도). 이로 인해 몇 분마다 새 토큰을 가져와야 하는 번거로움이 있을 수 있습니다.
3. Kubernetes 대시보드에 인증하려면 `kubectl proxy` 명령을 사용하거나 `id_token`을 삽입하는 리버스 프록시를 사용해야 합니다.

#### Configuring the API Server

플러그인을 활성화 하기위해 API서버에 다음과 같은 플래그를 설정합니다:

| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | API 서버가 공개 서명 키를 검색할 수 있게 하는 제공자의 URL입니다. `https://` 스킴을 사용하는 URL만 허용됩니다. 일반적으로 경로가 없는 제공자의 검색 URL이며, 예를 들어 "https://accounts.google.com" 또는 "https://login.salesforce.com"과 같은 형식입니다. 이 URL은 .well-known/openid-configuration 아래의 수준을 가리켜야 합니다. | 만약 검색 URL이 `https://accounts.google.com/.well-known/openid-configuration`라면, 값은 `https://accounts.google.com`이어야 합니다. | Yes |
| `--oidc-client-id` | 모든 토큰이 발급되어야 하는 클라이언트 ID입니다. | kubernetes | Yes |
| `--oidc-username-claim` | 사용자 이름으로 사용할 JWT 클레임입니다. 기본값은 `sub`이며, 이는 최종 사용자의 고유 식별자로 사용됩니다. 관리자는 제공자에 따라 `email` 또는 `name`과 같은 다른 클레임을 선택할 수 있습니다. 그러나, 제공자에 따라서 외의 클레임은 다른 플러그인과의 이름 충돌을 방지하기 위해 발급자 URL과 접두사가 붙게 됩니다. | sub | No |
| `--oidc-username-prefix` | 기존 이름(예: `system:` 사용자)과 충돌을 방지하기 위해 사용자 이름 클레임 앞에 추가되는 접두사입니다. 예를 들어, 값으로 `oidc:`를 지정하면 `oidc:jane.doe`와 같은 사용자 이름이 생성됩니다. 이 플래그가 제공되지 않고 `--oidc-username-claim`이 `email`이 아닌 다른 값을 가지는 경우, 접두사는 `(발급자 URL)#`의 형식으로 기본값으로 설정됩니다. 여기서 `(발급자 URL)`은 `--oidc-issuer-url`의 값입니다. `-` 값을 사용하여 모든 접두사를 비활성화할 수도 있습니다. | `oidc:` | No |
| `--oidc-groups-claim` | 사용자 그룹으로 사용하기 위한 JWT claim 입니다. 해당 클레임이 존재하는 경우, 그룹은 문자열 배열이어야 합니다. | groups | No |
| `--oidc-groups-prefix` | 기존 이름(예: `system:` 그룹)과 충돌을 방지하기 위해 그룹 클레임 앞에 추가되는 접두사입니다. 예를 들어, 값으로 `oidc:`를 지정하면 `oidc:engineering` 및 `oidc:infra`와 같은 그룹 이름이 생성됩니다. | `oidc:` | No |
| `--oidc-required-claim` |ID 토큰에서 필요한 클레임을 설명하는 key=value 쌍입니다. 설정된 경우, 해당 클레임이 일치하는 값을 가진 ID 토큰에 있는지 확인합니다. 여러 개의 클레임을 지정하려면 이 플래그를 반복하여 사용하세요. | `claim=value` | No |
| `--oidc-ca-file` | 신원 제공자의 웹 인증서를 서명한 CA의 인증서 경로입니다. 기본값은 호스트의 루트 CA입니다. `/etc/kubernetes/ssl/kc-ca.pem`와 같은 경로를 사용할 수 있습니다. | No |
| `--oidc-signing-algs` | 허용된 서명 알고리즘 입니다. 기본값은 "RS256"입니다.. | `RS512` | No |

중요한 점은 API 서버가 OAuth2 클라이언트가 아니라는 것입니다. 대신 단일 발급자(trust a single issuer)를 신뢰하도록 구성할 수 있습니다. 이는 구글과 같은 공공 제공자(public providers)를 신뢰하지 않고도 제3자에게 발급된 자격 증명을 사용할 수 있도록 합니다. 여러 OAuth 클라이언트를 사용하고자 하는 관리자는 다른 클라이언트가 다른 클라이언트를 대신하여 토큰을 발급하는 메커니즘으로 `azp` (authorized party) 클레임을 지원하는 제공자를 탐색해야 합니다.

Kubernetes는 OpenID Connect Identity Provider를 제공하지 않습니다.
여러분은 이미 제공된 퍼블릭 OpenID Connect Identity Provider를 사용할 수 있습니다.(예: Google, or
[others](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)).
또는 여러분이 직접만든 제공자를 사용할 수도 있습니다., 예를 들어 [dex](https://dexidp.io/),
[Keycloak](https://github.com/keycloak/keycloak),
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa),
Tremolo Security's [OpenUnison](https://openunison.github.io/)등이 있습니다.

쿠버네티스와 함께 작동하려면 신원 제공자는 다음 요구 사항을 충족해야 합니다:

1.  [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)지원; 모든 신원자가 지원하진 않습니다.
2.  TLS를 사용하여 사용되지 않는 암호화 알고리즘을 피함
3.  CA에 의해 서명된 인증서 보유 (상업용 CA가 아니거나 자체 서명된 것이라도 가능)

강조할 점은 위에서 언급한 요구 사항 #3에 대한 내용인데, 신원 제공자를 직접 배포하는 경우 (Google이나 Microsoft와 같은 클라우드 제공자가 아닌 경우) 신원 제공자의 웹 서버 인증서는 `CA` 플래그가 `TRUE`로 설정된 인증서에 의해 서명되어야 합니다. 이 인증서는 자체 서명된 것일지라도 해당됩니다. 이는 GoLang의 TLS 클라이언트 구현이 인증서 유효성 검사에 대해 매우 엄격하게 준수해야 하는 표준 때문입니다. CA가 없는 경우 Dex 팀에서 제공하는 [이 스크립트](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh)를 사용하여 간단한 CA 및 서명된 인증서와 키 쌍을 생성할 수 있습니다. 또는 [이 유사한 스크립트](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh)를 사용할 수도 있습니다. 이 스크립트는 수명이 더 길고 키 사이즈가 큰 SHA256 인증서를 생성합니다. 

구체적인 시스템을 위한 설정 지침서:

- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)

#### Using kubectl

##### Option 1 - OIDC Authenticator

첫 번째 옵션은 kubectl의 `oidc` 인증기를 사용하는 것입니다. 이 옵션은 `id_token`을 모든 요청의 bearer token으로 설정하고 토큰이 만료되면 토큰을 자동으로 갱신합니다. 공급자에 로그인한 후 kubectl을 사용하여 `id_token`, `refresh_token`, `client_id` 및 `client_secret`을 추가하여 플러그인을 구성합니다.

리프레시 토큰 응답의 일부로 `id_token`을 반환하지 않는 공급자는 이 플러그인을 지원하지 않으며, 아래의 "option 2"를 사용해야 합니다.

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

예를 들어, 신원 제공자에 인증 후 아래의 커맨드를 실행하십시오:

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

아래와 같은 설정을 생성할 것 입니다:

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

`id_token`이 만료 되면, `kubectl`는 `refresh_token` 과 `client_secret`을 이용해 `id_token'을 갱신하려고 시도 할 것이며 `refresh_token` 과 `id_token`을 위한 새로운 값을 `.kube/config`에 저장할 것입니다.

##### Option 2 - Use the `--token` Option

The `kubectl` 명령어는 `--token` 옵션을 이용해 여러분을 허용합니다. 이 옵션에 `id_token`을 복사 후 붙혀넣기 하십시오:

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```


### Webhook Token Authentication

Webhook 인증은 bearer tokens을 검증하기 위한 hook입니다.

* `--authentication-token-webhook-config-file' 원격 웹훅 서비스에 액세스하는 방법을 설명하는 구성 파일입니다.
* `--authentication-token-webhook-cache-ttl` 인증 결정을 캐시하는 시간을 설정합니다. 기본값은 2분입니다.
* `--authentication-token-webhook-version` 웹훅과 정보를 주고받기 위해 `authentication.k8s.io/v1beta1` 또는 `authentication.k8s.io/v1` `TokenReview` 객체를 사용할지를 결정합니다. 기본값은 v1beta1입니다.

구성 파일은 [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)파일 형식을 사용합니다. 파일 내에서 `clusters`는 원격 서비스를 나타내며, `users`는 API 서버 웹훅을 나타냅니다. 예시는 다음과 같습니다:

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

클라이언트가 [위에서](#putting-a-bearer-token-in-a-request), 언급한 대로 bearer token을 사용하여 API 서버에 인증을 시도할 때, 인증 웹훅은 해당 토큰을 포함한 JSON 직렬화된 `TokenReview` 객체를 원격 서비스에게 POST합니다.

웹훅 API 객체는 다른 Kubernetes API 객체와 동일한 버전 호환성 규칙에 따릅니다. 구현자는 요청의 `apiVersion` 필드를 확인하여 올바른 역직렬화가 이루어졌는지 확인해야 하며,**반드시** 요청과 동일한 버전의 `TokenReview` 객체로 응답해야 합니다.
{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
쿠버네티스 API 서버는 하위 호환성을 위해 기본적으로 `authentication.k8s.io/v1beta1` 토큰 리뷰를 전송합니다. `authentication.k8s.io/v1` 토큰 리뷰를 수신하려면 API 서버를 `--authentication-token-webhook-version=v1` 옵션으로 시작해야 합니다. 이를 통해 v1 토큰 리뷰를 수신하기 위해 옵트인할 수 있습니다.
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

원격 서비스는 요청의 `status` 필드를 채워서 로그인 성공 여부를 나타내야 합니다. 응답 본문의 `spec` 필드는 무시되고 생략될 수 있습니다. 원격 서비스는 받은 `TokenReview API` 버전과 동일한 버전의 응답을 반환해야 합니다. bearer token의 유효성을 성공적으로 확인한 경우 다음과 같은 응답이 반환됩니다:

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

성공적이지 못한 요청에 대해 다음과 같이 반환됩니다:

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

### 인증 프록시(Authenticating Proxy)

API 서버는 `X-Remote-User`와 같은 요청 헤더 값에서 사용자를 식별할 수 있도록 구성할 수 있습니다. 이는 요청 헤더 값을 설정하는 인증 프록시와 함께 사용하기 위해 설계되었습니다.

* `--requestheader-username-headers` 필수이며 대소문자를 구분하지 않습니다. 사용자 신원을 확인하기 위해 확인할 헤더 이름들을 순서대로 지정합니다. 값이 포함된 첫 번째 헤더가 사용자 이름으로 사용됩니다.
* `--requestheader-group-headers` 1.6+. Optional, case-insensitive. "X-Remote-Group" is suggested. Header names to check, in order, for the user's groups. All values in all specified headers are used as group names.
* `--requestheader-extra-headers-prefix` 1.6+. Optional, case-insensitive. "X-Remote-Extra-" is suggested. Header prefixes to look for to determine extra information about the user (typically used by the configured authorization plugin). Any headers beginning with any of the specified prefixes have the prefix removed. The remainder of the header name is lowercased and [percent-decoded](https://tools.ietf.org/html/rfc3986#section-2.1) and becomes the extra key, and the header value is the extra value.

{{< note >}}
Prior to 1.11.3 (and 1.10.7, 1.9.11), the extra key could only contain characters which were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}

For example, with this configuration:

```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

this request:

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

would result in this user info:

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


In order to prevent header spoofing, the authenticating proxy is required to present a valid client
certificate to the API server for validation against the specified CA before the request headers are
checked. WARNING: do **not** reuse a CA that is used in a different context unless you understand
the risks and the mechanisms to protect the CA's usage.

* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate must be presented and validated against the certificate authorities in the specified file before the request headers are checked for user names.
* `--requestheader-allowed-names` Optional. List of Common Name values (CNs). If set, a valid client certificate with a CN in the specified list must be presented before the request headers are checked for user names. If empty, any CN is allowed.


## Anonymous requests

When enabled, requests that are not rejected by other configured authentication methods are
treated as anonymous requests, and given a username of `system:anonymous` and a group of
`system:unauthenticated`.

For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error.
A request providing no bearer token would be treated as an anonymous request.

In 1.5.1-1.5.x, anonymous access is disabled by default, and can be enabled by
passing the `--anonymous-auth=true` option to the API server.

In 1.6+, anonymous access is enabled by default if an authorization mode other than `AlwaysAllow`
is used, and can be disabled by passing the `--anonymous-auth=false` option to the API server.
Starting in 1.6, the ABAC and RBAC authorizers require explicit authorization of the
`system:anonymous` user or the `system:unauthenticated` group, so legacy policy rules
that grant access to the `*` user or `*` group do not include anonymous users.

## User impersonation

A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.

Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.

* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users have impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.

The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups. Optional. Requires "Impersonate-User".
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user. Optional. Requires "Impersonate-User". In order to be preserved consistently, `( extra name )` must be lower-case, and any characters which aren't [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6) MUST be utf8 and [percent-encoded](https://tools.ietf.org/html/rfc3986#section-2.1).
* `Impersonate-Uid`: A unique identifier that represents the user being impersonated. Optional. Requires "Impersonate-User". Kubernetes does not impose any format requirements on this string.

{{< note >}}
Prior to 1.11.3 (and 1.10.7, 1.9.11), `( extra name )` could only contain characters which were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}

{{< note >}}
`Impersonate-Uid` is only available in versions 1.22.0 and higher.
{{< /note >}}

An example of the impersonation headers used when impersonating a user with groups:
```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

An example of the impersonation headers used when impersonating a user with a UID and
extra fields:
```http
Impersonate-User: jane.doe@example.com
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
```

When using `kubectl` set the `--as` flag to configure the `Impersonate-User`
header, set the `--as-group` flag to configure the `Impersonate-Group` header.

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

Set the `--as` and `--as-group` flag:

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

{{< note >}}
`kubectl` cannot impersonate extra fields or UIDs.
{{< /note >}}

To impersonate a user, group, user identifier (UID) or extra fields, the impersonating user must
have the ability to perform the "impersonate" verb on the kind of attribute
being impersonated ("user", "group", "uid", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

For impersonation, extra fields and impersonated UIDs are both under the "authentication.k8s.io" `apiGroup`.
Extra fields are evaluated as sub-resources of the resource "userextras". To
allow a user to use impersonation headers for the extra field "scopes" and
for UIDs, a user should be granted the following role:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# Can set "Impersonate-Extra-scopes" header and the "Impersonate-Uid" header.
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Can impersonate the user "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Can impersonate the groups "developers" and "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Can impersonate the extras field "scopes" with the values "view" and "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# Can impersonate the uid "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
Impersonating a user or group allows you to perform any action as if you were that user or group;
for that reason, impersonation is not namespace scoped.
If you want to allow impersonation using Kubernetes RBAC, 
this requires using a `ClusterRole` and a `ClusterRoleBinding`,
not a `Role` and `RoleBinding`.
{{< /note >}}

## client-go credential plugins

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

`k8s.io/client-go` and tools using it such as `kubectl` and `kubelet` are able to execute an
external command to receive user credentials.

This feature is intended for client side integrations with authentication protocols not natively
supported by `k8s.io/client-go` (LDAP, Kerberos, OAuth2, SAML, etc.). The plugin implements the
protocol specific logic, then returns opaque credentials to use. Almost all credential plugin
use cases require a server side component with support for the [webhook token authenticator](#webhook-token-authentication)
to interpret the credential format produced by the client plugin.

### Example use case

In a hypothetical use case, an organization would run an external service that exchanges LDAP credentials
for user specific, signed tokens. The service would also be capable of responding to [webhook token
authenticator](#webhook-token-authentication) requests to validate the tokens. Users would be required
to install a credential plugin on their workstation.

To authenticate against the API:

* The user issues a `kubectl` command.
* Credential plugin prompts the user for LDAP credentials, exchanges credentials with external service for a token.
* Credential plugin returns token to client-go, which uses it as a bearer token against the API server.
* API server uses the [webhook token authenticator](#webhook-token-authentication) to submit a `TokenReview` to the external service.
* External service verifies the signature on the token and returns the user's username and groups.

### Configuration

Credential plugins are configured through [kubectl config files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
as part of the user fields.

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

Relative command paths are interpreted as relative to the directory of the config file. If
KUBECONFIG is set to `/home/jane/kubeconfig` and the exec command is `./bin/example-client-go-exec-plugin`,
the binary `/home/jane/bin/example-client-go-exec-plugin` is executed.

```yaml
- name: my-user
  user:
    exec:
      # Path relative to the directory of the kubeconfig
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```

### Input and output formats

The executed command prints an `ExecCredential` object to `stdout`. `k8s.io/client-go`
authenticates against the Kubernetes API using the returned credentials in the `status`.
The executed command is passed an `ExecCredential` object as input via the `KUBERNETES_EXEC_INFO`
environment variable. This input contains helpful information like the expected API version
of the returned `ExecCredential` object and whether or not the plugin can use `stdin` to interact
with the user.

When run from an interactive session (i.e., a terminal), `stdin` can be exposed directly
to the plugin. Plugins should use the `spec.interactive` field of the input
`ExecCredential` object from the `KUBERNETES_EXEC_INFO` environment variable in order to
determine if `stdin` has been provided. A plugin's `stdin` requirements (i.e., whether
`stdin` is optional, strictly required, or never used in order for the plugin
to run successfully) is declared via the `user.exec.interactiveMode` field in the
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (see table
below for valid values). The `user.exec.interactiveMode` field is optional in `client.authentication.k8s.io/v1beta1`
and required in `client.authentication.k8s.io/v1`.

{{< table caption="interactiveMode values" >}}
| `interactiveMode` Value | Meaning |
| ----------------------- | ------- |
| `Never` | This exec plugin never needs to use standard input, and therefore the exec plugin will be run regardless of whether standard input is available for user input. |
| `IfAvailable` | This exec plugin would like to use standard input if it is available, but can still operate if standard input is not available. Therefore, the exec plugin will be run regardless of whether stdin is available for user input. If standard input is available for user input, then it will be provided to this exec plugin. |
| `Always` | This exec plugin requires standard input in order to run, and therefore the exec plugin will only be run if standard input is available for user input. If standard input is not available for user input, then the exec plugin will not be run and an error will be returned by the exec plugin runner. |
{{< /table >}}

To use bearer token credentials, the plugin returns a token in the status of the
[`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)

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

Alternatively, a PEM-encoded client certificate and key can be returned to use TLS client auth.
If the plugin returns a different certificate and key on a subsequent call, `k8s.io/client-go`
will close existing connections with the server to force a new TLS handshake.

If specified, `clientKeyData` and `clientCertificateData` must both must be present.

`clientCertificateData` may contain additional intermediate certificates to send to the server.

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

Optionally, the response can include the expiry of the credential formatted as a
[RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) timestamp.

Presence or absence of an expiry has the following impact:

- If an expiry is included, the bearer token and TLS credentials are cached until
  the expiry time is reached, or if the server responds with a 401 HTTP status code,
  or when the process exits.
- If an expiry is omitted, the bearer token and TLS credentials are cached until
  the server responds with a 401 HTTP status code or until the process exits.

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

To enable the exec plugin to obtain cluster-specific information, set `provideClusterInfo` on the `user.exec`
field in the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
The plugin will then be supplied this cluster-specific information in the `KUBERNETES_EXEC_INFO` environment variable.
Information from this environment variable can be used to perform cluster-specific
credential acquisition logic.
The following `ExecCredential` manifest describes a cluster information sample.

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

## API access to authentication information for a client {#self-subject-review}

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

If your cluster has the API enabled, you can use the `SelfSubjectReview` API to find out how your Kubernetes cluster maps your authentication
information to identify you as a client. This works whether you are authenticating as a user (typically representing
a real person) or as a ServiceAccount.

`SelfSubjectReview` objects do not have any configurable fields. On receiving a request, the Kubernetes API server fills the status with the user attributes and returns it to the user.

Request example (the body would be a `SelfSubjectReview`):
```
POST /apis/authentication.k8s.io/v1beta1/selfsubjectreviews
```
```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "SelfSubjectReview"
}
```
Response example:

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "name": "jane.doe",
      "uid": "b6c7cfd4-f166-11ec-8ea0-0242ac120002",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "extra": {
        "provider_id": ["token.company.example"]
      }
    }
  }
}
```

For convenience, the `kubectl auth whoami` command is present. Executing this command will produce the following output (yet different user attributes will be shown):

* Simple output example
    ```
    ATTRIBUTE         VALUE
    Username          jane.doe
    Groups            [system:authenticated]
    ```

* Complex example including extra attributes
    ```
    ATTRIBUTE         VALUE
    Username          jane.doe
    UID               b79dbf30-0c6a-11ed-861d-0242ac120002
    Groups            [students teachers system:authenticated]
    Extra: skills     [reading learning]
    Extra: subjects   [math sports]
    ```
By providing the output flag, it is also possible to print the JSON or YAML representation of the result:

{{< tabs name="self_subject_attributes_review_Example_1" >}}
{{% tab name="JSON" %}}
```json
{
  "apiVersion": "authentication.k8s.io/v1alpha1",
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
```yaml
apiVersion: authentication.k8s.io/v1alpha1
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

This feature is extremely useful when a complicated authentication flow is used in a Kubernetes cluster, 
for example, if you use [webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) or [authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).

{{< note >}}
The Kubernetes API server fills the `userInfo` after all authentication mechanisms are applied,
including [impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation).
If you, or an authentication proxy, make a SelfSubjectReview using impersonation,
you see the user details and properties for the user that was impersonated.
{{< /note >}}

By default, all authenticated users can create `SelfSubjectReview` objects when the `APISelfSubjectReview` feature is enabled. It is allowed by the `system:basic-user` cluster role. 

{{< note >}}
You can only make `SelfSubjectReview` requests if:
* the `APISelfSubjectReview`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled for your cluster (enabled by default after reaching Beta)
* the API server for your cluster has the `authentication.k8s.io/v1alpha1` or `authentication.k8s.io/v1beta1`
  {{< glossary_tooltip term_id="api-group" text="API group" >}}
  enabled.
{{< /note >}}



## {{% heading "whatsnext" %}}

* Read the [client authentication reference (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
* Read the [client authentication reference (v1)](/docs/reference/config-api/client-authentication.v1/)

