---
# reviewers:
# - davidopp
title: 클러스터 트러블슈팅
description: 일반적인 클러스터 이슈를 디버깅한다.
weight: 20
no_list: true
---

<!-- overview -->

이 문서는 클러스터 트러블슈팅에 대해 설명한다. 사용자가 겪고 있는 문제의 근본 원인으로서 사용자의 애플리케이션을 
이미 배제했다고 가정한다.
애플리케이션 디버깅에 대한 팁은 [애플리케이션 트러블슈팅 가이드](/ko/docs/tasks/debug/debug-application/)를 참조한다.
자세한 내용은 [트러블슈팅 문서](/ko/docs/tasks/debug/)를 참조한다.

<!-- body -->

## 클러스터 나열하기

클러스터에서 가장 먼저 디버그해야 할 것은 노드가 모두 올바르게 등록되었는지 여부이다.

다음을 실행한다.

```shell
kubectl get nodes
```

그리고 보일 것으로 예상되는 모든 노드가 존재하고 모두 `Ready` 상태인지 확인한다.

클러스터의 전반적인 상태에 대한 자세한 정보를 얻으려면 다음을 실행할 수 있다.

```shell
kubectl cluster-info dump
```

### 예제: 다운(down) 상태이거나 통신이 닿지 않는(unreachable) 노드 디버깅하기

때때로 디버깅할 때 노드의 상태를 확인하는 것이 유용할 수 있다(예를 들어, 어떤 노드에서 실행되는 파드가 이상하게 행동하는 것을 발견했거나, 특정 노드에 파드가 스케줄링되지 않는 이유를 알아보기 위해). 파드의 경우와 마찬가지로, `kubectl describe node` 및 `kubectl get node -o yaml` 명령을 사용하여 노드에 대한 상세 정보를 볼 수 있다. 예를 들어, 노드가 다운 상태(네트워크 연결이 끊어졌거나, kubelet이 종료된 후 재시작되지 못했거나 등)라면 아래와 같은 출력이 나올 것이다. 노드가 NotReady 상태라는 것을 나타내는 이벤트(event)와, 더 이상 실행 중이 아닌 파드(NotReady 상태 이후 5분 뒤에 축출되었음)에 주목한다.

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status. AppArmor enabled
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```


## 로그 보기

현재로서는 클러스터를 더 깊이 파고들려면 관련 머신에서 로그 확인이 필요하다. 관련 로그 파일 
위치는 다음과 같다. (systemd 기반 시스템에서는 `journalctl`을 대신 사용해야 할 수도 있다.)

### 컨트롤 플레인 노드

   * `/var/log/kube-apiserver.log` - API 서버, API 제공을 담당
   * `/var/log/kube-scheduler.log` - 스케줄러, 스케줄 결정을 담당
   * `/var/log/kube-controller-manager.log` - 레플리케이션 컨트롤러를 담당하는 컨트롤러

### 워커 노드

   * `/var/log/kubelet.log` - Kubelet, 노드에서 컨테이너 실행을 담당
   * `/var/log/kube-proxy.log` - Kube Proxy, 서비스 로드밸런싱을 담당

## 클러스터 장애 모드

아래에 일부 오류 상황 예시 및 문제를 완화하기 위해 클러스터 설정을 조정하는 방법을 나열한다.

### 근본 원인

  - VM(들) 종료
  - 클러스터 내 또는 클러스터와 사용자 간의 네트워크 분할
  - 쿠버네티스 소프트웨어의 충돌
  - 데이터 손실 또는 퍼시스턴트 스토리지 사용 불가 (e.g. GCE PD 또는 AWS EBS 볼륨)
  - 운영자 오류, 예를 들면 잘못 구성된 쿠버네티스 소프트웨어 또는 애플리케이션 소프트웨어

### 특정 시나리오

  - API 서버 VM 종료 또는 API 서버 충돌
    - 다음의 현상을 유발함
      - 새로운 파드, 서비스, 레플리케이션 컨트롤러를 중지, 업데이트 또는 시작할 수 없다.
      -  쿠버네티스 API에 의존하지 않는 기존 파드 및 서비스는 계속 정상적으로 작동할 것이다.
  - API 서버 백업 스토리지 손실
    - 다음의 현상을 유발함
      - API 서버가 구동되지 않을 것이다.
      - kubelet에 도달할 수 없게 되지만, kubelet이 여전히 동일한 파드를 계속 실행하고 동일한 서비스 프록시를 제공할 것이다.
      - API 서버를 재시작하기 전에, 수동으로 복구하거나 API서버 상태를 재생성해야 한다.
  - 지원 서비스 (노드 컨트롤러, 레플리케이션 컨트롤러 매니저, 스케쥴러 등) VM 종료 또는 충돌
    - 현재 그것들은 API 서버와 같은 위치에 있기 때문에 API 서버와 비슷한 상황을 겪을 것이다.
    - 미래에는 이들도 복제본을 가질 것이며 API서버와 별도로 배치될 수도 있다.
    - 지원 서비스들은 상태(persistent state)를 자체적으로 유지하지는 않는다.
  - 개별 노드 (VM 또는 물리적 머신) 종료
    - 다음의 현상을 유발함
      - 해당 노드의 파드가 실행을 중지
  - 네트워크 분할
    - 다음의 현상을 유발함
      - 파티션 A는 파티션 B의 노드가 다운되었다고 생각한다. 파티션 B는 API 서버가 다운되었다고 생각한다. (마스터 VM이 파티션 A에 있다고 가정)
  - Kubelet 소프트웨어 오류
    - 다음의 현상을 유발함
      - 충돌한 kubelet은 노드에서 새 파드를 시작할 수 없다.
      - kubelet이 파드를 삭제할 수도 있고 삭제하지 않을 수도 있다.
      - 노드는 비정상으로 표시된다.
      - 레플리케이션 컨트롤러는 다른 곳에서 새 파드를 시작한다.
  - 클러스터 운영자 오류
    - 다음의 현상을 유발함
      - 파드, 서비스 등의 손실
      - API 서버 백업 저장소 분실
      - API를 읽을 수 없는 사용자
      - 기타

### 완화

- 조치: IaaS VM을 위한 IaaS 공급자의 자동 VM 다시 시작 기능을 사용한다.
  - 다음을 완화할 수 있음: API 서버 VM 종료 또는 API 서버 충돌
  - 다음을 완화할 수 있음: 지원 서비스 VM 종료 또는 충돌

- 조치: API 서버+etcd가 있는 VM에 IaaS 제공자의 안정적인 스토리지(예: GCE PD 또는 AWS EBS 볼륨)를 사용한다.
  - 다음을 완화할 수 있음: API 서버 백업 스토리지 손실

- 조치: [고가용성](/docs/setup/production-environment/tools/kubeadm/high-availability/) 구성을 사용한다.
  - 다음을 완화할 수 있음: 컨트롤 플레인 노드 종료 또는 컨트롤 플레인 구성 요소(스케줄러, API 서버, 컨트롤러 매니저) 충돌
    - 동시에 발생하는 하나 이상의 노드 또는 구성 요소 오류를 허용한다.
  - 다음을 완화할 수 있음: API 서버 백업 스토리지(i.e., etcd의 데이터 디렉터리) 손실
    - 고가용성 etcd 구성을 사용하고 있다고 가정

- 조치: API 서버 PD/EBS 볼륨의 주기적인 스냅샷
  - 다음을 완화할 수 있음: API 서버 백업 스토리지 손실
  - 다음을 완화할 수 있음: 일부 운영자 오류 사례
  - 다음을 완화할 수 있음: 일부 쿠버네티스 소프트웨어 오류 사례

- 조치: 파드 앞에 레플리케이션 컨트롤러와 서비스 사용
  - 다음을 완화할 수 있음: 노드 종료
  - 다음을 완화할 수 있음: Kubelet 소프트웨어 오류

- 조치: 예기치 않은 재시작을 허용하도록 설계된 애플리케이션(컨테이너)
  - 다음을 완화할 수 있음: 노드 종료
  - 다음을 완화할 수 있음: Kubelet 소프트웨어 오류


## {{% heading "whatsnext" %}}

* [리소스 메트릭 파이프라인](/ko/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)에서 사용할 수 있는 메트릭에 대해 알아 본다.
* [리소스 사용량 모니터링](/ko/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)을 위한 추가 도구에 대해 알아 본다.
* Node Problem Detector를 사용하여 [노드 헬스(health)를 모니터링](/ko/docs/tasks/debug/debug-cluster/monitor-node-health/)한다.
* `crictl`을 사용하여 [쿠버네티스 노드를 디버깅](/ko/docs/tasks/debug/debug-cluster/crictl/)한다.
* [쿠버네티스 감사(auditing)](/ko/docs/tasks/debug/debug-cluster/audit/)에 대한 더 자세한 정보를 본다.
* `telepresence`를 사용하여 [서비스를 로컬에서 개발 및 디버깅](/ko/docs/tasks/debug/debug-cluster/local-debugging/)한다.
