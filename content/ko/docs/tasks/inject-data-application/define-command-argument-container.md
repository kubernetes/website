---
title: 컨테이너를 위한 커맨드와 인자 정의하기
content_template: templates/task
weight: 10
---

{{% capture overview %}}

본 페이지는 {{< glossary_tooltip text="파드" term_id="pod" >}} 안에서 컨테이너를 실행할
때 커맨드와 인자를 정의하는 방법에 대해 설명한다.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## 파드를 생성할 때 커맨드와 인자를 정의하기

파드를 생성할 때, 파드 안에서 동작하는 컨테이너를 위한 커맨드와 인자를
정의할 수 있다. 커맨드를 정의하기 위해서는, 파드 안에서 실행되는 컨테이너에
`command` 필드를 포함시킨다. 커맨드에 대한 인자를 정의하기 위해서는, 구성
파일에 `args` 필드를 포함시킨다. 정의한 커맨드와 인자들은 파드가 생성되고
난 이후에는 변경될 수 없다.

구성 파일 안에서 정의하는 커맨드와 인자들은 컨테이너 이미지가 
제공하는 기본 커맨드와 인자들보다 우선시 된다. 만약 인자들을 
정의하고 커맨드를 정의하지 않는다면, 기본 커맨드가 새로운 인자와 
함께 사용된다.

{{< note >}}
`command` 필드는 일부 컨테이너 런타임에서 `entrypoint`에 해당된다.
아래의 [참고사항](#참고사항)을 확인하자.
{{< /note >}}

이 예제에서는 한 개의 컨테이너를 실행하는 파드를 생성한다. 파드를 위한 구성
파일에서 커맨드와 두 개의 인자를 정의한다.

{{< codenew file="pods/commands.yaml" >}}

1. YAML 구성 파일을 활용해 파드를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/commands.yaml
    ```

1. 실행 중인 파드들의 목록을 조회한다.

    ```shell
    kubectl get pods
    ```

    출력은 command-demo라는 파드 안에서 실행된 컨테이너가 완료되었다고 표시할
    것이다.

1. 컨테이너 안에서 실행된 커맨드의 출력을 보기 위해, 파드의 로그를
확인한다.

    ```shell
    kubectl logs command-demo
    ```

    출력은 HOSTNAME과 KUBERNETES_PORT 환경 변수들의 값들을 표시할
    것이다.

    ```
    command-demo
    tcp://10.3.240.1:443
    ```

## 인자를 정의하기 위해 환경 변수를 사용하기

이전 예제에서는, 문자열을 제공하면서 직접 인자를 정의해보았다.
문자열을 직접 제공하는 것에 대한 대안으로, 환경 변수들을 사용하여 인자들을
정의할 수 있다.

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

이것은 [컨피그 맵](/docs/tasks/configure-pod-container/configure
-pod-configmap/)과 [시크릿](/docs/concepts/configuration/secret/)을
포함해, 환경 변수를 정의하는데 활용할 수 있는 모든 방법들을 활용해서 파드를 위한 인자를
정의할
수 있다는 것을 의미한다.

{{< note >}}
환경 변수는 `"$(VAR)"`와 같이 괄호 안에 나타난다. 이는 변수가 `command`나 `args`
필드 안에서 전개되기 위해 필요한 것이다.
{{< /note >}}

## 셸 안에서 커맨드 실행하기

일부 경우들에서는 커맨드를 셸 안에서 실행해야할 필요가 있다. 예를 들어, 실행할 커맨드가
서로 연결되어 있는 여러 개의 커맨드들로 구성되어 있거나, 셸 스크립트일 수도 있다. 셸 안에서 
커맨드를 실행하려고 한다면, 이런 방식으로 감싸주면 된다.

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## 참고사항

이 테이블은 도커와 쿠버네티스에서 사용되는 필드 이름들을 정리한 것이다.

|                   설명                  |       도커 필드 이름      |    쿠버네티스 필드 이름    |
|----------------------------------------|------------------------|-----------------------|
|  컨테이너에서 실행되는 커맨드                 |  Entrypoint            |      command          |
|  커맨드에 전달되는 인자들                    |  Cmd                   |      arg              |

기본 Entrypoint와 Cmd 값을 덮어쓰려고 한다면, 아래의 규칙들이 적용된다.

* 만약 컨테이너를 위한 `command` 값이나 `args` 값을 제공하지 않는다면, 도커 이미지 안에 
제공되는 기본 값들이 사용된다.

* 만약 컨테이너를 위한 `command` 값을 제공하고, `args` 값을 제공하지 않는다면, 
제공된 `command` 값만이 사용된다. 도커 이미지 안에 정의된 기본 EntryPoint 값과 기본 
Cmd 값은 덮어쓰여진다.

* 만약 컨테이너를 위한 `args` 값만 제공한다면, 도커 이미지 안에 정의된 기본 EntryPoint 
값이 정의한 `args` 값들과 함께 실행된다.

* `command` 값과 `args` 값을 동시에 정의한다면, 도커 이미지 안에 정의된 기본 
EntryPoint 값과 기본 Cmd 값이 덮어쓰여진다. `command`가 `args` 값과 함께 
실행된다.

여기 몇 가지 예시들이 있다.

| 이미지 Entrypoint    |    이미지 Cmd      | 컨테이너 command      |  컨테이너 args      |    실행되는 커맨드   |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    | &lt;설정되지 않음&gt;  | &lt;설정되지 않음&gt; | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      | &lt;설정되지 않음&gt; |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    | &lt;설정되지 않음&gt;  |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |


{{% /capture %}}

{{% capture whatsnext %}}

* [파드와 컨테이너를 구성하는 방법](/ko/docs/tasks/)에 대해 더 알아본다.
* [컨테이너 안에서 커맨드를 실행하는 방법](/docs/tasks/debug-application-cluster/get-shell-running-container/)에 대해 더 알아본다.
* [컨테이너](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)를 확인한다.

{{% /capture %}}


