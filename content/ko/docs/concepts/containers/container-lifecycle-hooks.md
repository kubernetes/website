---
# reviewers:
# - mikedanese
# - thockin
title: 컨테이너 라이프사이클 훅
content_type: concept
weight: 40
---

<!-- overview -->

이 페이지는 kubelet이 관리하는 컨테이너가 컨테이너 라이프사이클 훅 프레임워크를 사용하여
관리 라이프사이클 동안 발생하는 이벤트에 의해 트리거된 코드를 실행하는 방법을 설명한다.

<!-- body -->

## 개요

Angular와 같이 컴포넌트 라이프사이클 훅을 제공하는 여러 프로그래밍 언어 프레임워크와 유사하게,
쿠버네티스는 컨테이너에 라이프사이클 훅을 제공한다.
이 훅은 컨테이너가 관리 라이프사이클의 이벤트를 인지하고
해당 라이프사이클 훅이 실행될 때 핸들러에 구현된 코드를 실행할 수 있게 한다.

## 컨테이너 훅

컨테이너에 노출되는 훅은 두 가지가 있다.

`PostStart`

이 훅은 컨테이너가 생성된 직후에 실행된다.
컨테이너의 `ENTRYPOINT`(메인 프로세스)와 **동시에** 실행되며,
이는 훅이 메인 프로세스가 시작되기 전, 도중, 또는 후에 실행될 수 있음을 의미한다.

핸들러에 전달되는 파라미터는 없다.

{{< note >}}
훅은 컨테이너 프로세스와 동시에 실행되지만,
컨테이너 상태 업데이트를 지연시킬 수 있다.
컨테이너는 훅이 완료될 때까지 `Running`으로 전환되지 않을 수 있다.
{{< /note >}}

`PreStop`

이 훅은 API 요청이나 활성/시작 프로브 실패, 선점, 리소스 경합 등과 같은
관리 이벤트로 인해 컨테이너가 종료되기 직전에 호출된다. 컨테이너가 이미
terminated 또는 completed 상태인 경우에는 `PreStop` 훅 호출이 실패하며,
컨테이너를 중지하기 위한 TERM 신호가 전송되기 전에 훅이 완료되어야 한다. 파드의 종료
유예 기간(termination grace period) 카운트다운은 `PreStop` 훅이 실행되기 전에 시작되므로,
핸들러의 결과에 상관없이 컨테이너는 결국 파드의 종료 유예 기간 내에 종료된다.
핸들러에 전달되는 파라미터는 없다.

종료 동작에 대한 더 자세한 설명은
[파드의 종료](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)에서 확인할 수 있다.

`StopSignal`

StopSignal 라이프사이클은 컨테이너가 중지될 때 컨테이너로 전송될 중지 신호를 정의하는 데 사용할 수 있다.
이를 설정하면 컨테이너 이미지에 정의된 `STOPSIGNAL` 지시를 재정의한다.

커스텀 중지 신호를 사용한 종료 동작에 대한 더 자세한 설명은
[중지 신호](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-stop-signals)에서 확인할 수 있다.

### 훅 핸들러 구현

컨테이너는 해당 훅에 대한 핸들러를 구현하고 등록하여 훅에 접근할 수 있다.
컨테이너에 구현할 수 있는 훅 핸들러는 세 가지 유형이 있다.

* Exec - 컨테이너의 cgroups 및 네임스페이스 내에서 `pre-stop.sh`와 같은 특정 명령을 실행한다.
명령이 소비하는 리소스는 컨테이너에 대해 계산된다.
* HTTP - 컨테이너의 특정 엔드포인트에 대해 HTTP 요청을 실행한다.
* Sleep - 지정된 기간 동안 컨테이너를 일시 중지한다.

### 훅 핸들러 실행

컨테이너 라이프사이클 관리 훅이 호출되면
쿠버네티스 관리 시스템은 훅 동작에 따라 핸들러를 실행한다.
`httpGet`, `tcpSocket` ([사용 중단됨(deprecated)](/docs/reference/generated/kubernetes-api/v1.35/#lifecyclehandler-v1-core))
및 `sleep`은 kubelet 프로세스에 의해 실행되고, `exec`은 컨테이너에서 실행된다.

`PostStart` 훅 핸들러 호출은 컨테이너가 생성될 때 시작되며,
이는 컨테이너의 ENTRYPOINT와 `PostStart` 훅이 동시에 트리거됨을 의미한다.
(이는 일반적으로 `PostStart`에 HTTP 훅을 사용하는 것이 의미가 없음을 의미하는데,
훅이 실행될 때 컨테이너의 프로세스가 완전히 시작되었을 것이라는
보장이 없기 때문이다.)
`PostStart` 훅이 실행되는 데 너무 오래 걸리거나 중단되는 경우,
컨테이너가 `running` 상태로 전환되는 것을 방지할 수 있다.

`PreStop` 훅은 컨테이너 중지 신호와 비동기적으로 실행되지 않는다. 훅은
TERM 신호를 보내기 전에 실행을 완료해야 한다. `PreStop` 훅이 실행 중에 중단되면,
파드의 단계는 `Terminating`이 되고 `terminationGracePeriodSeconds`가
만료된 후 파드가 종료될 때까지 유지된다. 이 유예 기간은 `PreStop` 훅이
실행되고 컨테이너가 정상적으로 중지되는 데 걸리는 전체 시간에 적용된다. 예를 들어,
`terminationGracePeriodSeconds`가 60이고, 훅이 완료되는 데 55초가 걸리며 컨테이너가
신호를 받은 후 정상적으로 중지되는 데 10초가 걸린다면, `terminationGracePeriodSeconds`가
이 두 가지가 발생하는 데 걸리는 전체 시간(55+10)보다 작기 때문에
컨테이너는 정상적으로 중지되기 전에 종료된다.

`PostStart` 또는 `PreStop` 훅 중 하나라도 실패하면,
컨테이너가 종료된다.

사용자는 훅 핸들러를 가능한 한 가볍게 만들어야 한다.
그러나 컨테이너가 중지하기 전에 상태를 저장하는 경우와 같이,
장시간 실행되는 명령이 적절한 경우도 있다.

### 훅 전달 보장

훅 전달은 *최소 한 번*이 되도록 의도되었으며,
이는 `PostStart` 또는 `PreStop`과 같은 특정 이벤트에 대해
훅이 여러 번 호출될 수 있음을 의미한다.
이를 올바르게 처리하는 것은 훅 구현에 달려 있다.

일반적으로 한 번만 전달된다.
예를 들어, HTTP 훅 수신기가 다운되어 트래픽을 처리할 수 없는 경우
재전송을 시도하지 않는다.
그러나 일부 드문 경우에는 두 번 전달될 수 있다.
예를 들어, 훅을 전송하는 도중에 kubelet이 재시작된다면,
Kubelet이 다시 실행된 후에 훅이 재전송될 수 있다.

### 훅 핸들러 디버깅

훅 핸들러의 로그는 파드 이벤트에 노출되지 않는다.
핸들러가 어떠한 이유로 실패하면 이벤트를 브로드캐스트한다.
`PostStart`의 경우 `FailedPostStartHook` 이벤트이며,
`PreStop`의 경우 `FailedPreStopHook` 이벤트이다.
`FailedPostStartHook` 실패 이벤트를 직접 생성하려면,
[lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml)
파일을 수정하여 postStart 명령을 "badcommand"로 변경하고 적용한다.
다음은 `kubectl describe pod lifecycle-demo`를 실행하여 확인할 수 있는 결과 이벤트 출력 예시이다.

```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```



## {{% heading "whatsnext" %}}


* [컨테이너 환경](/docs/concepts/containers/container-environment/)에 대해 자세히 알아본다.
* [컨테이너 라이프사이클 이벤트에 핸들러 연결](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)을
직접 실습해 본다.