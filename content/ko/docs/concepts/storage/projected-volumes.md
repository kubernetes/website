---
# reviewers:
# - marosset
# - jsturtevant
# - zshihang
title: 프로젝티드 볼륨
content_type: concept
weight: 21 # just after persistent volumes
---

<!-- overview -->

이 페이지에서는 쿠버네티스의 _프로젝티드 볼륨(projected volume)_  에 대해 설명한다. [볼륨](/ko/docs/concepts/storage/volumes/)에 대해 익숙해지는 것을 추천한다.

<!-- body -->

## 들어가며

`프로젝티드 볼륨`은 여러 기존 볼륨 소스(sources)를 동일한 디렉토리에 매핑한다.

현재, 아래와 같은 볼륨 유형 소스를 프로젝트(project)할 수 있다.

* [`시크릿(secret)`](/ko/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/ko/docs/concepts/storage/volumes/#downwardapi)
* [`컨피그맵(configMap)`](/ko/docs/concepts/storage/volumes/#configmap)
* [`서비스어카운트토큰(serviceAccountToken)`](#serviceaccounttoken)

모든 소스는 파드와 같은 네임스페이스에 있어야 한다.
자세한 내용은 [올인원(all-in-one) 볼륨](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) 문서를 참고한다.

### 시크릿, downwardAPI, 컨피그맵 구성 예시 {#example-configuration-secret-downwardapi-configmap}

{{< codenew file="pods/storage/projected-secret-downwardapi-configmap.yaml" >}}

### 기본 권한이 아닌 모드 설정의 시크릿 구성 예시 {#example-configuration-secrets-nondefault-permission-mode}

{{< codenew file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" >}}

각 프로젝티드 볼륨 소스는 `sources` 아래의 스펙에 나열된다.
파라미터는 두 가지 예외를 제외하고 동일하다.

* 시크릿의 경우 컨피그맵 명명법과 동일하도록
  `secretName` 필드가 `name`으로 변경되었다.
* `defaultMode`의 경우 볼륨 소스별 각각 명시할 수 없고
  프로젝티드 수준에서만 명시할 수 있다. 그러나 위의 그림처럼 각 개별 프로젝션에 대해
  `mode`를 명시적으로 지정할 수 있다.

## 서비스어카운트토큰 프로젝티드 볼륨 {#serviceaccounttoken}
파드의 지정된 경로에 [서비스어카운트토큰](/docs/reference/access-authn-authz/authentication/#service-account-tokens)을
주입할 수 있다. 

{{< codenew file="pods/storage/projected-service-account-token.yaml" >}}

위 예시에는 파드에 주입된 서비스어카운트토큰이 포함된 프로젝티드 볼륨이 있다. 
이 파드의 컨테이너는 서비스어카운트토큰을 사용하여 쿠버네티스 API 서버에 접근하고,
파드의 [서비스어카운트](/docs/tasks/configure-pod-container/configure-service-account/)로 인증할 수 있다.
`audience` 필드는 토큰의 의도된 대상을 포함한다.
토큰 수신자는 토큰의 대상으로 지정된 식별자로 자신을 식별해야 하며,
그렇지 않으면 토큰을 거부해야 한다.
이 필드는 선택 사항으로, API 서버의 식별자로 기본 설정된다.

`expirationSeconds`는 서비스어카운트토큰의 예상 유효 기간이다.
기본값은 1시간이며 최소 10분 (600초) 이상이어야 한다.
관리자는 API 서버 옵션 `--service-account-max-token-expiration`으로
값을 지정하여 최대값을 제한할 수 있다.
`path` 필드는 프로젝티드 볼륨의 마운트 지점에 대한 상대 경로를 지정한다.

{{< note >}}
[`하위 경로`](/ko/docs/concepts/storage/volumes/#using-subpath) 볼륨 마운트로 프로젝티드 볼륨 소스를 사용하는 컨테이너는
해당 볼륨 소스에 대한 업데이트를 수신하지 않는다.
{{< /note >}}

## 시큐리티컨텍스트(SecurityContext) 상호작용

프로젝티드 서비스 어카운트 볼륨 내에서의 파일 퍼미션 처리에 대한 개선 [제안](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal)을 통해, 프로젝티드 파일의 소유자 및 퍼미션이 올바르게 설정되도록 변경되었다.

### 리눅스

프로젝티드 볼륨과 파드
[`보안 컨텍스트`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)에
`RunAsUser`가 설정된 리눅스 파드에서는
프로젝티드파일이 컨테이너 사용자 소유권을 포함한 올바른 소유권 집합을 가진다.

파드의 모든 컨테이너의
[`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)나
컨테이너
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)의 `runAsUser` 설정이 동일하다면,
kubelet은 `serviceAccountToken` 볼륨의 내용이 해당 사용자의 소유이며,
토큰 파일의 권한 모드는 `0600`로 설정됨을 보장한다.

{{< note >}}
생성된 후 파드에 추가되는 {{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}는
파드 생성 시 설정된 볼륨 권한을
변경하지 *않는다*.

파드 내 그 외의 모든 컨테이너의 `runAsUser`가 동일하여
파드의 `serviceAccountToken` 볼륨 권한이 `0600`으로 설정되어 있다면, 임시
컨테이너는 토큰을 읽을 수 있도록 동일한 `runAsUser`를 사용해야 한다.
{{< /note >}}

### 윈도우

윈도우 파드에서 프로젝티드 볼륨과 파드 `SecurityContext`에 `RunAsUsername`이 설정된 경우, 
윈도우에서 사용자 계정을 관리하는 방법으로 인하여 소유권이 적용되지 않는다.
윈도우는 보안 계정 관리자 (Security Account Manager)라는 데이터베이스 파일에 
로컬 사용자 및 그룹 계정을 저장하고 관리한다.
컨테이너가 실행되는 동안 각 컨테이너는
호스트가 볼 수 없는 SAM 데이터베이스의 자체 인스턴스를 유지한다.
윈도우 컨테이너는 OS의 사용자 모드 부분을 호스트와 분리하여 실행하도록 설계되어 가상 SAM 데이터베이스를 유지 관리한다.
따라서 호스트에서 실행 중인 kubelet은 가상화된 컨테이너 계정에 대한
호스트 파일 소유권을 동적으로 구성할 수 없다.
호스트 머신의 파일을 컨테이너와 공유하려는 경우
`C:\` 외부에 있는 자체 볼륨 마운트에 배치하는 것을
권장한다.

기본적으로, 프로젝티드 파일은 예제의 프로젝티드 볼륨 파일처럼
아래와 같은 소유권을 가진다.

```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```

`ContainerAdministrator`와 같은
모든 관리자인 사용자는 읽기, 쓰기 그리고 실행 권한을 갖게 되지만
관리자가 아닌 사용자는 읽기 및 실행 권한을 갖게 된다는 것을 의미한다.

{{< note >}}
일반적으로 호스트에게 컨테이너 액세스를 승인하는 것은
잠재적인 보안 악용에 대한 문을 열 수 있기 때문에 권장되지 않는다.

윈도우 파드에서 `SecurityContext`를 `RunAsUser`로 생성하면,
파드는 영원히 `ContainerCreating` 상태에 머물게 된다.
따라서 리눅스 전용 `RunAsUser` 옵션은 윈도우 파드와 함께 사용하지 않는 것이 좋다.
{{< /note >}}
