---
title: 종속 환경 변수 정의하기
content_type: task
weight: 20
---

<!-- overview -->

본 페이지는 쿠버네티스 파드의 컨테이너를 위한 종속 환경 변수를 
정의하는 방법에 대해 설명한다.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## 컨테이너를 위한 종속 환경 변수 정의하기

파드를 생성할 때, 파드 안에서 동작하는 컨테이너를 위한 종속 환경 변수를 설정할 수 있다. 종속 환경 변수를 설정하려면, 구성 파일에서 `env`의 `value`에 $(VAR_NAME)을 사용한다.

이 예제에서는 한 개의 컨테이너를 실행하는 파드를 생성한다.
파드를 위한 구성 파일은 일반적인 방식으로 정의된 종속 환경 변수를 정의한다.
다음은 파드를 위한 구성 매니페스트 예시이다.

{{< codenew file="pods/inject/dependent-envars.yaml" >}}

1. YAML 구성 파일을 활용해 파드를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```
   ```
   pod/dependent-envars-demo created
   ```

2. 실행 중인 파드의 목록을 조회한다.

   ```shell
   kubectl get pods dependent-envars-demo
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. 파드 안에서 동작 중인 컨테이너의 로그를 확인한다.

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

위에서 보듯이, `SERVICE_ADDRESS`는 올바른 종속성 참조, `UNCHANGED_REFERENCE`는 잘못된 종속성 참조를 정의했으며 `ESCAPED_REFERENCE`는 종속성 참조를 건너뛴다.

미리 정의된 환경 변수를 참조할 때는,
`SERVICE_ADDRESS`의 경우와 같이 참조를 올바르게 해석할 수 있다.

`env` 목록 안에서의 순서가 영향을 준다는 것을 주의하자.
목록에서 더 아래쪽에 명시된 환경 변수는, "정의된" 것으로 보지 않는다.
이것이 바로 위의 예시에서 `UNCHANGED_REFERENCE`가 `$(PROTOCOL)`을 해석하지 못한 이유이다.

환경 변수가 정의되지 않았거나 일부 변수만 포함된 경우, 정의되지 않은 환경 변수는 `UNCHANGED_REFERENCE`의 경우와 같이 일반 문자열로 처리된다. 일반적으로 환경 변수 해석에 실패하더라도 컨테이너의 시작을 막지는 않는다.

`$(VAR_NAME)` 구문은 이중 $로 이스케이프될 수 있다. (예: `$$(VAR_NAME)`)
이스케이프된 참조는 참조된 변수가 정의되었는지 여부에 관계없이 해석을 수행하지 않는다. 
이는 위의 `ESCAPED_REFERENCE`를 통해 확인할 수 있다.

## {{% heading "whatsnext" %}}


* [환경 변수](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)에 대해 알아본다.
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)를 확인한다.

