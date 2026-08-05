---
# reviewers:
# - bprashanth
# - enisoc
# - erictune
# - foxish
# - janetkuo
# - kow3ns
# - smarterclayton
title: 초기화 컨테이너(Init Containers) 디버그하기
content_type: task
weight: 40
---

<!-- overview -->

이 페이지는 초기화 컨테이너의 실행과 관련된 문제를
조사하는 방법에 대해 보여준다. 아래 예제의 커맨드 라인은 파드(Pod)를 `<pod-name>` 으로,
초기화 컨테이너를 `<init-container-1>` 과
`<init-container-2>` 로 표시한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 사용자는 [초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)의
  기본 사항에 익숙해야 한다.
* 사용자는 [초기화 컨테이너를 구성](/ko/docs/tasks/configure-pod-container/configure-pod-initialization/#초기화-컨테이너를-갖는-파드-생성)해야 한다.

<!-- steps -->

## 초기화 컨테이너의 상태 체크하기

사용자 파드의 상태를 표시한다.

```shell
kubectl get pod <pod-name>
```

예를 들어, `Init:1/2` 상태는 두 개의 초기화 컨테이너 중
하나가 성공적으로 완료되었음을 나타낸다.

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

상태값과 그 의미에 대한 추가 예제는
[파드 상태 이해하기](#파드의-상태-이해하기)를 참조한다.

## 초기화 컨테이너에 대한 상세 정보 조회하기

초기화 컨테이너의 실행에 대한 상세 정보를 확인한다.

```shell
kubectl describe pod <pod-name>
```

예를 들어, 2개의 초기화 컨테이너가 있는 파드는 다음과 같이 표시될 수 있다.

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

파드 스펙의 `status.initContainerStatuses` 필드를 읽어서
프로그래밍 방식으로 초기화 컨테이너의 상태를 조회할 수도 있다.


```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```


이 명령은 원시 JSON 방식으로 위와 동일한 정보를 반환한다.

## 초기화 컨테이너의 로그 조회하기

초기화 컨테이너의 로그를 확인하기 위해
파드의 이름과 초기화 컨테이너의 이름을 같이 전달한다.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

셸 스크립트를 실행하는 초기화 컨테이너는, 초기화 컨테이너가
실행될 때 명령어를 출력한다. 예를 들어, 스크립트의 시작 부분에
`set -x` 를 추가하고 실행하여 Bash에서 명령어를 출력할 수 있도록 수행할 수 있다.



<!-- discussion -->

## 파드의 상태 이해하기

`Init:` 으로 시작하는 파드 상태는 초기화 컨테이너의
실행 상태를 요약한다. 아래 표는 초기화 컨테이너를 디버깅하는
동안 사용자가 확인할 수 있는 몇 가지 상태값의 예이다.

상태 | 의미
------ | -------
`Init:N/M` | 파드가 `M` 개의 초기화 컨테이너를 갖고 있으며, 현재까지 `N` 개가 완료.
`Init:Error` | 초기화 컨테이너 실행 실패.
`Init:CrashLoopBackOff` | 초기화 컨테이너가 반복적으로 실행 실패.
`Pending` | 파드가 아직 초기화 컨테이너를 실행하지 않음.
`PodInitializing` or `Running` | 파드가 이미 초기화 컨테이너 실행을 완료.
