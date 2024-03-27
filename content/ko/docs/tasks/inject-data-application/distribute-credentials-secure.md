---
title: 시크릿(Secret)을 사용하여 안전하게 자격증명 배포하기
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

본 페이지는 암호 및 암호화 키와 같은 민감한 데이터를 파드에 안전하게 
주입하는 방법을 설명한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

### 시크릿 데이터를 base-64 표현으로 변환하기

사용자 이름 `my-app`과 비밀번호 `39528$vdg7Jb`의 두 가지 시크릿 데이터가 필요하다고 가정한다.
먼저 base64 인코딩 도구를 사용하여 사용자 이름과 암호를 base64 표현으로 변환한다. 다음은 일반적으로  사용 가능한 base64 프로그램을 사용하는 예제이다.

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

사용자 이름의 base-64 표현이 `bXktYXBw`이고 암호의 base-64 표현이 `Mzk1MjgkdmRnN0pi`임을 
출력을 통해 확인할 수 있다.

{{< caution >}}
사용자의 OS가 신뢰하는 로컬 툴을 사용하여 외부 툴의 보안 위험을 줄이자.
{{< /caution >}}

<!-- steps -->

## 시크릿 생성하기

다음은 사용자 이름과 암호가 들어 있는 시크릿을 생성하는 데 사용할 수 있는 
구성 파일이다.

{{% codenew file="pods/inject/secret.yaml" %}}

1. 시크릿을 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

1. 시크릿에 대한 정보를 확인한다.

   ```shell
   kubectl get secret test-secret
   ```

   결과는 다음과 같다.

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. 시크릿에 대한 자세한 정보를 확인한다.

   ```shell
   kubectl describe secret test-secret
   ```

   결과는 다음과 같다.

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

### kubectl로 직접 시크릿 생성하기

Base64 인코딩 단계를 건너뛰려면 `kubectl create secret` 명령을 사용하여 
동일한 Secret을 생성할 수 있다. 다음은 예시이다.

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

이와 같이 더 편리하게 사용할 수 있다. 앞에서 설명한 자세한 접근 방식은 각 단계를 
명시적으로 실행하여 현재 상황을 확인할 수 있다.

## 볼륨을 통해 시크릿 데이터에 접근할 수 있는 파드 생성하기

다음은 파드를 생성하는 데 사용할 수 있는 구성 파일이다.

{{% codenew file="pods/inject/secret-pod.yaml" %}}

1. 파드를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. 파드가 실행중인지 확인한다.

   ```shell
   kubectl get pod secret-test-pod
   ```

   Output:
   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. 파드에서 실행 중인 컨테이너의 셸을 가져오자.
   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. 시크릿 데이터는 `/etc/secret-volume`에 마운트된 볼륨을 통해 
   컨테이너에 노출된다.

   셸에서 `/etc/secret-volume` 디렉터리의 파일을 나열한다.
   ```shell
   # 컨테이너 내부의 셸에서 실행하자
   ls /etc/secret-volume
   ```
   두 개의 파일과 각 파일의 시크릿 데이터 조각을 확인할 수 있다.
   ```
   password username
   ```

1. 셸에서 `username` 및 `password` 파일의 내용을 출력한다.
   ```shell
   # 컨테이너 내부의 셸에서 실행하자
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```
   사용자 이름과 비밀번호가 출력된다.
   ```
   my-app
   39528$vdg7Jb
   ```

프로그램이 `mountPath` 디렉토리 아래의 파일을 찾을 수 있도록 
이미지 또는 커맨드 라인을 수정한다. 
시크릿 `data` 맵의 각 키는 이 디렉토리 아래 파일의 파일명으로 사용된다.

### 시크릿 키를 특정 파일 경로에 투영하기

시크릿 키가 투영될 볼륨 내 경로를 제어할 수도 있다.
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

이 파드를 배포하면, 다음과 같은 일들이 일어날 것이다.

- `mysecret`의 `username` 키는 컨테이너의 `/etc/foo/username` 경로 대신 
  `/etc/foo/my-group/my-username` 경로에서 사용 가능하다.
- 시크릿 오브젝트의 `password` 키는 투영되지 않는다.

`.spec.volumes[].secret.items`를 사용하여 키들을 명시적으로 나열하려면, 
다음 사항을 고려한다.

- `items`에 명시한 키들만 투영된다.
- 시크릿의 모든 키를 사용(consume)하려면, 
  모든 키가 `items` 필드에 나열되어야 한다.
- 나열된 모든 키가 해당 시크릿에 존재해야 한다. 
  그렇지 않으면, 볼륨이 생성되지 않는다.

### 시크릿 키에 POSIX 퍼미션 설정하기

단일 시크릿 키에 대한 POSIX 파일 접근 퍼미션 비트를 설정할 수 있다.
만약 사용자가 퍼미션을 지정하지 않았다면, 기본적으로 `0644` 가 사용된다.
전체 시크릿 볼륨에 대한 기본 POSIX 파일 모드를 설정할 수도 있고, 
필요한 경우 키별로 오버라이드할 수도 있다.

예를 들어, 다음과 같이 기본 모드를 지정할 수 있다.

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

시크릿은 `/etc/foo` 에 마운트되며, 
시크릿 볼륨 마운트로 생성된 모든 파일의 퍼미션은 `0400` 이다.

{{< note >}}
JSON을 사용하여 파드 또는 파드 템플릿을 정의하는 경우, 
JSON 스펙이 8진수 표기법을 지원하지 않음에 
유의한다(JSON은 `0400`을 *10진수* `400`으로 간주한다). 
JSON 사용 시에는, `defaultMode`에 대해 8진수 대신 10진수를 사용하라. 
YAML로 작성하는 경우, `defaultMode` 값을 8진수로 표기할 수 있다.
{{< /note >}}

## 시크릿 데이터를 사용하여 컨테이너 환경 변수 정의하기

시크릿의 데이터를 컨테이너 내부의 환경 변수 형태로 
사용할 수 있다.

컨테이너가 이미 시크릿을 환경 변수 형태로 사용하고 있다면, 
컨테이너가 재시작되기 전에는 시크릿이 업데이트되어도 컨테이너가 인식할 수 없다. 
시크릿이 변경되면 컨테이너 재시작을 트리거하는 
써드파티 솔루션이 존재한다.

### 단일 시크릿 데이터로 컨테이너 환경 변수 정의하기

- 환경 변수를 시크릿의 키-값 쌍으로 정의한다.

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```

- 시크릿에 정의된 `backend-username` 값을 파드 명세의 `SECRET_USERNAME` 환경 변수에 할당한다.

   {{% codenew file="pods/inject/pod-single-secret-env-variable.yaml" %}}

- 파드를 생성한다.

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

- 셸에서 `SECRET_USERNAME` 컨테이너 환경 변수의 내용을 출력한다.

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  출력은 다음과 같다.
  ```
  backend-admin
  ```

### 여러 시크릿 데이터로 컨테이너 환경 변수 정의하기

- 이전 예제와 마찬가지로 시크릿을 먼저 생성한다.

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

- 파드 명세에 환경 변수를 정의한다.

   {{% codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

- 파드를 생성한다.

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

- 셸에서 컨테이너 환경 변수를 출력한다.

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```
  출력은 다음과 같다.
  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

## 시크릿의 모든 키-값 쌍을 컨테이너 환경 변수로 구성하기

{{< note >}}
이 기능은 쿠버네티스 v1.6 이상에서 사용할 수 있다.
{{< /note >}}

- 여러 키-값 쌍을 포함하는 시크릿을 생성한다.

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

- envFrom을 사용하여 시크릿의 모든 데이터를 컨테이너 환경 변수로 정의한다. 시크릿의 키는 파드에서 환경 변수의 이름이 된다.

    {{% codenew file="pods/inject/pod-secret-envFrom.yaml" %}}

- 파드를 생성한다.

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

- `username` 및 `password` 컨테이너 환경 변수를 셸에서 출력한다.

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  출력은 다음과 같다.
  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

### 참고

- [시크릿](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [볼륨](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [파드](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

- [시크릿](/ko/docs/concepts/configuration/secret/)에 대해 더 배워 보기.
- [볼륨](/ko/docs/concepts/storage/volumes/)에 대해 더 배워 보기.
