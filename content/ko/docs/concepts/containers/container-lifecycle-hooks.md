---
# reviewers:
# - mikedanese
# - thockin
title: 컨테이너 라이프사이클 훅(Hook)
content_type: concept
weight: 40
---

<!-- overview -->

이 페이지는 kubelet이 관리하는 컨테이너가 관리 라이프사이클 동안의 이벤트에 의해 발동되는 코드를 실행하기 위해서
컨테이너 라이프사이클 훅 프레임워크를 사용하는 방법에 대해서 설명한다.




<!-- body -->

## 개요

Angular와 같이, 컴포넌트 라이프사이클 훅을 가진 많은 프로그래밍 언어 프레임워크와 유사하게,
쿠버네티스도 컨테이너에 라이프사이클 훅을 제공한다.
훅은 컨테이너가 관리 라이프사이클의 이벤트를 인지하고 상응하는
라이프사이클 훅이 실행될 때 핸들러에 구현된 코드를 실행할 수 있게 한다.

## 컨테이너 훅

컨테이너에 노출되는 훅은 두 가지가 있다.

`PostStart`

이 훅은 컨테이너가 생성된 직후에 실행된다.
그러나, 훅이 컨테이너 엔트리포인트에 앞서서 실행된다는 보장은 없다.
파라미터는 핸들러에 전달되지 않는다.

`PreStop`

이 훅은 API 요청이나 활성 프로브(liveness probe) 실패, 선점, 자원 경합
등의 관리 이벤트로 인해 컨테이너가 종료되기 직전에 호출된다. 컨테이너가 이미
terminated 또는 completed 상태인 경우에는 `PreStop` 훅 요청이 실패하며,
훅은 컨테이너를 중지하기 위한 TERM 신호가 보내지기 이전에 완료되어야 한다. 파드의 그레이스 종료
기간(termination grace period)의 초읽기는 `PreStop` 훅이 실행되기 전에 시작되어,
핸들러의 결과에 상관없이 컨테이너가 파드의 그레이스 종료 기간 내에 결국 종료되도록 한다.
어떠한 파라미터도 핸들러에게 전달되지 않는다.

종료 동작에 더 자세한 대한 설명은
[파드의 종료](/ko/docs/concepts/workloads/pods/pod-lifecycle/#파드의-종료)에서 찾을 수 있다.

### 훅 핸들러 구현

컨테이너는 훅의 핸들러를 구현하고 등록함으로써 해당 훅에 접근할 수 있다.
구현될 수 있는 컨테이너의 훅 핸들러에는 두 가지 유형이 있다.

* Exec - 컨테이너의 cgroups와 네임스페이스 안에서, `pre-stop.sh`와 같은, 특정 커맨드를 실행.
커맨드에 의해 소비된 리소스는 해당 컨테이너에 대해 계산된다.
* HTTP - 컨테이너의 특정 엔드포인트에 대해서 HTTP 요청을 실행.

### 훅 핸들러 실행

컨테이너 라이프사이클 관리 훅이 호출되면,
쿠버네티스 관리 시스템은 훅 동작에 따라 핸들러를 실행하고,
`httpGet` 와 `tcpSocket` 은 kubelet 프로세스에 의해 실행되고, `exec` 은 컨테이너에서 실행된다.

훅 핸들러 호출은 해당 컨테이너를 포함하고 있는 파드의 컨텍스트와 동기적으로 동작한다.
이것은 `PostStart` 훅에 대해서,
훅이 컨테이너 엔트리포인트와는 비동기적으로 동작함을 의미한다.
그러나, 만약 해당 훅이 너무 오래 동작하거나 어딘가에 걸려 있다면,
컨테이너는 `running` 상태에 이르지 못한다.

`PreStop` 훅은 컨테이너 중지 신호에서 비동기적으로 실행되지 않는다. 훅은
TERM 신호를 보내기 전에 실행을 완료해야 한다. 실행 중에 `PreStop` 훅이 중단되면,
파드의 단계는 `Terminating` 이며 `terminationGracePeriodSeconds` 가
만료된 후 파드가 종료될 때까지 남아 있다. 이 유예 기간은 `PreStop` 훅이
실행되고 컨테이너가 정상적으로 중지되는 데 걸리는 총 시간에 적용된다. 예를 들어,
`terminationGracePeriodSeconds` 가 60이고, 훅이 완료되는 데 55초가 걸리고,
컨테이너가 신호를 수신한 후 정상적으로 중지하는 데 10초가 걸리면, `terminationGracePeriodSeconds` 이후
컨테이너가 정상적으로 중지되기 전에 종료된다. 이 두 가지 일이 발생하는 데
걸리는 총 시간(55+10)보다 적다.

만약 `PostStart` 또는 `PreStop` 훅이 실패하면,
그것은 컨테이너를 종료시킨다.

사용자는 훅 핸들러를 가능한 한 가볍게 만들어야 한다.
그러나, 컨테이너가 멈추기 전 상태를 저장하는 것과 같이,
오래 동작하는 커맨드가 의미 있는 경우도 있다.

### 훅 전달 보장

훅 전달은 *한 번 이상* 으로 의도되어 있는데,
이는 `PostStart` 또는 `PreStop`와 같은 특정 이벤트에 대해서,
훅이 여러 번 호출될 수 있다는 것을 의미한다.
이것을 올바르게 처리하는 것은 훅의 구현에 달려 있다.

일반적으로, 전달은 단 한 번만 이루어진다.
예를 들어, HTTP 훅 수신기가 다운되어 트래픽을 받을 수 없는 경우에도,
재전송을 시도하지 않는다.
그러나, 드문 경우로, 이중 전달이 발생할 수 있다.
예를 들어, 훅을 전송하는 도중에 kubelet이 재시작된다면,
Kubelet이 구동된 후에 해당 훅은 재전송될 것이다.

### 훅 핸들러 디버깅

훅 핸들러의 로그는 파드 이벤트로 노출되지 않는다.
만약 핸들러가 어떠한 이유로 실패하면, 핸들러는 이벤트를 방송한다.
`PostStart`의 경우 `FailedPostStartHook` 이벤트이며,
`PreStop`의 경우 `FailedPreStopHook` 이벤트이다.
실패한 `FailedPostStartHook` 이벤트를 직접 생성하려면, [lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml) 파일을 수정하여 postStart 명령을 "badcommand"로 변경하고 이를 적용한다.
다음은 `kubectl describe pod lifecycle-demo` 를 실행하여 볼 수 있는 이벤트 출력 예시이다.

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


* [컨테이너 환경](/ko/docs/concepts/containers/container-environment/)에 대해 더 배우기.
* [컨테이너 라이프사이클 이벤트에 핸들러 부착](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)
  실습 경험하기.
