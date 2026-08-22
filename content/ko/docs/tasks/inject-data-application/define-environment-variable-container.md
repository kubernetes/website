---
title: 컨테이너의 환경 변수 정의하기
content_type: task
weight: 20
---

<!-- overview -->

이 페이지에서는 쿠버네티스 파드에 있는 컨테이너의 환경 변수를
정의하는 방법을 설명한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 컨테이너의 환경 변수 정의하기

파드를 생성할 때, 파드 안에서 동작하는 컨테이너의 환경 변수를
설정할 수 있다. 환경 변수를 설정하려면 구성 파일에 `env`나 `envFrom` 필드를
포함해야 한다.

`env`와 `envFrom` 필드는 서로 다른 영향을 미친다.

`env`
: 컨테이너의 환경 변수를 설정할 수 있도록 하며, 명명한 각 변수에 값을 직접 지정할 수 있다.

`envFrom`
: 컨테이너의 환경 변수를 컨피그맵이나 시크릿 중 하나를 참조하여 설정할 수 있도록 한다.
 `envFrom`을 사용할 때, 참조된 컨피그맵이나 시크릿의 모든 키-값 쌍이
 컨테이너의 환경 변수로 설정된다.
 또한 공통 접두사 문자열을 지정할 수 있다.

[컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)과
[시크릿](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables)에서 더 자세히 알아볼 수 있다.

이 페이지에서는 `env`를 사용하는 방법을 설명한다.

이 실습에서는 한 개의 컨테이너를 실행하는 파드를 생성한다. 파드의 구성 
파일은 `DEMO_GREETING`이라는 이름과 `"Hello from the environment"`라는
값을 가지는 환경 변수를 정의한다. 다음은 파드의 구성 
매니페스트이다.

{{% code_sample file="pods/inject/envars.yaml" %}}

1. 해당 매니페스트를 기반으로 파드를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

1. 실행 중인 파드의 목록을 조회한다.

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```

   결과는 다음과 같다.

   ```
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

1. 파드의 컨테이너 환경 변수를 조회한다.

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   결과는 다음과 같다.

   ```
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Hello from the environment
   DEMO_FAREWELL=Such a sweet sorrow
   ```

{{< note >}}
`env`나 `envFrom` 필드를 사용해 설정된 환경 변수는
컨테이너 이미지에 지정된 환경 변수를 모두 오버라이드한다.
{{< /note >}}

{{< note >}}
환경 변수는 서로를 참조할 수 있지만, 순서가 중요하다.
동일한 컨텍스트에서 정의된 다른 변수를 사용하는 변수는 목록의 뒤쪽에 나와야 한다.
마찬가지로, 순환 참조를 피해야 한다.
{{< /note >}}

## 구성에서 환경 변수 사용하기

파드의 구성에서 `.spec.containers[*].env[*]` 아래에 정의한 환경 변수는
구성의 다른 곳, 예를 들면
파드의 컨테이너에 설정하는 커맨드와 인자에서 사용할 수 있다.
아래의 구성 파일 예시에서 `GREETING`, `HONORIFIC`, 그리고
`NAME` 환경 변수는 각각 `Warm greetings to`, `The Most Honorable`,
그리고 `Kubernetes`로 설정되어 있다. 환경 변수 
`MESSAGE`는 이 모든 환경 변수를 합치고 이를
`env-print-demo` 컨테이너에 전달되는 CLI 인자로 사용한다.

환경 변수명은 '='를 제외한 [출력 가능한 ASCII 문자](https://www.ascii-code.com/characters/printable-characters)로 구성할 수 있다.

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
    - name: MESSAGE
      value: "$(GREETING) $(HONORIFIC) $(NAME)"
    command: ["echo"]
    args: ["$(MESSAGE)"]
```

생성 시, `echo Warm greetings to The Most Honorable Kubernetes` 명령이 컨테이너에서 실행된다.

## {{% heading "whatsnext" %}}

* [환경 변수](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)에 대해 자세히 알아본다.
* [시크릿을 환경 변수로 사용하기](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)에 대해 알아본다.
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)를 확인한다.

