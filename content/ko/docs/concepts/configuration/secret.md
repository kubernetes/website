---
title: 시크릿(Secret)
content_type: concept
feature:
  title: 시크릿과 구성 관리
  description: >
    사용자의 이미지를 다시 빌드하거나 스택 구성의 시크릿을 노출하지 않고 시크릿과 애플리케이션 구성을 배포하고 업데이트한다.
weight: 30
---

<!-- overview -->

쿠버네티스 시크릿을 사용하면 비밀번호, OAuth 토큰, ssh 키와 같은
민감한 정보를 저장하고 관리할 수 ​​있다. 기밀 정보를 시크릿에 저장하는 것이
{{< glossary_tooltip term_id="pod" text="파드" >}} 정의나
{{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}} 내에 그대로 두는 것보다 안전하고 유연하다. 자세한 내용은 [시크릿 디자인 문서](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md)를 참고한다.



<!-- body -->

## 시크릿 개요

시크릿은 비밀번호, 토큰 또는 키와 같은 소량의
민감한 데이터를 포함하는 오브젝트이다. 그렇지 않으면 이러한 정보가
파드 명세 또는 이미지에 포함될 수 있다. 사용자는 시크릿을 생성할 수 있으며 시스템도
일부 시크릿을 생성한다.

시크릿을 사용하려면, 파드가 시크릿을 참조해야 한다.
시크릿은 세 가지 방법으로 파드와 함께 사용할 수 있다.

- 하나 이상의 컨테이너에 마운트된
{{< glossary_tooltip text="볼륨" term_id="volume" >}} 내의
[파일](#시크릿을-파드의-파일로-사용하기)로써 사용.
- [컨테이너 환경 변수](#시크릿을-환경-변수로-사용하기)로써 사용.
- 파드의 [이미지를 가져올 때 kubelet](#imagepullsecrets-사용하기)에 의해 사용.

### 빌트인 시크릿

#### 서비스 어카운트는 API 자격 증명으로 시크릿을 자동으로 생성하고 연결함

쿠버네티스는 API 접근을 위한 자격 증명이 포함된
시크릿을 자동으로 생성하고 이러한 유형의 시크릿을 사용하도록 파드를 자동으로
수정한다.

원하는 경우 API 자격 증명의 자동 생성 및 사용을 비활성화하거나
오버라이드할 수 있다. 그러나, API 서버에 안전하게 접근하기만 하면 되는 경우,
자동 생성 및 사용이 권장되는 워크플로이다.

서비스 어카운트 작동 방식에 대한 자세한 내용은
[서비스어카운트(ServiceAccount)](/docs/tasks/configure-pod-container/configure-service-account/) 문서를 참고한다.

### 자신만의 시크릿 생성하기

#### `kubectl` 사용하여 시크릿 생성하기

시크릿에는 파드가 데이터베이스에 접근하는 데 필요한 사용자 자격 증명이 포함될 수 있다.
예를 들어, 데이터베이스 연결 문자열은
사용자명(username)과 비밀번호(password)로 구성된다. 사용자명은 `./username.txt` 파일에
저장하고 비밀번호는 로컬 시스템의 `./password.txt` 파일에 저장할 수 있다.

```shell
# 예제를 위해서 필요한 파일들을 생성한다.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

`kubectl create secret` 명령은 이러한 파일을 시크릿으로 패키징하고
API 서버에 오브젝트를 생성한다.
시크릿 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

출력 결과는 다음과 비슷하다.

```
secret "db-user-pass" created
```

기본 키 이름은 파일명(filename)이다. 선택적으로 `--from-file=[key=]source]` 를 사용하여 키 이름을 설정할 수 있다.

```shell
kubectl create secret generic db-user-pass --from-file=username=./username.txt --from-file=password=./password.txt
```

{{< note >}}
`$`, `\`, `*`, `=`, 그리고 `!` 등의 특수 문자는 [셸](https://ko.wikipedia.org/wiki/셸)에 의해 해석되고 이스케이핑이 필요하다.
대부분의 셸에서, 비밀번호를 이스케이프하는 가장 쉬운 방법은 작은 따옴표(`'`)로 묶는 것이다.
예를 들어, 실제 비밀번호가 `S!B\*d$zDsb=` 이면, 다음과 같은 명령을 실행해야 한다.

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

파일(`--from-file`)에서는 비밀번호의 특수 문자를 이스케이프할 필요가 없다.
{{< /note >}}

다음의 명령으로 시크릿이 생성되었는지 확인할 수 있다.

```shell
kubectl get secrets
```

출력 결과는 다음과 비슷하다.

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

시크릿에 대한 설명을 볼 수 있다.

```shell
kubectl describe secrets/db-user-pass
```

출력 결과는 다음과 비슷하다.

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
`kubectl get` 명령과 `kubectl describe` 명령은 기본적으로 시크릿의 내용을 표시하지
않는다. 이는 시크릿이 우연히 다른 사람에게 노출되거나,
터미널 로그에 저장되지 않도록 보호하기 위함이다.
{{< /note >}}

시크릿 내용을 보는 방법을 익히기 위해서는 [시크릿 디코딩하기](#시크릿-디코딩하기)를 참고한다.

#### 수동으로 시크릿 생성하기

먼저 JSON 또는 YAML 형식으로 파일에 시크릿을 생성한
다음 해당 오브젝트를 생성할 수도 있다.
시크릿 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.
[시크릿](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)은
두 개의 맵(`data` 와 `stringData`)을
포함한다. `data` 필드는 base64를 사용하여, 인코딩된 임의 데이터를 저장하는 데
사용된다. `stringData` 필드는 편의를 위해 제공되며, 시크릿 데이터를 인코딩되지 않은
문자열로 제공할 수 있다.

예를 들어, `data` 필드를 사용하여 시크릿에 두 개의 문자열을 저장하려면, 다음과 같이
문자열을 base64로 변환한다.

```shell
echo -n 'admin' | base64
```

출력 결과는 다음과 비슷하다.

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

출력 결과는 다음과 비슷하다.

```
MWYyZDFlMmU2N2Rm
```

다음과 같은 시크릿을 작성한다.

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

이제 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)를 사용하여 시크릿을 생성한다.

```shell
kubectl apply -f ./secret.yaml
```

출력 결과는 다음과 비슷하다.

```
secret "mysecret" created
```

특정 시나리오의 경우, `stringData` 필드를 대신 사용할 수 있다. 이
필드를 사용하면 base64로 인코딩되지 않은 문자열을 시크릿에 직접 넣을 수 있으며,
시크릿이 생성되거나 업데이트될 때 문자열이 인코딩된다.

이에 대한 실질적인 예는 애플리케이션 배포 시에
구성 파일 저장을 위해서 시크릿을 사용하되, 배포 프로세스 중에 해당 구성 파일의
일부를 채우려는 경우이다.

예를 들어, 애플리케이션이 다음 구성 파일을 사용하는 경우,

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

다음 정의를 사용하여 이를 시크릿에 저장할 수 있다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

그런 다음 `kubectl apply` 를 실행하기 전에 배포 도구로
`{{username}}` 및 `{{password}}` 템플릿 변수를 바꿀 수 있다.

`stringData` 필드는 쓰기 전용의 편의 필드이다. 이 내용은 시크릿을
검색할 때 출력되지 않는다. 예를 들어, 다음 명령을 실행해본다.

```shell
kubectl get secret mysecret -o yaml
```

출력 결과는 다음과 비슷하다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

`username` 과 같은 필드가 `data` 와 `stringData` 모두에 지정되면,
`stringData` 의 값이 사용된다. 예를 들어, 다음의 시크릿 정의를 보자.

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

아래의 시크릿에서 결과는 다음과 같다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

위의 `YWRtaW5pc3RyYXRvcg==` 를 디코딩하면 `administrator` 가 된다.

`data` 와 `stringData` 의 키는 영숫자,
'-', '_' 또는 '.'로 구성되어야 한다.

{{< note >}}
시크릿 데이터의 직렬화된 JSON 및 YAML 값은
base64 문자열로 인코딩된다. 줄바꿈은 이러한 문자열 내에서 유효하지 않으므로
생략해야 한다. Darwin/macOS에서 `base64` 유틸리티를 사용할 때,
사용자는 긴 라인을 분할하는 `-b` 옵션을 사용하면 안된다. 반대로, 리눅스 사용자는
`-w` 옵션을 사용할 수 없는 경우 `base64` 명령이나 `base64 | tr -d '\n'` 파이프라인에
`-w 0` 옵션을 추가 *해야 한다*.
{{< /note >}}

#### 생성기를 통해 시크릿 생성하기

쿠버네티스 v1.14부터 `kubectl` 은 [Kustomize를 사용한 오브젝트 관리](/ko/docs/tasks/manage-kubernetes-objects/kustomization/)를 지원한다. Kustomize는 시크릿과 컨피그맵(ConfigMap)을 생성하기 위한
리소스 생성기를 제공한다. Kustomize 생성기는 디렉터리 내의
`kustomization.yaml` 파일에 지정되어야 한다. 시크릿을 생성한 후,
`kubectl apply` 를 사용하여 API 서버에서 시크릿을 만들 수 있다.

#### 파일을 통해 시크릿 생성하기

./username.txt 와 ./password.txt 파일에서
`secretGenerator` 를 정의하여 시크릿을 생성할 수 있다.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```

`kustomization.yaml` 을 포함하는 디렉터리를 적용하여 시크릿을 생성한다.

```shell
kubectl apply -k .
```

출력 결과는 다음과 비슷하다.

```
secret/db-user-pass-96mffmfh4k created
```

시크릿이 생성되었는지 다음의 명령으로 확인할 수 있다.

```shell
kubectl get secrets
```

출력 결과는 다음과 비슷하다.

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

시크릿에 대한 설명을 볼 수 있다.

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

출력 결과는 다음과 비슷하다.

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

#### 문자열 리터럴(literals)을 통해 시크릿 생성하기

문자열 리터럴인 `username=admin` 과 `password=secret` 을
`secretGenerator` 에 정의하여 시크릿을 만들 수 있다.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```

`kustomization.yaml` 을 포함하는 디렉터리를 적용하여 시크릿을 생성한다.

```shell
kubectl apply -k .
```

출력 결과는 다음과 비슷하다.

```
secret/db-user-pass-dddghtt9b5 created
```

{{< note >}}
시크릿이 생성될 때, 시크릿의 이름은 시크릿 데이터를
해시하고, 해시된 값을 이름에 추가하는 방식으로 만들어진다. 이 방식은
데이터가 수정될 때마다 새로운 시크릿이 생성되도록 만든다.
{{< /note >}}

#### 시크릿 디코딩하기

`kubectl get secret` 을 실행하여 시크릿을 검색할 수 있다.
예를 들어, 다음 명령을 실행하여 이전 섹션에서
생성된 시크릿을 볼 수 있다.

```shell
kubectl get secret mysecret -o yaml
```

출력 결과는 다음과 비슷하다.

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

`password` 필드를 디코딩한다.

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

출력 결과는 다음과 비슷하다.

```
1f2d1e2e67df
```

#### 시크릿 편집하기

기존 시크릿은 다음 명령을 사용하여 편집할 수 있다.

```shell
kubectl edit secrets mysecret
```

이렇게 하면 기본으로 설정된 에디터가 열리고 `data` 필드에 base64로 인코딩된 시크릿 값을 업데이트할 수 있다.

```yaml
# 아래 오브젝트를 수정한다. '#'로 시작하는 줄은 무시되고,
# 빈 파일은 편집이 취소될 것이다. 이 파일을 저장하는 도중에 오류가 발생하면
# 관련 오류와 함께 다시 열린다.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

## 시크릿 사용하기

시크릿은 데이터 볼륨으로 마운트되거나 파드의 컨테이너에서 사용할
{{< glossary_tooltip text="환경 변수" term_id="container-env-variables" >}}로
노출될 수 있다. 또한, 시크릿은 파드에 직접 노출되지 않고,
시스템의 다른 부분에서도 사용할 수 있다. 예를 들어, 시크릿은
시스템의 다른 부분이 사용자를 대신해서 외부 시스템과 상호 작용하는 데 사용해야 하는
자격 증명을 보유할 수 있다.

### 시크릿을 파드의 파일로 사용하기

파드의 볼륨에서 시크릿을 사용하려면 다음과 같이 한다.

1. 시크릿을 생성하거나 기존 시크릿을 사용한다. 여러 파드가 동일한 시크릿을 참조할 수 있다.
1. `.spec.volumes[].` 아래에 볼륨을 추가하려면 파드 정의를 수정한다. 볼륨의 이름을 뭐든지 지정하고, 시크릿 오브젝트의 이름과 동일한 `.spec.volumes[].secret.secretName` 필드를 생성한다.
1. 시크릿이 필요한 각 컨테이너에 `.spec.containers[].volumeMounts[]` 를 추가한다. 시크릿을 표시하려는 사용되지 않은 디렉터리 이름에 `.spec.containers[].volumeMounts[].readOnly = true` 와 `.spec.containers[].volumeMounts[].mountPath` 를 지정한다.
1. 프로그램이 해당 디렉터리에서 파일을 찾도록 이미지 또는 커맨드 라인을 수정한다. 시크릿 `data` 맵의 각 키는 `mountPath` 아래의 파일명이 된다.

다음은 볼륨에 시크릿을 마운트하는 파드의 예시이다.

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
```

사용하려는 각 시크릿은 `.spec.volumes` 에서 참조해야 한다.

파드에 여러 컨테이너가 있는 경우, 모든 컨테이너는
자체 `volumeMounts` 블록이 필요하지만, 시크릿에 대해서는 시크릿당 하나의 `.spec.volumes` 만 필요하다.

많은 파일을 하나의 시크릿으로 패키징하거나, 여러 시크릿을 사용할 수 있으며, 어느 쪽이든 편리한 방법을 사용하면 된다.

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

* `username` 시크릿은 `/etc/foo/username` 대신 `/etc/foo/my-group/my-username` 아래의 파일에 저장된다.
* `password` 시크릿은 투영되지 않는다.

`.spec.volumes[].secret.items` 를 사용하면, `items` 에 지정된 키만 투영된다.
시크릿의 모든 키를 사용하려면, 모든 키가 `items` 필드에 나열되어야 한다.
나열된 모든 키는 해당 시크릿에 존재해야 한다. 그렇지 않으면, 볼륨이 생성되지 않는다.

#### 시크릿 파일 퍼미션

단일 시크릿 키에 대한 파일 접근 퍼미션 비트를 설정할 수 있다.
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

그러고 나면, 시크릿이 `/etc/foo` 에 마운트되고 시크릿 볼륨 마운트로 생성된
모든 파일의 퍼미션은 `0400` 이 될 것이다.

참고로 JSON 스펙은 8진수 표기법을 지원하지 않으므로, 0400 퍼미션에 대해서
값 256을 사용한다. 파드에 대해 JSON 대신 YAML을 사용하는 경우, 8진수 표기법을
사용하여 보다 자연스러운 방식으로 퍼미션을 지정할 수 있다.

참고로 파드에 `kubectl exec` 을 사용하는 경우, 예상되는 파일 모드를 찾기 위해
심볼릭 링크를 따라가야 한다. 예를 들면, 다음과 같다.

파드에서 시크릿 파일 모드를 확인한다.
```
kubectl exec mypod -it sh

cd /etc/foo
ls -l
```

출력 결과는 다음과 비슷하다.
```
total 0
lrwxrwxrwx 1 root root 15 May 18 00:18 password -> ..data/password
lrwxrwxrwx 1 root root 15 May 18 00:18 username -> ..data/username
```

올바른 파일 모드를 찾으려면 심볼릭 링크를 따라간다.

```
cd /etc/foo/..data
ls -l
```

출력 결과는 다음과 비슷하다.
```
total 8
-r-------- 1 root root 12 May 18 00:18 password
-r-------- 1 root root  5 May 18 00:18 username
```

이전 예제에서와 같이 매핑을 사용하여, 다음과 같이
다른 파일에 대해 다른 퍼미션을 지정할 수도 있다.

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
      items:
      - key: username
        path: my-group/my-username
        mode: 0777
```

이 경우, `/etc/foo/my-group/my-username` 에 있는 파일은
결과적으로 `0777` 퍼미션 값을 갖게 된다. JSON을 사용하는 경우, JSON 제한으로 인해
10진수 표기법(`511`)으로 모드를 지정해야 한다.

참고로 이 퍼미션 값은 나중에 읽을 때 10진수 표기법으로
표시될 수 있다.

#### 볼륨에서 시크릿 값 사용하기

시크릿 볼륨을 마운트하는 컨테이너 내부에서, 시크릿 키는 파일로
나타나고 시크릿 값은 base64로 디코딩되어 이런 파일 내에 저장된다.
다음은 위의 예에서 컨테이너 내부에서 실행된 명령의 결과이다.

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

컨테이너의 프로그램은 파일에서 시크릿을 읽는 역할을
한다.

#### 마운트된 시크릿은 자동으로 업데이트됨

볼륨에서 현재 사용되는 시크릿이 업데이트되면, 투영된 키도 결국 업데이트된다.
kubelet은 마운트된 시크릿이 모든 주기적인 동기화에서 최신 상태인지 여부를 확인한다.
그러나, kubelet은 시크릿의 현재 값을 가져 오기 위해 로컬 캐시를 사용한다.
캐시의 유형은 [KubeletConfiguration 구조체](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)의
`ConfigMapAndSecretChangeDetectionStrategy` 필드를 사용하여 구성할 수 있다.
시크릿은 watch(기본값), ttl 기반 또는 단순히 API 서버로 모든 요청을 직접
리디렉션하여 전파할 수 있다.
결과적으로, 시크릿이 업데이트된 순간부터 새로운 키가 파드에 투영되는
순간까지의 총 지연 시간은 kubelet 동기화 시간 + 캐시
전파 지연만큼 길 수 있다. 여기서 캐시 전파 지연은 선택한 캐시 유형에 따라
달라질 수 있다(캐시 전파 지연은 각 캐시 유형에 따라 watch 전파 지연, 캐시의 ttl, 또는 0 에 상응함).

{{< note >}}
시크릿을 [subPath](/ko/docs/concepts/storage/volumes/#subpath-사용하기)
볼륨 마운트로 사용하는 컨테이너는 시크릿 업데이트를
받지 않는다.
{{< /note >}}

### 시크릿을 환경 변수로 사용하기

파드에서 {{< glossary_tooltip text="환경 변수" term_id="container-env-variables" >}}에
시크릿을 사용하려면 다음과 같이 한다.

1. 시크릿을 생성하거나 기존 시크릿을 사용한다. 여러 파드가 동일한 시크릿을 참조할 수 있다.
1. 사용하려는 각 시크릿 키에 대한 환경 변수를 추가하려면 시크릿 키 값을 사용하려는 각 컨테이너에서 파드 정의를 수정한다. 시크릿 키를 사용하는 환경 변수는 시크릿의 이름과 키를 `env[].valueFrom.secretKeyRef` 에 채워야 한다.
1. 프로그램이 지정된 환경 변수에서 값을 찾도록 이미지 및/또는 커맨드 라인을 수정한다.

다음은 환경 변수의 시크릿을 사용하는 파드의 예시이다.

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
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

#### 환경 변수에서 시크릿 값 사용하기

환경 변수에서 시크릿을 사용하는 컨테이너 내부에서, 시크릿 키는
시크릿 데이터의 base64 디코딩된 값을 포함하는 일반 환경 변수로 나타난다.
다음은 위의 예에서 컨테이너 내부에서 실행된 명령의 결과이다.

```shell
echo $SECRET_USERNAME
```

출력 결과는 다음과 비슷하다.

```
admin
```

```shell
echo $SECRET_PASSWORD
```

출력 결과는 다음과 비슷하다.

```
1f2d1e2e67df
```

## 변경할 수 없는(immutable) 시크릿 {#secret-immutable}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

쿠버네티스 베타 기능인 _변경할 수 없는 시크릿과 컨피그맵_ 은
개별 시크릿과 컨피그맵을 변경할 수 없는 것으로 설정하는 옵션을 제공한다. 시크릿을 광범위하게 사용하는
클러스터(최소 수만 개의 고유한 시크릿이 파드에 마운트)의 경우, 데이터 변경을 방지하면
다음과 같은 이점이 있다.

- 애플리케이션 중단을 유발할 수 있는 우발적(또는 원하지 않는) 업데이트로부터 보호
- immutable로 표시된 시크릿에 대한 감시를 중단하여, kube-apiserver의 부하를
크게 줄임으로써 클러스터의 성능을 향상시킴

이 기능은 v1.19부터 기본적으로 활성화된 `ImmutableEphemeralVolumes` [기능
게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)에
의해 제어된다. `immutable` 필드를 `true` 로 설정하여
변경할 수 없는 시크릿을 생성할 수 있다. 다음은 예시이다.
```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```

{{< note >}}
시크릿 또는 컨피그맵을 immutable로 표시하면, 이 변경 사항을 되돌리거나
`data` 필드 내용을 변경할 수 _없다_. 시크릿을 삭제하고 다시 생성할 수만 있다.
기존 파드는 삭제된 시크릿에 대한 마운트 포인트를 유지하며, 이러한 파드를 다시 생성하는 것을
권장한다.
{{< /note >}}

### imagePullSecrets 사용하기

`imagePullSecrets` 필드는 동일한 네임스페이스의 시크릿에 대한 참조 목록이다.
`imagePullSecretsDocker` 를 사용하여 도커(또는 다른 컨테이너) 이미지 레지스트리
비밀번호가 포함된 시크릿을 kubelet에 전달할 수 있다. kubelet은 이 정보를 사용해서 파드를 대신하여 프라이빗 이미지를 가져온다.
`imagePullSecrets` 필드에 대한 자세한 정보는 [PodSpec API](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#podspec-v1-core)를 참고한다.

#### imagePullSecret 수동으로 지정하기

[컨테이너 이미지 문서](/ko/docs/concepts/containers/images/#파드에-imagepullsecrets-명시)에서 `ImagePullSecrets` 지정하는 방법을 배울 수 있다.

### imagePullSecrets가 자동으로 연결되도록 정렬하기

수동으로 `imagePullSecrets` 를 생성하고, 서비스어카운트(ServiceAccount)에서
참조할 수 있다. 해당 서비스어카운트로 생성되거나
기본적인 서비스어카운트로 생성된 모든 파드는 파드의 `imagePullSecrets`
필드를 가져오고 서비스 어카운트의 필드로 설정한다.
해당 프로세스에 대한 자세한 설명은
[서비스 어카운트에 ImagePullSecrets 추가하기](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)를 참고한다.

### 수동으로 생성된 시크릿의 자동 마운트

수동으로 생성된 시크릿(예: GitHub 계정에 접근하기 위한 토큰이 포함된 시크릿)은
시크릿의 서비스 어카운트를 기반한 파드에 자동으로 연결될 수 있다.
해당 프로세스에 대한 자세한 설명은 [파드프리셋(PodPreset)을 사용하여 파드에 정보 주입하기](/docs/tasks/inject-data-application/podpreset/)를 참고한다.

## 상세 내용

### 제약 사항

시크릿 볼륨 소스는 지정된 오브젝트 참조가
실제로 시크릿 유형의 오브젝트를 가리키는지 확인하기 위해 유효성을 검사한다. 따라서, 시크릿에
의존하는 모든 파드보다 먼저 시크릿을 만들어야 한다.

시크릿 리소스는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에 존재한다.
시크릿은 동일한 네임스페이스에 있는 파드에서만 참조할 수 있다.

개별 시크릿의 크기는 1MiB로 제한된다. 이는 API 서버와
kubelet 메모리를 소진시키는 매우 큰 시크릿 생성을 막기 위한 것이다.
그러나, 많은 작은 시크릿을 만들어도 메모리가 고갈될 수 있다. 시크릿으로
인한 메모리 사용에 대한 보다 포괄적인 제한은 향후 버전에 계획된 기능이다.

kubelet은 API 서버에서 시크릿을 가져오는 파드에 대한
시크릿 사용만 지원한다.
여기에는 `kubectl` 을 사용하거나, 레플리케이션 컨트롤러를 통해 간접적으로 생성된 모든
파드가 포함된다. kubelet의 `--manifest-url` 플래그, `--config` 플래그 또는
kubectl의 REST API(이 방법들은 파드를 생성하는 일반적인 방법이 아님)로
생성된 파드는 포함하지 않는다.

시크릿은 optional(선택 사항)로 표시되지 않는 한 파드에서 환경
변수로 사용되기 전에 생성되어야 한다. 존재하지 않는 시크릿을
참조하면 파드가 시작되지 않는다.

명명된 시크릿에 존재하지 않는 키에 대한 참조(`secretKeyRef` 필드)는
파드가 시작되지 않도록 한다.

잘못된 환경 변수 이름으로 간주되는 키가 있는 `envFrom` 필드로
환경 변수를 채우는 데 사용되는 시크릿은 해당 키를
건너뛴다. 이러면 해당 파드가 시작될 수 있다. 원인이 `InvalidVariableNames` 인
이벤트가 발생하며 건너뛴 유효하지 않은 키 목록이
포함된 메시지가 생성된다. 다음의 예는 2개의 유효하지 않은
키(`1badkey` 와 `2alsobad`)가 포함된 default/mysecret을 참조하는 파드를 보여준다.

```shell
kubectl get events
```

출력 결과는 다음과 비슷하다.

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

### 시크릿 및 파드 수명 상호 작용

쿠버네티스 API를 호출하여 파드가 생성될 때, 참조된 시크릿이 있는지 확인하지
않는다. 일단 파드가 스케줄되면, kubelet은 시크릿 값 가져오기를
시도한다. 시크릿이 존재하지 않거나 API 서버에 대한
일시적인 연결 부족으로 인해 시크릿을 가져올 수 없는 경우, kubelet은
주기적으로 재시도한다. kubelet은 아직 시작되지 않은 이유를 설명하는
파드에 대한 이벤트를 보고한다. 시크릿을 가져오면, kubelet은
이를 포함하는 볼륨을 생성하고 마운트한다. 모든 파드의 볼륨이
마운트될 때까지 파드의 컨테이너는 시작되지 않는다.

## 사용 사레

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
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

### 사용 사례: ssh 키가 있는 파드

몇 가지 ssh 키를 포함하는 시크릿을 생성한다.

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

출력 결과는 다음과 비슷하다.

```
secret "ssh-key-secret" created
```

ssh 키를 포함하는 `secretGenerator` 필드가 있는 `kustomization.yaml` 를 만들 수도 있다.

{{< caution >}}
사용자 자신의 ssh 키를 보내기 전에 신중하게 생각한다. 클러스터의 다른 사용자가 시크릿에 접근할 수 있다. 쿠버네티스 클러스터를 공유하는 모든 사용자가 접근할 수 있도록 하려는 서비스 어카운트를 사용하고, 사용자가 손상된 경우 이 계정을 취소할 수 있다.
{{< /caution >}}

이제 ssh 키를 가진 시크릿을 참조하고
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

그러면 컨테이너는 ssh 연결을 맺기 위해 시크릿 데이터를 자유롭게 사용할 수 있다.

### 사용 사례: 운영 / 테스트 자격 증명이 있는 파드

이 예제에서는 운영 환경의 자격 증명이 포함된 시크릿을
사용하는 파드와 테스트 환경의 자격 증명이 있는 시크릿을 사용하는 다른 파드를
보여준다.

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

동일한 kustomization.yaml에 파드를 추가한다.

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

두 컨테이너 모두 각 컨테이너의 환경에 대한 값을 가진 파일시스템에 다음의 파일이 존재한다.

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
이 키는 도트 파일 또는 "숨겨진" 파일을 나타낸다. 예를 들어, 다음 시크릿이 `secret-volume` 볼륨에
마운트되면 아래와 같다.

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
    image: k8s.gcr.io/busybox
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
있을 수 있으며, 이로 인해 프라이빗 키가 공격자에게 노출될 수 있다.

이는 두 개의 컨테이너의 두 개 프로세스로 나눌 수 있다. 사용자 상호 작용과
비즈니스 로직을 처리하지만, 프라이빗 키를 볼 수 없는 프론트엔드 컨테이너와
프라이빗 키를 볼 수 있고, 프론트엔드의 간단한 서명 요청(예를 들어, localhost 네트워킹을 통해)에
응답하는 서명자 컨테이너로 나눌 수 있다.

이 분할된 접근 방식을 사용하면, 공격자는 이제 애플리케이션 서버를 속여서
파일을 읽는 것보다 다소 어려운 임의적인 어떤 작업을 수행해야
한다.

<!-- TODO: explain how to do this while still using automation. -->

## 모범 사례

### 시크릿 API를 사용하는 클라이언트

시크릿 API와 상호 작용하는 애플리케이션을 배포할 때, [RBAC](
/docs/reference/access-authn-authz/rbac/)과 같은 [인가 정책](
/docs/reference/access-authn-authz/authorization/)을
사용하여 접근를 제한해야 한다.

시크릿은 종종 다양한 중요도에 걸친 값을 보유하며, 이 중 많은 부분이
쿠버네티스(예: 서비스 어카운트 토큰)와 외부 시스템으로 단계적으로
확대될 수 있다. 개별 앱이 상호 작용할 것으로 예상되는 시크릿의 힘에 대해 추론할 수 있더라도
동일한 네임스페이스 내의 다른 앱이 이러한 가정을
무효화할 수 있다.

이러한 이유로 네임스페이스 내 시크릿에 대한 `watch` 와 `list` 요청은
매우 강력한 기능이며, 시크릿을 나열하면 클라이언트가 해당 네임스페이스에
있는 모든 시크릿의 값을 검사할 수 있기 때문에 피해야 한다. 클러스터의
모든 시크릿을 감시(`watch`)하고 나열(`list`)하는 기능은 가장 특권이 있는 시스템 레벨의
컴포넌트에 대해서만 예약되어야 한다.

시크릿 API에 접근해야 하는 애플리케이션은 필요한 시크릿에 대한 `get` 요청을
수행해야 한다. 이를 통해 관리자는 앱에 필요한
[개별 인스턴스에 대한 접근을 허용 목록에 추가](
/docs/reference/access-authn-authz/rbac/#referring-to-resources)하면서 모든 시크릿에 대한 접근을
제한할 수 있다.

`get` 반복을 통한 성능 향상을 위해, 클라이언트는 시크릿을
참조한 다음 리소스를 감시(`watch`)하고, 참조가 변경되면 시크릿을 다시 요청하는 리소스를
설계할 수 있다. 덧붙여, 클라이언트에게 개별 리소스를 감시(`watch`)하도록 하는 ["대량 감시" API](
https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)도
제안되었으며, 쿠버네티스의 후속 릴리스에서 사용할 수
있을 것이다.

## 보안 속성

### 보호

시크릿은 시크릿을 사용하는 파드와 독립적으로 생성될 수
있으므로, 파드 생성, 보기, 편집 워크플로 중에
시크릿이 노출될 위험이 적다. 또한 시스템은 가능한 경우
디스크에 기록하지 않는 등 시크릿에 대한 추가 예방 조치를
취할 수 있다.

해당 노드의 파드에 필요한 경우에만 시크릿이 노드로 전송된다.
kubelet은 시크릿이 디스크 저장소에 기록되지 않도록 시크릿을
`tmpfs` 에 저장한다. 일단 시크릿에 의존하는 파드가 삭제되면, kubelet은
시크릿 데이터의 로컬 복제본도 삭제한다.

동일한 노드의 여러 파드에 대한 시크릿이 있을 수 있다. 그러나
파드가 요청하는 시크릿만 해당 컨테이너 내에서 잠재적으로 볼 수 있다.
따라서, 하나의 파드는 다른 파드의 시크릿에 접근할 수 없다.

파드에는 여러 개의 컨테이너가 있을 수 있다. 그러나, 파드의 각 컨테이너는
컨테이너 내에서 볼 수 있도록 파드의 `volumeMounts` 에 있는 시크릿 볼륨을
요청해야 한다. 이것은 유용한 [파드 레벨에서의 보안
파티션](#사용-사례-파드의-한-컨테이너에-표시되는-시크릿)을 구성하는 데 사용할 수 있다.

대부분의 쿠버네티스 배포판에서, 사용자와 API 서버 간,
API 서버에서 kubelet으로의 통신은 SSL/TLS로 보호된다.
이러한 채널을 통해 전송될 때 시크릿이 보호된다.

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

시크릿 데이터에 대해 [저장 시 암호화(encryption at rest)](/docs/tasks/administer-cluster/encrypt-data/)를
활성화할 수 있으며, 이를 통해 보안성에 대한 보장 없이는 시크릿이 {{< glossary_tooltip term_id="etcd" >}}에 저장되지 않도록 한다 .

### 위험

 - API 서버에서 시크릿 데이터는 {{< glossary_tooltip term_id="etcd" >}}에 저장된다.
   따라서,
   - 관리자는 클러스터 데이터에 대해 저장 시 암호화를 활성화해야 한다. (v1.13 이상 필요)
   - 관리자는 etcd에 대한 접근을 admin 사용자로 제한해야 한다.
   - 관리자는 더 이상 사용하지 않을 때 etcd에서 사용하는 디스크를 지우거나 폐기할 수 있다.
   - 클러스터에서 etcd를 실행하는 경우, 관리자는 etcd peer-to-peer 통신에 대해
     SSL/TLS를 사용해야 한다.
 - base64로 인코딩된 시크릿 데이터가 있는 매니페스트(JSON 또는 YAML)
   파일을 통해 시크릿을 구성하는 경우, 이 파일을 공유하거나 소스 리포지터리에
   체크인하면 시크릿이 손상된다. Base64 인코딩은 암호화 방법이 _아니며_
   일반 텍스트와 동일한 것으로 간주된다.
 - 실수로 기록하거나 신뢰할 수 없는 상대방에게 전송하지 않는 것과 같이,
   애플리케이션은 볼륨에서 읽은 후에 시크릿 값을 보호해야 한다.
 - 시크릿을 사용하는 파드를 생성할 수 있는 사용자는 해당 시크릿의 값도 볼 수 있다.
   API 서버 정책이 해당 사용자가 시크릿을 읽을 수 있도록 허용하지 않더라도, 사용자는
   시크릿을 노출하는 파드를 실행할 수 있다.
 - 현재, 모든 노드에 대한 루트 권한이 있는 모든 사용자는 kubelet을 가장하여
   API 서버에서 _모든_ 시크릿을 읽을 수 있다. 단일 노드에 대한 루트 취약점 공격의
   영향을 제한하기 위해, 실제로 필요한 노드에만 시크릿을 보내는 것이 앞으로 계획된
   기능이다.
