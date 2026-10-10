---
content_type: reference
title: 노드 상태
weight: 80
---
<!-- overview -->

쿠버네티스에서 [노드](/ko/docs/concepts/architecture/nodes/) 상태는 클러스터 관리에서 중요한 부분이다. 이 문서에서는 건강하고 안정적인 클러스터를 보장하기 위해 노드 상태를 모니터링하고 관리하는 기초를 다룬다.

## 노드 상태 필드

노드의 상태는 다음의 정보를 포함한다:

* [주소](#addresses)
* [컨디션](#condition)
* [용량과 할당가능](#capacity)
* [정보](#info)

`kubectl`을 사용해서 노드의 상태와 다른 세부 정보를 볼 수 있다:

```shell
kubectl describe node <insert-node-name-here>
```

출력의 각 섹션은 아래에서 설명된다. 

## 주소 {#addresses}

이 필드의 용법은 클라우드 제공사업자 또는 베어메탈 구성에 따라 다양하다.

* HostName: 노드의 커널에 의해 알려진 호스트명이다. 
  `--hostname-override` 파라미터를 통해 치환될 수 있다.
* ExternalIP: 일반적으로 노드의 IP 주소는 외부로 라우트 가능 
  (클러스터 외부에서 이용 가능) 하다 .
* InternalIP: 일반적으로 노드의 IP 주소는 클러스터 내에서만 라우트 가능하다.


## 컨디션 {#condition}

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

## 용량과 할당가능 {#capacity}

노드 상에 사용 가능한 리소스를 나타낸다. 리소스에는 CPU, 메모리 그리고
노드 상으로 스케줄 되어질 수 있는 최대 파드 수가 있다.

용량 블록의 필드는 노드에 있는 리소스의 총량을 나타낸다.
할당가능 블록은 일반 파드에서 사용할 수 있는
노드의 리소스 양을 나타낸다.

노드에서
[컴퓨팅 리소스 예약](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)하는 방법을
배우는 동안 용량 및 할당가능 리소스에 대해 자세히 읽어보자.

## 정보 {#info}

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
