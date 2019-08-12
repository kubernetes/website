---
title: 컨테이너를 위한 환경 변수 정의하기
content_template: templates/task
weight: 20
---

{{% capture overview %}}

본 페이지는 쿠버네티스 파드의 컨테이너를 위한 환경 변수를
정의하는 방법에 대해 설명한다.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## 컨테이너를 위한 환경 변수 정의하기

파드를 생성할 때, 파드 안에서 동작하는 컨테이너를 위한 환경 변수를 설정할 
수 있다. 환경 변수를 설정하려면, 구성 파일에 `env`나 `envFrom` 필드를
포함시켜야 한다.

이 예제에서, 한 개의 컨테이너를 실행하는 파드를 생성한다. 파드를 위한 구성
파일은 `DEMO_GREETING` 이라는 이름과 `"Hello from the environment"`이라는
값을 가지는 환경 변수를 정의한다. 다음은 파드를 위한 구성 파일
예시이다.

{{< codenew file="pods/inject/envars.yaml" >}}

1. YAML 구성 파일을 활용해 파드를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

1. 실행 중인 파드들의 목록을 조회한다.

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    출력은 아래와 비슷할 것이다.

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

1. 파드 안에 실행되고 있는 컨테이너의 셸에 접근한다.

    ```shell
    kubectl exec -it envar-demo -- /bin/bash
    ```

1. 셸 안에서, 환경 변수를 나열하기 위해 `printenv` 커맨드를 실행한다.

    ```shell
    root@envar-demo:/# printenv
    ```

    출력은 아래와 비슷할 것이다.

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

1. 셸에서 빠져나오기 위해, `exit`을 입력한다.

{{< note >}}
`env` 나 `envFrom` 필드를 이용해 설정된 환경 변수들은 컨테이너 이미지 
안에서 명시된 어떠한 환경 변수들보다 더 우선시된다.
{{< /note >}}

## 설정 안에서 환경 변수 사용하기

파드의 구성 파일 안에서 정의한 환경 변수는 파드의 컨테이너를 위해 설정하는 커맨드들과 인자들과 같이, 구성 파일 안의 다른 곳에서 사용할 수 있다. 아래의 구성 파일 예시에서, `GREETING`, `HONORIFIC`, 그리고 `NAME` 환경 변수들이 각각 `Warm greetings to`, `The Most honorable`, 그리고 `Kubernetes`로 설정되어 있다. 이들 환경 변수들은 이후 `env-print-demo` 컨테이너에 전달되어 CLI 인자에서 사용된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

컨테이너가 생성되면, `echo Warm greetings to The Most Honorable Kubernetes` 커맨드가 컨테이너에서 실행된다.

{{% /capture %}}

{{% capture whatsnext %}}

* [환경 변수](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)에 대해 알아본다.
* [시크릿을 환경 변수로 사용하기](/docs/user-guide/secrets/#using-secrets-as-environment-variables)에 대해 알아본다.
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)를 확인한다.

{{% /capture %}}