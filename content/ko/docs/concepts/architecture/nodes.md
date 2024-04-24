---
# reviewers:
# - caesarxuchao
# - dchen1107
title: 노드
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스는 컨테이너를 파드내에 배치하고 _노드_ 에서 실행함으로 워크로드를 구동한다.
노드는 클러스터에 따라 가상 또는 물리적 머신일 수 있다. 각 노드는
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}에 
의해 관리되며
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

노드 {{< glossary_tooltip text="오브젝트" term_id="object" >}} 또는 노드의 kubelet으로 자체 등록한 후
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
kubelet이 노드의 `metadata.name` 필드와 일치하는 API 서버에 등록이 되어 있는지 확인한다.
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

### 노드 이름 고유성

[이름](/ko/docs/concepts/overview/working-with-objects/names#names)은 노드를 식별한다. 두 노드는
동시에 같은 이름을 가질 수 없다. 쿠버네티스는 또한 같은 이름의 리소스가
동일한 객체라고 가정한다. 노드의 경우, 동일한 이름을 사용하는 인스턴스가 동일한
상태(예: 네트워크 설정, 루트 디스크 내용)와 노드 레이블과 같은 동일한 속성(attribute)을
갖는다고 암시적으로 가정한다. 인스턴스가
이름을 변경하지 않고 수정된 경우 이로 인해 불일치가 발생할 수 있다. 노드를 대폭 교체하거나
업데이트해야 하는 경우, 기존 노드 오브젝트를 먼저 API 서버에서 제거하고
업데이트 후 다시 추가해야 한다.

### 노드에 대한 자체-등록(self-registration)

kubelet 플래그 `--register-node`가 참(기본값)일 경우, kubelet은 API 서버에
스스로 등록을 시도할 것이다. 이는 선호되는 패턴이며, 대부분의 배포판에서 사용된다.

자체-등록에 대해, kubelet은 다음 옵션과 함께 시작된다.

  - `--kubeconfig` - apiserver에 스스로 인증하기 위한 자격증명에 대한 경로.
  - `--cloud-provider` - 자신에 대한 메터데이터를 읽기 위해 어떻게 
    {{< glossary_tooltip text="클라우드 제공자" term_id="cloud-provider" >}}와 소통할지에 대한 방법.
  - `--register-node` - 자동으로 API 서버에 등록.
  - `--register-with-taints` - 주어진 {{< glossary_tooltip text="테인트(taint)" term_id="taint" >}} 
    리스트(콤마로 분리된 `<key>=<value>:<effect>`)를 가진 노드 등록.

    `register-node`가 거짓이면 동작 안 함.
  - `--node-ip` - 노드의 IP 주소.
  - `--node-labels` - 클러스터에 노드를 등록할 때 추가 할 
    {{< glossary_tooltip text="레이블" term_id="label" >}}
    ([NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)에 의해 적용되는 레이블 제한 사항 참고).
  - `--node-status-update-frequency` - 얼마나 자주 kubelet이 API 서버에 해당 노드 상태를 게시할 지 정의.

[Node authorization mode](/docs/reference/access-authn-authz/node/)와
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)이 활성화 되면,
각 kubelet은 자신이 속한 노드의 리소스에 대해서만 생성/수정할 권한을 가진다.

{{< note >}}
[노드 이름 고유성](#노드-이름-고유성) 섹션에서 언급했듯이,
노드 구성을 업데이트해야 하는 경우 API 서버에 노드를
다시 등록하는 것이 좋다. 예를 들어 kubelet이 `--node-labels`의 새로운 구성으로
다시 시작되더라도, 동일한 노드 이름이 사용된 경우
레이블이 해당 노드의 등록에 설정되기 때문에 변경 사항이 적용되지 않는다.

노드에 이미 스케줄된 파드는 해당 노드 구성이 kubelet 재시작에 의해 변경된 경우
오작동하거나 문제를 일으킬 수 있다. 예를 들어 이미 실행 중인 파드가 노드에
할당된 새 레이블에 대해 테인트(taint)될 수 있는 반면 해당 파드와 호환되지 않는 다른 파드는
새 레이블을 기반으로 스케줄링된다. 노드 재등록(re-registration)은 모든 파드를
비우고(drain) 다시 적절하게 스케줄링되도록
한다.
{{< /note >}}

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

보다 자세한 내용은 [안전하게 노드를 드레인(drain)하기](/docs/tasks/administer-cluster/safely-drain-node/)
를 참고한다.

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

출력되는 각 섹션은 아래에 설명되어 있다.

### 주소 {#addresses}

이 필드의 용법은 클라우드 제공사업자 또는 베어메탈 구성에 따라 다양하다.

* HostName: 노드의 커널에 의해 알려진 호스트명이다. 
  `--hostname-override` 파라미터를 통해 치환될 수 있다.
* ExternalIP: 일반적으로 노드의 IP 주소는 외부로 라우트 가능 
  (클러스터 외부에서 이용 가능) 하다 .
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
커맨드 라인 도구를 사용해서 통제된(cordoned) 노드의 세부 정보를 출력하는 경우 조건에는
`SchedulingDisabled` 이 포함된다. `SchedulingDisabled` 은 쿠버네티스 API의 조건이 아니며,
대신 통제된(cordoned) 노드는 사양에 스케줄 불가로 표시된다.
{{< /note >}}

쿠버네티스 API에서, 노드의 컨디션은 노드 리소스의 `.status` 부분에
표현된다. 예를 들어, 다음의 JSON 구조는 상태가 양호한 노드를 나타낸다.

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

ready 컨디션의 `status`가 `pod-eviction-timeout`
({{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager"
>}}에 전달된 인수)보다 더 길게 `Unknown` 또는 `False`로 유지되는 경우,
[노드 컨트롤러](#node-controller)가 해당 노드에 할당된 전체 파드에 대해
{{< glossary_tooltip text="API를 이용한 축출" term_id="api-eviction" >}}
을 트리거한다. 기본 축출 타임아웃 기간은 
**5분** 이다.
노드에 접근이 불가할 때와 같은 경우, API 서버는 노드 상의 kubelet과 통신이 불가하다.
API 서버와의 통신이 재개될 때까지 파드 삭제에 대한 결정은 kubelet에 전해질 수 없다.
그 사이, 삭제되도록 스케줄 되어진 파드는 분할된 노드 상에서 계속 동작할 수도 있다.

노드 컨트롤러가 클러스터 내 동작 중지된 것을 확신할 때까지는 파드를 강제로 삭제하지 않는다.
파드가 `Terminating` 또는 `Unknown` 상태로 있을 때 접근 불가한 노드 상에서
동작되고 있는 것을 보게 될 수도 있다. 노드가 영구적으로 클러스터에서 삭제되었는지에
대한 여부를 쿠버네티스가 기반 인프라로부터 유추할 수 없는 경우, 노드가 클러스터를 영구적으로
탈퇴하게 되면, 클러스터 관리자는 손수 노드 오브젝트를 삭제해야 할 수도 있다.
쿠버네티스에서 노드 오브젝트를 삭제하면
노드 상에서 동작 중인 모든 파드 오브젝트가 API 서버로부터 삭제되며
파드가 사용하던 이름을 다시 사용할 수 있게 된다.

노드에서 문제가 발생하면, 쿠버네티스 컨트롤 플레인은 자동으로 노드 상태에 영향을 주는 조건과 일치하는
[테인트(taints)](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)를
생성한다.
스케줄러는 파드를 노드에 할당할 때 노드의 테인트를 고려한다.
또한 파드는 노드에 특정 테인트가 있더라도 해당 노드에서 동작하도록 
{{< glossary_tooltip text="톨러레이션(toleration)" term_id="toleration" >}}을 가질 수 있다.

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

커널 버전, 쿠버네티스 버전 (kubelet과 kube-proxy 버전), 컨테이너
런타임 상세 정보 및 노드가 사용하는 운영 체제가 무엇인지와 같은
노드에 대한 일반적인 정보가 기술된다.
이 정보는 Kubelet이 노드에서 수집하여
쿠버네티스 API로 전송한다.

## 하트비트

쿠버네티스 노드가 보내는 하트비트는 클러스터가 개별 노드가 가용한지를
판단할 수 있도록 도움을 주고, 장애가 발견된 경우 조치를 할 수 있게한다.

노드에는 두 가지 형태의 하트비트가 있다.

* 노드의 `.status`에 대한 업데이트
* `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="네임스페이스">}}
  내의 [리스(Lease)](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
  오브젝트. 각 노드는 연관된 리스 오브젝트를 갖는다.

노드의 `.status`에 비하면, 리스는 경량의 리소스이다.
큰 규모의 클러스터에서는 리스를 하트비트에 사용하여 
업데이트로 인한 성능 영향을 줄일 수 있다.

kubelet은 노드의 `.status` 생성과 업데이트 및
관련된 리스의 업데이트를 담당한다. 

- kubelet은 상태가 변경되거나 설정된 인터벌보다 오래 업데이트가 없는 경우
  노드의 `.status`를 업데이트한다. 노드의 `.status` 업데이트에 대한 기본
  인터벌은 접근이 불가능한 노드에 대한 타임아웃인
  40초 보다 훨씬 긴 5분이다.
- kubelet은 리스 오브젝트를 (기본 업데이트 인터벌인) 매 10초마다
  생성하고 업데이트한다. 리스 업데이트는 노드의 `.status` 업데이트와는 독립적이다.
  만약 리스 업데이트가 실패하면, kubelet은 200밀리초에서 시작하고
  7초의 상한을 갖는 지수적 백오프를 사용해서 재시도한다.

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

세 번째는 노드의 동작 상태를 모니터링하는 것이다. 노드 컨트롤러는
다음을 담당한다.

- 노드가 접근 불가능(unreachable) 상태가 되는 경우, 
  노드의 `.status` 필드의 `Ready` 컨디션을 업데이트한다. 
  이 경우에는 노드 컨트롤러가 `Ready` 컨디션을 `Unknown`으로 설정한다.
- 노드가 계속 접근 불가능 상태로 남아있는 경우, 해당 노드의 모든 파드에 대해서
  [API를 이용한 축출](/ko/docs/concepts/scheduling-eviction/api-eviction/)을
  트리거한다. 기본적으로, 노드 컨트롤러는 노드를
  `Unknown`으로 마킹한 뒤 5분을 기다렸다가
  최초의 축출 요청을 시작한다. 

기본적으로, 노드 컨트롤러는 5 초마다 각 노드의 상태를 체크한다.
체크 주기는 `kube-controller-manager` 구성 요소의 
`--node-monitor-period` 플래그를 이용하여 설정할 수 있다.

#### 축출 빈도 제한

 대부분의 경우, 노드 컨트롤러는 초당 `--node-eviction-rate`(기본값 0.1)로
축출 속도를 제한한다. 이 말은 10초당 1개의 노드를 초과하여
파드 축출을 하지 않는다는 의미가 된다.

노드 축출 행위는 주어진 가용성 영역 내 하나의 노드가 상태가 불량할
경우 변화한다. 노드 컨트롤러는 영역 내 동시에 상태가 불량한 노드의 퍼센티지가 얼마나 되는지
체크한다(`Ready` 컨디션은 `Unknown` 또는
`False` 값을 가진다).

- 상태가 불량한 노드의 비율이 최소 `--unhealthy-zone-threshold`
  (기본값 0.55)가 되면 축출 속도가 감소한다.
- 클러스터가 작으면 (즉 `--large-cluster-size-threshold`
  노드 이하면 - 기본값 50) 축출이 중지된다.
- 이외의 경우, 축출 속도는 초당
  `--secondary-node-eviction-rate`(기본값 0.01)로 감소된다.

이 정책들이 가용성 영역 단위로 실행되어지는 이유는 나머지가 연결되어 있는 동안
하나의 가용성 영역이 컨트롤 플레인으로부터 분할되어 질 수도 있기 때문이다.
만약 클러스터가 여러 클라우드 제공사업자의 가용성 영역에 걸쳐 있지 않는 이상,
축출 매커니즘은 영역 별 가용성을 고려하지 않는다.

노드가 가용성 영역들에 걸쳐 퍼져 있는 주된 이유는 하나의 전체 영역이
장애가 발생할 경우 워크로드가 상태 양호한 영역으로 이전되어질 수 있도록 하기 위해서이다.
그러므로, 하나의 영역 내 모든 노드들이 상태가 불량하면 노드 컨트롤러는
`--node-eviction-rate` 의 정상 속도로 축출한다. 코너 케이스란 모든 영역이
완전히 상태불량(클러스터 내 양호한 노드가 없는 경우)한 경우이다.
이러한 경우, 노드 컨트롤러는 컨트롤 플레인과 노드 간 연결에 문제가
있는 것으로 간주하고 축출을 실행하지 않는다. (중단 이후 일부 노드가
다시 보이는 경우 노드 컨트롤러는 상태가 양호하지 않거나 접근이 불가능한
나머지 노드에서 파드를 축출한다.)

또한, 노드 컨트롤러는 파드가 테인트를 허용하지 않을 때 `NoExecute` 테인트 상태의
노드에서 동작하는 파드에 대한 축출 책임을 가지고 있다.
추가로, 노드 컨틀로러는 연결할 수 없거나, 준비되지 않은 노드와 같은 노드 문제에 상응하는
{{< glossary_tooltip text="테인트" term_id="taint" >}}를 추가한다.
이는 스케줄러가 비정상적인 노드에 파드를 배치하지 않게 된다.

## 리소스 용량 추적 {#node-capacity}

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

{{< feature-state state="beta" for_k8s_version="v1.18" >}}

`TopologyManager`
[기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
활성화 시켜두면, kubelet이 리소스 할당 결정을 할 때 토폴로지 힌트를 사용할 수 있다.
자세한 내용은
[노드의 컨트롤 토폴로지 관리 정책](/docs/tasks/administer-cluster/topology-manager/)을 본다.

## 그레이스풀(Graceful) 노드 셧다운(shutdown) {#graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.21" >}}

kubelet은 노드 시스템 셧다운을 감지하고 노드에서 실행 중인 파드를 종료하려고 시도한다.

Kubelet은 노드가 종료되는 동안 파드가 
일반 [파드 종료 프로세스](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)를 
따르도록 한다.

그레이스풀 노드 셧다운 기능은
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)를
사용하여 주어진 기간 동안 노드 종료를 지연시키므로 systemd에 의존한다.

그레이스풀 노드 셧다운은 1.21에서 기본적으로 활성화된 `GracefulNodeShutdown`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)로 
제어된다.

기본적으로, 아래 설명된 두 구성 옵션,
`shutdownGracePeriod` 및 `shutdownGracePeriodCriticalPods` 는 모두 0으로 설정되어 있으므로,
그레이스풀 노드 셧다운 기능이 활성화되지 않는다.
기능을 활성화하려면, 두 개의 kubelet 구성 설정을 적절하게 구성하고 
0이 아닌 값으로 설정해야 한다.

그레이스풀 셧다운 중에 kubelet은 다음의 두 단계로 파드를 종료한다.

1. 노드에서 실행 중인 일반 파드를 종료시킨다.
2. 노드에서 실행 중인 
  [중요(critical) 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)를 종료시킨다.

그레이스풀 노드 셧다운 기능은 
두 개의 [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) 옵션으로 구성된다.

* `shutdownGracePeriod`:
  * 노드가 종료를 지연해야 하는 총 기간을 지정한다. 
    이것은 모든 일반 및 [중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)의 
    파드 종료에 필요한 총 유예 기간에 해당한다.
* `shutdownGracePeriodCriticalPods`:
  * 노드 종료 중에 [중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)를 
    종료하는 데 사용되는 기간을 지정한다. 
    이 값은 `shutdownGracePeriod` 보다 작아야 한다.

예를 들어, `shutdownGracePeriod=30s`,
`shutdownGracePeriodCriticalPods=10s` 인 경우, kubelet은 노드 종료를 30초까지
지연시킨다. 종료하는 동안 처음 20(30-10)초는 일반 파드의
유예 종료에 할당되고, 마지막 10초는
[중요 파드](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#파드를-중요-critical-로-표시하기)의 종료에 할당된다.

{{< note >}}
그레이스풀 노드 셧다운 과정에서 축출된 파드는 셧다운(shutdown)된 것으로 표시된다.
`kubectl get pods` 명령을 실행하면 축출된 파드의 상태가 `Terminated`으로 표시된다.
그리고 `kubectl describe pod` 명령을 실행하면 노드 셧다운으로 인해 파드가 축출되었음을 알 수 있다.

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

## 논 그레이스풀 노드 셧다운 {#non-graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

전달한 명령이 kubelet에서 사용하는 금지 잠금 메커니즘(inhibitor locks mechanism)을 트리거하지 않거나, 
또는 사용자 오류(예: ShutdownGracePeriod 및 ShutdownGracePeriodCriticalPods가 제대로 설정되지 않음)로 인해 
kubelet의 노드 셧다운 관리자(Node Shutdown Mananger)가 
노드 셧다운 액션을 감지하지 못할 수 있다. 
자세한 내용은 위의 [그레이스풀 노드 셧다운](#graceful-node-shutdown) 섹션을 참조한다.

노드가 셧다운되었지만 kubelet의 노드 셧다운 관리자가 이를 감지하지 못하면, 
스테이트풀셋에 속한 파드는 셧다운된 노드에 '종료 중(terminating)' 상태로 고착되어 
다른 동작 중인 노드로 이전될 수 없다. 
이는 셧다운된 노드의 kubelet이 파드를 지울 수 없어서 
결국 스테이트풀셋이 동일한 이름으로 새 파드를 만들 수 없기 때문이다. 
만약 파드가 사용하던 볼륨이 있다면, 
볼륨어태치먼트(VolumeAttachment)도 기존의 셧다운된 노드에서 삭제되지 않아 
결국 파드가 사용하던 볼륨이 다른 동작 중인 노드에 연결(attach)될 수 없다. 
결과적으로, 스테이트풀셋에서 실행되는 애플리케이션이 제대로 작동하지 않는다. 
기존의 셧다운된 노드가 정상으로 돌아오지 못하면, 
이러한 파드는 셧다운된 노드에 '종료 중(terminating)' 상태로 영원히 고착될 것이다.

위와 같은 상황을 완화하기 위해, 사용자가 `node.kubernetes.io/out-of-service` 테인트를 `NoExecute` 또는 `NoSchedule` 값으로 
추가하여 노드를 서비스 불가(out-of-service) 상태로 표시할 수 있다. 
`kube-controller-manager`에 `NodeOutOfServiceVolumeDetach`[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
가 활성화되어 있고, 노드가 이 테인트에 의해 서비스 불가 상태로 표시되어 있는 경우, 
노드에 매치되는 톨러레이션이 없다면 노드 상의 파드는 강제로 삭제될 것이고, 
노드 상에서 종료되는 파드에 대한 볼륨 해제(detach) 작업은 즉시 수행될 것이다. 
이를 통해 서비스 불가 상태 노드의 파드가 빠르게 다른 노드에서 복구될 수 있다.

논 그레이스풀 셧다운 과정 동안, 파드는 다음의 두 단계로 종료된다.

1. 매치되는 `out-of-service` 톨러레이션이 없는 파드를 강제로 삭제한다.
2. 이러한 파드에 대한 볼륨 해제 작업을 즉시 수행한다.

{{< note >}}
- `node.kubernetes.io/out-of-service` 테인트를 추가하기 전에, 
  노드가 완전한 셧다운 또는 전원 꺼짐 상태에 있는지 
  (재시작 중인 것은 아닌지) 확인한다.
- 사용자가 서비스 불가 상태 테인트를 직접 추가한 것이기 때문에, 
  파드가 다른 노드로 옮겨졌고 셧다운 상태였던 노드가 복구된 것을 확인했다면 
  사용자가 서비스 불가 상태 테인트를 수동으로 제거해야 한다.
{{< /note >}}

### 파드 우선순위 기반 그레이스풀 노드 셧다운 {#pod-priority-graceful-node-shutdown}

{{< feature-state state="alpha" for_k8s_version="v1.23" >}}

그레이스풀 노드 셧다운 시 파드 셧다운 순서에 더 많은 유연성을 제공할 수 있도록, 
클러스터에 프라이어리티클래스(PriorityClass) 기능이 활성화되어 있으면 
그레이스풀 노드 셧다운 과정에서 파드의 프라이어리티클래스가 고려된다. 
이 기능으로 그레이스풀 노드 셧다운 시 파드가 종료되는 순서를 클러스터 관리자가 
[프라이어리티 클래스](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#프라이어리티클래스) 
기반으로 명시적으로 정할 수 있다.

위에서 기술된 것처럼, [그레이스풀 노드 셧다운](#graceful-node-shutdown) 기능은 파드를 
중요하지 않은(non-critical) 파드와 
중요한(critical) 파드 2단계(phase)로 구분하여 종료시킨다. 
셧다운 시 파드가 종료되는 순서를 명시적으로 더 상세하게 정해야 한다면, 
파드 우선순위 기반 그레이스풀 노드 셧다운을 사용할 수 있다.

그레이스풀 노드 셧다운 과정에서 파드 우선순위가 고려되기 때문에, 
그레이스풀 노드 셧다운이 여러 단계로 일어날 수 있으며, 
각 단계에서 특정 프라이어리티 클래스의 파드를 종료시킨다. 
정확한 단계와 단계별 셧다운 시간은 kubelet에 설정할 수 있다.

다음과 같이 클러스터에 커스텀 파드 
[프라이어리티 클래스](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/#프라이어리티클래스)가 있다고 
가정하자.

|파드 프라이어리티 클래스 이름|파드 프라이어리티 클래스 값|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

[kubelet 환경 설정](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) 안의
`shutdownGracePeriodByPodPriority` 설정은 다음과 같을 수 있다.

|파드 프라이어리티 클래스 값|종료 대기 시간|
|------------------------|---------------|
| 100000                 |10 seconds     |
| 10000                  |180 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |

이를 나타내는 kubelet 환경 설정 YAML은 다음과 같다.

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

위의 표에 의하면 `priority` 값이 100000 이상인 파드는 종료까지 10초만 주어지며, 
10000 이상 ~ 100000 미만이면 180초, 
1000 이상 ~ 10000 미만이면 120초가 주어진다.
마지막으로, 다른 모든 파드는 종료까지 60초가 주어질 것이다.

모든 클래스에 대해 값을 명시할 필요는 없다. 
예를 들어, 대신 다음과 같은 구성을 사용할 수도 있다.

|파드 프라이어리티 클래스 값|종료 대기 시간|
|------------------------|---------------|
| 100000                 |300 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |


위의 경우, `custom-class-b`에 속하는 파드와 `custom-class-c`에 속하는 파드는 
동일한 종료 대기 시간을 갖게 될 것이다.

특정 범위에 해당되는 파드가 없으면, 
kubelet은 해당 범위에 해당되는 파드를 위해 기다려 주지 않는다. 
대신, kubelet은 즉시 다음 프라이어리티 클래스 값 범위로 넘어간다.

기능이 활성화되어 있지만 환경 설정이 되어 있지 않으면, 
순서 지정 동작이 수행되지 않을 것이다.

이 기능을 사용하려면 `GracefulNodeShutdownBasedOnPodPriority` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 하고, 
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)의 
`ShutdownGracePeriodByPodPriority`를 
파드 프라이어리티 클래스 값과 각 값에 대한 종료 대기 시간을 명시하여 
지정해야 한다.

{{< note >}}
그레이스풀 노드 셧다운 과정에서 파드 프라이어리티를 고려하는 기능은 
쿠버네티스 v1.23에서 알파 기능으로 도입되었다. 
쿠버네티스 {{< skew currentVersion >}}에서 이 기능은 베타 상태이며 기본적으로 활성화되어 있다.
{{< /note >}}

`graceful_shutdown_start_time_seconds` 및 `graceful_shutdown_end_time_seconds` 메트릭은 
노드 셧다운을 모니터링하기 위해 kubelet 서브시스템에서 방출된다.

## 스왑(swap) 메모리 관리 {#swap-memory}

{{< feature-state state="alpha" for_k8s_version="v1.22" >}}

쿠버네티스 1.22 이전에는 노드가 스왑 메모리를 지원하지 않았다. 그리고 
kubelet은 노드에서 스왑을 발견하지 못한 경우 시작과 동시에 실패하도록 되어 있었다.
1.22부터는 스왑 메모리 지원을 노드 단위로 활성화할 수 있다.

노드에서 스왑을 활성화하려면, `NodeSwap` 기능 게이트가 kubelet에서
활성화되어야 하며, 명령줄 플래그 `--fail-swap-on` 또는
[구성 설정](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)에서 `failSwapOn`가
false로 지정되어야 한다.

{{< warning >}}
메모리 스왑 기능이 활성화되면, 시크릿 오브젝트의 내용과 같은 
tmpfs에 기록되었던 쿠버네티스 데이터가 디스크에 스왑될 수 있다.
{{< /warning >}}

사용자는 또한 선택적으로 `memorySwap.swapBehavior`를 구성할 수 있으며, 
이를 통해 노드가 스왑 메모리를 사용하는 방식을 명시한다. 예를 들면,

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

`swapBehavior`에 가용한 구성 옵션은 다음과 같다.

- `LimitedSwap`: 쿠버네티스 워크로드는 스왑을 사용할 수 있는 만큼으로
  제한된다. 쿠버네티스에 의해 관리되지 않는 노드의 워크로드는 여전히 스왑될 수 있다.
- `UnlimitedSwap`: 쿠버네티스 워크로드는 요청한 만큼 스왑 메모리를 사용할 수 있으며,
  시스템의 최대치까지 사용 가능하다.

만약 `memorySwap` 구성이 명시되지 않았고 기능 게이트가 활성화되어 있다면, 
kubelet은 `LimitedSwap` 설정과 같은 행동을
기본적으로 적용한다.

`LimitedSwap` 설정에 대한 행동은 노드가 ("cgroups"으로 알려진)
제어 그룹이 v1 또는 v2 중에서 무엇으로 동작하는가에 따라서 결정된다. 

- **cgroupsv1:** 쿠버네티스 워크로드는 메모리와 스왑의 조합을 사용할 수 있다.
  파드의 메모리 제한이 설정되어 있다면 가용 상한이 된다.
- **cgroupsv2:** 쿠버네티스 워크로드는 스왑 메모리를 사용할 수 없다.

테스트를 지원하고 피드벡을 제공하기 위한 정보는
[KEP-2400](https://github.com/kubernetes/enhancements/issues/2400) 및
[디자인 제안](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)에서 찾을 수 있다.

## {{% heading "whatsnext" %}}

* 노드를 구성하는 [컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에 대해 알아본다.
* [노드에 대한 API 정의](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)를 읽어본다.
* 아키텍처 디자인 문서의 [노드](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  섹션을 읽어본다.
* [테인트와 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을 읽어본다.
