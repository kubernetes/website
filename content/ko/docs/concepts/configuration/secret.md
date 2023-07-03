---
# reviewers:
# - mikedanese
title: 시크릿(Secret)
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
및 클러스터에서 실행되는 애플리케이션은 비밀 데이터를 비휘발성
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

파드가 시크릿을 사용하는 주요한 방법으로 다음의 세 가지가 있다.
- 하나 이상의 컨테이너에 마운트된
  {{< glossary_tooltip text="볼륨" term_id="volume" >}} 내의
  [파일](#using-secrets-as-files-from-a-pod)로써 사용.
- [컨테이너 환경 변수](#시크릿을-환경-변수-형태로-사용하기)로써 사용.
- 파드의 [이미지를 가져올 때 kubelet](#imagepullsecrets-사용하기)에 의해 사용.

쿠버네티스 컨트롤 플레인 또한 시크릿을 사용한다. 예를 들어,
[부트스트랩 토큰 시크릿](#부트스트랩-토큰-시크릿)은
노드 등록을 자동화하는 데 도움을 주는 메커니즘이다.

### 시크릿의 대체품

기밀 데이터를 보호하기 위해 시크릿 대신 다음의 대안 중 하나를 고를 수 있다.

다음과 같은 대안이 존재한다.

- 클라우드 네이티브 구성 요소가 
  동일 쿠버네티스 클러스터 안에 있는 다른 애플리케이션에 인증해야 하는 경우, 
  [서비스어카운트(ServiceAccount)](/docs/reference/access-authn-authz/authentication/#service-account-tokens) 및 
  그의 토큰을 이용하여 클라이언트를 식별할 수 있다.
- 비밀 정보 관리 기능을 제공하는 써드파티 도구를 
  클러스터 내부 또는 외부에 실행할 수 있다. 
  예를 들어, 클라이언트가 올바르게 인증했을 때에만(예: 서비스어카운트 토큰으로 인증) 비밀 정보를 공개하고, 
  파드가 HTTPS를 통해서만 접근하도록 처리하는 서비스가 있을 수 있다.
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

시크릿을 기반으로 컨테이너 환경 변수를 정의하는 경우, 
이 환경 변수를 _선택 사항_ 으로 표시할 수 있다. 
기본적으로는 시크릿은 필수 사항이다.

모든 필수 시크릿이 사용 가능해지기 전에는 
파드의 컨테이너가 시작되지 않을 것이다.

파드가 시크릿의 특정 키를 참조하고, 해당 시크릿이 존재하지만 해당 키가 존재하지 않는 경우, 
파드는 시작 과정에서 실패한다.

### 파드에서 시크릿을 파일처럼 사용하기 {#using-secrets-as-files-from-a-pod}

파드 안에서 시크릿의 데이터에 접근하고 싶다면, 한 가지 방법은 
쿠버네티스로 하여금 해당 시크릿의 값을 
파드의 하나 이상의 컨테이너의 파일시스템 내에 파일 형태로 표시하도록 만드는 것이다.

이렇게 구성하려면, 다음을 수행한다.

1. 시크릿을 생성하거나 기존 시크릿을 사용한다. 여러 파드가 동일한 시크릿을 참조할 수 있다.
1. `.spec.volumes[].` 아래에 볼륨을 추가하려면 파드 정의를 수정한다. 볼륨의 이름을 뭐든지 지정하고, 
   시크릿 오브젝트의 이름과 동일한 `.spec.volumes[].secret.secretName` 필드를 생성한다.
1. 시크릿이 필요한 각 컨테이너에 `.spec.containers[].volumeMounts[]` 를 추가한다. 
   시크릿을 표시하려는 사용되지 않은 디렉터리 이름에
   `.spec.containers[].volumeMounts[].readOnly = true`와 
   `.spec.containers[].volumeMounts[].mountPath`를 지정한다.
1. 프로그램이 해당 디렉터리에서 파일을 찾도록 이미지 또는 커맨드 라인을 수정한다. 시크릿 `data` 맵의 
   각 키는 `mountPath` 아래의 파일명이 된다.

다음은 볼륨에 `mysecret`이라는 시크릿을 마운트하는 파드의 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      optional: false # 기본값임; "mysecret" 은 반드시 존재해야 함
```

사용하려는 각 시크릿은 `.spec.volumes` 에서 참조해야 한다.

파드에 여러 컨테이너가 있는 경우, 모든 컨테이너는
자체 `volumeMounts` 블록이 필요하지만, 시크릿에 대해서는 시크릿당 하나의 `.spec.volumes` 만 필요하다.

{{< note >}}
쿠버네티스 v1.22 이전 버전은 쿠버네티스 API에 접근하기 위한 크리덴셜을 자동으로 생성했다. 
이러한 예전 메커니즘은 토큰 시크릿 생성 및 이를 실행 중인 파드에 마운트하는 절차에 기반했다. 
쿠버네티스 v{{< skew currentVersion >}} 버전을 포함한 최근 버전에서는, 
API 크리덴셜이 [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API를 사용하여 직접 얻어지고, 
[프로젝티드 볼륨](/ko/docs/reference/access-authn-authz/service-accounts-admin/#바인딩된-서비스-어카운트-토큰-볼륨)을 
사용하여 파드 내에 마운트된다. 
이러한 방법을 사용하여 얻은 토큰은 수명이 제한되어 있으며, 
토큰이 탑재된 파드가 삭제되면 자동으로 무효화된다.

여전히 서비스 어카운트 토큰 시크릿을 [수동으로 생성](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-a-service-account-api-token)할 수도 있다. 
예를 들어, 영원히 만료되지 않는 토큰이 필요한 경우에 활용할 수 있다. 
그러나, 이렇게 하기보다는 API 접근에 필요한 토큰을 얻기 위해 
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) 서브리소스를 사용하는 것을 권장한다.
`TokenRequest` API로부터 토큰을 얻기 위해 
[`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-) 커맨드를 사용할 수 있다.
{{< /note >}}

#### 특정 경로에 대한 시크릿 키 투영하기

시크릿 키가 투영되는 볼륨 내 경로를 제어할 수도 있다.
`.spec.volumes[].secret.items` 필드를 사용하여 각 키의 대상 경로를 변경할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

다음과 같은 일들이 일어날 것이다.

* `mysecret`의 `username` 키는 컨테이너의 `/etc/foo/username` 경로 대신 
  `/etc/foo/my-group/my-username` 경로에서 사용 가능하다.
* 시크릿 오브젝트의 `password` 키는 투영되지 않는다.

`.spec.volumes[].secret.items` 를 사용하면, `items` 에 지정된 키만 투영된다.
시크릿의 모든 키를 사용하려면, 모든 키가 `items` 필드에 나열되어야 한다.

키를 명시적으로 나열했다면, 나열된 모든 키가 해당 시크릿에 존재해야 한다. 
그렇지 않으면, 볼륨이 생성되지 않는다.

#### 시크릿 파일 퍼미션

단일 시크릿 키에 대한 POSIX 파일 접근 퍼미션 비트를 설정할 수 있다.
만약 사용자가 퍼미션을 지정하지 않는다면, 기본적으로 `0644` 가 사용된다.
전체 시크릿 볼륨에 대한 기본 모드를 설정하고 필요한 경우 키별로 오버라이드할 수도 있다.

예를 들어, 다음과 같은 기본 모드를 지정할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

시크릿이 `/etc/foo` 에 마운트되고, 
시크릿 볼륨 마운트로 생성된 모든 파일의 퍼미션은 `0400` 이다.

{{< note >}}
JSON을 사용하여 파드 또는 파드 템플릿을 정의하는 경우,
JSON 스펙은 8진수 표기법을 지원하지 않음에 유의한다.
`defaultMode` 값으로 대신 10진수를 사용할 수 있다(예를 들어, 8진수 0400은 10진수로는 256이다).
YAML로 작성하는 경우, `defaultMode` 값을 8진수로 표기할 수 있다.
{{< /note >}}

#### 볼륨으로부터 시크릿 값 사용하기

시크릿 볼륨을 마운트하는 컨테이너 내부에서, 시크릿 키는 파일 형태로 나타난다. 
시크릿 값은 base64로 디코딩되어 이러한 파일 내에 저장된다.

다음은 위 예시의 컨테이너 내부에서 실행된 명령의 결과이다.

```shell
ls /etc/foo/
```

출력 결과는 다음과 비슷하다.

```
username
password
```

```shell
cat /etc/foo/username
```

출력 결과는 다음과 비슷하다.

```
admin
```

```shell
cat /etc/foo/password
```

출력 결과는 다음과 비슷하다.

```
1f2d1e2e67df
```

컨테이너의 프로그램은 필요에 따라 
이러한 파일에서 시크릿 데이터를 읽는다.

#### 마운트된 시크릿의 자동 업데이트

볼륨이 시크릿의 데이터를 포함하고 있는 상태에서 시크릿이 업데이트되면, 쿠버네티스는 이를 추적하고 
최종적으로 일관된(eventually-consistent) 접근 방식을 사용하여 볼륨 안의 데이터를 업데이트한다.

{{< note >}}
시크릿을 [subPath](/ko/docs/concepts/storage/volumes/#subpath-사용하기)
볼륨 마운트로 사용하는 컨테이너는 자동 시크릿 업데이트를
받지 못한다.
{{< /note >}}

kubelet은 해당 노드의 파드의 볼륨에서 사용되는 시크릿의 현재 키 및 값 캐시를 유지한다. 
kubelet이 캐시된 값에서 변경 사항을 감지하는 방식을 변경할 수 있다. 
[kubelet 환경 설정](/docs/reference/config-api/kubelet-config.v1beta1/)의 `configMapAndSecretChangeDetectionStrategy` 필드는 
kubelet이 사용하는 전략을 제어한다. 기본 전략은 `Watch`이다.

시크릿 업데이트는 TTL(time-to-live)이 설정된 캐시 기반의 
API 감시(watch) 메커니즘에 의해 전파되거나 (기본값임), 
각 kubelet 동기화 때마다 클러스터 API 서버로부터의 폴링으로 달성될 수 있다.

결과적으로 시크릿이 업데이트되는 순간부터 
새 키가 파드에 투영되는 순간까지의 총 지연은 
kubelet 동기화 기간 + 캐시 전파 지연만큼 길어질 수 있다. 
여기서 캐시 전파 지연은 선택한 캐시 유형에 따라 다르다(이전 단락과 동일한 순서로 나열하면, 
감시(watch) 전파 지연, 설정된 캐시 TTL, 또는 직접 폴링의 경우 0임).

### 시크릿을 환경 변수 형태로 사용하기

파드에서 {{< glossary_tooltip text="환경 변수" term_id="container-env-variables" >}} 형태로
시크릿을 사용하려면 다음과 같이 한다.

1. 시크릿을 생성(하거나 기존 시크릿을 사용)한다. 여러 파드가 동일한 시크릿을 참조할 수 있다.
1. 사용하려는 각 시크릿 키에 대한 환경 변수를 추가하려면 
   시크릿 키 값을 사용하려는 각 컨테이너에서 파드 정의를 수정한다. 
   시크릿 키를 사용하는 환경 변수는 시크릿의 이름과 키를 `env[].valueFrom.secretKeyRef` 에 채워야 한다.
1. 프로그램이 지정된 환경 변수에서 값을 찾도록 
   이미지 및/또는 커맨드 라인을 수정한다.

다음은 환경 변수를 통해 시크릿을 사용하는 파드의 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
            optional: false # 기본값과 동일하다
                            # "mysecret"이 존재하고 "username"라는 키를 포함해야 한다
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
            optional: false # 기본값과 동일하다
                            # "mysecret"이 존재하고 "password"라는 키를 포함해야 한다
  restartPolicy: Never
```


#### 올바르지 않은 환경 변수 {#restriction-env-from-invalid}

유효하지 않은 환경 변수 이름으로 간주되는 키가 있는 `envFrom` 필드로 
환경 변수를 채우는 데 사용되는 시크릿은 해당 키를 건너뛴다. 
하지만 파드를 시작할 수는 있다.

유효하지 않은 변수 이름이 파드 정의에 포함되어 있으면, 
`reason`이 `InvalidVariableNames`로 설정된 이벤트와 
유효하지 않은 스킵된 키 목록 메시지가 파드 시작 실패 정보에 추가된다. 
다음 예시는 2개의 유효하지 않은 키 `1badkey` 및 `2alsobad`를 포함하는 `mysecret` 시크릿을 참조하는 파드를 보여준다.

```shell
kubectl get events
```

출력은 다음과 같다.

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```


#### 환경 변수로부터 시크릿 값 사용하기

환경 변수 형태로 시크릿을 사용하는 컨테이너 내부에서, 
시크릿 키는 일반적인 환경 변수로 보인다. 
이러한 환경 변수의 값은 시크릿 데이터를 base64 디코드한 값이다.

다음은 위 예시 컨테이너 내부에서 실행된 명령의 결과이다.

```shell
echo "$SECRET_USERNAME"
```

출력 결과는 다음과 비슷하다.

```
admin
```

```shell
echo "$SECRET_PASSWORD"
```

출력 결과는 다음과 비슷하다.

```
1f2d1e2e67df
```

{{< note >}}
컨테이너가 이미 환경 변수 형태로 시크릿을 사용하는 경우, 
컨테이너가 다시 시작되기 전에는 
시크릿 업데이트를 볼 수 없다. 
시크릿이 변경되면 컨테이너 재시작을 트리거하는 써드파티 솔루션이 존재한다.
{{< /note >}}

### 컨테이너 이미지 풀 시크릿 {#using-imagepullsecrets}

비공개 저장소에서 컨테이너 이미지를 가져오고 싶다면, 
각 노드의 kubelet이 해당 저장소에 인증을 수행하는 방법을 마련해야 한다. 
이를 위해 _이미지 풀 시크릿_ 을 구성할 수 있다. 
이러한 시크릿은 파드 수준에 설정된다.

파드의 `imagePullSecrets` 필드는 파드가 속한 네임스페이스에 있는 시크릿들에 대한 참조 목록이다.
`imagePullSecrets`를 사용하여 이미지 저장소 접근 크리덴셜을 kubelet에 전달할 수 있다. 
kubelet은 이 정보를 사용하여 파드 대신 비공개 이미지를 가져온다.
`imagePullSecrets` 필드에 대한 더 많은 정보는 
[파드 API 레퍼런스](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)의 
`PodSpec` 부분을 확인한다.

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
서비스어카운트(ServiceAccount)에서 이들을 참조할 수 있다. 
해당 서비스어카운트로 생성되거나 기본적인 서비스어카운트로 생성된 모든 파드는 
파드의 `imagePullSecrets` 필드를 가져오고 서비스 어카운트의 필드로 설정한다. 
해당 프로세스에 대한 자세한 설명은 
[서비스 어카운트에 ImagePullSecrets 추가하기](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)를 참고한다.

### 스태틱 파드에서의 시크릿 사용 {#restriction-static-pod}

{{< glossary_tooltip text="스태틱(static) 파드" term_id="static-pod" >}}에서는 
컨피그맵이나 시크릿을 사용할 수 없다.

## 사용 사례

### 사용 사례: 컨테이너 환경 변수로 사용하기

시크릿 정의를 작성한다.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```

시크릿을 생성한다.
```shell
kubectl apply -f mysecret.yaml
```

모든 시크릿 데이터를 컨테이너 환경 변수로 정의하는 데 `envFrom` 을 사용한다. 시크릿의 키는 파드의 환경 변수 이름이 된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

### 사용 사례: SSH 키를 사용하는 파드

몇 가지 SSH 키를 포함하는 시크릿을 생성한다.

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

출력 결과는 다음과 비슷하다.

```
secret "ssh-key-secret" created
```

SSH 키를 포함하는 `secretGenerator` 필드가 있는 `kustomization.yaml` 를 만들 수도 있다.

{{< caution >}}
사용자 자신의 SSH 키를 보내기 전에 신중하게 생각한다. 
클러스터의 다른 사용자가 시크릿에 접근할 수 있게 될 수도 있기 때문이다.

대신, 쿠버네티스 클러스터를 공유하는 모든 사용자가 접근할 수 있으면서도, 
크리덴셜이 유출된 경우 폐기가 가능한 서비스 아이덴티티를 가리키는 
SSH 프라이빗 키를 만들 수 있다.
{{< /caution >}}

이제 SSH 키를 가진 시크릿을 참조하고
볼륨에서 시크릿을 사용하는 파드를 만들 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

컨테이너의 명령이 실행될 때, 다음 위치에서 키 부분을 사용할 수 있다.

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

그러면 컨테이너는 SSH 연결을 맺기 위해 시크릿 데이터를 자유롭게 사용할 수 있다.

### 사용 사례: 운영 / 테스트 자격 증명을 사용하는 파드

이 예제에서는 
운영 환경의 자격 증명이 포함된 시크릿을 사용하는 파드와 
테스트 환경의 자격 증명이 있는 시크릿을 사용하는 다른 파드를 보여준다.

사용자는 `secretGenerator` 필드가 있는 `kustomization.yaml` 을 만들거나
`kubectl create secret` 을 실행할 수 있다.

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

출력 결과는 다음과 비슷하다.

```
secret "prod-db-secret" created
```

테스트 환경의 자격 증명에 대한 시크릿을 만들 수도 있다.

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

출력 결과는 다음과 비슷하다.

```
secret "test-db-secret" created
```

{{< note >}}
`$`, `\`, `*`, `=` 그리고 `!` 와 같은 특수 문자는 사용자의 [셸](https://ko.wikipedia.org/wiki/셸)에 의해 해석되고 이스케이핑이 필요하다.

대부분의 셸에서 비밀번호를 이스케이프하는 가장 쉬운 방법은 작은 따옴표(`'`)로 묶는 것이다.
예를 들어, 실제 비밀번호가 `S!B\*d$zDsb=` 이면, 다음과 같은 명령을 실행해야 한다.

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

파일(`--from-file`)에서는 비밀번호의 특수 문자를 이스케이프할 필요가 없다.
{{< /note >}}

이제 파드를 생성한다.

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

동일한 `kustomization.yaml`에 파드를 추가한다.

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

다음을 실행하여 API 서버에 이러한 모든 오브젝트를 적용한다.

```shell
kubectl apply -k .
```

두 컨테이너 모두 각 컨테이너의 환경에 대한 값을 가진 파일시스템에 
다음의 파일이 존재한다.

```
/etc/secret-volume/username
/etc/secret-volume/password
```

두 파드의 사양이 한 필드에서만 어떻게 다른지 확인한다. 이를 통해
공통 파드 템플릿에서 다양한 기능을 가진 파드를 생성할 수 있다.

두 개의 서비스 어카운트를 사용하여 기본 파드 명세를 더욱 단순화할 수 있다.

1. `prod-db-secret` 을 가진 `prod-user`
1. `test-db-secret` 을 가진 `test-user`

파드 명세는 다음과 같이 단축된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### 사용 사례: 시크릿 볼륨의 도트 파일(dotfile)

점으로 시작하는 키를 정의하여 데이터를 "숨김"으로 만들 수 있다.
이 키는 도트 파일 또는 "숨겨진" 파일을 나타낸다.
예를 들어, 다음 시크릿이 `secret-volume` 볼륨에 마운트되면 아래와 같다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: registry.k8s.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

볼륨은 `.secret-file` 이라는 하나의 파일을 포함하고,
`dotfile-test-container` 는 `/etc/secret-volume/.secret-file` 경로에
이 파일을 가지게 된다.

{{< note >}}
`ls -l` 명령의 결과에서 숨겨진 점으로 시작하는 파일들은
디렉터리 내용을 나열할 때 `ls -la` 를 사용해야 이 파일들을 볼 수 있다.
{{< /note >}}

### 사용 사례: 파드의 한 컨테이너에 표시되는 시크릿

HTTP 요청을 처리하고, 복잡한 비즈니스 로직을 수행한 다음, HMAC이 있는 일부 메시지에
서명해야 하는 프로그램을 고려한다. 애플리케이션 로직이
복잡하기 때문에, 서버에서 눈에 띄지 않는 원격 파일 읽기 공격이
있을 수 있으며, 이로 인해 개인 키가 공격자에게 노출될 수 있다.

이는 두 개의 컨테이너의 두 개 프로세스로 나눌 수 있다. 사용자 상호 작용과
비즈니스 로직을 처리하지만, 개인 키를 볼 수 없는 프론트엔드 컨테이너와
개인 키를 볼 수 있고, 프론트엔드의 간단한 서명 요청(예를 들어, localhost 네트워킹을 통해)에
응답하는 서명자 컨테이너로 나눌 수 있다.

이 분할된 접근 방식을 사용하면, 공격자는 이제 애플리케이션 서버를 속여서
파일을 읽는 것보다 다소 어려운 임의적인 어떤 작업을 수행해야
한다.

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
| `kubernetes.io/service-account-token` | 서비스 어카운트 토큰 |
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

`Opaque` 은 시크릿 구성 파일에서 시크릿 타입을 지정하지 않았을 경우의 기본 시크릿 타입이다.
`kubectl` 을 사용하여 시크릿을 생성할 때 `Opaque` 시크릿 타입을 나타내기
위해서는 `generic` 하위 커맨드를 사용할 것이다. 예를 들어, 다음 커맨드는
타입 `Opaque` 의 비어 있는 시크릿을 생성한다.

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

###  서비스 어카운트 토큰 시크릿

`kubernetes.io/service-account-token` 시크릿 타입은 
{{< glossary_tooltip text="서비스 어카운트" term_id="service-account" >}}를 확인하는 
토큰 자격증명을 저장하기 위해서 사용한다.

1.22 버전 이후로는 이러한 타입의 시크릿은 더 이상 파드에 자격증명을 마운트하는 데 사용되지 않으며, 
서비스 어카운트 토큰 시크릿 오브젝트를 사용하는 대신 
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API를 통해 토큰을 얻는 것이 추천된다. 
`TokenRequest` API에서 얻은 토큰은 제한된 수명을 가지며 다른 API 클라이언트에서 읽을 수 없기 때문에 
시크릿 오브젝트에 저장된 토큰보다 더 안전하다.
`TokenRequest` API에서 토큰을 얻기 위해서 
[`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-) 커맨드를 사용할 수 있다.

토큰을 얻기 위한 `TokenRequest` API를 사용할 수 없는 경우에는
서비스 어카운트 토큰 시크릿 오브젝트를 생성할 수 밖에 없으나,
이는 만료되지 않는 토큰 자격증명을 읽기 가능한 API 오브젝트로
지속되는 보안 노출 상황을 감수할 수 있는 경우에만 생성해야 한다.

이 시크릿 타입을 사용할 때는, 
`kubernetes.io/service-account.name` 어노테이션이 존재하는 
서비스 어카운트 이름으로 설정되도록 해야 한다. 만약 서비스 어카운트와 
시크릿 오브젝트를 모두 생성하는 경우, 서비스 어카운트를 먼저 생성해야만 한다.

시크릿이 생성된 후, 쿠버네티스 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는 
`kubernetes.io/service-account.uid` 어노테이션 및 
인증 토큰을 보관하고 있는 `data` 필드의 `token` 키와 같은 몇 가지 다른 필드들을 채운다.

다음은 서비스 어카운트 토큰 시크릿의 구성 예시이다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # 사용자는 불투명 시크릿을 사용하므로 추가적인 키 값 쌍을 포함할 수 있다.
  extra: YmFyCg==
```

시크릿을 만든 후, 쿠버네티스가 `data` 필드에 `token` 키를 채울 때까지 기다린다.

[서비스 어카운트](/docs/tasks/configure-pod-container/configure-service-account/) 문서를 보면
서비스 어카운트가 동작하는 방법에 대한 더 자세한 정보를 얻을 수 있다.
또한 파드에서 서비스 어카운트 자격증명을 참조하는 방법에 대한 정보는 
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)의
`automountServiceAccountToken` 필드와 `serviceAccountName`
필드를 통해 확인할 수 있다.

### 도커 컨피그 시크릿

이미지에 대한 도커 레지스트리 접속 자격 증명을 저장하기 위한
시크릿을 생성하기 위해서 다음의 `type` 값 중 하나를 사용할 수 있다.

- `kubernetes.io/dockercfg`
- `kubernetes.io/dockerconfigjson`

`kubernetes.io/dockercfg` 는 직렬화된 도커 커맨드라인 구성을
위한 기존(legacy) 포맷 `~/.dockercfg` 를 저장하기 위해 할당된 타입이다.
시크릿 타입을 사용할 때는, `data` 필드가 base64 포맷으로
인코딩된 `~/.dockercfg` 파일의 콘텐츠를 값으로 가지는 `.dockercfg` 키를 포함하고 있는지
확실히 확인해야 한다.

`kubernetes.io/dockerconfigjson` 타입은 `~/.dockercfg` 의
새로운 포맷인 `~/.docker/config.json` 파일과 동일한 포맷 법칙을
따르는 직렬화 된 JSON의 저장을 위해 디자인되었다.
이 시크릿 타입을 사용할 때는, 시크릿 오브젝트의 `data` 필드가 `.dockerconfigjson` 키를
꼭 포함해야 한다. `~/.docker/config.json` 파일을 위한 콘텐츠는
base64로 인코딩된 문자열으로 제공되어야 한다.

아래는 시크릿의 `kubernetes.io/dockercfg` 타입 예시이다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-dockercfg
type: kubernetes.io/dockercfg
data:
  .dockercfg: |
    "<base64 encoded ~/.dockercfg file>"
```

{{< note >}}
만약 base64 인코딩 수행을 원하지 않는다면, 
그 대신 `stringData` 필드를 사용할 수 있다.
{{< /note >}}

이러한 타입들을 매니페스트를 사용하여 생성하는 경우, API
서버는 해당 `data` 필드에 기대하는 키가 존재하는지 확인하고,
제공된 값이 유효한 JSON으로 파싱될 수 있는지 검증한다. API
서버가 해당 JSON이 실제 도커 컨피그 파일인지를 검증하지는 않는다.

도커 컨피그 파일을 가지고 있지 않거나 도커 레지스트리 시크릿을 생성하기
위해 `kubectl` 을 사용하고 싶은 경우, 다음과 같이 처리할 수 있다.

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

이 커맨드는 `kubernetes.io/dockerconfigjson` 타입의 시크릿을 생성한다. 
다음 명령으로 이 새 시크릿에서 `.data.dockerconfigjson` 필드를 덤프하고 
base64로 디코드하면,

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

{{< note >}}
위의 `auth` 값은 base64 인코딩되어 있다. 이는 난독화된 것이지 암호화된 것이 아니다. 
이 시크릿을 읽을 수 있는 사람은 레지스트리 접근 베어러 토큰을 알 수 있는 것이다.
{{< /note >}}

### 기본 인증(Basic authentication) 시크릿

`kubernetes.io/basic-auth` 타입은 기본 인증을 위한 자격 증명을 저장하기
위해 제공된다. 이 시크릿 타입을 사용할 때는 시크릿의 `data` 필드가
다음의 두 키 중 하나를 포함해야 한다.

- `username`: 인증을 위한 사용자 이름
- `password`: 인증을 위한 암호나 토큰

위의 두 키에 대한 두 값은 모두 base64로 인코딩된 문자열이다. 물론,
시크릿 생성 시 `stringData` 를 사용하여 평문 텍스트 콘텐츠(clear text content)를 제공할
수도 있다.

다음의 YAML은 기본 인증 시크릿을 위한 구성 예시이다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
stringData:
  username: admin      # kubernetes.io/basic-auth 에서 요구하는 필드
  password: t0p-Secret # kubernetes.io/basic-auth 에서 요구하는 필드
```

이 기본 인증 시크릿 타입은 오직 사용자 편의를 위해 제공되는 것이다.
사용자는 기본 인증에서 사용할 자격 증명을 위해 `Opaque` 타입의 시크릿을 생성할 수도 있다. 
그러나, 미리 정의되어 공개된 시크릿 타입(`kubernetes.io/basic-auth`)을 사용하면 
다른 사람이 이 시크릿의 목적을 이해하는 데 도움이 되며, 
예상되는 키 이름에 대한 규칙이 설정된다. 
쿠버네티스 API는 이 유형의 시크릿에 대해 
필수 키가 설정되었는지 확인한다.

### SSH 인증 시크릿

이 빌트인 타입 `kubernetes.io/ssh-auth` 는 SSH 인증에 사용되는 데이터를
저장하기 위해서 제공된다. 이 시크릿 타입을 사용할 때는 `ssh-privatekey`
키-값 쌍을 사용할 SSH 자격 증명으로 `data` (또는 `stringData`)
필드에 명시해야 할 것이다.

다음 매니페스트는 
SSH 공개/개인 키 인증에 사용되는 시크릿 예시이다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # 본 예시를 위해 축약된 데이터임
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```

SSH 인증 시크릿 타입은 오직 사용자 편의를 위해 제공되는 것이다. 
사용자는 SSH 인증에서 사용할 자격 증명을 위해 `Opaque` 타입의 시크릿을 생성할 수도 있다. 
그러나, 미리 정의되어 공개된 시크릿 타입(`kubernetes.io/ssh-auth`)을 사용하면 
다른 사람이 이 시크릿의 목적을 이해하는 데 도움이 되며, 
예상되는 키 이름에 대한 규칙이 설정된다. 
그리고 API 서버가 
시크릿 정의에 필수 키가 명시되었는지 확인한다.

{{< caution >}}
SSH 개인 키는 자체적으로 SSH 클라이언트와 호스트 서버 간에 신뢰할 수 있는 통신을
설정하지 않는다. 컨피그맵(ConfigMap)에 추가된 `known_hosts` 파일과 같은
"중간자(man in the middle)" 공격을 완화하려면 신뢰를 설정하는
2차 수단이 필요하다.
{{< /caution >}}

### TLS 시크릿

쿠버네티스는 일반적으로 TLS를 위해 사용되는 인증서 및 관련된 키를 저장하기 위한 
빌트인 시크릿 타입 `kubernetes.io/tls` 를 제공한다.

TLS 시크릿의 일반적인 용도 중 하나는 [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대한 
전송 암호화(encryption in transit)를 구성하는 것이지만, 
다른 리소스와 함께 사용하거나 워크로드에서 직접 사용할 수도 있다. 
이 타입의 시크릿을 사용할 때는 `tls.key` 와 `tls.crt` 키가 
시크릿 구성의 `data` (또는 `stringData`) 필드에서 제공되어야 한다. 
그러나, API 서버가 각 키에 대한 값이 유효한지 실제로 검증하지는 않는다.

다음 YAML은 TLS 시크릿을 위한 구성 예시를 포함한다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # 본 예시를 위해 축약된 데이터임
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```

TLS 시크릿 타입은 사용자 편의만을 위해서 제공된다. 사용자는 TLS 서버 및/또는
클라이언트를 위해 사용되는 자격 증명을 위한 `Opaque` 를 생성할 수도 있다. 그러나, 빌트인
시크릿 타입을 사용하는 것은 사용자의 자격 증명들의 포맷을 통합하는 데 도움이 되고,
API 서버는 요구되는 키가 시크릿 구성에서 제공되고 있는지 검증도 한다.

`kubectl` 를 사용하여 TLS 시크릿을 생성할 때, `tls` 하위 커맨드를
다음 예시와 같이 사용할 수 있다.

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

공개/개인 키 쌍은 사전에 준비되어야 한다. 
`--cert` 에 들어가는 공개 키 인증서는 
[RFC 7468의 섹션 5.1](https://datatracker.ietf.org/doc/html/rfc7468#section-5.1)에 있는 DER 형식이어야 하고, 
`--key` 에 들어가는 개인 키 인증서는 
[RFC 7468의 섹션 11](https://datatracker.ietf.org/doc/html/rfc7468#section-11)에 있는 DER 형식 PKCS #8 을 따라야 한다.

{{< note >}}
`kubernetes.io/tls` 시크릿은 
키 및 인증서에 Base64 인코드된 DER 데이터를 보관한다. 
개인 키 및 인증서에 사용되는 PEM 형식에 익숙하다면, 
이 base64 데이터는 PEM 형식에서 맨 윗줄과 아랫줄을 제거한 것과 동일하다.

예를 들어, 인증서의 경우, 
`--------BEGIN CERTIFICATE-----` 및 `-------END CERTIFICATE----` 줄은 포함되면 **안** 된다.
{{< /note >}}

### 부트스트랩 토큰 시크릿

부트스트랩 토큰 시크릿은 시크릿 `type` 을 `bootstrap.kubernetes.io/token` 으로
명확하게 지정하면 생성할 수 있다. 이 타입의 시크릿은 노드 부트스트랩 과정 중에 사용되는
토큰을 위해 디자인되었다. 이것은 잘 알려진 컨피그맵에 서명하는 데 사용되는
토큰을 저장한다.

부트스트랩 토큰 시크릿은 보통 `kube-system` 네임스페이스에 생성되며
`<token-id>` 가 해당 토큰 ID의 6개 문자의 문자열으로 구성된 `bootstrap-token-<token-id>` 형태로
이름이 지정된다.

쿠버네티스 매니페스트로서, 부트스트렙 토큰 시크릿은 다음과 유사할
것이다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```

부트스트랩 타입 시크릿은 `data` 아래 명시된 다음의 키들을 가진다.

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

위의 YAML은 모두 base64로 인코딩된 문자열 값이므로 혼란스러워 보일
수 있다. 사실은 다음 YAML을 사용하여 동일한 시크릿을 생성할 수 있다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  # 시크릿 이름이 어떻게 지정되었는지 확인
  name: bootstrap-token-5emitj
  # 부트스트랩 토큰 시크릿은 일반적으로 kube-system 네임스페이스에 포함
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # 이 토큰 ID는 이름에 사용됨
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # 이 토큰은 인증을 위해서 사용될 수 있음
  usage-bootstrap-authentication: "true"
  # 또한 서명(signing)에도 사용될 수 있음
  usage-bootstrap-signing: "true"
```


## 불변(immutable) 시크릿 {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

쿠버네티스에서 특정 시크릿(및 컨피그맵)을 _불변_ 으로 표시할 수 있다.
기존 시크릿 데이터의 변경을 금지시키면 다음과 같은 이점을 가진다.

- 잘못된(또는 원치 않은) 업데이트를 차단하여 애플리케이션 중단을 방지
- (수만 개 이상의 시크릿-파드 마운트와 같이 시크릿을 대규모로 사용하는 클러스터의 경우,) 
  불변 시크릿으로 전환하면 kube-apiserver의 부하를 크게 줄여 클러스터의 성능을 향상시킬 수 있다. 
  kubelet은 불변으로 지정된 시크릿에 대해서는 
  [감시(watch)]를 유지할 필요가 없기 때문이다.

### 시크릿을 불변으로 지정하기 {#secret-immutable-create}

다음과 같이 시크릿의 `immutable` 필드를 `true`로 설정하여 불변 시크릿을 만들 수 있다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
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
쿠버네티스(예: 서비스 어카운트 토큰)와 외부 시스템으로 단계적으로
확대될 수 있다. 개별 앱이 상호 작용할 것으로 예상되는 시크릿의 힘에 대해 추론할 수 있더라도
동일한 네임스페이스 내의 다른 앱이 이러한 가정을
무효화할 수 있다.

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
