---
title: 노드
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

하나의 노드는 쿠버네티스에서 하나의 워커 머신으로, 이전에는 `미니언`으로 알려졌다. 노드는
클러스터에 따라, VM 또는 물리 머신이 될 수 있다. 각 노드는
[파드](/ko/docs/concepts/workloads/pods/pod/)를 동작시키기 위해 필요한 서비스를 포함하며 마스터 컴포넌트에 의해 관리된다. 노드 상의 서비스는 [컨테이너 런타임](/ko/docs/concepts/overview/components/#컨테이너-런타임), kubelet 그리고 kube-proxy를 포함한다. 보다
상세한 내용은 아키텍처 문서 내
[쿠버네티스 노드](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)
섹션을 확인한다.

{{% /capture %}}


{{% capture body %}}

## 노드 상태

노드의 상태는 다음의 정보를 포함한다.

* [주소](#addresses)
* [컨디션](#condition)
* [용량과 할당가능](#capacity)
* [정보](#info)

노드의 상태와 상세 정보는 다음 커맨드를 통해 확인할 수 있다. 
```shell
kubectl describe node <insert-node-name-here>
```
각 섹션은 아래 상세하게 기술되었다.

### 주소 {#addresses}

이 필드의 용법은 클라우드 제공사업자 또는 베어메탈 구성에 따라 다양하다.

* HostName: 노드의 커널에 의해 알려진 호스트명이다. `--hostname-override` 파라미터를 통해 치환될 수 있다.
* ExternalIP: 일반적으로 노드의 IP 주소는 외부로 라우트 가능 (클러스터 외부에서 이용 가능) 하다 .
* InternalIP: 일반적으로 노드의 IP 주소는 클러스터 내에서만 라우트 가능하다.


### 컨디션 {#condition}

`conditions` 필드는 모든 `Running` 노드의 상태를 기술한다. 컨디션의 예로 다음을 포함한다.

| Node Condition | Description |
|----------------|-------------|
| `Ready`        | 노드가 상태 양호하며 파드를 수용할 준비가 되어 있는 경우 `True`, 노드의 상태가 불량하여 파드를 수용하지 못할 경우 `False`, 그리고 노드 컨트롤러가 마지막 `node-monitor-grace-period` (기본값 40 기간 동안 노드로부터 응답을 받지 못한 경우) `Unknown` |
| `MemoryPressure`    | 노드 메모리 상에 압박이 있는 경우, 즉 노드 메모리가 넉넉치 않은 경우 `True`, 반대의 경우 `False` |
| `PIDPressure`    | 프로세스 상에 압박이 있는 경우, 즉 노드 상에 많은 프로세스들이 존재하는 경우 `True`, 반대의 경우 `False` |
| `DiskPressure`    | 디스크 사이즈 상에 압박이 있는 경우, 즉 디스크 용량이 넉넉치 않은 경우 `True`, 반대의 경우 `False` |
| `NetworkUnavailable`    | 노드에 대해 네트워크가 올바르게 구성되지 않은 경우 `True`, 반대의 경우 `False` |

노드 컨디션은 JSON 오브젝트로 표현된다. 예를 들어, 다음 응답은 상태 양호한 노드를 나타낸다.

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True",
    "reason": "KubeletReady",
    "message": "kubelet is posting ready status",
    "lastHeartbeatTime": "2019-06-05T18:38:35Z",
    "lastTransitionTime": "2019-06-05T11:41:27Z"
  }
]
```

ready 컨디션의 상태가 [kube-controller-manager](/docs/admin/kube-controller-manager/)에 인수로 넘겨지는 `pod-eviction-timeout` 보다 더 길게 `Unknown` 또는 `False`로 유지되는 경우, 노드 상에 모든 파드는 노드 컨트롤러에 의해 삭제되도록 스케줄 된다. 기본 축출 타임아웃 기간은 **5분** 이다. 노드에 접근이 불가할 때와 같은 경우, apiserver는 노드 상의 kubelet과 통신이 불가하다. apiserver와의 통신이 재개될 때까지 파드 삭제에 대한 결정은 kubelet에 전해질 수 없다. 그 사이, 삭제되도록 스케줄 되어진 파드는 분할된 노드 상에서 계속 동작할 수도 있다.

1.5 이전의 쿠버네티스 버전에서는, 노드 컨트롤러가 apiserver로부터 접근 불가한 이러한 파드를 [강제 삭제](/ko/docs/concepts/workloads/pods/pod/#파드-강제-삭제)
시킬 것이다. 그러나 1.5 이상에서는, 노드 컨트롤러가 클러스터 내 동작 중지된 것을 확신할 때까지는 파드를 
강제로 삭제하지 않는다. 파드가 `Terminating` 또는 `Unknown` 상태로 있을 때 접근 불가한 노드 상에서 
동작되고 있는 것을 보게 될 수도 있다. 노드가 영구적으로 클러스터에서 삭제되었는지에 대한 여부를 쿠버네티스가 기반 인프라로부터 유추할 수 없는 경우, 
노드가 클러스터를 영구적으로 탈퇴하게 되면, 클러스터 관리자는 손수 노드 오브젝트를 삭제해야 할 수도 있다. 쿠버네티스에서 노드 오브젝트를 삭제하면 
노드 상에서 동작중인 모든 파드 오브젝트가 apiserver로부터 삭제되어 그 이름을 사용할 수 있는 결과를 낳는다.

1.12 버전에서, `TaintNodesByCondition` 기능은 베타가 되어, 노드 수명주기 컨트롤러는 자동으로 컨디션을 나타내는
[taints](/docs/concepts/configuration/taint-and-toleration/)를 생성한다.
마찬가지로 스케줄러가 노드를 고려할 때, 노드의 컨디션을 무시한다. 
대신 노드의 taint와 toleration을 살펴본다.

현재 사용자는 이전 스케줄링 모델과 새롭고 더 유연한 스케줄링 모델 사이에 선택할 수 있다. 
아무런 toleration 도 가지지 않는 파드는 이전 모델에 따라 스케줄 되지만, 특정한 노드의 
taint 를 용인하는 파드는 노드 상에서 스케줄 될 수 있다.

{{< caution >}}
이 기능을 활성화 하면 조건이 관찰되고 taint가 생성되는 
시간 사이에 다소 지연이 발생한다. 이 지연은 보통 1초 미만이지만, 성공적으로 스케줄은 되나 kubelet에 의해 거부되는 파드의 수가 증가할 수 있다.
{{< /caution >}}

### 용량과 할당가능 {#capacity}

노드 상에 사용 가능한 리소스를 나타낸다. 리소스에는 CPU, 메모리 그리고 
노드 상으로 스케줄 되어질 수 있는 최대 파드 수가 있다.

용량 블록의 필드는 노드에 있는 리소스의 총량을 나타낸다.
할당가능 블록은 일반 파드에서 사용할 수 있는
노드의 리소스 양을 나타낸다.

노드에서
[컴퓨팅 리소스 예약](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)하는 방법을
배우는 동안 용량 및 할당가능 리소스에 대해 자세히 읽어보자.

### 정보 {#info}

커널 버전, 쿠버네티스 버전 (kubelet과 kube-proxy 버전), (사용하는 경우) Docker 버전, OS 이름과 같은노드에 대한 일반적인 정보를 보여준다.
이 정보는 Kubelet에 의해 노드로부터 수집된다.

## 관리

[파드](/ko/docs/concepts/workloads/pods/pod/)와 [서비스](/docs/concepts/services-networking/service/)와 달리,
노드는 본래 쿠버네티스에 의해 생성되지 않는다. 구글 컴퓨트 엔진과 같은 클라우드 제공사업자에 의해 
외부로부터 생성 되거나, 물리적 또는 가상 머신의 풀 내에서 존재한다. 
그래서 쿠버네티스가 노드를 생성할 때, 
노드를 나타내는 오브젝트를 생성한다. 
생성 이후, 쿠버네티스는 노드의 유효성 여부를 검사한다. 예를 들어, 
다음 내용으로 노드를 생성하려 한다면,

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

쿠버네티스는 내부적으로 (표현을) 노드 오브젝트를 생성하고,
`metadata.name` 필드를 근거로 상태 체크를 수행하여 노드의 유효성을 확인한다. 노드가 유효하면, 즉 
모든 필요한 서비스가 동작 중이면, 파드를 동작시킬 자격이 된다. 그렇지 않으면, 
유효하게 될때까지 어떠한 클러스터 활동에 대해서도 무시된다.

{{< note >}}
쿠버네티스는 유효하지 않은 노드로부터 오브젝트를 보호하고 유효한 상태로 이르는지 확인하기 위해 지속적으로 체크한다. 
이러한 프로세스를 중지시키기 위해는 명시적으로 노드 오브젝트를 삭제해야 한다.
{{< /note >}}

현재, 쿠버네티스 노드 인터페이스와 상호작용 하는 3개의 컴포넌트가 존재하는데, 
노드 컨트롤러, kubelet, 그리고 kubectl 이다.

### 노드 컨트롤러

노드 컨트롤러는 노드의 다양한 측면을 관리하는 쿠버네티스 
마스터 컴포넌트다.  

노드 컨트롤러는 노드가 생성되어 유지되는 동안 다양한 역할을 한다. 첫째는 등록 시점에
(CIDR 할당이 사용토록 설정된 경우) 노드에 CIDR 블럭을 할당하는 것이다.

두 번째는 노드 컨트롤러의 내부 노드 리스트를 클라우드 제공사업자의 
사용 가능한 머신 리스트 정보를 근거로 최신상태로 유지하는 것이다. 클라우드 환경에서 
동작 중일 경우, 노드상태가 불량할 때마다, 노드 컨트롤러는 
해당 노드용 VM이 여전히 사용 가능한지에 대해 클라우드 제공사업자에게 묻는다. 사용 가능하지 않을 경우, 
노드 컨트롤러는 노드 리스트로부터 그 노드를 삭제한다.

세 번째는 노드의 동작 상태를 모니터링 하는 것이다. 노드 컨트롤러는 
노드가 접근 불가할 경우 (즉 노드 컨트롤러가 어떠한 사유로 하트비트 
수신을 중지하는 경우, 예를 들어 노드 다운과 같은 경우이다.)
NodeStatus의 NodeReady 컨디션을 ConditionUnknown으로 업데이트 하는 책임을 지고, 
노드가 계속 접근 불가할 경우 나중에 노드로부터 (정상적인 종료를 이용하여) 모든 파드를 축출시킨다. 
(ConditionUnknown을 알리기 시작하는 기본 타임아웃 값은 40초 이고, 
파드를 축출하기 시작하는 값은 5분이다.) 노드 컨트롤러는
매 `--node-monitor-period` 초 마다 각 노드의 상태를 체크한다.

쿠버네티스 1.13 이전 버전에서, NodeStatus는 노드로부터의 하트비트가
된다. node lease 기능은 1.14 부터 기본값으로 활성화 되었으며, 베타 기능이다 
(기능 게이트 `NodeLease`, [KEP-0009](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/0009-node-heartbeat.md)). 
node lease 기능이 활성화 되면, 각 노드는 주기적으로 노드에 의해 
갱신되는 `kube-node-lease` 네임스페이스 내 연관된 `Lease` 오브젝트를 가지고 
NodeStatus와 node lease는 둘다 노드로부터의 하트비트로 취급된다. 
NodeStatus가 오직 일부 변경사항이 있거나 충분한 시간이 지난 경우에만 
(기본 1분으로, 접근 불가한 노드에 대한 기본 타임아웃 40초 보다 길다.) 
노드에서 마스터로 보고 되는 반면에, Node lease는 자주 갱신된다. 
노드 리스가 NodeStatus 보다 더 경량이므로, 이 기능은 확장성과
성능 두 가지 측면에서 노드 하트비트를 상당히 
경제적이도록 해준다.

쿠버네티스 1.4에서, 대량의 노드들이 마스터 접근에 
문제를 지닐 경우 (예를 들어 마스터에 네트워크 문제가 발생했기 때문에) 
더 개선된 문제 해결을 하도록 노드 컨트롤러의 로직을 업데이트 했다. 1.4를 시작으로, 
노드 컨트롤러는 파드 축출에 대한 결정을 내릴 경우 클러스터 
내 모든 노드를 살핀다.

대부분의 경우, 노드 컨트롤러는 초당 `--node-eviction-rate`(기본값 0.1)로 
축출 비율을 제한한다. 이 말은 10초당 1개의 노드를 초과하여 
파드 축출을 하지 않는다는 의미가 된다.

노드 축출 행위는 주어진 가용성 영역 내 하나의 노드가 상태가 불량할
경우 변화한다. 노드 컨트롤러는 영역 내 동시에 상태가 불량한 노드의 퍼센티지가 얼마나 되는지 
체크한다(NodeReady 컨디션은 ConditionUnknown 또는 ConditionFalse 다.). 
상태가 불량한 노드의 일부가 최소 
`--unhealthy-zone-threshold` 기본값 0.55) 가
되면 축출 비율은 감소한다. 클러스터가 작으면 (즉 
`--large-cluster-size-threshold` 노드 이하면 - 기본값 50) 축출은 중지되고, 
그렇지 않으면 축출 비율은 초당 
`--secondary-node-eviction-rate`(기본값 0.01)로 감소된다. 
이 정책들이 가용성 영역 단위로 실행되어지는 이유는 나머지가 연결되어 있는 동안 
하나의 가용성 영역이 마스터로부터 분할되어 질 수도 있기 때문이다. 
만약 클러스터가 여러 클라우드 제공사업자의 가용성 영역에 걸쳐 있지 않으면, 
오직 하나의 가용성 영역만 (전체 클러스터) 존재하게 된다.

노드가 가용성 영역들에 걸쳐 퍼져 있는 주된 이유는 하나의 전체 영역이 
장애가 발생할 경우 워크로드가 상태 양호한 영역으로 이전되어질 수 있도록 하기 위해서이다. 
그러므로, 하나의 영역 내 모든 노드들이 상태가 불량하면 노드 컨트롤러는 
정상 비율 `--node-eviction-rate`로 축출한다. 코너 케이스란 모든 영역이 
완전히 상태불량 (즉 클러스터 내 양호한 노드가 없는 경우) 한 경우이다. 
이러한 경우, 노드 컨트롤러는 마스터 연결에 문제가 있어 일부 연결이 
복원될 때까지 모든 축출을 중지하는 것으로 여긴다.

쿠버네티스 1.6을 시작으로 NodeController는 파드가 taint를 허용하지 않을 때, 
`NoExecute` taint 상태의 노드 상에 동작하는 파드 축출에 대한 책임 또한 
지고 있다. 추가로, 기본적으로 비활성화 된 알파 기능으로, NodeController는 노드 접근 불가 
또는 준비 부족과 같은 노드 문제에 상응하는 taint 추가에 대한 책임을 진다.  
`NoExecute` taints와 알파 기능에 대한 보다 상세한 
내용은 [이 문서](/docs/concepts/configuration/taint-and-toleration/)를 참고한다.

1.8 버전을 시작으로, 노드 컨트롤러는 노드 상태를 나타내는 taint 생성에 대한 책임을 지도록 
만들 수 있다. 이는 버전 1.8 의 알파 기능이다.

### 노드에 대한 자체-등록

kubelet 플래그 `--register-node`는 참(기본값)일 경우, kubelet 은 API 서버에 
스스로 등록을 시도할 것이다. 이는 대부분의 배포판에 의해 이용되는, 선호하는 패턴이다.

자체-등록에 대해, kubelet은 다음 옵션과 함께 시작된다.

  - `--kubeconfig` - apiserver에 스스로 인증하기 위한 자격증명에 대한 경로.
  - `--cloud-provider` - 자신에 대한 메터데이터를 읽기 위해 어떻게 클라우드 제공사업자와 소통할지에 대한 방법.
  - `--register-node` - 자동으로 API 서버에 등록.
  - `--register-with-taints` - 주어진 taint 리스트 (콤마로 분리된 `<key>=<value>:<effect>`)를 가진 노드 등록. `register-node`가 거짓이면 동작 안함.
  - `--node-ip` - 노드의 IP 주소.
  - `--node-labels` - 클러스터 내 노드를 등록할 경우 추가되는 레이블 (1.13+ 에서 [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)에 의해 강제되는 레이블 제약사항 참고).
  - `--node-status-update-frequency` - 얼마나 자주 kubelet이 마스터에 노드 상태를 게시할 지 정의.

[Node authorization mode](/docs/reference/access-authn-authz/node/)와
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)이 활성화 되면,
kubelets 은 자신의 노드 리소스를 생성/수정할 권한을 가진다.

#### 수동 노드 관리

클러스터 관리자는 노드 오브젝트를 생성하고 수정할 수 있다.

관리자가 수동으로 오브젝트를 생성하고자 한다면, kubelet 플래그를
`--register-node=false`로 설정한다.

관리자는 노드 리소스를 수정할 수 있다(`--register-node`설정과 무관하게).
수정은 노드 상에 레이블 설정과 스케줄 불가 마킹을 포함한다.

노드 상의 레이블은 스케줄링을 제어하기 위해,
즉 하나의 파드가 오직 노드의 서브셋 상에 동작할 수 있도록 제한하기 위해 노드 셀렉터와 함께 이용될 수 있다.

노드를 스케줄 불가로 마킹하게 되면, 해당 노드에 새로운 파드가 스케줄되는 것을 막아주지만,
노드 상의 임의의 기존 파드에 대해서는 영향을 미치치 않는다. 이는 노드 리부트 
전이나 기타 등의 준비 조치로 유용하다. 예를 들어, 노드를 스케줄 불가로 
마크하기 위해 다음 명령을 수행한다.

```shell
kubectl cordon $NODENAME
```

{{< note >}}
DaemonSet 컨트롤러에 의해 생성된 파드는 쿠버네티스 스케줄러를
우회하고 노드 상에 스케줄 불가 속성을 고려하지 않는다. 심지어 리부트를 준비하는 동안
애플리케이션을 유출시키는 중이라 할지라도 머신 상에 속한 데몬으로 여긴다.
{{< /note >}}

### 노드 용량

노드의 용량 (cpu 수와 메모리 양) 은 노드 오브젝트의 한 부분이다.
일반적으로, 노드는 스스로 등록하고 노드 오브젝트를 생성할 때 자신의 용량을 알린다. 만약
[수동 노드 관리](#수동-노드-관리)를 수행 한다면, 노드를 추가할 때 
노드 용량을 설정해야 한다.

쿠버네티스 스케줄러는 노드 상에 모든 노드에 대해 충분한 리소스가 존재하도록 보장한다.
노드 상에 컨테이너에 대한 요청의 합이 노드 용량보다 더 크지 않도록 체크한다.
kubelet에 의해 구동된 모든 컨테이너를 포함하지만, [컨테이너 런타임](/ko/docs/concepts/overview/components/#컨테이너-런타임)에 의해 직접 구동된 컨테이너 또는 컨테이너 외부에서 동작하는 임의의 프로세스는 해당되지 않는다.

파드 형태가 아닌 프로세스에 대해 명시적으로 리소스를 확보하려면,
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved) 튜토리얼을 따른다.

## 노드 토폴로지

{{< feature-state state="alpha" >}}

`TopologyManager` 
[기능 게이트(feature gate)](/docs/reference/command-line-tools-reference/feature-gates/)를
활성화 시켜두면, kubelet이 리소스 할당 결정을 할 때 토폴로지 힌트를 사용할 수 있다.

## API 오브젝트

노드는 쿠버네티스 REST API 내 탑-레벨 리소스 이다. API 오브젝트에 대한
보다 자세한 내용은 
[노드 API 오브젝트](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)에서 확인할 수 있다.

{{% /capture %}}
{{% capture whatsnext %}}
* [노드 컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에 대해 읽기
* 노드 수준 토폴로지에 대해 읽기: [노드의 토폴로지 정책 제어하기](/docs/tasks/administer-cluster/topology-manager/)
{{% /capture %}}
