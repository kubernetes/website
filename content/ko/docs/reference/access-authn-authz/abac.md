---
# reviewers:
# - erictune
# - lavalamp
# - deads2k
# - liggitt
title: ABAC 인가 사용하기
content_type: concept
weight: 39
---

<!-- overview -->
속성 기반 접근 제어(ABAC)는 속성을 결합한 정책을 사용하여 사용자에게
접근 권한을 부여하는 접근 제어 패러다임이다.

<!-- body -->
## 정책 파일 형식

`ABAC` 모드를 활성화하려면, 시작 시 `--authorization-policy-file=SOME_FILENAME`과
`--authorization-mode=ABAC`를 지정한다.

파일 형식은 [한 줄에 하나의 JSON 객체](https://jsonlines.org/)이다. 감싸는
리스트나 맵이 있어서는 안 되며, 한 줄에 하나의 맵만 있어야 한다.

각 줄은 "정책 오브젝트"이며, 각 오브젝트는 다음 속성을 갖는
맵이다.

- 버전 관리 속성:
  - `apiVersion`, 문자열 타입. 유효한 값은 "abac.authorization.kubernetes.io/v1beta1"이다.
    정책 형식의 버전 관리와 변환을 허용한다.
  - `kind`, 문자열 타입. 유효한 값은 "Policy"이다. 정책 형식의 버전 관리와 변환을 허용한다.
- 다음 속성을 갖는 맵으로 설정된 `spec` 속성:
  - 주체 일치 속성:
    - `user`, 문자열 타입. `--token-auth-file`에서 가져온 사용자 문자열이다. `user`를 지정하면
      인증된 사용자의 사용자 이름과 일치해야 한다.
    - `group`, 문자열 타입. `group`을 지정하면 인증된 사용자가 속한 그룹 중 하나와 일치해야 한다.
      `system:authenticated`는 인증된 모든 요청과 일치한다. `system:unauthenticated`는
      인증되지 않은 모든 요청과 일치한다.
  - 리소스 일치 속성:
    - `apiGroup`, 문자열 타입. API 그룹이다.
      - 예: `apps`, `networking.k8s.io`
      - 와일드카드: `*`는 모든 API 그룹과 일치한다.
    - `namespace`, 문자열 타입. 네임스페이스이다.
      - 예: `kube-system`
      - 와일드카드: `*`는 모든 리소스 요청과 일치한다.
    - `resource`, 문자열 타입. 리소스 타입이다.
      - 예: `pods`, `deployments`
      - 와일드카드: `*`는 모든 리소스 요청과 일치한다.
  - 비-리소스 일치 속성:
    - `nonResourcePath`, 문자열 타입. 비-리소스 요청 경로이다.
      - 예: `/version` 또는 `/apis`
      - 와일드카드:
        - `*`는 모든 비-리소스 요청과 일치한다.
        - `/foo/*`는 `/foo/`의 모든 하위 경로와 일치한다.
  - `readonly`, 불리언 타입. true이면, 리소스 일치 정책은 get, list, watch 작업에만
    적용되고, 비-리소스 일치 정책은 get 작업에만 적용된다는 것을 의미한다.

{{< note >}}
설정하지 않은 속성은 해당 타입의 제로 값(예: 빈 문자열, 0, false)으로 설정된
속성과 동일하다. 그러나 가독성을 위해서는
설정하지 않는 편이 좋다.

향후 정책은 JSON 형식으로 표현되고 REST 인터페이스를 통해
관리될 수도 있다.
{{< /note >}}

## 인가 알고리즘

요청에는 정책 오브젝트의 속성에 대응하는 속성이 있다.

요청이 수신되면 속성이 결정된다. 알 수 없는 속성은 해당 타입의
제로 값(예: 빈 문자열, 0, false)으로 설정된다.

`"*"`로 설정된 속성은 해당 속성의 모든 값과 일치한다.

속성의 튜플은 정책 파일에 있는 모든 정책과 대조되어 일치 여부가 확인된다.
한 줄이라도 요청 속성과 일치하면 요청은 인가된다(하지만 이후의
유효성 검사에서 실패할 수도 있다).

인증된 모든 사용자가 무언가를 하도록 허용하려면, group 속성을
`"system:authenticated"`로 설정한 정책을 작성한다.

인증되지 않은 모든 사용자가 무언가를 하도록 허용하려면, group 속성을
`"system:unauthenticated"`로 설정한 정책을 작성한다.

사용자가 무엇이든 하도록 허용하려면, apiGroup, namespace, resource,
nonResourcePath 속성을 모두 `"*"`로 설정한 정책을 작성한다.

## Kubectl

Kubectl은 apiserver의 `/api` 및 `/apis` 엔드포인트를 사용하여 제공되는
리소스 타입을 탐색하고, `/openapi/v2`에 있는 스키마 정보를 사용하여 생성/업데이트
작업으로 API에 전송된 오브젝트의 유효성을 검사한다.

ABAC 인가를 사용하는 경우, 이러한 특수 리소스는 정책의 `nonResourcePath`
속성을 통해 명시적으로 노출되어야 한다(아래 [예시](#examples) 참고).

* API 버전 협상을 위한 `/api`, `/api/*`, `/apis`, `/apis/*`.
* `kubectl version`을 통해 서버 버전을 가져오기 위한 `/version`.
* 생성/업데이트 작업을 위한 `/swaggerapi/*`.

특정 kubectl 작업에 관련된 HTTP 호출을 살펴보려면 다음과 같이
로그 상세 레벨(verbosity)을 높일 수 있다.

```shell
kubectl --v=8 version
```

## 예시 {#examples}

1. Alice는 모든 리소스에 대해 무엇이든 할 수 있다.

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
   ```

1. kubelet은 모든 파드를 읽을 수 있다.

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
   ```

1. kubelet은 이벤트를 읽고 쓸 수 있다.

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
   ```

1. Bob은 "projectCaribou" 네임스페이스에 있는 파드만 읽을 수 있다.

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
   ```

1. 누구나 모든 비-리소스 경로에 읽기 전용 요청을 할 수 있다.

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
   ```

[전체 파일 예시](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## 서비스 어카운트에 대한 짧은 참고 사항

모든 서비스 어카운트에는 그에 대응하는 ABAC 사용자 이름이 있으며, 해당 서비스
어카운트의 사용자 이름은 다음 명명 규칙에 따라 생성된다.

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

새 네임스페이스를 생성하면 다음 형식으로 새 서비스 어카운트가 생성된다.

```shell
system:serviceaccount:<namespace>:default
```

예를 들어 (`kube-system` 네임스페이스에 있는) 기본 서비스 어카운트에 ABAC를 사용하여
API에 대한 모든 권한을 부여하고 싶다면, 정책 파일에 다음 줄을 추가하면 된다.

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

새 정책을 적용하려면 apiserver를 재시작해야 한다.
