---
# reviewers:
# - mikedanese
title: 시크릿(Secret)
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: 시크릿과 구성 관리
  description: >
    사용자의 이미지를 다시 빌드하거나 스택 구성의 시크릿을 노출하지 않고 
    시크릿과 애플리케이션 구성을 배포하고 업데이트한다.
weight: 30
---

<!-- overview -->

시크릿은 암호, 토큰 또는 키와 같은 소량의 중요한 데이터를
포함하는 오브젝트이다. 이를 사용하지 않으면 중요한 정보가 {{< glossary_tooltip text="파드" term_id="pod" >}}
명세나 {{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}}에
포함될 수 있다. 시크릿을 사용한다는 것은 사용자의 기밀 데이터를
애플리케이션 코드에 넣을 필요가
없음을 뜻한다.

시크릿은 시크릿을 사용하는 파드와 독립적으로 생성될 수 있기 때문에,
파드를 생성하고, 확인하고, 수정하는 워크플로우 동안 시크릿(그리고 데이터)이
노출되는 것에 대한 위험을 경감시킬 수 있다. 쿠버네티스
및 클러스터에서 실행되는 애플리케이션은 민감한 데이터를 비휘발성
저장소에 쓰는 것을 피하는 것과 같이, 시크릿에 대해 추가 예방 조치를 취할 수도 있다.

시크릿은 {{< glossary_tooltip text="컨피그맵" term_id="configmap" >}}과 유사하지만
특별히 기밀 데이터를 보관하기 위한 것이다.

{{< caution >}}
쿠버네티스 시크릿은 기본적으로 API 서버의 기본 데이터 저장소(etcd)에 암호화되지 않은 상태로 저장된다. 
API 접근(access) 권한이 있는 모든 사용자 또는 etcd에 접근할 수 있는 모든 사용자는 시크릿을 조회하거나 수정할 수 있다.
또한 네임스페이스에서 파드를 생성할 권한이 있는 사람은 누구나
해당 접근을 사용하여 해당 네임스페이스의 모든 시크릿을 읽을 수 있다.
여기에는 디플로이먼트 생성 기능과 같은 간접 접근이 포함된다.

시크릿을 안전하게 사용하려면 최소한 다음의 단계를 따르는 것이 좋다.

1. 시크릿에 대해 [저장된 데이터 암호화(Encryption at Rest)를 활성화](/docs/tasks/administer-cluster/encrypt-data/)한다.
1. 시크릿에 대한 최소한의 접근 권한을 지니도록
   [RBAC 규칙을 활성화 또는 구성](/ko/docs/reference/access-authn-authz/authorization/)한다.
1. 특정 컨테이너에서만 시크릿에 접근하도록 한다.
1. [외부 시크릿 저장소 제공 서비스를 사용하는 것을 고려](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)한다.

시크릿의 보안성을 높이고 관리하는 데에 관한 가이드라인은
[쿠버네티스 시크릿에 관한 좋은 관행](/ko/docs/concepts/security/secrets-good-practices/)를 참고한다.

{{< /caution >}}

더 자세한 것은 [시크릿을 위한 정보 보안(Information security)](#시크릿을-위한-정보-보안-information-security)을 참고한다.

<!-- body -->

## 시크릿의 사용

다음과 같은 목적으로 시크릿을 사용할 수 있다.

- [컨테이너의 환경 변수 설정](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [SSH 키 또는 비밀번호와 같은 자격 증명을 파드에 제공](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [Kubelet이 프라이빗 레지스트리에서 컨테이너 이미지를 받아오도록 허용](/docs/tasks/configure-pod-container/pull-image-private-registry/).

쿠버네티스 컨트롤 플레인 또한 시크릿을 사용한다. 예를 들어,
[부트스트랩 토큰 시크릿](#부트스트랩-토큰-시크릿)은
노드 등록을 자동화하는 데 도움을 주는 메커니즘이다.

### 사용 사례: 시크릿 볼륨 안의 도트 파일(dotfile)

점으로 시작하는 키를 정의하여 데이터를 "숨김"으로 만들 수 있다.
이 키는 도트 파일 또는 "숨김" 파일을 나타낸다. 예를 들어, 다음 시크릿이 `secret-volume` 볼륨에
마운트되면 해당 볼륨에는 `.secret-file`이라는 단일 파일이 포함되며
`dotfile-test-container`는 `/etc/secret-volume/.secret-file` 경로에
이 파일을 가지게 된다.

{{< note >}}
점으로 시작하는 파일은 `ls -l` 명령의 출력에 표시되지 않는다.
디렉터리의 내용을 나열할 때 이러한 파일을 보려면 `ls -la`를 사용해야 한다.
{{< /note >}}

{{% code_sample language="yaml" file="secret/dotfile-secret.yaml" %}}

### 사용 사례: 파드의 한 컨테이너에 표시되는 시크릿

HTTP 요청을 처리하고, 복잡한 비즈니스 로직을 수행한 다음, HMAC이 있는 일부 메시지에
서명해야 하는 프로그램을 고려한다. 애플리케이션 로직이
복잡하기 때문에, 서버에 원격 파일 읽기 취약점이 발견되지 않은 채 존재할 수 
있으며, 이로 인해 개인 키가 공격자에게 노출될 수 있다.

이를 두 개의 컨테이너 안의 두 개의 프로세스로 분리할 수 있다. 프론트엔드 컨테이너는
사용자 상호작용과 비즈니스 로직을 처리하지만
개인 키는 볼 수 없고, 서명자 컨테이너는 개인 키를 볼 수 있으며 프론트엔드의
간단한 서명 요청(예: localhost 네트워킹을 통한 요청)에만 응답한다.

이 분할된 접근 방식을 사용하면, 공격자는 이제 애플리케이션 서버가 다소 임의적인 작업을
수행하도록 속여야 하며 이는 서버가 파일을 읽도록 만드는 것보다
더 어려울 수 있다.

### 시크릿의 대체품

기밀 데이터를 보호하기 위해 시크릿 대신 다음의 대안 중 하나를 고를 수 있다.

다음과 같은 대안이 존재한다.

- 클라우드 네이티브 구성 요소가 
  동일 쿠버네티스 클러스터 안에 있는 다른 애플리케이션에 인증해야 하는 경우, 
  [서비스어카운트(ServiceAccount)](/docs/reference/access-authn-authz/authentication/#service-account-tokens) 및 
  그의 토큰을 이용하여 클라이언트를 식별할 수 있다.
- 클러스터 내부 또는 외부에서 실행할 수 있는 써드파티 도구를 사용하여
  민감한 데이터를 관리할 수 있다. 예를 들어, 클라이언트가 올바르게 인증했을 때에만(예: 서비스어카운트 토큰으로 인증) 시크릿을 공개하고, 
  파드가 HTTPS를 통해서만 접근하도록 처리하는 서비스가 있을 수
  있다.
- 인증을 위해, X.509 인증서를 위한 커스텀 인증자(signer)를 구현하고, 
  [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)를 사용하여 
  해당 커스텀 인증자가 인증서를 필요로 하는 파드에 인증서를 발급하도록 할 수 있다.
- [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)을 사용하여 
  노드에 있는 암호화 하드웨어를 특정 파드에 노출할 수 있다. 
  예를 들어, 신뢰할 수 있는 파드를 별도로 구성된 TPM(Trusted Platform Module, 신뢰할 수 있는 플랫폼 모듈)을 제공하는 노드에 스케줄링할 수 있다.

위의 옵션들 및 시크릿 오브젝트 자체를 이용하는 옵션 중 2가지 이상을 조합하여 사용할 수도 있다.

예시: 외부 서비스에서 단기 유효(short-lived) 세션 토큰을 가져오는 
{{< glossary_tooltip text="오퍼레이터" term_id="operator-pattern" >}}를 구현(또는 배포)한 다음, 
이 단기 유효 세션 토큰을 기반으로 시크릿을 생성할 수 있다. 
클러스터의 파드는 이 세션 토큰을 활용할 수 있으며, 오퍼레이터는 토큰이 유효한지 검증해 준다. 
이러한 분리 구조는 곧 파드가 이러한 세션 토큰의 발급 및 갱신에 대한 정확한 메커니즘을 모르게 하면서도 파드를 실행할 수 있음을 의미한다.

## 시크릿 타입 {#secret-types}

시크릿을 생성할 때, [`Secret`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
리소스의 `type` 필드를 사용하거나, (활용 가능하다면) `kubectl` 의
유사한 특정 커맨드라인 플래그를 사용하여 시크릿의 타입을 명시할 수 있다.
시크릿 타입은 여러 종류의 기밀 데이터를 프로그래밍 방식으로 용이하게 처리하기 위해 사용된다.

쿠버네티스는 일반적인 사용 시나리오를 위해 몇 가지 빌트인 타입을 제공한다.
이 타입은 쿠버네티스가 부과하여 수행되는 검증 및 제약에
따라 달라진다.

| 빌트인 타입 | 사용처 |
|--------------|-------|
| `Opaque`     |  임의의 사용자 정의 데이터 |
| `kubernetes.io/service-account-token` | 서비스어카운트 토큰 |
| `kubernetes.io/dockercfg` | 직렬화 된(serialized) `~/.dockercfg` 파일 |
| `kubernetes.io/dockerconfigjson` | 직렬화 된 `~/.docker/config.json` 파일 |
| `kubernetes.io/basic-auth` | 기본 인증을 위한 자격 증명(credential) |
| `kubernetes.io/ssh-auth` | SSH를 위한 자격 증명 |
| `kubernetes.io/tls` | TLS 클라이언트나 서버를 위한 데이터 |
| `bootstrap.kubernetes.io/token` | 부트스트랩 토큰 데이터 |

사용자는 시크릿 오브젝트의 `type` 값에 비어 있지 않은 문자열을 할당하여 자신만의 시크릿 타입을 정의하고 사용할 수 있다 
(비어 있는 문자열은 `Opaque` 타입으로 인식된다).

쿠버네티스는 타입 명칭에 제약을 부과하지는 않는다. 
그러나 만약 빌트인 타입 중 하나를 사용한다면, 
해당 타입에 정의된 모든 요구 사항을 만족시켜야 한다.

공개 사용을 위한 시크릿 타입을 정의하는 경우, 규칙에 따라 
`cloud-hosting.example.net/cloud-api-credentials`와 같이 시크릿 타입 이름 앞에 도메인 이름 및 `/`를 추가하여 
전체 시크릿 타입 이름을 구성한다.

### 불투명(Opaque) 시크릿

`Opaque`는 시크릿 구성 파일에서 시크릿 타입을 명시적으로 지정하지 않았을 경우의 기본 시크릿 타입이다.
`kubectl`을 사용하여 시크릿을 생성할 때 `Opaque` 시크릿 타입을 나타내기
위해서는 `generic` 하위 커맨드를 사용해야 한다. 예를 들어, 다음 커맨드는
`Opaque` 타입의 비어 있는 시크릿을 생성한다.

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

출력은 다음과 같다.

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

해당 `DATA` 열은 시크릿에 저장된 데이터 아이템의 수를 보여준다.
이 경우, `0` 은 비어 있는 시크릿을 생성하였다는 것을 의미한다.

###  서비스어카운트 토큰 시크릿

`kubernetes.io/service-account-token` 시크릿 타입은 
{{< glossary_tooltip text="서비스어카운트" term_id="service-account" >}}를 식별하는 
토큰 자격 증명을 저장하는 데 사용된다. 이는
파드에 장기간 유효한 서비스어카운트 자격 증명을 제공하는
레거시 메커니즘이다.

1.22 버전 이후로는, 
[`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) 
API를 사용하여 수명이 짧고 자동으로 갱신되는 서비스어카운트 토큰을
얻는 방식을 권장한다. 이러한 수명이 짧은 토큰은 다음과 같은 방법으로 얻을 수 있다.

* `TokenRequest` API를 직접 호출하거나 `kubectl`과 같은 API 클라이언트를
  사용하여 호출한다. 예를 들어,
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
  커맨드를 사용할 수 있다.
* 파드 매니페스트에서
  [프로젝티드 볼륨](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)에
  토큰 마운트를 요청한다. 쿠버네티스는 토큰을 생성하여 파드에 마운트한다. 
  토큰은 마운트된 파드가 삭제되면 자동으로
  무효화된다. 자세한 내용은
  [서비스어카운트 토큰 프로젝션을 사용하여 파드 실행](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection)을 참고한다.

{{< note >}}
토큰을 얻기 위해 `TokenRequest` API를 사용할 수 없는 경우에만
서비스어카운트 토큰 시크릿을 생성해야 하며 만료되지 않는 토큰 자격 증명을
읽을 수 있는 API 오브젝트에 지속적으로 저장하는 데 따른 보안 노출을
감수할 수 있는 경우에만 생성해야 한다. 자세한 내용은
[서비스어카운트를 위한 장기간 유효한 API 토큰 수동 생성](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)을 참고한다.
{{< /note >}}

이 시크릿 타입을 사용할 때는, 
`kubernetes.io/service-account.name` 어노테이션이 존재하는 
서비스어카운트의 이름으로 설정되어 있는지 확인해야 한다. 만약 서비스어카운트와 
시크릿 오브젝트를 모두 생성하는 경우, 서비스어카운트를 먼저 생성해야 한다.

시크릿이 생성된 후, 쿠버네티스 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는 
`kubernetes.io/service-account.uid` 어노테이션과 
인증 토큰이 저장된 `data` 필드의 `token` 키와 같은 몇 가지 다른 필드들을 채운다.

다음은 서비스어카운트 토큰 시크릿을 선언하는 구성 예시이다.

{{% code_sample language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

시크릿을 만든 후, 쿠버네티스가 `data` 필드에 `token` 키를 채울 때까지 기다린다.

서비스어카운트의 동작 방식에 대한 자세한 내용은 [서비스어카운트](/docs/concepts/security/service-accounts/)
문서를 참고한다.
또한 파드에서 서비스어카운트 자격 증명을 참조하는 방법에 대한 정보는 
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)의
`automountServiceAccountToken` 필드와 `serviceAccountName`
필드를 통해 확인할 수 있다.

### 도커 컨피그 시크릿

컨테이너 이미지 레지스트리에 접근하기 위한 자격 증명을 저장하는 시크릿을 생성하는 경우, 
다음 `type` 값 중 하나를 해당 시크릿에 사용해야 한다.

- `kubernetes.io/dockercfg`: 도커 커맨드라인 구성하기 위한 레거시
  형식인 직렬화된 `~/.dockercfg`를 저장한다. 시크릿의 `data` 필드는
  base64로 인코딩된 `~/.dockercfg` 파일의 내용을 값으로 갖는
  `.dockercfg` 키를 포함한다.
- `kubernetes.io/dockerconfigjson`: `~/.dockercfg`의 새로운 형식인
  `~/.docker/config.json` 파일과 동일한 형식 규칙을 따르는
  직렬화된 JSON을 저장한다. 시크릿의 `data` 필드는 base64로
  인코딩된 `~/.docker/config.json` 파일의 내용을 값으로 갖는
  `.dockerconfigjson` 키를 포함해야 한다.

아래는 `kubernetes.io/dockercfg` 타입의 시크릿 예시이다.

{{% code_sample language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
만약 base64 인코딩 수행을 원하지 않는다면, 
`stringData` 필드를 대신 사용할 수 있다.
{{< /note >}}

매니페스트를 사용하여 도커 구성 시크릿을 생성하는 경우, API
서버는 해당 `data` 필드에 기대하는 키가 존재하는지 확인하고,
제공된 값이 유효한 JSON으로 파싱될 수 있는지 검증한다. API
서버가 해당 JSON이 실제 도커 구성 파일인지를 검증하지는 않는다.

도커 구성 파일이 없는 경우와 같이 컨테이너 레지스트리에 접근하기 위한
시크릿을 생성하려면 `kubectl`을 사용할 수도 있다.

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

이 커맨드는 `kubernetes.io/dockerconfigjson` 타입의 시크릿을 생성한다.

새로 생성한 시크릿에서 `.data.dockerconfigjson` 필드를 가져와 데이터를 
디코딩한다.

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

출력은 다음과 같은 JSON 문서이다(그리고 
이는 또한 유효한 도커 구성 파일이다).

```json
{
  "auths": {
    "my-registry.example:5000": {
      "username": "tiger",
      "password": "pass1234",
      "email": "tiger@acme.example",
      "auth": "dGlnZXI6cGFzczEyMzQ="
    }
  }
}
```

{{< caution >}}
위의 `auth` 값은 base64로 인코딩되어 있다. 이는 난독화된 것이지 암호화된 것이 아니다.
이 시크릿을 읽을 수 있는 사람은 누구나 레지스트리 접근 베어러 토큰을 알 수 있는 것이다.

필요한 시점에 풀 시크릿(pull secret)을 동적으로 안전하게 제공하기 위해 [자격 증명 제공자](/docs/tasks/administer-cluster/kubelet-credential-provider/)를 사용하는 것을 권장한다.
{{< /caution >}}

### 기본 인증(Basic authentication) 시크릿

`kubernetes.io/basic-auth` 타입은 기본 인증을 위한 자격 증명을 저장하기
위해 제공된다. 이 시크릿 타입을 사용할 때는 시크릿의 `data` 필드가
다음의 두 키 중 하나를 포함해야 한다.

- `username`: 인증을 위한 사용자 이름
- `password`: 인증을 위한 암호나 토큰

위 두 키의 값은 모두 base64로 인코딩된 문자열이다. 대신
시크릿 매니페스트의 `stringData` 필드를 사용하여 평문 텍스트 콘텐츠(clear text content)를
제공할 수도 있다.

다음의 메니페스트는 기본 인증 시크릿의 예시이다.

{{% code_sample language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
시크릿의 `stringData` 필드는 서버 사이드 적용(server-side apply)과 제대로 동작하지 않는다.
{{< /note >}}

이 기본 인증 시크릿 타입은 오직 사용자 편의를 위해 제공되는 것이다.
사용자는 기본 인증에서 사용할 자격 증명을 위해 `Opaque` 타입의 시크릿을 생성할 수도 있다. 
그러나, 미리 정의되어 공개된 시크릿 타입(`kubernetes.io/basic-auth`)을 사용하면 
다른 사람이 이 시크릿의 목적을 이해하는 데 도움이 되며, 
예상되는 키 이름에 대한 규칙이 설정된다. 

### SSH 인증 시크릿

이 빌트인 타입 `kubernetes.io/ssh-auth` 는 SSH 인증에 사용되는 데이터를
저장하기 위해서 제공된다. 이 시크릿 타입을 사용할 때는 `ssh-privatekey`
키-값 쌍을 사용할 SSH 자격 증명으로 `data` (또는 `stringData`)
필드에 명시해야 할 것이다.

다음 매니페스트는 
SSH 공개/개인 키 인증에 사용되는 시크릿 예시이다.

{{% code_sample language="yaml" file="secret/ssh-auth-secret.yaml" %}}

SSH 인증 시크릿 타입은 오직 편의를 위해 제공된다. 
사용자는 SSH 인증에서 사용할 자격 증명을 위해 `Opaque` 타입을 생성할 수도 있다. 
그러나, 미리 정의되어 공개된 시크릿 타입(`kubernetes.io/ssh-auth`)을 사용하면 
다른 사람이 이 시크릿의 목적을 이해하는 데 도움이 되며, 
예상되는 키 이름에 대한 규칙이 설정된다. 
쿠버네티스 API는 이 타입의 시크릿에 필요한 키가 설정되어 있는지 검증한다.

{{< caution >}}
SSH 개인 키는 자체적으로 SSH 클라이언트와 호스트 서버 간에 신뢰할 수 있는 통신을
설정하지 않는다. 컨피그맵(ConfigMap)에 추가된 `known_hosts` 파일과 같은
"중간자(man in the middle)" 공격을 완화하려면 신뢰를 설정하는
2차 수단이 필요하다.
{{< /caution >}}

### TLS 시크릿

`kubernetes.io/tls` 시크릿 타입은 일반적으로 TLS를 위해 사용되는 인증서 및 관련된 키를 저장하기 위한 것이다.

TLS 시크릿의 일반적인 용도 중 하나는 [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대한 
전송 암호화(encryption in transit)를 구성하는 것이지만, 
다른 리소스와 함께 사용하거나 워크로드에서 직접 사용할 수도 있다. 
이 타입의 시크릿을 사용할 때는 `tls.key` 와 `tls.crt` 키가 
시크릿 구성의 `data` (또는 `stringData`) 필드에서 제공되어야 한다. 
그러나, API 서버가 각 키에 대한 값이 유효한지 실제로 검증하지는 않는다.

`stringData`를 사용하는 대신 `data` 필드를 사용하여
base64로 인코딩된 인증서와 개인 키를 제공할 수도 있다. 자세한 내용은
[시크릿 이름 및 데이터에 대한 제약 사항](#restriction-names-data)을 참고한다.

다음 YAML은 TLS 시크릿을 위한 구성 예시를 포함한다.

{{% code_sample language="yaml" file="secret/tls-auth-secret.yaml" %}}

TLS 시크릿 타입은 오직 편의만을 위해서 제공된다.
사용자는 TLS 인증에서 사용할 자격 증명을 위해 `Opaque` 타입을 생성할 수도 있다. 
그러나, 미리 정의되어 공개된 시크릿 타입(`kubernetes.io/tls`)을 사용하면 
프로젝트에서 시크릿 형식의 일관성을 유지하는 데 도움이 된다. API 서버는
이 타입의 시크릿에 필요한 키가 설정되어 있는지 검증한다.

`kubectl`을 사용하여 TLS 시크릿을 생성하려면 `tls` 하위 커맨드를 사용한다.

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

공개/개인 키 쌍은 사전에 준비되어야 한다. `--cert`에 지정하는 공개 키 인증서는 .PEM 인코딩되어 있어야 하며
`--key`에 지정하는 개인 키와 일치해야 한다.

### 부트스트랩 토큰 시크릿

`bootstrap.kubernetes.io/token` 시크릿 타입은 노드 부트스트랩 과정 에서 사용되는
토큰을 위한 것이다. 이것은 잘 알려진 컨피그맵에 서명하는 데 사용되는
토큰을 저장한다.

부트스트랩 토큰 시크릿은 보통 `kube-system` 네임스페이스에 생성되며
`<token-id>` 가 해당 토큰 ID의 6개 문자의 문자열으로 구성된 `bootstrap-token-<token-id>` 형태로
이름이 지정된다.

쿠버네티스 매니페스트로서, 부트스트렙 토큰 시크릿은 다음과 유사할
것이다.

{{% code_sample language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

부트스트랩 토큰 시크릿은 `data` 아래 명시된 다음의 키들을 가진다.

- `token-id`: 토큰 식별자로 임의의 6개 문자의 문자열. 필수 사항.
- `token-secret`: 실제 토큰 시크릿으로 임의의 16개 문자의 문자열. 필수 사항.
- `description`: 토큰의 사용처를 설명하는 사람이 읽을 수 있는
  문자열. 선택 사항.
- `expiration`: 토큰이 만료되어야 하는 시기를 명시한 [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339)를
  사용하는 절대 UTC 시간. 선택 사항.
- `usage-bootstrap-<usage>`: 부트스트랩 토큰의 추가적인 사용처를 나타내는
  불리언(boolean) 플래그.
- `auth-extra-groups`: `system:bootstrappers` 그룹에 추가로 인증될
  쉼표로 구분된 그룹 이름 목록.

값을 base64로 인코딩하지 않고 시크릿의 `stringData` 필드에 대신
제공할 수 있다.

{{% code_sample language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
시크릿의 `stringData` 필드는 서버 사이드 적용(server-side apply)과 제대로 동작하지 않는다.
{{< /note >}}

## 시크릿 다루기

### 시크릿 생성하기

시크릿 생성에는 다음과 같은 방법이 있다.

- [`kubectl` 사용하기](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [환경 설정 파일 사용하기](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [kustomize 도구 사용하기](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

#### 시크릿 이름 및 데이터에 대한 제약 사항 {#restriction-names-data}

시크릿 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

사용자는 시크릿을 위한 파일을 구성할 때 `data` 및 (또는) `stringData` 필드를
명시할 수 있다. 해당 `data` 와 `stringData` 필드는 선택적으로 명시할 수 있다.
`data` 필드의 모든 키(key)에 해당하는 값(value)은 base64로 인코딩된 문자열이어야 한다.
만약 사용자에게 base64로의 문자열 변환이 적합하지 않다면,
임의의 문자열을 값으로 받는 `stringData` 필드를 대신 사용할 수 있다.

`data` 및 `stringData`의 키는 영숫자 문자,
`-`, `_`, 또는 `.` 으로 구성되어야 한다. `stringData` 필드의 모든 키-값 쌍은 의도적으로
`data` 필드로 합쳐진다. 만약 키가 `data` 와 `stringData` 필드 모두에 정의되어
있으면, `stringData` 필드에 지정된 값이
우선적으로 사용된다.

#### 크기 제한 {#restriction-data-size}

개별 시크릿의 크기는 1 MiB로 제한된다. 
이는 API 서버 및 kubelet 메모리를 고갈시킬 수 있는 매우 큰 시크릿의 생성을 방지하기 위함이다. 
그러나, 작은 크기의 시크릿을 많이 만드는 것도 메모리를 고갈시킬 수 있다. 
[리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)를 사용하여 
한 네임스페이스의 시크릿 (또는 다른 리소스) 수를 제한할 수 있다.

### 시크릿 수정하기

만들어진 시크릿은 [불변(immutable)](#secret-immutable)만 아니라면 수정될 수 있다.
시크릿 수정 방식은 다음과 같다.

* [`kubectl` 사용하기](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
* [설정 파일 사용하기](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

[Kustomize 도구](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret)로
시크릿 내부의 데이터를 수정하는 것도 가능하지만, 이 경우 수정된 데이터를 지닌 새로운 `Secret` 오브젝트가 생성된다.

시크릿을 생성한 방법이나 파드에서 시크릿이 어떻게 사용되는지에 따라,
존재하는 `Secret` 오브젝트에 대한 수정은 해당 데이터를 사용하는 파드들에 자동으로 전파된다.
자세한 정보는 [마운트된 시크릿의 자동 업데이트](#마운트된-시크릿의-자동-업데이트)를 참고하라.

### 시크릿 사용하기

시크릿은 데이터 볼륨으로 마운트되거나 파드의 컨테이너에서 사용할
{{< glossary_tooltip text="환경 변수" term_id="container-env-variables" >}}로
노출될 수 있다. 또한, 시크릿은 파드에 직접 노출되지 않고,
시스템의 다른 부분에서도 사용할 수 있다. 예를 들어, 시크릿은
시스템의 다른 부분이 사용자를 대신해서 외부 시스템과 상호 작용하는 데 사용해야 하는
자격 증명을 보유할 수 있다.

특정된 오브젝트 참조(reference)가 실제로 시크릿 유형의 오브젝트를 가리키는지 확인하기 위해, 
시크릿 볼륨 소스의 유효성이 검사된다. 
따라서, 시크릿은 자신에 의존하는 파드보다 먼저 생성되어야 한다.

시크릿을 가져올 수 없는 경우 
(아마도 시크릿이 존재하지 않거나, 또는 API 서버에 대한 일시적인 연결 불가로 인해) 
kubelet은 해당 파드 실행을 주기적으로 재시도한다. 
kubelet은 또한 시크릿을 가져올 수 없는 문제에 대한 세부 정보를 포함하여 해당 파드에 대한 이벤트를 보고한다.

#### 선택적 시크릿 {#restriction-secret-must-exist}

파드에서 시크릿을 참조할 때는 다음 예시와 같이 해당 시크릿을
_선택 사항_ 으로 표시할 수 있다. 선택 사항 시크릿이
존재하지 않는 경우 쿠버네티스는 이를 무시한다.

{{% code_sample language="yaml" file="secret/optional-secret.yaml" %}}

기본적으로 시크릿은 필수이다. 모든 필수 시크릿이 사용 가능해지기 전에는
파드의 어떤 컨테이너도 시작되지 않는다.

파드가 시크릿의 특정 필수 키를 참조하고 해당 시크릿이 존재하지만 지정한 키가 존재하지 않는 경우
파드는 시작 과정에서 실패한다.

### 파드에서 시크릿을 파일처럼 사용하기 {#using-secrets-as-files-from-a-pod}

파드 안에서 시크릿의 데이터에 접근하고 싶다면, 한 가지 방법은 
쿠버네티스로 하여금 해당 시크릿의 값을 
파드의 하나 이상의 컨테이너의 파일시스템 내에 파일 형태로 표시하도록 만드는 것이다.

자세한 지시 사항은
[볼륨을 통해 시크릿 데이터에 접근할 수 있는 파드 생성](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume)을 참고한다.

볼륨에 시크릿의 데이터가 포함되어 있고 해당 시크릿이 업데이트되면 쿠버네티스는 이를 추적하여
결과적 일관성(eventually-consistent) 방식을 사용해 볼륨의 데이터를 업데이트한다.

{{< note >}}
시크릿을
[subPath](/docs/concepts/storage/volumes#using-subpath) 볼륨 마운트로 사용하는 컨테이너는 시크릿의 자동 업데이트를
받지 않는다.
{{< /note >}}

kubelet은 해당 노드의 파드에서 볼륨으로 사용하는 시크릿의 현재 키와
값을 캐시에 보관한다.
kubelet이 캐시된 값의 변경을 감지하는 방식을 구성할 수도 있다.
[kubelet 구성](/docs/reference/config-api/kubelet-config.v1beta1/)의
`configMapAndSecretChangeDetectionStrategy` 필드가 kubelet이 사용할
전략을 제어한다. 기본 전략은 `감시(Watch)`이다.

시크릿의 업데이트는 API 감시 메커니즘(기본값), 유효 기간(time-to-live)이 정의된 캐시, 또는
각 kubelet 동기화 루프마다 클러스터 API 서버를 폴링하는 방식을 통해
전파될 수 있다.

따라서 시크릿이 업데이트되는 시점부터 새로운 키가 파드에 반영되는
시점까지의 전체 지연 시간은 kubelet 동기화 주기 + 캐시 전파 지연 시간만큼
길어질 수 있으며 여기서 캐시 전파 지연 시간은 선택한 캐시 유형에 따라
달라진다(앞 문단에서 나열한 순서대로 감시 전파 지연 시간,
구성된 캐시 TTL 또는 직접 폴링의 경우 0이다).

### 시크릿을 환경 변수 형태로 사용하기

파드에서 {{< glossary_tooltip text="환경 변수" term_id="container-env-variables" >}} 형태로
시크릿을 사용하려면 다음과 같이 한다.

1. 파드 명세의 각 컨테이너에 대해 사용하려는 각
  시크릿 키마다 `env[].valueFrom.secretKeyRef` 필드를 사용하는
  환경 변수를 추가한다.
1. 프로그램이 지정된 환경 변수에서 값을 찾도록 
   이미지 및/또는 커맨드 라인을 수정한다.

자세한 지시 사항은 
[시크릿 데이터를 사용하여 컨테이너 환경 변수 정의](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)를 참고한다.

파드에서 환경 변수 이름으로 사용할 수 있는 문자에는
[제약 사항](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config)이
있다는 점에 유의해야 한다. 일부 키가 규칙을 충족하지 않으면
해당 키는 컨테이너에서 사용할 수 없지만 파드는 정상적으로 시작된다.

### 컨테이너 이미지 풀 시크릿 {#using-imagepullsecrets}

비공개 저장소에서 컨테이너 이미지를 가져오고 싶다면, 
각 노드의 kubelet이 해당 저장소에 인증을 수행하는 방법을 마련해야 한다. 
이를 위해 _이미지 풀 시크릿_ 을 구성할 수 있다. 
이러한 시크릿은 파드 수준에 설정된다.

#### imagePullSecrets 사용하기

`imagePullSecrets` 필드는 동일한 네임스페이스의 시크릿에 대한 참조 목록이다.
`imagePullSecrets` 를 사용하여 도커(또는 다른 컨테이너) 이미지 레지스트리 비밀번호가 포함된 시크릿을 kubelet에 전달할 수 있다. 
kubelet은 이 정보를 사용해서 파드를 대신하여 프라이빗 이미지를 가져온다.
`imagePullSecrets` 필드에 대한 자세한 정보는 [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)를 참고한다.

##### imagePullSecret 수동으로 지정하기

[컨테이너 이미지](/ko/docs/concepts/containers/images/#파드에-imagepullsecrets-명시) 문서에서 
`imagePullSecrets`를 지정하는 방법을 배울 수 있다.

##### imagePullSecrets가 자동으로 연결되도록 준비하기

수동으로 `imagePullSecrets` 를 생성하고, 
서비스어카운트에서 이들을 참조할 수 있다. 
해당 서비스어카운트로 생성되거나 기본적인 서비스어카운트로 생성된 모든 파드는 
파드의 `imagePullSecrets` 필드를 가져오고 서비스어카운트의 필드로 설정한다. 
해당 프로세스에 대한 자세한 설명은 
[서비스어카운트에 ImagePullSecrets 추가하기](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)를 참고한다.

### 스태틱 파드에서의 시크릿 사용 {#restriction-static-pod}

{{< glossary_tooltip text="스태틱(static) 파드" term_id="static-pod" >}}에서는 
컨피그맵이나 시크릿을 사용할 수 없다.

## 불변(immutable) 시크릿 {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

쿠버네티스에서 특정 시크릿(및 컨피그맵)을 _불변_ 으로 표시할 수 있다.
기존 시크릿 데이터의 변경을 금지시키면 다음과 같은 이점을 가진다.

- 잘못된(또는 원치 않은) 업데이트를 차단하여 애플리케이션 중단을 방지
- (수만 개 이상의 시크릿-파드 마운트와 같이 시크릿을 대규모로 사용하는 클러스터의 경우,) 
  불변 시크릿으로 전환하면 kube-apiserver의 부하를 크게 줄여 클러스터의 성능을 향상시킬 수 있다. 
  kubelet은 불변으로 지정된 시크릿에 대해서는 
  [감시]를 유지할 필요가 없기 때문이다.

### 시크릿을 불변으로 지정하기 {#secret-immutable-create}

다음과 같이 시크릿의 `immutable` 필드를 `true`로 설정하여 불변 시크릿을 만들 수 있다.

```yaml
apiVersion: v1
kind: Secret
metadata: ...
data: ...
immutable: true
```

또한 기존의 수정 가능한 시크릿을 변경하여 불변 시크릿으로 바꿀 수도 있다.

{{< note >}}
시크릿 또는 컨피그맵이 불변으로 지정되면, 이 변경을 취소하거나 `data` 필드의 내용을 바꿀 수 _없다_. 
시크릿을 삭제하고 다시 만드는 것만 가능하다. 
기존의 파드는 삭제된 시크릿으로의 마운트 포인트를 유지하기 때문에, 
이러한 파드는 재생성하는 것을 추천한다.
{{< /note >}}

## 시크릿을 위한 정보 보안(Information security)

컨피그맵과 시크릿은 비슷하게 동작하지만, 
쿠버네티스는 시크릿 오브젝트에 대해 약간의 추가적인 보호 조치를 적용한다.

시크릿은 종종 다양한 중요도에 걸친 값을 보유하며, 이 중 많은 부분이
쿠버네티스(예: 서비스어카운트 토큰)와 외부 시스템으로 단계적으로
확대될 수 있다. 개별 앱이 상호 작용할 것으로 예상되는 시크릿의 힘에 대해 추론할 수 있더라도
동일한 네임스페이스 내의 다른 앱이 이러한 가정을
무효화할 수 있다.

권한 부여 구성은 네임스페이스 내에서 시크릿 데이터에 접근할 수 있는 방식에 영향을 미친다.
예를 들어, 시크릿에 대한 **list** 또는 **watch**
권한을 부여하면 해당 주체는 자신의 파드에서 명시적으로 참조하는 시크릿뿐만 아니라 해당 네임스페이스의
모든 시크릿 데이터를 읽을 수 있다. 워크로드가 동작하는 데 필요한 최소한의 권한으로 접근을 제한하고
관리 목적으로 필요한 경우가 아니라면 `cluster-admin`과 같은 광범위한 역할은
부여하지 않는다.

[권한 부여](/docs/reference/access-authn-authz/rbac/) 문서 또한 참고한다.

해당 노드의 파드가 필요로 하는 경우에만 시크릿이 노드로 전송된다. 
시크릿을 파드 내부로 마운트할 때, 기밀 데이터가 보존적인(durable) 저장소에 기록되지 않도록 하기 위해 
kubelet이 데이터 복제본을 `tmpfs`에 저장한다. 
해당 시크릿을 사용하는 파드가 삭제되면, 
kubelet은 시크릿에 있던 기밀 데이터의 로컬 복사본을 삭제한다.

파드에는 여러 개의 컨테이너가 있을 수 있다. 
기본적으로, 사용자가 정의한 컨테이너는 기본 서비스어카운트 및 이에 연관된 시크릿에만 접근할 수 있다. 
다른 시크릿에 접근할 수 있도록 하려면 
명시적으로 환경 변수를 정의하거나 컨테이너 내에 볼륨을 맵핑해야 한다.

동일한 노드의 여러 파드에 대한 시크릿이 있을 수 있다. 
그러나 잠재적으로는 파드가 요청한 시크릿만 해당 파드의 컨테이너 내에서 볼 수 있다. 
따라서, 하나의 파드는 다른 파드의 시크릿에 접근할 수 없다.

### 시크릿에 대한 최소 권한 접근 구성

시크릿에 대한 보안을 강화하려면 마운트된 시크릿에 대한 접근을 격리할 수 있도록 별도의 네임스페이스를 사용하는 것이 좋다.

{{< warning >}}
특정 노드에 대해 `privileged: true`가 설정되어 실행 중인 컨테이너들은 전부 
해당 노드에서 사용 중인 모든 시크릿에 접근할 수 있다.
{{< /warning >}}

## {{% heading "whatsnext" %}}

- 시크릿의 보안성을 높이고 관리하는 데에 관한 가이드라인을 원한다면
  [쿠버네티스 시크릿을 다루는 좋은 관행들](/ko/docs/concepts/security/secrets-good-practices/)을 참고하라.
- [`kubectl` 을 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/)하는 방법 배우기
- [구성 파일을 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/)하는 방법 배우기
- [kustomize를 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)하는 방법 배우기
- [API 레퍼런스](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)에서 `Secret`에 대해 읽기
