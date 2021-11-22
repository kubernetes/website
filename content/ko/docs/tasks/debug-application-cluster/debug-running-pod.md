---



title: 동작 중인 파드 디버그
content_type: task
---

<!-- overview -->

이 페이지는 노드에서 동작 중인(혹은 크래시된) 파드를 디버그하는 방법에 대해 설명한다.



## {{% heading "prerequisites" %}}


* 여러분의 {{< glossary_tooltip text="파드" term_id="pod" >}}는 이미 스케줄링 되어
  동작하고 있을 것이다. 만약 파드가 아직 동작중이지 않다면, [애플리케이션
  트러블슈팅](/docs/tasks/debug-application-cluster/debug-application/)을 참고한다.
* 일부 고급 디버깅 과정에서는 해당 파드가 어떤 노드에서 동작하고 있는지
  알아야 하고, 해당 노드에서 쉘 명령어를 실행시킬 수 있어야 한다.
  `kubectl`을 사용하는 일반적인 디버깅 과정에서는 이러한 접근 권한이 필요하지 않다.



<!-- steps -->

## 파드의 로그 확인하기 {#examine-pod-logs}

먼저, 확인하고자 하는 컨테이너의 로그를 확인한다.

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

만약 컨테이너가 이전에 크래시 되었다면, 다음의 명령을 통해 컨테이너의 크래시 로그를 살펴볼 수 있다.

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## exec를 통해 컨테이너 디버깅하기 {#container-exec}

만약 {{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}}에
디버깅 도구가 포함되어 있다면, `kubectl exec`을 통해 특정 컨테이너에서 해당 명령들을
실행할 수 있다. (리눅스나 윈도우 OS를 기반으로 만들어진 이미지에는 대부분 디버깅 도구를 포함하고
있다.)

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` 인자는 선택적이다. 만약 하나의 컨테이너만 포함된 파드라면 해당 옵션을 생략할 수 있다.
{{< /note >}}

예를 들어, 동작 중인 카산드라 파드의 로그를 살펴보기 위해서는 다음과 같은 명령을 실행할 수 있다.

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

`kubectl exec`에 `-i`와 `-t` 옵션을 사용해서 터미널에서 접근할 수 있는 쉘을 실행시킬 수도 있다.
예를 들면 다음과 같다.

```shell
kubectl exec -it cassandra -- sh
```

더욱 상세한 내용은 다음 [동작중인 컨테이너의 쉘에 접근하기](
/docs/tasks/debug-application-cluster/get-shell-running-container/)를 참고하라.

## 임시(ephemeral) 디버그 컨테이너를 사용해서 디버깅하기 {#ephemeral-container}

{{< feature-state state="alpha" for_k8s_version="v1.18" >}}

컨테이너가 크래시 됐거나 [distroless 이미지](https://github.com/GoogleContainerTools/distroless)처럼
컨테이너 이미지에 디버깅 도구를 포함하고 있지 않아
`kubectl exec`가 충분하지 않을 경우에는
{{< glossary_tooltip text="임시(Ephemeral) 컨테이너" term_id="ephemeral-container" >}}를 사용하는 것이
인터랙티브한 트러블슈팅에 유용하다. `kubectl` `v1.18` 
버전부터는 임시 컨테이너를 생성할 수 있는 알파 단계의
명령어가 있다.

### 임시 컨테이너를 사용한 디버깅 예시 {#ephemeral-container-example}

{{< note >}}
이 섹션에서 소개하는 예시를 사용하기 위해서는
여러분의 클러스터에 `EphemeralContainers` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가
활성화되어 있어야 하고 `kubectl`의 버전이 v1.18 이상이어야 한다.
{{< /note >}}

`kubectl debug` 명령어를 사용해서 동작 중인 파드에 임시 컨테이너를 추가할 수 있다.
먼저, 다음과 같이 파드를 추가한다.

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

이 섹션의 예시에서는 디버깅 도구가 포함되지 않은 이미지의 사례를 보여드리기 위해
`pause` 컨테이너 이미지를 사용했는데, 이 대신 어떠한 이미지를 사용해도
될 것이다.

만약 `kubectl exec`을 통해 쉘을 생성하려 한다면 다음과 같은 에러를
확인할 수 있을 텐데, 그 이유는 이 이미지에 쉘이 존재하지 않기 때문이다.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

이 명령어 대신 `kubectl debug`을 사용해서 디버깅 컨테이너를 생성할 수 있다.
만약 `-i`/`--interactive` 인자를 사용한다면, `kubectl`은 임시
컨테이너의 콘솔에 자동으로 연결할 것이다.

```shell
kubectl debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

이 명령어는 새로운 busybox 컨테이너를 추가하고 해당 컨테이너로 연결한다. `--target`
파라미터를 사용하면 다른 컨테이너의 프로세스 네임스페이스를 대상으로 하게 된다. 여기서는
이 옵션이 꼭 필요한데, `kubectl run`이 생성하는 파드에 대해
[프로세스 네임스페이스 공유](/docs/tasks/configure-pod-container/share-process-namespace/)를
활성화하지 않기 때문이다.

{{< note >}}
`--target` 파라미터는 사용 중인 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}에서
지원해야지만 사용할 수 있다. 만일 지원되지 않는다면,
임시 컨테이너가 시작되지 않을 수 있거나 독립적인 프로세스
네임스페이스를 가지고 시작될 수 있다.
{{< /note >}}

`kubectl describe` 명령을 사용하면 새롭게 생성된 임시 컨테이너의 상태를 확인할 수 있다.

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

디버깅이 다 끝나면 `kubectl delete`을 통해 파드를 제거할 수 있다.

```shell
kubectl delete pod ephemeral-demo
```

## 파드의 복제본을 이용해서 디버깅하기

때때로 파드의 설정 옵션에 따라 특정 상황에서 트러블슈팅을 하기가 어려울 수 있다.
예를 들어, 만일 여러분의 컨테이너 이미지가 쉘을 포함하고 있지 않거나, 여러분의
애플리케이션이 컨테이너 시작에서 크래시가 발생한다면 `kubectl exec`을 이용해서
컨테이너를 트러블슈팅할 수 없을 수 있다. 이러한 상황에서는 `kubectl debug`을 사용해서
파드의 복제본을 디버깅을 위한 추가적인 설정 옵션과 함께 생성할 수 있다.

### 새 컨테이너와 함께 파드의 복제본 생성하기

만일 여러분의 애플리케이션이 동작은 하고 있지만 예상과는 다르게 동작하는 경우,
파드의 복제본에 새로운 컨테이너를 추가함으로써 추가적인 트러블슈팅 도구들을
파드에 함께 추가할 수 있다.

가령, 여러분의 애플리케이션 컨테이너 이미지는 `busybox`를 기반으로 하고 있는데
여러분은 `busybox`에는 없는 디버깅 도구를 필요로 한다고 가정해 보자. 이러한
시나리오는 `kubectl run` 명령을 통해 시뮬레이션 해볼 수 있다.

```shell
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

다음의 명령을 실행시켜 디버깅을 위한 새로운 우분투 컨테이너와 함께 `myapp-debug`이란
이름의 `myapp` 컨테이너 복제본을 생성할 수 있다.

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
* 만일 여러분이 새로 생성되는 컨테이너의 이름을 `--container` 플래그와 함께 지정하지 않는다면,
  `kubectl debug`는 자동으로 새로운 컨테이너 이름을 생성한다.
* `-i` 플래그를 사용하면 `kubectl debug` 명령이 새로운 컨테이너에 기본적으로 연결되게 된다.
  이러한 동작은 `--attach=false`을 지정하여 방지할 수 있다. 만일 여러분의 세션이
  연결이 끊어진다면 `kubectl attach`를 사용해서 다시 연결할 수 있다.
* `--share-processes` 옵션은 이 파드에 있는 컨테이너가 해당 파드에 속한 다른 컨테이너의
  프로세스를 볼 수 있도록 한다. 이 옵션이 어떻게 동작하는지에 대해 더 알아보기 위해서는
  다음의 [파드의 컨테이너 간 프로세스 네임스페이스 공유](
  /docs/tasks/configure-pod-container/share-process-namespace/)를 참고하라.
{{< /note >}}

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

### 명령어를 변경하며 파드의 복제본 생성하기

때때로 컨테이너의 명령어를 변경하는 것이 유용한 경우가 있는데, 예를 들면 디버그 플래그를 추가하기
위해서나 애플리케이션이 크래시 되는 경우이다.

다음의 `kubectl run` 명령을 통해 즉각적으로 크래시가 발생하는 애플리케이션의
사례를 시뮬레이션해 볼 수 있다.

```
kubectl run --image=busybox myapp -- false
```

`kubectl describe pod myapp` 명령을 통해 이 컨테이너에 크래시가 발생하고 있음을 확인할 수 있다.

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

이러한 경우에 `kubectl debug`을 통해 명령어를 지정함으로써 해당 파드의
복제본을 인터랙티브 쉘로 생성할 수 있다.

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

이제 인터랙티브 쉘에 접근할 수 있으니 파일 시스템 경로를 확인하거나
동작 중인 컨테이너의 명령어를 직접 확인하는 등의 작업이 가능하다.

{{< note >}}
* 특정 컨테이너의 명령어를 변경하기 위해서는 `--container` 옵션을 통해 해당 컨테이너의
  이름을 지정해야만 한다. 이름을 지정하지 않는다면 `kubectl debug`은 이전에 지정한 명령어를
  그대로 사용해서 컨테이너를 생성할 것이다.
* 기본적으로 `-i` 플래그는 `kubectl debug` 명령이 컨테이너에 바로 연결되도록 한다.
  이러한 동작을 방지하기 위해서는 `--attach=false` 옵션을 지정할 수 있다. 만약 여러분이 세션이
  종료된다면 `kubectl attach` 명령을 통해 다시 연결할 수 있다.
{{< /note >}}

사용이 모두 끝나면, 디버깅에 사용된 파드들을 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

### 컨테이너 이미지를 변경하며 파드의 복제본 생성하기

특정한 경우에 여러분은 제대로 동작하지 않는 파드의 이미지를
기존 프로덕션 컨테이너 이미지에서 디버깅 빌드나 추가적인 도구를 포함한
이미지로 변경하고 싶을 수 있다.

이 사례를 보여주기 위해 `kubectl run` 명령을 통해 파드를 생성하였다.

```
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

여기서는 `kubectl debug` 명령을 통해 해당 컨테이너 이미지를 `ubuntu`로 변경하며
복제본을 생성하였다.

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

`--set-image`의 문법은 `kubectl set image`와 동일하게 `container_name=image`
형식의 문법을 사용한다. `*=ubuntu`라는 의미는 모든 컨테이너의 이미지를 `ubuntu`로
변경하겠다는 의미이다.

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

## 노드의 쉘을 사용해서 디버깅하기 {#node-shell-session}

만약 위의 어떠한 방법도 사용할 수 없다면, 파드가 현재 동작 중인 노드를 찾아
호스트의 네임스페이스로 동작하는 특권 파드를 생성할 수 있다.
다음 `kubectl debug` 명령을 통해 해당 노드에서 인터랙티브한 쉘을 생성할 수 있다.

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

노드에서 디버깅 세션을 생성할 때 유의해야 할 점은 다음과 같다.

* `kubectl debug`는 노드의 이름에 기반해 새로운 파드의 이름을
  자동으로 생성한다.
* 컨테이너는 호스트 네임스페이스(IPC, 네트워크, PID 네임스페이스)에서 동작한다.
* 노드의 루트 파일시스템은 `/host`에 마운트된다.

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod node-debugger-mynode-pdx84
```
