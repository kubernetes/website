---
title: Kubectl로 쿠버네티스 노드 디버깅하기
content_type: task
min-kubernetes-server-version: 1.20
---

<!-- overview -->
이 페이지는 `kubectl debug` 명령을 사용하여 
쿠버네티스 클러스터에서 실행 중인 [노드](/ko/docs/concepts/architecture/nodes/)를 디버깅하는 방법을 설명한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

파드를 생성하고 이러한 새 파드를 임의의 노드에 할당할 수 있는 권한이 있어야 한다.
또한 호스트에서 파일시스템에 액세스하는 파드를 생성할 수 있는 권한이 있어야 한다.


<!-- steps -->

## `kubectl debug node`를 사용하여 노드를 디버깅하기

`kubectl debug node` 명령을 사용하여 트러블슈팅하려는 노드에 파드를 배포한다.
이 명령은 SSH 연결을 사용하여 노드에 액세스할 수 없는 시나리오에서 유용하다.
파드가 생성되면, 파드는 노드에서 대화형 셸을 연다.
"mynode"라는 이름의 노드에 대화형 셸을 생성하려면 다음을 실행한다.

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```console
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@mynode:/#
```

디버그 명령은 정보를 수집하고 문제를 해결하는 데 도움을 준다.
사용할 수 있는 명령으로는 `ip`, `ifconfig`, `nc`, `ping`, `ps` 등이 있다.
또한 각 패키지 관리자에서 `mtr`, `tcpdump`, `curl`과 같은 다른 도구를 설치할 수도 있다.

{{< note >}}

디버그 명령은 디버깅 파드가 사용하는 이미지에 따라 다를 수 있으며, 
이러한 명령은 설치해야 할 수도 있다.

{{< /note >}}

디버깅 파드는 파드의 `/host`에 마운트된 노드의 루트 파일 시스템에 접근할 수 있다.
파일 시스템 네임스페이스에서 kubelet을 실행하는 경우,
디버깅 파드는 전체 노드가 아닌 해당 네임스페이스의 루트를 본다. 일반적인 리눅스 노드의 경우, 
다음 경로에서 관련 로그를 찾을 수 있다.

`/host/var/log/kubelet.log`
: 노드에서 컨테이너를 실행하는 `kubelet`의 로그.

`/host/var/log/kube-proxy.log`
: 서비스 엔드포인트로 트래픽을 전달하는 역할을 하는 `kube-proxy`의 로그.

`/host/var/log/containerd.log`
: 노드에서 실행 중인 `containerd` 프로세스의 로그.

`/host/var/log/syslog`
: 시스템에 대한 일반 메시지 및 정보를 보여준다.

`/host/var/log/kern.log`
: 커널 로그를 보여준다.

노드에서 디버깅 세션을 생성할 때 유의해야 할 점은 다음과 같다.

* `kubectl debug`는 노드 이름을 기반으로 새 파드의 이름을
  자동으로 생성한다.
* 노드의 루트 파일시스템은 `/host`에 마운트될 것이다.
* 컨테이너가 호스트 IPC, 네트워크 및 PID 네임스페이스에서 실행되지만 파드에는
  권한이 없다. 즉, 해당 정보에 대한 액세스가 수퍼유저로 제한되어 있기 때문에
  일부 프로세스 정보를 읽지 못할 수 있다. 예를 들어, `chroot /host`는 실패한다.
  권한이 있는 파드가 필요한 경우, 수동으로 생성한다.

## {{% heading "cleanup" %}}

디버깅 파드 사용을 마치면, 삭제한다.

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```	

```shell
# 파드 이름을 적절하게 변경한다.
kubectl delete pod node-debugger-mynode-pdx84 --now
```	

```none
pod "node-debugger-mynode-pdx84" deleted
```

{{< note >}}

노드가 다운된 경우 (네트워크에서 연결이 끊어지거나, kubelet이 죽고 다시 시작되지 않는 등)
`kubectl debug node` 명령이 작동하지 않는다.
이 경우 [다운(down) 상태이거나 통신이 닿지 않는(unreachable) 노드 디버깅하기](/ko/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)를 
확인한다.

{{< /note >}}