---
title: 구성 파일을 사용하여 시크릿 관리
content_type: task
weight: 20
description: 리소스 구성 파일을 사용하여 시크릿 오브젝트를 생성
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 구성 파일 생성

먼저 파일에 JSON 이나 YAML 형식으로 시크릿을 생성한 다음
오브젝트를 생성할 수 있습니다. 이 
[시크릿](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core) 
리소스에는 `data` 와 `stringData` 의 두가지 맵이 포함되어 있습니다.
`data` 필드는 base64를 사용하여 인코딩된 임의의 데이터를 저장하는 데 사용됩니다.
`stringData` 필드는 편의를 위해 제공되며 시크릿 데이터를 인코딩 되지 않은 문자열로
제공 할 수 있습니다.
`data` 및 `stringData`은 영숫자,
`-`, `_` 그리고 `.`로 구성되어야 합니다.

예를 들어 `data` 필드를 사용하여 시크릿을 두 문자열을 저장하려면 다음과 같이
문자열을 base64로 변환합니다:

```shell
echo -n 'admin' | base64
```

출력은 다음과 유사합니다:

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

출력은 다음과 유사합니다:

```
MWYyZDFlMmU2N2Rm
```

다음과 같이 시크릿 구성 파일을 작성:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

시크릿 오브젝트의 이름은 유효해야 합니다
[DNS 서브도메인 이름](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
시크릿 데이터의 연계된 JSON 및 YAML 값은 base64 문자열로 인코딩됩니다.
이러한 문자열은 새 줄을 사용할 수 없으므로 생략해야 합니다. 
Darwin/macOS에서 `base64` 도구를 사용할 경우, 사용자는 긴 줄을 분할하는 `-b` 옵션을 사용 하지 않아야 합니다.
반대로 리눅스 사용자는 옵션을 *추가해야 합니다*
-w 0에서 'base64' 명령 또는 파이프라인 'base64 | tr -d '\n' 명령('-w'인 경우)
옵션을 사용할 수 없습니다.
{{< /note >}}

특정 시나리오의 경우 `stringData` 필드를 대신 사용할 수 있습니다. 이
필드를 사용하면 base64로 인코딩이 안된 문자열을 시크릿에 직접 넣을 수 있습니다.
시크릿이 생성되거나 업데이트될 때 문자열이 인코딩됩니다.

이에 대한 실용적인 예는 애플리케이션을 배포하는 경우일 수 있습니다.
시크릿을 사용하여 구성 파일을 저장하고 채우려는
배포 프로세스 중에 해당 구성 파일의 일부입니다.

예를 들어 애플리케이션에서 다음 구성 파일을 사용하는 경우:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

다음 정의를 사용하여 이를 시크릿에 저장할 수 있습니다:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

## 시크릿 오브젝트 생성

[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)를 이용하여 시크릿 오브젝트를 생성합니다:

```shell
kubectl apply -f ./secret.yaml
```

출력은 다음과 유사합니다:

```
secret/mysecret created
```

## 시크릿 확인

`stringData` 필드는 쓰기 전용 편의 필드입니다. 시크릿을 검색할 때 절대 출력되지 않습니다.
예를 들어 다음 명령을 실행하는 경우:

```shell
kubectl get secret mysecret -o yaml
```

출력은 다음과 유사합니다:

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

`kubectl get` 및 `kubectl describe` 명령은 기본적으로 `시크릿`의 내용을 표시하지 않습니다.
이는 `시크릿`이 실수로 구경꾼에게 노출되는 것을 방지하기 위한 것으로,
또는 터미널 로그에 저장되지 않습니다.
인코딩된 데이터의 실제 내용을 확인하려면 다음을 참조하십시오.
[디코딩 시크릿](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).

`username`과 같은 필드가 `data`와 `stringData`에 모두 지정되면 `stringData`의 값이 사용됩니다.
예를 들어 다음과 같은 시크릿인 경우:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

결과는 다음과 같은 시크릿입니다:

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

여기서 `YWRtaW5pc3RyYXRvcg==`는 `administrator`으로 디코딩됩니다.

## 정리

생성한 시크릿을 삭제하려면:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [`kubectl` 커멘드을 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/)방법 알아보기
- [kustomize를 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)방법 알아보기

