---
title: 노드
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스는 컨테이너를 파드내에 배치하고 _노드_ 에서 실행함으로 워크로드를 구동한다.
노드는 클러스터에 따라 가상 또는 물리적 머신일 수 있다. 각 노드는
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}에 의해 관리되며
{{< glossary_tooltip text="파드" term_id="pod" >}}를
실행하는 데 필요한 서비스를 포함한다.

일반적으로 클러스터에는 여러 개의 노드가 있으며, 학습 또는 리소스가 제한되는
환경에서는 하나만 있을 수도 있다.

노드의 [컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에는
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}},
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}
그리고 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}가 포함된다.

<!-- body -->

## 관리

{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}에 노드를 추가하는 두가지 주요 방법이 있다.

1. 노드의 kubelet으로 컨트롤 플레인에 자체 등록
2. 사용자(또는 다른 사용자)가 노드 오브젝트를 수동으로 추가

노드 오브젝트 또는 노드의 kubelet으로 자체 등록한 후
컨트롤 플레인은 새 노드 오브젝트가 유효한지 확인한다.
예를 들어 다음 JSON 매니페스트에서 노드를 만들려는 경우이다.

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

쿠버네티스는 내부적으로 노드 오브젝트를 생성한다(표시한다). 쿠버네티스는
kubelet이 노드의 `metadata.name` 필드와 일치하는 API 서버에 등록이 되어있는지 확인한다.
노드가 정상이면(예를 들어 필요한 모든 서비스가 실행중인 경우) 파드를 실행할 수 있게 된다.
그렇지 않으면, 해당 노드는 정상이 될 때까지 모든 클러스터 활동에
대해 무시된다.

{{< note >}}
쿠버네티스는 유효하지 않은 노드 오브젝트를 유지하고, 노드가
정상적인지 확인한다.

상태 확인을 중지하려면 사용자 또는 {{< glossary_tooltip term_id="controller" text="컨트롤러">}}에서
노드 오브젝트를 명시적으로 삭제해야 한다.
{{< /note >}}

노드 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

### 노드에 대한 자체-등록

kubelet 플래그 `--register-node`는 참(기본값)일 경우, kubelet 은 API 서버에
스스로 등록을 시도할 것이다. 이는 대부분의 배포판에 의해 이용되는, 선호하는 패턴이다.

자체-등록에 대해, kubelet은 다음 옵션과 함께 시작된다.

  - `--kubeconfig` - apiserver에 스스로 인증하기 위한 자격증명에 대한 경로.
  - `--cloud-provider` - 자신에 대한 메터데이터를 읽기 위해 어떻게 {{< glossary_tooltip text="클라우드 제공자" term_id="cloud-provider" >}}와 소통할지에 대한 방법.
  - `--register-node` - 자동으로 API 서버에 등록.
  - `--register-with-taints` - 주어진 {{< glossary_tooltip text="테인트(taint)" term_id="taint" >}} 리스트(콤마로 분리된 `<key>=<value>:<effect>`)를 가진 노드 등록.

    `register-node`가 거짓이면 동작 안 함.
  - `--node-ip` - 노드의 IP 주소.
  - `--node-labels` - 클러스터에 노드를 등록할 때 추가 할 {{< glossary_tooltip text="레이블" term_id="label" >}}([NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)에 의해 적용되는 레이블 제한 사항 참고).
  - `--node-status-update-frequency` - 얼마나 자주 kubelet이 마스터에 노드 상태를 게시할 지 정의.

[Node authorization mode](/docs/reference/access-authn-authz/node/)와
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)이 활성화 되면,
kubelets 은 자신의 노드 리소스를 생성/수정할 권한을 가진다.

#### 수동 노드 관리

{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}을
사용해서 노드 오브젝트를 생성하고 수정할 수 있다.

노드 오브젝트를 수동으로 생성하려면 kubelet 플래그를 `--register-node=false` 로 설정한다.

`--register-node` 설정과 관계 없이 노드 오브젝트를 수정할 수 있다.
예를 들어 기존 노드에 레이블을 설정하거나, 스케줄 불가로 표시할 수 있다.

파드의 노드 셀렉터와 함께 노드의 레이블을 사용해서 스케줄링을 제어할 수 있다.
예를 들어, 사용 가능한 노드의 하위 집합에서만 실행되도록
파드를 제한할 수 있다.

노드를 스케줄 불가로 표시하면 스케줄러가 해당 노드에 새 파드를 배치할 수 없지만,
노드에 있는 기존 파드에는 영향을 미치지 않는다.
이는 노드 재부팅 또는 기타 유지보수 준비 단계에서 유용하다.

노드를 스케줄 불가로 표시하려면 다음을 실행한다.

```shell
kubectl cordon $NODENAME
```

{{< note >}}
{{< glossary_tooltip term_id="daemonset" >}}에 포함되는 일부 파드는
스케줄 불가 노드에서 실행될 수 있다. 일반적으로 데몬셋은 워크로드 애플리케이션을
비우는 경우에도 노드에서 실행되어야 하는 노드 로컬 서비스를 제공한다.
{{< /note >}}

## 노드 상태

노드의 상태는 다음의 정보를 포함한다.

* [주소](#addresses)
* [컨디션](#condition)
* [용량과 할당가능](#capacity)
* [정보](#info)

`kubectl` 을 사용해서 노드 상태와 기타 세부 정보를 볼수 있다.

```shell
kubectl describe node <insert-node-name-here>
```

출력되는 각 섹션은 아래에 설명되어있다.

### 주소 {#addresses}

이 필드의 용법은 클라우드 제공사업자 또는 베어메탈 구성에 따라 다양하다.

* HostName: 노드의 커널에 의해 알려진 호스트명이다. `--hostname-override` 파라미터를 통해 치환될 수 있다.
* ExternalIP: 일반적으로 노드의 IP 주소는 외부로 라우트 가능 (클러스터 외부에서 이용 가능) 하다 .
* InternalIP: 일반적으로 노드의 IP 주소는 클러스터 내에서만 라우트 가능하다.


### 컨디션 {#condition}

`conditions` 필드는 모든 `Running` 노드의 상태를 기술한다. 컨디션의 예로 다음을 포함한다.

{{< table caption = "노드 컨디션과 각 컨디션이 적용되는 시기에 대한 설명들이다." >}}
| 노드 컨디션 | 설명 |
|----------------|-------------|
| `Ready`        | 노드가 상태 양호하며 파드를 수용할 준비가 되어 있는 경우 `True`, 노드의 상태가 불량하여 파드를 수용하지 못할 경우 `False`, 그리고 노드 컨트롤러가 마지막 `node-monitor-grace-period` (기본값 40 기간 동안 노드로부터 응답을 받지 못한 경우) `Unknown` |
| `DiskPressure`    | 디스크 사이즈 상에 압박이 있는 경우, 즉 디스크 용량이 넉넉치 않은 경우 `True`, 반대의 경우 `False` |
| `MemoryPressure`    | 노드 메모리 상에 압박이 있는 경우, 즉 노드 메모리가 넉넉치 않은 경우 `True`, 반대의 경우 `False` |
| `PIDPressure`    | 프로세스 상에 압박이 있는 경우, 즉 노드 상에 많은 프로세스들이 존재하는 경우 `True`, 반대의 경우 `False` |
| `NetworkUnavailable`    | 노드에 대해 네트워크가 올바르게 구성되지 않은 경우 `True`, 반대의 경우 `False` |
{{< /table >}}

{{< note >}}
커맨드 라인 도구를 사용해서 코드화된 노드의 세부 정보를 출력하는 경우 조건에는
`SchedulingDisabled` 이 포함된다. `SchedulingDisabled` 은 쿠버네티스 API의 조건이 아니며,
대신 코드화된 노드는 사양에 스케줄 불가로 표시된다.
{{< /note >}}

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

ready 컨디션의 상태가 `pod-eviction-timeout` ({{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}에 전달된 인수) 보다 더 길게 `Unknown` 또는 `False`로 유지되는 경우, 노드 상에 모든 파드는 노드 컨트롤러에 의해 삭제되도록 스케줄 된다. 기본 축출 타임아웃 기간은 **5분** 이다. 노드에 접근이 불가할 때와 같은 경우, apiserver는 노드 상의 kubelet과 통신이 불가하다. apiserver와의 통신이 재개될 때까지 파드 삭제에 대한 결정은 kubelet에 전해질 수 없다. 그 사이, 삭제되도록 스케줄 되어진 파드는 분할된 노드 상에서 계속 동작할 수도 있다.

노드 컨트롤러가 클러스터 내 동작 중지된 것을 확신할 때까지는 파드를
강제로 삭제하지 않는다. 파드가 `Terminating` 또는 `Unknown` 상태로 있을 때 접근 불가한 노드 상에서
동작되고 있는 것을 보게 될 수도 있다. 노드가 영구적으로 클러스터에서 삭제되었는지에
대한 여부를 쿠버네티스가 기반 인프라로부터 유추할 수 없는 경우, 노드가 클러스터를 영구적으로
탈퇴하게 되면, 클러스터 관리자는 손수 노드 오브젝트를 삭제해야 할 수도 있다.
쿠버네티스에서 노드 오브젝트를 삭제하면 노드 상에서 동작중인 모든 파드 오브젝트가
apiserver로부터 삭제되어 그 이름을 사용할 수 있는 결과를 낳는다.

노드 수명주기 컨트롤러는 자동으로 컨디션을 나타내는
[테인트(taints)](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)를 생성한다.
스케줄러는 파드를 노드에 할당 할 때 노드의 테인트를 고려한다.
또한 파드는 노드의 테인트를 극복(tolerate)할 수 있는 톨러레이션(toleration)을 가질 수 있다.

자세한 내용은
[컨디션별 노드 테인트하기](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/#컨디션별-노드-테인트하기)를 참조한다.

### 용량과 할당가능 {#capacity}

노드 상에 사용 가능한 리소스를 나타낸다. 리소스에는 CPU, 메모리 그리고
노드 상으로 스케줄 되어질 수 있는 최대 파드 수가 있다.

용량 블록의 필드는 노드에 있는 리소스의 총량을 나타낸다.
할당가능 블록은 일반 파드에서 사용할 수 있는
노드의 리소스 양을 나타낸다.

노드에서
[컴퓨팅 리소스 예약](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)하는 방법을
배우는 동안 용량 및 할당가능 리소스에 대해 자세히 읽어보자.

### 정보

커널 버전, 쿠버네티스 버전 (kubelet과 kube-proxy 버전), (사용하는 경우) Docker 버전, OS 이름과 같은노드에 대한 일반적인 정보를 보여준다.
이 정보는 Kubelet에 의해 노드로부터 수집된다.

### 노드 컨트롤러

노드 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는
노드의 다양한 측면을 관리하는 쿠버네티스 컨트롤 플레인 컴포넌트이다.

노드 컨트롤러는 노드가 생성되어 유지되는 동안 다양한 역할을 한다. 첫째는 등록 시점에
(CIDR 할당이 사용토록 설정된 경우) 노드에 CIDR 블럭을 할당하는 것이다.

두 번째는 노드 컨트롤러의 내부 노드 리스트를 클라우드 제공사업자의
사용 가능한 머신 리스트 정보를 근거로 최신상태로 유지하는 것이다. 클라우드 환경에서
동작 중일 경우, 노드상태가 불량할 때마다, 노드 컨트롤러는
해당 노드용 VM이 여전히 사용 가능한지에 대해 클라우드 제공사업자에게 묻는다. 사용 가능하지 않을 경우,
노드 컨트롤러는 노드 리스트로부터 그 노드를 삭제한다.

세 번째는 노드의 동작 상태를 모니터링 하는 것이다. 노드 컨트롤러는
다음을 담당한다.
- 노드 다운과 같은 어떤 이유로 노드 컨트롤러가
  하트비트 수신이 중단되는 경우 NodeStatus의 NodeReady
  컨디션을 ConditionUnknown으로 업데이트 한다.
- 노드가 계속 접근 불가할 경우 나중에 노드로부터 정상적인 종료를 이용해서 모든 파드를 축출 한다.
  ConditionUnknown을 알리기 시작하는 기본 타임아웃 값은 40초 이고,
  파드를 축출하기 시작하는 값은 5분이다.
노드 컨트롤러는 매 `--node-monitor-period` 초 마다 각 노드의 상태를 체크한다.

#### 하트비트

쿠버네티스 노드에서 보내는 하트비트는 노드의 가용성을 결정하는데 도움이 된다.

하트비트의 두 가지 형태는 `NodeStatus` 와
[리스(Lease) 오브젝트](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lease-v1-coordination-k8s-io)이다.
각 노드에는 `kube-node-lease` 라는
{{< glossary_tooltip term_id="namespace" text="네임스페이스">}} 에 관련된 리스 오브젝트가 있다.
리스는 경량 리소스로, 클러스터가 확장될 때
노드의 하트비트 성능을 향상 시킨다.

kubelet은 `NodeStatus` 와 리스 오브젝트를 생성하고 업데이트 할
의무가 있다.

- kubelet은 상태가 변경되거나 구성된 상태에 대한 업데이트가 없는 경우,
  `NodeStatus` 를 업데이트 한다. `NodeStatus` 의 기본 업데이트
  주기는 5분으로, 연결할 수 없는 노드의 시간 제한인 40초
  보다 훨씬 길다.
- kubelet은 10초마다 리스 오브젝트를 생성하고 업데이트 한다(기본 업데이트 주기).
  리스 업데이트는 `NodeStatus` 업데이트와는
  독립적으로 발생한다. 리스 업데이트가 실패하면 kubelet에 의해 재시도하며
  7초로 제한된 지수 백오프를 200 밀리초에서 부터 시작한다.

#### 안정성

 대부분의 경우, 노드 컨트롤러는 초당 `--node-eviction-rate`(기본값 0.1)로
축출 비율을 제한한다. 이 말은 10초당 1개의 노드를 초과하여
파드 축출을 하지 않는다는 의미가 된다.

노드 축출 행위는 주어진 가용성 영역 내 하나의 노드가 상태가 불량할
경우 변화한다. 노드 컨트롤러는 영역 내 동시에 상태가 불량한 노드의 퍼센티지가 얼마나 되는지
체크한다(NodeReady 컨디션은 ConditionUnknown 또는
ConditionFalse 다.).
- 상태가 불량한 노드의 일부가 최소 `--unhealthy-zone-threshold`
  (기본값 0.55)가 되면 축출 비율은 감소한다.
- 클러스터가 작으면 (즉 `--large-cluster-size-threshold`
  노드 이하면 - 기본값 50) 축출은 중지되고, 그렇지 않으면 축출 비율은 초당
  `--secondary-node-eviction-rate`(기본값 0.01)로 감소된다.
이 정책들이 가용성 영역 단위로 실행되어지는 이유는 나머지가 연결되어 있는 동안
하나의 가용성 영역이 마스터로부터 분할되어 질 수도 있기 때문이다.
만약 클러스터가 여러 클라우드 제공사업자의 가용성 영역에 걸쳐 있지 않으면,
오직 하나의 가용성 영역만 (전체 클러스터) 존재하게 된다.

노드가 가용성 영역들에 걸쳐 퍼져 있는 주된 이유는 하나의 전체 영역이
장애가 발생할 경우 워크로드가 상태 양호한 영역으로 이전되어질 수 있도록 하기 위해서이다.
그러므로, 하나의 영역 내 모든 노드들이 상태가 불량하면 노드 컨트롤러는
`--node-eviction-rate` 의 정상 비율로 축출한다. 코너 케이스란 모든 영역이
완전히 상태불량 (즉 클러스터 내 양호한 노드가 없는 경우) 한 경우이다.
이러한 경우, 노드 컨트롤러는 마스터 연결에 문제가 있어 일부 연결이
복원될 때까지 모든 축출을 중지하는 것으로 여긴다.

또한, 노드 컨트롤러는 파드가 테인트를 허용하지 않을 때 `NoExecute` 테인트 상태의
노드에서 동작하는 파드에 대한 축출 책임을 가지고 있다.
추가로, 노드 컨틀로러는 연결할 수 없거나, 준비되지 않은 노드와 같은 노드 문제에 상응하는
{{< glossary_tooltip text="테인트" term_id="taint" >}}를 추가한다.
이는 스케줄러가 비정상적인 노드에 파드를 배치하지 않게 된다.


{{< caution >}}
`kubectl cordon` 은 노드를 'unschedulable'로 표기하는데, 이는
서비스 컨트롤러가 이전에 자격 있는 로드밸런서 노드 대상 목록에서 해당 노드를 제거하기에
사실상 cordon 된 노드에서 들어오는 로드 밸런서 트래픽을 제거하는 부작용을 갖는다.
{{< /caution >}}

### 노드 용량

노드 오브젝트는 노드 리소스 용량에 대한 정보: 예를 들어, 사용 가능한 메모리의
양과 CPU의 수를 추적한다.
노드의 [자체 등록](#노드에-대한-자체-등록)은 등록하는 중에 용량을 보고한다.
[수동](#수동-노드-관리)으로 노드를 추가하는 경우 추가할 때
노드의 용량 정보를 설정해야 한다.

쿠버네티스 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}는
노드 상에 모든 노드에 대해 충분한 리소스가 존재하도록 보장한다. 스케줄러는 노드 상에
컨테이너에 대한 요청의 합이 노드 용량보다 더 크지 않도록 체크한다.
요청의 합은 kubelet에서 관리하는 모든 컨테이너를 포함하지만, 컨테이너 런타임에
의해 직접적으로 시작된 컨 테이너는 제외되고 kubelet의 컨트롤 범위
밖에서 실행되는 모든 프로세스도 제외된다.

{{< note >}}
파드 형태가 아닌 프로세스에 대해 명시적으로 리소스를 확보하려면,
[시스템 데몬에 사용할 리소스 예약하기](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)을 본다.
{{< /note >}}

## 노드 토폴로지

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

`TopologyManager`
[기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
활성화 시켜두면, kubelet이 리소스 할당 결정을 할 때 토폴로지 힌트를 사용할 수 있다.
자세한 내용은
[노드의 컨트롤 토폴로지 관리 정책](/docs/tasks/administer-cluster/topology-manager/)을 본다.

## 그레이스풀(Graceful) 노드 셧다운

{{< feature-state state="alpha" for_k8s_version="v1.20" >}}

`GracefulNodeShutdown` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화한 경우 kubelet은 노드 시스템 종료를 감지하고 노드에서 실행 중인 파드를 종료한다.
Kubelet은 노드가 종료되는 동안 파드가 일반 [파드 종료 프로세스](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)를 따르도록 한다.

`GracefulNodeShutdown` 기능 게이트가 활성화되면 kubelet은 [systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)를 사용하여 주어진 기간 동안 노드 종료를 지연시킨다. 종료 중에 kubelet은 두 단계로 파드를 종료시킨다.

1. 노드에서 실행 중인 일반 파드를 종료시킨다.
2. 노드에서 실행 중인 [중요(critical) 파드](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)를 종료시킨다.

그레이스풀 노드 셧다운 기능은 두 개의 [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) 옵션으로 구성된다.
* `ShutdownGracePeriod`:
  * 노드가 종료를 지연해야 하는 총 기간을 지정한다. 이것은 모든 일반 및 [중요 파드](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)의 파드 종료에 필요한 총 유예 기간에 해당한다.
* `ShutdownGracePeriodCriticalPods`:
  * 노드 종료 중에 [중요 파드](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)를 종료하는 데 사용되는 기간을 지정한다. 이는 `ShutdownGracePeriod`보다 작아야 한다.

예를 들어 `ShutdownGracePeriod=30s`, `ShutdownGracePeriodCriticalPods=10s` 인 경우 kubelet은 노드 종료를 30 초까지 지연시킨다. 종료하는 동안 처음 20(30-10) 초는 일반 파드의 유예 종료에 할당되고, 마지막 10 초는 [중요 파드](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)의 종료에 할당된다.


## {{% heading "whatsnext" %}}

* 노드를 구성하는 [컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에 대해 알아본다.
* [노드에 대한 API 정의](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)를 읽어본다.
* 아키텍처 디자인 문서의 [노드](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)
  섹션을 읽어본다.
* [테인트와 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을 읽어본다.
