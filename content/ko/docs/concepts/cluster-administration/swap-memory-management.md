---
title: 스왑 메모리(Swap memory) 관리
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스는 {{< glossary_tooltip text="노드" term_id="node" >}}에서 스왑 메모리를 사용하도록 설정할 수 있으며,
이를 통해 커널은 물리 메모리의 일부 페이지를 기반 스토리지(backing storage)로 스왑하여 물리 메모리를 확보할 수 있다.
이는 여러 가지 용도로 유용하다.
예를 들어, 많은 메모리를 할당하지만 특정 시점에 그중 일부만 사용하는
워크로드를 실행하는 노드는 스왑을 사용하면 이점을 얻을 수 있다.
또한 스왑 메모리는 메모리 압력이 급격하게 증가하는 상황에서 파드가 종료되는 것을 방지하는데 도움이 되며,
노드의 안정성을 저해할 수 있는 시스템 수준의 메모리 사용량 급증으로부터 노드를 보호하고,
노드에서 보다 유연한 메모리 관리를 가능하게 하는 등 다양한 이점을 제공한다.

클러스터 스왑 설정에 대한 자세한 내용은
[Kubernetes 노드에서 스왑 메모리 구성하기](/docs/tutorials/cluster-management/provision-swap-memory/)를 참고한다.

<!-- body -->

## 운영체제 지원

* 리눅스 노드는 스왑을 지원한다. 스왑을 활성화하려면 각 노드마다 설정을 해줘야 한다.
  기본 설정으로, kubelet은 스왑이 활성화되어 있는 리눅스 노드에서 시작되지 **않는다**.
* 윈도우 노드는 스왑 공간을 필요로 한다.
  기본 설정으로, kubelet은 스왑이 비활성화되어 있는 윈도우 노드에서 시작되지 **않는다**.

## 어떻게 작동하는가?

노드에서 스왑을 사용할 수 있는 방법은 여러 가지로 생각해볼 수 있다.
만약 kubelet이 이미 노드에서 실행 중이라면, 스왑을 할당한 뒤에는 kubelet을 다시 시작하여 인식할 수 있게 한다.

노드에 스왑이 프로비저닝되어 있고
`failSwapOn: false`로 설정되어 있다면, kubelet은 다음과 같이 동작한다.
- kubelet은 스왑이 활성화된 노드에서 시작할 수 있다.
- kubelet은 흔히 컨테이너 런타임(Container Runtime)이라고 불리는 Container Runtime Interface(CRI) 구현체에
기본적으로 Kubernetes 워크로드에 스왑 메모리를 할당하지 않도록 요청한다.

클러스터 관리자는 
[KubeletConfiguration의 `memorySwap`](/docs/reference/config-api/kubelet-config.v1)을 통해 노드의 스왑 설정을 관리할 수 있다.
클러스터 관리자는 
`memorySwap.swapBehavior`를 설정하여 스왑 메모리가 존재할 때 노드의 동작 방식을 지정할 수 있다.

### 스왑 동작 (Swap behaviors)

사용자는 사용할 [스왑 동작](/docs/reference/node/swap-behavior/)을
선택할 수 있다. 클러스터의 서로 다른 노드들은 서로 다른 스왑 동작을 사용할 수 있다.

리눅스 노드에서 사용할 수 있는 스왑 동작들은 다음과 같다.

`NoSwap` (기본값)
: 이 노드에서 파드로 실행되는 워크로드는 스왑을 사용하지 않으며, 사용할 수 없다.

`LimitedSwap`
: 쿠버네티스 워크로드는 스왑 메모리를 사용할 수 있다.

{{< note >}}
NoSwap 동작을 선택하고, kubelet이
스왑 공간(`failSwapOn: false`)을 허용하도록 설정하면, 워크로드는 스왑을 사용하지 않는다.

하지만, systemd 서비스(심지어 kubelet 자체도!)와 같은 쿠버네티스가 관리하는 컨테이너 외부의 프로세스는
스왑을 사용할 수 **있다**.
{{< /note >}}

클러스터에서 스왑을 활성화하는 방법은 [Kubernetes 노드에서 스왑 메모리 구성하기](/docs/tutorials/cluster-management/provision-swap-memory/)를 참고한다.

### 컨테이너 런타임 통합

kubelet은 컨테이너 런타임 API를 사용하여, 컨테이너에 원하는 스왑 설정이 적용되도록
컨테이너 런타임에 특정 설정(예를 들어 cgroup v2의 경우, `memory.swap.max`)을
적용하도록 요청한다. 컨트롤 그룹(cgroup)을 사용하는 런타임의 경우,
이러한 설정을 컨테이너 수준의 cgroup에 기록하는 것은 컨테이너 런타임의 역할이다.

## 스왑 사용량 모니터링

### 노드 및 컨테이너 수준의 메트릭 통계

이제 kubelet은 노드 및 컨테이너 수준의 메트릭 통계 정보를 수집하며,
이 정보는 kubelet의 HTTP 엔드포인트인 `/metrics/resource`(주로 Prometheus와 같은
모니터링 도구에서 사용)와 `/stats/summary`(주로 오토스케일러에서 사용)를 통해 접근할 수 있다.
이를 통해 kubelet에 직접 요청을 보낼 수 있는 사용자는
`LimitedSwap`을 사용할 때 스왑 사용량과 남은 스왑 메모리를 모니터링할 수 있다.
추가로, cadvisor에는 `machine_swap_bytes` 메트릭이 추가되어
머신의 전체적인 스왑 용량을 확인할 수 있다.
자세한 내용은 [이 페이지](/docs/reference/instrumentation/node-metrics/)를 참고한다.

예를 들어, `/metrics/resource`에서는 다음 메트릭을 지원한다.
- `node_swap_usage_bytes`: 노드에서 현재 사용 중인 스왑 메모리의 양을 바이트 단위로 표시.
- `container_swap_usage_bytes`: 컨테이너에서 현재 사용 중인 스왑 메모리의 양을 바이트 단위로 표시.
- `container_swap_limit_bytes`: 컨테이너의 현재 스왑 메모리 제한을 바이트 단위로 표시.

### `kubectl top --show-swap` 사용하기

메트릭을 조회하는 것은 유용하지만, 이러한 메트릭은
사람보다 소프트웨어에서 사용하도록 설계되었기 때문에 다소 번거로울 수 있다.
이러한 데이터를 보다 편리하게 사용할 수 있도록,
`kubectl top` 명령어는 `--show-swap` 플래그를 통해 스왑 메트릭을 지원한다.

노드의 스왑 사용량 정보를 확인하려면 `kubectl top nodes --show-swap` 명령어를 사용한다.
```shell
kubectl top nodes --show-swap
```

출력 결과는 다음과 같다.
```
NAME    CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   SWAP(bytes)    SWAP(%)       
node1   1m           10%      2Mi             10%         1Mi            0%   
node2   5m           10%      6Mi             10%         2Mi            0%   
node3   3m           10%      4Mi             10%         <unknown>      <unknown>   
```

파드의 스왑 사용량 정보를 확인하려면 `kubectl top pods --show-swap` 명령어를 사용한다.
```shell
kubectl top pod -n kube-system --show-swap
```

출력 결과는 다음과 같다.
```
NAME                                      CPU(cores)   MEMORY(bytes)   SWAP(bytes)
coredns-58d5bc5cdb-5nbk4                  2m           19Mi            0Mi
coredns-58d5bc5cdb-jsh26                  3m           37Mi            0Mi
etcd-node01                               51m          143Mi           5Mi
kube-apiserver-node01                     98m          824Mi           16Mi
kube-controller-manager-node01            20m          135Mi           9Mi
kube-proxy-ffgs2                          1m           24Mi            0Mi
kube-proxy-fhvwx                          1m           39Mi            0Mi
kube-scheduler-node01                     13m          69Mi            0Mi
metrics-server-8598789fdb-d2kcj           5m           26Mi            0Mi   
```

### 노드 상태에 스왑 용량 표시

노드의 스왑 용량을 확인할 수 있도록 새로운 노드 상태 필드인 `node.status.nodeInfo.swap.capacity`가 추가되었다.

예를 들어, 클러스터에 있는 노드의 스왑 용량을 확인하려면 다음 명령어를 사용한다.
```shell
kubectl get nodes -o go-template='{{range .items}}{{.metadata.name}}: {{if .status.nodeInfo.swap.capacity}}{{.status.nodeInfo.swap.capacity}}{{else}}<unknown>{{end}}{{"\n"}}{{end}}'
```

출력 결과는 다음과 같다.
```
node1: 21474836480
node2: 42949664768
node3: <unknown>
```

{{< note >}}

`<unknown>` 값은 해당 노드의 `.status.nodeInfo.swap.capacity` 필드가 설정되지 않았음을 의미한다.
이는 해당 노드에 스왑이 프로비저닝되지 않았다는 것을 의미할 수도 있고, 가능성은 낮지만
kubelet이 노드의 스왑 용량을 확인하지 못한 경우에도 나타날 수 있다.

{{< /note >}}

### Node Feature Discovery (NFD)를 사용한 스왑 확인 {#node-feature-discovery}

[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)
는 하드웨어 기능과 구성을 감지하는 Kubernetes 애드온이다.
스왑이 프로비저닝된 노드를 확인하는 데 사용할 수 있다.

예를 들어, 스왑이 프로비저닝된 노드를 확인하려면
다음 명령어를 사용한다.
```shell
kubectl get nodes -o jsonpath='{range .items[?(@.metadata.labels.feature\.node\.kubernetes\.io/memory-swap)]}{.metadata.name}{"\t"}{.metadata.labels.feature\.node\.kubernetes\.io/memory-swap}{"\n"}{end}'
```

출력 결과는 다음과 같다.
```
k8s-worker1: true
k8s-worker2: true
k8s-worker3: false
```

이 예시에서 `k8s-worker1`과 `k8s-worker2` 노드에 스왑이 프로비저닝되어 있지만, `k8s-worker3`에는 프로비저닝되지 않았다.

## 위험 요소 및 주의사항

{{< caution >}}

스왑 공간을 암호화하는 것을 강력히 권장한다.
자세한 내용은 [메모리 기반 볼륨(Memory-backed volumes)](#메모리-기반-볼륨)을 참고한다.

{{< /caution >}}

시스템에서 스왑을 사용할 수 있도록 설정하면 시스템의 예측 가능성이 낮아진다.
스왑은 더 많은 RAM을 사용할 수 있도록 하여 성능을 향상시킬 수 있지만, 데이터를
다시 메모리로 가져오는 작업은 부하가 큰 작업이고, 때로는 훨씬 더 느려질 수 있어
예상치 못한 성능 저하가 발생할 수 있다.
또한, 스왑은 메모리 부족 상황에서 시스템의 동작 방식에도 영향을 준다.
스왑을 활성화하면 노이지 네이버스(noisy neighbors)가 발생할 위험이 증가하여
RAM을 자주 사용하는 파드로 인해 다른 파드가 스왑을 사용하게 될 수 있다.
게다가, 스왑은 예측하기 어려운 Kubernetes 워크로드에 대해 더 많은 메모리 사용량을 허용하고,
파드가 예상하지 못한 방식으로 배치될 수 있기 때문에,
스케줄러는 스왑 메모리 사용량을 고려하지 않는다.
이로 인해 노이지 네이버스가 발생할 위험이 커진다.

스왑 메모리가 활성화된 노드의 성능은 물리적 스토리지 성능에 따라 달라진다.
스왑 메모리를 사용하는 경우 SSD나 NVMe와 같은
더 빠른 스토리지에 비해 클라우드 VM의
I/O 스로틀링과 같이 초당 I/O 작업 수인 IOPS(I/O operations per second)가
제한되는 환경에서 성능이 크게 저하될 수 있다.
스왑으로 인해 I/O 부하가 발생할 수 있으므로, 시스템에 중요한 데몬(daemons)에는
더 높은 I/O 지연 시간 우선순위를 부여하는 것이 좋다. 자세한 내용은
[모범 사례](#Kubernetes-클러스터에서-스왑-사용-시-모범-사례)를 참고한다.

### 메모리 기반 볼륨

리눅스 노드에서 메모리 기반 볼륨(`secret`
볼륨 마운트나 `medium: Memory`가 설정된 [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) 등)
은 `tmpfs` 파일 시스템으로 구현된다.
이러한 볼륨의 내용은 항상 메모리에 있어야 하므로,
디스크로 스왑되어서는 안 된다.
이러한 볼륨의 내용이 메모리에 계속 유지되도록, `noswap` tmpfs 옵션을
사용한다.

리눅스 커널은 버전 6.3부터 `noswap` 옵션을 공식적으로 지원한다. 자세한 내용은
[리눅스 커널 버전 요구사항](/docs/reference/node/kernel-version-requirements/#requirements-other)을 참고한다.
하지만 다양한 배포판들은 종종 이 마운트 옵션을 구형 리눅스 버전에도 백포트(backport)하여
적용하곤 한다.

노드가 `noswap` 옵션을 지원하는지 확인하기 위해 kubelet은 다음과 같은 작업을 수행한다.
* 커널 버전이 6.3 이상이면 `noswap` 옵션을 지원하는 것으로 간주한다.
* 그렇지 않은 경우, kubelet은 시작할 때 `noswap` 옵션을 사용하여 임시 tmpfs를 마운트하려고 시도한다.
  알 수 없는 옵션이라는 오류가 발생하면, `noswap` 옵션을
  지원하지 않는 것으로 간주하고 사용하지 않는다.
  이 경우 메모리 기반 볼륨이 디스크로 스왑될 수 있음을 사용자에게 알리는 kubelet 로그가 기록된다.
  마운트에 성공하면, 임시 tmpfs를 삭제하고 `noswap` 옵션을 사용한다.
  * `noswap` 옵션을 지원하지 않는 경우, kubelet은 경고 로그를 기록한 후,
    실행을 계속한다.

스왑 설정 예시는 [Kubernetes 노드에서 스왑 메모리 구성하기](/docs/tutorials/cluster-management/provision-swap-memory/)를 참고한다.
다만, 암호화된 스왑을 관리하는 것은 kubelet의 범위에 포함되지 않는다.
이는 일반적인 운영체제 설정에 해당하므로 운영체제 수준에서 처리해야 한다.
이러한 위험을 줄이기 위해 암호화된 스왑을 프로비저닝하는 것은 관리자의 책임이다.

### 축출

스왑이 활성화된 노드에서 메모리 축출 기준을 설정하는 것은 까다로울 수 있다.

스왑이 비활성화된 경우에는, kubelet의 축출 기준을
노드의 메모리 용량보다 조금 낮게 설정하는 것이 합리적이다.
이는 노드의 메모리가 모두 소진되어
OOM(Out Of Memory) Killer가 실행되기 전에, Kubernetes가 파드를 축출하기 위해서이며, OOM Killer는 Kubernetes를 인식하지 못하기 때문에
QoS, 파드 우선순위와 같은 Kubernetes의 특징을 고려하지 않는다.

스왑이 활성화된 경우, 상황은 더 복잡하다.
리눅스에서 `vm.min_free_kbytes` 매개변수가 커널이 메모리를 적극적으로 회수하기 시작하는
임계값을 정의하며, 여기에는 페이지를 스왑 아웃하는 작업도 포함된다.
kubelet의 축출 기준을 커널이 메모리 회수를 시작하기 전에
파드가 축출되도록 설정하면, 노드에 메모리 압박이 발생하더라도
워크로드가 스왑을 사용하지 못하는 상황이 발생할 수 있다.
반대로 축출 기준을 너무 높게 설정하면 노드의 메모리가 부족해져
OOM Killer가 실행될 수 있으며, 이 역시 바람직하지 않다.

이를 해결하기 위해, kubelet의 축출 기준을
`vm.min_free_kbytes` 값보다 조금 낮게 설정하는 것이 권장된다.
이렇게 하면 kubelet이 파드를 축출하기 전에 노드가 먼저 스왑을 사용하기 시작할 수 있으며,
워크로드가 사용하지 않는 데이터를 스왑 영역으로 내보내 파드가 축출되는 것을 방지할 수 있다.
반대로 축출 기준이 `vm.min_free_kbytes` 값보다 조금 낮기 때문에,
노드의 메모리가 모두 소진되기 전에 kubelet이 파드를 축출하기 시작하여 OOM Killer의 실행을 방지할 수 있다.

노드에서 다음 명령어를 실행하면 `vm.min_free_kbytes` 값을 확인할 수 있다.
```shell
cat /proc/sys/vm/min_free_kbytes
```

### 사용되지 않는 스왑 공간

`LimitedSwap` 동작에서 파드가 사용할 수 있는 스왑의 양이 자동으로 결정되며,
노드의 전체 메모리 대비 파드가 요청한 메모리의 비율을 기준으로 한다
(자세한 내용은 [아래 섹션](#LimitedSwap에서-스왑-한도는-어떻게-결정되는가)을 참고한다).

이러한 동작에서 일반적으로 스왑의 일부가 Kubernetes 워크로드에 대해
제한된 상태로 남게 된다.
예를 들어, Kubernetes {{< skew currentVersion >}}에서
Guaranteed {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}에 속하는 파드의 스왑 사용을 허용하지 않으므로,
Guaranteed 파드의 메모리 요청량에 비례하여 할당된 스왑의 일부는 Kubernetes 워크로드에서
사용되지 않은 채 남게 된다.

이러한 동작은 스왑을 사용할 수 없는 파드가 많은 상황에서 일부 위험을 초래할 수 있다.
반면, 시스템 데몬이나 kubelet 자체와 같이 Kubernetes의 관리 범위에 속하지 않는 프로세스가
사용할 수 있도록 일정량의 스왑 메모리를 남겨 두는 효과가 있다.

## Kubernetes 클러스터에서 스왑 사용 시 모범 사례

### 시스템에 중요한 데몬의 스왑 비활성화

테스트 과정과 사용자 피드백을 통해 시스템에 중요한 데몬과 서비스의 성능이
저하될 수 있음이 확인되었다.
이는 kubelet을 포함한 시스템 데몬이 평소보다 느리게 동작할 수 있음을 의미한다.
이러한 문제가 발생하는 경우, 스왑을 방지하기 위해 시스템 슬라이스(system slice)의 cgroup을
구성하는 것이 좋다(`memory.swap.max=0`으로 설정).

### I/O 지연 시간에서 시스템에 중요한 데몬 보호

스왑은 노드의 I/O 부하를 증가시킬 수 있다.
메모리 압박으로 인해 커널이 페이지를 빠르게 스왑 인하고 스왑 아웃하면,
I/O 작업에 의존하는 시스템에 중요한 데몬과 서비스의
성능이 저하될 수 있다.

이를 완화하기 위해 systemd를 사용하는 경우, I/O 지연 시간 측면에서 시스템 슬라이스의 우선순위를 높이는 것이 권장된다.
systemd를 사용하지 않는 경우에는,
시스템 데몬과 프로세스를 위한 별도의 cgroup을 구성하고, 동일한 방식으로 I/O 지연 시간에 대한 우선순위를 높이는 것이 권장된다.
이를 위해 시스템 슬라이스의 `io.latency`를 설정하여
더 높은 I/O 우선순위를 부여할 수 있다.
자세한 내용은 [cgroup의 문서](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst)를 참고한다.

### 스왑과 컨트롤 플레인 노드

Kubernetes 프로젝트에서 스왑 공간이 설정되지 않은 상태로 컨트롤 플레인 노드를 실행하는 것을 권장한다.
컨트롤 플레인에는 주로 Guaranteed QoS 파드가 실행되므로 일반적으로 스왑을 비활성화할 수 있다.
가장 큰 우려 사항은 컨트롤 플레인의 중요한 서비스가 스왑을 사용하게 되면 성능에 부정적인 영향을 줄 수 있다는 것이다.

### 스왑 전용 디스크 사용

Kubernetes 프로젝트에서 스왑이 활성화된 노드를 실행하는 경우 암호화된 스왑을 사용하는 것을 권장한다.
스왑이 파티션이나 루트 파일 시스템에 위치하면, 워크로드가
디스크에 데이터를 기록해야 하는 시스템 프로세스의 작업에 영향을 줄 수 있다.
스왑과 시스템 프로세스가 동일한 디스크를 공유하면, 특정 프로세스가 스왑을 과도하게 사용하여
kubelet, 컨테이너 런타임, systemd의 I/O 작업을 방해할 수 있으며, 이는 다른 워크로드에도 영향을 줄 수 있다.
스왑 공간은 디스크에 위치하기 때문에 사용 목적에 맞게 충분히 빠른 디스크인지 확인하는 것이 중요하다.
또는 하나의 백킹 장치(backing device)에 매핑된 서로 다른 영역 간에 I/O 우선순위를 설정할 수도 있다.

### 스왑을 고려한 스케줄링

Kubernetes {{< skew currentVersion >}}에서 스왑 메모리 사용량을 고려하여 파드를 노드에 배치하는 기능을
지원하지 않는다. 스케줄러는 일반적으로 인프라 리소스에 대한 _requests_를 사용하여
파드 배치를 결정하는데, 파드는 스왑 공간을 요청하지 않고 `memory`만 요청한다.
따라서 스케줄러는 파드의 스케줄링을 결정할 때 스왑 메모리를 고려하지 않는다.
이 기능은 현재 개발이 진행 중이지만 아직 구현되지 않았다.

관리자는 파드가 특별히 스왑을 사용하도록 의도된 경우가 아니라면
파드가 스왑 메모리가 있는 노드에 스케줄링되지 않도록,
이러한 문제를 방지하기 위해 해당 노드에 테인트(taint)를 설정할 수 있다.
테인트를 설정하면 스왑을 허용하는 워크로드가 부하가 발생했을 때 스왑이 없는 노드로 스케줄링되는 것을 방지할 수 있다.

### 최적의 성능을 위한 스토리지 선택

스왑 공간에 사용할 스토리지 장치는 메모리 사용량이 높을 때 시스템의 응답성을 유지하는 데
중요한 역할을 한다.
회전식 하드 디스크 드라이브(HDD)는 기계적인 특성으로 인해 지연 시간이 크게 발생하므로 이 용도에 적합하지 않으며,
이는 심각한 성능 저하와 시스템 스래싱(system thrashing)을 유발할 수 있다.
현재의 성능 요구 사항을 고려하면 SSD와 같은 장치를 스왑에 사용하는 것이 적절할 가능성이 높으며,
낮은 지연 시간의 전자식 접근 방식으로 성능 저하를 최소화할 수 있다.


## 스왑 동작 세부 사항

### LimitedSwap에서 스왑 한도는 어떻게 결정되는가?

스왑 메모리의 구성과 제한을 설정하는 것은 중요한
과제이다. 잘못 구성될 가능성이 있을 뿐만 아니라, 시스템 수준의 설정이기 때문에
잘못 구성할 경우 특정 워크로드뿐만 아니라 전체 노드에
영향을 줄 수 있다. 이러한 위험을 완화하고 노드의 안정성을 보장하기 위해
스왑 한도를 자동으로 구성하도록 구현되었다.

`LimitedSwap`을 사용하면  Burstable QoS에 해당하지 않는 파드
(`BestEffort` 또는 `Guaranteed` QoS 파드)는 스왑 메모리를 사용할 수 없다.
`BestEffort` QoS 파드는 메모리 사용량을 예측하기 어렵고
메모리 사용량에 대한 정보도 없기 때문에, 안전한 스왑 메모리 할당량을
정하기 어렵다.
반면, `Guaranteed` QoS 파드는 일반적으로 워크로드에 지정된 리소스를
정확하게 할당해야 하는 애플리케이션에 사용되며, 메모리는 즉시 사용할 수 있어야 한다.
따라서 앞서 언급한 보안과 노드 안정성을 보장하기 위해
`LimitedSwap`이 적용된 경우 이러한 파드는 스왑 메모리를 사용할 수 없다.
또한 파드가 사용하는 메모리가 항상 RAM에 존재하여 즉시 사용할 수 있도록 하기 위해
우선순위가 높은 파드도 스왑을 사용할 수 없다.

스왑 한도의 계산 방법을 설명하기 전에 다음 용어를 정의해야 한다.
* `nodeTotalMemory`: 노드에서 사용할 수 있는 전체 물리 메모리의 양.
* `totalPodsSwapAvailable`: 노드에서 파드가 사용할 수 있는 전체 스왑 메모리의 양(일부 스왑 메모리는 시스템에서 사용하도록 예약될 수 있다).
* `containerMemoryRequest`: 컨테이너의 메모리 요청량.

스왑 한도는 다음과 같이 설정된다.  
( `containerMemoryRequest` / `nodeTotalMemory` ) × `totalPodsSwapAvailable`

즉, 컨테이너가 사용할 수 있는 스왑의 양은 컨테이너의
메모리 요청량, 노드의 전체 물리 메모리, 그리고 파드가 사용할 수 있는
노드의 전체 스왑 메모리 양에 비례한다.

단, Burstable QoS 파드에 속한 컨테이너는
메모리 요청량과 메모리 제한량을 동일하게 설정하면 스왑을 사용하지 않도록 할 수 있다.
이렇게 설정된 컨테이너는 스왑 메모리를 사용할 수 없다.


## {{% heading "whatsnext" %}}

- 리눅스 노드에서 스왑을 관리하는 방법을 알아보려면
  [Kubernetes 노드에서 스왑 메모리 구성하기](/docs/tutorials/cluster-management/provision-swap-memory/).
- [Kubernetes와 스왑에 대한 블로그 게시물](/blog/2025/03/25/swap-linux-improvements/)을 참고한다.
- 배경 정보는 원본 KEP인 [KEP-2400](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2400-node-swap)과
해당 [설계 문서](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)를 참고한다.