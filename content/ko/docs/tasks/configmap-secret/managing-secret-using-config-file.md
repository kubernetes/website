---
title: 환경 설정 파일을 사용하여 시크릿을 관리
content_type: task
weight: 20
description: 환경 설정 파일을 사용하여 시크릿 오브젝트를 생성.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 시크릿(Secret) 생성 {#create-the-config-file}

먼저 매니페스트에 JSON 이나 YAML 형식으로 `시크릿(Secret)` 오브젝트를 정의하고,
그 다음 해당 오브젝트를 만든다. 이
[시크릿](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
리소스에는 `data` 와 `stringData` 의 두 가지 맵이 포함되어 있다.
`data` 필드는 base64로 인코딩된 임의의 데이터를 기입하는 데 사용된다.
`stringData` 필드는 편의를 위해 제공되며, 이를 사용해 같은 데이터를 인코딩되지 않은 문자열로
기입할 수 있다.
`data` 및 `stringData`은 영숫자,
`-`, `_` 그리고 `.`로 구성되어야 한다.

다음 예는 `data` 필드를 사용하여 시크릿에 두 개의 문자열을 저장한다.

1. 문자열을 base64로 변환한다.

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

  {{< note >}}
  시크릿 데이터의 직렬화된(serialized) JSON 및 YAML 값은 base64 문자열로 인코딩된다. 이러한 문자열에는 개행(newline)을 사용할 수 없으므로 생략해야 한다. Darwin/macOS에서 `base64` 도구를 사용할 경우, 사용자는 긴 줄을 분할하는 `-b` 옵션을 사용해서는 안 된다. 반대로, 리눅스 사용자는 `-w` 옵션을 사용할 수 없는 경우 `base64` 명령어 또는 `base64 | tr -d '\n'` 파이프라인에 `-w 0` 옵션을 *추가해야 한다*.
  {{< /note >}}
   
   출력은 다음과 유사하다.

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. 매니페스트를 생성한다.

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

   시크릿(Secret) 오브젝트의 이름은 유효한
   [DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

1. [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)를 사용하여 시크릿(Secret) 생성하기

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   출력은 다음과 유사하다.

   ```
   secret/mysecret created
   ```

시크릿(Secret) 생성과 시크릿(Secret) 데이터 디코딩을 확인하려면, 
[kubectl을 사용한 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/#시크릿-확인)을 참조하자.

### 시크릿(Secret) 생성 시 인코딩되지 않은 데이터 명시

특정 시나리오의 경우 `stringData` 필드를 대신 사용할 수 있다. 이
필드를 사용하면 base64로 인코딩되지 않은 문자열을 시크릿에 직접 넣을 수 있으며,
시크릿이 생성되거나 업데이트될 때 문자열이 인코딩된다.

이에 대한 실제적인 예로,
시크릿을 사용하여 구성 파일을 저장하는 애플리케이션을 배포하면서,
배포 프로세스 중에 해당 구성 파일의 일부를 채우려는 경우를 들 수 있다.

예를 들어 애플리케이션에서 다음 구성 파일을 사용하는 경우:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

다음 정의를 사용하여 이를 시크릿에 저장할 수 있다.

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

시크릿(Secret) 데이터를 검색할 때, 검색 명령은 인코딩된 값을 반환하며,
`stringData`에 기입한 일반 텍스트 값이 아닙니다.

예를 들어, 다음 명령을 실행한다면

```shell
kubectl apply -f ./secret.yaml
```

출력은 다음과 유사하다.

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

### `data`와 `stringData` 모두 명시

`data`와 `stringData` 모두에 필드를 명시하면, `stringData`에 명시된 값이 사용된다.

예를 들어 다음과 같은 시크릿인 경우,

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

다음과 같이 `시크릿` 오브젝트가 생성됐다.

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

`YWRtaW5pc3RyYXRvcg==`는 `administrator`으로 디코딩된다.

## 시크릿(Secret) 작성 {#edit-secret}

매니페스트를 사용하여 생성한 시크릿의 데이터를 편집하려면, 매니페스트에서 `data`
및 `stringData` 필드를 수정하고 해당 파일을 클러스터에 적용하면 된다.
그렇지 않은 경우 기존의 `시크릿` 오브젝트를 편집할 수 있다.
[수정 불가능한(immutable)](/docs/concepts/configuration/secret/#secret-immutable).

예를 들어, 이전 예제에서 패스워드를 `birdsarentreal`로 변경하려면,
다음과 같이 수행한다.

1. 새로운 암호 문자열을 인코딩한다.

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   출력은 다음과 같다.

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

1. 새 암호 문자열로 `data` 필드를 업데이트 한다.

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. 클러스터에 매니페스트를 적용한다.

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   출력은 다음과 같다.

   ```
   secret/mysecret configured
   ```

쿠버네티스는 기존 `시크릿` 오브젝트를 업데이트한다. 자세히 보면, `kubectl` 도구는
동일한 이름을 가진 기존 `Secret` 오브젝트가 있음을 알아낸다.
`kubectl`은 기존의 오브젝트를 가져오고, 변경을 계획하며,
변경된 `Secret` 오브젝트를 클러스터 컨트롤 플레인에 제출한다.

`kubectl apply --server-side`를 지정한 경우, `kubectl`은
[서버 사이드 어플라이](/docs/reference/using-api/server-side-apply/)를 대신 사용한다.

## 삭제

생성한 시크릿을 삭제하려면 다음 명령을 실행한다.

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [kubectl을 사용한 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/)하는 방법 알아보기
- [kustomize를 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)하는 방법 알아보기
