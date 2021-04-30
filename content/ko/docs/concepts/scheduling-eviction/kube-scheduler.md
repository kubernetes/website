---
title: 쿠버네티스 스케줄러
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스에서 _스케줄링_ 은 {{< glossary_tooltip term_id="kubelet" >}}이
파드를 실행할 수 있도록 {{< glossary_tooltip text="파드" term_id="pod" >}}가
{{< glossary_tooltip text="노드" term_id="node" >}}에 적합한지 확인하는 것을 말한다.

<!-- body -->

## 스케줄링 개요 {#scheduling}

스케줄러는 노드가 할당되지 않은 새로 생성된 파드를 감시한다.
스케줄러가 발견한 모든 파드에 대해 스케줄러는 해당 파드가 실행될
최상의 노드를 찾는 책임을 진다. 스케줄러는
아래 설명된 스케줄링 원칙을 고려하여 이 배치 결정을
하게 된다.

파드가 특정 노드에 배치되는 이유를 이해하려고 하거나
사용자 정의된 스케줄러를 직접 구현하려는 경우 이
페이지를 통해서 스케줄링에 대해 배울 수 있을 것이다.

## kube-scheduler

[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)는
쿠버네티스의 기본 스케줄러이며 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}의
일부로 실행된다.
kube-scheduler는 원하거나 필요에 따라 자체 스케줄링 컴포넌트를
만들고 대신 사용할 수 있도록 설계되었다.

새로 생성된 모든 파드 또는 예약되지 않은 다른 파드에 대해 kube-scheduler는
실행할 최적의 노드를 선택한다. 그러나 파드의 모든 컨테이너에는
리소스에 대한 요구사항이 다르며 모든 파드에도
요구사항이 다르다. 따라서 기존 노드들은
특정 스케줄링 요구사항에 따라 필터링 되어야 한다.

클러스터에서 파드에 대한 스케줄링 요구사항을 충족하는 노드를
_실행 가능한(feasible)_ 노드라고 한다. 적합한 노드가 없으면 스케줄러가
배치할 수 있을 때까지 파드가 스케줄 되지 않은 상태로 유지된다.

스케줄러는 파드가 실행 가능한 노드를 찾은 다음 실행 가능한 노드의
점수를 측정하는 기능 셋을 수행하고 실행 가능한 노드 중에서 가장 높은 점수를
가진 노드를 선택하여 파드를 실행한다. 그런 다음 스케줄러는
_바인딩_ 이라는 프로세스에서 이 결정에 대해 API 서버에 알린다.

스케줄링 결정을 위해 고려해야 할 요소에는
개별 및 집단 리소스 요구사항, 하드웨어 / 소프트웨어 /
정책 제한조건, 어피니티 및 안티-어피니티 명세, 데이터
지역성(data locality), 워크로드 간 간섭 등이 포함된다.

### kube-scheduler에서 노드 선택 {#kube-scheduler-implementation}

kube-scheduler는 2단계 작업에서 파드에 대한 노드를 선택한다.

1. 필터링
1. 스코어링(scoring)

_필터링_ 단계는 파드를 스케줄링 할 수 있는 노드 셋을
찾는다. 예를 들어 PodFitsResources 필터는
후보 노드가 파드의 특정 리소스 요청을 충족시키기에 충분한 가용 리소스가
있는지 확인한다. 이 단계 다음에 노드 목록에는 적합한 노드들이
포함된다. 하나 이상의 노드가 포함된 경우가 종종 있을 것이다. 목록이 비어 있으면
해당 파드는 (아직) 스케줄링 될 수 없다.

_스코어링_ 단계에서 스케줄러는 목록에 남아있는 노드의 순위를 지정하여
가장 적합한 파드 배치를 선택한다. 스케줄러는 사용 중인 스코어링 규칙에 따라
이 점수를 기준으로 필터링에서 통과된 각 노드에 대해 점수를 지정한다.

마지막으로 kube-scheduler는 파드를 순위가 가장 높은 노드에 할당한다.
점수가 같은 노드가 두 개 이상인 경우 kube-scheduler는
이들 중 하나를 임의로 선택한다.

스케줄러의 필터링 및 스코어링 동작을 구성하는 데 지원되는 두 가지
방법이 있다.

1. [스케줄링 정책](/ko/docs/reference/scheduling/config/#프로파일)을 사용하면 필터링을 위한 _단정(Predicates)_ 및 스코어링을 위한 _우선순위(Priorities)_ 를 구성할 수 있다.
1. [스케줄링 프로파일](/ko/docs/reference/scheduling/config/#프로파일)을 사용하면 `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit` 등의 다른 스케줄링 단계를 구현하는 플러그인을 구성할 수 있다. 다른 프로파일을 실행하도록 kube-scheduler를 구성할 수도 있다.


## {{% heading "whatsnext" %}}

* [스케줄러 성능 튜닝](/ko/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)에 대해 읽기
* [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/workloads/pods/pod-topology-spread-constraints/)에 대해 읽기
* kube-scheduler의 [레퍼런스 문서](/docs/reference/command-line-tools-reference/kube-scheduler/) 읽기
* [kube-scheduler 구성(v1beta1)](/docs/reference/config-api/kube-scheduler-config.v1beta1/) 레퍼런스 읽기
* [멀티 스케줄러 구성하기](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)에 대해 배우기
* [토폴로지 관리 정책](/docs/tasks/administer-cluster/topology-manager/)에 대해 배우기
* [파드 오버헤드](/ko/docs/concepts/scheduling-eviction/pod-overhead/)에 대해 배우기
* 볼륨을 사용하는 파드의 스케줄링에 대해 배우기
  * [볼륨 토폴리지 지원](/ko/docs/concepts/storage/storage-classes/#볼륨-바인딩-모드)
  * [스토리지 용량 추적](/docs/concepts/storage/storage-capacity/)
  * [노드별 볼륨 한도](/ko/docs/concepts/storage/storage-limits/)
